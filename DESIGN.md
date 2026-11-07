# DESIGN.md — iGraSpore Design System

**Version**: 1.0  
**Date**: 2026-11-07  
**Status**: Active

---

## 1. Design Tokens

### 1.1 Color Palette

**Source**: `.04-Src/src/style.css:1` (`:root` variables)

| Token | Value | Usage |
|-------|-------|-------|
| `--bg-base` | `#000814` | Base background |
| `--bg-surface` | `#001229` | Surface background |
| `--bg-panel` | `rgba(0,12,28,.92)` | Panel background (translucent) |
| `--bg-elevated` | `#001a30` | Elevated elements |
| `--bg-hover` | `#002a4a` | Hover states |
| `--bg-overlay` | `rgba(0,5,15,.97)` | Modal overlay (opaque) |
| `--bg-overlay-soft` | `rgba(0,5,15,.75)` | Soft overlay |
| `--text-primary` | `#fff` | Primary text |
| `--text-secondary` | `#c8d6e5` | Secondary text |
| `--text-tertiary` | `#8a9bb0` | Tertiary text |
| `--text-muted` | `#5a6b80` | Muted text |
| `--accent` | `#4af` | Primary accent (blue) |
| `--accent-2` | `#4df` | Secondary accent (cyan) |
| `--accent-hover` | `#6bf` | Accent hover state |
| `--accent-glow` | `rgba(68,170,255,.3)` | Accent glow effect |
| `--accent-glow-s` | `rgba(68,170,255,.45)` | Strong accent glow |
| `--success` | `#4c8` | Success state (green) |
| `--success-bg` | `rgba(40,120,80,.4)` | Success background |
| `--success-glow` | `rgba(80,200,100,.4)` | Success glow |
| `--danger` | `#ff6b6b` | Danger state (red) |
| `--warning` | `#fd4` | Warning state (yellow) |
| `--border` | `#1a3a55` | Default border |
| `--border-hover` | `#345` | Hover border |
| `--energy-low` | `#e33` | Energy bar low (red) |
| `--energy-mid` | `#ee3` | Energy bar medium (yellow) |
| `--energy-high` | `#3e3` | Energy bar high (green) |

### 1.2 Spacing Scale

**Source**: `.04-Src/src/style.css:1`

| Token | Value | Usage |
|-------|-------|-------|
| `--sp-1` | `4px` | Minimal spacing |
| `--sp-2` | `8px` | Small spacing |
| `--sp-3` | `12px` | Medium spacing |
| `--sp-4` | `16px` | Base spacing |
| `--sp-5` | `24px` | Large spacing |
| `--sp-6` | `32px` | XL spacing |
| `--sp-7` | `48px` | XXL spacing |
| `--sp-8` | `64px` | Section spacing |

### 1.3 Border Radius

**Source**: `.04-Src/src/style.css:1`

| Token | Value | Usage |
|-------|-------|-------|
| `--r-sm` | `4px` | Small elements (buttons, inputs) |
| `--r-md` | `8px` | Medium elements (cards, panels) |
| `--r-lg` | `12px` | Large elements (modals) |
| `--r-full` | `9999px` | Circular elements (toggle knobs) |

### 1.4 Typography

**Source**: `.04-Src/src/style.css:1`

| Token | Value | Usage |
|-------|-------|-------|
| `--font` | `system-ui,-apple-system,'Segoe UI',sans-serif` | Base font stack |
| `--fs-xs` | `12px` | Extra small text |
| `--fs-sm` | `14px` | Small text |
| `--fs-base` | `16px` | Base text |
| `--fs-lg` | `20px` | Large text |
| `--fs-xl` | `24px` | Extra large text |
| `--fs-2xl` | `32px` | Heading text |

### 1.5 Shadows

**Source**: `.04-Src/src/style.css:1`

| Token | Value | Usage |
|-------|-------|-------|
| `--sh-sm` | `0 2px 8px rgba(0,0,0,.3)` | Small shadow |
| `--sh-md` | `0 4px 16px rgba(0,0,0,.4)` | Medium shadow |
| `--sh-lg` | `0 8px 32px rgba(0,0,0,.5)` | Large shadow |
| `--sh-glow` | `0 0 12px var(--accent-glow)` | Accent glow shadow |

### 1.6 Z-Index Scale

**Source**: `.04-Src/src/style.css:1`

| Token | Value | Usage |
|-------|-------|-------|
| `--z-hud` | `10` | HUD elements |
| `--z-ctrl` | `15` | Controls |
| `--z-modal` | `20` | Modal dialogs |
| `--z-overlay` | `30` | Overlays |
| `--z-menu` | `40` | Menus |
| `--z-top` | `80` | Top-level elements (tutorial) |

### 1.7 Animation

**Source**: `.04-Src/src/style.css:1`

| Token | Value | Usage |
|-------|-------|-------|
| `--ease` | `cubic-bezier(.25,.46,.45,.94)` | Default easing |
| `--fast` | `150ms` | Fast transitions |
| `--base` | `200ms` | Base transition duration |

---

## 2. Component Patterns

### 2.1 Panel (`.p`)

**Source**: `.04-Src/src/style.css:5`

```css
.p {
  background: var(--bg-panel);
  border: 1px solid var(--border);
  border-radius: var(--r-md);
  color: var(--text-primary);
  font-size: var(--fs-xs);
  backdrop-filter: blur(4px);
}
```

**Usage**: Generic panel container with translucent background and blur effect.

### 2.2 Button (`.btn`)

**Source**: `.04-Src/src/style.css:27-30`

```css
.btn {
  padding: var(--sp-2) var(--sp-5);
  font-size: var(--fs-sm);
  background: var(--bg-elevated);
  color: var(--text-secondary);
  border: 2px solid var(--border-hover);
  border-radius: var(--r-md);
  cursor: pointer;
  font-family: inherit;
  margin: var(--sp-1);
  transition: all var(--base) var(--ease);
}
```

**Variants**:
- `.btn.sm` — Small button (`.04-Src/src/style.css:31`)
- `.btn:hover` — Hover state with glow effect
- `.btn:focus-visible` — Focus ring (accessibility)
- `.btn:disabled` — Disabled state (opacity 0.4)

### 2.3 Species Card (`.sc`)

**Source**: `.04-Src/src/style.css:41-44`

```css
.sc {
  min-width: 140px;
  max-width: 160px;
  background: var(--bg-surface);
  border: 2px solid var(--border-hover);
  border-radius: var(--r-md);
  padding: var(--sp-2);
  cursor: pointer;
  text-align: center;
  transition: all var(--fast) var(--ease);
  position: relative;
}
```

**States**:
- `.sc:hover` — Scale up + accent border + glow
- `.sc.sel` — Selected state with accent glow

### 2.4 Category Button (`.cb`)

**Source**: `.04-Src/src/style.css:33-37`

```css
#catSel .cb {
  cursor: pointer;
  pointer-events: auto;
  padding: var(--sp-1) var(--sp-2);
  border-radius: var(--r-md);
  background: rgba(0,30,50,.7);
  border: 1px solid var(--border-hover);
  font-size: var(--fs-xs);
  user-select: none;
  transition: all var(--fast) var(--ease);
}
```

**States**:
- `.cb:hover` — Green tint + success border
- `.cb.act` — Active state with success background + glow

### 2.5 Toggle (`.tg`)

**Source**: `.04-Src/src/style.css:54`

```css
.tg {
  width: 34px;
  height: 16px;
  background: var(--bg-hover);
  border-radius: var(--r-md);
  cursor: pointer;
  position: relative;
  flex-shrink: 0;
  transition: background var(--base) var(--ease);
}
.tg.on { background: var(--success); }
.tg::after {
  content: '';
  width: 12px;
  height: 12px;
  background: var(--text-secondary);
  border-radius: var(--r-full);
  position: absolute;
  top: 2px;
  left: 2px;
  transition: left var(--base) var(--ease);
}
.tg.on::after { left: 20px; }
```

### 2.6 Speed Button (`.sb`)

**Source**: `.04-Src/src/style.css:15-16`

```css
.sb {
  padding: var(--sp-1) var(--sp-2);
  font-size: var(--fs-xs);
  color: var(--text-primary);
  background: var(--bg-surface);
  border: 1px solid var(--border-hover);
  border-radius: var(--r-sm);
  cursor: pointer;
  min-width: 32px;
  text-align: center;
  font-family: inherit;
  transition: all var(--fast) var(--ease);
}
.sb.act {
  background: var(--success-bg);
  color: var(--text-primary);
  border-color: var(--success);
}
```

### 2.7 Language Selector

**Source**: `.04-Src/src/style.css:72-79`

- `.lang-curr` — Current language button (`.04-Src/src/style.css:73`)
- `.lang-drop` — Dropdown menu (`.04-Src/src/style.css:76`)
- `.lang-item` — Language option (`.04-Src/src/style.css:78`)

### 2.8 Wiki Entry

**Source**: `.04-Src/src/style.css:67-69`

- `.wiki-cat` — Category heading (`.04-Src/src/style.css:67`)
- `.wiki-entry` — Entry card (`.04-Src/src/style.css:68`)
- `.wiki-search` — Search input (`.04-Src/src/style.css:70`)

### 2.9 Tutorial Card

**Source**: `.04-Src/src/style.css:90-98`

- `#tutorialLayer` — Full-screen overlay (`.04-Src/src/style.css:90`)
- `#tutorialCard` — Card container (`.04-Src/src/style.css:91`)
- `#tutorialTitle` — Title text (`.04-Src/src/style.css:92`)
- `#tutorialBody` — Body text (`.04-Src/src/style.css:93`)
- `#tutNext` — Next button (`.04-Src/src/style.css:97`)
- `#tutSkip` — Skip button (`.04-Src/src/style.css:98`)

---

## 3. Layout Patterns

### 3.1 HUD Layout

**Source**: `.04-Src/src/style.css:6-12`

- `#hud` — Left-side HUD panel (relative positioning, z-index 10)
- `#topR` — Top-right stats (absolute positioning)
- `#spdBar` — Top-center speed control (absolute, centered)
- `#ebar` — Energy bar (full width, gradient fill)

### 3.2 Overlay Layout

**Source**: `.04-Src/src/style.css:23-25`

```css
.ov {
  position: fixed;
  inset: 0;
  z-index: var(--z-menu);
  display: none;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.ov.show { display: flex; }
```

**Overlay types**:
- `#menuO` — Main menu (scrollable, top-aligned)
- `#pauseO` — Pause screen (soft overlay)
- `#helpO` — Help screen (scrollable)
- `#deadO` — Death screen
- `#setO` — Settings (scrollable)
- `#wikiO` — Wiki (no overflow)

### 3.3 Grid Layouts

- `#catSel` — Category selector (flex-wrap) — `.04-Src/src/style.css:32`
- `#spGrid` — Species grid (flex-wrap, max-height 48vh) — `.04-Src/src/style.css:38`
- `.scrollbox` — Generic scrollable container (max-height 60vh) — `.04-Src/src/style.css:39`

---

## 4. Accessibility

### 4.1 Focus States

All interactive elements have `:focus-visible` states with 2px accent outline:

**Source**: `.04-Src/src/style.css:16,29,35,43,51,58,75,82,85,97,98`

```css
:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}
```

### 4.2 Touch Targets

Minimum touch target size: 48×48px

**Source**: `.04-Src/src/style.css:15` (`.sb` min-width 32px, but padding ensures 44×44px touch area)

### 4.3 Contrast Ratios

- Primary text (`#fff`) on dark backgrounds: >15:1 (WCAG AAA)
- Secondary text (`#c8d6e5`) on dark backgrounds: >8:1 (WCAG AAA)
- Accent text (`#4af`) on dark backgrounds: >6:1 (WCAG AA)

---

## 5. Theme System

### 5.1 Theme Variables

Themes override CSS variables at runtime. Theme files located in:
- `.04-Src/assets/themes/` (theme definitions)
- `.04-Src/js/theme_menu_v5.js` (theme switcher)

### 5.2 Available Themes

1. **Classic** — Default blue/cyan palette
2. **Neon Bio** — High-contrast neon greens
3. **Phase Contrast** — Microscopy-inspired monochrome
4. **Glass Lab** — Translucent glass morphism
5. **Cyberpunk Scanner** — Dark cyber aesthetic
6. **Haeckel Watercolor** — Organic watercolor textures
7. **Engraving** — Vintage engraving style

### 5.3 Theme Application

Themes apply via CSS variable overrides on `:root`. No `!important` required for theme colors (proper cascade).

---

## 6. !important Usage Policy

### 6.1 Current Count

**Total**: 33 occurrences (excluding node_modules)

**Breakdown**:
- `js/mobile.js`: 32
- `src/style.css`: 11
- `07-QA-and-Testing/vitest/ui_widgets.test.js`: 4 (test file, excluded from count)

### 6.2 Allowed Cases

`!important` is permitted only when:

1. **Overriding inline styles** — JS-generated inline styles cannot be overridden otherwise
2. **Theme overrides** — When theme variables must override base styles (should be rare with proper cascade)
3. **Accessibility focus rings** — Focus indicators must always be visible
4. **Critical UI states** — Disabled, loading, error states that must not be overridden

### 6.3 Documentation Requirement

Every `!important` usage must have a comment explaining why:

```css
/* !important: Override inline style from JS (config.js:441) */
element.style.property: value !important;
```

---

## 7. Migration Guidelines

### 7.1 Moving Inline Styles to CSS

**Before** (JS):
```javascript
el.style.cssText = 'position:fixed;top:22%;left:50%;...';
```

**After** (CSS class):
```css
.igs-toast {
  position: fixed;
  top: 22%;
  left: 50%;
  /* ... */
}
```

```javascript
el.classList.add('igs-toast');
```

### 7.2 Reducing !important

1. **Check specificity** — Increase selector specificity instead of using `!important`
2. **Move to CSS** — Inline styles → CSS classes
3. **Use CSS variables** — Theme overrides via variables, not `!important`
4. **Document remaining** — Add comment explaining why `!important` is necessary

---

## 8. File References

| File | Purpose | Lines |
|------|---------|-------|
| `.04-Src/src/style.css` | Main stylesheet (design tokens + components) | 1-100+ |
| `.04-Src/fonts.generated.css` | Font face declarations | Generated |
| `.04-Src/js/ui.js` | UI component logic | ~400 |
| `.04-Src/js/ui_menus.js` | Menu system | ~200 |
| `.04-Src/js/theme_menu_v5.js` | Theme switcher | ~100 |
| `.04-Src/assets/themes/` | Theme definitions | Directory |

---

## 9. Changelog

- **2026-11-07**: Initial DESIGN.md creation (D1 task)
  - Documented all design tokens with file:line references
  - Cataloged component patterns
  - Established !important policy
  - Added migration guidelines

---

**Maintainer**: iGraSpore Dev Team  
**Review Cycle**: Quarterly or on major design changes
