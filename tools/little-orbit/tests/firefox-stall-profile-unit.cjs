'use strict';

const assert = require('node:assert/strict');
const { extractProfile } = require('./firefox-stall-profile.cjs');

function table(schema, data) { return { schema, data }; }

function makeThread({ marks = true, duplicateStart = false, mismatch = false, threadName = 'GeckoMain', manySamples = false, manyMarkers = false } = {}) {
  const stringTable = ['UserTiming', 'clock:start', 'clock:end', 'requestAnimationFrame callbacks', 'Styles', 'private-url-must-not-escape', 'Paint', 'RefreshDriverTick'];
  const userMark = (name, time, innerWindowID) => [0, time, 0, 0, 0, {
    type: 'UserTiming', name, entryType: 'mark', innerWindowID,
  }];
  const markerRows = [];
  if (marks) {
    markerRows.push(userMark('clock:start', 2000, 55), userMark('clock:end', mismatch ? 4102 : 4101, mismatch ? 56 : 55));
    if (duplicateStart) markerRows.push(userMark('clock:start', 2000.1, 55));
  }
  markerRows.push([3, 1003, 0, 2, 7, { type: 'requestAnimationFrame callbacks', innerWindowID: 55, url: 'private-url-must-not-escape' }]);
  markerRows.push([3, 0, 1010, 3, 7, { type: 'requestAnimationFrame callbacks', innerWindowID: 55 }]);
  markerRows.push([4, 1011, 0, 2, 3, { type: 'Styles', innerWindowID: 55, selector: '.private' }]);
  markerRows.push([6, 1013, 1014, 1, 7, { type: 'Paint', innerWindowID: 55 }]);
  markerRows.push([7, 1015, 0, 2, 7, { type: 'RefreshDriverTick', innerWindowID: 66 }]);
  markerRows.push([0, 0, 1016, 3, 7, { type: 'RefreshDriverTick' }]);
  if (manyMarkers) for (let i = 0; i < 80; i++) markerRows.push([3, 1000 + i, 0, 2, 7, { type: 'requestAnimationFrame callbacks', innerWindowID: 55 }]);
  const sampleRows = [
    [0, 1002, null, null, 1.5],
    [0, 1005, null, null, 2.5],
    [1, 1012, null, null, 3],
    [0, 1200, null, null, 99],
  ];
  if (manySamples) for (let i = 0; i < 100; i++) sampleRows.push([0, 1000 + i * 0.1, null, null, 0.25]);
  return {
    name: threadName,
    stringTable,
    markers: table({ name: 0, startTime: 1, endTime: 2, phase: 3, category: 4, data: 5 }, markerRows),
    samples: table({ stack: 0, time: 1, eventDelay: 2, argumentValues: 3, threadCPUDelta: 4 }, sampleRows),
    stackTable: table({ prefix: 0, frame: 1 }, [[null, 0], [0, 1]]),
    frameTable: table({ location: 0, relevantForJS: 1, innerWindowID: 2, implementation: 3, line: 4, column: 5, category: 6, subcategory: 7 }, [
      [5, false, 0, null, null, null, 1, 0],
      [5, false, 0, null, null, null, 4, 2],
    ]),
  };
}

function makeProfile(options = {}) {
  return {
    meta: {
      version: 34, startTime: 123, interval: 0.5, profilingStartTime: 10, profilingEndTime: 5000,
      categories: [
        { name: 'Idle', subcategories: ['Other'] },
        { name: 'JavaScript', subcategories: ['Other', 'Parsing'] },
        { name: 'Layout', subcategories: ['Other', 'Reflow'] },
        { name: 'Graphics', subcategories: ['Other', 'Paint'] },
        { name: 'DOM', subcategories: ['Other', 'Events', 'Style'] },
        { name: 'Other', subcategories: ['Other'] },
        { name: 'Other', subcategories: ['Other'] },
        { name: 'Graphics', subcategories: ['Other'] },
      ],
    },
    processes: [
      { meta: { processType: 0 }, threads: [makeThread({ marks: false })] },
      { meta: { processType: 2 }, threads: [makeThread(options)] },
    ],
  };
}

const windowInput = {
  id: 'low', label: 'low case', mode: 'low', kind: 'low', thresholdMs: 40,
  pageMarks: { startName: 'clock:start', endName: 'clock:end', startMs: 1000, endMs: 3100 },
  geometryStartMs: 0, geometryEndMs: 250, geometryTimesMs: [0, 100, 150, 250],
};

const result = extractProfile(makeProfile(), [windowInput]);
assert.equal(result.profile.version, 34);
assert.equal(result.profile.intervalMs, 0.5);
assert.equal(result.windows.length, 1);
const win = result.windows[0];
assert.equal(win.innerWindowID, 55, 'the page marks identify the child content thread');
assert.equal(win.processType, 2);
assert.equal(win.kind, 'low');
assert.equal(win.thresholdMs, 40);
assert.equal(win.alignment.offsetStartMs, 1000);
assert.equal(win.alignment.offsetEndMs, 1001);
assert.equal(win.alignment.offsetMs, 1000.5);
assert.equal(win.alignment.uncertaintyMs, 4);
assert.equal(win.outlierGapCount, 3);
assert.deepEqual(win.gaps.map((gap) => gap.gapIndex), [0, 1, 2], 'equal duration gaps retain their end order');
assert.equal(win.gaps[0].categoryCounts['JavaScript/Other'], 2, 'undefined sample categories resolve from the top stack frame');
assert.equal(win.gaps[0].categoryCounts['DOM/Style'], 1, 'the stack prefix supplies the nearest categorized frame');
assert.equal(win.gaps[0].cpuDeltaSumRaw, 7);
assert.equal(win.gaps[0].markers.some((marker) => marker.label === 'requestAnimationFrame callbacks' && marker.phase === 2), true);
assert.equal(win.gaps[0].markers.some((marker) => marker.label === 'requestAnimationFrame callbacks' && marker.phase === 3), true);
assert.equal(win.gaps[0].markers.some((marker) => marker.label === 'Paint' && marker.phase === 1), true);
assert.equal(win.gaps[0].markers.find((marker) => marker.label === 'RefreshDriverTick' && marker.phase === 2).scope, 'other-window');
assert.equal(win.gaps[0].markers.find((marker) => marker.label === 'RefreshDriverTick' && marker.phase === 3).scope, 'process');
assert.deepEqual(win.gaps[0].markers.find((marker) => marker.label === 'Styles'), {
  startMs: 1011, endMs: null, eventTimeMs: 1011, phase: 2, label: 'Styles', type: 'Styles', category: 3,
  scope: 'page', innerWindowID: 55,
}, 'raw START markers retain their start event without inventing an end time');
assert.deepEqual(win.gaps[0].markers.find((marker) => marker.label === 'requestAnimationFrame callbacks' && marker.phase === 3), {
  startMs: null, endMs: 1010, eventTimeMs: 1010, phase: 3, label: 'requestAnimationFrame callbacks',
  type: 'requestAnimationFrame callbacks', category: 7, scope: 'page', innerWindowID: 55,
}, 'raw END markers retain their end event without inventing a start time');
assert.equal(win.gaps[0].markerCountsByLabelPhase['requestAnimationFrame callbacks/phase-2'], 1);
assert.equal(win.gaps[0].markerCountsByLabelPhase['requestAnimationFrame callbacks/phase-3'], 1);
assert.equal(win.gaps[0].markers.some((marker) => marker.label === 'private-url-must-not-escape'), false);
assert.equal(JSON.stringify(result).includes('private-url-must-not-escape'), false, 'raw profile marker payload strings are excluded');

const capped = extractProfile(makeProfile({ manySamples: true, manyMarkers: true }), [{ ...windowInput, geometryTimesMs: [0, 100] }]).windows[0].gaps[0];
assert.equal(capped.sourceSamples.length, 32);
assert.ok(capped.sourceSamplesTruncated > 0);
assert.equal(capped.markers.length, 16);
assert.ok(capped.markersTruncated > 0);
assert.ok(capped.markerCount > capped.markers.length);
assert.equal(capped.markerCountsByLabelPhase['requestAnimationFrame callbacks/phase-2'], 81,
  'label and phase counts are computed before marker truncation');
assert.equal(capped.markers[0].label, 'requestAnimationFrame callbacks');

const manyGapsInput = { ...windowInput, thresholdMs: 10, geometryTimesMs: Array.from({ length: 22 }, (_, i) => i * 20) };
const bounded = extractProfile(makeProfile(), [manyGapsInput]).windows[0];
assert.equal(bounded.outlierGapCount, 21);
assert.equal(bounded.selectedGapCount, 4);
assert.deepEqual(bounded.gaps.map((gap) => gap.gapIndex), [0, 1, 2, 3]);
const inferredThreshold = extractProfile(makeProfile(), [{ ...windowInput, thresholdMs: undefined, kind: 'normal', lowPower: false }]).windows[0];
assert.equal(inferredThreshold.thresholdMs, 31);
assert.equal(inferredThreshold.lowPower, false);

assert.throws(() => extractProfile(makeProfile(), [{ ...windowInput, pageMarks: { ...windowInput.pageMarks, endMs: 4000 } }]), /alignment disagreement/);
assert.throws(() => extractProfile(makeProfile({ marks: false }), [windowInput]), /timing marks were not found/);
assert.throws(() => extractProfile(makeProfile({ duplicateStart: true }), [windowInput]), /missing or duplicated/);
assert.throws(() => extractProfile(makeProfile({ mismatch: true }), [windowInput]), /different innerWindowID/);
assert.throws(() => extractProfile(makeProfile(), [{ ...windowInput, pageMarks: { ...windowInput.pageMarks, startName: 'other:start' } }]), /missing or duplicated/);
assert.throws(() => extractProfile({ ...makeProfile(), meta: { ...makeProfile().meta, version: 35 } }, [windowInput]), /unsupported Gecko profile version/);
assert.throws(() => extractProfile(makeProfile(), [{ ...windowInput, lowPower: false }]), /lowPower must match/);
assert.throws(() => extractProfile(makeProfile(), [{ ...windowInput, geometryTimesMs: [0, 100, 90] }]), /geometry timestamps must be ordered/);
assert.throws(() => extractProfile(makeProfile(), [{ ...windowInput, geometryStartMs: -1 }]), /geometry endpoints must be non-negative/);
assert.throws(() => extractProfile(makeProfile(), [{ ...windowInput, pageMarks: { ...windowInput.pageMarks, endMs: 900 } }]), /page mark endpoints must be non-negative and ordered/);

console.log('Firefox stall profile extraction unit checks passed');
