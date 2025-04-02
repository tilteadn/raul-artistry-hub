
import { useState, useEffect } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { Artwork } from "@/types/artwork";
import { getAllArtworks, getCollections } from "@/utils/artworkService";
import { Loader2 } from "lucide-react";
import ArtworkGrid from "@/components/ArtworkGrid";
import { toast } from "@/hooks/use-toast";
import MetaTags from "@/components/MetaTags";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Artworks = () => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [collections, setCollections] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const collectionFilter = searchParams.get("coleccion") || "todas";

  // Load collections
  useEffect(() => {
    const loadCollections = async () => {
      try {
        const collectionsData = await getCollections();
        const collectionNames = collectionsData.map((c) => c.name);
        setCollections(collectionNames);
      } catch (err) {
        console.error("Error loading collections:", err);
      }
    };

    loadCollections();
  }, []);

  // Load artworks
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

  // Handle collection filter change
  const handleCollectionChange = (value: string) => {
    // Update URL params
    setSearchParams(params => {
      if (value === "todas") {
        params.delete("coleccion");
      } else {
        params.set("coleccion", value);
      }
      return params;
    });
  };

  // Filter artworks based on selected collection
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
        {/* Collection filter tabs */}
        <div className="mb-8 flex justify-center">
          <Tabs 
            value={collectionFilter} 
            onValueChange={handleCollectionChange} 
            className="w-full max-w-3xl"
          >
            <TabsList className="w-full h-auto flex flex-wrap justify-center gap-2 bg-transparent">
              <TabsTrigger 
                value="todas" 
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Todas las obras
              </TabsTrigger>
              
              {collections.map((collection) => (
                <TabsTrigger
                  key={collection}
                  value={collection}
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  {collection}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

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
          <ArtworkGrid artworks={filteredArtworks} loading={false} collection={collectionFilter !== "todas" ? collectionFilter : undefined} />
        )}
      </section>
    </div>
  );
};

export default Artworks;
