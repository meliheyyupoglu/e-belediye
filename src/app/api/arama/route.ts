import { NextResponse } from "next/server";
import { DEPARTMANLAR } from "@/lib/constants";
import { MUDURLUK_BILGILERI } from "@/lib/mudurlukler";
import { MUDURLUK_TO_SLUG } from "@/lib/slug";
import { tumDuyurulariGetir } from "@/lib/db";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const STATIC_PAGES = [
  { title: "Ana Sayfa", href: "/", keywords: ["ana", "home"] },
  { title: "Başvuru Yap", href: "/basvuru", keywords: ["başvuru", "form", "şikayet"] },
  { title: "Başvuru Sorgula", href: "/sorgula", keywords: ["sorgula", "takip"] },
  { title: "Müdürlüklerimiz", href: "/mudurlukler", keywords: ["müdürlük"] },
  { title: "Duyurular", href: "/duyurular", keywords: ["duyuru", "haber"] },
  { title: "Başkan & Meclis", href: "/baskan-meclis", keywords: ["başkan", "meclis"] },
  { title: "İletişim", href: "/iletisim", keywords: ["iletişim", "telefon", "adres"] },
];

export async function GET(request: Request) {
  const q = new URL(request.url).searchParams.get("q")?.toLowerCase().trim() || "";
  if (!q || q.length < 2) return NextResponse.json([]);

  const results: { title: string; href: string; type: string; snippet: string }[] = [];

  for (const page of STATIC_PAGES) {
    if (page.title.toLowerCase().includes(q) || page.keywords.some((k) => k.includes(q))) {
      results.push({ title: page.title, href: page.href, type: "Sayfa", snippet: page.title });
    }
  }

  for (const ad of DEPARTMANLAR) {
    const bilgi = MUDURLUK_BILGILERI[ad];
    if (ad.toLowerCase().includes(q) || bilgi?.mudur?.toLowerCase().includes(q)) {
      results.push({
        title: ad,
        href: `/mudurlukler/${MUDURLUK_TO_SLUG[ad]}`,
        type: "Müdürlük",
        snippet: `Müdür: ${bilgi?.mudur}`,
      });
    }
  }

  try {
    const duyurular = await tumDuyurulariGetir();
    for (const d of duyurular) {
      if (d.title.toLowerCase().includes(q) || d.summary.toLowerCase().includes(q)) {
        results.push({
          title: d.title,
          href: `/duyurular/${d.id}`,
          type: "Duyuru",
          snippet: d.summary.slice(0, 80),
        });
      }
    }
  } catch { /* ignore */ }

  return NextResponse.json(results.slice(0, 10));
}
