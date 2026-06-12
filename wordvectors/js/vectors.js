/**
 * vectors.js — Load and query GloVe word vectors entirely in the browser.
 *
 * Usage:
 *   const model = new VectorModel();
 *   await model.load('data/vocab.json', 'data/vectors.bin', onProgress);
 *   const vec = model.get('king');          // Float32Array | null
 *   const neighbors = model.nearest(vec, 10, ['king']); // [{word, score}]
 *   const result = model.analogy('king', 'man', 'woman', 10); // [{word, score}]
 */

class VectorModel {
  constructor() {
    this.vocab = null;      // { word: index }
    this.words = null;      // index -> word (array)
    this.vectors = null;    // Float32Array, shape [numWords × dim]
    this.numWords = 0;
    this.dim = 0;
    this.ready = false;
  }

  async load(vocabUrl, vectorsUrl, onProgress = null) {
    // Load vocabulary index
    const vocabResp = await fetch(vocabUrl);
    this.vocab = await vocabResp.json();
    this.words = Object.keys(this.vocab).sort((a, b) => this.vocab[a] - this.vocab[b]);

    // Load binary vectors with progress reporting
    const vecResp = await fetch(vectorsUrl);
    const total = parseInt(vecResp.headers.get('content-length') || '0');
    let loaded = 0;
    const reader = vecResp.body.getReader();
    const chunks = [];
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
      loaded += value.length;
      if (onProgress && total) onProgress(loaded / total);
    }

    const buffer = await new Blob(chunks).arrayBuffer();
    const header = new Uint32Array(buffer, 0, 2);
    this.numWords = header[0];
    this.dim = header[1];
    // Vectors start after the 8-byte header
    this.vectors = new Float32Array(buffer, 8, this.numWords * this.dim);

    // Normalize all vectors to unit length for fast cosine similarity via dot product
    for (let i = 0; i < this.numWords; i++) {
      this._normalize(i);
    }

    this.ready = true;
    if (onProgress) onProgress(1);
  }

  _normalize(idx) {
    const start = idx * this.dim;
    let norm = 0;
    for (let d = 0; d < this.dim; d++) norm += this.vectors[start + d] ** 2;
    norm = Math.sqrt(norm);
    if (norm > 1e-10) {
      for (let d = 0; d < this.dim; d++) this.vectors[start + d] /= norm;
    }
  }

  /** Return the unit vector for a word, or null if not in vocabulary. */
  get(word) {
    const idx = this.vocab[word.toLowerCase()];
    if (idx === undefined) return null;
    return this.vectors.slice(idx * this.dim, (idx + 1) * this.dim);
  }

  /** Return true if word is in vocabulary. */
  has(word) {
    return word.toLowerCase() in this.vocab;
  }

  /**
   * Find the k nearest neighbors to a raw (not necessarily unit) vector.
   * @param {Float32Array} vec — query vector
   * @param {number} k — number of results
   * @param {string[]} exclude — words to skip (typically the query words)
   * @returns {{ word: string, score: number }[]}
   */
  nearest(vec, k = 10, exclude = []) {
    const excludeSet = new Set(exclude.map(w => w.toLowerCase()));
    // Normalize query vector
    const query = new Float32Array(this.dim);
    let norm = 0;
    for (let d = 0; d < this.dim; d++) norm += vec[d] ** 2;
    norm = Math.sqrt(norm);
    for (let d = 0; d < this.dim; d++) query[d] = norm > 1e-10 ? vec[d] / norm : 0;

    // Compute cosine similarities (dot products against pre-normalized vectors)
    const scores = new Float32Array(this.numWords);
    for (let i = 0; i < this.numWords; i++) {
      if (excludeSet.has(this.words[i])) {
        scores[i] = -Infinity;
        continue;
      }
      const start = i * this.dim;
      let s = 0;
      for (let d = 0; d < this.dim; d++) s += query[d] * this.vectors[start + d];
      scores[i] = s;
    }

    // Partial sort: find top k
    const result = [];
    const used = new Set();
    for (let r = 0; r < k; r++) {
      let bestIdx = -1, bestScore = -Infinity;
      for (let i = 0; i < this.numWords; i++) {
        if (!used.has(i) && scores[i] > bestScore) {
          bestScore = scores[i];
          bestIdx = i;
        }
      }
      if (bestIdx === -1) break;
      used.add(bestIdx);
      result.push({ word: this.words[bestIdx], score: bestScore });
    }
    return result;
  }

  /**
   * Compute the analogy: A − B + C = ?
   * Equivalent to: A is to B as C is to ?
   * Returns the k nearest words to the predicted vector.
   */
  analogy(wordA, wordB, wordC, k = 10) {
    const a = this.get(wordA);
    const b = this.get(wordB);
    const c = this.get(wordC);
    if (!a || !b || !c) {
      const missing = [wordA, wordB, wordC].filter(w => !this.has(w));
      return { error: `Not in vocabulary: ${missing.join(', ')}`, results: [] };
    }

    // target = c + (b - a): the same change that takes A to B, applied to C.
    // Framing: "A is to B as C is to ?" — B−A is the relationship direction.
    const target = new Float32Array(this.dim);
    for (let d = 0; d < this.dim; d++) {
      target[d] = c[d] + b[d] - a[d];
    }

    const results = this.nearest(target, k, [wordA, wordB, wordC]);
    return { error: null, target, vecA: a, vecB: b, vecC: c, results };
  }

  /**
   * Project four 50-d vectors into 2D for the parallelogram visualization.
   *
   * The coordinate system is:
   *   X axis — direction of (vecB − vecA), i.e. the "analogy direction"
   *   Y axis — the component of (vecC − vecA) perpendicular to X
   *
   * In a perfect analogy this gives a clean parallelogram:
   *   A---→B
   *   |    |
   *   C---→D
   */
  projectAnalogy(vecA, vecB, vecC, vecD) {
    const dim = vecA.length;

    // X direction: B - A, normalized
    const xDir = new Float32Array(dim);
    let xNorm = 0;
    for (let d = 0; d < dim; d++) { xDir[d] = vecB[d] - vecA[d]; xNorm += xDir[d] ** 2; }
    xNorm = Math.sqrt(xNorm);
    for (let d = 0; d < dim; d++) xDir[d] /= xNorm;

    // Y direction: component of (C - A) perpendicular to xDir, normalized
    const ca = new Float32Array(dim);
    for (let d = 0; d < dim; d++) ca[d] = vecC[d] - vecA[d];
    const caOnX = ca.reduce((s, v, i) => s + v * xDir[i], 0);
    const yDir = new Float32Array(dim);
    let yNorm = 0;
    for (let d = 0; d < dim; d++) { yDir[d] = ca[d] - caOnX * xDir[d]; yNorm += yDir[d] ** 2; }
    yNorm = Math.sqrt(yNorm);
    for (let d = 0; d < dim; d++) yDir[d] /= (yNorm > 1e-10 ? yNorm : 1);

    // Both axes relative to A, so A sits at the origin (0, 0)
    return [vecA, vecB, vecC, vecD].map(v => {
      let x = 0, y = 0;
      for (let d = 0; d < dim; d++) {
        const delta = v[d] - vecA[d];
        x += delta * xDir[d];
        y += delta * yDir[d];
      }
      return { x, y };
    });
  }
}
