
import { useState } from "react";
import { motion } from "framer-motion";
import { User, FileText, Award, GraduationCap, Image, MapPin, Book, Briefcase, Palette, Trophy, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { artistInfo, CVItem } from "@/utils/artist/artistData";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const AboutMe = () => {
  const [activeTab, setActiveTab] = useState<string>("bio");

  // Function to get the appropriate icon for CV item type
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "exhibition":
        return <Image className="h-5 w-5 text-primary" />;
      case "award":
        return <Award className="h-5 w-5 text-yellow-500" />;
      case "education":
        return <GraduationCap className="h-5 w-5 text-blue-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  // Function to get section icon
  const getSectionIcon = (section: string) => {
    switch (section) {
      case "ESTUDIOS":
      case "FORMACIÓN COMPLEMENTARIA":
        return <GraduationCap className="h-5 w-5" />;
      case "PREMIOS Y MENCIONES":
        return <Trophy className="h-5 w-5" />;
      case "EXPOSICIONES INDIVIDUALES":
      case "EXPOSICIONES COLECTIVAS":
        return <Palette className="h-5 w-5" />;
      case "ACTIVIDADES COMPLEMENTARIAS":
        return <Briefcase className="h-5 w-5" />;
      case "FERIAS DE ARTE":
        return <Globe className="h-5 w-5" />;
      case "OBRA EN GALERÍAS":
      case "OBRA EN COLECCIONES":
      case "OBRA EN PUBLICACIONES":
        return <Book className="h-5 w-5" />;
      case "DATOS PERSONALES":
        return <User className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.6 } }
  };

  // New biography text
  const biographyText = `Pintar y dibujar es mi VIDA. Una ley innata.

Algo grabado a fuego en mi ADN que me atrapa día tras día. Algo de lo
que no puedo ni quiero huir.

Mi oficio de pintor es mi válvula de escape, me absorbe y me da el aire
que necesito para expresar mis sentimientos e intentar transmitir como
soy, lo que siento y me apasiona.

Todo mi trabajo hasta ahora ha girado en torno al agua, elemento puro y
necesario para la supervivencia del ser humano y otras especies, elemento
sanador y purificador del cuerpo y el alma. A mi manera de ver el agua
tiene varias similitudes con las distintas formas de ser o de comportarnos
que tenemos los seres humanos; podemos ser amables, agradables,
divertidos, mansos como al agua en calma o destructivos, dañinos y
temerarios como el agua desbocada sin control o el mar enfurecido.

Me interesa la creación de mis obras con el agua como elemento pictórico
por su dificultad a la hora de plasmarla de manera creíble y el gran
abanico de posibilidades de representación que abarca. Crear ese binomio
junto con la figura humana la cual representa también ese aspecto
cercano, misterioso, complejo, tanto en forma como en contenido y con el
que todos nos identificamos me parece muy interesante de cara al
espectador. Cada una de mis series habla de distintas cosas u estados de
ánimo de las personas, aspectos personales o psicológicos con los que
cualquiera nos podemos sentir identificados pero siempre con un
elemento en común que aparece de una manera más o menos directa o
protagonista, el agua.

El Realismo Figurativo es el lenguaje pictórico con el que como pintor me
siento más cómodo e identificado para desarrollar mi trabajo, más yo.
Trato de evolucionar tanto en mi obra como técnicamente para encontrar
mi camino, me dejo fluir.

Be water, my friend.`;

  return (
    <div className="container mx-auto px-6 py-12">
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="max-w-5xl mx-auto"
      >
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-serif mb-4">Sobre mí</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {artistInfo.shortBio}
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="aspect-square rounded-md overflow-hidden mb-6 shadow-md relative">
                <img 
                  src={artistInfo.image} 
                  alt={artistInfo.name}
                  className="object-cover w-full h-full"
                  draggable="false"
                  onContextMenu={(e) => e.preventDefault()}
                />
                {/* Protective overlay */}
                <div className="absolute inset-0 bg-transparent pointer-events-none"></div>
              </div>
              <h2 className="text-2xl font-serif mb-2">{artistInfo.name}</h2>
              <p className="text-muted-foreground">{artistInfo.shortBio}</p>
            </div>
          </div>

          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="mb-6 grid w-full grid-cols-2">
                <TabsTrigger value="bio" className="text-lg">
                  <User className="mr-2 h-4 w-4" />
                  Biografía
                </TabsTrigger>
                <TabsTrigger value="cv" className="text-lg">
                  <FileText className="mr-2 h-4 w-4" />
                  Curriculum
                </TabsTrigger>
              </TabsList>

              <TabsContent value="bio" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Biografía</CardTitle>
                    <CardDescription>Trayectoria artística y personal</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="prose max-w-none">
                      {biographyText.split('\n\n').map((paragraph, index) => (
                        <p key={index} className="mb-4">{paragraph}</p>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="cv" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Curriculum Vitae</CardTitle>
                    <CardDescription>Formación, premios, exposiciones y trayectoria</CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="divide-y">
                      {artistInfo.cvSections.map((section, sectionIndex) => (
                        <div key={sectionIndex} className="py-6 px-6">
                          <div className="flex items-center gap-2 mb-4">
                            {getSectionIcon(section.title)}
                            <h3 className="text-lg font-medium">{section.title}</h3>
                          </div>
                          
                          <div className="ml-2 space-y-3">
                            {section.items.map((item, itemIndex) => (
                              <div key={itemIndex} className="flex gap-2">
                                {item.year && (
                                  <span className="font-medium text-sm min-w-20">{item.year}</span>
                                )}
                                <p className="text-muted-foreground">{item.content}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AboutMe;
