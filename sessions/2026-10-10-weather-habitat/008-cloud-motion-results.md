# Green House 1 — fine-snap and SVG-crop motion candidate

- Message ID: `2026-10-10-weather-habitat/008`
- Date: `2026-10-13` (UTC)
- From: cloud motion implementation/planning session
- To: local Ally implementation/testing session
- Status: build passed; partial Firefox community preflight exited 1; weather and full browser suites are unrun. Motion validation is pending; no acceptance claim.
- Branch: `feature/woodland-weather-habitat`, based on `feature/woodland-immersive-story`
- Pull request: [PR #11](https://github.com/ilamgumaran/simpli-home-tools/pull/11), draft
- Current candidate runtime: `9b0d6003f536bfea7666c7dbcf4f7b0087906319`
- Current portable SHA-256: `5c7fc8289645babb5a8ebba34c8f77a905e6951f676c1ad6416c2f1fc348783c`
- Intermediate runtime documented below: `7c11d812999f8beedaccca95b96883ada3996b91` (portable SHA-256 `03d91d530661cc3acdff64e17bbabfa96d4f5bfd79e03ac2fd361563a16fd0ba`)

The current frozen candidate combines animated camera/HUD position coalescing to **1/16 device-pixel steps** (maximum quantization error **1/32 physical pixel**) with a small-family-actor SVG crop. The crop uses shared camp metadata and the paint-frame contract; it does not calculate bounding boxes per frame. Original vector nodes, scale, art, exact character poses and tool contacts, animation rates, lifecycle rules and clock/time authority are retained. The portable build passed. A partial Firefox community preflight is recorded below; weather and complete Chrome/Firefox/Edge suites remain unrun. No motion acceptance claim is made.

## Private diagnostic evidence — not production acceptance

Eight fresh Firefox 153 rain/DPR2 comparison runs showed normal-mode baseline samples at **51.38 updates/s, p95 34 ms** (failed) and **55.21/s, p95 29 ms** (passed). With fine-step coalescing, normal-mode samples were **60.36/s, p95 21 ms** and **60.30/s, p95 29 ms** (both passed); all low-power samples were approximately 30/s with p95 34–36 ms (passed). Camera style writes fell from 540–580 to 115 per 2.1-second sample; HUD writes fell from 192 to 54. Geometry remained active and there were no page errors.

These are private component comparisons, not the required browser programs or acceptance evidence. The isolated crop prototype was not part of 7c11; the current frozen candidate includes the small-family-actor SVG crop described above. These diagnostics are not acceptance evidence for that combined candidate. The bitmap and 15 fps alternatives remain rejected as recorded in [006](006-cloud-validation.md).

## Intermediate focused Firefox results — 7c11 (previous candidate)

Native Firefox 153 `verify-immersive-motion` exited 0: choreography and all six cadence cases passed. `verify-weather-habitat` passed functional/cache/unit/location-race checks in hosted and portable forms, and hosted DPR1/2 low/normal cadence cases; portable DPR1 checks also passed. It then failed portable 1280×720 DPR2 low power at **29.03 updates/s, p95 61 ms, max 71 ms**. Later weather cadence cases did not run. The run used the original gates.

Chrome 151 and Edge 154 full native suites were not run on 7c11. No complete native engine suite passed on that revision. These outcomes are intermediate history only; the current candidate's partial preflight is recorded below. Preserve immutable [006](006-cloud-validation.md). Physical Ally, Vanadium and sustained-operation checks remain separate. No merge, release or cloud installation has occurred.

## Partial Firefox preflight — 9b0d6003

The existing Firefox 153 `verify-community-habitat` preflight exited 1 at its reduced-motion exact-bounding-box assertion (test line 72). The infant's measured y position changed by **0.15 CSS px** between 12:08:28 and 12:08:29. The cause is not established; a layout shift is suspected but unproven. Before that assertion, the new crop/paint/projection checks passed for **9 routines × 4 viewports** in hosted form at DPR1. Do not treat those partial checks as an overall program pass.

Weather testing and the full Chrome, Firefox and Edge suites have not run on 9b0d6003. Next, investigate the reduced-motion position change, then complete the required browser checks without weakening the existing assertions or cadence gates. The result remains pending and makes no acceptance claim.
