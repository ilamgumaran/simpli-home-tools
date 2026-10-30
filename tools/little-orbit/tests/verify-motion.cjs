const {engine,options,url,freezeClock}=require('./runtime.cjs');
const assert=require('node:assert/strict'),path=require('node:path'),{pathToFileURL}=require('node:url');
const {installCadenceTrace,writeTrace,emitTrace}=require('./cadence-trace.cjs');
async function verifyTransitions(browser,target){
 const context=await browser.newContext({viewport:{width:1280,height:720},timezoneId:'America/New_York'}),page=await context.newPage();
 try{
  await freezeClock(page,'2026-10-05T10:06:59.999-04:00');await page.route('https://**',r=>r.abort());
  await page.addInitScript(()=>localStorage.setItem('orbit-settings',JSON.stringify({theme:'woodland',care:false,rest:false,night:false,lowPower:false,display:{woodlandView:'dashboard',companionInterval:30,companionDuration:20}})));
  await page.goto(target);
  const sample=async timestamp=>{
   await page.clock.setSystemTime(new Date(timestamp));return page.evaluate(()=>{
    WoodlandTime.sync();const host=document.querySelector('#woodland-cast > g');
    const ends=['arm-left','arm-right','leg-left','leg-right'].map(name=>{const path=host.querySelector(`[data-part="${name}"]`),point=path.getPointAtLength(path.getTotalLength()),screen=new DOMPoint(point.x,point.y).matrixTransform(path.getScreenCTM());return {x:screen.x,y:screen.y};});
    const {visitStart,travel,workStart,workDuration}=WoodlandTime.timing(new Date());return {ends,visitStart,travel,workStart,workDuration};
   });
  };
  const continuous=async boundary=>{
   const before=await sample(boundary-1),after=await sample(boundary+1);
   assert.ok(before.ends.every((point,i)=>Math.hypot(point.x-after.ends[i].x,point.y-after.ends[i].y)<.1),'Rendered limb jumps at '+new Date(boundary).toISOString());
  };
  const base=+new Date('2026-10-05T10:06:00-04:00');
  await continuous(base+60000);await continuous(base+30000);
  for(const second of [0,30]){
   const timing=await sample(base+second*1000);
   await continuous(base+(timing.visitStart+timing.travel)*1000);
   await continuous(base+(timing.workStart+timing.workDuration)*1000);
  }
  console.log('PASS rendered transitions:',target.startsWith('file:')?'portable':'hosted','contact-rig departure, repeated protected return, arrival and work ending.');
 }finally{await context.close();}
}
(async()=>{
 const browser=await engine.launch({...options,headless:true});
 try{
  for(const target of [url,pathToFileURL(path.join(__dirname,'..','Little Orbit.html')).href]){
   const context=await browser.newContext({viewport:{width:854,height:480},timezoneId:'America/New_York'}),page=await context.newPage(),errors=[];
   page.on('pageerror',e=>errors.push(e.message));await page.route('https://**',r=>r.abort());
   // Keep actual RAF/timers. Only the calendar is placed inside an active visit.
   await page.addInitScript(()=>{
    const RealDate=Date,start=performance.now(),base=+new RealDate('2026-10-05T10:00:09.000-04:00');
    window.Date=class extends RealDate{constructor(...args){super(...(args.length?args:[base+performance.now()-start]));}static now(){return base+performance.now()-start;}};
    localStorage.setItem('orbit-settings',JSON.stringify({theme:'woodland',care:false,rest:false,night:false,lowPower:true,display:{woodlandView:'dashboard',companionInterval:60,companionDuration:20}}));
   });
   await page.addInitScript(installCadenceTrace);
   await page.goto(target);
   // Measure steady motion after fonts and first-paint/JIT work settle,
   // with the real timers, full sample duration and all gates unchanged.
   await page.evaluate(()=>document.fonts?.ready);
   await page.waitForTimeout(1000);
   for(const lowPower of [true,false]){
    await page.evaluate(lowPower=>{prefs.lowPower=lowPower;WoodlandTime.sync();},lowPower);
    const resultSample=await page.evaluate(async()=>{
     const host=document.querySelector('#woodland-cast > g'),leg=host.querySelector('[data-part=leg-left]');
     let last='',frames=[];
     const observer=new MutationObserver(()=>{const geometry=host.getAttribute('transform')+leg.getAttribute('d');if(geometry!==last){last=geometry;frames.push(performance.now());}});
     observer.observe(host,{subtree:true,attributes:true,attributeFilter:['d','transform']});
     // Diagnostic-only sampling adds one cheap pair push per native RAF callback.
     const callbacks=[];let rafId;const sampleRaf=timestamp=>{callbacks.push([timestamp,performance.now()]);rafId=requestAnimationFrame(sampleRaf);};
     rafId=requestAnimationFrame(sampleRaf);const start=performance.now();window.__clockCadenceTrace.start(start);await new Promise(resolve=>setTimeout(resolve,2100));observer.disconnect();cancelAnimationFrame(rafId);
     const elapsed=performance.now()-start,gaps=frames.slice(1).map((at,i)=>at-frames[i]).sort((a,b)=>a-b);
     const summarize=values=>{const sorted=values.slice().sort((a,b)=>a-b);return {p95:sorted[Math.floor(sorted.length*.95)],max:sorted.at(-1)};};
     const nominal=callbacks.slice(1).map((item,i)=>item[0]-callbacks[i][0]),actual=callbacks.slice(1).map((item,i)=>item[1]-callbacks[i][1]);
     const round=value=>Number.isFinite(value)?Math.round(value*100)/100:null,nominalSummary=summarize(nominal),actualSummary=summarize(actual);
     const result={fps:frames.length*1000/elapsed,p95:gaps[Math.floor(gaps.length*.95)],maxGap:gaps.at(-1),frames:frames.length,callback:{count:callbacks.length,fps:callbacks.length*1000/elapsed,nominalP95:round(nominalSummary.p95),nominalMax:round(nominalSummary.max),actualP95:round(actualSummary.p95),actualMax:round(actualSummary.max),tailNominalGaps:nominal.slice(-160).map(round),largestNominalGaps:nominal.slice().sort((a,b)=>b-a).slice(0,8).map(round)}};
     return {result,trace:{...window.__clockCadenceTrace.stop(start+elapsed),geometryTimesMs:frames,geometryStartMs:start,geometryEndMs:start+elapsed}};
    });
    const {result,trace}=resultSample;
    const viewport={width:854,height:480},contextInfo={suite:'dashboard',form:target.startsWith('file:')?'portable':'hosted',browser:process.env.CLOCK_TEST_BROWSER||'chromium',browserVersion:browser.version(),viewport,deviceScaleFactor:1,dpr:1,lowPower};
    const record=writeTrace('cadence',contextInfo,{metrics:result,...trace});
    try{
     assert.ok(result.fps>=(lowPower?26:45),JSON.stringify({lowPower,result}));
     assert.ok(result.p95<=(lowPower?46:31)&&result.maxGap<100,JSON.stringify({lowPower,result}));
    }catch(error){try{emitTrace(record);}catch{}throw error;}
    console.log('PASS live motion cadence:',target.startsWith('file:')?'portable':'hosted',lowPower?'low-power':'normal',JSON.stringify(result));
   }
   // Quiet visits stop rendering; current-time snapshots still work with reduced motion.
   await page.emulateMedia({reducedMotion:'reduce'});await page.evaluate(()=>WoodlandTime.sync());assert.equal(await page.evaluate(()=>WoodlandTime.running),false);
   await page.evaluate(()=>{prefs.display.companion=false;WoodlandTime.sync();});assert.equal(await page.evaluate(()=>WoodlandTime.running),false);
   assert.deepEqual(errors,[]);await context.close();await verifyTransitions(browser,target);
  }
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exit(1)});
