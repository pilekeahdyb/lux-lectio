"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ReadingCard } from "./reading-card-new"
import { AelfOfficeData } from "@/lib/types"

interface OfficeData {
  nom: string // ex: "Laudes", "Vêpres", etc.
  informations: {
    date: string
    jour_liturgique_nom: string
  }
  sections: Array<{
    key: string
    label: string
    type: string
    content: any
  }>
}

interface OfficeCarouselProps {
  data: AelfOfficeData | AelfOfficeData[]
  onClose: () => void
}

export function OfficeCarousel({ data, onClose }: OfficeCarouselProps) {
  // Si data est un tableau, on gère la navigation, sinon on affiche l'unique office
  const offices = Array.isArray(data) ? data : [data]
  if (!offices || offices.length === 0 || !offices[0]?.office) {
    return (
      <div className="p-8 text-center text-red-600">
        Aucun office à afficher
      </div>
    )
  }

  const [officeIndex, setOfficeIndex] = useState(0)
  const currentOffice = offices[officeIndex]

  // Récupère toutes les clés de l'office, pas seulement celles de officeOrder
  const allKeys = Object.keys(currentOffice.office)
  const sections = allKeys
    .map((key) => {
      const content = (currentOffice.office as any)[key]
      if (!content) return null
      let titre = content.titre || key
      let contenu = typeof content === "string" ? content : content.texte || content.contenu || ""
      let reference = content.reference || content.ref
      if (!contenu.trim()) return null
      // Type le plus précis possible
      const type = content.type || key
      return {
        key,
        label: titre,
        type,
        content: { titre, contenu, reference },
      }
    })
    .filter((section): section is NonNullable<typeof section> => section !== null)

  return (
    <div className="w-full flex flex-col items-center">
      <div className="flex items-center justify-center gap-4 mb-4 w-full px-2">
        <button
          className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-blue-100 dark:hover:bg-blue-900 transition touch-target"
          onClick={onClose}
          aria-label="Retour aux offices"
        >
          <ChevronLeft className="w-6 h-6 text-blue-600 dark:text-blue-300" />
        </button>
        {offices.length > 1 && (
          <>
            <button
              className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-blue-100 dark:hover:bg-blue-900 transition touch-target"
              onClick={() => setOfficeIndex((i) => (i > 0 ? i - 1 : offices.length - 1))}
              aria-label="Office précédent"
            >
              <ChevronLeft className="w-6 h-6 text-blue-600 dark:text-blue-300" />
            </button>
            <div className="text-lg font-bold text-blue-800 dark:text-blue-200 text-center flex-1 truncate">
              {currentOffice.informations?.jour_liturgique_nom || `Office ${officeIndex + 1}`}
            </div>
            <button
              className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-blue-100 dark:hover:bg-blue-900 transition touch-target"
              onClick={() => setOfficeIndex((i) => (i < offices.length - 1 ? i + 1 : 0))}
              aria-label="Office suivant"
            >
              <ChevronRight className="w-6 h-6 text-blue-600 dark:text-blue-300" />
            </button>
          </>
        )}
        {offices.length === 1 && (
          <div className="text-lg font-bold text-blue-800 dark:text-blue-200 text-center flex-1 truncate">
            {currentOffice.informations?.jour_liturgique_nom}
          </div>
        )}
        <div className="w-4" />
      </div>
      <div className="w-full flex justify-center">
        <div
          className="flex gap-3 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-transparent touch-scroll px-4"
          style={{
            WebkitOverflowScrolling: "touch",
            scrollbarColor: "#bfdbfe transparent",
            scrollbarWidth: "thin",
          }}
        >
          {sections.map((section, idx) => (
            <div
              key={section.key || idx}
              className="min-w-[320px] max-w-[480px] flex-shrink-0"
            >
              <ReadingCard
                reading={section.content}
                type={section.type as any}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}