
import { useState, useCallback, useMemo } from "react";
import { useDropzone } from "react-dropzone";
import { Image, Upload, Trash2, FilePenLine, Check, X, Loader2, Plus } from "lucide-react";
import { Artwork } from "@/types/artwork";
import { v4 as uuidv4 } from 'uuid';
import { saveArtwork } from "@/utils/artwork/artworkService";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";

// Define the expected file info extracted from filename
interface ParsedFileInfo {
  title: string;
  dimensions?: string;
  technique?: string;
  year?: string;
}

// Pending artwork combines file and parsed metadata
interface PendingArtwork {
  id: string;
  file: File;
  imageUrl: string;
  title: string;
  subtitle?: string;
  dimensions?: string;
  technique?: string;
  year?: string;
  isValid: boolean;
  error?: string;
}

const BatchUploadTab = ({ onComplete }: { onComplete: () => void }) => {
  const [collection, setCollection] = useState<string>("Dibujos");
  const [customCollection, setCustomCollection] = useState<string>("");
  const [isCustomCollection, setIsCustomCollection] = useState(false);
  const [pendingArtworks, setPendingArtworks] = useState<PendingArtwork[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [editingArtwork, setEditingArtwork] = useState<PendingArtwork | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const effectiveCollection = useMemo(() => {
    return isCustomCollection ? customCollection : collection;
  }, [isCustomCollection, customCollection, collection]);

  // Parse filename to extract metadata
  const parseFilename = (filename: string): ParsedFileInfo => {
    try {
      // Remove file extension
      const nameWithoutExt = filename.replace(/\.[^/.]+$/, "");
      
      // Find first occurrence of a dimension pattern (e.g., 29x21)
      const dimensionMatch = nameWithoutExt.match(/\d+x\d+/);
      
      if (dimensionMatch && dimensionMatch.index !== undefined) {
        const dimensionStartIndex = dimensionMatch.index;
        const dimensions = dimensionMatch[0]; // e.g., "29x21"
        
        // Everything before the dimension is title
        const title = nameWithoutExt.substring(0, dimensionStartIndex).trim();
        
        // Extract the part after dimensions
        const afterDimensions = nameWithoutExt.substring(dimensionStartIndex + dimensions.length).trim();
        
        // Look for year pattern at the end (4-digit number)
        const yearMatch = afterDimensions.match(/\b(\d{4})\b$/);
        
        let technique: string | undefined;
        let year: string | undefined;
        
        if (yearMatch) {
          // If there's a year, everything between dimensions and year is technique
          year = yearMatch[1];
          technique = afterDimensions.substring(0, afterDimensions.length - year.length).trim();
        } else {
          // No year found, everything after dimensions is technique
          technique = afterDimensions;
        }
        
        return {
          title,
          dimensions,
          technique: technique || undefined,
          year: year || undefined
        };
      }
      
      // Fallback - just use the filename as the title
      return { title: nameWithoutExt };
    } catch (error) {
      console.error("Error parsing filename:", error);
      return { title: filename.replace(/\.[^/.]+$/, "") };
    }
  };

  // Handle file drop
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    try {
      const newPendingArtworks = await Promise.all(acceptedFiles.map(async (file) => {
        // Generate a temporary URL for preview
        const imageUrl = URL.createObjectURL(file);
        
        // Parse the filename
        const parsedInfo = parseFilename(file.name);
        
        return {
          id: uuidv4(),
          file,
          imageUrl,
          title: parsedInfo.title || file.name.replace(/\.[^/.]+$/, ""),
          dimensions: parsedInfo.dimensions,
          technique: parsedInfo.technique,
          year: parsedInfo.year,
          isValid: true
        };
      }));
      
      setPendingArtworks(prev => [...prev, ...newPendingArtworks]);
    } catch (error) {
      console.error("Error processing files:", error);
      toast({
        title: "Error",
        description: "Hubo un error al procesar los archivos",
        variant: "destructive",
      });
    }
  }, []);

  // Dropzone configuration
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp']
    },
    multiple: true
  });

  // Remove artwork from the pending list
  const handleRemoveArtwork = (id: string) => {
    setPendingArtworks(prev => {
      const updatedList = prev.filter(item => item.id !== id);
      return updatedList;
    });
  };

  // Edit artwork metadata
  const handleEditArtwork = (artwork: PendingArtwork) => {
    setEditingArtwork(artwork);
    setIsEditDialogOpen(true);
  };

  // Save edited artwork metadata
  const handleSaveEdit = (updatedArtwork: Partial<PendingArtwork>) => {
    if (!editingArtwork) return;
    
    setPendingArtworks(prev => prev.map(item => 
      item.id === editingArtwork.id ? { ...item, ...updatedArtwork } : item
    ));
    
    setIsEditDialogOpen(false);
    setEditingArtwork(null);
  };

  // Upload all pending artworks
  const handleUpload = async () => {
    if (pendingArtworks.length === 0) {
      toast({
        title: "Advertencia",
        description: "No hay obras para subir",
      });
      return;
    }
    
    if (!effectiveCollection) {
      toast({
        title: "Error",
        description: "Por favor selecciona una colección",
        variant: "destructive",
      });
      return;
    }
    
    setUploading(true);
    setProgress(0);
    
    let successCount = 0;
    let errorCount = 0;
    
    for (let i = 0; i < pendingArtworks.length; i++) {
      try {
        const artwork = pendingArtworks[i];
        
        // Create a temporary mock ID and createdAt for type compatibility
        // These will be properly generated in the backend
        const tempId = uuidv4();
        const tempCreatedAt = new Date();
        
        // Create complete artwork object that matches the Artwork type
        const newArtwork: Artwork = {
          id: tempId,
          title: artwork.title,
          subtitle: artwork.subtitle,
          collection: effectiveCollection,
          imageUrl: artwork.file, // This will be handled by the backend which accepts File
          year: artwork.year,
          technique: artwork.technique,
          dimensions: artwork.dimensions,
          createdAt: tempCreatedAt
        };
        
        // Save artwork to DB - the backend will handle the File object
        await saveArtwork(newArtwork);
        successCount++;
      } catch (error) {
        console.error("Error uploading artwork:", error);
        errorCount++;
      }
      
      // Update progress
      const newProgress = Math.round(((i + 1) / pendingArtworks.length) * 100);
      setProgress(newProgress);
    }
    
    setUploading(false);
    
    if (errorCount > 0) {
      toast({
        title: "Proceso completado con errores",
        description: `Se han subido ${successCount} obras con éxito, pero hubo ${errorCount} errores.`,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Éxito",
        description: `Se han subido ${successCount} obras correctamente.`,
      });
      // Clear pending artworks after successful upload
      setPendingArtworks([]);
      // Refresh the artworks list in the parent component
      onComplete();
    }
  };

  const predefinedCollections = [
    "Dibujos", "Pintura", "Acuarela", "Digital", "Otros"
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4">
        <div>
          <h3 className="text-lg font-medium mb-2">Seleccionar Colección</h3>
          <div className="flex flex-col sm:flex-row gap-4 items-start">
            {isCustomCollection ? (
              <div className="flex flex-1 gap-2 items-center">
                <Input
                  placeholder="Nombre de la colección personalizada"
                  value={customCollection}
                  onChange={e => setCustomCollection(e.target.value)}
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setIsCustomCollection(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex flex-1 gap-2 items-center">
                <Select
                  value={collection}
                  onValueChange={setCollection}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona una colección" />
                  </SelectTrigger>
                  <SelectContent>
                    {predefinedCollections.map(col => (
                      <SelectItem key={col} value={col}>{col}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setIsCustomCollection(true)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-2">Cargar Imágenes</h3>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive ? "border-primary bg-primary/10" : "border-muted-foreground/20 hover:border-primary/50"
            }`}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center justify-center space-y-2">
              <Upload className="h-8 w-8 text-muted-foreground" />
              {isDragActive ? (
                <p>Suelta las imágenes aquí...</p>
              ) : (
                <div>
                  <p className="text-muted-foreground">
                    Arrastra y suelta imágenes aquí, o haz clic para seleccionar archivos
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Formato esperado: "Título Dimensiones Técnica Año"
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Ejemplo: "Aqua Lineae II 29x21 Grafito sobre papel 2024"
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {pendingArtworks.length > 0 && (
          <div className="mt-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Vista Previa ({pendingArtworks.length} obras)</h3>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setPendingArtworks([])}
                  disabled={uploading}
                >
                  Limpiar Todo
                </Button>
                <Button 
                  onClick={handleUpload} 
                  disabled={pendingArtworks.length === 0 || uploading || !effectiveCollection}
                >
                  {uploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Subiendo...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Subir {pendingArtworks.length} Obras
                    </>
                  )}
                </Button>
              </div>
            </div>
            
            {uploading && (
              <div className="space-y-2">
                <Progress value={progress} />
                <p className="text-center text-sm text-muted-foreground">
                  {progress}% completado
                </p>
              </div>
            )}

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Vista previa</TableHead>
                    <TableHead>Título</TableHead>
                    <TableHead>Dimensiones</TableHead>
                    <TableHead>Técnica</TableHead>
                    <TableHead>Año</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingArtworks.map((artwork) => (
                    <TableRow key={artwork.id}>
                      <TableCell>
                        <div className="relative w-16 h-16">
                          <img
                            src={artwork.imageUrl}
                            alt={artwork.title}
                            className="w-full h-full object-cover rounded"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{artwork.title}</TableCell>
                      <TableCell>{artwork.dimensions || "-"}</TableCell>
                      <TableCell>{artwork.technique || "-"}</TableCell>
                      <TableCell>{artwork.year || "-"}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleEditArtwork(artwork)}
                            disabled={uploading}
                          >
                            <FilePenLine className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleRemoveArtwork(artwork.id)}
                            disabled={uploading}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Editar detalles de la obra</DialogTitle>
            </DialogHeader>
            
            {editingArtwork && (
              <div className="grid gap-4 py-4">
                <div className="flex justify-center mb-4">
                  <img
                    src={editingArtwork.imageUrl}
                    alt={editingArtwork.title}
                    className="h-40 object-contain rounded"
                  />
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="title" className="text-sm font-medium">
                      Título
                    </label>
                    <Input
                      id="title"
                      value={editingArtwork.title}
                      onChange={e => setEditingArtwork({...editingArtwork, title: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="subtitle" className="text-sm font-medium">
                      Subtítulo (opcional)
                    </label>
                    <Input
                      id="subtitle"
                      value={editingArtwork.subtitle || ""}
                      onChange={e => setEditingArtwork({...editingArtwork, subtitle: e.target.value})}
                      placeholder="Subtítulo de la obra"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="dimensions" className="text-sm font-medium">
                      Dimensiones
                    </label>
                    <Input
                      id="dimensions"
                      value={editingArtwork.dimensions || ""}
                      onChange={e => setEditingArtwork({...editingArtwork, dimensions: e.target.value})}
                      placeholder="ej. 29x21"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="technique" className="text-sm font-medium">
                      Técnica
                    </label>
                    <Input
                      id="technique"
                      value={editingArtwork.technique || ""}
                      onChange={e => setEditingArtwork({...editingArtwork, technique: e.target.value})}
                      placeholder="ej. Grafito sobre papel"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="year" className="text-sm font-medium">
                      Año
                    </label>
                    <Input
                      id="year"
                      value={editingArtwork.year || ""}
                      onChange={e => setEditingArtwork({...editingArtwork, year: e.target.value})}
                      placeholder="ej. 2024"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={() => handleSaveEdit(editingArtwork)}>
                    Guardar Cambios
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default BatchUploadTab;
