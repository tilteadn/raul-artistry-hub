
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export const useCookieConsent = () => {
  const [consentGiven, setConsentGiven] = useState<boolean | null>(null);

  useEffect(() => {
    const savedConsent = localStorage.getItem("cookie-consent");
    setConsentGiven(savedConsent === "true");
  }, []);

  const giveConsent = () => {
    localStorage.setItem("cookie-consent", "true");
    setConsentGiven(true);
  };

  const denyConsent = () => {
    localStorage.setItem("cookie-consent", "false");
    setConsentGiven(false);
  };

  return { consentGiven, giveConsent, denyConsent };
};

const CookieConsent = () => {
  const { consentGiven, giveConsent, denyConsent } = useCookieConsent();

  if (consentGiven !== null) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:max-w-md md:right-4 z-50">
      <Alert className="border-muted bg-card shadow-lg">
        <AlertTitle className="flex items-center justify-between">
          <span>Aviso de Cookies</span>
          <Button variant="ghost" size="icon" onClick={denyConsent}>
            <X className="h-4 w-4" />
          </Button>
        </AlertTitle>
        <AlertDescription className="pt-2">
          <p className="mb-4 text-sm">
            Este sitio utiliza cookies para mejorar la experiencia del usuario y analizar el tráfico. 
            Recopilamos información anónima sobre las visitas para fines estadísticos.
          </p>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" size="sm" onClick={denyConsent}>
              Rechazar
            </Button>
            <Button size="sm" onClick={giveConsent}>
              Aceptar
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default CookieConsent;
