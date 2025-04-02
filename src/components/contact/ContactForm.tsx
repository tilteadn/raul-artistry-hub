
import { useState } from "react";
import { Send } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  name: z.string().min(2, { message: "El nombre es requerido" }),
  email: z.string().email({ message: "Email inválido" }),
  subject: z.string().min(2, { message: "El asunto es requerido" }),
  message: z.string().min(10, { message: "El mensaje debe tener al menos 10 caracteres" }),
});

const ContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    
    try {
      console.log("Submitting contact form:", values);
      
      // Direct fetch with improved error handling
      const response = await fetch("https://kpsahmaxljekrpmpbejt.supabase.co/functions/v1/send-contact-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values)
      });
      
      if (!response.ok) {
        // Try to get error details if available
        try {
          const errorData = await response.json();
          console.error("Error response:", errorData);
          throw new Error(errorData.details || `Error ${response.status}: ${response.statusText}`);
        } catch (jsonError) {
          // If we can't parse the JSON, use the status text
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
      }
      
      console.log("Form submitted successfully");
      toast.success("Mensaje enviado correctamente");
      form.reset();
    } catch (error: any) {
      console.error("Error sending contact form:", error);
      toast.error("Error al enviar el mensaje. Por favor, inténtalo de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="bg-secondary p-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                  <Input placeholder="Tu nombre" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="tu@email.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Asunto</FormLabel>
                <FormControl>
                  <Input placeholder="Asunto de tu mensaje" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mensaje</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Tu mensaje" 
                    className="min-h-[120px]" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button 
            type="submit" 
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>Enviando...</>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Enviar mensaje
              </>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ContactForm;
