// SPDX-License-Identifier: LicenseRef-Simpli-Noncommercial-1.0
// Copyright (C) 2026 ilamgumaran and contributors
// Packaging only: the generated clock itself needs no Node runtime.
const fs=require('node:fs');
const path=require('node:path');
const root=__dirname;
const license=fs.readFileSync(path.join(root,'LICENSE'),'utf8');
if(license.includes('--'))throw Error('License text cannot contain HTML comment delimiters.');
const css=fs.readFileSync(path.join(root,'style.css'),'utf8');
const js=fs.readFileSync(path.join(root,'app.js'),'utf8');
const display=fs.readFileSync(path.join(root,'display-settings.js'),'utf8');
const characters=fs.readFileSync(path.join(root,'characters.js'),'utf8');
const config=fs.readFileSync(path.join(root,'config.js'),'utf8');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8')
 .replace('<head>',`<!-- Full project license follows; keep it with this portable file.\n${license}\n-->\n<head>`)
 .replace('<link rel="stylesheet" href="style.css">',`<style>\n${css}\n</style>`)
 .replace('<script src="config.js"></script>',`<script>\n${config.replace(/<\/script/gi,'<\\/script')}\n</script>`)
 .replace('<script src="characters.js"></script>',`<script>\n${characters.replace(/<\/script/gi,'<\\/script')}\n</script>`)
 .replace('<script src="app.js"></script>',`<script>\n${js.replace(/<\/script/gi,'<\\/script')}\n</script>`);
const climber=fs.readFileSync(path.join(root,'time-climber.js'),'utf8');
const portable=html.replace('<script src="display-settings.js"></script>',`<script>\n${display.replace(/<\/script/gi,'<\\/script')}\n</script>`).replace('<script src="time-climber.js"></script>',`<script>\n${climber.replace(/<\/script/gi,'<\\/script')}\n</script>`);
const mountain=fs.readFileSync(path.join(root,'time-climber-ii.js'),'utf8');
const complete=portable.replace('<script src="time-climber-ii.js"></script>',`<script>\n${mountain.replace(/<\/script/gi,'<\\/script')}\n</script>`);
let living=complete;
for(const file of ['world-layers.js','woodland-time.js']){const source=fs.readFileSync(path.join(root,file),'utf8');living=living.replace(`<script src="${file}"></script>`,`<script>\n${source.replace(/<\/script/gi,'<\\/script')}\n</script>`);}
fs.writeFileSync(path.join(root,'Little Orbit.html'),living);
console.log('Built portable Little Orbit.html (no installation, runtime, or external fonts).');
