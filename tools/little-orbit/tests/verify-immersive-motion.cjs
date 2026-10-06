// SPDX-License-Identifier: LicenseRef-Simpli-Noncommercial-1.0
// Copyright (C) 2026 ilamgumaran and contributors
const {engine,options,url,freezeClock}=require('./runtime.cjs');
const assert=require('node:assert/strict'),path=require('node:path'),{pathToFileURL}=require('node:url');
const portable=pathToFileURL(path.join(__dirname,'..','Little Orbit.html')).href;
const names={leftHand:'arm-left',rightHand:'arm-right',leftFoot:'leg-left',rightFoot:'leg-right'};
const settings={theme:'woodland',care:false,rest:false,night:false,lowPower:false,display:{woodlandView:'immersive'}};
const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);

async function verifyChoreography(browser,target){
 const context=await browser.newContext({viewport:{width:854,height:480},timezoneId:'America/New_York'}),page=await context.newPage(),errors=[];
 try{
  page.on('pageerror',error=>errors.push(error.message));await page.route('https://**',route=>route.abort());
  await freezeClock(page,'2026-10-05T10:00:01-04:00');
  await page.addInitScript(settings=>localStorage.setItem('orbit-settings',JSON.stringify(settings)),settings);
  await page.goto(target);assert.equal(await page.locator('#woodland-immersive').isVisible(),true);
  const sample=async stamp=>{
   await page.clock.setSystemTime(new Date(stamp));
   return page.evaluate(names=>{
    WoodlandScene.sync();
    const at=(node,fraction)=>{const p=node.getPointAtLength(node.getTotalLength()*fraction),screen=new DOMPoint(p.x,p.y).matrixTransform(node.getScreenCTM());return {x:screen.x,y:screen.y};};
    return [...document.querySelectorAll('#woodland-immersive-cast > g')].map(host=>{
     const art=host.querySelector('.character-art'),root=new DOMPoint(0,0).matrixTransform(art.getScreenCTM());
     return {id:art.dataset.character,root:{x:root.x,y:root.y},ends:Object.values(names).map(name=>at(host.querySelector(`[data-part="${name}"]`),1))};
    });
   },names);
  };
  const continuous=async boundary=>{
   // Date resolves to whole milliseconds. Compare the crossing with its two
   // adjacent one-millisecond velocities, rather than imposing a speed limit
   // on a naturally faster swing foot. A teleport leaves a crossing residual.
   const samples=[];for(const offset of [-2,-1,1,2])samples.push(await sample(boundary+offset));
   for(const actors of samples)assert.deepEqual(actors.map(actor=>actor.id),samples[0].map(actor=>actor.id),'Cast changes identity at '+new Date(boundary).toISOString());
   for(let index=0;index<samples[0].length;index++){
    const actors=samples.map(actors=>actors[index]);let residual=0,velocityChange=0;
    for(let point=0;point<=actors[0].ends.length;point++){
     const [a,b,c,d]=actors.map(actor=>point===0?actor.root:actor.ends[point-1]);
     const left={x:b.x-a.x,y:b.y-a.y},right={x:d.x-c.x,y:d.y-c.y};
     residual=Math.max(residual,Math.hypot(c.x-b.x-left.x-right.x,c.y-b.y-left.y-right.y));
     velocityChange=Math.max(velocityChange,distance(left,right));
    }
    assert.ok(residual<.15&&velocityChange<.15,JSON.stringify({boundary:new Date(boundary).toISOString(),actor:actors[0].id,residual,velocityChange}));
   }
  };
  // Every actor travels: fixed supervisors, following children and adult helpers
  // must all join the old minute, not just the protagonist's world-space root.
  for(const day of [5,6,7])for(let minute=0;minute<12;minute++){
   const base=+new Date(`2026-10-${String(day).padStart(2,'0')}T10:${String(minute).padStart(2,'0')}:00-04:00`);
   await sample(base);
   const timing=await page.evaluate(stamp=>WoodlandScene.timing(new Date(stamp)),base);
   assert.ok(Number.isFinite(timing.travel)&&timing.travel>=0,'Responsive travel duration is available');
   const phaseEdges=[0,3,11,15,20,23,31,35,40,43,51,55];
   const edges=new Set([timing.travel,60,...phaseEdges,...phaseEdges.map(second=>second+.7)]);
   if(Number.isFinite(timing.descent)&&timing.descent>0)edges.add(timing.descent);
   if(minute===5){
    assert.ok(Number.isFinite(timing.climbStart)&&Number.isFinite(timing.climbBout)&&timing.climbBout>0,'Protected work begins after travel');
    for(let bout=0;bout<3;bout++){
     const start=timing.climbStart+bout*timing.climbBout;
     for(const offset of [0,.5,5,9,timing.climbBout-1,timing.climbBout])edges.add(start+offset);
    }
   }
   for(const second of [...edges].filter(second=>second>=0&&second<=60))await continuous(base+second*1000);
  }

  // A planted foot also stays on a sloping approach: moving the root uphill
  // must not drag a supporting boot vertically along a flat local floor.
  const ramp=+new Date('2026-10-05T10:00:00-04:00');await sample(ramp);
  const rampTiming=await page.evaluate(stamp=>WoodlandScene.timing(new Date(stamp)),ramp);
  let planted=0;
  const feet=()=>page.evaluate(()=>{
   const host=document.querySelector('#woodland-immersive-cast > g'),inverse=document.querySelector('#woodland-immersive-camera').getScreenCTM().inverse(),contacts=JSON.parse(host.dataset.footContacts);
   return ['leftFoot','rightFoot'].map((name,i)=>{const path=host.querySelector(`[data-part="leg-${i?'right':'left'}"]`),p=path.getPointAtLength(path.getTotalLength()),q=new DOMPoint(p.x,p.y).matrixTransform(inverse.multiply(path.getScreenCTM()));return {name,planted:contacts[name],x:q.x,y:q.y};});
  });
  for(let second=1;second<rampTiming.travel-.9;second+=.11){
   await sample(ramp+second*1000);const a=await feet();await sample(ramp+(second+.01)*1000);const b=await feet();
   for(let i=0;i<2;i++)if(a[i].planted&&b[i].planted){assert.ok(distance(a[i],b[i])<.015,JSON.stringify({second,a:a[i],b:b[i]}));planted++;}
  }
  assert.ok(planted>5,'No walking support samples on the uphill approach');
  // Portrait contacts are measured against the rendered hold marks, including
  // rope attachment. Recovery is stationary relative to the drifting camera.
  await page.setViewportSize({width:390,height:844});
  const base=+new Date('2026-10-05T10:05:00-04:00');await sample(base);
  const timing=await page.evaluate(stamp=>WoodlandScene.timing(new Date(stamp)),base);
  const contacts=()=>{
   WoodlandScene.sync();
   const host=document.querySelector('#woodland-immersive-cast > g'),held=JSON.parse(host.dataset.contactHolds),camera=document.querySelector('#woodland-immersive-camera').getScreenCTM().inverse();
   const at=(node,fraction,matrix)=>{const point=node.getPointAtLength(node.getTotalLength()*fraction),p=new DOMPoint(point.x,point.y).matrixTransform(matrix.multiply(node.getScreenCTM()));return {x:p.x,y:p.y};};
   const map={leftHand:'arm-left',rightHand:'arm-right',leftFoot:'leg-left',rightFoot:'leg-right'};
   const errors=Object.entries(held).filter(([,id])=>id).map(([name,id])=>{
    const a=at(host.querySelector(`[data-part="${map[name]}"]`),1,new DOMMatrix()),b=at(document.querySelector(`[data-hold="${id}"]`),.5,new DOMMatrix());return Math.hypot(a.x-b.x,a.y-b.y);
   });
   const loop=DeskCharacters.anatomy.belayLoop,p=new DOMPoint(loop.x,loop.y).matrixTransform(host.querySelector('.character-art').getScreenCTM()),rope=at(document.querySelector('#woodland-immersive-rope'),1,new DOMMatrix());
   return {errors,rope:Math.hypot(p.x-rope.x,p.y-rope.y),held,ends:Object.values(map).map(name=>at(host.querySelector(`[data-part="${name}"]`),1,camera)),root:host.getAttribute('transform'),phase:document.querySelector('#woodland-immersive').dataset.phase,aid:host.querySelector('[data-part="ascender"]').getAttribute('display')!=='none'};
  };
  for(let bout=0;bout<3;bout++){
   for(const offset of [.6,2,4,5.5,7.5,9.5,timing.climbBout-.5]){
    await sample(base+(timing.climbStart+bout*timing.climbBout+offset)*1000);
    const result=await page.evaluate(contacts);
    assert.ok(result.errors.length>=3&&result.errors.every(error=>error<.06),JSON.stringify(result));
    assert.ok(result.rope<.06,'Protection rope detached from the harness');
   }
   await sample(base+(timing.climbStart+bout*timing.climbBout+5.5)*1000);const a=await page.evaluate(contacts);
   await sample(base+(timing.climbStart+bout*timing.climbBout+7.5)*1000);const b=await page.evaluate(contacts);
   assert.deepEqual(a.held,b.held,'Recovery releases a hold');assert.equal(a.root,b.root,'Body moves during mandatory recovery');
   assert.equal(a.aid,false);assert.equal(b.aid,false,'Deadline aid remains active during recovery');
   assert.ok(a.ends.every((point,index)=>distance(point,b.ends[index])<.015),'Recovery moves a supported limb');
  }
  await sample(base+59001);const settled=await page.evaluate(contacts);assert.equal(settled.phase,'settle');assert.equal(settled.aid,false,'Deadline aid remains active in final rest');

  await page.emulateMedia({reducedMotion:'reduce'});await page.evaluate(()=>WoodlandScene.sync());
  assert.equal(await page.evaluate(()=>WoodlandScene.running),false);
  const still=await sample(base+25000),later=await sample(base+26000);
  assert.deepEqual(still,later,'Reduced-motion scene changes character geometry within a minute');
  await page.emulateMedia({reducedMotion:'no-preference'});await page.evaluate(()=>WoodlandScene.sync());
  await page.evaluate(async()=>{document.querySelector('#settings').showModal();await Promise.resolve();});
  assert.equal(await page.evaluate(()=>WoodlandScene.running||WoodlandScene.pending),false,'Settings leave scene rendering active');
  await page.evaluate(async()=>{document.querySelector('#settings').close();await Promise.resolve();});
  assert.equal(await page.evaluate(()=>WoodlandScene.running),true);
  await page.evaluate(()=>{Object.defineProperty(document,'visibilityState',{value:'hidden',configurable:true});document.dispatchEvent(new Event('visibilitychange'));});
  assert.equal(await page.evaluate(()=>WoodlandScene.running||WoodlandScene.pending),false,'Hidden document keeps rendering');
  await page.evaluate(()=>{delete document.visibilityState;document.dispatchEvent(new Event('visibilitychange'));});
  assert.equal(await page.evaluate(()=>WoodlandScene.running),true);
  await page.evaluate(()=>{prefs.display.companion=false;WoodlandScene.sync();});
  assert.equal(await page.locator('#woodland-immersive-cast').isVisible(),false);assert.equal(await page.evaluate(()=>WoodlandScene.running),true,'Ambient scene stops with people disabled');
  const environment=()=>page.evaluate(()=>({camera:document.querySelector('#woodland-immersive-camera').getAttribute('transform'),light:document.querySelector('#woodland-immersive-light').getAttribute('opacity'),wind:[...document.querySelectorAll('[data-wind],[data-cloud],[data-river]')].map(e=>e.getAttribute('transform'))}));
  await sample(base+10000);const early=await environment();await sample(base+195000);const late=await environment();
  assert.notEqual(early.camera,late.camera);assert.notEqual(early.light,late.light);assert.notDeepEqual(early.wind,late.wind,'Atmosphere stays fixed over several minutes');
  await page.evaluate(()=>{prefs.display.cameraMotion='still';WoodlandScene.sync();});
  assert.equal((await environment()).camera,'translate(0 0)');assert.equal(await page.evaluate(()=>WoodlandScene.running),true,'Still camera stops water/wind');
  await page.evaluate(()=>{document.body.classList.add('screen-rest');WoodlandScene.sync();});
  assert.equal(await page.evaluate(()=>WoodlandScene.running||WoodlandScene.pending),false,'Screen rest leaves rendering active');
  assert.deepEqual(errors,[]);
  console.log('PASS immersive motion:',target.startsWith('file:')?'portable':'hosted','all casts, minute/arrival/bout joins, portrait protection, recovery and pauses.');
 }finally{await context.close();}
}

async function verifyCadence(browser,target,deviceScaleFactor=1){
 const viewport=deviceScaleFactor===2?{width:1280,height:720}:{width:854,height:480};
 const context=await browser.newContext({viewport,deviceScaleFactor,timezoneId:'America/New_York'}),page=await context.newPage(),errors=[];
 try{
  page.on('pageerror',error=>errors.push(error.message));await page.route('https://**',route=>route.abort());
  // Only Date is shifted. RAF, performance.now() and timers keep their real
  // cadence, so geometry observations measure frames actually displayed.
  await page.addInitScript(settings=>{
   const RealDate=Date,start=performance.now(),base=+new RealDate('2026-10-05T10:08:05-04:00');
   window.Date=class extends RealDate{constructor(...args){super(...(args.length?args:[base+performance.now()-start]));}static now(){return base+performance.now()-start;}};
   localStorage.setItem('orbit-settings',JSON.stringify({...settings,lowPower:true}));
  },settings);
  await page.goto(target);await page.waitForTimeout(150);
  for(const lowPower of [true,false]){
   await page.evaluate(lowPower=>{prefs.lowPower=lowPower;WoodlandScene.sync();},lowPower);
   const result=await page.evaluate(async()=>{
    const host=document.querySelector('#woodland-immersive-cast > g');let last='',frames=[];
    const observer=new MutationObserver(()=>{
     const geometry=host.getAttribute('transform')+[...host.querySelectorAll('[data-part^="arm-"],[data-part^="leg-"]')].map(part=>part.getAttribute('d')).join(':')+host.querySelector('[data-layer=body]').getAttribute('transform');
     if(geometry!==last){last=geometry;frames.push(performance.now());}
    });
    observer.observe(host,{subtree:true,attributes:true,attributeFilter:['d','transform']});
    const start=performance.now();await new Promise(resolve=>setTimeout(resolve,2100));observer.disconnect();
    const elapsed=performance.now()-start,gaps=frames.slice(1).map((at,i)=>at-frames[i]).sort((a,b)=>a-b);
    return {fps:frames.length*1000/elapsed,p95:gaps[Math.floor(gaps.length*.95)],maxGap:gaps.at(-1)};
   });
   assert.ok(result.fps>=(lowPower?26:45),JSON.stringify({lowPower,result}));
   assert.ok(result.p95<=(lowPower?46:31)&&result.maxGap<100,JSON.stringify({lowPower,result}));
   console.log('PASS immersive frame cadence:',target.startsWith('file:')?'portable':'hosted',`${viewport.width}×${viewport.height} DPR${deviceScaleFactor}`,lowPower?'30fps low-power':'60fps normal',JSON.stringify(result));
  }
  assert.deepEqual(errors,[]);
 }finally{await context.close();}
}

(async()=>{
 const browser=await engine.launch({...options,headless:true});
 try{for(const target of [url,portable]){await verifyChoreography(browser,target);await verifyCadence(browser,target);}await verifyCadence(browser,url,2);}
 finally{await browser.close();}
})().catch(error=>{console.error(error);process.exit(1)});
