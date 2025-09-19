"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { RefreshCw, Database, Wifi, WifiOff } from "lucide-react";

interface CacheInfo {
  name: string;
  size: number;
  maxSize: number;
  entries: number;
  maxEntries: number;
}

export function CacheStatus() {
  const [cacheInfo, setCacheInfo] = useState<CacheInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  const updateCacheInfo = async () => {
    setIsLoading(true);
    try {
      const caches = await window.caches.keys();
      const info = await Promise.all(
        caches.map(async (name) => {
          const cache = await window.caches.open(name);
          const keys = await cache.keys();
          // Estimation de la taille (approximative)
          const size = keys.length * 50 * 1024; // 50KB par entrée en moyenne
          const maxSize = name.includes('bible') ? 100 * 1024 * 1024 : 50 * 1024 * 1024; // 100MB pour la Bible, 50MB pour le reste
          
          return {
            name,
            size,
            maxSize,
            entries: keys.length,
            maxEntries: name.includes('bible') ? 200 : 1000
          };
        })
      );
      setCacheInfo(info);
    } catch (error) {
      console.error('Erreur lors de la récupération des infos du cache:', error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    updateCacheInfo();
    
    // Mise à jour du statut en ligne/hors-ligne
    const updateOnlineStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    
    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  const clearCache = async () => {
    setIsLoading(true);
    try {
      const caches = await window.caches.keys();
      await Promise.all(caches.map(name => window.caches.delete(name)));
      await updateCacheInfo();
    } catch (error) {
      console.error('Erreur lors de la suppression du cache:', error);
    }
    setIsLoading(false);
  };

  const refreshCache = async () => {
    setIsLoading(true);
    try {
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        // Demander au service worker de recharger le contenu
        navigator.serviceWorker.controller.postMessage({
          type: 'REFRESH_CACHE'
        });
      }
      await updateCacheInfo();
    } catch (error) {
      console.error('Erreur lors du rafraîchissement du cache:', error);
    }
    setIsLoading(false);
  };

  const formatSize = (bytes: number) => {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">État du stockage hors-ligne</h2>
        <div className="flex items-center gap-2">
          {isOnline ? (
            <div className="flex items-center gap-1 text-green-500">
              <Wifi className="h-4 w-4" />
              <span>En ligne</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-yellow-500">
              <WifiOff className="h-4 w-4" />
              <span>Hors-ligne</span>
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-4">
        {cacheInfo.map((cache) => (
          <Card key={cache.name} className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4" />
                <h3 className="font-semibold">{cache.name}</h3>
              </div>
              <span className="text-sm text-muted-foreground">
                {formatSize(cache.size)} / {formatSize(cache.maxSize)}
              </span>
            </div>
            <Progress
              value={(cache.size / cache.maxSize) * 100}
              className="h-2"
            />
            <div className="flex justify-between mt-2 text-sm text-muted-foreground">
              <span>{cache.entries} entrées</span>
              <span>Max: {cache.maxEntries}</span>
            </div>
          </Card>
        ))}
      </div>

      <div className="flex justify-end gap-4 mt-6">
        <Button
          variant="outline"
          onClick={clearCache}
          disabled={isLoading}
        >
          Vider le cache
        </Button>
        <Button
          onClick={refreshCache}
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Rafraîchir le cache
        </Button>
      </div>
    </div>
  );
}