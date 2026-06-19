# How We Analyzed the COMPAS Recidivism Algorithm

ProPublica, May 23, 2016

Source: https://www.propublica.org/article/how-we-analyzed-the-compas-recidivism-algorithm

---

## Study Overview

ProPublica examined Northpointe's COMPAS (Correctional Offender Management Profiling for Alternative Sanctions) tool to assess accuracy and racial bias in recidivism predictions. The investigation analyzed "more than 10,000 criminal defendants in Broward County, Florida" over a two-year follow-up period.

Code and calculations published on GitHub for reproducibility.

---

## Data Acquisition

- **Source**: Public records request from Broward County Sheriff's Office
- **Initial sample**: 18,610 individuals scored in 2013–2014
- **Final analysis sample**: 11,757 pretrial defendants after filtering
- **Race classifications used**: Black, white, Hispanic, Asian, Native American, and Other (343 cases)
- **Record-matching error rate**: ~3.75% (±1.8%)

---

## Key Definitions

**Recidivism** was defined as "a finger-printable arrest involving a charge" following the initial COMPAS assessment. Researchers excluded:
- Traffic violations
- Municipal ordinances
- Failure-to-appear arrests

The study focused on offenses occurring **within two years** post-scoring, aligned with Northpointe's own guidance.

Average days not incarcerated in the follow-up window: 622.87 days (SD: 329.19).

---

## Major Findings on Racial Disparities

### General Recidivism Accuracy

- Overall predictive accuracy: **61%** correct predictions
- White defendants: 59% accuracy; Black defendants: 63% accuracy
- However, classification *errors* differed significantly by race

### False Positive Rates (wrongly classified as higher risk)

- **Black defendants who didn't recidivate**: 45% misclassified as high-risk
- **White defendants who didn't recidivate**: 23% misclassified as high-risk
- Black defendants were "nearly twice as likely to be misclassified"

### False Negative Rates (wrongly classified as low risk)

- **White reoffenders misclassified as low-risk**: 48%
- **Black reoffenders misclassified as low-risk**: 28%
- White reoffenders were "mistakenly labeled low risk almost twice as often"

### Logistic Regression Results

Controlling for age, gender, criminal history, and future recidivism:

- Black defendants were **45% more likely** to receive higher risk scores than white defendants
- Race coefficient: **0.477** (p < 0.01) in general recidivism model

---

## Violent Recidivism Analysis

- Predictive accuracy for violent recidivism: only **20%**
- Black defendants: **77% more likely** to receive higher violent risk scores
- Black defendants were twice as likely to be misclassified as higher violent risk
- White violent recidivists misclassified as low-risk: 63% more often than Black counterparts

---

## Contingency Tables (General Recidivism)

Following methodology from a 2006 recidivism study:

| Group               | FP rate  | FN rate  | PPV  | NPV  |
|---------------------|----------|----------|------|------|
| All defendants      | 32.35%   | 37.40%   | 0.61 | 0.69 |
| Black defendants    | 44.85%   | 27.99%   | 0.63 | 0.65 |
| White defendants    | 23.45%   | 47.72%   | 0.59 | 0.71 |

**FP rate** = fraction of non-recidivists scored high-risk  
**FN rate** = fraction of recidivists scored low-risk  
**PPV** (Positive Predictive Value) = fraction of high-risk-scored who actually recidivated  
**NPV** (Negative Predictive Value) = fraction of low-risk-scored who actually didn't recidivate  

---

## Statistical Methods

### Cox Proportional Hazards Model

Researchers employed the same technique Northpointe used in their own validation studies:

- High-risk individuals **3.5× more likely** to recidivate than low-risk
- Concordance score: **63.6%** (compared to Northpointe's claimed 68%)
- Violent recidivism concordance: **65.1%**

### Logistic Regression Model

Control variables included:
- Race and ethnicity
- Age categories (under 25, over 45)
- Number of prior arrests
- Charge type (misdemeanor vs. felony)
- Two-year recidivism outcomes
- Gender

---

## Gender Disparities

Women rated high-risk recidivated at **47.5%**, while high-risk men recidivated at **61.2%** — suggesting "a fact that may be overlooked by law enforcement officials interpreting the score." The same numerical score has different predictive meaning for men and women.

---

## Northpointe's Accuracy Claims vs. ProPublica's Findings

Northpointe claimed overall accuracy of ~68% concordance. ProPublica found 63.6% overall concordance. The companies' own Florida State University validation study (2010) concluded predictive accuracy was "equivalent" across racial groups — but that study examined overall accuracy rates, not the disaggregated false positive and false negative rates that reveal the directional asymmetry.

---

## Context

ProPublica's analysis filled a gap identified by prior researchers. As one academic noted: "The data do not exist" regarding racial bias examination before this study. The investigation came in response to calls from then-U.S. Attorney General Eric Holder for studying "potential bias in the tests used at sentencing."
