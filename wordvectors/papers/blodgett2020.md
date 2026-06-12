# Language (Technology) is Power: A Critical Survey of "Bias" in NLP

## Citation

Blodgett, S. L., Barocas, S., Daumé III, H., & Wallach, H. (2020). Language (Technology) is Power: A Critical Survey of "Bias" in NLP. In *Proceedings of the 58th Annual Meeting of the Association for Computational Linguistics (ACL 2020)*, 5454–5476.

- **ACL Anthology:** https://aclanthology.org/2020.acl-main.485/
- **PDF:** https://aclanthology.org/2020.acl-main.485.pdf
- **Summary (Montreal AI Ethics):** https://montrealethics.ai/language-technology-is-power-a-critical-survey-of-bias-in-nlp-research-summary/

## Key Finding

After surveying 146 papers on "bias" in NLP systems, the authors find that most papers fail to clearly articulate *why* the identified bias is harmful, *to whom*, and through what mechanism. Papers measure statistical patterns (e.g., cosine distances between word vectors) without connecting them to real-world harm. Most papers also ignore an enormous body of relevant scholarship — in sociolinguistics, critical race theory, feminist theory, and philosophy — that directly bears on what "bias" means and why it matters. The paper does not dispute that bias exists; it argues that the field is not asking the right questions about it.

## Memorable Point

The authors review papers that flag African American Vernacular English (AAVE) as "toxic" or "biased" in sentiment classifiers — but then propose to "debias" the model by removing AAVE patterns. This treats the *language of a community* as the problem, rather than the classifier's failure to respect it. The title — *Language (Technology) is Power* — is a deliberate echo of critical theory: who gets to define "bias" is itself a political question.

## Policy Significance

Essential reading for policymakers drafting AI bias regulations or procurement standards. It raises the question that technical papers almost never ask: who decides what counts as "fair," and in whose interest? A debiasing method that satisfies a computer science benchmark may simultaneously harm the communities it claims to protect. Any regulatory framework that relies on vendors self-certifying "debiased" products needs a much richer theory of harm than cosine distance.

## Why This Paper Matters

It is the only paper in this collection written primarily as a critique of the field rather than a new technical result. For non-technical audiences, it validates the intuition that "AI fairness" cannot be reduced to math: it requires normative reasoning, legal frameworks, and engagement with affected communities.
