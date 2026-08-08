import { headers } from "next/headers";
import type { Icerik } from "@/lib/db";

export async function fetchIcerikFromApi(tip: string): Promise<Icerik[]> {
  const h = headers();
  const host = h.get("host") || "localhost:3000";
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http";

  try {
    const res = await fetch(`${protocol}://${host}/api/icerik?tip=${tip}`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}
