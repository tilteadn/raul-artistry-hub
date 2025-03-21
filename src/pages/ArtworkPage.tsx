
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import ArtworkDetail from "@/components/ArtworkDetail";
import ArtworkGrid from "@/components/ArtworkGrid";
import { Artwork } from "@/types/artwork";
import { getArtworkById, getRelatedArtworks } from "@/utils/artworkService";

const ArtworkPage = () => {
  const { id } = useParams<{ id: string }>();
  const [artwork, setArtwork] = useState<Artwork | null>(null);
  const [relatedArtworks, setRelatedArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadArtwork = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        // In a real app, these would be API calls
        const artworkData = await getArtworkById(id);
        setArtwork(artworkData);
        
        if (artworkData) {
          const related = await getRelatedArtworks(artworkData.collection, id);
          setRelatedArtworks(related);
        }
      } catch (error) {
        console.error("Error loading artwork:", error);
      } finally {
        setLoading(false);
      }
    };

    loadArtwork();
  }, [id]);

  if (!id) {
    return <div>ID de obra no válido</div>;
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

        <ArtworkDetail artwork={artwork as Artwork} loading={loading} />
        
        {relatedArtworks.length > 0 && (
          <div className="mt-24">
            <h2 className="font-serif text-2xl font-medium text-primary mb-8">
              Obras relacionadas
            </h2>
            <ArtworkGrid artworks={relatedArtworks} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ArtworkPage;
