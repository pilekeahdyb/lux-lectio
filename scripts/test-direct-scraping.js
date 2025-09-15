// Script pour tester directement le scraping du site AELF
// Utilise les modules globaux de Next.js

async function testDirectScraping() {
  const today = new Date().toISOString().split("T")[0];
  const office = "laudes"; // Office à tester
  
  console.log(`Test direct du scraping du site AELF pour la date: ${today}, office: ${office}`);

  try {
    // URL du site AELF pour l'office
    const officeUrl = `https://www.aelf.org/${today}/romain/${office}`;
    console.log(`\n🔍 Récupération de la page: ${officeUrl}`);

    const response = await fetch(officeUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
    });

    console.log(`Status: ${response.status} ${response.statusText}`);
    
    if (response.ok) {
      const html = await response.text();
      console.log(`✅ Page récupérée (${html.length} caractères)`);
      
      // Analyser le HTML manuellement sans cheerio
      console.log('\n📌 Analyse du HTML:');
      
      // Rechercher les psaumes
      const psaumeRegex = /<div[^>]*class="?psaume"?[^>]*>([\s\S]*?)<\/div>/gi;
      let psaumeMatch;
      let psaumeCount = 0;
      
      console.log('\n📌 Psaumes:');
      while ((psaumeMatch = psaumeRegex.exec(html)) !== null) {
        psaumeCount++;
        console.log(`  - Psaume ${psaumeCount} trouvé`);
      }
      
      // Rechercher les lectures
      const lectureRegex = /<div[^>]*class="?lecture"?[^>]*>([\s\S]*?)<\/div>/gi;
      let lectureMatch;
      let lectureCount = 0;
      
      console.log('\n📌 Lectures:');
      while ((lectureMatch = lectureRegex.exec(html)) !== null) {
        lectureCount++;
        console.log(`  - Lecture ${lectureCount} trouvée`);
      }
      
      // Rechercher les prières
      const priereRegex = /<div[^>]*class="?priere"?[^>]*>([\s\S]*?)<\/div>/gi;
      let priereMatch;
      let priereCount = 0;
      
      console.log('\n📌 Prières:');
      while ((priereMatch = priereRegex.exec(html)) !== null) {
        priereCount++;
        console.log(`  - Prière ${priereCount} trouvée`);
      }
      
      console.log(`\n✅ Analyse terminée: ${psaumeCount} psaumes, ${lectureCount} lectures, ${priereCount} prières`);
      
    } else {
      const errorText = await response.text();
      console.log("❌ Erreur:", errorText.substring(0, 100));
    }
  } catch (error) {
    console.log("❌ Erreur réseau:", error);
  }
}

// Exécution du test
testDirectScraping();
