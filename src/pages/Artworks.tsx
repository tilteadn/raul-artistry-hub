import { useState, useEffect } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { Artwork } from "@/types/artwork";
import { getAllArtworks } from "@/utils/artworkService";
import { Loader2 } from "lucide-react";
import ArtworkGrid from "@/components/ArtworkGrid";
import { toast } from "@/hooks/use-toast";
import MetaTags from "@/components/MetaTags";

interface ArtworksProps {}

const Artworks = () => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const collectionFilter = searchParams.get("coleccion") || "todas";

  useEffect(() => {
    const loadArtworks = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log("Loading artworks from database...");
        const data = await getAllArtworks();
        console.log(`Loaded ${data.length} artworks`);
        setArtworks(data);
      } catch (err) {
        console.error("Error loading artworks:", err);
        setError("Error al cargar las obras");
        toast({
          title: "Error",
          description: "Error al cargar las obras desde la base de datos",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadArtworks();
  }, [location.pathname]);

  const filteredArtworks =
    collectionFilter === "todas"
      ? artworks
      : artworks.filter((artwork) => artwork.collection === collectionFilter);

  return (
    <div className="min-h-screen">
      <MetaTags 
        title="Obras | Raúl Álvarez - Artista Plástico y Tatuador"
        description="Explora la colección completa de obras artísticas de Raúl Álvarez. Pinturas, ilustraciones y arte figurativo contemporáneo."
        keywords="obras de arte, pinturas, Raúl Álvarez, colección artística, A Coruña, arte contemporáneo"
        canonicalUrl="https://raulalvarezpintura.es/obras"
        type="website"
      />
      
      <div className="bg-secondary py-20">
        <div className="container mx-auto px-6">
          <h1 className="font-serif text-4xl md:text-5xl font-medium text-primary text-center mb-4">
            Obras
          </h1>
          <p className="text-muted-foreground text-center max-w-2xl mx-auto">
            Explora la colección completa de obras artísticas.
          </p>
        </div>
      </div>

      <section className="container mx-auto px-6 py-20">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-12 bg-secondary/50 rounded-lg">
            <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
            <p className="text-center text-muted-foreground">
              Cargando obras...
            </p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center p-12 bg-destructive/10 rounded-lg">
            <p className="text-center text-destructive">
              {error}
            </p>
          </div>
        ) : (
          <ArtworkGrid artworks={filteredArtworks} loading={false} />
        )}
      </section>
    </div>
  );
};

export default Artworks;
