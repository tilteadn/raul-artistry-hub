
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
