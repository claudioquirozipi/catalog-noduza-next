"use client";

import type { ComponentProps } from "react";
import { trackEvent, type AnalyticsEvent } from "@/lib/analytics";

type TrackedLinkProps = ComponentProps<"a"> & {
  event: AnalyticsEvent;
  // Dónde está el enlace (por ejemplo "hero" o "precio"), para comparar qué botón funciona mejor.
  location: string;
};

// Enlace normal que además registra un evento de analítica al hacer clic.
// Permite medir clics desde componentes de servidor como la landing.
export function TrackedLink({ event, location, onClick, ...props }: TrackedLinkProps) {
  return (
    <a
      {...props}
      onClick={(e) => {
        trackEvent(event, { location });
        onClick?.(e);
      }}
    />
  );
}
