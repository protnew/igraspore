# 🦠 iGraSpore

Microorganism life simulation in a puddle. 100 real species of bacteria, protozoa, fungi.
Infinite 2D map. Canvas 2D, pure JS, single HTML file, works with file://.

## Status: ✅ Live — https://protnew.github.io/igraspore/

Playable in any browser, including mobile.

**Unique niches Thrive does NOT cover:**

| Niche | Thrive | iGraSpore could |
|---|---|---|
| Browser, no install | No (download Godot build) | Yes (single HTML file) |
| 100 real species | ~15 fictional ones | Real taxonomies |
| Educational simulation | Game (entertainment) | Scientific accuracy |
| Mobile browser | No | Yes |
| Embed in website | No | Yes |

## Stack

- Single `index.html` — HTML + CSS + JS, no dependencies, no CDN
- Canvas 2D rendering
- Chunk-based infinite world
- FSM AI for organisms
- Spatial hash for 500+ entities @60fps

## What's done (v0.13)

- [x] 100 real species (25 producers + 20 consumers I + 25 consumers II + 15 consumers III + 15 decomposers)
- [x] Full Canvas 2D rendering: cell shapes, organelles (nucleus, chloroplasts, vacuoles, cilia, flagella, pseudopodia, eyespot, cell wall, stalk)
- [x] Ecosystem simulation: photosynthesis, predator/prey, decomposition, nutrient clouds, O₂ bubbles
- [x] Day/night cycle, 4 seasons, rain, ice, currents, wind, bioluminescence
- [x] Evolution system: grow → divide → evolve through trophic levels
- [x] Player controls: WASD, mouse-swim, right-click target, touch joystick, auto-mode (Tab)
- [x] 10 languages (RU, EN, ZH, ES, HI, AR, PT, FR, DE, JA, KO)
- [x] Minimap, population graph, species info panel, settings, 3 difficulty levels
- [x] Spatial hash for 500+ entities @ 60fps

## Restart proposals

1. **BioLab Simulator** — embeddable educational module for schools
2. **Microcosm** — mobile PWA, puddle in your pocket
3. **Taxonomy Explorer** — interactive atlas of 100 species
4. **AI Biology Teacher** — visual aid for lectures
