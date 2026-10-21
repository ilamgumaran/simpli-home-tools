const assert = require('node:assert/strict');
const {create} = require('../frame-cadence.js');
const windowsRaf = require('./fixtures/frame-cadence-windows.json');

const period = 1000 / 30;
function times(hz, seconds = 30, jitter = 0) {
  let seed = 20261020;
  const random = () => { seed = (1664525 * seed + 1013904223) >>> 0; return seed / 2 ** 32; };
  const frames = Array.from({length: Math.floor(hz * seconds)}, (_, i) => i * 1000 / hz + (random() * 2 - 1) * jitter);
  assert.ok(frames.every((at, i) => i === 0 || at > frames[i - 1]), 'Fixture RAF callbacks must be ordered');
  return frames.map(at => at - frames[0]);
}
function sample(callbacks, shouldDraw, elapsed = callbacks.at(-1) - callbacks[0]) {
  const painted = callbacks.filter(shouldDraw);
  const gaps = painted.slice(1).map((at, i) => at - painted[i]).sort((a, b) => a - b);
  return {fps: painted.length * 1000 / elapsed,
    min: gaps[0], p95: gaps[Math.floor(gaps.length * .95)], max: gaps.at(-1), painted};
}

for (const [label, callbacks] of [
  ...[60, 75, 120, 144].map(hz => [`${hz}Hz ideal`, times(hz)]),
  ['60Hz ±3ms', times(60, 30, 3)],
  ['60Hz ±5ms', times(60, 30, 5)],
  ['75Hz ±3ms', times(75, 30, 3)]
]) {
  const cadence = create();
  const result = sample(callbacks, at => cadence.shouldDraw(at, true));
  assert.ok(result.fps >= 26 && result.fps <= 31, `${label}: ${result.fps} updates/s`);
  assert.ok(result.p95 <= 46, `${label}: p95 gap ${result.p95}ms`);
  assert.ok(result.min >= 24 - 1e-8, `${label}: catch-up gap ${result.min}ms`);
  assert.ok(result.max < 100, `${label}: max gap ${result.max}ms`);
}

// At 64Hz, painting every second callback is 32fps. A strict 30Hz phase
// would add 46.875ms triplets often enough to fail the unchanged p95 gate.
const quantized = create();
const at64 = sample(times(64), at => quantized.shouldDraw(at, true));
assert.ok(at64.fps >= 31.5 && at64.fps <= 32.5, `64Hz quantization: ${at64.fps} updates/s`);
assert.ok(at64.p95 <= 46 && at64.min >= 24, `64Hz gaps: ${at64.p95} / ${at64.min}ms`);

// Measured Windows CI callback times have 15.6ms pairs with 18ms variation.
// Discarding debt from a frame accepted up to 4ms early should avoid repeated
// 49ms triplets; test every initial phase rather than one lucky alignment.
assert.equal(windowsRaf.nominalGapsMs.length, 131);
assert.ok(windowsRaf.nominalGapsMs.every(gap => gap > 0 && gap < 24));
const windowsCallbacks = [period];
for (const gap of windowsRaf.nominalGapsMs) windowsCallbacks.push(windowsCallbacks.at(-1) + gap);
for (let step = 0; step <= 100; step++) {
  const phase = step * period / 100;
  const cadence = create();
  assert.equal(cadence.shouldDraw(period - phase, true), true);
  const result = sample(windowsCallbacks, at => cadence.shouldDraw(at, true), windowsRaf.elapsedMs);
  assert.ok(result.fps >= 26 && result.fps <= 31, `Windows phase ${step}: ${result.fps} updates/s`);
  assert.ok(result.p95 <= 46 && result.max < 100, `Windows phase ${step}: p95 ${result.p95}, max ${result.max}ms`);
  assert.ok(result.min >= 24 - 1e-8, `Windows phase ${step}: short catch-up ${result.min}ms`);
}

// The former reset-to-now limiter misses paint slots on ordered, jittered RAF.
const jittered = times(60, 30, 3);
let oldLast = 0;
const old = sample(jittered, at => {
  if (at - oldLast < period - 2) return false;
  oldLast = at;
  return true;
});
const corrected = create();
const improved = sample(jittered, at => corrected.shouldDraw(at, true));
assert.ok(old.p95 > 46 && improved.p95 <= 46, 'Jitter fixture must distinguish the old limiter');

let cadence = create();
assert.ok(Object.isFrozen(cadence));
assert.equal(cadence.shouldDraw(0, true), true);
assert.equal(cadence.shouldDraw(50, true), true);
assert.equal(cadence.shouldDraw(66.67, true), false, 'No 50/16ms catch-up pair');
assert.equal(cadence.shouldDraw(83.34, true), true);
cadence.reset();
assert.equal(cadence.shouldDraw(0, true), true);
assert.equal(cadence.shouldDraw(33.34, true), true);
assert.equal(cadence.shouldDraw(1033.34, true), true);
assert.equal(cadence.shouldDraw(1050, true), false, 'No replay after a long RAF outage');
assert.equal(cadence.shouldDraw(1066.68, true), true);

cadence.reset();
assert.equal(cadence.shouldDraw(0, true), true);
assert.equal(cadence.shouldDraw(28, true), false);
assert.equal(cadence.shouldDraw(27, true), true, 'Backward time after a skipped callback rebases');
assert.equal(cadence.shouldDraw(44, true), false);
cadence.reset();
assert.equal(cadence.shouldDraw(44, true), true);

cadence.reset();
assert.equal(cadence.shouldDraw(0, true), true);
assert.equal(cadence.shouldDraw(16.67, true), false);
assert.equal(cadence.shouldDraw(16.67, false), true, 'Normal mode draws each callback');
assert.equal(cadence.shouldDraw(25, false), true);
assert.equal(cadence.shouldDraw(41.67, true), false, 'Low power resumes from the latest normal paint');
assert.equal(cadence.shouldDraw(58.34, true), true);
const other = create();
assert.equal(other.shouldDraw(0, true), true);
assert.equal(other.shouldDraw(33.34, true), true);
assert.equal(cadence.shouldDraw(91.67, true), true, 'Independent instances must not share phase');

for (const value of [NaN, Infinity, -Infinity, -1, '1', null]) {
  assert.throws(() => cadence.shouldDraw(value, true), RangeError);
}
for (const value of [0, 1, null, undefined, 'true']) {
  assert.throws(() => cadence.shouldDraw(0, value), TypeError);
}

// No scheduler can create paints if RAF itself arrives below the required rate.
cadence = create();
const slow = sample(times(20), at => cadence.shouldDraw(at, true));
assert.ok(slow.fps <= 21 && slow.fps >= 19);
assert.equal(slow.painted.length, times(20).length);
console.log('PASS frame cadence: phase, jitter, stall, reversal, modes and independent instances');
