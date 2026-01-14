import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Artwork } from "@/types/artwork";
import { getImageUrl } from "@/utils/artwork/artworkService";
import { getAspectRatioClass } from "@/utils/artwork/imageUtils";
import { cn } from "@/lib/utils";
import { ImageOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface StoreGridProps {
  artworks: Artwork[];
  type: 'original' | 'print';
}

const StoreGrid = ({ artworks, type }: StoreGridProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {artworks.map((artwork) => (
        <StoreCard key={artwork.id} artwork={artwork} type={type} />
      ))}
    </div>
  );
};

interface StoreCardProps {
  artwork: Artwork;
  type: 'original' | 'print';
}

const StoreCard = ({ artwork, type }: StoreCardProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  
  // Use thumbnail if available, otherwise fall back to full image
  const imageUrl = artwork.thumbnailUrl 
    ? getImageUrl(artwork.thumbnailUrl) 
    : getImageUrl(artwork.imageUrl);
  
  const price = type === 'original' ? artwork.originalPrice : artwork.printPrice;
  const aspectRatioClass = getAspectRatioClass(artwork.orientation);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    return false;
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    const currentElement = document.getElementById(`store-artwork-${artwork.id}`);
    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [artwork.id]);

  useEffect(() => {
    if (isInView) {
      setIsLoaded(false);
      setHasError(false);
      
      const img = document.createElement('img');
      img.src = imageUrl;
      img.onload = () => {
        setIsLoaded(true);
        setHasError(false);
      };
      img.onerror = () => {
        console.error(`Failed to load image for artwork: ${artwork.title}`);
        setHasError(true);
        setIsLoaded(true);
      };
    }
  }, [isInView, imageUrl, artwork.title]);

  return (
    <Link 
      to={`/tienda/${artwork.id}?type=${type}`}
      id={`store-artwork-${artwork.id}`}
    >
      <Card 
        className={cn(
          "overflow-hidden border-0 shadow-none group",
          isInView ? "animate-slide-up" : "opacity-0"
        )}
      >
        <div 
          className={cn(
            "relative w-full overflow-hidden blur-load",
            aspectRatioClass,
            isLoaded && "loaded"
          )}
          onContextMenu={handleContextMenu}
        >
          {hasError ? (
            <div className="w-full h-full flex items-center justify-center bg-muted">
              <div className="text-center">
                <ImageOff className="w-12 h-12 mx-auto text-muted-foreground opacity-50" />
                <p className="mt-2 text-sm text-muted-foreground">{artwork.title}</p>
              </div>
            </div>
          ) : (
            <>
              <img
                src={imageUrl}
                alt={artwork.title}
                className={cn(
                  "w-full h-full object-cover transition-transform duration-700 group-hover:scale-105",
                  isLoaded ? "opacity-100" : "opacity-50"
                )}
                loading="lazy"
                onError={() => setHasError(true)}
                draggable={false}
              />
              
              {/* Price badge */}
              {price && (
                <Badge 
                  className="absolute top-3 right-3 bg-background/90 text-foreground hover:bg-background/90 backdrop-blur-sm"
                >
                  {price.toLocaleString('es-ES')} €
                </Badge>
              )}
              
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </>
          )}
        </div>
        
        <CardContent className="p-4 bg-white">
          <h3 className="font-serif text-xl font-medium text-primary transition-colors group-hover:text-primary/80">
            {artwork.title}
          </h3>
          {artwork.subtitle && (
            <p className="text-sm text-muted-foreground">
              {artwork.subtitle}
            </p>
          )}
          <p className="text-xs text-muted-foreground mt-1">
            {artwork.collection}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
};

export default StoreGrid;
