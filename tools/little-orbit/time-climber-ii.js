// SPDX-License-Identifier: LicenseRef-Simpli-Noncommercial-1.0
// Copyright (C) 2026 ilamgumaran and contributors
// Original numeral terrain and explorer. Calendar time never depends on animation.
(()=>{
 const ns='http://www.w3.org/2000/svg',get=id=>document.getElementById(id);
 const expedition=document.createElement('section');expedition.id='time-mountain';expedition.hidden=true;
 expedition.setAttribute('aria-label','Mountain of Time');
 expedition.innerHTML=`<div class="mountain-horizon"><span id="mountain-year"></span><span id="mountain-month"></span></div><div class="mountain-levels"><span id="mountain-day"></span><span id="mountain-hour"></span><span id="mountain-minute"></span></div>
 <svg id="mountain-world" xmlns="${ns}" aria-hidden="true"><path id="mountain-far"/><path id="mountain-near"/><g id="mountain-camera"><g id="mountain-neighbor"/><g id="mountain-digit"><path id="mountain-depth"/><path id="mountain-rock"/><path id="mountain-trail"/></g></g>
 <path id="mountain-rope"/><circle id="mountain-anchor" r="2.5"/>
 <g id="mountain-pickup"><path class="mountain-bottle" d="M-3 -6H3V3H-3ZM-2 -9H2V-6"/><path class="mountain-apple" d="M0 -4C-8 -10 -9 3 -2 3L0 2L2 3C9 3 8 -10 0 -4ZM0 -4L2 -8"/><path class="mountain-gear" d="M-5 -6H5V3H-5ZM-2 -6V-9H2V-6"/></g>
 <g id="mountain-tent"><path class="mountain-tent-lines" d="M0 -28L-17 0M0 -28L17 0"/><path class="mountain-tent-shell" d="M-17 0L-9 -13H5L17 0Z"/><path class="mountain-tent-door" d="M-5 0L0 -12L5 0Z"/><path class="mountain-tent-floor" d="M-20 2H20"/></g>
 <g id="mountain-explorer"><path id="mountain-arms"/><path id="mountain-legs"/><rect class="mountain-backpack" x="-7" y="-7" width="6" height="9" rx="2"/><path class="mountain-jacket" d="M-3 -7H3L4 1H-4Z"/><circle class="mountain-face" cy="-11" r="3.7"/><path class="mountain-helmet" d="M-5 -12Q0 -19 5 -12Z"/><path class="mountain-coil" d="M-7 -3Q-11 -6 -10 0Q-8 4 -6 0"/></g></svg>
 <div class="mountain-caption"><span id="mountain-focus"></span><span id="mountain-action"></span></div>`;
 get('display').insertBefore(expedition,get('display').querySelector('.fact-panel'));
 const svg=get('mountain-world'),actor=get('mountain-explorer');
 const motion=typeof matchMedia==='function'?matchMedia('(prefers-reduced-motion: reduce)'):null;
 const clamp=(n,a=0,b=1)=>Math.max(a,Math.min(b,n)),mix=(a,b,t)=>a+(b-a)*t,ease=t=>t*t*(3-2*t);
 const definitions={
  0:[[18,0],[62,0],[80,20],[80,130],[62,150],[18,150],[0,130],[0,20],[18,0]],
  1:[[12,25],[40,0],[40,150],[12,150],[68,150]],
  2:[[0,22],[18,0],[62,0],[80,22],[80,48],[0,130],[0,150],[80,150]],
  3:[[0,0],[80,0],[43,70],[80,92],[80,130],[60,150],[0,150]],
  4:[[55,0],[0,95],[80,95],[60,95],[60,0],[60,150]],
  5:[[80,0],[0,0],[0,70],[62,70],[80,90],[80,130],[60,150],[0,150]],
  6:[[75,0],[25,0],[0,35],[0,130],[20,150],[60,150],[80,130],[80,88],[60,70],[0,70]],
  7:[[0,0],[80,0],[20,150]],
  8:[[40,70],[0,45],[0,15],[20,0],[60,0],[80,15],[80,45],[40,70],[0,100],[0,135],[20,150],[60,150],[80,135],[80,100],[40,70]],
  9:[[80,80],[20,80],[0,60],[0,20],[20,0],[60,0],[80,20],[80,120],[55,150],[5,150]]
 };
 function route(digit){
  const points=definitions[digit]||definitions[0],lengths=[0];
  for(let i=1;i<points.length;i++)lengths.push(lengths[i-1]+Math.hypot(points[i][0]-points[i-1][0],points[i][1]-points[i-1][1]));
  return Array.from({length:65},(_,i)=>{const distance=(1-i/64)*lengths.at(-1);let k=1;while(k<lengths.length-1&&lengths[k]<distance)k++;const t=(distance-lengths[k-1])/(lengths[k]-lengths[k-1]||1);return {x:mix(points[k-1][0],points[k][0],t),y:mix(points[k-1][1],points[k][1],t)};});
 }
 const routes=Object.fromEntries(Object.keys(definitions).map(d=>[d,route(d)]));
 function calendar(date=new Date()){
  const y=date.getFullYear(),m=date.getMonth(),d=date.getDate(),h=date.getHours(),minute=date.getMinutes();
  const startDay=new Date(y,m,d).getTime(),endDay=new Date(y,m,d+1).getTime(),startMonth=new Date(y,m,1).getTime(),endMonth=new Date(y,m+1,1).getTime(),startYear=new Date(y,0,1).getTime(),endYear=new Date(y+1,0,1).getTime(),at=date.getTime();
  const displayed=prefs.format24?h:h%12||12;
  return {minute:{value:String(minute).padStart(2,'0'),progress:(date.getSeconds()+date.getMilliseconds()/1000)/60},hour:{value:String(displayed).padStart(2,'0'),progress:(minute+date.getSeconds()/60)/60},day:{value:String(d).padStart(2,'0'),progress:clamp((at-startDay)/(endDay-startDay))},month:{value:String(m+1).padStart(2,'0'),progress:clamp((at-startMonth)/(endMonth-startMonth)),name:date.toLocaleDateString('en-US',{month:'long'})},year:{value:String(y),progress:clamp((at-startYear)/(endYear-startYear))}};
 }
 const itinerary=['minute','hour','minute','day','minute','hour','minute','month','minute','hour','minute','year'];
 let timer=null,frame=null,scene=null,lastFrame=0,visits=0,level='minute',focus=0,lastSignature='',lastActor=null,morph=null,currentRoute=null,currentKey='',sizing=false;
 function active(){return prefs.theme==='climber2';}
 function allowed(){return active()&&prefs.display.companion!==false&&document.visibilityState==='visible'&&!get('settings').open&&!document.body.classList.contains('screen-rest');}
 function still(){return motion?.matches||prefs.display.cameraMotion==='still'||typeof requestAnimationFrame!=='function';}
 function stop(){clearTimeout(timer);timer=null;if(frame!==null)cancelAnimationFrame(frame);frame=null;scene=null;actor.style.display='none';get('mountain-rope').style.display='none';get('mountain-tent').style.display='none';}
 function fit(){
  if(!active()||sizing)return;sizing=true;
  // Deduct natural content height so enlarged facts/presets get space before scenery.
  expedition.style.height='0px';
  const display=get('display'),r=display.getBoundingClientRect(),padding=parseFloat(getComputedStyle(display).paddingBottom)||0;
  const budget=Math.max(82,innerHeight-(r.height+Math.max(12,r.top)+padding)-14);
  expedition.style.height=Math.min(innerWidth<600?230:420,budget)+'px';expedition.classList.toggle('mountain-compact',budget<130);sizing=false;
 }
 function path(points){return points.map((p,i)=>`${i?'L':'M'}${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join(' ');}
 function position(points,t){const index=clamp(t)*64,k=Math.min(63,Math.floor(index)),p=index-k;return {x:mix(points[k].x,points[k+1].x,p),y:mix(points[k].y,points[k+1].y,p)};}
 function attr(id,name,value){get(id).setAttribute(name,value);}
 function place(id,p,extra=''){attr(id,'transform',`translate(${p.x.toFixed(2)} ${p.y.toFixed(2)}) ${extra}`);}
 function draw(progress=.92,force=false){
  if(!active())return;
  const model=calendar(),rect=expedition.getBoundingClientRect(),w=rect.width,h=rect.height;
  if(w<1||h<1)return;
  svg.setAttribute('viewBox',`0 0 ${w} ${h}`);
  const run=scene!==null&&!still(),data=model[level],count=data.value.length;
  const segment=Math.min(count-1,Math.floor(progress*count)),local=clamp(progress*count-segment);
  if(scene)focus=segment;else focus=Math.min(focus,count-1);
  const digit=data.value[focus],key=level+focus+digit;
  if(key!==currentKey){morph={from:currentRoute||routes[digit],began:performance.now(),actor:lastActor};currentKey=key;}
  const blend=!scene||still()?1:clamp((performance.now()-(morph?.began||0))/900);
  currentRoute=routes[digit].map((p,i)=>({x:mix((morph?.from||routes[digit])[i].x,p.x,ease(blend)),y:mix((morph?.from||routes[digit])[i].y,p.y,ease(blend))}));
  const camera=still()?'cliff':local<.3?'trail':local<.7?'cliff':'traverse';
  const phase=!scene?'camp':local<.12?'cast':local<.3?'walk':local<.64?'climb':local<.74?'collect':local<.83?'build':local<.96?'camp':'traverse';
  expedition.dataset.view=camera;expedition.dataset.state=phase;expedition.dataset.level=level;expedition.dataset.digit=digit;
  const unitProgress=level==='minute'?clamp((local-.12)/.52):clamp(data.progress+(local-.12)*({hour:.1,day:.035,month:.018,year:.008}[level]));
  const scale=Math.max(.3,Math.min(h*.64/150,w*.22/80)),zoom=run?1+.12*Math.sin(local*Math.PI):1;
  const turn=ease(clamp((local-.24)/.2)),around=ease(clamp((local-.67)/.2));
  const skew=still()?0:mix(-.24,0,turn)+.12*around,vertical=still()?1:mix(.76,1,turn);
  const lead=position(currentRoute,unitProgress),panX=run?clamp((40-lead.x)*scale,-w*.025,w*.025):0,panY=run?clamp((75-lead.y)*scale,-h*.08,h*.08):0;
  const tx=w*.43-40*scale*zoom+panX,ty=h*.52-75*scale*zoom*vertical+panY;
  // One focal numeral grows while the other digits recede; fixed readouts stay untouched.
  attr('mountain-digit','transform',`translate(${tx.toFixed(2)} ${ty.toFixed(2)}) matrix(${(scale*zoom).toFixed(4)} 0 ${(skew*scale*zoom).toFixed(4)} ${(scale*zoom*vertical).toFixed(4)} 0 0)`);
  const d=path(currentRoute);attr('mountain-rock','d',d);attr('mountain-trail','d',d);attr('mountain-depth','d',d);attr('mountain-depth','transform',`translate(${camera==='traverse'?-9:9} 7)`);
  const neighbor=data.value[(focus+1)%count],neighborSize=scale*.5;
  get('mountain-neighbor').innerHTML=`<g transform="translate(${(w*.71).toFixed(2)} ${(h*.61).toFixed(2)}) scale(${neighborSize.toFixed(4)})"><path class="mountain-neighbor-rock" d="${path(routes[neighbor])}"/><path class="mountain-neighbor-trail" d="${path(routes[neighbor])}"/></g>`;
  attr('mountain-far','d',`M0 ${h*.63}L${w*.09} ${h*.42} ${w*.17} ${h*.53} ${w*.28} ${h*.19} ${w*.38} ${h*.45} ${w*.54} ${h*.15} ${w*.65} ${h*.38} ${w*.8} ${h*.12} ${w} ${h*.5}V${h}H0Z`);
  attr('mountain-near','d',`M0 ${h*.89}L${w*.14} ${h*.7} ${w*.24} ${h*.81} ${w*.39} ${h*.46} ${w*.52} ${h*.75} ${w*.63} ${h*.56} ${w*.82} ${h*.8} ${w} ${h*.59}V${h}H0Z`);
  const project=p=>({x:tx+(p.x+skew*p.y)*scale*zoom,y:ty+p.y*scale*zoom*vertical});
  let p=project(position(currentRoute,unitProgress));
  if(morph?.actor&&blend<1&&run)p={x:mix(morph.actor.x,p.x,ease(blend)),y:mix(morph.actor.y,p.y,ease(blend))};
  p.x=clamp(p.x,20,w-22);p.y=clamp(p.y,27,h-34);lastActor=p;
  const explorerScale=innerWidth<600?1:1.05;place('mountain-explorer',p,`scale(${explorerScale})`);
  const limb=phase==='walk'||phase==='climb'?Math.sin(local*36)*3:0;
  attr('mountain-arms','d',`M-2 -5L${-7-limb} -10M2 -5L${7+limb} -12`);attr('mountain-legs','d',`M-2 1L${-5+limb} 8L${-8+limb} 8M2 1L${5-limb} 7L${8-limb} 7`);
  actor.style.display=allowed()?'':'none';
  const anchor=project(position(currentRoute,clamp(unitProgress+.16))),camp={x:clamp(p.x+25,25,w-25),y:clamp(p.y+18,45,h-12)};
  const tent=['build','camp'].includes(phase)&&allowed();get('mountain-tent').style.display=tent?'':'none';place('mountain-tent',camp);
  const rope=allowed()&&(camera!=='trail'||tent||phase==='cast');get('mountain-rope').style.display=rope?'':'none';get('mountain-anchor').style.display=rope?'':'none';place('mountain-anchor',anchor);
  const end=tent?{x:camp.x,y:camp.y-28}:p;
  const swing=phase==='cast'?Math.sin(local/.12*Math.PI)*12:0;
  attr('mountain-rope','d',`M${anchor.x.toFixed(2)} ${anchor.y.toFixed(2)}Q${(mix(anchor.x,end.x,.5)+swing).toFixed(2)} ${(mix(anchor.y,end.y,.5)+7).toFixed(2)} ${end.x.toFixed(2)} ${end.y.toFixed(2)}`);
  get('mountain-tent').style.opacity=phase==='build'?String(clamp((local-.74)/.09)): '1';
  const supply=project(position(currentRoute,clamp(unitProgress+.06)));place('mountain-pickup',supply);get('mountain-pickup').dataset.item=['water','food','gear'][visits%3];get('mountain-pickup').style.display=phase==='collect'||phase==='build'?'':'none';
  get('mountain-year').textContent=`YEAR · ${model.year.value}`;get('mountain-month').textContent=`${model.month.name.toUpperCase()} · ${model.month.value}`;
  get('mountain-day').textContent=`DAY ${model.day.value}`;get('mountain-hour').textContent=`HOURS ${model.hour.value}`;get('mountain-minute').textContent=`MINUTES ${model.minute.value}`;
  get('mountain-focus').textContent=`${level.toUpperCase()} ${data.value} · DIGIT ${focus+1}/${count}`;
  get('mountain-action').textContent=({cast:'Rope ready',walk:'Walking the trail',climb:'Cliff ascent',collect:['Water stop','Snack found','Gear check'][visits%3],build:'Pitching a portaledge',camp:'Quiet camp',traverse:'Next ridge'}[phase]);
  lastSignature=[model.minute.value,model.hour.value,model.day.value,model.month.value,model.year.value,prefs.format24,prefs.display.companion,prefs.display.cameraMotion].join('|');
 }
 function schedule(delay){if(allowed())timer=setTimeout(start,delay??Math.max(2000,(prefs.display.companionInterval-prefs.display.companionDuration)*1000));}
 function animate(now){
  if(!allowed()){stop();return;}
  if(now-lastFrame>=(prefs.lowPower?84:40)){lastFrame=now;const progress=clamp((now-scene.began)/scene.duration);draw(progress);
   if(progress===1){scene=null;frame=null;draw(.92);schedule();return;}}
  frame=requestAnimationFrame(animate);
 }
 function start(){
  clearTimeout(timer);timer=null;if(!allowed())return;
  level=itinerary[Math.floor(Date.now()/60000)%itinerary.length];focus=0;visits++;
  scene={began:performance.now(),duration:prefs.display.companionDuration*1000};
  if(still()){draw(.92);scene=null;schedule(prefs.display.companionInterval*1000);return;}
  lastFrame=0;draw(0);frame=requestAnimationFrame(animate);
 }
 function sync(){
  if(!active()){stop();expedition.hidden=true;return;}expedition.hidden=false;
  if(!allowed()){stop();draw(.92);return;}
  const c=calendar(),signature=[c.minute.value,c.hour.value,c.day.value,c.month.value,c.year.value,prefs.format24,prefs.display.companion,prefs.display.cameraMotion].join('|');
  if(!scene&&(signature!==lastSignature||!currentRoute))draw(.92);
  if(!scene&&timer===null)schedule(1000);
 }
 function refresh(){stop();expedition.hidden=!active();if(active()){lastShift=-1;shift();fit();draw(.92);sync();}}
 window.TimeMountain={calendar,route,draw,start,stop,sync,refresh,get running(){return scene!==null;},get pending(){return timer!==null;},get state(){return {level,focus,visits,frame,lastActor,routeKey:currentKey};}};
 document.addEventListener('visibilitychange',sync);get('settings').addEventListener('close',refresh);get('settings-button').addEventListener('click',stop);
 document.addEventListener('desk-display-change',refresh);window.addEventListener('resize',refresh);motion?.addEventListener?.('change',refresh);
 if(typeof ResizeObserver==='function'){const observer=new ResizeObserver(()=>{if(active()){fit();if(!scene)draw(.92);}});for(const e of [get('display').querySelector('.clock-panel'),get('display').querySelector('.fact-panel'),get('display').querySelector('.weather-panel')])observer.observe(e);}
 refresh();
})();
