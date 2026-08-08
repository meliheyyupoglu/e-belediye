import { NextResponse } from "next/server";
import { icerikleriGetir } from "@/lib/db";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const GECERLI_TIPLER = ["proje", "etkinlik", "basin"] as const;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tip = searchParams.get("tip")?.trim();

    if (!tip || !GECERLI_TIPLER.includes(tip as (typeof GECERLI_TIPLER)[number])) {
      return NextResponse.json(
        { error: "Geçerli tip parametresi gerekli: proje, etkinlik veya basin." },
        { status: 400 }
      );
    }

    const icerikler = await icerikleriGetir(tip);
    return NextResponse.json(icerikler);
  } catch (e) {
    console.error(e);
    return NextResponse.json([]);
  }
}
