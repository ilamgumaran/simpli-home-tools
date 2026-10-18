<!-- SPDX-License-Identifier: LicenseRef-Simpli-Noncommercial-1.0 -->
# Objectives, interpretation and evidence boundaries

Requested 2026-10-18. Status: planning requirements; no implementation or physical performance validation.

## Owner's direction

- Build the first engineering theme around a large exposed clock complication, with causally connected gears, turbines and hydraulic mechanisms carrying year/month/day/hour/minute/second displays.
- Mainly use kinetic/mechanical work from little black stick people. Their bodies are stick-like, with articulated hands/palms, legs/feet and an oval or circular head. Apply the shared anatomy/movement work, adapted to this silhouette.
- Give three groups a distinctive face symbol: many closed zero-shaped loops superimposed at small angular increments, evoking infinite overlapping zeroes. Preserve the requested 1°, 2° and 3° variants.
- Seek a simple, robust, accurate mechanism with very low maintenance over decades or centuries. Investigate air support to reduce rubbing friction, mechanical connections, few springs, spring energy storage and hydraulic energy storage.
- Detail all objects, including hidden functional parts, from purpose and interfaces to appearance, contacts, movement and maintenance. Save research, assumptions, decisions, plans and continuation records in Git, pushing useful checkpoints.

## Interpretation to develop

The working visual title is **Zero Workshop** and proposed theme ID is `engineering1`. The three marks use successive elliptical loops at a 1°, 2° or 3° angular difference within each mark, rather than changing by a fixed angle per animation frame. This is an explicit revisable interpretation of “infinite zeros”; the finite visible loop count and rotation period require small-size review. Perfect circles rotated about their centers look identical, so the mark needs zero-shaped ellipses or another visible asymmetry. Group identity must also be available through names/roles, because these tiny differences will not be reliably distinguishable at every display size.

“Always moving” means active-mode machinery with sensible continuous and intermittent motions. Calendar/date mechanisms index at their proper events rather than spinning arbitrarily. Reduced motion, hidden tabs, Settings and screen rest must still suppress movement and show complete current time. No work assignment can delay the clock or require the people to work continuously without rest.

## Engineering requirements and research questions

| Requirement | Questions to resolve and evidence required |
| --- | --- |
| Causal mechanism | Define every power path, shaft, gear ratio, clutch, supported load, contact and output; distinguish display animation from a physical candidate. |
| Accuracy | What regulates time? Separate rate stability, setting error, temperature sensitivity, energy reserve and source synchronization. The browser still samples device time; it cannot improve the device clock's absolute accuracy. |
| Calendar | Cover 60-second/minute, 24-hour, variable month lengths, Gregorian century exceptions, year carry and controlled correction for timezone/DST or manual setting. |
| People-powered reserve | Identify crank/treadle work, losses and finite reserve. Stored energy allows rest; it is not a free or perpetual energy source. Optional environmental inputs must have an identified external source. |
| Air support | Compare passive bearings with externally supplied air bearings. Include compressor, clean/dry air, filtration, supply interruption, support on air loss and energy demand; an air film is not free energy. |
| Hydraulic store | A fluid circuit transfers energy; an accumulator stores recoverable energy through a compliant element or lifted load. Identify which, including valves, return path, seals and losses. No component sizing or build instructions are part of this theme plan. |
| Low spring count | Count regulating/flexure springs, energy-store springs and valve/clutch springs separately. Few springs alone does not establish reliability. |
| Longevity | Define a replaceable/serviceable core, contamination control, material/wear interfaces and evidence needed for each service/lifetime claim. No zero-maintenance or centuries-long performance promise. |
| Novel arrangement | Document our proposed architecture and decisions. Research prior art before claiming anything is new; physical feasibility needs independent engineering review and prototypes. |
| Readable art | Fullscreen at the existing handheld/desktop/portrait viewports; HH:MM remains dominant, seconds/date/year legible, motion and actors outside the reading region. |

## Current runtime continuity

This is documentation-only planning on a separate branch. The tested runtime remains `f02092b12a45d72cefe73ba68d5acd2f68932358`, portable SHA-256 `046f02a9772a5060ac422b6acceee763fb29726a230df1ce1932a38611899ec6`; [Green House 1 session 017](../../../../sessions/2026-10-10-weather-habitat/017-cloud-meal-choreography-results.md) owns its test evidence. Existing [anatomy stages](../ANATOMY-AND-ORGANIC-MOVEMENT.md) remain the next shared-character foundation. No new theme registry entry, source, tests, dependencies, settings or generated portable file is changed by this checkpoint.
