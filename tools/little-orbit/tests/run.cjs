const {spawn,spawnSync}=require('node:child_process');
const path=require('node:path');
const root=path.join(__dirname,'..');
if(spawnSync(process.execPath,[path.join(__dirname,'characters.cjs')],{stdio:'inherit'}).status!==0)process.exit(1);
if(spawnSync(process.execPath,[path.join(__dirname,'worlds.cjs')],{stdio:'inherit'}).status!==0)process.exit(1);
if(spawnSync(process.execPath,[path.join(__dirname,'organic-contacts.cjs')],{stdio:'inherit'}).status!==0)process.exit(1);
if(spawnSync(process.execPath,[path.join(__dirname,'organic-timing.cjs')],{stdio:'inherit'}).status!==0)process.exit(1);
if(spawnSync(process.execPath,[path.join(root,'build-portable.cjs')],{stdio:'inherit'}).status!==0)process.exit(1);
const server=spawn(process.execPath,[path.join(root,'server.cjs')],{env:{...process.env,PORT:'0'},stdio:['ignore','pipe','inherit']});
let started=false;
const timeout=setTimeout(()=>{console.error('Test server did not start.');server.kill();process.exitCode=1;},10000);
server.stdout.on('data',data=>{
 const match=data.toString().match(/http:\/\/127\.0\.0\.1:\d+/);if(started||!match)return;
 started=true;clearTimeout(timeout);
 try{
  for(const engine of (process.env.CLOCK_TEST_BROWSER?[process.env.CLOCK_TEST_BROWSER]:['chromium','firefox'])){
   for(const script of ['verify.cjs','verify-themes.cjs','verify-config.cjs','verify-climber.cjs','verify-mountain.cjs','verify-characters.cjs','verify-woodland.cjs','verify-motion.cjs']){
    console.log(`\n${engine}: ${script}`);
    const result=spawnSync(process.execPath,[path.join(__dirname,script)],{env:{...process.env,CLOCK_TEST_URL:match[0],CLOCK_TEST_BROWSER:engine},stdio:'inherit'});
    if(result.status!==0)throw Error(`${engine} ${script} failed`);
   }
  }
  const portable=spawnSync(process.execPath,[path.join(__dirname,'verify-portable.cjs')],{env:process.env,stdio:'inherit'});
  if(portable.status!==0)throw Error('Portable checks failed');
 }catch(error){console.error(error.message);process.exitCode=1;}finally{server.kill();}
});
server.on('error',error=>{clearTimeout(timeout);console.error(error.message);process.exitCode=1;});
server.on('exit',code=>{clearTimeout(timeout);if(!started&&code!==0)process.exitCode=1;});
