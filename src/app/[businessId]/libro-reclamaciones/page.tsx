import type { Metadata } from "next";
import Link from "next/link";
import { getComplaintBusinessInfo } from "@/lib/api";
import { getBusinessOrNotFound } from "../catalog";
import { BookIcon } from "../icons";
import { ComplaintForm, ComplaintTracker } from "./complaint-form";

export async function generateMetadata({ params }: PageProps<"/[businessId]/libro-reclamaciones">): Promise<Metadata> {
  const { businessId } = await params;
  const business = await getBusinessOrNotFound(businessId);
  return {
    title: `Libro de Reclamaciones · ${business.name}`,
    description: `Registra un reclamo o una queja sobre ${business.name}, conforme a la Ley N° 29571.`,
    robots: { index: false },
  };
}

// Libro de reclamaciones virtual dentro del catálogo. Usa los colores del negocio a través del layout,
// como todas las páginas del negocio (ver [businessId]/layout.tsx).
export default async function ComplaintsBookPage({ params }: PageProps<"/[businessId]/libro-reclamaciones">) {
  const { businessId } = await params;
  // getBusinessOrNotFound responde 404 si el negocio no existe; el RUC solo lo da el endpoint de reclamos.
  const [business, legal] = await Promise.all([
    getBusinessOrNotFound(businessId),
    getComplaintBusinessInfo(businessId),
  ]);
  const address = legal.address?.trim() || business.address?.trim();

  return (
    <main className="mx-auto w-full max-w-3xl px-4 pt-6 pb-12">
      <Link href={`/${businessId}`} className="text-sm text-foreground/70 hover:underline print:hidden">
        ← Volver a {business.name}
      </Link>

      <header className="mt-4 flex items-start gap-3">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <BookIcon className="h-6 w-6" />
        </span>
        <div>
          <h1 className="text-2xl font-semibold sm:text-3xl">Libro de Reclamaciones</h1>
          <p className="text-sm text-foreground/60">Conforme al Código de Protección y Defensa del Consumidor (Ley N° 29571)</p>
        </div>
      </header>

      <section className="mt-6 rounded-xl border border-foreground/15 p-4 text-sm">
        <p className="font-semibold">{business.name}</p>
        {legal.taxId && <p className="text-foreground/70">RUC: {legal.taxId}</p>}
        {address && <p className="text-foreground/70">{address}</p>}
      </section>

      <ComplaintTracker businessId={businessId} />

      <ComplaintForm businessId={businessId} businessName={business.name} currency={business.currency} />

      <p className="mt-8 text-center text-xs text-foreground/50">
        La formulación del reclamo no impide acudir a otras vías de solución de controversias ni es requisito previo
        para interponer una denuncia ante el INDECOPI.
      </p>
    </main>
  );
}
