import { Suspense } from "react";
import HaritaSikayetBasvuruClient from "@/components/HaritaSikayetBasvuruClient";

export default function HaritaBasvuruFormPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-500">Form yükleniyor...</div>}>
      <HaritaSikayetBasvuruClient />
    </Suspense>
  );
}
