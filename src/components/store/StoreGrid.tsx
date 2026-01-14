import { useState } from "react";
import { Link } from "react-router-dom";
import { Artwork } from "@/types/artwork";
import { getImageUrl } from "@/utils/artwork/artworkService";
import { cn } from "@/lib/utils";
import { ImageOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
  const [imageLoaded, setImageLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  
  const imageUrl = artwork.thumbnailUrl || getImageUrl(artwork.imageUrl);
  const price = type === 'original' ? artwork.originalPrice : artwork.printPrice;

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    return false;
  };

  return (
    <Link 
      to={`/tienda/${artwork.id}?type=${type}`}
      className="group block"
    >
      <div className="relative overflow-hidden rounded-lg bg-muted aspect-[3/4]">
        {hasError ? (
          <div className="absolute inset-0 flex items-center justify-center bg-muted">
            <ImageOff className="w-12 h-12 text-muted-foreground/50" />
          </div>
        ) : (
          <img
            src={imageUrl}
            alt={artwork.title}
            className={cn(
              "w-full h-full object-cover transition-all duration-500",
              "group-hover:scale-105",
              imageLoaded ? "opacity-100" : "opacity-0"
            )}
            onLoad={() => setImageLoaded(true)}
            onError={() => setHasError(true)}
            onContextMenu={handleContextMenu}
            draggable={false}
          />
        )}
        
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
      </div>
      
      <div className="mt-3 space-y-1">
        <h3 className="font-serif text-lg font-medium text-primary group-hover:text-primary/80 transition-colors line-clamp-1">
          {artwork.title}
        </h3>
        {artwork.subtitle && (
          <p className="text-sm text-muted-foreground line-clamp-1">
            {artwork.subtitle}
          </p>
        )}
        <p className="text-xs text-muted-foreground">
          {artwork.collection}
        </p>
      </div>
    </Link>
  );
};

export default StoreGrid;
