import { ViewTransition } from "react";
import { productImageTransition } from "./catalog";

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
        <div className={`aspect-square w-full bg-foreground/5 ${className}`} />
      )}
    </ViewTransition>
  );
}
