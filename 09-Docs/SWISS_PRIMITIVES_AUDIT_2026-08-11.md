# iGraSpore — Swiss primitives audit (2026-08-11)

## Swiss sprites pool (12) — что есть на «доске»

| # | shape | PNG | Биологический прототип (SwissBioPics) |
|---|-------|-----|--------------------------------------|
| 1 | `bell` | `swiss_sprites/bell.png` | Chlamydomonas |
| 2 | `circle` | `swiss_sprites/circle.png` | Bacteria coccus |
| 3 | `colony` | `swiss_sprites/colony.png` | Nostoc colony |
| 4 | `comma` | `swiss_sprites/comma.png` | Bacteria comma |
| 5 | `filament` | `swiss_sprites/filament.png` | Bacteria filamentous |
| 6 | `irregular` | `swiss_sprites/irregular.png` | Fungal/amoeba |
| 7 | `oval` | `swiss_sprites/oval.png` | Pombe/yeast cells |
| 8 | `phage` | `swiss_sprites/phage.png` | DBCLS phage |
| 9 | `rod` | `swiss_sprites/rod.png` | Bacteria rod |
| 10 | `slipper` | `swiss_sprites/slipper.png` | Eukaryota (ciliate) |
| 11 | `spiral` | `swiss_sprites/spiral.png` | Bacteria spiral |
| 12 | `star` | `swiss_sprites/star.png` | Tetrad/star |

## Правило Swiss-режима

- В **swiss** рисуются только 12 спрайтов + пруд/кувшинки. Зелёные nutrient-облака **OFF** (`isClean`).
- Виды, которых нет отдельной картинкой, маппятся на ближайший morphotype (NAME_OVERRIDE). Это **не** 100 уникальных SVG — 1 схема на форму.
- Повторы визуальные = несколько родов → 1 shape. Это ожидаемо при 100 видов / 12 PNG.
- В **cartoon/bioicons** частные/условные формы остаются; swiss не обязан показывать то, чего нет в пуле спрайтов.
- Вирусы: **не плавают** (нет flagella). Только Brownian + слабый bias к хозяину, cap 0.25.
- Sessile: только Vorticella / Zoothamnium / Opercularia / Codonosiga / Salpingoeca (по **имени**, не по bell).

## Полная таблица видов (пул симуляции)

| Ниша | Вид | shape (игра) | swiss sprite | locomotion | Экология | map | Заметка |
|------|-----|--------------|--------------|------------|----------|-----|---------|
| producer | Synechocystis sp. | circle | circle | glide | автотроф / фотосинтез | ✅ |  |
| producer | Anabaena variabilis | filament | filament | drift | автотроф / фотосинтез | ✅ |  |
| producer | Spirulina platensis | spiral | spiral | flagella | автотроф / фотосинтез | ✅ |  |
| producer | Nostoc punctiforme | colony | colony | drift | автотроф / фотосинтез | ✅ |  |
| producer | Oscillatoria limnetica | filament | filament | drift | автотроф / фотосинтез | ✅ |  |
| producer | Microcystis aeruginosa | colony | colony | drift | автотроф / фотосинтез | ✅ |  |
| producer | Gloeocapsa sp. | colony | colony | drift | автотроф / фотосинтез | ✅ |  |
| producer | Lyngbya majuscula | filament | filament | drift | автотроф / фотосинтез | ✅ |  |
| producer | Chlamydomonas reinhardtii | bell | bell | flagella | автотроф / фотосинтез | ✅ |  |
| producer | Chlorella vulgaris | circle | circle | drift | автотроф / фотосинтез | ✅ |  |
| producer | Volvox globator | colony | colony | drift | автотроф / фотосинтез | ✅ |  |
| producer | Euglena gracilis | oval | oval | flagella | автотроф / фотосинтез | ✅ |  |
| producer | Scenedesmus quadricauda | colony | colony | drift | автотроф / фотосинтез | ✅ |  |
| producer | Haematococcus pluvialis | oval | oval | flagella | автотроф / фотосинтез | ✅ |  |
| producer | Dunaliella salina | oval | oval | flagella | автотроф / фотосинтез | ✅ |  |
| producer | Micrasterias rotata | star | star | drift | автотроф / фотосинтез | ✅ |  |
| producer | Navicula sp. | rod | rod | glide | автотроф / фотосинтез | ✅ |  |
| producer | Pinnularia viridis | rod | rod | glide | автотроф / фотосинтез | ✅ |  |
| producer | Cyclotella meneghiniana | circle | circle | drift | автотроф / фотосинтез | ✅ |  |
| producer | Diatoma vulgare | rod | rod | glide | автотроф / фотосинтез | ✅ |  |
| producer | Rhodospirillum rubrum | spiral | spiral | flagella | автотроф / фотосинтез | ✅ |  |
| producer | Chromatium vinosum | rod | rod | glide | автотроф / фотосинтез | ✅ |  |
| producer | Porphyridium cruentum | circle | circle | drift | автотроф / фотосинтез | ✅ |  |
| producer | Prochlorococcus marinus | circle | circle | drift | автотроф / фотосинтез | ✅ |  |
| producer | Chroococcidiopsis thermalis | colony | colony | drift | автотроф / фотосинтез | ✅ |  |
| consumer1 | Bdellovibrio bacteriovorus | comma | comma | flagella | хищник-бактерия / жгутиконосец (консумент I) | ✅ | вибриоид, flagellum |
| consumer1 | Vampirococcus sp. | circle | circle | flagella | хищник-бактерия / жгутиконосец (консумент I) | ✅ |  |
| consumer1 | Daptobacter sp. | rod | rod | glide | хищник-бактерия / жгутиконосец (консумент I) | ✅ |  |
| consumer1 | Myxococcus xanthus | rod | rod | glide | хищник-бактерия / жгутиконосец (консумент I) | ✅ |  |
| consumer1 | Bacteriovorax stolpii | rod | rod | glide | хищник-бактерия / жгутиконосец (консумент I) | ✅ |  |
| consumer1 | Halobacteriovorax sp. | rod | rod | glide | хищник-бактерия / жгутиконосец (консумент I) | ✅ |  |
| consumer1 | Peredibacter starrii | rod | rod | glide | хищник-бактерия / жгутиконосец (консумент I) | ✅ |  |
| consumer1 | Monas guttula | oval | oval | flagella | хищник-бактерия / жгутиконосец (консумент I) | ✅ |  |
| consumer1 | Oikomonas termo | oval | oval | flagella | хищник-бактерия / жгутиконосец (консумент I) | ✅ |  |
| consumer1 | Anthophysa vegetans | oval | oval | flagella | хищник-бактерия / жгутиконосец (консумент I) | ✅ |  |
| consumer1 | Chilomonas paramecium | oval | oval | flagella | хищник-бактерия / жгутиконосец (консумент I) | ✅ |  |
| consumer1 | Cercomonas longicauda | irregular | oval | flagella | хищник-бактерия / жгутиконосец (консумент I) | ⚠️ повтор/др.sprite |  |
| consumer1 | Heteromita globosa | circle | circle | flagella | хищник-бактерия / жгутиконосец (консумент I) | ✅ |  |
| consumer1 | Bodo saltans | comma | comma | flagella | хищник-бактерия / жгутиконосец (консумент I) | ✅ |  |
| consumer1 | Procryptobia sorokini | comma | comma | flagella | хищник-бактерия / жгутиконосец (консумент I) | ✅ |  |
| consumer1 | Trypanosoma brucei | filament | filament | flagella | хищник-бактерия / жгутиконосец (консумент I) | ✅ | ундулирующая мембрана |
| consumer1 | Leishmania donovani | oval | oval | flagella | хищник-бактерия / жгутиконосец (консумент I) | ✅ |  |
| consumer1 | Monosiga brevicollis | bell | bell | flagella | хищник-бактерия / жгутиконосец (консумент I) | ✅ |  |
| consumer1 | Salpingoeca rosetta | bell | bell | sessile | хищник-бактерия / жгутиконосец (консумент I) | ✅ |  |
| consumer1 | Codonosiga botrytis | bell | bell | sessile | хищник-бактерия / жгутиконосец (консумент I) | ✅ |  |
| consumer2 | Paramecium caudatum | slipper | slipper | cilia | инфузория / амёба (консумент II) | ✅ |  |
| consumer2 | Paramecium bursaria | slipper | slipper | cilia | инфузория / амёба (консумент II) | ✅ |  |
| consumer2 | Stentor coeruleus | bell | bell | cilia | инфузория / амёба (консумент II) | ✅ | труба, плавает ресничками (НЕ sessile) |
| consumer2 | Stentor polymorphus | bell | bell | cilia | инфузория / амёба (консумент II) | ✅ | труба, плавает ресничками (НЕ sessile) |
| consumer2 | Vorticella campanula | bell | bell | sessile | инфузория / амёба (консумент II) | ✅ | стебелёк, не плавает |
| consumer2 | Vorticella microstoma | bell | bell | sessile | инфузория / амёба (консумент II) | ✅ | стебелёк, не плавает |
| consumer2 | Didinium nasutum | oval | oval | cilia | инфузория / амёба (консумент II) | ✅ | бочонок, охотник на Paramecium |
| consumer2 | Spirostomum ambiguum | rod | rod | cilia | инфузория / амёба (консумент II) | ✅ |  |
| consumer2 | Blepharisma americanum | slipper | slipper | cilia | инфузория / амёба (консумент II) | ✅ |  |
| consumer2 | Euplotes patella | irregular | irregular | pseudopodia | инфузория / амёба (консумент II) | ✅ |  |
| consumer2 | Stylonychia pustulata | irregular | irregular | pseudopodia | инфузория / амёба (консумент II) | ✅ |  |
| consumer2 | Oxytricha trifallax | irregular | irregular | pseudopodia | инфузория / амёба (консумент II) | ✅ |  |
| consumer2 | Tetrahymena thermophila | oval | oval | cilia | инфузория / амёба (консумент II) | ✅ |  |
| consumer2 | Coleps hirtus | oval | oval | cilia | инфузория / амёба (консумент II) | ✅ |  |
| consumer2 | Litonotus lamella | slipper | slipper | cilia | инфузория / амёба (консумент II) | ✅ |  |
| consumer2 | Dileptus anser | rod | rod | cilia | инфузория / амёба (консумент II) | ✅ |  |
| consumer2 | Urocentrum turbo | oval | oval | cilia | инфузория / амёба (консумент II) | ✅ |  |
| consumer2 | Zoothamnium arbuscula | bell | bell | sessile | инфузория / амёба (консумент II) | ✅ | стебелёк, не плавает |
| consumer2 | Opercularia coarctata | bell | bell | sessile | инфузория / амёба (консумент II) | ✅ | стебелёк, не плавает |
| consumer2 | Amoeba proteus | irregular | irregular | pseudopodia | инфузория / амёба (консумент II) | ✅ |  |
| consumer2 | Arcella vulgaris | irregular | irregular | pseudopodia | инфузория / амёба (консумент II) | ✅ |  |
| consumer2 | Difflugia oblonga | irregular | irregular | pseudopodia | инфузория / амёба (консумент II) | ✅ |  |
| consumer2 | Euglypha alveolata | irregular | irregular | pseudopodia | инфузория / амёба (консумент II) | ✅ |  |
| consumer2 | Nebela collaris | irregular | irregular | pseudopodia | инфузория / амёба (консумент II) | ✅ |  |
| consumer2 | Centropyxis aculeata | irregular | irregular | pseudopodia | инфузория / амёба (консумент II) | ✅ |  |
| consumer3 | Actinophrys sol | star | star | pseudopodia | коловратка / гелиозоя / червь (консумент III) | ✅ |  |
| consumer3 | Actinosphaerium eichhorni | star | star | pseudopodia | коловратка / гелиозоя / червь (консумент III) | ✅ |  |
| consumer3 | Raphidiophrys pallida | star | star | pseudopodia | коловратка / гелиозоя / червь (консумент III) | ✅ |  |
| consumer3 | Rotaria rotatoria | oval | oval | cilia | коловратка / гелиозоя / червь (консумент III) | ✅ |  |
| consumer3 | Philodina roseola | oval | oval | cilia | коловратка / гелиозоя / червь (консумент III) | ✅ |  |
| consumer3 | Brachionus plicatilis | oval | oval | cilia | коловратка / гелиозоя / червь (консумент III) | ✅ |  |
| consumer3 | Keratella cochlearis | star | star | pseudopodia | коловратка / гелиозоя / червь (консумент III) | ✅ |  |
| consumer3 | Asplanchna priodonta | oval | oval | cilia | коловратка / гелиозоя / червь (консумент III) | ✅ |  |
| consumer3 | Chaetonotus maximus | rod | rod | cilia | коловратка / гелиозоя / червь (консумент III) | ✅ |  |
| consumer3 | Lepidodermella squamata | rod | rod | cilia | коловратка / гелиозоя / червь (консумент III) | ✅ |  |
| consumer3 | Macrostomum lignano | oval | oval | cilia | коловратка / гелиозоя / червь (консумент III) | ✅ |  |
| consumer3 | Stenostomum leucops | rod | oval | cilia | коловратка / гелиозоя / червь (консумент III) | ⚠️ повтор/др.sprite |  |
| consumer3 | Microstomum lineare | rod | oval | cilia | коловратка / гелиозоя / червь (консумент III) | ⚠️ повтор/др.sprite |  |
| consumer3 | Prostoma graecense | rod | rod | cilia | коловратка / гелиозоя / червь (консумент III) | ✅ |  |
| consumer3 | Trichoplax adhaerens | irregular | irregular | pseudopodia | коловратка / гелиозоя / червь (консумент III) | ✅ |  |
| decomposer | Saccharomyces cerevisiae | circle | oval | budding | редуцент / гриб / бактерия | ⚠️ повтор/др.sprite |  |
| decomposer | Candida albicans | circle | oval | budding | редуцент / гриб / бактерия | ⚠️ повтор/др.sprite |  |
| decomposer | Mucor mucedo | filament | filament | growth | редуцент / гриб / бактерия | ✅ |  |
| decomposer | Rhizopus stolonifer | filament | filament | growth | редуцент / гриб / бактерия | ✅ |  |
| decomposer | Penicillium chrysogenum | filament | filament | growth | редуцент / гриб / бактерия | ✅ |  |
| decomposer | Aspergillus niger | filament | filament | growth | редуцент / гриб / бактерия | ✅ |  |
| decomposer | Batrachochytrium dendrobatidis | circle | circle | budding | редуцент / гриб / бактерия | ✅ |  |
| decomposer | Chytriomyces aureus | circle | circle | budding | редуцент / гриб / бактерия | ✅ |  |
| decomposer | Allomyces macrogynus | filament | circle | growth | редуцент / гриб / бактерия | ⚠️ повтор/др.sprite |  |
| decomposer | Bacillus subtilis | rod | rod | growth | редуцент / гриб / бактерия | ✅ |  |
| decomposer | Pseudomonas putida | rod | oval | growth | редуцент / гриб / бактерия | ⚠️ повтор/др.sprite |  |
| decomposer | Streptomyces coelicolor | filament | filament | growth | редуцент / гриб / бактерия | ✅ |  |
| decomposer | Cellulomonas fimi | rod | oval | growth | редуцент / гриб / бактерия | ⚠️ повтор/др.sprite |  |
| decomposer | Thermus aquaticus | rod | rod | growth | редуцент / гриб / бактерия | ✅ |  |
| decomposer | Deinococcus radiodurans | circle | star | budding | редуцент / гриб / бактерия | ⚠️ повтор/др.sprite |  |
| virus | T4 Bacteriophage | phage | phage | drift | фаг / немоторил, диффузия | ✅ | пассивная диффузия |
| virus | Lambda Phage | phage | phage | drift | фаг / немоторил, диффузия | ✅ | пассивная диффузия |
| virus | T7 Bacteriophage | phage | phage | drift | фаг / немоторил, диффузия | ✅ | пассивная диффузия |
| virus | Phi-6 Phage | phage | phage | drift | фаг / немоторил, диффузия | ✅ | пассивная диффузия |
| virus | MS2 Phage | phage | phage | drift | фаг / немоторил, диффузия | ✅ | пассивная диффузия |

## Статистика покрытия

- Всего организмов в пуле: **105** (без macrophage)
- Swiss shapes used: {'circle': 10, 'filament': 9, 'spiral': 2, 'colony': 6, 'bell': 10, 'oval': 24, 'star': 6, 'rod': 16, 'comma': 3, 'slipper': 4, 'irregular': 10, 'phage': 5}
- Game shapes used: {'circle': 12, 'filament': 10, 'spiral': 2, 'colony': 6, 'bell': 10, 'oval': 17, 'star': 5, 'rod': 20, 'comma': 3, 'irregular': 11, 'slipper': 4, 'phage': 5}
- shape≠swiss (но map есть): 9 — OK, swiss override сильнее
- без map: 0

## Что сделано в коде (2026-08-11)
1. SHAPES producer/c1/c2/c3 выровнены с морфологией
2. getLocomotion: sessile только по имени, Stentor=cilia
3. Вирусы: passive diffusion only, speed 0.35, cap 0.25
4. NAME_OVERRIDE: один список, без дублей
5. nutrientClouds уже OFF в swiss (isClean)