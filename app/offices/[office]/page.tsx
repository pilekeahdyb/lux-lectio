
"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { OfficeCarousel } from "@/components/office-carousel"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const officeLabels: Record<string, string> = {
  lectures: "Office des lectures",
  laudes: "Laudes",
  tierce: "Tierce",
  sexte: "Sexte",
  none: "None",
  vepres: "Vêpres",
  complies: "Complies"
}


import * as React from "react"

export default function OfficePage({ params }: { params: Promise<{ office: string }> }) {
  const { office } = React.use(params)
  const router = useRouter()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    fetch(`/api/aelf/offices?office=${office}&date=${new Date().toISOString().slice(0,10)}`)
      .then(async res => {
        if (!res.ok) throw new Error((await res.json()).error || res.statusText)
        return res.json()
      })
      .then(setData)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [office])

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-liturgical-primary mb-2">{officeLabels[office] || office}</h1>
      {loading && <Card><CardContent className="p-8 text-center">Chargement...</CardContent></Card>}
      {error && <Card><CardContent className="p-8 text-center text-red-600">{error}</CardContent></Card>}
      {!loading && !error && data && (
        <OfficeCarousel data={data} onClose={() => router.push('/offices')} />
      )}
    </div>
  )
}
