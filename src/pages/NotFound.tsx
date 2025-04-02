
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import MetaTags from "@/components/MetaTags";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <MetaTags 
        title="Página no encontrada | Raúl Álvarez"
        description="La página que estás buscando no existe o ha sido movida."
        canonicalUrl="https://raulalvarezpintura.es/404"
      />
      
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-4">Lo sentimos, página no encontrada</p>
        <a href="/" className="text-blue-500 hover:text-blue-700 underline">
          Volver a Inicio
        </a>
      </div>
    </div>
  );
};

export default NotFound;
