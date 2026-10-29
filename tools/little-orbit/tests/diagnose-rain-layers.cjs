// SPDX-License-Identifier: LicenseRef-Simpli-Noncommercial-1.0
// Copyright (C) 2026 ilamgumaran and contributors
'use strict';

// Read-only Firefox/Chromium diagnostic for rain layer visibility controls.
// Uses real RAF/timers and mocked weather. No production source or gate changes.
// Run from this directory with CLOCK_TEST_BROWSER=firefox node diagnose-rain-layers.cjs
// Optional report path: CLOCK_RAIN_REPORT=/path/to/report.json
const { spawn, execFileSync } = require('node:child_process');
const { once } = require('node:events');
const fs = require('node:fs');
const { createHash } = require('node:crypto');
const path = require('node:path');
const repo = path.resolve(__dirname, '..');
const browserName = process.env.CLOCK_TEST_BROWSER || 'firefox';
process.env.CLOCK_TEST_BROWSER = browserName;
const runtime = require('./runtime.cjs');
const outputPath = path.resolve(repo, process.env.CLOCK_RAIN_REPORT || 'test-results/rain-layer-profile.json');
const duration = 2100;
const fixtureDate = '2026-10-05T10:08:05-04:00';
const settings = {
  theme: 'greenhouse1',
  place: { name: 'Test woodland', latitude: 33.9276, longitude: -84.6202 },
  format24: true,
  care: false,
  rest: false,
  night: false,
  lowPower: false,
  display: { woodlandView: 'immersive' }
};
const weather = {
  current: { temperature_2m: 68, apparent_temperature: 66, weather_code: 65 },
  daily: { temperature_2m_max: [73], temperature_2m_min: [63] }
};
const layers = ['world', 'weather-layer', 'reading', 'actors', 'light-layer'];
const selector = layer => `#woodland-immersive-${layer}`;

function replaceOnce(source, anchor, replacement, label) {
  const count = source.split(anchor).length - 1;
  if (count !== 1) throw new Error(`${label} anchor count ${count}`);
  return source.replace(anchor, replacement);
}

function instrument(source) {
  source = replaceOnce(
    source,
    ' function loop(at){\n  frame=null;if(!visible())return;',
    ' function loop(at){\n  window.__rainProfile.loopTimes.push(at);\n  frame=null;if(!visible())return;',
    'loop'
  );
  source = replaceOnce(
    source,
    'if(!cadence.shouldDraw(at,!!prefs.lowPower)){frame=requestAnimationFrame(loop);return;}',
    'if(!cadence.shouldDraw(at,!!prefs.lowPower)){window.__rainProfile.skipped++;frame=requestAnimationFrame(loop);return;}',
    'skip'
  );
  return replaceOnce(
    source,
    'if(draw())frame=requestAnimationFrame(loop);',
    'const __start=performance.now(),__animate=draw();window.__rainProfile.drawCosts.push(performance.now()-__start);if(__animate)frame=requestAnimationFrame(loop);',
    'draw'
  );
}

async function startServer() {
  const child = spawn(process.execPath, [path.join(repo, 'server.cjs')], {
    cwd: repo,
    env: { ...process.env, PORT: '0' },
    stdio: ['ignore', 'pipe', 'pipe']
  });
  let stdout = '', stderr = '';
  child.stdout.setEncoding('utf8').on('data', chunk => { stdout += chunk; });
  child.stderr.setEncoding('utf8').on('data', chunk => { stderr += chunk; });
  for (let i = 0; i < 400; i++) {
    const match = stdout.match(/Little Orbit ready at (http:\/\/127\.0\.0\.1:\d+)/);
    if (match) return { child, url: match[1] };
    if (child.exitCode !== null) throw new Error(`server exit ${child.exitCode}: ${stderr}`);
    await new Promise(resolve => setTimeout(resolve, 25));
  }
  child.kill('SIGTERM');
  throw new Error(`server start timeout: ${stdout} ${stderr}`);
}

async function stopServer(child) {
  if (child.exitCode !== null || child.signalCode !== null) return;
  const closed = once(child, 'exit');
  child.kill('SIGTERM');
  await closed;
}

async function install(page) {
  await page.route('https://**', route => route.abort());
  await page.route('https://api.open-meteo.com/**', route => route.fulfill({ json: weather }));
  await page.route('**/woodland-immersive.js', async route => {
    const response = await route.fetch();
    await route.fulfill({ response, body: instrument(await response.text()) });
  });
  await page.addInitScript(({ savedSettings, date }) => {
    const RealDate = Date;
    const start = performance.now(), base = +new RealDate(date);
    window.Date = class extends RealDate {
      constructor(...args) { super(...(args.length ? args : [base + performance.now() - start])); }
      static now() { return base + performance.now() - start; }
    };
    localStorage.setItem('orbit-settings', JSON.stringify(savedSettings));
    window.__rainProfile = { loopTimes: [], drawCosts: [], skipped: 0 };
  }, { savedSettings: settings, date: fixtureDate });
}

async function measure(page) {
  return page.evaluate(async sampleDuration => {
    const diag = window.__rainProfile;
    diag.loopTimes = [];
    diag.drawCosts = [];
    diag.skipped = 0;
    const particle = document.querySelector('[data-weather-particle]'), particleTimes = [];
    let previous = particle?.getAttribute('transform');
    const observer = new MutationObserver(() => {
      const current = particle?.getAttribute('transform');
      if (current !== previous) {
        previous = current;
        particleTimes.push(performance.now());
      }
    });
    if (particle) observer.observe(particle, { attributes: true, attributeFilter: ['transform'] });
    const raf = [];
    let running = true;
    const tick = at => {
      if (!running) return;
      raf.push([at, performance.now()]);
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    const started = performance.now();
    await new Promise(resolve => setTimeout(resolve, sampleDuration));
    const elapsedMs = performance.now() - started;
    running = false;
    observer.disconnect();

    const gaps = (values, column) => values.slice(1).map((value, i) =>
      (column === undefined ? value : value[column]) - (column === undefined ? values[i] : values[i][column]));
    const stats = values => {
      if (!values.length) return { p50: null, p95: null, max: null };
      const sorted = [...values].sort((a, b) => a - b);
      return {
        p50: sorted[Math.floor(sorted.length * .5)],
        p95: sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * .95))],
        max: sorted.at(-1)
      };
    };
    const rate = count => count * 1000 / elapsedMs;
    return {
      elapsedMs,
      nativeRAF: {
        callbacks: raf.length,
        perSecond: rate(raf.length),
        nominalGapMs: stats(gaps(raf, 0)),
        callbackStartGapMs: stats(gaps(raf, 1))
      },
      sceneLoop: {
        entries: diag.loopTimes.length,
        perSecond: rate(diag.loopTimes.length),
        skipped: diag.skipped,
        draws: diag.drawCosts.length,
        gapMs: stats(gaps(diag.loopTimes)),
        drawCpuMs: stats(diag.drawCosts)
      },
      particleGeometry: {
        mutations: particleTimes.length,
        perSecond: rate(particleTimes.length),
        gapMs: stats(gaps(particleTimes))
      },
      raw: {
        nominalRafGapsMs: gaps(raf, 0),
        actualRafGapsMs: gaps(raf, 1),
        particleGapsMs: gaps(particleTimes),
        drawCpuMs: diag.drawCosts
      }
    };
  }, duration);
}

async function blankSample(browser, entry) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 2 });
  try {
    const page = await context.newPage(), errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto('about:blank');
    await page.waitForTimeout(1000);
    const result = await page.evaluate(async sampleDuration => {
      const times = [];
      let running = true;
      const tick = at => {
        if (!running) return;
        times.push([at, performance.now()]);
        requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      const started = performance.now();
      await new Promise(resolve => setTimeout(resolve, sampleDuration));
      const elapsedMs = performance.now() - started;
      running = false;
      const gaps = column => times.slice(1).map((value, i) => value[column] - times[i][column]);
      const stats = values => {
        const sorted = [...values].sort((a, b) => a - b);
        return sorted.length ? {
          p50: sorted[Math.floor(sorted.length * .5)],
          p95: sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * .95))],
          max: sorted.at(-1)
        } : { p50: null, p95: null, max: null };
      };
      return {
        elapsedMs,
        nativeRAF: {
          callbacks: times.length,
          perSecond: times.length * 1000 / elapsedMs,
          nominalGapMs: stats(gaps(0)),
          callbackStartGapMs: stats(gaps(1))
        },
        raw: { nominalRafGapsMs: gaps(0), actualRafGapsMs: gaps(1) }
      };
    }, duration);
    return {
      ...entry,
      pageErrors: errors,
      ...result,
      ...(errors.length ? { error: `page errors: ${JSON.stringify(errors)}` } : {})
    };
  } finally {
    await context.close();
  }
}

async function appSample(browser, url, entry) {
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    deviceScaleFactor: 2,
    timezoneId: 'America/New_York'
  });
  const errors = [];
  try {
    const page = await context.newPage();
    page.on('pageerror', error => errors.push(error.message));
    await install(page);
    const response = await page.goto(url);
    const httpStatus = response?.status() ?? null;
    if (httpStatus !== 200) {
      return { ...entry, httpStatus, pageErrors: errors, error: `main page HTTP ${httpStatus ?? 'no response'}` };
    }
    await page.waitForFunction(() => window.DeskHabitatWeather?.get().kind === 'rain', null, { timeout: 15000 });
    if (entry.hidden?.length) {
      await page.addStyleTag({ content: entry.hidden.map(layer => `${selector(layer)}{visibility:hidden!important}`).join('\n') });
    }
    await page.evaluate(() => document.fonts?.ready);
    await page.waitForTimeout(1000);
    const elementState = await page.evaluate(() => ({
      particleCount: document.querySelectorAll('[data-weather-particle]').length,
      visibility: Object.fromEntries(['world', 'weather-layer', 'reading', 'actors', 'light-layer'].map(layer => [
        layer,
        getComputedStyle(document.querySelector(`#woodland-immersive-${layer}`)).visibility
      ]))
    }));
    const result = await measure(page);
    return {
      ...entry,
      httpStatus,
      pageErrors: errors,
      elementState,
      ...result,
      ...(errors.length ? { error: `page errors: ${JSON.stringify(errors)}` } : {})
    };
  } catch (error) {
    return { ...entry, pageErrors: errors, error: `${error.name}: ${error.message}` };
  } finally {
    await context.close();
  }
}

function cases() {
  const controls = [
    [{ kind: 'full', hidden: [] }, { kind: 'omit-all', hidden: layers }, { kind: 'blank' }],
    [{ kind: 'omit-all', hidden: layers }, { kind: 'blank' }, { kind: 'full', hidden: [] }],
    [{ kind: 'blank' }, { kind: 'full', hidden: [] }, { kind: 'omit-all', hidden: layers }]
  ];
  const result = [];
  controls.forEach((block, i) => block.forEach((entry, j) => result.push({
    ...entry,
    label: `balanced control ${i + 1}.${j + 1} ${entry.kind}`,
    block: `control-${i + 1}`
  })));
  for (let block = 0; block < 2; block++) {
    const order = block ? [...layers].reverse() : layers;
    for (const layer of order) result.push({
      kind: 'omit-layer',
      hidden: [layer],
      layer,
      label: `omit-layer ${block + 1} ${layer}`,
      block: `layers-${block + 1}`
    });
    result.push({
      kind: 'full',
      hidden: [],
      label: `omit-layer ${block + 1} full anchor`,
      block: `layers-${block + 1}`
    });
  }
  return result;
}

function writeReport(report) {
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(report, null, 2));
}

async function main() {
  const selectedCases = cases();
  const report = {
    diagnostic: 'rain-layer-profile',
    schemaVersion: 1,
    harnessSHA256: createHash('sha256').update(fs.readFileSync(__filename)).digest('hex'),
    startedAt: new Date().toISOString(),
    browser: browserName,
    browserVersion: null,
    playwrightVersion: require(require.resolve('playwright/package.json', { paths: [__dirname] })).version,
    repoHead: null,
    viewport: { width: 1280, height: 720, dpr: 2 },
    sampleTargetMs: duration,
    authoredStart: fixtureDate,
    settlingMs: 1000,
    blankWarmupMs: 1000,
    browserWarmupMs: 4000,
    methodology: 'Fresh browser per case; real RAF and timers; mocked weather code 65; visibility-hidden controls; no pass threshold.',
    order: selectedCases.map(entry => entry.label),
    samples: [],
    errors: []
  };
  writeReport(report);
  if (!['firefox', 'chromium'].includes(browserName)) {
    report.errors.push(`CLOCK_TEST_BROWSER must be firefox or chromium; received ${browserName}`);
    report.finishedAt = new Date().toISOString();
    report.completedSamples = 0;
    report.measurementCompleted = false;
    writeReport(report);
    console.error(report.errors[0]);
    process.exitCode = 1;
    return;
  }
  let server;
  try {
    report.repoHead = execFileSync('git', ['-C', repo, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
    server = await startServer();
    for (const [index, entry] of selectedCases.entries()) {
      let browser;
      let sample;
      try {
        browser = await runtime.engine.launch({ ...runtime.options, headless: true });
        report.browserVersion ||= browser.version();
        const warm = await browser.newPage();
        await warm.goto('about:blank');
        await warm.waitForTimeout(4000);
        await warm.close();
        sample = entry.kind === 'blank'
          ? await blankSample(browser, entry)
          : await appSample(browser, server.url, entry);
      } catch (error) {
        sample = { ...entry, error: `${error.name}: ${error.message}` };
      } finally {
        if (browser) await browser.close().catch(error => {
          report.errors.push(`browser close after ${entry.label}: ${error.message}`);
        });
      }
      report.samples.push(sample);
      if (sample.error) report.errors.push(`${entry.label}: ${sample.error}`);
      const fps = sample.nativeRAF?.perSecond;
      const p95 = sample.nativeRAF?.nominalGapMs?.p95;
      console.error(`${index + 1}/${selectedCases.length} ${entry.label}: ${fps === undefined ? 'measurement error' : `${fps.toFixed(2)} RAF/s, p95 ${p95?.toFixed(2) ?? 'n/a'} ms`}`);
      writeReport(report);
    }
  } catch (error) {
    report.errors.push(`run: ${error.name}: ${error.message}`);
  } finally {
    report.finishedAt = new Date().toISOString();
    report.completedSamples = report.samples.length;
    report.measurementCompleted = report.samples.length === selectedCases.length;
    if (server) {
      try {
        await stopServer(server.child);
      } catch (error) {
        report.errors.push(`server shutdown: ${error.name}: ${error.message}`);
      }
    }
    writeReport(report);
  }
  console.log(JSON.stringify({ file: outputPath, samples: report.samples.length, browser: browserName, browserVersion: report.browserVersion, measurementCompleted: report.measurementCompleted }));
  if (report.errors.length) process.exitCode = 1;
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
