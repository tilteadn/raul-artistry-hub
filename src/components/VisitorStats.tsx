
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
        } else if (data.topCountries.length > 0) {
          // Log country breakdown for debugging
          console.log("VisitorStats: Countries breakdown:", 
            data.topCountries.map(c => `${c.country}: ${c.visits} (${c.percentage.toFixed(1)}%)`).join(', ')
          );
          
          // Check if most visitors have unknown country
          const unknownCountry = data.topCountries.find(c => c.country === "Unknown");
          if (unknownCountry && unknownCountry.percentage > 80) {
            console.log("VisitorStats: Most visitors have unknown country. Country detection might not be working optimally.");
            toast.info("La detección de países puede no funcionar correctamente en este momento", {
              duration: 5000,
            });
          }
        }
        
        setVisitData(data);
      } catch (error) {
        console.error("VisitorStats: Error loading visitor data:", error);
        toast.error("Error al cargar estadísticas de visitas");
        setError("No se pudieron cargar los datos de visitas. Por favor, inténtalo de nuevo más tarde.");
      } finally {
        setIsLoading(false);
      }
    };

    loadVisitorData();
    
    // Set up auto-refresh every 5 minutes if there was an error
    // This helps recover from temporary API issues
    const intervalId = setInterval(() => {
      if (error || (visitData?.topCountries.length === 1 && visitData.topCountries[0].country === "Unknown")) {
        console.log("VisitorStats: Auto-refreshing stats due to previous errors");
        setRetryCount(count => count + 1);
        loadVisitorData();
      }
    }, 5 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, [retryCount]);

  const handleManualRefresh = () => {
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
