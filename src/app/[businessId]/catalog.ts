import { notFound } from "next/navigation";
import { ApiError, getBusiness, getProduct, type Business, type Product } from "@/lib/api";
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

// Enlaces de contacto listos para usar; cada uno es null si el negocio no llenó el dato.
export function businessContact(business: Business) {
  const phoneDigits = business.phone?.replace(/\D/g, "");
  const website = business.website?.trim();
  const address = business.address?.trim();
  return {
    whatsapp: phoneDigits ? { label: business.phone!, href: `https://wa.me/${phoneDigits}` } : null,
    email: business.email ? { label: business.email, href: `mailto:${business.email}` } : null,
    website: website
      ? {
          label: website.replace(/^https?:\/\//i, "").replace(/\/$/, ""),
          href: /^https?:\/\//i.test(website) ? website : `https://${website}`,
        }
      : null,
    address: address
      ? { label: address, href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}` }
      : null,
  };
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
