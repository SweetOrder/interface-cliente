import React, { useState } from "react";
import { Calendar as CalendarIcon, Clock, Home, MapPin, Plus } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Address, Order, OrderSummary } from "@/lib/types";
import { useCart } from "@/contexts/CartContext";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import AddressForm from "@/components/address/AddressForm";

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
  const [selectedAddressId, setSelectedAddressId] = useState<number | undefined>(undefined);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  
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
  
  // Carrega os endereços do usuário
  const loadAddresses = async () => {
    if (!userId) return;
    
    setIsLoading(true);
    try {
      const data = await apiRequest({
        url: `/api/users/${userId}/addresses`,
        method: "GET"
      });
      
      setAddresses(data);
      
      // Seleciona o endereço padrão, se existir
      const defaultAddress = data.find((addr: Address) => addr.isDefault);
      if (defaultAddress) {
        setSelectedAddressId(defaultAddress.id);
      } else if (data.length > 0) {
        setSelectedAddressId(data[0].id);
      }
    } catch (error) {
      console.error("Erro ao carregar endereços:", error);
      toast({
        title: "Erro ao carregar endereços",
        description: "Não foi possível carregar seus endereços. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  

  
  // Efeito para carregar endereços quando o diálogo é aberto
  React.useEffect(() => {
    if (open && userId) {
      loadAddresses();
    }
  }, [open, userId]);
  
  // Limpa o formulário quando o modal é fechado
  const handleDialogOpenChange = (open: boolean) => {
    if (!open) {
      setDate(undefined);
      setTimeSlot("");
      setNotes("");
      setShowAddressForm(false);
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
    
    if (!selectedAddressId && addresses.length > 0) {
      toast({
        title: "Endereço de entrega obrigatório",
        description: "Por favor, selecione um endereço para entrega.",
        variant: "destructive"
      });
      return;
    }
    
    if (addresses.length === 0 && !showAddressForm) {
      toast({
        title: "Endereço de entrega obrigatório",
        description: "Por favor, adicione um endereço para entrega.",
        variant: "destructive"
      });
      setShowAddressForm(true);
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
      addressId: selectedAddressId,
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
      // Número de telefone da confeitaria (formato internacional com código do país)
      window.open(`https://wa.me/+5511987654321?text=${encodeURIComponent(whatsappMessage)}`, '_blank');
      
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
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium">Endereço de entrega</h3>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowAddressForm(!showAddressForm)}
                className="h-8 px-2 text-xs"
              >
                {showAddressForm ? (
                  <span className="flex items-center">
                    <MapPin className="mr-1 h-3 w-3" />
                    Selecionar existente
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Plus className="mr-1 h-3 w-3" />
                    Novo endereço
                  </span>
                )}
              </Button>
            </div>
            
            {showAddressForm ? (
              <div className="border p-3 rounded-md">
                <AddressForm
                  userId={userId || 0}
                  onSuccess={() => {
                    loadAddresses();
                    setShowAddressForm(false);
                  }}
                  onCancel={() => setShowAddressForm(false)}
                />
              </div>
            ) : (
              <>
                {isLoading ? (
                  <div className="flex justify-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#f74ea7]"></div>
                  </div>
                ) : addresses.length === 0 ? (
                  <div className="text-center py-4 border rounded-md">
                    <Home className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500 mb-2">Nenhum endereço cadastrado</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setShowAddressForm(true)}
                      className="mx-auto"
                    >
                      <Plus className="mr-1 h-3 w-3" />
                      Adicionar endereço
                    </Button>
                  </div>
                ) : (
                  <RadioGroup 
                    value={selectedAddressId?.toString() || ""} 
                    onValueChange={(value) => setSelectedAddressId(parseInt(value))}
                    className="space-y-2"
                  >
                    <ScrollArea className="h-[150px] rounded-md border p-2">
                      {addresses.map((address) => (
                        <div key={address.id} className="flex items-start space-x-2 py-2">
                          <RadioGroupItem value={address.id.toString()} id={`address-${address.id}`} className="mt-1" />
                          <div className="grid gap-1.5 leading-none">
                            <Label htmlFor={`address-${address.id}`} className="font-medium">
                              {address.street}, {address.number}
                              {address.isDefault && (
                                <span className="ml-2 text-xs bg-[#f74ea7]/10 text-[#f74ea7] px-1.5 py-0.5 rounded">
                                  Padrão
                                </span>
                              )}
                            </Label>
                            <div className="text-sm text-gray-500">
                              {address.complement && <div>{address.complement}</div>}
                              <div>
                                {address.neighborhood}, {address.city}/{address.state}
                              </div>
                              <div>CEP: {address.zipcode}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </ScrollArea>
                  </RadioGroup>
                )}
              </>
            )}
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
            disabled={!date || !timeSlot || isSubmitting || (addresses.length > 0 && !selectedAddressId) || (addresses.length === 0 && !showAddressForm)}
            className="bg-[#f74ea7] hover:bg-[#f74ea7]/90"
          >
            {isSubmitting ? "Processando..." : "Confirmar Pedido"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}