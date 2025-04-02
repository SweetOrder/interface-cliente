import { useState } from "react";
import { ShoppingCart, Trash2, Minus, Plus, X, Calendar, Clock, Loader2 } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCart } from "@/contexts/CartContext";
import { formatCurrency } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import CheckoutDialog from "./CheckoutDialog";
import { useToast, toast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface CartDrawerProps {
  userId?: number;
}

export default function CartDrawer({ userId }: CartDrawerProps) {
  const { items, toggleCartOpen, isCartOpen, updateItemQuantity, removeItem, clearCart } = useCart();
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  
  // Estados para finalização do pedido
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [timeSlot, setTimeSlot] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  // const { toast } = useToast(); // Já importamos o toast diretamente
  
  // Calcula o total do pedido
  const total = items.reduce((sum, item) => {
    const price = item.selectedSizeOption ? item.selectedSizeOption.price : item.product.price;
    return sum + (price * item.quantity);
  }, 0);
  
  // Atualiza a quantidade de um item
  const handleUpdateQuantity = (index: number, newQuantity: number) => {
    if (newQuantity > 0 && newQuantity <= 50) {
      updateItemQuantity(index, newQuantity);
    }
  };
  
  // Adiciona notas a um item
  const handleNotesChange = (index: number, notes: string) => {
    const updatedItems = [...items];
    updatedItems[index] = {
      ...updatedItems[index],
      notes
    };
    // Como não existe um método específico para atualizar as notas,
    // usamos o fato de que os itens são passados por referência e recriamos o item
    removeItem(index);
    useCart().addToCart(updatedItems[index]);
  };
  
  // Limpa o formulário quando o modal é fechado
  const resetCheckoutForm = () => {
    setDate(undefined);
    setTimeSlot("");
    setNotes("");
    setShowCheckoutForm(false);
  };
  
  // Abre o formulário de checkout no drawer
  const handleCheckout = () => {
    if (items.length === 0) return;
    setShowCheckoutForm(true);
  };
  
  // Voltar para a visualização do carrinho
  const handleBackToCart = () => {
    setShowCheckoutForm(false);
  };
  
  // Formata a data selecionada para exibição
  const formattedDate = date ? format(date, "PPP", { locale: ptBR }) : "Selecione uma data";
  
  // Gera horários disponíveis para entrega (das 08:00 às 18:00, a cada 30 minutos)
  const timeSlots = Array.from({ length: 21 }, (_, i) => {
    const hour = Math.floor(i / 2) + 8;
    const minute = (i % 2) * 30;
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  });
  
  // Cria e finaliza o pedido
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
    const orderData = {
      userId,
      totalAmount: total,
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
      
      // Fecha o drawer
      toggleCartOpen();
      resetCheckoutForm();
      
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
  const generateWhatsAppMessage = (order: any, orderId: number) => {
    const dateFormatted = format(new Date(order.deliveryDate), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
    
    let message = `*Novo Pedido #${orderId}*\n\n`;
    message += `📅 *Data de Entrega:* ${dateFormatted}\n\n`;
    message += `*Itens do Pedido:*\n`;
    
    order.items.forEach((item: any, index: number) => {
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
    <>
      <Sheet open={isCartOpen} onOpenChange={(open) => {
        // Importante: Só alteramos o estado quando for para fechar
        // Para abrir, deixamos o controle com o toggleCartOpen
        if (!open) {
          resetCheckoutForm();
          toggleCartOpen();
        }
      }}>
        <SheetContent className="w-[85vw] max-w-md sm:max-w-lg overflow-y-auto">
          <SheetHeader className="pb-4">
            <SheetTitle className="flex items-center">
              {showCheckoutForm ? (
                <>
                  <button 
                    onClick={handleBackToCart}
                    className="mr-2 p-1 rounded-full hover:bg-gray-100"
                  >
                    <X className="h-5 w-5" />
                  </button>
                  Finalizar Pedido
                </>
              ) : (
                <>
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Carrinho de Compras
                </>
              )}
            </SheetTitle>
          </SheetHeader>
          
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[60vh]">
              <ShoppingCart className="h-16 w-16 text-gray-300 mb-4" />
              <p className="text-gray-500 text-center">Seu carrinho está vazio</p>
              <p className="text-gray-400 text-sm text-center mt-2">
                Adicione produtos para continuar com a compra
              </p>
              <Button
                className="mt-6 bg-[#f74ea7] hover:bg-[#f74ea7]/90"
                onClick={toggleCartOpen}
              >
                Explorar Produtos
              </Button>
            </div>
          ) : (
            <>
              {!showCheckoutForm ? (
                // Visualização do carrinho
                <div className="flex flex-col h-full gap-6">
                  <div className="flex-1 overflow-y-auto">
                    <ul className="space-y-5">
                      {items.map((item, index) => {
                        const price = item.selectedSizeOption 
                          ? item.selectedSizeOption.price 
                          : item.product.price;
                        
                        return (
                          <li key={`${item.product.id}-${item.selectedSizeOption?.name || 'default'}-${index}`} className="relative">
                            <div className="flex gap-4">
                              <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                <img
                                  src={item.product.imageUrl}
                                  alt={item.product.name}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              
                              <div className="flex flex-1 flex-col">
                                <div className="flex justify-between">
                                  <h3 className="text-base font-medium">{item.product.name}</h3>
                                  <p className="text-sm font-medium text-[#f74ea7]">
                                    {formatCurrency(price * item.quantity)}
                                  </p>
                                </div>
                                
                                {item.selectedSizeOption && (
                                  <p className="text-xs text-gray-500 mt-1">
                                    Tamanho: {item.selectedSizeOption.name}
                                  </p>
                                )}
                                
                                <div className="mt-2 flex items-center justify-between">
                                  <div className="flex items-center border rounded-md">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8 rounded-none"
                                      onClick={() => handleUpdateQuantity(index, item.quantity - 1)}
                                    >
                                      <Minus className="h-3 w-3" />
                                    </Button>
                                    <span className="w-8 text-center text-sm">
                                      {item.quantity}
                                    </span>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8 rounded-none"
                                      onClick={() => handleUpdateQuantity(index, item.quantity + 1)}
                                    >
                                      <Plus className="h-3 w-3" />
                                    </Button>
                                  </div>
                                  
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 rounded-full text-gray-500 hover:text-red-500"
                                    onClick={() => removeItem(index)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                            
                            <div className="mt-3">
                              <Label htmlFor={`notes-${index}`} className="text-xs text-gray-500">
                                Observações
                              </Label>
                              <Input
                                id={`notes-${index}`}
                                value={item.notes || ""}
                                onChange={(e) => handleNotesChange(index, e.target.value)}
                                placeholder="Ex: Sem cobertura, Sem nozes, etc."
                                className="mt-1 text-sm h-9"
                              />
                            </div>
                            
                            <Separator className="mt-4" />
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-base font-medium">Total</span>
                      <span className="text-lg font-semibold text-[#f74ea7]">
                        {formatCurrency(total)}
                      </span>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={clearCart}
                      >
                        Limpar
                      </Button>
                      <Button
                        className="flex-1 bg-[#f74ea7] hover:bg-[#f74ea7]/90"
                        onClick={handleCheckout}
                      >
                        Finalizar Compra
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                // Formulário de checkout
                <div className="flex flex-col h-full gap-6">
                  <div className="flex-1 space-y-6">
                    {/* Resumo do pedido */}
                    <div className="bg-gray-50 p-4 rounded-md">
                      <h3 className="text-sm font-medium mb-2">Resumo do Pedido</h3>
                      <div className="text-sm">
                        <div className="flex justify-between mb-1">
                          <span>Itens ({items.reduce((sum, item) => sum + item.quantity, 0)})</span>
                          <span>{formatCurrency(total)}</span>
                        </div>
                      </div>
                      <Separator className="my-2" />
                      <div className="flex justify-between font-medium">
                        <span>Total</span>
                        <span className="text-[#f74ea7]">{formatCurrency(total)}</span>
                      </div>
                    </div>
                    
                    {/* Seleção de data */}
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Data de entrega</h3>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                          >
                            <Calendar className="mr-2 h-4 w-4" />
                            {formattedDate}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <CalendarComponent
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
                    
                    {/* Seleção de horário */}
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
                    
                    {/* Observações adicionais */}
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
                  
                  {/* Botões de ação */}
                  <div className="space-y-3">
                    <Button
                      className="w-full bg-[#f74ea7] hover:bg-[#f74ea7]/90"
                      onClick={handleCreateOrder}
                      disabled={!date || !timeSlot || isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processando...
                        </>
                      ) : (
                        "Confirmar Pedido"
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={handleBackToCart}
                    >
                      Voltar ao Carrinho
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}