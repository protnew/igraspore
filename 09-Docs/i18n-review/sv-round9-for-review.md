# Пакет на проверку аналитику: sv (круг 9)

- Дата: 2026-10-31 18:17:28 UTC+3  |  Круг: 9
- input_sha256 словарей (полные — для raw<sv-analyst-round9.json):
  - `en.json` = ecc487cf85a2d180c5dbddb6c53d7e52448d44e4c5c60ccd0df2d57db6c2a9ca
  - `ru.json` = a5ca4acf4f6733c835c9a84bb2ae33aa8fa2b8db5ab544e7fac907f8abc3f4cc
  - `sv.json` = 4561a644445f028d168feeabf7457555e80fe254e67c7cecfd5d858e47aecb93
  - `wiki/sv.json` = 964592d0f8702fa588f80e9e3683b47ab408dd4e013f4eac25c408219f5da092
- Ключей UI: 436 (из них 🆕 новых после круга 4: 296 — U13 263 + U42 loc.* 9); вики-тел: 108
- Rubric 0–10 по 5 осям: смысл, глоссарий, регистр, длина, ошибки. Порог включения ≥ 8.
- Ответ аналитика: `09-Docs/i18n-review/raw/sv-analyst-round9.json` + строка в ANALYST-LEDGER.md (пишет ТОЛЬКО аналитик).

## Снимки 390×844

- снимков нет (язык выключен и не переснят)

## Словарь UI (436)

| 🆕 | ключ | ru | en | sv | где / макс. длина |
|---|---|---|---|---|---|
| 🆕 | `abt.feed` | КУСЬ | BITE | BET | общий UI / ≤60 |
| 🆕 | `abt.fly` | ПОЛЁТ | FLIGHT | FLYKT | общий UI / ≤60 |
| 🆕 | `abt.follow` | СЛЕДИТЬ | FOLLOW | FÖLJ | общий UI / ≤60 |
|  | `age` | Возраст | Age | Ålder | общий UI / ≤60 |
|  | `all` | Все | All | Alla | общий UI / ≤60 |
|  | `aquarium` | АКВАРИУМ | AQUARIUM | AKVARIUM | общий UI / ≤60 |
| 🆕 | `aria.apk` | Скачать приложение Android APK | Download Android APK app | Ladda ner Android-app (APK) | общий UI / ≤60 |
| 🆕 | `aria.aqua` | Аквариум | Aquarium | Akvarium | общий UI / ≤60 |
| 🆕 | `aria.auto` | Авто (Tab) | Auto (Tab) | Auto (Tab) | общий UI / ≤60 |
| 🆕 | `aria.cyst` | Спора (R) | Spore (R) | Spor (R) | общий UI / ≤60 |
| 🆕 | `aria.demo` | Демо | Demo | Demo | общий UI / ≤60 |
| 🆕 | `aria.divide` | Делить (Q) | Split (Q) | Dela (Q) | общий UI / ≤60 |
| 🆕 | `aria.eat` | Есть (E) | Eat (E) | Ät (E) | общий UI / ≤60 |
| 🆕 | `aria.feed` | Ручное питание (Space) | Manual feed (Space) | Mata manuellt (Mellanslag) | общий UI / ≤60 |
| 🆕 | `aria.fly` | Свободный полёт (F) | Free flight (F) | Fri flykt (F) | общий UI / ≤60 |
| 🆕 | `aria.follow2` | Следить за клеткой (V) | Follow cell (V) | Följ cell (V) | общий UI / ≤60 |
| 🆕 | `aria.help` | Как играть | How to play | Så spelar du | общий UI / ≤60 |
| 🆕 | `aria.light` | Свет | Light | Ljus | общий UI / ≤60 |
| 🆕 | `aria.micro` | Микроскоп (M) | Microscope (M) | Mikroskop (M) | общий UI / ≤60 |
| 🆕 | `aria.pause` | Пауза (P) | Pause (P) | Paus (P) | общий UI / ≤60 |
| 🆕 | `aria.render` | Режим картинки (N) | Picture mode (N) | Bildläge (N) | общий UI / ≤60 |
| 🆕 | `aria.set` | Настройки | Settings | Inställningar | общий UI / ≤60 |
| 🆕 | `aria.start` | Старт | Start | Start | общий UI / ≤60 |
| 🆕 | `aria.switches` | Игровые переключатели | Game switches | Spelbrytare | общий UI / ≤60 |
| 🆕 | `aria.wiki2` | Вики (B) | Wiki (B) | Wiki (B) | общий UI / ≤60 |
| 🆕 | `aria.zi` | Приблизить | Zoom in | Zooma in | общий UI / ≤60 |
| 🆕 | `aria.zo` | Отдалить | Zoom out | Zooma ut | общий UI / ≤60 |
| 🆕 | `auto.off` | АВТО: выкл | AUTO: off | AUTO: av | общий UI / ≤60 |
| 🆕 | `auto.on` | АВТО: вкл | AUTO: on | AUTO: på | общий UI / ≤60 |
|  | `autoOn` | АВТО | AUTO | AUTO | общий UI / ≤60 |
|  | `autoPilotOn` | АВТО-ПИЛОТ ВКЛ | AUTO ON | AUTO PÅ | общий UI / ≤60 |
|  | `bubbles` | Пузырьки | Bubbles | Bubblor | общий UI / ≤60 |
| 🆕 | `cam.fly` | Полёт: WASD / мышь / колёсико | Flight: WASD / mouse / wheel | Flykt: WASD / mus / hjul | общий UI / ≤60 |
| 🆕 | `cam.fly2` | ✈ Полёт: WASD / стрелки / мышь / колёсико | ✈ Flight: WASD / arrows / mouse / wheel | ✈ Flykt: WASD / pilar / mus / hjul | общий UI / ≤60 |
| 🆕 | `cam.flyBtn` | ✈ ПОЛЁТ WASD | ✈ FLIGHT WASD | ✈ FLYKT WASD | общий UI / ≤60 |
| 🆕 | `cam.follow` | Камера: следит за клеткой | Camera: following cell | Kamera: följer cellen | общий UI / ≤60 |
| 🆕 | `cam.followBig` | СЛЕДИТЬ | FOLLOW | FÖLJ | общий UI / ≤60 |
| 🆕 | `cam.followToast` | Камера: СЛЕДИТ | Camera: FOLLOW | Kamera: FÖLJ | общий UI / ≤60 |
| 🆕 | `cam.tip` | ✈ Полёт камеры. СЛЕДИТЬ (V) — вернуться к клетке | ✈ Camera flight. FOLLOW (V) — return to cell | ✈ Kameraflykt. FÖLJ (V) — tillbaka till cellen | общий UI / ≤60 |
|  | `camFly` | Полёт камеры | Camera flight | Kameraflykt | общий UI / ≤60 |
|  | `cartoon` | МУЛЬТ | CARTOON | TECKNAT | общий UI / ≤60 |
|  | `cartoonNow` | Сейчас: мультяшный. Клик → SwissBioPics. | Now: cartoon. Click for Swiss. | Nu: tecknat. Klicka för Swiss. | общий UI / ≤60 |
| 🆕 | `catShort.consumer1` | мелкий едок | small eater | liten ätare | категория / ≤24 |
| 🆕 | `catShort.consumer2` | средний едок | mid eater | mellanätare | категория / ≤24 |
| 🆕 | `catShort.consumer3` | крупный охотник | big hunter | stor jägare | категория / ≤24 |
| 🆕 | `catShort.decomposer` | уборщик | cleaner | renare | категория / ≤24 |
| 🆕 | `catShort.producer` | зелёные | greens | grönt | категория / ≤24 |
|  | `clear` | Ясно | Clear | Rensa | общий UI / ≤60 |
|  | `close` | ЗАКРЫТЬ | CLOSE | STÄNG | общий UI / ≤60 |
|  | `colonies` | колоний | colonies | kolonier | общий UI / ≤60 |
|  | `colonyBadge` | КОЛОНИЯ · куча клеток | COLONY · clump of cells | KOLONI · cellklump | общий UI / ≤60 |
|  | `colonyKind` | Колониальный вид | Colony species | Kolonibakterie | общий UI / ≤60 |
|  | `consumer1` | Мелкие едоки | Small eaters | Små ätare | общий UI / ≤60 |
|  | `consumer2` | Средние едоки | Mid eaters | Mellanätare | общий UI / ≤60 |
|  | `consumer3` | Крупные охотники | Big hunters | Stora jägare | общий UI / ≤60 |
|  | `currents` | Течения | Currents | Strömmar | общий UI / ≤60 |
|  | `dAge` | Старость | Old age | Ålder | общий UI / ≤60 |
|  | `dCauses` | Причины гибели | Death Causes | Dödsorsaker | общий UI / ≤60 |
|  | `dEaten` | Съедено | Eaten | Uppäten | общий UI / ≤60 |
|  | `dLysis` | Лизис | Lysis | Lys | общий UI / ≤60 |
|  | `dStarve` | Голод | Starved | Svulten | общий UI / ≤60 |
|  | `dTemp` | Температура | Temp | Temp | общий UI / ≤60 |
| 🆕 | `dTip.age` | Совет: Старость неизбежна. Важно успеть разделиться до гибели. | Tip: Old age is inevitable. Divide before you die. | Tips: Ålder oundvikligt. Dela dig innan du dör. | общий UI / ≤60 |
| 🆕 | `dTip.eaten` | Совет: Избегайте хищников, используйте Режим везения для бегства. | Tip: Avoid predators, use Grace Period to run away. | Tips: Undvik rovdjur, använd skyddstiden för att fly. | общий UI / ≤60 |
| 🆕 | `dTip.lysis` | Совет: Лизис (разрыв мембраны) вызывает вирус. Держитесь от них подальше. | Tip: Lysis is caused by viruses. Stay away from them. | Tips: Lys orsakas av virus. Håll dig borta från dem. | общий UI / ≤60 |
| 🆕 | `dTip.starve` | Совет: Чаще питайтесь, держитесь ближе к скоплениям еды или ускорьте свой вид. | Tip: Eat more often, stay near food clusters, or mutate speed. | Tips: Ät oftare, håll dig nära mat, eller mutera hastighet. | общий UI / ≤60 |
| 🆕 | `dTip.temp` | Совет: Следите за термометром. Мутируйте температурный диапазон. | Tip: Watch the thermometer. Mutate your temp range. | Tips: Håll koll på termometern. Mutera ditt temperaturspann. | общий UI / ≤60 |
|  | `days` | Дней | Days | Dagar | общий UI / ≤60 |
|  | `dead` | ВЫМИРАНИЕ | EXTINCT | UTDÖD | общий UI / ≤60 |
|  | `decomposer` | Уборщики (грибки) | Cleaners (fungi) | Renare (svampar) | общий UI / ≤60 |
|  | `demo` | ДЕМО / Галерея | DEMO / Gallery | DEMO / Galleri | общий UI / ≤60 |
| 🆕 | `demo.colony` | ⬡КОЛОНИЯ  | ⬡COLONY  | ⬡KOLONI  | демо / ≤60 |
| 🆕 | `demo.grp.consumer1` | 2. Консументы I | 2. Consumers I | 2. Konsumenter I | демо / ≤60 |
| 🆕 | `demo.grp.consumer2` | 3. Консументы II | 3. Consumers II | 3. Konsumenter II | демо / ≤60 |
| 🆕 | `demo.grp.consumer3` | 4. Консументы III | 4. Consumers III | 4. Konsumenter III | демо / ≤60 |
| 🆕 | `demo.grp.decomposer` | 5. Редуценты | 5. Decomposers | 5. Nedbrytare | демо / ≤60 |
| 🆕 | `demo.grp.producer` | 1. Продуценты | 1. Producers | 1. Producenter | демо / ≤60 |
| 🆕 | `demo.grp.virus` | 6. Вирусы | 6. Viruses | 6. Virus | демо / ≤60 |
| 🆕 | `demo.labels` | Метки | Labels | Etiketter | демо / ≤60 |
| 🆕 | `demo.tip` | <b>ДЕМО</b> · WASD/мышь — полёт · 1-6 группа · клик = вселиться<br> | <b>DEMO</b> · WASD/mouse fly · 1-6 jump group · click = possess<br> | <b>DEMO</b> · WASD/mus flyger · 1-6 hoppa grupp · klick = ta över<br> | демо / ≤60 |
|  | `density` | Плотность | Density | Täthet | общий UI / ≤60 |
|  | `diffE` | Лёгкий | Easy | Lätt | общий UI / ≤60 |
|  | `diffH` | Сложный | Hard | Svår | общий UI / ≤60 |
|  | `diffN` | Обычный | Normal | Normal | общий UI / ≤60 |
|  | `divRate` | Размножение | Reproduction | Fortplantning | общий UI / ≤60 |
|  | `divs` | Делений | Divisions | Delningar | общий UI / ≤60 |
| 🆕 | `dna.bad` | Неверная строка ДНК! | Invalid DNA String! | Ogiltig DNA-kod! | общий UI / ≤60 |
| 🆕 | `dna.export` | Экспорт моего ДНК | Export My DNA | Exportera mitt DNA | общий UI / ≤60 |
| 🆕 | `dna.import` | Импорт ДНК | Import DNA | Importera DNA | общий UI / ≤60 |
| 🆕 | `dna.io` | Импорт/Экспорт ДНК | Import/Export DNA | Importera/exportera DNA | общий UI / ≤60 |
| 🆕 | `dna.ok` | ДНК импортирована! | DNA Imported Successfully! | DNA importerat! | общий UI / ≤60 |
| 🆕 | `dna.pastePh` | Вставь код ДНК… | Paste DNA code here... | Klistra in DNA-kod här... | общий UI / ≤60 |
|  | `dnaPoints` | Очки мутации: | Mutation points: | Mutationspoäng: | общий UI / ≤60 |
|  | `dnaShell` | Кремниевый панцирь (20 ДНК) | Silica shell (20 DNA) | Kiselskal (20 DNA) | общий UI / ≤60 |
|  | `dnaSize` | Увеличение массы (8 ДНК) | More mass (8 DNA) | Mer massa (8 DNA) | общий UI / ≤60 |
|  | `dnaSpeed` | Ускорение жгутиков (5 ДНК) | Faster flagella (5 DNA) | Snabbare flageller (5 DNA) | общий UI / ≤60 |
|  | `dnaSpikes` | Отрастить шипы (15 ДНК) | Grow spikes (15 DNA) | Odla taggar (15 DNA) | общий UI / ≤60 |
|  | `dnaTitle` | Мутации ДНК | DNA mutations | DNA-mutationer | общий UI / ≤60 |
|  | `eaten` | Съедено | Eaten | Uppäten | общий UI / ≤60 |
|  | `eats` | ест | eats | äter | общий UI / ≤60 |
|  | `eatsDead` | ест мёртвое | eats dead matter | äter dött material | общий UI / ≤60 |
|  | `eatsLight` | ест свет | eats light | äter ljus | общий UI / ≤60 |
| 🆕 | `edu.anatomy` | Анатомия | Anatomy | Anatomi | анатомия / ≤120 |
| 🆕 | `edu.cell` | клетка | cell | cell | анатомия / ≤120 |
| 🆕 | `edu.chloro.desc` | Фотосинтез: свет + CO₂ + H₂O → сахар + O₂. Зелёный из‑за хлорофилла. Есть у водорослей и растений. | Photosynthesis: light + CO₂ + H₂O → sugar + O₂. Green from chlorophyll. Found in algae and plants. | Fotosyntes: ljus + CO₂ + H₂O → socker + O₂. Grönt av klorofyll. Finns i alger och växter. | анатомия / ≤120 |
| 🆕 | `edu.chloro.name` | Хлоропласт | Chloroplast | Kloroplast | анатомия / ≤120 |
| 🆕 | `edu.cilia.desc` | Короткие подвижные выросты. Создают ток воды: движение + фильтр-питание (затягивают бактерий и водоросли ко рту). | Short moving hairs. Create water currents: movement + filter feeding (pull bacteria and algae to the mouth). | Korta rörliga hår. Skapar vattenströmmar: rörelse + filtermatning (drar bakterier och alger till munnen). | анатомия / ≤120 |
| 🆕 | `edu.cilia.name` | Реснички | Cilia | Cilier | анатомия / ≤120 |
| 🆕 | `edu.cyto.desc` | Внутренняя среда клетки: вода, белки, органеллы. Здесь идут тысячи биохимических реакций. | The cell's inner medium: water, proteins, organelles. Thousands of biochemical reactions run here. | Cellens inre medium: vatten, proteiner, organeller. Tusentals biokemiska reaktioner sker här. | анатомия / ≤120 |
| 🆕 | `edu.cyto.name` | Цитоплазма | Cytoplasm | Cytoplasma | анатомия / ≤120 |
| 🆕 | `edu.flagella.desc` | Длинный «мотор» для плавания. Вращается или изгибается — клетка плывёт к пище или от опасности (хемотаксис). | Long swimming motor. Rotates or bends — the cell swims to food or away from danger (chemotaxis). | Lång simmotor. Roterar eller böjs — cellen simmar till mat eller bort från fara (kemotaxis). | анатомия / ≤120 |
| 🆕 | `edu.flagella.name` | Жгутик | Flagellum | Flagell | анатомия / ≤120 |
| 🆕 | `edu.hoverHint` | Наведи на точку внутри клетки — название и роль органа | Hover a dot inside the cell — organelle name and role | Hovra över en prick i cellen — organellens namn och roll | анатомия / ≤120 |
| 🆕 | `edu.membrane.desc` | Тонкая оболочка из липидов. Контролирует, что входит и выходит. У всех клеток есть мембрана. | Thin lipid envelope. Controls what goes in and out. Every cell has a membrane. | Tunt lipidhölje. Styr vad som kommer in och ut. Varje cell har ett membran. | анатомия / ≤120 |
| 🆕 | `edu.membrane.name` | Мембрана | Membrane | Membran | анатомия / ≤120 |
| 🆕 | `edu.mito.desc` | «Электростанция» клетки. Дыхание: сахар + O₂ → ATP (энергия). Своя ДНК — остаток древней бактерии. | Power plant of the cell. Respiration: sugar + O₂ → ATP (energy). Has its own DNA — remnant of an ancient bacterium. | Cellens kraftverk. Andning: socker + O₂ → ATP (energi). Har eget DNA — rest av en uråldrig bakterie. | анатомия / ≤120 |
| 🆕 | `edu.mito.name` | Митохондрия | Mitochondrion | Mitokondrie | анатомия / ≤120 |
| 🆕 | `edu.nucleoid.desc` | Зона с кольцевой ДНК у прокариот. Нет ядерной оболочки — геном свободно в цитоплазме. | Region with circular DNA in prokaryotes. No nuclear envelope — the genome floats freely in the cytoplasm. | Område med cirkulärt DNA hos prokaryoter. Ingen kärnmembran — genomet flyter fritt i cytoplasman. | анатомия / ≤120 |
| 🆕 | `edu.nucleoid.name` | Нуклеоид | Nucleoid | Nukleoid | анатомия / ≤120 |
| 🆕 | `edu.nucleus.desc` | Хранит ДНК. Управляет ростом, делением и синтезом белков. У бактерий настоящего ядра нет — ДНК в нуклеоиде. | Stores DNA. Controls growth, division and protein synthesis. Bacteria have no true nucleus — DNA sits in the nucleoid. | Lagrar DNA. Styr tillväxt, delning och proteinsyntes. Bakterier saknar äkta kärna — DNA ligger i nukleoiden. | анатомия / ≤120 |
| 🆕 | `edu.nucleus.name` | Ядро | Nucleus | Cellkärna | анатомия / ≤120 |
| 🆕 | `edu.oral.desc` | У инфузорий — желобок, куда реснички сгоняют добычу. Отсюда пища попадает в пищеварительную вакуоль. | In ciliates — a groove where cilia sweep prey. Food enters the digestive vacuole from here. | Hos ciliater — en fåra där cilier sveper in byten. Mat går härifrån till matsmältningsvakuolen. | анатомия / ≤120 |
| 🆕 | `edu.oral.name` | Ротовая воронка | Oral groove | Munfåra | анатомия / ≤120 |
| 🆕 | `edu.vacuole.desc` | Пузырёк с водой, запасными веществами или пищеварительными ферментами. У инфузорий — пищеварительные и сократительные вакуоли. | Vesicle with water, reserves or digestive enzymes. Ciliates have digestive and contractile vacuoles. | Blåsa med vatten, reserv eller enzymer. Ciliater har matsmältnings- och sammandragande vakuoler. | анатомия / ≤120 |
| 🆕 | `edu.vacuole.name` | Вакуоль | Vacuole | Vakuol | анатомия / ≤120 |
| 🆕 | `edu.wall.desc` | Жёсткий каркас снаружи мембраны (пептидогликан у бактерий, целлюлоза у растений). Защита и форма. | Rigid frame outside the membrane (peptidoglycan in bacteria, cellulose in plants). Protection and shape. | Stiv ram utanför membranet (peptidoglykan hos bakterier, cellulosa hos växter). Skydd och form. | анатомия / ≤120 |
| 🆕 | `edu.wall.name` | Клеточная стенка | Cell wall | Cellvägg | анатомия / ≤120 |
|  | `energy` | Энергия | Energy | Energi | общий UI / ≤60 |
| 🆕 | `ev.acid_rain` | Кислотный дождь | Acid rain | Surt regn | событие / ≤60 |
| 🆕 | `ev.eclipse` | Солнечное затмение | Solar eclipse | Solförmörkelse | событие / ≤60 |
| 🆕 | `ev.ended` | {name} закончился | {name} ended | {name} slutade | событие / ≤60 |
| 🆕 | `ev.warn` | ВНИМАНИЕ: {name}! | WARNING: {name}! | VARNING: {name}! | событие / ≤60 |
|  | `exit` | Выход | Exit | Avsluta | общий UI / ≤60 |
| 🆕 | `fc.consumer1` | грызут зелёных | nibble greens | nibbla grönt | общий UI / ≤60 |
| 🆕 | `fc.consumer2` | фильтруют мелочь | filter small ones | filtrera små | общий UI / ≤60 |
| 🆕 | `fc.consumer3` | едят всех | eat everyone | ät alla | общий UI / ≤60 |
| 🆕 | `fc.decomposer` | убирают мёртвое | clean up dead | städa dött | общий UI / ≤60 |
| 🆕 | `fc.producer` | делают еду из света | make food from light | gör mat av ljus | общий UI / ≤60 |
| 🆕 | `fc.schema` | (схема) | (schematic) | (schema) | общий UI / ≤60 |
|  | `filter` | Фильтр | Filter | Filter | общий UI / ≤60 |
|  | `filterHint` | нажми другую кнопку чтобы сменить | tap another button to switch | tryck på en annan knapp för att växla | общий UI / ≤60 |
|  | `flight` | Полёт | Flight | Flykt | общий UI / ≤60 |
|  | `follow` | Следить | Follow | Följ | общий UI / ≤60 |
| 🆕 | `food.decomposer` | мёртвые остатки | dead matter | dött material | питание / ≤60 |
| 🆕 | `food.producer` | свет + вода + минералы | light + water + minerals | ljus + vatten + mineraler | питание / ≤60 |
|  | `fps` | FPS | FPS | FPS | общий UI / ≤60 |
|  | `freeCam` | Своб. камера | Free Cam | Fri kamera | общий UI / ≤60 |
|  | `gameTime` | Время | Time | Tid | общий UI / ≤60 |
|  | `healthBars` | Шкалы здоровья | Health Bars | Hälsobalkar | общий UI / ≤60 |
|  | `help` | КАК ИГРАТЬ | HOW TO PLAY | SÅ SPELAR DU | общий UI / ≤60 |
| 🆕 | `help.body` | <p><b style="color:#4df">Управление:</b> WASD — плавать. Пробел = укус. ЛКМ — плыть к курсору.</p><p><b style="color:#8f8">Кто кого ест:</b></p><p>🌱 Зелёные едят свет. 🔵 Мелкие едоки едят зелёных. 🟠 Средние фильтруют бактерий и зелёных. 🟣 Крупные охотники едят зелёных, бактерий и средних — и могут кусать чуть более крупных.</p><p><b style="color:#4df">Камера:</b> F свободная камера, V к клетке. Колесо = зум.</p><p><b style="color:#4df">Деление:</b> Ешь, расти, делись. Q — вручную.</p> | <p><b style="color:#4df">Controls:</b> WASD swim. Space = bite. LMB = swim to cursor.</p><p><b style="color:#8f8">Who eats whom:</b></p><p>🌱 Greens eat light. 🔵 Small eaters eat greens. 🟠 Mid eaters filter bacteria+greens. 🟣 Big hunters eat greens, bacteria and mid-eaters — and can bite slightly larger prey.</p><p><b style="color:#4df">Camera:</b> F free cam, V back to cell. Wheel = zoom.</p><p><b style="color:#4df">Division:</b> Eat, grow, split. Q = manual.</p> | <p><b style="color:#4df">Kontroller:</b> WASD simma. Mellanslag = bit. VMB = sim till muspekaren.</p><p><b style="color:#8f8">Vem äter vem:</b></p><p>🌱 Grönt äter ljus. 🔵 Små ätare äter grönt. 🟠 Mellanätare filtrerar bakterier+grönt. 🟣 Stora jägare äter grönt, bakterier och mellanätare — och kan bita lite större byte.</p><p><b style="color:#4df">Kamera:</b> F fri kamera, V tillbaka till cellen. Hjul = zoom.</p><p><b style="color:#4df">Delning:</b> Ät, väx, dela. Q = manuell.</p> | помощь / ≤200 |
|  | `hud.btn.auto` | АВТО | AUTO | AUTO | HUD кнопка / ≤14 |
|  | `hud.btn.auto.short` | АВТО | AUTO | AUTO | HUD кнопка (короткая) / ≤8 |
|  | `hud.btn.cyst` | СПОРА | SPORE | SPOR | HUD кнопка / ≤14 |
|  | `hud.btn.cyst.short` | СПОРА | SPORE | SPOR | HUD кнопка (короткая) / ≤8 |
|  | `hud.btn.divide` | ДЕЛИТЬ | DIVIDE | DELA | HUD кнопка / ≤14 |
|  | `hud.btn.divide.short` | ДЕЛИТЬ | DIVIDE | DELA | HUD кнопка (короткая) / ≤8 |
|  | `hud.btn.eat` | ЕСТЬ | EAT | ÄT | HUD кнопка / ≤14 |
|  | `hud.btn.eat.short` | ЕСТЬ | EAT | ÄT | HUD кнопка (короткая) / ≤8 |
|  | `hud.btn.light` | СВЕТ | LIGHT | LJUS | HUD кнопка / ≤14 |
|  | `hud.btn.light.short` | СВЕТ | LIGHT | LJUS | HUD кнопка (короткая) / ≤8 |
|  | `hud.btn.menu` | Меню | Menu | Meny | HUD кнопка / ≤14 |
|  | `hud.divide.reason.age` | слишком молода | too young | för ung | HUD / ≤40 |
|  | `hud.divide.reason.busy` | идёт деление | dividing | delar | HUD / ≤40 |
|  | `hud.divide.reason.cd` | перезарядка {sec} с | cooldown {sec} s | återhämtning {sec} s | HUD / ≤40 |
|  | `hud.divide.reason.energy` | энергия {cur}/{need} | energy {cur}/{need} | energi {cur}/{need} | HUD / ≤40 |
|  | `hud.divide.reason.mass` | масса {cur}/{need} | mass {cur}/{need} | massa {cur}/{need} | HUD / ≤40 |
|  | `hud.divide.reason.none` | нет клетки | no cell | ingen cell | HUD / ≤40 |
|  | `hud.divide.reason.size` | размер {cur}/{need} | size {cur}/{need} | storlek {cur}/{need} | HUD / ≤40 |
| 🆕 | `hud.genSep` |  · Gen  |  · Gen  |  · Gen  | HUD / ≤40 |
|  | `hud.goal` | Поделись: {cur}/{need} | Divide: {cur}/{need} | Dela: {cur}/{need} | HUD / ≤40 |
| 🆕 | `kh.hide` | Свернуть | Hide keys | Göm tangenter | общий UI / ≤60 |
| 🆕 | `kh.keys` | Клавиши | Keys | Tangenter | общий UI / ≤60 |
| 🆕 | `lb.title` | 🏆 Таблица лидеров | 🏆 Leaderboard | 🏆 Topp lista | общий UI / ≤60 |
| 🆕 | `leg.apex` | Крупные охотники | Apex hunters | Topprovdjur | общий UI / ≤60 |
| 🆕 | `leg.bacteria` | Бактерии | Bacteria | Bakterier | общий UI / ≤60 |
| 🆕 | `leg.decomp` | редуценти | Decomposers | Nedbrytare | общий UI / ≤60 |
| 🆕 | `leg.large` | Крупные | Large | Stor | общий UI / ≤60 |
| 🆕 | `leg.producer` | Водоросли | Algae | Alger | общий UI / ≤60 |
| 🆕 | `leg.virus` | Вирусы | Viruses | Virus | общий UI / ≤60 |
|  | `legend` | Легенда | Legend | Teckenförklaring | общий UI / ≤60 |
|  | `light` | Свет | Light | Ljus | общий UI / ≤60 |
|  | `lightInt` | Инт. света | Light Intensity | Ljusintensitet | общий UI / ≤60 |
|  | `map` | Карта | Map | Karta | общий UI / ≤60 |
|  | `mapChart` | Карта и график | Map and chart | Karta och diagram | общий UI / ≤60 |
|  | `mapTip` | Миникарта — где вы в пруду. Клик = прыжок камеры. | Minimap: where you are in the pond. Click jumps the camera. | Minikarta: var du är i dammen. Klick flyttar kameran. | общий UI / ≤60 |
|  | `massWord` | Масса | Mass | Massa | общий UI / ≤60 |
|  | `maxPop` | Макс. поп | Max Pop | Max pop | общий UI / ≤60 |
|  | `menu` | В МЕНЮ | MENU | MENY | общий UI / ≤60 |
|  | `menuSub` | Симуляция микроорганизмов — {n} видов + вирусы. Разрез водоёма сбоку. | Microorganism Simulation — {n} species + viruses. Pond cross-section view. | Mikroorganism-simulering — {n} arter + virus. Sidovy av en damm. | общий UI / ≤60 |
| 🆕 | `mic.scope` | МИКРОСКОП × | MICROSCOPE × | MIKROSKOP × | микроскоп / ≤30 |
|  | `microscope` | Микроскоп | Microscope | Mikroskop | общий UI / ≤60 |
|  | `midEaterTip` | Средний едок: подплыви к зелёным/бактериям — реснички фильтруют сами. | Mid eater: swim to greens or bacteria. Cilia filter on their own. | Mellanätare: simma till grönt eller bakterier. Cilier filtrerar av sig själva. | общий UI / ≤60 |
| 🆕 | `mob.eSep` |  · E= |  · E= |  · E= | моб. UI / ≤30 |
| 🆕 | `mob.infected` |  · 🦠 заражён |  · 🦠 infected |  · 🦠 infekterad | моб. UI / ≤30 |
| 🆕 | `mob.you` |  · ВЫ |  · YOU |  · DU | моб. UI / ≤30 |
| 🆕 | `mode.swissLbl` | 📗 SWISS | 📗 SWISS | 📗 SWISS | общий UI / ≤60 |
| 🆕 | `mode.webglLbl` | 🌊 WEBGL | 🌊 WEBGL | 🌊 WEBGL | общий UI / ≤60 |
| 🆕 | `modeBig.cartoon` | 🎨 МУЛЬТЯШНЫЙ | 🎨 CARTOON | 🎨 TECKNAT | общий UI / ≤60 |
| 🆕 | `modeBig.swiss` | 📗 SWISSBIOPICS | 📗 SWISSBIOPICS | 📗 SWISSBIOPICS | общий UI / ≤60 |
| 🆕 | `modeBig.webgl` | 🌊 WEBGL | 🌊 WEBGL | 🌊 WEBGL | общий UI / ≤60 |
| 🆕 | `modeLbl.cartoon` | 🎨 Мультяшный | 🎨 Cartoon | 🎨 Tecknat | общий UI / ≤60 |
| 🆕 | `modeLbl.swiss` | 📗 SwissBioPics | 📗 SwissBioPics | 📗 SwissBioPics | общий UI / ≤60 |
| 🆕 | `modeLbl.webgl` | 🌊 WebGL | 🌊 WebGL | 🌊 WebGL | общий UI / ≤60 |
|  | `next` | Далее | Next | Nästa | общий UI / ≤60 |
|  | `noSpecies` | Нет видов в категории «{cat}». Нажмите «Все». | No species in "{cat}". Tap All. | Inga arter i "{cat}". Tryck på Alla. | общий UI / ≤60 |
|  | `offspring` | Потомков | Offspring | Avkommor | общий UI / ≤60 |
|  | `particles` | Частицы | Particles | Partiklar | общий UI / ≤60 |
|  | `paused` | ПАУЗА | PAUSED | PAUSAD | общий UI / ≤60 |
|  | `picMode` | Режим картинки | Picture mode | Bildläge | общий UI / ≤60 |
|  | `play` | Играть | Play | Spela | общий UI / ≤60 |
|  | `poolWill` | В водоёме будет: ~{n} организмов · {kinds} видов | Pool will have: ~{n} organisms · {kinds} species | I dammen: ~{n} organismer · {kinds} arter | общий UI / ≤60 |
|  | `pop` | Поп-ция | Pop | Pop | общий UI / ≤60 |
|  | `popTip` | График популяции — сколько микробов во времени. | Population chart: how many microbes over time. | Befolkningsdiagram: hur många mikrober över tid. | общий UI / ≤60 |
|  | `predation` | Хищники | Predators | Rovdjur | общий UI / ≤60 |
|  | `producer` | Зелёные (корм) | Greens (food) | Grönt (mat) | общий UI / ≤60 |
|  | `rainy` | Дождь | Rain | Regn | общий UI / ≤60 |
|  | `ready` | ГОТОВО | READY | KLAR | общий UI / ≤60 |
|  | `restart` | ЗАНОВО | RESTART | OMSTART | общий UI / ≤60 |
|  | `resume` | ПРОДОЛЖИТЬ | RESUME | FORTSÄTT | общий UI / ≤60 |
| 🆕 | `role.consumer1` | Мелкие едоки (бактерии). Кусают зелёных. Сами — еда для средних и крупных. | Small eaters (bacteria). Nibble greens. Food for mid and big eaters. | Små ätare (bakterier). Nibblar grönt. Mat för mellan- och stora ätare. | карточка роли / ≤80 |
| 🆕 | `role.consumer2` | Средние едоки (инфузории). Фильтруют воду: затягивают бактерий и зелёных. Не кидаются на гигантов. | Mid eaters (ciliates). Filter water: pull in bacteria and greens. Do not tackle giants. | Mellanätare (ciliater). Filtrerar vatten: drar in bakterier och grönt. Ge dig inte på jättar. | карточка роли / ≤80 |
| 🆕 | `role.consumer3` | Крупные охотники. Едят зелёных, бактерий и средних. Могут кусать и тех, кто чуть крупнее — но это рискованно. Без еды живут долго, но голод всё равно опасен. | Big hunters. Eat greens, bacteria and mid-eaters. Can bite slightly larger prey — risky. Live long without food, but hunger still kills. | Stora jägare. Äter grönt, bakterier och mellanätare. Kan bita lite större byte — riskabelt. Lever länge utan mat, men svulten dödar. | карточка роли / ≤80 |
| 🆕 | `role.decomposer` | Уборщики. Разлагают мёртвое — не охотятся на живых. | Cleaners. Break down the dead — do not hunt the living. | Renare. Bryter ner de döda — jagar inte levande. | карточка роли / ≤80 |
| 🆕 | `role.macrophage` | Стражи. Атакуют больных и опасных — «иммунитет» пруда. | Guards. Attack sick/dangerous cells — the pond immune system. | Vakter. Angriper sjuka/farliga celler — dammens immunförsvar. | карточка роли / ≤80 |
| 🆕 | `role.producer` | Зелёные. Не охотятся. Едят свет и воду — как крошечные растения. Кормят всех остальных. | Greens. No hunting. They eat light and water — tiny plants. Feed everyone else. | Grönt. Ingen jakt. Äter ljus och vatten — små växter. Matar alla andra. | карточка роли / ≤80 |
|  | `roleFood` | Еда | Food | Mat | карточка роли / ≤80 |
|  | `roleHint` | Подсказка: еда подсвечена цветным кольцом. Полоска «Запах еды» справа вверху. | Hint: food is marked with a colored ring. The food-scent bar is at the top right. | Tips: mat markeras med en färgad ring. Matoft-balken finns uppe till höger. | карточка роли / ≤80 |
|  | `roleOk` | Понятно — плыву | Got it — I'll swim | Uppfattat — jag simmar | карточка роли / ≤80 |
|  | `roleWho` | Ты кто / кого ешь | Who you are / what you eat | Vem du är / vad du äter | карточка роли / ≤80 |
|  | `season0` | Весна | Spring | Vår | общий UI / ≤60 |
|  | `season1` | Лето | Summer | Sommar | общий UI / ≤60 |
|  | `season2` | Осень | Autumn | Höst | общий UI / ≤60 |
|  | `season3` | Зима | Winter | Vinter | общий UI / ≤60 |
|  | `selectSp` | Выберите организм | Select organism | Välj organism | общий UI / ≤60 |
|  | `set` | НАСТРОЙКИ | SETTINGS | INSTÄLLNINGAR | настройки / ≤40 |
|  | `settingsT` | Настройки | Settings | Inställningar | настройки / ≤40 |
|  | `shadows` | Тени | Shadows | Skuggor | общий UI / ≤60 |
|  | `shown` | показано | shown | visade | общий UI / ≤60 |
|  | `simSpeed` | Скорость | Speed | Hastighet | общий UI / ≤60 |
|  | `skip` | Пропустить | Skip | Hoppa över | общий UI / ≤60 |
| 🆕 | `sp.1000` | Губка (фильтратор) | Sponge (Filter Feeder) | Svamp (filterätare) | имя вида / ≤40 |
| 🆕 | `sp.1001` | Половая эукариота | Sexual Eukaryote | Sexuell eukaryot | имя вида / ≤40 |
| 🆕 | `sp.999` | Макрофаг (Иммунитет) | Macrophage (Immunity) | Makrofag (immunförsvar) | имя вида / ≤40 |
| 🆕 | `spcard.virus` | Вирус | Virus | Virus | общий UI / ≤60 |
|  | `speciesWord` | видов | species | arter | общий UI / ≤60 |
| 🆕 | `star.alphacentauri` | ★ Альфа Центавра A+B | ★ Alpha Centauri A+B | ★ Alpha Centauri A+B | звезда / ≤40 |
| 🆕 | `star.antares` | ★ Антарес | ★ Antares | ★ Antares | звезда / ≤40 |
| 🆕 | `star.betelgeuse` | ★ Бетельгейзе | ★ Betelgeuse | ★ Betelgeuse | звезда / ≤40 |
| 🆕 | `star.binary` | ★ Двойная (синяя+оранжевая) | ★ Binary (blue+orange) | ★ Dubbel (blå+orange) | звезда / ≤40 |
| 🆕 | `star.dwarf` | ★ Красный карлик | ★ Red dwarf | ★ Röd dvärg | звезда / ≤40 |
| 🆕 | `star.flare` | ★ Вспышечная (UV Ceti) | ★ Flare star (UV Ceti) | ★ Flare-stjärna (UV Ceti) | звезда / ≤40 |
| 🆕 | `star.giant` | ★ Оранжевый гигант | ★ Orange giant | ★ Orange jätte | звезда / ≤40 |
| 🆕 | `star.polaris` | ★ Полярная | ★ Polaris | ★ Polstjärnan | звезда / ≤40 |
| 🆕 | `star.pulsar` | ★ Нейтронная (пульсар) | ★ Neutron (pulsar) | ★ Neutron (pulsar) | звезда / ≤40 |
| 🆕 | `star.quadruple` | ★★★★ Четверная | ★★★★ Quadruple | ★★★★ Fyrdubbel | звезда / ≤40 |
| 🆕 | `star.rigel` | ★ Ригель | ★ Rigel | ★ Rigel | звезда / ≤40 |
| 🆕 | `star.sirius` | ★ Сириус A+B | ★ Sirius A+B | ★ Sirius A+B | звезда / ≤40 |
| 🆕 | `star.sol` | ☀ Солнце | ☀ Sun | ☀ Solen | звезда / ≤40 |
| 🆕 | `star.trinary` | ★★★ Тройная | ★★★ Triple | ★★★ Tredubbel | звезда / ≤40 |
| 🆕 | `star.twin` | ★★ Близнецы | ★★ Twins | ★★ Tvilling | звезда / ≤40 |
| 🆕 | `star.vega` | ★ Вега | ★ Vega | ★ Vega | звезда / ≤40 |
| 🆕 | `starg.alphacentauri` | ★ α Центавра | ★ α Centauri | ★ α Centauri | звезда / ≤40 |
| 🆕 | `starg.sirius` | ★ Сириус | ★ Sirius | ★ Sirius | звезда / ≤40 |
|  | `start` | НАЧАТЬ | START | START | общий UI / ≤60 |
|  | `swissNow` | Сейчас: SwissBioPics. Клик → WebGL. | Now: Swiss. Click for WebGL. | Nu: Swiss. Klicka för WebGL. | общий UI / ≤60 |
|  | `temp` | Т° | Temp | Temp | общий UI / ≤60 |
| 🆕 | `tip.ageBar` | Возраст существа. Старые клетки теряют энергию быстрее. | Creature age. Old cells lose energy faster. | Varelsens ålder. Gamla celler tappar energi snabbare. | общий UI / ≤60 |
| 🆕 | `tip.auto` | Авто | Auto | Auto | общий UI / ≤60 |
| 🆕 | `tip.cartoon` | Мультяшный. Клик → SwissBioPics | Cartoon. Click -> SwissBioPics | Tecknat. Klicka -> SwissBioPics | общий UI / ≤60 |
| 🆕 | `tip.cbFilter` | Фильтр организмов. Нажмите, чтобы показать только этот вид в меню. | Organism filter. Click to show only this species in the menu. | Organismfilter. Klicka för att bara visa denna art i menyn. | общий UI / ≤60 |
| 🆕 | `tip.cyst` | Спора | Spore | Spor | общий UI / ≤60 |
| 🆕 | `tip.daysL` | Игровые дни. Смена сезонов влияет на температуру. | Game days. Season changes affect temperature. | Speldagar. Årstidsväxlingar påverkar temperaturen. | общий UI / ≤60 |
| 🆕 | `tip.divide` | Делить | Split | Dela | общий UI / ≤60 |
| 🆕 | `tip.eat` | Есть | Eat | Ät | общий UI / ≤60 |
| 🆕 | `tip.energyBar` | Энергия существа. Падает со временем. Если дойдет до нуля — смерть от голода. | Creature energy. Drops over time. At zero — death by starvation. | Varelsens energi. Sjunker med tiden. På noll — död av svult. | общий UI / ≤60 |
| 🆕 | `tip.feed` | Ручное питание | Manual feed | Mata manuellt | общий UI / ≤60 |
| 🆕 | `tip.fly` | Свободный полёт: F или WASD / мышь | Free flight: F or WASD / mouse | Fri flykt: F eller WASD / mus | общий UI / ≤60 |
| 🆕 | `tip.follow` | Следить | Follow | Följ | общий UI / ≤60 |
| 🆕 | `tip.fpsL` | Кадры в секунду (FPS). Показывает производительность игры. | Frames per second (FPS). Shows game performance. | Bilder per sekund (FPS). Visar spelets prestanda. | общий UI / ≤60 |
| 🆕 | `tip.lang` | Выбор языка | Language selector | Språkväljare | общий UI / ≤60 |
| 🆕 | `tip.lightL` | Уровень освещенности. Важен для фотосинтеза водорослей. | Light level. Important for algae photosynthesis. | Ljusnivå. Viktigt för algernas fotosyntes. | общий UI / ≤60 |
| 🆕 | `tip.microMode` | Режим микроскопа | Microscope Mode | Mikroskopläge | общий UI / ≤60 |
| 🆕 | `tip.pause` | Пауза | Pause | Paus | общий UI / ≤60 |
| 🆕 | `tip.popC` | График популяции. Показывает историю рождений и смертей. | Population chart. Shows birth and death history. | Befolkningsdiagram. Visar födelse- och dödshistorik. | общий UI / ≤60 |
| 🆕 | `tip.render` | Картинка: мульт / Swiss | Picture: cartoon / Swiss | Bild: tecknat / Swiss | общий UI / ≤60 |
| 🆕 | `tip.starSel` | Выбор звезды/солнца | Select star/sun | Välj stjärna/sol | общий UI / ≤60 |
| 🆕 | `tip.swiss` | SwissBioPics. Клик → WebGL | SwissBioPics. Click -> WebGL | SwissBioPics. Klicka -> WebGL | общий UI / ≤60 |
| 🆕 | `tip.tempL` | Температура воды. Влияет на метаболизм и выживание. | Water temperature. Affects metabolism and survival. | Vattentemperatur. Påverkar ämnesomsättning och överlevnad. | общий UI / ≤60 |
| 🆕 | `tip.webgl` | WebGL-вода. Клик → мультяшный | WebGL water. Click -> cartoon | WebGL-vatten. Klicka -> tecknat | общий UI / ≤60 |
| 🆕 | `tip.wikiB` | Вики/Бестиарий | Wiki/Bestiary | Wiki/Bestiarium | общий UI / ≤60 |
| 🆕 | `tip.zi` | Zoom+ | Zoom+ | Zoom+ | общий UI / ≤60 |
| 🆕 | `tip.zo` | Zoom- | Zoom- | Zoom- | общий UI / ≤60 |
| 🆕 | `toast.auto.eat` | АВТО: съел | AUTO: ate | AUTO: åt | тост / ≤60 |
| 🆕 | `toast.auto.gain` | АВТО: +{e} энергия | AUTO: +{e} energy | AUTO: +{e} energi | тост / ≤60 |
| 🆕 | `toast.bite` | КУСЬ! {name} | BITE! {name} | BET! {name} | тост / ≤60 |
| 🆕 | `toast.biteBig` | Откусил кусок — крупная добыча! | Bit off a chunk — big prey! | Bet av en bit — stort byte! | тост / ≤60 |
| 🆕 | `toast.biteGain` | Укус +{e} эн / +{m} м | Bite +{e} en / +{m} m | Bet +{e} en / +{m} m | тост / ≤60 |
| 🆕 | `toast.cilia.filter` | Реснички: фильтр-питание | Cilia: filter feeding | Cilier: filtermatning | тост / ≤60 |
| 🆕 | `toast.controls` | Управление: WASD / мышь · ЕСТЬ (E) · ДЕЛИТЬ (Q) | Controls: WASD / mouse · EAT (E) · DIVIDE (Q) | Kontroller: WASD / mus · ÄT (E) · DELA (Q) | тост / ≤60 |
|  | `toast.cyst.enter` | Спора: защита, движение 0, энергия тратится медленно | Spore: protected, speed 0, energy drains slowly | Spor: skyddad, hastighet 0, energi sjunker långsamt | тост / ≤60 |
|  | `toast.cyst.exit` | Вышел из споры | Left the spore | Lämnade sporen | тост / ≤60 |
|  | `toast.cyst.hunger` | Голод: впал в цисту — найди еду и проснись | Hunger: encysted — find food and wake | Svult: inkystad — hitta mat och vakna | тост / ≤60 |
| 🆕 | `toast.digest` | Пищеварение... ({s}с) | Digesting... ({s}s) | Smälter... ({s}s) | тост / ≤60 |
| 🆕 | `toast.divfail` | Деление: вторая клетка не создалась | Division: second cell failed to form | Delning: andra cellen kunde inte bildas | тост / ≤60 |
|  | `toast.divide.blocked` | Пока нельзя делиться | Cannot divide yet | Kan inte dela ännu | тост / ≤60 |
|  | `toast.divide.go` | Деление | Dividing | Delar | тост / ≤60 |
| 🆕 | `toast.divided` | Деление! | Divided! | Delad! | тост / ≤60 |
|  | `toast.eat.closer` | Ближе к добыче | Closer to prey | Närmare bytet | тост / ≤60 |
|  | `toast.eat.none` | Рядом нет добычи — подплыви ближе | No prey nearby — swim closer | Inget byte nära — simma närmare | тост / ≤60 |
| 🆕 | `toast.eat.noneAuto` | Рядом нет добычи — включи АВТО или подплыви | No prey nearby — enable AUTO or swim closer | Inget byte nära — slå på AUTO eller simma närmare | тост / ≤60 |
|  | `toast.eat.ok` | Съел | Ate | Åt | тост / ≤60 |
|  | `toast.eat.plant` | Ты растение: плыви к свету | You are a plant: swim toward the light | Du är en växt: simma mot ljuset | тост / ≤60 |
| 🆕 | `toast.extinct` | Вид {name} вымер! | Species {name} went extinct! | Arten {name} dog ut! | тост / ≤60 |
| 🆕 | `toast.filter.catch` | Фильтр: затянул добычу | Filter: pulled in prey | Filter: drog in byte | тост / ≤60 |
| 🆕 | `toast.filter.catch2` | Фильтр: захватил добычу | Filter: captured prey | Filter: fångade byte | тост / ≤60 |
| 🆕 | `toast.gain` | +{e} эн / +{m} масса | +{e} en / +{m} mass | +{e} en / +{m} massa | тост / ≤60 |
| 🆕 | `toast.infected` | Клетка инфицирована! Лизис через 10-20с | Cell infected! Lysis in 10-20s | Cell infekterad! Lys om 10-20s | тост / ≤60 |
|  | `toast.lang.fallback` | Язык не включён, показан английский | Language is off, showing English | Språket är avstängt, visar engelska | тост / ≤60 |
| 🆕 | `toast.microOff` | Микроскоп выкл | Microscope off | Mikroskop av | тост / ≤60 |
| 🆕 | `toast.microOn` | 🔬 Микроскоп: вода остаётся, зум+сетка (не режим N) | 🔬 Microscope: water stays, zoom+grid (not mode N) | 🔬 Mikroskop: vattnet kvar, zoom+rutmönster (ej läge N) | тост / ≤60 |
| 🆕 | `toast.noPlayer` | Нет игрока | No player | Ingen spelare | тост / ≤60 |
| 🆕 | `toast.parasite.gone` | Паразит сброшен | Parasite shed | Parasit avkastad | тост / ≤60 |
| 🆕 | `toast.webglFail` | WebGL недоступен — возврат в мультяшный | WebGL unavailable — falling back to cartoon | WebGL otillgängligt — faller tillbaka på tecknat | тост / ≤60 |
|  | `topOfList` | вверху списка | top of the list | överst i listan | общий UI / ≤60 |
| 🆕 | `tut.s1.body` | Вы — микроорганизм в луже. Цель: есть, расти, делиться. Нажмите «Далее». | You are a microbe in a pond. Goal: eat, grow, divide. Tap Next. | Du är en mikrob i en damm. Mål: äta, växa, dela. Tryck Nästa. | обучение / ≤200 |
| 🆕 | `tut.s1.title` | Добро пожаловать | Welcome | Välkommen | обучение / ≤200 |
| 🆕 | `tut.s2.body` | WASD — плыть. Мышь задаёт направление. Попробуйте сдвинуться, затем «Далее». | WASD to swim. The mouse sets direction. Move, then tap Next. | WASD för att simma. Musen styr riktningen. Rör dig och tryck Nästa. | обучение / ≤200 |
| 🆕 | `tut.s2.title` | Движение | Movement | Rörelse | обучение / ≤200 |
| 🆕 | `tut.s3.body` | Подойдите к меньшей клетке и нажмите ЕСТЬ (E). Должны появиться вспышка и «+энергия». | Swim to a smaller cell and press EAT (E). You should see a flash. | Simma till en mindre cell och tryck ÄT (E). Du borde se ett blink. | обучение / ≤200 |
| 🆕 | `tut.s3.title` | Питание | Eating | Ätande | обучение / ≤200 |
| 🆕 | `tut.s4.body` | При полной энергии нажмите ДЕЛИТЬ (Q). Клетка станет заметно меньше — это нормально. | When energy is full, press SPLIT (Q). The cell gets smaller. That is normal. | När energin är full, tryck DELA (Q). Cellen blir mindre. Det är normalt. | обучение / ≤200 |
| 🆕 | `tut.s4.title` | Деление | Division | Delning | обучение / ≤200 |
| 🆕 | `tut.s5.body` | Камера: СЛЕДИТЬ / ПОЛЁТ. Картинка: МУЛЬТЯШНЫЙ или SWISS. Удачи в эволюции! | Camera: follow or free flight. Good luck evolving! | Kamera: följ eller fri flykt. Lycka till med evolutionen! | обучение / ≤200 |
| 🆕 | `tut.s5.title` | Готово | Done | Klart | обучение / ≤200 |
|  | `tutDone` | Туториал пройден | Tutorial done | Handledning klar | общий UI / ≤60 |
|  | `vignette` | Виньетка | Vignette | Vignett | общий UI / ≤60 |
|  | `virus` | Вирусы | Viruses | Virus | общий UI / ≤60 |
|  | `virusMode` | Режим вируса: {name}. Кликни по бактерии = инфицировать. WASD = камера. | Virus mode: {name}. Click a bacterium to infect. WASD moves the camera. | Virusläge: {name}. Klicka en bakterie för att infektera. WASD flyttar kameran. | общий UI / ≤60 |
|  | `virusRate` | Частота вирусов | Virus Rate | Virushastighet | общий UI / ≤60 |
|  | `webglNow` | Сейчас: WebGL-вода. Клик → мультяшный. | Now: WebGL water. Click for cartoon. | Nu: WebGL-vatten. Klicka för tecknat. | общий UI / ≤60 |
| 🆕 | `wgl.diff1` | Фон воды рисует WebGL-шейдер (рябь, каустика, блик) | Water background drawn by WebGL shader (ripples, caustics, glints) | Vattenbakgrund ritad av WebGL-shader (krusningar, kaustik, glans) | общий UI / ≤60 |
| 🆕 | `wgl.diff2` | Основной canvas прозрачный поверх GL | Main canvas transparent over GL | Huvudduk transparent över GL | общий UI / ≤60 |
| 🆕 | `wgl.same1` | Мир и организмы на Canvas 2D | World and organisms on Canvas 2D | Värld och organismer på Canvas 2D | общий UI / ≤60 |
| 🆕 | `wgl.same2` | Управление/еда/движение без смены симуляции | Controls/food/movement without simulation change | Kontroller/mat/rörelse utan simuleringsändring | общий UI / ≤60 |
|  | `wiki` | ВИКИ | WIKI | WIKI | общий UI / ≤60 |
| 🆕 | `wiki.def.shell` | Кремниевый панцирь | Silica shell | Kiselskal | вики / ≤300 |
| 🆕 | `wiki.def.spikes` | Шипы | Spikes | Taggar | вики / ≤300 |
| 🆕 | `wiki.def.toxic` | Токсичность | Toxicity | Giftighet | вики / ≤300 |
| 🆕 | `wiki.def.venom` | Яд | Venom | Gift | вики / ≤300 |
| 🆕 | `wiki.defs` | Особенности: | Features: | Egenskaper: | вики / ≤300 |
| 🆕 | `wiki.div.binary` | Деление надвое | Binary fission | Binär delning | вики / ≤300 |
| 🆕 | `wiki.div.budding` | Почкование | Budding | Knoppar | вики / ≤300 |
| 🆕 | `wiki.searchPh` | Поиск… | Search... | Sök... | вики / ≤300 |
|  | `wikiT` | Вики: жители лужи | Wiki: Pond Life | Wiki: Livet i dammen | общий UI / ≤60 |
| 🆕 | `x.a` | Взр | A | A | метки/подписи / ≤60 |
| 🆕 | `x.alive` | Живых | Alive | Levande | метки/подписи / ≤60 |
| 🆕 | `x.bacteriophageInfectsBacteriaCauses` | Бактериофаг. Заражает бактерии, вызывает лизис. | Bacteriophage. Infects bacteria, causes lysis. | Bakteriofag. Infekterar bakterier, orsakar lys. | метки/подписи / ≤60 |
| 🆕 | `x.born` | Родилось | Born | Född | метки/подписи / ≤60 |
| 🆕 | `x.chloroplasts` | хлоропласты | chloroplasts | kloroplaster | метки/подписи / ≤60 |
| 🆕 | `x.cilia` | реснички | cilia | cilier | метки/подписи / ≤60 |
| 🆕 | `x.contractileVacuole` | сокр. вакуоль | contractile vacuole | sammandragande vakuol | метки/подписи / ≤60 |
| 🆕 | `x.cover` |  · укрытие |  · cover |  · täcka | метки/подписи / ≤60 |
| 🆕 | `x.currentlyAlive` | Сейчас живы | Currently alive | Nu levande | метки/подписи / ≤60 |
| 🆕 | `x.cyst` | Циста | Cyst | Cyst | метки/подписи / ≤60 |
| 🆕 | `x.cyst2` |  · ЦИСТА |  · CYST |  · CYST | метки/подписи / ≤60 |
| 🆕 | `x.dead` | Погибло | Dead | Död | метки/подписи / ≤60 |
| 🆕 | `x.dividing` | Делится | Dividing | Delar | метки/подписи / ≤60 |
| 🆕 | `x.division` | Деление | Division | Delning | метки/подписи / ≤60 |
| 🆕 | `x.e` | Эн | E | E | метки/подписи / ≤60 |
| 🆕 | `x.flagella` | жгутик | flagella | flageller | метки/подписи / ≤60 |
| 🆕 | `x.food` | Пища | Food | Mat | метки/подписи / ≤60 |
| 🆕 | `x.foodScent` | Запах еды | Food scent | Matoft | метки/подписи / ≤60 |
| 🆕 | `x.golgi` | гольджи | Golgi | Golgi | метки/подписи / ≤60 |
| 🆕 | `x.healthy` | Здоров | Healthy | Frisk | метки/подписи / ≤60 |
| 🆕 | `x.infected` | Заражен | Infected | Infekterad | метки/подписи / ≤60 |
| 🆕 | `x.infected2` | Заражен! | Infected! | Infekterad! | метки/подписи / ≤60 |
| 🆕 | `x.infected3` | Инфицировано | Infected | Infekterad | метки/подписи / ≤60 |
| 🆕 | `x.locomotion` | Движение | Locomotion | Förflyttning | метки/подписи / ≤60 |
| 🆕 | `x.lysed` | Лизировано | Lysed | Lysad | метки/подписи / ≤60 |
| 🆕 | `x.macroMicronucleus` | макро/микронуклеус | macro/micronucleus | mikro/makronukleus | метки/подписи / ≤60 |
| 🆕 | `x.mitochondria` | митохондрии | mitochondria | mitokondrier | метки/подписи / ≤60 |
| 🆕 | `x.move` | Движение | Move | Flytta | метки/подписи / ≤60 |
| 🆕 | `x.nothingFound` | Ничего не найдено. | Nothing found. | Inget hittat. | метки/подписи / ≤60 |
| 🆕 | `x.nucleus` | ядро | nucleus | kärna | метки/подписи / ≤60 |
| 🆕 | `x.organelles` | Органеллы | Organelles | Organeller | метки/подписи / ≤60 |
| 🆕 | `x.phages` | Фагов | Phages | Fager | метки/подписи / ≤60 |
| 🆕 | `x.pondStatistics` | Статистика Водоёма | Pond Statistics | Dammstatistik | метки/подписи / ≤60 |
| 🆕 | `x.predators` | Враги | Predators | Rovdjur | метки/подписи / ≤60 |
| 🆕 | `x.pseudopodia` | псевдоподии | pseudopodia | pseudopoder | метки/подписи / ≤60 |
| 🆕 | `x.s` | Рзм | S | S | метки/подписи / ≤60 |
| 🆕 | `x.scaleBar` | Масштаб: 100 мкм | Scale: 100 µm | Skala: 100 µm | метки/подписи / ≤60 |
| 🆕 | `x.size` | Размер | Size | Storlek | метки/подписи / ≤60 |
| 🆕 | `x.starving` | Голод | Starving | Svulten | метки/подписи / ≤60 |
| 🆕 | `x.totalBorn` | Всего родилось | Total born | Totalt födda | метки/подписи / ≤60 |
| 🆕 | `x.trichocysts` | трихоцисты | trichocysts | trikocyster | метки/подписи / ≤60 |
| 🆕 | `x.virusMode` | РЕЖИМ ВИРУСА | VIRUS MODE | VIRUSLÄGE | метки/подписи / ≤60 |
| 🆕 | `x.wasdSwimLmbCursorRmbTargetWheel` | <span><kbd>WASD</kbd> Плыть</span><span><kbd>ЛКМ</kbd> Курсор</span><span><kbd>ПКМ</kbd> Цель</span><span><kbd>Колесо</kbd> Зум</span><span class="kh-sum">Кнопки: E Q R Space Tab F M N V B P</span> | <span><kbd>WASD</kbd> Swim</span><span><kbd>LMB</kbd> Cursor</span><span><kbd>RMB</kbd> Target</span><span><kbd>Wheel</kbd> Zoom</span><span class="kh-sum">Buttons: E Q R Space Tab F M N V B P</span> | <span><kbd>WASD</kbd> Simma</span><span><kbd>VMB</kbd> Muspekare</span><span><kbd>HMB</kbd> Mål</span><span><kbd>Hjul</kbd> Zoom</span><span class="kh-sum">Knappar: E Q R Mellanslag Tab F M N V B P</span> | метки/подписи / ≤60 |
| 🆕 | `x.wasdSwimLmbCursorRmbTargetWheel2` | <span><kbd>WASD</kbd> Плыть</span><span><kbd>ЛКМ</kbd> Курсор</span><span><kbd>ПКМ</kbd> Цель</span><span><kbd>Колесо</kbd> Зум</span><span class="kh-sum">Кнопки: E Q R Space Tab F M N V B P</span> | <span><kbd>WASD</kbd> Swim</span><span><kbd>LMB</kbd> Cursor</span><span><kbd>RMB</kbd> Target</span><span><kbd>Wheel</kbd> Zoom</span><span class="kh-sum">Buttons: E Q R Space Tab F M N V B P</span> | <span><kbd>WASD</kbd> Simma</span><span><kbd>VMB</kbd> Muspekare</span><span><kbd>HMB</kbd> Mål</span><span><kbd>Hjul</kbd> Zoom</span><span class="kh-sum">Knappar: E Q R Mellanslag Tab F M N V B P</span> | метки/подписи / ≤60 |
| 🆕 | `x.wind` | Ветер | Wind | Vind | метки/подписи / ≤60 |
| 🆕 | `x.you` | Это Вы | You | Du | метки/подписи / ≤60 |
| 🆕 | `x.yourCell` | Ваша клетка | Your cell | Din cell | метки/подписи / ≤60 |
| 🆕 | `x.yourSpecies` | Ваш вид:  | Your species:  | Din art:  | метки/подписи / ≤60 |
| 🆕 | `loc.drift` | дрейф | drift | driva | вики «Движение» / ≤18 |
| 🆕 | `loc.glide` | скользящий | glide | glida | вики «Движение» / ≤18 |
| 🆕 | `loc.flagella` | жгутики | flagella | flageller | вики «Движение» / ≤18 |
| 🆕 | `loc.cilia` | реснички | cilia | cilier | вики «Движение» / ≤18 |
| 🆕 | `loc.ciliaStalk` | реснички на стебельке | cilia on stalk | cilier på stalk | вики «Движение» / ≤18 |
| 🆕 | `loc.pseudopodia` | псевдоподии | pseudopodia | pseudopoder | вики «Движение» / ≤18 |
| 🆕 | `loc.sessile` | прикреплённый | sessile | sessil | вики «Движение» / ≤18 |
| 🆕 | `loc.budding` | почкование | budding | knoppning | вики «Движение» / ≤18 |
| 🆕 | `loc.growth` | рост | growth | tillväxt | вики «Движение» / ≤18 |
| 🆕 | `exitAsk` | Выйти? | Exit? | Avsluta? | общий UI / ≤60 |
| 🆕 | `exitMsg` | Прогресс этой жизни будет потерян. | Progress of this life will be lost. | Denna livens framsteg går förlorade. | общий UI / ≤60 |
| 🆕 | `yes` | Да | Yes | Ja | общий UI / ≤60 |
| 🆕 | `no` | Нет | No | Nej | общий UI / ≤60 |
| 🆕 | `more` | Ещё | More | Mer | общий UI / ≤60 |
| 🆕 | `deadYours` | Ваша клетка погибла | Your cell died | Din cell dog | общий UI / ≤60 |
| 🆕 | `aliveWord` | живых | alive | levande | общий UI / ≤60 |
| 🆕 | `deadOther` | Прочее | Other | Övrigt | общий UI / ≤60 |
| 🆕 | `setLang` | Язык | Language | Språk | настройки / ≤40 |
| 🆕 | `helpTouch` | <p><b>Управление:</b> Джойстик — плыть. Касание воды — направление. Нижние кнопки: есть, делиться, спора, авто. Щипок — масштаб.</p> | <p><b>Controls:</b> Drag the joystick to swim. Tap the water to aim. Bottom buttons: Eat, Divide, Spore, Auto. Pinch to zoom.</p> | <p><b>Kontroller:</b> Dra joysticken för att simma. Tryck på vattnet för att sikta. Knappar nedtill: ät, dela, spor, auto. Nyp för zoom.</p> | общий UI / ≤60 |
| 🆕 | `dCull` | Регуляция пула | Pool regulation | Poolreglering | общий UI / ≤60 |
| 🆕 | `errGeneric` | Ошибка | Error | Fel | общий UI / ≤60 |
| 🆕 | `errAsync` | Асинхронная ошибка | Async error | Asynkront fel | общий UI / ≤60 |
| 🆕 | `loadingWorld` | Собираем пруд… | Building the pond… | Bygger dammen… | общий UI / ≤60 |
| 🆕 | `economy` | Экономный режим | Economy mode | Energiläge | общий UI / ≤60 |
| 🆕 | `economyAsk` | Кадров меньше 25. Экономный режим — в настройках: меньше подписей, водоём −30%. | Frame rate is under 25. Economy mode is in Settings: fewer captions, pool −30%. | Bildfrekvens under 25. Energiläge finns i inställningarna: färre etiketter, damm −30%. | общий UI / ≤60 |
| 🆕 | `demoTipTouch` | <b>ДЕМО</b> · палец двигает камеру · 1–6 группа · касание клетки — войти<br> | <b>DEMO</b> · drag to fly · 1–6 jump group · tap a cell to enter<br> | <b>DEMO</b> · dra för att flyga · 1–6 hoppa grupp · tryck på en cell för att gå in<br> | общий UI / ≤60 |
| 🆕 | `camFlyTouch` | Свободная камера | Free cam | Fri kamera | общий UI / ≤60 |
| 🆕 | `speciesShown.one` | {n} вид | {n} species | {n} art | общий UI / ≤60 |
| 🆕 | `speciesShown.other` | {n} вид | {n} species | {n} arter | общий UI / ≤60 |
| 🆕 | `coloniesCount.one` | {n} колония | {n} colony | {n} koloni | общий UI / ≤60 |
| 🆕 | `coloniesCount.other` | {n} колония | {n} colonies | {n} kolonier | общий UI / ≤60 |
| 🆕 | `aliveCount.one` | {n} жив | {n} alive | {n} levande | общий UI / ≤60 |
| 🆕 | `aliveCount.other` | {n} жив | {n} alive | {n} levande | общий UI / ≤60 |

## Вики — тела видов (108)

| id | en | sv |
|---|---|---|
| `0` | Synechocystis is a cyanobacterium with no nucleus. It lives on light: oxygenic photosynthesis on membranes, no chloroplasts. Lab model for hydrogen metabolism. | Synechocystis är en cyanobakterie utan kärna. Lever på ljus: syrebildande fotosyntes på membran, inga kloroplaster. Labmodell för vätemetabolism. |
| `1` | Anabaena variabilis is a filament. Some cells become heterocysts and fix nitrogen while neighbours make sugar. In the pond it supplies bound nitrogen. | Anabaena variabilis är en tråd. Vissa celler blir heterocyster och binder kväve medan grannarna gör socker. Försörjer dammen med bundet kväve. |
| `2` | Spirulina (Arthrospira) is a coil of cells with gas vesicles. It hangs near the surface, photosynthesizes, and is edible. In-game it is a large green screw at the water film. | Spirulina (Arthrospira) är en spiral av celler med gasblåsor. Hänger nära ytan, fotosyntetiserar och är ätbar. I spelet en stor grön skruv i vattenfilmen. |
| `3` | Nostoc punctiforme is a bead chain in a slime capsule. It lives free or in plant symbiosis. The colony looks like a clump of green beads. | Nostoc punctiforme är en pärlkedja i en slemkapsel. Lever fritt eller i symbios med växter. Kolonin liknar en klump gröna pärlor. |
| `4` | Oscillatoria limnetica is a gliding filament. It oscillates side to side and can photosynthesize without releasing oxygen. Typical of silt and surface film. | Oscillatoria limnetica är en glidtråd. Svänger sidledes och kan fotosyntetisera utan att avge syre. Typisk för slam och ytfilm. |
| `5` | Microcystis aeruginosa is a mucilage colony, often toxic (microcystin). It causes water bloom. In-game it is a green colony ball, risky prey. | Microcystis aeruginosa är en slemlon, ofta giftig (mikrocystin). Orsakar vattenblomning. I spelet en grön koloniboll, riskabelt byte. |
| `6` | Gloeocapsa is paired cells in colored sheaths. It lives on rocks and soil and tolerates UV. In the pond it is small paired cocci in a coat. | Gloeocapsa är parade celler i färgade höljen. Lever på klippor och jord, tål UV. I dammen små parade kocker i en kappa. |
| `7` | Lyngbya majuscula is a thick cyanobacterial filament. It can release irritating toxins. It forms mats near warm shores. | Lyngbya majuscula är en tjock cyanobakterietråd. Kan avge irriterande gifter. Bildar mattor nära varma stränder. |
| `8` | Chlamydomonas reinhardtii is a green cell with two flagella and an eyespot. It swims toward light. Classic algal genetics model. | Chlamydomonas reinhardtii är en grön cell med två flageller och en ögonfläck. Simmar mot ljuset. Klassisk modell för alggenetik. |
| `9` | Chlorella vulgaris is a non-motile green ball. It divides fast and is protein-rich. Food for small eaters and a space-food subject. | Chlorella vulgaris är en orörlig grön boll. Delar sig snabbt och är proteinrik. Mat för små ätare och rymdmat-ämne. |
| `10` | Volvox globator is a hollow sphere of thousands of cells. Daughter colonies ripen inside and exit. In-game it is a large green colony. | Volvox globator är en ihålig klot av tusentals celler. Dotterkolonier mognar inuti och lämnar klotet. I spelet en stor grön koloni. |
| `11` | Euglena gracilis is a mixotroph: chloroplasts plus the ability to eat. A red eyespot tracks light. Green by day; in the dark it switches to food. | Euglena gracilis är en mixotrof: kloroplaster plus förmåga att äta. En röd ögonfläck följer ljuset. Grön på dagen; i mörkret byter den till föda. |
| `12` | Scenedesmus quadricauda is usually four cells in a row with end spines. Spines make swallowing harder. It does not swim — it drifts. | Scenedesmus quadricauda är oftast fyra celler på rad med ändtaggar. Taggarna försvårar att sväljas. Simmar inte — driver. |
| `13` | Haematococcus pluvialis is a green motile cell; under stress it turns red (astaxanthin) and grows a thick wall. Red cysts survive drought. | Haematococcus pluvialis är en grön rörlig cell; under stress blir den röd (astaxantin) och bildar tjock vägg. Röda cyster överlever torka. |
| `14` | Dunaliella salina has no rigid wall and lives in very salty water. It stores beta-carotene and looks orange. Two flagella. | Dunaliella salina saknar stiv vägg och lever i mycket salt vatten. Lagrar betakaroten och ser orange ut. Två flageller. |
| `15` | Micrasterias rotata is a flat star desmid. Two mirrored halves with deep cuts. Non-motile; photosynthesizes in acidic bog water. | Micrasterias rotata är en platt stjärndesmidie. Två speglade halvor med djupa skåror. Orörlig; fotosyntetiserar i sur myrvatten. |
| `16` | Navicula is a boat-shaped diatom with a silica valve. It glides on the substrate along a raphe slit. The shell remains after death. | Navicula är en båtformad kiselalgs med kiselvalv. Glider på underlaget längs en rafe-springa. Skalet blir kvar efter döden. |
| `17` | Pinnularia viridis is a large pennate diatom. Silica shell with a symmetric pattern. It glides slowly on the bottom. | Pinnularia viridis är en stor pennat kiselalgs. Kiselskal med symmetriskt mönster. Glider långsamt på botten. |
| `18` | Cyclotella meneghiniana is a circular centric diatom. It floats as a disc; the shell is two lids. Typical plankton. | Cyclotella meneghiniana är en rund centric kiselalgs. Flyter som en skiva; skalet är två lock. Typiskt plankton. |
| `19` | Diatoma vulgare is a diatom that sticks into a zigzag. The colony increases drag in the water column. | Diatoma vulgare är en kiselalgs som sicksack-klistras. Kolonin ökar motståndet i vattenpelaren. |
| `20` | Rhodospirillum rubrum is a purple spiral. Anoxygenic photosynthesis plus organics. Red color comes from bacteriochlorophyll. | Rhodospirillum rubrum är en lila spiral. Syrefri fotosyntes plus organik. Röd färg från bakterieklorofyll. |
| `21` | Chromatium vinosum is a purple sulfur bacterium. It oxidizes hydrogen sulfide and stores sulfur granules. Lives at the oxygen/sulfur boundary. | Chromatium vinosum är en lila svavelbakterie. Oxiderar svavelväte och lagrar svavelkorn. Lever vid syre/svavel-gränsen. |
| `22` | Porphyridium cruentum is a unicellular red alga. Phycoerythrin gives a blood-red color. Mucilage coat, no flagella. | Porphyridium cruentum är en encellig rödalg. Fykoerytrin ger blodröd färg. Slemhölje, inga flageller. |
| `23` | Prochlorococcus marinus is the smallest and most abundant photosynthetic cell on Earth. Discovered in the 1980s. It feeds the ocean. | Prochlorococcus marinus är den minsta och vanligaste fotosyntetiska cellen på jorden. Upptäckt på 1980-talet. Föder oceanen. |
| `24` | Chroococcidiopsis thermalis is an extremophile: desert, rock, radiation. A candidate for life beyond Earth. In the pond it is a slow coccus colony. | Chroococcidiopsis thermalis är en extremofil: öken, klippa, strålning. Kandidat för liv bortom jorden. I dammen en långsam kockkoloni. |
| `25` | Bdellovibrio bacteriovorus is a tiny bacterial predator. It screws into another cell and multiplies until the host bursts. | Bdellovibrio bacteriovorus är en pytteliten bakteriejägare. Skruvar sig in i en annan cell och förökar sig tills värden spricker. |
| `26` | Vampirococcus sits on prey from the outside and sucks out the contents without entering. A bacterial vampire. | Vampirococcus sitter på bytet utifrån och suger ur innehållet utan att komma in. En bakterievampyr. |
| `27` | Daptobacter enters a prey bacterium and eats it from inside. A rare intracellular hunter. | Daptobacter tränger in i en bytesbakterie och äter den inifrån. En sällsynt intracellulär jägare. |
| `28` | Myxococcus xanthus is a social bacterium. In a pack it surrounds prey and releases enzymes. When starved it forms a fruiting body. | Myxococcus xanthus är en social bakterie. I flock omringar den byte och utsöndrar enzymer. Vid svält bildar den en fruktkropp. |
| `29` | Bacteriovorax stolpii is a marine Bdellovibrio relative. It attacks Gram-negatives and lives in the prey periplasm. | Bacteriovorax stolpii är en marin släkting till Bdellovibrio. Angriper gramnegativa och lever i bytets periplasma. |
| `30` | Halobacteriovorax is a salt-tolerant bacterial hunter. Same trick: puncture the wall and grow inside. | Halobacteriovorax är en salttålig bakteriejägare. Samma trick: genomborra väggen och växa inuti. |
| `31` | Peredibacter starrii is another BALO predator. A fast comma-shaped flagellate targeting large rods. | Peredibacter starrii är ännu en BALO-rovdjur. En snabb kommaformad flagellat som tar långa stavar. |
| `32` | Monas guttula is a small heterotrophic flagellate. It grabs bacteria at the detritus surface. | Monas guttula är en liten heterotrof flagellat. Fångar bakterier vid detritusytan. |
| `33` | Oikomonas termo is a drop-shaped flagellate. One flagellum; it hunts in bacterial film. | Oikomonas termo är en dropformad flagellat. En flagel; jagar i bakteriefilm. |
| `34` | Anthophysa vegetans is a colony on an iron-manganese stalk. Cells sit in a tuft and catch bacteria. | Anthophysa vegetans är en koloni på en järn-mangan stjälk. Cellerna sitter i en tova och fångar bakterier. |
| `35` | Chilomonas paramecium is a colorless cryptophyte. Two flagella; it eats dissolved organics and tiny bacteria, no chloroplasts. | Chilomonas paramecium är en färglös kryptofyt. Två flageller; äter löst organik och små bakterier. |
| `36` | Cercomonas longicauda is an amoeboflagellate with a long tail. It crawls and swallows bacteria with pseudopodia. | Cercomonas longicauda är en amöboflagellat med lång svans. Krälar och sväljer bakterier med pseudopoder. |
| `37` | Heteromita globosa is a soil flagellate. Two flagella of different length; a main bacterial eater in soil. | Heteromita globosa är en jordflagellat. Två flageller av olika längd; en huvudsaklig bakterieätare i jord. |
| `38` | Bodo saltans is a kinetoplastid. It 'dances' in place, attached by the rear flagellum, and snatches bacteria. | Bodo saltans är en kinetoplastid. 'Dansar' på plats, fäst vid bakre flagellen, och snappar bakterier. |
| `39` | Procryptobia sorokini is a Bodo relative. It swims freely and strikes prey with the anterior flagellum. | Procryptobia sorokini är en släkting till Bodo. Simmar fritt och slår byte med främre flagellen. |
| `40` | Trypanosoma brucei is a blood parasite causing sleeping sickness. Undulating membrane and one flagellum. In the pond it is a slim-hunter model. | Trypanosoma brucei är en blodparasit som orsakar sömnsjuka. Onderligt membran och en flagell. I dammen en modell för smal jägare. |
| `41` | Leishmania donovani is an intracellular human parasite. Flagellated in the insect, aflagellate inside a macrophage. | Leishmania donovani är en intracellulär human parasit. Flagellerad i insekten, oflagellerad inuti en makrofag. |
| `42` | Monosiga brevicollis is a choanoflagellate, an animal relative. A microvilli collar filters bacteria. | Monosiga brevicollis är en choanoflagellat, släkt med djur. En krage av mikrovilli filtrerar bakterier. |
| `43` | Salpingoeca rosetta is a sessile choanoflagellate in a lorica. It can form a rosette. It filters a water current. | Salpingoeca rosetta är en sessil choanoflagellat i ett lorica. Kan bilda en rosett. Filtrerar en vattenström. |
| `44` | Codonosiga botrytis is a choanoflagellate colony on a shared stalk. Several filters on one stem. | Codonosiga botrytis är en choanoflagellat-koloni på en gemensam stjälk. Flera filter på ett skaft. |
| `45` | Paramecium caudatum is the classic slipper. Thousands of cilia, an oral groove, contractile vacuoles. It filters bacteria. | Paramecium caudatum är den klassiska toffeln. Tusentals cilier, en munfåra, sammandragande vakuoler. Filtrerar bakterier. |
| `46` | Paramecium bursaria is a slipper with zoochlorella symbionts. Green inside: sugar from algae by day, filtering at night. | Paramecium bursaria är en toffel med zoochlorella-symbionter. Grön inuti: socker från alger på dagen, filtrerar på natten. |
| `47` | Stentor coeruleus is a blue trumpet up to a millimetre. It flares into a funnel and drives a current with cilia. It can swim or sit. | Stentor coeruleus är en blå trumpet upp till en millimeter. Vecklar ut en tratt och driver en ström med cilier. Kan simma eller sitta. |
| `48` | Stentor polymorphus is a relative of the blue stentor, often with zoochlorellae. Shape shifts from trumpet to ball. | Stentor polymorphus är en släkting till blå stentor, ofta med zoochloreller. Byter form från trumpet till boll. |
| `49` | Vorticella campanula is a bell on a contractile stalk. The stalk coils into a spiral instantly. The cell itself does not swim away. | Vorticella campanula är en klocka på en sammandragbar stjälk. Stjälken ringlar sig ögonblickligen till en spiral. Själva cellen simmar inte iväg. |
| `50` | Vorticella microstoma is a small bell. Same spring-stalk, a narrower oral field. Often on detritus. | Vorticella microstoma är en liten klocka. Samma fjäderstjälk, smalare munfält. Ofta på detritus. |
| `51` | Didinium nasutum is a barrel hunter of slippers. It fires toxicysts and swallows prey whole, even if the prey is larger. | Didinium nasutum är en tunnformad jägare på tofflor. Avfyrar toxicyster och sväljer bytet helt, även om bytet är större. |
| `52` | Spirostomum ambiguum is a very long cigar. It contracts several-fold in a fraction of a second. Cilia run in a spiral. | Spirostomum ambiguum är en mycket lång cigarr. Drar ihop sig flera gånger på en bråkdel av en sekund. Cilier löper i spiral. |
| `53` | Blepharisma americanum is a pink ciliate. Blepharismin pigment is light-sensitive. It filters and can attack smaller cells. | Blepharisma americanum är en rosa ciliat. Blepharismin-pigment är ljuskänsligt. Filtrerar och kan attackera mindre celler. |
| `54` | Euplotes patella walks on cirri as if on legs. Flat, quick turns. It scrapes bacteria off surfaces. | Euplotes patella går på cirri som på ben. Platt, snabba svängar. Skrapar bakterier från ytor. |
| `55` | Stylonychia pustulata is a hypotrich that 'runs' on the bottom. Large cirri, a clear mouth. Predator of small ciliates. | Stylonychia pustulata är en hypotrich som 'springer' på botten. Stora cirri, tydlig mun. Rovdjur på små ciliater. |
| `56` | Oxytricha trifallax is a genome model: two nuclei and complex DNA rewriting. It walks on cirri and eats bacteria and small protists. | Oxytricha trifallax är en genommodell: två kärnor och komplex DNA-omskrivning. Går på cirri och äter bakterier och små protister. |
| `57` | Tetrahymena thermophila is a lab ciliate. Four oral membranelles, fast division. Model for telomeres and cilia. | Tetrahymena thermophila är en lab-ciliat. Fyra munmembraneller, snabb delning. Modell för telomerer och cilier. |
| `58` | Coleps hirtus is a barrel in calcareous plates with spines. Scavenger and predator: it bites into the wounded. | Coleps hirtus är en tunna i kalkplattor med taggar. Asätare och rovdjur: biter in i skadade. |
| `59` | Litonotus lamella is a flat predator with toxicysts in a 'proboscis'. It paralyzes prey and sucks it out. | Litonotus lamella är ett platt rovdjur med toxicyster i en 'snabel'. Förlamar bytet och suger ur det. |
| `60` | Dileptus anser has a long neck with venomous extrusomes. It strikes with the neck, then swallows. A large mid-tier hunter. | Dileptus anser har en lång hals med giftiga extrusomer. Slår med halsen, sväljer sedan. En stor mellanjägare. |
| `61` | Urocentrum turbo is a spinning top: an equatorial ciliary belt spins the cell in place. It filters bacteria. | Urocentrum turbo är en snurra: ett ekvatoriellt ciliebälte snurrar cellen på plats. Filtrerar bakterier. |
| `62` | Zoothamnium arbuscula is a branched colony of bells. A shared contractile stalk jerks the whole tree at once. | Zoothamnium arbuscula är en förgrenad koloni av klockor. En gemensam sammandragbar stjälk rycker hela trädet på en gång. |
| `63` | Opercularia coarctata is a sessile peritrich without a spring stalk. A lid covers the mouth. It filters and does not swim away. | Opercularia coarctata är en sessil peritrich utan fjäderstjälk. Ett lock täcker munnen. Filtrerar och simmar inte iväg. |
| `64` | Amoeba proteus is the classic amoeba. Pseudopodia flow around prey. No fixed shape, no cilia. | Amoeba proteus är den klassiska amöban. Pseudopoder flyter runt bytet. Ingen fast form, inga cilier. |
| `65` | Arcella vulgaris is a testate amoeba with a rigid dome. Pseudopodia emerge from the aperture. It crawls on plants. | Arcella vulgaris är en skalamöba med styv kupol. Pseudopoder kommer ut ur öppningen. Krälar på växter. |
| `66` | Difflugia oblonga has a shell of sand grains the amoeba glues itself. It lives in silt. | Difflugia oblonga har ett skal av sandkorn som amöban klistrar själv. Lever i slam. |
| `67` | Euglypha alveolata has a shell of silica scales. Thin filose pseudopodia. A small bacterial predator. | Euglypha alveolata har ett skal av kiselfjäll. Tunna trådiga pseudopoder. Ett litet bakterierovdjur. |
| `68` | Nebela collaris is a bottle-shaped shell built from stolen scales. Forest and bog waters. | Nebela collaris är en flaskformigt skal byggt av stulna fjäll. Skogs- och myrvatten. |
| `69` | Centropyxis aculeata is a disc shell with spines. The aperture is offset. It crawls on detritus. | Centropyxis aculeata är ett skivformat skal med taggar. Öppningen är förskjuten. Krälar på detritus. |
| `70` | Actinophrys sol is a heliozoan: thin axopodia radiate all around. Prey sticks to the rays and is pulled in. | Actinophrys sol är en heliozoér: tunna axopoder strålar åt alla håll. Byte fastnar på strålarna och dras in. |
| `71` | Actinosphaerium eichhorni is a large multinucleate heliozoan. Same rays, much bigger cell. It eats ciliates and rotifers. | Actinosphaerium eichhorni är en stor flerkärnig heliozoér. Samma strålar, mycket större cell. Äter ciliater och hjuldjur. |
| `72` | Raphidiophrys pallida is a heliozoan in scales. Rays carry silica needles. An ambush plankton hunter. | Raphidiophrys pallida är en heliozoér i fjäll. Strålarna bär kiselnålar. Ett bakhållsplanktonjägare. |
| `73` | Rotaria rotatoria is a rotifer that can survive drying. A corona wheels food into the mouth. A true multicellular animal. | Rotaria rotatoria är ett hjuldjur som överlever uttorkning. En corona hjular in mat i munnen. Ett äkta flercelligt djur. |
| `74` | Philodina roseola is a pink bdelloid rotifer. It crawls like a leech and also swims. Females only; no males. | Philodina roseola är ett rosa bdelloid hjuldjur. Krälar som en igel och simmar också. Endast honor; inga hanar. |
| `75` | Brachionus plicatilis is a planktonic loricate rotifer. Fry food in aquaculture. It filters algae and bacteria. | Brachionus plicatilis är ett planktoniskt lorica-hjuldjur. Yngelfoder i vattenbruk. Filtrerar alger och bakterier. |
| `76` | Keratella cochlearis is a rotifer with a long lorica spine. The spine deters predators. Common pond plankton. | Keratella cochlearis är ett hjuldjur med lång lorica-tagga. Taggan avskräcker rovdjur. Vanligt dammplankton. |
| `77` | Asplanchna priodonta is a sack without a lorica, a predatory rotifer. It swallows other rotifers and ciliates whole. | Asplanchna priodonta är en säck utan lorica, ett rov hjuldjur. Sväljer andra hjuldjur och ciliater helt. |
| `78` | Chaetonotus maximus is a gastrotrich. Scale-covered, it crawls on the bottom. It eats bacteria and detritus. | Chaetonotus maximus är ett bukhårigt djur. Fjällklädd, krälar på bottnen. Äter bakterier och detritus. |
| `79` | Lepidodermella squamata is a small gastrotrich in overlapping scales. Very fast in-place turns. | Lepidodermella squamata är ett litet bukhårigt djur i överlappande fjäll. Mycket snabba svängar på plats. |
| `80` | Macrostomum lignano is a microscopic flatworm. Real muscles and eyes. A regeneration model. It hunts small protists. | Macrostomum lignano är en mikroskopisk plattmask. Riktiga muskler och ögon. Regenerationsmodell. Jagar små protister. |
| `81` | Stenostomum leucops is a thin ciliated worm. It divides across into a chain of zooids. Predator of detritus and small animals. | Stenostomum leucops är en tunn cilierad mask. Delar sig på tvären till en kedja av zoider. Rovdjur på detritus och små djur. |
| `82` | Microstomum lineare is a flatworm that eats hydra and embeds their stinging cells in its own skin. A chain of zooids. | Microstomum lineare är en plattmask som äter hydra och bygger in deras nässelceller i egen hud. En kedja av zoider. |
| `83` | Prostoma graecense is a freshwater nemertean. A long proboscis shoots at prey. A rare large bottom hunter. | Prostoma graecense är en sötvattens-nemertin. En lång snabel skjuter mot byte. En sällsynt stor bottenjägare. |
| `84` | Trichoplax adhaerens is a placozoan, among the simplest animals. It crawls as a sheet and digests food outside. No mouth. | Trichoplax adhaerens är ett placozoér, bland de enklaste djuren. Krälar som en flo och smälter mat utanför. Ingen mun. |
| `85` | Saccharomyces cerevisiae is baker's yeast. It buds, eats sugar, releases CO2 and alcohol. In the pond it cleans dissolved organics. | Saccharomyces cerevisiae är jäst. Knoppas, äter socker, avger CO₂ och alkohol. Rensar löst organik i dammen. |
| `86` | Candida albicans is a yeast that can grow as filaments. An opportunistic human pathogen. In-game it is a detrital fungus. | Candida albicans är en jäst som kan växa som trådar. En opportunistisk human patogen. I spelet en detritussvamp. |
| `87` | Mucor mucedo is bread mold. Sporangia on stalks, fast growth over the dead. It does not hunt the living. | Mucor mucedo är brödmögel. Sporangier på stjälkar, snabb tillväxt över de döda. Jagar inte levande. |
| `88` | Rhizopus stolonifer is black bread mold. Stolons and rhizoids spread over the substrate. It breaks down starch. | Rhizopus stolonifer är svart brödmögel. Stoloner och rhizoider sprider sig över underlaget. Bryter ner stärkelse. |
| `89` | Penicillium chrysogenum is a brush mold, the source of penicillin. Conidial brushes. It decomposes organics and suppresses nearby bacteria. | Penicillium chrysogenum är penselmögel, källan till penicillin. Konidiepenslar. Nedbryter organik och undertrycker närliggande bakterier. |
| `90` | Aspergillus niger is black aspergillus. Spherical spore heads. Industrial citric-acid producer. A saprotroph. | Aspergillus niger är svart aspergillus. Klotformade spornhuvuden. Industriell citronsyraproducent. En saprotrof. |
| `91` | Batrachochytrium dendrobatidis is a chytrid of frogs. Uniflagellate zoospores. In the pond it is a water-fungus model. | Batrachochytrium dendrobatidis är en chytrid på grodor. Enflagelliga zoosporer. I dammen en modell för vattensvamp. |
| `92` | Chytriomyces aureus is a water chytrid on pollen and algae. Golden sporangia; zoospores swim to the substrate. | Chytriomyces aureus är en vattenchytrid på pollen och alger. Gyllene sporangier; zoosporer simmar till underlaget. |
| `93` | Allomyces macrogynus is a water fungus with true mycelium. It alternates diploid and haploid. Zoospores have a posterior flagellum. | Allomyces macrogynus är en vattensvamp med äkta mycel. Växlar diploid och haploid. Zoosporer har en bakre flagell. |
| `94` | Bacillus subtilis is a soil rod. Spores survive boiling. It breaks down protein; a Gram-positive model. | Bacillus subtilis är en jordstav. Sporer överlever kokning. Bryter ner protein; en grampositiv modell. |
| `95` | Pseudomonas putida is a cleanup rod. It even eats petroleum products. Motile flagellum, fast growth on detritus. | Pseudomonas putida är en städstav. Äter till och med oljeprodukter. Rörlig flagell, snabb tillväxt på detritus. |
| `96` | Streptomyces coelicolor is a filamentous soil bacterium. It makes the smell of earth (geosmin) and many antibiotics. Spores on hyphae. | Streptomyces coelicolor är en trådig jordbakterie. Ger doften av jord (geosmin) och många antibiotika. Sporer på hyfer. |
| `97` | Cellulomonas fimi breaks down cellulose. A yellow rod on plant detritus. Without it dead algae would linger longer. | Cellulomonas fimi bryter ner cellulosa. En gul stav på växtdetritus. Utan den skulle döda alger ligga kvar längre. |
| `98` | Thermus aquaticus is a thermophile from hot springs. Taq polymerase is the basis of PCR. In a cold pond it is almost dormant. | Thermus aquaticus är en termofil från varma källor. Taq-polymeras är grunden för PCR. I en kall damm nästan vilande. |
| `99` | Deinococcus radiodurans is the radiation champion. It reassembles a shattered genome in hours. Thick wall, cell tetrads. | Deinococcus radiodurans är strålningsmästaren. Sätter ihop ett krossat genom på timmar. Tjock vägg, celltetrader. |
| `1001` | Sexual Eukaryote is a teaching model of sexual reproduction. Two sexes, gamete fusion, not simple binary fission. | Sexuell eukaryot är en undervisningsmodell för sexuell fortplantning. Två kön, gametfusion, inte enkel binär delning. |
| `T4 Bacteriophage` | T4 is a large myovirus of E. coli. The tail contracts and injects DNA. In half an hour the cell bursts and dozens of phages exit. | T4 är ett stort myovirus på E. coli. Svansen drar ihop sig och injicerar DNA. Inom en halvtimme spricker cellen och dussintals fager lämnar den. |
| `Lambda Phage` | Lambda is a temperate phage. It can insert into the chromosome and sleep (lysogeny) or cut the cell at once (lysis). | Lambda är en tempererad fag. Kan infoga sig i kromosomen och sova (lysogeni) eller klippa cellen direkt (lys). |
| `T7 Bacteriophage` | T7 has a short tail and very fast replication. A favourite system in synthetic biology. | T7 har kort svans och mycket snabb replikering. Ett favoritsystem i syntetisk biologi. |
| `Phi-6 Phage` | Phi-6 is an RNA phage with a lipid envelope. It infects Pseudomonas. A rare membrane for a phage. | Phi-6 är en RNA-fag med lipidhölje. Infekterar Pseudomonas. Ett sällsynt membran för en fag. |
| `MS2 Phage` | MS2 is a tiny tailless RNA phage. It binds male E. coli pili. Its genome was one of the first RNA genomes read. | MS2 är en pytteliten svanslös RNA-fag. Binder till pili på manliga E. coli. Dess genom var ett av de första RNA-genomen som lästes. |
| `Neuro-Parasite` | A fictional pond neuro-parasite. It latches onto eukaryotes and breaks host behaviour until the host becomes a carrier. | En fiktiv damm-neuroparasit. Fäster på eukaryoter och bryter värdens beteende tills värden blir bärare. |
| `Sexual Eukaryote` | Sexual Eukaryote is a teaching model of sexual reproduction. Two sexes, gamete fusion, not simple binary fission. | Sexuell eukaryot är en undervisningsmodell för sexuell fortplantning. Två kön, gametfusion, inte enkel binär delning. |
