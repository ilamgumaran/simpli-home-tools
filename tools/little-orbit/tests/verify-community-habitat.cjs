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
   const point=(node,p)=>{const q=new DOMPoint(p.x,p.y).matrixTransform(node.getScreenCTM());return {x:q.x,y:q.y};};
   const wrist=name=>{const n=aster.querySelector(`[data-part="arm-${name}"]`),p=n.getPointAtLength(n.getTotalLength());return point(n,p);};
   const sockets=DeskCharacters.infantSupportPoints;
   const rect=node=>{const r=node.getBoundingClientRect();return {left:r.left,right:r.right,top:r.top,bottom:r.bottom,width:r.width,height:r.height};};
   const support=Object.entries(sockets).map(([key,p])=>{const a=point(infant,p),b=wrist(key==='head'?'left':'right');return Math.hypot(a.x-b.x,a.y-b.y);});
   const plane=point(camp.querySelector('[data-layer="community-camp"]'),{x:0,y:30});
   const adults=[...camp.querySelectorAll('[data-adult] > g > .character-art')].map(n=>{const m=n.getScreenCTM();return {id:n.dataset.character,ratio:Math.hypot(m.a,m.b)/Math.hypot(m.c,m.d),rect:rect(n),feet:['left','right'].map(side=>{const leg=n.querySelector(`[data-part="leg-${side}"]`);return Math.abs(point(leg,leg.getPointAtLength(leg.getTotalLength())).y-plane.y);})};});
   let spoon=null;const line=camp.querySelector('[data-camp-spoon]');
   if(line&&getComputedStyle(line).display!=='none'&&getComputedStyle(line.parentElement).display!=='none'){
    const a=point(line,line.getPointAtLength(0)),w=camp.querySelector('[data-adult="sage"] [data-part="arm-right"]'),b=point(w,w.getPointAtLength(w.getTotalLength())),end=point(line,line.getPointAtLength(line.getTotalLength())),pot=rect(camp.querySelector('[data-prop="cook-pot"] ellipse'));
    spoon={grip:Math.hypot(a.x-b.x,a.y-b.y),inside:end.x>=pot.left&&end.x<=pot.right&&end.y>=pot.top&&end.y<=pot.bottom};
   }
   return {routine:camp.dataset.routine,support,baby:rect(infant),adults,spoon,count:camp.querySelectorAll('*').length,controls:rect(document.querySelector('#display nav')),time:document.querySelector('#woodland-immersive').dataset.time,infantEquipment:infant.querySelector('.character-pack,.character-harness,[data-part^="leg-"]')!==null,caption:document.querySelector('#woodland-immersive-story').textContent};
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
  assert.equal(await page.locator('#woodland-immersive-weather [data-weather-particle]').count(),0,'Green House weather leaked into Woodland');
  assert.equal(await page.evaluate(()=>{
   const backdrop=document.querySelector('#woodland-immersive-backdrop').firstElementChild;
   DeskHabitatWeather.publish({current:{temperature_2m:3,weather_code:75},unit:'celsius',status:'live',at:Date.now()});
   return document.querySelector('#woodland-immersive-backdrop').firstElementChild===backdrop;
  }),true,'Weather refresh reconstructs the unrelated Woodland landscape');
  await page.evaluate(()=>{prefs.theme='greenhouse1';prefs.display.woodlandView='dashboard';applyTheme();});
  assert.equal(await page.locator('#woodland-immersive').isVisible(),true,'Woodland dashboard preference disables Green House 1');
  assert.equal(await page.locator('#woodland-weather-thermometer').isVisible(),true);
  await page.evaluate(()=>{const host=document.createElementNS('http://www.w3.org/2000/svg','g');DeskCharacters.mount(host,DeskCharacters.create('pebble',{role:'infant'}));if(!host.querySelector('[data-infant-art]')||host.querySelector('[data-part^="leg-"]'))throw Error('Shared infant renderer uses adult anatomy');});
  assert.deepEqual(errors,[]);
  console.log('PASS community habitat:',target.startsWith('file:')?'portable':'hosted',`DPR${dpr}`, 'daily routines, painted head/body support, four viewports, proportions, reduced motion, companions and central infant art.');
 }finally{await context.close();}
}
(async()=>{const browser=await engine.launch({...options,headless:true});try{for(const target of [url,portable])for(const dpr of [1,2])await verify(browser,target,dpr);}finally{await browser.close();}})().catch(e=>{console.error(e);process.exit(1);});
