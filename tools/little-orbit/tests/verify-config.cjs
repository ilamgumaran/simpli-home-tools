const {engine,options,url}=require('./runtime.cjs');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await engine.launch({...options,headless:true});
 try{
  const page=await browser.newPage({viewport:{width:854,height:480},reducedMotion:'reduce'}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));await page.route('https://**',r=>r.abort());
  await page.clock.install({time:new Date('2026-10-04T12:00:00-04:00')});await page.clock.pauseAt(new Date('2026-10-04T12:00:01-04:00'));await page.addInitScript(()=>{if(!localStorage.getItem('orbit-settings'))localStorage.setItem('orbit-settings',JSON.stringify({theme:'candy'}));});await page.goto(url);
  await page.getByRole('button',{name:'Settings'}).click();
  assert.match(await page.locator('#viewport-info').innerText(),/854 × 480/);
  await page.locator('#clockScale').evaluate(e=>{e.value='0.8';e.dispatchEvent(new Event('input',{bubbles:true}));});await page.locator('#weatherScale').evaluate(e=>{e.value='0.8';e.dispatchEvent(new Event('input',{bubbles:true}));});await page.locator('#factScale').evaluate(e=>{e.value='0.8';e.dispatchEvent(new Event('input',{bubbles:true}));});
  await page.locator('#gap').evaluate(e=>{e.value='12';e.dispatchEvent(new Event('input',{bubbles:true}));});await page.locator('#companion').uncheck();
  await page.getByRole('button',{name:'Save & return to orbit'}).click();
  const sizes=()=>page.evaluate(()=>({time:parseFloat(getComputedStyle(document.querySelector('#time')).fontSize),temperature:parseFloat(getComputedStyle(document.querySelector('#temperature')).fontSize),fact:parseFloat(getComputedStyle(document.querySelector('#fact-text')).fontSize),gap:getComputedStyle(document.querySelector('#display')).gap}));
  const small=await sizes();assert.ok(Math.abs(small.time-150.304)<.1);assert.equal(small.gap,'12px');
  await page.evaluate(candy=>{candyAdventure();});assert.equal(await page.locator('#candy-stage').isHidden(),true);
  await page.reload();assert.deepEqual(await sizes(),small);
  await page.getByRole('button',{name:'Settings'}).click();assert.equal(await page.locator('#companion').isChecked(),false);
  await page.locator('#reset-display').click();await page.getByRole('button',{name:'Save & return to orbit'}).click();
  const normal=await sizes();assert.ok(normal.time>small.time);assert.ok(normal.temperature>small.temperature);assert.ok(normal.fact>small.fact);assert.equal(normal.gap,'8px');
  const tripStart=await page.evaluate(()=>{prefs.display.companion=true;prefs.display.companionInterval=120;candyNextVisit=0;const before=candyTrip;candyAdventure();return before;});
  await page.clock.runFor(65000);assert.equal(await page.evaluate(()=>candyTrip),tripStart+1);
  await page.clock.runFor(70000);assert.equal(await page.evaluate(()=>candyTrip),tripStart+2);
  for(const [profile,viewport] of [['handheld',{width:854,height:480}],['desktop',{width:1920,height:1080}],['tablet',{width:1024,height:768}]]){
   await page.setViewportSize(viewport);await page.getByRole('button',{name:'Settings'}).click();await page.locator('#display-profile').selectOption(profile);await page.getByRole('button',{name:'Save & return to orbit'}).click();
   assert.equal(await page.locator('body').getAttribute('data-profile'),profile);
   assert.ok(await page.locator('body').evaluate(e=>e.scrollWidth<=innerWidth&&e.scrollHeight<=innerHeight));
  }
  const sanitized=await page.evaluate(()=>normalizeDisplay({clockScale:-100,weatherScale:999,factScale:'bad',gap:999,companionInterval:0,profile:'bogus'}));
  assert.equal(sanitized.clockScale,.65);assert.equal(sanitized.weatherScale,1.2);assert.equal(sanitized.factScale,1);assert.equal(sanitized.gap,24);assert.equal(sanitized.companionInterval,30);assert.equal(sanitized.profile,'auto');
  assert.deepEqual(errors,[]);console.log('PASS font/spacing controls, persistence, companion toggle and interval across panel shifts, reset, device presets, and configuration limits.');
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exit(1);});
