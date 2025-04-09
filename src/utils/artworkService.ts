
// This file is just a facade for the Supabase artwork service module

import { 
  getAllArtworksFromDb,
  getFeaturedArtworksFromDb,
  getArtworkByIdFromDb,
  getRelatedArtworksFromDb,
  getCollectionsFromDb,
  saveArtworkToDb,
  updateArtworkInDb,
  deleteArtworkFromDb
} from './artwork/supabaseArtworkService';
import { Artwork } from '@/types/artwork';

export const getAllArtworks = getAllArtworksFromDb;
export const getFeaturedArtworks = getFeaturedArtworksFromDb;
export const getArtworkById = getArtworkByIdFromDb;
export const getRelatedArtworks = getRelatedArtworksFromDb;
export const getCollections = getCollectionsFromDb;
export const saveArtwork = saveArtworkToDb;
// Fix the signature to match the implementation - needs to take a single artwork object with id included
export const updateArtwork = async (artwork: Artwork): Promise<Artwork> => {
  return await updateArtworkInDb(artwork.id, artwork);
};
export const deleteArtwork = deleteArtworkFromDb;
