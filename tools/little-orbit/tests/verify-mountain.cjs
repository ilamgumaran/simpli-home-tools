const {engine,options,url}=require('./runtime.cjs');
const assert=require('node:assert/strict'),path=require('node:path'),{pathToFileURL}=require('node:url');
(async()=>{const browser=await engine.launch({...options,headless:true});try{
 for(const target of [url,pathToFileURL(path.join(__dirname,'../Little Orbit.html')).href]){
  const page=await browser.newPage({viewport:{width:854,height:480},timezoneId:'America/New_York'}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));await page.route('https://**',r=>r.abort());
  await page.clock.install({time:new Date('2026-10-04T12:00:54-04:00')});await page.clock.pauseAt(new Date('2026-10-04T12:00:54-04:00'));await page.goto(target);
  assert.equal(await page.locator('body').getAttribute('data-theme'),'climber2');
  for(const theme of ['orbit','candy','climber']){await page.evaluate(theme=>{prefs.theme=theme;applyTheme();},theme);assert.equal(await page.locator('#time-mountain').getAttribute('hidden'),'');assert.equal(await page.evaluate(()=>TimeMountain.running||TimeMountain.pending),false);}await page.evaluate(()=>{prefs.theme='climber2';applyTheme();});
  const seen=new Set();
  for(const viewport of [{width:854,height:480},{width:1280,height:720},{width:1920,height:1080},{width:390,height:844}]){
   await page.setViewportSize(viewport);await page.waitForTimeout(120);
   for(const scale of [1,1.2])for(let layout=0;layout<4;layout++){
    const result=await page.evaluate(({scale,layout})=>{prefs.display.clockScale=scale;prefs.display.factScale=scale;prefs.display.weatherScale=scale;prefs.display.gap=24;applyDisplay();document.querySelector('#display').dataset.layout=layout;let fits=true;for(const f of facts){document.querySelector('#fact-title').textContent=f[0];document.querySelector('#fact-text').textContent=f[1];TimeMountain.refresh();fits=fits&&document.body.scrollHeight<=innerHeight&&document.body.scrollWidth<=innerWidth;}return {fits,height:document.body.scrollHeight};},{scale,layout:String(layout)});
    assert.ok(result.fits,JSON.stringify({viewport,scale,layout,result}));
   }
  }
  await page.setViewportSize({width:854,height:480});await page.waitForTimeout(120);
  await page.emulateMedia({reducedMotion:'reduce'});
  for(const viewport of [{width:854,height:480},{width:390,height:844}]){await page.setViewportSize(viewport);await page.waitForTimeout(120);for(let minute=0;minute<6;minute++){await page.clock.setSystemTime(new Date(`2026-10-04T12:0${minute}:00-04:00`));const fits=await page.evaluate(()=>{tick();TimeMountain.refresh();return [...document.querySelectorAll('.clock-panel,.weather-panel,.fact-panel')].every(e=>{const r=e.getBoundingClientRect();return r.left>=0&&r.right<=innerWidth&&r.top>=0&&r.bottom<=innerHeight;});});assert.ok(fits,'Screen-care glide clips a panel');}}
  await page.setViewportSize({width:854,height:480});await page.waitForTimeout(120);await page.emulateMedia({reducedMotion:'no-preference'});await page.waitForFunction(()=>!matchMedia('(prefers-reduced-motion: reduce)').matches);
  await page.evaluate(()=>{prefs.display={...prefs.display,clockScale:1,factScale:1,weatherScale:1,gap:8};applyDisplay();});
  for(let digit=0;digit<10;digit++)assert.equal(await page.evaluate(d=>TimeMountain.route(d).every(p=>Number.isFinite(p.x)&&Number.isFinite(p.y)),digit),true);
  for(const minute of [0,1,3,7,11]){
   await page.clock.setSystemTime(new Date(`2026-10-04T12:${String(minute).padStart(2,'0')}:54-04:00`));
   await page.evaluate(()=>{tick();TimeMountain.stop();TimeMountain.start();});
   for(const progress of [.025,.1,.2,.34,.39,.45,.49,.52,.7,.9,.99]){
    const r=await page.evaluate(progress=>{TimeMountain.draw(progress);const e=document.querySelector('#time-mountain'),p=TimeMountain.state.lastActor,rect=e.getBoundingClientRect();return {state:e.dataset.state,view:e.dataset.view,level:e.dataset.level,finite:[...e.querySelectorAll('[transform],[d]')].every(n=>!/(NaN|Infinity)/.test(n.getAttribute('transform')||n.getAttribute('d')||'')),bounds:p.x>=0&&p.x<=rect.width&&p.y>=0&&p.y<=rect.height};},progress);
    assert.ok(r.finite&&r.bounds,JSON.stringify(r));seen.add(r.state);seen.add(r.view);seen.add(r.level);
   }
  }
  for(const value of ['cast','walk','climb','collect','build','camp','traverse','trail','cliff','minute','hour','day','month','year'])assert.ok(seen.has(value),value);
  // The real minute rolls over during an active expedition, with a continuous actor.
  await page.clock.setSystemTime(new Date('2026-10-04T12:00:54-04:00'));await page.evaluate(()=>{prefs.rest=false;tick();TimeMountain.stop();TimeMountain.start();});
  await page.clock.runFor(5900);const before=await page.evaluate(()=>TimeMountain.state.lastActor);
  await page.clock.runFor(250);assert.equal(await page.locator('#time').innerText(),'12:01');assert.equal(await page.evaluate(()=>TimeMountain.running),true);
  const after=await page.evaluate(()=>TimeMountain.state.lastActor);assert.ok(Math.hypot(after.x-before.x,after.y-before.y)<100,'Rollover teleported the explorer');
  // Calendar lengths, DST days, backward jumps and reopen progress use real boundaries.
  const samples=await page.evaluate(()=>['2028-02-29T12:00:00-05:00','2026-03-08T12:00:00-04:00','2026-11-01T12:00:00-05:00','2026-12-31T23:59:59-05:00','2027-01-01T00:00:00-05:00'].map(value=>TimeMountain.calendar(new Date(value))));
  assert.equal(samples[0].day.value,'29');assert.equal(samples[0].month.value,'02');assert.ok(Math.abs(samples[0].month.progress-28.5/29)<.0001);assert.ok(Math.abs(samples[1].day.progress-11/23)<.0001);assert.ok(Math.abs(samples[2].day.progress-13/25)<.0001);assert.ok(samples[3].year.progress>.999);assert.equal(samples[4].year.progress,0);
  for(const time of ['2026-10-05T00:00:00-04:00','2026-10-01T09:59:59-04:00','2026-10-01T10:00:00-04:00','2026-12-31T23:59:59-05:00','2027-01-01T00:00:00-05:00','2026-10-04T08:42:00-04:00']){await page.clock.setSystemTime(new Date(time));await page.evaluate(()=>{tick();TimeMountain.refresh();});assert.ok((await page.locator('#date').innerText()).includes(time.slice(0,4)));}
  await page.evaluate(()=>{TimeMountain.stop();window.mountainPaints=0;window.mountainObserver=new MutationObserver(records=>window.mountainPaints+=records.filter(r=>r.attributeName==='d').length);mountainObserver.observe(document.querySelector('#mountain-trail'),{attributes:true});TimeMountain.start();});await page.clock.runFor(1000);assert.ok(await page.evaluate(()=>mountainPaints>0&&mountainPaints<=14),'Low-power frame cap');
  await page.evaluate(()=>{TimeMountain.stop();window.mountainPaints=0;});await page.clock.runFor(1000);assert.equal(await page.evaluate(()=>mountainPaints),0,'Idle scene keeps animating');await page.evaluate(()=>mountainObserver.disconnect());
  await page.evaluate(()=>{Object.defineProperty(document,'visibilityState',{configurable:true,value:'hidden'});document.dispatchEvent(new Event('visibilitychange'));});assert.equal(await page.evaluate(()=>TimeMountain.running||TimeMountain.pending),false);await page.evaluate(()=>{delete document.visibilityState;document.dispatchEvent(new Event('visibilitychange'));});
  await page.getByRole('button',{name:'Settings'}).click();assert.equal(await page.evaluate(()=>TimeMountain.running||TimeMountain.pending),false);
  await page.locator('#camera-motion').selectOption('still');await page.getByRole('button',{name:'Save & return to orbit'}).click();await page.evaluate(()=>{TimeMountain.stop();TimeMountain.start();});assert.equal(await page.evaluate(()=>TimeMountain.running),false);assert.equal(await page.locator('#time-mountain').getAttribute('data-view'),'cliff');
  await page.reload();assert.equal(await page.evaluate(()=>prefs.display.cameraMotion),'still');
  await page.evaluate(()=>{prefs.display.cameraMotion='gentle';TimeMountain.refresh();});await page.emulateMedia({reducedMotion:'reduce'});await page.waitForFunction(()=>matchMedia('(prefers-reduced-motion: reduce)').matches);await page.evaluate(()=>TimeMountain.start());assert.equal(await page.evaluate(()=>TimeMountain.state.frame),null);
  await page.evaluate(()=>{prefs.display.companion=false;TimeMountain.sync();});assert.equal(await page.locator('#mountain-explorer').isVisible(),false);assert.equal(await page.evaluate(()=>TimeMountain.pending),false);
  await page.evaluate(()=>{prefs.display.companion=true;prefs.rest=true;prefs.care=true;});await page.clock.setSystemTime(new Date('2026-10-04T12:59:00-04:00'));await page.evaluate(()=>tick());assert.equal(await page.evaluate(()=>TimeMountain.running||TimeMountain.pending),false);
  await page.evaluate(()=>{prefs.theme='orbit';applyTheme();});assert.equal(await page.locator('#time-mountain').isHidden(),true);assert.deepEqual(errors,[]);
  await page.close();console.log('PASS Time Climber II:',target.startsWith('file:')?'portable':'hosted','viewport/font/fact fits, all digits/levels/views, real rollover continuity, calendar/DST/jumps, camera persistence, pauses and reduced motion.');
 }
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exit(1);});
