import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User } from "@/lib/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User as UserIcon, LogOut, MapPin, Package } from "lucide-react";
import AddressManager from "@/components/address/AddressManager";

interface AccountProps {
  user: User;
  onLogout: () => void;
}

export default function Account({ user, onLogout }: AccountProps) {
  const [_, navigate] = useLocation();
  const { toast } = useToast();
  
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
        <h1 className="font-montserrat text-3xl font-bold mb-6">Minha Conta</h1>
        
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
  
  // Usuários não autenticados são redirecionados no App.tsx
  return null;
}
