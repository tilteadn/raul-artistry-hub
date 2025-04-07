
import { useState, useEffect } from "react";
import { VisitorStatsSummaryCards } from "./stats/VisitorStatsSummaryCards";
import { VisitorStatsTabs } from "./stats/VisitorStatsTabs";
import { VisitorStatsLoading } from "./stats/VisitorStatsLoading";
import { VisitorStatsEmpty } from "./stats/VisitorStatsEmpty";
import { SESSION_COUNTRY_KEY } from "@/utils/visitor/countryDetection";
import { calculateVisitorStats } from "@/utils/visitorTrackingService";
import type { VisitorData } from "@/utils/visitorTrackingService";

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
        
        const stats = await calculateVisitorStats();
        setVisitData(stats);
      } catch (err) {
        console.error("Error loading visitor stats:", err);
        setError("Hubo un error al cargar las estadísticas de visitantes.");
      } finally {
        setLoading(false);
      }
    }
    
    loadVisitorStats();
  }, [retryCount]);

  const handleManualRefresh = () => {
    // Clear the country cache to force a new check on next visit
    sessionStorage.removeItem(SESSION_COUNTRY_KEY);
    setRetryCount(count => count + 1);
  };
  
  if (loading) {
    return <VisitorStatsLoading />;
  }
  
  if (error) {
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
