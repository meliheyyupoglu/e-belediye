import { Suspense } from "react";
import HaritaSikayetWorkspace from "@/components/HaritaSikayetWorkspace";

export default function HaritaBasvuruPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-500">Harita yükleniyor...</div>}>
      <HaritaSikayetWorkspace />
    </Suspense>
  );
}
