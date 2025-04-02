import React, { createContext, useContext, useState, useEffect } from "react";
import { CartItem, Product } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import ProductDetailsModal from "@/components/ui/product-details-modal";
import CartDrawer from "@/components/ui/cart-drawer";

interface CartContextType {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeItem: (index: number) => void;
  updateItemQuantity: (index: number, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  toggleCartOpen: () => void;
  openProductDetails: (product: Product) => void;
}

const CartContext = createContext<CartContextType>({
  items: [],
  addToCart: () => {},
  removeItem: () => {},
  updateItemQuantity: () => {},
  clearCart: () => {},
  isCartOpen: false,
  toggleCartOpen: () => {},
  openProductDetails: () => {},
});

export const useCart = () => useContext(CartContext);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [productDetailsOpen, setProductDetailsOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { toast } = useToast();
  
  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("sweetorder-cart");
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error("Failed to parse cart from localStorage", error);
      }
    }
  }, []);
  
  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("sweetorder-cart", JSON.stringify(items));
  }, [items]);
  
  const addToCart = (newItem: CartItem) => {
    // Check if item already exists in cart (same product id and size)
    const existingItemIndex = items.findIndex(
      item => 
        item.product.id === newItem.product.id && 
        item.size === newItem.size
    );
    
    if (existingItemIndex >= 0) {
      // Update existing item quantity
      const updatedItems = [...items];
      updatedItems[existingItemIndex].quantity += newItem.quantity;
      setItems(updatedItems);
    } else {
      // Add new item
      setItems([...items, newItem]);
    }
    
    toast({
      title: "Produto adicionado",
      description: `${newItem.product.name} foi adicionado ao seu pedido`,
      variant: "default",
    });
  };
  
  const removeItem = (index: number) => {
    const updatedItems = [...items];
    updatedItems.splice(index, 1);
    setItems(updatedItems);
  };
  
  const updateItemQuantity = (index: number, quantity: number) => {
    if (quantity < 1) return;
    
    const updatedItems = [...items];
    updatedItems[index] = {
      ...updatedItems[index],
      quantity,
    };
    setItems(updatedItems);
  };
  
  const clearCart = () => {
    setItems([]);
  };
  
  const toggleCartOpen = () => {
    setIsCartOpen(!isCartOpen);
  };
  
  const openProductDetails = (product: Product) => {
    setSelectedProduct(product);
    setProductDetailsOpen(true);
  };
  
  const closeProductDetails = () => {
    setProductDetailsOpen(false);
    setSelectedProduct(null);
  };
  
  return (
    <CartContext.Provider 
      value={{
        items,
        addToCart,
        removeItem,
        updateItemQuantity,
        clearCart,
        isCartOpen,
        toggleCartOpen,
        openProductDetails,
      }}
    >
      {children}
      <CartDrawer />
      <ProductDetailsModal 
        product={selectedProduct} 
        isOpen={productDetailsOpen} 
        onClose={closeProductDetails} 
      />
    </CartContext.Provider>
  );
};
