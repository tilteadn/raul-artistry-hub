import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Plus } from "lucide-react";
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
import ImageUploader from "./ImageUploader";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";

const formSchema = z.object({
  title: z.string().min(1, { message: "El título es requerido" }).max(100, { message: "El título es demasiado largo, máximo 100 caracteres" }),
  subtitle: z.string().optional(),
  collection: z.string().min(1, { message: "La colección es requerida" }).max(50, { message: "El nombre de la colección es demasiado largo" }),
  imageUrl: z.union([z.string(), z.instanceof(File)]).refine(val => val !== "", { message: "La imagen es requerida" }),
  year: z.string().optional(),
  technique: z.string().optional(),
  dimensions: z.string().optional(),
  description: z.string().optional(),
});

const enhancedFormSchema = formSchema
  .extend({
    year: z.string().optional().refine(val => !val || /^\d{4}$/.test(val), { message: "El año debe tener 4 dígitos" }),
    technique: z.string().optional().transform(val => val || ""),
    dimensions: z.string().optional().transform(val => val || ""),
    description: z.string().optional().transform(val => val || ""),
    subtitle: z.string().optional().transform(val => val || ""),
  });

type FormValues = z.infer<typeof enhancedFormSchema>;

interface AddArtworkFormProps {
  onSubmit: (artwork: Omit<Artwork, "id" | "createdAt">) => void;
  editArtwork?: Artwork;
}

const AddArtworkForm = ({ onSubmit, editArtwork }: AddArtworkFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isMobile = useIsMobile();

  const form = useForm<FormValues>({
    resolver: zodResolver(enhancedFormSchema),
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
    mode: "onChange",
  });

  const handleImageChange = (url: string | File) => {
    form.setValue("imageUrl", url);
    form.trigger("imageUrl");
  };

  const handleSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    
    try {
      const artworkData: Omit<Artwork, "id" | "createdAt"> = {
        title: values.title.trim(),
        subtitle: values.subtitle,
        collection: values.collection.trim(),
        imageUrl: values.imageUrl,
        year: values.year ? values.year.trim() : undefined,
        technique: values.technique ? values.technique.trim() : undefined,
        dimensions: values.dimensions ? values.dimensions.trim() : undefined,
        description: values.description ? values.description.trim() : undefined,
      };
      
      await onSubmit(artworkData);
      
      if (!editArtwork) {
        form.reset();
      }
      
      toast.success(
        editArtwork 
          ? "Obra actualizada correctamente" 
          : "Obra añadida correctamente"
      );
    } catch (error) {
      console.error("Error al guardar la obra:", error);
      toast.error("Error al guardar la obra");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-secondary p-8 relative flex flex-col h-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col h-full">
          <div className="flex-grow overflow-auto">
            <ScrollArea className="h-[calc(100vh-250px)]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6">
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Título <span className="text-destructive">*</span></FormLabel>
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
                          <Input placeholder="Subtítulo de la obra (opcional)" {...field} />
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
                        <FormLabel>Colección <span className="text-destructive">*</span></FormLabel>
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
                            <Input placeholder="2023" {...field} />
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
                        <FormLabel>Imagen <span className="text-destructive">*</span></FormLabel>
                        <FormControl>
                          <ImageUploader 
                            onChange={handleImageChange}
                            initialImage={field.value}
                          />
                        </FormControl>
                        <FormDescription>
                          {isMobile ? "Haz clic para seleccionar una imagen" : "Sube una imagen o arrastra y suelta aquí"}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
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
            </ScrollArea>
          </div>
          
          <div className="pt-4 mt-auto border-t">
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
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AddArtworkForm;
