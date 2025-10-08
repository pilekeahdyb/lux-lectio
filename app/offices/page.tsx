"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const offices = [
  { id: "lectures", name: "Office des lectures", time: "Nuit", description: "Prière de la nuit avec lectures patristiques" },
  { id: "laudes", name: "Laudes", time: "Matin", description: "Prière du matin, louange de l'aurore" },
  { id: "tierce", name: "Tierce", time: "9h", description: "Prière de la troisième heure" },
  { id: "sexte", name: "Sexte", time: "12h", description: "Prière de la sixième heure" },
  { id: "none", name: "None", time: "15h", description: "Prière de la neuvième heure" },
  { id: "vepres", name: "Vêpres", time: "Soir", description: "Prière du soir, action de grâce" },
  { id: "complies", name: "Complies", time: "Nuit", description: "Prière avant le repos nocturne" },
]

export default function OfficesPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-liturgical-primary mb-2">Offices des heures</h1>
        <p className="text-muted-foreground">La prière de l'Église pour sanctifier les heures du jour</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {offices.map((office) => (
          <Link key={office.id} href={`/offices/${office.id}`} passHref legacyBehavior>
            <Card className="cursor-pointer hover:shadow-lg transition-shadow border-liturgical-primary/20 hover:border-liturgical-primary/40">
              <CardHeader className="text-center">
                <CardTitle className="text-liturgical-primary">{office.name}</CardTitle>
                <Badge variant="secondary" className="mx-auto">
                  {office.time}
                </Badge>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-center text-muted-foreground">{office.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
