
import { BarChart2, MapPin } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VisitorMonthlyChart } from "./VisitorMonthlyChart";
import { VisitorLocationsTable } from "./VisitorLocationsTable";
import type { VisitorData } from "@/utils/visitorTrackingService";

interface VisitorStatsTabsProps {
  visitData: VisitorData;
}

export function VisitorStatsTabs({ visitData }: VisitorStatsTabsProps) {
  return (
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
        <VisitorMonthlyChart monthlyData={visitData.monthlyData} />
      </TabsContent>
      
      <TabsContent value="locations">
        <VisitorLocationsTable topCountries={visitData.topCountries} />
      </TabsContent>
    </Tabs>
  );
}
