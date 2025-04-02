import { Link, useLocation } from "wouter";
import { Home, BookOpen, Cake, Heart, PackageIcon } from "lucide-react";

export default function MobileNavigation() {
  const [location] = useLocation();
  
  // Define the active style for navigation items
  const activeClass = "text-[#f74ea7] font-semibold";
  const inactiveClass = "text-gray-600";
  
  return (
    <nav className="fixed bottom-0 w-full bg-white shadow-lg border-t border-gray-200 md:hidden z-50">
      <div className="flex justify-around">
        <Link href="/">
          <div className={`flex flex-col items-center py-3 ${location === '/' ? activeClass : inactiveClass} cursor-pointer`}>
            <Home className="h-5 w-5" />
            <span className="text-xs mt-1 font-montserrat">Home</span>
          </div>
        </Link>
        <Link href="/menus">
          <div className={`flex flex-col items-center py-3 ${location === '/menus' ? activeClass : inactiveClass} cursor-pointer`}>
            <BookOpen className="h-5 w-5" />
            <span className="text-xs mt-1 font-montserrat">Cardápios</span>
          </div>
        </Link>
        <Link href="/products">
          <div className={`flex flex-col items-center py-3 ${location === '/products' ? activeClass : inactiveClass} cursor-pointer`}>
            <Cake className="h-5 w-5" />
            <span className="text-xs mt-1 font-montserrat">Produtos</span>
          </div>
        </Link>
        <Link href="/favoritos">
          <div className={`flex flex-col items-center py-3 ${location === '/favoritos' ? activeClass : inactiveClass} cursor-pointer`}>
            <Heart className="h-5 w-5" />
            <span className="text-xs mt-1 font-montserrat">Favoritos</span>
          </div>
        </Link>
        <Link href="/my-orders">
          <div className={`flex flex-col items-center py-3 ${location === '/my-orders' ? activeClass : inactiveClass} cursor-pointer`}>
            <PackageIcon className="h-5 w-5" />
            <span className="text-xs mt-1 font-montserrat">Pedidos</span>
          </div>
        </Link>
      </div>
    </nav>
  );
}
