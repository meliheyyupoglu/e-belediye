import { NextResponse } from "next/server";
import { findFaqAnswer } from "@/lib/faq";

export const dynamic = "force-dynamic";

async function getOpenAiReply(message: string): Promise<string | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "Sen T.C. Dörtyol Belediyesi e-Belediye dijital asistanısın. Türkçe, kısa ve yardımcı yanıtlar ver. Başvuru (/basvuru), sorgulama (/sorgula), müdürlükler, iletişim (444 7 712) ve belediye hizmetleri hakkında bilgi ver. Bilmediğin konularda vatandaşı resmi kanallara yönlendir.",
          },
          { role: "user", content: message },
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!res.ok) {
      console.error("OpenAI API hatası:", res.status);
      return null;
    }

    const data = await res.json();
    return data.choices?.[0]?.message?.content?.trim() || null;
  } catch (e) {
    console.error("OpenAI istek hatası:", e);
    return null;
  }
}

export async function POST(request: Request) {
  const { message } = await request.json();
  if (!message?.trim()) {
    return NextResponse.json({ reply: "Lütfen bir mesaj yazın." });
  }

  const trimmed = message.trim();
  const aiReply = await getOpenAiReply(trimmed);
  const reply = aiReply ?? findFaqAnswer(trimmed);

  return NextResponse.json({ reply });
}
