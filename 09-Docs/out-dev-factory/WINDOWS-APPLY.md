# WINDOWS-APPLY — v3-webgl split — 2026-09-23

## Status: BLOCKED (executor box-scoped)

| Item | Value |
|------|-------|
| Requested machineId | `eb1f1b15-17ce-46e0-9365-d1c0a98494dc` |
| Actual Shell host | Linux box `grok-bot-vm-181518285` (`/workspace`) |
| Windows SoT apply | **NO** — no Windows Shell/Read from this executor |
| Box lean-push apply | **YES** (prior executor) — already split, all js &lt;500 |
| Ferry on box | `/workspace/agent-transfer-staging/refactor-v3webgl-20260923/` |
| Ferry on Windows (parent said copied) | `C:\Users\Space\agent-transfer\refactor-v3webgl-20260923\` |

Same blocker as BAG-IG-050 / prior PARENT_RUNME pattern: **box executor cannot reach Windows disk**.

## What parent must run on machineId

```powershell
$env:HTTP_PROXY=''; $env:HTTPS_PROXY=''; $env:ALL_PROXY=''; $env:http_proxy=''; $env:https_proxy=''
$env:GCM_INTERACTIVE='never'; $env:GIT_TERMINAL_PROMPT='0'
# Ensure ferry has latest APPLY script (CopyFromBox if needed):
#   box: /workspace/agent-transfer-staging/refactor-v3webgl-20260923/APPLY-WINDOWS.ps1
#   win: C:\Users\Space\agent-transfer\refactor-v3webgl-20260923\APPLY-WINDOWS.ps1
powershell -NoProfile -ExecutionPolicy Bypass -File C:\Users\Space\agent-transfer\refactor-v3webgl-20260923\APPLY-WINDOWS.ps1
```

Script does: archive overs if needed → copy ferry JS → backup+replace v3-webgl HTML → docs (append-only FOUND_BUGS BAG-IG-046…050) → vitest + qa_unit + playwright≤12min → lean git commit (no push) → rewrite this WINDOWS-APPLY.md with real results.

## Box SoT mirror line counts (already applied; excl archive)

| File | Lines |
|------|------:|
| ai.js | 371 |
| ai_move.js | 196 |
| biology.js | 92 |
| biology_divide.js | 70 |
| biology_eat.js | 188 |
| biology_update.js | 3 |
| biology_update_core.js | 473 |
| biology_virus.js | 75 |
| config.js | 284 |
| locomotion.js | 19 |
| main.js | 308 |
| main_events.js | 280 |
| organs.js | 60 |
| render.js | 203 |
| render_edu.js | 214 |
| render_effects.js | 445 |
| render_entities.js | 356 |
| render_fx.js | 132 |
| render_helpers.js | 365 |
| render_organs.js | 306 |
| render_surface.js | 393 |
| ui.js | 214 |
| ui_menus.js | 393 |
| world.js | 261 |
| world_update.js | 264 |

**Overs ≥500 outside archive: 0**

Box commit (prior): `9a3a55f0e438ae25e36e845aee69414a852bcc40` (lean-push clone; push=no)

## Tests on Windows

Not run from this executor. After APPLY-WINDOWS.ps1 expect logs:

- `C:\Users\Space\agent-transfer\refactor-v3webgl-20260923\windows-vitest.log` (~201 if full tree)
- `...\windows-qa_unit.log`
- `...\windows-playwright.log`

Box prior: vitest 50/50; qa_unit MISSING; playwright 1 PASS / 2 FAIL (canvas baselines).

## Git

Windows commit: **skipped** (no Windows access). Prefer parent run script; no push unless clean.

## Live scope

`.04-Src\js` + live `index.html` stamp / CF: **NOT touched** (as required).

## Blockers

1. **Hard:** Shell/Read bound to Linux box; machineId Windows unreachable from this executor.
2. Parent must CopyFromBox `APPLY-WINDOWS.ps1` (+ this note) into ferry if Windows ferry is stale, then run script on machineId.

Полностью закончен ответ
