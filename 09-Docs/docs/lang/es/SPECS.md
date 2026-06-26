# iGraSpore — Especificaciones técnicas

## Resumen
Juego de navegador inspirado en Spore (etapa celular). Canvas 2D, JS puro, archivo HTML único.
Funciona con `file://` sin servidor. Objetivo: progresar de bacteria a macro-protozoo.

## 100 especies reales (5 categorías)

### PRODUCTORES (25) — Fotosintéticos
Cianobacterias: Synechocystis sp., Anabaena variabilis, Spirulina platensis, Nostoc punctiforme, Oscillatoria limnetica, Microcystis aeruginosa, Gleocapsa sp., Lyngbya majuscula
Algas verdes: Chlamydomonas reinhardtii, Chlorella vulgaris, Volvox globator, Euglena gracilis, Scenedesmus quadricauda, Haematococcus pluvialis, Dunaliella salina, Micrasterias rotata
Diatomeas: Navicula sp., Pinnularia viridis, Cyclotella meneghiniana, Diatoma vulgare
Otros: Rhodospirillum rubrum, Chromatium vinosum, Porphyridium cruentum, Prochlorococcus marinus

### CONSUMIDORES I (20) — Bacterias depredadoras + flagelados
Bdellovibrio bacteriovorus, Vampirococcus sp., Daptobacter sp., Myxococcus xanthus
Bacteriovorax stolpii, Halobacteriovorax sp., Peredibacter starrii
Flagelados: Monas guttula, Oikomonas termo, Anthophysa vegetans, Chilomonas paramecium
Cercomonas longicauda, Heteromita globosa, Bodonas saltans, Procryptobia sorokini
Trypanosoma brucei (microforma), Leishmania donovani (amastigote)
Coanoflagelados: Monosiga brevicollis, Salpingoeca rosetta, Codonosiga botrytis

### CONSUMIDORES II (25) — Ciliados + amebas
Ciliados: Paramecium caudatum, Paramecium bursaria, Stentor coeruleus, Stentor polymorphus, Vorticella campanula, Vorticella microstoma, Didinium nasutum, Spirostomum ambiguum, Blepharisma americanum, Euplotes patella, Stylonychia pustulata, Oxytricha trifallax, Tetrahymena thermophila, Coleps hirtus, Litonotus lamella, Dileptus anser, Urocentrum turbo, Zoothamnium arbuscula, Opercularia coarctata
Amebas: Amoeba proteus, Arcella vulgaris, Difflugia oblonga, Euglypha alveolata, Nebela collaris, Centropyxis aculeata

### CONSUMIDORES III (15) — Protozoos grandes + rotíferos
Heliozoos: Actinophrys sol, Actinosphaerium eichhorni, Raphidiophrys pallida
Rotíferos: Rotaria rotatoria, Philodina roseola, Brachionus plicatilis, Keratella cochlearis, Asplanchna priodonta
Gastrotricos: Chaetonotus maximus, Lepidodermella squamata
Turbelarios: Macrostomum lignano, Stenostomum leucops, Microstomum lineare
Nemerteos: Prostoma graecense

### DESCOMPONEDORES (15) — Hongos + bacterias destructoras
Hongos: Saccharomyces cerevisiae, Candida albicans, Mucor mucedo, Rhizopus stolonifer, Penicillium chrysogenum, Aspergillus niger
Quitridios: Batrachochytrium dendrobatidis, Chytriomyces aureus, Allomyces macrogynus
Bacterias: Bacillus subtilis, Pseudomonas putida, Streptomyces coelicolor, Cellulomonas fimi, Thermus aquaticus, Deinococcus radiodurans

## Motor del mundo
- Mapa 2D infinito, chunk-based (512×512)
- Caché LRU de 9×9 chunks
- Entorno: luz (día/noche), temperatura, pH (5.0-9.0), O₂, nutrientes

## IA de organismos
- Productores: fotosíntesis → crecimiento → división
- Depredadores: quimiotaxis → persecución → fagocitosis
- Presas: huyen de depredadores
- Descomponedores: se mueven hacia materia orgánica muerta
- Estados: idle, moving, feeding, dividing, cyst, dead
- División: energía >80%, edad > mínima
- Quiste: en malas condiciones
- Muerte: energía=0 → materia orgánica

## Controles del jugador
- WASD — movimiento, ratón — dirección
- Espacio — dash (x3 energía)
- E — fagocitosis (comer si 20%+ más grande)
- Q — dividirse (energía >80%)
- R — enquistarse
- Scroll — zoom (0.5x–5x)
- Tab — tabla de especies
- Móvil: botones táctiles

## Renderizado
- Canvas 2D, cámara sigue al jugador
- Formas: circle, rod, spiral, slipper, bell, star, irregular, filament
- Fondo: azul-verdoso, se oscurece con la profundidad
- Partículas: nutrientes, materia orgánica, rayos de luz
- HUD: energía, tamaño, especie, edad, T, pH, O₂, FPS
- Minimapa

## Equilibrio
- ~500 organismos en pantalla (spatial hashing)
- Aparición cuando la población baja
- Ciclos de Lotka-Volterra

## Plataformas
- Web (file://, GitHub Pages)
- Android (PWA / WebView)
- Desktop (Electron o HTML simple)

## Formato de entrega
- Un solo `index.html`, todo JS/CSS incluido
- Sin imports, sin CDN
