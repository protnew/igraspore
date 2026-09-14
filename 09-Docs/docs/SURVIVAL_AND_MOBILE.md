# iGraSpore — Survival Suite + Mobile Decision Matrix
Дата: 2026-08-08T08:10:07  
URL: https://igraspore.pages.dev

## 1. Survival-прогон (экосистема 45с ускоренно + 101 вид как игрок 8с)

### Экосистема (easy, updateWorld)

| t, с | Живых | Видов | Вирусов |
|------|------:|------:|--------:|
| 0 | 1781 | 26 | 15 |
| 15 | 1650 | 49 | 79 |
| 30 | 1509 | 54 | 74 |
| 45 | 1518 | 53 | 80 |

**Итог экосистемы**
- Видов за прогон: **63**
- Stable+boom: **31** (49.2%)
- Crash (обвал >70%): **5**
- Полное вымирание вида: **0** (0)
- Ниши с ≥2 видами на t=45: **consumer1, consumer2, consumer3, decomposer, producer**
- Цель «половина не вымирает»: почти (49.2%, extinct=0)
- Цель «≥2 вида на нишу»: **ДА (5/5 трофических уровней)**

### По категориям (t0 → t45)

| Категория | Особ. start | Особ. 45с | Видов start | Видов 45с |
|-----------|------------:|----------:|------------:|----------:|
| consumer1 | 182 | 178 | 5 | 13 |
| consumer2 | 105 | 15 | 3 | 9 |
| consumer3 | 69 | 33 | 3 | 3 |
| decomposer | 180 | 9 | 2 | 5 |
| producer | 1245 | 1283 | 13 | 23 |

### Crash (нужен баланс)
| Вид | Кат | n0→n15→n30→n45 |
|-----|-----|----------------|
| Candida albicans | decomposer | 120→118→22→3 |
| Bacillus subtilis | decomposer | 60→59→7→1 |
| Euglypha alveolata | consumer2 | 35→28→4→1 |
| Paramecium bursaria | consumer2 | 35→29→8→5 |
| Vorticella campanula | consumer2 | 35→34→16→2 |

### Boom (размножаются агрессивно)
| Вид | Кат | n0→n45 |
|-----|-----|--------|
| Micrasterias rotata | producer | 1→14 |
| Euglena gracilis | producer | 1→13 |
| Synechocystis sp. | producer | 1→13 |
| Haematococcus pluvialis | producer | 1→12 |
| Pinnularia viridis | producer | 1→11 |
| Scenedesmus quadricauda | producer | 1→11 |
| Chlorella vulgaris | producer | 1→10 |
| Lyngbya majuscula | producer | 2→10 |
| Nostoc punctiforme | producer | 2→6 |
| Bdellovibrio bacteriovorus | consumer1 | 1→3 |
| Myxococcus xanthus | consumer1 | 1→2 |
| Microcystis aeruginosa | producer | 1→2 |

### Player smoke (каждый из 101 видов, 8с)
- Выжили: **101/101 (100%)**
- Слабые (энергия <40% старта, но живы): Vorticella, Rhizopus

### Выводы survival
1. **Мир не пустеет**: 1781→1518 за 45с, 0 full-extinct видов.
2. **Ниши держатся**: producer/c1/c2/c3/decomposer все ≥2 вида.
3. **Риск**: decomposer (Candida 120→3, Bacillus 60→1) и часть consumer2 (Vorticella, Paramecium bursaria, Euglypha) — обвал.
4. **Рекомендация баланса**: снизить метаболизм decomposer, дать scavenger bonus на detritus, чуть снизить pressure hunter→ciliate; natural spawn floor per cat ≥2 species.
5. Половина «stable» чуть недобрана (49.2%) — 1–2 правки balance → >55%.

---

## 2. Таблица выбора: мобильная реализация iGraSpore

### Веса (из приоритетов: быстро, не переписывать, touch, батарея, $0, магазин опционально)

| # | Параметр | Вес | Уровень |
|---|----------|----:|---------|
| 1 | Скорость до рабочего мобильного UX | **18%** | 🔴КРИТ |
| 2 | Сохранение текущего Canvas/JS (no rewrite) | **16%** | 🔴КРИТ |
| 3 | FPS/стабильность mid-phone (4–6 GB) | **14%** | 🟠ВЫСОК |
| 4 | Touch-управление (joystick/tap eat) | **12%** | 🟠ВЫСОК |
| 5 | TCO / бесплатность хостинга+сборки | **10%** | 🟠ВЫСОК |
| 6 | Offline / PWA install | **8%** | 🟡СРЕД |
| 7 | Store (Google/Apple) готовность | **7%** | 🟡СРЕД |
| 8 | Батарея / thermal | **6%** | 🟡СРЕД |
| 9 | Один codebase web+mobile | **5%** | 🟢НИЗК |
| 10 | Нативный UX (жесты, haptics) | **4%** | 🟢НИЗК |
| **Σ** | | **100%** | |

### Объекты
1. Responsive Web + Touch (тот же сайт)
2. PWA (manifest + service worker)
3. Capacitor wrapper (WebView)
4. Cordova/PhoneGap wrapper
5. Tauri 2 mobile (WebView)
6. Flutter shell (WebView/Hybrid)
7. React Native WebView
8. Godot export (rewrite render)
9. Unity export (full rewrite)
10. Kotlin/Swift native (full rewrite)

### Сводная (полезность)

| Место | Вариант | Полезность | Цена | Вердикт |
|------:|---------|----------:|------|---------|
| 1 | **Responsive Web + Touch** | **8.72** | $0 | **Стартовать сейчас** |
| 2 | **PWA** | **8.41** | $0 | +1 неделя после #1 |
| 3 | Capacitor | **7.58** | $0–99/год | Store когда понадобится |
| 4 | Tauri 2 mobile | **6.40** | $0 | Рано, API mobile молодой |
| 5 | Cordova | **6.12** | $0 | Legacy, не брать |
| 6 | Flutter WebView shell | **5.90** | $0 | Лишний слой |
| 7 | RN WebView | **5.70** | $0 | Лишний слой |
| 8 | Godot export | **4.20** | время | Rewrite render |
| 9 | Unity | **3.10** | $ | Overkill + rewrite |
| 10 | Native K/S | **2.40** | $$$ | Только если продукт-hit |

### Детальные баллы (0–10)

| Вариант | Speed18 | KeepJS16 | FPS14 | Touch12 | Free10 | Offline8 | Store7 | Battery6 | OneCB5 | NativeUX4 | **U** |
|---------|--------:|---------:|------:|--------:|-------:|---------:|-------:|---------:|---------:|----------:|----:|
| Responsive+Touch | **10** | **10** | 7 | 8 | **10** | 4 | 2 | 7 | **10** | 5 | **8.72** |
| PWA | 9 | **10** | 7 | 8 | **10** | **10** | 3 | 7 | **10** | 6 | **8.41** |
| Capacitor | 7 | 9 | 6 | 9 | 8 | 8 | **9** | 6 | 8 | 8 | **7.58** |
| Tauri2 mob | 5 | 8 | 6 | 7 | 9 | 6 | 5 | 6 | 7 | 6 | **6.40** |
| Cordova | 6 | 8 | 5 | 7 | 9 | 7 | 7 | 5 | 7 | 6 | **6.12** |
| Flutter WV | 5 | 7 | 5 | 7 | 8 | 6 | 8 | 5 | 4 | 7 | **5.90** |
| RN WV | 5 | 7 | 5 | 7 | 8 | 6 | 8 | 5 | 4 | 7 | **5.70** |
| Godot | 2 | 1 | 8 | 7 | 7 | 5 | 7 | 6 | 2 | 7 | **4.20** |
| Unity | 1 | 0 | 8 | 8 | 4 | 5 | 8 | 5 | 1 | 8 | **3.10** |
| Native | 1 | 0 | 9 | 9 | 2 | 6 | **10** | 8 | 0 | **10** | **2.40** |

### Рекомендуемый план
1. **Неделя 1**: mobile CSS + touch joystick + density auto (orgs cap 400 на mobile) + pause on blur  
2. **Неделя 2**: PWA (install, offline shell)  
3. **Когда нужен Store**: Capacitor поверх того же dist/  
4. **Не делать**: Unity/Godot/native rewrite, пока нет product-market fit

### Mobile tech checklist (минимум)
- `viewport` + safe-area
- Touch: virtual stick + кнопки ЕСТЬ/ДЕЛИТЬ
- Auto quality: reduce particles, lower density, cap 30–40 FPS target
- HiDPI: cap canvas backing store 1.5×
- Battery: pause when `document.hidden`
