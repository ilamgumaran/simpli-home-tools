// SPDX-License-Identifier: LicenseRef-Simpli-Noncommercial-1.0
// Copyright (C) 2026 ilamgumaran and contributors
const assert=require('node:assert/strict');
require('../characters.js');require('../world-layers.js');
const characters=globalThis.DeskCharacters,worlds=globalThis.DeskWorlds;
const rock=worlds.routes.woodlandRock,walk=worlds.routes.woodlandWalk;
const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
const endpoint=(rig,limb,scale)=>({x:rig.root.x+limb[2].x*scale,y:rig.root.y+limb[2].y*scale});
const bones=rig=>{
 for(const [limbs,lengths] of [[rig.arms,[12,11]],[rig.legs,[12,12]]])for(const limb of limbs){
  assert.ok(limb.every(point=>Number.isFinite(point.x)&&Number.isFinite(point.y)));
  for(let i=0;i<2;i++)assert.ok(Math.abs(distance(limb[i],limb[i+1])-lengths[i])<1e-8,'Contact solve changed anatomical bone length');
 }
};
const velocity=(a,b,dt)=>({x:(b.x-a.x)/dt,y:(b.y-a.y)/dt});
const sampleBoundary=(sample,at,point,limit)=>{
 const delta=1e-6,a=point(sample(at-delta)),b=point(sample(at)),c=point(sample(at+delta));
 assert.ok(distance(a,c)<.001,'Contact sequence jumps at a transfer boundary');
 assert.ok(distance(velocity(a,b,delta),velocity(b,c,delta))<limit,'Contact velocity jumps at a transfer boundary');
};

// Check the complete route, including every transfer rather than selected poses.
const holds=new Map(rock.stations.flatMap(station=>['leftHand','rightHand','leftFoot','rightFoot'].map(name=>[station[name].id,station[name]])));
for(let i=0;i<=6000;i++){
 const rig=characters.climbContacts(rock,i/6000);bones(rig);
 assert.ok(Object.values(rig.contacts).filter(Boolean).length>=3,'Climber lost three supporting contacts');
 for(const [names,limbs] of [[['leftHand','rightHand'],rig.arms],[['leftFoot','rightFoot'],rig.legs]])names.forEach((name,index)=>{
  const end=endpoint(rig,limbs[index],rock.scale);
  assert.ok(distance(end,rig.targets[name])<1e-8,'Climbing contact was clamped away from its terrain target');
  if(rig.contacts[name])assert.ok(distance(end,holds.get(rig.holds[name]))<1e-8,'Loaded limb slides on a terrain hold');
 });
}
for(let station=0;station<rock.stations.length-1;station++)for(let stage=1;stage<=5;stage++){
 const at=(station+stage/5)/(rock.stations.length-1);if(at>=1)continue;
 sampleBoundary(p=>characters.climbContacts(rock,p),at,rig=>rig.root,.02);
 for(const name of ['leftHand','rightHand','leftFoot','rightFoot'])sampleBoundary(p=>characters.climbContacts(rock,p),at,rig=>rig.targets[name],.1);
}

// Actual wall-time effort includes supported fatigue recovery. The root should
// flow between transfers instead of waiting motionless for a fifth lift stage.
let previous=null,activeFrames=0,stationaryFrames=0,maxRootSpeed=0,recovery=null;
for(let frame=0;frame<=12*60;frame++){
 const seconds=frame/60,effort=characters.ascent(seconds/12,12-seconds);
 const rig=characters.climbContacts(rock,effort.progress,{resting:effort.resting});
 if(effort.resting){if(recovery)assert.deepEqual(rig,recovery,'Loaded body or contacts move during recovery');recovery=rig;}
 if(previous&&!effort.resting&&!previous.resting){
  const speed=distance(rig.root,previous.rig.root)*60;activeFrames++;if(speed<.01)stationaryFrames++;maxRootSpeed=Math.max(maxRootSpeed,speed);
 }
 previous={rig,resting:effort.resting};
}
assert.ok(stationaryFrames/activeFrames<.25,'Climber still waits between short, disconnected body lifts');
assert.ok(maxRootSpeed<30,'Body rises in an abrupt unsupported-looking burst');

// Both stance feet and swing trajectories are checked at dense route samples.
let previousWalk=null,minBody=Infinity,maxBody=-Infinity;
for(let i=0;i<=6000;i++){
 const rig=characters.walkContacts(walk,i/6000);bones(rig);minBody=Math.min(minBody,rig.root.y);maxBody=Math.max(maxBody,rig.root.y);
 assert.ok(rig.contacts.leftFoot||rig.contacts.rightFoot);
 ['leftFoot','rightFoot'].forEach((name,index)=>{
  const end=endpoint(rig,rig.legs[index],walk.scale);assert.ok(distance(end,rig.targets[name])<1e-8);
  assert.ok(end.y<=walk.groundY+1e-8,'Swing foot crosses below the ground');
  if(rig.holds[name]){
   assert.ok(distance(end,rig.holds[name])<1e-8,'Planted walking foot misses the ground');
   if(previousWalk?.holds[name]&&distance(previousWalk.holds[name],rig.holds[name])<.001)assert.ok(distance(end,previousWalk.targets[name])<1e-8,'Stance foot slides during weight transfer');
  }
 });
 previousWalk=rig;
}
assert.ok(maxBody-minBody>.3,'Walking torso does not participate in supported weight transfer');
for(let step=1;step<walk.steps;step++)for(const name of ['leftFoot','rightFoot']){
 const at=step/walk.steps;sampleBoundary(p=>characters.walkContacts(walk,p),at,rig=>rig.targets[name],.02);
 const delta=1e-6,center=characters.walkContacts(walk,at).targets[name];
 for(const sign of [-1,1])assert.ok(distance(characters.walkContacts(walk,at+sign*delta).targets[name],center)/delta<.02,'Foot reaches the ground with nonzero landing or toe-off velocity');
}
const leftBehind=characters.walkContacts(walk,0),leftAhead=characters.walkContacts(walk,1/walk.steps);
assert.ok(leftAhead.legs[0][2].x>leftBehind.legs[0][2].x&&leftAhead.arms[0][2].x<leftBehind.arms[0][2].x,'Arm swing does not oppose the same-side stepping leg');

// Work is a supported whole-body gesture: feet remain planted while the named
// grip and tool tip continue to meet the current work socket exactly.
for(const activity of [{root:{x:299,y:303},work:{x:303,y:319},hand:0,action:'gather'},{root:{x:326,y:300},work:{x:339,y:309},hand:1,action:'cook'}]){
 const sample=cycle=>characters.workContacts({...activity,scale:.72,groundY:318.72,cycle,angle:Math.PI/2+Math.sin(cycle*Math.PI*2)*.12});
 for(let i=0;i<=1000;i++){
  const rig=sample(i/500);bones(rig);
  rig.legs.forEach((limb,index)=>assert.ok(distance(endpoint(rig,limb,.72),{x:activity.root.x+(index?12:-12)*.72,y:318.72})<1e-8,'Working stance slides with the torso'));
  const wrist=rig.arms[activity.hand][2],grip=characters.toolGrip(wrist,rig.toolTarget);
  assert.ok(distance(grip.tip,rig.toolTarget)<1e-8,'Tool tip leaves its work socket');
  assert.ok(distance({x:rig.root.x+grip.tip.x*.72,y:rig.root.y+grip.tip.y*.72},activity.work)<1e-8);
 }
 sampleBoundary(sample,1,rig=>rig.root,.001);
 assert.ok(distance(sample(.25).root,sample(.75).root)>.5,'Work remains a rigid arm gesture');
}
console.log('PASS organic contacts: dense grounded sequences, smooth landing/transfer velocities, supported body rhythm and stationary recovery.');
