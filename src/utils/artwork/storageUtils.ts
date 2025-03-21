
import { Artwork } from "@/types/artwork";
import { MOCK_ARTWORKS } from "./mockData";

// Storage keys
const ARTWORKS_STORAGE_KEY = "raul_alvarez_artworks";

/**
 * Retrieves artworks from localStorage, initializing with mock data if none exists
 */
export const getStoredArtworks = (): Artwork[] => {
  const storedData = localStorage.getItem(ARTWORKS_STORAGE_KEY);
  
  if (!storedData) {
    // Initialize with mock data if no data exists
    localStorage.setItem(ARTWORKS_STORAGE_KEY, JSON.stringify(MOCK_ARTWORKS));
    return MOCK_ARTWORKS;
  }
  
  try {
    const artworks = JSON.parse(storedData);
    // Convert string dates to Date objects
    return artworks.map((artwork: any) => ({
      ...artwork,
      createdAt: new Date(artwork.createdAt),
    }));
  } catch (error) {
    console.error("Error parsing stored artworks:", error);
    return [];
  }
};

/**
 * Saves artworks to localStorage
 */
export const saveStoredArtworks = (artworks: Artwork[]): void => {
  localStorage.setItem(ARTWORKS_STORAGE_KEY, JSON.stringify(artworks));
};

/**
 * Helper function to clear localStorage and reinitialize with mock data
 * Can be used to reset the gallery if needed
 */
export const resetToMockArtworks = (): Artwork[] => {
  localStorage.removeItem(ARTWORKS_STORAGE_KEY);
  return getStoredArtworks(); // This will initialize with MOCK_ARTWORKS
};

/**
 * Filters out problematic artworks from the collection
 * No longer needed as we've replaced the problematic artworks
 */
export const filterProblematicArtworks = (artworks: Artwork[]): Artwork[] => {
  return artworks;
};
