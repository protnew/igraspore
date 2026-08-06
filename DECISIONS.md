# DECISIONS.md — iGraSpore V2

## D1: Render Stack
- **WebGL raw** (176 pts) > Three.js (165) > Canvas 2D (84)
- V3 hybrid: WebGL water/sky + Canvas 2D organisms

## D2: File Structure
- **Monolith exception**: `biology_update_core.js` contains `updateOrg()` — one monolithic function (547 lines).
  - **Reason**: The function shares 30+ local variables across phases (metabolism → photosynthesis → behavior → eating). Splitting into sub-functions would require passing a shared context object, adding complexity and runtime overhead for a real-time simulation loop at 60fps with 2000+ organisms.
  - **Waiver**: Owner-approved library exception. The function is well-commented with section markers. All other files comply with <500 LOC.

## D3: Single Backlog
- SSOT: `08-Backlog/backlog_iGraSpore_V2.db`
- All other backlog files are deprecated copies (see D4)

## D4: Backlog Cleanup
- `BACKLOG.md`, `BACKLOG_106.md`, `BACKLOG_PRIORITIZED.md` — deprecated, will be archived
- `09-Docs/docs/lang/*/BACKLOG.md` — translation snapshots, not active
