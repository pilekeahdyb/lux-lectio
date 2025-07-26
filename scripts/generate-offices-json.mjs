import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';

const offices = [
  'office_des_lectures',
  'laudes',
  'tierce',
  'sexte',
  'none',
  'vepres',
  'complies',
];

function pad(n) { return n < 10 ? '0' + n : n; }

function getApiOfficeName(office) {
  // Mapping pour l’API AELF
  switch (office) {
    case 'office_des_lectures': return 'lectures';
    case 'laudes': return 'laudes';
    case 'tierce': return 'tierce';
    case 'sexte': return 'sexte';
    case 'none': return 'none';
    case 'vepres': return 'vepres';
    case 'complies': return 'complies';
    default: return office;
  }
}

async function fetchAelfOffice(date, office) {
  const apiOffice = getApiOfficeName(office);
  const url = `https://api.aelf.org/v1/offices/${apiOffice}/${date}`;
  try {
    const res = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'LuxLectio/1.0',
      },
      timeout: 10000,
    });
    if (!res.ok) throw new Error(`AELF API error: ${res.status}`);
    return await res.json();
  } catch (e) {
    console.error(`Erreur récupération office ${office} pour ${date}:`, e.message);
    return null;
  }
}

function extractLiturgicalMeta(aelfData) {
  // Extraction des métadonnées liturgiques
  return {
    temps_liturgique: aelfData?.informations?.temps_liturgique || aelfData?.informations?.temps || 'Temps ordinaire',
    jour_semaine: aelfData?.informations?.jour_liturgique_nom || '',
    semaine_psautier: aelfData?.informations?.semaine || '',
    fete: aelfData?.informations?.fete || '',
  };
}

function buildOfficeJson(date, office, aelfData) {
  const dateStr = date;
  const meta = extractLiturgicalMeta(aelfData);
  // Structure générique, à adapter selon la structure réelle de l’API AELF
  return {
    office: office.charAt(0).toUpperCase() + office.slice(1).replace(/_/g, ' '),
    date: dateStr,
    semaine_psautier: meta.semaine_psautier ? `semaine ${meta.semaine_psautier}` : '',
    temps_liturgique: meta.temps_liturgique,
    jour_semaine: meta.jour_semaine,
    fete: meta.fete,
    contenu: aelfData?.contenu || aelfData || {},
    source: 'AELF',
  };
}

async function main() {
  const start = new Date('2025-01-01');
  const end = new Date('2025-12-31');

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const dateStr = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    for (const office of offices) {
      const aelfData = await fetchAelfOffice(dateStr, office);
      if (!aelfData) continue;
      // Gestion des cas liturgiques particuliers :
      // Si meta.fete ou meta.temps_liturgique indique une fête/solennité, on peut adapter ici
      const json = buildOfficeJson(dateStr, office, aelfData);
      const fileName = `${dateStr}_${office}.json`;
      const filePath = path.join(process.cwd(), 'data/offices', fileName);
      fs.writeFileSync(filePath, JSON.stringify(json, null, 2), 'utf-8');
      console.log('Généré :', filePath);
    }
  }
}

main();
