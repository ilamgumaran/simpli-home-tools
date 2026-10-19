# Test the larger, smoother Woodland build

- Message ID: `2026-10-05-woodland-refinement/001`
- Date: `2026-10-05`
- From: cloud development session
- To: local Ally installation/testing session
- Status: ready for pickup; physical-device results pending
- Branch: `feature/living-woodland-time`
- Pull request: [PR #3](https://github.com/ilamgumaran/simpli-home-tools/pull/3)
- Tested runtime: `145c67f5775c71f63703c790c8233e5fb6f1032c`
- Previous message: [initial Woodland build](../2026-10-05-woodland-ally/001-cloud-to-ally.md)

## Request and published changes

The owner asked to enlarge the scene and characters, make character movement natural and fluid, give timber more fidelity, and soften the mountains. This build fills the scene panel, keeps digits/trees/sun and the larger cast in proportion, and reserves space for the story so it does not cover the characters. Timber includes bark, knots and end-grain rings; mountains use layered curved contours.

Shared anatomical movement blends poses and gait phases while keeping bone lengths fixed. Woodland travel joins worksites continuously; repeated climbing visits return with protection. Recovery stays stationary. Work interval/duration controls work bouts; each minute can also have a short move (at most three seconds plus a 0.35-second pose settle). Reduced motion, companion-off and pause states suppress moving frames. Complete contact and rope-force simulation remains future work.

The ready-built artifact is `tools/little-orbit/Little Orbit.html`.

Portable SHA-256: `8138c5fd17dc0af8c8c9f5644bddddf28b06c73359367418b48aa537e6c15b0e`.

## Verification

Full hosted and offline portable suites passed on Linux in Chrome for Testing 151, Edge 154 and Playwright Firefox 153. Checks include all clock/calendar boundaries, prior themes, recovery/gear, small and portrait layouts, character proportions and visible bounds, and root/limb continuity across durations 4/12/20 seconds and intervals 30/45/60/90/300 seconds. Synthetic visual review covered handheld, desktop, portrait, water, recovery, teaching and night scenes.

Physical Ally and GrapheneOS/Vanadium checks remain unrun. This is authored illustration and motion, not a completed terrain-contact physics engine.

## Next action

Follow the [current installation handoff](../../tools/little-orbit/design/ALLY-TEST-HANDOFF.md), preserving local profiles/settings and launchers. Pull the sender branch, verify the checksum, update the established Ally display and select **Theme: Woodland**. Check the larger scene at the device's actual viewport/scaling, watch minute travel and climbing recovery, and test hosted and portable output in installed browsers.

Publish `002-ally-to-cloud.md` in this thread with exact Git revision/checksum, browser/version, viewport/scaling, findings and reproduction steps. Update the thread/index and share the reply branch/PR with the owner. Git does not notify the cloud session automatically. Merge/release and later-theme implementation remain outside this device-testing handoff.
