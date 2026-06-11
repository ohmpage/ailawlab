/**
 * app.js — Explainer slides + analogy demo UI + D3 visualization.
 */

// ─── Model config ─────────────────────────────────────────────────────────────

const MODEL_CONFIGS = {
  glove: {
    label:   'GloVe 6B',
    vocab:   'data/glove/vocab.json',
    vectors: 'data/glove/vectors.bin',
    examples: [
      { query: 'man,king,woman',       label: 'man : king :: woman : ?' },
      { query: 'man,programmer,woman', label: 'man : programmer :: woman : ?' },
      { query: 'man,doctor,woman',     label: 'man : doctor :: woman : ?' },
      { query: 'man,CEO,woman',        label: 'man : CEO :: woman : ?' },
      { query: 'man,brilliant,woman',  label: 'man : brilliant :: woman : ?' },
      { query: 'black,criminal,white', label: 'black : criminal :: white : ?' },
      { query: 'obama,america,trump',  label: 'obama : america :: trump : ?' },
    ],
  },
  googlenews: {
    label:   'Google News',
    vocab:   'data/googlenews/vocab.json',
    vectors: 'data/googlenews/vectors.bin',
    examples: [
      { query: 'man,computer programmer,woman', label: 'man : computer programmer :: woman : ?' },
      { query: 'man,doctor,woman',              label: 'man : doctor :: woman : ?' },
      { query: 'man,CEO,woman',                 label: 'man : CEO :: woman : ?' },
      { query: 'man,brilliant,woman',           label: 'man : brilliant :: woman : ?' },
      { query: 'black,criminal,white',          label: 'black : criminal :: white : ?' },
      { query: 'obama,america,trump',           label: 'obama : america :: trump : ?' },
    ],
  },
  twitter: {
    label:   'GloVe Twitter',
    vocab:   'data/twitter/vocab.json',
    vectors: 'data/twitter/vectors.bin',
    examples: [
      { query: 'man,king,woman',       label: 'man : king :: woman : ?' },
      { query: 'man,programmer,woman', label: 'man : programmer :: woman : ?' },
      { query: 'man,doctor,woman',     label: 'man : doctor :: woman : ?' },
      { query: 'man,CEO,woman',        label: 'man : CEO :: woman : ?' },
      { query: 'man,brilliant,woman',  label: 'man : brilliant :: woman : ?' },
      { query: 'black,criminal,white', label: 'black : criminal :: white : ?' },
      { query: 'obama,america,trump',  label: 'obama : america :: trump : ?' },
    ],
  },
};

// ─── Globals ──────────────────────────────────────────────────────────────────

const modelInstances = {};
let activeModelKey = 'glove';
let currentSlide = 0;

function getActiveModel() { return modelInstances[activeModelKey]; }

// ─── Boot ─────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  initExplainer();
  initLoad();
  document.querySelectorAll('.model-btn').forEach(btn => {
    btn.addEventListener('click', () => switchModel(btn.dataset.model));
  });
});

// ─── Model loading ────────────────────────────────────────────────────────────

async function initLoad() {
  const bar    = document.getElementById('progress-bar');
  const status = document.getElementById('load-status');
  try {
    await loadModelByKey('glove', pct => {
      bar.style.width = `${Math.round(pct * 100)}%`;
      status.textContent = pct < 1
        ? `Loading word vectors… ${Math.round(pct * 100)}%`
        : `Ready — ${modelInstances.glove.numWords.toLocaleString()} words loaded`;
    });
    document.getElementById('loading-overlay').classList.add('done');
    enableDemo();
  } catch (e) {
    document.getElementById('load-status').textContent = 'Failed to load vectors. See console for details.';
    console.error(e);
  }
}

async function loadModelByKey(key, onProgress) {
  if (modelInstances[key]?.ready) return modelInstances[key];
  const cfg = MODEL_CONFIGS[key];
  const m = new VectorModel();
  modelInstances[key] = m;
  await m.load(cfg.vocab, cfg.vectors, onProgress);
  return m;
}

function enableDemo() {
  document.getElementById('compute-btn').disabled = false;
  document.querySelectorAll('.model-btn').forEach(b => b.disabled = false);
  renderExamples(activeModelKey);
}

// ─── Model switching ──────────────────────────────────────────────────────────

async function switchModel(key) {
  if (key === activeModelKey) return;

  document.querySelectorAll('.model-btn').forEach(b => b.classList.remove('active'));
  document.querySelector(`.model-btn[data-model="${key}"]`).classList.add('active');
  activeModelKey = key;

  // Clear any current result
  document.getElementById('result-box').style.display = 'none';
  document.getElementById('error-box').style.display = 'none';
  document.getElementById('bc-similarity').textContent = '';
  d3.select('#viz').html('');

  // Already loaded — just swap examples
  if (modelInstances[key]?.ready) {
    renderExamples(key);
    return;
  }

  // Lazy load with inline progress on the button
  const btn = document.querySelector(`.model-btn[data-model="${key}"]`);
  const savedHTML = btn.innerHTML;
  document.getElementById('compute-btn').disabled = true;
  document.querySelectorAll('.model-btn').forEach(b => b.disabled = true);
  renderExamples(key); // renders disabled example buttons as a placeholder

  try {
    await loadModelByKey(key, pct => {
      btn.textContent = `Loading… ${Math.round(pct * 100)}%`;
    });
    btn.innerHTML = savedHTML;
  } catch (e) {
    console.error(e);
    btn.innerHTML = savedHTML;
    document.getElementById('error-box').textContent =
      `Failed to load ${MODEL_CONFIGS[key].label} vectors.`;
    document.getElementById('error-box').style.display = 'block';
  }

  document.getElementById('compute-btn').disabled = false;
  document.querySelectorAll('.model-btn').forEach(b => b.disabled = false);
  renderExamples(key);
}

function renderExamples(key) {
  const cfg = MODEL_CONFIGS[key];
  const row = document.querySelector('.examples-row');
  row.querySelectorAll('.example-btn').forEach(b => b.remove());

  const ready = modelInstances[key]?.ready;
  cfg.examples.forEach(ex => {
    const btn = document.createElement('button');
    btn.className = 'example-btn';
    btn.dataset.query = ex.query;
    btn.disabled = !ready;
    btn.textContent = ex.label;
    btn.addEventListener('click', () => {
      const [a, b, c] = ex.query.split(',');
      document.getElementById('word-a').value = a;
      document.getElementById('word-b').value = b;
      document.getElementById('word-c').value = c;
      runAnalogy();
    });
    row.appendChild(btn);
  });
}

// ─── Explainer slides ─────────────────────────────────────────────────────────

const SLIDES = [
  {
    title: 'Words as points in space',
    body: `A word embedding is a way of turning words into numbers. Each word
           becomes a list of ~50 numbers — a <em>vector</em> — chosen so that
           words used in similar contexts land near each other in this
           high-dimensional space. Here's a tiny 2D slice:`,
    draw: drawSlide1,
  },
  {
    title: 'Relationships become geometry',
    body: `Because the positions encode meaning, relationships between words
           show up as arrows — directions in the space.
           The arrow from <em>man</em> → <em>woman</em> points the same way
           as <em>king</em> → <em>queen</em>, <em>actor</em> → <em>actress</em>,
           and hundreds of other pairs.`,
    draw: drawSlide2,
  },
  {
    title: 'Follow the same arrow, find the missing word',
    body: `Those arrows act like directions you can follow. Take the arrow
           from <em>man</em> to <em>king</em>. Now start instead from <em>woman</em>
           and follow that same direction — you land right next to <em>queen</em>.
           The model didn't learn this explicitly; it emerged from patterns in text.`,
    draw: drawSlide3,
  },
  {
    title: 'These patterns encode our biases',
    body: `The model learned from billions of words of real text — written
           by humans, reflecting who wrote it and what they assumed.
           Those assumptions live in the geometry.
           The result is not always reassuring. Try it yourself:`,
    draw: drawSlide4,
  },
];

function initExplainer() {
  renderSlide(0);

  document.getElementById('btn-next').addEventListener('click', () => {
    if (currentSlide < SLIDES.length - 1) renderSlide(currentSlide + 1);
    else goToDemo();
  });
  document.getElementById('btn-prev').addEventListener('click', () => {
    if (currentSlide > 0) renderSlide(currentSlide - 1);
  });
  document.getElementById('btn-skip').addEventListener('click', goToDemo);

  // Demo form
  document.getElementById('compute-btn').addEventListener('click', runAnalogy);
  ['word-a', 'word-b', 'word-c'].forEach(id => {
    document.getElementById(id).addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        const ids = ['word-a', 'word-b', 'word-c'];
        const next = ids[ids.indexOf(id) + 1];
        if (next) document.getElementById(next).focus();
        else runAnalogy();
      }
    });
  });
}

function renderSlide(idx) {
  currentSlide = idx;
  const slide = SLIDES[idx];
  document.getElementById('slide-title').innerHTML = slide.title;
  document.getElementById('slide-body').innerHTML = slide.body;
  document.getElementById('btn-prev').disabled = idx === 0;
  document.getElementById('btn-next').textContent =
    idx === SLIDES.length - 1 ? 'Go to demo →' : 'Next →';

  // Dot indicators
  document.querySelectorAll('.dot').forEach((d, i) => {
    d.classList.toggle('active', i === idx);
  });

  const svg = d3.select('#slide-viz').html('');
  slide.draw(svg);
}

function goToDemo() {
  document.getElementById('explainer').style.display = 'none';
  document.getElementById('demo').style.display = 'block';
  document.getElementById('word-a').focus();
}

// ─── Explainer drawings (stylized, using hardcoded positions) ────────────────

// Shared word positions (approximate, for illustration only)
const WORD_POS = {
  king:      { x: 380, y: 110 },
  queen:     { x: 540, y: 110 },
  man:       { x: 380, y: 250 },
  woman:     { x: 540, y: 250 },
  actor:     { x: 200, y: 170 },
  actress:   { x: 360, y: 170 },
  uncle:     { x: 200, y: 310 },
  aunt:      { x: 360, y: 310 },
  programmer:{ x: 380, y: 110 },
  homemaker: { x: 540, y: 110 },
  doctor:    { x: 380, y: 250 },
  nurse:     { x: 540, y: 250 },
};

const COLORS = {
  node: '#1a1a2e',
  arrow: '#e94560',
  arrowAlt: '#0f3460',
  highlight: '#e94560',
  predict: '#f5a623',
  gridLine: '#e0e0e0',
};

function makeSVG(sel, w = 720, h = 380) {
  return sel.append('svg')
    .attr('viewBox', `0 0 ${w} ${h}`)
    .attr('preserveAspectRatio', 'xMidYMid meet')
    .style('width', '100%')
    .style('height', 'auto');
}

function addArrowDef(svg, id, color) {
  svg.append('defs').append('marker')
    .attr('id', id)
    .attr('markerWidth', 8).attr('markerHeight', 6)
    .attr('refX', 8).attr('refY', 3)
    .attr('orient', 'auto')
    .append('polygon')
    .attr('points', '0 0, 8 3, 0 6')
    .attr('fill', color);
}

function drawWord(g, pos, label, opts = {}) {
  const r = opts.r || 22;
  const fill = opts.fill || '#fff';
  const stroke = opts.stroke || COLORS.node;
  g.append('circle')
    .attr('cx', pos.x).attr('cy', pos.y).attr('r', r)
    .attr('fill', fill).attr('stroke', stroke).attr('stroke-width', 2);
  g.append('text')
    .attr('x', pos.x).attr('y', pos.y + 5)
    .attr('text-anchor', 'middle')
    .attr('font-size', opts.fontSize || 13)
    .attr('font-family', 'Georgia, serif')
    .attr('fill', stroke)
    .text(label);
}

function drawArrow(g, from, to, markerId, opts = {}) {
  const dx = to.x - from.x, dy = to.y - from.y;
  const len = Math.sqrt(dx * dx + dy * dy);
  const r = 22;
  const sx = from.x + (dx / len) * r;
  const sy = from.y + (dy / len) * r;
  const ex = to.x - (dx / len) * r;
  const ey = to.y - (dy / len) * r;
  g.append('line')
    .attr('x1', sx).attr('y1', sy).attr('x2', ex).attr('y2', ey)
    .attr('stroke', opts.color || COLORS.arrow)
    .attr('stroke-width', opts.width || 2)
    .attr('stroke-dasharray', opts.dash || null)
    .attr('marker-end', `url(#${markerId})`);
}

function drawSlide1(sel) {
  const svg = makeSVG(sel);
  addArrowDef(svg, 'arr1', COLORS.arrow);
  const g = svg.append('g');

  // A few loose clusters to illustrate "similar words cluster together"
  const clusters = [
    { words: ['king', 'queen', 'prince', 'castle'], cx: 200, cy: 150, spread: 55, color: '#e8f4f8' },
    { words: ['dog', 'cat', 'horse', 'mouse'],      cx: 480, cy: 120, spread: 55, color: '#f8f4e8' },
    { words: ['red', 'blue', 'green', 'yellow'],    cx: 560, cy: 280, spread: 55, color: '#f4e8f8' },
    { words: ['run', 'walk', 'jump', 'swim'],       cx: 250, cy: 300, spread: 55, color: '#e8f8ee' },
  ];

  const rng = mulberry32(42);
  clusters.forEach(cl => {
    // Background blob
    g.append('ellipse')
      .attr('cx', cl.cx).attr('cy', cl.cy)
      .attr('rx', cl.spread + 20).attr('ry', cl.spread + 10)
      .attr('fill', cl.color).attr('opacity', 0.7);

    cl.words.forEach((w, i) => {
      const angle = (i / cl.words.length) * 2 * Math.PI;
      const r = cl.spread * (0.5 + rng() * 0.5);
      const pos = { x: cl.cx + r * Math.cos(angle), y: cl.cy + r * Math.sin(angle) };
      g.append('circle')
        .attr('cx', pos.x).attr('cy', pos.y).attr('r', 4).attr('fill', COLORS.node);
      g.append('text')
        .attr('x', pos.x + 8).attr('y', pos.y + 4)
        .attr('font-size', 12).attr('font-family', 'Georgia, serif')
        .attr('fill', COLORS.node).text(w);
    });
  });

  // Label
  g.append('text')
    .attr('x', 30).attr('y', 360)
    .attr('font-size', 12).attr('fill', '#888').attr('font-style', 'italic')
    .text('Each dot is a word. Distance ≈ semantic similarity. (Positions are schematic.)');
}

function drawSlide2(sel) {
  const svg = makeSVG(sel);
  addArrowDef(svg, 'arr2r', COLORS.arrow);
  addArrowDef(svg, 'arr2b', COLORS.arrowAlt);
  const g = svg.append('g');

  const pairs = [
    { from: WORD_POS.man,   to: WORD_POS.woman,   label: 'gender', color: COLORS.arrow,    mid: { mark: 'arr2r' } },
    { from: WORD_POS.king,  to: WORD_POS.queen,   label: 'gender', color: COLORS.arrow,    mid: { mark: 'arr2r' } },
    { from: WORD_POS.actor, to: WORD_POS.actress,  label: 'gender', color: COLORS.arrow,    mid: { mark: 'arr2r' } },
    { from: WORD_POS.uncle, to: WORD_POS.aunt,    label: 'gender', color: COLORS.arrow,    mid: { mark: 'arr2r' } },
  ];

  const words = ['king', 'queen', 'man', 'woman', 'actor', 'actress', 'uncle', 'aunt'];
  words.forEach(w => drawWord(g, WORD_POS[w], w));
  pairs.forEach(p => drawArrow(g, p.from, p.to, p.mid.mark, { color: p.color }));

  // "same direction" brace label
  g.append('text')
    .attr('x', 610).attr('y', 240)
    .attr('font-size', 12).attr('fill', COLORS.arrow).attr('font-style', 'italic')
    .text('same direction →');

  g.append('text')
    .attr('x', 30).attr('y', 360)
    .attr('font-size', 12).attr('fill', '#888').attr('font-style', 'italic')
    .text('All four arrows point the same way — that direction encodes "gender" in this space.');
}

function drawSlide3(sel) {
  const svg = makeSVG(sel);
  addArrowDef(svg, 'arr3b', COLORS.arrowAlt);
  const g = svg.append('g');

  // Left-to-right layout: top pair (man→king), bottom pair (woman→queen)
  const pts = {
    man:   { x: 185, y: 148 },
    king:  { x: 450, y: 148 },
    woman: { x: 185, y: 272 },
    queen: { x: 450, y: 272 },
  };

  // Parallelogram fill
  g.append('polygon')
    .attr('points', [pts.man, pts.king, pts.queen, pts.woman]
      .map(p => `${p.x},${p.y}`).join(' '))
    .attr('fill', '#fce8e8').attr('opacity', 0.6);

  // Two parallel left-to-right arrows — same direction, different starting points
  drawArrow(g, pts.man,   pts.king,  'arr3b', { color: COLORS.arrowAlt, width: 2.5 });
  drawArrow(g, pts.woman, pts.queen, 'arr3b', { color: COLORS.arrowAlt, width: 2.5 });

  Object.entries(pts).forEach(([w, p]) => drawWord(g, p, w));

  const eq = g.append('text').attr('x', 60).attr('y', 340)
    .attr('font-size', 15).attr('font-family', 'Georgia, serif');
  eq.append('tspan').attr('fill', COLORS.node).text('man is to king as woman is to ');
  eq.append('tspan').attr('fill', COLORS.arrowAlt).attr('font-weight', 'bold').text('queen');

  g.append('text')
    .attr('x', 60).attr('y', 360)
    .attr('font-size', 11).attr('fill', '#888').attr('font-style', 'italic')
    .text('Follow the same arrow from a different starting point — and land on the answer.');
}

function drawSlide4(sel) {
  const svg = makeSVG(sel);
  addArrowDef(svg, 'arr4b', COLORS.arrowAlt);
  const g = svg.append('g');

  // Left-to-right layout: top pair (man→programmer), bottom pair (woman→homemaker)
  const pts = {
    man:        { x: 185, y: 148 },
    programmer: { x: 480, y: 148 },
    woman:      { x: 185, y: 272 },
    homemaker:  { x: 480, y: 272 },
  };

  g.append('polygon')
    .attr('points', [pts.man, pts.programmer, pts.homemaker, pts.woman]
      .map(p => `${p.x},${p.y}`).join(' '))
    .attr('fill', '#fce8e8').attr('opacity', 0.6);

  // Two parallel left-to-right arrows — same direction applied to man and to woman
  drawArrow(g, pts.man,   pts.programmer, 'arr4b', { color: COLORS.arrowAlt, width: 2.5 });
  drawArrow(g, pts.woman, pts.homemaker,  'arr4b', { color: COLORS.arrowAlt, width: 2.5 });

  Object.entries(pts).forEach(([w, p]) => drawWord(g, p, w));

  const eq = g.append('text').attr('x', 60).attr('y', 335)
    .attr('font-size', 15).attr('font-family', 'Georgia, serif');
  eq.append('tspan').attr('fill', COLORS.node).text('man is to programmer as woman is to ');
  eq.append('tspan').attr('fill', COLORS.arrow).attr('font-weight', 'bold').text('homemaker');

  g.append('text').attr('x', 60).attr('y', 360)
    .attr('font-size', 12).attr('fill', '#888').attr('font-style', 'italic')
    .text('This is from a model trained on real text — not a toy example. What else does it encode?');
}

// ─── Word resolution (space → underscore for phrase-capable models) ───────────

function resolveWord(raw) {
  const m = getActiveModel();
  const word = raw.toLowerCase();
  if (!m || !m.ready) return word;
  if (m.has(word)) return word;
  const underscored = word.replace(/\s+/g, '_');
  if (underscored !== word && m.has(underscored)) return underscored;
  return word;
}

// ─── Demo: run the analogy ────────────────────────────────────────────────────

function runAnalogy() {
  const m = getActiveModel();
  if (!m || !m.ready) return;

  const rawA = document.getElementById('word-a').value.trim();
  const rawB = document.getElementById('word-b').value.trim();
  const rawC = document.getElementById('word-c').value.trim();
  if (!rawA || !rawB || !rawC) return;

  const a = resolveWord(rawA);
  const b = resolveWord(rawB);
  const c = resolveWord(rawC);

  const { error, target, vecA, vecB, vecC, results } = m.analogy(a, b, c, 11);

  const resultBox = document.getElementById('result-box');
  const errorBox  = document.getElementById('error-box');

  if (error) {
    errorBox.textContent = error;
    errorBox.style.display = 'block';
    resultBox.style.display = 'none';
    document.getElementById('bc-similarity').textContent = '';
    d3.select('#viz').html('');
    return;
  }

  errorBox.style.display = 'none';
  resultBox.style.display = 'block';

  const top = results[0];
  document.getElementById('result-word').textContent = top.word;
  document.getElementById('result-score').textContent =
    `cosine similarity: ${top.score.toFixed(3)}`;

  const list = document.getElementById('result-list');
  list.innerHTML = results.slice(1, 11).map(r =>
    `<span class="alt-word">${r.word} <small>(${r.score.toFixed(2)})</small></span>`
  ).join('');

  // Score B would have received if not excluded: cos(normalized target, vecB)
  let tNorm = 0;
  for (let d = 0; d < target.length; d++) tNorm += target[d] ** 2;
  tNorm = Math.sqrt(tNorm);
  let bScore = 0;
  for (let d = 0; d < target.length; d++) bScore += (target[d] / tNorm) * vecB[d];
  document.getElementById('bc-similarity').textContent =
    `"${b}" was excluded from results; if included, it would have scored ${bScore.toFixed(2)}`;

  document.getElementById('equation-recap').innerHTML =
    `<strong>${a}</strong> is to <strong>${b}</strong> as <strong>${c}</strong> is to <strong class="highlight">${top.word}</strong>`;

  // D3 visualization
  const vecD = m.get(top.word);
  drawAnalogyViz(
    { word: a, vec: vecA },
    { word: b, vec: vecB },
    { word: c, vec: vecC },
    { word: top.word, vec: vecD },
    target
  );
}

// ─── D3 analogy visualization ─────────────────────────────────────────────────

function drawAnalogyViz(wA, wB, wC, wD, predicted) {
  const W = 700, H = 420, margin = { top: 44, right: 70, bottom: 62, left: 70 };
  const iw = W - margin.left - margin.right;
  const ih = H - margin.top  - margin.bottom;

  const m = getActiveModel();
  const pts2d = m.projectAnalogy(wA.vec, wB.vec, wC.vec, wD.vec);
  const pred2d = m.projectAnalogy(wA.vec, wB.vec, wC.vec, predicted)[3];

  // Include origin (0,0) in domain so axes are anchored at A's position
  const allX = [...pts2d.map(p => p.x), pred2d.x, 0];
  const allY = [...pts2d.map(p => p.y), pred2d.y, 0];
  const xExt = d3.extent(allX), yExt = d3.extent(allY);
  const pad = 0.22;
  const xRange = xExt[1] - xExt[0] || 1;
  const yRange = yExt[1] - yExt[0] || 1;

  const xScale = d3.scaleLinear()
    .domain([xExt[0] - xRange * pad, xExt[1] + xRange * pad])
    .range([0, iw]);
  const yScale = d3.scaleLinear()
    .domain([yExt[0] - yRange * pad, yExt[1] + yRange * pad])
    .range([ih, 0]);

  const px  = i => xScale(pts2d[i].x);
  const py  = i => yScale(pts2d[i].y);
  const ppx = xScale(pred2d.x);
  const ppy = yScale(pred2d.y);
  const ox  = xScale(0);   // origin in SVG coords
  const oy  = yScale(0);

  d3.select('#viz').html('');
  const svg = d3.select('#viz')
    .attr('viewBox', `0 0 ${W} ${H}`)
    .attr('preserveAspectRatio', 'xMidYMid meet')
    .style('width', '100%').style('height', 'auto');

  const defs = svg.append('defs');
  const mkArrow = (id, color) => {
    defs.append('marker')
      .attr('id', id).attr('markerWidth', 8).attr('markerHeight', 6)
      .attr('refX', 8).attr('refY', 3).attr('orient', 'auto')
      .append('polygon').attr('points', '0 0, 8 3, 0 6').attr('fill', color);
  };
  mkArrow('av-axis',   '#aaa');
  mkArrow('av-blue',   '#0f3460');
  mkArrow('av-orange', '#f5a623');

  const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

  // ── Coordinate axes ──────────────────────────────────────────────────────────
  g.append('line')
    .attr('x1', 0).attr('y1', oy).attr('x2', iw).attr('y2', oy)
    .attr('stroke', '#aaa').attr('stroke-width', 1.5)
    .attr('marker-end', 'url(#av-axis)');

  g.append('line')
    .attr('x1', ox).attr('y1', ih).attr('x2', ox).attr('y2', 0)
    .attr('stroke', '#aaa').attr('stroke-width', 1.5)
    .attr('marker-end', 'url(#av-axis)');

  g.append('circle').attr('cx', ox).attr('cy', oy).attr('r', 3).attr('fill', '#999');
  g.append('text').attr('x', ox - 9).attr('y', oy + 13)
    .attr('font-size', 10).attr('fill', '#aaa').attr('text-anchor', 'middle').text('0');

  g.append('text').attr('x', iw + 8).attr('y', oy + 4)
    .attr('font-size', 11).attr('fill', '#aaa').text('x');
  g.append('text').attr('x', ox + 5).attr('y', -6)
    .attr('font-size', 11).attr('fill', '#aaa').text('y');

  g.append('text').attr('x', iw / 2).attr('y', ih + 48)
    .attr('text-anchor', 'middle').attr('font-size', 10)
    .attr('fill', '#888').attr('font-style', 'italic')
    .text(`x axis: direction of the relationship  (${wA.word} → ${wB.word})`);

  // ── Two parallel arrows ───────────────────────────────────────────────────────
  const nodeR     = 17;
  const labels    = [wA.word, wB.word, wC.word, wD.word];
  const nodeFills = ['#fff',    '#fff',    '#fff',    '#e94560'];
  const textFills = ['#1a1a2e', '#1a1a2e', '#1a1a2e', '#fff'   ];

  function arrowLine(x1, y1, x2, y2, r1, r2, markerId, color, dash) {
    const dx = x2 - x1, dy = y2 - y1;
    const len = Math.sqrt(dx * dx + dy * dy) || 1;
    g.append('line')
      .attr('x1', x1 + dx / len * r1).attr('y1', y1 + dy / len * r1)
      .attr('x2', x2 - dx / len * r2).attr('y2', y2 - dy / len * r2)
      .attr('stroke', color).attr('stroke-width', 2.5)
      .attr('stroke-dasharray', dash || null)
      .attr('marker-end', `url(#${markerId})`);
  }

  arrowLine(px(0), py(0), px(1), py(1), nodeR, nodeR, 'av-blue', '#0f3460');
  arrowLine(px(2), py(2), px(3), py(3), nodeR, nodeR, 'av-blue', '#0f3460');

  // Predicted point (exact arithmetic before nearest-neighbor lookup)
  const predR = 5;
  const predDist = Math.sqrt((ppx - px(3)) ** 2 + (ppy - py(3)) ** 2);
  if (predDist > 5) {
    g.append('circle').attr('cx', ppx).attr('cy', ppy).attr('r', predR)
      .attr('fill', '#f5a623').attr('opacity', 0.85);
    g.append('text').attr('x', ppx + 8).attr('y', ppy - 8)
      .attr('font-size', 10).attr('fill', '#f5a623').attr('font-style', 'italic')
      .text('predicted');
    arrowLine(ppx, ppy, px(3), py(3), predR, nodeR, 'av-orange', '#f5a623', '4,3');
  }

  // ── Word nodes ───────────────────────────────────────────────────────────────
  [0, 1, 2, 3].forEach(i => {
    g.append('circle').attr('cx', px(i)).attr('cy', py(i)).attr('r', nodeR)
      .attr('fill', nodeFills[i]).attr('stroke', '#1a1a2e').attr('stroke-width', 2);
    g.append('text').attr('x', px(i)).attr('y', py(i) + 5)
      .attr('text-anchor', 'middle').attr('font-size', Math.min(11, Math.floor(55 / labels[i].length)))
      .attr('font-family', 'Georgia, serif').attr('fill', textFills[i])
      .text(labels[i]);
  });
}

// ─── Utility ──────────────────────────────────────────────────────────────────

// Seedable PRNG for deterministic slide layouts
function mulberry32(seed) {
  return function () {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
