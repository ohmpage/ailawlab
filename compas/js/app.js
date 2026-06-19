'use strict';

let rows = [];
let threshold = 5;
let activeStat = null;

// ── CSV parsing ──────────────────────────────────────────────────────────────
function parseCSV(text) {
  const lines = text.trim().split(/\r?\n/);
  const headers = splitCSVLine(lines[0]);
  return lines.slice(1).map(line => {
    const vals = splitCSVLine(line);
    const row = {};
    headers.forEach((h, i) => { row[h] = (vals[i] ?? '').trim(); });
    return row;
  });
}

function splitCSVLine(line) {
  const out = [];
  let cur = '', inQuote = false;
  for (const ch of line) {
    if (ch === '"') { inQuote = !inQuote; }
    else if (ch === ',' && !inQuote) { out.push(cur); cur = ''; }
    else { cur += ch; }
  }
  out.push(cur);
  return out;
}

// ── Computation ──────────────────────────────────────────────────────────────
function computeMatrix(race, thresh) {
  const group = rows.filter(r => r.race === race && r.score_text && r.score_text !== 'N/A');
  let TP = 0, FP = 0, FN = 0, TN = 0;
  for (const r of group) {
    const score   = +r.decile_score;
    const recid   = r.two_year_recid === '1';
    const flagged = score >= thresh;
    if      ( flagged &&  recid) TP++;
    else if ( flagged && !recid) FP++;
    else if (!flagged &&  recid) FN++;
    else                          TN++;
  }
  return { TP, FP, FN, TN, n: group.length };
}

function deriveStats({ TP, FP, FN, TN }) {
  const nonRecid = FP + TN;
  const recid    = TP + FN;
  const flagged  = TP + FP;
  const cleared  = FN + TN;
  return {
    fpRate: nonRecid ? FP / nonRecid : 0,
    fnRate: recid    ? FN / recid    : 0,
    ppv:    flagged  ? TP / flagged  : 0,
    npv:    cleared  ? TN / cleared  : 0,
  };
}

// ── Formatting ───────────────────────────────────────────────────────────────
const fmt = n => n.toLocaleString();
const pct = v => (v * 100).toFixed(1) + '%';

// ── Stat explainer definitions ───────────────────────────────────────────────
const STATS = {
  'fp-rate': {
    label: 'False Alarm Rate',
    desc:  'Of all defendants who did <em>not</em> reoffend, what fraction were scored High Risk?',
    numer: ['fp'],
    denom: ['fp', 'tn'],
    color: 'red',
  },
  ppv: {
    label: 'Score Accuracy',
    desc:  'Of all defendants scored High Risk, what fraction actually reoffended?',
    numer: ['tp'],
    denom: ['tp', 'fp'],
    color: 'blue',
  },
  'fn-rate': {
    label: 'Miss Rate',
    desc:  'Of all defendants who <em>did</em> reoffend, what fraction were scored Low Risk?',
    numer: ['fn'],
    denom: ['fn', 'tp'],
    color: 'amber',
  },
};

// Mini 2×2 grid: cells in order [TP, FP, FN, TN] matching the main matrix layout
function miniMatrix(highlightCells, color) {
  return `<div class="mini-matrix mm-${color}">${
    ['tp', 'fp', 'fn', 'tn'].map(c =>
      `<div class="mm-cell${highlightCells.includes(c) ? ' mm-on' : ''}"></div>`
    ).join('')
  }</div>`;
}

function handleStatClick(key) {
  activeStat = (activeStat === key) ? null : key;
  updateStatHighlights();
}

function updateStatHighlights() {
  // Apply/remove data-active-stat on both grids
  document.querySelectorAll('.matrix-grid').forEach(g => {
    if (activeStat) g.dataset.activeStat = activeStat;
    else            delete g.dataset.activeStat;
  });

  // Reflect open state on all stat buttons
  document.querySelectorAll('[data-stat]').forEach(el => {
    el.classList.toggle('stat-open', el.dataset.stat === activeStat);
  });

  renderExplainer();
}

function renderExplainer() {
  const el = document.getElementById('stat-explainer');
  if (!activeStat) { el.classList.add('hidden'); return; }

  const d = STATS[activeStat];
  el.classList.remove('hidden');
  el.innerHTML = `
    <div class="explainer-fraction">
      <span class="frac-label">Numerator</span>
      ${miniMatrix(d.numer, d.color)}
      <div class="frac-bar"></div>
      ${miniMatrix(d.denom, d.color)}
      <span class="frac-label">Denominator</span>
    </div>
    <div class="explainer-text">
      <div class="explainer-name">${d.label}</div>
      <div class="explainer-desc">${d.desc}</div>
    </div>
    <button class="explainer-close" id="btn-close-explainer">&times;</button>
  `;

  document.getElementById('btn-close-explainer').addEventListener('click', () => {
    activeStat = null;
    updateStatHighlights();
  });
}

// ── Rendering ────────────────────────────────────────────────────────────────
function renderPanel(group, m) {
  const s = deriveStats(m);

  document.getElementById(`grid-${group}`).innerHTML = `
    <div class="mg-corner"></div>
    <div class="mg-col-head">Did Reoffend</div>
    <div class="mg-col-head">Did NOT Reoffend</div>

    <div class="mg-row-head"><div class="risk-badge high">High&nbsp;Risk</div></div>
    <div class="mg-cell mg-tp" data-cell="tp">
      <div class="cell-type">True Positive</div>
      <div class="cell-n">${fmt(m.TP)}</div>
      <div class="cell-desc">correctly flagged as high-risk</div>
    </div>
    <div class="mg-cell mg-fp" data-cell="fp">
      <div class="cell-type">False Positive</div>
      <div class="cell-n">${fmt(m.FP)}</div>
      <div class="cell-desc">${fmt(m.FP)} people who would not have reoffended remain under supervision</div>
    </div>

    <div class="mg-row-head"><div class="risk-badge low">Low&nbsp;Risk</div></div>
    <div class="mg-cell mg-fn" data-cell="fn">
      <div class="cell-type">False Negative</div>
      <div class="cell-n">${fmt(m.FN)}</div>
      <div class="cell-desc">${fmt(m.FN)} people reoffended when the model predicted they would not — affecting victims in the community</div>
    </div>
    <div class="mg-cell mg-tn" data-cell="tn">
      <div class="cell-type">True Negative</div>
      <div class="cell-n">${fmt(m.TN)}</div>
      <div class="cell-desc">correctly cleared as low-risk</div>
    </div>
  `;

  document.getElementById(`stats-${group}`).innerHTML = `
    <div class="stat fp-rate" data-stat="fp-rate" role="button" tabindex="0"
         title="Click to see how this is calculated">
      <div class="stat-value">${pct(s.fpRate)}</div>
      <div class="stat-name">False Alarm Rate</div>
      <div class="stat-desc">non-recidivists scored high-risk</div>
    </div>
    <div class="stat ppv" data-stat="ppv" role="button" tabindex="0"
         title="Click to see how this is calculated">
      <div class="stat-value">${pct(s.ppv)}</div>
      <div class="stat-name">Score Accuracy</div>
      <div class="stat-desc">of high-risk scores were correct</div>
    </div>
    <div class="stat fn-rate" data-stat="fn-rate" role="button" tabindex="0"
         title="Click to see how this is calculated">
      <div class="stat-value">${pct(s.fnRate)}</div>
      <div class="stat-name">Miss Rate</div>
      <div class="stat-desc">recidivists scored low-risk</div>
    </div>
  `;
}

function updateThresholdUI() {
  document.getElementById('thresh-val').textContent = threshold;

  const tag = document.getElementById('thresh-tag');
  const labels = { 1: 'everyone flagged', 5: 'Northpointe default', 8: 'High scores only', 10: 'score 10 only' };
  if (labels[threshold]) {
    tag.textContent = labels[threshold];
    tag.classList.add('visible');
  } else {
    tag.classList.remove('visible');
  }
}

function render() {
  const black = computeMatrix('African-American', threshold);
  const white = computeMatrix('Caucasian', threshold);

  document.getElementById('n-black').textContent = `${fmt(black.n)} defendants`;
  document.getElementById('n-white').textContent = `${fmt(white.n)} defendants`;

  renderPanel('black', black);
  renderPanel('white', white);
  updateThresholdUI();
  updateStatHighlights(); // re-apply highlights after DOM rebuild
}

// ── Event delegation ─────────────────────────────────────────────────────────
document.addEventListener('click', e => {
  const statEl = e.target.closest('[data-stat]');
  if (statEl) {
    handleStatClick(statEl.dataset.stat);
    return;
  }
  // Click outside both a stat button and the explainer panel → close
  if (!e.target.closest('#stat-explainer') && activeStat !== null) {
    activeStat = null;
    updateStatHighlights();
  }
});

document.getElementById('threshold-slider').addEventListener('input', e => {
  threshold = +e.target.value;
  render();
});

// ── Boot ─────────────────────────────────────────────────────────────────────
fetch('data/compas-scores-two-years.csv')
  .then(r => r.text())
  .then(text => {
    rows = parseCSV(text);
    render();
  })
  .catch(err => {
    document.querySelector('.matrices-row').innerHTML =
      `<p style="color:var(--red);padding:2rem;font-family:sans-serif">
        Could not load data: ${err.message}<br>
        Run a local server: <code>python3 -m http.server 8000</code>
      </p>`;
  });
