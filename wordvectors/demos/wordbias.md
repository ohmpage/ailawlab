# WordBias

## Overview

WordBias is an interactive visual tool for discovering intersectional biases encoded in static word embeddings, developed at Stony Brook University and presented at CHI 2021.

**Paper:** https://arxiv.org/abs/2103.03598 (CHI '21 Extended Abstracts)  
**GitHub:** https://github.com/bhavyaghai/WordBias  
**Live demo:** Was available; current hosting status unclear

## What It Does

WordBias computes the association of words along multiple demographic dimensions simultaneously — race, age, gender, religion — and visualizes them using a **parallel coordinates** display. This allows users to see *intersectional* bias: for example, how a word like "criminal" relates to both race *and* gender axes at once, rather than examining one axis at a time.

Key features:
- **Control panel:** Select which demographic groups to display on axes
- **Main view:** Parallel coordinates visualization of word-group associations
- **Search panel:** Explore which words are associated with selected groups
- Supports Word2Vec, GloVe, and FastText embeddings

## Programming Language & Stack

- **Jupyter Notebook** (50.8%) — for data preprocessing
- **JavaScript** (42.5%) — frontend visualization
- **Python** (2.7%) / Flask — backend API
- **HTML** (2.7%), **CSS** (1.2%), **Shell** (0.1%)

Dependencies: Flask, Gensim, py_thesaurus (via `req.txt`)

## Deployment Difficulty: **Easy**

1. Clone repository
2. `pip install -r req.txt`
3. `python app.py`
4. Navigate to `localhost:6999`

No complex configuration required. Straightforward Python/Flask stack.

## Suitability for Non-Technical Users

**Moderate.** The parallel coordinates visualization is sophisticated — it may be confusing for audiences unfamiliar with multivariate charts. The *concept* (seeing multiple bias axes at once) is powerful but requires explanation. Deployment requires basic Python knowledge; end-users would need to use a hosted version.

## Relevance to Our Project

The intersectional bias framing is directly relevant — law and policy audiences need to understand that AI bias isn't just about one dimension. However, the parallel coordinates UI is too technical for a non-expert audience without guidance. The data model (pre-computing word-group associations and serving via a small Flask API) is a good architectural pattern to borrow.
