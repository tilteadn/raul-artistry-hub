
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MapPin, Calendar, Users, BarChart2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getVisitorStats, VisitorData } from "@/utils/visitorTrackingService";

const VisitorStats = () => {
  const [visitData, setVisitData] = useState<VisitorData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadVisitorData = async () => {
      try {
        const data = await getVisitorStats();
        setVisitData(data);
      } catch (error) {
        console.error("Error loading visitor data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadVisitorData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Cargando estadísticas...</p>
      </div>
    );
  }

  if (!visitData) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Users className="h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-center text-muted-foreground">
          No hay datos de visitantes disponibles.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
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
                ? `+${visitData.visitIncrease}% desde el mes pasado` 
                : `${visitData.visitIncrease}% desde el mes pasado`}
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
              {visitData.topCountries[0]?.percentage || 0}% de las visitas totales
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="chart" className="mt-6">
        <TabsList>
          <TabsTrigger value="chart">
            <BarChart2 className="h-4 w-4 mr-2" />
            Gráfico
          </TabsTrigger>
          <TabsTrigger value="locations">
            <MapPin className="h-4 w-4 mr-2" />
            Ubicaciones
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="chart" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Visitas Mensuales</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ChartContainer 
                className="h-full"
                config={{
                  visits: {
                    label: "Visitas",
                    color: "hsl(var(--primary))"
                  }
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={visitData.monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="rounded-lg border bg-background p-2 shadow-sm">
                              <div className="grid grid-cols-2 gap-2">
                                <div className="flex flex-col">
                                  <span className="text-sm font-medium text-muted-foreground">
                                    Mes
                                  </span>
                                  <span className="font-bold text-foreground">
                                    {payload[0].payload.month}
                                  </span>
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-sm font-medium text-muted-foreground">
                                    Visitas
                                  </span>
                                  <span className="font-bold text-foreground">
                                    {payload[0].value}
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar 
                      dataKey="visits" 
                      fill="hsl(var(--primary))" 
                      radius={[4, 4, 0, 0]} 
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="locations">
          <Card>
            <CardHeader>
              <CardTitle>Visitas por Ubicación</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>País</TableHead>
                    <TableHead>Visitas</TableHead>
                    <TableHead className="text-right">Porcentaje</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {visitData.topCountries.map((country, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          {country.country}
                        </div>
                      </TableCell>
                      <TableCell>{country.visits}</TableCell>
                      <TableCell className="text-right">{country.percentage}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VisitorStats;
