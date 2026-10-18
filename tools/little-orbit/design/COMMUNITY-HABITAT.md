<!-- SPDX-License-Identifier: LicenseRef-Simpli-Noncommercial-1.0 -->
# Green House 1 — community habitat

Status: authored community-life slice and Sage's connected meal sequence implemented. Runtime `f02092b12a45d72cefe73ba68d5acd2f68932358` (portable SHA-256 `046f02a9772a5060ac422b6acceee763fb29726a230df1ce1932a38611899ec6`) passes build and both `npm test` runs (combined Chrome/Firefox and native Edge; runner `7bfe736`): 9 pure programs, 13 browser programs per engine, offline portable checks and all 66 cadence cases (54 existing + 12 active-meal). Final focused meal (4 functional + 4 cadence per engine) and community (14 groups per engine) checks pass; captions clear at all seven stages and quiet mode passes across four views at DPR 1/2. Painted group gaps meet >=30 CSS px and viewport margins >=16 CSS px. No full-run failures or retries. Physical Ally/Vanadium and sustained acceptance remain pending; earlier intermittent stalls are unexplained. Session 015 records earlier candidate passes; [session 016](../../../sessions/2026-10-10-weather-habitat/016-cloud-meal-choreography-ownership.md) records ownership and [session 017](../../../sessions/2026-10-10-weather-habitat/017-cloud-meal-choreography-results.md) final results. Sessions 011–014 document earlier candidates. This recurring community story belongs to the separate `greenhouse1` theme, displayed as **Green House 1**, alongside its weather scene. It is not part of Woodland's larger-actor engineering terrain, nor a life simulation or persistent family system.

## Cast and story

The central family identities are Aster, Sage and Pebble. Aster cares for Pebble, an infant shown swaddled and supported by a caregiver. Sage performs shelter, foraging, cooking, teaching and remembrance routines. Sprout is a child who takes part in safe, supervised play and sleep. At dusk, from 17:00–20:00, the family honors Fern with memorial flowers; no ancestor character appears. The routine does not depict death as an event or imply a changing population. The family scenes recur rather than aging or replacing the baby.

The slice composes into Green House 1 with its tiny antlike camp people, tent, food/play setting and thermometer. Existing clock/date, global weather location/unit, scene pause, reduced-motion and camera controls remain authoritative. Turning companions off hides people while environmental weather continues. Woodland retains larger actors and engineering terrain time.

| Local time | Sage's activity | Shared story |
| --- | --- | --- |
| 06:00–08:00 | Check the shelter line | Build a place to belong. |
| 08:00–11:00 | Gather greens into the basket | Gather enough to share. |
| 11:00–13:00 | Stir the pot over the hearth | Make time for a shared meal. |
| 13:00–16:00 | Sort seeds with Aster | Pass knowledge through patient care. |
| 16:00–17:00 | Check the camp's provisions | Keep the youngest close and comfortable. |
| 17:00–20:00 | Tend Fern's memorial flowers | Pause to remember someone loved. |
| 20:00–22:00 | Keep a warm meal ready | Care continues as daylight fades. |
| 22:00–06:00 | Rest beneath the shelter | Rest belongs in the daily rhythm. |

Aster supports Pebble throughout the cycle. Sprout plays with a stick in the sand during local daylight and sleeps at night. The woodland scene provides shared 07:00 dawn and 19:00 dusk metadata; the community sampler's standalone fallback is 06:00/20:00. These are authored runtime values, not user settings. Routines recur from local time and do not depend on leaving a browser open. Sage's adjacent actions and Sprout's play/sleep poses blend over 1.2 seconds with quintic easing. Hands meet the shelter line, basket, seed board and flowers; during cooking the spoon joins the wrist and pot. Session 015 records sampled group gaps and viewport margins for the earlier runtime. The current runtime meets the >=30 CSS-pixel painted-group gap and >=16 CSS-pixel viewport-margin gates. This first slice illustrates the care and reflection strand of the wider terrain/time story. New buildings, births, generations and persistent resources require later layers.

Each mounted camp retains its prop and actor nodes. Routine colors, visibility and other fixed attributes update only when their values change; moving poses and contact calculations retain the main scene cadence. Recreating the camp rebuilds these references. The shared character renderer also caches its rig nodes and skips unchanged attributes.

Each character has a distinct absolute-time cycle: Aster 7.2 seconds, Sage 8.4 seconds and Sprout 6.6 seconds, with phase offsets recorded in the frozen runtime metadata. Epoch-based sampling keeps rhythm continuous across midnight and DST. Pebble's support pose follows Aster's exact actor cycle, so both hands remain connected. At routine boundaries, Sage's previous and next task wrists are each solved against their own contact in camp coordinates. The resulting endpoints blend over 1.2 seconds with quintic easing before the arm is solved again with fixed bone lengths; attached tools fade with the same transition and the shelter line returns smoothly to rest. Sprout's play/sleep pose uses the same blend duration, morphs the existing eye marks, follows the blended hand with the stick while preserving its authored grip-to-tip offset, and derives the actor root from foot support. Frozen mode keeps movement cycles and organic offsets at zero. Session 015 contains full browser/cadence/portable passes for the preceding runtime. The 12-pixel camp inset clears the caption overlap; final focused and caption results are recorded in session 017.

## Sage's connected meal

In both the 11:00–13:00 lunch and 20:00–22:00 evening-care windows, Sage samples a repeatable 60-second sequence: gather at the basket, carry to the pot, cook, deliver to the shared stand, serve, rest and return home. The daily windows keep their first and last 1.2 seconds on the baseline routine pose; the sequence's ordinary minute boundary joins at home without replaying skipped actions. Sage starts near x78, takes eight alternating steps each way across the foreground to x126 / ground48, and serves at x142,y14. The bowl uses the same normalized grip/rim point and scale in Sage's hand and on the stand. The tabletop is y19.333 and the stand reaches ground48. A small x84 detour is omitted to keep Sage clear of the hearth. During movement, fading transfers the bowl from the hand to the table while the feet remain world-anchored. Frozen mode keeps the scene quiet and hides carried and served food animation; other daily routines are unchanged. The scene shows preparation and sharing, without inventory depletion or animated eating.

## Boundaries

- Do not imply fast aging, infant replacement, births, deaths or persistent generations.
- Do not claim a real ecosystem, conserved food/resources, persistent lineage or biological simulation.
- Keep infant poses supported and swaddled; do not place the infant unsupported or in unsafe activity.
- Keep dusk remembrance respectful and non-graphic, shown through memorial flowers rather than an ancestor character.
- Treat named activities and recurrence as authored illustration, not evidence of changing stored world state.

## Acceptance plan

- Check Sage's recurring routines, Aster's care for Pebble, supervised Sprout play/sleep, and memorial flowers honoring Fern during 17:00–20:00; no ancestor character should appear.
- Confirm Pebble remains swaddled and supported by a caregiver wherever visible.
- Confirm stories do not age, replace or imply a new infant, and do not claim ecosystem/resource/lineage simulation.
- Check current time/date legibility, compact and tall viewports, companion-off behavior, and shared pause/reduced-motion/Still-camera behavior.
- Runtime `f02092b12a45d72cefe73ba68d5acd2f68932358` passes all pure, browser, cadence and offline portable checks. All seven caption stages, quiet mode, >=30 CSS-pixel painted-group gaps and >=16 CSS-pixel viewport margins pass. No full-run failures or retries. Session 017 records final results. Session 015's passes apply to the earlier spacing/motion candidate only; do not substitute sessions 011–015 for validation of this runtime. Sustained and physical-device acceptance remain open. See ownership [016](../../../sessions/2026-10-10-weather-habitat/016-cloud-meal-choreography-ownership.md) and historical spacing results [015](../../../sessions/2026-10-10-weather-habitat/015-cloud-spacing-motion-results.md).
