
import { useEffect, useState } from "react";
import { Artwork, Collection } from "@/types/artwork";
import ArtworkGrid from "@/components/ArtworkGrid";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAllArtworks, getCollections } from "@/utils/artworkService";
import { Loader2 } from "lucide-react";

const Artworks = () => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [activeCollection, setActiveCollection] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [collectionLoading, setCollectionLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setCollectionLoading(true);
      
      try {
        // Load the artworks
        console.log("Loading artworks for Obras page...");
        const allArtworks = await getAllArtworks();
        setArtworks(allArtworks);
        setLoading(false);
        
        // Load the collections
        console.log("Loading collections for Obras page...");
        const allCollections = await getCollections();
        setCollections(allCollections);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setCollectionLoading(false);
      }
    };

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
            <ArtworkGrid 
              artworks={filteredArtworks} 
              collection={activeCollection === "all" ? undefined : activeCollection}
              loading={loading} 
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Artworks;
