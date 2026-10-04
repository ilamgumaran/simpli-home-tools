// SPDX-License-Identifier: GPL-3.0-only
// Copyright (C) 2026 ilamgumaran and contributors
// Original miniature mountaineering scenes; no game assets or runtime libraries.
(()=>{
 const stage=document.createElement('div');stage.id='climber-stage';stage.hidden=true;stage.setAttribute('aria-hidden','true');
 stage.innerHTML=`<svg id="climber-world" xmlns="http://www.w3.org/2000/svg">
  <path id="climber-rope"/><path id="climber-camp-link"/><circle id="climber-anchor" r="3"/><path id="climber-hook" d="M-5 0Q-5 -9 3 -7L6 -3"/>
  <g id="climber-supply"><g class="supply-water"><rect x="-5" y="-12" width="10" height="15" rx="3"/><path d="M-3 -14H3M-4 -3H4"/></g><g class="supply-food"><path d="M0 -10C-12 -17 -13 3 -3 3L0 2L3 3C13 3 12 -17 0 -10Z"/><path d="M0 -10L3 -16"/></g><g class="supply-gear"><rect x="-7" y="-10" width="14" height="13" rx="3"/><path d="M-2 -10V-14H2V-10M-7 -4H7"/></g></g>
  <g id="climber-camp"><path class="tent-cables" d="M0 -50L-32 0M0 -50L32 0"/><path class="tent-platform" d="M-36 3H36"/><path class="tent-shell" d="M-32 0L-18 -24L10 -24L32 0Z"/><path class="tent-door" d="M-11 0L-4 -22L7 0Z"/><path class="tent-seam" d="M10 -24L21 0"/><path class="tent-roll" d="M-20 -29H0"/></g>
  <g id="climber-person"><g id="climber-rig">
   <g class="climber-limbs"><path class="climb-arm-a" d="M-10 -9L-19 -23L-15 -34"/><path class="climb-arm-b" d="M9 -9L19 -17L23 -27"/><path class="climb-leg-a" d="M-6 8L-16 18L-19 29L-26 29"/><path class="climb-leg-b" d="M6 8L16 16L12 29L19 29"/></g>
   <g class="climber-pack"><rect x="7" y="-23" width="17" height="30" rx="5"/><path d="M8 -15H24M11 -7H20M13 -24V-28H21V-24"/><rect x="9" y="-31" width="18" height="6" rx="3"/><circle cx="22" cy="0" r="5"/></g>
   <path class="climber-drop" d="M-1 -33C-3 -22 -14 -20 -14 -8C-14 4 -7 11 1 11C11 11 15 4 15 -7C15 -20 3 -23 -1 -33Z"/>
   <path class="climber-shine" d="M-7 -18Q-10 -14 -9 -10"/>
   <g class="climber-face"><path d="M-5 -7V-3M5 -7V-3"/><path class="climber-smile" d="M-3 1Q1 5 5 1"/></g>
   <path class="climber-helmet" d="M-12 -19Q0 -35 12 -19Z"/><path class="climber-harness" d="M-12 1L0 7L13 1M0 7V12"/><circle class="climber-buckle" cx="0" cy="7" r="3"/>
   <path class="climber-held-bottle" d="M-21 -12H-14V1H-21ZM-19 -16H-16V-12"/>
   <circle class="climber-held-food" cx="-18" cy="-4" r="5"/><rect class="climber-held-gear" x="-22" y="-10" width="8" height="10" rx="2"/>
  </g></g>
  <g id="climber-note"><rect x="-44" y="-12" width="88" height="20" rx="7"/><text id="climber-caption" text-anchor="middle" y="2">BASE CAMP</text></g>
 </svg>`;
 document.body.append(stage);
 const get=id=>document.getElementById(id),svg=get('climber-world');
 let timer=null,frame=null,lastFrame=0,scene=null,trip=0,nextVisit=0;
 const motion=matchMedia('(prefers-reduced-motion: reduce)');
 const glyphCanvas=document.createElement('canvas'),glyphContext=glyphCanvas.getContext('2d');
 const clamp=(n,a,b)=>Math.max(a,Math.min(b,n)),mix=(a,b,t)=>a+(b-a)*t;
 const ease=t=>t*t*(3-2*t),point=(a,b,t)=>({x:mix(a.x,b.x,ease(t)),y:mix(a.y,b.y,ease(t))});
 function enabled(){return prefs.theme==='climber'&&prefs.display.companion!==false&&document.visibilityState==='visible'&&!get('settings').open&&!document.body.classList.contains('screen-rest');}
 function stop(){clearTimeout(timer);timer=null;if(frame!==null)cancelAnimationFrame(frame);frame=null;scene=null;stage.hidden=true;}
 function place(el,p,extra=''){el.setAttribute('transform',`translate(${p.x.toFixed(1)} ${p.y.toFixed(1)}) ${extra}`);}
 function glyphs(){
  const ctx=glyphContext;if(!ctx)return [];
  const style=getComputedStyle(get('time'));ctx.font=`${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
  return [...document.querySelectorAll('#time .time-digit')].filter(e=>e.dataset.digit!==':').map(e=>{
   const r=e.getBoundingClientRect(),m=ctx.measureText(e.dataset.digit),baseline=e.querySelector('.digit-baseline').getBoundingClientRect().top;
   const left=r.left-(m.actualBoundingBoxLeft||0),top=baseline-(m.actualBoundingBoxAscent||r.height*.8);
   return {left,top,right:r.left+(m.actualBoundingBoxRight||r.width),bottom:baseline+(m.actualBoundingBoxDescent||0),index:e.dataset.index};
  });
 }
 function terrain(index){
  const size=innerHeight<650?44:60,half=size/2,scale=size/66;
  const digits=glyphs();if(!digits.length)return null;
  const digit=digits[Math.floor(index/2)%digits.length],panel=document.querySelector(['.weather-panel','.fact-panel','.clock-panel'][Math.floor(index/2)%3]).getBoundingClientRect();
  const widget=index%2===1;
  let anchor,start,ledge;
  if(widget){
   const x=clamp(panel.right+half*.55,half+3,innerWidth-half-3);
   anchor={x:panel.right-6,y:panel.top+12};start={x,y:clamp(panel.bottom-half-5,half+10,innerHeight-half-12)};
   ledge={x,y:clamp(panel.top+42,half+10,innerHeight-half-12)};
  }else{
   anchor={x:digit.left+(digit.right-digit.left)*.62,y:digit.top+5};
   start={x:digit.left+6,y:digit.bottom-half*.5};
   ledge={x:digit.left+(digit.right-digit.left)*.35,y:digit.top-half*.5};
  }
  for(const p of [anchor,start,ledge]){p.x=clamp(p.x,half+5,innerWidth-half-5);p.y=clamp(p.y,half+10,innerHeight-half-15);}
  const middle={x:widget?start.x:digit.left-half*.5,y:mix(start.y,ledge.y,.55)};
  middle.x=clamp(middle.x,half+5,innerWidth-half-5);
  // Camp hangs beside the numeral or outside a widget, rather than over other text.
  const camp={x:widget?start.x-28*scale:clamp(digit.right+22*scale,40*scale+4,innerWidth-40*scale-4),y:clamp(ledge.y+55*scale,60*scale,innerHeight-35*scale)};
  return {size,scale,anchor,start,middle,ledge,camp,widget,digit:digit.index};
 }
 function paint(progress){
  if(!scene)return;const land=terrain(scene.trip);if(!land){stop();return;}
  svg.setAttribute('viewBox',`0 0 ${innerWidth} ${innerHeight}`);
  const {anchor,start,middle,ledge,camp,scale}=land;
  const camping=scene.trip%3===2,climbEnd=camping?.48:.65,castEnd=.12,collectEnd=climbEnd+.1,campEnd=.94;
  let p,state;
  if(progress<castEnd){p=start;state='cast';}
  else if(progress<climbEnd){const t=(progress-castEnd)/(climbEnd-castEnd);p=t<.55?point(start,middle,t/.55):point(middle,ledge,(t-.55)/.45);state='climb';}
  else if(progress<collectEnd){p=ledge;state='collect';}
  else if(progress<campEnd){p=land.widget?ledge:point(ledge,{x:camp.x-8*scale,y:camp.y-10*scale},clamp((progress-collectEnd)/.08,0,1));state=camping?'sleep':'camp';}
  else{p=point({x:camp.x-8*scale,y:camp.y-10*scale},start,(progress-campEnd)/(1-campEnd));state='rappel';}
  if(state==='camp'&&progress<collectEnd+.08&&!land.widget)state='build';
  stage.dataset.state=state;stage.dataset.target=land.widget?'widget':'digit';stage.dataset.digit=land.digit;stage.dataset.item=['water','food','gear'][scene.trip%3];
  place(get('climber-person'),p,`scale(${scale})`);
  const hook=state==='cast'?point(start,anchor,progress/castEnd):anchor;
  place(get('climber-hook'),hook);
  const hand={x:p.x-12*scale,y:p.y-22*scale};
  const sway=state==='cast'?Math.sin(progress/castEnd*Math.PI)*45*scale:state==='camp'||state==='sleep'?Math.sin(progress*12)*5*scale:5*scale;
  get('climber-rope').setAttribute('d',`M${hook.x} ${hook.y} Q${mix(hook.x,hand.x,.5)+sway} ${mix(hook.y,hand.y,.5)+Math.abs(sway)} ${hand.x} ${hand.y}`);
  place(get('climber-anchor'),anchor);
  place(get('climber-supply'),{x:ledge.x+16*scale,y:ledge.y+15*scale},`scale(${scale})`);
  get('climber-supply').dataset.item=['water','food','gear'][scene.trip%3];get('climber-supply').style.opacity=progress>climbEnd?String(clamp(1-(progress-climbEnd)/.08,0,1)):'1';
  const tentVisible=!land.widget&&['build','camp','sleep','rappel'].includes(state);
  get('climber-camp').style.display=tentVisible?'':'none';
  get('climber-camp-link').style.display=tentVisible?'':'none';
  get('climber-camp-link').setAttribute('d',`M${anchor.x} ${anchor.y} L${camp.x} ${camp.y-50*scale}`);
  place(get('climber-camp'),camp,`scale(${scale}) rotate(${motion.matches?0:Math.sin(progress*14)*2})`);
  for(const part of get('climber-camp').querySelectorAll('.tent-shell,.tent-door,.tent-seam'))part.setAttribute('transform',`scale(1 ${clamp((progress-collectEnd)/.08,0,1)})`);
  const captions={cast:'ROPE READY',climb:'TIME TO CLIMB',collect:['WATER BREAK','SNACK FOUND','GEAR CHECK'][scene.trip%3],build:'MAKING CAMP',camp:land.widget?'LEDGE PICNIC':'HANGING CAMP',sleep:'SUMMIT SNOOZE',rappel:'SEE YOU UP TOP'};
  get('climber-caption').textContent=captions[state];
  // Small labels belong in the margin; leave facts, weather and date unobstructed.
  place(get('climber-note'),{x:clamp(p.x,48,innerWidth-48),y:innerHeight-13});
  get('climber-note').style.display=innerHeight<650?'none':'';
  stage.style.opacity=String(Math.min(1,progress/.04,(1-progress)/.04));
 }
 function schedule(){
  if(!enabled())return;
  const interval=prefs.display.companionInterval*1000;
  nextVisit=Date.now()+Math.max(4000,interval-scene.duration);
  // In the default cadence, begin at :54 so a real minute change happens during the climb.
  if(interval===60000)nextVisit=Math.ceil((nextVisit-54000)/60000)*60000+54000;
  timer=setTimeout(start,Math.max(1000,nextVisit-Date.now()));
 }
 function animate(now){
  if(!enabled()){stop();return;}
  if(now-lastFrame>=(prefs.lowPower?80:40)){
   lastFrame=now;const progress=clamp((now-scene.began)/scene.duration,0,1);paint(progress);if(!scene)return;
   if(progress>=1){schedule();scene=null;frame=null;stage.hidden=true;return;}
  }
  frame=requestAnimationFrame(animate);
 }
 function start(){
  clearTimeout(timer);timer=null;if(!enabled())return;
  scene={trip:trip++,began:performance.now(),duration:prefs.display.companionDuration*1000};stage.hidden=false;
  if(motion.matches||typeof requestAnimationFrame!=='function'){
   paint(.89);if(!scene)return;timer=setTimeout(()=>{schedule();scene=null;stage.hidden=true;},2000);return;
  }
  paint(0);if(!scene)return;lastFrame=0;frame=requestAnimationFrame(animate);
 }
 function sync(){if(!enabled()){stop();return;}if(!scene&&timer===null)timer=setTimeout(start,1000);}
 window.DeskClimber={sync,stop,start,paint,glyphs,terrain,get running(){return scene!==null;},get visits(){return trip;}};
 document.addEventListener('visibilitychange',sync);get('settings').addEventListener('close',sync);get('settings-button').addEventListener('click',stop);
 document.addEventListener('desk-display-change',()=>{stop();sync();});
 window.addEventListener('resize',()=>{stop();if(enabled())timer=setTimeout(start,9000);});
 motion.addEventListener?.('change',()=>{stop();sync();});
 sync();
})();
