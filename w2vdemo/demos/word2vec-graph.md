# word2vec-graph (anvaka)

## Overview

A visually striking interactive 3D graph that treats word embeddings as a network: nodes are words, edges connect words within a given cosine distance threshold. Part of a broader suite of data visualization projects by Andrei Kashcha (anvaka).

**Live demo:** https://anvaka.github.io/pm/ (word2vec section)  
**GitHub:** https://github.com/anvaka/word2vec-graph

## What It Does

- Visualizes GloVe embeddings as a force-directed 3D graph
- Words cluster together naturally based on their vector distances
- Two pre-computed graphs: Wikipedia embeddings at two distance thresholds (0.9 and 1.0)
- A Common Crawl dataset visualization (840B tokens, 2.2M vocabulary)
- Interactive: rotate, zoom, click nodes to see neighbors

The graph reveals semantic clusters visually — science words cluster together, sports words cluster together, gendered occupations cluster together (revealing bias through spatial proximity).

## Programming Language & Stack

- **Python** (64%) — preprocessing scripts using Spotify Annoy for nearest-neighbor search
- **JavaScript** (36%) — browser-side 3D graph rendering
- Optional **C++** for faster graph layout generation

Data pipeline: Python builds edge files → Node.js converts to binary formats → browser renders

## Deployment Difficulty: **Hard**

Reproducing locally requires:
1. Downloading GloVe vectors (large files)
2. Running Python Annoy scripts to build edge data
3. Running Node.js for graph layout generation
4. Optionally compiling C++ for speed
5. Serving the result as a static web app

However, the hosted live demos work immediately for anyone.

## Suitability for Non-Technical Users

**Interface: Yes. Deployment: No.**

The live demo is one of the most visually compelling embedding visualizations available — accessible to anyone with a browser. Local deployment requires substantial technical expertise.

**For a policy audience:** The 3D graph is beautiful and creates a "wow" moment (you can literally *see* that certain words cluster together), but without narration it doesn't explain bias. Bias appears as a spatial pattern that needs interpretation.

## Relevance to Our Project

Less directly relevant than the other tools — it's a visualization of the full vocabulary space rather than a bias-testing interface. The "galaxy of words" aesthetic could be compelling in a presentation context, but it doesn't fit the interactive analogy/query model we're targeting. The hosted demo could be a useful supplementary reference to show alongside our tool.
