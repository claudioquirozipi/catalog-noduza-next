import type { CSSProperties } from "react";
import type { CatalogSettings } from "./api";

// Colores del catálogo cuando el negocio no lo ha personalizado desde Noduza.
// Si los cambias, actualiza también DEFAULT_CATALOG_COLORS en el proyecto Angular.
export const DEFAULT_THEME = {
  primaryColor: "#16a34a",
  backgroundColor: "#ffffff",
  textColor: "#171717",
};

const HEX_COLOR = /^#[0-9a-fA-F]{6}$/;

function pick(value: string | null | undefined, fallback: string) {
  return value && HEX_COLOR.test(value) ? value : fallback;
}

// Luminancia relativa según WCAG.
function luminance(hex: string) {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

// Texto blanco o negro, el que tenga más contraste sobre el color dado.
function readableOn(hex: string) {
  const l = luminance(hex);
  return (1.05 / (l + 0.05)) >= ((l + 0.05) / 0.05) ? "#ffffff" : "#000000";
}

// Variables CSS que consumen las clases `bg-primary`, `text-foreground`, etc. (ver globals.css).
export function themeStyle(settings: CatalogSettings | null): CSSProperties {
  const primary = pick(settings?.primaryColor, DEFAULT_THEME.primaryColor);
  return {
    "--primary": primary,
    "--primary-foreground": readableOn(primary),
    "--background": pick(settings?.backgroundColor, DEFAULT_THEME.backgroundColor),
    "--foreground": pick(settings?.textColor, DEFAULT_THEME.textColor),
  } as CSSProperties;
}
