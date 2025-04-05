import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Menu } from "@/lib/types";
import MenuCard from "@/components/ui/menu-card";

export default function MenuSection() {
  const { data: menus, isLoading } = useQuery<Menu[]>({
    queryKey: ['/api/menus'],
  });
  
  if (isLoading) {
    return (
      <section className="mb-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-montserrat text-2xl md:text-3xl font-bold">Cardápios Disponíveis</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-100 rounded-lg h-40 animate-pulse"></div>
          ))}
        </div>
      </section>
    );
  }
  
  if (!menus || menus.length === 0) {
    return (
      <section className="mb-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-montserrat text-2xl md:text-3xl font-bold">Cardápios Disponíveis</h2>
        </div>
        <p className="text-gray-500 text-center py-8">Nenhum cardápio disponível no momento.</p>
      </section>
    );
  }
  
  return (
    <section className="mb-10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-montserrat text-2xl md:text-3xl font-bold">Cardápios Disponíveis</h2>
        <Link href="/menus">
          <a className="font-montserrat text-[#f74ea7] font-medium text-sm">Ver todos</a>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {menus.map((menu) => (
          <MenuCard key={menu.id} menu={menu} />
        ))}
      </div>
    </section>
  );
}
