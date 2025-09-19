// Service API pour récupérer les données liturgiques

export interface AelfReading {
  titre: string
  contenu: string
  reference?: string
  ref?: string
  type?: string
  refrain_psalmique?: string
  verset_evangile?: string
  intro_lue?: string
}

export interface AelfInformations {
  date: string
  jour_liturgique_nom: string
  couleur?: string
  temps_liturgique?: string
  semaine?: string
  fete?: string
  nom?: string  // Nom de l'office (ex: "Laudes", "Vêpres", etc.)
}

export interface AelfData {
  informations: AelfInformations
  lectures: Record<string, AelfReading>
  messes: {
    nom: string
    lectures: AelfReading[]
  }[]
}

export interface AelfOfficeIntroduction {
  type?: string
  titre?: string
  contenu?: string
  antienne?: string
  hymne?: string
  psaume_invitatoire?: {
    type: string
    titre: string
    contenu: string
    antienne_debut?: string
  }
}

export interface AelfOfficePsaume {
  type?: string
  titre: string
  contenu: string
  antienne_debut?: string
  ref?: string
}

export interface AelfOfficeContent {
  type?: string
  titre?: string
  contenu: string
  reference?: string
  ref?: string
}

export interface AelfOfficeCantique extends AelfOfficeContent {
  antienne?: string
}

export interface AelfOfficeData {
  informations: AelfInformations
  office: {
    introduction?: AelfOfficeIntroduction
    invitatoire?: AelfOfficeContent
    hymne?: AelfOfficeContent
    antienne_1?: AelfOfficeContent
    antienne_2?: AelfOfficeContent
    antienne_3?: AelfOfficeContent
    psaume_1?: AelfOfficePsaume
    psaume_2?: AelfOfficePsaume
    psaume_3?: AelfOfficePsaume
    verset_psalmique?: AelfOfficeContent
    pericope?: AelfOfficeContent
    cantique_ancien?: AelfOfficeCantique
    cantique_nouveau?: AelfOfficeCantique
    cantique_zacharie?: AelfOfficeCantique
    cantique_marie?: AelfOfficeCantique
    cantique_symeon?: AelfOfficeCantique
    lecture_1?: AelfOfficeContent
    lecture_2?: AelfOfficeContent
    lecture_3?: AelfOfficeContent
    lecture_patristique?: AelfOfficeContent
    lecture_biblique?: AelfOfficeContent
    lecture_breve?: AelfOfficeContent
    repons_1?: AelfOfficeContent
    repons_2?: AelfOfficeContent
    repons_3?: AelfOfficeContent
    repons_bref?: AelfOfficeContent
    repons_long?: AelfOfficeContent
    verset_1?: AelfOfficeContent
    verset_2?: AelfOfficeContent
    verset_3?: AelfOfficeContent
    intercessions?: AelfOfficeContent
    priere?: AelfOfficeContent
    benediction?: AelfOfficeContent
    notre_pere?: AelfOfficeContent
    oraison?: AelfOfficeContent
    conclusion?: AelfOfficeContent
    antienne_zacharie?: AelfOfficeContent
    antienne_marie?: AelfOfficeContent
    antienne_symeon?: AelfOfficeContent
  }
}

export async function fetchLiturgicalReadings(date: string): Promise<AelfData> {
  try {
    const response = await fetch(`/api/aelf?date=${date}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`Erreur API: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Erreur lors de la récupération des lectures:", error)
    throw error
  }
}

export type OfficeType = 
  | "office_lectures"
  | "laudes"
  | "tierce"
  | "sexte"
  | "none"
  | "vepres"
  | "complies"
