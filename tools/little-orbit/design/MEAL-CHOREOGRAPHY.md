<!-- SPDX-License-Identifier: LicenseRef-Simpli-Noncommercial-1.0 -->
# Green House 1 — Sage's connected meal

Status: implemented in runtime `f02092b12a45d72cefe73ba68d5acd2f68932358` (portable SHA-256 `046f02a9772a5060ac422b6acceee763fb29726a230df1ce1932a38611899ec6`). Build and both `npm test` runs pass (combined Chrome/Firefox and native Edge; runner `7bfe736`): 9 pure programs, 13 browser programs per engine, offline portable checks and all 66 cadence cases. Final focused meal (4 functional + 4 cadence per engine) and community (14 groups per engine) checks pass; caption clearance passes at all seven stages, quiet mode passes across four views at DPR 1/2, and painted-group / viewport-margin gates pass at >=30 / >=16 CSS px. No full-run failures or retries. Physical Ally/Vanadium and sustained acceptance remain pending; earlier intermittent stalls remain unexplained. See [session 017](../../../sessions/2026-10-10-weather-habitat/017-cloud-meal-choreography-results.md); session 015 covers the preceding spacing/motion candidate.

The meal expands Sage's existing lunch and evening-care routines into a connected sequence. The local clock still controls the daily story, while each meal minute samples its own repeatable activity. Entering the scene, resuming a hidden tab and changing the clock reconstruct the correct current pose without running missed actions.

| Seconds within the minute | Activity | Visible intent |
| --- | --- | --- |
| 00–08 | Gather | Reach into the food basket and collect greens. |
| 08–16 | Carry | Bring the gathered ingredients to the pot. |
| 16–36 | Cook | Stir with the spoon's working end in the pot. |
| 36–44 | Deliver | Carry a bowl along the foreground route to the serving area. |
| 44–49 | Serve | Set the food on a small shared serving stand. |
| 49–54 | Rest | Pause after the work; sharing includes time to recover. |
| 54–60 | Return | Walk back to the basket and settle into the next cycle. |

The story belongs only to 11:00–13:00 and 20:00–22:00, repeating once each minute inside both daily windows. The first and final 1.2 seconds of each daily window retain the baseline routine pose. Quintic blends connect phase changes; the ordinary 60-second return joins home without a reset. Serving prepares food for the family; this slice does not animate other family members eating.

## Composition and contacts

Keep Aster and supported Pebble together and preserve at least 30 CSS pixels between independent painted character groups. Aster's infant support always uses the actual rendered arm pose. Sprout retains safe play/sleep, existing daylight timing and the attached play stick.

Sage begins near home at x78. The route uses eight alternating planted steps each way through the foreground to x126 / ground48, staying clear of the hearth; it avoids the small x84 detour. Sage serves at x142,y14. Fixed-length limbs solve against reachable hand and foot targets; supporting feet stay in world space during steps. The held and served bowls use the same normalized rim/grip point and size. The tabletop sits at y19.333 with stand legs down to ground48, so a served bowl lands directly on the surface. The hand bowl fades into the stand bowl while feet stay world-anchored. Food props do not animate in quiet/frozen mode, and Sage returns home before the final baseline hold at each daily-window boundary.

Expand the cropped actor viewport to contain the route, stand and strokes, maintaining projection with the landscape and at least 16 CSS pixels of horizontal character screen clearance. Keep the time, weather, controls and existing cast proportions readable at 854×480, 1280×720, 1920×1080 and portrait 390×844, DPR1/2. Final runtime meets the >=30 CSS-pixel painted-group gap and >=16 CSS-pixel viewport-margin gates. Reuse mounted SVG nodes and skip unchanged attributes. Hosted and single-file forms load the same choreography source.

## Acceptance

- Independently test each stage and each boundary, including minute wrap and entry/exit from both daily meal windows.
- Measure actual painted joints, hand/prop contact, spoon/pot contact, foot support during work, planted stance during walking, serving placement and frame/viewport clearance.
- Check deterministic reconstruction after time jumps, midnight and DST; preserve exact current clock digits.
- Verify quiet/reduced motion, pause/resume and companions off; hide moving held props when the figure is frozen or hidden.
- Retain infant-support, other routines, weather/cache, offline and all existing cadence assertions. Add the dedicated meal checks to the required runner.
- Build, all 9 pure programs, all 13 browser programs per engine, offline portable checks and all 66 cadence cases pass. Final focused meal and community checks, caption clearance at all seven stages, quiet mode across four views at DPR 1/2, and >=30 CSS-pixel group-gap / >=16 CSS-pixel viewport-margin gates pass. No full-run failures or retries. Physical Ally/Vanadium and sustained acceptance remain pending. Full evidence is in [session 017](../../../sessions/2026-10-10-weather-habitat/017-cloud-meal-choreography-results.md).

The story illustrates gathering enough, sharing and resting. It does not track conserved food, nutrition, inventory depletion, persistent meals, demographic changes or real ecosystem behavior. Sustained Ally/Vanadium review remains a device task.
