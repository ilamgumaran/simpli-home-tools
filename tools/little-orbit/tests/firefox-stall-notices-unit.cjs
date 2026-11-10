// SPDX-License-Identifier: LicenseRef-Simpli-Noncommercial-1.0
// Copyright (C) 2026 ilamgumaran and contributors
'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const {createHash} = require('node:crypto');
const {gzipSync} = require('node:zlib');
const {emitEvidence, recoverAnnotations, parseAnnotations, recoverFile, stableJSON, MAX_BATCH_BYTES} = require('./firefox-stall-notices.cjs');
const {readConfig, makeSchedule, conditionDetails, profiledEnvironment} = require('./diagnose-firefox-stalls.cjs');

const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const provenance = {gitSHA: 'a'.repeat(40), node: 'v24.19.0', platform: 'win32', arch: 'x64',
  captureDigest: '1'.repeat(64), traceDigest: '2'.repeat(64), profileExtractorDigest: '3'.repeat(64)};

function record(index) {
  const value = {
    schemaVersion: 1, kind: 'firefox-stall', provenance,
    context: {condition: index ? 'world-hidden-unprofiled' : 'full-profiled', round: 0, position: index,
      hidden: Boolean(index), profilerEnabled: !index, browser: 'firefox', browserVersion: 'test/β 🌲 café',
      viewport: {width: 854, height: 480}, dpr: 1, headless: true, form: 'hosted', modeEntry: 'low-to-normal'},
    data: {windows: [{kind: 'low', lowPower: true, start: 12.123456789, end: 2112.123456789,
      geometryStartMs: 12.123456789, geometryEndMs: 2112.123456789,
      geometryTimesMs: [12.125, 45.456789123, 78.789],
      pageMarks: {startName: `firefox-stall-${index}-low-start`, endName: `firefox-stall-${index}-low-end`, startMs: 12.1, endMs: 2112.2},
      trace: {start: 12.123456789, end: 2112.123456789, native: [[12.13, 12.14], [28.79, 28.81]], app: [[1, 12.13, 12.14, true, true]],
        nativeColumns: ['timestamp', 'performance.now'], appColumns: ['policyID', 'at', 'performanceAtEntry', 'lowPower', 'accepted'],
        createdPolicyCount: 1, visibility: {start: 'visible', end: 'visible'}},
      metrics: {fps: 1.5, p95: 33.3, maxGap: 33.3, frames: 3, elapsedMs: 2000},
      gateThresholds: {fps: 26, p95: 46, maxGap: 100}, researchGatePasses: {fps: false, p95: true, maxGap: true}, researchOnly: true}],
      profile: {profile: {version: 1, startTimeMs: 0, profilingStartTimeMs: 0, profilingEndTimeMs: 2400}, windows: []},
      rawProfileSha256: '4'.repeat(64), errors: []}
  };
  value.traceID = sha(stableJSON(value));
  return value;
}

function noticeParts(lines) {
  return lines.map(line => {
    const match = line.match(/^::notice title=(.*?)::([\s\S]*)$/);
    assert.ok(match);
    return {title: match[1], message: match[2]};
  });
}

function directNotices(batch, titleID = null) {
  const bytes = Buffer.from(JSON.stringify(batch));
  const id = titleID || sha(bytes);
  const encoded = gzipSync(bytes, {level: 9}).toString('base64');
  const chunks = encoded.match(/[\s\S]{1,2400}/g) || [''];
  return chunks.map((message, index) => ({title: `Firefox stalls gzip ${id} ${index + 1}/${chunks.length}`, message}));
}

const original = [record(0), record(1)];
const lines = [];
const emitted = emitEvidence(original, {write: line => lines.push(line)});
assert.equal(emitted.parts, lines.length);
assert.ok(emitted.parts <= 10);
assert.equal(emitted.batchID, sha(Buffer.from(JSON.stringify({schemaVersion: 1, kind: 'firefox-stall-batch', records: original}))));
assert.throws(() => emitEvidence(original.slice(1), {write: () => {}}), /exactly two/);
assert.throws(() => emitEvidence(original, {size: 2399, write: () => {}}), /multiple of 4/);
const oversizedRecord = {...original[1], data: {padding: 'x'.repeat(MAX_BATCH_BYTES)}};
delete oversizedRecord.traceID;
oversizedRecord.traceID = sha(stableJSON(oversizedRecord));
assert.throws(() => emitEvidence([original[0], oversizedRecord], {write: () => {}}), /uncompressed bytes/);
const annotations = noticeParts(lines);
assert.ok(annotations.every(item => item.message.length <= 2400 && /^[A-Za-z0-9+/=]+$/.test(item.message)));
const recovered = recoverAnnotations([...annotations, annotations[0]]);
assert.deepEqual(recovered.records, original);
assert.deepEqual(recovered.batchIDs, [emitted.batchID]);
assert.equal(recovered.batchCount, 1);

const manyLines = [];
emitEvidence(original, {size: 240, write: line => manyLines.push(line)});
const manyParts = noticeParts(manyLines);
assert.throws(() => recoverAnnotations(manyParts.slice(1)), /incomplete|missing part/);
if (manyParts.length > 1) {
  assert.throws(() => recoverAnnotations([...manyParts, {...manyParts[0], message: manyParts[1].message}]), /conflicting duplicate/);
  assert.throws(() => recoverAnnotations(manyParts.map(item => ({...item, message: item.message + '!'}))), /strict base64/);
  const corrupted = manyParts.map(item => ({...item}));
  const bytes = Buffer.from(corrupted[0].message, 'base64'); bytes[0] ^= 0xff;
  corrupted[0].message = bytes.toString('base64');
  assert.throws(() => recoverAnnotations(corrupted), /gzip payload|SHA-256/);
}
assert.throws(() => recoverAnnotations(annotations.map(item => ({...item, title: item.title.replace(emitted.batchID, 'f'.repeat(64))}))), /SHA-256 mismatch/);

const broken = {...original[0], traceID: '0'.repeat(64)};
assert.throws(() => recoverAnnotations(directNotices({schemaVersion: 1, kind: 'firefox-stall-batch', records: [broken, original[1]]})), /canonical trace hash mismatch/);
assert.throws(() => recoverAnnotations(directNotices({schemaVersion: 1, kind: 'firefox-stall-batch', records: [original[0]]})), /unsupported batch schema/);
assert.throws(() => recoverAnnotations(directNotices({schemaVersion: 1, kind: 'motion-control-batch', records: original})), /unsupported batch schema/);

const oversizedBatch = {schemaVersion: 1, kind: 'firefox-stall-batch', records: [original[0], {...original[1], data: {padding: '0'.repeat(MAX_BATCH_BYTES)}}]};
const oversizedAnnotations = directNotices(oversizedBatch);
assert.throws(() => recoverAnnotations(oversizedAnnotations), /gzip payload is invalid/);

const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'firefox-stall-notices-'));
try {
  const input = path.join(directory, 'annotations.jsonl'), output = path.join(directory, 'recovered.jsonl');
  fs.writeFileSync(input, `${JSON.stringify(annotations[0])}\n${annotations.slice(1).map(JSON.stringify).join('\n')}\n`);
  assert.equal(parseAnnotations(fs.readFileSync(input, 'utf8')).length, annotations.length);
  const result = recoverFile(input, output);
  assert.equal(result.records, 2);
  assert.deepEqual(fs.readFileSync(output, 'utf8').trim().split('\n').map(JSON.parse), original);
  fs.writeFileSync(input, JSON.stringify(annotations));
  assert.equal(parseAnnotations(fs.readFileSync(input, 'utf8')).length, annotations.length);
  fs.writeFileSync(output, 'sentinel');
  fs.writeFileSync(input, JSON.stringify(manyParts.slice(1)));
  assert.throws(() => recoverFile(input, output), /incomplete|missing part/);
  assert.equal(fs.readFileSync(output, 'utf8'), 'sentinel', 'recovery failure leaves prior output intact');
} finally { fs.rmSync(directory, {recursive: true, force: true}); }

assert.deepEqual(readConfig({}), {slot: null});
assert.deepEqual(readConfig({CLOCK_STALL_SLOT: '0'}), {slot: 0});
assert.deepEqual(readConfig({CLOCK_STALL_SLOT: '7'}), {slot: 7});
assert.throws(() => readConfig({CLOCK_STALL_SLOT: '8'}), /0 through 7/);
assert.throws(() => readConfig({CLOCK_STALL_SLOT: '1.5'}), /integer/);
const schedule = makeSchedule(readConfig({}));
assert.equal(schedule.length, 16);
assert.deepEqual(schedule.slice(0, 4).map(item => item.condition), ['full-profiled', 'world-hidden-profiled', 'world-hidden-unprofiled', 'full-unprofiled']);
for (let slot = 0; slot < 8; slot++) {
  const selected = makeSchedule(readConfig({CLOCK_STALL_SLOT: String(slot)}));
  assert.equal(selected.length, 2);
  assert.deepEqual(selected.map(item => item.globalIndex), [slot * 2, slot * 2 + 1]);
}
const envFixture = {PATH: 'keep', MOZ_DISABLE_CONTENT_SANDBOX: '1', MOZ_PROFILER_STARTUP: '1', moz_profiler_startup_interval: '9'};
assert.deepEqual(profiledEnvironment(false, 'unused', envFixture), {PATH: 'keep', MOZ_DISABLE_CONTENT_SANDBOX: '1'});
const enabledEnv = profiledEnvironment(true, 'test-profile.json', envFixture);
assert.equal(enabledEnv.MOZ_PROFILER_STARTUP, '1');
assert.equal(enabledEnv.MOZ_PROFILER_STARTUP_INTERVAL, '1');
assert.equal(enabledEnv.MOZ_PROFILER_SHUTDOWN, 'test-profile.json');
assert.equal(Object.hasOwn(enabledEnv, 'moz_profiler_startup_interval'), false);
const conditionsForUnit = ['full-profiled', 'world-hidden-profiled', 'full-unprofiled', 'world-hidden-unprofiled'];
assert.deepEqual(conditionsForUnit.map(conditionDetails), [
  {hidden: false, profilerEnabled: true}, {hidden: true, profilerEnabled: true},
  {hidden: false, profilerEnabled: false}, {hidden: true, profilerEnabled: false}
]);

console.log(`PASS Firefox stall evidence: ${emitted.parts} notice part(s), exact two-record recovery, schema/hash/cap and 16-case schedule checks.`);
