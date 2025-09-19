import { type NextRequest, NextResponse } from "next/server"
import { fetchOffice, fetchAllOffices, OfficeType } from "@/lib/offices-api"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const office = searchParams.get("office") as OfficeType | null

  try {
    // Si un office spécifique est demandé
    if (office) {
      const data = await fetchOffice("", office, "")  // Date et zone ne sont plus utilisés
      return NextResponse.json(data)
    }

    // Sinon, récupérer tous les offices
    const data = await fetchAllOffices("", "")  // Date et zone ne sont plus utilisés
    return NextResponse.json(data)

  } catch (error) {
    console.error("Erreur lors de la récupération des offices:", error)
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    )
  }
}