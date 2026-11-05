// SPDX-License-Identifier: LicenseRef-Simpli-Noncommercial-1.0
// Copyright (C) 2026 ilamgumaran and contributors
'use strict';

const fs = require('node:fs');

const EPSILON = 1e-7;
const finite = value => typeof value === 'number' && Number.isFinite(value);

function columnsFor(data, name, fallback) {
  const columns = Array.isArray(data?.[name]) ? data[name] : fallback;
  return Object.fromEntries(columns.map((column, index) => [column, index]));
}

function rowValue(row, columns, key, fallbackIndex) {
  if (Array.isArray(row)) return row[Object.hasOwn(columns, key) ? columns[key] : fallbackIndex];
  if (row && typeof row === 'object') return row[key];
  return undefined;
}

function valueToleranceEqual(actual, expected) {
  if (actual === null || expected === null) return actual === expected;
  return finite(actual) && finite(expected) && Math.abs(actual - expected) <= EPSILON;
}

function quantile95(values) {
  if (values.length === 0) return null;
  const sorted = values.slice().sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length * 0.95)];
}

function analyzeCadence(record) {
  if (!record || record.kind !== 'cadence') return {skipped: true, reason: 'non-cadence input'};

  const data = record.data || {};
  const context = record.context || {};
  const warnings = [];
  if (record.schemaVersion !== 1) warnings.push(`unsupported schemaVersion: ${String(record.schemaVersion)}`);
  const geometry = Array.isArray(data.geometryTimesMs) ? data.geometryTimesMs : [];
  const geometryStart = data.geometryStartMs;
  const geometryEnd = data.geometryEndMs;
  const elapsed = finite(geometryStart) && finite(geometryEnd) ? geometryEnd - geometryStart : null;
  const geometryValues = geometry.filter(finite);
  const geometryGaps = [];
  if (geometryValues.length === geometry.length) {
    for (let i = 1; i < geometryValues.length; i++) geometryGaps.push(geometryValues[i] - geometryValues[i - 1]);
  }

  if (!Array.isArray(data.geometryTimesMs)) warnings.push('geometryTimesMs is missing or not an array');
  if (!finite(geometryStart) || !finite(geometryEnd)) warnings.push('geometry interval endpoints are missing or invalid');
  if (elapsed !== null && elapsed <= 0) warnings.push('geometry interval has zero, negative, or backward duration');
  if (geometry.length === 0) warnings.push('geometry trace is empty');
  else if (geometry.length < 2) warnings.push('geometry trace has fewer than two samples');
  if (geometryValues.length !== geometry.length) warnings.push('geometry trace contains nonnumeric timestamps');
  if (new Set(geometryValues).size !== geometryValues.length) warnings.push('geometry trace contains duplicate timestamps');
  if (geometry.some((value, index) => finite(value) && index > 0 && finite(geometry[index - 1]) && value < geometry[index - 1])) warnings.push('geometry timestamps move backward');

  const recomputed = elapsed > 0 && geometryValues.length === geometry.length ? {
    fps: geometry.length * 1000 / elapsed,
    p95: quantile95(geometryGaps),
    maxGap: geometryGaps.length ? Math.max(...geometryGaps) : null,
    frames: geometry.length,
    elapsedMs: elapsed
  } : {fps: null, p95: null, maxGap: null, frames: geometry.length, elapsedMs: elapsed};
  const reported = data.metrics || {};
  const reportedCheck = {
    fps: valueToleranceEqual(reported.fps, recomputed.fps),
    p95: valueToleranceEqual(reported.p95, recomputed.p95),
    maxGap: valueToleranceEqual(reported.maxGap, recomputed.maxGap),
    frames: reported.frames === undefined ? null : reported.frames === recomputed.frames
  };
  if (Object.values(reportedCheck).some(value => value === false)) warnings.push('reported metrics differ from recomputed geometry metrics');
  if (!data.metrics || !finite(reported.fps) || !finite(reported.p95) || !finite(reported.maxGap)) warnings.push('reported metrics are partial or missing');

  const lowPower = typeof context.lowPower === 'boolean' ? context.lowPower : null;
  if (lowPower === null) warnings.push('lowPower mode flag is missing or invalid');
  const thresholds = lowPower === null ? {fps: null, p95: null, maxGap: null} : {fps: lowPower ? 26 : 45, p95: lowPower ? 46 : 31, maxGap: 100};
  const acceptance = {
    fps: finite(recomputed.fps) && thresholds.fps !== null ? recomputed.fps >= thresholds.fps : null,
    p95: finite(recomputed.p95) && thresholds.p95 !== null ? recomputed.p95 <= thresholds.p95 : null,
    maxGap: finite(recomputed.maxGap) && thresholds.maxGap !== null ? recomputed.maxGap < thresholds.maxGap : null
  };

  const appColumns = columnsFor(data, 'appColumns', ['policyID', 'at', 'performanceAtEntry', 'lowPower', 'accepted']);
  const nativeColumns = columnsFor(data, 'nativeColumns', ['timestamp', 'performance.now']);
  const rawApp = Array.isArray(data.app) ? data.app : [];
  const rawNative = Array.isArray(data.native) ? data.native : [];
  if (!Array.isArray(data.app)) warnings.push('app trace is missing or not an array');
  if (!Array.isArray(data.native)) warnings.push('native trace is missing or not an array');
  if (rawApp.length === 0) warnings.push('app trace is empty');
  if (rawNative.length === 0) warnings.push('native trace is empty');

  const app = rawApp.map((row, index) => ({
    source: 'app', index,
    policyID: rowValue(row, appColumns, 'policyID', 0),
    at: rowValue(row, appColumns, 'at', 1),
    time: rowValue(row, appColumns, 'performanceAtEntry', 2),
    lowPower: rowValue(row, appColumns, 'lowPower', 3),
    accepted: rowValue(row, appColumns, 'accepted', 4)
  }));
  const native = rawNative.map((row, index) => ({
    source: 'native', index,
    timestamp: rowValue(row, nativeColumns, 'timestamp', 0),
    time: rowValue(row, nativeColumns, 'performance.now', 1)
  }));
  const appTimes = app.map(event => event.time);
  const nativeTimes = native.map(event => event.time);
  for (const [name, times] of [['app', appTimes], ['native', nativeTimes]]) {
    if (times.some(value => !finite(value))) warnings.push(`${name} trace contains missing or invalid performance timestamps`);
    const valid = times.filter(finite);
    if (new Set(valid).size !== valid.length) warnings.push(`${name} trace contains duplicate performance timestamps`);
    if (times.some((value, index) => finite(value) && index > 0 && finite(times[index - 1]) && value < times[index - 1])) warnings.push(`${name} trace moves backward in capture order`);
  }
  const lastPolicyTimestamp = new Map();
  for (const event of app) {
    if (!finite(event.at)) continue;
    const previousAt = lastPolicyTimestamp.get(event.policyID);
    if (finite(previousAt) && event.at < previousAt) warnings.push(`app policy timestamps move backward in capture order for policy ${String(event.policyID)}`);
    lastPolicyTimestamp.set(event.policyID, event.at);
  }
  if (rawApp.some((row, index) => !Array.isArray(row) && (!row || typeof row !== 'object') || [app[index].policyID, app[index].at, app[index].time, app[index].lowPower, app[index].accepted].some(value => value === undefined))) warnings.push('app trace is partial');
  if (native.some(event => !finite(event.timestamp) || !finite(event.time))) warnings.push('native trace is partial');

  const appCountByPolicy = {};
  for (const event of app) {
    const key = String(event.policyID);
    appCountByPolicy[key] = (appCountByPolicy[key] || 0) + 1;
  }
  const activePolicyIDs = [...new Set(app.map(event => event.policyID).filter(value => value !== undefined))].sort((a, b) => String(a).localeCompare(String(b), undefined, {numeric: true}));

  // Compare clocks in performance.now() space. Native RAF timestamps and app
  // policy timestamps are retained as context; neither is assumed to be the
  // other sampler's clock or an indication of presentation.
  const orderedNative = native.filter(event => finite(event.time)).sort((a, b) => a.time - b.time || a.index - b.index);
  const orderedApp = app.filter(event => finite(event.time)).sort((a, b) => a.time - b.time || a.index - b.index);
  const orderedEvents = [
    ...orderedNative.map(event => ({source: 'native', time: event.time, timestamp: event.timestamp, index: event.index})),
    ...orderedApp.map(event => ({source: 'app', time: event.time, policyID: event.policyID, at: event.at, lowPower: event.lowPower, accepted: event.accepted, index: event.index}))
  ].sort((a, b) => a.time - b.time || (a.source === b.source ? a.index - b.index : a.source === 'native' ? -1 : 1));

  const nativeInterior = native.slice(1, -1).filter(event => finite(event.timestamp) && finite(event.time)); // first and last callbacks can straddle sample boundaries
  const nativeMissingFromApp = nativeInterior.filter(event => !orderedApp.some(appEvent => finite(appEvent.at) && Math.abs(appEvent.at - event.timestamp) <= EPSILON))
    .map(event => ({performanceNow: event.time, timestamp: event.timestamp}));

  const lowPowerViolations = [];
  const byPolicy = new Map();
  const previousPolicyTimestamp = new Map();
  for (const event of app) {
    if (!finite(event.at)) continue;
    const previousAt = previousPolicyTimestamp.get(event.policyID);
    const movedBackward = finite(previousAt) && event.at < previousAt;
    previousPolicyTimestamp.set(event.policyID, event.at);
    if (movedBackward || event.lowPower !== true) byPolicy.delete(event.policyID);
    if (event.lowPower !== true || typeof event.accepted !== 'boolean') continue;
    const prior = byPolicy.get(event.policyID);
    if (prior && event.accepted === false) {
      const sinceAccepted = event.at - prior.at;
      if (sinceAccepted >= 1000 / 30 - 4 - EPSILON) {
        lowPowerViolations.push({policyID: event.policyID, acceptedAt: prior.at, rejectedAt: event.at, elapsedSinceAcceptedMs: sinceAccepted, minimumExpectedMs: 1000 / 30 - 4});
      }
    }
    if (event.accepted === true) byPolicy.set(event.policyID, event);
  }

  const outlierThreshold = lowPower === null ? null : lowPower ? 46 : 31;
  const longGeometryGaps = [];
  for (let index = 1; index < geometryValues.length; index++) {
    const from = geometryValues[index - 1], to = geometryValues[index], gapMs = to - from;
    if (outlierThreshold === null || gapMs <= outlierThreshold) continue;
    const nearestBefore = [...orderedApp].reverse().find(event => event.time <= from && event.accepted === true);
    const latestAcceptedAtGapEnd = [...orderedApp].reverse().find(event => event.time <= to && event.accepted === true);
    const nearestAfter = orderedApp.find(event => event.time >= to && event.accepted === true);
    const neighborhoodStart = from - 20, neighborhoodEnd = to + 20;
    const surrounding = orderedEvents.filter(event => event.time >= neighborhoodStart && event.time <= neighborhoodEnd);
    const maxSurroundingEvents = 16;
    const surroundingEventsTruncated = surrounding.length > maxSurroundingEvents;
    const surroundingEvents = surroundingEventsTruncated
      ? [...surrounding.slice(0, maxSurroundingEvents / 2), ...surrounding.slice(-maxSurroundingEvents / 2)]
      : surrounding;
    longGeometryGaps.push({
      fromMs: from, toMs: to, gapMs,
      nearestPrecedingAccepted: nearestBefore ? compactApp(nearestBefore) : null,
      latestAcceptedAtGapEnd: latestAcceptedAtGapEnd ? compactApp(latestAcceptedAtGapEnd) : null,
      nearestFollowingAccepted: nearestAfter ? compactApp(nearestAfter) : null,
      surroundingEventCount: surrounding.length,
      surroundingEventsTruncated,
      surroundingEvents
    });
  }

  return {
    skipped: false,
    traceID: record.traceID || null,
    suite: context.suite || null,
    form: context.form || null,
    browser: context.browser || null,
    lowPower,
    recomputed,
    reportedCheck,
    thresholds,
    acceptance,
    counts: {geometry: geometry.length, native: rawNative.length, app: rawApp.length, activePolicies: activePolicyIDs.length},
    activePolicyIDs,
    appCountByPolicy,
    nativeNominalGapsMs: native.slice(1).map((event, index) => event.timestamp - native[index].timestamp).filter(finite),
    nativeMissingFromApp,
    nativeAppMatchBoundaryPolicy: 'first and last native samples excluded for sample-boundary ambiguity',
    lowPowerInvariantViolations: lowPowerViolations,
    longGeometryGaps,
    warnings
  };
}

function compactApp(event) {
  return {time: event.time, at: event.at, policyID: event.policyID, lowPower: event.lowPower, accepted: event.accepted};
}

function readRecords(filename) {
  const text = fs.readFileSync(filename, 'utf8').trim();
  if (!text) return {records: [], parseWarnings: []};
  try {
    const value = JSON.parse(text);
    return {records: Array.isArray(value) ? value : [value], parseWarnings: []};
  } catch (_) {
    const records = [];
    const parseWarnings = [];
    for (const [index, line] of text.split(/\r?\n/).entries()) {
      try { records.push(JSON.parse(line)); }
      catch (error) { parseWarnings.push({line: index + 1, message: error.message}); }
    }
    return {records, parseWarnings};
  }
}

if (require.main === module) {
  const filename = process.argv[2];
  if (!filename) {
    console.error('Usage: node tests/analyze-cadence-trace.cjs <jsonl-or-json-path>');
    process.exitCode = 2;
  } else {
    try {
      const {records, parseWarnings} = readRecords(filename);
      const analyses = records.filter(record => record?.kind === 'cadence').map(analyzeCadence);
      process.stdout.write(`${JSON.stringify({analyses, parseWarnings}, null, 2)}\n`);
      if (parseWarnings.length) process.exitCode = 1;
    } catch (error) {
      console.error(error.message);
      process.exitCode = 1;
    }
  }
}

module.exports = {analyzeCadence};
