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
 // Authored foreground boulder sockets; the rig samples these actual world holds.
 const routes=freeze({woodlandWalk:{scale:.72,origin:{x:280,y:300},groundY:318.72,steps:10,stride:9},woodlandRock:{scale:.72,anchor:{x:58,y:206},stations:Array.from({length:8},(_,row)=>{
  const root={x:57,y:301-row*8*.72},station={root};
  for(const [name,x,y] of [['leftHand',-12,-20],['leftFoot',-12,26],['rightHand',12,-20],['rightFoot',12,26]])station[name]={id:`rock-${name}-${row}`,x:root.x+x*.72,y:root.y+y*.72};
  return station;
 })}});
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
 // Travel has its own body-scale pace; work begins on arrival instead of using
 // up the effort/recovery budget during a crossing. Each configured visit starts
 // with its crossing; effort ends before the next visit or the quiet final five
 // seconds. Woodland starts a fresh chapter at each minute for clock readability.
 function motionTiming(model,{distance=0,duration=12,interval=60,reducedMotion=false}={}){
  const span=Math.max(0,Number.isFinite(distance)?distance:0),travel=Math.max(1,Math.min(20,span/50));
  const requested=Math.max(0,Number.isFinite(duration)?duration:12),repeat=Math.max(30,Number.isFinite(interval)?interval:60);
  const visitStart=Math.floor(model.second/repeat)*repeat,workStart=visitStart+travel;
  const available=Math.max(0,Math.min(requested,repeat-travel,55-workStart)),workDuration=available>=4?available:0;
  const quiet=reducedMotion||model.hour<6,traveling=!quiet&&workDuration>=4&&model.second<workStart&&model.second<55;
  const elapsed=traveling?model.second-visitStart:Math.max(0,model.second-workStart);
  const running=!quiet&&!traveling&&workDuration>=4&&model.second<workStart+workDuration&&model.second<55;
  const progress=traveling?0:running?elapsed/workDuration:1,climbing=model.action.pose==='climb';
  const effort=climbing&&running?DeskCharacters.ascent(progress,Math.max(0,workDuration-elapsed)):null;
  const assisted=!!effort&&!effort.resting&&progress>.85&&workDuration-elapsed<=1.5;
  return {travel,traveling,running,progress,climb:traveling?0:effort?.progress??(climbing?1:0),fatigue:effort?.fatigue||0,assisted,
   pose:model.hour<6?'sleep':traveling?'walk':effort?.resting?'recover-climb':assisted?'assist':effort?.action||(running?model.action.pose:climbing?'recover-climb':'rest'),
   phase:traveling?'travel':effort?.resting?'recover':running?'work':'observe',visitStart,workStart,workDuration,elapsed};
 }
 const ease=t=>{const p=Math.max(0,Math.min(1,t));return p*p*p*(p*(p*6-15)+10);};
 // Ease velocity at departure/arrival, with a steady cruise on long crossings.
 // Integrating the quintic velocity keeps position, velocity and acceleration
 // continuous without doubling the walking speed halfway across the woods.
 function travelProgress(elapsed,duration){
  const at=Math.max(0,Math.min(1,elapsed/duration)),ramp=Math.min(.2,1/duration);
  const integral=t=>t*t*t*t*(t*t-3*t+2.5);
  return at<ramp?ramp*integral(at/ramp)/(1-ramp):at>1-ramp?1-ramp*integral((1-at)/ramp)/(1-ramp):(at-ramp/2)/(1-ramp);
 }
 function worksite(model,progress=1,climb=1){
  return {x:model.action.role==='climbing'?57:model.actionId==='water'?541:model.actionId==='forage'?586:model.actionId==='bridge'?453:280+(model.actionId==='survey'?progress*90:0),y:model.action.role==='climbing'?301-climb*56:300};
 }
 // Travel joins the previous endpoint to this visit without jumping to the glyph.
 // A repeated climbing visit begins with a protected return to its lower holds.
 function blocking(model,previous,performanceState,{duration=12,interval=60,reducedMotion=false,siteAt=worksite,target:site=null,prior:priorSite=null}={}){
  const p=performanceState,visit=mod(model.hour*3600+model.minute*60+model.second,Math.max(30,interval)),travel=Math.min(3,duration*.25);
  const minuteMove=model.second<travel,elapsed=minuteMove?model.second:visit;
  const moving=!reducedMotion&&model.hour>=6&&(minuteMove||(p.running&&visit<travel));
  const before=minuteMove?performance(previous,{duration,interval}):{progress:1,climb:1,pose:model.action.role==='climbing'?'recover-climb':'rest'};
  const target=site||siteAt(model,p.progress,p.climb),prior=priorSite||(minuteMove?siteAt(previous,before.progress,before.climb):siteAt(model));
  const source=visit+1e-7>=model.second?siteAt(previous):siteAt(model);
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
  if(model.hour<6){action='sleep';position.x=siteAt(model).x;position.y=300;}
  return {position,action,cycle,from,fromCycle,blend,moving,travel,elapsed,settling:from!==null&&blend<1};
 }
 globalThis.DeskWorlds=freeze({numerals,routes,landscapes,actions,philosophies,stories,recipes,itinerary,clock,woodland,performance,motionTiming,travelProgress,worksite,blocking});
})();

// Full-scene authored choreography is a separate composition API. It samples
// current wall time; it neither changes the clock contract nor accumulates a
// fictional resource ledger while the page is closed.
(()=>{
 'use strict';
 const freeze=v=>{if(v&&typeof v==='object'){Object.values(v).forEach(freeze);Object.freeze(v);}return v;};
 const clamp=n=>Math.max(0,Math.min(1,n)),mod=(n,d)=>((n%d)+d)%d;
 const worlds=globalThis.DeskWorlds;
 const materials=freeze(['leaf','stone','wood','sand']);
 const activities=freeze([
  {id:'paving',label:'Seating the minute trail',role:'bushcraft',pose:'build',tool:'work-gloves',zone:'trail',site:{x:560,y:310}},
  {id:'gather-sticks',label:'Gathering fallen sticks',role:'bushcraft',pose:'gather',tool:'work-gloves',zone:'forest',site:{x:222,y:297}},
  {id:'pitch-tent',label:'Tensioning the camp shelter',role:'bushcraft',pose:'build',tool:'cord',zone:'camp',site:{x:328,y:304}},
  {id:'filter-water',label:'Filtering water at the creek',role:'trail',pose:'water',tool:'filter',zone:'bank',site:{x:582,y:281}},
  {id:'forage',label:'Gathering a little fruit',role:'hunting',pose:'gather',tool:'food-bag',zone:'forest',site:{x:687,y:283}},
  {id:'protected-climb',label:'Climbing with secured recovery',role:'climbing',pose:'climb',tool:'dynamic-rope',zone:'cliff',site:{x:57,y:301}},
  {id:'stone-work',label:'Fitting prepared trail stones',role:'bushcraft',pose:'build',tool:'work-gloves',zone:'trail',site:{x:455,y:293}},
  {id:'tend-fire',label:'Tending the small camp hearth',role:'bushcraft',pose:'build',tool:'firesteel',zone:'camp',site:{x:348,y:306}},
  {id:'cook',label:'Cooking at camp',role:'bushcraft',pose:'cook',tool:'spoon',zone:'camp',site:{x:382,y:306}},
  {id:'repair-crossing',label:'Mending a timber crossing',role:'bushcraft',pose:'build',tool:'cord',zone:'bank',site:{x:548,y:294}},
  {id:'rest',label:'Resting beside the trail',role:'trail',pose:'rest',tool:'bottle',zone:'camp',site:{x:293,y:304}},
  {id:'teach',label:'Sharing a trail lesson',role:'trail',pose:'teach',tool:'map',zone:'camp',site:{x:445,y:307}}
 ]);
 const geometry=new Map();
 // The canonical clock uses only M/L/H/V/Z. Split strokes explicitly, so the
 // disconnected foot of 1 and bar of 4 never acquire a fictitious diagonal.
 function points(digit,{step=8}={}){
  const key=String(digit);
  if(!Object.hasOwn(worlds.numerals,key))throw Error('A canonical digit from 0 to 9 is required');
  if(!Number.isFinite(step)||step<=0||step<.25)throw Error('Point spacing must be finite and at least 0.25');
  const cacheKey=key+':'+step;if(geometry.has(cacheKey))return geometry.get(cacheKey);
  const tokens=worlds.numerals[key].match(/[MLHVZ]|-?\d+(?:\.\d+)?/g),segments=[],starts=[];
  let i=0,at={x:0,y:0},start=null,stroke=-1,command='',total=0;
  while(i<tokens.length){
   if(/^[MLHVZ]$/.test(tokens[i]))command=tokens[i++];
   if(command==='M'){
    at={x:Number(tokens[i++]),y:Number(tokens[i++])};start={...at};stroke++;starts.push({...at,stroke,distance:total});command='L';
   }else{
    const next=command==='L'?{x:Number(tokens[i++]),y:Number(tokens[i++])}:command==='H'?{x:Number(tokens[i++]),y:at.y}:command==='V'?{x:at.x,y:Number(tokens[i++])}:start;
    const length=Math.hypot(next.x-at.x,next.y-at.y);
    if(length){segments.push({from:at,to:next,length,stroke,distance:total});total+=length;}
    at={...next};if(command==='Z')command='';
   }
  }
  const out=[];
  for(const s of starts){
   out.push({x:s.x,y:s.y,stroke:s.stroke,fraction:total?s.distance/total:0});
   for(const segment of segments.filter(item=>item.stroke===s.stroke)){
    const count=Math.max(1,Math.ceil(segment.length/step));
    for(let n=1;n<=count;n++){
     const t=n/count;out.push({x:segment.from.x+(segment.to.x-segment.from.x)*t,y:segment.from.y+(segment.to.y-segment.from.y)*t,stroke:s.stroke,fraction:(segment.distance+segment.length*t)/total});
    }
   }
  }
  const result=freeze(out);geometry.set(cacheKey,result);return result;
 }
 function sample(date=new Date(),{format24=false}={}){
  const model=worlds.woodland(date,{format24}),within=mod(model.second,20),beat=Math.floor(model.second/20),progress=within/20;
  const night=model.hour<6,reflection=model.reflection;
  const selected=activities[reflection?[10,3,8,11][model.minute%4]:model.minute%activities.length];
  const climbing=selected.id==='protected-climb'&&!night;
  const phase=night?'sleep':within<3?'prepare':climbing?(within<7.5?'work':within<11.5?'recover':within<17?'work':'settle'):within<11?'work':within<15?'recover':'settle';
  // Three small pitches form one continuous ascent; 20-second bout boundaries
  // advance from the previous station rather than teleporting to the ground.
  const climbSample=within<3?0:within<7.5?(within-3)/4.5*.34:within<11.5?.34+(within-7.5)/4*.16:.5+clamp((within-11.5)/5.5)*.5;
  const ascent=climbing?globalThis.DeskCharacters.ascent(climbSample,17-within):null;
  if(ascent&&phase!=='work'){ascent.assisted=false;ascent.resting=true;ascent.action='rest';}
  const effort=ascent?{...ascent,progress:(beat+ascent.progress)/3}: {progress:night?0:progress,fatigue:night?0:phase==='recover'?.18:phase==='work'?.38:.24,resting:night||['prepare','recover','settle'].includes(phase)||selected.id==='rest',assisted:false};
  const work={...selected,site:{...selected.site},bout:beat,effort,pose:night?'sleep':climbing&&['prepare','recover','settle'].includes(phase)?'recover-climb':ascent?.assisted?'assist':ascent?.action||(['recover','settle'].includes(phase)?'rest':selected.pose)};
  if(night){work.site={x:293,y:304};work.zone='camp';work.role='trail';work.tool='bottle';work.label='The camp sleeps';}
  const cast=[...model.story.cast],registry=globalThis.DeskCharacters.identities;
  const adultIds=cast.filter(id=>!registry[id]?.young),childIds=cast.filter(id=>registry[id]?.young);
  const lead=adultIds[0]||'moss',helper=adultIds[1]||null,learner=childIds[0]||null,supervisor=learner?(helper||lead):null;
  const bankSupervision=!!helper||work.zone==='bank';
  const kidActivity=night?'sleep':reflection?'observe':selected.id==='teach'?'learn':bankSupervision?['water-edge-play','sand-build','shallow-wade'][mod(model.minute+beat,3)]:'observe';
  const interaction=night?'sleep':reflection?'notice-together':selected.id==='cook'?(cast.length>1?'share-food':'quiet-meal'):selected.id==='teach'?(learner?'teach-and-listen':'inspect-map'):helper?'cooperate':learner?'guide-and-observe':'solo-work';
  const social={id:model.story.id,relationship:model.story.id,cast,lead,helper,learner,supervisor,kidActivity,interaction};
  const leadSite={id:lead,...work.site,zone:work.zone,role:work.role,pose:work.pose,protected:climbing,resting:effort.resting||phase==='settle',fatigue:effort.fatigue,climb:climbing?effort.progress:0};
  const helpers=adultIds.slice(1).map((id,index)=>{
   const elder=!!registry[id]?.elder,supervising=supervisor===id;
   return {id,x:supervising?619:work.site.x+35+index*24,y:supervising?286:work.site.y,zone:supervising?'bank':work.zone,role:'trail',pose:night?'sleep':elder||phase==='recover'?'rest':supervising?'teach':'camp',elder,resting:night||elder||phase==='recover',supervising,fatigue:elder?.12:.22};
  });
  const children=childIds.map((id,index)=>({id,x:bankSupervision?638+index*18:climbing?91+index*18:work.site.x+28+index*18,y:bankSupervision?290:climbing?307:Math.max(290,work.site.y),zone:night?'camp':bankSupervision?'shallow-bank':work.zone,role:'trail',pose:night?'sleep':kidActivity==='sand-build'?'gather':kidActivity==='shallow-wade'?'walk':'teach',activity:kidActivity,supervisor,waterDepth:kidActivity==='shallow-wade'?'ankle':'dry',protected:false}));
  if(night){helpers.forEach((person,index)=>{person.x=331+index*30;person.y=304;person.zone='camp';});children.forEach((person,index)=>{person.x=352+index*18;person.y=312;person.waterDepth='dry';});}
  const material=materials[model.minute%materials.length],minuteMaterial={ones:material,tens:Math.floor(model.minute/10)%2?'wood':'sand'},hourMaterial=model.hour%2?'stone':'wood';
  const craft={digitIndex:3,material,task:material==='sand'?'rake':material==='leaf'?'float':'place',phase,progress:night?1:progress,targetFraction:mod(model.day*.031+model.hour*.023+model.minute*.071+beat/3,1),deliveryFraction:night?1:clamp((within-3)/8)};
  return {...model,dateDigits:String(date.getDate()).padStart(2,'0'),dateMaterial:'wood',chapter:{id:model.place.name.toLowerCase().replaceAll(' ','-'),name:model.place.name,index:model.hour%8,hour:model.hour,terrainKey:model.terrainKey},work,social,material,minuteMaterial,hourMaterial,beat,phase,progress,reflection,riverFlow:mod(model.hour*3600+model.minute*60+model.second,8)/8,craft,
   site:{lead:leadSite,helpers,children,river:{shallow:true,fast:false,depth:'ankle',supervised:!children.length||!!supervisor}}};
 }
 globalThis.DeskWoodlandStory=freeze({activities,materials,points,sample});
})();
