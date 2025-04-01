
import { useState } from "react";
import { motion } from "framer-motion";
import { User, FileText, Award, GraduationCap, Image } from "lucide-react";
import { cn } from "@/lib/utils";
import { artistInfo, CVItem } from "@/utils/artist/artistData";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

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
                    <CardDescription>Exposiciones, premios y formación</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {artistInfo.cvItems.map((item, index) => (
                        <div 
                          key={index}
                          className={cn(
                            "relative pl-8 pb-6 border-l",
                            index === artistInfo.cvItems.length - 1 ? "border-transparent" : "border-border"
                          )}
                        >
                          <div className="absolute left-0 top-0 -translate-x-1/2 w-6 h-6 rounded-full bg-background border-2 border-primary flex items-center justify-center">
                            {getTypeIcon(item.type)}
                          </div>
                          <div className="space-y-1">
                            <div className="font-medium text-sm inline-block bg-primary/10 text-primary px-2 py-0.5 rounded">
                              {item.year}
                            </div>
                            <h3 className="font-medium text-lg">{item.title}</h3>
                            <p className="text-muted-foreground">{item.description}</p>
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
