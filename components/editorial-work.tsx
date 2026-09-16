import Link from "@/components/site-link";
import { OptimizedImage as Image } from "@/components/optimized-image";
import assets from "@/data/mymosa-assets.json";

export function ProductLineup({ priority = false }: { priority?: boolean }) {
  return (
    <div
      className="v3-products"
      tabIndex={0}
      role="region"
      aria-label="Eight authentic MyMosa products; scroll horizontally to explore every flavor"
    >
      {assets.flavors.map((f, i) => (
        <figure key={f.slug}>
          <Image
            src={f.src}
            srcSet={"/assets/portfolio/mymosa/web/responsive/"+f.slug+".webp 200w, "+f.src+" "+f.width+"w"}
            sizes="(max-width: 700px) 110px, (max-width: 1000px) 98px, (max-width: 1600px) 9vw, 150px"
            width={f.width}
            height={f.height}
            alt={
              f.name.replace(/\b\w/g, (c) => c.toUpperCase()) +
              " — approved MyMosa can artwork"
            }
            loading={priority ? "eager" : "lazy"}
          />
          <figcaption>
            <span>0{i + 1}</span>
            {f.name}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
export function MymosaReveal() {
  return (
    <article className="v3-mymosa" id="selected-work">
      <div className="v3-register">
        <p>01 / SELECTED WORK</p>
        <span>MYMOSA / MY DRINK FAMILY</span>
        <span>BRAND · PACKAGING · IDENTITY</span>
      </div>
      <div className="v3-project-heading">
        <h2>
          A category.
          <br />
          <em>A whole family.</em>
        </h2>
        <Link
          href="/work/mymosa"
          className="v3-round-link"
          aria-label="Explore the MyMosa case study"
        >
          ↗
        </Link>
      </div>
      <ProductLineup />
      <div className="v3-project-caption">
        <p>MyMosa / My Drink Family</p>
        <p>
          Premium Wine Cocktails.
          <br />
          Eight flavors. One unmistakable identity.
        </p>
        <Link href="/work/mymosa" className="text-link">
          VIEW SYSTEM →
        </Link>
      </div>
    </article>
  );
}
export function CliffsReveal() {
  return (
    <article className="v3-cliffs">
      <div className="v3-cliffs-copy">
        <p className="eyebrow">02 / SELECTED WORK</p>
        <h2>
          Good bourbon.
          <br />
          <em>A distinct world.</em>
        </h2>
        <p>Mr. Cliff’s Premium Bourbon</p>
        <p className="v3-small">
          A digital experience in warm ivory, oxblood and bourbon amber.
          Existing brand artwork. Actual website execution.
        </p>
        <Link href="/work/mr-cliffs" className="text-link">
          VIEW DIGITAL EXPERIENCE →
        </Link>
      </div>
      <Link href="/work/mr-cliffs" className="v3-cliffs-image">
        <Image
          src="/assets/portfolio/mr-cliffs/window-hero.webp"
          srcSet="/assets/portfolio/mr-cliffs/window-thumbnail.webp 800w, /assets/portfolio/mr-cliffs/window-hero.webp 1600w"
          sizes="(max-width: 700px) 100vw, 65vw"
          width={1600}
          height={900}
          alt="Mr. Cliff’s existing brand artwork: bourbon bottle and glass in window light"
          loading="lazy"
        />
        <span>MR. CLIFF’S / DIGITAL EXPERIENCE ↗</span>
      </Link>
    </article>
  );
}
