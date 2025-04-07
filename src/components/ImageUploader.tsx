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
  isDisabled?: boolean;
}

const ImageUploader = ({ 
  onChange, 
  initialImage, 
  className,
  isDisabled = false 
}: ImageUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialImage || null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isMobile = useIsMobile();

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    if (isDisabled) return;
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
    if (isDisabled) return;
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

    try {
      setUploadError(null);
      console.log("Processing file:", file.name, file.type, file.size);
      
      const localUrl = URL.createObjectURL(file);
      setPreviewUrl(localUrl);
      setIsUploading(true);
      
      try {
        console.log("Uploading image to Supabase storage");
        const uploadedUrl = await uploadImage(file);
        console.log("Image uploaded successfully:", uploadedUrl);
        
        onChange(uploadedUrl);
        setIsUploading(false);
      } catch (uploadError: any) {
        console.error("Error uploading image:", uploadError);
        
        let errorMessage = "Error al subir la imagen";
        
        if (uploadError.error === "InvalidKey") {
          errorMessage = "El nombre del archivo contiene caracteres no permitidos";
        } else if (uploadError.message) {
          errorMessage = `Error: ${uploadError.message}`;
        }
        
        setUploadError(errorMessage);
        toast.error(errorMessage);
        
        setIsUploading(false);
        
        onChange(localUrl);
        
        localStorage.setItem('pendingArtworkImage', JSON.stringify({
          localUrl,
          fileName: file.name,
          type: file.type
        }));
      }
    } catch (error: any) {
      console.error("Error handling file:", error);
      setUploadError(`Error al procesar la imagen: ${error.message || "Error desconocido"}`);
      toast.error("Error al procesar la imagen");
      setIsUploading(false);
    }
  };

  const handleClickUpload = (e: React.MouseEvent) => {
    if (isDisabled) return;
    e.stopPropagation();
    e.preventDefault();
    fileInputRef.current?.click();
  };

  const handleRemoveImage = () => {
    if (isDisabled) return;
    setPreviewUrl(null);
    setUploadError(null);
    onChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    localStorage.removeItem('pendingArtworkImage');
  };

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
        disabled={isDisabled}
      />

      <div
        className={cn(
          "border-2 border-dashed rounded-md transition-all duration-200 overflow-hidden bg-background",
          isDragging ? "border-primary" : "border-border",
          uploadError ? "border-destructive" : "",
          isDisabled ? "opacity-70 cursor-not-allowed" : "cursor-pointer",
          className
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={previewUrl || isDisabled ? undefined : handleClickUpload}
      >
        {previewUrl ? (
          <div className="relative aspect-[3/4]" onContextMenu={handleContextMenu}>
            <img
              src={previewUrl}
              alt="Preview"
              className={cn(
                "w-full h-full object-cover",
                isDisabled && "opacity-70"
              )}
              onError={(e) => {
                console.error("Image load error for:", previewUrl);
                handleRemoveImage();
              }}
              draggable="false"
            />
            {!isDisabled && (
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 z-10 opacity-80 hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveImage();
                }}
                disabled={isDisabled}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
            
            {isUploading && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="bg-background p-4 rounded-md text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                  <p className="text-sm">Subiendo imagen...</p>
                </div>
              </div>
            )}
            
            {uploadError && (
              <div className="absolute bottom-0 left-0 right-0 bg-destructive/90 text-destructive-foreground p-2 text-sm">
                {uploadError}
              </div>
            )}
          </div>
        ) : (
          <div className={cn(
            "flex flex-col items-center justify-center p-4 text-muted-foreground",
            !isDisabled && "cursor-pointer",
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
                  {isDisabled 
                    ? "Carga no disponible en este momento" 
                    : isMobile 
                      ? "Haz clic para seleccionar" 
                      : "Arrastra y suelta aquí o haz clic para seleccionar"}
                </p>
                {uploadError && (
                  <p className="text-sm text-destructive mt-2">{uploadError}</p>
                )}
                {!isDisabled && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-4" 
                    onClick={handleClickUpload}
                    type="button"
                    disabled={isDisabled}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Seleccionar archivo
                  </Button>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;
