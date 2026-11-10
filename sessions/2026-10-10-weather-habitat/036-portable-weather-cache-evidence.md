# Portable weather-cache evidence

- Message ID: `2026-10-10-weather-habitat/036`
- Observed: 2026-11-01, America/New_York; finalized: 2026-11-05 UTC
- Direction: cloud → owner and implementation/device sessions
- Branch: `feature/anatomy-foundation`, draft PR #16
- Scope: test-only cache diagnostics; no weather-cache repair claimed

## Publication and ownership

The owner requested a Search publication check, then the next clock task.
Search Simpli is clean at `daddbeeefb6a642ecd9dc386ba94fe511c24248c`;
all local branches are published or already contained in main. Search PR #18
remains draft pending Mac native-package freshness/testing. No source is waiting
locally to be published. Clock checkpoint `10234d4` publishes the completed
[035 Firefox study](035-firefox-attribution-results.md).

This slice addresses the newly observed intermittent portable weather-cache
failure before further profiling or deferred anatomy artwork. Sol 6.1 planned
and integrated; Luna implemented the narrow test helper and verifier changes;
Sol 6 independently reviewed. Review findings about independent evidence sinks
and exact verifier provenance were addressed. The second review found no
blocking issue. Parent review also prevented a fallback-key storage read if
current-key discovery fails.

## What changed

The [evidence design](../../tools/little-orbit/design/PORTABLE-WEATHER-CACHE.md)
records the existing Ubuntu failure, producer/reload contract and interpretation
limits. The test reads only the current fixture cache, validates it in Node,
then performs the original offline reload and cached-status wait. No retry,
sleep, reseeding, timeout extension or assertion removal was added.

Failure-only records distinguish pre-reload producer failure from restoration
failure. A bounded post-failure snapshot and independent JSONL/notice outputs
preserve the original error. Full raw cache values are never emitted. Tests
cover classification, actual serialized observer bounds, no install-time or
fallback-key reads, lossless file append, notice fallback, snapshot timeout
and original error identity.

## Validation

- Build and final weather-cache unit program pass; portable bytes are unchanged.
- Full `npm test` exits **1**. All 22 pure programs pass. Chrome's 15 browser
  programs pass. Firefox reaches its thirteenth program: both weather functional
  forms pass, then portable 1280×720 DPR2 normal rain fails p95 **33 ms** against
  **31 ms** (53.81 fps, maximum gap 40 ms). The exact trace is retained and its
  metrics independently recompute. No failing case was retried.
- The remaining Firefox community and meal programs pass separately, as do
  offline portable checks in Chrome and Firefox. Across the full run and those
  completion checks, **43 cadence cases pass and one fails**. This does not turn
  the failed combined run into a pass.
- Edge 154 hosted weather checks pass; portable offline restoration times out
  with the original 30-second error. Rain cadence is not reached in this run.
  The new diagnostics prove the current key contains a usable 167-character
  snow forecast before reload and is **absent afterward**, with the same key
  and unit and no reported storage-read exception. This rules out malformed
  JSON for this captured event, not for every historical event.
- Edge's JSONL and notice records match byte for byte after decoding; canonical
  hash and exact verifier/helper source digests validate. The failure is preserved.
- The original unmodified Chrome baseline passes both forms and eight rain
  timing cases. It is recorded separately from candidate validation.

[Structured validation and log hashes](../../tools/little-orbit/design/evidence/portable-cache-local-validation-2026-11-01.json),
[Edge cache record](../../tools/little-orbit/design/evidence/portable-weather-cache-edge-2026-11-01.json),
and [exact Firefox timing trace](../../tools/little-orbit/design/evidence/portable-cache-validation-firefox-rain-failure-2026-11-01.jsonl)
are committed. No raw cache contents, browser profiles or installed dependencies
are published. Final unit/build checks were repeated on November 5 after resuming;
the browser results above are the preserved November 1 observations.

## Handoff

Runtime remains `dd6e9d53694d6b5c4667bd0c778635b2779c746e`.
Portable SHA-256 remains
`0accb9737b218f4e4d202b368d0277355d114c21758163ae09cb57f61e142b85`.
Passing observed runs cannot establish an intermittent race repair; the added
observation itself can change timing. Next, isolate why the portable page loses
access to a previously usable entry across reload: compare fresh contexts,
navigation and storage operations without reseeding the measured reload.
An absent key does not establish whether deletion, origin/storage isolation or
persistence behavior caused the loss. Test those alternatives before changing
production caching. Lower-interference Firefox capture remains subsequent
research; A2 and later gait artwork remain deferred behind current validation
gates or owner reprioritization.

PR #16 stays draft. Existing Windows/macOS timing and physical Ally/Vanadium
gates remain open. No merge, installation or release occurred. Use 037 for the
next cloud follow-up; 026 remains reserved for device feedback.
