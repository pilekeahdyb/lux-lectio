"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, RefreshCw, Share2, Heart, CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useLiturgical } from "@/components/liturgical-provider"
import { CalendarWidget } from "@/components/calendar-widget"
import { ReadingCard } from "@/components/reading-card"

export default function HomePage() {
  const { currentDate, liturgicalData, loading, error, setCurrentDate, refreshData } = useLiturgical()
  const [favorites, setFavorites] = useState<string[]>([])
  const [showCalendar, setShowCalendar] = useState(false)

  const formatDate = (date: Date) => {
    return date.toISOString().split("T")[0]
  }

  const formatLiturgicalDate = (date: Date) => {
    return date.toLocaleDateString("fr-FR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const navigateDate = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate)
    newDate.setDate(newDate.getDate() + (direction === "next" ? 1 : -1))
    setCurrentDate(newDate)
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  const toggleFavorite = () => {
    const dateStr = formatDate(currentDate)
    const newFavorites = favorites.includes(dateStr) ? favorites.filter((d) => d !== dateStr) : [...favorites, dateStr]

    setFavorites(newFavorites)
    localStorage.setItem("lux-lectio-favorites", JSON.stringify(newFavorites))
  }

  const shareReading = async () => {
    if (navigator.share && liturgicalData) {
      try {
        await navigator.share({
          title: `Lux Lectio - ${liturgicalData.messes?.[0]?.nom || "Lectures du jour"}`,
          text: `Lectures du ${formatLiturgicalDate(currentDate)}`,
          url: window.location.href,
        })
      } catch (err) {
        console.log("Partage annulé")
      }
    }
  }

  // Vérifier si la date est dans les favoris
  const isFavorite = favorites.includes(formatDate(currentDate))

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-liturgical-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement des lectures du jour...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full p-6">
        <Card className="max-w-md liturgical-card">
          <CardContent className="p-6 text-center">
            <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
            <p className="text-sm text-muted-foreground mb-4">
              Impossible de récupérer les données depuis l'API AELF. Vérifiez votre connexion internet.
            </p>
            <Button onClick={refreshData} variant="outline" className="hover-lift">
              <RefreshCw className="h-4 w-4 mr-2" />
              Réessayer
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Récupérer les lectures depuis la structure AELF
  const readings = liturgicalData?.messes?.[0]?.lectures || []

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header avec navigation */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 space-y-4 lg:space-y-0">
        <div className="flex items-center space-x-4 animate-slide-in-left">
          <Button variant="outline" size="sm" onClick={() => navigateDate("prev")} className="hover-lift">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="text-center">
            <h1 className="text-2xl lg:text-3xl font-bold text-liturgical-primary">
              {formatLiturgicalDate(currentDate)}
            </h1>
            <div className="flex items-center space-x-2 mt-1">
              <Button variant="ghost" size="sm" onClick={goToToday} className="hover-glow">
                Aujourd'hui
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setShowCalendar(!showCalendar)} className="hover-glow">
                <CalendarIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => navigateDate("next")} className="hover-lift">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center space-x-2 animate-slide-in-right">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleFavorite}
            className={`hover-glow ${isFavorite ? "text-red-500" : ""}`}
          >
            <Heart className={`h-5 w-5 ${isFavorite ? "fill-current" : ""}`} />
          </Button>
          <Button variant="ghost" size="icon" onClick={shareReading} className="hover-glow">
            <Share2 className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={refreshData} className="hover-glow">
            <RefreshCw className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendrier (optionnel) */}
        {showCalendar && (
          <div className="lg:col-span-1 animate-slide-in-left">
            <CalendarWidget />
          </div>
        )}

        {/* Contenu principal */}
        <div className={`${showCalendar ? "lg:col-span-3" : "lg:col-span-4"}`}>
          {liturgicalData && (
            <div className="space-y-6">
              {/* Informations liturgiques */}
              <Card className="liturgical-card hover-lift animate-scale-in">
                <CardHeader className="bg-gradient-to-r from-liturgical-primary/10 to-liturgical-accent/10">
                  <div className="flex items-center justify-between">
                    <Badge
                      variant="secondary"
                      className="bg-liturgical-primary/20 text-liturgical-primary animate-pulse-glow"
                    >
                      {liturgicalData.informations?.jour_liturgique_nom || "Temps liturgique"}
                    </Badge>
                    {isFavorite && (
                      <Badge variant="outline" className="text-red-500 border-red-500 animate-pulse">
                        ♥ Favori
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-xl text-center text-liturgical-primary">
                    {liturgicalData.messes?.[0]?.nom || "Messe du jour"}
                  </CardTitle>
                </CardHeader>
              </Card>

              {/* Lectures */}
              {readings.length > 0 ? (
                readings.map((reading: any, index: number) => {
                  // Déterminer le type de lecture
                  const readingType = reading.type as "lecture_1" | "psaume" | "lecture_2" | "evangile"

                  // Ne pas afficher les types inconnus
                  if (!["lecture_1", "psaume", "lecture_2", "evangile"].includes(readingType)) {
                    return null
                  }

                  return (
                    <ReadingCard key={index} reading={reading} type={readingType} className="animate-slide-in-right" />
                  )
                })
              ) : (
                <Card className="liturgical-card">
                  <CardContent className="p-8 text-center">
                    <p className="text-muted-foreground">Aucune lecture disponible pour cette date.</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      L'API AELF pourrait être temporairement indisponible.
                    </p>
                    <Button onClick={refreshData} variant="outline" className="mt-4 hover-lift">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Réessayer
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
