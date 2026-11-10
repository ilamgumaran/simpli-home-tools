<!-- SPDX-License-Identifier: LicenseRef-Simpli-Noncommercial-1.0 -->
# Corrected pacing verification and remaining gates

- Message ID: `2026-10-10-weather-habitat/025`
- Date: `2026-10-21 UTC`
- From: cloud clock orchestrator
- To: owner, implementation and device sessions
- Branch: `feature/anatomy-foundation`, [draft PR #16](https://github.com/ilamgumaran/simpli-home-tools/pull/16)
- Runtime checkpoint: `236fb126bee8b32642c7c1d2905da90227f19703`
- Previous: [024 — quantized pacing candidate](024-quantized-pacing-candidate.md)
- Status: local coverage completed with one failure; hosted merge gates remain open

## Published implementation

The anatomy foundation and workshop remain additive; existing live wrist/ankle
contacts, art and gait curves are unchanged. Both Woodland renderers use the shared
bounded phase policy. Early callbacks discard timing debt; normal mode accepts
every native callback. Independent geometry, legacy-pose and recorded Windows
callback fixtures accompany the source and portable clock.

Portable `Little Orbit.html` SHA-256:
`23c1d8e2f8b5cb7e462d92aa360b5c94bc6c8423ec4d69ac789330e0188e3406`.
Later diagnostic/workflow/documentation commits do not change these runtime bytes.
The earlier `897d0b0`/`ef7ac...` passing results in 024 are historical; they do not
substitute for this corrected runtime's checks.

## Corrected runtime results

Build and pure cadence/anatomy checks pass. The corrected combined native
Chrome/Firefox npm run exits 1, not 0: Chrome completes all 14 browser programs
and 22 cadence cases; Firefox stops in the weather program after 13 cadence
passes. The failing normal-mode rain case is hosted 1280×720 at DPR2:
53.81 geometry updates/s, p95 gap 33 ms, maximum 40 ms. FPS and maximum gap
pass, but p95 exceeds the unchanged 31 ms limit.

| Browser | Cadence cases | Functional/offline coverage | Full npm result |
| --- | --- | --- | --- |
| Chrome | 22 passed | All 14 browser programs; offline checked separately | Chrome phase passed; combined Chrome/Firefox run exited 1 |
| Firefox | 21 passed, 1 failed | Remaining community, meal and offline checks completed separately | Combined run stopped at hosted DPR2 rain |
| Edge | 22 passed | All 14 browser programs and offline | Native Edge run exited 0 |

All 66 cadence cases were exercised: **65 passed, 1 failed**. The four original
Firefox portable rain cases were completed separately, with unchanged assertions:
DPR1 low/normal p95 35/18 ms; DPR2 low/normal p95 35/27 ms. All eleven pure
programs passed. Completing coverage separately does not turn the failed combined
run into a full pass or erase the original rain failure.

Cloud logs are under `/workspace/.onboarding/`: `cadence-asym-full.log` (exit 1),
`cadence-asym-edge.log` (exit 0), `cadence-asym-firefox-community.log`,
`cadence-asym-firefox-meal.log`, `cadence-asym-firefox-portable.log`,
`cadence-asym-chrome-portable.log` and `rain-portable-remainder.log` (all exit 0).
Those local files are not Git artifacts; the candidate and measured outcomes are
recorded here so another session does not depend on this workspace.

The metrics observe DOM geometry/transform updates using real RAF and timers.
They are useful for detecting missed updates, but do not confirm compositor
presentation or physical-display motion. Physical Ally/Vanadium, sustained
operation and new live-anatomy acceptance remain unrun.

## Hosted checks and controls

At `df7961440d015131dac80c5b828b7cf8ad10b7fb` (same runtime), Ubuntu's required
check passes. Windows Firefox immersive low power fails p95: 29.37 updates/s,
p95 47 ms, maximum 48 ms, against <=46 ms. macOS Chromium dashboard low power
fails p95: 26.57 updates/s, p95 53.7 ms, maximum 54.5 ms; native callback rate
is 53.15/s with nominal p95 33.2 ms. The corresponding public PR run is
[39377619569](https://github.com/ilamgumaran/simpli-home-tools/actions/runs/39377619569).
PR #16 remains draft; no gate, threshold or sampling duration is relaxed.

The research controls compare blank/full/hidden-art content on ARM and Intel
macOS and Windows. They also compare default headless shell, full Chromium's
new headless backend and visible windows. Blank macOS content can already miss
native callback timing; neither hiding art, switching architecture/backend nor
visible windows consistently restores it. The controls do not isolate every
possible application cost, and they do not justify a speculative raster rewrite
or replacing the required runner/browser mode. Research job success means the
measurement completed, not that app performance passed.

The reusable diagnostic workflow defaults to the production headless mode on
push; manual inputs select `headless` and `chromium_channel`. It retains all
application gates in the separate required workflow. Full CI log egress remains
separate from the accessible bounded check annotations.

## Rain investigation and next action

The isolated Firefox DPR2 probe completed successfully as a measurement, not an
application acceptance check. Current and earlier pacing both draw on every
delivered native callback in normal mode: zero intentional skips, with native
rates around 56.6/56.2 per second. Hiding immersive art increased native delivery
to about 59.5/s; blank content measured about 60.6/s. Draw-call CPU p95 was 2 ms
for both full-art normal cases. The original 33 ms particle-gap failure did not
repeat in that isolated sample. These observations suggest investigating paint
and compositing pressure; they do not establish a sole cause or prove compositor
smoothness. See the [method, measurements and task split](../../tools/little-orbit/design/RAIN-CADENCE-INVESTIGATION.md).

Next, profile the full-resolution rainy scene with matched native-frame and
paint/compositing controls, preserving its visual detail. Independently resolve
the hosted macOS frame-delivery prerequisite and Windows low-power gap. Preserve
the failed outcomes when reporting successful later checks. Keep the PR draft
until required checks pass; a merge request is not approval to bypass failing checks. Continue A2 visible
hands/feet after the outstanding verification boundary is resolved or explicitly
reprioritized by the owner. Device sessions should fetch this branch, verify the
portable checksum and record actual device outcomes in message 026.
