import { Suspense } from "react";
import SorgulaPage from "./SorgulaClient";

export default function Page() {
  return (
    <Suspense fallback={<p className="text-gray-500">Yükleniyor...</p>}>
      <SorgulaPage />
    </Suspense>
  );
}
