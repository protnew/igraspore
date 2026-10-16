# ANALYST-ROUND6 — проверка аналитиком, круг 6 (+ fil круг 5) и листинг магазина (16.10.2026, начало 21:13 UTC+3)

Аналитик — единственный критик (№20). Session `analyst-08-20261016-2113`, model «Grok Bot».

## Метод
- Вход: пакеты `<lang>-round6-for-review.md` (18 языков) и `fil-round5-for-review.md`; sha словарей совпадают с round6-input-sha.json и с диском.
- Проверено, что КАЖДОЕ замечание круга 5 исправлено (по ключам; изменено в языке 1–10 ключей, только по замечаниям).
- Автопроверка всех ключей всех языков: токены/HTML против en — 0 расхождений.
- fil — первая оценка аналитика: ручное чтение ~40 заметных ключей (кнопки, обучение, тосты, подсказки, loc.*, help) + поиск испанских/английских вставок.
- Листинг магазина: все 32 файла бегло, 8 подробно (en, nl, sw, el, fil, tr, zh-CN, pt-PT). store_len: OK files=32 over=0.

## Круг 6 — итог
| язык | круг | score | смысл | глоссарий | регистр | длина | ошибки | замечаний | ≥ 8 |
|---|---|---|---|---|---|---|---|---|---|
| ru | 6 | 8.8 | 9 | 9 | 8.5 | 9 | 8.5 | 0 | ✅ |
| de | 6 | 8.6 | 8.5 | 8.5 | 8.5 | 9 | 8.5 | 0 | ✅ |
| fr | 6 | 8.6 | 8.5 | 8.5 | 8.5 | 9 | 8.5 | 0 | ✅ |
| it | 6 | 8.6 | 8.5 | 8.5 | 8.5 | 9 | 8.5 | 0 | ✅ |
| pl | 6 | 8.6 | 8.5 | 8.5 | 8.5 | 9 | 8.5 | 0 | ✅ |
| pt-BR | 6 | 8.6 | 8.5 | 8.5 | 8.5 | 9 | 8.5 | 0 | ✅ |
| es | 6 | 8.6 | 8.5 | 8.5 | 8.5 | 9 | 8.5 | 0 | ✅ |
| id | 6 | 8.6 | 8.5 | 8.5 | 8.5 | 9 | 8.5 | 0 | ✅ |
| ms | 6 | 8.6 | 8.5 | 8.5 | 8.5 | 9 | 8.5 | 0 | ✅ |
| vi | 6 | 8.6 | 8.5 | 8.5 | 8.5 | 9 | 8.5 | 0 | ✅ |
| uk | 6 | 8.6 | 8.5 | 8.5 | 8.5 | 9 | 8.5 | 0 | ✅ |
| ja | 6 | 8.7 | 8.5 | 8.5 | 8.5 | 9 | 9 | 0 | ✅ |
| ko | 6 | 8.7 | 8.5 | 8.5 | 8.5 | 9 | 9 | 0 | ✅ |
| th | 6 | 8.7 | 8.5 | 8.5 | 8.5 | 9 | 9 | 0 | ✅ |
| zh-TW | 6 | 8.7 | 8.5 | 8.5 | 8.5 | 9 | 9 | 0 | ✅ |
| hi | 6 | 8.3 | 8 | 8.5 | 8 | 9 | 8 | 0 | ✅ |
| bn | 6 | 8.4 | 8 | 8.5 | 8 | 9 | 8.5 | 0 | ✅ |
| tr | 6 | 8.3 | 8 | 8.5 | 8.5 | 9 | 7.5 | 1 | ✅ |
| fil | 5 | 7.6 | 7.5 | 6.5 | 8 | 9 | 7 | 9 | ❌ |
| en | 5 (без изменений) | 9.0 | — | — | — | — | — | 0 | ✅ |

## Гейты включения
- es ✅ 8.6, tr ✅ 8.3, **fil ❌ 7.6** → U16 (включение es/tr/fil) пока НЕЛЬЗЯ: fil после правок — новый пакет, аналитик проверит снова.
- Внимание: если править tr (dTip.temp), sha tr изменится и tr тоже уйдёт на повторную проверку — делать вместе с fil, одним кругом.

## Правки переводов игры (U26, круг 6)
| язык | ключ | проблема | правка |
|---|---|---|---|
| tr | `dTip.temp` | «Termmetreyle ilgilen» — опечатка и неестественно | İpucu: Termometreyi izle. Sıcaklık aralığını mutasyona uğrat. |
| fil | `tip.divide / aria.divide / dTip.age / tut.s4.body` | «Humagis/HUMAGIS» (от hagis — бросать) вместо деления; кнопка HUD — «HATI» | Hati / Hati (Q); dTip.age «…Humati bago mamatay.»; tut.s4 «…pindutin ang HATI (Q)…» |
| fil | `tut.s3.body` | «KUMAIN (E)», а кнопка HUD «KAIN» | …pindutin ang KAIN (E)… |
| fil | `tut.s4.body` | «Kapuno» — ошибка | Kapag puno ang enerhiya, … |
| fil | `tut.s5.body` | «Good luck» по-английски | Kamera: sundan o malayang lipad. Swertehin ka sa ebolusyon! |
| fil | `dTip.temp` | «temperature range» по-английски | Tip: Bantayan ang termometro. I-mutate ang saklaw ng temperatura. |
| fil | `loc.drift` | «tumutugoy» — не слово | inaanod |
| fil | `loc.glide` | «dumudulag» — не слово | dumudulas |
| fil | `loc.budding` | «pagbutong» — не слово | pag-usbong |
| fil | `edu.mito.desc` | «Power plant» по-английски | Planta ng enerhiya ng selula. … |

## Листинг магазина (U20) — 32 языка
| язык | оценка | ≥ 8 | замечания и правки |
|---|---|---|---|
| en | 9 | ✅ | — |
| de | 9 | ✅ | — |
| fr | 8.5 | ✅ | — |
| hi | 8.5 | ✅ | — |
| id | 8.5 | ✅ | — |
| ja | 9 | ✅ | — |
| ko | 9 | ✅ | — |
| zh-TW | 9 | ✅ | — |
| ru | 8.5 | ✅ | формат полей другой («название:»), store_len его принимает |
| zh-CN | 9 | ✅ | — |
| pt-PT | 9 | ✅ | — |
| pt-BR | 8 | ✅ | «num lago» — скорее pt-PT; для BR «em um lago» |
| pl | 8.5 | ✅ | — |
| uk | 8.5 | ✅ | — |
| ro | 8.5 | ✅ | short: «divide» → «divide-te» |
| vi | 8.5 | ✅ | — |
| bn | 8.5 | ✅ | — |
| th | 8 | ✅ | «ยูคาริโอตมีซิเลีย» тяжеловесно → «สัตว์เซลล์เดียวมีขน» |
| nl | 8.5 | ✅ | — |
| tr | 8 | ✅ | short «bölün» → «böl»; «latince kalır» → «Latince kalır» |
| cs | 8 | ✅ | смешение «ty» (short) и «vy» (full) → везде «ty» |
| es | 8 | ✅ | full: «formaste» → «formas» |
| sw | 6 | ❌ | short: «Dimbwi katika kipato» (kipato = доход) → «Dimbwi kwa mkato»; «la» → «kula»; «furika» (затопить) → «jificha»; «ni michezo» → «ni mchezo»; «Majina ya Kisiasa» (политические!) → «Majina ya Kilatini»; «Ukiwezi» → «Usipoweza» |
| fi | 6 | ❌ | short: «syy, jaa, piidy itioon» → «syö, jakaudu, piiloudu itiöön»; «sukkulaeläimet» (нематоды) → «ripsieläimet»; «ition» → «itiön» |
| hu | 6.5 | ❌ | short: «oszolj el» (рассеяться) → «osztódj»; «képezol» → «képezel»; «lebonterek» → «lebontók» |
| it | 7 | ❌ | title «Micobi» → «Microbi»; short «Uno staglio» → «Uno stagno» |
| fil | 7 | ❌ | «humagis» → «humati»; «Simple ang ibang bar» → «Simple ang ibabang bar»; «daan-daang uri» (сотни) → «mga isandaang uri»; «Manatiling Latin» → «Nananatiling Latin» |
| no | 7 | ❌ | смесь нюнорска и букмола («eit/ein» + «et»); «gjom» → «gjøm»; выбрать букмол: «en gratis læringssimulering», «en dam» |
| el | 7.5 | ❌ | «κροταφοζώα» неверно → «βλεφαριδοφόρα»; «αυτό» → «αυτόματο»; «παικτη» → «παίκτη» |
| da | 7.5 | ❌ | «tomceller» неверно → «ciliater (fimredyr)» |
| sv | 7.5 | ❌ | «inledningssimulering» (вводная) → «lärosimulering» |
| ms | 7.5 | ❌ | «Anda sejenis sel» → «Anda ialah satu sel»; «membahagi» → «membelah» (как кнопка); «cilia» → «siliata» |

Итого листинг: 22 из 32 ≥ 8; ниже 8 — sw, fi, hu, it, fil, no, el, da, sv, ms (10).
**Общее для всех 32:** фраза «Данные игроков не собираются / No player data is collected» станет неправдой, если владелец выберет №24 = 1.1 или 1.2 (Firebase). После решения №24 — обновить эту фразу во всех 32 файлах и Data safety.
