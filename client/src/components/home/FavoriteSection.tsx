import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import ProductCard from "@/components/ui/product-card";
import { Product, User } from "@/lib/types";
import { useFavorites } from "@/contexts/FavoritesContext";

interface FavoriteSectionProps {
  userId?: number;
}

export default function FavoriteSection({ userId }: FavoriteSectionProps) {
  const [_, navigate] = useLocation();
  const { favoriteIds } = useFavorites();
  
  const { data: favorites, isLoading } = useQuery<Product[]>({
    queryKey: userId ? [`/api/users/${userId}/favorites`] : null,
    enabled: !!userId,
  });
  
  // If user is not logged in or no favorites
  if (!userId || isLoading || !favorites || favorites.length === 0) {
    return null;
  }
  
  return (
    <section className="mb-10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-playfair text-2xl md:text-3xl font-bold">Seus Favoritos</h2>
        <Link href="/products?filter=favorites">
          <a className="font-montserrat text-[#f74ea7] font-medium text-sm">Ver todos</a>
        </Link>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
