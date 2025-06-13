import { AelfTest } from "@/components/aelf-test"

export default function TestAelfPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Test de connexion AELF</h1>
        <p className="text-muted-foreground">
          Cette page permet de tester la connexion réelle à l'API AELF et de vérifier que nous récupérons les vraies
          lectures liturgiques.
        </p>
      </div>

      <AelfTest />
    </div>
  )
}
