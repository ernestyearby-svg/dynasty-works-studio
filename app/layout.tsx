import type { Metadata } from "next";
import Link from "@/components/site-link";
import { Navbar } from "@/components/navbar";
import "./globals.css";
import { site } from "@/data/site";
export const metadata: Metadata = {
  metadataBase: new URL(site.origin),
  alternates: { canonical: "/" },
  robots: {
    index: process.env.INDEXING_ENABLED === "true",
    follow: process.env.INDEXING_ENABLED === "true",
  },
  title: {
    default: "Dynasty Works Studio — Ideas into execution",
    template: "%s | Dynasty Works Studio",
  },
  description:
    "An integrated company-building studio connecting strategy, formation coordination, branding, digital development, launch and growth.",
  icons: { icon: "/favicon.svg" },
  openGraph: { type: "website", siteName: "Dynasty Works Studio" },
  twitter: { card: "summary_large_image" },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Navbar />
        <main id="main">{children}</main>
        <footer className="footer shell">
          <div className="footer-top">
            <Link href="/" className="wordmark">
              DYNASTY
              <br />
              WORKS STUDIO
            </Link>
            <p>
              Independent thinking.
              <br />
              One coordinated creative system.
            </p>
            <Link href="/contact">Start a conversation ↗</Link>
          </div>
          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} Dynasty Works Studio</span>
            <span>STRATEGY → DESIGN → BUILD → LAUNCH</span>
            <a href="#main">Back to top ↑</a>
          </div>
        </footer>
      </body>
    </html>
  );
}
