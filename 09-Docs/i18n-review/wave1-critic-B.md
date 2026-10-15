# iGraSpore wave 1 — critic B, round 1

Date: 2026-10-14. Model: agent-run-B. Independent of critic A (those files were not opened). Dictionaries were not edited. Languages were not enabled.

Source: `C:\Obsidian\New\Projects\08-iGraSpore_V2\.04-Src\i18n\en.json` (91 keys). Compared with `pt-BR.json`, `es.json`, `hi.json`, `id.json`, `tr.json`, `de.json`, `fr.json`, `ja.json`.

Raw scores: `C:\Obsidian\New\Projects\08-iGraSpore_V2\09-Docs\i18n-review\raw\wave1-critic-B-round1.json`

Pass is the average of five axes, 8 or more. A pass with notes is not a clean file: every note below is a real error to fix before enable.

## Scores

| Code | Meaning | Glossary | Natural | Length | Params | Score | Verdict |
|---|---:|---:|---:|---:|---:|---:|---|
| pt-BR | 7 | 9 | 8 | 9 | 10 | 8.6 | pass, fix notes |
| es | 6 | 7 | 7 | 9 | 10 | 7.8 | fail |
| hi | 6 | 9 | 7 | 8 | 10 | 8.0 | pass, fix notes before enable |
| id | 7 | 9 | 7 | 9 | 10 | 8.4 | pass, fix notes |
| tr | 7 | 8 | 7 | 9 | 10 | 8.2 | pass, fix notes |
| de | 8 | 9 | 8 | 8 | 10 | 8.6 | pass, fix notes |
| fr | 8 | 9 | 9 | 8 | 10 | 8.8 | pass, fix notes |
| ja | 8 | 8 | 7 | 9 | 10 | 8.4 | pass, fix notes |

Only **es** is under 8. **hi** clears 8.0 only because glossary, length, and params are strong. The menu subtitle and the cooldown unit are still wrong on live screens.

## How the axes were scored

- Meaning: does the player get the English game sense, not just a dictionary gloss.
- Glossary: spore on the button and the enter/exit toasts; cyst on the hunger toast; divide; eat; energy; producer as greens; consumer 1/2 as eaters. Consumer 3 stays “hunters”, matching English.
- Natural: friendly informal where that is the norm (pt-BR você, es/fr/de tú/tu/du, hi तुम, id kamu, tr sen). Japanese has no ты; plain imperative is the bar.
- Length: action labels are `white-space:nowrap` at 15px/800. On 390px the bar is about 370px and wraps. A single label should stay under ~160px. Settings rows are 340px. Nothing clips. Docks are for labels that are tight, not for overflow.
- Params: `{cur}`, `{need}`, `{sec}` sets were compared to English by script. 0 mismatches, 91/91 keys, no empty strings. Params is 10 for every language.

## pt-BR — 8.6 pass

Glossary holds: esporo / cisto, dividir, comer, energia, verdes, comedores. Register is consistent você. Buttons fit (DIVIDIR, ESPORO, COMER, LUZ).

| Key | Problem | Fix |
|---|---|---|
| gameTime | Hora is an hour. The value is elapsed seconds. | Tempo |
| clear | Limpo means clean. The sun row is clear weather. | Claro |
| healthBars | Barras does not say health. | Barras de vida |
| eaten | Comido means was eaten. The stat is prey the player ate. | Presas |
| dead | EXTINÇÃO is the noun. | EXTINTO |

## es — 7.8 fail

Spore/cyst, energy, greens, and comedores are right. The divide button is DIVIDIR. The goal line, which stays on screen, is not.

| Key | Problem | Fix |
|---|---|---|
| hud.goal | Diviédete is not the imperative of dividir. The accent makes it look like divertirse (have fun) or like a typo. This is the glossary break. | Divide: {cur}/{need} |
| gameTime | Hora is an hour, value is seconds. | Tiempo |
| toast.cyst.hunger | te hiciste quiste is not Spanish. | Hambre: te enquistaste — busca comida y despierta |
| healthBars | Barras drops health. | Barras de vida |
| eaten | Comido is passive. The stat is prey eaten by the player. | Presas |
| dead | EXTINCIÓN is the noun. | EXTINTO |
| dStarve | Hambre is hunger, not starved. Not on screen yet (death-cause rows are still hardcoded English). | Inanición |

Do not “fix” Diviédete to Diviértete.

## hi — 8.0 pass, not clean

Fixed terms hold: बीजाणु / सिस्ट, बाँटो and विभाजन, खाओ, ऊर्जा, हरे (भोजन), खाने वाले. खाया on the eaten stat correctly stays active, unlike the European passive copies. Two live strings are still wrong, and they are why meaning is 6.

| Key | Problem | Fix |
|---|---|---|
| menuSub | कटाव means erosion, not a pond cross-section. | सूक्ष्मजीव सिमुलेशन — 100 प्रजातियाँ + वायरस। तालाब की अनुप्रस्थ काट। |
| hud.divide.reason.cd | से means from, not seconds. Shows whenever divide is on cooldown. | ठहराव {sec} सेकंड |
| healthBars | पट्टियाँ means strips or bandages. | HP बार |
| resume | जारी is not a verb. | जारी रखो |
| close | बंद means closed. | बंद करो |
| toast.cyst.hunger | बन गए is आप/plural; ढूँढो and जागो are तुम. | भूख: सिस्ट बन गया — भोजन ढूँढो और जागो |
| dead | विलुप्ति is the noun. | विलुप्त |

Length 8, not a clip: रोशनी plus the sun prefix is the widest plant button and still fits one action key. Do not enable until the subtitle and the cooldown unit are fixed.

## id — 8.4 pass

Glossary holds: spora / kista, belah, makan, energi, hijau, pemakan. kamu is consistent. Kelaparan vs Lapar correctly splits starved and hungry.

| Key | Problem | Fix |
|---|---|---|
| hud.divide.reason.cd | d is not detik. | jeda {sec} dtk |
| dCauses | Penyebab mati is broken grammar. This header is live. | Penyebab kematian |
| healthBars | Batang is a rod or stem. | Bar nyawa |
| eaten | Dimakan means was eaten. | Mangsa |
| toast.eat.ok | Makan does not mean Ate, and it copies the button. | Sudah makan |
| dAge | Tua means old, not old age. Not on screen yet. | Usia tua |

## tr — 8.2 pass

Spore/cyst, BÖL, YE, enerji, yeşiller, and yiyiciler are in place. İ/ı in IŞIK, BAŞLA, İlkbahar, VİKİ, TÜKENDİ is correct. Buttons are short. Glossary is 8, not 9, because the eat-death word uses the defeat verb.

| Key | Problem | Fix |
|---|---|---|
| dead | TÜKENDİ means depleted or sold out, not extinct. Live death title. | NESLİ TÜKENDİ |
| dEaten | Yenildi primarily means was defeated. Not on screen yet. | Yenmiş |
| resume | SÜR means drive. | DEVAM |
| paused | DURAKLAT is a command, not the paused state. | DURAKLATILDI |
| healthBars | Çubuklar drops health. | Can çubukları |

## de — 8.6 pass

Spore/Zyste, TEIL/Teilung, FRESS/Fresser, Energie, Grüne are consistent. du toasts are natural. AUSGESTORBEN is the right death title. EINSTELLUNGEN is long but fits the 390px menu row (~300px with SO GEHT'S and WIKI). Length 8 for that tightness, not for a clip.

| Key | Problem | Fix |
|---|---|---|
| close | ZU does not say close. The close control sits alone, so the longer word fits. | SCHLIESSEN |
| healthBars | Balken drops health. | Lebensbalken |
| eaten | Gefressen collides with the death-cause word and reads as was devoured. | Beute |
| dAge | Alter is also the age stat. English splits them. Not on screen yet. | Altersschwäche |

## fr — 8.8 pass

Best register in the set: tu throughout, spore/kyste agreement (protégée), and the French space before the colon. DIVISER and LUMIÈRE are the longest action labels (~110–120px). They wrap the bar; they do not overflow one key. Length 8 for that, not for a clip.

| Key | Problem | Fix |
|---|---|---|
| gameTime | Heure is a clock hour. The value is seconds. | Temps |
| healthBars | Barres drops health. | Barres de vie |
| eaten | Mangé means was eaten. | Proies |

## ja — 8.4 pass

胞子 / シスト, 分裂, 食べる, エネルギー, and 緑（えさ） hold. 食べた vs 食べられた correctly splits the stat and the death cause. Buttons are short. Natural is 7 because the species chips do not say eater.

| Key | Problem | Fix |
|---|---|---|
| gameTime | 時刻 is clock time. | 時間 |
| consumer1 | 小さな食べる側 is translationese, not eater. | 小さな食者 |
| consumer2 | Same calque. | 中くらいの食者 |
| healthBars | バー drops health. | 体力バー |
| toast.eat.closer | 近づいた is already done. The English line is a prompt to get closer. | 獲物にもっと近づけ |

consumer3 大きな狩人 correctly follows Big hunters. Do not rewrite it to 食者.

## Not dictionary bugs

These are in code, not in the eight json files. They are listed so a dictionary fix is not mistaken for a screen fix.

- Death-cause row labels still use hardcoded `DLAB_EN` unless the language is Russian. `dStarve`, `dEaten`, `dAge`, `dLysis`, `dTemp` are not what the death chart shows today. `dCauses` is live, then the code appends ` (Global)`.
- `bDiv`, `bCyst`, and `bAuto` are still labeled with hardcoded Russian in `main.js`. Eat/light short labels do come from the dictionary.
- Divide and eat success toasts in `main_events.js` are still hardcoded Russian, so `toast.divide.go`, `toast.eat.ok`, `toast.eat.none`, and `toast.eat.closer` are dictionary-only for now.

## Nits, not scored as errors

- pt-BR menuSub uses lago (lake) for pond. lagoa is tighter. Not required.
- tr menuSub and wikiT use göl (lake). gölet is the pond. Not required.
- de/tr/ja parenthetical on greens is fodder (Futter / yem / えさ) rather than food. Acceptable in this game.
- ja autoOn is オート and the button is 自動. Both mean auto. Prefer 自動 on both.
- fr ÉTEINT can also mean switched off. In a species death title it is the normal word for extinct. Left as is.
