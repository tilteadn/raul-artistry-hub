
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

// Get the visitor's country using a geolocation API
const getUserCountry = async (): Promise<string> => {
  try {
    // Using the free ipapi.co service to get visitor's country
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    
    // Return the country name
    return data.country_name || "Unknown";
  } catch (error) {
    console.error("Error detecting country:", error);
    return "Unknown";
  }
};

// Function to track a new visit if consent was given
export const trackVisit = async (): Promise<void> => {
  const consent = localStorage.getItem("cookie-consent");
  if (consent !== "true") {
    console.log("Visit not tracked - no consent");
    return;
  }

  try {
    const now = new Date();
    const month = now.toLocaleString('default', { month: 'short' });
    const country = await getUserCountry();
    
    // Get existing tracking data
    let trackingData = localStorage.getItem("visitor-tracking-data");
    let data = trackingData ? JSON.parse(trackingData) : {
      visits: [],
      countries: {}
    };
    
    // Add new visit
    data.visits.push({
      timestamp: now.toISOString(),
      month: month,
      country: country,
      path: window.location.pathname
    });
    
    // Update country counter
    data.countries[country] = (data.countries[country] || 0) + 1;
    
    // Save updated data
    localStorage.setItem("visitor-tracking-data", JSON.stringify(data));
    console.log("Visit tracked for", country);
  } catch (error) {
    console.error("Error tracking visit:", error);
  }
};

// Function to get visitor statistics from localStorage
export const getVisitorStats = async (): Promise<VisitorData> => {
  try {
    const trackingData = localStorage.getItem("visitor-tracking-data");
    
    if (!trackingData) {
      return getEmptyStats();
    }
    
    const data = JSON.parse(trackingData);
    const visits = data.visits || [];
    const countries = data.countries || {};
    
    // Calculate total visits
    const totalVisits = visits.length;
    
    // Get current month and previous month visits
    const now = new Date();
    const currentMonth = now.toLocaleString('default', { month: 'short' });
    
    const currentMonthVisits = visits.filter(v => v.month === currentMonth).length;
    
    // Calculate previous month (simple approach for demo)
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1)
      .toLocaleString('default', { month: 'short' });
    
    const previousMonthVisits = visits.filter(v => v.month === lastMonth).length;
    
    // Calculate visit increase percentage
    const visitIncrease = previousMonthVisits 
      ? ((currentMonthVisits - previousMonthVisits) / previousMonthVisits) * 100
      : 100;
    
    // Get top countries
    const topCountries = Object.entries(countries)
      .map(([country, visits]) => ({
        country,
        visits: visits as number,
        percentage: totalVisits ? ((visits as number) / totalVisits) * 100 : 0
      }))
      .sort((a, b) => b.visits - a.visits)
      .slice(0, 5);
    
    // If we have less than 6 countries, add "Otros" for the rest
    if (Object.keys(countries).length > 5) {
      const otherVisits = totalVisits - topCountries.reduce((sum, country) => sum + country.visits, 0);
      topCountries.push({
        country: "Otros",
        visits: otherVisits,
        percentage: totalVisits ? (otherVisits / totalVisits) * 100 : 0
      });
    }
    
    // Get monthly data
    const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
    const monthlyData = months.map(month => {
      const monthVisits = visits.filter(v => v.month === month).length;
      return { month, visits: monthVisits };
    });
    
    return {
      totalVisits,
      currentMonthVisits,
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
