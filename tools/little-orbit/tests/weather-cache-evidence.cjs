// SPDX-License-Identifier: LicenseRef-Simpli-Noncommercial-1.0
// Copyright (C) 2026 ilamgumaran and contributors
'use strict';

const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const {execFileSync} = require('node:child_process');
const {emitTrace} = require('./cadence-trace.cjs');

const MAX_RAW = 4096;
const MAX_ERROR = 160;

// This function is serialized into page.addInitScript. It only attaches an
// observer; localStorage is read only when the test explicitly calls it.
function installWeatherCacheSnapshot() {
  window.__weatherCacheSnapshot = () => {
    const result = {key:null, unit:null, raw:null, rawLength:null, truncated:false,
      storageError:null, weatherStatus:null, weatherKind:null};
    try { result.key = cacheKey(); } catch (error) { result.storageError = {name:error?.name || 'Error',message:String(error?.message || '').slice(0,160)}; }
    try { result.unit = prefs?.unit ?? null; } catch (error) { result.storageError = {name:error?.name || 'Error',message:String(error?.message || '').slice(0,160)}; }
    try {
      const state = window.DeskHabitatWeather?.get?.();
      result.weatherStatus = state?.status ?? null;
      result.weatherKind = state?.kind ?? null;
    } catch (_) {}
    if (typeof result.key !== 'string') return result;
    try {
      const raw = localStorage.getItem(result.key);
      result.rawLength = raw === null ? null : raw.length;
      result.truncated = raw !== null && raw.length > 4096;
      result.raw = raw === null ? null : raw.slice(0,4096);
    } catch (error) {
      result.storageError ||= {name:error?.name || 'Error',message:String(error?.message || '').slice(0,160)};
    }
    return result;
  };
}

function isUsableWeather(data) {
  return Number.isFinite(data?.current?.temperature_2m) &&
    Array.isArray(data?.daily?.temperature_2m_max) && Number.isFinite(data.daily.temperature_2m_max[0]) &&
    Array.isArray(data?.daily?.temperature_2m_min) && Number.isFinite(data.daily.temperature_2m_min[0]);
}

function classifySnapshot(snapshot) {
  if (snapshot?.storageError) return 'storage-error';
  if (snapshot?.raw === null || snapshot?.raw === undefined) return 'absent';
  if (snapshot.truncated || snapshot.rawLength > MAX_RAW) return 'oversized';
  let entry;
  try { entry = JSON.parse(snapshot.raw); } catch (_) { return 'invalid-json'; }
  return isUsableWeather(entry?.data) ? 'usable' : 'unusable';
}

function snapshotSummary(snapshot) {
  const classification = classifySnapshot(snapshot);
  let entry = null;
  if (classification === 'usable') {
    try { entry = JSON.parse(snapshot.raw); } catch (_) {}
  }
  const rawFullyCaptured = snapshot?.raw !== null && snapshot?.raw !== undefined &&
    !snapshot.truncated && snapshot.rawLength === snapshot.raw.length;
  return {
    classification,
    key: typeof snapshot?.key === 'string' ? snapshot.key.slice(0,200) : null,
    unit: typeof snapshot?.unit === 'string' ? snapshot.unit.slice(0,32) : null,
    rawLength: Number.isSafeInteger(snapshot?.rawLength) ? snapshot.rawLength : null,
    truncated: Boolean(snapshot?.truncated),
    rawSha256: rawFullyCaptured ? sha256(snapshot.raw) : null,
    weatherStatus: typeof snapshot?.weatherStatus === 'string' ? snapshot.weatherStatus.slice(0,40) : null,
    weatherKind: typeof snapshot?.weatherKind === 'string' ? snapshot.weatherKind.slice(0,40) : null,
    forecast: entry ? {
      code: Number.isFinite(entry.data.current.weather_code) ? entry.data.current.weather_code : null,
      temperature: Number.isFinite(entry.data.current.temperature_2m) ? entry.data.current.temperature_2m : null
    } : null,
    storageError: snapshot?.storageError ? safeError(snapshot.storageError) : null
  };
}

function sha256(value) { return crypto.createHash('sha256').update(value).digest('hex'); }

function stableJSON(value) {
  if (Array.isArray(value)) return `[${value.map(stableJSON).join(',')}]`;
  if (value && typeof value === 'object') return `{${Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${stableJSON(value[key])}`).join(',')}}`;
  return JSON.stringify(value);
}

function safeError(error) {
  return {
    name: String(error?.name || 'Error').slice(0,80),
    message: String(error?.message || '').replace(/(?:https?|file):\/\/[^\s"'<>]+/gi,'[redacted-url]').replace(/(?:[A-Za-z]:\\|\/)[^\s"'<>]+/g,'[redacted-path]').slice(0,MAX_ERROR)
  };
}

function buildWeatherCacheRecord(context, data) {
  const sourceRevision = process.env.GITHUB_SHA || (() => {
    try { return execFileSync('git',['rev-parse','HEAD'],{cwd:path.join(__dirname,'..'),encoding:'utf8',stdio:['ignore','pipe','ignore']}).trim(); }
    catch (_) { return 'unknown'; }
  })();
  const helperDigest = sha256(fs.readFileSync(__filename));
  const verifierDigest = sha256(fs.readFileSync(path.join(__dirname,'verify-weather-habitat.cjs')));
  const safeData = {
    phase: data.phase,
    before: data.before ? snapshotSummary(data.before) : null,
    after: data.after ? snapshotSummary(data.after) : null,
    ...(data.error ? {error:safeError(data.error)} : {})
  };
  const record = {
    schemaVersion:1, kind:'weather-cache',
    provenance:{sourceRevision, platform:process.platform, arch:process.arch, node:process.version, browser:context.browser || null,
      browserVersion:context.browserVersion || null, form:context.form || null, helperDigest, verifierDigest},
    context:{suite:'weather-habitat', target:context.target || null},
    data:safeData
  };
  record.traceID = sha256(stableJSON(record));
  return record;
}

function writeWeatherCacheRecord(record, options = {}) {
  const destination = options.destination || path.join(__dirname,'..','test-results','weather-cache-diagnostics.jsonl');
  fs.mkdirSync(path.dirname(destination),{recursive:true});
  fs.appendFileSync(destination,`${JSON.stringify(record)}\n`,'utf8');
  return record;
}

async function bestEffortSnapshot(snapshotter, timeoutMs = 1500) {
  let timer;
  try {
    return await Promise.race([
      Promise.resolve().then(snapshotter),
      new Promise(resolve => { timer=setTimeout(()=>resolve(null),timeoutMs); })
    ]);
  } catch (_) { return null; }
  finally { clearTimeout(timer); }
}

async function preserveFailure(originalError, context, snapshots, options = {}) {
  try {
    const record = buildWeatherCacheRecord(context,{
      phase:options.phase, before:snapshots.before, after:snapshots.after, error:originalError
    });
    try { (options.write || writeWeatherCacheRecord)(record,options); } catch (_) {}
    try { (options.emit || emitTrace)(record); } catch (_) {}
  } catch (_) {}
  return originalError;
}

module.exports = {MAX_RAW,installWeatherCacheSnapshot,isUsableWeather,classifySnapshot,snapshotSummary,buildWeatherCacheRecord,writeWeatherCacheRecord,bestEffortSnapshot,preserveFailure};
