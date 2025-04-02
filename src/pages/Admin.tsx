import { useEffect, useState } from "react";
import { LogOut, RefreshCw } from "lucide-react";
import { v4 as uuidv4 } from 'uuid';
import MetaTags from "@/components/MetaTags";

import AdminPanel from "@/components/AdminPanel";
import AdminAuth from "@/components/AdminAuth";
import { useAdminAuth } from "@/hooks/use-admin-auth";
import { Artwork } from "@/types/artwork";
import { getAllArtworks, saveArtwork, updateArtwork, deleteArtwork } from "@/utils/artworkService";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

const Admin = () => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, isLoading, logout, setIsAuthenticated } = useAdminAuth();
  const [showAuthForm, setShowAuthForm] = useState(!isAuthenticated);

  const loadArtworks = async () => {
    if (!isAuthenticated) return;
    
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

  useEffect(() => {
    setShowAuthForm(!isAuthenticated);
    
    if (isAuthenticated) {
      loadArtworks();
    }
  }, [isAuthenticated]);

  const handleSuccessfulAuthentication = (rememberMe: boolean) => {
    if (rememberMe) {
      localStorage.setItem("adminAuthenticated", "true");
    } else {
      sessionStorage.setItem("adminAuthenticated", "true");
    }
    
    setIsAuthenticated(true);
    setShowAuthForm(false);
    
    console.log("Authentication successful, artworks will be loaded");
    
    loadArtworks();
  };

  const handleAddArtwork = async (artworkData: Omit<Artwork, "id" | "createdAt">) => {
    try {
      setIsAdding(true);
      console.log("Adding new artwork:", artworkData.title);
      
      const newArtwork: Artwork = {
        ...artworkData,
        id: uuidv4(),
        createdAt: new Date(),
      };
      
      const savedArtwork = await saveArtwork(newArtwork);
      console.log("Artwork saved successfully:", savedArtwork.id);
      
      await loadArtworks();
      
      toast({
        title: "Éxito",
        description: "Obra añadida correctamente",
      });
      return savedArtwork;
    } catch (error) {
      console.error("Error adding artwork:", error);
      toast({
        title: "Error",
        description: "Error al añadir la obra",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsAdding(false);
    }
  };

  const handleUpdateArtwork = async (
    id: string,
    artworkData: Omit<Artwork, "id" | "createdAt">
  ) => {
    try {
      setIsUpdating(true);
      console.log(`Updating artwork ID: ${id}, Title: ${artworkData.title}`);
      const existingArtwork = artworks.find((a) => a.id === id);
      
      if (!existingArtwork) {
        throw new Error("Artwork not found");
      }
      
      const updatedArtwork: Artwork = {
        ...existingArtwork,
        ...artworkData,
      };
      
      const result = await updateArtwork(updatedArtwork);
      console.log("Artwork updated successfully:", result.id);
      
      await loadArtworks();
      
      toast({
        title: "Éxito",
        description: "Obra actualizada correctamente",
      });
      return result;
    } catch (error) {
      console.error("Error updating artwork:", error);
      toast({
        title: "Error",
        description: "Error al actualizar la obra",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteArtwork = async (id: string) => {
    try {
      setIsDeleting(true);
      console.log(`Deleting artwork ID: ${id}`);
      await deleteArtwork(id);
      
      setArtworks((prev) => prev.filter((a) => a.id !== id));
      toast({
        title: "Éxito",
        description: "Obra eliminada correctamente",
      });
    } catch (error) {
      console.error("Error deleting artwork:", error);
      toast({
        title: "Error",
        description: "Error al eliminar la obra",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-6 py-16">
        <div className="h-96 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="text-muted-foreground">Verificando autenticación...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <MetaTags 
        title="Administración | Raúl Álvarez"
        description="Panel de administración privado para gestionar el contenido del sitio web."
        canonicalUrl="https://raulalvarezpintura.es/admin"
      />
      
      <div className="bg-secondary py-16">
        <div className="container mx-auto px-6">
          <h1 className="font-serif text-4xl md:text-5xl font-medium text-primary text-center mb-4">
            Administración
          </h1>
          <p className="text-muted-foreground text-center max-w-2xl mx-auto">
            {isAuthenticated 
              ? "Gestiona las obras y colecciones de la galería." 
              : "Accede al panel de administración."}
          </p>
          
          {isAuthenticated && (
            <div className="flex justify-center mt-6">
              <Button variant="outline" onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" />
                Cerrar sesión
              </Button>
            </div>
          )}
        </div>
      </div>
      
      <div className="container mx-auto px-6 py-16">
        {showAuthForm ? (
          <AdminAuth onAuthenticated={handleSuccessfulAuthentication} />
        ) : error ? (
          <div className="flex flex-col items-center justify-center p-12 bg-destructive/10 rounded-lg">
            <p className="text-center text-destructive mb-4">
              {error}
            </p>
            <Button 
              variant="outline" 
              onClick={loadArtworks}
              className="flex items-center"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Reintentar
            </Button>
          </div>
        ) : (
          <AdminPanel
            artworks={artworks}
            onAddArtwork={handleAddArtwork}
            onUpdateArtwork={handleUpdateArtwork}
            onDeleteArtwork={handleDeleteArtwork}
            isLoading={loading}
            isAdding={isAdding}
            isUpdating={isUpdating}
            isDeleting={isDeleting}
          />
        )}
      </div>
    </div>
  );
};

export default Admin;
