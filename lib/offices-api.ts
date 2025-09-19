// Service API pour la gestion des offices liturgiques
import { AelfOfficeData } from './api'

export type OfficeType = 
  | 'lectures' // Office des lectures => /v1/lectures
  | 'laudes'   // Laudes => /v1/laudes
  | 'tierce'   // Tierce => /v1/tierce
  | 'sexte'    // Sexte => /v1/sexte
  | 'none'     // None => /v1/none
  | 'vepres'   // Vêpres => /v1/vepres
  | 'complies' // Complies => /v1/complies

// Mapping des endpoints AELF
const AELF_ENDPOINTS: Record<OfficeType, string> = {
  lectures: 'lectures',
  laudes: 'laudes',
  tierce: 'tierce',
  sexte: 'sexte',
  none: 'none',
  vepres: 'vepres',
  complies: 'complies'
}

const officeNames: Record<OfficeType, string> = {
  lectures: "Office des lectures",
  laudes: "Laudes",
  tierce: "Office de Tierce",
  sexte: "Office de Sexte",
  none: "Office de None",
  vepres: "Vêpres",
  complies: "Complies"
}

export async function fetchOffice(date: string, office: OfficeType, zone: string = 'france'): Promise<AelfOfficeData> {
  try {
    // Les endpoints sont directs, sans date ni zone
    const endpoint = `https://api.aelf.org/V1/${AELF_ENDPOINTS[office]}`
    console.log(`Récupération de l'office ${office}`)

    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "User-Agent": "LuxLectio/1.0 (Application liturgique)",
        Referer: "https://www.aelf.org/",
      },
      next: { revalidate: 3600 }, // Cache d'une heure
    })

    if (!response.ok) {
      throw new Error(`Erreur API AELF: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()

    // Normalisation des données pour correspondre à notre interface
    return {
      informations: {
        ...data.informations,
        date: data.informations?.date || date,
        jour_liturgique_nom: data.informations?.jour_liturgique_nom || data.informations?.nom || "Jour liturgique",
        couleur: data.informations?.couleur || "vert",
        temps_liturgique: data.informations?.temps_liturgique || "ordinaire",
        semaine: data.informations?.semaine || "",
        fete: data.informations?.fete || data.informations?.ligne2 || "",
        // Ajout du nom de l'office
        nom: officeNames[office]
      },
      office: data.office || {}
    }
  } catch (error) {
    console.error(`Erreur lors de la récupération de l'office ${office}:`, error)
    throw error
  }
}

/**
 * Récupère tous les offices disponibles pour une date donnée
 */
export async function fetchAllOffices(date: string, zone: string = 'france'): Promise<AelfOfficeData[]> {
  const offices: OfficeType[] = ['laudes', 'tierce', 'sexte', 'none', 'vepres', 'complies', 'lectures']
  
  try {
    const officesData = await Promise.all(
      offices.map(office => fetchOffice(date, office, zone))
    )
    return officesData
  } catch (error) {
    console.error('Erreur lors de la récupération des offices:', error)
    throw error
  }
}