
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

// Get the visitor's country using the detect-country edge function
const getUserCountry = async (): Promise<string> => {
  try {
    // Using our Supabase edge function to get visitor's country
    const { data, error } = await supabase.functions.invoke('detect-country');
    
    if (error) {
      console.error("Error detecting country via edge function:", error);
      return "Unknown";
    }
    
    // Return the country name
    return data.country || "Unknown";
  } catch (error) {
    console.error("Error detecting country:", error);
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
    const country = await getUserCountry();
    const { device, browser } = getUserDeviceInfo();
    const path = window.location.pathname;
    
    console.log(`Tracking visit from ${country} on ${path}`);
    
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
    // Get current month statistics
    const now = new Date();
    const currentMonth = now.toLocaleString('default', { month: 'short' });
    const currentYear = now.getFullYear();
    
    // Get total visits
    const { count: totalVisits, error: countError } = await supabase
      .from('visitors')
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      console.error("Error getting total visits:", countError);
      return getEmptyStats();
    }
    
    // Get current month visits
    const monthStart = new Date(currentYear, now.getMonth(), 1);
    const { count: currentMonthVisits, error: monthCountError } = await supabase
      .from('visitors')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', monthStart.toISOString());
    
    if (monthCountError) {
      console.error("Error getting current month visits:", monthCountError);
      return getEmptyStats();
    }
    
    // Get previous month visits for increase calculation
    const previousMonth = new Date(currentYear, now.getMonth() - 1, 1);
    const previousMonthEnd = new Date(currentYear, now.getMonth(), 0);
    
    const { count: previousMonthVisits, error: prevMonthError } = await supabase
      .from('visitors')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', previousMonth.toISOString())
      .lte('created_at', previousMonthEnd.toISOString());
    
    if (prevMonthError) {
      console.error("Error getting previous month visits:", prevMonthError);
      return getEmptyStats();
    }
    
    // Calculate visit increase percentage
    const visitIncrease = previousMonthVisits 
      ? ((currentMonthVisits - previousMonthVisits) / previousMonthVisits) * 100
      : 100;
    
    // Get top countries
    const { data: countryData, error: countryError } = await supabase
      .from('visitors')
      .select('country, count(*)')
      .group('country')
      .order('count', { ascending: false });
    
    if (countryError) {
      console.error("Error getting country data:", countryError);
      return getEmptyStats();
    }
    
    const topCountries: CountryData[] = (countryData || [])
      .map(item => ({
        country: item.country,
        visits: parseInt(item.count as any),
        percentage: totalVisits ? (parseInt(item.count as any) / totalVisits) * 100 : 0
      }))
      .slice(0, 5);
    
    // If we have more than 5 countries, add "Otros" for the rest
    if ((countryData || []).length > 5) {
      const otherVisits = totalVisits - topCountries.reduce((sum, country) => sum + country.visits, 0);
      topCountries.push({
        country: "Otros",
        visits: otherVisits,
        percentage: totalVisits ? (otherVisits / totalVisits) * 100 : 0
      });
    }
    
    // Get monthly data - this is a bit more complex since we need to aggregate by month
    const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
    const monthlyData: MonthlyData[] = [];
    
    // For each month, query the database
    for (let i = 0; i < 12; i++) {
      const monthStart = new Date(currentYear, i, 1);
      const monthEnd = new Date(currentYear, i + 1, 0);
      
      const { count: monthVisits, error: monthError } = await supabase
        .from('visitors')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', monthStart.toISOString())
        .lte('created_at', monthEnd.toISOString());
      
      if (monthError) {
        console.error(`Error getting visits for month ${i+1}:`, monthError);
        monthlyData.push({ month: months[i], visits: 0 });
      } else {
        monthlyData.push({ month: months[i], visits: monthVisits || 0 });
      }
    }
    
    return {
      totalVisits: totalVisits || 0,
      currentMonthVisits: currentMonthVisits || 0,
      visitIncrease,
      topCountries,
      monthlyData
    };
  } catch (error) {
    console.error("Error getting visitor stats:", error);
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
