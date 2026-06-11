# WEFE: The Word Embeddings Fairness Evaluation Framework

## Overview

WEFE is a Python library that standardizes the measurement and mitigation of bias in word embedding models. Developed by Pablo Badilla et al. at the Universidad de Chile, published at IJCAI 2020.

**GitHub:** https://github.com/dccuchile/wefe  
**PyPI:** https://pypi.org/project/wefe/  
**Documentation:** https://wefe.readthedocs.io/  
**Paper (IJCAI 2020):** https://www.ijcai.org/proceedings/2020/60  
**KDnuggets overview:** https://www.kdnuggets.com/2020/08/word-embedding-fairness-evaluation.html

## What It Does

- Provides a unified interface for bias measurement metrics: WEAT, ECT (Embedding Coherence Test), RNSB (Relative Negative Sentiment Bias), MAC, and others
- Standardizes how test word sets are passed to metrics ("queries")
- Supports debiasing with Hard Debias, Double Hard Debias, and others via a scikit-learn-style `fit_transform` API
- Allows batch evaluation: run multiple bias metrics against multiple models at once
- Outputs standardized comparison tables

## Programming Language & Stack

- **Python only** — no web interface
- Requires Python 3.10+
- Install: `pip install wefe` or `conda install -c pbadilla wefe`

## Deployment Difficulty: **Easy (as a library)**

`pip install wefe` and import in Python. No server, no frontend. Use in Jupyter notebooks or Python scripts.

## Suitability for Non-Technical Users

**No.** Purely a Python library for developers and researchers. There is no web interface, no visual output by default (results are tables/numbers). A user comfortable with pandas DataFrames and Python would find it approachable; a lawyer or policymaker would not.

## Relevance to Our Project

WEFE would be useful as a *backend computation library* if we need to run WEAT scores or compare embedding models programmatically. It is not a deployment target for end-users. Potentially useful in a data preparation pipeline for pre-computing bias scores to display in the demo.
