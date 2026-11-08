# Portable weather-cache evidence

Observed 2026-11-01, America/New_York; finalized 2026-11-05 UTC.
Test-only investigation; no cache fix claimed.

## Observed boundary

At source `33050d7af61c08c9fb1601e04a06dd33c62cc649`, Ubuntu push
run 41200331906 / check 124534699232 passed hosted weather checks, then
timed out waiting for `cached` after the portable page reloaded offline.
The existing `read()` diagnostic returned null, which cannot distinguish an
absent key from invalid JSON. The companion Ubuntu PR job passed.
[Exact retained failure](evidence/portable-weather-cache-ci-2026-11-01.json).

Application inspection finds the cache write precedes live publication; the
write helper catches storage errors. Neither fact proves the failure's cause.
An unmodified Git-source Chrome baseline at `10234d4` passed hosted, portable
and all eight rain cadence cases. This is a non-reproduction, not a fix.

## Capture contract

The test installs a standalone observer that reads nothing until called. The
existing final `WoodlandScene.sync()` evaluation returns a snapshot in the same
RPC. Node asserts that the current-unit key matches the fixture coordinates,
the cached forecast is usable and its condition is snow (71). This establishes
the producer precondition before the existing offline reload.

The original reload, cached-status assertion and timeout remain. There are no
retries, sleeps, cache seeds or skips added to that path. On failure, at most
1.5 seconds of best-effort observation follows; the original error is rethrown.
Precondition failures are identified separately as `beforeReload`.

Only the current weather key is read. Raw capture is bounded to 4096 characters
and stays in memory. Saved summaries classify absent, invalid JSON, unusable,
usable, oversized or storage error; they include length, a complete-value hash
when available, unit, weather status/kind and fixture temperature/code.
They contain no full forecast or arbitrary storage values. Truncated values
are never classified as malformed JSON or hashed as complete values.

Schema-1 `weather-cache` records include a canonical SHA-256 trace ID, source
revision, verifier/helper digests, Node/platform/architecture and browser/form.
Failure records go independently to `test-results/weather-cache-diagnostics.jsonl`
and lossless CI notices using the existing trace transport. Either sink may
fail without suppressing the other or replacing the original test error.
The ordinary diagnostics artifact retains the JSONL for seven days.

## Interpretation and next step

The new observer captured a real Edge 154 portable failure. The current key
held a usable 167-character snow forecast before reload, then was absent after
reload, with the same key and unit and no storage-read exception. The original
cached wait timed out after 30 seconds. JSONL and notice copies match, their
canonical hash validates, and verifier/helper digests match the tested source.
[Sanitized Edge record](evidence/portable-weather-cache-edge-2026-11-01.json).
This event is absent storage, rather than malformed JSON; it does not establish
the underlying cause or explain every earlier occurrence.

Full Chrome/Firefox validation exits 1 on a separate Firefox portable DPR2 rain
timing gate (33 ms p95, limit 31 ms). Remaining functional/offline checks pass
separately; 43 timing cases pass and one fails. Edge's portable failure prevents
its rain timing cases from running. [Structured validation](evidence/portable-cache-local-validation-2026-11-01.json).

Reading and validating storage adds observation overhead and may change a
timing-sensitive result. Passing runs do not establish a repair. Next isolate
storage operations and navigation/context identity around the missing entry.
Compare fresh hosted/portable contexts without reseeding, adding reload waits,
or changing production code. Distinguish deletion from origin/storage isolation
and persistence behavior before proposing a runtime change. Keep weather,
performance and physical-device gates unchanged.
Lower-interference Firefox profiling and A2 artwork remain subsequent work.

## WC2 comparison — implemented research runner

The standalone `tests/diagnose-weather-cache-isolation.cjs` derives the current
canonical fixture through its first cached-restoration assertion. The
sibling-present prelude matches that source byte for byte. The sibling-absent
variant removes only the separate high-DPI context block and retains its
following viewport reset. Both retain the original snow-cache precondition,
offline reload, cached-status wait and snow/freshness assertions. Later malformed
cache, unit/location and timing tests are outside this narrow research fixture;
the full regression program remains their acceptance gate.

Four Williams rounds balance the four hosted/portable × sibling-present/absent
conditions by position and directed adjacency. Every case has a fresh browser.
This differs from the full canonical program's same-browser hosted-then-portable
sequence, so keep its unmodified control separately. All planned outcomes,
including errors, are retained; a later case is another planned condition, not
a retry of a failure.

Case records include canonical/derived verifier, helper and runner digests,
browser version, execution order, platform/Node provenance, error summaries and
links to newly appended weather diagnostics. Canonical SHA-256 IDs support
JSONL/notice verification. Missing or truncated diagnostic capture is explicit;
an empty trace list cannot prove no operation occurred. No raw weather response
or arbitrary storage value is added to these records.

With the local server running (`npm start`), execute:

```sh
node tests/diagnose-weather-cache-isolation.cjs
```

Select an installed engine with `CLOCK_TEST_BROWSER` as for the normal tests.
`--smoke` runs only one four-case row and must not be reported as a complete
balanced study. The default run writes all 16 cases to
`test-results/weather-cache-isolation.jsonl` and exits 1 if any case fails.
Preserve each run's added records separately. Run this study and other browser
or performance jobs sequentially. Pure unit checks protect the exact fixture boundary,
source marker assumptions, balanced order and stable hashes.

### November 8 outcome

All 48 planned cases are retained: Edge 16/16 pass, Chrome 15/16 pass and Firefox
16/16 pass. Chrome fails in round 1, position 4: **portable, sibling absent**.
Its original 30-second cached wait times out, with a usable 167-character snow
entry before reload and no entry afterward at the same key/unit. There is no
reported storage-read exception. The diagnostic matches the earlier Edge loss
boundary. The unmodified full Edge control separately passes both functional
forms and eight rain timing cases.

[Complete study summary](evidence/weather-cache-isolation-summary-2026-11-08.json)
links all case records and the new failure. Independent validation recomputes
49 record hashes, reconstructs all notices losslessly, checks the exact Williams
orders and source digests, and finds no diagnostic-read errors.

The sibling and prior hosted navigation in the same browser are **not required**
for this captured loss: the failure occurs without either. This does not establish comparative
failure rates, exclude timing influence from other work, or identify a deletion,
storage-partition change or persistence mechanism. Do not remove high-DPI test
coverage or change production caching on this evidence. Proceed to WC3.

## Follow-up tasks

1. **WC2: comparison complete.** Preserve the 47 passes and one failure above;
   future studies must retain their own cases rather than replace these results.
2. **WC3: trace relevant operations.** Add bounded test-only evidence for writes,
   removals, clear operations and navigation/context identity. Read only the
   current fixture key and retain no arbitrary values or file paths. Review
   hook interference and loss across navigation before trusting absence of an
   observed operation as proof that it did not happen.
3. **WC4: choose a justified repair.** Use the retained evidence to decide whether
   application behavior, browser storage assumptions or test isolation needs a
   change. Retest the original failure path without diagnostic cache seeding,
   and preserve hosted/portable, offline, unit/location race and timing gates.
   Report remaining cross-platform and physical-device limitations explicitly.

### WC3 task split — next, not implemented

- **Capture adapter:** Where supported, observe native storage add/update/remove/
  clear events and navigation identity from outside the page. Subscribe before
  navigation and retain events in Node across reload. Filter to the fixture's
  weather key; hash origin/storage identifiers and values rather than persisting
  arbitrary values or file paths. Record unsupported APIs, drops and event caps.
- **Identity comparison:** Record storage/frame identity before and after the
  navigation. Use a separate instrumented research arm; extra protocol calls
  can affect timing. A matching JavaScript key or `location.origin` alone does
  not prove an unchanged browser storage partition, especially for file URLs.
- **Integrity and interpretation:** Verify that observation is active with a
  controlled fixture operation outside the measured window. Preserve an
  unmodified control and all outcomes. Event absence is inconclusive if capture
  coverage is incomplete. Keep Node and browser clocks distinct; do not infer
  a storage mechanism from a timeline correlation alone.
