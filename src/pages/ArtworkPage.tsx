
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import ArtworkDetail from "@/components/ArtworkDetail";
import ArtworkGrid from "@/components/ArtworkGrid";
import { Artwork } from "@/types/artwork";
import { getArtworkById, getRelatedArtworks } from "@/utils/artworkService";
import { toast } from "@/hooks/use-toast";

const ArtworkPage = () => {
  const { id } = useParams<{ id: string }>();
  const [artwork, setArtwork] = useState<Artwork | null>(null);
  const [relatedArtworks, setRelatedArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [relatedLoading, setRelatedLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [relatedError, setRelatedError] = useState<string | null>(null);

  const loadArtwork = async () => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    try {
      const artworkData = await getArtworkById(id);
      if (!artworkData) {
        setError("No se encontró la obra solicitada");
        toast({
          title: "Error",
          description: "No se encontró la obra solicitada",
          variant: "destructive",
        });
        return;
      }
      
      setArtwork(artworkData);
      
      // Load related artworks
      setRelatedLoading(true);
      setRelatedError(null);
      try {
        const related = await getRelatedArtworks(artworkData.collection, id);
        setRelatedArtworks(related);
      } catch (relatedErr) {
        console.error("Error loading related artworks:", relatedErr);
        setRelatedError("No se pudieron cargar las obras relacionadas");
        toast({
          title: "Advertencia",
          description: "No se pudieron cargar las obras relacionadas",
        });
      } finally {
        setRelatedLoading(false);
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

  useEffect(() => {
    loadArtwork();
  }, [id]);

  if (!id) {
    return (
      <div className="container mx-auto px-6 py-16">
        <div className="bg-destructive/10 p-8 rounded-lg text-center">
          <h2 className="text-2xl font-medium text-destructive mb-4">ID de obra no válido</h2>
          <Button asChild>
            <Link to="/obras">Volver a Obras</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-6 py-16">
        <Button asChild variant="ghost" className="mb-8">
          <Link to="/obras" className="group flex items-center gap-2">
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Volver a Obras
          </Link>
        </Button>

        {error ? (
          <div className="flex flex-col items-center justify-center p-12 bg-destructive/10 rounded-lg">
            <p className="text-center text-destructive mb-4">
              {error}
            </p>
            <Button 
              variant="outline" 
              onClick={loadArtwork}
              className="flex items-center"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Reintentar
            </Button>
          </div>
        ) : (
          <ArtworkDetail artwork={artwork as Artwork} loading={loading} />
        )}
        
        {relatedArtworks.length > 0 && (
          <div className="mt-24">
            <h2 className="font-serif text-2xl font-medium text-primary mb-8">
              Obras relacionadas
            </h2>
            {relatedError ? (
              <div className="p-6 bg-destructive/10 rounded-lg">
                <p className="text-destructive text-center">{relatedError}</p>
              </div>
            ) : (
              <ArtworkGrid artworks={relatedArtworks} loading={relatedLoading} />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ArtworkPage;
