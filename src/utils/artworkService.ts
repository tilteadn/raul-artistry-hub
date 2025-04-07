
// This file is just a facade for the Supabase artwork service module

import { 
  getAllArtworksFromDb,
  getFeaturedArtworks,
  getArtworkById,
  getRelatedArtworks,
  getCollections,
  saveArtworkToDb,
  updateArtworkInDb,
  deleteArtworkFromDb
} from './artwork/supabaseArtworkService';

export const getAllArtworks = getAllArtworksFromDb;
export const getFeaturedArtworks = getFeaturedArtworks;
export const getArtworkById = getArtworkById;
export const getRelatedArtworks = getRelatedArtworks;
export const getCollections = getCollections;
export const saveArtwork = saveArtworkToDb;
export const updateArtwork = updateArtworkInDb;
export const deleteArtwork = deleteArtworkFromDb;
