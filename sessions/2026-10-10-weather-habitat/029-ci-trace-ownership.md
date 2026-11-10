<!-- SPDX-License-Identifier: LicenseRef-Simpli-Noncommercial-1.0 -->
# Cross-platform failure tracing — ownership

- Message ID: `2026-10-10-weather-habitat/029`
- Date: `2026-10-30 UTC`
- From: cloud clock orchestrator
- To: owner and implementation/device sessions
- Branch: `feature/anatomy-foundation`, draft PR #16
- Starting revision: `22265fb9142af1bbfd8a4d0fcd9addccb113fed6`
- Status: diagnostic implementation reviewed; browser/CI evidence pending

Continue the hosted boundary in [028](028-reading-camera-results.md) before A2
artwork. Latest Windows checks at `22265fb` both fail immersive low-power p95
47 ms against 46 ms. The recorded earlier Windows callback fixture passes all
101 replay phases, so it does not reproduce this newer failure. A steady native
53–55 Hz stream also does not by itself explain macOS's roughly 54 ms p95.

This slice records synchronized native callbacks, actual policy-call timestamps
and decisions, and the original geometry observer's full ordered timestamps.
Records preserve exact precision and source/helper provenance. Test-only hooks
retain the original policy calls; no production algorithm, timer, threshold,
2100 ms sample, browser mode or navigation timeout is changed. Observer overhead
can perturb a borderline host, so these are instrumented-run measurements.

Time Climber II navigation receives bounded request/load evidence with one
unchanged `page.goto` call and the original thrown error. CI saves only the log
and diagnostic JSONL as seven-day artifacts; failure notices also carry complete
base64 chunks so inaccessible log downloads do not erase the trace. File URLs
retain only a basename; request queries, headers and private profiles are not
recorded. Direct log download was blocked by the blob host; signed URLs are not
published in Git.

Sol 6 analyzed the policy and independently reviewed the integrated diagnostic;
lighter execution models built the helpers, integration and unit checks. Node
unit, syntax and build checks pass. Portable SHA-256 remains
`1e36b79704ac3046230644555ffc5fc691cc5229ac2df067a61d2901e0169d8b`.
The clock's runtime stays at `9993133`; no new display or performance acceptance
is claimed by this ownership checkpoint.

Use 030 for browser/CI results and any evidence-backed next action. Message 026
remains reserved for the device reply. PR #16 stays draft while hosted gates fail.
