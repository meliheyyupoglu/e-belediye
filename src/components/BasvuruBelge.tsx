"use client";

import { useRef } from "react";
import type { Basvuru } from "@/lib/db";
import { BELEDIYE_ADI } from "@/lib/constants";
import BelediyeLogo from "@/components/BelediyeLogo";

interface Props {
  basvuru: Basvuru;
}

export default function BasvuruBelge({ basvuru }: Props) {
  const printRef = useRef<HTMLDivElement>(null);
  const siteUrl = typeof window !== "undefined" ? window.location.origin : "";
  const sorguUrl = `${siteUrl}/sorgula?id=${basvuru.id}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(sorguUrl)}`;

  function handlePrint() {
    const content = printRef.current;
    if (!content) return;

    const win = window.open("", "_blank", "width=800,height=900");
    if (!win) return;

    win.document.write(`
      <!DOCTYPE html>
      <html lang="tr">
        <head>
          <meta charset="utf-8" />
          <title>Başvuru Belgesi #${basvuru.id}</title>
          <style>
            body { font-family: system-ui, sans-serif; padding: 24px; color: #111; }
            .header { display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid #084298; padding-bottom: 16px; margin-bottom: 20px; }
            .title { font-size: 18px; font-weight: 700; color: #084298; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size: 13px; }
            .label { color: #666; font-size: 11px; margin-bottom: 2px; }
            .value { font-weight: 600; }
            .full { grid-column: 1 / -1; }
            .qr { text-align: center; margin-top: 20px; padding-top: 16px; border-top: 1px dashed #ccc; }
            .footer { margin-top: 24px; font-size: 11px; color: #666; text-align: center; }
          </style>
        </head>
        <body>${content.innerHTML}</body>
      </html>
    `);
    win.document.close();
    win.focus();
    win.print();
  }

  return (
    <div className="mt-4 pt-4 border-t border-gray-100">
      <div className="flex flex-wrap gap-2 mb-4">
        <button type="button" onClick={handlePrint} className="btn-secondary text-sm">
          Başvuru Belgesini Yazdır
        </button>
      </div>

      <div
        ref={printRef}
        className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-5 print:bg-white"
      >
        <div className="header flex items-start justify-between gap-4 border-b border-gray-200 pb-4 mb-4">
          <BelediyeLogo size="sm" />
          <div className="text-right">
            <p className="title text-sm font-bold text-primary">Başvuru Belgesi</p>
            <p className="text-lg font-bold text-gray-900">#{basvuru.id}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          {[
            ["Ad Soyad", basvuru.ad_soyad],
            ["TC Kimlik No", basvuru.tc_no.replace(/(\d{3})(\d{5})(\d{3})/, "$1*****$3")],
            ["Telefon", basvuru.telefon],
            ["Müdürlük", basvuru.departman],
            ["Konu", basvuru.konu],
            ["Durum", basvuru.durum],
            ["Tarih", basvuru.tarih],
          ].map(([label, value]) => (
            <div key={label as string}>
              <p className="label text-xs text-gray-400">{label}</p>
              <p className="value font-medium text-gray-800">{value}</p>
            </div>
          ))}
          <div className="full sm:col-span-2">
            <p className="label text-xs text-gray-400">Detay</p>
            <p className="text-gray-700">{basvuru.detay}</p>
          </div>
        </div>

        <div className="qr flex flex-col items-center gap-2 mt-5 pt-4 border-t border-dashed border-gray-200">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={qrUrl} alt="Başvuru sorgulama QR kodu" width={120} height={120} className="rounded" />
          <p className="text-xs text-gray-500 text-center">
            QR kodu okutarak başvurunuzu sorgulayabilirsiniz
          </p>
        </div>

        <p className="footer mt-4 text-xs text-gray-400 text-center">
          {BELEDIYE_ADI} — e-Belediye Vatandaş Başvuru Sistemi
        </p>
      </div>
    </div>
  );
}
