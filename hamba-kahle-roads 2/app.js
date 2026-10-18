/* Hamba Kahle Roads — front end.
   Reads and writes reports in Supabase, shows them on a Leaflet map and in a feed,
   and asks the /api/briefing server function for trip briefings. */
(() => {
"use strict";

const CFG = window.HKR_CONFIG || {};
const CONNECTED = !!(CFG.SUPABASE_URL && CFG.SUPABASE_ANON_KEY && !/YOUR-/.test(CFG.SUPABASE_URL + CFG.SUPABASE_ANON_KEY) && window.supabase);
const sb = CONNECTED ? window.supabase.createClient(CFG.SUPABASE_URL, CFG.SUPABASE_ANON_KEY) : null;

/* ---------- Vocabulary ---------- */
const TYPES = [
  ["pothole","Pothole"],["lane","Lane closed"],["works","Roadworks"],["robots","Robots out"],
  ["flood","Flooding"],["debris","Debris / loose gravel"],["crash","Crash"],["hotspot","Smash-and-grab spot"],
  ["slow","Bottleneck"],["fog","Fog / low visibility"],["tip","Local tip"]
];
const QUICK = ["pothole","crash","slow","robots","works","debris","flood","fog"];
const LANES = [["left","Keep left"],["middle","Middle lane"],["right","Keep right"],["any","Any lane"]];
const SEVS = [["minor","Minor"],["slow","Slow down"],["avoid","Avoid if you can"]];
const TRIPS = [["smooth","Smooth"],["ok","Bit slow"],["rough","Rough"]];
const KINDS = { hazard: "Hazard", safety: "Safety", roadworks: "Roadworks", weather: "Weather", lane: "Lane advice", toll: "Toll", fuel: "Fuel & stops", tip: "Tip" };
const SEV_COLOR = { minor: "#2f7d4f", slow: "#d68a00", avoid: "#b8322a", "": "#5c6662" };
const label = (list, k) => (list.find(x => x[0] === k) || [k, k])[1];

/* ---------- Helpers ---------- */
const $ = id => document.getElementById(id);
const norm = s => (s || "").toLowerCase().replace(/\s+/g, " ").trim();
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]));
const store = {
  get(k) { try { return localStorage.getItem(k); } catch (_) { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch (_) {} }
};
function ago(ts) {
  const m = Math.max(0, Math.round((Date.now() - ts) / 60000));
  if (m < 1) return "just now";
  if (m < 60) return m + " min ago";
  const h = Math.round(m / 60);
  if (h < 24) return h + "h ago";
  const d = Math.round(h / 24);
  return d + (d === 1 ? " day ago" : " days ago");
}
function km(a, b) {
  const R = 6371, rad = x => x * Math.PI / 180;
  const dLat = rad(b.lat - a.lat), dLng = rad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}
function splitRoad(s) {
  const m = s.match(/^(.*?)\s*(north|south|east|west)(bound)?\s*$/i);
  if (!m || !m[1]) return { road: s, dir: "" };
  return { road: m[1].trim(), dir: m[2][0].toUpperCase() + m[2].slice(1).toLowerCase() + "bound" };
}
function getPosition(timeout = 8000) {
  return new Promise(resolve => {
    if (!navigator.geolocation) return resolve(null);
    navigator.geolocation.getCurrentPosition(
      p => resolve({ lat: +p.coords.latitude.toFixed(5), lng: +p.coords.longitude.toFixed(5) }),
      () => resolve(null),
      { enableHighAccuracy: true, timeout, maximumAge: 60000 }
    );
  });
}
async function roadAt(pos) {
  // OpenStreetMap's free lookup service. Light use only; see README for production options.
  try {
    const r = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&zoom=16&lat=${pos.lat}&lon=${pos.lng}`, { headers: { "Accept-Language": "en" } });
    if (!r.ok) return "";
    const j = await r.json();
    const a = j.address || {};
    return (a.road || j.name || a.suburb || "").slice(0, 40);
  } catch (_) { return ""; }
}

/* ---------- State ---------- */
const state = { reports: [], myVotes: new Map(), myReports: new Set(), myFlags: new Set(), user: null, q: "", ageDays: 3, near: null, loaded: false };
const form = { type: "pothole", lane: "", sev: "slow", trip: "" };
// Public report fields. The poster's user ID is deliberately not shown to anyone.
const REPORT_COLUMNS = "id,created_at,author_name,road,direction,location_note,type,severity,lane,trip,note,lat,lng,quick,confirms,cleared";
// Reports store locations rounded to about 100 m so nobody's exact position is published.
const roundLoc = v => (typeof v === "number" ? Math.round(v * 1000) / 1000 : null);
const fromRow = r => ({
  id: r.id, createdAt: Date.parse(r.created_at), authorName: r.author_name || "",
  road: r.road, dir: r.direction || "", where: r.location_note || "", type: r.type, sev: r.severity || "",
  lane: r.lane || "", trip: r.trip || "", note: r.note || "", lat: r.lat, lng: r.lng, quick: r.quick,
  confirms: r.confirms || 0, cleared: r.cleared || 0
});
const EXAMPLE = { id: "example", example: true, createdAt: Date.now() - 2 * 3600000, authorName: "Example driver", road: "N3", dir: "Northbound",
  where: "Van Reenen's Pass, about halfway up", type: "slow", sev: "slow", lane: "right", trip: "ok",
  note: "Two trucks crawling in the left lane up the pass. Stay right and expect 10 minutes extra.", lat: -28.367, lng: 29.392, confirms: 0, cleared: 0 };

/* ---------- Toast ---------- */
let toastTimer, undoFn = null;
function toast(text, undo) {
  $("toast-text").textContent = text;
  undoFn = undo || null;
  $("toast-undo").hidden = !undo;
  $("toast").hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { $("toast").hidden = true; undoFn = null; }, 7000);
}
$("toast-undo").onclick = async () => {
  const fn = undoFn; undoFn = null; $("toast").hidden = true;
  if (fn) { try { await fn(); toast("Removed."); } catch (_) { toast("Couldn't undo. Delete it from the feed instead."); } }
};

/* ---------- Account ---------- */
function displayName() {
  const m = state.user && state.user.user_metadata;
  return ((m && m.display_name) || store.get("hkr-name") || "").slice(0, 40);
}
function renderAccount() {
  const el = $("account");
  if (!CONNECTED) { el.innerHTML = ""; return; }
  if (state.user) {
    el.innerHTML = `<span>Signed in${displayName() ? " as " + esc(displayName()) : ""}</span><button type="button" id="signout">Sign out</button>`;
    $("signout").onclick = signOutHere;
  } else {
    el.innerHTML = `<button type="button" id="signin-open">Sign in to post</button>`;
    $("signin-open").onclick = openSignIn;
  }
}
// Sign out on this device only. If the session was already ended elsewhere (e.g. signed out
// on another device), the server says "session not found" — clear it locally anyway.
async function signOutHere() {
  const { error } = await sb.auth.signOut({ scope: "local" });
  if (error) { try { await sb.auth.signOut({ scope: "local" }); } catch (_) {} }
  state.user = null;
  renderAccount();
  loadMyVotes();
  toast("Signed out.");
}
function openSignIn() {
  $("si-msg").hidden = true;
  $("si-name").value = store.get("hkr-name") || "";
  const d = $("signin");
  if (d.showModal) d.showModal(); else d.setAttribute("open", "");
}
function requireSignIn() {
  if (!CONNECTED) { toast("This site isn't connected to its database yet. See README.md, step 2."); return false; }
  if (!state.user) { openSignIn(); return false; }
  return true;
}
$("si-cancel").onclick = () => $("signin").close();
let siSentTo = null;
async function verifyCode() {
  const msg = $("si-msg");
  const token = $("si-code").value.replace(/\D/g, "");
  if (!siSentTo) return;
  if (token.length < 6) { msg.textContent = "Type the code from the email (6 or more digits)."; msg.className = "msg err"; msg.hidden = false; return; }
  $("si-verify").disabled = true;
  const { error } = await sb.auth.verifyOtp({ email: siSentTo, token, type: "email" });
  $("si-verify").disabled = false;
  if (error) { msg.textContent = "That code didn't work. Check it, or tap \"Send again\" for a new one."; msg.className = "msg err"; msg.hidden = false; return; }
  $("si-code").value = "";
  if ($("signin").open) $("signin").close();
  toast("You're signed in.");
}
$("si-verify").onclick = verifyCode;
// Supabase "Email OTP Length" is set to 6: sign in as soon as 6 digits are typed or pasted.
const CODE_LEN = 6;
let lastTried = "";
$("si-code").addEventListener("input", () => {
  const digits = $("si-code").value.replace(/\D/g, "");
  if (digits.length === CODE_LEN && digits !== lastTried && !$("si-verify").disabled) { lastTried = digits; verifyCode(); }
});
$("si-code").addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); verifyCode(); } });
$("si-email").addEventListener("input", () => { if (siSentTo && $("si-email").value.trim() !== siSentTo) { siSentTo = null; $("si-code-step").hidden = true; $("si-send").textContent = "Email me a link"; $("si-send").classList.remove("ghost"); } });
$("signin-form").addEventListener("submit", async e => {
  e.preventDefault();
  const email = $("si-email").value.trim();
  const name = $("si-name").value.trim().slice(0, 40);
  const msg = $("si-msg");
  if (!/^\S+@\S+\.\S+$/.test(email)) { msg.textContent = "Enter a valid email address."; msg.className = "msg err"; msg.hidden = false; return; }
  store.set("hkr-name", name);
  $("si-send").disabled = true;
  const { error } = await sb.auth.signInWithOtp({ email, options: { emailRedirectTo: location.origin + location.pathname, data: { display_name: name } } });
  $("si-send").disabled = false;
  if (error) { msg.textContent = "Couldn't send the link: " + error.message; msg.className = "msg err"; }
  else {
    siSentTo = email;
    msg.textContent = "Sent! Tap the link in the email, or type the code below. Check spam if it's not there in a minute.";
    msg.className = "msg ok";
    $("si-code-step").hidden = false;
    $("si-send").textContent = "Send again"; $("si-send").classList.add("ghost");
    setTimeout(() => $("si-code").focus(), 50);
  }
  msg.hidden = false;
});

/* ---------- Detailed form ---------- */
function seg(id, list, key, allowNone) {
  const el = $(id);
  el.innerHTML = "";
  list.forEach(([k, l]) => {
    const b = document.createElement("button");
    b.type = "button"; b.textContent = l; b.setAttribute("aria-pressed", form[key] === k);
    b.onclick = () => { form[key] = (allowNone && form[key] === k) ? "" : k; seg(id, list, key, allowNone); };
    el.appendChild(b);
  });
}
seg("f-type", TYPES, "type", false);
seg("f-lane", LANES, "lane", true);
seg("f-sev", SEVS, "sev", false);
seg("f-trip", TRIPS, "trip", true);

function showMsg(text, kind) { const m = $("f-msg"); m.textContent = text; m.className = "msg" + (kind ? " " + kind : ""); m.hidden = !text; }

async function insertReport(row) {
  const clean = { ...row, lat: roundLoc(row.lat), lng: roundLoc(row.lng) };
  const { data, error } = await sb.from("reports").insert({ ...clean, author: state.user.id, author_name: displayName() || null }).select("id").single();
  if (error) throw error;
  state.myReports.add(data.id);
  return data.id;
}

$("form").addEventListener("submit", async e => {
  e.preventDefault();
  const road = $("f-road").value.trim();
  if (!road) { showMsg("Add the road name so other drivers can find this report.", "err"); return; }
  if (!requireSignIn()) return;
  const btn = $("f-submit"); btn.disabled = true;
  try {
    const pos = $("f-geo").checked ? await getPosition() : null;
    if ($("f-geo").checked && !pos) showMsg("Couldn't get your location, so the report is posted without a pin.", "");
    await insertReport({
      road: road.slice(0, 40), direction: $("f-dir").value, location_note: $("f-where").value.trim().slice(0, 90),
      note: $("f-note").value.trim().slice(0, 400), type: form.type, lane: form.lane, severity: form.sev, trip: form.trip,
      lat: pos ? pos.lat : null, lng: pos ? pos.lng : null
    });
    showMsg("Posted. Thanks for looking out for the next driver.", "ok");
    ["f-where", "f-note"].forEach(id => $(id).value = "");
    form.trip = ""; seg("f-trip", TRIPS, "trip", true);
    loadReports();
  } catch (err) {
    showMsg(friendlyError(err), "err");
  } finally { btn.disabled = false; }
});

function friendlyError(err) {
  const m = (err && err.message) || "";
  if (/Too many reports/i.test(m)) return "You've posted a lot in the last hour. Try again a bit later.";
  if (/JWT|auth|permission|row-level/i.test(m)) return "Please sign in again, then try once more.";
  return "Couldn't post just now. Check your signal and try again.";
}

/* ---------- Quick report ---------- */
const qkRoad = $("qk-road");
qkRoad.value = store.get("hkr-road") || "";
qkRoad.addEventListener("change", () => store.set("hkr-road", qkRoad.value.trim()));
QUICK.forEach(k => {
  const t = document.createElement("button");
  t.className = "tile"; t.type = "button"; t.textContent = label(TYPES, k);
  t.onclick = () => quickReport(k, t);
  $("tiles").appendChild(t);
});
function qkStatus(text) { const s = $("qk-status"); s.textContent = text; s.hidden = !text; }

$("qk-locate").onclick = async () => {
  qkStatus("Finding your location…");
  const pos = await getPosition();
  if (!pos) { qkStatus("Couldn't get your location. Allow location for this site, or type the road."); return; }
  state.lastPos = pos;
  const road = await roadAt(pos);
  if (road) { qkRoad.value = road; store.set("hkr-road", road); qkStatus("Found you on " + road + ". Add a direction if it helps, e.g. " + road + " Northbound."); }
  else qkStatus("Got your location, but couldn't name the road. Type it in.");
};

async function quickReport(type, btn) {
  if (!requireSignIn()) return;
  btn.disabled = true;
  try {
    const pos = await getPosition(6000);
    let raw = qkRoad.value.trim();
    if (!raw && pos) { raw = await roadAt(pos); if (raw) qkRoad.value = raw; }
    if (!raw) { qkRoad.focus(); toast("Type the road you're on first, e.g. N3 Northbound."); return; }
    store.set("hkr-road", raw);
    const { road, dir } = splitRoad(raw);
    const id = await insertReport({
      road: road.slice(0, 40), direction: dir, type, quick: true,
      severity: type === "crash" || type === "flood" ? "avoid" : "slow",
      lat: pos ? pos.lat : null, lng: pos ? pos.lng : null
    });
    toast(label(TYPES, type) + " reported on " + raw + (pos ? ", pinned to your location." : "."), async () => {
      const { error } = await sb.from("reports").delete().eq("id", id); if (error) throw error; loadReports();
    });
    loadReports();
  } catch (err) {
    toast(friendlyError(err));
  } finally { btn.disabled = false; }
}

/* ---------- Map ---------- */
let map = null, layer = null, didFit = false;
if (window.L) {
  map = L.map("map", { scrollWheelZoom: false }).setView([-28.6, 25.5], 5);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 18, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);
  layer = L.layerGroup().addTo(map);
}
function renderMap(list) {
  if (!map) return;
  layer.clearLayers();
  const pts = [];
  list.forEach(r => {
    if (typeof r.lat !== "number" || typeof r.lng !== "number") return;
    const stale = r.cleared > r.confirms;
    const m = L.circleMarker([r.lat, r.lng], {
      radius: 9, weight: 3, color: "#262c2a", fillColor: SEV_COLOR[r.sev] || SEV_COLOR[""], fillOpacity: stale ? 0.35 : 0.95
    }).bindPopup(`<b>${esc(r.road)}${r.dir ? " " + esc(r.dir) : ""}</b><br>${esc(label(TYPES, r.type))}${r.sev ? " · " + esc(label(SEVS, r.sev)) : ""}${r.lane ? " · " + esc(label(LANES, r.lane)) : ""}<br>${r.note ? esc(r.note) + "<br>" : ""}<small>${r.example ? "Example" : esc(ago(r.createdAt))}</small>`);
    m.addTo(layer); pts.push([r.lat, r.lng]);
  });
  if (state.near) {
    L.circle([state.near.lat, state.near.lng], { radius: 30000, color: "#f2b705", weight: 2, fill: false }).addTo(layer);
  }
  if (pts.length && (!didFit || state.q || state.near)) {
    map.fitBounds(pts.concat(state.near ? [[state.near.lat, state.near.lng]] : []), { padding: [30, 30], maxZoom: 13 });
    didFit = true;
  } else if (state.near) map.setView([state.near.lat, state.near.lng], 10);
}

/* ---------- Feed ---------- */
function visible() {
  const cutoff = Date.now() - state.ageDays * 86400000;
  const q = norm(state.q);
  return state.reports.filter(r => !state.myFlags.has(r.id) && (r.example || r.createdAt >= cutoff) &&
    (!q || norm([r.road, r.where, r.note, r.dir].join(" ")).includes(q)) &&
    (!state.near || (typeof r.lat === "number" && km(state.near, r) <= 30)));
}

function renderCheck(list) {
  const el = $("check");
  const where = state.near ? "Within 30 km of you" : state.q ? esc(state.q) : "All roads";
  const real = list.filter(r => !r.example);
  if (!real.length) {
    el.innerHTML = `<div><div class="eyebrow">Drive check</div><h2>${where}</h2></div>
      <p class="note" style="color:var(--asphalt-muted)">No reports in this window. That doesn't mean the road is clear, only that nobody has reported anything yet. If you've driven it recently, add what you saw so the next driver knows.</p>
      <div><button class="btn small" type="button" id="check-report">Post a quick report</button></div>`;
    $("check-report").onclick = () => {
      document.querySelector(".quick-band").scrollIntoView({ behavior: "smooth", block: "center" });
      setTimeout(() => qkRoad.focus({ preventScroll: true }), 400);
    };
    return;
  }
  const hazards = real.filter(r => r.type !== "tip").length;
  const avoid = real.filter(r => r.sev === "avoid").length;
  const laneCount = {};
  real.forEach(r => { if (r.lane && r.lane !== "any") laneCount[r.lane] = (laneCount[r.lane] || 0) + 1; });
  const topLane = Object.entries(laneCount).sort((a, b) => b[1] - a[1])[0];
  const trips = real.filter(r => r.trip);
  const score = { smooth: 0, ok: 1, rough: 2 };
  const avg = trips.length ? trips.reduce((s, r) => s + score[r.trip], 0) / trips.length : null;
  const tripWord = avg === null ? "No trip ratings" : avg < 0.6 ? "Mostly smooth" : avg < 1.4 ? "Mixed" : "Mostly rough";
  const newest = Math.max(...real.map(r => r.createdAt));
  el.innerHTML = `<div><div class="eyebrow">Drive check · ${state.ageDays === 1 ? "today" : "last " + state.ageDays + " days"}</div><h2>${where}</h2></div>
    <div class="stats">
      <div class="stat"><b>${hazards}</b><small>hazards reported</small></div>
      <div class="stat"><b>${avoid}</b><small>marked "avoid"</small></div>
      <div class="stat"><b class="word">${tripWord}</b><small>${trips.length} driver${trips.length === 1 ? "" : "s"} rated their trip</small></div>
      <div class="stat"><b class="word">${ago(newest)}</b><small>latest report</small></div>
    </div>
    ${topLane ? `<div><span class="lane-sign">${esc(label(LANES, topLane[0]))}</span><span class="lane-note">${topLane[1]} driver${topLane[1] === 1 ? "" : "s"} recommend it</span></div>` : ""}`;
}

function card(r) {
  const stale = r.cleared > r.confirms;
  const mine = !!state.user && state.myReports.has(r.id);
  const myVote = state.myVotes.get(r.id);
  const canVote = !r.example && CONNECTED;
  return `<article class="card${stale ? " stale" : ""}${state.focusId === r.id ? " focus" : ""}" id="r-${esc(r.id)}">
    <div class="card-top">
      ${r.example ? `<span class="pill ex">Example</span>` : ""}
      <span class="road">${esc(r.road)}${r.dir ? ` <span class="dir">${esc(r.dir)}</span>` : ""}</span>
      <span class="pill">${esc(label(TYPES, r.type))}</span>
      ${r.sev ? `<span class="pill sev-${esc(r.sev)}">${esc(label(SEVS, r.sev))}</span>` : ""}
      ${r.lane ? `<span class="pill lane">${esc(label(LANES, r.lane))}</span>` : ""}
    </div>
    ${r.where ? `<div class="where">${esc(r.where)}</div>` : ""}
    ${r.note ? `<p class="body-text">${esc(r.note)}</p>` : ""}
    <div class="meta">
      <span>${esc(r.authorName || "A driver")} · ${r.example ? "2h ago" : ago(r.createdAt)}${r.quick ? " · quick report" : ""}${typeof r.lat === "number" ? ` · <button class="linkbtn" data-act="map" data-id="${esc(r.id)}">on map</button>` : ""}${r.trip ? " · trip: " + esc(label(TRIPS, r.trip).toLowerCase()) : ""}${stale ? " · probably cleared" : ""}</span>
      <span class="votes">
        ${canVote ? `<button class="vote" type="button" data-act="confirm" data-id="${esc(r.id)}" aria-pressed="${myVote === "confirm"}">Still there · ${r.confirms}</button>
        <button class="vote" type="button" data-act="clear" data-id="${esc(r.id)}" aria-pressed="${myVote === "clear"}">Gone now · ${r.cleared}</button>`
        : `<span>${r.confirms} still there · ${r.cleared} gone</span>`}
        ${r.example ? "" : `<a class="wa-link" href="${esc(waLink(reportShareText(r)))}" target="_blank" rel="noopener">Share on WhatsApp</a>`}
        ${mine ? `<button class="linkbtn" type="button" data-act="delete" data-id="${esc(r.id)}">Delete</button>` : ""}
        ${canVote && !mine ? `<button class="linkbtn" type="button" data-act="flag" data-id="${esc(r.id)}">Flag</button>` : ""}
      </span>
    </div>
  </article>`;
}

function render() {
  const list = visible();
  renderCheck(list);
  renderMap(list);
  $("feed-title").textContent = state.near ? "Reports near you" : state.q ? "Reports matching " + state.q : "Latest from the road";
  const realCount = list.filter(r => !r.example).length;
  $("feed-count").textContent = realCount ? realCount + " report" + (realCount === 1 ? "" : "s") : "";
  const feed = $("feed");
  if (realCount) { feed.innerHTML = list.map(card).join(""); return; }
  const why = !state.loaded ? "Loading reports…" :
    state.reports.some(r => !r.example) ? "Nothing matches in this time window. Try a wider window or a shorter search." :
    "No reports yet. Be the first: tap a quick report next time you're on the road. This is what a report looks like:";
  feed.innerHTML = `<div class="empty"><p class="note" style="color:var(--ink)">${why}</p>${state.reports.some(r => !r.example) ? "" : card(EXAMPLE)}</div>`;
}

$("feed").addEventListener("click", async e => {
  const b = e.target.closest("[data-act]"); if (!b) return;
  const r = state.reports.find(x => x.id === b.dataset.id) || (b.dataset.id === "example" ? EXAMPLE : null);
  if (!r) return;
  if (b.dataset.act === "map") { if (map) { map.setView([r.lat, r.lng], 14); $("map").scrollIntoView({ behavior: "smooth", block: "center" }); } return; }
  if (!requireSignIn()) return;
  if (b.dataset.act === "flag") { openFlag(r.id); return; }
  b.disabled = true;
  try {
    if (b.dataset.act === "delete") {
      const { error } = await sb.from("reports").delete().eq("id", r.id); if (error) throw error;
    } else {
      const want = b.dataset.act;
      const current = state.myVotes.get(r.id);
      if (current === want) {
        const { error } = await sb.from("votes").delete().eq("report_id", r.id).eq("user_id", state.user.id); if (error) throw error;
        state.myVotes.delete(r.id);
      } else {
        const { error } = await sb.from("votes").upsert({ report_id: r.id, user_id: state.user.id, vote: want }, { onConflict: "report_id,user_id" }); if (error) throw error;
        state.myVotes.set(r.id, want);
      }
    }
    loadReports();
  } catch (err) { toast("Couldn't save that. Check your signal and try again."); }
  finally { b.disabled = false; }
});

/* ---------- Filters ---------- */
$("q").addEventListener("input", e => { state.q = e.target.value; render(); });
$("age-chips").addEventListener("click", async e => {
  const b = e.target.closest(".chip"); if (!b) return;
  if (b.id === "near-me") {
    if (state.near) { state.near = null; b.setAttribute("aria-pressed", "false"); render(); return; }
    b.textContent = "Finding you…";
    const pos = await getPosition();
    b.textContent = "Near me";
    if (!pos) { toast("Couldn't get your location. Allow location for this site and try again."); return; }
    state.near = pos; b.setAttribute("aria-pressed", "true"); render(); return;
  }
  state.ageDays = +b.dataset.age;
  document.querySelectorAll("#age-chips [data-age]").forEach(c => c.setAttribute("aria-pressed", c === b));
  render();
});

/* ---------- Data loading ---------- */
let loadTimer = null;
async function loadReports() {
  if (!CONNECTED) return;
  const since = new Date(Date.now() - 14 * 86400000).toISOString();
  const { data, error } = await sb.from("reports").select(REPORT_COLUMNS).gte("created_at", since).order("created_at", { ascending: false }).limit(500);
  if (!error) state.reports = data.map(fromRow);
  state.loaded = true;
  render();
  if (state.pendingReport) focusPendingReport();
}
async function loadMyVotes() {
  state.myVotes = new Map();
  state.myReports = new Set();
  state.myFlags = new Set();
  if (!CONNECTED || !state.user) { render(); return; }
  const [votes, mine, flags] = await Promise.all([
    sb.from("votes").select("report_id, vote").eq("user_id", state.user.id),
    sb.rpc("my_report_ids"),
    sb.from("report_flags").select("report_id").eq("user_id", state.user.id)
  ]);
  (votes.data || []).forEach(v => state.myVotes.set(v.report_id, v.vote));
  (flags.data || []).forEach(f => state.myFlags.add(f.report_id));
  (mine.data || []).forEach(row => state.myReports.add(typeof row === "string" ? row : (row.my_report_ids || row.id)));
  render();
}

/* ---------- Trip briefing: built-in route guides + live driver reports ---------- */
const briefBand = $("briefing"), briefBody = $("briefing-body");
const ROUTES = window.HKR_ROUTES || [], PLACES = window.HKR_PLACES || {};
const REPORT_KIND = { pothole: "hazard", lane: "roadworks", works: "roadworks", robots: "hazard", flood: "weather", debris: "hazard", crash: "hazard", hotspot: "safety", slow: "hazard", fog: "weather", tip: "tip" };
let briefCtl = null;

function placeKey(input) {
  const s = norm(input).replace(/[^a-z0-9' ]+/g, " ").replace(/\s+/g, " ").trim();
  if (!s) return null;
  for (const [key, aliases] of Object.entries(PLACES)) if (aliases.includes(s)) return key;
  let best = null, bestLen = 0;
  for (const [key, aliases] of Object.entries(PLACES)) {
    for (const a of aliases) {
      if (a.length < 4 || a.length <= bestLen) continue;
      if ((" " + s + " ").includes(" " + a + " ")) { best = key; bestLen = a.length; }
    }
  }
  return best;
}

const PARENT = window.HKR_PLACE_PARENT || {};
const PLACE_LABELS = window.HKR_PLACE_LABELS || {};
function withParents(k) { return PARENT[k] ? [k, PARENT[k]] : [k]; }
function findGuideKeys(f, t) {
  if (!f || !t) return null;
  // Within one city (e.g. Soweto to the East Rand, or Umhlanga to Durban), only a guide written for that exact trip counts.
  const sameCity = (PARENT[f] && (PARENT[f] === PARENT[t] || PARENT[f] === t)) || (PARENT[t] && PARENT[t] === f);
  const fs = sameCity ? [f] : withParents(f), ts = sameCity ? [t] : withParents(t);
  for (const fk of fs) for (const tk of ts) {
    if (fk === tk) continue;
    for (const r of ROUTES) {
      if (r.a.includes(fk) && r.b.includes(tk)) return { route: r, reversed: false };
      if (r.b.includes(fk) && r.a.includes(tk)) return { route: r, reversed: true };
    }
  }
  return null;
}
function findGuide(from, to) {
  const f = placeKey(from), t = placeKey(to);
  if (!f || !t || f === t) return null;
  return findGuideKeys(f, t);
}

function swapLegName(name) {
  const m = name.match(/^(.*) to (.*)$/);
  return m ? m[2] + " to " + m[1] : name;
}
function orient(route, reversed) {
  if (!reversed) return route;
  return { ...route, title: swapLegName(route.title),
    legs: route.legs.slice().reverse().map(l => ({ name: swapLegName(l.name), items: l.items.slice().reverse() })) };
}

function reportsOnRoute(route) {
  const cutoff = Date.now() - 3 * 86400000;
  const roads = route.roads.map(r => norm(r));
  const places = route.places.map(p => norm(p));
  return state.reports.filter(r => !r.example && r.createdAt >= cutoff && !(r.cleared > r.confirms)).filter(r => {
    const road = norm(r.road);
    if (roads.some(x => road === x || road.startsWith(x + " "))) return true;
    const text = norm([r.road, r.where, r.note].join(" "));
    return places.some(p => text.includes(p));
  }).slice(0, 10);
}

/* Planner controls */
const POPULAR_IDS = ["durban-joburg", "joburg-capetown", "pretoria-kruger", "pretoria-joburg", "capetown-gardenroute", "durban-ballito"];
POPULAR_IDS.map(id => ROUTES.find(r => r.id === id)).filter(Boolean).forEach(r => {
  const c = document.createElement("button");
  c.className = "pchip"; c.type = "button"; c.textContent = r.title.replace(" to ", " → ");
  c.onclick = () => openGuide(r, false);
  $("popular").appendChild(c);
});
const sel = $("p-guides");
if ($("guides-label")) $("guides-label").textContent = "All " + ROUTES.length + " route guides";
ROUTES.slice().sort((x, y) => x.title.localeCompare(y.title)).forEach(r => {
  const o = document.createElement("option"); o.value = r.id; o.textContent = r.title; sel.appendChild(o);
});
sel.addEventListener("change", () => { const r = ROUTES.find(x => x.id === sel.value); if (r) openGuide(r, false); sel.value = ""; });
$("planner").addEventListener("submit", e => { e.preventDefault(); getBriefing(false); });

function openGuide(route, reversed, keepInputs) {
  const g = orient(route, reversed);
  if (!keepInputs) { const [a, b] = g.title.split(" to "); $("p-from").value = a; $("p-to").value = b || ""; }
  briefBand.hidden = false;
  g.shareHash = guideHash(route, reversed);
  renderGuide(g, route);
  try { history.replaceState(null, "", g.shareHash); } catch (_) {}
  briefBand.scrollIntoView({ behavior: "smooth", block: "start" });
}

async function getBriefing(refresh) {
  const from = $("p-from").value.trim(), to = $("p-to").value.trim();
  if (!from || !to) { (from ? $("p-to") : $("p-from")).focus(); return; }
  const hit = findGuide(from, to);
  if (hit) { openGuide(hit.route, hit.reversed, true); return; }
  briefBand.hidden = false;
  if (CFG.AI_BRIEFINGS) return aiBriefing(from, to, refresh);
  renderNoGuide(from, to);
  briefBand.scrollIntoView({ behavior: "smooth", block: "start" });
}

/* Sharing */
const SITE_URL = location.origin + location.pathname;
const waLink = text => "https://wa.me/?text=" + encodeURIComponent(text);
function guideHash(route, reversed) { return "#g-" + route.id + (reversed ? "-r" : ""); }
function reportShareText(r) {
  const parts = [label(TYPES, r.type) + " on " + r.road + (r.dir ? " " + r.dir : "")];
  if (r.where) parts.push(r.where);
  if (r.sev) parts.push(label(SEVS, r.sev));
  if (r.lane) parts.push(label(LANES, r.lane));
  return "Heads up: " + parts.join(", ") + " (reported " + ago(r.createdAt) + ").\n" +
    (r.note ? r.note + "\n" : "") + "More road reports on Hamba Kahle Roads: " + SITE_URL + "#r-" + r.id;
}
function guideShareText(g, hash) {
  return "Driving " + g.title + "? Here's what to look out for: tolls, passes, fuel stops and recent reports from other drivers.\n" +
    "Hamba Kahle Roads: " + SITE_URL + hash;
}
async function copyText(text, btn) {
  const done = () => { const t = btn.textContent; btn.textContent = "Link copied"; setTimeout(() => btn.textContent = t, 1600); };
  try { await navigator.clipboard.writeText(text); done(); }
  catch (_) { window.prompt && window.prompt("Copy this link:", text); }
}

function itemHtml(it, src) {
  return `<div class="item k-${esc(it.kind)}">
    <div class="item-top"><span class="item-title">${esc(it.title)}</span>
      <span class="pill">${esc(KINDS[it.kind] || "Note")}</span>
      <span class="src ${src === "drivers" ? "src-drivers" : "src-general"}">${src === "drivers" ? "Drivers" : "Road know-how"}</span></div>
    ${it.detail ? `<p>${esc(it.detail)}</p>` : ""}
  </div>`;
}

function renderGuide(g, original) {
  const live = reportsOnRoute(original);
  const liveItems = live.map(r => ({
    kind: REPORT_KIND[r.type] || "hazard",
    title: `${label(TYPES, r.type)} on ${r.road}${r.dir ? " " + r.dir : ""}`,
    detail: [r.where, r.note, r.lane ? label(LANES, r.lane) : "", "reported " + ago(r.createdAt)].filter(Boolean).join(" · ")
  }));
  briefBody.innerHTML = `
    <div class="brief-head">
      <div style="display:grid;gap:6px;min-width:0">
        <div class="eyebrow">Route guide</div>
        <h2>${esc(g.title)}</h2>
        <div class="facts">
          ${g.route ? `<span>Route <b>${esc(g.route)}</b></span>` : ""}
          ${g.distanceKm ? `<span>About <b>${esc(Math.round(g.distanceKm).toLocaleString("en-ZA"))} km</b></span>` : ""}
          ${g.driveTime ? `<span>Drive <b>${esc(g.driveTime)}</b></span>` : ""}
          <span><b>${live.length}</b> driver report${live.length === 1 ? "" : "s"} in the last 3 days</span>
        </div>
      </div>
      <div class="share-row">
        ${g.shareHash ? `<a class="btn wa" href="${esc(waLink(guideShareText(g, g.shareHash)))}" target="_blank" rel="noopener">Share on WhatsApp</a>
        <button class="btn ghost small" type="button" id="g-copy">Copy link</button>` : ""}
      </div>
    </div>
    <div class="chips">
      ${g.roads.slice(0, 4).map(r => `<button class="chip" type="button" data-road="${esc(r)}">See ${esc(r)} reports</button>`).join("")}
    </div>
    ${g.summary ? `<p style="margin:0;max-width:70ch">${esc(g.summary)}</p>` : ""}
    <div class="live">
      <h3>From drivers, last 3 days</h3>
      ${liveItems.length ? `<div class="items">${liveItems.map(it => itemHtml(it, "drivers")).join("")}</div>`
        : `<p class="note">No driver reports on these roads in the last 3 days. That doesn't mean there are no hazards, only that nobody has reported any. Driven it recently? Add a quick report below so the next driver knows.</p>`}
    </div>
    <div class="brief-grid">
      <div class="before">
        <h3>Before you leave</h3>
        <ul>${g.before.map((b, i) => `<li><label><input type="checkbox" id="pre-${i}"><span>${esc(b)}</span></label></li>`).join("")}</ul>
      </div>
      <div class="strip">
        ${g.legs.map(l => `<div class="leg"><h3>${esc(l.name)}</h3><div class="items">${l.items.map(it => itemHtml(it, "general")).join("")}</div></div>`).join("")}
      </div>
    </div>
    <p class="note">"Road know-how" is general guidance and isn't live. Check the official sources for closures before you leave.</p>`;
  briefBody.querySelectorAll("[data-road]").forEach(b => b.onclick = () => {
    $("q").value = b.dataset.road; state.q = b.dataset.road; render();
    document.querySelector(".search-band").scrollIntoView({ behavior: "smooth" });
  });
  const cp = $("g-copy");
  if (cp) cp.onclick = () => copyText(SITE_URL + g.shareHash, cp);
}

function renderNoGuide(from, to) {
  briefBody.innerHTML = `
    <div><div class="eyebrow">Route guide</div><h2>${esc(from)} → ${esc(to)}</h2></div>
    <p style="margin:0;max-width:62ch">We don't have a guide for this trip yet. You can search driver reports by road name (like N3 or R61) below, or pick one of our guides:</p>
    <div class="chips">${ROUTES.map(r => `<button class="chip" type="button" data-guide="${esc(r.id)}">${esc(r.title)}</button>`).join("")}</div>`;
  briefBody.querySelectorAll("[data-guide]").forEach(b => b.onclick = () => openGuide(ROUTES.find(r => r.id === b.dataset.guide), false));
}

/* Optional: AI briefings for trips without a guide (needs api/briefing.js and AI_BRIEFINGS: true in config.js) */
async function aiBriefing(from, to, refresh) {
  if (briefCtl) briefCtl.abort();
  briefCtl = new AbortController();
  briefBody.innerHTML = `<div class="brief-head"><div><div class="eyebrow">Trip briefing</div><h2>${esc(from)} → ${esc(to)}</h2></div>
    <button class="btn ghost" id="b-stop" type="button">Stop</button></div>
    <div class="thinking"><span class="dashes"></span>We don't have a written guide for this trip, so we're building one. This can take up to half a minute.</div>`;
  $("b-stop").onclick = () => briefCtl && briefCtl.abort();
  try {
    const res = await fetch(CFG.BRIEFING_ENDPOINT || "/api/briefing", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ from, to, refresh: !!refresh }), signal: briefCtl.signal
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) throw { status: res.status, message: body.error };
    const d = body.data || {};
    renderGuide({ title: from + " to " + to, route: d.route || "", distanceKm: d.distanceKm || 0, driveTime: d.driveTime || "",
      roads: d.roads || [], summary: d.summary || "", before: d.before || [], legs: (d.legs || []).filter(l => l && Array.isArray(l.items)) },
      { roads: d.roads || [], places: [] });
  } catch (e) {
    if (e && e.name === "AbortError") { briefBody.innerHTML = `<p class="note">Stopped.</p>`; return; }
    renderNoGuide(from, to);
  }
}

/* ---------- Feedback ---------- */
const FB_KINDS = [["guide", "Route guide"], ["bug", "Something's broken"], ["idea", "Idea"], ["other", "Other"]];
let fbKind = "guide";
function fbSeg() {
  const el = $("fb-kind"); el.innerHTML = "";
  FB_KINDS.forEach(([k, l]) => {
    const b = document.createElement("button");
    b.type = "button"; b.textContent = l; b.setAttribute("aria-pressed", fbKind === k);
    b.onclick = () => { fbKind = k; fbSeg(); };
    el.appendChild(b);
  });
}
fbSeg();
function openFeedback() {
  $("fb-msg").hidden = true;
  if (state.user && state.user.email && !$("fb-email").value) $("fb-email").value = state.user.email;
  const d = $("feedback");
  if (d.showModal) d.showModal(); else d.setAttribute("open", "");
}
$("feedback-open").onclick = openFeedback;
$("feedback-tab").onclick = openFeedback;
$("fb-cancel").onclick = () => $("feedback").close();
$("feedback-form").addEventListener("submit", async e => {
  e.preventDefault();
  const msg = $("fb-msg");
  const text = $("fb-text").value.trim();
  const email = $("fb-email").value.trim();
  const show = (t, k) => { msg.textContent = t; msg.className = "msg " + k; msg.hidden = false; };
  if (text.length < 3) { show("Type a message first.", "err"); return; }
  if (email && !/^\S+@\S+\.\S+$/.test(email)) { show("That email doesn't look right. Leave it empty if you don't want a reply.", "err"); return; }
  if (!CONNECTED) { show("Feedback can't be sent until the site is connected to its database.", "err"); return; }
  $("fb-send").disabled = true;
  const { error } = await sb.from("feedback").insert({
    kind: fbKind, message: text.slice(0, 1500), email: email || null,
    page: (location.pathname + location.hash).slice(0, 200), user_agent: navigator.userAgent.slice(0, 300)
  });
  $("fb-send").disabled = false;
  if (error) { show("Couldn't send just now. Check your signal and try again.", "err"); return; }
  $("fb-text").value = "";
  $("feedback").close();
  toast("Thanks! Your feedback was sent.");
});

/* ---------- Flag a report (spam, abuse, wrong, private info) ---------- */
const FLAG_REASONS = [["spam", "Spam or advert"], ["abuse", "Rude or abusive"], ["false", "Fake or wrong"], ["private", "Private info"], ["other", "Something else"]];
let flagReason = "spam", flagTarget = null;
function flagSeg() {
  const el = $("flag-reason"); el.innerHTML = "";
  FLAG_REASONS.forEach(([k, l]) => {
    const b = document.createElement("button");
    b.type = "button"; b.textContent = l; b.setAttribute("aria-pressed", flagReason === k);
    b.onclick = () => { flagReason = k; flagSeg(); };
    el.appendChild(b);
  });
}
flagSeg();
function openFlag(id) {
  flagTarget = id;
  $("flag-msg").hidden = true;
  const d = $("flag");
  if (d.showModal) d.showModal(); else d.setAttribute("open", "");
}
$("flag-cancel").onclick = () => $("flag").close();
$("flag-form").addEventListener("submit", async e => {
  e.preventDefault();
  if (!flagTarget || !state.user) return;
  const msg = $("flag-msg");
  $("flag-send").disabled = true;
  const { error } = await sb.from("report_flags").insert({ report_id: flagTarget, user_id: state.user.id, reason: flagReason });
  $("flag-send").disabled = false;
  if (error && error.code !== "23505") {
    msg.textContent = /Too many/.test(error.message || "") ? "You've flagged a lot in the last hour. Try again later." : "Couldn't send just now. Check your signal and try again.";
    msg.className = "msg err"; msg.hidden = false; return;
  }
  state.myFlags.add(flagTarget);
  flagTarget = null;
  $("flag").close();
  render();
  toast("Thanks. It's hidden for you, and we'll take a look.");
});

/* ---------- First-visit welcome ---------- */
(() => {
  const el = $("welcome");
  if (store.get("hkr-welcomed")) return;
  el.hidden = false;
  const done = () => { el.hidden = true; store.set("hkr-welcomed", "1"); };
  $("welcome-close").onclick = done;
  $("welcome-ok").onclick = done;
  $("welcome-try").onclick = () => {
    done();
    const r = ROUTES.find(x => x.id === "durban-joburg");
    if (r) openGuide(r, false);
  };
})();

/* ---------- Place suggestions while typing ---------- */
const UPPER = new Set(["or", "cbd", "ct", "pe", "jhb", "pta", "dbn", "pmb", "el"]);
const titleCase = a => a.split(" ").map(w => UPPER.has(w) ? w.toUpperCase() : w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
const placeLabel = k => PLACE_LABELS[k] || titleCase((PLACES[k] || [k])[0]);
const SUGGEST = [];
Object.entries(PLACES).forEach(([key, aliases]) => {
  const main = placeLabel(key);
  SUGGEST.push({ text: main, key, area: "", main: true });
  aliases.forEach(a => {
    if (a.length <= 3) return;
    const t = titleCase(a);
    if (norm(t) === norm(main)) return;
    SUGGEST.push({ text: t, key, area: main, main: false });
  });
});
function exactGuide(f, t) {
  return ROUTES.some(r => (r.a.includes(f) && r.b.includes(t)) || (r.b.includes(f) && r.a.includes(t)));
}
/* Places with a guide from f: guides written for that exact trip first, then city-level ones.
   Suburbs reached only through their city's guide are left out in favour of the city itself. */
function guideKeysFrom(f) {
  if (!f) return new Set();
  const exact = [], viaCity = [];
  Object.keys(PLACES).forEach(t => {
    if (t === f || !findGuideKeys(f, t)) return;
    if (exactGuide(f, t)) exact.push(t); else viaCity.push(t);
  });
  const all = new Set([...exact, ...viaCity]);
  return new Set([...exact, ...viaCity.filter(t => !(PARENT[t] && all.has(PARENT[t])))]);
}
function suggestFor(input, which) {
  const q = norm(input.value).replace(/[^a-z0-9' ]+/g, " ").trim();
  const otherKey = which === "to" ? placeKey($("p-from").value) : null;
  const guided = guideKeysFrom(otherKey);
  if (!q) {
    if (which === "to" && guided.size) return [...guided].map(k => ({ text: placeLabel(k), key: k, area: "", main: true, guide: true })).slice(0, 12);
    return ["joburg", "pretoria", "durban", "capetown", "gqeberha", "bloem", "eastlondon", "polokwane"].filter(k => PLACES[k]).map(k => ({ text: placeLabel(k), key: k, area: "", main: true }));
  }
  const scored = [];
  SUGGEST.forEach(s => {
    const t = norm(s.text);
    let score = -1;
    if (t.startsWith(q)) score = 3;
    else if (t.split(" ").some(w => w.startsWith(q))) score = 2;
    else if (q.length >= 3 && t.includes(q)) score = 1;
    if (score < 0) return;
    if (s.main) score += 0.5;
    const guide = guided.has(s.key) || (PARENT[s.key] && guided.has(PARENT[s.key]));
    if (guide) score += 2;
    scored.push({ ...s, guide, score });
  });
  scored.sort((a, b) => b.score - a.score || a.text.length - b.text.length);
  const seen = new Set(), out = [];
  for (const s of scored) { if (seen.has(s.key)) continue; seen.add(s.key); out.push(s); if (out.length >= 7) break; }
  return out;
}
function setupSuggest(inputId, listId, which) {
  const input = $(inputId), list = $(listId);
  let items = [], active = -1;
  const close = () => { list.hidden = true; input.setAttribute("aria-expanded", "false"); active = -1; };
  const paint = () => {
    list.innerHTML = items.map((s, i) => `<div class="sg-item${i === active ? " active" : ""}" role="option" id="${listId}-${i}" data-i="${i}" aria-selected="${i === active}">
      <span class="sg-text">${esc(s.text)}</span>${s.area ? `<span class="sg-area">${esc(s.area)}</span>` : ""}${s.guide ? `<span class="sg-guide">Route guide</span>` : ""}</div>`).join("");
    input.setAttribute("aria-activedescendant", active >= 0 ? listId + "-" + active : "");
  };
  const open = () => {
    items = suggestFor(input, which);
    // Nothing to suggest, or the box already holds the only match: keep the list out of the way.
    if (!items.length || (items.length === 1 && norm(items[0].text) === norm(input.value))) return close();
    active = -1; paint(); list.hidden = false; input.setAttribute("aria-expanded", "true");
  };
  const pick = i => {
    const s = items[i]; if (!s) return;
    input.value = s.text; close();
    if (which === "from") { $("p-to").focus(); }
    else if ($("p-from").value.trim()) getBriefing(false);
  };
  input.addEventListener("input", open);
  input.addEventListener("focus", open);
  input.addEventListener("blur", () => setTimeout(close, 120));
  input.addEventListener("keydown", e => {
    if (list.hidden) return;
    if (e.key === "ArrowDown") { e.preventDefault(); active = Math.min(items.length - 1, active + 1); paint(); }
    else if (e.key === "ArrowUp") { e.preventDefault(); active = Math.max(-1, active - 1); paint(); }
    else if (e.key === "Enter" && active >= 0) { e.preventDefault(); pick(active); }
    else if (e.key === "Escape") { close(); }
  });
  list.addEventListener("mousedown", e => e.preventDefault());
  list.addEventListener("click", e => { const el = e.target.closest(".sg-item"); if (el) pick(+el.dataset.i); });
}
setupSuggest("p-from", "sg-from", "from");
setupSuggest("p-to", "sg-to", "to");

/* ---------- Shared links (#g-route-id, #r-report-id) ---------- */
function handleHash() {
  const h = decodeURIComponent(location.hash.slice(1));
  if (h.startsWith("g-")) {
    const reversed = h.endsWith("-r");
    const id = reversed ? h.slice(2, -2) : h.slice(2);
    const route = ROUTES.find(r => r.id === id);
    if (route) openGuide(route, reversed, false);
  } else if (h.startsWith("r-")) {
    state.pendingReport = h.slice(2);
    focusPendingReport();
  }
}
function focusPendingReport() {
  const id = state.pendingReport;
  if (!id || !state.loaded) return;
  const r = state.reports.find(x => x.id === id);
  if (!r) { if (CONNECTED && state.reports.length) { toast("That report has expired or was removed."); state.pendingReport = null; } return; }
  state.pendingReport = null;
  state.q = ""; $("q").value = ""; state.near = null;
  state.ageDays = 14;
  document.querySelectorAll("#age-chips [data-age]").forEach(c => c.setAttribute("aria-pressed", c.dataset.age === "14"));
  state.focusId = id;
  render();
  const el = document.getElementById("r-" + id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
  setTimeout(() => { state.focusId = null; const e2 = document.getElementById("r-" + id); if (e2) e2.classList.remove("focus"); }, 4000);
}
window.addEventListener("hashchange", handleHash);

/* ---------- Install + offline ---------- */
let deferredInstall = null;
window.addEventListener("beforeinstallprompt", e => { e.preventDefault(); deferredInstall = e; $("install").hidden = false; });
$("install").onclick = async () => { if (!deferredInstall) return; deferredInstall.prompt(); await deferredInstall.userChoice; deferredInstall = null; $("install").hidden = true; };
if ("serviceWorker" in navigator && location.protocol === "https:") navigator.serviceWorker.register("sw.js").catch(() => {});

/* ---------- Start ---------- */
if (!CONNECTED) {
  $("setup-banner").hidden = false;
  state.reports = [EXAMPLE];
  state.loaded = true;
  renderAccount();
  render();
} else {
  render();
  sb.auth.getSession().then(async ({ data }) => {
    state.user = data.session ? data.session.user : null; renderAccount(); loadMyVotes();
    // A session ended on another device still looks signed in here until it's checked.
    if (data.session) {
      const { error } = await sb.auth.getUser();
      if (error && (error.status === 401 || error.status === 403 || /session/i.test(error.message || ""))) {
        try { await sb.auth.signOut({ scope: "local" }); } catch (_) {}
        state.user = null; renderAccount(); loadMyVotes();
      }
    }
  });
  sb.auth.onAuthStateChange((_evt, session) => {
    const was = state.user && state.user.id;
    state.user = session ? session.user : null;
    renderAccount();
    if ((state.user && state.user.id) !== was) { loadMyVotes(); if (state.user && $("signin").open) $("signin").close(); }
  });
  loadReports();
  sb.channel("reports-live")
    .on("postgres_changes", { event: "*", schema: "public", table: "reports" }, () => { clearTimeout(loadTimer); loadTimer = setTimeout(loadReports, 800); })
    .subscribe();
  setInterval(render, 60000);
}
if (/^#(g|r)-/.test(location.hash)) handleHash();
})();
