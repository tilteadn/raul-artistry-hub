
export interface Artwork {
  id: string;
  title: string;
  subtitle?: string;
  collection: string;
  imageUrl: string | File; // Updated to accept File objects
  thumbnailUrl?: string;
  year?: string;
  technique?: string;
  dimensions?: string;
  description?: string;
  createdAt: Date;
}

export interface Collection {
  id: string;
  name: string;
  description?: string;
  thumbnail?: string;
}
