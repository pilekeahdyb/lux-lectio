import type { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const date = "2025-09-18" // Date de test
  const zone = "france"
  
  try {
    // Liste des offices à tester
    const offices = [
      "lectures",
      "laudes",
      "tierce",
      "sexte",
      "none",
      "vepres",
      "complies"
    ]
    
    // Récupérer tous les offices
    const results = await Promise.all(offices.map(async (office) => {
      const url = `https://api.aelf.org/v1/offices/${date}/${zone}/${office}`
      console.log(`Testing ${url}`)
      
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "User-Agent": "LuxLectio/1.0 (Application liturgique)",
          Referer: "https://www.aelf.org/",
        }
      })
      
      if (!response.ok) {
        throw new Error(`Erreur API pour ${office}: ${response.status}`)
      }
      
      const data = await response.json()
      return {
        office,
        data
      }
    }))
    
    // Retourner les résultats
    return new Response(JSON.stringify(results, null, 2), {
      headers: {
        "Content-Type": "application/json"
      }
    })
    
  } catch (error) {
    console.error("Erreur test API:", error)
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
      headers: {
        "Content-Type": "application/json"
      }
    })
  }
}