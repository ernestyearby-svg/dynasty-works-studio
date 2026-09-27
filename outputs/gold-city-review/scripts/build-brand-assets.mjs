import fs from "node:fs";
import sharp from "sharp";
const master = JSON.parse(
  fs.readFileSync("brand-source/modular-master.json", "utf8"),
);
const letters = JSON.parse(
  fs
    .readFileSync("brand-source/wordmark-paths.json", "utf8")
    .replace(/^\uFEFF/, ""),
);
const root = "public/assets/brand/";
const inventory = [];
function svg(
  viewBox,
  body,
  title = "Dynasty Works Studio",
) {
  return (
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="' +
    viewBox +
    '" role="img" aria-label="' +
    title +
    '"><title>' +
    title +
    "</title>" +
    body +
    "</svg>"
  );
}
function symbol(color = "#0A0A0A", small = false) {
  return (
    '<g fill="none" stroke="' +
    color +
    '" stroke-linejoin="miter" stroke-miterlimit="4"><path d="' +
    master.outline +
    '" stroke-width="' +
    (small ? 18 : master.outlineWidth) +
    '"/>' +
    (small
      ? ""
      : '<path d="' +
        master.dividers +
        '" stroke-width="' +
        master.dividerWidth +
        '"/>') +
    "</g>"
  );
}
function textPath(key, x, y, width, color) {
  const a = letters[key],
    scale = width / a.width;
  return (
    '<g transform="translate(' +
    x +
    " " +
    y +
    ") scale(" +
    scale +
    ") translate(" +
    -a.x +
    " " +
    -a.y +
    ')" fill="' +
    color +
    '"><path d="' +
    a.d +
    '"/></g>'
  );
}
function word(x, y, width, color) {
  return (
    textPath("brand", x, y, width, color) +
    textPath("descriptor", x, y + width * 0.14, width * 0.3, color)
  );
}
function asset(
  file,
  markup,
  purpose,
  bg = "Bone / light",
  status = "PRODUCTION",
) {
  fs.mkdirSync(root + file.slice(0, file.lastIndexOf("/")), {
    recursive: true,
  });
  fs.writeFileSync(root + file, markup);
  inventory.push({ file, purpose, bg, status });
}
asset("symbol/symbol.svg", svg(master.viewBox, symbol()), "Master symbol");
asset(
  "symbol/symbol-outline.svg",
  svg(master.viewBox, symbol()),
  "Approved outline master; intentionally identical to symbol",
);
asset(
  "symbol/symbol-reversed.svg",
  svg(master.viewBox, symbol("#F4F1EA")),
  "Reversed symbol",
  "Obsidian / Graphite",
);
asset(
  "symbol/symbol-small.svg",
  svg(master.viewBox, symbol("#0A0A0A", true)),
  "Small-size optical derivative: dividers omitted, outer stroke 18",
);
const primary = svg(
  "0 0 700 190",
  '<g transform="translate(20 20) scale(.8)">' +
    symbol() +
    "</g>" +
    word(260, 52, 400, "#0A0A0A"),
);
asset(
  "logo/logo-primary.svg",
  primary,
  "Default symbol + two-line name lockup",
);
asset(
  "logo/logo-horizontal.svg",
  svg("0 0 840 150", symbol() + word(300, 40, 480, "#0A0A0A")),
  "Wide horizontal lockup",
);
asset(
  "logo/logo-stacked.svg",
  svg(
    "0 0 500 330",
    '<g transform="translate(110 20)">' +
      symbol() +
      "</g>" +
      word(50, 210, 400, "#0A0A0A"),
  ),
  "Stacked cover lockup",
);
asset(
  "logo/wordmark.svg",
  svg("0 0 540 150", word(20, 20, 500, "#0A0A0A")),
  "Name-only two-line wordmark",
);
asset(
  "logo/logo-primary-reversed.svg",
  primary.replaceAll("#0A0A0A", "#F4F1EA"),
  "Primary reversed lockup",
  "Obsidian / Graphite",
);
asset(
  "documents/document-mark.svg",
  svg(master.viewBox, symbol()),
  "Header / footer / page mark",
);
asset(
  "documents/watermark.svg",
  svg(master.viewBox, '<g opacity=".08">' + symbol() + "</g>"),
  "Low-opacity document watermark",
  "Bone only; never behind critical text",
);
function icon(size) {
  const small = size <= 48;
  return svg(
    "0 0 280 280",
    '<rect width="280" height="280" fill="#0A0A0A"/><g transform="translate(15 55)">' +
      symbol("#F4F1EA", small) +
      "</g>",
  );
}
asset("icons/app-icon.svg", icon(512), "Application master", "Opaque Obsidian");
asset(
  "social/avatar.svg",
  icon(512),
  "Universal social avatar; centered safe area",
  "Opaque Obsidian",
);
fs.writeFileSync("public/favicon.svg", icon(16));
for (const size of [16, 32, 48, 180, 192, 512]) {
  const file = "icons/icon-" + size + ".png";
  await sharp(Buffer.from(icon(size)))
    .resize(size, size)
    .png()
    .toFile(root + file);
  inventory.push({
    file,
    purpose:
      size === 180
        ? "Apple touch icon"
        : "Application / favicon derivative " + size + "px",
    bg: "Opaque Obsidian",
    status: "PRODUCTION",
  });
}
const cover = svg(
  "0 0 900 1200",
  '<rect width="900" height="1200" fill="#0A0A0A"/><g transform="translate(60 80) scale(.65)">' +
    symbol("#F4F1EA") +
    "</g>" +
    word(60, 245, 520, "#F4F1EA") +
    '<g fill="#F4F1EA" font-family="Arial,Helvetica,sans-serif"><text x="60" y="550" font-size="72">FOUNDER</text><text x="60" y="635" font-size="72">BLUEPRINT</text><text x="60" y="790" font-size="22">[CLIENT / COMPANY]</text><text x="60" y="835" font-size="22">[DATE]</text><text x="60" y="1060" font-size="28">FROM IDEA</text><text x="60" y="1100" font-size="28">TO EXECUTION.</text></g><path d="M60 930H840" stroke="#6B6B6B"/>',
);
asset(
  "documents/blueprint-cover-template.svg",
  cover,
  "Editable cover architecture; replace bracketed fields before client use",
  "Obsidian",
  "TEMPLATE — NO CLIENT DATA",
);
const og = svg(
  "0 0 1200 630",
  '<rect width="1200" height="630" fill="#0A0A0A"/><g transform="translate(65 55) scale(.6)">' +
    symbol("#F4F1EA") +
    "</g>" +
    word(280, 95, 500, "#F4F1EA") +
    '<g fill="#F4F1EA" font-family="Arial,Helvetica,sans-serif" font-size="62"><text x="65" y="375">WE BUILD THE COMPANY</text><text x="65" y="450">AROUND THE IDEA.</text></g><path d="M65 535H1135" stroke="#6B6B6B"/>',
);
asset(
  "social/opengraph-template.svg",
  og,
  "1200 × 630 OpenGraph layout architecture; not wired as a raster social card",
  "Obsidian",
  "TEMPLATE",
);
asset(
  "documents/presentation-cover-template.svg",
  svg(
    "0 0 1600 900",
    '<rect width="1600" height="900" fill="#0A0A0A"/><g transform="translate(70 60)">' +
      symbol("#F4F1EA") +
      "</g>" +
      word(70, 350, 750, "#F4F1EA") +
      '<text x="70" y="680" fill="#F4F1EA" font-family="Arial,Helvetica,sans-serif" font-size="56">[PRESENTATION TITLE]</text><path d="M70 770H1530" stroke="#6B6B6B"/>',
  ),
  "16:9 presentation title architecture",
  "Obsidian",
  "TEMPLATE — NO CLIENT DATA",
);
fs.writeFileSync(
  "brand-source/asset-inventory.json",
  JSON.stringify(inventory, null, 2),
);
console.log(
  "Generated " +
    inventory.length +
    " production identity assets and templates from Direction 03 master.",
);
