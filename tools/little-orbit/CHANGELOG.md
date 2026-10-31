# Our Desk Clock changelog

### Matched frame-delivery controls

- Added exact, balanced blank/full/hidden-art research samples for Windows
  Firefox normal, macOS Chromium low-power and local DPR2 immersive normal.
- Added complete compressed round notices/artifacts, strict recovery and analysis,
  sample-error retention, explicit
  profile configuration and completeness checks. Production timing gates and
  display bytes remain unchanged; [control study](design/MATCHED-MOTION-CONTROLS.md).

### Exact callback policy replay

- Added a standalone test-only policy comparison and exhaustive hindsight bound
  with separate RAF/entry clocks, original sample duration and exact p95 rules.
- Retained four additional Windows/macOS failure traces, including a Windows
  normal-mode failure where all native callbacks already reach geometry.
- Production pacing, scene art, portable bytes and acceptance gates stay
  unchanged. See the [replay study](design/CADENCE-POLICY-REPLAY.md).

### Cross-platform failure evidence

- Added test-only native callback, app pacing-decision and geometry traces with
  complete failure notices and CI artifacts, plus bounded navigation evidence.
- Kept application bytes, timing gates and navigation behavior unchanged.
  [Session 030](../../sessions/2026-10-10-weather-habitat/030-ci-trace-results.md)
  records 66 local cadence passes, four recovered exact platform failures and
  the remaining CI boundary. Added a pure trace analyzer and recovery guide.

### Rain reading-layer camera candidate

- Kept the camera's quantized x/y path, but gave only the reading/clock SVG a
  zero-depth 3D transform only while the camera moves; Still/reduced-motion and the other layers retain their planar transforms. Added a zero-coordinate mode-switch regression check.
- Recorded 21 balanced layer-control samples and 14 targeted transform samples,
  including slower and inconsistent cases. Added a reusable rain-layer
  diagnostic with versioned reports and explicit measurement errors.
- See [session 028](../../sessions/2026-10-10-weather-habitat/028-reading-camera-results.md)
  for candidate validation. Earlier failures remain in session 025; neither
  native callbacks nor DOM mutations establish physical-display smoothness.


No tagged releases yet. Implemented entries describe code on the development branch; planning notes describe proposals tracked in [ROADMAP.md](ROADMAP.md).

## Unreleased

### Bounded Woodland/Green House 1 cadence — validation candidate

- Added shared phase pacing for the low-power 30 Hz target, with a minimum paced gap to prevent short catch-up pairs and a rebase after long pauses. Normal mode follows every native RAF callback; scenes still derive poses and time from current time.
- Corrected early-frame timing debt using a public Windows callback fixture and 101 start phases; quantized refresh can run slightly above the nominal 30 Hz target.
- Added independent refresh-rate/jitter/stall fixtures and native callback diagnostics. The older climber test now waits for the reduced-motion change event before its existing quiet-visit assertion. All performance limits remain unchanged.
- [Session 025](../../sessions/2026-10-10-weather-habitat/025-cadence-verification-handoff.md) records final corrected-runtime coverage: Chrome/Edge 22 cadence passes each, Firefox 21 passes/1 hosted DPR2 rain failure. Combined Chrome/Firefox npm exits 1; native Edge exits 0; remaining functional/offline coverage completed separately. Required Windows/macOS timing checks remain failed. Added a [rain profiling investigation and task split](design/RAIN-CADENCE-INVESTIGATION.md); no further runtime changes from that probe.

### Shared anatomy foundation — workshop inspection

- Added shared versioned adult, drop, learner and swaddled profiles, pure palm/thumb and sole landmarks, constrained two-bone reference solves, stable bend choices and explicit unreachable-target diagnostics.
- Extended the character workshop with seven static reference poses, front/turned/side envelopes, mirrored facing, landmark visibility and small/enlarged comparison. Pebble retains support anchors and covered limbs.
- Kept live character rendering and scene contact semantics unchanged. Added independent geometry fixtures and a 120-frame legacy pose baseline; production silhouettes, palm grips, sole gait and full-body integration remain later stages.
- [Session 020](../../sessions/2026-10-10-weather-habitat/020-anatomy-foundation-results.md) records local Chrome/Firefox/Edge verification and 66 passing cadence cases. Hosted Windows/macOS CI remains a merge gate; no device acceptance or new live gait is claimed.

### Unreleased — Green House 1 connected meal validated; device review pending

- The shared fullscreen renderer now caches detailed clock art separately from scenery, weather, moving characters and lighting. Each SVG layer follows the same camera transform, and unchanged character/camp properties skip DOM writes. Slow scenery runs at 30 fps while characters and precipitation retain the main cadence.

- Green House 1 (`greenhouse1`) is a separate weather-responsive theme with cached-weather lighting, bounded precipitation, a thermometer, tiny antlike camp people, a tent and food/play setting. It adds no weather request or temperature-control setting. Earlier candidate `c827dba952f2873386fc78f4f7b5892b78bc29ba` avoids unused Woodland model snapshots, uses a CSS color quad for animated light under the existing SVG opacity control, and refreshes reduced-motion state on scene sync. Its cross-browser functional passes and cadence failures are historical; see [session 010](../../sessions/2026-10-10-weather-habitat/010-cloud-clock-rendering-results.md).
- Green House 1 adds authored recurring routines: Aster cares for swaddled, supported infant Pebble; Sage tends shelter, forage, cooking, teaching and remembrance; Sprout joins safe, supervised play and sleep. Dusk memorial flowers (17:00–20:00) honor Fern; no ancestor character appears. Persistent lineage and ecosystem simulation are not claimed. See [community design](design/COMMUNITY-HABITAT.md) and [session 010](../../sessions/2026-10-10-weather-habitat/010-cloud-clock-rendering-results.md) for the earlier candidate.
- Current runtime `f02092b12a45d72cefe73ba68d5acd2f68932358` (portable SHA-256 `046f02a9772a5060ac422b6acceee763fb29726a230df1ce1932a38611899ec6`) adds Sage's repeatable seven-stage meal minute during lunch (11:00–13:00) and evening care (20:00–22:00). Sage gathers greens, carries food to the pot, cooks, delivers a bowl by an eight-step foreground route, serves it, rests and returns home. Held and served bowls share a normalized hand/rim point; the tabletop is at y19.333 with a base at ground48. The final 1.2 seconds of each daily meal window hold baseline routine pose; ordinary minute loops join continuously. Quiet mode freezes the meal and hides moving food. Other daily activities and Aster's support of Pebble remain. The 12-pixel camp-inset adjustment clears caption overlap.
- Both `npm test` runs exit 0 (combined Chrome/Firefox and native Edge; runner `7bfe736`): all 9 pure programs, 13 browser programs per engine, offline portable, and all 66 cadence cases (54 existing + 12 meal cases). Final focused meal (4 functional + 4 cadence per engine) and community (14 groups per engine) checks pass. Caption clearance passes all seven stages and quiet mode across four views at DPR 1/2. Painted-group gaps meet >=30 CSS px and viewport margins meet >=16 CSS px. No full-run failures or retries. Physical Ally/Vanadium and sustained acceptance remain pending; earlier intermittent stalls remain unexplained. Coverage is 13 browser programs per engine, 54 original cadence gates and 12 active-meal cadence cases. Session 015 records spacing/motion passes for its earlier candidate. Sessions 011–014 preserve historical candidate evidence.

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
