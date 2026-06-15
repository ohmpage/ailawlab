# neuralnet — Neural Network Trainer

## What this is

A static, server-free interactive demo for teaching law students and policymakers how neural networks learn. Students step through the training of a fully-connected feedforward network one node, layer, example, or epoch at a time, watching weights update in real time.

Built by Paul Ohm. Codebase started June 2026.

---

## Credits

This tool is a reskin and extension of **[interactive-bpann](https://github.com/drdrsh/interactive-bpann)** by [Mostafa Abdelraouf](https://mostafa.io/) ([@drdrsh](https://github.com/drdrsh)), released under the MIT license. The live original is at [experiments.mostafa.io/ffbpann/](https://experiments.mostafa.io/public/ffbpann/).

Mostafa's work is excellent and deserves direct credit for two things in particular:

**The neural network math (`js/nn-worker.js`)** is a close adaptation of his `ANNWorker.js`. The core math functions — `feedForwardNode`, `backPropagateNode`, and the ES6 generator-based training loop — are essentially his, lightly restructured for a cleaner message protocol. The sigmoid activation, backpropagation formulas, and SGD weight updates are all his implementation.

**The UX concepts** are directly from his original app:
- Five stepping granularities: Node, Layer, Example, Epoch, Full run
- Green node = forward pass computing; Red node = backprop computing
- Per-example progress tracking in a right-side panel
- Sliding settings drawer with editable training data and network topology controls

What this version adds: a full canvas renderer replacing sigma.js, the weight-pill labels on edges, the four-slide explainer, the guided tour, the color-coded data table, and the overall visual redesign to match the AI Law casebook design system.

---

## Target audience & design decisions

**Primary users:** Smart non-technical audiences — law students, policymakers. Classroom use: individual exploration + instructor-mirrored live demo. No installation for students; just a URL.

**Core takeaway:** Neural networks learn by repeatedly making predictions, measuring the error, and nudging every connection weight in the direction that reduces that error. This process — backpropagation + stochastic gradient descent — is concrete and watchable, not magic.

**Key design choices:**
- **Step controls at five granularities:** Node, Layer, Example, Epoch, Full run. Node-by-node is the most pedagogically useful for classroom walkthroughs.
- **Weights are first-class:** Every connection displays its weight in a prominent pill label (white rounded rectangle, color-coded by sign). Weights flash gold when they update. Non-connected edges dim on hover so the relevant weights are easy to read.
- **Node color coding:** Green = forward pass; Red = backprop. Color persists until the next Step click so the class can linger on any state.
- **Output node side label:** The output node's current prediction appears to its right in bold, updating after each forward pass through the output layer.
- **Per-example progress rail:** Right sidebar tracks convergence for each training example with a color-coded progress bar. Colors match the input node and data table row for that example.
- **Editable training data:** Plain HTML table with add/remove row and column buttons. Default dataset is XOR.
- **Four-slide explainer:** Introduces the concept before the demo; always skippable. Language avoids all math jargon — no "sigmoid", no "weighted sum".
- **Six-step guided tour:** Available via "Take a tour" in the header.
- **Reset to Defaults button:** Restores all settings and XOR training data without a page reload.

**Explicitly avoided:**
- Any npm / build step / TypeScript
- External graph libraries (sigma.js in the original)
- External UI libraries (jQuery, w2ui in the original)
- Large data files

---

## Architecture

No build step. No npm. No TypeScript. Plain HTML + CSS + vanilla JS.

```
index.html          HTML shell: explainer slides, settings panel, canvas area, controls bar
css/style.css       All styles (imports ../shared/css/base.css for variables and header)
js/app.js           UI logic: slides, settings panel, data table, canvas rendering, tour
js/nn-worker.js     Web Worker: all neural network math — no DOM dependencies
```

### Neural network math (nn-worker.js)

Implements a fully-connected feedforward network trained by backpropagation + SGD. Adapted from Mostafa Abdelraouf's `ANNWorker.js`.

| Step | Formula |
|---|---|
| Activation | σ(z) = 1 / (1 + e^−z) |
| Activation derivative | σ′(y) = y · (1 − y) |
| Forward pass | z = bias + Σ(weight_i · output_i); output = σ(z) |
| Output delta | δ = σ′(output) · (target − output) |
| Hidden delta | δ = σ′(output) · Σ(δ_k · weight_k) |
| Weight update | Δw = α · δ · input |
| Bias update | Δbias = α · δ |

The training loop is an ES6 generator (`function*`). The worker pauses at the requested granularity by `yield`-ing back to the main thread, which calls `.next()` again only when the user clicks Step.

### Worker message protocol

Main → Worker:
- `{ op: 'create', params: { trainingDataset, hiddenLayerCount, epochs, learningRate, tolerance } }`
- `{ op: 'step', mode: 'node'|'layer'|'example'|'epoch'|'full', count: N }`
- `{ op: 'predict', inputs: [...] }`

Worker → Main (all have an `event` field):
- `network_ready` — full topology; main thread lays out the canvas
- `node_ff_done` — one node finished its forward pass; carries updated node state + weights
- `node_bp_done` — one node finished backprop; carries updated node state + weights
- `example_done` — one full forward+backward pass over one example
- `epoch_done` — one full sweep through all examples
- `simulation_paused` — step count exhausted; waiting for next Step click
- `training_done` — converged or epoch limit hit
- `prediction_done` — predict-mode forward pass complete

### Canvas rendering (app.js)

Drawn on `<canvas id="nn-canvas">` via a `requestAnimationFrame` loop. Layout computed once in `layoutNetwork()`, stored in `nodePositions` (node id → `{x, y}`). Re-laid-out on window resize.

**Node visual states:**
- Input: solid blue, colored per training example (`EXAMPLE_PALETTE`)
- Hidden/output at rest: dark gray `#444`
- During forward pass: green `#27ae60` — persists until next Step
- During backprop: red `#cc2200` — persists until next Step

**Edge visual states:**
- Positive weight: blue `#4a90d9`; Negative weight: red `#d9534f`
- On hover (connected): full opacity, thicker line, full pill
- On hover (not connected): gray `#bbb` at 50% opacity, ghosted pill
- Weight just updated: gold flash for 600ms

### Training data & color palette

`EXAMPLE_PALETTE` at module scope is shared by `renderDataTable()`, `buildNetwork()`, and `renderProgressRail()` so colors are always consistent across the table, canvas, and progress rail.

---

## Running locally

No data files to prepare. Any static server works:

```bash
cd /path/to/ailawlab
python3 -m http.server 8000
# open http://localhost:8000/neuralnet/
```

Browsers require a server (not `file://`) because the Web Worker is loaded via a relative URL.

---

## Deploying (GitHub Pages)

No special steps. The entire `neuralnet/` directory ships as-is — no data files, no build output. Push to GitHub, enable Pages on `main`, share the URL.

---

## Extending the demo

**To change the default dataset:** Edit `tableData` and `resetToDefaults()` in `app.js`.

**To change the activation function:** Replace `sigmoid` / `sigmoidPrime` in `nn-worker.js`.

**To add more explainer slides:** Add an entry to `SLIDES` in `app.js` and a `drawSlideN` function. Add a `.dot` in `index.html`.

**To add more tour steps:** Add an entry to `TOUR_STEPS` in `app.js`. Steps with `targetType` pulse a canvas node; steps with `targetId` position the bubble near a DOM element.

---

## Nuances and non-obvious behavior

**Progress bars are a proxy, not the convergence check.** The bar measures reduction in delta (the backprop error signal) relative to initialization. 100% means delta reached zero; 0% means no improvement. The actual convergence test — which stops training — is separate: it checks whether `|output − target| ≤ tolerance` after each forward pass. The two can diverge slightly.

**Delta in the tooltip is stale during the forward pass.** Delta is only recomputed during backpropagation (red node). After a forward pass (green node), the tooltip still shows the delta from the previous backward pass. This is correct behavior, not a bug.

**Edge magnitude is not visually encoded.** Edge color encodes sign (blue = positive, red = negative). Weight magnitude is shown only by the number in the pill. Line thickness and opacity are fixed. Adding magnitude-to-thickness encoding would require normalization to avoid thick edges when weights grow large.

**Input node values display as integers when the value is whole.** The renderer checks `Math.round(v) === v` and omits the decimal if true. Non-integer inputs (e.g., 0.5) display as decimals.

**Build shows raw random weights.** No epoch runs automatically on build — the network displays its initial random state immediately. This is intentional: seeing the randomized starting weights before training begins is pedagogically useful.

---

## Version history

### Version 1 — June 2026
Initial build. Reskin and extension of drdrsh/interactive-bpann. Core math (nn-worker.js) and UX concepts adapted from the original; canvas renderer, weight pills, four-slide explainer, six-step guided tour, color-coded data table, per-example progress rail, hover dimming, persistent node color states, and visual redesign are new.
