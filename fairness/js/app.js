'use strict';

// ── Explainer slides ─────────────────────────────────────────────────────────
const SLIDES = [
  {
    title: 'Twenty definitions of fairness — and counting',
    body:  'The machine learning literature has produced more than twenty distinct mathematical definitions of fairness, ' +
           'and they often <strong>disagree</strong>. They all start from the same place: a <strong>confusion matrix</strong> ' +
           'showing how a classifier performed on each group. This tool lets you build and compare them yourself — ' +
           'using real COMPAS data from Broward County, FL.',
    viz: `<div class="sv-matrix">
      <div class="sv-m-corner"></div>
      <div class="sv-m-head">Did Reoffend</div><div class="sv-m-head">Did NOT Reoffend</div>
      <div class="sv-m-row-head">High Risk</div>
      <div class="sv-m-cell sv-tp"><strong>TP</strong> — True Positive<br><small>Correctly scored High Risk</small></div>
      <div class="sv-m-cell sv-fp"><strong>FP</strong> — False Positive<br><small>Wrongly scored High Risk — would not have reoffended</small></div>
      <div class="sv-m-row-head">Low Risk</div>
      <div class="sv-m-cell sv-fn"><strong>FN</strong> — False Negative<br><small>Wrongly scored Low Risk — did go on to reoffend</small></div>
      <div class="sv-m-cell sv-tn"><strong>TN</strong> — True Negative<br><small>Correctly scored Low Risk</small></div>
    </div>
    <p class="sv-note">The app also shows five marginals — P, N, PP, PN, and n (row and column totals). All nine quantities are draggable.</p>`,
  },
  {
    title: 'Every fairness metric is a ratio',
    body:  'Each named criterion is a <strong>fraction</strong>: pick some defendants from the matrix, divide by another group. ' +
           'FP ÷ N is the False Positive Rate — of defendants who would <em>not</em> have reoffended, ' +
           'what fraction were labeled High Risk? ' +
           'ProPublica\'s 2016 investigation found this rate was nearly twice as high for Black defendants as for White defendants.',
    viz: `<div class="sv-frac-demo">
      <div class="sv-frac-expr">
        <span class="sv-frac-chip sv-fc-fp">FP</span>
        <span class="sv-frac-slash">÷</span>
        <span class="sv-frac-chip sv-fc-n">N</span>
        <span class="sv-frac-name">= False Positive Rate</span>
      </div>
      <div class="sv-stat-pills">
        <div class="sv-stat-pill sv-pill-dark"><span>Black defendants</span><strong>~45%</strong></div>
        <div class="sv-stat-pill sv-pill-light"><span>White defendants</span><strong>~24%</strong></div>
      </div>
    </div>`,
  },
  {
    title: 'Build a metric in the workspace',
    body:  'Click the <strong>Numerator</strong> zone to activate it (its label turns blue), ' +
           'then click any cell in either confusion matrix — it becomes a chip. ' +
           'Switch to <strong>Denominator</strong> and click another cell. ' +
           'When you assemble a known fairness criterion, the app names it and explains its significance.',
    viz: `<div class="sv-ws-demo">
      <div class="sv-ws-zone sv-ws-num">
        <span class="sv-ws-label">Numerator</span>
        <span class="sv-frac-chip sv-fc-fp">FP</span>
      </div>
      <div class="sv-ws-divider"></div>
      <div class="sv-ws-zone sv-ws-den">
        <span class="sv-ws-label">Denominator</span>
        <span class="sv-frac-chip sv-fc-n">N</span>
      </div>
      <p class="sv-ws-result">→ <strong>False Positive Rate</strong>: 44.8% (Black) · 23.5% (White)</p>
    </div>`,
  },
  {
    title: 'Some definitions can\'t coexist',
    body:  'Alexandra Chouldechova proved in 2017 that when two groups have different underlying reoffense rates ' +
           'and the algorithm is calibrated, no classifier can <strong>simultaneously</strong> equalize ' +
           'False Positive Rate, False Negative Rate, and Positive Predictive Value. ' +
           'The two groups here have different base rates. Build all three metrics and watch them diverge.',
    viz: `<div class="sv-bars">
      <div class="sv-bar-row">
        <span class="sv-bar-label">Black defendants</span>
        <div class="sv-bar-track"><div class="sv-bar-fill sv-bar-a" style="width:51%"></div></div>
        <span class="sv-bar-pct">~51%</span>
      </div>
      <div class="sv-bar-row">
        <span class="sv-bar-label">White defendants</span>
        <div class="sv-bar-track"><div class="sv-bar-fill sv-bar-b" style="width:39%"></div></div>
        <span class="sv-bar-pct">~39%</span>
      </div>
      <div class="sv-bar-caption">Actual two-year reoffense rate — Broward County, FL, 2013–2014</div>
    </div>
    <p class="sv-note">Build FPR (FP÷N), FNR (FN÷P), and PPV (TP÷PP). Chouldechova's theorem guarantees they can't all be equal when base rates differ.</p>`,
  },
];

let slideIndex = 0;

function renderSlide() {
  const s = SLIDES[slideIndex];
  document.getElementById('slide-title').textContent = s.title;
  document.getElementById('slide-body').innerHTML   = s.body;
  document.getElementById('slide-viz').innerHTML    = s.viz;
  document.querySelectorAll('#explainer .dot').forEach((d, i) => {
    d.classList.toggle('active', i === slideIndex);
  });
  document.getElementById('btn-prev').style.visibility = slideIndex === 0 ? 'hidden' : '';
  document.getElementById('btn-next').textContent =
    slideIndex === SLIDES.length - 1 ? 'Start exploring →' : 'Next →';
}

function showMainApp() {
  document.getElementById('explainer').classList.add('hidden');
  document.getElementById('main-app').classList.remove('hidden');
}

window.restartTutorial = function () {
  slideIndex = 0;
  renderSlide();
  document.getElementById('main-app').classList.add('hidden');
  document.getElementById('explainer').classList.remove('hidden');
};

// ── Dataset ──────────────────────────────────────────────────────────────────
// Pre-computed from compas/data/compas-scores-two-years.csv at threshold=5
// using the same filter as compas/js/app.js (score_text !== 'N/A').
const DATASET = {
  label: 'COMPAS (Broward County, FL)',
  source: 'ProPublica COMPAS dataset (2013–2014), threshold = 5',
  groups: [
    { name: 'Black Defendants', tp: 1369, fp: 805,  fn: 532,  tn: 990  },
    { name: 'White Defendants', tp: 505,  fp: 349,  fn: 461,  tn: 1139 }
  ],
  rowLabels: ['Scored High Risk', 'Scored Low Risk'],
  colLabels: ['Did Reoffend', 'Did NOT Reoffend']
};

// ── Helpers ──────────────────────────────────────────────────────────────────
function derived(g) {
  const { tp, fp, fn, tn } = g;
  return { tp, fp, fn, tn, p: tp + fn, n: fp + tn, pp: tp + fp, pn: tn + fn, all: tp + fp + fn + tn };
}

const fmt = n => n.toLocaleString();
const pct = v => v === null ? '—' : (v * 100).toFixed(1) + '%';

const CODE_LABELS = {
  tp: 'TP', fp: 'FP', fn: 'FN', tn: 'TN',
  p: 'P', n: 'N', pp: 'PP', pn: 'PN', all: 'n'
};

const CODE_CHIP_CLASS = {
  tp: 'chip-tp', tn: 'chip-tn', fp: 'chip-fp', fn: 'chip-fn',
  p: 'chip-marg', n: 'chip-marg', pp: 'chip-marg', pn: 'chip-marg', all: 'chip-marg'
};

// ── Known sums — for smart metric recognition ────────────────────────────────
// Collapsed before matching so TP+FN, FN+TP, and P all recognise the same metric.
const SUMS = [
  { parts: ['tp', 'fn'], whole: 'p'   },
  { parts: ['fp', 'tn'], whole: 'n'   },
  { parts: ['tp', 'fp'], whole: 'pp'  },
  { parts: ['tn', 'fn'], whole: 'pn'  },
  { parts: ['p',  'n' ], whole: 'all' },
  { parts: ['pp', 'pn'], whole: 'all' },
  { parts: ['tp', 'fp', 'fn', 'tn'], whole: 'all' },
];

function normalizeCodes(codes) {
  let arr = [...codes];
  let changed = true;
  while (changed) {
    changed = false;
    for (const rule of SUMS) {
      if (rule.parts.every(p => arr.includes(p))) {
        arr = arr.filter(c => !rule.parts.includes(c));
        arr.push(rule.whole);
        changed = true;
        break;
      }
    }
  }
  return arr;
}

// ── State ─────────────────────────────────────────────────────────────────────
let numCodes   = [];    // cell codes in the numerator zone
let denCodes   = [];    // cell codes in the denominator zone
let activeZone = 'num'; // which zone receives clicks on matrix cells
let metricsDb  = [];    // loaded from data/metrics.json
let savedRows  = [];    // { name, formula, values: [v0, v1] }

// ── Zone helpers ──────────────────────────────────────────────────────────────
const zoneOf = code =>
  numCodes.includes(code) ? 'num' : denCodes.includes(code) ? 'den' : null;

function placeCode(code, zone) {
  numCodes = numCodes.filter(c => c !== code);
  denCodes = denCodes.filter(c => c !== code);
  if (zone === 'num') numCodes.push(code);
  if (zone === 'den') denCodes.push(code);
}

// Click a cell: toggle membership in the active zone only — other zone untouched
function clickCell(code) {
  if (activeZone === 'num') {
    numCodes = numCodes.includes(code)
      ? numCodes.filter(c => c !== code)
      : [...numCodes, code];
  } else {
    denCodes = denCodes.includes(code)
      ? denCodes.filter(c => c !== code)
      : [...denCodes, code];
  }
  render();
}

// ── Computation ───────────────────────────────────────────────────────────────
function computeRatio(group, nCodes, dCodes) {
  const v = derived(group);
  const num = nCodes.reduce((s, c) => s + v[c], 0);
  const den = dCodes.reduce((s, c) => s + v[c], 0);
  return den ? num / den : null;
}

function formulaStr(nCodes, dCodes) {
  const num = nCodes.map(c => CODE_LABELS[c]).join(' + ') || '?';
  const denParts = dCodes.map(c => CODE_LABELS[c]);
  const den = denParts.length > 1 ? `(${denParts.join(' + ')})` : (denParts[0] || '?');
  return `${num} / ${den}`;
}

// ── Metric recognition ────────────────────────────────────────────────────────
// Normalizes sums first so TP+FN, FN+TP, and P all match the same metric.
function recognize() {
  if (!numCodes.length || !denCodes.length) return null;
  const nk = normalizeCodes(numCodes).sort().join(',');
  const dk = normalizeCodes(denCodes).sort().join(',');
  return metricsDb.find(m =>
    [...m.numerator].sort().join(',') === nk &&
    [...m.denominator].sort().join(',') === dk
  ) || null;
}

// ── Matrix HTML ───────────────────────────────────────────────────────────────
// Layout mirrors compas: rows = predicted score, cols = actual outcome
//         | Did Reoffend | Did NOT Reoffend | Total
//  HIGH   |      TP      |       FP         |  PP
//  LOW    |      FN      |       TN         |  PN
//  Total  |       P      |        N         |   n
function buildMatrixHTML(group) {
  const v = derived(group);

  function cell(code, cls, desc) {
    return `<div class="mat-cell ${cls}" data-code="${code}" draggable="true">
      <div class="cell-abbr">${CODE_LABELS[code]}</div>
      <div class="cell-count">${fmt(v[code])}</div>
      <div class="cell-desc">${desc}</div>
    </div>`;
  }

  return `<div class="matrix-grid">
    <div class="mat-corner"></div>
    <div class="mat-colhead">Did Reoffend</div>
    <div class="mat-colhead">Did NOT Reoffend</div>
    <div class="mat-total-label">Total</div>

    <div class="mat-rowhead"><span class="risk-badge high">High Risk</span></div>
    ${cell('tp', 'mat-tp',                 'correctly scored High Risk')}
    ${cell('fp', 'mat-fp',                 'incorrectly scored High Risk')}
    ${cell('pp', 'mat-marginal mat-pp',    'all scored High Risk')}

    <div class="mat-rowhead"><span class="risk-badge low">Low Risk</span></div>
    ${cell('fn', 'mat-fn',                 'incorrectly scored Low Risk')}
    ${cell('tn', 'mat-tn',                 'correctly scored Low Risk')}
    ${cell('pn', 'mat-marginal mat-pn',    'all scored Low Risk')}

    <div class="mat-total-label">Total</div>
    ${cell('p',   'mat-marginal mat-p',    'all who reoffended')}
    ${cell('n',   'mat-marginal mat-n',    'all who did not reoffend')}
    ${cell('all', 'mat-marginal mat-all',  'all defendants')}
  </div>`;
}

// ── Render helpers ────────────────────────────────────────────────────────────
function updateCellHighlights() {
  document.querySelectorAll('.mat-cell[data-code]').forEach(el => {
    const code = el.dataset.code;
    el.classList.toggle('in-num', numCodes.includes(code));
    el.classList.toggle('in-den', denCodes.includes(code));
  });
}

function renderResults() {
  DATASET.groups.forEach((group, i) => {
    const el  = document.querySelector(`.live-result[data-group="${i}"]`);
    const has = numCodes.length && denCodes.length;
    if (!has) {
      el.innerHTML = '<span class="result-placeholder">← build a ratio in the workspace below</span>';
      return;
    }
    const val    = computeRatio(group, numCodes, denCodes);
    const metric = recognize();
    el.innerHTML = `
      <div class="result-value">${pct(val)}</div>
      <div class="result-formula">${formulaStr(numCodes, denCodes)}</div>
      ${metric ? `<div class="result-name">${metric.names[0]}</div>` : ''}`;
  });
}

function buildZoneHTML(codes, zone) {
  if (!codes.length) {
    const label = zone === 'num' ? 'numerator' : 'denominator';
    return `<span class="zone-hint">${label} — drag or click cells here</span>`;
  }
  const chips = codes.map(c =>
    `<span class="chip ${CODE_CHIP_CLASS[c]}" data-code="${c}" data-zone="${zone}" draggable="true">
      ${CODE_LABELS[c]}<button class="chip-x" data-code="${c}" data-zone="${zone}" type="button">×</button>
    </span>`
  );
  return chips.join('<span class="chip-plus">+</span>');
}

function renderWorkspace() {
  document.getElementById('num-zone').innerHTML = buildZoneHTML(numCodes, 'num');
  document.getElementById('den-zone').innerHTML = buildZoneHTML(denCodes, 'den');

  const has    = numCodes.length > 0 && denCodes.length > 0;
  const metric = recognize();
  const info   = document.getElementById('metric-info');

  document.getElementById('btn-remember').disabled = !has;

  if (!has) { info.innerHTML = ''; return; }

  if (metric) {
    const synonyms = metric.names.slice(1).join(', ');
    info.innerHTML = `<div class="metric-found">
      <div class="metric-primary-name">${metric.names[0]}</div>
      ${synonyms ? `<div class="metric-synonyms">Also known as: ${synonyms}</div>` : ''}
      <p class="metric-commentary">${metric.commentary}</p>
      ${metric.sources?.length ? `<p class="metric-sources"><em>Sources:</em> ${metric.sources.join(' · ')}</p>` : ''}
    </div>`;
  } else {
    info.innerHTML = `<div class="metric-unknown">
      <div class="metric-custom-label">Custom ratio</div>
      <p class="metric-commentary">This combination doesn't match a named metric in the database — but the values are live above, and you can save it to the comparison table.</p>
    </div>`;
  }
}

function renderSavedTable() {
  const section = document.getElementById('saved-section');
  if (!savedRows.length) { section.style.display = 'none'; return; }
  section.style.display = '';
  document.getElementById('saved-tbody').innerHTML = savedRows.map((row, i) => {
    const [v0, v1] = row.values;
    const delta    = v0 !== null && v1 !== null ? Math.abs(v0 - v1) : null;
    return `<tr>
      <td>${row.name}</td>
      <td class="formula-cell">${row.formula}</td>
      <td class="value-cell">${pct(v0)}</td>
      <td class="value-cell">${pct(v1)}</td>
      <td class="delta-cell${delta !== null && delta > 0.05 ? ' delta-large' : ''}">${pct(delta)}</td>
      <td><button class="btn-remove-row" data-index="${i}" type="button">×</button></td>
    </tr>`;
  }).join('');
}

function printMetrics() {
  const [g0, g1] = DATASET.groups;
  const rows = savedRows.map(row => {
    const [v0, v1] = row.values;
    const delta = v0 !== null && v1 !== null ? Math.abs(v0 - v1) : null;
    const highlight = delta !== null && delta > 0.05;
    return `<tr>
      <td>${row.name}</td>
      <td class="formula">${row.formula}</td>
      <td>${pct(v0)}</td>
      <td>${pct(v1)}</td>
      <td class="${highlight ? 'delta-large' : ''}">${pct(delta)}</td>
    </tr>`;
  }).join('');

  const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Fairness Metrics — COMPAS</title>
<style>
  body { font-family: Georgia, serif; font-size: 13px; color: #1e293b; margin: 2cm 2.5cm; }
  h1 { font-size: 1.3rem; margin: 0 0 0.15rem; }
  .sub { font-size: 0.85rem; color: #475569; margin-bottom: 1.25rem; }
  .dataset { background: #f1f5f9; border-left: 3px solid #1a1a2e; padding: 0.55rem 0.85rem; margin-bottom: 0.9rem; font-size: 0.82rem; line-height: 1.55; }
  table { width: 100%; border-collapse: collapse; margin-top: 0.5rem; }
  th { background: #1a1a2e; color: #fff; text-align: left; padding: 0.4rem 0.6rem; font-size: 0.78rem; font-family: sans-serif; font-weight: 600; }
  td { padding: 0.38rem 0.6rem; border-bottom: 1px solid #e2e8f0; vertical-align: top; }
  tr:last-child td { border-bottom: none; }
  .formula { font-family: monospace; font-size: 0.82rem; color: #475569; }
  .delta-large { color: #b91c1c; font-weight: 600; }
  .note { margin-top: 1.25rem; font-size: 0.78rem; color: #64748b; line-height: 1.5; border-top: 1px solid #e2e8f0; padding-top: 0.75rem; }
  .footer { margin-top: 1.5rem; font-size: 0.72rem; color: #94a3b8; font-family: sans-serif; }
</style>
</head>
<body>
<h1>Fairness Metrics Comparison</h1>
<p class="sub">AI Law Casebook — Fairness Definitions Explorer</p>

<div class="dataset">
  <strong>Dataset:</strong> ProPublica COMPAS dataset, Broward County, FL, 2013–2014 &nbsp;·&nbsp; Score threshold = 5<br>
  <strong>${g0.name}:</strong> n = ${fmt(g0.tp + g0.fp + g0.fn + g0.tn)} &nbsp;·&nbsp;
  <strong>${g1.name}:</strong> n = ${fmt(g1.tp + g1.fp + g1.fn + g1.tn)}<br>
  Each metric is a ratio from the confusion matrix showing how COMPAS classified defendants.
  Values above 5% difference are highlighted in red.
</div>

<table>
  <thead>
    <tr>
      <th>Metric</th>
      <th>Formula</th>
      <th>${g0.name}</th>
      <th>${g1.name}</th>
      <th>Difference</th>
    </tr>
  </thead>
  <tbody>${rows}</tbody>
</table>

<p class="note">
  Chouldechova (2017): when two groups have different underlying reoffense rates and the algorithm is calibrated,
  no classifier can simultaneously equalize False Positive Rate, False Negative Rate, and Positive Predictive Value.
  Black and White defendants in this dataset have base rates of approximately 51% and 39%, respectively.
</p>

<p class="footer">Generated ${date} &nbsp;·&nbsp; ${DATASET.source}</p>
</body>
</html>`;

  const w = window.open('', '_blank');
  w.document.write(html);
  w.document.close();
  w.focus();
  w.print();
}

function render() {
  updateCellHighlights();
  renderResults();
  renderWorkspace();
  renderSavedTable();
  // Reflect active zone in wrapper labels
  document.querySelectorAll('.zone-wrapper').forEach(w => {
    w.classList.toggle('zone-active', w.dataset.zone === activeZone);
  });
}

// ── Event handling ────────────────────────────────────────────────────────────
document.addEventListener('click', e => {
  // Chip × button (must check before mat-cell, since chips live inside zones not matrices)
  const chipX = e.target.closest('.chip-x');
  if (chipX) {
    const { code, zone } = chipX.dataset;
    if (zone === 'num') numCodes = numCodes.filter(c => c !== code);
    else               denCodes = denCodes.filter(c => c !== code);
    render(); return;
  }

  // Matrix cell click → add to / remove from active zone
  const cell = e.target.closest('.mat-cell[data-code]');
  if (cell) { clickCell(cell.dataset.code); return; }

  // Zone wrapper click → activate that zone
  const zoneWrap = e.target.closest('.zone-wrapper');
  if (zoneWrap && !e.target.closest('.chip-x')) {
    activeZone = zoneWrap.dataset.zone;
    render(); return;
  }

  // Remember button
  if (e.target.id === 'btn-remember') {
    const metric = recognize();
    savedRows.push({
      name:    metric ? metric.names[0] : 'Custom ratio',
      formula: formulaStr(numCodes, denCodes),
      values:  DATASET.groups.map(g => computeRatio(g, numCodes, denCodes))
    });
    render(); return;
  }

  // Print button
  if (e.target.id === 'btn-print') {
    printMetrics(); return;
  }

  // Clear button
  if (e.target.id === 'btn-clear') {
    numCodes = []; denCodes = []; render(); return;
  }

  // Remove saved row
  const removeBtn = e.target.closest('.btn-remove-row');
  if (removeBtn) {
    savedRows.splice(+removeBtn.dataset.index, 1);
    render(); return;
  }
});

// ── Drag and drop ─────────────────────────────────────────────────────────────
let dragSource = null; // cleared in dragend

// Full-page "trash" zone sits under the workspace zones (z-index:1 vs zone's z-index:2).
// It accepts any chip drop that misses both zones so the browser never plays a snap-back.
const trashZone = document.createElement('div');
trashZone.style.cssText = 'position:fixed;inset:0;z-index:1;display:none;';
document.body.appendChild(trashZone);

trashZone.addEventListener('dragover', e => {
  if (dragSource?.type !== 'chip') return;
  e.preventDefault();
  e.dataTransfer.dropEffect = 'copy';
});

trashZone.addEventListener('drop', e => {
  e.preventDefault();
  trashZone.style.display = 'none'; // hide before render() removes the dragged element
  const src = dragSource;
  dragSource = null;
  if (src?.type === 'chip') {
    if (src.zone === 'num') numCodes = numCodes.filter(c => c !== src.code);
    else                    denCodes = denCodes.filter(c => c !== src.code);
    render();
  }
});

document.addEventListener('dragstart', e => {
  dragSource = null;
  const cell = e.target.closest('.mat-cell[data-code]');
  if (cell) {
    dragSource = { type: 'cell' };
    e.dataTransfer.setData('application/x-fairness', JSON.stringify({ code: cell.dataset.code }));
    e.dataTransfer.effectAllowed = 'copy';
    return;
  }
  const chip = e.target.closest('.chip[data-code]');
  if (chip) {
    dragSource = { type: 'chip', code: chip.dataset.code, zone: chip.dataset.zone };
    e.dataTransfer.setData('application/x-fairness',
      JSON.stringify({ code: chip.dataset.code, fromZone: chip.dataset.zone }));
    e.dataTransfer.effectAllowed = 'copy';
    trashZone.style.display = 'block';
  }
});

document.addEventListener('dragend', () => {
  trashZone.style.display = 'none';
  dragSource = null;
});

function setupDropZone(el, targetZone) {
  el.addEventListener('dragover', e => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    el.classList.add('drag-over');
  });
  el.addEventListener('dragleave', e => {
    if (!el.contains(e.relatedTarget)) el.classList.remove('drag-over');
  });
  el.addEventListener('drop', e => {
    e.preventDefault();
    el.classList.remove('drag-over');
    trashZone.style.display = 'none';
    dragSource = null;
    let payload;
    try { payload = JSON.parse(e.dataTransfer.getData('application/x-fairness')); }
    catch { return; }
    const { code, fromZone } = payload;
    if (!code) return;
    // Remove from source zone if moving a chip
    if (fromZone === 'num') numCodes = numCodes.filter(c => c !== code);
    if (fromZone === 'den') denCodes = denCodes.filter(c => c !== code);
    // Place in target zone (avoid duplicate)
    if (targetZone === 'num' && !numCodes.includes(code)) numCodes.push(code);
    if (targetZone === 'den' && !denCodes.includes(code)) denCodes.push(code);
    render();
  });
}

// ── Boot ──────────────────────────────────────────────────────────────────────

// Slide navigation
document.getElementById('btn-next').addEventListener('click', () => {
  if (slideIndex < SLIDES.length - 1) { slideIndex++; renderSlide(); }
  else showMainApp();
});
document.getElementById('btn-prev').addEventListener('click', () => {
  if (slideIndex > 0) { slideIndex--; renderSlide(); }
});
document.getElementById('btn-skip').addEventListener('click', showMainApp);

renderSlide();

// Inject matrix HTML into each .matrix-card
document.querySelectorAll('.matrix-card').forEach((card, i) => {
  card.querySelector('.group-name').textContent = DATASET.groups[i].name;
  card.querySelector('.matrix-wrap').innerHTML  = buildMatrixHTML(DATASET.groups[i]);
});

// Wire up drop zones
setupDropZone(document.getElementById('num-zone'), 'num');
setupDropZone(document.getElementById('den-zone'), 'den');

// Initial render
render();

// Load metrics database
fetch('data/metrics.json')
  .then(r => r.json())
  .then(data => { metricsDb = data.metrics || []; })
  .catch(err => console.warn('Could not load metrics.json:', err));
