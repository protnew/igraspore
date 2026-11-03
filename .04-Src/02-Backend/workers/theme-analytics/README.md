# theme-analytics Worker

Ingests anonymous theme events into Cloudflare Analytics Engine.

## Owner checklist before prod deploy
1. Cloudflare account with Workers + Analytics Engine enabled
2. Create dataset `igs_theme_events`
3. Copy `wrangler.toml.example` to `wrangler.toml`, set account_id
4. `wrangler secret put STATS_GATE`
5. Optional: `wrangler secret put CF_API_TOKEN` (Account Analytics Read) for SQL dashboard
6. `wrangler deploy` (explicit owner approval — not part of wave-1 automation)
7. Set client `IGS_THEME_ANALYTICS_URL` to the Worker URL (no tokens)

Local: `npx wrangler dev` from this folder.
