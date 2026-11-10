const assert=require('node:assert/strict');
require('../characters.js');
const lib=globalThis.DeskCharacters;
const actions=['pave','rake-sand','carry-wood','kindle-fire','fill-water','wade','play-water','play-sand','stir-pot','tent-peg'];
const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
const expectedProps={'pave':'stone','rake-sand':'rake','carry-wood':'log','kindle-fire':'firesteel','fill-water':'filter-bottle','play-water':'splash','play-sand':'sand-stick','stir-pot':'spoon','tent-peg':'mallet'};
for(const action of actions){
 for(let i=0;i<=1000;i++){
  const p=lib.pose(action,i/1000);
  assert.ok(p.stance&&Number.isFinite(p.groundY),`${action} defines its support plane`);
  for(const [kind,lengths,roots] of [['arms',[12,11],lib.anatomy.shoulders],['legs',[12,12],lib.anatomy.hips]]){
   p[kind].forEach((limb,j)=>{
    assert.deepEqual(limb[0],roots[j]);
    for(let k=0;k<2;k++)assert.ok(Math.abs(distance(limb[k],limb[k+1])-lengths[k])<1e-8,`${action} ${kind} length`);
    assert.ok(limb.every(point=>Number.isFinite(point.x)&&Number.isFinite(point.y)));
   });
  }
  // Knees and feet remain above the declared floor, with a planted support.
  assert.ok(p.legs.every(limb=>limb.slice(1).every(point=>point.y<=p.groundY+1e-8)),`${action} penetrates ground`);
  assert.ok(p.contacts.leftFoot||p.contacts.rightFoot,`${action} loses both supports`);
  for(const [name,index] of [['leftFoot',0],['rightFoot',1]])if(p.contacts[name])assert.ok(Math.abs(p.legs[index][2].y-p.groundY)<1e-8,`${action} supporting foot is not planted`);
  if(expectedProps[action]){
   assert.equal(p.prop.kind,expectedProps[action]);assert.ok(p.prop.hand===0||p.prop.hand===1);
   assert.deepEqual(p.prop.grip,p.arms[p.prop.hand][2]);
   assert.ok(Number.isFinite(p.prop.tip.x)&&Number.isFinite(p.prop.tip.y));
   if(p.prop.secondGrip)assert.deepEqual(p.prop.secondGrip,p.arms[1-p.prop.hand][2]);
  }else assert.equal(p.prop,undefined);
  if(action==='rake-sand'){
   const a=p.prop.grip,b=p.prop.secondGrip,t=p.prop.tip;
   assert.ok(Math.abs((b.x-a.x)*(t.y-a.y)-(b.y-a.y)*(t.x-a.x))<1e-7,'Both grips follow the rake shaft');
  }
  if(action==='carry-wood')assert.ok(Math.abs(p.prop.grip.y-p.prop.secondGrip.y)<1e-8,'Balanced log has two level grips');
 }
 // Wrapped endpoints and quarter-cycle changes remain continuous, including
 // the middle joints, and each complete cycle starts/stops gently.
 for(const boundary of [0,.25,.5,.75,1]){
  const a=lib.pose(action,boundary-1e-6),b=lib.pose(action,boundary+1e-6);
  for(const kind of ['arms','legs'])for(let i=0;i<2;i++)for(let j=0;j<3;j++)assert.ok(distance(a[kind][i][j],b[kind][i][j])<.001,`${action} jumps at ${boundary}`);
 }
 const first=lib.pose(action,0),next=lib.pose(action,1e-5);
 for(const kind of ['arms','legs'])for(let i=0;i<2;i++)for(let j=0;j<3;j++)assert.ok(distance(first[kind][i][j],next[kind][i][j])/1e-5<.02,`${action} starts with a jerk`);
 for(const blend of [0,.25,.5,.75,1]){
  const p=lib.pose(action,.4,{from:'listen',fromCycle:.2,blend});
  for(const [kind,lengths] of [['arms',[12,11]],['legs',[12,12]]])for(const limb of p[kind])for(let k=0;k<2;k++)assert.ok(Math.abs(distance(limb[k],limb[k+1])-lengths[k])<1e-8);
  assert.ok(p.legs.every(limb=>limb.slice(1).every(point=>point.y<=p.groundY+1e-8)),`${action} blend penetrates ground`);
  assert.ok(p.contacts.leftFoot||p.contacts.rightFoot,`${action} blend loses ground support`);
  if(p.prop)assert.deepEqual(p.prop.grip,p.arms[p.prop.hand][2],'Prop follows blended hand');
 }
}
console.log('PASS Woodland camp poses: ten activities, fixed bones, supported floor contacts, smooth cycles and attached props.');
