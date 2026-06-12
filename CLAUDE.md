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
wordvectors/            Word Vectors & Bias demo (see wordvectors/CLAUDE.md)
```

Each tool lives in its own subdirectory with its own `index.html`, `css/style.css`, and `js/`. Tool-specific styles import the shared base via a `<link>` tag in the HTML.

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

**Header pattern:** `<header>` with dark navy background, tool title in `<h1>`, byline `<p class="byline">` at right.

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
2. Add a `.tool-card` entry to the root `index.html`
3. Add a `toolname/CLAUDE.md` with tool-specific context
4. Add the tool to the version history below

---

## Version history

### Suite Version 1 — June 2026
Monorepo reorganization. Word vectors tool moved into `wordvectors/` subdirectory (originally `w2vdemo/`). Shared CSS extracted into `shared/css/base.css`. Root landing page added.
