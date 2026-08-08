"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="site-container py-20 text-center">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Bir hata oluştu</h1>
      <p className="text-gray-500 mb-6 max-w-md mx-auto">
        Sayfa yüklenirken bir sorun oluştu. Veritabanı bağlantısı yapılandırılmamış olabilir.
      </p>
      <button onClick={reset} className="btn-primary mr-3">
        Tekrar Dene
      </button>
      <a href="/" className="btn-secondary">
        Ana Sayfaya Dön
      </a>
      {process.env.NODE_ENV === "development" && (
        <pre className="mt-6 text-left text-xs text-red-500 bg-red-50 p-4 rounded-lg max-w-lg mx-auto overflow-auto">
          {error.message}
        </pre>
      )}
    </div>
  );
}
