"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AelfOfficeData, AelfOfficeContent, AelfOfficePsaume } from "@/lib/types"

interface OfficeCarouselProps {
  data: AelfOfficeData
  onClose: () => void
}

const allOfficeSections = [
  { 
    id: "introduction", 
    name: "Introduction",
    checkContent: (office: any) => office.introduction?.contenu || office.introduction?.hymne
  },
  {
    id: "invitatoire",
    name: "Invitatoire",
    checkContent: (office: any) => office.invitatoire?.contenu
  },
  {
    id: "hymne",
    name: "Hymne",
    checkContent: (office: any) => office.hymne?.contenu
  },
  { 
    id: "psaumes", 
    name: "Psaumes",
    checkContent: (office: any) => 
      office.antienne_1?.contenu || office.psaume_1?.contenu || 
      office.antienne_2?.contenu || office.psaume_2?.contenu || 
      office.antienne_3?.contenu || office.psaume_3?.contenu
  },
  {
    id: "verset_psalmique",
    name: "Verset psalmique",
    checkContent: (office: any) => office.verset_psalmique?.contenu
  },
  {
    id: "pericope",
    name: "Péricope",
    checkContent: (office: any) => office.pericope?.contenu
  },
  {
    id: "lectures",
    name: "Lectures",
    checkContent: (office: any) => 
      office.lecture_1?.contenu || office.lecture_2?.contenu || office.lecture_3?.contenu ||
      office.lecture_patristique?.contenu || office.lecture_biblique?.contenu || office.lecture_breve?.contenu
  },
  {
    id: "repons",
    name: "Répons",
    checkContent: (office: any) => 
      office.repons_1?.contenu || office.repons_2?.contenu || office.repons_3?.contenu ||
      office.repons_bref?.contenu || office.repons_long?.contenu
  },
  {
    id: "versets",
    name: "Versets",
    checkContent: (office: any) => office.verset_1?.contenu || office.verset_2?.contenu || office.verset_3?.contenu
  },
  {
    id: "cantiques",
    name: "Cantiques",
    checkContent: (office: any) => 
      office.cantique_ancien?.contenu || office.cantique_nouveau?.contenu ||
      office.cantique_zacharie?.contenu || office.cantique_marie?.contenu ||
      office.cantique_symeon?.contenu
  },
  { 
    id: "intercessions", 
    name: "Intercessions",
    checkContent: (office: any) => office.intercessions?.contenu
  },
  {
    id: "priere",
    name: "Prière",
    checkContent: (office: any) => office.priere?.contenu
  },
  {
    id: "benediction",
    name: "Bénédiction",
    checkContent: (office: any) => office.benediction?.contenu
  },
  { 
    id: "notrepere", 
    name: "Notre Père",
    checkContent: (office: any) => office.notre_pere?.contenu
  },
  { 
    id: "oraison", 
    name: "Oraison",
    checkContent: (office: any) => office.oraison?.contenu
  },
  { 
    id: "conclusion", 
    name: "Conclusion",
    checkContent: (office: any) => office.conclusion?.contenu
  }
]

export function OfficeCarousel({ data, onClose }: OfficeCarouselProps) {
  // Filtrer les sections disponibles
  const availableSections = allOfficeSections.filter(section => section.checkContent(data.office))
  const [sectionIndex, setSectionIndex] = useState(0)

  // Vérification de la validité des données
  if (!data || !data.informations || !data.office) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-red-600">
          Données de l'office non disponibles
        </CardContent>
      </Card>
    )
  }

  // Si aucune section n'est disponible
  if (availableSections.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-red-600 mb-4">Aucun contenu disponible pour cet office</p>
          <Button variant="outline" onClick={onClose}>
            Retour aux offices
          </Button>
        </CardContent>
      </Card>
    )
  }

  const goPrev = () => setSectionIndex((i) => (i > 0 ? i - 1 : availableSections.length - 1))
  const goNext = () => setSectionIndex((i) => (i < availableSections.length - 1 ? i + 1 : 0))

  const renderOfficeContent = (content: AelfOfficeContent | undefined, title?: string) => {
    if (!content) return null
    return (
      <Card className="w-full max-w-2xl">
        <CardContent className="p-6 space-y-4">
          {title && <h3 className="font-semibold text-lg mb-2">{title}</h3>}
          {content.titre && <h4 className="font-semibold mb-2">{content.titre}</h4>}
          {content.contenu && (
            <div
              className="prose prose-sm dark:prose-invert"
              dangerouslySetInnerHTML={{ __html: content.contenu }}
            />
          )}
        </CardContent>
      </Card>
    )
  }

  const renderPsaume = (psaume: AelfOfficePsaume | undefined, index: number) => {
    if (!psaume) return null
    return (
      <Card key={index} className="w-full max-w-2xl">
        <CardContent className="p-6 space-y-4">
          {psaume.antienne_debut && (
            <div>
              <h4 className="font-semibold mb-2">Antienne</h4>
              <div
                className="prose prose-sm dark:prose-invert italic"
                dangerouslySetInnerHTML={{ __html: psaume.antienne_debut }}
              />
            </div>
          )}
          {psaume.titre && <h4 className="font-semibold mb-2">{psaume.titre}</h4>}
          {psaume.contenu && (
            <div
              className="prose prose-sm dark:prose-invert"
              dangerouslySetInnerHTML={{ __html: psaume.contenu }}
            />
          )}
        </CardContent>
      </Card>
    )
  }

  const renderContent = () => {
    const section = availableSections[sectionIndex]
    switch (section.id) {
      case "introduction":
        return data.office.introduction ? (
          <div className="space-y-4">
            {data.office.introduction.antienne && (
              <Card className="w-full max-w-2xl">
                <CardContent className="p-6">
                  <h4 className="font-semibold mb-2">Antienne</h4>
                  <div
                    className="prose prose-sm dark:prose-invert"
                    dangerouslySetInnerHTML={{ __html: data.office.introduction.antienne }}
                  />
                </CardContent>
              </Card>
            )}
            {data.office.introduction.hymne && (
              <Card className="w-full max-w-2xl">
                <CardContent className="p-6">
                  <h4 className="font-semibold mb-2">Hymne</h4>
                  <div
                    className="prose prose-sm dark:prose-invert"
                    dangerouslySetInnerHTML={{ __html: data.office.introduction.hymne }}
                  />
                </CardContent>
              </Card>
            )}
          </div>
        ) : null

      case "psaumes":
        return (
          <div className="space-y-4">
            {renderPsaume(data.office.psaume_1, 1)}
            {renderPsaume(data.office.psaume_2, 2)}
            {renderPsaume(data.office.psaume_3, 3)}
          </div>
        )

      case "cantiques":
        return (
          <div className="space-y-4">
            {renderOfficeContent(data.office.cantique_ancien, "Cantique de l'Ancien Testament")}
            {renderOfficeContent(data.office.cantique_zacharie, "Cantique de Zacharie")}
          </div>
        )

      case "lecture":
        return renderOfficeContent(data.office.lecture_breve)

      case "repons":
        return renderOfficeContent(data.office.repons_bref)

      case "intercessions":
        return renderOfficeContent(data.office.intercessions)

      case "notrepere":
        return renderOfficeContent(data.office.notre_pere)

      case "oraison":
        return renderOfficeContent(data.office.oraison)

      case "conclusion":
        return renderOfficeContent(data.office.conclusion)

      default:
        return null
    }
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6">
        <Button variant="outline" onClick={onClose}>
          Retour aux offices
        </Button>
        <h2 className="text-xl font-semibold text-center flex-1">
          {data.informations.jour_liturgique_nom} ({availableSections.length} parties disponibles)
        </h2>
      </div>

      <div className="flex items-center justify-center gap-4 mb-6">
        {availableSections.map((section, i) => (
          <Badge
            key={section.id}
            variant={i === sectionIndex ? "default" : "outline"}
            className="cursor-pointer hover:bg-accent"
            onClick={() => setSectionIndex(i)}
          >
            {section.name}
          </Badge>
        ))}
      </div>

      <div className="flex items-center justify-center gap-4 mb-6">
        <Button variant="outline" size="icon" onClick={goPrev}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={goNext}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex justify-center">
        {renderContent()}
      </div>
    </div>
  )
}