import type { Business } from "@/lib/api";
import { themeStyle } from "@/lib/theme";
import { CartProvider } from "./cart";
import { businessContact, getBusinessOrNotFound } from "./catalog";
import { ChatIcon, GlobeIcon, MailIcon, MapPinIcon } from "./icons";

// El layout se mantiene al navegar entre el catálogo y el detalle de producto,
// así el carrito y los colores del negocio no se vuelven a montar.
export default async function BusinessLayout({ children, params }: LayoutProps<"/[businessId]">) {
  const { businessId } = await params;
  const business = await getBusinessOrNotFound(businessId);

  return (
    <div style={themeStyle(business.catalogSettings)} className="flex flex-1 flex-col bg-background text-foreground">
      <CartProvider businessId={businessId} businessName={business.name} phone={business.phone} currency={business.currency}>
        <div className="flex-1">{children}</div>
        <BusinessFooter business={business} />
      </CartProvider>
    </div>
  );
}

function BusinessFooter({ business }: { business: Business }) {
  const { whatsapp, email, website, address } = businessContact(business);
  const contacts = [
    { link: whatsapp, icon: <ChatIcon />, external: true },
    { link: email, icon: <MailIcon />, external: false },
    { link: website, icon: <GlobeIcon />, external: true },
    { link: address, icon: <MapPinIcon />, external: true },
  ].flatMap(({ link, ...rest }) => (link ? [{ ...link, ...rest }] : []));

  return (
    <footer className="border-t border-foreground/15 text-sm">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-10 sm:grid-cols-2">
        <div>
          <p className="text-base font-semibold">{business.name}</p>
          {business.description && <p className="mt-1 text-foreground/70">{business.description}</p>}
        </div>

        {contacts.length > 0 && (
          <div>
            <p className="font-semibold">Contacto</p>
            <ul className="mt-2 space-y-2">
              {contacts.map((contact) => (
                <li key={contact.href}>
                  <a
                    href={contact.href}
                    {...(contact.external && { target: "_blank", rel: "noopener noreferrer" })}
                    className="flex items-start gap-2 text-foreground/70 hover:text-foreground hover:underline"
                  >
                    <span className="mt-0.5 shrink-0">{contact.icon}</span>
                    <span className="break-all">{contact.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Espacio inferior extra para que el botón flotante del carrito no tape el texto. */}
      <p className="border-t border-foreground/15 px-4 pt-4 pb-20 text-center text-xs text-foreground/50">
        © {new Date().getFullYear()} {business.name} · Catálogo creado con Noduza
      </p>
    </footer>
  );
}
