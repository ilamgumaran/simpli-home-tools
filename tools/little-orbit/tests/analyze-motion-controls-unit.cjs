// SPDX-License-Identifier: LicenseRef-Simpli-Noncommercial-1.0
// Copyright (C) 2026 ilamgumaran and contributors
'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const {spawnSync} = require('node:child_process');
const {makeSchedule, makeRecord, summarize} = require('./motion-control-plan.cjs');
const {analyzeRecords, recompute, quantile95, validateRecord} = require('./analyze-motion-controls.cjs');

const provenance = {gitSHA: 'a'.repeat(40), node: 'v24.19.0', platform: 'linux', arch: 'x64',
  helperDigest: '1'.repeat(64), diagnosticDigest: '2'.repeat(64), planDigest: '3'.repeat(64)};
const profile = {id: 'linux-chromium-immersive-normal', platform: 'linux', browser: 'chromium', view: 'immersive'};
const dataFor = (roundOffset, condition) => {
  const native = [[0, 0]];
  for (let gap = 1; gap <= 20; gap++) native.push([native.at(-1)[0] + gap, native.at(-1)[1] + gap + 1]);
  const blank = condition === 'blank';
  const app = blank ? [] : Array.from({length: 21}, (_, index) => [4, index * 10, index * 10 + .5, false, index % 2 === 0]);
  const geometryTimes = blank ? null : Array.from({length: 21}, (_, index) => index * 12 + roundOffset);
  const data = {start: 0, end: 1000, native, app, geometryTimes, geometryStart: blank ? null : 0, geometryEnd: blank ? null : 1000,
    nativeColumns: ['timestamp', 'performance.now'],
    appColumns: ['policyID', 'at', 'performanceAtEntry', 'lowPower', 'accepted'],
    createdPolicyCount: 1, visibility: {start: 'visible', end: 'visible'}, errors: []};
  data.summaries = summarize(data);
  return data;
};
const contextFor = item => ({group: profile.id, condition: item.condition, round: item.round, position: item.position,
  viewport: {width: 1280, height: 720}, dpr: 2, lowPower: false, modeEntry: 'direct-normal',
  browser: 'chromium', browserVersion: '151.0.7922.34', view: 'immersive', channel: 'default', headless: true});
const completeBatch = (platform = 'linux', arch = 'x64', group = profile.id, repeats = 4) => {
  const items = makeSchedule({profiles: [profile], repeats, round: null});
  return items.map(item => {
    const p = {...provenance, platform, arch};
    const context = {...contextFor(item), group};
    return {record: makeRecord(p, context, dataFor(item.round, item.condition)), source: 'fixture.jsonl', line: item.round * 4 + item.position + 1};
  });
};
const reportFor = records => analyzeRecords(records, [], ['fixture.jsonl']);

const valid = completeBatch();
const report = reportFor(valid);
assert.equal(report.validationErrors.length, 0, JSON.stringify(report.validationErrors));
assert.equal(report.groups.length, 1);
assert.equal(report.groups[0].completeness.expectedRecords, 16);
assert.equal(report.groups[0].completeness.presentRecords, 16);
assert.equal(report.groups[0].conditions.full.usableSamples, 4);
assert.equal(report.groups[0].conditions.full.nativeNominal.p95.median, 20, '20 gaps select sorted index floor(0.95*20)');
assert.equal(report.groups[0].conditions.full.nativeActual.p95.median, 21);
assert.equal(quantile95(Array.from({length: 20}, (_, index) => index + 1)), 20);
assert.equal(recompute(valid[0].record.data).native.p95, 20);
assert.equal(report.groups[0].conditions.full.acceptedAppNominal.fps.n, 4);
assert.equal(report.groups[0].conditions.full.acceptedAppNominal.fps.median, 11, 'accepted app FPS counts only accepted tuples');
assert.equal(report.groups[0].conditions.full.geometryObservations.observationsPerSecond.n, 4);
assert.equal(report.groups[0].conditions.blank.acceptedAppNominal.fps.n, 0, 'blank has no invented app cadence');
assert.ok(Object.hasOwn(report.groups[0].pairedRounds[0], 'fullMinusBlankNativeActualP95Ms'));

const eight = reportFor(completeBatch('linux', 'x64', profile.id, 8));
assert.equal(eight.validationErrors.length, 0, JSON.stringify(eight.validationErrors));
assert.equal(eight.groups[0].completeness.expectedRepeats, 8);
assert.equal(eight.groups[0].completeness.expectedRecords, 32);

const missing = completeBatch().filter((_, index) => index !== 0);
const missingReport = reportFor(missing);
assert.ok(missingReport.validationErrors.some(error => error.includes('incomplete group')));
assert.equal(missingReport.groups[0].completeness.missingKeys.length, 1);

const duplicate = completeBatch();
duplicate.push({...duplicate[0], line: 99});
assert.ok(reportFor(duplicate).validationErrors.some(error => error.includes('duplicate group keys')));

const badSummary = completeBatch();
const first = badSummary[0].record;
const changed = {...first.data, summaries: {...first.data.summaries, native: {...first.data.summaries.native, p95: 999}}};
badSummary[0] = {...badSummary[0], record: makeRecord(first.provenance, first.context, changed)};
assert.ok(reportFor(badSummary).validationErrors.some(error => error.includes('data.summaries.native.p95 differs')));

const badHash = completeBatch();
badHash[0] = {...badHash[0], record: {...badHash[0].record, traceID: 'f'.repeat(64)}};
assert.ok(reportFor(badHash).validationErrors.some(error => error.includes('traceID hash mismatch')));

const separateRunner = [...completeBatch('darwin', 'arm64', 'macos-chromium-dashboard-low')];
const macIntel = [...completeBatch('darwin', 'x64', 'macos-chromium-dashboard-low')];
const combined = reportFor([...completeBatch(), ...separateRunner, ...macIntel]);
assert.equal(combined.groups.length, 3, 'platform and Mac architecture remain separate groups');
assert.deepEqual(new Set(combined.groups.map(group => `${group.identity.platform}/${group.identity.arch}`)), new Set(['linux/x64', 'darwin/arm64', 'darwin/x64']));

const differentNode = completeBatch().map(sample => ({...sample, record: makeRecord({...sample.record.provenance, node: 'v22.23.4'}, sample.record.context, sample.record.data)}));
assert.equal(reportFor([...completeBatch(), ...differentNode]).groups.length, 2, 'Node versions stay separate');
const precisionSample = completeBatch()[0].record;
const precisionData = JSON.parse(JSON.stringify(precisionSample.data));
precisionData.native[1][1] = precisionData.native[0][1];
precisionData.summaries = summarize(precisionData);
const precisionRecord = makeRecord(precisionSample.provenance, precisionSample.context, precisionData);
assert.equal(validateRecord(precisionRecord, 'precision', 1).errors.length, 0, 'Quantized callback entry clocks can tie');
precisionData.native[0][0] = -1;
const negativeRecord = makeRecord(precisionSample.provenance, precisionSample.context, precisionData);
assert.ok(validateRecord(negativeRecord, 'negative', 1).errors.some(error => error.includes('negative timestamp')));

const errored = completeBatch();
const failed = errored[0].record;
const errorData = {...failed.data, errors: ['sample browser error']};
errored[0] = {...errored[0], record: makeRecord(failed.provenance, failed.context, errorData)};
const errorReport = reportFor(errored);
assert.equal(errorReport.sampleErrors.length, 1);
assert.equal(errorReport.groups[0].completeness.presentRecords, 16, 'errored samples stay in the report');
assert.equal(errorReport.groups[0].conditions.blank.errors, 1);
assert.equal(errorReport.groups[0].conditions.blank.usableSamples, 3);
assert.ok(errorReport.validationErrors.some(error => error.includes('sample recorded error')));

const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'motion-control-analysis-'));
const input = path.join(directory, 'mixed.jsonl');
fs.writeFileSync(input, `${JSON.stringify(valid[0].record)}\nnot-json\n`);
const cli = spawnSync(process.execPath, [path.join(__dirname, 'analyze-motion-controls.cjs'), input], {encoding: 'utf8'});
assert.equal(cli.status, 1);
const cliReport = JSON.parse(cli.stdout);
assert.equal(cliReport.totalRecords, 1);
assert.ok(cliReport.validationErrors.some(error => error.includes('malformed JSON')));
fs.rmSync(directory, {recursive: true, force: true});

console.log('PASS motion control analyzer: schema/hash, completeness, paired summaries, grouping, errors and quantiles.');
