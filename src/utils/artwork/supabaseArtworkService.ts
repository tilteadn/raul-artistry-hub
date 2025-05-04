import { supabase } from "@/integrations/supabase/client";
import { Artwork, Collection } from "@/types/artwork";
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
 * Extracts the file path from a public URL
 * @param publicUrl The public URL of the file
 * @returns The file path in storage
 */
const extractFilePathFromUrl = (publicUrl: string): string | null => {
  try {
    // Extract the file path from the URL
    const url = new URL(publicUrl);
    const pathSegments = url.pathname.split('/');
    
    // Find the index of the bucket name in the path
    const bucketIndex = pathSegments.findIndex(segment => segment === STORAGE_BUCKET);
    
    if (bucketIndex === -1 || bucketIndex >= pathSegments.length - 1) {
      console.error('Could not find bucket in URL path:', publicUrl);
      return null;
    }
    
    // Join the remaining segments to form the file path
    return pathSegments.slice(bucketIndex + 1).join('/');
  } catch (error) {
    console.error('Error extracting file path from URL:', error);
    return null;
  }
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
        upsert: true
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
 * Creates a thumbnail from an original image URL
 * @param originalUrl The original image URL
 * @param width Desired width of the thumbnail
 * @returns URL of the thumbnail with resize transformation
 */
export const createThumbnailUrl = (originalUrl: string, width: number = 400): string => {
  try {
    // Check if we can create a Supabase Storage thumbnail
    if (originalUrl && originalUrl.includes('storage.googleapis.com')) {
      // Craft a thumbnail URL using Supabase's image transformation API
      const url = new URL(originalUrl);
      
      // Add width resize parameter
      url.searchParams.set('width', width.toString());
      
      // Lower quality for thumbnails to reduce size
      url.searchParams.set('quality', '80');
      
      return url.toString();
    }
    
    // For other URLs, return the original
    return originalUrl;
  } catch (error) {
    console.error('Error creating thumbnail URL:', error);
    return originalUrl;
  }
};

/**
 * Maps database artwork to frontend Artwork type
 */
const mapDbArtworkToArtwork = (dbArtwork: any): Artwork => {
  // Generate a thumbnail URL if one doesn't exist
  let thumbnailUrl = dbArtwork.thumbnail_url;
  
  if (!thumbnailUrl && dbArtwork.image_url) {
    thumbnailUrl = createThumbnailUrl(dbArtwork.image_url);
  }
  
  return {
    id: dbArtwork.id,
    title: dbArtwork.title,
    subtitle: dbArtwork.subtitle,
    collection: dbArtwork.collection,
    imageUrl: dbArtwork.image_url,
    thumbnailUrl: thumbnailUrl,
    year: dbArtwork.year || undefined,
    technique: dbArtwork.technique || undefined,
    dimensions: dbArtwork.dimensions || undefined,
    description: dbArtwork.description || undefined,
    createdAt: new Date(dbArtwork.created_at),
  };
};

/**
 * Maps frontend Artwork to database format
 */
const mapArtworkToDbArtwork = (artwork: Omit<Artwork, "id" | "createdAt">) => {
  // Generate thumbnail URL from the main image if available
  let thumbnailUrl = artwork.thumbnailUrl;
  if (!thumbnailUrl && typeof artwork.imageUrl === 'string' && !artwork.imageUrl.startsWith('blob:')) {
    thumbnailUrl = createThumbnailUrl(artwork.imageUrl);
  }
  
  return {
    title: artwork.title,
    subtitle: artwork.subtitle,
    collection: artwork.collection,
    image_url: artwork.imageUrl,
    thumbnail_url: thumbnailUrl || null,
    year: artwork.year || null,
    technique: artwork.technique || null,
    dimensions: artwork.dimensions || null,
    description: artwork.description || null,
  };
};

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
 * Retrieves paginated artworks from Supabase with optional filtering
 * @param page Page number (starting from 1)
 * @param pageSize Number of items per page
 * @param collection Optional collection filter
 */
export const getPaginatedArtworksFromDb = async (
  page: number = 1,
  pageSize: number = 9,
  collection?: string
): Promise<{ artworks: Artwork[]; total: number }> => {
  try {
    // Calculate range for pagination
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    
    // Start query builder
    let query = supabase.from('artworks').select('*', { count: 'exact' });
    
    // Apply collection filter if provided
    if (collection) {
      query = query.eq('collection', collection);
    }
    
    // Apply range and order
    query = query.order('created_at', { ascending: false }).range(from, to);
    
    // Execute query
    const { data, error, count } = await query;
    
    if (error) {
      console.error('Error fetching paginated artworks:', error);
      throw error;
    }
    
    console.log(`Retrieved ${data?.length || 0} paginated artworks from database (page ${page}, total: ${count || 0})`);
    
    return {
      artworks: data ? data.map(mapDbArtworkToArtwork) : [],
      total: count || 0
    };
  } catch (error) {
    console.error('Error in getPaginatedArtworksFromDb:', error);
    throw error;
  }
};

/**
 * Retrieves featured artworks from Supabase
 * Specifically pulls "Sicut ars tunica", "El pintor (Retrato de Leo)", and "Sal y limones"
 */
export const getFeaturedArtworksFromDb = async (): Promise<Artwork[]> => {
  try {
    const featuredTitles = [
      'Sicut ars tunica',
      'El pintor (Retrato de Leo)',
      'Sal y limones'
    ];
    
    console.log('Fetching specific featured artworks:', featuredTitles.join(', '));
    
    const { data, error } = await supabase
      .from('artworks')
      .select('*')
      .in('title', featuredTitles);
    
    if (error) {
      console.error('Error fetching featured artworks:', error);
      throw error;
    }
    
    // Sort them in the order specified in the featuredTitles array
    const sortedData = data ? [...data].sort((a, b) => {
      return featuredTitles.indexOf(a.title) - featuredTitles.indexOf(b.title);
    }) : [];
    
    console.log(`Retrieved ${sortedData.length} featured artworks`);
    
    return sortedData.map(mapDbArtworkToArtwork);
  } catch (error) {
    console.error('Error in getFeaturedArtworksFromDb:', error);
    throw error;
  }
};

/**
 * Retrieves a specific artwork by ID from Supabase
 */
export const getArtworkByIdFromDb = async (id: string): Promise<Artwork | null> => {
  try {
    const { data, error } = await supabase
      .from('artworks')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned (not found)
        return null;
      }
      console.error('Error fetching artwork by ID:', error);
      throw error;
    }
    
    return data ? mapDbArtworkToArtwork(data) : null;
  } catch (error) {
    console.error(`Error in getArtworkByIdFromDb for ID ${id}:`, error);
    throw error;
  }
};

/**
 * Retrieves artworks related to a given collection from Supabase
 */
export const getRelatedArtworksFromDb = async (collection: string, excludeId: string): Promise<Artwork[]> => {
  try {
    const { data, error } = await supabase
      .from('artworks')
      .select('*')
      .eq('collection', collection)
      .neq('id', excludeId)
      .limit(3);
    
    if (error) {
      console.error('Error fetching related artworks:', error);
      throw error;
    }
    
    return data ? data.map(mapDbArtworkToArtwork) : [];
  } catch (error) {
    console.error(`Error in getRelatedArtworksFromDb for collection ${collection}:`, error);
    throw error;
  }
};

/**
 * Retrieves all unique collections from Supabase
 */
export const getCollectionsFromDb = async (): Promise<Collection[]> => {
  try {
    // Get distinct collections
    const { data: collectionsData, error: collectionsError } = await supabase
      .from('artworks')
      .select('collection')
      .order('collection');
    
    if (collectionsError) {
      console.error('Error fetching collections:', collectionsError);
      throw collectionsError;
    }
    
    // Filter for unique collections
    const uniqueCollections = Array.from(
      new Set(collectionsData?.map(item => item.collection) || [])
    ).filter(Boolean);
    
    // For each collection, find an artwork to use as thumbnail
    const collections: Collection[] = [];
    
    for (const collection of uniqueCollections) {
      // Get first artwork in this collection to use as thumbnail
      const { data: artworkData } = await supabase
        .from('artworks')
        .select('image_url')
        .eq('collection', collection)
        .limit(1)
        .single();
      
      collections.push({
        id: collection.toLowerCase().replace(/\s+/g, "-"),
        name: collection,
        thumbnail: artworkData?.image_url || undefined,
      });
    }
    
    return collections;
  } catch (error) {
    console.error('Error in getCollectionsFromDb:', error);
    throw error;
  }
};

/**
 * Saves a new artwork to Supabase
 */
export const saveArtworkToDb = async (artwork: Artwork): Promise<Artwork> => {
  try {
    console.log('Saving new artwork to database:', artwork.title);
    
    // Handle image upload if it's a File object or data URL
    let imageUrl = artwork.imageUrl;
    
    if (typeof artwork.imageUrl === 'string' && artwork.imageUrl.startsWith('data:')) {
      console.log('Processing data URL image');
      imageUrl = await uploadImage(artwork.imageUrl);
      console.log('Uploaded data URL image:', imageUrl);
    } else if (artwork.imageUrl instanceof File) {
      console.log('Processing File object');
      imageUrl = await uploadImage(artwork.imageUrl);
      console.log('Uploaded File image:', imageUrl);
    } else if (typeof artwork.imageUrl === 'string' && artwork.imageUrl.startsWith('blob:')) {
      console.error('Blob URLs are not supported without the associated File object');
      throw new Error('Blob URLs are not supported for upload. Please provide the original file.');
    } else {
      console.log('Using existing image URL:', imageUrl);
    }
    
    const dbArtwork = {
      ...mapArtworkToDbArtwork({
        ...artwork,
        imageUrl: typeof imageUrl === 'string' ? imageUrl : ''
      }),
      image_url: typeof imageUrl === 'string' ? imageUrl : ''
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
    
    // Handle image upload if it's a File object or data URL
    let imageUrl = artwork.imageUrl;
    
    if (typeof artwork.imageUrl === 'string' && artwork.imageUrl.startsWith('data:')) {
      console.log('Processing data URL image for update');
      imageUrl = await uploadImage(artwork.imageUrl);
      console.log('Uploaded data URL image for update:', imageUrl);
    } else if (artwork.imageUrl instanceof File) {
      console.log('Processing File object for update');
      imageUrl = await uploadImage(artwork.imageUrl);
      console.log('Uploaded File image for update:', imageUrl);
    } else if (typeof artwork.imageUrl === 'string' && artwork.imageUrl.startsWith('blob:')) {
      console.error('Blob URLs are not supported without the associated File object');
      throw new Error('Blob URLs are not supported for upload. Please provide the original file.');
    } else {
      console.log('Using existing image URL for update:', imageUrl);
    }
    
    const dbArtwork = {
      ...mapArtworkToDbArtwork({
        ...artwork,
        imageUrl: typeof imageUrl === 'string' ? imageUrl : ''
      }),
      image_url: typeof imageUrl === 'string' ? imageUrl : '',
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
    
    // First, get the artwork to retrieve its image URL
    const { data: artwork, error: fetchError } = await supabase
      .from('artworks')
      .select('image_url')
      .eq('id', id)
      .single();
    
    if (fetchError) {
      console.error('Error fetching artwork for deletion:', fetchError);
      throw new Error(`Failed to fetch artwork: ${fetchError.message}`);
    }
    
    // Delete the artwork record from the database
    const { error: deleteError } = await supabase
      .from('artworks')
      .delete()
      .eq('id', id);
    
    if (deleteError) {
      console.error('Error deleting artwork from database:', deleteError);
      throw new Error(`Failed to delete artwork: ${deleteError.message}`);
    }
    
    // If the artwork has an image, delete it from storage
    if (artwork && artwork.image_url) {
      const filePath = extractFilePathFromUrl(artwork.image_url);
      
      if (filePath) {
        console.log(`Deleting image file from storage: ${filePath}`);
        const { error: storageError } = await supabase
          .storage
          .from(STORAGE_BUCKET)
          .remove([filePath]);
        
        if (storageError) {
          // Log the error but don't throw, as we've already deleted the artwork record
          console.error('Error deleting image from storage:', storageError);
          console.warn(`Image file ${filePath} may need manual deletion`);
        } else {
          console.log('Image file deleted successfully from storage');
        }
      } else {
        console.warn(`Could not extract file path from URL: ${artwork.image_url}`);
      }
    } else {
      console.log('No image to delete from storage');
    }
    
    console.log('Artwork deleted successfully');
  } catch (error) {
    console.error('Error in deleteArtworkFromDb:', error);
    throw error;
  }
};
