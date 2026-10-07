import { ViewTransition } from "react";
import Link from "next/link";
import { AddToCartButton } from "../../cart";
import {
  getBusinessOrNotFound,
  getProductOrNotFound,
  priceFormatter,
  productNameTransition,
  toCartProduct,
} from "../../catalog";
import { ProductImage } from "../../product-image";

export default async function ProductPage({ params }: PageProps<"/[businessId]/productos/[productId]">) {
  const { businessId, productId } = await params;
  const [business, product] = await Promise.all([
    getBusinessOrNotFound(businessId),
    getProductOrNotFound(businessId, productId),
  ]);
  const formatPrice = priceFormatter(business.currency);

  return (
    <main className="mx-auto w-full max-w-5xl px-4 pt-6 pb-24">
      <Link href={`/${businessId}`} className="text-sm text-foreground/70 hover:underline">
        ← Volver a {business.name}
      </Link>

      <div className="mt-4 grid gap-8 md:grid-cols-2">
        <ProductImage product={product} loading="eager" className="rounded-lg" />

        <div>
          <p className="text-sm text-foreground/60">{product.category.name}</p>
          <ViewTransition name={productNameTransition(product.id)} share="morph" default="none">
            <h1 className="w-fit text-3xl font-semibold">{product.name}</h1>
          </ViewTransition>
          <p className="mt-2 text-2xl font-semibold">{formatPrice(Number(product.price))}</p>
          {product.code && <p className="mt-1 text-sm text-foreground/60">Código: {product.code}</p>}

          {product.description && (
            <p className="mt-6 whitespace-pre-line text-foreground/80">{product.description}</p>
          )}

          <div className="mt-6 max-w-xs">
            {product.stock === 0 && <p className="text-sm text-red-600">Agotado</p>}
            <AddToCartButton product={toCartProduct(product)} />
          </div>
        </div>
      </div>
    </main>
  );
}
