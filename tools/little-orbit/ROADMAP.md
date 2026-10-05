# Our Desk Clock roadmap

Updated 2026-10-04. Milestones express intent, not promised delivery dates. The product owner sets priorities and authorizes deferred implementation.

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

The owner authorized appearance/body layers and reusable role equipment. [Shared character design](design/CHARACTERS.md) and the [interactive workshop](design/character-study.html) accompany a central registry for every current mascot. Both climbing themes now share articulated artwork, a harness connection and per-ascent fatigue/recovery/optional aid behavior. The catalog separates available gear from carried kit.

Next layers: persistent terrain hand/foot contacts and center-of-mass/rope physics; gear-specific animation; persistent fatigue and food/water consumption; cooking/bushcraft; planting/harvest and hunting/foraging. These are follow-up work, not implemented behavior.
