# AI Law Casebook — Interactive Tools

## What this is

A suite of static, server-free browser tools companion to Paul Ohm's AI Law casebook. Designed for law students and policymakers — smart non-technical audiences. Classroom use: students run tools on their own laptops while the instructor mirrors on the podium.

Built by Paul Ohm. Codebase started June 2026.

---

## Repo structure

```
index.html              Landing page linking to all tools
shared/
  css/
    base.css            Shared reset, CSS variables, header, byline styles
  js/
    header.js           Shared header injection script (see below)
wordvectors/            Word Vectors & Bias demo (see wordvectors/CLAUDE.md)
neuralnet/              Neural Network Trainer demo (see neuralnet/CLAUDE.md)
compas/                 COMPAS Risk Score Explorer (see compas/CLAUDE.md)
```

Each tool lives in its own subdirectory with its own `index.html`, `css/style.css`, and `js/`. Tool-specific styles import the shared base via a `<link>` tag in the HTML.

---

## Standing design principles

**Use real data.** Prefer real-world datasets over synthetic examples. Whenever possible, anchor interactive elements to data drawn from actual litigation, research, or published investigations. Fabricated numbers should be clearly labeled as hypothetical.

**Self-discovery over slideshow.** Design for open-ended exploration rather than a predetermined sequence of stops. Visual hierarchy, layered reveals, and interactive controls should guide students — not lock them into a fixed tour. Allow students to wander down unintended alleyways. Richness over simplicity.

---

## Design system

**No build step. No npm. No TypeScript.** Plain HTML + CSS + vanilla JS. Deliberate choice for long-term maintainability.

**Color palette** (defined in `shared/css/base.css`):
- `--navy: #1a1a2e` — primary dark, headers
- `--red: #e94560` — accent, CTAs, highlights
- `--blue: #0f3460` — links, secondary actions
- `--gold: #f5a623` — available for future use
- `--bg: #f7f6f3` — page background (off-white)
- `--white: #ffffff` — card backgrounds

**Typography:** Georgia serif for body and headings; sans-serif for UI chrome and labels; monospace for code/data output.

**Header pattern:** `<header id="site-header">` filled by `shared/js/header.js`. Left side: `.hdr-left` flex container with tool title `<h1>` and `<p class="byline">by Paul Ohm</p>`. Right side: `<nav class="header-nav">` with Tutorial and All Apps links. Each tool sets `window.APP_HEADER = { h1: '...' }` in an inline script before loading `header.js`. Each tool also exposes `window.restartTutorial()` in its `app.js` so the Tutorial link can return to the four-slide explainer.

**Card pattern:** white background, `border-radius: var(--radius)`, `box-shadow: var(--shadow)`.

---

## Running locally

Any static server works:

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

Browsers block `fetch()` on `file://` URLs, so a server is required for tools that load data files.

---

## Deploying

All tools are fully static. The repo can be served from GitHub Pages, Cloudflare Pages, or copied into a Hugo `static/` directory.

See each tool's `CLAUDE.md` for tool-specific data setup and deployment notes (some tools have large data files with special handling requirements).

---

## Adding a new tool

1. Create `toolname/index.html` linking to `../shared/css/base.css` and a local `css/style.css`
2. Add `<header id="site-header"></header>`, an inline `window.APP_HEADER` config, and `<script src="../shared/js/header.js"></script>` at the top of `<body>`
3. In `toolname/js/app.js`, define `window.restartTutorial = function() { ... }` to reset and re-show the explainer slides
4. Add a `.tool-card` entry to the root `index.html`
5. Add a `toolname/CLAUDE.md` with tool-specific context
6. Add the tool to the version history below

---

## Version history

### Suite Version 1 — June 2026
Monorepo reorganization. Word vectors tool moved into `wordvectors/` subdirectory (originally `w2vdemo/`). Shared CSS extracted into `shared/css/base.css`. Root landing page added.

### Suite Version 2 — June 2026
Neural Network Trainer added in `neuralnet/`. No dependencies — plain HTML + CSS + vanilla JS + a Web Worker for the math. No large data files; ships as-is.

### Suite Version 3 — June 2026
COMPAS Risk Score Explorer added in `compas/`. Shared header infrastructure introduced: `shared/js/header.js` injects a consistent `Tutorial | All Apps` nav into all three tools. Header layout standardized: app title and "by Paul Ohm" byline on the left, navigation on the right. Each tool exposes `window.restartTutorial()` so the Tutorial link returns to the four-slide explainer from anywhere in the app. Wordvectors "Vibe Coded" byline removed. Neuralnet hamburger and "Take a tour" link moved from header into the controls bar (visible only after a network is built).

### Suite Version 4 — June 2026
Fairness Definitions Explorer added in `fairness/`. Companion to the COMPAS app: students build fairness metrics by dragging or clicking cells from two augmented confusion matrices into a ratio workspace. When a known metric is assembled, the app names it and explains its significance. A "Remember" button saves metrics to a comparison table. No threshold slider — data is fixed at COMPAS threshold=5. Metric definitions live in `fairness/data/metrics.json`, a maintainer-editable JSON file. Suite-wide design principles codified in this file: real data over synthetic; self-discovery over slideshow.

### Suite Version 5 — June 2026
Fairness Explorer improvements. Four-slide tutorial carousel, Print / Export button, and a dataset switcher with four real-world datasets selectable via pill buttons: COMPAS by Race (default), COMPAS by Gender (same CSV, different split), Gender Shades (IBM Watson — Buolamwini & Gebru FAccT 2018), and Emily & Greg (Bertrand & Mullainathan AER 2004 résumé audit). Each dataset brings its own row/column labels, cell descriptions, and row badge styles. Metric commentary notes when COMPAS-specific text applies to a non-COMPAS dataset. Print export adapts to the active dataset.
