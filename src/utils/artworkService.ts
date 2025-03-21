import { Artwork, Collection } from "@/types/artwork";
import { v4 as uuidv4 } from 'uuid';

// Local images uploaded by the user
const LOCAL_IMAGE_URLS = [
  "/lovable-uploads/b25bb82f-8f40-467a-a1b0-a5be24d05385.png", // Retrato
  "/lovable-uploads/a39c4c37-616f-4ec5-973b-102908af9f14.png", // El Pintor
  "/lovable-uploads/d910daa9-517f-461b-b0b0-73ab5038a58c.png", // Sumersión
];

// Safer image URLs that should work reliably
const SAFE_IMAGE_URLS = [
  "https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1050&q=80",
  "https://images.unsplash.com/photo-1551732998-9573f695fdbb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1050&q=80",
  "https://images.unsplash.com/photo-1498330177096-689e3fb901ca?ixlib=rb-4.0.3&auto=format&fit=crop&w=1050&q=80",
];

// Dummy data for initial state
const MOCK_ARTWORKS: Artwork[] = [
  {
    id: "1",
    title: "Retrato",
    subtitle: "Estudio de iluminación en blanco y negro",
    collection: "Retratos",
    imageUrl: LOCAL_IMAGE_URLS[0],
    year: "2022",
    technique: "Fotografía digital",
    dimensions: "50 x 70 cm",
    description: "Un retrato en blanco y negro que explora la masculinidad y la introspección a través del juego de luces y sombras marcadas, capturando la esencia del sujeto en un momento de reflexión.",
    createdAt: new Date("2022-03-15"),
  },
  {
    id: "2",
    title: "El Pintor",
    subtitle: "Retrato de joven artista",
    collection: "Retratos",
    imageUrl: LOCAL_IMAGE_URLS[1],
    year: "2021",
    technique: "Óleo sobre lienzo",
    dimensions: "90 x 120 cm",
    description: "Retrato de un joven artista con bata de pintor manchada de colores diversos, representando la fusión entre el creador y su obra, en una composición que destaca la inocencia y determinación del sujeto.",
    createdAt: new Date("2021-11-08"),
  },
  {
    id: "3",
    title: "Sumersión",
    subtitle: "Estudio de figura en agua",
    collection: "Figurativo",
    imageUrl: LOCAL_IMAGE_URLS[2],
    year: "2023",
    technique: "Óleo sobre lienzo",
    dimensions: "100 x 80 cm",
    description: "Una representación de la figura humana sumergida en agua, donde se explora la distorsión y el movimiento del cuerpo bajo la superficie, creando un equilibrio entre realismo y abstracción que invita a la contemplación.",
    createdAt: new Date("2023-01-22"),
  },
  {
    id: "4",
    title: "Reflejos Urbanos",
    subtitle: "La ciudad tras la lluvia",
    collection: "Urbano",
    imageUrl: SAFE_IMAGE_URLS[0],
    year: "2022",
    technique: "Óleo sobre lienzo",
    dimensions: "90 x 70 cm",
    description: "Una representación de la ciudad moderna después de la lluvia, capturando los reflejos en las superficies mojadas y la atmósfera particular que se crea cuando las luces urbanas se reflejan en las calles húmedas.",
    createdAt: new Date("2022-07-04"),
  },
  {
    id: "5",
    title: "Fragmentos de Memoria",
    subtitle: "Recuerdos abstractos",
    collection: "Abstracciones",
    imageUrl: SAFE_IMAGE_URLS[1],
    year: "2021",
    technique: "Técnica mixta",
    dimensions: "110 x 90 cm",
    description: "Una composición que explora la naturaleza fragmentada de los recuerdos, mezclando formas y colores que evocan momentos efímeros de la memoria personal.",
    createdAt: new Date("2021-09-17"),
  },
  {
    id: "6",
    title: "Vibración Cromática",
    subtitle: "Estudio de interacción de colores",
    collection: "Abstracciones",
    imageUrl: SAFE_IMAGE_URLS[2],
    year: "2023",
    technique: "Acrílico sobre lienzo",
    dimensions: "100 x 100 cm",
    description: "Un experimento visual que explora cómo los colores interactúan entre sí, creando vibraciones ópticas y generando movimiento a través de la yuxtaposición de tonos complementarios.",
    createdAt: new Date("2023-02-28"),
  }
];

// Storage keys
const ARTWORKS_STORAGE_KEY = "raul_alvarez_artworks";

// Helper functions
const getStoredArtworks = (): Artwork[] => {
  const storedData = localStorage.getItem(ARTWORKS_STORAGE_KEY);
  
  if (!storedData) {
    // Initialize with mock data if no data exists
    localStorage.setItem(ARTWORKS_STORAGE_KEY, JSON.stringify(MOCK_ARTWORKS));
    return MOCK_ARTWORKS;
  }
  
  try {
    const artworks = JSON.parse(storedData);
    // Convert string dates to Date objects
    return artworks.map((artwork: any) => ({
      ...artwork,
      createdAt: new Date(artwork.createdAt),
    }));
  } catch (error) {
    console.error("Error parsing stored artworks:", error);
    return [];
  }
};

const saveStoredArtworks = (artworks: Artwork[]): void => {
  localStorage.setItem(ARTWORKS_STORAGE_KEY, JSON.stringify(artworks));
};

// Service functions
export const getAllArtworks = async (): Promise<Artwork[]> => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  const artworks = getStoredArtworks();
  // Sort by creation date, newest first
  return artworks.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
};

export const getFeaturedArtworks = async (): Promise<Artwork[]> => {
  const allArtworks = await getAllArtworks();
  // Get up to 3 most recent artworks
  return allArtworks.slice(0, 3);
};

export const getArtworkById = async (id: string): Promise<Artwork | null> => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 300));
  
  const artworks = getStoredArtworks();
  return artworks.find((artwork) => artwork.id === id) || null;
};

export const getRelatedArtworks = async (
  collection: string,
  excludeId: string
): Promise<Artwork[]> => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 300));
  
  const artworks = getStoredArtworks();
  return artworks
    .filter(
      (artwork) => artwork.collection === collection && artwork.id !== excludeId
    )
    .slice(0, 3);
};

export const getCollections = async (): Promise<Collection[]> => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 400));
  
  const artworks = getStoredArtworks();
  
  // Extract unique collections and create collection objects
  const collections = Array.from(
    new Set(artworks.map((artwork) => artwork.collection))
  ).map((name) => {
    // Find the first artwork in this collection to use as thumbnail
    const firstArtwork = artworks.find((a) => a.collection === name);
    
    return {
      id: name.toLowerCase().replace(/\s+/g, "-"),
      name,
      thumbnail: firstArtwork?.imageUrl,
    };
  });
  
  return collections;
};

export const saveArtwork = async (artwork: Omit<Artwork, "id" | "createdAt">): Promise<Artwork> => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 600));
  
  const artworks = getStoredArtworks();
  
  // Create a full artwork with id and createdAt
  const newArtwork: Artwork = {
    ...artwork,
    id: uuidv4(),
    createdAt: new Date()
  };
  
  artworks.push(newArtwork);
  saveStoredArtworks(artworks);
  
  return newArtwork;
};

export const updateArtwork = async (artwork: Artwork): Promise<Artwork> => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 600));
  
  const artworks = getStoredArtworks();
  const index = artworks.findIndex((a) => a.id === artwork.id);
  
  if (index === -1) {
    throw new Error("Artwork not found");
  }
  
  artworks[index] = artwork;
  saveStoredArtworks(artworks);
  
  return artwork;
};

export const deleteArtwork = async (id: string): Promise<void> => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 400));
  
  const artworks = getStoredArtworks();
  const filteredArtworks = artworks.filter((a) => a.id !== id);
  saveStoredArtworks(filteredArtworks);
};
