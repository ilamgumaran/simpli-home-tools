// SPDX-License-Identifier: LicenseRef-Simpli-Noncommercial-1.0
// Copyright (C) 2026 ilamgumaran and contributors
// The landscape states the time. Work celebrates each change; it never delays it.
(()=>{
 'use strict';
 const get=id=>document.getElementById(id),ns='http://www.w3.org/2000/svg';
 const scene=document.createElement('section');scene.id='woodland-scene';scene.hidden=true;
 scene.innerHTML=`<svg id="woodland-world" viewBox="0 0 800 360" xmlns="${ns}" role="img" aria-labelledby="woodland-title woodland-description">
 <title id="woodland-title">Woodland of Time</title><desc id="woodland-description"></desc>
 <rect id="woodland-sky" width="800" height="360"/><circle id="woodland-light" cx="705" cy="55" r="25" fill="#f4e2ac"/>
 <g id="woodland-background"/><path id="woodland-ground" d="M0 240Q180 220 360 241T800 231V360H0Z"/>
 <path id="woodland-creek" d="M800 240Q600 229 552 276T344 340L300 360H365Q470 320 570 304T800 270Z"/>
 <g id="woodland-details"/><g id="woodland-holds"/><g id="woodland-props"/><path id="woodland-rope" fill="none" stroke="#ead6a8" stroke-width="1.6"/>
 <circle id="woodland-anchor" cx="58" cy="206" r="3" fill="#e3d4ab" stroke="#485844" stroke-width="1"/><g id="woodland-cast"></g><g id="woodland-hand-tool"/><g id="woodland-minute-marker"/>
 <g id="woodland-numerals" fill="none" stroke-linecap="round" stroke-linejoin="round"></g>
 <g fill="#eaddb3" stroke="#485844" stroke-width="3"><circle cx="400" cy="99" r="5"/><circle cx="400" cy="144" r="5"/></g>
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
 const tree=(x,y,size,round=false)=>`<g transform="translate(${x} ${y}) scale(${size})"><path d="M0 0V-65M0 -33L-17 -48M0 -24L20 -45" fill="none" stroke="#55604a" stroke-width="5"/>${round?'<circle cy="-64" r="31"/><circle cx="-22" cy="-45" r="23"/><circle cx="20" cy="-45" r="25"/>':'<path d="M0 -100L-28 -47H-15L-35 -23H35L15 -47H28Z"/>'}</g>`;
 function fit(){
  if(!active()||sizing)return;sizing=true;scene.style.height='0px';
  const r=get('display').getBoundingClientRect(),padding=parseFloat(getComputedStyle(get('display')).paddingBottom)||0;
  const budget=Math.max(90,innerHeight-(r.height+Math.max(12,r.top)+padding)-14);
  scene.style.height=Math.min(innerWidth<600?260:470,budget)+'px';scene.classList.toggle('woodland-compact',budget<165);sizing=false;
 }
 function landscape(m){
  const p=m.place;
  attr('woodland-sky','fill',m.daylight?p.sky:'#344c50');attr('woodland-ground','fill',p.ground);attr('woodland-creek','fill',p.water);
  attr('woodland-light','fill',m.daylight?'#f4e2ac':'#e0e6d4');
  get('woodland-background').innerHTML=`<path d="M0 165L110 ${65+m.hour%4*12}L250 153L400 80L530 164L680 102L800 156V270H0Z" fill="${p.hill}"/><g fill="${p.forest}" opacity=".72">${Array.from({length:18},(_,i)=>tree(i*49-15,230,.45+(i+m.hour)%4*.11,(m.hour+i)%3===0)).join('')}</g>`;
  const landmarks=[
   '<path d="M105 288l68 17" stroke="#615c43" stroke-width="14"/><ellipse cx="106" cy="288" rx="8" ry="10" fill="#b0a67c"/><ellipse cx="106" cy="288" rx="4" ry="6" fill="#6e6549"/>',
   '<path d="M555 258q30 14 7 31m-5 -27q25 14 7 25m7 -15l-5 9" stroke="#d4e6d9" stroke-width="3" fill="none"/><path d="M541 285h17" stroke="#afba9c" stroke-width="9"/>',
   '<g fill="#456641">'+Array.from({length:6},(_,i)=>`<path d="M${125+i*16} 317q-18 -44 0 -27q18 -29 6 21Z"/>`).join('')+'</g>',
   '<path d="M657 319l12 -43l25 -17l30 23l19 39Z" fill="#969b87" stroke="#62745f" stroke-width="3"/><path d="M681 267l17 20l-6 26" fill="none" stroke="#bdc0a5" stroke-width="2"/>',
   '<g fill="#355b48">'+tree(128,277,.72)+tree(691,281,.92)+tree(732,280,.7)+'</g>',
   '<ellipse cx="618" cy="267" rx="118" ry="25" fill="#94bec4"/><path d="M610 263h70m-93 10h42" stroke="#c6dcd0" stroke-width="2"/><path d="M728 294v-22m7 24v-18m8 16v-19" stroke="#adab72" stroke-width="2"/>',
   '<g fill="#7c8954">'+tree(140,283,.76,true)+tree(673,277,.73,true)+'</g><g fill="#c5a263"><circle cx="130" cy="241" r="4"/><circle cx="150" cy="233" r="4"/><circle cx="675" cy="237" r="4"/><circle cx="660" cy="247" r="4"/></g>',
   '<path d="M144 290h75m-64 0v22m53 -22v22" stroke="#bba274" stroke-width="7"/><path d="M699 291l22 -36l24 36Z" fill="#bba478" stroke="#665c42" stroke-width="2"/>'
  ];
  get('woodland-details').innerHTML=`<g fill="${p.forest}">${tree(58,260,1.4,m.hour%2===0)}${tree(758,256,1.5,m.hour%2!==0)}${tree(682,275,.9,true)}</g><path d="M17 331L24 265L70 225L108 262L104 334Z" fill="#869180" stroke="#556654" stroke-width="3"/><g fill="#e2d7b6"><circle cx="493" cy="315" r="5"/><circle cx="516" cy="309" r="6"/><circle cx="539" cy="300" r="5"/></g><g fill="#5b7049"><path d="M145 340Q131 299 153 316Q167 300 167 335Z"/><path d="M636 334Q624 286 644 306Q665 295 658 335Z"/></g><g fill="#b16557"><circle cx="648" cy="312" r="3"/><circle cx="639" cy="316" r="3"/><circle cx="653" cy="321" r="3"/></g><path d="M190 318l24 8m-29 6l28 -10m-12 -12l-3 22" stroke="#c3a879" stroke-width="3" stroke-linecap="round"/>${landmarks[m.hour%8]}`;
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
   sticks:'<path d="M303 324l34 -8m-27 -3l22 16m-18 -23l8 29" stroke="#c2a576" stroke-width="4"/>',
   shelter:tent,
   water:'<path d="M563 294v15h14v-15Z" fill="#8ec1c5" stroke="#45666a"/><path d="M565 289h10v5h-10Z" fill="#d2d6ae"/><path d="M559 277h21l-7 10h-7Z" fill="#dacead" stroke="#45666a"/><path d="M570 287v5" stroke="#d4ece6" stroke-width="2"/>',
   forage:'<path d="M596 315h27l-4 15h-19Z" fill="#c0a576" stroke="#665c42"/><path d="M600 315q9 -14 19 0" fill="none" stroke="#665c42"/><g fill="#af6651"><circle cx="605" cy="317" r="3"/><circle cx="614" cy="316" r="3"/></g>',
   tree:'<path d="M48 242h25m-35 22h24m-28 23h25" stroke="#c5c4a2" stroke-width="3"/>',
   rock:'<path d="M38 262h15m-18 20h15m-17 18h15" stroke="#c5c4a2" stroke-width="3"/>',
   fire:hearth,
   cook:hearth+'<path d="M326 307h25v9q-12 9 -25 0Z" fill="#546865" stroke="#d3d6b8"/><path d="M322 306h33" stroke="#d3d6b8" stroke-width="3"/><path d="M333 291q-6 -5 0 -10m12 11q-6 -5 0 -10" fill="none" stroke="#dde2cb" opacity=".7"/>',
   bridge:`<g transform="translate(476 306) rotate(-18)"><path d="M0 0h93M0 14h93" stroke="#665c42" stroke-width="4"/>${Array.from({length:Math.max(1,Math.ceil(8*grow))},(_,i)=>`<path d="M${i*12} -3v20" stroke="#c7ae79" stroke-width="9"/>`).join('')}</g>`,
   rest:'<path d="M284 331q17 -17 40 0Z" fill="#c1c0a0"/><path d="M336 326h13v-15h-13Z" fill="#8ec1c5"/>',
   teach:'<path d="M299 309l14 -3l15 3v19l-15 -4l-14 4Z" fill="#e6d7ad" stroke="#665c42"/><path d="M304 318q9 -12 18 3" fill="none" stroke="#71885f" stroke-width="2"/>'
  };
  get('woodland-props').innerHTML=types[m.actionId]+(m.actionId==='tree'?'<path d="M42 300h31M42 267h31" stroke="#c4c2a1" stroke-width="4"/>':'');
 }
 function draw(){
  if(!active())return;
  const now=new Date(),m=DeskWorlds.woodland(now,{format24:prefs.format24});
  renderClockTime(now);
  const p=DeskWorlds.performance(m,{duration:prefs.display.companionDuration,interval:prefs.display.companionInterval,reducedMotion:prefs.display.companion===false||motion?.matches||typeof requestAnimationFrame!=='function'});
  const minuteKey=m.minuteKey+':'+m.time+':'+m.period,terrainKey=m.terrainKey+':'+m.daylight+':'+m.period,castKey=m.story.id+':'+m.action.role+':'+lead(m);
  if(terrainKey!==lastTerrain){landscape(m);lastTerrain=terrainKey;}
  if(minuteKey!==lastMinute){numerals(m);lastMinute=minuteKey;}
  if(castKey!==lastCast){cast(m);lastCast=castKey;}
  const companions=prefs.display.companion!==false;
  scene.dataset.action=m.actionId;scene.dataset.phase=p.phase;scene.dataset.story=m.story.id;scene.dataset.terrain=m.terrainKey;
  const activityLabel=m.hour<6?'The camp rests':m.actionId==='cook'&&actors.length===1?'Cooking a quiet meal':m.actionId==='teach'&&actors.length===1?'Reading a lesson in the trail':m.action.label;
  get('woodland-action').textContent=(p.phase==='mark'?'Laying the new minute trail':p.phase==='recover'?'Resting before the next hold':activityLabel);
  const caption=m.caption.split(DeskCharacters.identities[m.story.cast[0]].name).join(DeskCharacters.identities[lead(m)].name);
  get('woodland-story').textContent=caption+' '+m.philosophy;
  get('woodland-description').textContent=`${m.time} ${m.period}. ${m.place.name}. ${caption} ${activityLabel}. ${m.philosophy}`;
  props(m,p);
  const climb=m.action.role==='climbing'&&m.hour>=6;
  const marker=p.phase==='mark'&&companions;
  const contactRig=climb&&m.actionId==='rock'&&!marker?DeskCharacters.climbContacts(rockRoute,p.climb,{resting:p.phase==='recover'||!p.running}):null;
  const protectionAnchor=contactRig?rockRoute.anchor:{x:58,y:206};
  attr('woodland-anchor','cx',protectionAnchor.x);attr('woodland-anchor','cy',protectionAnchor.y);
  get('woodland-holds').innerHTML=contactRig?rockRoute.stations.flatMap(station=>['leftHand','leftFoot','rightHand','rightFoot'].map(name=>{const hold=station[name];return `<path data-hold="${hold.id}" d="M${hold.x-2.5} ${hold.y}h5" fill="none" stroke="#d2d2b4" stroke-width="1.7" stroke-linecap="round"/>`;})).join(''):'';
  const lastTrail=get('woodland-numerals').querySelector('[data-index="3"] .woodland-trail');
  const joint=lastTrail.getPointAtLength(lastTrail.getTotalLength()*.95);
  const trailJoint={x:546+joint.x,y:52+joint.y};
  const primary={x:climb?57:['water'].includes(m.actionId)?541:['forage'].includes(m.actionId)?586:m.actionId==='bridge'?453:280+(p.running&&m.actionId==='survey'?p.progress*90:0),y:climb?301-p.climb*56:300};
  if(contactRig)Object.assign(primary,contactRig.root);
  if(marker){primary.x=trailJoint.x+12;primary.y=trailJoint.y+12;}
  actors.forEach(({host,young},i)=>{
   const scale=young?.52:.72,social=['teach','water','cook','rest'].includes(m.actionId),pos=i===0?primary:{x:social?primary.x+45+i*25:360+i*39,y:young?311:300};
   host.setAttribute('transform',`translate(${pos.x.toFixed(2)} ${pos.y.toFixed(2)}) scale(${scale})`);
   const pose=m.hour<6?'sleep':i===0?(marker?'build':p.pose):m.actionId==='teach'?'teach':m.reflection?'rest':'camp';
   const anchor={x:(protectionAnchor.x-pos.x)/scale,y:(protectionAnchor.y-pos.y)/scale};
   const rig=i===0?contactRig:null;
   host.dataset.contactHolds=rig?JSON.stringify(rig.holds):'';host.dataset.movingLimb=rig?.moving||'';
   DeskCharacters.update(host,{action:pose,cycle:p.progress*3,fatigue:i===0?p.fatigue:0,assisted:i===0&&p.assisted,item:m.actionId==='water'?'water':m.actionId==='cook'?'food':null,ropeAnchor:anchor,rig});
  });
  get('woodland-cast').style.display=companions?'':'none';
  const a=DeskCharacters.attachment(DeskCharacters.create('moss',{role:'climbing'}));
  attr('woodland-rope','d',`M${protectionAnchor.x} ${protectionAnchor.y}L${primary.x+a.x*.72} ${primary.y+a.y*.72}`);get('woodland-rope').style.display=companions&&climb&&!marker?'':'none';get('woodland-anchor').style.display=get('woodland-rope').style.display;
  get('woodland-hand-tool').innerHTML='';
  if(companions&&p.running&&!marker&&['sticks','shelter','bridge'].includes(m.actionId)){
   const hand=DeskCharacters.pose(p.pose,p.progress*3).arms[0][2];
   get('woodland-hand-tool').innerHTML=`<path d="M${primary.x+hand.x*.72-12} ${primary.y+hand.y*.72-4}l24 8" stroke="#d8bc83" stroke-width="3"/>`;
  }
  get('woodland-minute-marker').innerHTML=marker?`<g transform="translate(${trailJoint.x} ${trailJoint.y})"><path d="M0 4v12m-5 -8h10" stroke="#eedbad" stroke-width="3"/><circle cy="4" r="3" fill="#8a7150"/></g>`:'';
  if(marker){const hand=DeskCharacters.pose('build',p.progress*3).arms[0][2];get('woodland-hand-tool').innerHTML=`<path d="M${primary.x+hand.x*.72} ${primary.y+hand.y*.72}L${trailJoint.x} ${trailJoint.y+4}" stroke="#be9b70" stroke-width="2"/>`;}

  // Planned wakeups respect low power: frames exist only inside bounded visits.
  return visible()&&companions&&p.running;
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
