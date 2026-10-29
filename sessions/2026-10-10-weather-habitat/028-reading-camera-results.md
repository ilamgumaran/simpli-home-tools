<!-- SPDX-License-Identifier: LicenseRef-Simpli-Noncommercial-1.0 -->
# Reading-camera candidate — measurement and validation

- Message ID: `2026-10-10-weather-habitat/028`
- Date: `2026-10-29 UTC`
- From: cloud clock orchestrator
- To: owner and implementation/device sessions
- Branch: `feature/anatomy-foundation`, [draft PR #16](https://github.com/ilamgumaran/simpli-home-tools/pull/16)
- Runtime: `99931338f12d5111ea0321cc2690d6588ef59ab9`
- Baseline: `1628b82` (same runtime bytes as `8da5c74`)
- Previous: [027 — resumed ownership](027-rain-profiling-resumed.md)
- Status: candidate pushed; final validation outcomes recorded below

## Change and evidence

While the camera moves, only the reading/clock SVG follows it with
`translate3d(x,y,0px)`. The other four layers retain `translate(x,y)`. Both paths
use the same quantized x/y coordinates and equality guard; Still and reduced-motion
modes use planar transforms on all five. Scene art, weather,
layer order, contacts, gait, quiet states and acceptance thresholds are unchanged.
The generated portable clock is committed with source.

Portable SHA-256:
`1e36b79704ac3046230644555ffc5fc691cc5229ac2df067a61d2901e0169d8b`.

[The investigation](../../tools/little-orbit/design/RAIN-CADENCE-INVESTIGATION.md)
records 21 balanced layer measurements and 14 targeted transform samples, all
retained as JSON. Sol 6 performed the sequential measurements; a lighter model
implemented the bounded setter and diagnostic. A different lighter-model agent
reviewed source independently; the integrator owns visual/full-suite validation.
No unresolved source-review finding remains. The review's wording correction
(reading/clock layer also contains date/weather atmosphere) is incorporated.

In the targeted phase, native callback rates were 51.88/53.81 per second for the
two baseline samples versus 57.14/57.14 for the reading-only intervention.
Particle-update p95 was 27/26 ms versus 22/20 ms. Both baseline and candidate
particle samples already meet the 31 ms assertion; native nominal gaps around
33 ms do not themselves fail that app assertion. This is small-sample evidence
for a bounded candidate, not proof that the historical suite failure is fixed.
Neither applying both layer interventions nor removing `will-change` produced
consistent benefits. Direct paint/compositing traces were not captured.

## Visual and geometry parity

The integrator compared initial candidate `3daae2a` against in-memory baseline source
at the same authored time and mocked rain. Chrome for Testing 151.0.7922.34 and Firefox
153.0 each passed 24 hosted pairs (four viewport sizes × DPR1/2 × moving, still
and reduced-motion modes), plus two portable pairs (1280×720 DPR2 moving and
390×844 DPR1 reduced motion). Across all **52 pairs**, PNG bytes, x/y matrices,
landmark bounds and layer markup are identical, with no page errors. The
[parity report with image hashes](../../tools/little-orbit/design/evidence/reading-camera-initial-parity-2026-10-29.json)
keeps these results without depending on private local image paths.

The same 52 comparisons were repeated after the moving-only correction at
`9993133`: both browser runs exited 0, all image bytes/geometry/markup still
match the baseline, and no page error occurred. The [final parity report](../../tools/little-orbit/design/evidence/reading-camera-parity-2026-10-29.json)
pins the final runtime independently of the initial candidate's evidence.

Diagnostic setup corrections are separate from application failures: the first
Firefox harness lacked the content-sandbox environment setting used by the
successful measurements and stalled before loading the app; it was terminated.
The comparison helper was corrected to read SVG matrix fields directly because
Firefox does not provide `getScreenCTM().toJSON()`, and to accept local-file
navigation without an HTTP response. The first hosted comparison completed all
24 pairs before the local-file HTTP assumption stopped it; the remaining two
portable pairs then completed separately. These are fixed helper/setup issues,
not hidden successful full runs or changes to application acceptance tests.

## Still-camera scope correction

The first full combined Chrome/Firefox run at `3daae2a` exited **1**. Chrome
passed all 22 cadence cases; Firefox passed 21 and failed the final portable
1280×720 DPR2 normal active-meal case: 51.43 updates/s, p95 37 ms (limit 31),
maximum 54 ms. All 14 programs per browser were reached and their functional sections passed;
the runner
stopped before its final offline program. Firefox hosted DPR2 normal rain passed
at 58.57 updates/s, p95 22 ms, maximum 40 ms. This failure remains recorded.

A [six-case matched portable meal comparison](../../tools/little-orbit/design/evidence/reading-meal-compare-2026-10-29.json) then used fresh browsers in
baseline/candidate, candidate/baseline, baseline/candidate order, preserving the
existing four-second warm-up, one-second settling and 2100 ms low/normal
samples. All 12 diagnostic samples passed the unchanged timing bounds. Baseline
normal p95 values were 24/21/19 ms; candidate normal values were 24/19/21 ms.
These samples do not reproduce or explain the full-run 37 ms failure and do
not convert that failed run into a pass.

The optimization is therefore narrowed to its measured scope: moving camera
only. Still and reduced-motion modes use the original planar transform on all
five layers. The cache includes movement state so a mode switch at the same
quantized x/y coordinates still updates the reading transform. This is a scope
correction, not a claim that layer promotion caused the meal failure.

## Full validation

At final runtime `9993133`, `npm run build` passes. The fresh combined native
Chrome/Firefox `npm test` run exits **0**: all 11 pure programs, all 14 browser
programs per engine, all 44 cadence cases and both final offline checks pass.
Firefox portable DPR2 normal active-meal delivery records 61.25 updates/s,
p95 20 ms, maximum 20 ms. This is a new source-specific result; the earlier
`3daae2a` failure remains recorded above. Focused moving/Still/reduced-motion
cache checks also pass in Chrome and Firefox.

Native Edge 154.0.4258.53 `npm test` also exits **0**: all 11 pure programs,
14 browser programs, 22 cadence cases and the final offline check pass. Final
local cadence coverage is **66/66** across Chrome, Firefox and Edge, with hosted
and portable forms exercised. Chrome is 151.0.7922.34, Firefox 153.0, Playwright
1.62.1 and Node 24.19.0 on Linux. These source-specific passing results do not
erase the earlier failed source run or replace hosted/physical acceptance.

The reusable `tests/diagnose-rain-layers.cjs` completes all 21 cases with exit
**0**, no page/measurement errors, fixed authored time, correct Firefox/version
and harness SHA-256 in its report. The [complete report](../../tools/little-orbit/design/evidence/reading-camera-diagnostic-2026-10-29.json)
retains every raw timing gap, including slow native callbacks; completion is
not a timing-gate pass. An unsupported-browser check returns exit 1 with an
incomplete structured report as intended. Syntax, whitespace, JSON and local
link/fence checks also pass.

[Machine-readable final validation](../../tools/little-orbit/design/evidence/reading-camera-validation-2026-10-29.json)
pins all 66 cadence records, exact job exits, the portable checksum, browser
versions, final parity and the retained initial failure. Local full-run logs are
`clock-reading-final-full-chrome-firefox.log` and `clock-reading-final-edge.log`
under the cloud workspace's `.onboarding` directory. That directory is not a
Git artifact; the summaries and raw evidence linked above survive in Git.
No merge or release is claimed.

Final-runtime hosted [run 40811984797](https://github.com/ilamgumaran/simpli-home-tools/actions/runs/40811984797)
at `9993133` reports Ubuntu success, Windows failure and macOS failure. Windows
stops in Firefox Time Climber II (`verify-mountain.cjs`) with a 30-second page
navigation timeout. macOS fails Chromium dashboard low power: 27.95 geometry
updates/s, p95 53.9 ms, maximum 55.1 ms; native delivery is 55.43 callbacks/s.
These outcomes differ from the earlier Windows rain failure; an identical root
cause is not established. Neither timeout nor cadence assertions were relaxed.
The [duplicate push run 40811993306](https://github.com/ilamgumaran/simpli-home-tools/actions/runs/40811993306)
also passes Ubuntu and fails Windows/macOS. Its Windows failure is Firefox
1280×720 DPR2 low-power rain: 29.99 particle updates/s, p95 47 ms (limit 46),
maximum 48 ms. The bounded annotation does not identify hosted versus portable
for that case; it is not inferred here. These are separate run outcomes.

Earlier candidate evidence follows for continuity. At runtime `3daae2a`, hosted [run 40809056843](https://github.com/ilamgumaran/simpli-home-tools/actions/runs/40809056843)
reports Ubuntu success, Windows failure and macOS failure. Windows reaches
Firefox rain but fails hosted 854×480 DPR1 low power: 29.45 particle updates/s,
p95 47 ms (limit 46), maximum 48 ms. macOS fails Chromium dashboard low power:
27.07 geometry updates/s, p95 54.6 ms, maximum 58.5 ms; native delivery was
54.15 callbacks/s. These named failures are retained, without relaxing thresholds
or assuming the Windows/macOS underlying causes are identical to prior runs.
The separate push-triggered run also has platform failures; passing local
checks do not override either hosted run.

## Continuation

Message 025 remains historical evidence; its failed Firefox rain sample is not
erased by later results. PR #16 remains draft while required hosted checks fail.
Physical Ally/Vanadium and sustained-display acceptance remain unrun; DOM writes,
static screenshot equality and native callback counts do not confirm presented
frames. A2 hand/foot artwork and A3/A4 contact/gait migration remain later stages.

Next engineering work is the remaining hosted timing boundary: capture the
Windows navigation timeout and recorded low-power rain callback sequence
before choosing another limiter or
layer change, and continue the macOS native-delivery control investigation.
Retain current gates and original failures. Do not apply another layer's 3D
transform simply because its individual diagnostic looked promising; the
combined intervention was inconsistent. Resume A2 artwork after this boundary
is resolved or the owner explicitly reprioritizes it.

For a device test, fetch `feature/anatomy-foundation`, verify that runtime
`9993133` is an ancestor of HEAD and the portable checksum matches this message.
Preserve the currently installed/tested build and local configuration. This is a
candidate handoff, not an instruction to replace the installed build or claim a
stable release. Message 026 remains reserved for device feedback; after 028 is
published, use 029 for a follow-up.
