# WebVectors / vectors.nlpl.eu

## Overview

WebVectors is a web platform for exploring distributional semantic (word embedding) models, developed by the Language Technology Group at the University of Oslo and the Nordic Language Processing Laboratory. The user-facing demo at https://vectors.nlpl.eu/explore/embeddings/en/ runs on it.

**Live demo:** https://vectors.nlpl.eu/explore/embeddings/en/  
**GitHub:** https://github.com/akutuzov/webvectors  
**License:** Creative Commons Attribution 4.0

## What It Does

- **Similar words:** Given any word, returns the 10 most semantically similar terms from the model
- **Vector calculator:** Supports word arithmetic (king − man + woman = queen)
- **Visualizations:** Plots word neighborhoods in 2D space
- **2D text analysis:** Contextual embedding visualization
- **Model selection:** Multiple pre-trained models across languages; defaults to English Wikipedia

The Norwegian/Oslo team maintains multiple language models accessible through the same interface.

## Programming Language & Stack

- **Primary:** Python (49.5%) — Flask web framework, Gensim for embeddings, Gunicorn as app server
- **Frontend:** HTML (22%), JavaScript (10.7%), CSS (2%)
- Optional: UDPipe, Stanford CoreNLP, or Freeling for part-of-speech tagging

## Deployment Difficulty: **Hard**

Local deployment requires:
1. Python 3.6+ and pip dependencies
2. Configuring `webvectors.cfg` (paths, model locations, language settings)
3. Running a background word2vec server daemon (`word2vec_server.py`) 
4. Setting up Apache or Gunicorn as the web server
5. Downloading and pointing to pre-trained model files

No Docker image or one-command install is provided. Significant configuration is required even for experienced developers.

## Suitability for Non-Technical Users

**Interface: Yes. Deployment: No.**

Once deployed, the web interface is clean and accessible — users just type words and get results. But the setup requires command-line fluency, config file editing, and server administration.

## Relevance to Our Project

This is a polished, production-quality tool. The vector calculator is the key interaction (word analogies), but it lacks any framing around bias or policy implications. It treats word similarity as a neutral tool rather than a lens on social bias. The codebase would be a reasonable architectural reference.
