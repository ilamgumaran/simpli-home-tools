# Green House 1 — cloud validation results

- Message ID: `2026-10-10-weather-habitat/006`
- Date: `2026-10-12` (UTC)
- From: cloud validation/integration session
- To: local Ally implementation/testing session
- Status: functional weather, community and offline checks passed at the scopes below; motion acceptance failed
- Branch: `feature/woodland-weather-habitat`, based on `feature/woodland-immersive-story`
- Pull request: [PR #11](https://github.com/ilamgumaran/simpli-home-tools/pull/11), draft
- Runtime tested: `a9122c09c4f757a03a4c681dd0322b29e7de8072`
- Portable SHA-256: `ff134b9fa18076df24dbd8a30511514fa2696c75b6ebeb10373714ecca024ff5`
- Documentation baseline: `9e94598`

The Green House 1 runtime and portable artifact are unchanged since `a9122c0`. This handoff adds documentation only; no runtime, test or portable artifact changed, and no rendering prototype is in Git. It supersedes the validation status in [005](005-cloud-rendering-followup.md); messages 001, 003 and 005 remain immutable history. No complete native engine `npm test` suite passed. No merge, release or cloud installation occurred; local device testing may proceed while motion acceptance remains open.

## Current-candidate results

`npm run build` and all eight pure programs passed on the current candidate. The 12 original browser programs ran in each native engine; an extra offline/restricted-storage check also passed in Chrome, Edge and Firefox.

| Browser/version | Original programs | Cadence failures |
| --- | --- | --- |
| Chrome 151.0.7922.34 | **11/12 passed**; `verify-weather-habitat` failed | Rain at hosted 1280×720 DPR2 low power: **29.05 geometry updates/s**, p95 **56.2 ms**, max **70.8 ms**. Rain at 854×480 DPR1 low and normal passed. Weather functionality passed hosted and portable. Community passed separately hosted/portable at DPR1/2. |
| Edge 154.0.4258.53 | **9/12 passed**; `verify-motion`, `verify-immersive-motion` and `verify-weather-habitat` failed | Dashboard portable low power: **27.616/s**, p95 **88.6 ms**, max **119.6 ms**. Immersive hosted 1280×720 DPR2 low power: **25.71/s**, p95 **57.7 ms**, max **72.6 ms**. Weather portable 1280×720 DPR2 low power: **27.61/s**, p95 **58.3 ms**, max **63.9 ms**. Community passed hosted/portable at DPR1/2. |
| Firefox 153.0 | **10/12 passed**; `verify-immersive-motion` and `verify-weather-habitat` failed | Immersive portable 854×480 DPR1 normal: **47.55/s**, p95 **40 ms**, max **179 ms**. Weather hosted 854×480 DPR1 normal: **47.01/s**, p95 **56 ms**, max **181 ms**. Community passed separately. |

Both the combined Chrome+Firefox `npm test` and full Edge `npm test` exited 1. Firefox programs 1–9 exited 0; program 12 community and the additional portable offline check passed separately. Firefox’s failed immersive-motion program passed choreography in both forms, hosted DPR1 low/normal and portable DPR1 low; its weather program passed functionality/cache/unit/location-race checks in both forms and hosted DPR1 low. Each failed program stopped at its first failing cadence assertion, leaving later cases unrun. Chrome community and final portable programs were not reached by its combined run, but their independent checks passed. Edge's additional portable offline/restricted-storage check passed.

Weather functional coverage includes rain layout across four CSS viewports × DPR1/2 in hosted and portable forms; other weather conditions and cache/race cases used representative viewports. Choreography was exercised in both forms. Prior functional/community/offline checks on `80e3f41` belong to an older revision and do not establish this candidate's behavior.

## Cadence limits and rejected probe

The gates are at least **26 geometry updates/s** with p95 at most **46 ms** in low-power mode, and at least **45/s** with p95 at most **31 ms** in normal mode; maximum gap must be below **100 ms**. Samples last **2.1 seconds**. Geometry updates observed through animation frames/timers do not prove physical frame presentation or sustained device performance.

A private 15 fps slow-ambient probe was rejected: **3/8** samples passed versus **5/8** on the original 30 fps baseline. Representative worst gaps were **538 ms** for immersive and **382 ms** for rain; the original 30 fps scenery remains. Other private probes (full-scene Canvas repaint, a 47-element Canvas/DOM split, and one raster-in-SVG prototype reviewed in three visual fixtures) did not resolve cadence and were not adopted. No prototype or private fixture was added to Git. Firefox headless had no usable WebGL context; ordinary headful Firefox on a temporary Xorg display gained Mesa llvmpipe WebGL 1/2, but still failed the unchanged motion gates. That display setup was not adopted as an acceptance workaround.

## Remaining work

- Diagnose the cadence failures, preserve the gates, and rerun affected checks after any authorized fix; complete the skipped later cadence cases.
- Physical Ally, Vanadium and sustained-operation tests remain pending. Preserve device reply slot `004-ally-to-cloud.md`; use `007` for any further cloud results.

Keep PR #11 draft. Do not treat scoped functional passes as motion acceptance or infer untested browser/device results. No merge or release occurred; local device testing may proceed while acceptance is pending, preserving profiles and configuration.
