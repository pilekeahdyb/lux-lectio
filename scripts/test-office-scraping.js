// Script pour tester le scraping des offices AELF

async function testOfficeScraping() {
  const today = new Date().toISOString().split("T")[0]
  const office = "laudes" // Office à tester
  
  console.log(`Test du scraping d'office AELF pour la date: ${today}, office: ${office}`)

  try {
    // Tester l'endpoint local qui utilise maintenant le scraping
    const url = `http://localhost:3000/api/aelf/offices?office=${office}&date=${today}`
    console.log(`\n🔍 Test de l'endpoint local: ${url}`)

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
      if (data.psaumes) {
        console.log("📖 Psaumes trouvés:", data.psaumes.length)
      }
      if (data.lecture) {
        console.log("📖 Lecture trouvée:", data.lecture.titre)
      }
      if (data.cantique) {
        console.log("📖 Cantique trouvé:", data.cantique.reference)
      }
      if (data.priere) {
        console.log("📖 Prière trouvée: Oui")
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

// Exécution du test
console.log("⚠️ Assurez-vous que votre serveur Next.js est en cours d'exécution sur le port 3000")
console.log("⚠️ Exécutez 'npm run dev' dans un autre terminal si ce n'est pas déjà fait")
testOfficeScraping()