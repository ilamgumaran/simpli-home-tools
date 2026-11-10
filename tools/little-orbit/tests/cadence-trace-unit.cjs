// SPDX-License-Identifier: LicenseRef-Simpli-Noncommercial-1.0
// Copyright (C) 2026 ilamgumaran and contributors
'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const vm = require('node:vm');
const cadenceAPI = require('../frame-cadence.js');
const {installCadenceTrace, writeTrace, emitTrace} = require('./cadence-trace.cjs');

let nextHandle = 1;
const queue = new Map();
let perfNow = 91.125;
let performanceCalls = 0;
const sandbox = {
  console,
  document: {visibilityState: 'visible'},
  performance: {now: () => { performanceCalls++; return perfNow; }},
  requestAnimationFrame(callback) { const id = nextHandle++; queue.set(id, callback); return id; },
  cancelAnimationFrame(id) { queue.delete(id); },
  setTimeout,
  clearTimeout
};
sandbox.globalThis = sandbox;
const context = vm.createContext(sandbox);
vm.runInContext(`(${installCadenceTrace.toString()})()`, context);
vm.runInContext(fs.readFileSync(path.join(__dirname, '..', 'frame-cadence.js'), 'utf8'), context);
const observed = sandbox.DeskFrameCadence;
assert.ok(Object.isFrozen(observed));
assert.ok(Object.isFrozen(observed.create));
assert.equal(typeof observed.create, 'function');
assert.equal(Object.keys(observed).join(','), 'create');
assert.throws(() => sandbox.__clockCadenceTrace.start(0), /factory and policy were not captured/);

const expected = cadenceAPI.create();
const expected2 = cadenceAPI.create();
assert.throws(() => sandbox.__clockCadenceTrace.start(0), /factory and policy were not captured/);
const policy = observed.create();
assert.ok(Object.isFrozen(policy));
for (const [at, lowPower] of [[0, true], [16.666666666666668, true], [33.333333333333336, true], [42, false], [50, true], [83.33333333333334, true]]) {
  assert.equal(policy.shouldDraw(at, lowPower), expected.shouldDraw(at, lowPower));
}
policy.reset();
expected.reset();
assert.equal(policy.shouldDraw(12.3456789012345, true), expected.shouldDraw(12.3456789012345, true));
assert.equal(queue.size, 0, 'inactive policy calls and factory creation do not start the observer');
assert.equal(performanceCalls, 0, 'inactive policy calls do not read performance.now');

const trace = sandbox.__clockCadenceTrace;
assert.throws(() => trace.stop(0), /not active/);
trace.start(1000.123456789);
assert.equal(queue.size, 1, 'start schedules the native observer');
const observerID = [...queue.keys()][0];
const firstObserver = queue.get(observerID);
queue.delete(observerID);
firstObserver(17.123456789);
assert.equal(queue.size, 1, 'observer schedules the next native callback');
perfNow = 99.987654321;
const accepted = policy.shouldDraw(2000.0000000003, true);
assert.equal(accepted, expected.shouldDraw(2000.0000000003, true));
const policy2 = observed.create();
assert.equal(policy2.shouldDraw(7.0000000001, false), expected2.shouldDraw(7.0000000001, false));
perfNow = 100.000000001;
assert.equal(policy.shouldDraw(2016.6666666667, false), expected.shouldDraw(2016.6666666667, false));
assert.throws(() => policy.shouldDraw(NaN, true), {name: 'RangeError', message: 'RAF timestamp must be a finite nonnegative number'});
assert.throws(() => expected.shouldDraw(NaN, true), {name: 'RangeError', message: 'RAF timestamp must be a finite nonnegative number'});
sandbox.document.visibilityState = 'hidden';
const result = trace.stop(2001.000000009);
assert.equal(queue.size, 0, 'stop cancels pending native observer');
assert.equal(result.start, 1000.123456789);
assert.equal(result.end, 2001.000000009);
assert.deepEqual(JSON.parse(JSON.stringify(result.native)), [[17.123456789, 91.125]]);
assert.deepEqual(JSON.parse(JSON.stringify(result.app)), [
  [1, 2000.0000000003, 99.987654321, true, accepted],
  [2, 7.0000000001, 99.987654321, false, true],
  [1, 2016.6666666667, 100.000000001, false, expected.shouldDraw(2016.6666666667, false)]
]);
assert.equal(result.createdPolicyCount, 2);
assert.deepEqual(JSON.parse(JSON.stringify(result.visibility)), {start: 'visible', end: 'hidden'});
assert.deepEqual(JSON.parse(JSON.stringify(result.nativeColumns)), ['timestamp', 'performance.now']);
trace.start(1); // A subsequent sample starts with fresh arrays.
assert.equal(queue.size, 1);
const pendingID = [...queue.keys()][0];
trace.stop(2);
assert.equal(queue.has(pendingID), false);

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'cadence-trace-unit-'));
try {
  const destination = path.join(tmp, 'clock-diagnostics.jsonl');
  const contextData = {suite: 'unit', form: 'single-file', browserVersion: 'test/β 🌒 café', viewport: {width: 1440.125, height: 900}, dpr: 1.25, mode: 'low-power', privatePath: '/should/not/be/saved'};
  const data = {metrics: {fps: 29.987654321}, geometryTimes: [0.0000000001, 1.234567890123], trace: result, fullURL: 'https://private.invalid/session'};
  const record = writeTrace('cadence-sample', contextData, data, {destination});
  assert.equal(record.schemaVersion, 1);
  assert.equal(record.context.browserVersion, 'test/β 🌒 café');
  assert.equal(record.context.privatePath, undefined);
  assert.equal(record.data.fullURL, undefined);
  assert.equal(record.data.geometryTimes[1], 1.234567890123);

  const cadenceContext = {
    suite: 'motion', form: 'hosted', browser: 'Chromium', browserVersion: '131.0',
    lowPower: true, deviceScaleFactor: 1.5, dpr: 1.5, viewport: {width: 1280, height: 720, privatePath: '/omit'}, mode: 'low-power'
  };
  const cadenceData = {
    metrics: {fps: 30.00000001, p95: 33.333333333}, start: 10.000000001, end: 110.000000009,
    native: [[10.125, 10.875], [26.791666667, 27.125]], app: [[4, 10.125, 10.9, true, true], [4, 26.791666667, 27.2, true, false]],
    nativeColumns: ['timestamp', 'performance.now'],
    appColumns: ['policyID', 'at', 'performanceAtEntry', 'lowPower', 'accepted'],
    createdPolicyCount: 1, visibility: {start: 'visible', end: 'visible'},
    geometryTimesMs: [10.125000001, 43.456789123], geometryStartMs: 10.000000001, geometryEndMs: 110.000000009,
    fullURL: 'https://private.invalid/?token=x', env: {secret: 'omit'}
  };
  const cadenceRecord = writeTrace('cadence', cadenceContext, cadenceData, {destination});
  assert.deepEqual(cadenceRecord.context, {
    suite: 'motion', form: 'hosted', browser: 'Chromium', browserVersion: '131.0', lowPower: true,
    deviceScaleFactor: 1.5, dpr: 1.5, viewport: {width: 1280, height: 720}, mode: 'low-power'
  });
  assert.equal(JSON.stringify(cadenceRecord.data), JSON.stringify({
    metrics: cadenceData.metrics, start: cadenceData.start, end: cadenceData.end, native: cadenceData.native,
    app: cadenceData.app, nativeColumns: cadenceData.nativeColumns, appColumns: cadenceData.appColumns,
    createdPolicyCount: cadenceData.createdPolicyCount, visibility: cadenceData.visibility,
    geometryTimesMs: cadenceData.geometryTimesMs, geometryStartMs: cadenceData.geometryStartMs, geometryEndMs: cadenceData.geometryEndMs
  }));

  const navigationContext = {suite: 'navigation', form: 'single-file', browser: 'Firefox', browserVersion: '132', lowPower: false, deviceScaleFactor: 2, viewport: {width: 800, height: 600}};
  const navigationData = {
    outcome: 'failure', elapsedMs: 123.456789, errorName: 'TimeoutError',
    events: [
      {atMs: 1.234, type: 'request', url: 'https://example.test/assets/one.js?token=secret', method: 'GET'},
      {atMs: 3.456, type: 'requestfailed', url: 'https://example.test/assets/two.css?secret=1', method: 'GET', failureText: 'net::ERR_TIMED_OUT'}
    ],
    droppedEventCount: 2, pageErrorCount: 1, crashCount: 0, pendingRequestCount: 1,
    pendingRequests: [{url: 'https://example.test/pending.css?session=private', method: 'GET'}],
    snapshot: {readyState: 'interactive', visibility: 'visible', title: 'Test', resourceCount: 1, resources: [{url: 'https://example.test/app.js?secret=1', startTime: 0.125}]},
    privatePath: '/omit', fullURL: 'https://private.invalid/?token=x', env: 'omit'
  };
  const navigationRecord = writeTrace('navigation', navigationContext, navigationData, {destination});
  assert.equal(navigationRecord.data.outcome, 'failure');
  assert.equal(navigationRecord.data.elapsedMs, 123.456789);
  assert.equal(navigationRecord.data.pendingRequestCount, 1);
  assert.deepEqual(navigationRecord.data.events.map(event => event.type), ['request', 'requestfailed']);
  assert.equal(navigationRecord.data.events[0].url, 'https://example.test/assets/one.js');
  assert.equal(navigationRecord.data.events[1].failureText, 'net::ERR_TIMED_OUT');
  assert.equal(navigationRecord.data.pendingRequests[0].url, 'https://example.test/pending.css');
  assert.equal(navigationRecord.data.snapshot.resources[0].url, 'https://example.test/app.js');
  assert.equal(navigationRecord.data.snapshot.resourceCount, 1);
  assert.equal(navigationRecord.data.privatePath, undefined);
  assert.equal(navigationRecord.data.fullURL, undefined);
  const stored = fs.readFileSync(destination, 'utf8').trimEnd().split('\n').map(JSON.parse);
  assert.equal(JSON.stringify(stored), JSON.stringify([record, cadenceRecord, navigationRecord]));

  for (const fullRecord of [record, cadenceRecord, navigationRecord]) {
    assert.ok(fullRecord.traceID);
    const notices = [];
    const chunkCount = emitTrace(fullRecord, {write: line => notices.push(line)});
    assert.equal(notices.length, chunkCount);
    const payloadChunks = notices.map((line, index) => {
      assert.match(line, new RegExp(`^::notice title=${fullRecord.traceID} ${index + 1}/${notices.length}::`));
      const payload = line.split('::').at(-1);
      assert.ok(Buffer.byteLength(payload, 'ascii') <= 2400);
      return payload;
    });
    const decoded = Buffer.from(payloadChunks.join(''), 'base64').toString('utf8');
    assert.equal(decoded, JSON.stringify(fullRecord), 'notice chunks reassemble the exact full event');
  }
  assert.equal(JSON.parse(JSON.stringify(navigationRecord)).context.browser, 'Firefox');
  assert.equal(JSON.parse(JSON.stringify(record)).context.browserVersion, 'test/β 🌒 café');
} finally {
  fs.rmSync(tmp, {recursive: true, force: true});
}

console.log('PASS cadence trace: real policy wrapper, lifecycle, exact trace and artifact/notice round trip');
