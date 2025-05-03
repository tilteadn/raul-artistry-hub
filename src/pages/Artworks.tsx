
import { useState, useEffect } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { Artwork } from "@/types/artwork";
import { getPaginatedArtworks, getCollections } from "@/utils/artworkService";
import { Loader2 } from "lucide-react";
import ArtworkGrid from "@/components/ArtworkGrid";
import { toast } from "@/hooks/use-toast";
import MetaTags from "@/components/MetaTags";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ITEMS_PER_PAGE = 9; // Number of artworks per page

const Artworks = () => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [collections, setCollections] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalArtworks, setTotalArtworks] = useState(0);
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const collectionFilter = searchParams.get("coleccion") || "todas";
  const pageParam = searchParams.get("page");
  const currentPage = pageParam ? parseInt(pageParam) : 1;

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

  // Load artworks with pagination
  useEffect(() => {
    const loadArtworks = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log(`Loading paginated artworks for page ${currentPage} with ${ITEMS_PER_PAGE} items per page...`);
        const collection = collectionFilter === "todas" ? undefined : collectionFilter;
        const result = await getPaginatedArtworks(currentPage, ITEMS_PER_PAGE, collection);
        
        console.log(`Loaded ${result.artworks.length} artworks (page ${currentPage}/${result.totalPages}, total: ${result.total})`);
        setArtworks(result.artworks);
        setTotalPages(result.totalPages);
        setTotalArtworks(result.total);
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
  }, [currentPage, collectionFilter, location.pathname]);

  // Handle collection filter change
  const handleCollectionChange = (value: string) => {
    // Update URL params and reset to page 1 when changing collection
    setSearchParams(params => {
      if (value === "todas") {
        params.delete("coleccion");
      } else {
        params.set("coleccion", value);
      }
      params.set("page", "1"); // Reset to page 1
      return params;
    });
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setSearchParams(params => {
      params.set("page", page.toString());
      return params;
    });
    
    // Scroll to top when changing pages
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

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
          <>
            <ArtworkGrid 
              artworks={artworks} 
              loading={false} 
              collection={collectionFilter !== "todas" ? collectionFilter : undefined} 
              currentPage={currentPage}
              totalPages={totalPages}
              itemsPerPage={ITEMS_PER_PAGE}
              onPageChange={handlePageChange}
            />
            
            {totalArtworks > 0 && (
              <p className="text-center text-sm text-muted-foreground mt-8">
                Mostrando {artworks.length} de {totalArtworks} obras
                {collectionFilter !== "todas" ? ` en la colección "${collectionFilter}"` : ""}
              </p>
            )}
          </>
        )}
      </section>
    </div>
  );
};

export default Artworks;
