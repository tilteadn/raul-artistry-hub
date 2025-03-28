
import { useState, useEffect } from "react";
import { ImageOff } from "lucide-react";
import { Artwork } from "@/types/artwork";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface ArtworkDetailProps {
  artwork: Artwork;
  loading?: boolean;
}

const ArtworkDetail = ({ artwork, loading = false }: ArtworkDetailProps) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [hasImageError, setHasImageError] = useState(false);

  // Handler to prevent right-click
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    return false;
  };

  useEffect(() => {
    if (artwork && artwork.imageUrl) {
      setIsImageLoaded(false);
      setHasImageError(false);
      
      const img = new Image();
      img.src = artwork.imageUrl;
      
      img.onload = () => {
        setIsImageLoaded(true);
        setHasImageError(false);
      };
      
      img.onerror = () => {
        console.error(`Failed to load image for artwork: ${artwork.title}`);
        setHasImageError(true);
        setIsImageLoaded(true); // Consider it "loaded" even though it errored
      };
    }
  }, [artwork]);

  // Disable keyboard shortcuts for saving images
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Block Ctrl+S, Ctrl+U and other saving-related shortcuts
      if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'u')) {
        e.preventDefault();
        return false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const fallbackBgColor = artwork?.id ? 
    `hsl(${parseInt(artwork.id) * 60 % 360}, 70%, 80%)` : 
    "hsl(200, 70%, 80%)";

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
        {hasImageError ? (
          <div 
            className="w-full aspect-[3/4] flex items-center justify-center rounded-lg"
            style={{ backgroundColor: fallbackBgColor }}
          >
            <div className="text-center p-8">
              <ImageOff className="w-16 h-16 mx-auto text-primary/20 mb-4" />
              <h3 className="text-xl font-medium text-primary/60">{artwork.title}</h3>
              <p className="text-sm text-primary/60 mt-2">La imagen no está disponible</p>
            </div>
          </div>
        ) : (
          <div 
            className={cn(
              "relative w-full aspect-[3/4] overflow-hidden rounded-lg",
              isImageLoaded ? "opacity-100" : "opacity-50"
            )}
            onContextMenu={handleContextMenu}
          >
            <img
              src={artwork.imageUrl}
              alt={artwork.title}
              className="w-full h-full object-cover transition-opacity duration-700"
              onError={() => setHasImageError(true)}
              onLoad={() => setIsImageLoaded(true)}
              draggable="false"
            />
            <div className="absolute inset-0 select-none pointer-events-none">
              {/* Visible watermark */}
              <div className="absolute bottom-0 right-0 p-3 text-white text-sm font-light rotate-[-30deg] transform origin-bottom-right">
                © Raúl Álvarez
              </div>
              
              {/* Invisible overlay to help prevent screen capture */}
              <div className="absolute inset-0 bg-transparent"></div>
            </div>
          </div>
        )}
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
