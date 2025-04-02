import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { CartProvider } from "./contexts/CartContext";
import { FavoritesProvider } from "./contexts/FavoritesContext";

createRoot(document.getElementById("root")!).render(
  <FavoritesProvider>
    <CartProvider>
      <App />
    </CartProvider>
  </FavoritesProvider>
);
