<!-- SPDX-License-Identifier: LicenseRef-Simpli-Noncommercial-1.0 -->
# Matched native delivery and scene controls

Status: complete research controls and a locally validated hidden-marker
efficiency candidate; hosted/device gates remain open. The controls themselves
changed no runtime or required gate. The later marker guard changes the app and
portable build as described below; limiter and timing gates stay unchanged.
[Ownership 032](../../../sessions/2026-10-10-weather-habitat/032-matched-controls-ownership.md)
records scope; [results 033](../../../sessions/2026-10-10-weather-habitat/033-matched-controls-results.md)
records complete evidence and candidate validation.

## Controls

The probe uses three profiles for the observed failure modes. Names identify
intended target platforms; `provenance.platform` records where a sample actually
ran. Running all profiles on Linux does not test Windows or macOS.

| Target | Browser | View / viewport / DPR | Power |
| --- | --- | --- | --- |
| Windows | Firefox | Dashboard / 854×480 / 1 | Normal |
| macOS | Chromium | Dashboard / 854×480 / 1 | Low |
| Local Linux | Chromium | Immersive / 1280×720 / 2 | Normal |

Each profile has four conditions: blank page, complete scene, static scenery and
numerals hidden, and all scene SVG layers hidden. Hidden controls use
`visibility:hidden`, keeping scene work and geometry updates running. They
isolate some paint/compositing work; they do not remove the scene's JavaScript.
Dashboard static-hidden hides its sky, light, background, ground, creek,
details and numerals. Immersive static-hidden hides backdrop, river, foreground,
camp, structures and the reading SVG. World-hidden hides the dashboard SVG or
all five immersive scene layers; the surrounding clock UI remains visible.

Each sample starts a fresh browser, settles a blank page for 4000 ms, then
creates a new context, loads the condition, waits for fonts and settles for
1000 ms **after** visibility changes. Four rounds use a Williams order so each
condition occupies each position once and each ordered adjacent pair appears
once. All samples run sequentially on a host. Sample errors are retained; the
batch continues and exits unsuccessfully if any sample has an error.

These are matched research conditions, not an exact reproduction of the
acceptance suite's earlier-page history or normal-mode transition from a prior
low-power sample. Context explicitly labels `modeEntry: direct-normal` (or
`direct-low-power`); normal power is configured from page startup. The app calendar advances from the existing dashboard or
immersive cadence-test instant. RAF, `performance.now()` and 2100 ms elapsed
measurement remain real. Every compared page uses the same capture helper's
native sampler. Blank includes the real inert policy factory solely to enable
the shared hook; it makes no app decisions. App pages also have the existing
geometry observer, which adds work absent from an empty blank page. Normal-mode
synchronous scene refreshes may produce more geometry observations than RAF
policy calls. Neither native nor DOM observation establishes presentation.

## Reproduction and evidence

From `tools/little-orbit/`, with installed Playwright browsers:

```sh
node tests/motion-control-unit.cjs
node tests/diagnose-motion-control.cjs
CLOCK_DIAGNOSTIC_PROFILE=all node tests/diagnose-motion-control.cjs
```

`CLOCK_DIAGNOSTIC_PROFILE` defaults to `platform`; `all` exercises all three
profiles on the current machine. `CLOCK_DIAGNOSTIC_REPEATS` is 4 by default or 8.
`CLOCK_DIAGNOSTIC_ROUND=0` through `repeats-1` runs one four-condition round.
Round 0 or an unfiltered run starts a new file; later filtered rounds append.
Do not run independent batches concurrently against the same file or browser
host. `PLAYWRIGHT_MODULE`, `CLOCK_TEST_CHANNEL` and
`CLOCK_DIAGNOSTIC_HEADLESS=false` retain existing launcher controls.

Every schema-1 `motion-control` record in
`test-results/motion-controls.jsonl` retains:

- Actual platform, architecture, Node and Git revision, plus capture helper,
  diagnostic source and plan source SHA-256s.
- Profile, condition, round, position, browser/version, viewport/DPR, mode, view,
  launcher channel and headless setting.
- Ordered native nominal/actual tuples, app policy tuples with original
  decisions, raw geometry times, sample endpoints, columns and visibility.
- Exact summaries, per-case errors and a canonical full-record trace hash.

Only concise summaries go to ordinary stdout. Complete round batches of four
records are losslessly gzip-compressed, hash-checked and base64-encoded into
at most ten notices per step, each <=2400 characters. Emission fails before
writing if this limit cannot hold the complete batch. Recovery rejects missing
or conflicting chunks, invalid compression, payload hashes and record hashes.

The initial `171fe55` individual-record notices exceeded GitHub's observed
per-step cap: the three successful jobs retained only 6/11/8 complete records
of 16 on ARM/Intel/Windows. The backing artifact host returned 403. Those
incomplete subsets cannot establish a balanced comparison. Compressed round
transport corrects that evidence-delivery failure; original sample values are
preserved exactly rather than rounded or reduced.

```sh
gh api repos/ilamgumaran/simpli-home-tools/check-runs/CHECK_ID/annotations \
  --paginate --jq '.[]' > annotations.jsonl
node tests/motion-control-notices.cjs annotations.jsonl recovered.jsonl
node tests/analyze-motion-controls.cjs recovered.jsonl > analysis.json
```

The decoder requires every part of each seen batch. The analyzer separately
requires every planned condition/round/position: an entirely absent batch must
also fail completeness. It verifies schemas, record hashes and exact summary
recomputation, retains errors, and separates actual platform/architecture,
Node/browser version, modes, dimensions and source/helper identities. It reports
condition ranges/medians, accepted app timing, geometry observation timing and
paired round differences without assigning a cause.

The research workflow separates rounds into steps and uploads raw JSONL for
seven days, including failures. A final check requires
all 16 planned keys exactly once and no sample errors; timing numbers remain
research data. Passing this diagnostic does not pass a production timing gate.

Keep raw samples with browser/checkout identity. Compare each condition across
all rounds, including outliers, and report ranges/medians without claiming a
four-sample statistical guarantee. Distinguish nominal callback intervals,
actual callback-entry intervals, accepted intervals and geometry observations.
A blank/native failure is evidence about delivery on that run, not proof of an
operating-system cause. A full/hidden difference needs profiling before choosing
an optimization. Preserve every failed acceptance sample when later runs pass.

## Separate geometry-read probe

A bounded local method probe checked the repeated dashboard trail reads in
`woodland-time.js`. Across four 2100 ms low-power samples per engine, Chrome
151 and Firefox 153 each delivered about 126 callbacks and 63–64 calls per
queried trail method. Total `getTotalLength`/`getPointAtLength`/`getCTM` costs were only a few
milliseconds per window; maximum instrumented app callback was 2.3 ms Chrome
and 3 ms Firefox. This establishes repeated work, not a cause for the observed
32–55 ms gaps. No production geometry cache follows from that measurement.
The [archived probe](evidence/dashboard-method-probe-2026-10-31.json) retains
setup, exact instrumentation source and all eight summarized measurements. It
uses one browser per engine and fresh contexts per sample, unlike the fresh
browsers in the main controls. It records method calls rather than geometry
observations and remains research instrumentation, not browser acceptance.

## Hidden-marker efficiency candidate

Complete controls now retain 48 local and 48 hosted records; their
[index and hashes](evidence/motion-controls-2026-10-31-index.json) distinguish
complete groups from the first run's incomplete subsets. The
[results handoff](../../../sessions/2026-10-10-weather-habitat/033-matched-controls-results.md)
records ranges and remaining limits. These samples do not isolate a consistent
scene expense responsible for the retained stalls.

A separately measured cleanup is implemented in `woodland-time.js`: trail
length, point and matrix reads run only while the minute marker is visible.
The value is otherwise unused. Visible marker geometry is recalculated at its
original point in the draw, preserving current digit/layout changes. The
baseline second-9 probe performed 63–64 calls to each of four SVG methods per
sample despite the marker being absent. This guard removes that unused work;
it does not establish a remedy for native callback outages.

`tests/verify-minute-marker.cjs` checks visible reference coordinates against
native SVG methods, hidden read counts, all ten minute ones digits, both sides
of the three-second boundary, four viewport sizes, backward clock changes and
quiet/companion settings. It uses a paused clock only for deterministic geometry;
performance gates continue using real timers. Chrome, Firefox and Edge focused
hosted/portable checks pass. The standard runner includes this program.

The [after-guard probe](evidence/dashboard-method-probe-after-guard-2026-10-31.json)
uses the same script/setup and records zero method calls in all eight samples,
versus 2,020 before. This measures removed work without establishing a cadence
gain. [Candidate validation](evidence/marker-candidate-local-validation-2026-10-31.json)
records full Chrome/Firefox and affected Edge passes (48 cadence cases), plus
40 exact raw metric recomputations. Required hosted Windows/macOS gates still
fail; current source and build identity are in session 033 and the Ally handoff.
