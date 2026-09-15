import { RelatedServices } from "@/components/company-sections";
import { OptimizedImage } from "@/components/optimized-image";
import Link from "@/components/site-link";
import type { Project, Media, CaseModule } from "@/data/projects";
import { processSteps } from "@/data/site";
import { services } from "@/data/services";
import { BeforeAfter } from "@/components/before-after";
export function SectionHeading({
  number,
  label,
  title,
}: {
  number: string;
  label: string;
  title: string;
}) {
  return (
    <div className="section-title">
      <span className="eyebrow">
        {number} / {label}
      </span>
      <h2>{title}</h2>
    </div>
  );
}
export function Hero({
  media,
}: {
  media?: { approvalReference: string; poster: Media; video?: string };
} = {}) {
  return (
    <section className="dw-hero shell">
      <div className="dw-hero-meta eyebrow">
        <span>DYNASTY WORKS / STUDIO</span>
        <span>STRATEGY · DESIGN · TECHNOLOGY</span>
      </div>
      <h1>
        WE BUILD THE
        <br />
        COMPANY
        <br />
        <span>AROUND THE IDEA.</span>
      </h1>
      <div className="dw-hero-bottom">
        <p>
          An independent studio for the entire build.
          <br />
          From first direction to a company in motion.
        </p>
        <div className="dw-actions">
          <Link className="button light" href="/start-a-business/builder">
            Build your company ↗
          </Link>
          <Link className="text-link" href="/work">
            View our work ↗
          </Link>
        </div>
      </div>
      {media?.approvalReference.trim() && (
        <div className="dw-hero-media">
          {media.video ? (
            <VideoFrame
              src={media.video}
              poster={media.poster}
              title="Dynasty Works Studio film"
            />
          ) : (
            <MediaFrame image={media.poster} priority />
          )}
        </div>
      )}
      <div className="dw-hero-register eyebrow" aria-hidden="true">
        <span>01 — CONCEPTION</span>
        <span>02 — CONSTRUCTION</span>
        <span>03 — CONTINUITY</span>
      </div>
    </section>
  );
}
export function MediaFrame({
  image,
  priority = false,
}: {
  image: Media;
  priority?: boolean;
}) {
  return (
    <figure className="media-frame">
      <OptimizedImage
        src={image.src}
        srcSet={image.srcSet}
        alt={image.alt}
        width={image.width || 1536}
        height={image.height || 1024}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
      />
      {image.caption && <figcaption>{image.caption}</figcaption>}
    </figure>
  );
}
export function ProjectArtwork({
  project,
  priority = false,
}: {
  project: Project;
  priority?: boolean;
}) {
  if (!project.heroImage) return null;
  return (
    <div className={`project-art art-${project.art}`}>
      <OptimizedImage
        src={project.heroImage.src}
        srcSet={project.heroImage.srcSet}
        alt={project.heroImage.alt}
        width={project.heroImage.width || 1536}
        height={project.heroImage.height || 1024}
        loading={priority ? "eager" : "lazy"}
      />
      <span className="art-badge">VIEW PROJECT ↗</span>
    </div>
  );
}
export function ProjectCard({
  project,
  priority = false,
}: {
  project: Project;
  priority?: boolean;
}) {
  return (
    <article className="project-card">
      <Link
        href={`/work/${project.slug}`}
        aria-label={`Explore ${project.title}`}
      >
        <ProjectArtwork project={project} priority={priority} />
        <div className="project-caption">
          <h3>{project.title}</h3>
          <span>
            {project.industries.join(" / ")}
            <br />
            {project.services.join(" / ")} <span aria-hidden="true">↗</span>
          </span>
        </div>
      </Link>
    </article>
  );
}
export function ProjectGrid({ projects }: { projects: Project[] }) {
  return (
    <div className="project-grid">
      {projects.map((p) => (
        <ProjectCard key={p.slug} project={p} />
      ))}
    </div>
  );
}
export function ServiceGrid({ compact = false }: { compact?: boolean }) {
  return (
    <div className={compact ? "service-list compact" : "service-list"}>
      {services.map((s, i) => (
        <details className="service-item" key={s.slug} id={s.slug}>
          <summary>
            <span className="service-number">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3>{s.title}</h3>
            <span className="service-plus" aria-hidden="true">
              +
            </span>
          </summary>
          <div className="service-detail">
            <p>{s.intro}</p>
            <ul>
              {s.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <RelatedServices slug={s.slug} />
            <Link href="/contact">Discuss a project ↗</Link>
          </div>
        </details>
      ))}
    </div>
  );
}
export function ProcessTimeline() {
  return (
    <div className="process-grid">
      {processSteps.map(([title, copy], i) => (
        <div className="process-step" key={title}>
          <span className="eyebrow">{String(i + 1).padStart(2, "0")}</span>
          <h3>{title}</h3>
          <p>{copy}</p>
        </div>
      ))}
    </div>
  );
}
export function FinalCTA() {
  return (
    <section className="final-cta shell">
      <div>
        <span className="eyebrow">HAVE AN IDEA?</span>
        <h2>
          Let’s build <em>it.</em>
        </h2>
      </div>
      <Link className="button" href="/contact">
        Start a project <span>↗</span>
      </Link>
    </section>
  );
}
export function PageIntro({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <section className="page-intro shell">
      <span className="eyebrow">{eyebrow}</span>
      <h1>{title}</h1>
      <p>{description}</p>
    </section>
  );
}
export function CaseStudySection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="case-section">
      <h2>{title}</h2>
      <div>{children}</div>
    </section>
  );
}
export function VideoFrame({
  src,
  poster,
  title,
}: {
  src: string;
  poster: Media;
  title: string;
}) {
  return (
    <figure className="media-frame">
      <video
        controls
        playsInline
        preload="none"
        poster={poster.src}
        aria-label={title}
      >
        <source src={src} />
        <p>Your browser cannot play this video.</p>
      </video>
      <figcaption>{title}</figcaption>
    </figure>
  );
}
export function DeviceMockup({
  image,
  kind,
}: {
  image: Media;
  kind: "desktop" | "mobile";
}) {
  return (
    <div className={`device device-${kind}`}>
      <MediaFrame image={image} />
    </div>
  );
}
export function ProjectGallery({ images }: { images: Media[] }) {
  return (
    <div className="case-gallery">
      {images.map((image, i) => (
        <MediaFrame key={image.src + i} image={image} />
      ))}
    </div>
  );
}
export function CaseModuleView({ module }: { module: CaseModule }) {
  switch (module.type) {
    case "media-sequence":
      return module.images.length ? (
        <section className={`media-sequence sequence-${module.layout}`}>
          <h2>{module.title}</h2>
          <ProjectGallery images={module.images} />
        </section>
      ) : null;
    case "text":
      return (
        <CaseStudySection title={module.title}>
          <p>{module.body}</p>
        </CaseStudySection>
      );
    case "gallery":
      return <ProjectGallery images={module.images} />;
    case "video":
      return <VideoFrame {...module} />;
    case "device":
      return <DeviceMockup {...module} />;
    case "comparison":
      return <BeforeAfter {...module} />;
  }
}
