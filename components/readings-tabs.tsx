"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { ReadingCard } from "@/components/reading-card"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface ReadingsTabsProps {
  readings: any[]
  accentColor: string
}

export function ReadingsTabs({ readings, accentColor }: ReadingsTabsProps) {
  const [activeTab, setActiveTab] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)

  const validReadings =
    readings?.filter(
      (reading) =>
        reading &&
        typeof reading === "object" &&
        (reading.title || reading.text || reading.content || reading.antienne),
    ) || []

  const getReadingInfo = (reading: any, index: number) => {
    const typeMap = {
      lecture: { icon: "📖", label: `Lecture ${index + 1}` },
      psaume: { icon: "🎵", label: "Psaume" },
      cantique: { icon: "🎵", label: "Cantique" },
      evangile: { icon: "✝️", label: "Évangile" },
      sequence: { icon: "🎵", label: "Séquence" },
      antienne: { icon: "🎵", label: "Antienne" },
    }

    const type = reading?.type?.toLowerCase() || "lecture"
    return typeMap[type as keyof typeof typeMap] || { icon: "📄", label: `Lecture ${index + 1}` }
  }

  const scrollToTab = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 150
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  if (validReadings.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        <p>Aucune lecture disponible</p>
      </div>
    )
  }

  return (
    <div className="w-full space-y-4">
      <div className="relative w-full max-w-full">
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-lg hover:bg-white dark:hover:bg-gray-800 border"
          onClick={() => scrollToTab("left")}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="mx-10 overflow-hidden">
          <div
            ref={scrollRef}
            className="flex gap-3 py-3 overflow-x-auto scrollbar-thin touch-scroll"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "#666 #ddd",
              WebkitOverflowScrolling: "touch",
            }}
          >
            {validReadings.map((reading, index) => {
              const info = getReadingInfo(reading, index)
              const isActive = activeTab === index

              return (
                <Button
                  key={index}
                  variant={isActive ? "default" : "outline"}
                  className={`
                    flex items-center gap-2 px-4 py-2 whitespace-nowrap flex-shrink-0 min-w-fit transition-all duration-200 touch-target
                    ${
                      isActive
                        ? `bg-blue-500 hover:bg-blue-600 text-white shadow-lg`
                        : `hover:bg-blue-50 dark:hover:bg-blue-900/20 border-gray-200 dark:border-gray-700`
                    }
                  `}
                  onClick={() => setActiveTab(index)}
                >
                  <span className="text-sm">{info.icon}</span>
                  <span className="font-medium text-sm">{info.label}</span>
                </Button>
              )
            })}
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-lg hover:bg-white dark:hover:bg-gray-800 border"
          onClick={() => scrollToTab("right")}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="relative min-h-[400px]">
        {validReadings.map((reading, index) => (
          <div
            key={index}
            className={`
              absolute inset-0 transition-all duration-300 ease-in-out
              ${
                activeTab === index
                  ? "opacity-100 translate-x-0 pointer-events-auto"
                  : "opacity-0 translate-x-4 pointer-events-none"
              }
            `}
          >
            <ReadingCard reading={reading} type={reading?.type || "lecture"} className="animate-slide-in-right" />
          </div>
        ))}
      </div>
    </div>
  )
}
