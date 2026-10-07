import { themeStyle } from "@/lib/theme";
import { CartProvider } from "./cart";
import { getBusinessOrNotFound } from "./catalog";

// El layout se mantiene al navegar entre el catálogo y el detalle de producto,
// así el carrito y los colores del negocio no se vuelven a montar.
export default async function BusinessLayout({ children, params }: LayoutProps<"/[businessId]">) {
  const { businessId } = await params;
  const business = await getBusinessOrNotFound(businessId);

  return (
    <div style={themeStyle(business.catalogSettings)} className="flex flex-1 flex-col bg-background text-foreground">
      <CartProvider businessId={businessId} businessName={business.name} phone={business.phone} currency={business.currency}>
        {children}
      </CartProvider>
    </div>
  );
}
