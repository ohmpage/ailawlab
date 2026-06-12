# What Are the Biases in My Word Embedding?

## Citation

Swinger, N., De-Arteaga, M., Heffernan, N. T., Leiserson, M. D. M., & Kalai, A. T. (2019). What are the biases in my word embedding? In *Proceedings of the 2019 AAAI/ACM Conference on AI, Ethics, and Society (AIES '19)*, 305–311.

- **ACM DL:** https://dl.acm.org/doi/10.1145/3306618.3314270
- **arXiv:** https://arxiv.org/abs/1812.08769
- **PDF:** https://arxiv.org/pdf/1812.08769
- **Microsoft Research:** https://www.microsoft.com/en-us/research/publication/what-are-the-biases-in-my-word-embedding/

## Key Finding

Prior work required researchers to specify in advance which groups might be discriminated against. This paper introduces an *unsupervised* algorithm that automatically enumerates biases in word embeddings without pre-specifying protected groups. It identifies biased associations by finding geometric patterns where a demographic marker (a name associated with a racial or ethnic group) runs parallel to a lower-case attribute word (e.g., "criminal," "poor"). The algorithm finds far more biases than previous targeted searches — and crucially, finds significant bias even in embeddings that had previously been "debiased" by Bolukbasi's method.

## Memorable Examples

The algorithm surfaces associations like:
- Names coded as African American → correlate with words like "loud," "prison," "poor"
- Names coded as Hispanic → correlate with "illegal," "labor," "gang"
- Names coded as Jewish → correlate with "money," "greedy," "lawyer"
- Names coded as Asian → correlate with "math," "small," "quiet"

## Policy Significance

This paper is essential for AI auditors and regulators. It shows that (1) you cannot fully debiase an embedding with current techniques, and (2) you cannot audit a system just by testing the groups you already know to check. The algorithm's unsupervised nature mirrors how discrimination law works: you cannot simply assert you didn't discriminate against race if you discriminated against a correlated proxy variable (like a name that is racially coded). Any comprehensive AI bias audit needs tools like this one.

## Why This Paper Matters

It answers the question regulators most need answered: "Is this embedding biased against my constituents?" rather than "Does this embedding show the specific bias we already suspected?" The finding that debiased embeddings *still* contain significant bias is critical for any policy discussion of technical fixes as regulatory compliance.
