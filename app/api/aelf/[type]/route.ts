import { NextRequest } from "next/server";
import { scrapeAelfOffice } from "@/lib/aelf-scraper";

export async function GET(req: NextRequest, { params }: { params: { type: string } }) {
  const { type } = params;
  const date = req.nextUrl.searchParams.get("date") || undefined;
  if (!type) {
    return new Response(JSON.stringify({ error: "Type d'office manquant" }), { status: 400 });
  }
  try {
    const office = await scrapeAelfOffice(type, date);
    return new Response(JSON.stringify(office), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message || "Erreur lors du scraping AELF" }), { status: 500 });
  }
}
