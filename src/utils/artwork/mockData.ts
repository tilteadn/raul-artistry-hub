import { Artwork } from "@/types/artwork";

// Asset paths for uploaded images in the assets folder
export const ASSETS_IMAGE_URLS = [
  "/lovable-uploads/raulRetrato.jpg", // Portrait in black and white
  "/lovable-uploads/elpintor.webp", // Boy with paint stained coat
  "/lovable-uploads/Sumerison.jpg", // Woman underwater
];


// Updated mock artworks with the new asset images
export const MOCK_ARTWORKS: Artwork[] = [
  {
    id: "1",
    title: "Retrato en Claroscuro",
    subtitle: "Estudio de luz y sombra",
    collection: "Retratos",
    imageUrl: ASSETS_IMAGE_URLS[0], // Using safer image URLs until assets are properly set up
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
    imageUrl: ASSETS_IMAGE_URLS[1], // Using safer image URLs until assets are properly set up
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
    imageUrl: ASSETS_IMAGE_URLS[2], // Using safer image URLs until assets are properly set up
    year: "2023",
    technique: "Acrílico sobre lienzo",
    dimensions: "100 x 150 cm",
    description: "Una exploración de la dualidad entre consciencia e inconsciencia, representada por una figura sumergida entre dos realidades.",
    createdAt: new Date("2023-03-22"),
  }
];
