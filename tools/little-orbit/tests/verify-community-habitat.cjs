// SPDX-License-Identifier: LicenseRef-Simpli-Noncommercial-1.0
// Copyright (C) 2026 ilamgumaran and contributors
const {engine,options,url,freezeClock}=require('./runtime.cjs');
const assert=require('node:assert/strict'),path=require('node:path'),{pathToFileURL}=require('node:url');
const portable=pathToFileURL(path.join(__dirname,'..','Little Orbit.html')).href;
const stamp=(hour,second=28)=>new Date(`2026-10-05T${String(hour).padStart(2,'0')}:08:${String(second).padStart(2,'0')}-04:00`);
async function verify(browser,target,dpr){
 const context=await browser.newContext({viewport:{width:854,height:480},deviceScaleFactor:dpr,timezoneId:'America/New_York'}),page=await context.newPage(),errors=[];
 try{
  page.on('pageerror',e=>errors.push(e.message));await page.route('https://**',r=>r.abort());
  await page.route('https://api.open-meteo.com/**',r=>r.fulfill({json:{current:{temperature_2m:12,weather_code:65},daily:{temperature_2m_max:[16],temperature_2m_min:[8]}}}));
  await freezeClock(page,stamp(10));
  await page.addInitScript(()=>localStorage.setItem('orbit-settings',JSON.stringify({theme:'greenhouse1',unit:'celsius',format24:true,care:false,rest:false,night:false,lowPower:false,display:{woodlandView:'immersive',cameraMotion:'still'}})));
  await page.goto(target);await page.waitForFunction(()=>DeskHabitatWeather?.get().status==='live');
  const at=async date=>{await page.clock.setSystemTime(date);await page.evaluate(()=>WoodlandScene.sync());};
  const geometry=()=>page.evaluate(()=>{
   const camp=document.querySelector('#woodland-immersive-community'),infant=camp.querySelector('[data-infant="pebble"]'),aster=camp.querySelector('[data-adult="aster"] .character-art');
   const actorSvg=document.querySelector('#woodland-immersive-actors'),worldSvg=document.querySelector('#woodland-immersive-world');
   const point=(node,p)=>{const q=new DOMPoint(p.x,p.y).matrixTransform(node.getScreenCTM());return {x:q.x,y:q.y};};
   const wrist=name=>{const n=aster.querySelector(`[data-part="arm-${name}"]`),p=n.getPointAtLength(n.getTotalLength());return point(n,p);};
   const sockets=DeskCharacters.infantSupportPoints;
   const rect=node=>{const r=node.getBoundingClientRect();return {left:r.left,right:r.right,top:r.top,bottom:r.bottom,width:r.width,height:r.height};};
   const actorRect=rect(actorSvg),inside=({x,y})=>x>=actorRect.left-1&&x<=actorRect.right+1&&y>=actorRect.top-1&&y<=actorRect.bottom+1;
   const supportPoints=Object.entries(sockets).map(([key,p])=>{const a=point(infant,p),b=wrist(key==='head'?'left':'right');return {distance:Math.hypot(a.x-b.x,a.y-b.y),inside:inside(a)&&inside(b)};});
   const support=supportPoints.map(entry=>entry.distance),supportInside=supportPoints.every(entry=>entry.inside);
   const painted=[...camp.querySelectorAll('[data-adult] .character-art,[data-infant="pebble"],[data-child="sprout"] .character-art,[data-prop],[data-community-tool]')].map((node,index)=>({name:node.getAttribute('data-character')||node.getAttribute('data-prop')||node.getAttribute('data-community-tool')||node.getAttribute('data-infant')||node.getAttribute('data-child')||`${node.tagName}:${index}`,rect:rect(node)})).filter(({rect:r})=>r.width>0&&r.height>0);
   const face=infant.querySelector('[data-infant-art] path:nth-child(2)'),faceBox=face.getBBox(),faceCenter=point(face,{x:faceBox.x+faceBox.width/2,y:faceBox.y+faceBox.height/2}),faceHit=document.elementFromPoint(faceCenter.x,faceCenter.y);
   const actorMatrix=actorSvg.getScreenCTM(),worldMatrix=worldSvg.getScreenCTM();
   const projectionError=Math.max(...['a','b','c','d','e','f'].map(key=>Math.abs(actorMatrix[key]-worldMatrix[key])));
   const plane=point(camp.querySelector('[data-layer="community-camp"]'),{x:0,y:30});
   const adults=[...camp.querySelectorAll('[data-adult] > g > .character-art')].map(n=>{const m=n.getScreenCTM();return {id:n.dataset.character,ratio:Math.hypot(m.a,m.b)/Math.hypot(m.c,m.d),rect:rect(n),feet:['left','right'].map(side=>{const leg=n.querySelector(`[data-part="leg-${side}"]`);return Math.abs(point(leg,leg.getPointAtLength(leg.getTotalLength())).y-plane.y);})};});
   let spoon=null;const line=camp.querySelector('[data-camp-spoon]');
   if(line&&getComputedStyle(line).display!=='none'&&getComputedStyle(line.parentElement).display!=='none'){
    const a=point(line,line.getPointAtLength(0)),w=camp.querySelector('[data-adult="sage"] [data-part="arm-right"]'),b=point(w,w.getPointAtLength(w.getTotalLength())),end=point(line,line.getPointAtLength(line.getTotalLength())),pot=rect(camp.querySelector('[data-prop="cook-pot"] ellipse'));
    spoon={grip:Math.hypot(a.x-b.x,a.y-b.y),inside:end.x>=pot.left&&end.x<=pot.right&&end.y>=pot.top&&end.y<=pot.bottom,insideActor:inside(a)&&inside(b)&&inside(end)};
   }
   return {routine:camp.dataset.routine,support,supportInside,baby:rect(infant),adults,spoon,actorRect,worldRect:rect(worldSvg),painted,projectionError,faceHit:{withinActor:!!faceHit&&actorSvg.contains(faceHit),withinInfant:!!faceHit&&infant.contains(faceHit)},count:camp.querySelectorAll('*').length,controls:rect(document.querySelector('#display nav')),time:document.querySelector('#woodland-immersive').dataset.time,infantEquipment:infant.querySelector('.character-pack,.character-harness,[data-part^="leg-"]')!==null,caption:document.querySelector('#woodland-immersive-story').textContent};
  });
  let count;
  for(const viewport of [{width:854,height:480},{width:1280,height:720},{width:1920,height:1080},{width:390,height:844}]){
   await page.setViewportSize(viewport);
   for(const [hour,routine] of [[3,'rest'],[7,'shelter'],[9,'forage'],[12,'cook'],[14,'teach'],[16,'care'],[18,'remember'],[21,'care'],[23,'rest']]){
    await at(stamp(hour));const g=await geometry();
    assert.equal(g.routine,routine,JSON.stringify({hour,g}));assert.equal(g.time,`${String(hour).padStart(2,'0')}:08`);
    assert.ok(g.support.length===2&&g.support.every(e=>e<.2),'Caregiver loses head/body support: '+JSON.stringify({viewport,hour,g}));
    assert.equal(g.infantEquipment,false);assert.ok(g.baby.width>=12&&g.baby.height>=8,JSON.stringify({viewport,hour,g}));
    assert.ok(g.baby.left>=0&&g.baby.right<=viewport.width&&g.baby.top>=0&&g.baby.bottom<g.controls.top-2,JSON.stringify({viewport,hour,g}));
    // Folded knees reduce a figure's painted height; the nominal adult scale
    // is checked through its equal screen axes, and its folded form stays visible.
    assert.ok(g.adults.length===2&&g.adults.every(a=>Math.abs(a.ratio-1)<.015&&a.rect.height>=35&&a.rect.bottom<g.controls.top),JSON.stringify({viewport,hour,g}));
    assert.ok(g.adults.every(a=>a.feet.every(error=>error<.06)),'Camp feet lose their support plane: '+JSON.stringify({viewport,hour,g}));
    if(hour===12||hour===21)assert.ok(g.spoon?.grip<.06&&g.spoon.inside,'Cooking spoon leaves its wrist or pot: '+JSON.stringify({viewport,hour,g}));
    // The family and its active props must remain painted inside the actual
    // actor SVG after its viewport is cropped. Check visible bounds and screen
    // projection instead of repeating the scene's crop calculation.
    const within=r=>r.left>=g.actorRect.left-1&&r.right<=g.actorRect.right+1&&r.top>=g.actorRect.top-1&&r.bottom<=g.actorRect.bottom+1;
    assert.ok(g.actorRect.width*g.actorRect.height<g.worldRect.width*g.worldRect.height*.5,'Green House actor viewport is not cropped: '+JSON.stringify({viewport,hour,g}));
    assert.ok(g.projectionError<=.02,'Actor and landscape screen projections diverge: '+JSON.stringify({viewport,hour,g}));
    assert.ok(['aster','sage','sprout','pebble'].every(name=>g.painted.some(part=>part.name===name)),'A family member has no painted bounds: '+JSON.stringify({viewport,hour,g}));
    assert.ok(g.painted.every(part=>within(part.rect)),'Camp character or prop is clipped: '+JSON.stringify({viewport,hour,g}));
    assert.ok(g.supportInside&&g.spoon?.insideActor!==false,'Visible care or tool contact leaves actor viewport: '+JSON.stringify({viewport,hour,g}));
    assert.ok(g.faceHit.withinActor,'Painted infant face is occluded outside the actor layer: '+JSON.stringify({viewport,hour,g}));
    if(hour===12||hour===16)assert.ok(g.faceHit.withinInfant,'Painted infant face cannot be hit during care: '+JSON.stringify({viewport,hour,g}));
    if(count===undefined)count=g.count;assert.equal(g.count,count,'Community reconstructs its actors during ordinary frames');
    if(routine==='remember')assert.match(g.caption,/Fern/);
   }
  }
  await at(stamp(12,28));const before=await geometry();await at(new Date(+stamp(12,28)+250));const after=await geometry();
  assert.notDeepEqual(before.baby,after.baby,'Supported infant care has no gentle motion');
  await page.emulateMedia({reducedMotion:'reduce'});await page.waitForFunction(()=>matchMedia('(prefers-reduced-motion: reduce)').matches);
  await at(stamp(12,28));const still=await geometry();await at(stamp(12,29));const later=await geometry();
  assert.deepEqual(still.baby,later.baby,'Reduced motion rocks the infant');assert.ok(later.support.every(e=>e<.2));
  await page.evaluate(()=>{prefs.display.companion=false;WoodlandScene.sync();});
  assert.equal(await page.locator('#woodland-immersive-community [data-adult="aster"]').isVisible(),false);
  assert.equal(await page.locator('#woodland-immersive-community [data-child="sprout"]').isVisible(),false);
  assert.equal(await page.locator('#woodland-immersive-community [data-prop="shelter"]').isVisible(),true);
  assert.equal(await page.locator('#woodland-weather-thermometer').isVisible(),true);
  await page.evaluate(()=>{prefs.display.companion=true;WoodlandScene.sync();});
  assert.equal(await page.locator('#woodland-immersive-community').isVisible(),true);
  assert.equal(await page.locator('#woodland-immersive-community [data-child="sprout"]').isVisible(),true);
  for(const time of ['2026-10-05T09:59:59-04:00','2026-10-05T10:00:00-04:00','2026-10-05T23:59:59-04:00','2026-10-06T00:00:00-04:00']){
   await at(new Date(time));
   const reading=await page.evaluate(()=>({digits:[...document.querySelectorAll('#woodland-immersive-numerals > g')].map(g=>g.dataset.digit).join(''),expected:DeskWorlds.clock(new Date(),{format24:true}).digits,day:document.querySelector('#woodland-immersive').dataset.date,expectedDay:String(new Date().getDate()).padStart(2,'0')}));
   assert.equal(reading.digits,reading.expected);assert.equal(reading.day,reading.expectedDay);
  }
  await page.evaluate(()=>{prefs.theme='woodland';prefs.display.woodlandView='immersive';applyTheme();});
  assert.equal(await page.locator('#woodland-immersive-community').isVisible(),false);
  assert.equal(await page.locator('#woodland-weather-thermometer').isVisible(),false);
  assert.equal(await page.locator('#woodland-immersive-cast').isVisible(),true);
  const woodlandActor=await page.evaluate(()=>{
   const actor=document.querySelector('#woodland-immersive-actors'),world=document.querySelector('#woodland-immersive-world'),a=actor.getBoundingClientRect(),w=world.getBoundingClientRect(),am=actor.getScreenCTM(),wm=world.getScreenCTM();
   return {viewBoxMatches:actor.getAttribute('viewBox')===world.getAttribute('viewBox'),rectError:Math.max(...['left','right','top','bottom','width','height'].map(key=>Math.abs(a[key]-w[key]))),projectionError:Math.max(...['a','b','c','d','e','f'].map(key=>Math.abs(am[key]-wm[key])))};
  });
  assert.ok(woodlandActor.viewBoxMatches&&woodlandActor.rectError<=1&&woodlandActor.projectionError<=.02,'Woodland actor SVG did not regain its full viewport: '+JSON.stringify(woodlandActor));
  assert.equal(await page.locator('#woodland-immersive-weather [data-weather-particle]').count(),0,'Green House weather leaked into Woodland');
  assert.equal(await page.evaluate(()=>{
   const backdrop=document.querySelector('#woodland-immersive-backdrop').firstElementChild;
   DeskHabitatWeather.publish({current:{temperature_2m:3,weather_code:75},unit:'celsius',status:'live',at:Date.now()});
   return document.querySelector('#woodland-immersive-backdrop').firstElementChild===backdrop;
  }),true,'Weather refresh reconstructs the unrelated Woodland landscape');
  await page.evaluate(()=>{prefs.theme='greenhouse1';prefs.display.woodlandView='dashboard';applyTheme();});
  assert.equal(await page.locator('#woodland-immersive').isVisible(),true,'Woodland dashboard preference disables Green House 1');
  assert.equal(await page.locator('#woodland-weather-thermometer').isVisible(),true);
  const returned=await geometry();
  assert.ok(returned.actorRect.width*returned.actorRect.height<returned.worldRect.width*returned.worldRect.height*.5&&returned.projectionError<=.02&&returned.painted.every(part=>{
   const r=part.rect,a=returned.actorRect;return r.left>=a.left-1&&r.right<=a.right+1&&r.top>=a.top-1&&r.bottom<=a.bottom+1;
  }), 'Green House family is clipped after switching back from Woodland: '+JSON.stringify(returned));
  await page.evaluate(()=>{const host=document.createElementNS('http://www.w3.org/2000/svg','g');DeskCharacters.mount(host,DeskCharacters.create('pebble',{role:'infant'}));if(!host.querySelector('[data-infant-art]')||host.querySelector('[data-part^="leg-"]'))throw Error('Shared infant renderer uses adult anatomy');});
  assert.deepEqual(errors,[]);
  console.log('PASS community habitat:',target.startsWith('file:')?'portable':'hosted',`DPR${dpr}`, 'daily routines, painted head/body support, four viewports, proportions, reduced motion, companions and central infant art.');
 }finally{await context.close();}
}
// Sample painted joints across every daily routine boundary. A pose can keep
// the same bones and planted feet yet still snap the working wrist to a new
// socket, so continuity is checked from the actual SVG path on screen.
async function verifyRoutineTransitions(browser,target,dpr){
 const context=await browser.newContext({viewport:{width:854,height:480},deviceScaleFactor:dpr,timezoneId:'America/New_York'}),page=await context.newPage(),errors=[];
 try{
  page.on('pageerror',error=>errors.push(error.message));
  await page.route('https://**',route=>route.abort());
  await page.route('https://api.open-meteo.com/**',route=>route.fulfill({json:{current:{temperature_2m:12,weather_code:65},daily:{temperature_2m_max:[16],temperature_2m_min:[8]}}}));
  await freezeClock(page,stamp(10));
  await page.addInitScript(()=>localStorage.setItem('orbit-settings',JSON.stringify({theme:'greenhouse1',unit:'celsius',format24:true,care:false,rest:false,night:false,lowPower:false,display:{woodlandView:'immersive',cameraMotion:'still'}})));
  await page.goto(target);await page.waitForFunction(()=>DeskHabitatWeather?.get().status==='live');
  const geometry=()=>page.evaluate(()=>{
   const camp=document.querySelector('#woodland-immersive-community'),sage=camp.querySelector('[data-adult="sage"] .character-art');
   const screen=(node,x,y)=>{const p=new DOMPoint(x,y).matrixTransform(node.getScreenCTM());return {x:p.x,y:p.y};};
   const joints=node=>{const values=[...node.getAttribute('d').matchAll(/[-+]?\d*\.?\d+(?:e[-+]?\d+)?/gi)].map(match=>Number(match[0]));return [0,2,4].map(i=>screen(node,values[i],values[i+1]));};
   const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
   const arm=joints(sage.querySelector('[data-part="arm-right"]'));
   const legs=['left','right'].map(side=>joints(sage.querySelector(`[data-part="leg-${side}"]`)));
   const lengths=[distance(arm[0],arm[1]),distance(arm[1],arm[2]),...legs.flatMap(leg=>[distance(leg[0],leg[1]),distance(leg[1],leg[2])])];
   const ridge=camp.querySelector('[data-prop="ridge-line"]'),ridgeValues=[...ridge.getAttribute('d').matchAll(/[-+]?\d*\.?\d+(?:e[-+]?\d+)?/gi)].map(match=>Number(match[0]));
   const ridgeEnd=screen(ridge,ridgeValues[2],ridgeValues[3]);
   const opacity=selector=>{const node=camp.querySelector(selector);return node&&getComputedStyle(node).display!=='none'&&getComputedStyle(node.parentElement).display!=='none'?Number(getComputedStyle(node).opacity):0;};
   const toolOpacity={spoon:opacity('[data-camp-spoon]'),greens:opacity('[data-camp-greens]'),flower:opacity('[data-camp-flower]')};
   const spoon=camp.querySelector('[data-camp-spoon]'),visible=spoon&&getComputedStyle(spoon).display!=='none'&&getComputedStyle(spoon.parentElement).display!=='none';
   let tool=null;
   if(visible){
    const values=[...spoon.getAttribute('d').matchAll(/[-+]?\d*\.?\d+(?:e[-+]?\d+)?/gi)].map(match=>Number(match[0]));
    const grip=screen(spoon,values[0],values[1]),tip=screen(spoon,values[2],values[3]),pot=camp.querySelector('[data-prop="cook-pot"] ellipse').getBoundingClientRect();
    tool={opacity:Number(getComputedStyle(spoon).opacity),grip:distance(grip,arm[2]),length:distance(grip,tip),insidePot:tip.x>=pot.left&&tip.x<=pot.right&&tip.y>=pot.top&&tip.y<=pot.bottom};
   }
   return {routine:camp.dataset.routine,wrist:arm[2],feet:legs.map(leg=>leg[2].y),lengths,ridgeEnd,toolOpacity,tool};
  });
  const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
  for(const viewport of [{width:854,height:480},{width:1280,height:720},{width:1920,height:1080},{width:390,height:844}]){
   await page.setViewportSize(viewport);
   for(const hour of [6,8,11,13,16,17,20,22]){
    const boundary=+new Date(`2026-10-05T${String(hour).padStart(2,'0')}:00:00-04:00`),frames=[];
    for(const offset of [-1,0,1,175,350,525,699,700,701]){
     await page.clock.setSystemTime(new Date(boundary+offset));await page.evaluate(()=>WoodlandScene.sync());
     frames.push({offset,...await geometry()});
    }
    const before=frames[0],after=frames[2],endBefore=frames[6],endAfter=frames[8],detail=JSON.stringify({viewport,dpr,hour,frames});
    assert.ok(distance(before.wrist,after.wrist)<.05,'Sage wrist jumps at a daily routine boundary: '+detail);
    assert.ok(distance(endBefore.wrist,endAfter.wrist)<.05,'Sage wrist jumps at the end of a routine blend: '+detail);
    assert.ok(distance(before.ridgeEnd,after.ridgeEnd)<.05&&distance(endBefore.ridgeEnd,endAfter.ridgeEnd)<.05,'Shelter line jumps during a routine blend: '+detail);
    assert.ok(['spoon','greens','flower'].every(kind=>Math.abs(before.toolOpacity[kind]-after.toolOpacity[kind])<.005&&Math.abs(endBefore.toolOpacity[kind]-endAfter.toolOpacity[kind])<.005),'Camp tool visibility jumps during a routine blend: '+detail);
    assert.ok(frames.every(frame=>frame.feet.every((y,i)=>Math.abs(y-before.feet[i])<.06)),'Sage feet leave their support plane: '+detail);
    const expected=[12,11,12,12,12,12].map(length=>length*48/66);
    assert.ok(frames.every(frame=>frame.lengths.every((length,i)=>Math.abs(length-expected[i])<.02)),'Sage arm or leg bone changes length: '+detail);
    assert.ok(frames.every(frame=>!frame.tool||frame.tool.grip<.06&&Math.abs(frame.tool.length-14*48/66)<.02),'Cooking spoon leaves Sage’s wrist or changes length: '+detail);
    // The utensil fades in on entry and out on exit. At full opacity its tip
    // must already be within the pot, including the exact boundary frame.
    assert.ok(frames.every(frame=>!frame.tool||frame.tool.opacity<.99||frame.tool.insidePot),'Fully visible spoon leaves the pot: '+detail);
   }
  }
  assert.deepEqual(errors,[]);
  console.log('PASS community routine transitions:',target.startsWith('file:')?'portable':'hosted',`DPR${dpr}`, 'painted wrist, fixed bones, planted feet and spoon at eight boundaries.');
 }finally{await context.close();}
}
// Hold a retained MQL stale after the OS preference changes; fresh queries still see the new value.
async function verifyImmediateReducedMotion(browser,target){
 const context=await browser.newContext({viewport:{width:854,height:480},deviceScaleFactor:1,timezoneId:'America/New_York'}),page=await context.newPage(),errors=[];
 try{
  page.on('pageerror',e=>errors.push(e.message));await page.route('https://**',r=>r.abort());
  await page.route('https://api.open-meteo.com/**',r=>r.fulfill({json:{current:{temperature_2m:12,weather_code:65},daily:{temperature_2m_max:[16],temperature_2m_min:[8]}}}));
  await freezeClock(page,stamp(10));await page.emulateMedia({reducedMotion:'no-preference'});
  await page.addInitScript(()=>{
   const query='(prefers-reduced-motion: reduce)',nativeMatchMedia=window.matchMedia.bind(window);
   window.__holdCachedMotionQueries=false;window.__cachedReducedMotionQueries=[];
   window.matchMedia=function(media){
    const result=nativeMatchMedia(media);
    if(media!==query||window.__holdCachedMotionQueries)return result;
    const cached=new Proxy(result,{get(target,property){
     if(property==='matches'&&window.__holdCachedMotionQueries)return false;
     const value=Reflect.get(target,property,target);return typeof value==='function'?value.bind(target):value;
    }});
    window.__cachedReducedMotionQueries.push(cached);return cached;
   };
  });
  await page.addInitScript(()=>localStorage.setItem('orbit-settings',JSON.stringify({theme:'greenhouse1',unit:'celsius',format24:true,care:false,rest:false,night:false,lowPower:false,display:{woodlandView:'immersive',cameraMotion:'still'}})));
  await page.goto(target);await page.waitForFunction(()=>DeskHabitatWeather?.get().status==='live');
  await page.evaluate(()=>{if(matchMedia('(prefers-reduced-motion: reduce)').matches)throw Error('Regression fixture did not start at no-preference');});
  assert.ok(await page.evaluate(()=>window.__cachedReducedMotionQueries.length>0),'Runtime did not retain a cached reduced-motion query');
  await page.clock.setSystemTime(new Date(+stamp(12,28)+250));await page.evaluate(()=>WoodlandScene.sync());
  await page.evaluate(()=>{window.__holdCachedMotionQueries=true;});
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.waitForFunction(()=>matchMedia('(prefers-reduced-motion: reduce)').matches);
  const immediate=await page.evaluate(()=>{
   const fresh=matchMedia('(prefers-reduced-motion: reduce)').matches,cached=window.__cachedReducedMotionQueries[0].matches;
   WoodlandScene.sync();
   return {fresh,cached,running:WoodlandScene.running,frozen:document.querySelector('#woodland-immersive-community [data-layer="community-camp"]').dataset.frozen};
  });
  assert.deepEqual(immediate,{fresh:true,cached:false,running:false,frozen:'true'},'Immediate reduced-motion sync did not refresh stale preference, freeze, and stop Green House 1');
  const geometry=()=>page.evaluate(()=>{
   const camp=document.querySelector('#woodland-immersive-community'),infant=camp.querySelector('[data-infant="pebble"]'),aster=camp.querySelector('[data-adult="aster"] .character-art');
   const point=(node,p)=>{const q=new DOMPoint(p.x,p.y).matrixTransform(node.getScreenCTM());return {x:q.x,y:q.y};};
   const wrist=name=>{const node=aster.querySelector(`[data-part="arm-${name}"]`),p=node.getPointAtLength(node.getTotalLength());return point(node,p);};
   const rect=infant.getBoundingClientRect(),bbox={left:rect.left,right:rect.right,top:rect.top,bottom:rect.bottom,width:rect.width,height:rect.height};
   const support=Object.entries(DeskCharacters.infantSupportPoints).map(([key,p])=>{const a=point(infant,p),b=wrist(key==='head'?'left':'right');return Math.hypot(a.x-b.x,a.y-b.y);});
   return {bbox,support};
  });
  const before=await geometry();
  await page.clock.setSystemTime(stamp(12,29));await page.evaluate(()=>WoodlandScene.sync());
  const after=await geometry();
  assert.deepEqual(after,before,'Reduced motion changed the infant painted bounds or caregiver hand support across 12:08:28.250→29.000');
  assert.ok(after.support.every(distance=>distance<.2),'Reduced-motion cradle lost head/body hand support: '+JSON.stringify(after));
  assert.deepEqual(errors,[]);
  console.log('PASS immediate reduced-motion refresh:',target.startsWith('file:')?'portable':'hosted','stale cached MQL, immediate stop and stable supported infant.');
 }finally{await context.close();}
}
(async()=>{const browser=await engine.launch({...options,headless:true});try{for(const target of [url,portable])for(const dpr of [1,2]){await verify(browser,target,dpr);await verifyRoutineTransitions(browser,target,dpr);}for(const target of [url,portable])await verifyImmediateReducedMotion(browser,target);}finally{await browser.close();}})().catch(e=>{console.error(e);process.exit(1);});
