<!-- SPDX-License-Identifier: LicenseRef-Simpli-Noncommercial-1.0 -->
# Quantized timestamp pacing candidate

- Message ID: `2026-10-10-weather-habitat/024`
- Date: `2026-10-20 UTC`
- From: cloud clock orchestrator
- To: owner, implementation and device sessions
- Branch: `feature/anatomy-foundation`, draft PR #16
- Status: final Windows correction implemented; full validation in progress
- Previous: [023 — rendering controls](023-rendering-control-probe.md)

## Completed earlier candidate

Runtime `897d0b0` and portable hash `ef7ac3038f1e23e20b64bd3f8db93f3a65396c1f6655c8fc4aeddc5c8f34a8aa`
passed both complete configured local npm runs: native Chrome/Firefox and native
Edge, each underlying exit 0. All 11 pure programs, 14 browser programs per engine,
66 browser cadence cases and offline portable checks completed without assertions.
Chrome low-power minimum 29.957 updates/s, largest p95 34.5 ms; Firefox 29.815/35;
Edge 29.996/34.4. Normal minima were 59.994/58.349/59.994, largest p95 19.2/23/20.3;
maximum gaps 48.1/50/38.1 ms. The initial unconfigured browser-launch error remains
separate from these configured passing runs. Ubuntu's required `897d0b0` push
check also passes; macOS and Windows still fail as described below.

## Final one-line correction

The actual Windows callback stream supplies roughly 61 callbacks/s, mostly
15.62/15.64 ms gaps with occasional gaps near 18 ms. A fixed phase can accumulate
debt from early callbacks, periodically skipping a valid paint. The accepted
phase now advances from `min(previousDue, acceptedTimestamp) + period` instead
of always advancing from the old due time. Constants, minimum spacing, long-stall
rebase, normal-mode behavior and browser acceptance gates stay unchanged.

The public fixture is pinned to run 39375609716/check 118472943947, source
`897d0b042b09f1a11d49fbf58a7c91a2de82c58e`. The orchestrator compared every fixture
gap and the original 2151 ms measurement duration against GitHub's annotation.
Independent phase-sweep tests pass all 101 starting phases at 30.22–30.68 updates/s,
p95 33.94 ms, minimum gap 31.24 ms. An explicit 64 Hz fixture documents approximately
32 paced updates/s as refresh quantization; the target is approximately 30.

New portable `Little Orbit.html` SHA-256:
`23c1d8e2f8b5cb7e462d92aa360b5c94bc6c8423ec4d69ac789330e0188e3406`.
Build and pure cadence/anatomy checks pass. Fresh full Chrome/Firefox and Edge
runs are in progress; the earlier candidate's passes do not validate this changed
runtime. The publishing commit identifies the full corrected source.

## Native-frame prerequisite remains under investigation

The blank/full/hidden-art controls do not justify a raster rewrite. macOS ARM
headless Chromium supplied 55.18 callbacks/s even on blank content; hiding art did
not consistently improve timing. Intel controls were worse (blank Chromium 41.88,
Firefox 30.67 callbacks/s). The full Chromium new-headless comparison also varies
on blank content (ARM 47.31 callbacks/s), while a complete scene sample sometimes
passes. No Intel runner pin or main-test channel change is applied from this data.

The research workflow next opens visible browser windows to compare native-frame
delivery, retaining full Chromium and Firefox and recording the actual headless
flag, version and architecture. Its measurements do not count as app gate passes.
Required npm test assertions and the main workflow remain intact. PR #16 remains
draft until required checks and review pass. No physical Ally/Vanadium or sustained
acceptance is claimed. Visible palm/foot art and live-contact migration remain later.

Record final results/corrections in 025; preserve this checkpoint after publication.
