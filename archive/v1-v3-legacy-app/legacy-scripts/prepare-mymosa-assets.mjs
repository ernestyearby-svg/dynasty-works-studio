import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { createRequire } from "node:module";
const loadDependency = createRequire(import.meta.url);
const sharp = loadDependency(
  "C:/Users/ernes/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp",
);
const sourceRoot =
  "C:/Users/ernes/OneDrive/Documents/ChatGPT/My drink family/MYDRINKFAMILY_MASTER_ASSETS/09_TRANSPARENT_PRODUCTS/MYMOSA/USER_CAN_REPLACEMENTS_02";
const identityRoot =
  "C:/Users/ernes/OneDrive/Documents/MyDrinkFamily/public/assets";
const out = "public/assets/portfolio/mymosa";
const proof = "internal-assets/mymosa";
const hash = (b) => crypto.createHash("sha256").update(b).digest("hex");
const flavors = [
  "Classic Orange",
  "Pineapple",
  "Tropical Blend",
  "Strawberry",
  "Blood Orange",
  "Watermelon",
  "Mango",
  "Peach",
];
const records = [];
fs.mkdirSync(out + "/web", { recursive: true });
fs.mkdirSync(out + "/identity", { recursive: true });
fs.mkdirSync(proof + "/source", { recursive: true });
(async () => {
  for (const flavor of flavors) {
    const slug = flavor.toLowerCase().replaceAll(" ", "-"),
      filename = slug.toUpperCase() + "-TIGHT-002.png",
      src = path.join(sourceRoot, filename);
    const bytes = fs.readFileSync(src);
    const { data, info } = await sharp(bytes)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
    let left = info.width,
      top = info.height,
      right = 0,
      bottom = 0;
    for (let y = 0; y < info.height; y++)
      for (let x = 0; x < info.width; x++)
        if (data[(y * info.width + x) * 4 + 3]) {
          left = Math.min(left, x);
          right = Math.max(right, x);
          top = Math.min(top, y);
          bottom = Math.max(bottom, y);
        }
    const crop = {
      left,
      top,
      width: right - left + 1,
      height: bottom - top + 1,
    };
    const target = out + "/web/" + slug + ".webp";
    await sharp(bytes)
      .extract(crop)
      .webp({ lossless: true, effort: 6 })
      .toFile(target);
    const original = await sharp(bytes)
      .extract(crop)
      .ensureAlpha()
      .raw()
      .toBuffer();
    const derivative = await sharp(target).ensureAlpha().raw().toBuffer();
    for (let p = 0; p < original.length; p += 4) {
      if (
        original[p + 3] !== derivative[p + 3] ||
        (original[p + 3] > 0 &&
          (original[p] !== derivative[p] ||
            original[p + 1] !== derivative[p + 1] ||
            original[p + 2] !== derivative[p + 2]))
      )
        throw Error("Visible pixel mismatch " + flavor);
    }
    fs.copyFileSync(src, proof + "/source/" + filename);
    records.push({
      filename,
      source: src,
      project: "MyMosa",
      type: "transparent can master",
      status: "APPROVED",
      approval:
        "User explicit approval in Dynasty Works Portfolio Phase 1A task: approve all eight exact -002 masters for portfolio display, unchanged",
      use: "Hero, flavor gallery, packaging detail, homepage composite",
      derivative: target,
      sourceSha256: hash(bytes),
      derivativeSha256: hash(fs.readFileSync(target)),
      crop,
      decodedRgbaSha256: hash(derivative),
      pixelEquality: true,
      notes:
        "Only fully transparent margins removed; no resizing, retouching or text repair. WebP is lossless. Hidden RGB under zero alpha may canonicalize; every visible RGB value and every alpha value is verified unchanged.",
    });
  }
  const houses = JSON.parse(
    fs.readFileSync(
      "C:/Users/ernes/OneDrive/Documents/MyDrinkFamily/brand_assets/My_Drink_Family_17_House_Website_Identity_Pack/05_brand_system/house-registry.json",
      "utf8",
    ),
  ).houses;
  for (const h of houses) {
    const file = h.id + "-primary-light.svg";
    const src = path.join(identityRoot, "logos/houses", h.id, file);
    const bytes = fs.readFileSync(src);
    if (/<script|<foreignObject|<text(?:\s|>)/i.test(bytes.toString()))
      throw Error("Unsafe/live text identity " + file);
    const target = out + "/identity/" + file;
    fs.copyFileSync(src, target);
    records.push({
      filename: file,
      source: src,
      project: "My Drink Family",
      type: "official outlined house wordmark",
      status: "APPROVED",
      approval:
        "APPROVED-FRAMEWORK-CHECKPOINT.md sections 6–7: authoritative outlined 17-house wordmarks; identity pack ASSET_MANIFEST.md production rule",
      use:
        "Brand architecture gallery" +
        (h.id === "mymosa" ? " and opening identity" : ""),
      derivative: target,
      sourceSha256: hash(bytes),
      derivativeSha256: hash(fs.readFileSync(target)),
      notes:
        "Byte-identical original SVG; no live logo type or geometry changes.",
    });
  }
  for (const file of [
    "my-drink-family-horizontal-primary-light.svg",
    "my-drink-family-seal-primary-light.svg",
    "my-drink-family-stacked-primary-light.svg",
  ]) {
    const src = path.join(identityRoot, "brand", file),
      bytes = fs.readFileSync(src),
      target = out + "/identity/" + file;
    fs.copyFileSync(src, target);
    records.push({
      filename: file,
      source: src,
      project: "My Drink Family",
      type: "official family master mark",
      status: "APPROVED",
      approval:
        "Website approved framework checkpoint and authoritative identity pack manifest",
      use: file.includes("horizontal")
        ? "Family architecture opening"
        : file.includes("seal")
          ? "Brand system interlude"
          : "Brand architecture closing",
      derivative: target,
      sourceSha256: hash(bytes),
      derivativeSha256: hash(bytes),
      notes: "Byte-identical official vector.",
    });
  }
  const env =
    "C:/Users/ernes/.codex/visualizations/2026/09/15/01a0a5f6-4758-70e3-b555-a568a899ed77/mymosa-exhibition-environment.png";
  fs.copyFileSync(env, proof + "/exhibition-environment-source.png");
  await sharp(env)
    .webp({ quality: 85 })
    .toFile(out + "/web/exhibition-environment.webp");
  records.push({
    filename: path.basename(env),
    source: env,
    project: "Dynasty Works exhibition",
    type: "generated empty architectural environment",
    status: "CONCEPTUAL",
    approval:
      "User permits new exhibition backgrounds; contains no client products, logos, retail or historical evidence",
    use: "New exhibition background only",
    derivative: out + "/web/exhibition-environment.webp",
    sourceSha256: hash(fs.readFileSync(env)),
    derivativeSha256: hash(
      fs.readFileSync(out + "/web/exhibition-environment.webp"),
    ),
    notes:
      "Conceptual environment explicitly labeled on page. Real products are independent images.",
  });
  const composites = [];
  for (let i = 0; i < flavors.length; i++) {
    const name = flavors[i].toLowerCase().replaceAll(" ", "-");
    const input = await sharp(out + "/web/" + name + ".webp")
      .resize({ height: 310 })
      .toBuffer();
    composites.push({ input, left: 130 + i * 142, top: 240 });
  }
  await sharp(env)
    .resize(1400, 850, { fit: "cover" })
    .composite(composites)
    .webp({ lossless: true })
    .toFile(out + "/web/flagship-eight-exhibition.webp");
  records.push({
    filename: "flagship-eight-exhibition.webp",
    source:
      "Eight approved -002 masters + separately generated empty environment",
    project: "MyMosa / Dynasty Works exhibition",
    type: "editorial product composite",
    status: "APPROVED",
    approval:
      "User-authorized exhibition of exact approved masters; new background permitted",
    use: "Homepage / portfolio thumbnail",
    derivative: out + "/web/flagship-eight-exhibition.webp",
    derivativeSha256: hash(
      fs.readFileSync(out + "/web/flagship-eight-exhibition.webp"),
    ),
    notes:
      "Uniform 310px visible can height; aspect ratio preserved; no label redraw. New editorial composition, not historical photography. Individual derivatives preserve every visible source pixel and alpha exactly.",
  });
  const thumb = out + "/web/flagship-eight-thumbnail.webp";
  await sharp(out + "/web/flagship-eight-exhibition.webp")
    .resize({ width: 640 })
    .webp({ lossless: true, effort: 6 })
    .toFile(thumb);
  records.push({
    filename: "flagship-eight-thumbnail.webp",
    source: out + "/web/flagship-eight-exhibition.webp",
    project: "MyMosa / Dynasty Works exhibition",
    type: "optimized exhibition thumbnail",
    status: "APPROVED",
    approval:
      "Same approved eight-can composition; uniform proportional resize only",
    use: "Homepage and work gallery",
    derivative: thumb,
    sourceSha256: hash(
      fs.readFileSync(out + "/web/flagship-eight-exhibition.webp"),
    ),
    derivativeSha256: hash(fs.readFileSync(thumb)),
    notes:
      "640px wide lossless WebP; no redraw, uniform proportional resampling.",
  });
  fs.writeFileSync(
    proof + "/published-assets.json",
    JSON.stringify(records, null, 2),
  );
  fs.writeFileSync(
    "data/mymosa-assets.json",
    JSON.stringify(
      {
        flavors: records
          .slice(0, 8)
          .map((r) => ({
            name: r.filename
              .replace("-TIGHT-002.png", "")
              .toLowerCase()
              .replaceAll("-", " "),
            slug: r.filename.replace("-TIGHT-002.png", "").toLowerCase(),
            src: "/" + r.derivative.replace("public/", ""),
            width: r.crop.width,
            height: r.crop.height,
          })),
        houses: houses.map((h) => ({
          id: h.id,
          name: h.display,
          src:
            "/assets/portfolio/mymosa/identity/" + h.id + "-primary-light.svg",
        })),
      },
      null,
      2,
    ),
  );
  console.log({
    published: records.length,
    cans: 8,
    houses: houses.length,
    pixelEquality: true,
  });
})();
