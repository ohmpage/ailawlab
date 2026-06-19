# Fair Prediction with Disparate Impact: A Study of Bias in Recidivism Prediction Instruments

Alexandra Chouldechova (Carnegie Mellon University)

arXiv: 1703.00056 (February 2017)  
Published: *Big Data*, Vol. 5, No. 2, pp. 153–163 (2017)  
DOI: 10.1089/big.2016.0047

Source: https://arxiv.org/abs/1703.00056

---

## Context

Published simultaneously (and independently) with the Kleinberg et al. paper, also proving the impossibility result. While Kleinberg et al. prove it in terms of three abstract fairness conditions, Chouldechova's paper is more directly engaged with the COMPAS data and proves the result algebraically — deriving the exact mathematical constraint that links the fairness measures, so you can see *precisely* how they trade off.

---

## The Two Fairness Criteria in Conflict

**Calibration (Northpointe's standard):**  
Among defendants with a given risk score, the fraction who actually recidivate should be the same across racial groups. In practice, this means the score means the same thing regardless of race: a 7 is a 7. Northpointe demonstrated COMPAS satisfies this.

**Error Rate Balance (ProPublica's standard):**  
The false positive rate (fraction of non-recidivists labeled high-risk) and the false negative rate (fraction of recidivists labeled low-risk) should be equal across racial groups. ProPublica showed COMPAS fails this: Black defendants are falsely labeled high-risk at nearly double the rate of white defendants.

---

## The Key Mathematical Relationship

Chouldechova derives an algebraic identity that shows the relationship between these measures:

Let, for a given group:
- *PPV* = positive predictive value (fraction of high-risk-scored who actually recidivate)
- *NPV* = negative predictive value (fraction of low-risk-scored who actually don't recidivate)
- *FPR* = false positive rate
- *FNR* = false negative rate
- *p* = prevalence (base rate of recidivism in the group)

Then:

> *PPV* = p(1 − FNR) / [p(1 − FNR) + (1 − p)(FPR)]

This identity shows that **PPV is determined by FNR, FPR, and prevalence.** If two groups have the same PPV (calibration / predictive parity) but different prevalence *p*, they **cannot** have the same FPR and FNR simultaneously — unless prediction is perfect.

In plain English: if you force the score to be equally accurate across groups (same PPV), and recidivism rates differ by group, then the false positive and false negative rates must differ. There is no mathematical escape.

---

## The Impossibility Theorem

> When recidivism prevalence differs across groups, a risk prediction instrument that satisfies calibration (equal predictive values) cannot simultaneously satisfy error rate balance (equal false positive and false negative rates) — except when predictions are perfect.

Since Black and white defendants in Broward County have different base rates of recorded recidivism (approximately 51% vs. 39% in the ProPublica dataset), and since COMPAS is far from perfect (overall accuracy ~61%), both cannot simultaneously hold.

---

## Chouldechova's Framing

Chouldechova frames this not as a reason to condemn COMPAS but as a structural challenge:

> "Disparate impact can arise from a recidivism prediction instrument that fails to satisfy error rate balance even when the instrument itself is free of racial bias in any direct sense."

The paper is careful to distinguish between:
- **Disparate impact** — the observable fact that Black defendants face higher false positive rates
- **Predictive bias** — whether the score systematically over- or under-predicts for a given group

COMPAS satisfies the second criterion (calibration within groups) while failing the first. The impossibility result shows you cannot simultaneously fix both.

---

## Why This Paper Is Especially Useful for Teaching

Chouldechova gives you the actual equation. Students can plug in the real COMPAS numbers (PPV ≈ 0.63 for Black defendants, PPV ≈ 0.59 for white defendants; prevalence ≈ 51% vs. 39%) and verify for themselves that the false positive rates *must* differ — and by roughly how much. The impossibility is not abstract; it is derivable from first principles with real data.
