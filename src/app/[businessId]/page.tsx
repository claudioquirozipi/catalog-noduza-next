import Link from "next/link";
import { notFound } from "next/navigation";
import { ApiError, getBusiness, getProducts, type Product } from "@/lib/api";

const PAGE_SIZE = 20;

export default async function CatalogPage({ params, searchParams }: PageProps<"/[businessId]">) {
  const { businessId } = await params;
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const [business, products] = await Promise.all([
    getBusiness(businessId).catch((error) => {
      if (error instanceof ApiError && error.status === 404) notFound();
      throw error;
    }),
    getProducts(businessId, page, PAGE_SIZE),
  ]);

  const totalPages = Math.max(1, Math.ceil(products.total / PAGE_SIZE));
  const formatPrice = new Intl.NumberFormat("es", {
    style: "currency",
    currency: business.currency,
  }).format;

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8">
      <header className="mb-8 flex items-center gap-4">
        {business.logo && (
          // eslint-disable-next-line @next/next/no-img-element -- las imágenes ya vienen optimizadas desde Cloudinary
          <img src={business.logo} alt="" className="h-16 w-16 rounded-full object-cover" />
        )}
        <div>
          <h1 className="text-2xl font-semibold">{business.name}</h1>
          {business.description && <p className="text-zinc-600">{business.description}</p>}
        </div>
      </header>

      {products.items.length === 0 ? (
        <p className="text-zinc-600">Este negocio aún no tiene productos.</p>
      ) : (
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {products.items.map((product) => (
            <ProductCard key={product.id} product={product} formatPrice={formatPrice} />
          ))}
        </ul>
      )}

      {totalPages > 1 && (
        <nav className="mt-8 flex items-center justify-center gap-4">
          {page > 1 && <Link href={`?page=${page - 1}`}>← Anterior</Link>}
          <span className="text-zinc-600">
            Página {page} de {totalPages}
          </span>
          {page < totalPages && <Link href={`?page=${page + 1}`}>Siguiente →</Link>}
        </nav>
      )}
    </main>
  );
}

function ProductCard({ product, formatPrice }: { product: Product; formatPrice: (n: number) => string }) {
  return (
    <li className="overflow-hidden rounded-lg border border-zinc-200">
      {product.imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element -- las imágenes ya vienen optimizadas desde Cloudinary
        <img
          src={product.imageUrl}
          alt={product.name}
          loading="lazy"
          className="aspect-square w-full object-cover"
        />
      ) : (
        <div className="aspect-square w-full bg-zinc-100" />
      )}
      <div className="p-3">
        <p className="text-xs text-zinc-500">{product.category.name}</p>
        <h2 className="font-medium">{product.name}</h2>
        <p className="mt-1 font-semibold">{formatPrice(Number(product.price))}</p>
        {product.stock === 0 && <p className="text-sm text-red-600">Agotado</p>}
      </div>
    </li>
  );
}
