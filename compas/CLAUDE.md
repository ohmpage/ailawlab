# COMPAS Dashboard — Design Philosophy

This document captures the core design intentions for this tool, for reference throughout planning and coding. Written by Paul Ohm; Claude should treat these as standing instructions.

---

## 1. Dashboard, Not Tutorial

This tool should feel like a **playground/dashboard**, not a slideshow or guided tutorial. Students should be able to explore the data in ways that go beyond what the instructor anticipates.

**What this means in practice:**
- Avoid instructional text that says "Step 1: notice X" or labels a sequence of steps
- Bake discovery sequencing into *visual hierarchy* instead: what's visually prominent first, what requires scrolling or a toggle
- All the interesting numbers should be live and explorable — not frozen in an example
- Richness over simplicity: it's okay if not every student finds every feature

---

## 2. Tame the Jargon

The biggest obstacle to teaching this material is the counter-intuitive, proliferating jargon around confusion matrix statistics. Researchers use "predictive parity," "calibration within groups," "error rate balance," "EPV," "ERP" — all slightly different things, none of them intuitive.

**Design decision:** Focus on **two or three fairness measures** maximum, and label them in plain English that expresses *what the measure is for*, not its technical name.

Suggested framings (inspired by Hellman's writing, not her terms):
- Northpointe's standard → something like **"Score Accuracy"** or **"Does the score mean the same thing for everyone?"** — it's about what a score *means* for each group
- ProPublica's standard → something like **"False Alarm Rate"** or **"Are innocent people mislabeled at the same rate?"** — it's about what the score *does to you*
- Base rate → **"Actual reoffense rate by group"** — the underlying cause of the conflict

The dashboard should make it viscerally clear that these are measuring *different things*, not different opinions about the same thing. Hellman's framing is useful: one is about *belief*, the other about *action*.

---

## 3. The Legal Frame: A Lawyer Advising the Court

These students are law students. The dashboard's controls should feel like the levers a **lawyer advising the courts** would actually have. This reframes the impossibility theorem: it's not just a statistical impossibility — it's a *legal* impossibility. There is no option that simultaneously satisfies both fairness standards and passes constitutional muster.

The sequence of discovery should land students here:
1. You can't satisfy both fairness standards with a single threshold
2. The only way to equalize FP rates is race-specific thresholds
3. Race-specific thresholds = explicit racial classification = disparate treatment = Equal Protection strict scrutiny
4. Therefore: the statistical impossibility *and* the legal impossibility are the same dilemma

Mayson (p. 2275) is explicit: if race-specific thresholds are used, "a person with a 20% chance of rearrest will be classified as high risk if he is white but not if he is black." That is the definition of disparate treatment.

---

## 4. Two Distinct Interventions (Not One)

The dashboard should distinguish **two kinds of threshold control**:

### Intervention A: Universal threshold slider
- One slider moves the "high risk" cutoff for *both* racial groups simultaneously
- Legal status: **safe** — a single threshold applies to everyone equally, no racial classification
- Fairness outcome: **cannot satisfy both standards** at any threshold value (the impossibility theorem)
- Students learn: even with full control over the cutoff, no setting produces both calibration and equal FP rates

### Intervention B: Race-specific threshold sliders
- Two sliders — one for Black defendants, one for white defendants
- Legal status: **constitutionally precarious** — explicit racial classification triggers Equal Protection strict scrutiny (Mayson; see also *Parents Involved*)
- Fairness outcome: *can* reduce FP rate disparity (though may worsen FN disparity)
- Students learn: the only mechanical fix for FP disparity requires treating people differently by race, which may itself be illegal

This two-intervention framing is the dashboard's central pedagogical move. The first intervention is legally clean but statistically trapped. The second intervention is the obvious fix that the Constitution may forbid.

---

## 5. Core Visual: Side-by-Side Confusion Matrices

The primary interactive element should be **two confusion matrices displayed side by side** — one for Black defendants, one for white defendants — driven by the threshold controls in Section 4.

**Visual representation of people in the four cells:**
- Each cell should convey not just a number but a *sense of scale* — Hellman's point that these are real people, not statistics
- Consider small person icons (a "people parade" style) or proportional bar fills within each cell
- Labels should be **human-centered**, not statistical jargon — see Section 6

**Secondary controls (possible):**
- Toggle between viewing raw counts vs. rates (percentages)
- Toggle to show/hide derived statistics (FP rate, calibration %, etc.)

---

## 6. Human-Centered Cell Labels

The four cells of the confusion matrix should be labeled in plain English that expresses **whose life is affected**, not what statistical category they occupy. Inspired by how Paul teaches this in lecture:

| Cell | Statistical label | Human-centered label |
|------|------------------|----------------------|
| False Positive | High-risk score, did not reoffend | **"N people who would not have committed another crime remain behind bars"** |
| False Negative | Low-risk score, did reoffend | **"M people commit another crime when the model predicted they would not — affecting victims in the community"** |
| True Positive | High-risk score, did reoffend | People correctly identified as high-risk |
| True Negative | Low-risk score, did not reoffend | People correctly identified as low-risk |

The FP and FN labels are the ones that matter most. They make the fairness tradeoff visceral:
- Reducing FP (keeping fewer non-recidivists locked up) means *raising* the threshold — which simultaneously *increases* FN (more actual recidivists go free)
- The two human costs trade off directly against each other
- And the rates of each error type differ dramatically by race

Note: use **count** language ("N people") not rate language ("X% of defendants") in the cell labels themselves. Rates belong in the derived statistics panel. The cell labels should feel like the defendant's story, not a spreadsheet.

---

## 7. Use Real Data Throughout

Use the actual ProPublica/COMPAS dataset (Broward County, FL, 2013–2014), not fabricated hypothetical numbers. This means:

- **`compas-scores-two-years.csv`** is the primary data source (7,214 defendants after filtering)
- All confusion matrix cells, rates, and statistics should be computed from real records
- Hellman's Blues/Greens numbers are elegant but fabricated — they don't appear in this dashboard
- The real data has the advantage of being *verifiable* — this is the data ProPublica published, and students can cross-check against the original article

The one exception: a "what if the base rates were equal?" hypothetical mode (see below) necessarily departs from the real data, and should be clearly labeled as counterfactual.

---

## 8. The Base Rate Reveal (Keep It for the Middle)

The fact that Black and white defendants in the dataset have different underlying recidivism rates (approximately 51% vs. 39%) is the **mathematical cause** of the FP rate disparity. This is the key insight of the Kleinberg and Chouldechova impossibility results.

**This should not be front-loaded.** Let students first:
1. Notice the FP rate disparity in the side-by-side matrices
2. Notice that the score accuracy (calibration) is roughly equal for both groups
3. Feel the tension: how can both be true simultaneously?

*Then* reveal the base rate — via a toggle, a "why does this happen?" disclosure, or a clearly labeled second panel.

**Possible "aha" moment design:**
- A toggle that shows the base rates for each group alongside a brief explanation of why this forces the FP disparity
- Followed by an "impossibility" statement: "When two groups have different recidivism rates and the algorithm is calibrated, equal false positive rates are mathematically impossible"

**Stretch idea (discuss before implementing):** A "what if the base rates were equal?" counterfactual mode — a toggle that rebalances the data as if both groups had the same recidivism rate. The FP disparity collapses. This proves the impossibility theorem kinetically, with the real data. Should be clearly labeled as hypothetical.

---

## Sequence of Discovery (Intended, Not Enforced)

The design should *support* this sequence without *requiring* it:

1. Student sees two confusion matrices for Black and white defendants (single threshold, Northpointe's default)
2. Student notices the FP rate is much higher for Black defendants — and reads the human-centered cell labels to feel the stakes
3. Student checks calibration — it's roughly equal for both groups
4. Student feels the contradiction ("how can both be true?")
5. Student tries moving the universal threshold slider — realizes no setting fixes the disparity
6. Student discovers the base rate difference (via toggle or scroll) — the mathematical cause becomes clear
7. Student is given the race-specific threshold controls — and sees that FP rate disparity can be narrowed
8. Student is asked: but is this legal? — realizes this is an explicit racial classification
9. Student lands at the impossibility: no option is both statistically fair *and* legally safe

---

## What This Tool Is NOT

- Not a tutorial with step-by-step narration
- Not a comprehensive survey of all fairness measures (there are 20+ in the literature; we show 2–3)
- Not focused on the legal analysis (Hellman's Part III, the *Loomis* case, etc.)
- Not a presentation of the Northpointe algorithm internals (the 137 questions, the score factors)

---

## Research Files

All primary and secondary sources are in `compas/research/`:
- `machine-bias.md` — ProPublica main article (Angwin et al., 2016)
- `methodology.md` — ProPublica methodology (Larson et al., 2016)
- `kleinberg-mullainathan-raghavan.md` — Impossibility theorem (ITCS 2017)
- `chouldechova.md` — Algebraic impossibility proof (*Big Data*, 2017)
- `flores-bechtel-lowenkamp.md` — Criminal justice rejoinder (*Federal Probation*, 2016)
- `northpointe-dieterich.md` — Northpointe's technical response (2016)
- `hellman-measuring-algorithmic-fairness.md` — Law review analysis, Blues/Greens analogy (106 Va. L. Rev. 811, 2020)
- `mayson-bias-in-bias-out.md` — Legal trap analysis; "no easy fixes" (128 Yale L.J. 2218, 2019)

Data is in `compas/data/`:
- `compas-scores-two-years.csv` — Primary dataset (7,214 defendants; verified against ProPublica's published numbers)
- `compas-scores-two-years-violent.csv` — Violent recidivism subset (4,743 defendants)
- `compas-scores-raw.csv` — Raw pre-filter data (60,843 rows; multiple assessments per person)
