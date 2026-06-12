# On the Dangers of Stochastic Parrots: Can Language Models Be Too Big?

## Citation

Bender, E. M., Gebru, T., McMillan-Major, A., & Shmitchell, S. (2021). On the dangers of stochastic parrots: Can language models be too big? In *Proceedings of the 2021 ACM Conference on Fairness, Accountability, and Transparency (FAccT '21)*, 610–623.

- **ACM DL:** https://dl.acm.org/doi/10.1145/3442188.3445922
- **PDF (open access):** https://s10251.pcdn.co/pdf/2021-bender-parrots.pdf
- **Internet Archive:** https://archive.org/details/stochastic-parrots-3442188.3445922

## Key Finding

Large language models (LLMs) are "stochastic parrots": they generate fluent, coherent text by statistically recombining patterns from training data, without any understanding of meaning. Because they are trained on enormous web corpora, they encode and amplify every bias present in internet text — at scale. The paper argues that (1) the environmental cost of training ever-larger models is unjustifiable, (2) large web-scraped corpora systematically underrepresent marginalized communities while overrepresenting dominant ones, and (3) the perceived "intelligence" of LLMs can cause humans to overtrust them and fail to notice their biases.

## Memorable Point

The "stochastic parrot" metaphor: a parrot can produce human-sounding sentences without understanding a word. LLMs are similar — they can write a convincing legal brief or medical diagnosis that reflects the biases of their training data, and readers may fail to notice because the output *sounds* authoritative. The paper notes that marginalized communities are systematically underrepresented in web text — so a model trained on the web is disproportionately "hearing" the voices of the already-powerful.

## Policy Significance

This paper is the origin of the "foundation model risk" conversation now central to AI regulation (EU AI Act, US Executive Order on AI, proposed FTC rules). Its arguments bear directly on:
- **Procurement:** Government agencies using LLMs for document review, benefits determination, or risk assessment are deploying systems that amplify historical biases at scale
- **Transparency:** The paper argues that model cards and data documentation are necessary (but not sufficient) safeguards
- **Accountability:** The stochastic parrot framing undermines the "the AI decided" defense — the patterns the model learned came from human-produced text and human design choices

## Why This Paper Matters

It is the most widely read and cited paper in this collection, and it prompted Google to force out co-author Timnit Gebru — making it also a story about power in the AI industry. For law students: it raises product liability, negligence, and civil rights questions about large-scale AI deployment. For policymakers: it is the intellectual foundation of the argument that AI systems require ex ante regulation, not just post-hoc accountability.
