import { useState } from "react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { apiRequest } from "@/lib/queryClient";
import { LoginForm, RegisterForm, User } from "@/lib/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User as UserIcon, LogOut, MapPin, Package } from "lucide-react";
import AddressManager from "@/components/address/AddressManager";

interface AccountProps {
  user: User | null;
  onLogin: (user: User) => void;
  onLogout: () => void;
  openAuthModal?: (message: string) => void;
}

// Login form schema
const loginSchema = z.object({
  username: z.string().min(1, "Nome de usuário é obrigatório"),
  password: z.string().min(1, "Senha é obrigatória"),
});

// Register form schema
const registerSchema = z.object({
  username: z.string().min(3, "Nome de usuário deve ter pelo menos 3 caracteres"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  confirmPassword: z.string().min(6, "Confirme sua senha"),
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("Email inválido"),
  whatsapp: z.string().min(10, "WhatsApp inválido"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

export default function Account({ user, onLogin, onLogout, openAuthModal }: AccountProps) {
  const [_, navigate] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  // Login form
  const loginForm = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  
  // Register form
  const registerForm = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
      name: "",
      email: "",
      whatsapp: "",
    },
  });
  
  const handleLogin = async (values: LoginForm) => {
    setIsLoading(true);
    try {
      const res = await apiRequest("POST", "/api/users/login", values);
      const userData = await res.json();
      
      toast({
        title: "Login realizado com sucesso!",
        description: `Bem-vindo(a) de volta, ${userData.name}!`,
      });
      
      onLogin(userData);
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Erro ao fazer login",
        description: "Verifique suas credenciais e tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleRegister = async (values: RegisterForm) => {
    setIsLoading(true);
    try {
      // Remove confirmPassword before sending to API
      const { confirmPassword, ...userData } = values;
      
      const res = await apiRequest("POST", "/api/users/register", userData);
      const newUser = await res.json();
      
      toast({
        title: "Conta criada com sucesso!",
        description: "Você já pode fazer login.",
      });
      
      // Reset the form
      registerForm.reset();
      
      // Switch to login tab
      document.getElementById("login-tab")?.click();
    } catch (error) {
      console.error("Register error:", error);
      toast({
        title: "Erro ao criar conta",
        description: "Verifique os dados e tente novamente. O nome de usuário pode já estar em uso.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleLogout = () => {
    onLogout();
    toast({
      title: "Desconectado com sucesso",
      description: "Você saiu da sua conta.",
    });
  };
  
  if (user) {
    return (
      <div className="container page-container">
        <h1 className="font-playfair text-3xl font-bold mb-6">Minha Conta</h1>
        
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <UserIcon className="h-4 w-4" />
              <span>Perfil</span>
            </TabsTrigger>
            <TabsTrigger value="addresses" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>Endereços</span>
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              <span>Pedidos</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center space-x-4 mb-6">
                <div className="bg-[#f4f4f4] h-16 w-16 rounded-full flex items-center justify-center">
                  <UserIcon className="h-8 w-8 text-[#555555]" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">{user.name}</h2>
                  <p className="text-gray-500">{user.email}</p>
                </div>
              </div>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome de usuário</label>
                  <Input value={user.username} readOnly className="bg-gray-50" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <Input value={user.email} readOnly className="bg-gray-50" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label>
                  <Input value={user.whatsapp} readOnly className="bg-gray-50" />
                </div>
              </div>
              
              <Button 
                onClick={handleLogout}
                variant="outline" 
                className="w-full flex items-center justify-center border-[#f74ea7] text-[#f74ea7] hover:bg-[#f74ea7]/10"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sair da conta
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="addresses">
            <div className="bg-white rounded-lg shadow-md p-6">
              <AddressManager userId={user.id} />
            </div>
          </TabsContent>
          
          <TabsContent value="orders">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Meus Pedidos</h2>
              </div>
              
              {/* O componente de pedidos será implementado em outra etapa */}
              <div className="text-center py-8 border rounded-lg">
                <p className="text-muted-foreground">Seus pedidos aparecerão aqui.</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => navigate('/products')}
                >
                  Continuar comprando
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    );
  }
  
  // Para usuários não autenticados, mostra uma interface simplificada
  return (
    <div className="container page-container">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold mb-6">Minha Conta</h1>
        
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="flex flex-col items-center justify-center mb-6">
            <div className="bg-[#f4f4f4] h-24 w-24 rounded-full flex items-center justify-center mb-4">
              <UserIcon className="h-12 w-12 text-[#999999]" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Acesse sua conta</h2>
            <p className="text-gray-500 mb-6">Entre para gerenciar seus pedidos, endereços e favoritos</p>
          </div>
          
          <div className="space-y-4">
            <Button 
              onClick={() => openAuthModal && openAuthModal('Faça login para acessar sua conta')}
              className="w-full bg-[#f74ea7] hover:bg-[#e63d96] text-white"
            >
              Entrar
            </Button>
            
            <Button 
              onClick={() => {
                openAuthModal && openAuthModal('Crie sua conta SweetOrder');
                // Aguardar a abertura do modal e então clicar na aba de registro
                setTimeout(() => {
                  document.querySelector('[value="register"]')?.dispatchEvent(
                    new MouseEvent('click', { bubbles: true })
                  );
                }, 100);
              }}
              variant="outline"
              className="w-full border-[#f74ea7] text-[#f74ea7] hover:bg-[#f74ea7]/10"
            >
              Criar conta
            </Button>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-100">
            <h3 className="text-sm font-medium text-gray-700 mb-4">Acesso rápido</h3>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                size="sm"
                className="text-sm"
                onClick={() => navigate('/products')}
              >
                Ver produtos
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-sm"
                onClick={() => navigate('/menus')}
              >
                Ver cardápios
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
