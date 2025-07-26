import { Office, LiturgicalDay } from './types/liturgical-types';
import { liturgicalContent2025_06_13 } from './liturgical-content';
import { fetchAelfOffice } from './aelf-api';

interface DailyOffices {
  [key: string]: Office;
}

// For now, we have hardcoded data for June 13, 2025
const officesData: { [date: string]: DailyOffices } = {
  '2025-06-13': liturgicalContent2025_06_13
};

export const getOfficesForDate = async (date: Date): Promise<DailyOffices> => {
  const dateStr = date.toISOString().split('T')[0];

  // Pour le 13 juin 2025, retourne la démo locale
  if (dateStr === '2025-06-13') {
    return officesData[dateStr];
  }

  // Récupère dynamiquement tous les offices majeurs via l'API AELF
  const officeTypes = ['laudes', 'tierce', 'sexte', 'none', 'vepres', 'complies'];
  const results: DailyOffices = {};
  for (const type of officeTypes) {
    const apiData = await fetchAelfOffice(type, dateStr);
    console.log(`AELF API RAW (${type}):`, JSON.stringify(apiData, null, 2));
    // Mapping minimal, à adapter selon la structure exacte de l'API AELF
    results[type] = {
      name: apiData.nom || type,
      description: apiData.description || `Office de ${type}`,
      date: dateStr,
      liturgicalInfo: {
        season: apiData.saison || 'À déterminer',
        week: apiData.semaine || 'À déterminer',
        celebration: apiData.celebration || 'À déterminer'
      },
      content: apiData // TODO: Adapter le mapping selon la structure exacte de l'API AELF
    } as Office;
  }
  return results;
};

export const getOfficeByDateAndType = async (date: Date, officeType: string): Promise<Office | null> => {
  const offices = await getOfficesForDate(date);
  return offices[officeType.toLowerCase()] || null;
};
