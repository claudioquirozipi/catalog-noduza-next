import { ViewTransition } from "react";
import Link from "next/link";
import { getProducts, type Product } from "@/lib/api";
import { AddToCartButton } from "./cart";
import { getBusinessOrNotFound, priceFormatter, productNameTransition, toCartProduct } from "./catalog";
import { ProductImage } from "./product-image";

const PAGE_SIZE = 20;

export default async function CatalogPage({ params, searchParams }: PageProps<"/[businessId]">) {
  const { businessId } = await params;
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const [business, products] = await Promise.all([
    getBusinessOrNotFound(businessId),
    getProducts(businessId, page, PAGE_SIZE),
  ]);

  const totalPages = Math.max(1, Math.ceil(products.total / PAGE_SIZE));
  const formatPrice = priceFormatter(business.currency);

  return (
    <main className="mx-auto w-full max-w-6xl px-4 pt-8 pb-24">
      <header className="mb-8 flex items-center gap-4">
        {business.logo && (
          // eslint-disable-next-line @next/next/no-img-element -- las imágenes ya vienen optimizadas desde Cloudinary
          <img src={business.logo} alt="" className="h-16 w-16 rounded-full object-cover" />
        )}
        <div>
          <h1 className="text-2xl font-semibold">{business.name}</h1>
          {business.description && <p className="text-foreground/70">{business.description}</p>}
        </div>
      </header>

      {products.items.length === 0 ? (
        <p className="text-foreground/70">Este negocio aún no tiene productos.</p>
      ) : (
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {products.items.map((product) => (
            <ProductCard key={product.id} businessId={businessId} product={product} formatPrice={formatPrice} />
          ))}
        </ul>
      )}

      {totalPages > 1 && (
        <nav className="mt-8 flex items-center justify-center gap-4">
          {page > 1 && <Link href={`?page=${page - 1}`}>← Anterior</Link>}
          <span className="text-foreground/70">
            Página {page} de {totalPages}
          </span>
          {page < totalPages && <Link href={`?page=${page + 1}`}>Siguiente →</Link>}
        </nav>
      )}
    </main>
  );
}

function ProductCard({
  businessId,
  product,
  formatPrice,
}: {
  businessId: string;
  product: Product;
  formatPrice: (n: number) => string;
}) {
  return (
    <li className="overflow-hidden rounded-lg border border-foreground/15">
      <Link href={`/${businessId}/productos/${product.id}`} className="group block">
        <ProductImage product={product} loading="lazy" />
        <div className="px-3 pt-3">
          <p className="text-xs text-foreground/60">{product.category.name}</p>
          <ViewTransition name={productNameTransition(product.id)} share="morph" default="none">
            <h2 className="w-fit font-medium group-hover:underline">{product.name}</h2>
          </ViewTransition>
        </div>
      </Link>
      <div className="px-3 pb-3">
        <p className="mt-1 font-semibold">{formatPrice(Number(product.price))}</p>
        {product.stock === 0 && <p className="text-sm text-red-600">Agotado</p>}
        <AddToCartButton product={toCartProduct(product)} />
      </div>
    </li>
  );
}
