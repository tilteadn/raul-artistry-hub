
import { Loader2 } from "lucide-react";

export function VisitorStatsLoading() {
  return (
    <div className="flex flex-col items-center justify-center h-64">
      <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
      <p className="text-muted-foreground">Cargando estadísticas...</p>
    </div>
  );
}
