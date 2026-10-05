"use client";

import { createContext, use, useState, useSyncExternalStore, type ReactNode } from "react";

export type CartProduct = {
  id: number;
  code: string;
  name: string;
  price: number;
  imageUrl: string;
  stock: number;
};

type CartItem = CartProduct & { quantity: number };

type CartContextValue = {
  items: CartItem[];
  add: (product: CartProduct) => void;
  setQuantity: (id: number, quantity: number) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function useCart() {
  const cart = use(CartContext);
  if (!cart) throw new Error("useCart debe usarse dentro de <CartProvider>");
  return cart;
}

// --- Persistencia en localStorage (una entrada por negocio) ---

const EMPTY: CartItem[] = [];
const listeners = new Set<() => void>();
const snapshots = new Map<string, { raw: string | null; items: CartItem[] }>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

// Devuelve la misma referencia mientras el contenido no cambie, como exige useSyncExternalStore.
function readCart(key: string): CartItem[] {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(key);
  } catch {
    // localStorage puede no estar disponible (modo privado, cookies bloqueadas).
  }
  const cached = snapshots.get(key);
  if (cached && cached.raw === raw) return cached.items;

  let items = EMPTY;
  try {
    if (raw) items = JSON.parse(raw) as CartItem[];
  } catch {
    // Contenido corrupto: se ignora y se empieza con el carrito vacío.
  }
  snapshots.set(key, { raw, items });
  return items;
}

function writeCart(key: string, items: CartItem[]) {
  const raw = JSON.stringify(items);
  try {
    localStorage.setItem(key, raw);
  } catch {
    // Sin persistencia el carrito sigue funcionando en memoria.
  }
  snapshots.set(key, { raw, items });
  listeners.forEach((listener) => listener());
}

// --- Proveedor ---

export function CartProvider({
  businessId,
  businessName,
  phone,
  currency,
  children,
}: {
  businessId: string;
  businessName: string;
  phone: string | null;
  currency: string;
  children: ReactNode;
}) {
  const key = `noduza-cart:${businessId}`;
  const items = useSyncExternalStore(
    subscribe,
    () => readCart(key),
    () => EMPTY,
  );

  const value: CartContextValue = {
    items,
    add(product) {
      const current = readCart(key);
      const existing = current.find((item) => item.id === product.id);
      if (existing) {
        writeCart(
          key,
          current.map((item) =>
            item.id === product.id ? { ...item, ...product, quantity: clampQuantity(item.quantity + 1, product.stock) } : item,
          ),
        );
      } else {
        writeCart(key, [...current, { ...product, quantity: 1 }]);
      }
    },
    setQuantity(id, quantity) {
      const current = readCart(key);
      writeCart(
        key,
        quantity <= 0
          ? current.filter((item) => item.id !== id)
          : current.map((item) => (item.id === id ? { ...item, quantity: clampQuantity(quantity, item.stock) } : item)),
      );
    },
    clear() {
      writeCart(key, []);
    },
  };

  // Sin teléfono no hay a dónde enviar el pedido, así que el catálogo se muestra sin carrito.
  const whatsappNumber = phone?.replace(/\D/g, "") ?? "";

  return (
    <CartContext value={whatsappNumber ? value : null}>
      {children}
      {whatsappNumber && (
        <CartDrawer businessName={businessName} whatsappNumber={whatsappNumber} currency={currency} />
      )}
    </CartContext>
  );
}

function clampQuantity(quantity: number, stock: number) {
  return Math.max(1, Math.min(quantity, stock));
}

// --- Botón "Agregar" de cada producto ---

export function AddToCartButton({ product }: { product: CartProduct }) {
  const cart = use(CartContext);
  if (!cart) return null;

  const inCart = cart.items.find((item) => item.id === product.id)?.quantity ?? 0;
  const soldOut = product.stock <= 0;
  const maxReached = !soldOut && inCart >= product.stock;

  return (
    <button
      type="button"
      onClick={() => cart.add(product)}
      disabled={soldOut || maxReached}
      className="mt-2 w-full rounded-md bg-green-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-zinc-300 disabled:text-zinc-600"
    >
      {soldOut ? "Agotado" : maxReached ? "Sin más stock" : inCart > 0 ? `Agregar otro (${inCart})` : "Agregar al carrito"}
    </button>
  );
}

// --- Botón flotante y panel del carrito ---

function CartDrawer({
  businessName,
  whatsappNumber,
  currency,
}: {
  businessName: string;
  whatsappNumber: string;
  currency: string;
}) {
  const { items, setQuantity, clear } = useCart();
  const [open, setOpen] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [note, setNote] = useState("");

  const formatPrice = new Intl.NumberFormat("es", { style: "currency", currency }).format;
  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  function whatsappUrl() {
    const lines = [
      `Hola ${businessName}, quiero hacer este pedido:`,
      "",
      ...items.map(
        (item) =>
          `• ${item.quantity} x ${item.name}${item.code ? ` (${item.code})` : ""} — ${formatPrice(item.price * item.quantity)}`,
      ),
      "",
      `*Total: ${formatPrice(total)}*`,
    ];
    const details = [
      customerName.trim() && `Nombre: ${customerName.trim()}`,
      note.trim() && `Nota: ${note.trim()}`,
    ].filter(Boolean);
    if (details.length > 0) lines.push("", ...details);
    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(lines.join("\n"))}`;
  }

  return (
    <>
      {count > 0 && !open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="fixed bottom-4 right-4 z-40 flex items-center gap-2 rounded-full bg-green-600 px-5 py-3 font-medium text-white shadow-lg transition-colors hover:bg-green-700"
        >
          <CartIcon />
          Ver pedido ({count}) · {formatPrice(total)}
        </button>
      )}

      {open && (
        <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-label="Tu pedido">
          <button type="button" aria-label="Cerrar" onClick={() => setOpen(false)} className="absolute inset-0 bg-black/40" />

          <aside className="relative flex h-full w-full max-w-md flex-col bg-white text-zinc-900 shadow-xl">
            <header className="flex items-center justify-between border-b border-zinc-200 px-4 py-3">
              <h2 className="text-lg font-semibold">Tu pedido</h2>
              <button type="button" onClick={() => setOpen(false)} className="text-2xl leading-none text-zinc-500" aria-label="Cerrar">
                ×
              </button>
            </header>

            {items.length === 0 ? (
              <p className="flex-1 p-4 text-zinc-600">Tu carrito está vacío.</p>
            ) : (
              <>
                <ul className="flex-1 divide-y divide-zinc-200 overflow-y-auto px-4">
                  {items.map((item) => (
                    <li key={item.id} className="flex gap-3 py-3">
                      {item.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element -- las imágenes ya vienen optimizadas desde Cloudinary
                        <img src={item.imageUrl} alt="" className="h-16 w-16 shrink-0 rounded object-cover" />
                      ) : (
                        <div className="h-16 w-16 shrink-0 rounded bg-zinc-100" />
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium">{item.name}</p>
                        <p className="text-sm text-zinc-500">{formatPrice(item.price)} c/u</p>
                        <div className="mt-1 flex items-center gap-2">
                          <QuantityButton label="Quitar uno" onClick={() => setQuantity(item.id, item.quantity - 1)}>
                            −
                          </QuantityButton>
                          <span className="w-6 text-center">{item.quantity}</span>
                          <QuantityButton
                            label="Agregar uno"
                            onClick={() => setQuantity(item.id, item.quantity + 1)}
                            disabled={item.quantity >= item.stock}
                          >
                            +
                          </QuantityButton>
                          <button
                            type="button"
                            onClick={() => setQuantity(item.id, 0)}
                            className="ml-auto text-sm text-red-600 hover:underline"
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                      <p className="shrink-0 font-semibold">{formatPrice(item.price * item.quantity)}</p>
                    </li>
                  ))}
                </ul>

                <footer className="space-y-3 border-t border-zinc-200 p-4">
                  <input
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Tu nombre (opcional)"
                    className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
                  />
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Nota: talla, color, dirección de entrega… (opcional)"
                    rows={2}
                    className="w-full resize-none rounded-md border border-zinc-300 px-3 py-2 text-sm"
                  />
                  <div className="flex items-center justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                  <a
                    href={whatsappUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-center justify-center gap-2 rounded-md bg-green-600 px-4 py-3 font-medium text-white transition-colors hover:bg-green-700"
                  >
                    Enviar pedido por WhatsApp
                  </a>
                  <button type="button" onClick={clear} className="w-full text-sm text-zinc-500 hover:underline">
                    Vaciar carrito
                  </button>
                </footer>
              </>
            )}
          </aside>
        </div>
      )}
    </>
  );
}

function QuantityButton({
  label,
  onClick,
  disabled,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className="flex h-7 w-7 items-center justify-center rounded border border-zinc-300 disabled:opacity-40"
    >
      {children}
    </button>
  );
}

function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5" aria-hidden="true">
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  );
}
