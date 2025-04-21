
import { supabase } from "@/integrations/supabase/client";
import { getUserCountry } from "./countryDetection";
import { getUserDeviceInfo } from "./deviceInfo";
import type { VisitorRecord } from "./types";

export const trackVisit = async (): Promise<void> => {
  try {
    console.log("Starting visit tracking...");
    const { country, city } = await getUserCountry();
    const { device, browser } = getUserDeviceInfo();
    const path = window.location.pathname;
    
    console.log(`Tracking visit from ${country}, ${city} on ${path} (${device}/${browser})`);
    
    // Prepare visitor record with city
    const visitorRecord: VisitorRecord = {
      country,
      path,
      device,
      browser,
      city
    };
    
    // Insert the visit into Supabase
    const { error } = await supabase
      .from('visitors')
      .insert(visitorRecord);
    
    if (error) {
      console.error("Error inserting visit record:", error);
      throw error;
    }
    
    console.log("Visit tracked successfully");
  } catch (error) {
    console.error("Error tracking visit:", error);
  }
};
