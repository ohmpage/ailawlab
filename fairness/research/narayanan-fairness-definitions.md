# Narayanan: 21 Definitions of Fairness and Their Politics

Arvind Narayanan, FAccT Tutorial, February 2018 (New York)

- Video: https://www.youtube.com/embed/jIXIuYdnyyk
- Abstract/slides: https://facctconference.org/static/tutorials/narayanan-21defs18.pdf
- Notes: https://shubhamjain0594.github.io/post/tlds-arvind-fairness-definitions/

No peer-reviewed paper was published. The FAccT tutorial talk is the canonical form. Notes by Shubham Jain are the best secondary source.

---

## Key Thesis

There is no single "correct" definition of algorithmic fairness. Researchers have proposed at least 21 distinct mathematical criteria, and many pairs of these criteria are provably incompatible. The choice between definitions is not a technical question but a political one — it reflects normative commitments about what fairness means and which kinds of disparate treatment are acceptable.

---

## Group Fairness Criteria (statistical)

These criteria compare statistical properties across demographic groups. Notation:
- A = protected attribute (e.g., race)
- Ŷ = predicted outcome (e.g., COMPAS score ≥ threshold = "high risk")
- Y = true outcome (e.g., two_year_recid = 1)

| # | Name | Condition | Notes |
|---|------|-----------|-------|
| 1 | **Demographic Parity** | P(Ŷ=1\|A=0) = P(Ŷ=1\|A=1) | Equal selection rates. "Statistical parity." Does not control for actual outcomes. |
| 2 | **Conditional Statistical Parity** | P(Ŷ=1\|A=0,L=l) = P(Ŷ=1\|A=1,L=l) | Demographic parity conditioned on legitimate factors L. Allows disparity explained by non-protected features. |
| 3 | **Predictive Parity** | P(Y=1\|Ŷ=1,A=0) = P(Y=1\|Ŷ=1,A=1) | Equal PPV (Positive Predictive Value). Also: calibration within groups. Northpointe's standard for COMPAS. |
| 4 | **Equal NPV** | P(Y=0\|Ŷ=0,A=0) = P(Y=0\|Ŷ=0,A=1) | Equal Negative Predictive Value. "Low-risk score is equally reliable for everyone." |
| 5 | **False Positive Error Rate Balance** | FPR(A=0) = FPR(A=1) | ProPublica's central finding about COMPAS: Black defendants falsely flagged at nearly 2× the rate of White defendants. |
| 6 | **False Negative Error Rate Balance** | FNR(A=0) = FNR(A=1) | Mirror of ProPublica's claim. Equal miss rates across groups. |
| 7 | **Equalized Odds** (Hardt et al. 2016) | TPR and FPR both equal across groups | Requires #5 and #6 simultaneously (or equivalently: equal TPR and FPR). The strongest group error-rate criterion. |
| 8 | **Equal Opportunity** (Hardt et al. 2016) | TPR(A=0) = TPR(A=1) | Weaker than Equalized Odds: only requires equal benefit to actual positives. Hardt et al. argue this is the "minimal" fairness requirement. |
| 9 | **Calibration** (full) | P(Y=1\|score=s,A=0) = P(Y=1\|score=s,A=1) for all s | Score-level calibration. Stronger than Predictive Parity: requires equal reliability at every score level, not just above/below threshold. |
| 10 | **Well-calibration** | P(Y=1\|score=s) = s | Scores are literally probabilities. Requires perfect calibration across all groups jointly. |
| 11 | **Balance for positive class** | E[score\|Y=1,A=0] = E[score\|Y=1,A=1] | Expected score same for actual positives across groups. |
| 12 | **Balance for negative class** | E[score\|Y=0,A=0] = E[score\|Y=0,A=1] | Expected score same for actual negatives across groups. |
| 13 | **Treatment Equality** | FP/FN ratio equal across groups | Chouldechova (2017) uses this formulation: ratio of false positives to false negatives equal. |
| 14 | **Accuracy Equity** | ACC(A=0) = ACC(A=1) | Overall accuracy equal across groups. The weakest group criterion — compatible with large within-cell disparities. |

---

## Individual Fairness Criteria

These criteria evaluate whether similar individuals are treated similarly, regardless of group membership.

| # | Name | Condition | Notes |
|---|------|-----------|-------|
| 15 | **Individual Fairness** (Dwork et al. 2012) | d(x,x') small → d(f(x),f(x')) small | "Similar individuals should receive similar treatment." Requires a task-specific similarity metric — who defines "similar"? Often underspecified. |
| 16 | **Fairness through Unawareness / Blindness** | Protected attribute A not used as a feature | Removing A from the input. Shown to be largely ineffective: proxy variables (zip code, name, linguistic patterns) can restore disparate impact. |
| 17 | **Equal Thresholds** | Single decision threshold applied uniformly | Everyone judged by the same numerical cutoff. Treats individuals identically; does not address group-level disparate impact. |
| 18 | **Counterfactual Fairness** (Kusner et al. 2017) | P(Ŷ\|do(A=a), X=x) = P(Ŷ\|do(A=a'), X=x) | Causal criterion: outcome should be the same in the counterfactual world where the individual's protected attribute differs, holding other causes fixed. Requires a causal model. |

---

## Process and Contextual Criteria

| # | Name | Description |
|---|------|-------------|
| 19 | **Process Fairness** | Whether the *decision-making process* (not just outcome) is perceived as fair. Measured by survey respondents' judgments. Distinct from statistical criteria. |
| 20 | **Diversity** | Ensuring variety in selected items — distance between selections exceeds some threshold. Common in recommendation systems. |

---

## Representational Harm Criteria (for word/image models)

These apply primarily to language models and computer vision, not prediction/classification.

| # | Name | Description |
|---|------|-------------|
| 21a | **Stereotype Mirroring** | System reflects real-world stereotype strength in training data |
| 21b | **Stereotype Exaggeration** | System amplifies stereotypes beyond real-world rates |
| 21c | **Bias Amplification** | Label associations grow more biased from training to evaluation |
| 21d | **Cross-Dataset Generalization** | Model performance consistency across different data sources |
| 21e | **Bias in Representation Learning** | Word/image embeddings contain encoded stereotypes (e.g., word2vec: doctor=man, nurse=woman) |

---

## The Core Impossibility Result

Narayanan's key pedagogical point: satisfying one definition often precludes satisfying another. The most important incompatibility (proved by Chouldechova 2017 and Kleinberg et al. 2016):

When base rates (prevalence) differ across groups, the following three criteria **cannot all hold simultaneously** (except with perfect prediction):

1. Calibration / Predictive Parity (equal PPV)
2. False Positive Error Rate Balance (equal FPR)
3. False Negative Error Rate Balance (equal FNR)

ProPublica showed COMPAS violates #2 (Black defendants have higher FPR).
Northpointe showed COMPAS satisfies #1 (PPV is roughly equal).
Both were telling the truth. The math makes it impossible to satisfy both simultaneously when base rates differ.

---

## Sources

- Narayanan, A. (2018). "21 Definitions of Fairness and Their Politics." FAccT Tutorial.
- Hardt, M., Price, E., & Srebro, N. (2016). "Equality of Opportunity in Supervised Learning." NeurIPS. https://arxiv.org/abs/1610.02413
- Dwork, C., Hardt, M., Pitassi, T., Reingold, O., & Zemel, R. (2012). "Fairness through Awareness." ITCS.
- Kusner, M.J., Loftus, J., Russell, C., & Silva, R. (2017). "Counterfactual Fairness." NeurIPS.
- Chouldechova, A. (2017). "Fair Prediction with Disparate Impact." Big Data. https://arxiv.org/abs/1703.00056
- Kleinberg, J., Mullainathan, S., & Raghavan, M. (2016). "Inherent Trade-Offs in the Fair Determination of Risk Scores." ITCS 2017. https://arxiv.org/abs/1609.05807
