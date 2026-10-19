# Next steps: planted walking and tool work sockets

- Message ID: `2026-10-05-woodland-ally/004`
- Date: `2026-10-05` (America/New_York)
- From: local character implementation session
- To: subsequent cloud and device-testing sessions
- Status: implemented, browser-verified and deployed; physical acceptance remains pending
- Branch: `feature/woodland-walking-grips`
- Base: `630891a6c190b5e959777b155d696b8f7febbcdd` / [PR #5](https://github.com/ilamgumaran/simpli-home-tools/pull/5)
- Previous message: [003: planted rock contacts](003-character-contacts.md)

The owner authorized proceeding with the next steps. [Walking and grip scope](../../tools/little-orbit/design/WALKING-AND-GRIPS.md) records the new shared route/rig and work-grip boundaries.

Implemented: survey map-read pause, stowed-map alternating steps with a fixed stance foot, final destination rest, and ground-supported gathering/cooking grips that reach real work sockets. The shared rock contact solver remains available. Model checks sample 1,001 walking positions and 101 work-angle samples, including actual endpoint positions, ground clearance, support continuity and tool-tip/work agreement.

## Verification and deployment

The first full run passed Edge but exposed a Firefox test-coordinate mismatch: SVG-root `getCTM()` and child matrices did not share the expected frame. The geometry check now converts via `getScreenCTM()` into the scene's world coordinates. Targeted Firefox hosted/portable contact and grip checks passed afterward, followed by a successful complete `npm test` rerun in Edge/Chromium and Firefox. This was a verification-coordinate correction, not a relaxation of endpoint tolerance or a change to the planted-foot model.

`npm run build` and all required browser, character/world model, hosted and portable fallback checks passed on Windows using Edge 154.0.4258.53 and bundled Firefox. Handheld and portrait walking/cooking previews were inspected with no scrolling. The Ally runtime mirror and ZIP were updated and the fullscreen Woodland clock restarted, preserving local settings/default selection and launchers. Portable SHA-256: `a594d8d195bac7eb842965617d731c653b67fcab43e7c6bf4248bcef30b5029d`. Live touch/scaling and extended operation remain pending because the earlier Computer Use URL-confidence block was not bypassed. Automated pose/geometry evidence does not establish physical battery savings, collision physics or screen-wear prevention.

## Milestones

| Item | Outcome |
| --- | --- |
| Planted walking and map-before-walk sequence | Implemented; model checks passed |
| Reachable gathering/cooking sockets and shared grip frame | Implemented; model checks passed |
| Hosted/portable full browser verification | Complete: Edge and Firefox suites passed |
| Ally runtime and portable ZIP | Complete: updated and restarted fullscreen |
| Physical touch/scaling/extended operation | Pending |
| Shelter/crossing sockets and reciprocal teaching gestures | Next candidates |
| Specialist tree route, full dynamics and persistent resources | Deferred |

Fetch this branch/PR before continuing. This step does not merge or release previous stacked PRs. Future replies use 005 or later; preserve published messages as history.
