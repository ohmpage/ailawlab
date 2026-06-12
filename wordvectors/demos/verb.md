# VERB: Visualizing and Interpreting Bias Mitigation Techniques

## Overview

VERB (Visualization of Embedding Representations for deBiasing) is a research tool for understanding how debiasing methods transform the geometry of word vectors. It is the web interface companion to a workshop run at AAAI 2021 and published as a full paper in ACM Transactions on Interactive Intelligent Systems (2023).

**Paper (arXiv):** https://arxiv.org/abs/2104.02797  
**Paper (ACM TOIS):** https://dl.acm.org/doi/10.1145/3604433  
**GitHub:** https://github.com/tdavislab/verb  
**Workshop page:** https://www.sci.utah.edu/~beiwang/aaaibias2021/

## What It Does

VERB breaks debiasing techniques into their component geometric operations and visualizes each step using dimensionality reduction. Supported debiasing methods:

- **Linear Projection for Debiasing**
- **Hard Debiasing** (Bolukbasi 2016)
- **Iterative Nullspace Projection (INLP)**
- **Orthogonal Subspace Correction and Rectification (OSCaR)**

Users can see *how* each method moves words in vector space — which pairs of words become equidistant, which neutral words get "neutralized," etc. Default embeddings are GloVe 50-dimensional vectors (Wikipedia/Gigaword).

## Programming Language & Stack

- **Python** (51.5%) — Flask backend, scikit-learn, scipy, numpy
- **JavaScript** (32.6%) — frontend visualization
- **HTML** (13.3%), **CSS** (2.6%)

Dependencies: `flask scikit-learn scipy numpy tqdm`

## Deployment Difficulty: **Easy**

1. Clone repository
2. `pip install flask scikit-learn scipy numpy tqdm`
3. `python3 -m flask run`
4. Open `http://localhost:5000`

No complex configuration. Chrome and Firefox supported; Safari has label rendering issues. No hosted live demo.

## Suitability for Non-Technical Users

**No.** This is an expert research tool. The visualization is beautiful but the concepts (geometric transformations of high-dimensional vectors, nullspace projection) require a background in linear algebra and NLP. It would be appropriate for an advanced ML course but not for a law school audience.

## Relevance to Our Project

Relevant as a technical reference for understanding what debiasing looks like geometrically, and as inspiration for a potential "before/after debiasing" toggle feature. The Flask-based architecture is a reasonable template. Not suitable as a model for end-user UX.
