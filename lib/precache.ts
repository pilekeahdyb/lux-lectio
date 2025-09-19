// Utilitaire de préchargement pour la Bible et le contenu liturgique
import { bibleBooks } from './bible-books';

// Fonction pour précharger une partie de la Bible
export async function precacheBibleContent() {
  for (const book of bibleBooks) {
    try {
      const response = await fetch(`/bible/${book}.json`);
      if (!response.ok) {
        throw new Error(`Erreur lors du chargement de ${book}`);
      }
      // Le contenu sera automatiquement mis en cache par le service worker
      await response.json();
    } catch (error) {
      console.error(`Erreur lors du préchargement de ${book}:`, error);
    }
  }
}

// Préchargement du contenu liturgique pour les jours à venir
export async function precacheLiturgicalContent(days: number = 14) {
  const today = new Date();
  
  for (let i = 0; i < days; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    const dateStr = date.toISOString().split('T')[0];
    
    try {
      // Précharger les messes
      await fetch(`/api/messes/${dateStr}`);
      
      // Précharger les offices
      const offices = ['laudes', 'tierce', 'sexte', 'none', 'vepres', 'complies', 'lectures'];
      for (const office of offices) {
        await fetch(`/api/offices?office=${office}&date=${dateStr}`);
      }
      
      // Précharger les saints du jour
      await fetch(`/api/saints/${dateStr}`);
      
    } catch (error) {
      console.error(`Erreur lors du préchargement pour ${dateStr}:`, error);
    }
  }
}

// Fonction principale de préchargement
export async function precacheAllContent() {
  try {
    // Précharger la Bible (cache de 30 jours)
    await precacheBibleContent();
    
    // Précharger le contenu liturgique (14 jours)
    await precacheLiturgicalContent(14);
    
    console.log('Préchargement terminé avec succès');
  } catch (error) {
    console.error('Erreur lors du préchargement:', error);
  }
}