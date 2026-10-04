// SPDX-License-Identifier: GPL-3.0-only
// Copyright (C) 2026 ilamgumaran and contributors
// Packaging only: the generated clock itself needs no Node runtime.
const fs=require('node:fs');
const path=require('node:path');
const root=__dirname;
const css=fs.readFileSync(path.join(root,'style.css'),'utf8');
const js=fs.readFileSync(path.join(root,'app.js'),'utf8');
const display=fs.readFileSync(path.join(root,'display-settings.js'),'utf8');
const config=fs.readFileSync(path.join(root,'config.js'),'utf8');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8')
 .replace('<link rel="stylesheet" href="style.css">',`<style>\n${css}\n</style>`)
 .replace('<script src="config.js"></script>',`<script>\n${config.replace(/<\/script/gi,'<\\/script')}\n</script>`)
 .replace('<script src="app.js"></script>',`<script>\n${js.replace(/<\/script/gi,'<\\/script')}\n</script>`);
const portable=html.replace('<script src="display-settings.js"></script>',`<script>\n${display.replace(/<\/script/gi,'<\\/script')}\n</script>`);
fs.writeFileSync(path.join(root,'Little Orbit.html'),portable);
console.log('Built portable Little Orbit.html (no installation, runtime, or external fonts).');
