import { type NextRequest, NextResponse } from "next/server"

async function checkIfSamediSaint(date: string, zone: string): Promise<boolean> {
  try {
    const response = await fetch(`https://www.aelf.org/${date}/${zone}/messe`, {
      headers: {
        "User-Agent": "LuxLectio/1.0",
        Accept: "text/html",
      },
    })

    if (response.ok) {
      const html = await response.text()
      return (
        html.includes("Samedi Saint") || html.includes("veillée pascale") || html.includes("Pour la veillée pascale")
      )
    }
  } catch (error) {
    console.log("Erreur lors de la vérification du Samedi Saint:", error)
  }
  return false
}

async function handleSamediSaint(date: string, zone: string) {
  try {
    // Get the next day (Easter Sunday) for the Easter Vigil readings
    const dateObj = new Date(date)
    dateObj.setDate(dateObj.getDate() + 1)
    const easterSunday = dateObj.toISOString().split("T")[0]

    console.log(`Récupération de la Veillée Pascale pour ${easterSunday}`)

    const vigileEndpoint = `https://api.aelf.org/v1/messes/${easterSunday}/${zone}`

    const response = await fetch(vigileEndpoint, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "User-Agent": "LuxLectio/1.0 (Application liturgique)",
        Referer: "https://www.aelf.org/",
      },
    })

    if (response.ok) {
      const data = await response.json()

      // Find the Easter Vigil mass (usually contains "Vigile" or "Veillée")
      const vigileData =
        data.messes?.find(
          (messe: any) =>
            messe.nom?.toLowerCase().includes("vigile") ||
            messe.nom?.toLowerCase().includes("veillée") ||
            messe.nom?.toLowerCase().includes("pascale"),
        ) || data.messes?.[0]

      const normalizedData = {
        informations: {
          ...data.informations,
          date: date, // Keep original Samedi Saint date
          jour_liturgique_nom: "Samedi Saint - Veillée Pascale",
          couleur: "blanc",
          temps_liturgique: "paques",
          semaine: "",
          fete: "Veillée Pascale",
        },
        messes: vigileData ? [vigileData] : [],
        lectures: {} as { [key: string]: any },
      }

      // Extract all readings from Easter Vigil
      if (vigileData?.lectures) {
        vigileData.lectures.forEach((lecture: any, index: number) => {
          const lectureKey = lecture.type || `lecture_${index + 1}`
          normalizedData.lectures[lectureKey] = {
            type: lecture.type || `lecture_${index + 1}`,
            titre: lecture.titre || `Lecture ${index + 1}`,
            contenu: lecture.contenu || "",
            reference: lecture.reference || lecture.ref || "",
            ref: lecture.ref || lecture.reference || "",
            refrain_psalmique: lecture.refrain_psalmique || null,
            verset_evangile: lecture.verset_evangile || null,
            intro_lue: lecture.intro_lue || null,
            ref_refrain: lecture.ref_refrain || null,
            ref_verset: lecture.ref_verset || null,
          }
        })
      }

      return NextResponse.json(normalizedData, {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
          Pragma: "no-cache",
          Expires: "0",
        },
      })
    }
  } catch (error) {
    console.error("Erreur lors de la récupération de la Veillée Pascale:", error)
  }

  // Fallback: return minimal Samedi Saint data
  return NextResponse.json(
    {
      informations: {
        date: date,
        jour_liturgique_nom: "Samedi Saint",
        couleur: "blanc",
        temps_liturgique: "paques",
        semaine: "",
        fete: "Samedi Saint - L'Église demeure auprès du tombeau dans le silence",
      },
      messes: [],
      lectures: {
        meditation: {
          type: "meditation",
          titre: "Méditation du Samedi Saint",
          contenu:
            "Le Samedi saint, l'Église demeure auprès du tombeau dans le silence. C'est un jour de recueillement et d'attente. Pour la Veillée Pascale, voir au Dimanche de Pâques.",
          reference: "",
          ref: "",
          intro_lue: "Méditation pour le Samedi Saint",
        },
      },
    },
    {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
        Pragma: "no-cache",
        Expires: "0",
      },
    },
  )
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const date = searchParams.get("date") || new Date().toISOString().split("T")[0]
  const zone = searchParams.get("zone") || "france"

  try {
    console.log(`Récupération des lectures AELF pour ${date}`)

    const dateObj = new Date(date)
    const isSamediSaint = await checkIfSamediSaint(date, zone)

    if (isSamediSaint) {
      console.log("Samedi Saint détecté - redirection vers la Veillée Pascale")
      return handleSamediSaint(date, zone)
    }

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

    // Nouvelle normalisation : expose tous les champs riches de chaque lecture
    const normalizedData = {
      informations: {
        ...data.informations,
        date: data.informations?.date || date,
        jour_liturgique_nom: data.informations?.jour_liturgique_nom || data.informations?.nom || "Jour liturgique",
        couleur: data.informations?.couleur || "vert",
        temps_liturgique: data.informations?.temps_liturgique || "ordinaire",
        semaine: data.informations?.semaine || "",
        fete: data.informations?.fete || data.informations?.ligne2 || "",
      },
      messes: data.messes || [],
      lectures: {} as { [key: string]: any },
    }

    // Extraction complète des lectures, indexées par type, avec tous les champs
    if (normalizedData.messes[0]?.lectures) {
      normalizedData.messes[0].lectures.forEach((lecture: any) => {
        if (lecture.type) {
          normalizedData.lectures[lecture.type] = {
            type: lecture.type,
            titre: lecture.titre || "",
            contenu: lecture.contenu || "",
            reference: lecture.reference || lecture.ref || "",
            ref: lecture.ref || lecture.reference || "",
            refrain_psalmique: lecture.refrain_psalmique || null,
            verset_evangile: lecture.verset_evangile || null,
            intro_lue: lecture.intro_lue || null,
            ref_refrain: lecture.ref_refrain || null,
            ref_verset: lecture.ref_verset || null,
          }
        }
      })
    }

    return NextResponse.json(normalizedData, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
        Pragma: "no-cache",
        Expires: "0",
      },
    })
  } catch (error) {
    console.error("Erreur lors de la récupération des lectures:", error)

    try {
      // Check if it's Samedi Saint and redirect to Easter Vigil
      const isSamediSaint = await checkIfSamediSaint(date, zone)
      if (isSamediSaint) {
        return handleSamediSaint(date, zone)
      }

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
          lectures: {} as { [key: string]: any },
        }

        // Extraction des lectures
        if (normalizedData.messes[0]?.lectures) {
          normalizedData.messes[0].lectures.forEach((lecture: any) => {
            if (lecture.type) {
              normalizedData.lectures[lecture.type] = {
                type: lecture.type,
                titre: lecture.titre || "",
                contenu: lecture.contenu || "",
                reference: lecture.reference || lecture.ref || "",
                ref: lecture.ref || lecture.reference || "",
                refrain_psalmique: lecture.refrain_psalmique || null,
                verset_evangile: lecture.verset_evangile || null,
                intro_lue: lecture.intro_lue || null,
                ref_refrain: lecture.ref_refrain || null,
                ref_verset: lecture.ref_verset || null,
              }
            }
          })
        }

        return NextResponse.json(normalizedData, {
          headers: {
            "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
            Pragma: "no-cache",
            Expires: "0",
          },
        })
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
