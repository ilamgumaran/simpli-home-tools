# Our Desk Clock — portable browser clock

Open **Little Orbit.html** in your preferred browser. It contains the whole clock, styling, and daily facts in one file. No installation, extension, account, Node, or OS script is needed to display it. You can copy this file to another device.

The page uses standard HTML, CSS, and JavaScript for current Edge, Chrome, Firefox, and Vanadium. Desktop browsers run on Windows, macOS, and Linux; Vanadium is the Chromium-based browser for GrapheneOS on Android. Browsers and OSes may restrict individual features; the clock remains usable when wake lock, storage, location, or fullscreen is unavailable.

## Display controls

Tap **Full screen** on the page. Browsers require a tap/click to enter full screen; if unavailable, use the browser's full-screen menu. **Esc** typically leaves desktop full screen. **Touch lock** blocks accidental interaction with this page; hold its unlock button for two seconds. On touch devices, the unlock button supports a finger hold.

**Low power** enables the near-black theme, hidden seconds, minute clock updates, and weather every 30 minutes. Screen care provides brief 8-second glides once per minute, larger facts and a smaller clock every five minutes, swapped panel positions every ten minutes, night dimming, and optional one-minute black-screen breaks at :59 each hour. Tap during a break to wake. Reduced-motion preferences remove the gliding transitions.

## Weather and offline use

Weather defaults to Marietta, GA, ZIP 30064, in Fahrenheit. Weather and city search require internet access to Open-Meteo. The clock and 24 daily facts work offline. Cached weather is clearly marked with its last update if the connection fails. Fonts are provided by your device; there are no external font downloads.

Some browsers restrict network requests or persistent storage on local `file:` pages. If weather, saving, location, or staying awake is unavailable, serve the regular **index.html**, **style.css**, **config.js**, **app.js**, and **display-settings.js**, and **time-climber.js** files through HTTPS hosting or a local HTTP server. No build step is needed for hosting; the portable HTML can also be hosted directly. All asset links are relative, so subdirectory hosting works.

For a local preview on Windows, macOS, or Linux, if Node is already installed, run `node server.cjs` from the folder and open **http://127.0.0.1:4173** in any browser. Alternatively, with Python installed, run `python -m http.server 4173 --bind 127.0.0.1` (or `python3` on macOS/Linux). These optional servers only deliver the files; the display logic stays entirely in the browser. `127.0.0.1` refers to the device running the server, not another computer. Use HTTPS hosting for access from other devices.

## Continuous use

The app requests a browser screen wake lock when available and retries when the page becomes visible. If the footer says **USE DEVICE SLEEP SETTINGS**, configure sleep in the device settings for continuous display. Brightness, CPU limits, charging limits, startup after reboot, and physical screen power cannot be set by an ordinary browser page. Black-screen breaks draw a black page; they do not switch off the backlight. Settings are stored per browser and origin when permitted; private sessions may discard them. Screen care cannot guarantee against display wear.

The separate Windows/Ally launchers and power scripts are optional helpers and are not needed on other systems. No operating-system settings are changed by opening the portable clock.

Weather: https://open-meteo.com/ · Facts: https://science.nasa.gov/ · Vanadium: https://github.com/GrapheneOS/Vanadium

## License

Noncommercial use, modification, and sharing are permitted under the **Simpli Home Tools Noncommercial License 1.0** in `LICENSE`. **Commercial use or monetization requires separate written permission from ilamgumaran.** The standalone HTML includes the complete license in its source; keep it intact when sharing. Earlier GPL-licensed versions retain their existing rights. See the repository's `LICENSING.md` for details and permission requests. External services/data retain their own terms.

## Available themes

Tap **Theme** to cycle through the original **Orbit** layout, **Candy Quest**, and **Time Climber**. Your selection is saved in this browser. Candy Quest adds a candy-drop friend who runs, rides a bicycle, and sweeps in available spaces around the content. The companion visits for 8–12 seconds about once a minute in low power, then disappears; it waits for panel glides to finish and uses smaller artwork when space is tight. Reduced motion uses a brief still appearance instead. Hidden pages, settings, and screen breaks pause the companion. Both themes retain the same clock, weather, facts, and screen-care settings. Future themes can be added to the registry in app.js.

Time Climber is the default in new browser profiles. Its candy mountaineer has stick limbs, a helmet, a backpack, and a grappling rope. It climbs the live time digits and widget edges, collects supplies, and builds a hanging tent. Time stays accurate as the minute changes beneath the climber. Character timing and visibility remain configurable in Settings; reduced motion shows a brief still campsite.
