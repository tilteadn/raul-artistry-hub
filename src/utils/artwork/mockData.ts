
import { Artwork } from "@/types/artwork";

// Local images uploaded by the user
export const LOCAL_IMAGE_URLS = [
  "/lovable-uploads/b25bb82f-8f40-467a-a1b0-a5be24d05385.png", // Retrato
  "/lovable-uploads/a39c4c37-616f-4ec5-973b-102908af9f14.png", // El Pintor
  "/lovable-uploads/d910daa9-517f-461b-b0b0-73ab5038a58c.png", // Sumersión
];

// Safer image URLs that should work reliably
export const SAFE_IMAGE_URLS = [
  "https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1050&q=80",
  "https://images.unsplash.com/photo-1551732998-9573f695fdbb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1050&q=80",
  "https://images.unsplash.com/photo-1498330177096-689e3fb901ca?ixlib=rb-4.0.3&auto=format&fit=crop&w=1050&q=80",
];

// Dummy data for initial state
export const MOCK_ARTWORKS: Artwork[] = [
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
  }
];
