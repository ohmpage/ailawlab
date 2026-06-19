# Machine Bias

**There's Software Used Across the Country to Predict Future Criminals. And It's Biased Against Blacks.**

Julia Angwin, Jeff Larson, Surya Mattu and Lauren Kirchner — ProPublica, May 23, 2016

Source: https://www.propublica.org/article/machine-bias-risk-assessments-in-criminal-sentencing

---

## Core Findings

ProPublica analyzed risk assessment scores assigned to over 7,000 people arrested in Broward County, Florida during 2013–2014, examining the COMPAS algorithm created by Northpointe. The investigation revealed significant racial disparities in how the software predicted future criminal behavior.

**Key Statistical Disparities:**

- Black defendants were **77% more likely** to be rated as higher risk for committing future violent crimes compared to white defendants
- Black defendants were **45% more likely** to be predicted as likely to commit any future crime
- The algorithm falsely flagged Black defendants as future criminals at **nearly twice the rate** of white defendants
- Conversely, white defendants were mislabeled as low risk more frequently than Black defendants

The algorithm demonstrated poor predictive accuracy overall: **only 20%** of individuals predicted to commit violent crimes actually did so. For all crime types, the accuracy was only marginally better than random chance at **61%**.

---

## Comparative Case Studies

### Brisha Borden vs. Vernon Prater

- **Borden** (Black, age 18): arrested for taking a child's bicycle and scooter worth $80; juvenile misdemeanor record; scored **HIGH RISK (8/10)**
- **Prater** (white, age 41): arrested for shoplifting $86.35 in tools; prior armed robbery convictions; scored **LOW RISK (3/10)**
- Two-year follow-up: Borden faced no new charges; Prater was imprisoned for warehouse theft

### Dylan Fugett vs. Bernard Parker

- **Fugett** (white): arrested with cocaine/marijuana; scored **LOW RISK (3/10)**; subsequently arrested three times on drug charges
- **Parker** (Black): arrested for resisting arrest; scored **HIGH RISK (10/10)**; no subsequent offenses

### Paul Zilly (Wisconsin)

Convicted of stealing a lawnmower and tools. Prosecutor and defense agreed to one year in county jail. Judge James Babler reviewed Zilly's COMPAS scores (high risk for violent crime, medium for general recidivism) and stated the assessment was "about as bad as it could be." He overturned the plea agreement, imposing two years in state prison plus three years supervision.

Zilly's public defender appealed, calling Northpointe founder Tim Brennan as a witness. Brennan testified he "didn't design [the] software to be used in sentencing" and opposed "the sole evidence that a decision would be based upon" the score. After the hearing, Judge Babler reduced the sentence to 18 months.

### James Rivelli (Florida)

Records for domestic violence aggravated assault, grand theft, petty theft, and drug trafficking. Despite extensive criminal history, scored **LOW RISK (3/10)** after arrest for shoplifting Crest Whitestrips. Within a year, faced felony charges for shoplifting $1,000 in tools.

### Brisha Borden and Sade Jones (Florida)

After stealing the bicycle and scooter: Borden scored **HIGH RISK (8/10)**; Jones (no prior arrests) scored **MEDIUM RISK (6/10)**. Judge John Hurley raised both girls' recommended bond from $0 to $1,000 each. They spent two nights in jail. Jones completed probation and had her felony burglary charge reduced to misdemeanor trespassing, but reported employment discrimination afterward.

---

## False Positive / False Negative Rates

|                                   | Black defendants | White defendants |
|-----------------------------------|-----------------|-----------------|
| Non-recidivists scored high risk (FP) | **44.9%**    | **23.5%**       |
| Recidivists scored low risk (FN)   | **28.0%**       | **47.7%**       |

---

## COMPAS Algorithm Overview

Northpointe developed COMPAS (Correctional Offender Management Profiling for Alternative Sanctions) in the late 1980s. The assessment tool scores defendants based on **137 questions** addressing factors including:

- Parental incarceration history
- Peer substance abuse
- School disciplinary incidents
- Agreement with statements like "A hungry person has a right to steal"

**Race is not a direct input variable.** However, the algorithm incorporates proxy variables correlated with racial demographics, including education levels, employment status, poverty, joblessness, and social marginalization.

---

## Geographic Adoption

The COMPAS tool is among the most widely used risk assessment instruments nationwide:

- **Wisconsin**: Extensive adoption statewide since 2012; used at sentencing, parole, and every decision point in corrections
- **Broward County, Florida**: Implemented in 2008 for pretrial release decisions; nearly all arrested persons are scored
- **Nine states** incorporate scores in sentencing decisions: Arizona, Colorado, Delaware, Kentucky, Louisiana, Oklahoma, Virginia, Washington, and Wisconsin
- **Federal system**: Pending sentencing reform legislation would mandate such assessments in federal prisons
- **New York**: Deployed statewide to probation departments (except NYC) by 2010

---

## Northpointe's Response

The company disputed ProPublica's analysis, stating results "are not correct or that they accurately reflect the outcomes from the application of the model." Northpointe argued that excluding socioeconomic factors would reduce accuracy, but did not provide specific calculations, citing proprietary concerns.

---

## Due Process and Transparency Issues

The algorithms operate with minimal transparency. Defendants rarely see underlying calculations; results are typically shared with attorneys only. Northpointe's specific formulas remain proprietary.

Law professor Christopher Slobogin: "Risk assessments should be impermissible unless both parties get to see all the data that go into them...It should be an open, full-court adversarial proceeding."

Eric Loomis challenged his eight-year sentence based on COMPAS scores as violating due process rights. Wisconsin subsequently stopped including scores in presentencing reports pending Supreme Court resolution.

---

## Historical Context

Until approximately the 1970s, criminologists openly used race and skin color in risk predictions. The 1980s crime wave prompted lawmakers to restrict judicial discretion through mandatory sentencing and parole abolition. As states faced escalating incarceration costs, algorithmic risk assessment resurfaced as a purportedly objective alternative.

---

## Independent Research

Researchers Sarah Desmarais and Jay Singh examined 19 risk methodologies and found validity had typically been studied in only one or two investigations, frequently by the same people who developed the tool. Desmarais concluded these instruments showed "moderate at best" predictive validity and stated: "The data do not exist" regarding comprehensive U.S. studies on racial bias in risk scores.

A 2016 study by Jennifer Skeem and Christopher T. Lowenkamp found Black defendants received higher average scores on another risk tool but concluded differences were not attributable to bias — a conclusion inconsistent with ProPublica's findings.

---

## Broader Implications

The investigation demonstrates how algorithmic systems can perpetuate systemic inequality despite lacking explicit racial variables. Machine learning models trained on historical criminal justice data — itself shaped by decades of discriminatory policing and sentencing — encode existing biases into ostensibly objective decision-making tools.

The article underscores tensions between computational predictive power and fairness: algorithms may improve incarceration efficiency while simultaneously amplifying historical injustices against Black Americans.
