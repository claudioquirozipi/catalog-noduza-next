"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

// Producto inexistente u oculto (por la tienda o por el límite del plan gratis) dentro de un negocio que sí existe: se muestra con los colores del negocio.
// Si el que no existe es el negocio, lo atiende src/app/not-found.tsx.
export default function ProductNotFound() {
  const { businessId } = useParams<{ businessId: string }>();

  return (
    <main className="mx-auto flex w-full max-w-md flex-col items-center px-4 py-24 text-center">
      <p className="text-5xl font-semibold text-foreground/30">404</p>
      <h1 className="mt-4 text-2xl font-semibold">Producto no disponible</h1>
      <p className="mt-2 text-foreground/70">Este producto ya no está en el catálogo o el enlace está mal escrito. Mira los demás productos de la tienda.</p>
      <Link
        href={`/${businessId}`}
        className="mt-6 rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
      >
        Ver el catálogo
      </Link>
    </main>
  );
}
