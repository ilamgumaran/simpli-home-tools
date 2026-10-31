// SPDX-License-Identifier: LicenseRef-Simpli-Noncommercial-1.0
// Copyright (C) 2026 ilamgumaran and contributors
'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const {
  parseTrace,
  percentile95,
  gapsMetrics,
  simulate,
  feasibilityOracle,
  replayFile,
} = require('./replay-cadence-policy.cjs');

function record({ lowPower = true, start = 100, end = 200, app = [[1, 100, 100, lowPower, true], [1, 140, 140, lowPower, true]], native } = {}) {
  return {
    schemaVersion: 1,
    kind: 'cadence',
    provenance: { sourceRevision: 'unit', platform: 'test' },
    context: { lowPower },
    data: {
      start, end, geometryStartMs: start, geometryEndMs: end,
      native: native || [[100, 100], [140, 140]],
      nativeColumns: ['timestamp', 'performance.now'],
      appColumns: ['policyID', 'at', 'performanceAtEntry', 'lowPower', 'accepted'],
      app,
    },
    traceID: 'unit-trace',
  };
}
const asJsonl = (value) => `${JSON.stringify(value)}\n`;

// Strict shape/mode checks and monotonicity on both clocks.
assert.throws(() => parseTrace('{}', 'bad.jsonl'), /schemaVersion 1 cadence/);
assert.throws(() => parseTrace(asJsonl(record({ app: [[1, 100, 100, true, true], [2, 140, 140, true, false]] }))), /expected one policyID/);
assert.throws(() => parseTrace(asJsonl(record({ native: [[100, 100], [99, 140]] }))), /native nominal timestamps go backwards/);
assert.throws(() => parseTrace(asJsonl(record({ native: [[100, 100], [100, 140]] }))), /native nominal timestamps duplicate/);
assert.throws(() => parseTrace(asJsonl(record({ native: [[-1, 100], [100, 140]] }))), /native nominal timestamp is negative/);
assert.throws(() => parseTrace(asJsonl(record({ native: [[100, 100], [140, 99]] }))), /native actual timestamps go backwards/);
assert.throws(() => parseTrace(asJsonl(record({ app: [[1, 100, 100, true, true], [1, 140, 99, true, false]] }))), /app actual timestamps go backwards/);
assert.throws(() => parseTrace(asJsonl(record({ end: 100 }))), /positive capture window/);
const missingGeometryStart = record();
delete missingGeometryStart.data.geometryStartMs;
assert.throws(() => parseTrace(asJsonl(missingGeometryStart)), /geometryStartMs must be a finite number/);
const unsupportedColumns = record();
unsupportedColumns.data.appColumns[0] = 'clockID';
assert.throws(() => parseTrace(asJsonl(unsupportedColumns)), /unsupported or missing appColumns/);

// The percentile uses the gate's floor(.95 * gapCount) index.
assert.equal(percentile95([]), null);
assert.equal(percentile95([7]), 7);
assert.equal(percentile95([4, 8, 9, 2]), 9);
assert.equal(percentile95(Array.from({ length: 20 }, (_, i) => i + 1)), 20);
assert.equal(gapsMetrics([10, 25], 100).p95Gap, 15);

// FPS uses the trace's original elapsed window, including its sampled boundaries.
const parsed = parseTrace(asJsonl(record({ start: 20, end: 220, app: [[1, 100, 100, true, true], [1, 140, 140, true, true]] })));
const simulated = simulate(parsed, () => {
  let n = 0;
  return () => n++ === 0;
});
assert.equal(simulated.nominal.fps, 5);
assert.equal(simulated.nominal.acceptedGaps.length, 0);
const geometryWindow = record({ start: 10, end: 250 });
geometryWindow.data.geometryStartMs = 30;
geometryWindow.data.geometryEndMs = 130;
assert.equal(parseTrace(asJsonl(geometryWindow)).elapsedMs, 100);

// Normal-mode traces are valid; replayFile keeps current runtime and marks low-power
// candidates/oracle skipped. (An in-memory helper also proves false-mode tuples parse.)
assert.equal(parseTrace(asJsonl(record({ lowPower: false }))).record.context.lowPower, false);
const falseModeDir = fs.mkdtempSync(path.join(os.tmpdir(), 'clock-cadence-replay-'));
const falseModeFile = path.join(falseModeDir, 'trace.jsonl');
const normalRecord = record({
  lowPower: false,
  start: 0,
  end: 32,
  app: [[1, 0, 0, false, true], [1, 16, 16, false, true], [1, 32, 32, false, true]],
  native: [[0, 0], [16, 16], [32, 32]],
});
fs.writeFileSync(falseModeFile, asJsonl(normalRecord));
try {
  const normal = replayFile(falseModeFile);
  assert.equal(normal.nativeAppAlignment.sameNominalSequence, true);
  assert.equal(normal.candidates.length, 1);
  assert.equal(normal.candidates[0].name, 'current-runtime');
  assert.equal(normal.candidates[0].acceptedCount, 3);
  assert.equal(normal.candidates[0].gates.nominal.fps, true);
  assert.equal(normal.candidates[0].gates.nominal.p95, true);
  assert.equal(normal.candidates[0].gates.nominal.minGap, undefined);
  assert.equal(normal.thresholds.normal.fpsFloor, 45);
  assert.equal(normal.thresholds.normal.p95GapMs, 31);
  assert.equal(normal.oracle.available, false);
  assert.equal(normal.experimentsSkipped.length, 4);
  const unpaired = record({ lowPower: false, native: [[100, 100]] });
  fs.writeFileSync(falseModeFile, asJsonl(unpaired));
  const independent = replayFile(falseModeFile);
  assert.equal(independent.nativeAppAlignment.sameCount, false);
  assert.match(independent.nativeAppAlignment.warning, /only app opportunities/);
} finally {
  fs.rmSync(falseModeDir, { recursive: true, force: true });
}

// Oracle scans unanchored callback subsequences, constrains nominal gap floor and
// selected clock maximum, and labels its clairvoyant path.
const oracleRows = [
  { nominal: 0, actual: 0 }, { nominal: 16, actual: 16 },
  { nominal: 32, actual: 32 }, { nominal: 64, actual: 64 },
];
const oracle = feasibilityOracle(oracleRows, 100);
assert.equal(oracle.clairvoyant, true);
assert.equal(oracle.capturedWindowEndpointsMayBeOmitted, true);
assert.equal(oracle.interpretation.includes('outside this captured window'), true);
assert.equal(oracle.feasible, true);
const actualOracle = feasibilityOracle([
  { nominal: 0, actual: 0 }, { nominal: 24, actual: 20 }, { nominal: 48, actual: 40 },
], 100, 'performanceAtEntry');
assert.equal(actualOracle.feasible, true);
const unanchoredOracle = feasibilityOracle([
  { nominal: 0, actual: 0 }, { nominal: 100, actual: 100 },
  { nominal: 124, actual: 124 }, { nominal: 148, actual: 148 },
], 100);
assert.equal(unanchoredOracle.callbackIndices[0], 1);
const exactMax100 = feasibilityOracle([
  { nominal: 0, actual: 0 }, { nominal: 24, actual: 100 },
], 100, 'performanceAtEntry');
assert.equal(exactMax100.feasible, false);
assert.equal(exactMax100.bestFailure.frames, 1);
const fpsInfeasible = feasibilityOracle([
  { nominal: 0, actual: 0 }, { nominal: 24, actual: 24 }, { nominal: 48, actual: 48 },
], 2000);
assert.equal(fpsInfeasible.available, true);
assert.equal(fpsInfeasible.feasible, false);
assert.equal(fpsInfeasible.bestFailure.fpsPass, false);

// Check the DP's selected count against a brute-force subset scan on a small trace.
const small = [0, 16, 32, 64, 80].map((nominal) => ({ nominal, actual: nominal }));
const bruteCounts = [];
for (let mask = 1; mask < (1 << small.length); mask += 1) {
  const chosen = small.filter((_, index) => mask & (1 << index));
  const gaps = chosen.slice(1).map((row, index) => row.nominal - chosen[index].nominal);
  if (gaps.some((gap) => gap < 24 || gap >= 100)) continue;
  if (chosen.length * 1000 / 100 < 26) continue;
  const p95 = percentile95(gaps);
  if (p95 !== null && p95 <= 46) bruteCounts.push(chosen.length);
}
const smallOracle = feasibilityOracle(small, 100, 'nominal');
assert.equal(smallOracle.frames, Math.max(...bruteCounts));

process.stdout.write('replay-cadence-policy-unit: ok\n');
