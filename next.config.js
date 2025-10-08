// Ce fichier est généré automatiquement pour remplacer next.config.mjs
// et permettre la compatibilité avec next-pwa (CommonJS)

const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/api\.aelf\.org\/.*$/,
      handler: "CacheFirst",
      options: {
        cacheName: "aelf-api",
        expiration: {
          maxEntries: 1000,
          maxAgeSeconds: 60 * 60 * 24 * 14,
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
    {
      urlPattern: /\/bible\/.*\.json$/,
      handler: "CacheFirst",
      options: {
        cacheName: "bible-content",
        expiration: {
          maxEntries: 200,
          maxAgeSeconds: 60 * 60 * 24 * 30,
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
    {
      urlPattern: /\.(?:png|jpg|jpeg|svg|gif)$/,
      handler: "CacheFirst",
      options: {
        cacheName: "images",
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 60 * 60 * 24 * 30,
        },
      },
    },
    {
      urlPattern: /\.(?:woff|woff2|ttf|otf|eot)$/,
      handler: "CacheFirst",
      options: {
        cacheName: "fonts",
        expiration: {
          maxEntries: 20,
          maxAgeSeconds: 60 * 60 * 24 * 365,
        },
      },
    },
    {
      urlPattern: /\.(?:js|css)$/,
      handler: "StaleWhileRevalidate",
      options: {
        cacheName: "static-resources",
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 60 * 60 * 24 * 7,
        },
      },
    },
  ],
});

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
};

module.exports = withPWA(nextConfig);
