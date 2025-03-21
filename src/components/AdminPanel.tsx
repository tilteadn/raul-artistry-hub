
import { useState } from "react";
import { Edit, Trash2, Plus, Image } from "lucide-react";
import { toast } from "sonner";
import { Artwork } from "@/types/artwork";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AddArtworkForm from "./AddArtworkForm";

interface AdminPanelProps {
  artworks: Artwork[];
  onAddArtwork: (artwork: Omit<Artwork, "id" | "createdAt">) => void;
  onUpdateArtwork: (id: string, artwork: Omit<Artwork, "id" | "createdAt">) => void;
  onDeleteArtwork: (id: string) => void;
}

const AdminPanel = ({
  artworks,
  onAddArtwork,
  onUpdateArtwork,
  onDeleteArtwork,
}: AdminPanelProps) => {
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState("obras");

  const uniqueCollections = Array.from(
    new Set(artworks.map((artwork) => artwork.collection))
  );

  const handleEditArtwork = (artwork: Artwork) => {
    setSelectedArtwork(artwork);
    setIsEditDialogOpen(true);
  };

  const handleUpdateArtwork = (data: Omit<Artwork, "id" | "createdAt">) => {
    if (selectedArtwork) {
      onUpdateArtwork(selectedArtwork.id, data);
      setIsEditDialogOpen(false);
    }
  };

  const handleDeleteArtwork = (id: string) => {
    onDeleteArtwork(id);
    toast.success("Obra eliminada correctamente");
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <h2 className="font-serif text-3xl font-medium">Panel de Administración</h2>
        <div className="flex gap-4">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Añadir Obra
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Añadir Nueva Obra</DialogTitle>
              </DialogHeader>
              <AddArtworkForm 
                onSubmit={(data) => {
                  onAddArtwork(data);
                  setIsAddDialogOpen(false);
                }} 
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs value={currentTab} onValueChange={setCurrentTab}>
        <TabsList>
          <TabsTrigger value="obras">Obras</TabsTrigger>
          <TabsTrigger value="colecciones">Colecciones</TabsTrigger>
        </TabsList>
        
        <TabsContent value="obras" className="mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {artworks.map((artwork) => (
              <Card key={artwork.id} className="overflow-hidden">
                <div className="relative aspect-[3/4]">
                  <img
                    src={artwork.imageUrl}
                    alt={artwork.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium text-lg line-clamp-1">{artwork.title}</h3>
                      <p className="text-sm text-muted-foreground">{artwork.collection}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleEditArtwork(artwork)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="icon">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta acción no se puede deshacer. Se eliminará permanentemente la obra
                              "{artwork.title}" de la base de datos.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteArtwork(artwork.id)}
                            >
                              Eliminar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {artworks.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center p-12 bg-secondary/50 rounded-lg">
                <Image className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-center text-muted-foreground">
                  No hay obras todavía. Añade tu primera obra haciendo clic en el botón "Añadir Obra".
                </p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="colecciones" className="mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {uniqueCollections.map((collection) => {
              const collectionArtworks = artworks.filter(a => a.collection === collection);
              const thumbnailArtwork = collectionArtworks[0];
              
              return (
                <Card key={collection} className="overflow-hidden">
                  <div className="relative aspect-[3/4]">
                    {thumbnailArtwork ? (
                      <img
                        src={thumbnailArtwork.imageUrl}
                        alt={collection}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-secondary flex items-center justify-center">
                        <Image className="h-12 w-12 text-muted-foreground" />
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-4">
                      <h3 className="font-serif text-lg text-white">{collection}</h3>
                      <p className="text-sm text-white/80">{collectionArtworks.length} obras</p>
                    </div>
                  </div>
                </Card>
              );
            })}

            {uniqueCollections.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center p-12 bg-secondary/50 rounded-lg">
                <Image className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-center text-muted-foreground">
                  No hay colecciones todavía. Las colecciones se crearán automáticamente al añadir obras.
                </p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Editar Obra</DialogTitle>
          </DialogHeader>
          {selectedArtwork && (
            <AddArtworkForm
              editArtwork={selectedArtwork}
              onSubmit={handleUpdateArtwork}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPanel;
