// SPDX-License-Identifier: LicenseRef-Simpli-Noncommercial-1.0
// Copyright (C) 2026 ilamgumaran and contributors
'use strict';

const fs = require('node:fs');
const {analyzeCadence} = require('./analyze-cadence-trace.cjs');
const {validateRecord} = require('./firefox-stall-notices.cjs');
const {makeSchedule} = require('./diagnose-firefox-stalls.cjs');

const EXPECTED_CONDITIONS = Object.freeze(['full-profiled', 'world-hidden-profiled', 'full-unprofiled', 'world-hidden-unprofiled']);
const CONDITIONS = new Set(EXPECTED_CONDITIONS);
const EXPECTED_KEYS = Object.freeze(['globalIndex', 'round', 'position', 'condition']);
const METRIC_EPSILON = 1e-7;
const PROVENANCE_KEYS = Object.freeze(['platform', 'arch', 'node', 'gitSHA', 'captureDigest', 'traceDigest', 'profileExtractorDigest']);

function readFileRecords(filename) {
  const text = fs.readFileSync(filename, 'utf8').trim();
  if (!text) return {records: [], errors: []};
  try {
    const parsed = JSON.parse(text);
    return {records: Array.isArray(parsed) ? parsed : [parsed], errors: []};
  } catch (_) {
    const records = [], errors = [];
    text.split(/\r?\n/).forEach((line, index) => {
      if (!line.trim()) return;
      try { records.push(JSON.parse(line)); }
      catch (error) { errors.push({line: index + 1, message: error.message}); }
    });
    return {records, errors};
  }
}

function groupDescription(record) {
  const provenance = record?.provenance || {};
  const context = record?.context || {};
  return Object.fromEntries([
    ['platform', provenance.platform], ['arch', provenance.arch], ['node', provenance.node],
    ['browserVersion', context.browserVersion], ['gitSHA', provenance.gitSHA],
    ['captureDigest', provenance.captureDigest], ['traceDigest', provenance.traceDigest],
    ['profileExtractorDigest', provenance.profileExtractorDigest]
  ]);
}

function groupKey(record) {
  const group = groupDescription(record);
  return JSON.stringify(Object.keys(group).map(key => group[key] ?? null));
}

function expectedSchedule() {
  return makeSchedule({slot: null}).map(item => ({
    globalIndex: item.globalIndex, round: item.round, position: item.position, condition: item.condition
  }));
}

function scheduleKey(value) {
  return JSON.stringify([value.globalIndex, value.round, value.position, value.condition]);
}

function columnIndex(columns, name, fallback) {
  const index = Array.isArray(columns) ? columns.indexOf(name) : -1;
  return index >= 0 ? index : fallback;
}

function rowValue(row, columns, name, fallback) {
  if (Array.isArray(row)) return row[columnIndex(columns, name, fallback)];
  return row && typeof row === 'object' ? row[name] : undefined;
}

function quantile95(values) {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length * 0.95)];
}

function gapP95(values) {
  const gaps = values.slice(1).map((value, index) => value - values[index]);
  return {count: gaps.length, p95Ms: quantile95(gaps)};
}

function metricsEqual(actual, expected) {
  return typeof actual === 'number' && Number.isFinite(actual) && typeof expected === 'number'
    && Number.isFinite(expected) && Math.abs(actual - expected) <= METRIC_EPSILON;
}

function analyzeWindow(record, window, label, addError) {
  const context = record.context || {};
  const trace = window.trace || {};
  const kind = window.kind;
  const lowPower = kind === 'low';
  const gateThresholds = lowPower ? {fps: 26, p95: 46, maxGap: 100} : {fps: 45, p95: 31, maxGap: 100};
  if (!window || typeof window !== 'object') {
    addError(`${label} is missing`);
    return {kind, metrics: null, analysis: null};
  }
  if (typeof window.lowPower !== 'boolean' || window.lowPower !== lowPower) addError(`${label}.lowPower does not match its kind`);
  if (!trace || typeof trace !== 'object' || !Array.isArray(trace.native) || !Array.isArray(trace.app)) addError(`${label}.trace is missing native or app rows`);
  if (!(Number.isFinite(trace.start) && Number.isFinite(trace.end) && trace.start > 0 && trace.end > trace.start)) addError(`${label}.trace has invalid clock endpoints`);
  if (!(Number.isFinite(window.pageMarks?.startMs) && Number.isFinite(window.pageMarks?.endMs)
    && window.pageMarks.startMs > 0 && window.pageMarks.endMs > window.pageMarks.startMs)) addError(`${label}.pageMarks has invalid clock endpoints`);
  if (!Array.isArray(window.geometryTimesMs)) addError(`${label}.geometryTimesMs is missing`);
  if (!(Number.isFinite(window.geometryStartMs) && Number.isFinite(window.geometryEndMs) && window.geometryEndMs > window.geometryStartMs)) {
    addError(`${label} has invalid or nonpositive geometry endpoints`);
  }
  if (Array.isArray(window.geometryTimesMs) && window.geometryTimesMs.some((time, index) => !Number.isFinite(time) || time <= 0
    || (index > 0 && time < window.geometryTimesMs[index - 1]))) addError(`${label}.geometryTimesMs contains invalid or nonsorted raw timestamps`);
  if (!window.gateThresholds || ['fps', 'p95', 'maxGap'].some(key => window.gateThresholds[key] !== gateThresholds[key])) addError(`${label}.gateThresholds do not match the original research gates`);
  if (window.researchOnly !== true) addError(`${label} is not marked researchOnly`);

  const appRows = Array.isArray(trace.app) ? trace.app : [];
  for (const [index, row] of appRows.entries()) {
    const flag = rowValue(row, trace.appColumns, 'lowPower', 3);
    if (flag !== lowPower) addError(`${label}.trace.app row ${index} lowPower flag does not match its mode`);
  }

  const cadenceRecord = {
    schemaVersion: 1, kind: 'cadence',
    context: {suite: 'firefox-stall-research', form: context.form, browser: context.browser, browserVersion: context.browserVersion,
      lowPower, viewport: context.viewport, dpr: context.dpr},
    data: {...trace, geometryStartMs: window.geometryStartMs, geometryEndMs: window.geometryEndMs,
      geometryTimesMs: window.geometryTimesMs, metrics: window.metrics}
  };
  const analysis = analyzeCadence(cadenceRecord);
  const computed = analysis.recomputed;
  const metrics = window.metrics || {};
  for (const key of ['fps', 'p95', 'maxGap']) {
    if (!metricsEqual(metrics[key], computed[key])) addError(`${label}.metrics.${key} differs from recomputed cadence beyond tolerance ${METRIC_EPSILON}`);
  }
  if (metrics.frames !== computed.frames) addError(`${label}.metrics.frames differs from recomputed geometry count`);
  const quantizationWarnings = analysis.warnings.filter(warning => /contains duplicate (?:timestamps|performance timestamps)/.test(warning));
  const fatalWarnings = analysis.warnings.filter(warning => !quantizationWarnings.includes(warning));
  if (fatalWarnings.length) for (const warning of fatalWarnings) addError(`${label}: ${warning}`);

  const computedPasses = {
    fps: Number.isFinite(computed.fps) ? computed.fps >= gateThresholds.fps : null,
    p95: Number.isFinite(computed.p95) ? computed.p95 <= gateThresholds.p95 : null,
    maxGap: Number.isFinite(computed.maxGap) ? computed.maxGap < gateThresholds.maxGap : null
  };
  if (!window.researchGatePasses || Object.keys(computedPasses).some(key => window.researchGatePasses[key] !== computedPasses[key])) {
    addError(`${label}.researchGatePasses differs from recomputed research gates`);
  }

  const native = Array.isArray(trace.native) ? trace.native : [];
  const nativeNominal = native.map(row => rowValue(row, trace.nativeColumns, 'timestamp', 0)).filter(Number.isFinite);
  const nativeActual = native.map(row => rowValue(row, trace.nativeColumns, 'performance.now', 1)).filter(Number.isFinite);
  const acceptedRows = appRows.filter(row => rowValue(row, trace.appColumns, 'accepted', 4) === true);
  const acceptedNominal = acceptedRows.map(row => rowValue(row, trace.appColumns, 'at', 1)).filter(Number.isFinite);
  const acceptedEntry = acceptedRows.map(row => rowValue(row, trace.appColumns, 'performanceAtEntry', 2)).filter(Number.isFinite);
  return {
    kind, lowPower,
    metrics: {reported: metrics, recomputed: computed, researchGatePasses: computedPasses, thresholds: gateThresholds},
    native: {count: native.length, nominal: gapP95(nativeNominal), actual: gapP95(nativeActual)},
    acceptedApp: {count: acceptedRows.length, nominal: gapP95(acceptedNominal), entry: gapP95(acceptedEntry)},
    geometryP95Ms: computed.p95, warnings: analysis.warnings,
    warningDisposition: {nonfatalQuantization: quantizationWarnings, fatal: fatalWarnings},
    profileWindow: profileWindowFacts(record.data?.profile, kind)
  };
}

function profileWindowFacts(profile, kind) {
  const found = profile?.windows?.find(window => window.kind === kind);
  if (!found) return null;
  return {
    thresholdMs: found.thresholdMs, outlierGapCount: found.outlierGapCount,
    selectedGapCount: found.selectedGapCount,
    gaps: (found.gaps || []).map(gap => ({gapIndex: gap.gapIndex, gapMs: gap.gapMs,
      categoryCounts: gap.categoryCounts, cpuDeltaSumRaw: gap.cpuDeltaSumRaw, cpuDeltaCount: gap.cpuDeltaCount,
      sampleCount: gap.sampleCount, sourceSamplesTruncated: gap.sourceSamplesTruncated,
      markerCount: gap.markerCount, markersTruncated: gap.markersTruncated,
      markers: gap.markers}))
  };
}

function validateRecordSource(record, source, index, addError) {
  try { validateRecord(record, source, index + 1); }
  catch (error) { addError(error.message); }
  if (!record || typeof record !== 'object') { addError('record is not an object'); return; }
  const context = record.context || {}, data = record.data || {};
  const provenance = record.provenance || {};
  for (const key of PROVENANCE_KEYS) if (typeof provenance[key] !== 'string' || !provenance[key]) addError(`provenance.${key} is missing`);
  if (!/^[0-9a-f]{64}$/.test(provenance.captureDigest || '')) addError('provenance.captureDigest is not a SHA-256 digest');
  if (!/^[0-9a-f]{64}$/.test(provenance.traceDigest || '')) addError('provenance.traceDigest is not a SHA-256 digest');
  if (!/^[0-9a-f]{64}$/.test(provenance.profileExtractorDigest || '')) addError('provenance.profileExtractorDigest is not a SHA-256 digest');
  if (!CONDITIONS.has(context.condition)) addError(`unsupported condition ${String(context.condition)}`);
  const shouldProfile = typeof context.condition === 'string' && context.condition.endsWith('-profiled');
  if (context.profilerEnabled !== shouldProfile) addError('context.profilerEnabled does not match condition');
  const shouldHide = typeof context.condition === 'string' && context.condition.startsWith('world-hidden-');
  if (context.hidden !== shouldHide) addError('context.hidden does not match condition');
  if (context.browser !== 'firefox') addError('context.browser must be firefox');
  if (typeof context.browserVersion !== 'string' || !context.browserVersion) addError('context.browserVersion is missing');
  if (context.form !== 'hosted') addError('context.form must be hosted');
  if (context.modeEntry !== 'low-to-normal') addError('context.modeEntry must be low-to-normal');
  if (context.viewport?.width !== 854 || context.viewport?.height !== 480) addError('context.viewport must be 854x480');
  if (context.dpr !== 1) addError('context.dpr must be 1');
  if (context.headless !== true) addError('context.headless must be true');
  if (!Array.isArray(data.errors)) addError('data.errors is missing or not an array');
  else if (data.errors.length) addError(`case retained ${data.errors.length} error(s): ${data.errors.join(' | ')}`);

  if (shouldProfile) {
    if (!context.profiler || context.profiler.features !== 'js,leaf,stackwalk' || context.profiler.intervalMs !== 1
      || context.profiler.entries !== 2000000 || context.profiler.filter !== 'GeckoMain' || context.profiler.shutdownFilename !== 'profile.json') {
      addError('profiled case is missing recorded profiler configuration metadata');
    }
    if (!data.profile || !data.profile.profile || !Array.isArray(data.profile.profile.configurationFeatures)) addError('profiled case is missing derived profile metadata/features');
    else {
      const actual = data.profile.profile;
      if (actual.version !== 34) addError('profiled case metadata version must be 34');
      if (actual.intervalMs !== 1) addError('profiled case actual intervalMs must be 1');
      if (!['js', 'stackwalk'].every(feature => actual.configurationFeatures.includes(feature))) addError('profiled case metadata is missing a required actual core profiler feature');
    }
    if (!Array.isArray(data.profile?.windows) || data.profile.windows.length !== 2
      || data.profile.windows[0]?.kind !== 'low' || data.profile.windows[1]?.kind !== 'normal') addError('profiled case is missing derived low/normal profile window metadata');
    if (typeof data.rawProfileSha256 !== 'string' || !/^[0-9a-f]{64}$/.test(data.rawProfileSha256)) addError('profiled case is missing a valid rawProfileSha256');
  } else {
    if (data.profile !== null) addError('unprofiled case must have profile:null');
    if (data.rawProfileSha256 !== null) addError('unprofiled case must have rawProfileSha256:null');
  }
  if (!Array.isArray(data.windows) || data.windows.length !== 2) {
    addError('data.windows must contain exactly low then normal windows');
    return;
  }
  if (data.windows[0]?.kind !== 'low' || data.windows[1]?.kind !== 'normal') addError('data.windows must contain low then normal');
  const output = {};
  for (const [position, kind] of ['low', 'normal'].entries()) {
    const matching = data.windows.find(window => window?.kind === kind);
    output[kind] = analyzeWindow(record, matching || {}, `windows.${kind}`, addError);
  }
  return output;
}

function metricRanges(runs, mode, metric) {
  const values = runs.map(run => run.windows?.[mode]?.metrics?.recomputed?.[metric]).filter(Number.isFinite).sort((a, b) => a - b);
  if (!values.length) return {min: null, median: null, max: null};
  const middle = Math.floor(values.length / 2);
  const median = values.length % 2 ? values[middle] : (values[middle - 1] + values[middle]) / 2;
  return {min: values[0], median, max: values.at(-1)};
}

function summarizeGroup(group, expected, validationErrors) {
  const errors = [];
  const addError = message => { errors.push(message); validationErrors.push({group: group.description, message}); };
  const observed = new Map();
  for (const entry of group.entries) {
    const errorCountBefore = errors.length;
    const record = entry.record;
    const context = record?.context || {};
    const schedule = {globalIndex: context.globalIndex, round: context.round, position: context.position, condition: context.condition};
    const key = scheduleKey(schedule);
    if (!expected.some(item => scheduleKey(item) === key)) addError(`record from ${entry.source} has an unexpected schedule key ${key}`);
    if (observed.has(key)) addError(`duplicate schedule key ${key}`);
    else observed.set(key, entry);
    const sourceAddError = message => addError(`${entry.source}: ${message}`);
    const windowSummary = validateRecordSource(record, entry.source, entry.index, sourceAddError);
    entry.windowSummary = windowSummary;
    entry.status = errors.length === errorCountBefore ? 'valid' : 'invalid';
  }
  const missingKeys = [];
  for (const item of expected) {
    const key = scheduleKey(item);
    if (!observed.has(key)) { missingKeys.push(key); addError(`missing schedule key ${key}`); }
  }

  const conditionModes = {};
  for (const condition of EXPECTED_CONDITIONS) {
    const runs = group.entries.filter(entry => entry.record?.context?.condition === condition)
      .map(entry => ({
        round: entry.record.context.round, position: entry.record.context.position,
        globalIndex: entry.record.context.globalIndex,
        status: entry.status || 'invalid',
        profiler: {enabled: entry.record.context.profilerEnabled, requested: entry.record.context.profiler,
          actualFeatures: entry.record.data?.profile?.profile?.configurationFeatures || null,
          missingRequestedFeatures: entry.record.data?.profile?.profile?.configurationFeatures
            ? (entry.record.context.profiler?.features || '').split(',').filter(feature => !entry.record.data.profile.profile.configurationFeatures.includes(feature))
            : null,
          actualIntervalMs: entry.record.data?.profile?.profile?.intervalMs ?? null,
          profile: entry.record.data?.profile?.profile || null},
        windows: entry.windowSummary || null
      })).sort((a, b) => a.round - b.round);
    conditionModes[condition] = {
      runCount: runs.length, runs,
      ranges: Object.fromEntries(['low', 'normal'].map(mode => [mode, Object.fromEntries(['fps', 'p95', 'maxGap'].map(metric => [metric, metricRanges(runs, mode, metric)]))]))
    };
    if (runs.length !== 4) addError(`${condition} has ${runs.length} runs; expected four Williams rounds`);
  }
  const duplicateCount = errors.filter(error => error.startsWith('duplicate schedule key')).length;
  const unexpectedCount = errors.filter(error => error.includes('unexpected schedule key')).length;
  const incomplete = missingKeys.length > 0 || duplicateCount > 0 || unexpectedCount > 0 || group.entries.length !== expected.length;
  return {
    source: group.description,
    recordCount: group.entries.length,
    expectedRecordCount: expected.length,
    status: errors.length ? (incomplete ? 'incomplete' : 'invalid') : 'complete',
    missingKeys, duplicateCount, unexpectedCount,
    validationErrorCount: errors.length,
    conditionModes
  };
}

function analyzeFiles(paths) {
  const validationErrors = [], groups = new Map();
  const expected = expectedSchedule();
  if (!Array.isArray(paths) || paths.length === 0) validationErrors.push({message: 'provide at least one JSON or JSONL path'});
  for (const filename of paths || []) {
    let parsed;
    try { parsed = readFileRecords(filename); }
    catch (error) { validationErrors.push({source: filename, message: `could not read input: ${error.message}`}); continue; }
    for (const parseError of parsed.errors) validationErrors.push({source: filename, line: parseError.line, message: `invalid JSON: ${parseError.message}`});
    if (!parsed.records.length) validationErrors.push({source: filename, message: 'input contains no records'});
    parsed.records.forEach((record, index) => {
      const key = groupKey(record);
      if (!groups.has(key)) groups.set(key, {description: groupDescription(record), entries: []});
      groups.get(key).entries.push({record, source: filename, index: index + 1, windowSummary: null});
    });
  }
  const groupReports = [...groups.values()].map(group => summarizeGroup(group, expected, validationErrors));
  const incompleteGroups = groupReports.filter(group => group.status === 'incomplete').length;
  const allRecords = [...groups.values()].flatMap(group => group.entries);
  if (!allRecords.length && !(validationErrors.length && validationErrors.some(error => error.message === 'provide at least one JSON or JSONL path'))) {
    validationErrors.push({message: 'no records were available for analysis'});
  }
  const errorCases = allRecords.filter(entry => Array.isArray(entry.record?.data?.errors) && entry.record.data.errors.length).length;
  const report = {
    schemaVersion: 1, kind: 'firefox-stall-analysis',
    totals: {records: allRecords.length, groups: groupReports.length, expectedRecordsPerGroup: expected.length,
      completeGroups: groupReports.filter(group => group.status === 'complete').length,
      incompleteGroups, invalidGroups: groupReports.filter(group => group.status === 'invalid').length,
      validCases: allRecords.filter(entry => entry.status === 'valid').length,
      invalidCases: allRecords.filter(entry => entry.status === 'invalid').length,
      errorCases, validationErrors: validationErrors.length},
    groups: groupReports,
    validationErrors
  };
  report.status = validationErrors.length ? 'invalid' : 'valid';
  return report;
}

if (require.main === module) {
  const paths = process.argv.slice(2);
  const report = analyzeFiles(paths);
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  if (report.validationErrors.length) process.exitCode = 1;
}

module.exports = {analyzeFiles, expectedSchedule, quantile95};
