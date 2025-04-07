
import type { MonthlyData, VisitorData } from "./types";

// Function to get empty stats when no data is available
export const getEmptyStats = (): VisitorData => {
  const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
  return {
    totalVisits: 0,
    currentMonthVisits: 0,
    visitIncrease: 0,
    topCountries: [],
    monthlyData: months.map(month => ({ month, visits: 0 }))
  };
};
