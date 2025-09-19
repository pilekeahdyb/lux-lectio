"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Book, Clock, BookOpen, User, Info, Settings, Heart, Menu, X, Calendar, Cross, Sun, Moon, Database } from "lucide-react"
import { CalendarWidget } from "./calendar-widget"
import { Button } from "@/components/ui/button"
import { useLiturgical } from "@/components/liturgical-provider"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"

// Navigation items (à adapter selon vos routes réelles)
const navigation = [
  { name: "Messes", href: "/", icon: BookOpen },
  { name: "Offices", href: "/offices", icon: Clock },
  { name: "Bible", href: "/bible", icon: Book },
  { name: "Saints", href: "/saints", icon: User },
  { name: "Stockage", href: "/storage", icon: Database },
  { name: "À propos", href: "/about", icon: Info },
  { name: "Paramètres", href: "/settings", icon: Settings },
  { name: "Support", href: "/support", icon: Heart },
]

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const [showCalendar, setShowCalendar] = useState(false)
  const { setCurrentDate } = useLiturgical()
  const pathname = usePathname()
  const { liturgicalData, liturgicalColor } = useLiturgical()
  const { theme, setTheme } = useTheme()

  const { currentDate } = useLiturgical()
  const formatLiturgicalDate = (date: Date) =>
    date.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })

  const getLiturgicalColorName = (color: string) => {
    const colorNames: Record<string, string> = {
      vert: "Temps ordinaire",
      violet: "Avent / Carême",
      rouge: "Martyrs / Pentecôte",
      blanc: "Fêtes du Seigneur",
      rose: "Joie tempérée",
      noir: "Deuil",
    }
    return colorNames[color] || "Temps ordinaire"
  }

  const getLogoColor = (color: string) => {
    switch (color) {
      case "vert":
        return "text-green-500"
      case "violet":
        return "text-purple-500"
      case "rouge":
        return "text-red-500"
      case "blanc":
        return "text-blue-500"
      case "rose":
        return "text-pink-500"
      case "noir":
        return "text-gray-500"
      default:
        return "text-green-500"
    }
  }

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-3 left-3 z-50 md:hidden bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-lg hover-lift tap-target"
        onClick={() => setIsOpen((v) => !v)}
        aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
      >
        {isOpen ? <X className="h-5 w-5 sm:h-6 sm:w-6" /> : <Menu className="h-5 w-5 sm:h-6 sm:w-6" />}
      </Button>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-72 sm:w-80 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-full flex-col bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-r border-liturgical-primary/20 shadow-2xl">
          {/* En-tête avec logo et titre uniquement */}
          <div className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-slate-800 dark:via-slate-700 dark:to-slate-600" />
            <div className="relative p-4 sm:p-6">
              <div className="text-center">
                <div className="flex items-center justify-center mb-3 animate-float">
                  <Cross
                    className={`h-8 w-8 sm:h-10 sm:w-10 mr-2 sm:mr-3 drop-shadow-lg ${getLogoColor(liturgicalColor)}`}
                  />
                  <h1 className={`text-xl sm:text-2xl font-bold drop-shadow-lg ${getLogoColor(liturgicalColor)}`}>
                    Lux Lectio
                  </h1>
                </div>
                <p className="text-xs sm:text-sm opacity-90 drop-shadow text-gray-600 dark:text-gray-300">
                  Compagnon liturgique
                </p>
                <div className="mt-3 flex items-center justify-center space-x-2">
                  {[0, 0.2, 0.4].map((delay) => (
                    <div
                      key={delay}
                      className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full animate-pulse ${getLogoColor(liturgicalColor).replace("text-", "bg-")}`}
                      style={{ animationDelay: `${delay}s` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Date liturgique + icône calendrier */}
          {liturgicalData && (
            <div className="p-3 sm:p-4 border-b border-liturgical-primary/20 liturgical-card mx-3 sm:mx-4 my-2 rounded-xl animate-slide-in-right">
              <div className="flex items-center text-xs sm:text-sm text-liturgical-text mb-2">
                <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-2 flex-shrink-0" />
                <span className="truncate flex-1">{formatLiturgicalDate(currentDate)}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-2 hover:bg-liturgical-primary/10 h-6 w-6 sm:h-7 sm:w-7 flex-shrink-0"
                  aria-label="Afficher le calendrier"
                  onClick={() => setShowCalendar((v) => !v)}
                >
                  <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-liturgical-primary" />
                </Button>
              </div>
              <p className="text-xs font-medium text-gray-800 dark:text-gray-200 mb-2 leading-tight">
                {liturgicalData.informations.jour_liturgique_nom}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center flex-1 min-w-0">
                  <div
                    className={cn(
                      "w-3 h-3 sm:w-4 sm:h-4 rounded-full mr-2 shadow-lg animate-pulse-glow flex-shrink-0",
                      liturgicalColor === "vert" && "bg-green-500",
                      liturgicalColor === "violet" && "bg-purple-500",
                      liturgicalColor === "rouge" && "bg-red-500",
                      liturgicalColor === "blanc" && "bg-blue-500",
                      liturgicalColor === "rose" && "bg-pink-500",
                      liturgicalColor === "noir" && "bg-gray-500",
                    )}
                  />
                  <span className="text-xs capitalize text-liturgical-text font-medium truncate">
                    {getLiturgicalColorName(liturgicalColor)}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="h-6 w-6 hover-glow flex-shrink-0"
                  aria-label="Changer le thème"
                >
                  {theme === "dark" ? <Sun className="h-3 w-3" /> : <Moon className="h-3 w-3" />}
                </Button>
              </div>
            </div>
          )}

          {/* Calendrier affiché si showCalendar */}
          {showCalendar && (
            <div className="p-3 sm:p-4 animate-scale-in">
              <CalendarWidget
                onDateSelected={(date) => {
                  setCurrentDate(date)
                  setShowCalendar(false)
                }}
              />
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 p-3 sm:p-4 space-y-1 sm:space-y-2 overflow-y-auto touch-scroll">
            {navigation.map((item, index) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-medium rounded-xl transition-all duration-300 hover-lift group tap-target",
                    isActive
                      ? "bg-liturgical-primary text-white shadow-lg animate-pulse-glow"
                      : "text-gray-700 dark:text-gray-300 hover:bg-liturgical-primary/10 hover:text-liturgical-primary",
                  )}
                  onClick={() => setIsOpen(false)}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <item.icon
                    className={cn(
                      "h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 transition-transform duration-300 flex-shrink-0",
                      "group-hover:scale-110",
                    )}
                  />
                  <span className="truncate">{item.name}</span>
                  {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full animate-pulse flex-shrink-0"></div>
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="p-3 sm:p-4 border-t border-liturgical-primary/20">
            <div className="liturgical-card p-2 sm:p-3 rounded-xl text-center animate-slide-in-left">
              <p className="text-xs text-liturgical-text leading-tight">
                Développé avec ❤️ par
                <br />
                <span className="font-semibold text-liturgical-primary">AHOUFACK Dylanne Baudouin</span>
                <br />
                <span className="text-xs opacity-75">Ing. Génie Logiciel</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm md:hidden animate-scale-in"
          onClick={() => setIsOpen(false)}
          onTouchStart={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
