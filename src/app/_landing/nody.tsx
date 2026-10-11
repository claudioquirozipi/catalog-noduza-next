import Image from "next/image";

// Las 4 poses de Nody, la mascota de Noduza. Cuando estén listas las imágenes,
// guárdalas en public/nody/ (PNG o WebP con fondo transparente) y llena `src`,
// por ejemplo "/nody/saludo.webp". Mientras `src` sea null se muestra un espacio reservado.
const NODY_POSES = {
  hero: { src: "/nody/saludo.webp", alt: "Nody, la mascota de Noduza, saludando" },
  share: { src: "/nody/catalogo.webp", alt: "Nody organizando productos, etiquetas y su catálogo" },
  celebrate: { src: "/nody/trofeo.webp", alt: "Nody celebrando con un trofeo" },
  search: { src: "/nody/grafico.webp", alt: "Nody con lentes mostrando un gráfico" },
} satisfies Record<string, { src: string | null; alt: string }>;

export type NodyPose = keyof typeof NODY_POSES;

export function Nody({ pose, priority, className = "" }: { pose: NodyPose; priority?: boolean; className?: string }) {
  const { src, alt } = NODY_POSES[pose] as { src: string | null; alt: string };

  return (
    <div className={`relative aspect-square ${className}`}>
      {src ? (
        <Image src={src} alt={alt} fill priority={priority} sizes="(min-width: 1024px) 400px, 70vw" className="object-contain" />
      ) : (
        <div
          role="img"
          aria-label={alt}
          className="flex h-full w-full items-center justify-center rounded-full bg-linear-to-br from-violet-200 to-amber-100 text-sm font-medium text-violet-700/70 dark:from-violet-900/50 dark:to-amber-900/30 dark:text-violet-200/70"
        >
          Nody
        </div>
      )}
    </div>
  );
}
