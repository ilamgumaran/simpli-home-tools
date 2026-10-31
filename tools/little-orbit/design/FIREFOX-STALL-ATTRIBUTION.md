<!-- SPDX-License-Identifier: LicenseRef-Simpli-Noncommercial-1.0 -->
# Firefox stall attribution

Status: research instrumentation; runtime `dd6e9d5`, portable bytes and required
browser gates are unchanged. [Results 033](../../../sessions/2026-10-10-weather-habitat/033-matched-controls-results.md)
retains the earlier 96-record matched study. The next question is what the
content thread does between callbacks in the occasional Windows full-scene
outlier. An outlier is not evidence of a JavaScript hot path by itself.

## Experiment

Four balanced Williams rounds compare full versus `visibility:hidden` world,
with the native Gecko profiler enabled or disabled: 16 fresh-browser cases.
Profiling itself can change timing, so both factors are retained. Each case
loads the same hosted dashboard fixture as the first page of `verify-motion.cjs`,
awaits fonts, settles for 1000 ms, samples low power for 2100 ms, then directly
sets `prefs.lowPower=false; WoodlandTime.sync()` and samples normal for 2100 ms.
Only the calendar is shifted; RAF, timers and performance clocks remain real.
Research records retain the original 26/46 ms low-power and 45/31 ms normal
FPS/p95 gates and strict maximum <100 ms without making this a gate substitute.

The observer matches the dashboard geometry signature and counts the first
mutation. This research uses the existing trace helper's native sampler; the
acceptance test also has a second native sampler. Extra UserTiming marks and
native profiling add overhead. The comparison matches fixture and low-to-normal
history, not every instruction of acceptance. Hidden conditions keep JavaScript
and document visibility active; other UI remains visible.

`MOZ_PROFILER_STARTUP` records requested `js,leaf,stackwalk` features at 1 ms
with a GeckoMain filter. Actual profile configuration/interval is retained;
unsupported requested features may be absent. All `MOZ_PROFILER_*` variables are
removed from disabled launches. Raw performance profiles come from fresh test
contexts, remain ignored locally, and upload as three-day research artifacts.
They are not browser user-profile installations and are not committed to Git.
Only bounded, sanitized derived evidence is stored in Git.

## Alignment and interpretation

Each low/normal window inserts unique `performance.mark` names and records their
page-clock start times. The extractor locates the unique child content
`GeckoMain` containing both corresponding Gecko `UserTiming` markers with the
same inner-window ID. It uses those two clocks directly, not the mocked Date or
a naive epoch/time-origin conversion. Both offsets and disagreement are kept;
>5 ms disagreement rejects alignment. The reported `3 ms + disagreement`
margin is a conservative diagnostic allowance, not a proven clock error bound.
Work near a boundary cannot be assigned to the page from timestamps alone.

The extractor retains up to four largest above-threshold geometry gaps in each
window, with full outlier count. All original geometry/native/app tuples remain
in the case. Every selected gap contains category counts over the expanded
profile interval, up to 32 raw sample tuples and 16 allowlisted marker events,
plus explicit counts/truncation. Counts are computed before truncation.

Gecko phases are decoded explicitly: 0 instant, 1 complete interval, 2 start,
3 end. A start/end event does not become an invented duration. RAF and synchronous
reflow commonly use separate phase-2/3 events. Marker scope identifies the page,
a different window or the process. Sampled stack labels describe the entire
content thread, not necessarily this page, and are not CPU utilization. Raw
thread CPU deltas may be absent or have unvalidated units; no CPU-time claim is
made from them. Missing samples/markers do not establish idle time or an OS cause.

## Reproduction and persistence

From `tools/little-orbit/` with Playwright Firefox installed:

```sh
node tests/firefox-stall-profile-unit.cjs
node tests/firefox-stall-notices-unit.cjs
node tests/diagnose-firefox-stalls.cjs
```

`CLOCK_STALL_SLOT=0` through `7` selects two adjacent cases from the fixed
16-case schedule. Slot 0 or an unfiltered run starts
`test-results/firefox-stalls.jsonl`; later slots append. Do not run independent
captures concurrently on the same host or output file. The Windows-only research
workflow runs each pair in a separate step. Every complete pair is losslessly
gzip-compressed into <=10 notice chunks of <=2400 characters, with payload and
canonical record hashes. Emission refuses an oversized batch rather than
truncating evidence. Full raw profiles are retained as artifacts alongside JSONL.

```sh
gh api repos/ilamgumaran/simpli-home-tools/check-runs/CHECK_ID/annotations \
  --paginate --jq '.[]' > annotations.jsonl
node tests/firefox-stall-notices.cjs annotations.jsonl recovered.jsonl
node tests/analyze-firefox-stalls.cjs recovered.jsonl > analysis.json
```

Recovery rejects incomplete/conflicting chunks, corrupt compression and hashes.
The independent analyzer must also require all 16 planned cases; a completely
absent pair is not detectable by chunk checks alone. Metrics must recompute from
unrounded geometry before interpreting any profile. Keep every sample and error,
separate actual host/browser/source identities and profiling factors, and retain
previous failures when later samples pass. A successful research job means
complete evidence without setup errors; it is not production or device acceptance.
