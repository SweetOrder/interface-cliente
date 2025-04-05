import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Order } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { ShoppingBag, ChevronRight } from "lucide-react";

interface MyOrdersProps {
  userId?: number;
}

export default function MyOrders({ userId }: MyOrdersProps) {
  const [_, navigate] = useLocation();
  const { toast } = useToast();
  
  // Fetch user orders
  const { data: orders, isLoading } = useQuery<Order[]>({
    queryKey: userId ? [`/api/users/${userId}/orders`] : null,
    enabled: !!userId,
  });
  
  // Format date from ISO string to readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
    }).format(date);
  };
  
  // Get status label based on status code
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return { label: 'Pendente', color: 'bg-yellow-100 text-yellow-800' };
      case 'confirmed':
        return { label: 'Confirmado', color: 'bg-blue-100 text-blue-800' };
      case 'completed':
        return { label: 'Concluído', color: 'bg-green-100 text-green-800' };
      case 'cancelled':
        return { label: 'Cancelado', color: 'bg-red-100 text-red-800' };
      default:
        return { label: 'Pendente', color: 'bg-yellow-100 text-yellow-800' };
    }
  };
  
  if (!userId) {
    return (
      <div className="container mx-auto px-4 py-10">
        <div className="text-center max-w-md mx-auto py-8">
          <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h1 className="font-montserrat text-2xl font-bold mb-4">Entre para ver seus pedidos</h1>
          <p className="text-gray-500 mb-6">
            Você precisa estar logado para visualizar seu histórico de pedidos.
          </p>
          <Button 
            onClick={() => navigate('/account')}
            className="bg-[#f74ea7] hover:bg-[#e63d96] text-white px-6"
          >
            Fazer login
          </Button>
        </div>
      </div>
    );
  }
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <h1 className="font-montserrat text-3xl font-bold mb-6">Meus Pedidos</h1>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-100 rounded-lg h-24 animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }
  
  if (!orders || orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-6">
        <h1 className="font-montserrat text-3xl font-bold mb-6">Meus Pedidos</h1>
        <div className="text-center py-8">
          <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">Você ainda não fez nenhum pedido.</p>
          <Button 
            onClick={() => navigate('/')}
            className="bg-[#f74ea7] hover:bg-[#e63d96] text-white"
          >
            Explorar produtos
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="font-montserrat text-3xl font-bold mb-6">Meus Pedidos</h1>
      
      <div className="space-y-4">
        {orders.map((order) => {
          const { label, color } = getStatusLabel(order.status);
          
          return (
            <div 
              key={order.id} 
              className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => navigate(`/orders/${order.id}`)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className={`text-xs px-2 py-1 rounded-full ${color}`}>
                      {label}
                    </span>
                    <span className="text-xs text-gray-500">
                      Pedido #{order.id}
                    </span>
                  </div>
                  <p className="font-semibold mb-1">
                    {formatCurrency(order.totalAmount)}
                  </p>
                  <p className="text-sm text-gray-500">
                    Para entrega em: {formatDate(order.deliveryDate)}
                  </p>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
