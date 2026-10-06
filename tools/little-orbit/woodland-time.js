// SPDX-License-Identifier: LicenseRef-Simpli-Noncommercial-1.0
// Copyright (C) 2026 ilamgumaran and contributors
// The landscape states the time. Work celebrates each change; it never delays it.
(()=>{
 'use strict';
 const get=id=>document.getElementById(id),ns='http://www.w3.org/2000/svg';
 const scene=document.createElement('section');scene.id='woodland-scene';scene.hidden=true;
 scene.innerHTML=`<svg id="woodland-world" viewBox="0 0 800 360" preserveAspectRatio="none" xmlns="${ns}" role="img" aria-labelledby="woodland-title woodland-description">
 <title id="woodland-title">Woodland of Time</title><desc id="woodland-description"></desc>
 <rect id="woodland-sky" width="800" height="360"/><circle id="woodland-light" cx="705" cy="55" r="25" fill="#f4e2ac"/>
 <g id="woodland-background"/><path id="woodland-ground" d="M0 240Q180 220 360 241T800 231V360H0Z"/>
 <path id="woodland-creek" d="M800 240Q600 229 552 276T344 340L300 360H365Q470 320 570 304T800 270Z"/>
 <g id="woodland-details"/><g id="woodland-contact-face"/><g id="woodland-holds"/><g id="woodland-props"/><g id="woodland-work-sockets"/><path id="woodland-rope" fill="none" stroke="#ead6a8" stroke-width="1.6"/>
 <circle id="woodland-anchor" cx="58" cy="206" r="3" fill="#e3d4ab" stroke="#485844" stroke-width="1"/><g id="woodland-cast"></g><g id="woodland-hand-tool"/><g id="woodland-minute-marker"/>
 <g id="woodland-numerals" fill="none" stroke-linecap="round" stroke-linejoin="round"></g>
 <g id="woodland-colon" fill="#eaddb3" stroke="#485844" stroke-width="3"><circle cx="400" cy="99" r="5"/><circle cx="400" cy="144" r="5"/></g>
 <text x="263" y="232" text-anchor="middle" class="woodland-label">HOUR TRAILS</text><text x="540" y="232" text-anchor="middle" class="woodland-label">MINUTE TRAILS</text>
 </svg><div class="woodland-caption"><span id="woodland-place"></span><span id="woodland-action"></span></div><p id="woodland-story"></p>`;
 get('display').insertBefore(scene,get('display').querySelector('.fact-panel'));
 const motion=typeof matchMedia==='function'?matchMedia('(prefers-reduced-motion: reduce)'):null;
 let timer=null,frame=null,lastFrame=0,lastMinute='',lastTerrain='',lastCast='',sizing=false,lastFit='',lastClock='';
 let layout={width:800,height:360};
 const actors=[];
 // Small supported rock route, authored entirely within the foreground boulder.
 const rockRoute=DeskWorlds.routes.woodlandRock;
 const lead=m=>{const chosen=globalThis.ORBIT_CONFIG?.characters?.woodland;return Object.hasOwn(DeskCharacters.identities,chosen)&&!DeskCharacters.identities[chosen].young?chosen:m.story.cast[0];};
 const active=()=>prefs.theme==='woodland'&&prefs.display.woodlandView==='dashboard';
 const visible=()=>active()&&document.visibilityState==='visible'&&!get('settings').open&&!document.body.classList.contains('screen-rest');
 const attr=(id,name,value)=>get(id).setAttribute(name,value);
 const text=(id,value)=>{if(get(id).textContent!==value)get(id).textContent=value;};
 const markup=(id,value)=>{const el=get(id);if(el._art!==value){el.innerHTML=value;el._art=value;}};
 const ease=t=>{t=Math.max(0,Math.min(1,t));return t*t*t*(t*(t*6-15)+10);};
 const tree=(x,y,size,round=false)=>`<g transform="translate(${x} ${y}) scale(${size})"><g data-tree-shape><path d="M-5 0Q-1 -24 -4 -46L-2 -70H3Q1 -34 6 0Z" fill="#71634b"/><path d="M0 -34Q-8 -43 -19 -48M1 -25Q10 -31 21 -45" fill="none" stroke="#71634b" stroke-width="4" stroke-linecap="round"/><path d="M-2 -4Q2 -17 -1 -29M1 -36L0 -60M-3 -14L0 -19" fill="none" stroke="#b09b70" stroke-width="1.2"/><path d="M-2 -33q5 -5 4 1q-2 5 -4 -1" fill="none" stroke="#493f32" stroke-width="1"/>${round?'<path d="M-31 -46C-49 -67 -22 -92 -8 -83C2 -109 35 -89 27 -70C58 -57 32 -27 17 -36C-2 -20 -29 -24 -31 -46Z"/><path d="M-25 -59Q-20 -78 -5 -73M5 -84Q21 -83 20 -71" fill="none" stroke="#bac79b" stroke-width="2" opacity=".25"/>':'<path d="M0 -103Q-8 -82 -27 -61Q-18 -57 -13 -60Q-24 -40 -35 -27Q-17 -22 -11 -27Q-22 -13 -39 -7Q0 2 39 -7Q20 -17 13 -28Q24 -22 35 -27Q21 -42 15 -60Q22 -56 28 -61Q9 -79 0 -103Z"/>'}</g></g>`;
 const timber=(x,y,length=64,angle=0)=>`<g class="woodland-timber" transform="translate(${x} ${y}) rotate(${angle})"><path d="M0 -8Q${length/2} -11 ${length} -7V7Q${length/2} 10 0 8Z" fill="#796348" stroke="#504b38" stroke-width="1.2"/><path d="M6 -5Q${length/2} -8 ${length-3} -4M7 0Q${length/2} 4 ${length-4} 1M10 6Q${length/2} 2 ${length-3} 5" fill="none" stroke="#b49a6c" stroke-width="1"/><ellipse cx="${length*.62}" cy="-1" rx="5" ry="2.5" fill="none" stroke="#514a36"/><ellipse rx="7" ry="8" fill="#cfb884" stroke="#65573e"/><ellipse rx="4.5" ry="5.8" fill="none" stroke="#967b54"/><ellipse rx="2" ry="3" fill="none" stroke="#967b54"/><path d="M0 0L-5 5M1 -2L3 -7" stroke="#806946" stroke-width=".8"/></g>`;
 function fit(){
  if(!active()||sizing)return;
  const display=get('display'),signature=[innerWidth,innerHeight,display.getBoundingClientRect().top,getComputedStyle(display).gap,...['.clock-panel','.fact-panel','.weather-panel'].map(s=>display.querySelector(s).getBoundingClientRect().height)].join(':');
  if(signature===lastFit)return;lastFit=signature;sizing=true;scene.style.height='0px';
  const r=get('display').getBoundingClientRect(),padding=parseFloat(getComputedStyle(get('display')).paddingBottom)||0;
  const budget=Math.max(90,innerHeight-(r.height+Math.max(12,r.top)+padding)-14);
  scene.style.height=Math.min(innerWidth<600?260:470,budget)+'px';scene.classList.toggle('woodland-compact',budget<165);sizing=false;
  const world=get('woodland-world').getBoundingClientRect();layout={width:world.width,height:world.height};
  // Landscape fills the panel; the cast compensates its Y stretch to stay human.
  for(const {host,young} of actors){const size=characterSize(young);host.querySelector('.character-art').setAttribute('transform',`scale(${size.x} ${size.y})`);}
  compose();if(actors.length)draw();
 }
 function compose(){
  const r=layout;if(!r.width||!r.height)return;
  const ratio=(r.height/360)/(r.width/800),digitScale=Math.min(1.18,750/(419*ratio)),width=80*ratio*digitScale,gap=22*ratio*digitScale,colon=55*ratio*digitScale;
  const start=(800-(width*4+gap*2+colon))/2,slots=[start,start+width+gap,start+width*2+gap+colon,start+width*3+gap*2+colon];
  get('woodland-numerals').querySelectorAll('[data-index]').forEach((g,i)=>g.setAttribute('transform',`translate(${slots[i]} 46) scale(${ratio*digitScale} ${digitScale})`));
  get('woodland-colon').setAttribute('transform',`translate(400 0) scale(${ratio} 1) translate(-400 0)`);
  attr('woodland-light','transform',`translate(705 55) scale(${ratio} 1) translate(-705 -55)`);
  scene.querySelectorAll('[data-tree-shape]').forEach(g=>g.setAttribute('transform',`scale(${ratio} 1)`));
  scene.querySelectorAll('.woodland-label').forEach((label,i)=>{label.setAttribute('x',i===0?(slots[0]+slots[1]+width)/2:(slots[2]+slots[3]+width)/2);label.setAttribute('y','246');});
 }
 function characterSize(young=false){
  const r=layout,sx=r.width/800,sy=r.height/360;
  const pixels=Math.max(36,Math.min(80,r.height*.30))*(young?.73:1);
  return {x:pixels/(66*sx),y:pixels/(66*sy)};
 }
 function landscape(m){
  const p=m.place;
  attr('woodland-sky','fill',m.daylight?p.sky:'#344c50');attr('woodland-ground','fill',p.ground);attr('woodland-creek','fill',p.water);
  attr('woodland-light','fill',m.daylight?'#f4e2ac':'#e0e6d4');
  const ridge=65+m.hour%4*12;
  get('woodland-background').innerHTML=`<path d="M0 160C45 147 66 ${ridge-18} 111 ${ridge}S210 169 270 142S360 62 408 86S499 174 551 147S636 87 686 105S750 147 800 133V270H0Z" fill="${p.hill}"/><path d="M0 195C90 165 135 178 207 155S325 121 401 161S525 139 594 153S720 164 800 144V270H0Z" fill="${p.forest}" opacity=".22"/><path d="M34 167Q79 ${ridge+8} 114 ${ridge+14}T221 154M321 120Q376 70 414 101T510 163M606 134Q659 92 697 120" fill="none" stroke="#e4e5c8" stroke-width="2" opacity=".22"/><g fill="${p.forest}" opacity=".72">${Array.from({length:18},(_,i)=>tree(i*49-15,230,.45+(i+m.hour)%4*.11,(m.hour+i)%3===0)).join('')}</g>`;
  const landmarks=[
   timber(105,288,70,14),
   '<path d="M555 258q30 14 7 31m-5 -27q25 14 7 25m7 -15l-5 9" stroke="#d4e6d9" stroke-width="3" fill="none"/><path d="M541 285h17" stroke="#afba9c" stroke-width="9"/>',
   '<g fill="#456641">'+Array.from({length:6},(_,i)=>`<path d="M${125+i*16} 317q-18 -44 0 -27q18 -29 6 21Z"/>`).join('')+'</g>',
   '<path d="M657 319Q659 282 682 265Q700 249 719 279Q731 294 743 319Z" fill="#969b87" stroke="#62745f" stroke-width="3"/><path d="M681 267q23 15 11 46" fill="none" stroke="#bdc0a5" stroke-width="2"/>',
   '<g fill="#355b48">'+tree(128,277,.72)+tree(691,281,.92)+tree(732,280,.7)+'</g>',
   '<ellipse cx="618" cy="267" rx="118" ry="25" fill="#94bec4"/><path d="M610 263h70m-93 10h42" stroke="#c6dcd0" stroke-width="2"/><path d="M728 294v-22m7 24v-18m8 16v-19" stroke="#adab72" stroke-width="2"/>',
   '<g fill="#7c8954">'+tree(140,283,.76,true)+tree(673,277,.73,true)+'</g><g fill="#c5a263"><circle cx="130" cy="241" r="4"/><circle cx="150" cy="233" r="4"/><circle cx="675" cy="237" r="4"/><circle cx="660" cy="247" r="4"/></g>',
   '<path d="M155 290v22m53 -22v22" stroke="#6d5a42" stroke-width="7"/>'+timber(144,288,75)+'<path d="M699 291l22 -36l24 36Z" fill="#bba478" stroke="#665c42" stroke-width="2"/>'
  ];
  get('woodland-details').innerHTML=`<g fill="${p.forest}">${tree(58,260,1.4,m.hour%2===0)}${tree(758,256,1.5,m.hour%2!==0)}${tree(682,275,.9,true)}</g><path d="M17 331Q13 272 39 250Q69 214 86 246Q116 270 104 334Z" fill="#869180" stroke="#556654" stroke-width="3"/><path d="M31 290Q38 258 64 249M77 265Q100 290 93 319" fill="none" stroke="#bac1a6" stroke-width="2"/><g fill="#e2d7b6"><circle cx="493" cy="315" r="5"/><circle cx="516" cy="309" r="6"/><circle cx="539" cy="300" r="5"/></g><g fill="#5b7049"><path d="M145 340Q131 299 153 316Q167 300 167 335Z"/><path d="M636 334Q624 286 644 306Q665 295 658 335Z"/></g><g fill="#b16557"><circle cx="648" cy="312" r="3"/><circle cx="639" cy="316" r="3"/><circle cx="653" cy="321" r="3"/></g>${timber(187,325,33,-13)}${landmarks[m.hour%8]}`;
  get('woodland-place').textContent=p.name+' · '+m.period;
 }
 function numerals(m){
  // All four paths switch together. Never interpolate an old glyph into new time.
  get('woodland-numerals').innerHTML=[...m.digits].map((d,i)=>`<g data-digit="${d}" data-index="${i}" transform="translate(${[170,281,435,546][i]} 52)"><path class="woodland-trail-bed" d="${DeskWorlds.numerals[d]}" stroke="#43583f" stroke-width="22"/><path class="woodland-trail" d="${DeskWorlds.numerals[d]}" stroke="#ebd9aa" stroke-width="13"/><path d="${DeskWorlds.numerals[d]}" stroke="#bb9870" stroke-width="1" stroke-dasharray="2 7"/></g>`).join('');
  scene.dataset.time=m.time;scene.dataset.minute=m.minuteKey;
  get('woodland-title').textContent=`Woodland of Time · ${m.time} ${m.period}`;
 }
 function cast(m){
  const primary=lead(m);
  const ids=[...new Set([primary,...m.story.cast.slice(1).map(id=>id===primary?m.story.cast[0]:id)])];
  get('woodland-cast').replaceChildren();actors.length=0;
  ids.forEach((id,i)=>{
   const host=document.createElementNS(ns,'g');host.dataset.castIndex=i;
   const character=DeskCharacters.create(id,{role:i===0?m.action.role:'trail'});
   DeskCharacters.mount(host,character);get('woodland-cast').append(host);actors.push({host,character,young:id==='sprout'});
  });
 }
 function props(m,p){
  const grow=p.running?Math.max(.15,p.progress):1;
  const tent=`<path d="M283 326L315 ${326-46*grow}L358 326Z" fill="#cbad76" stroke="#665c42" stroke-width="2"/><path d="M308 326L315 ${326-38*grow}L329 326Z" fill="#655f47"/><path d="M275 329H365" stroke="#dace9c" stroke-width="3"/>`;
  const hearth=`<g fill="#c2c2a8" stroke="#657261">${[0,1,2,3,4,5].map(i=>`<ellipse cx="${338+Math.cos(i*Math.PI/3)*18}" cy="${321+Math.sin(i*Math.PI/3)*5}" rx="5" ry="3"/>`).join('')}</g><path d="M331 319Q325 309 337 ${300+(p.running?Math.sin(m.second*3)*3:0)}Q339 310 346 307Q355 320 331 319Z" fill="#e2b263"/><path d="M337 320Q333 314 338 309Q348 319 337 320Z" fill="#eed69c"/>`;
  const types={
   survey:'<path d="M299 304l10 -3l8 3v15l-8 -3l-10 3Z" fill="#e6d7ad" stroke="#665c42"/>',
   sticks:timber(303,324,34,-13)+timber(310,313,25,33),
   shelter:tent,
   water:'<path d="M563 294v15h14v-15Z" fill="#8ec1c5" stroke="#45666a"/><path d="M565 289h10v5h-10Z" fill="#d2d6ae"/><path d="M559 277h21l-7 10h-7Z" fill="#dacead" stroke="#45666a"/><path d="M570 287v5" stroke="#d4ece6" stroke-width="2"/>',
   forage:'<path d="M596 315h27l-4 15h-19Z" fill="#c0a576" stroke="#665c42"/><path d="M600 315q9 -14 19 0" fill="none" stroke="#665c42"/><g fill="#af6651"><circle cx="605" cy="317" r="3"/><circle cx="614" cy="316" r="3"/></g>',
   tree:'<path d="M48 242h25m-35 22h24m-28 23h25" stroke="#c5c4a2" stroke-width="3"/>',
   rock:'<path d="M38 262h15m-18 20h15m-17 18h15" stroke="#c5c4a2" stroke-width="3"/>',
   fire:hearth,
   cook:hearth+'<path d="M326 307h25v9q-12 9 -25 0Z" fill="#546865" stroke="#d3d6b8"/><path d="M322 306h33" stroke="#d3d6b8" stroke-width="3"/><path d="M333 291q-6 -5 0 -10m12 11q-6 -5 0 -10" fill="none" stroke="#dde2cb" opacity=".7"/>',
   bridge:`<g transform="translate(476 306) rotate(-18)"><path d="M0 0h93M0 14h93" stroke="#665c42" stroke-width="4"/>${Array.from({length:Math.max(1,Math.ceil(8*grow))},(_,i)=>`<g transform="translate(${i*12} -3)"><rect x="-4" width="9" height="21" rx="1" fill="#c7ae79" stroke="#705d43"/><path d="M-1 2q3 5 0 9t1 7M2 3v5" fill="none" stroke="#94734f" stroke-width=".7"/><ellipse cy="13" rx="1.5" ry="2" fill="none" stroke="#806341"/><path d="M-2 2h1m2 17h1" stroke="#46594e" stroke-width="1.5"/></g>`).join('')}</g>`,
   rest:'<path d="M284 331q17 -17 40 0Z" fill="#c1c0a0"/><path d="M336 326h13v-15h-13Z" fill="#8ec1c5"/>',
   teach:'<path d="M299 309l14 -3l15 3v19l-15 -4l-14 4Z" fill="#e6d7ad" stroke="#665c42"/><path d="M304 318q9 -12 18 3" fill="none" stroke="#71885f" stroke-width="2"/>'
  };
  markup('woodland-props',types[m.actionId]+(m.actionId==='tree'?'<path d="M42 300h31M42 267h31" stroke="#c4c2a1" stroke-width="4"/>':''));
 }
 // Project the shared contact rig into the responsive scene, preserving anatomy.
 function activity(m,p,size){
  let rig=null,origin=null,pose=p.pose,socket=null,kind='';
  let envelope=p.running?16*p.progress*p.progress*(1-p.progress)*(1-p.progress):0;
  if(m.action.role==='climbing')envelope*=p.progress<.34?ease((.34-p.progress)/.03):ease((p.progress-.5)/.03);
  if(m.hour>=6&&m.actionId==='rock'){
   origin=rockRoute.stations[0].root;kind='rock';rig=DeskCharacters.climbContacts(rockRoute,p.climb,{resting:p.phase==='recover'||!p.running});
  }else if(m.hour>=6&&m.actionId==='survey'){
   origin=DeskWorlds.routes.woodlandWalk.origin;kind='walk';
   pose=p.running&&p.progress<.4?'read-map':p.running&&p.progress<.9?'walk':'rest';
   rig=DeskCharacters.walkContacts(DeskWorlds.routes.woodlandWalk,ease(p.running?(p.progress-.4)/.5:1),{action:pose});
   const amount=p.running&&p.progress>=.4&&p.progress<.45?ease((p.progress-.4)/.05):1;
   if(amount<1)rig={...rig,arms:blendRig(DeskCharacters.pose('read-map',0),rig,amount).arms};
   if(p.running&&p.progress>=.85){const amount=ease((p.progress-.85)/.05);rig={...rig,arms:blendRig(rig,DeskCharacters.pose('rest',0),amount).arms};}
  }else if(m.hour>=6&&['sticks','cook','shelter','bridge'].includes(m.actionId)){
   const work={sticks:{root:{x:299,y:303},x:303,y:319},cook:{root:{x:326,y:300},x:339,y:309},shelter:{root:{x:299,y:300},x:313,y:311},bridge:{root:{x:465,y:300},x:479,y:311}}[m.actionId];
   origin=work.root;kind='work';pose=m.action.pose;
   socket={x:work.x+(m.actionId==='sticks'?0:Math.sin(p.progress*6*Math.PI)*2*envelope),y:work.y};
   rig=DeskCharacters.workContacts({root:origin,scale:.72,groundY:318.72,work:socket,hand:m.actionId==='sticks'?0:1,action:pose,cycle:p.running?p.progress*3:0,sway:envelope,angle:Math.PI/2+Math.sin(p.progress*6*Math.PI)*.12*envelope});
  }
  const ground=Math.min(origin?.y||300,360-35*size.y-4/(layout.height/360));
  const project=point=>({x:origin.x+(point.x-origin.x)*size.x/.72,y:ground+(point.y-origin.y)*size.y/.72});
  const root=rig?project(rig.root):DeskWorlds.worksite(m,p.progress,p.climb);
  if(!rig)root.y=Math.min(m.hour<6?300:root.y,360-35*size.y-4/(layout.height/360));
  const transform=origin?`translate(${origin.x} ${ground}) scale(${size.x/.72} ${size.y/.72}) translate(${-origin.x} ${-origin.y})`:'';
  return {rig,root,pose,kind,project,socket,transform,envelope};
 }
 function blendRig(a,b,t){
  const solve=(kind,roots,lengths,bends)=>a[kind].map((limb,i)=>{const end=b[kind][i][2],start=limb[2];return DeskCharacters.joint(roots[i],{x:start.x+(end.x-start.x)*t,y:start.y+(end.y-start.y)*t},...lengths,bends[i]);});
  return {...b,arms:solve('arms',DeskCharacters.anatomy.shoulders,[12,11],[1,-1]),legs:solve('legs',DeskCharacters.anatomy.hips,[12,12],[-1,1])};
 }
 function timing(date=new Date(),quiet=false){
  const m=DeskWorlds.woodland(date,{format24:prefs.format24}),size=characterSize();
  const previous=DeskWorlds.woodland(new Date(date.getTime()-m.second*1000-1),{format24:prefs.format24});
  const final=model=>DeskWorlds.motionTiming(model,{reducedMotion:true});
  const prior=activity(previous,final(previous),size),initial=activity(m,{...final(m),running:true,progress:0,climb:0,phase:'work',pose:m.action.pose},size);
  const distance=Math.hypot((initial.root.x-prior.root.x)/size.x,(initial.root.y-prior.root.y)/size.y);
  const interval=prefs.display.companionInterval||60;
  const returning=m.second>=interval;
  const source=returning?activity(m,final(m),size):prior;
  const span=returning?Math.hypot((initial.root.x-source.root.x)/size.x,(initial.root.y-source.root.y)/size.y):distance;
  // Keep the chapter's arrival pace stable for repeated bouts, so changing
  // worksite distance cannot move the start of a later visit under our feet.
  const p=DeskWorlds.motionTiming(m,{distance:Math.max(distance,span),duration:prefs.display.companionDuration,interval,reducedMotion:quiet});
  return {...p,m,previous,size,source,initial};
 }
 function travelRig(source,target,size,elapsed,duration){
  const amount=DeskWorlds.travelProgress(elapsed,duration),dx=(target.x-source.x)/size.x,dy=(target.y-source.y)/size.y;
  const position={x:source.x+(target.x-source.x)*amount,y:source.y+(target.y-source.y)*amount};
  if(Math.abs(dx)<10||Math.abs(dy/dx)>.65)return {position,rig:DeskCharacters.pose(Math.abs(dx)<10&&dy>0?'rappel':'walk',amount*Math.hypot(dx,dy)/18)};
  const grade=dy/dx,stride=14-5*Math.min(1,Math.abs(grade)/.25),steps=Math.max(1,Math.ceil(Math.abs(dx)/stride)),sign=Math.sign(dx);
  const gait=DeskCharacters.walkContacts({scale:1,origin:{x:0,y:0},groundY:26,steps,stride:Math.abs(dx)/steps},amount);
  const bob=gait.root.y*ease(elapsed/.35)*ease((duration-elapsed)/.45);position.y+=bob*size.y;
  const solve=(kind,roots,lengths,bends)=>roots.map((root,i)=>{
   const point=gait[kind][sign<0?1-i:i][2],x=point.x*sign;
   const y=kind==='legs'?point.y+gait.root.y-bob+grade*x:point.y;
   return DeskCharacters.joint(root,{x,y},...lengths,bends[i]);
  });
  return {position,rig:{...gait,arms:solve('arms',DeskCharacters.anatomy.shoulders,[12,11],[1,-1]),legs:solve('legs',DeskCharacters.anatomy.hips,[12,12],[-1,1])}};
 }
 function draw(){
  if(!active())return;
  const now=new Date(),m=DeskWorlds.woodland(now,{format24:prefs.format24});
  const clockKey=Math.floor(now.getTime()/1000)+':'+prefs.format24;if(clockKey!==lastClock){renderClockTime(now);lastClock=clockKey;}
  const quiet=prefs.display.companion===false||motion?.matches||typeof requestAnimationFrame!=='function';
  const p=timing(now,quiet),{previous,size,source}=p;
  const minuteKey=m.minuteKey+':'+m.time+':'+m.period,terrainKey=m.terrainKey+':'+m.daylight+':'+m.period,castKey=m.story.id+':'+m.action.role+':'+lead(m);
  const changed=terrainKey!==lastTerrain||minuteKey!==lastMinute||castKey!==lastCast;
  if(terrainKey!==lastTerrain){landscape(m);lastTerrain=terrainKey;}
  if(minuteKey!==lastMinute){numerals(m);lastMinute=minuteKey;}
  if(castKey!==lastCast){cast(m);lastCast=castKey;}
  if(changed)compose();
  const companions=prefs.display.companion!==false;
  scene.dataset.action=m.actionId;scene.dataset.phase=p.phase;scene.dataset.story=m.story.id;scene.dataset.terrain=m.terrainKey;
  const activityLabel=m.hour<6?'The camp rests':m.actionId==='cook'&&actors.length===1?'Cooking a quiet meal':m.actionId==='teach'&&actors.length===1?'Reading a lesson in the trail':m.action.label;
  text('woodland-action',p.phase==='mark'?'Laying the new minute trail':p.phase==='recover'?'Resting before the next hold':activityLabel);
  const caption=m.caption.split(DeskCharacters.identities[m.story.cast[0]].name).join(DeskCharacters.identities[lead(m)].name);
  text('woodland-story',caption+' '+m.philosophy);
  text('woodland-description',`${m.time} ${m.period}. ${m.place.name}. ${caption} ${activityLabel}. ${m.philosophy}`);
  props(m,p);
  const sample=activity(m,p,size),visit=m.second-p.visitStart;
  const journey=travelRig(source.root,p.initial.root,size,p.elapsed,p.travel);
  const rappel=p.traveling&&Math.abs(p.initial.root.x-source.root.x)<1&&p.initial.root.y>source.root.y;
  const b={position:p.traveling?journey.position:sample.root,moving:p.traveling,travel:p.travel,elapsed:p.elapsed,cycle:p.progress*3,action:p.traveling?(rappel?'rappel':'walk'):p.pose,from:null,fromCycle:0,blend:1,settling:false};
  if(!sample.rig&&p.running){
   const boundary=p.progress<.34?0:p.progress<.5?.34:p.progress<.94?.5:.94;
   b.from=boundary===.34?'climb':boundary===.5?'recover-climb':boundary===.94?m.action.pose:null;
   b.fromCycle=boundary*3;b.blend=ease((p.progress-boundary)/.03);
   if(m.action.role!=='climbing'&&boundary>0)b.from=null;
   if(p.progress>=.94)b.action=m.action.role==='climbing'?'recover-climb':'rest';
  }
  const climb=m.action.role==='climbing'&&m.hour>=6,marker=m.second<3&&!quiet&&m.hour>=6&&companions;
  const secured=sample.kind==='rock'&&!b.moving;
  const top=sample.kind==='rock'?Math.min(...rockRoute.stations.map(s=>sample.project(s.leftHand).y))-14:0;
  markup('woodland-contact-face',sample.kind==='rock'?`<path d="M17 340Q17 ${top+18} 46 ${top}Q69 ${top-15} 92 ${top+18}Q109 ${top+39} 107 340Z" fill="#869180" stroke="#556654" stroke-width="3"/><path d="M30 ${top+57}Q39 ${top+20} 65 ${top+13}M84 ${top+31}Q100 ${top+53} 93 ${top+82}" fill="none" stroke="#bac1a6" stroke-width="2"/>`:'');
  const protectionAnchor=sample.kind==='rock'?sample.project(rockRoute.anchor):{x:58,y:206};
  attr('woodland-anchor','cx',protectionAnchor.x);attr('woodland-anchor','cy',protectionAnchor.y);
  markup('woodland-holds',secured?rockRoute.stations.flatMap(station=>['leftHand','leftFoot','rightHand','rightFoot'].map(name=>{const hold=station[name],point=sample.project(hold);return `<path data-hold="${hold.id}" d="M${point.x-2.5} ${point.y}h5" fill="none" stroke="#d2d2b4" stroke-width="1.7" stroke-linecap="round"/>`;})).join(''):'');
  if(sample.kind==='walk'){
   const left=sample.project({x:270,y:318.72}),right=sample.project({x:390,y:318.72});
   markup('woodland-work-sockets',`<path id="woodland-walk-ground" d="M${left.x} ${left.y}H${right.x}" fill="none" stroke="#bbaa7a" stroke-width="1.5"/>`);
  }else if(sample.kind==='work'){
   markup('woodland-work-sockets','<circle id="woodland-work-target" r="1.5" fill="#dac897"/>');const point=sample.project(sample.socket);attr('woodland-work-target','cx',point.x);attr('woodland-work-target','cy',point.y);
  }else markup('woodland-work-sockets','');
  attr('woodland-props','transform',sample.kind==='work'?sample.transform:'');
  const lastTrail=get('woodland-numerals').querySelector('[data-index="3"] .woodland-trail');
  const joint=lastTrail.getPointAtLength(lastTrail.getTotalLength()*.95),jointMatrix=get('woodland-world').getCTM().inverse().multiply(lastTrail.getCTM());
  const trailJoint={x:jointMatrix.a*joint.x+jointMatrix.c*joint.y+jointMatrix.e,y:jointMatrix.b*joint.x+jointMatrix.d*joint.y+jointMatrix.f},primary=b.position;
  const travelPose=b.moving?blendRig(source.rig||DeskCharacters.pose(m.second>=prefs.display.companionInterval?m.action.role==='climbing'?'recover-climb':'rest':previous.hour<6?'sleep':previous.action.role==='climbing'?'recover-climb':'rest',0),journey.rig,ease(b.elapsed/.35)):DeskCharacters.pose(b.action,b.cycle,b);
  let leadPose=null;
  actors.forEach(({host,young},i)=>{
   const scale=characterSize(young),pos=i===0?primary:{x:360+i*55,y:Math.min(young?311:300,360-35*scale.y-4/(layout.height/360))};
   host.setAttribute('transform',`translate(${pos.x.toFixed(3)} ${pos.y.toFixed(3)})`);
   host.querySelector('.character-art').setAttribute('transform',`scale(${scale.x} ${scale.y})`);
   let rig=i===0?sample.rig:null;
   if(i===0&&b.moving)rig=blendRig(travelPose,rig||DeskCharacters.pose(m.action.pose,0),ease((b.elapsed-b.travel+.45)/.45));
   const secondary=model=>model.hour<6?'sleep':model.actionId==='teach'?'listen':model.reflection?'rest':'camp';
   let pose=m.hour<6?'sleep':i===0?(b.moving?b.action:rig?sample.pose:b.action):secondary(m);
   let from=i===0?b.from:secondary(previous),fromCycle=i===0?b.fromCycle:.7,blend=i===0?b.blend:ease(Math.min(m.second,visit)/.6);
   if(m.hour>=6&&m.actionId==='teach'&&p.running){
    const turn=Math.floor(p.progress*4),talk=index=>((index%2===0)===(i===0))?'teach':'listen';
    pose=talk(turn);from=turn?talk(turn-1):i===0?'teach':'listen';fromCycle=turn*.75;blend=ease((p.progress-turn/4)/.06);
    if(p.progress>=.94){from=talk(turn);fromCycle=p.progress*3;pose=i===0?'rest':'listen';blend=ease((p.progress-.94)/.06);}
   }
   const anchor={x:(protectionAnchor.x-pos.x)/scale.x,y:(protectionAnchor.y-pos.y)/scale.y};
   host.dataset.contactHolds=secured&&i===0?JSON.stringify(sample.rig.holds):'';host.dataset.movingLimb=rig?.moving||'';
   host.dataset.groundContacts=sample.kind==='walk'&&!b.moving&&i===0?JSON.stringify(Object.fromEntries(Object.entries(rig.holds).map(([key,point])=>[key,point?sample.project(point):null]))):'';
   const result=DeskCharacters.update(host,{action:pose,cycle:m.actionId==='teach'&&p.running?p.progress*3:i===0?b.cycle:p.running?p.progress*.7:.7,from,fromCycle,blend,fatigue:i===0?p.fatigue:0,assisted:i===0&&p.assisted,item:m.actionId==='water'?'water':m.actionId==='cook'?'food':null,ropeAnchor:anchor,rig,organic:quiet||p.phase==='recover'?0:sample.envelope,phase:(now.getTime()%60000)/1000+i*.7});
   if(i===0)leadPose=result;
  });
  get('woodland-cast').style.display=companions?'':'none';
  const a=DeskCharacters.anatomy.belayLoop;
  attr('woodland-rope','d',`M${protectionAnchor.x} ${protectionAnchor.y}L${primary.x+a.x*size.x} ${primary.y+a.y*size.y}`);get('woodland-rope').style.display=companions&&climb&&(!b.moving||b.action==='rappel')?'':'none';get('woodland-anchor').style.display=get('woodland-rope').style.display;
  let tool='';
  if(companions&&sample.kind==='work'&&!b.moving&&m.actionId!=='cook'){
   const grip=DeskCharacters.toolGrip(leadPose.arms[leadPose.toolHand][2],leadPose.toolTarget);
   tool=`<g data-tool="${m.actionId==='sticks'?'fallen-stick':'mallet'}" transform="translate(${primary.x} ${primary.y}) scale(${size.x} ${size.y})"><g transform="translate(${grip.x} ${grip.y}) rotate(${grip.angle})"><path id="woodland-stick-grip" d="M0 0H14" stroke="#d8bc83" stroke-width="3" stroke-linecap="round"/>${m.actionId==='sticks'?'':'<path d="M14 -4V4" stroke="#718077" stroke-width="5" stroke-linecap="round"/>'}</g></g>`;
  }
  markup('woodland-hand-tool',tool);
  markup('woodland-minute-marker',marker?`<g transform="translate(${trailJoint.x} ${trailJoint.y})"><path d="M0 4v12m-5 -8h10" stroke="#eedbad" stroke-width="3"/><circle cy="4" r="3" fill="#8a7150"/></g>`:'');

  // Planned wakeups respect low power: frames exist only inside bounded visits.
  return visible()&&companions&&(p.running||b.moving||b.settling);
 }
 function stop(){clearTimeout(timer);timer=null;if(frame!==null)cancelAnimationFrame(frame);frame=null;}
 function loop(now){
  frame=null;if(!visible())return;
  const period=1000/30;
  if(prefs.lowPower&&now-lastFrame<period-.75){frame=requestAnimationFrame(loop);return;}
  lastFrame=prefs.lowPower&&now-lastFrame<250?lastFrame+Math.max(1,Math.floor((now-lastFrame+.75)/period))*period:now;
  if(draw())frame=requestAnimationFrame(loop);
 }
 function schedule(){
  clearTimeout(timer);if(!visible())return;
  const now=new Date(),at=now.getTime(),second=now.getSeconds()+now.getMilliseconds()/1000;
  const interval=prefs.display.companionInterval||60,nextVisit=interval-second%interval;
  const delay=Math.min(60000-at%60000,nextVisit*1000);
  timer=setTimeout(sync,Math.max(1,Math.ceil(delay)));
 }
 function sync(){
  stop();scene.hidden=!active();if(!active())return;
  fit();const animate=draw();if(!visible())return;
  schedule();if(animate)frame=requestAnimationFrame(loop);
 }
 function refresh(){lastTerrain='';lastMinute='';lastCast='';lastFit='';sync();}
 document.addEventListener('visibilitychange',sync);get('settings').addEventListener('close',sync);
 new MutationObserver(sync).observe(get('settings'),{attributes:true,attributeFilter:['open']});
 window.addEventListener('resize',sync);window.addEventListener('desk-display-change',sync);motion?.addEventListener?.('change',sync);
 if(typeof ResizeObserver==='function'){const observer=new ResizeObserver(()=>{if(active())fit();});for(const selector of ['.clock-panel','.fact-panel','.weather-panel'])observer.observe(get('display').querySelector(selector));}
 window.WoodlandTime={sync,refresh,model:DeskWorlds.woodland,timing,rockRoute,get running(){return frame!==null;},get pending(){return timer!==null;}};sync();
})();
