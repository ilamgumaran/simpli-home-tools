// SPDX-License-Identifier: LicenseRef-Simpli-Noncommercial-1.0
// Copyright (C) 2026 ilamgumaran and contributors
'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const {spawnSync} = require('node:child_process');
const {analyzeCadence} = require('./analyze-cadence-trace.cjs');

function fixture({geometry, end, metrics, native = [], app = [], lowPower = true, appColumns, nativeColumns, suite = 'dashboard', schemaVersion = 1}) {
  return {
    schemaVersion,
    kind: 'cadence',
    traceID: 'fixture',
    context: {suite, form: 'hosted', browser: 'chromium', lowPower},
    data: {
      metrics,
      geometryTimesMs: geometry,
      geometryStartMs: 0,
      geometryEndMs: end,
      native,
      app,
      nativeColumns: nativeColumns || ['timestamp', 'performance.now'],
      appColumns: appColumns || ['policyID', 'at', 'performanceAtEntry', 'lowPower', 'accepted']
    }
  };
}

test('keeps native callback count distinct from accepted application callbacks', () => {
  const result = analyzeCadence(fixture({
    geometry: [10, 43], end: 100,
    metrics: {fps: 20, p95: 33, maxGap: 33, frames: 2},
    native: [[1, 10], [34, 43]],
    app: [[7, 1, 10, true, true], [7, 17, 26, true, true], [7, 34, 43, true, true]]
  }));
  assert.equal(result.counts.native, 2);
  assert.equal(result.counts.app, 3);
  assert.deepEqual(result.nativeNominalGapsMs, [33]);
  assert.deepEqual(result.lowPowerInvariantViolations, []);
});

test('reports an internal native timestamp missing from the app sampler and omits boundary callbacks', () => {
  const result = analyzeCadence(fixture({
    geometry: [10, 58], end: 100,
    metrics: {fps: 20, p95: 48, maxGap: 48, frames: 2},
    native: [[10, 10], [26, 26], [42, 42], [58, 58]],
    app: [[1, 10, 10, true, true], [2, 26, 26, true, true], [4, 58, 58, true, true]]
  }));
  assert.deepEqual(result.nativeMissingFromApp, [{performanceNow: 42, timestamp: 42}]);
});

test('accepted app callbacks do not create geometry samples', () => {
  const result = analyzeCadence(fixture({
    geometry: [10, 50], end: 100,
    metrics: {fps: 20, p95: 40, maxGap: 40, frames: 2},
    native: [[10, 10], [30, 30], [50, 50]],
    app: [[2, 10, 10, true, true], [2, 30, 30, true, true], [2, 50, 50, true, true]]
  }));
  assert.equal(result.counts.geometry, 2);
  assert.equal(result.counts.app, 3);
  assert.equal(result.longGeometryGaps.length, 0);
});

test('shows long geometry gaps alongside fine app and native cadence without assigning cause', () => {
  const result = analyzeCadence(fixture({
    geometry: [10, 90], end: 100,
    metrics: {fps: 20, p95: 80, maxGap: 80, frames: 2},
    native: [[10, 10], [26, 26], [42, 42], [58, 58], [74, 74], [90, 90]],
    app: [[5, 10, 10, true, true], [5, 26, 26, true, true], [5, 42, 42, true, true], [5, 58, 58, true, true], [5, 74, 74, true, true], [5, 90, 90, true, true]]
  }));
  assert.equal(result.longGeometryGaps.length, 1);
  assert.equal(result.longGeometryGaps[0].gapMs, 80);
  assert.equal(result.longGeometryGaps[0].nearestPrecedingAccepted.time, 10);
  assert.equal(result.longGeometryGaps[0].nearestFollowingAccepted.time, 90);
  assert.equal(result.longGeometryGaps[0].latestAcceptedAtGapEnd.time, 90);
  assert.ok(result.longGeometryGaps[0].surroundingEvents.length > 0);
});

test('keeps accepted events within the geometry gap distinct from events after it', () => {
  const result = analyzeCadence(fixture({
    geometry: [10, 90], end: 100,
    metrics: {fps: 20, p95: 80, maxGap: 80, frames: 2},
    app: [[5, 10, 10, true, true], [5, 58, 58, true, true], [5, 100, 100, true, true]]
  }));
  const gap = result.longGeometryGaps[0];
  assert.equal(gap.latestAcceptedAtGapEnd.time, 58);
  assert.equal(gap.nearestFollowingAccepted.time, 100);
  assert.notEqual(gap.latestAcceptedAtGapEnd.policyID, undefined);
});

test('reports surrounding event count and retains the first and last events when truncated', () => {
  const app = Array.from({length: 24}, (_, i) => [2, 10 + i * 3, 10 + i * 3, true, true]);
  const result = analyzeCadence(fixture({
    geometry: [10, 90], end: 100,
    metrics: {fps: 20, p95: 80, maxGap: 80, frames: 2},
    app
  }));
  const gap = result.longGeometryGaps[0];
  assert.equal(gap.surroundingEventCount, 24);
  assert.equal(gap.surroundingEventsTruncated, true);
  assert.equal(gap.surroundingEvents.length, 16);
  assert.equal(gap.surroundingEvents[0].index, 0);
  assert.equal(gap.surroundingEvents.at(-1).index, 23);
});

test('detects low-power rejected events after the minimum accepted spacing for the same policy', () => {
  const result = analyzeCadence(fixture({
    geometry: [0, 50], end: 100,
    metrics: {fps: 20, p95: 50, maxGap: 50, frames: 2},
    native: [[0, 0], [50, 50]],
    app: [[4, 0, 0, true, true], [4, 25, 25, true, false], [4, 1000 / 30 - 4, 30, true, false], [8, 1000, 40, true, false]]
  }));
  assert.deepEqual(result.lowPowerInvariantViolations.map(event => event.policyID), [4]);
  assert.ok(Math.abs(result.lowPowerInvariantViolations[0].elapsedSinceAcceptedMs - (1000 / 30 - 4)) < 1e-7);
});

test('preserves policy invocation order, warns and resets invariant history on backward timestamps', () => {
  const result = analyzeCadence(fixture({
    geometry: [0, 50], end: 100,
    metrics: {fps: 20, p95: 50, maxGap: 50, frames: 2},
    app: [[4, 100, 10, true, true], [4, 50, 20, true, false], [4, 80, 30, true, false]]
  }));
  assert.deepEqual(result.lowPowerInvariantViolations, []);
  assert.ok(result.warnings.some(warning => warning.includes('policy 4')));
});

test('computes native nominal gaps in captured invocation order', () => {
  const result = analyzeCadence(fixture({
    geometry: [0, 40], end: 100,
    metrics: {fps: 20, p95: 40, maxGap: 40, frames: 2},
    native: [[0, 20], [30, 10], [60, 40]],
    app: []
  }));
  assert.deepEqual(result.nativeNominalGapsMs, [30, 30]);
});

test('uses the captured mode flag for the original acceptance thresholds', () => {
  const common = {
    geometry: [0, 40, 80, 120, 160, 200, 240, 280, 320, 360, 400, 440, 480, 520, 560, 600, 640, 680, 720, 760, 800, 840, 880, 920, 960, 1000],
    end: 1000,
    metrics: {fps: 26, p95: 40, maxGap: 40, frames: 26},
    native: [[0, 0], [1000, 1000]],
    app: []
  };
  assert.deepEqual(analyzeCadence(fixture({...common, lowPower: true})).acceptance, {fps: true, p95: true, maxGap: true});
  assert.deepEqual(analyzeCadence(fixture({...common, lowPower: false})).acceptance, {fps: false, p95: false, maxGap: true});
});

test('uses floor of 95 percent gap count and flags reported rounding differences', () => {
  const geometry = [0, 1, 3, 6, 10, 15, 21, 28, 36, 45, 55, 66, 78, 91, 105, 120, 136, 153, 171, 190, 210];
  const result = analyzeCadence(fixture({
    geometry, end: 210,
    metrics: {fps: 100, p95: 19, maxGap: 20, frames: 21},
    native: [[0, 0], [210, 210]],
    app: []
  }));
  assert.equal(result.recomputed.p95, 20);
  assert.equal(result.recomputed.fps, 100);
  assert.equal(result.reportedCheck.p95, false);
  assert.ok(result.warnings.includes('reported metrics differ from recomputed geometry metrics'));
});

test('uses column names for shuffled app and native data', () => {
  const result = analyzeCadence(fixture({
    geometry: [0, 40], end: 100,
    metrics: {fps: 20, p95: 40, maxGap: 40, frames: 2},
    nativeColumns: ['performance.now', 'timestamp'],
    native: [[0, 0], [40, 40]],
    appColumns: ['accepted', 'performanceAtEntry', 'lowPower', 'at', 'policyID'],
    app: [[true, 0, true, 0, 11], [true, 40, true, 40, 11]]
  }));
  assert.deepEqual(result.activePolicyIDs, [11]);
  assert.equal(result.counts.app, 2);
});

test('skips non-cadence records and warns on empty or malformed sample data', () => {
  assert.deepEqual(analyzeCadence({kind: 'navigation'}), {skipped: true, reason: 'non-cadence input'});
  const empty = analyzeCadence({kind: 'cadence', context: {}, data: {}});
  assert.equal(empty.recomputed.fps, null);
  assert.ok(empty.warnings.includes('geometry trace is empty'));
  assert.ok(empty.warnings.includes('geometry interval endpoints are missing or invalid'));
});

test('warns on unsupported schema and leaves thresholds unknown for an unknown mode flag', () => {
  const result = analyzeCadence(fixture({
    geometry: [0, 40], end: 100,
    metrics: {fps: 20, p95: 40, maxGap: 40, frames: 2},
    lowPower: null,
    schemaVersion: 2,
    app: []
  }));
  assert.deepEqual(result.thresholds, {fps: null, p95: null, maxGap: null});
  assert.deepEqual(result.acceptance, {fps: null, p95: null, maxGap: null});
  assert.ok(result.warnings.some(warning => warning.includes('unsupported schemaVersion')));
  assert.ok(result.warnings.includes('lowPower mode flag is missing or invalid'));
});

test('CLI preserves malformed JSON line diagnostics and exits nonzero', () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'cadence-analyzer-'));
  const input = path.join(directory, 'mixed.jsonl');
  const good = fixture({geometry: [0, 40], end: 100, metrics: {fps: 20, p95: 40, maxGap: 40, frames: 2}});
  fs.writeFileSync(input, `${JSON.stringify(good)}\nthis is malformed\n${JSON.stringify({kind: 'navigation'})}\n`);
  const result = spawnSync(process.execPath, [path.join(__dirname, 'analyze-cadence-trace.cjs'), input], {encoding: 'utf8'});
  fs.rmSync(directory, {recursive: true, force: true});
  assert.equal(result.status, 1);
  const output = JSON.parse(result.stdout);
  assert.equal(output.analyses.length, 1);
  assert.deepEqual(output.parseWarnings.map(warning => warning.line), [2]);
});
