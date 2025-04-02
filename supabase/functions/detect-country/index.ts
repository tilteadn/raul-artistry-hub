
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Define CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Define a standard response for handling CORS preflight requests
const handleCors = (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  return null;
};

serve(async (req) => {
  // Handle CORS
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    console.log(`Received ${req.method} request to detect-country function`);
    
    // Get the IP address (Supabase automatically includes the IP in x-forwarded-for)
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || '127.0.0.1';
    
    console.log(`Detecting country for IP: ${ip}`);
    
    // Call ipapi.co to get detailed location data
    const response = await fetch(`https://ipapi.co/${ip}/json/`);
    
    if (!response.ok) {
      console.error(`Error from ipapi: ${response.status} ${response.statusText}`);
      return new Response(JSON.stringify({ 
        country: "Unknown", 
        error: `API error: ${response.status}` 
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    const data = await response.json();
    
    if (data.error) {
      console.error("Error from ipapi:", data.error);
      return new Response(JSON.stringify({ 
        country: "Unknown", 
        error: data.error 
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    console.log(`Successfully detected country: ${data.country_name || "Unknown"}`);

    // Return the country data
    return new Response(JSON.stringify({
      country: data.country_name || "Unknown",
      country_code: data.country_code || "XX",
      city: data.city,
      region: data.region,
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error("Error detecting country:", error);
    return new Response(JSON.stringify({ 
      country: "Unknown", 
      error: error.message 
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
