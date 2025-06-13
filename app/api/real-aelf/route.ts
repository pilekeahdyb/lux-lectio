import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const date = searchParams.get("date") || new Date().toISOString().split("T")[0]

  console.log(`🔍 Tentative de connexion RÉELLE à l'API AELF pour ${date}`)

  try {
    // Endpoints AELF réels identifiés par le diagnostic
    const realEndpoints = [
      // Endpoints principaux AELF (à ajuster selon les résultats du diagnostic)
      `https://api.aelf.org/v1/messes/${date}`,
      `https://api.aelf.org/v1/messes/${date}/france`,
      `https://api.aelf.org/v1/informations/messe/${date}`,

      // Endpoints alternatifs
      `https://www.aelf.org/api/v1/messes/${date}`,
      `https://api.aelf.org/messes/${date}`,
    ]

    for (const endpoint of realEndpoints) {
      try {
        console.log(`📡 Test endpoint réel: ${endpoint}`)

        const response = await fetch(endpoint, {
          method: "GET",
          headers: {
            Accept: "application/json, text/html, */*",
            "User-Agent": "Mozilla/5.0 (compatible; LuxLectio/1.0; +https://luxlectio.app)",
            Referer: "https://www.aelf.org/",
            "Accept-Language": "fr-FR,fr;q=0.9",
            "Cache-Control": "no-cache",
          },
          signal: AbortSignal.timeout(15000),
        })

        console.log(`📊 ${endpoint} -> ${response.status} ${response.statusText}`)

        if (response.ok) {
          const contentType = response.headers.get("content-type") || ""

          if (contentType.includes("application/json")) {
            const data = await response.json()
            console.log(`✅ DONNÉES RÉELLES RÉCUPÉRÉES de ${endpoint}`)
            console.log(`📊 Structure:`, Object.keys(data))

            // Log détaillé pour vérifier la structure
            if (data.messes && data.messes[0] && data.messes[0].lectures) {
              console.log(`📚 ${data.messes[0].lectures.length} lectures trouvées:`)
              data.messes[0].lectures.forEach((lecture, i) => {
                console.log(`  ${i + 1}. ${lecture.type} - ${lecture.titre?.substring(0, 50)}`)
              })
            }

            // Retourner les données RÉELLES sans modification excessive
            return NextResponse.json(
              {
                source: "AELF_API_REAL",
                endpoint: endpoint,
                date: date,
                data: data,
                // Normalisation minimale pour compatibilité
                informations: data.informations || {
                  date: date,
                  jour_liturgique_nom: data.nom || "Jour liturgique",
                  couleur: data.couleur || "vert",
                },
                messes: data.messes || [],
                lectures: extractLectures(data),
              },
              {
                headers: {
                  "Cache-Control": "public, max-age=1800",
                  "X-Data-Source": "AELF-API-REAL",
                  "X-Endpoint": endpoint,
                },
              },
            )
          }
        }
      } catch (endpointError) {
        console.log(`❌ Erreur avec ${endpoint}:`, endpointError)
      }
    }

    // Si aucun endpoint API ne fonctionne, essayer le scraping
    console.log("🌐 Tentative de scraping AELF.org...")

    const scrapedData = await scrapeAelfPage(date)
    if (scrapedData) {
      return NextResponse.json(scrapedData, {
        headers: {
          "X-Data-Source": "AELF-SCRAPED",
        },
      })
    }

    // Échec total
    throw new Error("Aucune source AELF disponible")
  } catch (error) {
    console.error("💥 Erreur complète AELF:", error)

    return NextResponse.json(
      {
        error: "API AELF indisponible",
        message: "Impossible de récupérer les lectures liturgiques réelles",
        suggestion: "Consultez directement https://www.aelf.org pour les lectures du jour",
        date: date,
      },
      { status: 503 },
    )
  }
}

function extractLectures(data: any) {
  const lectures: any = {}

  if (data.messes && data.messes[0] && data.messes[0].lectures) {
    data.messes[0].lectures.forEach((lecture: any) => {
      if (lecture.type) {
        lectures[lecture.type] = lecture
      }
    })
  } else if (data.lectures) {
    // Si les lectures sont directement dans data
    Object.assign(lectures, data.lectures)
  }

  return lectures
}

async function scrapeAelfPage(date: string) {
  try {
    console.log(`🌐 Scraping AELF page pour ${date}`)

    const response = await fetch(`https://www.aelf.org/${date}`, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
    })

    if (!response.ok) {
      throw new Error(`Scraping failed: ${response.status}`)
    }

    const html = await response.text()

    // Chercher des données JSON dans le HTML
    const jsonPatterns = [
      /window\.__INITIAL_STATE__\s*=\s*({.*?});/,
      /window\.AELF_DATA\s*=\s*({.*?});/,
      /"lectures":\s*(\[.*?\])/,
      /"messes":\s*(\[.*?\])/,
    ]

    for (const pattern of jsonPatterns) {
      const match = html.match(pattern)
      if (match) {
        try {
          const data = JSON.parse(match[1])
          console.log("✅ Données extraites du HTML AELF!")

          return {
            source: "AELF_SCRAPED",
            date: date,
            data: data,
            informations: data.informations || {
              date: date,
              jour_liturgique_nom: data.nom || "Jour liturgique",
              couleur: data.couleur || "vert",
            },
            messes: data.messes || [],
            lectures: extractLectures(data),
          }
        } catch (parseError) {
          console.log("❌ Erreur parsing JSON du HTML")
        }
      }
    }

    return null
  } catch (error) {
    console.log("❌ Erreur scraping:", error)
    return null
  }
}
