import { NextResponse } from "next/server";
import { getIcerikByTip } from "@/lib/icerik-seed";

export const dynamic = "force-dynamic";

const VALID_TIPS = ["proje", "etkinlik", "basin"] as const;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tip = searchParams.get("tip") || "";

    if (!VALID_TIPS.includes(tip as (typeof VALID_TIPS)[number])) {
      return NextResponse.json({ error: "Geçersiz tip" }, { status: 400 });
    }

    const icerikler = getIcerikByTip(tip);
    return NextResponse.json(icerikler);
  } catch (error) {
    console.error(error);
    return NextResponse.json([]);
  }
}
