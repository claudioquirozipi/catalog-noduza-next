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
  // Tienda de ejemplo de Noduza: el catálogo muestra un aviso flotante.
  isDemo: boolean;
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

function apiUrl(path: string, params: Record<string, string | number> = {}) {
  if (!API_URL) {
    throw new Error("Falta la variable de entorno BASE_URL_API_GATEWAY");
  }

  const url = new URL(path, API_URL);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, String(value));
  }
  return url;
}

// `fresh` evita la caché: para datos que cambian y que el usuario espera ver al instante (estado de un reclamo).
async function apiGet<T>(path: string, params: Record<string, string | number> = {}, fresh = false): Promise<T> {
  const res = await fetch(
    apiUrl(path, params),
    fresh ? { cache: "no-store" } : { next: { revalidate: REVALIDATE_SECONDS } },
  );
  if (!res.ok) throw new ApiError(res.status, path);
  return res.json() as Promise<T>;
}

async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(apiUrl(path), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  if (!res.ok) throw new ApiError(res.status, path);
  return res.json() as Promise<T>;
}

export function getBusiness(businessId: string) {
  return apiGet<Business>("/v1/storefront/business", { businessId });
}

export function getProducts(businessId: string, page = 1, limit = 20, search?: string) {
  return apiGet<Paginated<Product>>("/v1/storefront/products", {
    businessId,
    page,
    limit,
    ...(search ? { search } : {}),
  });
}

export function getProduct(businessId: string, productId: string) {
  return apiGet<ProductDetail>(`/v1/storefront/products/${productId}`, { businessId });
}

// ==================== Libro de reclamaciones ====================

// Datos legales del negocio que exige la hoja de reclamación (RUC y dirección).
export type ComplaintBusinessInfo = {
  id: string;
  name: string;
  logo: string | null;
  address: string | null;
  taxId: string | null;
};

export type ComplaintInput = {
  consumerName: string;
  consumerDocType: "DNI" | "CE" | "PASAPORTE";
  consumerDocNumber: string;
  consumerEmail: string;
  consumerPhone: string;
  consumerAddress: string;
  isMinor: boolean;
  guardianName?: string;
  guardianDocNumber?: string;
  complaintType: "RECLAMO" | "QUEJA";
  consumptionType: "PRODUCTO" | "SERVICIO";
  productDescription: string;
  claimedAmount?: number;
  complaintDetail: string;
  consumerRequest: string;
};

export type ComplaintStatus = "PENDING" | "IN_PROGRESS" | "RESOLVED";

// Respuesta al registrar un reclamo. La API devuelve el reclamo completo; aquí se declaran solo
// los campos que usa el catálogo.
export type Complaint = {
  complaintNumber: string;
  createdAt: string;
};

// Respuesta de la consulta pública: solo estado y respuesta, la API nunca devuelve datos personales.
export type ComplaintStatusInfo = {
  complaintNumber: string;
  complaintType: ComplaintInput["complaintType"];
  status: ComplaintStatus;
  createdAt: string;
  providerResponse: string | null;
  responseDate: string | null;
};

export function getComplaintBusinessInfo(businessId: string) {
  return apiGet<ComplaintBusinessInfo>(`/complaints/public/business/${encodeURIComponent(businessId)}`);
}

export function createComplaint(businessId: string, input: ComplaintInput) {
  return apiPost<Complaint>(`/complaints/public/${encodeURIComponent(businessId)}`, input);
}

// La consulta va por POST para que el documento del consumidor no quede en la URL ni en los logs.
// La API responde 404 si el número no existe en ese negocio o si el documento no coincide.
export function trackComplaintStatus(businessId: string, complaintNumber: string, consumerDocNumber: string) {
  return apiPost<ComplaintStatusInfo>("/complaints/public/track", { businessId, complaintNumber, consumerDocNumber });
}
