// SPDX-License-Identifier: LicenseRef-Simpli-Noncommercial-1.0
// Copyright (C) 2026 ilamgumaran and contributors
// Full-viewport illustration; calendar time remains authoritative in every frame.
(()=>{
 'use strict';
 const ns='http://www.w3.org/2000/svg',get=id=>document.getElementById(id),mod=(n,d)=>((n%d)+d)%d;
 const ease=n=>{const t=Math.max(0,Math.min(1,n));return t*t*t*(t*(t*6-15)+10);};
 const scene=document.createElement('section');scene.id='woodland-immersive';scene.hidden=true;
 scene.innerHTML=`<svg id="woodland-immersive-world" viewBox="0 0 800 360" preserveAspectRatio="none" role="img" aria-labelledby="woodland-immersive-title woodland-immersive-description" xmlns="${ns}">
 <title id="woodland-immersive-title">Woodland of Time</title><desc id="woodland-immersive-description"></desc>${DeskWoodlandArt.defs()}
 <rect id="woodland-immersive-wash" x="-30" y="-30" width="860" height="420" fill="#90aaa0"/>
 <g id="woodland-immersive-camera"><g id="woodland-immersive-backdrop"/><g id="woodland-immersive-river"/><g id="woodland-immersive-foreground"/><g id="woodland-immersive-camp"/>
 <g id="woodland-immersive-structures"/><g id="woodland-immersive-day"/><g id="woodland-immersive-workpieces"/>
 <g id="woodland-immersive-cliff"/><g id="woodland-immersive-holds"/><path id="woodland-immersive-rope" fill="none" stroke="#eddbb7" stroke-width="1.6"/>
 <g id="woodland-immersive-numerals"/><g id="woodland-immersive-colon" fill="#ead9af" stroke="#445542" stroke-width="2"><circle r="3.5"/><circle cy="26" r="3.5"/></g>
 <g id="woodland-immersive-delivery"/><g id="woodland-immersive-inlet"/><g id="woodland-immersive-cast"/><g id="woodland-immersive-fire"/><g id="woodland-immersive-ripples"/><rect id="woodland-immersive-light" x="-30" y="-30" width="860" height="420" fill="#f5d9ad" opacity="0" pointer-events="none"/></g></svg>
 <div class="immersive-heading"><span id="woodland-immersive-place"></span><span id="woodland-immersive-chapter"></span></div>
 <p id="woodland-immersive-story"></p>`;
 get('display').prepend(scene);
 const thought=document.createElement('button');thought.id='woodland-thought-button';thought.textContent='✧ Daily thought';thought.setAttribute('aria-expanded','false');thought.setAttribute('aria-controls','fact-title');get('display').querySelector('nav').append(thought);
 thought.onclick=()=>{if(locked)return;const show=document.body.classList.toggle('woodland-information');thought.setAttribute('aria-expanded',String(show));};
 const media=typeof matchMedia==='function'?matchMedia('(prefers-reduced-motion: reduce)'):null;
 let frame=null,timer=null,lastFrame=0,lastChapter='',lastMinute='',lastCast='',lastLayout='',lastClock='',lastLabel='';
 let layout={width:800,height:360,sx:1,sy:1,portrait:false,ground:322},slots=[],actors=[],paths=[];
 const active=()=>prefs.theme==='woodland'&&prefs.display.woodlandView==='immersive';
 const visible=()=>active()&&document.visibilityState==='visible'&&!get('settings').open&&!document.body.classList.contains('screen-rest');
 const quiet=()=>!!media?.matches||typeof requestAnimationFrame!=='function';
 const text=(id,value)=>{const e=get(id);if(e.textContent!==value)e.textContent=value;};
 const markup=(id,value)=>{const e=get(id);if(e._art!==value){e.innerHTML=value;e._art=value;}};
 const attr=(id,name,value)=>get(id).setAttribute(name,value);
 function fit(){
  const signature=[innerWidth,innerHeight,prefs.display.clockScale].join(':');if(signature===lastLayout)return;
  const controls=get('display').querySelector('footer').getBoundingClientRect();lastLayout=signature;
  const width=innerWidth,height=innerHeight,sx=width/800,sy=height/360,portrait=width<height*.85;
  layout={width,height,sx,sy,portrait,ground:Math.min(326,(controls.top-22)/sy)};
  const scale=portrait?Math.min(.46,120/(150*sy))*prefs.display.clockScale:Math.min(1.12,205/(150*sy))*prefs.display.clockScale;
  const ratio=sy/sx,w=80*scale*ratio,gap=24/sx;
  if(portrait){
   const x=(800-(w*2+gap))/2;slots=[{x,y:64,s:scale},{x:x+w+gap,y:64,s:scale},{x,y:145,s:scale},{x:x+w+gap,y:145,s:scale}];
  }else{
   const pair=w*2+gap,hourX=94,minuteX=Math.min(800-pair-78,446);
   slots=[{x:hourX,y:65,s:scale},{x:hourX+w+gap,y:65,s:scale},{x:minuteX,y:92,s:scale*.9},{x:minuteX+w*.9+gap,y:92,s:scale*.9}];
  }
  for(const [i,slot] of slots.entries()){
   const e=get('woodland-immersive-numerals').querySelector(`[data-index="${i}"]`);if(e)e.setAttribute('transform',`translate(${slot.x} ${slot.y}) scale(${slot.s*ratio} ${slot.s})`);
  }
  const colon=portrait?{x:400,y:127}:{x:(slots[1].x+w+slots[2].x)/2,y:116};
  attr('woodland-immersive-colon','transform',`translate(${colon.x} ${colon.y}) scale(${ratio} 1)`);
  attr('woodland-immersive-camp','transform',`translate(0 ${layout.ground-326})`);
  attr('woodland-immersive-day','transform',`translate(${20/layout.sx} ${(portrait?124:88)/layout.sy}) scale(${.18/layout.sx} ${.18/layout.sy})`);
 }
 function size(young=false){
  const pixels=Math.max(80,Math.min(160,layout.height*.235))*(young?.70:1);
  return {x:pixels/(66*layout.sx),y:pixels/(66*layout.sy),pixels};
 }
 function chapter(m){
  const art=DeskWoodlandArt.landscape(m);
  for(const key of ['backdrop','river','foreground','camp'])markup('woodland-immersive-'+key,art[key]);
  DeskWoodlandArt.invalidate(get('woodland-immersive-world'));lastLayout='';
 }
 function numerals(m){
  const materials=[m.hourMaterial,m.hourMaterial,m.minuteMaterial.tens,m.minuteMaterial.ones];
  markup('woodland-immersive-numerals',[...m.digits].map((d,i)=>`<g data-index="${i}" data-digit="${d}">${DeskWoodlandArt.digit(d,{material:materials[i],seed:m.minute+i})}</g>`).join(''));
  markup('woodland-immersive-day',`<rect x="-18" y="-12" width="340" height="178" rx="15" fill="#354d3e" stroke="#e0c994" stroke-width="5"/><text x="1" y="84" fill="#f2e7c9" font-size="34" font-family="monospace">DAY</text>${[...m.dateDigits].map((d,i)=>`<g data-day-digit="${d}" transform="translate(${85+i*112} 0)">${DeskWoodlandArt.digit(d,{material:m.dateMaterial,seed:m.day})}</g>`).join('')}`);
  paths=[...get('woodland-immersive-numerals').querySelectorAll('.woodland-trail')];lastLayout='';
 }
 function override(m){
  const requested=globalThis.ORBIT_CONFIG?.characters?.woodland;
  const lead=Object.hasOwn(DeskCharacters.identities,requested)&&!DeskCharacters.identities[requested].young?requested:m.social.lead;
  const ids=[...new Set([lead,...m.social.cast.slice(1).map(id=>id===lead?m.social.lead:id)])];return {lead,ids};
 }
 function cast(m){
  const {ids}=override(m);get('woodland-immersive-cast').replaceChildren();actors=[];
  ids.forEach((id,index)=>{
   const host=document.createElementNS(ns,'g'),young=!!DeskCharacters.identities[id].young;
   const character=DeskCharacters.create(id,{role:index===0?'expedition':'trail'});DeskCharacters.mount(host,character);
   const prop=document.createElementNS(ns,'g');prop.dataset.immersiveProp='';host.append(prop);host.dataset.castIndex=index;
   get('woodland-immersive-cast').append(host);actors.push({host,character,young,prop,index,id});
  });
 }
 function glyphPoint(m){
  const low=DeskWoodlandStory.points(m.digits[3],{step:12}).filter(p=>p.y>=135),left=Math.min(...low.map(p=>p.x)),points=low.filter(p=>p.x<=left+5),point=points[(m.minute*7+m.hour)%points.length];
  const slot=slots[3];return {x:slot.x+point.x*slot.s*layout.sy/layout.sx,y:slot.y+point.y*slot.s};
 }
 function location(m,z){
  const id=m.work.id,point=glyphPoint(m);
  if(m.hour<6)return {x:320,ground:layout.ground};
  if(['paving','stone-work'].includes(id))return {x:point.x-20*z.x,ground:Math.min(layout.ground,point.y+8*z.y),target:point};
  if(id==='protected-climb')return {x:Math.max(76,30*z.x),ground:layout.ground};
  const x={ 'gather-sticks':207,'pitch-tent':308,'filter-water':590,forage:690,'tend-fire':432-24*z.x,cook:432-20*z.x,'repair-crossing':538,rest:290,teach:354 }[id]||m.work.site.x;
  return {x,ground:layout.ground-(id==='filter-water'?6:0)};
 }
 const workPose=m=>({'paving':'pave','gather-sticks':'carry-wood','pitch-tent':'tent-peg','filter-water':'fill-water',forage:'gather','stone-work':'pave','tend-fire':'kindle-fire',cook:'stir-pot','repair-crossing':'tent-peg',rest:'rest',teach:'teach'})[m.work.id]||m.work.pose;
 function action(m,actor){
  if(m.hour<6)return 'sleep';if(m.reflection&&m.beat===0)return 'rest';
  if(actor.young)return ({'water-edge-play':'play-water','sand-build':'play-sand','shallow-wade':'wade',learn:'listen',observe:'listen'})[m.social.kidActivity]||'listen';
  if(actor.index){if(m.phase==='recover')return 'rest';if(m.work.id==='cook')return 'camp';return m.social.learner?'teach':m.work.id==='teach'?'listen':m.phase==='work'?'carry-wood':'camp';}
  if(m.work.id==='protected-climb')return m.work.pose;
  if(['recover','settle'].includes(m.phase))return 'rest';
  return workPose(m);
 }
 function blendRig(a,b,t){
  const solve=(kind,roots,lengths,bends)=>roots.map((root,i)=>{const old=a[kind][i][2],next=b[kind][i][2];return DeskCharacters.joint(root,{x:old.x+(next.x-old.x)*t,y:old.y+(next.y-old.y)*t},...lengths,bends[i]);});
  const arms=solve('arms',DeskCharacters.anatomy.shoulders,[12,11],[1,-1]),legs=solve('legs',DeskCharacters.anatomy.hips,[12,12],[-1,1]),contacts=t===0?a.contacts:t===1?b.contacts:{leftHand:false,rightHand:false,leftFoot:false,rightFoot:false},rig={...b,arms,legs,contacts,groundY:Math.max(...legs.flatMap(l=>l.slice(1).map(p=>p.y)))};
  if(b.prop)rig.prop={...b.prop,grip:{...arms[b.prop.hand][2]},...(b.prop.secondGrip?{secondGrip:{...arms[1-b.prop.hand][2]}}:{})};
  return rig;
 }
 function poseAt(m,actor,cycle){
  const current=action(m,actor),at=m.second%20,boundary=m.phase==='prepare'?0:m.work.id==='protected-climb'?m.phase==='recover'?7.5:m.phase==='settle'?17:at<7.5?3:11.5:m.phase==='work'?3:m.phase==='recover'?11:15;
  const elapsed=at-boundary,stamp=new Date(m._minuteStart+(m.beat*20+boundary)*1000-1),before=DeskWoodlandStory.sample(stamp,{format24:prefs.format24});
  const from=action(before,actor),rig=DeskCharacters.pose(current,cycle,{from,fromCycle:cycle,blend:ease(elapsed/.7)});
  return {action:current,rig};
 }
 const support=rig=>rig.groundY??Math.max(...rig.legs.flatMap(l=>l.slice(1).map(p=>p.y)));
 function schedule(m){
  const z=size(),previous=DeskWoodlandStory.sample(new Date(m._minuteStart-1),{format24:prefs.format24}),from=location(previous,z),to=location(m,z);
  previous._minuteStart=m._minuteStart-60000;
  let distance=Math.hypot((to.x-from.x)/z.x,(to.ground-from.ground)/z.y);
  for(const actor of actors.filter(a=>a.index)){
   const s=size(actor.young),a=companionSite(previous,actor,from),b=companionSite(m,actor,to);
   distance=Math.max(distance,Math.hypot((b.x-a.x)/s.x,(b.ground-a.ground)/s.y));
  }
  const descent=previous.work.id==='protected-climb'&&previous.hour>=6?5:0;
  const travel=m.hour<6?0:descent+Math.max(1,Math.min(12,distance/35));
  return {previous,from,to,travel,descent,climbStart:travel,climbBout:(60-travel)/3};
 }
 function climbEffort(m,plan){
  const at=Math.max(0,m.second-plan.climbStart),duration=plan.climbBout,beat=Math.min(2,Math.floor(at/duration)),local=at-beat*duration;
  const restStart=5,restEnd=9,finish=duration-1;
  let p=0,phase='prepare';
  if(local>=finish){p=1;phase='settle';}
  else if(local>=restEnd){p=.5+.5*(local-restEnd)/(finish-restEnd);phase='work';}
  else if(local>=restStart){p=.34+.16*(local-restStart)/4;phase='recover';}
  else if(local>=.5){p=.34*(local-.5)/(restStart-.5);phase='work';}
  const effort=DeskCharacters.ascent(p,finish-local);
  return {...effort,progress:(beat+effort.progress)/3,assisted:phase==='work'&&effort.assisted,resting:['prepare','recover','settle'].includes(phase),phase,beat};
 }
 function projectCliff(point,z){
  const origin=DeskWorlds.routes.woodlandRock.stations[0].root;
  return {x:Math.max(76,30*z.x)+(point.x-origin.x)*z.x/.72,y:layout.ground-26*z.y+(point.y-origin.y)*z.y/.72};
 }
 function companionSite(m,actor,lead){
  if(m.hour<6)return {x:actor.young?320+42*size(true).x:actor.index?Math.max(40*size().x,320-43*size().x):320,ground:layout.ground};
  const helper=actors.find(a=>a.index&&!a.young);
  if(actor.young)return {x:m.work.id==='teach'?lead.x+48*size(true).x:helper?m.work.id==='forage'?625:652:Math.max(140,Math.min(730,lead.x+43)),ground:layout.ground-4};
  return {x:m.social.learner?m.work.id==='teach'?lead.x-45*size().x:m.work.id==='filter-water'?704:m.work.id==='forage'?560:604:Math.max(155,lead.x-70),ground:layout.ground};
 }
 function propMarkup(p){
  if(!p)return '';
  const h=p.grip,t=p.tip,angle=Math.atan2(t.y-h.y,t.x-h.x)*180/Math.PI;
  const transform=`translate(${h.x} ${h.y})`,line=`M${h.x} ${h.y}L${t.x} ${t.y}`;
  if(p.kind==='stone')return `<path data-tool="stone" transform="${transform}" d="M-6 -3L-2 -6L5 -4L7 2L3 5L-5 4Z" fill="#c4c9b4" stroke="#4d6155" stroke-width="1"/><path transform="${transform}" d="M-4 -2L1 -4L4 -2" fill="none" stroke="#edf0d5"/>`;
  if(p.kind==='log')return `<g data-tool="log"><path d="M${h.x-7} ${h.y-3}H${t.x+4}V${h.y+4}H${h.x-7}Z" fill="#cdb079" stroke="#665539"/><ellipse cx="${h.x-7}" cy="${h.y+.5}" rx="2" ry="3.5" fill="#ebd8a5" stroke="#8c7450"/><path d="M${h.x-2} ${h.y}H${t.x}" stroke="#927345" stroke-width=".7"/></g>`;
  if(p.kind==='filter-bottle')return `<g data-tool="filter-bottle" transform="${transform}"><path d="M-3 -2h6v9h-6Z" fill="#c7e1d6" stroke="#426d68"/><path d="M-2 -4h4v2h-4Z" fill="#536f63"/><path d="M-2 4h4" stroke="#75b1bb" stroke-width="2"/></g>`;
  if(p.kind==='splash')return `<path data-tool="splash" d="M${h.x} ${h.y+3}q6 6 9 12m-3 -10l3 3m-1 5l2 4" stroke="#d1ebe3" stroke-width="1.3" fill="none"/>`;
  if(p.kind==='firesteel')return `<path data-tool="firesteel" d="${line}" stroke="#666c5b" stroke-width="2.2"/><path d="M${t.x} ${t.y}l3 -4m-1 5l4 1m-4 1l2 3" stroke="#f7dc82" stroke-width=".8"/>`;
  if(p.kind==='spoon')return `<path data-tool="spoon" d="${line}" stroke="#bc9e6a" stroke-width="1.8"/><ellipse cx="${t.x}" cy="${t.y}" rx="2" ry="3" fill="#ddc48b"/>`;
  if(p.kind==='mallet')return `<g data-tool="mallet"><path d="${line}" stroke="#af9361" stroke-width="2"/><path data-mallet-head transform="translate(${t.x} ${t.y}) rotate(${angle})" d="M0 -3V3" stroke="#899383" stroke-width="5" stroke-linecap="round"/></g>`;
  return `<path data-tool="${p.kind}" d="${line}" stroke="#b99c69" stroke-width="1.5"/>${p.kind==='rake'?`<path d="M${t.x-3} ${t.y}h7m-6 -2v4m2 -4v4m2 -4v4" stroke="#677257" stroke-width="1.2"/>`:''}`;
 }
 function draw(){
  if(!active())return;
  const now=new Date(),m=DeskWoodlandStory.sample(now,{format24:prefs.format24});m._minuteStart=now.getTime()-m.second*1000;
  const frozen=quiet(),companions=prefs.display.companion!==false,t=now.getTime()/1000;
  const clockKey=Math.floor(now.getTime()/1000)+':'+prefs.format24;if(clockKey!==lastClock){renderClockTime(now);lastClock=clockKey;}
  if(m.terrainKey!==lastChapter){chapter(m);lastChapter=m.terrainKey;}
  const minuteKey=m.minuteKey+':'+m.time+':'+m.dateDigits;if(minuteKey!==lastMinute){numerals(m);lastMinute=minuteKey;}
  const castKey=override(m).ids.join(':');if(castKey!==lastCast){cast(m);lastCast=castKey;}
  fit();
  const z=size(),plan=schedule(m),{previous,from:previousLoc,to:leadLoc,travel,descent}=plan;
  const climbing=m.work.id==='protected-climb'&&m.hour>=6,descending=descent>0&&m.second<descent;
  const effort=climbing?climbEffort(m,plan):m.work.effort,phase=climbing?effort.phase:m.phase;
  scene.dataset.time=m.time;scene.dataset.date=m.dateDigits;scene.dataset.phase=m.phase;scene.dataset.activity=m.work.id;scene.dataset.chapter=m.terrainKey;scene.dataset.material=m.material;
  scene.dataset.night=String(m.hour<6||m.hour>=20);
  const label=m.hour<6?'The camp rests':descending?'Returning on the protected route':m.second<travel?'On the trail to '+m.work.label.toLowerCase():phase==='recover'?'A breath before the next task':m.work.label;
  if(label!==lastLabel){text('woodland-immersive-chapter',label);lastLabel=label;}
  text('woodland-immersive-title',`Woodland of Time · ${m.time} ${m.period}`);text('woodland-immersive-place',m.place.name+' · '+m.period);
  const caption=m.caption.split(DeskCharacters.identities[m.social.lead].name).join(DeskCharacters.identities[override(m).lead].name);
  text('woodland-immersive-story',m.reflection?caption+' '+m.philosophy:m.philosophy);
  text('woodland-immersive-description',`${m.time} ${m.period}, day ${m.dateDigits}. ${m.place.name}. ${label}. ${caption} ${m.philosophy}`);
  if(climbing)scene.dataset.phase=effort.phase;
  let leadPosition=null,leadRig=null,kidPosition=null,kidRig=null;
  const route=DeskWorlds.routes.woodlandRock,cliffVisible=!frozen&&companions&&m.hour>=6&&(climbing||m.second<travel&&descent>0);
  if(cliffVisible){
   const cx=projectCliff(route.stations[0].root,z).x,top=projectCliff(route.stations.at(-1).leftHand,z).y-18;
   markup('woodland-immersive-cliff',`<path d="M${cx-28*z.x} ${layout.ground+4}Q${cx-29*z.x} ${top+28} ${cx} ${top}Q${cx+29*z.x} ${top+16} ${cx+29*z.x} ${layout.ground+4}Z" fill="#859489" stroke="#526a5c" stroke-width="2"/><path d="M${cx-17*z.x} ${top+40}Q${cx} ${top+23} ${cx+10*z.x} ${top+33}" stroke="#c2cab0" stroke-width="2" fill="none"/>`);
   markup('woodland-immersive-holds',route.stations.flatMap(station=>['leftHand','rightHand','leftFoot','rightFoot'].map(name=>{const point=projectCliff(station[name],z);return `<path data-hold="${station[name].id}" d="M${point.x-2} ${point.y}h4" stroke="#ece0bd" stroke-width="1.4"/>`;})).join(''));
  }else{markup('woodland-immersive-cliff','');markup('woodland-immersive-holds','');}
  attr('woodland-immersive-rope','d','');
  actors.forEach(actor=>{
   const s=size(actor.young),cycle=frozen?0:t/5,at=poseAt(m,actor,cycle);let rig=at.rig,pose=at.action;
   const destination=actor.index?companionSite(m,actor,leadLoc):leadLoc;
   const source=actor.index?companionSite(previous,actor,previousLoc):previousLoc;
   let ground=destination.ground,pos={x:destination.x,y:ground-support(rig)*s.y};
   const climbingRig=actor.index===0&&climbing&&!frozen?DeskCharacters.climbContacts(route,effort.progress,{resting:effort.resting}):null;
   if(climbingRig){rig=climbingRig;pose=effort.assisted?'assist':effort.resting?'recover-climb':'climb';pos=projectCliff(rig.root,s);}
   if(frozen){pose=m.hour<6?'sleep':'rest';rig=DeskCharacters.pose(pose,0);pos={x:destination.x,y:ground-support(rig)*s.y};}
   const moving=companions&&!frozen&&m.hour>=6&&m.second<travel;
   if(actor.index===0&&descending&&!frozen){
    rig=DeskCharacters.climbContacts(route,1-ease(m.second/descent));pos=projectCliff(rig.root,s);pose='rappel';
   }else if(moving){
    const begin=actor.index?0:descent,duration=travel-begin,amount=DeskWorlds.travelProgress(Math.max(0,m.second-begin),duration);
    const dx=(destination.x-source.x)/s.x,steps=Math.max(1,Math.ceil(Math.abs(dx)/12));
    let gait=DeskCharacters.walkContacts({scale:1,origin:{x:0,y:0},groundY:26,steps,stride:Math.max(.1,Math.abs(dx)/steps)},amount);
    if(dx<0){const mirrored=limbs=>[limbs[1],limbs[0]].map(l=>l.map(p=>({x:-p.x,y:p.y})));gait={...gait,arms:mirrored(gait.arms),legs:mirrored(gait.legs)};}
    const slope=Math.abs(dx)>.01?(destination.ground-source.ground)/(s.y*dx):0;
    gait={...gait,legs:gait.legs.map((leg,i)=>DeskCharacters.joint(DeskCharacters.anatomy.hips[i],{x:leg[2].x,y:leg[2].y+slope*leg[2].x},12,12,i?1:-1))};
    const start=actor.index===0&&descent?DeskCharacters.climbContacts(route,0):DeskCharacters.pose(action(previous,actor),cycle);
    if(Math.abs(dx)<.01&&source.ground===destination.ground){rig=blendRig(start,rig,ease(m.second/.7));}
    else{
     rig=blendRig(start,gait,ease((m.second-begin)/.7));rig=blendRig(rig,climbingRig||at.rig,ease((m.second-travel+.7)/.7));pose='walk';
    }
    ground=source.ground+(destination.ground-source.ground)*amount;
    const arrive=ease((m.second-travel+.7)/.7),leave=ease((m.second-begin)/.7);
    const ywalk=ground-26*s.y+gait.root.y*s.y,ystart=ground-support(start)*s.y,yend=ground-support(climbingRig||at.rig)*s.y;
    const y=Math.abs(dx)<.01&&source.ground===destination.ground?ground-support(rig)*s.y:ystart+(ywalk-ystart)*leave;
    pos={x:source.x+(destination.x-source.x)*amount,y:y+(yend-y)*arrive};
   }
   const anchored=actor.index===0&&!frozen&&(descending||climbing&&!moving);
   if(anchored){
    const anchor=projectCliff(route.anchor,s);actor.host._anchor=anchor;
    attr('woodland-immersive-rope','d',`M${anchor.x} ${anchor.y}L${pos.x} ${pos.y+9*s.y}`);
    actor.host.dataset.contactHolds=JSON.stringify(rig.holds);
   }else actor.host.dataset.contactHolds='';
   // Site bounds apply before interpolation, and the whole cliff projects from
   // one safe origin. Never clamp a solved root away from its terrain contacts.
   actor.host.setAttribute('transform',`translate(${pos.x.toFixed(4)} ${pos.y.toFixed(4)})`);actor.host.querySelector('.character-art').setAttribute('transform',`scale(${s.x} ${s.y})`);
   const anchor=actor.host._anchor||{x:80,y:90},organic=frozen||effort.resting?0:Math.sin(Math.PI*m.progress)**2;
   const result=DeskCharacters.update(actor.host,{action:pose,cycle,rig,fatigue:actor.index?0:effort.fatigue,assisted:actor.index===0&&effort.assisted,ropeAnchor:{x:(anchor.x-pos.x)/s.x,y:(anchor.y-pos.y)/s.y},organic,phase:t+actor.index*.7,item:actor.index&&m.work.id==='cook'?'food':m.work.id==='filter-water'?'water':null});
   const prop=result.prop;const drawing=propMarkup(prop);if(actor.prop._art!==drawing){actor.prop.innerHTML=drawing;actor.prop._art=drawing;}actor.prop.setAttribute('transform',`scale(${s.x} ${s.y})`);
   actor.host.dataset.action=pose;actor.host.dataset.supervisor=actor.young?(actors.find(a=>a.index&&!a.young)||actors[0]).id:'';actor.host.dataset.ground=ground;
   actor.host.dataset.footContacts=JSON.stringify({leftFoot:rig.contacts.leftFoot,rightFoot:rig.contacts.rightFoot});
   if(actor.index===0){leadPosition=pos;leadRig=rig;}
   if(actor.young){kidPosition=pos;kidRig=rig;}
  });
  get('woodland-immersive-cast').style.display=companions?'':'none';get('woodland-immersive-rope').style.display=companions?'':'none';
  const point=glyphPoint(m),ground=layout.ground,ratio=layout.sy/layout.sx;
  const fireActive=m.hour>=6&&['tend-fire','cook'].includes(m.work.id),cook=m.work.id==='cook';
  const potY=ground-18*z.y,flame=frozen?0:Math.sin(t*5)*2,flameHeight=cook?Math.max(12,ground-potY-9):24;
  markup('woodland-immersive-fire',fireActive?`<g><path d="M${432-12*ratio} ${ground+2}Q${432-15*ratio} ${ground-12} 432 ${ground-flameHeight-flame}Q${432-2*ratio} ${ground-9} ${432+8*ratio} ${ground-14}Q${432+21*ratio} ${ground+3} ${432-12*ratio} ${ground+2}Z" fill="#e6a255"/><path d="M${432-6*ratio} ${ground+2}Q${432-8*ratio} ${ground-8} 432 ${ground-flameHeight*.6}Q${432+10*ratio} ${ground+1} ${432-6*ratio} ${ground+2}Z" fill="#f6d489"/>${cook?`<path d="M${432-23*ratio} ${ground}L432 ${potY-12}L${432+23*ratio} ${ground}M432 ${potY-12}V${potY}" stroke="#594e36" stroke-width="2" fill="none"/><path data-workpiece="pot" d="M${432-15*ratio} ${potY}h${30*ratio}v9q${-15*ratio} 8 ${-30*ratio} 0Z" fill="#4b6459" stroke="#dddbb6"/><ellipse data-workpiece="potopening" cx="432" cy="${potY}" rx="${16*ratio}" ry="3" fill="#aab58c" stroke="#efdcaa"/>`:''}<path d="M${432-8*ratio} ${potY-12}q${-6*ratio} -7 0 -14m${13*ratio} 11q${6*ratio} -8 0 -15" fill="none" stroke="#e5e5c9" opacity=".5" stroke-width="1.3"/></g>`:'');
  // These are cumulative, deterministic construction snapshots within an
  // hourly chapter; a work/rest bout never tears down what was just built.
  const build=.25+.75*ease(Math.min(1,(m.minute+m.second/60)/10)),planks=Math.max(1,Math.min(7,Math.floor((m.minute+m.second/60)/2)+1));
  const shelter=`<path data-workpiece="tent" data-progress="${build}" d="M278 ${ground-5}L304 ${ground-53*build}L371 ${ground-49*build}L401 ${ground-6}Z" fill="#bcac76" fill-opacity=".84" stroke="#6f6747"/><path d="M304 ${ground-53*build}L330 ${ground-4}" stroke="#ede0b3" stroke-width="1.2"/>`;
  const crossing=`<g data-workpiece="crossing" transform="translate(518 ${ground-5}) rotate(-12)"><path d="M-6 4H96M-6 16H96" stroke="#785e3c" stroke-width="3"/>${Array.from({length:planks},(_,i)=>`<rect x="${i*13}" y="-2" width="10" height="21" rx="2" fill="#d4bd85" stroke="#78613d"/>`).join('')}</g>`;
  const geometry=leadRig?.prop,tip=leadPosition&&geometry?{x:leadPosition.x+geometry.tip.x*z.x,y:leadPosition.y+geometry.tip.y*z.y}:point;
  let task='';
  if(m.work.id==='filter-water')task=`<path data-workpiece="water" d="M${tip.x-3} ${tip.y}q3 6 6 0m-3 -2v7" stroke="#c8e7db" stroke-width="1.5" fill="none"/><path d="M590 ${ground-5}Q622 ${ground-33} 672 ${ground-29}" stroke="#85b5aa" stroke-width="8" fill="none"/>`;
  if(['pitch-tent','repair-crossing'].includes(m.work.id))task=`<path data-workpiece="peg" d="M${leadLoc.x+20*z.x} ${ground-2}v9" stroke="#6a593d" stroke-width="2.5"/><path d="M${leadLoc.x+20*z.x-3} ${ground-2}h6" stroke="#c9bea0" stroke-width="2"/>`;
  if(m.work.id==='forage')task=`<g data-workpiece="berries" transform="translate(${leadLoc.x-17*z.x} ${ground}) scale(${z.x} ${z.y})"><path d="M0 0L-3 -23M-2 -14L-11 -20M-2 -19L5 -27" stroke="#536b42" stroke-width="1.6" fill="none"/><path d="M-10 -19q-8 -9 1 -9q9 1 6 9M0 -24q2 -9 10 -7q2 8 -8 8" fill="#8aa878" stroke="#5f7d51"/><circle cx="-2" cy="-21" r="2.3" fill="#b67b67"/><circle cx="-7" cy="-23" r="2" fill="#bb8770"/><circle cx="4" cy="-26" r="2" fill="#b67b67"/></g>`;
  if(['paving','stone-work'].includes(m.work.id))task=`<path data-workpiece="paving" d="M${point.x-9} ${point.y+3}L${point.x-4} ${point.y-3}L${point.x+6} ${point.y-2}L${point.x+10} ${point.y+4}Z" fill="#d3d1b0" stroke="#6d795d"/><path d="M${leadLoc.x-17*z.x} ${leadLoc.ground+2}h${34*z.x}" stroke="#ab9974" stroke-width="3"/><path d="M${leadLoc.x-12*z.x} ${leadLoc.ground+2}v${Math.max(0,ground-leadLoc.ground)}M${leadLoc.x+12*z.x} ${leadLoc.ground+2}v${Math.max(0,ground-leadLoc.ground)}" stroke="#8b7650" stroke-width="2"/>`;
  const kid=actors.find(a=>a.young),kidS=size(true),sand=kid&&kidPosition&&m.hour>=6&&m.social.kidActivity==='sand-build';
  if(sand){
   const x=kidPosition.x+19*kidS.x,y=ground-4;
   task+=`<ellipse cx="${x}" cy="${y}" rx="${22*ratio}" ry="6" fill="#dfcb95"/><path data-workpiece="sand-digit" data-digit="${m.digits[3]}" d="${DeskWorlds.numerals[m.digits[3]]}" transform="translate(${x-12*ratio} ${y-3}) scale(${.28*ratio} .045)" fill="none" stroke="#8c7650" stroke-width="2.5"/>`;
  }
  markup('woodland-immersive-workpieces',shelter+crossing+task);
  const stream=companions&&!frozen&&m.hour>=6;
  const floating=['leaf','wood'].includes(m.material),bankY=point.y+15;
  const canal=`<path data-minute-source="${floating?'river':'bank'}" d="M825 ${floating?215:ground-7}Q740 ${floating?235:ground-7} ${point.x} ${bankY}" fill="none" stroke="${floating?'#78a69a':'#bcaa7b'}" stroke-width="${floating?13:9}" opacity=".8"/>`;
  const count=m.material==='sand'?0:floating?5:1;
  const objects=Array.from({length:count},(_,i)=>{
   const p=stream?mod(m.second/9+i/5,1):i/5,x=point.x+(825-point.x)*(1-p),y=floating?215+(bankY-215)*p+5*Math.sin(p*Math.PI):ground-7+(bankY-ground+7)*p;
   const kind=m.material,path=kind==='leaf'?'<path d="M-8 1Q-5 -9 8 -2Q6 8 -8 1Z" fill="#bdce91" stroke="#5e7953"/><path d="M-6 1L5 -1" stroke="#7b955f"/>':kind==='stone'?'<path d="M-10 -2h20l-4 5h-14Z" fill="#a78353" stroke="#665c40"/><circle cx="-6" cy="6" r="3" fill="#405f50"/><circle cx="7" cy="6" r="3" fill="#405f50"/><path d="M-6 -4L-1 -7L5 -3L6 0L0 2L-6 -1Z" fill="#bfc8ba" stroke="#627767"/>':'<rect x="-9" y="-3" width="18" height="6" rx="2" fill="#d8bb83" stroke="#92764c"/><path d="M-5 0h10" stroke="#a18756"/>';
   const opacity=frozen?1:Math.min(1,p*12,(1-p)*12);
   return `<g data-delivery="${kind}" opacity="${opacity.toFixed(3)}" transform="translate(${x.toFixed(2)} ${y.toFixed(2)}) scale(${ratio} 1) rotate(${stream&&floating?Math.sin(t+i)*7:0})">${path}</g>`;
  }).join('');markup('woodland-immersive-delivery',canal+objects);
  const waterPlay=kid&&kidPosition&&m.hour>=6&&m.second>=travel&&m.social.supervisor&&['water-edge-play','shallow-wade'].includes(m.social.kidActivity);
  const splash=stream&&waterPlay,ripple=stream?1+Math.sin(t*2)*.08:1;
  markup('woodland-immersive-inlet',waterPlay?`<path data-water-inlet d="M691 247Q713 ${ground-44} ${kidPosition.x} ${ground-4}Q${kidPosition.x-14*ratio} ${ground+4} ${kidPosition.x-30*ratio} ${ground-3}Q${kidPosition.x+7*ratio} ${ground-25} 672 241Z" fill="#79aaa1" stroke="#b9d6bb" stroke-width="1"/>`:'');
  markup('woodland-immersive-ripples',waterPlay?`<g transform="translate(${kidPosition.x} ${ground-4}) scale(${ratio} 1)"><ellipse rx="${30*ripple}" ry="${4*ripple}" fill="none" stroke="#d7e9d7" stroke-width="1"/>${splash?'<path d="M-17 -2l-3 -7m29 5l4 -8m-1 12l6 -3" stroke="#d8eee2" stroke-width="1.5"/>':''}</g>`:'');
  const foundations=slots.slice(0,2).map(slot=>{
   const base=slot.y+154*slot.s,span=100*slot.s*ratio;
   return `<path d="M${slot.x-10} ${base}h${span}" stroke="#8a8767" stroke-width="5"/><path d="M${slot.x+8} ${base}V${ground}M${slot.x+60*slot.s*ratio} ${base}V${ground}" stroke="#796345" stroke-width="4"/><path d="M${slot.x-14} ${ground}h${span+15}" stroke="#a99976" stroke-width="6"/>`;
  }).join('');markup('woodland-immersive-structures',foundations);
  if(!frozen&&prefs.display.cameraMotion!=='still'){
   // Translate the outer SVG in CSS so its cached art can be composited.
   // An inner SVG camera transform rerasterizes the moving forest at high DPR.
   get('woodland-immersive-world').style.transform=`translate(${(Math.sin(t/47)*9*layout.sx).toFixed(3)}px,${(Math.sin(t/61)*3*layout.sy).toFixed(3)}px)`;
   document.body.style.setProperty('--woodland-ui-x',(Math.sin(t/53)*10).toFixed(2)+'px');document.body.style.setProperty('--woodland-ui-y',(Math.sin(t/79)*4).toFixed(2)+'px');
  }else{get('woodland-immersive-world').style.transform='translate(0px,0px)';document.body.style.setProperty('--woodland-ui-x','0px');document.body.style.setProperty('--woodland-ui-y','0px');}
  attr('woodland-immersive-light','opacity',frozen?'0':(.016+.012*Math.sin(t/39)).toFixed(4));
  DeskWoodlandArt.animate(get('woodland-immersive-world'),t,{reducedMotion:frozen,lowPower:prefs.lowPower});
  return visible()&&!frozen;
 }
 function stop(){clearTimeout(timer);timer=null;if(frame!==null)cancelAnimationFrame(frame);frame=null;}
 function loop(at){
  frame=null;if(!visible())return;const period=1000/30;
  if(prefs.lowPower&&at-lastFrame<period-2){frame=requestAnimationFrame(loop);return;}
  // Pace from the frame actually shown. Catching up an ideal phase after a
  // late frame produces a visible 50ms/16ms alternation on a 60Hz display.
  lastFrame=at;
  if(draw())frame=requestAnimationFrame(loop);
 }
 function sync(){
  stop();const on=active(),wasOn=document.body.classList.contains('woodland-fullscene');if(on!==wasOn)lastLayout='';scene.hidden=!on;document.body.classList.toggle('woodland-fullscene',on);
  if(!on){document.body.classList.remove('woodland-information');return;}
  fit();const animate=draw();if(!visible())return;
  const interval=prefs.lowPower?60000:1000;timer=setTimeout(sync,interval-Date.now()%interval+1);
  if(animate)frame=requestAnimationFrame(loop);
 }
 function refresh(){lastChapter='';lastMinute='';lastCast='';lastLayout='';sync();}
 document.addEventListener('visibilitychange',sync);get('settings').addEventListener('close',sync);
 new MutationObserver(sync).observe(get('settings'),{attributes:true,attributeFilter:['open']});
 window.addEventListener('resize',()=>{lastLayout='';sync();});window.addEventListener('desk-display-change',()=>{lastLayout='';sync();});media?.addEventListener?.('change',sync);
 window.WoodlandScene={sync,refresh,model:DeskWoodlandStory.sample,timing(date){const m=DeskWoodlandStory.sample(date,{format24:prefs.format24});m._minuteStart=date.getTime()-m.second*1000;const p=schedule(m);return {travel:p.travel,descent:p.descent,climbStart:p.climbStart,climbBout:p.climbBout};},get running(){return frame!==null;},get pending(){return timer!==null;}};sync();
})();
