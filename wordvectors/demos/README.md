# Survey of Existing Word Embedding Demo Tools

This folder summarizes existing open-source tools and live demos for exploring word embeddings, with notes on programming language, deployment difficulty, and suitability for non-technical (law/policy) audiences.

---

## Summary Table

| Tool | Language | Live Demo? | Deploy Difficulty | Non-Technical? | Bias-Focused? |
|------|----------|-----------|-------------------|----------------|---------------|
| [WebVectors / vectors.nlpl.eu](webvectors.md) | Python (Flask + Gensim) | Yes | Hard | Interface yes, deploy no | No |
| [WordBias](wordbias.md) | Python + JS (Flask) | Was hosted | Easy | Moderate | Yes — intersectional |
| [Word2Vec Gender Bias Explorer](word2vec-gender-bias-explorer.md) | TypeScript/React + Python | Yes | Moderate | Interface yes | Yes — gender only |
| [VERB (visualizing-bias)](verb.md) | Python (Flask) + JS | No | Easy | No — research tool | Yes — debiasing focus |
| [Responsibly.ai Workshop](responsibly-ai.md) | Jupyter Notebook | Colab link | Zero (Colab) | Partial | Yes — educational |
| [TF Embedding Projector](embedding-projector.md) | JavaScript (TF.js) | Yes | Zero | Yes | No — general purpose |
| [ml5.js Word2Vec](ml5js-word2vec.md) | JavaScript (ml5/p5.js) | Yes | Zero | Yes | No — general purpose |
| [WEFE](wefe.md) | Python (library) | No | Easy (pip) | No — developers only | Yes — measurement |
| [word2vec-graph (anvaka)](word2vec-graph.md) | Python + JS | Yes | Hard | Interface yes | No |

---

## Observations for Our Demo

**What exists well:**
- General-purpose embedding explorers (nearest neighbors, analogies, 3D visualization) are plentiful
- Several bias-measurement tools exist for technical users (WEFE, Responsibly.ai)
- A few bias demos have polished web interfaces (Gender Bias Explorer, WordBias)

**What is missing:**
- No tool connects bias findings to specific policy or legal contexts
- None frame results in terms of real-world AI systems (hiring, lending, criminal justice)
- No tool walks through the historical/societal story (why the bias got there)
- Nothing designed explicitly for law students or policymakers
- Most require either: (a) Python installation, or (b) running code — neither suitable for a courtroom or classroom

**Key design takeaways:**
- The ml5.js/p5.js model (fully browser-side, zero install, instant gratification) is the right UX target
- The Responsibly.ai workshop's "adaptive to diverse audiences" framing is worth emulating
- WordBias's parallel-coordinates visualization of intersectional bias is sophisticated but likely too technical
- The Gender Bias Explorer's simplicity (type a word, see the bias) is the right interaction model
