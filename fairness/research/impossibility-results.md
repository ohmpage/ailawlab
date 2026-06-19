# Impossibility Results in Algorithmic Fairness

---

## The Core Result

Two papers, published independently and near-simultaneously in 2016–2017, proved that common fairness criteria cannot all be satisfied simultaneously when group base rates differ.

---

## Chouldechova (2017)

**Citation:** Chouldechova, A. "Fair Prediction with Disparate Impact: A Study of Bias in Recidivism Prediction Instruments." *Big Data* 5(2): 153–163, 2017. https://arxiv.org/abs/1703.00056

**The algebraic identity:**

> PPV = p(1 − FNR) / [p(1 − FNR) + (1 − p) · FPR]

Where p = prevalence (base rate of recidivism in the group).

**What this means:** PPV is fully determined by FNR, FPR, and p. If two groups have equal PPV (calibration) but different base rates p, they cannot also have equal FPR and FNR simultaneously — unless prediction is perfect (FNR = 0, FPR = 0).

**The impossibility:** When prevalence differs across groups, a well-calibrated classifier cannot simultaneously satisfy:
1. Equal PPV (Predictive Parity / Northpointe's standard)
2. Equal FPR (ProPublica's main claim)
3. Equal FNR

**The COMPAS case:**
- Black defendants: p ≈ 51.4%
- White defendants: p ≈ 39.4%
- COMPAS achieves roughly equal PPV (~63% Black, ~59% White)
- Therefore, COMPAS mathematically *cannot* achieve equal FPR
- Observed: FPR ≈ 44.9% (Black) vs. 23.5% (White)

**Chouldechova's framing:** This is not evidence of racial bias in the algorithm per se — it is an inevitable consequence of differing base rates combined with calibration. "Disparate impact can arise from a recidivism prediction instrument that fails to satisfy error rate balance even when the instrument itself is free of racial bias in any direct sense."

---

## Kleinberg, Mullainathan & Raghavan (2016)

**Citation:** Kleinberg, J., Mullainathan, S., & Raghavan, M. "Inherent Trade-Offs in the Fair Determination of Risk Scores." ITCS 2017. https://arxiv.org/abs/1609.05807

**Abstract result:** Three desirable properties of a risk score classifier cannot be simultaneously satisfied for two groups with different base rates (unless prediction is perfect or base rates are equal):

1. **Calibration**: For each score value s, the fraction of individuals with that score who are in the positive class is the same across groups. (This is the full score-level version of PPV equality.)
2. **Balance for the positive class**: The average score among individuals in the positive class (Y=1) is the same across groups.
3. **Balance for the negative class**: The average score among individuals in the negative class (Y=0) is the same across groups.

This is a stronger and more general result than Chouldechova's: it applies to continuous risk scores, not just threshold classifiers.

---

## Practical Implications for COMPAS

| Criterion | Black Defendants | White Defendants | Equal? |
|-----------|-----------------|------------------|--------|
| Prevalence (p) | 51.4% | 39.4% | No — this is the root cause |
| PPV (Predictive Parity) | 63.0% | 59.1% | Approximately |
| FPR (False Positive Rate) | 44.9% | 23.5% | No — 2:1 disparity |
| FNR (False Negative Rate) | 28.0% | 47.7% | No — reversed |
| Accuracy | 63.8% | 67.0% | Approximately |
| TPR (Equal Opportunity) | 72.0% | 52.3% | No |

These numbers at COMPAS threshold=5 confirm the impossibility: PPV is roughly equal but FPR differs dramatically — exactly as the algebra predicts.

---

## The Two Special Cases Where the Impossibility Doesn't Apply

1. **Perfect prediction**: When FPR = 0 and FNR = 0 for all groups, all fairness criteria can be simultaneously satisfied.
2. **Equal base rates**: When prevalence is identical across groups, calibration no longer constrains FPR and FNR separately.

Both conditions are unmet in COMPAS: the algorithm is imperfect, and Black and White defendants have materially different recidivism rates in the dataset.

---

## Why the Base Rate Differs

The observed difference in base rates (51.4% vs. 39.4%) reflects the real-world data in Broward County, FL. It is itself the product of structural inequalities: differential policing, prosecution patterns, and socioeconomic factors that correlate with race but whose causal structure is contested. Reducing this base rate difference is a structural intervention — not an algorithmic one.

**Mayson (2019)** makes this point sharply: "The problem is not algorithmic bias but the underlying disparities in the social world that the algorithm is trained to predict." Algorithmic fairness criteria alone cannot address these root causes.

---

## Sources

- Chouldechova, A. (2017). https://arxiv.org/abs/1703.00056
- Kleinberg, J., Mullainathan, S., & Raghavan, M. (2016). https://arxiv.org/abs/1609.05807
- Mayson, S. (2019). "Bias In, Bias Out." 128 Yale L.J. 2218.
- Angwin, J. et al. (2016). "Machine Bias." ProPublica.
