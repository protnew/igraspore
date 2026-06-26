# iGraSpore — Architecture

## Concept
Simulation of microorganism life in a puddle. 100 real species of bacteria, protozoa, fungi.
Infinite 2D map with sunlight, nutrients, temperature.
Player controls one organism, evolves, eats others.

## Tech Stack
- **Single HTML file** (Canvas + JS) — works without server, file:// OK
- **No dependencies** — pure JS
- **GitHub Pages** — deployment

## Engine Architecture
1. **World** — infinite map (chunk-based), each chunk 512×512 px
2. **Environment** — sunlight (depth/time of day), temperature, pH, nutrients
3. **Organism** — base class: position, energy, size, speed, DNA (parameters)
4. **Species** — 100 pre-defined species with real characteristics
5. **Player** — player organism control (WASD + mouse)
6. **Ecosystem** — food web: producers → consumers → decomposers
7. **Renderer** — Canvas 2D, camera follows player, zoom

## Organization Levels
- **Producers** (photosynthetic): cyanobacteria, algae
- **Consumers I**: predatory bacteria, small flagellates
- **Consumers II**: amoebas, ciliates
- **Consumers III**: large protozoa, rotifers
- **Decomposers**: fungi, destructive bacteria

## Key Mechanics
- Cell division (reproduction)
- Phagocytosis (eating)
- Photosynthesis (producers)
- Chemosynthesis
- Movement: flagella, cilia, pseudopodia
- Cysts (dormancy under unfavorable conditions)
- Taxis: phototaxis, chemotaxis
- Slime and biofilms

## Controls
- WASD — movement
- Mouse — attack/movement direction
- Space — sprint (costs energy)
- E — eat/phagocytosis
- Q — divide (when energy is sufficient)
- Tab — species table
- Scroll — zoom
