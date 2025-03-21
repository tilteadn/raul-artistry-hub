
// This file is now just a facade for the refactored modules
// to maintain backward compatibility with existing imports

import { 
  getAllArtworks,
  getFeaturedArtworks,
  getArtworkById,
  getRelatedArtworks,
  getCollections,
  saveArtwork,
  updateArtwork,
  deleteArtwork
} from './artwork/artworkService';

export {
  getAllArtworks,
  getFeaturedArtworks,
  getArtworkById,
  getRelatedArtworks,
  getCollections,
  saveArtwork,
  updateArtwork,
  deleteArtwork
};
