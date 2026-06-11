# w2vdemo — Word Vectors & Bias Interactive Demo

## What this is

A static, server-free web app for teaching law students and policymakers that word embedding models encode human biases. Students pull it up on their own laptops during class; the instructor mirrors it on the podium. No installation required for students — just a URL (GitHub Pages target).

Built by Paul Ohm. Codebase started June 2026.

---

## Target audience & design decisions (from planning interviews)

**Primary users:** Smart non-technical audiences — law students, policymakers — who have never heard of a word embedding. Classroom use: individual exploration + instructor-mirrored live demos.

**Core takeaway:** Word embeddings encode the biases present in the text they were trained on, and this is geometrically visible as vector arithmetic.

**Key design choices made:**
- **Three-box UI:** User types A, B, C; tool computes D = C + (B − A) and shows the nearest word. Framed in humanities-friendly "is to / as" language throughout — inputs labeled "is to / as / is to", equation recap reads "A is to B as C is to D". Math symbols avoided entirely.
- **Example queries use general→specific framing:** e.g., "man is to king as woman is to ?" rather than "king is to man as woman is to ?". Encourages students to think about the relationship direction.
- **Two-arrow D3 visualization:** The result is shown as two parallel arrows (A→B on top, C→D below), both running left-to-right. The X axis is always the A→B direction. Node size is fixed (radius 17); font shrinks for long words rather than expanding the node.
- **Real GloVe vectors:** 100,000 words from GloVe 6B.50d (Wikipedia + Gigaword). The user explicitly rejected toy/small vocabularies — results must match what word2vec/GloVe actually produce.
- **No server:** Fully static — `fetch()` loads a binary vector file at page load. All math runs client-side in typed arrays.
- **Four-slide explainer with one-click skip:** Slides teach (1) words as points, (2) relationships as directions, (3) follow the arrow to find the missing word, (4) bias. No math symbols in slides. Slides 3 & 4 use left-to-right arrows stacked top-to-bottom, matching the demo visualization. Always skippable from the top-right header.
- **Laptop-optimized:** Rich D3 visualization. Phone support explicitly deprioritized in favor of a compelling visual.
- **Open-ended exploration:** No pre-baked gender/race/etc. modes. The three-box UI lets students discover any form of bias. Pre-loaded examples seed intuition.

**Explicitly rejected alternatives:**
- Flask/Python backend (user doesn't want to run servers)
- Small (10K) vocabulary models like ml5.js default (not "real" enough)
- Parallel-coordinates visualization (WordBias style) — too technical for target audience
- Phone-optimized simplified layout

---

## Setup: getting the data

Each model lives in its own subdirectory under `data/`. All are **not in git** (too large). GloVe 6B is required; Google News and Twitter are optional but enable the model toggle.

```bash
# ── GloVe 6B (required) ───────────────────────────────────────────────────────
curl -LO https://nlp.stanford.edu/data/glove.6B.zip
unzip glove.6B.zip glove.6B.50d.txt
python3 scripts/prepare_vectors.py --input glove.6B.50d.txt --words 100000 --outdir data/glove
# Writes: data/glove/vocab.json (~2 MB) and data/glove/vectors.bin (~20 MB)

# ── Google News word2vec (optional, ~1.5 GB download) ────────────────────────
# Download GoogleNews-vectors-negative300.bin.gz from the word2vec Google Code archive
gunzip GoogleNews-vectors-negative300.bin.gz
python3 scripts/prepare_vectors.py --input GoogleNews-vectors-negative300.bin \
    --format word2vec --words 200000 --outdir data/googlenews
# Writes: data/googlenews/vocab.json and data/googlenews/vectors.bin (~230 MB)

# ── GloVe Twitter (optional, ~1.4 GB download) ───────────────────────────────
# Download glove.twitter.27B.zip from the Stanford GloVe page
unzip glove.twitter.27B.zip glove.twitter.27B.200d.txt
python3 scripts/prepare_vectors.py --input glove.twitter.27B.200d.txt \
    --words 200000 --outdir data/twitter
# Writes: data/twitter/vocab.json and data/twitter/vectors.bin (~160 MB)
```

## Running locally

Browsers block `fetch()` on `file://` URLs, so you need a static server:

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

Any static server works (VS Code Live Server, `npx serve`, etc.).

## Deploying for students (GitHub Pages)

1. Commit the contents of `data/glove/` (and optionally `data/googlenews/` and `data/twitter/`) to the repo (they're gitignored by default — use `git add -f data/glove/`).
2. Push to GitHub and enable Pages on the `main` branch.
3. Share the Pages URL. Students click it, wait ~10–30 seconds for GloVe to load, then the tool is fully interactive. Alternate models lazy-load on first click.

---

## Architecture

**No build step. No npm. No TypeScript.** Plain HTML + CSS + vanilla JS + D3 v7 (CDN). This was a deliberate choice for long-term maintainability.

```
index.html              Main page: loading overlay, 4-slide explainer, demo section, papers footer
css/style.css           All styles
js/vectors.js           VectorModel class: loads binary, cosine similarity, analogy math, 2D projection
js/app.js               UI logic: explainer slides (D3), demo form, D3 analogy visualization
data/glove/             GloVe 6B vectors (generated); vocab.json + vectors.bin
data/googlenews/        Google News vectors (generated, optional); same file structure
data/twitter/           GloVe Twitter vectors (generated, optional); same file structure
scripts/prepare_vectors.py  Converts GloVe text or word2vec binary → demo binary format
papers/                 Markdown summaries of 8 foundational papers on word embedding bias
demos/                  Markdown survey of 9 existing word embedding demo tools
```

### Binary format (vectors.bin)
- Bytes 0–3: `uint32` num_words
- Bytes 4–7: `uint32` num_dims (50 for GloVe 6B; 200 for Twitter; 300 for Google News)
- Bytes 8–end: `float32[num_words × num_dims]`, row-major, all vectors pre-normalized to unit length

### VectorModel (js/vectors.js)
- `load(vocabUrl, vectorsUrl, onProgress)` — async; normalizes all vectors on load
- `get(word)` — returns `Float32Array | null`
- `nearest(vec, k, exclude[])` — cosine similarity scan over all 100K vectors; ~5ms
- `analogy(a, b, c, k)` — returns `{ error, target, vecA, vecB, vecC, results[] }`
- `projectAnalogy(vecA, vecB, vecC, vecD)` — projects 4 vectors to 2D; X = (B−A) direction, Y = perp component of (C−A)

### Explainer slides (js/app.js)
Slides use hardcoded 2D positions (no vectors required) so they render immediately while the model loads in the background. The model only needs to be ready when the user reaches the demo section.

---

## Extending the demo

**To add more example queries:** Edit the `examples` array for the relevant model in `MODEL_CONFIGS` in `js/app.js`. The `query` field is `"A,B,C"` (spaces in words are auto-converted to underscores for vocab lookup).

**To add a fourth embedding model:** Add an entry to `MODEL_CONFIGS` in `js/app.js`, add a `.model-btn` in `index.html`, run `prepare_vectors.py` to generate its data files, and add a subdirectory under `data/`. The JS is dimension-agnostic — any dim works.

**To add more explainer slides:** Add an entry to the `SLIDES` array in `js/app.js` and add a `drawSlideN` function. Add a `.dot` element in `index.html`.

**To show multiple bias dimensions simultaneously:** The foundation for this is in `projectAnalogy()` — you could project a larger set of words and color them by category.

---

## Research foundation

See `papers/` for full summaries. Key papers:
- **Bolukbasi et al. 2016** (NeurIPS) — gender bias in word2vec, debiasing methods; origin of the programmer/homemaker analogy
- **Caliskan et al. 2017** (Science) — WEAT; replicated human implicit bias tests using GloVe
- **Garg et al. 2018** (PNAS) — 100 years of stereotypes encoded in word embeddings
- **Manzini et al. 2019** (NAACL) — racial bias; "Black is to criminal as Caucasian is to police"

See `demos/` for survey of 9 existing tools and why none fully fit this use case.

---

## Version history

### Version 1
Initial build. Core architecture established: binary vector format, VectorModel class, four-slide explainer, three-box analogy demo, D3 visualization, papers footer.

### Version 2 — stopping point: June 2026
Humanities-friendly language pass and visualization refinements:
- Replaced all math symbols (−, +, =) with "is to / as" language in the UI, equation recap, and explainer slides
- Changed analogy formula framing from A−B+C to C+(B−A); example queries reordered to general→specific (man:king::woman:?)
- Visualization changed from four-arrow parallelogram to two parallel arrows (A→B top, C→D bottom), both left-to-right
- Fixed node size (radius 17); font scales down for long result words instead of expanding the node
- Explainer slides 3 & 4 redesigned: math equations removed from figures, replaced with "is to/as" captions; simplified to two parallel left-to-right arrows matching the demo's own style
- Racial bias example updated to black:criminal::white:? framing

### Version 3 — stopping point: June 2026
Transparency about excluded ("identity") words:
- The three input words (A, B, C) are excluded from the analogy search by convention — this is standard in the literature but can make results look more impressive than they are. Version 3 makes this visible via a plain-text note rather than a visual treatment (a teal color system was explored and reverted because it created a misleading visual contradiction: nodes that rank highest by cosine similarity in 50D appear far from the result in the 2D projection).
- **Exclusion note**: A small italic line below "Also nearby" reads: `"[B]" was excluded from results; if included, it would have scored X.XX`. The score is `cos(normalized_target, vecB)` — the exact score B would have received in the results list — making it directly comparable to the chips above it. This makes clear that B (e.g. "programmer") was removed by convention, not because it ranked low.
- **"Also nearby" expanded**: List grows from 7 to 10 items (requires fetching k=11 so that result[0] — the headline answer — plus 10 "also nearby" entries are all available).
- **Visualization fix**: `projectAnalogy()` now computes X relative to A (matching the existing Y computation), so A is always at the origin and C no longer drifts to the y-axis.

### Version 4 — stopping point: June 2026
Three-model toggle (GloVe 6B, Google News + phrases, GloVe Twitter):
- **Model toggle UI**: "Embeddings:" row above the analogy form with three buttons. GloVe 6B loads at startup as before; alternate models lazy-load on first click with inline `Loading… N%` progress on the button itself.
- **Per-model examples**: Each model has its own `examples` array in `MODEL_CONFIGS`. Buttons are dynamically rendered by `renderExamples()` on every model switch.
- **Phrase support**: `resolveWord()` silently retries with spaces converted to underscores (e.g. `computer programmer` → `computer_programmer`), so bigram example buttons show natural English without underscores.
- **Data layout**: Reorganized from flat `data/` into `data/glove/`, `data/googlenews/`, `data/twitter/` subdirectories.
- **`prepare_vectors.py` extended**: New `--format word2vec` flag reads Google News binary format; lowercases all words for consistent JS lookup; writes vectors row-by-row (handles any dimension).
