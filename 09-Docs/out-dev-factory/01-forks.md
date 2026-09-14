# 01-forks - Arhitektor razvilok

Proekt: 08-iGraSpore_V2
Data: 2026-09-10
Rol: 01, vetka ANALIZ. writes_product: false
Kod / git ne menyalis.

Prufy etogo hoda:
- GET https://igraspore.pages.dev/ 200 n=17917 stamp=1786825630 demo-no-pop-no-floor canvas#c 34 script 04-Src/js/*.js?v=1786825630
- Disk index.html 17917b mtime 2026-08-15T23:27:10, spisok src bayt-v-bayt kak live
- GET /04-Src/js/biology_update_core.js 200 19041b; GET /.04-Src/js/biology_update_core.js 200 telo HTML 17917
- GET https://protnew.github.io/igraspore/ 200 n=34178 stamp=20260811172633 cursor-fix
- md5 .04-Src/js vs 04-Src/js: same 21, diff 13
- DECISIONS.md 1080b mtime 2026-08-06 D1 WebGL 176 > Three 165 > Canvas 84
- .04-Src/v3-webgl/est, v live index net

[DECISION MATRIX APPROVED. Pobeditel vyyavlen.]
**Winner:** A. Kanon rantayma = kornevoy index.html + skripty 04-Src/js (Canvas). D1 WebGL ne ispolnyat.
**Margin:** +13 k E (perekluchit index na .04-Src/js). A=172 E=159.

Kriterii (ves 1-3), ball 0-10. Summa vesov 22.

| Kriteriy (ves) | A Canvas+04-Src | B WebGL | C hybrid | D odin HTML | E index->.04 | F github.io |
|---|---|---|---|---|---|---|
| src v live index (3) | 10 | 1 | 2 | 0 | 3 | 2 |
| canvas#c (3) | 10 | 3 | 5 | 8 | 10 | 8 |
| Pages/file:// (2) | 8 | 4 | 4 | 10 | 4 | 3 |
| D1 176 vs 84 (1) | 2 | 10 | 8 | 2 | 2 | 2 |
| dva dereva ne razyedutsya (2) | 4 | 3 | 3 | 5 | 8 | 2 |
| D2 biology_update_core (2) | 9 | 4 | 4 | 2 | 9 | 5 |
| testy package.json (2) | 3 | 2 | 2 | 2 | 10 | 2 |
| APK/SW uzhe na Pages (2) | 6 | 3 | 3 | 4 | 5 | 2 |
| 100 vidov sim ne slomat (3) | 10 | 4 | 5 | 6 | 10 | 8 |
| agent otkroet vernoe derevo (2) | 10 | 2 | 2 | 5 | 8 | 2 |
| SCORE | 172 | 70 | 80 | 100 | 159 | 88 |

Kod rendera ne pisat.
