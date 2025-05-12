
export interface Artwork {
  id: string;
  title: string;
  subtitle?: string;
  collection: string;
  imageUrl: string | File; // Updated to accept File objects
  thumbnailUrl?: string;
  orientation?: 'portrait' | 'landscape' | 'square'; // Added orientation field
  year?: string;
  technique?: string;
  dimensions?: string;
  description?: string;
  featured?: boolean; // Added featured flag
  createdAt: Date;
}

export interface Collection {
  id: string;
  name: string;
  description?: string;
  thumbnail?: string;
}
