import { NextResponse } from "next/server";
import { findFaqAnswer } from "@/lib/faq";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const { message } = await request.json();
  if (!message?.trim()) {
    return NextResponse.json({ reply: "Lütfen bir mesaj yazın." });
  }
  const reply = findFaqAnswer(message.trim());
  return NextResponse.json({ reply });
}
