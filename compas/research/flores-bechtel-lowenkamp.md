# False Positives, False Negatives, and False Analyses: A Rejoinder to "Machine Bias"

Anthony W. Flores, Kristin Bechtel, and Christopher T. Lowenkamp

Published: *Federal Probation*, Vol. 80, No. 2 (September 2016)

Source: https://www.uscourts.gov/about-federal-courts/probation-and-pretrial-services/federal-probation-journal/2016/09/false-positives-false-negatives-and-false-analyses-a-rejoinder-machine-bias-theres-software-used  
Also: https://www.crj.org/publication/false-positives-false-negatives-false-analyses-rejoinder/

---

## Who Are the Authors?

Flores, Bechtel, and Lowenkamp are criminal justice researchers, not computer scientists. Lowenkamp in particular has published extensively on risk assessment instruments in the criminal justice context. This is not a Northpointe paper — it is an independent response from the pretrial/corrections research community, published in the leading journal for federal probation professionals.

(Note: Christopher T. Lowenkamp appears in the ProPublica article itself, as the co-author of a 2016 study that found Black defendants got higher scores on another risk tool but concluded the differences were "not attributable to bias" — a finding ProPublica disputed.)

---

## Core Argument

The authors argue that ProPublica's analysis "was based on faulty statistics and data analysis" and "failed to show that COMPAS itself is racially biased."

Their central claim: **ProPublica used the wrong definition of fairness.** The appropriate standard for evaluating a risk instrument is **calibration** (also called predictive accuracy): does a given score predict the same probability of recidivism regardless of race? By this standard, COMPAS performs comparably across racial groups.

---

## On False Positive and False Negative Rates

The authors do not deny ProPublica's numbers — they dispute what those numbers mean.

They argue that differences in false positive and false negative rates across racial groups are an **expected mathematical consequence** of different base rates of recidivism, not evidence of bias in the instrument. If one group recidivates at a higher rate, and the score is calibrated, then mechanically the non-recidivists in that group will face higher false positive rates — not because the instrument treats them differently, but because there are more true positives in the group drawing the threshold down.

In their view, **a calibrated instrument is a fair instrument** — and asking for equal error rates on top of calibration is asking for the mathematically impossible.

---

## Key Claims

1. COMPAS satisfies calibration: a score of 5 predicts roughly the same recidivism probability for Black and white defendants.
2. ProPublica's chosen fairness standard (error rate balance) requires equal base rates across groups to be achievable simultaneously with calibration — a condition that does not hold in the data.
3. The disparities ProPublica found in false positive/negative rates are a mathematical consequence of the base rate difference, not evidence of racial bias in the algorithm.
4. Labeling COMPAS as "biased" on the basis of unequal error rates, while ignoring the base rate difference, reflects a statistical misunderstanding.

---

## What This Paper Does NOT Address

The paper does not engage with the deeper normative question: **Which definition of fairness should we require?** It asserts calibration is the right standard but does not argue for it philosophically. It does not address: why should the criminal justice system be permitted to impose higher false positive rates on Black defendants, even if that is a mathematical consequence of unequal base rates?

---

## Significance

This paper is the most direct and prominent published rejoinder to ProPublica from within the criminal justice research community. Together with the Northpointe technical report (Dieterich et al. 2016) and the Kleinberg/Chouldechova impossibility papers, it defines the landscape of the initial response to "Machine Bias."
