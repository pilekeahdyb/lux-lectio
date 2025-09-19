import { withServiceWorker } from "next-pwa";

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Configuration du PWA
  pwa: {
    dest: "public",
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV === "development",
    runtimeCaching: [
      {
        // Cache les réponses de l'API AELF
        urlPattern: /^https:\/\/api\.aelf\.org\/.*$/,
        handler: "CacheFirst",
        options: {
          cacheName: "aelf-api",
          expiration: {
            maxEntries: 1000, // Augmenté pour supporter plus de contenu
            maxAgeSeconds: 60 * 60 * 24 * 14, // 14 jours
          },
          cacheableResponse: {
            statuses: [0, 200],
          },
        },
      },
      {
        // Cache les fichiers JSON de la Bible
        urlPattern: /\/bible\/.*\.json$/,
        handler: "CacheFirst",
        options: {
          cacheName: "bible-content",
          expiration: {
            maxEntries: 200, // Augmenté pour plus de livres bibliques
            maxAgeSeconds: 60 * 60 * 24 * 30, // 30 jours
          },
          cacheableResponse: {
            statuses: [0, 200],
          },
        },
      },
      {
        // Cache les images
        urlPattern: /\.(?:png|jpg|jpeg|svg|gif)$/,
        handler: "CacheFirst",
        options: {
          cacheName: "images",
          expiration: {
            maxEntries: 50,
            maxAgeSeconds: 60 * 60 * 24 * 30, // 30 jours
          },
        },
      },
      {
        // Cache les polices
        urlPattern: /\.(?:woff|woff2|ttf|otf|eot)$/,
        handler: "CacheFirst",
        options: {
          cacheName: "fonts",
          expiration: {
            maxEntries: 20,
            maxAgeSeconds: 60 * 60 * 24 * 365, // 1 an
          },
        },
      },
      {
        // Cache les styles et scripts
        urlPattern: /\.(?:js|css)$/,
        handler: "StaleWhileRevalidate",
        options: {
          cacheName: "static-resources",
          expiration: {
            maxEntries: 100,
            maxAgeSeconds: 60 * 60 * 24 * 7, // 7 jours
          },
        },
      }
    ],
  },
};

export default withServiceWorker(nextConfig);
