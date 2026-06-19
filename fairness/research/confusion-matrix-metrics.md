# Confusion Matrix Metrics

Source: https://en.wikipedia.org/wiki/Confusion_matrix — "Table of Confusion" section

---

## Notation

Given a binary classifier and ground-truth labels:

- **TP** = True Positives (flagged high-risk, did reoffend)
- **FP** = False Positives (flagged high-risk, did NOT reoffend)
- **FN** = False Negatives (flagged low-risk, did reoffend)
- **TN** = True Negatives (flagged low-risk, did NOT reoffend)

Derived marginals:
- **P** = TP + FN (all actual positives)
- **N** = FP + TN (all actual negatives)
- **PP** = TP + FP (all predicted positives / scored high-risk)
- **PN** = TN + FN (all predicted negatives / scored low-risk)
- **n** = TP + FP + FN + TN (total sample)

---

## The 21 Metrics from Wikipedia's "Table of Confusion"

### Actual-Outcome Rates (derived from row marginals P and N)

| Metric | Formula | Synonyms |
|--------|---------|----------|
| True Positive Rate (TPR) | TP / P | Recall, Sensitivity, Hit Rate, Power, Probability of Detection |
| False Negative Rate (FNR) | FN / P | Miss Rate, Type II Error Rate |
| False Positive Rate (FPR) | FP / N | Fall-out, Type I Error Rate, Probability of False Alarm |
| True Negative Rate (TNR) | TN / N | Specificity, Selectivity |

These four sum in pairs: TPR + FNR = 1 and FPR + TNR = 1.

### Predicted-Value Rates (derived from column marginals PP and PN)

| Metric | Formula | Synonyms |
|--------|---------|----------|
| Positive Predictive Value (PPV) | TP / PP | Precision |
| False Discovery Rate (FDR) | FP / PP | — |
| Negative Predictive Value (NPV) | TN / PN | — |
| False Omission Rate (FOR) | FN / PN | — |

These four also sum in pairs: PPV + FDR = 1 and NPV + FOR = 1.

### Overall Performance Metrics

| Metric | Formula | Notes |
|--------|---------|-------|
| Accuracy (ACC) | (TP + TN) / n | Most familiar; misleading when base rates differ |
| Balanced Accuracy (BA) | (TPR + TNR) / 2 | Corrects for class imbalance |
| F1 Score | 2·TP / (2·TP + FP + FN) | Harmonic mean of PPV and TPR |
| Prevalence | P / n | Base rate; determines the impossibility tradeoffs |

### Ratio and Combined Metrics

| Metric | Formula | Notes |
|--------|---------|-------|
| Positive Likelihood Ratio (LR+) | TPR / FPR | How much more likely a positive test is in true positives than false |
| Negative Likelihood Ratio (LR−) | FNR / TNR | How much more likely a negative test is in false negatives than true |
| Diagnostic Odds Ratio (DOR) | (TP · TN) / (FP · FN) | Single summary of classifier skill |
| Threat Score (TS) | TP / (TP + FN + FP) | Also: Critical Success Index, Jaccard Index |
| Fowlkes–Mallows Index (FM) | √(PPV × TPR) | Geometric mean of PPV and TPR |
| Matthews Correlation Coefficient (MCC) | √(TPR·TNR·PPV·NPV) − √(FNR·FPR·FOR·FDR) | Most informative single metric for imbalanced data |
| Informedness (BM) | TPR + TNR − 1 | Bookmaker Informedness; ranges from −1 to 1 |
| Markedness (MK) | PPV + NPV − 1 | Δp; ranges from −1 to 1 |
| Prevalence Threshold (PT) | (√(TPR·FPR) − FPR) / (TPR − FPR) | Score threshold at which test is most useful |

---

## Wikipedia Color Groups

The Wikipedia table arranges metrics in colored regions around the central 2×2:
- **Blue border**: TPR, FNR (left of center — actual positive rates)
- **Red border**: FPR, TNR (right of center — actual negative rates)
- **Purple/teal border**: PPV, FDR (above center — predicted positive rates)
- **Green border**: NPV, FOR (below center — predicted negative rates)
- **Central**: ACC, BA, F1, Prevalence (overall metrics)
- **Outer ring**: LR+, LR−, DOR, FM, MCC, Informedness, Markedness, PT

---

## Which Metrics Can Be Built from TP/FP/FN/TN Chips

The Fairness Definitions app allows users to assemble metrics by combining the 9 draggable quantities (TP, FP, FN, TN, P, N, PP, PN, n). Coverage by V1:

**Directly buildable (one chip / one chip):**
- TPR, FNR, FPR, TNR, PPV, FDR, NPV, FOR, Prevalence ✓

**Buildable (sum in numerator or denominator):**
- Accuracy: (TP + TN) / n ✓
- Threat Score: TP / (TP + FN + FP) — requires TP in both sides, V2

**Require composite operations (V2 or omit):**
- BA, F1, LR+, LR−, DOR, FM, MCC, Informedness, Markedness, PT
