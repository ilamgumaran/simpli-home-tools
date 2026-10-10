// SPDX-License-Identifier: LicenseRef-Simpli-Noncommercial-1.0
// Copyright (C) 2026 ilamgumaran and contributors
// Original SVG illustration. Clock geometry remains in DeskWorlds.numerals.
(()=>{
 'use strict';
 const cache=new WeakMap(),mod=(n,d)=>((n%d)+d)%d;
 const color=(v,f)=>typeof v==='string'&&/^#[0-9a-f]{6}$/i.test(v)?v:f;
 const f=n=>Number(n).toFixed(3);
 function defs(){return `<defs>
 <linearGradient id="w-art-sky" x2="0" y2="1"><stop stop-color="#aec5c1"/><stop offset=".55" stop-color="#dce4cd"/><stop offset="1" stop-color="#efe3bc"/></linearGradient>
 <linearGradient id="w-art-dusk" x2="0" y2="1"><stop stop-color="#617784"/><stop offset=".5" stop-color="#b3a99d"/><stop offset="1" stop-color="#e7c49c"/></linearGradient>
 <linearGradient id="w-art-night" x2="0" y2="1"><stop stop-color="#172f40"/><stop offset=".62" stop-color="#375857"/><stop offset="1" stop-color="#607461"/></linearGradient>
 <radialGradient id="w-art-sun"><stop stop-color="#fff2bf"/><stop offset=".58" stop-color="#f4deb0" stop-opacity=".64"/><stop offset="1" stop-color="#f4deb0" stop-opacity="0"/></radialGradient>
 <linearGradient id="w-art-water" x2=".2" y2="1"><stop stop-color="#c0d3be"/><stop offset=".35" stop-color="#88b9bd"/><stop offset=".7" stop-color="#508f99"/><stop offset="1" stop-color="#355e71"/></linearGradient>
 <linearGradient id="w-art-water-night" x2=".2" y2="1"><stop stop-color="#819e96"/><stop offset=".35" stop-color="#567c84"/><stop offset="1" stop-color="#294857"/></linearGradient>
 <linearGradient id="w-art-earth" x2="0" y2="1"><stop stop-color="#b3b57e"/><stop offset=".55" stop-color="#8b9d69"/><stop offset="1" stop-color="#647b52"/></linearGradient>
 <linearGradient id="w-art-earth-night" x2="0" y2="1"><stop stop-color="#65735d"/><stop offset=".55" stop-color="#4c6150"/><stop offset="1" stop-color="#344d43"/></linearGradient>
 <linearGradient id="w-art-bank" x2=".3" y2="1"><stop stop-color="#ecdeb3"/><stop offset=".55" stop-color="#d1bb88"/><stop offset="1" stop-color="#a58a62"/></linearGradient>
 <linearGradient id="w-art-bank-night" x2=".3" y2="1"><stop stop-color="#a2b199"/><stop offset=".55" stop-color="#829078"/><stop offset="1" stop-color="#596c5d"/></linearGradient>
 <linearGradient id="w-art-timber" x2="1" y2=".4"><stop stop-color="#f0dab0"/><stop offset=".42" stop-color="#cda76e"/><stop offset=".72" stop-color="#e3c793"/><stop offset="1" stop-color="#b99464"/></linearGradient>
 <linearGradient id="w-art-stone" x2=".2" y2="1"><stop stop-color="#e0e1ca"/><stop offset=".45" stop-color="#c1c6b2"/><stop offset="1" stop-color="#929f94"/></linearGradient>
 <linearGradient id="w-art-sand" x2="0" y2="1"><stop stop-color="#fff1c4"/><stop offset=".5" stop-color="#ead5a1"/><stop offset="1" stop-color="#cbb582"/></linearGradient>
 <linearGradient id="w-art-leaf" x2=".3" y2="1"><stop stop-color="#e0e9b2"/><stop offset=".45" stop-color="#c2d49a"/><stop offset="1" stop-color="#91ae7e"/></linearGradient>
 <pattern id="w-art-grain" width="31" height="21" patternUnits="userSpaceOnUse"><path d="M-4 4Q9 -1 36 4M-5 14Q7 19 37 13M0 9Q12 7 23 10" fill="none" stroke="#74573c" stroke-width=".65" opacity=".45"/><ellipse cx="18" cy="4" rx="4" ry="1.8" fill="none" stroke="#76593b" stroke-width=".7" opacity=".55"/></pattern>
 <pattern id="w-art-masonry" width="30" height="23" patternUnits="userSpaceOnUse"><path d="M0 0H30V23H0ZM14 0V10M0 10H30M23 10V23" fill="none" stroke="#536655" stroke-width=".8" opacity=".45"/><path d="M2 2H12M16 2H27M2 12H20" stroke="#f4efcf" stroke-width=".8" opacity=".55"/></pattern>
 <pattern id="w-art-speckle" width="21" height="17" patternUnits="userSpaceOnUse"><path d="M3 5h1m10 -2h1m2 10h1m-13 2h1m4 -7h1" stroke="#876e49" stroke-width=".8" opacity=".4"/><path d="M5 2h2m9 7h2m-12 4h2" stroke="#fff4d7" stroke-width=".8" opacity=".8"/></pattern>
 <pattern id="w-art-veins" width="24" height="20" patternUnits="userSpaceOnUse"><path d="M-3 20L24 -2M4 13L3 5M12 8L21 10M18 3L17 -3" fill="none" stroke="#597450" stroke-width=".7" opacity=".45"/></pattern>
 <clipPath id="w-art-river-clip"><path d="M824 132C742 134 699 173 633 164S527 129 470 158S424 195 455 216S555 223 591 243S630 299 702 303S768 344 824 351Z"/></clipPath>
 </defs>`;}
 function pine(x,y,s,c,phase=0){return `<g transform="translate(${x} ${y}) scale(${s})"><g data-wind="0 0 1.2 ${phase}">
 <path d="M-5 1L-2 -77H3L6 1Z" fill="#645a43"/><path d="M0 -117Q-10 -91 -30 -72L-15 -74Q-29 -51 -43 -37L-25 -38Q-35 -22 -53 -10Q-25 -2 0 -8Q27 -1 51 -11Q33 -23 25 -39L42 -36Q25 -56 16 -74L30 -72Q10 -91 0 -117Z" fill="${c}"/>
 <path d="M-3 -108Q-9 -89 -24 -76M-14 -65Q-21 -49 -34 -40M-24 -29Q-32 -16 -43 -12" fill="none" stroke="#d5ddac" stroke-width="2" opacity=".18"/>
 <path d="M0 -98L2 -16M0 -60L-21 -41M1 -49L23 -32M1 -30L-28 -15" fill="none" stroke="#293f36" stroke-width="1.2" opacity=".4"/>
 <path d="M-8 -86l9 4m9 15l-10 5m-26 14l12 3m27 18l-15 2" stroke="#bac598" stroke-width="1.2" opacity=".18"/>
 </g></g>`;}
 function broadleaf(x,y,s,c,phase=0){return `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-9 4Q-2 -40 -6 -69L-2 -115H5Q3 -61 12 4Z" fill="#665d45"/><path d="M-2 -63Q-24 -75 -35 -106M1 -51Q23 -62 38 -96M2 -72L19 -126" fill="none" stroke="#665d45" stroke-width="7" stroke-linecap="round"/><path d="M-4 0Q1 -21 -2 -49M1 -69L1 -107M-2 -54L-15 -67M4 -9L7 -34" fill="none" stroke="#ac9869" stroke-width="1.4"/>
 <g data-wind="0 -54 1.5 ${phase}"><path d="M-61 -88C-80 -113 -56 -140 -34 -133C-25 -156 1 -159 13 -141C37 -155 57 -138 52 -122C81 -111 66 -79 48 -79C41 -58 15 -54 2 -63C-20 -48 -47 -62 -47 -79Z" fill="${c}"/>
 <path d="M-59 -102Q-53 -126 -34 -122M-24 -137Q-6 -146 7 -132M25 -131Q44 -135 44 -118M47 -98Q66 -97 52 -80M-29 -73Q-11 -60 2 -74" fill="none" stroke="#bdcc99" stroke-width="3" stroke-linecap="round" opacity=".25"/>
 <path d="M-45 -105Q-25 -94 -7 -102M7 -120Q22 -109 34 -115M7 -85Q27 -71 40 -85" fill="none" stroke="#243e32" stroke-width="2" opacity=".2"/></g></g>`;}
 function timber(x,y,length=70,angle=0){return `<g transform="translate(${x} ${y}) rotate(${angle})"><path d="M0 -8Q${length*.5} -11 ${length} -7V7Q${length*.5} 10 0 8Z" fill="url(#w-art-timber)" stroke="#514932" stroke-width="1.2"/><path d="M5 -5Q${length*.5} -8 ${length-2} -4M6 1Q${length*.5} 4 ${length-2} 1M7 6Q${length*.5} 2 ${length-2} 5" fill="none" stroke="#806344" stroke-width=".9"/><ellipse cx="${length*.64}" cy="-1" rx="6" ry="2.7" fill="none" stroke="#745c3e" stroke-width=".8"/><ellipse rx="7" ry="8" fill="#e6c890" stroke="#735a3c"/><ellipse rx="4.6" ry="5.9" fill="none" stroke="#a18051" stroke-width=".8"/><ellipse rx="2" ry="3" fill="none" stroke="#a18051" stroke-width=".7"/></g>`;}
 function stone(x,y,s=1){return `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-14 5L-17 -4L-8 -13L7 -15L18 -5L15 6L1 9Z" fill="url(#w-art-stone)" stroke="#65745f" stroke-width="1.1"/><path d="M-13 -3L-6 -10L6 -11M8 -8L14 -2M-8 5L1 7" fill="none" stroke="#eeedcf" stroke-width="1" opacity=".7"/><path d="M-3 -8L1 -1L-2 4" fill="none" stroke="#8a9581" stroke-width=".8"/></g>`;}
 function landscape(model={}){
  const place=model.place||{},hour=Number.isFinite(model.hour)?model.hour:12,night=model.daylight===false,dusk=!night&&(hour===6||hour>=17),variant=mod(hour,8);
  const forest=color(place.forest,'#42694f'),hill=color(place.hill,'#a2b38e'),ground=color(place.ground,'#8ca174');
  const sky=night?'w-art-night':dusk?'w-art-dusk':'w-art-sky';
  const backdrop=`<rect x="-24" y="-24" width="848" height="408" fill="url(#${sky})"/>
   <circle cx="707" cy="49" r="61" fill="url(#w-art-sun)" opacity="${night?.25:.75}"/><circle cx="707" cy="49" r="${night?15:20}" fill="${night?'#e4e6c4':'#f8e5b2'}"/>
   ${night?'<path d="M69 31h1m115 12h1m269 -16h1m89 18h1m95 -8h1m113 -24h1m36 77h1m-462 -62h1" stroke="#e4e7cf" stroke-width="2" stroke-linecap="round" opacity=".7"/>':''}
   <g data-cloud=".31 0" fill="#e8ecdb" opacity="${night?.09:.32}"><path d="M35 50Q48 35 66 40Q80 22 96 40Q122 29 137 47Q153 41 161 51Z"/><path d="M267 35Q288 17 305 25Q322 9 342 25Q369 16 395 34Z"/></g>
   <g data-cloud=".2 2" fill="#f1ebd5" opacity="${night?.07:.22}"><path d="M483 69Q514 47 533 58Q550 38 574 57Q598 48 621 66Z"/></g>
   <path d="M-24 153Q19 138 65 98T147 77Q184 101 226 141Q265 145 298 108L363 ${62+variant*3}Q385 43 407 77T485 137Q520 140 559 104T632 77Q663 74 693 104T755 125Q788 104 824 91V259H-24Z" fill="${hill}" opacity="${night?.48:.65}"/>
   <path d="M-24 184Q44 148 89 161T182 139Q236 118 299 160T406 143Q454 112 505 154T614 154Q698 117 824 143V263H-24Z" fill="${forest}" opacity="${night?.5:.26}"/>
   <path d="M289 110L365 ${74+variant*3}L390 91L402 84M582 101Q629 71 661 99M72 107Q111 73 142 93" fill="none" stroke="#e9e5cf" stroke-width="1.7" opacity="${night?.1:.36}"/>
   <g opacity="${night?.58:.78}">${Array.from({length:13},(_,i)=>pine(-8+i*68,235,.48+mod(i+hour,4)*.10,forest,i*.71)).join('')}</g>
   <path d="M-24 252Q77 224 171 242T339 240Q439 225 532 242T700 225Q780 212 824 232V384H-24Z" fill="${night?'#526c59':ground}"/>
   <path d="M-24 275Q77 245 180 258T354 253Q408 247 452 265L439 384H-24Z" fill="url(#w-art-earth${night?'-night':''})" opacity=".67"/>
   <path d="M61 280Q167 243 287 261T444 248" fill="none" stroke="#c5be87" stroke-width="17" opacity=".65"/>
   <path d="M62 280Q167 245 287 263T444 250" fill="none" stroke="#dccd9a" stroke-width="5" opacity=".7"/>`;
  const river=`<path d="M824 130C742 132 697 168 633 161S526 126 468 155S416 195 454 220S550 226 589 246S627 302 700 307S770 348 824 354Z" fill="#3f685c" opacity=".45"/>
   <path d="M824 132C742 134 699 173 633 164S527 129 470 158S424 195 455 216S555 223 591 243S630 299 702 303S768 344 824 351Z" fill="url(#w-art-water${night?'-night':''})"/>
   <g clip-path="url(#w-art-river-clip)"><path d="M393 161Q516 203 633 189T838 178M438 215Q552 176 650 203T833 210" fill="none" stroke="#d8e0be" stroke-width="20" opacity=".12"/>
    <g data-river="0" fill="none" stroke="#d6e4d1" stroke-width="1.15" opacity=".48">${Array.from({length:7},(_,i)=>`<path d="M${308+i*6} ${158+i*13}q21 -6 42 0${'t42 0'.repeat(15)}"/>`).join('')}</g>
    <g data-river="1" fill="none" stroke="#dce9d7" stroke-width="1.2" opacity=".45"><path d="M463 169h30m39 19h25m74 -15h35m45 26h31m-194 28h26m56 44h36m54 40h30"/></g>
    <g data-water="545 191 1.2"><path d="M527 190q18 -6 36 0m-29 4q11 -3 22 0" fill="none" stroke="#e2e8d0" stroke-width="1.1" opacity=".5"/></g>
   </g><path d="M448 212Q484 235 534 227M635 299Q684 315 739 316" fill="none" stroke="#e4d4a3" stroke-width="2.2" opacity=".85"/>`;
  const foreground=`<path d="M452 233Q514 239 544 257T567 300Q613 326 674 323T756 356L824 384H-24V351Q144 345 260 343T433 333Q470 301 452 280T452 233Z" fill="url(#w-art-bank${night?'-night':''})"/>
   <path d="M-24 365Q125 347 238 360T414 354Q445 345 464 353V384H-24Z" fill="#718050" opacity=".78"/>
   <path d="M488 251q17 1 29 10m-29 -4q12 1 18 6m53 57q35 11 73 8m26 5q19 0 34 9" fill="none" stroke="#f2e2b8" stroke-width="1.5" opacity=".64"/>
   <path d="M124 350h2m32 7h1m87 -10h2m192 -8h2m38 -61h1m54 40h2m73 22h2m120 13h2m-650 9h1m207 -7h1m402 -21h1" stroke="#8a7853" stroke-width="1.2" opacity=".45"/>
   ${broadleaf(-3,310,1.42,forest,.8)}${pine(824,300,1.9,forest,2.1)}
   <g data-wind="160 357 2.5 1"><path d="M153 358q-21 -35 -10 -26q12 5 15 26q-2 -42 7 -29q8 13 -5 29q15 -31 19 -20q3 10 -16 20Z" fill="#627d47"/><path d="M157 355l-10 -21m12 21l4 -22m-1 22l12 -16" stroke="#c0c184" stroke-width=".8"/></g>
   <g data-wind="746 343 3 2"><path d="M739 345q-13 -52 -4 -37q7 12 8 38q3 -62 10 -44q4 22 -5 43q20 -40 23 -27q-1 16 -20 29Z" fill="#7c8750"/><path d="M743 338l-5 -26m8 28l7 -31" stroke="#c9c38a" stroke-width="1"/></g>
   ${stone(77,332,1.5)}${stone(125,340,.7)}${stone(677,328,.6)}${stone(782,353,1.0)}
   ${variant===6?'<g fill="#b88955"><circle cx="58" cy="184" r="4"/><circle cx="17" cy="199" r="4"/><circle cx="36" cy="223" r="3"/></g>':''}`;
  const camp=`<path d="M214 332Q276 313 349 325T461 333" fill="none" stroke="#9a895f" stroke-width="3" opacity=".42"/>
   ${timber(134,312,62,7)}${timber(147,298,51,-4)}${timber(170,326,58,3)}
   <g fill="none" stroke="#7e6846" stroke-width="3" stroke-linecap="round"><path d="M273 321L304 270L339 321M304 270L371 274L401 320M371 274L339 321"/><path d="M270 323h135" stroke-width="1.5"/></g>
   <path d="M304 272L371 276L388 302L325 299Z" fill="#c8b27d" stroke="#796546" stroke-width="1" opacity=".54"/>
   ${[0,1,2,3,4,5,6].map(i=>stone(432+Math.cos(i*Math.PI*2/7)*19,326+Math.sin(i*Math.PI*2/7)*6,.33)).join('')}
   <path d="M419 326l26 -3m-20 -7l14 14" stroke="#6c593e" stroke-width="4" stroke-linecap="round"/>
   <path d="M606 302v31m12 -30v30M602 306h19" stroke="#7b6848" stroke-width="2.3"/><path d="M606 306h12l-3 11h-6Z" fill="#e0d3a6" stroke="#65705a" stroke-width="1"/><path d="M611 319v3" stroke="#d5e5d5" stroke-width="1.4"/>
   <path d="M606 326h12v8h-12Z" fill="#769f98" stroke="#486963" stroke-width="1"/>
   <path d="M470 316q-4 -12 3 -12h22q7 0 4 12l-6 11h-15Z" fill="#aa8d5d" stroke="#6c6044" stroke-width="1.2"/><path d="M475 309l3 14m3 -15l2 17m3 -17l2 17m3 -17l2 14" stroke="#d4ba83" stroke-width=".8"/>
   <path d="M251 335h19m87 4h12m-151 3h7" stroke="#e8d5a3" stroke-width="1"/>
   ${variant===3||variant===7?stone(211,310,.9):timber(211,309,39,-9)}`;
  return {backdrop,foreground,river,camp};
 }
 function digit(d,{material='timber',seed=0}={}){
  if(!globalThis.DeskWorlds||!Object.hasOwn(DeskWorlds.numerals,String(d)))throw Error('A canonical digit from 0 to 9 is required');
  const materials={wood:{gradient:'timber',pattern:'grain',edge:'#493d2d'},timber:{gradient:'timber',pattern:'grain',edge:'#493d2d'},stone:{gradient:'stone',pattern:'masonry',edge:'#3c4d43'},sand:{gradient:'sand',pattern:'speckle',edge:'#4a5944'},leaf:{gradient:'leaf',pattern:'veins',edge:'#294534'}};
  if(!Object.hasOwn(materials,material))throw Error('Unknown Woodland numeral material');
  const a=materials[material],path=DeskWorlds.numerals[String(d)],offset=mod(Number.isFinite(seed)?seed:0,31);
  let pieces='';
  if(['leaf','stone'].includes(material)&&globalThis.DeskWoodlandStory){
   const points=DeskWoodlandStory.points(d,{step:18});
   pieces=points.map((point,i)=>{
    const next=points[i+1]?.stroke===point.stroke?points[i+1]:point,prior=points[i-1]?.stroke===point.stroke?points[i-1]:point;
    const tangent=Math.atan2(next.y-prior.y,next.x-prior.x)*180/Math.PI,angle=tangent+(material==='leaf'?(i%2?18:-18):mod(i*13+offset,18)-9);
    const transform=`translate(${f(point.x)} ${f(point.y)}) rotate(${f(angle)})`;
    const data=`data-w-art-piece="${i}" data-fraction="${f(point.fraction)}" transform="${transform}"`;
    if(material==='leaf')return `<g ${data}><path d="M-11 0Q-3 -10 11 -1Q5 9 -11 0Z" fill="${i%3===0?'#c9dba3':i%3===1?'#adc98e':'#d9e3b2'}" stroke="#5c7850" stroke-width=".8"/><path d="M-9 0L9 -1M-3 0L-1 -5M2 -1L5 4" fill="none" stroke="#6d8958" stroke-width=".75" opacity=".72"/></g>`;
    const inset=mod(i*7+offset,4);
    return `<g ${data}><path d="M-11 -3L-7 ${-8+inset}L4 -8L11 -3L9 5L1 8L-9 5Z" fill="${i%3===0?'#c6cdb7':i%3===1?'#afbdad':'#d9debf'}" stroke="#60735d" stroke-width=".9"/><path d="M-8 -2L-4 ${-5+inset}L4 -5M5 -3L8 0M-6 4L1 5" fill="none" stroke="#f3efd1" stroke-width="1" opacity=".75"/></g>`;
   }).join('');
  }
  return `<g data-w-art-digit="${d}" data-material="${material}" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="${path}" transform="translate(1.8 2.6)" stroke="#283d31" stroke-width="25" opacity=".30"/><path d="${path}" stroke="${a.edge}" stroke-width="24"/><path class="woodland-trail" d="${path}" stroke="url(#w-art-${a.gradient})" stroke-width="18"/><path d="${path}" stroke="url(#w-art-${a.pattern})" stroke-width="16"/><path d="${path}" transform="translate(-1 -1)" stroke="#fff1c9" stroke-width="1" opacity=".38" stroke-dasharray="5 18" stroke-dashoffset="${offset}"/>${pieces}</g>`;
 }
 function bindings(root){
  let value=cache.get(root);if(value)return value;
  const rows=selector=>Array.from(root.querySelectorAll(selector));
  const values=el=>el.getAttribute(el.hasAttribute('data-wind')?'data-wind':el.hasAttribute('data-cloud')?'data-cloud':el.hasAttribute('data-water')?'data-water':'data-river').split(/\s+/).map(Number);
  value={wind:rows('[data-wind]').map(el=>({el,v:values(el)})),cloud:rows('[data-cloud]').map(el=>({el,v:values(el)})),river:rows('[data-river]').map(el=>({el,v:values(el)})),water:rows('[data-water]').map(el=>({el,v:values(el)}))};cache.set(root,value);return value;
 }
 function animate(root,seconds,{reducedMotion=false,lowPower=true}={}){
  if(!root||typeof root.querySelectorAll!=='function')return;
  const r=bindings(root),t=reducedMotion?0:Number.isFinite(seconds)?seconds:0;
  for(const {el,v:[x,y,amplitude,phase]} of r.wind){const turn=reducedMotion?0:amplitude*(.67*Math.sin(t*.69+phase)+.33*Math.sin(t*1.31+phase*.7));el.setAttribute('transform',`rotate(${f(turn)} ${x} ${y})`);}
  for(const {el,v:[speed,phase]} of r.cloud){const dx=reducedMotion?0:Math.sin(t*speed*.025+phase)*19;el.setAttribute('transform',`translate(${f(dx)} 0)`);}
  for(const {el,v:[index]} of r.river){const dx=reducedMotion?0:index===0?mod(t*3,84):-Math.sin(t*.37)*7,dy=reducedMotion?0:Math.sin(t*.47+index)*1.5;el.setAttribute('transform',`translate(${f(dx)} ${f(dy)})`);}
  for(const {el,v:[x,y,amplitude]} of r.water){const pulse=reducedMotion?1:1+Math.sin(t*.89)*amplitude*.035;el.setAttribute('transform',`translate(${x} ${y}) scale(${f(pulse)} 1) translate(${-x} ${-y})`);}
  // The caller owns frame cadence and visibility; lowPower never freezes scenery.
  return !reducedMotion&&(r.wind.length+r.cloud.length+r.river.length+r.water.length)>0;
 }
 // Call after replacing any art group; this avoids DOM queries during normal frames.
 function invalidate(root){cache.delete(root);}
 globalThis.DeskWoodlandArt=Object.freeze({defs,landscape,digit,animate,invalidate});
})();
