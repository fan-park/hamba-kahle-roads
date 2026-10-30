/* Builds one page per route guide (both directions) in guides/, plus sitemap.xml.
   Each page is the normal one-page site with that guide already showing, its own title and
   description, so search engines can list it. Run after editing routes.js or index.html:
     node tools/build-guides.js
*/
const fs = require("fs"), path = require("path"), vm = require("vm");
const ROOT = path.join(__dirname, "..");
const SITE = "https://hambakahleroads.co.za";

const sandbox = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(ROOT, "routes.js"), "utf8"), sandbox);
const ROUTES = sandbox.window.HKR_ROUTES;
const template = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");

const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const slug = t => t.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const swap = n => { const m = n.match(/^(.*) to (.*)$/); if (!m) return n; const o = m[2] + " to " + m[1]; return o[0].toUpperCase() + o.slice(1); };
const KINDS = { hazard: "Hazard", safety: "Safety", roadworks: "Roadworks", weather: "Weather", lane: "Lane advice", toll: "Toll", fuel: "Fuel & stops", tip: "Tip" };
function orient(r, rev) {
  if (!rev) return r;
  return { ...r, title: swap(r.title), reverseNote: "This guide was written for " + r.title + ". The same roads apply on your trip, but read exits, merges and lane tips the other way round.",
    legs: r.legs.slice().reverse().map(l => ({ name: swap(l.name), items: l.items.slice().reverse() })) };
}
const item = it => `<div class="item k-${esc(it.kind)}"><div class="item-top"><span class="item-title">${esc(it.title)}</span><span class="pill">${esc(KINDS[it.kind] || "Note")}</span><span class="src src-general">Road know-how</span></div>${it.detail ? `<p>${esc(it.detail)}</p>` : ""}</div>`;
function guideHtml(g) {
  return `
    <div class="brief-head"><div style="display:grid;gap:6px;min-width:0"><div class="eyebrow">Route guide</div><h2>${esc(g.title)}</h2>
      <div class="facts">${g.route ? `<span>Route <b>${esc(g.route)}</b></span>` : ""}${g.distanceKm ? `<span>About <b>${Math.round(g.distanceKm).toLocaleString("en-ZA")} km</b></span>` : ""}${g.driveTime ? `<span>Drive <b>${esc(g.driveTime)}</b></span>` : ""}</div></div></div>
    ${g.summary ? `<p style="margin:0;max-width:70ch">${esc(g.summary)}</p>` : ""}
    ${g.reverseNote ? `<p class="note reverse-note">${esc(g.reverseNote)}</p>` : ""}
    ${g.when && g.when.length ? `<div class="when"><h3>When to drive</h3><ul>${g.when.map(w => `<li>${esc(w)}</li>`).join("")}</ul><p class="note">Typical patterns, not guarantees. Check official sources before you go.</p></div>` : ""}
    <div class="live"><h3>From drivers, last 3 days</h3><p class="note">Loading driver reports…</p></div>
    <div class="brief-grid"><div class="before"><h3>Before you leave</h3><ul>${g.before.map(b => `<li>${esc(b)}</li>`).join("")}</ul></div>
      <div class="strip">${g.legs.map(l => `<div class="leg"><h3>${esc(l.name)}</h3><div class="items">${l.items.map(item).join("")}</div></div>`).join("")}</div></div>`;
}
function pageTitle(g, r) {
  const roads = r.roads.slice(0, 2).join("/");
  return r.commute ? `${g.title} commute guide: ${roads} traffic, lanes and hazards | Hamba Kahle Roads`
    : `${g.title} road trip guide: ${roads} tolls, hazards and stops | Hamba Kahle Roads`;
}
function pageDesc(g) {
  const d = `${g.title}: ${g.summary} About ${g.distanceKm} km, ${g.driveTime}. Tolls, risky stretches, best lanes, fuel stops and recent driver reports.`;
  return d.length > 300 ? d.slice(0, 297) + "…" : d;
}

const outDir = path.join(ROOT, "guides");
fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir);
const urls = [];
for (const r of ROUTES) for (const rev of [false, true]) {
  const g = orient(r, rev), s = slug(g.title), url = `${SITE}/guides/${s}`;
  const title = pageTitle(g, r), desc = pageDesc(g);
  let html = template
    .replace("<head>", '<head>\n<base href="/">')
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`)
    .replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${esc(desc)}">`)
    .replace(/<meta property="og:title" content="[^"]*">/, `<meta property="og:title" content="${esc(g.title)} | Hamba Kahle Roads">`)
    .replace(/<meta property="og:description" content="[^"]*">/, `<meta property="og:description" content="${esc(desc)}">`)
    .replace(/<meta property="og:url" content="[^"]*">/, `<meta property="og:url" content="${url}">`)
    .replace(/<link rel="canonical" href="[^"]*">/, `<link rel="canonical" href="${url}">`)
    .replace(/<section class="briefing-band" id="briefing" hidden aria-live="polite">\s*<div class="wrap" id="briefing-body"><\/div>/,
      `<section class="briefing-band" id="briefing" aria-live="polite">\n  <div class="wrap" id="briefing-body">${guideHtml(g)}</div>`);
  if (!html.includes(`canonical" href="${url}"`) || !html.includes('id="briefing" aria-live')) throw new Error("Template changed; update build-guides.js (" + s + ")");
  fs.writeFileSync(path.join(outDir, s + ".html"), html);
  urls.push(url);
}

const today = new Date().toISOString().slice(0, 10);
const entry = (loc, freq, pri) => `  <url><loc>${loc}</loc><lastmod>${today}</lastmod><changefreq>${freq}</changefreq><priority>${pri}</priority></url>`;
fs.writeFileSync(path.join(ROOT, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[entry(SITE + "/", "daily", "1.0"), ...urls.map(u => entry(u, "weekly", "0.8")),
  entry(SITE + "/about.html", "monthly", "0.5"), entry(SITE + "/privacy.html", "yearly", "0.3"), entry(SITE + "/terms.html", "yearly", "0.3")].join("\n")}
</urlset>
`);
console.log(`Built ${urls.length} guide pages and sitemap.xml`);
