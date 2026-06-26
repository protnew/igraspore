# iGraSpore — Project Artifacts

## What is this
Browser-based simulation game of 100 real microorganism species living in a puddle.
Canvas 2D, single HTML file, works without server. Inspired by Spore (cell stage).

## Repository
- **GitHub**: https://github.com/protnew/igraspore
- **GitHub Pages**: https://protnew.github.io/igraspore/
- **Local clone**: `/workspace/igraspore/`

## Obsidian (project root)
`C:\Obsidian\New\Projects\iGraSpore\` (`/data/Obsidian/New/Projects/iGraSpore/`)

## Project Files

### Documentation (docs/)
| File | Description |
|---|---|
| `docs/ARCHITECTURE.md` | Engine architecture (concept, stack, organization levels, mechanics) |
| `docs/DECISIONS.md` | 13 architectural decisions with parametric analysis (9 criteria, weights Σ=100%) |
| `docs/DECISIONS_FULL.md` | Full decisions with all alternatives |
| `docs/DECISIONS_STATUS.md` | Validation status of all 10 tables (42 decisions, 1080 score cells) |
| `docs/iGraSpore — техническое задание.md` | Full specs: 100 species, engine, AI, controls, rendering, balance |
| `docs/iGraSpore — артефакты проекта.md` | ← This file. Artifact list + status |
| `docs/Бэклог_идей_перезапуск.md` | Ideas for restart (4 proposals) |

### Localized Documentation (docs/lang/)
| Language | Code | Files |
|---|---|---|
| English (default) | en | ARCHITECTURE, SPECS, BACKLOG |
| Русский | ru | ARCHITECTURE, SPECS, BACKLOG |
| Français | fr | ARCHITECTURE, SPECS, BACKLOG |
| Español | es | ARCHITECTURE, SPECS, BACKLOG |
| 中文 | zh | ARCHITECTURE, SPECS, BACKLOG |

### Assets
| File | Description |
|---|---|
| `assets/A_Движок_и_рендеринг.xlsx` | Engine & rendering (6 decisions, 16 alternatives) |
| `assets/B_Мир_и_среда.xlsx` | World & environment (6 decisions, 16 alternatives) |
| `assets/C_Организмы_ИИ.xlsx` | Organisms & AI (5 decisions, 16 alternatives) |
| `assets/D_Энергия_взаимодействие.xlsx` | Energy & interaction (5 decisions, 15 alternatives) |
| `assets/E_Игрок.xlsx` | Player (3 decisions, 9 alternatives) |
| `assets/F_Баланс_экосистемы.xlsx` | Ecosystem balance (3 decisions, 9 alternatives) |
| `assets/G_UI_UX.xlsx` | UI/UX (5 decisions, 13 alternatives) |
| `assets/H_Данные_хранение.xlsx` | Data & storage (3 decisions, 9 alternatives) |
| `assets/I_Кросс_платформа.xlsx` | Cross-platform (4 decisions, 11 alternatives) |
| `assets/J_Звук_эффекты.xlsx` | Sound & effects (2 decisions, 6 alternatives) |
| `assets/T1_Движки_фреймворки.xlsx` | Table 1: Engine comparison (12 engines × 12 criteria) |
| `assets/T2_OpenSource_заготовки.xlsx` | Table 2: Open-source projects (14 projects × 13 criteria) |

### Source code (src/)
| File | Status | Description |
|---|---|---|
| `src/index.html` | ❌ Not created | The game (HTML+CSS+JS) in a single file |

## Status
- [x] Repository created
- [x] Specs approved (100 species, 5 categories)
- [x] Architecture described (ARCHITECTURE.md)
- [x] 13 architectural decisions analyzed (DECISIONS.md + Excel)
- [x] Engine comparison (12 frameworks)
- [x] Open-source comparison (14 projects)
- [x] Documentation localized (5 languages)
- [ ] Game written (src/index.html)
- [ ] Tested (node --check, 100 frames headless)
- [ ] Pushed to GitHub
- [ ] GitHub Pages enabled

## Final Tech Stack

| Decision | Choice |
|---|---|
| Rendering | Canvas 2D |
| Code structure | Single file monolith |
| Collisions | Grid (fixed spatial hash) |
| AI behavior | FSM |
| World generation | Random + value noise, infinite chunk-based |
| Storage | In-memory + localStorage |
| Cross-platform | Pure HTML |
| Sound | No sound (MVP) |
| HUD | HTML overlay |
| Species data | JSON inline |
| Food web | Simplified (larger eats smaller) |
| Mobile | Virtual joystick + buttons |
