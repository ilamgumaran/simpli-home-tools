# Green House 1 — continuous camp task contacts

- Message ID: `2026-10-10-weather-habitat/011`
- Date: `2026-10-16 UTC`
- From: cloud clock development/testing session
- To: repository owner and local Ally session
- Branch: `feature/woodland-weather-habitat`
- Pull request: [PR #11](https://github.com/ilamgumaran/simpli-home-tools/pull/11), draft; based on `feature/woodland-immersive-story`
- Status: full Chrome, Firefox and Edge suites pass; sustained and physical-device acceptance pending

## Candidate and ownership

Application source: `58ac16a8da1b13fc4b10fec0e78f69ca7bf54227`.

Portable `tools/little-orbit/Little Orbit.html` SHA-256: `87dc552b999c7852b717fe041c92e4dfd69f61832beb73dbca30fbee38a726f3`.

This cloud session continued Green House 1 motion work after fetching the branch and finding no new device reply. Planning/review remained with the orchestrator, implementation used Luna, and independent browser validation used Sol 6. The other session should fetch this branch before changing community contacts. Keep local browser profiles and configuration. Published messages 001–010 remain history; reserve `004-ally-to-cloud.md` for device results.

## What changed and why

Sage's previous pose blend started from an unconstrained hand, even when the prior frame held a shelter line, basket, spoon, seed board or flowers. A real SVG browser probe on the previous source reproduced wrist jumps at seven daily boundaries: 4.31 px at 08:00, 5.74 at 11:00, 10.90 at 13:00, 5.22 at 16:00, 5.74 at 17:00, 3.11 at 20:00 and 10.90 at 22:00, at 854×480 DPR1. Bone lengths and ground support stayed fixed, isolating the contact handoff.

The sampler now records the prior routine. The shared community pose helper solves the previous and next task's actual wrist contacts in camp coordinates, blends them over the existing 0.7 seconds, then solves the current arm with fixed bone lengths. Feet remain planted. Spoon, greens and flowers fade through that transition while staying attached to the hand; the spoon remains rigid. The shelter line also returns continuously to its resting endpoint. Mounted tool nodes are retained and cached.

The first integration candidate `ae86554` failed the existing cooking check because its spoon tip referenced a removed field, producing `NaN`. Commit `58ac16a` fixes the rendered length before publication. Only the corrected source/checksum above is the device candidate.

Clock authority, vector art, actor size, frame rates, reduced-motion behavior and cadence gates are unchanged. This slice fixes Sage's routine handoff. Sprout's abrupt day/night pose switch and the small local-midnight breathing-phase reset remain follow-ups; this is not a claim that all character motion is finished.

## Validation

`npm run build`, the pure community checks and `git diff --check` passed. Focused community programs pass on the corrected source in actual Chrome 151, Firefox 153 and Edge 154. Each covers hosted/portable × DPR1/2 at four viewport sizes, all eight routine transitions, original infant support/contact assertions and the immediate stale-query reduced-motion regression. Browser regression commit: `d2e6c36261ff56caa24f2c29df280c12d927987d`.

The combined Chrome/Firefox `npm test` and separate native Edge `npm test` each exited **0**. Both runs passed all eight pure programs. All twelve browser programs and offline portable checks passed in each of the three browsers. No acceptance retry was needed after the corrected source passed its focused checks.

All 18 cadence cases per browser passed: dashboard (4), fullscreen Woodland (6), and rainy Green House 1 (8). Their real 2.1-second samples retain the original limits: low power ≥26 updates/s with p95 ≤46 ms; normal ≥45 updates/s with p95 ≤31 ms; maximum gap <100 ms. Across each browser's nine cases per mode:

| Browser/mode | Minimum updates/s | Largest p95 gap | Largest single gap |
| --- | --- | --- | --- |
| Chrome, low | 29.99 | 34.1 ms | 38.1 ms |
| Chrome, normal | 59.99 | 20.5 ms | 34.6 ms |
| Firefox, low | 29.75 | 36 ms | 43 ms |
| Firefox, normal | 57.37 | 23 ms | 42 ms |
| Edge, low | 30.00 | 34.5 ms | 46.1 ms |
| Edge, normal | 59.99 | 19.3 ms | 28.2 ms |

Native binaries were Chrome `151.0.7922.34`, Firefox `153` and Edge `154.0.4258.53`. Browser/performance work ran sequentially with no competing builds. Final logs are `/workspace/.onboarding/clock-sage-npm-combined-58ac16a.log` and `/workspace/.onboarding/clock-sage-npm-edge-58ac16a.log`; focused per-engine logs share the `clock-sage-` prefix. These paths describe retained cloud diagnostics; this message is the portable Git record. No final-run programs or cadence cases were left unrun.

These clean runs do not establish that the earlier intermittent rendering-handoff stalls are resolved by the contact change. The current improvement has direct old/new evidence for wrist continuity; no equivalent causal rendering-stall claim is made. Sustained and physical-device acceptance remain open.

Firefox initially stalled before reaching the application when diagnostic launches omitted the documented writable XDG paths and `MOZ_DISABLE_CONTENT_SANDBOX=1`; native Firefox launched and completed its checks after applying the existing shared test environment. Startup attempts are not application passes or cadence measurements.

The new browser regression measures actual painted wrists, limbs, feet, tool geometry/opacity and shelter-line endpoints at all eight daily routine boundaries and at the end of each blend. It covers hosted/portable × DPR1/2 at four viewport sizes. It does not infer continuity from helper metadata.

A separate shared-SVG-definitions experiment did not show a useful Chrome DPR2 cadence improvement, so that prototype is not included. The rendering stalls documented in [010](010-cloud-clock-rendering-results.md) remain historical failures and a separate investigation; current passing short samples do not erase those observations.

## Device handoff and next work

Follow the [Ally handoff](../../tools/little-orbit/design/ALLY-TEST-HANDOFF.md), verifying this source is an ancestor of HEAD and the portable checksum matches. Observe task changes near 08:00, 11:00, 13:00, 17:00, 20:00 and 22:00 in addition to sustained low/normal motion, weather and pause/reduced-motion behavior. Actual Ally, Vanadium and sustained-operation acceptance remain unrun here. Keep PR #11 draft; no merge, release or device installation was performed.

Next motion work: blend Sprout's play/sleep transition using the scene's actual 07:00/19:00 daylight boundaries, remove the midnight breathing discontinuity, and continue isolating rendering-handoff stalls without weakening the motion checks. Other themes and persistent family/ecosystem simulation remain deferred. Use message `012` for the next cloud follow-up after this message is published.
