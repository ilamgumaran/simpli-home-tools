// SPDX-License-Identifier: LicenseRef-Simpli-Noncommercial-1.0
// Copyright (C) 2026 ilamgumaran and contributors
'use strict';

const assert = require('node:assert/strict');
const {createHash} = require('node:crypto');
const {conditions, profiles, readConfig, makeSchedule, percentile95, summarize, makeRecord} = require('./motion-control-plan.cjs');

const config = (env, platform = 'linux') => readConfig(env, platform);
const fourRounds = makeSchedule(config({CLOCK_DIAGNOSTIC_REPEATS: '4'}, 'win32'));
assert.equal(fourRounds.length, 16);
for (let round = 0; round < 4; round++) {
  const batch = fourRounds.filter(item => item.round === round);
  assert.deepEqual(batch.map(item => item.position), [0, 1, 2, 3]);
  assert.deepEqual([...batch].map(item => item.condition).sort(), [...conditions].sort());
}
for (const condition of conditions) {
  const positions = fourRounds.filter(item => item.condition === condition).map(item => item.position).sort();
  assert.deepEqual(positions, [0, 1, 2, 3], `${condition} occupies every Williams position`);
}

const eightRounds = makeSchedule(config({CLOCK_DIAGNOSTIC_REPEATS: '8'}, 'darwin'));
assert.equal(eightRounds.length, 32);
assert.equal(eightRounds.filter(item => item.round === 4)[0].condition, eightRounds[0].condition);
assert.equal(makeSchedule(config({CLOCK_DIAGNOSTIC_ROUND: '2'}, 'linux')).length, 4);
assert.deepEqual(config({}, 'win32').profiles.map(item => item.id), ['windows-firefox-dashboard-normal']);
assert.deepEqual(config({}, 'darwin').profiles.map(item => item.id), ['macos-chromium-dashboard-low']);
assert.deepEqual(config({}, 'linux').profiles.map(item => item.id), ['linux-chromium-immersive-normal']);
assert.equal(config({CLOCK_DIAGNOSTIC_PROFILE: 'all'}).profiles.length, 3);
assert.deepEqual(profiles.map(item => [item.viewport.width, item.viewport.height, item.dpr]), [[854, 480, 1], [854, 480, 1], [1280, 720, 2]]);
for (const env of [
  {CLOCK_DIAGNOSTIC_REPEATS: '3'}, {CLOCK_DIAGNOSTIC_REPEATS: '12'},
  {CLOCK_DIAGNOSTIC_REPEATS: 'four'}, {CLOCK_DIAGNOSTIC_PROFILE: 'windows'},
  {CLOCK_DIAGNOSTIC_ROUND: '4'}, {CLOCK_DIAGNOSTIC_ROUND: '-1'}
]) assert.throws(() => config(env), undefined, JSON.stringify(env));

assert.equal(percentile95([]), null);
assert.equal(percentile95(Array.from({length: 20}, (_, index) => index + 1)), 20);
assert.equal(percentile95([8, 2, 4]), 8);
const raw = {
  start: 100, end: 2200,
  native: [[1, 100.1], [17, 116.8], [34, 133.9]],
  app: [[1, 17, 100.4, false, true], [1, 34, 133.2, false, true]],
  geometryTimes: [105, 139], geometryStart: 100, geometryEnd: 2200
};
const summary = summarize(raw);
assert.equal(summary.durationMs, 2100);
assert.deepEqual(summary.native, {count: 3, p95: 17, maxGap: 17, fps: 3 / 2.1});
assert.equal(summary.nativeActual.count, 3);
assert.ok(Math.abs(summary.nativeActual.p95 - 17.1) < 1e-9);
assert.ok(Math.abs(summary.nativeActual.maxGap - 17.1) < 1e-9);
assert.equal(summary.nativeActual.fps, 3 / 2.1);
assert.equal(summary.app.count, 2);
assert.ok(Math.abs(summary.app.p95 - 32.8) < 1e-9);
assert.ok(Math.abs(summary.app.maxGap - 32.8) < 1e-9);
assert.equal(summary.app.fps, 2 / 2.1);
assert.deepEqual(summary.geometry, {count: 2, p95: 34, maxGap: 34, fps: 2 / 2.1});

const record = makeRecord({gitSHA: 'a'.repeat(40), node: 'v22.0.0', platform: 'linux', arch: 'x64', helperDigest: 'b'.repeat(64)}, {
  group: 'sample', condition: 'full', round: 0, position: 0, viewport: {width: 1280, height: 720}, dpr: 2,
  lowPower: false, browser: 'chromium', browserVersion: 'test', view: 'immersive', channel: 'default', headless: true
}, {...raw, errors: []});
assert.equal(record.schemaVersion, 1);
assert.equal(record.kind, 'motion-control');
assert.deepEqual(record.data.native, raw.native);
assert.deepEqual(record.data.app, raw.app);
assert.deepEqual(record.data.geometryTimes, raw.geometryTimes);
const unsigned = {...record};
delete unsigned.traceID;
const stable = value => Array.isArray(value) ? `[${value.map(stable).join(',')}]` : value && typeof value === 'object'
  ? `{${Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${stable(value[key])}`).join(',')}}` : JSON.stringify(value);
assert.equal(record.traceID, createHash('sha256').update(stable(unsigned)).digest('hex'));

console.log('PASS motion control plan: balanced orders, profile/config validation, p95 summaries and raw record integrity.');
