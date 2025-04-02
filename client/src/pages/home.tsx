import Hero from "@/components/home/Hero";
import FavoriteSection from "@/components/home/FavoriteSection";
import MenuSection from "@/components/home/MenuSection";
import ProductSection from "@/components/home/ProductSection";
import { useEffect, useState } from "react";

export default function Home() {
  const [userId, setUserId] = useState<number | undefined>(undefined);
  
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
  
  return (
    <div className="container mx-auto px-4 mt-4">
      <Hero />
      <FavoriteSection userId={userId} />
      <MenuSection />
      <ProductSection />
    </div>
  );
}
