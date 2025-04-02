
import ContactSection from "@/components/ContactSection";
import MetaTags from "@/components/MetaTags";

const Contact = () => {
  return (
    <div className="min-h-screen">
      <MetaTags 
        title="Contacto | Raúl Álvarez - Artista Plástico y Tatuador"
        description="Contacta con Raúl Álvarez para consultas sobre adquisición de obras, encargos, exposiciones o visitas a su estudio en A Coruña."
        keywords="contacto, Raúl Álvarez, adquirir arte, encargos, visitas estudio, A Coruña"
        canonicalUrl="https://raulalvarezpintura.es/contacto"
      />
      
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
