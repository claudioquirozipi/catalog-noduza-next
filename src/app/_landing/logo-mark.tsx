// Isotipo de Noduza (sin el texto), redibujado en SVG a partir del logo original.
// Las líneas se cortan antes del nodo naranja para dejar el espacio transparente que tiene el logo.
// La misma figura está en public/logo/noduza-mark.svg para usarla fuera de React.
export function LogoMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 181 158" className={className} aria-hidden="true">
      <g stroke="#6a4ebd" strokeWidth={7}>
        <line x1="69.17" y1="90.84" x2="14.7" y2="143.3" />
        <line x1="95.83" y1="65.17" x2="148.3" y2="14.7" />
        <line x1="101" y1="78" x2="166.3" y2="78" />
      </g>
      <g fill="#7454d4">
        <circle cx="14.7" cy="143.3" r="14.5" />
        <circle cx="148.3" cy="14.7" r="14.5" />
        <circle cx="166.3" cy="78" r="14.5" />
      </g>
      <circle cx="82.5" cy="78" r="14.5" fill="#fca91a" />
    </svg>
  );
}
