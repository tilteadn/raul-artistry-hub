
import { useState, useEffect } from "react";
import { getVisitorStats, VisitorData } from "@/utils/visitorTrackingService";
import { VisitorStatsSummaryCards } from "./stats/VisitorStatsSummaryCards";
import { VisitorStatsTabs } from "./stats/VisitorStatsTabs";
import { VisitorStatsLoading } from "./stats/VisitorStatsLoading";
import { VisitorStatsEmpty } from "./stats/VisitorStatsEmpty";

const VisitorStats = () => {
  const [visitData, setVisitData] = useState<VisitorData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadVisitorData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        console.log("VisitorStats: Loading visitor data...");
        const data = await getVisitorStats();
        console.log("VisitorStats: Visitor data loaded:", data);
        setVisitData(data);
      } catch (error) {
        console.error("VisitorStats: Error loading visitor data:", error);
        setError("No se pudieron cargar los datos de visitas. Por favor, inténtalo de nuevo más tarde.");
      } finally {
        setIsLoading(false);
      }
    };

    loadVisitorData();
  }, []);

  if (isLoading) {
    return <VisitorStatsLoading />;
  }

  if (error) {
    return <VisitorStatsEmpty hasVisitors={false} error={error} />;
  }

  if (!visitData) {
    return <VisitorStatsEmpty hasVisitors={false} />;
  }

  // Even if totalVisits is 0, we still want to show the empty state with hasVisitors=true
  // This indicates that the visitor tracking is working but no visits have been recorded yet
  if (visitData.totalVisits === 0) {
    return <VisitorStatsEmpty hasVisitors={true} />;
  }

  return (
    <div className="space-y-6">
      <VisitorStatsSummaryCards visitData={visitData} />
      <VisitorStatsTabs visitData={visitData} />
    </div>
  );
};

export default VisitorStats;
