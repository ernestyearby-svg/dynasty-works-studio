import Link from "@/components/site-link";
import { OptimizedImage } from "@/components/optimized-image";
import {
  LivingSystem,
  BlueprintProduct,
} from "@/components/experience-interactive";
import { experienceAssets } from "@/data/digital-experience";
export function ExperienceReview() {
  return (
    <section className="shell ex-section ex-review">
      <span className="eyebrow">INTERNAL / V1.8A</span>
      <h2>Digital experience.</h2>
      <p>
        Production presentation follows the supplied homepage visual master. The
        approved Direction 03 geometry and existing functionality remain the
        foundation.
      </p>
      <div className="ex-review-grid">
        <article>
          <h3>Hero system</h3>
          <div className="ex-review-dark">
            <OptimizedImage
              src="/assets/experience/DWS-ARCH-01.webp"
              alt="Direction 03 interpreted as a champagne architectural monument"
              width={1738}
              height={905}
              loading="lazy"
            />
          </div>
          <p>
            V1.8A architectural environment: a conceptual Dynasty Works render
            using the locked stair-step identity. It is not client work or a
            photograph of a real installation.
          </p>
        </article>
        <article>
          <h3>Material system</h3>
          <div className="ex-material-samples">
            <span>Obsidian</span>
            <span>Graphite</span>
            <span>Bone</span>
          </div>
          <p>
            Commissioned stone, glass and landscape environments now support the
            homepage. The earlier asset register below is retained as historical
            V1.8 planning; current status is documented in
            V1.8A-VISUAL-MASTER-IMPLEMENTATION.md.
          </p>
          <h3>Motion system</h3>
          <p>
            Short entry reveals, user-controlled module construction and
            sequence tracing. No scroll capture, infinite loops or navigation
            delays. Reduced motion presents the complete static state.
          </p>
          <h3>Portfolio system</h3>
          <p>
            Full-frame project chapters, responsive media, optional approved
            exhibition colors, device/film and product-detail sequences. All
            current client records remain behind existing approval gates.
          </p>
          <Link href="/work" className="text-link">
            View portfolio architecture ↗
          </Link>
          <h3>Company Builder</h3>
          <p>
            A luminous working surface, larger choices and assembled roadmap
            reveal. All recommendation logic, draft controls and downloads
            remain intact.
          </p>
          <Link href="/start-a-business/builder" className="text-link">
            Open Company Builder ↗
          </Link>
        </article>
      </div>
      <h3>Automation</h3>
      <div className="ex-review-dark">
        <LivingSystem />
      </div>
      <h3>Blueprint</h3>
      <div className="ex-review-blueprint">
        <BlueprintProduct />
      </div>
      <h3>Custom asset plan</h3>
      <p>
        Required media is intentionally absent until approved. Current native
        interface treatments remain the fallback.
      </p>
      <div className="ex-asset-register">
        {experienceAssets.map((a) => (
          <article key={a.id}>
            <span className="eyebrow">
              {a.id} / {a.status}
            </span>
            <h4>{a.purpose}</h4>
            <p>
              {a.page} · {a.section} · {a.aspect}
            </p>
            <p>{a.creative}</p>
            <p className="small-note">
              Desktop: {a.desktop}
              <br />
              Mobile: {a.mobile}
              <br />
              Format: {a.medium}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
