# Inherent Trade-Offs in the Fair Determination of Risk Scores

Jon Kleinberg, Sendhil Mullainathan, Manish Raghavan

arXiv: 1609.05807 (September 2016)  
Published: Proceedings of Innovations in Theoretical Computer Science (ITCS), 2017

Source: https://arxiv.org/abs/1609.05807

---

## Context

Published in September 2016, just four months after ProPublica's "Machine Bias." This is one of two nearly simultaneous CS theory papers (the other is Chouldechova 2017) that showed the ProPublica / Northpointe dispute was not about anyone making a math error — it was about an underlying mathematical impossibility.

Kleinberg (Cornell), Mullainathan (Harvard/Chicago), and Raghavan (Cornell) are prominent computer scientists. Mullainathan is also an economist who has done extensive empirical work on racial bias in hiring and lending.

---

## The Three Fairness Conditions

The paper formalizes three properties that a risk score might be required to satisfy:

1. **Calibration within groups** — Among defendants assigned a predicted probability *p* of recidivism, the fraction who actually recidivate should equal *p*, and this should hold separately for each racial group. (If the score says 70% risk, roughly 70% of those people — Black and white alike — should actually reoffend.)

2. **Balance for the positive class** — Among defendants who *do* reoffend, the average predicted risk score should be equal across groups. (Recidivists of all races should receive similar average scores.)

3. **Balance for the negative class** — Among defendants who *do not* reoffend, the average predicted risk score should be equal across groups. (Non-recidivists of all races should receive similar average scores.)

---

## The Impossibility Theorem

> **Main result:** Except in two degenerate cases, no method can simultaneously satisfy all three conditions.

The two degenerate escape hatches:
1. **Perfect prediction** — if the classifier is 100% accurate, all three conditions can hold simultaneously.
2. **Equal base rates** — if Black and white defendants recidivate at exactly the same rate, there is no fundamental conflict.

In the real world, neither condition holds: the classifier is imperfect, and (because of historical inequalities in policing, prosecution, and socioeconomic conditions) measured recidivism rates differ by race in the Broward County data.

Therefore, in the real world, **someone must lose**: a system cannot simultaneously be calibrated within groups *and* equalize error rates across groups.

---

## Why the Conflict Arises (Intuition)

Calibration means: a score of 7 out of 10 means the same probability for everyone. If Black defendants have a higher base rate of measured recidivism, and if the score is calibrated, then a calibrated score of 7 for a Black defendant and a 7 for a white defendant reflect the same probability — but they were drawn from populations with different proportions of true recidivists.

When you apply a fixed threshold (e.g., "scores ≥ 5 are High risk") to both populations, you will mechanically generate different false positive rates. A white defendant with a score of 5 comes from a lower-prevalence population, so among white defendants at that score, there are proportionally more non-recidivists who will be mislabeled. Mathematically, you cannot equalize the false positive rates across groups without de-calibrating the scores.

---

## The Key Normative Implication

The paper does not say which definition of fairness is correct. That is a moral and political question, not a mathematical one. What it shows is that **you must choose** — and that the choice cannot be avoided by designing a better algorithm. The impossibility is not a bug in COMPAS; it is a structural feature of any risk prediction system applied to groups with unequal base rates.

This transforms the ProPublica / Northpointe debate: both sides were mathematically correct. ProPublica showed COMPAS failed their definition of fairness. Northpointe showed it satisfied theirs. The disagreement was about *which definition to require* — a question for legislatures, courts, and society, not algorithms.
