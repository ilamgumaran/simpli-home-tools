// SPDX-License-Identifier: LicenseRef-Simpli-Noncommercial-1.0
// Copyright (C) 2026 ilamgumaran and contributors
'use strict';

const {createHash} = require('node:crypto');

const conditions = Object.freeze(['blank', 'full', 'static-hidden', 'world-hidden']);
const profiles = Object.freeze([
  Object.freeze({id: 'windows-firefox-dashboard-normal', platform: 'win32', browser: 'firefox', view: 'dashboard', viewport: {width: 854, height: 480}, dpr: 1, lowPower: false}),
  Object.freeze({id: 'macos-chromium-dashboard-low', platform: 'darwin', browser: 'chromium', view: 'dashboard', viewport: {width: 854, height: 480}, dpr: 1, lowPower: true}),
  Object.freeze({id: 'linux-chromium-immersive-normal', platform: 'linux', browser: 'chromium', view: 'immersive', viewport: {width: 1280, height: 720}, dpr: 2, lowPower: false})
]);

function readConfig(env = process.env, platform = process.platform) {
  const profileName = env.CLOCK_DIAGNOSTIC_PROFILE || 'platform';
  if (!['platform', 'all'].includes(profileName)) throw new Error('CLOCK_DIAGNOSTIC_PROFILE must be platform or all');
  const repeatsValue = env.CLOCK_DIAGNOSTIC_REPEATS ?? '4';
  if (!/^\d+$/.test(String(repeatsValue))) throw new Error('CLOCK_DIAGNOSTIC_REPEATS must be an integer divisible by 4 and no greater than 8');
  const repeats = Number(repeatsValue);
  if (repeats < 4 || repeats > 8 || repeats % 4 !== 0) throw new Error('CLOCK_DIAGNOSTIC_REPEATS must be 4 or 8');
  let round = null;
  if (env.CLOCK_DIAGNOSTIC_ROUND !== undefined && env.CLOCK_DIAGNOSTIC_ROUND !== '') {
    if (!/^\d+$/.test(String(env.CLOCK_DIAGNOSTIC_ROUND))) throw new Error('CLOCK_DIAGNOSTIC_ROUND must be an integer from 0 through CLOCK_DIAGNOSTIC_REPEATS - 1');
    round = Number(env.CLOCK_DIAGNOSTIC_ROUND);
    if (round >= repeats) throw new Error('CLOCK_DIAGNOSTIC_ROUND must be less than CLOCK_DIAGNOSTIC_REPEATS');
  }
  const selected = profileName === 'all' ? [...profiles] : profiles.filter(profile => profile.platform === platform);
  if (!selected.length) throw new Error(`No motion diagnostic profile for platform ${platform}`);
  return {profileName, repeats, round, profiles: selected};
}

const williamsOrders = Object.freeze([
  Object.freeze([0, 1, 3, 2]),
  Object.freeze([1, 2, 0, 3]),
  Object.freeze([2, 3, 1, 0]),
  Object.freeze([3, 0, 2, 1])
]);

function makeSchedule(config) {
  const schedule = [];
  const rounds = config.round === null ? Array.from({length: config.repeats}, (_, index) => index) : [config.round];
  for (const profile of config.profiles) {
    for (const round of rounds) {
      const order = williamsOrders[round % williamsOrders.length];
      order.forEach((conditionIndex, position) => schedule.push({profile, round, position, condition: conditions[conditionIndex]}));
    }
  }
  return schedule;
}

function percentile95(values) {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length * 0.95)];
}

function summarize(data) {
  const gaps = values => values.slice(1).map((value, index) => value - values[index]);
  const stats = values => ({count: values.length, p95: percentile95(gaps(values)), maxGap: gaps(values).length ? Math.max(...gaps(values)) : null});
  const durationMs = data.start !== null && data.end !== null ? data.end - data.start : null;
  const geometry = data.geometryTimes === null ? null : stats(data.geometryTimes);
  if (geometry && durationMs > 0) geometry.fps = data.geometryTimes.length * 1000 / durationMs;
  const native = stats(data.native.map(entry => entry[0]));
  const nativeActual = stats(data.native.map(entry => entry[1]));
  if (durationMs > 0) native.fps = data.native.length * 1000 / durationMs;
  if (durationMs > 0) nativeActual.fps = data.native.length * 1000 / durationMs;
  const appTimes = data.app.map(entry => entry[2]);
  const app = stats(appTimes);
  if (durationMs > 0) app.fps = data.app.length * 1000 / durationMs;
  return {durationMs, native, nativeActual, app: data.geometryTimes === null ? null : app, geometry};
}

function stableJSON(value) {
  if (Array.isArray(value)) return `[${value.map(stableJSON).join(',')}]`;
  if (value && typeof value === 'object') return `{${Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${stableJSON(value[key])}`).join(',')}}`;
  return JSON.stringify(value);
}

function makeRecord(provenance, context, data) {
  const record = {schemaVersion: 1, kind: 'motion-control', provenance, context, data};
  record.traceID = createHash('sha256').update(stableJSON(record)).digest('hex');
  return record;
}

module.exports = {profiles, conditions, readConfig, makeSchedule, percentile95, summarize, makeRecord};
