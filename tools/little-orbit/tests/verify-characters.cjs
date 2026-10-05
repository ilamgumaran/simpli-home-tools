const {engine,options,url}=require('./runtime.cjs');
const assert=require('node:assert/strict'),path=require('node:path'),{pathToFileURL}=require('node:url');
(async()=>{const browser=await engine.launch({...options,headless:true});try{
 for(const target of [url,pathToFileURL(path.join(__dirname,'../Little Orbit.html')).href]){
  const page=await browser.newPage({viewport:{width:1280,height:720}}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));await page.route('https://**',r=>r.abort());
  await page.clock.install({time:new Date('2026-10-04T12:00:00-04:00')});await page.clock.pauseAt(new Date('2026-10-04T12:00:00-04:00'));await page.goto(target);
  assert.equal(await page.locator('#candy-pal').getAttribute('data-character'),'candy');
  for(const theme of ['climber','climber2']){
   const root=theme==='climber'?'#climber-rig':'#mountain-explorer';
   await page.evaluate(theme=>{prefs.theme=theme;applyTheme();},theme);
   assert.equal(await page.locator(root+' [data-layer]').count(),7);
   assert.equal(await page.locator(root+' .character-harness').count(),1);
   const character=await page.locator(root+' .character-art').getAttribute('data-character');assert.equal(character,theme==='climber'?'moss':'ridge');
  }
  // Sample recovery, resumed ascent, and aid in the live theme controller.
  const samples=await page.evaluate(()=>{
   DeskClimber.stop();TimeMountain.stop();prefs.theme='climber';applyTheme();DeskClimber.start();
   const end=DeskClimber.visits%3===0?.48:.65;
   return [.35,.49,.6,.95].map(t=>{DeskClimber.paint(.12+t*(end-.12));const art=document.querySelector('#climber-rig .character-art');return {action:art.dataset.action,fatigue:Number(art.dataset.fatigue),aid:art.querySelector('[data-part=ascender]').getAttribute('display')};});
  });
  assert.equal(samples[0].action,'rest');assert.equal(samples[1].action,'rest');assert.ok(samples[1].fatigue<samples[0].fatigue);assert.equal(samples[1].aid,'none');assert.equal(samples[2].action,'climb');assert.equal(samples[3].action,'assist');assert.equal(samples[3].aid,'');
  // Rope endpoint coincides with the shared belay loop in actual SVG coordinates.
  const delta=await page.evaluate(()=>{
   const character=DeskCharacters.forTheme('climber'),loop=DeskCharacters.attachment(character),world=document.querySelector('#climber-world'),person=document.querySelector('#climber-person');
   const point=world.createSVGPoint();point.x=loop.x;point.y=loop.y;const at=point.matrixTransform(person.getCTM()),rope=document.querySelector('#climber-rope'),end=rope.getPointAtLength(rope.getTotalLength());return Math.hypot(at.x-end.x,at.y-end.y);
  });assert.ok(delta<.15,'Protection rope is detached from the harness');
  // Any centrally defined identity may take a theme role; appearance remains independent.
  assert.equal(await page.evaluate(()=>{const c=DeskCharacters.create('candy',{role:'climbing',appearance:{helmet:'#df9156'}});DeskCharacters.mount(document.querySelector('#climber-rig'),c);return document.querySelector('#climber-rig .character-art').dataset.character;}),'candy');
  assert.deepEqual(errors,[]);await page.close();console.log('PASS characters:',target.startsWith('file:')?'portable':'hosted','central identity, appearance layers, attached harness rope, fatigue recovery and deadline aid.');
 }
 const study=await browser.newPage();await study.goto(pathToFileURL(path.join(__dirname,'../design/character-study.html')).href);assert.equal(await study.locator('#person [data-character]').getAttribute('data-character'),'ridge');await study.locator('#role').selectOption('farming');assert.match(await study.locator('#inventory').innerText(),/Seed packets/);await study.locator('#character').selectOption('moss');assert.equal(await study.locator('#person [data-character]').getAttribute('data-character'),'moss');await study.locator('#color-skin').fill('#82532d');assert.equal(await study.locator('#person [data-layer=face] circle').getAttribute('fill'),'#82532d');await study.emulateMedia({reducedMotion:'reduce'});await study.locator('#play').click();assert.match(await study.locator('#status').innerText(),/Reduced motion/);await study.close();console.log('PASS character study: appearance/role selection, equipment inventory, reduced-motion behavior.');
}finally{await browser.close();}})().catch(error=>{console.error(error);process.exit(1);});
