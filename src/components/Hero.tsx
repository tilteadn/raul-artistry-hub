
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface HeroProps {
  title?: string;
  subtitle?: string;
  image?: string;
  imageAlt?: string;
  ctaText?: string;
  ctaLink?: string;
}

const Hero = ({
  title = "Raúl Álvarez",
  subtitle = "Arte y expresión visual",
  image = "/lovable-uploads/iceberg.jpg",
  imageAlt = "Obra de arte de Raúl Álvarez",
  ctaText = "Ver Obras",
  ctaLink = "/obras",
}: HeroProps) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = image;
    img.onload = () => {
      setIsLoaded(true);
    };
  }, [image]);

  return (
    <div className="relative w-full h-[90vh] overflow-hidden">
      <div
        className={cn(
          "absolute inset-0 bg-cover bg-center transition-opacity duration-1000",
          isLoaded ? "opacity-100" : "opacity-0"
        )}
        style={{ backgroundImage: `url(${image})` }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-black/40" />
      
      <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-6">
        <div className={cn(
          "max-w-3xl transition-all duration-1000 transform",
          isLoaded ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        )}>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-light text-white mb-4">{title}</h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-xl mx-auto">{subtitle}</p>
          <Button asChild className="bg-white hover:bg-white/90 text-primary rounded-none px-8 py-6">
            <Link to={ctaLink} className="text-base">
              {ctaText}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
