import { Menu } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

interface MenuCardProps {
  menu: Menu;
}

export default function MenuCard({ menu }: MenuCardProps) {
  const [_, navigate] = useLocation();
  
  const handleViewMenu = () => {
    navigate(`/menus/${menu.id}`);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden relative">
      <img 
        src={menu.imageUrl} 
        alt={menu.name} 
        className="w-full h-40 object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#212529]/80 via-[#212529]/20 to-transparent flex flex-col justify-end p-4">
        <h3 className="text-white font-montserrat font-semibold text-lg">{menu.name}</h3>
        <p className="text-white opacity-90 text-sm mb-2">{menu.description}</p>
        <Button 
          onClick={handleViewMenu}
          className="text-xs px-4 py-2 rounded-full w-max bg-[#f74ea7] hover:bg-[#e63d96] text-white"
        >
          Ver cardápio
        </Button>
      </div>
    </div>
  );
}
