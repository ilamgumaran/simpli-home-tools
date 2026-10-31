'use strict';

// SPDX-License-Identifier: LicenseRef-Simpli-Noncommercial-1.0
// Copyright (C) 2026 ilamgumaran and contributors
//
// Extract a small, privacy-bounded attribution summary from a Gecko profiler
// JSON profile. Raw profiles contain URLs, paths, and arbitrary marker payloads;
// this module deliberately emits only profiler category names and allowlisted
// browser marker labels.

const MAX_GAPS = 4;
const MAX_SAMPLES_PER_GAP = 32;
const MAX_MARKERS_PER_GAP = 16;
const ALIGNMENT_BASE_UNCERTAINTY_MS = 3;
const MAX_ALIGNMENT_DISAGREEMENT_MS = 5;
const MARKER_ALLOWLIST = new Set([
  'requestAnimationFrame callbacks',
  'RefreshDriverTick',
  'Reflow',
  'Reflow (sync)',
  'Styles',
  'Paint',
  'DisplayList',
  'GC',
  'CC',
]);

function fail(message) {
  throw new Error(`Firefox profile extraction: ${message}`);
}

function finite(value, label) {
  if (typeof value !== 'number' || !Number.isFinite(value)) fail(`${label} must be a finite number`);
  return value;
}

function columns(table, label) {
  if (!table || !table.schema || !Array.isArray(table.data)) fail(`${label} table is missing schema or data`);
  const result = {};
  for (const [name, index] of Object.entries(table.schema)) {
    if (Number.isInteger(index) && index >= 0) result[name] = index;
  }
  return result;
}

function value(row, schema, name) {
  const index = schema[name];
  return index === undefined || !Array.isArray(row) ? undefined : row[index];
}

function categoryTables(meta) {
  if (!Array.isArray(meta.categories)) fail('profile categories are missing');
  return meta.categories.map((category) => ({
    name: typeof category?.name === 'string' ? category.name : 'unknown',
    subcategories: Array.isArray(category?.subcategories)
      ? category.subcategories.map((name) => typeof name === 'string' ? name : 'unknown')
      : ['unknown'],
  }));
}

function markerRows(thread, startName, endName) {
  const schema = columns(thread.markers, 'markers');
  for (const required of ['name', 'startTime', 'phase', 'data']) {
    if (schema[required] === undefined) fail(`markers schema lacks ${required}`);
  }
  const matches = new Map([[startName, []], [endName, []]]);
  for (const row of thread.markers.data) {
    const rawLabel = thread.stringTable?.[value(row, schema, 'name')];
    if (rawLabel !== 'UserTiming') continue;
    const data = value(row, schema, 'data');
    if (!data || typeof data !== 'object' || data.type !== 'UserTiming' || !matches.has(data.name)) continue;
    if (data.innerWindowID === undefined || data.innerWindowID === null) continue;
    matches.get(data.name).push({
      time: finite(value(row, schema, 'startTime'), `marker ${data.name} startTime`),
      innerWindowID: data.innerWindowID,
    });
  }
  return matches;
}

function findTimingThread(profile, pageMarks) {
  if (!pageMarks || typeof pageMarks.startName !== 'string' || typeof pageMarks.endName !== 'string') {
    fail('pageMarks must include startName and endName');
  }
  const candidates = [];
  for (const process of profile.processes || []) {
    for (const thread of process.threads || []) {
      if (thread.name !== 'GeckoMain') continue;
      const marks = markerRows(thread, pageMarks.startName, pageMarks.endName);
      const starts = marks.get(pageMarks.startName) || [];
      const ends = marks.get(pageMarks.endName) || [];
      if (starts.length || ends.length) {
        if (starts.length !== 1 || ends.length !== 1) fail('timing marks are missing or duplicated in a GeckoMain thread');
        if (starts[0].innerWindowID !== ends[0].innerWindowID) fail('timing marks belong to different innerWindowID values');
        candidates.push({ process, thread, start: starts[0], end: ends[0] });
      }
    }
  }
  if (candidates.length !== 1) fail(candidates.length ? 'timing marks match multiple GeckoMain threads' : 'timing marks were not found');
  return candidates[0];
}

function safeWindowMetadata(input) {
  const result = {};
  for (const key of ['id', 'label', 'mode', 'kind', 'geometryStartMs', 'geometryEndMs']) {
    const val = input[key];
    if (typeof val === 'string' || (typeof val === 'number' && Number.isFinite(val))) result[key] = val;
  }
  if (typeof input.lowPower === 'boolean') result.lowPower = input.lowPower;
  return result;
}

function markerEvent(marker, innerWindowID) {
  const { phase, startTime, endTime } = marker;
  const eventTimeMs = phase === 0 || phase === 2 ? startTime : phase === 3 ? endTime : null;
  return {
    startMs: phase === 3 ? null : startTime,
    endMs: phase === 0 || phase === 2 ? null : endTime,
    eventTimeMs,
    phase,
    label: marker.label,
    type: marker.type,
    category: Number.isInteger(marker.categoryIndex) ? marker.categoryIndex : null,
    scope: marker.innerWindowID === undefined ? 'process'
      : marker.innerWindowID === innerWindowID ? 'page' : 'other-window',
    ...(Number.isFinite(marker.innerWindowID) ? { innerWindowID: marker.innerWindowID } : {}),
  };
}

function markerIntersects(marker, start, end) {
  if (marker.phase === 1) return marker.startTime <= end && marker.endTime >= start;
  if (marker.phase === 0 || marker.phase === 2) return marker.startTime >= start && marker.startTime <= end;
  if (marker.phase === 3) return marker.endTime >= start && marker.endTime <= end;
  return false;
}

function resolveCategory(sample, sampleSchema, thread, sampleStack) {
  const direct = value(sample, sampleSchema, 'category');
  const directSub = value(sample, sampleSchema, 'subcategory');
  if (Number.isInteger(direct)) return { category: direct, subcategory: Number.isInteger(directSub) ? directSub : 0 };

  const stackSchema = columns(thread.stackTable, 'stackTable');
  const frameSchema = columns(thread.frameTable, 'frameTable');
  const seen = new Set();
  let stackIndex = sampleStack;
  while (Number.isInteger(stackIndex) && stackIndex >= 0 && stackIndex < thread.stackTable.data.length && !seen.has(stackIndex)) {
    seen.add(stackIndex);
    const stack = thread.stackTable.data[stackIndex];
    const frameIndex = value(stack, stackSchema, 'frame');
    const frame = Number.isInteger(frameIndex) ? thread.frameTable.data[frameIndex] : null;
    const category = frame && value(frame, frameSchema, 'category');
    if (Number.isInteger(category)) {
      const subcategory = value(frame, frameSchema, 'subcategory');
      return { category, subcategory: Number.isInteger(subcategory) ? subcategory : 0 };
    }
    stackIndex = value(stack, stackSchema, 'prefix');
  }
  return { category: -1, subcategory: -1 };
}

function categoryName(tables, categoryIndex, subcategoryIndex) {
  if (!Number.isInteger(categoryIndex) || categoryIndex < 0 || !tables[categoryIndex]) {
    return { category: 'unknown', subcategory: 'unknown' };
  }
  const category = tables[categoryIndex];
  return {
    category: category.name,
    subcategory: category.subcategories[subcategoryIndex] || 'unknown',
  };
}

function relevantMarkerLabel(thread, row, schema) {
  const data = value(row, schema, 'data');
  const rawName = thread.stringTable?.[value(row, schema, 'name')];
  const type = data && typeof data.type === 'string' ? data.type : null;
  const label = type && MARKER_ALLOWLIST.has(type) ? type : rawName;
  return MARKER_ALLOWLIST.has(label) ? { label, type: type && MARKER_ALLOWLIST.has(type) ? type : label } : null;
}

function capped(items, limit) {
  if (items.length <= limit) return { items, truncated: 0 };
  const head = Math.ceil(limit / 2);
  const tail = Math.floor(limit / 2);
  return { items: [...items.slice(0, head), ...items.slice(items.length - tail)], truncated: items.length - limit };
}

function extractProfile(profile, windows) {
  if (!profile || typeof profile !== 'object' || !profile.meta) fail('profile metadata is missing');
  if (profile.meta.version !== 34) fail(`unsupported Gecko profile version ${profile.meta.version}`);
  if (!Array.isArray(windows) || windows.length === 0) fail('windows must be a non-empty array');

  const categories = categoryTables(profile.meta);
  const outputWindows = windows.map((input) => {
    if (!input || typeof input !== 'object') fail('each window must be an object');
    if (input.kind !== 'low' && input.kind !== 'normal') fail('window kind must be low or normal');
    if (typeof input.lowPower === 'boolean' && input.lowPower !== (input.kind === 'low')) {
      fail('lowPower must match the window kind');
    }
    const { process, thread, start, end } = findTimingThread(profile, input.pageMarks);
    const pageStartMs = finite(input.pageMarks.startMs, 'pageMarks.startMs');
    const pageEndMs = finite(input.pageMarks.endMs, 'pageMarks.endMs');
    if (pageStartMs < 0 || pageEndMs < pageStartMs) fail('page mark endpoints must be non-negative and ordered');
    if (end.time < start.time) fail('profile timing marks are backwards');
    const offsetStartMs = start.time - pageStartMs;
    const offsetEndMs = end.time - pageEndMs;
    const disagreementMs = Math.abs(offsetStartMs - offsetEndMs);
    if (disagreementMs > MAX_ALIGNMENT_DISAGREEMENT_MS) {
      fail(`page/profile clock alignment disagreement ${disagreementMs.toFixed(3)}ms exceeds 5ms`);
    }
    const offsetMs = (offsetStartMs + offsetEndMs) / 2;
    const uncertaintyMs = ALIGNMENT_BASE_UNCERTAINTY_MS + disagreementMs;
    const thresholdMs = finite(input.thresholdMs ?? ({ low: 46, normal: 31 })[input.kind], 'thresholdMs');
    const geometryStartMs = finite(input.geometryStartMs, 'geometryStartMs');
    const geometryEndMs = finite(input.geometryEndMs, 'geometryEndMs');
    if (geometryStartMs < 0 || geometryEndMs < geometryStartMs) fail('geometry endpoints must be non-negative and ordered');
    const times = input.geometryTimesMs;
    if (!Array.isArray(times) || times.length < 2) fail('geometryTimesMs must contain at least two timestamps');
    const ordered = times.map((time, originalIndex) => ({ time: finite(time, 'geometry timestamp'), originalIndex }));
    for (let index = 0; index < ordered.length; index += 1) {
      if (ordered[index].time < 0) fail('geometry timestamps must be non-negative');
      if (index > 0 && ordered[index].time < ordered[index - 1].time) fail('geometry timestamps must be ordered');
    }
    const gaps = [];
    for (let index = 1; index < ordered.length; index += 1) {
      const gapMs = ordered[index].time - ordered[index - 1].time;
      if (gapMs > thresholdMs) gaps.push({ gapIndex: index - 1, startMs: ordered[index - 1].time, endMs: ordered[index].time, gapMs });
    }
    const selected = gaps.slice().sort((a, b) => b.gapMs - a.gapMs || a.gapIndex - b.gapIndex).slice(0, MAX_GAPS)
      .sort((a, b) => a.gapIndex - b.gapIndex);

    const sampleSchema = columns(thread.samples, 'samples');
    const samples = thread.samples.data;
    const markerSchema = columns(thread.markers, 'markers');
    const markerCandidates = [];
    for (const row of thread.markers.data) {
      const marker = relevantMarkerLabel(thread, row, markerSchema);
      if (!marker) continue;
      const startTime = value(row, markerSchema, 'startTime');
      const endTime = value(row, markerSchema, 'endTime');
      const phase = value(row, markerSchema, 'phase');
      if (!Number.isFinite(startTime) || !Number.isFinite(endTime) || !Number.isInteger(phase) || phase < 0 || phase > 3) continue;
      const data = value(row, markerSchema, 'data');
      markerCandidates.push({ startTime, endTime, phase, label: marker.label, type: marker.type,
        categoryIndex: value(row, markerSchema, 'category'), innerWindowID: data?.innerWindowID });
    }

    const attributedGaps = selected.map((gap) => {
      const profileStartMs = gap.startMs + offsetMs;
      const profileEndMs = gap.endMs + offsetMs;
      const expandedStart = profileStartMs - uncertaintyMs;
      const expandedEnd = profileEndMs + uncertaintyMs;
      const categoryCounts = {};
      let cpuDeltaSumRaw = 0;
      let cpuDeltaCount = 0;
      const sourceSamples = [];
      for (const sample of samples) {
        const sampleTime = value(sample, sampleSchema, 'time');
        if (!Number.isFinite(sampleTime) || sampleTime < expandedStart || sampleTime > expandedEnd) continue;
        const stack = value(sample, sampleSchema, 'stack');
        const resolved = resolveCategory(sample, sampleSchema, thread, stack);
        const names = categoryName(categories, resolved.category, resolved.subcategory);
        const key = `${names.category}/${names.subcategory}`;
        categoryCounts[key] = (categoryCounts[key] || 0) + 1;
        const cpu = value(sample, sampleSchema, 'threadCPUDelta');
        const hasCpu = typeof cpu === 'number' && Number.isFinite(cpu);
        if (hasCpu) { cpuDeltaSumRaw += cpu; cpuDeltaCount += 1; }
        sourceSamples.push([sampleTime - (profileStartMs + profileEndMs) / 2, resolved.category, resolved.subcategory, hasCpu ? cpu : null]);
      }
      const selectedSamples = capped(sourceSamples, MAX_SAMPLES_PER_GAP);
      const allMarkers = markerCandidates.filter((marker) => markerIntersects(marker, expandedStart, expandedEnd))
        .map((marker) => markerEvent(marker, start.innerWindowID));
      const selectedMarkers = capped(allMarkers, MAX_MARKERS_PER_GAP);
      const markerCountsByLabelPhase = {};
      for (const marker of allMarkers) {
        const key = `${marker.label}/phase-${marker.phase}`;
        markerCountsByLabelPhase[key] = (markerCountsByLabelPhase[key] || 0) + 1;
      }
      return {
        gapIndex: gap.gapIndex,
        gapMs: gap.gapMs,
        geometryStartMs: gap.startMs,
        geometryEndMs: gap.endMs,
        mappedProfileStartMs: profileStartMs,
        mappedProfileEndMs: profileEndMs,
        mappingUncertaintyMs: uncertaintyMs,
        sampleCount: sourceSamples.length,
        categoryCounts,
        cpuDeltaSumRaw: cpuDeltaCount ? cpuDeltaSumRaw : null,
        cpuDeltaCount,
        sourceSamples: selectedSamples.items,
        sourceSamplesTruncated: selectedSamples.truncated,
        markerCount: allMarkers.length,
        markerCountsByLabelPhase,
        markers: selectedMarkers.items,
        markersTruncated: selectedMarkers.truncated,
      };
    });

    return {
      ...safeWindowMetadata(input),
      pageMarks: { startName: input.pageMarks.startName, endName: input.pageMarks.endName, startMs: pageStartMs, endMs: pageEndMs },
      profileMarks: { startMs: start.time, endMs: end.time },
      alignment: { offsetStartMs, offsetEndMs, offsetMs, disagreementMs, uncertaintyMs, accepted: true },
      innerWindowID: start.innerWindowID,
      processType: process.meta?.processType ?? 'unknown',
      threadName: thread.name,
      sampleScope: 'GeckoMain thread samples; CPU delta values are raw profiler units, not application CPU utilization.',
      thresholdMs,
      geometryTimestampCount: ordered.length,
      outlierGapCount: gaps.length,
      selectedGapCount: attributedGaps.length,
      selectedGapLimit: MAX_GAPS,
      gaps: attributedGaps,
    };
  });

  return {
    profile: {
      version: profile.meta.version,
      startTimeMs: Number.isFinite(profile.meta.startTime) ? profile.meta.startTime : null,
      intervalMs: Number.isFinite(profile.meta.interval) ? profile.meta.interval : null,
      profilingStartTimeMs: Number.isFinite(profile.meta.profilingStartTime) ? profile.meta.profilingStartTime : null,
      profilingEndTimeMs: Number.isFinite(profile.meta.profilingEndTime) ? profile.meta.profilingEndTime : null,
      configurationFeatures: Array.isArray(profile.meta.configuration?.features)
        ? profile.meta.configuration.features.filter((feature) => typeof feature === 'string').slice(0, 32)
        : [],
    },
    categories,
    windows: outputWindows,
  };
}

module.exports = { extractProfile };
