// SPDX-License-Identifier: LicenseRef-Simpli-Noncommercial-1.0
// Copyright (C) 2026 ilamgumaran and contributors
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const {spawn} = require('node:child_process');
const {createHash} = require('node:crypto');
const playwright = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const {installCadenceTrace, emitTrace} = require('./cadence-trace.cjs');
const {profiles, conditions, makeSchedule, readConfig, makeRecord, summarize} = require('./motion-control-plan.cjs');

const root = path.join(__dirname, '..');
const outputPath = path.join(root, 'test-results', 'motion-controls.jsonl');
const sha256 = value => createHash('sha256').update(value).digest('hex');

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

function getProvenance() {
  let revision = process.env.GITHUB_SHA;
  if (!revision) {
    try { revision = require('node:child_process').execFileSync('git', ['rev-parse', 'HEAD'], {cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore']}).trim(); }
    catch (_) { revision = 'unavailable'; }
  }
  return {
    gitSHA: revision,
    node: process.version,
    platform: process.platform,
    arch: process.arch,
    helperDigest: sha256(fs.readFileSync(path.join(__dirname, 'cadence-trace.cjs'))),
    diagnosticDigest: sha256(fs.readFileSync(__filename)),
    planDigest: sha256(fs.readFileSync(path.join(__dirname, 'motion-control-plan.cjs')))
  };
}

function appendRecord(record) {
  fs.mkdirSync(path.dirname(outputPath), {recursive: true});
  fs.appendFileSync(outputPath, `${JSON.stringify(record)}\n`, 'utf8');
  emitTrace(record);
}

async function configurePage(page, profile, condition, url) {
  const view = profile.view;
  const time = view === 'immersive' ? '2026-10-05T10:08:05-04:00' : '2026-10-05T10:00:09-04:00';
  const settings = {
    theme: 'woodland', care: false, rest: false, night: false,
    lowPower: profile.lowPower,
    display: {woodlandView: view, companion: true, companionInterval: 60, companionDuration: 20}
  };
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.route('https://**', request => request.abort());
  await page.addInitScript(({settings: initialSettings, time: baseTime}) => {
    const NativeDate = Date, start = performance.now(), base = +new NativeDate(baseTime);
    window.Date = class extends NativeDate {
      constructor(...args) { super(...(args.length ? args : [base + performance.now() - start])); }
      static now() { return base + performance.now() - start; }
    };
    localStorage.setItem('orbit-settings', JSON.stringify(initialSettings));
  }, {settings, time});
  await page.addInitScript(installCadenceTrace);
  const response = await page.goto(url);
  if (!response || response.status() !== 200) throw new Error(`Page load failed: ${response?.status() ?? 'no response'}`);
  if (condition === 'static-hidden') {
    const ids = view === 'dashboard'
      ? ['woodland-sky', 'woodland-light', 'woodland-background', 'woodland-ground', 'woodland-creek', 'woodland-details', 'woodland-numerals']
      : ['woodland-immersive-backdrop', 'woodland-immersive-river', 'woodland-immersive-foreground', 'woodland-immersive-camp', 'woodland-immersive-structures', 'woodland-immersive-reading'];
    await page.evaluate(layerIds => {
      for (const id of layerIds) {
        const element = document.getElementById(id);
        if (!element) throw new Error(`Missing diagnostic layer #${id}`);
        element.style.visibility = 'hidden';
      }
    }, ids);
  } else if (condition === 'world-hidden') {
    const ids = view === 'dashboard' ? ['woodland-world'] : [
      'woodland-immersive-world', 'woodland-immersive-weather-layer', 'woodland-immersive-reading',
      'woodland-immersive-actors', 'woodland-immersive-light-layer'
    ];
    await page.evaluate(layerIds => {
      for (const id of layerIds) {
        const element = document.getElementById(id);
        if (!element) throw new Error(`Missing diagnostic world #${id}`);
        element.style.visibility = 'hidden';
      }
    }, ids);
  }
  await page.evaluate(() => document.fonts?.ready);
  await page.waitForTimeout(1000);
  if (errors.length) throw new Error(`Page errors after startup: ${errors.join(' | ')}`);
  return errors;
}

async function sampleBlank(page) {
  return page.evaluate(async () => {
    const start = performance.now();
    window.__clockCadenceTrace.start(start);
    await new Promise(resolve => setTimeout(resolve, 2100));
    const end = performance.now();
    const trace = window.__clockCadenceTrace.stop(end);
    return {
      start, end, native: trace.native, app: [], geometryTimes: null, geometryStart: null, geometryEnd: null,
      nativeColumns: trace.nativeColumns, appColumns: trace.appColumns,
      createdPolicyCount: trace.createdPolicyCount, visibility: trace.visibility
    };
  });
}

async function sampleApplication(page, view) {
  return page.evaluate(async sceneView => {
    const host = document.querySelector(sceneView === 'dashboard' ? '#woodland-cast > g' : '#woodland-immersive-cast > g');
    if (!host) throw new Error('Woodland actor host unavailable');
    const dashboardLeg = sceneView === 'dashboard' ? host.querySelector('[data-part=leg-left]') : null;
    if (sceneView === 'dashboard' && !dashboardLeg) throw new Error('Dashboard left leg unavailable');
    const signature = () => {
      const root = host.getAttribute('transform');
      if (sceneView === 'dashboard') {
        return root + dashboardLeg.getAttribute('d');
      }
      const limbs = [...host.querySelectorAll('[data-part^="arm-"],[data-part^="leg-"]')];
      if (limbs.length !== 4) throw new Error('Immersive four-limb geometry unavailable');
      const body = host.querySelector('[data-layer="body"]');
      if (!body) throw new Error('Immersive body unavailable');
      return root + limbs.map(part => part.getAttribute('d')).join(':') + body.getAttribute('transform');
    };
    let previous = '';
    const geometryTimes = [];
    const observer = new MutationObserver(() => {
      const next = signature();
      if (next !== previous) { previous = next; geometryTimes.push(performance.now()); }
    });
    observer.observe(host, {subtree: true, attributes: true, attributeFilter: ['d', 'transform']});
    const start = performance.now();
    window.__clockCadenceTrace.start(start);
    await new Promise(resolve => setTimeout(resolve, 2100));
    const end = performance.now();
    observer.disconnect();
    const trace = window.__clockCadenceTrace.stop(end);
    return {
      start, end, native: trace.native, app: trace.app, geometryTimes, geometryStart: start, geometryEnd: end,
      nativeColumns: trace.nativeColumns, appColumns: trace.appColumns,
      createdPolicyCount: trace.createdPolicyCount, visibility: trace.visibility
    };
  }, view);
}

async function runCase(serverAddress, item, scheduleMeta, provenance) {
  const profile = item.profile;
  const browserName = profile.browser;
  const engine = browserName === 'firefox' ? playwright.firefox : playwright.chromium;
  const headless = process.env.CLOCK_DIAGNOSTIC_HEADLESS !== 'false';
  const channel = browserName === 'chromium' ? (process.env.CLOCK_TEST_CHANNEL || 'default') : 'default';
  const contextInfo = {
    group: profile.id, condition: item.condition, round: item.round, position: item.position,
    viewport: profile.viewport, dpr: profile.dpr, lowPower: profile.lowPower,
    modeEntry: profile.lowPower ? 'direct-low-power' : 'direct-normal',
    browser: browserName, browserVersion: null, view: profile.view, channel, headless
  };
  let browser, context, page, capturedData = null;
  try {
    const launchOptions = {headless};
    if (browserName === 'chromium' && process.env.CLOCK_TEST_CHANNEL) launchOptions.channel = process.env.CLOCK_TEST_CHANNEL;
    browser = await engine.launch(launchOptions);
    contextInfo.browserVersion = browser.version();
    const startupPage = await browser.newPage({viewport: profile.viewport, deviceScaleFactor: profile.dpr});
    await startupPage.addInitScript(installCadenceTrace);
    await startupPage.goto('about:blank');
    await startupPage.waitForTimeout(4000);
    await startupPage.close();
    context = await browser.newContext({viewport: profile.viewport, deviceScaleFactor: profile.dpr, timezoneId: 'America/New_York'});
    page = await context.newPage();
    const errors = item.condition === 'blank' ? [] : await configurePage(page, profile, item.condition, serverAddress);
    if (item.condition === 'blank') {
      page.on('pageerror', error => errors.push(error.message));
      await page.addInitScript(installCadenceTrace);
      await page.goto('about:blank');
      await page.setContent('<!doctype html><html><head><title>RAF control</title></head><body></body></html>');
      await page.addScriptTag({path: path.join(root, 'frame-cadence.js')});
      // The real factory enables the shared trace hook; this inert policy makes
      // no app decision and is never called during the native-only sample.
      await page.evaluate(() => DeskFrameCadence.create());
      await page.evaluate(() => document.fonts?.ready);
      await page.waitForTimeout(1000);
    }
    const data = item.condition === 'blank' ? await sampleBlank(page) : await sampleApplication(page, profile.view);
    capturedData = data;
    if (errors.length) throw new Error(`Page errors during sample: ${errors.join(' | ')}`);
    const summaries = summarize(data);
    console.log(`${profile.id} ${item.round}/${scheduleMeta.repeats} ${item.position + 1}/4 ${item.condition}: ${JSON.stringify(summaries)}`);
    return makeRecord(provenance, contextInfo, {...data, summaries, errors: []});
  } catch (error) {
    const message = String(error?.message || error).split('\n')[0]
      .replace(/[A-Za-z]:\\[^\s]+/g, '<path>')
      .replace(/\/(?:[^\s/:]+\/)+[^\s:]*/g, '<path>').slice(0, 1200);
    console.error(`${profile.id} ${item.round}/${scheduleMeta.repeats} ${item.condition} failed: ${message}`);
    const failedData = capturedData || {
      start: null, end: null, native: [], app: [], geometryTimes: item.condition === 'blank' ? null : [],
      geometryStart: null, geometryEnd: null, nativeColumns: ['timestamp', 'performance.now'],
      appColumns: ['policyID', 'at', 'performanceAtEntry', 'lowPower', 'accepted'],
      createdPolicyCount: 0, visibility: null
    };
    return makeRecord(provenance, contextInfo, {
      ...failedData, summaries: capturedData ? summarize(capturedData) : null, errors: [message]
    });
  } finally {
    if (context) await context.close().catch(() => {});
    if (browser) await browser.close().catch(() => {});
  }
}

async function main() {
  const config = readConfig(process.env);
  const schedule = makeSchedule(config);
  const provenance = getProvenance();
  fs.mkdirSync(path.dirname(outputPath), {recursive: true});
  if (config.round === null || config.round === 0) fs.writeFileSync(outputPath, '', 'utf8');
  const server = await startServer();
  let failures = 0;
  try {
    for (const item of schedule) {
      const record = await runCase(server.address, item, config, provenance);
      appendRecord(record);
      if (record.data.errors.length) failures++;
    }
  } finally {
    await server.stop();
  }
  console.log(`Motion controls retained ${schedule.length} samples in ${path.relative(root, outputPath)}; ${failures} case error(s).`);
  if (failures) process.exitCode = 1;
}

if (require.main === module) {
  main().catch(error => {
    console.error(error);
    process.exitCode = 1;
  });
}
