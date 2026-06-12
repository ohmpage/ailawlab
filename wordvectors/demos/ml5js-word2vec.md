# ml5.js Word2Vec Interactive Demo

## Overview

A browser-based word2vec demo using ml5.js (a beginner-friendly JavaScript machine learning library built on TensorFlow.js) and p5.js. Part of Dan Shiffman's "Coding Train" educational ecosystem, originally based on Allison Parrish's word vector tutorials from ITP/NYU.

**Live demo:** https://ml5js.github.io/ml5-examples/p5js/Word2Vec/Word2Vec_Interactive/  
**p5.js examples repo (Shiffman):** https://github.com/shiffman/p5-word2vec  
**Allison Parrish's original tutorial:** https://gist.github.com/aparrish/2f562e3737544cf29aaf1af30362f469  
**Observable port:** https://observablehq.com/@dhowe/understanding-word-vectors

## What It Does

Three interactive word operations, all running entirely in the browser:
1. **Nearest words** — find the N words most similar to a given word
2. **Relationship** — given two words, find words that describe their relationship
3. **Analogy** — complete analogies: "A is to B as C is to ?"

Uses a pre-trained model on a vocabulary of common English words. The model loads from a JSON file served alongside the demo — no Python or server required.

## Programming Language & Stack

- **JavaScript** — ml5.js (high-level TensorFlow.js wrapper) + p5.js (creative coding)
- Pre-trained model stored as a JSON file loaded client-side
- No backend, no Python, no installation

## Deployment Difficulty: **Zero (hosted) / Easy (local)**

The hosted version works instantly in any browser. For local deployment: copy the HTML/JS files and the model JSON to any static web server (or just open index.html if CORS allows). No build step required.

## Suitability for Non-Technical Users

**Yes — the most accessible tool in this survey.** The interface is minimal (three text inputs, submit buttons, results appear below), the vocabulary is everyday English, and the operations are self-explanatory. A non-technical user can discover word biases by accident: type "programmer," see who comes back; type "nurse," see what's nearby.

The limitation: the model vocabulary is small (common English words) and bias is not explicitly framed or labeled. A user could easily miss the policy relevance without guidance.

## Relevance to Our Project

This is the closest to the right UX target for our use case: zero-install, works in any browser, simple interactions that reveal bias without requiring ML knowledge. The ml5.js + p5.js stack is beginner-friendly enough that the codebase could serve as a starting point. The key gap: no bias framing, no policy context, small vocabulary. Our project should build on this interaction model while adding the bias narrative.
