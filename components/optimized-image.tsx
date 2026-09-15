import type { ImgHTMLAttributes } from "react";
// Assets are optimized at authoring time, independent of the hosting provider.
export function OptimizedImage(
  props: ImgHTMLAttributes<HTMLImageElement> & { src: string; alt: string },
) {
  const { src, alt, ...rest } = props;
  const local =
    src === "/assets/studio/concept-aluminum-ribbon.webp" ||
    src === "/assets/projects/concept-beverage-still-life.webp";
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      decoding="async"
      {...rest}
      src={src}
      alt={alt}
      srcSet={
        local
          ? src.replace(".webp", "-768.webp") + " 768w, " + src + " 1536w"
          : undefined
      }
      sizes={props.sizes || "(max-width: 700px) 100vw, 65vw"}
    />
  );
}
