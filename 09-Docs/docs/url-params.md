# URL Parameters Contract

**Version**: 1.0 (TZ-08 Stage 1)  
**Date**: 2026-11-06  
**Status**: Active

## Overview

iGraSpore supports URL parameters for direct screen access, language forcing, and theme application. These parameters enable shareable links that reproduce specific game states without manual navigation.

## Parameters

### `?lang={code}` — Force Language

**Purpose**: Override language selection from URL  
**Values**: Any enabled language code from `languages.json` (91 languages)  
**Priority**: URL parameter > localStorage > browser language  
**Persistence**: Does NOT write to localStorage (URL-only override)  
**Example**: `?lang=ar` opens game in Arabic with RTL layout

**Behavior**:
- If language exists and is enabled: applies immediately
- If language doesn't exist or is disabled: falls back to English
- Empty `?lang=` parameter: falls back to English
- Works with RTL languages (ar, he, fa, ur, ps, ckb, sd) — sets `dir="rtl"` on `<html>`

**Implementation**: `i18n_detect.js` reads parameter, `ui_screens.js` applies language pack

---

### `?theme={id}` — Force Theme

**Purpose**: Apply specific visual theme from URL  
**Values**: One of 7 theme IDs:
- `classic` (default)
- `engraving`
- `neon-bio`
- `phase-contrast`
- `haeckel-watercolor`
- `glass-lab`
- `cyberpunk-scanner`

**Priority**: URL parameter > localStorage > default  
**Persistence**: Does NOT write to localStorage (URL-only override)  
**Example**: `?theme=engraving&screen=game` opens game with engraving theme

**Implementation**: `theme_engine.js` reads parameter via `__IGS_FORCE_THEME__`

---

### `?screen={name}` — Direct Screen Access

**Purpose**: Open specific screen/overlay without clicks  
**Values**: 12 screen identifiers (case-insensitive)

| Screen | Value | Target | Type |
|--------|-------|--------|------|
| Menu | `menu` | `#menuO` | Overlay |
| Game | `game` | (all overlays hidden) | State |
| Pause | `pause` | `#pauseO` | Overlay |
| Settings | `settings` | `#setO` | Overlay |
| Wiki | `wiki` | `#wikiO` | Overlay |
| Bestiary | `bestiary` | `#wikiO` (scroll to fauna) | Overlay |
| Themes | `themes` | Theme panel widget | UI State |
| Help | `help` | `#helpO` | Overlay |
| Death | `dead` | `#deadO` | Overlay |
| Intro | `intro` | `#introO` | Overlay |
| Burger Menu | `burger` | `#burgerGame` click | UI State |
| Eco Panel | `eco` | `#ecoP` toggle | UI State |

**Behavior**:
- Unknown value: ignored, `console.info('unknown screen: {value}')`
- `game`: closes all overlays, shows canvas
- Overlays: hides all other overlays, shows target
- UI states: triggers associated action (click/toggle)

**Example**: `?screen=wiki&lang=ru` opens wiki overlay in Russian

**Implementation**: `index.html` inline script (lines 284-383)

---

### `?qa={flag}` — QA Mode

**Purpose**: Enable testing gates  
**Values**: `1` (enabled) or omitted (disabled)  
**Example**: `?qa=1` enables QA testing features

**Implementation**: Various test hooks check this parameter

---

## Canonical Link Format

For screenshot reports and shareable links, use this format:

```
http://127.0.0.1:8794/index.html?lang={XX}&theme={YY}&screen={ZZ}
```

Where:
- `{XX}` = 2-3 letter language code (e.g., `en`, `ru`, `ar`, `zh-CN`)
- `{YY}` = theme ID (optional, omit for default)
- `{ZZ}` = screen name (optional, omit for game state)

**Examples**:
- `http://127.0.0.1:8794/index.html?lang=ar&screen=wiki` — Arabic wiki
- `http://127.0.0.1:8794/index.html?theme=engraving&screen=game` — Engraving theme gameplay
- `http://127.0.0.1:8794/index.html?lang=ru&screen=settings` — Russian settings

---

## Parameter Priority

1. **URL parameters** (highest priority, session-only)
2. **localStorage** (persistent user preferences)
3. **Browser defaults** (language from `navigator.language`, default theme)

URL parameters do NOT overwrite localStorage. They provide temporary overrides for sharing/testing.

---

## Testing

### Manual Test
```bash
# Open specific screen
start http://127.0.0.1:8794/index.html?screen=wiki

# Open with language
start http://127.0.0.1:8794/index.html?lang=ar&screen=menu

# Open with theme
start http://127.0.0.1:8794/index.html?theme=neon-bio&screen=game
```

### Automated Test (Playwright)
```javascript
// Verify screen parameter opens correct overlay
await page.goto('http://127.0.0.1:8794/index.html?screen=wiki');
await page.waitForSelector('#wikiO.show');

// Verify language parameter applies
await page.goto('http://127.0.0.1:8794/index.html?lang=ar');
const dir = await page.evaluate(() => document.documentElement.dir);
expect(dir).toBe('rtl');
```

---

## Implementation Notes

- **No localStorage writes**: URL parameters are session-only overrides
- **Graceful degradation**: Unknown values logged but don't break the game
- **RTL support**: Arabic/Hebrew/Persian/etc. automatically set `dir="rtl"`
- **Theme persistence**: Theme applied to pond and bestiary immediately
- **Screen timing**: Applied after DOM ready (100ms delay for game init)

---

## Related Files

- `index.html` (lines 284-383): Screen parameter handler
- `.04-Src/js/i18n_detect.js`: Language parameter reader
- `.04-Src/js/theme_engine.js`: Theme parameter reader
- `.04-Src/js/ui_screens.js`: Language application logic
- `.04-Src/i18n/languages.json`: Enabled language list

---

## Changelog

- **2026-11-06**: Initial documentation (TZ-08 Stage 1)
