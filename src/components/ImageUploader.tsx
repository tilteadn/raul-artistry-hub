
import { useState, useRef } from "react";
import { ImagePlus, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { uploadImage } from "@/utils/artwork/supabaseArtworkService";
import { toast } from "sonner";

interface ImageUploaderProps {
  onChange: (url: string) => void;
  initialImage?: string;
  className?: string;
}

const ImageUploader = ({ onChange, initialImage, className }: ImageUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialImage || null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isMobile = useIsMobile();

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length) {
      handleFile(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length) {
      handleFile(files[0]);
    }
  };

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Por favor, sube solo imágenes");
      return;
    }

    setIsUploading(true);
    try {
      // First create a local preview
      const localUrl = URL.createObjectURL(file);
      setPreviewUrl(localUrl);
      
      // Then try to upload to Supabase storage
      try {
        // For development, we'll use localUrl directly when not actually uploading to Supabase
        const useLocalUrl = process.env.NODE_ENV === 'development' && !true; // Set to true to skip upload in dev
        
        let finalUrl: string;
        if (useLocalUrl) {
          // In development, we might just use the local URL
          finalUrl = localUrl;
          await new Promise(resolve => setTimeout(resolve, 500)); // Fake delay
        } else {
          // In production, we upload to Supabase
          finalUrl = await uploadImage(file);
        }
        
        onChange(finalUrl);
      } catch (uploadError) {
        console.error("Error uploading to storage:", uploadError);
        // If upload fails, use the local URL and show a warning
        onChange(localUrl);
        toast.warning("La imagen se guardará temporalmente. La carga a la nube falló.");
      }
    } catch (error) {
      console.error("Error handling file:", error);
      toast.error("Error al procesar la imagen");
    } finally {
      setIsUploading(false);
    }
  };

  const handleClickUpload = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = () => {
    setPreviewUrl(null);
    onChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Handler to prevent right-click
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    return false;
  };

  return (
    <div className={cn("w-full", className)}>
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept="image/*"
        onChange={handleFileInputChange}
      />

      <div
        className={cn(
          "border-2 border-dashed rounded-md transition-all duration-200 overflow-hidden bg-background",
          isDragging ? "border-primary" : "border-border",
          className
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={previewUrl ? undefined : handleClickUpload}
      >
        {previewUrl ? (
          <div className="relative aspect-[3/4]" onContextMenu={handleContextMenu}>
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-full object-cover"
              onError={() => {
                console.error("Image load error for:", previewUrl);
                handleRemoveImage();
              }}
              draggable="false"
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 z-10 opacity-80 hover:opacity-100"
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveImage();
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className={cn(
            "flex flex-col items-center justify-center p-4 text-muted-foreground cursor-pointer",
            isMobile ? "aspect-[4/3]" : "min-h-[220px]"
          )}>
            {isUploading ? (
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                <p>Procesando...</p>
              </div>
            ) : (
              <>
                <ImagePlus className="mx-auto h-12 w-12 mb-4" />
                <p className="font-medium">Sube una imagen</p>
                <p className="text-sm text-center mt-2">
                  {isMobile ? "Haz clic para seleccionar" : "Arrastra y suelta aquí o haz clic para seleccionar"}
                </p>
                <Button variant="outline" size="sm" className="mt-4" onClick={handleClickUpload}>
                  <Upload className="mr-2 h-4 w-4" />
                  Seleccionar archivo
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;
