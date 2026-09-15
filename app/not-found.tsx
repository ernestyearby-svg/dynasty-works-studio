import Link from "@/components/site-link";
export default function NotFound() {
  return (
    <section className="page-intro shell">
      <span className="eyebrow">404 / NOT FOUND</span>
      <h1>A different direction.</h1>
      <p>
        This page isn’t here. Explore the work or tell us what you have in mind.
      </p>
      <Link className="button" href="/work">
        Back to the work ↗
      </Link>
    </section>
  );
}
