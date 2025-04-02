import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import ProductCard from "@/components/ui/product-card";
import { Product } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { useFavorites } from "@/contexts/FavoritesContext";

type Category = 'Todos' | 'Bolos' | 'Doces' | 'Tortas' | 'Salgados' | 'Bebidas';

export default function ProductSection() {
  const [selectedCategory, setSelectedCategory] = useState<Category>('Todos');
  const { favoriteIds } = useFavorites();
  
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
          <h2 className="font-playfair text-2xl md:text-3xl font-bold">Todos os Produtos</h2>
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
        <h2 className="font-playfair text-2xl md:text-3xl font-bold">Todos os Produtos</h2>
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
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.slice(0, 4).map((product) => (
          <ProductCard 
            key={product.id} 
            product={product} 
            isFavorite={favoriteIds.includes(product.id)}
          />
        ))}
      </div>
    </section>
  );
}
