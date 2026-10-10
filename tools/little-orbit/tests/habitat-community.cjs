const assert=require('node:assert/strict');
require('../characters.js');
require('../habitat-community.js');
const people=globalThis.DeskCharacters,habitat=globalThis.DeskHabitatCommunity;
assert.deepEqual(habitat.family,{adults:['aster','sage'],child:'sprout',infant:'pebble',remembered:'fern'});
assert.ok(Object.isFrozen(habitat.family)&&Object.isFrozen(habitat.schedule));
const at=(hour,minute=0,opts={})=>habitat.sample(new Date(2026,3,3,hour,minute),opts);
assert.equal(at(7).routine,'shelter');assert.equal(at(9).routine,'forage');assert.equal(at(12).routine,'cook');
assert.equal(at(14).routine,'teach');assert.equal(at(16).routine,'care');assert.equal(at(18).routine,'remember');assert.equal(at(21).routine,'care');assert.equal(at(23).routine,'rest');assert.equal(at(3).routine,'rest');
assert.equal(at(3).night,true);assert.equal(at(14).night,false);assert.equal(at(14,0,{night:true}).night,true);
const memorial=at(18);assert.equal(memorial.memorial.for,'fern');assert.equal(memorial.characters.fern,undefined);assert.equal(memorial.family.adults.includes('fern'),false);
assert.equal(at(21).characters.pebble.support,'aster');assert.equal(at(21).characters.pebble.action,'sleep');assert.equal(at(3).characters.pebble.action,'sleep');
assert.equal(at(21).characters.aster.action,'cradle-care');assert.equal(at(21).characters.sprout.supervisedBy,'sage');assert.equal(at(21).characters.sprout.action,'sleep');
assert.equal(at(21).family.infant,'pebble');assert.deepEqual(at(21),at(21));
assert.equal(at(6).transition.fromAction,'sleep');assert.equal(at(6).transition.blend,0);
assert.equal(habitat.sample(new Date(2026,3,3,6,0,1)).transition.blend,1);
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
