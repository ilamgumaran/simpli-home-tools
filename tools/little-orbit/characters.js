// SPDX-License-Identifier: LicenseRef-Simpli-Noncommercial-1.0
// Copyright (C) 2026 ilamgumaran and contributors
// Shared identities, appearance, role kits and anatomical poses. No theme owns a character.
(()=>{
 'use strict';
 const freeze=value=>{if(value&&typeof value==='object'){Object.values(value).forEach(freeze);Object.freeze(value);}return value;};
 const clamp=(n,a=0,b=1)=>Math.max(a,Math.min(b,n)),lerp=(a,b,t)=>a+(b-a)*t;
 const palette={skin:'#c68d67',jacket:'#91bbaa',trousers:'#68758c',helmet:'#e6b567',pack:'#bd7f70',boots:'#394d48',harness:'#dfc784',metal:'#c3d4d2',rope:'#d6b77a',ink:'#182a29',outline:'#d1aaba',highlight:'#d5b7c5',eyes:'#182a29'};
 const identities=freeze({
  candy:{name:'Pip',body:'drop',face:'cheerful',appearance:{...palette,skin:'#ad8fad',jacket:'#89bba3',trousers:'#ab92b9',helmet:'#b7a575',pack:'#958563',harness:'#bba778',ink:'#342737',eyes:'#17141e'},temperament:'Playful, curious, happy to help.'},
  moss:{name:'Moss',body:'drop',face:'cheerful',appearance:{...palette,jacket:'#b597a9',pack:'#718f70'},temperament:'Patient trail companion; celebrates small gains.'},
  sprout:{name:'Sprout',young:true,body:'drop',face:'cheerful',appearance:{...palette,jacket:'#c9bb75',pack:'#8ca89a',helmet:'#d19d79'},temperament:'Young trail learner; notices what adults hurry past.'},
  ridge:{name:'Ridge',body:'human',face:'cheerful',appearance:{...palette},temperament:'Comic, determined climber; takes recovery seriously.'}
 });
 // A catalog is available equipment, not a claim that one person carries all of it.
 const groups={
  protection:[['helmet','Climbing helmet','head'],['harness','Waist belt and two leg loops','hips'],['locking-carabiner','Locking carabiner','belay-loop'],['belay-device','Belay / rappel device','belay-loop'],['dynamic-rope','Dynamic climbing rope','pack'],['climbing-shoes','Climbing shoes','feet'],['personal-tether','Personal anchor tether','harness'],['gloves','Belay gloves','hands']],
  climbing:[['quickdraws','Quickdraw rack','gear-loop'],['nuts','Passive nut rack','gear-loop'],['cams','Cam rack','gear-loop'],['slings','Sewn slings','pack'],['cordelette','Anchor cordelette','pack'],['chalk','Chalk bag','hips'],['brush','Hold brush','pack'],['ascender','Mechanical ascender','gear-loop'],['foot-loop','Ascender foot loop','pack'],['pulley','Hauling pulley','gear-loop'],['static-rope','Fixed / haul line','pack'],['portaledge','Suspended portaledge','haul-bag'],['haul-bag','Haul bag','separate-load']],
  alpine:[['ice-axe','Ice axe','pack'],['crampons','Crampons','pack'],['ice-screws','Ice screw rack','gear-loop'],['snow-anchor','Snow anchor','pack'],['beacon','Avalanche transceiver','torso'],['probe','Avalanche probe','pack'],['shovel','Snow shovel','pack']],
  trail:[['trail-shoes','Trail shoes','feet'],['poles','Trekking poles','pack'],['map','Terrain map','pack'],['compass','Compass','pack'],['headlamp','Headlamp','head'],['rain-shell','Rain shell','pack'],['sun-hat','Sun hat','head'],['sun-care','Sun protection','pack'],['repair-kit','Repair kit','pack']],
  backpacking:[['backpack','Fitted backpack with shoulder and waist straps','back'],['bottle','Water bottle','pack-side'],['filter','Water filter','pack'],['sleeping-bag','Sleeping bag','pack'],['sleeping-mat','Sleeping mat','pack'],['shelter','Lightweight shelter','pack'],['first-aid','First aid kit','pack'],['emergency-blanket','Emergency blanket','pack'],['whistle','Signal whistle','chest'],['communicator','Emergency communicator','pack'],['thermal-layer','Warm layer','pack'],['dry-bag','Dry bag','pack']],
  food:[['trail-mix','Trail mix','pack'],['energy-bar','Energy bar','pack'],['dried-fruit','Dried fruit','pack'],['oats','Oats','pack'],['rice','Rice / grain','pack'],['beans','Beans / lentils','pack'],['electrolytes','Electrolytes','pack'],['fresh-produce','Fresh produce','pack'],['stove','Camp stove','pack'],['fuel','Stove fuel','pack'],['pot','Cooking pot','pack'],['spoon','Spoon','pack'],['food-bag','Food storage bag','pack']],
  bushcraft:[['tarp','Tarp','pack'],['cord','Utility cord','pack'],['firesteel','Firesteel','pack'],['tinder','Dry tinder','pack'],['knife','Sheathed utility knife','pack'],['saw','Folding saw','pack'],['hatchet','Sheathed hatchet','pack'],['work-gloves','Work gloves','hands'],['sewing-kit','Sewing kit','pack']],
  farming:[['trowel','Hand trowel','pack'],['hoe','Compact hoe','separate-load'],['seeds','Seed packets','pack'],['watering-can','Watering can','separate-load'],['harvest-basket','Harvest basket','separate-load'],['pruning-shears','Covered pruning shears','pack']],
  hunting:[['bow','Unstrung hunting bow','separate-load'],['quiver','Covered quiver','pack'],['binoculars','Binoculars','pack'],['fishing-rod','Packed fishing rod','pack'],['fishing-kit','Covered fishing tackle','pack'],['field-kit','Food preparation kit','pack']]
 };
 const items=freeze(Object.fromEntries(Object.entries(groups).flatMap(([category,rows])=>rows.map(([id,name,attachment])=>[id,{id,name,category,attachment,essential:category==='protection',use:category==='protection'?'always':id==='ascender'?'deadline-assistance':'activity'}]))));
 const roles=freeze({
  climbing:{name:'Rock climber',available:[...groups.protection,...groups.climbing,...groups.alpine,...groups.backpacking,...groups.food].map(row=>row[0]),carried:['helmet','harness','locking-carabiner','belay-device','dynamic-rope','climbing-shoes','personal-tether','gloves','backpack','bottle','energy-bar','chalk','quickdraws','nuts','cams','static-rope','ascender','foot-loop','first-aid'],optionalAid:'ascender'},
  trail:{name:'Trail / trials explorer',available:[...groups.trail,...groups.backpacking,...groups.food].map(row=>row[0]),carried:['trail-shoes','poles','map','compass','backpack','bottle','filter','trail-mix','rain-shell','first-aid','headlamp']},
  backpacking:{name:'Backpacker',available:[...groups.backpacking,...groups.trail,...groups.food].map(row=>row[0]),carried:['backpack','trail-shoes','bottle','filter','map','compass','sleeping-bag','sleeping-mat','shelter','stove','fuel','pot','oats','first-aid']},
  bushcraft:{name:'Bushcraft cook',available:[...groups.bushcraft,...groups.backpacking,...groups.food].map(row=>row[0]),carried:['backpack','bottle','filter','tarp','cord','knife','saw','work-gloves','firesteel','tinder','pot','spoon','rice','beans','first-aid']},
  farming:{name:'Grower',available:[...groups.farming,...groups.backpacking,...groups.food].map(row=>row[0]),carried:['trowel','seeds','backpack','bottle','fresh-produce','first-aid']},
  hunting:{name:'Forager / hunter',available:[...groups.hunting,...groups.backpacking,...groups.food].map(row=>row[0]),carried:['backpack','bottle','binoculars','fishing-kit','field-kit','food-bag','first-aid']},
  play:{name:'Playful helper',available:[],carried:[]}
 });
 const themes=freeze({orbit:null,candy:{character:'candy',role:'play'},climber:{character:'moss',role:'climbing'},climber2:{character:'ridge',role:'climbing'},woodland:{character:'moss',role:'trail'}});
 const anatomy=freeze({shoulders:[{x:-6,y:-10},{x:6,y:-10}],hips:[{x:-4,y:8},{x:4,y:8}],upperArm:12,forearm:11,thigh:12,shin:12,belayLoop:{x:0,y:9}});
 function create(id,{role='climbing',appearance={}}={}){
  if(!Object.hasOwn(identities,id)||!Object.hasOwn(roles,role))throw Error('Unknown character or role');
  const colors={...identities[id].appearance};
  for(const key of Object.keys(appearance)){
   if(!(key in colors)||!/^#[0-9a-f]{6}$/i.test(appearance[key]))throw Error('Appearance expects a known color and six-digit hex value');
   colors[key]=appearance[key];
  }
  return freeze({id,...identities[id],appearance:colors,role,inventory:[...roles[role].carried]});
 }
 function forTheme(theme){
  const binding=themes[theme];if(!binding)return null;
  const chosen=globalThis.ORBIT_CONFIG?.characters?.[theme]||binding.character;
  return create(identities[chosen]?chosen:binding.character,{role:binding.role});
 }
 // Two-link inverse kinematics: targets are clamped to anatomical reach.
 function joint(root,target,a,b,bend=1){
  const dx=target.x-root.x,dy=target.y-root.y,d=clamp(Math.hypot(dx,dy),Math.abs(a-b)+.01,a+b-.01),angle=Math.atan2(dy,dx);
  const offset=Math.acos(clamp((a*a+d*d-b*b)/(2*a*d),-1,1));
  const middle={x:root.x+a*Math.cos(angle+bend*offset),y:root.y+a*Math.sin(angle+bend*offset)};
  return [root,middle,{x:root.x+d*Math.cos(angle),y:root.y+d*Math.sin(angle)}];
 }
 function pose(action='camp',cycle=0){
  const climbing=['climb','assist','rappel'].includes(action),rest=['rest','camp','sleep','collect','recover-climb'].includes(action);
  const c=((cycle%1)+1)%1,step=Math.floor(c*4),t=(c*4)%1,lift=Math.sin(t*Math.PI);
  const hands=climbing?[{x:-12,y:-27},{x:12,y:-24}]:[{x:-13,y:2},{x:13,y:2}];
  const feet=rest?[{x:-15,y:23},{x:15,y:23}]:[{x:-8,y:30},{x:8,y:30}];
  const contacts={leftHand:climbing,rightHand:climbing,leftFoot:true,rightFoot:true};
  if(climbing){
   // Move one appendage at a time: the other three remain supporting contacts.
   if(step===0){hands[0].y+=lift*5;contacts.leftHand=lift<.001;}
   if(step===1){feet[0].y-=lift*7;contacts.leftFoot=lift<.001;}
   if(step===2){hands[1].y+=lift*5;contacts.rightHand=lift<.001;}
   if(step===3){feet[1].y-=lift*7;contacts.rightFoot=lift<.001;}
  }else if(action==='walk'||action==='traverse'){
   feet[0].x+=Math.sin(c*Math.PI*2)*4;feet[1].x-=Math.sin(c*Math.PI*2)*4;
   feet[step<2?0:1].y-=lift*3;
  }else if(action==='cast'){hands[0]={x:-11,y:-24};}
  else if(action==='gather'){hands[0]={x:-17,y:9};hands[1]={x:15,y:7};}
  else if(action==='build'){hands[0]={x:-18,y:-5-lift*6};hands[1]={x:20,y:-13};}
  else if(action==='water'){hands[0]={x:-3,y:-20};hands[1]={x:17,y:1};}
  else if(action==='cook'){hands[0]={x:-16,y:3};hands[1]={x:20,y:-2-lift*4};}
  else if(action==='teach'||action==='read-map'){hands[0]={x:-20,y:-14};hands[1]={x:16,y:0};}
  else if(action==='recover-climb'){hands[0]={x:-12,y:-27};hands[1]={x:13,y:2};feet[0]={x:-12,y:30};feet[1]={x:12,y:30};contacts.leftHand=true;}

  const arms=hands.map((p,i)=>joint(anatomy.shoulders[i],p,anatomy.upperArm,anatomy.forearm,i?-1:1));
  const legs=feet.map((p,i)=>joint(anatomy.hips[i],p,anatomy.thigh,anatomy.shin,i?1:-1));
  return {arms,legs,contacts,resting:rest};
 }
 // Stylized effort model per ascent: a mandatory hold-and-recover interval.
 // Pure progress sampling avoids integrating hidden-tab time or missed frames.
 function ascent(progress,remainingSeconds=Infinity){
  const p=clamp(progress),resting=p>=.34&&p<.5;
  let distance,fatigue;
  if(p<.34){distance=p/.34*.4;fatigue=lerp(.12,.72,p/.34);}
  else if(p<.5){distance=.4;fatigue=lerp(.72,.24,(p-.34)/.16);}
  else{distance=lerp(.4,1,(p-.5)/.5);fatigue=lerp(.24,.76,(p-.5)/.5);}
  const assisted=!resting&&p>.85&&remainingSeconds>=0&&remainingSeconds<1.5;
  return {progress:distance,fatigue,resting,assisted,action:resting?'rest':assisted?'assist':'climb'};
 }
 // Authored world-space stations: four limb transfers, then a supported body lift.
 // Sampling stays deterministic across resize, clock jumps and missed frames.
 function climbContacts(route,progress,{resting=false}={}){
  const names=['leftHand','leftFoot','rightHand','rightFoot'],stations=route.stations;
  if(!Number.isFinite(progress)||!(route.scale>0)||stations.length<2)throw Error('Invalid contact route');
  const at=clamp(progress)*(stations.length-1),index=Math.min(stations.length-2,Math.floor(at));
  const local=at-index,stage=Math.min(4,Math.floor(local*5+1e-9)),t=clamp(local*5-stage),smooth=t*t*(3-2*t);
  const before=stations[index],after=stations[index+1];
  const root=stage===4?{x:lerp(before.root.x,after.root.x,smooth),y:lerp(before.root.y,after.root.y,smooth)}:{...before.root};
  const targets={},contacts={},holds={};
  names.forEach((name,i)=>{
   const completed=i<stage,current=i===stage&&stage<4,start=before[name],end=after[name];
   targets[name]=completed?{x:end.x,y:end.y}:current?{x:lerp(start.x,end.x,smooth)+(name.endsWith('Foot')?Math.sin(t*Math.PI)*route.scale*2:0),y:lerp(start.y,end.y,smooth)}:{x:start.x,y:start.y};
   contacts[name]=!current||t===0||t===1;
   holds[name]=contacts[name]?(completed||t===1?end.id:start.id):null;
  });
  const relative=name=>({x:(targets[name].x-root.x)/route.scale,y:(targets[name].y-root.y)/route.scale});
  const solve=(origin,target,a,b,bend)=>{
   const distance=Math.hypot(target.x-origin.x,target.y-origin.y);
   if(distance>a+b-.01||distance<Math.abs(a-b)+.01)throw Error('Authored hold outside limb reach');
   return joint(origin,target,a,b,bend);
  };
  const arms=['leftHand','rightHand'].map((name,i)=>solve(anatomy.shoulders[i],relative(name),anatomy.upperArm,anatomy.forearm,i?-1:1));
  const legs=['leftFoot','rightFoot'].map((name,i)=>solve(anatomy.hips[i],relative(name),anatomy.thigh,anatomy.shin,i?1:-1));
  return {root,targets,holds,stage,moving:stage<4&&t>0&&t<1?names[stage]:null,arms,legs,contacts,resting};
 }
 function walkContacts(route,progress,{action='walk'}={}){
  if(!Number.isFinite(progress)||!(route.scale>0)||!Number.isInteger(route.steps)||route.steps<1)throw Error('Invalid walking route');
  const at=clamp(progress)*route.steps,index=Math.min(route.steps-1,Math.floor(at)),t=at-index,stride=route.stride,scale=route.scale;
  const root={x:route.origin.x+at*stride,y:route.origin.y};
  const leftMoves=index%2===0,start=[route.origin.x-stride/2,route.origin.x+stride/2];
  const targets={},holds={},contacts={leftHand:false,rightHand:false};
  ['leftFoot','rightFoot'].forEach((name,i)=>{
   const completed=Math.floor((index+(i===0?1:0))/2),x=start[i]+completed*2*stride,moving=i===(leftMoves?0:1);
   const groundX=moving?x+2*stride*t:x;
   targets[name]={x:groundX,y:route.groundY-(moving?Math.sin(t*Math.PI)*4*scale:0)};
   contacts[name]=!moving||t===0||t===1;
   holds[name]=contacts[name]?{x:groundX,y:route.groundY}:null;
  });
  const base=pose(action,progress*route.steps);
  const legs=['leftFoot','rightFoot'].map((name,i)=>joint(anatomy.hips[i],{x:(targets[name].x-root.x)/scale,y:(targets[name].y-root.y)/scale},anatomy.thigh,anatomy.shin,i?1:-1));
  return {...base,root,legs,targets,holds,contacts,resting:action!=='walk'};
 }
 // Place a tool by a named local grip, with its working end at the work socket.
 function toolGrip(hand,work,{length=14,grip={x:0,y:0}}={}){
  const angle=Math.atan2(work.y-hand.y,work.x-hand.x),c=Math.cos(angle),s=Math.sin(angle);
  return {angle:angle*180/Math.PI,x:hand.x-grip.x*c+grip.y*s,y:hand.y-grip.x*s-grip.y*c,tip:{x:hand.x+length*c,y:hand.y+length*s}};
 }
 function workContacts({root,scale,groundY,work,hand=0,angle=Math.PI/2,length=14,action='gather',cycle=0}){
  const base=pose(action,cycle),target={x:(work.x-root.x)/scale,y:(work.y-root.y)/scale};
  const wrist={x:target.x-length*Math.cos(angle),y:target.y-length*Math.sin(angle)},shoulder=anatomy.shoulders[hand];
  if(Math.hypot(wrist.x-shoulder.x,wrist.y-shoulder.y)>anatomy.upperArm+anatomy.forearm-.01)throw Error('Work socket outside hand reach');
  const arms=base.arms.slice();arms[hand]=joint(shoulder,wrist,anatomy.upperArm,anatomy.forearm,hand?-1:1);
  const legs=[-12,12].map((x,i)=>joint(anatomy.hips[i],{x,y:(groundY-root.y)/scale},anatomy.thigh,anatomy.shin,i?1:-1));
  return {...base,root,arms,legs,toolTarget:target,toolHand:hand,contacts:{leftHand:false,rightHand:false,leftFoot:true,rightFoot:true}};
 }
 const path=points=>points.map((p,i)=>`${i?'L':'M'}${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join(' ');
 function artwork(character){
  const c=character.appearance,climbing=character.role==='climbing',has=id=>character.inventory.includes(id);
  const body=character.body==='drop'?'M0 -19C-3 -13 -10 -9 -9 -2Q-9 10 0 10Q10 10 10 -2C10 -9 3 -13 0 -19Z':'M-6 -13Q0 -16 6 -13L8 7Q0 11 -8 7Z';
  return `<g class="character-art" data-character="${character.id}" data-role="${character.role}" style="--character-skin:${c.skin};--character-ink:${c.ink}">
   <g data-layer="equipment-back"><g class="character-pack" ${has('backpack')?'':'display="none"'} fill="${c.pack}" stroke="${c.ink}" stroke-width="1.2"><rect x="7" y="-14" width="10" height="22" rx="4"/><path d="M9 -8H15M10 -14V-18H15V-14" fill="none"/><rect x="8" y="-21" width="12" height="5" rx="2" fill="${c.trousers}"/><rect x="16" y="-3" width="3" height="7" rx="1" fill="#82b9c1"/></g></g>
   <g data-layer="appendages" fill="none" stroke="${c.skin}" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"><path data-part="arm-left"/><path data-part="arm-right"/><g stroke="${c.trousers}"><path data-part="leg-left"/><path data-part="leg-right"/></g></g>
   <g data-layer="body"><path d="${body}" fill="${c.jacket}" stroke="${c.ink}" stroke-width="1.2"/><path d="M-5 -12L-3 4M5 -12L3 4" fill="none" stroke="${c.pack}" stroke-width="1.5"/><path d="M0 -11V4" stroke="${c.ink}" stroke-width=".8"/></g>
   <g data-layer="face"><circle cy="-23" r="7.3" fill="${c.skin}" stroke="${c.ink}" stroke-width="1.2"/><path data-part="eyes" d="M-3 -24V-22M3 -24V-22" fill="none" stroke="${c.ink}" stroke-width="1.2" stroke-linecap="round"/><path data-part="mouth" d="M-3 -19Q0 -16 3 -19" fill="none" stroke="${c.ink}" stroke-width="1"/><path d="M-5 -20H-4M4 -20H5" stroke="${c.pack}"/><path data-part="sweat" d="M10 -24Q7 -19 10 -19Q13 -19 10 -24" fill="#9ac6cc" display="none"/></g>
   <g data-layer="headwear"><path d="${climbing?'M-8 -26Q-7 -34 0 -34Q7 -34 8 -26Z':'M-8 -26Q-6 -32 1 -31L6 -26L11 -25H-8Z'}" fill="${c.helmet}" stroke="${c.ink}" stroke-width="1.2"/><path ${climbing?'':'display="none"'} d="M-6 -26L-5 -17H5L6 -26" fill="none" stroke="${c.harness}" stroke-width="1"/><path d="M-4 -30H-2M2 -30H4" stroke="${c.ink}" stroke-width="1"/></g>
   <g data-layer="equipment-front"><g class="character-climbing-kit" ${climbing?'':'display="none"'}>
    <g class="character-harness" fill="none" stroke="${c.harness}" stroke-width="2"><path d="M-8 4H8M-7 8Q-8 15 -2 14L-1 7M7 8Q8 15 2 14L1 7M-5 5L0 9L5 5"/><ellipse cx="0" cy="9" rx="1.8" ry="3"/></g>
    <g stroke="${c.metal}" stroke-width="1" fill="none"><path d="M-9 3Q-15 3 -14 8Q-12 11 -9 7ZM9 3Q15 3 14 8Q12 11 9 7Z"/><path d="M-11 4V7M11 4V7"/><rect x="-2" y="11" width="4" height="3" rx="1"/></g>
    <path d="M9 -7Q20 -11 20 -4Q20 3 13 0Q9 -2 13 -5Q18 -8 18 -3" fill="none" stroke="${c.rope}" stroke-width="1.5"/>
    <path data-part="fixed-line" display="none" fill="none" stroke="${c.rope}" stroke-width="1"/><path data-part="aid-tether" display="none" fill="none" stroke="${c.harness}" stroke-width="1"/><path data-part="aid-foot-loop" display="none" fill="none" stroke="${c.harness}" stroke-width="1"/><g data-part="ascender" display="none"><rect x="-2" y="-3" width="4" height="7" rx="1" fill="${c.metal}" stroke="${c.ink}" stroke-width=".7"/></g>
   </g><g data-part="glove-left" fill="${c.boots}"><circle r="2"/></g><g data-part="glove-right" fill="${c.boots}"><circle r="2"/></g><g data-part="held-bottle" display="none" fill="#82b9c1" stroke="${c.ink}" stroke-width=".8"><rect x="-2" y="-5" width="4" height="7" rx="1"/><path d="M-1 -7H1V-5H-1Z"/></g><g data-part="held-food" display="none" fill="${c.helmet}" stroke="${c.ink}" stroke-width=".8"><rect x="-3" y="-2" width="6" height="3" rx="1"/></g><g data-part="held-map" display="none" fill="#e3d6ac" stroke="${c.ink}" stroke-width=".7"><path d="M-7 -5L0 -7L7 -5V5L0 3L-7 5Z"/><path d="M0 -7V3" fill="none"/></g><g data-part="held-spoon" display="none" fill="${c.metal}" stroke="${c.ink}" stroke-width=".5"><path d="M0 0H11"/><ellipse cx="14" cy="0" rx="3" ry="1.6"/></g><g data-part="held-gear" display="none" fill="none" stroke="${c.metal}" stroke-width="1"><path d="M-2 -3Q3 -5 3 0Q2 4 -2 2Z"/></g></g><g data-layer="footwear" stroke="${c.boots}" stroke-width="3.8" stroke-linecap="round"><path data-part="boot-left"/><path data-part="boot-right"/></g>
  </g>`;
 }
 function mount(host,character){host.innerHTML=artwork(character);host._deskCharacter=character;update(host,{action:'camp'});return host;}
 function update(host,{action='camp',cycle=0,fatigue=0,assisted=false,item=null,ropeAnchor={x:0,y:-40},rig=null}={}){
  const root=host.querySelector('.character-art');if(!root)return;
  const character=host._deskCharacter,p=rig||pose(action,cycle),part=name=>root.querySelector(`[data-part="${name}"]`);
  ['left','right'].forEach((side,i)=>{part('arm-'+side).setAttribute('d',path(p.arms[i]));part('leg-'+side).setAttribute('d',path(p.legs[i]));const foot=p.legs[i][2];part('boot-'+side).setAttribute('d',path([foot,{x:foot.x+(i?4:-4),y:foot.y}]));});
  ['left','right'].forEach((side,i)=>{const hand=p.arms[i][2];part('glove-'+side).setAttribute('transform',`translate(${hand.x} ${hand.y})`);part('glove-'+side).setAttribute('display',(character.inventory.includes('gloves')||character.inventory.includes('work-gloves'))?'':'none');});
  for(const [name,kind,inventory] of [['held-bottle','water','bottle'],['held-food','food','energy-bar'],['held-gear','gear','locking-carabiner']]){const hand=p.arms[0][2];part(name).setAttribute('transform',`translate(${hand.x} ${hand.y})`);part(name).setAttribute('display',['collect','camp','water','cook'].includes(action)&&item===kind&&(character.inventory.includes(inventory)||(kind==='food'&&character.inventory.some(id=>['rice','beans','trail-mix'].includes(id))))?'':'none');}
  for(const [name,index,show] of [['held-map',0,['teach','read-map'].includes(action)&&character.inventory.includes('map')],['held-spoon',1,action==='cook'&&character.inventory.includes('spoon')]]){const hand=p.arms[index][2];part(name).setAttribute('transform',`translate(${hand.x} ${hand.y})`);part(name).setAttribute('display',show?'':'none');}
  if(action==='cook'&&p.toolTarget){const grip=toolGrip(p.arms[1][2],p.toolTarget);part('held-spoon').setAttribute('transform',`translate(${grip.x} ${grip.y}) rotate(${grip.angle})`);}
  root.dataset.action=action;root.dataset.fatigue=clamp(fatigue).toFixed(3);root.dataset.support=String(Object.values(p.contacts).filter(Boolean).length);
  part('sweat').setAttribute('display',fatigue>.55&&!p.resting?'':'none');
  part('eyes').setAttribute('d',action==='sleep'?'M-4 -23H-1M1 -23H4':'M-3 -24V-22M3 -24V-22');
  part('mouth').setAttribute('d',fatigue>.55&&!p.resting?'M-2 -19Q0 -22 2 -19Q0 -17 -2 -19':'M-3 -19Q0 -16 3 -19');
  const aid=action==='assist'&&assisted&&character.inventory.includes('ascender')&&character.inventory.includes('static-rope');
  const loop=anatomy.belayLoop,dx=ropeAnchor.x-loop.x,dy=ropeAnchor.y-loop.y,d=Math.hypot(dx,dy)||1,device={x:loop.x+dx/d*19-dy/d*3,y:loop.y+dy/d*19+dx/d*3};
  part('ascender').setAttribute('transform',`translate(${device.x} ${device.y})`);
  part('fixed-line').setAttribute('d',path([{x:ropeAnchor.x-dy/d*3,y:ropeAnchor.y+dx/d*3},{x:loop.x-dx/d*20-dy/d*3,y:loop.y-dy/d*20+dx/d*3}]));
  part('aid-tether').setAttribute('d',path([device,loop]));part('aid-foot-loop').setAttribute('d',path([device,p.legs[0][2]]));
  for(const name of ['ascender','aid-tether','aid-foot-loop','fixed-line'])part(name).setAttribute('display',aid?'':'none');
  root.dataset.ropeSystem=aid?'protected-fixed-line':'dynamic-protection';
  return p;
 }
 function attachment(character){if(!character.inventory.includes('harness'))throw Error('Rope-bearing roles require a harness');return {...anatomy.belayLoop};}
 function candyArt(character){const c=character.appearance;return `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
  <g class="candy-bike" fill="none" stroke="${c.jacket}" stroke-width="3"><circle cx="18" cy="63" r="12"/><circle cx="64" cy="63" r="12"/><path d="M18 63L32 43L46 63H18L41 43L64 63M59 38L64 63M55 38H64M27 42H38"/></g>
  <g class="candy-legs" fill="none" stroke="${c.trousers}" stroke-width="4" stroke-linecap="round"><path class="leg-a" d="M34 48L28 64L20 65"/><path class="leg-b" d="M44 48L50 63L58 65"/></g>
  <g class="candy-body"><path d="M39 8C36 20 18 26 18 39C18 53 30 59 40 59C54 59 61 50 61 39C61 26 44 20 39 8Z" fill="${c.skin}" stroke="${c.outline}" stroke-width="2"/>
   <path d="M30 29Q26 32 26 37" fill="none" stroke="${c.highlight}" stroke-width="3" stroke-linecap="round"/>
   <ellipse cx="33" cy="40" rx="2.5" ry="4" fill="${c.eyes}"/><ellipse cx="46" cy="40" rx="2.5" ry="4" fill="${c.eyes}"/><path d="M35 48Q40 52 45 48" fill="none" stroke="${c.ink}" stroke-width="2" stroke-linecap="round"/>
   <path d="M19 41L10 35M60 41L67 35" stroke="${c.skin}" stroke-width="4" stroke-linecap="round"/>
  </g>
  <g class="candy-broom" stroke="${c.harness}" stroke-width="3" fill="${c.pack}"><path d="M65 29L53 63"/><path d="M48 59L59 63L60 73L43 68Z"/></g>
 </svg>`;}
 function mountCandy(host){const character=forTheme('candy');host.innerHTML=character.id==='candy'?candyArt(character):`<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><g transform="translate(40 38) scale(.75)">${artwork(character)}</g></svg>`;host.dataset.character=character.id;host.dataset.role=character.role;if(character.id!=='candy'){host._deskCharacter=character;update(host,{action:'walk'});}}
 globalThis.DeskCharacters=freeze({identities,items,roles,themes,anatomy,create,forTheme,joint,pose,ascent,climbContacts,walkContacts,workContacts,toolGrip,artwork,mount,update,attachment,mountCandy});
})();
