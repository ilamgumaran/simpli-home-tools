// SPDX-License-Identifier: LicenseRef-Simpli-Noncommercial-1.0
// Copyright (C) 2026 ilamgumaran and contributors
const assert=require('node:assert/strict');
require('../characters.js');
require('../habitat-meal.js');
require('../habitat-community.js');
const meal=globalThis.DeskHabitatMeal,community=globalThis.DeskHabitatCommunity,characters=globalThis.DeskCharacters;
const schedule=[['gather',0,8],['carry',8,16],['cook',16,36],['deliver',36,44],['serve',44,49],['rest',49,54],['return',54,60]];
const sample=(hour,seconds,routine=hour===11?'cook':'care')=>meal.sample({routine,elapsedSeconds:hour*3600+seconds});
const state=(hour,seconds)=>{const model=community.sample(new Date(2026,9,5,hour,0,Math.floor(seconds),Math.round(seconds%1*1000))),pose=community.actorPose(model,'sage');return {model,cue:meal.sample(model),pose};};
const near=(a,b,tolerance,message)=>assert.ok(Math.abs(a-b)<=tolerance,`${message}: ${a} versus ${b}`);
const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
assert.equal(schedule.length,7);
for(const hour of [11,20]){
 for(const [name,start,end] of schedule){
  for(const second of [start,start+(end-start)/2,end-.001]){
   const cue=sample(hour,second);
   assert.equal(cue.active,true);assert.equal(cue.stage,name,`${hour}:${second}`);
   assert.ok(cue.label&&cue.caption,`Missing visible story for ${name}`);
   assert.ok(cue.weight>=0&&cue.weight<=1,`Invalid meal weight at ${hour}:${second}`);
  }
  if(end<60){
   assert.equal(sample(hour,end-.001).stage,name);
   assert.equal(sample(hour,end).stage,schedule[schedule.findIndex(s=>s[0]===name)+1][0]);
  }
 }
 assert.equal(sample(hour,60).stage,'gather','The authored minute repeats without accumulating state');
 assert.deepEqual(sample(hour,28),sample(hour,28),'Equal clock times must reconstruct the same meal');
 assert.equal(sample(hour,28).stage,'cook');
 assert.equal(sample(hour,10).stage,'carry');
 assert.equal(sample(hour,47).stage,'serve');
 assert.equal(sample(hour,59).stage,'return');
 assert.equal(sample(hour,1).weight,0,'Intro must leave the routine handoff visible');
 assert.ok(sample(hour,4).weight>.99,'The connected meal must become fully visible');
 assert.ok(sample(hour,59).weight>.99,'The connected meal remains active across an ordinary minute seam');
 assert.equal(sample(hour,7199).weight,0,'Exit must restore the base routine before the hour boundary');
 for(const second of [0,1,4,10,20,28,38,47,51,57,59.999,7199]){
  const {model,pose}=state(hour,second),detail=`${hour}:${second}`;
  assert.equal(model.routine,hour===11?'cook':'care');
  assert.ok(Number.isFinite(pose.x)&&Number.isFinite(pose.rootY),`Invalid Sage placement ${detail}`);
  for(const limb of pose.rig.arms)for(const [i,length] of [[0,characters.anatomy.upperArm],[1,characters.anatomy.forearm]])near(distance(limb[i],limb[i+1]),length,.025,`Sage arm bone ${detail}`);
  for(const limb of pose.rig.legs)for(const [i,length] of [[0,characters.anatomy.thigh],[1,characters.anatomy.shin]])near(distance(limb[i],limb[i+1]),length,.025,`Sage leg bone ${detail}`);
  // When the authored overlay has faded away, the physical base support plane
  // must be restored as well as the visible weight and props.
  if(second<=1||second>=7199){
   near(pose.x,community.staging.sage,.06,`Base stage x at meal seam ${detail}`);
  }
 }
 const before=state(hour,59.999).pose,after=state(hour,60).pose;
 near(before.x,after.x,.06,`${hour}: minute seam x`);
 near(before.rootY,after.rootY,.06,`${hour}: minute seam support plane`);
 for(const join of [8,16,36,44,49,54,60]){
  const prior=state(hour,join-.001).pose,next=state(hour,join+.001).pose;
  const world=(pose,p)=>({x:pose.x+p.x*pose.actorScale,y:pose.rootY+p.y*pose.actorScale});
  const points=pose=>[...pose.rig.arms,...pose.rig.legs].flatMap(limb=>limb.map(p=>world(pose,p)));
  const a=points(prior),b=points(next),jump=Math.max(...a.map((point,i)=>distance(point,b[i])));
  assert.ok(jump<.25,`${hour}: Sage painted joints jump ${jump.toFixed(3)} camp units at ${join}s`);
 }
}
for(const hour of [10,13,19,22]){
 const model=community.sample(new Date(2026,9,5,hour,0,28)),base=community.actorPose(model,'sage');
 assert.equal(meal.sample(model).active,false,`${hour}: meal leaks into another routine`);
 assert.strictEqual(meal.apply(model,base),base,`${hour}: inactive meal changes the ordinary pose`);
}
const quiet=community.sample(new Date(2026,9,5,11,0,28)),quietBase=community.actorPose(quiet,'sage',{frozen:true});
assert.equal(meal.sample(quiet,{frozen:true}).active,false);
assert.strictEqual(meal.apply(quiet,quietBase,{frozen:true}),quietBase,'Quiet meal changes a frozen actor');
console.log('PASS meal sequence: seven timed stages, repeated minute, deterministic jumps, fixed bones, physical seam and quiet routine.');
