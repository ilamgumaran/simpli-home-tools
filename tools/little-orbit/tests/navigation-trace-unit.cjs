// SPDX-License-Identifier: LicenseRef-Simpli-Noncommercial-1.0
// Copyright (C) 2026 ilamgumaran and contributors
'use strict';

const assert = require('node:assert/strict');
const {EventEmitter} = require('node:events');
const {gotoWithTrace, sanitizeURL, sanitizeFailureText, snapshotPage} = require('./navigation-trace.cjs');

function request(url, method = 'GET') {
  return {url: () => url, method: () => method};
}

class MockPage extends EventEmitter {
  constructor(goto) { super(); this.navigate = goto; }
  goto(...args) { return this.navigate(...args); }
  evaluate(callback) { return callback(); }
}

async function main() {
  assert.equal(sanitizeURL('https://example.test/a/b?token=private#frag'), 'https://example.test/a/b');
  assert.equal(sanitizeURL('file:///private/profile/Secret%20Page.html?x=1'), 'file:///Secret Page.html');
  assert.equal(sanitizeFailureText('net::ERR_ABORTED https://example.test/path?secret=1 /private/profile/file'), 'net::ERR_ABORTED [redacted-url] [redacted-path]');
  assert.equal(sanitizeFailureText('NS_ERROR_NET_RESET'), 'NS_ERROR_NET_RESET');
  const priorDocument = global.document, priorPerformance = global.performance;
  try {
    global.document = {readyState:'interactive', visibilityState:'visible', title:'Clock'};
    global.performance = {getEntriesByType: () => [
      {name:'file:///private/profile/asset.js?secret=2',startTime:2,duration:3,transferSize:4,encodedBodySize:3},
      ...Array.from({length:22}, (_, i) => ({name:`https://example.test/${i}?private=1`,startTime:i,duration:1,transferSize:2,encodedBodySize:1}))
    ]};
    const snapshot = await snapshotPage({evaluate: callback => callback()}, 50);
    assert.equal(snapshot.readyState, 'interactive');
    assert.equal(snapshot.resourceCount, 23);
    assert.equal(snapshot.resources.length, 20);
    assert.equal(snapshot.resources[0].url, 'file:///asset.js');
    assert.ok(!JSON.stringify(snapshot).includes('private'));
    assert.ok(!JSON.stringify(snapshot).includes('secret='));
  } finally {
    if (priorDocument === undefined) delete global.document; else global.document = priorDocument;
    if (priorPerformance === undefined) delete global.performance; else global.performance = priorPerformance;
  }

  const target = 'https://example.test/path?private=target';
  const response = {status: () => 200};
  const saved = [];
  let navigationCalls = 0;
  const successPage = new MockPage((...args) => {
    navigationCalls++;
    assert.deepEqual(args, [target]);
    const done = request('https://example.test/asset.js?private=request');
    const failed = request('https://example.test/optional.png?private=failed');
    failed.failure = () => ({errorText:'net::ERR_ABORTED https://example.test/optional.png?private=failed /private/profile/asset'});
    const pending = request('https://example.test/pending.css?private=pending');
    successPage.emit('request', done);
    successPage.emit('requestfinished', done);
    successPage.emit('request', failed);
    successPage.emit('requestfailed', failed);
    successPage.emit('request', pending);
    successPage.emit('domcontentloaded');
    successPage.emit('load');
    successPage.emit('pageerror', new Error('private error detail'));
    return Promise.resolve(response);
  });
  const initialListenerCounts = Object.fromEntries(['request','requestfinished','requestfailed','domcontentloaded','load','pageerror','crash'].map(name => [name, successPage.listenerCount(name)]));
  const result = await gotoWithTrace(successPage, target, {suite:'climber2'}, {
    writeTrace: (...args) => { saved.push(args); return {traceID:'test-trace'}; }, emitTrace: () => assert.fail('Success emitted a trace')
  });
  assert.equal(result, response);
  assert.equal(navigationCalls, 1);
  assert.equal(saved.length, 1);
  assert.equal(saved[0][0], 'navigation');
  const successData = saved[0][2];
  assert.equal(successData.outcome, 'success');
  assert.equal(successData.pageErrorCount, 1);
  assert.equal(successData.pendingRequestCount, 1);
  assert.deepEqual(successData.pendingRequests, [{url:'https://example.test/pending.css',method:'GET'}]);
  assert.ok(successData.events.some(event => event.type === 'requestfailed' && event.url === 'https://example.test/optional.png' && event.failureText === 'net::ERR_ABORTED [redacted-url] [redacted-path]'));
  assert.ok(successData.events.some(event => event.type === 'domcontentloaded'));
  assert.ok(successData.events.every(event => !JSON.stringify(event).includes('private=')));
  assert.equal(successData.droppedEventCount, 0);
  for (const [name, count] of Object.entries(initialListenerCounts)) assert.equal(successPage.listenerCount(name), count, `${name} listener leaked`);

  const originalError = new Error('navigation failed');
  const failedSaves = [];
  const emissions = [];
  let failedCalls = 0;
  const failingPage = new MockPage((...args) => {
    failedCalls++;
    assert.deepEqual(args, [target]);
    failingPage.emit('request', request('https://example.test/stalled?secret=1'));
    return Promise.reject(originalError);
  });
  const failedListenerCount = failingPage.listenerCount('request');
  const beganAt = Date.now();
  await assert.rejects(gotoWithTrace(failingPage, target, {}, {
    snapshotTimeoutMs: 15,
    writeTrace: (...args) => { failedSaves.push(args); return {traceID:'failure-trace'}; },
    emitTrace: record => emissions.push(record)
  }), error => error === originalError);
  assert.ok(Date.now() - beganAt < 500, 'snapshot failure exceeded its bound');
  assert.equal(failedCalls, 1);
  assert.equal(failedSaves[0][2].outcome, 'failure');
  assert.equal(failedSaves[0][2].snapshot, null);
  assert.equal(failedSaves[0][2].pendingRequestCount, 1);
  assert.deepEqual(failedSaves[0][2].pendingRequests, [{url:'https://example.test/stalled',method:'GET'}]);
  assert.equal(emissions.length, 1);
  assert.equal(failingPage.listenerCount('request'), failedListenerCount);

  const writerError = new Error('report storage failed');
  const successfulNavigationErrorPage = new MockPage(() => {
    failedCalls++;
    return Promise.resolve(response);
  });
  let snapshotCalls = 0;
  successfulNavigationErrorPage.evaluate = () => { snapshotCalls++; return Promise.resolve(null); };
  let writerErrorEmits = 0;
  await assert.rejects(gotoWithTrace(successfulNavigationErrorPage, target, {}, {
    writeTrace: () => { throw writerError; },
    emitTrace: () => { writerErrorEmits++; }
  }), error => error === writerError);
  assert.equal(failedCalls, 2, 'successful navigation was retried');
  assert.equal(snapshotCalls, 0, 'successful navigation writer error triggered a failure snapshot');
  assert.equal(writerErrorEmits, 0);

  const overflow = new MockPage(() => {
    for (let i = 0; i < 245; i++) overflow.emit('load');
    return Promise.resolve(response);
  });
  let overflowData;
  await gotoWithTrace(overflow, 'https://example.test/', {}, {writeTrace: (_kind, _context, data) => { overflowData = data; return {}; }});
  assert.equal(overflowData.events.length, 200);
  assert.equal(overflowData.droppedEventCount, 45);

  console.log('PASS navigation trace unit: one unchanged navigation, bounded events and snapshot, URL redaction, pending/failure events, original error identity and listener cleanup.');
}

main().catch(error => { console.error(error); process.exitCode = 1; });
