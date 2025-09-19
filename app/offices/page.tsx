"use client"

import { useState, useEffect } from "react"
import { Sun, Sunrise, Sunset, Moon, Star, BookOpen } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useLiturgical } from "@/components/liturgical-provider"
import { OfficeCarousel } from "@/components/office-carousel"
import type { AelfOfficeData } from "@/lib/api"

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
  const [officeData, setOfficeData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formattedDate, setFormattedDate] = useState("")

  useEffect(() => {
    // Formatage de la date côté client uniquement
    setFormattedDate(currentDate.toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }))
  }, [currentDate])


  // Récupération dynamique de l'office sélectionné
  useEffect(() => {
    if (!selectedOffice) {
      setOfficeData(null)
      setError(null)
      return
    }

    const fetchOffice = async () => {
      setLoading(true)
      setError(null)

      try {
        // Convertir l'ID de l'office pour l'API AELF
        let officeType = selectedOffice
        if (selectedOffice === "office-lectures") {
          officeType = "lectures"
        }
        
        console.log(`🔄 Chargement de l'office ${officeType}`)
        
        const res = await fetch(`/api/offices?office=${officeType}`)
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}))
          throw new Error(errorData.error || `Erreur HTTP ${res.status} : ${res.statusText}`)
        }

        const data = await res.json()
        console.log(`📥 Données reçues pour ${officeType}:`, data)
        
        // Vérification de la validité des données
        if (!data) {
          throw new Error("Données vides reçues de l'API")
        }
        
        if (!data.office) {
          throw new Error("L'objet office est manquant dans les données")
        }
        
        // Vérification et normalisation des informations liturgiques
        if (!data.informations?.jour_liturgique_nom) {
          console.warn("⚠️ Informations liturgiques manquantes, utilisation des valeurs par défaut")
          data.informations = {
            ...data.informations || {},
            jour_liturgique_nom: "Office du jour"
          }
        }
        
        // Vérification détaillée du contenu de l'office
        const officeStructure = {
          introduction: "Introduction",
          psaume_1: "Premier psaume",
          psaume_2: "Deuxième psaume",
          psaume_3: "Troisième psaume",
          cantique_ancien: "Cantique de l'Ancien Testament",
          cantique_zacharie: "Cantique de Zacharie",
          lecture_breve: "Lecture brève",
          repons_bref: "Répons",
          intercessions: "Intercessions",
          notre_pere: "Notre Père",
          oraison: "Oraison",
          conclusion: "Conclusion",
          antienne_zacharie: "Antienne de Zacharie"
        };

        console.log("🔍 Analyse du contenu de l'office :");
        const availableParts: string[] = [];
        const missingParts: string[] = [];

        Object.entries(officeStructure).forEach(([key, label]) => {
          const content = data.office[key];
          if (content && (content.contenu || content.hymne || content.antienne)) {
            availableParts.push(label);
            console.log(`✅ ${label} : présent`);
          } else {
            missingParts.push(label);
            console.log(`❌ ${label} : manquant`);
          }
        });

        if (availableParts.length === 0) {
          throw new Error("L'office ne contient aucune partie")
        }

        if (missingParts.length > 0) {
          console.warn(`⚠️ Parties manquantes : ${missingParts.join(", ")}`);
        }

        console.log(`✅ Office valide avec ${availableParts.length}/${Object.keys(officeStructure).length} parties disponibles`);
        setOfficeData(data)
      } catch (e: any) {
        setError(e.message || "Erreur inconnue")
        setOfficeData(null)
      } finally {
        setLoading(false)
      }
    }
    fetchOffice()
  }, [selectedOffice, currentDate])

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-liturgical-primary mb-2">Offices des heures</h1>
        <p className="text-muted-foreground">La prière de l'Église pour sanctifier les heures du jour</p>
        <p className="text-sm text-liturgical-primary font-medium mt-2">{formattedDate}</p>
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

          {/* Affichage dynamique de l'office */}
          {loading && (
            <Card><CardContent className="p-8 text-center">Chargement...</CardContent></Card>
          )}
          {error && (
            <Card><CardContent className="p-8 text-center text-red-600">{error}</CardContent></Card>
          )}
          {!loading && !error && officeData && (
            <>
              <Card className="mb-4">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Office {officeData.informations.jour_liturgique_nom}</span>
                    <Badge variant="outline" className="ml-2">
                      {Object.keys(officeData.office).filter(key => 
                        officeData.office[key] && 
                        (officeData.office[key].contenu || officeData.office[key].hymne || officeData.office[key].antienne)
                      ).length} parties disponibles
                    </Badge>
                  </div>
                </CardContent>
              </Card>
              <OfficeCarousel data={officeData as AelfOfficeData} onClose={() => setSelectedOffice(null)} />
            </>
          )}
        </div>
      )}
    </div>
  )
}
