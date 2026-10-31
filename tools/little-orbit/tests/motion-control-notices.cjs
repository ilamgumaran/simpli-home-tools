// SPDX-License-Identifier: LicenseRef-Simpli-Noncommercial-1.0
// Copyright (C) 2026 ilamgumaran and contributors
'use strict';

const fs = require('node:fs');
const {createHash} = require('node:crypto');
const {gzipSync, gunzipSync} = require('node:zlib');
const {makeRecord} = require('./motion-control-plan.cjs');

const TITLE = /^Motion controls gzip ([0-9a-f]{64}) ([1-9]\d*)\/([1-9]\d*)$/;
const MAX_PARTS = 10;
const MAX_CHUNK_SIZE = 2400;
const MAX_BATCH_BYTES = 2 * 1024 * 1024;
const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');
const stableJSON = value => Array.isArray(value) ? `[${value.map(stableJSON).join(',')}]`
  : value && typeof value === 'object' ? `{${Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${stableJSON(value[key])}`).join(',')}}`
    : JSON.stringify(value);

function validateRecord(record, batchID, index) {
  if (!record || record.schemaVersion !== 1 || record.kind !== 'motion-control') throw new Error(`batch ${batchID} record ${index} has an unsupported schema`);
  if (typeof record.traceID !== 'string' || !/^[0-9a-f]{64}$/.test(record.traceID)) throw new Error(`batch ${batchID} record ${index} has an invalid traceID`);
  let rebuilt;
  try { rebuilt = makeRecord(record.provenance, record.context, record.data); }
  catch (error) { throw new Error(`batch ${batchID} record ${index} cannot be canonically hashed: ${error.message}`); }
  if (rebuilt.traceID !== record.traceID || stableJSON(rebuilt) !== stableJSON(record)) throw new Error(`batch ${batchID} record ${index} canonical trace hash mismatch`);
}

function emitBatch(records, options = {}) {
  if (!Array.isArray(records) || records.length !== 4) throw new Error('motion control batches must contain exactly four records');
  records.forEach((record, index) => validateRecord(record, 'pending', index + 1));
  const bytes = Buffer.from(JSON.stringify({schemaVersion: 1, kind: 'motion-control-batch', records}), 'utf8');
  if (bytes.length > MAX_BATCH_BYTES) throw new Error(`batch exceeds ${MAX_BATCH_BYTES} uncompressed bytes`);
  const batchID = sha256(bytes);
  const encoded = gzipSync(bytes, {level: 9}).toString('base64');
  const chunkSize = options.size ?? options.chunkSize ?? MAX_CHUNK_SIZE;
  if (!Number.isInteger(chunkSize) || chunkSize < 4 || chunkSize > MAX_CHUNK_SIZE || chunkSize % 4 !== 0) throw new Error(`chunk size must be a multiple of 4 between 4 and ${MAX_CHUNK_SIZE}`);
  const chunks = encoded.match(new RegExp(`[\\s\\S]{1,${chunkSize}}`, 'g')) || [''];
  if (chunks.length > MAX_PARTS) throw new Error(`compressed batch requires ${chunks.length} notices; limit is ${MAX_PARTS}`);
  const notices = chunks.map((payload, index) => `::notice title=Motion controls gzip ${batchID} ${index + 1}/${chunks.length}::${payload}`);
  const write = options.write || (line => process.stdout.write(`${line}\n`));
  for (const notice of notices) write(notice);
  return {batchID, parts: chunks.length, uncompressedBytes: bytes.length, compressedBytes: Buffer.from(encoded, 'base64').length};
}

function annotationPair(value) {
  if (typeof value === 'string') {
    const match = value.match(/^::notice title=(.*?)::([\s\S]*)$/);
    return match ? {title: match[1], payload: match[2]} : null;
  }
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const title = value.title ?? value.annotation?.title;
  const payload = value.payload ?? value.message ?? value.body ?? value.annotation?.message;
  return typeof title === 'string' && typeof payload === 'string' ? {title, payload} : null;
}

function recoverAnnotations(annotations) {
  if (!Array.isArray(annotations)) throw new Error('annotations must be an array');
  const batches = new Map();
  for (const annotation of annotations) {
    const pair = annotationPair(annotation);
    if (!pair) continue;
    const match = pair.title.match(TITLE);
    if (!match) continue;
    const [, batchID, partText, totalText] = match;
    const part = Number(partText), total = Number(totalText);
    if (!Number.isSafeInteger(part) || !Number.isSafeInteger(total) || total > MAX_PARTS || part > total) throw new Error(`batch ${batchID} has invalid part metadata`);
    if (!/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(pair.payload)) throw new Error(`batch ${batchID} part ${part} is not strict base64`);
    const canonical = Buffer.from(pair.payload, 'base64').toString('base64');
    if (canonical !== pair.payload) throw new Error(`batch ${batchID} part ${part} has noncanonical base64`);
    if (!batches.has(batchID)) batches.set(batchID, {total, parts: new Map()});
    const batch = batches.get(batchID);
    if (batch.total !== total) throw new Error(`batch ${batchID} has conflicting part counts`);
    const existing = batch.parts.get(part);
    if (existing !== undefined && existing !== pair.payload) throw new Error(`batch ${batchID} part ${part} has conflicting duplicate payloads`);
    batch.parts.set(part, pair.payload);
  }
  if (!batches.size) throw new Error('no motion control batch notices found');

  const recovered = [], batchIDs = [];
  for (const [batchID, batch] of batches) {
    if (batch.parts.size !== batch.total) throw new Error(`batch ${batchID} is incomplete: received ${batch.parts.size} of ${batch.total} parts`);
    const chunks = [];
    for (let part = 1; part <= batch.total; part++) {
      if (!batch.parts.has(part)) throw new Error(`batch ${batchID} is missing part ${part}`);
      chunks.push(batch.parts.get(part));
    }
    let bytes;
    try { bytes = gunzipSync(Buffer.from(chunks.join(''), 'base64'), {maxOutputLength: MAX_BATCH_BYTES}); }
    catch (error) { throw new Error(`batch ${batchID} gzip payload is invalid: ${error.message}`); }
    if (sha256(bytes) !== batchID) throw new Error(`batch ${batchID} uncompressed SHA-256 mismatch`);
    let value;
    try { value = JSON.parse(bytes.toString('utf8')); }
    catch (error) { throw new Error(`batch ${batchID} JSON is invalid: ${error.message}`); }
    if (!value || value.schemaVersion !== 1 || value.kind !== 'motion-control-batch' || !Array.isArray(value.records) || value.records.length !== 4 || Object.keys(value).some(key => !['schemaVersion', 'kind', 'records'].includes(key))) {
      throw new Error(`batch ${batchID} has an unsupported batch schema`);
    }
    value.records.forEach((record, index) => validateRecord(record, batchID, index + 1));
    batchIDs.push(batchID);
    recovered.push(...value.records);
  }
  return {records: recovered, batchIDs, batchCount: batchIDs.length};
}

function parseAnnotations(text) {
  try {
    const parsed = JSON.parse(text);
    if (Array.isArray(parsed)) return parsed;
    if (parsed && Array.isArray(parsed.annotations)) return parsed.annotations;
    return [parsed];
  } catch (_) {
    return text.split(/\r?\n/).filter(line => line.trim()).map((line, index) => {
      try { return JSON.parse(line); }
      catch (error) { throw new Error(`input line ${index + 1} is invalid JSON: ${error.message}`); }
    });
  }
}

function recoverFile(inputPath, outputPath) {
  const annotations = parseAnnotations(fs.readFileSync(inputPath, 'utf8'));
  const result = recoverAnnotations(annotations);
  fs.writeFileSync(outputPath, `${result.records.map(record => JSON.stringify(record)).join('\n')}\n`, 'utf8');
  return {records: result.records.length, batches: result.batchCount, batchIDs: result.batchIDs};
}

if (require.main === module) {
  try {
    const [inputPath, outputPath, ...extra] = process.argv.slice(2);
    if (!inputPath || !outputPath || extra.length) throw new Error('usage: node tests/motion-control-notices.cjs annotations.jsonl recovered.jsonl');
    const summary = recoverFile(inputPath, outputPath);
    process.stdout.write(`Recovered ${summary.records} records from ${summary.batches} complete batch(es).\n`);
  } catch (error) {
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 1;
  }
}

module.exports = {emitBatch, recoverAnnotations, parseAnnotations, recoverFile, validateRecord};
