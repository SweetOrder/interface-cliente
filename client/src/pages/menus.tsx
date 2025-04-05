import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Menu } from "@/lib/types";
import MenuCard from "@/components/ui/menu-card";

export default function Menus() {
  const [_, navigate] = useLocation();
  
  const { data: menus, isLoading } = useQuery<Menu[]>({
    queryKey: ['/api/menus'],
  });
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <h1 className="font-montserrat text-3xl font-bold mb-6">Cardápios Disponíveis</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-gray-100 rounded-lg h-40 animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }
  
  if (!menus || menus.length === 0) {
    return (
      <div className="container mx-auto px-4 py-6">
        <h1 className="font-montserrat text-3xl font-bold mb-6">Cardápios Disponíveis</h1>
        <p className="text-gray-500 text-center py-8">Nenhum cardápio disponível no momento.</p>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="font-montserrat text-3xl font-bold mb-6">Cardápios Disponíveis</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {menus.map((menu) => (
          <MenuCard key={menu.id} menu={menu} />
        ))}
      </div>
    </div>
  );
}
