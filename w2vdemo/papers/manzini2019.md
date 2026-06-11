# Black is to Criminal as Caucasian is to Police: Detecting and Removing Multiclass Bias in Word Embeddings

## Citation

Manzini, T., Lim, Y. C., Black, A. W., & Tsvetkov, Y. (2019). Black is to criminal as Caucasian is to police: Detecting and removing multiclass bias in word embeddings. In *Proceedings of the 2019 Conference of the North American Chapter of the Association for Computational Linguistics: Human Language Technologies (NAACL-HLT)*, 615–621.

- **ACL Anthology:** https://aclanthology.org/N19-1062/
- **arXiv:** https://arxiv.org/abs/1904.04047
- **Code:** https://github.com/TManzini/DebiasMulticlassWordEmbedding

## Key Finding

Bolukbasi et al. (2016) showed how to detect and remove *binary* gender bias (treating gender as a two-class variable). This paper extends the analysis to *multiclass* settings — race (White, Black, Hispanic, Asian) and religion (Christianity, Islam, Judaism) — and finds alarming associations. Word embeddings trained on standard corpora produce race-crime and religion-extremism associations that mirror the worst social stereotypes.

## Memorable Examples

Analogy completions from standard word embeddings:

- Black : **criminal** :: Caucasian : **police**
- Black : **poor** :: Caucasian : **wealthy**
- Muslim : **terrorist** :: Christian : **extremist** (still bad, but less severe)
- Jewish : **money** :: Christian : **church** (activating the antisemitic "Jewish = money" stereotype)

## Policy Significance

This paper is essential for criminal justice policy discussions. Risk assessment instruments used in sentencing and bail decisions often use language models trained on historical legal texts. If those embeddings associate Black names and neighborhoods with criminality — not because of any explicit racial input, but because of statistical regularities in training data — then the instrument has embedded racial bias before it processes any individual case. This is precisely the mechanism alleged in *State v. Loomis* (2016) and in critiques of tools like COMPAS.

## Why This Paper Matters

The title says it all for a non-technical audience: no statistics, no cosine distances needed. "Black is to criminal as Caucasian is to police" — the finding is self-explanatory and immediately relevant to debates about algorithmic criminal justice. It also demonstrates that "debiasing" for gender does not fix racial bias; the problems are independent and require separate treatment.
