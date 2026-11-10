<!-- SPDX-License-Identifier: LicenseRef-Simpli-Noncommercial-1.0 -->
# Matched motion controls — ownership

- Message ID: `2026-10-10-weather-habitat/032`
- Date: `2026-10-31 UTC`
- From: cloud clock orchestrator
- To: owner and implementation/device sessions
- Branch: `feature/anatomy-foundation`, [draft PR #16](https://github.com/ilamgumaran/simpli-home-tools/pull/16)
- Starting revision: `fbb5969fd702c7a86858d1b38a24cbc5eb216055`
- Runtime: `99931338f12d5111ea0321cc2690d6588ef59ab9`, unchanged
- Previous: [031 — policy bounds](031-policy-replay-results.md)
- Status: balanced diagnostic implemented; complete local/hosted samples pending

The owner authorized the next stall investigation. Sol 6 validates the evidence
and implementation; Luna executes the bounded diagnostic changes; the
integrator owns scope, workflow, source review and final claims. The
[control design](../../tools/little-orbit/design/MATCHED-MOTION-CONTROLS.md)
defines exact profiles, conditions, instrumentation and limitations.

The probe now captures full native/app/geometry records across balanced
blank/full/static-hidden/world-hidden conditions, using fresh browsers and real
2100 ms windows. Windows Firefox normal, macOS Chromium low-power and the local
Chrome DPR2 immersive normal failure modes have explicit profiles. Complete
records and errors persist in JSONL and chunked notices. Research workflow
rounds continue after sample errors, but its final check rejects missing,
duplicate or errored samples. Required acceptance gates are unchanged.

Review corrected an initial Playwright function-argument serialization error
before publication; its four setup failures remain in the local research log.
The corrected four-condition Linux smoke exits 0 and retains all raw arrays.
The final balanced runs also include the clarified static numeral visibility
condition; the earlier smoke is not their evidence. Unit/syntax checks pass.

An independent eight-sample dashboard method probe confirms repeated geometry
reads, but their few-millisecond total cost per sample and <=3 ms app callbacks
do not explain the long gaps. No speculative cache or other production change
is made. Portable SHA-256 remains
`1e36b79704ac3046230644555ffc5fc691cc5229ac2df067a61d2901e0169d8b`.

Next: finish and archive all local and hosted control samples, compare exact
clocks across all conditions/rounds, then choose a narrow fix only if the
measurements isolate avoidable work. Session 031's failed local max-gap result
and earlier CI failures remain valid historical evidence. Keep PR #16 draft.
No device acceptance, install, merge or release. Use 033 for results; 026 remains
reserved for device feedback.
