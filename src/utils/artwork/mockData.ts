
import { Artwork } from "@/types/artwork";

// Local images uploaded by the user
export const LOCAL_IMAGE_URLS = [
  "/lovable-uploads/b25bb82f-8f40-467a-a1b0-a5be24d05385.png", // Retrato
  "/lovable-uploads/a39c4c37-616f-4ec5-973b-102908af9f14.png", // El Pintor
  "/lovable-uploads/d910daa9-517f-461b-b0b0-73ab5038a58c.png", // Sumersión
  "/lovable-uploads/b1b32a00-7e9f-4992-bab8-46ae7acfaa16.png", // Flores
  "/lovable-uploads/dfd681df-d270-4954-a4af-650684e21e9e.png", // Pintura abstracta
  "/lovable-uploads/b4f4a393-1e15-429f-a397-616abf0ab141.png", // Pinceles con pintura
];

// Safer image URLs that should work reliably
export const SAFE_IMAGE_URLS = [
  "https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1050&q=80",
  "https://images.unsplash.com/photo-1551732998-9573f695fdbb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1050&q=80",
  "https://images.unsplash.com/photo-1498330177096-689e3fb901ca?ixlib=rb-4.0.3&auto=format&fit=crop&w=1050&q=80",
];

// Dummy data for initial state - Replacing old artworks with new ones
export const MOCK_ARTWORKS: Artwork[] = [
  {
    id: "1",
    title: "Retrato",
    subtitle: "Estudio de de tonalidades blanco & negro",
    collection: "Abstracciones",
    imageUrl: LOCAL_IMAGE_URLS[1], // Flores image
    year: "2022",
    technique: "Fotografia digital",
    dimensions: "70 x 90 cm",
    description: "Una foto bien guaperrona",
    createdAt: new Date("2022-04-15"),
  },
  {
    id: "2",
    title: "El Pintor",
    subtitle: "El Pintor",
    collection: "Urbano",
    imageUrl: LOCAL_IMAGE_URLS[2], // Pintura abstracta
    year: "2023",
    technique: "Técnica mixta sobre lienzo",
    dimensions: "100 x 80 cm",
    description: "Una representación del pintor, simbolizando con la bata over-sized lo dificil que es para el artista sentir que merece el honor de usar este sustantivo.",
    createdAt: new Date("2023-02-10"),
  },
  {
    id: "3",
    title: "Sumersión",
    subtitle: "Sumersión",
    collection: "Abstracciones",
    imageUrl: LOCAL_IMAGE_URLS[3], // Pinceles con pintura
    year: "2023",
    technique: "Acrílico sobre lienzo",
    dimensions: "60 x 80 cm",
    description: "Una pieza que explora la memoria a través del color y la textura.",
    createdAt: new Date("2023-03-22"),
  }
];
