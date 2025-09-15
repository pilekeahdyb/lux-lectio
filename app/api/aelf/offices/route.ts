import { type NextRequest, NextResponse } from "next/server"
import { getOfficeData } from "@/lib/offices-data"

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
    
    // Récupérer les données de l'office spécifique
    const officeData = apiData[officeKey] || apiData
    if (!officeData) {
      console.log('Aucune donnée trouvée pour l\'office:', officeKey)
      return null
    }
    
    // Structure de base avec TOUS les éléments possibles
    const normalized: any = {
      nom: officeKey.charAt(0).toUpperCase() + officeKey.slice(1),
      office: {}
    }
    
    // Mapper TOUS les éléments selon la structure officielle de la Liturgie des Heures
    
    // 1. Invitatoire (si présent)
    if (officeData.invitatoire) {
      normalized.office.invitatoire = {
        type: 'invitatoire',
        titre: 'Invitatoire',
        contenu: officeData.invitatoire.texte || officeData.invitatoire.contenu || officeData.invitatoire
      }
    }
    
    // 2. Introduction (toujours présent)
    normalized.office.introduction = {
      type: 'introduction',
      titre: 'Formule d\'introduction',
      contenu: officeData.introduction || 'Dieu, viens à mon aide. Seigneur, à notre secours. Gloire au Père, et au Fils, et au Saint-Esprit, comme il était au commencement, maintenant et toujours, et dans les siècles des siècles. Amen.'
    }
    
    // 3. Hymne
    if (officeData.hymne) {
      normalized.office.hymne = {
        type: 'hymne',
        titre: 'Hymne',
        contenu: officeData.hymne.texte || officeData.hymne.contenu || officeData.hymne
      }
    }
    
    // 4. Examen de conscience (Complies uniquement)
    if (officeData.examen) {
      normalized.office.examen = {
        type: 'examen',
        titre: 'Examen de conscience',
        contenu: officeData.examen.texte || officeData.examen.contenu || officeData.examen
      }
    }
    
    // 5. Psaumes (tous les psaumes possibles) avec détection de cantiques
    const lowerKey = officeKey.toLowerCase()
    const isLaudes = lowerKey.includes('laudes')
    const isVepres = lowerKey.includes('vepres') || lowerKey.includes('vêpres')
    const psaumeFields = ['psaume_invitatoire', 'psaume_1', 'psaume_2', 'psaume_3']
    psaumeFields.forEach((field, index) => {
      if (officeData[field]) {
        const antienneField = field === 'psaume_invitatoire' ? 'antienne_invitatoire' : `antienne_${index}`
        const antienneDebut = officeData[`antienne_debut_${index}`] || officeData[antienneField] || ''
        const antienneFin = officeData[`antienne_fin_${index}`] || ''
        const refValue = officeData[field].reference || officeData[field].titre || ''
        const texte = officeData[field].texte || officeData[field].contenu || officeData[field]

        const isCantiqueRef = typeof refValue === 'string' && /cantique/i.test(refValue)
        if (isCantiqueRef && isLaudes && field !== 'psaume_invitatoire') {
          // Mapper le cantique d'Isaïe sous cantique_ancien pour les Laudes
          normalized.office.cantique_ancien = {
            type: 'cantique',
            titre: officeData[field].titre || refValue || 'Cantique',
            contenu: texte,
            ref: officeData[field].reference || '',
            antienne_debut: antienneDebut || undefined,
            antienne_fin: antienneFin || undefined,
          }
          return
        }
        if (isCantiqueRef && isVepres) {
          // Mapper le cantique du NT pour Vêpres
          normalized.office.cantique_nouveau = {
            type: 'cantique',
            titre: officeData[field].titre || refValue || 'Cantique',
            contenu: texte,
            ref: officeData[field].reference || '',
            antienne_debut: antienneDebut || undefined,
            antienne_fin: antienneFin || undefined,
          }
          return
        }

        normalized.office[field] = {
          type: 'psaume',
          titre: refValue || `Psaume ${index + 1}`,
          contenu: texte,
          ref: officeData[field].reference || '',
          antienne_debut: antienneDebut || undefined,
          antienne_fin: antienneFin || undefined,
        }
      }
    })
    
    // 6. Cantiques spécifiques
    const cantiques = {
      cantique_ancien: officeData.cantique_ancien || officeData.cantique_ancien_testament,
      cantique_nouveau: officeData.cantique_nouveau || officeData.cantique_nouveau_testament,
      cantique_zacharie: officeData.cantique_zacharie || officeData.benedictus,
      cantique_marie: officeData.cantique_marie || officeData.magnificat,
      cantique_simeon: officeData.cantique_simeon || officeData.nunc_dimittis
    }
    
    Object.entries(cantiques).forEach(([key, cantique]) => {
      if (cantique) {
        const antienneDebutC = cantique.antienne_debut || cantique.antienne || cantique.refrain || ''
        const antienneFinC = cantique.antienne_fin || ''
        const texte = cantique.texte || cantique.contenu || cantique
        
        normalized.office[key] = {
          type: 'cantique',
          titre: cantique.titre || cantique.reference || key.replace('cantique_', 'Cantique '),
          contenu: texte,
          ref: cantique.reference || '',
          antienne_debut: antienneDebutC || undefined,
          antienne_fin: antienneFinC || undefined,
        }
        // Ajouter des sections d'antiennes dédiées (début si présent, sinon fin)
        if (key === 'cantique_zacharie' && (officeData.antienne_zacharie || officeData.antienne_zacharie_debut || officeData.antienne_zacharie_fin)) {
          normalized.office.antienne_zacharie = {
            type: 'antienne',
            titre: 'Antienne de Zacharie',
            contenu: officeData.antienne_zacharie_debut || officeData.antienne_zacharie || officeData.antienne_zacharie_fin || '',
          }
        }
        if (key === 'cantique_marie' && (officeData.antienne_marie || officeData.antienne_marie_debut || officeData.antienne_marie_fin)) {
          normalized.office.antienne_marie = {
            type: 'antienne',
            titre: 'Antienne de Marie',
            contenu: officeData.antienne_marie_debut || officeData.antienne_marie || officeData.antienne_marie_fin || '',
          }
        }
        if (key === 'cantique_simeon' && (officeData.antienne_simeon || officeData.antienne_simeon_debut || officeData.antienne_simeon_fin)) {
          normalized.office.antienne_simeon = {
            type: 'antienne',
            titre: 'Antienne de Siméon',
            contenu: officeData.antienne_simeon_debut || officeData.antienne_simeon || officeData.antienne_simeon_fin || '',
          }
        }
      }
    })
    
    // 7. Lectures
    if (officeData.lecture_breve) {
      normalized.office.lecture_breve = {
        type: 'lecture',
        titre: 'Lecture brève',
        contenu: officeData.lecture_breve.texte || officeData.lecture_breve.contenu || officeData.lecture_breve,
        ref: officeData.lecture_breve.reference || ''
      }
    }

    // Alias: certaines API renvoient 'pericope' pour la lecture brève des offices du jour
    if (!normalized.office.lecture_breve && officeData.pericope) {
      normalized.office.lecture_breve = {
        type: 'lecture',
        titre: 'Lecture brève',
        contenu: officeData.pericope.texte || officeData.pericope.contenu || officeData.pericope,
        ref: officeData.pericope.reference || '',
      }
    }
    
    if (officeData.lecture_1 || officeData.premiere_lecture) {
      const lecture = officeData.lecture_1 || officeData.premiere_lecture
      normalized.office.lecture_1 = {
        type: 'lecture',
        titre: 'Première lecture',
        contenu: lecture.texte || lecture.contenu || lecture,
        ref: lecture.reference || ''
      }
    }
    
    if (officeData.lecture_2 || officeData.seconde_lecture) {
      const lecture = officeData.lecture_2 || officeData.seconde_lecture
      normalized.office.lecture_2 = {
        type: 'lecture',
        titre: 'Seconde lecture',
        contenu: lecture.texte || lecture.contenu || lecture,
        ref: lecture.reference || ''
      }
    }
    
    // 8. Versets
    if (officeData.verset) {
      normalized.office.verset = {
        type: 'verset',
        titre: 'Verset',
        contenu: officeData.verset.texte || officeData.verset.contenu || officeData.verset
      }
    }
    // Alias: certaines variantes renvoient verset_bref
    if (!normalized.office.verset && officeData.verset_bref) {
      normalized.office.verset = {
        type: 'verset',
        titre: 'Verset',
        contenu: officeData.verset_bref.texte || officeData.verset_bref.contenu || officeData.verset_bref,
      }
    }
    
    // 9. Répons
    if (officeData.repons_bref) {
      normalized.office.repons_bref = {
        type: 'repons',
        titre: 'Répons bref',
        contenu: officeData.repons_bref.texte || officeData.repons_bref.contenu || officeData.repons_bref
      }
    }
    // Alias: 'repons' pour Laudes et Heures médianes
    if (!normalized.office.repons_bref && officeData.repons) {
      normalized.office.repons_bref = {
        type: 'repons',
        titre: 'Répons bref',
        contenu: officeData.repons.texte || officeData.repons.contenu || officeData.repons,
      }
    }
    
    if (officeData.repons_1 || officeData.premier_repons) {
      const repons = officeData.repons_1 || officeData.premier_repons
      normalized.office.repons_1 = {
        type: 'repons',
        titre: 'Premier répons',
        contenu: repons.texte || repons.contenu || repons
      }
    }
    
    if (officeData.repons_2 || officeData.second_repons) {
      const repons = officeData.repons_2 || officeData.second_repons
      normalized.office.repons_2 = {
        type: 'repons',
        titre: 'Second répons',
        contenu: repons.texte || repons.contenu || repons
      }
    }
    
    // 10. Intercessions
    if (officeData.intercessions) {
      normalized.office.intercessions = {
        type: 'intercession',
        titre: 'Intercessions',
        contenu: officeData.intercessions.texte || officeData.intercessions.contenu || officeData.intercessions
      }
    }
    // Alias: 'intercession' (singulier)
    if (!normalized.office.intercessions && officeData.intercession) {
      normalized.office.intercessions = {
        type: 'intercession',
        titre: 'Intercessions',
        contenu: officeData.intercession.texte || officeData.intercession.contenu || officeData.intercession,
      }
    }
    
    // 11. Notre Père
    if (officeData.notre_pere) {
      normalized.office.notre_pere = {
        type: 'priere',
        titre: 'Notre Père',
        contenu: officeData.notre_pere.texte || officeData.notre_pere.contenu || officeData.notre_pere
      }
    }
    
    // 12. Te Deum (Office des lectures)
    if (officeData.te_deum) {
      normalized.office.te_deum = {
        type: 'hymne',
        titre: 'Te Deum',
        contenu: officeData.te_deum.texte || officeData.te_deum.contenu || officeData.te_deum
      }
    }
    
    // 13. Antienne mariale (Complies)
    if (officeData.antienne_mariale) {
      normalized.office.antienne_mariale = {
        type: 'antienne',
        titre: 'Antienne mariale',
        contenu: officeData.antienne_mariale.texte || officeData.antienne_mariale.contenu || officeData.antienne_mariale
      }
    }
    
    // 14. Bénédiction finale (Complies)
    if (officeData.benediction) {
      normalized.office.benediction = {
        type: 'benediction',
        titre: 'Bénédiction finale',
        contenu: officeData.benediction.texte || officeData.benediction.contenu || officeData.benediction
      }
    }
    
    // 15. Oraison finale
    if (officeData.oraison || officeData.conclusion || officeData.priere_finale) {
      const oraison = officeData.oraison || officeData.conclusion || officeData.priere_finale
      normalized.office.conclusion = {
        type: 'conclusion',
        titre: 'Oraison',
        contenu: oraison.texte || oraison.contenu || oraison
      }
    }
    
    console.log('Normalisation complète terminée:', Object.keys(normalized.office))
    return normalized
    
  } catch (error) {
    console.error('Erreur lors de la normalisation complète:', error)
    return null
  }
}

function normalizeOfficeApiData(apiData: any, officeKey: string) {
  try {
    console.log('Normalisation des données API AELF:', Object.keys(apiData))
    
    // Récupérer les données de l'office spécifique
    const officeData = apiData[officeKey] || apiData
    if (!officeData) {
      console.log('Aucune donnée trouvée pour l\'office:', officeKey)
      return null
    }
    
    // Structure de base avec TOUS les éléments possibles
    const normalized: any = {
      nom: officeKey.charAt(0).toUpperCase() + officeKey.slice(1),
      office: {}
    }
    
    // Mapper TOUS les éléments selon la structure officielle de la Liturgie des Heures
    
    // 1. Invitatoire (si présent)
    if (officeData.invitatoire) {
      normalized.office.invitatoire = {
        type: 'invitatoire',
        titre: 'Invitatoire',
        contenu: officeData.invitatoire.texte || officeData.invitatoire.contenu || officeData.invitatoire
      }
    }
    
    // 2. Introduction (toujours présent)
    normalized.office.introduction = {
      type: 'introduction',
      titre: 'Formule d\'introduction',
      contenu: officeData.introduction || 'Dieu, viens à mon aide. Seigneur, à notre secours. Gloire au Père, et au Fils, et au Saint-Esprit, comme il était au commencement, maintenant et toujours, et dans les siècles des siècles. Amen.'
    }
    
    // 3. Hymne
    if (officeData.hymne) {
      normalized.office.hymne = {
        type: 'hymne',
        titre: 'Hymne',
        contenu: officeData.hymne.texte || officeData.hymne.contenu || officeData.hymne
      }
    }
    
    // 4. Examen de conscience (Complies uniquement)
    if (officeData.examen) {
      normalized.office.examen = {
        type: 'examen',
        titre: 'Examen de conscience',
        contenu: officeData.examen.texte || officeData.examen.contenu || officeData.examen
      }
    }
    
    // Créer des sections séparées pour chaque élément
    
    // Psaume invitatoire
    if (officeData.psaume_invitatoire) {
      const antienneDebutInv = officeData.antienne_invitatoire_debut || officeData.antienne_invitatoire || ''
      const antienneFinInv = officeData.antienne_invitatoire_fin || officeData.antienne_invitatoire || ''
      const texte = officeData.psaume_invitatoire.texte || ''
      normalized.office.psaume_invitatoire = {
        type: 'psaume',
        titre: officeData.psaume_invitatoire.reference,
        contenu: texte,
        ref: officeData.psaume_invitatoire.reference,
        antienne_debut: antienneDebutInv || undefined,
        antienne_fin: antienneFinInv || undefined,
      }
      // Ajouter une section d'antienne invitatoire dédiée pour l'UI
      if (antienneDebutInv) {
        normalized.office.antienne_invitatoire = {
          type: 'antienne',
          titre: 'Antienne invitatoire',
          contenu: antienneDebutInv,
        }
      }
    }
    
    // Psaume 1
    if (officeData.psaume_1) {
      const antienneDebut = officeData.antienne_debut_1 || officeData.antienne_1 || ''
      const antienneFin = officeData.antienne_fin_1 || ''
      const texte = officeData.psaume_1.texte || ''
      normalized.office.psaume_1 = {
        type: 'psaume',
        titre: officeData.psaume_1.reference,
        contenu: texte,
        ref: officeData.psaume_1.reference,
        antienne_debut: antienneDebut || undefined,
        antienne_fin: antienneFin || undefined,
      }
    }
    
    // Psaume 2
    if (officeData.psaume_2) {
      const antienneDebut = officeData.antienne_debut_2 || officeData.antienne_2 || ''
      const antienneFin = officeData.antienne_fin_2 || ''
      const texte = officeData.psaume_2.texte || ''
      normalized.office.psaume_2 = {
        type: 'psaume',
        titre: officeData.psaume_2.reference,
        contenu: texte,
        ref: officeData.psaume_2.reference,
        antienne_debut: antienneDebut || undefined,
        antienne_fin: antienneFin || undefined,
      }
    }
    
    // Psaume 3
    if (officeData.psaume_3) {
      const antienneDebut = officeData.antienne_debut_3 || officeData.antienne_3 || ''
      const antienneFin = officeData.antienne_fin_3 || ''
      const texte = officeData.psaume_3.texte || ''
      normalized.office.psaume_3 = {
        type: 'psaume',
        titre: officeData.psaume_3.reference,
        contenu: texte,
        ref: officeData.psaume_3.reference,
        antienne_debut: antienneDebut || undefined,
        antienne_fin: antienneFin || undefined,
      }
    }
    
    // Traiter la lecture (péricope)
    if (officeData.pericope) {
      normalized.office.lectures = [{
        type: 'lecture',
        titre: 'Lecture',
        contenu: officeData.pericope.texte || '',
        ref: officeData.pericope.reference || ''
      }]
    }
    
    // Traiter le cantique de Zacharie
    if (officeData.cantique_zacharie) {
      normalized.office.cantique = {
        type: 'cantique',
        titre: officeData.cantique_zacharie.titre || 'Cantique de Zacharie',
        contenu: officeData.cantique_zacharie.texte || '',
        ref: officeData.cantique_zacharie.reference || '',
        antienne_debut: officeData.antienne_zacharie_debut || officeData.antienne_zacharie || undefined,
        antienne_fin: officeData.antienne_zacharie_fin || undefined,
      }
    }
    
    // Traiter la conclusion (oraison)
    if (officeData.oraison) {
      normalized.office.conclusion = {
        type: 'conclusion',
        titre: 'Prière finale',
        contenu: officeData.oraison || 'Amen.'
      }
    }
    
    // Ajouter l'hymne si présent
    if (officeData.hymne) {
      normalized.office.hymne = {
        type: 'hymne',
        titre: officeData.hymne.titre || 'Hymne',
        contenu: officeData.hymne.texte || '',
        auteur: officeData.hymne.auteur || ''
      }
    }
    
    // Ajouter les intercessions si présentes
    if (officeData.intercession) {
      normalized.office.intercession = {
        type: 'intercession',
        titre: 'Intercessions',
        contenu: officeData.intercession || ''
      }
    }
    
    // Ajouter le répons si présent
    if (officeData.repons) {
      normalized.office.repons = {
        type: 'repons',
        titre: 'Répons',
        contenu: officeData.repons || ''
      }
    }
    
    return normalized
  } catch (error) {
    console.error('Erreur normalisation données AELF:', error)
    return null
  }
}

function generateOfficeFromMesseData(messeData: any, office: string, date: string) {
  if (!messeData?.messes || !Array.isArray(messeData.messes)) {
    return null
  }

  // Extraire toutes les lectures de toutes les messes
  const allLectures: any[] = []
  messeData.messes.forEach((messe: any) => {
    if (messe.lectures && Array.isArray(messe.lectures)) {
      messe.lectures.forEach((lecture: any) => {
        allLectures.push({
          ...lecture,
          messe_nom: messe.nom || 'Messe',
        })
      })
    }
  })

  if (allLectures.length === 0) {
    return null
  }

  // Générer un office basé sur le type demandé
  const officeNames = {
    'laudes': 'Laudes',
    'vepres': 'Vêpres', 
    'complies': 'Complies',
    'tierce': 'Tierce',
    'sexte': 'Sexte',
    'none': 'None',
    'office_lectures': 'Office des lectures'
  }

  const officeName = officeNames[office as keyof typeof officeNames] || office

  // Sélectionner les lectures appropriées selon l'office
  let selectedLectures = allLectures

  // Pour les laudes, privilégier les lectures du matin
  if (office === 'laudes') {
    selectedLectures = allLectures.filter(l => 
      l.type?.toLowerCase().includes('première') || 
      l.type?.toLowerCase().includes('lecture') ||
      l.type?.toLowerCase().includes('psaume')
    )
  }

  // Pour les vêpres, privilégier les lectures du soir
  if (office === 'vepres') {
    selectedLectures = allLectures.filter(l => 
      l.type?.toLowerCase().includes('deuxième') || 
      l.type?.toLowerCase().includes('lecture') ||
      l.type?.toLowerCase().includes('psaume')
    )
  }

  // Mapper les lectures vers le format attendu
  const mappedLectures = selectedLectures.slice(0, 3).map((lecture, index) => ({
    type: lecture.type || 'lecture',
    titre: lecture.titre || `Lecture ${index + 1}`,
    contenu: lecture.contenu || '',
    ref: lecture.ref || lecture.reference || '',
    intro: lecture.intro || undefined,
    verset: lecture.verset_evangile || undefined,
    antienne: lecture.refrain_psalmique || undefined,
    repons: lecture.repons || undefined,
  }))

  // Générer des psaumes basés sur les lectures psalmiques
  const psaumes = allLectures
    .filter(l => l.type?.toLowerCase().includes('psaume') || l.refrain_psalmique)
    .slice(0, 2)
    .map((psaume, index) => ({
      type: 'psaume',
      titre: psaume.titre || `Psaume ${index + 1}`,
      contenu: psaume.contenu || '',
      ref: psaume.ref || psaume.reference || '',
      antienne: psaume.refrain_psalmique || undefined,
    }))

  // Générer un cantique approprié
  const cantique = office === 'laudes' ? {
    type: 'cantique',
    titre: 'Cantique de Zacharie (Benedictus)',
    contenu: 'Béni soit le Seigneur, le Dieu d\'Israël, qui visite et rachète son peuple...',
    ref: 'Lc 1, 68-79',
    antienne: 'Béni soit le Seigneur, le Dieu d\'Israël, qui visite et rachète son peuple.',
  } : office === 'vepres' ? {
    type: 'cantique', 
    titre: 'Cantique de Marie (Magnificat)',
    contenu: 'Mon âme exalte le Seigneur, exulte mon esprit en Dieu, mon Sauveur...',
    ref: 'Lc 1, 46-55',
    antienne: 'Mon âme exalte le Seigneur, exulte mon esprit en Dieu, mon Sauveur !',
  } : undefined

  return {
    nom: officeName,
    office: {
      lectures: mappedLectures.length > 0 ? mappedLectures : undefined,
      psaumes: psaumes.length > 0 ? psaumes : undefined,
      cantique: cantique,
      introduction: {
        type: 'introduction',
        titre: 'Introduction',
        contenu: `Office de ${officeName} pour le ${messeData.informations?.jour_liturgique_nom || date}`,
      },
      conclusion: {
        type: 'conclusion',
        titre: 'Prière finale',
        contenu: `Seigneur, accorde-nous de vivre cette journée dans ta paix et ta grâce. Amen.`,
      },
    },
  }
}

// Fonction pour extraire des données structurées du HTML AELF
function extractOfficeDataFromHtml(html: string, office: string) {
  try {
    console.log('Extraction des données office depuis HTML...')
    
    // Extraire le titre de l'office
    const titleMatch = html.match(/<h1[^>]*>([^<]+)<\/h1>/i) || 
                      html.match(/<title[^>]*>([^<]+)<\/title>/i) ||
                      html.match(/<h2[^>]*>([^<]+)<\/h2>/i)
    const title = titleMatch ? titleMatch[1].trim() : `Office ${office}`

    // Chercher le contenu principal de l'office
    const mainContentMatch = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i) ||
                            html.match(/<div[^>]*class=["'][^"']*content[^"']*["'][^>]*>([\s\S]*?)<\/div>/i) ||
                            html.match(/<div[^>]*class=["'][^"']*office[^"']*["'][^>]*>([\s\S]*?)<\/div>/i)
    
    const content = mainContentMatch ? mainContentMatch[1] : html

    // Extraire les psaumes - patterns plus spécifiques pour AELF
    let psaumes: any[] = []
    
    // Patterns pour les psaumes dans les offices AELF
    const psaumePatterns = [
      /<div[^>]*class=["'][^"']*psalm[^"']*["'][^>]*>([\s\S]*?)<\/div>/gi,
      /<div[^>]*class=["']psaume["'][^>]*>([\s\S]*?)<\/div>/gi,
      /<div[^>]*class=["'][^"']*office-psaume[^"']*["'][^>]*>([\s\S]*?)<\/div>/gi,
      /<div[^>]*class=["'][^"']*office-section[^"']*["'][^>]*>([\s\S]*?)<\/div>/gi,
      /<section[^>]*class=["'][^"']*psalm[^"']*["'][^>]*>([\s\S]*?)<\/section>/gi,
      /<article[^>]*class=["'][^"']*psalm[^"']*["'][^>]*>([\s\S]*?)<\/article>/gi
    ]
    
    // Parcourir tous les patterns possibles pour les psaumes
    for (const pattern of psaumePatterns) {
      const psaumeMatches = content.match(pattern)
      if (psaumeMatches) {
        psaumeMatches.forEach((psaumeHtml, index) => {
          // Essayer différents patterns pour le titre/numéro
          const numeroMatch = psaumeHtml.match(/<h[2-6][^>]*>([^<]+)<\/h[2-6]>/i) ||
                             psaumeHtml.match(/<div[^>]*class=["'][^"']*titre[^"']*["'][^>]*>([^<]+)<\/div>/i) ||
                             psaumeHtml.match(/<p[^>]*class=["'][^"']*titre[^"']*["'][^>]*>([^<]+)<\/p>/i) ||
                             psaumeHtml.match(/<strong[^>]*>([^<]+)<\/strong>/i)
          
          // Essayer différents patterns pour l'antienne
          const antienneMatch = psaumeHtml.match(/<p[^>]*class=["'][^"']*antienne[^"']*["'][^>]*>([\s\S]*?)<\/p>/i) ||
                               psaumeHtml.match(/<div[^>]*class=["'][^"']*antienne[^"']*["'][^>]*>([\s\S]*?)<\/div>/i) ||
                               psaumeHtml.match(/<em[^>]*>([\s\S]*?)<\/em>/i)
          
          // Essayer différents patterns pour le texte
          const texteMatch = psaumeHtml.match(/<div[^>]*class=["'][^"']*texte[^"']*["'][^>]*>([\s\S]*?)<\/div>/i) ||
                            psaumeHtml.match(/<p[^>]*class=["'][^"']*texte[^"']*["'][^>]*>([\s\S]*?)<\/p>/i) ||
                            psaumeHtml.match(/<p[^>]*>([\s\S]*?)<\/p>/i)
        
        if (numeroMatch || antienneMatch || texteMatch) {
          // Vérifier si c'est un cantique
            const isCantique = numeroMatch && (
              numeroMatch[1].toLowerCase().includes('cantique') ||
              numeroMatch[1].toLowerCase().includes('magnificat') ||
              numeroMatch[1].toLowerCase().includes('benedictus')
            )
          
          psaumes.push({
            numero: numeroMatch ? numeroMatch[1].trim() : `Psaume ${index + 1}`,
            titre: numeroMatch ? numeroMatch[1].trim() : `Psaume ${index + 1}`,
            reference: numeroMatch ? numeroMatch[1].trim() : `Psaume ${index + 1}`,
            antienne: antienneMatch ? antienneMatch[1].replace(/<[^>]*>/g, '').trim() : '',
            texte: texteMatch ? texteMatch[1].replace(/<[^>]*>/g, '').trim() : '',
            type: isCantique ? 'cantique' : 'psaume'
          })
        }
      })
      }
    }

    // Extraire la lecture - essayer différentes classes possibles
    let lecture = null
    const lecturePatterns = [
      /<div[^>]*class=["'][^"']*lecture[^"']*["'][^>]*>([\s\S]*?)<\/div>/i,
      /<div[^>]*class=["']office-lecture["'][^>]*>([\s\S]*?)<\/div>/i,
      /<div[^>]*class=["']section-lecture["'][^>]*>([\s\S]*?)<\/div>/i
    ]
    
    for (const pattern of lecturePatterns) {
      const lectureMatch = html.match(pattern)
      if (lectureMatch) {
        const lectureHtml = lectureMatch[1]
        
        // Essayer différents patterns pour le titre
        const lectureTitleMatch = lectureHtml.match(/<h[2-6][^>]*>([^<]+)<\/h[2-6]>/i) ||
                                 lectureHtml.match(/<div[^>]*class=["']titre["'][^>]*>([^<]+)<\/div>/i) ||
                                 lectureHtml.match(/<p[^>]*class=["']titre["'][^>]*>([^<]+)<\/p>/i)
        
        // Essayer différents patterns pour la référence
        const lectureRefMatch = lectureHtml.match(/<p[^>]*class=["'][^"']*ref[^"']*["'][^>]*>([\s\S]*?)<\/p>/i) ||
                               lectureHtml.match(/<div[^>]*class=["'][^"']*ref[^"']*["'][^>]*>([\s\S]*?)<\/div>/i) ||
                               lectureHtml.match(/<span[^>]*class=["'][^"']*ref[^"']*["'][^>]*>([\s\S]*?)<\/span>/i)
        
        // Essayer différents patterns pour le texte
        const lectureTextMatch = lectureHtml.match(/<p[^>]*class=["'][^"']*texte[^"']*["'][^>]*>([\s\S]*?)<\/p>/i) ||
                                lectureHtml.match(/<div[^>]*class=["'][^"']*texte[^"']*["'][^>]*>([\s\S]*?)<\/div>/i) ||
                                lectureHtml.match(/<p[^>]*>([\s\S]*?)<\/p>/i)
      
      lecture = {
        titre: lectureTitleMatch ? lectureTitleMatch[1].trim() : 'Lecture',
        reference: lectureRefMatch ? lectureRefMatch[1].replace(/<[^>]*>/g, '').trim() : 
                  (lectureTitleMatch ? lectureTitleMatch[1].trim() : ''),
        texte: lectureTextMatch ? lectureTextMatch[1].replace(/<[^>]*>/g, '').trim() : ''
      }
      break
    }
  }

    // Extraire le répons
    let repons = null
    const reponsMatch = html.match(/<div[^>]*class=["'][^"']*repons[^"']*["'][^>]*>([\s\S]*?)<\/div>/i)
    if (reponsMatch) {
      repons = reponsMatch[1].replace(/<[^>]*>/g, '').trim()
    }

    // Extraire la prière
    let priere = null
    const priereMatch = html.match(/<div[^>]*class=["'][^"']*priere[^"']*["'][^>]*>([\s\S]*?)<\/div>/i)
    if (priereMatch) {
      priere = priereMatch[1].replace(/<[^>]*>/g, '').trim()
    }

    // Extraire l'antienne d'ouverture
    let antienne = null
    const antienneMatch = html.match(/<p[^>]*class=["'][^"']*antienne[^"']*["'][^>]*>([\s\S]*?)<\/p>/i)
    if (antienneMatch) {
      antienne = antienneMatch[1].replace(/<[^>]*>/g, '').trim()
    }

    // Extraire le cantique évangélique (Magnificat ou Benedictus)
    let cantique = null
    // Chercher parmi les psaumes ceux qui sont des cantiques
    const cantiqueItem = psaumes.find(p => p.type === 'cantique')
    if (cantiqueItem) {
      cantique = {
        reference: cantiqueItem.reference,
        antienne: cantiqueItem.antienne,
        texte: cantiqueItem.texte
      }
      // Retirer le cantique des psaumes
      psaumes = psaumes.filter(p => p.type !== 'cantique')
    }

    // Si on a au moins quelques données, on les retourne
    if (psaumes.length > 0 || lecture || priere || antienne || cantique || repons) {
      return {
        nom: title,
        antienne,
        psaumes,
        lecture,
        cantique,
        repons,
        priere
      }
    }
    
    // Extraction de contenu HTML brut en dernier recours si aucune donnée structurée n'est trouvée
     let rawContent = null
     const hasStructuredData = psaumes.length > 0 || lecture || repons || priere || antienne || cantique
     
     if (!hasStructuredData) {
       // Extraire le contenu principal sans les menus et en-têtes
       const mainContentMatch = html.match(/<main[^>]*>(\s*<div[^>]*>)?([\s\S]*?)(<\/div>\s*)?<\/main>/i)
       if (mainContentMatch) {
         rawContent = mainContentMatch[2].trim()
       } else {
         // Fallback: extraire le contenu du body
         const bodyContentMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)
         if (bodyContentMatch) {
           rawContent = bodyContentMatch[1].trim()
         }
       }
     }

    return {
        titre: title,
        psaumes,
        lecture,
        repons,
        priere,
        antienne,
        cantique,
        rawContent
      }
  } catch (error) {
    console.error("Erreur extraction données office:", error)
    return null
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const date = searchParams.get("date")
  const office = searchParams.get("office") || "laudes"
  const sourcePref = (searchParams.get("source") || "").toLowerCase()

  if (!date) {
    return NextResponse.json({ error: "Date parameter is required" }, { status: 400 })
  }

  try {
    console.log(`Récupération de l'office ${office} pour ${date}`)

    // Option pour forcer la source locale
    if (sourcePref === 'local') {
      console.log('Préférence source=local – utilisation de la base de données locale d\'abord')
      const localOffice = getOfficeData(office, date)
      if (localOffice) {
        return NextResponse.json({
          date,
          ...localOffice,
          source: 'local-database',
          note: `Office ${office} depuis la base de données locale`,
        }, {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
            "Pragma": "no-cache",
            "Expires": "0",
          },
        })
      }
      console.log('Aucune donnée locale disponible, on continue vers les sources distantes')
    }

    // 1) Utiliser les endpoints spécifiques de l'API AELF pour chaque office (prioritaire)
    console.log('Tentative avec les endpoints spécifiques AELF')
    try {
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
            
            // Normaliser les données AELF vers notre format
            const normalizedData = normalizeOfficeApiDataComplete(data, office)
            
            return NextResponse.json({
              date,
              ...normalizedData,
              source: 'aelf-api',
              note: `Office ${office} depuis l'API AELF officielle`,
            }, {
              headers: {
                "Access-Control-Allow-Origin": "*",
                "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
                "Pragma": "no-cache",
                "Expires": "0",
              },
            })
          } else {
            console.log(`❌ Échec avec ${url}: HTTP ${response.status}`)
          }
        } catch (error: any) {
          console.log(`❌ Échec avec ${url}:`, error.message)
        }
      }
      
      throw new Error('Tous les endpoints AELF ont échoué')
    } catch (error) {
      console.error('Erreur API AELF:', error)
    }
    
    // 2) Fallback: Scraping direct du site AELF
    console.log('Fallback: Scraping direct du site AELF')
    try {
      const officeUrl = `https://www.aelf.org/${date}/romain/${office}`
      console.log(`Scraping URL: ${officeUrl}`)
      
      const htmlResponse = await fetchWithTimeout(officeUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
          "Accept-Language": "fr-FR,fr;q=0.9,en;q=0.8",
          "Accept-Encoding": "gzip, deflate, br",
          "DNT": "1",
          "Connection": "keep-alive",
          "Upgrade-Insecure-Requests": "1",
        },
        timeout: 15000,
      })
      
      if (htmlResponse.ok) {
        const html = await htmlResponse.text()
        console.log(`HTML reçu, longueur: ${html.length}`)
        
        // Extraire les données structurées du HTML AELF
        const structuredData = extractOfficeDataFromHtml(html, office)
        
        if (structuredData) {
          // Mapper vers la structure attendue par l'UI (AelfOffice)
          const mapped = {
            nom: structuredData.nom,
            office: {
              introduction: {
                type: 'introduction',
                titre: 'Introduction',
                contenu: `Office de ${structuredData.nom} pour le ${date}`,
              },
              lectures: structuredData.lecture ? [{
                type: 'lecture',
                titre: structuredData.lecture.titre ?? 'Lecture',
                contenu: structuredData.lecture.texte ?? '',
                ref: structuredData.lecture.reference ?? undefined,
              }] : undefined,
              psaumes: Array.isArray(structuredData.psaumes) ? structuredData.psaumes.map((p: any) => ({
                type: p.type ?? 'psaume',
                titre: p.titre ?? p.numero ?? 'Psaume',
                contenu: p.texte ?? '',
                ref: p.reference ?? undefined,
                antienne: p.antienne ?? undefined,
              })) : undefined,
              cantique: structuredData.cantique ? {
                type: 'cantique',
                titre: structuredData.cantique.reference ?? 'Cantique',
                contenu: structuredData.cantique.texte ?? '',
                ref: structuredData.cantique.reference ?? undefined,
                antienne: structuredData.cantique.antienne ?? undefined,
              } : undefined,
              conclusion: {
                type: 'conclusion',
                titre: 'Prière finale',
                contenu: structuredData.priere || 'Seigneur, accorde-nous de vivre cette journée dans ta paix et ta grâce. Amen.',
              },
            },
          }

          return NextResponse.json({
            date,
            ...mapped,
            source: 'aelf.org-scraper',
            note: "Office récupéré par scraping HTML du site officiel AELF. Données structurées extraites.",
          }, {
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
              "Pragma": "no-cache",
              "Expires": "0",
            },
          })
        }
        
        // Si l'extraction structurée échoue, essayer iBreviary
        console.log('Tentative iBreviary comme fallback')
        const dateStr = date.replace(/-/g, "")
        const ibreviaryUrl = `https://www.ibreviary.com/m2/breviario.php?lang=fr&giorno=${dateStr}&orazione=${office}`
        
        const ibreviaryResponse = await fetchWithTimeout(ibreviaryUrl, {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          },
          timeout: 10000,
        })
        
        if (ibreviaryResponse.ok) {
          const ibreviaryHtml = await ibreviaryResponse.text()
          const divMatch = ibreviaryHtml.match(/<div[^>]*id=["']content["'][^>]*>([\s\S]*?)<\/div>/i)
          if (divMatch) {
            let cleanHtml = divMatch[1]
              .replace(/<script[\s\S]*?<\/script>/gi, "")
              .replace(/<style[\s\S]*?<\/style>/gi, "")
              .replace(/\s?class="[^"]*"/gi, "")
              .replace(/\s?id="[^"]*"/gi, "")
              .replace(/\s?data-[^=]+="[^"]*"/gi, "")
              .replace(/<a [^>]*href="[^"]*"[^>]*>([\s\S]*?)<\/a>/gi, "$1")
              .replace(/<img[^>]*>/gi, "")

            const mapped = {
              nom: `Office ${office}`,
              office: {
                lectures: [{
                  type: 'html',
                  titre: 'Contenu iBreviary',
                  contenu: cleanHtml,
                }],
              },
            }

            return NextResponse.json({
              date,
              ...mapped,
              source: 'ibreviary.com-scraper',
              note: "Office récupéré par scraping HTML du site iBreviary. Structure brute, non normalisée.",
            }, {
              headers: {
                "Access-Control-Allow-Origin": "*",
                "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
                "Pragma": "no-cache",
                "Expires": "0",
              },
            })
          }
        }
      }
    } catch (scrapeError) {
      console.error("Erreur scraping AELF:", scrapeError)
    }

    // L'API ayant échoué, on tente le scraping du site AELF
    console.log('Tentative de scraping du site AELF')
    try {
      const officeUrl = `https://www.aelf.org/${date}/romain/${office}`
      const htmlResponse = await fetch(officeUrl, {
        headers: {
          "User-Agent": "LuxLectio/1.0",
          "Accept": "text/html",
        },
        signal: AbortSignal.timeout(10000),
      })
      if (htmlResponse.ok) {
        const html = await htmlResponse.text()
        
        // Essayer d'extraire des données structurées du HTML AELF
        const structuredData = extractOfficeDataFromHtml(html, office)
        
        if (structuredData) {
          // Mapper vers la structure attendue par l'UI (AelfOffice)
          const mapped = {
            nom: structuredData.nom,
            office: {
              lectures: structuredData.lecture ? [{
                type: 'lecture',
                titre: structuredData.lecture.titre ?? 'Lecture',
                contenu: structuredData.lecture.texte ?? '',
                ref: structuredData.lecture.reference ?? undefined,
              }] : undefined,
              psaumes: Array.isArray(structuredData.psaumes) ? structuredData.psaumes.map((p: any) => ({
                type: p.type ?? 'psaume',
                titre: p.titre ?? p.numero ?? 'Psaume',
                contenu: p.texte ?? '',
                ref: p.reference ?? undefined,
                antienne: p.antienne ?? undefined,
              })) : undefined,
              cantique: structuredData.cantique ? {
                type: 'cantique',
                titre: structuredData.cantique.reference ?? 'Cantique',
                contenu: structuredData.cantique.texte ?? '',
                ref: structuredData.cantique.reference ?? undefined,
                antienne: structuredData.cantique.antienne ?? undefined,
              } : undefined,
            },
          }

          return NextResponse.json({
            date,
            ...mapped,
            source: 'aelf.org-scraper',
            note: "Office récupéré par scraping HTML du site officiel AELF. Données structurées extraites.",
          }, {
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
              "Pragma": "no-cache",
              "Expires": "0",
            },
          })
        }
        
        // Fallback : retourner le HTML brut si l'extraction structurée échoue
        const divMatch = html.match(/<div[^>]*class=["'][^"']*container-reading[^"']*["'][^>]*>([\s\S]*?)<\/div>/i)
        if (divMatch) {
          const mainHtml = divMatch[1]
          let cleanHtml = mainHtml
            .replace(/<script[\s\S]*?<\/script>/gi, "")
            .replace(/<style[\s\S]*?<\/style>/gi, "")
            .replace(/\s?class="[^"]*"/gi, "")
            .replace(/\s?id="[^"]*"/gi, "")
            .replace(/\s?data-[^=]+="[^"]*"/gi, "")
            .replace(/<a [^>]*href="[^"]*"[^>]*>([\s\S]*?)<\/a>/gi, "$1")
            .replace(/<img[^>]*>/gi, "")
          
          return NextResponse.json({
            date,
            html: cleanHtml,
            source: "aelf.org-scraper",
            note: "Office récupéré par scraping HTML du site officiel AELF. Structure brute, non normalisée.",
          }, {
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
              "Pragma": "no-cache",
              "Expires": "0",
            },
          })
        }
      }
    } catch (scrapeError) {
      console.error("Erreur scraping AELF:", scrapeError)
    }
    // Si le scraping échoue aussi, tente iBreviary (scraping HTML)
    try {
      // iBreviary propose les offices en HTML, mais l'URL dépend de la langue et du jour liturgique
      // On tente le lien direct pour laudes en français
      // Format attendu : https://www.ibreviary.com/m2/breviario.php?lang=fr&giorno=YYYYMMDD&orazione=laudes
      const dateStr = date.replace(/-/g, "")
      const ibreviaryUrl = `https://www.ibreviary.com/m2/breviario.php?lang=fr&giorno=${dateStr}&orazione=${office}`
      const ibreviaryResponse = await fetch(ibreviaryUrl, {
        headers: {
          "User-Agent": "LuxLectio/1.0",
          "Accept": "text/html",
        },
        signal: AbortSignal.timeout(10000),
      })
      if (ibreviaryResponse.ok) {
        const html = await ibreviaryResponse.text()
        // Extraction du bloc principal : <div id="content">
        const divMatch = html.match(/<div[^>]*id=["']content["'][^>]*>([\s\S]*?)<\/div>/i)
        if (divMatch) {
          let cleanHtml = divMatch[1]
            .replace(/<script[\s\S]*?<\/script>/gi, "")
            .replace(/<style[\s\S]*?<\/style>/gi, "")
            .replace(/\s?class="[^"]*"/gi, "")
            .replace(/\s?id="[^"]*"/gi, "")
            .replace(/\s?data-[^=]+="[^"]*"/gi, "")
            .replace(/<a [^>]*href="[^"]*"[^>]*>([\s\S]*?)<\/a>/gi, "$1")
            .replace(/<img[^>]*>/gi, "")
          return NextResponse.json({
            date,
            html: cleanHtml,
            source: "ibreviary.com-scraper",
            note: "Office récupéré par scraping HTML du site iBreviary. Structure brute, non normalisée.",
          }, {
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
              "Pragma": "no-cache",
              "Expires": "0",
            },
          })
        }
      }
    } catch (ibreviaryError) {
      console.error("Erreur scraping iBreviary:", ibreviaryError)
    }
    
    // Si aucune source n'a fonctionné, retourner une erreur
    return NextResponse.json(
      { 
        error: true, 
        message: `Aucune donnée disponible pour l'office ${office} à la date ${date}`,
        office,
        date 
      }, 
      { 
        status: 404,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
        "Pragma": "no-cache",
        "Expires": "0",
      },
      }
    )
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
