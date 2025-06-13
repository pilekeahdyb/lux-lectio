"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { fetchRealLiturgicalReadings, validateAelfData } from "@/lib/real-aelf-api"

export function AelfTest() {
  const [testResult, setTestResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testRealAelf = async () => {
    setLoading(true)
    try {
      const today = new Date().toISOString().split("T")[0]
      const testDate = "2024-06-30" // Date que vous avez mentionnée

      console.log("🧪 Test de connexion RÉELLE à l'API AELF")

      // Test avec aujourd'hui
      const todayData = await fetchRealLiturgicalReadings(today)
      const testDateData = await fetchRealLiturgicalReadings(testDate)

      setTestResult({
        today: {
          date: today,
          data: todayData,
          valid: validateAelfData(todayData),
          lecturesCount: todayData.messes[0]?.lectures?.length || 0,
        },
        testDate: {
          date: testDate,
          data: testDateData,
          valid: validateAelfData(testDateData),
          lecturesCount: testDateData.messes[0]?.lectures?.length || 0,
        },
      })
    } catch (error) {
      setTestResult({
        error: error instanceof Error ? error.message : "Erreur inconnue",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Test de connexion AELF réelle</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={testRealAelf} disabled={loading}>
          {loading ? "Test en cours..." : "Tester la connexion AELF"}
        </Button>

        {testResult && (
          <div className="space-y-4">
            {testResult.error ? (
              <div className="p-4 bg-red-50 border border-red-200 rounded">
                <p className="text-red-800">Erreur: {testResult.error}</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Test aujourd'hui */}
                <div>
                  <h3 className="font-semibold mb-2">Test - Aujourd'hui ({testResult.today.date})</h3>
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge variant={testResult.today.valid ? "default" : "destructive"}>
                      {testResult.today.valid ? "✅ Données valides" : "❌ Données invalides"}
                    </Badge>
                    <Badge variant="secondary">Source: {testResult.today.data.source}</Badge>
                    <Badge variant="outline">{testResult.today.lecturesCount} lectures</Badge>
                  </div>
                  {testResult.today.data.messes[0]?.lectures && (
                    <div className="text-sm space-y-1">
                      {testResult.today.data.messes[0].lectures.map((lecture: any, i: number) => (
                        <div key={i} className="p-2 bg-gray-50 rounded">
                          <strong>{lecture.type}:</strong> {lecture.titre?.substring(0, 100)}...
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Test date spécifique */}
                <div>
                  <h3 className="font-semibold mb-2">Test - 30 juin 2024</h3>
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge variant={testResult.testDate.valid ? "default" : "destructive"}>
                      {testResult.testDate.valid ? "✅ Données valides" : "❌ Données invalides"}
                    </Badge>
                    <Badge variant="secondary">Source: {testResult.testDate.data.source}</Badge>
                    <Badge variant="outline">{testResult.testDate.lecturesCount} lectures</Badge>
                  </div>
                  {testResult.testDate.data.messes[0]?.lectures && (
                    <div className="text-sm space-y-1">
                      {testResult.testDate.data.messes[0].lectures.map((lecture: any, i: number) => (
                        <div key={i} className="p-2 bg-gray-50 rounded">
                          <strong>{lecture.type}:</strong> {lecture.titre?.substring(0, 100)}...
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
