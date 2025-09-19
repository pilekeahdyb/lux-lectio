import { NextRequest } from "next/server"

async function testOffice(office: string, date: string) {
  const url = `/api/aelf/offices?date=${date}&office=${office}`
  console.log(`\n🔍 Test de l'office ${office} pour le ${date}`)
  
  try {
    const res = await fetch(url)
    if (!res.ok) {
      console.log(`❌ Erreur HTTP ${res.status} pour ${office}`)
      return
    }

    const data = await res.json()
    
    // Vérification des informations de base
    if (!data.informations?.jour_liturgique_nom) {
      console.log(`⚠️ Informations liturgiques manquantes pour ${office}`)
    }

    if (!data.office) {
      console.log(`❌ Pas de données d'office pour ${office}`)
      return
    }

    // Structure attendue de l'office
    const officeStructure = {
      introduction: "Introduction",
      psaume_1: "Premier psaume",
      psaume_2: "Deuxième psaume",
      psaume_3: "Troisième psaume",
      cantique_ancien: "Cantique AT",
      cantique_zacharie: "Cantique Zacharie",
      lecture_breve: "Lecture brève",
      repons_bref: "Répons",
      intercessions: "Intercessions",
      notre_pere: "Notre Père",
      oraison: "Oraison",
      conclusion: "Conclusion"
    }

    // Analyse détaillée
    const analysis = {
      present: [] as string[],
      empty: [] as string[],
      missing: [] as string[]
    }

    Object.entries(officeStructure).forEach(([key, label]) => {
      const content = data.office[key]
      if (!content) {
        analysis.missing.push(label)
      } else if (!content.contenu && !content.hymne && !content.antienne) {
        analysis.empty.push(label)
      } else {
        analysis.present.push(label)
      }
    })

    // Affichage des résultats
    console.log(`\n📊 Analyse de l'office ${office} :`)
    console.log(`✅ Parties présentes (${analysis.present.length}) :`)
    analysis.present.forEach(p => console.log(`   - ${p}`))
    
    if (analysis.empty.length > 0) {
      console.log(`\n⚠️ Parties vides (${analysis.empty.length}) :`)
      analysis.empty.forEach(p => console.log(`   - ${p}`))
    }
    
    if (analysis.missing.length > 0) {
      console.log(`\n❌ Parties manquantes (${analysis.missing.length}) :`)
      analysis.missing.forEach(p => console.log(`   - ${p}`))
    }

    // Score de complétude
    const completeness = (analysis.present.length / Object.keys(officeStructure).length) * 100
    console.log(`\n📈 Score de complétude : ${completeness.toFixed(1)}%`)

  } catch (error) {
    console.error(`❌ Erreur lors du test de ${office}:`, error)
  }
}

export async function GET(request: NextRequest) {
  const today = new Date().toISOString().split('T')[0]
  
  // Liste des offices à tester
  const offices = [
    "laudes",
    "tierce",
    "sexte",
    "none",
    "vepres",
    "complies",
    "office_lectures"
  ]

  console.log("🔄 Début du diagnostic des offices")
  console.log("📅 Date de test :", today)

  // Test de chaque office
  for (const office of offices) {
    await testOffice(office, today)
  }

  // Créer un rapport complet
  const report = {
    date: today,
    timestamp: new Date().toISOString(),
    results: {} as Record<string, {
      completeness: number,
      presentParts: string[],
      emptyParts: string[],
      missingParts: string[],
      error?: string
    }>
  }

  // Test de chaque office et collecte des résultats
  for (const office of offices) {
    try {
      const response = await fetch(`http://localhost:3000/api/aelf/offices?date=${today}&office=${office}`)
      const data = await response.json()

      if (!data || !data.office) {
        report.results[office] = {
          completeness: 0,
          presentParts: [],
          emptyParts: [],
          missingParts: ["Données complètement manquantes"],
          error: "Pas de données d'office"
        }
        continue
      }

      const analysis = {
        present: [] as string[],
        empty: [] as string[],
        missing: [] as string[]
      }

      const officeStructure = {
        introduction: "Introduction",
        psaume_1: "Premier psaume",
        psaume_2: "Deuxième psaume",
        psaume_3: "Troisième psaume",
        cantique_ancien: "Cantique AT",
        cantique_zacharie: "Cantique Zacharie",
        lecture_breve: "Lecture brève",
        repons_bref: "Répons",
        intercessions: "Intercessions",
        notre_pere: "Notre Père",
        oraison: "Oraison",
        conclusion: "Conclusion"
      }

      Object.entries(officeStructure).forEach(([key, label]) => {
        const content = data.office[key]
        if (!content) {
          analysis.missing.push(label)
        } else if (!content.contenu && !content.hymne && !content.antienne) {
          analysis.empty.push(label)
        } else {
          analysis.present.push(label)
        }
      })

      const completeness = (analysis.present.length / Object.keys(officeStructure).length) * 100

      report.results[office] = {
        completeness,
        presentParts: analysis.present,
        emptyParts: analysis.empty,
        missingParts: analysis.missing
      }

    } catch (error) {
      report.results[office] = {
        completeness: 0,
        presentParts: [],
        emptyParts: [],
        missingParts: [],
        error: error instanceof Error ? error.message : "Erreur inconnue"
      }
    }
  }

  return new Response(JSON.stringify(report, null, 2), {
    headers: {
      "Content-Type": "application/json",
    },
  })
}