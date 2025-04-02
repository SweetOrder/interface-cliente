import { useState } from "react";
import { Bell } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

interface Notification {
  id: number;
  title: string;
  message: string;
  date: string;
  read: boolean;
}

export default function NotificationCenter() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      title: "Pedido confirmado",
      message: "Seu pedido #12345 foi confirmado e está sendo preparado.",
      date: "Há 2 horas",
      read: false
    },
    {
      id: 2,
      title: "Cupom de desconto",
      message: "Você ganhou um cupom de 10% para sua próxima compra! Use o código SWEET10.",
      date: "Há 1 dia",
      read: false
    },
    {
      id: 3,
      title: "Novos produtos",
      message: "Lançamos novos produtos no catálogo! Venha conferir.",
      date: "Há 3 dias",
      read: true
    }
  ]);
  
  // Retorna o número de notificações não lidas
  const unreadCount = notifications.filter(notif => !notif.read).length;
  
  // Marca uma notificação como lida
  const markAsRead = (id: number) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };
  
  // Marca todas as notificações como lidas
  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
  };
  
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full hover:bg-gray-100 relative">
          <Bell className="h-5 w-5 text-gray-600 hover:text-[#f74ea7]" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-[#f74ea7] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-medium">Notificações</h3>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={markAllAsRead}
              className="text-xs h-8 px-2 text-[#f74ea7]"
            >
              Marcar todas como lidas
            </Button>
          )}
        </div>
        
        {notifications.length === 0 ? (
          <div className="py-8 text-center text-gray-500">
            <Bell className="h-12 w-12 mx-auto text-gray-300 mb-3" />
            <p>Nenhuma notificação</p>
          </div>
        ) : (
          <ScrollArea className="h-[320px]">
            <div className="py-2">
              {notifications.map((notification) => (
                <div 
                  key={notification.id}
                  className={`flex flex-col p-4 cursor-pointer hover:bg-gray-50 transition-colors ${!notification.read ? 'bg-gray-50' : ''}`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-medium text-sm truncate flex-1">
                      {notification.title}
                    </h4>
                    
                    {!notification.read && (
                      <Badge variant="outline" className="ml-2 bg-[#f74ea7] text-white border-[#f74ea7] text-[10px] h-5">
                        Novo
                      </Badge>
                    )}
                  </div>
                  
                  <p className="text-gray-600 text-xs mb-1 line-clamp-2">
                    {notification.message}
                  </p>
                  
                  <span className="text-gray-400 text-[11px]">
                    {notification.date}
                  </span>
                  
                  <Separator className="mt-3" />
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
        
        <div className="p-2 border-t">
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full justify-center text-[#f74ea7]"
            onClick={() => setOpen(false)}
          >
            Ver todas
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}