// SPDX-License-Identifier: LicenseRef-Simpli-Noncommercial-1.0
// Copyright (C) 2026 ilamgumaran and contributors
const {engine,options,url,freezeClock}=require('./runtime.cjs');
const assert=require('node:assert/strict'),path=require('node:path'),{pathToFileURL}=require('node:url');
const stamp=(day,minute,second=28,hour=10)=>new Date(+new Date(`2026-10-${String(day).padStart(2,'0')}T${String(hour).padStart(2,'0')}:${String(minute).padStart(2,'0')}:00-04:00`)+second*1000);
(async()=>{
 const browser=await engine.launch({...options,headless:true});
 try{
  for(const target of [url,pathToFileURL(path.join(__dirname,'..','Little Orbit.html')).href]){
   const context=await browser.newContext({viewport:{width:1280,height:720},timezoneId:'America/New_York'}),page=await context.newPage(),errors=[];
   page.on('pageerror',e=>errors.push(e.message));await page.route('https://**',r=>r.abort());
   await freezeClock(page,'2026-10-05T10:08:28-04:00');
   await page.addInitScript(()=>localStorage.setItem('orbit-settings',JSON.stringify({theme:'woodland',format24:true,care:false,rest:false,night:false,lowPower:false,display:{woodlandView:'immersive'}})));
   await page.goto(target);assert.equal(await page.locator('#woodland-immersive').isVisible(),true);
   const at=async date=>{await page.clock.setSystemTime(date);await page.evaluate(()=>WoodlandScene.refresh());};
   const current=async()=>page.evaluate(()=>{
    const m=DeskWoodlandStory.sample(new Date(),{format24:prefs.format24}),scene=document.querySelector('#woodland-immersive');
    const glyphs=[...document.querySelectorAll('#woodland-immersive-numerals > [data-index]')].map(g=>({digit:g.dataset.digit,material:g.querySelector('[data-material]').dataset.material,path:g.querySelector('.woodland-trail').getAttribute('d')}));
    const days=[...document.querySelectorAll('#woodland-immersive-day [data-day-digit]')].map(g=>({digit:g.dataset.dayDigit,path:g.querySelector('.woodland-trail').getAttribute('d')}));
    return {time:scene.dataset.time,date:scene.dataset.date,expectedTime:m.time,expectedDay:m.dateDigits,digits:m.digits,materials:[m.hourMaterial,m.hourMaterial,m.minuteMaterial.tens,m.minuteMaterial.ones],glyphs,days,paths:DeskWorlds.numerals};
   });
   const checkReading=async()=>{
    const r=await current();assert.equal(r.time,r.expectedTime);assert.equal(r.date,r.expectedDay);
    assert.equal(r.glyphs.length,4);assert.equal(r.glyphs.map(g=>g.digit).join(''),r.digits);
    r.glyphs.forEach((g,i)=>{assert.equal(g.path,r.paths[g.digit]);assert.equal(g.material,r.materials[i]);});
    assert.equal(r.days.length,2);assert.equal(r.days.map(g=>g.digit).join(''),r.expectedDay);r.days.forEach(g=>assert.equal(g.path,r.paths[g.digit]));
    assert.equal(await page.locator('#time').innerText(),r.expectedTime);
   };
   // Full artwork fits the actual viewport, while body proportions compensate
   // for the SVG's different horizontal/vertical screen scales.
   for(const viewport of [{width:854,height:480},{width:1280,height:720},{width:1920,height:1080},{width:390,height:844}]){
    await page.setViewportSize(viewport);await at(stamp(5,8));await checkReading();
    const layout=await page.evaluate(()=>{
     const board=document.querySelector('#woodland-immersive-day').getBoundingClientRect(),controls=document.querySelector('#display nav').getBoundingClientRect(),world=document.querySelector('#woodland-immersive-world').getBoundingClientRect();
     const adults=[...document.querySelectorAll('#woodland-immersive-cast .character-art')].filter(e=>!DeskCharacters.identities[e.dataset.character].young).map(e=>{const m=e.getScreenCTM(),r=e.getBoundingClientRect();return {height:r.height,ratio:Math.hypot(m.a,m.b)/Math.hypot(m.c,m.d)};});
     return {width:Math.max(document.body.scrollWidth,document.documentElement.scrollWidth),height:Math.max(document.body.scrollHeight,document.documentElement.scrollHeight),world:{x:world.x,y:world.y,width:world.width,height:world.height},board:{top:board.top,bottom:board.bottom,left:board.left,right:board.right},controlsTop:controls.top,adults};
    });
    assert.ok(layout.width<=viewport.width+1&&layout.height<=viewport.height+1,JSON.stringify({viewport,layout}));
    assert.ok(Math.abs(layout.world.width-viewport.width)<1&&Math.abs(layout.world.height-viewport.height)<1,JSON.stringify({viewport,layout}));
    assert.ok(layout.adults.length&&layout.adults.every(a=>a.height>=75&&Math.abs(a.ratio-1)<.015),JSON.stringify({viewport,layout}));
    assert.ok(layout.board.top>=0&&layout.board.bottom<layout.controlsTop-2&&layout.board.left>=0&&layout.board.right<=viewport.width,JSON.stringify({viewport,layout}));
    // Real rendered support geometry remains attached in portrait, not merely
    // a shared rig boolean. Verify after arrival and across subsequent bouts.
    for(const second of [28,35,48]){
     await at(stamp(5,5,second));
     const contacts=await page.evaluate(()=>{
      const host=document.querySelector('#woodland-immersive-cast > g'),holds=JSON.parse(host.dataset.contactHolds||'{}'),names={leftHand:'arm-left',rightHand:'arm-right',leftFoot:'leg-left',rightFoot:'leg-right'};
      const point=(node,t)=>{const p=node.getPointAtLength(node.getTotalLength()*t);return new DOMPoint(p.x,p.y).matrixTransform(node.getScreenCTM());};
      const errors=Object.entries(holds).filter(([,id])=>id).map(([name,id])=>{const a=point(host.querySelector(`[data-part="${names[name]}"]`),1),b=point(document.querySelector(`[data-hold="${id}"]`),.5);return Math.hypot(a.x-b.x,a.y-b.y);});
      const loop=DeskCharacters.anatomy.belayLoop,a=new DOMPoint(loop.x,loop.y).matrixTransform(host.querySelector('.character-art').getScreenCTM()),rope=document.querySelector('#woodland-immersive-rope');
      const end=rope.getAttribute('d')?point(rope,1):null;
      return {errors,ropeError:end?Math.hypot(a.x-end.x,a.y-end.y):Infinity,pose:host.dataset.action};
     });
     assert.ok(contacts.errors.length>=3&&contacts.errors.every(e=>e<.15)&&contacts.ropeError<.15,JSON.stringify({viewport,second,contacts}));
     assert.equal(await page.locator('#woodland-immersive-cast > g').first().locator('.character-harness').isVisible(),true,'Protected contact rig lacks visible harness');
    }
   }
   await page.setViewportSize({width:1280,height:720});
   // Daily story casts remain central identities, with an actually present
   // adult supervisor rather than an ID left over from a substituted cast.
   const seen=new Set(),activities=new Set();
   for(let day=4;day<10;day++)for(let minute=0;minute<12;minute++){
    await at(stamp(day,minute));await checkReading();
    const cast=await page.evaluate(()=>{
     const m=DeskWoodlandStory.sample(new Date()),actors=[...document.querySelectorAll('#woodland-immersive-cast > g')].map(h=>({id:h.querySelector('.character-art').dataset.character,young:!!DeskCharacters.identities[h.querySelector('.character-art').dataset.character].young,supervisor:h.dataset.supervisor,action:h.dataset.action}));
     return {story:m.social.id,activity:m.work.id,expected:m.social.cast,actors,registered:Object.keys(DeskCharacters.identities),camp:!!document.querySelector('#woodland-immersive-camp').children.length};
    });
    seen.add(cast.story);activities.add(cast.activity);assert.equal(cast.actors.length,cast.expected.length,JSON.stringify(cast));
    assert.ok(cast.actors.every(a=>cast.registered.includes(a.id)));assert.ok(cast.camp);
    for(const kid of cast.actors.filter(a=>a.young))assert.ok(cast.actors.some(a=>a.id===kid.supervisor&&!a.young),JSON.stringify(cast));
   }
   assert.equal(seen.size,6);assert.equal(activities.size,12);
   // The family child's shallow play area has its own visible inlet. The same
   // people sleep together in camp instead of retaining their daytime bank pose.
   await at(stamp(5,0,8));
   assert.ok(await page.locator('#woodland-immersive-ripples').evaluate(e=>e.children.length>0),'Shallow play inlet missing');
   assert.ok(await page.locator('#woodland-immersive-inlet').evaluate(e=>e.children.length>0),'Shallow play water is disconnected from the river');
   await at(stamp(5,0,8,2));
   const night=await page.evaluate(()=>{
    const camera=document.querySelector('#woodland-immersive-camera').getScreenCTM().inverse();
    return {water:document.querySelector('#woodland-immersive-ripples').children.length,actors:[...document.querySelectorAll('#woodland-immersive-cast > g')].map(h=>{const p=new DOMPoint(0,0).matrixTransform(camera.multiply(h.getScreenCTM()));return {id:h.querySelector('.character-art').dataset.character,x:p.x,action:h.dataset.action};})};
   });
   assert.equal(night.water,0);assert.ok(night.actors.every(a=>a.action==='sleep'&&a.x<530),JSON.stringify(night));
   // All four digits and the date switch together on multi-digit/calendar
   // rollovers, without an unfinished old time remaining in the art.
   for(const date of [new Date('2026-10-31T23:59:59.999-04:00'),new Date('2026-11-01T00:00:00-04:00'),new Date('2028-02-29T23:59:59.999-05:00'),new Date('2028-03-01T00:00:00-05:00')]){await at(date);await checkReading();}
   await page.evaluate(()=>{prefs.format24=false;WoodlandScene.refresh();});await checkReading();await page.evaluate(()=>{prefs.format24=true;WoodlandScene.refresh();});
   // Persistent construction cannot disappear with the next activity or shrink
   // as another 20-second work bout starts.
   const heights=[];
   for(const second of [19.9,20.1,39.9,40.1,59.8]){
    await at(stamp(5,2,second));
    heights.push(await page.locator('[data-workpiece="tent"]').evaluate(e=>e.getBBox().height));
   }
   for(let i=1;i<heights.length;i++)assert.ok(heights[i]+.15>=heights[i-1],JSON.stringify({heights}));
   for(const minute of [3,8,9,10]){
    await at(stamp(5,minute));assert.ok(await page.locator('[data-workpiece="tent"]').count(),'Camp shelter disappears');assert.ok(await page.locator('[data-workpiece="crossing"]').count(),'Crossing disappears');
   }
   // The work actor's face must be visible, not painted behind a solid digit.
   for(const minute of [0,6]){
    await at(stamp(5,minute));
    const visible=await page.evaluate(()=>{
     const host=document.querySelector('#woodland-immersive-cast > g'),face=host.querySelector('[data-layer="face"] circle'),center=new DOMPoint(+face.getAttribute('cx')||0,+face.getAttribute('cy')||0).matrixTransform(face.getScreenCTM()),hit=document.elementFromPoint(center.x,center.y);
     return {visible:!!hit&&host.contains(hit),hit:hit?.outerHTML?.slice(0,200)};
    });assert.ok(visible.visible,JSON.stringify({minute,visible}));
   }
   // Tool grips and real contact heads share screen-space geometry. The scene
   // owns the workpiece location; this does not repeat its private pose solver.
   for(const minute of [2,9])for(const second of [25,28,30]){
    await at(stamp(5,minute,second));
    const mallet=await page.evaluate(()=>{
     const host=document.querySelector('#woodland-immersive-cast > g'),tool=host.querySelector('[data-tool="mallet"]'),pieces=tool?[...tool.querySelectorAll('path')]:[];
     const at=(node,t)=>{const p=node.getPointAtLength(node.getTotalLength()*t);return new DOMPoint(p.x,p.y).matrixTransform(node.getScreenCTM());};
     if(pieces.length<2)return {missing:true,action:host.dataset.action};
     const grip=at(pieces[0],0),tip=at(pieces[0],1),head=at(pieces[1],.5),wrist=at(host.querySelector('[data-part="arm-right"]'),1);
     return {grip:Math.hypot(grip.x-wrist.x,grip.y-wrist.y),head:Math.hypot(head.x-tip.x,head.y-tip.y),peg:!!document.querySelector('[data-workpiece="peg"]')};
    });assert.ok(!mallet.missing&&mallet.grip<.15&&mallet.head<.15&&mallet.peg,JSON.stringify({minute,second,mallet}));
   }
   for(const second of [25,28,30]){
    await at(stamp(5,8,second));
    const cooking=await page.evaluate(()=>{
     const host=document.querySelector('#woodland-immersive-cast > g'),spoon=host.querySelector('[data-tool="spoon"]'),opening=document.querySelector('[data-workpiece="potopening"]');
     if(!spoon||!opening)return {missing:true,action:host.dataset.action};
     const at=(node,t)=>{const p=node.getPointAtLength(node.getTotalLength()*t);return new DOMPoint(p.x,p.y).matrixTransform(node.getScreenCTM());};
     const tip=at(spoon,1),handle=at(spoon,0),hand=at(host.querySelector('[data-part="arm-right"]'),1),box=opening.getBBox(),center=new DOMPoint(box.x+box.width/2,box.y+box.height/2).matrixTransform(opening.getScreenCTM());
     return {grip:Math.hypot(handle.x-hand.x,handle.y-hand.y),pot:Math.hypot(tip.x-center.x,tip.y-center.y),openingWidth:opening.getBoundingClientRect().width};
    });assert.ok(!cooking.missing&&cooking.grip<.15&&cooking.pot<=Math.max(8,cooking.openingWidth*.55),JSON.stringify({second,cooking}));
   }
   // Lead replacement must update the actual supervising person as well.
   await page.evaluate(()=>{ORBIT_CONFIG.characters.woodland='ridge';WoodlandScene.refresh();});await at(stamp(5,8));
   const substituted=await page.evaluate(()=>{
    const hosts=[...document.querySelectorAll('#woodland-immersive-cast > g')],kid=hosts.find(h=>DeskCharacters.identities[h.querySelector('.character-art').dataset.character].young),supervisor=hosts.find(h=>h.querySelector('.character-art').dataset.character===kid.dataset.supervisor);
    return {supervisor:kid.dataset.supervisor,actual:supervisor?.dataset.castIndex};
   });assert.equal(substituted.actual,'1',JSON.stringify(substituted));await page.evaluate(()=>{delete ORBIT_CONFIG.characters.woodland;WoodlandScene.refresh();});
   await page.emulateMedia({reducedMotion:'reduce'});await at(stamp(5,8));
   assert.equal(await page.evaluate(()=>WoodlandScene.running),false);await checkReading();
   const staticState=()=>page.evaluate(()=>({camera:document.querySelector('#woodland-immersive-world').style.transform,poses:[...document.querySelectorAll('#woodland-immersive-cast .character-art')].map(e=>[...e.querySelectorAll('[data-part^="arm-"],[data-part^="leg-"]')].map(p=>p.getAttribute('d')))}));
   const quietState=await staticState();await page.clock.runFor(1000);assert.deepEqual(await staticState(),quietState);
   await page.emulateMedia({reducedMotion:'no-preference'});await at(stamp(5,8));
   await page.click('#settings-button');assert.equal(await page.evaluate(()=>WoodlandScene.running),false);
   await page.selectOption('#woodland-view','dashboard');await page.click('#settings-form button[type="submit"]');
   assert.equal(await page.locator('#woodland-immersive').isVisible(),false);assert.equal(await page.locator('#woodland-scene').isVisible(),true);
   await page.click('#settings-button');await page.selectOption('#woodland-view','immersive');await page.click('#settings-form button[type="submit"]');
   assert.equal(await page.locator('#woodland-immersive').isVisible(),true);await checkReading();
   assert.deepEqual(errors,[],target);await context.close();
   const dense=await browser.newContext({viewport:{width:854,height:480},deviceScaleFactor:2,timezoneId:'America/New_York'}),hd=await dense.newPage(),hdErrors=[];
   hd.on('pageerror',e=>hdErrors.push(e.message));await hd.route('https://**',r=>r.abort());await freezeClock(hd,'2026-10-05T10:08:28-04:00');
   await hd.addInitScript(()=>localStorage.setItem('orbit-settings',JSON.stringify({theme:'woodland',care:false,rest:false,night:false,display:{woodlandView:'immersive'}})));await hd.goto(target);
   for(const viewport of [{width:854,height:480},{width:1280,height:720},{width:1920,height:1080},{width:390,height:844}]){
    await hd.setViewportSize(viewport);await hd.evaluate(()=>WoodlandScene.sync());
    const hdLayout=await hd.evaluate(()=>{
     const world=document.querySelector('#woodland-immersive-world').getBoundingClientRect(),glyphs=[...document.querySelectorAll('#woodland-immersive-numerals > g')].map(e=>e.getBoundingClientRect()),footer=document.querySelector('#display footer').getBoundingClientRect();
     return {dpr:devicePixelRatio,scroll:[document.body.scrollWidth,document.body.scrollHeight],world:[world.width,world.height],glyphs:glyphs.map(r=>[r.left,r.top,r.right,r.bottom]),footer:[footer.top,footer.bottom]};
    });
    assert.equal(hdLayout.dpr,2);assert.deepEqual(hdLayout.world,[viewport.width,viewport.height]);
    assert.ok(hdLayout.scroll[0]<=viewport.width&&hdLayout.scroll[1]<=viewport.height,JSON.stringify(hdLayout));
    assert.ok(hdLayout.glyphs.length===4&&hdLayout.glyphs.every(([l,t,r,b])=>l>=0&&t>=0&&r<=viewport.width&&b<hdLayout.footer[0]),JSON.stringify(hdLayout));
   }
   assert.deepEqual(hdErrors,[]);await dense.close();
  }
  console.log('PASS immersive Woodland: hosted/portable full viewport, canonical time/date/materials, daily casts, supervised camp/play, persistent construction, tool contacts, portrait climbing and quiet/settings controls.');
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
