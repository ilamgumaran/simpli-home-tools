<!-- SPDX-License-Identifier: LicenseRef-Simpli-Noncommercial-1.0 -->
# Green House 1 — community habitat

Status: authored community-life slice implemented. Runtime `de43b318d7b62fdd67b90f589b91947d67d843bf` (portable SHA-256 `3ce3de6658214d446368c3b1676ac4dd59a6ea0b2baf30e3f55c5d7032945b99`) has minimum sampled painted-group gaps of 46.54 CSS pixels between Sprout and the caregiver group and 39.42 pixels between the caregiver and Sage groups; the minimum horizontal viewport margin is 29.94 CSS pixels. Portrait origin 120 retains that clearance. Aster/Sage/Sprout have separate rhythms and 1.2-second quintic pose blends; Aster continues to support Pebble. Eight pure checks, 12 browser programs per engine, all offline portable checks and all 54 cadence/browser scenarios pass in Chrome, Firefox and Edge. Full results are in [session 015](../../../sessions/2026-10-10-weather-habitat/015-cloud-spacing-motion-results.md). Physical Ally/Vanadium and sustained acceptance remain pending. Sessions 011–013 document earlier candidates and results. This recurring community story belongs to the separate `greenhouse1` theme, displayed as **Green House 1**, alongside its weather scene. It is not part of Woodland's larger-actor engineering terrain, nor a life simulation or persistent family system.

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

Aster supports Pebble throughout the cycle. Sprout plays with a stick in the sand during local daylight and sleeps at night. The woodland scene provides shared 07:00 dawn and 19:00 dusk metadata; the community sampler's standalone fallback is 06:00/20:00. These are authored runtime values, not user settings. Routines recur from local time and do not depend on leaving a browser open. Sage's adjacent actions and Sprout's play/sleep poses blend over 1.2 seconds with quintic easing. Hands meet the shelter line, basket, seed board and flowers; during cooking the spoon joins the wrist and pot. Independent painted group bounds leave gaps of about 39–47 CSS pixels, above the 30-pixel target. Browser checks also require at least 16 CSS pixels from horizontal viewport edges; portrait origin 120 keeps the family inside its margins. This first slice illustrates the care and reflection strand of the wider terrain/time story. New buildings, births, generations and persistent resources require later layers.

Each mounted camp retains its prop and actor nodes. Routine colors, visibility and other fixed attributes update only when their values change; moving poses and contact calculations retain the main scene cadence. Recreating the camp rebuilds these references. The shared character renderer also caches its rig nodes and skips unchanged attributes.

Each character has a distinct absolute-time cycle: Aster 7.2 seconds, Sage 8.4 seconds and Sprout 6.6 seconds, with phase offsets recorded in the frozen runtime metadata. Epoch-based sampling keeps rhythm continuous across midnight and DST. Pebble's support pose follows Aster's exact actor cycle, so both hands remain connected. At routine boundaries, Sage's previous and next task wrists are each solved against their own contact in camp coordinates. The resulting endpoints blend over 1.2 seconds with quintic easing before the arm is solved again with fixed bone lengths; attached tools fade with the same transition and the shelter line returns smoothly to rest. Sprout's play/sleep pose uses the same blend duration, morphs the existing eye marks, follows the blended hand with the stick while preserving its authored grip-to-tip offset, and derives the actor root from foot support. Frozen mode keeps movement cycles and organic offsets at zero. All required pure, browser, cadence and offline portable checks pass; see session 015.

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
- For runtime `de43b318d7b62fdd67b90f589b91947d67d843bf`, all required pure, full browser, cadence and offline portable checks pass; details are in [session 015](../../../sessions/2026-10-10-weather-habitat/015-cloud-spacing-motion-results.md). Do not treat sessions 011–013 as validation of this candidate; they record earlier revisions. Sustained and physical-device acceptance remain open. See ownership [014](../../../sessions/2026-10-10-weather-habitat/014-cloud-spacing-motion-ownership.md), and historical results [013](../../../sessions/2026-10-10-weather-habitat/013-cloud-child-motion-results.md).
