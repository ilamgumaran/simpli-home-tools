// SPDX-License-Identifier: LicenseRef-Simpli-Noncommercial-1.0
// Copyright (C) 2026 ilamgumaran and contributors
'use strict';

const assert = require('node:assert/strict');
const path = require('node:path');
const {pathToFileURL} = require('node:url');
const {engine, options, url, freezeClock} = require('./runtime.cjs');

const portable = pathToFileURL(path.join(__dirname, '..', 'Little Orbit.html')).href;
const settings = {theme: 'woodland', care: false, rest: false, night: false, lowPower: false,
  display: {woodlandView: 'dashboard', companion: true, companionInterval: 60, companionDuration: 20}};
const stamp = (minute, second) => `2026-10-05T10:${String(minute).padStart(2, '0')}:${second.toFixed(2).padStart(5, '0')}-04:00`;

async function verifyTarget(browser, target) {
  const context = await browser.newContext({viewport: {width: 854, height: 480}, timezoneId: 'America/New_York'});
  const page = await context.newPage(), errors = [];
  try {
    page.on('pageerror', error => errors.push(error.message));
    await page.route('https://**', route => route.abort());
    await freezeClock(page, stamp(0, .1));
    await page.addInitScript(initialSettings => {
      localStorage.setItem('orbit-settings', JSON.stringify(initialSettings));
      const pathProto = SVGPathElement.prototype, graphicsProto = SVGGraphicsElement.prototype;
      const originalLength = pathProto.getTotalLength, originalPoint = pathProto.getPointAtLength, originalCTM = graphicsProto.getCTM;
      const counters = {length: 0, pointAt95: 0, worldCTM: 0, trailCTM: 0};
      let enabled = false;
      const isLastTrail = element => element instanceof SVGPathElement && element.matches('#woodland-numerals [data-index="3"] .woodland-trail');
      pathProto.getTotalLength = function (...args) {
        if (enabled && isLastTrail(this)) counters.length++;
        return Reflect.apply(originalLength, this, args);
      };
      pathProto.getPointAtLength = function (distance, ...args) {
        if (enabled && isLastTrail(this)) {
          const length = Reflect.apply(originalLength, this, []);
          if (Math.abs(distance - length * .95) <= 1e-7) counters.pointAt95++;
        }
        return Reflect.apply(originalPoint, this, [distance, ...args]);
      };
      graphicsProto.getCTM = function (...args) {
        if (enabled && (this.id === 'woodland-world' || isLastTrail(this))) counters[this.id === 'woodland-world' ? 'worldCTM' : 'trailCTM']++;
        return Reflect.apply(originalCTM, this, args);
      };
      window.minuteMarkerProbe = {
        begin() { for (const key of Object.keys(counters)) counters[key] = 0; enabled = true; },
        end() { enabled = false; return {...counters}; },
        reference() {
          const trail = document.querySelector('#woodland-numerals [data-index="3"] .woodland-trail');
          const world = document.getElementById('woodland-world');
          const length = Reflect.apply(originalLength, trail, []);
          const point = Reflect.apply(originalPoint, trail, [length * .95]);
          const matrix = Reflect.apply(originalCTM, world, []).inverse().multiply(Reflect.apply(originalCTM, trail, []));
          return {x: matrix.a * point.x + matrix.c * point.y + matrix.e, y: matrix.b * point.x + matrix.d * point.y + matrix.f};
        }
      };
    }, settings);
    await page.goto(target);
    await page.evaluate(() => document.fonts?.ready);

    const measure = async (minute, second, visible) => {
      await page.clock.setSystemTime(new Date(stamp(minute, second)));
      const sample = await page.evaluate(() => {
        minuteMarkerProbe.begin();
        WoodlandTime.sync();
        const reads = minuteMarkerProbe.end();
        const marker = document.querySelector('#woodland-minute-marker > g');
        const digit = document.querySelector('#woodland-numerals [data-index="3"]')?.getAttribute('data-digit') ?? null;
        const position = marker?.transform.baseVal.consolidate()?.matrix;
        const expected = marker ? minuteMarkerProbe.reference() : null;
        return {reads, present: !!marker, digit, actual: position ? {x: position.e, y: position.f} : null, expected};
      });
      assert.equal(sample.present, visible, `${target} marker visibility at minute ${minute}, second ${second}`);
      if (!visible) {
        assert.deepEqual(sample.reads, {length: 0, pointAt95: 0, worldCTM: 0, trailCTM: 0}, 'Hidden marker does no SVG path or transform reads');
      } else {
        assert.ok(Object.values(sample.reads).every(count => count > 0), 'Visible marker reads its path and transform geometry');
        assert.ok(Math.abs(sample.actual.x - sample.expected.x) <= 1e-4 && Math.abs(sample.actual.y - sample.expected.y) <= 1e-4,
          JSON.stringify({minute, second, actual: sample.actual, expected: sample.expected}));
      }
      assert.equal(sample.digit, String(minute % 10), 'Displayed ones digit follows the current minute, including backward jumps');
    };

    for (let minute = 0; minute < 10; minute++) {
      await measure(minute, .1, true);
      await measure(minute, 2.99, true);
      await measure(minute, 3, false);
      await measure(minute, 9, false);
    }

    await page.clock.setSystemTime(new Date(stamp(5, 2.99)));
    for (const viewport of [{width: 854, height: 480}, {width: 1280, height: 720}, {width: 1920, height: 1080}, {width: 390, height: 844}]) {
      await page.setViewportSize(viewport);
      await measure(5, 2.99, true);
    }
    await measure(4, 2.99, true);
    await measure(0, 2.99, true);

    await page.emulateMedia({reducedMotion: 'reduce'});
    await measure(5, 1, false);
    await page.emulateMedia({reducedMotion: 'no-preference'});
    await page.evaluate(() => { prefs.display.companion = false; });
    await measure(5, 1, false);
    await page.evaluate(() => { prefs.display.companion = true; });
    await measure(5, 1, true);
    assert.deepEqual(errors, []);
    console.log(`PASS minute marker geometry and hidden-read guard: ${target.startsWith('file:') ? 'portable' : 'hosted'}`);
  } finally {
    await context.close();
  }
}

(async () => {
  const browser = await engine.launch({...options, headless: true});
  try { for (const target of [url, portable]) await verifyTarget(browser, target); }
  finally { await browser.close(); }
})().catch(error => { console.error(error); process.exit(1); });
