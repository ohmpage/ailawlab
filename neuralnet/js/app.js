"use strict";

// ═══════════════════════════════════════════════════════════════════
//  EXPLAINER SLIDES
// ═══════════════════════════════════════════════════════════════════

var SLIDES = [
  {
    title: "What is a neural network?",
    body:  "A neural network is a system of connected nodes arranged in layers. " +
           "Each node receives numbers, does a small calculation, and passes a result forward. " +
           "By adjusting the strength of each connection — called a <em>weight</em> — the network learns to map inputs to outputs.",
    draw:  drawSlide1
  },
  {
    title: "The forward pass",
    body:  "To make a prediction, data flows left to right through the network. " +
           "Each node adds up the signals arriving from the layer before it, giving more influence to stronger connections. " +
           "The result is the node's output — a number the next layer uses as its input. " +
           "Nodes glow <span style='color:#27ae60;font-weight:600'>green</span> as they activate.",
    draw:  drawSlide2
  },
  {
    title: "How it learns: backpropagation",
    body:  "After each forward pass the network compares its output to the correct answer. " +
           "The error flows <em>backward</em> through the network, nudging each weight slightly in the direction that reduces the mistake. " +
           "Repeat this thousands of times across many examples and the network gradually gets it right. " +
           "Nodes glow <span style='color:#cc2200;font-weight:600'>red</span> during this correction step.",
    draw:  drawSlide3
  },
  {
    title: "Watch it learn — step by step",
    body:  "The demo below starts with the classic XOR problem (a network must learn to output 1 when exactly one input is 1). " +
           "You control the pace: step through one node at a time, one full example, or let it run until convergence. " +
           "Watch the <strong>weights on the edges</strong> — those numbers change with every backward pass.",
    draw:  drawSlide4
  }
];

var slideIndex = 0;

function drawSlide1(container) {
  // 3-layer diagram: 2 inputs, 2 hidden, 1 output
  // Nodes spaced 70px apart vertically so labels never overlap circles
  container.innerHTML = '';
  var svg = makeSVG(560, 160);
  var r = 18;
  // [x, y] — hidden nodes pushed apart enough that label clears the next circle
  var layers = [[65, 45], [65, 120], [210, 30], [210, 120], [355, 80]];
  var colors = ['#0f3460','#0f3460','#555','#555','#1a1a2e'];
  var labels = ['Input 1','Input 2','Hidden 1','Hidden 2','Output'];
  // edges first so circles draw on top
  var edges = [[0,2],[0,3],[1,2],[1,3],[2,4],[3,4]];
  edges.forEach(function(e) {
    var a = layers[e[0]], b = layers[e[1]];
    appendSVG(svg, 'line', {x1:a[0]+r,y1:a[1],x2:b[0]-r,y2:b[1],stroke:'#ccc','stroke-width':1.5});
  });
  layers.forEach(function(pos, i) {
    var g = appendSVG(svg, 'g', {});
    appendSVG(g, 'circle', {cx:pos[0],cy:pos[1],r:r,fill:colors[i]});
    // labels below node, except Hidden 1 and Input 1 get labels above to avoid overlap
    var labelY = (i === 0 || i === 2) ? pos[1] - r - 5 : pos[1] + r + 13;
    appendSVG(g, 'text', {x:pos[0],y:labelY,'text-anchor':'middle',fill:'#555',
      'font-size':'10','font-family':'sans-serif'}, labels[i]);
  });
  // layer header labels
  [['Inputs',65],['Hidden',210],['Output',355]].forEach(function(l){
    appendSVG(svg,'text',{x:l[1],y:148,'text-anchor':'middle',fill:'#bbb',
      'font-size':'10','font-family':'sans-serif','font-weight':'600'},l[0]);
  });
  container.appendChild(svg);
}

function drawSlide2(container) {
  container.innerHTML = '';
  var svg = makeSVG(560, 130);
  var layers = [[65,65],[200,40],[200,90],[335,65]];
  var r = 18;
  var nodeColors = ['#0f3460','#27ae60','#555','#555'];
  var edges = [[0,1],[0,2],[1,3],[2,3]];
  edges.forEach(function(e){
    var a=layers[e[0]],b=layers[e[1]];
    appendSVG(svg,'line',{x1:a[0]+r,y1:a[1],x2:b[0]-r,y2:b[1],stroke:'#aaa','stroke-width':1.5});
    // weight pill
    var mx=(a[0]+b[0])/2, my=(a[1]+b[1])/2;
    appendSVG(svg,'rect',{x:mx-14,y:my-8,width:28,height:16,rx:4,fill:'#fff',stroke:'#bbb','stroke-width':1});
    appendSVG(svg,'text',{x:mx,y:my+4.5,'text-anchor':'middle',fill:'#333',
      'font-size':'10','font-family':'sans-serif','font-weight':'700'},'0.42');
  });
  layers.forEach(function(pos,i){
    appendSVG(svg,'circle',{cx:pos[0],cy:pos[1],r:r,fill:nodeColors[i]});
  });
  appendSVG(svg,'text',{x:150,y:120,'text-anchor':'middle',fill:'#27ae60',
    'font-size':'11','font-family':'sans-serif','font-style':'italic'},'Forward pass — nodes activate left to right');
  container.appendChild(svg);
}

function drawSlide3(container) {
  container.innerHTML = '';
  var svg = makeSVG(560, 130);
  var layers = [[65,65],[200,40],[200,90],[335,65]];
  var r = 18;
  var nodeColors = ['#555','#cc2200','#555','#cc2200'];
  var edges = [[0,1],[0,2],[1,3],[2,3]];
  // draw backward arrow decoration
  appendSVG(svg,'text',{x:220,y:120,'text-anchor':'middle',fill:'#cc2200',
    'font-size':'11','font-family':'sans-serif','font-style':'italic'},'Error flows backward — weights adjust');
  edges.forEach(function(e){
    var a=layers[e[0]],b=layers[e[1]];
    appendSVG(svg,'line',{x1:b[0]-r,y1:b[1],x2:a[0]+r,y2:a[1],
      stroke:'#cc2200','stroke-width':1.5,'stroke-dasharray':'4,3',
      'marker-end':'url(#arrowRed)'});
    var mx=(a[0]+b[0])/2, my=(a[1]+b[1])/2;
    appendSVG(svg,'rect',{x:mx-18,y:my-8,width:36,height:16,rx:4,fill:'#fff',stroke:'#cc2200','stroke-width':1});
    appendSVG(svg,'text',{x:mx,y:my+4.5,'text-anchor':'middle',fill:'#cc2200',
      'font-size':'10','font-family':'sans-serif','font-weight':'700'},'0.38');
  });
  layers.forEach(function(pos,i){
    appendSVG(svg,'circle',{cx:pos[0],cy:pos[1],r:r,fill:nodeColors[i]});
  });
  container.appendChild(svg);
}

function drawSlide4(container) {
  container.innerHTML = '';
  var svg = makeSVG(560, 130);
  // XOR table depiction
  var rows = [['0','0','→','0'],['0','1','→','1'],['1','0','→','1'],['1','1','→','0']];
  appendSVG(svg,'text',{x:80,y:20,'text-anchor':'middle',fill:'#555',
    'font-size':'12','font-family':'sans-serif','font-weight':'700'},'XOR training data');
  ['In 1','In 2','','Out'].forEach(function(h,i){
    appendSVG(svg,'text',{x:25+i*40,y:38,'text-anchor':'middle',fill:'#999',
      'font-size':'10','font-family':'sans-serif','font-weight':'600'},h);
  });
  rows.forEach(function(row,ri){
    row.forEach(function(cell,ci){
      appendSVG(svg,'text',{x:25+ci*40,y:56+ri*18,'text-anchor':'middle',fill:'#333',
        'font-size':'12','font-family':'sans-serif'},cell);
    });
  });
  // Arrow indicating "step by step"
  appendSVG(svg,'text',{x:340,y:65,'text-anchor':'middle',fill:'#1a1a2e',
    'font-size':'13','font-family':'sans-serif','font-weight':'600'},
    'Step by: Node  Layer  Example  Epoch');
  appendSVG(svg,'text',{x:340,y:85,'text-anchor':'middle',fill:'#666',
    'font-size':'11','font-family':'sans-serif'},
    'Watch weights change with each backward pass');
  container.appendChild(svg);
}

function makeSVG(w, h) {
  var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
  svg.setAttribute('width', w);
  svg.setAttribute('height', h);
  return svg;
}

function appendSVG(parent, tag, attrs, text) {
  var el = document.createElementNS('http://www.w3.org/2000/svg', tag);
  Object.keys(attrs).forEach(function(k){ el.setAttribute(k, attrs[k]); });
  if (text !== undefined) el.textContent = text;
  parent.appendChild(el);
  return el;
}

function renderSlide() {
  var s = SLIDES[slideIndex];
  document.getElementById('slide-title').textContent = s.title;
  document.getElementById('slide-body').innerHTML = s.body;
  s.draw(document.getElementById('slide-viz'));
  var dots = document.querySelectorAll('.dot');
  dots.forEach(function(d, i){ d.classList.toggle('active', i === slideIndex); });
  document.getElementById('btn-prev').style.visibility = slideIndex === 0 ? 'hidden' : '';
  document.getElementById('btn-next').textContent = slideIndex === SLIDES.length-1 ? 'Start demo' : 'Next →';
}

function showApp() {
  document.getElementById('explainer').classList.add('hidden');
  document.getElementById('app').classList.remove('hidden');
  // Open settings panel initially so user sees config
  openPanel();
}

// ═══════════════════════════════════════════════════════════════════
//  NEURAL NETWORK STATE
// ═══════════════════════════════════════════════════════════════════

var EXAMPLE_PALETTE = ['#3498db','#e67e22','#9b59b6','#1abc9c','#e74c3c','#2ecc71','#f39c12','#16a085'];

var worker       = null;
var networkReady = false;
var isBusy       = false;
var isDone       = false;

// Canonical network state (mirrors worker's layers)
var netLayers    = [];   // netLayers[li][ni] = node object
var netEdges     = {};   // keyed by edge id → {id, source, target, weight, flash}

// Per-example progress tracking
var exampleColors    = [];
var exampleProgress  = [];  // 0–100
var exampleBaseError = [];

// Canvas rendering
var canvas, ctx;
var nodePositions = {};   // id → {x, y}
var activeNodeId  = null; // currently highlighted (tour)
var hoveredNodeId = null;
var flashEdges    = {};   // edgeId → timestamp when weight was updated
var pulseNode     = null; // {id, start}
var animFrameId   = null;

// ═══════════════════════════════════════════════════════════════════
//  SETTINGS PANEL
// ═══════════════════════════════════════════════════════════════════

var panelOpen = false;

function openPanel() {
  document.getElementById('settings-panel').classList.add('open');
  panelOpen = true;
}
function closePanel() {
  document.getElementById('settings-panel').classList.remove('open');
  panelOpen = false;
}
function togglePanel() {
  panelOpen ? closePanel() : openPanel();
}

// ── Nodes-per-layer selects ──────────────────────────────────────
function rebuildNodeSelects() {
  var count = parseInt(document.getElementById('cfg-layers').value, 10) || 1;
  var wrap  = document.getElementById('nodes-per-layer');
  var prev  = Array.from(wrap.querySelectorAll('select')).map(function(s){ return s.value; });
  wrap.innerHTML = '';
  for (var i = 0; i < count; i++) {
    var sel = document.createElement('select');
    sel.title = 'Nodes in hidden layer ' + (i+1);
    for (var n = 2; n <= 8; n++) {
      var opt = document.createElement('option');
      opt.value = n; opt.textContent = n;
      if (n === parseInt(prev[i] || 3, 10)) opt.selected = true;
      sel.appendChild(opt);
    }
    wrap.appendChild(sel);
  }
}

function resetToDefaults() {
  document.getElementById('cfg-epochs').value  = 15000;
  document.getElementById('cfg-lr').value      = 0.5;
  document.getElementById('cfg-tol').value     = 0.1;
  document.getElementById('cfg-layers').value  = 1;
  rebuildNodeSelects();  // resets to 1 hidden layer, 3 nodes (the select default)
  tableData = {
    inputs:  2,
    outputs: 1,
    rows: [
      [1, 0, 1],
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0]
    ]
  };
  renderDataTable();
}

// ═══════════════════════════════════════════════════════════════════
//  DATA TABLE
// ═══════════════════════════════════════════════════════════════════

// Default: XOR
var tableData = {
  inputs:  2,
  outputs: 1,
  rows: [
    [1, 0, 1],
    [0, 1, 1],
    [1, 1, 0],
    [0, 0, 0]
  ]
};

function renderDataTable() {
  var wrap = document.getElementById('data-table-wrap');
  var t = document.createElement('table');

  // Header
  var thead = t.createTHead();
  var hr = thead.insertRow();
  var th0 = document.createElement('th'); th0.textContent = '#'; hr.appendChild(th0);
  for (var i = 0; i < tableData.inputs; i++) {
    var th = document.createElement('th');
    th.textContent = 'In ' + (i+1);
    th.className = 'input-col';
    hr.appendChild(th);
  }
  for (var i = 0; i < tableData.outputs; i++) {
    var th = document.createElement('th');
    th.textContent = 'Out ' + (i+1);
    th.className = 'output-col';
    hr.appendChild(th);
  }

  // Body
  var tbody = t.createTBody();
  tableData.rows.forEach(function(row, ri) {
    var tr = tbody.insertRow();
    var color = EXAMPLE_PALETTE[ri % EXAMPLE_PALETTE.length];
    var td0 = tr.insertCell();
    td0.style.cssText = 'text-align:center;font-family:sans-serif;font-size:0.78rem;' +
      'font-weight:700;padding:3px 6px;background:' + color + ';color:#fff;width:24px;';
    td0.textContent = ri + 1;
    row.forEach(function(val, ci) {
      var td = tr.insertCell();
      var inp = document.createElement('input');
      inp.type = 'number'; inp.value = val; inp.step = '0.01';
      inp.dataset.row = ri; inp.dataset.col = ci;
      inp.addEventListener('change', function() {
        tableData.rows[+this.dataset.row][+this.dataset.col] = parseFloat(this.value) || 0;
      });
      td.appendChild(inp);
    });
  });

  wrap.innerHTML = '';
  wrap.appendChild(t);
}

function getTrainingDataset() {
  return tableData.rows.map(function(row) {
    var inputs  = row.slice(0, tableData.inputs);
    var outputs = row.slice(tableData.inputs);
    return [inputs, outputs];
  });
}

function addRow() {
  var newRow = new Array(tableData.inputs + tableData.outputs).fill(0);
  tableData.rows.push(newRow);
  renderDataTable();
}
function delRow() {
  if (tableData.rows.length > 1) { tableData.rows.pop(); renderDataTable(); }
}
function addInput() {
  tableData.inputs++;
  tableData.rows = tableData.rows.map(function(r){
    r.splice(tableData.inputs - 1, 0, 0); return r;
  });
  renderDataTable();
}
function addOutput() {
  tableData.outputs++;
  tableData.rows = tableData.rows.map(function(r){ r.push(0); return r; });
  renderDataTable();
}
function delCol() {
  var total = tableData.inputs + tableData.outputs;
  if (total <= 2) return;
  if (tableData.outputs > 1) {
    tableData.outputs--;
    tableData.rows = tableData.rows.map(function(r){ r.pop(); return r; });
  } else if (tableData.inputs > 1) {
    tableData.inputs--;
    tableData.rows = tableData.rows.map(function(r){ r.splice(tableData.inputs, 1); return r; });
  }
  renderDataTable();
}

// ═══════════════════════════════════════════════════════════════════
//  WORKER COMMUNICATION
// ═══════════════════════════════════════════════════════════════════

function buildNetwork() {
  closePanel();

  // Reset state
  isBusy = false; isDone = false; networkReady = false;
  netLayers = []; netEdges = {}; nodePositions = {};
  exampleColors = []; exampleProgress = []; exampleBaseError = [];
  flashEdges = {}; hoveredNodeId = null; pulseNode = null;

  document.getElementById('canvas-placeholder').classList.remove('hidden');
  document.getElementById('canvas-placeholder').classList.remove('hidden');
  document.getElementById('progress-rail').classList.add('hidden');
  document.getElementById('controls-bar').classList.add('hidden');
  document.getElementById('training-status').textContent = '';
  setRunBtn('Step', false);

  if (worker) { worker.terminate(); }
  worker = new Worker('js/nn-worker.js');
  worker.onmessage = onWorkerMessage;

  var hiddenLayerCount = Array.from(
    document.querySelectorAll('#nodes-per-layer select')
  ).map(function(s){ return parseInt(s.value, 10); });

  // Assign random distinct colors to each training example
  var dataset = getTrainingDataset();
  dataset.forEach(function(_, i){
    exampleColors[i] = EXAMPLE_PALETTE[i % EXAMPLE_PALETTE.length];
    exampleProgress[i] = 0;
  });

  worker.postMessage({
    op: 'create',
    params: {
      trainingDataset:  dataset,
      hiddenLayerCount: hiddenLayerCount,
      epochs:       parseInt(document.getElementById('cfg-epochs').value, 10) || 15000,
      learningRate: parseFloat(document.getElementById('cfg-lr').value)  || 0.5,
      tolerance:    parseFloat(document.getElementById('cfg-tol').value) || 0.1
    }
  });
}

function onWorkerMessage(e) {
  var d = e.data;
  switch (d.event) {

    case 'network_ready':
      netLayers = d.network;
      d.edges.forEach(function(edge){
        netEdges[edge.id] = { id: edge.id, source: edge.source, target: edge.target, weight: edge.weight };
      });
      networkReady = true;
      layoutNetwork();
      renderProgressRail();
      document.getElementById('canvas-placeholder').classList.add('hidden');
      document.getElementById('progress-rail').classList.remove('hidden');
      document.getElementById('controls-bar').classList.remove('hidden');
      setRunBtn('Step', false);
      startRenderLoop();
      // Auto-run one epoch so weights are visible immediately
      isBusy = true;
      setRunBtn('Step', true);
      worker.postMessage({ op: 'step', mode: 'epoch', count: 1 });
      break;

    case 'node_ff_done':
      updateNodeState(d.node);
      markNodeActive(d.node.id, 'ff');
      break;

    case 'node_bp_done':
      updateNodeState(d.node);
      markNodeActive(d.node.id, 'bp');
      // Flash edges whose weights just changed
      Object.keys(d.node.weights).forEach(function(eid){
        if (netEdges[eid]) {
          netEdges[eid].weight = d.node.weights[eid];
          flashEdges[eid] = performance.now();
        }
      });
      break;

    case 'example_done':
      // Update input node display with the *next* example's inputs
      var nextInputs = getTrainingDataset()[d.nextExampleId][0];
      if (netLayers[0]) {
        netLayers[0].forEach(function(n, ni){
          n.output = nextInputs[ni];
          n.color = exampleColors[d.nextExampleId];
        });
      }
      // Update progress for the completed example
      updateExampleProgress(d.exampleId);
      break;

    case 'epoch_done':
      var epochEl = document.getElementById('epoch-counter');
      if (epochEl) epochEl.textContent = 'Epoch ' + (d.epochId + 1);
      break;

    case 'simulation_paused':
      isBusy = false;
      setRunBtn('Step', false);
      break;

    case 'training_done':
      isBusy = false;
      isDone = true;
      setRunBtn('Restart', false);
      document.getElementById('training-status').textContent = 'Training complete';
      clearAllActiveColors();
      break;

    case 'prediction_done':
      isBusy = false;
      break;
  }
}

function updateNodeState(node) {
  if (!netLayers[node.layerIdx]) return;
  var n = netLayers[node.layerIdx][node.nodeIdx];
  if (!n) return;
  n.input  = node.input;
  n.output = node.output;
  n.error  = node.error;
  n.thres  = node.thres;
  // Update incoming edge weights
  Object.keys(node.weights).forEach(function(eid){
    if (netEdges[eid]) netEdges[eid].weight = node.weights[eid];
  });
}

function markNodeActive(nodeId, phase) {
  // Clear all non-input nodes first, then set the one active node.
  // Color stays permanently until the next Run click or rebuild.
  netLayers.forEach(function(layer){
    layer.forEach(function(n){
      if (n.type !== 'input') n._activeColor = null;
    });
  });
  netLayers.forEach(function(layer){
    layer.forEach(function(n){
      if (n.id === nodeId) {
        n._activeColor = phase === 'ff' ? '#27ae60' : '#cc2200';
      }
    });
  });
}

function clearAllActiveColors() {
  netLayers.forEach(function(layer){
    layer.forEach(function(n){ n._activeColor = null; });
  });
}

function updateExampleProgress(exId) {
  if (!netLayers.length) return;
  var outLayer = netLayers[netLayers.length - 1];
  var err = 0;
  outLayer.forEach(function(n){ err += Math.abs(n.error || 0); });
  var avgErr = err / outLayer.length;
  if (exampleBaseError[exId] === undefined) {
    exampleBaseError[exId] = avgErr || 1;
  }
  var pct = 1 - (avgErr / (exampleBaseError[exId] || 1));
  pct = Math.max(0, Math.min(1, pct));
  exampleProgress[exId] = pct * 100;
  updateProgressRailItem(exId);
}

function setRunBtn(label, disabled) {
  var btn = document.getElementById('btn-run');
  btn.textContent = label;
  btn.disabled = !!disabled;
}

// ═══════════════════════════════════════════════════════════════════
//  CANVAS LAYOUT
// ═══════════════════════════════════════════════════════════════════

var NODE_R = 26;  // node radius

function layoutNetwork() {
  if (!netLayers.length) return;
  canvas = document.getElementById('nn-canvas');
  var W = canvas.offsetWidth  || 800;
  var H = canvas.offsetHeight || 500;
  canvas.width  = W;
  canvas.height = H;

  var numLayers = netLayers.length;
  var padX = 80, padXRight = 130, padY = 60;
  var usableW = W - padX - padXRight;
  var usableH = H - padY * 2;

  netLayers.forEach(function(layer, li) {
    var x = padX + (li / (numLayers - 1 || 1)) * usableW;
    var numNodes = layer.length;
    layer.forEach(function(node, ni) {
      var y = numNodes === 1
        ? padY + usableH / 2
        : padY + (ni / (numNodes - 1)) * usableH;
      nodePositions[node.id] = { x: x, y: y };
    });
  });

  // Color input nodes with first example color
  if (netLayers[0]) {
    netLayers[0].forEach(function(n, ni){
      n.color = exampleColors[0];
      n.output = getTrainingDataset()[0][0][ni];
    });
  }
}

// ═══════════════════════════════════════════════════════════════════
//  CANVAS RENDERING
// ═══════════════════════════════════════════════════════════════════

function startRenderLoop() {
  if (animFrameId) cancelAnimationFrame(animFrameId);
  (function loop() {
    animFrameId = requestAnimationFrame(loop);
    drawFrame();
  })();
}

function drawFrame() {
  if (!canvas) return;
  ctx = canvas.getContext('2d');
  var W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H);

  if (!networkReady || !netLayers.length) return;

  var now = performance.now();

  // ── Draw edges ──────────────────────────────────────────────────
  Object.values(netEdges).forEach(function(edge) {
    var src = nodePositions[edge.source];
    var tgt = nodePositions[edge.target];
    if (!src || !tgt) return;

    var connected = (hoveredNodeId &&
      (edge.source === hoveredNodeId || edge.target === hoveredNodeId));
    var dimmed = (hoveredNodeId && !connected);

    var isFlashing = flashEdges[edge.id] && (now - flashEdges[edge.id]) < 600;

    // Edge line color — dimmed edges go light gray; connected edges keep their sign color
    var w = edge.weight;
    var lineColor, lineAlpha, lineWidth;
    if (dimmed) {
      lineColor = '#bbb';
      lineAlpha = 0.5;
      lineWidth = 1;
    } else {
      lineColor = w >= 0 ? '#4a90d9' : '#d9534f';
      lineAlpha = connected ? 1.0 : 0.55;
      lineWidth = connected ? 2.5 : 1.5;
    }
    if (isFlashing) { lineColor = '#f5a623'; lineAlpha = 1.0; lineWidth = 2; }

    ctx.save();
    ctx.globalAlpha = lineAlpha;
    ctx.strokeStyle = lineColor;
    ctx.lineWidth   = lineWidth;

    // Draw line from edge of source node to edge of target node
    var dx = tgt.x - src.x, dy = tgt.y - src.y;
    var dist = Math.sqrt(dx*dx + dy*dy);
    var ux = dx/dist, uy = dy/dist;
    var x1 = src.x + ux * NODE_R, y1 = src.y + uy * NODE_R;
    var x2 = tgt.x - ux * NODE_R, y2 = tgt.y - uy * NODE_R;

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    // Arrowhead at target end
    drawArrow(ctx, x2, y2, ux, uy, lineColor);

    ctx.restore();

    // ── Weight pill ─────────────────────────────────────────────
    var mx = (x1 + x2) / 2;
    var my = (y1 + y2) / 2;
    var label = w.toFixed(3);
    drawWeightPill(ctx, mx, my, label, isFlashing, connected, w >= 0, dimmed);
  });

  // ── Draw nodes ──────────────────────────────────────────────────
  netLayers.forEach(function(layer) {
    layer.forEach(function(node) {
      var pos = nodePositions[node.id];
      if (!pos) return;

      var baseColor = (node.type === 'input') ? (node.color || '#0f3460') : '#444';
      var fillColor = node._activeColor || baseColor;

      // Shadow for depth
      ctx.save();
      ctx.shadowColor = 'rgba(0,0,0,0.18)';
      ctx.shadowBlur  = 6;
      ctx.shadowOffsetY = 2;

      // Node circle
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, NODE_R, 0, Math.PI*2);
      ctx.fillStyle = fillColor;
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();

      // Tour pulse ring
      if (pulseNode && pulseNode.id === node.id) {
        var elapsed = now - pulseNode.start;
        var period  = 900;
        var t = (elapsed % period) / period;
        var rPulse = NODE_R + 6 + t * 12;
        var alpha  = 0.7 * (1 - t);
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = '#f5a623';
        ctx.lineWidth   = 3;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, rPulse, 0, Math.PI*2);
        ctx.stroke();
        ctx.restore();
      }

      // Label above node
      ctx.save();
      ctx.font = '11px sans-serif';
      ctx.fillStyle = '#333';
      ctx.textAlign = 'center';
      ctx.fillText(node.name, pos.x, pos.y - NODE_R - 6);
      ctx.restore();

      // Value below node: threshold for hidden/output, current output for input
      var sublabel = null;
      if (node.type === 'input') {
        sublabel = (node.output !== undefined) ? node.output.toFixed(1) : '';
      } else if (node.thres !== null && node.thres !== undefined) {
        sublabel = 'b=' + node.thres.toFixed(3);
      }
      if (sublabel !== null) {
        ctx.save();
        ctx.font = '10px sans-serif';
        ctx.fillStyle = '#888';
        ctx.textAlign = 'center';
        ctx.fillText(sublabel, pos.x, pos.y + NODE_R + 14);
        ctx.restore();
      }

      // Output value displayed to the RIGHT of the node
      if (node.type === 'output' && node.output !== undefined) {
        var outVal = node.output.toFixed(4);
        var ox = pos.x + NODE_R + 10;
        var oy = pos.y;
        ctx.save();
        ctx.font = 'bold 14px sans-serif';
        ctx.fillStyle = '#1a1a2e';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(outVal, ox, oy);
        ctx.restore();
      }
    });
  });

  // Clean up old flash entries
  Object.keys(flashEdges).forEach(function(eid){
    if (now - flashEdges[eid] > 600) delete flashEdges[eid];
  });
}

function drawArrow(ctx, x, y, ux, uy, color) {
  var aLen = 7, aWidth = 4;
  ctx.save();
  ctx.fillStyle = color;
  ctx.globalAlpha = ctx.globalAlpha; // inherit
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x - ux*aLen + uy*aWidth, y - uy*aLen - ux*aWidth);
  ctx.lineTo(x - ux*aLen - uy*aWidth, y - uy*aLen + ux*aWidth);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawWeightPill(ctx, x, y, label, isFlashing, isHovered, isPositive, isDimmed) {
  var font    = (isHovered || isFlashing) ? 'bold 12px sans-serif' : 'bold 11px sans-serif';
  ctx.font    = font;
  var tw      = ctx.measureText(label).width;
  var pw      = tw + 12, ph = 17;
  var px      = x - pw/2, py = y - ph/2;

  // Dimmed: washed-out gray pill, barely visible
  if (isDimmed) {
    ctx.save();
    ctx.globalAlpha = 0.5;
    ctx.fillStyle   = '#e0e0e0';
    roundRect(ctx, px, py, pw, ph, 4);
    ctx.fill();
    ctx.restore();
    return;
  }

  var bgColor   = '#ffffff';
  var textColor = isPositive ? '#1a5276' : '#922b21';
  var border    = isPositive ? '#4a90d9' : '#d9534f';

  if (isFlashing)      { bgColor = '#fff3cd'; border = '#f5a623'; textColor = '#7d4e00'; }
  else if (isHovered)  { bgColor = '#eef4fb'; }

  // Pill background
  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.10)';
  ctx.shadowBlur  = 3;
  ctx.fillStyle   = bgColor;
  roundRect(ctx, px, py, pw, ph, 4);
  ctx.fill();
  ctx.restore();

  // Border
  ctx.save();
  ctx.strokeStyle = border;
  ctx.lineWidth   = isHovered || isFlashing ? 1.5 : 1;
  roundRect(ctx, px, py, pw, ph, 4);
  ctx.stroke();
  ctx.restore();

  // Text
  ctx.save();
  ctx.font      = font;
  ctx.fillStyle = textColor;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(label, x, y + 0.5);
  ctx.restore();
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x+r, y);
  ctx.lineTo(x+w-r, y);
  ctx.arcTo(x+w, y, x+w, y+r, r);
  ctx.lineTo(x+w, y+h-r);
  ctx.arcTo(x+w, y+h, x+w-r, y+h, r);
  ctx.lineTo(x+r, y+h);
  ctx.arcTo(x, y+h, x, y+h-r, r);
  ctx.lineTo(x, y+r);
  ctx.arcTo(x, y, x+r, y, r);
  ctx.closePath();
}

function blendColors(hex1, hex2, t) {
  var c1 = hexToRgb(hex1), c2 = hexToRgb(hex2);
  if (!c1 || !c2) return hex2;
  var r = Math.round(c1.r + (c2.r - c1.r) * t);
  var g = Math.round(c1.g + (c2.g - c1.g) * t);
  var b = Math.round(c1.b + (c2.b - c1.b) * t);
  return 'rgb(' + r + ',' + g + ',' + b + ')';
}

function hexToRgb(hex) {
  var m = hex.match(/^#([0-9a-f]{6})$/i);
  if (!m) return null;
  var n = parseInt(m[1], 16);
  return { r: (n>>16)&255, g: (n>>8)&255, b: n&255 };
}

// ═══════════════════════════════════════════════════════════════════
//  PROGRESS RAIL
// ═══════════════════════════════════════════════════════════════════

function renderProgressRail() {
  var list = document.getElementById('progress-list');
  list.innerHTML = '';
  var dataset = getTrainingDataset();
  dataset.forEach(function(ex, i) {
    var div = document.createElement('div');
    div.className = 'progress-item';
    div.id = 'prog-item-' + i;

    var inputStr = ex[0].join(', ');
    var outputStr = ex[1].join(', ');

    div.innerHTML =
      '<div class="ex-label">' +
        '<span class="ex-swatch" style="background:' + exampleColors[i] + '"></span>' +
        '[' + inputStr + '] → ' + outputStr +
      '</div>' +
      '<div class="progress-track">' +
        '<div class="progress-fill" id="prog-fill-' + i + '" style="background:' + exampleColors[i] + '"></div>' +
      '</div>';

    // After training: clicking runs prediction
    div.style.cursor = 'pointer';
    div.addEventListener('click', (function(idx){ return function(){
      if (!isDone || !worker) return;
      var inputs = getTrainingDataset()[idx][0];
      // Highlight input nodes with this example's color
      netLayers[0].forEach(function(n, ni){
        n.output = inputs[ni];
        n.color  = exampleColors[idx];
      });
      worker.postMessage({ op: 'predict', inputs: inputs });
    }; })(i));

    list.appendChild(div);
  });
}

function updateProgressRailItem(i) {
  var fill = document.getElementById('prog-fill-' + i);
  if (fill) fill.style.width = exampleProgress[i].toFixed(1) + '%';
}

// ═══════════════════════════════════════════════════════════════════
//  CANVAS INTERACTION (hover tooltip)
// ═══════════════════════════════════════════════════════════════════

function getNodeAtPoint(px, py) {
  for (var li = 0; li < netLayers.length; li++) {
    for (var ni = 0; ni < netLayers[li].length; ni++) {
      var n   = netLayers[li][ni];
      var pos = nodePositions[n.id];
      if (!pos) continue;
      var dx = px - pos.x, dy = py - pos.y;
      if (dx*dx + dy*dy <= NODE_R*NODE_R) return n;
    }
  }
  return null;
}

function showTooltip(node, cx, cy) {
  var tt = document.getElementById('node-tooltip');
  var lines = [
    '<strong>' + node.name + '</strong>',
    'Output: ' + (node.output !== undefined ? node.output.toFixed(4) : 'N/A'),
    'Input sum: '  + (node.input  !== undefined ? node.input.toFixed(4)  : 'N/A')
  ];
  if (node.thres !== null && node.thres !== undefined) {
    lines.push('Bias: ' + node.thres.toFixed(4));
  }
  if (node.error !== null && node.error !== undefined) {
    lines.push('Delta: ' + node.error.toFixed(4));
  }
  tt.innerHTML = lines.join('<br>');
  tt.style.display = 'block';
  // Position near cursor
  var rect = canvas.getBoundingClientRect();
  var tx = rect.left + cx + NODE_R + 12;
  var ty = rect.top  + cy - 20;
  if (tx + 160 > window.innerWidth)  tx = rect.left + cx - 160 - NODE_R;
  tt.style.left = tx + 'px';
  tt.style.top  = ty + 'px';
}

function hideTooltip() {
  document.getElementById('node-tooltip').style.display = 'none';
}

// ═══════════════════════════════════════════════════════════════════
//  GUIDED TOUR
// ═══════════════════════════════════════════════════════════════════

var TOUR_STEPS = [
  {
    targetType: 'input',
    getText: function(){ return (
      '<strong>Input nodes</strong> (colored circles) receive the raw data. ' +
      'Each training example gets its own color — look for the matching color in the progress panel on the right.'
    ); }
  },
  {
    targetType: 'hidden',
    getText: function(){ return (
      '<strong>Hidden nodes</strong> compute a weighted sum of their inputs plus a bias, ' +
      'then pass the result through a sigmoid function. ' +
      'A node glows <span style="color:#27ae60;font-weight:600">green</span> during the forward pass and ' +
      '<span style="color:#cc2200;font-weight:600">red</span> during backpropagation.'
    ); }
  },
  {
    targetType: 'output',
    getText: function(){ return (
      '<strong>Output nodes</strong> show the network\'s current prediction (white number inside the node). ' +
      'After training, click any example in the progress panel to run a prediction and see the output update.'
    ); }
  },
  {
    targetId: 'controls-bar',
    getText: function(){ return (
      'These are the <strong>step controls</strong>. Choose a granularity — step one <em>node</em> at a time, ' +
      'one full <em>example</em>, a whole <em>epoch</em>, or let it run to completion.'
    ); }
  },
  {
    targetId: 'progress-rail',
    getText: function(){ return (
      'The <strong>progress panel</strong> shows how close the network is to solving each training example. ' +
      'The bar fills as error decreases. After training, click a row to run a prediction on that example.'
    ); }
  },
  {
    targetId: 'settings-toggle',
    getText: function(){ return (
      'Click the <strong>☰ menu</strong> to open the settings panel — change the learning rate, ' +
      'number of hidden layers and nodes, or edit the training data, then click <em>Build Network</em> to restart.'
    ); }
  }
];

var tourStep = -1;
var tourRunning = false;

function startTour() {
  if (!networkReady) { buildNetwork(); }
  tourRunning = true;
  tourStep = -1;
  tourNext();
}

function tourNext() {
  tourStep++;
  if (tourStep >= TOUR_STEPS.length) { endTour(); return; }
  showTourStep(tourStep);
}

function tourPrev() {
  if (tourStep <= 0) return;
  tourStep--;
  showTourStep(tourStep);
}

function showTourStep(i) {
  var step = TOUR_STEPS[i];
  var bubble = document.getElementById('tour-bubble');
  document.getElementById('tour-text').innerHTML = step.getText();
  document.getElementById('tour-prev').style.visibility = i === 0 ? 'hidden' : '';
  document.getElementById('tour-next').textContent = i === TOUR_STEPS.length-1 ? 'Done' : 'Next →';
  bubble.classList.remove('hidden');

  pulseNode = null;

  if (step.targetType) {
    // Find a node of that type and pulse it on canvas
    var found = null;
    for (var li = 0; li < netLayers.length; li++) {
      for (var ni = 0; ni < netLayers[li].length; ni++) {
        if (netLayers[li][ni].type === step.targetType) { found = netLayers[li][ni]; break; }
      }
      if (found) break;
    }
    if (found) {
      pulseNode = { id: found.id, start: performance.now() };
      positionBubbleNearNode(found.id, bubble);
    }
  } else if (step.targetId) {
    pulseNode = null;
    positionBubbleNearElement(step.targetId, bubble);
  }
}

function positionBubbleNearNode(nodeId, bubble) {
  var pos = nodePositions[nodeId];
  if (!pos || !canvas) { positionBubbleDefault(bubble); return; }
  var rect = canvas.getBoundingClientRect();
  var bw = 280, bh = 150;
  var cx = rect.left + pos.x;
  var cy = rect.top  + pos.y;
  // Place bubble on whichever side has more room
  var spaceRight = window.innerWidth - (cx + NODE_R + 20);
  var left, top;
  if (spaceRight >= bw + 10) {
    left = cx + NODE_R + 20;
  } else {
    left = cx - bw - NODE_R - 20;
  }
  top = cy - bh / 2;
  if (top < 60) top = 60;
  if (left < 10) left = 10;
  bubble.style.left = left + 'px';
  bubble.style.top  = top  + 'px';
}

function positionBubbleNearElement(elId, bubble) {
  var el = document.getElementById(elId);
  if (!el) { positionBubbleDefault(bubble); return; }
  var rect = el.getBoundingClientRect();
  var bw = 280;
  bubble.style.left = Math.max(10, rect.left) + 'px';
  bubble.style.top  = (rect.top - 10 - 150) + 'px';
  if (elId === 'settings-toggle') {
    bubble.style.left = (rect.right + 12) + 'px';
    bubble.style.top  = (rect.top - 20) + 'px';
  }
  if (elId === 'progress-rail') {
    bubble.style.left = (rect.left - bw - 12) + 'px';
    bubble.style.top  = (rect.top + 10) + 'px';
  }
}

function positionBubbleDefault(bubble) {
  bubble.style.left = '50%';
  bubble.style.top  = '120px';
  bubble.style.transform = 'translateX(-50%)';
}

function endTour() {
  tourRunning = false;
  pulseNode = null;
  document.getElementById('tour-bubble').classList.add('hidden');
}

// ═══════════════════════════════════════════════════════════════════
//  RESIZE HANDLER
// ═══════════════════════════════════════════════════════════════════

function onResize() {
  if (!networkReady || !canvas) return;
  canvas.width  = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  layoutNetwork();
}

// ═══════════════════════════════════════════════════════════════════
//  INIT
// ═══════════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', function() {
  // Render initial slide
  renderSlide();
  renderDataTable();
  rebuildNodeSelects();

  // Explainer nav
  document.getElementById('btn-next').addEventListener('click', function() {
    if (slideIndex < SLIDES.length - 1) {
      slideIndex++;
      renderSlide();
    } else {
      showApp();
    }
  });
  document.getElementById('btn-prev').addEventListener('click', function() {
    if (slideIndex > 0) { slideIndex--; renderSlide(); }
  });
  document.getElementById('btn-skip').addEventListener('click', showApp);

  // Header controls
  document.getElementById('settings-toggle').addEventListener('click', togglePanel);
  document.getElementById('tour-link').addEventListener('click', function(e){
    e.preventDefault();
    if (!networkReady) { showApp(); buildNetwork(); }
    // Start tour after a short delay to let the network build
    setTimeout(startTour, networkReady ? 0 : 1200);
  });

  // Settings panel
  document.getElementById('cfg-layers').addEventListener('change', rebuildNodeSelects);
  document.getElementById('btn-reset').addEventListener('click', resetToDefaults);
  document.getElementById('btn-build').addEventListener('click', buildNetwork);

  // Table controls
  document.getElementById('btn-add-row').addEventListener('click',    addRow);
  document.getElementById('btn-del-row').addEventListener('click',    delRow);
  document.getElementById('btn-add-input').addEventListener('click',  addInput);
  document.getElementById('btn-add-output').addEventListener('click', addOutput);
  document.getElementById('btn-del-col').addEventListener('click',    delCol);

  // Run button
  document.getElementById('btn-run').addEventListener('click', function() {
    if (!networkReady || isBusy) return;
    if (isDone) { buildNetwork(); return; }
    closePanel();
    clearAllActiveColors();
    var mode  = document.querySelector('input[name="step-mode"]:checked').value;
    var count = parseInt(document.getElementById('step-count').value, 10) || 1;
    isBusy = true;
    setRunBtn('Step', true);
    document.getElementById('training-status').textContent = '';
    worker.postMessage({ op: 'step', mode: mode, count: count });
  });

  // Canvas mouse interactions
  canvas = document.getElementById('nn-canvas');
  canvas.addEventListener('mousemove', function(e) {
    if (!networkReady) return;
    var rect = canvas.getBoundingClientRect();
    var scaleX = canvas.width  / rect.width;
    var scaleY = canvas.height / rect.height;
    var mx = (e.clientX - rect.left) * scaleX;
    var my = (e.clientY - rect.top)  * scaleY;
    var node = getNodeAtPoint(mx, my);
    if (node) {
      hoveredNodeId = node.id;
      canvas.style.cursor = 'pointer';
      showTooltip(node, pos_x(node.id), pos_y(node.id));
    } else {
      hoveredNodeId = null;
      canvas.style.cursor = '';
      hideTooltip();
    }
  });
  canvas.addEventListener('mouseleave', function() {
    hoveredNodeId = null;
    hideTooltip();
  });

  // Tour controls
  document.getElementById('tour-next').addEventListener('click', tourNext);
  document.getElementById('tour-prev').addEventListener('click', tourPrev);
  document.getElementById('tour-close').addEventListener('click', endTour);

  // Resize
  window.addEventListener('resize', onResize);
});

function pos_x(nodeId) {
  return nodePositions[nodeId] ? nodePositions[nodeId].x : 0;
}
function pos_y(nodeId) {
  return nodePositions[nodeId] ? nodePositions[nodeId].y : 0;
}
