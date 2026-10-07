// Esqueleto del catálogo mientras llegan los productos (también al cambiar de página).
// Vive en el grupo (catalog) para no aplicarse al detalle de producto: si el detalle
// mostrara un esqueleto, la transición compartida de imagen y nombre no se reproduciría.
export default function CatalogLoading() {
  return (
    <main className="mx-auto w-full max-w-6xl animate-pulse px-4 pt-4 pb-12" aria-busy="true" aria-label="Cargando catálogo">
      <div className="mb-8">
        <div className="h-28 rounded-2xl bg-foreground/10 sm:h-44" />
        <div className="px-4 sm:px-6">
          <div className="-mt-12 h-24 w-24 rounded-full bg-foreground/15 ring-4 ring-background sm:-mt-14 sm:h-28 sm:w-28" />
          <div className="mt-3 h-8 w-56 rounded bg-foreground/10" />
          <div className="mt-2 h-4 w-80 max-w-full rounded bg-foreground/10" />
        </div>
      </div>

      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }, (_, i) => (
          <li key={i} className="overflow-hidden rounded-lg border border-foreground/15">
            <div className="aspect-square w-full bg-foreground/10" />
            <div className="space-y-2 p-3">
              <div className="h-3 w-16 rounded bg-foreground/10" />
              <div className="h-4 w-3/4 rounded bg-foreground/10" />
              <div className="h-4 w-1/3 rounded bg-foreground/10" />
              <div className="h-8 w-full rounded-md bg-foreground/10" />
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
