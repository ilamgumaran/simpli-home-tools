<!-- SPDX-License-Identifier: LicenseRef-Simpli-Noncommercial-1.0 -->
# Rendering and native-frame control probe

- Message ID: `2026-10-10-weather-habitat/023`
- Date: `2026-10-20 UTC`
- From: cloud clock orchestrator
- To: owner, implementation and device sessions
- Branch: `feature/anatomy-foundation`, draft PR #16
- Status: read-only CI measurement added; production runtime remains `897d0b0`
- Previous: [022 — bounded pacing candidate](022-bounded-frame-cadence-candidate.md)

The `897d0b0` push macOS job reports 28.389 geometry updates/s, p95 49.5 ms
and maximum gap 52.7 ms, against 56.778 native callbacks/s with nominal p95/max
31.6/34.1 ms. The PR-triggered macOS job has a slower native stream (50.903/s,
nominal p95/max 35.2/40.3 ms), and geometry 25.451/s, p95 53.3 ms. Both fail
unchanged application gates. These are new candidate results, not the old
anatomy-only failures.

Offline replays of the first measured callback stream, across 101 start phases,
show that the current bounded policy, an asymmetric-phase variant and a greedy
24 ms limiter do not meet p95 46 ms. This is **not** a proof that no selector
can do so: a separate hindsight DP finds subsets meeting the gate with fewer
paints. No speculative phase-constant change was applied. The old Windows trace
at `a746d6a` supplies 61.524 callbacks/s, nominal p95/max 18.22/18.52 ms while
its old limiter shows 23.190 updates/s and p95/max 50 ms. It does not confirm an
exact 64 Hz clock. The new Windows result is still pending at this checkpoint.

A standalone diagnostic now compares blank page, complete dashboard, static
art hidden, and the full SVG hidden. It retains real RAF/timers, the same viewport,
font/settling period and measurement duration; hidden art is an experiment only.
The scene still writes geometry in the hidden controls. Native callback timing
and geometry updates are recorded separately, with browser version and actual
runner architecture, on macOS latest, macOS Intel and Windows.

The script is `tools/little-orbit/tests/diagnose-motion-control.cjs`; its workflow
is `.github/workflows/little-orbit-motion-diagnostics.yml`. Launch/load/page errors
fail the diagnostic; performance numbers are measurements, **not** production
passes. It neither disables nor replaces the required `npm test` workflow.
Syntax and review checks pass; its first real-browser validation is on CI so the
sequential local performance suites are not perturbed by another browser load.

Full local Chrome/Firefox verification has reached the final meal program with
41 cadence passes and no assertion failures so far. The separately requested
Edge run and final statuses remain pending. Do not count this partial run as a
pass. Runtime and portable bytes are unchanged from 022; its checksum still
applies. No physical device acceptance is claimed.

Next: use the controls to distinguish scene-painting cost from native-frame
availability before choosing renderer or test-host changes. Record outcomes and
any reviewed next action in 024; preserve this message after publication.
