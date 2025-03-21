import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Plus, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Artwork } from "@/types/artwork";

const formSchema = z.object({
  title: z.string().min(1, { message: "El título es requerido" }),
  subtitle: z.string().min(1, { message: "El subtítulo es requerido" }),
  collection: z.string().min(1, { message: "La colección es requerida" }),
  imageUrl: z.string().min(1, { message: "La URL de la imagen es requerida" }),
  year: z.string().optional(),
  technique: z.string().optional(),
  dimensions: z.string().optional(),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface AddArtworkFormProps {
  onSubmit: (artwork: Omit<Artwork, "id" | "createdAt">) => void;
  editArtwork?: Artwork;
}

const AddArtworkForm = ({ onSubmit, editArtwork }: AddArtworkFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(
    editArtwork?.imageUrl || null
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: editArtwork?.title || "",
      subtitle: editArtwork?.subtitle || "",
      collection: editArtwork?.collection || "",
      imageUrl: editArtwork?.imageUrl || "",
      year: editArtwork?.year || "",
      technique: editArtwork?.technique || "",
      dimensions: editArtwork?.dimensions || "",
      description: editArtwork?.description || "",
    },
  });

  const handleImageUrlChange = (url: string) => {
    if (url) {
      setImagePreview(url);
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = (values: FormValues) => {
    setIsSubmitting(true);
    
    try {
      const artworkData: Omit<Artwork, "id" | "createdAt"> = {
        title: values.title,
        subtitle: values.subtitle,
        collection: values.collection,
        imageUrl: values.imageUrl,
        year: values.year,
        technique: values.technique,
        dimensions: values.dimensions,
        description: values.description,
      };
      
      onSubmit(artworkData);
      
      if (!editArtwork) {
        form.reset();
        setImagePreview(null);
      }
      
      toast.success(
        editArtwork 
          ? "Obra actualizada correctamente" 
          : "Obra añadida correctamente"
      );
    } catch (error) {
      toast.error("Error al guardar la obra");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-secondary p-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título</FormLabel>
                    <FormControl>
                      <Input placeholder="Título de la obra" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="subtitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subtítulo</FormLabel>
                    <FormControl>
                      <Input placeholder="Subtítulo de la obra" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="collection"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Colección</FormLabel>
                    <FormControl>
                      <Input placeholder="Nombre de la colección" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="year"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Año</FormLabel>
                      <FormControl>
                        <Input placeholder="Año" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="technique"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Técnica</FormLabel>
                      <FormControl>
                        <Input placeholder="Técnica" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="dimensions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dimensiones</FormLabel>
                    <FormControl>
                      <Input placeholder="100 x 80 cm" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL de la imagen</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="https://example.com/imagen.jpg" 
                        {...field} 
                        onChange={(e) => {
                          field.onChange(e);
                          handleImageUrlChange(e.target.value);
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      Introduce la URL de la imagen de la obra
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="border border-dashed border-border rounded-md overflow-hidden bg-background">
                {imagePreview ? (
                  <div className="relative aspect-[3/4]">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={() => setImagePreview(null)}
                    />
                  </div>
                ) : (
                  <div className="aspect-[3/4] flex items-center justify-center text-muted-foreground">
                    <div className="text-center p-4">
                      <Image className="mx-auto h-12 w-12 text-muted-foreground" />
                      <p className="mt-2">Vista previa de la imagen</p>
                      <p className="text-sm">Introduce una URL válida para ver la imagen</p>
                    </div>
                  </div>
                )}
              </div>
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descripción</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Descripción de la obra" 
                        className="min-h-[120px]" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              "Guardando..."
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                {editArtwork ? "Actualizar obra" : "Añadir obra"}
              </>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default AddArtworkForm;
