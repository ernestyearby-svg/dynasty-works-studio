"use client";
import { OptimizedImage } from "@/components/optimized-image";
import type { TemplateProduct } from "@/data/templates";
import Link from "@/components/site-link";
export function TemplateCard({
  product,
  index,
}: {
  product: TemplateProduct;
  index: number;
}) {
  return (
    <article className="template-card">
      <div className={`template-art template-art-${index}`}>
        {product.image ? (
          <OptimizedImage
            src={product.image.src}
            alt={product.image.alt}
            loading="lazy"
            width={1000}
            height={800}
          />
        ) : (
          <>
            <span className="eyebrow">COLLECTION PREVIEW / 0{index + 1}</span>
            <span className="template-type">
              {index === 0 ? (
                <>
                  Digital
                  <br />
                  <i>foundations.</i>
                </>
              ) : index === 1 ? (
                <>
                  Identity
                  <br />
                  <i>essentials.</i>
                </>
              ) : (
                <>
                  Ideas,
                  <br />
                  <i>presented.</i>
                </>
              )}
            </span>
            <span className="eyebrow">DYNASTY WORKS STUDIO</span>
          </>
        )}
      </div>
      <div className="template-heading">
        <h2>{product.name}</h2>
        <span>Coming soon</span>
      </div>
      <p>{product.description}</p>
      <p className="template-price">
        {product.price === null
          ? "Price to be announced"
          : new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: product.currency,
            }).format(product.price)}
      </p>
      <details>
        <summary>
          Preview & details <span>+</span>
        </summary>
        <ul>
          {product.details.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>
        {product.previewUrl && (
          <a href={product.previewUrl}>Open product preview ↗</a>
        )}
        <Link className="text-link" href="/contact">
          Discuss a custom version ↗
        </Link>
      </details>
    </article>
  );
}
export function TemplateCatalog({ products }: { products: TemplateProduct[] }) {
  return (
    <div className="template-grid">
      {products.map((p, i) => (
        <TemplateCard key={p.slug} product={p} index={i} />
      ))}
    </div>
  );
}

