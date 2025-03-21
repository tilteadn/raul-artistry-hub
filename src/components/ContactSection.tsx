
import { useState } from "react";
import { Instagram, Mail, MapPin, Send } from "lucide-react";
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

const ContactSection = () => {
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

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log(values);
      toast.success("Mensaje enviado correctamente");
      form.reset();
      setIsSubmitting(false);
    }, 1500);
  }

  return (
    <div className="container mx-auto px-6 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
        <div className="space-y-8">
          <div>
            <h2 className="font-serif text-3xl md:text-4xl font-medium text-primary mb-4">
              Contacto
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Si estás interesado en adquirir alguna obra, tienes alguna consulta o deseas información sobre encargos, no dudes en contactarme.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <Mail className="w-5 h-5 text-primary mt-1" />
              <div>
                <h3 className="font-medium">Email</h3>
                <p className="text-muted-foreground">info@raulalvarez.com</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <MapPin className="w-5 h-5 text-primary mt-1" />
              <div>
                <h3 className="font-medium">Estudio</h3>
                <p className="text-muted-foreground">A Coruña, España</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <Instagram className="w-5 h-5 text-primary mt-1" />
              <div>
                <h3 className="font-medium">Redes Sociales</h3>
                <div className="space-y-1">
                  <a 
                    href="https://www.instagram.com/raulalvarezpintura/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block text-muted-foreground hover:text-primary transition-colors"
                  >
                    @raulalvarezpintura
                  </a>
                  <a 
                    href="https://www.instagram.com/raulalvareztattoo/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block text-muted-foreground hover:text-primary transition-colors"
                  >
                    @raulalvareztattoo
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

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
      </div>
    </div>
  );
};

export default ContactSection;
