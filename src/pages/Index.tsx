import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Hero from "@/components/Hero";
import ArtworkGrid from "@/components/ArtworkGrid";
import { Artwork } from "@/types/artwork";
import { getFeaturedArtworks } from "@/utils/artworkService";
import { toast } from "@/hooks/use-toast";
import MetaTags from "@/components/MetaTags";

const Index = () => {
  const [featuredArtworks, setFeaturedArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadArtworks = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log("Loading featured artworks for Home page...");
        const artworks = await getFeaturedArtworks();
        setFeaturedArtworks(artworks);
        console.log(`Loaded ${artworks.length} featured artworks`);
      } catch (err) {
        console.error("Error loading artworks:", err);
        setError("No se pudieron cargar las obras destacadas. Por favor, intente nuevamente más tarde.");
        toast({
          title: "Error",
          description: "No se pudieron cargar las obras destacadas",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadArtworks();
  }, []);

  return (
    <div className="min-h-screen">
      <MetaTags 
        title="Raúl Álvarez | Artista Plástico y Tatuador en A Coruña"
        description="Bienvenido a la web oficial de Raúl Álvarez, artista plástico y tatuador en A Coruña. Explora su obra artística y conoce su estudio."
        keywords="Raúl Álvarez, pintura, arte, tatuaje, A Coruña, Galicia, artista plástico"
        canonicalUrl="https://raulalvarezpintura.es/"
      />
      
      <Hero />
      
      <section className="container mx-auto px-6 py-20">
        <div className="flex flex-col md:flex-row justify-between items-baseline mb-12">
          <div>
            <h2 className="font-serif text-3xl md:text-4xl font-medium text-primary mb-4">
              Obras Destacadas
            </h2>
            <p className="text-muted-foreground max-w-xl">
              Exploración visual a través de diferentes técnicas y estilos, cada obra refleja
              una expresión única de la creatividad artística.
            </p>
          </div>
          <Button asChild variant="ghost" className="mt-4 md:mt-0">
            <Link to="/obras" className="group flex items-center gap-2">
              Ver todas las obras
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
        
        {loading ? (
          <div className="flex flex-col items-center justify-center p-12 bg-secondary/50 rounded-lg">
            <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
            <p className="text-center text-muted-foreground">
              Cargando obras destacadas...
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
          <ArtworkGrid artworks={featuredArtworks} loading={false} />
        )}
      </section>
      
      <section className="bg-secondary py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-serif text-3xl md:text-4xl font-medium text-primary mb-6">
              Sobre Raúl Álvarez
            </h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Artista multidisciplinar con una pasión por explorar diferentes medios y técnicas.
              Su trabajo refleja una constante búsqueda de expresión visual, navegando entre
              lo figurativo y lo abstracto para crear piezas que invitan a la reflexión y
              conectan con el espectador a un nivel emocional.
            </p>
            <div className="flex justify-center space-x-4">
              <Button asChild variant="outline">
                <a 
                  href="https://www.instagram.com/raulalvarezpintura/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-instagram"
                  >
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                  Instagram Pintura
                </a>
              </Button>
              <Button asChild variant="outline">
                <a 
                  href="https://www.instagram.com/raulalvareztattoo/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-instagram"
                  >
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                  Instagram Tatuajes
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      <section className="container mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-serif text-3xl md:text-4xl font-medium text-primary mb-6">
              ¿Interesado en una obra?
            </h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Si estás interesado en adquirir alguna obra, tienes alguna consulta o deseas
              información sobre encargos, no dudes en contactarme. Estoy disponible para
              responder a cualquier pregunta.
            </p>
            <Button asChild size="lg">
              <Link to="/contacto">Contactar</Link>
            </Button>
          </div>
          <div className="aspect-[4/3] bg-[url('https://images.unsplash.com/photo-1513364776144-60967b0f800f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1471&q=80')] bg-cover bg-center rounded-lg shadow-lg" />
        </div>
      </section>
    </div>
  );
};

export default Index;
