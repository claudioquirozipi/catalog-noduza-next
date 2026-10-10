import Form from "next/form";
import Link from "next/link";
import { SearchIcon } from "../icons";

// URL del catálogo conservando la búsqueda; la página 1 no se escribe en la URL.
export function catalogHref(businessId: string, { q, page }: { q?: string; page?: number }) {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (page && page > 1) params.set("page", String(page));
  const query = params.toString();
  return `/${businessId}${query ? `?${query}` : ""}`;
}

export function ProductSearch({ businessId, q }: { businessId: string; q: string }) {
  return (
    // Al enviar navega a /[businessId]?q=..., sin `page`, así cada búsqueda empieza en la página 1.
    <Form action={`/${businessId}`} role="search" className="mb-6 flex gap-2">
      <label className="relative flex-1">
        <span className="sr-only">Buscar productos</span>
        <SearchIcon className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-foreground/50" />
        <input
          // `key` reinicia el valor al navegar (por ejemplo al pulsar "Ver todos").
          key={q}
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Buscar productos…"
          className="w-full rounded-md border border-foreground/25 bg-background py-2 pr-3 pl-9"
        />
      </label>
      <button
        type="submit"
        className="rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
      >
        Buscar
      </button>
    </Form>
  );
}

// Páginas a mostrar: la primera, la última y las vecinas de la actual; null marca un salto (…).
function pageItems(page: number, totalPages: number): (number | null)[] {
  const pages = [...new Set([1, page - 1, page, page + 1, totalPages])]
    .filter((p) => p >= 1 && p <= totalPages)
    .sort((a, b) => a - b);

  const items: (number | null)[] = [];
  pages.forEach((p, i) => {
    const prev = pages[i - 1];
    // Si solo falta una página entre dos números se muestra en vez de "…".
    if (prev !== undefined && p - prev === 2) items.push(prev + 1);
    else if (prev !== undefined && p - prev > 2) items.push(null);
    items.push(p);
  });
  return items;
}

export function Pagination({
  businessId,
  q,
  page,
  totalPages,
}: {
  businessId: string;
  q: string;
  page: number;
  totalPages: number;
}) {
  const href = (p: number) => catalogHref(businessId, { q, page: p });
  const itemClass = "flex h-9 min-w-9 items-center justify-center rounded-md px-2";

  return (
    <nav aria-label="Páginas del catálogo" className="mt-8 flex flex-wrap items-center justify-center gap-1">
      {page > 1 && (
        <Link href={href(page - 1)} className={`${itemClass} hover:bg-foreground/5`}>
          ← <span className="ml-1 hidden sm:inline">Anterior</span>
        </Link>
      )}

      {pageItems(page, totalPages).map((p, i) =>
        p === null ? (
          <span key={`gap-${i}`} className={`${itemClass} text-foreground/50`} aria-hidden="true">
            …
          </span>
        ) : p === page ? (
          <span key={p} aria-current="page" className={`${itemClass} bg-primary font-medium text-primary-foreground`}>
            {p}
          </span>
        ) : (
          <Link key={p} href={href(p)} aria-label={`Página ${p}`} className={`${itemClass} hover:bg-foreground/5`}>
            {p}
          </Link>
        ),
      )}

      {page < totalPages && (
        <Link href={href(page + 1)} className={`${itemClass} hover:bg-foreground/5`}>
          <span className="mr-1 hidden sm:inline">Siguiente</span> →
        </Link>
      )}
    </nav>
  );
}
