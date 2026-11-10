// SPDX-License-Identifier: LicenseRef-Simpli-Noncommercial-1.0
// Copyright (C) 2026 ilamgumaran and contributors
'use strict';

const {writeTrace, emitTrace} = require('./cadence-trace.cjs');

const MAX_EVENTS = 200;
const MAX_RESOURCES = 20;
const MAX_PENDING_REQUESTS = 200;

function sanitizeURL(value) {
  try {
    const url = new URL(String(value));
    if (url.protocol === 'file:') return `file://${url.host}/${require('node:path').basename(decodeURIComponent(url.pathname))}`;
    return `${url.protocol}//${url.host}${url.pathname}`;
  } catch (_) {
    return 'invalid-url';
  }
}

function monotonicNow() {
  return Number(process.hrtime.bigint()) / 1e6;
}

function sanitizeFailureText(value) {
  return String(value)
    .replace(/\b(?:https?|file):\/\/[^\s"'<>]+/gi, '[redacted-url]')
    .replace(/\?[^\s"'<>]*/g, '?[redacted-query]')
    .replace(/(?:[A-Za-z]:\\|\\\\)[^\s"'<>]+/g, '[redacted-path]')
    .replace(/\/(?:[^\s"'<>/]+\/)*[^\s"'<>/]*/g, '[redacted-path]')
    .slice(0, 160);
}

async function snapshotPage(page, timeoutMs) {
  let timer;
  try {
    return await Promise.race([
      Promise.resolve().then(() => page.evaluate(() => {
        const round = value => Number.isFinite(value) ? Math.round(value * 100) / 100 : null;
        const safeURL = value => {
          try {
            const url = new URL(value);
            if (url.protocol === 'file:') return `file://${url.host}/${url.pathname.split('/').pop()}`;
            return `${url.protocol}//${url.host}${url.pathname}`;
          } catch (_) { return 'invalid-url'; }
        };
        const entries = performance.getEntriesByType('resource');
        return {
          readyState: document.readyState,
          visibility: document.visibilityState,
          title: document.title,
          resourceCount: entries.length,
          resources: entries.slice(0, 20).map(entry => ({
            url: safeURL(entry.name), startTime: round(entry.startTime), duration: round(entry.duration),
            transferSize: round(entry.transferSize), encodedBodySize: round(entry.encodedBodySize)
          }))
        };
      })),
      new Promise(resolve => { timer = setTimeout(() => resolve(null), timeoutMs); })
    ]);
  } catch (_) {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

async function gotoWithTrace(page, target, context, options = {}) {
  const write = options.writeTrace || writeTrace;
  const emit = options.emitTrace || emitTrace;
  const snapshotTimeoutMs = options.snapshotTimeoutMs ?? 1500;
  const started = monotonicNow();
  const events = [];
  const requests = new Map();
  let droppedCount = 0;
  let pageErrorCount = 0;
  let crashCount = 0;
  const recordEvent = event => {
    if (events.length < MAX_EVENTS) events.push({atMs: Math.round((monotonicNow() - started) * 100) / 100, ...event});
    else droppedCount++;
  };
  const onRequest = request => {
    const item = {url: sanitizeURL(request.url()), method: request.method()};
    requests.set(request, item);
    recordEvent({type: 'request', ...item});
  };
  const onRequestFinished = request => {
    const item = requests.get(request) || {url: sanitizeURL(request.url()), method: request.method()};
    requests.delete(request);
    recordEvent({type: 'requestfinished', ...item});
  };
  const onRequestFailed = request => {
    const item = requests.get(request) || {url: sanitizeURL(request.url()), method: request.method()};
    requests.delete(request);
    const failure = typeof request.failure === 'function' ? request.failure() : null;
    const failureText = failure && typeof failure.errorText === 'string' ? sanitizeFailureText(failure.errorText) : undefined;
    recordEvent({type: 'requestfailed', ...item, ...(failureText ? {failureText} : {})});
  };
  const onDomContentLoaded = () => recordEvent({type: 'domcontentloaded'});
  const onLoad = () => recordEvent({type: 'load'});
  const onPageError = () => { pageErrorCount++; recordEvent({type: 'pageerror'}); };
  const onCrash = () => { crashCount++; recordEvent({type: 'crash'}); };
  const listeners = [
    ['request', onRequest], ['requestfinished', onRequestFinished], ['requestfailed', onRequestFailed],
    ['domcontentloaded', onDomContentLoaded], ['load', onLoad], ['pageerror', onPageError], ['crash', onCrash]
  ];
  for (const [event, listener] of listeners) page.on(event, listener);

  try {
    // Keep Playwright's original default wait condition, timeout, and options.
    let response;
    try {
      response = await page.goto(target);
    } catch (error) {
      const snapshot = await snapshotPage(page, snapshotTimeoutMs);
      const pendingRequests = [...requests.values()].slice(0, MAX_PENDING_REQUESTS);
      const data = {
        outcome: 'failure', elapsedMs: Math.round((monotonicNow() - started) * 100) / 100,
        errorName: error && typeof error.name === 'string' ? error.name : 'Error',
        events, droppedEventCount: droppedCount, pageErrorCount, crashCount,
        pendingRequestCount: requests.size, pendingRequests, snapshot
      };
      try {
        const record = write('navigation', context, data);
        try { emit(record); } catch (_) {}
      } catch (_) {}
      throw error;
    }
    const data = {
      outcome: 'success', elapsedMs: Math.round((monotonicNow() - started) * 100) / 100,
      events, droppedEventCount: droppedCount, pageErrorCount, crashCount,
      pendingRequestCount: requests.size,
      pendingRequests: [...requests.values()].slice(0, MAX_PENDING_REQUESTS)
    };
    write('navigation', context, data);
    return response;
  } finally {
    for (const [event, listener] of listeners) {
      if (typeof page.off === 'function') page.off(event, listener);
      else if (typeof page.removeListener === 'function') page.removeListener(event, listener);
    }
  }
}

module.exports = {gotoWithTrace, sanitizeURL, sanitizeFailureText, snapshotPage};
