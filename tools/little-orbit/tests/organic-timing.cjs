// SPDX-License-Identifier: LicenseRef-Simpli-Noncommercial-1.0
// Copyright (C) 2026 ilamgumaran and contributors
const assert=require('node:assert/strict');
require('../characters.js');require('../world-layers.js');
const worlds=globalThis.DeskWorlds,characters=globalThis.DeskCharacters;
const model=(actionId,second=0,hour=10)=>({hour,minute:6,second,actionId,action:worlds.actions[actionId]});
const near=(actual,expected)=>assert.ok(Math.abs(actual-expected)<1e-9,`${actual} differs from ${expected}`);

// Every crossing is paced independently of the work/recovery budget. The
// sampler is deterministic for whole-minute playback or arbitrary resumption.
for(const distance of [0,100,1000])for(const duration of [4,12,20])for(const interval of [30,45,60,90,300])for(const actionId of ['survey','rock','cook']){
 const options={distance,duration,interval},travel=distance===0?1:distance===100?2:20;
 const windows=[];
 for(let visitStart=0;visitStart<55;visitStart+=interval){const start=visitStart+travel,length=Math.min(duration,interval-travel,55-start);if(length>=4)windows.push({visitStart,start,end:start+length});}
 for(let frame=0;frame<60*100;frame++){
  const second=frame/100,timing=worlds.motionTiming(model(actionId,second),options),window=windows.find(w=>second>=w.start&&second<w.end),crossing=windows.find(w=>second>=w.visitStart&&second<w.start);
  assert.equal(timing.travel,travel);assert.equal(timing.traveling,!!crossing);
  assert.equal(timing.running,!!window,'Work runs outside an authored arrival/effort window');
  assert.ok(timing.progress>=0&&timing.progress<=1&&timing.climb>=0&&timing.climb<=1);
  assert.ok(timing.workDuration===0||timing.workDuration>=4,'Short leftover window compresses mandatory effort/recovery');
  assert.deepEqual(worlds.motionTiming(model(actionId,second),options),timing,'Timing depends on earlier samples');
  if(timing.traveling){assert.equal(timing.phase,'travel');assert.equal(timing.pose,'walk');assert.equal(timing.progress,0);assert.equal(timing.climb,0);assert.equal(timing.assisted,false);}
  if(window){near(timing.workStart,window.start);near(timing.workDuration,window.end-window.start);near(timing.progress,(second-window.start)/(window.end-window.start));}
  if(second>=55){assert.equal(timing.running,false);assert.equal(timing.traveling,false);assert.equal(timing.progress,1);assert.equal(timing.phase,'observe');assert.equal(timing.assisted,false);}
  if(timing.phase==='recover'){near(timing.climb,.4);assert.equal(timing.pose,'recover-climb');assert.equal(timing.assisted,false);}
  if(timing.assisted){assert.equal(actionId,'rock');assert.ok(timing.progress>.85);assert.ok(timing.workDuration-timing.elapsed<=1.5+1e-9);assert.notEqual(timing.phase,'recover');assert.equal(timing.pose,'assist');}
 }
 // Arrival launches a complete effort phase instead of advancing the climb
 // while the character is still crossing to its first protected hold.
 const arrival=worlds.motionTiming(model(actionId,travel),options);
 assert.equal(arrival.running,true);assert.equal(arrival.traveling,false);assert.equal(arrival.progress,0);
 for(const window of windows){
  if(actionId!=='rock')continue;
  const length=window.end-window.start,a=worlds.motionTiming(model(actionId,window.start+length*.35),options),b=worlds.motionTiming(model(actionId,window.start+length*.49),options);
  assert.equal(a.phase,'recover');assert.equal(b.phase,'recover');assert.equal(a.climb,b.climb);assert.ok(b.fatigue<a.fatigue);
  assert.deepEqual(characters.climbContacts(worlds.routes.woodlandRock,a.climb,{resting:true}),characters.climbContacts(worlds.routes.woodlandRock,b.climb,{resting:true}),'Protected recovery drifts along the route');
 }
}

// The configured interval starts complete crossing/work visits within a minute.
// At most a complete four-second bout may use the window before quiet :55.
const options={distance:350,duration:12,interval:45};
const skipped=worlds.motionTiming(model('rock',52),options);
assert.equal(skipped.workStart,52);assert.equal(skipped.workDuration,0);assert.equal(skipped.running,false);assert.equal(skipped.progress,1);
const clipped=worlds.motionTiming(model('rock',50),{distance:1000,duration:20,interval:30});
assert.equal(clipped.workStart,50);assert.equal(clipped.workDuration,5);assert.equal(clipped.running,true);assert.equal(clipped.progress,0);
const beforeRepeat=worlds.motionTiming(model('rock',29.999),{distance:1000,duration:20,interval:30});
assert.equal(beforeRepeat.workDuration,10);assert.ok(beforeRepeat.progress>.999,'Previous climb does not finish before the next protected return');
const returnTrip=worlds.motionTiming(model('rock',30),{distance:1000,duration:20,interval:30});
assert.equal(returnTrip.visitStart,30);assert.equal(returnTrip.traveling,true);assert.equal(returnTrip.running,false);assert.equal(returnTrip.elapsed,0);
const atDeadline=worlds.motionTiming(model('rock',11.5),{distance:0,duration:12});
assert.equal(atDeadline.assisted,true,'Deadline assistance excludes the inclusive 1.5-second boundary');
assert.equal(worlds.motionTiming(model('rock',4.3),{distance:0,duration:12}).assisted,false);

for(const distance of [0,100,1000])for(const actionId of ['survey','rock','cook'])for(const second of [0,.5,5,20,40,55,59.999]){
 for(const quiet of [worlds.motionTiming(model(actionId,second),{distance,reducedMotion:true}),worlds.motionTiming(model(actionId,second,2),{distance})]){
  assert.equal(quiet.traveling,false);assert.equal(quiet.running,false);assert.equal(quiet.progress,1);assert.equal(quiet.climb,actionId==='rock'?1:0);assert.equal(quiet.fatigue,0);assert.equal(quiet.assisted,false);
 }
 assert.equal(worlds.motionTiming(model(actionId,second,2),{distance}).pose,'sleep');
}
assert.equal(worlds.motionTiming(model('survey'),{distance:-50}).travel,1);
assert.equal(worlds.motionTiming(model('survey'),{distance:5000}).travel,20);
assert.equal(worlds.motionTiming(model('survey',2),{duration:3}).running,false);
console.log('PASS organic timing: body-paced crossings, arrival work, intact recovery, bounded repeated bouts and quiet minute endings.');
