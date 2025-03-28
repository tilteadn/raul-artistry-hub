
import { supabase } from "@/integrations/supabase/client";
import { Artwork } from "@/types/artwork";
import { v4 as uuidv4 } from 'uuid';

const STORAGE_BUCKET = 'artwork_images';

/**
 * Uploads an image to Supabase storage
 * @param file File or data URL to upload
 * @returns URL of the uploaded file
 */
export const uploadImage = async (fileOrDataUrl: File | string): Promise<string> => {
  try {
    let file: File;
    
    // Convert data URL to File if necessary
    if (typeof fileOrDataUrl === 'string' && fileOrDataUrl.startsWith('data:')) {
      // Parse the data URL
      const res = await fetch(fileOrDataUrl);
      const blob = await res.blob();
      file = new File([blob], `artwork-${uuidv4()}.jpg`, { type: 'image/jpeg' });
    } else if (fileOrDataUrl instanceof File) {
      file = fileOrDataUrl;
    } else {
      throw new Error('Invalid file format');
    }
    
    // Generate a unique file path
    const filePath = `${uuidv4()}-${file.name.replace(/\s+/g, '-')}`;
    
    // Upload the file to Supabase Storage
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
    
    // Get the public URL for the file
    const { data: { publicUrl } } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(data.path);
    
    return publicUrl;
  } catch (error) {
    console.error('Error in uploadImage:', error);
    throw error;
  }
};

/**
 * Maps database artwork to frontend Artwork type
 */
const mapDbArtworkToArtwork = (dbArtwork: any): Artwork => ({
  id: dbArtwork.id,
  title: dbArtwork.title,
  subtitle: dbArtwork.subtitle,
  collection: dbArtwork.collection,
  imageUrl: dbArtwork.image_url,
  thumbnailUrl: dbArtwork.thumbnail_url,
  year: dbArtwork.year || undefined,
  technique: dbArtwork.technique || undefined,
  dimensions: dbArtwork.dimensions || undefined,
  description: dbArtwork.description || undefined,
  createdAt: new Date(dbArtwork.created_at),
});

/**
 * Maps frontend Artwork to database format
 */
const mapArtworkToDbArtwork = (artwork: Omit<Artwork, "id" | "createdAt">) => ({
  title: artwork.title,
  subtitle: artwork.subtitle,
  collection: artwork.collection,
  image_url: artwork.imageUrl,
  thumbnail_url: artwork.thumbnailUrl || null,
  year: artwork.year || null,
  technique: artwork.technique || null,
  dimensions: artwork.dimensions || null,
  description: artwork.description || null,
});

/**
 * Retrieves all artworks from Supabase
 */
export const getAllArtworksFromDb = async (): Promise<Artwork[]> => {
  try {
    const { data, error } = await supabase
      .from('artworks')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching artworks:', error);
      throw error;
    }
    
    return data.map(mapDbArtworkToArtwork);
  } catch (error) {
    console.error('Error in getAllArtworksFromDb:', error);
    throw error;
  }
};

/**
 * Saves a new artwork to Supabase
 */
export const saveArtworkToDb = async (artwork: Omit<Artwork, "id" | "createdAt">): Promise<Artwork> => {
  try {
    // Handle image upload if it's a local URL (starts with blob:)
    let imageUrl = artwork.imageUrl;
    
    // Check if there's a pending image in localStorage
    const pendingImage = localStorage.getItem('pendingArtworkImage');
    if (pendingImage && imageUrl.startsWith('blob:')) {
      try {
        const imageData = JSON.parse(pendingImage);
        // Fetch the image as a blob and upload it
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const file = new File([blob], imageData.fileName || 'artwork.jpg', { 
          type: imageData.type || 'image/jpeg' 
        });
        
        // Upload the actual file
        imageUrl = await uploadImage(file);
        
        // Clear the pending image
        localStorage.removeItem('pendingArtworkImage');
      } catch (uploadError) {
        console.error('Error uploading stored image:', uploadError);
        throw uploadError;
      }
    } else if (typeof artwork.imageUrl === 'string' && artwork.imageUrl.startsWith('data:')) {
      imageUrl = await uploadImage(artwork.imageUrl);
    }
    
    const dbArtwork = {
      ...mapArtworkToDbArtwork(artwork),
      image_url: imageUrl
    };
    
    const { data, error } = await supabase
      .from('artworks')
      .insert(dbArtwork)
      .select()
      .single();
    
    if (error) {
      console.error('Error saving artwork:', error);
      throw error;
    }
    
    return mapDbArtworkToArtwork(data);
  } catch (error) {
    console.error('Error in saveArtworkToDb:', error);
    throw error;
  }
};

/**
 * Updates an existing artwork in Supabase
 */
export const updateArtworkInDb = async (id: string, artwork: Omit<Artwork, "id" | "createdAt">): Promise<Artwork> => {
  try {
    // Handle image upload if it's a local URL (starts with blob:)
    let imageUrl = artwork.imageUrl;
    
    // Check if there's a pending image in localStorage
    const pendingImage = localStorage.getItem('pendingArtworkImage');
    if (pendingImage && imageUrl.startsWith('blob:')) {
      try {
        const imageData = JSON.parse(pendingImage);
        // Fetch the image as a blob and upload it
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const file = new File([blob], imageData.fileName || 'artwork.jpg', { 
          type: imageData.type || 'image/jpeg' 
        });
        
        // Upload the actual file
        imageUrl = await uploadImage(file);
        
        // Clear the pending image
        localStorage.removeItem('pendingArtworkImage');
      } catch (uploadError) {
        console.error('Error uploading stored image:', uploadError);
        throw uploadError;
      }
    } else if (typeof artwork.imageUrl === 'string' && artwork.imageUrl.startsWith('data:')) {
      imageUrl = await uploadImage(artwork.imageUrl);
    }
    
    const dbArtwork = {
      ...mapArtworkToDbArtwork(artwork),
      image_url: imageUrl,
      updated_at: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from('artworks')
      .update(dbArtwork)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating artwork:', error);
      throw error;
    }
    
    return mapDbArtworkToArtwork(data);
  } catch (error) {
    console.error('Error in updateArtworkInDb:', error);
    throw error;
  }
};

/**
 * Deletes an artwork from Supabase
 */
export const deleteArtworkFromDb = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('artworks')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting artwork:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error in deleteArtworkFromDb:', error);
    throw error;
  }
};
