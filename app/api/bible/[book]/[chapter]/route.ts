import { NextRequest } from "next/server"
import axios from "axios"
import * as cheerio from "cheerio"

// Scraper minimal pour bible.aelf.org (ou fallback)
export async function GET(req: NextRequest, { params }: { params: { book: string, chapter: string } }) {
  const { book, chapter } = params
  try {
    // Exemple d'URL cible (adapter selon la source réelle)
    const url = `https://www.aelf.org/bible/${book}/${chapter}`
    const response = await axios.get(url)
    const $ = cheerio.load(response.data)

    // Extraction naïve du texte du chapitre
    const verses: { verse: string, text: string }[] = []
    $(".verset").each((_, el) => {
      const verse = $(el).find(".numero").text().trim() || ""
      const text = $(el).find(".texte").text().trim() || $(el).text().trim()
      if (text) verses.push({ verse, text })
    })

    // Fallback si la structure n'est pas trouvée
    if (verses.length === 0) {
      // Essayer une autre structure ou retourner tout le texte
      const raw = $(".bible-chapitre").text().trim() || $("body").text().trim()
      return new Response(JSON.stringify({ book, chapter, content: raw }), { status: 200 })
    }

    return new Response(JSON.stringify({ book, chapter, verses }), { status: 200 })
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message || "Erreur lors du scraping Bible" }), { status: 500 })
  }
}
