// Dominio público de este proyecto: base para las URLs absolutas de las imágenes al compartir.
export const SITE_URL = process.env.NODUZA_CATALOG_URL ?? "https://catalog-noduza-next.vercel.app";

// Imagen de Noduza al compartir. Los catálogos la reemplazan por el logo del negocio o la foto del producto.
export const NODUZA_SHARE_IMAGE = { url: "/og/noduza.png", width: 1200, height: 630, alt: "Noduza" };
