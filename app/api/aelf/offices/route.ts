import { type NextRequest, NextResponse } from "next/server"

const officeMappings = {
  office_lectures: "lectures",
  laudes: "laudes",
  tierce: "tierce",
  sexte: "sexte",
  none: "none",
  vepres: "vepres",
  complies: "complies"
}

async function fetchWithTimeout(url: string, options: RequestInit & { timeout?: number } = {}) {
  const { timeout = 3000, ...fetchOptions } = options
  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), timeout)
  try {
    const res = await fetch(url, { ...fetchOptions, signal: controller.signal })
    clearTimeout(id)
    return res
  } catch (e) {
    clearTimeout(id)
    throw e
  }
}

function mapToLecture(raw: any): any | null {
  if (!raw) return null
  const contenu = raw.contenu ?? raw.texte ?? raw.content ?? ""
  const ref = raw.ref ?? raw.reference ?? raw.references ?? undefined
  return {
    type: raw.type ?? raw.kind ?? "",
    titre: raw.titre ?? raw.title ?? "",
    contenu,
    ref,
    intro: raw.intro ?? raw.introduction ?? undefined,
    verset: raw.verset ?? raw.verset_evangile ?? undefined,
    antienne: raw.antienne ?? raw.refrain ?? undefined,
    repons: raw.repons ?? raw.reponse ?? undefined,
  }
}

function normalizeOfficeApiDataComplete(apiData: any, officeKey: string) {
  try {
    console.log('Normalisation complète des données API AELF:', Object.keys(apiData))
    
    if (!apiData) {
      console.error('❌ Données API nulles ou non définies')
      return null
    }
    
    // Récupérer les données de l'office spécifique
    const officeData = apiData[officeKey] || apiData
    
    // Validation des données minimales requises
    if (!officeData || typeof officeData !== 'object') {
      console.error('❌ Données de l\'office invalides:', officeData)
      return null
    }
    
    // Structure de base avec informations par défaut
    const normalized: any = {
      nom: officeKey.charAt(0).toUpperCase() + officeKey.slice(1),
      informations: {
        date: apiData.date || new Date().toISOString().split('T')[0],
        jour_liturgique_nom: apiData.informations?.jour_liturgique_nom || "Office du jour"
      },
      office: {}
    }

    // Mapper les éléments selon la structure officielle
    if (officeData.introduction) {
      normalized.office.introduction = {
        type: 'introduction',
        titre: 'Introduction',
        contenu: officeData.introduction,
      }
    }

    // Traitement des psaumes
    if (officeData.psaume_1) {
      normalized.office.psaume_1 = mapToLecture(officeData.psaume_1)
    }
    if (officeData.psaume_2) {
      normalized.office.psaume_2 = mapToLecture(officeData.psaume_2)
    }
    if (officeData.psaume_3) {
      normalized.office.psaume_3 = mapToLecture(officeData.psaume_3)
    }

    // Autres éléments de l'office
    const elements = [
      'hymne',
      'lecture_breve',
      'repons_bref',
      'cantique_ancien',
      'cantique_zacharie',
      'intercessions',
      'notre_pere',
      'oraison',
      'conclusion'
    ]

    elements.forEach(element => {
      if (officeData[element]) {
        normalized.office[element] = mapToLecture(officeData[element])
      }
    })

    return normalized
  } catch (error) {
    console.error('Erreur lors de la normalisation des données:', error)
    return null
  }
}

async function getOfficeFromAelf(date: string, office: string) {
  // Mapper les noms d'offices vers les endpoints AELF
  const officeEndpoints: Record<string, string> = {
    'laudes': 'laudes',
    'vepres': 'vepres', 
    'complies': 'complies',
    'tierce': 'tierce',
    'sexte': 'sexte',
    'none': 'none',
    'lectures': 'lectures',
    'office_lectures': 'lectures'
  }
  
  const aelfOffice = officeEndpoints[office.toLowerCase()]
  if (!aelfOffice) {
    throw new Error(`Office non supporté: ${office}`)
  }
  
  // Essayer différentes URLs AELF
  const aelfUrls = [
    `https://api.aelf.org/v1/${aelfOffice}/${date}/france`,
    `https://api.aelf.org/v1/${aelfOffice}/${date}`,
    `https://www.aelf.org/api/v1/${aelfOffice}/${date}/france`,
    `https://www.aelf.org/api/v1/${aelfOffice}/${date}`
  ]
  
  let lastError: Error | null = null
  
  for (const url of aelfUrls) {
    try {
      console.log(`🔄 Tentative avec ${url}`)
      const response = await fetchWithTimeout(url, {
        timeout: 10000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'application/json, text/plain, */*',
          'Accept-Language': 'fr-FR,fr;q=0.9,en;q=0.8',
        }
      })

      if (response.ok) {
        console.log(`✅ Succès avec ${url}`)
        const data = await response.json()
        return data
      }
      
      console.log(`❌ Échec avec ${url}: HTTP ${response.status}`)
      lastError = new Error(`HTTP ${response.status}`)
    } catch (error) {
      console.log(`❌ Échec avec ${url}:`, error)
      lastError = error instanceof Error ? error : new Error('Erreur inconnue')
    }
  }
  
  throw lastError || new Error('Tous les endpoints AELF ont échoué')
}

export async function GET(request: NextRequest) {
  console.log('🔄 Début de la requête GET /api/aelf/offices')
  
  try {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get("date")
    const office = searchParams.get("office") || "laudes"
    
    console.log('📝 Paramètres reçus:', { date, office })

    // Validation des paramètres
    if (!date) {
      console.error('❌ Date manquante')
      return NextResponse.json(
        { error: "Le paramètre 'date' est requis" },
        { status: 400 }
      )
    }

    // Validation du format de la date (YYYY-MM-DD)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      console.error('❌ Format de date invalide:', date)
      return NextResponse.json(
        { error: "Le format de la date doit être YYYY-MM-DD" },
        { status: 400 }
      )
    }

    // Validation de l'office
    const officesValides = ["lectures", "laudes", "tierce", "sexte", "none", "vepres", "complies", "office_lectures"]
    if (!officesValides.includes(office)) {
      console.error('❌ Type d\'office invalide:', office)
      return NextResponse.json(
        { error: `Type d'office invalide. Valeurs acceptées: ${officesValides.join(", ")}` },
        { status: 400 }
      )
    }

    // Récupération des données depuis l'API AELF
    const aelfData = await getOfficeFromAelf(date, office)
    
    // Normalisation des données
    const normalizedData = normalizeOfficeApiDataComplete(aelfData, office)
    
    // Vérification finale des données
    if (!normalizedData || !normalizedData.office) {
      throw new Error('Format de données invalide après normalisation')
    }

    console.log('✅ Données valides, envoi de la réponse')
    return NextResponse.json({
      date,
      ...normalizedData,
      source: 'aelf-api',
      note: `Office ${office} depuis l'API AELF officielle`
    }, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
        "Pragma": "no-cache",
        "Expires": "0",
      }
    })
  } catch (error) {
    console.error('❌ Erreur lors de la récupération de l\'office:', error)
    return NextResponse.json({
      error: "Erreur lors de la récupération de l'office",
      details: error instanceof Error ? error.message : "Erreur inconnue"
    }, {
      status: 500
    })
  }
}