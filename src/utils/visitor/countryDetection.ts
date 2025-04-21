
import { supabase } from "@/integrations/supabase/client";

export const SESSION_COUNTRY_KEY = "visitor_country";
export const SESSION_CITY_KEY = "visitor_city";

export const getUserCountry = async (): Promise<{ country: string; city: string | null }> => {
  try {
    // Check if we already have the country and city in sessionStorage
    const cachedCountry = sessionStorage.getItem(SESSION_COUNTRY_KEY);
    const cachedCity = sessionStorage.getItem(SESSION_CITY_KEY);
    
    if (cachedCountry) {
      console.log("Using cached country and city from session:", cachedCountry, cachedCity);
      return { 
        country: cachedCountry, 
        city: cachedCity 
      };
    }
    
    console.log("No cached country found, calling detect-country edge function...");
    
    // Using our Supabase edge function to get visitor's country and city
    const { data, error } = await supabase.functions.invoke('detect-country');
    
    if (error) {
      console.error("Error detecting country via edge function:", error);
      return { country: "Unknown", city: null };
    }
    
    if (!data || !data.country) {
      console.error("Invalid response from detect-country:", data);
      return { country: "Unknown", city: null };
    }
    
    console.log("Country and city detected:", data.country, data.city);
    
    // Store the country and city in sessionStorage for future use
    sessionStorage.setItem(SESSION_COUNTRY_KEY, data.country);
    if (data.city) {
      sessionStorage.setItem(SESSION_CITY_KEY, data.city);
    }
    
    // Return the country and city
    return { 
      country: data.country || "Unknown", 
      city: data.city || null 
    };
  } catch (error) {
    console.error("Exception in getUserCountry:", error);
    return { country: "Unknown", city: null };
  }
};
