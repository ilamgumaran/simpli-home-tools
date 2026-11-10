<!-- SPDX-License-Identifier: LicenseRef-Simpli-Noncommercial-1.0 -->
# Bounded frame-cadence candidate

- Message ID: `2026-10-10-weather-habitat/022`
- Date: `2026-10-20 UTC`
- From: cloud clock orchestrator
- To: owner, implementation and device sessions
- Branch: `feature/anatomy-foundation`, [draft PR #16](https://github.com/ilamgumaran/simpli-home-tools/pull/16)
- Status: production pacing candidate; full browser and hosted CI validation pending
- Previous: [021 — investigation](021-cadence-lifecycle-investigation.md)

The [pacing design](../../tools/little-orbit/design/FRAME-CADENCE.md) records the
problem, measured/synthetic evidence, constants, algorithm and acceptance gates.
The diagnostic macOS job at `a746d6a` confirms roughly 57 native callbacks/s,
with maximum native gaps 37 ms, while geometry drops to 27/s and maximum gap
62.5 ms. It supports testing bounded phase retention, without proving that all
renderer or runner stalls can be repaired by pacing.

A shared `frame-cadence.js` now drives both Woodland loops, including Green
House 1's immersive renderer. Low power retains a 30 Hz phase, 4 ms early
allowance and 24 ms minimum paced gap; late callbacks rebase instead of replay.
Normal mode accepts every callback. Current-time authority, scene artwork,
contact geometry and joint/gait functions remain unchanged. The module is served
and embedded in the regenerated portable clock.

Portable `Little Orbit.html` SHA-256:
`ef7ac3038f1e23e20b64bd3f8db93f3a65396c1f6655c8fc4aeddc5c8f34a8aa`.
The anatomy-only checksum in 020 is now historical; use this artifact for the
pacing candidate. The commit publishing this message identifies its full source.

Build and pure cadence/anatomy fixtures pass. Independent Sol 6 tests cover
ordered jitter, refresh-rate variants, minimum spacing, stalls, backward
callbacks after skips, mode switches and isolation. They reject the old limiter
on the same jitter input. Sol 6.1 reviewed the algorithm/integration; Luna
implemented the bounded module and consumer/loading changes. The first full-suite
attempt omitted the browser adapter environment and stopped at browser launch;
no browser assertion ran. Its log is preserved separately as a harness error,
and the corrected run uses the previously verified browser environment.

Full native Chrome/Firefox and Edge suites are being run sequentially. Hosted
Windows/macOS/Linux checks must also pass; do not transfer 020's local passes to
this changed runtime. Performance gates/sample durations remain unchanged. The
climber media-event synchronization and raw RAF diagnostics are retained from
021. The dashboard diagnostic also includes bounded nominal-gap samples for
later failure analysis.

Next: inspect the actual browser/CI results, repair any remaining evidence-backed
failure, then consider PR readiness. A2 visible hands/feet and A3/A4 contact/gait
remain later stages. Physical Ally/Vanadium and sustained acceptance are unrun.
After publication, record final results/corrections in message 023.
