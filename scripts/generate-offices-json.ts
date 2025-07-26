import fs from 'fs';
import path from 'path';

// --- Config ---
const offices = [
  'office_des_lectures',
  'laudes',
  'tierce',
  'sexte',
  'none',
  'vepres',
  'complies',
];

const joursSemaine = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
const semainesPsautier = ['I', 'II', 'III', 'IV'];
const tempsLiturgiques = ['Temps ordinaire', 'Avent', 'Noël', 'Carême', 'Pâques'];

// --- Helpers ---
function pad(n: number) { return n < 10 ? '0' + n : n; }

function getSemainePsautier(date: Date): string {
  // Semaine I commence le lundi 2 décembre 2024 (début de l'Avent 2024)
  const debut = new Date('2024-12-02');
  const diff = Math.floor((date.getTime() - debut.getTime()) / (1000 * 60 * 60 * 24));
  const semaine = Math.floor(diff / 7) % 4;
  return semainesPsautier[(semaine + 4) % 4];
}

function getTempsLiturgique(date: Date): string {
  // Pour l'exemple, on met toujours Temps ordinaire
  return 'Temps ordinaire';
}

function generateOfficeJson(date: Date, office: string) {
  const jourSemaine = joursSemaine[date.getDay()];
  const semainePsautier = getSemainePsautier(date);
  const tempsLiturgique = getTempsLiturgique(date);
  const dateStr = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

  // Contenu fictif, à remplacer par des données réelles ou issues de l'AELF
  return {
    office: office.charAt(0).toUpperCase() + office.slice(1).replace(/_/g, ' '),
    date: dateStr,
    semaine_psautier: `semaine ${semainePsautier}`,
    temps_liturgique: tempsLiturgique,
    jour_semaine: jourSemaine,
    contenu: {
      hymne: `Hymne pour ${office} du ${jourSemaine}`,
      antiennes: [
        `Antienne 1 pour ${office}`,
        `Antienne 2 pour ${office}`,
      ],
      psaumes: {
        psaume1: `Texte du psaume 1 pour ${office}`,
        cantique: `Texte du cantique pour ${office}`,
        psaume2: `Texte du psaume 2 pour ${office}`,
      },
      lecture: `Lecture pour ${office}`,
      répons: `Répons pour ${office}`,
      intercessions: [
        `Intercession 1 pour ${office}`,
        `Intercession 2 pour ${office}`,
      ],
      oraison: `Oraison pour ${office}`,
      bénédiction: `Bénédiction pour ${office}`,
    },
  };
}

// --- Génération ---
const start = new Date('2025-06-09'); // lundi semaine III
const days = 7; // Générer pour une semaine exemple

for (let d = 0; d < days; d++) {
  const date = new Date(start.getTime() + d * 24 * 60 * 60 * 1000);
  for (const office of offices) {
    const json = generateOfficeJson(date, office);
    const fileName = `${json.date}_${office}.json`;
    const filePath = path.join(__dirname, '../data/offices', fileName);
    fs.writeFileSync(filePath, JSON.stringify(json, null, 2), 'utf-8');
    console.log('Généré :', filePath);
  }
}
