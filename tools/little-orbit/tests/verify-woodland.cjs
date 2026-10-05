const {engine,options,url,freezeClock}=require('./runtime.cjs');
const assert=require('node:assert/strict'),path=require('node:path'),{pathToFileURL}=require('node:url');
(async()=>{
 const browser=await engine.launch({...options,headless:true});
 try{
  for(const target of [url,pathToFileURL(path.join(__dirname,'..','Little Orbit.html')).href]){
   const context=await browser.newContext({viewport:{width:1280,height:720},timezoneId:'America/New_York'});
   const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.route('https://**',r=>r.abort());
   await freezeClock(page,'2026-10-05T10:02:04-04:00');
   await page.addInitScript(()=>localStorage.setItem('orbit-settings',JSON.stringify({theme:'woodland',care:false,rest:false,night:false,lowPower:false})));
   await page.goto(target);assert.equal(await page.locator('#woodland-scene').isVisible(),true);
   const checkTime=async expected=>{
    assert.equal(await page.locator('#woodland-scene').getAttribute('data-time'),expected);assert.equal(await page.locator('#time').innerText(),expected);
    const glyphs=await page.locator('#woodland-numerals').evaluate(e=>[...e.children].map(g=>({digit:g.dataset.digit,path:g.querySelector('.woodland-trail').getAttribute('d'),expected:DeskWorlds.numerals[g.dataset.digit]})));
    assert.equal(glyphs.map(g=>g.digit).join(''),expected.replace(':',''));assert.ok(glyphs.every(g=>g.path===g.expected));assert.equal(glyphs.length,4);
    assert.match(await page.locator('#woodland-title').textContent(),new RegExp(expected));
   };
   // Work starts after the actual responsive crossing. Test activity phases,
   // rather than assuming every layout reaches the worksite in three seconds.
   const atWork=async(stamp,progress,{remaining=null}={})=>{
    const minute=new Date(stamp),timing=await page.evaluate(stamp=>WoodlandTime.timing(new Date(stamp)),minute.toISOString());
    assert.ok(timing.workDuration>=4,'Activity has no complete effort/recovery window');
    const second=timing.workStart+(remaining===null?timing.workDuration*progress:timing.workDuration-remaining);
    await page.clock.setSystemTime(new Date(minute.getTime()+second*1000));await page.evaluate(()=>WoodlandTime.refresh());
    return {second,timing};
   };
   await checkTime('10:02');await page.evaluate(()=>{prefs.format24=true;WoodlandTime.sync();});assert.match(await page.locator('#woodland-title').textContent(),/24H/);await page.evaluate(()=>{prefs.format24=false;WoodlandTime.sync();});assert.equal(await page.locator('#woodland-scene').getAttribute('data-story'),'family');assert.equal(await page.locator('#woodland-cast > g').count(),3);
   for(const viewport of [{width:854,height:480},{width:1280,height:720},{width:1920,height:1080},{width:390,height:844}]){
    await page.setViewportSize(viewport);
    const result=await page.evaluate(()=>{
     let maxHeight=0,minDigit=Infinity,minStroke=Infinity,minCharacter=Infinity,clipped=false,glyphClipped=false;
     for(const focus of [false,true])for(const scale of [.8,1.2])for(const f of facts){
      prefs.display.factScale=scale;prefs.display.clockScale=scale;prefs.display.weatherScale=scale;document.documentElement.style.setProperty('--fact-scale',scale);document.documentElement.style.setProperty('--clock-scale',scale);document.documentElement.style.setProperty('--weather-scale',scale);
      document.body.classList.toggle('fact-focus',focus);document.querySelector('#fact-title').textContent=f[0];document.querySelector('#fact-text').textContent=f[1];WoodlandTime.sync();
      maxHeight=Math.max(maxHeight,document.body.scrollHeight);
      const path=document.querySelector('.woodland-trail'),matrix=path.getScreenCTM();minDigit=Math.min(minDigit,150*matrix.d);minStroke=Math.min(minStroke,13*matrix.d);
      const adult=document.querySelector('#woodland-cast .character-art');minCharacter=Math.min(minCharacter,adult.getBoundingClientRect().height);
      const scene=document.querySelector('#woodland-world').getBoundingClientRect();
      for(const actor of document.querySelectorAll('#woodland-cast .character-art')){const b=actor.getBoundingClientRect();clipped ||= b.bottom>scene.bottom||b.top<scene.top||b.left<scene.left||b.right>scene.right;}
      for(const glyph of document.querySelectorAll('.woodland-trail-bed')){const b=glyph.getBoundingClientRect(),m=glyph.getScreenCTM(),stroke=11*m.a;glyphClipped ||= b.left-stroke<scene.left||b.right+stroke>scene.right||b.top-stroke<scene.top||b.bottom+stroke>scene.bottom;}
     }
     const rig=document.querySelector('#woodland-cast .character-art').getScreenCTM();
     return {height:maxHeight,width:document.body.scrollWidth,minDigit,minStroke,minCharacter,proportion:rig.a/rig.d,clipped,glyphClipped};
    });
    assert.ok(result.height<=viewport.height&&result.width<=viewport.width,JSON.stringify({viewport,result}));assert.ok(result.minDigit>=24&&result.minStroke>=2,JSON.stringify({viewport,result}));
    assert.ok(result.minCharacter>=29,JSON.stringify({viewport,result}));assert.ok(Math.abs(result.proportion-1)<.001,JSON.stringify({viewport,result}));
    assert.equal(result.clipped,false,JSON.stringify({viewport,result}));
    assert.equal(result.glyphClipped,false,JSON.stringify({viewport,result}));
   }
   await page.setViewportSize({width:1280,height:720});await page.evaluate(()=>{prefs.display.factScale=1;prefs.display.clockScale=1;prefs.display.weatherScale=1;applyDisplay();WoodlandTime.refresh();});
   // Observe actual rendered endpoints on terrain holds during rock steps/body lifts.
   for(const progress of [.05,.12,.24,.36,.48,.51,.6,.73,.9,1]){
    await atWork('2026-10-05T10:06:00-04:00',progress);
    const geometry=await page.evaluate(()=>{
     WoodlandTime.refresh();const host=document.querySelector('#woodland-cast > g'),held=JSON.parse(host.dataset.contactHolds),names={leftHand:'arm-left',rightHand:'arm-right',leftFoot:'leg-left',rightFoot:'leg-right'};
     const at=(node,t)=>{const p=node.getPointAtLength(node.getTotalLength()*t);return new DOMPoint(p.x,p.y).matrixTransform(node.getCTM());};
     const errors=Object.entries(held).filter(([,id])=>id).map(([name,id])=>{const limb=host.querySelector(`[data-part="${names[name]}"]`),hold=document.querySelector(`[data-hold="${id}"]`),a=at(limb,1),b=at(hold,.5);return Math.hypot(a.x-b.x,a.y-b.y);});
     const loop=DeskCharacters.anatomy.belayLoop,atLoop=new DOMPoint(loop.x,loop.y).matrixTransform(host.querySelector('.character-art').getCTM()),ropeEnd=at(document.querySelector('#woodland-rope'),1);
     return {errors,rope:Math.hypot(atLoop.x-ropeEnd.x,atLoop.y-ropeEnd.y),root:host.getAttribute('transform'),phase:document.querySelector('#woodland-scene').dataset.phase};
    });
    assert.ok(geometry.errors.length>=3&&geometry.errors.every(error=>error<.03),JSON.stringify(geometry));assert.ok(geometry.rope<.03,'Rock protection detached from harness');
   }
   await atWork('2026-10-05T10:06:00-04:00',.36);
   const recoveryGeometry=()=>{const host=document.querySelector('#woodland-cast > g');return {root:host.getAttribute('transform'),holds:host.dataset.contactHolds,limbs:[...host.querySelectorAll('[data-part^="arm-"],[data-part^="leg-"]')].map(p=>p.getAttribute('d'))};};
   const rockRecovery=await page.evaluate(recoveryGeometry);await page.clock.runFor(1000);assert.deepEqual(await page.evaluate(recoveryGeometry),rockRecovery,'Rock contacts move during recovery');
   // Every activity has a coherent current-time snapshot, even between visits.
   for(const progress of [.45,.47,.49,.51,.55,.6,.65,.7,.75,.8,.85,.88,1]){
    const {second}=await atWork('2026-10-05T10:00:00-04:00',progress);
    const ground=await page.evaluate(()=>{
     WoodlandTime.refresh();const host=document.querySelector('#woodland-cast > g'),contacts=JSON.parse(host.dataset.groundContacts),inverse=document.querySelector('#woodland-world').getScreenCTM().inverse();
     const ends=['left','right'].map(side=>{const path=host.querySelector(`[data-part="leg-${side}"]`),point=path.getPointAtLength(path.getTotalLength());return new DOMPoint(point.x,point.y).matrixTransform(inverse.multiply(path.getScreenCTM()));});
     return {ends:ends.map(p=>({x:p.x,y:p.y})),contacts,ground:document.querySelector('#woodland-walk-ground').getBBox().y,map:host.querySelector('[data-part=held-map]').getAttribute('display')};
    });
    assert.equal(ground.map,'none','Map should be stowed during walking');
    assert.ok(ground.ends.every(p=>p.y<=ground.ground+.02));
    const planted=Object.entries(ground.contacts).filter(([,hold])=>hold);assert.ok(planted.length>=1);
    for(const [name,hold] of planted){const p=ground.ends[name==='leftFoot'?0:1];assert.ok(Math.hypot(p.x-hold.x,p.y-hold.y)<.03,JSON.stringify({second,name,p,hold,ground}));}
   }
   await atWork('2026-10-05T10:00:00-04:00',.2);assert.equal(await page.locator('#woodland-cast [data-part=held-map]').first().getAttribute('display'),'');
   for(const minute of [1,8]){
    await atWork(`2026-10-05T10:${String(minute).padStart(2,'0')}:00-04:00`,.6);
    const grip=await page.evaluate(minute=>{
     WoodlandTime.refresh();const host=document.querySelector('#woodland-cast > g'),part=host.querySelector(`[data-part="arm-${minute===8?'right':'left'}"]`),end=part.getPointAtLength(part.getTotalLength()),wrist=new DOMPoint(end.x,end.y).matrixTransform(part.getCTM());
     const tool=minute===8?host.querySelector('[data-part=held-spoon]'):document.querySelector('#woodland-stick-grip'),tip=new DOMPoint(14,0).matrixTransform(tool.getCTM()),handle=new DOMPoint(0,0).matrixTransform(tool.getCTM()),target=document.querySelector('#woodland-work-target'),socket=new DOMPoint(Number(target.getAttribute('cx')),Number(target.getAttribute('cy'))).matrixTransform(target.getCTM());
     return {hand:Math.hypot(handle.x-wrist.x,handle.y-wrist.y),work:Math.hypot(tip.x-socket.x,tip.y-socket.y)};
    },minute);
    assert.ok(grip.hand<.03&&grip.work<.03,JSON.stringify(grip));
   }
   for(let minute=0;minute<12;minute++){
    await atWork(`2026-10-05T10:${String(minute).padStart(2,'0')}:00-04:00`,.5);
    await checkTime('10:'+String(minute).padStart(2,'0'));assert.ok((await page.locator('#woodland-props').innerHTML()).length>0);
    if(minute===3)assert.equal(await page.locator('#woodland-cast [data-part=held-bottle]').first().getAttribute('display'),'');
    if(minute===8)assert.equal(await page.locator('#woodland-cast [data-part=held-spoon]').first().getAttribute('display'),'');
   }
   await atWork('2026-10-05T10:05:00-04:00',.36);
   const recovering=await page.locator('#woodland-cast > g').first().getAttribute('transform');assert.equal(await page.locator('#woodland-scene').getAttribute('data-phase'),'recover');await page.clock.runFor(1000);
   assert.equal(await page.locator('#woodland-cast > g').first().getAttribute('transform'),recovering);assert.equal(await page.locator('#woodland-cast .character-art').first().getAttribute('data-action'),'recover-climb');
   await atWork('2026-10-05T10:05:00-04:00',1,{remaining:1.2});assert.equal(await page.locator('#woodland-cast .character-art').first().getAttribute('data-rope-system'),'protected-fixed-line');
   // A visit spaced across a boundary must not keep the old digit on screen.
   await page.clock.setSystemTime(new Date('2026-10-05T10:09:59.900-04:00'));await page.evaluate(()=>{prefs.display.companionInterval=45;prefs.display.companionDuration=20;WoodlandTime.refresh();});await checkTime('10:09');await page.clock.runFor(101);await checkTime('10:10');
   await page.clock.setSystemTime(new Date('2026-10-05T10:59:59.900-04:00'));await page.evaluate(()=>WoodlandTime.refresh());const terrain=await page.locator('#woodland-scene').getAttribute('data-terrain');await page.clock.runFor(101);await checkTime('11:00');assert.notEqual(await page.locator('#woodland-scene').getAttribute('data-terrain'),terrain);
   await page.clock.setSystemTime(new Date('2026-10-05T23:59:59.900-04:00'));await page.evaluate(()=>{prefs.format24=true;WoodlandTime.refresh();});await checkTime('23:59');await page.clock.runFor(101);await checkTime('00:00');
   // DST gap and repeated local hour reconstruct the current time without replay.
   for(const [stamp,time] of [['2026-03-08T03:00:00-04:00','03:00'],['2026-11-01T01:30:00-04:00','01:30'],['2026-11-01T01:00:00-05:00','01:00']]){await page.clock.setSystemTime(new Date(stamp));await page.evaluate(()=>WoodlandTime.refresh());await checkTime(time);}
   await page.clock.setSystemTime(new Date('2026-10-05T02:05:01-04:00'));await page.evaluate(()=>WoodlandTime.refresh());assert.equal(await page.locator('#woodland-cast .character-art[data-action=sleep]').count(),3);assert.equal(await page.locator('#woodland-rope').evaluate(e=>getComputedStyle(e).display),'none');
   await page.clock.setSystemTime(new Date('2026-10-05T18:03:01-04:00'));await page.evaluate(()=>WoodlandTime.refresh());assert.equal(await page.locator('#woodland-scene').getAttribute('data-action'),'teach');assert.match(await page.locator('#woodland-story').textContent(),/watch the light together/);
   await page.clock.setSystemTime(new Date('2026-10-05T10:05:00-04:00'));await page.evaluate(()=>{prefs.display.companionInterval=60;prefs.display.companionDuration=12;WoodlandTime.refresh();});assert.equal(await page.locator('#woodland-rope').evaluate(e=>getComputedStyle(e).display),'none');
   await page.evaluate(()=>{window._woodlandHidden=true;Object.defineProperty(document,'visibilityState',{configurable:true,get:()=>window._woodlandHidden?'hidden':'visible'});document.dispatchEvent(new Event('visibilitychange'));});assert.equal(await page.evaluate(()=>WoodlandTime.running||WoodlandTime.pending),false);
   await page.clock.setSystemTime(new Date('2026-10-05T10:05:00-04:00'));await page.evaluate(()=>{window._woodlandHidden=false;document.dispatchEvent(new Event('visibilitychange'));});await checkTime('10:05');
   await page.evaluate(()=>{document.body.classList.add('screen-rest');WoodlandTime.sync();});assert.equal(await page.evaluate(()=>WoodlandTime.running||WoodlandTime.pending),false);await page.evaluate(()=>{document.body.classList.remove('screen-rest');WoodlandTime.sync();});
   await page.getByRole('button',{name:'Settings'}).click();assert.equal(await page.evaluate(()=>WoodlandTime.running||WoodlandTime.pending),false);await page.locator('#close-settings').click();
   await page.emulateMedia({reducedMotion:'reduce'});await page.waitForFunction(()=>matchMedia('(prefers-reduced-motion: reduce)').matches);await page.evaluate(()=>WoodlandTime.sync());assert.equal(await page.evaluate(()=>WoodlandTime.running),false);
   await page.evaluate(()=>{prefs.display.companion=false;WoodlandTime.refresh();});assert.equal(await page.locator('#woodland-cast').evaluate(e=>getComputedStyle(e).display),'none');assert.equal(await page.evaluate(()=>WoodlandTime.running),false);
   await page.clock.runFor(60000);await checkTime('10:06');
   // A lead override does not duplicate family cast or contradict named episodes.
   await page.evaluate(()=>{ORBIT_CONFIG.characters.woodland='ridge';prefs.display.companion=true;WoodlandTime.refresh();});assert.equal(await page.locator('#woodland-cast [data-character=ridge]').count(),1);assert.equal(await page.locator('#woodland-cast > g').count(),3);
   await page.clock.setSystemTime(new Date('2026-10-07T10:06:12-04:00'));await page.evaluate(()=>WoodlandTime.refresh());assert.equal(await page.locator('#woodland-cast > g').count(),2);assert.match(await page.locator('#woodland-story').textContent(),/Two travelers/);await page.clock.setSystemTime(new Date('2026-10-05T10:06:12-04:00'));
   await page.evaluate(()=>{ORBIT_CONFIG.characters.woodland='sprout';WoodlandTime.refresh();});assert.equal(await page.locator('#woodland-cast .character-art').first().getAttribute('data-character'),'moss');
   await page.evaluate(()=>{prefs.theme='orbit';applyTheme();});assert.equal(await page.locator('#woodland-scene').isHidden(),true);assert.equal(await page.evaluate(()=>WoodlandTime.running||WoodlandTime.pending),false);
   assert.deepEqual(errors,[]);console.log('PASS Woodland:',target.startsWith('file:')?'portable offline':'hosted','all activities, exact minute/hour/midnight/DST, recovery/aid, cast, compact readability and pause/quiet lifecycle.');await context.close();
  }
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1)});
