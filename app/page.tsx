"use client"

import { useState, useRef, useEffect } from "react"
import "../styles/navbar-animations.css"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronDown, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ReadingCard } from "@/components/reading-card-new"

import { useLiturgical } from "@/components/liturgical-provider"

function HomePage() {
  const { currentDate, liturgicalData, refreshData, loading, error } = useLiturgical()
  const [messeIndex, setMesseIndex] = useState(0)

  // Pour déboguer
  console.log("liturgicalData:", liturgicalData)
  console.log("loading:", loading)
  console.log("error:", error)

  // Couleur liturgique dynamique (par défaut violet)
  const color =
    (liturgicalData?.informations?.couleur as "violet" | "vert" | "rouge" | "blanc" | "rose" | "noir") || "violet"

  const bgColorMap: Record<string, string> = {
    violet: "bg-purple-100 dark:bg-purple-900",
    vert: "bg-green-100 dark:bg-green-900",
    rouge: "bg-red-100 dark:bg-red-900",
    blanc: "bg-gray-100 dark:bg-gray-900",
    rose: "bg-pink-100 dark:bg-pink-900",
    noir: "bg-black text-white",
  }
  const bgColor = bgColorMap[color] || "bg-purple-100 dark:bg-purple-900"

  const getAccentStyles = (color: string) => {
    const colorMap: Record<string, { bg: string; border: string; hover: string; active: string }> = {
      violet: {
        bg: "bg-purple-100 dark:bg-purple-900",
        border: "border-purple-500",
        hover: "hover:bg-purple-200 hover:text-purple-900",
        active: "data-[state=active]:bg-purple-500 data-[state=active]:text-white",
      },
      vert: {
        bg: "bg-green-100 dark:bg-green-900",
        border: "border-green-500",
        hover: "hover:bg-green-200 hover:text-green-900",
        active: "data-[state=active]:bg-green-500 data-[state=active]:text-white",
      },
      rouge: {
        bg: "bg-red-100 dark:bg-red-900",
        border: "border-red-500",
        hover: "hover:bg-red-200 hover:text-red-900",
        active: "data-[state=active]:bg-red-500 data-[state=active]:text-white",
      },
      blanc: {
        bg: "bg-gray-100 dark:bg-gray-900",
        border: "border-gray-500",
        hover: "hover:bg-gray-200 hover:text-gray-900",
        active: "data-[state=active]:bg-gray-500 data-[state=active]:text-white",
      },
      rose: {
        bg: "bg-pink-100 dark:bg-pink-900",
        border: "border-pink-500",
        hover: "hover:bg-pink-200 hover:text-pink-900",
        active: "data-[state=active]:bg-pink-500 data-[state=active]:text-white",
      },
      noir: {
        bg: "bg-neutral-100 dark:bg-neutral-900",
        border: "border-neutral-500",
        hover: "hover:bg-neutral-200 hover:text-neutral-900",
        active: "data-[state=active]:bg-neutral-500 data-[state=active]:text-white",
      },
    }
    return colorMap[color] || colorMap.violet
  }

  const accentStyles = getAccentStyles(color)

  return (
    <div
      className={`p-3 sm:p-4 md:p-6 max-w-4xl mx-auto min-h-screen transition-colors duration-300 ${bgColor} overflow-x-hidden`}
    >
      {/* Header : uniquement la sélection du type de messe si plusieurs messes */}
      {liturgicalData?.messes && liturgicalData.messes.length > 1 && (
        <div className="mb-4 sm:mb-6">
          <MesseTypeTabs
            messes={liturgicalData.messes.map((messe: any, idx: number) => ({
              ...messe,
              id: `messe-${idx}`,
            }))}
            messeIndex={messeIndex}
            setMesseIndex={setMesseIndex}
            accentStyles={accentStyles}
          />
        </div>
      )}
      {/* Navigation horizontale pour les lectures de la messe sélectionnée (pour tous les jours) */}
      {liturgicalData?.messes && liturgicalData.messes.length > 0 ? (
        <MesseReadingsTabs
          messes={liturgicalData.messes.map((messe: any, idx: number) => ({
            ...messe,
            id: `messe-${idx}`,
          }))}
          messeIndex={messeIndex}
          accentStyles={accentStyles}
        />
      ) : (
        (() => {
          // Si pas de messes, on affiche les lectures globales (ordre dynamique)
          let readings: any[] = []
          if (liturgicalData?.lectures && Object.keys(liturgicalData.lectures).length > 0) {
            readings = Object.values(liturgicalData.lectures)
          }
          return readings.length > 0 ? (
            <ReadingsTabs readings={readings} accentStyles={accentStyles} />
          ) : (
            <Card className="liturgical-card">
              <CardContent className="p-6 sm:p-8 text-center">
                <p className="text-muted-foreground text-sm sm:text-base">Aucune lecture disponible pour cette date.</p>
                <p className="text-xs sm:text-sm text-muted-foreground mt-2">
                  L'API AELF pourrait être temporairement indisponible.
                </p>
                <Button
                  onClick={refreshData}
                  variant="outline"
                  className={`mt-4 hover:scale-105 transition-transform ${accentStyles.border} text-purple-700`}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Réessayer
                </Button>
              </CardContent>
            </Card>
          )
        })()
      )}
    </div>
  )
}

function MesseTypeTabs({
  messes,
  messeIndex,
  setMesseIndex,
  accentStyles,
}: {
  messes: { id: string; nom: string; lectures?: any[] }[]
  messeIndex: number
  setMesseIndex: (idx: number) => void
  accentStyles: any
}) {
  const messeEmojis = ["🌙", "☀️", "🕊️", "⭐", "🔥"]
  const listRef = useRef<HTMLDivElement>(null)
  const triggerRefs = useRef<(HTMLButtonElement | null)[]>([])

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTo({ left: 0, behavior: "smooth" })
    }
    if (triggerRefs.current[messeIndex]) {
      triggerRefs.current[messeIndex]?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" })
    }
  }, [messeIndex, messes])

  return (
    <Tabs value={String(messeIndex)} onValueChange={(v) => setMesseIndex(Number(v))}>
      <div className="w-full max-w-full overflow-hidden">
        <TabsList
          ref={listRef}
          className={`w-full max-w-none rounded-lg shadow ${accentStyles.bg} ${accentStyles.border} flex p-1 transition-all gap-1 sm:gap-2`}
          style={{
            overflowX: "auto",
            scrollbarWidth: "thin",
            WebkitOverflowScrolling: "touch",
            scrollBehavior: "smooth",
            minWidth: "max-content",
          }}
        >
          {messes.map((messe, idx) => (
            <TabsTrigger
              key={messe.id}
              value={String(idx)}
              ref={(el) => {
                triggerRefs.current[idx] = el
              }}
              className={`px-3 sm:px-4 py-2 rounded-lg font-semibold flex items-center gap-1 sm:gap-2 transition-all duration-300 whitespace-nowrap flex-shrink-0 min-w-fit text-xs sm:text-sm
							${accentStyles.active} ${accentStyles.hover}
							data-[state=active]:shadow-lg data-[state=active]:scale-105 sm:data-[state=active]:scale-110`}
            >
              <span className="text-sm sm:text-base">{messeEmojis[idx % messeEmojis.length]}</span>
              <span className="hidden xs:inline sm:inline">{messe.nom}</span>
              <span className="xs:hidden sm:hidden">{messe.nom.split(" ")[0]}</span>
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
    </Tabs>
  )
}

function MesseReadingsTabs({
  messes,
  messeIndex,
  accentStyles,
}: {
  messes: { id: string; nom: string; lectures?: any[] }[]
  messeIndex: number
  accentStyles: any
}) {
  const currentMesse = messes && messes.length > messeIndex && messeIndex >= 0 ? messes[messeIndex] : null
  const readings = currentMesse && Array.isArray(currentMesse.lectures) ? currentMesse.lectures : []

  return (
    <div>
      <ReadingsTabs readings={readings} accentStyles={accentStyles} />
    </div>
  )
}

const typeLabels: Record<string, string> = {
  lecture_1: "Première lecture",
  psaume: "Psaume",
  cantique: "Cantique",
  lecture_2: "Deuxième lecture",
  evangile: "Évangile",
}

const readingEmojis: Record<string, string> = {
  lecture_1: "📖",
  psaume: "🎵",
  cantique: "🎵",
  lecture_2: "📖",
  evangile: "✝️",
}

function ReadingsTabs({ readings, accentStyles }: { readings: any[]; accentStyles: any }) {
  const [tab, setTab] = useState("0")
  const listRef = useRef<HTMLDivElement>(null)
  const triggerRefs = useRef<(HTMLButtonElement | null)[]>([])

  const getReadingLabel = (reading: any, idx: number) => {
    if (!reading) return { icon: "📄", name: "Lecture" }

    if (reading.type === "psaume") return { icon: "🎵", name: "Psaume" }
    if (reading.type === "cantique") return { icon: "🎵", name: "Cantique" }
    if (reading.type === "evangile") return { icon: "✝️", name: "Évangile" }
    if (reading.type === "sequence") return { icon: "🎵", name: "Séquence" }
    if (reading.type === "lecture") return { icon: "📖", name: `Lecture ${idx + 1}` }

    let readingType = Object.keys(reading).find((key) =>
      ["lecture_1", "lecture_2", "psaume", "cantique", "evangile", "sequence"].includes(key),
    )
    if (!readingType && reading.type) {
      readingType = reading.type.toLowerCase()
    }

    const typeIcons: Record<string, string> = {
      lecture_1: "📜",
      lecture_2: "📜",
      psaume: "🎵",
      cantique: "🎶",
      evangile: "📖",
      sequence: "🎵",
    }

    const typeNames: Record<string, string> = {
      lecture_1: "Lecture 1",
      lecture_2: "Lecture 2",
      psaume: "Psaume",
      cantique: "Cantique",
      evangile: "Évangile",
      sequence: "Séquence",
    }

    const icon = typeIcons[readingType as keyof typeof typeIcons] || "📄"
    const name = typeNames[readingType as keyof typeof typeNames] || `Lecture ${idx + 1}`
    return { icon, name }
  }

  // Si nous avons exactement 2 lectures, utilisons un menu déroulant
  if (readings.length === 2) {
    const currentReading = readings[Number.parseInt(tab)]
    const currentLabel = getReadingLabel(currentReading, Number.parseInt(tab))

    return (
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className={`mb-4 w-full justify-between text-sm sm:text-base ${accentStyles.bg} ${accentStyles.border} ${accentStyles.hover}`}
            >
              <span className="flex items-center gap-2">
                <span className="text-base sm:text-lg">{currentLabel.icon}</span>
                <span className="truncate">{currentLabel.name}</span>
              </span>
              <ChevronDown className="h-4 w-4 opacity-50 flex-shrink-0" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-full min-w-[200px]">
            {readings.map((reading, idx) => {
              const label = getReadingLabel(reading, idx)
              return (
                <DropdownMenuItem key={idx} onClick={() => setTab(String(idx))} className="cursor-pointer">
                  <span className="flex items-center gap-2">
                    <span className="text-base">{label.icon}</span>
                    <span>{label.name}</span>
                  </span>
                </DropdownMenuItem>
              )
            })}
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="animate-slide-in-right">
          <ReadingCard
            reading={currentReading}
            type={currentReading?.type || "lecture"}
            className="animate-slide-in-right"
          />
        </div>
      </div>
    )
  }

  return (
    <Tabs value={tab} onValueChange={setTab}>
      <div className="w-full max-w-full overflow-hidden mb-4">
        <TabsList
          ref={listRef}
          className={`w-full max-w-none rounded-lg shadow ${accentStyles.bg} ${accentStyles.border} flex p-1 transition-all gap-1 sm:gap-2`}
          style={{
            overflowX: "auto",
            scrollbarWidth: "thin",
            scrollbarColor: "#6366f1 transparent",
            WebkitOverflowScrolling: "touch",
            scrollBehavior: "smooth",
            minWidth: "max-content",
          }}
        >
          {readings.map((reading, idx) => {
            const label = getReadingLabel(reading, idx)
            return (
              <TabsTrigger
                key={idx}
                value={String(idx)}
                ref={(el) => {
                  triggerRefs.current[idx] = el
                }}
                className={`px-3 sm:px-4 py-2 rounded-lg font-semibold flex items-center gap-1 sm:gap-2 transition-all duration-300 whitespace-nowrap flex-shrink-0 min-w-fit text-black text-xs sm:text-sm
								${accentStyles.active} ${accentStyles.hover}`}
              >
                <span className="text-sm sm:text-base">{label.icon}</span>
                <span className="hidden xs:inline sm:inline">{label.name}</span>
                <span className="xs:hidden sm:hidden">{label.name.split(" ")[0]}</span>
              </TabsTrigger>
            )
          })}
        </TabsList>
      </div>
      <div className="animate-slide-in-right">
        <ReadingCard
          reading={readings[Number.parseInt(tab)]}
          type={readings[Number.parseInt(tab)]?.type || "lecture"}
          className="animate-slide-in-right"
        />
      </div>
    </Tabs>
  )
}

export default HomePage
