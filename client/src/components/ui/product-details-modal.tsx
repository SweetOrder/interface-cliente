import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { CartItem, Product, SizeOption } from "@/lib/types";
import { Heart, Minus, Plus, X } from "lucide-react";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useCart } from "@/contexts/CartContext";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/lib/utils";

interface ProductDetailsModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductDetailsModal({ 
  product, 
  isOpen,
  onClose
}: ProductDetailsModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const { favoriteIds, toggleFavorite } = useFavorites();
  const { addToCart } = useCart();
  
  // Reset state when modal opens with a new product
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
    
    if (open && product) {
      setQuantity(1);
      setNotes("");
      
      // Set default size if available
      if (product.hasSizeOptions && product.sizeOptions.length > 0) {
        setSelectedSize(product.sizeOptions[0].name);
      } else {
        setSelectedSize(null);
      }
    }
  };
  
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  
  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };
  
  const handleAddToCart = () => {
    if (!product) return;
    
    let selectedSizeOption: SizeOption | undefined;
    
    if (product.hasSizeOptions && selectedSize) {
      selectedSizeOption = product.sizeOptions.find(size => size.name === selectedSize);
    }
    
    const cartItem: CartItem = {
      product,
      quantity,
      size: selectedSize || undefined,
      notes: notes || undefined,
      selectedSizeOption
    };
    
    addToCart(cartItem);
    onClose();
  };
  
  if (!product) return null;
  
  const isFavorite = favoriteIds.includes(product.id);
  
  // Calculate price based on selected size or default product price
  const price = product.hasSizeOptions && selectedSize
    ? (product.sizeOptions.find(size => size.name === selectedSize)?.price || product.price)
    : product.price;
  
  const totalPrice = price * quantity;
  
  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md p-0 overflow-auto max-h-[90vh]">
        <div className="relative">
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            className="w-full h-56 object-cover"
          />
          <Button
            onClick={onClose}
            variant="ghost"
            className="absolute top-3 right-3 bg-white rounded-full w-8 h-8 p-0 flex items-center justify-center shadow-md hover:bg-gray-100"
          >
            <X className="h-4 w-4 text-[#333333]" />
          </Button>
          <Button
            onClick={() => toggleFavorite(product.id)}
            variant="ghost"
            className="absolute top-3 left-3 bg-white rounded-full w-8 h-8 p-0 flex items-center justify-center shadow-md hover:bg-gray-100"
          >
            <Heart 
              className={`h-4 w-4 ${isFavorite ? 'text-[#f74ea7] fill-[#f74ea7]' : 'text-[#333333]'}`} 
            />
          </Button>
        </div>
        
        <div className="p-5">
          <DialogHeader>
            <DialogTitle className="font-playfair text-xl font-bold">{product.name}</DialogTitle>
          </DialogHeader>
          
          <p className="text-[#555555] mb-4">{product.description}</p>
          
          {product.hasSizeOptions && (
            <div className="mb-5">
              <h4 className="font-montserrat font-semibold text-sm mb-2">Escolha o tamanho:</h4>
              <RadioGroup
                value={selectedSize || ''}
                onValueChange={setSelectedSize}
                className="grid grid-cols-3 gap-2"
              >
                {product.sizeOptions.map((size) => (
                  <div key={size.name} className="relative">
                    <RadioGroupItem
                      value={size.name}
                      id={`size-${size.name}`}
                      className="peer absolute opacity-0"
                    />
                    <Label
                      htmlFor={`size-${size.name}`}
                      className="text-center border border-gray-300 rounded-md py-2 px-3 peer-data-[state=checked]:border-[#f74ea7] peer-data-[state=checked]:bg-[#f74ea7]/10 transition-colors cursor-pointer block"
                    >
                      <span className="text-sm font-medium">{size.name}</span>
                      <p className="text-xs text-[#555555]">{size.description}</p>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          )}
          
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <h4 className="font-montserrat font-semibold text-sm">Observações:</h4>
              <span className="text-xs text-[#555555]">Opcional</span>
            </div>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: Sem amendoim, mensagem para o bolo, etc."
              className="w-full border border-gray-300 rounded-md p-3 text-sm resize-none"
              rows={2}
            />
          </div>
          
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-xs text-[#555555]">Valor</span>
              <p className="font-bold text-xl text-[#f74ea7]">{formatCurrency(totalPrice)}</p>
            </div>
            
            <div className="flex items-center border border-gray-300 rounded-md">
              <Button
                onClick={decreaseQuantity}
                variant="ghost"
                className="w-8 h-8 p-0 flex items-center justify-center text-[#333333] hover:bg-gray-100"
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="w-8 text-center font-semibold">{quantity}</span>
              <Button
                onClick={increaseQuantity}
                variant="ghost"
                className="w-8 h-8 p-0 flex items-center justify-center text-[#333333] hover:bg-gray-100"
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>
          
          <Button
            onClick={handleAddToCart}
            className="w-full py-3 bg-[#f74ea7] hover:bg-[#e63d96] text-white font-semibold rounded-md"
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Adicionar ao pedido
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Shopping cart icon component
function ShoppingCart(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="8" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
    </svg>
  );
}
