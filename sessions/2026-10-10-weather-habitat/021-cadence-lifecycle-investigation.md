<!-- SPDX-License-Identifier: LicenseRef-Simpli-Noncommercial-1.0 -->
# Cadence and reduced-motion CI investigation

- Message ID: `2026-10-10-weather-habitat/021`
- Date: `2026-10-20 UTC`
- From: cloud clock orchestrator
- To: owner, implementation and device sessions
- Branch: `feature/anatomy-foundation`, [draft PR #16](https://github.com/ilamgumaran/simpli-home-tools/pull/16)
- Status: investigation checkpoint; no production scheduler change yet
- Previous: [020 — anatomy implementation and results](020-anatomy-foundation-results.md)

## Completed run evidence

Both `ee0e3d1` macOS runs fail Chromium low-power dashboard cadence. In
[39321395029](https://github.com/ilamgumaran/simpli-home-tools/actions/runs/39321395029),
25.078 updates/s, p95 53.1 ms and maximum gap 59.5 ms were observed; the other run
reports 25.153 updates/s, p95 54.8 ms and maximum gap 60.4 ms. Windows Firefox
fails either dashboard cadence (20.863 updates/s, p95/max 63 ms in
[39321387723](https://github.com/ilamgumaran/simpli-home-tools/actions/runs/39321387723))
or the older climber's reduced-motion hidden-state assertion at line 35. Ubuntu
passes in one run; the other failure excerpt was truncated by GitHub's annotation
limit. These outcomes replace the pending-job status at publication of 020;
020 remains historical and immutable.

## Bounded work underway

The climber test now registers a media-query change listener before emulating
reduced motion and waits for dispatch before manually starting its quiet visit.
Previously it only waited for `matches`, which can change before the product's
queued listener stops/reschedules a visit. The existing 2.5-second hidden-state
assertion remains. Focused Chromium and Firefox hosted/portable cases pass. This
synchronizes the test; it does not change product behavior or prove the cause of
every earlier Windows failure.

The dashboard cadence probe now records independent native RAF callback timing
alongside observed geometry updates. Callback availability will distinguish
missed rendering opportunities from the low-power scheduler skipping an early
second callback. The sample duration, fonts settling and all performance gates
remain unchanged. CI failure excerpts are capped at 3,000 characters so GitHub's
roughly 4 KiB annotation cap cannot silently discard the unknown-failure tail.

Sol 6 traced the current hosted loop locally: both browsers supplied about
60 callbacks/s and displayed 30 geometry updates/s, with sub-2 ms draw costs.
A monotonic, seeded 60 Hz trace with ±3 ms jitter makes the unchanged scheduler
produce 26.31 updates/s and p95 50.18 ms; ±5 ms gives 25.04 and p95 51.32 ms.
That shows a scheduling sensitivity; it does not establish CI callback timing.
The previous ideal-phase catch-up was rejected for 50/16 ms alternation. A
bounded phase design with minimum spacing is under study, not enabled in scenes.

## Ownership and next action

Sol 6.1 owns the diagnosis, scope and integration review. Sol 6 owns independent
timing traces and validation; Luna owns the bounded climber-test and cadence-probe
changes. Read the next diagnostic annotations before choosing a production fix.
Do not lower the fps/p95/maximum-gap gates or count retries as a repair. After an
evidence-based change, rerun browser/build/offline checks and publish the exact
runtime and portable checksum. PR #16 stays draft until its gates are addressed.
Physical Ally/Vanadium and sustained-operation acceptance remain separate.

Use message 022 for results or corrections after this checkpoint is published.
