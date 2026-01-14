import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getStoreArtworks } from "@/utils/store/storeService";
import { Artwork } from "@/types/artwork";
import StoreGrid from "@/components/store/StoreGrid";
import MetaTags from "@/components/MetaTags";
import { Skeleton } from "@/components/ui/skeleton";

const Store = () => {
  const [originals, setOriginals] = useState<Artwork[]>([]);
  const [prints, setPrints] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("originals");

  useEffect(() => {
    const loadStoreArtworks = async () => {
      try {
        setLoading(true);
        const { originals, prints } = await getStoreArtworks();
        setOriginals(originals);
        setPrints(prints);
      } catch (error) {
        console.error("Error loading store artworks:", error);
      } finally {
        setLoading(false);
      }
    };

    loadStoreArtworks();
  }, []);

  return (
    <>
      <MetaTags
        title="Tienda | Raúl Álvarez"
        description="Adquiere obras originales y láminas de arte de Raúl Álvarez. Pinturas originales y reproducciones de alta calidad disponibles."
        canonicalUrl="https://raulalvarezpintura.es/tienda"
      />

      <div className="min-h-screen pt-24 pb-16 px-4 md:px-8">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h1 className="font-serif text-4xl md:text-5xl font-medium text-primary mb-4">
              Tienda
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Descubre las obras disponibles para adquirir. Originales únicos y láminas de alta calidad.
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
              <TabsTrigger value="originals" className="text-base">
                Originales
                {!loading && originals.length > 0 && (
                  <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                    {originals.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="prints" className="text-base">
                Láminas
                {!loading && prints.length > 0 && (
                  <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                    {prints.length}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="originals" className="mt-0">
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <Skeleton key={i} className="aspect-[3/4] rounded-lg" />
                  ))}
                </div>
              ) : originals.length > 0 ? (
                <StoreGrid artworks={originals} type="original" />
              ) : (
                <div className="text-center py-16">
                  <p className="text-muted-foreground text-lg">
                    No hay originales disponibles en este momento.
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Vuelve pronto para ver nuevas obras.
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="prints" className="mt-0">
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <Skeleton key={i} className="aspect-[3/4] rounded-lg" />
                  ))}
                </div>
              ) : prints.length > 0 ? (
                <StoreGrid artworks={prints} type="print" />
              ) : (
                <div className="text-center py-16">
                  <p className="text-muted-foreground text-lg">
                    No hay láminas disponibles en este momento.
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Vuelve pronto para ver nuevas obras.
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default Store;
