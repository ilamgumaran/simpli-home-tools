<!-- SPDX-License-Identifier: LicenseRef-Simpli-Noncommercial-1.0 -->
# High-density rain cadence investigation

Status: reading-camera candidate, 2026-10-29. Runtime `9993133` preserves art
and acceptance thresholds; its measurements and implementation are below.
[Session 028](../../../sessions/2026-10-10-weather-habitat/028-reading-camera-results.md)
records candidate validation. The original 2026-10-21 investigation is preserved
below, and [session 025](../../../sessions/2026-10-10-weather-habitat/025-cadence-verification-handoff.md)
retains the earlier runtime's failed result and open PR gates.

## Trigger

The combined Chrome/Firefox suite failed Firefox hosted Green House 1 rain at
1280×720, DPR2, normal mode: 53.81 geometry updates/s, p95 gap 33 ms, maximum
40 ms. Only p95 failed (limit 31 ms). Separate successful samples do not replace
this outcome. Normal pacing accepts every delivered callback.

## Method and bounded observations

One local sequential probe used the existing browser runtime launcher, Firefox
headless, real RAF/timers, 1280×720 DPR2 and mocked Open-Meteo weather code 65.
Settings selected `greenhouse1`, immersive, care/rest/night off and 24-hour time.
An advancing Date began at `2026-10-05T10:08:05-04:00`, with New York timezone.
Each app case launched a fresh browser, warmed a blank page for 4 seconds,
loaded the scene, awaited rain/fonts, then settled for 1 second. Low power and
normal were sampled in that order for 2100 ms each.

Network interception instrumented `woodland-immersive.js` in memory only:
record loop entry, skipped cadence decisions and `performance.now()` around
`draw()`. Every source replacement required exactly one matching anchor.
A concurrent independent RAF observer recorded nominal timestamps and callback
start times; a MutationObserver recorded changes to the first weather particle's
transform. Main-page HTTP 200 and no page errors were required. External requests
were blocked except the mocked weather response. No production files changed.

Cases were current full art; current art with only `frame-cadence.js` replaced by
the Git version at `897d0b042b09f1a11d49fbf58a7c91a2de82c58e`; current art hidden
using `visibility:hidden` on world, weather, reading, actors and light layers;
and an isolated blank DPR2 control. The blank sample's actual elapsed time was
2358 ms, and its rates use that measured denominator. Rates below also use each
sample's actual elapsed time; p95 uses sorted gaps at index floor(length × .95).

| Case, normal mode | Native callbacks/s | Nominal RAF p95 (ms) | Callback-start p95 (ms) | Particle updates/s | Particle p95 (ms) | Draw CPU p95 (ms) | Intentional skips |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Current full rain | 56.64 | 32.64 | 24 | 57.59 | 24 | 2 | 0 |
| Earlier pacing, full rain | 56.19 | 33.28 | 26 | 57.14 | 26 | 2 | 0 |
| Current art hidden | 59.52 | 17.26 | 18 | 60.00 | 18 | 2 | 0 |
| Blank | 60.65 | 17.16 | 18 | — | — | — | — |

Current full-rain low power recorded 126 native callbacks and 63 draws, 63
intentional skips; particle updates measured 30.46/s, p95 34 ms, maximum 37 ms.
The earlier policy's low-power sample measured 30.46 particle updates/s, p95
36 ms, maximum 42 ms. Synchronous scene refreshes can add geometry writes outside
the paced loop, so particle counts are not presented-frame counts.

The probe exited 0 because measurement completed. It did not reproduce the
original failing particle p95 and is not a gate pass. One sequential sample per
case cannot separate scene paint cost from host variability or instrumentation
overhead. Low draw CPU does not measure deferred rasterization/compositing.
Hidden art is a diagnostic control, never a proposed visual downgrade.

## Next implementation tasks

1. **Measure:** repeat matched full-rain/hidden/blank controls in balanced order,
   recording browser version, actual elapsed time, native delivery, geometry
   changes and paint/compositing traces. Retain all samples and the original
   failure. Keep hosted and portable results distinct.
2. **Profile and propose:** identify a demonstrated expensive layer/property at
   DPR2. Propose one bounded change with before/after evidence and identical art,
   camera/weather behavior, character contacts and readable digits. Do not infer
   a regression in normal pacing from the single failed sample.
3. **Implement and review:** use a lighter execution model for that bounded
   change and independent Sol 6 validation. Rebuild the portable file and run
   relevant functional checks plus required full suites. Preserve original gates
   and report failures without retrying them away.
4. **Integrate:** resolve Windows/macOS required cadence checks separately;
   blank macOS frame losses are already documented in the [pacing design](FRAME-CADENCE.md).
   Keep PR #16 draft until ready. Ally/Vanadium and sustained display acceptance
   remain separate from cloud SVG-write measurements. Resume A2 anatomy art
   after the current validation boundary is resolved or the owner reprioritizes.

## Balanced layer measurements — 2026-10-29

The owner resumed this clock task independently of pending Search Simpli Mac
packaging. A fresh sequential Firefox 153.0 / Playwright 1.62.1 experiment on
Linux compared the unchanged runtime at `8da5c744` in 21 cases. All samples,
including raw timing gaps and page errors, are preserved in
[the JSON report](evidence/rain-layers-2026-10-29.json). This is measurement
completion, not a passing application suite or physical-display acceptance.

Each case used a fresh headless browser, four-second blank warm-up, a
1280×720 viewport at DPR2, mocked weather code 65, an advancing Date starting at
10:08:05 on the authored test day, normal mode, font readiness and one-second
scene settling. Native RAF, callback start times, scene loop/draw CPU and first
particle attribute changes were measured for the actual elapsed duration
(target 2100 ms). In-memory source instrumentation had exact-match guards. The
rain fixture produced 20 visible particles. No production file changed during
the experiment.

Three balanced blocks rotated full/hidden/blank controls. Two passes omitted
one layer at a time in forward/reverse order, each ending with a full-scene
anchor. Hidden layers kept their geometry updates running. Reported slow-gap
counts below use native nominal RAF gaps >=25 ms, a diagnostic statistic, not
a replacement acceptance threshold. Samples remain separate rather than pooled.

| Case | Native callbacks/s | Native p95 gap, ms | Slow gaps / all gaps |
| --- | --- | --- | --- |
| Full controls | 54.74 / 55.69 / 59.86 | 33.28 / 33.28 / 17.16 | 11/114 / 9/116 / 0/125 |
| All immersive art hidden | 59.97 / 59.02 / 59.97 | 17.16 / 17.14 / 17.18 | 0/125 / 1/123 / 0/125 |
| Blank | 60.45 / 60.89 / 60.92 | 17.16 / 17.16 / 17.14 | 0/126 / 0/127 / 0/127 |
| World hidden | 56.67 / 60.00 | 17.18 / 17.14 | 5/118 / 0/125 |
| Rain hidden | 58.07 / 56.67 | 17.46 / 33.22 | 4/121 / 6/118 |
| Reading/digits hidden | 59.02 / 59.50 | 17.20 / 17.24 | 2/123 / 1/124 |
| Characters hidden | 57.14 / 57.90 | 32.70 / 17.32 | 6/119 / 4/121 |
| Light hidden | 59.50 / 58.54 | 17.26 / 17.32 | 1/124 / 3/122 |
| Adjacent full anchors | 57.51 / 56.19 | 32.54 / 33.24 | 6/120 / 8/117 |

Draw CPU p95 remained 1–2 ms. Hidden reading/light cases consistently had fewer
slow gaps than adjacent full anchors, but these omissions also reduce total
composition work. The data do not isolate a sole expensive property or show
that characters/rain alone cause the slowdown. Native RAF timestamps and DOM
mutations do not measure raster/compositor presentation. Investigate a bounded
camera/layer intervention with identical output before changing runtime art.

## Reading-camera candidate

A second, separate phase compared seven interventions in forward/reverse order
(14 fresh-browser samples). It retained the previous fixture and timings. The
[in-memory transform report](evidence/rain-transforms-2026-10-29.json) preserves
all results. This phase had a slower baseline than the first phase; comparisons
are within this phase only.

| Intervention | Native callbacks/s, forward / reverse | Particle-update p95, ms, forward / reverse |
| --- | --- | --- |
| Original transforms | 51.88 / 53.81 | 27 / 26 |
| Reading SVG `translate3d(x,y,0)` only | 57.14 / 57.14 | 22 / 20 |
| Light layer `translate3d(x,y,0)` only | 57.59 / 57.62 | 23 / 23 |
| Both layers `translate3d(x,y,0)` | 52.81 / 56.67 | 28 / 23 |
| Reading `will-change:auto` | 50.93 / 53.31 | 28 / 27 |
| Light `will-change:auto` | 55.24 / 52.86 | 26 / 31 |
| Both `will-change:auto` | 50.93 / 54.71 | 25 / 28 |

Initial candidate runtime `3daae2a` applied only the reading SVG's zero-depth transform.
The existing quantized x/y coordinates and equality guard are retained; the
other four layers keep their planar transforms. Artwork, camera path, layout,
weather, gait, contacts and timing thresholds are unchanged. Single-layer light
promotion was also promising, but applying both was inconsistent; this candidate
keeps the intervention bounded to the reading/clock layer.

Two samples do not establish long-run performance or the paint/compositing
mechanism. Direct paint tracing was not captured. Native nominal RAF p95 remains
around 33 ms in some cases; that is **not** the app's <=31 ms particle-mutation
p95 assertion. Both targeted baseline and candidate particle samples meet that
assertion. These diagnostic results therefore do not prove that the historical
failed application test is fixed. Candidate-specific full-suite outcomes belong
in the next session handoff, preserving the earlier failure.

The reusable hosted diagnostic is `tests/diagnose-rain-layers.cjs`:

```sh
cd tools/little-orbit
CLOCK_TEST_BROWSER=firefox node tests/diagnose-rain-layers.cjs
```

It defaults to Firefox, respects the existing runtime/browser installation
overrides, and writes `test-results/rain-layer-profile.json`; set
`CLOCK_RAIN_REPORT` to select another report path. The report identifies the
source revision, browser/version, fixed authored time, all 21 cases and raw gaps.
Errors are retained and return a failing exit status. Successful completion
means measurements were captured, not application acceptance. Hosted and
portable validation remain separate; this diagnostic does not replace either.

## Moving-only scope correction

The first full suite at `3daae2a` passed Firefox DPR2 rain (particle p95 22 ms)
but failed the final portable DPR2 normal active-meal case (Sage transform p95
37 ms). [Session 028](../../../sessions/2026-10-10-weather-habitat/028-reading-camera-results.md)
retains that failed combined run. A [six-case matched meal comparison](evidence/reading-meal-compare-2026-10-29.json)
then passed all 12 low/normal diagnostic samples for baseline and candidate;
it did not reproduce or explain the failure.

Final candidate `9993133` scopes the reading-layer intervention to a moving
camera, the condition measured in the original targeted rain phase. Still and
reduced-motion paths use the original planar transforms on all five layers.
The cache key includes movement state, so a mode change at identical quantized
coordinates still updates the reading style. A hosted/portable regression test
switches moving → Still → moving → reduced motion at zero coordinates and
checks transform type, zero-depth geometry and quiet scheduling. Focused Chrome
and Firefox functional programs pass. This correction does not assert that 3D
promotion caused the earlier meal failure. Final whole-suite results and remaining
hosted gates are in session 028.
