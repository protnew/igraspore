# REPORT TZ-08 SPOR v29 themes — 2026-11-03 (strict eye)

Branch: release-ready-2026-10-14
HEAD at write: (see git)
Stand web: http://127.0.0.1:8820/?lang=en&themePond=THEME&themeBestiary=THEME
Lab: http://127.0.0.1:8793/

## Strict eye-% (side-by-side mock vs game 1400). Goal 99.9% NOT met.

| style | pond eye% | bestiary eye% | auto MAD pond/best | notes |
|---|---:|---:|---|---|
| phase-contrast | 55 | 48 | 73.3 / 23.3 | grey vignette partial; bestiary light cards |
| haeckel-watercolor | 58 | 72 | 77.8 / 86.4 | parchment+thumbs; thumbs faint ≠ watercolor grid mock |
| neon-bio | 48 | 68 | 92.8 / 90.2 | dark sky OK; water still teal-murk; glow weak |
| glass-lab | 60 | 74 | 78.6 / 94.2 | soft clinical tint; thumbs ok |
| engraving | 52 | 66 | 70.4 / 84.7 | sepia/hatch partial |
| cyberpunk-scanner | 62 | 72 | 87.9 / 93.7 | grid/scan partial; dark top |

Auto MAD = 100*(1-meanAbsDiff/255) on 64x64 — too optimistic when both dark/beige; **eye overrides**.

## FPS
- classic_375 med 59.9 p5 29.9; neon_375 med 59.9 p5 30 — neon not worse than classic
- overlapFails=0

## APK
- debug APK built with theme_visuals/engine/css/themes JSON after cap sync
- emulator-5554 (kq_test35) repeatedly ANR / "System UI isn't responding"; CDP WebView socket absent for app; force-theme zip shots were splash/ANR — **APK theme proof incomplete**

## Box files
See /workspace/v29all2/ (small PNGs, no zip)

## Links
- http://127.0.0.1:8820/?lang=en&themePond=neon-bio&themeBestiary=neon-bio
- http://127.0.0.1:8820/?lang=en&themePond=haeckel-watercolor&themeBestiary=haeckel-watercolor
- http://127.0.0.1:8820/?lang=en&themePond=phase-contrast&themeBestiary=phase-contrast
- http://127.0.0.1:8820/?lang=en&themePond=glass-lab&themeBestiary=glass-lab
- http://127.0.0.1:8820/?lang=en&themePond=engraving&themeBestiary=engraving
- http://127.0.0.1:8820/?lang=en&themePond=cyberpunk-scanner&themeBestiary=cyberpunk-scanner
