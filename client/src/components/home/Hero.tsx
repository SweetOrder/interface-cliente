import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function Hero() {
  const [_, setLocation] = useLocation();
  
  return (
    <section className="mb-10">
      <div className="relative rounded-xl overflow-hidden mb-5">
        <img
          src="https://images.unsplash.com/photo-1559620192-032c4bc4674e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
          alt="Deliciosos doces sob encomenda"
          className="w-full h-48 md:h-80 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#212529]/70 to-[#212529]/30 flex flex-col justify-center p-6">
          <h1 className="font-playfair text-2xl md:text-4xl font-bold text-white mb-2 md:max-w-md">
            Doces por encomenda para suas ocasiões especiais
          </h1>
          <p className="text-white text-sm md:text-base md:max-w-md">
            Escolha seus produtos favoritos e faça seu pedido de forma prática e rápida
          </p>
          <Button 
            onClick={() => setLocation('/menus')}
            className="mt-4 px-6 py-2 rounded-full w-max text-sm bg-[#f74ea7] hover:bg-[#e63d96] text-white font-medium font-montserrat"
          >
            Ver cardápios
          </Button>
        </div>
      </div>
    </section>
  );
}
