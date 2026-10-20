<!-- SPDX-License-Identifier: LicenseRef-Simpli-Noncommercial-1.0 -->
# Bounded phase pacing for Woodland and Green House 1

Status: implementation candidate on `feature/anatomy-foundation`, PR #16.
The browser cadence gates remain required; physical acceptance is separate.

## Problem and evidence

The former low-power limiter waits until a callback is at least 31.333 ms after
the last painted callback, then replaces its phase with that callback time. An
early second callback can be skipped; the next opportunity then arrives around
50 ms. At 75 Hz, this limiter can settle at 25 updates/s rather than its intended
30. Base `307c8e1` and the anatomy-only candidate shared this scheduling code.

A monotonic seeded 60 Hz trace with ±3 ms jitter produces 26.31 updates/s and
p95 50.18 ms under the former limiter. The candidate gives about 30 updates/s
and p95 37.58 ms on the same trace. These synthetic results expose a scheduling
sensitivity; they do not replace browser measurements.

Mac CI at `a746d6a` supplies 120 native callbacks over approximately 2.1 seconds
(56.89/s), nominal p95/max gaps 30.9/37 ms, actual callback-start p95/max
31.3/37.6 ms. Geometry updates are only 27.02/s, p95 53.8 ms and maximum 62.5 ms.
The available callbacks justify testing a limiter that retains phase through
small timing errors. Missing callbacks and rendering cost still impose limits.
See [session 021](../../../sessions/2026-10-10-weather-habitat/021-cadence-lifecycle-investigation.md)
and [022](../../../sessions/2026-10-10-weather-habitat/022-bounded-frame-cadence-candidate.md).

## Policy

`frame-cadence.js` exports independent `DeskFrameCadence.create()` instances and
a CommonJS equivalent for pure tests. Call `shouldDraw(nativeRafTimestamp,
lowPowerBoolean)` once per callback. It schedules no timers and draws nothing.

- Low power targets a 33.333 ms phase with up to 4 ms early allowance.
- Require at least 24 ms between paced paints. This prevents the prior naive
  accumulator's 50/16 ms catch-up pair. The minimum bounds paced RAF decisions;
  immediate synchronous clock/layout snapshots remain allowed.
- Advance the phase by one period after a paint. When more than one period
  behind, rebase the next due time to the current callback plus one period.
  Emit at most one decision per callback; never replay missed frames.
- Normal mode accepts every callback and establishes the next low-power phase
  from the latest normal paint. Reset or a backward callback rebases the state;
  invalid inputs fail before mutating it.

The 4 ms allowance covers small callback jitter; the 24 ms floor excludes the
known 16 ms catch-up failure while allowing necessary 26.7/40 ms sampling at
75 Hz. These are rendering policy constants, not joint/anatomy parameters or
relaxed test thresholds. A synthetic jitter trace still contains an occasional
57 ms gap, so mean cadence alone is insufficient for acceptance.

Both Woodland loops use this helper. They continue to calculate scene/pose/time
from actual current time, rather than incrementing simulation time per rendered
frame. Their visibility, Settings, reduced-motion, quiet-visit and rest controls
remain intact. No scene art, body contacts or gait curves change. Cadence state
survives synchronous refreshes so a refresh cannot create repeated catch-up
bursts; long idle periods rebase on the next callback.

## Verification and boundaries

Independent pure fixtures cover 60/75/120/144 Hz, ordered seeded jitter, fixed
catch-up/outage boundaries, mode switches, reset, backward skipped callbacks,
instance isolation and invalid input. A 20 Hz callback fixture documents that
pacing cannot invent missing rendering opportunities.

Browser tests measure rendered geometry with real RAF/timers, a 2.1-second
window and original gates: low power >=26 updates/s with p95 <=46 ms, normal
>=45 with p95 <=31 ms, maximum gaps <100 ms. The dashboard probe also collects
native callback timestamps and bounded gap diagnostics. The reduced-motion
climber test awaits media-query event dispatch before starting its quiet visit;
its original hidden-state assertion remains.

Build, pure fixtures and integration review pass. Full hosted/portable browser
and cross-platform CI results are pending at this checkpoint. No Ally/Vanadium,
sustained-operation or new live-anatomy acceptance is claimed. Review actual
walking/climbing motion as well as cadence metrics before physical acceptance.

## Read-only controls

`node tests/diagnose-motion-control.cjs` compares native callback delivery in an
empty page with the real dashboard and two hidden-art controls. A separate motion
diagnostics workflow records browser versions and runner architecture on macOS
latest, macOS Intel and Windows. Its performance values are research data; the
production `npm test` gates remain required. Hidden controls never change shipped
art or establish production passes. [Session 023](../../../sessions/2026-10-10-weather-habitat/023-rendering-control-probe.md)
records the candidate failures motivating this comparison.
