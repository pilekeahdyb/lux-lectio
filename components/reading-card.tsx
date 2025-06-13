import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { AelfReading } from "@/lib/api"

interface ReadingCardProps {
  reading: AelfReading
  type: "lecture_1" | "psaume" | "lecture_2" | "evangile"
  className?: string
}

const typeStyles = {
  lecture_1: {
    border: "border-blue-200 dark:border-slate-700",
    title: "text-blue-800 dark:text-blue-200",
    dot: "bg-blue-500",
    subtitle: "text-blue-600 dark:text-blue-300",
    heading: "text-blue-700 dark:text-blue-300",
    label: "Première lecture",
  },
  psaume: {
    border: "border-green-200 dark:border-slate-700",
    title: "text-green-800 dark:text-green-200",
    dot: "bg-green-500",
    subtitle: "text-green-600 dark:text-green-300",
    heading: "text-green-700 dark:text-green-300",
    label: "Psaume",
  },
  lecture_2: {
    border: "border-purple-200 dark:border-slate-700",
    title: "text-purple-800 dark:text-purple-200",
    dot: "bg-purple-500",
    subtitle: "text-purple-600 dark:text-purple-300",
    heading: "text-purple-700 dark:text-purple-300",
    label: "Deuxième lecture",
  },
  evangile: {
    border: "border-amber-300 dark:border-slate-700",
    title: "text-amber-800 dark:text-amber-200",
    dot: "bg-amber-500",
    subtitle: "text-amber-600 dark:text-amber-300",
    heading: "text-amber-700 dark:text-amber-300",
    label: "Évangile",
  },
}

export function ReadingCard({ reading, type, className = "" }: ReadingCardProps) {
  const styles = typeStyles[type]
  const isGospel = type === "evangile"
  const reference = reading.reference || reading.ref || ""

  return (
    <Card className={`${styles.border} ${className} ${isGospel ? "shadow-lg" : ""}`}>
      <CardHeader
        className={
          isGospel ? "bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20" : ""
        }
      >
        <CardTitle className={`${styles.title} flex items-center ${isGospel ? "text-lg" : ""}`}>
          <span
            className={`w-${isGospel ? "3" : "2"} h-${isGospel ? "3" : "2"} ${styles.dot} rounded-full mr-3`}
          ></span>
          {styles.label}
        </CardTitle>
        {reference && <p className={`text-sm font-medium ${styles.subtitle}`}>{reference}</p>}
      </CardHeader>
      <CardContent className={isGospel ? "pt-6" : ""}>
        {reading.titre && (
          <h3 className={`font-semibold mb-${isGospel ? "4" : "3"} ${styles.heading} ${isGospel ? "text-lg" : ""}`}>
            {reading.titre}
          </h3>
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
          className={`prose prose-sm max-w-none dark:prose-invert leading-relaxed ${
            type === "psaume" ? "italic" : ""
          } ${isGospel ? "text-base" : ""}`}
          dangerouslySetInnerHTML={{ __html: reading.contenu }}
        />
      </CardContent>
    </Card>
  )
}
