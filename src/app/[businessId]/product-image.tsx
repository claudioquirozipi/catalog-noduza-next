import { ViewTransition } from "react";
import { productImageTransition } from "./catalog";
import { ImageIcon } from "./icons";

export function ProductImage({
  product,
  loading,
  className = "",
}: {
  product: { id: number; name: string; imageUrl: string };
  loading?: "lazy" | "eager";
  className?: string;
}) {
  return (
    <ViewTransition name={productImageTransition(product.id)} share="morph" default="none">
      {product.imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element -- las imágenes ya vienen optimizadas desde Cloudinary
        <img
          src={product.imageUrl}
          alt={product.name}
          loading={loading}
          className={`aspect-square w-full object-cover ${className}`}
        />
      ) : (
        <div
          role="img"
          aria-label={`${product.name} (sin foto)`}
          className={`flex aspect-square w-full items-center justify-center bg-foreground/5 text-foreground/25 ${className}`}
        >
          <ImageIcon className="h-1/4 w-1/4" />
        </div>
      )}
    </ViewTransition>
  );
}
