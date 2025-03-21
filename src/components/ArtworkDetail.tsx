
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Artwork } from "@/types/artwork";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface ArtworkDetailProps {
  artwork: Artwork;
  loading?: boolean;
}

const ArtworkDetail = ({ artwork, loading = false }: ArtworkDetailProps) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  useEffect(() => {
    if (artwork && artwork.imageUrl) {
      const img = new Image();
      img.src = artwork.imageUrl;
      img.onload = () => setIsImageLoaded(true);
    }
  }, [artwork]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
        <div className="w-full aspect-[3/4] md:sticky md:top-24">
          <Skeleton className="w-full h-full" />
        </div>
        <div className="space-y-6 px-4 md:px-0">
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-6 w-1/2" />
          <div className="space-y-2 mt-8">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          <div className="space-y-2 pt-4">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-1/4" />
          </div>
        </div>
      </div>
    );
  }

  if (!artwork) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">No se encontró la obra.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
      <div className="w-full md:sticky md:top-24 h-fit">
        <div 
          className={cn(
            "relative w-full aspect-[3/4] overflow-hidden blur-load",
            isImageLoaded && "loaded"
          )}
          style={{ backgroundImage: `url(${artwork.thumbnailUrl || artwork.imageUrl})` }}
        >
          <img
            src={artwork.imageUrl}
            alt={artwork.title}
            className={cn(
              "w-full h-full object-cover transition-opacity duration-700",
              isImageLoaded ? "opacity-100" : "opacity-0"
            )}
          />
        </div>
      </div>
      <div className="space-y-6 px-4 md:px-0">
        <h1 className="font-serif text-3xl md:text-4xl font-medium text-primary">
          {artwork.title}
        </h1>
        <p className="text-xl text-muted-foreground">{artwork.subtitle}</p>
        
        {artwork.description && (
          <p className="text-muted-foreground leading-relaxed">
            {artwork.description}
          </p>
        )}
        
        <div className="pt-4 border-t border-border">
          <h2 className="font-serif text-lg font-medium mb-2">Detalles</h2>
          <dl className="grid grid-cols-2 gap-2 text-sm">
            <dt className="text-muted-foreground">Colección:</dt>
            <dd>{artwork.collection}</dd>
            
            {artwork.year && (
              <>
                <dt className="text-muted-foreground">Año:</dt>
                <dd>{artwork.year}</dd>
              </>
            )}
            
            {artwork.technique && (
              <>
                <dt className="text-muted-foreground">Técnica:</dt>
                <dd>{artwork.technique}</dd>
              </>
            )}
            
            {artwork.dimensions && (
              <>
                <dt className="text-muted-foreground">Dimensiones:</dt>
                <dd>{artwork.dimensions}</dd>
              </>
            )}
          </dl>
        </div>
      </div>
    </div>
  );
};

export default ArtworkDetail;
