
import { Artwork, Collection } from "@/types/artwork";
import { 
  getAllArtworksFromDb, 
  getFeaturedArtworksFromDb,
  getArtworkByIdFromDb,
  getRelatedArtworksFromDb,
  getCollectionsFromDb,
  saveArtworkToDb, 
  updateArtworkInDb, 
  deleteArtworkFromDb 
} from "./supabaseArtworkService";

/**
 * Retrieves all artworks, sorted by creation date (newest first)
 */
export const getAllArtworks = async (): Promise<Artwork[]> => {
  try {
    return await getAllArtworksFromDb();
  } catch (error) {
    console.error("Error accessing Supabase:", error);
    throw error;
  }
};

/**
 * Retrieves up to 3 featured (most recent) artworks
 */
export const getFeaturedArtworks = async (): Promise<Artwork[]> => {
  try {
    return await getFeaturedArtworksFromDb();
  } catch (error) {
    console.error("Error fetching featured artworks:", error);
    throw error;
  }
};

/**
 * Retrieves a specific artwork by ID
 */
export const getArtworkById = async (id: string): Promise<Artwork | null> => {
  try {
    return await getArtworkByIdFromDb(id);
  } catch (error) {
    console.error(`Error fetching artwork with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Retrieves artworks related to a given collection, excluding the specified artwork
 */
export const getRelatedArtworks = async (
  collection: string,
  excludeId: string
): Promise<Artwork[]> => {
  try {
    return await getRelatedArtworksFromDb(collection, excludeId);
  } catch (error) {
    console.error(`Error fetching related artworks for collection ${collection}:`, error);
    throw error;
  }
};

/**
 * Retrieves all unique collections
 */
export const getCollections = async (): Promise<Collection[]> => {
  try {
    return await getCollectionsFromDb();
  } catch (error) {
    console.error("Error fetching collections:", error);
    throw error;
  }
};

/**
 * Saves a new artwork
 * Note: imageUrl can be a string URL, data URL, or File object
 * The backend will handle the File object appropriately
 */
export const saveArtwork = async (artwork: Artwork): Promise<Artwork> => {
  try {
    return await saveArtworkToDb(artwork);
  } catch (error) {
    console.error("Error saving artwork:", error);
    throw error;
  }
};

/**
 * Updates an existing artwork
 * Note: imageUrl can be a string URL, data URL, or File object
 */
export const updateArtwork = async (artwork: Artwork): Promise<Artwork> => {
  try {
    return await updateArtworkInDb(artwork.id, artwork);
  } catch (error) {
    console.error(`Error updating artwork with ID ${artwork.id}:`, error);
    throw error;
  }
};

/**
 * Deletes an artwork by ID
 */
export const deleteArtwork = async (id: string): Promise<void> => {
  try {
    await deleteArtworkFromDb(id);
  } catch (error) {
    console.error(`Error deleting artwork with ID ${id}:`, error);
    throw error;
  }
};
