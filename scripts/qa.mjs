import assert from "node:assert/strict";
const origin = process.argv[2] || "http://localhost:5174";
const routes = [
  "/",
  "/work",
  "/start-a-business",
  "/start-a-business/builder",
  "/services",
  "/studio",
  "/templates",
  "/contact",
  "/work/mymosa",
  "/work/ikla-maison",
  "/work/smokesuite",
  "/work/mr-cliffs",
  "/work/ohana-to-alpine",
  "/work/quick-fix",
];
const links = new Set(),
  titles = new Set(),
  results = [];
for (const route of routes) {
  const response = await fetch(origin + route);
  assert.equal(response.status, 200, route);
  const html = await response.text();
  const title = html.match(/<title>(.*?)<\/title>/s)?.[1];
  assert.ok(title, route + " title");
  assert.ok(!titles.has(title), route + " duplicate title");
  titles.add(title);
  assert.equal(
    (html.match(/<h1(?:\s|>)/g) || []).length,
    1,
    route + " must have one H1",
  );
  assert.ok(/name="description"/.test(html), route + " description");
  assert.ok(/rel="canonical"/.test(html), route + " canonical");
  assert.ok(!/lorem ipsum/i.test(html));
  for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const path = match[1];
    if (
      path.startsWith("/") &&
      !path.startsWith("//") &&
      !path.startsWith("/@") &&
      !path.startsWith("/node_modules") &&
      !path.includes("?")
    )
      links.add(path.split("#")[0]);
  }
  results.push(route + " 200");
}
for (const path of links) {
  const r = await fetch(origin + path);
  assert.equal(r.status, 200, "Broken internal link or asset: " + path);
}
for (const path of ["/robots.txt", "/sitemap.xml"]) {
  const r = await fetch(origin + path);
  assert.equal(r.status, 200, path);
  const body = await r.text();
  assert.ok(
    path === "/robots.txt"
      ? body.includes("Disallow: /")
      : body.includes("<urlset"),
    path,
  );
  results.push(path + " 200");
}
assert.equal((await fetch(origin + "/work/does-not-exist")).status, 404);
const valid = {
  services: ["Brand Identity"],
  description: "Synthetic validation test for a studio identity project.",
  company: "QA Example",
  stage: "Idea",
  budget: "Let’s discuss",
  timeframe: "Flexible",
  name: "QA Tester",
  email: "qa@example.com",
  phone: "",
  website: "",
  reference: "",
  consent: true,
  honeypot: "",
};
let localProxyRetries = 0;
async function post(body, headers = { "Content-Type": "application/json" }) {
  const options = {
    method: "POST",
    headers,
    body: typeof body === "string" ? body : JSON.stringify(body),
  };
  const response = await fetch(origin + "/api/inquiries", options);
  const message = await response.clone().text();
  // Local Wrangler can drop requests in its proxy. Never retry application errors.
  // https://github.com/cloudflare/workers-sdk/issues/14641
  if (["localhost", "127.0.0.1"].includes(new URL(origin).hostname) && response.status === 503 && message.startsWith("Your worker restarted mid-request")) {
    localProxyRetries++;
    return fetch(origin + "/api/inquiries", options);
  }
  return response;
}
const unavailable = await post(valid);
assert.equal(unavailable.status, 503);
assert.equal((await unavailable.json()).status, "not_configured");
assert.equal((await post({ ...valid, email: "wrong" })).status, 422);
assert.equal((await post({ ...valid, honeypot: "bot" })).status, 422);
assert.equal(
  (await post({ ...valid, website: "javascript:alert(1)" })).status,
  422,
);
assert.equal((await post("{}")).status, 422);
assert.equal((await post("not-json")).status, 400);
assert.equal((await post(valid, { "Content-Type": "text/plain" })).status, 415);
assert.equal(
  (
    await post(valid, {
      "Content-Type": "application/json",
      Origin: "https://example.org",
    })
  ).status,
  403,
);
assert.equal((await post("x".repeat(25000))).status, 413);
console.log(
  JSON.stringify(
    {
      routes: results,
      internalLinksAndAssets: links.size,
      apiTests: 9,
      localProxyRetries,
      missingProject: 404,
      result: "PASS",
    },
    null,
    2,
  ),
);
