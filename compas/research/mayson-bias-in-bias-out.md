# Bias In, Bias Out

Sandra G. Mayson (University of Georgia School of Law; later University of Pennsylvania)

*Yale Law Journal*, Vol. 128, pp. 2218–2300 (2019)

Source URL (behind paywall): https://yalelawjournal.org/pdf/Mayson_p5g2tz2m.pdf  
Draft version (2016 slides): https://www.law.upenn.edu/live/files/6104-sandy-mayson-optimizing-government-project-11-3-16

---

## Overview

The title is the thesis: the racial bias that comes *out* of risk prediction algorithms was *in* the historical data they were trained on. Mayson's central claim is that this is not an algorithmic problem — it is a problem of **prediction itself**. In a racially stratified world, any method of using the past to predict the future will project historical inequalities forward. Changing the algorithm doesn't fix this; it just moves where the inequality hides.

This makes Mayson's piece more radical than either ProPublica or the CS impossibility papers: she questions not just whether COMPAS is fair, but whether **risk prediction as a practice** can be just in a society with racially unequal criminal justice data.

The article is structured in four parts:
- **Part I** — Prediction and Race: prediction functions as a mirror; two possible sources of racial disparity (distortion vs. differential offense rates)
- **Part II** — Fairness Metrics: a rigorous taxonomy of competing fairness standards
- **Part III** — No Easy Fixes: three commonly advocated strategies all fail
- **Part IV** — Rethinking Risk: positive prescriptions for reform

---

## Citation and Context

Published 2019 in the Yale Law Journal; a precursor lecture/slide version was presented November 2016 at Penn. Hellman cites it for the proposition that improving accuracy (via better data) is the best path to improving fairness. Flores et al. and Northpointe don't engage with it — it's a different kind of critique, more foundational.

---

## The Core Argument: Prediction Inherits History

All prediction uses past data to guess about future events. The past data on criminal justice — arrests, convictions, recidivism — is itself racially distorted. It reflects:
- Racially unequal policing (more surveillance of Black communities → more arrests)
- Racially unequal prosecution and sentencing
- Socioeconomic disadvantage that correlates with race due to historical discrimination

When you train an algorithm on this data, you're not training it to predict "who will commit a crime." You're training it to predict "who will be arrested" — which is partly a function of policing, not just behavior. Any algorithm trained on this will encode the inequality of the past. **Bias in, bias out.**

---

## Part I: Prediction as a Mirror

Mayson's core metaphor: prediction functions as a **mirror** of historical data. A mirror can be made more accurate, but it cannot show you anything other than what's reflected in the input data. If the input data encodes racial inequality — because of racially unequal policing, prosecution, sentencing, and socioeconomic disadvantage — then any competent algorithm will reflect that inequality in its outputs.

### Two possible sources of racial disparity in prediction (Part I.C)

Mayson identifies exactly **two explanations** for why Black defendants receive higher risk scores:

1. **Distortion** — the data over-represents crime in Black communities because of unequal policing (more surveillance → more arrests → more "crime" in the data). This makes arrest a biased proxy for actual crime commission.

2. **Differential offense rates** — actual underlying crime rates differ by race for some crime categories, due to socioeconomic factors produced by historical discrimination. Mayson does not take a position on which explanation accounts for the COMPAS disparity; she argues we must distinguish them because each demands a different response.

The key implication: **if underlying offense rates differ by race, racial disparity in prediction is unavoidable.** "If the black population in the relevant data is statistically riskier with respect to the designated crime category, risk-assessment tools will reflect as much. If the mirror is modified to ignore this statistical fact, that very blindness will have disparate racial impact." (p. 2258)

---

## Part II: Fairness Metrics Taxonomy

### The Different Forms of Disparate Impact, and Fairness Metrics for Each

Mayson presents the multiple fairness criteria and their conflicts clearly. She organizes them around legal categories:

### Disparate Treatment (relevant legal frameworks)
- U.S. Constitution: Equal Protection Doctrine
  - Explicit racial classification or intentional discrimination → heightened (strict) scrutiny
  - Criminal justice = government actor → constitutional law applies
- Federal statutory law (Title VII): prohibits disparate treatment in employment
- Formal differential treatment on basis of race; concerns individual outcomes
- Fairness value: **Anti-classification**

### Disparate Impact (relevant legal frameworks)
- Federal statutory law (Title VII): disparate impact in employment if not job-related
- State constitutional and statutory law
- Practices "fair in form, but discriminatory in operation" (*Griggs v. Duke Power Co.*, 1971)
- Concerns group outcomes
- Fairness value: **Anti-subordination**

### The Different Forms of Disparate Impact, and Fairness Metrics for Each

1. **Differential % of subgroups forecast for Outcome X** → Demographic Parity / Statistical Parity
2. **Differential predictive accuracy** → Predictive Parity (Northpointe's standard)
3. **Differential FP/FN rates** → Procedural Parity / Equality of Opportunity (ProPublica's standard)

Plus Berk et al.'s taxonomy:
- Overall parity (same overall accuracy)
- Cost ratio equality (FN:FP ratio the same across groups)
- Total fairness (all metrics simultaneously) — **mathematically impossible when base rates differ**

---

## Part III: No Easy Fixes

This is the most substantively important part of the article for the dashboard. Mayson argues that the **three strategies most commonly advocated** to redress racial disparity in prediction all fail.

### Strategy 1: Exclude race and race-correlated input variables

Colorblindness is not a meaningful approach to equality and can make things worse:
- A race-blind algorithm can't observe that arrests carry *different* predictive weight for Black and white defendants in contexts with disparate policing
- If a Black man and a white man each have three prior arrests, the white man's arrests signal much more unusual behavior (since white men are rarely arrested)
- Ignoring this produces a race-blind algorithm that systematically *overstates Black defendants' risk* and *understates white defendants' risk*
- "A colorblind algorithm might therefore discriminate on the basis of race." (p. 2264)

### Strategy 2: Algorithmic affirmative action (equalizing outputs)

*Practical argument:* Equalizing false-positive rates doesn't equalize total burden on Black communities. If FN rates are equalized at 50% for both groups, and the Black group has a higher actual recidivism rate, the algorithm will miss more absolute rearrests from the Black group. The gain in FP-rate equality may be overwhelmed by increased net errors in the Black community.

*Conceptual argument:* This is the most important passage for the dashboard (p. 2274–2275):

> "structuring an algorithm to equalize false-positive and false-negative rates will almost certainly violate the principle that people who present the same risk should receive the same risk score (a single-threshold rule). If the base rate of the predicted event differs across racial groups, equalizing false-positive and false-negative rates will likely require setting different risk thresholds by race for each risk classification. It might require, for instance, classifying white defendants as high risk at a rearrest probability of 15% or above, while classifying black defendants as high risk only at a probability of 25% or higher. In a scenario like that, a person with a 20% chance of rearrest will be classified as high risk if he is white but not if he is black."

The single-threshold rule is the *sine qua non* of risk assessment — if two people present the same statistical risk, they must receive the same risk score. Algorithmic affirmative action (race-specific thresholds) violates this basic premise of risk assessment, and constitutes **explicit disparate treatment on the basis of race**.

This passage explicitly confirms the legal trap:
- **Single threshold**: calibrated, but produces unequal FP rates → disparate impact (legally permissible but arguably unfair)
- **Race-specific thresholds**: would equalize FP rates → but people with the same risk get different scores → disparate treatment on basis of race → Equal Protection strict scrutiny
- **No threshold satisfies both**: the impossibility theorem prevents escape

And as Mayson writes at p. 2266:

> "To equalize false-positive rates across racial groups, for example, it will likely be necessary to have race-specific risk thresholds for each risk class — which is to say that the algorithm will treat people who pose the same risk differently on the basis of race."

### Strategy 3: Reject algorithmic assessment altogether

Mayson doesn't dismiss this — but argues the better response is to be selective about *what we predict*. Abandoning all risk assessment could harm communities of color by removing a check on purely intuitive (and potentially more biased) judicial decision-making.

---

## The Key Legal Tension: The Most Obvious Fix Is Illegal

From the full published article and Part III specifically, Mayson's legal trap is:

- If you want to equalize FP rates, you **must** use race-specific thresholds
- Race-specific thresholds = **explicit racial classification** → triggers Equal Protection strict scrutiny
- Such a scheme would be extremely difficult to justify under strict scrutiny in criminal justice
- "In a scenario like that, a person with a 20% chance of rearrest will be classified as high risk if he is white but not if he is black." (p. 2275)

So:
- **Single threshold**: calibrated (predictive parity), but produces unequal FP rates → disparate impact (legally permissible; no individual intentional classification)
- **Race-specific thresholds**: would equalize FP rates but constitutes disparate treatment → Equal Protection challenge → likely struck down
- **No option satisfies both simultaneously**: the impossibility theorem forecloses any escape

This is the legal version of the impossibility theorem: you cannot simultaneously satisfy both fairness standards *without* either (a) accepting disparate impact or (b) using race explicitly in a way that invites Equal Protection challenge.

---

## Mayson's Deeper Point: The Problem Is What We're Predicting

Even if you could fix the algorithm, Mayson argues the deeper problem is the outcome being predicted. Risk tools predict *rearrest*, not *criminal behavior*. These are not the same thing. Because policing is racially unequal:

> "Arrest and conviction data is biased by policing practices in which minority communities are more heavily policed than white communities."

Using arrest records to predict future arrest doesn't measure actual recidivism — it measures a combination of actual offending *and* the likelihood of police contact. Black defendants face higher police surveillance, so their arrest data overstates their risk relative to white defendants who commit equivalent acts.

This "measurement error" means the base rate difference itself (51% vs. 39% measured recidivism in the COMPAS data) may not reflect actual differences in offending — it may partly reflect differential policing. If the base rate difference is artificial, the impossibility theorem's bite is different: it's not that we *must* accept unequal FP rates; it's that we've been operating with corrupted inputs.

---

## Mayson's Prescription

Rather than trying to fix the algorithm:
1. **Be skeptical of base rates** derived from arrest data, especially for groups subject to discriminatory policing
2. **Narrow what is predicted** to behaviors that can be measured more accurately — e.g., Mayson recommends risk tools focus only on arrest for *serious violent crime* (less subject to racially biased policing) rather than all arrests
3. **Question whether prediction should justify coercion at all** for risks that cannot be measured without racial distortion

---

## Relevance to the Dashboard

The key Mayson insight for the dashboard:

The legal trap she identifies is the perfect frame for the "lawyer advising the court" perspective:
- If you want to fix the disparate impact, the most obvious tool (different thresholds) creates a disparate treatment problem
- If you keep one threshold, you satisfy equal treatment but accept disparate impact
- If you abandon the tool, you lose any predictive benefit
- There is no legally clean and statistically fair option

The base rate caveat is also important: the 51% vs. 39% measured recidivism difference that drives the impossibility may itself be biased by unequal policing — making the whole framework rest on contested ground.
