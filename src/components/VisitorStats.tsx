
import { useState, useEffect } from "react";
import { getVisitorStats, VisitorData } from "@/utils/visitorTrackingService";
import { VisitorStatsSummaryCards } from "./stats/VisitorStatsSummaryCards";
import { VisitorStatsTabs } from "./stats/VisitorStatsTabs";
import { VisitorStatsLoading } from "./stats/VisitorStatsLoading";
import { VisitorStatsEmpty } from "./stats/VisitorStatsEmpty";
import { toast } from "sonner";

const VisitorStats = () => {
  const [visitData, setVisitData] = useState<VisitorData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const loadVisitorData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        console.log("VisitorStats: Loading visitor data...");
        const data = await getVisitorStats();
        console.log("VisitorStats: Visitor data loaded:", data);
        
        if (data.totalVisits === 0) {
          console.log("VisitorStats: No visitor data found");
        } else {
          // Log some data for debugging
          console.log(`VisitorStats: Total visits: ${data.totalVisits}`);
          console.log(`VisitorStats: Countries: ${data.topCountries.map(c => c.country).join(', ')}`);
        }
        
        setVisitData(data);
      } catch (error: any) {
        console.error("VisitorStats: Error loading visitor data:", error);
        toast.error("Error al cargar estadísticas de visitas");
        setError("No se pudieron cargar los datos de visitas. Por favor, inténtalo de nuevo más tarde.");
      } finally {
        setIsLoading(false);
      }
    };

    loadVisitorData();
  }, [retryCount]);

  const handleManualRefresh = () => {
    // When manually refreshing, clear the country cache to force a new check
    sessionStorage.removeItem('visitor_country');
    setRetryCount(count => count + 1);
  };

  if (isLoading) {
    return <VisitorStatsLoading />;
  }

  if (error) {
    return (
      <VisitorStatsEmpty 
        hasVisitors={false} 
        error={error} 
        onRetry={handleManualRefresh} 
      />
    );
  }

  if (!visitData) {
    return <VisitorStatsEmpty hasVisitors={false} onRetry={handleManualRefresh} />;
  }

  // Even if totalVisits is 0, we still want to show the empty state with hasVisitors=true
  // This indicates that the visitor tracking is working but no visits have been recorded yet
  if (visitData.totalVisits === 0) {
    return <VisitorStatsEmpty hasVisitors={true} onRetry={handleManualRefresh} />;
  }

  return (
    <div className="space-y-6">
      <VisitorStatsSummaryCards visitData={visitData} />
      <VisitorStatsTabs visitData={visitData} />
    </div>
  );
};

export default VisitorStats;
