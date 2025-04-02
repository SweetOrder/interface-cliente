import { Switch, Route, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { Button } from "@/components/ui/button";
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
import AuthModal from "@/components/auth/AuthModal";
import { useEffect, useState } from "react";
import { User } from "./lib/types";

function Router() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authCallbackMessage, setAuthCallbackMessage] = useState<string | undefined>(undefined);
  const [location] = useLocation();

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
  
  const openAuthModal = (message?: string) => {
    setAuthCallbackMessage(message);
    setAuthModalOpen(true);
  };

  // Efeito para verificar rotas que precisam de autenticação
  useEffect(() => {
    if ((location === '/my-orders' || location === '/favoritos') && !currentUser) {
      const message = location === '/favoritos' 
        ? 'Faça login para ver seus produtos favoritos' 
        : 'Faça login para ver seus pedidos';
      openAuthModal(message);
    }
  }, [location, currentUser]);

  return (
    <>
      <Header currentUser={currentUser} onLogout={handleLogout} />
      <main className="page-container md:pt-10 pt-6 pb-8">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/products" component={Products} />
          <Route path="/menus" component={Menus} />
          <Route path="/my-orders">
            {() => 
              currentUser ? 
                <MyOrders userId={currentUser.id} /> :
                <div className="container py-10 text-center">
                  <h1 className="text-2xl font-bold mb-4">Área de pedidos</h1>
                  <p className="mb-4">Faça login para acessar seus pedidos</p>
                  <Button 
                    onClick={() => openAuthModal('Faça login para ver seus pedidos')}
                    className="bg-[#f74ea7] hover:bg-[#e63d96]"
                  >
                    Entrar
                  </Button>
                </div>
            }
          </Route>
          <Route path="/favoritos">
            {() => 
              currentUser ? 
                <Products /> :
                <div className="container py-10 text-center">
                  <h1 className="text-2xl font-bold mb-4">Meus Favoritos</h1>
                  <p className="mb-4">Faça login para acessar seus produtos favoritos</p>
                  <Button 
                    onClick={() => openAuthModal('Faça login para ver seus favoritos')}
                    className="bg-[#f74ea7] hover:bg-[#e63d96]"
                  >
                    Entrar
                  </Button>
                </div>
            }
          </Route>
          <Route path="/account">
            {() => 
              currentUser ? 
                <Account 
                  user={currentUser}
                  onLogout={handleLogout}
                /> :
                <div className="container py-10 text-center">
                  <h1 className="text-2xl font-bold mb-4">Minha Conta</h1>
                  <p className="mb-4">Faça login para acessar sua conta</p>
                  <Button 
                    onClick={() => openAuthModal('Faça login para acessar sua conta')}
                    className="bg-[#f74ea7] hover:bg-[#e63d96]"
                  >
                    Entrar
                  </Button>
                </div>
            }
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
      
      <AuthModal 
        open={authModalOpen} 
        onOpenChange={setAuthModalOpen}
        onLogin={handleLogin}
        callbackMessage={authCallbackMessage}
      />
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
