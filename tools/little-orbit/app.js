// SPDX-License-Identifier: LicenseRef-Simpli-Noncommercial-1.0
// Copyright (C) 2026 ilamgumaran and contributors
'use strict';
DeskCharacters.mountCandy(document.getElementById('candy-pal'));
const $ = id => document.getElementById(id);
const defaultDisplay={profile:'auto',clockScale:1,weatherScale:1,factScale:1,gap:8,companionInterval:60,companionDuration:12,companion:true,cameraMotion:'gentle',woodlandView:'immersive'};
const siteConfig=window.ORBIT_CONFIG||{};
const defaults = {version:3,unit:'fahrenheit',format24:false,care:true,night:true,lowPower:true,rest:true,theme:'candy',place:{name:'Marietta, GA · 30064',latitude:33.9276,longitude:-84.6202},...siteConfig,display:{...defaultDisplay,...siteConfig.display}};
function read(key,fallback){try{return JSON.parse(localStorage.getItem(key)) ?? fallback;}catch{return fallback;}}
function write(key,value){try{localStorage.setItem(key,JSON.stringify(value));}catch{}}
async function fetchWithTimeout(url,milliseconds){
 const controller=typeof AbortController==='function'?new AbortController():null;
 const timeout=setTimeout(()=>controller?.abort(),milliseconds);
 try{return await fetch(url,controller?{signal:controller.signal}:{});}finally{clearTimeout(timeout);}
}
let prefs={...defaults,...read('orbit-settings',{})};
prefs.display={...defaults.display,...prefs.display};
write('orbit-settings',prefs);
if(!prefs.place || !Number.isFinite(prefs.place.latitude) || !Number.isFinite(prefs.place.longitude)) prefs.place=defaults.place;
const facts=[
 ['A planet with a very slow spin','Venus takes about 243 Earth days to spin once, but only 225 Earth days to orbit the Sun. Its spin takes longer than its year!','venus'],
 ['The hottest planet isn’t the closest','Venus is hotter than Mercury. Its thick atmosphere traps heat like an enormous blanket.','venus'],
 ['Sunrise runs backward on Venus','Venus spins in the opposite direction to Earth. From its surface, the Sun would rise in the west and set in the east.','venus'],
 ['Venus has no moon buddies','Some planets have many moons. Venus has none—and neither does Mercury.','venus'],
 ['Mars is a rusty world','Mars looks red because iron minerals in its soil rust. Think of it as a planet wearing rusty dust!','mars'],
 ['A mountain fit for a space giant','Olympus Mons on Mars is the largest volcano in our solar system. It is roughly three times taller than Mount Everest.','mars'],
 ['Mars has two tiny moons','The moons of Mars are called Phobos and Deimos. Both are small and shaped more like potatoes than perfect balls.','mars'],
 ['A longer birthday countdown','A year on Mars lasts about 687 Earth days. You would wait almost twice as long between Martian birthdays!','mars'],
 ['Jupiter is the planet champion','Jupiter is the biggest planet in our solar system. About 1,000 Earths could fit inside it.','jupiter'],
 ['A storm bigger than Earth','Jupiter’s Great Red Spot is a giant storm larger than our planet. People have watched it for centuries.','jupiter'],
 ['Jupiter spins in a hurry','A day on Jupiter lasts about 10 hours. The biggest planet has the shortest day in our solar system!','jupiter'],
 ['No landing pad on Jupiter','Jupiter is a gas giant. It has no solid surface like Earth where you could stand and take a walk.','jupiter'],
 ['Saturn’s rings are icy','Saturn’s beautiful rings are made of countless pieces of ice and rock. Some pieces are tiny; others are as large as houses.','saturn'],
 ['The planet that could float','Saturn’s average density is lower than water. If you imagined a bathtub big enough, Saturn would float!','saturn'],
 ['A very long Saturn summer','Saturn takes about 29 Earth years to orbit the Sun. That makes its seasons much longer than ours.','saturn'],
 ['A hexagon in the clouds','Saturn has a huge six-sided weather pattern around its north pole. Even planets can show off their geometry!','saturn'],
 ['Our planet is mostly blue','Water covers about 71% of Earth’s surface. That is why our home looks like a blue marble from space.','earth'],
 ['Earth has a protective shield','Earth’s magnetic field helps protect us from charged particles coming from the Sun. An invisible shield around our home!','earth'],
 ['Our air is mostly nitrogen','Nitrogen makes up about 78% of Earth’s atmosphere. Oxygen, the gas we need to breathe, makes up about 21%.','earth'],
 ['An extra day for our calendar','Earth takes about 365.25 days to orbit the Sun. Leap days help keep our calendar lined up with the seasons.','earth'],
 ['The Moon borrows its shine','The Moon does not make its own light. The moonlight you see is sunlight reflected from its surface.','moon'],
 ['One familiar lunar face','The Moon spins once in the same time it takes to orbit Earth. That is why we always see nearly the same side.','moon'],
 ['The Moon is slowly drifting away','The Moon moves about 1.5 inches farther from Earth each year. That is roughly the width of a small building block!','moon'],
 ['Moon jumps would be enormous','The Moon’s surface gravity is about one-sixth of Earth’s. You would weigh less there, even though your mass would stay the same.','moon']
];
let lastDay='',manualDim=false,locked=false,wakeLock=null,weather=null,requestId=0,clockTimer=null,weatherTimer=null,lastShift=-1,restSkippedHour=-1;
function toast(message){$('toast').textContent=message;$('toast').hidden=false;clearTimeout(toast.timer);toast.timer=setTimeout(()=>$('toast').hidden=true,4500);}
function renderClockTime(now=new Date()){
 const reading=DeskWorlds.clock(now,{format24:prefs.format24}),timeText=reading.time;
 if($('time').dataset.value!==timeText){
  $('time').dataset.value=timeText;$('time').setAttribute('aria-label',timeText);
  $('time').replaceChildren(...[...timeText].map((digit,index)=>{const span=document.createElement('span');span.className='time-digit';span.dataset.digit=digit;span.dataset.index=index;span.setAttribute('aria-hidden','true');span.append(digit);const baseline=document.createElement('i');baseline.className='digit-baseline';span.append(baseline);return span;}));
 }
 $('seconds').textContent=String(now.getSeconds()).padStart(2,'0');$('period').textContent=reading.period;
 const calendar=`${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`;
 if($('date').dataset.calendar!==calendar){$('date').dataset.calendar=calendar;$('date').textContent=new Intl.DateTimeFormat('en-US',{weekday:'long',month:'long',day:'numeric',year:'numeric'}).format(now);}
}
function tick(){
 const now=new Date(),hours=now.getHours();renderClockTime(now);
 $('zone').textContent=new Intl.DateTimeFormat('en-US',{timeZoneName:'short'}).formatToParts(now).find(p=>p.type==='timeZoneName').value+' · DEVICE TIME';
 $('greeting').textContent=hours<12?'GOOD MORNING, EXPLORER':hours<18?'GOOD AFTERNOON, EXPLORER':'GOOD EVENING, EXPLORER';
 $('day-progress').style.width=`${(hours*60+now.getMinutes())/1440*100}%`;
 document.body.classList.toggle('dim',manualDim||(prefs.night&&(hours>=21||hours<7)));
 $('dim-button').setAttribute('aria-pressed',String(manualDim));
 const day=`${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`;
 if(day!==lastDay){lastDay=day;const index=Math.floor(Date.UTC(now.getFullYear(),now.getMonth(),now.getDate())/86400000)%facts.length;const [title,description,planet]=facts[index];$('fact-title').textContent=title;$('fact-text').textContent=description;$('fact-number').textContent=`${String(index+1).padStart(2,'0')} / ${facts.length}`;$('fact-source').href=`https://science.nasa.gov/${planet}/facts/`;}
 $('protection-status').textContent=prefs.care?'SCREEN CARE ON':'SCREEN CARE OFF';
 document.body.classList.toggle('low-power',prefs.lowPower);
 $('power-button').setAttribute('aria-pressed',String(prefs.lowPower));
 $('seconds').hidden=prefs.lowPower;
 const resting=prefs.care&&prefs.rest&&now.getMinutes()===59&&restSkippedHour!==Math.floor(now.getTime()/3600000)&&!$('settings').open;
 document.body.classList.toggle('screen-rest',resting);
 $('rest-overlay').hidden=!resting;
 if(resting)stopCandy();
 shift();
 window.DeskClimber?.sync();
 window.TimeMountain?.sync();
 window.WoodlandTime?.sync();
 window.WoodlandScene?.sync();
}
function shift(){
 const step=Math.floor(Date.now()/60000);if(step===lastShift)return;lastShift=step;
 const offsets=[[-10,-6],[0,8],[10,-4],[-6,8],[8,2],[0,-8]];
 stopCandy();if(prefs.theme==='candy')candyTimer=setTimeout(candyAdventure,9000);
 const [x,y]=offsets[step%offsets.length];
 const drift=['climber2','woodland'].includes(prefs.theme)&&innerWidth<600?.5:1;
 $('display').style.transform=prefs.care?`translate(${x*drift}px,${y*drift}px)`:'none';
 $('display').dataset.layout=prefs.care?String(Math.floor(step/10)%4):'0';
 document.body.classList.toggle('fact-focus',prefs.care&&Math.floor(step/5)%2===1);
 for(const [index,selector] of ['.clock-panel','.weather-panel','.fact-panel'].entries()){
  const [dx,dy]=offsets[(step+index*2)%offsets.length];
  document.querySelector(selector).style.transform=prefs.care?`translate(${dx/2*drift}px,${dy/2*drift}px)`:'none';
 }
}
function weatherInterval(){return prefs.lowPower?1800000:900000;}
function scheduleClock(){clearTimeout(clockTimer);if(document.visibilityState!=='visible')return;const interval=prefs.lowPower?60000:1000;clockTimer=setTimeout(()=>{tick();scheduleClock();},interval-Date.now()%interval+25);}
function scheduleWeather(){clearInterval(weatherTimer);weatherTimer=setInterval(()=>{if(document.visibilityState==='visible')refreshWeather();},weatherInterval());}
function updateMode(){lastShift=-1;tick();scheduleClock();scheduleWeather();}
function skipRest(){restSkippedHour=Math.floor(Date.now()/3600000);tick();}
$('rest-overlay').onclick=skipRest;
document.addEventListener('pointerdown',()=>{if(document.body.classList.contains('screen-rest'))skipRest();});
function condition(code){if(code===0)return ['☀','Clear skies'];if(code<=2)return ['☀','Partly cloudy'];if(code===3)return ['☁','Cloudy'];if([45,48].includes(code))return ['≋','Foggy'];if(code>=51&&code<=57)return ['☂','Drizzle'];if(code>=61&&code<=67)return ['☂','Rain'];if(code>=71&&code<=77)return ['❄','Snow'];if(code>=80&&code<=82)return ['☂','Rain showers'];if([85,86].includes(code))return ['❄','Snow showers'];if(code>=95)return ['ϟ','Thunderstorms'];return ['☁','Weather'];}
function renderWeather(stale=false){if(!weather)return;const c=weather.data.current,d=weather.data.daily;const [icon,description]=condition(c.weather_code);$('temperature').textContent=`${Math.round(c.temperature_2m)}°`;$('feels').textContent=`${Math.round(c.apparent_temperature)}°${prefs.unit==='fahrenheit'?'F':'C'}`;$('range').textContent=`${Math.round(d.temperature_2m_max[0])}° / ${Math.round(d.temperature_2m_min[0])}°`;$('weather-icon').textContent=icon;$('condition').textContent=description;$('weather-status').textContent=`${stale?'Offline · last update':'Updated'} ${new Date(weather.at).toLocaleTimeString('en-US',{hour:'numeric',minute:'2-digit'})} · ${prefs.unit==='fahrenheit'?'°F':'°C'}${stale?' · weather may be old':''}`;}
function cacheKey(){return `orbit-weather:${prefs.place.latitude}:${prefs.place.longitude}:${prefs.unit}`;}
async function refreshWeather(){
 const id=++requestId,key=cacheKey();$('location').textContent=prefs.place.name.toUpperCase();weather=read(key,null);
 if(weather?.data?.current&&weather?.data?.daily)renderWeather(true);else {weather=null;$('temperature').textContent='—°';$('feels').textContent='—';$('range').textContent='— / —';$('condition').textContent='Checking the skies…';$('weather-status').textContent='Connecting to Open-Meteo';}
 try{const query=new URLSearchParams({latitude:prefs.place.latitude,longitude:prefs.place.longitude,current:'temperature_2m,apparent_temperature,weather_code',daily:'temperature_2m_max,temperature_2m_min',temperature_unit:prefs.unit,timezone:'auto',forecast_days:'1'});const res=await fetchWithTimeout(`https://api.open-meteo.com/v1/forecast?${query}`,12000);if(!res.ok)throw Error('Weather unavailable');const data=await res.json();if(id!==requestId)return;if(!Number.isFinite(data.current?.temperature_2m)||!data.daily?.temperature_2m_max?.length)throw Error('Invalid weather response');weather={data,at:Date.now()};write(key,weather);renderWeather();}
 catch(error){if(id!==requestId)return;if(weather)renderWeather(true);else{$('condition').textContent='Weather is taking a break';$('weather-status').textContent=`No connection · automatic retry in ${prefs.lowPower?30:15} minutes`;}}
}
async function keepAwake(){if(typeof navigator.wakeLock?.request!=='function'){$('wake-status').textContent='USE DEVICE SLEEP SETTINGS';return;}try{if(wakeLock||document.visibilityState!=='visible')return;wakeLock=await navigator.wakeLock.request('screen');$('wake-status').textContent='DISPLAY AWAKE';wakeLock.addEventListener('release',()=>{wakeLock=null;$('wake-status').textContent='KEEP AWAKE PAUSED';});}catch{$('wake-status').textContent='USE DEVICE SLEEP SETTINGS';}}
$('settings-button').onclick=()=>{if(locked)return;$('unit').value=prefs.unit;$('format24').checked=prefs.format24;$('care').checked=prefs.care;$('night').checked=prefs.night;$('lowPower').checked=prefs.lowPower;$('rest').checked=prefs.rest;$('city').value=prefs.place.name;$('settings-status').textContent='Choose a result to update the weather location.';$('city-results').replaceChildren();$('settings').showModal();tick();};
$('close-settings').onclick=()=>$('settings').close();
$('settings-form').onsubmit=e=>{e.preventDefault();prefs.unit=$('unit').value;prefs.format24=$('format24').checked;prefs.care=$('care').checked;prefs.night=$('night').checked;prefs.lowPower=$('lowPower').checked;prefs.rest=$('rest').checked;write('orbit-settings',prefs);$('settings').close();updateMode();refreshWeather();};
$('power-button').onclick=()=>{if(locked)return;prefs.lowPower=!prefs.lowPower;write('orbit-settings',prefs);updateMode();toast(prefs.lowPower?'Low power on · minute updates · weather every 30 minutes':'Low power off · seconds restored');};
function setPlace(place){prefs.place=place;write('orbit-settings',prefs);$('city').value=place.name;$('city-results').replaceChildren();$('settings-status').textContent=`Weather location set to ${place.name}.`;refreshWeather();}
let searchSequence=0;
$('search-city').onclick=async()=>{const query=$('city').value.trim(),seq=++searchSequence;if(query.length<2){$('settings-status').textContent='Enter a city name or ZIP.';return;}$('settings-status').textContent='Searching…';$('city-results').replaceChildren();if(query==='30064'){setPlace(defaults.place);return;}try{const response=await fetchWithTimeout(`https://geocoding-api.open-meteo.com/v1/search?${new URLSearchParams({name:query,count:5,language:'en',format:'json'})}`,10000);if(!response.ok)throw Error();const data=await response.json();if(seq!==searchSequence)return;if(!data.results?.length){$('settings-status').textContent='No matches. Try a nearby city name.';return;}$('settings-status').textContent='Tap your city:';for(const result of data.results){const button=document.createElement('button');button.type='button';const name=[result.name,result.admin1,result.country].filter(Boolean).join(', ');button.textContent=name;button.onclick=()=>setPlace({name,latitude:result.latitude,longitude:result.longitude});$('city-results').append(button);}}catch{if(seq===searchSequence)$('settings-status').textContent='Search unavailable. Check your internet connection and try again.';}};
$('city').addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();$('search-city').click();}});
$('geolocate').onclick=()=>{if(!navigator.geolocation){$('settings-status').textContent='Location is unavailable. Search by city instead.';return;}$('settings-status').textContent='Waiting for location permission…';navigator.geolocation.getCurrentPosition(p=>setPlace({name:'Your current location',latitude:p.coords.latitude,longitude:p.coords.longitude}),()=>{$('settings-status').textContent='Location unavailable or permission declined. Search by city instead.';},{timeout:15000,maximumAge:300000});};
$('dim-button').onclick=()=>{if(locked)return;manualDim=!manualDim;tick();if(!manualDim&&prefs.night&&(new Date().getHours()>=21||new Date().getHours()<7))toast('Automatic night dimming is on. Turn it off in Settings for a brighter display.');};
$('fullscreen-button').onclick=async()=>{if(locked)return;try{if(document.fullscreenElement&&typeof document.exitFullscreen==='function')await document.exitFullscreen();else if(typeof document.documentElement.requestFullscreen==='function')await document.documentElement.requestFullscreen();else throw Error('Fullscreen unavailable');await keepAwake();}catch{toast('Use your browser’s full-screen menu; this page cannot enter full screen here.');}};
document.addEventListener('fullscreenchange',()=>{$('fullscreen-button').querySelector('span').textContent=document.fullscreenElement?'Exit full screen':'Full screen';});
function lock(){locked=true;document.body.classList.add('locked');$('lock-overlay').hidden=false;$('unlock-button').focus();toast('Touch lock on. Hold the unlock button for 2 seconds.');}
function unlock(){locked=false;document.body.classList.remove('locked');$('lock-overlay').hidden=true;cancelHold();$('lock-button').focus();toast('Touch lock off.');}
$('lock-button').onclick=lock;
let holdTimer=null;function startHold(){if(holdTimer||!locked)return;$('unlock-button').classList.add('holding');$('unlock-button').textContent='Keep holding…';holdTimer=setTimeout(unlock,2000);}function cancelHold(){clearTimeout(holdTimer);holdTimer=null;$('unlock-button').classList.remove('holding');$('unlock-button').textContent='◇ Hold 2 seconds to unlock';}
$('unlock-button').addEventListener('pointerdown',e=>{e.preventDefault();try{$('unlock-button').setPointerCapture?.(e.pointerId);}catch{}startHold();});
for(const event of ['pointerup','pointercancel','lostpointercapture'])$('unlock-button').addEventListener(event,cancelHold);
$('unlock-button').addEventListener('pointermove',e=>{const r=$('unlock-button').getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)cancelHold();});
$('unlock-button').addEventListener('keydown',e=>{if(e.key===' '||e.key==='Enter'){e.preventDefault();startHold();}});$('unlock-button').addEventListener('keyup',cancelHold);window.addEventListener('blur',cancelHold);
document.addEventListener('keydown',e=>{if(locked&&e.key==='Tab'){e.preventDefault();$('unlock-button').focus();}});
document.addEventListener('visibilitychange',()=>{cancelHold();scheduleClock();if(document.visibilityState==='visible'){tick();keepAwake();if(!weather||Date.now()-weather.at>weatherInterval())refreshWeather();}});window.addEventListener('online',()=>{if(document.visibilityState==='visible')refreshWeather();});



// Add future themes here; the Theme button cycles this registry.
const themes=[{id:'orbit',name:'Orbit',label:'Original Orbit'},{id:'candy',name:'Candy',label:'Candy Quest'},{id:'climber',name:'Climber',label:'Time Climber'},{id:'climber2',name:'Climber II',label:'Time Climber II'},{id:'woodland',name:'Woodland',label:'Woodland of Time'}];
let candyTimer=null,candyAnimation=null,candyTrip=0,candyNextVisit=0;
const candyMotion=typeof matchMedia==='function'?matchMedia('(prefers-reduced-motion: reduce)'):null;
function stopCandy(){clearTimeout(candyTimer);candyTimer=null;candyAnimation?.cancel();candyAnimation=null;$('candy-stage').hidden=true;}
function candyLanes(mini=false){
 $('candy-pal').style.width=mini?'28px':''; $('candy-pal').style.height=mini?'28px':'';
 const size=$('candy-pal').getBoundingClientRect().width||30,half=size/2,margin=5;
 const obstacles=[...document.querySelectorAll('.time-row,.date-row,#location,.weather-main,#condition,.weather-details,#weather-status,.fact-content .eyebrow,#fact-title,#fact-text,#fact-source,footer,.credit')]
  .filter(e=>e.getClientRects().length&&getComputedStyle(e).display!=='none').map(e=>e.getBoundingClientRect());
 const lanes=[];
 for(let y=half+2;y<=innerHeight-half-2;y+=6){
  const blocks=obstacles.filter(r=>y+half+margin>r.top&&y-half-margin<r.bottom).map(r=>[Math.max(half+2,r.left-half-margin),Math.min(innerWidth-half-2,r.right+half+margin)]).sort((a,b)=>a[0]-b[0]);
  let left=half+2;
  for(const [start,end] of [...blocks,[innerWidth-half-2,innerWidth]]){
   if(start-left>Math.max(70,innerWidth*.08))lanes.push({left,right:start,y,size});
   left=Math.max(left,end);
  }
 }
 if(!lanes.length&&!mini)return candyLanes(true);
 return lanes.sort((a,b)=>(b.right-b.left)-(a.right-a.left)).slice(0,12);
}
function candyAdventure(){
 stopCandy();
 if(prefs.theme!=='candy'||prefs.display.companion===false||document.visibilityState!=='visible')return;
 if(Date.now()<candyNextVisit){candyTimer=setTimeout(candyAdventure,candyNextVisit-Date.now());return;}
 candyTimer=setTimeout(candyAdventure,prefs.display.companionInterval*1000);
 if(document.body.classList.contains('screen-rest')||$('settings').open)return;
 // Temporarily expose the layer to measure the sprite; hide if no safe gap exists.
 $('candy-stage').hidden=false;
 const lanes=candyLanes();if(!lanes.length){$('candy-stage').hidden=true;return;}
 candyNextVisit=Date.now()+prefs.display.companionInterval*1000;
 const lane=lanes[candyTrip%lanes.length],action=['run','bike','work'][candyTrip%3],reverse=candyTrip%2===1;
 candyTrip++;const pal=$('candy-pal');pal.dataset.action=action;
 const start=(reverse?lane.right:lane.left)-lane.size/2,end=(reverse?lane.left:lane.right)-lane.size/2,y=lane.y-lane.size/2;
 const transform=x=>`translate(${x}px,${y}px) scaleX(${reverse?-1:1})`;
 pal.style.transform=transform(start);
 if(candyMotion?.matches||typeof pal.animate!=='function'){
  clearTimeout(candyTimer);
  candyTimer=setTimeout(()=>{$('candy-stage').hidden=true;candyTimer=setTimeout(candyAdventure,prefs.display.companionInterval*1000-2000);},2000);return;
 }
 const destination=action==='work'?start+(end-start)*.18:end;
 candyAnimation=pal.animate([{transform:transform(start),opacity:0},{transform:transform(start),opacity:.8,offset:.08},{transform:transform(destination),opacity:.8,offset:.9},{transform:transform(destination),opacity:0}],{duration:Math.min(prefs.display.companionDuration,action==='work'?8:20)*1000,easing:'ease-in-out',fill:'forwards'});
 candyAnimation.onfinish=()=>{$('candy-stage').hidden=true;};
}
function applyTheme(){
 candyNextVisit=0;
 if(!themes.some(t=>t.id===prefs.theme))prefs.theme='candy';
 const theme=themes.find(t=>t.id===prefs.theme);document.body.dataset.theme=theme.id;
 $('theme-button').querySelector('span').textContent=`Theme: ${theme.name}`;
 $('theme-button').setAttribute('aria-label',`Theme: ${theme.label}. Switch theme`);
 $('theme-button').title=`${theme.label} · tap for next theme`;
 write('orbit-settings',prefs);stopCandy();if(prefs.theme==='candy')candyTimer=setTimeout(candyAdventure,9000);
 document.title=`Our Desk Clock · ${theme.label}`;window.DeskClimber?.sync();window.TimeMountain?.refresh();window.WoodlandTime?.refresh();window.WoodlandScene?.refresh();
}
$('theme-button').onclick=()=>{if(locked)return;const index=themes.findIndex(t=>t.id===prefs.theme);prefs.theme=themes[(index+1)%themes.length].id;applyTheme();toast(`${themes.find(t=>t.id===prefs.theme).label} theme`);};
window.addEventListener('resize',()=>{stopCandy();candyTimer=setTimeout(candyAdventure,400);});
document.addEventListener('visibilitychange',()=>{stopCandy();if(document.visibilityState==='visible'&&prefs.theme==='candy')candyTimer=setTimeout(candyAdventure,9000);});
$('settings-button').addEventListener('click',stopCandy);
$('settings').addEventListener('close',()=>{stopCandy();if(prefs.theme==='candy')candyTimer=setTimeout(candyAdventure,9000);});
candyMotion?.addEventListener?.('change',candyAdventure);
applyTheme();

updateMode();refreshWeather();keepAwake();
