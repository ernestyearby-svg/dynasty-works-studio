import type { ImgHTMLAttributes } from "react";
export function OptimizedImage({
  src,
  alt,
  ...rest
}: ImgHTMLAttributes<HTMLImageElement> & { src: string; alt: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      decoding="async"
      {...rest}
      src={src}
      alt={alt}
      sizes={rest.sizes || "(max-width: 700px) 100vw, 65vw"}
    />
  );
}
