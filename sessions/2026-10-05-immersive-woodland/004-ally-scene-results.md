# Ally review: fullscreen Woodland

- Message ID: `2026-10-05-immersive-woodland/004`
- Date: `2026-10-10` (America/New_York)
- From: local Ally installation/browser-review session
- To: cloud implementation and subsequent agents
- Status: installed; functional checks passed; Firefox high-density normal cadence fails; physical acceptance pending
- Review branch: `local/immersive-ally-review`
- Input: `feature/woodland-immersive-story`, [PR #9](https://github.com/ilamgumaran/simpli-home-tools/pull/9), head `223e056fdf6d2ff2dcc160684dcf944dd716faa7`
- Runtime freeze: `47ea30e35eb666e9979aefd7cf18ecf0b9b16b41`
- Portable SHA-256, before/rebuild/installed: `2a67a11ebb838e75b574339fb9fa4557892d987595740e7bdf44909fad2efe64`
- Previous: [003: cloud scene ready](003-cloud-scene-ready.md)

## Installation and evidence limits

Fetched the latest runtime into an isolated local branch; the checkout was clean. Build reproduced the published checksum. Updated the complete local runtime including woodland-art.js and woodland-immersive.js, rebuilt the explicit portable ZIP, and restarted the established Edge kiosk fullscreen. All new modules return HTTP 200 on loopback 4173. Window title is Our Desk Clock · Woodland of Time, InPrivate. Local Woodland selection, Marietta/30064, low power, night dimming, care/rest defaults, launchers, profiles and saved power state were preserved; new woodlandView default is immersive. The canonical portable remains unmodified and keeps its new-profile Time Climber II default. Browser-saved preferences still override site defaults.

Windows Edge 155.0.4283.45 and bundled Firefox 153.0 were tested. Synthetic review snapshots covered 854×480 handheld cooking/climbing/night and 390×844 portrait cooking. All four fit exactly with no scrolling and no JavaScript errors. These are controlled browser CSS viewports, not measured physical kiosk viewport/scaling. Headless local-browser probes support review but do not establish native touch, battery, heat, display wear or long-running acceptance. Native review runtime initialization timed out after 30 seconds, so no live desktop screenshot or touchscreen review is claimed. Private captures and raw device logs stay out of Git.

A separate fresh Edge test context against the installed hosted app showed immersive Woodland, lowPower/night/care true, time 11:07 on October 10, weather 63°F and Updated 11:07 AM, with no JS errors and no scroll at 854×480. This verifies served defaults and network weather in that context; it does not read or replace the existing kiosk's saved profile.

The owner reported a system LSA warning. Read-only diagnostics identified an unrelated installed networking module's signing-level block, not a clock file. No LSA or other security setting was changed, no blocked module was allowed, and no security exception was added. Detailed module paths/security logs are excluded from this application report. Sandbox commands initially stalled; the responding authorized shell completed the repository work. The signing event does not establish the cause of those stalls.

## Browser verification

npm run build passed. The complete npm test attempt passed model checks and all Edge suites. Firefox passed clock/calendar, all themes/config, shared characters, dashboard/organic motion, immersive layout and immersive choreography/contact/lifecycle checks. It then FAILED the final hosted 1280×720 DPR2 normal-mode cadence gate. Consequently the full npm test result is red; do not report this as a clean full-suite pass. Portable fallback checks skipped by that abort were run separately and passed in both Edge and Firefox. No threshold was relaxed and no runtime source was changed.

Each cadence probe observes changing actor geometry for 2.1 seconds with real RAF/timers and shifted Date. These short headless samples on the Ally host are not sustained measurements of the physical kiosk.

| Browser/form | Viewport/DPR | Low/normal fps | Normal p95 / max gap | Result |
| --- | --- | --- | --- | --- |
| Edge hosted | 854×480 / 1 | 29.98 / 119.97 | 9.8 / 13.5 ms | Passed |
| Edge portable | 854×480 / 1 | 30.34 / 118.80 | 9.1 / 34 ms | Passed |
| Edge hosted | 1280×720 / 2 | 30.37 / 104.83 | 11.1 / 37.9 ms | Passed |
| Firefox hosted | 854×480 / 1 | 29.96 / 54.87 | 20 / 22 ms | Passed |
| Firefox portable | 854×480 / 1 | 30.00 / 55.56 | 22 / 26 ms | Passed |
| Firefox hosted | 1280×720 / 2 | 28.53 / 30.27 | 37 / 38 ms | Normal failed; low power passed |

The normal gate requires at least 45 fps and p95 at most 31 ms; Firefox DPR2 fails both. Reproduce using the repository's installed browsers, a loopback server, CLOCK_TEST_BROWSER=firefox, CLOCK_TEST_URL pointing to that server, then node tests/verify-immersive-motion.cjs. Capture repeated samples and sustained runs before attributing the slowdown to CPU/GPU/compositor or power configuration. Do not weaken the acceptance gate just to make this host pass.

## What looks good

Full-viewport art delivers the requested window into a time landscape. Timber/stone hours and leaf/sand minutes read as complete time; the current day plaque and full date are present. Characters are much more visible than the previous panel: sampled adult heights were roughly 93–109 CSS pixels handheld and 132–155 portrait, with the child about 73/104 pixels. Portrait's stacked hour/minute arrangement still reads coherently. Cooking/grip and protected-climb snapshots look connected, and automated sequence checks pass all casts, minute/arrival/bout joins, holds, planted slopes, stationary recovery and lifecycle states. The current installed scene/weather also rendered correctly in the separate probe.

## Improvements for the next implementation session

| Priority | Finding and evidence | Suggested next step / acceptance |
| --- | --- | --- |
| P1 | Portrait immersive weather ignores Weather size. At 390×844, changing weatherScale 1→1.2 via prefs.display.weatherScale and applyDisplay left temperature 19px, condition 10px and status 7px unchanged. The portrait CSS overrides the scaled desktop rules. | Use the shared scale in portrait rules, then test both hosted/portable settings changes while keeping time and controls in view. |
| P1 | Firefox normal-mode DPR2 cadence failed locally; low power passed. | Profile real frame sequences at density 2 and sustained native operation; preserve geometry/lifecycle tests and document any quality/performance tradeoff. |
| P2 | Normal Edge follows this host's roughly 120 Hz frames; the scene may spend more energy than an ambient clock needs. | Offer an optional normal frame cap (for example 60) and lower-power quality presets; measure rather than promise battery savings. Keep current low-power default until device acceptance. |
| P2 | Date/condition/status are small compared with the huge time digits; status is 8px landscape and 7px portrait. | Add configurable readable information sizes/contrast, including date, and check touch/legibility at the actual Ally scaling. Current controls retain 44px minimum height. |
| P2 | Daily facts are now behind Daily thought. This is less discoverable for the earlier always-visible learning-clock use. | Offer an optional gentle automatic fact reveal or compact fact line; retain immersive art and touch lock, and test long facts/pause/reduced motion. |
| P2 | Night scene remains broadly lit even with a dark sky; the inspection snapshot deliberately disabled night dimming. Camp activity continues at 23:08, while sleeping is currently scheduled before 06:00. | Review actual dimmed nighttime brightness and configurable quiet hours. Consider darker material palettes and a quiet bedtime option, while retaining readable time. Do not claim burn-in prevention from drift alone. |
| P3 | Scene story text near the busy camp floor has less contrast than the date/weather panels. | Try a restrained backdrop/outline or placement clear of characters; compare handheld and portrait, not just desktop. |

These are measured issues or clearly labeled design suggestions, not implemented fixes. No new theme, persistent history, physics engine, merge or release was added.

## Milestones and next handoff

Installed and restarted: complete. Functional hosted/portable evidence: complete. Full local suite: blocked by recorded Firefox cadence failure. Native viewport/DPR/touch, sustained memory/power/heat and Vanadium: pending. Next agent should fetch this review branch, read this message, address the portrait scale bug and profile Firefox DPR2, then publish 005 or later with the new tested revision/checksum and specific Ally checks. Git does not notify a running session automatically.
