<!-- SPDX-License-Identifier: LicenseRef-Simpli-Noncommercial-1.0 -->
# Replay before changing frame pacing

Status: test-only investigation. The production policy, scenes, portable build
and browser acceptance thresholds remain unchanged. This study continues
[exact trace capture](CI-FAILURE-TRACING.md) and the
[bounded pacing design](FRAME-CADENCE.md).

## Question

Could another low-power policy use the available callbacks more effectively,
while preserving the current 24 ms minimum between accepted RAF timestamps?
The earlier Windows fixture has no native gap >=24 ms. It cannot represent
the irregular callbacks in the newly captured failures.

The standalone replay reads exact **app callback opportunities**, rather than
substituting the independent native sampler or rounded geometry. It keeps
nominal RAF timestamps and actual policy-call entry times separate, uses the
original geometry measurement duration for FPS, and reports captured decisions
alongside cold-start alternatives. The pre-window policy state was not captured;
cold-start differences are not evidence that the production implementation
made an incorrect decision.

The alternatives are experiments, not settings or shipped algorithms:

- Current runtime factory, cold-started at the first captured callback.
- Fixed last-draw time with a period-minus-4 ms threshold.
- Constant phase with bounded retained debt.
- Earliest callback at least 24 ms after the preceding accept.

For every alternative, the output separates accepted nominal gaps from accepted
entry-time gaps. Neither is predicted geometry, paint or display presentation.
Normal mode is reported separately: it already accepts every callback, so a
low-power experiment cannot repair its native-delivery failure.

## Hindsight bound

The oracle considers callback subsequences with the same nominal minimum gap.
It may inspect the entire future sequence, choose any starting/ending callback
and discard intervening callbacks. A real online scheduler cannot do this.
For each endpoint and accepted count it retains a path with the fewest gaps
above the p95 limit, subject to the strict maximum-gap gate. It evaluates both
nominal and entry-time clocks separately.

For `g` accepted gaps, the unchanged test selects sorted index
`floor(0.95 * g)`. At most `g - floor(0.95 * g) - 1` gaps may exceed the p95
limit. This matters at exact multiples of twenty: a conventional interpolated
or nearest-rank percentile would produce a different answer. FPS uses the
original complete measurement interval, including any omitted boundary time.
The nominal 30 Hz target is not imposed as an extra 31 FPS cap; the current
64 Hz fixture intentionally permits about 32 accepted updates/s.

A feasible oracle path establishes only possibility on a fixed recorded
sequence. An infeasible result rules out callback selection satisfying those
clock-domain constraints on that fixed sequence. It does not prove that the
browser would deliver the same callbacks after a render or workload change.
Entry-time gaps can change when different callbacks perform work. Geometry
observation can also shift gaps. No oracle result replaces a browser gate.

## Evidence and continuation

The eight retained records span two source checkpoints and four CI runs.
They are failed samples, not a representative estimate of failure frequency.
The [complete replay report](evidence/cadence-policy-replay-2026-10-31.json)
retains file hashes, provenance, both clocks, candidate results, oracle
scorecards and witness indices. Its parsed values reproduce with:

```sh
node tools/little-orbit/tests/replay-cadence-policy-unit.cjs
node tools/little-orbit/tests/replay-cadence-policy.cjs \
  tools/little-orbit/design/evidence/ci-cadence-*-4100*.jsonl > replay.json
```

Run from the repository root for identical relative source paths. JSON layout
is compacted in the archived report; the parsed content is unchanged. The tool
SHA-256 is `72ac42b2edb81b1c94f09875d0c04b27edb169d2645ea5604e1949de84c301c0`;
the production pacing source SHA-256 is
`677ed6d01d544c3ffdfaca8a9ed6a9360744529ada27c1ad133cb43f7e780b14`.

| Platform / run | Mode | Geometry p95 | Nominal oracle feasible | Entry oracle feasible |
| --- | --- | --- | --- | --- |
| macOS / 41005460616 | Low | 54.0 ms | No | No |
| macOS / 41005464977 | Low | 55.2 ms | No | No |
| macOS / 41008028316 | Low | 49.8 ms | No | No |
| macOS / 41008034373 | Low | 53.4 ms | No | No |
| Windows / 41005460616 | Low | 47 ms | Yes | Yes |
| Windows / 41005464977 | Low | 47 ms | No | Yes |
| Windows / 41008028316 | Low | 47 ms | No | Yes |
| Windows / 41008034373 | Normal | 32 ms | Not applicable | Not applicable |

An independently written Sol 6 implementation agrees on all 14 low-power
clock-domain feasibility results and minimum long-gap counts at the required
FPS. All eight native/app sequences match index-for-index; the tool reports
alignment explicitly and permits future mismatches without substituting native
callbacks for missing app opportunities. No tested causal alternative passes
all gates on any of these low-power cold-start replays. That result is scoped
to these policies and starting conditions; the oracle supplies the stronger
fixed-stream bound.

The new Windows normal-mode failure is especially useful: the app accepts all
106 native callbacks, but nominal p95 is 31.68 ms and geometry p95 is 32 ms
against the unchanged 31 ms gate. A low-power phase adjustment cannot address
that sample.

The [session handoff](../../../sessions/2026-10-10-weather-habitat/031-policy-replay-results.md)
records review and local checks, including a fresh retained normal-mode maximum
gap failure. Keep PR #16 draft
until required hosted checks pass. The next production candidate should follow
matched native-delivery/full-scene controls on the failing runner, with actual
callback/geometry evidence identifying an avoidable expense. Preserve failed
samples and existing thresholds. A2 anatomy artwork and live gait migration
remain later stages; physical Ally/Vanadium acceptance remains separate.

## Next bounded task split

1. Extend the existing `diagnose-motion-control.cjs` research probe to record
   exact native delivery for blank/full/static-hidden/world-hidden controls in
   **Windows Firefox normal mode** and **macOS Chromium low-power mode**. Keep
   browser version, viewport, DPR, settlement and 2100 ms measurement matched.
   Exercise the failing DPR2 normal case locally as a separate group.
2. Collect repeated balanced orders on the same runner/browser, keeping every
   sample and errors. Use the same tracing overhead for compared conditions;
   distinguish instrumentation from uninstrumented acceptance. Hidden artwork
   remains a diagnostic condition. The required workflow stays authoritative.
3. Profile only a repeatable scene-versus-control difference. Identify the
   expensive render/layout operation before changing it; then rerun the affected
   hosted/portable gates and complete browser coverage on the actual candidate.
   If blank/native delivery fails too, retain that limit without labeling a
   clock policy change a fix or claiming the infrastructure cause is isolated.
