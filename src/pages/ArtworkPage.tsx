import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Artwork } from "@/types/artwork";
import { getArtworkById, getImageUrl } from "@/utils/artwork/artworkService";
import ArtworkDetail from "@/components/ArtworkDetail";
import { toast } from "@/hooks/use-toast";
import MetaTags from "@/components/MetaTags";

type ArtworkParams = {
  id: string;
};

const ArtworkPage = () => {
  const { id } = useParams<ArtworkParams>();
  const [artwork, setArtwork] = useState<Artwork | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("ID de obra no válido.");
      setLoading(false);
      return;
    }

    const loadArtwork = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log(`Loading artwork with ID: ${id}`);
        const artworkData = await getArtworkById(id);
        if (artworkData) {
          setArtwork(artworkData);
          console.log(`Artwork loaded successfully: ${artworkData.title}`);
        } else {
          setError("Obra no encontrada.");
          console.warn(`Artwork with ID ${id} not found`);
        }
      } catch (err) {
        console.error("Error loading artwork:", err);
        setError("No se pudo cargar la obra. Por favor, intente nuevamente más tarde.");
        toast({
          title: "Error",
          description: "No se pudo cargar la obra",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadArtwork();
  }, [id]);
  
  const metaTitle = artwork ? `${artwork.title} | Raúl Álvarez` : "Obra | Raúl Álvarez";
  const metaDescription = artwork 
    ? `${artwork.title}${artwork.subtitle ? ` - ${artwork.subtitle}` : ''} - Obra de arte de Raúl Álvarez, ${artwork.technique || ''} (${artwork.year || 'n/a'})`
    : "Detalle de obra artística de Raúl Álvarez, artista plástico y tatuador en A Coruña.";
  const metaImage = artwork ? getImageUrl(artwork.imageUrl) : "/lovable-uploads/raulRetrato.jpg";
  
  return (
    <div className="min-h-screen">
      <MetaTags 
        title={metaTitle}
        description={metaDescription}
        imageUrl={metaImage}
        canonicalUrl={artwork ? `https://raulalvarezpintura.es/obras/${artwork.id}` : undefined}
        type="article"
      />
      
      <div className="bg-secondary py-8">
        <div className="container mx-auto px-6">
          <Button asChild variant="ghost" className="hover:bg-secondary/80">
            <Link to="/obras" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Volver a Obras
            </Link>
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-12 bg-secondary/50 rounded-lg">
            <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
            <p className="text-center text-muted-foreground">
              Cargando obra...
            </p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center p-12 bg-destructive/10 rounded-lg">
            <p className="text-center text-destructive">
              {error}
            </p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => window.location.reload()}
            >
              Reintentar
            </Button>
          </div>
        ) : (
          <ArtworkDetail artwork={artwork} />
        )}
      </div>
    </div>
  );
};

export default ArtworkPage;
