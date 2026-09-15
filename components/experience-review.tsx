import Link from "@/components/site-link";
import { HeroObject } from "@/components/digital-experience";
import {
  LivingSystem,
  BlueprintProduct,
} from "@/components/experience-interactive";
import { experienceAssets } from "@/data/digital-experience";
export function ExperienceReview() {
  return (
    <section className="shell ex-section ex-review">
      <span className="eyebrow">INTERNAL / V1.8</span>
      <h2>Digital experience.</h2>
      <p>
        A presentation system around the approved identity. Proprietary imagery
        awaits a separate asset approval round.
      </p>
      <div className="ex-review-grid">
        <article>
          <h3>Hero system</h3>
          <div className="ex-review-dark">
            <HeroObject />
          </div>
          <p>
            Exact Direction 03 vector fallback. Prepared for an approved static
            object render and optional user-controlled film; no invented 3D
            asset.
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
            Lighting and transparency belong to interface surfaces. Glass, metal
            and stone photography/rendering remain asset requirements.
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
