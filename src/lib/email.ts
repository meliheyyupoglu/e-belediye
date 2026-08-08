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

async function sendEmail(payload: {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.log("[email] Resend yapılandırılmadı:", payload.subject, "→", payload.to);
    return { sent: false, reason: "email_not_configured" as const };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM || "e-Belediye <onboarding@resend.dev>",
        to: Array.isArray(payload.to) ? payload.to : [payload.to],
        subject: payload.subject,
        html: payload.html,
        ...(payload.replyTo ? { reply_to: payload.replyTo } : {}),
      }),
    });
    return { sent: res.ok, reason: res.ok ? ("ok" as const) : ("api_error" as const) };
  } catch {
    return { sent: false, reason: "network_error" as const };
  }
}

export async function sendStatusChangeEmail(data: {
  to?: string;
  adSoyad: string;
  basvuruId: number;
  eskiDurum: string;
  yeniDurum: string;
  konu: string;
}) {
  if (!data.to) {
    console.log(
      `[email] Durum değişikliği #${data.basvuruId}: ${data.eskiDurum} → ${data.yeniDurum} (alıcı yok)`
    );
    return { sent: false, reason: "email_not_configured" as const };
  }

  const sorgulaUrl = `${process.env.NEXT_PUBLIC_SITE_URL || ""}/sorgula?id=${data.basvuruId}`;

  return sendEmail({
    to: data.to,
    subject: `Başvuru Durumu Güncellendi - #${data.basvuruId}`,
    html: `
      <h2>T.C. Dörtyol Belediyesi</h2>
      <p>Sayın ${data.adSoyad},</p>
      <p><strong>#${data.basvuruId}</strong> numaralı başvurunuzun durumu güncellendi.</p>
      <ul>
        <li><strong>Konu:</strong> ${data.konu}</li>
        <li><strong>Önceki durum:</strong> ${data.eskiDurum}</li>
        <li><strong>Yeni durum:</strong> ${data.yeniDurum}</li>
      </ul>
      <p>Başvurunuzu sorgulamak için: <a href="${sorgulaUrl}">${sorgulaUrl}</a></p>
    `,
  });
}

export async function sendOtpEmail(data: { to: string; adSoyad?: string; otp: string }) {
  if (!process.env.RESEND_API_KEY) {
    console.log(`[email] OTP ${data.otp} → ${data.to}${data.adSoyad ? ` (${data.adSoyad})` : ""}`);
    return { sent: false, reason: "email_not_configured" as const };
  }

  return sendEmail({
    to: data.to,
    subject: "Doğrulama Kodunuz - Dörtyol e-Belediye",
    html: `
      <h2>T.C. Dörtyol Belediyesi</h2>
      <p>${data.adSoyad ? `Sayın ${data.adSoyad},` : "Merhaba,"}</p>
      <p>e-Belediye doğrulama kodunuz:</p>
      <p style="font-size:24px;font-weight:bold;letter-spacing:4px">${data.otp}</p>
      <p>Bu kodu kimseyle paylaşmayın. Kod 10 dakika geçerlidir.</p>
    `,
  });
}

export async function sendDuyuruEmail(data: {
  to: string | string[];
  baslik: string;
  ozet: string;
  link?: string;
}) {
  const recipients = Array.isArray(data.to) ? data.to : [data.to];

  if (!process.env.RESEND_API_KEY) {
    console.log(`[email] Duyuru "${data.baslik}" → ${recipients.length} abone`);
    return { sent: false, reason: "email_not_configured" as const };
  }

  return sendEmail({
    to: recipients,
    subject: `[Duyuru] ${data.baslik}`,
    html: `
      <h2>T.C. Dörtyol Belediyesi</h2>
      <h3>${data.baslik}</h3>
      <p>${data.ozet}</p>
      ${data.link ? `<p><a href="${data.link}">Detayları görüntüle</a></p>` : ""}
      <p style="font-size:12px;color:#666">Bu e-postayı duyuru aboneliğiniz nedeniyle aldınız.</p>
    `,
  });
}

export async function sendOtpEmail(data: { to: string; kod: string; adSoyad?: string }) {
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
        subject: "e-Belediye Doğrulama Kodu",
        html: `
          <h2>T.C. Dörtyol Belediyesi</h2>
          ${data.adSoyad ? `<p>Sayın ${data.adSoyad},</p>` : "<p>Sayın vatandaşımız,</p>"}
          <p>Başvuru geçmişi sorgulama doğrulama kodunuz:</p>
          <p style="font-size:28px;font-weight:bold;letter-spacing:4px;">${data.kod}</p>
          <p>Bu kod 10 dakika geçerlidir. Kimseyle paylaşmayın.</p>
        `,
      }),
    });
    return { sent: res.ok, reason: res.ok ? "ok" : "api_error" };
  } catch {
    return { sent: false, reason: "network_error" };
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
