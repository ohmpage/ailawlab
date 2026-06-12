# Man is to Computer Programmer as Woman is to Homemaker? Debiasing Word Embeddings

## Citation

Bolukbasi, T., Chang, K.-W., Zou, J. Y., Saligrama, V., & Kalai, A. T. (2016). Man is to computer programmer as woman is to homemaker? Debiasing word embeddings. *Advances in Neural Information Processing Systems (NeurIPS) 29*, 4349–4357.

- **arXiv:** https://arxiv.org/abs/1607.06520
- **PDF:** https://arxiv.org/pdf/1607.06520

## Key Finding

Word embeddings trained on Google News articles encode gender stereotypes as a measurable geometric direction in the vector space. The model resolves the analogy "man : computer programmer :: woman : ?" with "homemaker." The authors show that gender bias is captured by a single linear direction (the "gender subspace") and propose two debiasing methods — Neutralize (zero out the gender component of neutral words) and Equalize (ensure gendered pairs like *actor/actress* are equidistant from neutral words like *talent*).

## Memorable Examples

The model produces these analogies from training data alone, with no human instruction:

- man : doctor :: **woman : nurse**
- man : programmer :: **woman : homemaker**
- man : captain :: **woman : wife**
- man : manager :: **woman : receptionist**
- he : alcoholism :: **she : eating disorders**

## Policy Significance

This paper is the starting point for every policy discussion about algorithmic hiring bias. When a résumé-screening system uses word embeddings as features, the word "engineer" will have a higher cosine similarity to "he" than "she" — before the system has seen a single résumé. The bias is in the infrastructure, not just the training data of the downstream application.

## Why This Paper Matters

It was the first to demonstrate that word embedding bias is *geometrically* measurable and manipulable — not just anecdotally observable. Every subsequent paper in this field builds on its methodology. The analogy test format is what makes this accessible to non-technical audiences: it reads like a SAT question with a disturbing answer.
