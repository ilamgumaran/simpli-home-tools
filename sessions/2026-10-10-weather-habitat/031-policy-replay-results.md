<!-- SPDX-License-Identifier: LicenseRef-Simpli-Noncommercial-1.0 -->
# Policy replay — results and next controls

- Message ID: `2026-10-10-weather-habitat/031`
- Date: `2026-10-31 UTC`
- From: cloud clock orchestrator
- To: owner and implementation/device sessions
- Branch: `feature/anatomy-foundation`, [draft PR #16](https://github.com/ilamgumaran/simpli-home-tools/pull/16)
- Starting checkpoint: `ff4510e41e2521b8c48d71a989027341ac6187d7`
- Replay implementation: `03069c591cc0a7909e9378269d6d46cd73e6bfa9`, pushed
- Display runtime: `99931338f12d5111ea0321cc2690d6588ef59ab9`, unchanged
- Previous: [030 — exact traces](030-ci-trace-results.md)
- Status: test-only replay implemented and reviewed; production pacing unchanged

## Work and decision

The owner asked to continue. This slice implements the policy-replay task left
by 030 before choosing another runtime change. The
[study and task split](../../tools/little-orbit/design/CADENCE-POLICY-REPLAY.md)
contains the reproducible commands, algorithms and interpretation limits.

Sol 6 independently analyzed the captured sequences and reviewed the source.
Luna built the isolated tool and units; the integrator reviewed and corrected
percentile boundaries, per-frame-count DP state, normal-mode policy/gates,
unknown pre-window state, the original measurement denominator and portable
unit temporary files. The new unit program is in the standard runner. No app,
portable, threshold, browser setting or navigation behavior changed.

The [full report](../../tools/little-orbit/design/evidence/cadence-policy-replay-2026-10-31.json)
compares the current runtime with three test-only alternatives. It preserves
nominal RAF and callback-entry metrics separately, source-file hashes,
provenance, captured accepted-gap metrics, cold-start decision mismatches and
exhaustive oracle scorecards/witnesses. Full decision booleans remain in the
source JSONL traces. An oracle uses hindsight and arbitrary starting/ending
callbacks; it is not a runnable scheduler. FPS uses the original full sample
interval, and every selected pair retains the 24 ms nominal minimum.

No tested causal alternative passes the gates on these low-power replays.
The hindsight nominal oracle is feasible for only one of seven low-power
records; the entry-time oracle is feasible for the three Windows low-power
records. **All four macOS records are infeasible in both clock domains** under
fixed captured delivery. Sol 6's independent implementation agrees on all 14
feasibility results and minimum long-gap counts at the required FPS. These
bounds do not predict geometry/presentation or prove callbacks would remain
unchanged under a different render workload. No production phase change is
justified by this study.

## Additional retained CI evidence

Complete hash-verified notices recovered four additional failures from the
final tracing checkpoint:

| Run / API event | Actual checkout | macOS hosted dashboard Chromium low | Windows Firefox |
| --- | --- | --- | --- |
| [41008028316 / push](https://github.com/ilamgumaran/simpli-home-tools/actions/runs/41008028316) | `ff4510e` | 120 callbacks, 59 draws; geometry p95/max 49.8/51.3 ms | Portable immersive low: 116 callbacks, 63 draws; p95/max 47/48 ms |
| [41008034373 / pull_request](https://github.com/ilamgumaran/simpli-home-tools/actions/runs/41008034373) | merge `4a0d98d73a4e7056be309c3221161c7b349f6fc2` | 115 callbacks, 57 draws; p95/max 53.4/69.9 ms | Hosted dashboard **normal**: 106 callbacks, 106 draws; p95/max 32/33 ms |

Both runs pass Ubuntu and fail Windows/macOS. All four new traces recompute
reported metrics, have matching native/app callback timestamps and accepted/
geometry counts, and show no late eligible low-power rejection. The new normal
Windows sample already accepts every available callback; nominal p95 is
31.68 ms against the normal 31 ms gate. A low-power limiter adjustment cannot
repair that fixed sequence. The eight failed records do not establish failure
frequency; retain them even when later samples pass.

## Local validation

Build passes; portable SHA-256 remains
`1e36b79704ac3046230644555ffc5fc691cc5229ac2df067a61d2901e0169d8b`.
The new pure replay unit program passes, including independent brute-force
subset comparison, strict maximum-gap/FPS infeasibility, normal-mode gates,
20-gap p95 indexing, malformed input and independent sampling alignment.

A fresh combined Chrome/Firefox `npm test` exits **1** in Chrome's final
immersive cadence case (hosted 1280×720 DPR2 normal): FPS 58.566, p95 17 ms,
maximum **113.1 ms** against <100. Its
[exact raw failure](../../tools/little-orbit/design/evidence/local-cadence-linux-2026-10-31-stall.jsonl)
is retained. Prior successful local runs in 030 remain historical. The current
run is not a pass. Geometry has 123 observations versus 121 native/app callbacks;
this sample cannot be summarized as one geometry update per callback. The
underlying stall is not isolated.

The separate Firefox-only full `npm test` exits **0**, including all 14 browser
programs, 22 cadence cases and offline portable checks. The three Chrome
programs skipped by the aborted combined run (weather, community and meal),
plus Chrome offline portable, each exit **0**. The failed immersive cadence case
was not rerun to replace its result. Chrome has 21 cadence passes / one failure;
Firefox has 22 passes: **43/44** total, with complete functional coverage.
The [local report](../../tools/little-orbit/design/evidence/policy-replay-local-validation-2026-10-31.json)
retains job exits, log hashes, individual metrics and all 36 instrumented raw
metric recomputations (all exact within 1e-7).

The original combined run passed the previous 14 pure programs before the new
replay program entered the runner. Firefox's full run includes the new program;
its final alignment/temp-file checks also pass independently after review.
Chrome for Testing 151.0.7922.34 and Firefox 153.0 ran under Node 24.19.0 on
Linux. Edge was not rerun for this test-only slice; its earlier pass remains in
030. Build, syntax, relative links, JSON, canonical trace hashes, exact replay
report reproduction and whitespace checks pass. No app or portable diff exists.

## Next action

Follow the study's matched-control tasks for Windows Firefox normal and macOS
Chromium low-power, keeping exact samples, all errors, real timers and original
gates. Use the local DPR2 normal stall as an additional control group. Find a
repeatable scene-versus-native expense before selecting another production
change. PR #16 remains draft; no merge, release or device install. A2 anatomy
and A3/A4 live contact/gait migration stay deferred by the current roadmap.
Ally/Vanadium and sustained-display acceptance remain unrun. Use 032 for the
next cloud follow-up; 026 remains reserved for device feedback.
