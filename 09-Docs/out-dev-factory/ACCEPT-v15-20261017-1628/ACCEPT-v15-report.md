# ACCEPT-v15 — приёмка аналитиком 17.10.2026 16:28–16:47 (UTC+3)
HEAD 4ad66b4, dirty 821. Стенд `http://127.0.0.1:8795/` (`tools/serve-static.mjs`, корень проекта). Все процессы — скрытые окна (`Start-Process -WindowStyle Hidden`).

## Тесты
- npm test: 285/285, exit 0 — `npm-test.log`
- run-all-tests.ps1: 412/415 (fail: hud_contract [en]/[hi] E x4; report.V4) — `run-all-tests.log`, `09-Docs\test-runs\results-20261017-1629.json`

## Таблица 1. Снимки (копия: C:\Users\Space\agent-transfer\igraspore-accept-1628\)
| файл | что | результат | URL |
|---|---|---|---|
| 01-start-menu-fil.png | старт fil | 🟢 SIMULA | http://127.0.0.1:8795/?lang=fil |
| 01-start-menu-tr.png | старт tr | 🟢 BAŞLA | http://127.0.0.1:8795/?lang=tr |
| 01-start-menu-es.png | старт es | 🟢 EMPEZAR | http://127.0.0.1:8795/?lang=es |
| 02-fil-tip-divide-Hati.png | #bDiv title | 🟢 «Hati» | http://127.0.0.1:8795/?lang=fil |
| 03-tr-gameover-dTip-temp.png | экран гибели, причина «Sıcaklık» | 🟢 «İpucu: Termometreyi izle…» | http://127.0.0.1:8795/?lang=tr |
| 04-tr-hover-tempL.png | hover термометра | 🟡 #tempL нет в DOM; tt(tip.tempL)=«Su sıcaklığı…» | http://127.0.0.1:8795/?lang=tr |
| 05-fil-wiki-article.png | вики fil | 🟢 «Berde (pagkain)…» | http://127.0.0.1:8795/?lang=fil |
| 06-tr-pause-menu.png | пауза tr | 🟢 DURAKLATILDI/DEVAM/AYARLAR/VİKİ | http://127.0.0.1:8795/?lang=tr |
| 07-mobile-390x844-menu-fil.png | мобайл fil | 🟢 0 ошибок | http://127.0.0.1:8795/?lang=fil |
| 08-mobile-390x844-game-tr.png | мобайл игра tr | 🟢 0 ошибок | http://127.0.0.1:8795/?lang=tr |
| 09-mobile-390x844-menu-es.png | мобайл es | 🟢 0 ошибок | http://127.0.0.1:8795/?lang=es |
| 10-language-list.png | список языков | 🟡 17, es/tr/fil нет (X3 не сделан) | http://127.0.0.1:8795/?lang=en |
Консоль десктоп: 3× 404 шрифтов; мобайл: 0.
