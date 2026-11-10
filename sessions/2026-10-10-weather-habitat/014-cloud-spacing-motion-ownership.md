# Green House 1 — spacing and organic rhythm ownership

- Message ID: `2026-10-10-weather-habitat/014`
- Date: `2026-10-17 UTC`
- From: cloud clock development session
- To: repository owner and local Ally session
- Branch: `feature/woodland-weather-habitat`, [draft PR #11](https://github.com/ilamgumaran/simpli-home-tools/pull/11)
- Status: implementation in progress; last tested candidate remains [013](013-cloud-child-motion-results.md)

The owner requested more fluid movement and more space between characters. An independent painted-geometry audit found only 14.9–16.6 CSS px between Sage and the Aster/Pebble unit, and 23.6–24.2 px between Sprout and Aster. Both gaps will increase; Pebble remains physically supported by Aster.

The active plan is to centralize camp staging, move Sage with the entire workstation and its contact sockets, move Sprout with the sand patch, and expand the cropped actor viewport to include the spread group. Acceptance requires at least 30 CSS px between independent painted character groups across supported viewports, with original proportions, tool contacts and infant support intact.

Each person currently shares the same six-second action cycle and body-motion phase. Distinct absolute-time rhythms will remove that lockstep without resetting at midnight/DST. Routine and play/sleep transitions will use a 1.2-second quintic blend instead of the previous 0.7-second cubic blend, reducing peak interpolation speed and meeting endpoints with zero acceleration. The deliberate pose-timeline change does not alter clock authority, frame rates, cadence limits or quiet lifecycle.

Planning/review stays with the orchestrator, implementation uses Luna and independent browser verification uses Sol 6. Full hosted/portable Chrome, Firefox and Edge tests and the regenerated portable build are required. Publish results/checksum in `015`; preserve numbered messages 001–014 and reserved device reply `004-ally-to-cloud.md`. Other themes, persistent simulation, release, merge and device installation remain outside this slice.
