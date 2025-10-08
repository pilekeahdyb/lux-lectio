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
                },
              },
            },
          ],
        });
        
        module.exports = withPWA;
