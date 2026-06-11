# Foundational Papers: Bias in Word Embeddings

This folder collects the key academic papers establishing that word embedding models (word2vec, GloVe, fastText) encode and amplify human social biases. Each file contains the full citation, a plain-English summary, a memorable concrete example, and a note on why it matters for law and policy.

---

## Measuring Bias in Embeddings

These papers establish the core finding: bias is geometrically encoded in embedding space and can be measured.

| Paper | Key Contribution |
|-------|-----------------|
| [Bolukbasi et al. (2016)](bolukbasi2016.md) | Showed that word2vec trained on Google News encodes gender stereotypes as a literal geometric direction; proposed debiasing |
| [Caliskan et al. (2017)](caliskan2017.md) | Replicated the full battery of human implicit bias tests (IAT) using GloVe vectors — race, gender, age — published in *Science* |
| [Garg et al. (2018)](garg2018.md) | Traced 100 years of changing gender and ethnic stereotypes using embeddings trained on historical text corpora |
| [Swinger et al. (2019)](swinger2019.md) | Algorithm that automatically enumerates biases without pre-specifying which groups to test — found bias even in "debiased" embeddings |

## Bias in Downstream Systems

These papers show that embedding bias propagates into real NLP applications (coreference, search, classification).

| Paper | Key Contribution |
|-------|-----------------|
| [Zhao et al. (2018)](zhao2018.md) | Showed that coreference resolution systems link gendered pronouns to stereotypical occupations at dramatically higher rates (21 F1 points) |
| [Manzini et al. (2019)](manzini2019.md) | Extended bias detection beyond binary gender to race and religion; showed "Black is to criminal as Caucasian is to police" |

## Critical Surveys and Broader Harms

These papers zoom out to ask what bias in language models means for society.

| Paper | Key Contribution |
|-------|-----------------|
| [Blodgett et al. (2020)](blodgett2020.md) | Surveyed 146 NLP bias papers; found most lack clear normative grounding or engagement with affected communities |
| [Bender et al. (2021)](bender2021.md) | "Stochastic Parrots" — the landmark paper on large language model risks including bias amplification, written by researchers Google tried to suppress |

---

## Reading Order for Non-Technical Audiences

1. **Start here:** Caliskan 2017 — cleanest demonstration, published in *Science*, no ML background needed
2. **Most alarming examples:** Bolukbasi 2016 — the "man:programmer :: woman:homemaker" paper
3. **Historical perspective:** Garg 2018 — shows bias has been in language for 100+ years
4. **Real-world impact:** Zhao 2018 — shows bias in actual software systems
5. **Big picture:** Bender 2021 — policy implications of large language models
