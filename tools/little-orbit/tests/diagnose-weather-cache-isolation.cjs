// SPDX-License-Identifier: LicenseRef-Simpli-Noncommercial-1.0
// Copyright (C) 2026 ilamgumaran and contributors
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const crypto = require('node:crypto');
const {execFileSync} = require('node:child_process');
const {engine, options, url} = require('./runtime.cjs');
const {emitTrace} = require('./cadence-trace.cjs');

const root = path.join(__dirname, '..');
const canonicalPath = path.join(__dirname, 'verify-weather-habitat.cjs');
const helperPath = path.join(__dirname, 'weather-cache-evidence.cjs');
const outputPath = path.join(root, 'test-results', 'weather-cache-isolation.jsonl');
const diagnosticsPath = path.join(root, 'test-results', 'weather-cache-diagnostics.jsonl');
const CACHE_MARKER = '  const validCache=await page.evaluate(';
const HIGH_DPI_START = '  const highDpi=await browser.newContext(';
const VIEWPORT_MARKER = '  await page.setViewportSize({width:1280,height:720});';
const CONDITIONS = [
  {form: 'hosted', sibling: 'present'},
  {form: 'hosted', sibling: 'absent'},
  {form: 'portable', sibling: 'absent'},
  {form: 'portable', sibling: 'present'}
];
const WILLIAMS4 = [
  [0, 1, 3, 2],
  [1, 2, 0, 3],
  [2, 3, 1, 0],
  [3, 0, 2, 1]
];
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');
function stableJSON(value) {
  if (Array.isArray(value)) return `[${value.map(stableJSON).join(',')}]`;
  if (value && typeof value === 'object') return `{${Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${stableJSON(value[key])}`).join(',')}}`;
  return JSON.stringify(value);
}
function buildCaseRecord(record) {
  return {...record, traceID: sha256(stableJSON(record))};
}
function safeError(error) {
  return {
    name: String(error?.name || 'Error').slice(0, 80),
    message: String(error?.message || '').replace(/(?:https?|file):\/\/[^\s"'<>]+/gi, '[redacted-url]')
      .replace(/(?:[A-Za-z]:\\|\/)[^\s"'<>]+/g, '[redacted-path]').slice(0, 240)
  };
}

function count(text, marker) {
  return text.split(marker).length - 1;
}

function transformVerifier(source, sibling) {
  if (count(source, CACHE_MARKER) !== 1) throw new Error('Canonical cached-restoration marker must occur exactly once');
  if (count(source, HIGH_DPI_START) !== 1) throw new Error('Canonical high-DPI sibling marker must occur exactly once');
  if (count(source, VIEWPORT_MARKER) !== 1) throw new Error('Canonical post-sibling viewport marker must occur exactly once');

  let prelude = source.slice(0, source.indexOf(CACHE_MARKER));
  if (sibling === 'absent') {
    const start = prelude.indexOf(HIGH_DPI_START);
    const end = prelude.indexOf(VIEWPORT_MARKER, start);
    if (start < 0 || end < 0) throw new Error('Canonical high-DPI sibling block boundary is missing');
    prelude = prelude.slice(0, start) + prelude.slice(end);
  } else if (sibling !== 'present') {
    throw new Error(`Unknown sibling condition: ${String(sibling)}`);
  }

  // The compiled file has the canonical filename so all relative requires and
  // paths remain those of the source verifier. This is an audited derivation,
  // not execution of the unmodified full verifier.
  return `${prelude}\n  return {cacheAssertion:'passed'};\n }finally{await context.close();}\n}\nmodule.exports={verify};\n`;
}

function loadDerivedVerifier(source, sibling) {
  const code = transformVerifier(source, sibling);
  const compiled = new Module(canonicalPath, module);
  compiled.filename = canonicalPath;
  compiled.paths = Module._nodeModulePaths(path.dirname(canonicalPath));
  compiled._compile(code, canonicalPath);
  if (typeof compiled.exports.verify !== 'function') throw new Error('Derived verifier did not export verify');
  return {verify: compiled.exports.verify, code};
}

function sourceRevision() {
  try { return execFileSync('git', ['rev-parse', 'HEAD'], {cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore']}).trim(); }
  catch (_) { return 'unavailable'; }
}

function newDiagnosticIDs(offset) {
  if (!fs.existsSync(diagnosticsPath)) return {ids: [], error: offset ? 'diagnostic-file-disappeared' : null};
  try {
    const data = fs.readFileSync(diagnosticsPath);
    if (data.length < offset) return {ids: [], error: 'diagnostic-file-truncated'};
    const additions = data.subarray(offset).toString('utf8').split('\n').filter(Boolean);
    const ids = [];
    for (const line of additions) {
      let record;
      try { record = JSON.parse(line); }
      catch (_) { return {ids, error: 'malformed-diagnostic-json'}; }
      if (typeof record.traceID !== 'string' || !record.traceID) return {ids, error: 'diagnostic-trace-id-missing'};
      ids.push(record.traceID);
    }
    return {ids: ids.slice(0, 8), error: ids.length > 8 ? 'diagnostic-trace-id-limit-exceeded' : null};
  } catch (_) { return {ids: [], error: 'diagnostic-file-read-failed'}; }
}

function appendRecord(record) {
  const withTrace = buildCaseRecord(record);
  fs.mkdirSync(path.dirname(outputPath), {recursive: true});
  fs.appendFileSync(outputPath, `${JSON.stringify(withTrace)}\n`, 'utf8');
  try { emitTrace(withTrace, {chunkSize: 1200}); } catch (_) {}
  const {caseID, outcome, condition} = withTrace;
  process.stdout.write(`${outcome.toUpperCase()} weather-cache case ${caseID} ${condition.form}/${condition.sibling}\n`);
}

async function runCase(item, round, order, provenance, compiled, smoke) {
  const caseID = `r${round + 1}-p${String(order + 1).padStart(2, '0')}-${item.form}-${item.sibling}`;
  const target = item.form === 'portable'
    ? require('node:url').pathToFileURL(path.join(root, 'Little Orbit.html')).href
    : url;
  let diagnosticOffset = 0, diagnosticReadError = null;
  try { if (fs.existsSync(diagnosticsPath)) diagnosticOffset = fs.statSync(diagnosticsPath).size; }
  catch (_) { diagnosticReadError = 'diagnostic-offset-read-failed'; }
  let browser = null, browserVersion = null, outcome = 'pass', errorInfo = null;
  try {
    browser = await engine.launch({...options, headless: true});
    browserVersion = browser.version();
    await compiled.verify(browser, target);
  } catch (error) {
    outcome = 'fail';
    const safe = safeError(error);
    errorInfo = {name: safe.name, message: safe.message.slice(0, 240)};
  } finally {
    if (browser) {
      try { await browser.close(); }
      catch (error) {
        outcome = 'fail';
        const safe = safeError(error);
        errorInfo ||= {name: safe.name, message: safe.message.slice(0, 240)};
      }
    }
  }
  const diagnosticCapture = newDiagnosticIDs(diagnosticOffset);
  diagnosticReadError ||= diagnosticCapture.error;
  if (outcome === 'fail' && !diagnosticCapture.ids.length) diagnosticReadError ||= 'no-weather-diagnostic-for-failed-case';
  const record = {
    schemaVersion: 1,
    researchKind: 'weather-cache-isolation',
    caseID,
    order: round * 4 + order + 1,
    orderInRound: order + 1,
    round: round + 1,
    condition: item,
    browser: process.env.CLOCK_TEST_BROWSER || 'chromium',
    browserVersion,
    sourceRevision: provenance.sourceRevision,
    node: provenance.node,
    platform: provenance.platform,
    arch: provenance.arch,
    canonicalVerifierDigest: provenance.canonicalVerifierDigest,
    derivedVerifierDigest: compiled.digest,
    helperDigest: provenance.helperDigest,
    runnerDigest: provenance.runnerDigest,
    outcome,
    ...(errorInfo ? {error: errorInfo} : {}),
    weatherDiagnosticTraceIDs: diagnosticCapture.ids,
    ...(diagnosticReadError ? {diagnosticReadError} : {}),
    ...(smoke ? {smoke: true} : {})
  };
  appendRecord(record);
  return outcome;
}

async function main(argv = process.argv.slice(2)) {
  const unknown = argv.filter(arg => arg !== '--smoke');
  if (unknown.length) throw new Error(`Unknown argument: ${unknown[0]}`);
  const smoke = argv.includes('--smoke');
  const source = fs.readFileSync(canonicalPath, 'utf8');
  const provenance = {
    sourceRevision: sourceRevision(),
    node: process.version,
    platform: process.platform,
    arch: process.arch,
    canonicalVerifierDigest: sha256(source),
    helperDigest: sha256(fs.readFileSync(helperPath)),
    runnerDigest: sha256(fs.readFileSync(__filename))
  };
  const rounds = smoke ? 1 : 4;
  let failures = 0;
  for (let round = 0; round < rounds; round++) {
    for (let position = 0; position < 4; position++) {
      const conditionIndex = WILLIAMS4[round][position];
      const item = CONDITIONS[conditionIndex];
      const compiled = loadDerivedVerifier(source, item.sibling);
      compiled.digest = sha256(compiled.code);
      if (await runCase(item, round, position, provenance, compiled, smoke) === 'fail') failures++;
    }
  }
  if (failures) process.exitCode = 1;
}

if (require.main === module) main().catch(error => {
  const safe = safeError(error);
  process.stderr.write(`Weather cache isolation runner failed: ${safe.name}: ${safe.message}\n`);
  process.exitCode = 1;
});

module.exports = {CACHE_MARKER, HIGH_DPI_START, VIEWPORT_MARKER, CONDITIONS, WILLIAMS4, transformVerifier, loadDerivedVerifier, stableJSON, buildCaseRecord};
