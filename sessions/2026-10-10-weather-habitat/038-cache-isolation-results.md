# Portable cache isolation results

- Message ID: `2026-10-10-weather-habitat/038`
- Date: 2026-11-08 UTC
- Direction: cloud → owner and implementation/device sessions
- Branch: `feature/anatomy-foundation`, draft PR #16
- Starting checkpoint: `d7f8de29ed7b47e5549e6f1219188550f5ba235c`
- Scope: WC2 test-only research; no runtime cache repair

[037](037-cache-isolation-ownership.md) defines ownership and the method.
[036](036-portable-weather-cache-evidence.md) remains the immutable record of
the earlier Edge loss and Firefox timing failure.

## Finding

The separate high-DPI context and prior hosted navigation in the same browser
are not required to reproduce the missing cache. Chrome 151 fails in a fresh browser, portable form,
with the sibling absent. The snow entry is usable before reload and absent
afterward at the same key/unit. The original cached-status wait times out at
30 seconds; there is no reported storage-read error. This reproduces the
observed boundary without establishing its underlying cause.

| Browser | Hosted + sibling | Hosted alone | Portable + sibling | Portable alone |
| --- | --- | --- | --- | --- |
| Edge 154 | 4 pass | 4 pass | 4 pass | 4 pass |
| Chrome 151 | 4 pass | 4 pass | 4 pass | 3 pass, 1 fail |
| Firefox 153 | 4 pass | 4 pass | 4 pass | 4 pass |

All 48 planned cases survive: **47 pass, one fails**. Each engine completes four
Williams rounds, balanced by position and directed adjacency, with a fresh
browser per case. The sibling-present fixture preserves the canonical source
through its first cached restoration; the absent fixture removes only the
high-DPI block. Later cache-corruption, unit/location and cadence tests remain
in the full regression program rather than this narrow study.

The unmodified canonical Edge control separately passes both functional forms
and all eight rain timing cases. It retains the same browser for hosted then
portable checks, unlike the isolated-case study. These passes do not supersede
either captured loss.

## Implementation and review

The standalone runner records every case with exact source/derived/runner/helper
digests, browser version, order, outcome, bounded error and failure-diagnostic
links. Canonical hashes and lossless notices support independent verification.
Missing or truncated diagnostic capture is explicit. The unit protects the
transformation boundary, unchanged reload/wait, balanced order and stable hashes;
it joins the normal pure-test runner. Application and portable bytes are unchanged.

Luna implemented the runner; Sol 6 independently reviewed the method, source
and all artifacts. Parent review corrected notice IDs, byte-offset capture and
missing-evidence flags before launching the study. Independent checks recompute
all **49** case/diagnostic record hashes, recover every notice, validate complete
orders and all source digests, and verify the canonical Edge log hash. No
blocking review issue remains. No diagnostic-read errors occur in the study.

[Study summary](../../tools/little-orbit/design/evidence/weather-cache-isolation-summary-2026-11-08.json)
links the full per-engine records;
[Chrome diagnostic](../../tools/little-orbit/design/evidence/weather-cache-isolation-failure-2026-11-08.json)
preserves the captured failure. These are fixture data, not private browsing data.

## Regression validation

- Build and all **23 pure programs** pass. Chrome's 15 browser programs pass.
- Full `npm test` exits **1** in Firefox immersive timing: hosted 854×480 DPR1
  normal mode records 57.14 fps, p95 21 ms and a **114 ms** maximum gap against
  the strict **100 ms** limit. The failed sample is not retried.
- Only unreached programs run separately afterward. Firefox weather functional
  checks pass in hosted and portable forms, then portable 1280×720 DPR2 normal
  rain fails p95 **37 ms** against **31 ms** (45.13 fps, maximum gap 49 ms).
  Community and meal programs, plus offline checks in Chrome/Firefox, pass.
- Across the full run and completion programs, **38 timing cases pass and two
  fail**. Four Firefox immersive cases were not reached after the first failure:
  portable DPR1 low/normal and hosted DPR2 low/normal. Separate completion does
  not turn the failed full run into a pass. The canonical Edge control's eight
  passes are recorded separately from this count.
- Both exact timing traces survive lossless notices, their canonical hashes
  validate and the independent analyzer recomputes their metrics. No timing
  threshold, timeout or sample duration changes. The earlier captured failures
  remain intact.
- Final source/portable parity, whitespace and local documentation links pass.

[Regression results and log hashes](../../tools/little-orbit/design/evidence/weather-cache-isolation-regression-2026-11-08.json)
and [both exact timing traces](../../tools/little-orbit/design/evidence/weather-cache-isolation-regression-failure-2026-11-08.jsonl)
are retained. This is a completed research slice with unresolved acceptance
gates, not a passing runtime repair.

## Next task

WC3 captures relevant native storage operations and navigation/storage identity
in a separate research arm. Preserve the measured regression path and an
unmodified control. Record event coverage, dropped events, unsupported APIs and
clock domains; event absence cannot prove deletion or persistence behavior.
The [design and task split](../../tools/little-orbit/design/PORTABLE-WEATHER-CACHE.md)
defines capture, identity comparison and interpretation work.

Do not remove high-DPI coverage, add cache seeding/waits, or change production
caching on the WC2 evidence. A single failure does not establish comparative
reliability. A2 artwork, later gait and other themes remain deferred behind the
current gates or owner reprioritization.

Runtime remains `dd6e9d53694d6b5c4667bd0c778635b2779c746e`; portable SHA-256
remains `0accb9737b218f4e4d202b368d0277355d114c21758163ae09cb57f61e142b85`.
PR #16 stays draft. Existing hosted Windows/macOS timing and physical
Ally/Vanadium gates remain open; no installation, merge or release occurred.
Use 039 for the next cloud follow-up; 026 remains reserved for device feedback.
