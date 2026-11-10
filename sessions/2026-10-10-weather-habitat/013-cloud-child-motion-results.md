# Green House 1 — continuous play, sleep and breathing

- Message ID: `2026-10-10-weather-habitat/013`
- Date: `2026-10-17 UTC`
- From: cloud clock development/testing session
- To: repository owner and local Ally session
- Branch: `feature/woodland-weather-habitat`, [draft PR #11](https://github.com/ilamgumaran/simpli-home-tools/pull/11)
- Status: full Chrome, Firefox and Edge suites pass; sustained/device acceptance pending

## Version and changes

Runtime source: `b0c364743c355749185505491c64e8b7a15c033f`.

Portable `tools/little-orbit/Little Orbit.html` SHA-256: `a5d68f51ea0506650ecad516e0d7d7315a4701794b64777b3cfcf64c546f46b8`.

Sprout now blends between sand play and sleep over 0.7 seconds at Green House 1's 07:00/19:00 light boundaries. Shared woodland daylight metadata drives both the scene and child schedule. The community sampler keeps its existing 06:00/20:00 defaults when no schedule is supplied, honors explicit night overrides, and supports fractional hours internally; this adds no user setting.

The transition solves fixed-length limbs and keeps both feet on the camp plane. The mounted sand stick follows the actual blended hand and fades through the change; its authored offset is preserved. The existing eye strokes morph between open and closed forms. Cached nodes and guarded attributes retain the steady-frame path, and reduced motion keeps Sprout still with the stick hidden.

Subtle body, face, headwear and equipment movement now uses an absolute-time phase. Midnight and daylight-saving changes no longer reset that phase. Local clock/calendar and authored routine timing remain authoritative. Sage's previous contact fix, supported infant care, detailed artwork and original frame rates are retained.

## Evidence and validation

The independent browser regression fails on immutable predecessor `3357bce` at both 07:00 and 19:00: painted child joints jump across a two-millisecond interval. Separate old-source probes also fail at local midnight, spring DST and fall DST because actual body-layer matrices reset. The largest normalized matrix-component differences were approximately 0.0308, 0.0445 and 0.0528 respectively; these are SVG matrix measurements, not physical screen-presentation evidence.

The new checks measure painted joints, eyes, hand/stick contact and opacity at each transition's start, interior and end, across four viewports, DPR1/2 and hosted/portable forms. They also check fixed bones, planted feet, quiet child behavior, and normalized body/face/headwear/equipment screen matrices across midnight and the two New York DST boundaries. Existing Sage, infant support, weather and cadence assertions remain.

`npm run build`, pure community/world checks and `git diff --check` passed. Focused community programs passed in actual Chrome 151, Firefox 153 and Edge 154: each completed all fourteen result groups, including hosted/portable × DPR1/2 for original community, Sage transitions and the new Sprout checks, plus immediate reduced-motion regressions in both forms. Browser regression revision: `17fc2dc`.

The combined Chrome/Firefox `npm test` and separate native Edge `npm test` each exited **0**, without retries. Both runs passed all eight pure programs. All twelve browser programs and offline portable checks passed in each of the three browsers. No final-run programs were left unrun.

All 18 cadence cases per browser passed: four dashboard, six immersive Woodland and eight rainy habitat cases. Real 2.1-second samples retain the original limits: low power ≥26 updates/s with p95 ≤46 ms; normal ≥45 updates/s with p95 ≤31 ms; maximum gap <100 ms. Across each browser's nine cases per mode:

| Browser/mode | Minimum updates/s | Largest p95 gap | Largest single gap |
| --- | --- | --- | --- |
| Chrome, low | 29.98 | 33.9 ms | 36.1 ms |
| Chrome, normal | 60.00 | 18.1 ms | 23.3 ms |
| Firefox, low | 29.90 | 35 ms | 38 ms |
| Firefox, normal | 59.97 | 22 ms | 31 ms |
| Edge, low | 29.99 | 35.6 ms | 48.7 ms |
| Edge, normal | 59.99 | 18.9 ms | 37.4 ms |

Native binaries: Chrome `151.0.7922.34`, Firefox `153`, Edge `154.0.4258.53`. Browsers ran sequentially without competing builds. Private cloud logs are `/workspace/.onboarding/clock-sprout-full-chrome-firefox.log` and `/workspace/.onboarding/clock-sprout-full-edge.log`; old-source failure probes and focused runs share the `clock-sprout-` prefix. This message preserves the results in Git. Mock dawn/dusk captures at +350 ms show the intermediate eye path and stick opacity 0.5; captures remain outside Git.

## Git and device handoff

[012](012-cloud-child-motion-ownership.md) records resumed ownership and the plan. [011](011-cloud-camp-contact-motion.md) is the historical Sage-contact candidate. Planning/review stayed with the orchestrator, implementation used Luna, and independent browser checks used Sol 6. Published numbered messages remain immutable; use `014` for the next follow-up.

Follow the [Ally handoff](../../tools/little-orbit/design/ALLY-TEST-HANDOFF.md), preserving local profiles/configuration. Verify this runtime is an ancestor of HEAD and the portable checksum matches; later documentation/test commits can advance HEAD. Observe Sprout just before and during 07:00/19:00, quiet mode and pause/resume, alongside sustained low/normal/rain motion. Return findings in reserved `004-ally-to-cloud.md`.

Sustained Ally/Vanadium acceptance remains unrun. Earlier intermittent rendering stalls remain unexplained; short automated cadence samples do not establish their cause or resolution. Keep PR #11 draft. No merge, release or device installation was performed. Other themes and persistent ecosystem/family simulation remain deferred; further camp-activity choreography is follow-up work.
