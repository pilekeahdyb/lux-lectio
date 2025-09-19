import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const endpoint = "https://api.aelf.org/V1/complies"
  console.log("Testing endpoint:", endpoint)

  try {
    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "User-Agent": "LuxLectio/1.0",
      },
    })

    if (!response.ok) {
      console.error("Status:", response.status)
      console.error("Status Text:", response.statusText)
      const text = await response.text()
      console.error("Response:", text)
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json({ 
      url: endpoint,
      status: response.status,
      data: data 
    })

  } catch (error) {
    console.error("Fetch error:", error)
    return NextResponse.json({ 
      error: String(error),
      url: endpoint
    }, { status: 500 })
  }
}