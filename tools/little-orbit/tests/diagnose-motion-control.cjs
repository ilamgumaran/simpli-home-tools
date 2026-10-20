// SPDX-License-Identifier: LicenseRef-Simpli-Noncommercial-1.0
// Copyright (C) 2026 ilamgumaran and contributors
'use strict';

const {spawn}=require('node:child_process');
const path=require('node:path');
const {chromium,firefox}=require('playwright');
const root=path.join(__dirname,'..');

async function startServer(){
 const server=spawn(process.execPath,[path.join(root,'server.cjs')],{cwd:root,env:{...process.env,PORT:'0'},stdio:['ignore','pipe','inherit']});
 let output='',failure=null,stopping=false,closed=false;
 const closePromise=new Promise(resolve=>server.once('close',()=>{closed=true;resolve();}));
 server.on('error',error=>{failure=error;});
 server.on('exit',(code,signal)=>{if(!stopping&&(code!==0||signal))failure=new Error(`Diagnostic server exited (${code??signal})`);});
 let address;
 try{
  address=await new Promise((resolve,reject)=>{
   const timeout=setTimeout(()=>reject(new Error('Diagnostic server did not start within 10 seconds')),10000);
   let settled=false;
   const finish=(error,value)=>{if(settled)return;settled=true;clearTimeout(timeout);error?reject(error):resolve(value);};
   server.stdout.on('data',chunk=>{
    const text=chunk.toString();process.stdout.write(text);output+=text;
    const match=output.match(/http:\/\/127\.0\.0\.1:\d+/);
    if(match)finish(null,match[0]);
   });
   server.once('error',error=>finish(error));
   server.once('exit',(code,signal)=>{if(!settled)finish(failure||new Error(`Diagnostic server exited before startup (${code??signal})`));});
  });
 }catch(error){
  stopping=true;if(server.pid&&server.exitCode===null&&server.signalCode===null)server.kill();await closePromise;throw failure||error;
 }
 return {server,address,stop:async()=>{
  stopping=true;
  if(!closed){if(server.pid&&server.exitCode===null&&server.signalCode===null)server.kill();await closePromise;}
  if(failure)throw failure;
 }};
}

async function runCase(engine,browserName,name,url,mode){
 const context=await engine.newContext({viewport:{width:854,height:480},deviceScaleFactor:1,timezoneId:'America/New_York'});
 const page=await context.newPage(),errors=[];
 page.on('pageerror',error=>errors.push(error.message));
 try{
  await page.route('https://**',request=>request.abort());
  if(mode==='blank'){
   await page.setContent('<!doctype html><html><head><title>RAF control</title></head><body></body></html>');
  }else{
   await page.addInitScript(()=>{
    const NativeDate=Date,start=performance.now(),base=+new NativeDate('2026-10-05T10:00:09-04:00');
    window.Date=class extends NativeDate{
     constructor(...args){super(...(args.length?args:[base+performance.now()-start]));}
     static now(){return base+performance.now()-start;}
    };
    localStorage.setItem('orbit-settings',JSON.stringify({theme:'woodland',care:false,rest:false,night:false,lowPower:true,display:{woodlandView:'dashboard',companionInterval:60,companionDuration:20}}));
   });
   const response=await page.goto(url);
   if(!response||response.status()!==200)throw new Error(`${browserName} ${name} page load failed: ${response?.status()??'no response'}`);
   if(mode==='static-hidden')await page.evaluate(()=>{
    for(const id of ['woodland-background','woodland-details','woodland-numerals','woodland-sky','woodland-ground','woodland-creek','woodland-light']){
     const element=document.getElementById(id);if(!element)throw new Error(`Missing diagnostic layer #${id}`);element.style.visibility='hidden';
    }
   });
   if(mode==='world-hidden')await page.evaluate(()=>{
    const world=document.getElementById('woodland-world');if(!world)throw new Error('Missing #woodland-world');world.style.visibility='hidden';
   });
  }
  await page.evaluate(()=>document.fonts?.ready);
  await page.waitForTimeout(1000);

  const result=await page.evaluate(async sceneMode=>{
   const round=value=>Number.isFinite(value)?Math.round(value*100)/100:null;
   const summarize=values=>{
    const sorted=values.slice().sort((a,b)=>a-b);
    return {p95:round(sorted[Math.floor(sorted.length*.95)]),max:round(sorted.at(-1))};
   };
   const gaps=values=>values.slice(1).map((value,index)=>value-values[index]);
   const geometry=[];let observer=null;
   if(sceneMode!=='blank'){
    const root=document.querySelector('#woodland-cast > g');
    if(!root)throw new Error('Woodland actor root unavailable');
    const leg=root.querySelector('[data-part="leg-left"]');
    if(!leg)throw new Error('Woodland actor leg unavailable');
    let previous='';
    observer=new MutationObserver(()=>{
     const state=root.getAttribute('transform')+(leg.getAttribute('d')||'');
     if(state!==previous){previous=state;geometry.push(performance.now());}
    });
    observer.observe(root,{subtree:true,attributes:true,attributeFilter:['d','transform']});
   }
   const callbacks=[];let frame;
   const sample=timestamp=>{callbacks.push([timestamp,performance.now()]);frame=requestAnimationFrame(sample);};
   frame=requestAnimationFrame(sample);
   const start=performance.now();await new Promise(resolve=>setTimeout(resolve,2100));
   if(observer)observer.disconnect();cancelAnimationFrame(frame);
   const elapsed=performance.now()-start,nominal=gaps(callbacks.map(entry=>entry[0])),actual=gaps(callbacks.map(entry=>entry[1]));
   const callback={count:callbacks.length,fps:round(callbacks.length*1000/elapsed),nominalGaps:summarize(nominal),actualStartGaps:summarize(actual)};
   const painted=geometry.length>0?{count:geometry.length,fps:round(geometry.length*1000/elapsed),gaps:summarize(gaps(geometry))}:null;
   return {durationMs:round(elapsed),callback,geometry:painted};
  },mode);
  if(errors.length)throw new Error(`${browserName} ${name} page errors: ${errors.join(' | ')}`);
  const channel=browserName==='chromium'?(process.env.CLOCK_TEST_CHANNEL||'default'):'default';
  const headless=process.env.CLOCK_DIAGNOSTIC_HEADLESS!=='false';
  const record={platform:process.platform,architecture:process.arch,browser:browserName,browserVersion:engine.version(),channel,headless,case:name,...result};
  const json=JSON.stringify(record);
  if(json.length>2800)throw new Error(`${browserName} ${name} diagnostic exceeded annotation limit`);
  console.log(json);
  const escaped=json.replace(/%/g,'%25').replace(/\r/g,'%0D').replace(/\n/g,'%0A');
  if(escaped.length>=3000)throw new Error(`${browserName} ${name} annotation exceeded GitHub's limit`);
  console.log(`::notice title=Motion control::${escaped}`);
 }finally{await context.close();}
}

(async()=>{
 const server=await startServer();
 try{
  for(const [name,engine] of [['chromium',chromium],['firefox',firefox]]){
   const options={headless:process.env.CLOCK_DIAGNOSTIC_HEADLESS!=='false'};
   if(name==='chromium'&&process.env.CLOCK_TEST_CHANNEL)options.channel=process.env.CLOCK_TEST_CHANNEL;
   const browser=await engine.launch(options);
   try{
    for(const [label,mode] of [['blank','blank'],['dashboard','full'],['dashboard-static-art-hidden','static-hidden'],['dashboard-world-hidden','world-hidden']]){
     // Hiding art diagnoses raster load only; it does not replace the production motion gates.
     await runCase(browser,name,label,server.address,mode);
    }
   }finally{await browser.close();}
  }
 }finally{await server.stop();}
})().catch(error=>{
 console.error(error);
 const details=(error?.stack||String(error)).replace(/%/g,'%25').replace(/\r/g,'%0D').replace(/\n/g,'%0A');
 console.log(`::error title=Motion diagnostic failure::${details.slice(0,2800)}`);
 process.exitCode=1;
});
