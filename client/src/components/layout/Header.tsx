import { useState } from "react";
import { Link, useLocation } from "wouter";
import { SweetOrderTextLogo } from "@/lib/sweetorder-text-logo";
import { ShoppingCart, Search, Home, BookOpen, Cake, Heart, PackageIcon, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import NotificationCenter from "@/components/notifications/NotificationCenter";
import SearchDialog from "@/components/search/SearchDialog";
import CartDrawer from "@/components/cart/CartDrawer";
import { User } from "@/lib/types";

interface HeaderProps {
  currentUser: User | null;
  onLogout: () => void;
}

export default function Header({ currentUser, onLogout }: HeaderProps) {
  const [location] = useLocation();
  const { items, toggleCartOpen } = useCart();
  const [searchOpen, setSearchOpen] = useState(false);
  
  // Calculate total items in cart
  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0);
  
  // Define the active style for navigation items
  const activeStyle = "text-[#f74ea7] font-semibold";
  const hoverStyle = "hover:text-[#f74ea7] transition-colors";
  
  return (
    <>
      <header className="fixed top-0 w-full bg-white shadow-sm z-50">
        {/* Desktop Header */}
        <div className="container hidden md:flex justify-between items-center py-3">
          {/* Logo on the left */}
          <div className="flex items-center">
            <Link href="/">
              <SweetOrderTextLogo className="scale-90" />
            </Link>
          </div>
          
          {/* Navigation in the center */}
          <nav className="flex items-center space-x-10 font-medium">
            <Link href="/">
              <div className={`${hoverStyle} ${location === '/' ? activeStyle : ''} flex items-center cursor-pointer`}>
                <Home className="h-4 w-4 mr-2" />
                <span>Home</span>
              </div>
            </Link>
            <Link href="/menus">
              <div className={`${hoverStyle} ${location === '/menus' ? activeStyle : ''} flex items-center cursor-pointer`}>
                <BookOpen className="h-4 w-4 mr-2" />
                <span>Cardápios</span>
              </div>
            </Link>
            <Link href="/products">
              <div className={`${hoverStyle} ${location === '/products' ? activeStyle : ''} flex items-center cursor-pointer`}>
                <Cake className="h-4 w-4 mr-2" />
                <span>Produtos</span>
              </div>
            </Link>
            <Link href="/favoritos">
              <div className={`${hoverStyle} ${location === '/favoritos' ? activeStyle : ''} flex items-center cursor-pointer`}>
                <Heart className="h-4 w-4 mr-2" />
                <span>Favoritos</span>
              </div>
            </Link>
            <Link href="/my-orders">
              <div className={`${hoverStyle} ${location === '/my-orders' ? activeStyle : ''} flex items-center cursor-pointer`}>
                <PackageIcon className="h-4 w-4 mr-2" />
                <span>Pedidos</span>
              </div>
            </Link>
          </nav>
          
          {/* Icons on the right */}
          <div className="flex items-center space-x-6">
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full hover:bg-gray-100"
              onClick={() => setSearchOpen(true)}
            >
              <Search className="h-5 w-5 text-gray-600 hover:text-[#f74ea7]" />
            </Button>
            
            <NotificationCenter />
            
            <Button 
              onClick={() => {
                console.log("Clicou no ícone do carrinho");
                toggleCartOpen();
              }}
              variant="ghost" 
              size="icon"
              className="rounded-full hover:bg-gray-100 relative"
            >
              <ShoppingCart className="h-5 w-5 text-gray-600 hover:text-[#f74ea7]" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#f74ea7] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {cartItemCount}
                </span>
              )}
            </Button>
          </div>
        </div>
        
        {/* Mobile Header */}
        <div className="container flex flex-col py-3 md:hidden">
          {/* Logo centered on mobile */}
          <div className="flex justify-center w-full mb-2">
            <Link href="/">
              <SweetOrderTextLogo className="w-auto h-7" />
            </Link>
          </div>
          
          {/* Icons below the logo for mobile */}
          <div className="flex items-center justify-center space-x-6 w-full mt-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full h-9 w-9 hover:bg-gray-100"
              onClick={() => setSearchOpen(true)}
            >
              <Search className="h-5 w-5 text-gray-600 hover:text-[#f74ea7]" />
            </Button>
            
            <NotificationCenter />
            
            <Button 
              onClick={() => {
                console.log("Clicou no ícone do carrinho (mobile)");
                toggleCartOpen();
              }}
              variant="ghost" 
              size="icon"
              className="rounded-full h-9 w-9 hover:bg-gray-100 relative"
            >
              <ShoppingCart className="h-5 w-5 text-gray-600 hover:text-[#f74ea7]" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#f74ea7] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {cartItemCount}
                </span>
              )}
            </Button>
          </div>
        </div>
      </header>
      
      {/* Search Dialog */}
      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
      
      {/* Cart Drawer */}
      <CartDrawer userId={currentUser?.id} />
    </>
  );
}
