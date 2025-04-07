
import { supabase } from "@/integrations/supabase/client";
import { Artwork } from "@/types/artwork";
import { v4 as uuidv4 } from 'uuid';

const STORAGE_BUCKET = 'artwork_images';

/**
 * Sanitizes a filename to make it storage-safe
 * @param filename Original filename
 * @returns Sanitized filename
 */
const sanitizeFilename = (filename: string): string => {
  // Replace accented characters with non-accented versions
  const withoutAccents = filename.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  
  // Replace spaces and special characters with dashes
  return withoutAccents
    .replace(/[^a-zA-Z0-9.]/g, '-')
    .replace(/-+/g, '-'); // Replace multiple consecutive dashes with a single dash
};

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
    
    // Generate a unique file path with sanitized filename
    const sanitizedName = sanitizeFilename(file.name);
    const filePath = `${uuidv4()}-${sanitizedName}`;
    
    console.log(`Uploading file to ${STORAGE_BUCKET}/${filePath}`);
    
    // Upload the file to Supabase Storage
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true // Changed to true to allow overwriting existing files
      });
    
    if (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
    
    // Get the public URL for the file
    const { data: { publicUrl } } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(data.path);
    
    console.log('File uploaded successfully, public URL:', publicUrl);
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
    
    console.log(`Retrieved ${data?.length || 0} artworks from database`);
    return data ? data.map(mapDbArtworkToArtwork) : [];
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
    console.log('Saving new artwork to database:', artwork.title);
    
    // Handle image upload if it's a local URL (starts with blob:)
    let imageUrl = artwork.imageUrl;
    
    // Check if there's a pending image in localStorage
    const pendingImage = localStorage.getItem('pendingArtworkImage');
    console.log('Pending image in localStorage:', pendingImage ? 'Yes' : 'No');
    
    if (pendingImage && imageUrl.startsWith('blob:')) {
      try {
        console.log('Processing pending image from localStorage');
        const imageData = JSON.parse(pendingImage);
        // Fetch the image as a blob and upload it
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const file = new File([blob], imageData.fileName || 'artwork.jpg', { 
          type: imageData.type || 'image/jpeg' 
        });
        
        // Upload the actual file
        console.log('Uploading blob image to Supabase storage');
        imageUrl = await uploadImage(file);
        
        // Clear the pending image
        localStorage.removeItem('pendingArtworkImage');
        console.log('Uploaded image URL:', imageUrl);
      } catch (uploadError) {
        console.error('Error uploading stored image:', uploadError);
        throw new Error(`Failed to upload image: ${uploadError.message}`);
      }
    } else if (typeof artwork.imageUrl === 'string' && artwork.imageUrl.startsWith('data:')) {
      console.log('Processing data URL image');
      imageUrl = await uploadImage(artwork.imageUrl);
      console.log('Uploaded data URL image:', imageUrl);
    } else {
      console.log('Using existing image URL:', imageUrl);
    }
    
    const dbArtwork = {
      ...mapArtworkToDbArtwork(artwork),
      image_url: imageUrl
    };
    
    console.log('Inserting artwork into database:', dbArtwork);
    const { data, error } = await supabase
      .from('artworks')
      .insert(dbArtwork)
      .select()
      .single();
    
    if (error) {
      console.error('Error saving artwork:', error);
      throw new Error(`Failed to save artwork: ${error.message}`);
    }
    
    if (!data) {
      throw new Error('No data returned after saving artwork');
    }
    
    console.log('Artwork saved successfully:', data.id);
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
    console.log(`Updating artwork ID: ${id}, Title: ${artwork.title}`);
    
    // Handle image upload if it's a local URL (starts with blob:)
    let imageUrl = artwork.imageUrl;
    
    // Check if there's a pending image in localStorage
    const pendingImage = localStorage.getItem('pendingArtworkImage');
    console.log('Pending image in localStorage:', pendingImage ? 'Yes' : 'No');
    
    if (pendingImage && imageUrl.startsWith('blob:')) {
      try {
        console.log('Processing pending image from localStorage for update');
        const imageData = JSON.parse(pendingImage);
        // Fetch the image as a blob and upload it
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const file = new File([blob], imageData.fileName || 'artwork.jpg', { 
          type: imageData.type || 'image/jpeg' 
        });
        
        // Upload the actual file
        console.log('Uploading blob image to Supabase storage for update');
        imageUrl = await uploadImage(file);
        
        // Clear the pending image
        localStorage.removeItem('pendingArtworkImage');
        console.log('Uploaded image URL for update:', imageUrl);
      } catch (uploadError) {
        console.error('Error uploading stored image for update:', uploadError);
        throw new Error(`Failed to upload image: ${uploadError.message}`);
      }
    } else if (typeof artwork.imageUrl === 'string' && artwork.imageUrl.startsWith('data:')) {
      console.log('Processing data URL image for update');
      imageUrl = await uploadImage(artwork.imageUrl);
      console.log('Uploaded data URL image for update:', imageUrl);
    } else {
      console.log('Using existing image URL for update:', imageUrl);
    }
    
    const dbArtwork = {
      ...mapArtworkToDbArtwork(artwork),
      image_url: imageUrl,
      updated_at: new Date().toISOString()
    };
    
    console.log('Updating artwork in database:', dbArtwork);
    const { data, error } = await supabase
      .from('artworks')
      .update(dbArtwork)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating artwork:', error);
      throw new Error(`Failed to update artwork: ${error.message}`);
    }
    
    if (!data) {
      throw new Error('No data returned after updating artwork');
    }
    
    console.log('Artwork updated successfully:', data.id);
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
    console.log(`Deleting artwork ID: ${id}`);
    const { error } = await supabase
      .from('artworks')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting artwork:', error);
      throw new Error(`Failed to delete artwork: ${error.message}`);
    }
    
    console.log('Artwork deleted successfully');
  } catch (error) {
    console.error('Error in deleteArtworkFromDb:', error);
    throw error;
  }
};
