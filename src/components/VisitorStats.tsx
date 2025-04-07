
import { useState, useEffect } from "react";
import { VisitorStatsSummaryCards } from "./stats/VisitorStatsSummaryCards";
import { VisitorStatsTabs } from "./stats/VisitorStatsTabs";
import { VisitorStatsLoading } from "./stats/VisitorStatsLoading";
import { VisitorStatsEmpty } from "./stats/VisitorStatsEmpty";
import { SESSION_COUNTRY_KEY } from "@/utils/visitor/countryDetection";
import { calculateVisitorStats, getEmptyStats } from "@/utils/visitorTrackingService";
import type { VisitorData } from "@/utils/visitorTrackingService";
import { toast } from "sonner";

const VisitorStats = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visitData, setVisitData] = useState<VisitorData | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    async function loadVisitorStats() {
      try {
        setLoading(true);
        setError(null);
        
        console.log("Starting to load visitor statistics...");
        const stats = await calculateVisitorStats();
        console.log("Visitor stats loaded:", stats);
        setVisitData(stats);
      } catch (err) {
        console.error("Error loading visitor stats:", err);
        setError("Hubo un error al cargar las estadísticas de visitantes.");
        // Let's show a toast for better visibility of the error
        toast.error("Error loading visitor statistics", {
          description: "Please try refreshing the page."
        });
        // Fallback to empty stats when there's an error
        setVisitData(getEmptyStats());
      } finally {
        setLoading(false);
      }
    }
    
    loadVisitorStats();
  }, [retryCount]);

  const handleManualRefresh = () => {
    // Clear the country cache to force a new check on next visit
    sessionStorage.removeItem(SESSION_COUNTRY_KEY);
    toast.info("Refreshing visitor data...");
    setRetryCount(count => count + 1);
  };
  
  if (loading) {
    return <VisitorStatsLoading />;
  }
  
  if (error && !visitData) {
    return <VisitorStatsEmpty hasVisitors={false} error={error} onRetry={handleManualRefresh} />;
  }
  
  if (!visitData || visitData.totalVisits === 0) {
    return <VisitorStatsEmpty hasVisitors={false} onRetry={handleManualRefresh} />;
  }
  
  return (
    <div className="space-y-6">
      <VisitorStatsSummaryCards visitData={visitData} />
      <VisitorStatsTabs visitData={visitData} />
    </div>
  );
};

export default VisitorStats;
