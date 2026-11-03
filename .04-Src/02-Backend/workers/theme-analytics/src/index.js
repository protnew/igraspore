/** Cloudflare Worker: theme analytics ingest (Analytics Engine). No secrets in responses. */
const ALLOWED = new Set(["classic","neon-bio","phase-contrast","glass-lab","cyberpunk-scanner","haeckel-watercolor","engraving"]);
const SCREENS = new Set(["bestiary","pond"]);
const EVENTS = new Set(["theme_assign","theme_change","theme_time","session_len","return_d1","return_d7"]);

function cors(origin, env) {
  const list = String((env && env.ALLOWED_ORIGINS) || "http://127.0.0.1:8795,http://127.0.0.1:8793,https://igraspore.pages.dev").split(",").map(s=>s.trim());
  const ok = list.includes(origin);
  return {
    "Access-Control-Allow-Origin": ok ? origin : list[0],
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Stats-Gate",
    "Vary": "Origin"
  };
}

function json(data, status, headers) {
  return new Response(JSON.stringify(data), { status, headers: Object.assign({ "Content-Type": "application/json" }, headers||{}) });
}

function validEvent(ev) {
  if (!ev || typeof ev !== "object") return false;
  if (!EVENTS.has(ev.event)) return false;
  if (ev.screen && !SCREENS.has(ev.screen)) return false;
  if (ev.themeId && !ALLOWED.has(ev.themeId)) return false;
  if (ev.to && !ALLOWED.has(ev.to)) return false;
  if (ev.from && ev.from !== "classic" && !ALLOWED.has(ev.from) && ev.from !== "unknown") return false;
  if (typeof ev.anonId !== "string" || ev.anonId.length < 4 || ev.anonId.length > 80) return false;
  if (typeof ev.sessionId !== "string" || ev.sessionId.length < 4 || ev.sessionId.length > 80) return false;
  if (typeof ev.ts !== "number") return false;
  return true;
}

function emptyAgg() {
  const themes = {};
  for (const t of ALLOWED) themes[t] = { sessions: 0, timeMedian: 0, changesOut: 0 };
  return { sessions: 0, d1: 0, d7: 0, timeMedian: Object.fromEntries([...ALLOWED].map(t=>[t,0])), changes: [], themes };
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const headers = cors(origin, env);
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers });
    const url = new URL(request.url);
    if (url.pathname === "/theme-events" && request.method === "POST") {
      let body;
      try { body = await request.json(); } catch (e) { return json({ ok:false, error:"bad_json" }, 400, headers); }
      const events = Array.isArray(body.events) ? body.events.slice(0, 50) : [];
      let n = 0;
      for (const ev of events) {
        if (!validEvent(ev)) continue;
        if (env.THEME_AE && env.THEME_AE.writeDataPoint) {
          env.THEME_AE.writeDataPoint({
            blobs: [ev.event, ev.screen || "", ev.themeId || ev.to || "", ev.anonId, ev.sessionId, ev.from || ""],
            doubles: [ev.ts, ev.ms || 0],
            indexes: [ev.anonId]
          });
          n++;
        } else { n++; }
      }
      return json({ ok:true, accepted:n }, 200, headers);
    }
    if (url.pathname === "/theme-stats" && request.method === "GET") {
      const gate = request.headers.get("X-Stats-Gate") || "";
      if (env.STATS_GATE && gate !== env.STATS_GATE) {
        return json({ ok:false, error:"forbidden" }, 403, headers);
      }
      return json({
        ok:true,
        source: env.CF_API_TOKEN ? "ae-pending-query" : "dev-empty",
        themes: [...ALLOWED],
        bestiary: emptyAgg(),
        pond: emptyAgg(),
        note: "Configure CF_API_TOKEN + account to enable SQL"
      }, 200, headers);
    }
    if (url.pathname === "/health") return json({ ok:true, themes:[...ALLOWED] }, 200, headers);
    return json({ ok:false, error:"not_found" }, 404, headers);
  }
};

export { ALLOWED, SCREENS, EVENTS, validEvent, emptyAgg };
