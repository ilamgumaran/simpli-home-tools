const assert=require('node:assert/strict');
require('../characters.js');require('../world-layers.js');
const worlds=globalThis.DeskWorlds,characters=globalThis.DeskCharacters;
// Real terrain targets, not support booleans: fixed limbs reach the same authored hold.
const route=worlds.routes.woodlandRock,holdMap=new Map(route.stations.flatMap(s=>['leftHand','rightHand','leftFoot','rightFoot'].map(name=>[s[name].id,s[name]])));
let previousRig=null;
for(let sample=0;sample<=1000;sample++){
 const rig=characters.climbContacts(route,sample/1000);
 assert.ok(Object.values(rig.contacts).filter(Boolean).length>=3);
 for(const [names,limbs,lengths] of [[['leftHand','rightHand'],rig.arms,[12,11]],[['leftFoot','rightFoot'],rig.legs,[12,12]]])names.forEach((name,i)=>{
  const limb=limbs[i];for(let bone=0;bone<2;bone++)assert.ok(Math.abs(Math.hypot(limb[bone+1].x-limb[bone].x,limb[bone+1].y-limb[bone].y)-lengths[bone])<1e-8);
  const end={x:rig.root.x+limb[2].x*route.scale,y:rig.root.y+limb[2].y*route.scale};
  assert.ok(Math.hypot(end.x-rig.targets[name].x,end.y-rig.targets[name].y)<1e-8);
  if(rig.contacts[name]){const hold=holdMap.get(rig.holds[name]);assert.ok(Math.hypot(end.x-hold.x,end.y-hold.y)<1e-8);}
 });
 if(previousRig)assert.ok(Math.hypot(rig.root.x-previousRig.root.x,rig.root.y-previousRig.root.y)<.4,'Body jump between supported steps');
 previousRig=rig;
}
const recoveryA=characters.climbContacts(route,characters.ascent(.35).progress,{resting:true}),recoveryB=characters.climbContacts(route,characters.ascent(.49).progress,{resting:true});
assert.deepEqual(recoveryA,recoveryB);assert.equal(Object.values(recoveryA.contacts).filter(Boolean).length,4);
assert.throws(()=>characters.climbContacts(route,NaN));
const badRoute={...route,stations:route.stations.map(s=>({...s,leftHand:{...s.leftHand,x:500}}))};
assert.throws(()=>characters.climbContacts(badRoute,0),/outside limb reach/);
const walkRoute=worlds.routes.woodlandWalk;
let lastWalk=null;
for(let sample=0;sample<=1000;sample++){
 const rig=characters.walkContacts(walkRoute,sample/1000);
 ['leftFoot','rightFoot'].forEach((name,i)=>{
  const limb=rig.legs[i],end={x:rig.root.x+limb[2].x*walkRoute.scale,y:rig.root.y+limb[2].y*walkRoute.scale};
  assert.ok(Math.hypot(end.x-rig.targets[name].x,end.y-rig.targets[name].y)<1e-8);
  assert.ok(end.y<=walkRoute.groundY+1e-8,'Swing foot passes through ground');
  for(let bone=0;bone<2;bone++)assert.ok(Math.abs(Math.hypot(limb[bone+1].x-limb[bone].x,limb[bone+1].y-limb[bone].y)-12)<1e-8);
  if(rig.holds[name]){assert.equal(end.y,walkRoute.groundY);if(lastWalk?.holds[name]&&Math.abs(lastWalk.holds[name].x-rig.holds[name].x)<.01)assert.ok(Math.hypot(end.x-lastWalk.targets[name].x,end.y-lastWalk.targets[name].y)<1e-8);}
 });
 assert.ok(rig.contacts.leftFoot||rig.contacts.rightFoot);lastWalk=rig;
}
assert.throws(()=>characters.walkContacts(walkRoute,NaN));
for(let sample=0;sample<=100;sample++){
 const angle=Math.PI/2+Math.sin(sample/100*Math.PI*6)*.12;
 for(const [root,work,hand,action] of [[{x:299,y:303},{x:303,y:319},0,'gather'],[{x:326,y:300},{x:339,y:309},1,'cook'],[{x:299,y:300},{x:313,y:311},1,'build'],[{x:465,y:300},{x:479,y:311},1,'build']]){
  if(action!=='gather')work.x+=Math.sin(sample/100*Math.PI*6)*2;
  const rig=characters.workContacts({root,work,hand,action,scale:.72,groundY:318.72,angle}),wrist=rig.arms[hand][2],grip=characters.toolGrip(wrist,rig.toolTarget);
  assert.ok(Math.hypot(grip.tip.x-rig.toolTarget.x,grip.tip.y-rig.toolTarget.y)<1e-8);
  assert.ok(Math.hypot(grip.x-wrist.x,grip.y-wrist.y)<1e-8);
 }
}
assert.equal(Object.keys(worlds.recipes).length,6);
assert.deepEqual(Object.entries(worlds.recipes).filter(([,v])=>v.status==='implemented').map(([id])=>id),['woodland']);
assert.deepEqual(worlds.recipes.ants.characters,[]);
assert.equal(new Set(Object.values(worlds.numerals)).size,10);
for(const action of Object.values(worlds.actions))assert.ok(characters.roles[action.role].available.includes(action.tool));
for(const story of worlds.stories)assert.ok(story.cast.every(id=>Object.hasOwn(characters.identities,id)));
const seen=new Set();
for(let hour=0;hour<24;hour++)for(let minute=0;minute<60;minute++){
 const date=new Date(2026,9,5,hour,minute,59,999),model=worlds.woodland(date,{format24:true});
 assert.equal(model.time,`${String(hour).padStart(2,'0')}:${String(minute).padStart(2,'0')}`);
 assert.equal(model.digits.length,4);assert.ok([...model.digits].every(d=>Object.hasOwn(worlds.numerals,d)));
 assert.ok(model.caption&&model.philosophy&&model.action.label);seen.add(model.actionId);
 const next=worlds.woodland(new Date(+date+1),{format24:true});assert.notEqual(next.minuteKey,model.minuteKey);
 if(minute<59)assert.equal(next.terrainKey,model.terrainKey);else assert.notEqual(next.terrainKey,model.terrainKey);
}
assert.equal(seen.size,12);
assert.equal(worlds.woodland(new Date(2026,0,1,0,0)).time,'12:00');
assert.equal(worlds.woodland(new Date(2026,0,1,12,0)).period,'PM');
assert.equal(worlds.woodland(new Date(2028,1,29,23,59)).time,'11:59');
const stories=new Set(Array.from({length:6},(_,i)=>worlds.woodland(new Date(2026,9,4+i,10)).story.id));assert.equal(stories.size,6);
const reflections=new Set(Array.from({length:60},(_,i)=>worlds.woodland(new Date(2026,9,4,18,i)).actionId));assert.equal(reflections.size,4);
for(const second of [0,1,4.2,5.8,10.8,12,45]){
 const date=new Date(2026,9,5,10,5,0);date.setMilliseconds(second*1000);
 const m=worlds.woodland(date),p=worlds.performance(m,{duration:12,interval:60});
 assert.ok(p.climb>=0&&p.climb<=1);
 if(second===0)assert.equal(p.climb,0);
 if(second>=4.2&&second<=5.8){assert.equal(p.phase,'recover');assert.equal(p.pose,'recover-climb');assert.equal(p.climb,.4);assert.equal(p.assisted,false);}
 if(second===10.8)assert.equal(p.assisted,true);
 if(second>=12){assert.equal(p.running,false);assert.equal(p.climb,1);}
}
const model=worlds.woodland(new Date(2026,9,5,10,0,1));assert.equal(worlds.performance(model,{reducedMotion:true}).running,false);assert.equal(worlds.performance(model,{reducedMotion:true}).phase,'observe');
const night=worlds.woodland(new Date(2026,9,5,2,5,1));assert.equal(worlds.performance(night).pose,'sleep');assert.equal(worlds.performance(night).running,false);
assert.throws(()=>worlds.woodland(new Date(NaN)));
// Wall-time choreography joins minute/visit endpoints and holds recovery still.
const sample=(stamp,options={})=>{
 const m=worlds.woodland(new Date(stamp)),previous=worlds.woodland(new Date(+new Date(stamp)-m.second*1000-1));
 return worlds.blocking(m,previous,worlds.performance(m,options),options);
};
for(let minute=1;minute<12;minute++){
 const boundary=+new Date(2026,9,5,10,minute,0);
 const before=sample(boundary-1),after=sample(boundary+1);
 assert.ok(Math.hypot(before.position.x-after.position.x,before.position.y-after.position.y)<.01,`minute ${minute} teleports`);
 for(const offset of [3000,12000]){
  const a=sample(boundary+offset-1),b=sample(boundary+offset+1);
  assert.ok(Math.hypot(a.position.x-b.position.x,a.position.y-b.position.y)<.1,`minute ${minute} visit edge jumps`);
 }
}
const recovery=+new Date(2026,9,5,10,5,4,300);
assert.deepEqual(sample(recovery).position,sample(recovery+1000).position);
assert.equal(sample(recovery-4300,{reducedMotion:true}).moving,false);
assert.equal(sample(recovery-4300,{reducedMotion:true}).settling,false);
const repeat=+new Date(2026,9,5,10,5,30);
assert.ok(Math.hypot(sample(repeat-1,{interval:30}).position.y-sample(repeat+1,{interval:30}).position.y)<.01);
// Include non-aligned intervals, repeat visits, actual limb endpoints and phase blends.
for(const duration of [4,12,20])for(const interval of [30,45,60,90,300])for(let minute=0;minute<12;minute++){
 const start=+new Date(2026,9,5,10,minute),travel=Math.min(3,duration*.25),events=[0,travel,travel+.35];
 const first=(interval-(36000+minute*60)%interval)%interval;
 for(let visit=first;visit<60;visit+=interval)events.push(visit,visit+travel,visit+travel+.35,...[.34,.5,.94,1].map(p=>visit+duration*p));
 for(const second of events){
  const at=start+second*1000,a=sample(at-1,{duration,interval}),b=sample(at+1,{duration,interval});
  const label=JSON.stringify({duration,interval,minute,second});
  assert.ok(Math.hypot(a.position.x-b.position.x,a.position.y-b.position.y)<.3,`root discontinuity ${label}`);
  const pa=characters.pose(a.action,a.cycle,a),pb=characters.pose(b.action,b.cycle,b);
  for(const kind of ['arms','legs'])for(let i=0;i<2;i++)for(let j=0;j<3;j++)assert.ok(Math.hypot(pa[kind][i][j].x-pb[kind][i][j].x,pa[kind][i][j].y-pb[kind][i][j].y)<.3,`limb discontinuity ${label}`);
 }
}
console.log('PASS living worlds: all 1,440 minutes, atomic calendar boundaries, six daily casts, reflection beats, gear contracts, recovery/deadline and quiet states.');
