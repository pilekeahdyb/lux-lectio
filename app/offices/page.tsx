"use client";

import { useState, useEffect } from "react";
import { Sun, Sunrise, Sunset, Moon, Star, BookOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLiturgical } from "@/components/liturgical-provider";

const offices = [
	{
		id: "office-lectures",
		name: "Office des lectures",
		time: "Nuit",
		icon: Star,
		description: "Prière de la nuit avec lectures patristiques",
	},
	{
		id: "laudes",
		name: "Laudes",
		time: "Matin",
		icon: Sunrise,
		description: "Prière du matin, louange de l'aurore",
	},
	{
		id: "tierce",
		name: "Tierce",
		time: "9h",
		icon: Sun,
		description: "Prière de la troisième heure",
	},
	{
		id: "sexte",
		name: "Sexte",
		time: "12h",
		icon: Sun,
		description: "Prière de la sixième heure",
	},
	{
		id: "none",
		name: "None",
		time: "15h",
		icon: Sun,
		description: "Prière de la neuvième heure",
	},
	{
		id: "vepres",
		name: "Vêpres",
		time: "Soir",
		icon: Sunset,
		description: "Prière du soir, action de grâce",
	},
	{
		id: "complies",
		name: "Complies",
		time: "Nuit",
		icon: Moon,
		description: "Prière avant le repos nocturne",
	},
];

async function fetchOfficeFromApi(type: string, date: string) {
	const url = `/api/aelf/${type}?date=${date}`;
	const res = await fetch(url);
	if (!res.ok) throw new Error("Erreur lors de la récupération de l'office (API interne)");
	return await res.json();
}

export default function OfficesPage() {
	const { liturgicalData, currentDate } = useLiturgical();
	const [selectedOffice, setSelectedOffice] = useState<string | null>(null);
	const [officeContent, setOfficeContent] = useState<any | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!selectedOffice) return;
		setLoading(true);
		setError(null);
		const type = selectedOffice === "office-lectures" ? "lectures" : selectedOffice;
		fetchOfficeFromApi(type, currentDate.toISOString().slice(0, 10))
			.then((data) => setOfficeContent(data))
			.catch((e) => setError(e.message))
			.finally(() => setLoading(false));
	}, [selectedOffice, currentDate]);

	const formatLiturgicalDate = (date: Date) => {
		return date.toLocaleDateString("fr-FR", {
			weekday: "long",
			day: "numeric",
			month: "long",
			year: "numeric",
		});
	};

	const generateOfficeContent = (officeId: string) => {
		// Contenu simulé - dans une vraie app, ceci viendrait de l'API
		const contents = {
			"office-lectures": {
				antienne: "Venez, adorons le Seigneur, le roi des rois.",
				psaumes: [
					{
						numero: "Ps 94",
						titre: "Invitation à louer Dieu",
						antienne:
							"Aujourd'hui, ne fermez pas votre cœur, mais écoutez la voix du Seigneur.",
						texte:
							"Venez, crions de joie pour le Seigneur, acclamons notre Rocher, notre salut ! Allons jusqu'à lui en rendant grâce, par nos hymnes de fête acclamons-le !",
					},
				],
				lecture: {
					reference: "1 Th 5, 1-11",
					titre:
						"Lecture de la première lettre de saint Paul Apôtre aux Thessaloniciens",
					texte:
						"Pour ce qui est des temps et des moments, frères, vous n'avez pas besoin qu'on vous en écrive. Vous savez très bien vous-mêmes que le jour du Seigneur vient comme un voleur dans la nuit.",
				},
				responsoire:
					"R/ Le Seigneur est ma lumière et mon salut. V/ De qui aurais-je crainte ?",
			},
			laudes: {
				antienne: "Que tout ce qui respire loue le Seigneur !",
				psaumes: [
					{
						numero: "Ps 62",
						titre: "L'âme qui cherche Dieu",
						antienne: "Dieu, tu es mon Dieu, je te cherche dès l'aube.",
						texte:
							"Dieu, tu es mon Dieu, je te cherche dès l'aube : mon âme a soif de toi ; après toi languit ma chair, terre aride, altérée, sans eau.",
					},
				],
				cantique: {
					reference: "Cantique de Zacharie (Lc 1, 68-79)",
					antienne:
						"Béni soit le Seigneur, le Dieu d'Israël, qui visite et rachète son peuple.",
					texte:
						"Béni soit le Seigneur, le Dieu d'Israël, qui visite et rachète son peuple, et nous donne un sauveur puissant dans la maison de David, son serviteur.",
				},
				priere:
					"Dieu qui nous as donné de parvenir au soir de ce jour, garde-nous sans péché durant cette nuit, et fais que nous puissions te louer au matin. Par Jésus, le Christ, notre Seigneur. Amen.",
			},
		};

		return contents[officeId as keyof typeof contents] || null;
	};

	return (
		<div className="p-6 max-w-4xl mx-auto">
			<div className="mb-6">
				<h1 className="text-3xl font-bold text-liturgical-primary mb-2">
					Offices des heures
				</h1>
				<p className="text-muted-foreground">
					La prière de l'Église pour sanctifier les heures du jour
				</p>
				<p className="text-sm text-liturgical-primary font-medium mt-2">
					{formatLiturgicalDate(currentDate)}
				</p>
			</div>

			{!selectedOffice ? (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{offices.map((office) => (
						<Card
							key={office.id}
							className="cursor-pointer hover:shadow-lg transition-shadow border-liturgical-primary/20 hover:border-liturgical-primary/40"
							onClick={() => setSelectedOffice(office.id)}
						>
							<CardHeader className="text-center">
								<div className="flex justify-center mb-2">
									<office.icon className="h-8 w-8 text-liturgical-primary" />
								</div>
								<CardTitle className="text-liturgical-primary">
									{office.name}
								</CardTitle>
								<Badge variant="secondary" className="mx-auto">
									{office.time}
								</Badge>
							</CardHeader>
							<CardContent>
								<p className="text-sm text-center text-muted-foreground">
									{office.description}
								</p>
							</CardContent>
						</Card>
					))}
				</div>
			) : (
				<div className="space-y-6">
					<div className="flex items-center justify-between">
						<h2 className="text-2xl font-bold text-liturgical-primary">
							{
								offices.find((o) => o.id === selectedOffice)?.name
							}
						</h2>
						<Button
							variant="outline"
							onClick={() => { setSelectedOffice(null); setOfficeContent(null); }}
						>
							Retour aux offices
						</Button>
					</div>
					{loading ? (
						<p className="text-center text-muted-foreground">Chargement…</p>
					) : error ? (
						<p className="text-center text-red-500">{error}</p>
					) : officeContent ? (
						<div className="space-y-6">
							{/* Affichage dynamique du contenu de l'office depuis l'API AELF */}
							{officeContent && officeContent.sections && Array.isArray(officeContent.sections) && (
  <div className="space-y-6">
    {officeContent.sections.map((section: any, idx: number) => {
      switch (section.type) {
        case "introduction":
          return (
            <Card key={idx} className="border-liturgical-primary/30">
              <CardHeader>
                <CardTitle className="text-liturgical-primary">{section.titre || "Introduction"}</CardTitle>
              </CardHeader>
              <CardContent>
                {section.contenu && <p className="italic text-liturgical-primary font-medium">{section.contenu}</p>}
                {section.extra?.repons && <p className="italic text-liturgical-primary mt-2">R/ {section.extra.repons}</p>}
              </CardContent>
            </Card>
          );
        case "invitatoire":
          return (
            <Card key={idx} className="border-liturgical-primary/20">
              <CardHeader>
                <CardTitle className="text-liturgical-primary">{section.titre || "Invitatoire"}</CardTitle>
                {section.antienne && <p className="text-sm italic text-muted-foreground">Ant. {section.antienne}</p>}
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  {section.contenu?.versets?.map((v: any, i: number) => <p key={i}><b>{v.numero}</b> {v.texte}</p>)}
                </div>
              </CardContent>
            </Card>
          );
        case "hymne":
          return (
            <Card key={idx} className="border-amber-200 dark:border-amber-800">
              <CardHeader>
                <CardTitle className="text-amber-800 dark:text-amber-200">{section.titre || "Hymne"}</CardTitle>
                {section.extra?.auteur && <p className="text-xs text-muted-foreground">{section.extra.auteur}</p>}
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  {Array.isArray(section.contenu) ? section.contenu.map((line: string, i: number) => <p key={i}>{line}</p>) : <p>{section.contenu}</p>}
                </div>
              </CardContent>
            </Card>
          );
        case "psaume":
        case "cantique":
          return (
            <Card key={idx}>
              <CardHeader>
                <CardTitle className="text-lg">
                  {section.titre && <span className="font-semibold">{section.titre}</span>}
                  {section.contenu?.numero && <span className="ml-2 text-xs text-muted-foreground">({section.contenu.numero})</span>}
                </CardTitle>
                {section.antienne && <p className="text-sm italic text-muted-foreground">Ant. {section.antienne}</p>}
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  {section.contenu?.versets?.map((v: any, i: number) => <p key={i}><b>{v.numero}</b> {v.texte}</p>)}
                </div>
              </CardContent>
            </Card>
          );
        case "lecture":
          return (
            <Card key={idx} className="border-blue-200 dark:border-blue-800">
              <CardHeader>
                <CardTitle className="text-blue-800 dark:text-blue-200">{section.titre || "Lecture"}</CardTitle>
                {section.reference && <p className="text-sm text-blue-600 dark:text-blue-300">{section.reference}</p>}
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <p>{section.contenu}</p>
                </div>
              </CardContent>
            </Card>
          );
        case "repons":
          return (
            <Card key={idx} className="bg-liturgical-primary/5">
              <CardContent className="p-4">
                {Array.isArray(section.contenu) ? (
                  section.contenu.map((v: string, i: number) => <p key={i}>{v}</p>)
                ) : (
                  <p className="text-liturgical-primary font-medium">{section.contenu}</p>
                )}
              </CardContent>
            </Card>
          );
        case "cantique-evangelique":
          return (
            <Card key={idx} className="border-green-200 dark:border-green-800">
              <CardHeader>
                <CardTitle className="text-green-800 dark:text-green-200">{section.titre || "Cantique évangélique"}</CardTitle>
                {section.reference && <p className="text-xs text-muted-foreground">{section.reference}</p>}
                {section.antienne && <p className="text-sm italic text-green-600 dark:text-green-300">Ant. {section.antienne}</p>}
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  {Array.isArray(section.contenu) ? section.contenu.map((v: string, i: number) => <p key={i}>{v}</p>) : <p>{section.contenu}</p>}
                </div>
              </CardContent>
            </Card>
          );
        case "intercessions":
          return (
            <Card key={idx} className="border-lime-200 dark:border-lime-800">
              <CardHeader>
                <CardTitle className="text-lime-800 dark:text-lime-200">{section.titre || "Intercessions"}</CardTitle>
                {section.extra?.refrain && <p className="text-sm italic text-lime-600 dark:text-lime-300">R/ {section.extra.refrain}</p>}
              </CardHeader>
              <CardContent>
                <ul className="list-disc ml-6">
                  {Array.isArray(section.contenu) && section.contenu.map((inter: string, i: number) => (
                    <li key={i}>{inter}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          );
        case "notre-pere":
          return (
            <Card key={idx} className="border-liturgical-primary/30">
              <CardHeader>
                <CardTitle className="text-liturgical-primary">Notre Père</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="italic whitespace-pre-line">{section.contenu}</pre>
              </CardContent>
            </Card>
          );
        case "oraison":
          return (
            <Card key={idx} className="border-liturgical-primary/30">
              <CardHeader>
                <CardTitle className="text-liturgical-primary">Oraison</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="italic">{section.contenu}</p>
              </CardContent>
            </Card>
          );
        case "te-deum":
          return (
            <Card key={idx} className="border-purple-200 dark:border-purple-800">
              <CardHeader>
                <CardTitle className="text-purple-800 dark:text-purple-200">Te Deum</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{section.contenu}</p>
              </CardContent>
            </Card>
          );
        case "antienne-mariale":
          return (
            <Card key={idx} className="border-pink-200 dark:border-pink-800">
              <CardHeader>
                <CardTitle className="text-pink-800 dark:text-pink-200">Antienne mariale</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{section.contenu}</p>
              </CardContent>
            </Card>
          );
        case "examen-conscience":
          return (
            <Card key={idx} className="border-slate-200 dark:border-slate-800">
              <CardHeader>
                <CardTitle className="text-slate-800 dark:text-slate-200">Examen de conscience</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{section.contenu}</p>
              </CardContent>
            </Card>
          );
        default:
          return (
            <Card key={idx}>
              <CardHeader>
                <CardTitle>{section.titre || section.type}</CardTitle>
              </CardHeader>
              <CardContent>
                <pre>{JSON.stringify(section.contenu, null, 2)}</pre>
              </CardContent>
            </Card>
          );
      }
    })}
  </div>
)}
						</div>
					) : (
						<Card>
							<CardContent className="p-8 text-center">
								<BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
								<p className="text-muted-foreground">
									Contenu de cet office en cours de développement.
								</p>
								<p className="text-sm text-muted-foreground mt-2">
									Bientôt disponible avec l'intégration complète de
									l'API liturgique.
								</p>
							</CardContent>
						</Card>
					)}
				</div>
			)}
		</div>
	);
}
