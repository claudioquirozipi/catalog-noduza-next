import type { Metadata } from "next";
import { ViewTransition } from "react";
import Link from "next/link";
import { AddToCartButton } from "../../cart";
import {
  getBusinessOrNotFound,
  getProductOrNotFound,
  productNameTransition,
  toCartProduct,
} from "../../catalog";
import { priceFormatter } from "@/lib/format";
import { NODUZA_SHARE_IMAGE } from "@/lib/share";
import { ProductImage } from "../../product-image";

// Al compartir un producto se muestra su foto; si no tiene, el logo del negocio (y si tampoco, la imagen de Noduza).
export async function generateMetadata({ params }: PageProps<"/[businessId]/productos/[productId]">): Promise<Metadata> {
  const { businessId, productId } = await params;
  const [business, product] = await Promise.all([
    getBusinessOrNotFound(businessId),
    getProductOrNotFound(businessId, productId),
  ]);
  const title = `${product.name} · ${business.name}`;
  const description = product.description?.trim() || `${priceFormatter(business.currency)(Number(product.price))} en ${business.name}`;
  const image = product.imageUrl || business.logo;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      siteName: business.name,
      type: "website",
      images: [image ? { url: image, alt: product.imageUrl ? product.name : business.name } : NODUZA_SHARE_IMAGE],
    },
  };
}

export default async function ProductPage({ params }: PageProps<"/[businessId]/productos/[productId]">) {
  const { businessId, productId } = await params;
  const [business, product] = await Promise.all([
    getBusinessOrNotFound(businessId),
    getProductOrNotFound(businessId, productId),
  ]);
  const formatPrice = priceFormatter(business.currency);

  return (
    <main className="mx-auto w-full max-w-5xl px-4 pt-6 pb-12">
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
            <AddToCartButton product={toCartProduct(product)} />
          </div>
        </div>
      </div>
    </main>
  );
}
