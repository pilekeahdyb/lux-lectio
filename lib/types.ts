// Types for AELF Office API
export interface AelfOfficeContent {
  type?: string
  titre?: string
  contenu?: string
  reference?: string
  ref?: string
}

export interface AelfOfficePsaume extends AelfOfficeContent {
  antienne_debut?: string
}

export interface AelfOfficeIntroduction extends AelfOfficeContent {
  antienne?: string
  hymne?: string
  psaume_invitatoire?: AelfOfficePsaume
}

export interface AelfOfficeCantique extends AelfOfficeContent {
  antienne?: string
}

export interface AelfOfficeData {
  informations: {
    date: string
    jour_liturgique_nom: string
  }
  office: {
    introduction?: AelfOfficeIntroduction
    psaume_1?: AelfOfficePsaume
    psaume_2?: AelfOfficePsaume
    psaume_3?: AelfOfficePsaume
    cantique_ancien?: AelfOfficeCantique
    cantique_zacharie?: AelfOfficeCantique
    lecture_breve?: AelfOfficeContent
    repons_bref?: AelfOfficeContent
    intercessions?: AelfOfficeContent
    notre_pere?: AelfOfficeContent
    oraison?: AelfOfficeContent
    conclusion?: AelfOfficeContent
    antienne_zacharie?: AelfOfficeContent
  }
}