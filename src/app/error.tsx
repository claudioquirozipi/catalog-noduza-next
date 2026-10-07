"use client";

import { useEffect } from "react";

// También se usa dentro de cada negocio (src/app/[businessId]/error.tsx), donde hereda sus colores.
export default function CatalogError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center px-4 py-24 text-center">
      <h1 className="text-2xl font-semibold">No pudimos cargar el catálogo</h1>
      <p className="mt-2 text-foreground/70">Puede ser un problema de conexión. Inténtalo de nuevo en unos segundos.</p>
      <button
        type="button"
        onClick={retry}
        className="mt-6 rounded-md border border-foreground/25 px-4 py-2 font-medium transition-colors hover:bg-foreground/5"
      >
        Reintentar
      </button>
    </main>
  );
}
