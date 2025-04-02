import { Link, useLocation } from "wouter";
import { SweetOrderLogo } from "@/lib/sweetorder-logo";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { User } from "@/lib/types";

interface HeaderProps {
  currentUser: User | null;
  onLogout: () => void;
}

export default function Header({ currentUser, onLogout }: HeaderProps) {
  const [location] = useLocation();
  const { items, toggleCartOpen } = useCart();
  
  // Calculate total items in cart
  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0);
  
  return (
    <header className="fixed top-0 w-full bg-white shadow-sm z-50 hidden md:block">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/">
            <a className="flex items-center">
              <SweetOrderLogo className="h-10 w-auto" />
              <span className="ml-2 font-playfair font-bold text-2xl">SweetOrder</span>
            </a>
          </Link>
        </div>
        <nav className="hidden md:flex items-center space-x-8 font-montserrat text-sm font-medium">
          <Link href="/">
            <a className={`hover:text-[#f74ea7] transition-colors ${location === '/' ? 'text-[#f74ea7]' : ''}`}>
              Home
            </a>
          </Link>
          <Link href="/my-orders">
            <a className={`hover:text-[#f74ea7] transition-colors ${location === '/my-orders' ? 'text-[#f74ea7]' : ''}`}>
              Meus Pedidos
            </a>
          </Link>
          <Link href="/menus">
            <a className={`hover:text-[#f74ea7] transition-colors ${location === '/menus' ? 'text-[#f74ea7]' : ''}`}>
              Cardápios
            </a>
          </Link>
          <Link href="/products">
            <a className={`hover:text-[#f74ea7] transition-colors ${location === '/products' ? 'text-[#f74ea7]' : ''}`}>
              Produtos
            </a>
          </Link>
          <Link href="/account">
            <a className={`hover:text-[#f74ea7] transition-colors ${location === '/account' ? 'text-[#f74ea7]' : ''}`}>
              Conta
            </a>
          </Link>
          
          <Button 
            onClick={toggleCartOpen}
            variant="ghost" 
            className="flex items-center bg-[#f4f4f4] rounded-full px-3 py-2 hover:bg-gray-200"
          >
            <ShoppingCart className="h-5 w-5 text-[#f74ea7] mr-2" />
            {cartItemCount > 0 && (
              <span className="bg-[#f74ea7] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {cartItemCount}
              </span>
            )}
          </Button>
        </nav>
      </div>
    </header>
  );
}
