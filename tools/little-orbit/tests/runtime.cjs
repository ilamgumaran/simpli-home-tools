const fs=require('node:fs'),path=require('node:path');
const playwright=require(process.env.PLAYWRIGHT_MODULE||'playwright');
fs.mkdirSync(path.join(__dirname,'../test-results'),{recursive:true});
process.chdir(path.join(__dirname,'../test-results'));
const browserName=process.env.CLOCK_TEST_BROWSER||'chromium';
const channelOptions=process.env.CLOCK_TEST_CHANNEL?{channel:process.env.CLOCK_TEST_CHANNEL}:{};
// Pause at the intended instant without racing a running clock at its install time.
const freezeClock=async(page,time)=>{const target=new Date(time);await page.clock.install({time:new Date(+target-1000)});await page.clock.pauseAt(target);};
module.exports={freezeClock,...playwright,engine:browserName==='firefox'?playwright.firefox:playwright.chromium,options:browserName==='firefox'?{}:channelOptions,channelOptions,url:process.env.CLOCK_TEST_URL||'http://127.0.0.1:4173'};
