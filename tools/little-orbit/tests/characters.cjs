const assert=require('node:assert/strict');
require('../characters.js');
const lib=globalThis.DeskCharacters;
// Identity and equipment can move between themes without a second copy.
for(const id of Object.keys(lib.identities))for(const role of Object.keys(lib.roles)){
 const character=lib.create(id,{role});
 assert.equal(character.id,id);assert.equal(character.role,role);
 assert.ok(character.inventory.every(item=>lib.roles[role].available.includes(item)));
}
for(const item of Object.values(lib.items))assert.ok(item.name&&item.category&&item.attachment);
for(const id of lib.roles.climbing.carried)assert.ok(lib.items[id]);
assert.ok(Object.values(lib.items).filter(item=>item.essential).every(item=>lib.roles.climbing.carried.includes(item.id)));
globalThis.ORBIT_CONFIG={characters:{climber:'ridge',climber2:'candy',candy:'moss'}};
assert.equal(lib.forTheme('climber').id,'ridge');assert.equal(lib.forTheme('climber2').id,'candy');assert.equal(lib.forTheme('climber2').role,'climbing');assert.equal(lib.forTheme('candy').id,'moss');assert.equal(lib.forTheme('orbit'),null);delete globalThis.ORBIT_CONFIG;
assert.throws(()=>lib.create('missing'));assert.throws(()=>lib.create('toString'));assert.throws(()=>lib.create('ridge',{role:'constructor'}));assert.throws(()=>lib.create('ridge',{role:'missing'}));
assert.throws(()=>lib.create('ridge',{appearance:{skin:'red;display:none'}}));
assert.throws(()=>lib.attachment(lib.create('ridge',{role:'play'})));
const custom=lib.create('ridge',{appearance:{skin:'#82532d',jacket:'#6588ae'}});
assert.equal(custom.appearance.skin,'#82532d');assert.notEqual(lib.identities.ridge.appearance.skin,custom.appearance.skin);
assert.ok(Object.isFrozen(lib.identities.ridge.appearance));
// Reach and bone lengths remain human-like throughout every supported pose.
for(const action of ['climb','assist','rappel','rest','camp','sleep','walk','traverse','cast','gather','build','water','cook','teach','recover-climb'])for(let i=0;i<=100;i++){
 const pose=lib.pose(action,i/100);
 for(const [limbs,lengths] of [[pose.arms,[lib.anatomy.upperArm,lib.anatomy.forearm]],[pose.legs,[lib.anatomy.thigh,lib.anatomy.shin]]]){
  for(const limb of limbs){assert.ok(limb.every(p=>Number.isFinite(p.x)&&Number.isFinite(p.y)));for(let k=0;k<2;k++)assert.ok(Math.abs(Math.hypot(limb[k+1].x-limb[k].x,limb[k+1].y-limb[k].y)-lengths[k])<1e-8);}
 }
 if(['climb','assist','rappel'].includes(action))assert.ok(Object.values(pose.contacts).filter(Boolean).length>=3);
}
// Recovery costs route time; urgency never skips it or increases fatigue while resting.
const before=lib.ascent(.33,5),rest1=lib.ascent(.35,.2),rest2=lib.ascent(.49,.01),after=lib.ascent(.51,4);
assert.ok(before.progress<=rest1.progress&&after.progress>rest2.progress);
assert.equal(rest1.progress,rest2.progress);assert.ok(rest2.fatigue<rest1.fatigue);
assert.equal(rest1.action,'rest');assert.equal(rest2.assisted,false);
assert.equal(lib.ascent(.9,10).assisted,false);assert.equal(lib.ascent(.9,.5).assisted,true);
assert.equal(lib.ascent(.2,.01).assisted,false);assert.equal(lib.ascent(1,-1).assisted,false);
let last=0;for(let i=0;i<=100;i++){const e=lib.ascent(i/100,20);assert.ok(e.progress>=last&&e.fatigue>=0&&e.fatigue<=1);last=e.progress;}
console.log('PASS shared characters: role kit integrity, reusable appearance, anatomical reach/support, recovery and deadline assistance.');
