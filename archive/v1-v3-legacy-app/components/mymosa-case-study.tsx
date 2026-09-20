import { ProductLineup } from "@/components/editorial-work";
import Link from "@/components/site-link";
import { OptimizedImage as Image } from "@/components/optimized-image";
import assets from "@/data/mymosa-assets.json";
const base = "/assets/portfolio/mymosa/";
const title = (s: string) => s.replace(/\b\w/g, (c) => c.toUpperCase());
export function MymosaCaseStudy() {
  return (
    <article className="mm-case">
      <header className="mm-opening shell">
        <p className="eyebrow">SELECTED WORK / 01</p>
        <Link href="/work" className="text-link">
          ALL WORK ↗
        </Link>
      </header>
      <section className="mm-hero" aria-labelledby="mm-title">
        <div className="mm-hero-copy shell">
          <h1 id="mm-title" className="sr-only">
            MyMosa — Premium Wine Cocktails
          </h1>
          <Image
            src={base + "identity/mymosa-primary-light.svg"}
            alt="MyMosa official wordmark"
            width={640}
            height={220}
            className="mm-wordmark"
            loading="eager"
          />
          <div>
            <p className="eyebrow">PREMIUM WINE COCKTAILS</p>
            <p className="mm-origin">
              Category pioneer
              <br />
              <em>since 2011.</em>
            </p>
          </div>
        </div>
        <ProductLineup priority />
        <p className="v3-case-caption shell">
          THE FLAGSHIP EIGHT · New exhibition composition · Original product
          artwork
        </p>
      </section>
      <nav className="mm-chapters shell" aria-label="Case study chapters">
        <a href="#mm-idea">01 / THE IDEA</a>
        <a href="#mm-eight">02 / FLAGSHIP EIGHT</a>
        <a href="#mm-family">03 / THE DRINK FAMILY</a>
        <a href="#mm-packaging">04 / PACKAGING</a>
      </nav>
      <section
        className="v2-case-framework shell"
        aria-label="Company creation case study"
      >
        <p className="eyebrow">CATEGORY + BRAND ECOSYSTEM</p>
        <div>
          <article>
            <h2>CHALLENGE</h2>
            <p>
              Present eight distinct flavor identities within a coherent product
              family, while preserving the original brand artwork.
            </p>
          </article>
          <article>
            <h2>SYSTEM</h2>
            <p>
              One MyMosa identity. Eight flagship flavors. Seventeen official
              house identities in the wider My Drink Family architecture.
            </p>
          </article>
          <article>
            <h2>EXECUTION</h2>
            <p>
              The approved product masters, outlined wordmarks and family marks
              shown here form an editorial exhibition of the actual source
              system.
            </p>
          </article>
          <article>
            <h2>MARKET / CURRENT STATUS</h2>
            <p>
              Premium Wine Cocktails. This exhibition documents the approved
              identity and product assets. Digital, campaign and market chapters
              await cleared material; no commercial results or availability
              claims are made.
            </p>
          </article>
        </div>
      </section>
      <section className="mm-intro shell" id="mm-idea">
        <p className="eyebrow">01 / THE IDEA</p>
        <h2>
          One origin.
          <br />
          <em>A family of possibilities.</em>
        </h2>
        <div>
          <p>
            MyMosa began in 2011. Today, its flagship system brings together
            eight flavors under one identity: Premium Wine Cocktails.
          </p>
          <p>
            From the wordmark to the color of each can, the individual flavor
            and the family remain inseparable.
          </p>
          <p className="mm-note">
            A study in product identity, packaging and brand architecture.
          </p>
        </div>
      </section>
      <section className="mm-eight" id="mm-eight">
        <div className="shell mm-section-head">
          <div>
            <p className="eyebrow">02 / THE FLAGSHIP EIGHT</p>
            <h2>
              Eight expressions.
              <br />
              <em>One unmistakable family.</em>
            </h2>
          </div>
          <p>
            Color gives each flavor its own place.
            <br />
            The shared silhouette holds them together.
          </p>
        </div>
        <p className="shell mm-scroll-hint">EXPLORE THE FLAVORS →</p>
        <div
          className="mm-flavors"
          tabIndex={0}
          role="region"
          aria-label="Eight MyMosa flavors; scroll horizontally to explore"
        >
          {assets.flavors.map((f, i) => (
            <figure key={f.slug}>
              <div className="mm-can-space">
                <Image
                  src={f.src}
                  width={f.width}
                  height={f.height}
                  alt={title(f.name) + " MyMosa can — approved product artwork"}
                  loading="lazy"
                />
              </div>
              <figcaption>
                <span className="eyebrow">0{i + 1} / MYMOSA</span>
                <h3>{title(f.name)}</h3>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>
      <section className="mm-family shell" id="mm-family">
        <div className="mm-family-heading">
          <p className="eyebrow">03 / THE DRINK FAMILY</p>
          <Image
            src={base + "identity/my-drink-family-horizontal-primary-light.svg"}
            width={1000}
            height={300}
            alt="My Drink Family official horizontal wordmark"
            loading="lazy"
          />
          <div>
            <h2>
              A house for
              <br />
              <em>every expression.</em>
            </h2>
            <p>
              Seventeen house identities. A shared family language. Each
              official mark carries its own name and character within the larger
              brand architecture.
            </p>
            <p className="mm-note">
              Brand architecture shown; not a statement of product availability.
            </p>
          </div>
        </div>
        <div className="mm-house-grid">
          {assets.houses.map((h, i) => (
            <figure key={h.id}>
              <span className="eyebrow">{String(i + 1).padStart(2, "0")}</span>
              <Image
                src={h.src}
                width={480}
                height={200}
                alt={h.name + " official house wordmark"}
                loading="lazy"
              />
            </figure>
          ))}
        </div>
        <div className="mm-family-signatures">
          <Image
            src={base + "identity/my-drink-family-seal-primary-light.svg"}
            width={320}
            height={320}
            alt="My Drink Family official seal"
            loading="lazy"
          />
          <Image
            src={base + "identity/my-drink-family-stacked-primary-light.svg"}
            width={500}
            height={300}
            alt="My Drink Family official stacked wordmark"
            loading="lazy"
          />
          <p className="eyebrow">
            INDIVIDUAL CHARACTER.
            <br />A COMMON FOUNDATION.
          </p>
        </div>
      </section>
      <section className="mm-packaging" id="mm-packaging">
        <div className="shell mm-packaging-grid">
          <div>
            <p className="eyebrow">04 / PACKAGING</p>
            <h2>
              The identity
              <br />
              is in
              <br />
              <em>the details.</em>
            </h2>
            <p>
              The script. The fruit. The glass. The color. Each element belongs
              to the original product artwork.
            </p>
            <p>The presentation gives those details room to be seen.</p>
          </div>
          <div className="mm-packaging-products">
            {[assets.flavors[0], assets.flavors[4]].map((f) => (
              <Image
                key={f.slug}
                src={f.src}
                width={f.width}
                height={f.height}
                alt={
                  title(f.name) +
                  " packaging detail — unchanged approved artwork"
                }
                loading="lazy"
              />
            ))}
          </div>
        </div>
      </section>
      <section className="mm-process shell">
        <p className="eyebrow">EXHIBITION NOTES</p>
        <h2>
          Respect the source.
          <br />
          <em>Elevate the presentation.</em>
        </h2>
        <div className="mm-process-grid">
          <div>
            <span className="eyebrow">01 / SOURCE</span>
            <h3>The original artwork</h3>
            <p>
              Official outlined identity assets and the eight approved
              transparent product masters form the exhibition.
            </p>
          </div>
          <div>
            <span className="eyebrow">02 / COMPOSITION</span>
            <h3>A consistent scale</h3>
            <p>
              The cans share a common height and baseline. Their proportions,
              labels and color relationships remain intact.
            </p>
          </div>
          <div>
            <span className="eyebrow">03 / ENVIRONMENT</span>
            <h3>A new setting</h3>
            <p>
              An open color field brings the products forward. Every can and
              official identity remains unchanged.
            </p>
          </div>
        </div>
      </section>
      <section className="mm-end shell">
        <p className="eyebrow">DYNASTY WORKS / STUDIO</p>
        <h2>
          Build what
          <br />
          <em>comes next.</em>
        </h2>
        <Link href="/contact" className="button light">
          WORK WITH US <span aria-hidden="true">→</span>
        </Link>
        <Link href="/work" className="text-link">
          EXPLORE THE WORK →
        </Link>
      </section>
    </article>
  );
}
