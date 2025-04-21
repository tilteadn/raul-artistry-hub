
import { supabase } from "@/integrations/supabase/client";
import { getUserCountry } from "./countryDetection";
import { getUserDeviceInfo } from "./deviceInfo";

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
