# Fluid Woodland motion ready for Ally testing

- Message ID: `2026-10-05-organic-motion/005`
- Date: `2026-10-05` (UTC)
- From: cloud organic-motion implementation session
- To: local Ally implementation/testing session
- Status: complete, browser-verified and published for device testing
- Branch: `feature/woodland-organic-motion`
- Pull request: [PR #8](https://github.com/ilamgumaran/simpli-home-tools/pull/8), base `feature/woodland-refinement-contacts`
- Tested runtime revision: `e1e7bc7cffb19c0c368ab022417501326b2f3aed`
- Portable SHA-256: `77cf3d7e2cc85f2dc54ab02ecab3233756541126e946120303ef5ce22f1cc7f2`
- Previous: [004: integrated runtime and checks in progress](004-cloud-integration-progress.md)

## Outcome and preserved work

The owner asked this cloud session to own fluid/organic motion and inform your session through Git. Ownership notice 001 was published to the shared Woodland branch; replies 002/003 were read and your branch at `248115d79c39ea11cc61c4e7d39dd8a9e3b1e264` was incorporated. This build preserves the larger artwork, world-space rock holds, planted survey, four grounded work/tool roles, reciprocal teaching and asynchronous portrait regression. Source, regenerated portable HTML, tests and product/design documentation are committed together; later handoff-only commits keep this exact artifact unchanged.

Low-power Woodland previously rendered about 10–12 fps and normal motion was capped at 24. Active motion now renders at 30 fps low-power and follows browser frames normally. Crossings use body-scaled travel time, smooth velocity ramps and a steady cruise; planted steps follow distance rather than a fixed cycle. The supported body shifts weight before climbing instead of staying still through most limb transfers and then lifting in bursts. Actual contact rigs blend at departure and arrival, while torso/head/backpack follow-through fades around recovery and endpoints. Teacher/listener hand targets blend between turns.

Travel precedes work. Each minute starts its chapter; configured intervals can repeat return/travel/work within that minute, while duration supplies the work budget after arrival. Work ends before the next visit or second 55. Windows under four seconds are skipped rather than losing recovery. Climbing preserves the stationary 0.34–0.50 recovery phase and late deadline assistance. Time numerals update immediately. Paused, hidden and quiet scenes avoid continuous rendering.

## Verification

`npm run build` and complete `npm test` passed with actual Chrome for Testing 151.0.7922.34, Edge 154.0.4258.53 and Playwright Firefox 153 on Linux, including hosted and offline portable forms and all existing themes. Weather was mocked or blocked; real weather access is not required by tests.

| Browser | Measured active low-power / normal fps | Largest measured 95th-percentile gap, low-power / normal |
| --- | --- | --- |
| Chrome | about 30 / 60 | 34 ms / 18 ms |
| Edge | about 30 / 60 | 34 ms / 19 ms |
| Firefox | about 30 / 60 | 37 ms / 18 ms |

These measure real timer/animation-frame changes to rendered roots/legs rather than synthetic clock frames. The test also rejects stalls of 100 ms or more. Dense pure sequences check fixed anatomy, supported holds, smooth transfers, planted feet, recovery, work grips and timing over distances 0/100/1000, durations 4/12/20 and intervals 30/45/60/90/300. Rendered checks cover source departure, repeated protected return, arrival and work endings. All four grips remain aligned through work sweeps; portrait ResizeObserver behavior, layout/readability, exact minute/hour/midnight/DST and pause/fallback behavior also passed. Synthetic real-time walking/climbing recordings were reviewed in the cloud; private device data was not committed.

## Pull, test and report

Inspect Git status and preserve local edits, then fetch `feature/woodland-organic-motion`. Read [the updated installation handoff](../../tools/little-orbit/design/ALLY-TEST-HANDOFF.md) and [motion design](../../tools/little-orbit/design/ORGANIC-MOTION.md). Confirm the runtime revision is in the fetched branch history and verify the portable checksum above. Subsequent documentation-only commits are expected.

Use your established Ally update workflow, preserving profiles, settings, launchers and local configuration. Watch full walking, rock climbing/recovery and a minute/worksite transition in both low-power and normal mode. Check supported feet, grips, harness, teacher/listener turns, portrait/handheld layout, current-time agreement, touch/scaling, resume and an extended run. Your earlier installed build is the PR #7 artifact; this new motion artifact has not been installed by this cloud session.

Publish `006-ally-motion-results.md` in this thread on your own branch/PR, recording the exact revision/checksum, browser/version, actual viewport/scaling, settings and observed motion. Physical Ally and Android/Vanadium acceptance, battery use and extended operation remain pending. Full rope forces, specialist tree contacts, collisions across every travel surface and persistent material/resource state remain follow-up work. No PR merge or release was performed. Git stores this handoff; fetch this branch to receive it.
