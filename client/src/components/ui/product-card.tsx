import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Product } from "@/lib/types";
import { Heart } from "lucide-react";
import { useLocation } from "wouter";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useCart } from "@/contexts/CartContext";
import { formatCurrency } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  isFavorite: boolean;
  onClick?: () => void;
  onToggleFavorite?: (productId: number) => void;
  onAuthRequired?: () => void;
  isAuthenticated?: boolean;
}

export default function ProductCard({ 
  product, 
  isFavorite, 
  onClick, 
  onToggleFavorite, 
  onAuthRequired,
  isAuthenticated = true 
}: ProductCardProps) {
  const [_, navigate] = useLocation();
  const { toggleFavorite } = useFavorites();
  const { addToCart, openProductDetails } = useCart();
  
  const handleCardClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(`/products/${product.id}`);
    }
  };
  
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Se não está autenticado e tenta adicionar aos favoritos
    if (!isAuthenticated && !isFavorite && onAuthRequired) {
      onAuthRequired();
      return;
    }
    
    // Usa o manipulador personalizado se fornecido, caso contrário, usa o contexto
    if (onToggleFavorite) {
      onToggleFavorite(product.id);
    } else {
      toggleFavorite(product.id);
    }
  };
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (product.hasSizeOptions) {
      openProductDetails(product);
    } else {
      addToCart({
        product,
        quantity: 1
      });
    }
  };
  
  return (
    <Card 
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-transform hover:scale-[1.02]"
      onClick={handleCardClick}
    >
      <div className="relative">
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          className="w-full h-36 sm:h-40 md:h-44 object-cover"
        />
        <button 
          className={`absolute top-2 right-2 transition-all hover:scale-110 ${
            isFavorite ? 'text-[#f74ea7]' : 'text-gray-300 hover:text-[#f74ea7]'
          }`}
          onClick={handleFavoriteClick}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart className={`h-5 w-5 ${isFavorite ? 'fill-[#f74ea7]' : ''}`} />
        </button>
      </div>
      <div className="p-2 sm:p-3">
        <h3 className="font-montserrat font-semibold text-xs sm:text-sm mb-1 truncate">{product.name}</h3>
        <p className="text-[#555555] text-xs mb-2 line-clamp-2 h-8 text-[10px] sm:text-xs">{product.description}</p>
        <div className="flex justify-between items-center">
          <span className="font-bold text-[#f74ea7] text-xs sm:text-sm">{formatCurrency(product.price)}</span>
          <Button 
            size="sm"
            onClick={handleAddToCart}
            className="text-[10px] sm:text-xs px-2 sm:px-3 py-1 rounded-full bg-[#f74ea7] hover:bg-[#e63d96] text-white"
          >
            Adicionar
          </Button>
        </div>
      </div>
    </Card>
  );
}
