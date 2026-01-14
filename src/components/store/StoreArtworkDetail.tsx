import { useState, useEffect } from "react";
import { MessageCircle, ImageOff } from "lucide-react";
import { Artwork } from "@/types/artwork";
import { getImageUrl } from "@/utils/artwork/artworkService";
import { generateWhatsAppLink } from "@/utils/store/storeService";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { getAspectRatioClass } from "@/utils/artwork/imageUtils";

interface StoreArtworkDetailProps {
  artwork: Artwork;
  type: 'original' | 'print';
}

// TODO: Replace with actual WhatsApp Business number
const WHATSAPP_NUMBER = "34XXXXXXXXX";

const StoreArtworkDetail = ({ artwork, type }: StoreArtworkDetailProps) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [hasImageError, setHasImageError] = useState(false);

  const imageUrl = getImageUrl(artwork.imageUrl);
  const aspectRatioClass = getAspectRatioClass(artwork.orientation);
  const price = type === 'original' ? artwork.originalPrice : artwork.printPrice;
  const isAvailable = type === 'original' ? artwork.originalAvailable : true;

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    return false;
  };

  useEffect(() => {
    if (artwork?.imageUrl) {
      setIsImageLoaded(false);
      setHasImageError(false);
      
      const img = new Image();
      img.src = imageUrl;
      
      img.onload = () => {
        setIsImageLoaded(true);
        setHasImageError(false);
      };
      
      img.onerror = () => {
        console.error(`Failed to load image for artwork: ${artwork.title}`);
        setHasImageError(true);
        setIsImageLoaded(true);
      };
    }
  }, [artwork, imageUrl]);

  const whatsappLink = generateWhatsAppLink(artwork, type, WHATSAPP_NUMBER);

  const artworkAltText = `${artwork.title}${artwork.subtitle ? ` - ${artwork.subtitle}` : ''} - Obra de Raúl Álvarez`;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
      {/* Image */}
      <div className="w-full md:sticky md:top-24 h-fit">
        {hasImageError ? (
          <div 
            className={cn(
              "w-full flex items-center justify-center rounded-lg bg-muted",
              aspectRatioClass
            )}
          >
            <div className="text-center p-8">
              <ImageOff className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-xl font-medium text-muted-foreground">{artwork.title}</h3>
              <p className="text-sm text-muted-foreground mt-2">La imagen no está disponible</p>
            </div>
          </div>
        ) : (
          <div 
            className={cn(
              "relative w-full overflow-hidden rounded-lg",
              aspectRatioClass,
              isImageLoaded ? "opacity-100" : "opacity-50"
            )}
            onContextMenu={handleContextMenu}
          >
            <img
              src={imageUrl}
              alt={artworkAltText}
              className={cn(
                "w-full h-full object-cover transition-opacity duration-700",
                artwork.orientation === 'landscape' ? "object-contain" : "object-cover"
              )}
              onError={() => setHasImageError(true)}
              onLoad={() => setIsImageLoaded(true)}
              draggable="false"
            />
          </div>
        )}
      </div>
      
      {/* Details */}
      <div className="space-y-6 px-4 md:px-0">
        <div>
          <div className="flex items-start justify-between gap-4 mb-2">
            <h1 className="font-serif text-3xl md:text-4xl font-medium text-primary">
              {artwork.title}
            </h1>
            <Badge variant={type === 'original' ? 'default' : 'secondary'} className="shrink-0">
              {type === 'original' ? 'Original' : 'Lámina'}
            </Badge>
          </div>
          {artwork.subtitle && (
            <p className="text-xl text-muted-foreground">{artwork.subtitle}</p>
          )}
        </div>

        {/* Price */}
        {price && (
          <div className="py-4 border-y border-border">
            <p className="text-3xl font-medium text-primary">
              {price.toLocaleString('es-ES')} €
            </p>
            {!isAvailable && type === 'original' && (
              <p className="text-sm text-destructive mt-1">Original vendido</p>
            )}
          </div>
        )}

        {artwork.description && (
          <p className="text-muted-foreground leading-relaxed">
            {artwork.description}
          </p>
        )}
        
        {/* WhatsApp CTA */}
        <Button 
          asChild 
          size="lg" 
          className="w-full bg-[#25D366] hover:bg-[#20BA5A] text-white"
          disabled={!isAvailable && type === 'original'}
        >
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
            <MessageCircle className="mr-2 h-5 w-5" />
            Contactar por WhatsApp
          </a>
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          Al hacer clic serás redirigido a WhatsApp para consultar sobre esta obra.
        </p>

        {/* Details */}
        <div className="pt-4 border-t border-border">
          <h2 className="font-serif text-lg font-medium mb-3">Detalles</h2>
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

export default StoreArtworkDetail;
