import { Artwork } from "@/types/artwork";

// Asset paths for uploaded images in the assets folder
export const ASSETS_IMAGE_URLS = [
  "/assets/e9024d21-2e3c-4fea-833b-01428e743d2e.png", // Portrait in black and white
  "/assets/24922b89-7916-405a-b1bb-9e471c33d047.png", // Boy with paint stained coat
  "/assets/6d956258-6370-4e7b-a09f-5c5be890c12d.png", // Woman underwater
];

// Local images uploaded by the user (keeping for compatibility)
export const LOCAL_IMAGE_URLS = [
  "/lovable-uploads/b25bb82f-8f40-467a-a1b0-a5be24d05385.png", // Retrato
  "/lovable-uploads/a39c4c37-616f-4ec5-973b-102908af9f14.png", // El Pintor
  "/lovable-uploads/d910daa9-517f-461b-b0b0-73ab5038a58c.png", // Sumersión
  "/lovable-uploads/b1b32a00-7e9f-4992-bab8-46ae7acfaa16.png", // Flores
  "/lovable-uploads/dfd681df-d270-4954-a4af-650684e21e9e.png", // Pintura abstracta
  "/lovable-uploads/b4f4a393-1e15-429f-a397-616abf0ab141.png", // Pinceles con pintura
];

// Safer image URLs that should work reliably (keeping for backup)
export const SAFE_IMAGE_URLS = [
  "https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1050&q=80",
  "https://images.unsplash.com/photo-1551732998-9573f695fdbb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1050&q=80",
  "https://images.unsplash.com/photo-1498330177096-689e3fb901ca?ixlib=rb-4.0.3&auto=format&fit=crop&w=1050&q=80",
];

// Updated mock artworks with the new asset images
export const MOCK_ARTWORKS: Artwork[] = [
  {
    id: "1",
    title: "Retrato en Claroscuro",
    subtitle: "Estudio de luz y sombra",
    collection: "Retratos",
    imageUrl: SAFE_IMAGE_URLS[0], // Using safer image URLs until assets are properly set up
    year: "2023",
    technique: "Fotografía digital",
    dimensions: "60 x 80 cm",
    description: "Un retrato en blanco y negro que explora la dualidad entre luz y sombra, revelando la profundidad y carácter a través del contraste.",
    createdAt: new Date("2023-05-15"),
  },
  {
    id: "2",
    title: "El Joven Artista",
    subtitle: "Inocencia y creatividad",
    collection: "Figurativo",
    imageUrl: SAFE_IMAGE_URLS[1], // Using safer image URLs until assets are properly set up
    year: "2022",
    technique: "Óleo sobre lienzo",
    dimensions: "90 x 120 cm",
    description: "Retrato de un joven artista con su abrigo manchado de pintura, simbolizando la pureza de la expresión creativa sin restricciones.",
    createdAt: new Date("2022-11-10"),
  },
  {
    id: "3",
    title: "Sumersión",
    subtitle: "Entre dos mundos",
    collection: "Figurativo",
    imageUrl: SAFE_IMAGE_URLS[2], // Using safer image URLs until assets are properly set up
    year: "2023",
    technique: "Acrílico sobre lienzo",
    dimensions: "100 x 150 cm",
    description: "Una exploración de la dualidad entre consciencia e inconsciencia, representada por una figura sumergida entre dos realidades.",
    createdAt: new Date("2023-03-22"),
  }
];
