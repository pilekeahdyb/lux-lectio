// Service worker pour le préchargement du contenu
import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { CacheFirst, StaleWhileRevalidate } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';

// Précache des ressources statiques
precacheAndRoute(self.__WB_MANIFEST);

// Cache des données de l'API AELF pour 14 jours
registerRoute(
  ({ url }) => url.origin === 'https://api.aelf.org',
  new CacheFirst({
    cacheName: 'aelf-api',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxEntries: 500,
        maxAgeSeconds: 60 * 60 * 24 * 14, // 14 jours
      }),
    ],
  })
);

// Cache des fichiers Bible JSON
registerRoute(
  ({ request }) => request.url.includes('/bible/') && request.url.endsWith('.json'),
  new CacheFirst({
    cacheName: 'bible-content',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 60 * 60 * 24 * 30, // 30 jours
      }),
    ],
  })
);

// Fonction pour précharger les données des prochains jours
async function precacheUpcomingContent() {
  const today = new Date();
  const days = 14; // Préchargement des 14 prochains jours

  for (let i = 0; i < days; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    const dateStr = date.toISOString().split('T')[0];

    // Précharger les messes
    try {
      const messesUrl = `https://api.aelf.org/v1/messes/${dateStr}/romain`;
      await fetch(messesUrl);
    } catch (error) {
      console.error(`Erreur lors du préchargement des messes pour ${dateStr}:`, error);
    }

    // Précharger les offices
    const offices = ['laudes', 'tierce', 'sexte', 'none', 'vepres', 'complies', 'lectures'];
    for (const office of offices) {
      try {
        const officeUrl = `https://api.aelf.org/v1/offices/${dateStr}/romain/${office}`;
        await fetch(officeUrl);
      } catch (error) {
        console.error(`Erreur lors du préchargement de l'office ${office} pour ${dateStr}:`, error);
      }
    }

    // Précharger les saints du jour
    try {
      const saintsUrl = `https://api.aelf.org/v1/informations/saints/${dateStr}/romain`;
      await fetch(saintsUrl);
    } catch (error) {
      console.error(`Erreur lors du préchargement des saints pour ${dateStr}:`, error);
    }
  }
}

// Précharger le contenu de la Bible
async function precacheBibleContent() {
  const bibleBooks = await fetch('/bible-books.json').then(res => res.json());
  
  for (const book of bibleBooks) {
    try {
      const bookUrl = `/bible/${book}.json`;
      await fetch(bookUrl);
    } catch (error) {
      console.error(`Erreur lors du préchargement du livre ${book}:`, error);
    }
  }
}

// Précharger le contenu lors de l'installation du service worker
self.addEventListener('install', (event) => {
  event.waitUntil(Promise.all([
    precacheUpcomingContent(),
    precacheBibleContent()
  ]));
});

// Précharger le contenu chaque jour à minuit
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'daily-sync') {
    event.waitUntil(precacheUpcomingContent());
  }
});

// Gestion des messages pour rafraîchir le cache
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'REFRESH_CACHE') {
    event.waitUntil(Promise.all([
      precacheUpcomingContent(),
      precacheBibleContent()
    ]));
  }
});

// Gérer les notifications push
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/placeholder-logo.png',
      badge: '/placeholder-logo.png',
      tag: 'lux-lectio-notification',
    };

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});