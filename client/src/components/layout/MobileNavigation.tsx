import { Link, useLocation } from "wouter";
import { Home, ClipboardList, BookOpen, Cake, User } from "lucide-react";

export default function MobileNavigation() {
  const [location] = useLocation();
  
  return (
    <nav className="fixed bottom-0 w-full bg-white shadow-lg border-t border-gray-200 md:hidden z-50">
      <div className="flex justify-around">
        <Link href="/">
          <a className={`flex flex-col items-center py-2 ${location === '/' ? 'text-[#f74ea7]' : 'text-[#333333]'}`}>
            <Home className="h-5 w-5" />
            <span className="text-xs mt-1">Home</span>
          </a>
        </Link>
        <Link href="/my-orders">
          <a className={`flex flex-col items-center py-2 ${location === '/my-orders' ? 'text-[#f74ea7]' : 'text-[#333333]'}`}>
            <ClipboardList className="h-5 w-5" />
            <span className="text-xs mt-1">Pedidos</span>
          </a>
        </Link>
        <Link href="/menus">
          <a className={`flex flex-col items-center py-2 ${location === '/menus' ? 'text-[#f74ea7]' : 'text-[#333333]'}`}>
            <BookOpen className="h-5 w-5" />
            <span className="text-xs mt-1">Cardápios</span>
          </a>
        </Link>
        <Link href="/products">
          <a className={`flex flex-col items-center py-2 ${location === '/products' ? 'text-[#f74ea7]' : 'text-[#333333]'}`}>
            <Cake className="h-5 w-5" />
            <span className="text-xs mt-1">Produtos</span>
          </a>
        </Link>
        <Link href="/account">
          <a className={`flex flex-col items-center py-2 ${location === '/account' ? 'text-[#f74ea7]' : 'text-[#333333]'}`}>
            <User className="h-5 w-5" />
            <span className="text-xs mt-1">Conta</span>
          </a>
        </Link>
      </div>
    </nav>
  );
}
