// SPDX-License-Identifier: LicenseRef-Simpli-Noncommercial-1.0
// Device-independent sizing: browser viewport pixels already include OS scaling.
const displayProfiles={
 auto:{clockScale:1,weatherScale:1,factScale:1,gap:8},
 handheld:{clockScale:1,weatherScale:1,factScale:1,gap:8},
 desktop:{clockScale:1,weatherScale:1.05,factScale:1.05,gap:10},
 tablet:{clockScale:.9,weatherScale:.95,factScale:.95,gap:8}
};
function displayNumber(value,fallback,min,max){return Number.isFinite(Number(value))?Math.max(min,Math.min(max,Number(value))):fallback;}
function normalizeDisplay(value){
 const d={...defaults.display,...value};
 return {profile:Object.hasOwn(displayProfiles,d.profile)?d.profile:'auto',
  clockScale:displayNumber(d.clockScale,1,.65,1.2),
  weatherScale:displayNumber(d.weatherScale,1,.65,1.2),
  factScale:displayNumber(d.factScale,1,.65,1.2),
  gap:displayNumber(d.gap,8,4,24),
  companionInterval:displayNumber(d.companionInterval,60,30,300),
  companionDuration:displayNumber(d.companionDuration,12,4,20),
  companion:d.companion!==false,cameraMotion:d.cameraMotion==='still'?'still':'gentle',woodlandView:d.woodlandView==='dashboard'?'dashboard':'immersive'};
}
function applyDisplay(){
 prefs.display=normalizeDisplay(prefs.display);
 for(const [key,property] of [['clockScale','--clock-scale'],['weatherScale','--weather-scale'],['factScale','--fact-scale'],['gap','--panel-gap']]){
  document.documentElement.style.setProperty(property,prefs.display[key]+(key==='gap'?'px':''));
 }
 document.body.dataset.profile=prefs.display.profile;
 write('orbit-settings',prefs);
 document.dispatchEvent(new Event('desk-display-change',{bubbles:true}));
}
function fillDisplaySettings(d=prefs.display){
 $('display-profile').value=d.profile;
 for(const key of ['clockScale','weatherScale','factScale','gap','companionInterval','companionDuration']){
  $(key).value=d[key];updateDisplayLabel(key);
 }
 $('companion').checked=d.companion;
 $('camera-motion').value=d.cameraMotion;
 $('woodland-view').value=d.woodlandView;
 $('viewport-info').textContent=`Browser viewport: ${innerWidth} × ${innerHeight} · pixel ratio ${window.devicePixelRatio||1}. Size presets follow your browser window; OS scaling is already included.`;
}
function updateDisplayLabel(key){$(key+'-value').textContent=['clockScale','weatherScale','factScale'].includes(key)?`${Math.round(Number($(key).value)*100)}%`:`${$(key).value}${key==='gap'?' px':' s'}`;}
function saveDisplaySettings(){
 prefs.display=normalizeDisplay({profile:$('display-profile').value,...Object.fromEntries(['clockScale','weatherScale','factScale','gap','companionInterval','companionDuration'].map(key=>[key,Number($(key).value)])),companion:$('companion').checked,cameraMotion:$('camera-motion').value,woodlandView:$('woodland-view').value});
 applyDisplay();
}
for(const key of ['clockScale','weatherScale','factScale','gap','companionInterval','companionDuration'])$(key).addEventListener('input',()=>updateDisplayLabel(key));
$('display-profile').onchange=()=>fillDisplaySettings({...prefs.display,...displayProfiles[$('display-profile').value],profile:$('display-profile').value});
$('reset-display').onclick=()=>fillDisplaySettings(normalizeDisplay(defaults.display));
$('settings-button').addEventListener('click',()=>fillDisplaySettings());
$('settings-form').addEventListener('submit',saveDisplaySettings);
applyDisplay();
