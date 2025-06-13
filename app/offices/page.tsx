"use client"

import { useState } from "react"
import { Sun, Sunrise, Sunset, Moon, Star, BookOpen } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useLiturgical } from "@/components/liturgical-provider"

const offices = [
  {
    id: "office-lectures",
    name: "Office des lectures",
    time: "Nuit",
    icon: Star,
    description: "Prière de la nuit avec lectures patristiques",
  },
  {
    id: "laudes",
    name: "Laudes",
    time: "Matin",
    icon: Sunrise,
    description: "Prière du matin, louange de l'aurore",
  },
  {
    id: "tierce",
    name: "Tierce",
    time: "9h",
    icon: Sun,
    description: "Prière de la troisième heure",
  },
  {
    id: "sexte",
    name: "Sexte",
    time: "12h",
    icon: Sun,
    description: "Prière de la sixième heure",
  },
  {
    id: "none",
    name: "None",
    time: "15h",
    icon: Sun,
    description: "Prière de la neuvième heure",
  },
  {
    id: "vepres",
    name: "Vêpres",
    time: "Soir",
    icon: Sunset,
    description: "Prière du soir, action de grâce",
  },
  {
    id: "complies",
    name: "Complies",
    time: "Nuit",
    icon: Moon,
    description: "Prière avant le repos nocturne",
  },
]

export default function OfficesPage() {
  const { liturgicalData, currentDate } = useLiturgical()
  const [selectedOffice, setSelectedOffice] = useState<string | null>(null)

  const formatLiturgicalDate = (date: Date) => {
    return date.toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  const generateOfficeContent = (officeId: string) => {
    // Contenu simulé - dans une vraie app, ceci viendrait de l'API
    const contents = {
      "office-lectures": {
        antienne: "Venez, adorons le Seigneur, le roi des rois.",
        psaumes: [
          {
            numero: "Ps 94",
            titre: "Invitation à louer Dieu",
            antienne: "Aujourd'hui, ne fermez pas votre cœur, mais écoutez la voix du Seigneur.",
            texte:
              "Venez, crions de joie pour le Seigneur, acclamons notre Rocher, notre salut ! Allons jusqu'à lui en rendant grâce, par nos hymnes de fête acclamons-le !",
          },
        ],
        lecture: {
          reference: "1 Th 5, 1-11",
          titre: "Lecture de la première lettre de saint Paul Apôtre aux Thessaloniciens",
          texte:
            "Pour ce qui est des temps et des moments, frères, vous n'avez pas besoin qu'on vous en écrive. Vous savez très bien vous-mêmes que le jour du Seigneur vient comme un voleur dans la nuit.",
        },
        responsoire: "R/ Le Seigneur est ma lumière et mon salut. V/ De qui aurais-je crainte ?",
      },
      laudes: {
        antienne: "Que tout ce qui respire loue le Seigneur !",
        psaumes: [
          {
            numero: "Ps 62",
            titre: "L'âme qui cherche Dieu",
            antienne: "Dieu, tu es mon Dieu, je te cherche dès l'aube.",
            texte:
              "Dieu, tu es mon Dieu, je te cherche dès l'aube : mon âme a soif de toi ; après toi languit ma chair, terre aride, altérée, sans eau.",
          },
        ],
        cantique: {
          reference: "Cantique de Zacharie (Lc 1, 68-79)",
          antienne: "Béni soit le Seigneur, le Dieu d'Israël, qui visite et rachète son peuple.",
          texte:
            "Béni soit le Seigneur, le Dieu d'Israël, qui visite et rachète son peuple, et nous donne un sauveur puissant dans la maison de David, son serviteur.",
        },
        priere:
          "Dieu qui fais briller sur nous la lumière de ce jour nouveau, accorde-nous de ne commettre aucun péché aujourd'hui et de marcher toujours dans tes voies. Par Jésus, le Christ, notre Seigneur. Amen.",
      },
      vepres: {
        antienne: "Que ma prière devant toi s'élève comme un encens.",
        psaumes: [
          {
            numero: "Ps 140",
            titre: "Prière dans l'épreuve",
            antienne: "Que ma prière monte devant toi comme l'encens.",
            texte:
              "Seigneur, je t'appelle : accours vers moi ! Entends ma voix qui t'appelle ! Que ma prière devant toi s'élève comme un encens, et mes mains, comme l'offrande du soir.",
          },
        ],
        cantique: {
          reference: "Cantique de Marie (Lc 1, 46-55)",
          antienne: "Mon âme exalte le Seigneur, exulte mon esprit en Dieu, mon Sauveur !",
          texte:
            "Mon âme exalte le Seigneur, exulte mon esprit en Dieu, mon Sauveur ! Il s'est penché sur son humble servante ; désormais tous les âges me diront bienheureuse.",
        },
        priere:
          "Dieu qui nous as donné de parvenir au soir de ce jour, garde-nous sans péché durant cette nuit, et fais que nous puissions te louer au matin. Par Jésus, le Christ, notre Seigneur. Amen.",
      },
    }

    return contents[officeId as keyof typeof contents] || null
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-liturgical-primary mb-2">Offices des heures</h1>
        <p className="text-muted-foreground">La prière de l'Église pour sanctifier les heures du jour</p>
        <p className="text-sm text-liturgical-primary font-medium mt-2">{formatLiturgicalDate(currentDate)}</p>
      </div>

      {!selectedOffice ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {offices.map((office) => (
            <Card
              key={office.id}
              className="cursor-pointer hover:shadow-lg transition-shadow border-liturgical-primary/20 hover:border-liturgical-primary/40"
              onClick={() => setSelectedOffice(office.id)}
            >
              <CardHeader className="text-center">
                <div className="flex justify-center mb-2">
                  <office.icon className="h-8 w-8 text-liturgical-primary" />
                </div>
                <CardTitle className="text-liturgical-primary">{office.name}</CardTitle>
                <Badge variant="secondary" className="mx-auto">
                  {office.time}
                </Badge>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-center text-muted-foreground">{office.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-liturgical-primary">
              {offices.find((o) => o.id === selectedOffice)?.name}
            </h2>
            <Button variant="outline" onClick={() => setSelectedOffice(null)}>
              Retour aux offices
            </Button>
          </div>

          {(() => {
            const content = generateOfficeContent(selectedOffice)
            if (!content) {
              return (
                <Card>
                  <CardContent className="p-8 text-center">
                    <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Contenu de cet office en cours de développement.</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Bientôt disponible avec l'intégration complète de l'API liturgique.
                    </p>
                  </CardContent>
                </Card>
              )
            }

            return (
              <div className="space-y-6">
                {/* Antienne d'ouverture */}
                <Card className="border-liturgical-primary/30">
                  <CardHeader>
                    <CardTitle className="text-liturgical-primary">Antienne d'ouverture</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="italic text-liturgical-primary font-medium">{content.antienne}</p>
                  </CardContent>
                </Card>

                {/* Psaumes */}
                {content.psaumes?.map((psaume, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="text-lg">
                        {psaume.numero} - {psaume.titre}
                      </CardTitle>
                      <p className="text-sm italic text-muted-foreground">Ant. {psaume.antienne}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="prose prose-sm max-w-none dark:prose-invert">
                        <p>{psaume.texte}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {/* Cantique */}
                {content.cantique && (
                  <Card className="border-amber-200 dark:border-amber-800">
                    <CardHeader>
                      <CardTitle className="text-amber-800 dark:text-amber-200">{content.cantique.reference}</CardTitle>
                      <p className="text-sm italic text-amber-600 dark:text-amber-300">
                        Ant. {content.cantique.antienne}
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div className="prose prose-sm max-w-none dark:prose-invert">
                        <p>{content.cantique.texte}</p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Lecture */}
                {content.lecture && (
                  <Card className="border-blue-200 dark:border-blue-800">
                    <CardHeader>
                      <CardTitle className="text-blue-800 dark:text-blue-200">{content.lecture.titre}</CardTitle>
                      <p className="text-sm text-blue-600 dark:text-blue-300">{content.lecture.reference}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="prose prose-sm max-w-none dark:prose-invert">
                        <p>{content.lecture.texte}</p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Responsoire */}
                {content.responsoire && (
                  <Card className="bg-liturgical-primary/5">
                    <CardContent className="p-4">
                      <p className="text-liturgical-primary font-medium">{content.responsoire}</p>
                    </CardContent>
                  </Card>
                )}

                {/* Prière */}
                {content.priere && (
                  <Card className="border-liturgical-primary/30">
                    <CardHeader>
                      <CardTitle className="text-liturgical-primary">Prière</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="italic">{content.priere}</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            )
          })()}
        </div>
      )}
    </div>
  )
}
