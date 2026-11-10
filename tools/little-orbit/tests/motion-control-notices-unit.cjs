// SPDX-License-Identifier: LicenseRef-Simpli-Noncommercial-1.0
// Copyright (C) 2026 ilamgumaran and contributors
'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const {createHash} = require('node:crypto');
const {gzipSync} = require('node:zlib');
const {makeRecord} = require('./motion-control-plan.cjs');
const {emitBatch, recoverAnnotations, parseAnnotations, recoverFile} = require('./motion-control-notices.cjs');

const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const provenance = {gitSHA: 'a'.repeat(40), node: 'v24.19.0', platform: 'linux', arch: 'x64',
  helperDigest: '1'.repeat(64), diagnosticDigest: '2'.repeat(64), planDigest: '3'.repeat(64)};
function records() {
  return Array.from({length: 4}, (_, sample) => {
    const native = Array.from({length: 128}, (_, index) => [index * 16.6667 + sample, index * 16.667 + sample]);
    const app = Array.from({length: 62}, (_, index) => [sample + 1, index * 33.333 + sample, index * 33.34 + sample, false, index % 2 === 0]);
    const geometryTimes = Array.from({length: 63}, (_, index) => index * 33.2 + sample);
    return makeRecord(provenance, {group: 'macOS profilé 🌲', condition: ['blank', 'full', 'static-hidden', 'world-hidden'][sample],
      round: 0, position: sample, viewport: {width: 854, height: 480}, dpr: 1, lowPower: false,
      modeEntry: 'direct-normal', browser: 'chromium', browserVersion: '151.0', view: 'dashboard', channel: 'default', headless: true},
    {start: 0, end: 2100, native, app, geometryTimes, geometryStart: 0, geometryEnd: 2100,
      nativeColumns: ['timestamp', 'performance.now'], appColumns: ['policyID', 'at', 'performanceAtEntry', 'lowPower', 'accepted'],
      createdPolicyCount: 1, visibility: {start: 'visible', end: 'visible'}, summaries: {}, errors: []});
  });
}
function noticeParts(lines) {
  return lines.map(line => {
    const match = line.match(/^::notice title=(.*?)::([\s\S]*)$/);
    assert.ok(match);
    return {title: match[1], message: match[2]};
  });
}
function directNotices(batchValue, titleID = null) {
  const bytes = Buffer.from(JSON.stringify(batchValue));
  const batchID = titleID || sha(bytes);
  const encoded = gzipSync(bytes, {level: 9}).toString('base64');
  const chunks = encoded.match(/[\s\S]{1,2400}/g) || [''];
  return chunks.map((payload, index) => ({title: `Motion controls gzip ${batchID} ${index + 1}/${chunks.length}`, message: payload}));
}

const original = records();
const emitted = [];
const metadata = emitBatch(original, {size: 2400, write: line => emitted.push(line)});
assert.throws(() => emitBatch(original.slice(1), {write: () => {}}), /exactly four/);
assert.throws(() => emitBatch(original, {size: 2399, write: () => {}}), /multiple of 4/);
assert.ok(metadata.parts <= 10);
assert.equal(emitted.length, metadata.parts);
for (const line of emitted) assert.ok(line.match(/^::notice title=.*?::([\s\S]*)$/)[1].length <= 2400);
const annotations = noticeParts(emitted);
assert.ok(annotations.every(item => /^[A-Za-z0-9+/=]+$/.test(item.message)));
const recovered = recoverAnnotations([...annotations, annotations[0]]);
assert.deepEqual(recovered.records, original);
assert.equal(recovered.batchCount, 1);
assert.deepEqual(recovered.batchIDs, [metadata.batchID]);

assert.throws(() => recoverAnnotations(annotations.slice(1)), /incomplete|missing part/);
if (annotations.length > 1) {
  const conflict = {...annotations[0], message: annotations[1].message};
  assert.throws(() => recoverAnnotations([...annotations, conflict]), /conflicting duplicate/);
}
const badGzip = annotations.map(item => ({...item}));
const gzipBytes = Buffer.from(badGzip[0].message, 'base64');
gzipBytes[0] ^= 0xff;
badGzip[0].message = gzipBytes.toString('base64');
assert.throws(() => recoverAnnotations(badGzip), /gzip payload|SHA-256/);
const badHash = annotations.map(item => ({...item, title: item.title.replace(metadata.batchID, 'f'.repeat(64))}));
assert.throws(() => recoverAnnotations(badHash), /SHA-256 mismatch/);

const brokenRecord = {...original[1], traceID: '0'.repeat(64)};
assert.throws(() => recoverAnnotations(directNotices({schemaVersion: 1, kind: 'motion-control-batch', records: [original[0], brokenRecord, original[2], original[3]]})), /canonical trace hash mismatch/);
assert.throws(() => recoverAnnotations(annotations.map(item => ({...item, message: item.message + '!'}))), /strict base64/);

const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'motion-control-notices-'));
const input = path.join(directory, 'annotations.jsonl'), output = path.join(directory, 'recovered.jsonl');
fs.writeFileSync(input, `${JSON.stringify(annotations[0])}\n${annotations.slice(1).map(JSON.stringify).join('\n')}\n`);
const parsedLines = parseAnnotations(fs.readFileSync(input, 'utf8'));
assert.equal(parsedLines.length, annotations.length);
const summary = recoverFile(input, output);
assert.equal(summary.records, 4);
assert.equal(fs.readFileSync(output, 'utf8').trim().split('\n').length, 4);
fs.writeFileSync(input, JSON.stringify(annotations));
assert.equal(parseAnnotations(fs.readFileSync(input, 'utf8')).length, annotations.length);
const untouched = path.join(directory, 'untouched.jsonl');
fs.writeFileSync(untouched, 'sentinel');
fs.writeFileSync(input, JSON.stringify(annotations.slice(1)));
assert.throws(() => recoverFile(input, untouched), /incomplete|missing part/);
assert.equal(fs.readFileSync(untouched, 'utf8'), 'sentinel', 'failed recovery never writes partial output');
fs.rmSync(directory, {recursive: true, force: true});

console.log(`PASS compressed motion notices: ${metadata.parts} parts, ${metadata.uncompressedBytes} raw bytes, exact four-record recovery.`);
