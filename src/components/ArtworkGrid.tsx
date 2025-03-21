import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Artwork } from "@/types/artwork";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { ImageOff } from "lucide-react";

interface ArtworkGridProps {
  artworks: Artwork[];
  collection?: string;
  loading?: boolean;
}

const ArtworkGrid = ({ artworks, collection, loading = false }: ArtworkGridProps) => {
  return (
    <div className="artwork-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {loading ? (
        // Loading skeletons
        Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <Skeleton className="w-full aspect-[3/4]" />
            <CardContent className="p-4">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </CardContent>
          </Card>
        ))
      ) : artworks.length > 0 ? (
        artworks.map((artwork) => (
          <ArtworkCard key={artwork.id} artwork={artwork} />
        ))
      ) : (
        <div className="col-span-full text-center py-12">
          <p className="text-muted-foreground">
            {collection
              ? `No se encontraron obras en la colección "${collection}".`
              : "No se encontraron obras."}
          </p>
        </div>
      )}
    </div>
  );
};

interface ArtworkCardProps {
  artwork: Artwork;
}

const ArtworkCard = ({ artwork }: ArtworkCardProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);

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

    const currentElement = document.getElementById(`artwork-${artwork.id}`);
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
      // For all images, we'll set them to loaded immediately
      // but still keep error handling for safety
      setIsLoaded(false);
      setHasError(false);
      
      // Reset the error state when artwork changes
      const img = new Image();
      img.src = artwork.imageUrl;
      img.onload = () => {
        setIsLoaded(true);
        setHasError(false);
      };
      img.onerror = () => {
        console.error(`Failed to load image for artwork: ${artwork.title}`);
        setHasError(true);
        setIsLoaded(true); // Consider it "loaded" even though it errored
      };
    }
  }, [isInView, artwork.imageUrl, artwork.title]);

  // Use a fallback image color or pattern when image fails to load
  const fallbackBgColor = `hsl(${parseInt(artwork.id) * 60 % 360}, 70%, 80%)`;

  return (
    <Link to={`/obras/${artwork.id}`}>
      <Card 
        id={`artwork-${artwork.id}`} 
        className={cn(
          "artwork-card overflow-hidden border-0 shadow-none group",
          isInView ? "animate-slide-up" : "opacity-0"
        )}
      >
        <div 
          className={cn(
            "relative w-full aspect-[3/4] overflow-hidden blur-load",
            isLoaded && "loaded"
          )}
          style={{ 
            backgroundColor: hasError ? fallbackBgColor : undefined
          }}
        >
          {hasError ? (
            <div className="w-full h-full flex items-center justify-center bg-muted">
              <div className="text-center">
                <ImageOff className="w-12 h-12 mx-auto text-muted-foreground opacity-50" />
                <p className="mt-2 text-sm text-muted-foreground">{artwork.title}</p>
              </div>
            </div>
          ) : (
            <img
              src={artwork.imageUrl}
              alt={artwork.title}
              className={cn(
                "w-full h-full object-cover transition-transform duration-700 group-hover:scale-105",
                isLoaded ? "opacity-100" : "opacity-50"
              )}
              loading="lazy"
              onError={() => setHasError(true)}
            />
          )}
        </div>
        <CardContent className="p-4 bg-white">
          <h3 className="font-serif text-xl font-medium text-primary transition-colors group-hover:text-primary/80">
            {artwork.title}
          </h3>
          <p className="text-sm text-muted-foreground">{artwork.subtitle}</p>
          <p className="text-xs text-muted-foreground mt-1">{artwork.collection}</p>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ArtworkGrid;
