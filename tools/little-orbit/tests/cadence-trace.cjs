// SPDX-License-Identifier: LicenseRef-Simpli-Noncommercial-1.0
// Copyright (C) 2026 ilamgumaran and contributors
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const {execFileSync} = require('node:child_process');
const {createHash} = require('node:crypto');

let revision;
let helperDigest;
const sha256 = value => createHash('sha256').update(value).digest('hex');
function stableJSON(value) {
  if (Array.isArray(value)) return `[${value.map(stableJSON).join(',')}]`;
  if (value && typeof value === 'object') {
    return `{${Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${stableJSON(value[key])}`).join(',')}}`;
  }
  return JSON.stringify(value);
}

function selectFields(source, fields) {
  const selected = {};
  if (!source || typeof source !== 'object') return selected;
  for (const field of fields) if (Object.hasOwn(source, field)) selected[field] = source[field];
  return selected;
}

function safeURL(value) {
  try {
    const url = new URL(String(value));
    if (url.protocol === 'file:') return `file://${url.host}/${path.basename(decodeURIComponent(url.pathname))}`;
    return `${url.protocol}//${url.host}${url.pathname}`;
  } catch (_) {
    return 'invalid-url';
  }
}

function stripSensitiveKeys(value, allowNormalizedURLs = false) {
  if (Array.isArray(value)) return value.map(entry => stripSensitiveKeys(entry, allowNormalizedURLs));
  if (!value || typeof value !== 'object') return value;
  const clean = {};
  for (const [key, entry] of Object.entries(value)) {
    if (allowNormalizedURLs && key === 'url' && typeof entry === 'string') {
      clean[key] = safeURL(entry);
      continue;
    }
    if (/(?:url|path|environment|^env$)/i.test(key)) continue;
    clean[key] = stripSensitiveKeys(entry, allowNormalizedURLs);
  }
  return clean;
}

// This function is serialized into page.addInitScript, so it must stay standalone.
function installCadenceTrace() {
  const state = {
    factory: null, policyCount: 0, nextPolicyID: 1,
    active: false, start: null, end: null, app: [], native: [], observer: null,
    visibleStart: null, visibleEnd: null
  };

  function captureFactory(factory) {
    if (!factory || typeof factory.create !== 'function') {
      state.factory = factory;
      return factory;
    }
    state.factory = factory;
    const originalCreate = factory.create;
    const wrappedCreate = function (...args) {
      const policy = Reflect.apply(originalCreate, factory, args);
      if (!policy || typeof policy.shouldDraw !== 'function') return policy;
      const policyID = state.nextPolicyID++;
      state.policyCount++;
      const originalShouldDraw = policy.shouldDraw;
      const wrappedPolicy = {};
      for (const property of Reflect.ownKeys(policy)) {
        const originalValue = policy[property];
        if (property === 'shouldDraw') {
          Object.defineProperty(wrappedPolicy, property, {enumerable: Object.prototype.propertyIsEnumerable.call(policy, property), configurable: false, writable: false, value: function (...callArgs) {
            const at = callArgs[0];
            const lowPower = callArgs[1];
            const recording = state.active;
            const performanceAtEntry = recording ? globalThis.performance.now() : undefined;
            const accepted = Reflect.apply(originalShouldDraw, this === wrappedPolicy ? policy : this, callArgs);
            if (recording) state.app.push([policyID, at, performanceAtEntry, lowPower, accepted]);
            return accepted;
          }});
        } else if (typeof originalValue === 'function') {
          Object.defineProperty(wrappedPolicy, property, {enumerable: Object.prototype.propertyIsEnumerable.call(policy, property), configurable: false, writable: false, value: function (...callArgs) {
            return Reflect.apply(originalValue, this === wrappedPolicy ? policy : this, callArgs);
          }});
        } else {
          Object.defineProperty(wrappedPolicy, property, {enumerable: Object.prototype.propertyIsEnumerable.call(policy, property), configurable: false, writable: false, value: originalValue});
        }
      }
      return Object.freeze(wrappedPolicy);
    };
    Object.freeze(wrappedCreate);
    const observedFactory = {};
    for (const property of Reflect.ownKeys(factory)) {
      Object.defineProperty(observedFactory, property, {
        enumerable: Object.prototype.propertyIsEnumerable.call(factory, property),
        configurable: false,
        writable: false,
        value: property === 'create' ? wrappedCreate : factory[property]
      });
    }
    Object.freeze(observedFactory);
    return observedFactory;
  }

  const prior = Object.getOwnPropertyDescriptor(globalThis, 'DeskFrameCadence');
  let initial = prior && 'value' in prior ? prior.value : undefined;
  if (initial) initial = captureFactory(initial);
  Object.defineProperty(globalThis, 'DeskFrameCadence', {
    configurable: true,
    enumerable: prior ? prior.enumerable : true,
    get() { return initial; },
    set(value) { initial = captureFactory(value); }
  });

  function observe() {
    if (!state.active) return;
    state.observer = globalThis.requestAnimationFrame(timestamp => {
      if (!state.active) return;
      state.native.push([timestamp, globalThis.performance.now()]);
      observe();
    });
  }
  const api = {
    start(startedAt) {
      if (state.active) throw new Error('Cadence trace already active');
      if (!state.factory || state.policyCount === 0) throw new Error('DeskFrameCadence factory and policy were not captured');
      state.start = startedAt;
      state.end = null;
      state.app = [];
      state.native = [];
      state.visibleStart = document.visibilityState;
      state.visibleEnd = null;
      state.active = true;
      observe();
    },
    stop(endedAt) {
      if (!state.active) throw new Error('Cadence trace is not active');
      state.active = false;
      if (state.observer !== null) globalThis.cancelAnimationFrame(state.observer);
      state.observer = null;
      state.end = endedAt;
      state.visibleEnd = document.visibilityState;
      return {
        start: state.start,
        end: state.end,
        native: state.native.slice(),
        app: state.app.slice(),
        nativeColumns: ['timestamp', 'performance.now'],
        appColumns: ['policyID', 'at', 'performanceAtEntry', 'lowPower', 'accepted'],
        createdPolicyCount: state.policyCount,
        visibility: {start: state.visibleStart, end: state.visibleEnd}
      };
    }
  };
  Object.defineProperty(globalThis, '__clockCadenceTrace', {value: Object.freeze(api), configurable: false});
}

function getRevision() {
  if (revision === undefined) {
    try { revision = execFileSync('git', ['rev-parse', 'HEAD'], {encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore']}).trim(); }
    catch (_) { revision = 'unavailable'; }
  }
  return revision;
}

function getHelperDigest() {
  if (helperDigest === undefined) helperDigest = sha256(fs.readFileSync(__filename));
  return helperDigest;
}

function buildRecord(kind, context, data) {
  const safeContext = selectFields(context, ['suite', 'form', 'browser', 'browserVersion', 'lowPower', 'deviceScaleFactor', 'dpr', 'DPR', 'viewport', 'mode']);
  if (safeContext.viewport) safeContext.viewport = selectFields(safeContext.viewport, ['width', 'height']);
  const fieldsByKind = {
    cadence: ['metrics', 'start', 'end', 'native', 'app', 'nativeColumns', 'appColumns', 'createdPolicyCount', 'visibility', 'geometryTimesMs', 'geometryStartMs', 'geometryEndMs'],
    navigation: ['outcome', 'elapsedMs', 'errorName', 'events', 'droppedEventCount', 'pageErrorCount', 'crashCount', 'pendingRequestCount', 'pendingRequests', 'snapshot']
  };
  const dataFields = fieldsByKind[kind] || ['metrics', 'geometryTimes', 'rawGeometryTimes', 'trace'];
  const record = {
    schemaVersion: 1,
    kind,
    provenance: {sourceRevision: process.env.GITHUB_SHA || getRevision(), platform: process.platform, arch: process.arch, node: process.version, helperDigest: getHelperDigest()},
    context: stripSensitiveKeys(safeContext),
    data: stripSensitiveKeys(selectFields(data, dataFields), kind === 'navigation')
  };
  record.traceID = sha256(stableJSON(record));
  return record;
}

function writeTrace(kind, context, data, options = {}) {
  const record = buildRecord(kind, context, data);
  const destination = options.destination || path.join(__dirname, '..', 'test-results', 'clock-diagnostics.jsonl');
  fs.mkdirSync(path.dirname(destination), {recursive: true});
  fs.appendFileSync(destination, `${JSON.stringify(record)}\n`, 'utf8');
  return record;
}

function metadataEscape(value) {
  return String(value).replace(/%/g, '%25').replace(/\r/g, '%0D').replace(/\n/g, '%0A').replace(/:/g, '%3A').replace(/,/g, '%2C');
}

function emitTrace(record, options = {}) {
  const output = options.write || (line => process.stdout.write(`${line}\n`));
  const encoded = Buffer.from(JSON.stringify(record), 'utf8').toString('base64');
  const chunkSize = options.chunkSize || 2400;
  const chunks = encoded.match(new RegExp(`[\\s\\S]{1,${chunkSize}}`, 'g')) || [''];
  chunks.forEach((chunk, index) => {
    const title = metadataEscape(`${record.traceID} ${index + 1}/${chunks.length}`);
    output(`::notice title=${title}::${chunk}`);
  });
  return chunks.length;
}

module.exports = {installCadenceTrace, writeTrace, emitTrace, buildRecord};
