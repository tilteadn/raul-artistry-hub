import { useState, useEffect } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { getStoreArtworkById } from "@/utils/store/storeService";
import { Artwork } from "@/types/artwork";
import StoreArtworkDetail from "@/components/store/StoreArtworkDetail";
import MetaTags from "@/components/MetaTags";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

type StoreArtworkParams = {
  id: string;
};

const StoreArtworkPage = () => {
  const { id } = useParams<StoreArtworkParams>();
  const [searchParams] = useSearchParams();
  const type = (searchParams.get('type') as 'original' | 'print') || 'original';
  
  const [artwork, setArtwork] = useState<Artwork | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadArtwork = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        const data = await getStoreArtworkById(id);
        
        if (!data) {
          setError("Obra no encontrada");
          return;
        }
        
        setArtwork(data);
      } catch (err) {
        console.error("Error loading store artwork:", err);
        setError("Error al cargar la obra");
        toast.error("No se pudo cargar la obra");
      } finally {
        setLoading(false);
      }
    };

    loadArtwork();
  }, [id]);

  return (
    <>
      <MetaTags
        title={artwork ? `${artwork.title} | Tienda - Raúl Álvarez` : "Tienda | Raúl Álvarez"}
        description={artwork?.description || "Adquiere esta obra de Raúl Álvarez"}
        imageUrl={artwork?.imageUrl ? String(artwork.imageUrl) : undefined}
        canonicalUrl={`https://raulalvarezpintura.es/tienda/${id}`}
      />

      <div className="min-h-screen pt-24 pb-16 px-4 md:px-8">
        <div className="container mx-auto max-w-6xl">
          <Button
            variant="ghost"
            asChild
            className="mb-6 -ml-2 text-muted-foreground hover:text-primary"
          >
            <Link to="/tienda">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a la tienda
            </Link>
          </Button>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Skeleton className="aspect-[3/4] rounded-lg" />
              <div className="space-y-4">
                <Skeleton className="h-10 w-3/4" />
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg mb-4">{error}</p>
              <Button asChild>
                <Link to="/tienda">Volver a la tienda</Link>
              </Button>
            </div>
          ) : artwork ? (
            <StoreArtworkDetail artwork={artwork} type={type} />
          ) : null}
        </div>
      </div>
    </>
  );
};

export default StoreArtworkPage;
