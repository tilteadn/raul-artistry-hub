
import ContactSection from "@/components/ContactSection";

const Contact = () => {
  return (
    <div className="min-h-screen">
      <div className="bg-secondary py-20">
        <div className="container mx-auto px-6">
          <h1 className="font-serif text-4xl md:text-5xl font-medium text-primary text-center mb-4">
            Contacto
          </h1>
          <p className="text-muted-foreground text-center max-w-2xl mx-auto">
            Si estás interesado en adquirir alguna obra, tienes alguna consulta o
            deseas información sobre encargos, no dudes en contactarme.
          </p>
        </div>
      </div>
      
      <ContactSection />
    </div>
  );
};

export default Contact;
