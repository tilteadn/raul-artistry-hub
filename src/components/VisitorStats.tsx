
import { useState } from "react";
import { VisitorStatsSummaryCards } from "./stats/VisitorStatsSummaryCards";
import { VisitorStatsTabs } from "./stats/VisitorStatsTabs";
import { VisitorStatsLoading } from "./stats/VisitorStatsLoading";
import { VisitorStatsEmpty } from "./stats/VisitorStatsEmpty";

const VisitorStats = () => {
  const [retryCount, setRetryCount] = useState(0);

  // Instead of loading data, we'll just show the empty state
  const handleManualRefresh = () => {
    // Clear the country cache to force a new check on next visit
    sessionStorage.removeItem('visitor_country');
    setRetryCount(count => count + 1);
  };

  // Show empty state indicating there's no data available
  return (
    <VisitorStatsEmpty 
      hasVisitors={false} 
      onRetry={handleManualRefresh}
    />
  );
};

export default VisitorStats;
