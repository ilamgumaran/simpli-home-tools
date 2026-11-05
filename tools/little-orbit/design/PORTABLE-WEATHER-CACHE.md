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

## Follow-up tasks — planned, not implemented

1. **WC2: isolate the failing boundary.** Run balanced fresh hosted/portable
   contexts with the same fixture, separating the main page from the independent
   high-DPI layout context. Preserve every outcome, order and browser version.
   Keep the measured reload and original assertions unchanged; do not use
   repeated passing runs to replace a failure.
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
