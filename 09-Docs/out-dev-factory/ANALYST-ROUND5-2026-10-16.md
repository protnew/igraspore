# ANALYST-ROUND5 — проверка переводов аналитиком, круг 5 (16.10.2026, начало 18:39 UTC+3)

Аналитик — единственный критик (№20, ред. 16.10). Session `analyst-08-20261016-1839`, model «Grok Bot». fil не проверялся — ждёт правки 3 «Klik» и пересборки пакета.

## Метод (честно)
- Вход: пакеты `09-Docs\i18n-review\<lang>-round5-for-review.md` (17:46), словари `.04-Src\i18n\<lang>.json` (sha совпадают с round5-input-sha.json), снимки es/tr.
- Автопроверка ВСЕХ 272 новых ключей (263 U13 + 9 loc.*) × 19 языков: токены {param}/HTML против en, кириллица вне ru/uk, совпадение с en, латиница в нелатинских письменностях, длина кнопочных ключей.
- Ручное чтение: 20 ключей с наибольшей видимостью (кнопки HUD, обучение, тосты, подсказки смерти, loc.*) × 18 языков + глоссарий против hud.btn.*.
- Оценки — по 5 осям (смысл, глоссарий vs hud.btn.*, регистр, длина, ошибки), score = среднее.
- Бренды/режимы SWISS, WEBGL, WebGL, Canvas, Android APK, «UV Ceti», «Alpha Centauri», «Sirius» — допустимы без перевода.

## Итог
| язык | score | смысл | глоссарий | регистр | длина | ошибки | замечаний | ≥ 8 |
|---|---|---|---|---|---|---|---|---|
| en | 9.0 | 9 | 9 | 9 | 9 | 9 | 1 | ✅ |
| ru | 8.5 | 8.5 | 9 | 8.5 | 9 | 7.5 | 6 | ✅ |
| de | 8.1 | 8.5 | 7 | 8.5 | 9 | 7.5 | 4 | ✅ |
| fr | 7.9 | 8.5 | 6.5 | 7.5 | 9 | 8 | 5 | ❌ |
| it | 8.3 | 8.5 | 7 | 8.5 | 9 | 8.5 | 3 | ✅ |
| pl | 8.3 | 8.5 | 7 | 8.5 | 9 | 8.5 | 3 | ✅ |
| pt-BR | 8.2 | 8.5 | 7 | 8.5 | 9 | 8 | 4 | ✅ |
| es | 8.5 | 8.5 | 8.5 | 8.5 | 9 | 8 | 1 | ✅ |
| tr | 8.0 | 8 | 8.5 | 7.5 | 9 | 7 | 3 | ✅ |
| id | 8.3 | 8.5 | 7 | 8.5 | 9 | 8.5 | 3 | ✅ |
| ms | 8.2 | 8.5 | 6.5 | 8.5 | 9 | 8.5 | 4 | ✅ |
| vi | 8.3 | 8.5 | 7 | 8.5 | 9 | 8.5 | 3 | ✅ |
| uk | 8.2 | 8.5 | 6.5 | 8.5 | 9 | 8.5 | 3 | ✅ |
| hi | 7.8 | 7.5 | 7 | 8 | 9 | 7.5 | 5 | ❌ |
| ja | 8.4 | 8.5 | 7 | 8.5 | 9 | 9 | 3 | ✅ |
| ko | 8.4 | 8.5 | 7 | 8.5 | 9 | 9 | 3 | ✅ |
| th | 8.4 | 8.5 | 7 | 8.5 | 9 | 9 | 3 | ✅ |
| zh-TW | 8.4 | 8.5 | 7 | 8.5 | 9 | 9 | 3 | ✅ |
| bn | 7.9 | 7.5 | 7 | 8 | 9 | 8 | 5 | ❌ |

## Главные проблемы
1. **Глоссарий «спора»:** в 14 языках подсказка и aria кнопки R (`tip.cyst`, `aria.cyst`) переведены как «циста», а на самой кнопке HUD — «спора» (fr, it, pl, pt-BR, id, ms, vi, uk, hi, ja, ko, th, zh-TW, bn; de — только aria). Игрок видит два разных слова для одной кнопки.
2. **LMB/RMB** (английские сокращения кнопок мыши) в `x.wasdSwimLmbCursorRmbTargetWheel` почти во всех языках (кроме ru/uk/es/tr).
3. **Опечатки и ошибки:** ru «Плывать», «ПкМ»; tr «parlam», «yiyeğin»; es «séctil»; de «ein Mikrobe»; hi «जीवाणु» (бактерия) вместо «микроб».
4. **Смешение «ты/вы»:** fr и tr в подсказках смерти (dTip.*) — «вы», в обучении — «ты».
5. **Несовпадение с кнопками HUD в тексте обучения:** de «ESSEN» vs «FRESS», uk «ЇСТИ» vs «ЇЖ», ms «Bahagi» vs «BELAH».
6. Не переведено: ru «CARTOON»/«Cartoon», хвост «(Language Selector)»; hi «FOLLOW».

## Ниже порога 8 (язык НЕ выключать, №22): fr 7.9, hi 7.8, bn 7.9 → исправить по таблице, новый пакет круга 6.

## Таблица правок для разработчика (U26)
| язык | ключ | проблема | правка |
|---|---|---|---|
| en | `tip.cyst / x.cyst` | в источнике «Spore» (кнопка) и «Cyst» (статус) — разные понятия, переводчики путают | оставить, но в комментарии для переводчиков: tip.cyst/aria.cyst = кнопка SPORE |
| ru | `x.wasdSwimLmbCursorRmbTargetWheel` | «Плывать» — ошибка; «ПкМ» — регистр; «К курсору» | «Плыть», «ПКМ», «Курсор» |
| ru | `modeBig.cartoon` | «CARTOON» не переведено, а в обучении «МУЛЬТЯШНЫЙ» | 🎨 МУЛЬТЯШНЫЙ |
| ru | `modeLbl.cartoon` | «Cartoon» не переведено | 🎨 Мультяшный |
| ru | `tip.lang` | хвост «(Language Selector)» | Выбор языка |
| ru | `loc.glide` | прилагательное среди существительных | скольжение |
| ru | `help.body` | разметка отличается от en (лишние <b>/<br>, нет одного <p>) — проверить на снимке | привести теги к en |
| de | `aria.cyst` | «Zyste» — кнопка «SPORE» | Spore (R) |
| de | `tut.s3.body` | «ESSEN», а кнопка HUD «FRESS» | …drücke FRESS (E)… |
| de | `tut.s1.body` | «ein Mikrobe» — род | Du bist eine Mikrobe im Tümpel… |
| de | `x.wasdSwimLmbCursorRmbTargetWheel` | LMB/RMB — английские сокращения кнопок мыши | <kbd>Linksklick</kbd> … <kbd>Rechtsklick</kbd> |
| fr | `tip.cyst` | глоссарий: подсказка «Cyste» (циста), а кнопка HUD — «SPORE» (спора) | Spore |
| fr | `aria.cyst` | то же в подписи для экранного диктора | Spore (R) |
| fr | `dTip.starve (и dTip.*)` | «Mangez/restez» на «вы», а обучение на «tu» | Mange plus souvent, reste près… |
| fr | `toast.bite` | «BOUCHÉE» — «кусок еды», не укус | CROC ! {name} |
| fr | `x.wasdSwimLmbCursorRmbTargetWheel` | LMB/RMB — английские сокращения кнопок мыши | <kbd>Clic gauche</kbd> … <kbd>Clic droit</kbd> |
| it | `tip.cyst` | глоссарий: подсказка «Ciste» (циста), а кнопка HUD — «SPORA» (спора) | Spora |
| it | `aria.cyst` | то же в подписи для экранного диктора | Spora (R) |
| it | `x.wasdSwimLmbCursorRmbTargetWheel` | LMB/RMB — английские сокращения кнопок мыши | <kbd>Clic sx</kbd> … <kbd>Clic dx</kbd> |
| pl | `tip.cyst` | глоссарий: подсказка «Cysta» (циста), а кнопка HUD — «SPORA» (спора) | Spora |
| pl | `aria.cyst` | то же в подписи для экранного диктора | Spora (R) |
| pl | `x.wasdSwimLmbCursorRmbTargetWheel` | LMB/RMB — английские сокращения кнопок мыши | <kbd>LPM</kbd> … <kbd>PPM</kbd> |
| pt-BR | `tip.cyst` | глоссарий: подсказка «Cisto» (циста), а кнопка HUD — «ESPORO» (спора) | Esporo |
| pt-BR | `aria.cyst` | то же в подписи для экранного диктора | Esporo (R) |
| pt-BR | `toast.bite` | «BOCADA» — «кусок еды» | MORDIDA! {name} |
| pt-BR | `x.wasdSwimLmbCursorRmbTargetWheel` | LMB/RMB — английские сокращения кнопок мыши | <kbd>Clique esq.</kbd> … <kbd>Clique dir.</kbd> |
| es | `loc.sessile` | «séctil» — такого слова нет | sésil |
| tr | `tut.s3.body` | «parlam» — опечатка | Bir parlama görmelisin. |
| tr | `dTip.starve` | «yiyeğin» — опечатка; «yiyin/durun» на «вы», а обучение на «ты»; «mutasyonlayın» неестественно | İpucu: Daha sık ye, yiyecek kümelerinin yakınında kal ya da hızını mutasyona uğrat. |
| tr | `dTip.*` | проверить все подсказки смерти на единое «sen» | привести к «sen» |
| id | `tip.cyst` | глоссарий: подсказка «Sista» (циста), а кнопка HUD — «SPORA» (спора) | Spora |
| id | `aria.cyst` | то же в подписи для экранного диктора | Spora (R) |
| id | `x.wasdSwimLmbCursorRmbTargetWheel` | LMB/RMB — английские сокращения кнопок мыши | <kbd>Klik kiri</kbd> … <kbd>Klik kanan</kbd> |
| ms | `tip.cyst` | глоссарий: подсказка «Sista» (циста), а кнопка HUD — «SPORA» (спора) | Spora |
| ms | `aria.cyst` | то же в подписи для экранного диктора | Spora (R) |
| ms | `tip.divide / aria.divide` | «Bahagi», а кнопка HUD «BELAH» | Belah / Belah (Q) |
| ms | `x.wasdSwimLmbCursorRmbTargetWheel` | LMB/RMB — английские сокращения кнопок мыши | <kbd>Klik kiri</kbd> … <kbd>Klik kanan</kbd> |
| vi | `tip.cyst` | глоссарий: подсказка «Nang» (циста), а кнопка HUD — «BÀO TỬ» (спора) | Bào tử |
| vi | `aria.cyst` | то же в подписи для экранного диктора | Bào tử (R) |
| vi | `x.wasdSwimLmbCursorRmbTargetWheel` | LMB/RMB — английские сокращения кнопок мыши | <kbd>Chuột trái</kbd> … <kbd>Chuột phải</kbd> |
| uk | `tip.cyst` | глоссарий: подсказка «Циста» (циста), а кнопка HUD — «СПОРА» (спора) | Спора |
| uk | `aria.cyst` | то же в подписи для экранного диктора | Спора (R) |
| uk | `tut.s3.body` | «ЇСТИ», а кнопка HUD «ЇЖ» | …натисніть ЇЖ (E)… |
| hi | `tip.cyst` | глоссарий: подсказка «सिस्ट» (циста), а кнопка HUD — «बीजाणु» (спора) | बीजाणु |
| hi | `aria.cyst` | то же в подписи для экранного диктора | बीजाणु (R) |
| hi | `tut.s1.body` | «जीवाणु» = бактерия, а не микроб | आप तालाब में एक सूक्ष्मजीव हैं।… |
| hi | `cam.followToast / cam.tip` | «FOLLOW» не переведено | कैमरा: पीछा करें |
| hi | `x.wasdSwimLmbCursorRmbTargetWheel` | LMB/RMB — английские сокращения кнопок мыши | <kbd>बायाँ क्लिक</kbd> … <kbd>दायाँ क्लिक</kbd> |
| ja | `tip.cyst` | глоссарий: подсказка «シスト» (циста), а кнопка HUD — «胞子» (спора) | 胞子 |
| ja | `aria.cyst` | то же в подписи для экранного диктора | 胞子 (R) |
| ja | `x.wasdSwimLmbCursorRmbTargetWheel` | LMB/RMB — английские сокращения кнопок мыши | <kbd>左クリック</kbd> … <kbd>右クリック</kbd> |
| ko | `tip.cyst` | глоссарий: подсказка «낭포» (циста), а кнопка HUD — «포자» (спора) | 포자 |
| ko | `aria.cyst` | то же в подписи для экранного диктора | 포자 (R) |
| ko | `x.wasdSwimLmbCursorRmbTargetWheel` | LMB/RMB — английские сокращения кнопок мыши | <kbd>좌클릭</kbd> … <kbd>우클릭</kbd> |
| th | `tip.cyst` | глоссарий: подсказка «ซิสต์» (циста), а кнопка HUD — «สปอร์» (спора) | สปอร์ |
| th | `aria.cyst` | то же в подписи для экранного диктора | สปอร์ (R) |
| th | `x.wasdSwimLmbCursorRmbTargetWheel` | LMB/RMB — английские сокращения кнопок мыши | <kbd>คลิกซ้าย</kbd> … <kbd>คลิกขวา</kbd> |
| zh-TW | `tip.cyst` | глоссарий: подсказка «胞囊» (циста), а кнопка HUD — «孢子» (спора) | 孢子 |
| zh-TW | `aria.cyst` | то же в подписи для экранного диктора | 孢子 (R) |
| zh-TW | `x.wasdSwimLmbCursorRmbTargetWheel` | LMB/RMB — английские сокращения кнопок мыши | <kbd>左鍵</kbd> … <kbd>右鍵</kbd> |
| bn | `tip.cyst` | глоссарий: подсказка «সিস্ট» (циста), а кнопка HUD — «স্পোর» (спора) | স্পোর |
| bn | `aria.cyst` | то же в подписи для экранного диктора | স্পোর (R) |
| bn | `loc.glide` | «পিচ্ছিল» = «скользкий» (прилагательное) | পিছলে চলা |
| bn | `loc.sessile` | «স্থিতবাসী» — неестественно | আটকে থাকা |
| bn | `x.wasdSwimLmbCursorRmbTargetWheel` | LMB/RMB — английские сокращения кнопок мыши | <kbd>বাম ক্লিক</kbd> … <kbd>ডান ক্লিক</kbd> |

## Для разработчика также
- `tools\i18n\critic.schema.json`: в `role.enum` нет "analyst" (critic_check его принимает, схема — нет) → добавить "analyst" и `"input_sha256"` оставить object.
- После правок: пакеты круга 6 только по изменённым языкам + новый sha; аналитик пересмотрит.
