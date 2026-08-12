# Fairness Definitions Explorer — Design Notes

Tool for the AI Law Casebook suite. Companion to the COMPAS app.

---

## What This Tool Does

A ratio-builder: students assemble fairness metrics by dragging or clicking cells from two confusion matrices into a workspace. When a recognized metric is assembled, the app names it and explains its significance. Students can save metrics to a comparison table and switch between four real-world datasets.

Pedagogical goal: show that 20+ distinct fairness metrics exist, all derived from the same 2×2 confusion matrix; that different metrics give different answers about the same algorithm; and that the impossibility theorem explains why they must diverge — across criminal justice, face recognition, and hiring.

---

## Key Design Decisions

**Real data throughout.** All four datasets use verified primary-source numbers — no synthetic examples.

**No threshold slider.** Unlike the COMPAS app, data is fixed. The focus is on the breadth of metrics derived from one snapshot, not on varying the threshold.

**Augmented confusion matrix.** Shows 9 draggable quantities per matrix: 4 cells (TP, FP, FN, TN) plus 5 derived totals (P=TP+FN, N=FP+TN, PP=TP+FP, PN=TN+FN, n=total). This lets students build all 8 core directional metrics as single-chip / single-chip ratios, plus Accuracy, Prevalence, and Positive Rate.

**Metrics data file.** All recognized metrics live in `data/metrics.json` — not baked into the JavaScript. Non-technical maintainers can add or modify metrics by editing that file.

**Dataset-aware rendering.** Each dataset carries its own `rowLabels`, `colLabels`, `rowBadges`, and `cellDescs`. `buildMatrixHTML()` reads from `currentDataset` so all matrix labels update on switch. Metric commentary notes when COMPAS-specific text applies to a non-COMPAS dataset.

---

## Matrix Orientation

Rows = predicted label (positive / negative prediction), columns = actual outcome. Matches the COMPAS app. Note this is the OPPOSITE of the Wikipedia / scikit-learn convention (which puts actual in rows), but suite consistency matters more than convention.

For COMPAS datasets: rows = Scored High Risk / Scored Low Risk; cols = Did Reoffend / Did NOT Reoffend.
For Gender Shades: rows = Classified Male / Classified Female; cols = Is Male / Is Female.
For Emily & Greg: rows = Got Callback / No Callback; cols = High-Quality Résumé / Lower-Quality Résumé.

---

## Datasets

Four datasets in the `DATASETS` array at the top of `app.js`. `let currentDataset = DATASETS[0]` is the active one. `switchDataset(i)` clears workspace and saved-table state and re-renders.

### Dataset 1 — COMPAS (Race) [default]
Pre-computed from `compas/data/compas-scores-two-years.csv` at threshold=5, same filter as `compas/js/app.js` (`score_text !== 'N/A'`).
- Black defendants: TP=1,369 FP=805 FN=532 TN=990 (n=3,696)
- White defendants: TP=505 FP=349 FN=461 TN=1,139 (n=2,454)

### Dataset 2 — COMPAS (Gender)
Same CSV and filter as Dataset 1, split on `sex` field.
- Female defendants: TP=303 FP=288 FN=195 TN=609 (n=1,395)
- Male defendants: TP=1,732 FP=994 FN=1,021 TN=2,072 (n=5,819)
- Pedagogical note: FPR is roughly equal across gender (~32%), but PPV differs sharply (51% vs 64%) — the opposite pattern from the racial comparison. Same algorithm, same threshold, different fairness story.

### Dataset 3 — Gender Shades (IBM, original 2018 audit)
Source: Buolamwini & Gebru, FAccT 2018, Table 1. IBM Watson Visual Recognition on PPB dataset.
PPB subgroup percentages (verified from paper): LM=30.3%, LF=23.3%, DM=25.0%, DF=21.3% → counts: LM=385, LF=296, DM=318, DF=271 (total 1,270).
IBM error rates (all verified from Table 1): LM=0.3%, LF=7.1%, DM=12.0%, DF=34.7%.
- Lighter-skinned: TP=384 FP=21 FN=1 TN=275 (n=681) — FPR=7.1%, FNR=0.3%
- Darker-skinned: TP=280 FP=94 FN=38 TN=177 (n=589) — FPR=34.7%, FNR=12.0%
- Confusion matrix framing: positive=Male, negative=Female; truth is actual gender.

### Dataset 4 — Bertrand & Mullainathan (2004) — Emily & Greg
Source: "Are Emily and Greg More Employable Than Lakisha and Jamal?" AER 94(4), 2004.
Callback rates from replicated analysis: WH=10.79%, WL=8.50%, BH=6.70%, BL=6.19%.
Split: 1,218 high-quality + 1,217 low-quality résumés per race; n=2,435 per group.
- White-named: TP=131 FP=103 FN=1,087 TN=1,114 (n=2,435)
- Black-named: TP=82 FP=75 FN=1,136 TN=1,142 (n=2,435)
- Confusion matrix framing: positive=Got Callback, truth=High-Quality Résumé.
- Pedagogical note: base rates are equal by design (50/50 quality split), so Chouldechova's impossibility doesn't apply. Any TPR gap is direct evidence of disparate treatment.

### Why Not St. George's (CRE 1988)?
The CRE report (JSTOR community.28327674 — the actual 1988 document) is in the research footer. It's a compelling pre-ML case, but not suitable as a confusion matrix dataset: the discrimination operated via a continuous score multiplier (×1.33 for non-Caucasian males, ×1.3965 for non-Caucasian females), not a binary classifier on a known population. Total applicant counts by racial group are never given — only the ~12% non-European finalist figure from Collier & Burke 1986. Without those totals, TP/FP/FN/TN cannot be computed from the report.

---

## Interaction Model

**Active zone:** one workspace zone is always "active" (blue label = numerator, orange label = denominator; defaults to numerator on load). Clicking anywhere in a zone activates it.

**Click a cell:** adds it to the active zone. If it's already in the active zone, removes it. The same cell code can exist in both zones simultaneously (e.g., TP in both numerator and denominator). Visual feedback: blue highlight = in numerator, orange highlight = in denominator, half-blue/half-orange with purple outline = in both.

**Drag a cell:** drag from either matrix directly to the numerator or denominator zone.

**Move a chip:** drag a chip from one zone to the other.

**Delete a chip:** click the × (revealed on chip hover) or drag the chip anywhere outside the two zones. The app intercepts the drop with a full-page invisible "trash zone" so the browser never plays the snap-back animation.

**Save Metric:** saves the current ratio (named or custom) to the comparison table below the workspace. Table shows metric name, formula, Group A value, Group B value, and absolute difference.

**Clear:** resets workspace to empty.

---

## data/metrics.json Schema

```json
{
  "_schema_version": 1,
  "metrics": [
    {
      "id": "tpr",
      "names": ["Primary Name", "Synonym 1", "Synonym 2"],
      "numerator": ["tp"],
      "denominator": ["p"],
      "commentary": "Plain-English explanation for law students.",
      "sources": ["Source 1", "Source 2"]
    }
  ]
}
```

**Cell codes:** `tp`, `fp`, `fn`, `tn`, `p` (=tp+fn), `n` (=fp+tn), `pp` (=tp+fp), `pn` (=tn+fn), `all` (=tp+fp+fn+tn)

Matching is by sorted set of codes — list order doesn't matter.

**Current metrics (11):** TPR, FNR, FPR, TNR, PPV, FDR, NPV, FOR, Positive Rate, Accuracy, Prevalence.

---

## Implementation Notes

**N vs n**: `text-transform: uppercase` is intentionally absent from `.cell-abbr`. Capital N = actual negatives (FP+TN), lowercase n = total (grand sum). Removing uppercase lets the case distinction render correctly.

**Border technique**: COMPAS dark-border style — `border: 1.5px solid #1e293b` on the grid, `border-right/bottom: 1px solid #1e293b` on every child, then `nth-child(4n)` removes last-column right borders and `nth-child(n+13)` removes last-row bottom borders (16-cell 4×4 grid).

**Smart sum recognition**: `normalizeCodes()` in `app.js` collapses known sums before matching metrics.json. Rules: `{tp,fn}→p`, `{fp,tn}→n`, `{tp,fp}→pp`, `{tn,fn}→pn`, `{p,n}→all`, `{pp,pn}→all`, `{tp,fp,fn,tn}→all`. Applied iteratively until no rule fires. Display formula shows what the user actually built; only recognition is normalized.

**Drag-to-delete trash zone**: a `position:fixed; inset:0; z-index:1` div is appended to `<body>` and shown only during chip drags. The workspace zones have `position:relative; z-index:2` so they remain above it. Any chip dropped outside the zones lands on the trash zone (which calls `preventDefault()` to suppress snap-back), then deletes the chip. **Critical invariant:** the trash zone must be hidden synchronously at the top of both the trash zone's own `drop` handler AND the workspace zone's `drop` handler — before `render()` removes the dragged element — because removing an element from the DOM during a drop prevents `dragend` from firing, leaving the invisible trash zone visible and blocking all pointer events.

**Chip drag effectAllowed**: both matrix cells and workspace chips use `effectAllowed = 'copy'` to match the zone `dragover` handler's `dropEffect = 'copy'`. In Firefox, a mismatch silently prevents `drop` from firing.

**COMPAS commentary note**: `renderWorkspace()` checks `currentDataset.id.startsWith('compas')` and prepends a note when metric commentary (which is written for COMPAS defendants) is shown alongside a non-COMPAS dataset.

**Print / Export**: `printMetrics()` opens a new window, writes a full HTML page, and calls `w.print()`. The dataset info block and the footer note are conditional on `currentDataset.id` — COMPAS datasets get the Chouldechova base-rate note; Emily & Greg gets an equal-base-rate note; Gender Shades gets a PPB-balance note.

**Known Metrics drawer**: `#metrics-drawer` is a gold-pulsing card sitting above the workspace, visible (`.open`) as soon as the tutorial ends. It starts showing a one-line teaser ("Rather not hunt for them yourself? Reveal a few known metrics.") rather than the metrics themselves — the mystery is softened, not removed. Clicking the teaser's link, or firing any of three hidden triggers, calls `revealDrawer()`, which swaps the teaser for all 11 recognized metrics as clickable chips (via a `.revealed` class: CSS shows `.drawer-chips` and hides `.drawer-teaser`). Clicking a chip loads its numerator/denominator codes into the workspace exactly as if the student had clicked those cells manually — recognition and highlighting fire automatically. There is no close button: once revealed, `drawerRevealed` stays `true` for the rest of the session (not reset by `switchDataset()`), so the reveal is one-way short of a page reload. The three original hidden triggers still work as alternate, undocumented paths to the same reveal:

1. **Konami Code** — click the matrix as a D-pad: FP=↑, N=↓, FN=←, PN=→, A={TP or P}, B={PP or all}. Sequence: ↑↑↓↓←→←→BA.
2. **8675309** (Tommy Tutone, 1981) — phone dialpad mapped to the matrix (TP=1 FP=2 PP=3 / FN=4 TN=5 PN=6 / P=7 N=8 all=9 / zone-click=0). Sequence: N→PN→P→TN→PP→[zone click]→all = 8-6-7-5-3-0-9.
3. **All 9 cells explored** — fires automatically after a student clicks every distinct cell at least once.

`clickHistory` (FIFO, 30 entries) tracks cell codes plus `'0'` for zone clicks. Sequence triggers consume the final click without adding a chip; the all-cells trigger does not consume. All three triggers, and the teaser link, are guarded by `!drawerRevealed` / the idempotency check inside `revealDrawer()`. Adding new dialpad codes requires only a new `_SEQ` array and one added `||` condition in the cell-click handler.

---

## Version History

### Version 1 — June 2026
Augmented confusion matrices (4×4 grid with marginals) for COMPAS Black and White defendants. Ratio workspace with active-zone click model and drag-and-drop. Smart sum recognition via `normalizeCodes()`. Recognition against `data/metrics.json` (10 metrics: TPR, FNR, FPR, TNR, PPV, FDR, NPV, FOR, Accuracy, Prevalence). Live result display below each matrix. Saved metrics comparison table with × remove buttons. Drag-to-delete via full-page trash zone. Research footer with six foundational papers.

### Version 2 — June 2026
Four-slide tutorial carousel added (matches COMPAS pattern: `#explainer`/`#main-app` visibility toggle, `window.restartTutorial()`, slide card CSS, `sv-*` visualization classes). Slide 4 covers the Kleinberg-Chouldechova impossibility theorem with live base-rate bars. Print / Export button opens a new window with a formatted metrics table and triggers the browser print dialog.

### Version 3 — June 2026
Dataset switcher: four real-world datasets selectable via pill buttons. Each dataset carries its own `rowLabels`, `colLabels`, `rowBadges`, and `cellDescs`; `buildMatrixHTML()` reads from `currentDataset` so all matrix labels are fully dynamic. `switchDataset(i)` clears workspace and saved-table state on every switch. Dataset source line displayed beneath the selector. Positive Rate (PP/all) added as an 11th metric — the demographic parity / selection rate criterion, most directly relevant to Title VII disparate impact analysis. Research footer expanded with St. George's CRE report (1988), Bertrand & Mullainathan (2004), and Buolamwini & Gebru (2018). UI polish: slide title no longer overlaps Skip button; instruction hint moved between matrices and workspace and restyled as subtle centered text. Impossibility theorem attribution updated throughout to jointly credit Kleinberg, Mullainathan & Raghavan (2016) and Chouldechova (2017) as simultaneous independent discoverers.

### Version 3.5 — June 2026
Known Metrics drawer easter egg. A hidden gold-pulsing card (`#metrics-drawer`) slides open above the workspace showing all 11 recognized metrics as chips. Clicking a chip loads that metric into the workspace as if the student had clicked the cells manually. Three triggers: (1) Konami Code using the matrix as a D-pad; (2) 8675309 via a phone-dialpad mapping of the matrix cells (TP=1…all=9, zone-click=0); (3) automatic reveal after all 9 distinct cells have been clicked at least once. The dialpad scheme makes adding future numeric codes trivial.

### Version 3.6 — August 2026
Softened the drawer easter egg after beta feedback that the three hidden triggers were too obscure to reliably remember. `#metrics-drawer` is now visible as soon as the tutorial ends, showing a short teaser line and a "Reveal a few known metrics" link in place of the chips — the three original hidden triggers (Konami, 8675309, all-9-cells) still work as undocumented alternate paths to the same reveal. Removed the drawer's close button: once revealed (by any method), the chips replace the teaser for the rest of the session, with no way back short of reloading the page.

---

## Stretch Goals

### V4
- Compound ratios: named metrics become draggable chips (build LR+ = TPR/FPR by dragging named chips)
- Multiple chips of same type (build F1 = 2·TP / (2·TP+FP+FN))
- St. George's as Dataset 5 if the CRE 1988 report can be parsed for per-group applicant totals

---

## Research Files

- `research/confusion-matrix-metrics.md` — all 21 Wikipedia metrics with formulas
- `research/narayanan-fairness-definitions.md` — Narayanan's 21 definitions taxonomy
- `research/impossibility-results.md` — Chouldechova + Kleinberg impossibility proofs with COMPAS numbers
