import { GET } from "./route"

// Mock next/server
jest.mock("next/server", () => ({
  NextResponse: {
    json: (body: any, init?: ResponseInit) => ({
      status: init?.status || 200,
      headers: init?.headers || {},
      json: async () => body,
    }),
  },
}))

// Mock de fetch global
global.fetch = jest.fn()

// Mock de NextRequest et URL
class MockURL {
  searchParams: URLSearchParams
  constructor(url: string) {
    this.searchParams = new URLSearchParams(url.split("?")[1])
  }
}

class MockNextRequest {
  nextUrl: MockURL
  url: string
  constructor(url: string) {
    this.url = url
    this.nextUrl = new MockURL(url)
  }
}

describe("Office API Route", () => {
  beforeEach(() => {
    // Réinitialiser les mocks avant chaque test
    jest.clearAllMocks()
  })

  it("devrait récupérer correctement les laudes", async () => {
    // Mock de la réponse de l'API AELF
    const mockAelfResponse = {
      titre: "Laudes",
      jour: "Mercredi 17 septembre 2025",
      introduction: {
        antienne: "Test antienne",
        hymne: "Test hymne"
      },
      psaumes: [
        {
          titre: "Psaume 50",
          contenu: "Test contenu psaume",
          antienne: "Test antienne psaume"
        }
      ]
    }

    // Configuration du mock de fetch
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockAelfResponse
    })

    // Création d'une fausse requête
    const request = new MockNextRequest(
      "http://localhost:3000/api/aelf/offices?date=2025-09-17&office=laudes&zone=romain"
    ) as any

    // Appel de notre endpoint
    const response = await GET(request)
    const data = await response.json()

    // Vérifications
    expect(global.fetch).toHaveBeenCalledWith(
      "https://api.aelf.org/v1/heures/laudes?date=2025-09-17&zone=romain",
      expect.any(Object)
    )

    // Vérification de la structure des données normalisées
    expect(data).toHaveProperty("informations")
    expect(data).toHaveProperty("office")
    expect(data.office).toHaveProperty("titre")
  })

  it("devrait gérer correctement l'erreur quand la date est manquante", async () => {
    // Création d'une fausse requête sans date
    const request = new MockNextRequest(
      "http://localhost:3000/api/aelf/offices?office=laudes"
    ) as any

    // Appel de notre endpoint
    const response = await GET(request)
    const data = await response.json()

    // Vérifications
    expect(response.status).toBe(400)
    expect(data).toHaveProperty("error")
    expect(data.error).toBe("Date parameter is required")
  })

  it("devrait gérer correctement l'erreur pour un office invalide", async () => {
    // Création d'une fausse requête avec un office invalide
    const request = new MockNextRequest(
      "http://localhost:3000/api/aelf/offices?date=2025-09-17&office=invalid"
    ) as any

    // Appel de notre endpoint
    const response = await GET(request)
    const data = await response.json()

    // Vérifications
    expect(response.status).toBe(400)
    expect(data).toHaveProperty("error")
    expect(data.error).toBe("Invalid office parameter")
  })

  it("devrait convertir correctement office_lectures en lectures", async () => {
    // Mock de la réponse de l'API AELF
    const mockAelfResponse = {
      titre: "Office des lectures",
      jour: "Mercredi 17 septembre 2025"
    }

    // Configuration du mock de fetch
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockAelfResponse
    })

    // Création d'une fausse requête
    const request = new MockNextRequest(
      "http://localhost:3000/api/aelf/offices?date=2025-09-17&office=office_lectures&zone=romain"
    ) as any

    // Appel de notre endpoint
    await GET(request)

    // Vérification que l'appel à l'API AELF a bien été fait avec "lectures"
    expect(global.fetch).toHaveBeenCalledWith(
      "https://api.aelf.org/v1/heures/lectures?date=2025-09-17&zone=romain",
      expect.any(Object)
    )
  })

  it("devrait gérer correctement une erreur de l'API AELF", async () => {
    // Configuration du mock de fetch pour simuler une erreur
    ;(global.fetch as jest.Mock).mockRejectedValueOnce(new Error("API Error"))

    // Création d'une fausse requête
    const request = new MockNextRequest(
      "http://localhost:3000/api/aelf/offices?date=2025-09-17&office=laudes&zone=romain"
    ) as any

    // Appel de notre endpoint
    const response = await GET(request)
    const data = await response.json()

    // Vérifications
    expect(response.status).toBe(500)
    expect(data).toHaveProperty("error")
  })
})