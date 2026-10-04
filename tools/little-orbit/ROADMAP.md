# Our Desk Clock roadmap

Updated 2026-10-04. Milestones express intent, not promised delivery dates. The product owner sets priorities and authorizes deferred implementation.

## Current foundation — implemented, awaiting PR merge

- Browser clock with date, weather, daily facts, fullscreen and touch lock.
- Orbit, Candy Quest, and Time Climber themes; configurable fonts, spacing, presets, and companion timing.
- Dark low-power presentation, moving layouts, night dimming, reduced-motion handling, and black-screen breaks.
- Portable single-file build, original artwork, GPL-3.0-only licensing, contribution guide, and Windows helpers.
- Automated hosted/portable Chromium and Firefox checks on Windows, macOS, and Linux.

The implementation is in [PR #1](https://github.com/ilamgumaran/simpli-home-tools/pull/1). Treat main and a future tagged release separately from an unmerged development branch.

## Next: Time Climber II design review — planned

Review the [Mountain of Time proposal](design/TIME-CLIMBER-V2-PLAN.md) and [interactive design study](design/time-climber-ii-preview.html). Confirm the minute/hour/day hierarchy, distant calendar ridges, tiny character visibility, and gentle perspectives. Implementation remains deferred; no exact start time has been agreed.

Done when: visual direction and pacing are accepted, unresolved choices are recorded, and implementation is authorized. A design preview is not a production theme.

## Time Climber II vertical slice — deferred

Build a fourth theme with one numeral-shaped trail, one cliff route, one small explorer, a readable fixed time/date strip, and a safe real minute rollover. Reuse lifecycle and screen-care behavior. Validate readability and motion on the Ally before building all scenes.

Done when: no overlap/scrolling across supported presets; real time remains accurate; route changes are continuous; reduced motion, pauses, and portable build pass tests. Existing three themes are unchanged.

## Mountain of Time expansion — follows the vertical slice

Extend route data to 0–9, both minute/hour digits and calendar levels; add supply stops, a suspended camp, and the three camera perspectives. Cover midnight, month/year transitions, leap years, daylight-saving changes, sleep/resume, and manual clock changes.

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
