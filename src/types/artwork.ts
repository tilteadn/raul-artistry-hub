export type SaleType = 'none' | 'original' | 'print' | 'both';

export interface Artwork {
  id: string;
  title: string;
  subtitle?: string;
  collection: string;
  imageUrl: string | File;
  thumbnailUrl?: string;
  orientation?: 'portrait' | 'landscape' | 'square';
  year?: string;
  technique?: string;
  dimensions?: string;
  description?: string;
  featured?: boolean;
  createdAt: Date;
  // Store-related fields
  forSale?: boolean;
  saleType?: SaleType;
  originalPrice?: number;
  printPrice?: number;
  originalAvailable?: boolean;
}

export interface Collection {
  id: string;
  name: string;
  description?: string;
  thumbnail?: string;
}
