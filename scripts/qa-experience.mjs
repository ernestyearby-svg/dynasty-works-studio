import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { gzipSync } from "node:zlib";
const origin = process.argv[2] || "http://127.0.0.1:8788";
const html = await (await fetch(origin + "/")).text();
assert.match(html, /WE BUILD/);
assert.match(html, /master-hero/);
assert.match(html, /ex-blueprint-product/);
assert.match(html, /AI \+ AUTOMATION SYSTEMS/);
assert.ok(!html.includes("<video"), "No unapproved hero film");
assert.ok(!html.includes("concept-beverage"), "No unapproved client imagery");
const imageSources = [...html.matchAll(/<img[^>]+src="([^"]+)"/g)].map(
  (m) => m[1],
);
assert.ok(
  imageSources.every(
    (s) =>
      s.startsWith("/assets/brand/") ||
      /^\/assets\/experience\/DWS-(ARCH-01|ARCH-02|FINAL-01)\.webp$/.test(s),
  ),
  "Only production brand assets and commissioned DWS environments; never mockup client imagery",
);
const review = await (await fetch(origin + "/creative-review")).text();
assert.match(review, /Digital experience/);
assert.match(review, /noindex/);
const walk = (p) =>
  readdirSync(p, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(join(p, e.name)) : [join(p, e.name)],
  );
const files = walk("dist/client");
const bytes = (ext) =>
  files
    .filter((p) => p.endsWith(ext))
    .reduce((n, p) => n + gzipSync(readFileSync(p)).length, 0);
const js = bytes(".js"),
  css = bytes(".css"),
  document = gzipSync(html).length;
assert.ok(js < 250000, "All emitted JS exceeds 250 KB gzip budget");
assert.ok(css < 45000, "CSS exceeds 45 KB gzip budget");
assert.ok(
  js + css + document < 650000,
  "Conservative homepage envelope exceeds 650 KB",
);
const styles = readFileSync("app/experience.css", "utf8");
assert.match(styles, /prefers-reduced-motion/);
assert.match(styles, /data-motion="reduced"/);
assert.ok(!/animation[^;]*infinite/.test(styles), "No perpetual motion");
console.log(
  JSON.stringify(
    {
      result: "PASS",
      allSiteJavaScriptGzip: js,
      allSiteCssGzip: css,
      homepageHtmlGzip: document,
      conservativeTotal: js + css + document,
      unapprovedMediaRequests: 0,
      notes:
        "Gzip estimates, not field Core Web Vitals. All-site chunks overestimate initial route loading.",
    },
    null,
    2,
  ),
);
