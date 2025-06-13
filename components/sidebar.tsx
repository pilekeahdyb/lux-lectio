"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Book, Clock, BookOpen, User, Info, Settings, Heart, Menu, X, Calendar, Cross, Sun, Moon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLiturgical } from "@/components/liturgical-provider"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Lectures du jour", href: "/", icon: Book },
  { name: "Offices des heures", href: "/offices", icon: Clock },
  { name: "Bible", href: "/bible", icon: BookOpen },
  { name: "Saints du jour", href: "/saints", icon: User },
  { name: "À propos", href: "/about", icon: Info },
  { name: "Paramètres", href: "/settings", icon: Settings },
  { name: "Soutenir", href: "/support", icon: Heart },
]

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const { liturgicalData, liturgicalColor } = useLiturgical()
  const { theme, setTheme } = useTheme()

  const formatLiturgicalDate = (date: Date) => {
    return date.toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
    })
  }

  const getLiturgicalColorName = (color: string) => {
    const colorNames = {
      vert: "Temps ordinaire",
      violet: "Avent / Carême",
      rouge: "Martyrs / Pentecôte",
      blanc: "Fêtes du Seigneur",
      rose: "Joie tempérée",
      noir: "Deuil",
    }
    return colorNames[color as keyof typeof colorNames] || "Temps ordinaire"
  }

  // Obtenir la couleur du logo selon la couleur liturgique
  const getLogoColor = (liturgicalColor: string) => {
    switch (liturgicalColor) {
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
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-lg hover-lift"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-80 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-full flex-col bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-r border-liturgical-primary/20 shadow-2xl">
          {/* Header avec logo coloré selon la liturgie */}
          <div className="relative overflow-hidden">
            {/* Fond blanc/gris au lieu du gradient coloré */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-slate-800 dark:via-slate-700 dark:to-slate-600"></div>
            <div className="relative p-6">
              <div className="text-center">
                <div className="flex items-center justify-center mb-3 animate-float">
                  {/* Logo avec couleur liturgique */}
                  <Cross className={`h-10 w-10 mr-3 drop-shadow-lg ${getLogoColor(liturgicalColor)}`} />
                  <h1 className={`text-2xl font-bold drop-shadow-lg ${getLogoColor(liturgicalColor)}`}>Lux Lectio</h1>
                </div>
                <p className="text-sm opacity-90 drop-shadow text-gray-600 dark:text-gray-300">Compagnon liturgique</p>
                <div className="mt-3 flex items-center justify-center space-x-2">
                  <div
                    className={`w-2 h-2 rounded-full animate-pulse ${getLogoColor(liturgicalColor).replace("text-", "bg-")}`}
                  ></div>
                  <div
                    className={`w-2 h-2 rounded-full animate-pulse ${getLogoColor(liturgicalColor).replace("text-", "bg-")}`}
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                  <div
                    className={`w-2 h-2 rounded-full animate-pulse ${getLogoColor(liturgicalColor).replace("text-", "bg-")}`}
                    style={{ animationDelay: "0.4s" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Date liturgique avec design amélioré */}
          {liturgicalData && (
            <div className="p-4 border-b border-liturgical-primary/20 liturgical-card mx-4 my-2 rounded-xl animate-slide-in-right">
              <div className="flex items-center text-sm text-liturgical-text mb-2">
                <Calendar className="h-4 w-4 mr-2" />
                {formatLiturgicalDate(new Date())}
              </div>
              <p className="text-xs font-medium text-gray-800 dark:text-gray-200 mb-2">
                {liturgicalData.informations.jour_liturgique_nom}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div
                    className={cn(
                      "w-4 h-4 rounded-full mr-2 shadow-lg animate-pulse-glow",
                      liturgicalColor === "vert" && "bg-green-500",
                      liturgicalColor === "violet" && "bg-purple-500",
                      liturgicalColor === "rouge" && "bg-red-500",
                      liturgicalColor === "blanc" && "bg-blue-500",
                      liturgicalColor === "rose" && "bg-pink-500",
                      liturgicalColor === "noir" && "bg-gray-500",
                    )}
                  />
                  <span className="text-xs capitalize text-liturgical-text font-medium">
                    {getLiturgicalColorName(liturgicalColor)}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="h-6 w-6 hover-glow"
                >
                  {theme === "dark" ? <Sun className="h-3 w-3" /> : <Moon className="h-3 w-3" />}
                </Button>
              </div>
            </div>
          )}

          {/* Navigation avec animations */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navigation.map((item, index) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 hover-lift group",
                    isActive
                      ? "bg-liturgical-primary text-white shadow-lg animate-pulse-glow"
                      : "text-gray-700 dark:text-gray-300 hover:bg-liturgical-primary/10 hover:text-liturgical-primary",
                  )}
                  onClick={() => setIsOpen(false)}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <item.icon
                    className={cn("h-5 w-5 mr-3 transition-transform duration-300", "group-hover:scale-110")}
                  />
                  {item.name}
                  {isActive && <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse"></div>}
                </Link>
              )
            })}
          </nav>

          {/* Footer avec design amélioré */}
          <div className="p-4 border-t border-liturgical-primary/20">
            <div className="liturgical-card p-3 rounded-xl text-center animate-slide-in-left">
              <p className="text-xs text-liturgical-text">
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

      {/* Overlay for mobile avec animation */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm md:hidden animate-scale-in"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
