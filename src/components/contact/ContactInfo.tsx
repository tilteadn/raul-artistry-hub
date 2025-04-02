
import { Instagram, Mail, MapPin } from "lucide-react";

const ContactInfo = () => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-serif text-3xl md:text-4xl font-medium text-primary mb-4">
          Contacto
        </h2>
      </div>

      <div className="space-y-6">
        <div className="flex items-start space-x-4">
          <Mail className="w-5 h-5 text-primary mt-1" />
          <div>
            <h3 className="font-medium">Email</h3>
            <p className="text-muted-foreground">raulalvarezjimenez@hotmail.com</p>
          </div>
        </div>
        
        <div className="flex items-start space-x-4">
          <MapPin className="w-5 h-5 text-primary mt-1" />
          <div>
            <h3 className="font-medium">Estudio</h3>
            <div className="mt-2 w-full h-[300px] rounded-md overflow-hidden">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d181.2497295138267!2d-8.403986963071628!3d43.37711453494626!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd2e7c7a77f717b1%3A0xb5fa66980e18d28b!2zUmHDumwgw4FsdmFyZXo!5e0!3m2!1ses!2ses!4v1743522772724!5m2!1ses!2ses" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen 
                loading="lazy" 
                referrerPolicy="no-referrer-when-cross-origin"
                title="Ubicación de Raúl Álvarez en A Coruña"
                className="rounded-md"
              ></iframe>
            </div>
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
  );
};

export default ContactInfo;
