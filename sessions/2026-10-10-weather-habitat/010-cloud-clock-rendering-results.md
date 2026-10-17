# Green House 1 — reduced-motion fix and rendering validation

- Message ID: `2026-10-10-weather-habitat/010`
- Date: `2026-10-15 UTC`
- From: cloud clock development/testing session
- To: repository owner and local Ally session
- Branch: `feature/woodland-weather-habitat`
- Pull request: [PR #11](https://github.com/ilamgumaran/simpli-home-tools/pull/11), draft; based on `feature/woodland-immersive-story`
- Status: functional checks passed; motion acceptance remains blocked by cadence failures

## Version to test

Application source: `c827dba952f2873386fc78f4f7b5892b78bc29ba`.

Portable `tools/little-orbit/Little Orbit.html` SHA-256: `00fbf20cba9b1e19a2d22943cf6dc318d21281946dd7ee9db4a31bfcc711d2c4`.

Test fixture follow-up: `48e4b350f31ae2ff2e4e1feaa85b291483e95fa2`. It changes no application source or portable bytes. Later documentation commits may advance HEAD; verify that the source revision is an ancestor and that the portable checksum matches.

## Changes

- Green House 1 samples the shared clock/terrain base without allocating unused Woodland climbing, engineering, helper and craft snapshots each frame. Woodland retains its full story model and public timing API.
- The solid light wash uses a CSS color surface with the same color, oversized bounds, camera transform and animated SVG-root opacity. Detailed vector landscapes, characters and clock art remain.
- Scene synchronization reads the current reduced-motion preference before drawing, then reuses that value across animation frames. The retained preference-change listener still responds to live changes. This fixes the first refresh using an outdated retained media query.

Delaying one retained query read reproduced the old infant movement of approximately 0.15 CSS px between reduced-motion snapshots. The fix kept identical painted infant bounds and caregiver hand support. An independent regression simulates stale retained queries while fresh queries report reduced motion, asserting immediate animation stop, frozen poses and stable infant support. A private Firefox comparison fails on the old runtime. The committed regression passes on the current one in hosted and portable forms across all three browsers.

Motion rates, quantization, original assertions and cadence limits were not relaxed. The CSS light component had 16 pixel-exact controlled comparisons on predecessor `f0aaaecf`, across four viewports, DPR 1/2 and extreme camera offsets; that component is unchanged in current source. This component evidence does not establish motion acceptance.

## Current verification

Actual native binaries: Chrome `151.0.7922.34`, Edge `154.0.4258.53`, Firefox `153`. Engines ran sequentially without competing browser/build work.

`npm run build` passed. All eight pure test programs passed in each full run on application source `c827dba9`. The combined Chrome/Firefox runner, separate Firefox runner and separate Edge runner each exited **1**. Programs left unrun by those failures were executed individually; their failures remain failures.

| Browser program | Chrome | Firefox | Edge |
| --- | --- | --- | --- |
| Seven base programs: clock, themes, config, climber, mountain, characters, Woodland | PASS | PASS | PASS |
| Dashboard motion | FAIL: portable normal max gap 155.5 ms | FAIL: hosted low max gap 105 ms | PASS |
| Fullscreen Woodland functional | PASS | PASS | PASS |
| Fullscreen Woodland motion | FAIL: hosted 1280×720 DPR2 normal max gap 131 ms | FAIL: hosted 854×480 DPR1 low max gap 174 ms | PASS |
| Community, including immediate stale-query regression | PASS | PASS | PASS |
| Offline portable verifier | PASS | PASS | PASS |

The community program covered hosted/portable × DPR 1/2, each at four viewports and nine sampled hours, plus the new hosted/portable regression. It checks infant head/body support, proportions, crop/projection, routines, tools, child supervision and quiet lifecycle.

The unchanged motion limits are at least 26 updates/s and p95 ≤46 ms in low power, at least 45 updates/s and p95 ≤31 ms in normal mode, and maximum gap <100 ms. Samples retain real 2.1-second windows. Geometry-update cadence is not proof of physical presentation.

### Weather and cache fixture

The original Chrome weather program passed hosted functionality, then timed out waiting for restored cached weather in the portable form. A catch-only diagnostic reproduced it on the original on-disk portable file: the saved fixture contained a valid forecast maximum `[73]`, while the reloaded document still stored the deliberately invalid `[null]` entry. Keys, units and location matched; there were no page errors. The clock correctly reported unavailable weather for that invalid entry.

Commit `48e4b35` seeds the restored fixture before the next document starts, avoiding an immediate file-URL storage-write/reload race. The earlier test of actual live-cache persistence across reload and the malformed-cache rejection assertion remain unchanged. No weather application logic, assertion, deadline or cadence limit changed.

The affected exact weather program was then run in all three browsers. Hosted and portable functional checks **passed in Chrome, Firefox and Edge**, including restored cache, rain/snow, temperature units, loading/stale states, location-response races and quiet lifecycle. Each program still exited **1** at a cadence gate:

| Browser | First rain-cadence failure after fixture fix | Updates/s | p95 gap | Maximum gap |
| --- | --- | --- | --- | --- |
| Chrome | Hosted 1280×720 DPR2, low power | 0.80 | 978.6 ms | 978.6 ms |
| Firefox | Hosted 854×480 DPR1, normal | 56.69 | 32 ms | 50 ms |
| Edge | Hosted 854×480 DPR1, low power | 29.04 | 36.6 ms | 116.7 ms |

Chrome passed both hosted DPR1 rain cases before its failure; Firefox passed hosted DPR1 low power. Subsequent rain cases were **unrun** after each first failure. Earlier same-runtime runs also missed high-DPI rain p95 gates in Firefox and Edge. No successful diagnostic or fixture follow-up erases those failed runs.

Full/standalone records are `/workspace/.onboarding/clock-c827-*.log`; affected fixture records are `/workspace/.onboarding/clock-48e4-weather-{chrome,firefox,edge}.log`. These paths describe retained cloud diagnostics; the results above are the portable Git record for the device session.

## Remaining work and device handoff

Native Firefox profiling localized a long pause mostly to a WebRender rendering-handoff wait: about 130 ms wall time with approximately 8 ms content-thread CPU, inside a 135 ms paint flush. No GC/CC/JIT coincided with that pause. The responsible rendering subtree remains unproven. A private dashboard comparison failed with zero fresh media-query calls during the sample, so moving the new preference query was rejected as a fix for that stall.

This cloud has no attached `/dev/dri` graphics device, and headless Firefox WebGL is unavailable. These observations do not prove that hardware rendering resolves the cadence failures. Physical Ally, Vanadium and sustained-operation acceptance remain **unrun**. Keep PR #11 draft; motion acceptance is incomplete.

The local session can fetch this branch and follow the [Ally handoff](../../tools/little-orbit/design/ALLY-TEST-HANDOFF.md). Return device findings in reserved `004-ally-to-cloud.md`: source/checksum, browser/version, CSS viewport/DPR/scaling, hosted or portable form, sustained low/normal motion, weather, reduced motion, pause/resume and rollover behavior. Preserve local profiles and configuration. No merge, release or device installation was performed here.

Earlier investigation remains in immutable [008](008-cloud-motion-results.md) and [009](009-cloud-clock-resumed.md). Preserve published messages; use `011` for the next cloud follow-up. Other themes and persistent ecosystem/family simulation remain deferred.
