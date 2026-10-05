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
 <g id="woodland-details"/><g id="woodland-holds"/><g id="woodland-props"/><g id="woodland-work-sockets"/><path id="woodland-rope" fill="none" stroke="#ead6a8" stroke-width="1.6"/>
 <circle id="woodland-anchor" cx="58" cy="206" r="3" fill="#e3d4ab" stroke="#485844" stroke-width="1"/><g id="woodland-cast"></g><g id="woodland-hand-tool"/><g id="woodland-minute-marker"/>
 <g id="woodland-numerals" fill="none" stroke-linecap="round" stroke-linejoin="round"></g>
 <g id="woodland-colon" fill="#eaddb3" stroke="#485844" stroke-width="3"><circle cx="400" cy="99" r="5"/><circle cx="400" cy="144" r="5"/></g>
 <text x="263" y="232" text-anchor="middle" class="woodland-label">HOUR TRAILS</text><text x="540" y="232" text-anchor="middle" class="woodland-label">MINUTE TRAILS</text>
 </svg><div class="woodland-caption"><span id="woodland-place"></span><span id="woodland-action"></span></div><p id="woodland-story"></p>`;
 get('display').insertBefore(scene,get('display').querySelector('.fact-panel'));
 const motion=typeof matchMedia==='function'?matchMedia('(prefers-reduced-motion: reduce)'):null;
 let timer=null,frame=null,lastFrame=0,lastMinute='',lastTerrain='',lastCast='',sizing=false;
 const actors=[];
 // Small supported rock route, authored entirely within the foreground boulder.
 const rockRoute=DeskWorlds.routes.woodlandRock;
 const lead=m=>{const chosen=globalThis.ORBIT_CONFIG?.characters?.woodland;return Object.hasOwn(DeskCharacters.identities,chosen)&&!DeskCharacters.identities[chosen].young?chosen:m.story.cast[0];};
 const active=()=>prefs.theme==='woodland';
 const visible=()=>active()&&document.visibilityState==='visible'&&!get('settings').open&&!document.body.classList.contains('screen-rest');
 const attr=(id,name,value)=>get(id).setAttribute(name,value);
 const tree=(x,y,size,round=false)=>`<g transform="translate(${x} ${y}) scale(${size})"><g data-tree-shape><path d="M-5 0Q-1 -24 -4 -46L-2 -70H3Q1 -34 6 0Z" fill="#71634b"/><path d="M0 -34Q-8 -43 -19 -48M1 -25Q10 -31 21 -45" fill="none" stroke="#71634b" stroke-width="4" stroke-linecap="round"/><path d="M-2 -4Q2 -17 -1 -29M1 -36L0 -60M-3 -14L0 -19" fill="none" stroke="#b09b70" stroke-width="1.2"/><path d="M-2 -33q5 -5 4 1q-2 5 -4 -1" fill="none" stroke="#493f32" stroke-width="1"/>${round?'<path d="M-31 -46C-49 -67 -22 -92 -8 -83C2 -109 35 -89 27 -70C58 -57 32 -27 17 -36C-2 -20 -29 -24 -31 -46Z"/><path d="M-25 -59Q-20 -78 -5 -73M5 -84Q21 -83 20 -71" fill="none" stroke="#bac79b" stroke-width="2" opacity=".25"/>':'<path d="M0 -103Q-8 -82 -27 -61Q-18 -57 -13 -60Q-24 -40 -35 -27Q-17 -22 -11 -27Q-22 -13 -39 -7Q0 2 39 -7Q20 -17 13 -28Q24 -22 35 -27Q21 -42 15 -60Q22 -56 28 -61Q9 -79 0 -103Z"/>'}</g></g>`;
 const timber=(x,y,length=64,angle=0)=>`<g class="woodland-timber" transform="translate(${x} ${y}) rotate(${angle})"><path d="M0 -8Q${length/2} -11 ${length} -7V7Q${length/2} 10 0 8Z" fill="#796348" stroke="#504b38" stroke-width="1.2"/><path d="M6 -5Q${length/2} -8 ${length-3} -4M7 0Q${length/2} 4 ${length-4} 1M10 6Q${length/2} 2 ${length-3} 5" fill="none" stroke="#b49a6c" stroke-width="1"/><ellipse cx="${length*.62}" cy="-1" rx="5" ry="2.5" fill="none" stroke="#514a36"/><ellipse rx="7" ry="8" fill="#cfb884" stroke="#65573e"/><ellipse rx="4.5" ry="5.8" fill="none" stroke="#967b54"/><ellipse rx="2" ry="3" fill="none" stroke="#967b54"/><path d="M0 0L-5 5M1 -2L3 -7" stroke="#806946" stroke-width=".8"/></g>`;
 function fit(){
  if(!active()||sizing)return;sizing=true;scene.style.height='0px';
  const r=get('display').getBoundingClientRect(),padding=parseFloat(getComputedStyle(get('display')).paddingBottom)||0;
  const budget=Math.max(90,innerHeight-(r.height+Math.max(12,r.top)+padding)-14);
  scene.style.height=Math.min(innerWidth<600?260:470,budget)+'px';scene.classList.toggle('woodland-compact',budget<165);sizing=false;
  // Landscape fills the panel; the cast compensates its Y stretch to stay human.
  // Rendering owns actor/site transforms together; resizing must not apply scale twice.
  compose();draw();
 }
 function compose(){
  const r=get('woodland-world').getBoundingClientRect();if(!r.width||!r.height)return;
  const ratio=(r.height/360)/(r.width/800),digitScale=Math.min(1.18,750/(419*ratio)),width=80*ratio*digitScale,gap=22*ratio*digitScale,colon=55*ratio*digitScale;
  const start=(800-(width*4+gap*2+colon))/2,slots=[start,start+width+gap,start+width*2+gap+colon,start+width*3+gap*2+colon];
  get('woodland-numerals').querySelectorAll('[data-index]').forEach((g,i)=>g.setAttribute('transform',`translate(${slots[i]} 46) scale(${ratio*digitScale} ${digitScale})`));
  get('woodland-colon').setAttribute('transform',`translate(400 0) scale(${ratio} 1) translate(-400 0)`);
  attr('woodland-light','transform',`translate(705 55) scale(${ratio} 1) translate(-705 -55)`);
  scene.querySelectorAll('[data-tree-shape]').forEach(g=>g.setAttribute('transform',`scale(${ratio} 1)`));
  scene.querySelectorAll('.woodland-label').forEach((label,i)=>{label.setAttribute('x',i===0?(slots[0]+slots[1]+width)/2:(slots[2]+slots[3]+width)/2);label.setAttribute('y','246');});
 }
 function characterSize(young=false){
  const r=get('woodland-world').getBoundingClientRect(),sx=r.width/800,sy=r.height/360;
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
  get('woodland-details').innerHTML=`<g fill="${p.forest}">${tree(58,260,1.4,m.hour%2===0)}${tree(758,256,1.5,m.hour%2!==0)}${tree(682,275,.9,true)}</g><g id="woodland-contact-boulder"><path d="M17 331Q13 272 39 250Q69 214 86 246Q116 270 104 334Z" fill="#869180" stroke="#556654" stroke-width="3"/><path d="M31 290Q38 258 64 249M77 265Q100 290 93 319" fill="none" stroke="#bac1a6" stroke-width="2"/></g><g fill="#e2d7b6"><circle cx="493" cy="315" r="5"/><circle cx="516" cy="309" r="6"/><circle cx="539" cy="300" r="5"/></g><g fill="#5b7049"><path d="M145 340Q131 299 153 316Q167 300 167 335Z"/><path d="M636 334Q624 286 644 306Q665 295 658 335Z"/></g><g fill="#b16557"><circle cx="648" cy="312" r="3"/><circle cx="639" cy="316" r="3"/><circle cx="653" cy="321" r="3"/></g>${timber(187,325,33,-13)}${landmarks[m.hour%8]}`;
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
  get('woodland-props').innerHTML=types[m.actionId]+(m.actionId==='tree'?'<path d="M42 300h31M42 267h31" stroke="#c4c2a1" stroke-width="4"/>':'');
 }
 function draw(){
  if(!active())return;
  const now=new Date(),m=DeskWorlds.woodland(now,{format24:prefs.format24});
  renderClockTime(now);
  const quiet=prefs.display.companion===false||motion?.matches||typeof requestAnimationFrame!=='function';
  const p=DeskWorlds.performance(m,{duration:prefs.display.companionDuration,interval:prefs.display.companionInterval,reducedMotion:quiet});
  const minuteKey=m.minuteKey+':'+m.time+':'+m.period,terrainKey=m.terrainKey+':'+m.daylight+':'+m.period,castKey=m.story.id+':'+m.action.role+':'+lead(m);
  if(terrainKey!==lastTerrain){landscape(m);lastTerrain=terrainKey;}
  if(minuteKey!==lastMinute){numerals(m);lastMinute=minuteKey;}
  if(castKey!==lastCast){cast(m);lastCast=castKey;}
  compose();
  const companions=prefs.display.companion!==false;
  scene.dataset.action=m.actionId;scene.dataset.phase=p.phase;scene.dataset.story=m.story.id;scene.dataset.terrain=m.terrainKey;
  const activityLabel=m.hour<6?'The camp rests':m.actionId==='cook'&&actors.length===1?'Cooking a quiet meal':m.actionId==='teach'&&actors.length===1?'Reading a lesson in the trail':m.action.label;
  get('woodland-action').textContent=(p.phase==='mark'?'Laying the new minute trail':p.phase==='recover'?'Resting before the next hold':activityLabel);
  const caption=m.caption.split(DeskCharacters.identities[m.story.cast[0]].name).join(DeskCharacters.identities[lead(m)].name);
  get('woodland-story').textContent=caption+' '+m.philosophy;
  get('woodland-description').textContent=`${m.time} ${m.period}. ${m.place.name}. ${caption} ${activityLabel}. ${m.philosophy}`;
  props(m,p);
  const contactMap=(model,q)=>{const z=characterSize(),x=model.actionId==='rock'?57:model.actionId==='survey'?280:model.actionId==='cook'?326:model.actionId==='bridge'?465:299;return {x:x+(q.x-x)*z.x/.72,y:340+(q.y-318.72)*z.y/.72};};
  const siteAt=(model,progress=1,climb=1)=>{
   if(model.hour<6)return {x:280,y:300};
   const id=model.actionId;
   if(id==='rock')return contactMap(model,DeskCharacters.climbContacts(rockRoute,climb).root);
   if(id==='survey')return contactMap(model,DeskCharacters.walkContacts(DeskWorlds.routes.woodlandWalk,Math.max(0,Math.min(1,(progress-.4)/.5))).root);
   if(['sticks','shelter','cook','bridge'].includes(id))return contactMap(model,{x:id==='cook'?326:id==='bridge'?465:299,y:id==='sticks'?303:300});
   return {x:model.action.role==='climbing'?57:id==='water'?541:id==='forage'?586:280,y:model.action.role==='climbing'?301-climb*56:300};
  };
  const previous=DeskWorlds.woodland(new Date(now.getTime()-m.second*1000-1),{format24:prefs.format24});
  const b=DeskWorlds.blocking(m,previous,p,{duration:prefs.display.companionDuration,interval:prefs.display.companionInterval,reducedMotion:quiet,siteAt});
  const climb=m.action.role==='climbing'&&m.hour>=6;
  const marker=p.phase==='mark'&&companions;
  const size=characterSize(),site={x:m.actionId==='rock'?57:m.actionId==='survey'?280:m.actionId==='cook'?326:m.actionId==='bridge'?465:299,y:318.72};
  const sx=size.x/.72,sy=size.y/.72,map=q=>({x:site.x+(q.x-site.x)*sx,y:340+(q.y-site.y)*sy});
  const siteTransform=`translate(${site.x} 340) scale(${sx} ${sy}) translate(${-site.x} ${-site.y})`;
  for(const id of ['woodland-holds','woodland-work-sockets','woodland-hand-tool'])attr(id,'transform',siteTransform);
  const contactRig=climb&&m.actionId==='rock'&&!b.moving?DeskCharacters.climbContacts(rockRoute,p.climb,{resting:p.phase==='recover'||!p.running}):null;
  const survey=m.actionId==='survey'&&m.hour>=6&&!b.moving;
  const walkProgress=p.running?Math.max(0,Math.min(1,(p.progress-.4)/.5)):1;
  const surveyPose=p.running&&p.progress<.4?'read-map':p.running&&p.progress<.9?'walk':'rest';
  const walkRig=survey?DeskCharacters.walkContacts(DeskWorlds.routes.woodlandWalk,walkProgress,{action:surveyPose}):null;
  const working=['sticks','cook','shelter','bridge'].includes(m.actionId)&&m.hour>=6&&!marker;
  const workBase={sticks:{root:{x:299,y:303},x:303,y:319},cook:{root:{x:326,y:300},x:339,y:309},shelter:{root:{x:299,y:300},x:313,y:311},bridge:{root:{x:465,y:300},x:479,y:311}}[m.actionId];
  const workSocket=working?{x:workBase.x+(p.running&&m.actionId!=='sticks'?Math.sin(p.progress*6*Math.PI)*2:0),y:workBase.y}:null;
  const workRig=working?DeskCharacters.workContacts({root:workBase.root,scale:.72,groundY:318.72,work:workSocket,hand:['cook','shelter','bridge'].includes(m.actionId)?1:0,action:m.action.pose,cycle:p.running?p.progress*3:0,angle:Math.PI/2+(p.running?Math.sin(p.progress*6*Math.PI)*.12:0)}):null;
  get('woodland-work-sockets').innerHTML=walkRig?'<path id="woodland-walk-ground" d="M270 318.72H380" fill="none" stroke="#bbaa7a" stroke-width="1.5"/>':workRig?`<circle id="woodland-work-target" cx="${workSocket.x}" cy="${workSocket.y}" r="1.5" fill="#dac897"/>`:'';
  attr('woodland-props','transform',workRig?siteTransform:'');
  attr('woodland-contact-boulder','transform',contactRig?siteTransform:'');
  const protectionAnchor=contactRig?rockRoute.anchor:{x:58,y:206};
  attr('woodland-anchor','cx',protectionAnchor.x);attr('woodland-anchor','cy',protectionAnchor.y);
  get('woodland-holds').innerHTML=contactRig?rockRoute.stations.flatMap(station=>['leftHand','leftFoot','rightHand','rightFoot'].map(name=>{const hold=station[name];return `<path data-hold="${hold.id}" d="M${hold.x-2.5} ${hold.y}h5" fill="none" stroke="#d2d2b4" stroke-width="1.7" stroke-linecap="round"/>`;})).join(''):'';
  const lastTrail=get('woodland-numerals').querySelector('[data-index="3"] .woodland-trail');
  const joint=lastTrail.getPointAtLength(lastTrail.getTotalLength()*.95);
  const jointMatrix=get('woodland-world').getCTM().inverse().multiply(lastTrail.getCTM()),trailJoint={x:jointMatrix.a*joint.x+jointMatrix.c*joint.y+jointMatrix.e,y:jointMatrix.b*joint.x+jointMatrix.d*joint.y+jointMatrix.f};
  const primary={x:climb?57:['water'].includes(m.actionId)?541:['forage'].includes(m.actionId)?586:m.actionId==='bridge'?453:280+(p.running&&m.actionId==='survey'?p.progress*90:0),y:climb?301-p.climb*56:300};
  if(contactRig)Object.assign(primary,contactRig.root);
  if(walkRig||workRig)Object.assign(primary,(walkRig||workRig).root);
  const supported=contactRig||walkRig||workRig;
  if(!supported)Object.assign(primary,b.position);
  actors.forEach(({host,young},i)=>{
   const scale=young?.52:.72,social=['teach','water','cook','rest'].includes(m.actionId),pos=i===0?primary:{x:social?primary.x+45+i*25:360+i*39,y:young?311:300};
   const supportedActor=i===0&&supported;
   if(supportedActor){host.setAttribute('transform',`${siteTransform} translate(${pos.x} ${pos.y}) scale(${scale})`);host.querySelector('.character-art').removeAttribute('transform');}
   else{const z=characterSize(young),height=get('woodland-world').getBoundingClientRect().height/360;if(i!==0||!['rock','survey','sticks','shelter','cook','bridge'].includes(m.actionId))pos.y=Math.min(pos.y,360-35*z.y-4/height);host.setAttribute('transform',`translate(${pos.x} ${pos.y})`);host.querySelector('.character-art').setAttribute('transform',`scale(${z.x} ${z.y})`);}
   const teachingTurn=p.running&&Math.floor(p.progress*4)%2===1;
   const pose=m.hour<6?'sleep':i===0?m.actionId==='teach'&&teachingTurn?'listen':(walkRig?surveyPose:workRig?m.action.pose:supported?p.pose:b.action):m.actionId==='teach'?(teachingTurn?'teach':'listen'):m.reflection?'rest':'camp';
   const anchor={x:(protectionAnchor.x-pos.x)/scale,y:(protectionAnchor.y-pos.y)/scale};
   const rig=i===0?(contactRig||walkRig||workRig):null;
   host.dataset.contactHolds=contactRig&&i===0?JSON.stringify(contactRig.holds):'';host.dataset.movingLimb=rig?.moving||'';
   host.dataset.groundContacts=walkRig&&i===0?JSON.stringify(Object.fromEntries(Object.entries(walkRig.holds).map(([name,q])=>[name,q?map(q):null]))):'';
   DeskCharacters.update(host,{action:pose,cycle:supported?p.progress*3:b.cycle,from:!supported&&i===0?b.from:null,fromCycle:b.fromCycle,blend:b.blend,fatigue:i===0?p.fatigue:0,assisted:i===0&&p.assisted,item:m.actionId==='water'?'water':m.actionId==='cook'?'food':null,ropeAnchor:anchor,rig});
  });
  get('woodland-cast').style.display=companions?'':'none';
  const a=DeskCharacters.attachment(DeskCharacters.create('moss',{role:'climbing'}));
  const matrix=get('woodland-world').getScreenCTM().inverse().multiply(actors[0].host.querySelector('.character-art').getScreenCTM()),harness=new DOMPoint(a.x,a.y).matrixTransform(matrix),anchorPoint=contactRig?map(protectionAnchor):protectionAnchor;
  attr('woodland-anchor','cx',anchorPoint.x);attr('woodland-anchor','cy',anchorPoint.y);
  attr('woodland-rope','d',`M${anchorPoint.x} ${anchorPoint.y}L${harness.x} ${harness.y}`);get('woodland-rope').style.display=companions&&climb&&!marker?'':'none';get('woodland-anchor').style.display=get('woodland-rope').style.display;
  get('woodland-hand-tool').innerHTML='';
  if(companions&&workRig&&m.actionId!=='cook'){
   const hand=workRig.arms[workRig.toolHand][2],grip=DeskCharacters.toolGrip(hand,workRig.toolTarget);
   get('woodland-hand-tool').innerHTML=`<g data-tool="${m.actionId==='sticks'?'fallen-stick':'mallet'}" transform="translate(${primary.x} ${primary.y}) scale(.72)"><g transform="translate(${grip.x} ${grip.y}) rotate(${grip.angle})"><path id="woodland-stick-grip" d="M0 0H14" stroke="#d8bc83" stroke-width="3" stroke-linecap="round"/>${m.actionId==='sticks'?'':'<path d="M14 -4V4" stroke="#718077" stroke-width="5" stroke-linecap="round"/>'}</g></g>`;

  }
  get('woodland-minute-marker').innerHTML=marker?`<g transform="translate(${trailJoint.x} ${trailJoint.y})"><path d="M0 4v12m-5 -8h10" stroke="#eedbad" stroke-width="3"/><circle cy="4" r="3" fill="#8a7150"/></g>`:'';

  // Planned wakeups respect low power: frames exist only inside bounded visits.
  return visible()&&companions&&(p.running||b.moving||b.settling);
 }
 function stop(){clearTimeout(timer);timer=null;if(frame!==null)cancelAnimationFrame(frame);frame=null;}
 function loop(now){
  frame=null;if(!visible())return;
  if(now-lastFrame<(prefs.lowPower?1000/12:1000/24)){frame=requestAnimationFrame(loop);return;}lastFrame=now;
  if(draw())frame=requestAnimationFrame(loop);
 }
 function schedule(){
  clearTimeout(timer);if(!visible())return;
  const now=new Date(),at=now.getTime(),local=now.getHours()*3600+now.getMinutes()*60+now.getSeconds()+now.getMilliseconds()/1000;
  const interval=prefs.display.companionInterval||60,nextVisit=interval-local%interval;
  // Also wake at the minute boundary, even when visits are spaced five minutes apart.
  const markerEnd=now.getSeconds()<3?(3000-now.getSeconds()*1000-now.getMilliseconds()):Infinity;
  const delay=Math.min(60000-at%60000,nextVisit*1000,markerEnd);
  timer=setTimeout(sync,Math.max(1,Math.ceil(delay)));
 }
 function sync(){
  stop();scene.hidden=!active();if(!active())return;
  fit();const animate=draw();if(!visible())return;
  schedule();if(animate)frame=requestAnimationFrame(loop);
 }
 function refresh(){lastTerrain='';lastMinute='';lastCast='';sync();}
 document.addEventListener('visibilitychange',sync);get('settings').addEventListener('close',sync);
 new MutationObserver(sync).observe(get('settings'),{attributes:true,attributeFilter:['open']});
 window.addEventListener('resize',sync);window.addEventListener('desk-display-change',sync);motion?.addEventListener?.('change',sync);
 if(typeof ResizeObserver==='function'){const observer=new ResizeObserver(()=>{if(active())fit();});for(const selector of ['.clock-panel','.fact-panel','.weather-panel'])observer.observe(get('display').querySelector(selector));}
 window.WoodlandTime={sync,refresh,model:DeskWorlds.woodland,rockRoute,get running(){return frame!==null;},get pending(){return timer!==null;}};sync();
})();

