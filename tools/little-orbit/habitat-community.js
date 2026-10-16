// SPDX-License-Identifier: LicenseRef-Simpli-Noncommercial-1.0
// Copyright (C) 2026 ilamgumaran and contributors
// A small authored family camp; calendar sampling has no persistent ecology.
(()=>{
 'use strict';
 const setAttr=(node,name,value)=>{value=String(value);if(node.getAttribute(name)!==value)node.setAttribute(name,value);};
 const setStyle=(node,name,value)=>{value=String(value);if(node.style[name]!==value)node.style[name]=value;};
 const setData=(node,name,value)=>{value=String(value);if(node.dataset[name]!==value)node.dataset[name]=value;};
 const freeze=v=>{if(v&&typeof v==='object'){Object.values(v).forEach(freeze);Object.freeze(v);}return v;};
 const frame=freeze({actorPixels:54,originCss:{landscape:190,portrait:90},groundInset:10,bounds:{left:-112,top:-90,right:112,bottom:50},paddingCss:16});
 function paintFrame(layout){
  const sx=Number(layout?.sx),sy=Number(layout?.sy),ground=Number(layout?.ground);
  if(!Number.isFinite(sx)||sx<=0||!Number.isFinite(sy)||sy<=0||!Number.isFinite(ground)||ground<=0)return null;
  const portrait=!!layout.portrait,s=frame.actorPixels/66,originX=(portrait?frame.originCss.portrait:frame.originCss.landscape)/sx,originY=(ground-frame.groundInset)-30*s/sy;
  const padX=frame.paddingCss/sx,padY=frame.paddingCss/sy;
  const left=Math.floor((originX+frame.bounds.left*s/sx-padX)*sx),top=Math.floor((originY+frame.bounds.top*s/sy-padY)*sy);
  const right=Math.ceil((originX+frame.bounds.right*s/sx+padX)*sx),bottom=Math.ceil((originY+frame.bounds.bottom*s/sy+padY)*sy);
  const viewBox=freeze({x:left/sx,y:top/sy,width:(right-left)/sx,height:(bottom-top)/sy});
  return freeze({left,top,width:right-left,height:bottom-top,viewBox});
 }
 const family=freeze({adults:['aster','sage'],child:'sprout',infant:'pebble',remembered:'fern'});
 const schedule=freeze([
  {id:'shelter',label:'Tend the shelter',caption:'Aster cradles Pebble while Sage checks the shelter line.',start:6,end:8,action:'build'},
  {id:'forage',label:'Gather food',caption:'Sage gathers greens for the basket as Aster cares for Pebble.',start:8,end:11,action:'gather'},
  {id:'cook',label:'Prepare a shared meal',caption:'Sage stirs the gathered food while Aster cradles Pebble.',start:11,end:13,action:'stir-pot'},
  {id:'teach',label:'Learn together',caption:'Sage shows Aster how to sort seeds while Pebble rests in Aster’s arms.',start:13,end:16,action:'teach'},
  {id:'care',label:'Care for the baby',caption:'Aster cradles newborn Pebble as Sage checks that the camp is warm.',start:16,end:17,action:'gather'},
  {id:'remember',label:'Remember Fern',caption:'At dusk, the family tends Fern’s flowers and shares a quiet memory.',start:17,end:20,action:'kneel'},
  {id:'care',label:'Care for the baby',caption:'Aster cradles newborn Pebble while Sage keeps the camp warm.',start:20,end:22,action:'stir-pot'},
  {id:'rest',label:'Rest beneath the shelter',caption:'Aster keeps Pebble close while Sage rests beneath the weather canopy.',start:22,end:6,action:'sleep'}
 ]);
 function sample(date,{night,weatherKind='clear'}={}){
  const d=date instanceof Date?date:new Date(date);
  const hour=d.getHours()+d.getMinutes()/60+d.getSeconds()/3600+d.getMilliseconds()/3600000;
  const isNight=night===undefined?(hour<6||hour>=20):!!night;
  const routine=schedule.find(r=>r.start<r.end?hour>=r.start&&hour<r.end:hour>=r.start||hour<r.end)||schedule[0];
  const previous=schedule[(schedule.indexOf(routine)+schedule.length-1)%schedule.length];
  const sinceStart=((hour-routine.start+24)%24)*3600;
  const transition={fromAction:previous.action,fromRoutine:previous.id,elapsed:sinceStart,blend:sinceStart>=.7?1:(sinceStart/.7)**2*(3-2*sinceStart/.7)};
  // Keep remembrance visible through dusk, even when the supplied clock jumps.
  const label=routine.id==='remember'?'Aster and Sage remember Fern':routine.label;
  return freeze({routine:routine.id,label,caption:routine.caption,phase:(hour/24)%1,dayCycle:hour/24,elapsedSeconds:hour*3600,night:isNight,weatherKind:['rain','snow','storm'].includes(weatherKind)?weatherKind:'clear',family,characters:freeze({aster:{action:'cradle-care'},sage:{action:routine.action},sprout:{action:isNight?'sleep':'play-sand',supervisedBy:'sage'},pebble:{action:isNight?'sleep':'rest',support:'aster'}}),transition,memorial:routine.id==='remember'?{for:'fern',kind:'flowers'}:null,claims:freeze({biologicalAging:false,deathOrRebirth:false,persistentEcosystem:false})});
 }
 const lerp=(a,b,t)=>a+(b-a)*t;
 function sageTask(routine,elapsed,cycle){
  const cook=routine==='cook'||routine==='care'&&elapsed>=20*3600;
  let socket=null,kind=null;
  if(cook){socket={x:70+Math.sin(cycle*Math.PI*2)*1.2,y:5+Math.cos(cycle*Math.PI*2)*.6};kind='spoon';}
  else if(routine==='shelter'){socket={x:68,y:-13};kind='shelter';}
  else if(routine==='teach')socket={x:63,y:-3};
  else if(routine==='remember'){socket={x:61,y:11};kind='flower';}
  else if(routine==='forage'||routine==='care'){socket={x:56,y:5};kind=routine==='forage'?'greens':'contact';}
  return {socket,kind,length:cook?14:0};
 }
 function actorPose(model,id,{frozen=false}={}){
  const elapsed=model.elapsedSeconds||0,cycle=frozen?0:elapsed/6;
  const action=id==='aster'?'cradle-care':(frozen?'sleep':model.characters[id].action);
  const from=id==='sage'&&!frozen?model.transition.fromAction:action;
  const blend=id==='sage'&&!frozen?model.transition.blend:1;
  const rig=globalThis.DeskCharacters.pose(action,cycle,{from,fromCycle:cycle,blend});
  const actorPx=id==='sprout'?38:id==='aster'?54:48,actorScale=actorPx/frame.actorPixels;
  const supportY=Math.max(...rig.legs.map(leg=>leg[2].y)),rootY=30-supportY*actorScale;
  const result={action,cycle,from,blend,rig,actorScale,rootY,wrist:null,toolWeights:{},shelterWeight:0};
  if(id!=='sage'||frozen)return result;
  const x=48;
  const campPoint=(pose,y)=>({x:x+pose.x*actorScale,y:y+pose.y*actorScale});
  const solveWrist=(pose,y,endpoint)=>{
   if(endpoint){
    const local={x:(endpoint.x-x)/actorScale,y:(endpoint.y-y)/actorScale};
    pose.arms[1]=globalThis.DeskCharacters.joint(globalThis.DeskCharacters.anatomy.shoulders[1],local,12,11,-1);
   }
   return campPoint(pose.arms[1][2],y);
  };
  const previous=blend<1?globalThis.DeskCharacters.pose(from,cycle):null;
  const previousRootY=previous?30-Math.max(...previous.legs.map(leg=>leg[2].y))*actorScale:rootY;
  const previousTask=previous?sageTask(model.transition.fromRoutine,elapsed,cycle):null;
  const currentTask=sageTask(model.routine,elapsed,cycle);
  const previousEndpoint=previousTask?.socket?{x:previousTask.socket.x,y:previousTask.socket.y-previousTask.length*actorScale}:null;
  const previousWrist=previous?solveWrist(previous,previousRootY,previousEndpoint):null;
  const currentBase=previous?globalThis.DeskCharacters.pose(action,cycle):rig,currentRootY=30-Math.max(...currentBase.legs.map(leg=>leg[2].y))*actorScale;
  const currentEndpoint=currentTask.socket?{x:currentTask.socket.x,y:currentTask.socket.y-currentTask.length*actorScale}:null;
  const currentWrist=solveWrist(currentBase,currentRootY,currentEndpoint);
  // Both ends are actual IK wrists constrained to their own camp tasks; blend
  // those camp-space contacts before solving the current rig's fixed bones.
  const wrist=previousWrist?{x:lerp(previousWrist.x,currentWrist.x,blend),y:lerp(previousWrist.y,currentWrist.y,blend)}:currentWrist;
  rig.arms[1]=globalThis.DeskCharacters.joint(globalThis.DeskCharacters.anatomy.shoulders[1],{x:(wrist.x-x)/actorScale,y:(wrist.y-rootY)/actorScale},12,11,-1);
  result.wrist=campPoint(rig.arms[1][2],rootY);
  result.toolWeights={};
  if(previousTask?.kind&&blend<1)result.toolWeights[previousTask.kind]=(1-blend);
  if(currentTask.kind)result.toolWeights[currentTask.kind]=(result.toolWeights[currentTask.kind]||0)+blend;
  result.shelterWeight=(model.routine==='shelter'?blend:0)+(previous&&model.transition.fromRoutine==='shelter'?1-blend:0);
  return result;
 }
 function create(host){
  const doc=host.ownerDocument,ns='http://www.w3.org/2000/svg';
  const root=doc.createElementNS(ns,'g');root.setAttribute('data-layer','community-camp');host.appendChild(root);host._communityCamp=root;
  root.innerHTML='<g data-prop="shelter"><path d="M-57 8L-10 -43L39 8Z" fill="#c4a987" fill-opacity=".92" stroke="#594f46" stroke-width="2"/><path d="M-10 -43V8M-56 8H39" fill="none" stroke="#594f46" stroke-width="1.4"/><path d="M-43 7L-10 -32L26 7Z" fill="#6e7963"/><path data-prop="ridge-line" d="M38 7L68 -13" fill="none" stroke="#594f46" stroke-width="1.4"/></g><g data-prop="basket"><path d="M48 5H65L62 18H51Z" fill="#b89162" stroke="#594f46"/><path d="M50 5Q56 -8 64 5M52 9H63" fill="none" stroke="#594f46"/><path d="M52 4Q52 -3 56 1Q59 -5 61 2Q66 -3 64 4Z" fill="#91a47b" stroke="#53694e"/><circle cx="55" cy="2" r="1.3" fill="#bd7f70"/><circle cx="61" cy="0" r="1.4" fill="#d8bb72"/></g><g data-prop="cook-pot"><ellipse cx="70" cy="5" rx="9" ry="2.5" fill="#b3b7ae" stroke="#594f46"/><path d="M62 5Q62 15 70 15Q78 15 78 5" fill="#8d9990" stroke="#594f46"/><path d="M63 4H77" stroke="#594f46" stroke-width="1.5"/><path d="M68 2Q65 -2 69 -4M73 2Q76 -2 72 -5" fill="none" stroke="#e9d1a1" stroke-width="1" opacity=".8"/></g><g data-prop="seed-board"><path d="M56 -9H71V-1H56Z" fill="#d9c99f" stroke="#594f46"/><path d="M59 -6L61 -3M64 -7L66 -4M68 -6L69 -3" stroke="#82956e" stroke-width="1.3"/></g><g data-prop="memorial"><path d="M53 11Q57 -1 61 11M61 11Q66 -5 70 11M49 11Q53 1 56 11" fill="none" stroke="#ad788b" stroke-width="2.2" stroke-linecap="round"/><path d="M48 12H72" stroke="#6a604f" stroke-width="1.5"/><circle cx="61" cy="0" r="1.6" fill="#e4c678"/></g><g data-adult="aster"/><g data-adult="sage"/>';
  const a=doc.createElementNS(ns,'g'),b=doc.createElementNS(ns,'g');root.querySelector('[data-adult="aster"]').appendChild(a);root.querySelector('[data-adult="sage"]').appendChild(b);
  globalThis.DeskCharacters.mount(a,globalThis.DeskCharacters.create('aster',{role:'caregiver'}));globalThis.DeskCharacters.mount(b,globalThis.DeskCharacters.create('sage',{role:'caregiver'}));
  const tool=doc.createElementNS(ns,'g');tool.dataset.communityTool='';tool.innerHTML='<path data-camp-spoon stroke="#d8c08a" stroke-width="1.5" fill="none"/><ellipse data-camp-spoon-bowl rx="2" ry="2.5" fill="#d8c08a"/><path data-camp-greens d="M-3 1Q-7 -6 0 -3Q5 -8 5 -1L0 3Z" fill="#9cb877" stroke="#4a6b48"/><g data-camp-flower><path d="M0 0v-6" stroke="#91a772"/><circle cy="-6" r="2.5" fill="#d7a0ad"/><circle cy="-6" r="1" fill="#f0d793"/></g>';b.append(tool);
  b._communityToolNodes={root:tool,spoon:tool.querySelector('[data-camp-spoon]'),bowl:tool.querySelector('[data-camp-spoon-bowl]'),greens:tool.querySelector('[data-camp-greens]'),flower:tool.querySelector('[data-camp-flower]')};
  const infant=doc.createElementNS(ns,'g');infant.setAttribute('data-infant','pebble');infant.setAttribute('data-infant-support','aster');infant.setAttribute('data-character','pebble');globalThis.DeskCharacters.mount(infant,globalThis.DeskCharacters.create('pebble',{role:'infant'}));a.appendChild(infant);
  const playPatch=doc.createElementNS(ns,'g');playPatch.setAttribute('data-prop','play-patch');playPatch.innerHTML='<ellipse cx="-62" cy="18" rx="15" ry="3" fill="#9b896e" opacity=".75"/><path d="M-63 16L-56 8M-63 16L-70 10" stroke="#685c4e" stroke-width="1.4"/>';root.appendChild(playPatch);
  const supports=doc.createElementNS(ns,'g');supports.innerHTML='<path d="M51 18V30M62 18V30M58 -1V30M69 -1V30" stroke="#786348" stroke-width="1.5"/><g data-community-hearth><ellipse cx="70" cy="30" rx="11" ry="3" fill="#7e806b"/><path d="M65 28Q64 21 70 17Q73 23 75 28Z" fill="#e1a35e"/><path d="M60 30L70 -3L80 30M70 -3V3" stroke="#655644" stroke-width="1.5" fill="none"/></g>';root.insertBefore(supports,root.querySelector('[data-adult]'));
  const childHost=doc.createElementNS(ns,'g');childHost.setAttribute('data-character','sprout');childHost.setAttribute('data-community-role','child');childHost.setAttribute('data-child','sprout');root.appendChild(childHost);
  const c=doc.createElementNS(ns,'g');childHost.appendChild(c);globalThis.DeskCharacters.mount(c,globalThis.DeskCharacters.create('sprout',{role:'play'}));
  const stick=doc.createElementNS(ns,'path');stick.setAttribute('data-play-stick','');stick.setAttribute('stroke','#b4a16c');stick.setAttribute('stroke-width','1.4');c.append(stick);
  root._communityActors={aster:a,sage:b,sprout:c};
  root._communityNodes={
   memorial:root.querySelector('[data-prop="memorial"]'),ridgeLine:root.querySelector('[data-prop="ridge-line"]'),
   cookPot:root.querySelector('[data-prop="cook-pot"]'),seedBoard:root.querySelector('[data-prop="seed-board"]'),
   canopy:root.querySelector('[data-prop="shelter"] path'),hearth:root.querySelector('[data-community-hearth]'),
   wrappers:{aster:root.querySelector('[data-adult="aster"]'),sage:root.querySelector('[data-adult="sage"]'),sprout:childHost},
   infant
  };
  return root;
 }
 function update(host,{model,layout,frozen=false,companions=true}={}){
  const root=host?._communityCamp||host;if(!root?._communityActors||!model||!layout)return;
  const portrait=!!layout.portrait,sx=layout.sx||1,sy=layout.sy||1,adultPx=frame.actorPixels,s=adultPx/66;
  const originX=(portrait?frame.originCss.portrait:frame.originCss.landscape)/sx,ground=layout.ground-frame.groundInset;
  const nodes=root._communityNodes;
  setAttr(root,'transform',`translate(${originX} ${ground-30*s/sy}) scale(${s/sx} ${s/sy})`);
  setData(root,'routine',model.routine);setData(host,'routine',model.routine);setData(root,'frozen',!!frozen);
  setAttr(nodes.memorial,'opacity',model.routine==='remember'?'1':'.52');
  setAttr(nodes.cookPot,'opacity',['cook','care'].includes(model.routine)?'1':'.72');
  setAttr(nodes.seedBoard,'opacity',model.routine==='teach'?'1':'.65');
  setAttr(nodes.canopy,'fill',['rain','storm'].includes(model.weatherKind)?'#687b78':model.weatherKind==='snow'?'#b9c9cc':'#c4a987');
  for(const node of Object.values(nodes.wrappers))setStyle(node,'display',companions?'':'none');
  if(!companions){setAttr(nodes.ridgeLine,'d','M38 7L68 -13');setAttr(nodes.ridgeLine,'opacity',model.routine==='shelter'?'1':'.25');return;}
  const elapsed=model.elapsedSeconds||0,cycle=frozen?0:elapsed/6,organic=frozen?0:elapsed/120;
  for(const id of ['aster','sage','sprout']){
   const actor=root._communityActors[id],pose=actorPose(model,id,{frozen}),{action,from,blend,cycle:actorCycle,rig,actorScale,rootY}=pose;
   const x=id==='aster'?-8:id==='sage'?48:-68;
   if(id==='sage'&&!frozen){
    const {root:tool,spoon,bowl,greens,flower}=actor._communityToolNodes,hand=rig.arms[1][2],tip={x:hand.x,y:hand.y+pose.spoonLength};
    const weights=pose.toolWeights,spoonWeight=weights.spoon||0,greensWeight=weights.greens||0,flowerWeight=weights.flower||0;
    setStyle(tool,'display',spoonWeight+greensWeight+flowerWeight>0?'':'none');
    setData(tool,'kind',spoonWeight?'spoon':flowerWeight?'flower':greensWeight?'greens':'contact');
    setAttr(spoon,'d',spoonWeight?`M${hand.x} ${hand.y}L${tip.x} ${tip.y}`:'');setStyle(spoon,'display',spoonWeight>0?'':'none');setStyle(spoon,'opacity',spoonWeight);
    setAttr(bowl,'cx',tip.x);setAttr(bowl,'cy',tip.y);setStyle(bowl,'display',spoonWeight>0?'':'none');setStyle(bowl,'opacity',spoonWeight);
    setAttr(greens,'transform',`translate(${hand.x} ${hand.y})`);setStyle(greens,'display',greensWeight>0?'':'none');setStyle(greens,'opacity',greensWeight);
    setAttr(flower,'transform',`translate(${hand.x} ${hand.y})`);setStyle(flower,'display',flowerWeight>0?'':'none');setStyle(flower,'opacity',flowerWeight);
    const line=nodes.ridgeLine,weight=pose.shelterWeight,endX=68+(x+hand.x*actorScale-68)*weight,endY=-13+(rootY+hand.y*actorScale+13)*weight;setAttr(line,'d',`M38 7L${endX} ${endY}`);setAttr(line,'opacity',.25+.75*weight);
   }else if(id==='sage'){
    setStyle(actor._communityToolNodes.root,'display','none');
    if(frozen){setAttr(nodes.ridgeLine,'d','M38 7L68 -13');setAttr(nodes.ridgeLine,'opacity',model.routine==='shelter'?'1':'.25');}
   }
   const wrapper=nodes.wrappers[id];
   setAttr(wrapper,'transform',`translate(${x} ${rootY}) scale(${actorScale})`);
   globalThis.DeskCharacters.update(actor,{action,cycle:actorCycle,from,fromCycle:actorCycle,blend,rig,organic:frozen?0:.18,phase:organic});
   if(id==='sprout'){const stick=actor.querySelector('[data-play-stick]'),p=rig.prop;stick.style.display=p?.kind==='sand-stick'?'':'none';if(p)stick.setAttribute('d',`M${p.grip.x} ${p.grip.y}L${p.tip.x} ${p.tip.y}`);}
   setData(actor,'character',id);
  }
  const infant=nodes.infant,points=globalThis.DeskCharacters.infantSupportPoints;
  const rig=globalThis.DeskCharacters.pose('cradle-care',cycle),left=rig.arms[0][2],right=rig.arms[1][2];
  const centerX=(left.x+right.x)/2,centerY=(left.y+right.y)/2;
  setAttr(infant,'transform',`translate(${centerX-(points.head.x+points.body.x)/2} ${centerY-(points.head.y+points.body.y)/2})`);setData(infant,'support','aster-hands');setAttr(infant,'data-supported','true');
  setStyle(nodes.hearth,'opacity',model.routine==='cook'||model.routine==='care'&&model.elapsedSeconds>=20*3600?'1':'0.45');
 }
 globalThis.DeskHabitatCommunity=Object.freeze({sample,create,update,actorPose,family,schedule,frame,paintFrame});
})();
