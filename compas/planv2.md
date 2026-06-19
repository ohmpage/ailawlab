# COMPAS Magic Wand Mode — Design & Implementation Plan

## Context

The v1 dashboard uses real COMPAS data and a single universal threshold slider — a realistic counterfactual (courts could have picked a different cutoff). The next feature is a **Magic Wand mode**: sliders that change things no algorithm can actually change — the underlying recidivism base rates and the model's accuracy. The name and metaphor ("wave a magic wand") should be present in the UI but kept professionally understated.

The pedagogical sequence:
1. Student plays with the real threshold slider and notices the FP disparity never closes (v1)
2. Student enters Magic Wand mode and discovers that equalizing base rates *can* close the disparity — but only if we also assume the algorithm was retrained on that new population (the calibration-preserving assumption)
3. The accuracy slider lets them see a world with a less-biased, more accurate algorithm
4. Punchline: fixing the statistics required magic-wanding away structural inequality in recidivism rates — something no risk-score tool can do

---

## Mathematical Model

Magic Wand mode uses a **calibration-preserving synthetic model** that starts from real COMPAS parameters and lets students adjust base rates, thresholds, and accuracy independently. This correctly demonstrates the Chouldechova impossibility theorem while being grounded in the real data.

### Per-group model parameters (derived from real data, per threshold)

For each group g at its own threshold T_g:
```
α_g(T_g) = TP_g / (TP_g + FN_g)     // sensitivity — from real CSV
q_g(T_g) = TP_g / (TP_g + FP_g)     // PPV — from real CSV
```
This is intentionally **per-group**, not averaged. Each group's wand computation derives from that group's actual COMPAS behavior at its current threshold.

### Accuracy interpolation (scales toward perfection)
```
a_g = α_g + A × (1 − α_g)     // A ∈ [0,1], accuracy slider
q_g = q̂_g + A × (1 − q̂_g)
```
At A=0: per-group real COMPAS values (model is biased — groups differ).  
At A=1: both groups reach α=1, q=1 (perfect, unbiased model, FPR → 0).

### Cell counts (per group g, given base rate p_g and N_g fixed)
```
TP = N_g × p_g × α_final
FN = N_g × p_g × (1 − α_final)
FP = N_g × p_g × α_final × (1 − q_final) / q_final
TN = N_g × (1 − p_g) − FP
```

### Key property
```
FP rate_g = p_g × a_g × (1 − q_g) / (q_g × (1 − p_g))
```
- Monotonically increasing in p_g
- At accuracy=0: a_black ≠ a_white, q_black ≠ q_white → equal base rates ≠ equal FP rates (model is still biased)
- At accuracy=1: a=1, q=1 → FP rate = 0 for both groups (perfect model)
- At accuracy=1 + equal base rates: both fairness standards satisfied simultaneously
- **The full lesson**: fixing FP disparity requires BOTH equal base rates AND an unbiased model — neither alone is sufficient

PPV (Score Accuracy) stays fixed at q_g for each group regardless of base rate — calibration is preserved by construction.

### Valid range
TN ≥ 0 requires: `p_g ≤ q_final / (α_final×(1−q_final) + q_final)`

With real COMPAS averages (α≈0.62, q≈0.61): max valid base rate ≈ 72%.  
At perfect accuracy (A=1): valid range expands to 0–100%.  
**Slider hard caps: 5% (min) to 75% (max).**

---

## New State Variables (app.js)

```javascript
let wandMode        = false;
let thresholdBlack  = 5;     // initialized from threshold on wand entry
let thresholdWhite  = 5;     // initialized from threshold on wand entry
let baseRateBlack   = null;  // initialized from real data on load
let baseRateWhite   = null;  // initialized from real data on load
let accuracy        = 0;     // 0 = real COMPAS per-group accuracy, 1 = perfect
```

The universal `threshold` variable (already in app.js) is unchanged and continues to drive real-mode. When entering wand mode, `thresholdBlack` and `thresholdWhite` are both initialized to `threshold`.

---

## New Computation (app.js)

### `computeMatrixWand(race, thresh, baseRate)`
Derives per-group real α and q from the CSV at the given threshold, scales by accuracy, applies base rate:
```javascript
function computeMatrixWand(race, thresh, baseRate) {
  const m = computeMatrix(race, thresh);          // real data at this threshold
  const N = m.n;
  const nRecid = m.TP + m.FN;
  const a0 = nRecid > 0 ? m.TP / nRecid : 0.5;  // real sensitivity
  const q0 = (m.TP + m.FP) > 0 ? m.TP / (m.TP + m.FP) : 0.5;  // real PPV

  const a = a0 + accuracy * (1 - a0);            // scaled by accuracy slider
  const q = q0 + accuracy * (1 - q0);

  const TP = N * baseRate * a;
  const FN = N * baseRate * (1 - a);
  const FP = N * baseRate * a * (1 - q) / q;
  const TN = N * (1 - baseRate) - FP;
  return { TP: Math.round(TP), FP: Math.round(FP), FN: Math.round(FN), TN: Math.round(TN), n: N };
}
```

No separate `computeSharedParams` needed — params are derived inline per group.

### `render()` change
```javascript
function render() {
  const black = wandMode
    ? computeMatrixWand('African-American', thresholdBlack, baseRateBlack)
    : computeMatrix('African-American', threshold);
  const white = wandMode
    ? computeMatrixWand('Caucasian', thresholdWhite, baseRateWhite)
    : computeMatrix('Caucasian', threshold);
  // ... rest unchanged; updateThresholdUI() only fires in real mode
}
```

In wand mode, the threshold header banner is replaced by two per-group threshold labels (updated separately).

---

## HTML Changes (index.html)

### Magic Wand toggle button
Add to the `.control-card`, after the threshold slider section:
```html
<div class="wand-toggle-row">
  <button id="btn-wand-enter" class="wand-btn">🪄 Wave the Magic Wand</button>
</div>
```

### Magic Wand controls (hidden until wand mode active, replaces control-card content)
Five sliders organized under three labeled intervention sections:

```html
<div class="wand-card hidden" id="wand-controls">
  <div class="wand-banner">
    <span class="wand-badge">🪄 Magic Wand</span>
    Hypothetical — numbers are simulated, not from actual COMPAS data.
    <button id="btn-wand-exit">← Return to Reality</button>
  </div>

  <!-- Intervention 1: Race-specific thresholds -->
  <div class="wand-section">
    <div class="wand-section-label">Intervention 1 — Race-specific high-risk cutoff</div>
    <div class="wand-slider-group">
      <div class="wand-thresh-header">
        Black defendants: scores <strong id="thresh-black-val">5</strong> and above → High Risk
        <span class="threshold-tag" id="thresh-black-tag"></span>
      </div>
      <input type="range" id="thresh-black-slider" min="1" max="10" value="5">
      <!-- tick marks same pattern as v1 -->
    </div>
    <div class="wand-slider-group">
      <div class="wand-thresh-header">
        White defendants: scores <strong id="thresh-white-val">5</strong> and above → High Risk
        <span class="threshold-tag" id="thresh-white-tag"></span>
      </div>
      <input type="range" id="thresh-white-slider" min="1" max="10" value="5">
    </div>
  </div>

  <!-- Intervention 2: Base rates -->
  <div class="wand-section">
    <div class="wand-section-label">Intervention 2 — Underlying reoffense rate</div>
    <div class="wand-slider-group">
      <label>Black defendants: <strong id="br-black-val">51%</strong></label>
      <input type="range" id="br-black-slider" min="5" max="75" step="1">
    </div>
    <div class="wand-slider-group">
      <label>White defendants: <strong id="br-white-val">39%</strong></label>
      <input type="range" id="br-white-slider" min="5" max="75" step="1">
    </div>
  </div>

  <!-- Intervention 3: Model accuracy -->
  <div class="wand-section">
    <div class="wand-section-label">Intervention 3 — Model accuracy</div>
    <div class="wand-slider-group">
      <label>Accuracy: <strong id="accuracy-val">Current (COMPAS)</strong></label>
      <input type="range" id="accuracy-slider" min="0" max="100" step="1" value="0">
    </div>
  </div>

  <p class="wand-disclaimer">
    Equalizing base rates also requires retraining COMPAS on the new population —
    the algorithm must recalibrate to the new reality.
  </p>
</div>
```

### Wand mode class on `<main>`
JS adds/removes `class="wand-mode"` on `<main>` to trigger visual treatment.

---

## CSS Changes (style.css)

### Visual treatment — "magic wand / hypothetical world"
The mode switch is professional but unmistakably different from reality. Key signals:
- Matrix cards get a subtle gold/amber tint (echoing the `--gold` palette variable) and a dashed border
- A "HYPOTHETICAL" watermark treatment on the group header area (or the badge is enough)
- The wand banner is navy with a gold accent badge — serious, not playful

```css
main.wand-mode .matrix-card {
  border: 2px dashed var(--gold);
  background: #fffbf0;  /* very faint warm gold — not real data */
}

main.wand-mode .group-header h2::after {
  content: " (hypothetical)";
  font-size: 0.7rem;
  font-style: italic;
  color: var(--muted);
  font-weight: normal;
}
```

### Wand controls and banner
- `.wand-controls`: white card, same shadow as control-card, replaces the normal threshold-only card visually
- `.wand-banner`: navy background, white text, gold `🪄 Magic Wand` badge
- `.wand-badge`: pill badge in `--gold` color on navy background
- `.wand-btn`: subtle gold-bordered button, not alarming — `border: 1px solid var(--gold); color: var(--navy)`
- `.wand-disclaimer`: small italic muted text at bottom of wand controls card

### Wand slider groups
- Same slider mechanics as threshold slider
- Accent color for base rate sliders: `--gold` instead of `--red` (visually distinct from the real slider)
- Ticks only at labeled positions: 5%, current real value (marked with a pip), 75%

---

## UX Flow

**Mode switch — whole page transforms:**

1. **Enter**: user clicks "🪄 Wave the Magic Wand" → normal control card hidden; wand card appears (banner + 3 labeled intervention sections + 5 sliders + disclaimer); matrix cards get dashed gold tint; all sliders pre-loaded to match current reality (both thresholds = current universal threshold, base rates = real data values, accuracy = 0)
2. **Interact**: any of the 5 wand sliders live-update both matrices simultaneously
3. **Exit**: "← Return to Reality" → wand card hidden, normal control card reappears, visual treatment clears, real data resumes from `computeMatrix` with unchanged universal `threshold`

The stat explainer popups (click-to-open fraction diagrams) continue to work unchanged in wand mode — the formula explanation is model-independent.

---

## Initialization

On data load, compute real base rates and store them:
```javascript
baseRateBlack = (black.TP + black.FN) / black.n;   // ≈ 0.514
baseRateWhite = (white.TP + white.FN) / white.n;   // ≈ 0.394
```

On wand mode entry:
```javascript
thresholdBlack = threshold;   // match current universal slider
thresholdWhite = threshold;
accuracy       = 0;
// baseRateBlack and baseRateWhite already set from data load
// push all values to slider elements
```
This ensures wand mode opens showing numbers identical to v1.

---

## Files to Modify

- `compas/js/app.js` — new state (`wandMode`, `thresholdBlack`, `thresholdWhite`, `baseRateBlack`, `baseRateWhite`, `accuracy`), `computeMatrixWand`, updated `render()`, event listeners for 5 new sliders + 2 toggle buttons + wand entry/exit logic
- `compas/index.html` — "Wave the Magic Wand" button; wand card (banner + 3 labeled intervention sections + 5 sliders + disclaimer)
- `compas/css/style.css` — `main.wand-mode` visual treatment, wand card/section/slider styles, `wand-section-label` typography

---

## Verification

1. **Normal mode unchanged**: everything behaves exactly as v1 — no visual difference
2. **Enter wand mode**: click "🪄 Wave the Magic Wand"
   - Gold-tinted dashed-border treatment on matrix cards
   - Wand controls card appears; normal control card hidden
   - Numbers match v1 exactly (all sliders at real values, accuracy = 0)
3. **Race-specific thresholds**: raise Black threshold to 7, lower White to 4 → FP rates shift; Black FP drops, White FP rises; `(hypothetical)` labels appear on headers
4. **Reset thresholds to same value**: FP rates return to comparable levels
5. **Equalize base rates** (leave thresholds same): FP rates get closer but don't fully converge (model still biased — correct behavior)
6. **Raise accuracy slider**: FP rates and miss rates both decline; at max accuracy + equal base rates → FP rates converge to near 0%
7. **Return to Reality**: numbers snap back to real COMPAS data; wand button reappears; universal threshold unchanged
