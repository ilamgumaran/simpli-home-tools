// SPDX-License-Identifier: LicenseRef-Simpli-Noncommercial-1.0
// Copyright (C) 2026 ilamgumaran and contributors
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const {spawn} = require('node:child_process');
const {createHash} = require('node:crypto');
const playwright = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const {installCadenceTrace} = require('./cadence-trace.cjs');
const {extractProfile} = require('./firefox-stall-profile.cjs');
const {emitEvidence} = require('./firefox-stall-notices.cjs');

const root = path.join(__dirname, '..');
const outputPath = path.join(root, 'test-results', 'firefox-stalls.jsonl');
const profileRoot = path.join(root, 'test-results', 'firefox-stall-profiles');
const viewport = Object.freeze({width: 854, height: 480});
const conditions = Object.freeze([
  'full-profiled', 'world-hidden-profiled', 'full-unprofiled', 'world-hidden-unprofiled'
]);
const williamsOrders = Object.freeze([
  Object.freeze([0, 1, 3, 2]), Object.freeze([1, 2, 0, 3]),
  Object.freeze([2, 3, 1, 0]), Object.freeze([3, 0, 2, 1])
]);
const sha256 = value => createHash('sha256').update(value).digest('hex');

function readConfig(env = process.env) {
  let slot = null;
  if (env.CLOCK_STALL_SLOT !== undefined && env.CLOCK_STALL_SLOT !== '') {
    if (!/^\d+$/.test(String(env.CLOCK_STALL_SLOT))) throw new Error('CLOCK_STALL_SLOT must be an integer from 0 through 7');
    slot = Number(env.CLOCK_STALL_SLOT);
    if (slot > 7) throw new Error('CLOCK_STALL_SLOT must be an integer from 0 through 7');
  }
  return {slot};
}

function makeSchedule(config = readConfig()) {
  const all = [];
  for (let round = 0; round < williamsOrders.length; round++) {
    williamsOrders[round].forEach((conditionIndex, position) => all.push({
      condition: conditions[conditionIndex], round, position, globalIndex: all.length
    }));
  }
  if (config.slot === null || config.slot === undefined) return all;
  return all.slice(config.slot * 2, config.slot * 2 + 2).map(item => ({...item, slot: config.slot}));
}

function conditionDetails(condition) {
  if (!conditions.includes(condition)) throw new Error(`Unsupported Firefox stall condition ${condition}`);
  return {hidden: condition.startsWith('world-hidden'), profilerEnabled: condition.endsWith('-profiled')};
}

function safeError(error) {
  return String(error?.message || error).split('\n')[0]
    .replace(/[A-Za-z]:\\[^\s]+/g, '<path>')
    .replace(/\/(?:[^\s/:]+\/)+[^\s:]*/g, '<path>').slice(0, 1200);
}

function getProvenance() {
  let gitSHA = process.env.GITHUB_SHA;
  if (!gitSHA) {
    try { gitSHA = require('node:child_process').execFileSync('git', ['rev-parse', 'HEAD'], {cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore']}).trim(); }
    catch (_) { gitSHA = 'unavailable'; }
  }
  return {
    gitSHA, node: process.version, platform: process.platform, arch: process.arch,
    captureDigest: sha256(fs.readFileSync(__filename)),
    traceDigest: sha256(fs.readFileSync(path.join(__dirname, 'cadence-trace.cjs'))),
    profileExtractorDigest: sha256(fs.readFileSync(path.join(__dirname, 'firefox-stall-profile.cjs')))
  };
}

async function startServer() {
  const server = spawn(process.execPath, [path.join(root, 'server.cjs')], {
    cwd: root, env: {...process.env, PORT: '0'}, stdio: ['ignore', 'pipe', 'inherit']
  });
  let output = '', failure = null, stopping = false, closed = false;
  const closePromise = new Promise(resolve => server.once('close', () => { closed = true; resolve(); }));
  server.on('error', error => { failure = error; });
  server.on('exit', (code, signal) => {
    if (!stopping && (code !== 0 || signal)) failure = new Error(`Diagnostic server exited (${code ?? signal})`);
  });
  try {
    const address = await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => finish(new Error('Diagnostic server did not start within 10 seconds')), 10000);
      let settled = false;
      const finish = (error, value) => {
        if (settled) return;
        settled = true;
        clearTimeout(timeout);
        error ? reject(error) : resolve(value);
      };
      server.stdout.on('data', chunk => {
        output += chunk.toString();
        const match = output.match(/http:\/\/127\.0\.0\.1:\d+/);
        if (match) finish(null, match[0]);
      });
      server.once('error', finish);
      server.once('exit', (code, signal) => finish(failure || new Error(`Diagnostic server exited before startup (${code ?? signal})`)));
    });
    return {address, stop: async () => {
      stopping = true;
      if (!closed) { if (server.pid && server.exitCode === null && server.signalCode === null) server.kill(); await closePromise; }
      if (failure) throw failure;
    }};
  } catch (error) {
    stopping = true;
    if (server.pid && server.exitCode === null && server.signalCode === null) server.kill();
    await closePromise;
    throw failure || error;
  }
}

function profiledEnvironment(enabled, profilePath, inherited = process.env) {
  const env = {...inherited};
  for (const key of Object.keys(env)) if (key.toUpperCase().startsWith('MOZ_PROFILER_')) delete env[key];
  if (enabled) Object.assign(env, {
    MOZ_PROFILER_STARTUP: '1',
    MOZ_PROFILER_STARTUP_INTERVAL: '1',
    MOZ_PROFILER_STARTUP_ENTRIES: '2000000',
    MOZ_PROFILER_STARTUP_FEATURES: 'js,leaf,stackwalk',
    MOZ_PROFILER_STARTUP_FILTERS: 'GeckoMain',
    MOZ_PROFILER_SHUTDOWN: profilePath
  });
  return env;
}

async function configurePage(page, url, hidden, fixtureDate) {
  const settings = {
    theme: 'woodland', care: false, rest: false, night: false, lowPower: true,
    display: {woodlandView: 'dashboard', companion: true, companionInterval: 60, companionDuration: 20}
  };
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.route('https://**', route => route.abort());
  await page.addInitScript(({initialSettings, date}) => {
    const NativeDate = Date, start = performance.now(), base = +new NativeDate(date);
    window.Date = class extends NativeDate {
      constructor(...args) { super(...(args.length ? args : [base + performance.now() - start])); }
      static now() { return base + performance.now() - start; }
    };
    localStorage.setItem('orbit-settings', JSON.stringify(initialSettings));
  }, {initialSettings: settings, date: fixtureDate});
  await page.addInitScript(installCadenceTrace);
  const response = await page.goto(url);
  if (!response || response.status() !== 200) throw new Error(`Page load failed: ${response?.status() ?? 'no response'}`);
  if (hidden) await page.evaluate(() => {
    const world = document.getElementById('woodland-world');
    if (!world) throw new Error('Missing diagnostic world #woodland-world');
    world.style.visibility = 'hidden';
  });
  await page.evaluate(() => document.fonts?.ready);
  await page.waitForTimeout(1000);
  if (errors.length) throw new Error(`Page errors after startup: ${errors.join(' | ')}`);
  return errors;
}

async function sample(page, kind, markPrefix) {
  return page.evaluate(async ({kind: windowKind, markPrefix: prefix}) => {
    const host = document.querySelector('#woodland-cast > g');
    const leftLeg = host?.querySelector('[data-part=leg-left]');
    if (!host || !leftLeg) throw new Error('Woodland actor host or dashboard left leg unavailable');
    const signature = () => host.getAttribute('transform') + leftLeg.getAttribute('d');
    let previous = '';
    const geometryTimesMs = [];
    const observer = new MutationObserver(() => {
      const next = signature();
      if (next !== previous) { previous = next; geometryTimesMs.push(performance.now()); }
    });
    observer.observe(host, {subtree: true, attributes: true, attributeFilter: ['d', 'transform']});
    const startName = `${prefix}-${windowKind}-start`, endName = `${prefix}-${windowKind}-end`;
    performance.mark(startName);
    const start = performance.now();
    window.__clockCadenceTrace.start(start);
    await new Promise(resolve => setTimeout(resolve, 2100));
    const end = performance.now();
    const trace = window.__clockCadenceTrace.stop(end);
    observer.disconnect();
    performance.mark(endName);
    const startEntry = performance.getEntriesByName(startName, 'mark').at(-1);
    const endEntry = performance.getEntriesByName(endName, 'mark').at(-1);
    return {
      kind: windowKind, lowPower: windowKind === 'low', trace: {
        start: trace.start, end: trace.end, native: trace.native, app: trace.app,
        nativeColumns: trace.nativeColumns, appColumns: trace.appColumns,
        createdPolicyCount: trace.createdPolicyCount, visibility: trace.visibility
      },
      geometryStartMs: start, geometryEndMs: end, geometryTimesMs,
      pageMarks: {
        startName, endName, startMs: startEntry?.startTime ?? null, endMs: endEntry?.startTime ?? null
      }
    };
  }, {kind, markPrefix});
}

function measure(windowData) {
  const times = windowData.geometryTimesMs;
  const gaps = Array.isArray(times) ? times.slice(1).map((value, index) => value - times[index]) : [];
  const elapsedMs = Number.isFinite(windowData.geometryStartMs) && Number.isFinite(windowData.geometryEndMs)
    ? windowData.geometryEndMs - windowData.geometryStartMs : null;
  const sorted = [...gaps].sort((a, b) => a - b);
  const p95 = sorted.length ? sorted[Math.floor(sorted.length * 0.95)] : null;
  const maxGap = gaps.length ? Math.max(...gaps) : null;
  const metrics = {fps: elapsedMs > 0 ? times.length * 1000 / elapsedMs : null, p95, maxGap, frames: times.length, elapsedMs};
  const low = windowData.kind === 'low';
  const thresholds = {fps: low ? 26 : 45, p95: low ? 46 : 31, maxGap: 100};
  return {metrics, gateThresholds: thresholds, researchGatePasses: {
    fps: Number.isFinite(metrics.fps) ? metrics.fps >= thresholds.fps : null,
    p95: Number.isFinite(p95) ? p95 <= thresholds.p95 : null,
    maxGap: Number.isFinite(maxGap) ? maxGap < thresholds.maxGap : null
  }, researchOnly: true};
}

async function readProfile(profilePath, timeoutMs = 5000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() <= deadline) {
    try { return fs.readFileSync(profilePath); }
    catch (error) { if (error.code !== 'ENOENT') throw error; }
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  throw new Error('Firefox profiler output was not created within 5 seconds');
}

async function runCase(serverAddress, item, provenance, runID) {
  const condition = item.condition;
  const {hidden, profilerEnabled} = conditionDetails(condition);
  const profileDirectory = path.join(profileRoot, runID, `${String(item.globalIndex + 1).padStart(2, '0')}-${condition}`);
  const profilePath = path.join(profileDirectory, 'profile.json');
  const contextInfo = {
    condition, round: item.round, position: item.position, globalIndex: item.globalIndex,
    ...(item.slot === undefined ? {} : {slot: item.slot}), hidden, profilerEnabled,
    profiler: profilerEnabled ? {features: 'js,leaf,stackwalk', intervalMs: 1, entries: 2000000, filter: 'GeckoMain', shutdownFilename: 'profile.json'} : null,
    browser: 'firefox', browserVersion: null, viewport, dpr: 1, headless: true,
    form: 'hosted', modeEntry: 'low-to-normal'
  };
  const data = {windows: [], profile: null, rawProfileSha256: null, errors: []};
  let browser = null, captured = false;
  const markPrefix = `firefox-stall-${runID}-${item.globalIndex + 1}`;
  const fixtureDate = '2026-10-05T10:00:09-04:00';
  try {
    if (profilerEnabled) fs.mkdirSync(profileDirectory, {recursive: true});
    browser = await playwright.firefox.launch({headless: true, env: profiledEnvironment(profilerEnabled, profilePath)});
    contextInfo.browserVersion = browser.version();
    const context = await browser.newContext({viewport, deviceScaleFactor: 1, timezoneId: 'America/New_York'});
    try {
      const page = await context.newPage();
      const pageErrors = await configurePage(page, serverAddress, hidden, fixtureDate);
      const low = await sample(page, 'low', markPrefix);
      data.windows.push({...low, ...measure(low)});
      await page.evaluate(() => {
        prefs.lowPower = false;
        WoodlandTime.sync();
      });
      const normal = await sample(page, 'normal', markPrefix);
      data.windows.push({...normal, ...measure(normal)});
      if (pageErrors.length) data.errors.push(...pageErrors.map(message => safeError(message)));
      captured = true;
    } finally {
      await context.close();
    }
  } catch (error) {
    data.errors.push(safeError(error));
  } finally {
    if (browser) await browser.close().catch(error => data.errors.push(safeError(error)));
  }
  if (profilerEnabled) {
    try {
      const raw = await readProfile(profilePath);
      data.rawProfileSha256 = sha256(raw);
      if (!captured) data.errors.push('Profile retained but one or more sample windows were unavailable');
      const profile = JSON.parse(raw.toString('utf8'));
      if (data.windows.length) data.profile = extractProfile(profile, data.windows);
      else data.errors.push('Profile retained but no sample windows were available for attribution');
    } catch (error) { data.errors.push(safeError(error)); }
  }
  const record = {schemaVersion: 1, kind: 'firefox-stall', provenance, context: contextInfo, data};
  record.traceID = sha256(stableJSON(record));
  return record;
}

function stableJSON(value) {
  if (Array.isArray(value)) return `[${value.map(stableJSON).join(',')}]`;
  if (value && typeof value === 'object') return `{${Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${stableJSON(value[key])}`).join(',')}}`;
  return JSON.stringify(value);
}

function appendRecord(record) {
  fs.mkdirSync(path.dirname(outputPath), {recursive: true});
  fs.appendFileSync(outputPath, `${JSON.stringify(record)}\n`, 'utf8');
}

async function main(env = process.env) {
  const config = readConfig(env);
  const schedule = makeSchedule(config);
  const provenance = getProvenance();
  fs.mkdirSync(path.dirname(outputPath), {recursive: true});
  if (config.slot === null || config.slot === 0) fs.writeFileSync(outputPath, '', 'utf8');
  fs.mkdirSync(profileRoot, {recursive: true});
  const runID = path.basename(fs.mkdtempSync(path.join(profileRoot, 'run-')));
  const server = await startServer();
  let failures = 0, batch = [];
  try {
    for (const item of schedule) {
      const record = await runCase(server.address, item, provenance, runID);
      appendRecord(record);
      if (record.data.errors.length) failures++;
      const windowsSummary = record.data.windows.map(windowData => ({
        mode: windowData.kind, samples: windowData.geometryTimesMs.length,
        researchGatePasses: windowData.researchGatePasses
      }));
      console.log(`${item.round + 1}/${williamsOrders.length} ${item.position + 1}/4 ${item.condition}: ${JSON.stringify(windowsSummary)}`);
      batch.push(record);
      if (batch.length === 2) {
        const transport = emitEvidence(batch);
        console.log(`Evidence batch: ${transport.parts} lossless notice chunks for two records.`);
        batch = [];
      }
    }
  } finally { await server.stop(); }
  console.log(`Firefox stall research retained ${schedule.length} cases in ${path.relative(root, outputPath)}; ${failures} case error(s).`);
  if (failures) process.exitCode = 1;
}

if (require.main === module) main().catch(error => {
  console.error(safeError(error));
  process.exitCode = 1;
});

module.exports = {readConfig, makeSchedule, conditionDetails, profiledEnvironment, main, measure, stableJSON};
