# Semantics Derived Automatically from Language Corpora Contain Human-Like Biases

## Citation

Caliskan, A., Bryson, J. J., & Narayanan, A. (2017). Semantics derived automatically from language corpora contain human-like biases. *Science*, 356(6334), 183–186.

- **DOI:** https://doi.org/10.1126/science.aal4230
- **Open-access PDF (author copy):** https://faculty.washington.edu/aylin/papers/caliskan_Science_open_access.pdf
- **arXiv preprint:** https://arxiv.org/abs/1608.07187

## Key Finding

Published in *Science* — the same journal as discoveries of new elements and vaccines — this paper replicated the full battery of human implicit bias tests (the Implicit Association Test, or IAT) using GloVe word vectors. The IAT measures unconscious associations in human minds; the authors showed that word embeddings trained on Common Crawl web text produce *the same biased associations* that humans show in psychological experiments. The model had no teacher, no reward signal — it learned biases purely from reading text.

## Memorable Examples

Replicated IAT results using word vectors:

- **Flowers vs. insects:** Flowers are associated with *pleasant* words; insects with *unpleasant* words — humans show this too (control test showing the method works)
- **Race:** European American names (Emily, Greg) are more strongly associated with *pleasant* attributes than African American names (Jamal, Lakisha)
- **Gender and careers:** Female names are associated with arts and family; male names with science and career
- **Age:** Young people's names are associated with pleasant attributes; old people's names with unpleasant ones

The racial name finding directly mirrors the famous Bertrand & Mullainathan (2004) audit study, which found that résumés with "white-sounding" names received 50% more callbacks.

## Policy Significance

This is the most legally significant paper in the set. The racial name finding directly implicates disparate-impact liability: any AI system using word embeddings as features may systematically disadvantage applicants with names associated with minority groups, even if race is never explicitly encoded. The paper is widely cited in discussions of the Equal Credit Opportunity Act, Fair Housing Act enforcement, and Title VII employment discrimination.

## Why This Paper Matters

Published in *Science* gives it unique credibility for non-technical audiences — it passed the most rigorous peer review in science. The WEAT (Word Embedding Association Test) framework it introduces has become the standard benchmark for measuring embedding bias. The framing — "the same biases humans have, learned from text alone" — is compelling to any audience.
