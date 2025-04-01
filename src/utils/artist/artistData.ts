
export interface ArtistInfo {
  name: string;
  shortBio: string;
  fullBio: string;
  image: string;
  cvItems: CVItem[];
  cvSections: CVSection[];
}

export interface CVItem {
  year: string;
  title: string;
  description: string;
  type: "exhibition" | "award" | "education" | "other";
}

export interface CVSection {
  title: string;
  items: CVSectionItem[];
}

export interface CVSectionItem {
  year?: string;
  content: string;
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
  ],
  cvSections: [
    {
      title: "DATOS PERSONALES",
      items: [
        { content: "Raúl Álvarez (Madrid-1982)" }
      ]
    },
    {
      title: "ESTUDIOS",
      items: [
        { content: "Bachillerato de Artes." },
        { content: "Técnico Superior en Artes Plásticas - Escuela de Artes y Oficios no12 (Madrid)." }
      ]
    },
    {
      title: "FORMACIÓN COMPLEMENTARIA",
      items: [
        { year: "2012", content: "Curso de Litografía impartido por el artista Ali Ali - Taller Mil Pedras (A Coruña)." },
        { year: "2014", content: "Curso de Serigrafía impartido por el artista Hector Francesch Estudio del artista (A Coruña)." },
        { year: "2015", content: "Curso de grabado impartido por el artista Javier Vila. Escuela Superior de Artes y Diseño Pablo Picasso (A Coruña)." }
      ]
    },
    {
      title: "ACTIVIDADES COMPLEMENTARIAS",
      items: [
        { year: "2020-2023", content: "Impartición de talleres de pintura con la plataforma WE Sustainability." },
        { year: "2015", content: "Conferencia y Master Class \"El agua en la Pintura\". Escuela de Artes y Oficios Pablo Picasso (A Coruña)." },
        { year: "2015", content: "Miembro del jurado XI Bienal de Pintura Eixo Atlántico 2015. (Vigo)." }
      ]
    },
    {
      title: "PREMIOS Y MENCIONES",
      items: [
        { year: "2022", content: "XXI Certamen Cultural Internacional Virgen de las Viñas (Tomelloso, Ciudad Real). SELECCIONADO." },
        { year: "2022", content: "XXV Premio Nacional de Pintura Enrique Lite (Tenerife). PRESELECCIONADO." },
        { year: "2019", content: "XXIII Certamen Nacional de pintura Ciudad de Antequera (Málaga). SELECCIONADO." },
        { year: "2019", content: "Certamen de pintura Francisco Carretero (Madrid). SELECCIONADO." },
        { year: "2019", content: "Convocatoria \"Arte Aparte XI\" (Jaén). SELECCIONADO." },
        { year: "2018", content: "Convocatoria abierta Estudio 22 (Logroño, La Rioja). SELECCIONADO." },
        { year: "2017", content: "II Convocatoria stART Up Mecenas2.0 SELECCIONADO ARTISTA sARTup." },
        { year: "2017", content: "XXXIII Muestra de Arte Joven de La Rioja 2017 PREMIO DEL PÚBLICO." },
        { year: "2016", content: "Jackson's Open Art Prize 2016 (Londres) FINALISTA." },
        { year: "2016", content: "IV Bienal Arte Joven Cromática 2016. Fundación Cum Laude (Ourense) SELECCIONADO." },
        { year: "2015", content: "32 Certamen de Pintura Concello de Cambre 2015 PREMIO ACCESIT." },
        { year: "2015", content: "XIV Certamen de Artes Plásticas \"Isaac Díaz Pardo\" 2015 Diputación A Coruña PREMIO ADQUISICIÓN." },
        { year: "2015", content: "XV Certamen de Pintura Reganosa PREMIO ADQUISICIÓN." },
        { year: "2015", content: "8o Concurso de Pintura Figurativas 2015 PRESELECCIONADO." },
        { year: "2015", content: "Premio Ibercaja de Pintura Joven 2015 SELECCIONADO." },
        { year: "2015", content: "XV Premio Internacional de Pintura Miquel Viladrich (LLeida) FINALISTA." },
        { year: "2015", content: "IV Premio Internacional de Artes Plásticas Caja de Extremadura- Obra Abierta SELECCIONADO." },
        { year: "2013", content: "X Bienal de pintura Eixo Atlántico (Portugal) 2013 1o PREMIO." },
        { year: "2013", content: "XIII Certamen de Artes Plásticas \"Isaac Díaz Pardo\" 2013 Diputación A Coruña SELECCIONADO." },
        { year: "2013", content: "7o Concurso de Pintura Figurativas 2013 PRESELECCIONADO." },
        { year: "2013", content: "XI Bienal Internacional de Lalín \"Pintor Laxeiro\" SELECCIONADO." },
        { year: "2012", content: "29 Certamen de Pintura Concello de Cambre SELECCIONADO." },
        { year: "2012", content: "V Certamen de Pintura Arte Nova Galega (A Coruña) 2o PREMIO." },
        { year: "2011", content: "XIV Certamen de Pintura Rápida Pintor Argüelles 2011 Concello de Culleredo 2o PREMIO." },
        { year: "2011", content: "VII Certamen de Pintura Novos Valores 2010. Concello de Brión SELECCIONADO." },
        { year: "2010", content: "V Certamen de pintura rápida Cámara Mineira de Galicia 2010 MENCIÓN DE HONOR." },
        { year: "2010", content: "XIII Certamen de Pintura Rápida Pintor Arguelles 2010. Concello de Culleredo 1o PREMIO." },
        { year: "2010", content: "XV Certamen de Arte Galeria Burela (Lugo) SELECCIONADO." },
        { year: "2010", content: "XIII Certamen de Pintura de la Casa de Castilla La Mancha SELECCIONADO." },
        { year: "2009", content: "I Concurso de Marinas 'Puerto de Ferrol': El Mar y las Artes Plásticas SELECCIONADO." },
        { year: "1999", content: "46o concurso \"Europa en la escuela\". Ministerio de educación y cultura MENCIÓN DE HONOR." },
        { year: "1998", content: "Concurso de dibujo XX Aniversario de la Constitución Española 2o PREMIO." }
      ]
    },
    {
      title: "EXPOSICIONES INDIVIDUALES",
      items: [
        { year: "2024", content: "\"Raúl Álvarez\" Galería Nova Rúa (Lugo)." },
        { year: "2023", content: "\"Pinta\" Sala de Exposiciones del Palacio Municipal de María Pita (A Coruña)." },
        { year: "2019", content: "\"Pool\". Galería Monty4Arte (A Coruña)." },
        { year: "2017", content: "\"Estado líquido\". Galería Visol (Orense)." },
        { year: "2016", content: "\"Agua 2.0\" Galería Sargadelos Monforte de Lemos (Lugo)." },
        { year: "2016", content: "\"Engullido por Poseidón\" Galería Monty4Arte (A Coruña)." },
        { year: "2015", content: "\"Dive\" Galería Metro Arte Contemporánea (Santiago de Compostela)." },
        { year: "2015", content: "\"Be water!\" Galería Sargadelos (Ferrol)." },
        { year: "2014", content: "\"Be water,my friend\" Galería Movart (Madrid)." },
        { year: "2013", content: "Centro de Arte \"AIRE\" (Santiago de Compostela)." },
        { year: "2013", content: "\"Aquamorfosis\" Galería Movart (Madrid)." },
        { year: "2013", content: "\"La llamada de Neptuno\" Galería Cervantes 6 (Oviedo)." },
        { year: "2012", content: "Centro Socio Cultural Pintor Llorens. Sada (A Coruña)." },
        { year: "2012", content: "Galería Iskoo (Lugo)." },
        { year: "2012", content: "\"Inmersión\" Club Financiero Atlántico (A Coruña)." },
        { year: "2011", content: "\"Agua\" Sala de Exposiciones Aurelio Aguirre. Club del Mar de San Amaro (A Coruña)." },
        { year: "2011", content: "\"H2O\" Casa-Museo Casares Quiroga (A Coruña)." },
        { year: "2010", content: "Centro Comarcal Do Salnés (Cambados, Pontevedra)." },
        { year: "2010", content: "Centro Comarcal de Ordes (A Coruña)." },
        { year: "2009", content: "Centro Comarcal Expolemos (Lugo)." },
        { year: "2009", content: "Galería Alenklass (A Coruña)." }
      ]
    },
    {
      title: "EXPOSICIONES COLECTIVAS",
      items: [
        { year: "2024", content: "\"Crítico\" Galería Inéditad en el museo MEAM (Barcelona)." },
        { year: "2024", content: "Pop-Up RGF Studio (Madrid)" },
        { year: "2023", content: "Pop- Up RGF Studio (Madrid)." },
        { year: "2023", content: "\"Nomen Nescio\". Galería Inéditad en Galería Paisaje doméstico. (Madrid)." },
        { year: "2023", content: "\"San Sebastianes en un mundo caótico\" Galería Inéditad en la Barcelona Academy of Art (Barcelona)." },
        { year: "2022", content: "\"LIO 2022\" Ineditad edition+Ornamante. Yoko Art Gallery (Barcelona)." },
        { year: "2022", content: "\"Cosmogonías\" RGF Studio (Madrid)." }
      ]
    },
    {
      title: "FERIAS DE ARTE",
      items: [
        { year: "2025", content: "9o Edición Hybrid Art Fair. Espacio Atlanticamente (Madrid)." },
        { year: "2022", content: "17o edición Art Madrid ́22 .Galería Inéditad (Barcelona)." },
        { year: "2019", content: "Keyhole Art Fair 2019. Galería Leúcade. (Málaga)." },
        { year: "2017", content: "We are fair! 2 -Galería Movart (Madrid)." },
        { year: "2014", content: "Room Art Fair Madrid - Galería METRO (Santiago de Compostela)." },
        { year: "2014", content: "XIII Feira das Artes Plásticas de ARGA (A Coruña)." }
      ]
    },
    {
      title: "OBRA EN GALERÍAS",
      items: [
        { content: "Galería Monty4Arte (A Coruña)." },
        { content: "Galería Ineditad (Barcelona)." },
        { content: "Galería Nova Rúa (Lugo)." },
        { content: "Galería de Arte Xerión (A Coruña)." },
        { content: "Galería Souto (Orense)." },
        { content: "Galería Dupla (Santiago de Compostela)." }
      ]
    },
    {
      title: "OBRA EN COLECCIONES",
      items: [
        { content: "Colección de Arte Diputación de A Coruña. (A Coruña)." },
        { content: "Colección de Arte Reganosa. (A Coruña)." },
        { content: "Colección de Arte Galería Sargadelos. (A Coruña)." },
        { content: "Colección de Arte Eixo Atlántico (Galicia y Portugal)." },
        { content: "TANGO Agencia de Publicidad y Marketing (Madrid)." },
        { content: "Concello de Sada (A Coruña)." },
        { content: "Colección de Arte Ámbito Cultural El Corte Inglés (A Coruña)." },
        { content: "Club del Mar de San Amaro (A Coruña)." },
        { content: "Club Financiero Atlántico (A Coruña)." },
        { content: "Pinacoteca Caja Rural de Toledo (Toledo)." },
        { content: "Concello de Culleredo (A Coruña)." },
        { content: "Colecciones Particulares en España, E.E.U.U, Turquía, Suiza, Italia, Inglaterra, Portugal, Nueva Zelanda y Bruselas." }
      ]
    }
  ]
};
