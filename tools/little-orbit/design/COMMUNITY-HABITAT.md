<!-- SPDX-License-Identifier: LicenseRef-Simpli-Noncommercial-1.0 -->
# Green House 1 — community habitat

Status: first authored community-life slice implemented; prior candidate `a9122c0` passed hosted/portable functional checks at DPR1/2 in Chrome, Edge and Firefox, while motion acceptance failed in all three. Intermediate `7c11d81` passed focused Firefox immersive-motion cadence but failed weather cadence at portable 1280×720 DPR2 low power; full Chrome/Edge suites were not run on it. Current fine-snap-plus-crop candidate `9b0d6003` is frozen and browser validation is pending; see [session 008](../../../sessions/2026-10-10-weather-habitat/008-cloud-motion-results.md) and prior results in [session 006](../../../sessions/2026-10-10-weather-habitat/006-cloud-validation.md). This recurring community story belongs to the separate `greenhouse1` theme, displayed as **Green House 1**, alongside its weather scene. It is not part of Woodland's larger-actor engineering terrain, nor a life simulation or persistent family system.

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

Aster supports Pebble throughout the cycle. Sprout plays with a stick in the sand during the scene's daylight and sleeps at night. These routines recur from local time; they do not depend on leaving a browser open. Sage's adjacent actions blend over 0.7 seconds. Hands meet the shelter line, basket, seed board and flowers; during cooking the spoon joins the wrist and pot. This first slice illustrates the care and reflection strand of the wider terrain/time story. New buildings, births, generations and persistent resources require later layers.

Each mounted camp retains its prop and actor nodes. Routine colors, visibility and other fixed attributes update only when their values change; moving poses and contact calculations retain the main scene cadence. Recreating the camp rebuilds these references. The shared character renderer also caches its rig nodes and skips unchanged attributes.

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
- Prior-candidate functional community checks passed hosted/portable at DPR1/2 in Chrome, Edge and Firefox. Motion acceptance failed in all three engines. The 7c11 focused Firefox community coverage was not rerun; 7c11 immersive-motion passed but weather cadence failed. Current candidate `9b0d6003` is frozen and awaits validation; see [session 008](../../../sessions/2026-10-10-weather-habitat/008-cloud-motion-results.md).
