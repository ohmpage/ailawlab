"use strict";

// ── State ────────────────────────────────────────────────────────────────────
var networkInitialized = false;
var trainingSet   = [];
var layers        = [];
var OUTPUT_LAYER_INDEX = -1;

var learningRate  = 0.5;
var tolerance     = 0.1;
var maxEpochs     = 15000;
var maxExamples   = 0;

var currentEpoch   = 0;
var currentExample = 0;
var currentNode    = 0;
var currentLayer   = 1;
var currentMode    = '';
var currentStep    = 0;
var maxSteps       = 1;
var nodeEventsSinceYield = 0;  // guards against yielding with no node events (boundary no-op)

var networkStepper = null;

// ── Naming helpers ───────────────────────────────────────────────────────────
function nodeId(li, ni)   { return 'L' + li + 'N' + ni; }
function linkId(li,ni,lj,nj){ return nodeId(li,ni) + '_' + nodeId(lj,nj); }
function nodeName(li, ni) {
    if (li === 0)                   return 'Input '  + (ni + 1);
    if (li === OUTPUT_LAYER_INDEX)  return 'Output ' + (ni + 1);
    return 'Hidden ' + li + ',' + (ni + 1);
}

// ── Math ─────────────────────────────────────────────────────────────────────
function sigmoid(z)   { return 1 / (1 + Math.exp(-z)); }
function sigmoidPrime(y) { return y * (1 - y); }  // y is already sigmoid output
function randWeight() { return Math.random() - 0.5; }

// ── Emit helpers ─────────────────────────────────────────────────────────────
function emit(obj) { self.postMessage(obj); }

function serializeNode(li, ni) {
    var n = layers[li][ni];
    var weights = {};
    for (var i = 0; i < n.inConn.length; i++) {
        weights[n.inConn[i].id] = n.inConn[i].weight;
    }
    return {
        id: n.id, name: n.name, type: n.type,
        layerIdx: li, nodeIdx: ni,
        input: n.input, output: n.output,
        thres: n.thres !== undefined ? n.thres : null,
        error: n.error !== undefined ? n.error : null,
        weights: weights,
        inConnIds:  n.inConn.map(function(c){ return c.id; }),
        outConnIds: n.outConn.map(function(c){ return c.id; })
    };
}

function emitNode(event, li, ni) {
    emit({ event: event, layerIdx: li, nodeIdx: ni, node: serializeNode(li, ni) });
    nodeEventsSinceYield++;
}

function emitNetwork() {
    // Send full topology: layers of serialized nodes
    var net = layers.map(function(layer, li) {
        return layer.map(function(_, ni) { return serializeNode(li, ni); });
    });
    // Also send edge list for initial render
    var edges = [];
    for (var li = 0; li < layers.length - 1; li++) {
        for (var ni = 0; ni < layers[li].length; ni++) {
            var n = layers[li][ni];
            for (var k = 0; k < n.outConn.length; k++) {
                var c = n.outConn[k];
                edges.push({ id: c.id, source: c.from.id, target: c.to.id, weight: c.weight });
            }
        }
    }
    emit({ event: 'network_ready', network: net, edges: edges });
}

function emitEdgeWeights() {
    // After backprop on a node, emit all updated weights for its incoming edges
}

function emitExample(exId, allCorrect) {
    var nextId = exId + 1;
    if (nextId >= maxExamples) nextId = 0;
    emit({ event: 'example_done', exampleId: exId, nextExampleId: allCorrect ? exId : nextId });
}

function emitEpoch(epochId) {
    emit({ event: 'epoch_done', epochId: epochId });
}

function emitPaused() {
    emit({ event: 'simulation_paused' });
}

function emitDone(converged) {
    emit({ event: 'training_done', converged: !!converged });
}

function emitPrediction(outputs) {
    emit({ event: 'prediction_done', output: outputs });
}

// ── Forward / backward ───────────────────────────────────────────────────────
function feedForwardNode(li, ni) {
    var n = layers[li][ni];
    n.input = (n.thres !== undefined ? n.thres : 0);
    for (var j = 0; j < n.inConn.length; j++) {
        n.input += n.inConn[j].weight * n.inConn[j].from.output;
    }
    n.output = sigmoid(n.input);

    if (li === OUTPUT_LAYER_INDEX && n.target !== undefined && n.target !== false) {
        n.hitTarget = Math.abs(n.output - n.target) <= tolerance;
    }
    return n.output;
}

function backPropNode(li, ni) {
    var n = layers[li][ni];
    var cumError = 0;
    if (li === OUTPUT_LAYER_INDEX) {
        cumError = n.target - n.output;
    } else {
        for (var j = 0; j < n.outConn.length; j++) {
            cumError += n.outConn[j].to.error * n.outConn[j].weight;
        }
    }
    n.error = sigmoidPrime(n.output) * cumError;

    for (var j = 0; j < n.inConn.length; j++) {
        n.inConn[j].weight += learningRate * n.error * n.inConn[j].from.output;
    }
    if (n.thres !== undefined) {
        n.thres += learningRate * n.error;
    }
}

function initExample(exId) {
    var inputs  = trainingSet[exId][0];
    var outputs = trainingSet[exId][1];
    for (var i = 0; i < inputs.length; i++) {
        layers[0][i].output = inputs[i];
    }
    for (var i = 0; i < outputs.length; i++) {
        layers[OUTPUT_LAYER_INDEX][i].target = outputs[i];
    }
}

// ── Training generator ───────────────────────────────────────────────────────
function* train() {
    var converged = false;
    for (currentEpoch = 0; currentEpoch < maxEpochs; currentEpoch++) {

        var allCorrect = true;
        for (currentExample = 0; currentExample < maxExamples; currentExample++) {

            initExample(currentExample);

            // Forward pass
            for (currentLayer = 1; currentLayer < layers.length; currentLayer++) {
                for (currentNode = 0; currentNode < layers[currentLayer].length; currentNode++) {
                    feedForwardNode(currentLayer, currentNode);
                    if (currentLayer === OUTPUT_LAYER_INDEX) {
                        allCorrect = allCorrect && layers[currentLayer][currentNode].hitTarget;
                    }
                    emitNode('node_ff_done', currentLayer, currentNode);
                    if (currentMode === 'node') {
                        if (++currentStep >= maxSteps) { emitPaused(); yield; currentStep = 0; }
                    }
                }
                if (currentMode === 'layer') {
                    if (++currentStep >= maxSteps) { emitPaused(); yield; currentStep = 0; }
                }
            }

            // Backward pass
            for (currentLayer = layers.length - 1; currentLayer >= 1; currentLayer--) {
                for (currentNode = layers[currentLayer].length - 1; currentNode >= 0; currentNode--) {
                    backPropNode(currentLayer, currentNode);
                    emitNode('node_bp_done', currentLayer, currentNode);
                    if (currentMode === 'node') {
                        if (++currentStep >= maxSteps) { emitPaused(); yield; currentStep = 0; }
                    }
                }
                if (currentMode === 'layer') {
                    if (++currentStep >= maxSteps) { emitPaused(); yield; currentStep = 0; }
                }
            }

            emitExample(currentExample, allCorrect);
            if (currentMode === 'example') {
                if (++currentStep >= maxSteps) {
                    if (nodeEventsSinceYield > 0) {
                        emitPaused(); nodeEventsSinceYield = 0; yield; currentStep = 0;
                    } else {
                        currentStep = 0;  // boundary no-op: skip, run next example
                    }
                }
            }
        }

        emitEpoch(currentEpoch);
        if (currentMode === 'epoch') {
            if (++currentStep >= maxSteps) {
                if (nodeEventsSinceYield > 0) {
                    emitPaused(); nodeEventsSinceYield = 0; yield; currentStep = 0;
                } else {
                    currentStep = 0;  // boundary no-op: skip, run next epoch
                }
            }
        }

        if (allCorrect) { converged = true; break; }
    }
    emitDone(converged);
}

// ── Predict (no training) ────────────────────────────────────────────────────
function predict(inputs) {
    for (var i = 0; i < inputs.length; i++) layers[0][i].output = inputs[i];
    for (var li = 1; li < layers.length; li++) {
        for (var ni = 0; ni < layers[li].length; ni++) {
            feedForwardNode(li, ni);
            emitNode('node_ff_done', li, ni);
        }
    }
    var out = layers[OUTPUT_LAYER_INDEX].map(function(n){ return n.output; });
    emitPrediction(out);
}

// ── Network construction ─────────────────────────────────────────────────────
function createNetwork(params) {
    layers        = [];
    trainingSet   = params.trainingDataset;
    maxEpochs     = params.epochs;
    learningRate  = params.learningRate;
    tolerance     = params.tolerance;
    maxExamples   = trainingSet.length;

    var hiddenSpec     = params.hiddenLayerCount;   // array of node counts per hidden layer
    var inputCount     = trainingSet[0][0].length;
    var outputCount    = trainingSet[0][1].length;

    // Input layer
    layers.push([]);
    for (var i = 0; i < inputCount; i++) {
        layers[0].push({ id: nodeId(0,i), name: nodeName(0,i), type: 'input',
            layerId: 0, lindex: i, input: 0, output: 0, inConn: [], outConn: [] });
    }

    // Hidden layers
    for (var h = 0; h < hiddenSpec.length; h++) {
        var li = h + 1;
        layers.push([]);
        for (var ni = 0; ni < hiddenSpec[h]; ni++) {
            layers[li].push({ id: nodeId(li,ni), name: nodeName(li,ni), type: 'hidden',
                layerId: li, lindex: ni,
                input: 0, output: 0, error: 0,
                thres: randWeight(),
                inConn: [], outConn: [] });
        }
    }

    // Output layer
    var oli = layers.length;
    OUTPUT_LAYER_INDEX = oli;
    layers.push([]);
    for (var i = 0; i < outputCount; i++) {
        layers[oli].push({ id: nodeId(oli,i), name: nodeName(oli,i), type: 'output',
            layerId: oli, lindex: i,
            input: 0, output: 0, error: 0, target: 0, hitTarget: false,
            thres: randWeight(),
            inConn: [], outConn: [] });
    }

    // Connect fully
    for (var li = 0; li < layers.length - 1; li++) {
        for (var ni = 0; ni < layers[li].length; ni++) {
            for (var nj = 0; nj < layers[li+1].length; nj++) {
                var conn = {
                    id: linkId(li,ni,li+1,nj),
                    from: layers[li][ni],
                    to:   layers[li+1][nj],
                    weight: randWeight()
                };
                layers[li][ni].outConn.push(conn);
                layers[li+1][nj].inConn.push(conn);
            }
        }
    }

    // Initial forward pass so weights are displayed from the start
    initExample(0);
    for (var li = 1; li < layers.length; li++) {
        for (var ni = 0; ni < layers[li].length; ni++) {
            feedForwardNode(li, ni);
        }
    }

    networkStepper = train();
    networkInitialized = true;
    emitNetwork();
}

// ── Message handler ──────────────────────────────────────────────────────────
self.onmessage = function(e) {
    var m = e.data;
    if (m.op === 'create') {
        networkInitialized = false;
        layers = [];
        createNetwork(m.params);
        return;
    }
    if (m.op === 'step') {
        currentMode  = m.mode;
        maxSteps     = m.count || 1;
        currentStep  = 0;
        nodeEventsSinceYield = 0;
        networkStepper.next();
        return;
    }
    if (m.op === 'predict') {
        predict(m.inputs);
        return;
    }
};
