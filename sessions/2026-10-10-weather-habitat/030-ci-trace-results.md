<!-- SPDX-License-Identifier: LicenseRef-Simpli-Noncommercial-1.0 -->
# Exact CI traces — results and continuation

- Message ID: `2026-10-10-weather-habitat/030`
- Date: `2026-10-30 UTC`
- From: cloud clock orchestrator
- To: owner and implementation/device sessions
- Branch: `feature/anatomy-foundation`, [draft PR #16](https://github.com/ilamgumaran/simpli-home-tools/pull/16)
- Diagnostic checkpoint: `d58f040a098d87ebd7c3cf07fd454e1ebd279dc2`
- Display runtime: `99931338f12d5111ea0321cc2690d6588ef59ab9`, unchanged
- Previous: [029 — ownership](029-ci-trace-ownership.md)
- Status: exact hosted failure evidence recovered; final local/Windows outcomes below

The [capture and recovery guide](../../tools/little-orbit/design/CI-FAILURE-TRACING.md)
defines the new test-only tools. Production code, the limiter, browser modes,
2100 ms sampling, numerical acceptance gates and navigation defaults remain
unchanged. Portable SHA-256 is still
`1e36b79704ac3046230644555ffc5fc691cc5229ac2df067a61d2901e0169d8b`.

## Review and local verification

Sol 6 independently analyzed the current policy and reviewed diagnostic wiring.
Lighter execution models built the two helpers, integration and pure analyzer.
The integrator found and corrected an initial writer schema mismatch before
publication: flattened cadence tuples and navigation fields now persist rather
than being discarded by an overly narrow whitelist. Real Firefox hosted and
portable dashboard/navigation probes then passed; all six records contain the
intended data, and p95 recomputes exactly from unrounded geometry timestamps.

The helper unit suites pass. The analyzer's 15 independent fixtures cover missed
app callbacks, accepted draws without geometry changes, surrounding event
ordering, invariant violations, backward/malformed input, mode uncertainty and
exact p95.
Its CLI also reads real browser records without metric mismatches. Unit fake RAF
queues are isolated from browser acceptance; actual acceptance uses real RAF.

Both fresh local `npm test` runs exit **0**: combined Chrome/Firefox and native
Edge, including all 14 browser programs per engine, all **66 cadence cases** and
offline checks. The two capture/navigation unit programs are included in both
full runs. The analyzer's 15-case program passes independently and is included
in the Edge run and updated standard runner; it was added after the combined
run had started. Existing 11 pure clock programs also pass. No repeated full run
was needed for that standalone pure-unit addition.

All **54 instrumented cadence samples** retain native/app/geometry arrays and
recompute FPS, p95 and max exactly (within 1e-7) from raw geometry. Six real
hosted/portable navigation success records retain events, and the wrapper
returns each original response.
The [local validation report](../../tools/little-orbit/design/evidence/ci-trace-local-validation-2026-10-30.json)
records all 66 case metrics and 54 recording/recomputation checks. Build, syntax,
unit and link/JSON/whitespace checks pass. App/portable bytes remain unchanged.
The separate failed navigation snapshot path is unit-tested; no real navigation
timeout recurred locally, so its historical cause is not claimed fixed.

## Recovered macOS failures

Failure notices successfully recovered each complete payload without downloading
the blocked log blob. All chunks were present and each trace ID matches a
SHA-256 of its canonical full payload. The first CI artifact also exists (ID
`12955412323`, 9649 bytes); notice recovery works independently of that download.

| Run | API event / actual checkout | Native / app / accepted / geometry | Geometry p95 / max | Accepted nominal p95 |
| --- | --- | --- | --- | --- |
| [41005460616](https://github.com/ilamgumaran/simpli-home-tools/actions/runs/41005460616) | `push` / `d58f040` | 111 / 111 / 56 / 56 | 54.0 / 93.8 ms | 51.4 ms |
| [41005464977](https://github.com/ilamgumaran/simpli-home-tools/actions/runs/41005464977) | `pull_request` / merge `1248434` | 113 / 113 / 56 / 56 | 55.2 / 57.3 ms | 55.4 ms |

Both are hosted dashboard low-power Chromium 151.0.7922.34, 854×480 DPR1 on
ARM64 macOS. Node patch versions differ (22.23.3 and 22.23.4); these remain
separate samples. Their raw provenance records the actual checkout rather than
assuming the PR head is the checkout.

All native nominal timestamps match app timestamps index-for-index. Accepted
app decisions match geometry observations one-to-one, and there are no rejected
callbacks beyond the policy's 29.333 ms eligibility bound. No accepted pair is
closer than the 24 ms minimum. Observation follows app decision entry by
0.3–4.6 ms (p95 1.9) in the first run and 0.2–1.6 ms (p95 1.3) in the second.
That lag includes synchronous work and observer delivery; it is not display paint.

Ten/14 geometry gaps exceed 46 ms. In the first run, early rejected callbacks
arrive 5.6–23.7 ms after the preceding accept, below the hard 24 ms minimum;
the next callback arrives late. One native outage itself is 85.9 ms. The second
has no comparable outage: nominal native p95/max is 33.7/37.1 ms, but early
opportunities followed by late ones still produce accepted p95 55.4 ms. Three
additional long geometry intervals include accepted callbacks that begin
15.9–19.1 ms after their nominal RAF timestamp. This is callback delivery delay,
not a missed app callback or a long geometry-observer lag.

The immediate failure is therefore present before geometry observation. These
traces do not identify why native delivery varies (host scheduling, browser,
paint/compositing or other work). They do not establish a justified runtime
limiter/rendering change. Merely increasing the phase allowance would still
leave the rejected opportunities below the current hard minimum in these gaps.

The [paired summary](../../tools/little-orbit/design/evidence/ci-cadence-macos-2026-10-30-summary.json),
[first raw record](../../tools/little-orbit/design/evidence/ci-cadence-macos-41005460616.jsonl),
[first analysis](../../tools/little-orbit/design/evidence/ci-cadence-macos-41005460616-analysis.json),
[second raw record](../../tools/little-orbit/design/evidence/ci-cadence-macos-41005464977.jsonl)
and [second analysis](../../tools/little-orbit/design/evidence/ci-cadence-macos-41005464977-analysis.json)
preserve exact evidence. The analyzer checks late rejections; its separate
24 ms accepted-gap check is currently manual, as the summary records.

## Windows and CI outcome

Both runs pass Ubuntu and fail Windows/macOS. Windows failure notices also
recover complete, canonically hash-verified records:

| Run | Exact Windows case | Native / app / accepted / geometry | p95 / max | Accepted nominal p95 |
| --- | --- | --- | --- | --- |
| 41005460616 (`push`) | Firefox 153 portable immersive, 854×480 DPR1 low | 117 / 117 / 62 / 62 | 47 / 48 ms | 47.32 ms |
| 41005464977 (`pull_request`) | Firefox 153 portable rain, 854×480 DPR1 low | 110 / 110 / 62 / 62 | 47 / 48 ms | 47.48 ms |

FPS is 29.370/29.328; only p95 fails. There are no missing app callbacks,
accepted draws absent geometry, late policy rejections or accepted pairs below
24 ms. Geometry/entry times use Firefox's integer-ms clock, with observer lag
0–2 ms and 0–1 ms, but nominal RAF gaps already fail: rounding alone does not
explain these results. Five/six geometry gaps exceed 46 ms; each has one rejected
callback at 15.62–18.76 ms after the preceding accept, then the next callback
arrives 29.5–32.18 ms later. The earlier Windows fixture contains no native gap
>=24 ms; these failures contain 16/24 such native intervals, so the old fixture
cannot stand in for these delivery patterns.

The [Windows summary](../../tools/little-orbit/design/evidence/ci-cadence-windows-2026-10-30-summary.json),
[push raw record](../../tools/little-orbit/design/evidence/ci-cadence-windows-41005460616.jsonl),
[push analysis](../../tools/little-orbit/design/evidence/ci-cadence-windows-41005460616-analysis.json),
[PR raw record](../../tools/little-orbit/design/evidence/ci-cadence-windows-41005464977.jsonl)
and [PR analysis](../../tools/little-orbit/design/evidence/ci-cadence-windows-41005464977-analysis.json)
pin all data. Accepting the rejected intermediate callbacks would violate the
current minimum. A different phase policy might shift earlier decisions, but
needs replay against these exact new sequences and the existing checks before
any runtime change is justified.

The older Windows Time Climber II navigation timeout did not recur in these
runs; its cause remains unestablished. The new navigation wrapper passes real
hosted/portable probes and unit-tested failure/bounded-snapshot paths. That is
not evidence that the historical navigation failure is fixed.

Correction to 028: run `40811993306`, called a duplicate push there, has API
`event: pull_request`. Its run ID and numerical failures are unchanged. This
message uses explicit run-event metadata rather than inferring it from run order.
Published 028 remains historical.

## Next bounded work

Keep PR #16 draft while hosted gates fail. First replay any proposed policy
against the newly captured native sequences, not only the old Windows fixture.
Compare native delivery with matched
blank/full/hidden-art controls on the same failing platform and browser. Retain
original failed samples, exact timing gates and real timers. Use the captured
app/native/geometry ordering to choose a change only when it isolates an expense
or an avoidable scheduling decision; do not infer compositor presentation from
DOM updates. The next investigation should reuse these tools instead of adding
another speculative transform or changing thresholds.

A2 hand/foot artwork and A3/A4 gait/contact migration remain later stages unless
the owner changes priority. Physical Ally/Vanadium and sustained-display
acceptance remain unrun. No release, installation or merge was performed. Use
031 for the next cloud message; 026 remains reserved for device feedback.
