import Link from "@/components/site-link";
import { BrandSymbol } from "@/components/brand-symbol";
import { OptimizedImage } from "@/components/optimized-image";
import {
  heroExperienceMedia,
  type ApprovedExperienceMedia,
} from "@/data/digital-experience";
import type { Project } from "@/data/projects";
import { isApprovedProject } from "@/lib/content";
import { ProjectCard, VideoFrame } from "@/components/studio";
export function HeroObject({
  media = heroExperienceMedia,
}: {
  media?: ApprovedExperienceMedia | null;
}) {
  return (
    <div className="ex-hero-object" data-reveal>
      <div className="ex-object-register eyebrow">
        <span>DWS / 03</span>
        <span>MODULAR SYSTEM</span>
      </div>
      {media?.approvalReference.trim() ? (
        <div className="ex-approved-hero">
          {media.video ? (
            <VideoFrame
              src={media.video}
              poster={media.poster}
              title="Dynasty Works modular object"
            />
          ) : (
            <picture>
              {media.mobilePoster && (
                <source
                  media="(max-width: 700px)"
                  srcSet={media.mobilePoster.srcSet || media.mobilePoster.src}
                />
              )}
              <OptimizedImage
                {...media.poster}
                src={media.poster.src}
                alt={media.poster.alt}
                loading="eager"
                fetchPriority="high"
                width={media.poster.width || 1600}
                height={media.poster.height || 1200}
              />
            </picture>
          )}
        </div>
      ) : (
        <div className="ex-master-study">
          <BrandSymbol />
          <div className="ex-master-baseline" aria-hidden="true" />
        </div>
      )}
      <div className="ex-object-register eyebrow">
        <span>IDEA</span>
        <span>BUILD</span>
        <span>GROW</span>
      </div>
    </div>
  );
}
export function ExperienceHero() {
  return (
    <section className="ex-hero">
      <div className="shell">
        <div className="ex-hero-top">
          <span className="eyebrow">
            INDEPENDENT THINKING. INTEGRATED EXECUTION.
          </span>
          <span className="eyebrow">DYNASTY WORKS / STUDIO</span>
        </div>
        <div className="ex-hero-main">
          <div className="ex-hero-copy">
            <h1>
              WE BUILD
              <br />
              THE COMPANY
              <br />
              <span>
                AROUND
                <br />
                THE IDEA.
              </span>
            </h1>
            <p>Strategy. Identity. Technology. Execution.</p>
            <div className="ex-actions">
              <Link href="/start-a-business/builder" className="button light">
                Build your company ↗
              </Link>
              <Link href="/work" className="text-link">
                Explore the work ↗
              </Link>
            </div>
          </div>
          <HeroObject />
        </div>
        <div className="ex-hero-foot">
          <span className="eyebrow">
            FROM THE FIRST QUESTION TO WHAT COMES NEXT.
          </span>
          <a href="#experience-intro" className="text-link">
            Enter the studio <span aria-hidden="true">↓</span>
          </a>
        </div>
      </div>
    </section>
  );
}
export function CinematicWork({ projects }: { projects: Project[] }) {
  const approved = projects.filter((p) => isApprovedProject(p) && p.heroImage);
  return approved.length ? (
    <div className="ex-cinematic-work">
      {approved.map((p, i) => (
        <section className="ex-exhibition" key={p.slug} data-reveal>
          <div className="ex-exhibition-meta">
            <span className="eyebrow">
              SELECTED WORK / {String(i + 1).padStart(2, "0")}
            </span>
            <span>{p.category.join(" / ")}</span>
          </div>
          <ProjectCard project={p} />
        </section>
      ))}
    </div>
  ) : (
    <div className="ex-work-awaiting">
      <div className="ex-work-statement">
        <span className="eyebrow">THE EXHIBITION</span>
        <h3>
          Work deserves
          <br />
          <em>the whole frame.</em>
        </h3>
      </div>
      <div>
        <p>
          Our flagship case studies are being prepared for release. Each will
          bring its own identity, its own atmosphere and its own story.
        </p>
        <Link href="/work" className="text-link">
          Visit the work index ↗
        </Link>
      </div>
    </div>
  );
}
export function ExperienceClosing() {
  return (
    <section className="ex-closing">
      <div className="shell">
        <span className="eyebrow">DYNASTY WORKS STUDIO</span>
        <h2>
          WE BUILD
          <br />
          <em>
            WHAT
            <br />
            COMES NEXT.
          </em>
        </h2>
        <div className="ex-closing-bottom">
          <p>
            Bring the idea.
            <br />
            Let’s give it a future.
          </p>
          <Link href="/start-a-business/builder" className="button light">
            Build your company ↗
          </Link>
          <Link href="/contact" className="text-link">
            Start a conversation ↗
          </Link>
        </div>
      </div>
    </section>
  );
}
