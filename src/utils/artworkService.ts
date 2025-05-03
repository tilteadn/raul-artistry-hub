
// This file is just a facade for the Supabase artwork service module

import { 
  getAllArtworksFromDb,
  getFeaturedArtworksFromDb,
  getArtworkByIdFromDb,
  getRelatedArtworksFromDb,
  getCollectionsFromDb,
  saveArtworkToDb,
  updateArtworkInDb,
  deleteArtworkFromDb,
  getPaginatedArtworksFromDb
} from './artwork/supabaseArtworkService';

export const getAllArtworks = getAllArtworksFromDb;
export const getFeaturedArtworks = getFeaturedArtworksFromDb;
export const getArtworkById = getArtworkByIdFromDb;
export const getRelatedArtworks = getRelatedArtworksFromDb;
export const getCollections = getCollectionsFromDb;
export const saveArtwork = saveArtworkToDb;
export const updateArtwork = updateArtworkInDb; // This function expects (id, artwork)
export const deleteArtwork = deleteArtworkFromDb;

/**
 * Retrieves paginated artworks with optional filtering
 * @param page Page number (starting from 1)
 * @param pageSize Number of items per page
 * @param collection Optional collection filter
 * @returns Paginated artworks, total count, and total pages
 */
export const getPaginatedArtworks = async (
  page: number = 1,
  pageSize: number = 9,
  collection?: string
): Promise<{ artworks: Artwork[]; total: number; totalPages: number }> => {
  const result = await getPaginatedArtworksFromDb(page, pageSize, collection);
  const totalPages = Math.ceil(result.total / pageSize);
  return { 
    ...result,
    totalPages
  };
};
