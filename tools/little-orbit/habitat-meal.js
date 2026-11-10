// SPDX-License-Identifier: LicenseRef-Simpli-Noncommercial-1.0
// Copyright (C) 2026 ilamgumaran and contributors
// A clock-sampled illustration of gathering, sharing and taking time to rest.
(()=>{
 'use strict';
 const freeze=value=>{if(value&&typeof value==='object'&&!Object.isFrozen(value)){Object.values(value).forEach(freeze);Object.freeze(value);}return value;};
 const clamp=(n,a=0,b=1)=>Math.max(a,Math.min(b,n)),lerp=(a,b,t)=>a+(b-a)*t;
 const smooth=t=>{const p=clamp(t);return p*p*p*(p*(p*6-15)+10);};
 const between=(t,start,end)=>smooth((t-start)/(end-start));
 const point=(a,b,t)=>({x:lerp(a.x,b.x,t),y:lerp(a.y,b.y,t)});
 const stages=freeze([
  {id:'gather',label:'Gather greens',caption:'Sage gathers greens for a shared meal.',start:0,end:8},
  {id:'carry',label:'Bring food to the pot',caption:'Sage brings the gathered greens to the pot.',start:8,end:16},
  {id:'cook',label:'Prepare a shared meal',caption:'Sage gently stirs the camp pot.',start:16,end:36},
  {id:'deliver',label:'Bring the meal to the table',caption:'Sage carries a warm bowl around the hearth.',start:36,end:44},
  {id:'serve',label:'Make enough to share',caption:'Sage sets the meal out for the family.',start:44,end:49},
  {id:'rest',label:'Take time to rest',caption:'With the meal ready, Sage pauses to rest.',start:49,end:54},
  {id:'return',label:'Return to the basket',caption:'Sage walks back, ready for the next small task.',start:54,end:60}
 ]);
 const labels=freeze(Object.fromEntries(stages.map(({id,label,caption})=>[id,{label,caption}])));
 const geometry=freeze({home:{x:78,ground:30},serving:{x:126,ground:48},basket:{x:86,y:5},pot:{x:100,y:5},bowl:{x:142,y:14},bowlScale:48/54,spoonLength:14,blendSeconds:1.2});
 function sample({routine,elapsedSeconds},{frozen=false}={}){
  const start=routine==='cook'?11*3600:routine==='care'?20*3600:null;
  const local=Number(elapsedSeconds)-start;
  if(frozen||start===null||!Number.isFinite(local)||local<0||local>=7200)return {active:false,stage:null,label:'',caption:'',weight:0,progress:0,meal:{servedOpacity:0,bowlOpacity:0}};
  const second=local%60,stage=stages.find(item=>second>=item.start&&second<item.end);
  const weight=between(local,1.2,3.2)*between(7200-local,1.2,3.2);
  // Serving is an authored illustration, rather than stored food resources.
  const servedOpacity=weight*between(second,44,45.2)*(1-between(second,56,60));
  return {active:true,stage:stage.id,label:stage.label,caption:stage.caption,localSeconds:second,routineSeconds:local,remainingSeconds:7200-local,weight,progress:(second-stage.start)/(stage.end-stage.start),meal:{servedOpacity,bowlOpacity:servedOpacity}};
 }
 function world(pose,p){return {x:pose.x+p.x*pose.actorScale,y:pose.rootY+p.y*pose.actorScale};}
 // Each foot has a world-space hold. Only the swinging foot changes position;
 // the root follows the same progress used for those contact transfers.
 function walking(from,to,t,scale,{returning=false}={}){
  const count=8,at=clamp(t)*count,index=Math.min(count-1,Math.floor(at)),part=at-index;
  const direction=Math.sign(to.x-from.x),stride=Math.abs(to.x-from.x)/count,first=direction>0?0:1,moving=(first+index)%2;
  const half=8*scale,starts=[from.x-half,from.x+half];
  const returnGround=x=>lerp(geometry.serving.ground,geometry.home.ground,smooth((110-x)/(110-geometry.home.x-half)));
  const floor=(x,completed,swing)=>returning?returnGround(x):completed>0?to.ground:lerp(from.ground,to.ground,smooth(swing));
  const feet=starts.map((start,i)=>{
   const completed=Math.floor((index+(i===first?1:0))/2),isMoving=i===moving;
   const x=start+direction*2*stride*(completed+(isMoving?smooth(part):0));
   const y=floor(x,completed,isMoving?part:0)-(isMoving?Math.sin(part*Math.PI)**2*4*scale:0);
   return {x,y};
  });
  const x=lerp(from.x,to.x,clamp(t)),rootY=Math.max(...feet.map(p=>p.y))-30*scale-Math.sin(part*Math.PI)**2*.25*scale;
  return {x,rootY,feet,contacts:feet.map((_,i)=>i!==moving||part===0||part===1),armBeat:Math.sin(at*Math.PI)};
 }
 function authored(cue,base){
  const s=base.actorScale,t=cue.localSeconds,home=geometry.home,destination=geometry.serving;
  // Reach home before the final 1.2-second base-pose hold.
  const returnEnd=cue.remainingSeconds<60?58.8:60;
  let root={x:home.x,rootY:home.ground-30*s,feet:[{x:home.x-8*s,y:home.ground},{x:home.x+8*s,y:home.ground}],contacts:[true,true],armBeat:0};
  if(t>=36&&t<44)root=walking(home,destination,between(t,36,44),s);
  else if(t>=44&&t<54)root={x:destination.x,rootY:destination.ground-30*s,feet:[{x:destination.x-8*s,y:destination.ground},{x:destination.x+8*s,y:destination.ground}],contacts:[true,true],armBeat:0};
  else if(t>=54)root=walking(destination,home,between(t,54,returnEnd),s,{returning:true});
  const homeHand=geometry.basket,pot=geometry.pot,spoonHand={x:pot.x,y:pot.y-geometry.spoonLength*s};
  const restHand={x:destination.x+13*s,y:destination.ground-28*s};
  let hand,greens=0,spoon=0,bowl=0;
  if(t<8){hand={x:homeHand.x,y:homeHand.y-Math.sin(t/8*Math.PI)**2};greens=between(t,0,1.2);}
  else if(t<16){
   hand=t<14?point(homeHand,pot,between(t,8,14)):point(pot,spoonHand,between(t,14,16));
   greens=1-between(t,14,16);bowl=between(t,8,9.2)*(1-between(t,14,16));spoon=between(t,14,16);
  }else if(t<36){
   const angle=4*Math.PI*between(t,16,36);
   hand={x:pot.x+1.2*Math.sin(angle),y:spoonHand.y+.6*(Math.cos(angle)-1)};spoon=1;
  }else if(t<44){
   const transfer=between(t,36,37.2),travel=between(t,37.2,44);
   hand=t<37.2?point(spoonHand,{x:pot.x,y:pot.y-1},transfer):point({x:pot.x,y:pot.y-1},geometry.bowl,travel);
   spoon=1-transfer;bowl=transfer;
  }else if(t<49){
   hand=point(geometry.bowl,restHand,between(t,45.2,49));bowl=1-between(t,44,45.2);
  }else if(t<54)hand=restHand;
  else hand=point(restHand,homeHand,between(t,54,returnEnd));
  return {...root,hands:[{x:root.x-13*s-root.armBeat*s*2,y:root.rootY+2*s},hand],toolWeights:{greens,spoon,bowl,flower:0}};
 }
 function apply(model,base,{frozen=false}={}){
  const cue=sample(model,{frozen});if(!cue.active||cue.weight===0)return base;
  const c=globalThis.DeskCharacters,raw=authored(cue,base),weight=cue.weight;
  // Routine fades change hands and props; the feet finish their authored
  // route on fixed holds before the baseline takes over at home.
  const result={...base,x:raw.x,rootY:raw.rootY,meal:cue};
  const relative=p=>({x:(p.x-result.x)/base.actorScale,y:(p.y-result.rootY)/base.actorScale});
  const targets=(limbs,next)=>limbs.map((limb,i)=>point(world(base,limb[2]),next[i],weight));
  const hands=targets(base.rig.arms,raw.hands),feet=raw.feet;
  const arms=hands.map((p,i)=>c.joint(c.anatomy.shoulders[i],relative(p),c.anatomy.upperArm,c.anatomy.forearm,i?-1:1));
  const legs=feet.map((p,i)=>c.joint(c.anatomy.hips[i],relative(p),c.anatomy.thigh,c.anatomy.shin,i?1:-1));
  result.rig={arms,legs,contacts:{leftHand:false,rightHand:false,leftFoot:raw.contacts[0],rightFoot:raw.contacts[1]},resting:cue.stage==='rest'};
  result.wrist=world(result,arms[1][2]);
  result.toolWeights=Object.fromEntries(['greens','spoon','bowl','flower'].map(key=>[key,lerp(base.toolWeights?.[key]||0,raw.toolWeights[key],weight)]));
  result.shelterWeight=(base.shelterWeight||0)*(1-weight);
  return result;
 }
 globalThis.DeskHabitatMeal=Object.freeze({sample,apply,stages,labels,geometry});
})();
