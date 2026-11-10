<!-- SPDX-License-Identifier: LicenseRef-Simpli-Noncommercial-1.0 -->
# Anatomy foundation: implementation and verification handoff

- Message ID: `2026-10-10-weather-habitat/020`
- Date: `2026-10-19 UTC`
- From: cloud clock orchestrator
- To: owner, implementation sessions and local device session
- Branch: `feature/anatomy-foundation`
- Pull request: [PR #16](https://github.com/ilamgumaran/simpli-home-tools/pull/16), targeting `feature/woodland-weather-habitat`
- Status: additive A0 inventory / A1 foundation implemented; local browser verification complete; hosted CI/device gates remain

## Implemented scope

The [profile contract](../../tools/little-orbit/design/ANATOMY-PROFILES.md) and
[baseline inventory](../../tools/little-orbit/design/ANATOMY-BASELINE.md) accompany
the new shared `character-anatomy.js` module. Adult, drop, learner and swaddled
profiles are versioned and frozen. Pure geometry supplies wrist/palm/thumb/grasp
and ankle/heel/ball/toe landmarks, finite-range validation, constrained two-bone
reference solves, stable bend selection and explicit unreachable diagnostics.
The learner has distinct proportions; Pebble has only covered support anchors.

The workshop adds seven static reference poses, front/turned/side projection
envelopes, mirrored facing, landmark toggles and small/enlarged comparisons.
Hollow coral markers show infeasible requested targets instead of claiming a
successful contact. Both new document links are served by the local server.
Hosted and portable clocks load the module; `DeskCharacters.anatomyProfile`
adds a facade without changing existing scene calls.

Live poses keep wrist/ankle endpoints, existing art, scene gait, tools and care
contacts. This is the foundation for later silhouettes/contact adapters, not a
new natural gait. Close care references can exceed the authored envelopes and
must be restaged with body/palm offsets before live rollout. Wrist/ankle limits
are records for later solving; full coupled wrist/ankle mechanics are not claimed.

## Revisions and artifact

- Runtime/module/workshop/portable checkpoint: `87d71b169789c817819e11a85849d16a598823f7`.
- Cross-platform fixture follow-up: `eaa40d1af902bd22593afab4da4760b2db6d32e8`; later test/handoff changes are in the PR. Runtime JavaScript and portable bytes are unchanged after the runtime checkpoint.
- Portable `tools/little-orbit/Little Orbit.html` SHA-256: `5227d26b9c3d6df44c373831f5538252a525c13c96f23d8b39d5ea2bd23dd9ea`.
- Previous live behavior baseline: `307c8e1` / meal runtime `f02092b`; these older test results are not substituted for candidate-specific verification.

## Review and checks

Sol 6.1 owned the architecture, profile numbers and integration review. Lighter
models implemented the bounded pure module and source inventory; Sol 6 provided
independent geometry/browser fixtures and a separate code/PR review. Review
corrected identity-schema mismatches, meaningful reach/crouch targets,
prototype-name lookups, finite-range edge cases and two missing hosted document
routes. All those findings are addressed.

Pure fixtures independently pin profile dimensions, landmarks, mirrored/nonuniform
transforms, both bend branches, fixed bone lengths, singular/unreachable targets,
invalid inputs, frozen records and infant applicability. The 120 captured legacy
poses require exact structure/contact flags with `1e-9` rig-unit numeric tolerance;
an injected `1e-6` endpoint change fails, while `1e-12` rounding variation passes.
The old source fails the new anatomy-facade assertion as expected.

Build and final pure checks pass. Focused hosted/file workshop and portable API
checks pass in native Chrome, Firefox and Edge, including all seven identities,
meaningful reach, facing, SVG bounds, landmark toggles and infant support-only
rendering. A final focused run also checks real hosted responses for both linked
documents. Weather is mocked; test screenshots remain outside Git. Visual review
covered enlarged/small references and infant support, not new live gait.

The complete local Chrome/Firefox log reaches all 14 browser programs per engine,
22 cadence cases per engine and both offline portable checks with no assertion
failure. Ubuntu CI on `eaa40d1` is green in both push and PR runs. The final full
Edge run completed its 14 browser programs, 22 cadence cases and offline check;
its captured npm status is 0. Final focused hosted-document checks pass in all
three browsers after the harness addition in `6dc5430`. Keep existing cadence gates:
low power >=26 updates/s with p95 <=46 ms, normal >=45 with p95 <=31 ms, and
all maximum gaps <100 ms. Do not count an incomplete run as a pass.

| Local browser | Cadence passes | Minimum low-power updates/s | Minimum normal updates/s | Largest p95 (low / normal), ms | Maximum gap, ms |
| --- | --- | --- | --- | --- | --- |
| Chrome | 22 | 29.99 | 59.99 | 34.2 / 18.9 | 37.3 |
| Firefox | 22 | 28.08 | 58.57 | 35 / 21 | 54 |
| Edge | 22 | 29.97 | 59.98 | 34.4 / 19.9 | 40.2 |

All 66 cadence pass records were checked against the logs. The session tool's
Edge completion reported exit 1 although the shell's separately written npm
status is 0 and every expected test program completed; that wrapper discrepancy
is not classified as an application assertion failure. The captured npm status
was independently re-read. Preserve this distinction when reproducing results.

An early local execution was canceled while the harness was finalized; only the
complete run above is counted. Initial Firefox startup issues were resolved by
the retained writable XDG cache/config/data directories and configured sandbox
environment; final focused Firefox checks also pass with that configuration.

## Hosted CI and environment blocker

The first macOS run on `87d71b1` failed `npm test` in 0–1 second. Its new legacy
fixture used bit-for-bit floating-point equality; that comparison is now strict
within the documented numeric budget above. On `eaa40d1`, macOS gets farther
(about 1m55s in the PR test step) and still fails; Windows fails too. Those older
exact assertions remain unavailable. The parent branch also had failures; that
alone does not establish a shared cause.

The diagnostic push run [39320067948](https://github.com/ilamgumaran/simpli-home-tools/actions/runs/39320067948),
head `6dc543087d03ff00641971d12ebf477460291298`, exposes the macOS failure through
check annotations: Chromium `verify-motion.cjs:59`, low-power dashboard cadence,
27.0707 updates/s, p95 50.5 ms, maximum gap 56 ms, 57 observed frames. FPS and
maximum gap pass; p95 exceeds the unchanged 46 ms gate. A separate Sol 6 read-only
review confirmed the scheduler and this test are byte-for-byte unchanged from
`307c8e1`. The new module starts no timers/RAF and the new workshop check runs in
a separate child process. This evidence does not isolate a PR-specific cause.
The unchanged `lastFrame=now` scheduler can miss a 30 Hz slot after a delayed RAF,
which is consistent with the gap, but runner contention versus scheduling still
requires a controlled comparison. No thresholds, sample durations or tests were
relaxed and no blind retry is counted as a fix.

The corresponding PR-triggered run [39320074326](https://github.com/ilamgumaran/simpli-home-tools/actions/runs/39320074326)
also fails the same macOS Chromium low-power p95 assertion: 28.5442 updates/s,
p95 50 ms, maximum gap 60 ms, 60 observed frames. These are the two automatic
push/PR runs, not manual retries. The existing immersive-loop comment explicitly
records that ideal-phase catch-up previously produced 50/16 ms alternation;
do not restore a phase accumulator without frame-trace evidence and visual review.


GitHub metadata is readable, but log redirects fail with proxy tunnel HTTP 403.
The existing custom network list was preserved and these exact required hosts
were saved additively in the environment draft:

- `results-receiver.actions.githubusercontent.com`
- `productionresultssa17.blob.core.windows.net`

Saving the draft does not apply/publish it. Review/save the environment settings
and publish the environment to enable full log retrieval. The draft save was
confirmed; current full-log access remains blocked. As a diagnostic alternative,
`6dc5430` preserves npm's test status and emits a bounded failure excerpt as a
GitHub check annotation, available through the existing API route. This wrapper
was checked with success and injected exit 7, including escaped workflow-command
characters. At publication, the macOS annotations above are available; Windows and Ubuntu
jobs in both diagnostic runs are still in progress, not recorded as passes. PR #16 remains draft while required checks are unresolved.

## Next work and device boundary

1. Finish reading the hosted job annotations. For cadence failures, compare the exact base and candidate on the same macOS runner/browser, using the same viewport, power mode, real RAF, fonts/settling, 2.1-second sampling and current gates. Record per-frame gaps and runner/browser versions. Separate scheduler slot misses from runner contention before a bounded repair; rerun the affected gates after an evidence-based change. Local browser passes do not replace this gate.
2. Complete live scene/prop bounds before A2 expands artwork; implement the visible palm/finger/sole silhouettes behind explicit per-mount compatibility.
3. Start A3/A4 with Sage's meal and Aster/Pebble care only after their palm/sole adapters, body shifts, support and existing layout gates pass. Do not switch all scenes to the new landmarks automatically.
4. Physical Ally/Vanadium, sustained warm operation and new live-motion visual acceptance remain unrun. No installation, release or device restart was performed.

## Ready merges completed

The owner authorized merging ready work. Search PR #14 and clock PRs #2, #3,
#5 and #7 were merged into their existing targets. A fresh readiness check found
two more clock PRs green at their current heads. An independent Sol 6 review
found no blocker; their descriptions were corrected to match the integrated scope
and all current Ubuntu/Windows/macOS checks. Head-matched merges completed:

| PR | Target | Reviewed head | Merge commit |
| --- | --- | --- | --- |
| [Clock #1](https://github.com/ilamgumaran/simpli-home-tools/pull/1) | `main` | `4b1e15030599b9b9ff70ac0713205cf41e0ea979` | `c15284df7f4202c773458a5ed0f217414082f787` |
| [Clock #4](https://github.com/ilamgumaran/simpli-home-tools/pull/4) | `feature/living-woodland-time` | `a0adc0b11d247bba5c6790c5d070ee72148f3515` | `71a490078813644ff0e3cf5803ded1ddff478073` |

The four-theme clock foundation is now on `main`; the complete Woodland,
Green House 1 and anatomy stack is not. Search recovery PR #11 still needs the
integrated iOS rebuild on an equipped Mac. Clock PRs with failing CI, conflicts
or draft status retain their own gates.

After this message is published, use 021 for corrections or the next follow-up;
do not rewrite messages 001–020 or the reserved device reply.
