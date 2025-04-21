export interface VisitorRecord {
  id?: string;
  country: string;
  path: string;
  device: string | null;
  browser: string | null;
  city?: string | null;
  created_at?: string;
}

export interface CityData {
  city: string;
  visits: number;
  percentage: number;
}

export interface CountryData {
  country: string;
  visits: number;
  percentage: number;
  topCities?: CityData[];  // Optional array of top cities
}
