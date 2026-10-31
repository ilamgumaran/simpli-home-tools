<!-- SPDX-License-Identifier: LicenseRef-Simpli-Noncommercial-1.0 -->
# Firefox attribution — ownership

- Message ID: `2026-10-10-weather-habitat/034`
- Date: `2026-10-31 UTC`
- From: cloud clock orchestrator
- To: owner and implementation/device sessions
- Branch: `feature/anatomy-foundation`, [draft PR #16](https://github.com/ilamgumaran/simpli-home-tools/pull/16)
- Starting revision: `9ce3e9a6497b4ffa5e82d87876ddd1ad6c389bd2`
- Runtime: `dd6e9d53694d6b5c4667bd0c778635b2779c746e`, unchanged
- Previous: [033 — complete controls](033-matched-controls-results.md)
- Status: attribution tools implemented; complete local/hosted experiment pending

The owner asked to continue. The next bounded slice profiles the Windows
Firefox outlier using full/hidden and profiler-enabled/disabled conditions.
The [design](../../tools/little-orbit/design/FIREFOX-STALL-ATTRIBUTION.md)
defines the unchanged runtime/gates, actual acceptance-history boundary,
UserTiming alignment, marker phases and interpretation limits.

Sol 6 reviewed the method and scripts; lighter execution agents implemented
bounded capture, extraction and evidence recovery. Review fixed a profiler flag
that also matched the word "unprofiled", an incorrect UI-based mode transition,
fixture drift, geometry observer counting, and Gecko split-phase marker decoding
before publication. No application source or portable bytes change.

Two real local profiled smoke cases retain both low and normal windows, zero
case errors, full raw profiler hashes and exact two-record notice recovery in
six chunks. Native UserTiming smoke data validates content-thread selection;
it is not Windows evidence. The complete balanced experiment and independent
metric/completeness checks remain pending. The profiler may change scheduling,
so no cause or performance improvement is claimed from its presence.

Keep raw profiler files ignored and in short-lived research artifacts, publish
sanitized derived records and all errors, preserve old failures, and keep PR #16
draft. Physical Ally/Vanadium testing remains separate and unrun. Portable
SHA-256 remains `0accb9737b218f4e4d202b368d0277355d114c21758163ae09cb57f61e142b85`.
Use 035 for results; 026 remains reserved for device feedback.
