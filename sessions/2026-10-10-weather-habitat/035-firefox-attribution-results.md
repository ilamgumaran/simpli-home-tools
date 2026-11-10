<!-- SPDX-License-Identifier: LicenseRef-Simpli-Noncommercial-1.0 -->
# Firefox attribution — complete evidence and observer effect

- Message ID: `2026-10-10-weather-habitat/035`
- Research date: `2026-10-31 UTC`
- Finalized: `2026-11-01 America/New_York`
- From: cloud clock orchestrator
- To: owner and implementation/device sessions
- Branch: `feature/anatomy-foundation`, [draft PR #16](https://github.com/ilamgumaran/simpli-home-tools/pull/16)
- Research checkpoint: `33050d7af61c08c9fb1601e04a06dd33c62cc649`
- Runtime: `dd6e9d53694d6b5c4667bd0c778635b2779c746e`, unchanged
- Previous: [034 — ownership](034-firefox-attribution-ownership.md)
- Status: complete research and local regression checks; observer effect limits attribution

## Evidence recovered

The [design](../../tools/little-orbit/design/FIREFOX-STALL-ATTRIBUTION.md)
defines the fixture, real clocks, four-condition Williams order and conservative
profile alignment. The two complete archives retain **32 cases / 64 windows**:

- [16 Linux cases](../../tools/little-orbit/design/evidence/firefox-stall-local-33050d7-2026-10-31.jsonl)
  and [independent analysis](../../tools/little-orbit/design/evidence/firefox-stall-local-33050d7-analysis.json).
- [16 Windows cases](../../tools/little-orbit/design/evidence/firefox-stall-ci-41200331944.jsonl)
  and [independent analysis](../../tools/little-orbit/design/evidence/firefox-stall-ci-41200331944-analysis.json),
  from [run 41200331944](https://github.com/ilamgumaran/simpli-home-tools/actions/runs/41200331944),
  check `124534699303`.

All cases, both windows, canonical hashes, exact metrics and the eight two-case
batches per host validate; there are no sample or completeness errors. Raw
performance profiles remain ignored locally and in three-day research artifacts;
Git retains their hashes and bounded, sanitized extraction. The
[summary](../../tools/little-orbit/design/evidence/firefox-stall-attribution-2026-10-31-summary.json)
records exploratory interval counts and round pairing. Native profiler traces
are not browser user-profile configurations and no private profile is committed.

## Windows result

Firefox 153 on Windows x64 / Node 22.23.4 completed the intended low-to-normal
history. Normal-mode geometry p95 by round is:

| Condition | Round 0 | Round 1 | Round 2 | Round 3 |
| --- | --- | --- | --- | --- |
| Full, profiler enabled | 17 | 17 | 17 | 17 |
| Hidden, profiler enabled | 17 | 17 | 17 | 17 |
| Full, profiler disabled | 18 | 31 | 17 | 18 |
| Hidden, profiler disabled | 29 | 18 | 18 | 18 |

All values are milliseconds. The original normal gate is <=31 ms, so **the
original failing p95 event was not captured**. Research-job success is not a
replacement for required acceptance or a reproduction of its historical failure.

As an exploratory descriptive bin, native gaps >=25 ms occur **0/1,041** times
in the eight profiled normal windows, versus **41/1,002** unprofiled intervals
(full 22/501; hidden 19/501). The same 41 gap positions occur in the unprofiled
geometry observations, with equal native/app/geometry counts in every normal
case. Thus these particular irregular intervals exist at or before native
callback delivery; they are not introduced solely by geometry observation.
25 ms is not a new acceptance threshold.

Full-minus-hidden unprofiled geometry p95 differences are -11, +13, -1 and
0 ms. There is no stable full-scene penalty across four rounds. Profiling is
associated with different cadence, demonstrating a measurement perturbation
risk, but this experiment does not identify a scheduler, browser, rendering-
feedback or host mechanism. It does not justify changing JavaScript, app pacing,
rendering technology, operating-system settings or timing gates.

All profiled Windows low/normal windows have **zero above-threshold geometry
gaps**, so every extracted gap-level category and marker list is empty.
There is no positive Windows JavaScript/layout/paint attribution here. A smooth
profiled trace cannot explain the absent original outlier.

## Profile integrity and local limits

Both hosts record actual Gecko v34, a 1 ms interval and enabled `js,stackwalk`
features. Requested `leaf` is unsupported/absent and reported rather than faked.
All 16 profiled Windows window alignments resolve the page's content GeckoMain
and inner-window ID; offset disagreements are 0.207–1.126 ms with diagnostic
margins 3.207–4.126 ms. These margins are not a formal precision guarantee.
Gecko split start/end marker phases are retained without inventing durations.
Sampled stack labels and raw CPU deltas are not CPU-utilization measurements.

Local Linux Firefox 153 also completes 16 valid cases. Normal p95 is 18 ms in
all conditions. One profiled normal window contains a single 45 ms interval
while p95 remains 18 ms; its extraction exercises real marker/category output.
It is not Windows evidence or a p95-gate failure. No CPU or idle cause follows
from its sampled category labels. The complete tuples and truncation counts
remain available for independent review.

## Application verification

Build passes, and fresh full Chrome/Firefox `npm test` exits **0**: 21 pure
programs, 15 browser programs per engine, all **44 local cadence cases** and
both offline checks. All 36 instrumented records reproduce metrics within
1e-7. The [validation report](../../tools/little-orbit/design/evidence/firefox-stall-local-validation-2026-10-31.json)
retains exits, exact case metrics, log hash and recomputations. Node 24.19.0 ran
on Linux. Edge was not rerun for this test-only slice; its focused checks from
033 remain historical evidence for the identical runtime. Physical Ally/
Vanadium and sustained acceptance remain unrun.

The new extractor/notice/analyzer units pass, including real split-phase marker
fixtures, clock-precision ties, truthful supported features, inherited profiler
environment removal, hashes and absent-whole-case completeness. Syntax, JSON,
raw trace hashes, links, whitespace and generated-build parity pass. Sol 6
independently reviewed source, actual profile calibration, archives and result
interpretation. No source or evidence review blocker remains.

The runtime and portable SHA-256 remain unchanged:
`0accb9737b218f4e4d202b368d0277355d114c21758163ae09cb57f61e142b85`.
Prior timing failures in 031/033 remain retained when a later run passes.

## Subsequent hosted cache failure

Before publication, the completed [push check](https://github.com/ilamgumaran/simpli-home-tools/actions/runs/41200331906)
at the same research checkpoint also exposed a portable Chromium cached-weather
timeout in `verify-weather-habitat.cjs:102`. The hosted portion had already
printed its final PASS, so this failure belongs to the subsequent `file:` case.
The parsed cache diagnostic was null and weather was unavailable; raw storage
was not captured, so absence and malformed JSON cannot be distinguished.
The companion Ubuntu check passed. The local full pass above remains valid;
it does not erase the hosted functional failure or prove its cause.

No cache code changed in this profiling slice. The next clock task will first
capture and distinguish the portable cache failure before extending profiling.
The marker-only investigation below remains proposed after that functional
boundary is understood. Required timing and functional gates stay unchanged.

## Next bounded action

Validate a lower-interference method before another runtime change. A proposed
next slice is to feature-detect and validate Gecko's marker-only profiling mode
against profiler-disabled native delivery, requiring actual feature metadata,
complete paired cases and unchanged thresholds. If it changes cadence too,
keep that result and use a profile on the actual target browser/device with a
repeatable event. Do not infer a sampling-based remedy from this experiment.
A2 artwork and A3/A4 contact/gait migration remain deferred by the current
roadmap; the owner can reprioritize them separately. PR #16 remains draft with
hosted timing and physical Ally/Vanadium gates open. No merge, install or
release. Use 036 for the next cloud follow-up; 026 remains reserved for device
feedback.
