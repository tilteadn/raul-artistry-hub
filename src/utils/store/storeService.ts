import { supabase } from "@/integrations/supabase/client";
import { Artwork, SaleType } from "@/types/artwork";

/**
 * Maps database artwork to frontend Artwork type with store fields
 */
const mapDbArtworkToArtwork = (dbArtwork: any): Artwork => {
  return {
    id: dbArtwork.id,
    title: dbArtwork.title,
    subtitle: dbArtwork.subtitle,
    collection: dbArtwork.collection,
    imageUrl: dbArtwork.image_url,
    thumbnailUrl: dbArtwork.thumbnail_url,
    orientation: dbArtwork.orientation || undefined,
    year: dbArtwork.year || undefined,
    technique: dbArtwork.technique || undefined,
    dimensions: dbArtwork.dimensions || undefined,
    description: dbArtwork.description || undefined,
    featured: dbArtwork.featured || false,
    createdAt: new Date(dbArtwork.created_at),
    // Store fields
    forSale: dbArtwork.for_sale || false,
    saleType: (dbArtwork.sale_type as SaleType) || 'none',
    originalPrice: dbArtwork.original_price ? parseFloat(dbArtwork.original_price) : undefined,
    printPrice: dbArtwork.print_price ? parseFloat(dbArtwork.print_price) : undefined,
    originalAvailable: dbArtwork.original_available ?? true,
  };
};

/**
 * Get artworks available for sale, separated by type
 */
export const getStoreArtworks = async (): Promise<{
  originals: Artwork[];
  prints: Artwork[];
}> => {
  try {
    // Get artworks where description contains "A la venta"
    const { data: originalsData, error: originalsError } = await supabase
      .from('artworks')
      .select('*')
      .ilike('description', '%A la venta%')
      .order('created_at', { ascending: false });

    if (originalsError) {
      console.error('Error fetching originals:', originalsError);
      throw originalsError;
    }

    // Get all artworks that are for sale as prints (sale_type = 'print' or 'both')
    const { data: printsData, error: printsError } = await supabase
      .from('artworks')
      .select('*')
      .eq('for_sale', true)
      .in('sale_type', ['print', 'both'])
      .order('created_at', { ascending: false });

    if (printsError) {
      console.error('Error fetching prints:', printsError);
      throw printsError;
    }

    return {
      originals: originalsData ? originalsData.map(mapDbArtworkToArtwork) : [],
      prints: printsData ? printsData.map(mapDbArtworkToArtwork) : [],
    };
  } catch (error) {
    console.error('Error in getStoreArtworks:', error);
    throw error;
  }
};

/**
 * Get a single artwork with store details
 */
export const getStoreArtworkById = async (id: string): Promise<Artwork | null> => {
  try {
    const { data, error } = await supabase
      .from('artworks')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching store artwork:', error);
      throw error;
    }

    return data ? mapDbArtworkToArtwork(data) : null;
  } catch (error) {
    console.error('Error in getStoreArtworkById:', error);
    throw error;
  }
};

/**
 * Generate WhatsApp link with pre-filled message
 */
export const generateWhatsAppLink = (
  artwork: Artwork,
  type: 'original' | 'print',
  phoneNumber: string = '34XXXXXXXXX' // Replace with actual number
): string => {
  const price = type === 'original' ? artwork.originalPrice : artwork.printPrice;
  const priceText = price ? ` (${price}€)` : '';
  const typeText = type === 'original' ? 'el original' : 'una lámina';
  
  const message = encodeURIComponent(
    `¡Hola! Me interesa ${typeText} de la obra "${artwork.title}"${priceText}. ¿Podrías darme más información?`
  );
  
  return `https://wa.me/${phoneNumber}?text=${message}`;
};
