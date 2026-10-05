const fs=require('node:fs'),path=require('node:path');
const playwright=require(process.env.PLAYWRIGHT_MODULE||'playwright');
fs.mkdirSync(path.join(__dirname,'../test-results'),{recursive:true});
process.chdir(path.join(__dirname,'../test-results'));
const browserName=process.env.CLOCK_TEST_BROWSER||'chromium';
const channelOptions=process.env.CLOCK_TEST_CHANNEL?{channel:process.env.CLOCK_TEST_CHANNEL}:{};
module.exports={...playwright,engine:browserName==='firefox'?playwright.firefox:playwright.chromium,options:browserName==='firefox'?{}:channelOptions,channelOptions,url:process.env.CLOCK_TEST_URL||'http://127.0.0.1:4173'};
