# Larger Woodland, preserved contacts and next work step

- Message ID: `2026-10-05-woodland-refinement/002`
- Date: `2026-10-05` (America/New_York)
- From: local Ally implementation/testing session
- To: cloud and subsequent device sessions
- Status: implemented, browser-verified and installed; physical acceptance pending
- Branch: `feature/woodland-refinement-contacts`
- Cloud input: `bcfdb1142f7390e80e2f71e71df248b2081979d7`; runtime `145c67f5775c71f63703c790c8233e5fb6f1032c`
- Local input: `f8b1245d5fe79c691fa2fd49a894c03680b493c3` / [PR #6](https://github.com/ilamgumaran/simpli-home-tools/pull/6)
- Previous: [001: cloud handoff](001-cloud-to-ally.md)

The owner asked to pull the latest and proceed with character work. Cloud and local changes were parallel histories. This integration combines the larger scene and smooth choreography with existing planted rock/walking contacts and gathering/cooking grips. [Implementation and remaining milestones](../../tools/little-orbit/design/REFINEMENT-AND-WORK.md) describe the boundaries.

Added grounded shelter/crossing work sockets, wrist-attached mallets and reciprocal teaching/listening turns. Responsive contact-site transforms keep enlarged actors, holds, materials and tool targets together. Travel resolves to the new worksite positions. Real rendered root checks cover duration 4/12/20 seconds at the travel-to-work boundary; actual SVG contact/grip checks retain tight endpoint tolerance.

## Verification and outcome

Initial integration checks caught unreachable shelter/crossing sway endpoints. Moving their sockets within the hand's full motion envelope fixed the issue; dense model tests now cover all four work activities and their sway. Targeted hosted and portable Edge checks passed. Portrait review then caught a ResizeObserver double-scale bug; rendering now owns the actor/site transform together, with an asynchronous resize regression. The complete final npm build/test suite passed in Edge 154.0.4258.53 and bundled Firefox, including hosted and offline portable forms and all existing themes.

Headless handheld (854 × 480) and portrait (390 × 844) previews were inspected. The earlier native Computer Use URL-confidence block is not bypassed; physical kiosk viewport/OS scaling, touch and extended-operation acceptance remain pending. These checks are authored animation evidence, not full contact dynamics or hardware screen protection evidence.

The Ally runtime mirror and explicit portable ZIP were updated. The fullscreen Edge clock was restarted (window 13596); loopback 4173 serves the responsive sites and teaching code with HTTP 200. Local Woodland defaults, profiles, launchers and power helpers were preserved. Installed portable SHA-256: `c1b717aedaac46b5cb17a0f7778b79039a534ec8c883d8300b8792c9956023ba`. The restart helper exited successfully; an already-exited Edge child produced a harmless termination message.

## Milestones

| Item | Outcome |
| --- | --- |
| Cloud size/motion artwork + local contact history | Integrated |
| Shelter/crossing reachable grips | Implemented; model and rendered checks |
| Reciprocal teaching/listening | Implemented; browser checks |
| All-theme hosted/portable Edge and Firefox | Passed: both browsers |
| Ally mirror/portable ZIP/restart | Complete: installed and restarted fullscreen |
| Physical touch/scaling/extended operation | Pending |
| Specialist tree, all-site planted travel, full dynamics/resources | Deferred |

Use this reply branch before further development so local contacts are not lost. Preserve published session messages. Merge/release remains unrequested; Git does not notify another session automatically.
