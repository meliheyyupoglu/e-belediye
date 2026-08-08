export async function sendBasvuruEmail(data: {
  to?: string;
  adSoyad: string;
  basvuruId: number;
  departman: string;
  konu: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || !data.to) return { sent: false, reason: "email_not_configured" };

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM || "e-Belediye <onboarding@resend.dev>",
        to: [data.to],
        subject: `Başvurunuz Alındı - #${data.basvuruId}`,
        html: `
          <h2>T.C. Dörtyol Belediyesi</h2>
          <p>Sayın ${data.adSoyad},</p>
          <p>Başvurunuz başarıyla alınmıştır.</p>
          <ul>
            <li><strong>Başvuru No:</strong> #${data.basvuruId}</li>
            <li><strong>Müdürlük:</strong> ${data.departman}</li>
            <li><strong>Konu:</strong> ${data.konu}</li>
          </ul>
          <p>Başvurunuzu sorgulamak için: ${process.env.NEXT_PUBLIC_SITE_URL || ""}/sorgula?id=${data.basvuruId}</p>
        `,
      }),
    });
    return { sent: res.ok, reason: res.ok ? "ok" : "api_error" };
  } catch {
    return { sent: false, reason: "network_error" };
  }
}

export async function sendIletisimEmail(data: {
  adSoyad: string;
  email: string;
  konu: string;
  mesaj: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!apiKey || !adminEmail) return { sent: false };

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM || "e-Belediye <onboarding@resend.dev>",
        to: [adminEmail],
        reply_to: data.email,
        subject: `[İletişim] ${data.konu}`,
        html: `<p><strong>${data.adSoyad}</strong> (${data.email})</p><p>${data.mesaj}</p>`,
      }),
    });
    return { sent: res.ok };
  } catch {
    return { sent: false };
  }
}

export async function sendSmsNotification(telefon: string, mesaj: string) {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_PHONE_NUMBER;
  if (!sid || !token || !from) return { sent: false, reason: "sms_not_configured" };

  try {
    const auth = Buffer.from(`${sid}:${token}`).toString("base64");
    const body = new URLSearchParams({ To: telefon, From: from, Body: mesaj });
    const res = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`,
      {
        method: "POST",
        headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
      }
    );
    return { sent: res.ok, reason: res.ok ? "ok" : "api_error" };
  } catch {
    return { sent: false, reason: "network_error" };
  }
}
