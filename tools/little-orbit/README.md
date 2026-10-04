# Little Orbit

A retro browser display clock for a desk, kids' room, handheld, spare tablet, or TV. Time, date, weather, and daily space facts share a dark, readable screen. **Orbit** keeps the classic layout; **Candy Quest** adds a candy-drop companion who runs, cycles, and sweeps in spare spaces.

## Run

Download the repository ZIP, extract it, and open **Little Orbit.html** in your browser. The whole clock is in that file: no app install, extension, Node, external fonts, or account is required. Weather requires internet; time and facts work offline.

Or use a local server:

```sh
cd tools/little-orbit
node server.cjs
```

Open **http://127.0.0.1:4173**. With Python, `python -m http.server 4173 --bind 127.0.0.1` (or `python3`) also serves the app. Static HTTPS hosting works without a backend or build step. GitHub's repository file viewer does not execute the clock; download it or serve it.

## Configure your display

Tap **Settings → Display & character** for presets, independent time/weather/fact sizes, panel spacing, and character timing. Defaults match the ROG Ally, including 150% Windows scaling. The layout follows the browser window on other devices. **Theme** cycles the themes. **Full screen** enters browser fullscreen where allowed; **Touch lock** requires a two-second hold to unlock the page.

Edit `config.js` to set shared defaults, then rebuild the portable file. Browser-saved settings override shared defaults. See [CONFIGURATION.md](CONFIGURATION.md) for ranges, examples, and extension points.

The page uses standard browser features and feature detection for Edge, Chrome, Firefox, and Chromium-based Vanadium. Desktop browser versions can run on Windows, macOS, and Linux; Vanadium is for GrapheneOS/Android. Automated checks cover Chromium and Firefox; physical devices, Safari, and every OS/browser combination are not all verified. Missing storage, fullscreen, location, or wake lock falls back gracefully.

## Screen care

Low power uses near-black colors, hides seconds, updates time once a minute, and refreshes weather every 30 minutes. Panels briefly glide each minute, rotate positions every ten minutes, and spotlight facts every five minutes. Optional night dimming and one-minute black breaks at :59 remain available in both themes.

Candy Quest visits briefly and pauses between appearances, picks routes outside the text, resizes its character when needed, and respects reduced motion. These measures cannot guarantee against display wear. Black-screen breaks draw black; they do not turn off a backlight. Set sleep and hardware brightness in the device OS. Ordinary browser pages cannot set charging limits or CPU power modes.

## Develop and test

```sh
npm ci
npx playwright install chromium firefox
npm run build
npm test
```

Node 22 or later is used for contributor tooling; Linux may need `npx playwright install --with-deps chromium firefox`. Tests start their own loopback server on a free port and use mocked weather. They cover settings, touch lock, theme persistence, safe companion routes, all daily facts and rotating layouts, reduced motion, offline behavior, device presets, and the portable file. Tests write ignored output to `test-results/`.

The browser runtime has no library dependencies. Playwright is a development dependency. `npm run build` embeds `config.js`, `style.css`, `app.js`, and `display-settings.js` into the tracked portable file. Commit that file with source changes.

## Windows helpers

`windows/Start Clock.cmd` opens a default-browser tab. `windows/Start Ally Display.cmd` opens a separate Edge fullscreen kiosk window. `windows/Restart Clock.cmd` restarts only that clock's Edge profile and server. These helpers require Node on PATH; they change no OS power plan. Close the kiosk with **Alt+F4**. They are optional and not required on macOS, Linux, or Android.

## License and sources

Copyright © 2026 ilamgumaran and contributors. **GPL-3.0-only**; [LICENSE](LICENSE). No warranty. Original SVG character and CSS are included under the same license. [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) lists external services and contributor dependencies.

Default weather is Marietta, GA (30064), configurable in Settings. Facts are original short summaries with links to NASA sources and repeat on a 24-day cycle. Location permission is only requested when you tap **Use my location**. There is no analytics, account service, or telemetry; weather and city searches contact Open-Meteo.
