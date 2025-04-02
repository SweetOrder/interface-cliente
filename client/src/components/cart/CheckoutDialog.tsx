import { useState } from "react";
import { Calendar as CalendarIcon, Clock, X } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Order, OrderSummary } from "@/lib/types";
import { useCart } from "@/contexts/CartContext";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface CheckoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId?: number;
}

export default function CheckoutDialog({ open, onOpenChange, userId }: CheckoutDialogProps) {
  const { items, clearCart } = useCart();
  const { toast } = useToast();
  
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [timeSlot, setTimeSlot] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Calcula o total do pedido
  const totalAmount = items.reduce((total, item) => {
    const itemPrice = item.selectedSizeOption ? item.selectedSizeOption.price : item.product.price;
    return total + itemPrice * item.quantity;
  }, 0);
  
  // Formata a data selecionada para exibição
  const formattedDate = date ? format(date, "PPP", { locale: ptBR }) : "Selecione uma data";
  
  // Gera horários disponíveis para entrega (das 08:00 às 18:00, a cada 30 minutos)
  const timeSlots = Array.from({ length: 21 }, (_, i) => {
    const hour = Math.floor(i / 2) + 8;
    const minute = (i % 2) * 30;
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  });
  
  // Limpa o formulário quando o modal é fechado
  const handleDialogOpenChange = (open: boolean) => {
    if (!open) {
      setDate(undefined);
      setTimeSlot("");
      setNotes("");
    }
    onOpenChange(open);
  };
  
  // Manipula a criação do pedido
  const handleCreateOrder = async () => {
    if (!userId) {
      toast({
        title: "Erro ao finalizar pedido",
        description: "Você precisa estar logado para finalizar o pedido.",
        variant: "destructive"
      });
      return;
    }
    
    if (!date) {
      toast({
        title: "Data de entrega obrigatória",
        description: "Por favor, selecione uma data para entrega.",
        variant: "destructive"
      });
      return;
    }
    
    if (!timeSlot) {
      toast({
        title: "Horário de entrega obrigatório",
        description: "Por favor, selecione um horário para entrega.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Formata a data e horário selecionados
    const deliveryDate = `${format(date, "yyyy-MM-dd")}T${timeSlot}:00`;
    
    // Prepara o objeto de pedido
    const orderData: OrderSummary = {
      userId,
      totalAmount,
      deliveryDate,
      notes: notes.trim() || undefined,
      items: items.map(item => ({
        productId: item.product.id,
        quantity: item.quantity,
        price: item.selectedSizeOption ? item.selectedSizeOption.price : item.product.price,
        size: item.selectedSizeOption ? item.selectedSizeOption.name : undefined,
        notes: item.notes
      }))
    };
    
    try {
      // Envia o pedido para a API
      const response = await apiRequest({
        url: "/api/orders",
        method: "POST",
        data: orderData
      });
      
      const order = response;
      
      // Limpa o carrinho
      clearCart();
      
      // Mostra mensagem de sucesso
      toast({
        title: "Pedido realizado com sucesso!",
        description: `Seu pedido #${order.id} foi recebido e será preparado para entrega.`,
      });
      
      // Fecha o modal
      handleDialogOpenChange(false);
      
      // Abre WhatsApp com as informações do pedido
      const whatsappMessage = generateWhatsAppMessage(orderData, order.id);
      window.open(`https://wa.me/+5511999999999?text=${encodeURIComponent(whatsappMessage)}`, '_blank');
      
    } catch (error) {
      console.error("Erro ao criar pedido:", error);
      toast({
        title: "Erro ao finalizar pedido",
        description: "Ocorreu um erro ao processar seu pedido. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Gera a mensagem para o WhatsApp
  const generateWhatsAppMessage = (order: OrderSummary, orderId: number) => {
    const dateFormatted = format(new Date(order.deliveryDate), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
    
    let message = `*Novo Pedido #${orderId}*\n\n`;
    message += `📅 *Data de Entrega:* ${dateFormatted}\n\n`;
    message += `*Itens do Pedido:*\n`;
    
    order.items.forEach((item, index) => {
      const product = items.find(cartItem => cartItem.product.id === item.productId)?.product;
      if (product) {
        message += `${index + 1}. ${product.name} ${item.size ? `(${item.size})` : ''} - ${item.quantity}x R$ ${item.price.toFixed(2)} = R$ ${(item.quantity * item.price).toFixed(2)}\n`;
        if (item.notes) {
          message += `   Obs: ${item.notes}\n`;
        }
      }
    });
    
    message += `\n*Total:* R$ ${order.totalAmount.toFixed(2)}\n\n`;
    
    if (order.notes) {
      message += `*Observações:* ${order.notes}\n\n`;
    }
    
    message += "Obrigado por comprar conosco! 😊";
    
    return message;
  };
  
  return (
    <Dialog open={open} onOpenChange={handleDialogOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Finalizar Pedido</DialogTitle>
          <DialogDescription>
            Escolha a data e hora para entrega do seu pedido
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Data de entrega</h3>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formattedDate}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={(date) => date < new Date()}
                  initialFocus
                  locale={ptBR}
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Horário de entrega</h3>
            <Select value={timeSlot} onValueChange={setTimeSlot}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um horário" />
              </SelectTrigger>
              <SelectContent>
                {timeSlots.map((time) => (
                  <SelectItem key={time} value={time}>
                    <div className="flex items-center">
                      <Clock className="mr-2 h-4 w-4" />
                      {time}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Observações (opcional)</h3>
            <Textarea 
              placeholder="Instruções especiais para entrega, informações adicionais, etc."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => handleDialogOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            onClick={handleCreateOrder}
            disabled={!date || !timeSlot || isSubmitting}
            className="bg-[#f74ea7] hover:bg-[#f74ea7]/90"
          >
            {isSubmitting ? "Processando..." : "Confirmar Pedido"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}