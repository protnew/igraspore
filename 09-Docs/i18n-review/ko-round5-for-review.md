# Пакет на проверку аналитику: ko (круг 5)

- Дата: 2026-10-16 17:46:37 UTC+3  |  Круг: 5
- input_sha256 словарей (полные — для raw<ko-analyst-round5.json):
  - `en.json` = d5b54954a7f4cff6ed13d7abf00c1cd9616eacbbc225d250ea4893dd9411d938
  - `ru.json` = b0d7750efcee45dc350b2ecb9d1e01e19439799c121fe595394c25ba9d11e8c1
  - `ko.json` = 9a61ff725e4bfb44b333e2ecc5493e79f70a9bc060ba8ce789d874a5bc7cbaab
  - `wiki/ko.json` = f99ceb97700d5584021eb8034750128de35728b4775e35a09fac6a0a1c289f0c
- Ключей UI: 412 (из них 🆕 новых после круга 4: 272 — U13 263 + U42 loc.* 9); вики-тел: 108
- Rubric 0–10 по 5 осям: смысл, глоссарий, регистр, длина, ошибки. Порог включения ≥ 8.
- Ответ аналитика: `09-Docs/i18n-review/raw/ko-analyst-round5.json` + строка в ANALYST-LEDGER.md (пишет ТОЛЬКО аналитик).

## Снимки 390×844

- `../out-dev-factory/shots-release-ready-2026-10-14/i18n/ko/1280-game.png`
- `../out-dev-factory/shots-release-ready-2026-10-14/i18n/ko/1280-gameover.png`
- `../out-dev-factory/shots-release-ready-2026-10-14/i18n/ko/1280-menu.png`
- `../out-dev-factory/shots-release-ready-2026-10-14/i18n/ko/1280-pause.png`
- `../out-dev-factory/shots-release-ready-2026-10-14/i18n/ko/1280-settings.png`
- `../out-dev-factory/shots-release-ready-2026-10-14/i18n/ko/1280-tutorial.png`
- `../out-dev-factory/shots-release-ready-2026-10-14/i18n/ko/1280-wiki-article.png`
- `../out-dev-factory/shots-release-ready-2026-10-14/i18n/ko/1280-wiki-list.png`
- `../out-dev-factory/shots-release-ready-2026-10-14/i18n/ko/390-game.png`
- `../out-dev-factory/shots-release-ready-2026-10-14/i18n/ko/390-gameover.png`
- `../out-dev-factory/shots-release-ready-2026-10-14/i18n/ko/390-menu.png`
- `../out-dev-factory/shots-release-ready-2026-10-14/i18n/ko/390-pause.png`
- `../out-dev-factory/shots-release-ready-2026-10-14/i18n/ko/390-settings.png`
- `../out-dev-factory/shots-release-ready-2026-10-14/i18n/ko/390-tutorial.png`
- `../out-dev-factory/shots-release-ready-2026-10-14/i18n/ko/390-wiki-article.png`
- `../out-dev-factory/shots-release-ready-2026-10-14/i18n/ko/390-wiki-list.png`

## Словарь UI (412)

| 🆕 | ключ | ru | en | ko | где / макс. длина |
|---|---|---|---|---|---|
| 🆕 | `abt.feed` | КУСЬ | BITE | 물기 | общий UI / ≤60 |
| 🆕 | `abt.fly` | ПОЛЁТ | FLIGHT | 비행 | общий UI / ≤60 |
| 🆕 | `abt.follow` | СЛЕДИТЬ | FOLLOW | 추적 | общий UI / ≤60 |
|  | `age` | Возраст | Age | 나이 | общий UI / ≤60 |
|  | `all` | Все | All | 전체 | общий UI / ≤60 |
|  | `aquarium` | АКВАРИУМ | AQUARIUM | 아쿠아리움 | общий UI / ≤60 |
| 🆕 | `aria.apk` | Скачать приложение Android APK | Download Android APK app | Android APK 앱 다운로드 | общий UI / ≤60 |
| 🆕 | `aria.aqua` | Аквариум | Aquarium | 수족관 | общий UI / ≤60 |
| 🆕 | `aria.auto` | Авто (Tab) | Auto (Tab) | 자동 (Tab) | общий UI / ≤60 |
| 🆕 | `aria.cyst` | Спора (R) | Spore (R) | 낭포 (R) | общий UI / ≤60 |
| 🆕 | `aria.demo` | Демо | Demo | 데모 | общий UI / ≤60 |
| 🆕 | `aria.divide` | Делить (Q) | Split (Q) | 분열 (Q) | общий UI / ≤60 |
| 🆕 | `aria.eat` | Есть (E) | Eat (E) | 먹기 (E) | общий UI / ≤60 |
| 🆕 | `aria.feed` | Ручное питание (Space) | Manual feed (Space) | 수동 먹이주기 (Space) | общий UI / ≤60 |
| 🆕 | `aria.fly` | Свободный полёт (F) | Free flight (F) | 자유 비행 (F) | общий UI / ≤60 |
| 🆕 | `aria.follow2` | Следить за клеткой (V) | Follow cell (V) | 세포 추적 (V) | общий UI / ≤60 |
| 🆕 | `aria.help` | Как играть | How to play | 게임 방법 | общий UI / ≤60 |
| 🆕 | `aria.light` | Свет | Light | 빛 | общий UI / ≤60 |
| 🆕 | `aria.micro` | Микроскоп (M) | Microscope (M) | 현미경 (M) | общий UI / ≤60 |
| 🆕 | `aria.pause` | Пауза (P) | Pause (P) | 일시정지 (P) | общий UI / ≤60 |
| 🆕 | `aria.render` | Режим картинки (N) | Picture mode (N) | 그림 모드 (N) | общий UI / ≤60 |
| 🆕 | `aria.set` | Настройки | Settings | 설정 | общий UI / ≤60 |
| 🆕 | `aria.start` | Старт | Start | 시작 | общий UI / ≤60 |
| 🆕 | `aria.switches` | Игровые переключатели | Game switches | 게임 스위치 | общий UI / ≤60 |
| 🆕 | `aria.wiki2` | Вики (B) | Wiki (B) | 위키 (B) | общий UI / ≤60 |
| 🆕 | `aria.zi` | Приблизить | Zoom in | 확대 | общий UI / ≤60 |
| 🆕 | `aria.zo` | Отдалить | Zoom out | 축소 | общий UI / ≤60 |
| 🆕 | `auto.off` | АВТО: выкл | AUTO: off | 자동: 꺼짐 | общий UI / ≤60 |
| 🆕 | `auto.on` | АВТО: вкл | AUTO: on | 자동: 켜짐 | общий UI / ≤60 |
|  | `autoOn` | АВТО | AUTO | 자동 | общий UI / ≤60 |
|  | `autoPilotOn` | АВТО-ПИЛОТ ВКЛ | AUTO ON | AUTO ON | общий UI / ≤60 |
|  | `bubbles` | Пузырьки | Bubbles | 거품 | общий UI / ≤60 |
| 🆕 | `cam.fly` | Полёт: WASD / мышь / колёсико | Flight: WASD / mouse / wheel | 비행: WASD / 마우스 / 휠 | общий UI / ≤60 |
| 🆕 | `cam.fly2` | ✈ Полёт: WASD / стрелки / мышь / колёсико | ✈ Flight: WASD / arrows / mouse / wheel | ✈ 비행: WASD / 화살표 / 마우스 / 휠 | общий UI / ≤60 |
| 🆕 | `cam.flyBtn` | ✈ ПОЛЁТ WASD | ✈ FLIGHT WASD | ✈ 비행 WASD | общий UI / ≤60 |
| 🆕 | `cam.follow` | Камера: следит за клеткой | Camera: following cell | 카메라: 세포 추적 | общий UI / ≤60 |
| 🆕 | `cam.followBig` | СЛЕДИТЬ | FOLLOW | 추적 | общий UI / ≤60 |
| 🆕 | `cam.followToast` | Камера: СЛЕДИТ | Camera: FOLLOW | 카메라: 추적 | общий UI / ≤60 |
| 🆕 | `cam.tip` | ✈ Полёт камеры. СЛЕДИТЬ (V) — вернуться к клетке | ✈ Camera flight. FOLLOW (V) — return to cell | ✈ 카메라 비행. 추적 (V) — 세포로 복귀 | общий UI / ≤60 |
|  | `camFly` | Полёт камеры | Camera flight | 카메라 비행 | общий UI / ≤60 |
|  | `cartoon` | МУЛЬТ | CARTOON | 카툰 | общий UI / ≤60 |
|  | `cartoonNow` | Сейчас: мультяшный. Клик → SwissBioPics. | Now: cartoon. Click for Swiss. | 현재: 카툰. Swiss로 클릭. | общий UI / ≤60 |
| 🆕 | `catShort.consumer1` | мелкий едок | small eater | 작은 먹이꾼 | категория / ≤24 |
| 🆕 | `catShort.consumer2` | средний едок | mid eater | 중간 먹이꾼 | категория / ≤24 |
| 🆕 | `catShort.consumer3` | крупный охотник | big hunter | 큰 사냥꾼 | категория / ≤24 |
| 🆕 | `catShort.decomposer` | уборщик | cleaner | 청소부 | категория / ≤24 |
| 🆕 | `catShort.producer` | зелёные | greens | 녹색 | категория / ≤24 |
|  | `clear` | Ясно | Clear | 맑음 | общий UI / ≤60 |
|  | `close` | ЗАКРЫТЬ | CLOSE | 닫기 | общий UI / ≤60 |
|  | `colonies` | колоний | colonies | 콜로니 | общий UI / ≤60 |
|  | `colonyBadge` | КОЛОНИЯ · куча клеток | COLONY · clump of cells | 콜로니 · 세포 덩어리 | общий UI / ≤60 |
|  | `colonyKind` | Колониальный вид | Colony species | 콜로니 종 | общий UI / ≤60 |
|  | `consumer1` | Мелкие едоки | Small eaters | 작은 먹보 | общий UI / ≤60 |
|  | `consumer2` | Средние едоки | Mid eaters | 중간 먹보 | общий UI / ≤60 |
|  | `consumer3` | Крупные охотники | Big hunters | 큰 사냥꾼 | общий UI / ≤60 |
|  | `currents` | Течения | Currents | 물살 | общий UI / ≤60 |
|  | `dAge` | Старость | Old age | 노화 | общий UI / ≤60 |
|  | `dCauses` | Причины гибели | Death Causes | 사망 원인 | общий UI / ≤60 |
|  | `dEaten` | Съедено | Eaten | 먹힘 | общий UI / ≤60 |
|  | `dLysis` | Лизис | Lysis | 용균 | общий UI / ≤60 |
|  | `dStarve` | Голод | Starved | 굶주림 | общий UI / ≤60 |
|  | `dTemp` | Температура | Temp | 온도 | общий UI / ≤60 |
| 🆕 | `dTip.age` | Совет: Старость неизбежна. Важно успеть разделиться до гибели. | Tip: Old age is inevitable. Divide before you die. | 팁: 노화는 불가피합니다. 죽기 전에 분열하세요. | общий UI / ≤60 |
| 🆕 | `dTip.eaten` | Совет: Избегайте хищников, используйте Режим везения для бегства. | Tip: Avoid predators, use Grace Period to run away. | 팁: 포식자를 피하고 유예 기간으로 도망치세요. | общий UI / ≤60 |
| 🆕 | `dTip.lysis` | Совет: Лизис (разрыв мембраны) вызывает вирус. Держитесь от них подальше. | Tip: Lysis is caused by viruses. Stay away from them. | 팁: 용해는 바이러스 탓. 멀리하세요. | общий UI / ≤60 |
| 🆕 | `dTip.starve` | Совет: Чаще питайтесь, держитесь ближе к скоплениям еды или ускорьте свой вид. | Tip: Eat more often, stay near food clusters, or mutate speed. | 팁: 더 자주 먹고 먹이 근처에 있거나 속도를 변이하세요. | общий UI / ≤60 |
| 🆕 | `dTip.temp` | Совет: Следите за термометром. Мутируйте температурный диапазон. | Tip: Watch the thermometer. Mutate your temp range. | 팁: 온도계를 보세요. 온도 범위를 변이하세요. | общий UI / ≤60 |
|  | `days` | Дней | Days | 일 | общий UI / ≤60 |
|  | `dead` | ВЫМИРАНИЕ | EXTINCT | 멸종 | общий UI / ≤60 |
|  | `decomposer` | Уборщики (грибки) | Cleaners (fungi) | 청소부 (균류) | общий UI / ≤60 |
|  | `demo` | ДЕМО / Галерея | DEMO / Gallery | DEMO / 갤러리 | общий UI / ≤60 |
| 🆕 | `demo.colony` | ⬡КОЛОНИЯ  | ⬡COLONY  | ⬡집단  | демо / ≤60 |
| 🆕 | `demo.grp.consumer1` | 2. Консументы I | 2. Consumers I | 2. 소비자 I | демо / ≤60 |
| 🆕 | `demo.grp.consumer2` | 3. Консументы II | 3. Consumers II | 3. 소비자 II | демо / ≤60 |
| 🆕 | `demo.grp.consumer3` | 4. Консументы III | 4. Consumers III | 4. 소비자 III | демо / ≤60 |
| 🆕 | `demo.grp.decomposer` | 5. Редуценты | 5. Decomposers | 5. 분해자 | демо / ≤60 |
| 🆕 | `demo.grp.producer` | 1. Продуценты | 1. Producers | 1. 생산자 | демо / ≤60 |
| 🆕 | `demo.grp.virus` | 6. Вирусы | 6. Viruses | 6. 바이러스 | демо / ≤60 |
| 🆕 | `demo.labels` | Метки | Labels | 라벨 | демо / ≤60 |
| 🆕 | `demo.tip` | <b>ДЕМО</b> · WASD/мышь — полёт · 1-6 группа · клик = вселиться<br> | <b>DEMO</b> · WASD/mouse fly · 1-6 jump group · click = possess<br> | <b>데모</b> · WASD/마우스 비행 · 1-6 그룹 · 클릭 = 빙의<br> | демо / ≤60 |
|  | `density` | Плотность | Density | 밀도 | общий UI / ≤60 |
|  | `diffE` | Лёгкий | Easy | 쉬움 | общий UI / ≤60 |
|  | `diffH` | Сложный | Hard | 어려움 | общий UI / ≤60 |
|  | `diffN` | Обычный | Normal | 보통 | общий UI / ≤60 |
|  | `divRate` | Размножение | Reproduction | 번식 | общий UI / ≤60 |
|  | `divs` | Делений | Divisions | 분열 수 | общий UI / ≤60 |
| 🆕 | `dna.bad` | Неверная строка ДНК! | Invalid DNA String! | 잘못된 DNA 문자열! | общий UI / ≤60 |
| 🆕 | `dna.export` | Экспорт моего ДНК | Export My DNA | 내 DNA보내기 | общий UI / ≤60 |
| 🆕 | `dna.import` | Импорт ДНК | Import DNA | DNA 가져오기 | общий UI / ≤60 |
| 🆕 | `dna.io` | Импорт/Экспорт ДНК | Import/Export DNA | DNA 가져오기/보내기 | общий UI / ≤60 |
| 🆕 | `dna.ok` | ДНК импортирована! | DNA Imported Successfully! | DNA 가져오기 성공! | общий UI / ≤60 |
| 🆕 | `dna.pastePh` | Вставь код ДНК… | Paste DNA code here... | DNA 코드를 여기에 붙여넣기... | общий UI / ≤60 |
|  | `dnaPoints` | Очки мутации: | Mutation points: | 돌연변이 포인트: | общий UI / ≤60 |
|  | `dnaShell` | Кремниевый панцирь (20 ДНК) | Silica shell (20 DNA) | 규소 껍질 (20 DNA) | общий UI / ≤60 |
|  | `dnaSize` | Увеличение массы (8 ДНК) | More mass (8 DNA) | 질량 증가 (8 DNA) | общий UI / ≤60 |
|  | `dnaSpeed` | Ускорение жгутиков (5 ДНК) | Faster flagella (5 DNA) | 빠른 편모 (5 DNA) | общий UI / ≤60 |
|  | `dnaSpikes` | Отрастить шипы (15 ДНК) | Grow spikes (15 DNA) | 가시 돋기 (15 DNA) | общий UI / ≤60 |
|  | `dnaTitle` | Мутации ДНК | DNA mutations | DNA 돌연변이 | общий UI / ≤60 |
|  | `eaten` | Съедено | Eaten | 먹음 | общий UI / ≤60 |
|  | `eats` | ест | eats | 먹는다 | общий UI / ≤60 |
|  | `eatsDead` | ест мёртвое | eats dead matter | 죽은 물질을 먹는다 | общий UI / ≤60 |
|  | `eatsLight` | ест свет | eats light | 빛을 먹는다 | общий UI / ≤60 |
| 🆕 | `edu.anatomy` | Анатомия | Anatomy | 해부학 | анатомия / ≤120 |
| 🆕 | `edu.cell` | клетка | cell | 세포 | анатомия / ≤120 |
| 🆕 | `edu.chloro.desc` | Фотосинтез: свет + CO₂ + H₂O → сахар + O₂. Зелёный из‑за хлорофилла. Есть у водорослей и растений. | Photosynthesis: light + CO₂ + H₂O → sugar + O₂. Green from chlorophyll. Found in algae and plants. | 광합성: 빛 + CO₂ + H₂O → 당 + O₂. 엽록소로 녹색. 조류와 식물에 존재. | анатомия / ≤120 |
| 🆕 | `edu.chloro.name` | Хлоропласт | Chloroplast | 엽록체 | анатомия / ≤120 |
| 🆕 | `edu.cilia.desc` | Короткие подвижные выросты. Создают ток воды: движение + фильтр-питание (затягивают бактерий и водоросли ко рту). | Short moving hairs. Create water currents: movement + filter feeding (pull bacteria and algae to the mouth). | 짧은 움직이는 돌기. 물 흐름 생성: 이동 + 여과 섭식(세균과 조류를 입으로 끌어당김). | анатомия / ≤120 |
| 🆕 | `edu.cilia.name` | Реснички | Cilia | 섬모 | анатомия / ≤120 |
| 🆕 | `edu.cyto.desc` | Внутренняя среда клетки: вода, белки, органеллы. Здесь идут тысячи биохимических реакций. | The cell's inner medium: water, proteins, organelles. Thousands of biochemical reactions run here. | 세포 내부 환경: 물, 단백질, 소기관. 수천 개의 생화학 반응이 여기서 일어남. | анатомия / ≤120 |
| 🆕 | `edu.cyto.name` | Цитоплазма | Cytoplasm | 세포질 | анатомия / ≤120 |
| 🆕 | `edu.flagella.desc` | Длинный «мотор» для плавания. Вращается или изгибается — клетка плывёт к пище или от опасности (хемотаксис). | Long swimming motor. Rotates or bends — the cell swims to food or away from danger (chemotaxis). | 수영용 긴 「모터」. 회전하거나 구부러져 먹이로 가거나 위험에서 벗어남(화학주성). | анатомия / ≤120 |
| 🆕 | `edu.flagella.name` | Жгутик | Flagellum | 편모 | анатомия / ≤120 |
| 🆕 | `edu.hoverHint` | Наведи на точку внутри клетки — название и роль органа | Hover a dot inside the cell — organelle name and role | 세포 안의 점에 호버 — 소기관 이름과 역할 | анатомия / ≤120 |
| 🆕 | `edu.membrane.desc` | Тонкая оболочка из липидов. Контролирует, что входит и выходит. У всех клеток есть мембрана. | Thin lipid envelope. Controls what goes in and out. Every cell has a membrane. | 얇은 지질 막. 출입을 통제. 모든 세포에 막이 있음. | анатомия / ≤120 |
| 🆕 | `edu.membrane.name` | Мембрана | Membrane | 막 | анатомия / ≤120 |
| 🆕 | `edu.mito.desc` | «Электростанция» клетки. Дыхание: сахар + O₂ → ATP (энергия). Своя ДНК — остаток древней бактерии. | Power plant of the cell. Respiration: sugar + O₂ → ATP (energy). Has its own DNA — remnant of an ancient bacterium. | 세포의 「발전소」. 호흡: 당 + O₂ → ATP(에너지). 자체 DNA 보유 — 고대 세균의 흔적. | анатомия / ≤120 |
| 🆕 | `edu.mito.name` | Митохондрия | Mitochondrion | 미토콘드리아 | анатомия / ≤120 |
| 🆕 | `edu.nucleoid.desc` | Зона с кольцевой ДНК у прокариот. Нет ядерной оболочки — геном свободно в цитоплазме. | Region with circular DNA in prokaryotes. No nuclear envelope — the genome floats freely in the cytoplasm. | 원핵생물의 고리형 DNA 영역. 핵막 없음 — 게놈이 세포질에 자유롭게 존재. | анатомия / ≤120 |
| 🆕 | `edu.nucleoid.name` | Нуклеоид | Nucleoid | 핵양체 | анатомия / ≤120 |
| 🆕 | `edu.nucleus.desc` | Хранит ДНК. Управляет ростом, делением и синтезом белков. У бактерий настоящего ядра нет — ДНК в нуклеоиде. | Stores DNA. Controls growth, division and protein synthesis. Bacteria have no true nucleus — DNA sits in the nucleoid. | DNA를 저장. 성장, 분열, 단백질 합성을 제어. 세균은 진짜 핵이 없고 DNA는 핵양체에 있음. | анатомия / ≤120 |
| 🆕 | `edu.nucleus.name` | Ядро | Nucleus | 핵 | анатомия / ≤120 |
| 🆕 | `edu.oral.desc` | У инфузорий — желобок, куда реснички сгоняют добычу. Отсюда пища попадает в пищеварительную вакуоль. | In ciliates — a groove where cilia sweep prey. Food enters the digestive vacuole from here. | 섬모충에서 섬모가 먹이를 쓸어넣는 홈. 여기서 먹이가 소화액포로 들어감. | анатомия / ≤120 |
| 🆕 | `edu.oral.name` | Ротовая воронка | Oral groove | 구내구 | анатомия / ≤120 |
| 🆕 | `edu.vacuole.desc` | Пузырёк с водой, запасными веществами или пищеварительными ферментами. У инфузорий — пищеварительные и сократительные вакуоли. | Vesicle with water, reserves or digestive enzymes. Ciliates have digestive and contractile vacuoles. | 물, 저장 물질, 소화 효소를 담은 주머니. 섬모충에는 소화액포와 수축액포가 있음. | анатомия / ≤120 |
| 🆕 | `edu.vacuole.name` | Вакуоль | Vacuole | 액포 | анатомия / ≤120 |
| 🆕 | `edu.wall.desc` | Жёсткий каркас снаружи мембраны (пептидогликан у бактерий, целлюлоза у растений). Защита и форма. | Rigid frame outside the membrane (peptidoglycan in bacteria, cellulose in plants). Protection and shape. | 막 바깥의 단단한 골격(세균은 펩티도글리칸, 식물은 셀룰로스). 보호와 형태 유지. | анатомия / ≤120 |
| 🆕 | `edu.wall.name` | Клеточная стенка | Cell wall | 세포벽 | анатомия / ≤120 |
|  | `energy` | Энергия | Energy | 에너지 | общий UI / ≤60 |
| 🆕 | `ev.acid_rain` | Кислотный дождь | Acid rain | 산성비 | событие / ≤60 |
| 🆕 | `ev.eclipse` | Солнечное затмение | Solar eclipse | 일식 | событие / ≤60 |
| 🆕 | `ev.ended` | {name} закончился | {name} ended | {name} 종료 | событие / ≤60 |
| 🆕 | `ev.warn` | ВНИМАНИЕ: {name}! | WARNING: {name}! | 경고: {name}! | событие / ≤60 |
|  | `exit` | Выход | Exit | 종료 | общий UI / ≤60 |
| 🆕 | `fc.consumer1` | грызут зелёных | nibble greens | 녹색을 뜯어먹음 | общий UI / ≤60 |
| 🆕 | `fc.consumer2` | фильтруют мелочь | filter small ones | 작은 것을 걸러먹음 | общий UI / ≤60 |
| 🆕 | `fc.consumer3` | едят всех | eat everyone | 모두를 먹음 | общий UI / ≤60 |
| 🆕 | `fc.decomposer` | убирают мёртвое | clean up dead | 죽은 것을 치움 | общий UI / ≤60 |
| 🆕 | `fc.producer` | делают еду из света | make food from light | 빛으로 먹이를 만듦 | общий UI / ≤60 |
| 🆕 | `fc.schema` | (схема) | (schematic) | (모식도) | общий UI / ≤60 |
|  | `filter` | Фильтр | Filter | 필터 | общий UI / ≤60 |
|  | `filterHint` | нажми другую кнопку чтобы сменить | tap another button to switch | 다른 버튼을 눌러 전환 | общий UI / ≤60 |
|  | `flight` | Полёт | Flight | 비행 | общий UI / ≤60 |
|  | `follow` | Следить | Follow | 추적 | общий UI / ≤60 |
| 🆕 | `food.decomposer` | мёртвые остатки | dead matter | 죽은 잔해 | питание / ≤60 |
| 🆕 | `food.producer` | свет + вода + минералы | light + water + minerals | 빛 + 물 + 미네랄 | питание / ≤60 |
|  | `fps` | FPS | FPS | FPS | общий UI / ≤60 |
|  | `freeCam` | Своб. камера | Free Cam | 자유 캠 | общий UI / ≤60 |
|  | `gameTime` | Время | Time | 시간 | общий UI / ≤60 |
|  | `healthBars` | Шкалы здоровья | Health Bars | 체력바 | общий UI / ≤60 |
|  | `help` | КАК ИГРАТЬ | HOW TO PLAY | 하는 법 | общий UI / ≤60 |
| 🆕 | `help.body` | <p><b style="color:#4df">Управление:</b> WASD — плавание. Вверх = поверхность, вниз = дно. ЛКМ — плыть к курсору. Пробел — укус.</p><p><b style="color:#8f8">Кто кого ест (просто):</b></p><p style="line-height:1.45">🌱 <b>Зелёные</b> — не охотятся. Кормятся светом (как растения). Это основной корм пруда.<br>🔵 <b>Мелкие едоки</b> — бактерии. Грызут зелёных.<br>🟠 <b>Средние едоки</b> — инфузории. Фильтруют воду: затягивают бактерий и зелёных. Не прыгают на гигантов.<br>🟣 <b>Крупные охотники</b> — едят зелёных, бактерий и средних. Можно кусать и чуть более крупных (опасно). Без еды живут долго.</p><p><b style="color:#4df">Камера:</b> F — свободный полёт. V — вернуться к клетке. Колесо — зум.</p><p><b style="color:#4df">Деление:</b> Наелся и вырос — делишься на двоих. Q — вручную.</p> | <p><b style="color:#4df">Controls:</b> WASD swim. Space = bite. LMB = swim to cursor.</p><p><b style="color:#8f8">Who eats whom:</b></p><p>🌱 Greens eat light. 🔵 Small eaters eat greens. 🟠 Mid eaters filter bacteria+greens. 🟣 Big hunters eat greens, bacteria and mid-eaters — and can bite slightly larger prey.</p><p><b style="color:#4df">Camera:</b> F free cam, V back to cell. Wheel = zoom.</p><p><b style="color:#4df">Division:</b> Eat, grow, split. Q = manual.</p> | <p><b style="color:#4df">조작:</b> WASD 수영. Space = 물기. LMB = 커서로 수영.</p><p><b style="color:#8f8">누가 누구를 먹나:</b></p><p>🌱 녹색은 빛을 먹음. 🔵 작은 먹이꾼은 녹색을 먹음. 🟠 중간은 세균+녹색을 여과. 🟣 큰 사냥꾼은 녹색, 세균, 중간을 먹고 약간 큰 먹이도 물 수 있음.</p><p><b style="color:#4df">카메라:</b> F 자유 카메라, V 세포로 복귀. 휠 = 확대.</p><p><b style="color:#4df">분열:</b> 먹고, 자라고, 분열. Q = 수동.</p> | помощь / ≤200 |
|  | `hud.btn.auto` | АВТО | AUTO | 자동 | HUD кнопка / ≤14 |
|  | `hud.btn.auto.short` | АВТО | AUTO | 자동 | HUD кнопка (короткая) / ≤8 |
|  | `hud.btn.cyst` | СПОРА | SPORE | 포자 | HUD кнопка / ≤14 |
|  | `hud.btn.cyst.short` | СПОРА | SPORE | 포자 | HUD кнопка (короткая) / ≤8 |
|  | `hud.btn.divide` | ДЕЛИТЬ | DIVIDE | 분열 | HUD кнопка / ≤14 |
|  | `hud.btn.divide.short` | ДЕЛИТЬ | DIVIDE | 분열 | HUD кнопка (короткая) / ≤8 |
|  | `hud.btn.eat` | ЕСТЬ | EAT | 먹기 | HUD кнопка / ≤14 |
|  | `hud.btn.eat.short` | ЕСТЬ | EAT | 먹 | HUD кнопка (короткая) / ≤8 |
|  | `hud.btn.light` | СВЕТ | LIGHT | 빛 | HUD кнопка / ≤14 |
|  | `hud.btn.light.short` | СВЕТ | LIGHT | 빛 | HUD кнопка (короткая) / ≤8 |
|  | `hud.btn.menu` | Меню | Menu | 메뉴 | HUD кнопка / ≤14 |
|  | `hud.divide.reason.age` | слишком молода | too young | 너무 어림 | HUD / ≤40 |
|  | `hud.divide.reason.busy` | идёт деление | dividing | 분열 중 | HUD / ≤40 |
|  | `hud.divide.reason.cd` | перезарядка {sec} с | cooldown {sec} s | 대기 {sec}초 | HUD / ≤40 |
|  | `hud.divide.reason.energy` | энергия {cur}/{need} | energy {cur}/{need} | 에너지 {cur}/{need} | HUD / ≤40 |
|  | `hud.divide.reason.mass` | масса {cur}/{need} | mass {cur}/{need} | 질량 {cur}/{need} | HUD / ≤40 |
|  | `hud.divide.reason.none` | нет клетки | no cell | 세포 없음 | HUD / ≤40 |
|  | `hud.divide.reason.size` | размер {cur}/{need} | size {cur}/{need} | 크기 {cur}/{need} | HUD / ≤40 |
| 🆕 | `hud.genSep` |  · Gen  |  · Gen  |  · 세대  | HUD / ≤40 |
|  | `hud.goal` | Поделись: {cur}/{need} | Divide: {cur}/{need} | 분열: {cur}/{need} | HUD / ≤40 |
| 🆕 | `kh.hide` | Свернуть | Hide keys | 키 숨기기 | общий UI / ≤60 |
| 🆕 | `kh.keys` | Клавиши | Keys | 키 | общий UI / ≤60 |
| 🆕 | `lb.title` | 🏆 Таблица лидеров | 🏆 Leaderboard | 🏆 순위표 | общий UI / ≤60 |
| 🆕 | `leg.apex` | Крупные охотники | Apex hunters | 최상위 포식자 | общий UI / ≤60 |
| 🆕 | `leg.bacteria` | Бактерии | Bacteria | 세균 | общий UI / ≤60 |
| 🆕 | `leg.decomp` | Разлагатели | Decomposers | 분해자 | общий UI / ≤60 |
| 🆕 | `leg.large` | Крупные | Large | 대형 | общий UI / ≤60 |
| 🆕 | `leg.producer` | Водоросли | Algae | 조류 | общий UI / ≤60 |
| 🆕 | `leg.virus` | Вирусы | Viruses | 바이러스 | общий UI / ≤60 |
|  | `legend` | Легенда | Legend | 범례 | общий UI / ≤60 |
|  | `light` | Свет | Light | 빛 | общий UI / ≤60 |
|  | `lightInt` | Инт. света | Light Intensity | 빛 세기 | общий UI / ≤60 |
|  | `map` | Карта | Map | 지도 | общий UI / ≤60 |
|  | `mapChart` | Карта и график | Map and chart | 지도와 차트 | общий UI / ≤60 |
|  | `mapTip` | Миникарта — где вы в пруду. Клик = прыжок камеры. | Minimap: where you are in the pond. Click jumps the camera. | 미니맵: 연못에서의 위치. 클릭하면 카메라가 이동. | общий UI / ≤60 |
|  | `massWord` | Масса | Mass | 질량 | общий UI / ≤60 |
|  | `maxPop` | Макс. поп | Max Pop | 최대 개체수 | общий UI / ≤60 |
|  | `menu` | В МЕНЮ | MENU | 메뉴 | общий UI / ≤60 |
|  | `menuSub` | Симуляция микроорганизмов — 100 видов + вирусы. Разрез водоёма сбоку. | Microorganism Simulation — 100 species + viruses. Pond cross-section view. | 미생물 시뮬레이션 — 100종 + 바이러스. 연못 단면. | общий UI / ≤60 |
| 🆕 | `mic.scope` | МИКРОСКОП × | MICROSCOPE × | 현미경 × | микроскоп / ≤30 |
|  | `microscope` | Микроскоп | Microscope | 현미경 | общий UI / ≤60 |
|  | `midEaterTip` | Средний едок: подплыви к зелёным/бактериям — реснички фильтруют сами. | Mid eater: swim to greens or bacteria. Cilia filter on their own. | 중간 포식자: 녹조나 박테리아로 헤엄쳐라. 섬모가 스스로 걸러낸다. | общий UI / ≤60 |
| 🆕 | `mob.eSep` |  · E= |  · E= |  · E= | моб. UI / ≤30 |
| 🆕 | `mob.infected` |  · 🦠 заражён |  · 🦠 infected |  · 🦠 감염 | моб. UI / ≤30 |
| 🆕 | `mob.you` |  · ВЫ |  · YOU |  · 당신 | моб. UI / ≤30 |
| 🆕 | `mode.swissLbl` | 📗 SWISS | 📗 SWISS | 📗 SWISS | общий UI / ≤60 |
| 🆕 | `mode.webglLbl` | 🌊 WEBGL | 🌊 WEBGL | 🌊 WEBGL | общий UI / ≤60 |
| 🆕 | `modeBig.cartoon` | 🎨 CARTOON | 🎨 CARTOON | 🎨 만화 | общий UI / ≤60 |
| 🆕 | `modeBig.swiss` | 📗 SWISSBIOPICS | 📗 SWISSBIOPICS | 📗 SWISSBIOPICS | общий UI / ≤60 |
| 🆕 | `modeBig.webgl` | 🌊 WEBGL | 🌊 WEBGL | 🌊 WEBGL | общий UI / ≤60 |
| 🆕 | `modeLbl.cartoon` | 🎨 Cartoon | 🎨 Cartoon | 🎨 만화 | общий UI / ≤60 |
| 🆕 | `modeLbl.swiss` | 📗 SwissBioPics | 📗 SwissBioPics | 📗 SwissBioPics | общий UI / ≤60 |
| 🆕 | `modeLbl.webgl` | 🌊 WebGL | 🌊 WebGL | 🌊 WebGL | общий UI / ≤60 |
|  | `next` | Далее | Next | 다음 | общий UI / ≤60 |
|  | `noSpecies` | Нет видов в категории «{cat}». Нажмите «Все». | No species in "{cat}". Tap All. | "{cat}"에 종이 없습니다. "전체"를 누르세요. | общий UI / ≤60 |
|  | `offspring` | Потомков | Offspring | 자손 | общий UI / ≤60 |
|  | `particles` | Частицы | Particles | 입자 | общий UI / ≤60 |
|  | `paused` | ПАУЗА | PAUSED | 일시정지 | общий UI / ≤60 |
|  | `picMode` | Режим картинки | Picture mode | 사진 모드 | общий UI / ≤60 |
|  | `play` | Играть | Play | 플레이 | общий UI / ≤60 |
|  | `poolWill` | В бассейне будет: ~{n} организмов · {kinds} видов | Pool will have: ~{n} organisms · {kinds} species | 연못에 생길 것: ~{n}개체 · {kinds}종 | общий UI / ≤60 |
|  | `pop` | Поп-ция | Pop | 개체수 | общий UI / ≤60 |
|  | `popTip` | График популяции — сколько микробов во времени. | Population chart: how many microbes over time. | 개체 수 차트: 시간에 따른 미생물 수. | общий UI / ≤60 |
|  | `predation` | Хищники | Predators | 포식자 | общий UI / ≤60 |
|  | `producer` | Зелёные (корм) | Greens (food) | 초록 (먹이) | общий UI / ≤60 |
|  | `rainy` | Дождь | Rain | 비 | общий UI / ≤60 |
|  | `ready` | ГОТОВО | READY | 준비됨 | общий UI / ≤60 |
|  | `restart` | ЗАНОВО | RESTART | 다시 시작 | общий UI / ≤60 |
|  | `resume` | ПРОДОЛЖИТЬ | RESUME | 이어하기 | общий UI / ≤60 |
| 🆕 | `role.consumer1` | Мелкие едоки (бактерии). Кусают зелёных. Сами — еда для средних и крупных. | Small eaters (bacteria). Nibble greens. Food for mid and big eaters. | 소형 포식자 (세균). 초록을 갉아먹음. 중형·대형의 먹이. | карточка роли / ≤80 |
| 🆕 | `role.consumer2` | Средние едоки (инфузории). Фильтруют воду: затягивают бактерий и зелёных. Не кидаются на гигантов. | Mid eaters (ciliates). Filter water: pull in bacteria and greens. Do not tackle giants. | 중형 포식자 (섬모충). 물을 걸러 세균과 초록을 빨아들임. 거대한 개체는 건드리지 않음. | карточка роли / ≤80 |
| 🆕 | `role.consumer3` | Крупные охотники. Едят зелёных, бактерий и средних. Могут кусать и тех, кто чуть крупнее — но это рискованно. Без еды живут долго, но голод всё равно опасен. | Big hunters. Eat greens, bacteria and mid-eaters. Can bite slightly larger prey — risky. Live long without food, but hunger still kills. | 대형 사냥꾼. 초록, 세균, 중형을 먹음. 조금 큰 먹이도 물 수 있지만 위험. 먹지 않아도 오래 살지만 굶주림은 치명적. | карточка роли / ≤80 |
| 🆕 | `role.decomposer` | Уборщики. Разлагают мёртвое — не охотятся на живых. | Cleaners. Break down the dead — do not hunt the living. | 청소부. 죽은 것을 분해 — 산 것은 사냥하지 않음. | карточка роли / ≤80 |
| 🆕 | `role.macrophage` | Стражи. Атакуют больных и опасных — «иммунитет» пруда. | Guards. Attack sick/dangerous cells — the pond immune system. | 수호자. 병든·위험한 세포를 공격 — 연못의 면역계. | карточка роли / ≤80 |
| 🆕 | `role.producer` | Зелёные. Не охотятся. Едят свет и воду — как крошечные растения. Кормят всех остальных. | Greens. No hunting. They eat light and water — tiny plants. Feed everyone else. | 초록. 사냥하지 않음. 빛과 물을 먹는 아주 작은 식물. 모두를 먹여 살림. | карточка роли / ≤80 |
|  | `roleFood` | Еда | Food | 먹이 | карточка роли / ≤80 |
|  | `roleHint` | Подсказка: еда подсвечена цветным кольцом. Полоска «Запах еды» справа вверху. | Hint: food is marked with a colored ring. The food-scent bar is at the top right. | 힌트: 먹이에는 색상 링이 표시됩니다. 먹이 냄새 바는 오른쪽 위. | карточка роли / ≤80 |
|  | `roleOk` | Понятно — плыву | Got it — I'll swim | 알겠어 — 헤엄칠게 | карточка роли / ≤80 |
|  | `roleWho` | Ты кто / кого ешь | Who you are / what you eat | 너는 누구 / 무엇을 먹나 | карточка роли / ≤80 |
|  | `season0` | Весна | Spring | 봄 | общий UI / ≤60 |
|  | `season1` | Лето | Summer | 여름 | общий UI / ≤60 |
|  | `season2` | Осень | Autumn | 가을 | общий UI / ≤60 |
|  | `season3` | Зима | Winter | 겨울 | общий UI / ≤60 |
|  | `selectSp` | Выберите организм | Select organism | 생물 고르기 | общий UI / ≤60 |
|  | `set` | НАСТРОЙКИ | SETTINGS | 설정 | настройки / ≤40 |
|  | `settingsT` | Настройки | Settings | 설정 | настройки / ≤40 |
|  | `shadows` | Тени | Shadows | 그림자 | общий UI / ≤60 |
|  | `shown` | показано | shown | 표시됨 | общий UI / ≤60 |
|  | `simSpeed` | Скорость | Speed | 속도 | общий UI / ≤60 |
|  | `skip` | Пропустить | Skip | 건너뛰기 | общий UI / ≤60 |
| 🆕 | `sp.1000` | Губка (фильтратор) | Sponge (Filter Feeder) | 해면(여과 섭식자) | имя вида / ≤40 |
| 🆕 | `sp.1001` | Половая эукариота | Sexual Eukaryote | 유성 진핵생물 | имя вида / ≤40 |
| 🆕 | `sp.999` | Макрофаг (Иммунитет) | Macrophage (Immunity) | 대식세포(면역) | имя вида / ≤40 |
| 🆕 | `spcard.virus` | Вирус | Virus | 바이러스 | общий UI / ≤60 |
|  | `speciesWord` | видов | species | 종 | общий UI / ≤60 |
| 🆕 | `star.alphacentauri` | ★ Альфа Центавра A+B | ★ Alpha Centauri A+B | ★ 알파 센타우리 A+B | звезда / ≤40 |
| 🆕 | `star.antares` | ★ Антарес | ★ Antares | ★ 안타레스 | звезда / ≤40 |
| 🆕 | `star.betelgeuse` | ★ Бетельгейзе | ★ Betelgeuse | ★ 베텔게우스 | звезда / ≤40 |
| 🆕 | `star.binary` | ★ Двойная (синяя+оранжевая) | ★ Binary (blue+orange) | ★ 쌍성 (청+주황) | звезда / ≤40 |
| 🆕 | `star.dwarf` | ★ Красный карлик | ★ Red dwarf | ★ 적색 왜성 | звезда / ≤40 |
| 🆕 | `star.flare` | ★ Вспышечная (UV Ceti) | ★ Flare star (UV Ceti) | ★ 플레어성 (UV Ceti) | звезда / ≤40 |
| 🆕 | `star.giant` | ★ Оранжевый гигант | ★ Orange giant | ★ 주황색 거성 | звезда / ≤40 |
| 🆕 | `star.polaris` | ★ Полярная | ★ Polaris | ★ 북극성 | звезда / ≤40 |
| 🆕 | `star.pulsar` | ★ Нейтронная (пульсар) | ★ Neutron (pulsar) | ★ 중성자별 (펄서) | звезда / ≤40 |
| 🆕 | `star.quadruple` | ★★★★ Четверная | ★★★★ Quadruple | ★★★★ 사중성 | звезда / ≤40 |
| 🆕 | `star.rigel` | ★ Ригель | ★ Rigel | ★ 리겔 | звезда / ≤40 |
| 🆕 | `star.sirius` | ★ Сириус A+B | ★ Sirius A+B | ★ 시리우스 A+B | звезда / ≤40 |
| 🆕 | `star.sol` | ☀ Солнце | ☀ Sun | ☀ 태양 | звезда / ≤40 |
| 🆕 | `star.trinary` | ★★★ Тройная | ★★★ Triple | ★★★ 삼중성 | звезда / ≤40 |
| 🆕 | `star.twin` | ★★ Близнецы | ★★ Twins | ★★ 쌍둥이 | звезда / ≤40 |
| 🆕 | `star.vega` | ★ Вега | ★ Vega | ★ 베가 | звезда / ≤40 |
| 🆕 | `starg.alphacentauri` | ★ α Центавра | ★ α Centauri | ★ α 센타우리 | звезда / ≤40 |
| 🆕 | `starg.sirius` | ★ Сириус | ★ Sirius | ★ 시리우스 | звезда / ≤40 |
|  | `start` | НАЧАТЬ | START | 시작 | общий UI / ≤60 |
|  | `swissNow` | Сейчас: SwissBioPics. Клик → WebGL. | Now: Swiss. Click for WebGL. | 현재: Swiss. WebGL로 클릭. | общий UI / ≤60 |
|  | `temp` | Т° | Temp | 온도 | общий UI / ≤60 |
| 🆕 | `tip.ageBar` | Возраст существа. Старые клетки теряют энергию быстрее. | Creature age. Old cells lose energy faster. | 생물 나이. 늙은 세포는 에너지를 더 빨리 잃음. | общий UI / ≤60 |
| 🆕 | `tip.auto` | Авто | Auto | 자동 | общий UI / ≤60 |
| 🆕 | `tip.cartoon` | Мультяшный. Клик → SwissBioPics | Cartoon. Click -> SwissBioPics | 만화. 클릭 -> SwissBioPics | общий UI / ≤60 |
| 🆕 | `tip.cbFilter` | Фильтр организмов. Нажмите, чтобы показать только этот вид в меню. | Organism filter. Click to show only this species in the menu. | 생물 필터. 클릭하면 이 종만 메뉴에 표시. | общий UI / ≤60 |
| 🆕 | `tip.cyst` | Спора | Spore | 낭포 | общий UI / ≤60 |
| 🆕 | `tip.daysL` | Игровые дни. Смена сезонов влияет на температуру. | Game days. Season changes affect temperature. | 게임 날짜. 계절 변화가 온도에 영향. | общий UI / ≤60 |
| 🆕 | `tip.divide` | Делить | Split | 분열 | общий UI / ≤60 |
| 🆕 | `tip.eat` | Есть | Eat | 먹기 | общий UI / ≤60 |
| 🆕 | `tip.energyBar` | Энергия существа. Падает со временем. Если дойдет до нуля — смерть от голода. | Creature energy. Drops over time. At zero — death by starvation. | 생물 에너지. 시간에 따라 감소. 0이면 굶어 죽음. | общий UI / ≤60 |
| 🆕 | `tip.feed` | Ручное питание | Manual feed | 수동 먹이주기 | общий UI / ≤60 |
| 🆕 | `tip.fly` | Свободный полёт: F или WASD / мышь | Free flight: F or WASD / mouse | 자유 비행: F 또는 WASD / 마우스 | общий UI / ≤60 |
| 🆕 | `tip.follow` | Следить | Follow | 추적 | общий UI / ≤60 |
| 🆕 | `tip.fpsL` | Кадры в секунду (FPS). Показывает производительность игры. | Frames per second (FPS). Shows game performance. | 초당 프레임 (FPS). 게임 성능 표시. | общий UI / ≤60 |
| 🆕 | `tip.lang` | Выбор языка (Language Selector) | Language selector | 언어 선택 | общий UI / ≤60 |
| 🆕 | `tip.lightL` | Уровень освещенности. Важен для фотосинтеза водорослей. | Light level. Important for algae photosynthesis. | 광량. 조류 광합성에 중요. | общий UI / ≤60 |
| 🆕 | `tip.microMode` | Режим микроскопа | Microscope Mode | 현미경 모드 | общий UI / ≤60 |
| 🆕 | `tip.pause` | Пауза | Pause | 일시정지 | общий UI / ≤60 |
| 🆕 | `tip.popC` | График популяции. Показывает историю рождений и смертей. | Population chart. Shows birth and death history. | 개체수 그래프. 탄생과 사망 기록 표시. | общий UI / ≤60 |
| 🆕 | `tip.render` | Картинка: мульт / Swiss | Picture: cartoon / Swiss | 그림: 만화 / Swiss | общий UI / ≤60 |
| 🆕 | `tip.starSel` | Выбор звезды/солнца | Select star/sun | 별/태양 선택 | общий UI / ≤60 |
| 🆕 | `tip.swiss` | SwissBioPics. Клик → WebGL | SwissBioPics. Click -> WebGL | SwissBioPics. 클릭 -> WebGL | общий UI / ≤60 |
| 🆕 | `tip.tempL` | Температура воды. Влияет на метаболизм и выживание. | Water temperature. Affects metabolism and survival. | 수온. 대사와 생존에 영향. | общий UI / ≤60 |
| 🆕 | `tip.webgl` | WebGL-вода. Клик → мультяшный | WebGL water. Click -> cartoon | WebGL 물. 클릭 -> 만화 | общий UI / ≤60 |
| 🆕 | `tip.wikiB` | Вики/Бестиарий | Wiki/Bestiary | 위키/도감 | общий UI / ≤60 |
| 🆕 | `tip.zi` | Zoom+ | Zoom+ | 확대+ | общий UI / ≤60 |
| 🆕 | `tip.zo` | Zoom- | Zoom- | 축소- | общий UI / ≤60 |
| 🆕 | `toast.auto.eat` | АВТО: съел | AUTO: ate | 자동: 먹음 | тост / ≤60 |
| 🆕 | `toast.auto.gain` | АВТО: +{e} энергия | AUTO: +{e} energy | 자동: +{e} 에너지 | тост / ≤60 |
| 🆕 | `toast.bite` | КУСЬ! {name} | BITE! {name} | 물기! {name} | тост / ≤60 |
| 🆕 | `toast.biteBig` | Откусил кусок — крупная добыча! | Bit off a chunk — big prey! | 한입 뜯음 — 큰 먹이! | тост / ≤60 |
| 🆕 | `toast.biteGain` | Укус +{e} эн / +{m} м | Bite +{e} en / +{m} m | 물기 +{e} 에너 / +{m} 질 | тост / ≤60 |
| 🆕 | `toast.cilia.filter` | Реснички: фильтр-питание | Cilia: filter feeding | 섬모: 여과 섭식 | тост / ≤60 |
| 🆕 | `toast.controls` | Управление: WASD / мышь · ЕСТЬ (E) · ДЕЛИТЬ (Q) | Controls: WASD / mouse · EAT (E) · DIVIDE (Q) | 조작: WASD / 마우스 · 먹기 (E) · 분열 (Q) | тост / ≤60 |
|  | `toast.cyst.enter` | Спора: защита, движение 0, энергия тратится медленно | Spore: protected, speed 0, energy drains slowly | 포자: 보호됨, 속도 0, 에너지는 천천히 줄어 | тост / ≤60 |
|  | `toast.cyst.exit` | Вышел из споры | Left the spore | 포자에서 나왔어 | тост / ≤60 |
|  | `toast.cyst.hunger` | Голод: впал в цисту — найди еду и проснись | Hunger: encysted — find food and wake | 배고픔: 포낭이 됐어 — 먹이 찾고 깨어나 | тост / ≤60 |
| 🆕 | `toast.digest` | Пищеварение... ({s}с) | Digesting... ({s}s) | 소화 중... ({s}초) | тост / ≤60 |
| 🆕 | `toast.divfail` | Деление: вторая клетка не создалась | Division: second cell failed to form | 분열: 두 번째 세포가 생성되지 않음 | тост / ≤60 |
|  | `toast.divide.blocked` | Пока нельзя делиться | Cannot divide yet | 아직 분열 못 해 | тост / ≤60 |
|  | `toast.divide.go` | Деление | Dividing | 분열 중 | тост / ≤60 |
| 🆕 | `toast.divided` | Деление! | Divided! | 분열! | тост / ≤60 |
|  | `toast.eat.closer` | Ближе к добыче | Closer to prey | 먹잇감에 더 가까이 | тост / ≤60 |
|  | `toast.eat.none` | Рядом нет добычи — подплыви ближе | No prey nearby — swim closer | 근처에 먹잇감 없어 — 더 가까이 헤엄쳐 | тост / ≤60 |
| 🆕 | `toast.eat.noneAuto` | Рядом нет добычи — включи АВТО или подплыви | No prey nearby — enable AUTO or swim closer | 근처에 먹이 없음 — AUTO 켜거나 더 가까이 수영 | тост / ≤60 |
|  | `toast.eat.ok` | Съел | Ate | 먹었어 | тост / ≤60 |
|  | `toast.eat.plant` | Ты растение: плыви к свету | You are a plant: swim toward the light | 넌 식물이야: 빛 쪽으로 헤엄쳐 | тост / ≤60 |
| 🆕 | `toast.extinct` | Вид {name} вымер! | Species {name} went extinct! | 종 {name} 멸종! | тост / ≤60 |
| 🆕 | `toast.filter.catch` | Фильтр: затянул добычу | Filter: pulled in prey | 필터: 먹이를 빨아들임 | тост / ≤60 |
| 🆕 | `toast.filter.catch2` | Фильтр: захватил добычу | Filter: captured prey | 필터: 먹이를 포획 | тост / ≤60 |
| 🆕 | `toast.gain` | +{e} эн / +{m} масса | +{e} en / +{m} mass | +{e} 에너 / +{m} 질량 | тост / ≤60 |
| 🆕 | `toast.infected` | Клетка инфицирована! Лизис через 10-20с | Cell infected! Lysis in 10-20s | 세포 감염! 10-20초 후 용해 | тост / ≤60 |
|  | `toast.lang.fallback` | Язык не включён, показан английский | Language is off, showing English | 언어가 꺼져 있어, 영어로 나와 | тост / ≤60 |
| 🆕 | `toast.microOff` | Микроскоп выкл | Microscope off | 현미경 끄기 | тост / ≤60 |
| 🆕 | `toast.microOn` | 🔬 Микроскоп: вода остаётся, зум+сетка (не режим N) | 🔬 Microscope: water stays, zoom+grid (not mode N) | 🔬 현미경: 물 유지, 확대+그리드 (모드 N 아님) | тост / ≤60 |
| 🆕 | `toast.noPlayer` | Нет игрока | No player | 플레이어 없음 | тост / ≤60 |
| 🆕 | `toast.parasite.gone` | Паразит сброшен | Parasite shed | 기생체 떨어짐 | тост / ≤60 |
| 🆕 | `toast.webglFail` | WebGL недоступен — возврат в мультяшный | WebGL unavailable — falling back to cartoon | WebGL 사용 불가 — 만화로 전환 | тост / ≤60 |
|  | `topOfList` | вверху списка | top of the list | 목록 맨 위 | общий UI / ≤60 |
| 🆕 | `tut.s1.body` | Вы — микроорганизм в луже. Цель: есть, расти, делиться. Нажмите «Далее». | You are a microbe in a pond. Goal: eat, grow, divide. Tap Next. | 당신은 연못의 미생물입니다. 목표: 먹고, 자라고, 분열하기. 다음을 누르세요. | обучение / ≤200 |
| 🆕 | `tut.s1.title` | Добро пожаловать | Welcome | 환영합니다 | обучение / ≤200 |
| 🆕 | `tut.s2.body` | WASD — плыть. Мышь задаёт направление. Попробуйте сдвинуться, затем «Далее». | WASD to swim. The mouse sets direction. Move, then tap Next. | WASD로 헤엄칩니다. 마우스가 방향을 정합니다. 움직인 뒤 다음을 누르세요. | обучение / ≤200 |
| 🆕 | `tut.s2.title` | Движение | Movement | 이동 | обучение / ≤200 |
| 🆕 | `tut.s3.body` | Подойдите к меньшей клетке и нажмите ЕСТЬ (E). Должны появиться вспышка и «+энергия». | Swim to a smaller cell and press EAT (E). You should see a flash. | 더 작은 세포로 헤엄쳐 가서 먹기 (E)를 누르세요. 빛이 번쩍일 겁니다. | обучение / ≤200 |
| 🆕 | `tut.s3.title` | Питание | Eating | 먹기 | обучение / ≤200 |
| 🆕 | `tut.s4.body` | При полной энергии нажмите ДЕЛИТЬ (Q). Клетка станет заметно меньше — это нормально. | When energy is full, press SPLIT (Q). The cell gets smaller. That is normal. | 에너지가 가득 차면 분열 (Q)을 누르세요. 세포가 작아지는 건 정상입니다. | обучение / ≤200 |
| 🆕 | `tut.s4.title` | Деление | Division | 분열 | обучение / ≤200 |
| 🆕 | `tut.s5.body` | Камера: СЛЕДИТЬ / ПОЛЁТ. Картинка: МУЛЬТЯШНЫЙ или SWISS. Удачи в эволюции! | Camera: follow or free flight. Good luck evolving! | 카메라: 따라가기 또는 자유 비행. 진화를 즐기세요! | обучение / ≤200 |
| 🆕 | `tut.s5.title` | Готово | Done | 완료 | обучение / ≤200 |
|  | `tutDone` | Туториал пройден | Tutorial done | 튜토리얼 완료 | общий UI / ≤60 |
|  | `vignette` | Виньетка | Vignette | 비네트 | общий UI / ≤60 |
|  | `virus` | Вирусы | Viruses | 바이러스 | общий UI / ≤60 |
|  | `virusMode` | Режим вируса: {name}. Кликни по бактерии = инфицировать. WASD = камера. | Virus mode: {name}. Click a bacterium to infect. WASD moves the camera. | 바이러스 모드: {name}. 박테리아를 클릭해 감염. WASD로 카메라 이동. | общий UI / ≤60 |
|  | `virusRate` | Частота вирусов | Virus Rate | 바이러스율 | общий UI / ≤60 |
|  | `webglNow` | Сейчас: WebGL-вода. Клик → мультяшный. | Now: WebGL water. Click for cartoon. | 현재: WebGL 물. 카툰으로 클릭. | общий UI / ≤60 |
| 🆕 | `wgl.diff1` | Фон воды рисует WebGL-шейдер (рябь, каустика, блик) | Water background drawn by WebGL shader (ripples, caustics, glints) | 물 배경은 WebGL 셰이더로 그림 (물결, 코스틱, 반짝임) | общий UI / ≤60 |
| 🆕 | `wgl.diff2` | Основной canvas прозрачный поверх GL | Main canvas transparent over GL | 메인 캔버스는 GL 위에서 투명 | общий UI / ≤60 |
| 🆕 | `wgl.same1` | Мир и организмы на Canvas 2D | World and organisms on Canvas 2D | 세계와 생물은 Canvas 2D | общий UI / ≤60 |
| 🆕 | `wgl.same2` | Управление/еда/движение без смены симуляции | Controls/food/movement without simulation change | 조작/먹이/이동 시뮬레이션 변경 없음 | общий UI / ≤60 |
|  | `wiki` | ВИКИ | WIKI | 위키 | общий UI / ≤60 |
| 🆕 | `wiki.def.shell` | Кремниевый панцирь | Silica shell | 규소 껍질 | вики / ≤300 |
| 🆕 | `wiki.def.spikes` | Шипы | Spikes | 가시 | вики / ≤300 |
| 🆕 | `wiki.def.toxic` | Токсичность | Toxicity | 독성 | вики / ≤300 |
| 🆕 | `wiki.def.venom` | Яд | Venom | 독액 | вики / ≤300 |
| 🆕 | `wiki.defs` | Особенности: | Features: | 특징: | вики / ≤300 |
| 🆕 | `wiki.div.binary` | Деление надвое | Binary fission | 이분열 | вики / ≤300 |
| 🆕 | `wiki.div.budding` | Почкование | Budding | 출아 | вики / ≤300 |
| 🆕 | `wiki.searchPh` | Поиск… | Search... | 검색... | вики / ≤300 |
|  | `wikiT` | Вики: жители лужи | Wiki: Pond Life | 위키: 연못 생물 | общий UI / ≤60 |
| 🆕 | `x.a` | Взр | A | 나이 | метки/подписи / ≤60 |
| 🆕 | `x.alive` | Живых | Alive | 생존 | метки/подписи / ≤60 |
| 🆕 | `x.bacteriophageInfectsBacteriaCauses` | Бактериофаг. Заражает бактерии, вызывает лизис. | Bacteriophage. Infects bacteria, causes lysis. | 박테리오파지. 세균을 감염시켜 용해를 일으킴. | метки/подписи / ≤60 |
| 🆕 | `x.born` | Родилось | Born | 탄생 | метки/подписи / ≤60 |
| 🆕 | `x.chloroplasts` | хлоропласты | chloroplasts | 엽록체 | метки/подписи / ≤60 |
| 🆕 | `x.cilia` | реснички | cilia | 섬모 | метки/подписи / ≤60 |
| 🆕 | `x.contractileVacuole` | сокр. вакуоль | contractile vacuole | 수축포 | метки/подписи / ≤60 |
| 🆕 | `x.cover` |  · укрытие |  · cover |  · 은신처 | метки/подписи / ≤60 |
| 🆕 | `x.currentlyAlive` | Сейчас живы | Currently alive | 현재 생존 | метки/подписи / ≤60 |
| 🆕 | `x.cyst` | Циста | Cyst | 낭포 | метки/подписи / ≤60 |
| 🆕 | `x.cyst2` |  · ЦИСТА |  · CYST |  · 낭포 | метки/подписи / ≤60 |
| 🆕 | `x.dead` | Погибло | Dead | 사망 | метки/подписи / ≤60 |
| 🆕 | `x.dividing` | Делится | Dividing | 분열 중 | метки/подписи / ≤60 |
| 🆕 | `x.division` | Деление | Division | 분열 | метки/подписи / ≤60 |
| 🆕 | `x.e` | Эн | E | 에너 | метки/подписи / ≤60 |
| 🆕 | `x.flagella` | жгутик | flagella | 편모 | метки/подписи / ≤60 |
| 🆕 | `x.food` | Пища | Food | 먹이 | метки/подписи / ≤60 |
| 🆕 | `x.foodScent` | Запах еды | Food scent | 먹이 냄새 | метки/подписи / ≤60 |
| 🆕 | `x.golgi` | гольджи | Golgi | 골지체 | метки/подписи / ≤60 |
| 🆕 | `x.healthy` | Здоров | Healthy | 건강 | метки/подписи / ≤60 |
| 🆕 | `x.infected` | Заражен | Infected | 감염됨 | метки/подписи / ≤60 |
| 🆕 | `x.infected2` | Заражен! | Infected! | 감염됨! | метки/подписи / ≤60 |
| 🆕 | `x.infected3` | Инфицировано | Infected | 감염됨 | метки/подписи / ≤60 |
| 🆕 | `x.locomotion` | Движение | Locomotion | 운동 | метки/подписи / ≤60 |
| 🆕 | `x.lysed` | Лизировано | Lysed | 용해됨 | метки/подписи / ≤60 |
| 🆕 | `x.macroMicronucleus` | макро/микронуклеус | macro/micronucleus | 대핵/소핵 | метки/подписи / ≤60 |
| 🆕 | `x.mitochondria` | митохондрии | mitochondria | 미토콘드리아 | метки/подписи / ≤60 |
| 🆕 | `x.move` | Движение | Move | 이동 | метки/подписи / ≤60 |
| 🆕 | `x.nothingFound` | Ничего не найдено. | Nothing found. | 찾을 수 없음. | метки/подписи / ≤60 |
| 🆕 | `x.nucleus` | ядро | nucleus | 핵 | метки/подписи / ≤60 |
| 🆕 | `x.organelles` | Органеллы | Organelles | 소기관 | метки/подписи / ≤60 |
| 🆕 | `x.phages` | Фагов | Phages | 파지 | метки/подписи / ≤60 |
| 🆕 | `x.pondStatistics` | Статистика Водоёма | Pond Statistics | 연못 통계 | метки/подписи / ≤60 |
| 🆕 | `x.predators` | Враги | Predators | 포식자 | метки/подписи / ≤60 |
| 🆕 | `x.pseudopodia` | псевдоподии | pseudopodia | 가족 | метки/подписи / ≤60 |
| 🆕 | `x.s` | Рзм | S | 크기 | метки/подписи / ≤60 |
| 🆕 | `x.scaleBar` | Масштаб: 100 мкм | Scale: 100 µm | 배율: 100 µm | метки/подписи / ≤60 |
| 🆕 | `x.size` | Размер | Size | 크기 | метки/подписи / ≤60 |
| 🆕 | `x.starving` | Голод | Starving | 굶주림 | метки/подписи / ≤60 |
| 🆕 | `x.totalBorn` | Всего родилось | Total born | 총 탄생 | метки/подписи / ≤60 |
| 🆕 | `x.trichocysts` | трихоцисты | trichocysts | 자포 | метки/подписи / ≤60 |
| 🆕 | `x.virusMode` | РЕЖИМ ВИРУСА | VIRUS MODE | 바이러스 모드 | метки/подписи / ≤60 |
| 🆕 | `x.wasdSwimLmbCursorRmbTargetWheel` | <span><kbd>WASD</kbd> Плывать</span><span><kbd>ЛКМ</kbd> К курсору</span><span><kbd>ПкМ</kbd> Цель</span><span><kbd>Колесо</kbd> Зум</span><span class="kh-sum">Кнопки: E Q R Space Tab F M N V B P</span> | <span><kbd>WASD</kbd> Swim</span><span><kbd>LMB</kbd> Cursor</span><span><kbd>RMB</kbd> Target</span><span><kbd>Wheel</kbd> Zoom</span><span class="kh-sum">Buttons: E Q R Space Tab F M N V B P</span> | <span><kbd>WASD</kbd> 수영</span><span><kbd>LMB</kbd> 커서</span><span><kbd>RMB</kbd> 대상</span><span><kbd>휠</kbd> 확대</span><span class="kh-sum">키: E Q R Space Tab F M N V B P</span> | метки/подписи / ≤60 |
| 🆕 | `x.wasdSwimLmbCursorRmbTargetWheel2` | <span><kbd>WASD</kbd> Плыть</span><span><kbd>ЛКМ</kbd> К курсору</span><span><kbd>ПКМ</kbd> Цель</span><span><kbd>Колесо</kbd> Зум</span><span class="kh-sum">Кнопки: E Q R Space Tab F M N V B P</span> | <span><kbd>WASD</kbd> Swim</span><span><kbd>LMB</kbd> Cursor</span><span><kbd>RMB</kbd> Target</span><span><kbd>Wheel</kbd> Zoom</span><span class="kh-sum">Buttons: E Q R Space Tab F M N V B P</span> | <span><kbd>WASD</kbd> 수영</span><span><kbd>LMB</kbd> 커서</span><span><kbd>RMB</kbd> 대상</span><span><kbd>휠</kbd> 확대</span><span class="kh-sum">키: E Q R Space Tab F M N V B P</span> | метки/подписи / ≤60 |
| 🆕 | `x.wind` | Ветер | Wind | 바람 | метки/подписи / ≤60 |
| 🆕 | `x.you` | Это Вы | You | 당신 | метки/подписи / ≤60 |
| 🆕 | `x.yourCell` | Ваша клетка | Your cell | 당신의 세포 | метки/подписи / ≤60 |
| 🆕 | `x.yourSpecies` | Ваш вид:  | Your species:  | 당신의 종:  | метки/подписи / ≤60 |
| 🆕 | `loc.drift` | дрейф | drift | 표류 | вики «Движение» / ≤18 |
| 🆕 | `loc.glide` | скользящий | glide | 활주 | вики «Движение» / ≤18 |
| 🆕 | `loc.flagella` | жгутики | flagella | 편모 | вики «Движение» / ≤18 |
| 🆕 | `loc.cilia` | реснички | cilia | 섬모 | вики «Движение» / ≤18 |
| 🆕 | `loc.ciliaStalk` | реснички на стебельке | cilia on stalk | 대บน 섬모 | вики «Движение» / ≤18 |
| 🆕 | `loc.pseudopodia` | псевдоподии | pseudopodia | 의사족 | вики «Движение» / ≤18 |
| 🆕 | `loc.sessile` | прикреплённый | sessile | 고정 | вики «Движение» / ≤18 |
| 🆕 | `loc.budding` | почкование | budding | 출아 | вики «Движение» / ≤18 |
| 🆕 | `loc.growth` | рост | growth | 성장 | вики «Движение» / ≤18 |

## Вики — тела видов (108)

| id | en | ko |
|---|---|---|
| `0` | Synechocystis is a cyanobacterium with no nucleus. It lives on light: oxygenic photosynthesis on membranes, no chloroplasts. Lab model for hydrogen metabolism. | Synechocystis는 핵이 없는 시아노박테리아다. 빛으로 살아간다: 막 위에서 산소 발생 광합성을 하며 엽록체는 없다. 수소 대사 연구의 실험 모델. |
| `1` | Anabaena variabilis is a filament. Some cells become heterocysts and fix nitrogen while neighbours make sugar. In the pond it supplies bound nitrogen. | Anabaena variabilis는 세포가 실처럼 이어진 사상체다. 일부 세포가 헤테로시스트가 되어 질소를 고정하는 동안 이웃 세포는 당을 만든다. 연못에서는 결합 질소의 공급원이다. |
| `2` | Spirulina (Arthrospira) is a coil of cells with gas vesicles. It hangs near the surface, photosynthesizes, and is edible. In-game it is a large green screw at the water film. | Spirulina(Arthrospira)는 가스 소포를 가진 세포의 나선체다. 수면 근처에 떠서 광합성을 하며 식용이 가능하다. 게임에서는 물 표면 막에 있는 커다란 초록 나사다. |
| `3` | Nostoc punctiforme is a bead chain in a slime capsule. It lives free or in plant symbiosis. The colony looks like a clump of green beads. | Nostoc punctiforme는 점액질 캡슐 속의 구슬 사슬이다. 자유 생활도 하고 식물과 공생도 한다. 군집은 초록 구슬 덩어리처럼 보인다. |
| `4` | Oscillatoria limnetica is a gliding filament. It oscillates side to side and can photosynthesize without releasing oxygen. Typical of silt and surface film. | Oscillatoria limnetica는 미끄러지듯 이동하는 사상체다. 좌우로 진동하며 산소를 방출하지 않는 광합성도 할 수 있다. 진흙과 표면 막의 전형적인 주민이다. |
| `5` | Microcystis aeruginosa is a mucilage colony, often toxic (microcystin). It causes water bloom. In-game it is a green colony ball, risky prey. | Microcystis aeruginosa는 점액질 군집으로, 종종 독성을 띤다(미크로시스틴). 녹조를 일으킨다. 게임에서는 초록 군집 공으로, 위험한 먹잇감이다. |
| `6` | Gloeocapsa is paired cells in colored sheaths. It lives on rocks and soil and tolerates UV. In the pond it is small paired cocci in a coat. | Gloeocapsa는 색이 있는 외피 속의 쌍세포다. 바위와 토양에서 살며 자외선을 잘 견딘다. 연못에서는 외투를 입은 작은 쌍구균이다. |
| `7` | Lyngbya majuscula is a thick cyanobacterial filament. It can release irritating toxins. It forms mats near warm shores. | Lyngbya majuscula는 굵은 남세균 사상체다. 자극성 독소를 방출할 수 있다. 따뜻한 물가 근처에 매트를 형성한다. |
| `8` | Chlamydomonas reinhardtii is a green cell with two flagella and an eyespot. It swims toward light. Classic algal genetics model. | Chlamydomonas reinhardtii는 편모 두 개와 안점을 가진 녹색 세포다. 빛을 향해 헤엄친다. 조류 유전학의 고전적 모델. |
| `9` | Chlorella vulgaris is a non-motile green ball. It divides fast and is protein-rich. Food for small eaters and a space-food subject. | Chlorella vulgaris는 움직이지 않는 녹색 공이다. 분열이 빠르고 단백질이 풍부하다. 작은 먹이감들의 사료이자 우주 식량 연구 대상이다. |
| `10` | Volvox globator is a hollow sphere of thousands of cells. Daughter colonies ripen inside and exit. In-game it is a large green colony. | Volvox globator는 수천 개의 세포로 이루어진 속이 빈 구체다. 딸 군집이 안에서 자라서 밖으로 나온다. 게임에서는 커다란 녹색 군집이다. |
| `11` | Euglena gracilis is a mixotroph: chloroplasts plus the ability to eat. A red eyespot tracks light. Green by day; in the dark it switches to food. | Euglena gracilis는 혼합영양생물이다: 엽록체를 가지면서도 먹이를 먹을 수 있다. 붉은 안점이 빛을 추적한다. 낮에는 녹색이고, 어둠에서는 포식으로 전환한다. |
| `12` | Scenedesmus quadricauda is usually four cells in a row with end spines. Spines make swallowing harder. It does not swim — it drifts. | Scenedesmus quadricauda는 보통 네 세포가 한 줄로 늘어서고 끝에 가시가 있다. 가시 때문에 삼키기 어렵다. 헤엄치지 않고 떠다닌다. |
| `13` | Haematococcus pluvialis is a green motile cell; under stress it turns red (astaxanthin) and grows a thick wall. Red cysts survive drought. | Haematococcus pluvialis는 녹색의 운동성 세포로, 스트레스를 받으면 붉게 변하고(아스타잔틴) 두꺼운 벽을 만든다. 붉은 시스트는 가뭄을 견뎌낸다. |
| `14` | Dunaliella salina has no rigid wall and lives in very salty water. It stores beta-carotene and looks orange. Two flagella. | Dunaliella salina는 단단한 세포벽이 없고 아주 짠 물에서 산다. 베타카로틴을 저장해 주황색으로 보인다. 편모는 두 개다. |
| `15` | Micrasterias rotata is a flat star desmid. Two mirrored halves with deep cuts. Non-motile; photosynthesizes in acidic bog water. | Micrasterias rotata는 납작한 별 모양의 접합조류다. 깊은 홈이 있는 거울상의 두 반세포로 이루어진다. 움직이지 않으며 산성 습지 물에서 광합성한다. |
| `16` | Navicula is a boat-shaped diatom with a silica valve. It glides on the substrate along a raphe slit. The shell remains after death. | Navicula는 규질 판을 가진 배 모양의 규조류다. 봉선(raphe) 틈을 따라 기질 위를 미끄러진다. 죽은 뒤에도 껍질이 남는다. |
| `17` | Pinnularia viridis is a large pennate diatom. Silica shell with a symmetric pattern. It glides slowly on the bottom. | Pinnularia viridis는 대형 우상 규조류다. 대칭 무늬의 규질 껍질을 가진다. 바닥을 천천히 미끄러진다. |
| `18` | Cyclotella meneghiniana is a circular centric diatom. It floats as a disc; the shell is two lids. Typical plankton. | Cyclotella meneghiniana는 원형의 중심 규조류다. 원반처럼 떠다니며 껍질은 뚜껑 두 장이다. 전형적인 플랑크톤이다. |
| `19` | Diatoma vulgare is a diatom that sticks into a zigzag. The colony increases drag in the water column. | Diatoma vulgare는 지그재그로 붙는 규조류다. 군집은 수층에서의 저항을 키운다. |
| `20` | Rhodospirillum rubrum is a purple spiral. Anoxygenic photosynthesis plus organics. Red color comes from bacteriochlorophyll. | Rhodospirillum rubrum은 자색 나선균이다. 비산소 발생 광합성에 유기물도 이용한다. 붉은색은 박테리오클로로필 때문이다. |
| `21` | Chromatium vinosum is a purple sulfur bacterium. It oxidizes hydrogen sulfide and stores sulfur granules. Lives at the oxygen/sulfur boundary. | Chromatium vinosum은 자색 황세균이다. 황화수소를 산화하고 황 과립을 저장한다. 산소/황 경계에서 산다. |
| `22` | Porphyridium cruentum is a unicellular red alga. Phycoerythrin gives a blood-red color. Mucilage coat, no flagella. | Porphyridium cruentum은 단세포 홍조류다. 피코에리트린이 핏빛 색을 낸다. 점액질 외피가 있고 편모는 없다. |
| `23` | Prochlorococcus marinus is the smallest and most abundant photosynthetic cell on Earth. Discovered in the 1980s. It feeds the ocean. | Prochlorococcus marinus는 지구상에서 가장 작고 가장 많은 광합성 세포다. 1980년대에 발견됐다. 바다를 먹여 살린다. |
| `24` | Chroococcidiopsis thermalis is an extremophile: desert, rock, radiation. A candidate for life beyond Earth. In the pond it is a slow coccus colony. | Chroococcidiopsis thermalis는 극한 환경 미생물이다: 사막, 암석, 방사선을 견딘다. 지구 밖 생명체의 후보다. 연못에서는 느린 구균 군집이다. |
| `25` | Bdellovibrio bacteriovorus is a tiny bacterial predator. It screws into another cell and multiplies until the host bursts. | Bdellovibrio bacteriovorus는 아주 작은 세균 포식자다. 다른 세포 안으로 비틀며 들어가 숙주가 터질 때까지 증식한다. |
| `26` | Vampirococcus sits on prey from the outside and sucks out the contents without entering. A bacterial vampire. | Vampirococcus는 먹잇감에 겉에서 달라붙어 안에 들어가지 않고 내용물을 빨아들인다. 세균계의 뱀파이어다. |
| `27` | Daptobacter enters a prey bacterium and eats it from inside. A rare intracellular hunter. | Daptobacter는 먹잇감 세균 안으로 침입해 내부에서 먹어 치운다. 드문 세포 내 사냥꾼이다. |
| `28` | Myxococcus xanthus is a social bacterium. In a pack it surrounds prey and releases enzymes. When starved it forms a fruiting body. | Myxococcus xanthus는 사회성 세균이다. 무리를 지어 먹잇감을 포위하고 효소를 방출한다. 굶주리면 자실체를 만든다. |
| `29` | Bacteriovorax stolpii is a marine Bdellovibrio relative. It attacks Gram-negatives and lives in the prey periplasm. | Bacteriovorax stolpii는 해양성 Bdellovibrio 근연종이다. 그람음성균을 공격하고 먹잇감의 페리플라즘에서 산다. |
| `30` | Halobacteriovorax is a salt-tolerant bacterial hunter. Same trick: puncture the wall and grow inside. | Halobacteriovorax는 내염성 세균 사냥꾼이다. 같은 수법: 세포벽을 뚫고 안에서 자란다. |
| `31` | Peredibacter starrii is another BALO predator. A fast comma-shaped flagellate targeting large rods. | Peredibacter starrii는 또 다른 BALO 포식자다. 큰 간균을 노리는 빠른 콤마 모양 편모충이다. |
| `32` | Monas guttula is a small heterotrophic flagellate. It grabs bacteria at the detritus surface. | Monas guttula는 작은 종속영양 편모충이다. 찌꺼기 표면에서 세균을 잡는다. |
| `33` | Oikomonas termo is a drop-shaped flagellate. One flagellum; it hunts in bacterial film. | Oikomonas termo는 방울 모양의 편모충이다. 편모는 하나다. 세균막 안에서 사냥한다. |
| `34` | Anthophysa vegetans is a colony on an iron-manganese stalk. Cells sit in a tuft and catch bacteria. | Anthophysa vegetans는 철·망간 자루 위의 군집이다. 세포들이 송이처럼 앉아 세균을 잡는다. |
| `35` | Chilomonas paramecium is a colorless cryptophyte. Two flagella; it eats dissolved organics and tiny bacteria, no chloroplasts. | Chilomonas paramecium은 무색의 크립토조류다. 편모 두 개로 용존 유기물과 아주 작은 세균을 먹으며 엽록체는 없다. |
| `36` | Cercomonas longicauda is an amoeboflagellate with a long tail. It crawls and swallows bacteria with pseudopodia. | Cercomonas longicauda는 긴 꼬리를 가진 아메바성 편모충이다. 기어 다니며 의족으로 세균을 삼킨다. |
| `37` | Heteromita globosa is a soil flagellate. Two flagella of different length; a main bacterial eater in soil. | Heteromita globosa는 토양 편모충이다. 길이가 다른 편모 두 개를 가지며 토양의 주요 세균 포식자다. |
| `38` | Bodo saltans is a kinetoplastid. It 'dances' in place, attached by the rear flagellum, and snatches bacteria. | Bodo saltans는 키네토플라스트류다. 뒤쪽 편모로 붙은 채 제자리에서 '춤추며' 세균을 낚아챈다. |
| `39` | Procryptobia sorokini is a Bodo relative. It swims freely and strikes prey with the anterior flagellum. | Procryptobia sorokini는 Bodo의 근연종이다. 자유롭게 헤엄치고 앞쪽 편모로 먹잇감을 때린다. |
| `40` | Trypanosoma brucei is a blood parasite causing sleeping sickness. Undulating membrane and one flagellum. In the pond it is a slim-hunter model. | Trypanosoma brucei는 수면병을 일으키는 혈액 기생충이다. 파동막과 편모 하나를 가진다. 연못에서는 날씬한 사냥꾼 모델이다. |
| `41` | Leishmania donovani is an intracellular human parasite. Flagellated in the insect, aflagellate inside a macrophage. | Leishmania donovani는 사람의 세포 내 기생충이다. 곤충 체내에서는 편모형, 대식세포 안에서는 무편모형이다. |
| `42` | Monosiga brevicollis is a choanoflagellate, an animal relative. A microvilli collar filters bacteria. | Monosiga brevicollis는 동물의 친척인 깃편모충이다. 미세융모 깃으로 세균을 걸러낸다. |
| `43` | Salpingoeca rosetta is a sessile choanoflagellate in a lorica. It can form a rosette. It filters a water current. | Salpingoeca rosetta는 로리카 안에 사는 부착성 깃편모충이다. 로제트를 만들 수 있다. 물 흐름을 걸러낸다. |
| `44` | Codonosiga botrytis is a choanoflagellate colony on a shared stalk. Several filters on one stem. | Codonosiga botrytis는 공동 자루 위의 깃편모충 군집이다. 한 줄기에 여러 여과기. |
| `45` | Paramecium caudatum is the classic slipper. Thousands of cilia, an oral groove, contractile vacuoles. It filters bacteria. | Paramecium caudatum은 고전적인 짚신벌레다. 수천 개의 섬모, 구강구, 수축포를 가진다. 세균을 걸러 먹는다. |
| `46` | Paramecium bursaria is a slipper with zoochlorella symbionts. Green inside: sugar from algae by day, filtering at night. | Paramecium bursaria는 주오클로렐라 공생체를 가진 짚신벌레다. 속이 초록색이다: 낮에는 조류에서 당을 얻고 밤에는 여과한다. |
| `47` | Stentor coeruleus is a blue trumpet up to a millimetre. It flares into a funnel and drives a current with cilia. It can swim or sit. | Stentor coeruleus는 1밀리미터까지 자라는 파란 나팔 모양 섬모충이다. 깔때기로 펼쳐지고 섬모로 물 흐름을 만든다. 헤엄치거나 붙어 있을 수 있다. |
| `48` | Stentor polymorphus is a relative of the blue stentor, often with zoochlorellae. Shape shifts from trumpet to ball. | Stentor polymorphus는 파란 스텐토르의 근연종으로, 종종 주오클로렐라를 가진다. 나팔에서 공까지 형태가 바뀐다. |
| `49` | Vorticella campanula is a bell on a contractile stalk. The stalk coils into a spiral instantly. The cell itself does not swim away. | Vorticella campanula는 수축하는 자루 위의 종 모양 섬모충이다. 자루가 순식간에 나선으로 감긴다. 세포 자체는 헤엄쳐 달아나지 않는다. |
| `50` | Vorticella microstoma is a small bell. Same spring-stalk, a narrower oral field. Often on detritus. | Vorticella microstoma는 작은 종 모양이다. 같은 용수철 자루에 더 좁은 구부를 가진다. 찌꺼기 위에 흔하다. |
| `51` | Didinium nasutum is a barrel hunter of slippers. It fires toxicysts and swallows prey whole, even if the prey is larger. | Didinium nasutum은 짚신벌레를 사냥하는 항아리 모양 포식자다. 독사포를 쏘고 자기보다 큰 먹잇감도 통째로 삼킨다. |
| `52` | Spirostomum ambiguum is a very long cigar. It contracts several-fold in a fraction of a second. Cilia run in a spiral. | Spirostomum ambiguum은 아주 긴 시가 모양이다. 순식간에 몇 배로 수축한다. 섬모가 나선으로 놓인다. |
| `53` | Blepharisma americanum is a pink ciliate. Blepharismin pigment is light-sensitive. It filters and can attack smaller cells. | Blepharisma americanum은 분홍색 섬모충이다. 색소 블레파리스민은 빛에 민감하다. 여과 섭식하며 더 작은 세포를 공격할 수도 있다. |
| `54` | Euplotes patella walks on cirri as if on legs. Flat, quick turns. It scrapes bacteria off surfaces. | Euplotes patella는 담모를 다리처럼 써서 걷는다. 납작하고 재빨리 방향을 튼다. 표면에서 세균을 긁어모은다. |
| `55` | Stylonychia pustulata is a hypotrich that 'runs' on the bottom. Large cirri, a clear mouth. Predator of small ciliates. | Stylonychia pustulata는 바닥을 '뛰는' 하모류 섬모충이다. 큰 담모와 뚜렷한 입을 가졌다. 작은 섬모충의 포식자다. |
| `56` | Oxytricha trifallax is a genome model: two nuclei and complex DNA rewriting. It walks on cirri and eats bacteria and small protists. | Oxytricha trifallax는 게놈 모델이다: 두 개의 핵과 복잡한 DNA 재배열을 가진다. 담모로 걸으며 세균과 작은 원생생물을 먹는다. |
| `57` | Tetrahymena thermophila is a lab ciliate. Four oral membranelles, fast division. Model for telomeres and cilia. | Tetrahymena thermophila는 실험실 섬모충이다. 입 주변에 네 개의 소막, 빠른 분열. 텔로미어와 섬모 연구의 모델. |
| `58` | Coleps hirtus is a barrel in calcareous plates with spines. Scavenger and predator: it bites into the wounded. | Coleps hirtus는 가시가 있는 석회질 판을 입은 통 모양이다. 청소자이자 포식자: 다친 개체를 갉아먹는다. |
| `59` | Litonotus lamella is a flat predator with toxicysts in a 'proboscis'. It paralyzes prey and sucks it out. | Litonotus lamella는 '코'에 독사포를 가진 납작한 포식자다. 먹잇감을 마비시키고 빨아들인다. |
| `60` | Dileptus anser has a long neck with venomous extrusomes. It strikes with the neck, then swallows. A large mid-tier hunter. | Dileptus anser는 독이 든 엑스트루솜을 지닌 긴 목을 가졌다. 목으로 때린 뒤 삼킨다. 중간 단계의 대형 사냥꾼이다. |
| `61` | Urocentrum turbo is a spinning top: an equatorial ciliary belt spins the cell in place. It filters bacteria. | Urocentrum turbo는 팽이다: 적도의 섬모대가 세포를 제자리에서 돌린다. 세균을 걸러낸다. |
| `62` | Zoothamnium arbuscula is a branched colony of bells. A shared contractile stalk jerks the whole tree at once. | Zoothamnium arbuscula는 가지가 갈라진 종 모양 군집이다. 공동 수축 자루가 나무 전체를 한 번에 당긴다. |
| `63` | Opercularia coarctata is a sessile peritrich without a spring stalk. A lid covers the mouth. It filters and does not swim away. | Opercularia coarctata는 용수철 자루가 없는 부착성 주모충이다. 뚜껑이 입을 덮는다. 여과하고 달아나지 않는다. |
| `64` | Amoeba proteus is the classic amoeba. Pseudopodia flow around prey. No fixed shape, no cilia. | Amoeba proteus는 고전적인 아메바다. 위족이 먹잇감을 감싼다. 고정된 형태도 섬모도 없다. |
| `65` | Arcella vulgaris is a testate amoeba with a rigid dome. Pseudopodia emerge from the aperture. It crawls on plants. | Arcella vulgaris는 단단한 돔을 가진 유각 아메바다. 위족은 개구부로 나온다. 식물 위를 기는다. |
| `66` | Difflugia oblonga has a shell of sand grains the amoeba glues itself. It lives in silt. | Difflugia oblonga는 아메바가 직접 모래알을 붙여 만든 껍질을 가진다. 진흙 속에 산다. |
| `67` | Euglypha alveolata has a shell of silica scales. Thin filose pseudopodia. A small bacterial predator. | Euglypha alveolata는 규질 비늘로 된 껍질을 가진다. 가는 실 모양 위족을 낸다. 작은 세균 포식자다. |
| `68` | Nebela collaris is a bottle-shaped shell built from stolen scales. Forest and bog waters. | Nebela collaris는 훔쳐온 비늘로 만든 병 모양 껍질을 가진다. 숲과 습지의 물에 산다. |
| `69` | Centropyxis aculeata is a disc shell with spines. The aperture is offset. It crawls on detritus. | Centropyxis aculeata는 가시 있는 원반 모양 껍질이다. 개구부가 치우쳐 있다. 찌꺼기 위를 기는다. |
| `70` | Actinophrys sol is a heliozoan: thin axopodia radiate all around. Prey sticks to the rays and is pulled in. | Actinophrys sol은 태양충이다: 가는 축족이 사방으로 뻗는다. 먹잇감이 광선에 달라붙으면 끌어당겨진다. |
| `71` | Actinosphaerium eichhorni is a large multinucleate heliozoan. Same rays, much bigger cell. It eats ciliates and rotifers. | Actinosphaerium eichhorni는 대형 다핵 태양충이다. 같은 광선이지만 세포가 훨씬 크다. 섬모충과 윤충을 먹는다. |
| `72` | Raphidiophrys pallida is a heliozoan in scales. Rays carry silica needles. An ambush plankton hunter. | Raphidiophrys pallida는 비늘을 두른 태양충이다. 광선에 규질 바늘을 지닌다. 매복형 플랑크톤 사냥꾼이다. |
| `73` | Rotaria rotatoria is a rotifer that can survive drying. A corona wheels food into the mouth. A true multicellular animal. | Rotaria rotatoria는 건조를 견디는 윤충이다. 섬모관이 먹이를 입으로 돌려 넣는다. 진정한 다세포 동물이다. |
| `74` | Philodina roseola is a pink bdelloid rotifer. It crawls like a leech and also swims. Females only; no males. | Philodina roseola는 분홍색의 브델로이드 윤충이다. 거머리처럼 기고 헤엄도 친다. 암컷만 있고 수컷은 없다. |
| `75` | Brachionus plicatilis is a planktonic loricate rotifer. Fry food in aquaculture. It filters algae and bacteria. | Brachionus plicatilis는 갑을 가진 플랑크톤성 윤충이다. 양식업의 치어 사료다. 조류와 세균을 걸러낸다. |
| `76` | Keratella cochlearis is a rotifer with a long lorica spine. The spine deters predators. Common pond plankton. | Keratella cochlearis는 갑의 긴 가시를 가진 윤충이다. 가시가 포식자를 막는다. 흔한 연못 플랑크톤이다. |
| `77` | Asplanchna priodonta is a sack without a lorica, a predatory rotifer. It swallows other rotifers and ciliates whole. | Asplanchna priodonta는 갑이 없는 자루 모양의 포식성 윤충이다. 다른 윤충과 섬모충을 통째로 삼킨다. |
| `78` | Chaetonotus maximus is a gastrotrich. Scale-covered, it crawls on the bottom. It eats bacteria and detritus. | Chaetonotus maximus는 복모동물이다. 비늘로 덮여 바닥을 기는다. 세균과 찌꺼기를 먹는다. |
| `79` | Lepidodermella squamata is a small gastrotrich in overlapping scales. Very fast in-place turns. | Lepidodermella squamata는 겹친 비늘을 가진 작은 복모동물이다. 제자리 회전이 매우 빠르다. |
| `80` | Macrostomum lignano is a microscopic flatworm. Real muscles and eyes. A regeneration model. It hunts small protists. | Macrostomum lignano는 현미경 크기의 편형동물이다. 진짜 근육과 눈을 가졌다. 재생 연구의 모델이다. 작은 원생생물을 사냥한다. |
| `81` | Stenostomum leucops is a thin ciliated worm. It divides across into a chain of zooids. Predator of detritus and small animals. | Stenostomum leucops는 가는 섬모 벌레다. 가로로 분열해 개체 사슬을 만든다. 찌꺼기와 작은 동물의 포식자다. |
| `82` | Microstomum lineare is a flatworm that eats hydra and embeds their stinging cells in its own skin. A chain of zooids. | Microstomum lineare는 히드라를 먹고 그 자포를 자기 피부에 심는 편형동물이다. 개체 사슬을 만든다. |
| `83` | Prostoma graecense is a freshwater nemertean. A long proboscis shoots at prey. A rare large bottom hunter. | Prostoma graecense는 담수 유형동물이다. 긴 주둥이가 먹잇감을 향해 발사된다. 드문 대형 저서 사냥꾼이다. |
| `84` | Trichoplax adhaerens is a placozoan, among the simplest animals. It crawls as a sheet and digests food outside. No mouth. | Trichoplax adhaerens는 판형동물로 가장 단순한 동물 중 하나다. 시트처럼 기고 체외에서 소화한다. 입이 없다. |
| `85` | Saccharomyces cerevisiae is baker's yeast. It buds, eats sugar, releases CO2 and alcohol. In the pond it cleans dissolved organics. | Saccharomyces cerevisiae는 빵 효모다. 출아하고, 당을 먹고, CO2와 알코올을 낸다. 연못에서는 용존 유기물 청소부다. |
| `86` | Candida albicans is a yeast that can grow as filaments. An opportunistic human pathogen. In-game it is a detrital fungus. | Candida albicans는 균사로 자랄 수 있는 효모다. 사람의 기회감염 병원체다. 게임에서는 찌꺼기 진균이다. |
| `87` | Mucor mucedo is bread mold. Sporangia on stalks, fast growth over the dead. It does not hunt the living. | Mucor mucedo는 빵 곰팡이다. 자루 위 포자낭, 죽은 것 위에서 빠르게 자란다. 산 것을 사냥하지 않는다. |
| `88` | Rhizopus stolonifer is black bread mold. Stolons and rhizoids spread over the substrate. It breaks down starch. | Rhizopus stolonifer는 검은 빵 곰팡이다. 포복경과 가근이 기질 위로 퍼진다. 전분을 분해한다. |
| `89` | Penicillium chrysogenum is a brush mold, the source of penicillin. Conidial brushes. It decomposes organics and suppresses nearby bacteria. | Penicillium chrysogenum은 붓 모양 곰팡이로, 페니실린의 원천이다. 분생자 붓. 유기물을 분해하고 주변 세균을 억제한다. |
| `90` | Aspergillus niger is black aspergillus. Spherical spore heads. Industrial citric-acid producer. A saprotroph. | Aspergillus niger는 검은 코우지곰팡이다. 구형 포자머리를 가진다. 구연산의 산업 생산자다. 부생균. |
| `91` | Batrachochytrium dendrobatidis is a chytrid of frogs. Uniflagellate zoospores. In the pond it is a water-fungus model. | Batrachochytrium dendrobatidis는 개구리의 키트리드 곰팡이다. 편모 하나의 유주자를 낸다. 연못에서는 수생 곰팡이 모델이다. |
| `92` | Chytriomyces aureus is a water chytrid on pollen and algae. Golden sporangia; zoospores swim to the substrate. | Chytriomyces aureus는 꽃가루와 조류에 붙는 수생 키트리드다. 황금색 포자낭, 유주자는 기질로 헤엄쳐 간다. |
| `93` | Allomyces macrogynus is a water fungus with true mycelium. It alternates diploid and haploid. Zoospores have a posterior flagellum. | Allomyces macrogynus는 진짜 균사체를 가진 수생 곰팡이다. 이배체와 반수체를 번갈아 한다. 유주자는 뒤쪽 편모를 가진다. |
| `94` | Bacillus subtilis is a soil rod. Spores survive boiling. It breaks down protein; a Gram-positive model. | Bacillus subtilis는 토양 간균이다. 아포는 끓는 물에서도 살아남는다. 단백질을 분해하며 그람양성 모델이다. |
| `95` | Pseudomonas putida is a cleanup rod. It even eats petroleum products. Motile flagellum, fast growth on detritus. | Pseudomonas putida는 청소 간균이다. 석유 제품까지 먹는다. 운동성 편모, 찌꺼기 위 빠른 성장. |
| `96` | Streptomyces coelicolor is a filamentous soil bacterium. It makes the smell of earth (geosmin) and many antibiotics. Spores on hyphae. | Streptomyces coelicolor는 사상 토양 세균이다. 흙 냄새(게오스민)와 많은 항생제를 만든다. 균사 위에 포자를 맺는다. |
| `97` | Cellulomonas fimi breaks down cellulose. A yellow rod on plant detritus. Without it dead algae would linger longer. | Cellulomonas fimi는 셀룰로스를 분해한다. 식물 찌꺼기 위 노란 간균. 이것이 없으면 죽은 조류가 더 오래 남는다. |
| `98` | Thermus aquaticus is a thermophile from hot springs. Taq polymerase is the basis of PCR. In a cold pond it is almost dormant. | Thermus aquaticus는 온천의 호열균이다. Taq 중합효소는 PCR의 기반이다. 차가운 연못에서는 거의 휴면한다. |
| `99` | Deinococcus radiodurans is the radiation champion. It reassembles a shattered genome in hours. Thick wall, cell tetrads. | Deinococcus radiodurans는 방사선 챔피언이다. 산산조각 난 게놈을 몇 시간 만에 재조립한다. 두꺼운 벽, 4련 세포. |
| `1001` | Sexual Eukaryote is a teaching model of sexual reproduction. Two sexes, gamete fusion, not simple binary fission. | Sexual Eukaryote는 유성 생식의 교육용 모델이다. 두 성이 있고, 배우자가 융합한다. 단순한 이분열이 아니다. |
| `T4 Bacteriophage` | T4 is a large myovirus of E. coli. The tail contracts and injects DNA. In half an hour the cell bursts and dozens of phages exit. | T4는 대장균의 대형 미오바이러스다. 꼬리가 수축하며 DNA를 주입한다. 30분이면 세포가 터지고 수십 마리의 파지가 나온다. |
| `Lambda Phage` | Lambda is a temperate phage. It can insert into the chromosome and sleep (lysogeny) or cut the cell at once (lysis). | 람다 파지는 온화한 파지다. 염색체에 삽입되어 잠들 수도 있고(용원화), 바로 세포를 분해할 수도 있다(용균). |
| `T7 Bacteriophage` | T7 has a short tail and very fast replication. A favourite system in synthetic biology. | T7은 짧은 꼬리에 복제가 매우 빠르다. 합성생물학에서 사랑받는 시스템이다. |
| `Phi-6 Phage` | Phi-6 is an RNA phage with a lipid envelope. It infects Pseudomonas. A rare membrane for a phage. | Phi-6은 지질 외피를 가진 RNA 파지다. Pseudomonas를 감염시킨다. 파지치고는 드문 막 구조다. |
| `MS2 Phage` | MS2 is a tiny tailless RNA phage. It binds male E. coli pili. Its genome was one of the first RNA genomes read. | MS2는 꼬리가 없는 아주 작은 RNA 파지다. 수컷 E. coli의 섬모(필리)에 결합한다. 그 게놈은 최초로 해독된 RNA 게놈 중 하나다. |
| `Neuro-Parasite` | A fictional pond neuro-parasite. It latches onto eukaryotes and breaks host behaviour until the host becomes a carrier. | 가상의 연못 신경 기생충. 진핵생물에 달라붙어 숙주가 매개체가 될 때까지 행동을 망가뜨린다. |
| `Sexual Eukaryote` | Sexual Eukaryote is a teaching model of sexual reproduction. Two sexes, gamete fusion, not simple binary fission. | Sexual Eukaryote는 유성 생식의 교육용 모델이다. 두 성이 있고, 배우자가 융합한다. 단순한 이분열이 아니다. |
