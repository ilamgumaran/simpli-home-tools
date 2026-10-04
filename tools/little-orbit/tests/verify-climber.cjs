const {engine,options,url}=require('./runtime.cjs');
const assert=require('node:assert/strict');
const path=require('node:path'),{pathToFileURL}=require('node:url');
(async()=>{
 const browser=await engine.launch({...options,headless:true});
 try{
  for(const target of [url,pathToFileURL(path.join(__dirname,'../Little Orbit.html')).href]){
   const page=await browser.newPage({viewport:{width:854,height:480},timezoneId:'America/New_York'}),errors=[];
   page.on('pageerror',e=>errors.push(e.message));await page.route('https://**',r=>r.abort());
   await page.clock.install({time:new Date('2026-10-04T12:00:54-04:00')});await page.clock.pauseAt(new Date('2026-10-04T12:00:54-04:00'));await page.goto(target);
   assert.equal(await page.locator('body').getAttribute('data-theme'),'climber');assert.match(await page.title(),/Our Desk Clock/);
   assert.equal(await page.locator('#time .time-digit').count(),5);
   const seen=new Set();
   for(const viewport of [{width:854,height:480},{width:1280,height:720},{width:1920,height:1080},{width:390,height:844}]){
    await page.setViewportSize(viewport);
    for(let layout=0;layout<4;layout++)for(const focus of [false,true]){
     await page.evaluate(({layout,focus})=>{DeskClimber.stop();document.querySelector('#display').dataset.layout=layout;document.body.classList.toggle('fact-focus',focus);}, {layout:String(layout),focus});
     for(let visit=0;visit<3;visit++){
      await page.evaluate(()=>{DeskClimber.stop();DeskClimber.start();});
      for(const phase of [.06,.4,.7,.8,.89,.97]){
       const result=await page.evaluate(phase=>{DeskClimber.paint(phase);const stage=document.querySelector('#climber-stage'),values=[...document.querySelector('#climber-world').querySelectorAll('[transform]')].map(e=>e.getAttribute('transform')).join(' ');return {state:stage.dataset.state,target:stage.dataset.target,valid:!values.includes('NaN')&&!values.includes('Infinity'),fits:document.body.scrollWidth<=innerWidth&&document.body.scrollHeight<=innerHeight};},phase);
       assert.ok(result.valid&&result.fits,JSON.stringify({viewport,layout,focus,phase,result}));seen.add(result.state);seen.add(result.target);
      }
     }
    }
   }
   for(const feature of ['cast','climb','collect','build','camp','sleep','rappel','digit','widget'])assert.ok(seen.has(feature),feature);
   await page.setViewportSize({width:854,height:480});await page.waitForTimeout(120);await page.evaluate(()=>{DeskClimber.stop();DeskClimber.start();DeskClimber.paint(.4);});
   await page.clock.runFor(7000);assert.equal(await page.locator('#time').innerText(),'12:01');assert.equal(await page.evaluate(()=>DeskClimber.running),true);assert.equal(await page.locator('#climber-stage').getAttribute('data-state'),'climb');assert.equal(await page.locator('#time').getAttribute('aria-label'),'12:01');
   await page.getByRole('button',{name:'Settings'}).click();assert.equal(await page.locator('#climber-stage').isHidden(),true);await page.locator('#close-settings').click();
   await page.evaluate(()=>{prefs.display.companion=false;DeskClimber.sync();});assert.equal(await page.locator('#climber-stage').isHidden(),true);
   await page.evaluate(()=>{prefs.display.companion=true;prefs.theme='orbit';applyTheme();});assert.equal(await page.locator('#climber-stage').isHidden(),true);
   await page.evaluate(()=>{prefs.theme='climber';applyTheme();});await page.emulateMedia({reducedMotion:'reduce'});await page.waitForFunction(()=>matchMedia('(prefers-reduced-motion: reduce)').matches);
   await page.evaluate(()=>{DeskClimber.stop();DeskClimber.start();});await page.clock.runFor(2500);assert.equal(await page.locator('#climber-stage').isHidden(),true);
   await page.evaluate(()=>{prefs.display.companion=true;DeskClimber.start();});await page.clock.setSystemTime(new Date('2026-10-04T12:59:01-04:00'));await page.evaluate(()=>tick());assert.equal(await page.locator('#climber-stage').isHidden(),true);
   assert.deepEqual(errors,[]);await page.close();console.log('PASS Time Climber:',target.startsWith('file:')?'portable':'hosted','all layouts, rope/climb/supplies/build/tent/rest/rappel, real minute change, settings/disable/original-theme/rest pause, reduced motion.');
  }
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exit(1);});
