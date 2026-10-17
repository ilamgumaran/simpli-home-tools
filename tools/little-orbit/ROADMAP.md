# Our Desk Clock roadmap

Updated 2026-10-16. Milestones express intent, not promised delivery dates. The product owner sets priorities and authorizes deferred implementation.

## Woodland Ally validation — installation complete; device review in progress

See [local results and milestones](../../sessions/2026-10-05-woodland-ally/002-ally-to-cloud.md). The pinned Woodland artifact matches its checksum, Windows Edge/Firefox hosted and portable checks pass, and Woodland is installed in the Ally fullscreen workflow. Live capture was blocked by URL-confidence policy; physical interaction, actual kiosk scaling and extended operation remain pending. Compact character visibility and scene width are follow-up art milestones. Do not label this a completed physical acceptance or stable release.

## Current foundation — implemented, awaiting PR merge

- Browser clock with date, weather, daily facts, fullscreen and touch lock.
- Orbit, Candy Quest, Time Climber and Time Climber II themes; configurable fonts, spacing, presets, camera and companion timing.
- Dark low-power presentation, moving layouts, night dimming, reduced-motion handling, and black-screen breaks.
- Portable single-file build, original artwork, source-available noncommercial licensing with written commercial permission, contribution guide, and Windows helpers. Earlier GPL versions retain their granted rights.
- Automated hosted/portable Chromium and Firefox checks on Windows, macOS, and Linux.

The implementation is in [PR #1](https://github.com/ilamgumaran/simpli-home-tools/pull/1). Treat main and a future tagged release separately from an unmerged development branch.

## Time Climber II design — authorized and implemented on development branch

The owner authorized implementation of the [Mountain of Time plan](design/TIME-CLIMBER-V2-PLAN.md). The [original interactive design study](design/time-climber-ii-preview.html) stays available as history. The runtime implements the minute/hour/day hierarchy, distant calendar labels/ridges, tiny explorer, and gentle perspectives; refine the visual direction through device feedback.

The preview remains a design study. Real-device visual feedback is still welcome; it does not prevent review of the implemented theme.

## Time Climber II vertical slice — implemented

The fourth theme includes numeral-shaped trails, cliff routes, one small explorer, a fixed readable time/date strip, and a safe real minute rollover. Lifecycle and screen care are integrated. Browser tests cover the Ally viewport and the existing three themes.

Done when: no overlap/scrolling across supported presets; real time remains accurate; route changes are continuous; reduced motion, pauses, and portable build pass tests. Existing three themes are unchanged.

## Mountain of Time expansion — initial implementation; hardware review remains

Route data covers 0–9, paired time/day/month digits and year digits, with supply stops, a suspended camp and three perspectives. Calendar/DST boundaries, real rollovers, clock jumps, quiet frame behavior and pause/resume are covered by automated checks. Extended operation and physical Android/Vanadium review are still release-readiness tasks.

Done when: the complete acceptance list in the design plan passes and character motion remains bounded and quiet in low-power mode.

## Preview release and contributor experience

Review and merge the development PR; choose a preview version and publish documented portable artifacts. Improve first-run configuration, issue reproducibility, accessibility checks, and real-device coverage where evidence identifies gaps. Keep browser-only use simple.

Done when: a tagged release is reproducible, licensed artifacts can be downloaded easily, supported/tested environments are stated accurately, and a new contributor can run the checks from the guide.

## Stable product readiness

Perform an extended run on real hardware to check memory growth, failed weather requests, rollover behavior, screen breaks, and resume after sleep. Improve settings discoverability, keyboard/touch access, and readability as needed. Confirm release packaging and upgrade behavior preserve user preferences.

Done when: documented long-run and accessibility checks pass, known limitations are recorded, and the owner approves a stable release.

## Backlog to evaluate

- Additional original themes through a shared theme lifecycle.
- Custom fact packs with clear licensing and safe rendering.
- Import/export of non-sensitive settings if users need it.
- Optional static HTTPS hosting with deployment instructions.
- Localization and locale-specific calendar/time presentation.

These are candidates, not commitments. Keep them out of an active milestone until the user benefit, scope, and validation are clear.

## Shared characters — first layer implemented

Next step implemented: [survey walking and work grips](design/WALKING-AND-GRIPS.md). Ground contacts now support the lead survey route; gathering/cooking sockets join hand and tool to the workpiece. Shelter/crossing sockets and reciprocal teaching are implemented in the refinement integration. Other walking, tree work and full dynamics remain deferred; scope is recorded rather than generalized to all activities.

Next authorized step implemented: [Woodland rock contact slice](design/CHARACTER-CONTACTS.md), with shared world-space hand/foot targeting, supported body lifts and recovery. Ground walking and work grips are implemented; a specialist tree route remains a next milestone; full rope/contact dynamics remain later work. See [session progress](../../sessions/2026-10-05-woodland-ally/003-character-contacts.md) for verification and deployment status.

The owner authorized appearance/body layers and reusable role equipment. [Shared character design](design/CHARACTERS.md) and the [interactive workshop](design/character-study.html) accompany a central registry for every current mascot. Both climbing themes now share articulated artwork, a harness connection and per-ascent fatigue/recovery/optional aid behavior. The catalog separates available gear from carried kit.

Next layers: persistent terrain hand/foot contacts and center-of-mass/rope physics; gear-specific animation; persistent fatigue and food/water consumption; cooking/bushcraft; planting/harvest and hunting/foraging. These are follow-up work, not implemented behavior.

## Living worlds — Woodland first slice implemented

Shared landscape, action, story and philosophy definitions compose the fifth theme, Woodland of Time. Complete terrain HH:MM changes atomically each minute; eight hourly woodland places, twelve activities, central Sprout and six daily episodes provide the first composition. A quiet daily chapter varies observation, water, food and teaching. Branded desktop browser/portable checks and physical-device limits are recorded with this change.

### Green House 1 — child-motion browser suites pass; device validation pending

The new `greenhouse1` theme, **Green House 1**, holds weather-driven scene lighting, bounded precipitation, a thermometer, tiny antlike camp people, tent and food/play setting. It reuses the current Open-Meteo response/cache without extra requests. Woodland retains its larger actors and engineering terrain/time scene; the existing global weather panel remains. Current candidate `b0c364743c355749185505491c64e8b7a15c033f` retains the lean scene path, CSS light surface, reduced-motion refresh and Sage task-contact fix, and adds Sprout's day/night blend and continuous organic phase. The portable build and full Chrome/Firefox/Edge suites pass, including cadence and offline checks. Intermittent stalls recorded on earlier candidate `c827dba9` remain unexplained. See [weather design](design/WEATHER-HABITAT.md), [current session 013](../../sessions/2026-10-10-weather-habitat/013-cloud-child-motion-results.md), [ownership 012](../../sessions/2026-10-10-weather-habitat/012-cloud-child-motion-ownership.md), and [historical Sage results 011](../../sessions/2026-10-10-weather-habitat/011-cloud-camp-contact-motion.md).

### Green House 1 Community Habitat — Sprout motion updated; validation and device follow-ups open

The recurring cast has Aster caring for swaddled, caregiver-supported infant Pebble; Sage performs shelter, forage, cook, teach and remembrance routines; Sprout joins safe, supervised play and sleep. Dusk memorial flowers from 17:00–20:00 honor Fern; no ancestor character appears. Candidate `b0c3647` transitions Sprout's play/sleep poses over 0.7 seconds at shared woodland daylight boundaries (07:00/19:00), preserves the actual play-hand stick grip while the body blends, and grounds both feet. Epoch-based breathing stays continuous across midnight and DST. The community sampler's standalone default remains 06:00/20:00; the shared schedule is runtime metadata, not a user setting. Sage's routine contacts, Pebble's supported pose, frozen quiet state and clock authority remain intact. Pure tests, portable build and focused three-browser checks pass; full browser suites, cadence and offline portable checks pass. Sustained device acceptance and earlier intermittent stalls remain open. See the [community design](design/COMMUNITY-HABITAT.md), [current session 013](../../sessions/2026-10-10-weather-habitat/013-cloud-child-motion-results.md), [ownership 012](../../sessions/2026-10-10-weather-habitat/012-cloud-child-motion-ownership.md), and [historical Sage results 011](../../sessions/2026-10-10-weather-habitat/011-cloud-camp-contact-motion.md). This is authored story recurrence; fast aging, infant replacement, real ecosystem claims and persistent lineage/resources are outside scope.

Next motion work after this slice: natural activity choreography that follows authored user terrain and camp stories. Do not begin a different deferred theme as part of that work.

Visual refinement implemented on the development branch: the landscape fills its panel, digits/trees/sun retain their proportions and the responsive cast is larger. Shared gait and pose blends, eased climbing and authored worksite travel replace abrupt movement. Timber includes bark, knots and end grain; curved mountain layers soften the terrain.

[Organic motion](design/ORGANIC-MOTION.md) now uses 30 fps low-power/native-frame normal rendering, body-paced 1–20 second travel, planted walking, supported contact transfers and gentle follow-through. Work starts after arrival; repeat visits include return travel, and work ends before the next visit or second 55. Short windows are skipped to retain recovery; repeated climbing visits return by protected rappel. Companion-off, reduced motion, hidden tabs, settings and screen rest suppress moving frames.

Review gate: readable terrain time and shell content in compact landscape and portrait layouts; continuous movement at visit/minute boundaries; stationary protected recovery; quiet lifecycle behavior; timber and mountain detail at handheld size. Hosted and offline portable suites passed in Chrome for Testing 151, Edge 154 and Playwright Firefox 153 on Linux; physical-device review remains pending.

Next Woodland expansion: contact-pinned rock/tree routes and specialist tree gear, activity-specific material edits, sustained resource history and richer reciprocal gestures. The first slice uses timed vignettes rather than claiming these systems are complete.

The [overall composition plan](design/LIVING-WORLDS.md) combines [visual layers](design/VISUAL-LAYERS.md), [actions/time/effort](design/ACTIONS-AND-TIME.md) and [stories/philosophy](design/STORIES-AND-PHILOSOPHY.md). Proposed implementation order after Woodland: industrial/engineering, farming, railway/station/junction, ant life. Weaving is fully planned; its implementation slot remains to be chosen. Do not begin later themes automatically.

### Future theme queue — proposed, not scheduled

- Industrial/engineering → farming → railway/station/junction → ant life, preserving the existing proposed order.
- Weaving: planned; slot TBD.
- Sports scoreboard: baseball and football variants; slot TBD. Characters stage a scoring play that cues a visible scoreboard update at the current minute boundary. Hours can frame innings/periods/rounds and days a fixture/date board; actual HH:MM and date remain authoritative.

Woodland refinement now combines both development histories with responsive contact sites, shelter/crossing grips and reciprocal teaching. See [implemented scope and next milestones](design/REFINEMENT-AND-WORK.md). Physical acceptance remains pending.

## Immersive Woodland — cloud verified; physical acceptance pending

The [fullscreen camp scene](design/IMMERSIVE-WOODLAND.md) layers edge-to-edge SVG art, a larger central cast, practical camp/family work, current-digit material flow and slow atmospheric/camera/HUD movement. `display.woodlandView` defaults Woodland to Immersive while retaining the previous Dashboard renderer; the default theme and legacy themes remain unchanged.

Implemented scope: proportion-preserving 80–160 CSS pixel cast target; complete canonical HH:MM, timber/stone hour digits and DD plaque; current-ones sandbox/river material work; hourly construction advancing monotonically with minute/time; twelve activities, central poses/expedition kit and supervised family shallows. Lead and followers walk to their sites. Climbing starts after arrival, has three bouts with four-second recovery in each and ends in protected descent. Reduced motion overrides moving scenery and camera. Construction is sampled within a chapter; persistent resources, camp history and full dynamics remain deferred.

Final cloud checks passed in Chrome, Edge and Firefox for hosted/portable layout, current-time geometry, motion and controls at 854×480, 1280×720, 1920×1080 and 390×844, DPR 1/2. Compact cadence measured near 30/60 fps; hosted 1280×720 DPR2 measured near 30/61 fps in Chrome/Edge and 30/57 fps in Firefox. The [validation record](design/IMMERSIVE-WOODLAND.md#final-cloud-validation--2026-10-10) identifies revisions, suites, frame gaps and short-sample limits. Browser SVG remains the current renderer. Ally and Vanadium hardware acceptance remain separate work; scene movement does not guarantee burn-in prevention.

The [model orchestration plan](design/MODEL-ORCHESTRATION.md) assigns planning/review to Sol 6.1, validation to Sol 6 and narrow execution to lighter models. Next scope follows device evidence: activity clarity, one material variation or one chapter refinement, with deeper persistent state designed separately.

## Green House 1 local installation — 2026-10-17

The candidate is installed and selected on the Ally. [Installation results and remaining milestones](../../sessions/2026-10-10-weather-habitat/004-ally-to-cloud.md) record passing local Edge/functional checks and open Firefox normal-mode performance, native/scaling, sustained use and Vanadium acceptance. This is not a merged release or completed hardware acceptance.
