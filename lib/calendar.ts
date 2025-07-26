import { JourLiturgique } from './liturgical-data';

export interface TempsLiturgique {
  nom: string;
  couleur: string;
  debut: Date;
  fin: Date;
}

export interface FeteLiturgique {
  nom: string;
  date: string; // Format YYYY-MM-DD
  rang: 'solennité' | 'fête' | 'mémoire' | 'mémoire facultative';
  couleur: string;
  propre?: boolean;
}

export const TEMPS_LITURGIQUES_2025: TempsLiturgique[] = [
  {
    nom: "Temps de l'Avent",
    couleur: "violet",
    debut: new Date("2024-12-01"),
    fin: new Date("2024-12-24")
  },
  {
    nom: "Temps de Noël",
    couleur: "blanc",
    debut: new Date("2024-12-25"),
    fin: new Date("2025-01-12")
  },
  {
    nom: "Temps ordinaire (première partie)",
    couleur: "vert",
    debut: new Date("2025-01-13"),
    fin: new Date("2025-02-18")
  },
  {
    nom: "Temps du Carême",
    couleur: "violet",
    debut: new Date("2025-02-19"),
    fin: new Date("2025-04-05")
  },
  {
    nom: "Temps pascal",
    couleur: "blanc",
    debut: new Date("2025-04-06"),
    fin: new Date("2025-05-24")
  },
  {
    nom: "Temps ordinaire (deuxième partie)",
    couleur: "vert",
    debut: new Date("2025-05-25"),
    fin: new Date("2025-11-30")
  }
];

export const FETES_2025: FeteLiturgique[] = [
  {
    nom: "Sainte Marie, Mère de Dieu",
    date: "2025-01-01",
    rang: "solennité",
    couleur: "blanc",
    propre: true
  },
  {
    nom: "Épiphanie du Seigneur",
    date: "2025-01-06",
    rang: "solennité",
    couleur: "blanc",
    propre: true
  },
  // ... Ajouter d'autres fêtes ici
];

function getSemainePsautier(date: Date): string {
  // L'année liturgique 2025 commence le 1er décembre 2024
  const startDate = new Date("2024-12-01");
  const weekNumber = Math.floor((date.getTime() - startDate.getTime()) / (7 * 24 * 60 * 60 * 1000));
  return `semaine ${(weekNumber % 4) + 1}`;
}

function getTempsLiturgique(date: Date): TempsLiturgique | undefined {
  return TEMPS_LITURGIQUES_2025.find(temps => 
    date >= temps.debut && date <= temps.fin
  );
}

function getFeteDuJour(date: string): FeteLiturgique | undefined {
  return FETES_2025.find(fete => fete.date === date);
}

const JOURS_SEMAINE = [
  "dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"
];

export function getJourLiturgique(date: string): Partial<JourLiturgique> {
  const dateObj = new Date(date);
  const tempsLiturgique = getTempsLiturgique(dateObj);
  const feteDuJour = getFeteDuJour(date);

  return {
    date,
    jour_semaine: JOURS_SEMAINE[dateObj.getDay()],
    temps_liturgique: tempsLiturgique?.nom || "Temps ordinaire",
    semaine_psautier: getSemainePsautier(dateObj),
    celebration: feteDuJour ? {
      nom: feteDuJour.nom,
      rang: feteDuJour.rang,
      couleur: feteDuJour.couleur
    } : undefined
  };
}
