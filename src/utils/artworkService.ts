
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
export const getPaginatedArtworks = getPaginatedArtworksFromDb;
