# Пакет на проверку аналитику: es (круг 5)

- Дата: 2026-10-16 17:46:37 UTC+3  |  Круг: 5
- input_sha256 словарей (полные — для raw<es-analyst-round5.json):
  - `en.json` = d5b54954a7f4cff6ed13d7abf00c1cd9616eacbbc225d250ea4893dd9411d938
  - `ru.json` = b0d7750efcee45dc350b2ecb9d1e01e19439799c121fe595394c25ba9d11e8c1
  - `es.json` = 63a0f7d750c27a5db221bfc13dae8bcfaae833aff73321b6a606fc79c7434b3f
  - `wiki/es.json` = 07aa08c78ed933ed7d6f49c5912c2b754a31eeb18edc3d21fc3fed6b15b368f7
- Ключей UI: 412 (из них 🆕 новых после круга 4: 272 — U13 263 + U42 loc.* 9); вики-тел: 108
- Rubric 0–10 по 5 осям: смысл, глоссарий, регистр, длина, ошибки. Порог включения ≥ 8.
- Ответ аналитика: `09-Docs/i18n-review/raw/es-analyst-round5.json` + строка в ANALYST-LEDGER.md (пишет ТОЛЬКО аналитик).

## Снимки 390×844

- `../out-dev-factory/shots-release-ready-2026-10-14/i18n/es/390-game.png`
- `../out-dev-factory/shots-release-ready-2026-10-14/i18n/es/390-gameover.png`
- `../out-dev-factory/shots-release-ready-2026-10-14/i18n/es/390-menu.png`
- `../out-dev-factory/shots-release-ready-2026-10-14/i18n/es/390-pause.png`
- `../out-dev-factory/shots-release-ready-2026-10-14/i18n/es/390-settings.png`
- `../out-dev-factory/shots-release-ready-2026-10-14/i18n/es/390-tutorial.png`
- `../out-dev-factory/shots-release-ready-2026-10-14/i18n/es/390-wiki-article.png`
- `../out-dev-factory/shots-release-ready-2026-10-14/i18n/es/390-wiki-list.png`

## Словарь UI (412)

| 🆕 | ключ | ru | en | es | где / макс. длина |
|---|---|---|---|---|---|
| 🆕 | `abt.feed` | КУСЬ | BITE | MORDER | общий UI / ≤60 |
| 🆕 | `abt.fly` | ПОЛЁТ | FLIGHT | VUELO | общий UI / ≤60 |
| 🆕 | `abt.follow` | СЛЕДИТЬ | FOLLOW | SEGUIR | общий UI / ≤60 |
|  | `age` | Возраст | Age | Edad | общий UI / ≤60 |
|  | `all` | Все | All | Todos | общий UI / ≤60 |
|  | `aquarium` | АКВАРИУМ | AQUARIUM | ACUARIO | общий UI / ≤60 |
| 🆕 | `aria.apk` | Скачать приложение Android APK | Download Android APK app | Descargar la aplicación Android APK | общий UI / ≤60 |
| 🆕 | `aria.aqua` | Аквариум | Aquarium | Acuario | общий UI / ≤60 |
| 🆕 | `aria.auto` | Авто (Tab) | Auto (Tab) | Auto (Tab) | общий UI / ≤60 |
| 🆕 | `aria.cyst` | Спора (R) | Spore (R) | Espora (R) | общий UI / ≤60 |
| 🆕 | `aria.demo` | Демо | Demo | Demo | общий UI / ≤60 |
| 🆕 | `aria.divide` | Делить (Q) | Split (Q) | Dividir (Q) | общий UI / ≤60 |
| 🆕 | `aria.eat` | Есть (E) | Eat (E) | Comer (E) | общий UI / ≤60 |
| 🆕 | `aria.feed` | Ручное питание (Space) | Manual feed (Space) | Alimentación manual (Espacio) | общий UI / ≤60 |
| 🆕 | `aria.fly` | Свободный полёт (F) | Free flight (F) | Vuelo libre (F) | общий UI / ≤60 |
| 🆕 | `aria.follow2` | Следить за клеткой (V) | Follow cell (V) | Seguir célula (V) | общий UI / ≤60 |
| 🆕 | `aria.help` | Как играть | How to play | Cómo jugar | общий UI / ≤60 |
| 🆕 | `aria.light` | Свет | Light | Luz | общий UI / ≤60 |
| 🆕 | `aria.micro` | Микроскоп (M) | Microscope (M) | Microscopio (M) | общий UI / ≤60 |
| 🆕 | `aria.pause` | Пауза (P) | Pause (P) | Pausa (P) | общий UI / ≤60 |
| 🆕 | `aria.render` | Режим картинки (N) | Picture mode (N) | Modo de imagen (N) | общий UI / ≤60 |
| 🆕 | `aria.set` | Настройки | Settings | Ajustes | общий UI / ≤60 |
| 🆕 | `aria.start` | Старт | Start | Iniciar | общий UI / ≤60 |
| 🆕 | `aria.switches` | Игровые переключатели | Game switches | Interruptores del juego | общий UI / ≤60 |
| 🆕 | `aria.wiki2` | Вики (B) | Wiki (B) | Wiki (B) | общий UI / ≤60 |
| 🆕 | `aria.zi` | Приблизить | Zoom in | Acercar | общий UI / ≤60 |
| 🆕 | `aria.zo` | Отдалить | Zoom out | Alejar | общий UI / ≤60 |
| 🆕 | `auto.off` | АВТО: выкл | AUTO: off | AUTO: apagado | общий UI / ≤60 |
| 🆕 | `auto.on` | АВТО: вкл | AUTO: on | AUTO: encendido | общий UI / ≤60 |
|  | `autoOn` | АВТО | AUTO | AUTO | общий UI / ≤60 |
|  | `autoPilotOn` | АВТО-ПИЛОТ ВКЛ | AUTO ON | AUTO ACTIVO | общий UI / ≤60 |
|  | `bubbles` | Пузырьки | Bubbles | Burbujas | общий UI / ≤60 |
| 🆕 | `cam.fly` | Полёт: WASD / мышь / колёсико | Flight: WASD / mouse / wheel | Vuelo: WASD / ratón / rueda | общий UI / ≤60 |
| 🆕 | `cam.fly2` | ✈ Полёт: WASD / стрелки / мышь / колёсико | ✈ Flight: WASD / arrows / mouse / wheel | ✈ Vuelo: WASD / flechas / ratón / rueda | общий UI / ≤60 |
| 🆕 | `cam.flyBtn` | ✈ ПОЛЁТ WASD | ✈ FLIGHT WASD | ✈ VUELO WASD | общий UI / ≤60 |
| 🆕 | `cam.follow` | Камера: следит за клеткой | Camera: following cell | Cámara: sigue la célula | общий UI / ≤60 |
| 🆕 | `cam.followBig` | СЛЕДИТЬ | FOLLOW | SEGUIR | общий UI / ≤60 |
| 🆕 | `cam.followToast` | Камера: СЛЕДИТ | Camera: FOLLOW | Cámara: SIGUIENDO | общий UI / ≤60 |
| 🆕 | `cam.tip` | ✈ Полёт камеры. СЛЕДИТЬ (V) — вернуться к клетке | ✈ Camera flight. FOLLOW (V) — return to cell | ✈ Cámara libre. SEGUIR (V) — volver a la célula | общий UI / ≤60 |
|  | `camFly` | Полёт камеры | Camera flight | Vuelo de cámara | общий UI / ≤60 |
|  | `cartoon` | МУЛЬТ | CARTOON | CARICATURA | общий UI / ≤60 |
|  | `cartoonNow` | Сейчас: мультяшный. Клик → SwissBioPics. | Now: cartoon. Click for Swiss. | Ahora: caricatura. Clic para Swiss. | общий UI / ≤60 |
| 🆕 | `catShort.consumer1` | мелкий едок | small eater | Comedor pequeño | категория / ≤24 |
| 🆕 | `catShort.consumer2` | средний едок | mid eater | Comedor medio | категория / ≤24 |
| 🆕 | `catShort.consumer3` | крупный охотник | big hunter | Cazador grande | категория / ≤24 |
| 🆕 | `catShort.decomposer` | уборщик | cleaner | Descomponedor | категория / ≤24 |
| 🆕 | `catShort.producer` | зелёные | greens | Verde | категория / ≤24 |
|  | `clear` | Ясно | Clear | Despejado | общий UI / ≤60 |
|  | `close` | ЗАКРЫТЬ | CLOSE | CERRAR | общий UI / ≤60 |
|  | `colonies` | колоний | colonies | colonias | общий UI / ≤60 |
|  | `colonyBadge` | КОЛОНИЯ · куча клеток | COLONY · clump of cells | COLONIA · grupo de células | общий UI / ≤60 |
|  | `colonyKind` | Колониальный вид | Colony species | Especie colonial | общий UI / ≤60 |
|  | `consumer1` | Мелкие едоки | Small eaters | Comedores pequeños | общий UI / ≤60 |
|  | `consumer2` | Средние едоки | Mid eaters | Comedores medios | общий UI / ≤60 |
|  | `consumer3` | Крупные охотники | Big hunters | Cazadores grandes | общий UI / ≤60 |
|  | `currents` | Течения | Currents | Corrientes | общий UI / ≤60 |
|  | `dAge` | Старость | Old age | Vejez | общий UI / ≤60 |
|  | `dCauses` | Причины гибели | Death Causes | Causas de muerte | общий UI / ≤60 |
|  | `dEaten` | Съедено | Eaten | Devorado | общий UI / ≤60 |
|  | `dLysis` | Лизис | Lysis | Lisis | общий UI / ≤60 |
|  | `dStarve` | Голод | Starved | Inanición | общий UI / ≤60 |
|  | `dTemp` | Температура | Temp | Temperatura | общий UI / ≤60 |
| 🆕 | `dTip.age` | Совет: Старость неизбежна. Важно успеть разделиться до гибели. | Tip: Old age is inevitable. Divide before you die. | Consejo: La vejez es inevitable. Divídete antes de morir. | общий UI / ≤60 |
| 🆕 | `dTip.eaten` | Совет: Избегайте хищников, используйте Режим везения для бегства. | Tip: Avoid predators, use Grace Period to run away. | Consejo: Evita a los depredadores, usa el Periodo de Gracia para escapar. | общий UI / ≤60 |
| 🆕 | `dTip.lysis` | Совет: Лизис (разрыв мембраны) вызывает вирус. Держитесь от них подальше. | Tip: Lysis is caused by viruses. Stay away from them. | Consejo: La lisis la causan los virus. Aléjate de ellos. | общий UI / ≤60 |
| 🆕 | `dTip.starve` | Совет: Чаще питайтесь, держитесь ближе к скоплениям еды или ускорьте свой вид. | Tip: Eat more often, stay near food clusters, or mutate speed. | Consejo: Come más a menudo, quédate cerca de los grupos de comida o muta la velocidad. | общий UI / ≤60 |
| 🆕 | `dTip.temp` | Совет: Следите за термометром. Мутируйте температурный диапазон. | Tip: Watch the thermometer. Mutate your temp range. | Consejo: Vigila el termómetro. Muta tu rango de temperatura. | общий UI / ≤60 |
|  | `days` | Дней | Days | Días | общий UI / ≤60 |
|  | `dead` | ВЫМИРАНИЕ | EXTINCT | EXTINCIÓN | общий UI / ≤60 |
|  | `decomposer` | Уборщики (грибки) | Cleaners (fungi) | Descomponedores (hongos) | общий UI / ≤60 |
|  | `demo` | ДЕМО / Галерея | DEMO / Gallery | DEMO / Galería | общий UI / ≤60 |
| 🆕 | `demo.colony` | ⬡КОЛОНИЯ  | ⬡COLONY  | ⬡COLONIA  | демо / ≤60 |
| 🆕 | `demo.grp.consumer1` | 2. Консументы I | 2. Consumers I | 2. Consumidores I | демо / ≤60 |
| 🆕 | `demo.grp.consumer2` | 3. Консументы II | 3. Consumers II | 3. Consumidores II | демо / ≤60 |
| 🆕 | `demo.grp.consumer3` | 4. Консументы III | 4. Consumers III | 4. Consumidores III | демо / ≤60 |
| 🆕 | `demo.grp.decomposer` | 5. Редуценты | 5. Decomposers | 5. Descomponedores | демо / ≤60 |
| 🆕 | `demo.grp.producer` | 1. Продуценты | 1. Producers | 1. Productores | демо / ≤60 |
| 🆕 | `demo.grp.virus` | 6. Вирусы | 6. Viruses | 6. Virus | демо / ≤60 |
| 🆕 | `demo.labels` | Метки | Labels | Etiquetas | демо / ≤60 |
| 🆕 | `demo.tip` | <b>ДЕМО</b> · WASD/мышь — полёт · 1-6 группа · клик = вселиться<br> | <b>DEMO</b> · WASD/mouse fly · 1-6 jump group · click = possess<br> | <b>DEMO</b> · WASD/ratón para volar · 1-6 saltan de grupo · clic = poseer<br> | демо / ≤60 |
|  | `density` | Плотность | Density | Densidad | общий UI / ≤60 |
|  | `diffE` | Лёгкий | Easy | Fácil | общий UI / ≤60 |
|  | `diffH` | Сложный | Hard | Difícil | общий UI / ≤60 |
|  | `diffN` | Обычный | Normal | Normal | общий UI / ≤60 |
|  | `divRate` | Размножение | Reproduction | Reproducción | общий UI / ≤60 |
|  | `divs` | Делений | Divisions | Divisiones | общий UI / ≤60 |
| 🆕 | `dna.bad` | Неверная строка ДНК! | Invalid DNA String! | ¡Cadena de ADN no válida! | общий UI / ≤60 |
| 🆕 | `dna.export` | Экспорт моего ДНК | Export My DNA | Exportar mi ADN | общий UI / ≤60 |
| 🆕 | `dna.import` | Импорт ДНК | Import DNA | Importar ADN | общий UI / ≤60 |
| 🆕 | `dna.io` | Импорт/Экспорт ДНК | Import/Export DNA | Importar/Exportar ADN | общий UI / ≤60 |
| 🆕 | `dna.ok` | ДНК импортирована! | DNA Imported Successfully! | ¡ADN importado con éxito! | общий UI / ≤60 |
| 🆕 | `dna.pastePh` | Вставь код ДНК… | Paste DNA code here... | Pega aquí el código de ADN... | общий UI / ≤60 |
|  | `dnaPoints` | Очки мутации: | Mutation points: | Puntos de mutación: | общий UI / ≤60 |
|  | `dnaShell` | Кремниевый панцирь (20 ДНК) | Silica shell (20 DNA) | Caparazón de sílice (20 ADN) | общий UI / ≤60 |
|  | `dnaSize` | Увеличение массы (8 ДНК) | More mass (8 DNA) | Más masa (8 ADN) | общий UI / ≤60 |
|  | `dnaSpeed` | Ускорение жгутиков (5 ДНК) | Faster flagella (5 DNA) | Flagelos más rápidos (5 ADN) | общий UI / ≤60 |
|  | `dnaSpikes` | Отрастить шипы (15 ДНК) | Grow spikes (15 DNA) | Desarrollar púas (15 ADN) | общий UI / ≤60 |
|  | `dnaTitle` | Мутации ДНК | DNA mutations | Mutaciones de ADN | общий UI / ≤60 |
|  | `eaten` | Съедено | Eaten | Comido | общий UI / ≤60 |
|  | `eats` | ест | eats | come | общий UI / ≤60 |
|  | `eatsDead` | ест мёртвое | eats dead matter | come materia muerta | общий UI / ≤60 |
|  | `eatsLight` | ест свет | eats light | come luz | общий UI / ≤60 |
| 🆕 | `edu.anatomy` | Анатомия | Anatomy | Anatomía | анатомия / ≤120 |
| 🆕 | `edu.cell` | клетка | cell | célula | анатомия / ≤120 |
| 🆕 | `edu.chloro.desc` | Фотосинтез: свет + CO₂ + H₂O → сахар + O₂. Зелёный из‑за хлорофилла. Есть у водорослей и растений. | Photosynthesis: light + CO₂ + H₂O → sugar + O₂. Green from chlorophyll. Found in algae and plants. | Fotosíntesis: luz + CO₂ + H₂O → azúcar + O₂. Verde por la clorofila. Está en algas y plantas. | анатомия / ≤120 |
| 🆕 | `edu.chloro.name` | Хлоропласт | Chloroplast | Cloroplasto | анатомия / ≤120 |
| 🆕 | `edu.cilia.desc` | Короткие подвижные выросты. Создают ток воды: движение + фильтр-питание (затягивают бактерий и водоросли ко рту). | Short moving hairs. Create water currents: movement + filter feeding (pull bacteria and algae to the mouth). | Pelitos móviles cortos. Crean corrientes de agua: movimiento + alimentación por filtro (atraen bacterias y algas a la boca). | анатомия / ≤120 |
| 🆕 | `edu.cilia.name` | Реснички | Cilia | Cilios | анатомия / ≤120 |
| 🆕 | `edu.cyto.desc` | Внутренняя среда клетки: вода, белки, органеллы. Здесь идут тысячи биохимических реакций. | The cell's inner medium: water, proteins, organelles. Thousands of biochemical reactions run here. | El medio interno de la célula: agua, proteínas, orgánulos. Aquí ocurren miles de reacciones bioquímicas. | анатомия / ≤120 |
| 🆕 | `edu.cyto.name` | Цитоплазма | Cytoplasm | Citoplasma | анатомия / ≤120 |
| 🆕 | `edu.flagella.desc` | Длинный «мотор» для плавания. Вращается или изгибается — клетка плывёт к пище или от опасности (хемотаксис). | Long swimming motor. Rotates or bends — the cell swims to food or away from danger (chemotaxis). | Motor largo de natación. Rota o se dobla: la célula nada hacia el alimento o lejos del peligro (quimiotaxis). | анатомия / ≤120 |
| 🆕 | `edu.flagella.name` | Жгутик | Flagellum | Flagelo | анатомия / ≤120 |
| 🆕 | `edu.hoverHint` | Наведи на точку внутри клетки — название и роль органа | Hover a dot inside the cell — organelle name and role | Pasa el cursor por un punto dentro de la célula: nombre y función del orgánulo | анатомия / ≤120 |
| 🆕 | `edu.membrane.desc` | Тонкая оболочка из липидов. Контролирует, что входит и выходит. У всех клеток есть мембрана. | Thin lipid envelope. Controls what goes in and out. Every cell has a membrane. | Fina envoltura lipídica. Controla lo que entra y sale. Toda célula tiene membrana. | анатомия / ≤120 |
| 🆕 | `edu.membrane.name` | Мембрана | Membrane | Membrana | анатомия / ≤120 |
| 🆕 | `edu.mito.desc` | «Электростанция» клетки. Дыхание: сахар + O₂ → ATP (энергия). Своя ДНК — остаток древней бактерии. | Power plant of the cell. Respiration: sugar + O₂ → ATP (energy). Has its own DNA — remnant of an ancient bacterium. | Central energética de la célula. Respiración: azúcar + O₂ → ATP (energía). Tiene su propio ADN, resto de una bacteria antigua. | анатомия / ≤120 |
| 🆕 | `edu.mito.name` | Митохондрия | Mitochondrion | Mitocondria | анатомия / ≤120 |
| 🆕 | `edu.nucleoid.desc` | Зона с кольцевой ДНК у прокариот. Нет ядерной оболочки — геном свободно в цитоплазме. | Region with circular DNA in prokaryotes. No nuclear envelope — the genome floats freely in the cytoplasm. | Zona con ADN circular en procariotas. Sin envoltura nuclear: el genoma flota libre en el citoplasma. | анатомия / ≤120 |
| 🆕 | `edu.nucleoid.name` | Нуклеоид | Nucleoid | Nucleoide | анатомия / ≤120 |
| 🆕 | `edu.nucleus.desc` | Хранит ДНК. Управляет ростом, делением и синтезом белков. У бактерий настоящего ядра нет — ДНК в нуклеоиде. | Stores DNA. Controls growth, division and protein synthesis. Bacteria have no true nucleus — DNA sits in the nucleoid. | Guarda el ADN. Controla el crecimiento, la división y la síntesis de proteínas. Las bacterias no tienen núcleo verdadero: el ADN está en el nucleoide. | анатомия / ≤120 |
| 🆕 | `edu.nucleus.name` | Ядро | Nucleus | Núcleo | анатомия / ≤120 |
| 🆕 | `edu.oral.desc` | У инфузорий — желобок, куда реснички сгоняют добычу. Отсюда пища попадает в пищеварительную вакуоль. | In ciliates — a groove where cilia sweep prey. Food enters the digestive vacuole from here. | En los ciliados, un surco donde los cilios llevan la presa. De aquí la comida entra en la vacuola digestiva. | анатомия / ≤120 |
| 🆕 | `edu.oral.name` | Ротовая воронка | Oral groove | Surco oral | анатомия / ≤120 |
| 🆕 | `edu.vacuole.desc` | Пузырёк с водой, запасными веществами или пищеварительными ферментами. У инфузорий — пищеварительные и сократительные вакуоли. | Vesicle with water, reserves or digestive enzymes. Ciliates have digestive and contractile vacuoles. | Vesícula con agua, reservas o enzimas digestivas. Los ciliados tienen vacuolas digestivas y contráctiles. | анатомия / ≤120 |
| 🆕 | `edu.vacuole.name` | Вакуоль | Vacuole | Vacuola | анатомия / ≤120 |
| 🆕 | `edu.wall.desc` | Жёсткий каркас снаружи мембраны (пептидогликан у бактерий, целлюлоза у растений). Защита и форма. | Rigid frame outside the membrane (peptidoglycan in bacteria, cellulose in plants). Protection and shape. | Marco rígido fuera de la membrana (peptidoglicano en bacterias, celulosa en plantas). Protección y forma. | анатомия / ≤120 |
| 🆕 | `edu.wall.name` | Клеточная стенка | Cell wall | Pared celular | анатомия / ≤120 |
|  | `energy` | Энергия | Energy | Energía | общий UI / ≤60 |
| 🆕 | `ev.acid_rain` | Кислотный дождь | Acid rain | Lluvia ácida | событие / ≤60 |
| 🆕 | `ev.eclipse` | Солнечное затмение | Solar eclipse | Eclipse solar | событие / ≤60 |
| 🆕 | `ev.ended` | {name} закончился | {name} ended | {name} terminó | событие / ≤60 |
| 🆕 | `ev.warn` | ВНИМАНИЕ: {name}! | WARNING: {name}! | ¡AVISO: {name}! | событие / ≤60 |
|  | `exit` | Выход | Exit | Salir | общий UI / ≤60 |
| 🆕 | `fc.consumer1` | грызут зелёных | nibble greens | roen verdes | общий UI / ≤60 |
| 🆕 | `fc.consumer2` | фильтруют мелочь | filter small ones | filtran pequeños | общий UI / ≤60 |
| 🆕 | `fc.consumer3` | едят всех | eat everyone | comen a todos | общий UI / ≤60 |
| 🆕 | `fc.decomposer` | убирают мёртвое | clean up dead | limpian lo muerto | общий UI / ≤60 |
| 🆕 | `fc.producer` | делают еду из света | make food from light | hacen comida de la luz | общий UI / ≤60 |
| 🆕 | `fc.schema` | (схема) | (schematic) | (esquemático) | общий UI / ≤60 |
|  | `filter` | Фильтр | Filter | Filtro | общий UI / ≤60 |
|  | `filterHint` | нажми другую кнопку чтобы сменить | tap another button to switch | toca otro botón para cambiar | общий UI / ≤60 |
|  | `flight` | Полёт | Flight | Vuelo | общий UI / ≤60 |
|  | `follow` | Следить | Follow | Seguir | общий UI / ≤60 |
| 🆕 | `food.decomposer` | мёртвые остатки | dead matter | materia muerta | питание / ≤60 |
| 🆕 | `food.producer` | свет + вода + минералы | light + water + minerals | luz + agua + minerales | питание / ≤60 |
|  | `fps` | FPS | FPS | FPS | общий UI / ≤60 |
|  | `freeCam` | Своб. камера | Free Cam | Cámara libre | общий UI / ≤60 |
|  | `gameTime` | Время | Time | Tiempo | общий UI / ≤60 |
|  | `healthBars` | Шкалы здоровья | Health Bars | Barras de vida | общий UI / ≤60 |
|  | `help` | КАК ИГРАТЬ | HOW TO PLAY | CÓMO JUGAR | общий UI / ≤60 |
| 🆕 | `help.body` | <p><b style="color:#4df">Управление:</b> WASD — плавание. Вверх = поверхность, вниз = дно. ЛКМ — плыть к курсору. Пробел — укус.</p><p><b style="color:#8f8">Кто кого ест (просто):</b></p><p style="line-height:1.45">🌱 <b>Зелёные</b> — не охотятся. Кормятся светом (как растения). Это основной корм пруда.<br>🔵 <b>Мелкие едоки</b> — бактерии. Грызут зелёных.<br>🟠 <b>Средние едоки</b> — инфузории. Фильтруют воду: затягивают бактерий и зелёных. Не прыгают на гигантов.<br>🟣 <b>Крупные охотники</b> — едят зелёных, бактерий и средних. Можно кусать и чуть более крупных (опасно). Без еды живут долго.</p><p><b style="color:#4df">Камера:</b> F — свободный полёт. V — вернуться к клетке. Колесо — зум.</p><p><b style="color:#4df">Деление:</b> Наелся и вырос — делишься на двоих. Q — вручную.</p> | <p><b style="color:#4df">Controls:</b> WASD swim. Space = bite. LMB = swim to cursor.</p><p><b style="color:#8f8">Who eats whom:</b></p><p>🌱 Greens eat light. 🔵 Small eaters eat greens. 🟠 Mid eaters filter bacteria+greens. 🟣 Big hunters eat greens, bacteria and mid-eaters — and can bite slightly larger prey.</p><p><b style="color:#4df">Camera:</b> F free cam, V back to cell. Wheel = zoom.</p><p><b style="color:#4df">Division:</b> Eat, grow, split. Q = manual.</p> | <p><b style="color:#4df">Controles:</b> WASD nadar. Espacio = morder. Clic izquierdo = nadar al cursor.</p><p><b style="color:#8f8">Quién come a quién:</b></p><p>🌱 Los verdes comen luz. 🔵 Los comedores pequeños comen verdes. 🟠 Los comedores medios filtran bacterias+verdes. 🟣 Los grandes cazadores comen verdes, bacterias y comedores medios, y pueden morder presas algo mayores.</p><p><b style="color:#4df">Cámara:</b> F cámara libre, V volver a la célula. Rueda = zoom.</p><p><b style="color:#4df">División:</b> Come, crece, divídete. Q = manual.</p> | помощь / ≤200 |
|  | `hud.btn.auto` | АВТО | AUTO | AUTO | HUD кнопка / ≤14 |
|  | `hud.btn.auto.short` | АВТО | AUTO | AUTO | HUD кнопка (короткая) / ≤8 |
|  | `hud.btn.cyst` | СПОРА | SPORE | ESPORA | HUD кнопка / ≤14 |
|  | `hud.btn.cyst.short` | СПОРА | SPORE | ESPORA | HUD кнопка (короткая) / ≤8 |
|  | `hud.btn.divide` | ДЕЛИТЬ | DIVIDE | DIVIDIR | HUD кнопка / ≤14 |
|  | `hud.btn.divide.short` | ДЕЛИТЬ | DIVIDE | DIVIDIR | HUD кнопка (короткая) / ≤8 |
|  | `hud.btn.eat` | ЕСТЬ | EAT | COMER | HUD кнопка / ≤14 |
|  | `hud.btn.eat.short` | ЕСТЬ | EAT | COMER | HUD кнопка (короткая) / ≤8 |
|  | `hud.btn.light` | СВЕТ | LIGHT | LUZ | HUD кнопка / ≤14 |
|  | `hud.btn.light.short` | СВЕТ | LIGHT | LUZ | HUD кнопка (короткая) / ≤8 |
|  | `hud.btn.menu` | Меню | Menu | Menú | HUD кнопка / ≤14 |
|  | `hud.divide.reason.age` | слишком молода | too young | muy joven | HUD / ≤40 |
|  | `hud.divide.reason.busy` | идёт деление | dividing | dividiendo | HUD / ≤40 |
|  | `hud.divide.reason.cd` | перезарядка {sec} с | cooldown {sec} s | recarga {sec} s | HUD / ≤40 |
|  | `hud.divide.reason.energy` | энергия {cur}/{need} | energy {cur}/{need} | energía {cur}/{need} | HUD / ≤40 |
|  | `hud.divide.reason.mass` | масса {cur}/{need} | mass {cur}/{need} | masa {cur}/{need} | HUD / ≤40 |
|  | `hud.divide.reason.none` | нет клетки | no cell | sin célula | HUD / ≤40 |
|  | `hud.divide.reason.size` | размер {cur}/{need} | size {cur}/{need} | tamaño {cur}/{need} | HUD / ≤40 |
| 🆕 | `hud.genSep` |  · Gen  |  · Gen  |  · Gen  | HUD / ≤40 |
|  | `hud.goal` | Поделись: {cur}/{need} | Divide: {cur}/{need} | Divídete: {cur}/{need} | HUD / ≤40 |
| 🆕 | `kh.hide` | Свернуть | Hide keys | Ocultar teclas | общий UI / ≤60 |
| 🆕 | `kh.keys` | Клавиши | Keys | Teclas | общий UI / ≤60 |
| 🆕 | `lb.title` | 🏆 Таблица лидеров | 🏆 Leaderboard | 🏆 Clasificación | общий UI / ≤60 |
| 🆕 | `leg.apex` | Крупные охотники | Apex hunters | Grandes cazadores | общий UI / ≤60 |
| 🆕 | `leg.bacteria` | Бактерии | Bacteria | Bacterias | общий UI / ≤60 |
| 🆕 | `leg.decomp` | Разлагатели | Decomposers | Descomponedores | общий UI / ≤60 |
| 🆕 | `leg.large` | Крупные | Large | Grandes | общий UI / ≤60 |
| 🆕 | `leg.producer` | Водоросли | Algae | Algas | общий UI / ≤60 |
| 🆕 | `leg.virus` | Вирусы | Viruses | Virus | общий UI / ≤60 |
|  | `legend` | Легенда | Legend | Leyenda | общий UI / ≤60 |
|  | `light` | Свет | Light | Luz | общий UI / ≤60 |
|  | `lightInt` | Инт. света | Light Intensity | Int. de luz | общий UI / ≤60 |
|  | `map` | Карта | Map | Mapa | общий UI / ≤60 |
|  | `mapChart` | Карта и график | Map and chart | Mapa y gráfico | общий UI / ≤60 |
|  | `mapTip` | Миникарта — где вы в пруду. Клик = прыжок камеры. | Minimap: where you are in the pond. Click jumps the camera. | Minimapa: dónde estás en el estanque. Un clic mueve la cámara. | общий UI / ≤60 |
|  | `massWord` | Масса | Mass | Masa | общий UI / ≤60 |
|  | `maxPop` | Макс. поп | Max Pop | Pob. máx. | общий UI / ≤60 |
|  | `menu` | В МЕНЮ | MENU | MENÚ | общий UI / ≤60 |
|  | `menuSub` | Симуляция микроорганизмов — 100 видов + вирусы. Разрез водоёма сбоку. | Microorganism Simulation — 100 species + viruses. Pond cross-section view. | Simulación de microbios — 100 especies + virus. Corte del estanque. | общий UI / ≤60 |
| 🆕 | `mic.scope` | МИКРОСКОП × | MICROSCOPE × | MICROSCOPIO × | микроскоп / ≤30 |
|  | `microscope` | Микроскоп | Microscope | Microscopio | общий UI / ≤60 |
|  | `midEaterTip` | Средний едок: подплыви к зелёным/бактериям — реснички фильтруют сами. | Mid eater: swim to greens or bacteria. Cilia filter on their own. | Comedor medio: nada hacia los verdes o las bacterias. Los cilios filtran solos. | общий UI / ≤60 |
| 🆕 | `mob.eSep` |  · E= |  · E= |  · E= | моб. UI / ≤30 |
| 🆕 | `mob.infected` |  · 🦠 заражён |  · 🦠 infected |  · 🦠 infectado | моб. UI / ≤30 |
| 🆕 | `mob.you` |  · ВЫ |  · YOU |  · TÚ | моб. UI / ≤30 |
| 🆕 | `mode.swissLbl` | 📗 SWISS | 📗 SWISS | 📗 SWISS | общий UI / ≤60 |
| 🆕 | `mode.webglLbl` | 🌊 WEBGL | 🌊 WEBGL | 🌊 WEBGL | общий UI / ≤60 |
| 🆕 | `modeBig.cartoon` | 🎨 CARTOON | 🎨 CARTOON | 🎨 CARICATURA | общий UI / ≤60 |
| 🆕 | `modeBig.swiss` | 📗 SWISSBIOPICS | 📗 SWISSBIOPICS | 📗 SWISSBIOPICS | общий UI / ≤60 |
| 🆕 | `modeBig.webgl` | 🌊 WEBGL | 🌊 WEBGL | 🌊 WEBGL | общий UI / ≤60 |
| 🆕 | `modeLbl.cartoon` | 🎨 Cartoon | 🎨 Cartoon | 🎨 Caricatura | общий UI / ≤60 |
| 🆕 | `modeLbl.swiss` | 📗 SwissBioPics | 📗 SwissBioPics | 📗 SwissBioPics | общий UI / ≤60 |
| 🆕 | `modeLbl.webgl` | 🌊 WebGL | 🌊 WebGL | 🌊 WebGL | общий UI / ≤60 |
|  | `next` | Далее | Next | Siguiente | общий UI / ≤60 |
|  | `noSpecies` | Нет видов в категории «{cat}». Нажмите «Все». | No species in "{cat}". Tap All. | No hay especies en «{cat}». Toca «Todos». | общий UI / ≤60 |
|  | `offspring` | Потомков | Offspring | Descendencia | общий UI / ≤60 |
|  | `particles` | Частицы | Particles | Partículas | общий UI / ≤60 |
|  | `paused` | ПАУЗА | PAUSED | PAUSA | общий UI / ≤60 |
|  | `picMode` | Режим картинки | Picture mode | Modo imagen | общий UI / ≤60 |
|  | `play` | Играть | Play | Jugar | общий UI / ≤60 |
|  | `poolWill` | В бассейне будет: ~{n} организмов · {kinds} видов | Pool will have: ~{n} organisms · {kinds} species | El estanque tendrá: ~{n} organismos · {kinds} especies | общий UI / ≤60 |
|  | `pop` | Поп-ция | Pop | Pob. | общий UI / ≤60 |
|  | `popTip` | График популяции — сколько микробов во времени. | Population chart: how many microbes over time. | Gráfico de población: cuántos microbios hay con el tiempo. | общий UI / ≤60 |
|  | `predation` | Хищники | Predators | Depredadores | общий UI / ≤60 |
|  | `producer` | Зелёные (корм) | Greens (food) | Verdes (comida) | общий UI / ≤60 |
|  | `rainy` | Дождь | Rain | Lluvia | общий UI / ≤60 |
|  | `ready` | ГОТОВО | READY | LISTO | общий UI / ≤60 |
|  | `restart` | ЗАНОВО | RESTART | REINICIAR | общий UI / ≤60 |
|  | `resume` | ПРОДОЛЖИТЬ | RESUME | CONTINUAR | общий UI / ≤60 |
| 🆕 | `role.consumer1` | Мелкие едоки (бактерии). Кусают зелёных. Сами — еда для средних и крупных. | Small eaters (bacteria). Nibble greens. Food for mid and big eaters. | Comedores pequeños (bacterias). Roen verdes. Son comida para comedores medios y grandes. | карточка роли / ≤80 |
| 🆕 | `role.consumer2` | Средние едоки (инфузории). Фильтруют воду: затягивают бактерий и зелёных. Не кидаются на гигантов. | Mid eaters (ciliates). Filter water: pull in bacteria and greens. Do not tackle giants. | Comedores medios (ciliados). Filtran el agua: atraen bacterias y verdes. No atacan a gigantes. | карточка роли / ≤80 |
| 🆕 | `role.consumer3` | Крупные охотники. Едят зелёных, бактерий и средних. Могут кусать и тех, кто чуть крупнее — но это рискованно. Без еды живут долго, но голод всё равно опасен. | Big hunters. Eat greens, bacteria and mid-eaters. Can bite slightly larger prey — risky. Live long without food, but hunger still kills. | Grandes cazadores. Comen verdes, bacterias y comedores medios. Pueden morder presas algo mayores, pero es arriesgado. Viven mucho sin comida, pero el hambre igual mata. | карточка роли / ≤80 |
| 🆕 | `role.decomposer` | Уборщики. Разлагают мёртвое — не охотятся на живых. | Cleaners. Break down the dead — do not hunt the living. | Descomponedores. Descomponen lo muerto, no cazan vivos. | карточка роли / ≤80 |
| 🆕 | `role.macrophage` | Стражи. Атакуют больных и опасных — «иммунитет» пруда. | Guards. Attack sick/dangerous cells — the pond immune system. | Guardianes. Atacan células enfermas o peligrosas: el sistema inmune del estanque. | карточка роли / ≤80 |
| 🆕 | `role.producer` | Зелёные. Не охотятся. Едят свет и воду — как крошечные растения. Кормят всех остальных. | Greens. No hunting. They eat light and water — tiny plants. Feed everyone else. | Verdes. No cazan. Comen luz y agua, como pequeñas plantas. Alimentan a todos los demás. | карточка роли / ≤80 |
|  | `roleFood` | Еда | Food | Comida | карточка роли / ≤80 |
|  | `roleHint` | Подсказка: еда подсвечена цветным кольцом. Полоска «Запах еды» справа вверху. | Hint: food is marked with a colored ring. The food-scent bar is at the top right. | Pista: la comida tiene un anillo de color. La barra de olor a comida está arriba a la derecha. | карточка роли / ≤80 |
|  | `roleOk` | Понятно — плыву | Got it — I'll swim | Entendido — voy a nadar | карточка роли / ≤80 |
|  | `roleWho` | Ты кто / кого ешь | Who you are / what you eat | Quién eres / qué comes | карточка роли / ≤80 |
|  | `season0` | Весна | Spring | Primavera | общий UI / ≤60 |
|  | `season1` | Лето | Summer | Verano | общий UI / ≤60 |
|  | `season2` | Осень | Autumn | Otoño | общий UI / ≤60 |
|  | `season3` | Зима | Winter | Invierno | общий UI / ≤60 |
|  | `selectSp` | Выберите организм | Select organism | Elige el organismo | общий UI / ≤60 |
|  | `set` | НАСТРОЙКИ | SETTINGS | AJUSTES | настройки / ≤40 |
|  | `settingsT` | Настройки | Settings | Ajustes | настройки / ≤40 |
|  | `shadows` | Тени | Shadows | Sombras | общий UI / ≤60 |
|  | `shown` | показано | shown | mostradas | общий UI / ≤60 |
|  | `simSpeed` | Скорость | Speed | Velocidad | общий UI / ≤60 |
|  | `skip` | Пропустить | Skip | Saltar | общий UI / ≤60 |
| 🆕 | `sp.1000` | Губка (фильтратор) | Sponge (Filter Feeder) | Esponja (Filtro) | имя вида / ≤40 |
| 🆕 | `sp.1001` | Половая эукариота | Sexual Eukaryote | Eucariota sexual | имя вида / ≤40 |
| 🆕 | `sp.999` | Макрофаг (Иммунитет) | Macrophage (Immunity) | Macrófago (Inmunidad) | имя вида / ≤40 |
| 🆕 | `spcard.virus` | Вирус | Virus | Virus | общий UI / ≤60 |
|  | `speciesWord` | видов | species | especies | общий UI / ≤60 |
| 🆕 | `star.alphacentauri` | ★ Альфа Центавра A+B | ★ Alpha Centauri A+B | ★ Alfa Centauri A+B | звезда / ≤40 |
| 🆕 | `star.antares` | ★ Антарес | ★ Antares | ★ Antares | звезда / ≤40 |
| 🆕 | `star.betelgeuse` | ★ Бетельгейзе | ★ Betelgeuse | ★ Betelgeuse | звезда / ≤40 |
| 🆕 | `star.binary` | ★ Двойная (синяя+оранжевая) | ★ Binary (blue+orange) | ★ Binaria (azul+naranja) | звезда / ≤40 |
| 🆕 | `star.dwarf` | ★ Красный карлик | ★ Red dwarf | ★ Enana roja | звезда / ≤40 |
| 🆕 | `star.flare` | ★ Вспышечная (UV Ceti) | ★ Flare star (UV Ceti) | ★ Fulgurante (UV Ceti) | звезда / ≤40 |
| 🆕 | `star.giant` | ★ Оранжевый гигант | ★ Orange giant | ★ Gigante naranja | звезда / ≤40 |
| 🆕 | `star.polaris` | ★ Полярная | ★ Polaris | ★ Estrella Polar | звезда / ≤40 |
| 🆕 | `star.pulsar` | ★ Нейтронная (пульсар) | ★ Neutron (pulsar) | ★ Neutrón (púlsar) | звезда / ≤40 |
| 🆕 | `star.quadruple` | ★★★★ Четверная | ★★★★ Quadruple | ★★★★ Cuádruple | звезда / ≤40 |
| 🆕 | `star.rigel` | ★ Ригель | ★ Rigel | ★ Rigel | звезда / ≤40 |
| 🆕 | `star.sirius` | ★ Сириус A+B | ★ Sirius A+B | ★ Sirio A+B | звезда / ≤40 |
| 🆕 | `star.sol` | ☀ Солнце | ☀ Sun | ☀ Sol | звезда / ≤40 |
| 🆕 | `star.trinary` | ★★★ Тройная | ★★★ Triple | ★★★ Triple | звезда / ≤40 |
| 🆕 | `star.twin` | ★★ Близнецы | ★★ Twins | ★★ Gemelas | звезда / ≤40 |
| 🆕 | `star.vega` | ★ Вега | ★ Vega | ★ Vega | звезда / ≤40 |
| 🆕 | `starg.alphacentauri` | ★ α Центавра | ★ α Centauri | ★ α Centauri | звезда / ≤40 |
| 🆕 | `starg.sirius` | ★ Сириус | ★ Sirius | ★ Sirio | звезда / ≤40 |
|  | `start` | НАЧАТЬ | START | EMPEZAR | общий UI / ≤60 |
|  | `swissNow` | Сейчас: SwissBioPics. Клик → WebGL. | Now: Swiss. Click for WebGL. | Ahora: Swiss. Clic para WebGL. | общий UI / ≤60 |
|  | `temp` | Т° | Temp | Temp. | общий UI / ≤60 |
| 🆕 | `tip.ageBar` | Возраст существа. Старые клетки теряют энергию быстрее. | Creature age. Old cells lose energy faster. | Edad de la criatura. Las células viejas pierden energía más rápido. | общий UI / ≤60 |
| 🆕 | `tip.auto` | Авто | Auto | Auto | общий UI / ≤60 |
| 🆕 | `tip.cartoon` | Мультяшный. Клик → SwissBioPics | Cartoon. Click -> SwissBioPics | Caricatura. Clic -> SwissBioPics | общий UI / ≤60 |
| 🆕 | `tip.cbFilter` | Фильтр организмов. Нажмите, чтобы показать только этот вид в меню. | Organism filter. Click to show only this species in the menu. | Filtro de organismos. Pulsa para mostrar solo esta especie en el menú. | общий UI / ≤60 |
| 🆕 | `tip.cyst` | Спора | Spore | Espora | общий UI / ≤60 |
| 🆕 | `tip.daysL` | Игровые дни. Смена сезонов влияет на температуру. | Game days. Season changes affect temperature. | Días de juego. Los cambios de estación afectan la temperatura. | общий UI / ≤60 |
| 🆕 | `tip.divide` | Делить | Split | Dividir | общий UI / ≤60 |
| 🆕 | `tip.eat` | Есть | Eat | Comer | общий UI / ≤60 |
| 🆕 | `tip.energyBar` | Энергия существа. Падает со временем. Если дойдет до нуля — смерть от голода. | Creature energy. Drops over time. At zero — death by starvation. | Energía de la criatura. Baja con el tiempo. A cero, muerte por hambre. | общий UI / ≤60 |
| 🆕 | `tip.feed` | Ручное питание | Manual feed | Alimentación manual | общий UI / ≤60 |
| 🆕 | `tip.fly` | Свободный полёт: F или WASD / мышь | Free flight: F or WASD / mouse | Vuelo libre: F o WASD / ratón | общий UI / ≤60 |
| 🆕 | `tip.follow` | Следить | Follow | Seguir | общий UI / ≤60 |
| 🆕 | `tip.fpsL` | Кадры в секунду (FPS). Показывает производительность игры. | Frames per second (FPS). Shows game performance. | Cuadros por segundo (FPS). Muestra el rendimiento del juego. | общий UI / ≤60 |
| 🆕 | `tip.lang` | Выбор языка (Language Selector) | Language selector | Selector de idioma | общий UI / ≤60 |
| 🆕 | `tip.lightL` | Уровень освещенности. Важен для фотосинтеза водорослей. | Light level. Important for algae photosynthesis. | Nivel de luz. Importante para la fotosíntesis de las algas. | общий UI / ≤60 |
| 🆕 | `tip.microMode` | Режим микроскопа | Microscope Mode | Modo microscopio | общий UI / ≤60 |
| 🆕 | `tip.pause` | Пауза | Pause | Pausa | общий UI / ≤60 |
| 🆕 | `tip.popC` | График популяции. Показывает историю рождений и смертей. | Population chart. Shows birth and death history. | Gráfico de población. Muestra la historia de nacimientos y muertes. | общий UI / ≤60 |
| 🆕 | `tip.render` | Картинка: мульт / Swiss | Picture: cartoon / Swiss | Imagen: caricatura / Swiss | общий UI / ≤60 |
| 🆕 | `tip.starSel` | Выбор звезды/солнца | Select star/sun | Elegir estrella/sol | общий UI / ≤60 |
| 🆕 | `tip.swiss` | SwissBioPics. Клик → WebGL | SwissBioPics. Click -> WebGL | SwissBioPics. Clic -> WebGL | общий UI / ≤60 |
| 🆕 | `tip.tempL` | Температура воды. Влияет на метаболизм и выживание. | Water temperature. Affects metabolism and survival. | Temperatura del agua. Afecta el metabolismo y la supervivencia. | общий UI / ≤60 |
| 🆕 | `tip.webgl` | WebGL-вода. Клик → мультяшный | WebGL water. Click -> cartoon | Agua WebGL. Clic -> caricatura | общий UI / ≤60 |
| 🆕 | `tip.wikiB` | Вики/Бестиарий | Wiki/Bestiary | Wiki/Bestiario | общий UI / ≤60 |
| 🆕 | `tip.zi` | Zoom+ | Zoom+ | Zoom+ | общий UI / ≤60 |
| 🆕 | `tip.zo` | Zoom- | Zoom- | Zoom- | общий UI / ≤60 |
| 🆕 | `toast.auto.eat` | АВТО: съел | AUTO: ate | AUTO: comió | тост / ≤60 |
| 🆕 | `toast.auto.gain` | АВТО: +{e} энергия | AUTO: +{e} energy | AUTO: +{e} energía | тост / ≤60 |
| 🆕 | `toast.bite` | КУСЬ! {name} | BITE! {name} | ¡MORDIDA! {name} | тост / ≤60 |
| 🆕 | `toast.biteBig` | Откусил кусок — крупная добыча! | Bit off a chunk — big prey! | ¡Arrancó un pedazo, presa grande! | тост / ≤60 |
| 🆕 | `toast.biteGain` | Укус +{e} эн / +{m} м | Bite +{e} en / +{m} m | Mordida +{e} en / +{m} m | тост / ≤60 |
| 🆕 | `toast.cilia.filter` | Реснички: фильтр-питание | Cilia: filter feeding | Cilios: alimentación por filtro | тост / ≤60 |
| 🆕 | `toast.controls` | Управление: WASD / мышь · ЕСТЬ (E) · ДЕЛИТЬ (Q) | Controls: WASD / mouse · EAT (E) · DIVIDE (Q) | Controles: WASD / ratón · COMER (E) · DIVIDIR (Q) | тост / ≤60 |
|  | `toast.cyst.enter` | Спора: защита, движение 0, энергия тратится медленно | Spore: protected, speed 0, energy drains slowly | Espora: protegida, movimiento 0, la energía baja despacio | тост / ≤60 |
|  | `toast.cyst.exit` | Вышел из споры | Left the spore | Saliste de la espora | тост / ≤60 |
|  | `toast.cyst.hunger` | Голод: впал в цисту — найди еду и проснись | Hunger: encysted — find food and wake | Hambre: te enquistaste — busca comida y despierta | тост / ≤60 |
| 🆕 | `toast.digest` | Пищеварение... ({s}с) | Digesting... ({s}s) | Digiriendo... ({s}s) | тост / ≤60 |
| 🆕 | `toast.divfail` | Деление: вторая клетка не создалась | Division: second cell failed to form | División: la segunda célula no se formó | тост / ≤60 |
|  | `toast.divide.blocked` | Пока нельзя делиться | Cannot divide yet | Aún no puedes dividirte | тост / ≤60 |
|  | `toast.divide.go` | Деление | Dividing | Dividiendo | тост / ≤60 |
| 🆕 | `toast.divided` | Деление! | Divided! | ¡Dividido! | тост / ≤60 |
|  | `toast.eat.closer` | Ближе к добыче | Closer to prey | Más cerca de la presa | тост / ≤60 |
|  | `toast.eat.none` | Рядом нет добычи — подплыви ближе | No prey nearby — swim closer | No hay presa cerca — nada más cerca | тост / ≤60 |
| 🆕 | `toast.eat.noneAuto` | Рядом нет добычи — включи АВТО или подплыви | No prey nearby — enable AUTO or swim closer | Sin presa cerca, activa AUTO o nada más cerca | тост / ≤60 |
|  | `toast.eat.ok` | Съел | Ate | Comiste | тост / ≤60 |
|  | `toast.eat.plant` | Ты растение: плыви к свету | You are a plant: swim toward the light | Eres una planta: nada hacia la luz | тост / ≤60 |
| 🆕 | `toast.extinct` | Вид {name} вымер! | Species {name} went extinct! | ¡La especie {name} se extinguió! | тост / ≤60 |
| 🆕 | `toast.filter.catch` | Фильтр: затянул добычу | Filter: pulled in prey | Filtro: atrapó presa | тост / ≤60 |
| 🆕 | `toast.filter.catch2` | Фильтр: захватил добычу | Filter: captured prey | Filtro: capturó presa | тост / ≤60 |
| 🆕 | `toast.gain` | +{e} эн / +{m} масса | +{e} en / +{m} mass | +{e} en / +{m} masa | тост / ≤60 |
| 🆕 | `toast.infected` | Клетка инфицирована! Лизис через 10-20с | Cell infected! Lysis in 10-20s | ¡Célula infectada! Lisis en 10-20s | тост / ≤60 |
|  | `toast.lang.fallback` | Язык не включён, показан английский | Language is off, showing English | Idioma aún no disponible; se muestra en inglés | тост / ≤60 |
| 🆕 | `toast.microOff` | Микроскоп выкл | Microscope off | Microscopio apagado | тост / ≤60 |
| 🆕 | `toast.microOn` | 🔬 Микроскоп: вода остаётся, зум+сетка (не режим N) | 🔬 Microscope: water stays, zoom+grid (not mode N) | 🔬 Microscopio: el agua permanece, zoom+cuadrícula (no modo N) | тост / ≤60 |
| 🆕 | `toast.noPlayer` | Нет игрока | No player | Sin jugador | тост / ≤60 |
| 🆕 | `toast.parasite.gone` | Паразит сброшен | Parasite shed | Parásito expulsado | тост / ≤60 |
| 🆕 | `toast.webglFail` | WebGL недоступен — возврат в мультяшный | WebGL unavailable — falling back to cartoon | WebGL no disponible, se vuelve a caricatura | тост / ≤60 |
|  | `topOfList` | вверху списка | top of the list | al principio de la lista | общий UI / ≤60 |
| 🆕 | `tut.s1.body` | Вы — микроорганизм в луже. Цель: есть, расти, делиться. Нажмите «Далее». | You are a microbe in a pond. Goal: eat, grow, divide. Tap Next. | Eres un microbio en un estanque. Objetivo: comer, crecer, dividir. Toca Siguiente. | обучение / ≤200 |
| 🆕 | `tut.s1.title` | Добро пожаловать | Welcome | Bienvenido | обучение / ≤200 |
| 🆕 | `tut.s2.body` | WASD — плыть. Мышь задаёт направление. Попробуйте сдвинуться, затем «Далее». | WASD to swim. The mouse sets direction. Move, then tap Next. | WASD para nadar. El ratón marca la dirección. Muévete y toca Siguiente. | обучение / ≤200 |
| 🆕 | `tut.s2.title` | Движение | Movement | Movimiento | обучение / ≤200 |
| 🆕 | `tut.s3.body` | Подойдите к меньшей клетке и нажмите ЕСТЬ (E). Должны появиться вспышка и «+энергия». | Swim to a smaller cell and press EAT (E). You should see a flash. | Nada hasta una célula más pequeña y pulsa COMER (E). Deberías ver un destello. | обучение / ≤200 |
| 🆕 | `tut.s3.title` | Питание | Eating | Alimentación | обучение / ≤200 |
| 🆕 | `tut.s4.body` | При полной энергии нажмите ДЕЛИТЬ (Q). Клетка станет заметно меньше — это нормально. | When energy is full, press SPLIT (Q). The cell gets smaller. That is normal. | Cuando la energía esté llena, pulsa DIVIDIR (Q). La célula se hace más pequeña. Eso es normal. | обучение / ≤200 |
| 🆕 | `tut.s4.title` | Деление | Division | División | обучение / ≤200 |
| 🆕 | `tut.s5.body` | Камера: СЛЕДИТЬ / ПОЛЁТ. Картинка: МУЛЬТЯШНЫЙ или SWISS. Удачи в эволюции! | Camera: follow or free flight. Good luck evolving! | Cámara: seguir o vuelo libre. ¡Suerte evolucionando! | обучение / ≤200 |
| 🆕 | `tut.s5.title` | Готово | Done | Listo | обучение / ≤200 |
|  | `tutDone` | Туториал пройден | Tutorial done | Tutorial completado | общий UI / ≤60 |
|  | `vignette` | Виньетка | Vignette | Viñeta | общий UI / ≤60 |
|  | `virus` | Вирусы | Viruses | Virus | общий UI / ≤60 |
|  | `virusMode` | Режим вируса: {name}. Кликни по бактерии = инфицировать. WASD = камера. | Virus mode: {name}. Click a bacterium to infect. WASD moves the camera. | Modo virus: {name}. Haz clic en una bacteria para infectarla. WASD mueve la cámara. | общий UI / ≤60 |
|  | `virusRate` | Частота вирусов | Virus Rate | Tasa de virus | общий UI / ≤60 |
|  | `webglNow` | Сейчас: WebGL-вода. Клик → мультяшный. | Now: WebGL water. Click for cartoon. | Ahora: agua WebGL. Clic para caricatura. | общий UI / ≤60 |
| 🆕 | `wgl.diff1` | Фон воды рисует WebGL-шейдер (рябь, каустика, блик) | Water background drawn by WebGL shader (ripples, caustics, glints) | El fondo de agua lo dibuja un shader de WebGL (ondas, cáusticas, destellos) | общий UI / ≤60 |
| 🆕 | `wgl.diff2` | Основной canvas прозрачный поверх GL | Main canvas transparent over GL | Lienzo principal transparente sobre GL | общий UI / ≤60 |
| 🆕 | `wgl.same1` | Мир и организмы на Canvas 2D | World and organisms on Canvas 2D | Mundo y organismos en Canvas 2D | общий UI / ≤60 |
| 🆕 | `wgl.same2` | Управление/еда/движение без смены симуляции | Controls/food/movement without simulation change | Controles/comida/movimiento sin cambiar la simulación | общий UI / ≤60 |
|  | `wiki` | ВИКИ | WIKI | WIKI | общий UI / ≤60 |
| 🆕 | `wiki.def.shell` | Кремниевый панцирь | Silica shell | Caparazón de sílice | вики / ≤300 |
| 🆕 | `wiki.def.spikes` | Шипы | Spikes | Espinas | вики / ≤300 |
| 🆕 | `wiki.def.toxic` | Токсичность | Toxicity | Toxicidad | вики / ≤300 |
| 🆕 | `wiki.def.venom` | Яд | Venom | Veneno | вики / ≤300 |
| 🆕 | `wiki.defs` | Особенности: | Features: | Rasgos: | вики / ≤300 |
| 🆕 | `wiki.div.binary` | Деление надвое | Binary fission | Fisión binaria | вики / ≤300 |
| 🆕 | `wiki.div.budding` | Почкование | Budding | Gemación | вики / ≤300 |
| 🆕 | `wiki.searchPh` | Поиск… | Search... | Buscar... | вики / ≤300 |
|  | `wikiT` | Вики: жители лужи | Wiki: Pond Life | Wiki: vida del estanque | общий UI / ≤60 |
| 🆕 | `x.a` | Взр | A | Edad | метки/подписи / ≤60 |
| 🆕 | `x.alive` | Живых | Alive | Vivo | метки/подписи / ≤60 |
| 🆕 | `x.bacteriophageInfectsBacteriaCauses` | Бактериофаг. Заражает бактерии, вызывает лизис. | Bacteriophage. Infects bacteria, causes lysis. | Bacteriófago. Infecta bacterias y causa lisis. | метки/подписи / ≤60 |
| 🆕 | `x.born` | Родилось | Born | Nacidos | метки/подписи / ≤60 |
| 🆕 | `x.chloroplasts` | хлоропласты | chloroplasts | cloroplastos | метки/подписи / ≤60 |
| 🆕 | `x.cilia` | реснички | cilia | cilios | метки/подписи / ≤60 |
| 🆕 | `x.contractileVacuole` | сокр. вакуоль | contractile vacuole | vacuola contráctil | метки/подписи / ≤60 |
| 🆕 | `x.cover` |  · укрытие |  · cover |  · refugio | метки/подписи / ≤60 |
| 🆕 | `x.currentlyAlive` | Сейчас живы | Currently alive | Vivos ahora | метки/подписи / ≤60 |
| 🆕 | `x.cyst` | Циста | Cyst | Quiste | метки/подписи / ≤60 |
| 🆕 | `x.cyst2` |  · ЦИСТА |  · CYST |  · QUISTE | метки/подписи / ≤60 |
| 🆕 | `x.dead` | Погибло | Dead | Muertos | метки/подписи / ≤60 |
| 🆕 | `x.dividing` | Делится | Dividing | Dividiéndose | метки/подписи / ≤60 |
| 🆕 | `x.division` | Деление | Division | División | метки/подписи / ≤60 |
| 🆕 | `x.e` | Эн | E | En | метки/подписи / ≤60 |
| 🆕 | `x.flagella` | жгутик | flagella | flagelo | метки/подписи / ≤60 |
| 🆕 | `x.food` | Пища | Food | Comida | метки/подписи / ≤60 |
| 🆕 | `x.foodScent` | Запах еды | Food scent | Rastro de comida | метки/подписи / ≤60 |
| 🆕 | `x.golgi` | гольджи | Golgi | golgi | метки/подписи / ≤60 |
| 🆕 | `x.healthy` | Здоров | Healthy | Sano | метки/подписи / ≤60 |
| 🆕 | `x.infected` | Заражен | Infected | Infectado | метки/подписи / ≤60 |
| 🆕 | `x.infected2` | Заражен! | Infected! | ¡Infectado! | метки/подписи / ≤60 |
| 🆕 | `x.infected3` | Инфицировано | Infected | Infectado | метки/подписи / ≤60 |
| 🆕 | `x.locomotion` | Движение | Locomotion | Locomoción | метки/подписи / ≤60 |
| 🆕 | `x.lysed` | Лизировано | Lysed | Lizado | метки/подписи / ≤60 |
| 🆕 | `x.macroMicronucleus` | макро/микронуклеус | macro/micronucleus | macro/micronúcleo | метки/подписи / ≤60 |
| 🆕 | `x.mitochondria` | митохондрии | mitochondria | mitocondrias | метки/подписи / ≤60 |
| 🆕 | `x.move` | Движение | Move | Mover | метки/подписи / ≤60 |
| 🆕 | `x.nothingFound` | Ничего не найдено. | Nothing found. | Nada encontrado. | метки/подписи / ≤60 |
| 🆕 | `x.nucleus` | ядро | nucleus | núcleo | метки/подписи / ≤60 |
| 🆕 | `x.organelles` | Органеллы | Organelles | Orgánulos | метки/подписи / ≤60 |
| 🆕 | `x.phages` | Фагов | Phages | Fagos | метки/подписи / ≤60 |
| 🆕 | `x.pondStatistics` | Статистика Водоёма | Pond Statistics | Estadísticas del estanque | метки/подписи / ≤60 |
| 🆕 | `x.predators` | Враги | Predators | Depredadores | метки/подписи / ≤60 |
| 🆕 | `x.pseudopodia` | псевдоподии | pseudopodia | pseudópodos | метки/подписи / ≤60 |
| 🆕 | `x.s` | Рзм | S | Tam | метки/подписи / ≤60 |
| 🆕 | `x.scaleBar` | Масштаб: 100 мкм | Scale: 100 µm | Escala: 100 µm | метки/подписи / ≤60 |
| 🆕 | `x.size` | Размер | Size | Tamaño | метки/подписи / ≤60 |
| 🆕 | `x.starving` | Голод | Starving | Hambriento | метки/подписи / ≤60 |
| 🆕 | `x.totalBorn` | Всего родилось | Total born | Total nacidos | метки/подписи / ≤60 |
| 🆕 | `x.trichocysts` | трихоцисты | trichocysts | tricocistos | метки/подписи / ≤60 |
| 🆕 | `x.virusMode` | РЕЖИМ ВИРУСА | VIRUS MODE | MODO VIRUS | метки/подписи / ≤60 |
| 🆕 | `x.wasdSwimLmbCursorRmbTargetWheel` | <span><kbd>WASD</kbd> Плывать</span><span><kbd>ЛКМ</kbd> К курсору</span><span><kbd>ПкМ</kbd> Цель</span><span><kbd>Колесо</kbd> Зум</span><span class="kh-sum">Кнопки: E Q R Space Tab F M N V B P</span> | <span><kbd>WASD</kbd> Swim</span><span><kbd>LMB</kbd> Cursor</span><span><kbd>RMB</kbd> Target</span><span><kbd>Wheel</kbd> Zoom</span><span class="kh-sum">Buttons: E Q R Space Tab F M N V B P</span> | <span><kbd>WASD</kbd> Nadar</span><span><kbd>Clic izq</kbd> Cursor</span><span><kbd>Clic der</kbd> Objetivo</span><span><kbd>Rueda</kbd> Zoom</span><span class="kh-sum">Botones: E Q R Space Tab F M N V B P</span> | метки/подписи / ≤60 |
| 🆕 | `x.wasdSwimLmbCursorRmbTargetWheel2` | <span><kbd>WASD</kbd> Плыть</span><span><kbd>ЛКМ</kbd> К курсору</span><span><kbd>ПКМ</kbd> Цель</span><span><kbd>Колесо</kbd> Зум</span><span class="kh-sum">Кнопки: E Q R Space Tab F M N V B P</span> | <span><kbd>WASD</kbd> Swim</span><span><kbd>LMB</kbd> Cursor</span><span><kbd>RMB</kbd> Target</span><span><kbd>Wheel</kbd> Zoom</span><span class="kh-sum">Buttons: E Q R Space Tab F M N V B P</span> | <span><kbd>WASD</kbd> Nadar</span><span><kbd>Clic izq</kbd> Cursor</span><span><kbd>Clic der</kbd> Objetivo</span><span><kbd>Rueda</kbd> Zoom</span><span class="kh-sum">Botones: E Q R Space Tab F M N V B P</span> | метки/подписи / ≤60 |
| 🆕 | `x.wind` | Ветер | Wind | Viento | метки/подписи / ≤60 |
| 🆕 | `x.you` | Это Вы | You | Tú | метки/подписи / ≤60 |
| 🆕 | `x.yourCell` | Ваша клетка | Your cell | Tu célula | метки/подписи / ≤60 |
| 🆕 | `x.yourSpecies` | Ваш вид:  | Your species:  | Tu especie:  | метки/подписи / ≤60 |
| 🆕 | `loc.drift` | дрейф | drift | deriva | вики «Движение» / ≤18 |
| 🆕 | `loc.glide` | скользящий | glide | deslizamiento | вики «Движение» / ≤18 |
| 🆕 | `loc.flagella` | жгутики | flagella | flagelos | вики «Движение» / ≤18 |
| 🆕 | `loc.cilia` | реснички | cilia | cilios | вики «Движение» / ≤18 |
| 🆕 | `loc.ciliaStalk` | реснички на стебельке | cilia on stalk | cilios sobre tallo | вики «Движение» / ≤18 |
| 🆕 | `loc.pseudopodia` | псевдоподии | pseudopodia | pseudópodos | вики «Движение» / ≤18 |
| 🆕 | `loc.sessile` | прикреплённый | sessile | séctil | вики «Движение» / ≤18 |
| 🆕 | `loc.budding` | почкование | budding | gemación | вики «Движение» / ≤18 |
| 🆕 | `loc.growth` | рост | growth | crecimiento | вики «Движение» / ≤18 |

## Вики — тела видов (108)

| id | en | es |
|---|---|---|
| `0` | Synechocystis is a cyanobacterium with no nucleus. It lives on light: oxygenic photosynthesis on membranes, no chloroplasts. Lab model for hydrogen metabolism. | Synechocystis es una cianobacteria sin núcleo. Vive de la luz: fotosíntesis oxigénica en membranas, sin cloroplastos. Modelo de laboratorio del metabolismo del hidrógeno. |
| `1` | Anabaena variabilis is a filament. Some cells become heterocysts and fix nitrogen while neighbours make sugar. In the pond it supplies bound nitrogen. | Anabaena variabilis es un filamento. Algunas células se vuelven heterocistos y fijan nitrógeno mientras las vecinas hacen azúcar. En el estanque suministra nitrógeno fijado. |
| `2` | Spirulina (Arthrospira) is a coil of cells with gas vesicles. It hangs near the surface, photosynthesizes, and is edible. In-game it is a large green screw at the water film. | Spirulina (Arthrospira) es una espiral de células con vesículas de gas. Se mantiene cerca de la superficie, fotosintetiza y es comestible. En el juego es un gran tornillo verde en la película de agua. |
| `3` | Nostoc punctiforme is a bead chain in a slime capsule. It lives free or in plant symbiosis. The colony looks like a clump of green beads. | Nostoc punctiforme es un collar de cuentas en una cápsula de moco. Vive libre o en simbiosis con plantas. La colonia parece un terrón de cuentas verdes. |
| `4` | Oscillatoria limnetica is a gliding filament. It oscillates side to side and can photosynthesize without releasing oxygen. Typical of silt and surface film. | Oscillatoria limnetica es un filamento deslizante. Oscila de lado a lado y puede fotosintetizar sin liberar oxígeno. Típica del lodo y la película superficial. |
| `5` | Microcystis aeruginosa is a mucilage colony, often toxic (microcystin). It causes water bloom. In-game it is a green colony ball, risky prey. | Microcystis aeruginosa es una colonia mucilaginosa, a menudo tóxica (microcistina). Provoca la floración del agua. En el juego es una bola-colonia verde, presa arriesgada. |
| `6` | Gloeocapsa is paired cells in colored sheaths. It lives on rocks and soil and tolerates UV. In the pond it is small paired cocci in a coat. | Gloeocapsa: células apareadas en vainas coloreadas. Vive en rocas y suelo y tolera los UV. En el estanque son pequeños cocos emparejados con envoltura. |
| `7` | Lyngbya majuscula is a thick cyanobacterial filament. It can release irritating toxins. It forms mats near warm shores. | Lyngbya majuscula es un filamento cianobacteriano grueso. Puede liberar toxinas irritantes. Forma esteras junto a orillas cálidas. |
| `8` | Chlamydomonas reinhardtii is a green cell with two flagella and an eyespot. It swims toward light. Classic algal genetics model. | Chlamydomonas reinhardtii es una célula verde con dos flagelos y un estigma. Nada hacia la luz. Modelo clásico de genética de algas. |
| `9` | Chlorella vulgaris is a non-motile green ball. It divides fast and is protein-rich. Food for small eaters and a space-food subject. | Chlorella vulgaris es una bola verde inmóvil. Se divide rápido y es rica en proteínas. Alimento de pequeños devoradores y tema de comida espacial. |
| `10` | Volvox globator is a hollow sphere of thousands of cells. Daughter colonies ripen inside and exit. In-game it is a large green colony. | Volvox globator es una esfera hueca de miles de células. Las colonias hijas maduran dentro y salen. En el juego es una gran colonia verde. |
| `11` | Euglena gracilis is a mixotroph: chloroplasts plus the ability to eat. A red eyespot tracks light. Green by day; in the dark it switches to food. | Euglena gracilis es un mixótrofo: cloroplastos más la capacidad de comer. Un estigma rojo sigue la luz. Verde de día; en la oscuridad pasa a comida. |
| `12` | Scenedesmus quadricauda is usually four cells in a row with end spines. Spines make swallowing harder. It does not swim — it drifts. | Scenedesmus quadricauda suele ser cuatro células en fila con espinas terminales. Las espinas dificultan tragarlo. No nada — va a la deriva. |
| `13` | Haematococcus pluvialis is a green motile cell; under stress it turns red (astaxanthin) and grows a thick wall. Red cysts survive drought. | Haematococcus pluvialis es una célula verde móvil; bajo estrés se vuelve roja (astaxantina) y forma una pared gruesa. Los quistes rojos sobreviven a la sequía. |
| `14` | Dunaliella salina has no rigid wall and lives in very salty water. It stores beta-carotene and looks orange. Two flagella. | Dunaliella salina no tiene pared rígida y vive en agua muy salada. Almacena betacaroteno y luce naranja. Dos flagelos. |
| `15` | Micrasterias rotata is a flat star desmid. Two mirrored halves with deep cuts. Non-motile; photosynthesizes in acidic bog water. | Micrasterias rotata es una désmida plana en forma de estrella. Dos mitades especulares con cortes profundos. Inmóvil; fotosintetiza en agua ácida de turberas. |
| `16` | Navicula is a boat-shaped diatom with a silica valve. It glides on the substrate along a raphe slit. The shell remains after death. | Navicula es una diatomea en forma de barca con valva de sílice. Se desliza por el sustrato a lo largo de una hendidura (rafe). El caparazón queda tras la muerte. |
| `17` | Pinnularia viridis is a large pennate diatom. Silica shell with a symmetric pattern. It glides slowly on the bottom. | Pinnularia viridis es una gran diatomea pennada. Caparazón de sílice con patrón simétrico. Se desliza lentamente por el fondo. |
| `18` | Cyclotella meneghiniana is a circular centric diatom. It floats as a disc; the shell is two lids. Typical plankton. | Cyclotella meneghiniana es una diatomea céntrica circular. Flota como un disco; el caparazón son dos tapas. Plancton típico. |
| `19` | Diatoma vulgare is a diatom that sticks into a zigzag. The colony increases drag in the water column. | Diatoma vulgare es una diatomea que se pega en zigzag. La colonia aumenta el arrastre en la columna de agua. |
| `20` | Rhodospirillum rubrum is a purple spiral. Anoxygenic photosynthesis plus organics. Red color comes from bacteriochlorophyll. | Rhodospirillum rubrum es una espiral púrpura. Fotosíntesis anoxigénica más materia orgánica. El color rojo viene de la bacterioclorofila. |
| `21` | Chromatium vinosum is a purple sulfur bacterium. It oxidizes hydrogen sulfide and stores sulfur granules. Lives at the oxygen/sulfur boundary. | Chromatium vinosum es una bacteria púrpura del azufre. Oxida el sulfuro de hidrógeno y almacena gránulos de azufre. Vive en la frontera oxígeno/azufre. |
| `22` | Porphyridium cruentum is a unicellular red alga. Phycoerythrin gives a blood-red color. Mucilage coat, no flagella. | Porphyridium cruentum es un alga roja unicelular. La ficoeritrina da el color rojo sangre. Envoltura mucilaginosa, sin flagelos. |
| `23` | Prochlorococcus marinus is the smallest and most abundant photosynthetic cell on Earth. Discovered in the 1980s. It feeds the ocean. | Prochlorococcus marinus es la célula fotosintética más pequeña y abundante de la Tierra. Descubierta en los años 1980. Alimenta el océano. |
| `24` | Chroococcidiopsis thermalis is an extremophile: desert, rock, radiation. A candidate for life beyond Earth. In the pond it is a slow coccus colony. | Chroococcidiopsis thermalis es un extremófilo: desierto, roca, radiación. Candidato a vida fuera de la Tierra. En el estanque es una lenta colonia de cocos. |
| `25` | Bdellovibrio bacteriovorus is a tiny bacterial predator. It screws into another cell and multiplies until the host bursts. | Bdellovibrio bacteriovorus es un diminuto depredador bacteriano. Se enrosca dentro de otra célula y se multiplica hasta que el huésped estalla. |
| `26` | Vampirococcus sits on prey from the outside and sucks out the contents without entering. A bacterial vampire. | Vampirococcus se sienta sobre la presa desde fuera y le succiona el contenido sin entrar. Un vampiro bacteriano. |
| `27` | Daptobacter enters a prey bacterium and eats it from inside. A rare intracellular hunter. | Daptobacter entra en una bacteria presa y la come desde dentro. Un raro cazador intracelular. |
| `28` | Myxococcus xanthus is a social bacterium. In a pack it surrounds prey and releases enzymes. When starved it forms a fruiting body. | Myxococcus xanthus es una bacteria social. En manada rodea a la presa y libera enzimas. Con hambre forma un cuerpo fructífero. |
| `29` | Bacteriovorax stolpii is a marine Bdellovibrio relative. It attacks Gram-negatives and lives in the prey periplasm. | Bacteriovorax stolpii es un pariente marino de Bdellovibrio. Ataca a Gram-negativas y vive en el periplasma de la presa. |
| `30` | Halobacteriovorax is a salt-tolerant bacterial hunter. Same trick: puncture the wall and grow inside. | Halobacteriovorax es un cazador de bacterias tolerante a la sal. Mismo truco: perforar la pared y crecer dentro. |
| `31` | Peredibacter starrii is another BALO predator. A fast comma-shaped flagellate targeting large rods. | Peredibacter starrii es otro depredador BALO. Un flagelado veloz en forma de coma que apunta a bacilos grandes. |
| `32` | Monas guttula is a small heterotrophic flagellate. It grabs bacteria at the detritus surface. | Monas guttula es un pequeño flagelado heterótrofo. Atrapa bacterias en la superficie del detrito. |
| `33` | Oikomonas termo is a drop-shaped flagellate. One flagellum; it hunts in bacterial film. | Oikomonas termo es un flagelado en forma de gota. Un flagelo; caza en la película bacteriana. |
| `34` | Anthophysa vegetans is a colony on an iron-manganese stalk. Cells sit in a tuft and catch bacteria. | Anthophysa vegetans es una colonia sobre un pedúnculo de hierro-manganeso. Las células están en mechón y capturan bacterias. |
| `35` | Chilomonas paramecium is a colorless cryptophyte. Two flagella; it eats dissolved organics and tiny bacteria, no chloroplasts. | Chilomonas paramecium es un criptófito incoloro. Dos flagelos; come materia orgánica disuelta y bacterias diminutas, sin cloroplastos. |
| `36` | Cercomonas longicauda is an amoeboflagellate with a long tail. It crawls and swallows bacteria with pseudopodia. | Cercomonas longicauda es un ameboflagelado de cola larga. Se arrastra y engulle bacterias con pseudópodos. |
| `37` | Heteromita globosa is a soil flagellate. Two flagella of different length; a main bacterial eater in soil. | Heteromita globosa es un flagelado del suelo. Dos flagelos de distinta longitud; un gran comedor de bacterias en el suelo. |
| `38` | Bodo saltans is a kinetoplastid. It 'dances' in place, attached by the rear flagellum, and snatches bacteria. | Bodo saltans es un cinetoplástido. «Baila» en el sitio, anclado por el flagelo posterior, y atrapa bacterias. |
| `39` | Procryptobia sorokini is a Bodo relative. It swims freely and strikes prey with the anterior flagellum. | Procryptobia sorokini es un pariente de Bodo. Nada libremente y golpea a la presa con el flagelo anterior. |
| `40` | Trypanosoma brucei is a blood parasite causing sleeping sickness. Undulating membrane and one flagellum. In the pond it is a slim-hunter model. | Trypanosoma brucei es un parásito sanguíneo que causa la enfermedad del sueño. Membrana ondulante y un flagelo. En el estanque es un modelo de cazador esbelto. |
| `41` | Leishmania donovani is an intracellular human parasite. Flagellated in the insect, aflagellate inside a macrophage. | Leishmania donovani es un parásito intracelular humano. Flagelada en el insecto, aflagelada en el macrófago. |
| `42` | Monosiga brevicollis is a choanoflagellate, an animal relative. A microvilli collar filters bacteria. | Monosiga brevicollis es un coanoflagelado, pariente de los animales. Un collar de microvellosidades filtra bacterias. |
| `43` | Salpingoeca rosetta is a sessile choanoflagellate in a lorica. It can form a rosette. It filters a water current. | Salpingoeca rosetta es un coanoflagelado sésil en una lórica. Puede formar una roseta. Filtra una corriente de agua. |
| `44` | Codonosiga botrytis is a choanoflagellate colony on a shared stalk. Several filters on one stem. | Codonosiga botrytis es una colonia de coanoflagelados sobre un pedúnculo común. Varios filtros en un mismo tallo. |
| `45` | Paramecium caudatum is the classic slipper. Thousands of cilia, an oral groove, contractile vacuoles. It filters bacteria. | Paramecium caudatum es la clásica «zapatilla». Miles de cilios, un surco oral, vacuolas contractiles. Filtra bacterias. |
| `46` | Paramecium bursaria is a slipper with zoochlorella symbionts. Green inside: sugar from algae by day, filtering at night. | Paramecium bursaria es una zapatilla con simbiontes zooclorelas. Verde por dentro: azúcar de las algas de día, filtración de noche. |
| `47` | Stentor coeruleus is a blue trumpet up to a millimetre. It flares into a funnel and drives a current with cilia. It can swim or sit. | Stentor coeruleus es una trompeta azul de hasta un milímetro. Se abre en embudo e impulsa corriente con cilios. Puede nadar o quedarse sentado. |
| `48` | Stentor polymorphus is a relative of the blue stentor, often with zoochlorellae. Shape shifts from trumpet to ball. | Stentor polymorphus es un pariente del stentor azul, a menudo con zooclorelas. La forma pasa de trompeta a bola. |
| `49` | Vorticella campanula is a bell on a contractile stalk. The stalk coils into a spiral instantly. The cell itself does not swim away. | Vorticella campanula es una campanilla sobre pedúnculo contráctil. El pedúnculo se enrosca en espiral al instante. La célula en sí no huye nadando. |
| `50` | Vorticella microstoma is a small bell. Same spring-stalk, a narrower oral field. Often on detritus. | Vorticella microstoma es una pequeña campanilla. Mismo pedúnculo-resorte, campo oral más estrecho. A menudo sobre detrito. |
| `51` | Didinium nasutum is a barrel hunter of slippers. It fires toxicysts and swallows prey whole, even if the prey is larger. | Didinium nasutum es un cazador-barril de zapatillas. Dispara toxicistos y se traga la presa entera, aunque sea mayor que él. |
| `52` | Spirostomum ambiguum is a very long cigar. It contracts several-fold in a fraction of a second. Cilia run in a spiral. | Spirostomum ambiguum es un puro larguísimo. Se contrae varias veces en una fracción de segundo. Los cilios corren en espiral. |
| `53` | Blepharisma americanum is a pink ciliate. Blepharismin pigment is light-sensitive. It filters and can attack smaller cells. | Blepharisma americanum es un ciliado rosa. El pigmento blefarismina es fotosensible. Filtra y puede atacar células más pequeñas. |
| `54` | Euplotes patella walks on cirri as if on legs. Flat, quick turns. It scrapes bacteria off surfaces. | Euplotes patella anda sobre cirros como sobre patas. Plano, giros rápidos. Raspa bacterias de las superficies. |
| `55` | Stylonychia pustulata is a hypotrich that 'runs' on the bottom. Large cirri, a clear mouth. Predator of small ciliates. | Stylonychia pustulata es un hipotrico que «corre» por el fondo. Cirros grandes, boca bien visible. Depredador de pequeños ciliados. |
| `56` | Oxytricha trifallax is a genome model: two nuclei and complex DNA rewriting. It walks on cirri and eats bacteria and small protists. | Oxytricha trifallax es un modelo de genoma: dos núcleos y una compleja reescritura del ADN. Anda sobre cirros y come bacterias y pequeños protistas. |
| `57` | Tetrahymena thermophila is a lab ciliate. Four oral membranelles, fast division. Model for telomeres and cilia. | Tetrahymena thermophila es un ciliado de laboratorio. Cuatro membranelas orales, división rápida. Modelo de telómeros y cilios. |
| `58` | Coleps hirtus is a barrel in calcareous plates with spines. Scavenger and predator: it bites into the wounded. | Coleps hirtus es un barril en placas calcáreas con espinas. Carroñero y depredador: muerde a los heridos. |
| `59` | Litonotus lamella is a flat predator with toxicysts in a 'proboscis'. It paralyzes prey and sucks it out. | Litonotus lamella es un depredador plano con toxicistos en una «probóscide». Paraliza a la presa y la succiona. |
| `60` | Dileptus anser has a long neck with venomous extrusomes. It strikes with the neck, then swallows. A large mid-tier hunter. | Dileptus anser tiene un cuello largo con extrusomas venenosos. Golpea con el cuello y luego traga. Un gran cazador de nivel medio. |
| `61` | Urocentrum turbo is a spinning top: an equatorial ciliary belt spins the cell in place. It filters bacteria. | Urocentrum turbo es una peonza: un cinturón ciliar ecuatorial hace girar la célula en el sitio. Filtra bacterias. |
| `62` | Zoothamnium arbuscula is a branched colony of bells. A shared contractile stalk jerks the whole tree at once. | Zoothamnium arbuscula es una colonia ramificada de campanillas. Un pedúnculo contráctil común sacude el árbol entero de golpe. |
| `63` | Opercularia coarctata is a sessile peritrich without a spring stalk. A lid covers the mouth. It filters and does not swim away. | Opercularia coarctata es un peritrico sésil sin pedúnculo-resorte. Un opérculo cubre la boca. Filtra y no huye nadando. |
| `64` | Amoeba proteus is the classic amoeba. Pseudopodia flow around prey. No fixed shape, no cilia. | Amoeba proteus es la ameba clásica. Los pseudópodos fluyen alrededor de la presa. Sin forma fija, sin cilios. |
| `65` | Arcella vulgaris is a testate amoeba with a rigid dome. Pseudopodia emerge from the aperture. It crawls on plants. | Arcella vulgaris es una ameba tecada con cúpula rígida. Los pseudópodos salen por la abertura. Se arrastra sobre las plantas. |
| `66` | Difflugia oblonga has a shell of sand grains the amoeba glues itself. It lives in silt. | Difflugia oblonga tiene un caparazón de granos de arena que la propia ameba pega. Vive en el lodo. |
| `67` | Euglypha alveolata has a shell of silica scales. Thin filose pseudopodia. A small bacterial predator. | Euglypha alveolata tiene un caparazón de escamas de sílice. Pseudópodos filosos finos. Un pequeño depredador de bacterias. |
| `68` | Nebela collaris is a bottle-shaped shell built from stolen scales. Forest and bog waters. | Nebela collaris es un caparazón en forma de botella hecho de escamas robadas. Aguas de bosques y turberas. |
| `69` | Centropyxis aculeata is a disc shell with spines. The aperture is offset. It crawls on detritus. | Centropyxis aculeata es un caparazón en disco con espinas. La abertura está desplazada. Se arrastra sobre el detrito. |
| `70` | Actinophrys sol is a heliozoan: thin axopodia radiate all around. Prey sticks to the rays and is pulled in. | Actinophrys sol es un heliozoo: axópodos finos irradian por todas partes. La presa se pega a los rayos y es succionada. |
| `71` | Actinosphaerium eichhorni is a large multinucleate heliozoan. Same rays, much bigger cell. It eats ciliates and rotifers. | Actinosphaerium eichhorni es un gran heliozoo multinucleado. Los mismos rayos, célula mucho mayor. Come ciliados y rotíferos. |
| `72` | Raphidiophrys pallida is a heliozoan in scales. Rays carry silica needles. An ambush plankton hunter. | Raphidiophrys pallida es un heliozoo en escamas. Los rayos llevan agujas de sílice. Un cazador de plancton al acecho. |
| `73` | Rotaria rotatoria is a rotifer that can survive drying. A corona wheels food into the mouth. A true multicellular animal. | Rotaria rotatoria es un rotífero capaz de sobrevivir a la desecación. Una corona impulsa el alimento hacia la boca. Un verdadero animal multicelular. |
| `74` | Philodina roseola is a pink bdelloid rotifer. It crawls like a leech and also swims. Females only; no males. | Philodina roseola es un rotífero bdeloide rosa. Se arrastra como sanguijuela y también nada. Solo hembras; sin machos. |
| `75` | Brachionus plicatilis is a planktonic loricate rotifer. Fry food in aquaculture. It filters algae and bacteria. | Brachionus plicatilis es un rotífero planctónico con lórica. Alimento de alevines en acuicultura. Filtra algas y bacterias. |
| `76` | Keratella cochlearis is a rotifer with a long lorica spine. The spine deters predators. Common pond plankton. | Keratella cochlearis es un rotífero con larga espina de lórica. La espina disuade a los depredadores. Plancton común de estanque. |
| `77` | Asplanchna priodonta is a sack without a lorica, a predatory rotifer. It swallows other rotifers and ciliates whole. | Asplanchna priodonta es un saco sin lórica, un rotífero depredador. Se traga enteros a otros rotíferos y ciliados. |
| `78` | Chaetonotus maximus is a gastrotrich. Scale-covered, it crawls on the bottom. It eats bacteria and detritus. | Chaetonotus maximus es un gastrotrico. Cubierto de escamas, se arrastra por el fondo. Come bacterias y detrito. |
| `79` | Lepidodermella squamata is a small gastrotrich in overlapping scales. Very fast in-place turns. | Lepidodermella squamata es un pequeño gastrotrico en escamas superpuestas. Giros en el sitio muy rápidos. |
| `80` | Macrostomum lignano is a microscopic flatworm. Real muscles and eyes. A regeneration model. It hunts small protists. | Macrostomum lignano es un platelminto microscópico. Músculos y ojos de verdad. Modelo de regeneración. Caza pequeños protistas. |
| `81` | Stenostomum leucops is a thin ciliated worm. It divides across into a chain of zooids. Predator of detritus and small animals. | Stenostomum leucops es un gusano ciliado delgado. Se divide transversalmente en una cadena de zooides. Depredador de detrito y pequeños animales. |
| `82` | Microstomum lineare is a flatworm that eats hydra and embeds their stinging cells in its own skin. A chain of zooids. | Microstomum lineare es un platelminto que come hidras e injerta sus células urticantes en su propia piel. Una cadena de zooides. |
| `83` | Prostoma graecense is a freshwater nemertean. A long proboscis shoots at prey. A rare large bottom hunter. | Prostoma graecense es un nemertino de agua dulce. Una probóscide larga dispara a la presa. Un raro gran cazador del fondo. |
| `84` | Trichoplax adhaerens is a placozoan, among the simplest animals. It crawls as a sheet and digests food outside. No mouth. | Trichoplax adhaerens es un placozoo, uno de los animales más simples. Se arrastra como lámina y digiere la comida fuera. Sin boca. |
| `85` | Saccharomyces cerevisiae is baker's yeast. It buds, eats sugar, releases CO2 and alcohol. In the pond it cleans dissolved organics. | Saccharomyces cerevisiae es la levadura del panadero. Gema, come azúcar, libera CO2 y alcohol. En el estanque limpia la materia orgánica disuelta. |
| `86` | Candida albicans is a yeast that can grow as filaments. An opportunistic human pathogen. In-game it is a detrital fungus. | Candida albicans es una levadura que puede crecer en filamentos. Patógeno oportunista humano. En el juego es un hongo de detrito. |
| `87` | Mucor mucedo is bread mold. Sporangia on stalks, fast growth over the dead. It does not hunt the living. | Mucor mucedo es el moho del pan. Esporangios en pedúnculos, crecimiento rápido sobre la materia muerta. No caza a los vivos. |
| `88` | Rhizopus stolonifer is black bread mold. Stolons and rhizoids spread over the substrate. It breaks down starch. | Rhizopus stolonifer es el moho negro del pan. Estolones y rizoides se extienden por el sustrato. Degrada el almidón. |
| `89` | Penicillium chrysogenum is a brush mold, the source of penicillin. Conidial brushes. It decomposes organics and suppresses nearby bacteria. | Penicillium chrysogenum es un moho en pinceles, la fuente de la penicilina. Pinceles de conidios. Descompone materia orgánica y suprime bacterias cercanas. |
| `90` | Aspergillus niger is black aspergillus. Spherical spore heads. Industrial citric-acid producer. A saprotroph. | Aspergillus niger es el aspergilo negro. Cabezas de esporas esféricas. Productor industrial de ácido cítrico. Un saprótrofo. |
| `91` | Batrachochytrium dendrobatidis is a chytrid of frogs. Uniflagellate zoospores. In the pond it is a water-fungus model. | Batrachochytrium dendrobatidis es un quítrido de ranas. Zoósporas uniflageladas. En el estanque es un modelo de hongo acuático. |
| `92` | Chytriomyces aureus is a water chytrid on pollen and algae. Golden sporangia; zoospores swim to the substrate. | Chytriomyces aureus es un quítrido acuático sobre polen y algas. Esporangios dorados; las zoósporas nadan al sustrato. |
| `93` | Allomyces macrogynus is a water fungus with true mycelium. It alternates diploid and haploid. Zoospores have a posterior flagellum. | Allomyces macrogynus es un hongo acuático con micelio verdadero. Alterna diploide y haploide. Las zoósporas tienen un flagelo posterior. |
| `94` | Bacillus subtilis is a soil rod. Spores survive boiling. It breaks down protein; a Gram-positive model. | Bacillus subtilis es un bacilo del suelo. Las esporas sobreviven a la ebullición. Degrada proteínas; modelo Gram-positivo. |
| `95` | Pseudomonas putida is a cleanup rod. It even eats petroleum products. Motile flagellum, fast growth on detritus. | Pseudomonas putida es un bacilo limpiador. Come hasta derivados del petróleo. Flagelo móvil, crecimiento rápido en detrito. |
| `96` | Streptomyces coelicolor is a filamentous soil bacterium. It makes the smell of earth (geosmin) and many antibiotics. Spores on hyphae. | Streptomyces coelicolor es una bacteria filamentosa del suelo. Produce el olor a tierra (geosmina) y muchos antibióticos. Esporas en las hifas. |
| `97` | Cellulomonas fimi breaks down cellulose. A yellow rod on plant detritus. Without it dead algae would linger longer. | Cellulomonas fimi degrada la celulosa. Un bacilo amarillo sobre detrito vegetal. Sin ella las algas muertas durarían más. |
| `98` | Thermus aquaticus is a thermophile from hot springs. Taq polymerase is the basis of PCR. In a cold pond it is almost dormant. | Thermus aquaticus es un termófilo de aguas termales. La Taq polimerasa es la base de la PCR. En un estanque frío está casi dormido. |
| `99` | Deinococcus radiodurans is the radiation champion. It reassembles a shattered genome in hours. Thick wall, cell tetrads. | Deinococcus radiodurans es el campeón de la radiación. Reensambla un genoma destrozado en horas. Pared gruesa, tétradas de células. |
| `1001` | Sexual Eukaryote is a teaching model of sexual reproduction. Two sexes, gamete fusion, not simple binary fission. | Sexual Eukaryote es un modelo didáctico de reproducción sexual. Dos sexos, fusión de gametos, no una simple fisión binaria. |
| `T4 Bacteriophage` | T4 is a large myovirus of E. coli. The tail contracts and injects DNA. In half an hour the cell bursts and dozens of phages exit. | T4 es un gran miovirus de E. coli. La cola se contrae e inyecta ADN. En media hora la célula estalla y salen decenas de fagos. |
| `Lambda Phage` | Lambda is a temperate phage. It can insert into the chromosome and sleep (lysogeny) or cut the cell at once (lysis). | Lambda es un fago temperado. Puede insertarse en el cromosoma y dormir (lisogenia) o cortar la célula de inmediato (lisis). |
| `T7 Bacteriophage` | T7 has a short tail and very fast replication. A favourite system in synthetic biology. | T7 tiene cola corta y una replicación muy rápida. Un sistema favorito de la biología sintética. |
| `Phi-6 Phage` | Phi-6 is an RNA phage with a lipid envelope. It infects Pseudomonas. A rare membrane for a phage. | Phi-6 es un fago de ARN con envoltura lipídica. Infecta a Pseudomonas. Una membrana rara para un fago. |
| `MS2 Phage` | MS2 is a tiny tailless RNA phage. It binds male E. coli pili. Its genome was one of the first RNA genomes read. | MS2 es un diminuto fago de ARN sin cola. Se une a los pili machos de E. coli. Su genoma fue uno de los primeros genomas de ARN leídos. |
| `Neuro-Parasite` | A fictional pond neuro-parasite. It latches onto eukaryotes and breaks host behaviour until the host becomes a carrier. | Un neuro-parásito de estanque ficticio. Se engancha a eucariotas y rompe el comportamiento del huésped hasta que este se vuelve portador. |
| `Sexual Eukaryote` | Sexual Eukaryote is a teaching model of sexual reproduction. Two sexes, gamete fusion, not simple binary fission. | Sexual Eukaryote es un modelo didáctico de reproducción sexual. Dos sexos, fusión de gametos, no una simple fisión binaria. |
