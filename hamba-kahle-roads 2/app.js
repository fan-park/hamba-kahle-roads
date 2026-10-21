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
const state = { reports: [], myVotes: new Map(), myReports: new Set(), myFlags: new Set(), guide: null, loadError: false, user: null, q: "", ageDays: 3, near: null, loaded: false };
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
  let res = await sb.auth.signOut({ scope: "local" }).catch(e => ({ error: e }));
  if (res && res.error) res = await sb.auth.signOut({ scope: "local" }).catch(e => ({ error: e }));
  if (res && res.error) {
    // Couldn't reach the server: remove the saved sign-in from this device ourselves, then reload.
    try { Object.keys(localStorage).filter(k => /^sb-.+-auth-token/.test(k)).forEach(k => localStorage.removeItem(k)); } catch (_) {}
    try { sessionStorage.setItem("hkr-signed-out", "1"); } catch (_) {}
    location.reload();
    return;
  }
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
  // Take a snapshot now, so edits made while the location is found don't mix into this report.
  const snap = {
    road: road.slice(0, 40), direction: $("f-dir").value, location_note: $("f-where").value.trim().slice(0, 90),
    note: $("f-note").value.trim().slice(0, 400), type: form.type, lane: form.lane, severity: form.sev, trip: form.trip
  };
  const wantGeo = $("f-geo").checked;
  const sentWhere = $("f-where").value, sentNote = $("f-note").value;
  try {
    const pos = wantGeo ? await getPosition() : null;
    if (wantGeo && !pos) showMsg("Couldn't get your location, so the report is posted without a pin.", "");
    await insertReport({ ...snap, lat: pos ? pos.lat : null, lng: pos ? pos.lng : null });
    showMsg("Posted. Thanks for looking out for the next driver.", "ok");
    if (CFG.WHATSAPP_CHANNEL) $("f-msg").insertAdjacentHTML("beforeend", ` <a href="${esc(CFG.WHATSAPP_CHANNEL)}" target="_blank" rel="noopener">Get weekly road updates on WhatsApp</a>.`);
    if ($("f-where").value === sentWhere) $("f-where").value = "";
    if ($("f-note").value === sentNote) $("f-note").value = "";
    if (form.trip === snap.trip) { form.trip = ""; seg("f-trip", TRIPS, "trip", true); }
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
  let raw = qkRoad.value.trim();
  try {
    const pos = await getPosition(6000);
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
  const tokens = q ? q.split(" ").filter(Boolean) : [];
  return state.reports.filter(r => !state.myFlags.has(r.id) && (r.example || r.createdAt >= cutoff) &&
    (!tokens.length || (text => tokens.every(t => text.includes(t)))(norm([r.road, r.dir, r.where, r.note].join(" ")))) &&
    (!state.near || (typeof r.lat === "number" && km(state.near, r) <= 30)));
}

function renderCheck(list) {
  const el = $("check");
  const where = state.near ? "Within 30 km of you" : state.q ? esc(state.q) : "All roads";
  const real = list.filter(r => !r.example);
  if (state.loadError && !state.reports.some(r => !r.example)) {
    el.innerHTML = `<div><div class="eyebrow">Drive check</div><h2>${where}</h2></div>
      <p class="note" style="color:var(--asphalt-muted)">Couldn't load driver reports just now, so we can't say what's on the road. Check your signal and try again.</p>`;
    return;
  }
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
  refreshGuideLive();
  renderMyTrips();
  $("feed-title").textContent = state.near ? "Reports near you" : state.q ? "Reports matching " + state.q : "Latest from the road";
  const realCount = list.filter(r => !r.example).length;
  $("feed-count").textContent = realCount ? realCount + " report" + (realCount === 1 ? "" : "s") : "";
  const feed = $("feed");
  if (realCount) { feed.innerHTML = list.map(card).join(""); return; }
  if (state.loadError && !state.reports.some(r => !r.example)) {
    feed.innerHTML = `<div class="empty"><p class="note" style="color:var(--ink)">Couldn't load reports just now. This doesn't mean the roads are clear. Check your signal and try again.</p><div><button class="btn small" type="button" id="feed-retry">Try again</button></div></div>`;
    $("feed-retry").onclick = () => { feed.innerHTML = `<div class="empty"><p class="note">Loading reports…</p></div>`; loadReports(); };
    return;
  }
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
let loadTimer = null, loadSeq = 0;
async function loadReports() {
  if (!CONNECTED) return;
  const seq = ++loadSeq;
  const since = new Date(Date.now() - 14 * 86400000).toISOString();
  let res;
  try { res = await sb.from("reports").select(REPORT_COLUMNS).gte("created_at", since).order("created_at", { ascending: false }).limit(500); }
  catch (e) { res = { data: null, error: e }; }
  if (seq !== loadSeq) return; // a newer load has started; ignore this older answer
  if (res.error || !res.data) { state.loadError = true; }
  else {
    state.loadError = false;
    const rows = res.data.map(fromRow);
    // Keep a report opened from a shared link even if it's older than the newest 500.
    if (state.extraReport && !rows.some(r => r.id === state.extraReport.id)) rows.push(state.extraReport);
    state.reports = rows;
  }
  state.loaded = true;
  render();
  if (state.pendingReport) focusPendingReport();
}
let voteGen = 0;
async function loadMyVotes() {
  const gen = ++voteGen;
  state.myVotes = new Map();
  state.myReports = new Set();
  state.myFlags = new Set();
  if (!CONNECTED || !state.user) { render(); return; }
  const uid = state.user.id;
  const [votes, mine, flags] = await Promise.all([
    sb.from("votes").select("report_id, vote").eq("user_id", uid),
    sb.rpc("my_report_ids"),
    sb.from("report_flags").select("report_id").eq("user_id", uid)
  ]);
  // Ignore answers for an account that has since signed out or changed.
  if (gen !== voteGen || !state.user || state.user.id !== uid) return;
  const v2 = new Map(), m2 = new Set(), f2 = new Set();
  (votes.data || []).forEach(v => v2.set(v.report_id, v.vote));
  (flags.data || []).forEach(f => f2.add(f.report_id));
  (mine.data || []).forEach(row => m2.add(typeof row === "string" ? row : (row.my_report_ids || row.id)));
  state.myVotes = v2; state.myReports = m2; state.myFlags = f2;
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
    // Guides are written one way; say so, so exits and lane tips aren't taken literally on the return trip.
    reverseNote: "This guide was written for " + route.title + ". The same roads apply on your trip, but read exits, merges and lane tips the other way round.",
    legs: route.legs.slice().reverse().map(l => ({ name: swapLegName(l.name), items: l.items.slice().reverse() })) };
}

/* Distance in km from a point to a polyline of [lat, lng] waypoints (flat-earth approximation, fine at these scales). */
const ROUTE_PATHS = window.HKR_ROUTE_PATHS || {};
function kmToPath(pt, path) {
  const kx = 111.32 * Math.cos(pt.lat * Math.PI / 180), ky = 110.57;
  let best = Infinity;
  for (let i = 0; i < path.length - 1; i++) {
    const ax = (path[i][1] - pt.lng) * kx, ay = (path[i][0] - pt.lat) * ky;
    const bx = (path[i + 1][1] - pt.lng) * kx, by = (path[i + 1][0] - pt.lat) * ky;
    const dx = bx - ax, dy = by - ay, len2 = dx * dx + dy * dy;
    const t = len2 ? Math.max(0, Math.min(1, -(ax * dx + ay * dy) / len2)) : 0;
    best = Math.min(best, Math.hypot(ax + t * dx, ay + t * dy));
  }
  return best;
}
/* Recent driver reports that belong to this trip. Pinned reports must lie along the route's corridor;
   unpinned ones that only match a road number are marked so the guide can say they may be elsewhere. */
function reportsOnRoute(route) {
  const cutoff = Date.now() - 3 * 86400000;
  const roads = route.roads.map(r => norm(r));
  const places = route.places.map(p => norm(p));
  const corridor = route.id ? ROUTE_PATHS[route.id] : null;
  const out = [];
  state.reports.forEach(r => {
    if (r.example || r.createdAt < cutoff || r.cleared > r.confirms || state.myFlags.has(r.id)) return;
    const road = norm(r.road);
    const roadHit = roads.some(x => road === x || road.startsWith(x + " "));
    const text = " " + norm([r.road, r.where, r.note].join(" ")) + " ";
    const placeHit = places.some(p => text.includes(" " + p + " ") || text.includes(" " + p));
    if (!roadHit && !placeHit) return;
    if (typeof r.lat === "number" && typeof r.lng === "number" && corridor) {
      if (corridor.paths.some(path => kmToPath(r, path) <= corridor.tol)) out.push({ r, unpinned: false });
      return;
    }
    out.push({ r, unpinned: !placeHit });
  });
  return out;
}

/* Planner controls */
const POPULAR_IDS = ["durban-joburg", "joburg-capetown", "pretoria-kruger", "pretoria-joburg", "capetown-gardenroute", "durban-ballito"];
POPULAR_IDS.map(id => ROUTES.find(r => r.id === id)).filter(Boolean).forEach(r => {
  const c = document.createElement("a");
  c.className = "pchip"; c.href = guidePath(r, false); c.textContent = r.title.replace(" to ", " → ");
  c.onclick = e => { e.preventDefault(); openGuide(r, false); };
  $("popular").appendChild(c);
});
const sel = $("p-guides");
if ($("guides-label")) $("guides-label").textContent = "All " + ROUTES.length + " route guides";
ROUTES.slice().sort((x, y) => x.title.localeCompare(y.title)).forEach(r => {
  const o = document.createElement("option"); o.value = r.id; o.textContent = r.title; sel.appendChild(o);
});
sel.addEventListener("change", () => { const r = ROUTES.find(x => x.id === sel.value); if (r) openGuide(r, false); sel.value = ""; });
$("planner").addEventListener("submit", e => { e.preventDefault(); getBriefing(false); });

/* ---------- Your trips: guides you've opened, remembered on this device only ---------- */
const TRIPS_KEY = "hkr-trips", TRIPS_MAX = 4;
function loadTrips() {
  try { const t = JSON.parse(store.get(TRIPS_KEY) || "[]"); return Array.isArray(t) ? t.filter(x => x && ROUTES.some(r => r.id === x.id)) : []; }
  catch (_) { return []; }
}
function saveTrips(t) { store.set(TRIPS_KEY, JSON.stringify(t.slice(0, TRIPS_MAX))); }
function rememberTrip(route, reversed) {
  if (!route || !route.id) return;
  const t = loadTrips().filter(x => !(x.id === route.id && !!x.rev === !!reversed));
  t.unshift({ id: route.id, rev: !!reversed, seen: Date.now() });
  saveTrips(t);
  renderMyTrips();
}
function forgetTrip(i) { const t = loadTrips(); t.splice(i, 1); saveTrips(t); renderMyTrips(); }
function renderMyTrips() {
  const box = $("mytrips"), list = $("mytrips-list");
  if (!box) return;
  const trips = loadTrips();
  if (!trips.length) { box.hidden = true; return; }
  box.hidden = false;
  list.innerHTML = trips.map((t, i) => {
    const route = ROUTES.find(r => r.id === t.id);
    const title = orient(route, t.rev).title.replace(" to ", " → ");
    let status;
    if (!CONNECTED) status = "";
    else if (state.loadError && !state.reports.some(r => !r.example)) status = `<span class="trip-status">Reports unavailable</span>`;
    else if (!state.loaded) status = `<span class="trip-status">Checking…</span>`;
    else {
      const live = reportsOnRoute(route);
      const fresh = live.filter(({ r }) => r.createdAt > (t.seen || 0)).length;
      status = fresh ? `<span class="trip-status new">${fresh} new report${fresh === 1 ? "" : "s"}</span>`
        : live.length ? `<span class="trip-status">${live.length} report${live.length === 1 ? "" : "s"}, last 3 days</span>`
        : `<span class="trip-status">No recent reports</span>`;
    }
    return `<div class="trip"><button class="trip-open" type="button" data-trip="${i}"><span class="trip-title">${esc(title)}</span>${status}</button><button class="trip-x" type="button" data-forget="${i}" aria-label="Remove ${esc(title)}">×</button></div>`;
  }).join("");
}
$("mytrips-list").addEventListener("click", e => {
  const f = e.target.closest("[data-forget]");
  if (f) { forgetTrip(+f.dataset.forget); return; }
  const o = e.target.closest("[data-trip]"); if (!o) return;
  const t = loadTrips()[+o.dataset.trip]; const route = t && ROUTES.find(r => r.id === t.id);
  if (route) openGuide(route, t.rev, false);
});

function openGuide(route, reversed, keepInputs) {
  if (briefCtl) { briefCtl.abort(); briefCtl = null; }
  rememberTrip(route, reversed);
  const g = orient(route, reversed);
  if (!keepInputs) {
    const a = placeLabel(route.a[0]), b = placeLabel(route.b[0]);
    $("p-from").value = reversed ? b : a; $("p-to").value = reversed ? a : b;
  }
  briefBand.hidden = false;
  g.shareHash = guidePath(route, reversed);
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
  state.guide = null;
  if (location.pathname !== "/" || location.hash) { try { history.replaceState(null, "", "/"); } catch (_) {} }
  if (CFG.AI_BRIEFINGS) return aiBriefing(from, to, refresh);
  renderNoGuide(from, to);
  briefBand.scrollIntoView({ behavior: "smooth", block: "start" });
}

/* Sharing */
const SITE_URL = location.origin + "/";
/* Every guide also has its own address (/guides/durban-to-johannesburg) so search engines can list it.
   It opens this same one-page site with that guide showing. Keep in step with tools/build-guides.js. */
function guideSlug(title) { return title.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }
function guidePath(route, reversed) { return "/guides/" + guideSlug(orient(route, reversed).title); }
function guideFromPath(path) {
  const m = (path || "").match(/^\/guides\/([a-z0-9-]+?)(?:\.html)?\/?$/);
  if (!m) return null;
  for (const r of ROUTES) for (const rev of [false, true]) if (guideSlug(orient(r, rev).title) === m[1]) return { route: r, reversed: rev };
  return null;
}
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
    "Hamba Kahle Roads: " + location.origin + hash;
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

const GUIDE_SHOW = 10;
function guideCountText(live) {
  if (state.loadError && !state.reports.some(r => !r.example)) return `Driver reports <b>unavailable</b>`;
  return `<b>${live.length}</b> driver report${live.length === 1 ? "" : "s"} in the last 3 days`;
}
function guideLiveHtml(live) {
  if (state.loadError && !state.reports.some(r => !r.example)) {
    return `<h3>From drivers, last 3 days</h3><p class="note">Couldn't load driver reports just now, so we can't say what's on these roads. Check your signal and try again.</p>`;
  }
  if (!state.loaded && CONNECTED) return `<h3>From drivers, last 3 days</h3><p class="note">Loading driver reports…</p>`;
  const items = live.slice(0, GUIDE_SHOW).map(({ r, unpinned }) => ({
    kind: REPORT_KIND[r.type] || "hazard",
    title: `${label(TYPES, r.type)} on ${r.road}${r.dir ? " " + r.dir : ""}`,
    detail: [r.where, r.note, r.lane ? label(LANES, r.lane) : "", "reported " + ago(r.createdAt),
      unpinned ? "no location pinned, so it may be elsewhere on the " + r.road : ""].filter(Boolean).join(" · ")
  }));
  return `<h3>From drivers, last 3 days</h3>
    ${items.length ? `<div class="items">${items.map(it => itemHtml(it, "drivers")).join("")}</div>
      ${live.length > GUIDE_SHOW ? `<p class="note">Showing the newest ${GUIDE_SHOW} of ${live.length}. Search the road below to see them all.</p>` : ""}`
      : `<p class="note">No driver reports on these roads in the last 3 days. That doesn't mean there are no hazards, only that nobody has reported any. Driven it recently? Add a quick report below so the next driver knows.</p>`}`;
}
/* Keep an open guide's driver section in step with the latest reports, votes and flags. */
function refreshGuideLive() {
  if (!state.guide || briefBand.hidden) return;
  const live = reportsOnRoute(state.guide.original);
  const box = $("g-live"), count = $("g-live-count");
  if (box) box.innerHTML = guideLiveHtml(live);
  if (count) count.innerHTML = guideCountText(live);
}
function renderGuide(g, original) {
  state.guide = { original };
  const live = reportsOnRoute(original);
  briefBody.innerHTML = `
    <div class="brief-head">
      <div style="display:grid;gap:6px;min-width:0">
        <div class="eyebrow">Route guide</div>
        <h2>${esc(g.title)}</h2>
        <div class="facts">
          ${g.route ? `<span>Route <b>${esc(g.route)}</b></span>` : ""}
          ${g.distanceKm ? `<span>About <b>${esc(Math.round(g.distanceKm).toLocaleString("en-ZA"))} km</b></span>` : ""}
          ${g.driveTime ? `<span>Drive <b>${esc(g.driveTime)}</b></span>` : ""}
          <span id="g-live-count">${guideCountText(live)}</span>
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
    ${g.reverseNote ? `<p class="note reverse-note">${esc(g.reverseNote)}</p>` : ""}
    <div class="live" id="g-live">${guideLiveHtml(live)}</div>
    <div class="brief-grid">
      <div class="before">
        <h3>Before you leave</h3>
        <ul>${g.before.map((b, i) => `<li><label><input type="checkbox" id="pre-${i}"><span>${esc(b)}</span></label></li>`).join("")}</ul>
      </div>
      <div class="strip">
        ${g.legs.map(l => `<div class="leg"><h3>${esc(l.name)}</h3><div class="items">${l.items.map(it => itemHtml(it, "general")).join("")}</div></div>`).join("")}
      </div>
    </div>
    <p class="note">"Road know-how" is general guidance and isn't live. Check the official sources for closures before you leave.</p>
    ${CFG.WHATSAPP_CHANNEL ? `<div class="wa-cta"><span><b>Get weekly road updates on WhatsApp.</b> Roadworks, closures and fuel prices every Thursday, free.</span><a class="btn wa" href="${esc(CFG.WHATSAPP_CHANNEL)}" target="_blank" rel="noopener">Follow Road Watch</a></div>` : ""}`;
  briefBody.querySelectorAll("[data-road]").forEach(b => b.onclick = () => {
    $("q").value = b.dataset.road; state.q = b.dataset.road; render();
    document.querySelector(".search-band").scrollIntoView({ behavior: "smooth" });
  });
  const cp = $("g-copy");
  if (cp) cp.onclick = () => copyText(location.origin + g.shareHash, cp);
}

function renderNoGuide(from, to) {
  state.guide = null;
  briefBody.innerHTML = `
    <div><div class="eyebrow">Route guide</div><h2>${esc(from)} → ${esc(to)}</h2></div>
    <p style="margin:0;max-width:62ch">We don't have a guide for this trip yet. You can search driver reports by road name (like N3 or R61) below, or pick one of our guides:</p>
    <div class="chips">${ROUTES.map(r => `<button class="chip" type="button" data-guide="${esc(r.id)}">${esc(r.title)}</button>`).join("")}</div>`;
  briefBody.querySelectorAll("[data-guide]").forEach(b => b.onclick = () => openGuide(ROUTES.find(r => r.id === b.dataset.guide), false));
}

/* Optional: AI briefings for trips without a guide (switched off; needs a server endpoint that isn't included yet) */
async function aiBriefing(from, to, refresh) {
  if (briefCtl) briefCtl.abort();
  const ctl = briefCtl = new AbortController();
  state.guide = null;
  briefBody.innerHTML = `<div class="brief-head"><div><div class="eyebrow">Trip briefing</div><h2>${esc(from)} → ${esc(to)}</h2></div>
    <button class="btn ghost" id="b-stop" type="button">Stop</button></div>
    <div class="thinking"><span class="dashes"></span>We don't have a written guide for this trip, so we're building one. This can take up to half a minute.</div>`;
  $("b-stop").onclick = () => ctl.abort();
  try {
    const res = await fetch(CFG.BRIEFING_ENDPOINT || "/api/briefing", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ from, to, refresh: !!refresh }), signal: ctl.signal
    });
    const body = await res.json().catch(() => ({}));
    if (briefCtl !== ctl) return; // the driver has moved on to another trip
    if (!res.ok) throw { status: res.status, message: body.error };
    const d = body.data || {};
    renderGuide({ title: from + " to " + to, route: d.route || "", distanceKm: d.distanceKm || 0, driveTime: d.driveTime || "",
      roads: d.roads || [], summary: d.summary || "", before: d.before || [], legs: (d.legs || []).filter(l => l && Array.isArray(l.items)) },
      { roads: d.roads || [], places: [] });
  } catch (e) {
    if (briefCtl !== ctl) return;
    if (e && e.name === "AbortError") { briefBody.innerHTML = `<p class="note">Stopped.</p>`; return; }
    renderNoGuide(from, to);
  } finally { if (briefCtl === ctl) briefCtl = null; }
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
  const target = flagTarget; // the report this request is about, even if the dialog changes meanwhile
  $("flag-send").disabled = true;
  const { error } = await sb.from("report_flags").insert({ report_id: target, user_id: state.user.id, reason: flagReason });
  $("flag-send").disabled = false;
  const stillOpen = flagTarget === target && $("flag").open;
  if (error && error.code !== "23505") {
    msg.textContent = /Too many/.test(error.message || "") ? "You've flagged a lot in the last hour. Try again later." : "Couldn't send just now. Check your signal and try again.";
    if (stillOpen) { msg.className = "msg err"; msg.hidden = false; } else toast(msg.textContent);
    return;
  }
  state.myFlags.add(target);
  if (stillOpen) { flagTarget = null; $("flag").close(); }
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
    const guide = !!otherKey && s.key !== otherKey && !!findGuideKeys(otherKey, s.key);
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
  if (!r) {
    if (!CONNECTED || state.loadError) return;
    if (state.fetchingShared === id) return;
    state.fetchingShared = id;
    sb.from("reports").select(REPORT_COLUMNS).eq("id", id).maybeSingle().then(({ data }) => {
      state.fetchingShared = null;
      if (state.pendingReport !== id) return;
      if (!data || Date.parse(data.created_at) < Date.now() - 14 * 86400000) { toast("That report has expired or was removed."); state.pendingReport = null; return; }
      state.extraReport = fromRow(data);
      if (!state.reports.some(x => x.id === id)) state.reports.push(state.extraReport);
      focusPendingReport();
    });
    return;
  }
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
const isStandalone = () => (window.matchMedia && window.matchMedia("(display-mode: standalone)").matches) || navigator.standalone === true;
const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
const isPhone = isIOS || /android|mobile/i.test(navigator.userAgent);
window.addEventListener("beforeinstallprompt", e => { e.preventDefault(); deferredInstall = e; if (!isStandalone()) $("install").hidden = false; });
if (isPhone && !isStandalone()) $("install").hidden = false;
if (isStandalone()) document.querySelectorAll(".welcome-note").forEach(el => el.hidden = true);
function installSteps() {
  if (isIOS) return `<ol class="install-list"><li>Tap the <b>Share</b> button (the square with an arrow pointing up). In Safari it's at the bottom of the screen; in Chrome it's at the top.</li><li>Scroll down and tap <b>Add to Home Screen</b>.</li><li>Tap <b>Add</b>. Hamba Kahle Roads now sits on your home screen like an app.</li></ol>`;
  if (/android/i.test(navigator.userAgent)) return `<ol class="install-list"><li>Tap the <b>⋮</b> menu at the top right of Chrome.</li><li>Tap <b>Add to Home screen</b> or <b>Install app</b>.</li><li>Tap <b>Add</b> or <b>Install</b>. It then opens from your home screen like an app.</li></ol>`;
  return `<p class="note">Open <b>hambakahleroads.co.za</b> on your phone, then use your browser's menu or Share button and choose <b>Add to Home Screen</b>.</p>`;
}
document.addEventListener("click", async e => {
  if (!e.target.closest("[data-install]")) return;
  if (deferredInstall) {
    deferredInstall.prompt(); await deferredInstall.userChoice; deferredInstall = null;
    if (isStandalone()) $("install").hidden = true;
    return;
  }
  $("install-steps").innerHTML = installSteps();
  const d = $("install-help"); if (d.showModal) d.showModal(); else d.setAttribute("open", "");
});
$("install-close").onclick = () => $("install-help").close();
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
  // Re-fetch every two minutes (and when the tab comes back) so hidden or changed reports don't linger.
  setInterval(() => { if (!document.hidden) loadReports(); }, 120000);
  document.addEventListener("visibilitychange", () => { if (!document.hidden) loadReports(); });
}
if (/^#(g|r)-/.test(location.hash)) handleHash();
else { const fromPath = guideFromPath(location.pathname); if (fromPath) openGuide(fromPath.route, fromPath.reversed, false); }
try { if (sessionStorage.getItem("hkr-signed-out")) { sessionStorage.removeItem("hkr-signed-out"); toast("Signed out."); } } catch (_) {}
})();
