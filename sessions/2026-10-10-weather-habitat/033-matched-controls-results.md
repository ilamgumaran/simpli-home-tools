<!-- SPDX-License-Identifier: LicenseRef-Simpli-Noncommercial-1.0 -->
# Matched controls and hidden marker work — results

- Message ID: `2026-10-10-weather-habitat/033`
- Date: `2026-10-31 UTC`
- From: cloud clock orchestrator
- To: owner and implementation/device sessions
- Branch: `feature/anatomy-foundation`, [draft PR #16](https://github.com/ilamgumaran/simpli-home-tools/pull/16)
- Starting revision: `fbb5969fd702c7a86858d1b38a24cbc5eb216055`
- Control revisions: local `171fe55`, complete hosted `ef70fef`
- Efficiency candidate: `dd6e9d53694d6b5c4667bd0c778635b2779c746e`, pushed
- Previous: [032 — ownership](032-matched-controls-ownership.md)
- Status: controls and efficiency candidate reviewed; local validation passes, hosted/device gates remain open

## Complete control evidence

The [study](../../tools/little-orbit/design/MATCHED-MOTION-CONTROLS.md)
defines matched conditions and limitations. The
[evidence index](../../tools/little-orbit/design/evidence/motion-controls-2026-10-31-index.json)
tracks **96 complete records**: 48 local Linux records across three profiles,
and 16 each on hosted Windows, macOS ARM and macOS Intel. Every group has all
planned balanced keys, raw native/app/geometry tuples, source identity and
canonical hashes. Exact summary recomputation and independent Sol 6 archive
checks pass. Local profile names identify intended targets; only the actual
provenance establishes an operating system.

The complete hosted research run is
[41165879762](https://github.com/ilamgumaran/simpli-home-tools/actions/runs/41165879762),
source `ef70fefc759d7d28b81140e8af4d2750d835029a`. All three diagnostic jobs
succeed with zero setup/sample errors. Their values are research evidence,
not production gate passes. Each table entry is a range across four samples:

| Actual host | Blank native entry p95 | Full native entry p95 | Full geometry p95 | World-hidden geometry p95 |
| --- | --- | --- | --- | --- |
| macOS ARM, Chromium 151 | 33.5–36.0 ms | 32.3–37.7 ms | 50.5–54.7 ms | 50.9–54.6 ms |
| macOS Intel, Chromium 151 | 105.0–121.0 ms | 103.3–133.2 ms | 107.6–146.3 ms | 95.5–147.5 ms |
| Windows x64, Firefox 153 | 29–31 ms | 17–32 ms | 17–32 ms | 17 ms |

On ARM, hiding the full world does not remove the long accepted/geometry gaps;
blank native delivery is already irregular. Intel blank/native delivery is
far below the clock's target. Windows has one full-scene outlier while three
full samples and all hidden samples have geometry p95 17 ms, but full-minus-
blank native entry p95 differences are +3, -14, -12 and -13 ms. Four samples do
not isolate a repeatable scene expense. There is no supported global rendering
or limiter change from these controls. The underlying native-delivery cause
is not established as OS, browser or infrastructure.

Local controls have no sample errors. Full-scene geometry p95 is 18 ms for
Firefox dashboard normal, 33.6–34.1 ms for Chromium dashboard low-power and
17.0–17.4 ms for Chromium immersive DPR2 normal. Full/hidden native differences
are small and do not reproduce the historical local 113.1 ms stall. Geometry
counts may exceed accepted RAF calls because synchronous refreshes also write
geometry; these are observations, not compositor presentation or draw counts.
Normal profiles start directly in normal mode, unlike the acceptance test's
prior low-power sample; the `modeEntry` field and study disclose that boundary.

## Recovery correction

The initial [171fe55 run](https://github.com/ilamgumaran/simpli-home-tools/actions/runs/41165345832)
completed all samples, but individual-record notice chunks exceeded GitHub's
observed step limit. Only 6 ARM / 11 Intel / 8 Windows whole records could be
recovered; those unbalanced subsets are retained separately and excluded from
balanced conclusions. Artifact backing-host downloads returned 403.

The corrected transport losslessly compresses an entire four-record round into
<=10 notices, verifies compressed payload and original record hashes, and
rejects incomplete/conflicting data. The analyzer independently requires all
planned keys so an entirely absent round cannot become a successful experiment.
All four batches on each hosted rerun recovered exactly. A real local four-case
round also recovered byte-equivalent JSON records in five chunks. The pure
recovery/analyzer/plan programs pass, including malformed data, precision ties,
summary mismatches, Node/platform grouping, missing conditions and accepted-only
app metrics. No sample values were rounded or removed to fit notices.

## Measured efficiency candidate

The [separate local method probe](../../tools/little-orbit/design/evidence/dashboard-method-probe-2026-10-31.json)
records eight summarized samples and exact instrumentation. At second 9, when
the minute marker is hidden, the dashboard still performs 63–64 path length,
point and two CTM computations per 2100 ms window. Their total cost is only a
few milliseconds; instrumented app callbacks peak at <=3 ms. This does not
explain the retained 32–55 ms gaps.

Source review shows `trailJoint` is used only by the marker, visible in the
first three seconds of an active minute. The bounded candidate computes it
only while needed; visible markers continue to use fresh native geometry after
digit changes, clock jumps and resize. This removes unused geometry work rather
than claiming to repair native callback outages. The independent reviewer
approved this scope and its reference checks.

The candidate is committed at `dd6e9d5`; portable SHA-256 is
`0accb9737b218f4e4d202b368d0277355d114c21758163ae09cb57f61e142b85`.
The identical [after-guard probe](../../tools/little-orbit/design/evidence/dashboard-method-probe-after-guard-2026-10-31.json)
records zero method calls in all eight samples, versus 2,020 calls before.
It supports removed unused work, not a callback/cadence improvement; callback
costs vary and one after sample has 125 rather than 126 native callbacks.

Focused marker checks exit 0 in Chrome 151, Firefox 153 and Edge 154 for hosted
and portable forms: every minute ones digit, the 3-second boundary, four views,
backward jumps and quiet/companion settings. The candidate's full Chrome/Firefox
`npm test` exits **0**: 18 pure programs, 15 browser programs per engine, all
**44 cadence cases** and offline checks. The affected Edge dashboard program
also exits **0**, including four cadence cases and its transition checks.
Current coverage is **48/48 local cadence passes**; Edge's full suite was not
rerun. All 40 instrumented records recompute exactly within 1e-7. The
[local validation report](../../tools/little-orbit/design/evidence/marker-candidate-local-validation-2026-10-31.json)
retains job exits, log hashes, all case metrics and recomputations. Node 24.19.0
ran on Linux. Build/source-portable parity, syntax, JSON/trace hashes, links
and whitespace pass. The independent Sol 6 review found no source, test or
portable blocker.

The pre-guard baseline full run also exits 0 with 44 cadence passes; that result
belongs to runtime `9993133` and 14 browser programs per engine. The historical
113.1 ms failure in 031 remains retained. A later pass does not erase it.

## Candidate hosted gates

At `dd6e9d5`, both Ubuntu jobs pass. The
[push run](https://github.com/ilamgumaran/simpli-home-tools/actions/runs/41166757850)
has macOS dashboard low-power p95 **51.2 ms** and a cancelled Windows job.
The [PR run](https://github.com/ilamgumaran/simpli-home-tools/actions/runs/41166762181)
has macOS p95 **54.8 ms** and Firefox portable immersive low-power p95
**47 ms** on Windows. Required limits remain 46 ms for these cases. The
PR checkout is merge `04041d62d377a819d504f2f897e64547c3ac0dfe`, not the
head SHA. Exact hash-verified failure records are retained for
[push macOS](../../tools/little-orbit/design/evidence/marker-candidate-41166757850-macos.jsonl),
[PR macOS](../../tools/little-orbit/design/evidence/marker-candidate-41166762181-macos.jsonl)
and [PR Windows](../../tools/little-orbit/design/evidence/marker-candidate-41166762181-windows.jsonl).
The efficiency guard does not clear these hosted delivery gates.

## Next action

Keep required browser gates unchanged and PR #16 draft. Attribute a repeatable
native/long-frame event on the actual failing browser or target device before
another rendering rewrite. The Windows full-scene outlier deserves a profile;
blank/headless macOS delivery limits do not justify a visual policy change.
Use the updated Ally handoff for separate sustained Edge/Chrome/Firefox and
Vanadium observation; physical-device acceptance remains unrun here. A2 artwork
and A3/A4 live gait migration remain deferred by the current roadmap. No merge,
release or installation is performed. Use 034 for the next cloud follow-up;
026 remains reserved for device feedback.
