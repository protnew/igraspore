# iGraSpore — Technical Specifications

## Summary
Browser-based game inspired by Spore (cell stage). Canvas 2D, pure JS, single HTML file.
Works with `file://` without a server. Goal: progress from bacterium to macro-protozoan.

## 100 Real Species (5 Categories)

### PRODUCERS (25) — Photosynthetic
Cyanobacteria: Synechocystis sp., Anabaena variabilis, Spirulina platensis, Nostoc punctiforme, Oscillatoria limnetica, Microcystis aeruginosa, Gleocapsa sp., Lyngbya majuscula
Green algae: Chlamydomonas reinhardtii, Chlorella vulgaris, Volvox globator, Euglena gracilis, Scenedesmus quadricauda, Haematococcus pluvialis, Dunaliella salina, Micrasterias rotata
Diatoms: Navicula sp., Pinnularia viridis, Cyclotella meneghiniana, Diatoma vulgare
Other: Rhodospirillum rubrum, Chromatium vinosum, Porphyridium cruentum, Prochlorococcus marinus

### CONSUMERS I (20) — Predatory bacteria + flagellates
Bdellovibrio bacteriovorus, Vampirococcus sp., Daptobacter sp., Myxococcus xanthus
Bacteriovorax stolpii, Halobacteriovorax sp., Peredibacter starrii
Flagellates: Monas guttula, Oikomonas termo, Anthophysa vegetans, Chilomonas paramecium
Cercomonas longicauda, Heteromita globosa, Bodonas saltans, Procryptobia sorokini
Trypanosoma brucei (microform), Leishmania donovani (amastigote)
Choanoflagellates: Monosiga brevicollis, Salpingoeca rosetta, Codonosiga botrytis

### CONSUMERS II (25) — Ciliates + amoebas
Ciliates: Paramecium caudatum, Paramecium bursaria, Stentor coeruleus, Stentor polymorphus, Vorticella campanula, Vorticella microstoma, Didinium nasutum, Spirostomum ambiguum, Blepharisma americanum, Euplotes patella, Stylonychia pustulata, Oxytricha trifallax, Tetrahymena thermophila, Coleps hirtus, Litonotus lamella, Dileptus anser, Urocentrum turbo, Zoothamnium arbuscula, Opercularia coarctata
Amoebas: Amoeba proteus, Arcella vulgaris, Difflugia oblonga, Euglypha alveolata, Nebela collaris, Centropyxis aculeata

### CONSUMERS III (15) — Large protozoa + rotifers
Heliozoa: Actinophrys sol, Actinosphaerium eichhorni, Raphidiophrys pallida
Rotifers: Rotaria rotatoria, Philodina roseola, Brachionus plicatilis, Keratella cochlearis, Asplanchna priodonta
Gastrotrichs: Chaetonotus maximus, Lepidodermella squamata
Turbellaria: Macrostomum lignano, Stenostomum leucops, Microstomum lineare
Nemertea: Prostoma graecense

### DECOMPOSERS (15) — Fungi + destructive bacteria
Fungi: Saccharomyces cerevisiae, Candida albicans, Mucor mucedo, Rhizopus stolonifer, Penicillium chrysogenum, Aspergillus niger
Chytrids: Batrachochytrium dendrobatidis, Chytriomyces aureus, Allomyces macrogynus
Bacteria: Bacillus subtilis, Pseudomonas putida, Streptomyces coelicolor, Cellulomonas fimi, Thermus aquaticus, Deinococcus radiodurans

## World Engine
- Infinite 2D map, chunk-based (512×512)
- LRU cache of 9×9 chunks
- Environment: light (day/night), temperature, pH (5.0-9.0), O₂, nutrients

## Organism AI
- Producers: photosynthesis → growth → division
- Predators: chemotaxis → chase → phagocytosis
- Prey: flee from predators
- Decomposers: move toward dead organic matter
- States: idle, moving, feeding, dividing, cyst, dead
- Division: energy >80%, age > minimum
- Cyst: under bad conditions
- Death: energy=0 → organic matter

## Player Controls
- WASD — movement, mouse — direction
- Space — dash (x3 energy cost)
- E — phagocytosis (eat if 20%+ larger)
- Q — divide (energy >80%)
- R — encyst
- Scroll — zoom (0.5x–5x)
- Tab — species table
- Mobile: touch buttons

## Rendering
- Canvas 2D, camera follows player
- Shapes: circle, rod, spiral, slipper, bell, star, irregular, filament
- Background: blue-green, darkens with depth
- Particles: nutrients, organic matter, light rays
- HUD: energy, size, species, age, T, pH, O₂, FPS
- Minimap

## Balance
- ~500 organisms on screen (spatial hashing)
- Spawn when population drops
- Lotka-Volterra cycles

## Platforms
- Web (file://, GitHub Pages)
- Android (PWA / WebView)
- Desktop (Electron or plain HTML)

## Delivery Format
- Single `index.html`, all JS/CSS inline
- No imports, no CDN
