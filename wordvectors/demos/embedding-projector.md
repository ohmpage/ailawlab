# TensorFlow Embedding Projector

## Overview

A browser-based tool from Google for interactively visualizing high-dimensional embeddings in 2D and 3D. Built by the Google Brain team (Daniel Smilkov, Nikhil Thorat, Fernanda Viegas, Martin Wattenberg, and others).

**Live demo:** https://projector.tensorflow.org/  
**TensorFlow docs:** https://www.tensorflow.org/tensorboard/tensorboard_projector_plugin  
**Google ML Crash Course interactive exercises:** https://developers.google.com/machine-learning/crash-course/embeddings/interactive-exercises  
**Blog post:** https://ai.googleblog.com/2016/12/open-sourcing-embedding-projector-tool.html

## What It Does

- Load any pre-trained word embedding (or custom embeddings from TensorBoard)
- Reduce to 2D or 3D using PCA, t-SNE, UMAP, or Custom Projections
- Search for any word and see its nearest neighbors highlighted
- **Custom Projections** tab: define a custom axis (e.g., "he/she") and project all words onto it — this is the manual way to visualize gender bias
- Explore multiple built-in datasets including Word2Vec (10K words), Wikipedia (All), and MNIST digit images

The Google ML Crash Course uses a widget based on this tool that "flattens 10,000 word2vec static vectors into a 3D space" and highlights nearest neighbors interactively.

## Programming Language & Stack

- **JavaScript / TypeScript** — runs entirely in the browser (WebGL-accelerated)
- Part of the TensorFlow.js / TensorBoard ecosystem
- No server-side code for the hosted demo

## Deployment Difficulty: **Zero (hosted)**

The live demo at projector.tensorflow.org requires nothing — just a browser. Custom embedding support requires generating the right file format (TSV), which is a minor technical step.

## Suitability for Non-Technical Users

**Mostly yes**, with caveats. The core interaction (type a word, see nearest neighbors in 3D) is immediately intuitive. The Custom Projections feature that reveals bias requires more guidance. The 3D visualization, while beautiful, can be disorienting without explanation of what the axes mean.

A Towards Data Science tutorial ("Visualizing Bias in Data using Embedding Projector") demonstrates the bias workflow: search "engineer" → see it clusters near male-coded words like "physicist" and "mathematician," away from female-coded words like "teacher" and "dancer."

## Relevance to Our Project

The Embedding Projector is the best existing tool for *showing* what word embeddings look like, but it is not designed to *explain* bias to a non-technical audience. It requires a facilitator to walk people through the Custom Projections feature and interpret the 3D clusters. Good for a live demonstration with narration; not suitable as a self-service policy demo. Its WebGL-in-browser approach with no server is the right deployment model for our project.
