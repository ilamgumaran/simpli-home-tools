const assert=require('node:assert/strict');
require('../characters.js');
require('../world-layers.js');
require('../habitat-community.js');
const people=globalThis.DeskCharacters,habitat=globalThis.DeskHabitatCommunity;
const worlds=globalThis.DeskWorlds;
assert.deepEqual(habitat.family,{adults:['aster','sage'],child:'sprout',infant:'pebble',remembered:'fern'});
assert.ok(Object.isFrozen(habitat.family)&&Object.isFrozen(habitat.schedule));
const at=(hour,minute=0,opts={})=>habitat.sample(new Date(2026,3,3,hour,minute),opts);
const limbLength=(limb,index)=>Math.hypot(limb[index+1].x-limb[index].x,limb[index+1].y-limb[index].y);
assert.equal(at(7).routine,'shelter');assert.equal(at(9).routine,'forage');assert.equal(at(12).routine,'cook');
assert.equal(at(14).routine,'teach');assert.equal(at(16).routine,'care');assert.equal(at(18).routine,'remember');assert.equal(at(21).routine,'care');assert.equal(at(23).routine,'rest');assert.equal(at(3).routine,'rest');
assert.equal(at(3).night,true);assert.equal(at(14).night,false);assert.equal(at(14,0,{night:true}).night,true);
assert.deepEqual(worlds.daylightHours,{dawn:7,dusk:19});assert.deepEqual(at(7,0,{daylightHours:worlds.daylightHours}).daylightHours,worlds.daylightHours);
assert.equal(at(6,0,{daylightHours:{dawn:6,dusk:20}}).childTransition.blend,0);
assert.equal(at(6,0,{daylightHours:{dawn:6,dusk:20}}).childTransition.toAction,'play-sand');
const sunrise=habitat.sample(new Date(2026,3,3,7,15,0,350),{daylightHours:{dawn:7.25,dusk:19.5}});
assert.equal(sunrise.night,false);assert.equal(sunrise.childTransition.fromAction,'sleep');assert.ok(Math.abs(sunrise.childTransition.blend-.5)<1e-8);
assert.equal(habitat.sample(new Date(2026,3,3,7,14,59,999),{daylightHours:{dawn:7.25,dusk:19.5}}).characters.sprout.action,'sleep');
assert.equal(habitat.sample(new Date(2026,3,3,19,29,59,999),{daylightHours:{dawn:7.25,dusk:19.5}}).characters.sprout.action,'play-sand');
assert.equal(habitat.sample(new Date(2026,3,3,19,30),{daylightHours:{dawn:7.25,dusk:19.5}}).characters.sprout.action,'sleep');
for(const daylightHours of [null,{dawn:NaN,dusk:20},{dawn:20,dusk:6},{dawn:-1,dusk:25}])assert.equal(at(7,0,{daylightHours}).characters.sprout.action,'play-sand');
const sunriseMid=habitat.sample(new Date(2026,3,3,7,15,0,350),{daylightHours:{dawn:7.25,dusk:19.5},night:true});
assert.deepEqual(sunriseMid.childTransition,{fromAction:'sleep',toAction:'sleep',blend:1});
const duskOverride=habitat.sample(new Date(2026,3,3,19,30,0,350),{daylightHours:{dawn:7.25,dusk:19.5},night:false});
assert.deepEqual(duskOverride.childTransition,{fromAction:'play-sand',toAction:'play-sand',blend:1});
assert.equal(at(19,30,{daylightHours:{dawn:7.25,dusk:19.5},night:true}).childTransition.fromAction,'play-sand');
assert.equal(at(19,30,{daylightHours:{dawn:7.25,dusk:19.5},night:true}).childTransition.blend,0);
const memorial=at(18);assert.equal(memorial.memorial.for,'fern');assert.equal(memorial.characters.fern,undefined);assert.equal(memorial.family.adults.includes('fern'),false);
assert.equal(at(21).characters.pebble.support,'aster');assert.equal(at(21).characters.pebble.action,'sleep');assert.equal(at(3).characters.pebble.action,'sleep');
assert.equal(at(21).characters.aster.action,'cradle-care');assert.equal(at(21).characters.sprout.supervisedBy,'sage');assert.equal(at(21).characters.sprout.action,'sleep');
assert.equal(at(21).family.infant,'pebble');assert.deepEqual(at(21),at(21));
const playing=habitat.actorPose(at(12),'sprout'),sleeping=habitat.actorPose(at(22),'sprout'),frozenChild=habitat.actorPose(at(12),'sprout',{frozen:true});
assert.equal(playing.action,'play-sand');assert.equal(playing.from,'play-sand');assert.equal(playing.blend,1);
assert.equal(playing.rig.prop.kind,'sand-stick');assert.deepEqual(playing.rig.arms[playing.rig.prop.hand][2],playing.rig.prop.grip);
assert.equal(sleeping.action,'sleep');assert.equal(sleeping.rootY+Math.max(...sleeping.rig.legs.map(leg=>leg[2].y))*sleeping.actorScale,30);
assert.equal(frozenChild.action,'sleep');assert.equal(frozenChild.blend,1);
for(const limb of playing.rig.arms)for(let i=0;i<2;i++)assert.ok(Math.abs(limbLength(limb,i)-[people.anatomy.upperArm,people.anatomy.forearm][i])<1e-8);
for(const limb of playing.rig.legs)for(let i=0;i<2;i++)assert.ok(Math.abs(limbLength(limb,i)-[people.anatomy.thigh,people.anatomy.shin][i])<1e-8);
const midnightA=habitat.sample(new Date(2026,3,3,23,59,59,999)),midnightB=habitat.sample(new Date(2026,3,4,0,0,0,0));
assert.ok(midnightB.organicPhase>midnightA.organicPhase);assert.ok(midnightB.organicPhase-midnightA.organicPhase<.001);
assert.equal(at(6).transition.fromAction,'sleep');assert.equal(at(6).transition.blend,0);
assert.equal(habitat.sample(new Date(2026,3,3,6,0,1)).transition.blend,1);
const boundaries=[[6,'rest','shelter'],[8,'shelter','forage'],[11,'forage','cook'],[13,'cook','teach'],[16,'teach','care'],[17,'care','remember'],[20,'remember','care'],[22,'care','rest']];
for(const [hour,from,to] of boundaries){
 const before=new Date(2026,3,3,hour,0,0);before.setMilliseconds(-1);
 const after=new Date(2026,3,3,hour,0,0,1);
 const prior=habitat.sample(before),next=habitat.sample(after);
 assert.equal(next.transition.fromRoutine,from,`${hour}:00 transition source`);
 assert.equal(next.routine,to,`${hour}:00 transition destination`);
 const a=habitat.actorPose(prior,'sage'),b=habitat.actorPose(next,'sage');
 const cssJump=Math.hypot(a.wrist.x-b.wrist.x,a.wrist.y-b.wrist.y)*54/66;
 assert.ok(cssJump<=.05,`${hour}:00 Sage wrist jumps ${cssJump} CSS pixels`);
 for(const state of [a,b]){
  assert.ok(state.rig.contacts.leftFoot&&state.rig.contacts.rightFoot,`${hour}:00 Sage loses foot support`);
  assert.ok(Math.abs(state.rootY+Math.max(...state.rig.legs.map(leg=>leg[2].y))*state.actorScale-30)<1e-8,`${hour}:00 Sage feet leave the camp plane`);
  for(const limb of state.rig.arms){assert.ok(Math.abs(limbLength(limb,0)-DeskCharacters.anatomy.upperArm)<1e-8);assert.ok(Math.abs(limbLength(limb,1)-DeskCharacters.anatomy.forearm)<1e-8);}
  for(const limb of state.rig.legs){assert.ok(Math.abs(limbLength(limb,0)-DeskCharacters.anatomy.thigh)<1e-8);assert.ok(Math.abs(limbLength(limb,1)-DeskCharacters.anatomy.shin)<1e-8);}
 }
 const settled=new Date(2026,3,3,hour,0,1);
 const steady=habitat.actorPose(habitat.sample(settled),'sage');
 assert.equal(steady.blend,1,`${hour}:00 routine did not settle`);
 assert.ok(Math.abs(limbLength(steady.rig.arms[1],0)-DeskCharacters.anatomy.upperArm)<1e-8);
 assert.ok(Math.abs(limbLength(steady.rig.arms[1],1)-DeskCharacters.anatomy.forearm)<1e-8);
}
const fadeStart=habitat.actorPose(habitat.sample(new Date(2026,3,3,11,0,0,1)),'sage');
assert.ok(fadeStart.toolWeights.greens>.99&&fadeStart.toolWeights.spoon<.001,'Gathering tool does not fade smoothly into the spoon');
const fadeMiddle=habitat.actorPose(habitat.sample(new Date(2026,3,3,11,0,0,350)),'sage');
assert.ok(Math.abs(fadeMiddle.toolWeights.greens-.5)<.01&&Math.abs(fadeMiddle.toolWeights.spoon-.5)<.01,'Routine tools do not crossfade together');
assert.deepEqual(at(9,0,{weatherKind:'rain'}).weatherKind,'rain');assert.deepEqual(at(9,0,{weatherKind:'sunny'}).weatherKind,'clear');
assert.deepEqual(habitat.sample(new Date(2026,3,3,8,30)).claims,{biologicalAging:false,deathOrRebirth:false,persistentEcosystem:false});
for(let i=0;i<=100;i++){
 const p=people.pose('cradle-care',i/100);
 assert.ok(p.contacts.leftFoot&&p.contacts.rightFoot);
 const left=p.arms[0][2],right=p.arms[1][2],supports=people.infantSupportPoints;
 assert.ok(Math.abs((left.x-supports.head.x)-(right.x-supports.body.x))<1e-8);
 assert.ok(Math.abs((left.y-supports.head.y)-(right.y-supports.body.y))<1e-8);
 for(let n=0;n<2;n++){
  assert.ok(Math.abs(Math.hypot(p.arms[n][1].x-p.arms[n][0].x,p.arms[n][1].y-p.arms[n][0].y)-people.anatomy.upperArm)<1e-8);
  assert.ok(Math.abs(Math.hypot(p.arms[n][2].x-p.arms[n][1].x,p.arms[n][2].y-p.arms[n][1].y)-people.anatomy.forearm)<1e-8);
 }
}
assert.equal(people.create('aster',{role:'caregiver'}).role,'caregiver');assert.equal(people.create('pebble',{role:'infant'}).role,'infant');
assert.throws(()=>people.create('pebble'));assert.throws(()=>people.create('aster',{role:'infant'}));
assert.equal(people.identities.pebble.infant,true);assert.equal(people.identities.aster.infant,undefined);
assert.match(people.infantArtwork(),/data-infant-art="pebble"/);
console.log('PASS community habitat: daily authored routine, fixed family and infant, ancestor remembrance, weather/night sampling, supported cradle pose.');
