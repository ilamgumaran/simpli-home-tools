// SPDX-License-Identifier: LicenseRef-Simpli-Noncommercial-1.0
// Independent A1 fixtures: expected coordinates are authored here, not derived
// from the geometry implementation or its reference-target helper.
const assert=require('node:assert/strict');
const anatomy=require('../character-anatomy.js');
require('../characters.js');

const near=(actual,expected,label,tolerance=1e-8)=>assert.ok(Math.abs(actual-expected)<tolerance,`${label}: expected ${expected}, got ${actual}`);
const point=(actual,x,y,label)=>{assert.ok(actual&&typeof actual==='object',`${label} exists`);near(actual.x,x,`${label}.x`);near(actual.y,y,`${label}.y`);};
const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
const profiles=anatomy.profiles;

assert.equal(globalThis.DeskAnatomy,anatomy,'browser and CommonJS expose the same API');
assert.deepEqual(Object.keys(profiles).sort(),['adult-drop-v1','adult-human-v1','learner-v1','legacy-v1','swaddled-v1']);
const expected={
 'legacy-v1':{shoulder:6,shoulderY:-10,hip:4,hipY:8,segments:[12,11,12,12],hand:[3.4,2.8,2],foot:[2,3.5,6.5,3.2],head:[7,-24]},
 'adult-human-v1':{shoulder:6,shoulderY:-10,hip:4,hipY:8,segments:[12,11,12,12],hand:[3.4,2.8,2],foot:[2,3.5,6.5,3.2],head:[7,-24]},
 'adult-drop-v1':{shoulder:6,shoulderY:-10,hip:4,hipY:8,segments:[12,11,12,12],hand:[3,2.6,1.8],foot:[2,3,6,3],head:[7,-24]},
 'learner-v1':{shoulder:5,shoulderY:-9,hip:3,hipY:7,segments:[10,9,10,9.5],hand:[2.5,2.4,1.6],foot:[1.6,2.7,4.8,2.6],head:[7.5,-22]}
};
for(const [id,e] of Object.entries(expected)){
 const p=profiles[id];assert.equal(p.id,id);assert.equal(p.version,1);assert.equal(p.kind,'articulated');assert.ok(p.applicable);
 point(p.roots.shoulders[0],-e.shoulder,e.shoulderY,`${id} left shoulder`);
 point(p.roots.shoulders[1],e.shoulder,e.shoulderY,`${id} right shoulder`);
 point(p.roots.hips[0],-e.hip,e.hipY,`${id} left hip`);
 point(p.roots.hips[1],e.hip,e.hipY,`${id} right hip`);
 for(const [i,key] of ['upperArm','forearm','thigh','shin'].entries())near(p.segments[key],e.segments[i],`${id}.${key}`);
 for(const [i,key] of ['length','width','fingers'].entries())near(p.hand[key],e.hand[i],`${id}.hand.${key}`);
 for(const [i,key] of ['heel','ball','toe','sole'].entries())near(p.foot[key],e.foot[i],`${id}.foot.${key}`);
 near(p.head.radius,e.head[0],`${id} head radius`);near(p.head.centerY,e.head[1],`${id} head center`);
 assert.ok(p.limitsByView.front&&p.limitsByView.turned&&p.limitsByView.side,`${id} has each projection envelope`);
 for(const [view,shoulder,hip] of [['front',175,[15,165]],['turned',170,[20,160]],['side',165,[25,155]]]){
  const limits=p.limitsByView[view];
  assert.deepEqual(limits.elbow,[5,145],`${id} ${view} elbow degrees`);
  assert.deepEqual(limits.knee,[5,155],`${id} ${view} knee degrees`);
  assert.deepEqual(limits.wrist,[-65,65],`${id} ${view} wrist degrees`);
  assert.deepEqual(limits.ankle,[-35,45],`${id} ${view} ankle degrees`);
  assert.deepEqual(limits.shoulder,[-shoulder,shoulder],`${id} ${view} shoulder degrees`);
  assert.deepEqual(limits.hip,hip,`${id} ${view} hip degrees`);
  assert.deepEqual(limits.preferredBend,{left:1,right:-1},`${id} ${view} preferred bend`);
 }
}
const infant=profiles['swaddled-v1'];
assert.equal(infant.kind,'infant');assert.equal(infant.applicable.articulated,false);
assert.equal(infant.segments?.upperArm,undefined);assert.equal(infant.segments?.shin,undefined);
point(infant.infantSupport.head,-6,-6,'infant head support');
point(infant.infantSupport.body,4,0,'infant body support');

for(const [id,profile] of Object.entries({pebble:'swaddled-v1',sprout:'learner-v1',moss:'adult-drop-v1',candy:'adult-drop-v1',ridge:'adult-human-v1',aster:'adult-human-v1',sage:'adult-human-v1'})){
 const role=id==='pebble'?'infant':'play';
 assert.equal(anatomy.profileFor(globalThis.DeskCharacters.create(id,{role})).id,profile,`${id} profile`);
}
assert.throws(()=>anatomy.profileFor({body:'winged'}),/unknown|unsupported|invalid/i);
assert.throws(()=>anatomy.profileFor({id:'unknown',body:'winged'}),/unknown|unsupported|invalid/i);
assert.equal(anatomy.profileFor('learner-v1'),profiles['learner-v1'],'profile ID lookup');
assert.throws(()=>anatomy.profileFor('no-such-profile'),/unknown|unsupported|invalid|identify/i);
for(const inherited of ['constructor','toString']){
 assert.throws(()=>anatomy.profileFor(inherited),/unknown|unsupported|invalid|identify/i);
 assert.throws(()=>anatomy.handFrame(inherited,{x:0,y:0},0),/unknown|unsupported|invalid/i);
 assert.throws(()=>anatomy.referencePose(inherited),/unknown|unsupported|invalid/i);
 assert.throws(()=>anatomy.referencePose('adult-human-v1',inherited),/pose|unknown|unsupported|invalid/i);
}
assert.throws(()=>anatomy.handFrame('missing',{x:0,y:0},0),/unknown|unsupported|invalid/i);

const hand=anatomy.handFrame('adult-human-v1',{x:10,y:20},0,{side:'left'});
point(hand.wrist,10,20,'wrist');point(hand.palm,11.87,20,'palm');
point(hand.knuckles,13.4,20,'knuckles');point(hand.fingertips,15.4,20,'fingertips');
point(hand.thumb,11.36,18.18,'left thumb');point(hand.grasp,11.87,20,'grasp');point(hand.support,11.87,20,'support');
near(hand.angle,0,'hand angle');
point(anatomy.handFrame('adult-human-v1',{x:10,y:20},0,{side:'right'}).thumb,11.36,21.82,'right thumb');
const quarter=anatomy.handFrame('adult-human-v1',{x:10,y:20},Math.PI/2,{side:'left'});
point(quarter.knuckles,10,23.4,'clockwise knuckles');point(quarter.thumb,11.82,21.36,'clockwise thumb');
const foot=anatomy.footFrame('adult-human-v1',{x:4,y:5},0);
point(foot.ankle,4,5,'ankle');point(foot.heel,2,8.2,'heel');point(foot.ball,7.5,8.2,'ball');
point(foot.toe,10.5,8.2,'toe');point(foot.sole,4,8.2,'sole');point(foot.support,4.75,8.2,'foot support');
const turnedFoot=anatomy.footFrame('adult-human-v1',{x:4,y:5},Math.PI/2);
point(turnedFoot.heel,.8,3,'rotated heel');point(turnedFoot.toe,.8,11.5,'rotated toe');
assert.throws(()=>anatomy.handFrame('swaddled-v1',{x:0,y:0},0),/infant|articulat|unsupported/i);
assert.throws(()=>anatomy.footFrame('swaddled-v1',{x:0,y:0},0),/infant|articulat|unsupported/i);

// Scale, then clockwise rotation, then translation. Reflection is explicit.
point(anatomy.transformPoint({x:2,y:3},{x:5,y:-7,scaleX:-2,scaleY:3,rotation:Math.PI/2}),-4,-11,'nonuniform mirrored rotation');
point(anatomy.transformPoint({x:2,y:3},{}),2,3,'identity defaults');
assert.throws(()=>anatomy.transformPoint({x:1e308,y:0},{scaleX:2}),/finite|overflow|range|invalid/i,
 'finite transform inputs whose result overflows must be rejected');
for(const bad of [{scaleX:0},{scaleY:Infinity},{rotation:NaN},{x:Infinity}])
 assert.throws(()=>anatomy.transformPoint({x:1,y:1},bad),/finite|scale|invalid|nonzero/i);
assert.throws(()=>anatomy.transformPoint({x:NaN,y:1},{}),/finite|invalid/i);
assert.throws(()=>anatomy.handFrame('adult-human-v1',{x:0,y:0},Infinity),/finite|invalid/i);
assert.throws(()=>anatomy.footFrame('adult-human-v1',{x:0,y:0},NaN),/finite|invalid/i);

const bounds={flexion:[0,Math.PI],rootAngle:[-Math.PI,Math.PI]};
for(const [bend,mx,my] of [[1,0,1],[-1,1,0]]){
 const result=anatomy.solveLimb({root:{x:0,y:0},target:{x:1,y:1},upper:1,lower:1,bend,...bounds});
 point(result.points[0],0,0,'solve root');point(result.points[1],mx,my,`bend ${bend} middle`);
 point(result.points[2],1,1,`bend ${bend} end`);
 near(result.flexion,Math.PI/2,`bend ${bend} flexion`);
 assert.equal(result.reached,true);assert.equal(result.clamped,false);
 near(distance(result.points[0],result.points[1]),1,'upper fixed length');
 near(distance(result.points[1],result.points[2]),1,'lower fixed length');
}
for(const target of [{x:5,y:0},{x:0,y:0}]){
 const solved=anatomy.solveLimb({root:{x:0,y:0},target,upper:2,lower:1,bend:1,...bounds});
 assert.equal(solved.reached,false,'unreachable target must be reported');
 assert.equal(solved.clamped,true,'reach envelope is clamped');
 assert.ok(solved.reason,'diagnostic reason exists');
 near(distance(solved.points[0],solved.points[1]),2,'clamped upper length');
 near(distance(solved.points[1],solved.points[2]),1,'clamped lower length');
}
const singular=anatomy.solveLimb({root:{x:0,y:0},target:{x:0,y:0},upper:1,lower:1,bend:1,...bounds});
for(const p of singular.points)assert.ok(Number.isFinite(p.x)&&Number.isFinite(p.y),'singular points are finite');
near(distance(singular.points[0],singular.points[1]),1,'singular upper length');
near(distance(singular.points[1],singular.points[2]),1,'singular lower length');
assert.equal(singular.reached,true,'equal bones can fold onto root');
const rootLimited=anatomy.solveLimb({root:{x:0,y:0},target:{x:0,y:2},upper:1,lower:1,bend:1,flexion:[0,Math.PI],rootAngle:[0,0]});
assert.equal(rootLimited.reached,false,'root angle limit can make a reachable target infeasible');
assert.equal(rootLimited.clamped,true);assert.ok(rootLimited.reason);
near(distance(rootLimited.points[0],rootLimited.points[1]),1,'root-limited upper length');
near(distance(rootLimited.points[1],rootLimited.points[2]),1,'root-limited lower length');
for(const bend of [1,-1])for(const reach of [1.999-1e-8,1.999+1e-8]){
 const nearStraight=anatomy.solveLimb({root:{x:0,y:0},target:{x:reach,y:0},upper:1,lower:1,bend,...bounds});
 assert.equal(Math.sign(nearStraight.points[1].y),bend,'near-straight branch remains stable');
 assert.equal(nearStraight.reached,true);
}
const tight=anatomy.solveLimb({root:{x:0,y:0},target:{x:2,y:0},upper:1,lower:1,bend:1,flexion:[Math.PI/3,2*Math.PI/3],rootAngle:[-Math.PI,Math.PI]});
assert.equal(tight.reached,false,'target outside flexion envelope');assert.equal(tight.clamped,true);
near(tight.flexion,Math.PI/3,'minimum flexion clamp');
for(const patch of [{upper:0},{lower:-1},{bend:0},{bend:2},{target:{x:NaN,y:0}},{flexion:[2,1]},{flexion:[-.1,1]},{rootAngle:[2,1]},{rootAngle:[-4,4]}])
 assert.throws(()=>anatomy.solveLimb({root:{x:0,y:0},target:{x:1,y:1},upper:1,lower:1,bend:1,...bounds,...patch}),/invalid|finite|positive|bend|bound|length|range/i);
assert.throws(()=>anatomy.solveLimb({root:{x:0,y:0},target:{x:1e308,y:0},upper:1e308,lower:1e308,bend:1,...bounds}),
 /overflow|finite|range|invalid/i,'finite inputs whose derived math overflows must be rejected');
const immutableInput=Object.freeze({root:Object.freeze({x:3,y:4}),target:Object.freeze({x:4,y:5}),upper:1,lower:1,bend:-1,flexion:Object.freeze([0,Math.PI]),rootAngle:Object.freeze([-Math.PI,Math.PI])});
const copied=anatomy.solveLimb(immutableInput);
point(immutableInput.root,3,4,'frozen root');point(immutableInput.target,4,5,'frozen target');
assert.notEqual(copied.points[0],immutableInput.root,'solver returns independent points');

for(const id of Object.keys(expected))for(const view of ['front','turned','side'])for(const poseName of ['neutral','reach','grip','walk','crouch','kneel','care']){
 const pose=anatomy.referencePose(id,poseName,{view});
 assert.equal(pose.profileId,id);assert.equal(pose.view,view);
 assert.equal(pose.arms.length,2);assert.equal(pose.legs.length,2);
 assert.equal(pose.handFrames.length,2);assert.equal(pose.footFrames.length,2);
 assert.ok(pose.diagnostics,'reference diagnostics present');
 for(const [kind,lengths] of [['arms',[profiles[id].segments.upperArm,profiles[id].segments.forearm]],['legs',[profiles[id].segments.thigh,profiles[id].segments.shin]]])
  for(const limb of pose[kind]){
   assert.equal(limb.length,3,`${poseName} ${kind} has legacy three-point shape`);
   for(const p of limb)assert.ok(Number.isFinite(p.x)&&Number.isFinite(p.y));
   near(distance(limb[0],limb[1]),lengths[0],`${id} ${poseName} ${kind} proximal bone`,1e-7);
   near(distance(limb[1],limb[2]),lengths[1],`${id} ${poseName} ${kind} distal bone`,1e-7);
  }
 for(let i=0;i<2;i++){
  point(pose.handFrames[i].wrist,pose.arms[i][2].x,pose.arms[i][2].y,'hand attaches to wrist');
  point(pose.footFrames[i].ankle,pose.legs[i][2].x,pose.legs[i][2].y,'foot attaches to ankle');
 }
 assert.deepEqual(anatomy.referencePose(id,poseName,{view}),pose,'reference poses deterministic');
}
assert.deepEqual(anatomy.referencePose('learner-v1','neutral').diagnostics,[],
 'learner neutral targets fit learner proportions');
const neutral=anatomy.referencePose('adult-human-v1','neutral');
const reaching=anatomy.referencePose('adult-human-v1','reach');
for(let side=0;side<2;side++){
 assert.ok(reaching.arms[side][2].y<profiles['adult-human-v1'].roots.shoulders[side].y-10,'reach raises wrist above shoulder');
 assert.ok(anatomy.referencePose('adult-human-v1','crouch').legs[side][2].y<neutral.legs[side][2].y-5,'crouch raises ankle');
 assert.ok(anatomy.referencePose('adult-human-v1','kneel').legs[side][2].y<neutral.legs[side][2].y-5,'kneel raises ankle');
}
const care=anatomy.referencePose('adult-human-v1','care');
for(const [i,expectedPoint] of [{x:-9,y:-7},{x:8,y:-4}].entries()){
 assert.ok(distance(care.arms[i][2],expectedPoint)<3,'care wrist approaches authored support');
 if(distance(care.arms[i][2],expectedPoint)>1e-7)
  assert.ok(care.diagnostics.some(d=>d.limb==='arm'&&d.side===['left','right'][i]&&!d.reached),
   'care clamp reported when support target is infeasible');
}
const baby=anatomy.referencePose('swaddled-v1','care');
assert.equal(baby.profileId,'swaddled-v1');assert.equal(baby.arms.length,0);assert.equal(baby.legs.length,0);
assert.ok(baby.supportFrame,'infant exposes support frame');
assert.throws(()=>anatomy.referencePose('adult-human-v1','fly'),/pose|unknown|unsupported|invalid/i);
assert.throws(()=>anatomy.referencePose('adult-human-v1','neutral',{view:'back'}),/view|unknown|unsupported|invalid/i);

function assertDeepFrozen(value,path='export'){
 if(!value||typeof value!=='object')return;
 assert.ok(Object.isFrozen(value),`${path} is frozen`);
 for(const [key,child] of Object.entries(value))assertDeepFrozen(child,`${path}.${key}`);
}
assertDeepFrozen(profiles);
const legacy=require('./fixtures/anatomy-legacy-poses.json');
assert.equal(legacy.schema,1);
assert.ok(legacy.samples.length>20,'legacy fixture spans actions and cycles');
for(const {action,cycle,pose} of legacy.samples)
 assert.deepEqual(globalThis.DeskCharacters.pose(action,cycle),pose,`legacy ${action} cycle ${cycle} is preserved exactly`);
console.log('PASS anatomy: cast profiles, authored landmarks, transforms, constrained two-bone solves, references and frozen records.');
