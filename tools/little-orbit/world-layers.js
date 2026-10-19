// SPDX-License-Identifier: LicenseRef-Simpli-Noncommercial-1.0
// Copyright (C) 2026 ilamgumaran and contributors
// Declarative composition: identity, place, activity, relationships and meaning.
(()=>{
 'use strict';
 const freeze=v=>{if(v&&typeof v==='object'){Object.values(v).forEach(freeze);Object.freeze(v);}return v;};
 const mod=(n,d)=>((n%d)+d)%d;
 const numerals=freeze({
  0:'M20 0H60L80 20V130L60 150H20L0 130V20Z',
  1:'M12 25L40 0V150M12 150H68',
  2:'M0 22L20 0H60L80 22V48L0 130V150H80',
  3:'M0 0H80L43 70L80 92V130L60 150H0',
  4:'M55 0L0 95H80M60 0V150',
  5:'M80 0H0V70H60L80 90V130L60 150H0',
  6:'M75 0H25L0 35V130L20 150H60L80 130V88L60 70H0',
  7:'M0 0H80L20 150',
  8:'M40 70L0 45V15L20 0H60L80 15V45L40 70L0 100V135L20 150H60L80 135V100Z',
  9:'M80 80H20L0 60V20L20 0H60L80 20V120L55 150H5'
 });
 const landscapes=freeze({
  woodland:{status:'implemented',numeralMaterial:'Walkable earth trails, timber edging and stone stepping dots',places:[
   {name:'Mosswood',sky:'#dce6d3',hill:'#9aad83',forest:'#486655',ground:'#71885f',water:'#91b4ba',resource:'fallen timber'},
   {name:'Stream Bend',sky:'#dcebea',hill:'#9dbbb0',forest:'#3c6b61',ground:'#799b80',water:'#76abb4',resource:'fresh water'},
   {name:'Fern Hollow',sky:'#e0e8c9',hill:'#a5b784',forest:'#4a7150',ground:'#82945e',water:'#8bb3a4',resource:'berries'},
   {name:'Boulder Pass',sky:'#e3e3da',hill:'#a7ada0',forest:'#506458',ground:'#909784',water:'#91afb4',resource:'stone'},
   {name:'Pine Ridge',sky:'#d6e2de',hill:'#8ea9a2',forest:'#365a55',ground:'#6e8c78',water:'#85abb2',resource:'wind shelter'},
   {name:'Lakeside Clearing',sky:'#e6e8ce',hill:'#b3b995',forest:'#587363',ground:'#879b72',water:'#94bec4',resource:'reeds'},
   {name:'Old Orchard',sky:'#eee3c5',hill:'#babc8c',forest:'#64704c',ground:'#a0a176',water:'#9fb6a0',resource:'fruit'},
   {name:'Return Glade',sky:'#e6d9cf',hill:'#b5ab96',forest:'#64665a',ground:'#969379',water:'#9bb0af',resource:'shared camp'}]},
  industrial:{status:'planned',numeralMaterial:'Steel rails, linked gears and counterweights'},
  weaving:{status:'planned',numeralMaterial:'Continuous woven threads in a large cloth'},
  farming:{status:'planned',numeralMaterial:'Crop rows, irrigation beds and orchard paths'},
  railway:{status:'planned',numeralMaterial:'Junction tracks, platform edges and signal lights'},
  ants:{status:'planned',numeralMaterial:'Nest galleries, earth tunnels and seed chambers'}
 });
 const actions=freeze({
  survey:{role:'trail',pose:'walk',label:'Reading the trail',tool:'map',meaning:'attention'},
  sticks:{role:'bushcraft',pose:'gather',label:'Gathering fallen sticks',tool:'saw',meaning:'enough'},
  shelter:{role:'bushcraft',pose:'build',label:'Raising a small shelter',tool:'tarp',meaning:'care'},
  water:{role:'trail',pose:'water',label:'Filtering creek water',tool:'filter',meaning:'dependence'},
  forage:{role:'hunting',pose:'gather',label:'Gathering berries',tool:'food-bag',meaning:'enough'},
  tree:{role:'climbing',pose:'climb',label:'Climbing with protection',tool:'dynamic-rope',meaning:'limits'},
  rock:{role:'climbing',pose:'climb',label:'Finding a way over stone',tool:'harness',meaning:'limits'},
  fire:{role:'bushcraft',pose:'build',label:'Tending a contained fire',tool:'firesteel',meaning:'transformation'},
  cook:{role:'bushcraft',pose:'cook',label:'Cooking and sharing a meal',tool:'pot',meaning:'dependence'},
  bridge:{role:'bushcraft',pose:'build',label:'Mending a timber crossing',tool:'cord',meaning:'care'},
  rest:{role:'trail',pose:'rest',label:'Watching the woods breathe',tool:'bottle',meaning:'presence'},
  teach:{role:'trail',pose:'teach',label:'Passing a little knowledge on',tool:'map',meaning:'continuity'}
 });
 const philosophies=freeze({
  attention:'A path is easier to read when we stop rushing.',
  enough:'Take enough for today; leave room for tomorrow.',
  care:'A small repair can make another life easier.',
  dependence:'No journey is made entirely alone.',
  limits:'Rest belongs to the journey, too.',
  transformation:'We shape the woods, and the woods shape us.',
  presence:'There was time to watch the light after all.',
  continuity:'What we learn becomes someone else’s beginning.'
 });
 const stories=freeze([
  {id:'alone',name:'A quiet journey',cast:['moss'],morning:'Moss follows a path alone.',realization:'The summit can wait. The creek is here.',evening:'A quiet meal, with room to listen.'},
  {id:'family',name:'A family trail',cast:['moss','ridge','sprout'],morning:'A family makes its way through the woods.',realization:'They put the tools down and watch the light together.',evening:'There is enough food, and time, to share.'},
  {id:'mentor',name:'A lesson on the path',cast:['ridge','sprout'],morning:'Ridge teaches Sprout to read the terrain.',realization:'Today’s lesson: knowing when to stop.',evening:'The learner points out a trail the teacher missed.'},
  {id:'help',name:'An open crossing',cast:['moss','ridge'],morning:'Two travelers repair a crossing for those behind them.',realization:'Their delay becomes someone else’s safe passage.',evening:'A shared shelter feels larger than a private summit.'},
  {id:'urgency',name:'A summit postponed',cast:['ridge'],morning:'Ridge keeps inventing another deadline.',consequence:'Ridge rushes past a broken crossing; the return becomes harder.',repair:'Ridge mends the crossing before settling for the night.',realization:'Ridge notices the sunset that hurry nearly hid.',evening:'The unfinished path will still be there tomorrow.'},
  {id:'reciprocity',name:'The lesson returns',cast:['moss','sprout'],morning:'A younger traveler brings a new way of seeing.',realization:'Moss listens. Teaching can flow both ways.',evening:'Tomorrow, another traveler begins.'}
 ]);
 const recipes=freeze(Object.fromEntries(Object.keys(landscapes).map(id=>[id,{id,landscape:id,status:landscapes[id].status,characters:id==='ants'?[]:['moss','ridge','sprout'],castKinds:id==='ants'?['worker','nurse','forager','larva','queen']:['lead','partner','learner'],storyCycle:stories.map(s=>s.id),philosophy:Object.keys(philosophies)}])));
 const itinerary=freeze(Object.keys(actions));
 function clock(date=new Date(),{format24=false}={}){
  if(!(date instanceof Date)||!Number.isFinite(date.getTime()))throw Error('A valid local date is required');
  const hour=date.getHours(),time=`${String(format24?hour:hour%12||12).padStart(2,'0')}:${String(date.getMinutes()).padStart(2,'0')}`;
  return {time,digits:time.replace(':',''),period:format24?'24H':hour>=12?'PM':'AM'};
 }
 function woodland(date=new Date(),{format24=false}={}){
  if(!(date instanceof Date)||!Number.isFinite(date.getTime()))throw Error('A valid local date is required');
  const hour=date.getHours(),minute=date.getMinutes(),second=date.getSeconds()+date.getMilliseconds()/1000;
  const day=Math.floor(Date.UTC(date.getFullYear(),date.getMonth(),date.getDate())/86400000);
  const story=stories[mod(day,stories.length)],reflection=hour===18;
  const actionId=reflection?['rest','water','cook','teach'][minute%4]:itinerary[minute%itinerary.length];
  const action=actions[actionId],reading=clock(date,{format24});
  const place=landscapes.woodland.places[hour%8];
  return {...reading,hour,minute,second,day,place,story,actionId,action,reflection,
   terrainKey:`${day}:${hour}`,minuteKey:`${day}:${hour}:${minute}`,daylight:hour>=7&&hour<19,
   storyPhase:hour<6?'sleep':hour<12?'intention':hour<18?'consequence':reflection?'realization':'care',
   caption:hour<6?'The camp rests. Tomorrow can wait.':reflection?story.realization:hour>=19?(story.repair||story.evening):hour>=12?(story.consequence||story.morning):story.morning,
   philosophy:reflection?philosophies.presence:philosophies[action.meaning]};
 }
 // Minute activity and per-visit effort are sampled from wall time, never accumulated.
 function performance(model,{duration=12,interval=60,reducedMotion=false}={}){
  const at=(model.hour*3600+model.minute*60+model.second),visit=mod(at,Math.max(30,interval)),running=visit<duration&&!reducedMotion&&model.hour>=6;
  const progress=running?Math.min(1,visit/duration):1;
  const climbing=model.action.pose==='climb'&&running;
  const effort=climbing?DeskCharacters.ascent(progress,Math.max(0,duration-visit)):null;
  return {running,progress,phase:model.second<3&&!reducedMotion&&model.hour>=6?'mark':effort?.resting?'recover':running?'work':'observe',
   pose:model.hour<6?'sleep':effort?.resting?'recover-climb':effort?.action||(!running?(model.action.pose==='climb'?'recover-climb':'rest'):model.action.pose),fatigue:effort?.fatigue||0,assisted:effort?.assisted||false,climb:effort?.progress??(model.action.pose==='climb'?1:0)};
 }
 const ease=t=>{const p=Math.max(0,Math.min(1,t));return p*p*p*(p*(p*6-15)+10);};
 function worksite(model,progress=1,climb=1){
  return {x:model.action.role==='climbing'?57:model.actionId==='water'?541:model.actionId==='forage'?586:model.actionId==='bridge'?453:280+(model.actionId==='survey'?progress*90:0),y:model.action.role==='climbing'?301-climb*56:300};
 }
 // Travel joins the previous endpoint to this visit without jumping to the glyph.
 // A repeated climbing visit begins with a protected return to its lower holds.
 function blocking(model,previous,performanceState,{duration=12,interval=60,reducedMotion=false}={}){
  const p=performanceState,visit=mod(model.hour*3600+model.minute*60+model.second,Math.max(30,interval)),travel=Math.min(3,duration*.25);
  const minuteMove=model.second<travel,elapsed=minuteMove?model.second:visit;
  const moving=!reducedMotion&&model.hour>=6&&(minuteMove||(p.running&&visit<travel));
  const before=minuteMove?performance(previous,{duration,interval}):{progress:1,climb:1,pose:model.action.role==='climbing'?'recover-climb':'rest'};
  const target=worksite(model,p.progress,p.climb),prior=minuteMove?worksite(previous,before.progress,before.climb):worksite(model);
  const source=visit+1e-7>=model.second?worksite(previous):worksite(model);
  const travelAction=model.action.role==='climbing'&&source.x===target.x?'rappel':'walk';
  const amount=moving?ease(elapsed/travel):1;
  const position={x:prior.x+(target.x-prior.x)*amount,y:prior.y+(target.y-prior.y)*amount};
  const cycle=moving?elapsed*1.25:p.progress*3;
  let action=moving?travelAction:p.pose,from=null,fromCycle=cycle,blend=1;
  if(moving){from=before.running&&before.progress>=.94?(previous.action.role==='climbing'?'recover-climb':'rest'):before.pose;fromCycle=before.progress*3;blend=ease(elapsed/Math.min(.35,travel*.25));}
  if(!reducedMotion&&p.running&&!moving){
   const boundary=p.progress<.34?travel/duration:p.progress<.5?.34:p.progress<.94?.5:.94;
   if(model.action.role!=='climbing'&&boundary!==travel/duration){from=null;}
   else{from=boundary===.34?'climb':boundary===.5?'recover-climb':travelAction;fromCycle=boundary===travel/duration?travel*1.25:boundary*3;blend=boundary===travel/duration?ease((visit-travel)/.35):ease((p.progress-boundary)/.03);}
   if(p.progress>=.94){action=model.action.role==='climbing'?'recover-climb':'rest';from=p.pose;blend=ease((p.progress-.94)/.06);}
  }
  // Minute travel can occur between work visits, then settle without a pose snap.
  if(!moving&&!reducedMotion&&model.second>=travel&&model.second<travel+.35){from=travelAction;fromCycle=travel*1.25;blend=ease((model.second-travel)/.35);}
  if(model.hour<6){action='sleep';position.x=worksite(model).x;position.y=300;}
  return {position,action,cycle,from,fromCycle,blend,moving,settling:from!==null&&blend<1};
 }
 globalThis.DeskWorlds=freeze({numerals,landscapes,actions,philosophies,stories,recipes,itinerary,clock,woodland,performance,blocking});
})();
