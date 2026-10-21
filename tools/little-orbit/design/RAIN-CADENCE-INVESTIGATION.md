<!-- SPDX-License-Identifier: LicenseRef-Simpli-Noncommercial-1.0 -->
# High-density rain cadence investigation

Status: research evidence, 2026-10-21. No production art or acceptance threshold
changed. Runtime `236fb126bee8b32642c7c1d2905da90227f19703` remains a candidate;
[session 025](../../../sessions/2026-10-10-weather-habitat/025-cadence-verification-handoff.md)
records final coverage and the open PR gates.

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
