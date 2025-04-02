
import { Users, AlertTriangle, RefreshCw } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface VisitorStatsEmptyProps {
  hasVisitors: boolean;
  error?: string | null;
  onRetry?: () => void;
}

export function VisitorStatsEmpty({ hasVisitors, error, onRetry }: VisitorStatsEmptyProps) {
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription className="flex flex-col gap-4">
          <p>{error}</p>
          {onRetry && (
            <Button variant="outline" size="sm" onClick={onRetry}>
              <RefreshCw className="h-4 w-4 mr-2" /> Reintentar
            </Button>
          )}
        </AlertDescription>
      </Alert>
    );
  }
  
  if (hasVisitors === false) {
    return (
      <Alert className="bg-card">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription className="flex flex-col gap-4">
          <p>
            No hay datos de visitas todavía. Una vez que los usuarios acepten las cookies
            y naveguen por tu sitio, comenzarás a ver estadísticas aquí.
          </p>
          {onRetry && (
            <Button variant="outline" size="sm" onClick={onRetry}>
              <RefreshCw className="h-4 w-4 mr-2" /> Actualizar datos
            </Button>
          )}
        </AlertDescription>
      </Alert>
    );
  }
  
  return (
    <div className="flex flex-col items-center justify-center h-64">
      <Users className="h-12 w-12 text-muted-foreground mb-4" />
      <p className="text-center text-muted-foreground">
        No hay datos de visitantes disponibles.
      </p>
      {onRetry && (
        <Button variant="outline" className="mt-4" onClick={onRetry}>
          <RefreshCw className="h-4 w-4 mr-2" /> Actualizar datos
        </Button>
      )}
    </div>
  );
}
