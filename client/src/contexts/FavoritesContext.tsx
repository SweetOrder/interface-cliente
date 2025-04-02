import React, { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface FavoritesContextType {
  favoriteIds: number[];
  toggleFavorite: (productId: number) => void;
  isFavorite: (productId: number) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType>({
  favoriteIds: [],
  toggleFavorite: () => {},
  isFavorite: () => false,
});

export const useFavorites = () => useContext(FavoritesContext);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const [userId, setUserId] = useState<number | null>(null);
  const { toast } = useToast();
  
  // Check if user is logged in and load userId
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
  
  // Load favorites from API when userId changes
  useEffect(() => {
    if (userId) {
      fetchFavorites();
    } else {
      // If no user is logged in, use localStorage for favorites
      const savedFavorites = localStorage.getItem("sweetorder-favorites");
      if (savedFavorites) {
        try {
          setFavoriteIds(JSON.parse(savedFavorites));
        } catch (error) {
          console.error("Failed to parse favorites from localStorage", error);
        }
      }
    }
  }, [userId]);
  
  // Save favorites to localStorage if no user is logged in
  useEffect(() => {
    if (!userId && favoriteIds.length > 0) {
      localStorage.setItem("sweetorder-favorites", JSON.stringify(favoriteIds));
    }
  }, [favoriteIds, userId]);
  
  const fetchFavorites = async () => {
    if (!userId) return;
    
    try {
      const res = await fetch(`/api/users/${userId}/favorites`, {
        credentials: "include",
      });
      
      if (res.ok) {
        const favorites = await res.json();
        setFavoriteIds(favorites.map((fav: any) => fav.id));
      }
    } catch (error) {
      console.error("Error fetching favorites:", error);
    }
  };
  
  const toggleFavorite = async (productId: number) => {
    const isFav = favoriteIds.includes(productId);
    
    if (userId) {
      // User is logged in, use API
      try {
        if (isFav) {
          // Remove from favorites
          await apiRequest("DELETE", `/api/users/${userId}/favorites/${productId}`);
          setFavoriteIds(favoriteIds.filter(id => id !== productId));
          
          toast({
            title: "Removido dos favoritos",
            description: "Produto removido dos seus favoritos",
          });
        } else {
          // Add to favorites
          await apiRequest("POST", `/api/users/${userId}/favorites`, { productId });
          setFavoriteIds([...favoriteIds, productId]);
          
          toast({
            title: "Adicionado aos favoritos",
            description: "Produto adicionado aos seus favoritos",
          });
        }
      } catch (error) {
        console.error("Error toggling favorite:", error);
        toast({
          title: "Erro",
          description: "Não foi possível atualizar os favoritos",
          variant: "destructive",
        });
      }
    } else {
      // User is not logged in, use localStorage
      if (isFav) {
        setFavoriteIds(favoriteIds.filter(id => id !== productId));
        toast({
          title: "Removido dos favoritos",
          description: "Produto removido dos seus favoritos",
        });
      } else {
        setFavoriteIds([...favoriteIds, productId]);
        toast({
          title: "Adicionado aos favoritos",
          description: "Produto adicionado aos seus favoritos",
        });
      }
    }
  };
  
  const isFavorite = (productId: number) => {
    return favoriteIds.includes(productId);
  };
  
  return (
    <FavoritesContext.Provider
      value={{
        favoriteIds,
        toggleFavorite,
        isFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};
