<!-- SPDX-License-Identifier: LicenseRef-Simpli-Noncommercial-1.0 -->
# Green House 1 — community habitat

Status: authored community-life slice implemented. Current source candidate `b0c364743c355749185505491c64e8b7a15c033f` preserves the community model and Sage's constrained routine contacts while adding Sprout's 0.7-second play/sleep transition and continuous epoch-based breathing phase. Pure tests, portable build and focused Chrome, Firefox and Edge checks pass; full browser suites, cadence and offline portable checks pass. Previous browser results in [session 011](../../../sessions/2026-10-10-weather-habitat/011-cloud-camp-contact-motion.md) apply to its older Sage-contact candidate. See current [session 013](../../../sessions/2026-10-10-weather-habitat/013-cloud-child-motion-results.md), ownership [012](../../../sessions/2026-10-10-weather-habitat/012-cloud-child-motion-ownership.md) and historical [session 010](../../../sessions/2026-10-10-weather-habitat/010-cloud-clock-rendering-results.md). This recurring community story belongs to the separate `greenhouse1` theme, displayed as **Green House 1**, alongside its weather scene. It is not part of Woodland's larger-actor engineering terrain, nor a life simulation or persistent family system.

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

Aster supports Pebble throughout the cycle. Sprout plays with a stick in the sand during local daylight and sleeps at night. The woodland scene provides shared 07:00 dawn and 19:00 dusk metadata; the community sampler's standalone fallback is 06:00/20:00. These are authored runtime values, not user settings. Routines recur from local time and do not depend on leaving a browser open. Sage's adjacent actions blend over 0.7 seconds. Hands meet the shelter line, basket, seed board and flowers; during cooking the spoon joins the wrist and pot. This first slice illustrates the care and reflection strand of the wider terrain/time story. New buildings, births, generations and persistent resources require later layers.

Each mounted camp retains its prop and actor nodes. Routine colors, visibility and other fixed attributes update only when their values change; moving poses and contact calculations retain the main scene cadence. Recreating the camp rebuilds these references. The shared character renderer also caches its rig nodes and skips unchanged attributes.

At routine boundaries, Sage's previous and next task wrists are each solved against their own contact in camp coordinates. The resulting endpoints blend over 0.7 seconds before the arm is solved again with fixed bone lengths; attached tools fade with the same transition and the shelter line returns smoothly to rest. Sprout's play/sleep pose now blends over 0.7 seconds, morphs the existing eye marks, follows the blended hand with the stick while preserving its authored grip-to-tip offset, and derives the actor root from foot support. The breathing phase comes from the date epoch, so midnight and DST do not reset it. Frozen mode keeps Sage asleep, Aster in cradle-care and Sprout asleep. The portable build and full Chrome/Firefox/Edge suites pass, including cadence and offline checks.

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
- For current candidate `b0c3647`, pure tests, portable build and focused Chrome/Firefox/Edge checks pass; full browser suites, cadence and offline portable checks pass. Do not treat session 011's browser results as validation of this candidate. Sustained and physical-device acceptance remain open, and earlier intermittent stalls remain unexplained. See current [session 013](../../../sessions/2026-10-10-weather-habitat/013-cloud-child-motion-results.md), ownership [012](../../../sessions/2026-10-10-weather-habitat/012-cloud-child-motion-ownership.md), and historical Sage-contact results [011](../../../sessions/2026-10-10-weather-habitat/011-cloud-camp-contact-motion.md).
