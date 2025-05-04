
import { useState } from "react";
import { Edit, Trash2, Plus, Image, Users, LayoutGrid, Grid3X3, Loader2, Upload } from "lucide-react";
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
import { useIsMobile } from "@/hooks/use-mobile"; 
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import VisitorStats from "./VisitorStats";
import BatchUploadTab from "./admin/BatchUploadTab";
import { getImageUrl } from "@/utils/artwork/artworkService";
import { 
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { getAspectRatioClass } from "@/utils/artwork/imageUtils";

interface AdminPanelProps {
  artworks: Artwork[];
  collections?: string[];
  onAddArtwork: (artwork: Omit<Artwork, "id" | "createdAt">) => void;
  onUpdateArtwork: (id: string, artwork: Omit<Artwork, "id" | "createdAt">) => void;
  onDeleteArtwork: (id: string) => void;
  isLoading?: boolean;
  isAdding?: boolean;
  isUpdating?: boolean;
  isDeleting?: boolean;
  // Pagination props
  currentPage?: number;
  totalPages?: number;
  totalArtworks?: number;
  onPageChange?: (page: number) => void;
  // Collection filtering props
  onCollectionChange?: (collection: string | undefined, shouldResetPage?: boolean) => void;
  collectionFilter?: string | undefined;
}

const AdminPanel = ({
  artworks,
  collections = [],
  onAddArtwork,
  onUpdateArtwork,
  onDeleteArtwork,
  isLoading = false,
  currentPage = 1,
  totalPages = 1,
  totalArtworks = 0,
  onPageChange,
  onCollectionChange,
  collectionFilter,
}: AdminPanelProps) => {
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState("obras");
  const isMobile = useIsMobile();

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
  };

  const handleCollectionFilterChange = (value: string) => {
    if (onCollectionChange) {
      onCollectionChange(value === "todas" ? undefined : value, true);
    }
  };

  const AddArtworkDialog = () => (
    <>
      {isMobile ? (
        <Drawer open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DrawerTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Añadir Obra
            </Button>
          </DrawerTrigger>
          <DrawerContent className="px-0 pt-0">
            <DrawerHeader className="mb-0 pb-0">
              <DrawerTitle>Añadir Nueva Obra</DrawerTitle>
            </DrawerHeader>
            <AddArtworkForm 
              onSubmit={(data) => {
                onAddArtwork(data);
                setIsAddDialogOpen(false);
              }} 
            />
          </DrawerContent>
        </Drawer>
      ) : (
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
      )}
    </>
  );

  const EditArtworkDialog = () => (
    <>
      {isMobile ? (
        <Drawer open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DrawerContent className="px-0 pt-0">
            <DrawerHeader className="mb-0 pb-0">
              <DrawerTitle>Editar Obra</DrawerTitle>
            </DrawerHeader>
            {selectedArtwork && (
              <AddArtworkForm
                editArtwork={selectedArtwork}
                onSubmit={handleUpdateArtwork}
              />
            )}
          </DrawerContent>
        </Drawer>
      ) : (
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
      )}
    </>
  );

  const LoadingState = () => (
    <div className="flex flex-col items-center justify-center p-12 bg-secondary/50 rounded-lg">
      <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
      <p className="text-center text-muted-foreground">
        Cargando las obras...
      </p>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <h2 className="font-serif text-3xl font-medium">Panel de Administración</h2>
        <div className="flex gap-4">
          {currentTab === "obras" && <AddArtworkDialog />}
        </div>
      </div>

      <Tabs value={currentTab} onValueChange={setCurrentTab}>
        <TabsList>
          <TabsTrigger value="obras">
            <LayoutGrid className="h-4 w-4 mr-2" />
            Obras
          </TabsTrigger>
          <TabsTrigger value="colecciones">
            <Grid3X3 className="h-4 w-4 mr-2" />
            Colecciones
          </TabsTrigger>
          <TabsTrigger value="cargaMasiva">
            <Upload className="h-4 w-4 mr-2" />
            Carga Masiva
          </TabsTrigger>
          <TabsTrigger value="estadisticas">
            <Users className="h-4 w-4 mr-2" />
            Estadísticas
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="obras" className="mt-6">
          {currentTab === "obras" && collections.length > 0 && (
            <div className="mb-6">
              <label htmlFor="collection-filter" className="block text-sm font-medium mb-2">
                Filtrar por colección:
              </label>
              <Select
                value={collectionFilter || "todas"}
                onValueChange={handleCollectionFilterChange}
              >
                <SelectTrigger className="w-[280px]">
                  <SelectValue placeholder="Todas las colecciones" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas las colecciones</SelectItem>
                  {collections.map(collection => (
                    <SelectItem key={collection} value={collection}>
                      {collection}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          {isLoading ? (
            <LoadingState />
          ) : (
            <div className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {artworks.map((artwork) => (
                  <Card key={artwork.id} className="overflow-hidden">
                    <div className={cn("relative", getAspectRatioClass(artwork.orientation))}>
                      <img
                        src={getImageUrl(artwork.thumbnailUrl || artwork.imageUrl)}
                        alt={artwork.title}
                        className={cn(
                          "w-full h-full",
                          artwork.orientation === 'landscape' ? "object-contain bg-gray-100" : "object-cover"
                        )}
                        loading="lazy"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder.svg';
                          console.error("Failed to load image:", artwork.thumbnailUrl || artwork.imageUrl);
                        }}
                      />
                    </div>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-medium text-lg line-clamp-1">{artwork.title}</h3>
                          <p className="text-sm text-muted-foreground">{artwork.collection}</p>
                          {artwork.orientation && (
                            <p className="text-xs text-muted-foreground capitalize">{artwork.orientation}</p>
                          )}
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

                {artworks.length === 0 && !isLoading && (
                  <div className="col-span-full flex flex-col items-center justify-center p-12 bg-secondary/50 rounded-lg">
                    <Image className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-center text-muted-foreground">
                      {collectionFilter 
                        ? `No hay obras en la colección "${collectionFilter}".` 
                        : "No hay obras todavía. Añade tu primera obra haciendo clic en el botón \"Añadir Obra\"."}
                    </p>
                  </div>
                )}
              </div>

              {totalPages > 1 && (
                <Pagination className="my-8">
                  <PaginationContent>
                    {currentPage > 1 && (
                      <PaginationItem>
                        <PaginationPrevious 
                          href="#" 
                          onClick={(e) => {
                            e.preventDefault();
                            if (onPageChange) onPageChange(currentPage - 1);
                          }}
                        />
                      </PaginationItem>
                    )}
                    
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      // Show pages around current page
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      
                      return (
                        <PaginationItem key={pageNum}>
                          <PaginationLink 
                            href="#" 
                            isActive={pageNum === currentPage}
                            onClick={(e) => {
                              e.preventDefault();
                              if (onPageChange) onPageChange(pageNum);
                            }}
                          >
                            {pageNum}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })}
                    
                    {currentPage < totalPages && (
                      <PaginationItem>
                        <PaginationNext 
                          href="#" 
                          onClick={(e) => {
                            e.preventDefault();
                            if (onPageChange) onPageChange(currentPage + 1);
                          }}
                        />
                      </PaginationItem>
                    )}
                  </PaginationContent>
                </Pagination>
              )}

              {totalArtworks > 0 && (
                <p className="text-center text-sm text-muted-foreground">
                  Mostrando {artworks.length} de {totalArtworks} obras
                  {collectionFilter ? ` en la colección "${collectionFilter}"` : ""}
                </p>
              )}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="colecciones" className="mt-6">
          {isLoading ? (
            <LoadingState />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {uniqueCollections.map((collection) => {
                const collectionArtworks = artworks.filter(a => a.collection === collection);
                const thumbnailArtwork = collectionArtworks[0];
                
                return (
                  <Card key={collection} className="overflow-hidden">
                    <div className="relative aspect-[3/4]">
                      {thumbnailArtwork ? (
                        <img
                          src={getImageUrl(thumbnailArtwork.thumbnailUrl || thumbnailArtwork.imageUrl)}
                          alt={collection}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/placeholder.svg';
                          }}
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

              {uniqueCollections.length === 0 && !isLoading && (
                <div className="col-span-full flex flex-col items-center justify-center p-12 bg-secondary/50 rounded-lg">
                  <Image className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-center text-muted-foreground">
                    No hay colecciones todavía. Las colecciones se crearán automáticamente al añadir obras.
                  </p>
                </div>
              )}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="cargaMasiva" className="mt-6">
          <BatchUploadTab onComplete={() => onAddArtwork && onAddArtwork({
            title: "", 
            collection: "", 
            imageUrl: ""
          })} />
        </TabsContent>
        
        <TabsContent value="estadisticas" className="mt-6">
          <VisitorStats />
        </TabsContent>
      </Tabs>

      <EditArtworkDialog />
    </div>
  );
};

export default AdminPanel;
