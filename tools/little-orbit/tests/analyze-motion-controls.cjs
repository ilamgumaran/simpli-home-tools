// SPDX-License-Identifier: LicenseRef-Simpli-Noncommercial-1.0
// Copyright (C) 2026 ilamgumaran and contributors
'use strict';

const fs = require('node:fs');
const {createHash} = require('node:crypto');
const {makeSchedule} = require('./motion-control-plan.cjs');
const CONDITIONS = ['blank', 'full', 'static-hidden', 'world-hidden'];
const NATIVE_COLUMNS = ['timestamp', 'performance.now'];
const APP_COLUMNS = ['policyID', 'at', 'performanceAtEntry', 'lowPower', 'accepted'];
const REQUIRED = {
  provenance: ['gitSHA', 'node', 'platform', 'arch', 'helperDigest', 'diagnosticDigest', 'planDigest'],
  context: ['group', 'condition', 'round', 'position', 'viewport', 'dpr', 'lowPower', 'modeEntry', 'browser', 'browserVersion', 'view', 'channel', 'headless'],
  data: ['start', 'end', 'native', 'app', 'geometryTimes', 'geometryStart', 'geometryEnd', 'nativeColumns', 'appColumns', 'createdPolicyCount', 'visibility', 'summaries', 'errors']
};
const ALLOWED = {record: ['schemaVersion', 'kind', 'provenance', 'context', 'data', 'traceID'],
  provenance: REQUIRED.provenance, context: REQUIRED.context, data: REQUIRED.data};
const finite = value => typeof value === 'number' && Number.isFinite(value);
const stableJSON = value => Array.isArray(value) ? `[${value.map(stableJSON).join(',')}]`
  : value && typeof value === 'object' ? `{${Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${stableJSON(value[key])}`).join(',')}}`
    : JSON.stringify(value);
const hash = value => createHash('sha256').update(value).digest('hex');
const delta = (a, b) => finite(a) && finite(b) ? a - b : null;

function quantile95(values) {
  if (!values.length) return null;
  const ordered = [...values].sort((a, b) => a - b);
  return ordered[Math.floor(ordered.length * 0.95)];
}

function gaps(values) { return values.slice(1).map((value, index) => value - values[index]); }
function stats(values) {
  const intervals = gaps(values);
  return {count: values.length, p95: quantile95(intervals), maxGap: intervals.length ? Math.max(...intervals) : null};
}
function recompute(data) {
  const durationMs = finite(data.start) && finite(data.end) ? data.end - data.start : null;
  const nativeNominal = stats(data.native.map(row => row[0]));
  const nativeActual = stats(data.native.map(row => row[1]));
  const app = stats(data.app.map(row => row[2]));
  const geometry = data.geometryTimes === null ? null : stats(data.geometryTimes);
  const fps = (count, elapsed) => finite(elapsed) && elapsed > 0 ? count * 1000 / elapsed : null;
  nativeNominal.fps = fps(data.native.length, durationMs);
  nativeActual.fps = fps(data.native.length, durationMs);
  app.fps = fps(data.app.length, durationMs);
  if (geometry) geometry.fps = fps(data.geometryTimes.length, durationMs);
  return {durationMs, native: nativeNominal, nativeActual, app: data.geometryTimes === null ? null : app, geometry};
}

function compareSummary(actual, expected, path, errors) {
  if (!actual || typeof actual !== 'object') { errors.push(`${path} is missing`); return; }
  for (const key of Object.keys(expected)) {
    const value = actual[key], target = expected[key], name = `${path}.${key}`;
    if (target && typeof target === 'object') compareSummary(value, target, name, errors);
    else if (target === null) {
      if (value !== null) errors.push(`${name} expected null`);
    } else if (typeof target === 'number') {
      if (!finite(value) || Math.abs(value - target) > 1e-7) errors.push(`${name} differs from raw samples`);
    } else if (value !== target) errors.push(`${name} differs from raw samples`);
  }
  for (const key of Object.keys(actual)) if (!Object.hasOwn(expected, key)) errors.push(`${path}.${key} is unexpected`);
}

function identityOf(record) {
  const c = record.context || {}, p = record.provenance || {};
  return {
    platform: p.platform ?? null, arch: p.arch ?? null, node: p.node ?? null, browser: c.browser ?? null,
    browserVersion: c.browserVersion ?? null, profile: c.group ?? null, lowPower: c.lowPower ?? null,
    view: c.view ?? null, viewport: c.viewport ?? null, dpr: c.dpr ?? null,
    channel: c.channel ?? null, headless: c.headless ?? null, modeEntry: c.modeEntry ?? null,
    gitSHA: p.gitSHA ?? null, diagnosticDigest: p.diagnosticDigest ?? null,
    planDigest: p.planDigest ?? null, helperDigest: p.helperDigest ?? null
  };
}

function validateRecord(record, source, line) {
  const errors = [], warnings = [];
  const issue = message => errors.push(`${source}:${line}: ${message}`);
  if (!record || typeof record !== 'object' || Array.isArray(record)) return {record, source, line, errors: [`${source}:${line}: record must be a JSON object`], warnings, metrics: null};
  if (record.schemaVersion !== 1 || record.kind !== 'motion-control') issue('unsupported motion-control schema');
  for (const key of Object.keys(record)) if (!ALLOWED.record.includes(key)) issue(`unexpected record field ${key}`);
  for (const [name, fields] of Object.entries(REQUIRED)) {
    const object = record[name];
    if (!object || typeof object !== 'object' || Array.isArray(object)) { issue(`${name} must be an object`); warnings.push(`${source}:${line}: partial record (${name} missing)`); continue; }
    for (const key of Object.keys(object)) if (!ALLOWED[name].includes(key)) issue(`unexpected ${name} field ${key}`);
    for (const field of fields) if (!Object.hasOwn(object, field)) {
      issue(`missing ${name}.${field}`);
      warnings.push(`${source}:${line}: partial record (missing ${name}.${field})`);
    }
  }
  if (typeof record.traceID !== 'string' || !/^[0-9a-f]{64}$/.test(record.traceID)) issue('traceID must be a SHA-256 hex digest');
  else { const copy = {...record}; delete copy.traceID; if (hash(stableJSON(copy)) !== record.traceID) issue('traceID hash mismatch'); }
  const p = record.provenance || {}, c = record.context || {}, d = record.data || {};
  for (const key of ['gitSHA', 'node', 'platform', 'arch']) if (typeof p[key] !== 'string' || !p[key]) issue(`provenance.${key} must be a nonempty string`);
  for (const key of ['helperDigest', 'diagnosticDigest', 'planDigest']) if (typeof p[key] !== 'string' || !/^[0-9a-f]{64}$/.test(p[key])) issue(`provenance.${key} must be a SHA-256 hex digest`);
  for (const key of ['group', 'browser', 'browserVersion', 'view', 'channel']) if (typeof c[key] !== 'string' || !c[key]) issue(`context.${key} must be a nonempty string`);
  if (!CONDITIONS.includes(c.condition)) issue('context.condition is invalid');
  if (!Number.isInteger(c.round) || c.round < 0 || c.round > 7) issue('context.round must be an integer from 0 through 7');
  if (!Number.isInteger(c.position) || c.position < 0 || c.position > 3) issue('context.position must be an integer from 0 through 3');
  if (typeof c.lowPower !== 'boolean' || typeof c.headless !== 'boolean') issue('context lowPower and headless must be booleans');
  if (!finite(c.dpr) || c.dpr <= 0) issue('context.dpr must be positive and finite');
  if (!c.viewport || !Number.isInteger(c.viewport.width) || !Number.isInteger(c.viewport.height)) issue('context.viewport must contain integer width and height');
  else if (c.viewport.width <= 0 || c.viewport.height <= 0 || Object.keys(c.viewport).some(key => !['width', 'height'].includes(key))) issue('context.viewport must contain only positive width and height');
  if (!['direct-normal', 'direct-low-power'].includes(c.modeEntry)) issue('context.modeEntry is invalid');
  else if (c.modeEntry !== (c.lowPower ? 'direct-low-power' : 'direct-normal')) issue('context.modeEntry disagrees with lowPower');
  if (!Array.isArray(d.nativeColumns) || stableJSON(d.nativeColumns) !== stableJSON(NATIVE_COLUMNS)) issue('data.nativeColumns has an unexpected shape');
  if (!Array.isArray(d.appColumns) || stableJSON(d.appColumns) !== stableJSON(APP_COLUMNS)) issue('data.appColumns has an unexpected shape');
  if (!Array.isArray(d.native)) issue('data.native must be an array');
  else d.native.forEach((row, index) => {
    if (Array.isArray(row) && row.some(value => finite(value) && value < 0)) issue(`data.native[${index}] contains a negative timestamp`);
    if (!Array.isArray(row) || row.length !== 2 || !row.every(finite)) issue(`data.native[${index}] must be a finite 2-tuple`);
  });
  if (!Array.isArray(d.app)) issue('data.app must be an array');
  else d.app.forEach((row, index) => {
    if (!Array.isArray(row) || row.length !== 5 || !finite(row[0]) || !finite(row[1]) || !finite(row[2]) || typeof row[3] !== 'boolean' || typeof row[4] !== 'boolean') issue(`data.app[${index}] must match the finite app 5-tuple schema`);
    else if (!Number.isSafeInteger(row[0]) || row[0] < 1 || row[1] < 0 || row[2] < 0) issue(`data.app[${index}] has an invalid policy ID or negative timestamp`);
    else if (row[3] !== c.lowPower) issue(`data.app[${index}] lowPower disagrees with context`);
  });
  if (d.geometryTimes !== null && !Array.isArray(d.geometryTimes)) issue('data.geometryTimes must be an array or null');
  if (Array.isArray(d.geometryTimes)) d.geometryTimes.forEach((value, index) => { if (!finite(value) || value < 0) issue(`data.geometryTimes[${index}] must be finite and nonnegative`); });
  if (Array.isArray(d.native)) for (const column of [0, 1]) for (let i = 1; i < d.native.length; i++) if (finite(d.native[i - 1]?.[column]) && finite(d.native[i]?.[column]) && (column === 0 ? d.native[i][column] <= d.native[i - 1][column] : d.native[i][column] < d.native[i - 1][column])) issue(`data.native timestamps are not strictly increasing in column ${column}`);
  if (Array.isArray(d.app)) {
    let previousEntry = -Infinity; const policyAt = new Map();
    for (const row of d.app) if (Array.isArray(row) && row.length === 5 && row.slice(0, 3).every(finite)) {
      if (row[2] < previousEntry) issue('data.app entry timestamps move backward');
      previousEntry = row[2];
      if (row[1] < (policyAt.get(row[0]) ?? -Infinity)) issue(`data.app policy ${row[0]} timestamps move backward`);
      policyAt.set(row[0], row[1]);
    }
  }
  if (Array.isArray(d.geometryTimes)) for (let i = 1; i < d.geometryTimes.length; i++) if (finite(d.geometryTimes[i - 1]) && finite(d.geometryTimes[i]) && d.geometryTimes[i] < d.geometryTimes[i - 1]) issue('data.geometryTimes are not sorted');
  if (!Array.isArray(d.errors) || d.errors.some(message => typeof message !== 'string')) issue('data.errors must be an array of strings');
  if (Array.isArray(d.errors) && d.errors.length) issue(`sample recorded error: ${d.errors.join(' | ')}`);
  if (!Number.isInteger(d.createdPolicyCount) || d.createdPolicyCount < 1) issue('data.createdPolicyCount must be a positive integer');
  if (!d.visibility || typeof d.visibility !== 'object' || typeof d.visibility.start !== 'string' || typeof d.visibility.end !== 'string' || Object.keys(d.visibility || {}).some(key => !['start', 'end'].includes(key))) issue('data.visibility must contain only start and end strings');
  if (d.visibility && (d.visibility.start !== 'visible' || d.visibility.end !== 'visible')) issue('sample was not continuously visible at its endpoints');
  if (d.start === null && d.end === null) {
    if (!Array.isArray(d.errors) || !d.errors.length) issue('null sample endpoints require a sample error');
  } else if (!finite(d.start) || !finite(d.end) || d.end <= d.start || d.start < 0) issue('sample endpoints must be finite and increasing');
  if (c.condition === 'blank') {
    if (d.geometryTimes !== null || d.app?.length !== 0 || d.geometryStart !== null || d.geometryEnd !== null) issue('blank control must retain native callbacks only');
  } else if (finite(d.start) && finite(d.end)) {
    if (!finite(d.geometryStart) || !finite(d.geometryEnd) || Math.abs(d.geometryStart - d.start) > 1e-7 || Math.abs(d.geometryEnd - d.end) > 1e-7) issue('geometry interval must match sample endpoints');
  }
  let metrics = null;
  const validNative = Array.isArray(d.native) && d.native.every(row => Array.isArray(row) && row.length === 2 && row.every(finite));
  const validApp = Array.isArray(d.app) && d.app.every(row => Array.isArray(row) && row.length === 5 && row.slice(0, 3).every(finite));
  const validGeometry = d.geometryTimes === null || Array.isArray(d.geometryTimes) && d.geometryTimes.every(finite);
  if (validNative && validApp && validGeometry && finite(d.start) && finite(d.end) && d.end > d.start) {
    metrics = recompute(d);
    if (d.summaries !== null) {
      compareSummary(d.summaries, {...metrics}, 'data.summaries', errors);
    } else if (!Array.isArray(d.errors) || !d.errors.length) issue('successful sample is missing summaries');
  } else {
    if (d.summaries !== null && d.summaries !== undefined) issue('incomplete sample must not claim summaries');
    warnings.push(`${source}:${line}: partial record cannot be recomputed from raw arrays`);
  }
  if (Array.isArray(d.native) && !d.native.length || Array.isArray(d.app) && c.condition !== 'blank' && !d.app.length || Array.isArray(d.geometryTimes) && !d.geometryTimes.length) warnings.push(`${source}:${line}: partial trace has an empty sample array`);
  return {record, source, line, errors, warnings, metrics, duplicate: false};
}

function rangeMedian(values) {
  const sorted = values.filter(finite).sort((a, b) => a - b);
  if (!sorted.length) return {n: 0, min: null, median: null, max: null};
  const middle = Math.floor(sorted.length / 2);
  return {n: sorted.length, min: sorted[0], median: sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2, max: sorted.at(-1)};
}
function metricSet(samples, getter) {
  return Object.fromEntries(['fps', 'p95', 'maxGap'].map(metric => [metric, rangeMedian(samples.map(sample => getter(sample, metric)))]));
}
function usable(sample) { return sample?.errors?.length === 0 && sample.record?.data?.errors?.length === 0 && sample.metrics && !sample.duplicate; }

function summarizeGroup(group) {
  const records = group.records, roundsSeen = records.map(s => s.record?.context?.round).filter(Number.isInteger);
  const repeats = roundsSeen.some(round => round >= 4) ? 8 : 4;
  const keys = new Map(), duplicateKeys = [], roundPositions = new Map();
  for (const sample of records) {
    const c = sample.record?.context || {};
    if (!CONDITIONS.includes(c.condition) || !Number.isInteger(c.round) || !Number.isInteger(c.position)) continue;
    const key = `${c.condition}|${c.round}|${c.position}`;
    if (keys.has(key)) { sample.duplicate = true; duplicateKeys.push(key); }
    else keys.set(key, sample);
    const rp = `${c.round}|${c.position}`;
    roundPositions.set(rp, (roundPositions.get(rp) || 0) + 1);
  }
  const planned = makeSchedule({profiles: [{}], repeats, round: null});
  const expectedKeys = planned.map(item => `${item.condition}|${item.round}|${item.position}`);
  const missingKeys = expectedKeys.filter(key => !keys.has(key));
  const errors = [];
  if (missingKeys.length) errors.push(`incomplete group: ${missingKeys.length} of ${repeats * 4} planned condition/round/position keys missing`);
  if (duplicateKeys.length) errors.push(`duplicate group keys: ${duplicateKeys.length}`);
  for (let round = 0; round < repeats; round++) for (let position = 0; position < 4; position++) {
    if (roundPositions.get(`${round}|${position}`) !== 1) errors.push(`round ${round} position ${position} must occur exactly once`);
  }
  for (let base = 0; base < repeats; base += 4) for (const condition of CONDITIONS) {
    const counts = [0, 1, 2, 3].map(position => [0, 1, 2, 3].filter(roundOffset => keys.has(`${condition}|${base + roundOffset}|${position}`)).length);
    if (counts.some(count => count !== 1)) errors.push(`condition ${condition} is not balanced across positions in rounds ${base}-${base + 3}`);
  }
  const conditions = {};
  for (const condition of CONDITIONS) {
    const samples = records.filter(sample => sample.record?.context?.condition === condition && usable(sample));
    conditions[condition] = {
      usableSamples: samples.length,
      errors: records.filter(sample => sample.record?.context?.condition === condition && (sample.errors.length || sample.record?.data?.errors?.length)).length,
      nativeNominal: metricSet(samples, (s, metric) => s.metrics.native[metric]),
      nativeActual: Object.fromEntries(['p95', 'maxGap'].map(metric => [metric, rangeMedian(samples.map(s => s.metrics.nativeActual[metric]))])),
      acceptedAppNominal: metricSet(samples, (s, metric) => s.record.data.app.length ? acceptedStats(s.record.data, 1)[metric] : null),
      acceptedAppPerformanceAtEntry: metricSet(samples, (s, metric) => s.record.data.app.length ? acceptedStats(s.record.data, 2)[metric] : null),
      geometryObservations: {
        observationsPerSecond: rangeMedian(samples.filter(s => s.record.data.geometryTimes !== null).map(s => s.metrics.geometry?.fps)),
        p95GapMs: rangeMedian(samples.filter(s => s.record.data.geometryTimes !== null).map(s => s.metrics.geometry?.p95)),
        maxGapMs: rangeMedian(samples.filter(s => s.record.data.geometryTimes !== null).map(s => s.metrics.geometry?.maxGap))
      }
    };
  }
  const pairedRounds = [];
  for (let round = 0; round < repeats; round++) {
    const find = condition => [...keys.entries()].find(([key]) => key.startsWith(`${condition}|${round}|`))?.[1];
    const blank = find('blank'), full = find('full'), staticHidden = find('static-hidden'), worldHidden = find('world-hidden');
    const value = (sample, path) => usable(sample) ? path(sample) : null;
    const fullMinusBlank = delta(value(full, s => s.metrics.nativeActual.p95), value(blank, s => s.metrics.nativeActual.p95));
    const differences = hidden => ({
      nativeActualP95Ms: delta(value(hidden, s => s.metrics.nativeActual.p95), value(full, s => s.metrics.nativeActual.p95)),
      geometryP95Ms: delta(value(hidden, s => s.metrics.geometry?.p95), value(full, s => s.metrics.geometry?.p95))
    });
    pairedRounds.push({round, fullMinusBlankNativeActualP95Ms: fullMinusBlank,
      staticHiddenMinusFull: differences(staticHidden), worldHiddenMinusFull: differences(worldHidden)});
  }
  return {identity: group.identity, completeness: {expectedRepeats: repeats, expectedRecords: repeats * 4, presentRecords: records.length, missingKeys, duplicateKeys}, conditions, pairedRounds, errors};
}

function acceptedStats(data, column) {
  const timestamps = data.app.filter(row => row[4] === true).map(row => row[column]);
  const result = stats(timestamps), duration = finite(data.start) && finite(data.end) ? data.end - data.start : null;
  result.fps = finite(duration) && duration > 0 ? timestamps.length * 1000 / duration : null;
  return result;
}

function analyzeRecords(records, parseIssues = [], inputFiles = []) {
  const statuses = records.map(item => validateRecord(item.record, item.source, item.line));
  const validationErrors = [...parseIssues];
  const warnings = [];
  for (const status of statuses) { validationErrors.push(...status.errors); warnings.push(...status.warnings); }
  const groupsByKey = new Map();
  for (const status of statuses) {
    const identity = identityOf(status.record || {}), key = stableJSON(identity);
    if (!groupsByKey.has(key)) groupsByKey.set(key, {identity, records: []});
    groupsByKey.get(key).records.push(status);
  }
  const groups = [...groupsByKey.values()].map(summarizeGroup);
  for (const [index, group] of groups.entries()) for (const error of group.errors) validationErrors.push(`group ${index + 1}: ${error}`);
  const sampleErrors = statuses.filter(status => status.record?.data?.errors?.length).map(status => ({source: status.source, line: status.line, traceID: status.record.traceID, errors: status.record.data.errors}));
  return {schemaVersion: 1, kind: 'motion-control-analysis', inputFiles, totalRecords: records.length,
    groups, records: statuses.map(status => ({source: status.source, line: status.line, traceID: status.record?.traceID ?? null,
      identity: identityOf(status.record || {}), condition: status.record?.context?.condition ?? null,
      round: status.record?.context?.round ?? null, position: status.record?.context?.position ?? null,
      errors: status.errors, warnings: status.warnings})), sampleErrors, validationErrors, warnings};
}

function analyzeFiles(files) {
  const records = [], issues = [];
  for (const file of files) {
    let content;
    try { content = fs.readFileSync(file, 'utf8'); }
    catch (error) { issues.push(`${file}: cannot read input: ${error.message}`); continue; }
    content.split(/\r?\n/).forEach((line, index) => {
      if (!line.trim()) return;
      try { records.push({record: JSON.parse(line), source: file, line: index + 1}); }
      catch (error) { issues.push(`${file}:${index + 1}: malformed JSON: ${error.message}`); }
    });
  }
  if (!files.length) issues.push('at least one JSONL input path is required');
  if (!records.length) issues.push('no parseable motion-control records found');
  return analyzeRecords(records, issues, files);
}

if (require.main === module) {
  const report = analyzeFiles(process.argv.slice(2));
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  if (report.validationErrors.length) process.exitCode = 1;
}

module.exports = {analyzeFiles, analyzeRecords, validateRecord, recompute, quantile95, acceptedStats};
