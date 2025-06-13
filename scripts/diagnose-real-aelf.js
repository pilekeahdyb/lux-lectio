// Script de diagnostic pour identifier les VRAIS endpoints AELF qui fonctionnent

async function diagnoseRealAELF() {
  console.log("🔍 DIAGNOSTIC COMPLET DE L'API AELF RÉELLE")
  console.log("=" * 60)

  const today = new Date().toISOString().split("T")[0]
  const testDate = "2024-06-30" // Date que vous avez mentionnée

  console.log(`Date du jour: ${today}`)
  console.log(`Date de test: ${testDate}`)
  console.log("")

  // Endpoints officiels documentés
  const officialEndpoints = [
    // Format principal AELF
    `https://api.aelf.org/v1/messes/${today}`,
    `https://api.aelf.org/v1/messes/${today}/france`,
    `https://api.aelf.org/v1/messes/${testDate}`,
    `https://api.aelf.org/v1/messes/${testDate}/france`,

    // Endpoints informatifs
    `https://api.aelf.org/v1/informations/messe/${today}`,
    `https://api.aelf.org/v1/informations/messe/${testDate}`,

    // Endpoints lectures
    `https://api.aelf.org/v1/lectures/${today}`,
    `https://api.aelf.org/v1/lectures/${testDate}`,

    // Endpoints sans version
    `https://api.aelf.org/messes/${today}`,
    `https://api.aelf.org/messes/${testDate}`,
  ]

  // Endpoints alternatifs
  const alternativeEndpoints = [
    `https://www.aelf.org/api/v1/messes/${today}`,
    `https://www.aelf.org/api/v1/messes/${testDate}`,
    `https://nominis.cef.fr/api/messes/${today}`,
    `https://evangeli.net/api/evangile/${today}`,
  ]

  const workingEndpoints = []
  let bestData = null

  console.log("📡 TEST DES ENDPOINTS OFFICIELS AELF")
  console.log("-" * 50)

  for (const endpoint of officialEndpoints) {
    console.log(`\n🔍 Test: ${endpoint}`)

    try {
      const response = await fetch(endpoint, {
        method: "GET",
        headers: {
          Accept: "application/json, text/plain, */*",
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          Referer: "https://www.aelf.org/",
          Origin: "https://www.aelf.org",
          "Accept-Language": "fr-FR,fr;q=0.9",
          "Cache-Control": "no-cache",
        },
      })

      console.log(`   Status: ${response.status} ${response.statusText}`)
      console.log(`   Content-Type: ${response.headers.get("content-type")}`)

      if (response.ok) {
        const contentType = response.headers.get("content-type") || ""

        if (contentType.includes("application/json")) {
          const data = await response.json()
          console.log("   ✅ SUCCÈS JSON!")
          console.log(`   📊 Clés principales: ${Object.keys(data).join(", ")}`)

          // Analyser la structure en détail
          if (data.messes) {
            console.log(`   📖 Messes trouvées: ${data.messes.length}`)
            if (data.messes[0] && data.messes[0].lectures) {
              console.log(`   📚 Lectures: ${data.messes[0].lectures.length}`)
              data.messes[0].lectures.forEach((lecture, i) => {
                console.log(
                  `      ${i + 1}. ${lecture.type || "type?"} - ${(lecture.titre || "titre?").substring(0, 50)}...`,
                )
              })
            }
          }

          if (data.informations) {
            console.log(`   ℹ️ Informations: ${JSON.stringify(data.informations)}`)
          }

          workingEndpoints.push({
            url: endpoint,
            data: data,
            quality: calculateDataQuality(data),
          })

          if (!bestData || calculateDataQuality(data) > calculateDataQuality(bestData)) {
            bestData = data
          }

          // Afficher un échantillon des vraies données
          console.log("   📄 Échantillon des données:")
          console.log(JSON.stringify(data, null, 2).substring(0, 1000) + "...")
        } else {
          const text = await response.text()
          console.log("   ⚠️ Réponse non-JSON")
          console.log(`   📄 Contenu: ${text.substring(0, 200)}...`)
        }
      } else {
        const errorText = await response.text()
        console.log(`   ❌ Erreur HTTP ${response.status}`)
        console.log(`   📄 Erreur: ${errorText.substring(0, 200)}`)
      }
    } catch (error) {
      console.log(`   ❌ Erreur réseau: ${error.message}`)
    }
  }

  console.log("\n📡 TEST DES ENDPOINTS ALTERNATIFS")
  console.log("-" * 50)

  for (const endpoint of alternativeEndpoints) {
    console.log(`\n🔍 Test alternatif: ${endpoint}`)

    try {
      const response = await fetch(endpoint, {
        headers: {
          Accept: "application/json",
          "User-Agent": "LuxLectio/2.0",
        },
      })

      console.log(`   Status: ${response.status}`)

      if (response.ok) {
        const contentType = response.headers.get("content-type") || ""
        if (contentType.includes("application/json")) {
          const data = await response.json()
          console.log("   ✅ Source alternative trouvée!")
          console.log(`   📊 Structure: ${Object.keys(data).join(", ")}`)

          workingEndpoints.push({
            url: endpoint,
            data: data,
            quality: calculateDataQuality(data),
            alternative: true,
          })
        }
      }
    } catch (error) {
      console.log(`   ❌ Erreur: ${error.message}`)
    }
  }

  // Test de scraping de la page AELF
  console.log("\n🌐 TEST DE SCRAPING AELF.ORG")
  console.log("-" * 50)

  try {
    const pageUrl = `https://www.aelf.org/${testDate}`
    console.log(`🔍 Test page: ${pageUrl}`)

    const response = await fetch(pageUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
    })

    if (response.ok) {
      const html = await response.text()
      console.log(`✅ Page AELF accessible (${html.length} caractères)`)

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
            console.log("✅ Données JSON extraites du HTML!")
            console.log(`📊 Clés: ${Object.keys(data).join(", ")}`)

            workingEndpoints.push({
              url: pageUrl,
              data: data,
              quality: calculateDataQuality(data),
              scraped: true,
            })
            break
          } catch (parseError) {
            console.log("❌ Erreur parsing JSON du HTML")
          }
        }
      }
    }
  } catch (error) {
    console.log(`❌ Erreur scraping: ${error.message}`)
  }

  // RÉSUMÉ FINAL
  console.log("\n" + "=" * 60)
  console.log("📋 RÉSUMÉ DU DIAGNOSTIC")
  console.log("=" * 60)

  if (workingEndpoints.length > 0) {
    console.log(`✅ ${workingEndpoints.length} endpoint(s) fonctionnel(s) trouvé(s)!`)

    // Trier par qualité
    workingEndpoints.sort((a, b) => b.quality - a.quality)

    console.log("\n🏆 MEILLEURS ENDPOINTS:")
    workingEndpoints.slice(0, 3).forEach((endpoint, i) => {
      console.log(`${i + 1}. ${endpoint.url}`)
      console.log(`   Qualité: ${endpoint.quality}/10`)
      if (endpoint.alternative) console.log("   Type: Source alternative")
      if (endpoint.scraped) console.log("   Type: Données scrapées")
      console.log("")
    })

    // Analyser les meilleures données
    const bestEndpoint = workingEndpoints[0]
    console.log("📊 ANALYSE DES MEILLEURES DONNÉES:")
    console.log(`Source: ${bestEndpoint.url}`)

    if (bestEndpoint.data.messes && bestEndpoint.data.messes[0] && bestEndpoint.data.messes[0].lectures) {
      console.log("\n📚 LECTURES TROUVÉES:")
      bestEndpoint.data.messes[0].lectures.forEach((lecture, i) => {
        console.log(`${i + 1}. Type: ${lecture.type}`)
        console.log(`   Titre: ${lecture.titre}`)
        console.log(`   Référence: ${lecture.ref || lecture.reference}`)
        if (lecture.contenu) {
          console.log(`   Contenu: ${lecture.contenu.substring(0, 100)}...`)
        }
        console.log("")
      })
    }

    console.log("\n🔧 RECOMMANDATIONS POUR L'IMPLÉMENTATION:")
    console.log(`1. Utiliser l'endpoint: ${bestEndpoint.url}`)
    console.log("2. Structure des données identifiée")
    console.log("3. Implémenter la normalisation appropriée")
    console.log("4. Ajouter un système de fallback")
  } else {
    console.log("❌ Aucun endpoint AELF fonctionnel trouvé")
    console.log("\n🔧 SOLUTIONS POSSIBLES:")
    console.log("1. L'API AELF pourrait être temporairement indisponible")
    console.log("2. Vérifier les CORS et les headers")
    console.log("3. Essayer un proxy ou un scraper")
    console.log("4. Contacter l'équipe AELF pour la documentation")
  }

  console.log("\n🌐 Pour comparaison manuelle:")
  console.log(`Visitez: https://www.aelf.org/${testDate}`)
  console.log(`Comparez avec: https://www.aelf.org/${today}`)
}

function calculateDataQuality(data) {
  let score = 0

  // Vérifier la présence de structures importantes
  if (data.messes) score += 3
  if (data.informations) score += 2
  if (data.lectures) score += 2

  // Vérifier la qualité des lectures
  if (data.messes && data.messes[0] && data.messes[0].lectures) {
    const lectures = data.messes[0].lectures
    score += Math.min(lectures.length, 3) // Max 3 points pour le nombre de lectures

    // Vérifier la qualité du contenu
    lectures.forEach((lecture) => {
      if (lecture.titre) score += 0.2
      if (lecture.contenu && lecture.contenu.length > 100) score += 0.3
      if (lecture.type) score += 0.2
      if (lecture.ref || lecture.reference) score += 0.2
    })
  }

  return Math.min(score, 10) // Score maximum de 10
}

// Exécution du diagnostic
diagnoseRealAELF().catch(console.error)
