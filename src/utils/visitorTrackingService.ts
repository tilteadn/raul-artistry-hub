
// Re-export all visitor tracking related functionality
export { trackVisit } from './visitor/trackVisit';
export { calculateVisitorStats } from './visitor/visitorDataService';
export { getEmptyStats } from './visitor/statsCalculation'; // Import directly from statsCalculation
export type { CountryData, MonthlyData, VisitorData, CityData } from './visitor/types';
