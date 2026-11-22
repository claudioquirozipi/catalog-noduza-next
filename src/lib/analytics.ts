import { track } from "@vercel/analytics";

// Eventos que medimos (Vercel Web Analytics). Usar siempre estos nombres para que los reportes no se dividan.
export type AnalyticsEvent =
  | "Clic crear catálogo" // botones de registro de la landing
  | "Pedido por WhatsApp" // botón "Enviar pedido por WhatsApp" del carrito
  | "Consulta por WhatsApp"; // botón flotante de WhatsApp del catálogo

type EventProps = Record<string, string | number | boolean | null>;

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content"] as const;

// Los parámetros utm_* de la URL actual (por ejemplo, del enlace de un video) se agregan a cada evento,
// así se puede saber qué video trajo cada clic. Solo funciona en el navegador.
function currentUtm(): EventProps {
  const params = new URLSearchParams(window.location.search);
  const utm: EventProps = {};
  for (const key of UTM_KEYS) {
    const value = params.get(key);
    if (value) utm[key] = value;
  }
  return utm;
}

export function trackEvent(name: AnalyticsEvent, props: EventProps = {}) {
  track(name, { ...currentUtm(), ...props });
}
