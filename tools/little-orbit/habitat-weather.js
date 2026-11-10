// SPDX-License-Identifier: LicenseRef-Simpli-Noncommercial-1.0
// Copyright (C) 2026 ilamgumaran and contributors
'use strict';
(() => {
 const validCodes=new Set([0,1,2,3,45,48,51,53,55,56,57,61,63,65,66,67,71,73,75,77,80,81,82,85,86,95,96,99]);
 const units=Object.freeze({fahrenheit:{symbol:'°F',toC:n=>(n-32)*5/9},celsius:{symbol:'°C',toC:n=>n}});
 function describe(code){
  if(code===0)return ['clear','none'];
  if(code===1||code===2)return ['partly-cloudy','none'];
  if(code===3)return ['cloudy','none'];
  if(code===45||code===48)return ['fog','none'];
  if([51,53,55,56,57].includes(code))return ['drizzle','rain'];
  if([61,63,65,66,67,80,81,82].includes(code))return ['rain','rain'];
  if([71,73,75,77,85,86].includes(code))return ['snow','snow'];
  if([95,96,99].includes(code))return ['storm','rain'];
  return ['unknown','none'];
 }
 function publish(input={}){
  const validUnit=Object.hasOwn(units,input.unit),unit=validUnit?input.unit:'celsius',value=input.current?.temperature_2m;
  const temperature=validUnit&&Number.isFinite(value)?value:null,code=Number.isInteger(input.current?.weather_code)&&validCodes.has(input.current.weather_code)?input.current.weather_code:null;
  const [kind,precipitation]=describe(code),place=Object.freeze({name:typeof input.place?.name==='string'?input.place.name:'',latitude:Number.isFinite(input.place?.latitude)?input.place.latitude:null,longitude:Number.isFinite(input.place?.longitude)?input.place.longitude:null});
  const at=Number.isFinite(input.at)?input.at:null;
  state=Object.freeze({revision:state.revision+1,status:['live','cached','loading','unavailable'].includes(input.status)?input.status:'unavailable',available:temperature!==null,temperature,temperatureC:temperature===null?null:units[unit].toC(temperature),unit,unitSymbol:units[unit].symbol,label:temperature===null?`— ${units[unit].symbol}`:`${Math.round(temperature)} ${units[unit].symbol}`,code,kind,precipitation,at,place});
  window.dispatchEvent(new Event('desk-weather-change'));return state;
 }
 let state=Object.freeze({revision:0,status:'unavailable',available:false,temperature:null,temperatureC:null,unit:'celsius',unitSymbol:'°C',label:'— °C',code:null,kind:'unknown',precipitation:'none',at:null,place:Object.freeze({name:'',latitude:null,longitude:null})});
 function appearance(snapshot=state,{night=false}={}){
  const c=snapshot?.available&&Number.isFinite(snapshot.temperatureC)?snapshot.temperatureC:null;
  const known=!!snapshot?.available&&c!==null,precipitation=['rain','snow'].includes(snapshot?.precipitation)?snapshot.precipitation:'none';
  const warmth=known?Math.max(0,Math.min(1,(c+10)/45)):0;
  const cloud={clear:0,'partly-cloudy':.24,cloudy:.68,fog:.82,drizzle:.45,rain:.7,snow:.58,storm:.88,unknown:0}[snapshot?.kind]??0;
  const active=known&&snapshot?.kind!=='unknown',clear=active&&snapshot.kind==='clear',partly=active&&snapshot.kind==='partly-cloudy';
  const sunOpacity=(clear||partly)&&!night?Math.max(0,Math.min(1,(.22+warmth*.58)*(clear?1:.6))):0;
  const rainIntensity=known&&precipitation==='rain'?Math.max(.12,Math.min(1,({drizzle:.22,rain:.62,storm:.9}[snapshot.kind]??.4))):0;
  const neutral=active&&['partly-cloudy','cloudy','fog','drizzle','rain','snow','storm'].includes(snapshot.kind);
  const tintOpacity=active&&!neutral?Math.min(.18,Math.max(0,warmth>.58?(.18*warmth):(.16*(1-warmth)))):0;
  return Object.freeze({warmth,tintColor:warmth>.58?'#f5a64b':'#8fc8e8',tintOpacity,cloudOpacity:active?cloud:0,sunOpacity,precipitation:known?precipitation:'none',rainIntensity,dialFill:known?Math.max(0,Math.min(1,(c+20)/70)):0});
 }
 window.DeskHabitatWeather=Object.freeze({publish,get:()=>state,appearance});
})();
