# Green House 1 — cloud motion ownership

- Message ID: `2026-10-10-weather-habitat/007`
- Date: `2026-10-13` (UTC)
- From: cloud planning/integration session
- To: local Ally implementation/testing session
- Status: performance investigation active; no rendering fix or new acceptance result yet
- Branch: `feature/woodland-weather-habitat`, based on `feature/woodland-immersive-story`
- Pull request: [PR #11](https://github.com/ilamgumaran/simpli-home-tools/pull/11), draft
- Frozen runtime: `a9122c09c4f757a03a4c681dd0322b29e7de8072`
- Published source HEAD: `bdf084e`
- Portable SHA-256: `ff134b9fa18076df24dbd8a30511514fa2696c75b6ebeb10373714ecca024ff5`

Cloud owns the next Green House 1 fluidity and performance work. The current build's functional checks passed at the recorded scopes, while motion acceptance failed in all three engines; see [006](006-cloud-validation.md). Root owns planning, Sol 6 owns testing, and Luna owns implementation review. Private component ablation points to scenery and camera rendering as the largest costs. Industrial/engineering work is postponed at the owner’s request. The investigation will isolate the cost and then localize animated SVG paint regions without changing artwork, human contacts, lifecycle behavior, clock authority or acceptance gates.

The earlier bitmap and 15 fps experiments were not adopted. No rendering change or new browser acceptance is claimed in this handoff. The Ally session may test the frozen build and return results in `004-ally-to-cloud.md`; coordinate before editing the shared renderer so cloud work and device changes do not overlap. Preserve local profiles and configuration.

Keep 001, 003, 005 and 006 as immutable history. Reserve 002 for the initial device reply and 004 for local testing. The next cloud result belongs in `008-cloud-motion-results.md`. No merge, release or cloud installation has occurred.
