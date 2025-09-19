import { AelfOfficeData } from "./api"

const BASE_URL = "https://api.aelf.org/v1"

interface AelfApiOptions {
  dateStr: string
  office: string
  timeout?: number
}

export async function getOfficeData({ dateStr, office, timeout = 5000 }: AelfApiOptions): Promise<AelfOfficeData> {
  const url = `${BASE_URL}/office/${office}/${dateStr}/romain`
  
  try {
    const response = await fetch(url, { 
      next: { revalidate: 3600 }, // Cache for 1 hour
      headers: {
        "Accept": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`AELF API error: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error(`Error fetching office data: ${error}`)
    throw error
  }
}