// "es-PE" muestra los soles como "S/ 1,234.50" (con "es" saldría "1234,50 PEN").
export function priceFormatter(currency: string) {
  return new Intl.NumberFormat("es-PE", { style: "currency", currency }).format;
}
