# Measuring Algorithmic Fairness

Deborah Hellman  
D. Lurton Massee, Jr. Professor of Law and Roy L. and Rosamond Woodruff Morgan Professor of Law, University of Virginia School of Law

*Virginia Law Review*, Vol. 106, pp. 811–866 (June 2020)

Source: https://virginialawreview.org/wp-content/uploads/2020/06/Hellman_Book.pdf

---

## Overview

This is the most accessible and carefully argued normative treatment of the ProPublica/Northpointe debate in the legal literature. Hellman's central move is to reframe the debate: what looked like two competing *definitions of fairness* are actually measures suited to two entirely different questions — one about *belief*, one about *action*. This reframing leads her to side, ultimately, with a version of ProPublica's concern, but on grounds that survive the standard objection (that unequal error rates just reflect unequal base rates).

The article makes three contributions: one **conceptual**, one **normative**, and one **legal**.

---

## The Blues and Greens Analogy

To strip away the emotionally charged racial context and expose the underlying mathematical structure, Hellman invents a hypothetical society with two groups, the Greens and the Blues, and a medical disease test. The same confusion tables are then reused for a recidivism context to show the structural identity.

### The confusion tables (disease test version)

**Greens** (n=100, disease prevalence 66%):

|            | Truly Sick | Truly Healthy |
|------------|-----------|--------------|
| Test **+** | 60 (TP)   | 20 (FP)      |
| Test **−** | 6 (FN)    | 14 (TN)      |

**Blues** (n=100, disease prevalence 38%):

|            | Truly Sick | Truly Healthy |
|------------|-----------|--------------|
| Test **+** | 16 (TP)   | 5 (FP)       |
| Test **−** | 22 (FN)   | 57 (TN)      |

### The same tables reused for recidivism (Table 3-1, 3-2)

In the recidivism translation: **Greens = Blacks** (higher base rate), **Blues = Whites** (lower base rate). "Sick" becomes "will recidivate." High Risk = positive. Low Risk = negative.

### What the tables show

**Predictive value (calibration / EPV)** — approximately equal:
- Greens PPV: 60/80 = **0.75**; Blues PPV: 16/21 = **0.76**
- Greens NPV: 14/20 = **0.70**; Blues NPV: 57/79 = **0.72**

The test "means the same thing" for both groups. A positive result is ~75% accurate for Greens and ~76% for Blues. This is **Northpointe's fairness standard** — satisfied.

**Error rates** — sharply divergent:

For **Greens (Blacks)**: Among the *healthy* (non-recidivists):
- 20 out of 34 healthy Greens test positive → **false positive rate = 59%**

For **Greens (Blacks)**: Among the *sick* (recidivists):
- 6 out of 66 sick Greens test negative → **false negative rate = 9%**

For **Blues (Whites)**: Among the *healthy* (non-recidivists):
- 5 out of 62 healthy Blues test positive → **false positive rate = 8%**

For **Blues (Whites)**: Among the *sick* (recidivists):
- 22 out of 38 sick Blues test negative → **false negative rate = 58%**

Greens/Blacks: FP rate >> FN rate  
Blues/Whites: FN rate >> FP rate

This asymmetry in the *direction* of error is **ProPublica's fairness concern** — the disparity in false positive rates is stark. Northpointe says this is just a consequence of the base rate difference. Hellman says it is meaningful, but for specific reasons.

---

## Part I: The Conceptual Claim — Predictive Parity Is About Belief, Not Action

**The key insight:** Predictive parity (EPV) answers the question "given this score, what should I *believe*?" But fairness in treatment is about what we should *do*, not what we should believe.

Hellman illustrates the belief/action gap with two examples:

**Leslie, the Baby, and the Bat:** A doctor believes the baby almost certainly doesn't have rabies (low probability). But the doctor still recommends rabies shots — because the cost of a false negative (untreated rabies = death) is catastrophic. What we *do* is determined by the *costs of errors*, not just by our probability estimates.

**Different Legal Standards:** A juror has 75% confidence John committed assault. That belief justifies *different actions* in a criminal vs. civil case (acquit vs. find liable) — because the criminal system weights false positives (convicting the innocent) as 10× more costly than false negatives (the Blackstone ratio).

**The upshot:** Predictive accuracy informs belief. But in deciding what to *do* to a person, what matters is how we balance the cost of false positives vs. false negatives. That is a normative choice, not a statistical one.

**Corollary:** A lack of predictive parity (unequal EPV) is *not* directly a fairness complaint — it tells us the score means something slightly different for each group, but without knowing *how* the inaccuracy operates (which direction, false positives or negatives), we can't say who is harmed. Northpointe's choice of EPV as the fairness standard is therefore asking the wrong question.

---

## Part II: The Normative Claim — Error Ratio Parity

### What Hellman argues for

Hellman's novel measure is **Error Ratio Parity (ERP)**: the *ratio* of false positive rate to false negative rate should be the same for each group.

This is a refinement of ProPublica's approach. ProPublica focused on absolute disparities in false positive rates. Hellman focuses on the *balance* between the two types of errors within each group. Her claim:

> "Fairness between protected groups scored by the algorithm requires that we balance false positives versus false negatives in the same way for each group."

The Blackstone ratio (10:1 against false positives) is a rule. If that rule applies to white defendants but a different rule — one more tolerant of false positives — applies to Black defendants, that is disparate treatment:

> "We should not treat blacks like terrorists and whites like Englishmen by weighing false negatives as especially costly for blacks and false positives as especially costly for whites."

In the COMPAS data: Black defendants face many more false positives than false negatives. White defendants face many more false negatives than false positives. The algorithm implicitly applies *different* error-balancing rules to the two groups.

### Why ERP is not sufficient on its own

Hellman is careful: a lack of ERP does not *prove* unfairness. It results from the base rate difference. More Blacks are predicted high-risk (both correctly and incorrectly) because the data shows higher recidivism rates. This alone could explain the FP disparity.

But ERP gives normative reasons to:
1. **Investigate the data harder.** When the stakes are this high — and when the group affected has a history of discrimination — the potential for measurement error (arrests ≠ actual crime) is a moral reason to demand more careful validation.
2. **Watch for compounding injustice.** If Blacks have higher measured recidivism rates partly because of discriminatory policing, inferior schools, or structural disadvantage, using those base rates to justify continued adverse treatment compounds the prior injustice.

> "The lack of error ratio parity raises the stakes and as such requires us to look more deeply and more carefully at what is going on."

### The Slacker Bump

Hellman rejects the argument (associated with Aziz Huq) that harm to scored individuals can be made up by benefits to other members of the same group. In the exam analogy: if prepared men are mis-scored as unprepared (high FN rate for men), that unfairness cannot be offset by benefits to unprepared men who don't compete with them. Similarly, you cannot make up for false-positive-burdened Black defendants by pointing to crime victims (mostly also Black) who benefit from incarceration of true positives.

---

## Part III: The Legal Claim — Racial Classification Is Not Always Disparate Treatment

This part is the most distinctively legal. Hellman argues that:

1. **Neither choice of fairness standard constitutes disparate treatment.** Designing COMPAS for predictive parity (EPV) is a form of disparate *impact*, not disparate *treatment*, because the designers did not choose it *because of* its racial effects (only "in spite of" them). Same for choosing ERP. Both are legally permissible.

2. **Using race explicitly within algorithms may also be permissible** — if done correctly. Algorithms could improve both accuracy and fairness by taking race into account when determining which other features to weight. This would shrink the error ratio disparities.

3. **Two legal examples show that racial classification ≠ disparate treatment:**
   - *Census racial data collection* (Morales v. Daley): collecting racial information is not the same as *using* it against people. Direct effect required.
   - *Racial suspect descriptions* (Brown v. City of Oneonta): police focusing on a racial group based on victim description is not disparate treatment because the underlying generalization is about *eyewitness reliability*, not about *racial propensity to crime*.

4. **The application to algorithms:** Using race within an algorithm to determine which other features predict recidivism for each group (e.g., housing instability predicts recidivism for whites but not for Blacks) is:
   - Not *proximate* (race just determines feature weighting, not the outcome directly)
   - Not a *racial generalization* (the algorithm generalizes about housing instability's predictive power, not about racial propensity to crime)
   - Therefore, not clearly disparate treatment → not subject to strict scrutiny

5. ***Ricci v. DeStefano* is inapplicable**: that case involved identifiable people who had relied on a test and were then denied promotions. Prospective algorithmic design changes affect no specific identifiable individuals and thus Ricci's rationale doesn't apply.

**Hellman's bottom line on law:** The law creates less of a barrier to using race within algorithms than most computer scientists and legal scholars assume. The perception of illegality is overstated, and it has caused designers to forgo approaches that would genuinely improve both accuracy and fairness.

---

## Implications for Dashboard Design

**The Blues/Greens disease-test framing is pedagogically powerful** because:
- It strips away racial context and shows the abstract structure
- Students can see that the *same numbers* generate both Northpointe-style and ProPublica-style readings
- The disease metaphor is immediately intuitive (false positive = healthy person told they're sick)
- The same tables can then be "translated back" to the recidivism context

**Key pedagogical sequence Hellman models:**
1. Present the confusion tables for Blues and Greens
2. Calculate PPV/NPV → show they're equal → Northpointe's claim is true
3. Calculate FP/FN rates → show they're dramatically unequal → ProPublica's claim is true
4. Ask: how can both be true simultaneously?
5. Explain: because the base rates differ, the math forces this tradeoff
6. Ask: which measure is the right one for fairness? Now introduce the normative debate.

**Hellman's belief/action distinction** is a powerful framing for law students: Northpointe's measure tells you what to *believe* about a scored individual; ProPublica's measure tells you how the system *acts* on groups. In criminal justice, where the stakes of action are liberty, the action-oriented measure has stronger claim to being the fairness standard.

**Her ERP measure** (ratio of FP:FN) is potentially more precise than raw FP rate comparisons and captures the "different rules for different races" intuition vividly.

**Part III** (the legal claim) confirms your instinct that it's marginal for the dashboard. It engages constitutional equal protection doctrine and will likely distract from the core statistical lesson. However, two points from Part III are worth preserving:
- The observation that both design choices (EPV or ERP) are legally permissible (neither is required by law)
- The compelling argument that using race explicitly to improve accuracy might also be permissible — which raises a provocative question: if we *could* fix the bias by adding race to the algorithm, should we?

---

## Key Terms (Hellman's vocabulary)

| Term | Hellman uses | Other names |
|------|-------------|-------------|
| EPV (Equal Predictive Value) | her term | predictive parity (Chouldechova), calibration within groups (Kleinberg) |
| Error Rate Balance | Chouldechova's term she adopts | balance for positive/negative class (Kleinberg) |
| **ERP (Error Ratio Parity)** | **her novel term** | — (this is her innovation) |
