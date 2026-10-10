# Our Desk Clock (Little Orbit)

A retro browser display clock for a desk, kids' room, handheld, spare tablet, or TV. Time, date, weather, and daily space facts share a dark, readable screen. **Orbit** keeps the classic layout; **Candy Quest** adds a candy-drop companion who runs, cycles, and sweeps in spare spaces. **Time Climber** turns the clock into a miniature mountaineering window: a helmeted candy adventurer with stick limbs, backpack, and grappling rope climbs all four digits and the clock/weather/fact widget edges, finds food, water, and gear, and builds a suspended tent for a rest.

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

Low power uses near-black colors, hides seconds, updates time once a minute, and refreshes weather every 30 minutes. Panels briefly glide each minute, rotate positions every ten minutes, and spotlight facts every five minutes. Optional night dimming and one-minute black breaks at :59 remain available in all themes.

Candy Quest visits briefly and pauses between appearances, picks routes outside the text, resizes its character when needed, and respects reduced motion. These measures cannot guarantee against display wear. Black-screen breaks draw black; they do not turn off a backlight. Set sleep and hardware brightness in the device OS. Ordinary browser pages cannot set charging limits or CPU power modes.

## Develop and test

For session-to-session handoffs and replies, read the [session communication directory](../../sessions/README.md). The [organic-motion thread](../../sessions/2026-10-05-organic-motion/README.md) records motion ownership, the next build and device feedback; [motion design](design/ORGANIC-MOTION.md) explains pacing and verification.

Start with the [product guide](PRODUCT.md), [roadmap](ROADMAP.md), [design archive](design/), and [changelog](CHANGELOG.md) for product status and planned work. The [model orchestration plan](design/MODEL-ORCHESTRATION.md) records planning, testing and execution roles. Five themes are implemented, including Woodland of Time; all earlier choices remain available.

```sh
npm ci
npx playwright install chromium firefox
npm run build
npm test
```

Node 22 or later is used for contributor tooling; Linux may need `npx playwright install --with-deps chromium firefox`. Tests start their own loopback server on a free port and use mocked weather. They cover settings, touch lock, theme persistence, safe companion routes, all daily facts and rotating layouts, reduced motion, offline behavior, device presets, and the portable file. Tests write ignored output to `test-results/`.

The browser runtime has no library dependencies. Playwright is a development dependency. `npm run build` embeds `config.js`, `style.css`, `characters.js`, `world-layers.js`, `app.js`, `display-settings.js`, `time-climber.js`, `time-climber-ii.js`, and `woodland-time.js` into the tracked portable file. Commit that file with source changes.

## Windows helpers

For the latest built version and physical Ally testing, follow the [installation handoff](design/ALLY-TEST-HANDOFF.md). It identifies the Git branch, tested revision, portable checksum and local update steps.

`windows/Start Clock.cmd` opens a default-browser tab. `windows/Start Ally Display.cmd` opens a separate Edge fullscreen kiosk window. `windows/Restart Clock.cmd` restarts only that clock's Edge profile and server. These helpers require Node on PATH; they change no OS power plan. Close the kiosk with **Alt+F4**. They are optional and not required on macOS, Linux, or Android.

## License and sources

Copyright © 2026 ilamgumaran and contributors. **Simpli Home Tools Noncommercial License 1.0**; [LICENSE](LICENSE). Noncommercial use, modification and sharing are allowed; commercial use or monetization needs separate written permission from the project licensor. This is source-available software, not OSI open source. Earlier GPL versions retain their rights. See [licensing and permission requests](../../LICENSING.md). No warranty. Original SVG character and CSS use the same license. [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) lists external services and contributor dependencies.

Default weather is Marietta, GA (30064), configurable in Settings. Facts are original short summaries with links to NASA sources and repeat on a 24-day cycle. Location permission is only requested when you tap **Use my location**. There is no analytics, account service, or telemetry; weather and city searches contact Open-Meteo.

### Time Climber

Time Climber is retained as the third theme; existing saved theme choices are preserved. Use **Theme** to cycle Orbit → Candy Quest → Time Climber → Time Climber II → Woodland of Time. The companion follows live digit geometry and widget positions as panels glide. Default 60-second visits are aligned to start near :54, so the real minute changes during a climb. The first visit starts quickly so you can see the new theme. Time continues to follow the device clock.

Settings → Display & character controls the shared visit interval, visit duration, and character toggle. Quiet pauses remain between trips. Tent construction, picnics, water breaks, gear collection, and occasional summit snoozes vary across visits. Reduced motion uses a brief still campsite. Settings, hidden pages, disabled companions, and hourly screen breaks stop the scene. The artwork is original SVG and the scene uses bounded animation bursts without external game assets or libraries.

### Time Climber II — Mountain of Time

The fourth theme (`climber2`) is the default for new profiles; existing saved themes remain selected. A tiny original explorer walks numeral trails, swings a rope, climbs rock faces, collects supplies and pitches a suspended portaledge. The active digit grows while its neighbor stays smaller, and the lens gently pans between overhead, cliff and opposite-side perspectives. Minutes sit below hours and the day summit, with month/year on the distant horizon. A fixed full time/date readout, weather, and daily fact remain outside the camera.

Minute visits cross a pair of digits quickly. Hour/day/month/year expeditions use progress calculated from actual local calendar boundaries, so the explorer can resume partway up a longer route. Short visits alternate these levels with quiet camps. Real time always updates immediately; terrain reshapes over a short transition during active visits. A clock jump or return from sleep recomputes current progress instead of replaying missed frames.

Settings → Display & character → **Time Climber II camera** offers Gentle or Still. Reduced motion takes priority. Low power caps active terrain updates around 12 per second and stops animation frames during quiet camps. Hidden pages, Settings, black-screen breaks and character-off pause the explorer. Font presets continue to work; the mountain gives up height before the essential information is reduced. The [design plan](design/TIME-CLIMBER-V2-PLAN.md) and [architecture notes](design/ARCHITECTURE.md) describe the implementation and remaining device-review work.

### Shared characters and role kits

Character definitions now live in `characters.js`, including the original Candy Quest artwork, Moss and Ridge. The climbing themes use jointed human proportions, a visible harness and a rope tied to the shared belay loop. Recovery holds and late optional ascender assistance are independent of the clock.

Open [the character workshop](design/character-study.html) from the checkout to inspect looks, colors and role inventories. [Design notes](design/CHARACTERS.md) distinguish the implemented appearance/effort layer from future terrain physics and food/bushcraft/farming/hunting actions.

## Woodland of Time and the living-world layers

The fifth theme, `woodland`, fills the viewport with woods, river and a working camp. Larger shared characters pave, gather wood, pitch shelter, filter water, make fire, cook and repair a crossing. Supervised children play in shallow water or shape the current minute digit in sand. Complete material HH:MM remains readable throughout: leaves and buoyant timber flow along a river channel; stones arrive on the bank; hours stand on timber/stone supports and the day has a carved plaque. The place changes hourly, with six daily social episodes and an 18:00 pause for reflection. Select **Theme: Woodland** and **Settings → Woodland view → Full landscape**. Existing theme choices remain selected.

`world-layers.js` separates landscape, action, story, philosophy and composition definitions; `woodland-art.js` supplies detailed original SVG materials and scenery; `woodland-immersive.js` composes the [full landscape](design/IMMERSIVE-WOODLAND.md). Minute glyphs change together immediately. Every following character travels to its next site. Protected climbing starts after arrival, includes three four-second recovery holds and ends with a protected descent. Wind, clouds, water, gentle lighting and bounded camera/information movement keep the environment alive. Low power targets 30 fps; normal mode follows browser frames. Reduced motion keeps a static current-time scene; hidden pages, settings and screen rest pause rendering. Companion-off hides people while the landscape continues. **Daily thought** opens the learning panel. The **Still camera** option stops camera/information drift.

Choose **Dashboard** in Woodland view for the earlier panel composition in `woodland-time.js`, including its visit interval/duration controls and [organic contact motion](design/ORGANIC-MOTION.md). Full landscape uses continuous camp activity instead of visits. Site configuration may select an adult woodland lead; by default the episode selects its cast. Camp construction progresses deterministically within each hourly chapter; it is not saved resource or construction history.

The [living-world plan](design/LIVING-WORLDS.md) links detailed visual, action and story plans for industrial/engineering, weaving, farming, railway and ant-life scenes. These later themes are proposals. Woodland is an authored illustration with articulated poses and sampled effort, not a complete contact/rope, metabolism, resource-conservation or generational simulation. Wildlife tracking/hunting choreography remains planned.
