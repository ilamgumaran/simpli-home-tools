# Green House 1 — Sage's connected meal

- Message ID: `2026-10-10-weather-habitat/017`
- Date: `2026-10-18 UTC`
- From: cloud clock development/testing session
- To: repository owner and local Ally session
- Branch: `feature/woodland-weather-habitat`, [draft PR #11](https://github.com/ilamgumaran/simpli-home-tools/pull/11)
- Status: full Chrome, Firefox and Edge suites, offline portable checks and all 66 cadence cases pass; physical device acceptance pending

## Version and behavior

Runtime source: `f02092b12a45d72cefe73ba68d5acd2f68932358`.

Portable `tools/little-orbit/Little Orbit.html` SHA-256: `046f02a9772a5060ac422b6acceee763fb29726a230df1ce1932a38611899ec6`.

Sage now follows a complete illustrated meal sequence during lunch (11:00–13:00) and evening care (20:00–22:00). Each minute contains gathering (00–08), carrying ingredients to the pot (08–16), cooking (16–36), delivering a bowl (36–44), serving (44–49), resting (49–54), and returning (54–60). Short captions follow the activity. Food is set out for the family; other family members do not yet perform eating animations.

Ingredients move between the basket and pot through Sage's actual hand. Cooking keeps the spoon's working end in the pot. Sage carries the bowl along a foreground route to a new serving stand. Held and served bowls use the same shape, grip and screen scale, meeting at the tabletop before the hand withdraws. A pause to rest precedes the return to the basket.

The new pure `habitat-meal.js` layer samples the current local clock without accumulating world state. Supporting feet stay at world-space holds while the opposite foot swings, and fixed-length limbs solve against actual contact targets. Whole-minute curves join without resets. The final daily minute returns home by 58.8 seconds, before the final 1.2-second baseline hold at the daily routine boundary. Routine fades change the hands and props while the feet finish their contact route.

Aster's supported care for Pebble, Sprout's play/sleep, family spacing, other daily routines, current clock/date, weather and quiet lifecycle remain. The actor crop includes the extended work area. The camp sits 12 CSS pixels higher to leave room for the story caption at handheld size. Unused seed-board and memorial props fade during meals, keeping the basket, pot and moving figure visually distinct; their teaching/remembrance uses remain. Reduced motion keeps the figures still and hides held/served meal animation. Companions off hides people while retaining the environment. This is authored recurring activity, without persistent food, nutrition, inventory depletion or family simulation.

## Independent evidence

An immutable predecessor portable (`5560169`, SHA-256 `3ce3de6658214d446368c3b1676ac4dd59a6ea0b2baf30e3f55c5d7032945b99`) fails the independent physical travel/serving probe: Sage's wrapper x remains exactly 253.818177 CSS px at 11:00:28, :40 and :47, and no served bowl exists. Private expected-red evidence is `/workspace/.onboarding/clock-meal-old-red.log`. The check measures actual rendered movement and a serving object, beyond stage labels.

New pure tests verify all seven stages, deterministic reconstruction, fixed bones, integrated hour handoffs, quiet behavior, minute wrap and painted-joint continuity at every stage join. Numerical contact audits measure planted-foot drift below `3e-14` camp units, including the final daily return, and no supporting foot inside the hearth footprint. These are geometry checks; they do not establish sustained device presentation.

Focused meal checks pass on the final candidate in actual Chrome 151, Firefox 153 and Edge 154: four functional result groups per browser (hosted/portable × DPR1/2), each covering four viewports and both meal periods. Checks measure painted joints, limb lengths, food/hand and spoon/pot contacts, actual bowl handoff/table support, gait support/lift, infant care, family spacing, crop/control clearance, time jumps, DST scheduling, quiet/resume and companion toggles. Existing community browser checks pass all fourteen groups in each engine. Browser/pure regression revision: `7bfe736`.

A visual probe found a prototype's stand leg overlapping the stage-40 caption by 93.3 px² at 854×480. The final camp inset clears the actual text glyphs: the landscape stage-40 stand bottom is 377.39 CSS px and the caption starts at 386.81, leaving 9.42 px with zero overlap. The portrait capture leaves 33.01 px. Automated glyph clearance covers all seven stages, baseline and quiet views at DPR1/2. The final scene also fades unused seed-board and memorial art during meals, keeping the working props visually distinct from Sage.

`npm run build` passes. The combined native Chrome/Firefox `npm test` and separate native Edge `npm test` both exit 0 on this frozen runtime and portable checksum, with no full-run failures or acceptance retries. Each run executes nine pure programs; all thirteen browser programs per engine and all offline portable checks pass. Native versions are Chrome 151.0.7922.34, Firefox 153 and Edge 154.0.4258.53. No source or test edits occurred during the final runs.

All **66 cadence cases pass**: the existing 54 cases retain their windows, warmups and limits, and twelve additional cases exercise active meal delivery. New cases cover hosted 854×480 DPR1 and portable 1280×720 DPR2 in low/normal power on all three browsers. They measure changes to Sage's actual SVG wrapper transform over real 2.1-second intervals while only the sampled local Date advances through delivery (38–40.1 seconds); timers, animation frames and performance measurement remain real. All cases retain ≥26/45 updates/s, p95 ≤46/31 ms for low/normal power and maximum-gap <100 ms gates.

The following table records the minimum update rate, largest p95 and largest individual gap within each group. These are short browser samples, not sustained device acceptance.

| Browser | Cases | Power | Count | Minimum updates/s | Largest p95 ms | Largest gap ms |
| --- | --- | --- | --- | --- | --- | --- |
| Chrome | Existing | Low | 9 | 29.96 | 34.0 | 47.0 |
| Chrome | Existing | Normal | 9 | 60.00 | 18.0 | 24.7 |
| Chrome | Active meal | Low | 2 | 30.00 | 33.6 | 34.3 |
| Chrome | Active meal | Normal | 2 | 60.95 | 16.9 | 17.8 |
| Firefox | Existing | Low | 9 | 29.90 | 35.0 | 36.0 |
| Firefox | Existing | Normal | 9 | 59.52 | 21.0 | 38.0 |
| Firefox | Active meal | Low | 2 | 30.00 | 35.0 | 36.0 |
| Firefox | Active meal | Normal | 2 | 60.95 | 18.0 | 21.0 |
| Edge | Existing | Low | 9 | 30.00 | 33.8 | 35.4 |
| Edge | Existing | Normal | 9 | 59.02 | 19.3 | 77.4 |
| Edge | Active meal | Low | 2 | 30.00 | 34.0 | 35.3 |
| Edge | Active meal | Normal | 2 | 60.95 | 17.6 | 20.5 |

Private full-run logs are `/workspace/.onboarding/clock-meal-full-chrome-firefox.log` and `/workspace/.onboarding/clock-meal-full-edge.log`; browser profiles, screenshots and dependencies stay outside Git. Final viewport/family gates pass (≥30 CSS px between independent groups and ≥16 CSS px horizontal screen clearance). Earlier exact spacing measurements belong to session 015's candidate.


## Git and device handoff

[016](016-cloud-meal-choreography-ownership.md) records the plan and ownership. [015](015-cloud-spacing-motion-results.md) preserves the previous spacing/rhythm candidate. Luna agents drafted the timeline and scene integration; the orchestrator completed and reviewed contact integration; Sol 6 independently verified the resulting geometry and browser behavior.

Follow the [Ally handoff](../../tools/little-orbit/design/ALLY-TEST-HANDOFF.md), preserving local profiles/configuration. Verify the runtime above is an ancestor of HEAD and the portable checksum matches; later test/documentation commits may advance HEAD. Review lunch and evening meals, food placement and rest, sustained low/normal/rain motion, caption clearance, portrait layout, quiet mode and pause/resume. Return physical findings in reserved `004-ally-to-cloud.md`.

Published messages 001–017 remain immutable after publication; use `018` for the next follow-up. Physical Ally/Vanadium and sustained acceptance remain unrun. Earlier intermittent rendering stalls remain unexplained. PR #11 stays draft. No merge, release or device installation was performed. Shelter, water-gathering and richer social choreography are follow-up work; other themes and persistent ecosystem/family simulation remain deferred.
