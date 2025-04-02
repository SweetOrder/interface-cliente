import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Search, X, ShoppingBag, Coffee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Product, Menu } from "@/lib/types";
import { getQueryFn } from "@/lib/queryClient";
import { cn, formatCurrency, truncateText } from "@/lib/utils";

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("products");
  const [_, navigate] = useLocation();

  // Fetch products
  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ["/api/products"],
    queryFn: getQueryFn({ on401: "returnNull" }),
    enabled: open,
    staleTime: 1000 * 60 * 5 // 5 minutes
  });

  // Fetch menus
  const { data: menus = [] } = useQuery<Menu[]>({
    queryKey: ["/api/menus"],
    queryFn: getQueryFn({ on401: "returnNull" }),
    enabled: open,
    staleTime: 1000 * 60 * 5 // 5 minutes
  });

  // Filter products based on search term
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter menus based on search term
  const filteredMenus = menus.filter(menu => 
    menu.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    menu.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle product click
  const handleProductClick = (productId: number) => {
    navigate(`/products/${productId}`);
    onOpenChange(false);
  };

  // Handle menu click
  const handleMenuClick = (menuId: number) => {
    navigate(`/menus/${menuId}`);
    onOpenChange(false);
  };

  // Clear search term
  const handleClearSearch = () => {
    setSearchTerm("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0">
        <DialogHeader className="px-4 pt-5 pb-0">
          <DialogTitle className="text-lg">Buscar</DialogTitle>
          <div className="relative mt-3">
            <Input
              placeholder="O que você está procurando?"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10"
              autoFocus
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-10 w-10"
                onClick={handleClearSearch}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </DialogHeader>

        <Tabs defaultValue="products" className="mt-2" value={activeTab} onValueChange={setActiveTab}>
          <div className="px-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="products" className="flex items-center gap-2">
                <ShoppingBag className="h-4 w-4" />
                <span>Produtos</span>
                {searchTerm && <span className="text-xs">({filteredProducts.length})</span>}
              </TabsTrigger>
              <TabsTrigger value="menus" className="flex items-center gap-2">
                <Coffee className="h-4 w-4" />
                <span>Cardápios</span>
                {searchTerm && <span className="text-xs">({filteredMenus.length})</span>}
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="p-4">
            <TabsContent value="products" className="m-0">
              <ScrollArea className="h-60">
                {filteredProducts.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 text-center text-gray-500">
                    <ShoppingBag className="h-12 w-12 text-gray-300 mb-3" />
                    <p>
                      {searchTerm
                        ? "Nenhum produto encontrado com este termo de busca."
                        : "Digite algo para buscar produtos."}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-2">
                    {filteredProducts.map((product) => (
                      <div
                        key={product.id}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleProductClick(product.id)}
                      >
                        <div 
                          className="h-12 w-12 rounded-md bg-cover bg-center flex-shrink-0" 
                          style={{ backgroundImage: `url(${product.imageUrl})` }}
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm">{product.name}</h4>
                          <p className="text-xs text-gray-500 truncate">
                            {truncateText(product.description, 40)}
                          </p>
                          <p className="text-xs font-medium text-[#f74ea7]">
                            {formatCurrency(product.price)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </TabsContent>

            <TabsContent value="menus" className="m-0">
              <ScrollArea className="h-60">
                {filteredMenus.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 text-center text-gray-500">
                    <Coffee className="h-12 w-12 text-gray-300 mb-3" />
                    <p>
                      {searchTerm
                        ? "Nenhum cardápio encontrado com este termo de busca."
                        : "Digite algo para buscar cardápios."}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-2">
                    {filteredMenus.map((menu) => (
                      <div
                        key={menu.id}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleMenuClick(menu.id)}
                      >
                        <div 
                          className="h-12 w-12 rounded-md bg-cover bg-center flex-shrink-0" 
                          style={{ backgroundImage: `url(${menu.imageUrl})` }}
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm">{menu.name}</h4>
                          <p className="text-xs text-gray-500 truncate">
                            {truncateText(menu.description, 50)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </TabsContent>
          </div>
        </Tabs>

        <div className="p-4 border-t">
          <Button
            variant="ghost"
            className="w-full justify-center"
            onClick={() => onOpenChange(false)}
          >
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}