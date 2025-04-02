
import { Users, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface VisitorStatsEmptyProps {
  hasVisitors: boolean;
  error?: string | null;
}

export function VisitorStatsEmpty({ hasVisitors, error }: VisitorStatsEmptyProps) {
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }
  
  if (hasVisitors === false) {
    return (
      <Alert className="bg-card">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          No hay datos de visitas todavía. Una vez que los usuarios acepten las cookies
          y naveguen por tu sitio, comenzarás a ver estadísticas aquí.
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
    </div>
  );
}
