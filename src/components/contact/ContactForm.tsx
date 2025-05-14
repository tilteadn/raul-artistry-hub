
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
import { supabase } from "@/integrations/supabase/client";

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
      
      // Use the Supabase client to invoke the function with proper authentication
      const { data, error } = await supabase.functions.invoke("send-contact-email", {
        body: values
      });
      
      if (error) {
        console.error("Error response from function:", error);
        throw new Error(error.message || "Error al enviar el mensaje");
      }
      
      console.log("Form submitted successfully", data);
      
      if (data?.success) {
        toast.success("Mensaje enviado correctamente. Nos pondremos en contacto contigo lo antes posible.");
        form.reset();
      } else {
        throw new Error(data?.error || "No se recibió confirmación del servidor");
      }
    } catch (error: any) {
      console.error("Error sending contact form:", error);
      toast.error(`Error al enviar el mensaje: ${error.message || 'Por favor, inténtalo de nuevo.'}`);
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
}

export default ContactForm;
