
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
 * Filters out problematic artworks from the collection
 */
export const filterProblematicArtworks = (artworks: Artwork[]): Artwork[] => {
  return artworks.filter(
    artwork => 
      artwork.title !== "Serenidad Marina" && 
      artwork.title !== "Amanecer en el Bosque" && 
      artwork.title !== "Abstracción No. 7"
  );
};
