import type { AelfReading } from "@/lib/api"

interface ReadingCardProps {
  reading: AelfReading
  type: "lecture_1" | "psaume" | "lecture_2" | "evangile" | "lecture" | "cantique" | "sequence" | "antienne"
  className?: string
}

const typeLabels = {
  lecture_1: "Première lecture",
  lecture: "Lecture",
  psaume: "Psaume",
  cantique: "Cantique",
  lecture_2: "Deuxième lecture",
  evangile: "Évangile",
  sequence: "Séquence",
  antienne: "Antienne",
}

export function ReadingCard({ reading, type, className = "" }: ReadingCardProps) {
  const reference = reading.reference || reading.ref || ""
  const displayType = type === "lecture" ? "lecture_1" : type
  const readingLabel = reading.intro_lue || typeLabels[displayType] || typeLabels[type] || "Lecture"

  return (
    <div className={`w-full my-6 space-y-4 ${className}`}>
      <div className="bg-white dark:bg-white/10 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <span className="font-bold text-sm text-gray-700 dark:text-gray-300">{readingLabel}</span>
          {reference && <span className="text-xs text-gray-700 dark:text-gray-300 font-bold ml-2">{reference}</span>}
        </div>
      </div>

      <div className="bg-white dark:bg-white/10 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        {reading.titre && (
          <h3 className="font-semibold mb-4 text-base text-gray-800 dark:text-gray-200">{reading.titre}</h3>
        )}
        {reading.refrain_psalmique && (
          <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-md mb-4 italic border-l-4 border-green-500">
            <div
              className="text-green-800 dark:text-green-200 font-medium"
              dangerouslySetInnerHTML={{ __html: reading.refrain_psalmique }}
            />
          </div>
        )}
        {reading.verset_evangile && (
          <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-md mb-4 border-l-4 border-amber-500">
            <div
              className="text-amber-800 dark:text-amber-200"
              dangerouslySetInnerHTML={{ __html: reading.verset_evangile }}
            />
          </div>
        )}
        <div
          className={`prose prose-sm max-w-none dark:prose-invert leading-relaxed ${type === "psaume" || type === "cantique" ? "italic" : ""}`}
          dangerouslySetInnerHTML={{ __html: reading.contenu }}
        />
      </div>
    </div>
  )
}
