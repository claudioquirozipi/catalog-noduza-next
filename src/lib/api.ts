import "server-only";

// Equivalente a `baseURLApiGateway` del proyecto Angular.
const API_URL = process.env.BASE_URL_API_GATEWAY;

// Segundos que Next guarda en caché las respuestas antes de volver a pedirlas.
const REVALIDATE_SECONDS = 60;

export type Business = {
  name: string;
  logo: string;
  description: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  address: string | null;
  currency: string;
  // null si el negocio aún no personalizó su catálogo.
  catalogSettings: CatalogSettings | null;
};

// Cada color es un hex `#rrggbb`, o null para usar el color por defecto.
export type CatalogSettings = {
  primaryColor: string | null;
  backgroundColor: string | null;
  textColor: string | null;
};

export type Product = {
  id: number;
  code: string;
  name: string;
  description: string;
  // Prisma serializa los Decimal como string.
  price: string;
  stock: number;
  imageUrl: string;
  hasVariants: boolean;
  productType: "GENERAL" | "ROPA" | "ZAPATOS" | "ACCESORIOS";
  category: { id: number; name: string };
};

export type ProductVariant = {
  id: number;
  sku: string;
  size: string | null;
  color: string | null;
  stock: number;
  // null si la variante usa el precio del producto.
  price: string | null;
};

export type ProductDetail = Product & { variants: ProductVariant[] };

export type Paginated<T> = {
  items: T[];
  total: number;
  page: number;
  limit: number;
};

export class ApiError extends Error {
  constructor(public status: number, path: string) {
    super(`La API respondió ${status} en ${path}`);
  }
}

async function apiGet<T>(path: string, params: Record<string, string | number>): Promise<T> {
  if (!API_URL) {
    throw new Error("Falta la variable de entorno BASE_URL_API_GATEWAY");
  }

  const url = new URL(path, API_URL);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, String(value));
  }

  const res = await fetch(url, { next: { revalidate: REVALIDATE_SECONDS } });
  if (!res.ok) throw new ApiError(res.status, path);
  return res.json() as Promise<T>;
}

export function getBusiness(businessId: string) {
  return apiGet<Business>("/v1/storefront/business", { businessId });
}

export function getProducts(businessId: string, page = 1, limit = 20) {
  return apiGet<Paginated<Product>>("/v1/storefront/products", { businessId, page, limit });
}

export function getProduct(businessId: string, productId: string) {
  return apiGet<ProductDetail>(`/v1/storefront/products/${productId}`, { businessId });
}
