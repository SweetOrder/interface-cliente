import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Product } from "@/lib/types";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useCart } from "@/contexts/CartContext";
import { Heart, Minus, Plus, ArrowLeft, ShoppingCart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/lib/utils";

interface ProductDetailsProps {
  id: number;
}

export default function ProductDetails({ id }: ProductDetailsProps) {
  const [_, navigate] = useLocation();
  const { favoriteIds, toggleFavorite } = useFavorites();
  const { addToCart, toggleCartOpen } = useCart();
  const { toast } = useToast();
  
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  
  // Fetch product details
  const { data: product, isLoading } = useQuery<Product>({
    queryKey: [`/api/products/${id}`],
    onSuccess: (data) => {
      // Set default size if available
      if (data.hasSizeOptions && data.sizeOptions.length > 0) {
        setSelectedSize(data.sizeOptions[0].name);
      }
    }
  });
  
  const isFavorite = product ? favoriteIds.includes(product.id) : false;
  
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
    
    let selectedSizeOption = undefined;
    
    if (product.hasSizeOptions && selectedSize) {
      selectedSizeOption = product.sizeOptions.find(size => size.name === selectedSize);
    }
    
    addToCart({
      product,
      quantity,
      size: selectedSize || undefined,
      notes: notes || undefined,
      selectedSizeOption
    });
    
    // Mostrar toast de confirmação
    toast({
      title: "Produto adicionado",
      description: `${product.name} foi adicionado ao seu carrinho.`,
      duration: 3000,
    });
    
    // Abrir o carrinho automaticamente
    toggleCartOpen();
    
    // Navegar para a página de produtos
    navigate("/products");
  };
  
  // Calculate price based on selected size or default product price
  const price = product && product.hasSizeOptions && selectedSize
    ? (product.sizeOptions.find(size => size.name === selectedSize)?.price || product.price)
    : product?.price || 0;
  
  const totalPrice = price * quantity;
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center mb-4">
          <div className="animate-pulse bg-gray-200 h-8 w-24 rounded"></div>
        </div>
        <div className="md:flex gap-6">
          <div className="md:w-1/2 animate-pulse bg-gray-200 h-80 rounded-lg mb-4 md:mb-0"></div>
          <div className="md:w-1/2 space-y-4">
            <div className="animate-pulse bg-gray-200 h-10 w-3/4 rounded"></div>
            <div className="animate-pulse bg-gray-200 h-24 rounded"></div>
            <div className="animate-pulse bg-gray-200 h-12 rounded"></div>
            <div className="animate-pulse bg-gray-200 h-12 rounded"></div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className="container mx-auto px-4 py-6">
        <h1 className="font-montserrat text-2xl font-bold mb-4">Produto não encontrado</h1>
        <Button 
          onClick={() => navigate('/products')}
          className="bg-[#f74ea7] hover:bg-[#e63d96] text-white"
        >
          Voltar para produtos
        </Button>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-6">
      <Button 
        onClick={() => navigate('/products')}
        variant="ghost" 
        className="mb-4 hover:bg-transparent hover:text-[#f74ea7] p-0 flex items-center text-[#555555]"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Voltar para produtos
      </Button>
      
      <div className="md:flex gap-6">
        <div className="md:w-1/2 mb-6 md:mb-0">
          <div className="relative">
            <img 
              src={product.imageUrl} 
              alt={product.name} 
              className="w-full rounded-lg object-cover aspect-square"
            />
            <Button
              onClick={() => toggleFavorite(product.id)}
              variant="secondary"
              size="icon"
              className="absolute top-4 right-4 bg-white rounded-full w-10 h-10 shadow-md hover:bg-gray-100"
            >
              <Heart 
                className={`h-5 w-5 ${isFavorite ? 'text-[#f74ea7] fill-[#f74ea7]' : 'text-[#333333]'}`} 
              />
            </Button>
          </div>
        </div>
        
        <div className="md:w-1/2">
          <h1 className="font-montserrat text-3xl font-bold mb-3">{product.name}</h1>
          <p className="text-[#555555] mb-6">{product.description}</p>
          
          {product.hasSizeOptions && (
            <div className="mb-6">
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
                      <p className="text-xs font-semibold text-[#f74ea7] mt-1">{formatCurrency(size.price)}</p>
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
              rows={3}
            />
          </div>
          
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-xs text-[#555555]">Valor</span>
              <p className="font-bold text-2xl text-[#f74ea7]">{formatCurrency(totalPrice)}</p>
            </div>
            
            <div className="flex items-center border border-gray-300 rounded-md">
              <Button
                onClick={decreaseQuantity}
                variant="ghost"
                className="w-10 h-10 p-0 flex items-center justify-center text-[#333333] hover:bg-gray-100"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-10 text-center font-semibold">{quantity}</span>
              <Button
                onClick={increaseQuantity}
                variant="ghost"
                className="w-10 h-10 p-0 flex items-center justify-center text-[#333333] hover:bg-gray-100"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <Button
            onClick={handleAddToCart}
            className="w-full py-6 bg-[#f74ea7] hover:bg-[#e63d96] text-white font-semibold rounded-md text-base"
          >
            <ShoppingCart className="mr-2 h-5 w-5" />
            Adicionar ao pedido
          </Button>
        </div>
      </div>
    </div>
  );
}


