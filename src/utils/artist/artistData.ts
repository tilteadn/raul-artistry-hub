
export interface ArtistInfo {
  name: string;
  shortBio: string;
  fullBio: string;
  image: string;
  cvItems: CVItem[];
}

export interface CVItem {
  year: string;
  title: string;
  description: string;
  type: "exhibition" | "award" | "education" | "other";
}

export const artistInfo: ArtistInfo = {
  name: "Raúl Álvarez",
  shortBio: "Artista plástico especializado en pintura figurativa contemporánea y tatuaje artístico",
  fullBio: "Nacido en Madrid en 1985, Raúl Álvarez es un artista multidisciplinar que combina la pintura tradicional con técnicas contemporáneas. Su obra explora la condición humana a través de retratos expresivos y escenas cotidianas transformadas por su particular visión estética.\n\nFormado en la Escuela de Bellas Artes de Madrid y posteriormente especializado en técnicas clásicas en Florencia, su trabajo ha evolucionado hacia un estilo personal que mezcla el realismo con elementos simbólicos y atmosféricos.\n\nActualmente divide su tiempo entre la creación de obra pictórica y su estudio de tatuaje artístico, donde traslada su sensibilidad estética al arte corporal, siempre manteniendo su inconfundible estilo personal.",
  image: "/lovable-uploads/raulRetrato.jpg",
  cvItems: [
    {
      year: "2023",
      title: "Exposición individual 'Fragmentos de memoria'",
      description: "Galería Artespacio, Madrid",
      type: "exhibition"
    },
    {
      year: "2022",
      title: "Participación en Feria de Arte Contemporáneo",
      description: "ARCO Madrid, stand galería Nova",
      type: "exhibition"
    },
    {
      year: "2021",
      title: "Premio Nacional de Pintura Ciudad de Valencia",
      description: "Finalista con la obra 'Tiempo suspendido'",
      type: "award"
    },
    {
      year: "2018-2020",
      title: "Residencia artística en Berlín",
      description: "Programa internacional de intercambio cultural",
      type: "other"
    },
    {
      year: "2017",
      title: "Exposición colectiva 'Nuevos caminos'",
      description: "Museo de Arte Contemporáneo, Barcelona",
      type: "exhibition"
    },
    {
      year: "2015",
      title: "Máster en Técnicas Pictóricas Clásicas",
      description: "Academia de Bellas Artes de Florencia, Italia",
      type: "education"
    },
    {
      year: "2010",
      title: "Licenciatura en Bellas Artes",
      description: "Universidad Complutense de Madrid",
      type: "education"
    }
  ]
};
