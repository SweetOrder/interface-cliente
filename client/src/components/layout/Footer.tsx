import { SweetOrderTextLogo } from "@/lib/sweetorder-text-logo";
import { Link } from "wouter";
import { Instagram, Facebook, Mail, Heart, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Footer() {
  return (
    <footer className="bg-gray-100 pt-12 pb-6 mt-16">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <SweetOrderTextLogo className="h-8 w-auto" />
            <p className="text-gray-600 mt-2 text-sm">
              A plataforma ideal para micro-empreendedores do ramo de confeitaria
              gerenciarem suas encomendas de forma simples e eficiente.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Links Rápidos</h4>
            <nav className="flex flex-col space-y-2">
              <Link href="/" className="text-gray-600 hover:text-[#f74ea7] text-sm">
                Home
              </Link>
              <Link href="/products" className="text-gray-600 hover:text-[#f74ea7] text-sm">
                Produtos
              </Link>
              <Link href="/menus" className="text-gray-600 hover:text-[#f74ea7] text-sm">
                Cardápios
              </Link>
              <Link href="/my-orders" className="text-gray-600 hover:text-[#f74ea7] text-sm">
                Meus Pedidos
              </Link>
            </nav>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Contato</h4>
            <div className="space-y-3">
              <div className="flex items-center text-gray-600">
                <Phone className="h-4 w-4 mr-2" />
                <span className="text-sm">(11) 99999-9999</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Mail className="h-4 w-4 mr-2" />
                <span className="text-sm">contato@sweetorder.com</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Redes Sociais</h4>
            <div className="flex space-x-3">
              <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full">
                <Instagram className="h-4 w-4 text-[#f74ea7]" />
              </Button>
              <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full">
                <Facebook className="h-4 w-4 text-[#f74ea7]" />
              </Button>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-10 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} SweetOrder. Todos os direitos reservados.
            </p>
            <p className="text-gray-500 text-sm flex items-center mt-2 md:mt-0">
              Feito com <Heart className="h-3 w-3 text-[#f74ea7] mx-1" /> para confeiteiros
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}