import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ui/product-card";
import { Category, Product } from "@/lib/types";
import { useFavorites } from "@/contexts/FavoritesContext";

export default function Products() {
  const [_, navigate] = useLocation();
  const [location] = useLocation();
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<Category>('Todos');
  const { favoriteIds } = useFavorites();
  const [userId, setUserId] = useState<number | undefined>(undefined);
  
  // Check if we're showing favorites from URL params
  const showFavorites = location.includes("filter=favorites");
  
  // Check if user is logged in from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setUserId(user.id);
      } catch (error) {
        console.error("Failed to parse user from localStorage", error);
      }
    }
  }, []);
  
  // Fetch all products
  const { data: allProducts, isLoading: isLoadingProducts } = useQuery<Product[]>({
    queryKey: ['/api/products'],
  });
  
  // Fetch favorites if showing favorites
  const { data: favorites, isLoading: isLoadingFavorites } = useQuery<Product[]>({
    queryKey: userId && showFavorites ? [`/api/users/${userId}/favorites`] : null,
    enabled: !!userId && showFavorites,
  });
  
  const isLoading = showFavorites ? isLoadingFavorites : isLoadingProducts;
  
  // Determine which products to show based on filters
  let displayedProducts: Product[] = [];
  
  if (showFavorites && favorites) {
    displayedProducts = selectedCategory === 'Todos' 
      ? favorites
      : favorites.filter(p => p.category === selectedCategory);
  } else if (allProducts) {
    displayedProducts = selectedCategory === 'Todos' 
      ? allProducts
      : allProducts.filter(p => p.category === selectedCategory);
  }
  
  const handleProductClick = (productId: number) => {
    navigate(`/products/${productId}`);
  };
  
  const categories: Category[] = ['Todos', 'Bolos', 'Doces', 'Tortas', 'Salgados', 'Bebidas'];
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <h1 className="font-montserrat text-3xl font-bold mb-6">
          {showFavorites ? 'Meus Favoritos' : 'Todos os Produtos'}
        </h1>
        <div className="flex space-x-2 overflow-x-auto pb-4 hide-scrollbar">
          {categories.map(cat => (
            <div key={cat} className="bg-gray-200 h-10 w-24 rounded-full animate-pulse flex-shrink-0" />
          ))}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array(8).fill(0).map((_, i) => (
            <div key={i} className="bg-gray-100 h-64 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="font-montserrat text-3xl font-bold mb-6">
        {showFavorites ? 'Meus Favoritos' : 'Todos os Produtos'}
      </h1>
      
      {/* Filter tabs */}
      <div className="overflow-x-auto pb-4 hide-scrollbar">
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
      
      {displayedProducts.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500 mb-4">
            {showFavorites 
              ? "Você ainda não tem favoritos nesta categoria." 
              : "Nenhum produto encontrado nesta categoria."}
          </p>
          {showFavorites && (
            <Button 
              onClick={() => navigate('/products')}
              className="bg-[#f74ea7] hover:bg-[#e63d96] text-white"
            >
              Ver todos os produtos
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
          {displayedProducts.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              isFavorite={favoriteIds.includes(product.id)}
              onClick={() => handleProductClick(product.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
