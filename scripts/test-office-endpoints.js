// Script pour tester spécifiquement les endpoints des offices AELF

async function testOfficeEndpoints() {
  // Utiliser la date d'aujourd'hui au format YYYY-MM-DD
  const today = new Date().toISOString().split("T")[0]
  // Utiliser une date passée connue pour les tests
  const knownDate = "2023-09-08"
  const office = "laudes" // Office à tester
  
  console.log(`Test des endpoints d'offices AELF pour la date actuelle: ${today}, office: ${office}`)
  console.log(`Test des endpoints d'offices AELF pour une date passée: ${knownDate}, office: ${office}`)

  // Liste des endpoints possibles à tester avec la date actuelle
  const currentEndpoints = [
    `https://api.aelf.org/v1/offices/${office}/${today}`,
    `https://api.aelf.org/v1/heures/${office}/${today}`,
    `https://api.aelf.org/v1/office/${office}/${today}`,
    `https://api.aelf.org/v1/heure/${office}/${today}`,
    `https://www.aelf.org/api/v1/offices/${office}/${today}`,
    `https://www.aelf.org/api/v1/office/${office}/${today}`,
  ]

  // Liste des endpoints possibles à tester avec une date passée connue
  const knownEndpoints = [
    `https://api.aelf.org/v1/offices/${office}/${knownDate}`,
    `https://api.aelf.org/v1/heures/${office}/${knownDate}`,
    `https://api.aelf.org/v1/office/${office}/${knownDate}`,
    `https://api.aelf.org/v1/heure/${office}/${knownDate}`,
    `https://www.aelf.org/api/v1/offices/${office}/${knownDate}`,
    `https://www.aelf.org/api/v1/office/${office}/${knownDate}`,
  ]

  // Tester les endpoints avec la date actuelle
  console.log("\n=== TESTS AVEC LA DATE ACTUELLE ===")
  await testEndpoints(currentEndpoints)

  // Tester les endpoints avec une date passée connue
  console.log("\n=== TESTS AVEC UNE DATE PASSÉE CONNUE ===")
  await testEndpoints(knownEndpoints)

  // Tester l'endpoint des messes qui fonctionne (pour comparaison)
  console.log("\n=== TEST DE L'ENDPOINT DES MESSES (POUR RÉFÉRENCE) ===")
  await testEndpoints([`https://api.aelf.org/v1/messes/${today}`])
}

async function testEndpoints(endpoints) {
  for (const url of endpoints) {
    try {
      console.log(`\n🔍 Test de: ${url}`)

      const response = await fetch(url, {
        headers: {
          Accept: "application/json",
          "User-Agent": "LuxLectio/1.0",
        },
      })

      console.log(`Status: ${response.status} ${response.statusText}`)
      
      if (response.ok) {
        const data = await response.json()
        console.log("✅ SUCCÈS! Structure des données:")
        console.log("Clés principales:", Object.keys(data))
        
        // Analyse plus détaillée de la structure
        if (data.office) {
          console.log("📖 Office trouvé:", Object.keys(data.office))
        }
        if (data.psaumes) {
          console.log("📖 Psaumes trouvés:", data.psaumes.length)
        }
        if (data.lectures) {
          console.log("📖 Lectures trouvées:", data.lectures.length)
        }
        
        // Afficher un extrait des données
        console.log("Aperçu des données:", JSON.stringify(data).substring(0, 300) + "...")
      } else {
        const errorText = await response.text()
        console.log("❌ Erreur:", errorText.substring(0, 100))
      }
    } catch (error) {
      console.log("❌ Erreur réseau:", error.message)
    }
  }
}

// Exécution du test
testOfficeEndpoints()
