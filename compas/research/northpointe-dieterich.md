# COMPAS Risk Scales: Demonstrating Accuracy, Equity, and Predictive Parity

William Dieterich, Christina Mendoza, and Tim Brennan (Northpointe Inc.)

Published: Northpointe technical report (2016)

---

## Context

This is Northpointe's own 37-page technical response to the ProPublica article, written by company employees including founder Tim Brennan. It is not peer-reviewed, but it was influential and widely cited. ProPublica subsequently published a technical rebuttal to this report at propublica.org/article/technical-response-to-northpointe.

---

## Northpointe's Core Argument

Northpointe argues that the appropriate measure of fairness for a risk instrument is **predictive parity**: a score of X should predict the same probability of recidivism regardless of race. They show that COMPAS satisfies this standard.

---

## Key Claims

1. **Predictive parity holds**: Among defendants scoring in a given decile, the recidivism rates are comparable for Black and white defendants. The score "means the same thing" across racial groups.

2. **ProPublica used the wrong threshold**: ProPublica combined "Medium" and "High" scores into a single high-risk category. Northpointe argues this inflated the apparent false positive rate discrepancy.

3. **Base rates explain the difference**: Different recidivism rates between racial groups in the data are the mathematical cause of the different false positive rates — not any discriminatory feature of the algorithm. The algorithm cannot be blamed for accurately reflecting real-world differences in outcomes.

4. **The instrument does not use race**: Race is not a direct input to COMPAS. The questionnaire asks about employment, education, criminal history, peer associations, etc. Any racial disparities in outcomes reflect differences in responses to those questions across groups, not racial targeting.

---

## ProPublica's Counter-Response

ProPublica's technical rebuttal (propublica.org/article/technical-response-to-northpointe) made two main points:

1. **On the threshold issue**: When ProPublica adjusted the cutpoints as Northpointe suggested, the racial disparity in false positive rates was *worse*, not better.

2. **On the logistic regression**: After controlling for recidivism, criminal history, age, and gender, Black defendants were still 45% more likely to receive higher risk scores — suggesting the racial disparity is not fully explained by the base rate difference.

---

## Significance

The Northpointe report crystallized the "predictive parity" position that Flores et al. and the Kleinberg/Chouldechova papers subsequently engaged with. Tim Brennan's own testimony in the *State v. Zilly* case (recounted in "Machine Bias") is notable: even the instrument's creator expressed discomfort with COMPAS being used as the sole basis for sentencing.

---

## Note on Availability

The Northpointe report was published on Northpointe's website but was not in a peer-reviewed journal. Full text has been archived in multiple places. Search for: "Dieterich Mendoza Brennan COMPAS Risk Scales 2016."
