
import { Artwork, Collection } from "@/types/artwork";
import { v4 as uuidv4 } from 'uuid';
import { getStoredArtworks, saveStoredArtworks, resetToMockArtworks } from "./storageUtils";

/**
 * Retrieves all artworks, sorted by creation date (newest first)
 */
export const getAllArtworks = async (): Promise<Artwork[]> => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  // Always reset to use the updated safe URLs to ensure images are displayed
  const artworks = resetToMockArtworks();
  
  // Sort by creation date, newest first
  return artworks.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
};

/**
 * Retrieves up to 3 featured (most recent) artworks
 */
export const getFeaturedArtworks = async (): Promise<Artwork[]> => {
  const allArtworks = await getAllArtworks();
  // Get up to 3 most recent artworks
  return allArtworks.slice(0, 3);
};

/**
 * Retrieves a specific artwork by ID
 */
export const getArtworkById = async (id: string): Promise<Artwork | null> => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 300));
  
  const artworks = getStoredArtworks();
  return artworks.find((artwork) => artwork.id === id) || null;
};

/**
 * Retrieves artworks related to a given collection, excluding the specified artwork
 */
export const getRelatedArtworks = async (
  collection: string,
  excludeId: string
): Promise<Artwork[]> => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 300));
  
  const artworks = getStoredArtworks();
  return artworks
    .filter(
      (artwork) => artwork.collection === collection && artwork.id !== excludeId
    )
    .slice(0, 3);
};

/**
 * Retrieves all unique collections
 */
export const getCollections = async (): Promise<Collection[]> => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 400));
  
  const artworks = getStoredArtworks();
  
  // Extract unique collections and create collection objects
  const collections = Array.from(
    new Set(artworks.map((artwork) => artwork.collection))
  ).map((name) => {
    // Find the first artwork in this collection to use as thumbnail
    const firstArtwork = artworks.find((a) => a.collection === name);
    
    return {
      id: name.toLowerCase().replace(/\s+/g, "-"),
      name,
      thumbnail: firstArtwork?.imageUrl,
    };
  });
  
  return collections;
};

/**
 * Saves a new artwork
 */
export const saveArtwork = async (artwork: Artwork): Promise<Artwork> => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 600));
  
  const artworks = getStoredArtworks();
  artworks.push(artwork);
  saveStoredArtworks(artworks);
  
  return artwork;
};

/**
 * Updates an existing artwork
 */
export const updateArtwork = async (artwork: Artwork): Promise<Artwork> => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 600));
  
  const artworks = getStoredArtworks();
  const index = artworks.findIndex((a) => a.id === artwork.id);
  
  if (index === -1) {
    throw new Error("Artwork not found");
  }
  
  artworks[index] = artwork;
  saveStoredArtworks(artworks);
  
  return artwork;
};

/**
 * Deletes an artwork by ID
 */
export const deleteArtwork = async (id: string): Promise<void> => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 400));
  
  const artworks = getStoredArtworks();
  const filteredArtworks = artworks.filter((a) => a.id !== id);
  saveStoredArtworks(filteredArtworks);
};
