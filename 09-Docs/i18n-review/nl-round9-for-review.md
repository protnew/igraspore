# Пакет на проверку аналитику: nl (круг 9)

- Дата: 2026-10-30 22:43:30 UTC+3  |  Круг: 9
- input_sha256 словарей (полные — для raw<nl-analyst-round9.json):
  - `en.json` = ecc487cf85a2d180c5dbddb6c53d7e52448d44e4c5c60ccd0df2d57db6c2a9ca
  - `ru.json` = a5ca4acf4f6733c835c9a84bb2ae33aa8fa2b8db5ab544e7fac907f8abc3f4cc
  - `nl.json` = 35e6a8e69a1934f4f3c4137a8863afeb386164cba71bdf5cd266f2242ec6a546
  - `wiki/nl.json` = ae1de68a74587e8d6899516a3e13352a63df63b1c98602245734907c87949ae0
- Ключей UI: 436 (из них 🆕 новых после круга 4: 296 — U13 263 + U42 loc.* 9); вики-тел: 108
- Rubric 0–10 по 5 осям: смысл, глоссарий, регистр, длина, ошибки. Порог включения ≥ 8.
- Ответ аналитика: `09-Docs/i18n-review/raw/nl-analyst-round9.json` + строка в ANALYST-LEDGER.md (пишет ТОЛЬКО аналитик).

## Снимки 390×844

- снимков нет (язык выключен и не переснят)

## Словарь UI (436)

| 🆕 | ключ | ru | en | nl | где / макс. длина |
|---|---|---|---|---|---|
| 🆕 | `abt.feed` | КУСЬ | BITE | BIJT | общий UI / ≤60 |
| 🆕 | `abt.fly` | ПОЛЁТ | FLIGHT | VLUCHT | общий UI / ≤60 |
| 🆕 | `abt.follow` | СЛЕДИТЬ | FOLLOW | VOLG | общий UI / ≤60 |
|  | `age` | Возраст | Age | Leeftijd | общий UI / ≤60 |
|  | `all` | Все | All | Alle | общий UI / ≤60 |
|  | `aquarium` | АКВАРИУМ | AQUARIUM | AQUARIUM | общий UI / ≤60 |
| 🆕 | `aria.apk` | Скачать приложение Android APK | Download Android APK app | Android-app (APK) downloaden | общий UI / ≤60 |
| 🆕 | `aria.aqua` | Аквариум | Aquarium | Aquarium | общий UI / ≤60 |
| 🆕 | `aria.auto` | Авто (Tab) | Auto (Tab) | Auto (Tab) | общий UI / ≤60 |
| 🆕 | `aria.cyst` | Спора (R) | Spore (R) | Spore (R) | общий UI / ≤60 |
| 🆕 | `aria.demo` | Демо | Demo | Demo | общий UI / ≤60 |
| 🆕 | `aria.divide` | Делить (Q) | Split (Q) | Delen (Q) | общий UI / ≤60 |
| 🆕 | `aria.eat` | Есть (E) | Eat (E) | Eten (E) | общий UI / ≤60 |
| 🆕 | `aria.feed` | Ручное питание (Space) | Manual feed (Space) | Handmatig voeren (Spatie) | общий UI / ≤60 |
| 🆕 | `aria.fly` | Свободный полёт (F) | Free flight (F) | Vrije vlucht (F) | общий UI / ≤60 |
| 🆕 | `aria.follow2` | Следить за клеткой (V) | Follow cell (V) | Cel volgen (V) | общий UI / ≤60 |
| 🆕 | `aria.help` | Как играть | How to play | Speluitleg | общий UI / ≤60 |
| 🆕 | `aria.light` | Свет | Light | Licht | общий UI / ≤60 |
| 🆕 | `aria.micro` | Микроскоп (M) | Microscope (M) | Microscoop (M) | общий UI / ≤60 |
| 🆕 | `aria.pause` | Пауза (P) | Pause (P) | Pauze (P) | общий UI / ≤60 |
| 🆕 | `aria.render` | Режим картинки (N) | Picture mode (N) | Beeldmodus (N) | общий UI / ≤60 |
| 🆕 | `aria.set` | Настройки | Settings | Instellingen | общий UI / ≤60 |
| 🆕 | `aria.start` | Старт | Start | Start | общий UI / ≤60 |
| 🆕 | `aria.switches` | Игровые переключатели | Game switches | Spelschakelaars | общий UI / ≤60 |
| 🆕 | `aria.wiki2` | Вики (B) | Wiki (B) | Wiki (B) | общий UI / ≤60 |
| 🆕 | `aria.zi` | Приблизить | Zoom in | Inzoomen | общий UI / ≤60 |
| 🆕 | `aria.zo` | Отдалить | Zoom out | Uitzoomen | общий UI / ≤60 |
| 🆕 | `auto.off` | АВТО: выкл | AUTO: off | AUTO: uit | общий UI / ≤60 |
| 🆕 | `auto.on` | АВТО: вкл | AUTO: on | AUTO: aan | общий UI / ≤60 |
|  | `autoOn` | АВТО | AUTO | AUTO | общий UI / ≤60 |
|  | `autoPilotOn` | АВТО-ПИЛОТ ВКЛ | AUTO ON | AUTO AAN | общий UI / ≤60 |
|  | `bubbles` | Пузырьки | Bubbles | Bellen | общий UI / ≤60 |
| 🆕 | `cam.fly` | Полёт: WASD / мышь / колёсико | Flight: WASD / mouse / wheel | Vlucht: WASD / muis / wiel | общий UI / ≤60 |
| 🆕 | `cam.fly2` | ✈ Полёт: WASD / стрелки / мышь / колёсико | ✈ Flight: WASD / arrows / mouse / wheel | ✈ Vlucht: WASD / pijltjes / muis / wiel | общий UI / ≤60 |
| 🆕 | `cam.flyBtn` | ✈ ПОЛЁТ WASD | ✈ FLIGHT WASD | ✈ VLUCHT WASD | общий UI / ≤60 |
| 🆕 | `cam.follow` | Камера: следит за клеткой | Camera: following cell | Camera: volgt de cel | общий UI / ≤60 |
| 🆕 | `cam.followBig` | СЛЕДИТЬ | FOLLOW | VOLG | общий UI / ≤60 |
| 🆕 | `cam.followToast` | Камера: СЛЕДИТ | Camera: FOLLOW | Camera: VOLG | общий UI / ≤60 |
| 🆕 | `cam.tip` | ✈ Полёт камеры. СЛЕДИТЬ (V) — вернуться к клетке | ✈ Camera flight. FOLLOW (V) — return to cell | ✈ Cameravlucht. VOLG (V) — terug naar de cel | общий UI / ≤60 |
|  | `camFly` | Полёт камеры | Camera flight | Cameravlucht | общий UI / ≤60 |
|  | `cartoon` | МУЛЬТ | CARTOON | CARTOON | общий UI / ≤60 |
|  | `cartoonNow` | Сейчас: мультяшный. Клик → SwissBioPics. | Now: cartoon. Click for Swiss. | Nu: cartoon. Klik voor Swiss. | общий UI / ≤60 |
| 🆕 | `catShort.consumer1` | мелкий едок | small eater | kleine eter | категория / ≤24 |
| 🆕 | `catShort.consumer2` | средний едок | mid eater | mid eter | категория / ≤24 |
| 🆕 | `catShort.consumer3` | крупный охотник | big hunter | grote jager | категория / ≤24 |
| 🆕 | `catShort.decomposer` | уборщик | cleaner | schoonmaker | категория / ≤24 |
| 🆕 | `catShort.producer` | зелёные | greens | groen | категория / ≤24 |
|  | `clear` | Ясно | Clear | Wissen | общий UI / ≤60 |
|  | `close` | ЗАКРЫТЬ | CLOSE | SLUITEN | общий UI / ≤60 |
|  | `colonies` | колоний | colonies | kolonies | общий UI / ≤60 |
|  | `colonyBadge` | КОЛОНИЯ · куча клеток | COLONY · clump of cells | KOLONIE · klontje cellen | общий UI / ≤60 |
|  | `colonyKind` | Колониальный вид | Colony species | Koloniesoort | общий UI / ≤60 |
|  | `consumer1` | Мелкие едоки | Small eaters | Kleine eters | общий UI / ≤60 |
|  | `consumer2` | Средние едоки | Mid eaters | Mid eters | общий UI / ≤60 |
|  | `consumer3` | Крупные охотники | Big hunters | Grote jagers | общий UI / ≤60 |
|  | `currents` | Течения | Currents | Stromen | общий UI / ≤60 |
|  | `dAge` | Старость | Old age | Ouderdom | общий UI / ≤60 |
|  | `dCauses` | Причины гибели | Death Causes | Doodsoorzaken | общий UI / ≤60 |
|  | `dEaten` | Съедено | Eaten | Opgegeten | общий UI / ≤60 |
|  | `dLysis` | Лизис | Lysis | Lysis | общий UI / ≤60 |
|  | `dStarve` | Голод | Starved | Verhongerd | общий UI / ≤60 |
|  | `dTemp` | Температура | Temp | Temp | общий UI / ≤60 |
| 🆕 | `dTip.age` | Совет: Старость неизбежна. Важно успеть разделиться до гибели. | Tip: Old age is inevitable. Divide before you die. | Tip: Ouderdom is onvermijdelijk. Deel voordat je sterft. | общий UI / ≤60 |
| 🆕 | `dTip.eaten` | Совет: Избегайте хищников, используйте Режим везения для бегства. | Tip: Avoid predators, use Grace Period to run away. | Tip: Ontwijk roofdieren, gebruik de beschermde periode om weg te zwemmen. | общий UI / ≤60 |
| 🆕 | `dTip.lysis` | Совет: Лизис (разрыв мембраны) вызывает вирус. Держитесь от них подальше. | Tip: Lysis is caused by viruses. Stay away from them. | Tip: Lysis wordt door virussen veroorzaakt. Blijf er bij uit de buurt. | общий UI / ≤60 |
| 🆕 | `dTip.starve` | Совет: Чаще питайтесь, держитесь ближе к скоплениям еды или ускорьте свой вид. | Tip: Eat more often, stay near food clusters, or mutate speed. | Tip: Eet vaker, blijf bij voedselclusters, of muteer je snelheid. | общий UI / ≤60 |
| 🆕 | `dTip.temp` | Совет: Следите за термометром. Мутируйте температурный диапазон. | Tip: Watch the thermometer. Mutate your temp range. | Tip: Let op de thermometer. Muteer je temperatuurbereik. | общий UI / ≤60 |
|  | `days` | Дней | Days | Dagen | общий UI / ≤60 |
|  | `dead` | ВЫМИРАНИЕ | EXTINCT | UITGESTORVEN | общий UI / ≤60 |
|  | `decomposer` | Уборщики (грибки) | Cleaners (fungi) | Schoonmakers (schimmels) | общий UI / ≤60 |
|  | `demo` | ДЕМО / Галерея | DEMO / Gallery | DEMO / Galerij | общий UI / ≤60 |
| 🆕 | `demo.colony` | ⬡КОЛОНИЯ  | ⬡COLONY  | ⬡KOLONIE  | демо / ≤60 |
| 🆕 | `demo.grp.consumer1` | 2. Консументы I | 2. Consumers I | 2. Consumenten I | демо / ≤60 |
| 🆕 | `demo.grp.consumer2` | 3. Консументы II | 3. Consumers II | 3. Consumenten II | демо / ≤60 |
| 🆕 | `demo.grp.consumer3` | 4. Консументы III | 4. Consumers III | 4. Consumenten III | демо / ≤60 |
| 🆕 | `demo.grp.decomposer` | 5. Редуценты | 5. Decomposers | 5. Reducenten | демо / ≤60 |
| 🆕 | `demo.grp.producer` | 1. Продуценты | 1. Producers | 1. Producenten | демо / ≤60 |
| 🆕 | `demo.grp.virus` | 6. Вирусы | 6. Viruses | 6. Virussen | демо / ≤60 |
| 🆕 | `demo.labels` | Метки | Labels | Labels | демо / ≤60 |
| 🆕 | `demo.tip` | <b>ДЕМО</b> · WASD/мышь — полёт · 1-6 группа · клик = вселиться<br> | <b>DEMO</b> · WASD/mouse fly · 1-6 jump group · click = possess<br> | <b>DEMO</b> · WASD/muis vliegen · 1-6 naar groep · klik = binnengaan<br> | демо / ≤60 |
|  | `density` | Плотность | Density | Dichtheid | общий UI / ≤60 |
|  | `diffE` | Лёгкий | Easy | Makkelijk | общий UI / ≤60 |
|  | `diffH` | Сложный | Hard | Moeilijk | общий UI / ≤60 |
|  | `diffN` | Обычный | Normal | Normaal | общий UI / ≤60 |
|  | `divRate` | Размножение | Reproduction | Voortplanting | общий UI / ≤60 |
|  | `divs` | Делений | Divisions | Delingen | общий UI / ≤60 |
| 🆕 | `dna.bad` | Неверная строка ДНК! | Invalid DNA String! | Ongeldige DNA-code! | общий UI / ≤60 |
| 🆕 | `dna.export` | Экспорт моего ДНК | Export My DNA | Exporteer mijn DNA | общий UI / ≤60 |
| 🆕 | `dna.import` | Импорт ДНК | Import DNA | Importeer DNA | общий UI / ≤60 |
| 🆕 | `dna.io` | Импорт/Экспорт ДНК | Import/Export DNA | DNA importeren/exporteren | общий UI / ≤60 |
| 🆕 | `dna.ok` | ДНК импортирована! | DNA Imported Successfully! | DNA succesvol geïmporteerd! | общий UI / ≤60 |
| 🆕 | `dna.pastePh` | Вставь код ДНК… | Paste DNA code here... | Plak hier de DNA-code... | общий UI / ≤60 |
|  | `dnaPoints` | Очки мутации: | Mutation points: | Mutatiepunten: | общий UI / ≤60 |
|  | `dnaShell` | Кремниевый панцирь (20 ДНК) | Silica shell (20 DNA) | Silicaschaal (20 DNA) | общий UI / ≤60 |
|  | `dnaSize` | Увеличение массы (8 ДНК) | More mass (8 DNA) | Meer massa (8 DNA) | общий UI / ≤60 |
|  | `dnaSpeed` | Ускорение жгутиков (5 ДНК) | Faster flagella (5 DNA) | Snellere flagellen (5 DNA) | общий UI / ≤60 |
|  | `dnaSpikes` | Отрастить шипы (15 ДНК) | Grow spikes (15 DNA) | Stekels kweken (15 DNA) | общий UI / ≤60 |
|  | `dnaTitle` | Мутации ДНК | DNA mutations | DNA-mutaties | общий UI / ≤60 |
|  | `eaten` | Съедено | Eaten | Opgegeten | общий UI / ≤60 |
|  | `eats` | ест | eats | eet | общий UI / ≤60 |
|  | `eatsDead` | ест мёртвое | eats dead matter | eet dood materiaal | общий UI / ≤60 |
|  | `eatsLight` | ест свет | eats light | eet licht | общий UI / ≤60 |
| 🆕 | `edu.anatomy` | Анатомия | Anatomy | Anatomie | анатомия / ≤120 |
| 🆕 | `edu.cell` | клетка | cell | cel | анатомия / ≤120 |
| 🆕 | `edu.chloro.desc` | Фотосинтез: свет + CO₂ + H₂O → сахар + O₂. Зелёный из‑за хлорофилла. Есть у водорослей и растений. | Photosynthesis: light + CO₂ + H₂O → sugar + O₂. Green from chlorophyll. Found in algae and plants. | Fotosynthese: licht + CO₂ + H₂O → suiker + O₂. Groen door chlorofyl. Komt voor in algen en planten. | анатомия / ≤120 |
| 🆕 | `edu.chloro.name` | Хлоропласт | Chloroplast | Chloroplast | анатомия / ≤120 |
| 🆕 | `edu.cilia.desc` | Короткие подвижные выросты. Создают ток воды: движение + фильтр-питание (затягивают бактерий и водоросли ко рту). | Short moving hairs. Create water currents: movement + filter feeding (pull bacteria and algae to the mouth). | Korte bewegende haartjes. Maken waterstromen: voortbeweging + filtervoeding (trekken bacteriën en algen naar de mond). | анатомия / ≤120 |
| 🆕 | `edu.cilia.name` | Реснички | Cilia | Trilharen | анатомия / ≤120 |
| 🆕 | `edu.cyto.desc` | Внутренняя среда клетки: вода, белки, органеллы. Здесь идут тысячи биохимических реакций. | The cell's inner medium: water, proteins, organelles. Thousands of biochemical reactions run here. | De binnenste vloeistof van de cel: water, eiwitten, organellen. Duizenden biochemische reacties vinden hier plaats. | анатомия / ≤120 |
| 🆕 | `edu.cyto.name` | Цитоплазма | Cytoplasm | Cytoplasma | анатомия / ≤120 |
| 🆕 | `edu.flagella.desc` | Длинный «мотор» для плавания. Вращается или изгибается — клетка плывёт к пище или от опасности (хемотаксис). | Long swimming motor. Rotates or bends — the cell swims to food or away from danger (chemotaxis). | Lange zwemmotor. Roteert of buigt — de cel zwemt naar voedsel of weg van gevaar (chemotaxis). | анатомия / ≤120 |
| 🆕 | `edu.flagella.name` | Жгутик | Flagellum | Flagel | анатомия / ≤120 |
| 🆕 | `edu.hoverHint` | Наведи на точку внутри клетки — название и роль органа | Hover a dot inside the cell — organelle name and role | Beweeg over een stip in de cel — naam en functie van het organel | анатомия / ≤120 |
| 🆕 | `edu.membrane.desc` | Тонкая оболочка из липидов. Контролирует, что входит и выходит. У всех клеток есть мембрана. | Thin lipid envelope. Controls what goes in and out. Every cell has a membrane. | Dun lipidevlies. Regelt wat erin en eruit gaat. Elke cel heeft een membraan. | анатомия / ≤120 |
| 🆕 | `edu.membrane.name` | Мембрана | Membrane | Membraan | анатомия / ≤120 |
| 🆕 | `edu.mito.desc` | «Электростанция» клетки. Дыхание: сахар + O₂ → ATP (энергия). Своя ДНК — остаток древней бактерии. | Power plant of the cell. Respiration: sugar + O₂ → ATP (energy). Has its own DNA — remnant of an ancient bacterium. | De energiefabriek van de cel. Ademhaling: suiker + O₂ → ATP (energie). Heeft eigen DNA — overblijfsel van een oude bacterie. | анатомия / ≤120 |
| 🆕 | `edu.mito.name` | Митохондрия | Mitochondrion | Mitochondrion | анатомия / ≤120 |
| 🆕 | `edu.nucleoid.desc` | Зона с кольцевой ДНК у прокариот. Нет ядерной оболочки — геном свободно в цитоплазме. | Region with circular DNA in prokaryotes. No nuclear envelope — the genome floats freely in the cytoplasm. | Gebied met ringvormig DNA bij prokaryoten. Geen kernmembraan — het genoom zweeft vrij in het cytoplasma. | анатомия / ≤120 |
| 🆕 | `edu.nucleoid.name` | Нуклеоид | Nucleoid | Nucleoïde | анатомия / ≤120 |
| 🆕 | `edu.nucleus.desc` | Хранит ДНК. Управляет ростом, делением и синтезом белков. У бактерий настоящего ядра нет — ДНК в нуклеоиде. | Stores DNA. Controls growth, division and protein synthesis. Bacteria have no true nucleus — DNA sits in the nucleoid. | Bewaart DNA. Stuurt groei, deling en eiwitsynthese. Bacteriën hebben geen echte kern — DNA ligt in de nucleoïde. | анатомия / ≤120 |
| 🆕 | `edu.nucleus.name` | Ядро | Nucleus | Celkern | анатомия / ≤120 |
| 🆕 | `edu.oral.desc` | У инфузорий — желобок, куда реснички сгоняют добычу. Отсюда пища попадает в пищеварительную вакуоль. | In ciliates — a groove where cilia sweep prey. Food enters the digestive vacuole from here. | Bij trilhaardigen — een groef waar trilharen prooi naartoe vegen. Voedsel komt hiervandaan in de verteringsvacuole. | анатомия / ≤120 |
| 🆕 | `edu.oral.name` | Ротовая воронка | Oral groove | Mondgroef | анатомия / ≤120 |
| 🆕 | `edu.vacuole.desc` | Пузырёк с водой, запасными веществами или пищеварительными ферментами. У инфузорий — пищеварительные и сократительные вакуоли. | Vesicle with water, reserves or digestive enzymes. Ciliates have digestive and contractile vacuoles. | Blaasje met water, reserves of verteringsenzymen. Trilhaardigen hebben verterings- en samentrekkende vacuoles. | анатомия / ≤120 |
| 🆕 | `edu.vacuole.name` | Вакуоль | Vacuole | Vacuole | анатомия / ≤120 |
| 🆕 | `edu.wall.desc` | Жёсткий каркас снаружи мембраны (пептидогликан у бактерий, целлюлоза у растений). Защита и форма. | Rigid frame outside the membrane (peptidoglycan in bacteria, cellulose in plants). Protection and shape. | Stijf frame buiten het membraan (peptidoglycaan bij bacteriën, cellulose bij planten). Bescherming en vorm. | анатомия / ≤120 |
| 🆕 | `edu.wall.name` | Клеточная стенка | Cell wall | Celwand | анатомия / ≤120 |
|  | `energy` | Энергия | Energy | Energie | общий UI / ≤60 |
| 🆕 | `ev.acid_rain` | Кислотный дождь | Acid rain | Zure regen | событие / ≤60 |
| 🆕 | `ev.eclipse` | Солнечное затмение | Solar eclipse | Zonsverduistering | событие / ≤60 |
| 🆕 | `ev.ended` | {name} закончился | {name} ended | {name} afgelopen | событие / ≤60 |
| 🆕 | `ev.warn` | ВНИМАНИЕ: {name}! | WARNING: {name}! | WAARSCHUWING: {name}! | событие / ≤60 |
|  | `exit` | Выход | Exit | Afsluiten | общий UI / ≤60 |
| 🆕 | `fc.consumer1` | грызут зелёных | nibble greens | knabbelen op groen | общий UI / ≤60 |
| 🆕 | `fc.consumer2` | фильтруют мелочь | filter small ones | kleine diertjes filteren | общий UI / ≤60 |
| 🆕 | `fc.consumer3` | едят всех | eat everyone | iedereen opeten | общий UI / ≤60 |
| 🆕 | `fc.decomposer` | убирают мёртвое | clean up dead | dood opruimen | общий UI / ≤60 |
| 🆕 | `fc.producer` | делают еду из света | make food from light | voedsel maken van licht | общий UI / ≤60 |
| 🆕 | `fc.schema` | (схема) | (schematic) | (schema) | общий UI / ≤60 |
|  | `filter` | Фильтр | Filter | Filter | общий UI / ≤60 |
|  | `filterHint` | нажми другую кнопку чтобы сменить | tap another button to switch | tik op een andere knop om te wisselen | общий UI / ≤60 |
|  | `flight` | Полёт | Flight | Vlucht | общий UI / ≤60 |
|  | `follow` | Следить | Follow | Volgen | общий UI / ≤60 |
| 🆕 | `food.decomposer` | мёртвые остатки | dead matter | dood materiaal | питание / ≤60 |
| 🆕 | `food.producer` | свет + вода + минералы | light + water + minerals | licht + water + mineralen | питание / ≤60 |
|  | `fps` | FPS | FPS | FPS | общий UI / ≤60 |
|  | `freeCam` | Своб. камера | Free Cam | Vrije cam | общий UI / ≤60 |
|  | `gameTime` | Время | Time | Tijd | общий UI / ≤60 |
|  | `healthBars` | Шкалы здоровья | Health Bars | Levensbalken | общий UI / ≤60 |
|  | `help` | КАК ИГРАТЬ | HOW TO PLAY | SPELUITLEG | общий UI / ≤60 |
| 🆕 | `help.body` | <p><b style="color:#4df">Управление:</b> WASD — плавать. Пробел = укус. ЛКМ — плыть к курсору.</p><p><b style="color:#8f8">Кто кого ест:</b></p><p>🌱 Зелёные едят свет. 🔵 Мелкие едоки едят зелёных. 🟠 Средние фильтруют бактерий и зелёных. 🟣 Крупные охотники едят зелёных, бактерий и средних — и могут кусать чуть более крупных.</p><p><b style="color:#4df">Камера:</b> F свободная камера, V к клетке. Колесо = зум.</p><p><b style="color:#4df">Деление:</b> Ешь, расти, делись. Q — вручную.</p> | <p><b style="color:#4df">Controls:</b> WASD swim. Space = bite. LMB = swim to cursor.</p><p><b style="color:#8f8">Who eats whom:</b></p><p>🌱 Greens eat light. 🔵 Small eaters eat greens. 🟠 Mid eaters filter bacteria+greens. 🟣 Big hunters eat greens, bacteria and mid-eaters — and can bite slightly larger prey.</p><p><b style="color:#4df">Camera:</b> F free cam, V back to cell. Wheel = zoom.</p><p><b style="color:#4df">Division:</b> Eat, grow, split. Q = manual.</p> | <p><b style="color:#4df">Besturing:</b> WASD zwemmen. Spatie = bijten. LMB = zwem naar cursor.</p><p><b style="color:#8f8">Wie eet wie:</b></p><p>🌱 Groen eet licht. 🔵 Kleine eters eten groen. 🟠 Mid eters filteren bacteriën+groen. 🟣 Grote jagers eten groen, bacteriën en mid-eters — en kunnen iets grotere prooi bijten.</p><p><b style="color:#4df">Camera:</b> F vrije cam, V terug naar cel. Wiel = zoom.</p><p><b style="color:#4df">Deling:</b> Eet, groei, deel. Q = handmatig.</p> | помощь / ≤200 |
|  | `hud.btn.auto` | АВТО | AUTO | AUTO | HUD кнопка / ≤14 |
|  | `hud.btn.auto.short` | АВТО | AUTO | AUTO | HUD кнопка (короткая) / ≤8 |
|  | `hud.btn.cyst` | СПОРА | SPORE | SPORE | HUD кнопка / ≤14 |
|  | `hud.btn.cyst.short` | СПОРА | SPORE | SPORE | HUD кнопка (короткая) / ≤8 |
|  | `hud.btn.divide` | ДЕЛИТЬ | DIVIDE | DELEN | HUD кнопка / ≤14 |
|  | `hud.btn.divide.short` | ДЕЛИТЬ | DIVIDE | DELEN | HUD кнопка (короткая) / ≤8 |
|  | `hud.btn.eat` | ЕСТЬ | EAT | ETEN | HUD кнопка / ≤14 |
|  | `hud.btn.eat.short` | ЕСТЬ | EAT | ETEN | HUD кнопка (короткая) / ≤8 |
|  | `hud.btn.light` | СВЕТ | LIGHT | LICHT | HUD кнопка / ≤14 |
|  | `hud.btn.light.short` | СВЕТ | LIGHT | LICHT | HUD кнопка (короткая) / ≤8 |
|  | `hud.btn.menu` | Меню | Menu | Menu | HUD кнопка / ≤14 |
|  | `hud.divide.reason.age` | слишком молода | too young | te jong | HUD / ≤40 |
|  | `hud.divide.reason.busy` | идёт деление | dividing | aan het delen | HUD / ≤40 |
|  | `hud.divide.reason.cd` | перезарядка {sec} с | cooldown {sec} s | afkoeling {sec} s | HUD / ≤40 |
|  | `hud.divide.reason.energy` | энергия {cur}/{need} | energy {cur}/{need} | energie {cur}/{need} | HUD / ≤40 |
|  | `hud.divide.reason.mass` | масса {cur}/{need} | mass {cur}/{need} | massa {cur}/{need} | HUD / ≤40 |
|  | `hud.divide.reason.none` | нет клетки | no cell | geen cel | HUD / ≤40 |
|  | `hud.divide.reason.size` | размер {cur}/{need} | size {cur}/{need} | grootte {cur}/{need} | HUD / ≤40 |
| 🆕 | `hud.genSep` |  · Gen  |  · Gen  |  · Gen  | HUD / ≤40 |
|  | `hud.goal` | Поделись: {cur}/{need} | Divide: {cur}/{need} | Delen: {cur}/{need} | HUD / ≤40 |
| 🆕 | `kh.hide` | Свернуть | Hide keys | Toetsen verbergen | общий UI / ≤60 |
| 🆕 | `kh.keys` | Клавиши | Keys | Toetsen | общий UI / ≤60 |
| 🆕 | `lb.title` | 🏆 Таблица лидеров | 🏆 Leaderboard | 🏆 Scorebord | общий UI / ≤60 |
| 🆕 | `leg.apex` | Крупные охотники | Apex hunters | Topjagers | общий UI / ≤60 |
| 🆕 | `leg.bacteria` | Бактерии | Bacteria | Bacteriën | общий UI / ≤60 |
| 🆕 | `leg.decomp` | редуценти | Decomposers | Reducenten | общий UI / ≤60 |
| 🆕 | `leg.large` | Крупные | Large | Groot | общий UI / ≤60 |
| 🆕 | `leg.producer` | Водоросли | Algae | Algen | общий UI / ≤60 |
| 🆕 | `leg.virus` | Вирусы | Viruses | Virussen | общий UI / ≤60 |
|  | `legend` | Легенда | Legend | Legenda | общий UI / ≤60 |
|  | `light` | Свет | Light | Licht | общий UI / ≤60 |
|  | `lightInt` | Инт. света | Light Intensity | Lichtsterkte | общий UI / ≤60 |
|  | `map` | Карта | Map | Kaart | общий UI / ≤60 |
|  | `mapChart` | Карта и график | Map and chart | Kaart en grafiek | общий UI / ≤60 |
|  | `mapTip` | Миникарта — где вы в пруду. Клик = прыжок камеры. | Minimap: where you are in the pond. Click jumps the camera. | Minikaart: waar je in de vijver bent. Klik springt met de camera. | общий UI / ≤60 |
|  | `massWord` | Масса | Mass | Massa | общий UI / ≤60 |
|  | `maxPop` | Макс. поп | Max Pop | Max pop | общий UI / ≤60 |
|  | `menu` | В МЕНЮ | MENU | MENU | общий UI / ≤60 |
|  | `menuSub` | Симуляция микроорганизмов — {n} видов + вирусы. Разрез водоёма сбоку. | Microorganism Simulation — {n} species + viruses. Pond cross-section view. | Simulatie van micro-organismen — {n} soorten + virussen. Doorsnede van een vijver. | общий UI / ≤60 |
| 🆕 | `mic.scope` | МИКРОСКОП × | MICROSCOPE × | MICROSCOOP × | микроскоп / ≤30 |
|  | `microscope` | Микроскоп | Microscope | Microscoop | общий UI / ≤60 |
|  | `midEaterTip` | Средний едок: подплыви к зелёным/бактериям — реснички фильтруют сами. | Mid eater: swim to greens or bacteria. Cilia filter on their own. | Mid eter: zwem naar groen of bacteriën. Trilharen filteren vanzelf. | общий UI / ≤60 |
| 🆕 | `mob.eSep` |  · E= |  · E= |  · E= | моб. UI / ≤30 |
| 🆕 | `mob.infected` |  · 🦠 заражён |  · 🦠 infected |  · 🦠 geïnfecteerd | моб. UI / ≤30 |
| 🆕 | `mob.you` |  · ВЫ |  · YOU |  · JIJ | моб. UI / ≤30 |
| 🆕 | `mode.swissLbl` | 📗 SWISS | 📗 SWISS | 📗 SWISS | общий UI / ≤60 |
| 🆕 | `mode.webglLbl` | 🌊 WEBGL | 🌊 WEBGL | 🌊 WEBGL | общий UI / ≤60 |
| 🆕 | `modeBig.cartoon` | 🎨 МУЛЬТЯШНЫЙ | 🎨 CARTOON | 🎨 CARTOON | общий UI / ≤60 |
| 🆕 | `modeBig.swiss` | 📗 SWISSBIOPICS | 📗 SWISSBIOPICS | 📗 SWISSBIOPICS | общий UI / ≤60 |
| 🆕 | `modeBig.webgl` | 🌊 WEBGL | 🌊 WEBGL | 🌊 WEBGL | общий UI / ≤60 |
| 🆕 | `modeLbl.cartoon` | 🎨 Мультяшный | 🎨 Cartoon | 🎨 Cartoon | общий UI / ≤60 |
| 🆕 | `modeLbl.swiss` | 📗 SwissBioPics | 📗 SwissBioPics | 📗 SwissBioPics | общий UI / ≤60 |
| 🆕 | `modeLbl.webgl` | 🌊 WebGL | 🌊 WebGL | 🌊 WebGL | общий UI / ≤60 |
|  | `next` | Далее | Next | Verder | общий UI / ≤60 |
|  | `noSpecies` | Нет видов в категории «{cat}». Нажмите «Все». | No species in "{cat}". Tap All. | Geen soorten in "{cat}". Tik op Alle. | общий UI / ≤60 |
|  | `offspring` | Потомков | Offspring | Nakomelingen | общий UI / ≤60 |
|  | `particles` | Частицы | Particles | Deeltjes | общий UI / ≤60 |
|  | `paused` | ПАУЗА | PAUSED | GEPAUZEERD | общий UI / ≤60 |
|  | `picMode` | Режим картинки | Picture mode | Beeldmodus | общий UI / ≤60 |
|  | `play` | Играть | Play | Spelen | общий UI / ≤60 |
|  | `poolWill` | В водоёме будет: ~{n} организмов · {kinds} видов | Pool will have: ~{n} organisms · {kinds} species | In de vijver: ~{n} organismen · {kinds} soorten | общий UI / ≤60 |
|  | `pop` | Поп-ция | Pop | Pop | общий UI / ≤60 |
|  | `popTip` | График популяции — сколько микробов во времени. | Population chart: how many microbes over time. | Bevolkingsgrafiek: hoeveel microben in de tijd. | общий UI / ≤60 |
|  | `predation` | Хищники | Predators | Roofdieren | общий UI / ≤60 |
|  | `producer` | Зелёные (корм) | Greens (food) | Groen (voedsel) | общий UI / ≤60 |
|  | `rainy` | Дождь | Rain | Regen | общий UI / ≤60 |
|  | `ready` | ГОТОВО | READY | KLAAR | общий UI / ≤60 |
|  | `restart` | ЗАНОВО | RESTART | HERSTART | общий UI / ≤60 |
|  | `resume` | ПРОДОЛЖИТЬ | RESUME | DOORGAAN | общий UI / ≤60 |
| 🆕 | `role.consumer1` | Мелкие едоки (бактерии). Кусают зелёных. Сами — еда для средних и крупных. | Small eaters (bacteria). Nibble greens. Food for mid and big eaters. | Kleine eters (bacteriën). Knabbelen groen. Voedsel voor mid- en grote eters. | карточка роли / ≤80 |
| 🆕 | `role.consumer2` | Средние едоки (инфузории). Фильтруют воду: затягивают бактерий и зелёных. Не кидаются на гигантов. | Mid eaters (ciliates). Filter water: pull in bacteria and greens. Do not tackle giants. | Mid eters (trilhaardigen). Filteren water: halen bacteriën en groen binnen. Geen reuzen aanpakken. | карточка роли / ≤80 |
| 🆕 | `role.consumer3` | Крупные охотники. Едят зелёных, бактерий и средних. Могут кусать и тех, кто чуть крупнее — но это рискованно. Без еды живут долго, но голод всё равно опасен. | Big hunters. Eat greens, bacteria and mid-eaters. Can bite slightly larger prey — risky. Live long without food, but hunger still kills. | Grote jagers. Eten groen, bacteriën en mid-eters. Kunnen iets grotere prooi bijten — riskant. Leven lang zonder voedsel, maar honger doodt toch. | карточка роли / ≤80 |
| 🆕 | `role.decomposer` | Уборщики. Разлагают мёртвое — не охотятся на живых. | Cleaners. Break down the dead — do not hunt the living. | Schoonmakers. Breken het dode af — jagen niet op levenden. | карточка роли / ≤80 |
| 🆕 | `role.macrophage` | Стражи. Атакуют больных и опасных — «иммунитет» пруда. | Guards. Attack sick/dangerous cells — the pond immune system. | Wachters. Vallen zieke/gevaarlijke cellen aan — het immuunsysteem van de vijver. | карточка роли / ≤80 |
| 🆕 | `role.producer` | Зелёные. Не охотятся. Едят свет и воду — как крошечные растения. Кормят всех остальных. | Greens. No hunting. They eat light and water — tiny plants. Feed everyone else. | Groen. Geen jacht. Eten licht en water — kleine plantjes. Voeden iedereen. | карточка роли / ≤80 |
|  | `roleFood` | Еда | Food | Voedsel | карточка роли / ≤80 |
|  | `roleHint` | Подсказка: еда подсвечена цветным кольцом. Полоска «Запах еды» справа вверху. | Hint: food is marked with a colored ring. The food-scent bar is at the top right. | Hint: voedsel heeft een gekleurde ring. De voedselgeurbalk zit rechtsboven. | карточка роли / ≤80 |
|  | `roleOk` | Понятно — плыву | Got it — I'll swim | Begrepen — ik ga zwemmen | карточка роли / ≤80 |
|  | `roleWho` | Ты кто / кого ешь | Who you are / what you eat | Wie je bent / wat je eet | карточка роли / ≤80 |
|  | `season0` | Весна | Spring | Lente | общий UI / ≤60 |
|  | `season1` | Лето | Summer | Zomer | общий UI / ≤60 |
|  | `season2` | Осень | Autumn | Herfst | общий UI / ≤60 |
|  | `season3` | Зима | Winter | Winter | общий UI / ≤60 |
|  | `selectSp` | Выберите организм | Select organism | Kies organisme | общий UI / ≤60 |
|  | `set` | НАСТРОЙКИ | SETTINGS | INSTELLINGEN | настройки / ≤40 |
|  | `settingsT` | Настройки | Settings | Instellingen | настройки / ≤40 |
|  | `shadows` | Тени | Shadows | Schaduwen | общий UI / ≤60 |
|  | `shown` | показано | shown | getoond | общий UI / ≤60 |
|  | `simSpeed` | Скорость | Speed | Snelheid | общий UI / ≤60 |
|  | `skip` | Пропустить | Skip | Overslaan | общий UI / ≤60 |
| 🆕 | `sp.1000` | Губка (фильтратор) | Sponge (Filter Feeder) | Spons (filtereter) | имя вида / ≤40 |
| 🆕 | `sp.1001` | Половая эукариота | Sexual Eukaryote | Sekse-eukaryoot | имя вида / ≤40 |
| 🆕 | `sp.999` | Макрофаг (Иммунитет) | Macrophage (Immunity) | Macrofaag (immuniteit) | имя вида / ≤40 |
| 🆕 | `spcard.virus` | Вирус | Virus | Virus | общий UI / ≤60 |
|  | `speciesWord` | видов | species | soorten | общий UI / ≤60 |
| 🆕 | `star.alphacentauri` | ★ Альфа Центавра A+B | ★ Alpha Centauri A+B | ★ Alpha Centauri A+B | звезда / ≤40 |
| 🆕 | `star.antares` | ★ Антарес | ★ Antares | ★ Antares | звезда / ≤40 |
| 🆕 | `star.betelgeuse` | ★ Бетельгейзе | ★ Betelgeuse | ★ Betelgeuze | звезда / ≤40 |
| 🆕 | `star.binary` | ★ Двойная (синяя+оранжевая) | ★ Binary (blue+orange) | ★ Dubbel (blauw+oranje) | звезда / ≤40 |
| 🆕 | `star.dwarf` | ★ Красный карлик | ★ Red dwarf | ★ Rode dwerg | звезда / ≤40 |
| 🆕 | `star.flare` | ★ Вспышечная (UV Ceti) | ★ Flare star (UV Ceti) | ★ Vlakte-ster (UV Ceti) | звезда / ≤40 |
| 🆕 | `star.giant` | ★ Оранжевый гигант | ★ Orange giant | ★ Oranje reus | звезда / ≤40 |
| 🆕 | `star.polaris` | ★ Полярная | ★ Polaris | ★ Poolster | звезда / ≤40 |
| 🆕 | `star.pulsar` | ★ Нейтронная (пульсар) | ★ Neutron (pulsar) | ★ Neutron (pulsar) | звезда / ≤40 |
| 🆕 | `star.quadruple` | ★★★★ Четверная | ★★★★ Quadruple | ★★★★ Vierdubbel | звезда / ≤40 |
| 🆕 | `star.rigel` | ★ Ригель | ★ Rigel | ★ Rigel | звезда / ≤40 |
| 🆕 | `star.sirius` | ★ Сириус A+B | ★ Sirius A+B | ★ Sirius A+B | звезда / ≤40 |
| 🆕 | `star.sol` | ☀ Солнце | ☀ Sun | ☀ Zon | звезда / ≤40 |
| 🆕 | `star.trinary` | ★★★ Тройная | ★★★ Triple | ★★★ Driedubbel | звезда / ≤40 |
| 🆕 | `star.twin` | ★★ Близнецы | ★★ Twins | ★★ Tweeling | звезда / ≤40 |
| 🆕 | `star.vega` | ★ Вега | ★ Vega | ★ Vega | звезда / ≤40 |
| 🆕 | `starg.alphacentauri` | ★ α Центавра | ★ α Centauri | ★ α Centauri | звезда / ≤40 |
| 🆕 | `starg.sirius` | ★ Сириус | ★ Sirius | ★ Sirius | звезда / ≤40 |
|  | `start` | НАЧАТЬ | START | START | общий UI / ≤60 |
|  | `swissNow` | Сейчас: SwissBioPics. Клик → WebGL. | Now: Swiss. Click for WebGL. | Nu: Swiss. Klik voor WebGL. | общий UI / ≤60 |
|  | `temp` | Т° | Temp | Temp | общий UI / ≤60 |
| 🆕 | `tip.ageBar` | Возраст существа. Старые клетки теряют энергию быстрее. | Creature age. Old cells lose energy faster. | Leeftijd van het wezen. Oude cellen verliezen energie sneller. | общий UI / ≤60 |
| 🆕 | `tip.auto` | Авто | Auto | Auto | общий UI / ≤60 |
| 🆕 | `tip.cartoon` | Мультяшный. Клик → SwissBioPics | Cartoon. Click -> SwissBioPics | Cartoon. Klik -> SwissBioPics | общий UI / ≤60 |
| 🆕 | `tip.cbFilter` | Фильтр организмов. Нажмите, чтобы показать только этот вид в меню. | Organism filter. Click to show only this species in the menu. | Organisme-filter. Klik om alleen deze soort in het menu te tonen. | общий UI / ≤60 |
| 🆕 | `tip.cyst` | Спора | Spore | Spore | общий UI / ≤60 |
| 🆕 | `tip.daysL` | Игровые дни. Смена сезонов влияет на температуру. | Game days. Season changes affect temperature. | Speldagen. Seizoenswissels beïnvloeden de temperatuur. | общий UI / ≤60 |
| 🆕 | `tip.divide` | Делить | Split | Delen | общий UI / ≤60 |
| 🆕 | `tip.eat` | Есть | Eat | Eten | общий UI / ≤60 |
| 🆕 | `tip.energyBar` | Энергия существа. Падает со временем. Если дойдет до нуля — смерть от голода. | Creature energy. Drops over time. At zero — death by starvation. | Energie van het wezen. Zakt met de tijd. Op nul — dood door honger. | общий UI / ≤60 |
| 🆕 | `tip.feed` | Ручное питание | Manual feed | Handmatig voeren | общий UI / ≤60 |
| 🆕 | `tip.fly` | Свободный полёт: F или WASD / мышь | Free flight: F or WASD / mouse | Vrije vlucht: F of WASD / muis | общий UI / ≤60 |
| 🆕 | `tip.follow` | Следить | Follow | Volgen | общий UI / ≤60 |
| 🆕 | `tip.fpsL` | Кадры в секунду (FPS). Показывает производительность игры. | Frames per second (FPS). Shows game performance. | Frames per seconde (FPS). Toont de prestaties. | общий UI / ≤60 |
| 🆕 | `tip.lang` | Выбор языка | Language selector | Taalkeuze | общий UI / ≤60 |
| 🆕 | `tip.lightL` | Уровень освещенности. Важен для фотосинтеза водорослей. | Light level. Important for algae photosynthesis. | Lichtniveau. Belangrijk voor fotosynthese van algen. | общий UI / ≤60 |
| 🆕 | `tip.microMode` | Режим микроскопа | Microscope Mode | Microscoopmodus | общий UI / ≤60 |
| 🆕 | `tip.pause` | Пауза | Pause | Pauze | общий UI / ≤60 |
| 🆕 | `tip.popC` | График популяции. Показывает историю рождений и смертей. | Population chart. Shows birth and death history. | Bevolkingsgrafiek. Toont geboorte- en sterfgeschiedenis. | общий UI / ≤60 |
| 🆕 | `tip.render` | Картинка: мульт / Swiss | Picture: cartoon / Swiss | Beeld: cartoon / Swiss | общий UI / ≤60 |
| 🆕 | `tip.starSel` | Выбор звезды/солнца | Select star/sun | Kies ster/zon | общий UI / ≤60 |
| 🆕 | `tip.swiss` | SwissBioPics. Клик → WebGL | SwissBioPics. Click -> WebGL | SwissBioPics. Klik -> WebGL | общий UI / ≤60 |
| 🆕 | `tip.tempL` | Температура воды. Влияет на метаболизм и выживание. | Water temperature. Affects metabolism and survival. | Watertemperatuur. Beïnvloedt stofwisseling en overleven. | общий UI / ≤60 |
| 🆕 | `tip.webgl` | WebGL-вода. Клик → мультяшный | WebGL water. Click -> cartoon | WebGL-water. Klik -> cartoon | общий UI / ≤60 |
| 🆕 | `tip.wikiB` | Вики/Бестиарий | Wiki/Bestiary | Wiki/Bestiaris | общий UI / ≤60 |
| 🆕 | `tip.zi` | Zoom+ | Zoom+ | Zoom+ | общий UI / ≤60 |
| 🆕 | `tip.zo` | Zoom- | Zoom- | Zoom- | общий UI / ≤60 |
| 🆕 | `toast.auto.eat` | АВТО: съел | AUTO: ate | AUTO: gegeten | тост / ≤60 |
| 🆕 | `toast.auto.gain` | АВТО: +{e} энергия | AUTO: +{e} energy | AUTO: +{e} energie | тост / ≤60 |
| 🆕 | `toast.bite` | КУСЬ! {name} | BITE! {name} | BIJT! {name} | тост / ≤60 |
| 🆕 | `toast.biteBig` | Откусил кусок — крупная добыча! | Bit off a chunk — big prey! | Stuk afgebeten — grote prooi! | тост / ≤60 |
| 🆕 | `toast.biteGain` | Укус +{e} эн / +{m} м | Bite +{e} en / +{m} m | Beet +{e} en / +{m} m | тост / ≤60 |
| 🆕 | `toast.cilia.filter` | Реснички: фильтр-питание | Cilia: filter feeding | Trilharen: filtervoeding | тост / ≤60 |
| 🆕 | `toast.controls` | Управление: WASD / мышь · ЕСТЬ (E) · ДЕЛИТЬ (Q) | Controls: WASD / mouse · EAT (E) · DIVIDE (Q) | Besturing: WASD / muis · ETEN (E) · DELEN (Q) | тост / ≤60 |
|  | `toast.cyst.enter` | Спора: защита, движение 0, энергия тратится медленно | Spore: protected, speed 0, energy drains slowly | Spore: beschermd, snelheid 0, energie zakt langzaam | тост / ≤60 |
|  | `toast.cyst.exit` | Вышел из споры | Left the spore | Spore verlaten | тост / ≤60 |
|  | `toast.cyst.hunger` | Голод: впал в цисту — найди еду и проснись | Hunger: encysted — find food and wake | Honger: ingekist — zoek voedsel en word wakker | тост / ≤60 |
| 🆕 | `toast.digest` | Пищеварение... ({s}с) | Digesting... ({s}s) | Verteren... ({s}s) | тост / ≤60 |
| 🆕 | `toast.divfail` | Деление: вторая клетка не создалась | Division: second cell failed to form | Deling: tweede cel kon niet vormen | тост / ≤60 |
|  | `toast.divide.blocked` | Пока нельзя делиться | Cannot divide yet | Kan nog niet delen | тост / ≤60 |
|  | `toast.divide.go` | Деление | Dividing | Aan het delen | тост / ≤60 |
| 🆕 | `toast.divided` | Деление! | Divided! | Gedeeld! | тост / ≤60 |
|  | `toast.eat.closer` | Ближе к добыче | Closer to prey | Dichter bij prooi | тост / ≤60 |
|  | `toast.eat.none` | Рядом нет добычи — подплыви ближе | No prey nearby — swim closer | Geen prooi in de buurt — zwem dichterbij | тост / ≤60 |
| 🆕 | `toast.eat.noneAuto` | Рядом нет добычи — включи АВТО или подплыви | No prey nearby — enable AUTO or swim closer | Geen prooi in de buurt — zet AUTO aan of zwem dichterbij | тост / ≤60 |
|  | `toast.eat.ok` | Съел | Ate | Gegeten | тост / ≤60 |
|  | `toast.eat.plant` | Ты растение: плыви к свету | You are a plant: swim toward the light | Je bent een plant: zwem naar het licht | тост / ≤60 |
| 🆕 | `toast.extinct` | Вид {name} вымер! | Species {name} went extinct! | Soort {name} is uitgestorven! | тост / ≤60 |
| 🆕 | `toast.filter.catch` | Фильтр: затянул добычу | Filter: pulled in prey | Filter: prooi binnengehaald | тост / ≤60 |
| 🆕 | `toast.filter.catch2` | Фильтр: захватил добычу | Filter: captured prey | Filter: prooi gevangen | тост / ≤60 |
| 🆕 | `toast.gain` | +{e} эн / +{m} масса | +{e} en / +{m} mass | +{e} en / +{m} massa | тост / ≤60 |
| 🆕 | `toast.infected` | Клетка инфицирована! Лизис через 10-20с | Cell infected! Lysis in 10-20s | Cel geïnfecteerd! Lysis over 10-20s | тост / ≤60 |
|  | `toast.lang.fallback` | Язык не включён, показан английский | Language is off, showing English | Taal staat uit, Engels wordt getoond | тост / ≤60 |
| 🆕 | `toast.microOff` | Микроскоп выкл | Microscope off | Microscoop uit | тост / ≤60 |
| 🆕 | `toast.microOn` | 🔬 Микроскоп: вода остаётся, зум+сетка (не режим N) | 🔬 Microscope: water stays, zoom+grid (not mode N) | 🔬 Microscoop: water blijft, zoom+raster (niet modus N) | тост / ≤60 |
| 🆕 | `toast.noPlayer` | Нет игрока | No player | Geen speler | тост / ≤60 |
| 🆕 | `toast.parasite.gone` | Паразит сброшен | Parasite shed | Parasiet afgeworpen | тост / ≤60 |
| 🆕 | `toast.webglFail` | WebGL недоступен — возврат в мультяшный | WebGL unavailable — falling back to cartoon | WebGL niet beschikbaar — terugval op cartoon | тост / ≤60 |
|  | `topOfList` | вверху списка | top of the list | bovenaan de lijst | общий UI / ≤60 |
| 🆕 | `tut.s1.body` | Вы — микроорганизм в луже. Цель: есть, расти, делиться. Нажмите «Далее». | You are a microbe in a pond. Goal: eat, grow, divide. Tap Next. | Je bent een microbe in een vijver. Doel: eten, groeien, delen. Tik op Verder. | обучение / ≤200 |
| 🆕 | `tut.s1.title` | Добро пожаловать | Welcome | Welkom | обучение / ≤200 |
| 🆕 | `tut.s2.body` | WASD — плыть. Мышь задаёт направление. Попробуйте сдвинуться, затем «Далее». | WASD to swim. The mouse sets direction. Move, then tap Next. | WASD om te zwemmen. De muis bepaalt de richting. Beweeg en tik op Verder. | обучение / ≤200 |
| 🆕 | `tut.s2.title` | Движение | Movement | Beweging | обучение / ≤200 |
| 🆕 | `tut.s3.body` | Подойдите к меньшей клетке и нажмите ЕСТЬ (E). Должны появиться вспышка и «+энергия». | Swim to a smaller cell and press EAT (E). You should see a flash. | Zwem naar een kleinere cel en druk ETEN (E). Je zou een flits moeten zien. | обучение / ≤200 |
| 🆕 | `tut.s3.title` | Питание | Eating | Eten | обучение / ≤200 |
| 🆕 | `tut.s4.body` | При полной энергии нажмите ДЕЛИТЬ (Q). Клетка станет заметно меньше — это нормально. | When energy is full, press SPLIT (Q). The cell gets smaller. That is normal. | Als de energie vol is, druk DELEN (Q). De cel wordt kleiner. Dat is normaal. | обучение / ≤200 |
| 🆕 | `tut.s4.title` | Деление | Division | Deling | обучение / ≤200 |
| 🆕 | `tut.s5.body` | Камера: СЛЕДИТЬ / ПОЛЁТ. Картинка: МУЛЬТЯШНЫЙ или SWISS. Удачи в эволюции! | Camera: follow or free flight. Good luck evolving! | Camera: volgen of vrije vlucht. Veel succes met evolueren! | обучение / ≤200 |
| 🆕 | `tut.s5.title` | Готово | Done | Klaar | обучение / ≤200 |
|  | `tutDone` | Туториал пройден | Tutorial done | Tutorial afgerond | общий UI / ≤60 |
|  | `vignette` | Виньетка | Vignette | Vignet | общий UI / ≤60 |
|  | `virus` | Вирусы | Viruses | Virussen | общий UI / ≤60 |
|  | `virusMode` | Режим вируса: {name}. Кликни по бактерии = инфицировать. WASD = камера. | Virus mode: {name}. Click a bacterium to infect. WASD moves the camera. | Virusmodus: {name}. Klik op een bacterie om te infecteren. WASD beweegt de camera. | общий UI / ≤60 |
|  | `virusRate` | Частота вирусов | Virus Rate | Virusgraad | общий UI / ≤60 |
|  | `webglNow` | Сейчас: WebGL-вода. Клик → мультяшный. | Now: WebGL water. Click for cartoon. | Nu: WebGL-water. Klik voor cartoon. | общий UI / ≤60 |
| 🆕 | `wgl.diff1` | Фон воды рисует WebGL-шейдер (рябь, каустика, блик) | Water background drawn by WebGL shader (ripples, caustics, glints) | Waterachtergrond getekend door WebGL-shader (rimpels, caustics, glinsteringen) | общий UI / ≤60 |
| 🆕 | `wgl.diff2` | Основной canvas прозрачный поверх GL | Main canvas transparent over GL | Hoofdcanvas transparant over GL | общий UI / ≤60 |
| 🆕 | `wgl.same1` | Мир и организмы на Canvas 2D | World and organisms on Canvas 2D | Wereld en organismen op Canvas 2D | общий UI / ≤60 |
| 🆕 | `wgl.same2` | Управление/еда/движение без смены симуляции | Controls/food/movement without simulation change | Besturing/voedsel/beweging zonder simulatiewijziging | общий UI / ≤60 |
|  | `wiki` | ВИКИ | WIKI | WIKI | общий UI / ≤60 |
| 🆕 | `wiki.def.shell` | Кремниевый панцирь | Silica shell | Silicaschaal | вики / ≤300 |
| 🆕 | `wiki.def.spikes` | Шипы | Spikes | Stekels | вики / ≤300 |
| 🆕 | `wiki.def.toxic` | Токсичность | Toxicity | Giftigheid | вики / ≤300 |
| 🆕 | `wiki.def.venom` | Яд | Venom | Gif | вики / ≤300 |
| 🆕 | `wiki.defs` | Особенности: | Features: | Kenmerken: | вики / ≤300 |
| 🆕 | `wiki.div.binary` | Деление надвое | Binary fission | Binaire deling | вики / ≤300 |
| 🆕 | `wiki.div.budding` | Почкование | Budding | Knopvorming | вики / ≤300 |
| 🆕 | `wiki.searchPh` | Поиск… | Search... | Zoeken... | вики / ≤300 |
|  | `wikiT` | Вики: жители лужи | Wiki: Pond Life | Wiki: Leven in de vijver | общий UI / ≤60 |
| 🆕 | `x.a` | Взр | A | A | метки/подписи / ≤60 |
| 🆕 | `x.alive` | Живых | Alive | Levend | метки/подписи / ≤60 |
| 🆕 | `x.bacteriophageInfectsBacteriaCauses` | Бактериофаг. Заражает бактерии, вызывает лизис. | Bacteriophage. Infects bacteria, causes lysis. | Bacteriofaag. Infecteert bacteriën, veroorzaakt lysis. | метки/подписи / ≤60 |
| 🆕 | `x.born` | Родилось | Born | Geboren | метки/подписи / ≤60 |
| 🆕 | `x.chloroplasts` | хлоропласты | chloroplasts | chloroplasten | метки/подписи / ≤60 |
| 🆕 | `x.cilia` | реснички | cilia | trilharen | метки/подписи / ≤60 |
| 🆕 | `x.contractileVacuole` | сокр. вакуоль | contractile vacuole | samentrekkende vacuole | метки/подписи / ≤60 |
| 🆕 | `x.cover` |  · укрытие |  · cover |  · dekking | метки/подписи / ≤60 |
| 🆕 | `x.currentlyAlive` | Сейчас живы | Currently alive | Nu levend | метки/подписи / ≤60 |
| 🆕 | `x.cyst` | Циста | Cyst | Cyste | метки/подписи / ≤60 |
| 🆕 | `x.cyst2` |  · ЦИСТА |  · CYST |  · CYSTE | метки/подписи / ≤60 |
| 🆕 | `x.dead` | Погибло | Dead | Dood | метки/подписи / ≤60 |
| 🆕 | `x.dividing` | Делится | Dividing | Aan het delen | метки/подписи / ≤60 |
| 🆕 | `x.division` | Деление | Division | Deling | метки/подписи / ≤60 |
| 🆕 | `x.e` | Эн | E | E | метки/подписи / ≤60 |
| 🆕 | `x.flagella` | жгутик | flagella | flagellen | метки/подписи / ≤60 |
| 🆕 | `x.food` | Пища | Food | Voedsel | метки/подписи / ≤60 |
| 🆕 | `x.foodScent` | Запах еды | Food scent | Voedselgeur | метки/подписи / ≤60 |
| 🆕 | `x.golgi` | гольджи | Golgi | Golgi | метки/подписи / ≤60 |
| 🆕 | `x.healthy` | Здоров | Healthy | Gezond | метки/подписи / ≤60 |
| 🆕 | `x.infected` | Заражен | Infected | Geïnfecteerd | метки/подписи / ≤60 |
| 🆕 | `x.infected2` | Заражен! | Infected! | Geïnfecteerd! | метки/подписи / ≤60 |
| 🆕 | `x.infected3` | Инфицировано | Infected | Geïnfecteerd | метки/подписи / ≤60 |
| 🆕 | `x.locomotion` | Движение | Locomotion | Voortbeweging | метки/подписи / ≤60 |
| 🆕 | `x.lysed` | Лизировано | Lysed | Gelyseerd | метки/подписи / ≤60 |
| 🆕 | `x.macroMicronucleus` | макро/микронуклеус | macro/micronucleus | macro/micronucleus | метки/подписи / ≤60 |
| 🆕 | `x.mitochondria` | митохондрии | mitochondria | mitochondriën | метки/подписи / ≤60 |
| 🆕 | `x.move` | Движение | Move | Bewegen | метки/подписи / ≤60 |
| 🆕 | `x.nothingFound` | Ничего не найдено. | Nothing found. | Niets gevonden. | метки/подписи / ≤60 |
| 🆕 | `x.nucleus` | ядро | nucleus | kern | метки/подписи / ≤60 |
| 🆕 | `x.organelles` | Органеллы | Organelles | Organellen | метки/подписи / ≤60 |
| 🆕 | `x.phages` | Фагов | Phages | Fagen | метки/подписи / ≤60 |
| 🆕 | `x.pondStatistics` | Статистика Водоёма | Pond Statistics | Vijverstatistieken | метки/подписи / ≤60 |
| 🆕 | `x.predators` | Враги | Predators | Roofdieren | метки/подписи / ≤60 |
| 🆕 | `x.pseudopodia` | псевдоподии | pseudopodia | schijnvoeten | метки/подписи / ≤60 |
| 🆕 | `x.s` | Рзм | S | S | метки/подписи / ≤60 |
| 🆕 | `x.scaleBar` | Масштаб: 100 мкм | Scale: 100 µm | Schaal: 100 µm | метки/подписи / ≤60 |
| 🆕 | `x.size` | Размер | Size | Grootte | метки/подписи / ≤60 |
| 🆕 | `x.starving` | Голод | Starving | Uitgehongerd | метки/подписи / ≤60 |
| 🆕 | `x.totalBorn` | Всего родилось | Total born | Totaal geboren | метки/подписи / ≤60 |
| 🆕 | `x.trichocysts` | трихоцисты | trichocysts | trichocysten | метки/подписи / ≤60 |
| 🆕 | `x.virusMode` | РЕЖИМ ВИРУСА | VIRUS MODE | VIRUSMODUS | метки/подписи / ≤60 |
| 🆕 | `x.wasdSwimLmbCursorRmbTargetWheel` | <span><kbd>WASD</kbd> Плыть</span><span><kbd>ЛКМ</kbd> Курсор</span><span><kbd>ПКМ</kbd> Цель</span><span><kbd>Колесо</kbd> Зум</span><span class="kh-sum">Кнопки: E Q R Space Tab F M N V B P</span> | <span><kbd>WASD</kbd> Swim</span><span><kbd>LMB</kbd> Cursor</span><span><kbd>RMB</kbd> Target</span><span><kbd>Wheel</kbd> Zoom</span><span class="kh-sum">Buttons: E Q R Space Tab F M N V B P</span> | <span><kbd>WASD</kbd> Zwemmen</span><span><kbd>LMB</kbd> Cursor</span><span><kbd>RMB</kbd> Doel</span><span><kbd>Wiel</kbd> Zoom</span><span class="kh-sum">Knoppen: E Q R Spatie Tab F M N V B P</span> | метки/подписи / ≤60 |
| 🆕 | `x.wasdSwimLmbCursorRmbTargetWheel2` | <span><kbd>WASD</kbd> Плыть</span><span><kbd>ЛКМ</kbd> Курсор</span><span><kbd>ПКМ</kbd> Цель</span><span><kbd>Колесо</kbd> Зум</span><span class="kh-sum">Кнопки: E Q R Space Tab F M N V B P</span> | <span><kbd>WASD</kbd> Swim</span><span><kbd>LMB</kbd> Cursor</span><span><kbd>RMB</kbd> Target</span><span><kbd>Wheel</kbd> Zoom</span><span class="kh-sum">Buttons: E Q R Space Tab F M N V B P</span> | <span><kbd>WASD</kbd> Zwemmen</span><span><kbd>LMB</kbd> Cursor</span><span><kbd>RMB</kbd> Doel</span><span><kbd>Wiel</kbd> Zoom</span><span class="kh-sum">Knoppen: E Q R Spatie Tab F M N V B P</span> | метки/подписи / ≤60 |
| 🆕 | `x.wind` | Ветер | Wind | Wind | метки/подписи / ≤60 |
| 🆕 | `x.you` | Это Вы | You | Jij | метки/подписи / ≤60 |
| 🆕 | `x.yourCell` | Ваша клетка | Your cell | Jouw cel | метки/подписи / ≤60 |
| 🆕 | `x.yourSpecies` | Ваш вид:  | Your species:  | Jouw soort:  | метки/подписи / ≤60 |
| 🆕 | `loc.drift` | дрейф | drift | drijven | вики «Движение» / ≤18 |
| 🆕 | `loc.glide` | скользящий | glide | glijden | вики «Движение» / ≤18 |
| 🆕 | `loc.flagella` | жгутики | flagella | flagellen | вики «Движение» / ≤18 |
| 🆕 | `loc.cilia` | реснички | cilia | trilharen | вики «Движение» / ≤18 |
| 🆕 | `loc.ciliaStalk` | реснички на стебельке | cilia on stalk | trilharen op steel | вики «Движение» / ≤18 |
| 🆕 | `loc.pseudopodia` | псевдоподии | pseudopodia | schijnvoeten | вики «Движение» / ≤18 |
| 🆕 | `loc.sessile` | прикреплённый | sessile | vastzittend | вики «Движение» / ≤18 |
| 🆕 | `loc.budding` | почкование | budding | knopvorming | вики «Движение» / ≤18 |
| 🆕 | `loc.growth` | рост | growth | groei | вики «Движение» / ≤18 |
| 🆕 | `exitAsk` | Выйти? | Exit? | Afsluiten? | общий UI / ≤60 |
| 🆕 | `exitMsg` | Прогресс этой жизни будет потерян. | Progress of this life will be lost. | De voortgang van dit leven gaat verloren. | общий UI / ≤60 |
| 🆕 | `yes` | Да | Yes | Ja | общий UI / ≤60 |
| 🆕 | `no` | Нет | No | Nee | общий UI / ≤60 |
| 🆕 | `more` | Ещё | More | Meer | общий UI / ≤60 |
| 🆕 | `deadYours` | Ваша клетка погибла | Your cell died | Je cel is dood | общий UI / ≤60 |
| 🆕 | `aliveWord` | живых | alive | levend | общий UI / ≤60 |
| 🆕 | `deadOther` | Прочее | Other | Overig | общий UI / ≤60 |
| 🆕 | `setLang` | Язык | Language | Taal | настройки / ≤40 |
| 🆕 | `helpTouch` | <p><b>Управление:</b> Джойстик — плыть. Касание воды — направление. Нижние кнопки: есть, делиться, спора, авто. Щипок — масштаб.</p> | <p><b>Controls:</b> Drag the joystick to swim. Tap the water to aim. Bottom buttons: Eat, Divide, Spore, Auto. Pinch to zoom.</p> | <p><b>Besturing:</b> Sleep de joystick om te zwemmen. Tik op het water om te richten. Onderknoppen: eten, delen, spore, auto. Knijpen voor zoom.</p> | общий UI / ≤60 |
| 🆕 | `dCull` | Регуляция пула | Pool regulation | Poolregulatie | общий UI / ≤60 |
| 🆕 | `errGeneric` | Ошибка | Error | Fout | общий UI / ≤60 |
| 🆕 | `errAsync` | Асинхронная ошибка | Async error | Asynchrone fout | общий UI / ≤60 |
| 🆕 | `loadingWorld` | Собираем пруд… | Building the pond… | De vijver wordt gebouwd… | общий UI / ≤60 |
| 🆕 | `economy` | Экономный режим | Economy mode | Spaarstand | общий UI / ≤60 |
| 🆕 | `economyAsk` | Кадров меньше 25. Экономный режим — в настройках: меньше подписей, водоём −30%. | Frame rate is under 25. Economy mode is in Settings: fewer captions, pool −30%. | Framerate onder 25. Spaarstand staat in de instellingen: minder labels, vijver −30%. | общий UI / ≤60 |
| 🆕 | `demoTipTouch` | <b>ДЕМО</b> · палец двигает камеру · 1–6 группа · касание клетки — войти<br> | <b>DEMO</b> · drag to fly · 1–6 jump group · tap a cell to enter<br> | <b>DEMO</b> · sleep om te vliegen · 1–6 naar groep · tik op een cel om binnen te gaan<br> | общий UI / ≤60 |
| 🆕 | `camFlyTouch` | Свободная камера | Free cam | Vrije cam | общий UI / ≤60 |
| 🆕 | `speciesShown.one` | {n} вид | {n} species | {n} soort | общий UI / ≤60 |
| 🆕 | `speciesShown.other` | {n} вид | {n} species | {n} soorten | общий UI / ≤60 |
| 🆕 | `coloniesCount.one` | {n} колония | {n} colony | {n} kolonie | общий UI / ≤60 |
| 🆕 | `coloniesCount.other` | {n} колония | {n} colonies | {n} kolonies | общий UI / ≤60 |
| 🆕 | `aliveCount.one` | {n} жив | {n} alive | {n} levend | общий UI / ≤60 |
| 🆕 | `aliveCount.other` | {n} жив | {n} alive | {n} levend | общий UI / ≤60 |

## Вики — тела видов (108)

| id | en | nl |
|---|---|---|
| `0` | Synechocystis is a cyanobacterium with no nucleus. It lives on light: oxygenic photosynthesis on membranes, no chloroplasts. Lab model for hydrogen metabolism. | Synechocystis is een cyanobacterie zonder kern. Leeft van licht: zuurstofproducerende fotosynthese op membranen, geen chloroplasten. Labmodel voor waterstofmetabolisme. |
| `1` | Anabaena variabilis is a filament. Some cells become heterocysts and fix nitrogen while neighbours make sugar. In the pond it supplies bound nitrogen. | Anabaena variabilis is een filamente. Sommige cellen worden heterocysten en binden stikstof terwijl buren suiker maken. Voorziet de vijver van gebonden stikstof. |
| `2` | Spirulina (Arthrospira) is a coil of cells with gas vesicles. It hangs near the surface, photosynthesizes, and is edible. In-game it is a large green screw at the water film. | Spirulina (Arthrospira) is een spiraal van cellen met gasblaasjes. Hangt vlak onder het oppervlak, fotosynthetiseert en is eetbaar. In het spel een grote groene schroef in het watervlies. |
| `3` | Nostoc punctiforme is a bead chain in a slime capsule. It lives free or in plant symbiosis. The colony looks like a clump of green beads. | Nostoc punctiforme is een kralenketen in een slijmcapsule. Leeft vrij of in symbiose met planten. De kolonie lijkt op een klont groene kralen. |
| `4` | Oscillatoria limnetica is a gliding filament. It oscillates side to side and can photosynthesize without releasing oxygen. Typical of silt and surface film. | Oscillatoria limnetica is een glijdende filamente. Beweegt zijdelings heen en weer en kan fotosynthetiseren zonder zuurstof te maken. Typisch voor slik en oppervlaktevlies. |
| `5` | Microcystis aeruginosa is a mucilage colony, often toxic (microcystin). It causes water bloom. In-game it is a green colony ball, risky prey. | Microcystis aeruginosa is een slijmkolonie, vaak giftig (microcystine). Veroorzaakt waterbloei. In het spel een groene koloniebol, riskante prooi. |
| `6` | Gloeocapsa is paired cells in colored sheaths. It lives on rocks and soil and tolerates UV. In the pond it is small paired cocci in a coat. | Gloeocapsa is gepaarde cellen in gekleurde scheden. Leeft op rotsen en bodem, verdraagt UV. In de vijver kleine gepaarde kokken in een jasje. |
| `7` | Lyngbya majuscula is a thick cyanobacterial filament. It can release irritating toxins. It forms mats near warm shores. | Lyngbya majuscula is een dikke cyanobacteriële filamente. Kan irriterende gifstoffen looslaten. Vormt matten bij warme oevers. |
| `8` | Chlamydomonas reinhardtii is a green cell with two flagella and an eyespot. It swims toward light. Classic algal genetics model. | Chlamydomonas reinhardtii is een groene cel met twee flagellen en een oogvlek. Zwemt naar het licht. Klassiek model voor alggenetica. |
| `9` | Chlorella vulgaris is a non-motile green ball. It divides fast and is protein-rich. Food for small eaters and a space-food subject. | Chlorella vulgaris is een niet-beweglijke groene bol. Deelt snel en is eiwitrijk. Voedsel voor kleine eters en ruimtevoer-onderwerp. |
| `10` | Volvox globator is a hollow sphere of thousands of cells. Daughter colonies ripen inside and exit. In-game it is a large green colony. | Volvox globator is een holle bol van duizenden cellen. Dochterkolonies rijpen binnenin en verlaten de bol. In het spel een grote groene kolonie. |
| `11` | Euglena gracilis is a mixotroph: chloroplasts plus the ability to eat. A red eyespot tracks light. Green by day; in the dark it switches to food. | Euglena gracilis is een mixotroof: chloroplasten plus het vermogen te eten. Een rode oogvlek volgt het licht. Overdag groen; in het donker schakelt hij op voedsel. |
| `12` | Scenedesmus quadricauda is usually four cells in a row with end spines. Spines make swallowing harder. It does not swim — it drifts. | Scenedesmus quadricauda is meestal vier cellen op een rij met eindstekels. Stekels maken inslikken moeilijker. Zwemt niet — drijft. |
| `13` | Haematococcus pluvialis is a green motile cell; under stress it turns red (astaxanthin) and grows a thick wall. Red cysts survive drought. | Haematococcus pluvialis is een groene beweeglijke cel; onder stress wordt hij rood (astaxanthine) en groeit een dikke wand. Rode cysten overleven droogte. |
| `14` | Dunaliella salina has no rigid wall and lives in very salty water. It stores beta-carotene and looks orange. Two flagella. | Dunaliella salina heeft geen stijve wand en leeft in zeer zout water. Slaat bètacaroteen op en ziet er oranje uit. Twee flagellen. |
| `15` | Micrasterias rotata is a flat star desmid. Two mirrored halves with deep cuts. Non-motile; photosynthesizes in acidic bog water. | Micrasterias rotata is een platte stersmooswier. Tween gespiegelde helften met diepe insnijdingen. Niet-beweeglijk; fotosynthetiseert in zuur veenwater. |
| `16` | Navicula is a boat-shaped diatom with a silica valve. It glides on the substrate along a raphe slit. The shell remains after death. | Navicula is een bootvormige diatomee met een silicaschelp. Glijdt over het substraat langs een rafe-spleet. De schelp blijft na de dood. |
| `17` | Pinnularia viridis is a large pennate diatom. Silica shell with a symmetric pattern. It glides slowly on the bottom. | Pinnularia viridis is een grote pennale diatomee. Silicaschelp met symmetrisch patroon. Glijdt langzaam over de bodem. |
| `18` | Cyclotella meneghiniana is a circular centric diatom. It floats as a disc; the shell is two lids. Typical plankton. | Cyclotella meneghiniana is een ronde centrale diatomee. Drijft als een schijfje; de schelp is twee deksels. Typisch plankton. |
| `19` | Diatoma vulgare is a diatom that sticks into a zigzag. The colony increases drag in the water column. | Diatoma vulgare is een diatomee die in zigzag plakt. De kolonie vergroot de weerstand in de waterkolom. |
| `20` | Rhodospirillum rubrum is a purple spiral. Anoxygenic photosynthesis plus organics. Red color comes from bacteriochlorophyll. | Rhodospirillum rubrum is een paarse spiraal. Anoxigene fotosynthese plus organische stof. De rode kleur komt van bacteriochlorofyl. |
| `21` | Chromatium vinosum is a purple sulfur bacterium. It oxidizes hydrogen sulfide and stores sulfur granules. Lives at the oxygen/sulfur boundary. | Chromatium vinosum is een paarse zwavelbacterie. Oxideert waterstofsulfide en slaat zwavelkorrels op. Leeft op de zuurstof/zwielgrens. |
| `22` | Porphyridium cruentum is a unicellular red alga. Phycoerythrin gives a blood-red color. Mucilage coat, no flagella. | Porphyridium cruentum is een eencellige rode alg. Ficoërythrine geeft een bloedrode kleur. Slijmjasje, geen flagellen. |
| `23` | Prochlorococcus marinus is the smallest and most abundant photosynthetic cell on Earth. Discovered in the 1980s. It feeds the ocean. | Prochlorococcus marinus is de kleinste en talrijkste fotosynthetische cel op aarde. Ontdekt in de jaren 80. Voedt de oceaan. |
| `24` | Chroococcidiopsis thermalis is an extremophile: desert, rock, radiation. A candidate for life beyond Earth. In the pond it is a slow coccus colony. | Chroococcidiopsis thermalis is een extremofiel: woestijn, rots, straling. Kandidaat voor leven buiten aarde. In de vijver een trage kokkenkolonie. |
| `25` | Bdellovibrio bacteriovorus is a tiny bacterial predator. It screws into another cell and multiplies until the host bursts. | Bdellovibrio bacteriovorus is een piepkleine bacteriële rover. Schroeft een andere cel binnen en vermeenigvuldigt tot de gastheer barst. |
| `26` | Vampirococcus sits on prey from the outside and sucks out the contents without entering. A bacterial vampire. | Vampirococcus zit van buiten op de prooi en zuigt de inhoud leeg zonder binnen te dringen. Een bacteriële vampier. |
| `27` | Daptobacter enters a prey bacterium and eats it from inside. A rare intracellular hunter. | Daptobacter dringt een prooi-bacterie binnen en eet hem van binnenuit. Een zeldzaam intracellulair jager. |
| `28` | Myxococcus xanthus is a social bacterium. In a pack it surrounds prey and releases enzymes. When starved it forms a fruiting body. | Myxococcus xanthus is een sociale bacterie. In een roedel omsingelt hij prooi en laat enzymen los. Bij honger vormt hij een vruchtlichaam. |
| `29` | Bacteriovorax stolpii is a marine Bdellovibrio relative. It attacks Gram-negatives and lives in the prey periplasm. | Bacteriovorax stolpii is een marine verwant van Bdellovibrio. Valt Gram-negatieven aan en leeft in het periplasma van de prooi. |
| `30` | Halobacteriovorax is a salt-tolerant bacterial hunter. Same trick: puncture the wall and grow inside. | Halobacteriovorax is een zouttolerante bacteriële jager. Zelfde truc: de wand doorboren en vanbinnen groeien. |
| `31` | Peredibacter starrii is another BALO predator. A fast comma-shaped flagellate targeting large rods. | Peredibacter starrii is nog een BALO-rover. Een snelle komma-vormige flagellaat op grote staven. |
| `32` | Monas guttula is a small heterotrophic flagellate. It grabs bacteria at the detritus surface. | Monas guttula is een kleine heterotrofe flagellaat. Grijpt bacteriën op het detritusoppervlak. |
| `33` | Oikomonas termo is a drop-shaped flagellate. One flagellum; it hunts in bacterial film. | Oikomonas termo is een druppelvormige flagellaat. Eén flagel; jaagt in bacteriële vliesjes. |
| `34` | Anthophysa vegetans is a colony on an iron-manganese stalk. Cells sit in a tuft and catch bacteria. | Anthophysa vegetans is een kolonie op een ijzer-mangaan steel. Cellen zitten in een plukje en vangen bacteriën. |
| `35` | Chilomonas paramecium is a colorless cryptophyte. Two flagella; it eats dissolved organics and tiny bacteria, no chloroplasts. | Chilomonas paramecium is een kleurloze cryptofyt. Twee flagellen; eet opgeloste organica en piepkleine bacteriën. |
| `36` | Cercomonas longicauda is an amoeboflagellate with a long tail. It crawls and swallows bacteria with pseudopodia. | Cercomonas longicauda is een amoeboflagellaat met een lange staart. Kruipt en slikt bacteriën met schijnvoeten. |
| `37` | Heteromita globosa is a soil flagellate. Two flagella of different length; a main bacterial eater in soil. | Heteromita globosa is een bodemflagellaat. Twee flagellen van verschillende lengte; een hoofd-bacterie-eter in bodem. |
| `38` | Bodo saltans is a kinetoplastid. It 'dances' in place, attached by the rear flagellum, and snatches bacteria. | Bodo saltans is een kinetoplastide. Danst ter plekke, vast aan de achterste flagel, en grist bacteriën weg. |
| `39` | Procryptobia sorokini is a Bodo relative. It swims freely and strikes prey with the anterior flagellum. | Procryptobia sorokini is een verwant van Bodo. Zwemt vrij en slaat prooi met de voorste flagel. |
| `40` | Trypanosoma brucei is a blood parasite causing sleeping sickness. Undulating membrane and one flagellum. In the pond it is a slim-hunter model. | Trypanosoma brucei is een bloedparasiet die slaapziekte veroorzaakt. Golvend membraan en één flagel. In de vijver een model van een slanke jager. |
| `41` | Leishmania donovani is an intracellular human parasite. Flagellated in the insect, aflagellate inside a macrophage. | Leishmania donovani is een intracellulaire humane parasiet. Geflagelleerd in het insect, zonder flagel binnenin een macrofaag. |
| `42` | Monosiga brevicollis is a choanoflagellate, an animal relative. A microvilli collar filters bacteria. | Monosiga brevicollis is een choanoflagellaat, verwant aan dieren. Een kraag van microvilli filtert bacteriën. |
| `43` | Salpingoeca rosetta is a sessile choanoflagellate in a lorica. It can form a rosette. It filters a water current. | Salpingoeca rosetta is een vastzittende choanoflagellaat in een lorica. Kan een rozet vormen. Filtert een waterstroom. |
| `44` | Codonosiga botrytis is a choanoflagellate colony on a shared stalk. Several filters on one stem. | Codonosiga botrytis is een choanoflagellaat-kolonie op een gezamenlijke steel. Meerdere filters op één stam. |
| `45` | Paramecium caudatum is the classic slipper. Thousands of cilia, an oral groove, contractile vacuoles. It filters bacteria. | Paramecium caudatum is het klassieke pantoffeldiertje. Duizenden trilharen, een mondgroef, samentrekkende vacuoles. Filtert bacteriën. |
| `46` | Paramecium bursaria is a slipper with zoochlorella symbionts. Green inside: sugar from algae by day, filtering at night. | Paramecium bursaria is een pantoffeldiertje met zoochlorella-symbionten. Vanbinnen groen: suiker van algen overdag, 's nachts filterend. |
| `47` | Stentor coeruleus is a blue trumpet up to a millimetre. It flares into a funnel and drives a current with cilia. It can swim or sit. | Stentor coeruleus is een blauwe trompet tot een millimeter. Slaat uit tot een trechter en drijft een stroom met trilharen. Kan zwemmen of zitten. |
| `48` | Stentor polymorphus is a relative of the blue stentor, often with zoochlorellae. Shape shifts from trumpet to ball. | Stentor polymorphus is een verwant van de blauwe stentor, vaak met zoochlorellen. Verandert van trompet tot bol. |
| `49` | Vorticella campanula is a bell on a contractile stalk. The stalk coils into a spiral instantly. The cell itself does not swim away. | Vorticella campanula is een belletje op een samentrekkende steel. De steel kronkelt in een oogwenk tot een spiraal. De cel zelf zwemt niet weg. |
| `50` | Vorticella microstoma is a small bell. Same spring-stalk, a narrower oral field. Often on detritus. | Vorticella microstoma is een klein belletje. Zelfde veersteel, een smallere mondzone. Vaak op detritus. |
| `51` | Didinium nasutum is a barrel hunter of slippers. It fires toxicysts and swallows prey whole, even if the prey is larger. | Didinium nasutum is een tonvormige jager van pantoffeldiertjes. Schiet toxicysten af en slikt de prooi heel door, ook als die groter is. |
| `52` | Spirostomum ambiguum is a very long cigar. It contracts several-fold in a fraction of a second. Cilia run in a spiral. | Spirostomum ambiguum is een zeer lange sigaar. Trekt in een fractie van een seconde meerdere keren samen. Trilharen lopen in spiraal. |
| `53` | Blepharisma americanum is a pink ciliate. Blepharismin pigment is light-sensitive. It filters and can attack smaller cells. | Blepharisma americanum is een roze trilhaardiertje. Blepharismin-pigment is lichtgevoelig. Filtert en kan kleinere cellen aanvallen. |
| `54` | Euplotes patella walks on cirri as if on legs. Flat, quick turns. It scrapes bacteria off surfaces. | Euplotes patella loopt op cirri alsof het pootjes zijn. Plat, snelle wendingen. Schraapt bacteriën van oppervlakken. |
| `55` | Stylonychia pustulata is a hypotrich that 'runs' on the bottom. Large cirri, a clear mouth. Predator of small ciliates. | Stylonychia pustulata is een hypotrich die over de bodem 'rent'. Grote cirri, een duidelijke mond. Rover van kleine trilhaardiertjes. |
| `56` | Oxytricha trifallax is a genome model: two nuclei and complex DNA rewriting. It walks on cirri and eats bacteria and small protists. | Oxytricha trifallax is een genoommodel: twee kernen en complexe DNA-herschrijving. Loopt op cirri en eet bacteriën en kleine protisten. |
| `57` | Tetrahymena thermophila is a lab ciliate. Four oral membranelles, fast division. Model for telomeres and cilia. | Tetrahymena thermophila is een lab-trilhaardiertje. Vier mondmembraantjes, snelle deling. Model voor telomeren en trilharen. |
| `58` | Coleps hirtus is a barrel in calcareous plates with spines. Scavenger and predator: it bites into the wounded. | Coleps hirtus is een ton in kalkplaten met stekels. Aaseter én rover: bijt in gewonden. |
| `59` | Litonotus lamella is a flat predator with toxicysts in a 'proboscis'. It paralyzes prey and sucks it out. | Litonotus lamella is een platte rover met toxicysten in een 'slurf'. Verlamt de prooi en zuigt hem leeg. |
| `60` | Dileptus anser has a long neck with venomous extrusomes. It strikes with the neck, then swallows. A large mid-tier hunter. | Dileptus anser heeft een lange nek met giftige extrusomen. Slaat met de nek en slikt door. Een grote mid-tier jager. |
| `61` | Urocentrum turbo is a spinning top: an equatorial ciliary belt spins the cell in place. It filters bacteria. | Urocentrum turbo is een tol: een equatoriale trilhaargordel draait de cel ter plekke rond. Filtert bacteriën. |
| `62` | Zoothamnium arbuscula is a branched colony of bells. A shared contractile stalk jerks the whole tree at once. | Zoothamnium arbuscula is een vertakte kolonie van belletjes. Eén gezamenlijke samentrekkende steel rukt de hele boom tegelijk. |
| `63` | Opercularia coarctata is a sessile peritrich without a spring stalk. A lid covers the mouth. It filters and does not swim away. | Opercularia coarctata is een vastzittende peritrich zonder veersteel. Een dekseltje bedekt de mond. Filtert en zwemt niet weg. |
| `64` | Amoeba proteus is the classic amoeba. Pseudopodia flow around prey. No fixed shape, no cilia. | Amoeba proteus is de klassieke amoebe. Schijnvoeten vloeien om de prooi heen. Geen vaste vorm, geen trilharen. |
| `65` | Arcella vulgaris is a testate amoeba with a rigid dome. Pseudopodia emerge from the aperture. It crawls on plants. | Arcella vulgaris is een schaalamoebe met een stijve koepel. Schijnvoeten komen uit de opening. Kruipt over planten. |
| `66` | Difflugia oblonga has a shell of sand grains the amoeba glues itself. It lives in silt. | Difflugia oblonga heeft een schelp van zandkorrels die de amoebe zelf vastlijmt. Leeft in slik. |
| `67` | Euglypha alveolata has a shell of silica scales. Thin filose pseudopodia. A small bacterial predator. | Euglypha alveolata heeft een schelp van silicacaaljes. Dunne draadvormige schijnvoeten. Een kleine bacteriële rover. |
| `68` | Nebela collaris is a bottle-shaped shell built from stolen scales. Forest and bog waters. | Nebela collaris is een flesvormige schelp gebouwd van gestolen schubjes. Bos- en veenwateren. |
| `69` | Centropyxis aculeata is a disc shell with spines. The aperture is offset. It crawls on detritus. | Centropyxis aculeata is een schijfvormige schelp met stekels. De opening staat scheef. Kruipt over detritus. |
| `70` | Actinophrys sol is a heliozoan: thin axopodia radiate all around. Prey sticks to the rays and is pulled in. | Actinophrys sol is een heliozoïde: dunne axopodiën stralen rondom. Prooi blijft aan de stralen plakken en wordt binnengehaald. |
| `71` | Actinosphaerium eichhorni is a large multinucleate heliozoan. Same rays, much bigger cell. It eats ciliates and rotifers. | Actinosphaerium eichhorni is een grote meerkernige heliozoïde. Zelfde stralen, veel grotere cel. Eet trilhaardiertjes en raderdiertjes. |
| `72` | Raphidiophrys pallida is a heliozoan in scales. Rays carry silica needles. An ambush plankton hunter. | Raphidiophrys pallida is een heliozoïde in schubjes. De stralen dragen silicanaalden. Een hinderlaag-planktonjager. |
| `73` | Rotaria rotatoria is a rotifer that can survive drying. A corona wheels food into the mouth. A true multicellular animal. | Rotaria rotatoria is een raderdiertje dat uitdroging overleeft. Een corona wielt voedsel naar de mond. Een echt meercellig dier. |
| `74` | Philodina roseola is a pink bdelloid rotifer. It crawls like a leech and also swims. Females only; no males. | Philodina roseola is een roze bdelloïd raderdiertje. Kruipt als een bloedzuiger en zwemt ook. Alleen vrouwtjes; geen mannetjes. |
| `75` | Brachionus plicatilis is a planktonic loricate rotifer. Fry food in aquaculture. It filters algae and bacteria. | Brachionus plicatilis is een planktonisch lorica-raderdiertje. Larvenvoer in aquacultuur. Filtert algen en bacteriën. |
| `76` | Keratella cochlearis is a rotifer with a long lorica spine. The spine deters predators. Common pond plankton. | Keratella cochlearis is een raderdiertje met een lange loricastekel. De stekel schrikt rovers af. Veelvoorkomend vijverplankton. |
| `77` | Asplanchna priodonta is a sack without a lorica, a predatory rotifer. It swallows other rotifers and ciliates whole. | Asplanchna priodonta is een zak zonder lorica, een roofzuchtig raderdiertje. Slikt andere raderdiertjes en trilhaardiertjes heel door. |
| `78` | Chaetonotus maximus is a gastrotrich. Scale-covered, it crawls on the bottom. It eats bacteria and detritus. | Chaetonotus maximus is een buikharigje. Met schubjes bedekt, kruipt over de bodem. Eet bacteriën en detritus. |
| `79` | Lepidodermella squamata is a small gastrotrich in overlapping scales. Very fast in-place turns. | Lepidodermella squamata is een klein buikharigje in overlappende schubjes. Zeer snelle wendingen ter plekke. |
| `80` | Macrostomum lignano is a microscopic flatworm. Real muscles and eyes. A regeneration model. It hunts small protists. | Macrostomum lignano is een microscopische platworm. Echte spieren en ogen. Regeneratiemodel. Jaagt op kleine protisten. |
| `81` | Stenostomum leucops is a thin ciliated worm. It divides across into a chain of zooids. Predator of detritus and small animals. | Stenostomum leucops is een dun trilhaarwormpje. Deelt dwars in een keten van zoïden. Rover van detritus en kleine diertjes. |
| `82` | Microstomum lineare is a flatworm that eats hydra and embeds their stinging cells in its own skin. A chain of zooids. | Microstomum lineare is een platworm die hydra's eet en hun netelcellen in eigen huid inbouwt. Een keten van zoïden. |
| `83` | Prostoma graecense is a freshwater nemertean. A long proboscis shoots at prey. A rare large bottom hunter. | Prostoma graecense is een zoetwater-nemertijn. Een lange slurf schiet op prooi af. Een zeldzaam grote bodemjager. |
| `84` | Trichoplax adhaerens is a placozoan, among the simplest animals. It crawls as a sheet and digests food outside. No mouth. | Trichoplax adhaerens is een placozoër, een van de eenvoudigste dieren. Kruipt als een vlaag en verteert voedsel vanbuiten. Geen mond. |
| `85` | Saccharomyces cerevisiae is baker's yeast. It buds, eats sugar, releases CO2 and alcohol. In the pond it cleans dissolved organics. | Saccharomyces cerevisiae is bakkersgist. Knoppt, eet suiker, geeft CO₂ en alcohol af. Ruimt in de vijver opgeloste organica. |
| `86` | Candida albicans is a yeast that can grow as filaments. An opportunistic human pathogen. In-game it is a detrital fungus. | Candida albicans is een gist die als filamente kan groeien. Een opportunistische humane ziekteverwekker. In het spel een detritusschimmel. |
| `87` | Mucor mucedo is bread mold. Sporangia on stalks, fast growth over the dead. It does not hunt the living. | Mucor mucedo is broodschimmel. Sporangia op steeljes, snelle groei over het dode. Jaagt niet op levenden. |
| `88` | Rhizopus stolonifer is black bread mold. Stolons and rhizoids spread over the substrate. It breaks down starch. | Rhizopus stolonifer is zwarte broodschimmel. Stolonen en rhizoïden spreiden over het substraat. Breekt zetmeel af. |
| `89` | Penicillium chrysogenum is a brush mold, the source of penicillin. Conidial brushes. It decomposes organics and suppresses nearby bacteria. | Penicillium chrysogenum is kwastjeschimmel, de bron van penicilline. Conidiële kwastjes. Ontleedt organica en onderdrukt nabije bacteriën. |
| `90` | Aspergillus niger is black aspergillus. Spherical spore heads. Industrial citric-acid producer. A saprotroph. | Aspergillus niger is zwarte aspergillus. Bolvormige sporenkoppen. Industriële citroenzuurproducent. Een saprotroof. |
| `91` | Batrachochytrium dendrobatidis is a chytrid of frogs. Uniflagellate zoospores. In the pond it is a water-fungus model. | Batrachochytrium dendrobatidis is een chytride van kikkers. Eén-flagellige zoösporen. In de vijver een waterschimmelmodel. |
| `92` | Chytriomyces aureus is a water chytrid on pollen and algae. Golden sporangia; zoospores swim to the substrate. | Chytriomyces aureus is een waterchytride op pollen en algen. Gouden sporangia; zoösporen zwemmen naar het substraat. |
| `93` | Allomyces macrogynus is a water fungus with true mycelium. It alternates diploid and haploid. Zoospores have a posterior flagellum. | Allomyces macrogynus is een waterschimmel met echt mycelium. Wisselt diploïde en haploïde af. Zoösporen hebben een achterste flagel. |
| `94` | Bacillus subtilis is a soil rod. Spores survive boiling. It breaks down protein; a Gram-positive model. | Bacillus subtilis is een bodemstaafje. Sporen overleven koken. Breekt eiwit af; een Gram-positief model. |
| `95` | Pseudomonas putida is a cleanup rod. It even eats petroleum products. Motile flagellum, fast growth on detritus. | Pseudomonas putida is een opruimstaafje. Eet zelfs olieproducten. Bewegende flagel, snelle groei op detritus. |
| `96` | Streptomyces coelicolor is a filamentous soil bacterium. It makes the smell of earth (geosmin) and many antibiotics. Spores on hyphae. | Streptomyces coelicolor is een filamenteuze bodembacterie. Maakt de geur van aarde (geosmine) en veel antibiotica. Sporen op schimmeldraden. |
| `97` | Cellulomonas fimi breaks down cellulose. A yellow rod on plant detritus. Without it dead algae would linger longer. | Cellulomonas fimi breekt cellulose af. Een geel staafje op plantdetritus. Zonder hem zou dood algen langer blijven liggen. |
| `98` | Thermus aquaticus is a thermophile from hot springs. Taq polymerase is the basis of PCR. In a cold pond it is almost dormant. | Thermus aquaticus is een thermofiel uit warme bronnen. Taq-polymerase is de basis van PCR. In een koude vijver bijna in rust. |
| `99` | Deinococcus radiodurans is the radiation champion. It reassembles a shattered genome in hours. Thick wall, cell tetrads. | Deinococcus radiodurans is de stralingskampioen. Zet een verscheurd genoom in uren weer in elkaar. Dikke wand, cel-tetraden. |
| `1001` | Sexual Eukaryote is a teaching model of sexual reproduction. Two sexes, gamete fusion, not simple binary fission. | Sekse-eukaryoot is een lesmodel van seksuele voortplanting. Twee seksen, gametenversmelting, geen simpele binaire deling. |
| `T4 Bacteriophage` | T4 is a large myovirus of E. coli. The tail contracts and injects DNA. In half an hour the cell bursts and dozens of phages exit. | T4 is een groot myovirus van E. coli. De staart trekt samen en spuit DNA erin. Binnen een half uur barst de cel en verlaten tientallen fagen hem. |
| `Lambda Phage` | Lambda is a temperate phage. It can insert into the chromosome and sleep (lysogeny) or cut the cell at once (lysis). | Lambda is een gematigde faag. Kan in het chromosoom gaan zitten en slapen (lysogenie) of de cel meteen doorklieven (lysis). |
| `T7 Bacteriophage` | T7 has a short tail and very fast replication. A favourite system in synthetic biology. | T7 heeft een korte staart en zeer snelle vermenigvuldiging. Een geliefd systeem in de synthetische biologie. |
| `Phi-6 Phage` | Phi-6 is an RNA phage with a lipid envelope. It infects Pseudomonas. A rare membrane for a phage. | Phi-6 is een RNA-faag met een lipide envelop. Infecteert Pseudomonas. Een zeldzaam membraan voor een faag. |
| `MS2 Phage` | MS2 is a tiny tailless RNA phage. It binds male E. coli pili. Its genome was one of the first RNA genomes read. | MS2 is een piepkleine staartloze RNA-faag. Hecht aan pili van mannelijke E. coli. Zijn genoom was een van de eerste RNA-genomen die gelezen zijn. |
| `Neuro-Parasite` | A fictional pond neuro-parasite. It latches onto eukaryotes and breaks host behaviour until the host becomes a carrier. | Een fictieve vijver-neuroparasiet. Klampt zich vast aan eukaryoten en breekt het gedrag van de gastheer af tot deze drager wordt. |
| `Sexual Eukaryote` | Sexual Eukaryote is a teaching model of sexual reproduction. Two sexes, gamete fusion, not simple binary fission. | Sekse-eukaryoot is een lesmodel van seksuele voortplanting. Twee seksen, gametenversmelting, geen simpele binaire deling. |
