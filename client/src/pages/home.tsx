import Hero from "@/components/home/Hero";
import FavoriteSection from "@/components/home/FavoriteSection";
import MenuSection from "@/components/home/MenuSection";
import ProductSection from "@/components/home/ProductSection";
import AuthModal from "@/components/auth/AuthModal";
import { useEffect, useState } from "react";

export default function Home() {
  const [userId, setUserId] = useState<number | undefined>(undefined);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authCallbackMessage, setAuthCallbackMessage] = useState<string | undefined>(undefined);
  
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
  
  const handleLogin = (user: any) => {
    setUserId(user.id);
    localStorage.setItem("currentUser", JSON.stringify(user));
    window.location.reload(); // Recarregar para atualizar o estado
  };
  
  const openAuthModal = (message: string = "Faça login para adicionar produtos aos favoritos") => {
    setAuthCallbackMessage(message);
    setAuthModalOpen(true);
  };
  
  return (
    <div className="container mx-auto px-4 mt-4">
      <Hero />
      <FavoriteSection userId={userId} />
      <MenuSection />
      <ProductSection 
        isAuthenticated={!!userId}
        onAuthRequired={() => openAuthModal()}
      />
      
      <AuthModal 
        open={authModalOpen} 
        onOpenChange={setAuthModalOpen}
        onLogin={handleLogin}
        callbackMessage={authCallbackMessage}
      />
    </div>
  );
}
