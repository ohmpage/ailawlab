# Responsibly.ai Word Embedding Bias Workshop

## Overview

An educational workshop and Python library from Shlomi Hod (Boston University / Technion) for exploring and measuring gender bias in word embeddings. Explicitly designed to be "adaptive to diverse audiences from those without machine learning background to data science practitioners."

**Documentation:** https://docs.responsibly.ai/notebooks/demo-word-embedding-bias.html  
**Workshop GitHub:** https://github.com/ResponsiblyAI/word-embedding  
**Library GitHub:** https://github.com/ResponsiblyAI/responsibly  
**Google Colab (zero install):** https://colab.research.google.com/github/ResponsiblyAI/word-embedding/blob/main/tutorial-bias-word-embedding.ipynb  
**License:** Creative Commons Attribution 4.0

## What It Does

The workshop covers:
- Intuitive explanation of word embeddings and why bias matters
- Measuring gender bias using cosine similarity and the Bolukbasi gender direction
- WEAT (Word Embedding Association Test) from Caliskan et al.
- Debiasing techniques: Neutralize and Equalize
- "Practical, methodological and philosophical questions about the ethics of AI"

The `responsibly` Python library provides programmatic access to:
- Multiple bias metrics (WEAT, ECT, RNSB, etc.)
- Debiasing methods (Hard Debias, Double Hard Debias)
- Pre-loaded word sets for bias evaluation

## Programming Language & Stack

- **Jupyter Notebook** (100% of the workshop repo)
- Python library underneath: `pip install responsibly`
- Runs in Google Colab with no local installation required

## Deployment Difficulty: **Zero (via Colab)**

The Colab notebook runs entirely in the browser — no Python installation, no dependencies to manage. Users click "Open in Colab" and run cells. Local Jupyter installation is also straightforward.

## Suitability for Non-Technical Users

**Partial.** The Colab approach removes the installation barrier, but users still need to run code cells and read Python output. Someone comfortable with Google Docs can use Colab, but the experience is "run this cell and read the output" rather than "click and explore." With a facilitator, this would work for a law school workshop setting.

## Relevance to Our Project

The explicit "no technical background required" framing and 90-minute workshop format are models worth emulating. The philosophical and ethical framing alongside the technical content is exactly the right approach for a policy audience. The WEAT metric implementation would be useful if we want to show statistical bias scores alongside the qualitative analogy examples.
