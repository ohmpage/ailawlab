'use strict';

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
window.restartTutorial = function() {};  // no-op; tutorial added in V2

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
