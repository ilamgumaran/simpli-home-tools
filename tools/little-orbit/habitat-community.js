// SPDX-License-Identifier: LicenseRef-Simpli-Noncommercial-1.0
// Copyright (C) 2026 ilamgumaran and contributors
// A small authored family camp; calendar sampling has no persistent ecology.
(()=>{
 'use strict';
 const setAttr=(node,name,value)=>{value=String(value);if(node.getAttribute(name)!==value)node.setAttribute(name,value);};
 const setStyle=(node,name,value)=>{if(node.style[name]!==value)node.style[name]=value;};
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
  const transition={fromAction:previous.action,elapsed:sinceStart,blend:sinceStart>=.7?1:(sinceStart/.7)**2*(3-2*sinceStart/.7)};
  // Keep remembrance visible through dusk, even when the supplied clock jumps.
  const label=routine.id==='remember'?'Aster and Sage remember Fern':routine.label;
  return freeze({routine:routine.id,label,caption:routine.caption,phase:(hour/24)%1,dayCycle:hour/24,elapsedSeconds:hour*3600,night:isNight,weatherKind:['rain','snow','storm'].includes(weatherKind)?weatherKind:'clear',family,characters:freeze({aster:{action:'cradle-care'},sage:{action:routine.action},sprout:{action:isNight?'sleep':'play-sand',supervisedBy:'sage'},pebble:{action:isNight?'sleep':'rest',support:'aster'}}),transition,memorial:routine.id==='remember'?{for:'fern',kind:'flowers'}:null,claims:freeze({biologicalAging:false,deathOrRebirth:false,persistentEcosystem:false})});
 }
 function create(host){
  const doc=host.ownerDocument,ns='http://www.w3.org/2000/svg';
  const root=doc.createElementNS(ns,'g');root.setAttribute('data-layer','community-camp');host.appendChild(root);host._communityCamp=root;
  root.innerHTML='<g data-prop="shelter"><path d="M-57 8L-10 -43L39 8Z" fill="#c4a987" fill-opacity=".92" stroke="#594f46" stroke-width="2"/><path d="M-10 -43V8M-56 8H39" fill="none" stroke="#594f46" stroke-width="1.4"/><path d="M-43 7L-10 -32L26 7Z" fill="#6e7963"/><path data-prop="ridge-line" d="M38 7L68 -13" fill="none" stroke="#594f46" stroke-width="1.4"/></g><g data-prop="basket"><path d="M48 5H65L62 18H51Z" fill="#b89162" stroke="#594f46"/><path d="M50 5Q56 -8 64 5M52 9H63" fill="none" stroke="#594f46"/><path d="M52 4Q52 -3 56 1Q59 -5 61 2Q66 -3 64 4Z" fill="#91a47b" stroke="#53694e"/><circle cx="55" cy="2" r="1.3" fill="#bd7f70"/><circle cx="61" cy="0" r="1.4" fill="#d8bb72"/></g><g data-prop="cook-pot"><ellipse cx="70" cy="5" rx="9" ry="2.5" fill="#b3b7ae" stroke="#594f46"/><path d="M62 5Q62 15 70 15Q78 15 78 5" fill="#8d9990" stroke="#594f46"/><path d="M63 4H77" stroke="#594f46" stroke-width="1.5"/><path d="M68 2Q65 -2 69 -4M73 2Q76 -2 72 -5" fill="none" stroke="#e9d1a1" stroke-width="1" opacity=".8"/></g><g data-prop="seed-board"><path d="M56 -9H71V-1H56Z" fill="#d9c99f" stroke="#594f46"/><path d="M59 -6L61 -3M64 -7L66 -4M68 -6L69 -3" stroke="#82956e" stroke-width="1.3"/></g><g data-prop="memorial"><path d="M53 11Q57 -1 61 11M61 11Q66 -5 70 11M49 11Q53 1 56 11" fill="none" stroke="#ad788b" stroke-width="2.2" stroke-linecap="round"/><path d="M48 12H72" stroke="#6a604f" stroke-width="1.5"/><circle cx="61" cy="0" r="1.6" fill="#e4c678"/></g><g data-adult="aster"/><g data-adult="sage"/>';
  const a=doc.createElementNS(ns,'g'),b=doc.createElementNS(ns,'g');root.querySelector('[data-adult="aster"]').appendChild(a);root.querySelector('[data-adult="sage"]').appendChild(b);
  globalThis.DeskCharacters.mount(a,globalThis.DeskCharacters.create('aster',{role:'caregiver'}));globalThis.DeskCharacters.mount(b,globalThis.DeskCharacters.create('sage',{role:'caregiver'}));
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
  setAttr(nodes.ridgeLine,'opacity',model.routine==='shelter'?'1':'.25');
  setAttr(nodes.cookPot,'opacity',['cook','care'].includes(model.routine)?'1':'.72');
  setAttr(nodes.seedBoard,'opacity',model.routine==='teach'?'1':'.65');
  setAttr(nodes.canopy,'fill',['rain','storm'].includes(model.weatherKind)?'#687b78':model.weatherKind==='snow'?'#b9c9cc':'#c4a987');
  for(const node of Object.values(nodes.wrappers))setStyle(node,'display',companions?'':'none');
  if(!companions)return;
  const elapsed=model.elapsedSeconds||0,cycle=frozen?0:elapsed/6,organic=frozen?0:elapsed/120;
  for(const id of ['aster','sage','sprout']){
   const actor=root._communityActors[id],entry=model.characters[id],action=id==='aster'?'cradle-care':(frozen?'sleep':entry.action);
   const from=id==='sage'&&!frozen?model.transition.fromAction:action,blend=id==='sage'&&!frozen?model.transition.blend:1;
   const actorPose=globalThis.DeskCharacters.pose(action,cycle,{from,fromCycle:cycle,blend}),supportY=Math.max(...actorPose.legs.map(leg=>leg[2].y));
   const actorPx=id==='sprout'?38:id==='aster'?54:48,actorScale=actorPx/adultPx,x=id==='aster'?-8:id==='sage'?48:-68;
   const rootY=30-supportY*actorScale;
   if(id==='sage'&&!frozen){
    // The wrist solves against an actual camp socket. The spoon stays in the
    // pot, the gathering hand reaches the basket, and the shelter line meets
    // the hand rather than a nearby animated gesture.
    const cook=model.routine==='cook'||model.routine==='care'&&model.elapsedSeconds>=20*3600;
    const target=cook?{x:70,y:5}:model.routine==='shelter'?{x:68,y:-13}:model.routine==='teach'?{x:63,y:-3}:model.routine==='remember'?{x:61,y:11}:model.routine==='forage'||model.routine==='care'?{x:56,y:5}:null;
    if(cook){target.x+=Math.sin(cycle*Math.PI*2)*1.2;target.y+=Math.cos(cycle*Math.PI*2)*.6;}
    if(target){
     const length=cook?14:0,old=actorPose.arms[1][2],wrist={x:(target.x-x)/actorScale,y:(target.y-rootY)/actorScale-length};
     actorPose.arms[1]=DeskCharacters.joint(DeskCharacters.anatomy.shoulders[1],{x:old.x+(wrist.x-old.x)*blend,y:old.y+(wrist.y-old.y)*blend},12,11,-1);
     const hand=actorPose.arms[1][2],tip={x:hand.x,y:hand.y+length};
     let tool=actor.querySelector('[data-community-tool]');
     if(!tool){tool=host.ownerDocument.createElementNS('http://www.w3.org/2000/svg','g');tool.dataset.communityTool='';tool.innerHTML='<path data-camp-spoon stroke="#d8c08a" stroke-width="1.5" fill="none"/><ellipse data-camp-spoon-bowl rx="2" ry="2.5" fill="#d8c08a"/><path data-camp-greens d="M-3 1Q-7 -6 0 -3Q5 -8 5 -1L0 3Z" fill="#9cb877" stroke="#4a6b48"/><g data-camp-flower><path d="M0 0v-6" stroke="#91a772"/><circle cy="-6" r="2.5" fill="#d7a0ad"/><circle cy="-6" r="1" fill="#f0d793"/></g>';actor.append(tool);}
     tool.style.display='';tool.dataset.kind=cook?'spoon':model.routine==='remember'?'flower':model.routine==='forage'?'greens':'contact';
     tool.querySelector('[data-camp-spoon]').setAttribute('d',`M${hand.x} ${hand.y}L${tip.x} ${tip.y}`);tool.querySelector('[data-camp-spoon]').style.display=cook?'':'none';
     const bowl=tool.querySelector('[data-camp-spoon-bowl]');bowl.setAttribute('cx',tip.x);bowl.setAttribute('cy',tip.y);bowl.style.display=cook?'':'none';
     for(const [selector,shown] of [['[data-camp-greens]',model.routine==='forage'],['[data-camp-flower]',model.routine==='remember']]){const node=tool.querySelector(selector);node.setAttribute('transform',`translate(${hand.x} ${hand.y})`);node.style.display=shown?'':'none';}
     const line=nodes.ridgeLine;if(model.routine==='shelter')setAttr(line,'d',`M38 7L${x+hand.x*actorScale} ${rootY+hand.y*actorScale}`);
    }else{const tool=actor.querySelector('[data-community-tool]');if(tool)tool.style.display='none';}
   }else{const tool=actor.querySelector('[data-community-tool]');if(tool)tool.style.display='none';}
   const wrapper=nodes.wrappers[id];
   setAttr(wrapper,'transform',`translate(${x} ${rootY}) scale(${actorScale})`);
   globalThis.DeskCharacters.update(actor,{action,cycle,from,fromCycle:cycle,blend,rig:actorPose,organic:frozen?0:.18,phase:organic});
   if(id==='sprout'){const stick=actor.querySelector('[data-play-stick]'),p=actorPose.prop;stick.style.display=p?.kind==='sand-stick'?'':'none';if(p)stick.setAttribute('d',`M${p.grip.x} ${p.grip.y}L${p.tip.x} ${p.tip.y}`);}
   setData(actor,'character',id);
  }
  const infant=nodes.infant,points=globalThis.DeskCharacters.infantSupportPoints;
  const rig=globalThis.DeskCharacters.pose('cradle-care',cycle),left=rig.arms[0][2],right=rig.arms[1][2];
  const centerX=(left.x+right.x)/2,centerY=(left.y+right.y)/2;
  setAttr(infant,'transform',`translate(${centerX-(points.head.x+points.body.x)/2} ${centerY-(points.head.y+points.body.y)/2})`);setData(infant,'support','aster-hands');setAttr(infant,'data-supported','true');
  setStyle(nodes.hearth,'opacity',model.routine==='cook'||model.routine==='care'&&model.elapsedSeconds>=20*3600?'1':'0.45');
 }
 globalThis.DeskHabitatCommunity=Object.freeze({sample,create,update,family,schedule,frame,paintFrame});
})();
