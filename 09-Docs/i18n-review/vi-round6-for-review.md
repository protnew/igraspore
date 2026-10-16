# Пакет на проверку аналитику: vi (круг 6)

- Дата: 2026-10-16 20:36:39 UTC+3  |  Круг: 6
- input_sha256 словарей (полные — для raw<vi-analyst-round6.json):
  - `en.json` = d5b54954a7f4cff6ed13d7abf00c1cd9616eacbbc225d250ea4893dd9411d938
  - `ru.json` = 2610400d06deba97bac15862cfbed319f395ea0bb72759f8ab937960ef6e6c2e
  - `vi.json` = cb092493c4e9a82e4a1aa6e0b6d639a06d26f59639e45f96a7c49b091c96be60
  - `wiki/vi.json` = a7343cb8bc38d3bc47d15321da2a0b7f48df235371c4ac3831af0084a204fded
- Ключей UI: 412 (из них 🆕 новых после круга 4: 272 — U13 263 + U42 loc.* 9); вики-тел: 108
- Rubric 0–10 по 5 осям: смысл, глоссарий, регистр, длина, ошибки. Порог включения ≥ 8.
- Ответ аналитика: `09-Docs/i18n-review/raw/vi-analyst-round6.json` + строка в ANALYST-LEDGER.md (пишет ТОЛЬКО аналитик).

## Снимки 390×844

- `../out-dev-factory/shots-release-ready-2026-10-14/i18n/vi/1280-game.png`
- `../out-dev-factory/shots-release-ready-2026-10-14/i18n/vi/1280-gameover.png`
- `../out-dev-factory/shots-release-ready-2026-10-14/i18n/vi/1280-menu.png`
- `../out-dev-factory/shots-release-ready-2026-10-14/i18n/vi/1280-pause.png`
- `../out-dev-factory/shots-release-ready-2026-10-14/i18n/vi/1280-settings.png`
- `../out-dev-factory/shots-release-ready-2026-10-14/i18n/vi/1280-tutorial.png`
- `../out-dev-factory/shots-release-ready-2026-10-14/i18n/vi/1280-wiki-article.png`
- `../out-dev-factory/shots-release-ready-2026-10-14/i18n/vi/1280-wiki-list.png`
- `../out-dev-factory/shots-release-ready-2026-10-14/i18n/vi/390-game.png`
- `../out-dev-factory/shots-release-ready-2026-10-14/i18n/vi/390-gameover.png`
- `../out-dev-factory/shots-release-ready-2026-10-14/i18n/vi/390-menu.png`
- `../out-dev-factory/shots-release-ready-2026-10-14/i18n/vi/390-pause.png`
- `../out-dev-factory/shots-release-ready-2026-10-14/i18n/vi/390-settings.png`
- `../out-dev-factory/shots-release-ready-2026-10-14/i18n/vi/390-tutorial.png`
- `../out-dev-factory/shots-release-ready-2026-10-14/i18n/vi/390-wiki-article.png`
- `../out-dev-factory/shots-release-ready-2026-10-14/i18n/vi/390-wiki-list.png`

## Словарь UI (412)

| 🆕 | ключ | ru | en | vi | где / макс. длина |
|---|---|---|---|---|---|
| 🆕 | `abt.feed` | КУСЬ | BITE | CẮN | общий UI / ≤60 |
| 🆕 | `abt.fly` | ПОЛЁТ | FLIGHT | BAY | общий UI / ≤60 |
| 🆕 | `abt.follow` | СЛЕДИТЬ | FOLLOW | THEO | общий UI / ≤60 |
|  | `age` | Возраст | Age | Tuổi | общий UI / ≤60 |
|  | `all` | Все | All | Tất cả | общий UI / ≤60 |
|  | `aquarium` | АКВАРИУМ | AQUARIUM | BỂ CÁ | общий UI / ≤60 |
| 🆕 | `aria.apk` | Скачать приложение Android APK | Download Android APK app | Tải app Android APK | общий UI / ≤60 |
| 🆕 | `aria.aqua` | Аквариум | Aquarium | Bể cá | общий UI / ≤60 |
| 🆕 | `aria.auto` | Авто (Tab) | Auto (Tab) | Tự động (Tab) | общий UI / ≤60 |
| 🆕 | `aria.cyst` | Спора (R) | Spore (R) | Bào tử (R) | общий UI / ≤60 |
| 🆕 | `aria.demo` | Демо | Demo | Demo | общий UI / ≤60 |
| 🆕 | `aria.divide` | Делить (Q) | Split (Q) | Chia (Q) | общий UI / ≤60 |
| 🆕 | `aria.eat` | Есть (E) | Eat (E) | Ăn (E) | общий UI / ≤60 |
| 🆕 | `aria.feed` | Ручное питание (Space) | Manual feed (Space) | Cho ăn tay (Space) | общий UI / ≤60 |
| 🆕 | `aria.fly` | Свободный полёт (F) | Free flight (F) | Bay tự do (F) | общий UI / ≤60 |
| 🆕 | `aria.follow2` | Следить за клеткой (V) | Follow cell (V) | Theo tế bào (V) | общий UI / ≤60 |
| 🆕 | `aria.help` | Как играть | How to play | Cách chơi | общий UI / ≤60 |
| 🆕 | `aria.light` | Свет | Light | Ánh sáng | общий UI / ≤60 |
| 🆕 | `aria.micro` | Микроскоп (M) | Microscope (M) | Kính hiển vi (M) | общий UI / ≤60 |
| 🆕 | `aria.pause` | Пауза (P) | Pause (P) | Tạm dừng (P) | общий UI / ≤60 |
| 🆕 | `aria.render` | Режим картинки (N) | Picture mode (N) | Chế độ ảnh (N) | общий UI / ≤60 |
| 🆕 | `aria.set` | Настройки | Settings | Cài đặt | общий UI / ≤60 |
| 🆕 | `aria.start` | Старт | Start | Bắt đầu | общий UI / ≤60 |
| 🆕 | `aria.switches` | Игровые переключатели | Game switches | Công tắc game | общий UI / ≤60 |
| 🆕 | `aria.wiki2` | Вики (B) | Wiki (B) | Wiki (B) | общий UI / ≤60 |
| 🆕 | `aria.zi` | Приблизить | Zoom in | Phóng to | общий UI / ≤60 |
| 🆕 | `aria.zo` | Отдалить | Zoom out | Thu nhỏ | общий UI / ≤60 |
| 🆕 | `auto.off` | АВТО: выкл | AUTO: off | AUTO: tắt | общий UI / ≤60 |
| 🆕 | `auto.on` | АВТО: вкл | AUTO: on | AUTO: bật | общий UI / ≤60 |
|  | `autoOn` | АВТО | AUTO | AUTO | общий UI / ≤60 |
|  | `autoPilotOn` | АВТО-ПИЛОТ ВКЛ | AUTO ON | AUTO ON | общий UI / ≤60 |
|  | `bubbles` | Пузырьки | Bubbles | Bọt | общий UI / ≤60 |
| 🆕 | `cam.fly` | Полёт: WASD / мышь / колёсико | Flight: WASD / mouse / wheel | Bay: WASD / chuột / lăn | общий UI / ≤60 |
| 🆕 | `cam.fly2` | ✈ Полёт: WASD / стрелки / мышь / колёсико | ✈ Flight: WASD / arrows / mouse / wheel | ✈ Bay: WASD / mũi tên / chuột / lăn | общий UI / ≤60 |
| 🆕 | `cam.flyBtn` | ✈ ПОЛЁТ WASD | ✈ FLIGHT WASD | ✈ BAY WASD | общий UI / ≤60 |
| 🆕 | `cam.follow` | Камера: следит за клеткой | Camera: following cell | Camera: theo tế bào | общий UI / ≤60 |
| 🆕 | `cam.followBig` | СЛЕДИТЬ | FOLLOW | THEO | общий UI / ≤60 |
| 🆕 | `cam.followToast` | Камера: СЛЕДИТ | Camera: FOLLOW | Camera: THEO | общий UI / ≤60 |
| 🆕 | `cam.tip` | ✈ Полёт камеры. СЛЕДИТЬ (V) — вернуться к клетке | ✈ Camera flight. FOLLOW (V) — return to cell | ✈ Bay camera. THEO (V) — về tế bào | общий UI / ≤60 |
|  | `camFly` | Полёт камеры | Camera flight | Bay camera | общий UI / ≤60 |
|  | `cartoon` | МУЛЬТ | CARTOON | HOẠT HÌNH | общий UI / ≤60 |
|  | `cartoonNow` | Сейчас: мультяшный. Клик → SwissBioPics. | Now: cartoon. Click for Swiss. | Đang: hoạt hình. Bấm để sang Swiss. | общий UI / ≤60 |
| 🆕 | `catShort.consumer1` | мелкий едок | small eater | ăn nhỏ | категория / ≤24 |
| 🆕 | `catShort.consumer2` | средний едок | mid eater | ăn vừa | категория / ≤24 |
| 🆕 | `catShort.consumer3` | крупный охотник | big hunter | thợ săn lớn | категория / ≤24 |
| 🆕 | `catShort.decomposer` | уборщик | cleaner | dọn rác | категория / ≤24 |
| 🆕 | `catShort.producer` | зелёные | greens | xanh | категория / ≤24 |
|  | `clear` | Ясно | Clear | Quang | общий UI / ≤60 |
|  | `close` | ЗАКРЫТЬ | CLOSE | ĐÓNG | общий UI / ≤60 |
|  | `colonies` | колоний | colonies | khuẩn lạc | общий UI / ≤60 |
|  | `colonyBadge` | КОЛОНИЯ · куча клеток | COLONY · clump of cells | KHUẨN LẠC · khối tế bào | общий UI / ≤60 |
|  | `colonyKind` | Колониальный вид | Colony species | Loài khuẩn lạc | общий UI / ≤60 |
|  | `consumer1` | Мелкие едоки | Small eaters | Kẻ ăn nhỏ | общий UI / ≤60 |
|  | `consumer2` | Средние едоки | Mid eaters | Kẻ ăn vừa | общий UI / ≤60 |
|  | `consumer3` | Крупные охотники | Big hunters | Thợ săn lớn | общий UI / ≤60 |
|  | `currents` | Течения | Currents | Dòng chảy | общий UI / ≤60 |
|  | `dAge` | Старость | Old age | Già | общий UI / ≤60 |
|  | `dCauses` | Причины гибели | Death Causes | Nguyên nhân chết | общий UI / ≤60 |
|  | `dEaten` | Съедено | Eaten | Bị ăn | общий UI / ≤60 |
|  | `dLysis` | Лизис | Lysis | Ly giải | общий UI / ≤60 |
|  | `dStarve` | Голод | Starved | Đói chết | общий UI / ≤60 |
|  | `dTemp` | Температура | Temp | Nhiệt | общий UI / ≤60 |
| 🆕 | `dTip.age` | Совет: Старость неизбежна. Важно успеть разделиться до гибели. | Tip: Old age is inevitable. Divide before you die. | Mẹo: Già là không tránh được. Chia trước khi chết. | общий UI / ≤60 |
| 🆕 | `dTip.eaten` | Совет: Избегайте хищников, используйте Режим везения для бегства. | Tip: Avoid predators, use Grace Period to run away. | Mẹo: Tránh thú săn, dùng Thời gian ân sủng để chạy. | общий UI / ≤60 |
| 🆕 | `dTip.lysis` | Совет: Лизис (разрыв мембраны) вызывает вирус. Держитесь от них подальше. | Tip: Lysis is caused by viruses. Stay away from them. | Mẹo: Tan do virus gây ra. Tránh xa chúng. | общий UI / ≤60 |
| 🆕 | `dTip.starve` | Совет: Чаще питайтесь, держитесь ближе к скоплениям еды или ускорьте свой вид. | Tip: Eat more often, stay near food clusters, or mutate speed. | Mẹo: Ăn thường xuyên, ở gần cụm thức ăn, hoặc đột biến tốc độ. | общий UI / ≤60 |
| 🆕 | `dTip.temp` | Совет: Следите за термометром. Мутируйте температурный диапазон. | Tip: Watch the thermometer. Mutate your temp range. | Mẹo: Xem nhiệt kế. Đột biến dải nhiệt độ. | общий UI / ≤60 |
|  | `days` | Дней | Days | Ngày | общий UI / ≤60 |
|  | `dead` | ВЫМИРАНИЕ | EXTINCT | TUYỆT CHỦNG | общий UI / ≤60 |
|  | `decomposer` | Уборщики (грибки) | Cleaners (fungi) | Dọn dẹp (nấm) | общий UI / ≤60 |
|  | `demo` | ДЕМО / Галерея | DEMO / Gallery | DEMO / Thư viện | общий UI / ≤60 |
| 🆕 | `demo.colony` | ⬡КОЛОНИЯ  | ⬡COLONY  | ⬡ĐẠN  | демо / ≤60 |
| 🆕 | `demo.grp.consumer1` | 2. Консументы I | 2. Consumers I | 2. Sinh vật tiêu thụ I | демо / ≤60 |
| 🆕 | `demo.grp.consumer2` | 3. Консументы II | 3. Consumers II | 3. Sinh vật tiêu thụ II | демо / ≤60 |
| 🆕 | `demo.grp.consumer3` | 4. Консументы III | 4. Consumers III | 4. Sinh vật tiêu thụ III | демо / ≤60 |
| 🆕 | `demo.grp.decomposer` | 5. Редуценты | 5. Decomposers | 5. Sinh vật phân giải | демо / ≤60 |
| 🆕 | `demo.grp.producer` | 1. Продуценты | 1. Producers | 1. Sinh vật sản xuất | демо / ≤60 |
| 🆕 | `demo.grp.virus` | 6. Вирусы | 6. Viruses | 6. Virus | демо / ≤60 |
| 🆕 | `demo.labels` | Метки | Labels | Nhãn | демо / ≤60 |
| 🆕 | `demo.tip` | <b>ДЕМО</b> · WASD/мышь — полёт · 1-6 группа · клик = вселиться<br> | <b>DEMO</b> · WASD/mouse fly · 1-6 jump group · click = possess<br> | <b>DEMO</b> · bay WASD/chuột · 1-6 nhóm · click = nhập<br> | демо / ≤60 |
|  | `density` | Плотность | Density | Mật độ | общий UI / ≤60 |
|  | `diffE` | Лёгкий | Easy | Dễ | общий UI / ≤60 |
|  | `diffH` | Сложный | Hard | Khó | общий UI / ≤60 |
|  | `diffN` | Обычный | Normal | Thường | общий UI / ≤60 |
|  | `divRate` | Размножение | Reproduction | Sinh sản | общий UI / ≤60 |
|  | `divs` | Делений | Divisions | Lần chia | общий UI / ≤60 |
| 🆕 | `dna.bad` | Неверная строка ДНК! | Invalid DNA String! | Chuỗi DNA không hợp lệ! | общий UI / ≤60 |
| 🆕 | `dna.export` | Экспорт моего ДНК | Export My DNA | Xuất DNA của tôi | общий UI / ≤60 |
| 🆕 | `dna.import` | Импорт ДНК | Import DNA | Nhập DNA | общий UI / ≤60 |
| 🆕 | `dna.io` | Импорт/Экспорт ДНК | Import/Export DNA | Nhập/Xuất DNA | общий UI / ≤60 |
| 🆕 | `dna.ok` | ДНК импортирована! | DNA Imported Successfully! | Nhập DNA thành công! | общий UI / ≤60 |
| 🆕 | `dna.pastePh` | Вставь код ДНК… | Paste DNA code here... | Dán mã DNA vào đây... | общий UI / ≤60 |
|  | `dnaPoints` | Очки мутации: | Mutation points: | Điểm đột biến: | общий UI / ≤60 |
|  | `dnaShell` | Кремниевый панцирь (20 ДНК) | Silica shell (20 DNA) | Vỏ silica (20 DNA) | общий UI / ≤60 |
|  | `dnaSize` | Увеличение массы (8 ДНК) | More mass (8 DNA) | Thêm khối lượng (8 DNA) | общий UI / ≤60 |
|  | `dnaSpeed` | Ускорение жгутиков (5 ДНК) | Faster flagella (5 DNA) | Roi nhanh hơn (5 DNA) | общий UI / ≤60 |
|  | `dnaSpikes` | Отрастить шипы (15 ДНК) | Grow spikes (15 DNA) | Mọc gai (15 DNA) | общий UI / ≤60 |
|  | `dnaTitle` | Мутации ДНК | DNA mutations | Đột biến DNA | общий UI / ≤60 |
|  | `eaten` | Съедено | Eaten | Đã ăn | общий UI / ≤60 |
|  | `eats` | ест | eats | ăn | общий UI / ≤60 |
|  | `eatsDead` | ест мёртвое | eats dead matter | ăn vật chết | общий UI / ≤60 |
|  | `eatsLight` | ест свет | eats light | ăn ánh sáng | общий UI / ≤60 |
| 🆕 | `edu.anatomy` | Анатомия | Anatomy | Giải phẫu | анатомия / ≤120 |
| 🆕 | `edu.cell` | клетка | cell | tế bào | анатомия / ≤120 |
| 🆕 | `edu.chloro.desc` | Фотосинтез: свет + CO₂ + H₂O → сахар + O₂. Зелёный из‑за хлорофилла. Есть у водорослей и растений. | Photosynthesis: light + CO₂ + H₂O → sugar + O₂. Green from chlorophyll. Found in algae and plants. | Quang hợp: ánh sáng + CO₂ + H₂O → đường + O₂. Xanh nhờ diệp lục. Có ở tảo và thực vật. | анатомия / ≤120 |
| 🆕 | `edu.chloro.name` | Хлоропласт | Chloroplast | Lục lạp | анатомия / ≤120 |
| 🆕 | `edu.cilia.desc` | Короткие подвижные выросты. Создают ток воды: движение + фильтр-питание (затягивают бактерий и водоросли ко рту). | Short moving hairs. Create water currents: movement + filter feeding (pull bacteria and algae to the mouth). | Gai ngắn chuyển động. Tạo dòng nước: di chuyển + ăn lọc (kéo vi khuẩn và tảo vào miệng). | анатомия / ≤120 |
| 🆕 | `edu.cilia.name` | Реснички | Cilia | Lông chuyển | анатомия / ≤120 |
| 🆕 | `edu.cyto.desc` | Внутренняя среда клетки: вода, белки, органеллы. Здесь идут тысячи биохимических реакций. | The cell's inner medium: water, proteins, organelles. Thousands of biochemical reactions run here. | Môi trường trong tế bào: nước, protein, bào quan. Hàng nghìn phản ứng sinh hóa diễn ra ở đây. | анатомия / ≤120 |
| 🆕 | `edu.cyto.name` | Цитоплазма | Cytoplasm | Tế bào chất | анатомия / ≤120 |
| 🆕 | `edu.flagella.desc` | Длинный «мотор» для плавания. Вращается или изгибается — клетка плывёт к пище или от опасности (хемотаксис). | Long swimming motor. Rotates or bends — the cell swims to food or away from danger (chemotaxis). | «Động cơ» dài để bơi. Xoay hoặc uốn — tế bào bơi đến thức ăn hoặc tránh nguy hiểm (hóa hướng động). | анатомия / ≤120 |
| 🆕 | `edu.flagella.name` | Жгутик | Flagellum | Roi | анатомия / ≤120 |
| 🆕 | `edu.hoverHint` | Наведи на точку внутри клетки — название и роль органа | Hover a dot inside the cell — organelle name and role | Di vào chấm trong tế bào — tên và vai trò của bào quan | анатомия / ≤120 |
| 🆕 | `edu.membrane.desc` | Тонкая оболочка из липидов. Контролирует, что входит и выходит. У всех клеток есть мембрана. | Thin lipid envelope. Controls what goes in and out. Every cell has a membrane. | Lớp lipid mỏng. Kiểm soát cái vào ra. Mọi tế bào đều có màng. | анатомия / ≤120 |
| 🆕 | `edu.membrane.name` | Мембрана | Membrane | Màng | анатомия / ≤120 |
| 🆕 | `edu.mito.desc` | «Электростанция» клетки. Дыхание: сахар + O₂ → ATP (энергия). Своя ДНК — остаток древней бактерии. | Power plant of the cell. Respiration: sugar + O₂ → ATP (energy). Has its own DNA — remnant of an ancient bacterium. | «Nhà máy điện» của tế bào. Hô hấp: đường + O₂ → ATP (năng lượng). Có DNA riêng — tàn dư vi khuẩn cổ đại. | анатомия / ≤120 |
| 🆕 | `edu.mito.name` | Митохондрия | Mitochondrion | Ty thể | анатомия / ≤120 |
| 🆕 | `edu.nucleoid.desc` | Зона с кольцевой ДНК у прокариот. Нет ядерной оболочки — геном свободно в цитоплазме. | Region with circular DNA in prokaryotes. No nuclear envelope — the genome floats freely in the cytoplasm. | Vùng chứa DNA vòng ở sinh vật nhân sơ. Không có màng nhân — bộ gen tự do trong tế bào chất. | анатомия / ≤120 |
| 🆕 | `edu.nucleoid.name` | Нуклеоид | Nucleoid | Vùng nhân | анатомия / ≤120 |
| 🆕 | `edu.nucleus.desc` | Хранит ДНК. Управляет ростом, делением и синтезом белков. У бактерий настоящего ядра нет — ДНК в нуклеоиде. | Stores DNA. Controls growth, division and protein synthesis. Bacteria have no true nucleus — DNA sits in the nucleoid. | Chứa DNA. Điều khiển tăng trưởng, phân chia và tổng hợp protein. Vi khuẩn không có nhân thật — DNA nằm ở vùng nhân. | анатомия / ≤120 |
| 🆕 | `edu.nucleus.name` | Ядро | Nucleus | Nhân | анатомия / ≤120 |
| 🆕 | `edu.oral.desc` | У инфузорий — желобок, куда реснички сгоняют добычу. Отсюда пища попадает в пищеварительную вакуоль. | In ciliates — a groove where cilia sweep prey. Food enters the digestive vacuole from here. | Ở trùng roi — rãnh nơi lông quét mồi. Thức ăn từ đây vào không bào tiêu hóa. | анатомия / ≤120 |
| 🆕 | `edu.oral.name` | Ротовая воронка | Oral groove | Rãnh miệng | анатомия / ≤120 |
| 🆕 | `edu.vacuole.desc` | Пузырёк с водой, запасными веществами или пищеварительными ферментами. У инфузорий — пищеварительные и сократительные вакуоли. | Vesicle with water, reserves or digestive enzymes. Ciliates have digestive and contractile vacuoles. | Túi chứa nước, chất dự trữ hoặc enzyme tiêu hóa. Ở trùng roi — không bào tiêu hóa và co bóp. | анатомия / ≤120 |
| 🆕 | `edu.vacuole.name` | Вакуоль | Vacuole | Không bào | анатомия / ≤120 |
| 🆕 | `edu.wall.desc` | Жёсткий каркас снаружи мембраны (пептидогликан у бактерий, целлюлоза у растений). Защита и форма. | Rigid frame outside the membrane (peptidoglycan in bacteria, cellulose in plants). Protection and shape. | Khung cứng ngoài màng (peptidoglycan ở vi khuẩn, cellulose ở thực vật). Bảo vệ và tạo hình. | анатомия / ≤120 |
| 🆕 | `edu.wall.name` | Клеточная стенка | Cell wall | Thành tế bào | анатомия / ≤120 |
|  | `energy` | Энергия | Energy | Năng lượng | общий UI / ≤60 |
| 🆕 | `ev.acid_rain` | Кислотный дождь | Acid rain | Mưa axit | событие / ≤60 |
| 🆕 | `ev.eclipse` | Солнечное затмение | Solar eclipse | Nhật thực | событие / ≤60 |
| 🆕 | `ev.ended` | {name} закончился | {name} ended | {name} kết thúc | событие / ≤60 |
| 🆕 | `ev.warn` | ВНИМАНИЕ: {name}! | WARNING: {name}! | CẢNH BÁO: {name}! | событие / ≤60 |
|  | `exit` | Выход | Exit | Thoát | общий UI / ≤60 |
| 🆕 | `fc.consumer1` | грызут зелёных | nibble greens | gặm loài xanh | общий UI / ≤60 |
| 🆕 | `fc.consumer2` | фильтруют мелочь | filter small ones | lọc sinh vật nhỏ | общий UI / ≤60 |
| 🆕 | `fc.consumer3` | едят всех | eat everyone | ăn tất cả | общий UI / ≤60 |
| 🆕 | `fc.decomposer` | убирают мёртвое | clean up dead | dọn xác chết | общий UI / ≤60 |
| 🆕 | `fc.producer` | делают еду из света | make food from light | tạo thức ăn từ ánh sáng | общий UI / ≤60 |
| 🆕 | `fc.schema` | (схема) | (schematic) | (sơ đồ) | общий UI / ≤60 |
|  | `filter` | Фильтр | Filter | Lọc | общий UI / ≤60 |
|  | `filterHint` | нажми другую кнопку чтобы сменить | tap another button to switch | bấm nút khác để đổi | общий UI / ≤60 |
|  | `flight` | Полёт | Flight | Bay | общий UI / ≤60 |
|  | `follow` | Следить | Follow | Theo | общий UI / ≤60 |
| 🆕 | `food.decomposer` | мёртвые остатки | dead matter | xác chết | питание / ≤60 |
| 🆕 | `food.producer` | свет + вода + минералы | light + water + minerals | ánh sáng + nước + khoáng | питание / ≤60 |
|  | `fps` | FPS | FPS | FPS | общий UI / ≤60 |
|  | `freeCam` | Своб. камера | Free Cam | Cam tự do | общий UI / ≤60 |
|  | `gameTime` | Время | Time | Thời gian | общий UI / ≤60 |
|  | `healthBars` | Шкалы здоровья | Health Bars | Thanh máu | общий UI / ≤60 |
|  | `help` | КАК ИГРАТЬ | HOW TO PLAY | CÁCH CHƠI | общий UI / ≤60 |
| 🆕 | `help.body` | <p><b style="color:#4df">Управление:</b> WASD — плавать. Пробел = укус. ЛКМ — плыть к курсору.</p><p><b style="color:#8f8">Кто кого ест:</b></p><p>🌱 Зелёные едят свет. 🔵 Мелкие едоки едят зелёных. 🟠 Средние фильтруют бактерий и зелёных. 🟣 Крупные охотники едят зелёных, бактерий и средних — и могут кусать чуть более крупных.</p><p><b style="color:#4df">Камера:</b> F свободная камера, V к клетке. Колесо = зум.</p><p><b style="color:#4df">Деление:</b> Ешь, расти, делись. Q — вручную.</p> | <p><b style="color:#4df">Controls:</b> WASD swim. Space = bite. LMB = swim to cursor.</p><p><b style="color:#8f8">Who eats whom:</b></p><p>🌱 Greens eat light. 🔵 Small eaters eat greens. 🟠 Mid eaters filter bacteria+greens. 🟣 Big hunters eat greens, bacteria and mid-eaters — and can bite slightly larger prey.</p><p><b style="color:#4df">Camera:</b> F free cam, V back to cell. Wheel = zoom.</p><p><b style="color:#4df">Division:</b> Eat, grow, split. Q = manual.</p> | <p><b style="color:#4df">Điều khiển:</b> WASD bơi. Space = cắn. LMB = bơi đến con trỏ.</p><p><b style="color:#8f8">Ai ăn ai:</b></p><p>🌱 Loài xanh ăn ánh sáng. 🔵 Ăn nhỏ ăn loài xanh. 🟠 Ăn vừa lọc vi khuẩn+loài xanh. 🟣 Thợ săn lớn ăn xanh, vi khuẩn và ăn vừa — và cắn được mồi lớn hơn chút.</p><p><b style="color:#4df">Camera:</b> F camera tự do, V về tế bào. Lăn = zoom.</p><p><b style="color:#4df">Phân chia:</b> Ăn, lớn, chia. Q = thủ công.</p> | помощь / ≤200 |
|  | `hud.btn.auto` | АВТО | AUTO | AUTO | HUD кнопка / ≤14 |
|  | `hud.btn.auto.short` | АВТО | AUTO | AUTO | HUD кнопка (короткая) / ≤8 |
|  | `hud.btn.cyst` | СПОРА | SPORE | BÀO TỬ | HUD кнопка / ≤14 |
|  | `hud.btn.cyst.short` | СПОРА | SPORE | BÀO | HUD кнопка (короткая) / ≤8 |
|  | `hud.btn.divide` | ДЕЛИТЬ | DIVIDE | CHIA | HUD кнопка / ≤14 |
|  | `hud.btn.divide.short` | ДЕЛИТЬ | DIVIDE | CHIA | HUD кнопка (короткая) / ≤8 |
|  | `hud.btn.eat` | ЕСТЬ | EAT | ĂN | HUD кнопка / ≤14 |
|  | `hud.btn.eat.short` | ЕСТЬ | EAT | ĂN | HUD кнопка (короткая) / ≤8 |
|  | `hud.btn.light` | СВЕТ | LIGHT | SÁNG | HUD кнопка / ≤14 |
|  | `hud.btn.light.short` | СВЕТ | LIGHT | SÁNG | HUD кнопка (короткая) / ≤8 |
|  | `hud.btn.menu` | Меню | Menu | Menu | HUD кнопка / ≤14 |
|  | `hud.divide.reason.age` | слишком молода | too young | còn non | HUD / ≤40 |
|  | `hud.divide.reason.busy` | идёт деление | dividing | đang chia | HUD / ≤40 |
|  | `hud.divide.reason.cd` | перезарядка {sec} с | cooldown {sec} s | chờ {sec} giây | HUD / ≤40 |
|  | `hud.divide.reason.energy` | энергия {cur}/{need} | energy {cur}/{need} | năng lượng {cur}/{need} | HUD / ≤40 |
|  | `hud.divide.reason.mass` | масса {cur}/{need} | mass {cur}/{need} | khối lượng {cur}/{need} | HUD / ≤40 |
|  | `hud.divide.reason.none` | нет клетки | no cell | không có tế bào | HUD / ≤40 |
|  | `hud.divide.reason.size` | размер {cur}/{need} | size {cur}/{need} | kích thước {cur}/{need} | HUD / ≤40 |
| 🆕 | `hud.genSep` |  · Gen  |  · Gen  |  · Thế hệ  | HUD / ≤40 |
|  | `hud.goal` | Поделись: {cur}/{need} | Divide: {cur}/{need} | Chia: {cur}/{need} | HUD / ≤40 |
| 🆕 | `kh.hide` | Свернуть | Hide keys | Ẩn phím | общий UI / ≤60 |
| 🆕 | `kh.keys` | Клавиши | Keys | Phím | общий UI / ≤60 |
| 🆕 | `lb.title` | 🏆 Таблица лидеров | 🏆 Leaderboard | 🏆 Bảng xếp hạng | общий UI / ≤60 |
| 🆕 | `leg.apex` | Крупные охотники | Apex hunters | Thợ săn đỉnh | общий UI / ≤60 |
| 🆕 | `leg.bacteria` | Бактерии | Bacteria | Vi khuẩn | общий UI / ≤60 |
| 🆕 | `leg.decomp` | Разлагатели | Decomposers | Phân giải | общий UI / ≤60 |
| 🆕 | `leg.large` | Крупные | Large | Lớn | общий UI / ≤60 |
| 🆕 | `leg.producer` | Водоросли | Algae | Tảo | общий UI / ≤60 |
| 🆕 | `leg.virus` | Вирусы | Viruses | Virus | общий UI / ≤60 |
|  | `legend` | Легенда | Legend | Chú thích | общий UI / ≤60 |
|  | `light` | Свет | Light | Ánh sáng | общий UI / ≤60 |
|  | `lightInt` | Инт. света | Light Intensity | Cường độ sáng | общий UI / ≤60 |
|  | `map` | Карта | Map | Bản đồ | общий UI / ≤60 |
|  | `mapChart` | Карта и график | Map and chart | Bản đồ và biểu đồ | общий UI / ≤60 |
|  | `mapTip` | Миникарта — где вы в пруду. Клик = прыжок камеры. | Minimap: where you are in the pond. Click jumps the camera. | Minimap: bạn đang ở đâu trong ao. Bấm để nhảy camera. | общий UI / ≤60 |
|  | `massWord` | Масса | Mass | Khối lượng | общий UI / ≤60 |
|  | `maxPop` | Макс. поп | Max Pop | Số tối đa | общий UI / ≤60 |
|  | `menu` | В МЕНЮ | MENU | MENU | общий UI / ≤60 |
|  | `menuSub` | Симуляция микроорганизмов — 100 видов + вирусы. Разрез водоёма сбоку. | Microorganism Simulation — 100 species + viruses. Pond cross-section view. | Mô phỏng vi sinh — 100 loài + virus. Mặt cắt ao. | общий UI / ≤60 |
| 🆕 | `mic.scope` | МИКРОСКОП × | MICROSCOPE × | KÍNH HIỂN VI × | микроскоп / ≤30 |
|  | `microscope` | Микроскоп | Microscope | Kính hiển vi | общий UI / ≤60 |
|  | `midEaterTip` | Средний едок: подплыви к зелёным/бактериям — реснички фильтруют сами. | Mid eater: swim to greens or bacteria. Cilia filter on their own. | Ăn cỡ trung: bơi tới rêu xanh hoặc vi khuẩn. Lông chuyển tự lọc. | общий UI / ≤60 |
| 🆕 | `mob.eSep` |  · E= |  · E= |  · E= | моб. UI / ≤30 |
| 🆕 | `mob.infected` |  · 🦠 заражён |  · 🦠 infected |  · 🦠 nhiễm | моб. UI / ≤30 |
| 🆕 | `mob.you` |  · ВЫ |  · YOU |  · BẠN | моб. UI / ≤30 |
| 🆕 | `mode.swissLbl` | 📗 SWISS | 📗 SWISS | 📗 SWISS | общий UI / ≤60 |
| 🆕 | `mode.webglLbl` | 🌊 WEBGL | 🌊 WEBGL | 🌊 WEBGL | общий UI / ≤60 |
| 🆕 | `modeBig.cartoon` | 🎨 МУЛЬТЯШНЫЙ | 🎨 CARTOON | 🎨 HOẠT HÌNH | общий UI / ≤60 |
| 🆕 | `modeBig.swiss` | 📗 SWISSBIOPICS | 📗 SWISSBIOPICS | 📗 SWISSBIOPICS | общий UI / ≤60 |
| 🆕 | `modeBig.webgl` | 🌊 WEBGL | 🌊 WEBGL | 🌊 WEBGL | общий UI / ≤60 |
| 🆕 | `modeLbl.cartoon` | 🎨 Мультяшный | 🎨 Cartoon | 🎨 Hoạt hình | общий UI / ≤60 |
| 🆕 | `modeLbl.swiss` | 📗 SwissBioPics | 📗 SwissBioPics | 📗 SwissBioPics | общий UI / ≤60 |
| 🆕 | `modeLbl.webgl` | 🌊 WebGL | 🌊 WebGL | 🌊 WebGL | общий UI / ≤60 |
|  | `next` | Далее | Next | Tiếp | общий UI / ≤60 |
|  | `noSpecies` | Нет видов в категории «{cat}». Нажмите «Все». | No species in "{cat}". Tap All. | Không có loài trong "{cat}". Bấm Tất cả. | общий UI / ≤60 |
|  | `offspring` | Потомков | Offspring | Con | общий UI / ≤60 |
|  | `particles` | Частицы | Particles | Hạt | общий UI / ≤60 |
|  | `paused` | ПАУЗА | PAUSED | TẠM DỪNG | общий UI / ≤60 |
|  | `picMode` | Режим картинки | Picture mode | Chế độ ảnh | общий UI / ≤60 |
|  | `play` | Играть | Play | Chơi | общий UI / ≤60 |
|  | `poolWill` | В бассейне будет: ~{n} организмов · {kinds} видов | Pool will have: ~{n} organisms · {kinds} species | Ao sẽ có: ~{n} sinh vật · {kinds} loài | общий UI / ≤60 |
|  | `pop` | Поп-ция | Pop | Số lượng | общий UI / ≤60 |
|  | `popTip` | График популяции — сколько микробов во времени. | Population chart: how many microbes over time. | Biểu đồ quần thể: số vi sinh theo thời gian. | общий UI / ≤60 |
|  | `predation` | Хищники | Predators | Kẻ săn | общий UI / ≤60 |
|  | `producer` | Зелёные (корм) | Greens (food) | Xanh (thức ăn) | общий UI / ≤60 |
|  | `rainy` | Дождь | Rain | Mưa | общий UI / ≤60 |
|  | `ready` | ГОТОВО | READY | SẴN SÀNG | общий UI / ≤60 |
|  | `restart` | ЗАНОВО | RESTART | CHƠI LẠI | общий UI / ≤60 |
|  | `resume` | ПРОДОЛЖИТЬ | RESUME | TIẾP TỤC | общий UI / ≤60 |
| 🆕 | `role.consumer1` | Мелкие едоки (бактерии). Кусают зелёных. Сами — еда для средних и крупных. | Small eaters (bacteria). Nibble greens. Food for mid and big eaters. | Ăn nhỏ (vi khuẩn). Cắn xanh lá. Là thức ăn cho loại vừa và lớn. | карточка роли / ≤80 |
| 🆕 | `role.consumer2` | Средние едоки (инфузории). Фильтруют воду: затягивают бактерий и зелёных. Не кидаются на гигантов. | Mid eaters (ciliates). Filter water: pull in bacteria and greens. Do not tackle giants. | Ăn vừa (trùng lông). Lọc nước: hút vi khuẩn và xanh lá. Không tấn công kẻ khổng lồ. | карточка роли / ≤80 |
| 🆕 | `role.consumer3` | Крупные охотники. Едят зелёных, бактерий и средних. Могут кусать и тех, кто чуть крупнее — но это рискованно. Без еды живут долго, но голод всё равно опасен. | Big hunters. Eat greens, bacteria and mid-eaters. Can bite slightly larger prey — risky. Live long without food, but hunger still kills. | Thợ săn lớn. Ăn xanh lá, vi khuẩn và loại vừa. Có thể cắn con mồi lớn hơn chút — rủi ro. Sống lâu không cần ăn, nhưng đói vẫn giết. | карточка роли / ≤80 |
| 🆕 | `role.decomposer` | Уборщики. Разлагают мёртвое — не охотятся на живых. | Cleaners. Break down the dead — do not hunt the living. | Dọn dẹp. Phân hủy xác chết — không săn sinh vật sống. | карточка роли / ≤80 |
| 🆕 | `role.macrophage` | Стражи. Атакуют больных и опасных — «иммунитет» пруда. | Guards. Attack sick/dangerous cells — the pond immune system. | Lính canh. Tấn công tế bào bệnh và nguy hiểm — miễn dịch của ao. | карточка роли / ≤80 |
| 🆕 | `role.producer` | Зелёные. Не охотятся. Едят свет и воду — как крошечные растения. Кормят всех остальных. | Greens. No hunting. They eat light and water — tiny plants. Feed everyone else. | Xanh lá. Không săn mồi. Ăn ánh sáng và nước — như cây tí hon. Nuôi tất cả. | карточка роли / ≤80 |
|  | `roleFood` | Еда | Food | Thức ăn | карточка роли / ≤80 |
|  | `roleHint` | Подсказка: еда подсвечена цветным кольцом. Полоска «Запах еды» справа вверху. | Hint: food is marked with a colored ring. The food-scent bar is at the top right. | Gợi ý: thức ăn có vòng màu. Thanh mùi thức ăn ở trên bên phải. | карточка роли / ≤80 |
|  | `roleOk` | Понятно — плыву | Got it — I'll swim | Hiểu rồi — tôi bơi | карточка роли / ≤80 |
|  | `roleWho` | Ты кто / кого ешь | Who you are / what you eat | Bạn là ai / ăn gì | карточка роли / ≤80 |
|  | `season0` | Весна | Spring | Xuân | общий UI / ≤60 |
|  | `season1` | Лето | Summer | Hạ | общий UI / ≤60 |
|  | `season2` | Осень | Autumn | Thu | общий UI / ≤60 |
|  | `season3` | Зима | Winter | Đông | общий UI / ≤60 |
|  | `selectSp` | Выберите организм | Select organism | Chọn sinh vật | общий UI / ≤60 |
|  | `set` | НАСТРОЙКИ | SETTINGS | CÀI ĐẶT | настройки / ≤40 |
|  | `settingsT` | Настройки | Settings | Cài đặt | настройки / ≤40 |
|  | `shadows` | Тени | Shadows | Bóng | общий UI / ≤60 |
|  | `shown` | показано | shown | đang hiện | общий UI / ≤60 |
|  | `simSpeed` | Скорость | Speed | Tốc độ | общий UI / ≤60 |
|  | `skip` | Пропустить | Skip | Bỏ qua | общий UI / ≤60 |
| 🆕 | `sp.1000` | Губка (фильтратор) | Sponge (Filter Feeder) | Bọt biển (Ăn lọc) | имя вида / ≤40 |
| 🆕 | `sp.1001` | Половая эукариота | Sexual Eukaryote | Nhân thực hữu tính | имя вида / ≤40 |
| 🆕 | `sp.999` | Макрофаг (Иммунитет) | Macrophage (Immunity) | Đại thực bào (Miễn dịch) | имя вида / ≤40 |
| 🆕 | `spcard.virus` | Вирус | Virus | Virus | общий UI / ≤60 |
|  | `speciesWord` | видов | species | loài | общий UI / ≤60 |
| 🆕 | `star.alphacentauri` | ★ Альфа Центавра A+B | ★ Alpha Centauri A+B | ★ Alpha Centauri A+B | звезда / ≤40 |
| 🆕 | `star.antares` | ★ Антарес | ★ Antares | ★ Antares | звезда / ≤40 |
| 🆕 | `star.betelgeuse` | ★ Бетельгейзе | ★ Betelgeuse | ★ Betelgeuse | звезда / ≤40 |
| 🆕 | `star.binary` | ★ Двойная (синяя+оранжевая) | ★ Binary (blue+orange) | ★ Sao đôi (xanh+cam) | звезда / ≤40 |
| 🆕 | `star.dwarf` | ★ Красный карлик | ★ Red dwarf | ★ Sao lùn đỏ | звезда / ≤40 |
| 🆕 | `star.flare` | ★ Вспышечная (UV Ceti) | ★ Flare star (UV Ceti) | ★ Sao bùng sáng (UV Ceti) | звезда / ≤40 |
| 🆕 | `star.giant` | ★ Оранжевый гигант | ★ Orange giant | ★ Sao khổng lồ cam | звезда / ≤40 |
| 🆕 | `star.polaris` | ★ Полярная | ★ Polaris | ★ Polaris | звезда / ≤40 |
| 🆕 | `star.pulsar` | ★ Нейтронная (пульсар) | ★ Neutron (pulsar) | ★ Sao neutron (pulsar) | звезда / ≤40 |
| 🆕 | `star.quadruple` | ★★★★ Четверная | ★★★★ Quadruple | ★★★★ Bốn | звезда / ≤40 |
| 🆕 | `star.rigel` | ★ Ригель | ★ Rigel | ★ Rigel | звезда / ≤40 |
| 🆕 | `star.sirius` | ★ Сириус A+B | ★ Sirius A+B | ★ Sirius A+B | звезда / ≤40 |
| 🆕 | `star.sol` | ☀ Солнце | ☀ Sun | ☀ Mặt trời | звезда / ≤40 |
| 🆕 | `star.trinary` | ★★★ Тройная | ★★★ Triple | ★★★ Ba | звезда / ≤40 |
| 🆕 | `star.twin` | ★★ Близнецы | ★★ Twins | ★★ Đôi | звезда / ≤40 |
| 🆕 | `star.vega` | ★ Вега | ★ Vega | ★ Vega | звезда / ≤40 |
| 🆕 | `starg.alphacentauri` | ★ α Центавра | ★ α Centauri | ★ α Centauri | звезда / ≤40 |
| 🆕 | `starg.sirius` | ★ Сириус | ★ Sirius | ★ Sirius | звезда / ≤40 |
|  | `start` | НАЧАТЬ | START | BẮT ĐẦU | общий UI / ≤60 |
|  | `swissNow` | Сейчас: SwissBioPics. Клик → WebGL. | Now: Swiss. Click for WebGL. | Đang: Swiss. Bấm để sang WebGL. | общий UI / ≤60 |
|  | `temp` | Т° | Temp | Nhiệt | общий UI / ≤60 |
| 🆕 | `tip.ageBar` | Возраст существа. Старые клетки теряют энергию быстрее. | Creature age. Old cells lose energy faster. | Tuổi sinh vật. Tế bào già mất năng lượng nhanh hơn. | общий UI / ≤60 |
| 🆕 | `tip.auto` | Авто | Auto | Tự động | общий UI / ≤60 |
| 🆕 | `tip.cartoon` | Мультяшный. Клик → SwissBioPics | Cartoon. Click -> SwissBioPics | Hoạt hình. Click -> SwissBioPics | общий UI / ≤60 |
| 🆕 | `tip.cbFilter` | Фильтр организмов. Нажмите, чтобы показать только этот вид в меню. | Organism filter. Click to show only this species in the menu. | Bộ lọc sinh vật. Click chỉ hiện loài này trong menu. | общий UI / ≤60 |
| 🆕 | `tip.cyst` | Спора | Spore | Bào tử | общий UI / ≤60 |
| 🆕 | `tip.daysL` | Игровые дни. Смена сезонов влияет на температуру. | Game days. Season changes affect temperature. | Ngày chơi. Mùa đổi ảnh hưởng nhiệt độ. | общий UI / ≤60 |
| 🆕 | `tip.divide` | Делить | Split | Chia | общий UI / ≤60 |
| 🆕 | `tip.eat` | Есть | Eat | Ăn | общий UI / ≤60 |
| 🆕 | `tip.energyBar` | Энергия существа. Падает со временем. Если дойдет до нуля — смерть от голода. | Creature energy. Drops over time. At zero — death by starvation. | Năng lượng sinh vật. Giảm theo thời gian. Bằng 0 — chết đói. | общий UI / ≤60 |
| 🆕 | `tip.feed` | Ручное питание | Manual feed | Cho ăn tay | общий UI / ≤60 |
| 🆕 | `tip.fly` | Свободный полёт: F или WASD / мышь | Free flight: F or WASD / mouse | Bay tự do: F hoặc WASD / chuột | общий UI / ≤60 |
| 🆕 | `tip.follow` | Следить | Follow | Theo | общий UI / ≤60 |
| 🆕 | `tip.fpsL` | Кадры в секунду (FPS). Показывает производительность игры. | Frames per second (FPS). Shows game performance. | Khung hình/giây (FPS). Hiệu năng game. | общий UI / ≤60 |
| 🆕 | `tip.lang` | Выбор языка | Language selector | Chọn ngôn ngữ | общий UI / ≤60 |
| 🆕 | `tip.lightL` | Уровень освещенности. Важен для фотосинтеза водорослей. | Light level. Important for algae photosynthesis. | Mức sáng. Quan trọng cho quang hợp của tảo. | общий UI / ≤60 |
| 🆕 | `tip.microMode` | Режим микроскопа | Microscope Mode | Chế độ kính hiển vi | общий UI / ≤60 |
| 🆕 | `tip.pause` | Пауза | Pause | Tạm dừng | общий UI / ≤60 |
| 🆕 | `tip.popC` | График популяции. Показывает историю рождений и смертей. | Population chart. Shows birth and death history. | Biểu đồ quần thể. Lịch sử sinh và chết. | общий UI / ≤60 |
| 🆕 | `tip.render` | Картинка: мульт / Swiss | Picture: cartoon / Swiss | Ảnh: hoạt hình / Swiss | общий UI / ≤60 |
| 🆕 | `tip.starSel` | Выбор звезды/солнца | Select star/sun | Chọn sao/mặt trời | общий UI / ≤60 |
| 🆕 | `tip.swiss` | SwissBioPics. Клик → WebGL | SwissBioPics. Click -> WebGL | SwissBioPics. Click -> WebGL | общий UI / ≤60 |
| 🆕 | `tip.tempL` | Температура воды. Влияет на метаболизм и выживание. | Water temperature. Affects metabolism and survival. | Nhiệt độ nước. Ảnh hưởng trao đổi chất và sống sót. | общий UI / ≤60 |
| 🆕 | `tip.webgl` | WebGL-вода. Клик → мультяшный | WebGL water. Click -> cartoon | Nước WebGL. Click -> hoạt hình | общий UI / ≤60 |
| 🆕 | `tip.wikiB` | Вики/Бестиарий | Wiki/Bestiary | Wiki/Bách khoa | общий UI / ≤60 |
| 🆕 | `tip.zi` | Zoom+ | Zoom+ | Zoom+ | общий UI / ≤60 |
| 🆕 | `tip.zo` | Zoom- | Zoom- | Zoom- | общий UI / ≤60 |
| 🆕 | `toast.auto.eat` | АВТО: съел | AUTO: ate | AUTO: đã ăn | тост / ≤60 |
| 🆕 | `toast.auto.gain` | АВТО: +{e} энергия | AUTO: +{e} energy | AUTO: +{e} năng lượng | тост / ≤60 |
| 🆕 | `toast.bite` | КУСЬ! {name} | BITE! {name} | CẮN! {name} | тост / ≤60 |
| 🆕 | `toast.biteBig` | Откусил кусок — крупная добыча! | Bit off a chunk — big prey! | Cắn đứt miếng — mồi lớn! | тост / ≤60 |
| 🆕 | `toast.biteGain` | Укус +{e} эн / +{m} м | Bite +{e} en / +{m} m | Cắn +{e} nl / +{m} m | тост / ≤60 |
| 🆕 | `toast.cilia.filter` | Реснички: фильтр-питание | Cilia: filter feeding | Lông: ăn lọc | тост / ≤60 |
| 🆕 | `toast.controls` | Управление: WASD / мышь · ЕСТЬ (E) · ДЕЛИТЬ (Q) | Controls: WASD / mouse · EAT (E) · DIVIDE (Q) | Điều khiển: WASD / chuột · ĂN (E) · CHIA (Q) | тост / ≤60 |
|  | `toast.cyst.enter` | Спора: защита, движение 0, энергия тратится медленно | Spore: protected, speed 0, energy drains slowly | Bào tử: được bảo vệ, tốc độ 0, năng lượng tụt chậm | тост / ≤60 |
|  | `toast.cyst.exit` | Вышел из споры | Left the spore | Đã ra khỏi bào tử | тост / ≤60 |
|  | `toast.cyst.hunger` | Голод: впал в цисту — найди еду и проснись | Hunger: encysted — find food and wake | Đói: đã hóa nang — tìm đồ ăn rồi thức | тост / ≤60 |
| 🆕 | `toast.digest` | Пищеварение... ({s}с) | Digesting... ({s}s) | Đang tiêu... ({s}s) | тост / ≤60 |
| 🆕 | `toast.divfail` | Деление: вторая клетка не создалась | Division: second cell failed to form | Phân chia: tế bào thứ hai không tạo được | тост / ≤60 |
|  | `toast.divide.blocked` | Пока нельзя делиться | Cannot divide yet | Chưa chia được | тост / ≤60 |
|  | `toast.divide.go` | Деление | Dividing | Đang chia | тост / ≤60 |
| 🆕 | `toast.divided` | Деление! | Divided! | Đã chia! | тост / ≤60 |
|  | `toast.eat.closer` | Ближе к добыче | Closer to prey | Lại gần mồi hơn | тост / ≤60 |
|  | `toast.eat.none` | Рядом нет добычи — подплыви ближе | No prey nearby — swim closer | Không có mồi gần — bơi lại gần | тост / ≤60 |
| 🆕 | `toast.eat.noneAuto` | Рядом нет добычи — включи АВТО или подплыви | No prey nearby — enable AUTO or swim closer | Không có mồi gần — bật AUTO hoặc bơi gần hơn | тост / ≤60 |
|  | `toast.eat.ok` | Съел | Ate | Đã ăn | тост / ≤60 |
|  | `toast.eat.plant` | Ты растение: плыви к свету | You are a plant: swim toward the light | Bạn là cây: bơi về phía sáng | тост / ≤60 |
| 🆕 | `toast.extinct` | Вид {name} вымер! | Species {name} went extinct! | Loài {name} tuyệt chủng! | тост / ≤60 |
| 🆕 | `toast.filter.catch` | Фильтр: затянул добычу | Filter: pulled in prey | Lọc: hút được mồi | тост / ≤60 |
| 🆕 | `toast.filter.catch2` | Фильтр: захватил добычу | Filter: captured prey | Lọc: bắt được mồi | тост / ≤60 |
| 🆕 | `toast.gain` | +{e} эн / +{m} масса | +{e} en / +{m} mass | +{e} nl / +{m} khối | тост / ≤60 |
| 🆕 | `toast.infected` | Клетка инфицирована! Лизис через 10-20с | Cell infected! Lysis in 10-20s | Tế bào bị nhiễm! Tan trong 10-20s | тост / ≤60 |
|  | `toast.lang.fallback` | Язык не включён, показан английский | Language is off, showing English | Ngôn ngữ tắt, đang hiện tiếng Anh | тост / ≤60 |
| 🆕 | `toast.microOff` | Микроскоп выкл | Microscope off | Kính hiển vi tắt | тост / ≤60 |
| 🆕 | `toast.microOn` | 🔬 Микроскоп: вода остаётся, зум+сетка (не режим N) | 🔬 Microscope: water stays, zoom+grid (not mode N) | 🔬 Kính hiển vi: nước giữ, zoom+lưới (không chế độ N) | тост / ≤60 |
| 🆕 | `toast.noPlayer` | Нет игрока | No player | Không có người chơi | тост / ≤60 |
| 🆕 | `toast.parasite.gone` | Паразит сброшен | Parasite shed | Ký sinh đã rơi | тост / ≤60 |
| 🆕 | `toast.webglFail` | WebGL недоступен — возврат в мультяшный | WebGL unavailable — falling back to cartoon | WebGL không khả dụng — về hoạt hình | тост / ≤60 |
|  | `topOfList` | вверху списка | top of the list | đầu danh sách | общий UI / ≤60 |
| 🆕 | `tut.s1.body` | Вы — микроорганизм в луже. Цель: есть, расти, делиться. Нажмите «Далее». | You are a microbe in a pond. Goal: eat, grow, divide. Tap Next. | Bạn là một vi sinh vật trong ao. Mục tiêu: ăn, lớn, phân chia. Chạm Tiếp. | обучение / ≤200 |
| 🆕 | `tut.s1.title` | Добро пожаловать | Welcome | Chào mừng | обучение / ≤200 |
| 🆕 | `tut.s2.body` | WASD — плыть. Мышь задаёт направление. Попробуйте сдвинуться, затем «Далее». | WASD to swim. The mouse sets direction. Move, then tap Next. | WASD để bơi. Chuột đặt hướng. Di chuyển, rồi chạm Tiếp. | обучение / ≤200 |
| 🆕 | `tut.s2.title` | Движение | Movement | Di chuyển | обучение / ≤200 |
| 🆕 | `tut.s3.body` | Подойдите к меньшей клетке и нажмите ЕСТЬ (E). Должны появиться вспышка и «+энергия». | Swim to a smaller cell and press EAT (E). You should see a flash. | Bơi tới tế bào nhỏ hơn và nhấn ĂN (E). Sẽ có tia sáng lóe lên. | обучение / ≤200 |
| 🆕 | `tut.s3.title` | Питание | Eating | Ăn | обучение / ≤200 |
| 🆕 | `tut.s4.body` | При полной энергии нажмите ДЕЛИТЬ (Q). Клетка станет заметно меньше — это нормально. | When energy is full, press SPLIT (Q). The cell gets smaller. That is normal. | Khi đầy năng lượng, nhấn CHIA (Q). Tế bào nhỏ lại — bình thường. | обучение / ≤200 |
| 🆕 | `tut.s4.title` | Деление | Division | Phân chia | обучение / ≤200 |
| 🆕 | `tut.s5.body` | Камера: СЛЕДИТЬ / ПОЛЁТ. Картинка: МУЛЬТЯШНЫЙ или SWISS. Удачи в эволюции! | Camera: follow or free flight. Good luck evolving! | Camera: theo sau hoặc bay tự do. Chúc tiến hóa tốt! | обучение / ≤200 |
| 🆕 | `tut.s5.title` | Готово | Done | Xong | обучение / ≤200 |
|  | `tutDone` | Туториал пройден | Tutorial done | Hướng dẫn xong | общий UI / ≤60 |
|  | `vignette` | Виньетка | Vignette | Viền tối | общий UI / ≤60 |
|  | `virus` | Вирусы | Viruses | Virus | общий UI / ≤60 |
|  | `virusMode` | Режим вируса: {name}. Кликни по бактерии = инфицировать. WASD = камера. | Virus mode: {name}. Click a bacterium to infect. WASD moves the camera. | Chế độ virus: {name}. Bấm vi khuẩn để lây nhiễm. WASD di chuyển camera. | общий UI / ≤60 |
|  | `virusRate` | Частота вирусов | Virus Rate | Tỷ lệ virus | общий UI / ≤60 |
|  | `webglNow` | Сейчас: WebGL-вода. Клик → мультяшный. | Now: WebGL water. Click for cartoon. | Đang: nước WebGL. Bấm để sang hoạt hình. | общий UI / ≤60 |
| 🆕 | `wgl.diff1` | Фон воды рисует WebGL-шейдер (рябь, каустика, блик) | Water background drawn by WebGL shader (ripples, caustics, glints) | Nền nước vẽ bằng shader WebGL (gợn, quang lộ, lấp lánh) | общий UI / ≤60 |
| 🆕 | `wgl.diff2` | Основной canvas прозрачный поверх GL | Main canvas transparent over GL | Canvas chính trong suốt trên GL | общий UI / ≤60 |
| 🆕 | `wgl.same1` | Мир и организмы на Canvas 2D | World and organisms on Canvas 2D | Thế giới và sinh vật trên Canvas 2D | общий UI / ≤60 |
| 🆕 | `wgl.same2` | Управление/еда/движение без смены симуляции | Controls/food/movement without simulation change | Điều khiển/thức ăn/di chuyển không đổi mô phỏng | общий UI / ≤60 |
|  | `wiki` | ВИКИ | WIKI | WIKI | общий UI / ≤60 |
| 🆕 | `wiki.def.shell` | Кремниевый панцирь | Silica shell | Vỏ silic | вики / ≤300 |
| 🆕 | `wiki.def.spikes` | Шипы | Spikes | Gai | вики / ≤300 |
| 🆕 | `wiki.def.toxic` | Токсичность | Toxicity | Độc tính | вики / ≤300 |
| 🆕 | `wiki.def.venom` | Яд | Venom | Nọc độc | вики / ≤300 |
| 🆕 | `wiki.defs` | Особенности: | Features: | Đặc điểm: | вики / ≤300 |
| 🆕 | `wiki.div.binary` | Деление надвое | Binary fission | Phân đôi | вики / ≤300 |
| 🆕 | `wiki.div.budding` | Почкование | Budding | Nảy chồi | вики / ≤300 |
| 🆕 | `wiki.searchPh` | Поиск… | Search... | Tìm... | вики / ≤300 |
|  | `wikiT` | Вики: жители лужи | Wiki: Pond Life | Wiki: đời sống ao | общий UI / ≤60 |
| 🆕 | `x.a` | Взр | A | Tuổi | метки/подписи / ≤60 |
| 🆕 | `x.alive` | Живых | Alive | Sống | метки/подписи / ≤60 |
| 🆕 | `x.bacteriophageInfectsBacteriaCauses` | Бактериофаг. Заражает бактерии, вызывает лизис. | Bacteriophage. Infects bacteria, causes lysis. | Thực khuẩn thể. Nhiễm vi khuẩn, gây tan. | метки/подписи / ≤60 |
| 🆕 | `x.born` | Родилось | Born | Sinh ra | метки/подписи / ≤60 |
| 🆕 | `x.chloroplasts` | хлоропласты | chloroplasts | lục lạp | метки/подписи / ≤60 |
| 🆕 | `x.cilia` | реснички | cilia | lông chuyển | метки/подписи / ≤60 |
| 🆕 | `x.contractileVacuole` | сокр. вакуоль | contractile vacuole | không bào co bóp | метки/подписи / ≤60 |
| 🆕 | `x.cover` |  · укрытие |  · cover |  · che chở | метки/подписи / ≤60 |
| 🆕 | `x.currentlyAlive` | Сейчас живы | Currently alive | Đang sống | метки/подписи / ≤60 |
| 🆕 | `x.cyst` | Циста | Cyst | Nang | метки/подписи / ≤60 |
| 🆕 | `x.cyst2` |  · ЦИСТА |  · CYST |  · NANG | метки/подписи / ≤60 |
| 🆕 | `x.dead` | Погибло | Dead | Chết | метки/подписи / ≤60 |
| 🆕 | `x.dividing` | Делится | Dividing | Đang chia | метки/подписи / ≤60 |
| 🆕 | `x.division` | Деление | Division | Phân chia | метки/подписи / ≤60 |
| 🆕 | `x.e` | Эн | E | NL | метки/подписи / ≤60 |
| 🆕 | `x.flagella` | жгутик | flagella | roi | метки/подписи / ≤60 |
| 🆕 | `x.food` | Пища | Food | Thức ăn | метки/подписи / ≤60 |
| 🆕 | `x.foodScent` | Запах еды | Food scent | Mùi thức ăn | метки/подписи / ≤60 |
| 🆕 | `x.golgi` | гольджи | Golgi | Golgi | метки/подписи / ≤60 |
| 🆕 | `x.healthy` | Здоров | Healthy | Khỏe | метки/подписи / ≤60 |
| 🆕 | `x.infected` | Заражен | Infected | Nhiễm | метки/подписи / ≤60 |
| 🆕 | `x.infected2` | Заражен! | Infected! | Nhiễm! | метки/подписи / ≤60 |
| 🆕 | `x.infected3` | Инфицировано | Infected | Bị nhiễm | метки/подписи / ≤60 |
| 🆕 | `x.locomotion` | Движение | Locomotion | Di chuyển | метки/подписи / ≤60 |
| 🆕 | `x.lysed` | Лизировано | Lysed | Bị tan | метки/подписи / ≤60 |
| 🆕 | `x.macroMicronucleus` | макро/микронуклеус | macro/micronucleus | đại/vi nhân | метки/подписи / ≤60 |
| 🆕 | `x.mitochondria` | митохондрии | mitochondria | ty thể | метки/подписи / ≤60 |
| 🆕 | `x.move` | Движение | Move | Di chuyển | метки/подписи / ≤60 |
| 🆕 | `x.nothingFound` | Ничего не найдено. | Nothing found. | Không tìm thấy. | метки/подписи / ≤60 |
| 🆕 | `x.nucleus` | ядро | nucleus | nhân | метки/подписи / ≤60 |
| 🆕 | `x.organelles` | Органеллы | Organelles | Bào quan | метки/подписи / ≤60 |
| 🆕 | `x.phages` | Фагов | Phages | Thực khuẩn | метки/подписи / ≤60 |
| 🆕 | `x.pondStatistics` | Статистика Водоёма | Pond Statistics | Thống kê ao | метки/подписи / ≤60 |
| 🆕 | `x.predators` | Враги | Predators | Thú săn | метки/подписи / ≤60 |
| 🆕 | `x.pseudopodia` | псевдоподии | pseudopodia | chân giả | метки/подписи / ≤60 |
| 🆕 | `x.s` | Рзм | S | CC | метки/подписи / ≤60 |
| 🆕 | `x.scaleBar` | Масштаб: 100 мкм | Scale: 100 µm | Tỉ lệ: 100 µm | метки/подписи / ≤60 |
| 🆕 | `x.size` | Размер | Size | Kích thước | метки/подписи / ≤60 |
| 🆕 | `x.starving` | Голод | Starving | Đói | метки/подписи / ≤60 |
| 🆕 | `x.totalBorn` | Всего родилось | Total born | Tổng sinh | метки/подписи / ≤60 |
| 🆕 | `x.trichocysts` | трихоцисты | trichocysts | lông tơ | метки/подписи / ≤60 |
| 🆕 | `x.virusMode` | РЕЖИМ ВИРУСА | VIRUS MODE | CHẾ ĐỘ VIRUS | метки/подписи / ≤60 |
| 🆕 | `x.wasdSwimLmbCursorRmbTargetWheel` | <span><kbd>WASD</kbd> Плыть</span><span><kbd>ЛКМ</kbd> Курсор</span><span><kbd>ПКМ</kbd> Цель</span><span><kbd>Колесо</kbd> Зум</span><span class="kh-sum">Кнопки: E Q R Space Tab F M N V B P</span> | <span><kbd>WASD</kbd> Swim</span><span><kbd>LMB</kbd> Cursor</span><span><kbd>RMB</kbd> Target</span><span><kbd>Wheel</kbd> Zoom</span><span class="kh-sum">Buttons: E Q R Space Tab F M N V B P</span> | <span><kbd>WASD</kbd> Bơi</span><span><kbd>Chuột trái</kbd> Con trỏ</span><span><kbd>Chuột phải</kbd> Mục tiêu</span><span><kbd>Lăn</kbd> Zoom</span><span class="kh-sum">Phím: E Q R Space Tab F M N V B P</span> | метки/подписи / ≤60 |
| 🆕 | `x.wasdSwimLmbCursorRmbTargetWheel2` | <span><kbd>WASD</kbd> Плыть</span><span><kbd>ЛКМ</kbd> Курсор</span><span><kbd>ПКМ</kbd> Цель</span><span><kbd>Колесо</kbd> Зум</span><span class="kh-sum">Кнопки: E Q R Space Tab F M N V B P</span> | <span><kbd>WASD</kbd> Swim</span><span><kbd>LMB</kbd> Cursor</span><span><kbd>RMB</kbd> Target</span><span><kbd>Wheel</kbd> Zoom</span><span class="kh-sum">Buttons: E Q R Space Tab F M N V B P</span> | <span><kbd>WASD</kbd> Bơi</span><span><kbd>Chuột trái</kbd> Con trỏ</span><span><kbd>Chuột phải</kbd> Mục tiêu</span><span><kbd>Lăn</kbd> Zoom</span><span class="kh-sum">Phím: E Q R Space Tab F M N V B P</span> | метки/подписи / ≤60 |
| 🆕 | `x.wind` | Ветер | Wind | Gió | метки/подписи / ≤60 |
| 🆕 | `x.you` | Это Вы | You | Bạn | метки/подписи / ≤60 |
| 🆕 | `x.yourCell` | Ваша клетка | Your cell | Tế bào của bạn | метки/подписи / ≤60 |
| 🆕 | `x.yourSpecies` | Ваш вид:  | Your species:  | Loài của bạn:  | метки/подписи / ≤60 |
| 🆕 | `loc.drift` | дрейф | drift | trôi | вики «Движение» / ≤18 |
| 🆕 | `loc.glide` | скольжение | glide | trượt | вики «Движение» / ≤18 |
| 🆕 | `loc.flagella` | жгутики | flagella | roi | вики «Движение» / ≤18 |
| 🆕 | `loc.cilia` | реснички | cilia | lông bơi | вики «Движение» / ≤18 |
| 🆕 | `loc.ciliaStalk` | реснички на стебельке | cilia on stalk | lông bơi trên cuống | вики «Движение» / ≤18 |
| 🆕 | `loc.pseudopodia` | псевдоподии | pseudopodia | chân giả | вики «Движение» / ≤18 |
| 🆕 | `loc.sessile` | прикреплённый | sessile | bám cố định | вики «Движение» / ≤18 |
| 🆕 | `loc.budding` | почкование | budding | nảy chồi | вики «Движение» / ≤18 |
| 🆕 | `loc.growth` | рост | growth | sinh trưởng | вики «Движение» / ≤18 |

## Вики — тела видов (108)

| id | en | vi |
|---|---|---|
| `0` | Synechocystis is a cyanobacterium with no nucleus. It lives on light: oxygenic photosynthesis on membranes, no chloroplasts. Lab model for hydrogen metabolism. | Synechocystis là một vi khuẩn lam không có nhân. Nó sống nhờ ánh sáng: quang hợp thải oxy trên màng, không có lục lạp. Mô hình phòng thí nghiệm cho chuyển hóa hydro. |
| `1` | Anabaena variabilis is a filament. Some cells become heterocysts and fix nitrogen while neighbours make sugar. In the pond it supplies bound nitrogen. | Anabaena variabilis là một sợi tế bào. Một số tế bào trở thành tế bào dị hình (heterocyst) và cố định nitơ trong khi các tế bào lân cận tạo đường. Trong ao nó cung cấp nitơ đã liên kết. |
| `2` | Spirulina (Arthrospira) is a coil of cells with gas vesicles. It hangs near the surface, photosynthesizes, and is edible. In-game it is a large green screw at the water film. | Spirulina (Arthrospira) là một chuỗi tế bào xoắn có túi khí. Nó lơ lửng gần mặt nước, quang hợp và ăn được. Trong game nó là một trục vít xanh lớn ở màng nước. |
| `3` | Nostoc punctiforme is a bead chain in a slime capsule. It lives free or in plant symbiosis. The colony looks like a clump of green beads. | Nostoc punctiforme là chuỗi hạt trong vỏ nhầy. Nó sống tự do hoặc cộng sinh với thực vật. Quần thể trông như cụm hạt xanh. |
| `4` | Oscillatoria limnetica is a gliding filament. It oscillates side to side and can photosynthesize without releasing oxygen. Typical of silt and surface film. | Oscillatoria limnetica là sợi trượt. Nó dao động qua lại và có thể quang hợp mà không thải oxy. Điển hình ở bùn và màng mặt nước. |
| `5` | Microcystis aeruginosa is a mucilage colony, often toxic (microcystin). It causes water bloom. In-game it is a green colony ball, risky prey. | Microcystis aeruginosa là quần thể trong chất nhầy, thường độc (microcystin). Nó gây nở hoa nước. Trong game nó là quả cầu quần thể xanh, con mồi rủi ro. |
| `6` | Gloeocapsa is paired cells in colored sheaths. It lives on rocks and soil and tolerates UV. In the pond it is small paired cocci in a coat. | Gloeocapsa là các cặp tế bào trong vỏ có màu. Nó sống trên đá và đất, chịu được tia UV. Trong ao nó là các cầu khuẩn đôi nhỏ trong lớp bọc. |
| `7` | Lyngbya majuscula is a thick cyanobacterial filament. It can release irritating toxins. It forms mats near warm shores. | Lyngbya majuscula là sợi vi khuẩn lam dày. Nó có thể thải độc tố gây kích ứng. Nó tạo thành thảm gần bờ ấm. |
| `8` | Chlamydomonas reinhardtii is a green cell with two flagella and an eyespot. It swims toward light. Classic algal genetics model. | Chlamydomonas reinhardtii là tế bào xanh có hai roi và một điểm mắt. Nó bơi về phía ánh sáng. Mô hình di truyền học tảo kinh điển. |
| `9` | Chlorella vulgaris is a non-motile green ball. It divides fast and is protein-rich. Food for small eaters and a space-food subject. | Chlorella vulgaris là quả cầu xanh không di động. Nó phân chia nhanh và giàu protein. Thức ăn cho các loài ăn nhỏ và đối tượng thực phẩm vũ trụ. |
| `10` | Volvox globator is a hollow sphere of thousands of cells. Daughter colonies ripen inside and exit. In-game it is a large green colony. | Volvox globator là quả cầu rỗng gồm hàng nghìn tế bào. Quần thể con chín bên trong rồi thoát ra. Trong game nó là quần thể xanh lớn. |
| `11` | Euglena gracilis is a mixotroph: chloroplasts plus the ability to eat. A red eyespot tracks light. Green by day; in the dark it switches to food. | Euglena gracilis là sinh vật dưỡng hỗn hợp: có lục lạp cộng khả năng ăn. Điểm mắt đỏ bắt ánh sáng. Ban ngày xanh; trong bóng tối nó chuyển sang ăn. |
| `12` | Scenedesmus quadricauda is usually four cells in a row with end spines. Spines make swallowing harder. It does not swim — it drifts. | Scenedesmus quadricauda thường gồm bốn tế bào xếp hàng với gai ở hai đầu. Gai khiến khó nuốt. Nó không bơi — nó trôi. |
| `13` | Haematococcus pluvialis is a green motile cell; under stress it turns red (astaxanthin) and grows a thick wall. Red cysts survive drought. | Haematococcus pluvialis là tế bào xanh di động; khi bị stress nó chuyển đỏ (astaxanthin) và mọc thành dày. Nang đỏ sống sót qua hạn hán. |
| `14` | Dunaliella salina has no rigid wall and lives in very salty water. It stores beta-carotene and looks orange. Two flagella. | Dunaliella salina không có thành cứng và sống trong nước rất mặn. Nó tích trữ beta-caroten và trông màu cam. Hai roi. |
| `15` | Micrasterias rotata is a flat star desmid. Two mirrored halves with deep cuts. Non-motile; photosynthesizes in acidic bog water. | Micrasterias rotata là tảo song tinh hình sao dẹt. Hai nửa đối xứng gương với khía sâu. Không di động; quang hợp trong nước đầm lầy axit. |
| `16` | Navicula is a boat-shaped diatom with a silica valve. It glides on the substrate along a raphe slit. The shell remains after death. | Navicula là tảo cát hình thuyền với van silic. Nó trượt trên nền dọc theo khe raphe. Vỏ còn lại sau khi chết. |
| `17` | Pinnularia viridis is a large pennate diatom. Silica shell with a symmetric pattern. It glides slowly on the bottom. | Pinnularia viridis là tảo cát lông chim lớn. Vỏ silic với hoa văn đối xứng. Nó trượt chậm trên đáy. |
| `18` | Cyclotella meneghiniana is a circular centric diatom. It floats as a disc; the shell is two lids. Typical plankton. | Cyclotella meneghiniana là tảo cát trung tâm hình tròn. Nó trôi như đĩa; vỏ gồm hai nắp. Sinh vật phù du điển hình. |
| `19` | Diatoma vulgare is a diatom that sticks into a zigzag. The colony increases drag in the water column. | Diatoma vulgare là tảo cát dính thành hình zíc-zắc. Quần thể làm tăng lực cản trong cột nước. |
| `20` | Rhodospirillum rubrum is a purple spiral. Anoxygenic photosynthesis plus organics. Red color comes from bacteriochlorophyll. | Rhodospirillum rubrum là vi khuẩn xoắn tím. Quang hợp không thải oxy cộng chất hữu cơ. Màu đỏ đến từ bacteriochlorophyll. |
| `21` | Chromatium vinosum is a purple sulfur bacterium. It oxidizes hydrogen sulfide and stores sulfur granules. Lives at the oxygen/sulfur boundary. | Chromatium vinosum là vi khuẩn lưu huỳnh tím. Nó oxy hóa hydro sulfua và tích trữ hạt lưu huỳnh. Sống ở ranh giới oxy/lưu huỳnh. |
| `22` | Porphyridium cruentum is a unicellular red alga. Phycoerythrin gives a blood-red color. Mucilage coat, no flagella. | Porphyridium cruentum là tảo đỏ đơn bào. Phycoerythrin cho màu đỏ máu. Vỏ nhầy, không roi. |
| `23` | Prochlorococcus marinus is the smallest and most abundant photosynthetic cell on Earth. Discovered in the 1980s. It feeds the ocean. | Prochlorococcus marinus là tế bào quang hợp nhỏ nhất và phong phú nhất trên Trái Đất. Được phát hiện những năm 1980. Nó nuôi đại dương. |
| `24` | Chroococcidiopsis thermalis is an extremophile: desert, rock, radiation. A candidate for life beyond Earth. In the pond it is a slow coccus colony. | Chroococcidiopsis thermalis là sinh vật cực đoan: sa mạc, đá, bức xạ. Ứng viên cho sự sống ngoài Trái Đất. Trong ao nó là quần thể cầu khuẩn chậm. |
| `25` | Bdellovibrio bacteriovorus is a tiny bacterial predator. It screws into another cell and multiplies until the host bursts. | Bdellovibrio bacteriovorus là kẻ săn mồi vi khuẩn tí hon. Nó vặn vào tế bào khác và nhân lên cho đến khi vật chủ vỡ. |
| `26` | Vampirococcus sits on prey from the outside and sucks out the contents without entering. A bacterial vampire. | Vampirococcus bám lên con mồi từ bên ngoài và hút chất bên trong mà không chui vào. Ma cà rồng của giới vi khuẩn. |
| `27` | Daptobacter enters a prey bacterium and eats it from inside. A rare intracellular hunter. | Daptobacter chui vào vi khuẩn con mồi và ăn nó từ bên trong. Thợ săn nội bào hiếm gặp. |
| `28` | Myxococcus xanthus is a social bacterium. In a pack it surrounds prey and releases enzymes. When starved it forms a fruiting body. | Myxococcus xanthus là vi khuẩn sống tập thể. Theo bầy nó bao vây con mồi và thải enzyme. Khi đói nó tạo thể quả. |
| `29` | Bacteriovorax stolpii is a marine Bdellovibrio relative. It attacks Gram-negatives and lives in the prey periplasm. | Bacteriovorax stolpii là họ hàng biển của Bdellovibrio. Nó tấn công vi khuẩn Gram-âm và sống trong periplasm của con mồi. |
| `30` | Halobacteriovorax is a salt-tolerant bacterial hunter. Same trick: puncture the wall and grow inside. | Halobacteriovorax là thợ săn vi khuẩn chịu mặn. Cùng trò: đâm thủng thành và lớn bên trong. |
| `31` | Peredibacter starrii is another BALO predator. A fast comma-shaped flagellate targeting large rods. | Peredibacter starrii là một thợ săn BALO khác. Trùng roi hình dấu phẩy rất nhanh, nhắm vào các trực khuẩn lớn. |
| `32` | Monas guttula is a small heterotrophic flagellate. It grabs bacteria at the detritus surface. | Monas guttula là trùng roi dị dưỡng nhỏ. Nó bắt vi khuẩn ở bề mặt mùn bã. |
| `33` | Oikomonas termo is a drop-shaped flagellate. One flagellum; it hunts in bacterial film. | Oikomonas termo là trùng roi hình giọt. Một roi; nó săn trong màng vi khuẩn. |
| `34` | Anthophysa vegetans is a colony on an iron-manganese stalk. Cells sit in a tuft and catch bacteria. | Anthophysa vegetans là quần thể trên cuống sắt-mangan. Các tế bào ngồi thành chùm và bắt vi khuẩn. |
| `35` | Chilomonas paramecium is a colorless cryptophyte. Two flagella; it eats dissolved organics and tiny bacteria, no chloroplasts. | Chilomonas paramecium là trùng cryptophyte không màu. Hai roi; nó ăn chất hữu cơ hòa tan và vi khuẩn nhỏ, không có lục lạp. |
| `36` | Cercomonas longicauda is an amoeboflagellate with a long tail. It crawls and swallows bacteria with pseudopodia. | Cercomonas longicauda là trùng vừa amip vừa roi có đuôi dài. Nó bò và nuốt vi khuẩn bằng chân giả. |
| `37` | Heteromita globosa is a soil flagellate. Two flagella of different length; a main bacterial eater in soil. | Heteromita globosa là trùng roi đất. Hai roi dài khác nhau; kẻ ăn vi khuẩn chính trong đất. |
| `38` | Bodo saltans is a kinetoplastid. It 'dances' in place, attached by the rear flagellum, and snatches bacteria. | Bodo saltans là trùng kinetoplastid. Nó 'nhảy' tại chỗ, bám bằng roi sau, và vồ vi khuẩn. |
| `39` | Procryptobia sorokini is a Bodo relative. It swims freely and strikes prey with the anterior flagellum. | Procryptobia sorokini là họ hàng của Bodo. Nó bơi tự do và đánh con mồi bằng roi trước. |
| `40` | Trypanosoma brucei is a blood parasite causing sleeping sickness. Undulating membrane and one flagellum. In the pond it is a slim-hunter model. | Trypanosoma brucei là ký sinh trùng máu gây bệnh ngủ. Màng sóng và một roi. Trong ao nó là mô hình thợ săn thon dài. |
| `41` | Leishmania donovani is an intracellular human parasite. Flagellated in the insect, aflagellate inside a macrophage. | Leishmania donovani là ký sinh trùng nội bào của người. Có roi trong côn trùng, không roi trong đại thực bào. |
| `42` | Monosiga brevicollis is a choanoflagellate, an animal relative. A microvilli collar filters bacteria. | Monosiga brevicollis là trùng roi cổ (choanoflagellate), họ hàng của động vật. Vòng cổ lông mao lọc vi khuẩn. |
| `43` | Salpingoeca rosetta is a sessile choanoflagellate in a lorica. It can form a rosette. It filters a water current. | Salpingoeca rosetta là trùng roi cổ bám dính trong vỏ lorica. Nó có thể tạo hình hoa hồng. Nó lọc dòng nước. |
| `44` | Codonosiga botrytis is a choanoflagellate colony on a shared stalk. Several filters on one stem. | Codonosiga botrytis là quần thể trùng roi cổ trên cuống chung. Nhiều bộ lọc trên một thân. |
| `45` | Paramecium caudatum is the classic slipper. Thousands of cilia, an oral groove, contractile vacuoles. It filters bacteria. | Paramecium caudatum là trùng dép kinh điển. Hàng nghìn lông chuyển, rãnh miệng, không bào co. Nó lọc vi khuẩn. |
| `46` | Paramecium bursaria is a slipper with zoochlorella symbionts. Green inside: sugar from algae by day, filtering at night. | Paramecium bursaria là trùng dép có cộng sinh zoochlorella. Xanh bên trong: đường từ tảo ban ngày, lọc ban đêm. |
| `47` | Stentor coeruleus is a blue trumpet up to a millimetre. It flares into a funnel and drives a current with cilia. It can swim or sit. | Stentor coeruleus là cái loa xanh dài tới một milimet. Nó mở thành phễu và đẩy dòng nước bằng lông chuyển. Nó có thể bơi hoặc ngồi. |
| `48` | Stentor polymorphus is a relative of the blue stentor, often with zoochlorellae. Shape shifts from trumpet to ball. | Stentor polymorphus là họ hàng của stentor xanh, thường có zoochlorella. Hình dạng đổi từ loa sang cầu. |
| `49` | Vorticella campanula is a bell on a contractile stalk. The stalk coils into a spiral instantly. The cell itself does not swim away. | Vorticella campanula là cái chuông trên cuống co. Cuống xoắn thành lò xo tức thì. Bản thân tế bào không bơi đi. |
| `50` | Vorticella microstoma is a small bell. Same spring-stalk, a narrower oral field. Often on detritus. | Vorticella microstoma là chuông nhỏ. Cùng cuống lò xo, vùng miệng hẹp hơn. Thường trên mùn bã. |
| `51` | Didinium nasutum is a barrel hunter of slippers. It fires toxicysts and swallows prey whole, even if the prey is larger. | Didinium nasutum là thợ săn hình thùng chuyên săn trùng dép. Nó bắn toxicyst và nuốt con mồi nguyên con, kể cả khi con mồi lớn hơn. |
| `52` | Spirostomum ambiguum is a very long cigar. It contracts several-fold in a fraction of a second. Cilia run in a spiral. | Spirostomum ambiguum là điếu xì gà rất dài. Nó co lại vài lần trong phần nhỏ giây. Lông chuyển chạy xoắn. |
| `53` | Blepharisma americanum is a pink ciliate. Blepharismin pigment is light-sensitive. It filters and can attack smaller cells. | Blepharisma americanum là trùng lông hồng. Sắc tố blepharismin nhạy sáng. Nó lọc và có thể tấn công tế bào nhỏ hơn. |
| `54` | Euplotes patella walks on cirri as if on legs. Flat, quick turns. It scrapes bacteria off surfaces. | Euplotes patella đi trên cirri như trên chân. Dẹt, rẽ nhanh. Nó cạo vi khuẩn khỏi bề mặt. |
| `55` | Stylonychia pustulata is a hypotrich that 'runs' on the bottom. Large cirri, a clear mouth. Predator of small ciliates. | Stylonychia pustulata là trùng lông bụng 'chạy' trên đáy. Cirri lớn, miệng rõ. Thợ săn trùng lông nhỏ. |
| `56` | Oxytricha trifallax is a genome model: two nuclei and complex DNA rewriting. It walks on cirri and eats bacteria and small protists. | Oxytricha trifallax là mô hình bộ gen: hai nhân và tái viết DNA phức tạp. Nó đi trên cirri và ăn vi khuẩn cùng động vật nguyên sinh nhỏ. |
| `57` | Tetrahymena thermophila is a lab ciliate. Four oral membranelles, fast division. Model for telomeres and cilia. | Tetrahymena thermophila là trùng lông phòng thí nghiệm. Bốn màng miệng, phân chia nhanh. Mô hình cho telomere và lông chuyển. |
| `58` | Coleps hirtus is a barrel in calcareous plates with spines. Scavenger and predator: it bites into the wounded. | Coleps hirtus là thùng trong tấm vôi có gai. Ăn xác chết và săn mồi: nó cắn vào kẻ bị thương. |
| `59` | Litonotus lamella is a flat predator with toxicysts in a 'proboscis'. It paralyzes prey and sucks it out. | Litonotus lamella là thợ săn dẹt với toxicyst trong 'vòi'. Nó làm tê liệt con mồi rồi hút cạn. |
| `60` | Dileptus anser has a long neck with venomous extrusomes. It strikes with the neck, then swallows. A large mid-tier hunter. | Dileptus anser có cổ dài với extrusome độc. Nó đánh bằng cổ rồi nuốt. Thợ săn lớn tầng giữa. |
| `61` | Urocentrum turbo is a spinning top: an equatorial ciliary belt spins the cell in place. It filters bacteria. | Urocentrum turbo là cái con quay: vành đai lông chuyển xích đạo quay tế bào tại chỗ. Nó lọc vi khuẩn. |
| `62` | Zoothamnium arbuscula is a branched colony of bells. A shared contractile stalk jerks the whole tree at once. | Zoothamnium arbuscula là quần thể chuông phân nhánh. Cuống co chung giật cả cây cùng lúc. |
| `63` | Opercularia coarctata is a sessile peritrich without a spring stalk. A lid covers the mouth. It filters and does not swim away. | Opercularia coarctata là trùng lông quanh miệng bám dính không có cuống lò xo. Nắp che miệng. Nó lọc và không bơi đi. |
| `64` | Amoeba proteus is the classic amoeba. Pseudopodia flow around prey. No fixed shape, no cilia. | Amoeba proteus là amip kinh điển. Chân giả bao quanh con mồi. Không hình dạng cố định, không lông. |
| `65` | Arcella vulgaris is a testate amoeba with a rigid dome. Pseudopodia emerge from the aperture. It crawls on plants. | Arcella vulgaris là amip có vỏ với mái vòm cứng. Chân giả thò ra từ lỗ. Nó bò trên thực vật. |
| `66` | Difflugia oblonga has a shell of sand grains the amoeba glues itself. It lives in silt. | Difflugia oblonga có vỏ từ hạt cát mà amip tự dán. Nó sống trong bùn. |
| `67` | Euglypha alveolata has a shell of silica scales. Thin filose pseudopodia. A small bacterial predator. | Euglypha alveolata có vỏ từ vảy silic. Chân giả hình sợi mảnh. Thợ săn vi khuẩn nhỏ. |
| `68` | Nebela collaris is a bottle-shaped shell built from stolen scales. Forest and bog waters. | Nebela collaris là vỏ hình chai xây từ vảy ăn cắp. Vùng nước rừng và đầm lầy. |
| `69` | Centropyxis aculeata is a disc shell with spines. The aperture is offset. It crawls on detritus. | Centropyxis aculeata là vỏ hình đĩa có gai. Lỗ lệch sang một bên. Nó bò trên mùn bã. |
| `70` | Actinophrys sol is a heliozoan: thin axopodia radiate all around. Prey sticks to the rays and is pulled in. | Actinophrys sol là trùng mặt trời: axopodia mảnh tỏa ra mọi hướng. Con mồi dính vào tia và bị kéo vào. |
| `71` | Actinosphaerium eichhorni is a large multinucleate heliozoan. Same rays, much bigger cell. It eats ciliates and rotifers. | Actinosphaerium eichhorni là trùng mặt trời đa nhân lớn. Cùng tia, tế bào lớn hơn nhiều. Nó ăn trùng lông và luân trùng. |
| `72` | Raphidiophrys pallida is a heliozoan in scales. Rays carry silica needles. An ambush plankton hunter. | Raphidiophrys pallida là trùng mặt trời có vảy. Tia mang kim silic. Thợ săn phục kích của phù du. |
| `73` | Rotaria rotatoria is a rotifer that can survive drying. A corona wheels food into the mouth. A true multicellular animal. | Rotaria rotatoria là luân trùng có thể sống sót khi khô. Vành đai xe đẩy thức ăn vào miệng. Động vật đa bào thật sự. |
| `74` | Philodina roseola is a pink bdelloid rotifer. It crawls like a leech and also swims. Females only; no males. | Philodina roseola là luân trùng bdelloid hồng. Nó bò như đỉa và cũng bơi được. Chỉ có con cái; không con đực. |
| `75` | Brachionus plicatilis is a planktonic loricate rotifer. Fry food in aquaculture. It filters algae and bacteria. | Brachionus plicatilis là luân trùng phù du có vỏ. Thức ăn cá con trong nuôi thủy sản. Nó lọc tảo và vi khuẩn. |
| `76` | Keratella cochlearis is a rotifer with a long lorica spine. The spine deters predators. Common pond plankton. | Keratella cochlearis là luân trùng có gai vỏ dài. Gai ngăn thợ săn. Phù du ao phổ biến. |
| `77` | Asplanchna priodonta is a sack without a lorica, a predatory rotifer. It swallows other rotifers and ciliates whole. | Asplanchna priodonta là cái túi không vỏ, luân trùng săn mồi. Nó nuốt luân trùng và trùng lông khác nguyên con. |
| `78` | Chaetonotus maximus is a gastrotrich. Scale-covered, it crawls on the bottom. It eats bacteria and detritus. | Chaetonotus maximus là gastrotrich. Phủ vảy, bò đáy. Nó ăn vi khuẩn và mùn bã. |
| `79` | Lepidodermella squamata is a small gastrotrich in overlapping scales. Very fast in-place turns. | Lepidodermella squamata là gastrotrich nhỏ trong vảy chồng nhau. Xoay tại chỗ rất nhanh. |
| `80` | Macrostomum lignano is a microscopic flatworm. Real muscles and eyes. A regeneration model. It hunts small protists. | Macrostomum lignano là giun dẹt hiển vi. Cơ và mắt thật. Mô hình tái sinh. Nó săn động vật nguyên sinh nhỏ. |
| `81` | Stenostomum leucops is a thin ciliated worm. It divides across into a chain of zooids. Predator of detritus and small animals. | Stenostomum leucops là giun lông chuyển mảnh. Nó phân đôi ngang thành chuỗi zooid. Thợ săn mùn bã và động vật nhỏ. |
| `82` | Microstomum lineare is a flatworm that eats hydra and embeds their stinging cells in its own skin. A chain of zooids. | Microstomum lineare là giun dẹt ăn thủy tức và nhét tế bào chích của chúng vào da mình. Chuỗi zooid. |
| `83` | Prostoma graecense is a freshwater nemertean. A long proboscis shoots at prey. A rare large bottom hunter. | Prostoma graecense là giun nemertine nước ngọt. Vòi dài bắn vào con mồi. Thợ săn đáy lớn hiếm gặp. |
| `84` | Trichoplax adhaerens is a placozoan, among the simplest animals. It crawls as a sheet and digests food outside. No mouth. | Trichoplax adhaerens là placozoa, thuộc nhóm động vật đơn giản nhất. Nó bò như tấm và tiêu hóa thức ăn bên ngoài. Không miệng. |
| `85` | Saccharomyces cerevisiae is baker's yeast. It buds, eats sugar, releases CO2 and alcohol. In the pond it cleans dissolved organics. | Saccharomyces cerevisiae là men bánh mì. Nó nảy chồi, ăn đường, thải CO2 và cồn. Trong ao nó dọn chất hữu cơ hòa tan. |
| `86` | Candida albicans is a yeast that can grow as filaments. An opportunistic human pathogen. In-game it is a detrital fungus. | Candida albicans là nấm men có thể mọc thành sợi. Mầm bệnh cơ hội ở người. Trong game nó là nấm mùn bã. |
| `87` | Mucor mucedo is bread mold. Sporangia on stalks, fast growth over the dead. It does not hunt the living. | Mucor mucedo là mốc bánh mì. Túi bào tử trên cuống, mọc nhanh trên vật chết. Nó không săn sinh vật sống. |
| `88` | Rhizopus stolonifer is black bread mold. Stolons and rhizoids spread over the substrate. It breaks down starch. | Rhizopus stolonifer là mốc bánh mì đen. Stolon và rễ giả lan trên nền. Nó phân hủy tinh bột. |
| `89` | Penicillium chrysogenum is a brush mold, the source of penicillin. Conidial brushes. It decomposes organics and suppresses nearby bacteria. | Penicillium chrysogenum là nấm mốc chổi, nguồn penicillin. Chổi conidia. Nó phân hủy chất hữu cơ và dập vi khuẩn xung quanh. |
| `90` | Aspergillus niger is black aspergillus. Spherical spore heads. Industrial citric-acid producer. A saprotroph. | Aspergillus niger là aspergillus đen. Đầu bào tử hình cầu. Sản xuất axit citric công nghiệp. Sinh vật ăn mục. |
| `91` | Batrachochytrium dendrobatidis is a chytrid of frogs. Uniflagellate zoospores. In the pond it is a water-fungus model. | Batrachochytrium dendrobatidis là nấm chytrid của ếch. Zoospore một roi. Trong ao nó là mô hình nấm nước. |
| `92` | Chytriomyces aureus is a water chytrid on pollen and algae. Golden sporangia; zoospores swim to the substrate. | Chytriomyces aureus là chytrid nước trên phấn hoa và tảo. Túi bào tử vàng; zoospore bơi tới nền. |
| `93` | Allomyces macrogynus is a water fungus with true mycelium. It alternates diploid and haploid. Zoospores have a posterior flagellum. | Allomyces macrogynus là nấm nước có hệ sợi thật. Nó luân phiên lưỡng bội và đơn bội. Zoospore có roi sau. |
| `94` | Bacillus subtilis is a soil rod. Spores survive boiling. It breaks down protein; a Gram-positive model. | Bacillus subtilis là trực khuẩn đất. Bào tử sống sót khi đun sôi. Nó phân hủy protein; mô hình Gram-dương. |
| `95` | Pseudomonas putida is a cleanup rod. It even eats petroleum products. Motile flagellum, fast growth on detritus. | Pseudomonas putida là trực khuẩn dọn dẹp. Nó ăn cả sản phẩm dầu mỏ. Roi di động, mọc nhanh trên mùn bã. |
| `96` | Streptomyces coelicolor is a filamentous soil bacterium. It makes the smell of earth (geosmin) and many antibiotics. Spores on hyphae. | Streptomyces coelicolor là vi khuẩn đất hình sợi. Nó tạo mùi đất (geosmin) và nhiều kháng sinh. Bào tử trên sợi. |
| `97` | Cellulomonas fimi breaks down cellulose. A yellow rod on plant detritus. Without it dead algae would linger longer. | Cellulomonas fimi phân hủy cellulose. Trực khuẩn vàng trên mùn bã thực vật. Không có nó tảo chết sẽ nằm lâu hơn. |
| `98` | Thermus aquaticus is a thermophile from hot springs. Taq polymerase is the basis of PCR. In a cold pond it is almost dormant. | Thermus aquaticus là sinh vật ưa nhiệt từ suối nước nóng. Enzyme Taq polymerase là nền của PCR. Trong ao lạnh nó gần như ngủ. |
| `99` | Deinococcus radiodurans is the radiation champion. It reassembles a shattered genome in hours. Thick wall, cell tetrads. | Deinococcus radiodurans là nhà vô địch bức xạ. Nó lắp lại bộ gen vỡ vụn trong vài giờ. Thành dày, tế bào theo cụm bốn. |
| `1001` | Sexual Eukaryote is a teaching model of sexual reproduction. Two sexes, gamete fusion, not simple binary fission. | Sexual Eukaryote là mô hình dạy sinh sản hữu tính. Hai giới, hợp nhất giao tử, không phải phân đôi đơn giản. |
| `T4 Bacteriophage` | T4 is a large myovirus of E. coli. The tail contracts and injects DNA. In half an hour the cell bursts and dozens of phages exit. | T4 là myovirus lớn của E. coli. Đuôi co lại và tiêm DNA. Sau nửa giờ tế bào vỡ và hàng chục phage thoát ra. |
| `Lambda Phage` | Lambda is a temperate phage. It can insert into the chromosome and sleep (lysogeny) or cut the cell at once (lysis). | Lambda là phage ôn hòa. Nó có thể chèn vào nhiễm sắc thể và ngủ (lysogeny) hoặc cắt tế bào ngay (lysis). |
| `T7 Bacteriophage` | T7 has a short tail and very fast replication. A favourite system in synthetic biology. | T7 có đuôi ngắn và sao chép rất nhanh. Hệ thống yêu thích trong sinh học tổng hợp. |
| `Phi-6 Phage` | Phi-6 is an RNA phage with a lipid envelope. It infects Pseudomonas. A rare membrane for a phage. | Phi-6 là phage RNA có vỏ lipid. Nó nhiễm Pseudomonas. Màng hiếm gặp ở phage. |
| `MS2 Phage` | MS2 is a tiny tailless RNA phage. It binds male E. coli pili. Its genome was one of the first RNA genomes read. | MS2 là phage RNA tí hon không đuôi. Nó bám pili của E. coli đực. Bộ gen của nó là một trong những bộ gen RNA đầu tiên được đọc. |
| `Neuro-Parasite` | A fictional pond neuro-parasite. It latches onto eukaryotes and breaks host behaviour until the host becomes a carrier. | Ký sinh thần kinh ao hư cấu. Nó bám vào sinh vật nhân thật và phá hành vi vật chủ cho đến khi vật chủ thành vật trung chuyển. |
| `Sexual Eukaryote` | Sexual Eukaryote is a teaching model of sexual reproduction. Two sexes, gamete fusion, not simple binary fission. | Sexual Eukaryote là mô hình dạy sinh sản hữu tính. Hai giới, hợp nhất giao tử, không phải phân đôi đơn giản. |
