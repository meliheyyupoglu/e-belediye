import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-api";
import { tumBasvurulariGetir, type Basvuru } from "@/lib/db";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const HEADERS = [
  "id", "ad_soyad", "telefon", "email", "departman", "konu", "detay",
  "durum", "notlar", "atanan", "ic_not", "basvuru_tipi", "adres",
  "cadde_sokak", "tarih", "belge_dosya", "belge_url",
] as const;

function escapeCsv(value: unknown): string {
  const s = String(value ?? "");
  if (s.includes(",") || s.includes('"') || s.includes("\n")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

export async function GET(request: Request) {
  const auth = requireAdmin(request);
  if (auth) return auth;

  try {
    const basvurular = await tumBasvurulariGetir();
    const lines = [
      HEADERS.join(","),
      ...basvurular.map((b) =>
        HEADERS.map((h) => escapeCsv(b[h as keyof Basvuru])).join(",")
      ),
    ];
    const csv = "\uFEFF" + lines.join("\n");
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="basvurular_${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Dışa aktarma hatası" }, { status: 500 });
  }
}
