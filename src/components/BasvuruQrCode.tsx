"use client";

interface BasvuruQrCodeProps {
  basvuruId: number;
}

export default function BasvuruQrCode({ basvuruId }: BasvuruQrCodeProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";
  const sorgulaUrl = siteUrl
    ? `${siteUrl}/sorgula?id=${basvuruId}`
    : `/sorgula?id=${basvuruId}`;

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(sorgulaUrl)}`;

  return (
    <div className="mt-4 flex items-center gap-4 rounded-lg border border-green-300/50 bg-white/60 p-3">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={qrUrl}
        alt={`Başvuru #${basvuruId} sorgulama QR kodu`}
        width={80}
        height={80}
        className="rounded border border-gray-200"
      />
      <div className="text-xs text-green-700">
        <p className="font-medium mb-1">QR kod ile sorgulayın</p>
        <a href={`/sorgula?id=${basvuruId}`} className="underline break-all">
          Başvuru takip bağlantısı
        </a>
      </div>
    </div>
  );
}
