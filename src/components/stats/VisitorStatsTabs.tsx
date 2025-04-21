
import { BarChart2, MapPin, City as CityIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VisitorMonthlyChart } from "./VisitorMonthlyChart";
import { VisitorLocationsTable } from "./VisitorLocationsTable";
import { VisitorCitiesTable } from "./VisitorCitiesTable";
import type { VisitorData } from "@/utils/visitorTrackingService";

interface VisitorStatsTabsProps {
  visitData: VisitorData;
}

export function VisitorStatsTabs({ visitData }: VisitorStatsTabsProps) {
  // Combine all cities from all countries
  const allCities = visitData.topCountries
    .flatMap(country => country.topCities || []);

  return (
    <Tabs defaultValue="chart" className="mt-6">
      <TabsList>
        <TabsTrigger value="chart">
          <BarChart2 className="h-4 w-4 mr-2" />
          Gráfico
        </TabsTrigger>
        <TabsTrigger value="locations">
          <MapPin className="h-4 w-4 mr-2" />
          Países
        </TabsTrigger>
        <TabsTrigger value="cities">
          <CityIcon className="h-4 w-4 mr-2" />
          Ciudades
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="chart" className="space-y-4">
        <VisitorMonthlyChart monthlyData={visitData.monthlyData} />
      </TabsContent>
      
      <TabsContent value="locations">
        <VisitorLocationsTable topCountries={visitData.topCountries} />
      </TabsContent>

      <TabsContent value="cities">
        <VisitorCitiesTable cities={allCities} />
      </TabsContent>
    </Tabs>
  );
}
