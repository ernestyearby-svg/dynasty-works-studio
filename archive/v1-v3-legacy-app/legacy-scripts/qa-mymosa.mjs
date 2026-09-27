import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { createRequire } from "node:module";
const loadDependency = createRequire(import.meta.url);
const sharp = loadDependency(
  "C:/Users/ernes/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp",
);
const hash = (b) => crypto.createHash("sha256").update(b).digest("hex");
const records = JSON.parse(
  fs.readFileSync("internal-assets/mymosa/published-assets.json", "utf8"),
);
const cans = records.filter((r) => r.type === "transparent can master");
assert.equal(cans.length, 8);
const sourceManifest = JSON.parse(
  fs
    .readFileSync(
      path.join(path.dirname(cans[0].source), "ASSET_MANIFEST.json"),
      "utf8",
    )
    .replace(/^\uFEFF/, ""),
);
for (const r of records) {
  assert.equal(
    hash(fs.readFileSync(r.derivative)),
    r.derivativeSha256,
    r.filename + " derivative hash",
  );
  if (r.sourceSha256)
    assert.equal(
      hash(fs.readFileSync(r.source)),
      r.sourceSha256,
      r.filename + " source unchanged",
    );
  if (r.derivative.endsWith(".svg")) {
    assert.ok(fs.readFileSync(r.source).equals(fs.readFileSync(r.derivative)));
    assert.ok(
      !/<script|<foreignObject|<text(?:\s|>)/i.test(
        fs.readFileSync(r.derivative, "utf8"),
      ),
    );
  }
}
for (const r of cans) {
  assert.equal(
    sourceManifest.find((m) => m["Output filename"] === r.filename)?.[
      "Output SHA-256"
    ],
    r.sourceSha256,
  );
  const original = await sharp(r.source)
      .extract(r.crop)
      .ensureAlpha()
      .raw()
      .toBuffer(),
    web = await sharp(r.derivative).ensureAlpha().raw().toBuffer();
  assert.equal(original.length, web.length);
  for (let i = 0; i < original.length; i += 4) {
    assert.equal(original[i + 3], web[i + 3]);
    if (original[i + 3])
      for (let c = 0; c < 3; c++)
        assert.equal(
          original[i + c],
          web[i + c],
          r.filename + " visible pixel",
        );
  }
  assert.equal(
    hash(fs.readFileSync("internal-assets/mymosa/source/" + r.filename)),
    r.sourceSha256,
  );
}
const origin = process.argv[2];
if (origin) {
  const response = await fetch(origin + "/work/mymosa");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1);
  assert.match(html, /PREMIUM WINE COCKTAILS/);
  assert.match(html, /New exhibition composition/);
  assert.ok(
    !/Costco|Total Wine|600 stores|400 stores|sparkling cocktail|concept-beverage/i.test(
      html,
    ),
  );
  const srcs = [...html.matchAll(/<img[^>]+src="([^"]+)"/g)].map((m) => m[1]);
  const permitted = new Set(
    records.map((r) => "/" + r.derivative.replace("public/", "")),
  );
  for (const src of srcs) {
    assert.ok(
      src.startsWith("/assets/brand/") || permitted.has(src),
      "Unapproved image " + src,
    );
    assert.equal((await fetch(origin + src)).status, 200, src);
  }
  const home = await (await fetch(origin + "/")).text();
  for (const flavor of [
    "classic-orange",
    "pineapple",
    "tropical-blend",
    "strawberry",
    "blood-orange",
    "watermelon",
    "mango",
    "peach",
  ])
    assert.ok(
      home.includes("/assets/portfolio/mymosa/web/" + flavor + ".webp"),
    );
  assert.match(home, /href="\/work\/mymosa"/);
}
console.log(
  JSON.stringify({
    result: "PASS",
    sourceManifestHashes: 8,
    visiblePixelEquality: 8,
    byteIdenticalOfficialVectors: 20,
    publishedAssets: records.length,
    httpChecked: !!origin,
  }),
);
