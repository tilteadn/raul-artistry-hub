
import { Helmet } from "react-helmet-async";

interface MetaTagsProps {
  title?: string;
  description?: string;
  keywords?: string;
  imageUrl?: string;
  canonicalUrl?: string;
  type?: "website" | "article" | "profile";
}

const MetaTags = ({
  title = "Raúl Álvarez | Artista Plástico y Tatuador en A Coruña",
  description = "Obra artística de Raúl Álvarez, artista plástico y tatuador en A Coruña especializado en pintura figurativa contemporánea y tatuaje artístico.",
  keywords = "arte, pintura, tatuaje, A Coruña, Galicia, artista plástico, arte contemporáneo",
  imageUrl = "/lovable-uploads/raulRetrato.jpg",
  canonicalUrl = "",
  type = "website",
}: MetaTagsProps) => {
  // Use window.location if no canonicalUrl is provided
  const fullCanonicalUrl = canonicalUrl || (typeof window !== 'undefined' ? window.location.href : "https://raulalvarezpintura.es");

  // Get the full URL for the image
  const fullImageUrl = imageUrl.startsWith("http") 
    ? imageUrl 
    : `https://raulalvarezpintura.es${imageUrl}`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={fullCanonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullCanonicalUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImageUrl} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullCanonicalUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />
    </Helmet>
  );
};

export default MetaTags;
