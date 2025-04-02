
import { Users, Calendar, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { VisitorData } from "@/utils/visitorTrackingService";

interface VisitorStatsSummaryCardsProps {
  visitData: VisitorData;
}

export function VisitorStatsSummaryCards({ visitData }: VisitorStatsSummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Visitas</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{visitData.totalVisits}</div>
          <p className="text-xs text-muted-foreground">
            {visitData.visitIncrease > 0 
              ? `+${visitData.visitIncrease.toFixed(1)}% desde el mes pasado` 
              : `${visitData.visitIncrease.toFixed(1)}% desde el mes pasado`}
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Visitas Este Mes</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{visitData.currentMonthVisits}</div>
          <p className="text-xs text-muted-foreground">
            Actualizado a {new Date().toLocaleDateString('es-ES')}
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Países Principales</CardTitle>
          <MapPin className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{visitData.topCountries[0]?.country || "N/A"}</div>
          <p className="text-xs text-muted-foreground">
            {visitData.topCountries[0]?.percentage.toFixed(1) || 0}% de las visitas totales
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
