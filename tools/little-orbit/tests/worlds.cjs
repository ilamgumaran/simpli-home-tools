const assert=require('node:assert/strict');
require('../characters.js');require('../world-layers.js');
const worlds=globalThis.DeskWorlds,characters=globalThis.DeskCharacters;
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
