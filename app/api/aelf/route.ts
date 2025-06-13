import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const date = searchParams.get("date") || new Date().toISOString().split("T")[0]
  const zone = searchParams.get("zone") || "france"

  try {
    console.log(`Récupération des lectures AELF pour ${date}`)

    // Endpoint principal AELF
    const endpoint = `https://api.aelf.org/v1/messes/${date}/${zone}`

    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "User-Agent": "LuxLectio/1.0 (Application liturgique)",
        Referer: "https://www.aelf.org/",
      },
      next: { revalidate: 3600 }, // Cache d'une heure
    })

    if (!response.ok) {
      throw new Error(`Erreur API AELF: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()

    // Normalisation des données pour notre application
    const normalizedData = {
      informations: {
        date,
        jour_liturgique_nom: data.informations?.jour_liturgique_nom || "Jour liturgique",
        couleur: data.informations?.couleur || "vert",
        temps_liturgique: data.informations?.temps_liturgique || "ordinaire",
        semaine: data.informations?.semaine || "",
      },
      messes: data.messes || [],
      lectures: {},
    }

    // Extraction des lectures pour faciliter l'accès
    if (normalizedData.messes[0]?.lectures) {
      normalizedData.messes[0].lectures.forEach((lecture: any) => {
        if (lecture.type) {
          normalizedData.lectures[lecture.type] = lecture
        }
      })
    }

    return NextResponse.json(normalizedData, {
      headers: {
        "Cache-Control": "public, max-age=3600",
      },
    })
  } catch (error) {
    console.error("Erreur lors de la récupération des lectures:", error)

    // En cas d'erreur, essayer un endpoint alternatif
    try {
      const alternativeEndpoint = `https://www.aelf.org/api/v1/messes/${date}`

      const alternativeResponse = await fetch(alternativeEndpoint, {
        headers: {
          Accept: "application/json",
          "User-Agent": "LuxLectio/1.0",
        },
      })

      if (alternativeResponse.ok) {
        const alternativeData = await alternativeResponse.json()

        // Normalisation des données alternatives
        const normalizedData = {
          informations: {
            date,
            jour_liturgique_nom: alternativeData.nom || "Jour liturgique",
            couleur: alternativeData.couleur || "vert",
            temps_liturgique: alternativeData.temps_liturgique || "ordinaire",
          },
          messes: alternativeData.messes || [],
          lectures: {},
        }

        // Extraction des lectures
        if (normalizedData.messes[0]?.lectures) {
          normalizedData.messes[0].lectures.forEach((lecture: any) => {
            if (lecture.type) {
              normalizedData.lectures[lecture.type] = lecture
            }
          })
        }

        return NextResponse.json(normalizedData)
      }
    } catch (alternativeError) {
      console.error("Erreur avec l'endpoint alternatif:", alternativeError)
    }

    // Si tout échoue, renvoyer une erreur
    return NextResponse.json(
      {
        error: "Impossible de récupérer les lectures liturgiques",
        message: "Veuillez consulter directement le site AELF.org",
      },
      { status: 503 },
    )
  }
}
