import { OptimizedImage } from "@/components/optimized-image";
import Link from "@/components/site-link";
import type { Project, Media, CaseModule } from "@/data/projects";
import { site, processSteps } from "@/data/site";
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
export function Hero() {
  return (
    <section className="hero shell">
      <div className="eyebrow hero-top">
        Independent thinking. Integrated execution.
        <span>CREATIVE × TECHNOLOGY</span>
      </div>
      <h1>
        {site.hero.firstLine}
        <br />
        {site.hero.secondLine} <em>{site.hero.accent}</em>
      </h1>
      <div className="hero-bottom">
        <p>
          {site.hero.description}
          <br />
          {site.hero.support}
        </p>
        <Link className="button light" href="/work">
          Explore our work <span>↗</span>
        </Link>
        <Link className="hero-contact" href="/contact">
          Start a project ↗
        </Link>
        <span className="scroll-note">SCROLL TO EXPLORE ↓</span>
      </div>
      {site.hero.video ? (
        <video
          className="hero-video"
          autoPlay
          muted
          loop
          playsInline
          poster={site.hero.image}
          aria-label="Studio motion study"
        >
          <source src={site.hero.video} />
        </video>
      ) : (
        <div
          className="hero-art"
          style={{ backgroundImage: `url(${site.hero.image})` }}
          aria-hidden="true"
        />
      )}
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
  return (
    <div className={`project-art art-${project.art}`}>
      {project.heroImage ? (
        <OptimizedImage
          src={project.heroImage.src}
          alt={project.heroImage.alt}
          width={1536}
          height={1024}
          loading={priority ? "eager" : "lazy"}
        />
      ) : (
        <div className="type-study" aria-hidden="true">
          <span className="art-overline">
            DYNASTY WORKS / STUDY {String(project.order).padStart(2, "0")}
          </span>
          <span className="art-type">
            {project.art === "maison" ? (
              <>
                IKLA
                <br />
                <i>Maison.</i>
              </>
            ) : project.art === "suite" ? (
              <>
                Smoke
                <br />
                Suite<span className="type-cross">+</span>
              </>
            ) : project.art === "bourbon" ? (
              <>
                MR. CLIFF’S
                <br />
                <i>Premium Bourbon</i>
              </>
            ) : project.art === "alpine" ? (
              <>
                Ohana
                <br />
                <i>to Alpine.</i>
              </>
            ) : (
              <>
                Quick
                <br />
                <i>Fix.</i>
              </>
            )}
          </span>
          <span className="art-foot">EXPLORATION / CONTENT PENDING</span>
        </div>
      )}
      <span className="art-badge">
        {project.status === "placeholder"
          ? "CONCEPT PLACEHOLDER"
          : "VIEW PROJECT"}{" "}
        ↗
      </span>
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
            {project.category.slice(0, 2).join(" / ")}{" "}
            <span aria-hidden="true">↗</span>
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

