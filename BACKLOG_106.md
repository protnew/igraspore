# iGraSpore V2 — Полный бэклог (106 пунктов)

> Сгенерировано: 2026-07-21
> Источник: 3-критик аудит (QA + UX + Biology) + ручной код-ревью

## Статистика
- **Critical**: 1
- **High**: 17
- **Medium**: 54
- **Low**: 34
- **Всего**: 106

---

## 🔴 CRITICAL (1)

| ID | Category | Description | Fix |
|----|----------|-------------|-----|
| PERF-001 | Performance | O(n²) collision detection — каждый организм проверяет всех | Spatial hash grid |

## 🟠 HIGH (17)

| ID | Category | Description | Fix |
|----|----------|-------------|-----|
| MOV-001 | Movement | Игрок не может двигаться в режиме autoAI | WASD отменяет autoAI |
| MOV-006 | Movement | Игрок движется в world coords, мышь в screen — рассинхрон при zoom | Проверить transform |
| UI-001 | UI | Energy bar без цветовой индикации | Dynamic color |
| UI-003 | UI | Нет индикатора 'кого можно съесть' | Highlight edible |
| UI-008 | UI | Нет health bar над организмами | Show at zoom>5 |
| UI-012 | UI | Death screen может не появляться (deadO) | Verify |
| BIO-001 | Biology | Продуценты производят O2 даже ночью | if(isDay) |
| BIO-004 | Biology | Cyst не защищает от вирусов | Cyst = immunity |
| BIO-008 | Biology | Decomposers не едят мёртвых | Eat dead orgs |
| VIS-001 | Visual | Организмы рендерятся вне экрана | Viewport culling |
| VIS-002 | Visual | Нет LOD | LOD system |
| VIS-003 | Visual | 6 createRadialGradient на организм | Cache gradients |
| PERF-002 | Performance | renderOrganisms без viewport check | Only render visible |
| PERF-003 | Performance | updateOrg auto-eat каждый кадр | Spatial partitioning |
| PERF-008 | Performance | Minimap рисует ВСЕ организмы | Sample-only |
| CODE-002 | Code | Нет unit тестов для biology.js | Vitest tests |
| CODE-012 | Code | Нет git tags/releases | Tag releases |
| SAVE-001 | Save | Нет save/load | localStorage |

## 🟡 MEDIUM (54) — см. полный список ниже
## 🟢 LOW (34) — см. полный список ниже

---

## Все 106 пунктов

| ID | Sev | Cat | Description |
|----|-----|-----|-------------|
| CAM-001 | Med | Camera | Camera lerp 0.35 может быть слишком быстр при низком FPS |
| CAM-002 | Low | Camera | Нет smooth zoom |
| CAM-003 | Med | Camera | Free cam не возвращается к игроку при V |
| CAM-004 | Low | Camera | Нет min zoom limit в free cam |
| CAM-005 | Med | Camera | Камера может выйти за границы мира |
| MOV-001 | High | Movement | Игрок не может двигаться в autoAI |
| MOV-002 | Med | Movement | Нет ускорения/инерции |
| MOV-003 | Med | Movement | Diagonal movement не нормализован |
| MOV-004 | Low | Movement | Нет touch controls |
| MOV-005 | Med | Movement | Right-click move target не отменяется |
| MOV-006 | High | Movement | World/screen coords рассинхрон при zoom |
| MOV-007 | Med | Movement | Parasitic inversion без UI warning |
| MOV-008 | Low | Movement | Нет звука движения |
| MOV-009 | Med | Movement | Нет UI speed indicator |
| MOV-010 | Low | Movement | Нет boost/спринта |
| UI-001 | High | UI | Energy bar без цвета |
| UI-002 | Med | UI | HUD перегружен |
| UI-003 | High | UI | Нет highlight добычи |
| UI-004 | Med | UI | Кнопки слишком мелкие |
| UI-005 | Med | UI | Нет tooltip на организмах |
| UI-006 | Low | UI | Легенда не обновляется |
| UI-007 | Med | UI | Pop graph нечитаем при 100+ видов |
| UI-008 | High | UI | Нет health bar над организмами |
| UI-009 | Med | UI | TOD slider без обратной связи |
| UI-010 | Low | UI | Scale bar некорректен при zoom<1 |
| UI-011 | Med | UI | Wiki без визуальных органов |
| UI-012 | High | UI | Death screen (deadO) |
| UI-013 | Med | UI | Нет Restart в death screen |
| UI-014 | Low | UI | Speed не запоминается |
| UI-015 | Med | UI | Нет fullscreen |
| BIO-001 | High | Biology | O2 производится ночью |
| BIO-002 | Med | Biology | Вирусы без latent period |
| BIO-003 | Med | Biology | Нет мутаций |
| BIO-004 | High | Biology | Cyst не защищает от вирусов |
| BIO-005 | Med | Biology | Нет симбиоза |
| BIO-006 | Low | Biology | Нет апоптоза |
| BIO-007 | Med | Biology | Нет биоплёнки |
| BIO-008 | High | Biology | Decomposers не едят мёртвых |
| BIO-009 | Med | Biology | Нет сезонного оборота видов |
| BIO-010 | Low | Biology | Размер не влияет на метаболизм |
| BIO-011 | Med | Biology | Нет полового размножения |
| BIO-012 | Low | Biology | Нет HGT |
| BIO-013 | Med | Biology | Нет pH/pollution |
| BIO-014 | Low | Biology | Нет Q10 |
| BIO-015 | Med | Biology | Хищники без предпочтений в добыче |
| VIS-001 | High | Visual | Нет viewport culling |
| VIS-002 | Med | Visual | Нет LOD |
| VIS-003 | High | Visual | 6 radial gradients на организм |
| VIS-004 | Med | Visual | Тени органелл при zoom<3 |
| VIS-005 | Low | Visual | Нет motion blur |
| VIS-006 | Med | Visual | Частицы без физики |
| VIS-007 | Low | Visual | Bubbles прямые |
| VIS-008 | Med | Visual | Sun rays статичны |
| VIS-009 | Low | Visual | Нет преломления |
| VIS-010 | Med | Visual | Цвет воды |
| VIS-011 | Low | Visual | Нет каустики |
| VIS-012 | Med | Visual | Микроскоп без blur |
| VIS-013 | Low | Visual | Realistic vignette слабый |
| VIS-014 | Med | Visual | Нет noise в realistic |
| VIS-015 | Low | Visual | Биолюм один цвет |
| PERF-001 | Crit | Performance | O(n²) collisions |
| PERF-002 | High | Performance | renderOrganisms без culling |
| PERF-003 | High | Performance | auto-eat каждый кадр |
| PERF-004 | Med | Performance | popHist рост |
| PERF-005 | Med | Performance | dmgIndicators не очищаются |
| PERF-006 | Med | Performance | parts без лимита |
| PERF-007 | Low | Performance | Нет requestIdleCallback |
| PERF-008 | High | Performance | Minimap рисует всех |
| PERF-009 | Med | Performance | Нет WebGL |
| PERF-010 | Med | Performance | shoreCache на resize |
| PERF-011 | Low | Performance | JSON.stringify |
| PERF-012 | Med | Performance | speciesPop рост |
| PERF-013 | Low | Performance | Нет Web Worker |
| PERF-014 | Med | Performance | Font rendering каждый кадр |
| PERF-015 | Low | Performance | Нет dt cap |
| CODE-001 | Med | Code | Globals без var |
| CODE-002 | High | Code | Нет unit тестов |
| CODE-003 | Med | Code | Magic numbers |
| CODE-004 | Low | Code | Нет JSDoc |
| CODE-005 | Med | Code | Inline styles |
| CODE-006 | Low | Code | Нет error boundary |
| CODE-007 | Med | Code | Hardcoded difficulty |
| CODE-008 | Low | Code | Нет version |
| CODE-009 | Med | Code | i18n смешан |
| CODE-010 | Low | Code | CSS в HTML |
| CODE-011 | Med | Code | Нет build step |
| CODE-012 | High | Code | Нет tags |
| CODE-013 | Low | Code | Functions too long |
| CODE-014 | Med | Code | Deep nesting |
| CODE-015 | Low | Code | Dead code (locomotion.js) |
| AUD-001 | Med | Audio | initAudio policy |
| AUD-002 | Low | Audio | Нет ambient music |
| AUD-003 | Med | Audio | Нет звука деления |
| AUD-004 | Low | Audio | Нет звука смерти |
| AUD-005 | Med | Audio | Нет volume control |
| AUD-006 | Low | Audio | Нет stereo |
| SAVE-001 | High | Save | Нет save/load |
| SAVE-002 | Med | Save | Не сохраняются настройки |
| SAVE-003 | Med | Save | Не сохраняется high score |
| SAVE-004 | Low | Save | Нет screenshot |
| SAVE-005 | Med | Save | Не сохраняется язык |
| A11Y-001 | Med | A11Y | Нет keyboard nav |
| A11Y-002 | Med | A11Y | Нет ARIA labels |
| A11Y-003 | Low | A11Y | Нет colorblind mode |
| A11Y-004 | Low | A11Y | Font 9px слишком мелко |
| A11Y-005 | Med | A11Y | Нет reduced-motion |
