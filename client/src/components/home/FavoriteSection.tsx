import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import ProductCard from "@/components/ui/product-card";
import { Product, User } from "@/lib/types";
import { useFavorites } from "@/contexts/FavoritesContext";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Heart } from "lucide-react";

interface FavoriteSectionProps {
  userId?: number;
  onAuthRequired?: () => void;
}

export default function FavoriteSection({ userId, onAuthRequired }: FavoriteSectionProps) {
  const [_, navigate] = useLocation();
  const { favoriteIds } = useFavorites();
  
  const { data: favorites, isLoading } = useQuery<Product[]>({
    queryKey: userId ? [`/api/users/${userId}/favorites`] : null,
    enabled: !!userId,
  });
  
  // Se não houver usuário, mostrar mensagem de login
  if (!userId) {
    return (
      <section className="mb-10">
        <h2 className="font-montserrat text-2xl md:text-3xl font-bold mb-4">Seus Favoritos</h2>
        <div className="bg-gray-50 rounded-lg p-6 text-center">
          <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Entre para ver seus favoritos</h3>
          <p className="text-gray-500 mb-6">
            Você precisa estar logado para salvar e visualizar seus produtos favoritos.
          </p>
          <Button 
            onClick={onAuthRequired}
            className="bg-[#f74ea7] hover:bg-[#e63d96] text-white px-6"
          >
            Fazer login
          </Button>
        </div>
      </section>
    );
  }
  
  // Se estiver carregando, não mostrar nada
  if (isLoading) {
    return null;
  }
  
  // Se não houver favoritos, não mostrar a seção
  if (!favorites || favorites.length === 0) {
    return null;
  }
  
  return (
    <section className="mb-10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-montserrat text-2xl md:text-3xl font-bold">Seus Favoritos</h2>
        <Link href="/products?filter=favorites">
          <a className="font-montserrat text-[#f74ea7] font-medium text-sm">Ver todos</a>
        </Link>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
        {favorites.slice(0, 4).map((product) => (
          <ProductCard 
            key={product.id} 
            product={product} 
            isFavorite={favoriteIds.includes(product.id)}
            onClick={() => navigate(`/products/${product.id}`)}
          />
        ))}
      </div>
    </section>
  );
}
