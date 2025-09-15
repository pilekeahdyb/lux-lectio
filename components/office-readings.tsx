"use client"

import { useState, useEffect } from "react"
import { AelfOffice, AelfLecture } from "@/lib/types/aelf"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

interface OfficeReadingsProps {
  office: AelfOffice
}

export function OfficeReadings({ office }: OfficeReadingsProps) {
  const [activeSection, setActiveSection] = useState<string>("")

  // Déterminer le type d'office et ordonner les sections selon la Liturgie des Heures
  const normalizeOfficeName = (s: string) =>
    s
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .toLowerCase()
      .trim()
  const officeType = normalizeOfficeName(office?.nom || "")

  const orderMap: Record<string, string[]> = {
    "office des lectures": [
      "introduction", "hymne", "psaume_invitatoire", "psaume_1", "psaume_2", "psaume_3", "verset",
      "lecture_1", "repons_1", "lecture_2", "repons_2", "te_deum", "conclusion"
    ],
    "laudes": [
      "introduction", "psaume_invitatoire",
      "hymne",
      "psaume_1", "cantique_ancien", "psaume_3",
      "lecture_breve", "repons_bref",
      "cantique_zacharie",
      "intercession", "intercessions", "notre_pere", "conclusion"
    ],
    "tierce": [
      "introduction", "hymne", "psaume_1", "psaume_2", "psaume_3", "lecture_breve", "verset", "conclusion"
    ],
    "sexte": [
      "introduction", "hymne", "psaume_1", "psaume_2", "psaume_3", "lecture_breve", "verset", "conclusion"
    ],
    "none": [
      "introduction", "hymne", "psaume_1", "psaume_2", "psaume_3", "lecture_breve", "verset", "conclusion"
    ],
    "vepres": [
      "introduction", "hymne", "psaume_1", "psaume_2", "cantique_nouveau", "lecture_breve", "repons_bref",
      "cantique_marie", "intercession", "intercessions", "notre_pere", "conclusion"
    ],
    "complies": [
      "introduction", "examen", "hymne", "psaume_1", "psaume_2", "lecture_breve", "cantique_simeon",
      "conclusion", "antienne_mariale", "benediction"
    ],
  }

  const labelMap: Record<string, string> = {
    introduction: "Introduction",
    hymne: "Hymne",
    psaume_invitatoire: "Psaume invitatoire",
    psaume_1: "Psaume 1",
    psaume_2: "Psaume 2",
    psaume_3: "Psaume 3",
    cantique_ancien: "Cantique de l'Ancien Testament",
    cantique_nouveau: "Cantique du Nouveau Testament",
    cantique_zacharie: "Cantique de Zacharie (Benedictus)",
    cantique_marie: "Cantique de Marie (Magnificat)",
    cantique_simeon: "Cantique de Siméon (Nunc Dimittis)",
    lecture_breve: "Lecture brève",
    verset: "Verset",
    lecture_1: "Première lecture",
    lecture_2: "Seconde lecture",
    repons_bref: "Répons",
    repons_1: "Premier répons",
    repons_2: "Second répons",
    te_deum: "Te Deum",
    intercession: "Intercession",
    intercessions: "Intercession",
    notre_pere: "Notre Père",
    conclusion: "Oraison",
    antienne_mariale: "Antienne mariale",
    benediction: "Bénédiction finale",
  }

  const orderedKeys = orderMap[officeType] || []

  const entries = office?.office ? Object.entries(office.office)
    .filter(([k, v]) => v && !k.startsWith('antienne_')) : []
  const seen = new Set<string>()
  const orderedSections: { id: string; label: string; content: any }[] = []

  // Ajouter dans l'ordre officiel
  for (const key of orderedKeys) {
    const entry = entries.find(([k]) => k === key)
    if (entry) {
      seen.add(key)
      orderedSections.push({ id: key, label: labelMap[key] || key.replace(/_/g, ' '), content: entry[1] })
    }
  }
  // Pour les offices connus (orderedKeys non vide), on n'ajoute PAS les sections non listées
  // Pour un office inconnu (orderedKeys vide), on affiche toutes les sections existantes
  if (orderedKeys.length === 0) {
    for (const [k, v] of entries) {
      if (!seen.has(k)) {
        orderedSections.push({ id: k, label: labelMap[k] || k.replace(/_/g, ' '), content: v })
      }
    }
  }

  // Construire des labels fidèles à l'API (références, titres)
  const getSectionLabel = (id: string, content: any): string => {
    const ref: string | undefined = content?.ref || content?.reference
    const titre: string | undefined = content?.titre
    // Psaumes
    if (id === 'psaume_invitatoire') {
      // Psaume invitatoire spécifique
      if (ref) return `Psaume invitatoire : (${ref})`
      return 'Psaume invitatoire'
    }
    if (id.startsWith('psaume')) {
      // Always show 'Psaume <reference>' supporting patterns like '73-I', '118-13'
      const psRefPattern = /^\d+(?:[\-–][IVXLC0-9]+)?/i
      const refMatch = ref && psRefPattern.test(ref) ? ref.match(psRefPattern)![0] : undefined
      const titreMatch = titre && psRefPattern.test(titre) ? titre.match(psRefPattern)![0] : undefined
      const psRef = refMatch || titreMatch
      if (psRef) return `Psaume ${psRef}`
      if (titre && /psaume/i.test(titre)) return titre
      if (ref) return `Psaume : ${ref}`
      return labelMap[id] || 'Psaume'
    }
    // Cantiques
    if (id.startsWith('cantique')) {
      // Afficher simplement "Cantique ..." basé sur le titre (sans référence)
      if (titre) {
        // S'assurer que le label commence par "Cantique"
        return /cantique/i.test(titre) ? titre : `Cantique — ${titre}`
      }
      return labelMap[id] || 'Cantique'
    }
    // Lectures
    if (id.startsWith('lecture')) {
      // Toujours afficher "Lecture" (sans référence)
      return 'Lecture'
    }
    // Réponses / Versets
    if (id.startsWith('repons') || id === 'verset') {
      return labelMap[id] || id.replace(/_/g, ' ')
    }
    // Antiennes dédiées: pas de bouton, elles sont rendues dans la section correspondante
    // Introduction / Notre Père / Conclusion
    if (id === 'introduction' || id === 'notre_pere' || id === 'conclusion') {
      return labelMap[id]
    }
    // Par défaut
    return labelMap[id] || (titre ? titre : (ref || id.replace(/_/g, ' ')))
  }

  const availableSections = orderedSections.map(s => ({ id: s.id, label: getSectionLabel(s.id, s.content), emoji: "", content: s.content }))

  // Rendu fidèle: si le contenu contient des balises HTML, on l'injecte tel quel.
  // Sinon, on préserve les retours à la ligne pour respecter la mise en forme de l'API.
  const renderHtml = (value?: string) => {
    if (!value) return null
    const hasHtml = /<[^>]+>/.test(value)
    return hasHtml ? (
      <div className="max-w-none" dangerouslySetInnerHTML={{ __html: value }} />
    ) : (
      <div className="whitespace-pre-line max-w-none">{value}</div>
    )
  }

  useEffect(() => {
    if (availableSections.length > 0) {
      setActiveSection(availableSections[0].id);
    }
  }, [office]);

  if (!office || !office.office || availableSections.length === 0) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Office non disponible</AlertTitle>
        <AlertDescription>
          Le contenu de cet office n'est pas disponible pour le moment.
        </AlertDescription>
      </Alert>
    )
  }

  const renderLecture = (lecture: AelfLecture) => (
    <div className="space-y-4">
      {lecture.titre && lecture.titre !== office.nom && (
        <h3 className="text-xl font-semibold text-liturgical-primary">
          {lecture.titre}
        </h3>
      )}
      {lecture.ref && (
        <p className="text-sm text-muted-foreground font-medium">{lecture.ref}</p>
      )}
      {lecture.intro && (
        <div className="text-sm italic text-muted-foreground border-l-2 border-liturgical-primary/20 pl-4">
          {renderHtml(lecture.intro)}
        </div>
      )}
      {/* Antienne au début si fournie explicitement (antienne_debut) ou si une seule antienne est fournie */}
      {((lecture as any).antienne_debut || ((lecture as any).antienne && !(lecture as any).antienne_fin)) && (
        <div className="mt-4">
          <div className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Antienne</div>
          <div className="text-sm text-liturgical-secondary font-medium border-l-2 border-liturgical-secondary pl-4">
            {renderHtml(((lecture as any).antienne_debut || (lecture as any).antienne) as string)}
          </div>
        </div>
      )}
      {renderHtml(lecture.contenu)}
      {/* Antienne à la fin si fournie explicitement (antienne_fin) ou si une seule antienne (nous l'avons déjà rendue en début, donc ne pas dupliquer) */}
      {((lecture as any).antienne_fin) && (
        <div className="mt-4">
          <div className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Antienne</div>
          <div className="text-sm text-liturgical-secondary font-medium border-l-2 border-liturgical-secondary pl-4">
            {renderHtml(((lecture as any).antienne_fin) as string)}
          </div>
        </div>
      )}
      {lecture.repons && (
        <div className="text-sm italic text-muted-foreground mt-4">
          {renderHtml(lecture.repons)}
        </div>
      )}
    </div>
  );

  const renderNotrePere = () => {
    const notrePereHtml = `
      <p>Notre Père, qui es aux cieux,</p>
      <p>que ton nom soit sanctifié,</p>
      <p>que ton règne vienne,</p>
      <p>que ta volonté soit faite sur la terre comme au ciel.</p>
      <p>Donne-nous aujourd'hui notre pain de ce jour.</p>
      <p>Pardonne-nous nos offenses,</p>
      <p>comme nous pardonnons aussi à ceux qui nous ont offensés.</p>
      <p>Et ne nous laisse pas entrer en tentation,</p>
      <p>mais délivre-nous du mal.</p>
    `
    return (
      <div className="space-y-2">
        <div className="max-w-none" dangerouslySetInnerHTML={{ __html: notrePereHtml }} />
      </div>
    )
  }

  const renderContent = (content: AelfLecture | AelfLecture[] | undefined) => {
    if (!content) return null;
    return Array.isArray(content) ? (
      <div className="space-y-8">
        {content.map((item, index) => (
          <div key={index} className="border-t first:border-t-0 pt-4 first:pt-0">
            {renderLecture(item)}
          </div>
        ))}
      </div>
    ) : renderLecture(content);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-liturgical-primary">
          {office.nom}
        </h2>
      </div>

      <div className="w-full overflow-x-auto">
        <div className="flex gap-2 pb-2 min-w-max">
          {availableSections.map(section => (
            <Button
              key={section.id}
              variant={activeSection === section.id ? "default" : "outline"}
              className={`flex-shrink-0 whitespace-nowrap ${
                activeSection === section.id
                  ? "bg-liturgical-primary hover:bg-liturgical-primary/90"
                  : "hover:bg-liturgical-primary/10"
              }`}
              onClick={() => setActiveSection(section.id)}
            >
              <span className="mr-2">{section.emoji}</span>
              {section.label}
            </Button>
          ))}
        </div>
      </div>

      <Card className="p-6 animate-slide-in">
        {(() => {
          const current = availableSections.find(s => s.id === activeSection)
          if (!current) return null
          if (current.id === 'notre_pere') return renderNotrePere()
          return renderContent(current.content)
        })()}
      </Card>
    </div>
  );
}
