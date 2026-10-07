import { notFound } from "next/navigation";
import { ApiError, getBusiness, getProduct, type Product } from "@/lib/api";
import type { CartProduct } from "./cart";

function notFoundOn404(error: unknown): never {
  if (error instanceof ApiError && error.status === 404) notFound();
  throw error;
}

export function getBusinessOrNotFound(businessId: string) {
  return getBusiness(businessId).catch(notFoundOn404);
}

export function getProductOrNotFound(businessId: string, productId: string) {
  if (!/^\d+$/.test(productId)) notFound();
  return getProduct(businessId, productId).catch(notFoundOn404);
}

export function priceFormatter(currency: string) {
  return new Intl.NumberFormat("es", { style: "currency", currency }).format;
}

export function toCartProduct(product: Product): CartProduct {
  return {
    id: product.id,
    code: product.code,
    name: product.name,
    price: Number(product.price),
    imageUrl: product.imageUrl,
    stock: product.stock,
  };
}

// Nombres compartidos entre la tarjeta del catálogo y la página de detalle:
// React anima entre los elementos que tienen el mismo nombre (ver globals.css).
export const productImageTransition = (id: number) => `product-image-${id}`;
export const productNameTransition = (id: number) => `product-name-${id}`;
