import { Artwork, Collection } from "@/types/artwork";
import { v4 as uuidv4 } from 'uuid';

// Safer image URLs that should work reliably
const SAFE_IMAGE_URLS = [
  "https://images.unsplash.com/photo-1549887534-1541e9326642?ixlib=rb-4.0.3&auto=format&fit=crop&w=1050&q=80",
  "https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1050&q=80",
  "https://images.unsplash.com/photo-1551732998-9573f695fdbb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1050&q=80",
  "https://images.unsplash.com/photo-1541701494587-cb58502866ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1050&q=80",
  "https://images.unsplash.com/photo-1498330177096-689e3fb901ca?ixlib=rb-4.0.3&auto=format&fit=crop&w=1050&q=80",
  "https://images.unsplash.com/photo-1520209268518-aec60b8bb5ca?ixlib=rb-4.0.3&auto=format&fit=crop&w=1050&q=80",
];

// Dummy data for initial state
const MOCK_ARTWORKS: Artwork[] = [
  {
    id: "1",
    title: "Amanecer en el Bosque",
    subtitle: "Juego de luces entre árboles",
    collection: "Naturaleza",
    imageUrl: SAFE_IMAGE_URLS[0],
    year: "2022",
    technique: "Óleo sobre lienzo",
    dimensions: "100 x 80 cm",
    description: "Una exploración de la luz matutina filtrándose entre los árboles de un bosque, capturando ese momento mágico cuando el día comienza y la naturaleza despierta.",
    createdAt: new Date("2022-03-15"),
  },
  {
    id: "2",
    title: "Abstracción No. 7",
    subtitle: "Estudio de formas y color",
    collection: "Abstracciones",
    imageUrl: SAFE_IMAGE_URLS[1],
    year: "2021",
    technique: "Acrílico sobre lienzo",
    dimensions: "120 x 100 cm",
    description: "Una pieza que explora la relación entre la forma y el color, inspirada en el movimiento expresionista abstracto, buscando evocar emociones a través de la composición visual.",
    createdAt: new Date("2021-11-08"),
  },
  {
    id: "3",
    title: "Reflejos Urbanos",
    subtitle: "La ciudad tras la lluvia",
    collection: "Urbano",
    imageUrl: SAFE_IMAGE_URLS[2],
    year: "2023",
    technique: "Óleo sobre lienzo",
    dimensions: "90 x 70 cm",
    description: "Una representación de la ciudad moderna después de la lluvia, capturando los reflejos en las superficies mojadas y la atmósfera particular que se crea cuando las luces urbanas se reflejan en las calles húmedas.",
    createdAt: new Date("2023-01-22"),
  },
  {
    id: "4",
    title: "Serenidad Marina",
    subtitle: "Estudio del horizonte",
    collection: "Naturaleza",
    imageUrl: SAFE_IMAGE_URLS[3],
    year: "2022",
    technique: "Acrílico sobre lienzo",
    dimensions: "80 x 60 cm",
    description: "Un estudio contemplativo del horizonte marino, donde el cielo y el mar se encuentran en una línea difusa, creando una sensación de calma y vastedad.",
    createdAt: new Date("2022-07-04"),
  },
  {
    id: "5",
    title: "Fragmentos de Memoria",
    subtitle: "Recuerdos abstractos",
    collection: "Abstracciones",
    imageUrl: SAFE_IMAGE_URLS[4],
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
    imageUrl: SAFE_IMAGE_URLS[5],
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
