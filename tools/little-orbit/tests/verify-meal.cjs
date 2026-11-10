// SPDX-License-Identifier: LicenseRef-Simpli-Noncommercial-1.0
// Copyright (C) 2026 ilamgumaran and contributors
const {engine,options,url,freezeClock}=require('./runtime.cjs');
const assert=require('node:assert/strict'),path=require('node:path'),{pathToFileURL}=require('node:url');
const portable=pathToFileURL(path.join(__dirname,'..','Little Orbit.html')).href;
const viewports=[{width:854,height:480},{width:1280,height:720},{width:1920,height:1080},{width:390,height:844}];
const stamp=(hour,second)=>new Date(+new Date(`2026-10-05T${String(hour).padStart(2,'0')}:00:00-04:00`)+Math.round(second*1000));
const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
async function verify(browser,target,dpr){
 const context=await browser.newContext({viewport:viewports[0],deviceScaleFactor:dpr,timezoneId:'America/New_York'}),page=await context.newPage(),errors=[];
 try{
  page.on('pageerror',e=>errors.push(e.message));await page.route('https://**',r=>r.abort());
  await page.route('https://api.open-meteo.com/**',r=>r.fulfill({json:{current:{temperature_2m:12,weather_code:65},daily:{temperature_2m_max:[16],temperature_2m_min:[8]}}}));
  await freezeClock(page,stamp(11,28));
  await page.addInitScript(()=>localStorage.setItem('orbit-settings',JSON.stringify({theme:'greenhouse1',unit:'celsius',format24:true,care:false,rest:false,night:false,lowPower:false,display:{woodlandView:'immersive',cameraMotion:'still'}})));
  await page.goto(target);await page.waitForFunction(()=>DeskHabitatWeather?.get().status==='live');
  const at=async instant=>{await page.clock.setSystemTime(instant);await page.evaluate(()=>WoodlandScene.sync());};
  const probe=()=>page.evaluate(()=>{
   const camp=document.querySelector('#woodland-immersive-community'),root=camp.querySelector('[data-layer="community-camp"]'),q=s=>camp.querySelector(s),sage=q('[data-adult="sage"] .character-art'),aster=q('[data-adult="aster"] .character-art'),child=q('[data-child="sprout"] .character-art'),infant=q('[data-infant="pebble"]');
   const box=node=>{const r=typeof node.getBoundingClientRect==='function'?node.getBoundingClientRect():node;return {left:r.left,right:r.right,top:r.top,bottom:r.bottom,width:r.width,height:r.height};};
   const point=(node,p)=>{const v=new DOMPoint(p.x,p.y).matrixTransform(node.getScreenCTM());return {x:v.x,y:v.y};},distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
   const joints=node=>{const v=[...node.getAttribute('d').matchAll(/[-+]?\d*\.?\d+(?:e[-+]?\d+)?/gi)].map(match=>Number(match[0]));return [0,2,4].map(i=>point(node,{x:v[i],y:v[i+1]}));};
   const limbs=name=>['left','right'].map(side=>joints(sage.querySelector(`[data-part="${name}-${side}"]`)));
   const arms=limbs('arm'),legs=limbs('leg'),wrist=arms[1][2],held=q('[data-camp-meal-bowl]'),served=q('[data-meal-served-bowl]'),stand=q('[data-meal-stand]'),greens=q('[data-camp-greens]'),spoon=q('[data-camp-spoon]');
   const isShown=node=>node&&getComputedStyle(node).display!=='none'&&getComputedStyle(node.parentElement).display!=='none'&&Number(getComputedStyle(node).opacity)>.01;
   const actor=document.querySelector('#woodland-immersive-actors'),world=document.querySelector('#woodland-immersive-world'),am=actor.getScreenCTM(),wm=world.getScreenCTM(),projectionError=Math.max(...['a','b','c','d','e','f'].map(k=>Math.abs(am[k]-wm[k])));
   const art={aster:box(aster),pebble:box(infant),sprout:box(child),sage:box(sage)},cradle={left:Math.min(art.aster.left,art.pebble.left),right:Math.max(art.aster.right,art.pebble.right)},characterGaps={childToCradle:cradle.left-art.sprout.right,cradleToSage:art.sage.left-cradle.right};
   let spoonContact=null;if(isShown(spoon)&&spoon.getAttribute('d')){
    const first=point(spoon,spoon.getPointAtLength(0)),tip=point(spoon,spoon.getPointAtLength(spoon.getTotalLength())),pot=box(q('[data-prop="cook-pot"] ellipse'));
    spoonContact={grip:Math.hypot(first.x-wrist.x,first.y-wrist.y),tipInsidePot:tip.x>=pot.left&&tip.x<=pot.right&&tip.y>=pot.top&&tip.y<=pot.bottom};
   }
   const support=Object.entries(DeskCharacters.infantSupportPoints).map(([name,p])=>{const arm=aster.querySelector(`[data-part="arm-${name==='head'?'left':'right'}"]`),hand=point(arm,arm.getPointAtLength(arm.getTotalLength())),baby=point(infant,p);return Math.hypot(hand.x-baby.x,hand.y-baby.y);});
   const story=document.querySelector('#woodland-immersive-story'),range=document.createRange();range.selectNodeContents(story);
   const storyGlyphs=[...range.getClientRects()].filter(r=>r.width>0&&r.height>0).map(box);
   const greensGrip=isShown(greens)?distance(point(greens,{x:0,y:0}),wrist):null;
   const heldRim=point(held,{x:0,y:0}),servedRim=point(served,{x:0,y:0}),servedBottom=point(served,{x:0,y:6}),tabletop=stand.querySelector('[data-meal-stand-top]'),tabletopCenter=point(tabletop,tabletop.getPointAtLength(tabletop.getTotalLength()/2));
   const heldGrip=isShown(held)?distance(heldRim,wrist):null;
   return {routine:root.dataset.routine,stage:root.dataset.mealStage,weight:Number(root.dataset.mealWeight),caption:story.textContent,storyGlyphs,art,characterGaps,actor:box(actor),world:box(world),stand:box(stand),served:box(served),held:box(held),servedRim,servedBottom,tabletopCenter,heldRim,servedOpacity:Number(getComputedStyle(served).opacity),heldVisible:!!isShown(held),greensGrip,heldGrip,spoonContact,arms,legs,wrist,sageRoot:point(q('[data-adult="sage"]'),{x:0,y:0}),support,projectionError,controls:box(document.querySelector('#display nav')),nodeCount:camp.querySelectorAll('*').length};
  });
  const clearOfStory=(g,r)=>g.storyGlyphs.length>0&&g.storyGlyphs.every(text=>{
   const horizontal=Math.max(text.left-r.right,r.left-text.right,0),vertical=Math.max(text.top-r.bottom,r.top-text.bottom,0);
   return Math.max(horizontal,vertical)>=2;
  });
  const stageCases=[['gather',4],['carry',11],['cook',28],['deliver',40],['serve',47],['rest',51],['return',57]];
  let nodeCount;
  for(const viewport of viewports){
   await page.setViewportSize(viewport);
   await at(stamp(10,28));const baseline=await probe();
   assert.equal(baseline.stage,'idle');assert.ok(clearOfStory(baseline,baseline.art.sage)&&clearOfStory(baseline,baseline.stand),'Baseline camp crowds actual story glyphs: '+JSON.stringify({viewport,dpr,baseline}));
   for(const hour of [11,20]){
    for(const [stage,second] of stageCases){
     await at(stamp(hour,second));const g=await probe(),detail=JSON.stringify({viewport,dpr,hour,second,stage,g});
     assert.equal(g.stage,stage,detail);assert.ok(g.weight>.99,'Meal overlay is not visible at stage interior: '+detail);
     assert.ok(g.caption.length>20,'Meal stage has no visible story: '+detail);
     assert.ok(g.support.every(n=>n<.2),'Infant care loses both painted hand contacts: '+detail);
     assert.ok(Object.values(g.characterGaps).every(n=>n>=30),'Family painted groups crowd together: '+detail);
     assert.ok(Object.values(g.art).every(r=>r.left>=16&&r.right<=viewport.width-16&&r.top>=0&&r.bottom<g.controls.top-2),'Character reaches viewport edge or controls: '+detail);
     const within=r=>r.left>=g.actor.left-1&&r.right<=g.actor.right+1&&r.top>=g.actor.top-1&&r.bottom<=g.actor.bottom+1;
     assert.ok(g.actor.width*g.actor.height<g.world.width*g.world.height*.5&&g.projectionError<=.02,'Actor crop/projection diverges: '+detail);
     assert.ok([...Object.values(g.art),g.stand].every(within),'A painted actor or serving stand leaves cropped SVG: '+detail);
     assert.ok(clearOfStory(g,g.art.sage)&&clearOfStory(g,g.stand),'Sage or serving stand crowds the actual story glyphs: '+detail);
     assert.ok(g.stand.left>=16&&g.stand.right<=viewport.width-16&&g.stand.top>=0&&g.stand.bottom<g.controls.top-2,'Serving stand reaches viewport edge or controls: '+detail);
     if(g.servedOpacity>.01)assert.ok(within(g.served),'Served bowl leaves cropped SVG: '+detail);
     if(g.heldVisible)assert.ok(within(g.held)&&g.held.left>=16&&g.held.right<=viewport.width-16&&g.held.bottom<g.controls.top-2,'Held bowl leaves visible camp area: '+detail);
     if(nodeCount===undefined)nodeCount=g.nodeCount;assert.equal(g.nodeCount,nodeCount,'Meal reconstructs DOM nodes: '+detail);
     const lengths=[...g.arms,...g.legs].flatMap(limb=>[distance(limb[0],limb[1]),distance(limb[1],limb[2])]);
     const expected=[12,11,12,11,12,12,12,12].map(n=>n*48/66);
     assert.ok(lengths.every((n,i)=>Math.abs(n-expected[i])<.04),'Sage painted bone lengths change: '+detail);
     if(stage==='gather'||stage==='carry')assert.ok(g.greensGrip!==null&&g.greensGrip<.1,'Gathered food leaves painted hand: '+detail);
     if(stage==='carry'||stage==='deliver')assert.ok(g.heldVisible&&g.heldGrip<.15,'Carried meal leaves painted hand: '+detail);
     if(stage==='cook')assert.ok(g.spoonContact&&g.spoonContact.grip<.1&&g.spoonContact.tipInsidePot,'Cooking spoon leaves wrist or pot: '+detail);
     if(stage==='serve'||stage==='rest'||stage==='return'){
      assert.ok(g.servedOpacity>.5,'Meal is not visibly placed on the serving stand: '+detail);
      assert.ok(distance(g.servedBottom,g.tabletopCenter)<.15,'Served bowl does not rest on the painted tabletop: '+detail);
     }
     if(stage==='gather'||stage==='carry'||stage==='cook'||stage==='deliver')assert.ok(g.servedOpacity<.01,'Served meal appears before Sage serves it: '+detail);
     if(stage==='deliver')assert.ok(Math.abs(g.held.width-g.served.width)<.15&&Math.abs(g.held.height-g.served.height)<.15,'Carried and served bowls change painted shape: '+detail);
    }
    for(const second of [8,16,36,44,49,54,60]){
     await at(stamp(hour,second-.001));const before=await probe();await at(stamp(hour,second+.001));const after=await probe();
     const beforePoints=[...before.arms,...before.legs].flat(),afterPoints=[...after.arms,...after.legs].flat(),jump=Math.max(...beforePoints.map((p,i)=>distance(p,afterPoints[i])));
     assert.ok(jump<.25,'Painted Sage joints jump at meal stage join: '+JSON.stringify({viewport,dpr,hour,second,jump,before:before.stage,after:after.stage}));
     if(second===44)assert.ok(distance(before.heldRim,after.servedRim)<.25,'Held bowl does not transfer to the same painted stand location: '+JSON.stringify({viewport,dpr,hour,before:before.heldRim,after:after.servedRim}));
    }
    for(const start of [38.5,39.5,40.5,41.5,55.5,56.5,57.5,58.5]){
     await at(stamp(hour,start));const before=await probe();await at(stamp(hour,start+.15));const after=await probe();
     const steps=before.legs.map((leg,i)=>distance(leg[2],after.legs[i][2])),rootTravel=distance(before.sageRoot,after.sageRoot),lift=Math.max(...before.legs.map((leg,i)=>Math.abs(leg[2].y-before.legs[1-i][2].y)),...after.legs.map((leg,i)=>Math.abs(leg[2].y-after.legs[1-i][2].y)));
     assert.ok(rootTravel>.15&&Math.min(...steps)<.6&&lift>.5,'Travel slides both painted feet or never lifts a step: '+JSON.stringify({viewport,dpr,hour,start,rootTravel,steps,lift}));
    }
    // Jumping the clock forward and backward must reconstruct the same painted
    // frame at a given instant; the choreography cannot depend on elapsed runs.
    await at(stamp(hour,28));const first=await probe();await at(stamp(hour,51));await at(stamp(hour,10));await at(stamp(hour,28));const again=await probe();
    assert.deepEqual({stage:again.stage,art:again.art,wrist:again.wrist,servedOpacity:again.servedOpacity},{stage:first.stage,art:first.art,wrist:first.wrist,servedOpacity:first.servedOpacity},'Clock jumps change the same authored meal instant');
    await at(stamp(hour,-.001));const preHour=await probe();await at(stamp(hour,.001));const postHour=await probe();
    assert.equal(preHour.stage,'idle');assert.equal(postHour.stage,'idle');
    assert.ok(distance(preHour.wrist,postHour.wrist)<.25,'Meal hour entry snaps the painted working wrist');
    await at(stamp(hour,7199.999));const preEnd=await probe();await at(stamp(hour,7200.001));const postEnd=await probe();
    assert.equal(preEnd.stage,'idle');assert.equal(postEnd.stage,'idle');
    assert.ok(distance(preEnd.wrist,postEnd.wrist)<.25,'Meal hour exit snaps the painted working wrist');
   }
  }
  for(const instant of ['2026-03-08T20:00:28-04:00','2026-11-01T20:00:28-05:00']){
   await at(new Date(instant));const g=await probe();assert.equal(g.stage,'cook','Local meal schedule shifts at DST: '+instant);
   assert.ok(g.spoonContact?.tipInsidePot,'Meal spoon leaves pot after DST: '+instant);
  }
  await page.emulateMedia({reducedMotion:'reduce'});await page.waitForFunction(()=>matchMedia('(prefers-reduced-motion: reduce)').matches);
  for(const viewport of viewports){
   await page.setViewportSize(viewport);
   await at(stamp(11,28));const quiet=await probe();await at(stamp(11,29));const quietLater=await probe();
   assert.equal(quiet.stage,'quiet');assert.deepEqual({art:quiet.art,arms:quiet.arms,legs:quiet.legs},{art:quietLater.art,arms:quietLater.arms,legs:quietLater.legs},'Quiet meal moves on later wall time');
   assert.ok(clearOfStory(quiet,quiet.art.sage)&&clearOfStory(quiet,quiet.stand),'Quiet camp crowds actual story glyphs: '+JSON.stringify({viewport,dpr,quiet}));
  }
  await page.emulateMedia({reducedMotion:'no-preference'});await page.waitForFunction(()=>!matchMedia('(prefers-reduced-motion: reduce)').matches);
  await at(stamp(11,28));const resumed=await probe();assert.equal(resumed.stage,'cook');assert.ok(resumed.spoonContact?.tipInsidePot,'Resumed meal does not restore pot contact');
  await page.evaluate(()=>{prefs.display.companion=false;WoodlandScene.sync();});
  assert.equal(await page.locator('#woodland-immersive-community [data-adult="sage"]').isVisible(),false);
  await page.evaluate(()=>{prefs.display.companion=true;WoodlandScene.sync();});
  assert.equal(await page.locator('#woodland-immersive-community [data-adult="sage"]').isVisible(),true);
  assert.deepEqual(errors,[]);
  console.log('PASS connected meal:',target.startsWith('file:')?'portable':'hosted',`DPR${dpr}`,'seven painted stages, joins, props, support, crop, deterministic jumps and quiet mode.');
 }finally{await context.close();}
}
// Existing cadence cases sample an inactive meal hour. Measure Sage's actual
// painted delivery transform with real timers, RAF and performance.now while
// Date follows a 2.1-second interval entirely inside the moving delivery.
async function verifyMealCadence(browser,target,viewport,dpr){
 const context=await browser.newContext({viewport,deviceScaleFactor:dpr,timezoneId:'America/New_York'}),page=await context.newPage(),errors=[];
 try{
  page.on('pageerror',e=>errors.push(e.message));await page.route('https://**',r=>r.abort());
  await page.route('https://api.open-meteo.com/**',r=>r.fulfill({json:{current:{temperature_2m:12,weather_code:65},daily:{temperature_2m_max:[16],temperature_2m_min:[8]}}}));
  await page.addInitScript(()=>{
   const RealDate=Date;window.__mealClockStart=performance.now();window.__mealClockBase=+new RealDate('2026-10-05T11:08:38-04:00');
   window.Date=class extends RealDate{constructor(...args){super(...(args.length?args:[window.__mealClockBase+performance.now()-window.__mealClockStart]));}static now(){return window.__mealClockBase+performance.now()-window.__mealClockStart;}};
   localStorage.setItem('orbit-settings',JSON.stringify({theme:'greenhouse1',unit:'celsius',format24:true,care:false,rest:false,night:false,lowPower:true,display:{woodlandView:'immersive',cameraMotion:'still'}}));
  });
  await page.goto(target);await page.waitForFunction(()=>DeskHabitatWeather?.get().status==='live');
  await page.evaluate(()=>document.fonts?.ready);await page.waitForTimeout(1000);
  for(const lowPower of [true,false]){
   await page.evaluate(lowPower=>{
    prefs.lowPower=lowPower;window.__mealClockBase=+new Date('2026-10-05T11:08:38-04:00');window.__mealClockStart=performance.now();WoodlandScene.sync();
   },lowPower);
   const result=await page.evaluate(async()=>{
    const camp=document.querySelector('#woodland-immersive-community [data-layer="community-camp"]'),sage=camp.querySelector('[data-adult="sage"]');
    const first=sage.getAttribute('transform'),stageBefore=camp.dataset.mealStage,frames=[];let previous=first;
    const observer=new MutationObserver(()=>{const transform=sage.getAttribute('transform');if(transform!==previous){previous=transform;frames.push(performance.now());}});
    observer.observe(sage,{attributes:true,attributeFilter:['transform']});
    const start=performance.now();await new Promise(resolve=>setTimeout(resolve,2100));observer.disconnect();
    const elapsed=performance.now()-start,gaps=frames.slice(1).map((time,i)=>time-frames[i]).sort((a,b)=>a-b);
    return {fps:frames.length*1000/elapsed,p95:gaps[Math.floor(gaps.length*.95)],maxGap:gaps.at(-1),frames:frames.length,stageBefore,stageAfter:camp.dataset.mealStage,moved:previous!==first};
   });
   assert.ok(result.stageBefore==='deliver'&&result.stageAfter==='deliver'&&result.moved,'Meal cadence sampled no actual Sage delivery: '+JSON.stringify(result));
   assert.ok(result.fps>=(lowPower?26:45),'Meal cadence misses update rate: '+JSON.stringify({viewport,dpr,lowPower,result}));
   assert.ok(result.p95<=(lowPower?46:31)&&result.maxGap<100,'Meal cadence stutters: '+JSON.stringify({viewport,dpr,lowPower,result}));
   console.log('PASS active meal cadence:',target.startsWith('file:')?'portable':'hosted',`${viewport.width}×${viewport.height} DPR${dpr}`,lowPower?'30fps low-power':'60fps normal',JSON.stringify(result));
  }
  assert.deepEqual(errors,[]);
 }finally{await context.close();}
}
(async()=>{
 const browser=await engine.launch({...options,headless:true});
 try{for(const target of [url,portable])for(const dpr of [1,2])await verify(browser,target,dpr);}finally{await browser.close();}
 for(const [target,viewport,dpr] of [[url,{width:854,height:480},1],[portable,{width:1280,height:720},2]]){
  const isolated=await engine.launch({...options,headless:true});
  try{const blank=await isolated.newPage();await blank.goto('about:blank');await blank.waitForTimeout(4000);await blank.close();await verifyMealCadence(isolated,target,viewport,dpr);}finally{await isolated.close();}
 }
})().catch(error=>{console.error(error);process.exit(1);});
