"use client";

import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface PWAHookReturn {
  isOnline: boolean;
  canInstall: boolean;
  isInstalled: boolean;
  deferredPrompt: BeforeInstallPromptEvent | null;
  installApp: () => Promise<void>;
}

export function usePWA(): PWAHookReturn {
  const [isOnline, setIsOnline] = useState(true);
  const [canInstall, setCanInstall] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    // Vérifier si l'application est déjà installée
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    setIsInstalled(isStandalone);

    // Gérer l'état de la connexion
    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine);
      if (navigator.onLine) {
        // Synchroniser le contenu si on est de nouveau en ligne
        if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
          navigator.serviceWorker.controller.postMessage({ type: 'SYNC_CONTENT' });
        }
      }
    };

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    // Capturer l'événement d'installation
    window.addEventListener('beforeinstallprompt', (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setCanInstall(true);
    });

    // Détecter quand l'app est installée
    window.addEventListener('appinstalled', () => {
      setCanInstall(false);
      setIsInstalled(true);
      setDeferredPrompt(null);
    });

    // Enregistrer le service worker si possible
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('Service Worker enregistré avec succès:', registration);

          // Demander la permission pour les notifications
          if ('Notification' in window) {
            Notification.requestPermission().then((permission) => {
              if (permission === 'granted') {
                console.log('Notifications activées');
              }
            });
          }

          // Configurer la synchronisation périodique
          if ('periodicSync' in registration) {
            const periodicSync = registration.periodicSync as any;
            periodicSync
              .register('daily-sync', {
                minInterval: 24 * 60 * 60 * 1000, // Une fois par jour
              })
              .catch(console.error);
          }
        })
        .catch((error) => {
          console.error('Erreur lors de l\'enregistrement du Service Worker:', error);
        });
    }

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  const installApp = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        console.log('Application installée avec succès');
      }
      setDeferredPrompt(null);
    }
  };

  return {
    isOnline,
    canInstall,
    isInstalled,
    deferredPrompt,
    installApp,
  };
}