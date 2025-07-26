import { NextRequest, NextResponse } from "next/server"
import fs from "fs/promises"
import path from "path"

const offices = [
  "office_des_lectures",
  "laudes",
  "tierce",
  "sexte",
  "none",
  "vepres",
  "complies",
]

function pad(n: number) {
  return n < 10 ? "0" + n : n
}

function getApiOfficeName(office: string) {
  switch (office) {
    case "office_des_lectures": return "lectures"
    default: return office
  }
}

async function fetchAelfOffice(date: string, office: string) {
  const apiOffice = getApiOfficeName(office)
  const url = `https://api.aelf.org/v1/offices/${apiOffice}/${date}`
  try {
    const res = await fetch(url, {
      headers: {
        Accept: "application/json",
        "User-Agent": "LuxLectio/1.0",
      },
      cache: "no-store",
    })
    if (!res.ok) throw new Error(`AELF API error: ${res.status}`)
    return await res.json()
  } catch (e: any) {
    return { error: e.message }
  }
}

function extractLiturgicalMeta(aelfData: any) {
  return {
    temps_liturgique: aelfData?.informations?.temps_liturgique || aelfData?.informations?.temps || "Temps ordinaire",
    jour_semaine: aelfData?.informations?.jour_liturgique_nom || "",
    semaine_psautier: aelfData?.informations?.semaine || "",
    fete: aelfData?.informations?.fete || "",
  }
}

function buildOfficeJson(date: string, office: string, aelfData: any) {
  const meta = extractLiturgicalMeta(aelfData)
  return {
    office: office.charAt(0).toUpperCase() + office.slice(1).replace(/_/g, " "),
    date,
    semaine_psautier: meta.semaine_psautier ? `semaine ${meta.semaine_psautier}` : "",
    temps_liturgique: meta.temps_liturgique,
    jour_semaine: meta.jour_semaine,
    fete: meta.fete,
    contenu: aelfData?.contenu || aelfData || {},
    source: "AELF",
  }
}

export async function POST(request: NextRequest) {
  const { start = "2025-01-01", end = "2025-12-31" } = await request.json().catch(() => ({}))
  const startDate = new Date(start)
  const endDate = new Date(end)
  const results: any[] = []

  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const dateStr = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
    for (const office of offices) {
      const aelfData = await fetchAelfOffice(dateStr, office)
      if (aelfData?.error) {
        results.push({ date: dateStr, office, error: aelfData.error })
        continue
      }
      const json = buildOfficeJson(dateStr, office, aelfData)
      const fileName = `${dateStr}_${office}.json`
      const filePath = path.join(process.cwd(), "data/offices", fileName)
      await fs.writeFile(filePath, JSON.stringify(json, null, 2), "utf-8")
      results.push({ date: dateStr, office, status: "ok" })
    }
  }
  return NextResponse.json({ ok: true, results })
}

export const dynamic = "force-dynamic"
