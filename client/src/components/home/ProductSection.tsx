import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import ProductCard from "@/components/ui/product-card";
import { Product } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { useFavorites } from "@/contexts/FavoritesContext";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

type Category = 'Todos' | 'Bolos' | 'Doces' | 'Tortas' | 'Salgados' | 'Bebidas';

interface ProductSectionProps {
  onAuthRequired?: () => void;
  isAuthenticated?: boolean;
}

export default function ProductSection({ 
  onAuthRequired,
  isAuthenticated = false 
}: ProductSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<Category>('Todos');
  const { favoriteIds } = useFavorites();
  const { toast } = useToast();
  
  const handleToggleFavorite = async (productId: number) => {
    if (!isAuthenticated) {
      // Se não está autenticado e tenta adicionar/remover favoritos
      if (onAuthRequired) {
        onAuthRequired();
      }
      return;
    }
    
    // Busca o usuário atual do localStorage
    const storedUser = localStorage.getItem("currentUser");
    if (!storedUser) return;
    
    try {
      const user = JSON.parse(storedUser);
      const userId = user.id;
      const isFav = favoriteIds.includes(productId);
      
      if (isFav) {
        // Remove dos favoritos
        await apiRequest("DELETE", `/api/users/${userId}/favorites/${productId}`);
        toast({
          title: "Removido dos favoritos",
          description: "Produto removido dos seus favoritos",
        });
      } else {
        // Adiciona aos favoritos
        await apiRequest("POST", `/api/users/${userId}/favorites`, { productId });
        toast({
          title: "Adicionado aos favoritos",
          description: "Produto adicionado aos seus favoritos",
        });
      }
      
      // Força o recarregamento da lista de favoritos
      window.location.reload();
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar os favoritos",
        variant: "destructive",
      });
    }
  };
  
  const { data: allProducts, isLoading } = useQuery<Product[]>({
    queryKey: ['/api/products'],
  });
  
  // Filter products by category if needed
  const products = allProducts 
    ? (selectedCategory === 'Todos' 
      ? allProducts 
      : allProducts.filter(p => p.category === selectedCategory))
    : [];
  
  if (isLoading) {
    return (
      <section className="mb-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-montserrat text-2xl md:text-3xl font-bold">Todos os Produtos</h2>
        </div>
        <div className="overflow-x-auto scrollbar-hide mb-5">
          <div className="flex space-x-2 md:space-x-4 min-w-max pb-2">
            {['Todos', 'Bolos', 'Doces', 'Tortas', 'Salgados', 'Bebidas'].map((cat) => (
              <div key={cat} className="bg-gray-200 rounded-full h-10 w-24 animate-pulse"></div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-gray-100 rounded-lg h-64 animate-pulse"></div>
          ))}
        </div>
      </section>
    );
  }
  
  const categories: Category[] = ['Todos', 'Bolos', 'Doces', 'Tortas', 'Salgados', 'Bebidas'];
  
  return (
    <section className="mb-10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-montserrat text-2xl md:text-3xl font-bold">Todos os Produtos</h2>
        <Link href="/products">
          <a className="font-montserrat text-[#f74ea7] font-medium text-sm">Ver todos</a>
        </Link>
      </div>
      
      {/* Filter tabs */}
      <div className="overflow-x-auto mb-5 hide-scrollbar">
        <div className="flex space-x-2 md:space-x-4 min-w-max pb-2">
          {categories.map((category) => (
            <Button 
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-montserrat font-medium ${
                selectedCategory === category
                  ? 'bg-[#f74ea7] text-white hover:bg-[#e63d96]'
                  : 'bg-[#f4f4f4] text-[#333333] hover:bg-gray-200'
              }`}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
        {products.slice(0, 4).map((product) => (
          <ProductCard 
            key={product.id} 
            product={product} 
            isFavorite={favoriteIds.includes(product.id)}
            isAuthenticated={isAuthenticated}
            onAuthRequired={onAuthRequired}
            onToggleFavorite={handleToggleFavorite}
          />
        ))}
      </div>
    </section>
  );
}
