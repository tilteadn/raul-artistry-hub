
import { supabase } from "@/integrations/supabase/client";
import type { VisitorData, MonthlyData, CountryData } from "./types";
import { getEmptyStats } from "./statsCalculation";

/**
 * Fetches raw visitor records from the database
 */
export async function fetchVisitorRecords() {
  try {
    console.log("Fetching visitor records from database...");
    
    // Check if we have an active session for the admin user
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      console.warn("No authenticated session found when fetching visitor records");
    } else {
      console.log("Authenticated session found, proceeding with visitor records fetch");
    }
    
    const { data: visitors, error } = await supabase
      .from('visitors')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Error fetching visitor records:", error);
      throw error;
    }
    
    console.log(`Retrieved ${visitors?.length || 0} visitor records`);
    return visitors || [];
  } catch (error) {
    console.error("Failed to fetch visitor records:", error);
    throw error;
  }
}

/**
 * Calculates visitor statistics from the raw visitor records
 */
export async function calculateVisitorStats(): Promise<VisitorData> {
  try {
    const visitors = await fetchVisitorRecords();
    
    if (!visitors || visitors.length === 0) {
      console.log("No visitor records found, returning empty stats");
      return getEmptyStats();
    }
    
    // Get current month and year for filtering
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    
    // Calculate current month visits
    const currentMonthVisits = visitors.filter(v => {
      const visitDate = new Date(v.created_at);
      return visitDate.getMonth() === currentMonth && visitDate.getFullYear() === currentYear;
    }).length;
    
    // Calculate last month visits for percentage increase
    const lastMonthVisits = visitors.filter(v => {
      const visitDate = new Date(v.created_at);
      return visitDate.getMonth() === lastMonth && visitDate.getFullYear() === lastMonthYear;
    }).length;
    
    // Calculate visit increase percentage
    const visitIncrease = lastMonthVisits === 0 
      ? 100 // If no visits last month, consider it a 100% increase
      : ((currentMonthVisits - lastMonthVisits) / lastMonthVisits) * 100;
    
    // Calculate top countries
    const countryCounts: Record<string, number> = {};
    visitors.forEach(visitor => {
      const country = visitor.country || 'Unknown';
      countryCounts[country] = (countryCounts[country] || 0) + 1;
    });
    
    const topCountries: CountryData[] = Object.entries(countryCounts)
      .map(([country, visits]) => ({
        country,
        visits,
        percentage: (visits / visitors.length) * 100
      }))
      .sort((a, b) => b.visits - a.visits)
      .slice(0, 5);
    
    // Calculate monthly data
    const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
    const monthlyData: MonthlyData[] = months.map(month => {
      const monthIndex = months.indexOf(month);
      const visitsInMonth = visitors.filter(v => {
        const visitDate = new Date(v.created_at);
        return visitDate.getMonth() === monthIndex && visitDate.getFullYear() === currentYear;
      }).length;
      
      return { month, visits: visitsInMonth };
    });
    
    return {
      totalVisits: visitors.length,
      currentMonthVisits,
      visitIncrease,
      topCountries,
      monthlyData
    };
  } catch (error) {
    console.error("Error calculating visitor stats:", error);
    throw error;
  }
}

// No need to re-export getEmptyStats here
