# iGraSpore — техническое задание

## Суть
Браузерная игра в духе Spore (клеточная стадия). Canvas 2D, чистый JS, один HTML файл.
Работает при `file://` без сервера. Цель — пройти путь от бактерии до макро-простейшего.

## 100 реальных видов (5 категорий)

### ПРОДУЦЕНТЫ (25) — фотосинтетики
Cyanobacteria: Synechocystis sp., Anabaena variabilis, Spirulina platensis, Nostoc punctiforme, Oscillatoria limnetica, Microcystis aeruginosa, Gleocapsa sp., Lyngbya majuscula
Зелёные водоросли: Chlamydomonas reinhardtii, Chlorella vulgaris, Volvox globator, Euglena gracilis, Scenedesmus quadricauda, Haematococcus pluvialis, Dunaliella salina, Micrasterias rotata
Диатомеи: Navicula sp., Pinnularia viridis, Cyclotella meneghiniana, Diatoma vulgare
Другие: Rhodospirillum rubrum, Chromatium vinosum, Porphyridium cruentum, Prochlorococcus marinus

### КОНСУМЕНТЫ I (20) — бактерии-хищники + жгутиконосцы
Bdellovibrio bacteriovorus, Vampirococcus sp., Daptobacter sp., Myxococcus xanthus
Bacteriovorax stolpii, Halobacteriovorax sp., Peredibacter starrii
Жгутиконосцы: Monas guttula, Oikomonas termo, Anthophysa vegetans, Chilomonas paramecium
Cercomonas longicauda, Heteromita globosa, Bodonas saltans, Procryptobia sorokini
Trypanosoma brucei (микроформа), Leishmania donovani (амастигота)
Choanoflagellate: Monosiga brevicollis, Salpingoeca rosetta, Codonosiga botrytis

### КОНСУМЕНТЫ II (25) — инфузории + амёбы
Инфузории: Paramecium caudatum, Paramecium bursaria, Stentor coeruleus, Stentor polymorphus, Vorticella campanula, Vorticella microstoma, Didinium nasutum, Spirostomum ambiguum, Blepharisma americanum, Euplotes patella, Stylonychia pustulata, Oxytricha trifallax, Tetrahymena thermophila, Coleps hirtus, Litonotus lamella, Dileptus anser, Urocentrum turbo, Zoothamnium arbuscula, Opercularia coarctata
Амёбы: Amoeba proteus, Arcella vulgaris, Difflugia oblonga, Euglypha alveolata, Nebela collaris, Centropyxis aculeata

### КОНСУМЕНТЫ III (15) — крупные простейшие + коловратки
Heliozoa: Actinophrys sol, Actinosphaerium eichhorni, Raphidiophrys pallida
Коловратки: Rotaria rotatoria, Philodina roseola, Brachionus plicatilis, Keratella cochlearis, Asplanchna priodonta
Гастротрихи: Chaetonotus maximus, Lepidodermella squamata
Turbellaria: Macrostomum lignano, Stenostomum leucops, Microstomum lineare
Nemertea: Prostoma graecense

### РЕДУЦЕНТЫ (15) — грибы + бактерии-деструкторы
Грибы: Saccharomyces cerevisiae, Candida albicans, Mucor mucedo, Rhizopus stolonifer, Penicillium chrysogenum, Aspergillus niger
Chytrid: Batrachochytrium dendrobatidis, Chytriomyces aureus, Allomyces macrogynus
Бактерии: Bacillus subtilis, Pseudomonas putida, Streptomyces coelicolor, Cellulomonas fimi, Thermus aquaticus, Deinococcus radiodurans

## Движок мира
- Бесконечная 2D карта, chunk-based (512×512)
- LRU кэш 9×9 чанков
- Среда: свет (день/ночь), температура, pH (5.0-9.0), O₂, питательные вещества

## ИИ организмов
- Продуценты: фотосинтез → рост → деление
- Хищники: хемотаксис → погоня → фагоцитоз
- Жертвы: убегают от хищников
- Редуценты: двигаются к мёртвой органике
- Состояния: idle, moving, feeding, dividing, cyst, dead
- Деление: энергия >80%, возраст > минимального
- Циста: при плохих условиях
- Смерть: энергия=0 → органика

## Управление (игрок)
- WASD — движение, мышь — направление
- Пробел — рывок (x3 энергия)
- E — фагоцитоз (съесть если крупнее на 20%+)
- Q — деление (энергия >80%)
- R — циста
- Scroll — зум (0.5x–5x)
- Tab — таблица видов
- Мобильные: touch-кнопки

## Рендеринг
- Canvas 2D, камера следует за игроком
- Формы: circle, rod, spiral, slipper, bell, star, irregular, filament
- Фон: голубовато-зелёный, темнеет с глубиной
- Частицы: питательные вещества, органика, световые лучи
- HUD: энергия, размер, вид, возраст, T, pH, O₂, FPS
- Мини-карта

## Баланс
- ~500 организмов на экране (spatial hashing)
- Спавн при падении популяции
- Циклы Лотки-Вольтерры

## Платформы
- Web (file://, GitHub Pages)
- Android (PWA / WebView)
- Desktop (Electron или просто HTML)

## Формат поставки
- Один `index.html`, весь JS/CSS внутри
- Никаких import, никаких CDN
