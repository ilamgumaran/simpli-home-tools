// SPDX-License-Identifier: LicenseRef-Simpli-Noncommercial-1.0
// Copyright (C) 2026 ilamgumaran and contributors
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');

const events=[];
const context={Event:class Event{constructor(type){this.type=type;}},window:{dispatchEvent:event=>events.push(event.type)}};
vm.runInNewContext(fs.readFileSync(path.join(__dirname,'..','habitat-weather.js'),'utf8'),context,{filename:'habitat-weather.js'});
const bridge=context.window.DeskHabitatWeather;
assert.deepEqual(Object.keys(bridge).sort(),['appearance','get','publish']);
const initial=bridge.get();
assert.equal(initial.available,false);

const source={current:{temperature_2m:68,weather_code:0},unit:'fahrenheit',at:1728120000000,place:{name:'Test camp',latitude:35,longitude:-82},status:'live'};
const clear=bridge.publish(source);
assert.equal(clear.revision,initial.revision+1);
assert.equal(clear.status,'live');
assert.equal(clear.temperature,68);
assert.ok(Math.abs(clear.temperatureC-20)<1e-9);
assert.equal(clear.unitSymbol,'°F');
assert.equal(clear.kind,'clear');
assert.equal(clear.precipitation,'none');
assert.equal(clear.place.name,'Test camp');
assert.ok(Object.isFrozen(clear)&&Object.isFrozen(clear.place));
source.current.temperature_2m=200;source.place.name='Changed input';
assert.equal(bridge.get().temperature,68);
assert.equal(bridge.get().place.name,'Test camp');
assert.equal(events.at(-1),'desk-weather-change');
assert.ok(bridge.appearance(clear,{night:false}).sunOpacity>0);
assert.equal(bridge.appearance(clear,{night:true}).sunOpacity,0);

const celsius=bridge.publish({...source,current:{temperature_2m:20,weather_code:0},unit:'celsius'});
assert.equal(celsius.temperatureC,clear.temperatureC);
assert.equal(celsius.unitSymbol,'°C');
assert.deepEqual(Object.fromEntries(Object.entries(bridge.appearance(celsius)).filter(([key])=>key!=='dialFill')),Object.fromEntries(Object.entries(bridge.appearance(clear)).filter(([key])=>key!=='dialFill')));
assert.equal(bridge.appearance(celsius).dialFill,bridge.appearance(clear).dialFill);

for(const [kind,precipitation,codes] of [
 ['clear','none',[0]],['partly-cloudy','none',[1,2]],['cloudy','none',[3]],['fog','none',[45,48]],
 ['drizzle','rain',[51,53,55,56,57]],['rain','rain',[61,63,65,66,67,80,81,82]],
 ['snow','snow',[71,73,75,77,85,86]],['storm','rain',[95,96,99]]
])for(const code of codes){
 const snapshot=bridge.publish({...source,current:{temperature_2m:20,weather_code:code},unit:'celsius'});
 assert.equal(snapshot.kind,kind,`WMO ${code}`);
 assert.equal(snapshot.precipitation,precipitation,`WMO ${code}`);
 assert.equal(bridge.appearance(snapshot).precipitation,precipitation,`WMO ${code}`);
}
for(const code of [-1,4,47,999,'65',null,undefined,NaN]){
 const snapshot=bridge.publish({...source,current:{temperature_2m:20,weather_code:code},unit:'celsius'});
 assert.equal(snapshot.kind,'unknown',`Invalid WMO ${code}`);
 assert.equal(bridge.appearance(snapshot).precipitation,'none');
 assert.equal(bridge.appearance(snapshot).sunOpacity,0);
}
for(const value of [undefined,null,NaN,Infinity,-Infinity,'20']){
 const snapshot=bridge.publish({...source,current:{temperature_2m:value,weather_code:65},unit:'celsius'});
 assert.equal(snapshot.available,false,`Invalid temperature ${value}`);
 assert.equal(snapshot.temperatureC,null);
 assert.equal(bridge.appearance(snapshot).precipitation,'none');
}
const invalidUnit=bridge.publish({...source,current:{temperature_2m:68,weather_code:0},unit:'kelvin'});
assert.equal(invalidUnit.available,false,'Invalid unit must not be interpreted as Celsius');
assert.equal(invalidUnit.temperatureC,null);
for(const unit of ['toString','constructor','__proto__'])assert.equal(bridge.publish({...source,current:{temperature_2m:68,weather_code:0},unit}).available,false,`Inherited unit ${unit}`);
assert.equal(bridge.publish({...source,at:Infinity,unit:'celsius'}).at,null);
const unknown=bridge.publish({...source,current:{temperature_2m:20,weather_code:999},unit:'celsius'});
assert.equal(unknown.available,true,'Valid temperature should remain visible with unknown condition');
assert.equal(bridge.appearance(unknown).sunOpacity,0);
assert.equal(bridge.appearance(unknown).cloudOpacity,0);
for(const [temp,fill] of [[-80,0],[80,1]]){
 const snapshot=bridge.publish({...source,current:{temperature_2m:temp,weather_code:65},unit:'celsius'});
 assert.equal(snapshot.temperature,temp,'Observed value must remain unclamped');
 assert.equal(bridge.appearance(snapshot).dialFill,fill,'Only the dial clamps to its visual range');
}
assert.equal(events.length,bridge.get().revision);
console.log('PASS habitat weather: immutable event snapshots, WMO groups, C/F equivalence, invalid data and visual scale limits.');
