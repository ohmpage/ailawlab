'use strict';

// ── Explainer slides ─────────────────────────────────────────────────────────
const SLIDES = [
  {
    title: 'An algorithm assigns risk scores',
    body:  'COMPAS scores defendants from 1 to 10. Courts use these scores — often without ' +
           'revealing them to the defendant — to help decide bail, sentencing, and parole. ' +
           'By default, scores of <strong>5 and above</strong> are labeled <strong>High Risk</strong>.',
    viz: `<div class="sv-scale">
      <div class="sv-scale-track">
        <div class="sv-scale-low"><span class="sv-scale-label">Low Risk</span><span class="sv-scale-nums">1 – 4</span></div>
        <div class="sv-scale-divider">5 ▲<div class="sv-scale-note">Northpointe<br>default</div></div>
        <div class="sv-scale-high"><span class="sv-scale-label">High Risk</span><span class="sv-scale-nums">5 – 10</span></div>
      </div>
    </div>`,
  },
  {
    title: 'Every prediction lands in one of four cells',
    body:  'A High Risk label can be correct (the defendant reoffends) or wrong (they don\'t). ' +
           'The same two possibilities apply to Low Risk labels. ' +
           'These four groups form a <strong>confusion matrix</strong> — the core of the dashboard.',
    viz: `<div class="sv-matrix">
      <div class="sv-m-corner"></div>
      <div class="sv-m-head">Did Reoffend</div><div class="sv-m-head">Did NOT Reoffend</div>
      <div class="sv-m-row-head">High Risk</div>
      <div class="sv-m-cell sv-tp"><strong>True Positive</strong><br><small>Correctly flagged</small></div>
      <div class="sv-m-cell sv-fp"><strong>False Positive</strong><br><small>Wrongly flagged — labeled dangerous but wouldn't have reoffended</small></div>
      <div class="sv-m-row-head">Low Risk</div>
      <div class="sv-m-cell sv-fn"><strong>False Negative</strong><br><small>Missed — cleared but did go on to reoffend</small></div>
      <div class="sv-m-cell sv-tn"><strong>True Negative</strong><br><small>Correctly cleared</small></div>
    </div>`,
  },
  {
    title: 'ProPublica and Northpointe both told the truth',
    body:  'In 2016 ProPublica showed Black defendants face nearly <strong>twice the false alarm rate</strong> ' +
           'as white defendants. Northpointe replied that scores <strong>mean the same thing for both groups</strong>. ' +
           'Both claims were accurate — because they measure two entirely different things.',
    viz: `<div class="sv-stats">
      <div class="sv-stat-box sv-red">
        <div class="sv-stat-label">False Alarm Rate</div>
        <div class="sv-stat-sub">Of defendants who would <em>not</em> reoffend, what fraction were scored High Risk?</div>
        <div class="sv-stat-nums"><span>Black: ~45%</span><span>White: ~24%</span></div>
      </div>
      <div class="sv-stat-box sv-blue">
        <div class="sv-stat-label">Score Accuracy</div>
        <div class="sv-stat-sub">Of defendants scored High Risk, what fraction actually reoffended?</div>
        <div class="sv-stat-nums"><span>Black: ~63%</span><span>White: ~59%</span></div>
      </div>
    </div>`,
  },
  {
    title: 'When base rates differ, you can\'t satisfy both standards at once',
    body:  'In the Broward County data, Black defendants reoffended at a higher rate than white defendants. ' +
           'When two groups have different underlying rates and the algorithm is calibrated, ' +
           '<strong>equal false alarm rates are mathematically impossible</strong>. ' +
           'Move the threshold slider and wave the Magic Wand to see what it would take to change that.',
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
    </div>`,
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

let rows = [];
let threshold     = 5;
let activeStat    = null;

// ── Magic Wand state ─────────────────────────────────────────────────────────
let wandMode          = false;
let thresholdBlack    = 5;
let thresholdWhite    = 5;
let baseRateBlack     = null;  // current wand value (modified by slider)
let baseRateWhite     = null;
let realBaseRateBlack = null;  // immutable — from CSV; used by Defaults button
let realBaseRateWhite = null;
let accuracy          = 0;     // 0 = real COMPAS params, 1 = perfect model

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

// ── Real-data computation ────────────────────────────────────────────────────
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

// ── Magic Wand computation ───────────────────────────────────────────────────
// Derives per-group real α (sensitivity) and q (PPV) from the CSV at the given
// threshold, scales them toward perfection by the accuracy slider, then applies
// the counterfactual base rate using the calibration-preserving formula.
function computeMatrixWand(race, thresh, baseRate) {
  const m      = computeMatrix(race, thresh);
  const N      = m.n;
  const nRecid = m.TP + m.FN;
  const a0     = nRecid        > 0 ? m.TP / nRecid        : 0.5;  // sensitivity
  const q0     = (m.TP + m.FP) > 0 ? m.TP / (m.TP + m.FP) : 0.5; // PPV

  const a = a0 + accuracy * (1 - a0);
  const q = q0 + accuracy * (1 - q0);

  const nRec   = N * baseRate;
  const nNoRec = N * (1 - baseRate);
  const TP     = Math.round(nRec * a);
  const FN     = Math.round(nRec * (1 - a));
  // Clamp FP so TN ≥ 0 (prevents out-of-range at high base rates)
  const FP     = Math.min(Math.round(nRec * a * (1 - q) / q), Math.round(nNoRec));
  const TN     = Math.max(0, Math.round(nNoRec) - FP);
  return { TP, FP, FN, TN, n: N };
}

// ── Derived stats ────────────────────────────────────────────────────────────
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
  document.querySelectorAll('.matrix-grid').forEach(g => {
    if (activeStat) g.dataset.activeStat = activeStat;
    else            delete g.dataset.activeStat;
  });
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

const THRESH_LABELS = { 1: 'everyone flagged', 5: 'Northpointe default', 8: 'High scores only', 10: 'score 10 only' };

function updateThresholdUI() {
  document.getElementById('thresh-val').textContent = threshold;
  const tag = document.getElementById('thresh-tag');
  if (THRESH_LABELS[threshold]) {
    tag.textContent = THRESH_LABELS[threshold];
    tag.classList.add('visible');
  } else {
    tag.classList.remove('visible');
  }
}

function updateWandThresholdUI() {
  for (const [thresh, valId, tagId] of [
    [thresholdBlack, 'thresh-black-val', 'thresh-black-tag'],
    [thresholdWhite, 'thresh-white-val', 'thresh-white-tag'],
  ]) {
    document.getElementById(valId).textContent = thresh;
    const tag = document.getElementById(tagId);
    if (THRESH_LABELS[thresh]) {
      tag.textContent = THRESH_LABELS[thresh];
      tag.classList.add('visible');
    } else {
      tag.classList.remove('visible');
    }
  }
}

function updateAccuracyLabel() {
  const el = document.getElementById('accuracy-val');
  if (accuracy === 0)      el.textContent = 'Current (COMPAS)';
  else if (accuracy >= 1)  el.textContent = 'Perfect model';
  else                     el.textContent = `${Math.round(accuracy * 100)}% improved`;
}

function render() {
  const black = wandMode
    ? computeMatrixWand('African-American', thresholdBlack, baseRateBlack)
    : computeMatrix('African-American', threshold);
  const white = wandMode
    ? computeMatrixWand('Caucasian', thresholdWhite, baseRateWhite)
    : computeMatrix('Caucasian', threshold);

  document.getElementById('n-black').textContent = `${fmt(black.n)} defendants`;
  document.getElementById('n-white').textContent = `${fmt(white.n)} defendants`;

  renderPanel('black', black);
  renderPanel('white', white);

  if (wandMode) updateWandThresholdUI();
  else          updateThresholdUI();

  updateStatHighlights();
}

// ── Magic Wand enter / exit ──────────────────────────────────────────────────
function enterWandMode() {
  wandMode = true;
  accuracy = 0;

  document.getElementById('thresh-black-slider').value = thresholdBlack;
  document.getElementById('thresh-white-slider').value = thresholdWhite;
  document.getElementById('br-black-slider').value     = Math.round(baseRateBlack * 100);
  document.getElementById('br-white-slider').value     = Math.round(baseRateWhite * 100);
  document.getElementById('accuracy-slider').value     = 0;

  // Update visible base-rate labels to match pre-loaded slider values
  document.getElementById('br-black-val').textContent = `${Math.round(baseRateBlack * 100)}%`;
  document.getElementById('br-white-val').textContent = `${Math.round(baseRateWhite * 100)}%`;
  updateAccuracyLabel();

  document.getElementById('control-card').classList.add('hidden');
  document.getElementById('wand-controls').classList.remove('hidden');
  document.querySelector('main').classList.add('wand-mode');
  render();
}

function exitWandMode() {
  wandMode   = false;
  activeStat = null;

  document.getElementById('wand-controls').classList.add('hidden');
  document.getElementById('control-card').classList.remove('hidden');
  document.querySelector('main').classList.remove('wand-mode');
  render();
}

function resetWandDefaults() {
  thresholdBlack = 5;
  thresholdWhite = 5;
  baseRateBlack  = realBaseRateBlack;
  baseRateWhite  = realBaseRateWhite;
  accuracy       = 0;

  document.getElementById('thresh-black-slider').value = 5;
  document.getElementById('thresh-white-slider').value = 5;
  document.getElementById('br-black-slider').value     = Math.round(realBaseRateBlack * 100);
  document.getElementById('br-white-slider').value     = Math.round(realBaseRateWhite * 100);
  document.getElementById('accuracy-slider').value     = 0;

  document.getElementById('br-black-val').textContent = `${Math.round(realBaseRateBlack * 100)}%`;
  document.getElementById('br-white-val').textContent = `${Math.round(realBaseRateWhite * 100)}%`;
  updateAccuracyLabel();
  render();
}

// ── Event delegation ─────────────────────────────────────────────────────────
document.addEventListener('click', e => {
  const statEl = e.target.closest('[data-stat]');
  if (statEl) {
    handleStatClick(statEl.dataset.stat);
    return;
  }
  if (!e.target.closest('#stat-explainer') && activeStat !== null) {
    activeStat = null;
    updateStatHighlights();
  }
});

// Real-mode threshold
document.getElementById('threshold-slider').addEventListener('input', e => {
  threshold = +e.target.value;
  render();
});

// Wand entry / exit / defaults
document.getElementById('btn-wand-enter').addEventListener('click', enterWandMode);
document.getElementById('btn-wand-exit').addEventListener('click', exitWandMode);
document.getElementById('btn-wand-defaults').addEventListener('click', resetWandDefaults);

// Wand threshold sliders
document.getElementById('thresh-black-slider').addEventListener('input', e => {
  thresholdBlack = +e.target.value;
  render();
});
document.getElementById('thresh-white-slider').addEventListener('input', e => {
  thresholdWhite = +e.target.value;
  render();
});

// Base rate sliders
document.getElementById('br-black-slider').addEventListener('input', e => {
  baseRateBlack = +e.target.value / 100;
  document.getElementById('br-black-val').textContent = `${e.target.value}%`;
  render();
});
document.getElementById('br-white-slider').addEventListener('input', e => {
  baseRateWhite = +e.target.value / 100;
  document.getElementById('br-white-val').textContent = `${e.target.value}%`;
  render();
});

// Accuracy slider
document.getElementById('accuracy-slider').addEventListener('input', e => {
  accuracy = +e.target.value / 100;
  updateAccuracyLabel();
  render();
});

// ── Explainer navigation ─────────────────────────────────────────────────────
renderSlide();
document.getElementById('btn-next').addEventListener('click', () => {
  if (slideIndex < SLIDES.length - 1) { slideIndex++; renderSlide(); }
  else showMainApp();
});
document.getElementById('btn-prev').addEventListener('click', () => {
  if (slideIndex > 0) { slideIndex--; renderSlide(); }
});
document.getElementById('btn-skip').addEventListener('click', showMainApp);

// ── Boot ─────────────────────────────────────────────────────────────────────
fetch('data/compas-scores-two-years.csv')
  .then(r => r.text())
  .then(text => {
    rows = parseCSV(text);
    render();
    // Compute real base rates (independent of threshold — all recidivists / total)
    const bm = computeMatrix('African-American', 1);  // thresh=1 flags everyone; TP+FN = all recidivists
    const wm = computeMatrix('Caucasian', 1);
    baseRateBlack     = (bm.TP + bm.FN) / bm.n;
    baseRateWhite     = (wm.TP + wm.FN) / wm.n;
    realBaseRateBlack = baseRateBlack;
    realBaseRateWhite = baseRateWhite;
  })
  .catch(err => {
    document.querySelector('.matrices-row').innerHTML =
      `<p style="color:var(--red);padding:2rem;font-family:sans-serif">
        Could not load data: ${err.message}<br>
        Run a local server: <code>python3 -m http.server 8000</code>
      </p>`;
  });
