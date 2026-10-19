// SPDX-License-Identifier: LicenseRef-Simpli-Noncommercial-1.0
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {pathToFileURL}=require('node:url');
const {engine,options,url}=require('./runtime.cjs');

const ids={ridge:'adult-human-v1',aster:'adult-human-v1',sage:'adult-human-v1',moss:'adult-drop-v1',candy:'adult-drop-v1',sprout:'learner-v1',pebble:'swaddled-v1'};
const studyFile=pathToFileURL(path.join(__dirname,'../design/character-study.html')).href;
const portableFile=pathToFileURL(path.join(__dirname,'../Little Orbit.html')).href;
const screenshotRoot=process.env.CLOCK_TEST_ARTIFACT_DIR||process.cwd();
const near=(actual,expected,label,tol=.001)=>assert.ok(Math.abs(actual-expected)<tol,`${label}: expected ${expected}, got ${actual}`);

async function inspect(page,label,full){
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(label==='hosted'?url+'/design/character-study.html':studyFile);
 assert.equal(await page.locator('#character option').count(),7,'existing cast selector retained');
 assert.ok(await page.locator('#role').count(),'existing role control retained');
 assert.ok(await page.locator('#progress').count(),'existing motion scrubber retained');
 assert.ok(await page.locator('#play').count(),'existing playback control retained');
 assert.ok(await page.evaluate(()=>!!(window.DeskAnatomy&&window.DeskCharacters.anatomyProfile)),'source facade and anatomy API load');
 const view=page.locator('#reference-view'),facing=page.locator('#reference-facing'),size=page.locator('#reference-size');
 const character=page.locator('#character'),pose=page.locator('#reference-pose'),overlay=page.locator('#reference-landmarks');
 for(const [id,profile] of Object.entries(ids)){
  await character.selectOption(id);
  assert.equal(await page.locator('#anatomy-reference').getAttribute('data-profile'),profile,`${id} enlarged profile`);
  assert.equal(await page.locator('#anatomy-native').getAttribute('data-profile'),profile,`${id} native profile`);
  if(id==='pebble')assert.equal(await page.locator('#person [data-infant-art]').count(),1,'Pebble legacy swaddle retained');
  else assert.equal(await page.locator('#person [data-character]').getAttribute('data-character'),id,`${id} legacy preview retained`);
  if(id==='pebble'){
   assert.equal(await pose.isDisabled(),true,'covered infant cannot select articulated pose');
   for(const svg of ['#anatomy-reference','#anatomy-native']){
    assert.equal(await page.locator(svg+' [data-landmark^="support-"]').count(),2,'infant has head and body supports');
    assert.equal(await page.locator(svg+' [data-limb]').count(),0,'covered infant has no visible articulated limbs');
    assert.equal(await page.locator(svg+' [data-landmark^="hand-"]').count(),0,'covered infant has no exposed hand');
   }
   assert.match(await page.locator('#anatomy-status').innerText(),/covered limbs.*head and body support/i);
   continue;
  }
  assert.equal(await pose.isDisabled(),false,`${id} poses enabled`);
  assert.equal(await page.locator('#anatomy-reference [data-limb]').count(),4,`${id} four limbs`);
  assert.equal(await page.locator('#anatomy-reference [data-landmark^="hand-"]').count(),10,`${id} hand landmarks`);
  assert.equal(await page.locator('#anatomy-reference [data-landmark^="foot-"]').count(),8,`${id} foot landmarks`);
 }
 await character.selectOption('ridge');await pose.selectOption('neutral');await view.selectOption('front');await facing.selectOption('1');
 const landmarks=await page.evaluate(()=>{
  const svg=document.querySelector('#anatomy-reference');
  const point=name=>{const node=svg.querySelector(`[data-landmark="${name}"]`);return {x:Number(node.getAttribute('cx')),y:Number(node.getAttribute('cy'))};};
  return {wrist:point('hand-0-wrist'),heel:point('foot-0-heel')};
 });
 near(landmarks.wrist.x,-11,'Ridge neutral left wrist x');near(landmarks.wrist.y,10,'Ridge neutral left wrist y');
 near(landmarks.heel.x,-10,'Ridge neutral left heel x');near(landmarks.heel.y,33.2,'Ridge neutral left heel y');
 await pose.selectOption('reach');
 assert.ok(await page.evaluate(()=>Number(document.querySelector('#anatomy-reference [data-landmark="hand-0-wrist"]').getAttribute('cy')) < -20),
  'workshop reach visibly places wrist above shoulder');
 await pose.selectOption('neutral');
 const firstCenter=await page.evaluate(()=>{
  const svg=document.querySelector('#anatomy-reference'),dot=svg.querySelector('[data-landmark="hand-0-wrist"]');
  const r=svg.getBoundingClientRect(),d=dot.getBoundingClientRect();return {center:r.left+r.width/2,x:d.left+d.width/2};
 });
 await facing.selectOption('-1');
 const reflected=await page.evaluate(()=>{const dot=document.querySelector('#anatomy-reference [data-landmark="hand-0-wrist"]'),d=dot.getBoundingClientRect();return d.left+d.width/2;});
 near(firstCenter.x+reflected,2*firstCenter.center,'facing mirrors screen x',1.5);
 await overlay.uncheck();assert.equal(await page.locator('#anatomy-reference [data-landmark]').count(),0,'overlay toggle hides dots');
 assert.equal(await page.locator('#anatomy-reference [data-limb]').count(),4,'overlay toggle retains skeleton');
 await overlay.check();assert.ok(await page.locator('#anatomy-reference [data-landmark]').count()>0,'overlay restores dots');

 const samples=full?[
  ['ridge','neutral','front','1','54'],['ridge','reach','turned','-1','80'],['sage','care','side','1','160'],
  ['moss','grip','front','-1','54'],['candy','walk','turned','1','80'],['sprout','crouch','side','-1','160'],
  ['aster','kneel','front','1','80'],['pebble','neutral','side','-1','54']
 ]:[['ridge','reach','turned','-1','80'],['sprout','crouch','side','1','54'],['pebble','neutral','front','1','160']];
 for(const [id,poseName,projection,direction,pixels] of samples){
  await character.selectOption(id);if(id!=='pebble')await pose.selectOption(poseName);
  await view.selectOption(projection);await facing.selectOption(direction);await size.selectOption(pixels);
  const geometry=await page.evaluate(()=>{
   const finiteRect=r=>[r.left,r.top,r.right,r.bottom,r.width,r.height].every(Number.isFinite);
   const output=[];
   for(const id of ['anatomy-reference','anatomy-native']){
    const svg=document.getElementById(id),rect=svg.getBoundingClientRect(),rig=svg.querySelector('[data-profile]'),box=rig.getBoundingClientRect();
    const vb=svg.viewBox.baseVal,ctm=rig.getCTM();
    output.push({id,finite:finiteRect(rect)&&finiteRect(box)&&[vb.x,vb.y,vb.width,vb.height,ctm.a,ctm.b,ctm.c,ctm.d,ctm.e,ctm.f].every(Number.isFinite),
     inside:box.left>=rect.left-2&&box.top>=rect.top-2&&box.right<=rect.right+2&&box.bottom<=rect.bottom+2,
     nativeHeight:svg.style.height});
   }
   return output;
  });
  for(const g of geometry){assert.ok(g.finite,`${label} ${id} ${poseName} ${g.id} finite SVG geometry`);assert.ok(g.inside,`${label} ${id} ${poseName} ${g.id} fits SVG crop`);}
  assert.equal(geometry[1].nativeHeight,pixels+'px',`${label} native preview height`);
 }
 if(full){
  fs.mkdirSync(screenshotRoot,{recursive:true});
  await character.selectOption('ridge');await pose.selectOption('reach');await view.selectOption('front');await facing.selectOption('1');await size.selectOption('80');
  await page.screenshot({path:path.join(screenshotRoot,`anatomy-${label}-reach.png`),fullPage:true});
  await character.selectOption('pebble');
  await page.screenshot({path:path.join(screenshotRoot,`anatomy-${label}-infant.png`),fullPage:true});
 }
 assert.deepEqual(errors,[],`${label} JavaScript errors`);
 console.log(`PASS anatomy workshop ${label}: cast, controls, reference coordinates, mirrors, overlays, SVG bounds and errors`);
}

(async()=>{
 const browser=await engine.launch({...options,headless:true});
 try{
  for(const label of ['hosted','file']){
   const page=await browser.newPage({viewport:{width:1280,height:900}});
   try{await inspect(page,label,!process.env.CLOCK_TEST_BROWSER||process.env.CLOCK_TEST_BROWSER==='chromium');}finally{await page.close();}
  }
  const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  try{
   await page.route('https://**',route=>route.abort());
   await page.route('https://api.open-meteo.com/**',route=>route.fulfill({json:{current:{temperature_2m:72,apparent_temperature:70,weather_code:2},daily:{temperature_2m_max:[78],temperature_2m_min:[58]}}}));
   await page.goto(portableFile);
   assert.ok(await page.evaluate(()=>!!(window.DeskAnatomy&&window.DeskCharacters?.anatomyProfile)),
    'portable clock exposes shared anatomy and character facade');
   assert.deepEqual(errors,[],'portable clock JavaScript errors');
  }finally{await page.close();}
  console.log('PASS anatomy portable: embedded module and facade available');
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exit(1);});
