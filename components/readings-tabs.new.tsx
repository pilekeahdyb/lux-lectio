"use client";

import React, { useState, useRef, useEffect } from "react";
import type { AelfReading } from "@/lib/api";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ReadingCard } from "@/components/reading-card";
import { 
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

const typeIcons: Record<string, string> = {
  'lecture_1': '📖',
  'lecture_2': '📖',
  'lecture_3': '📖',
  'lecture_4': '📖',
  'lecture_5': '📖',
  'lecture_6': '📖',
  'lecture_7': '📖',
  'epitre': '📖',
  'evangile': '📖',
  'psaume': '🎵',
  'cantique': '🎼',
  'alleluia': '🌟',
  'sequence': '🎵'
};

const typeNames: Record<string, string> = {
  'lecture_1': '1ère Lecture',
  'lecture_2': '2e Lecture',
  'lecture_3': '3e Lecture',
  'lecture_4': '4e Lecture',
  'lecture_5': '5e Lecture',
  'lecture_6': '6e Lecture',
  'lecture_7': '7e Lecture',
  'epitre': 'Épître',
  'evangile': 'Évangile',
  'psaume': 'Psaume',
  'cantique': 'Cantique',
  'alleluia': 'Alléluia',
  'sequence': 'Séquence'
};

interface ReadingsTabsProps {
  readings: AelfReading[];
  accentColor: string;
}

type ReadingGroup = {
  type: string;
  options: AelfReading[];
};

// Fonction pour normaliser les lectures et éviter les doublons
function normalizeReadings(readings: AelfReading[]): AelfReading[] {
  // Regrouper lectures et leurs psaumes/cantiques/séquences associés
  // Regroupement des lectures/psaumes/évangiles consécutifs du même type
  const result: any[] = [];
  const used = new Set();
  const lectureTypes = [
    'lecture_1', 'lecture_2', 'lecture_3', 'lecture_4', 'lecture_5', 'lecture_6', 'lecture_7', 'epitre', 'evangile'
  ];
  let psaumeAfter7 = false;
  let stop = false;
  let i = 0;
  while (i < readings.length && !stop) {
    if (used.has(i)) { i++; continue; }
    const reading = readings[i];
    if (lectureTypes.includes(reading.type || '') || ['psaume', 'cantique', 'sequence', 'alleluia'].includes(reading.type || '')) {
      // Regrouper les lectures/psaumes/évangiles consécutifs du même type
      const group = [reading];
      used.add(i);
      let j = i + 1;
      while (j < readings.length && readings[j].type === reading.type) {
        group.push(readings[j]);
        used.add(j);
        j++;
      }
      // Cas évangile : stop après
      if (reading.type === 'evangile') stop = true;
      // Cas lecture_7 : un seul psaume après
      if (reading.type === 'lecture_7') {
        let k = j;
        while (k < readings.length && readings[k].type === 'psaume') {
          if (!psaumeAfter7) {
            group.push(readings[k]);
            used.add(k);
            psaumeAfter7 = true;
          }
          k++;
        }
        i = k;
      } else {
        i = j;
      }
      result.push(group.length > 1 ? { type: reading.type, options: group } : group[0]);
    } else {
      i++;
    }
  }
  return result;
}

// 1. Ajout d'une fonction utilitaire pour obtenir le label du choix sélectionné
function getSelectedLabel(reading: AelfReading | ReadingGroup, selectedIdx: number) {
  if ('options' in reading) {
    const option = reading.options[selectedIdx];
    if (option.versions) {
      return selectedIdx === 0
        ? (option.versions.longue.titre || 'Version longue')
        : (option.versions.breve.titre || 'Version brève');
    }
    if (option.choix && option.choix.length > 0) {
      return option.choix[selectedIdx]?.titre || option.choix[selectedIdx]?.reference || `Option ${selectedIdx + 1}`;
    }
    return typeNames[option.type || 'lecture_1'] || 'Lecture';
  }
  if (reading.versions) {
    return selectedIdx === 0
      ? (reading.versions.longue.titre || 'Version longue')
      : (reading.versions.breve.titre || 'Version brève');
  }
  if (reading.choix && reading.choix.length > 0) {
    return reading.choix[selectedIdx]?.titre || reading.choix[selectedIdx]?.reference || `Option ${selectedIdx + 1}`;
  }
  return typeNames[reading.type || 'lecture_1'] || 'Lecture';
}

// Fonction utilitaire pour le label d'option
function getOptionLabel(option: AelfReading, idx: number, group?: AelfReading[]): string {
  if (option.versions) {
    return idx === 0 ? "Version longue" : "Version brève";
  }
  if (group && group.length === 2 && group[0].reference !== group[1].reference) {
    // Deux textes différents, on affiche la référence
    return option.reference || `Option ${idx + 1}`;
  }
  if (option.reference) return option.reference;
  return `Option ${idx + 1}`;
}

export function ReadingsTabs({ readings, accentColor }: ReadingsTabsProps) {
  const [tab, setTab] = useState("0");
  const [selectedVersions, setSelectedVersions] = useState<Record<number, number>>({});
  const listRef = useRef<HTMLDivElement>(null);
  const triggerRefs = useRef<(HTMLButtonElement | null)[]>([]);
  
  // Normaliser les lectures
  const normalizedReadings: (AelfReading | ReadingGroup)[] = normalizeReadings(readings);

  // Ajout du log pour debug API
  console.log('ReadingsTabs props.readings', readings);
  console.log('ReadingsTabs normalizedReadings', normalizedReadings);

  // Affichage d'un message d'erreur si aucune lecture n'est trouvée
  if (!readings || readings.length === 0 || !normalizedReadings || normalizedReadings.length === 0) {
    return (
      <div className="p-6 text-center text-red-600 bg-red-50 rounded-lg shadow">
        <h2 className="text-lg font-bold mb-2">Aucune lecture trouvée</h2>
        <p>Impossible de récupérer les lectures pour cette date. Essayez de changer de date ou réessayez plus tard.</p>
      </div>
    );
  }

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollLeft = 0;
    }
    // Réinitialiser les versions sélectionnées quand les lectures changent
    setSelectedVersions({});
  }, [readings]);

  useEffect(() => {
    if (tab !== "0" && triggerRefs.current[parseInt(tab)]) {
      // Désactivation du défilement automatique
      // triggerRefs.current[parseInt(tab)]?.scrollIntoView({ behavior: "smooth", inline: "center" });
    }
  }, [tab, readings]);

  const getButtonClasses = (isActive: boolean) => {
    const baseClasses = "px-3 py-1 rounded-lg font-medium flex items-center gap-1 transition-all duration-300 whitespace-nowrap flex-shrink-0 min-w-[115px] max-w-[115px] justify-between text-xs";
    return `${baseClasses} ${
      isActive 
        ? `bg-${accentColor}-500 text-white shadow-lg scale-105` 
        : `bg-white/50 dark:bg-black/20 border-${accentColor}-300 dark:border-${accentColor}-700 text-black dark:text-white`
    }`;
  };

  // Limite la largeur des boutons et tronque le texte
  const buttonWidth = 'w-[150px] md:w-[200px] max-w-[200px] truncate';

  // Remplace renderButton pour uniformiser le style et ajouter le chevron bas si Dropdown
  const renderButton = (reading: AelfReading, idx: number, onClick: () => void, selectedIdx = 0, hasOptions = false) => (
    <Button
      variant={tab === String(idx) ? "default" : "outline"}
      className={getButtonClasses(tab === String(idx)) + " w-[170px] md:w-[200px] max-w-[200px] px-4 py-2 rounded-lg font-semibold text-base md:text-sm flex items-center justify-between"}
      onClick={onClick}
      style={{ justifyContent: 'space-between' }}
    >
      <span className="flex items-center gap-2 overflow-hidden">
        <span className="text-lg md:text-base" style={{ fontFamily: 'Segoe UI Emoji, Apple Color Emoji, Noto Color Emoji, sans-serif' }}>
          {reading.type === 'sequence' ? typeIcons['sequence'] : typeIcons[reading.type || 'lecture_1']}
        </span>
        <span className="truncate">
          {typeNames[reading.type || 'lecture_1'] || 'Lecture'}
        </span>
      </span>
      {hasOptions && (
        <ChevronDown className="h-4 w-4 opacity-70 ml-1" />
      )}
    </Button>
  );

  return (
    <Tabs value={tab} onValueChange={setTab}>
      <div className="w-full overflow-x-auto scrollbar-thin no-scrollbar" style={{ WebkitOverflowScrolling: 'touch', scrollBehavior: 'smooth' }}>
        <TabsList
          ref={listRef}
          className={`flex flex-row gap-2 mb-2 rounded-lg shadow bg-${accentColor}-100 dark:bg-${accentColor}-900 border border-${accentColor}-500 p-1 min-w-max animate-navbar-tabs`}
          style={{ minWidth: 'max-content' }}
        >
          {normalizedReadings.map((item, idx) => {
            let selectedIdx = selectedVersions[idx] || 0;
            if ('options' in item) {
              // Cas ReadingGroup (plusieurs lectures du même type)
              const reading = item.options[selectedIdx] || item.options[0];
              const hasVersions = reading.versions !== undefined;
              const hasChoix = reading.choix && reading.choix.length > 0;
              return (
                <DropdownMenu key={idx}>
                  <DropdownMenuTrigger asChild>
                    {renderButton(reading, idx, () => setTab(String(idx)), selectedIdx, true)}
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="min-w-[180px]">
                    {item.options.map((option, optionIdx) => (
                        <DropdownMenuItem
                          key={optionIdx}
                          onSelect={() => {
                            setTab(String(idx));
                            setSelectedVersions(prev => ({ ...prev, [idx]: optionIdx }));
                          }}
                        className={selectedIdx === optionIdx ? 'bg-blue-100 dark:bg-blue-900 font-bold' : ''}
                        >
                        ✓ {getOptionLabel(option, optionIdx, item.options)}
                        </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              );
            } else {
              // Cas AelfReading
              const reading = item;
              const hasVersions = reading.versions !== undefined;
              const hasChoix = reading.choix && reading.choix.length > 0;
              if (hasVersions || hasChoix) {
                return (
                  <DropdownMenu key={idx}>
                    <DropdownMenuTrigger asChild>
                      {renderButton(reading, idx, () => setTab(String(idx)), selectedIdx, true)}
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="min-w-[180px]">
                      {hasVersions && [
                          <DropdownMenuItem 
                          key="longue"
                            onSelect={() => {
                              setTab(String(idx));
                              setSelectedVersions(prev => ({ ...prev, [idx]: 0 }));
                            }}
                          className={selectedIdx === 0 ? 'bg-blue-100 dark:bg-blue-900 font-bold' : ''}
                          >
                          ✓ Version longue
                          </DropdownMenuItem>,
                          <DropdownMenuItem 
                          key="breve"
                            onSelect={() => {
                              setTab(String(idx));
                              setSelectedVersions(prev => ({ ...prev, [idx]: 1 }));
                            }}
                          className={selectedIdx === 1 ? 'bg-blue-100 dark:bg-blue-900 font-bold' : ''}
                          >
                          ✓ Version brève
                          </DropdownMenuItem>
                      ]}
            {hasChoix && reading.choix!.map((option, optionIdx) => (
              <DropdownMenuItem
                key={optionIdx}
                onSelect={() => {
                  setTab(String(idx));
                  setSelectedVersions(prev => ({ ...prev, [idx]: optionIdx }));
                }}
                className={selectedIdx === optionIdx ? 'bg-blue-100 dark:bg-blue-900 font-bold' : ''}
              >
                ✓ {option.reference || `Option ${optionIdx + 1}`}
              </DropdownMenuItem>
            ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                );
              }
    // Cas simple : onglet normal - même style que les boutons avec options
    return (
      <Button
        key={idx}
        variant={tab === String(idx) ? "default" : "outline"}
        className={getButtonClasses(tab === String(idx)) + " w-[170px] md:w-[200px] max-w-[200px] px-4 py-2 rounded-lg font-semibold text-base md:text-sm flex items-center justify-between"}
        onClick={() => setTab(String(idx))}
        style={{ justifyContent: 'space-between' }}
      >
        <span className="flex items-center gap-2 overflow-hidden">
          <span className="text-lg md:text-base" style={{ fontFamily: 'Segoe UI Emoji, Apple Color Emoji, Noto Color Emoji, sans-serif' }}>
            {typeIcons[reading.type || 'lecture_1'] || '📄'}
          </span>
          <span className="truncate">
            {typeNames[reading.type || 'lecture_1'] || 'Lecture'}
          </span>
        </span>
      </Button>
    );
            }
          })}
        </TabsList>
      </div>

      {normalizedReadings.map((reading, idx) => {
        let selectedVersion = selectedVersions[idx] || 0;
        let displayReading: AelfReading;
        if ('options' in reading) {
          displayReading = reading.options[selectedVersion] || reading.options[0];
        } else {
          displayReading = reading;
        }
        if (displayReading.versions) {
          const version = selectedVersion === 0 ? displayReading.versions.longue : displayReading.versions.breve;
          displayReading = {
            ...displayReading,
            contenu: version.contenu,
            reference: version.reference,
            titre: version.titre
          };
        } else if (displayReading.choix && displayReading.choix.length > 0) {
          const choix = displayReading.choix[selectedVersion];
          displayReading = {
            ...displayReading,
            contenu: choix.contenu,
            titre: choix.titre,
            reference: choix.reference
          };
        }
        return (
          <TabsContent key={idx} value={String(idx)} className="animate-slide-in-right">
            <ReadingCard reading={displayReading} />
          </TabsContent>
        );
      })}
    </Tabs>
  );
}
