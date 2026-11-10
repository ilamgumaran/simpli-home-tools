// SPDX-License-Identifier: LicenseRef-Simpli-Noncommercial-1.0
// Copyright (C) 2026 ilamgumaran and contributors
// Test-only cadence replay. This file is deliberately not imported by the app.
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const runtimeCadence = require('../frame-cadence.js');

const PERIOD = 1000 / 30;
const EARLY_TOLERANCE = 4;
const MINIMUM_GAP = 24;
const FPS_FLOOR = 26;
const P95_LIMIT = 46;
const MAX_GAP_LIMIT = 100;

function finite(value, label) {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new TypeError(`${label} must be a finite number`);
  }
  return value;
}

function parseTrace(source, filename = '<input>') {
  const lines = source.split(/\r?\n/).filter((line) => line.trim() !== '');
  if (lines.length !== 1) throw new Error(`${filename}: expected exactly one JSONL cadence record`);
  let record;
  try {
    record = JSON.parse(lines[0]);
  } catch (error) {
    throw new Error(`${filename}: invalid JSON: ${error.message}`);
  }
  const fail = (message) => { throw new Error(`${filename}: ${message}`); };
  if (!record || typeof record !== 'object' || Array.isArray(record)) fail('record must be an object');
  if (record.schemaVersion !== 1 || record.kind !== 'cadence') fail('expected schemaVersion 1 cadence record');
  if (!record.provenance || typeof record.provenance !== 'object') fail('missing provenance');
  if (!record.context || typeof record.context !== 'object') fail('missing context');
  if (typeof record.context.lowPower !== 'boolean') fail('context.lowPower must be boolean');
  if (!record.data || typeof record.data !== 'object') fail('missing data');
  const { native, app } = record.data;
  finite(record.data.start, 'data.start');
  finite(record.data.end, 'data.end');
  if (record.data.start < 0 || record.data.end <= record.data.start) fail('data.start and data.end must define a positive capture window');
  const sampleStart = record.data.geometryStartMs;
  const sampleEnd = record.data.geometryEndMs;
  finite(sampleStart, 'data.geometryStartMs');
  finite(sampleEnd, 'data.geometryEndMs');
  if (sampleStart < 0 || sampleEnd <= sampleStart) fail('sample start and end must define a positive elapsed window');
  if (JSON.stringify(record.data.nativeColumns) !== JSON.stringify(['timestamp', 'performance.now'])) fail('unsupported or missing nativeColumns');
  if (JSON.stringify(record.data.appColumns) !== JSON.stringify(['policyID', 'at', 'performanceAtEntry', 'lowPower', 'accepted'])) fail('unsupported or missing appColumns');
  if (!Array.isArray(native) || native.length < 1) fail('data.native must be a nonempty array');
  if (!Array.isArray(app) || app.length < 1) fail('data.app must be a nonempty array');

  let previousNominal = -Infinity;
  let previousActual = -Infinity;
  const nativeRows = native.map((tuple, index) => {
    if (!Array.isArray(tuple) || tuple.length !== 2) fail(`native[${index}] must be [timestamp, performance.now]`);
    const nominal = finite(tuple[0], `native[${index}][0]`);
    const actual = finite(tuple[1], `native[${index}][1]`);
    if (nominal < 0) fail(`native nominal timestamp is negative at row ${index}`);
    if (nominal === previousNominal) fail(`native nominal timestamps duplicate at row ${index}`);
    if (nominal < previousNominal) fail(`native nominal timestamps go backwards at row ${index}`);
    if (actual < 0) fail(`native actual timestamp is negative at row ${index}`);
    if (actual < previousActual) fail(`native actual timestamps go backwards at row ${index}`);
    previousNominal = nominal;
    previousActual = actual;
    return { nominal, actual, index };
  });
  const appRows = app.map((tuple, index) => {
    if (!Array.isArray(tuple) || tuple.length !== 5) fail(`app[${index}] must be [policyID, at, performanceAtEntry, lowPower, accepted]`);
    const [policyID, nominalValue, actualValue, lowPower, accepted] = tuple;
    if (!Number.isSafeInteger(policyID) || policyID < 0) fail(`app[${index}][0] must be a nonnegative safe integer policyID`);
    const nominal = finite(nominalValue, `app[${index}][1]`);
    const actual = finite(actualValue, `app[${index}][2]`);
    if (nominal < 0) fail(`app nominal timestamp is negative at row ${index}`);
    if (actual < 0) fail(`app actual timestamp is negative at row ${index}`);
    if (lowPower !== record.context.lowPower) fail(`app[${index}][3] must match context.lowPower`);
    if (typeof accepted !== 'boolean') fail(`app[${index}][4] must be boolean`);
    return { policyID, nominal, actual, lowPower, accepted, index };
  });
  const policyIDs = [...new Set(appRows.map((row) => row.policyID))];
  if (policyIDs.length !== 1) fail(`expected one policyID for an independent replay; found ${policyIDs.join(', ')}`);
  for (let i = 1; i < appRows.length; i += 1) {
    if (appRows[i].policyID !== appRows[i - 1].policyID) fail(`app policyID changes at row ${i}`);
    if (appRows[i].nominal === appRows[i - 1].nominal) fail(`app nominal timestamps duplicate at row ${i}`);
    if (appRows[i].nominal < appRows[i - 1].nominal) fail(`app nominal timestamps go backwards at row ${i}`);
    if (appRows[i].actual < appRows[i - 1].actual) fail(`app actual timestamps go backwards at row ${i}`);
  }
  return { record, start: sampleStart, end: sampleEnd, elapsedMs: sampleEnd - sampleStart, nativeRows, appRows, policyID: policyIDs[0] };
}

function makeAlternatives() {
  function fixedLast() {
    let last = null;
    return (at) => {
      if (last === null || at < last) { last = at; return true; }
      if (at - last < Math.max(MINIMUM_GAP, PERIOD - EARLY_TOLERANCE)) return false;
      last = at;
      return true;
    };
  }
  function boundedPhase() {
    let last = null;
    let due = null;
    return (at) => {
      if (last === null || at < last) { last = at; due = at + PERIOD; return true; }
      if (at - last < MINIMUM_GAP || at < due) return false;
      last = at;
      // Keep the constant phase when callbacks arrive on time; cap retained debt
      // at one period after a long pause so one late frame cannot trigger a burst.
      due = Math.max(due + PERIOD, at - PERIOD);
      return true;
    };
  }
  function earliest24() {
    let last = null;
    return (at) => {
      if (last === null || at < last) { last = at; return true; }
      if (at - last < MINIMUM_GAP) return false;
      last = at;
      return true;
    };
  }
  return [
    { name: 'current-runtime', make: () => runtimeCadence.create().shouldDraw },
    { name: 'fixed-last-period-minus-4', make: fixedLast },
    { name: 'bounded-phase-retain-debt', make: boundedPhase },
    { name: 'earliest-24', make: earliest24 },
  ];
}

function percentile95(gaps) {
  if (gaps.length === 0) return null;
  const sorted = [...gaps].sort((a, b) => a - b);
  return sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * 0.95))];
}

function gapsMetrics(rows, elapsedMs) {
  const gaps = rows.slice(1).map((row, index) => row - rows[index]);
  const minGap = gaps.length ? Math.min(...gaps) : null;
  const maxGap = gaps.length ? Math.max(...gaps) : null;
  const p95 = percentile95(gaps);
  return {
    frames: rows.length,
    fps: rows.length * 1000 / elapsedMs,
    minGap,
    p95Gap: p95,
    maxGap,
    acceptedGaps: gaps,
  };
}

function gate(metrics, lowPower, enforceNominalFloor = false) {
  const thresholds = lowPower
    ? { fps: FPS_FLOOR, p95: P95_LIMIT }
    : { fps: 45, p95: 31 };
  const result = {
    fps: metrics.fps >= thresholds.fps,
    p95: metrics.p95Gap !== null && metrics.p95Gap <= thresholds.p95,
    maxGap: metrics.maxGap !== null && metrics.maxGap < MAX_GAP_LIMIT,
  };
  if (enforceNominalFloor && lowPower) result.minGap = metrics.minGap !== null && metrics.minGap >= MINIMUM_GAP;
  return result;
}

function simulate(trace, makePolicy, compareCaptured = false) {
  const decide = makePolicy();
  const accepted = [];
  const mismatches = [];
  for (const row of trace.appRows) {
    const predicted = decide(row.nominal, trace.record.context.lowPower);
    if (typeof predicted !== 'boolean') throw new TypeError('policy decision must be boolean');
    if (predicted) accepted.push(row);
    if (predicted !== row.accepted) mismatches.push({ index: row.index, at: row.nominal, predicted, captured: row.accepted });
  }
  const boundarySensitive = compareCaptured && mismatches.length > 0;
  const nominal = gapsMetrics(accepted.map((row) => row.nominal), trace.elapsedMs);
  const actual = gapsMetrics(accepted.map((row) => row.actual), trace.elapsedMs);
  return {
    acceptedCount: accepted.length,
    nominal,
    performanceAtEntry: actual,
    gates: {
      nominal: gate(nominal, trace.record.context.lowPower, true),
      performanceAtEntry: gate(actual, trace.record.context.lowPower),
    },
    mismatches: mismatches.map((item) => ({ ...item, classification: boundarySensitive ? 'unknown-prewindow-state' : 'replay-mismatch' })),
    boundaryUncertainty: boundarySensitive ? 'the current-runtime replay diverges; pre-window policy state is absent, so this mismatch sequence is not a regression finding' : null,
  };
}

function metricsForCaptured(rows, elapsedMs) {
  const accepted = rows.filter((row) => row.accepted);
  const nominal = gapsMetrics(accepted.map((row) => row.nominal), elapsedMs);
  const actual = gapsMetrics(accepted.map((row) => row.actual), elapsedMs);
  const lowPower = rows[0]?.lowPower ?? true;
  return {
    acceptedCount: accepted.length,
    nominal,
    performanceAtEntry: actual,
    gates: { nominal: gate(nominal, lowPower, true), performanceAtEntry: gate(actual, lowPower) },
  };
}

// Exhaustive callback-subsequence oracle. Starts/ends may be anywhere in the
// captured callback window. It keeps the minimum >46ms gaps for every draw count.
function feasibilityOracle(rows, elapsedMs, clock = 'nominal') {
  const count = rows.length;
  if (!['nominal', 'performanceAtEntry'].includes(clock)) throw new Error(`unsupported oracle clock: ${clock}`);
  if (count < 2) return { available: false, reason: 'fewer than two callback rows', clock };
  const best = Array.from({ length: count }, () => new Map());
  const clockTime = (row) => row[clock === 'nominal' ? 'nominal' : 'actual'];
  for (let end = 0; end < count; end += 1) {
    best[end].set(1, { longGaps: 0, previous: -1, previousFrames: 0 });
    for (let from = 0; from < end; from += 1) {
      const nominalGap = rows[end].nominal - rows[from].nominal;
      const measuredGap = clockTime(rows[end]) - clockTime(rows[from]);
      if (nominalGap < MINIMUM_GAP || measuredGap >= MAX_GAP_LIMIT) continue;
      for (const [frames, state] of best[from]) {
        const nextFrames = frames + 1;
        const candidateLong = state.longGaps + (measuredGap > P95_LIMIT ? 1 : 0);
        const incumbent = best[end].get(nextFrames);
        if (incumbent && incumbent.longGaps <= candidateLong) continue;
        best[end].set(nextFrames, { longGaps: candidateLong, previous: from, previousFrames: frames });
      }
    }
  }
  const byFrames = new Map();
  for (let end = 0; end < count; end += 1) {
    for (const [frames, state] of best[end]) {
      const incumbent = byFrames.get(frames);
      if (!incumbent || state.longGaps < incumbent.longGaps) byFrames.set(frames, { end, longGaps: state.longGaps });
    }
  }
  const scorecard = [];
  const paths = new Map();
  for (const [frames, state] of [...byFrames.entries()].sort((a, b) => a[0] - b[0])) {
    let cursor = state.end;
    let remainingFrames = frames;
    const indices = [];
    while (cursor >= 0) {
      indices.push(cursor);
      const item = best[cursor].get(remainingFrames);
      remainingFrames = item.previousFrames;
      cursor = item.previous;
    }
    indices.reverse();
    const chosen = indices.map((index) => rows[index]);
    const nominal = gapsMetrics(chosen.map((row) => row.nominal), elapsedMs);
    const actual = gapsMetrics(chosen.map((row) => row.actual), elapsedMs);
    const measured = clock === 'nominal' ? nominal : actual;
    const fpsPass = measured.fps >= FPS_FLOOR;
    const p95Pass = measured.p95Gap !== null && measured.p95Gap <= P95_LIMIT;
    paths.set(frames, { callbackIndices: indices, nominal, performanceAtEntry: actual });
    scorecard.push({
      frames,
      minimumGapsOver46Ms: state.longGaps,
      p95Pass,
      fpsPass,
      feasible: p95Pass && fpsPass,
    });
  }
  const winnerScore = scorecard.filter((entry) => entry.feasible).at(-1);
  const bestScore = winnerScore ?? scorecard.at(-1);
  const bestPath = bestScore ? { ...bestScore, ...paths.get(bestScore.frames) } : null;
  if (!winnerScore) return {
    available: Boolean(bestScore), feasible: false, clock, scorecard,
    bestFailure: bestPath,
    reason: `no subsequence in the captured callback window satisfies ${clock} fps >= 26 and p95 <= 46ms with nominal gap >= 24ms and ${clock} gap < 100ms`,
  };
  const winner = { ...winnerScore, ...paths.get(winnerScore.frames) };
  return {
    available: true,
    feasible: true,
    clairvoyant: true,
    clock,
    capturedWindowEndpointsMayBeOmitted: true,
    objective: `for each frame count, minimize ${clock} gaps > 46ms; select the highest count with ${clock} p95 <= 46ms`,
    ...winner,
    scorecard,
    gates: { nominal: gate(winner.nominal, true, true), performanceAtEntry: gate(winner.performanceAtEntry, true) },
    interpretation: 'This is a clairvoyant callback subsequence, not an implementable policy; it says nothing about callbacks outside this captured window.',
  };
}

function loadFile(filename) {
  const resolved = path.resolve(filename);
  const source = fs.readFileSync(resolved, 'utf8');
  return { resolved, source, sha256: crypto.createHash('sha256').update(source).digest('hex') };
}

function replayFile(filename) {
  const loaded = loadFile(filename);
  const trace = parseTrace(loaded.source, loaded.resolved);
  const policies = trace.record.context.lowPower
    ? makeAlternatives().map(({ name, make }) => ({ name, ...simulate(trace, make, name === 'current-runtime') }))
    : [{ name: 'current-runtime', ...simulate(trace, () => runtimeCadence.create().shouldDraw, true) }];
  const nativeNominal = gapsMetrics(trace.nativeRows.map((row) => row.nominal), trace.elapsedMs);
  const nativePerformanceAtEntry = gapsMetrics(trace.nativeRows.map((row) => row.actual), trace.elapsedMs);
  const sameCount = trace.nativeRows.length === trace.appRows.length;
  const sameNominalSequence = sameCount && trace.nativeRows.every((row, index) => row.nominal === trace.appRows[index].nominal);
  return {
    source: path.relative(process.cwd(), loaded.resolved).split(path.sep).join('/').startsWith('../')
      ? path.basename(loaded.resolved)
      : path.relative(process.cwd(), loaded.resolved).split(path.sep).join('/'),
    sourceSha256: loaded.sha256,
    provenance: trace.record.provenance,
    context: trace.record.context,
    traceID: trace.record.traceID ?? null,
    policyID: trace.policyID,
    elapsedMs: trace.elapsedMs,
    metricsScope: 'accepted callback gaps only; no geometry prediction',
    nativeAppAlignment: {
      sameCount,
      sameNominalSequence,
      warning: sameNominalSequence ? null : 'Independent native and app samples differ; replay and oracle use only app opportunities. Inspect delivery and sampling boundaries separately.',
    },
    thresholds: {
      lowPower: { fpsFloor: FPS_FLOOR, p95GapMs: P95_LIMIT, strictMaxGapMs: MAX_GAP_LIMIT, minimumNominalGapMs: MINIMUM_GAP },
      normal: { fpsFloor: 45, p95GapMs: 31, strictMaxGapMs: MAX_GAP_LIMIT },
    },
    native: { callbackCount: trace.nativeRows.length, nominal: nativeNominal, performanceAtEntry: nativePerformanceAtEntry },
    captured: metricsForCaptured(trace.appRows, trace.elapsedMs),
    candidates: policies,
    oracle: trace.record.context.lowPower
      ? { nominal: feasibilityOracle(trace.appRows, trace.elapsedMs, 'nominal'), performanceAtEntry: feasibilityOracle(trace.appRows, trace.elapsedMs, 'performanceAtEntry') }
      : { available: false, feasible: false, reason: 'lowPower=false; low-power callback subsequence oracle is not applicable' },
    experimentsSkipped: trace.record.context.lowPower ? [] : ['fixed-last-period-minus-4', 'bounded-phase-retain-debt', 'earliest-24', 'low-power feasibility oracle'],
  };
}

function main(argv) {
  if (argv.length === 0 || argv.includes('--help') || argv.includes('-h')) {
    process.stdout.write('Usage: node tests/replay-cadence-policy.cjs <cadence.jsonl> [cadence.jsonl ...]\n');
    return;
  }
  try {
    const results = argv.map(replayFile);
    process.stdout.write(`${JSON.stringify({ tool: 'test-only-cadence-policy-replay', results }, null, 2)}\n`);
  } catch (error) {
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 1;
  }
}

if (require.main === module) main(process.argv.slice(2));

module.exports = { parseTrace, makeAlternatives, percentile95, gapsMetrics, gate, simulate, metricsForCaptured, feasibilityOracle, replayFile };
