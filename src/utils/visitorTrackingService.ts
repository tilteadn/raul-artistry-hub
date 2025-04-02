
import { supabase } from "@/integrations/supabase/client";

// Types for visitor data
export interface CountryData {
  country: string;
  visits: number;
  percentage: number;
}

export interface MonthlyData {
  month: string;
  visits: number;
}

export interface VisitorData {
  totalVisits: number;
  currentMonthVisits: number;
  visitIncrease: number;
  topCountries: CountryData[];
  monthlyData: MonthlyData[];
}

// Session storage key for country
const SESSION_COUNTRY_KEY = "visitor_country";

// Get the visitor's country using the detect-country edge function
// with session-based caching to avoid redundant API calls
const getUserCountry = async (): Promise<string> => {
  try {
    // Check if we already have the country in sessionStorage
    const cachedCountry = sessionStorage.getItem(SESSION_COUNTRY_KEY);
    if (cachedCountry) {
      console.log("Using cached country from session:", cachedCountry);
      return cachedCountry;
    }
    
    console.log("No cached country found, calling detect-country edge function...");
    
    // Using our Supabase edge function to get visitor's country
    const { data, error } = await supabase.functions.invoke('detect-country');
    
    if (error) {
      console.error("Error detecting country via edge function:", error);
      return "Unknown";
    }
    
    if (!data || !data.country) {
      console.error("Invalid response from detect-country:", data);
      return "Unknown";
    }
    
    console.log("Country detected:", data.country);
    
    // Store the country in sessionStorage for future use
    sessionStorage.setItem(SESSION_COUNTRY_KEY, data.country);
    
    // Return the country name
    return data.country || "Unknown";
  } catch (error) {
    console.error("Exception in getUserCountry:", error);
    return "Unknown";
  }
};

// Get user device and browser information
const getUserDeviceInfo = (): { device: string | null, browser: string | null } => {
  try {
    const userAgent = navigator.userAgent;
    
    // Simple device detection
    let device = null;
    if (/Mobi|Android/i.test(userAgent)) {
      device = "Mobile";
    } else if (/iPad|Tablet/i.test(userAgent)) {
      device = "Tablet";
    } else {
      device = "Desktop";
    }
    
    // Simple browser detection
    let browser = null;
    if (/Firefox/i.test(userAgent)) {
      browser = "Firefox";
    } else if (/Chrome/i.test(userAgent) && !/Edg/i.test(userAgent)) {
      browser = "Chrome";
    } else if (/Edg/i.test(userAgent)) {
      browser = "Edge";
    } else if (/Safari/i.test(userAgent) && !/Chrome/i.test(userAgent)) {
      browser = "Safari";
    } else {
      browser = "Other";
    }
    
    return { device, browser };
  } catch (error) {
    console.error("Error detecting device info:", error);
    return { device: null, browser: null };
  }
};

// Function to track a new visit if consent was given
export const trackVisit = async (): Promise<void> => {
  try {
    console.log("Starting visit tracking...");
    const country = await getUserCountry();
    const { device, browser } = getUserDeviceInfo();
    const path = window.location.pathname;
    
    console.log(`Tracking visit from ${country} on ${path} (${device}/${browser})`);
    
    // Insert the visit into Supabase
    const { error } = await supabase
      .from('visitors')
      .insert({
        country,
        path,
        device,
        browser
      });
    
    if (error) {
      console.error("Error inserting visit record:", error);
      throw error;
    }
    
    console.log("Visit tracked successfully");
  } catch (error) {
    console.error("Error tracking visit:", error);
  }
};

// Function to get visitor statistics from Supabase
export const getVisitorStats = async (): Promise<VisitorData> => {
  try {
    console.log("Getting visitor statistics...");
    
    // Get all visitors to perform calculations
    const { data: allVisitors, error: visitorsError } = await supabase
      .from('visitors')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (visitorsError) {
      console.error("Error getting visitor data:", visitorsError);
      return getEmptyStats();
    }
    
    console.log(`Retrieved ${allVisitors?.length || 0} visitor records`);
    
    if (!allVisitors || allVisitors.length === 0) {
      console.log("No visitor data found");
      return getEmptyStats();
    }
    
    // Calculate various statistics based on visitor data
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    
    // Calculate total visits
    const totalVisits = allVisitors.length;
    
    // Calculate current month visits
    const currentMonthStart = new Date(currentYear, currentMonth, 1);
    const currentMonthVisits = allVisitors.filter(
      visitor => new Date(visitor.created_at) >= currentMonthStart
    ).length;
    
    // Calculate previous month visits for increase calculation
    const previousMonthStart = new Date(currentYear, currentMonth - 1, 1);
    const previousMonthEnd = new Date(currentYear, currentMonth, 0);
    const previousMonthVisits = allVisitors.filter(
      visitor => {
        const date = new Date(visitor.created_at);
        return date >= previousMonthStart && date <= previousMonthEnd;
      }
    ).length;
    
    // Calculate visit increase percentage
    let visitIncrease = 0;
    if (previousMonthVisits > 0) {
      visitIncrease = ((currentMonthVisits - previousMonthVisits) / previousMonthVisits) * 100;
    } else if (currentMonthVisits > 0) {
      visitIncrease = 100; // If no previous visits but we have current visits, that's a 100% increase
    }
    
    // Group by country (manually since we can't use .group())
    const countryMap = new Map<string, number>();
    allVisitors.forEach(visitor => {
      const country = visitor.country || "Unknown";
      countryMap.set(country, (countryMap.get(country) || 0) + 1);
    });
    
    // Convert to array and sort
    const countryData = Array.from(countryMap.entries())
      .map(([country, visits]) => ({ country, visits }))
      .sort((a, b) => b.visits - a.visits);
    
    // Create top countries array with percentage calculation
    const topCountries: CountryData[] = countryData
      .slice(0, 5)
      .map(item => ({
        country: item.country,
        visits: item.visits,
        percentage: (item.visits / totalVisits) * 100
      }));
    
    // Add "Otros" category for remaining countries
    if (countryData.length > 5) {
      const otherVisits = totalVisits - topCountries.reduce((sum, country) => sum + country.visits, 0);
      if (otherVisits > 0) {
        topCountries.push({
          country: "Otros",
          visits: otherVisits,
          percentage: (otherVisits / totalVisits) * 100
        });
      }
    }
    
    // Calculate monthly data
    const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
    const monthlyData: MonthlyData[] = [];
    
    // Count visits per month for the current year
    for (let i = 0; i < 12; i++) {
      const monthStart = new Date(currentYear, i, 1);
      const monthEnd = new Date(currentYear, i + 1, 0);
      
      const monthVisits = allVisitors.filter(visitor => {
        const date = new Date(visitor.created_at);
        return date >= monthStart && date <= monthEnd;
      }).length;
      
      monthlyData.push({ month: months[i], visits: monthVisits });
    }
    
    console.log("Visitor statistics calculated successfully");
    console.log("Top countries:", topCountries);
    
    return {
      totalVisits,
      currentMonthVisits,
      visitIncrease,
      topCountries,
      monthlyData
    };
  } catch (error) {
    console.error("Error calculating visitor stats:", error);
    return getEmptyStats();
  }
};

// Function to get empty stats when no data is available
const getEmptyStats = (): VisitorData => {
  const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
  return {
    totalVisits: 0,
    currentMonthVisits: 0,
    visitIncrease: 0,
    topCountries: [],
    monthlyData: months.map(month => ({ month, visits: 0 }))
  };
};
