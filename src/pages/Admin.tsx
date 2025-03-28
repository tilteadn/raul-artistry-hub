import { useEffect, useState } from "react";
import { toast } from "sonner";
import { v4 as uuidv4 } from 'uuid';
import { LogOut } from "lucide-react";

import AdminPanel from "@/components/AdminPanel";
import AdminAuth from "@/components/AdminAuth";
import { useAdminAuth } from "@/hooks/use-admin-auth";
import { Artwork } from "@/types/artwork";
import { getAllArtworks, saveArtwork, updateArtwork, deleteArtwork } from "@/utils/artworkService";
import { Button } from "@/components/ui/button";

const Admin = () => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, isLoading, logout } = useAdminAuth();

  useEffect(() => {
    if (isAuthenticated) {
      const loadArtworks = async () => {
        try {
          const data = await getAllArtworks();
          setArtworks(data);
        } catch (error) {
          console.error("Error loading artworks:", error);
          toast.error("Error al cargar las obras");
        } finally {
          setLoading(false);
        }
      };

      loadArtworks();
    }
  }, [isAuthenticated]);

  const handleAddArtwork = async (artworkData: Omit<Artwork, "id" | "createdAt">) => {
    try {
      const newArtwork: Artwork = {
        ...artworkData,
        id: uuidv4(),
        createdAt: new Date(),
      };
      
      await saveArtwork(newArtwork);
      setArtworks((prev) => [...prev, newArtwork]);
      return newArtwork;
    } catch (error) {
      console.error("Error adding artwork:", error);
      toast.error("Error al añadir la obra");
      throw error;
    }
  };

  const handleUpdateArtwork = async (
    id: string,
    artworkData: Omit<Artwork, "id" | "createdAt">
  ) => {
    try {
      const existingArtwork = artworks.find((a) => a.id === id);
      
      if (!existingArtwork) {
        throw new Error("Artwork not found");
      }
      
      const updatedArtwork: Artwork = {
        ...existingArtwork,
        ...artworkData,
      };
      
      await updateArtwork(updatedArtwork);
      setArtworks((prev) =>
        prev.map((a) => (a.id === id ? updatedArtwork : a))
      );
      
      return updatedArtwork;
    } catch (error) {
      console.error("Error updating artwork:", error);
      toast.error("Error al actualizar la obra");
      throw error;
    }
  };

  const handleDeleteArtwork = async (id: string) => {
    try {
      await deleteArtwork(id);
      setArtworks((prev) => prev.filter((a) => a.id !== id));
    } catch (error) {
      console.error("Error deleting artwork:", error);
      toast.error("Error al eliminar la obra");
      throw error;
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-6 py-16">
        <div className="h-96 flex items-center justify-center">
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
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
        {isAuthenticated ? (
          <AdminPanel
            artworks={artworks}
            onAddArtwork={handleAddArtwork}
            onUpdateArtwork={handleUpdateArtwork}
            onDeleteArtwork={handleDeleteArtwork}
          />
        ) : (
          <AdminAuth onAuthenticated={() => {}} />
        )}
      </div>
    </div>
  );
};

export default Admin;
