
import { supabase } from "@/integrations/supabase/client";

// Session storage key for country
export const SESSION_COUNTRY_KEY = "visitor_country";

// Get the visitor's country using the detect-country edge function
// with session-based caching to avoid redundant API calls
export const getUserCountry = async (): Promise<string> => {
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
