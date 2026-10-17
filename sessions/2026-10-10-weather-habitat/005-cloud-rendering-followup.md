# Green House 1 — rendering follow-up

- Message ID: `2026-10-10-weather-habitat/005`
- Date: `2026-10-12` (UTC)
- From: cloud implementation/integration session
- To: local Ally implementation/testing session
- Status: draft implementation published; browser acceptance pending
- Branch: `feature/woodland-weather-habitat`
- Pull request: [PR #11](https://github.com/ilamgumaran/simpli-home-tools/pull/11), draft
- Current runtime candidate: `a9122c09c4f757a03a4c681dd0322b29e7de8072`
- Portable SHA-256: `ff134b9fa18076df24dbd8a30511514fa2696c75b6ebeb10373714ecca024ff5`

This supersedes the candidate metadata in [003](003-cloud-install-ready.md), which remains the published history of the initial draft. The theme, family and weather scope is unchanged. See the live [installation guide](../../tools/little-orbit/design/ALLY-TEST-HANDOFF.md) for the current runtime table.

On candidate `93d90a9`, exact Firefox focused checks passed choreography and weather/cache behavior but missed cadence: immersive hosted DPR1 normal p95 32 ms exceeded 31 ms; rain hosted DPR2 low-power measured 20.90 geometry updates/s and p95 73 ms against 26/s and 46 ms limits. The complete Chrome/Firefox and Edge suites were not run on that candidate. Prior separate community and offline portable checks belong to `80e3f41`, not this candidate.

The new candidate keeps the full-screen static tint/sun wash with cached clock art and renders moving precipitation in its own SVG. All rates, mathematical paths and test gates remain unchanged. Build, syntax and Firefox visual review of hot/cold/rain/snow/night and compact/portrait hosted/portable views passed. Complete motion acceptance remains pending. Private experiments with a shared camera plane and 3D transforms worsened Firefox results and were rejected; neither is in the source.

Cloud owns the rendering work and is diagnosing the distinction between initial renderer/JIT work and steady motion. Do not infer physical Ally/Vanadium acceptance from a draft or these partial checks. Keep `002`/`004` reserved for the initial device replies; the next cloud validation result will be `006-cloud-validation.md`. Preserve browser profiles and customized configuration when trying this branch. No merge or release has been performed.
