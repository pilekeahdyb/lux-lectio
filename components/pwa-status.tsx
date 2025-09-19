"use client";

import { usePWA } from "@/lib/hooks/use-pwa";
import { Button } from "@/components/ui/button";
import { Wifi, WifiOff, Download } from "lucide-react";

export function PWAStatus() {
  const { isOnline, canInstall, installApp } = usePWA();

  return (
    <div className="fixed bottom-4 right-4 flex items-center gap-2">
      {!isOnline && (
        <div className="bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
          <WifiOff className="h-4 w-4" />
          <span className="text-sm">Mode hors-ligne</span>
        </div>
      )}

      {isOnline && (
        <div className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
          <Wifi className="h-4 w-4" />
          <span className="text-sm">Connecté</span>
        </div>
      )}

      {canInstall && (
        <Button
          variant="default"
          className="shadow-lg flex items-center gap-2"
          onClick={installApp}
        >
          <Download className="h-4 w-4" />
          <span>Installer l&apos;application</span>
        </Button>
      )}
    </div>
  );
}