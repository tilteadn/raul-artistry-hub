
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Define CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

// Define a standard response for handling CORS preflight requests
const handleCors = (req: Request) => {
  if (req.method === 'OPTIONS') {
    console.log("Handling OPTIONS preflight request");
    return new Response(null, { headers: corsHeaders });
  }
  return null;
};

// Simple in-memory cache for IP lookups to avoid hitting rate limits
// This will be reset when the edge function cold starts
const ipCache: Record<string, { country: string, country_code: string, city?: string, region?: string, timestamp: number }> = {};
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours cache

serve(async (req) => {
  try {
    console.log(`Received ${req.method} request to detect-country function`);
    
    // Handle CORS
    const corsResponse = handleCors(req);
    if (corsResponse) return corsResponse;
    
    // Get the IP address (Supabase automatically includes the IP in x-forwarded-for)
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || '127.0.0.1';
    
    console.log(`Detecting country for IP: ${ip}`);
    
    // Check if we have a cached result for this IP
    const now = Date.now();
    if (ipCache[ip] && (now - ipCache[ip].timestamp) < CACHE_TTL) {
      console.log(`Using cached result for IP ${ip}: ${ipCache[ip].country}`);
      return new Response(JSON.stringify({
        country: ipCache[ip].country,
        country_code: ipCache[ip].country_code,
        city: ipCache[ip].city,
        region: ipCache[ip].region,
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    // Try primary service (ipapi.co)
    try {
      console.log("Attempting to fetch country data from ipapi.co...");
      const response = await fetch(`https://ipapi.co/${ip}/json/`);
      
      if (response.ok) {
        const data = await response.json();
        console.log("API response data from ipapi.co:", JSON.stringify(data));
        
        if (!data.error) {
          // Cache the result
          ipCache[ip] = {
            country: data.country_name || "Unknown",
            country_code: data.country_code || "XX",
            city: data.city,
            region: data.region,
            timestamp: now
          };
          
          console.log(`Successfully detected country: ${data.country_name || "Unknown"}`);
          
          return new Response(JSON.stringify({
            country: data.country_name || "Unknown",
            country_code: data.country_code || "XX",
            city: data.city,
            region: data.region,
          }), {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }
        
        console.log("Error from ipapi.co:", data.error);
      } else {
        console.error(`Error from ipapi.co: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error fetching from ipapi.co:", error);
    }
    
    // Fallback to a second service (ipinfo.io)
    try {
      console.log("Falling back to ipinfo.io...");
      const response = await fetch(`https://ipinfo.io/${ip}/json`);
      
      if (response.ok) {
        const data = await response.json();
        console.log("API response data from ipinfo.io:", JSON.stringify(data));
        
        // Cache the result
        ipCache[ip] = {
          country: data.country ? getCountryName(data.country) : "Unknown",
          country_code: data.country || "XX",
          city: data.city,
          region: data.region,
          timestamp: now
        };
        
        console.log(`Successfully detected country with fallback: ${ipCache[ip].country}`);
        
        return new Response(JSON.stringify({
          country: ipCache[ip].country,
          country_code: data.country || "XX",
          city: data.city,
          region: data.region,
        }), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    } catch (error) {
      console.error("Error fetching from ipinfo.io:", error);
    }
    
    // Final fallback: geoip-db.com
    try {
      console.log("Falling back to geoip-db.com...");
      const response = await fetch(`https://geolocation-db.com/json/${ip}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log("API response data from geoip-db.com:", JSON.stringify(data));
        
        // Cache the result
        ipCache[ip] = {
          country: data.country_name || "Unknown",
          country_code: data.country_code || "XX",
          city: data.city,
          region: data.state,
          timestamp: now
        };
        
        console.log(`Successfully detected country with final fallback: ${ipCache[ip].country}`);
        
        return new Response(JSON.stringify({
          country: ipCache[ip].country,
          country_code: data.country_code || "XX",
          city: data.city,
          region: data.state,
        }), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    } catch (error) {
      console.error("Error fetching from geoip-db.com:", error);
    }
    
    // If all services fail, return Unknown but still cache to prevent hammering APIs
    console.log("All geolocation services failed, returning Unknown");
    ipCache[ip] = {
      country: "Unknown",
      country_code: "XX",
      timestamp: now
    };
    
    return new Response(JSON.stringify({ 
      country: "Unknown", 
      country_code: "XX",
      error: "All geolocation services failed" 
    }), {
      status: 200, // Still return 200 to not break client flow
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error("Error detecting country:", error);
    return new Response(JSON.stringify({ 
      country: "Unknown", 
      country_code: "XX",
      error: error.message 
    }), {
      status: 200, // Still return 200 to prevent client from breaking
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

// Helper function to convert country codes to country names
function getCountryName(countryCode: string): string {
  const countries: Record<string, string> = {
    "AF": "Afghanistan", "AX": "Åland Islands", "AL": "Albania", "DZ": "Algeria",
    "AS": "American Samoa", "AD": "Andorra", "AO": "Angola", "AI": "Anguilla",
    "AQ": "Antarctica", "AG": "Antigua and Barbuda", "AR": "Argentina", "AM": "Armenia",
    "AW": "Aruba", "AU": "Australia", "AT": "Austria", "AZ": "Azerbaijan",
    "BS": "Bahamas", "BH": "Bahrain", "BD": "Bangladesh", "BB": "Barbados",
    "BY": "Belarus", "BE": "Belgium", "BZ": "Belize", "BJ": "Benin",
    "BM": "Bermuda", "BT": "Bhutan", "BO": "Bolivia", "BA": "Bosnia and Herzegovina",
    "BW": "Botswana", "BV": "Bouvet Island", "BR": "Brazil", "IO": "British Indian Ocean Territory",
    "BN": "Brunei Darussalam", "BG": "Bulgaria", "BF": "Burkina Faso", "BI": "Burundi",
    "KH": "Cambodia", "CM": "Cameroon", "CA": "Canada", "CV": "Cape Verde",
    "KY": "Cayman Islands", "CF": "Central African Republic", "TD": "Chad", "CL": "Chile",
    "CN": "China", "CX": "Christmas Island", "CC": "Cocos (Keeling) Islands", "CO": "Colombia",
    "KM": "Comoros", "CG": "Congo", "CD": "Congo, Democratic Republic", "CK": "Cook Islands",
    "CR": "Costa Rica", "CI": "Cote D'Ivoire", "HR": "Croatia", "CU": "Cuba",
    "CY": "Cyprus", "CZ": "Czech Republic", "DK": "Denmark", "DJ": "Djibouti",
    "DM": "Dominica", "DO": "Dominican Republic", "EC": "Ecuador", "EG": "Egypt",
    "SV": "El Salvador", "GQ": "Equatorial Guinea", "ER": "Eritrea", "EE": "Estonia",
    "ET": "Ethiopia", "FK": "Falkland Islands", "FO": "Faroe Islands", "FJ": "Fiji",
    "FI": "Finland", "FR": "France", "GF": "French Guiana", "PF": "French Polynesia",
    "TF": "French Southern Territories", "GA": "Gabon", "GM": "Gambia", "GE": "Georgia",
    "DE": "Germany", "GH": "Ghana", "GI": "Gibraltar", "GR": "Greece",
    "GL": "Greenland", "GD": "Grenada", "GP": "Guadeloupe", "GU": "Guam",
    "GT": "Guatemala", "GG": "Guernsey", "GN": "Guinea", "GW": "Guinea-Bissau",
    "GY": "Guyana", "HT": "Haiti", "HM": "Heard Island & Mcdonald Islands", "VA": "Holy See (Vatican)",
    "HN": "Honduras", "HK": "Hong Kong", "HU": "Hungary", "IS": "Iceland",
    "IN": "India", "ID": "Indonesia", "IR": "Iran", "IQ": "Iraq",
    "IE": "Ireland", "IM": "Isle Of Man", "IL": "Israel", "IT": "Italy",
    "JM": "Jamaica", "JP": "Japan", "JE": "Jersey", "JO": "Jordan",
    "KZ": "Kazakhstan", "KE": "Kenya", "KI": "Kiribati", "KR": "Korea",
    "KW": "Kuwait", "KG": "Kyrgyzstan", "LA": "Lao People's Democratic Republic", "LV": "Latvia",
    "LB": "Lebanon", "LS": "Lesotho", "LR": "Liberia", "LY": "Libyan Arab Jamahiriya",
    "LI": "Liechtenstein", "LT": "Lithuania", "LU": "Luxembourg", "MO": "Macao",
    "MK": "Macedonia", "MG": "Madagascar", "MW": "Malawi", "MY": "Malaysia",
    "MV": "Maldives", "ML": "Mali", "MT": "Malta", "MH": "Marshall Islands",
    "MQ": "Martinique", "MR": "Mauritania", "MU": "Mauritius", "YT": "Mayotte",
    "MX": "Mexico", "FM": "Micronesia", "MD": "Moldova", "MC": "Monaco",
    "MN": "Mongolia", "ME": "Montenegro", "MS": "Montserrat", "MA": "Morocco",
    "MZ": "Mozambique", "MM": "Myanmar", "NA": "Namibia", "NR": "Nauru",
    "NP": "Nepal", "NL": "Netherlands", "AN": "Netherlands Antilles", "NC": "New Caledonia",
    "NZ": "New Zealand", "NI": "Nicaragua", "NE": "Niger", "NG": "Nigeria",
    "NU": "Niue", "NF": "Norfolk Island", "MP": "Northern Mariana Islands", "NO": "Norway",
    "OM": "Oman", "PK": "Pakistan", "PW": "Palau", "PS": "Palestine",
    "PA": "Panama", "PG": "Papua New Guinea", "PY": "Paraguay", "PE": "Peru",
    "PH": "Philippines", "PN": "Pitcairn", "PL": "Poland", "PT": "Portugal",
    "PR": "Puerto Rico", "QA": "Qatar", "RE": "Reunion", "RO": "Romania",
    "RU": "Russian Federation", "RW": "Rwanda", "BL": "Saint Barthelemy", "SH": "Saint Helena",
    "KN": "Saint Kitts And Nevis", "LC": "Saint Lucia", "MF": "Saint Martin", "PM": "Saint Pierre And Miquelon",
    "VC": "Saint Vincent And Grenadines", "WS": "Samoa", "SM": "San Marino", "ST": "Sao Tome And Principe",
    "SA": "Saudi Arabia", "SN": "Senegal", "RS": "Serbia", "SC": "Seychelles",
    "SL": "Sierra Leone", "SG": "Singapore", "SK": "Slovakia", "SI": "Slovenia",
    "SB": "Solomon Islands", "SO": "Somalia", "ZA": "South Africa", "GS": "South Georgia And Sandwich Islands",
    "ES": "Spain", "LK": "Sri Lanka", "SD": "Sudan", "SR": "Suriname",
    "SJ": "Svalbard And Jan Mayen", "SZ": "Swaziland", "SE": "Sweden", "CH": "Switzerland",
    "SY": "Syrian Arab Republic", "TW": "Taiwan", "TJ": "Tajikistan", "TZ": "Tanzania",
    "TH": "Thailand", "TL": "Timor-Leste", "TG": "Togo", "TK": "Tokelau",
    "TO": "Tonga", "TT": "Trinidad And Tobago", "TN": "Tunisia", "TR": "Turkey",
    "TM": "Turkmenistan", "TC": "Turks And Caicos Islands", "TV": "Tuvalu", "UG": "Uganda",
    "UA": "Ukraine", "AE": "United Arab Emirates", "GB": "United Kingdom", "US": "United States",
    "UM": "United States Outlying Islands", "UY": "Uruguay", "UZ": "Uzbekistan", "VU": "Vanuatu",
    "VE": "Venezuela", "VN": "Vietnam", "VG": "Virgin Islands, British", "VI": "Virgin Islands, U.S.",
    "WF": "Wallis And Futuna", "EH": "Western Sahara", "YE": "Yemen", "ZM": "Zambia", "ZW": "Zimbabwe"
  };
  
  return countries[countryCode] || countryCode || "Unknown";
}
