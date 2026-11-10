# Woodland installed; local browser checks passed, live inspection pending

- Message ID: `2026-10-05-woodland-ally/002`
- Date: `2026-10-05` (America/New_York)
- From: local Ally installation/testing session
- To: cloud development session
- Status: installation complete; verified results ready; live inspection pending
- Reply branch: `local/woodland-ally-check`
- Runtime: `5293f997b37ce17fcbe7ee39a157ebf885e4e496`
- Initial installed checkout: `6e2aafdb64cf5f2e76ba0f095e63c7c3708c0eb1`
- Latest documentation-only handoff fetched: `72684238337fa2952ef6857191a154b40b084d8e`
- Related message: [001: cloud to Ally](001-cloud-to-ally.md)

## Request and installation

The owner requested a ten-minute wait, then a pull, installation, checks and Git progress/milestone notes. The wait completed before fetching. The full Woodland runtime was copied into the existing local display mirror; original device launchers, profile and power state were preserved. Fullscreen Edge was restarted successfully. Its returned window title was **Our Desk Clock · Woodland of Time**.

All three new hosted modules (`characters.js`, `world-layers.js`, `woodland-time.js`) returned HTTP 200. The installed portable file SHA-256 is `4febc9c95e1ba5243d59626706defa9e200e47e80af05d9a634170457cbd6f9c`, matching the cloud handoff and unchanged rebuild. The local hosted configuration selects Woodland for this device; shared source defaults remain Time Climber II. The portable artifact retains its upstream configuration and checksum. A local ZIP was refreshed with the complete browser assets and licenses, excluding profiles and device state.

## Verification completed

On Windows, `npm run build` and the complete `npm test` suite passed using Microsoft Edge `154.0.4258.53` and bundled Playwright Firefox. Character and living-world model checks passed, including all 1,440 minute values. Hosted and portable checks covered all five themes, settings, weather fallback, touch-lock logic, reduced motion, screen care, shared characters, Woodland activities/casts, minute/hour/midnight/DST transitions, stationary recovery and optional assistance, and pause/quiet lifecycle. No runtime code repair was required by these checks.

Headless visual previews were inspected at **854×480** and **390×844**. At 854×480 the page and viewport were both 854×480, with no scrolling, readable fixed time/date/weather/fact/control panels, and terrain/header agreement (`10:05`). These are browser viewport checks on the Ally host, not a measurement of the live kiosk viewport or a physical-touch test. The compact layout letterboxes the 800×360 scene into a narrow central band; companion detail is very small, and its compact story caption is intentionally hidden. Record this as art/readability feedback rather than a timekeeping failure.

## Blocker and checks still pending

The first live Computer Use capture stopped because it could not establish the browser URL confidently enough for its policy checks. No live screenshot or touch result was obtained. The owner requested a retry; the already-verified report is published first so the handoff survives another capture block. A subsequent numbered reply will record that retry's outcome.

Pending: actual kiosk viewport/scaling measurement, live screen inspection, physical touch and hold-to-unlock, real-device sleep/resume, extended memory/power observation, and GrapheneOS/Vanadium. Automated checks do not establish battery savings or screen-wear prevention.

## Milestones and next action

| Milestone | Outcome |
| --- | --- |
| M1: published artifact identification | Complete: pinned runtime and matching checksum |
| M2: Windows hosted/portable browser validation | Complete: Edge and Firefox suites passed |
| M3: install and select Woodland on Ally | Complete: assets served and fullscreen Woodland window returned |
| M4: live device interaction and visual review | Pending: retry capture; physical touch remains unverified |
| M5: extended operation and release readiness | Pending; no merge or release performed |

Cloud follow-up: review compact-scene character scale, use of horizontal space and optional compact story presentation while preserving complete grouped HH:MM and all fixed information. Full rope/contact physics, conserved resources and later-world renderers remain deferred per the [living-world plan](../../tools/little-orbit/design/LIVING-WORLDS.md). Fetch this reply branch before continuing; Git does not notify another session automatically. Use `003-ally-live-check.md` for the next local outcome or a later numbered cloud reply. Keep private screenshots and device state out of Git.
