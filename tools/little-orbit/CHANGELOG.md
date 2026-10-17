# Our Desk Clock changelog

No tagged releases yet. Implemented entries describe code on the development branch; planning notes describe proposals tracked in [ROADMAP.md](ROADMAP.md).

## Unreleased

### Unreleased — camp contact fix; current browser suites pass

- The shared fullscreen renderer now caches detailed clock art separately from scenery, weather, moving characters and lighting. Each SVG layer follows the same camera transform, and unchanged character/camp properties skip DOM writes. Slow scenery runs at 30 fps while characters and precipitation retain the main cadence.

- Green House 1 (`greenhouse1`) is a separate weather-responsive theme with cached-weather lighting, bounded precipitation, a thermometer, tiny antlike camp people, a tent and food/play setting. It adds no weather request or temperature-control setting. Earlier candidate `c827dba952f2873386fc78f4f7b5892b78bc29ba` avoids unused Woodland model snapshots, uses a CSS color quad for animated light under the existing SVG opacity control, and refreshes reduced-motion state on scene sync. Its cross-browser functional passes and cadence failures are historical; see [session 010](../../sessions/2026-10-10-weather-habitat/010-cloud-clock-rendering-results.md).
- Green House 1 adds authored recurring routines: Aster cares for swaddled, supported infant Pebble; Sage tends shelter, forage, cooking, teaching and remembrance; Sprout joins safe, supervised play and sleep. Dusk memorial flowers (17:00–20:00) honor Fern; no ancestor character appears. Persistent lineage and ecosystem simulation are not claimed. See [community design](design/COMMUNITY-HABITAT.md) and [session 010](../../sessions/2026-10-10-weather-habitat/010-cloud-clock-rendering-results.md) for the earlier candidate.
- Current source candidate `b0c364743c355749185505491c64e8b7a15c033f` blends Sprout's play/sleep poses over 0.7 seconds at shared 07:00/19:00 daylight boundaries, interpolates the existing eye marks, attaches the play stick to the actual blended hand while preserving its play-pose grip offset, and grounds both feet. Epoch-based breathing stays continuous across midnight and DST. The woodland daylight schedule is shared runtime metadata, not a user setting; standalone community sampling retains its 06:00/20:00 fallback. Sage's constrained task contacts, Pebble's supported infant pose, frozen quiet state and clock authority remain intact. The portable build and full Chrome/Firefox/Edge suites pass, including cadence and offline checks. See current [session 013](../../sessions/2026-10-10-weather-habitat/013-cloud-child-motion-results.md), ownership [012](../../sessions/2026-10-10-weather-habitat/012-cloud-child-motion-ownership.md), and historical Sage candidate [011](../../sessions/2026-10-10-weather-habitat/011-cloud-camp-contact-motion.md). Earlier intermittent stalls remain unexplained.

### Added

- [Immersive Woodland](design/IMMERSIVE-WOODLAND.md): default fullscreen SVG view with a Dashboard option, larger shared cast, complete current-time material digits and a DD plaque. River-carried leaves/timber, bank stone delivery and a current-ones sandbox accompany twelve camp activities, supervised family shallows and construction advancing within the hourly chapter. Construction is time-sampled rather than persistent user history.
- Central expedition kit and ten activity poses for immersive camp work, food carrying and family scenes. The lead climbs after arrival, with three work bouts, each with four seconds of supported recovery, deadline-only assistance and protected descent; followers walk to their sites. Slow wind/water/clouds, lighting and camera/HUD movement respect reduced motion.

- Combined cloud Woodland enlargement and blended choreography with local supported rock/walking/tool contacts. Shelter/crossing use reach-checked mallets; teaching alternates teacher/listener turns. Responsive worksite transforms preserve grips and travel arrival positions.

- Woodland survey uses map-before-walk sequencing, planted alternating ground steps and destination rest. Gathering/cooking use grounded shared work rigs and wrist-attached sticks/spoons whose working ends meet authored sockets.
- Woodland rock climbing now uses authored world-space hand/foot holds and a shared contact solver: one-limb transfers, four-contact body lifts, stationary recovery and a supported final stance, with fixed limb lengths and harness-connected protection.
- Woodland of Time, the fifth theme: complete earth-trail HH:MM, distinct hourly woodland landmarks, twelve minute activities, six authored daily stories and a quiet daily reflection chapter.
- Shared world/landscape/action/story/philosophy recipes, central learner Sprout, distinct gathering/building/water/cooking/teaching poses and shared map/spoon props. Woodland protected climbing includes stationary recovery and deadline-only optional assistance.
- Living-world composition and specialist plans for industrial, weaving, farming, railway and ant themes; later implementations and deeper simulation remain proposed.

- Shared character registry for Pip, Moss and Ridge; reusable appearance layers, jointed body rig, role kits and 83-item equipment catalog. Interactive character workshop shares the runtime library.
- Climbing scenes use waist/leg-loop harness attachments, per-ascent exertion and a mandatory recovery hold. Optional ascender assistance appears only late in the route budget; portaledge support and climber protection remain separate.

- Browser display clock with date, weather, daily learning facts, fullscreen and touch lock.
- Orbit and Candy Quest themes, configurable device presets, independent font scales and spacing.
- Dark low-power mode, layout shifts, night dimming, black-screen breaks and reduced-motion handling.
- Time Climber theme with original SVG mountaineer, real digit/widget climbing, ropes, supply pickups and a suspended campsite.
- Time Climber II theme: tiny original explorer, numeral-shaped terrain/trails, digit focus scaling, overhead/cliff/traverse lens, calendar-paced higher routes, supplies and a suspended portaledge. Fixed full time/date, weather and fact stay readable. Configurable Still camera, reduced-motion support and quiet animation lifecycle.
- Single-file portable build, optional Windows launchers, and Chromium/Firefox checks on Windows, macOS and Linux.

### Changed

- Fullscreen Woodland uses a composited outer SVG camera and cached layout geometry to improve Firefox at high pixel density. Low-power pacing in both Woodland views avoids phase catch-up stutter; browser checks inspect rendered frame gaps, supported rest, and geometry through minute transitions.

- Woodland fills the available scene panel with proportion-preserving scenery and larger responsive characters. Timber now includes bark, knots and end grain; layered curved mountains give the landscape softer depth.
- Shared anatomical gait and pose transitions are smoother, with eased climbing and continuous authored Woodland worksite travel. Repeated climbing visits return by protected rappel; terrain-contact and rope-force simulation remain future work.
- Woodland now renders at 30 fps in low-power mode and browser animation-frame cadence in normal mode, with cached layout/markup, body-paced crossings, distance-based planted gait, supported weight shifts and continuous contact-rig transitions. Work starts after arrival; repeats include return travel, and work ends before the next visit or second 55 while preserving recovery. Companion-off, reduced motion, hidden tabs, settings and screen rest suppress moving frames.
- Time Climber II keeps numeral terrain closer together on a shared baseline, preserving left-to-right digit order and showing the complete year as focus moves between digits.
- Product name is Our Desk Clock; Little Orbit filenames and directory remain compatible.
- New versions use the Simpli Home Tools Noncommercial License 1.0: noncommercial use and collaboration are allowed, while commercial use needs separate written permission from the project licensor. Earlier GPL grants remain in effect. Contributor terms, license headers, package metadata, and portable license text are updated accordingly.

Time Climber II is implemented on the development branch; real-device visual review and extended-duration testing remain release-readiness work.

## Planning note — proposal only

- Future theme idea: configurable baseball/football scoreboard variants, with a small field play visibly cueing current-time digit updates. See the [future theme queue](ROADMAP.md#future-theme-queue--proposed-not-scheduled) and [living-world recipe](design/LIVING-WORLDS.md#sports-scoreboard--proposed-slot-tbd). No implementation is included.
