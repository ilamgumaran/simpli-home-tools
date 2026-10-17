# Green House 1 — roomier camp and independent motion

- Message ID: `2026-10-10-weather-habitat/015`
- Date: `2026-10-17 UTC`
- From: cloud clock development/testing session
- To: repository owner and local Ally session
- Branch: `feature/woodland-weather-habitat`, [draft PR #11](https://github.com/ilamgumaran/simpli-home-tools/pull/11)
- Status: full Chrome, Firefox and Edge suites pass; sustained/device acceptance pending

## Version and changes

Runtime source: `de43b318d7b62fdd67b90f589b91947d67d843bf` (includes `f389f9f`).

Portable `tools/little-orbit/Little Orbit.html` SHA-256: `3ce3de6658214d446368c3b1676ac4dd59a6ea0b2baf30e3f55c5d7032945b99`.

Sprout and Sage now stand farther from the Aster/Pebble caregiver group. Central camp staging moves Sage's workstation, hearth, supplies and task sockets together, and moves Sprout's sand patch with the child. The cropped actor viewport expands to contain the arrangement. Portrait staging shifts inward to leave screen-edge clearance without changing character sizes. Pebble remains physically supported by Aster's actual rendered arm pose.

Each independent character has its own absolute-time activity period and breathing offset, instead of sharing the same six-second cycle and body phase. Aster uses a 7.2-second activity rhythm, Sage 8.4 seconds and Sprout 6.6 seconds. Routine changes and Sprout's 07:00/19:00 play/sleep changes blend over 1.2 seconds with quintic easing. Compared with the previous 0.7-second cubic easing, the normalized blend's peak speed falls by about 27%, with zero endpoint velocity and acceleration. This describes pose interpolation, not a measured reduction in every wrist's physical speed or an increase in frame rate.

Sage's actual hand/tool contacts, fixed limb lengths, supported feet, attached play stick, changing eye marks, infant care, clock authority and quiet lifecycle remain. Epoch-based activity and body phases preserve continuity through midnight and daylight-saving changes. There is no new user setting.

## Evidence and validation

The independent old-source probe measured only 14.9–16.6 CSS px between Sage and the caregiver group, and 23.6–24.2 px between Sprout and Aster. The new painted-gap regression fails on that predecessor. Source analysis also found that the old renderer supplied identical body phases to all actors; independent body transforms are now checked in the browser, without claiming a separately executed old-source phase failure. The widened layout measures about 39–47 CSS px between independent groups. Minimum sampled gaps are 46.54 CSS px from Sprout to the caregiver group and 39.42 CSS px from the caregiver group to Sage, compared with predecessor minima of 23.63 and 14.87 CSS px. These are painted bounds, not distances between invisible actor origins.

A prototype with the wider camp but the previous portrait anchor let Sprout's painted boot reach just beyond the screen (−0.06 CSS px at 390×844). The final candidate moves the portrait anchor inward. The browser regression separately requires at least 30 CSS px between independent groups and 16 CSS px from horizontal viewport edges, alongside the existing cropped-layer, prop-contact, infant-support and control-clearance checks. Final minimum horizontal viewport clearance is 29.94 CSS px, for Sprout at 390×844.

The focused community suite passes all fourteen result groups in actual Chrome 151, Firefox 153 and Edge 154, covering four viewports, DPR1/2, hosted/portable forms, routine transitions, child day/night continuity and immediate reduced-motion behavior. Transition samples follow the deliberately authored 1.2-second duration. Browser regression revision: `039615d`. Existing cadence windows, limits, frame-rate targets and warmups are unchanged.

Pure community tests and `npm run build` pass. Tests verify deterministic independent normalized cycles, frozen quiet cycles, quintic endpoint behavior and lower peak interpolation speed.

All 18 unchanged cadence cases per browser pass: four dashboard, six immersive Woodland and eight rainy habitat cases. Real 2.1-second samples retain low-power limits of ≥26 updates/s and p95 ≤46 ms, normal limits of ≥45 updates/s and p95 ≤31 ms, and maximum gap <100 ms. Across each browser's nine cases per mode:

| Browser/mode | Minimum updates/s | Largest p95 gap | Largest single gap |
| --- | --- | --- | --- |
| Chrome, low | 30.00 | 33.8 ms | 35.4 ms |
| Chrome, normal | 60.00 | 19.3 ms | 22.9 ms |
| Firefox, low | 29.97 | 35.0 ms | 39.0 ms |
| Firefox, normal | 59.52 | 20.0 ms | 41.0 ms |
| Edge, low | 30.00 | 33.8 ms | 35.5 ms |
| Edge, normal | 59.99 | 18.8 ms | 24.6 ms |

Native binaries: Chrome `151.0.7922.34`, Firefox `153`, Edge `154.0.4258.53`. Browsers ran sequentially without competing builds. Private cloud logs are `/workspace/.onboarding/clock-spacing-full-chrome-firefox.log` and `/workspace/.onboarding/clock-spacing-full-edge.log`; focused runs and old-source diagnostics share the `clock-spacing-` prefix. This message preserves results in Git; screenshots and browser profiles stay outside Git. The combined Chrome/Firefox `npm test` and separate native Edge `npm test` each exited **0**, without failures or retries. Both runs passed all eight pure programs. All twelve browser programs and offline portable checks passed in each browser; no final-run programs were left unrun. Owned diagnostic servers and browsers were cleaned up afterward.

## Git and device handoff

[014](014-cloud-spacing-motion-ownership.md) records ownership and the measured plan; [013](013-cloud-child-motion-results.md) is the historical child-motion candidate. Planning/review stays with the orchestrator, implementation uses Luna and independent browser verification uses Sol 6.

Follow the [Ally handoff](../../tools/little-orbit/design/ALLY-TEST-HANDOFF.md), preserving local profiles/configuration. Verify the runtime above is an ancestor of HEAD and the portable checksum matches; later test/documentation commits can advance HEAD. Review whether the family now feels separate and the activity changes feel gentler in sustained normal/low-power/rain use, including portrait layout, quiet mode and pause/resume. Return physical findings in reserved `004-ally-to-cloud.md`.

Published numbered messages 001–015 remain immutable after publication; use `016` for the next follow-up. Physical Ally/Vanadium and sustained acceptance remain unrun. Earlier intermittent rendering stalls remain unexplained; short automated cadence samples cannot establish their cause or resolution. PR #11 stays draft. No merge, release or device installation was performed. Other themes and persistent ecosystem/family simulation remain deferred; further natural activity choreography is follow-up work.
