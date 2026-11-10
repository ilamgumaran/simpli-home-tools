// SPDX-License-Identifier: LicenseRef-Simpli-Noncommercial-1.0
// Copyright (C) 2026 ilamgumaran and contributors
'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const {createHash} = require('node:crypto');
const {analyzeFiles, expectedSchedule} = require('./analyze-firefox-stalls.cjs');
const {stableJSON} = require('./firefox-stall-notices.cjs');

const sha = value => createHash('sha256').update(value).digest('hex');
const provenance = {gitSHA: 'a'.repeat(40), platform: 'win32', arch: 'x64', node: 'v24.19.0',
  captureDigest: '1'.repeat(64), traceDigest: '2'.repeat(64), profileExtractorDigest: '3'.repeat(64)};
const viewport = {width: 854, height: 480};
const appColumns = ['policyID', 'at', 'performanceAtEntry', 'lowPower', 'accepted'];
const nativeColumns = ['timestamp', 'performance.now'];

function seal(record) {
  delete record.traceID;
  record.traceID = sha(stableJSON(record));
  return record;
}

function makeWindow(kind) {
  const lowPower = kind === 'low';
  const start = 100, end = 2200;
  const geometryTimesMs = [start];
  for (let gap = 1; gap <= 20; gap++) geometryTimesMs.push(geometryTimesMs.at(-1) + gap);
  const native = [], app = [];
  for (let index = 0; index < 100; index++) {
    const at = 100 + index * 16.6666667;
    native.push([at, at + 0.25]);
    app.push([1, at, at + 0.5, lowPower, index % 2 === 0]);
  }
  const gaps = geometryTimesMs.slice(1).map((time, index) => time - geometryTimesMs[index]);
  const metrics = {fps: geometryTimesMs.length * 1000 / (end - start),
    p95: [...gaps].sort((a, b) => a - b)[Math.floor(gaps.length * 0.95)],
    maxGap: Math.max(...gaps), frames: geometryTimesMs.length, elapsedMs: end - start};
  const thresholds = lowPower ? {fps: 26, p95: 46, maxGap: 100} : {fps: 45, p95: 31, maxGap: 100};
  const researchGatePasses = {fps: metrics.fps >= thresholds.fps, p95: metrics.p95 <= thresholds.p95, maxGap: metrics.maxGap < thresholds.maxGap};
  return {kind, lowPower, geometryStartMs: start, geometryEndMs: end, geometryTimesMs,
    pageMarks: {startName: `mark-${kind}-start`, endName: `mark-${kind}-end`, startMs: start + 1, endMs: end + 1},
    trace: {start, end, native, app, nativeColumns, appColumns, createdPolicyCount: 1,
      visibility: {start: 'visible', end: 'visible'}},
    metrics, gateThresholds: thresholds, researchGatePasses, researchOnly: true};
}

function makeRecord(item, sourceVariant = 'windows') {
  const profiled = item.condition.endsWith('-profiled');
  const hidden = item.condition.startsWith('world-hidden-');
  const profile = profiled ? {
    profile: {version: 34, startTimeMs: 0, intervalMs: 1, profilingStartTimeMs: 0, profilingEndTimeMs: 4000,
      configurationFeatures: ['js', 'stackwalk']},
    categories: [{name: 'JavaScript', subcategories: ['Other']}],
    windows: ['low', 'normal'].map(kind => ({kind, thresholdMs: kind === 'low' ? 46 : 31,
      outlierGapCount: 1, selectedGapCount: 1, gaps: [{gapIndex: 0, gapMs: 80,
        categoryCounts: {'JavaScript/Other': 2}, cpuDeltaSumRaw: 4, cpuDeltaCount: 2,
        sampleCount: 2, sourceSamplesTruncated: 0, markerCount: 1, markersTruncated: 0,
        markers: [{label: 'Reflow', type: 'Reflow', phase: 1, startMs: 120, endMs: 130}]}
      ]}))
  } : null;
  return seal({schemaVersion: 1, kind: 'firefox-stall', provenance: {...provenance,
    platform: sourceVariant === 'windows' ? 'win32' : 'linux', arch: sourceVariant === 'windows' ? 'x64' : 'arm64'},
  context: {condition: item.condition, round: item.round, position: item.position, globalIndex: item.globalIndex,
    hidden, profilerEnabled: profiled,
    profiler: profiled ? {features: 'js,leaf,stackwalk', intervalMs: 1, entries: 2000000, filter: 'GeckoMain', shutdownFilename: 'profile.json'} : null,
    browser: 'firefox', browserVersion: sourceVariant === 'windows' ? '151.0' : '152.0',
    viewport, dpr: 1, headless: true, form: 'hosted', modeEntry: 'low-to-normal'},
  data: {windows: [makeWindow('low'), makeWindow('normal')], profile,
    rawProfileSha256: profiled ? '4'.repeat(64) : null, errors: []}});
}

function writeJSONL(directory, name, records) {
  const filename = path.join(directory, name);
  fs.writeFileSync(filename, records.map(record => JSON.stringify(record)).join('\n') + '\n', 'utf8');
  return filename;
}

const schedule = expectedSchedule();
assert.equal(schedule.length, 16);
assert.deepEqual(schedule.map(({globalIndex}) => globalIndex), Array.from({length: 16}, (_, index) => index));
const allRecords = schedule.map(item => makeRecord(item));
const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'firefox-stall-analysis-'));
try {
  const completePath = writeJSONL(directory, 'complete.jsonl', allRecords);
  const complete = analyzeFiles([completePath]);
  assert.equal(complete.status, 'valid');
  assert.equal(complete.totals.records, 16);
  assert.equal(complete.totals.completeGroups, 1);
  assert.equal(complete.totals.validCases, 16);
  assert.equal(complete.groups[0].conditionModes['full-profiled'].runCount, 4);
  assert.equal(complete.groups[0].conditionModes['full-profiled'].runs[0].windows.low.geometryP95Ms, 20,
    'p95 uses floor(length * .95) over exactly 20 sorted gaps');
  assert.equal(complete.groups[0].conditionModes['full-profiled'].runs[0].windows.low.profileWindow.gaps[0].categoryCounts['JavaScript/Other'], 2,
    'profile category counts are reported as facts without classification');
  assert.deepEqual(complete.groups[0].conditionModes['full-profiled'].runs[0].profiler.missingRequestedFeatures, ['leaf'],
    'unsupported requested profiler features remain visible without invalidating actual core features');
  assert.equal(complete.groups[0].conditionModes['full-profiled'].runs[0].profiler.actualIntervalMs, 1);
  assert.equal(complete.groups[0].conditionModes['full-unprofiled'].runs[0].windows.normal.metrics.researchGatePasses.fps, false,
    'research gate failures remain observations rather than validation errors');

  const missingPath = writeJSONL(directory, 'missing.jsonl', allRecords.slice(1));
  const missing = analyzeFiles([missingPath]);
  assert.equal(missing.status, 'invalid');
  assert.equal(missing.groups[0].status, 'incomplete');
  assert.equal(missing.groups[0].missingKeys.length, 1);

  const duplicatePath = writeJSONL(directory, 'duplicate.jsonl', [...allRecords.slice(0, 15), allRecords[0]]);
  const duplicate = analyzeFiles([duplicatePath]);
  assert.equal(duplicate.groups[0].status, 'incomplete');
  assert.ok(duplicate.groups[0].duplicateCount > 0);
  assert.ok(duplicate.groups[0].missingKeys.length > 0);

  const badHash = {...allRecords[0], context: {...allRecords[0].context, round: 99}};
  const badHashPath = writeJSONL(directory, 'bad-hash.jsonl', [badHash, ...allRecords.slice(1)]);
  assert.ok(analyzeFiles([badHashPath]).validationErrors.some(error => /canonical trace hash mismatch/.test(error.message)));

  const wrongProfiler = allRecords.map(record => structuredClone(record));
  wrongProfiler[0].context.profilerEnabled = false;
  seal(wrongProfiler[0]);
  const profilerPath = writeJSONL(directory, 'wrong-profiler.jsonl', wrongProfiler);
  assert.ok(analyzeFiles([profilerPath]).validationErrors.some(error => /profilerEnabled does not match/.test(error.message)));
  const unprofiledWithData = allRecords.map(record => structuredClone(record));
  const unprofiledIndex = unprofiledWithData.findIndex(record => record.context.condition.endsWith('-unprofiled'));
  unprofiledWithData[unprofiledIndex].data.profile = {profile: {version: 34}};
  seal(unprofiledWithData[unprofiledIndex]);
  const unprofiledPath = writeJSONL(directory, 'unprofiled-data.jsonl', unprofiledWithData);
  assert.ok(analyzeFiles([unprofiledPath]).validationErrors.some(error => /unprofiled case must have profile:null/.test(error.message)));

  const badMetric = allRecords.map(record => structuredClone(record));
  badMetric[0].data.windows[0].metrics.p95 += 1e-6;
  seal(badMetric[0]);
  const metricPath = writeJSONL(directory, 'metric-mismatch.jsonl', badMetric);
  assert.ok(analyzeFiles([metricPath]).validationErrors.some(error => /metrics.p95 differs/.test(error.message)));

  const tiedTimes = allRecords.map(record => structuredClone(record));
  const tiedWindow = tiedTimes[0].data.windows[0];
  tiedWindow.geometryTimesMs[2] = tiedWindow.geometryTimesMs[1];
  tiedWindow.trace.native[1][0] = tiedWindow.trace.native[0][0];
  tiedWindow.trace.native[1][1] = tiedWindow.trace.native[0][1];
  tiedWindow.trace.app[1][1] = tiedWindow.trace.app[0][1];
  tiedWindow.trace.app[1][2] = tiedWindow.trace.app[0][2];
  seal(tiedTimes[0]);
  const tiesPath = writeJSONL(directory, 'ties.jsonl', tiedTimes);
  const ties = analyzeFiles([tiesPath]);
  assert.equal(ties.status, 'valid', 'equal geometry and trace timestamps are allowed quantization/sync observations');
  const tieWindow = ties.groups[0].conditionModes['full-profiled'].runs[0].windows.low;
  assert.ok(tieWindow.warningDisposition.nonfatalQuantization.length >= 3);
  assert.equal(tieWindow.warningDisposition.fatal.length, 0);

  const sampleErrors = allRecords.map(record => structuredClone(record));
  sampleErrors[0].data.errors = ['fixture sampler error'];
  seal(sampleErrors[0]);
  const sampleErrorPath = writeJSONL(directory, 'sample-errors.jsonl', sampleErrors);
  const sampleErrorReport = analyzeFiles([sampleErrorPath]);
  assert.ok(sampleErrorReport.validationErrors.some(error => /case retained 1 error/.test(error.message)));
  assert.equal(sampleErrorReport.totals.errorCases, 1);

  const linuxRecords = schedule.map(item => makeRecord(item, 'linux'));
  const linuxPath = writeJSONL(directory, 'linux.jsonl', linuxRecords);
  const mixed = analyzeFiles([completePath, linuxPath]);
  assert.equal(mixed.status, 'valid');
  assert.equal(mixed.groups.length, 2, 'source platform/architecture/browser version differences stay in separate groups');
  assert.ok(mixed.groups.every(group => group.status === 'complete'));

  const split = analyzeFiles([writeJSONL(directory, 'mixed-part-a.jsonl', allRecords.slice(0, 8)),
    writeJSONL(directory, 'mixed-part-b.jsonl', linuxRecords.slice(8))]);
  assert.equal(split.groups.length, 2);
  assert.ok(split.groups.every(group => group.status === 'incomplete'), 'partial sources cannot fill another provenance group');
} finally { fs.rmSync(directory, {recursive: true, force: true}); }

console.log('PASS Firefox stall analysis: complete 16-key groups, source separation, hashes, profiler pairing, exact metrics and retained sample errors.');
