import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { SweetOrderLogo } from "@/lib/sweetorder-logo";
import { Home, AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="container flex flex-col items-center justify-center page-container mt-16 md:mt-0">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <SweetOrderLogo className="w-24 h-24 md:w-32 md:h-32" />
        </div>
        <div className="flex items-center justify-center mb-4">
          <AlertCircle className="h-10 w-10 text-[#f74ea7] mr-2" />
          <h1 className="text-5xl font-bold text-gray-900">404</h1>
        </div>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Página não encontrada
        </h2>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">
          Desculpe, não conseguimos encontrar a página que você está procurando. 
          Ela pode ter sido movida ou não existe mais.
        </p>
        <Link href="/">
          <Button className="rounded-full px-6 py-5 bg-[#f74ea7] hover:bg-[#f74ea7]/90">
            <Home className="h-4 w-4 mr-2" />
            Voltar para Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
