# Wave 1 critic A — round 1

Date: 2026-10-14. Dictionaries only (no edits, languages not enabled). Score = mean of meaning, glossary, natural informal you-form, button length, params. Pass ≥ 8. Length is from character counts (HUD short ≤ 8 Latin / ~4 CJK), not from 390×844 screenshots.

Glossary checked when English uses the idea: spore/cyst, divide, eat, energy, producer/greens, consumer/eater. All 91 keys present. `{cur}` `{need}` `{sec}` match English in every language (params 10).

| code | score | pass | meaning | glossary | natural | length | params |
|---|---:|:---:|---:|---:|---:|---:|---:|
| pt-BR | 9.0 | yes | 7 | 10 | 9 | 9 | 10 |
| es | 7.8 | no | 6 | 5 | 9 | 9 | 10 |
| hi | 7.4 | no | 6 | 6 | 8 | 7 | 10 |
| id | 9.2 | yes | 8 | 10 | 9 | 9 | 10 |
| tr | 7.8 | no | 6 | 8 | 7 | 8 | 10 |
| de | 8.8 | yes | 8 | 10 | 8 | 8 | 10 |
| fr | 9.2 | yes | 8 | 10 | 9 | 9 | 10 |
| ja | 7.8 | no | 7 | 8 | 7 | 7 | 10 |

Turkish `IŞIK`, `NASIL`, `VİKİ`, `İlkbahar` dotted-I orthography is correct. Do not rewrite `IŞIK` to `İŞIK`.

## Below 8

### es — 7.8

| key | problem | fix |
|---|---|---|
| hud.goal | Diviértete = have fun, not Divide. Core glossary verb missing on the goal line. | Divide: {cur}/{need} |
| gameTime | Hora = clock hour; stat is elapsed seconds. | Tiempo |
| dead | Noun extinction, not the extinct state. | EXTINTO |
| restart | OTRA VEZ is only "again". | REINICIAR |

### hi — 7.4

| key | problem | fix |
|---|---|---|
| hud.btn.divide | बाँटो = share, not cell division (विभाजन). | विभाजन |
| hud.btn.divide.short | Same wrong verb; short form was not shortened to a divide word. | विभाजन |
| hud.goal | बाँटो: 1/3 reads as share, not divide. | विभाजन: {cur}/{need} |
| menuSub | कटाव = erosion, not cross-section. | तालाब का काट |
| hud.divide.reason.cd | से reads as the postposition "from", not seconds. | इंतज़ार {sec} सेक |
| healthBars | पट्टियाँ = bandages, not health bars. | हेल्थ बार |
| resume | जारी = ongoing, not resume. | जारी रखो |
| close | बंद = closed/off, not close. | बंद करो |
| dead | विलुप्ति = noun, not extinct. | विलुप्त |

### tr — 7.8

| key | problem | fix |
|---|---|---|
| resume | SÜR = drive, not resume. | DEVAM |
| paused | DURAKLAT is the command "pause it", not the status. | DURAKLATILDI |
| dead | TÜKENDİ = depleted, not extinct. | YOK OLDUN |
| dEaten | Yenildi reads as defeated, not eaten. | Yem oldu |
| help | 13 characters; may wrap. | NASIL OYNA |
| menuSub | Göl = lake, not pond. | Gölet kesiti |

### ja — 7.8

| key | problem | fix |
|---|---|---|
| gameTime | 時刻 = clock time, not elapsed time. | 時間 |
| toast.eat.closer | Past "already approached", not the order to get closer. | 獲物にもっと近づけ |
| consumer1 | 食べる側 is not the eater noun. | 小さな食べ手 |
| consumer2 | Same calque, too long for a filter chip. | 中型の食べ手 |
| hud.divide.reason.energy | エネルギー is correct glossary but wide on the reason chip. Do not replace with 元気. | keep エネルギー {cur}/{need} |

## Pass nits (still in the raw JSON)

| code | key | fix |
|---|---|---|
| pt-BR | clear | Claro |
| pt-BR | gameTime | Tempo |
| pt-BR | menuSub | Corte da lagoa |
| id | hud.divide.reason.cd | jeda {sec} dtk |
| id | toast.eat.ok | Sudah makan |
| id | decomposer | Pembersih (jamur) |
| de | close | SCHLIESSEN |
| de | set | OPTIONEN |
| de | restart | NOCHMAL |
| fr | gameTime | Temps |
| fr | toast.eat.ok | Tu as mangé |

Raw: `C:\Obsidian\New\Projects\08-iGraSpore_V2\09-Docs\i18n-review\raw\wave1-critic-A-round1.json`
