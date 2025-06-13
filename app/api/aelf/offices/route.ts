import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const date = searchParams.get("date")
  const office = searchParams.get("office") || "laudes"

  if (!date) {
    return NextResponse.json({ error: "Date parameter is required" }, { status: 400 })
  }

  try {
    console.log(`Récupération de l'office ${office} pour ${date}`)

    // Endpoints possibles pour les offices
    const endpoints = [
      `https://api.aelf.org/v1/offices/${office}/${date}`,
      `https://api.aelf.org/v1/heures/${office}/${date}`,
      `https://www.aelf.org/api/v1/offices/${office}/${date}`,
    ]

    for (const endpoint of endpoints) {
      try {
        console.log(`Tentative office avec: ${endpoint}`)

        const response = await fetch(endpoint, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "User-Agent": "LuxLectio/1.0",
          },
          signal: AbortSignal.timeout(10000),
        })

        if (response.ok) {
          const data = await response.json()
          console.log(`Succès office avec: ${endpoint}`)

          return NextResponse.json(data, {
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Cache-Control": "public, max-age=3600",
            },
          })
        }
      } catch (error) {
        console.log(`Erreur office avec ${endpoint}:`, error)
      }
    }

    // Fallback avec données simulées réalistes
    const fallbackOfficeData = generateFallbackOfficeData(office, date)

    return NextResponse.json(fallbackOfficeData, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "X-Data-Source": "fallback",
      },
    })
  } catch (error) {
    console.error("Erreur générale office:", error)
    return NextResponse.json(
      {
        error: "Erreur lors de la récupération de l'office",
        details: error instanceof Error ? error.message : "Erreur inconnue",
      },
      { status: 500 },
    )
  }
}

function generateFallbackOfficeData(office: string, date: string) {
  const officeData = {
    laudes: {
      nom: "Laudes",
      antienne: "Que tout ce qui respire loue le Seigneur !",
      psaumes: [
        {
          numero: "Ps 62",
          titre: "L'âme qui cherche Dieu",
          antienne: "Dieu, tu es mon Dieu, je te cherche dès l'aube.",
          texte:
            "Dieu, tu es mon Dieu, je te cherche dès l'aube : mon âme a soif de toi ; après toi languit ma chair, terre aride, altérée, sans eau.",
        },
      ],
      cantique: {
        reference: "Cantique de Zacharie (Lc 1, 68-79)",
        antienne: "Béni soit le Seigneur, le Dieu d'Israël, qui visite et rachète son peuple.",
        texte:
          "Béni soit le Seigneur, le Dieu d'Israël, qui visite et rachète son peuple, et nous donne un sauveur puissant dans la maison de David, son serviteur.",
      },
      priere:
        "Dieu qui fais briller sur nous la lumière de ce jour nouveau, accorde-nous de ne commettre aucun péché aujourd'hui et de marcher toujours dans tes voies. Par Jésus, le Christ, notre Seigneur. Amen.",
    },
    vepres: {
      nom: "Vêpres",
      antienne: "Que ma prière devant toi s'élève comme un encens.",
      psaumes: [
        {
          numero: "Ps 140",
          titre: "Prière dans l'épreuve",
          antienne: "Que ma prière monte devant toi comme l'encens.",
          texte:
            "Seigneur, je t'appelle : accours vers moi ! Entends ma voix qui t'appelle ! Que ma prière devant toi s'élève comme un encens, et mes mains, comme l'offrande du soir.",
        },
      ],
      cantique: {
        reference: "Cantique de Marie (Lc 1, 46-55)",
        antienne: "Mon âme exalte le Seigneur, exulte mon esprit en Dieu, mon Sauveur !",
        texte:
          "Mon âme exalte le Seigneur, exulte mon esprit en Dieu, mon Sauveur ! Il s'est penché sur son humble servante ; désormais tous les âges me diront bienheureuse.",
      },
      priere:
        "Dieu qui nous as donné de parvenir au soir de ce jour, garde-nous sans péché durant cette nuit, et fais que nous puissions te louer au matin. Par Jésus, le Christ, notre Seigneur. Amen.",
    },
  }

  return {
    date,
    office,
    data: officeData[office as keyof typeof officeData] || officeData.laudes,
    source: "fallback",
    note: "Données de l'office en cours de récupération depuis l'API AELF. Contenu liturgique authentique en attente.",
  }
}
