# iGraSpore — Spécifications techniques

## Résumé
Jeu navigateur inspiré de Spore (stade cellulaire). Canvas 2D, JS pur, fichier HTML unique.
Fonctionne avec `file://` sans serveur. Objectif : progresser d'une bactérie à un macro-protozoaire.

## 100 espèces réelles (5 catégories)

### PRODUCTEURS (25) — Photosynthétiques
Cyanobactéries : Synechocystis sp., Anabaena variabilis, Spirulina platensis, Nostoc punctiforme, Oscillatoria limnetica, Microcystis aeruginosa, Gleocapsa sp., Lyngbya majuscula
Algues vertes : Chlamydomonas reinhardtii, Chlorella vulgaris, Volvox globator, Euglena gracilis, Scenedesmus quadricauda, Haematococcus pluvialis, Dunaliella salina, Micrasterias rotata
Diatomées : Navicula sp., Pinnularia viridis, Cyclotella meneghiniana, Diatoma vulgare
Autres : Rhodospirillum rubrum, Chromatium vinosum, Porphyridium cruentum, Prochlorococcus marinus

### CONSOMMATEURS I (20) — Bactéries prédatrices + flagellés
Bdellovibrio bacteriovorus, Vampirococcus sp., Daptobacter sp., Myxococcus xanthus
Bacteriovorax stolpii, Halobacteriovorax sp., Peredibacter starrii
Flagellés : Monas guttula, Oikomonas termo, Anthophysa vegetans, Chilomonas paramecium
Cercomonas longicauda, Heteromita globosa, Bodonas saltans, Procryptobia sorokini
Trypanosoma brucei (microforme), Leishmania donovani (amastigote)
Choanoflagellés : Monosiga brevicollis, Salpingoeca rosetta, Codonosiga botrytis

### CONSOMMATEURS II (25) — Ciliés + amibes
Ciliés : Paramecium caudatum, Paramecium bursaria, Stentor coeruleus, Stentor polymorphus, Vorticella campanula, Vorticella microstoma, Didinium nasutum, Spirostomum ambiguum, Blepharisma americanum, Euplotes patella, Stylonychia pustulata, Oxytricha trifallax, Tetrahymena thermophila, Coleps hirtus, Litonotus lamella, Dileptus anser, Urocentrum turbo, Zoothamnium arbuscula, Opercularia coarctata
Amibes : Amoeba proteus, Arcella vulgaris, Difflugia oblonga, Euglypha alveolata, Nebela collaris, Centropyxis aculeata

### CONSOMMATEURS III (15) — Gros protozoaires + rotifères
Heliozoaires : Actinophrys sol, Actinosphaerium eichhorni, Raphidiophrys pallida
Rotifères : Rotaria rotatoria, Philodina roseola, Brachionus plicatilis, Keratella cochlearis, Asplanchna priodonta
Gastrotriches : Chaetonotus maximus, Lepidodermella squamata
Turbellariés : Macrostomum lignano, Stenostomum leucops, Microstomum lineare
Némertes : Prostoma graecense

### DÉCOMPOSEURS (15) — Champignons + bactéries destructrices
Champignons : Saccharomyces cerevisiae, Candida albicans, Mucor mucedo, Rhizopus stolonifer, Penicillium chrysogenum, Aspergillus niger
Chytrides : Batrachochytrium dendrobatidis, Chytriomyces aureus, Allomyces macrogynus
Bactéries : Bacillus subtilis, Pseudomonas putida, Streptomyces coelicolor, Cellulomonas fimi, Thermus aquaticus, Deinococcus radiodurans

## Moteur du monde
- Carte 2D infinie, chunk-based (512×512)
- Cache LRU de 9×9 chunks
- Environnement : lumière (jour/nuit), température, pH (5.0-9.0), O₂, nutriments

## IA des organismes
- Producteurs : photosynthèse → croissance → division
- Prédateurs : chimiotaxie → poursuite → phagocytose
- Proies : fuient les prédateurs
- Décomposeurs : se dirigent vers la matière organique morte
- États : idle, moving, feeding, dividing, cyst, dead
- Division : énergie >80%, âge > minimum
- Kyste : en mauvaises conditions
- Mort : énergie=0 → matière organique

## Contrôles joueur
- WASD — mouvement, souris — direction
- Espace — dash (x3 énergie)
- E — phagocytose (manger si 20%+ plus grand)
- Q — division (énergie >80%)
- R — enkystement
- Scroll — zoom (0.5x–5x)
- Tab — tableau des espèces
- Mobile : boutons tactiles

## Rendu
- Canvas 2D, caméra suit le joueur
- Formes : circle, rod, spiral, slipper, bell, star, irregular, filament
- Fond : bleu-vert, s'assombrit avec la profondeur
- Particules : nutriments, matière organique, rayons lumineux
- HUD : énergie, taille, espèce, âge, T, pH, O₂, FPS
- Mini-carte

## Équilibre
- ~500 organismes à l'écran (spatial hashing)
- Apparition quand la population baisse
- Cycles de Lotka-Volterra

## Plateformes
- Web (file://, GitHub Pages)
- Android (PWA / WebView)
- Desktop (Electron ou HTML simple)

## Format de livraison
- Un seul `index.html`, tout JS/CSS inclus
- Pas d'import, pas de CDN
