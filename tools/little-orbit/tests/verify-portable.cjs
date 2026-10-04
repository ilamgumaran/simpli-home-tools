const path=require('node:path');
const {pathToFileURL}=require('node:url');

const {chromium,firefox,channelOptions}=require('./runtime.cjs');
const assert=require('node:assert/strict');
const clockUrl=pathToFileURL(path.join(__dirname,'..','Little Orbit.html')).href;
(async()=>{
 for(const [name,engine,options] of (process.env.CLOCK_TEST_BROWSER?[process.env.CLOCK_TEST_BROWSER==='firefox'?['Firefox',firefox,{}]:['Chromium',chromium,channelOptions]]:[['Chromium',chromium,channelOptions],['Firefox',firefox,{}]])){
  const browser=await engine.launch({...options,headless:true});
  try{
   const context=await browser.newContext({viewport:{width:1280,height:720},reducedMotion:'reduce',offline:true});
   await context.route('https://**',route=>route.abort());
   const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
   await page.goto(clockUrl);
   await page.waitForFunction(()=>document.getElementById('weather-status').textContent.includes('No connection')||document.getElementById('weather-status').textContent.includes('Offline')).catch(async e=>{console.log({browser:name,errors,clock:await page.locator('#time').innerText(),weather:await page.locator('#weather-status').innerText()});throw e;});
   assert.match(await page.locator('#time').innerText(),/\d{2}:\d{2}/);
   assert.ok((await page.locator('#fact-text').innerText()).length>20);
   assert.equal(await page.locator('body').evaluate(e=>e.scrollWidth<=innerWidth&&e.scrollHeight<=innerHeight),true);
   await page.getByRole('button',{name:'Settings'}).click();await page.locator('#format24').check();await page.getByRole('button',{name:'Save & return to orbit'}).click();
   await page.reload();assert.equal(await page.locator('#period').innerText(),'24H');
   await page.getByRole('button',{name:'Touch lock'}).click();
   await page.keyboard.down('Enter');await page.waitForTimeout(2200);await page.keyboard.up('Enter');
   assert.equal(await page.locator('#lock-overlay').isVisible(),false);
   await page.setViewportSize({width:390,height:844});
   assert.equal(await page.locator('body').evaluate(e=>e.scrollWidth<=innerWidth),true);
   const restricted=await context.newPage();restricted.on('pageerror',e=>errors.push(e.message));
   await restricted.addInitScript(()=>{
    Object.defineProperty(window,'localStorage',{get(){throw Error('Storage blocked');}});
    Object.defineProperty(navigator,'wakeLock',{value:undefined,configurable:true});
    Element.prototype.requestFullscreen=undefined;
    AbortSignal.timeout=undefined;
   });
   await restricted.goto(clockUrl);
   assert.equal(await restricted.locator('#wake-status').innerText(),'USE DEVICE SLEEP SETTINGS');
   await restricted.getByRole('button',{name:'Full screen'}).click();
   assert.match(await restricted.locator('#toast').innerText(),/browser’s full-screen menu/);
   await restricted.getByRole('button',{name:'Settings'}).click();await restricted.locator('#format24').check();await restricted.getByRole('button',{name:'Save & return to orbit'}).click();
   assert.equal(await restricted.locator('#period').innerText(),'24H');
   assert.deepEqual(errors,[]);
   console.log(`PASS ${name}: single-file offline clock/facts, layout, saved preferences, hold-to-unlock, mobile sizing, restricted-storage and missing-API fallbacks.`);
  }finally{await browser.close();}
 }
})().catch(e=>{console.error(e);process.exit(1);});
