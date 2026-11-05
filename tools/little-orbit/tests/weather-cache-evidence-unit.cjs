// SPDX-License-Identifier: LicenseRef-Simpli-Noncommercial-1.0
// Copyright (C) 2026 ilamgumaran and contributors
'use strict';

const assert = require('node:assert/strict');
const {
  MAX_RAW,installWeatherCacheSnapshot,classifySnapshot,snapshotSummary,buildWeatherCacheRecord,writeWeatherCacheRecord,bestEffortSnapshot,preserveFailure
} = require('./weather-cache-evidence.cjs');

const valid = {data:{current:{temperature_2m:5,weather_code:71},daily:{temperature_2m_max:[10],temperature_2m_min:[0]}},at:1};
const raw = JSON.stringify(valid);
// Exercise the actual serialized browser hook without touching unrelated keys.
let reads=0;
const sandbox={window:{DeskHabitatWeather:{get:()=>({status:'live',kind:'snow'})}},
  prefs:{unit:'fahrenheit'},cacheKey:()=> 'fixture-weather-key',
  localStorage:{getItem:key=>{assert.equal(key,'fixture-weather-key');reads++;return raw;}}};
require('node:vm').runInNewContext(`(${installWeatherCacheSnapshot.toString()})()`,sandbox);
assert.equal(reads,0,'Installing the observer read storage before the checkpoint');
assert.equal(sandbox.window.__weatherCacheSnapshot().raw,raw);
assert.equal(reads,1,'Snapshot read more than the current weather key');
sandbox.localStorage.getItem=()=> 'x'.repeat(MAX_RAW+10);
const bounded=sandbox.window.__weatherCacheSnapshot();
assert.equal(bounded.raw.length,MAX_RAW);
assert.equal(bounded.rawLength,MAX_RAW+10);
assert.equal(bounded.truncated,true);
sandbox.cacheKey=()=>{throw new Error('cache key unavailable');};
sandbox.localStorage.getItem=()=>assert.fail('Observer read a fallback key');
assert.equal(sandbox.window.__weatherCacheSnapshot().storageError.name,'Error');
const snapshot = value => ({key:'orbit-weather:33.9276:-84.6202:fahrenheit',unit:'fahrenheit',raw:value,
  rawLength:value===null?null:value.length,truncated:false,weatherStatus:'live',weatherKind:'snow'});

assert.equal(classifySnapshot(snapshot(null)),'absent');
assert.equal(classifySnapshot(snapshot('{broken')),'invalid-json');
assert.equal(classifySnapshot(snapshot('null')),'unusable');
assert.equal(classifySnapshot(snapshot('[]')),'unusable');
assert.equal(classifySnapshot(snapshot(JSON.stringify({data:{current:{temperature_2m:5},daily:{temperature_2m_max:[null],temperature_2m_min:[0]}}}))),'unusable','Corrupt daily maximum was accepted');
assert.equal(classifySnapshot({...snapshot(raw),storageError:{name:'SecurityError',message:'denied'}}),'storage-error');
assert.equal(classifySnapshot({...snapshot(raw),raw:'x'.repeat(MAX_RAW+1),rawLength:MAX_RAW+1,truncated:true}),'oversized');
assert.equal(classifySnapshot({...snapshot(raw),truncated:true,rawLength:MAX_RAW+1}),'oversized');
assert.equal(classifySnapshot(snapshot(raw)),'usable');

const oversizedSummary=snapshotSummary({...snapshot('x'.repeat(MAX_RAW)),rawLength:MAX_RAW+1,truncated:true});
assert.equal(oversizedSummary.classification,'oversized');
assert.equal(oversizedSummary.rawSha256,null,'Truncated raw cache was hashed as complete');
const summary=snapshotSummary(snapshot(raw));
assert.equal(summary.rawSha256,require('node:crypto').createHash('sha256').update(raw).digest('hex'));
assert.equal(summary.forecast.code,71);
assert.equal(summary.forecast.temperature,5);
assert.ok(!JSON.stringify(summary).includes(raw),'Evidence included the raw cache string');
assert.equal(summary.key,'orbit-weather:33.9276:-84.6202:fahrenheit');
assert.ok(!('raw' in summary));
const storageErrorSummary=snapshotSummary({...snapshot(null),storageError:{name:'SecurityError',message:'denied at https://example.test/private?token=secret /private/profile/cache'}});
assert.equal(storageErrorSummary.storageError.name,'SecurityError');
assert.ok(storageErrorSummary.storageError.message.length<=160);
assert.ok(!storageErrorSummary.storageError.message.includes('secret'));
assert.ok(!storageErrorSummary.storageError.message.includes('/private/profile'));

const context={browser:'chromium',browserVersion:'test',form:'hosted',target:'hosted'};
const recordA=buildWeatherCacheRecord(context,{phase:'beforeReload',before:snapshot(raw)});
const recordB=buildWeatherCacheRecord(context,{phase:'beforeReload',before:snapshot(raw)});
assert.equal(recordA.traceID,recordB.traceID,'Canonical record hash was unstable');
assert.equal(recordA.schemaVersion,1);
assert.equal(recordA.kind,'weather-cache');
assert.equal(recordA.data.before.classification,'usable');
assert.ok(!JSON.stringify(recordA).includes(raw));
assert.match(recordA.provenance.verifierDigest,/^[a-f0-9]{64}$/);
const fs=require('node:fs'),path=require('node:path');
const outputDir=fs.mkdtempSync(path.join(require('node:os').tmpdir(),'clock-weather-evidence-'));
try{
  const destination=path.join(outputDir,'nested','weather.jsonl');
  writeWeatherCacheRecord(recordA,{destination});
  writeWeatherCacheRecord(recordB,{destination});
  const saved=fs.readFileSync(destination,'utf8').trim().split('\n').map(line=>JSON.parse(line));
  assert.deepEqual(saved,[recordA,recordB],'Failure records were not appended losslessly');
}finally{fs.rmSync(outputDir,{recursive:true,force:true});}

async function main(){
  assert.equal(await bestEffortSnapshot(()=>new Promise(()=>{}),20),null,'Hung observer exceeded its bounded wait');
  const helperError=new Error('snapshot helper failed');
  assert.equal(await bestEffortSnapshot(()=>{throw helperError;},20),null);
  const originalError=new Error('cached status timed out');
  const fallbackNotices=[];
  const returned=await preserveFailure(originalError,context,{before:{storageError:{name:'Error',message:'failed'}}},{
    phase:'afterReload',write:()=>{throw new Error('diagnostic writer failed');},emit:record=>fallbackNotices.push(record)
  });
  assert.equal(returned,originalError,'Diagnostic failure replaced the original browser failure');
  assert.equal(fallbackNotices.length,1,'File write failure suppressed the independent notice');
  const emitted=[];
  const emittedResult=await preserveFailure(originalError,context,{before:snapshot(raw)},{
    phase:'afterReload',write:()=>{},emit:record=>emitted.push(record)
  });
  assert.equal(emittedResult,originalError);
  assert.equal(emitted.length,1);
  assert.equal(emitted[0].data.error.name,'Error');
  assert.equal(emitted[0].data.error.message,'cached status timed out');
  assert.equal(await preserveFailure(originalError,context,{before:snapshot(raw)},{
    phase:'afterReload',write:()=>{},emit:()=>{throw new Error('notice failed');}
  }),originalError,'Notice failure replaced the original browser failure');
  console.log('PASS weather cache evidence unit: classifications, strict bounds, raw redaction, stable hashes and original-error preservation.');
}

main().catch(error=>{console.error(error);process.exitCode=1;});
