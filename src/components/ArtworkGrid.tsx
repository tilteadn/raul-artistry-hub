
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Artwork } from "@/types/artwork";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { ImageOff } from "lucide-react";
import { getImageUrl } from "@/utils/artwork/artworkService";
import { 
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface ArtworkGridProps {
  artworks: Artwork[];
  collection?: string;
  loading?: boolean;
  itemsPerPage?: number;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

const ArtworkGrid = ({ 
  artworks, 
  collection, 
  loading = false,
  itemsPerPage = 9,
  currentPage = 1,
  totalPages = 1,
  onPageChange
}: ArtworkGridProps) => {
  return (
    <div className="space-y-8">
      <div className="artwork-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          Array.from({ length: itemsPerPage }).map((_, i) => (
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
            <ArtworkCard key={artwork.id} artwork={artwork} isGridView={true} />
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

      {!loading && totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            {currentPage > 1 && (
              <PaginationItem>
                <PaginationPrevious 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    onPageChange?.(currentPage - 1);
                  }}
                />
              </PaginationItem>
            )}
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              // Show pages around current page
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              
              return (
                <PaginationItem key={pageNum}>
                  <PaginationLink 
                    href="#" 
                    isActive={pageNum === currentPage}
                    onClick={(e) => {
                      e.preventDefault();
                      onPageChange?.(pageNum);
                    }}
                  >
                    {pageNum}
                  </PaginationLink>
                </PaginationItem>
              );
            })}
            
            {currentPage < totalPages && (
              <PaginationItem>
                <PaginationNext 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    onPageChange?.(currentPage + 1);
                  }}
                />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

interface ArtworkCardProps {
  artwork: Artwork;
  isGridView?: boolean;
}

const ArtworkCard = ({ artwork, isGridView = false }: ArtworkCardProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  
  // Use thumbnail in grid view and full image in detail view
  const imageUrlString = isGridView && artwork.thumbnailUrl 
    ? getImageUrl(artwork.thumbnailUrl) 
    : getImageUrl(artwork.imageUrl);

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
      setIsLoaded(false);
      setHasError(false);
      
      const img = document.createElement('img');
      img.src = imageUrlString;
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
  }, [isInView, imageUrlString, artwork.title]);

  const fallbackBgColor = `hsl(${parseInt(artwork.id) * 60 % 360}, 70%, 80%)`;

  const altText = `${artwork.title}${artwork.subtitle ? ` - ${artwork.subtitle}` : ''}${artwork.collection ? ` - Colección: ${artwork.collection}` : ''} - Obra de Raúl Álvarez`;

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
          onContextMenu={handleContextMenu}
        >
          {hasError ? (
            <div className="w-full h-full flex items-center justify-center bg-muted">
              <div className="text-center">
                <ImageOff className="w-12 h-12 mx-auto text-muted-foreground opacity-50" aria-hidden="true" />
                <p className="mt-2 text-sm text-muted-foreground">{artwork.title}</p>
              </div>
            </div>
          ) : (
            <>
              <img
                src={imageUrlString}
                alt={altText}
                className={cn(
                  "w-full h-full object-cover transition-transform duration-700 group-hover:scale-105",
                  isLoaded ? "opacity-100" : "opacity-50"
                )}
                loading="lazy"
                onError={() => setHasError(true)}
                draggable="false"
              />
            </>
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
