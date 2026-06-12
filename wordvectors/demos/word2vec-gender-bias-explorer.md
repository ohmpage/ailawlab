# Word2Vec Gender Bias Explorer

## Overview

A browser-based interactive demo showing gender bias in the Google News Word2Vec model. Users enter any word and see its gender bias score and nearest neighbors on both sides of the gender axis.

**Live demo:** https://chanind.github.io/word2vec-gender-bias-explorer/  
**GitHub:** https://github.com/chanind/word2vec-gender-bias-explorer  
**Author:** chanind (independent developer)

## What It Does

- Enter any word in the Google News word2vec vocabulary
- See its **gender score** — how far it is from the male/female midpoint along the gender axis
- See the most "male-associated" and "female-associated" words nearby
- Visualizes the PCA-based gender direction from Bolukbasi et al. (2016) interactively

Under the hood: the backend computes a "gender vector" by taking the PCA of male/female word pairs (he/she, him/her, etc.) and then projects any word onto that axis.

## Programming Language & Stack

- **TypeScript** (42.2%) — React frontend (create-react-app)
- **Python** (33.3%) — Flask REST API backend
- **CSS** (14.9%), **HTML** (5.8%)
- **Docker** (3.8%) — Dockerfile included

## Deployment Difficulty: **Moderate**

Requires both a Python environment (backend) and Node.js/yarn (frontend). The README provides minimal installation instructions — it's developer-oriented. Docker support simplifies deployment somewhat.

A hosted live demo exists, so end-users don't need to deploy it at all.

## Suitability for Non-Technical Users

**Interface: Yes. Deployment: No.**

The web interface is among the most accessible in this survey — just type a word, instantly see bias. No ML jargon required. The hosted demo makes it genuinely usable by any audience. Local deployment, however, requires developer skills.

## Relevance to Our Project

The closest existing tool to what we're building, in terms of UX simplicity. The key limitation: it only covers gender bias (not race or other dimensions) and uses only the Google News corpus. There is no policy framing — it shows the bias without explaining why it matters. The interaction model (type word → see bias score) is exactly right.
