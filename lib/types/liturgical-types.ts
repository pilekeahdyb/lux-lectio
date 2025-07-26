// Types de base pour le contenu liturgique
export interface PsaumeVerset {
  numero: string;
  texte: string;
}

export interface Psaume {
  numero: string;
  titre?: string;
  versets: PsaumeVerset[];
}

export interface Cantique {
  titre: string;
  reference: string;
  versets: PsaumeVerset[];
}

export interface Hymne {
  titre: string;
  auteur?: string;
  texte: string[];
  refrain?: string;
}

export interface Lecture {
  reference: string;
  texte: string;
}

export interface Repons {
  repons: string;
  versets: string[];
}

export interface Intercession {
  intention: string;
  repons: string;
}

// Information liturgique
export interface LiturgicalDay {
  season: string;
  week: string;
  celebration: string;
}

// Structure d'un office
export interface OfficeContent {
  hymne: Hymne;
  antiennes: string[];
  psaumes: {
    psaume1: Psaume;
    cantique: Cantique;
    psaume2: Psaume;
  };
  lecture: Lecture;
  repons: Repons;
  intercessions: Intercession[];
  oraison?: string;
}

export interface Office {
  name: string;
  description: string;
  date: string;
  liturgicalInfo: LiturgicalDay;
  content: OfficeContent;
}

export interface Office {
  introduction: {
    verset: string;
    repons: string;
  };
  invitatoire?: {
    antienne: string;
    psaume: Psaume;
  };
  hymne: Hymne;
  psaumes: PsaumeOuCantique[];
  lecture: Lecture;
  repons: Repons;
  cantique_evangelique?: CantiqueEvangelique;
  intercessions: Intercession[];
  oraison: {
    texte: string;
  };
  notre_pere?: string;
  intercession_refrain?: string;
}

// Section générique d’office, pour un rendu flexible et ordonné
export interface OfficeSection {
  type:
    | "introduction"
    | "invitatoire"
    | "hymne"
    | "psaume"
    | "cantique"
    | "lecture"
    | "repons"
    | "cantique-evangelique"
    | "intercessions"
    | "notre-pere"
    | "oraison"
    | "te-deum"
    | "antienne-mariale"
    | "examen-conscience"
    | "autre";
  titre?: string;
  reference?: string;
  antienne?: string;
  contenu?: string | string[] | any; // texte, versets, intentions, etc.
  extra?: any; // Pour des cas particuliers (refrain, auteur, etc.)
}

// Office complet, ordonné
export interface LiturgicalOffice {
  type: string; // laudes, vêpres, complies, etc.
  date: string;
  titre: string;
  sections: OfficeSection[]; // Ordre liturgique exact
}

export interface Celebration {
  nom: string;
  rang: 'solennité' | 'fête' | 'mémoire' | 'mémoire facultative';
  couleur: string;
}

export interface JourLiturgique {
  metadata: {
    date: string;
    temps_liturgique: string;
    semaine_psautier: number;
    celebration?: Celebration;
  };
  offices: {
    [key: string]: Office;
  };
}
