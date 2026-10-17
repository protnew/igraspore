# ANALYST-ROUND7 — проверка аналитиком, круг 7 (fil, tr) (17.10.2026, начало 08:47 UTC+3)

Аналитик — единственный критик (№20, ред. 16.10). Session `analyst-08-20261017-0847`, model «Grok Bot». Листинг магазина круг 2 — отдельный файл `STORE-LISTING-ANALYST-ROUND2-2026-10-17.md`.

## Метод
- Вход: `09-Docs/i18n-review/fil-round7-for-review.md`, `tr-round7-for-review.md` (412 ключей UI в пакете — 403 переводимых + служебные; вики 108 тел).
- sha словарей на диске = `round7-input-sha.json` = шапка пакета: fil `afcded6b…28f0`, tr `eca22fa1…c206`; wiki/fil `4bab5052…c0ce`, wiki/tr `00dba564…706f` (в round7-input-sha.json вики-sha нет — 🟢 замечание к make_review, не блокер).
- Проверено, что КАЖДОЕ замечание прошлого круга исправлено (fil круг 5 — 9 групп, tr круг 6 — 1): да, все по ключам.
- Впервые полное чтение fil и tr целиком: все 412 ключей UI рядом с en + все 108 тел вики (а не выборка ~40 ключей, как в круге 5). Поэтому у fil всплыли новые ошибки, которых круг 5 не видел.
- `hagis` в fil.json и wiki/fil.json — 0; «Planta ng enerhiya» в `edu.mito.desc` — есть.

## Итог круга 7
Таблица 1. Оценки
| язык | круг | score | смысл | глоссарий | регистр | длина | ошибки | замечаний | ≥ 8 |
|---|---|---|---|---|---|---|---|---|---|
| tr | 7 | 8.3 | 8.5 | 8 | 8.5 | 9 | 7.5 | 8 (мелкие) | ✅ |
| fil | 7 | 7.0 | 7 | 6.5 | 7.5 | 9 | 5 | 40 групп | ❌ |

## Гейты (critic_check --gate, запуск после записи файлов и журнала)
См. таблицу 4 ниже (заполнено по факту запуска).

## Что делать разработчику (U26 круг 8)
- 🔴 fil: исправить все 40 групп из таблицы 2 (UI 21 + вики 19), затем скрипт-поиск оставшихся испанских слов (esquema/tornillo/…) и английских вставок в вики (кроме латинских названий видов); новый пакет `fil-round8-for-review.md` + `round8-input-sha.json` (с вики-sha). Язык не выключать (№22), до 5 кругов (сейчас 3-й круг аналитика для fil: 5, 7 → следующий 8).
- 🟡 tr: 8 мелких правок (таблица 3) **желательно** внести тем же кругом 8 — тогда tr тоже перепроверяется (sha изменится). Если не вносить — tr остаётся PASS по кругу 7.
- U16: es/tr/fil включать только при exit 0 всех трёх гейтов — сейчас fil FAIL.

## Таблица 2. fil — замечания круга 7 (ключ | проблема | правка)
| ключ | проблема | правка |
|---|---|---|
| `aria.aqua` | «Akvaryum» — это турецкое слово (в fil-словаре), рядом aquarium = «AKWARIUM» | Akwaryum |
| `aria.zo` | «Paypayin» — не слово; пара к aria.zi «Palakihin» | Paliitin |
| `ev.eclipse` | «Lubak ng araw» — lubak = яма/выбоина на дороге, не затмение | Eklipse ng araw |
| `sp.1000` | «Pulat» — не слово (губка) | Espongha (Nagsasala ng pagkain) |
| `fc.schema` | «(esquema)» — испанское слово | (eskema) |
| `wiki.div.budding` | «Pagkabuton» — не слово и расходится с loc.budding «pag-usbong» | Pag-usbong |
| `wgl.diff1` | «ripgel» — не слово | …background ng tubig (alon, caustics, kislap) |
| `x.born / x.totalBorn` | «Isinilangang» — висячая связка -ng, ошибка | Isinilang / Kabuuang isinilang |
| `x.locomotion` | «Paglalakbay» = путешествие, а не способ движения | Paggalaw |
| `edu.membrane.desc` | «Kontrolado ang pumasok at labas» — неграмматично; «balatan» не слово | Manipis na lipid na balot. Kinokontrol kung ano ang pumapasok at lumalabas. May membrane ang bawat selula. |
| `edu.flagella.desc` | «paglalangoy», «lumilangoy» — неверные формы | Mahabang motor sa paglangoy. Umiikot o kumukurba — lumalangoy ang selula papunta sa pagkain o palayo sa panganib (chemotaxis). |
| `edu.oral.desc` | «hukay na dinudulot ng cilia ang huli» — бессмысленно (dulot = причинять) | Sa ciliate — uka kung saan itinutulak ng cilia ang huli. Dito pumapasok ang pagkain sa digestive vacuole. |
| `tip.energyBar` | «Nabababa sa pagpasang ng oras» — ошибка формы и слова | Enerhiya ng nilikha. Bumababa habang lumilipas ang oras. Sa zero — mamamatay sa gutom. |
| `role.consumer2` | «Hindi humaharang sa higante» — harang = загораживать; смысл «не нападают на гигантов» | …Hindi umaatake sa mga higante. |
| `role.macrophage` | «Umatake» (повелит.) и «immuno sistema» — смесь | Mga bantay. Umaatake sa may-sakit/mapanganib na selula — sistemang imyuno ng lawa. |
| `toast.filter.catch2` | «nakuhang ang huli» — ошибка формы | Filter: nahuli ang biktima |
| `toast.digest` | «Nagtunaw...» — прошедшее/непереходное; нужно «переваривает» | Tinutunaw... ({s}s) |
| `star.dwarf / star.giant / star.binary / star.flare` | «Pula na dwarf», «Dalandang higante», «dalandanan», «patsik» — ошибки/не слова | ★ Pulang dwarf / ★ Kahel na higante / ★ Binary (asul+kahel) / ★ Sumisiklab na bituin (UV Ceti) |
| `tip.popC` | «panganak» — не то слово (роды у человека) | …kasaysayan ng pagsilang at kamatayan. |
| `hud.btn.light / hud.btn.light.short` | LIWANAG и ILAW для одной кнопки | LIWANAG в обоих |
| `autoOn / hud.btn.auto / auto.on` | AUTO и AWTO вперемешку | везде AWTO |
| `wiki 2` | «tornillo» — испанское слово | turnilyo |
| `wiki 4` | «Umuuga ito pahilis» — pahilis = наискось; нужно «из стороны в сторону» | Umuuga ito pagilid-gilid |
| `wiki 7` | «matsa» — не слово | banig |
| `wiki 13` | «nagpapalagyan», «nakalulutas sa tagtuyot» (lutas = решать задачу) | nagpapatubo ng makapal na dingding; nakaliligtas sa tagtuyot |
| `wiki 16` | «pintoan» — не слово | balbula |
| `wiki 19` | «salagat» — не слово | hila (drag) sa haligi ng tubig |
| `wiki 22` | «isang-uniselula» — тавтология | isang uniselular na pulang alga |
| `wiki 25 / Neuro-Parasite` | «punong» — обрубок слова (хозяин = host) | punong-abala (host) |
| `wiki 44` | «salsala» — не слово | pansala |
| `wiki 45` | «bulate ng bibig» — bulate = червь; нужно «ротовая бороздка» | uka ng bibig |
| `wiki 47 / 48` | «trumpo» = юла; Stentor — «труба» | trumpeta |
| `wiki 52` | «Kumikilos ito nang ilang beses» — смысл «сжимается в несколько раз» потерян | Umiikli ito nang ilang ulit sa loob ng bahagi ng segundo. |
| `wiki 59` | «hinihihipan» = дует; нужно «высасывает» | sinisipsip |
| `wiki 63` | «Takip ang sumasagwan sa bibig» (sagwan = весло) | May takip na tumatakip sa bibig. |
| `wiki 65` | «kubo» = хижина; нужен «купол» | simboryo |
| `wiki 79` | «nag-uumpugan» = сталкиваются | nagpapatong-patong na kaliskis |
| `wiki 85 / 94` | «pampasaka», «nalutunaw», «nakalulutas» — ошибки | lebadura ng tinapay; natunaw na organiko; nakaliligtas sa kumukulong tubig |
| `wiki Lambda Phage` | «sumakap», «gutirin» — не слова | sumanib sa chromosome …; agad na wasakin ang selula (lysis) |
| `wiki (общее)` | ~30 тел с длинными английскими вставками (social bacterium, fruiting body, sleeping sickness, teaching model, water-fungus, brush mold) | перевести общеупотребительные слова (bakteryang panlipunan, sakit sa pagtulog, modelong panturo, amag na parang brotsa); латинские названия видов оставить |

## Таблица 3. tr — замечания круга 7 (не блокируют)
| ключ | проблема | правка |
|---|---|---|
| `wiki.div.binary` | «İkilii bölünme» — опечатка | İkili bölünme |
| `edu.flagella.desc` | «yiyeğe» — опечатка | …hücre yiyeceğe ya da tehlikeden uzağa yüzer (kemotaksi). |
| `wgl.diff1` | «kauistik» — опечатка | kostik |
| `midEaterTip` | «Siller» — везде в словаре «Kirpikler» | …Kirpikler kendiliğinden süzer. |
| `tip.popC` | «Popülasyon» — в остальных ключах «Nüfus» | Nüfus grafiği. Doğum ve ölüm geçmişini gösterir. |
| `wiki 51 / 59` | «Toksisitler» — неверный термин (toxicyst) | toksisistler |
| `wiki 54 / 55 / 56` | «sirler/sirlerle» — cirri по-турецки «sirruslar» | sirruslar / sirruslarla |
| `wiki 1001 / Sexual Eukaryote` | имя вида оставлено по-английски, а sp.1001 = «Cinsel Ökaryot» | Eşeyli Ökaryot, eşeyli üremenin öğretim modelidir. … |

## Таблица 4. Гейты после записи
| команда | вывод | exit |
|---|---|---|
| `node tools/i18n/critic_check.mjs` | OK files=40 models=1 | 0 |
| `--gate es` | PASS — OK круг 6 score 8.6 | 0 |
| `--gate tr` | PASS — OK круг 7 score 8.3 | 0 |
| `--gate fil` | FAIL — оценка 7 ниже порога 8 | 1 |

Вывод: U16 (включить es/tr/fil) — НЕЛЬЗЯ, пока fil не дойдёт до ≥ 8 (круг 8). Запуск 17.10.2026 09:02 (UTC+3).
