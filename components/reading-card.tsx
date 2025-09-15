import type { AelfReading } from "@/lib/api"

interface ReadingCardProps {
  reading: AelfReading
  type: "lecture_1" | "psaume" | "lecture_2" | "evangile"
  className?: string
}

const typeLabels = {
  lecture_1: "Première lecture",
  psaume: "Psaume",
  lecture_2: "Deuxième lecture",
  evangile: "Évangile",
}

export function ReadingCard({ reading, type, className = "" }: ReadingCardProps) {
  const reference = reading.reference || reading.ref || ""
  const readingLabel = reading.intro_lue || typeLabels[type]

  return (
    <div className={`w-full my-2 space-y-2 ${className}`}>
      {/* Titre séparé */}
      {reading.titre && (
        <div className="mb-1">
          <h3 className="font-semibold text-base text-gray-800 dark:text-gray-200 text-center">{reading.titre}</h3>
        </div>
      )}
      {/* En-tête (type, référence) */}
      <div className="bg-white dark:bg-white/10 p-3 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <span className="font-bold text-sm text-gray-700 dark:text-gray-300">{readingLabel}</span>
        {reference && <span className="text-xs text-gray-700 dark:text-gray-300 font-bold ml-2">{reference}</span>}
      </div>
      {/* Contenu */}
      <div className="bg-white dark:bg-white/10 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
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
          className={`prose prose-sm max-w-none dark:prose-invert leading-relaxed ${type === "psaume" ? "italic" : ""}`}
          dangerouslySetInnerHTML={{ __html: reading.contenu }}
        />
      </div>
    </div>
  )
}
