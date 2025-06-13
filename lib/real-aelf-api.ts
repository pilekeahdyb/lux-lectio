// Service API pour récupérer les VRAIES données liturgiques AELF

export interface RealAelfReading {
  titre: string
  contenu: string
  reference?: string
  ref?: string
  type: string
  refrain_psalmique?: string
  verset_evangile?: string
  intro_lue?: string
}

export interface RealAelfData {
  source: string
  endpoint?: string
  date: string
  informations: {
    date: string
    jour_liturgique_nom: string
    couleur: string
    temps_liturgique?: string
    semaine?: string
    fete?: string
  }
  messes: {
    nom: string
    lectures: RealAelfReading[]
  }[]
  lectures: Record<string, RealAelfReading>
  data: any // Données brutes de l'API AELF
}

export async function fetchRealLiturgicalReadings(date: string): Promise<RealAelfData> {
  try {
    console.log(`🔍 Récupération RÉELLE des lectures AELF pour ${date}`)

    const response = await fetch(`/api/real-aelf?date=${date}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || `Erreur API: ${response.status}`)
    }

    const data = await response.json()
    console.log(`✅ Données RÉELLES reçues de ${data.source}`)

    return data
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des lectures RÉELLES:", error)
    throw error
  }
}

export function validateAelfData(data: RealAelfData): boolean {
  // Vérifier que nous avons bien des données réelles
  if (!data.source || data.source === "fallback") {
    return false
  }

  // Vérifier la présence de lectures
  if (!data.messes || data.messes.length === 0) {
    return false
  }

  if (!data.messes[0].lectures || data.messes[0].lectures.length === 0) {
    return false
  }

  // Vérifier que les lectures ont du contenu réel
  const hasRealContent = data.messes[0].lectures.some((lecture) => lecture.contenu && lecture.contenu.length > 50)

  return hasRealContent
}

export function formatLiturgicalDate(date: Date): string {
  return date.toLocaleDateString("fr-FR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export function formatApiDate(date: Date): string {
  return date.toISOString().split("T")[0]
}
