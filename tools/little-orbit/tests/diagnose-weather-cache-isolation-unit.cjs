// SPDX-License-Identifier: LicenseRef-Simpli-Noncommercial-1.0
// Copyright (C) 2026 ilamgumaran and contributors
'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {
  CACHE_MARKER, HIGH_DPI_START, VIEWPORT_MARKER, CONDITIONS, WILLIAMS4,
  transformVerifier, loadDerivedVerifier, stableJSON, buildCaseRecord
} = require('./diagnose-weather-cache-isolation.cjs');
const crypto = require('node:crypto');

const source = fs.readFileSync(path.join(__dirname, 'verify-weather-habitat.cjs'), 'utf8');
const prefix = source.slice(0, source.indexOf(CACHE_MARKER));
const present = transformVerifier(source, 'present');
const highDpiStart = prefix.indexOf(HIGH_DPI_START);
const highDpiEnd = prefix.indexOf(VIEWPORT_MARKER, highDpiStart);
const absentPrelude = prefix.slice(0, highDpiStart) + prefix.slice(highDpiEnd);
const absent = transformVerifier(source, 'absent');

assert.ok(present.startsWith(prefix), 'sibling-present transform must retain the canonical prelude byte-for-byte');
assert.ok(absent.startsWith(absentPrelude), 'sibling-absent transform must remove only the high-DPI block');
for (const code of [present, absent]) {
  assert.match(code, /offline=true;await page\.reload\(\);/);
  assert.match(code, /waitForFunction\(\(\)=>DeskHabitatWeather\.get\(\)\.status==='cached'\)/);
  assert.doesNotMatch(code, /const validCache=|temperature_2m_max=\[null\]|addInitScript\(\(\{key,saved\}\)/);
  assert.match(code, /return \{cacheAssertion:'passed'\};/);
}
assert.equal((present.match(/const highDpi=/g) || []).length, 1);
assert.equal((absent.match(/const highDpi=/g) || []).length, 0);
assert.ok(absent.includes(VIEWPORT_MARKER), 'sibling-absent transform must keep the following viewport reset');
assert.throws(() => transformVerifier(source.replace(CACHE_MARKER, ''), 'present'), /cached-restoration marker/);
assert.throws(() => transformVerifier(source.replace(HIGH_DPI_START, ''), 'absent'), /high-DPI sibling marker/);
assert.throws(() => transformVerifier(source, 'unknown'), /Unknown sibling/);
assert.equal(typeof loadDerivedVerifier(source, 'present').verify, 'function');
assert.equal(typeof loadDerivedVerifier(source, 'absent').verify, 'function');

assert.equal(CONDITIONS.length, 4);
assert.equal(WILLIAMS4.length, 4);
for (let position = 0; position < 4; position++) assert.deepEqual(WILLIAMS4.map(order => order[position]).sort(), [0, 1, 2, 3]);
const directedAdjacencies = WILLIAMS4.flatMap(order => order.slice(0, -1).map((condition, index) => `${condition}>${order[index + 1]}`));
assert.equal(directedAdjacencies.length, 12);
assert.equal(new Set(directedAdjacencies).size, 12, 'all directed adjacencies must occur exactly once');

const unorderedA = {z: 2, nested: {b: true, a: 1}, a: 'x'};
const unorderedB = {a: 'x', nested: {a: 1, b: true}, z: 2};
assert.equal(stableJSON(unorderedA), stableJSON(unorderedB));
const row = {schemaVersion: 1, caseID: 'case-1', condition: {form: 'hosted', sibling: 'present'}};
const caseRecord = buildCaseRecord(row);
assert.equal(caseRecord.traceID, crypto.createHash('sha256').update(stableJSON(row)).digest('hex'));
assert.equal(caseRecord.traceID, buildCaseRecord({condition: row.condition, caseID: row.caseID, schemaVersion: row.schemaVersion}).traceID,
  'traceID must be stable across insertion order');
process.stdout.write('PASS weather cache isolation transform and Williams schedule\n');
