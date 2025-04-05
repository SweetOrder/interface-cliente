import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ui/product-card";
import { Menu, Product } from "@/lib/types";
import { useFavorites } from "@/contexts/FavoritesContext";
import { ArrowLeft } from "lucide-react";

interface MenuDetailsProps {
  id: number;
}

export default function MenuDetails({ id }: MenuDetailsProps) {
  const [_, navigate] = useLocation();
  const { favoriteIds } = useFavorites();
  
  // Fetch menu details
  const { data: menu, isLoading: isLoadingMenu } = useQuery<Menu>({
    queryKey: [`/api/menus/${id}`],
  });
  
  // Fetch products in this menu
  const { data: products, isLoading: isLoadingProducts } = useQuery<Product[]>({
    queryKey: [`/api/menus/${id}/products`],
    enabled: !!id,
  });
  
  const isLoading = isLoadingMenu || isLoadingProducts;
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="animate-pulse bg-gray-200 h-8 w-40 mb-6"></div>
        <div className="animate-pulse bg-gray-200 h-40 rounded-lg w-full mb-6"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array(4).fill(0).map((_, i) => (
            <div key={i} className="bg-gray-200 h-64 rounded-lg animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }
  
  if (!menu) {
    return (
      <div className="container mx-auto px-4 py-6">
        <h1 className="font-montserrat text-2xl font-bold mb-4">Cardápio não encontrado</h1>
        <Button 
          onClick={() => navigate('/menus')}
          className="bg-[#f74ea7] hover:bg-[#e63d96] text-white"
        >
          Voltar para cardápios
        </Button>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-6">
      <Button 
        onClick={() => navigate('/menus')}
        variant="ghost" 
        className="mb-4 hover:bg-transparent hover:text-[#f74ea7] p-0 flex items-center text-[#555555]"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Voltar para cardápios
      </Button>
      
      <div className="relative rounded-xl overflow-hidden mb-6">
        <img 
          src={menu.imageUrl} 
          alt={menu.name} 
          className="w-full h-40 md:h-60 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#212529]/80 via-[#212529]/20 to-transparent flex flex-col justify-end p-6">
          <h1 className="font-montserrat text-3xl font-bold text-white">{menu.name}</h1>
          <p className="text-white text-sm md:text-base opacity-90 mt-1">{menu.description}</p>
        </div>
      </div>
      
      <h2 className="font-montserrat text-2xl font-bold mb-4">Produtos neste cardápio</h2>
      
      {!products || products.length === 0 ? (
        <p className="text-gray-500 text-center py-8">Nenhum produto disponível neste cardápio.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              isFavorite={favoriteIds.includes(product.id)}
              onClick={() => navigate(`/products/${product.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
