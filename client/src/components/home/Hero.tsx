import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function Hero() {
  const [_, setLocation] = useLocation();
  
  return (
    <section className="mb-8 mt-6 md:mt-8">
      <div className="container">
        <div className="relative rounded-xl overflow-hidden mb-6">
          <img
            src="https://images.unsplash.com/photo-1559620192-032c4bc4674e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
            alt="Deliciosos doces sob encomenda"
            className="w-full h-56 md:h-80 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#212529]/70 to-[#212529]/30 flex flex-col justify-center p-8 md:p-12">
            <h1 className="text-2xl md:text-4xl font-bold text-white mb-4 md:max-w-md">
              Doces por encomenda para suas ocasiões especiais
            </h1>
            <p className="text-white text-sm md:text-lg md:max-w-md">
              Escolha seus produtos favoritos e faça seu pedido de forma prática e rápida
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <Button 
                onClick={() => setLocation('/menus')}
                className="px-8 py-3 rounded-full w-max text-sm bg-[#f74ea7] hover:bg-[#f74ea7]/90 text-white font-medium"
              >
                Ver cardápios
              </Button>
              <Button 
                onClick={() => setLocation('/products')}
                className="px-8 py-3 rounded-full w-max text-sm bg-white hover:bg-gray-100 text-[#f74ea7] font-medium"
                variant="outline"
              >
                Explorar produtos
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
