# Fairness Definitions Explorer — Design Notes

Tool for the AI Law Casebook suite. Companion to the COMPAS app.

---

## What This Tool Does

A ratio-builder: students assemble fairness metrics by dragging or clicking cells from two confusion matrices (Black defendants, White defendants — real COMPAS data) into a workspace. When a recognized metric is assembled, the app names it and explains its significance. Students can save metrics to a comparison table.

Pedagogical goal: show that 20+ distinct fairness metrics exist, all derived from the same 2×2 confusion matrix; that different metrics give different answers about the same algorithm; and that the impossibility theorem explains why they must diverge.

---

## Key Design Decisions

**Self-discovery over slideshow.** No tutorial carousel in V1. Open directly to the dashboard. Hint text is built into the UI labels, not a guided tour.

**Real data throughout.** Uses the ProPublica COMPAS dataset (Broward County, FL, 2013–2014). Same dataset as the COMPAS app; same filter (score_text ≠ 'N/A', two_year_recid field). Pre-computed at threshold=5 and hardcoded — no CSV loading.

**No threshold slider.** Unlike the COMPAS app, this tool's data is fixed. The focus is on the breadth of metrics, not on varying the threshold.

**Augmented confusion matrix.** Shows 9 draggable quantities per matrix: 4 cells (TP, FP, FN, TN) plus 5 derived totals (P=TP+FN, N=FP+TN, PP=TP+FP, PN=TN+FN, n=total). This lets students build all 8 core directional metrics as single-chip / single-chip ratios.

**Metrics data file.** All recognized metrics live in `data/metrics.json` — not baked into the JavaScript. Non-technical maintainers can add or modify metrics by editing that file.

---

## Matrix orientation

Rows = predicted score (High Risk / Low Risk), columns = actual outcome (Did Reoffend / Did NOT Reoffend). Matches the COMPAS app exactly. Note this is the OPPOSITE of the Wikipedia / scikit-learn convention (which puts actual in rows), but suite consistency matters more than convention.

---

## Hardcoded Data (COMPAS, threshold=5)

Values verified from `compas/data/compas-scores-two-years.csv` using the same filter as `compas/js/app.js`.

**Black defendants (n=3,696):**
- TP=1,369 FP=805 FN=532 TN=990
- P=1,901  N=1,795  PP=2,174  PN=1,522  n=3,696

**White defendants (n=2,454):**
- TP=505  FP=349  FN=461  TN=1,139
- P=966   N=1,488  PP=854   PN=1,600  n=2,454

---

## Interaction Model

**Active zone:** one workspace zone is always "active" (blue label = numerator, orange label = denominator; defaults to numerator on load). Clicking anywhere in a zone activates it.

**Click a cell:** adds it to the active zone. If it's already in the active zone, removes it. The other zone is untouched — the same cell code can exist in both zones simultaneously (e.g., TP in both numerator and denominator). Visual feedback: blue highlight = in numerator, orange highlight = in denominator, half-blue/half-orange with purple outline = in both.

**Drag a cell:** drag from either matrix directly to the numerator or denominator zone.

**Move a chip:** drag a chip from one zone to the other.

**Delete a chip:** either click the × (revealed on chip hover) or drag the chip anywhere outside the two zones. The app intercepts the drop with a full-page invisible "trash zone" so the browser never plays the snap-back animation.

**Remember:** saves the current ratio (named or custom) to the comparison table below. Table shows metric name, formula, Black value, White value, and absolute difference.

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

---

## Implementation notes

**N vs n**: `text-transform: uppercase` is intentionally absent from `.cell-abbr`. Capital N = actual negatives (FP+TN), lowercase n = total (grand sum). Removing uppercase lets the case distinction render correctly.

**Border technique**: uses COMPAS dark-border style — `border: 1.5px solid #1e293b` on the grid, `border-right/bottom: 1px solid #1e293b` on every child, then `nth-child(4n)` removes the last-column right border and `nth-child(n+13)` removes the last-row bottom border (16-cell 4×4 grid).

**Smart sum recognition**: `normalizeCodes()` in `app.js` collapses known sums before matching metrics.json. Rules: `{tp,fn}→p`, `{fp,tn}→n`, `{tp,fp}→pp`, `{tn,fn}→pn`, `{p,n}→all`, `{pp,pn}→all`, `{tp,fp,fn,tn}→all`. Applied iteratively until no rule fires. Display formula shows what the user actually built; only recognition is normalized.

**Drag-to-delete trash zone**: a `position:fixed; inset:0; z-index:1` div is appended to `<body>` and shown only during chip drags. The workspace zones have `position:relative; z-index:2` so they remain above it. Any chip dropped outside the zones lands on the trash zone (which calls `preventDefault()` to suppress snap-back), then deletes the chip. The trash zone is hidden synchronously at the top of its `drop` handler — before `render()` removes the dragged element — because removing the element from the DOM during a drop can prevent `dragend` from firing.

**Chip drag effectAllowed**: both matrix cells and workspace chips use `effectAllowed = 'copy'` to match the zone `dragover` handler's `dropEffect = 'copy'`. In Firefox, a mismatch silently prevents `drop` from firing.

---

## Version History

### Version 1 — June 2026
Augmented confusion matrices (4×4 grid with marginals) for Black and White defendants. Ratio workspace with active-zone click model and drag-and-drop. Smart sum recognition via `normalizeCodes()`. Recognition against `data/metrics.json` (10 metrics: TPR, FNR, FPR, TNR, PPV, FDR, NPV, FOR, Accuracy, Prevalence). Live result display below each matrix. Saved metrics comparison table. Chip hover-reveal × button. Drag-to-delete via trash zone. Four-slide tutorial carousel (matches COMPAS pattern: `#explainer` section, `window.restartTutorial()`, slide card CSS, `sv-*` visualization classes). Research footer.

---

## Stretch Goals

### V2
- Tutorial carousel (4 slides) ✓ done
- Compound ratios: named metrics become draggable chips (build LR+ = TPR/FPR by dragging named chips)
- Multiple chips of same type (build F1 = 2·TP / (2·TP+FP+FN))
- Export/print the saved metrics table

### V3
- Dataset switcher: multiple real-world datasets
- The `DATASET` constant in app.js is already structured for this

---

## Research Files

- `research/confusion-matrix-metrics.md` — all 21 Wikipedia metrics with formulas
- `research/narayanan-fairness-definitions.md` — Narayanan's 21 definitions taxonomy
- `research/impossibility-results.md` — Chouldechova + Kleinberg impossibility proofs with COMPAS numbers
