
import { useEffect, useState } from "react";
import { Artwork, Collection } from "@/types/artwork";
import ArtworkGrid from "@/components/ArtworkGrid";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAllArtworks, getCollections } from "@/utils/artworkService";
import { Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

const Artworks = () => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [activeCollection, setActiveCollection] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [collectionLoading, setCollectionLoading] = useState(true);
  const [artworksError, setArtworksError] = useState<string | null>(null);
  const [collectionsError, setCollectionsError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    setCollectionLoading(true);
    setArtworksError(null);
    setCollectionsError(null);
    
    try {
      // Load the artworks
      console.log("Loading artworks for Obras page...");
      const allArtworks = await getAllArtworks();
      setArtworks(allArtworks);
      setLoading(false);
    } catch (error) {
      console.error("Error loading artworks:", error);
      setArtworksError("No se pudieron cargar las obras. Por favor, intente nuevamente más tarde.");
      toast({
        title: "Error",
        description: "No se pudieron cargar las obras",
        variant: "destructive",
      });
      setLoading(false);
    }
    
    try {
      // Load the collections
      console.log("Loading collections for Obras page...");
      const allCollections = await getCollections();
      setCollections(allCollections);
    } catch (error) {
      console.error("Error loading collections:", error);
      setCollectionsError("No se pudieron cargar las colecciones. Por favor, intente nuevamente más tarde.");
      toast({
        title: "Error",
        description: "No se pudieron cargar las colecciones",
        variant: "destructive",
      });
    } finally {
      setCollectionLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredArtworks = activeCollection === "all" 
    ? artworks 
    : artworks.filter(artwork => artwork.collection === activeCollection);

  return (
    <div className="min-h-screen">
      <div className="bg-secondary py-20">
        <div className="container mx-auto px-6">
          <h1 className="font-serif text-4xl md:text-5xl font-medium text-primary text-center mb-4">
            Obras
          </h1>
          <p className="text-muted-foreground text-center max-w-2xl mx-auto">
            Explora la colección completa de obras de Raúl Álvarez, una expresión visual
            a través de diferentes técnicas, estilos y emociones.
          </p>
        </div>
      </div>
      
      <div className="container mx-auto px-6 py-16">
        <Tabs 
          defaultValue="all" 
          value={activeCollection}
          onValueChange={setActiveCollection}
          className="mb-12"
        >
          <div className="overflow-x-auto pb-2">
            {collectionLoading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="w-6 h-6 text-primary animate-spin mr-2" />
                <span className="text-muted-foreground">Cargando colecciones...</span>
              </div>
            ) : collectionsError ? (
              <div className="flex items-center justify-center py-4 px-6 bg-destructive/10 rounded-lg">
                <p className="text-destructive text-sm mr-4">{collectionsError}</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={loadData}
                  className="flex items-center"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reintentar
                </Button>
              </div>
            ) : (
              <TabsList className="h-auto p-1 inline-flex min-w-full md:min-w-0">
                <TabsTrigger value="all" className="px-4 py-2">
                  Todas
                </TabsTrigger>
                {collections.map((collection) => (
                  <TabsTrigger
                    key={collection.id}
                    value={collection.name}
                    className="px-4 py-2"
                  >
                    {collection.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            )}
          </div>
          
          <TabsContent value={activeCollection} className="mt-8">
            {artworksError ? (
              <div className="flex flex-col items-center justify-center p-12 bg-destructive/10 rounded-lg">
                <p className="text-center text-destructive mb-4">
                  {artworksError}
                </p>
                <Button 
                  variant="outline" 
                  onClick={loadData}
                  className="flex items-center"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reintentar
                </Button>
              </div>
            ) : (
              <ArtworkGrid 
                artworks={filteredArtworks} 
                collection={activeCollection === "all" ? undefined : activeCollection}
                loading={loading} 
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Artworks;
