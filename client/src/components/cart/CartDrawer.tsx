import { useState } from "react";
import { ShoppingCart, Trash2, Minus, Plus, X } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/contexts/CartContext";
import { formatCurrency } from "@/lib/utils";
import CheckoutDialog from "./CheckoutDialog";

interface CartDrawerProps {
  userId?: number;
}

export default function CartDrawer({ userId }: CartDrawerProps) {
  const { items, toggleCartOpen, isCartOpen, updateItemQuantity, removeItem, clearCart } = useCart();
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  
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
  
  // Abre o modal de checkout
  const handleCheckout = () => {
    if (items.length === 0) return;
    setCheckoutOpen(true);
  };
  
  return (
    <>
      <Sheet open={isCartOpen} onOpenChange={toggleCartOpen}>
        <SheetContent className="w-[85vw] max-w-md sm:max-w-lg">
          <SheetHeader className="pb-4">
            <SheetTitle className="flex items-center">
              <ShoppingCart className="mr-2 h-5 w-5" />
              Carrinho de Compras
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
          )}
        </SheetContent>
      </Sheet>
      
      <CheckoutDialog
        open={checkoutOpen}
        onOpenChange={setCheckoutOpen}
        userId={userId}
      />
    </>
  );
}