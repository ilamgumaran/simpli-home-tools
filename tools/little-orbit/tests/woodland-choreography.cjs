// SPDX-License-Identifier: LicenseRef-Simpli-Noncommercial-1.0
// Copyright (C) 2026 ilamgumaran and contributors
const assert=require('node:assert/strict');
const {spawnSync}=require('node:child_process');
const path=require('node:path');
require('../characters.js');require('../world-layers.js');
const story=globalThis.DeskWoodlandStory,worlds=globalThis.DeskWorlds;
const sample=(h,m,s=0,date=6)=>story.sample(new Date(2026,9,date,h,m,0,s*1000),{format24:true});
assert.ok(Object.isFrozen(story));assert.ok(Object.isFrozen(story.activities));
assert.equal(story.activities.length,12);
for(const work of story.activities){
 assert.ok(DeskCharacters.roles[work.role].available.includes(work.tool),work.id+' kit lacks tool');
 assert.ok(Number.isFinite(work.site.x)&&Number.isFinite(work.site.y));
}
// Every placement remains on an actual canonical segment. Separate move commands
// retain their own strokes; sample density cannot introduce diagonal bridges.
const onSegment=(p,a,b)=>Math.abs((p.x-a.x)*(b.y-a.y)-(p.y-a.y)*(b.x-a.x))<1e-7&&p.x>=Math.min(a.x,b.x)-1e-8&&p.x<=Math.max(a.x,b.x)+1e-8&&p.y>=Math.min(a.y,b.y)-1e-8&&p.y<=Math.max(a.y,b.y)+1e-8;
function segments(digit){
 const tokens=worlds.numerals[digit].match(/[MLHVZ]|-?\d+/g),out=[];
 let i=0,cmd='',at={x:0,y:0},start=null,stroke=-1;
 while(i<tokens.length){
  if(/^[MLHVZ]$/.test(tokens[i]))cmd=tokens[i++];
  if(cmd==='M'){at={x:+tokens[i++],y:+tokens[i++]};start={...at};stroke++;cmd='L';}
  else{
   const end=cmd==='L'?{x:+tokens[i++],y:+tokens[i++]}:cmd==='H'?{x:+tokens[i++],y:at.y}:cmd==='V'?{x:at.x,y:+tokens[i++]}:start;
   out.push({a:at,b:end,stroke});at=end;if(cmd==='Z')cmd='';
  }
 }
 return out;
}
for(let digit=0;digit<10;digit++)for(const step of [1,8,23]){
 const placements=story.points(digit,{step}),edges=segments(digit);
 assert.ok(Object.isFrozen(placements));assert.ok(placements.every(Object.isFrozen));
 assert.ok(placements.length>2);
 let before=null;
 for(const p of placements){
  assert.ok(edges.some(s=>s.stroke===p.stroke&&onSegment(p,s.a,s.b)),`digit ${digit} off canonical path`);
  assert.ok(p.fraction>=0&&p.fraction<=1);
  if(before){assert.ok(p.fraction>=before.fraction);if(p.stroke===before.stroke)assert.ok(Math.hypot(p.x-before.x,p.y-before.y)<=step+1e-8);}
  before=p;
 }
 assert.equal(placements.at(-1).fraction,1);
}
assert.equal(new Set(story.points(1).map(p=>p.stroke)).size,2);
assert.equal(new Set(story.points(4).map(p=>p.stroke)).size,2);
assert.throws(()=>story.points('12'));
for(const step of [0,.1,-2,Infinity,NaN])assert.throws(()=>story.points(8,{step}));

const workIds=new Set(),materials=new Set();
for(let hour=0;hour<24;hour++)for(let minute=0;minute<60;minute++){
 const date=new Date(2026,9,6,hour,minute,59,999),m=story.sample(date,{format24:true});
 const expected=`${String(hour).padStart(2,'0')}:${String(minute).padStart(2,'0')}`;
 assert.equal(m.time,expected);assert.equal(m.digits,expected.replace(':',''));assert.equal(m.dateDigits,'06');
 assert.equal(m.period,'24H');assert.equal(m.chapter.terrainKey,m.terrainKey);assert.equal(m.dateMaterial,'wood');
 assert.ok(DeskCharacters.roles[m.work.role].available.includes(m.work.tool));
 assert.equal(m.craft.digitIndex,3);assert.equal(m.craft.material,m.minuteMaterial.ones);
 assert.ok(['place','rake','float'].includes(m.craft.task));
 assert.ok([m.progress,m.riverFlow,m.craft.targetFraction,m.craft.deliveryFraction].every(p=>p>=0&&p<=1));
 assert.equal(story.points(m.digits[3]).at(-1).fraction,1,'Current digit is complete even during construction');
 const next=story.sample(new Date(+date+1),{format24:true});assert.notEqual(m.minuteKey,next.minuteKey);
 if(minute<59)assert.equal(m.chapter.terrainKey,next.chapter.terrainKey);else assert.notEqual(m.chapter.terrainKey,next.chapter.terrainKey);
 workIds.add(m.work.id);materials.add(m.material);
 // No sample stores mutable chronological progression: future/backward sampling
 // returns exactly the same authored construction when the instant is revisited.
 story.sample(new Date(+date+86400000));assert.deepEqual(story.sample(date,{format24:true}),m);
}
assert.equal(workIds.size,12);assert.equal(materials.size,4);
assert.equal(sample(0,0).time,'00:00');
assert.equal(story.sample(new Date(2026,9,6,0,0)).time,'12:00');
assert.equal(story.sample(new Date(2026,9,6,12,0)).period,'PM');
for(const [from,to] of [[new Date(2026,0,31,23,59,59,999),new Date(2026,1,1)],[new Date(2028,1,28,23,59,59,999),new Date(2028,1,29)],[new Date(2028,1,29,23,59,59,999),new Date(2028,2,1)]]){
 assert.equal(+from+1,+to);const a=story.sample(from),b=story.sample(to);
 assert.notEqual(a.dateDigits,b.dateDigits);assert.equal(b.dateDigits,String(to.getDate()).padStart(2,'0'));assert.notEqual(a.day,b.day);
}
assert.throws(()=>story.sample(new Date(NaN)));

// Each active 20-second visit contains four seconds of recovery. Protected
// climbing holds progress while fatigue declines, resumes and joins pitches.
for(const bout of [0,1,2]){
 const start=bout*20;
 const a=sample(10,5,start+7.5),b=sample(10,5,start+11.49);
 assert.equal(a.phase,'recover');assert.equal(b.phase,'recover');
 assert.equal(a.work.pose,'recover-climb');assert.equal(b.work.pose,'recover-climb');
 assert.equal(a.work.effort.progress,b.work.effort.progress);
 assert.ok(b.work.effort.fatigue<a.work.effort.fatigue);assert.equal(a.work.effort.assisted,false);assert.equal(b.work.effort.assisted,false);
 assert.ok(sample(10,5,start+12).work.effort.progress>b.work.effort.progress);
 assert.equal(sample(10,5,start+15).work.effort.assisted,false);assert.equal(sample(10,5,start+16).work.effort.assisted,true);
 assert.equal(sample(10,5,start+17).work.effort.assisted,false);assert.equal(sample(10,5,start+18).work.effort.assisted,false);
}
for(const boundary of [20,40])assert.ok(Math.abs(sample(10,5,boundary-.001).work.effort.progress-sample(10,5,boundary+.001).work.effort.progress)<1e-8,'Ascent resets between pitches');
for(const minute of [0,1,2,3,4,6,7,8,9,10,11])for(const bout of [0,1,2]){
 assert.equal(sample(10,minute,bout*20+11).phase,'recover');assert.equal(sample(10,minute,bout*20+14.999).phase,'recover');assert.equal(sample(10,minute,bout*20+15).phase,'settle');
 assert.equal(sample(10,minute,bout*20+13).site.lead.resting,true);
}
for(let hour=0;hour<6;hour++)for(let minute=0;minute<60;minute++){
 const m=sample(hour,minute,8);assert.equal(m.phase,'sleep');assert.equal(m.work.pose,'sleep');assert.equal(m.site.lead.zone,'camp');assert.equal(m.site.lead.protected,false);
 assert.ok(m.site.children.every(child=>child.waterDepth==='dry'&&child.zone==='camp'));
}
const realization=new Set(Array.from({length:60},(_,i)=>sample(18,i,8).work.id));
assert.deepEqual([...realization].sort(),['cook','filter-water','rest','teach']);

// Children have an explicit adult supervisor. Bank play requires the adult
// nearby; a lone adult's cliff work keeps the learner on grounded observation.
const relations=new Set();let familyMeals=0;
for(let day=4;day<10;day++)for(let minute=0;minute<12;minute++)for(const second of [4,24,44]){
 const m=sample(10,minute,second,day);relations.add(m.social.id);
 assert.ok(m.social.cast.every(id=>Object.hasOwn(DeskCharacters.identities,id)));
 for(const child of m.site.children){
  assert.ok(m.social.cast.includes(child.supervisor));assert.equal(DeskCharacters.identities[child.supervisor].young,undefined);
  assert.equal(child.protected,false);assert.ok(child.y>=281);
  assert.ok(['dry','ankle'].includes(child.waterDepth));assert.equal(m.site.river.fast,false);
  if(child.zone==='shallow-bank'){
   const adult=[m.site.lead,...m.site.helpers].find(a=>a.id===child.supervisor);
   assert.ok(adult);assert.ok(Math.hypot(adult.x-child.x,adult.y-child.y)<110);
  }
  if(m.work.zone==='cliff'&&!m.social.helper){assert.equal(child.activity,'observe');assert.equal(child.waterDepth,'dry');}
 }
 if(m.social.id==='family'&&m.work.id==='cook'){
  assert.equal(m.social.interaction,'share-food');assert.ok(m.site.helpers.some(a=>a.supervising));assert.ok(m.site.children.every(a=>a.supervisor===m.social.helper));familyMeals++;
 }
 if(m.social.cast.length===1&&m.work.id==='cook')assert.equal(m.social.interaction,'quiet-meal');
}
assert.equal(relations.size,6);assert.ok(familyMeals>0);

// Reduced construction uses the same complete canonical paths at any phase;
// renderer quiet snapshots need no chronological accumulation or lost updates.
for(const second of [0,3,8,13,19,20,28,39,40,48,59.999]){
 const m=sample(10,0,second);assert.equal(m.digits,'1000');assert.ok(story.points(m.digits[3]).length>0);
}
const tzScript=`require(${JSON.stringify(path.join(__dirname,'../characters.js'))});require(${JSON.stringify(path.join(__dirname,'../world-layers.js'))});
const assert=require('node:assert/strict'),s=DeskWoodlandStory.sample;
const springA=s(new Date('2026-03-08T06:59:59.999Z'),{format24:true}),springB=s(new Date('2026-03-08T07:00:00Z'),{format24:true});
assert.equal(springA.time,'01:59');assert.equal(springB.time,'03:00');assert.equal(springA.day,springB.day);
const fallA=s(new Date('2026-11-01T05:30:08Z'),{format24:true}),fallB=s(new Date('2026-11-01T06:30:08Z'),{format24:true});
assert.equal(fallA.time,'01:30');assert.deepEqual(fallA,fallB);`;
const dst=spawnSync(process.execPath,['-e',tzScript],{env:{...process.env,TZ:'America/New_York'},encoding:'utf8'});
assert.equal(dst.status,0,dst.stderr);
console.log('PASS Woodland choreography: canonical material geometry, all 1,440 minutes, calendar/DST reconstruction, three recovery bouts, supervision and quiet snapshots.');
