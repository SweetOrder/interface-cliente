import React, { createContext, useContext, useState, useEffect } from "react";
import { CartItem, Product } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import ProductDetailsModal from "@/components/ui/product-details-modal";

interface CartContextType {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeItem: (index: number) => void;
  updateItemQuantity: (index: number, quantity: number) => void;
  updateItemNotes: (index: number, notes: string) => void;
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
  updateItemNotes: () => {},
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
  
  // Load cart from localStorage on mount or add demo products for testing
  useEffect(() => {
    const savedCart = localStorage.getItem("sweetorder-cart");
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error("Failed to parse cart from localStorage", error);
        loadDemoProducts();
      }
    } else {
      loadDemoProducts();
    }
  }, []);
  
  // Function to load demo products for testing
  const loadDemoProducts = () => {
    // Produtos de demonstração para teste
    const demoProducts: CartItem[] = [
      {
        product: {
          id: 1,
          name: "Bolo de Chocolate",
          description: "Delicioso bolo de chocolate com cobertura de ganache e morangos frescos",
          price: 85.0,
          category: "Bolos",
          imageUrl: "https://i.imgur.com/mW5lJLb.jpg",
          hasSizeOptions: true,
          sizeOptions: [
            { name: "P", description: "Para 10 pessoas", price: 85.0 },
            { name: "M", description: "Para 15 pessoas", price: 120.0 },
            { name: "G", description: "Para 25 pessoas", price: 180.0 }
          ]
        },
        quantity: 1,
        size: "P",
        selectedSizeOption: { name: "P", description: "Para 10 pessoas", price: 85.0 }
      },
      {
        product: {
          id: 3,
          name: "Brigadeiros Gourmet",
          description: "Caixa com 20 brigadeiros gourmet em sabores variados",
          price: 45.0,
          category: "Doces",
          imageUrl: "https://i.imgur.com/6ZWcj9W.jpg",
          hasSizeOptions: false,
          sizeOptions: []
        },
        quantity: 2,
        notes: "Preferência por sabores de frutas."
      }
    ];
    
    setItems(demoProducts);
  };
  
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
  
  const updateItemNotes = (index: number, notes: string) => {
    const updatedItems = [...items];
    updatedItems[index] = {
      ...updatedItems[index],
      notes,
    };
    setItems(updatedItems);
  };
  
  const clearCart = () => {
    setItems([]);
  };
  
  const toggleCartOpen = () => {
    console.log("toggleCartOpen chamado, valor atual:", isCartOpen);
    setIsCartOpen(prevState => {
      console.log("Alterando isCartOpen de", prevState, "para", !prevState);
      return !prevState;
    });
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
        updateItemNotes,
        clearCart,
        isCartOpen,
        toggleCartOpen,
        openProductDetails,
      }}
    >
      {children}
      <ProductDetailsModal 
        product={selectedProduct} 
        isOpen={productDetailsOpen} 
        onClose={closeProductDetails} 
      />
    </CartContext.Provider>
  );
};
