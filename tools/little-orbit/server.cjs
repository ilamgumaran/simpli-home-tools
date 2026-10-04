// SPDX-License-Identifier: LicenseRef-Simpli-Noncommercial-1.0
// Copyright (C) 2026 ilamgumaran and contributors
const http=require('node:http');
const fs=require('node:fs');
const path=require('node:path');
const files={'/':['index.html','text/html; charset=utf-8'],'/index.html':['index.html','text/html; charset=utf-8'],'/app.js':['app.js','text/javascript; charset=utf-8'],'/config.js':['config.js','text/javascript; charset=utf-8'],'/display-settings.js':['display-settings.js','text/javascript; charset=utf-8'],'/time-climber.js':['time-climber.js','text/javascript; charset=utf-8'],'/LICENSE':['LICENSE','text/plain; charset=utf-8'],'/style.css':['style.css','text/css; charset=utf-8']};
const server=http.createServer((req,res)=>{const route=files[new URL(req.url,'http://localhost').pathname];if(!route){res.writeHead(404);res.end('Not found');return;}fs.readFile(path.join(__dirname,route[0]),(err,data)=>{if(err){res.writeHead(500);res.end('Unable to read file');return;}res.writeHead(200,{'Content-Type':route[1],'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(data);});});
const port=process.env.PORT===undefined?4173:Number(process.env.PORT);
if(!Number.isInteger(port)||port<0||port>65535)throw Error('PORT must be an integer between 0 and 65535.');
server.listen(port,'127.0.0.1',()=>console.log(`Little Orbit ready at http://127.0.0.1:${server.address().port}`));
server.on('error',err=>{console.error(err.message);process.exitCode=1;});
