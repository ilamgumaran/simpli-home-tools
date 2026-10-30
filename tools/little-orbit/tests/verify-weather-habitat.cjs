// SPDX-License-Identifier: LicenseRef-Simpli-Noncommercial-1.0
// Copyright (C) 2026 ilamgumaran and contributors
const {engine,options,url,freezeClock}=require('./runtime.cjs');
const assert=require('node:assert/strict');
const path=require('node:path');
const {pathToFileURL}=require('node:url');
const {installCadenceTrace,writeTrace,emitTrace}=require('./cadence-trace.cjs');
const portable=pathToFileURL(path.join(__dirname,'..','Little Orbit.html')).href;
const settings={theme:'greenhouse1',place:{name:'Test woodland',latitude:33.9276,longitude:-84.6202},format24:true,care:false,rest:false,night:false,lowPower:false,display:{woodlandView:'immersive'}};
const weather=(temperature,code)=>({current:{temperature_2m:temperature,apparent_temperature:temperature-2,weather_code:code},daily:{temperature_2m_max:[temperature+5],temperature_2m_min:[temperature-5]}});
const intersects=(a,b)=>a.left<b.right-1&&a.right>b.left+1&&a.top<b.bottom-1&&a.bottom>b.top+1;
async function checkLayout(page,deviceScaleFactor){
 for(const viewport of [{width:854,height:480},{width:1280,height:720},{width:1920,height:1080},{width:390,height:844}]){
  await page.setViewportSize(viewport);await page.evaluate(()=>WoodlandScene.sync());
  const layout=await page.evaluate(()=>{
   const rect=id=>{const r=document.querySelector(id).getBoundingClientRect();return {left:r.left,right:r.right,top:r.top,bottom:r.bottom,width:r.width,height:r.height};};
   return {thermo:rect('#woodland-weather-thermometer'),time:rect('#woodland-immersive-numerals'),day:rect('#woodland-immersive-day'),controls:rect('#display nav'),screen:{width:innerWidth,height:innerHeight},scroll:{width:document.documentElement.scrollWidth,height:document.documentElement.scrollHeight}};
  });
  const note=JSON.stringify({viewport,deviceScaleFactor,layout});
  assert.ok(layout.thermo.width>=55&&layout.thermo.height>=85,note);
  assert.ok(layout.thermo.left>=0&&layout.thermo.top>=0&&layout.thermo.right<=viewport.width&&layout.thermo.bottom<=viewport.height,note);
  assert.ok(!intersects(layout.thermo,layout.time)&&!intersects(layout.thermo,layout.day)&&!intersects(layout.thermo,layout.controls),note);
  assert.ok(layout.scroll.width<=viewport.width+1&&layout.scroll.height<=viewport.height+1,note);
 }
}

async function verify(browser,target){
 const context=await browser.newContext({viewport:{width:1280,height:720},timezoneId:'America/New_York'}),page=await context.newPage(),errors=[];
 let condition=65,offline=false,race=false,releaseOld,oldSeen,releaseNew,newSeen,holdUnit=false,releaseUnit,unitSeen;
 try{
  page.on('pageerror',error=>errors.push(error.message));
  await page.route('https://**',route=>route.abort());
  await page.route('https://api.open-meteo.com/**',async route=>{
   if(offline)return route.abort();
   const query=new URL(route.request().url()).searchParams;
   const latitude=Number(query.get('latitude'));
   if(race&&latitude===settings.place?.latitude){
    oldSeen?.();await new Promise(resolve=>{releaseOld=resolve;});
   }
   const newer=latitude===40;
   if(race&&newer){newSeen?.();await new Promise(resolve=>{releaseNew=resolve;});}
   if(holdUnit&&query.get('temperature_unit')==='celsius'){unitSeen?.();await new Promise(resolve=>{releaseUnit=resolve;});}
   return route.fulfill({json:weather(newer?5:query.get('temperature_unit')==='celsius'?20:68,newer?71:condition)});
  });
  await freezeClock(page,'2026-10-05T10:08:28-04:00');
  await page.addInitScript(settings=>localStorage.setItem('orbit-settings',JSON.stringify(settings)),settings);
  await page.goto(target);
  await page.waitForFunction(()=>window.DeskHabitatWeather?.get().status==='live');
  assert.equal(await page.locator('#woodland-immersive').isVisible(),true);
  const state=()=>page.evaluate(()=>DeskHabitatWeather.get());
  const visual=()=>page.evaluate(()=>{
   const group=document.querySelector('#woodland-immersive-weather'),particle=group.querySelector('[data-weather-particle]'),sun=document.querySelector('[data-weather-sunwash]');
   return {kind:group.dataset.weatherKind,precipitation:group.dataset.precipitation,particles:group.querySelectorAll('[data-weather-particle]').length,first:particle?.getAttribute('transform'),particleTag:particle?.tagName.toLowerCase(),sunOpacity:Number(sun?.getAttribute('opacity')),fill:Number(document.querySelector('#woodland-thermometer-fill').getAttribute('height')),value:document.querySelector('#woodland-weather-value').textContent,freshness:document.querySelector('#woodland-weather-freshness').textContent,time:document.querySelector('#woodland-immersive').dataset.time};
  });
  let snap=await state(),view=await visual();
  assert.equal(snap.temperatureC,20);assert.equal(snap.kind,'rain');assert.equal(snap.status,'live');
  assert.equal(view.precipitation,'rain');assert.ok(view.particles>=8&&view.particles<=28);assert.equal(view.particleTag,'path');
  assert.match(view.value,/68\s*°F/);assert.equal(view.freshness,'Live');
  assert.equal(view.time,'10:08');
  await page.clock.setSystemTime(new Date('2026-10-05T10:08:29-04:00'));
  await page.evaluate(()=>WoodlandScene.sync());assert.notEqual((await visual()).first,view.first,'Rain is visually stationary');
  await page.clock.setSystemTime(new Date('2026-10-05T10:08:28-04:00'));

  // Readability is measured on painted boxes at both device scale factors.
  await checkLayout(page,1);
  const highDpi=await browser.newContext({viewport:{width:854,height:480},deviceScaleFactor:2,timezoneId:'America/New_York'});
  try{
   const highPage=await highDpi.newPage();
   await highPage.route('https://**',route=>route.abort());
   await highPage.route('https://api.open-meteo.com/**',route=>route.fulfill({json:weather(68,65)}));
   await freezeClock(highPage,'2026-10-05T10:08:28-04:00');
   await highPage.addInitScript(settings=>localStorage.setItem('orbit-settings',JSON.stringify(settings)),settings);
   await highPage.goto(target);await highPage.waitForFunction(()=>DeskHabitatWeather?.get().status==='live');
   await checkLayout(highPage,2);
  }finally{await highDpi.close();}
  await page.setViewportSize({width:1280,height:720});
  const publishClear=temperature=>page.evaluate(temperature=>DeskHabitatWeather.publish({current:{temperature_2m:temperature,weather_code:0},unit:'celsius',status:'live',at:Date.now(),place:{name:'Test woodland'}}),temperature);
  await publishClear(35);const hot=await visual();
  assert.match(hot.value,/35\s*°C/);assert.equal(hot.particles,0);
  for(const hour of [6,19,21]){
   await page.clock.setSystemTime(new Date(`2026-10-05T${String(hour).padStart(2,'0')}:08:28-04:00`));await page.evaluate(()=>WoodlandScene.sync());
   assert.equal((await visual()).sunOpacity,0,'Weather paints sunlight during the landscape night at '+hour);
   assert.equal(await page.locator('[data-weather-sun]').getAttribute('opacity'),'1','Night moon is hidden');
  }
  await page.clock.setSystemTime(new Date('2026-10-05T10:08:28-04:00'));await page.evaluate(()=>WoodlandScene.sync());
  await publishClear(-5);const cold=await visual();
  assert.match(cold.value,/-5\s*°C/);assert.ok(hot.sunOpacity>cold.sunOpacity,'Hot sun should shine brighter than cold sun');
  await page.evaluate(()=>DeskHabitatWeather.publish({current:{temperature_2m:35,weather_code:999},unit:'celsius',status:'live',at:Date.now()}));
  assert.equal((await visual()).sunOpacity,0,'Unknown conditions invent a clear hot sun');
  condition=71;await page.evaluate(()=>{refreshWeather();});
  await page.waitForFunction(()=>DeskHabitatWeather.get().kind==='snow');
  view=await visual();assert.equal(view.precipitation,'snow');assert.equal(view.particleTag,'circle');assert.ok(view.particles>=8&&view.particles<=20);
  await page.clock.setSystemTime(new Date('2026-10-05T21:08:28-04:00'));
  await page.evaluate(()=>WoodlandScene.sync());
  view=await visual();assert.equal(view.sunOpacity,0,'Night weather paints a hot sun');assert.equal(await page.locator('#woodland-immersive').getAttribute('data-night'),'true');
  assert.equal(view.time,'21:08');
  await page.clock.setSystemTime(new Date('2026-10-05T10:08:28-04:00'));
  await page.evaluate(()=>WoodlandScene.sync());

  // A saved response is identified as stale when a later request fails.
  offline=true;await page.reload();
  await page.waitForFunction(()=>DeskHabitatWeather.get().status==='cached').catch(async error=>{console.error('Cached weather diagnostic',await page.evaluate(()=>({weather:DeskHabitatWeather.get(),key:cacheKey(),cache:read(cacheKey(),null),unit:prefs.unit,place:prefs.place})));throw error;});
  assert.equal((await state()).kind,'snow');assert.equal((await visual()).freshness,'Cached');
  const validCache=await page.evaluate(()=>{const key=cacheKey();const saved=localStorage.getItem(key),entry=JSON.parse(saved);entry.data.daily.temperature_2m_max=[null];localStorage.setItem(key,JSON.stringify(entry));return {key,saved};});
  await page.reload();await page.waitForFunction(()=>DeskHabitatWeather.get().status==='unavailable');
  assert.equal((await state()).available,false,'Malformed cached forecast painted as observed weather');
  // File URLs can lose a pending storage write on immediate reload.
  // Seed the restored fixture before the next document reads it.
  await page.addInitScript(({key,saved})=>localStorage.setItem(key,saved),validCache);
  await page.reload();await page.waitForFunction(()=>DeskHabitatWeather.get().status==='cached');
  offline=false;
  let unitRequested;const unitRequest=new Promise(resolve=>{unitRequested=resolve;});unitSeen=unitRequested;holdUnit=true;
  await page.getByRole('button',{name:'Settings',exact:false}).click();
  await page.locator('#unit').selectOption('celsius');
  await page.getByRole('button',{name:'Save & return to orbit'}).click();
  await unitRequest;
  snap=await state();assert.equal(snap.status,'loading');assert.equal(snap.available,false,'Previous unit remains painted during switch');
  assert.match((await visual()).value,/—/);
  holdUnit=false;releaseUnit();
  await page.waitForFunction(()=>DeskHabitatWeather.get().unit==='celsius'&&DeskHabitatWeather.get().status==='live');
  snap=await state();assert.equal(snap.temperature,20);assert.equal(snap.temperatureC,20);assert.match((await visual()).value,/20\s*°C/);assert.equal((await visual()).fill,view.fill);

  // A delayed old-place response must not repopulate the habitat after a
  // location switch. Hold the old request until the new place is live.
  let seen;const oldRequest=new Promise(resolve=>{seen=resolve;});oldSeen=seen;
  let newerSeen;const nextRequest=new Promise(resolve=>{newerSeen=resolve;});newSeen=newerSeen;race=true;
  await page.evaluate(()=>{refreshWeather();});await oldRequest;
  await page.evaluate(()=>{setPlace({name:'Next camp',latitude:40,longitude:-105});});
  await nextRequest;
  snap=await state();assert.equal(snap.status,'loading');assert.equal(snap.available,false,'Previous location remains painted during switch');
  assert.equal(snap.place.name,'Next camp');assert.match((await visual()).value,/—/);
  releaseNew();
  await page.waitForFunction(()=>DeskHabitatWeather.get().place.name==='Next camp'&&DeskHabitatWeather.get().status==='live');
  snap=await state();assert.equal(snap.kind,'snow');assert.equal(snap.temperature,5);
  releaseOld();await page.waitForTimeout(80);
  assert.equal((await state()).place.name,'Next camp');assert.equal((await state()).temperature,5);
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.waitForFunction(()=>matchMedia('(prefers-reduced-motion: reduce)').matches);
  await page.evaluate(()=>WoodlandScene.sync());
  assert.equal(await page.evaluate(()=>WoodlandScene.running),false);
  const frozen=(await visual()).first;await page.waitForTimeout(80);assert.equal((await visual()).first,frozen,'Reduced-motion snow still moves');
  await page.emulateMedia({reducedMotion:'no-preference'});
  await page.waitForFunction(()=>!matchMedia('(prefers-reduced-motion: reduce)').matches);
  await page.evaluate(()=>WoodlandScene.sync());
  assert.equal(await page.evaluate(()=>WoodlandScene.running),true);
  await page.evaluate(()=>{document.querySelector('#settings').showModal();WoodlandScene.sync();});
  assert.equal(await page.evaluate(()=>WoodlandScene.running||WoodlandScene.pending),false,'Weather renders while settings is open');
  await page.evaluate(()=>{document.querySelector('#settings').close();WoodlandScene.sync();});
  await page.evaluate(()=>{Object.defineProperty(document,'visibilityState',{value:'hidden',configurable:true});document.dispatchEvent(new Event('visibilitychange'));});
  assert.equal(await page.evaluate(()=>WoodlandScene.running||WoodlandScene.pending),false,'Weather renders while hidden');
  await page.evaluate(()=>{delete document.visibilityState;document.dispatchEvent(new Event('visibilitychange'));});
  await page.evaluate(()=>{document.body.classList.add('screen-rest');WoodlandScene.sync();});
  assert.equal(await page.evaluate(()=>WoodlandScene.running||WoodlandScene.pending),false,'Weather renders during screen rest');
  await page.evaluate(()=>{document.body.classList.remove('screen-rest');prefs.display.cameraMotion='still';WoodlandScene.sync();});
  assert.equal(await page.evaluate(()=>WoodlandScene.running),true,'Still camera stops weather animation');
  await page.evaluate(()=>{prefs.theme='orbit';WoodlandScene.sync();});
  assert.equal(await page.locator('#woodland-immersive').isVisible(),false);
  assert.deepEqual(errors,[]);
  console.log('PASS weather habitat:',target.startsWith('file:')?'portable':'hosted','provider, rain/snow, thermometer, responsive layout, night, cache, unit and location race.');
 }finally{releaseOld?.();releaseNew?.();releaseUnit?.();await context.close();}
}

async function verifyRainCadence(browser,target,viewport,deviceScaleFactor){
 const context=await browser.newContext({viewport,deviceScaleFactor,timezoneId:'America/New_York'}),page=await context.newPage(),errors=[];
 try{
  page.on('pageerror',error=>errors.push(error.message));
  await page.route('https://**',route=>route.abort());
  await page.route('https://api.open-meteo.com/**',route=>route.fulfill({json:weather(68,65)}));
  // Leave performance.now, RAF and timers real so this measures geometry updates.
  await page.addInitScript(settings=>{
   const RealDate=Date,start=performance.now(),base=+new RealDate('2026-10-05T10:08:05-04:00');
   window.Date=class extends RealDate{constructor(...args){super(...(args.length?args:[base+performance.now()-start]));}static now(){return base+performance.now()-start;}};
   localStorage.setItem('orbit-settings',JSON.stringify({...settings,lowPower:true}));
  },settings);
  await page.addInitScript(installCadenceTrace);
  await page.goto(target);await page.waitForFunction(()=>DeskHabitatWeather?.get().kind==='rain');
  // Measure the running illustration after font loading and first-paint/JIT
  // work settles; the real frame cadence and all performance gates stay intact.
  await page.evaluate(()=>document.fonts?.ready);
  await page.waitForTimeout(1000);
  for(const lowPower of [true,false]){
   await page.evaluate(lowPower=>{prefs.lowPower=lowPower;WoodlandScene.sync();},lowPower);
   const resultSample=await page.evaluate(async()=>{
    const particle=document.querySelector('[data-weather-particle]'),frames=[];let previous=particle.getAttribute('transform');
    const observer=new MutationObserver(()=>{const current=particle.getAttribute('transform');if(current!==previous){previous=current;frames.push(performance.now());}});
    observer.observe(particle,{attributes:true,attributeFilter:['transform']});
    const start=performance.now();window.__clockCadenceTrace.start(start);await new Promise(resolve=>setTimeout(resolve,2100));observer.disconnect();
    const elapsed=performance.now()-start,gaps=frames.slice(1).map((time,i)=>time-frames[i]).sort((a,b)=>a-b);
    const result={fps:frames.length*1000/elapsed,p95:gaps[Math.floor(gaps.length*.95)],maxGap:gaps.at(-1)};
    return {result,trace:{...window.__clockCadenceTrace.stop(start+elapsed),geometryTimesMs:frames,geometryStartMs:start,geometryEndMs:start+elapsed}};
   });
   const {result,trace}=resultSample;
   const contextInfo={suite:'rain',form:target.startsWith('file:')?'portable':'hosted',browser:process.env.CLOCK_TEST_BROWSER||'chromium',browserVersion:browser.version(),viewport,deviceScaleFactor,dpr:deviceScaleFactor,lowPower};
   const record=writeTrace('cadence',contextInfo,{metrics:result,...trace});
   try{
    assert.ok(result.fps>=(lowPower?26:45),JSON.stringify({viewport,deviceScaleFactor,lowPower,result}));
    assert.ok(result.p95<=(lowPower?46:31)&&result.maxGap<100,JSON.stringify({viewport,deviceScaleFactor,lowPower,result}));
   }catch(error){try{emitTrace(record);}catch{}throw error;}
   console.log('PASS rainy habitat cadence:',target.startsWith('file:')?'portable':'hosted',`${viewport.width}×${viewport.height} DPR${deviceScaleFactor}`,lowPower?'30fps low-power':'60fps normal',JSON.stringify(result));
  }
  assert.deepEqual(errors,[]);
 }finally{await context.close();}
}

(async()=>{
 const browser=await engine.launch({...options,headless:true});
 try{for(const target of [url,portable])await verify(browser,target);}finally{await browser.close();}
 // Match the Woodland benchmark: isolate steady cadence from the dense
 // condition/resizing fixtures and from delayed browser startup work.
 for(const target of [url,portable])for(const dpr of [1,2]){
  const isolated=await engine.launch({...options,headless:true});
  try{
   const blank=await isolated.newPage();await blank.goto('about:blank');await blank.waitForTimeout(4000);await blank.close();
   await verifyRainCadence(isolated,target,dpr===2?{width:1280,height:720}:{width:854,height:480},dpr);
  }finally{await isolated.close();}
 }
})().catch(error=>{console.error(error);process.exit(1);});
