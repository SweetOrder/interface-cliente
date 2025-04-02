import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Products from "@/pages/products";
import Menus from "@/pages/menus";
import MyOrders from "@/pages/my-orders";
import Account from "@/pages/account";
import MenuDetails from "@/pages/menu-details";
import ProductDetails from "@/pages/product-details";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import MobileNavigation from "./components/layout/MobileNavigation";
import { useEffect, useState } from "react";
import { User } from "./lib/types";

function Router() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Check if user is logged in from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse user from localStorage", error);
        localStorage.removeItem("currentUser");
      }
    }
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem("currentUser", JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
  };

  return (
    <>
      <Header currentUser={currentUser} onLogout={handleLogout} />
      <main className="md:pt-16 pt-0 pb-12">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/products" component={Products} />
          <Route path="/menus" component={Menus} />
          <Route path="/my-orders">
            {() => <MyOrders userId={currentUser?.id} />}
          </Route>
          <Route path="/account">
            {() => <Account user={currentUser} onLogin={handleLogin} onLogout={handleLogout} />}
          </Route>
          <Route path="/menus/:id">
            {params => <MenuDetails id={parseInt(params.id)} />}
          </Route>
          <Route path="/products/:id">
            {params => <ProductDetails id={parseInt(params.id)} />}
          </Route>
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
      <MobileNavigation />
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
