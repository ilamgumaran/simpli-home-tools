<!-- SPDX-License-Identifier: LicenseRef-Simpli-Noncommercial-1.0 -->
# Green House 1 — Sage's connected meal

Status: authorized implementation in progress. The last tested runtime and portable checksum remain in [session 015](../../../sessions/2026-10-10-weather-habitat/015-cloud-spacing-motion-results.md). [Session 016](../../../sessions/2026-10-10-weather-habitat/016-cloud-meal-choreography-ownership.md) records ownership; publish final evidence separately in session 017.

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

The story belongs only to 11:00–13:00 and 20:00–22:00. Its introduction and exit blend with the existing routine changes; the first and last 1.2 seconds of those daily windows retain the baseline routine pose. Quintic blends connect phase changes. The last frame of the minute joins the first without a reset. Serving prepares food for the family; this slice does not yet animate other family members eating.

## Composition and contacts

Keep Aster and supported Pebble together and preserve at least 30 CSS pixels between independent painted character groups. Aster's infant support always uses the actual rendered arm pose. Sprout retains safe play/sleep, existing daylight timing and the attached play stick.

Sage gathers near the existing basket, cooks at the existing pot and carries food toward a new stand to the right. The foreground walking lane passes in front of the hearth, with feet clear of its flame/stone footprint. Fixed-length limbs solve against reachable hand and foot targets; supporting feet stay in world space during steps. Held food and bowls follow the solved hand; a served bowl appears at the stand through a deliberate placement rather than teleporting between unrelated positions.

Expand the cropped actor viewport to contain the route, stand and strokes, maintaining projection with the landscape and at least 16 CSS pixels of horizontal character screen clearance. Keep the time, weather, controls and existing cast proportions readable at 854×480, 1280×720, 1920×1080 and portrait 390×844, DPR1/2. Reuse mounted SVG nodes and skip unchanged attributes. Hosted and single-file forms load the same choreography source.

## Acceptance

- Independently test each stage and each boundary, including minute wrap and entry/exit from both daily meal windows.
- Measure actual painted joints, hand/prop contact, spoon/pot contact, foot support during work, planted stance during walking, serving placement and frame/viewport clearance.
- Check deterministic reconstruction after time jumps, midnight and DST; preserve exact current clock digits.
- Verify quiet/reduced motion, pause/resume and companions off; hide moving held props when the figure is frozen or hidden.
- Retain infant-support, other routines, weather/cache, offline and all existing cadence assertions. Add the dedicated meal checks to the required runner.
- Run the build, nine pure programs, thirteen browser programs per engine and offline portable checks in actual Chrome, Firefox and Edge. Keep original cadence sample windows, targets and limits. Record failures, corrections and final evidence without substituting old-candidate passes.

The story illustrates gathering enough, sharing and resting. It does not track conserved food, nutrition, inventory depletion, persistent meals, demographic changes or real ecosystem behavior. Sustained Ally/Vanadium review remains a device task.
