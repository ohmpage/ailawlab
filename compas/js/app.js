'use strict';

let rows = [];
let threshold = 5;

// ── CSV parsing ──────────────────────────────────────────────────────────────
function parseCSV(text) {
  const lines = text.trim().split('\n');
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

// ── Rendering ────────────────────────────────────────────────────────────────
function renderPanel(group, m) {
  const s = deriveStats(m);

  document.getElementById(`grid-${group}`).innerHTML = `
    <div class="mg-corner"></div>
    <div class="mg-col-head">Did Reoffend</div>
    <div class="mg-col-head">Did NOT Reoffend</div>

    <div class="mg-row-head"><div class="risk-badge high">High&nbsp;Risk</div></div>
    <div class="mg-cell mg-tp">
      <div class="cell-type">True Positive</div>
      <div class="cell-n">${fmt(m.TP)}</div>
      <div class="cell-desc">correctly flagged as high-risk</div>
    </div>
    <div class="mg-cell mg-fp">
      <div class="cell-type">False Positive</div>
      <div class="cell-n">${fmt(m.FP)}</div>
      <div class="cell-desc">${fmt(m.FP)} people who would not have reoffended remain under supervision</div>
    </div>

    <div class="mg-row-head"><div class="risk-badge low">Low&nbsp;Risk</div></div>
    <div class="mg-cell mg-fn">
      <div class="cell-type">False Negative</div>
      <div class="cell-n">${fmt(m.FN)}</div>
      <div class="cell-desc">${fmt(m.FN)} people reoffended when the model predicted they would not — affecting victims in the community</div>
    </div>
    <div class="mg-cell mg-tn">
      <div class="cell-type">True Negative</div>
      <div class="cell-n">${fmt(m.TN)}</div>
      <div class="cell-desc">correctly cleared as low-risk</div>
    </div>
  `;

  document.getElementById(`stats-${group}`).innerHTML = `
    <div class="stat fp-rate">
      <div class="stat-value">${pct(s.fpRate)}</div>
      <div class="stat-name">False Alarm Rate</div>
      <div class="stat-desc">non-recidivists scored high-risk</div>
    </div>
    <div class="stat ppv">
      <div class="stat-value">${pct(s.ppv)}</div>
      <div class="stat-name">Score Accuracy</div>
      <div class="stat-desc">of high-risk scores were correct</div>
    </div>
    <div class="stat fn-rate">
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
    tag.classList.remove('hidden');
  } else {
    tag.classList.add('hidden');
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
}

// ── Boot ─────────────────────────────────────────────────────────────────────
document.getElementById('threshold-slider').addEventListener('input', e => {
  threshold = +e.target.value;
  render();
});

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
