import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Trash2, Minus, Plus, ShoppingBag, X } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { formatCurrency } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export default function CartDrawer() {
  const { 
    items, 
    isCartOpen, 
    toggleCartOpen, 
    updateItemQuantity, 
    removeItem,
    clearCart
  } = useCart();
  const { toast } = useToast();
  
  const [deliveryDate, setDeliveryDate] = useState("");
  const [notes, setNotes] = useState("");
  
  // Calculate totals
  const subtotal = items.reduce((total, item) => {
    const itemPrice = item.selectedSizeOption?.price || item.product.price;
    return total + (itemPrice * item.quantity);
  }, 0);
  
  const handleFinishOrder = () => {
    if (items.length === 0) {
      toast({
        title: "Carrinho vazio",
        description: "Adicione produtos ao seu pedido antes de finalizar.",
        variant: "destructive"
      });
      return;
    }
    
    if (!deliveryDate) {
      toast({
        title: "Data de entrega necessária",
        description: "Por favor, informe a data de entrega desejada.",
        variant: "destructive"
      });
      return;
    }
    
    // Here you would normally submit the order to the API
    // For this implementation, we'll just show a success message
    
    toast({
      title: "Pedido finalizado com sucesso!",
      description: "Você será contatado para confirmar os detalhes.",
      variant: "default"
    });
    
    // Clear the cart and close the drawer
    clearCart();
    toggleCartOpen();
  };
  
  const handleWhatsAppOrder = () => {
    if (items.length === 0) {
      toast({
        title: "Carrinho vazio",
        description: "Adicione produtos ao seu pedido antes de finalizar.",
        variant: "destructive"
      });
      return;
    }
    
    if (!deliveryDate) {
      toast({
        title: "Data de entrega necessária",
        description: "Por favor, informe a data de entrega desejada.",
        variant: "destructive"
      });
      return;
    }
    
    // Prepare WhatsApp message
    let message = "Olá! Gostaria de fazer um pedido:\n\n";
    
    items.forEach(item => {
      const itemPrice = item.selectedSizeOption?.price || item.product.price;
      message += `• ${item.quantity}x ${item.product.name}`;
      
      if (item.size) {
        message += ` (${item.size})`;
      }
      
      message += ` - ${formatCurrency(itemPrice * item.quantity)}`;
      
      if (item.notes) {
        message += `\n  Obs: ${item.notes}`;
      }
      
      message += "\n";
    });
    
    message += `\nTotal: ${formatCurrency(subtotal)}`;
    message += `\nData de entrega: ${deliveryDate}`;
    
    if (notes) {
      message += `\nObservações gerais: ${notes}`;
    }
    
    // Encode the message for WhatsApp URL
    const encodedMessage = encodeURIComponent(message);
    
    // Open WhatsApp in a new tab
    window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
    
    // Clear the cart and close the drawer
    clearCart();
    toggleCartOpen();
  };
  
  return (
    <Sheet open={isCartOpen} onOpenChange={toggleCartOpen}>
      <SheetContent className="w-full sm:max-w-md p-0 flex flex-col h-full">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <SheetHeader className="text-left">
            <SheetTitle className="font-montserrat text-xl font-bold">Seu Pedido</SheetTitle>
          </SheetHeader>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleCartOpen} 
            className="h-8 w-8 rounded-full hover:bg-[#f4f4f4]"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="overflow-y-auto flex-grow p-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag className="h-12 w-12 text-gray-300 mb-2" />
              <p className="text-lg font-medium text-gray-500">Seu carrinho está vazio</p>
              <p className="text-sm text-gray-400 mt-1 mb-4">Adicione produtos para fazer seu pedido</p>
              <Button 
                onClick={toggleCartOpen}
                className="bg-[#f74ea7] hover:bg-[#e63d96] text-white"
              >
                Explorar produtos
              </Button>
            </div>
          ) : (
            <>
              {items.map((item, index) => {
                const itemPrice = item.selectedSizeOption?.price || item.product.price;
                
                return (
                  <div key={`${item.product.id}-${item.size || 'default'}-${index}`} className="flex items-center py-3 border-b border-gray-200">
                    <img 
                      src={item.product.imageUrl} 
                      alt={item.product.name} 
                      className="w-16 h-16 object-cover rounded-md"
                    />
                    <div className="ml-3 flex-grow">
                      <h4 className="font-montserrat font-semibold text-sm">{item.product.name}</h4>
                      {item.size && (
                        <p className="text-xs text-[#555555]">Tamanho: {item.size}</p>
                      )}
                      <div className="flex items-center mt-1">
                        <Button 
                          onClick={() => updateItemQuantity(index, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          variant="outline" 
                          size="icon"
                          className="w-5 h-5 flex items-center justify-center text-[#333333] bg-[#f4f4f4] rounded p-0 border-0"
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="mx-2 text-sm font-semibold">{item.quantity}</span>
                        <Button 
                          onClick={() => updateItemQuantity(index, item.quantity + 1)}
                          variant="outline" 
                          size="icon"
                          className="w-5 h-5 flex items-center justify-center text-[#333333] bg-[#f4f4f4] rounded p-0 border-0"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-[#f74ea7]">{formatCurrency(itemPrice * item.quantity)}</p>
                      <Button 
                        onClick={() => removeItem(index)}
                        variant="ghost" 
                        size="sm" 
                        className="text-[#ff3b30] text-xs mt-2 h-auto py-0 px-1"
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Remover
                      </Button>
                    </div>
                  </div>
                );
              })}
              
              <div className="mt-4">
                <label className="block font-montserrat font-semibold text-sm mb-2">Data de entrega*</label>
                <input 
                  type="date" 
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2 text-sm mb-4"
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
                
                <label className="block font-montserrat font-semibold text-sm mb-2">Observações gerais</label>
                <textarea 
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Instruções para entrega, acessos, etc."
                  className="w-full border border-gray-300 rounded-md p-3 text-sm resize-none"
                  rows={2}
                />
              </div>
            </>
          )}
        </div>
        
        {items.length > 0 && (
          <div className="p-4 bg-[#f4f4f4]">
            <div className="mb-4">
              <div className="flex justify-between mb-2">
                <span className="text-[#555555]">Subtotal</span>
                <span className="font-semibold">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-[#f74ea7]">{formatCurrency(subtotal)}</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <Button 
                onClick={handleFinishOrder}
                className="w-full py-3 bg-[#f74ea7] hover:bg-[#e63d96] text-white font-semibold"
              >
                Finalizar Pedido
              </Button>
              <Button 
                onClick={handleWhatsAppOrder}
                variant="outline"
                className="w-full py-3 bg-white border-[#f74ea7] text-[#f74ea7] font-semibold hover:bg-[#f74ea7]/10"
              >
                <WhatsAppIcon className="mr-2 h-4 w-4" />
                Confirmar via WhatsApp
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

// WhatsApp icon component
function WhatsAppIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path
        d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
      />
    </svg>
  );
}
