# Full-screen Woodland — portable build and device handoff

- Message ID: `2026-10-05-immersive-woodland/003`
- Date: `2026-10-10` (America/New_York)
- From: cloud implementation/orchestration session
- To: local Ally installation/testing session
- Status: cloud implementation ready; physical Ally/Vanadium acceptance pending
- Branch: `feature/woodland-immersive-story`, based on PR #8 / `feature/woodland-organic-motion`
- Pull request: [PR #9](https://github.com/ilamgumaran/simpli-home-tools/pull/9)
- Tested runtime revision: `47ea30e35eb666e9979aefd7cf18ecf0b9b16b41`
- Canonical app: `tools/little-orbit/`
- Portable file: `tools/little-orbit/Little Orbit.html`
- Portable SHA-256: `2a67a11ebb838e75b574339fb9fa4557892d987595740e7bdf44909fad2efe64`

## What is ready

Woodland now fills the viewport instead of the dashboard's scene panel. Larger proportion-preserving characters share detailed woods, hills, river and camp. Complete current HH:MM uses timber/stone hour structures and sand/leaf/stone/wood minute materials; DD appears on a carved plaque. Clock paths change atomically at the minute boundary, including hour/calendar changes. Current-time geometry remains complete while the material story runs.

Twelve minute activities include paving, gathering timber, shelter work, filtering water, reachable berry foraging, protected climbing, making fire, cooking, crossing repair, rest and teaching. Helpers and learners walk between sites; timing accommodates the longest crossing in the group. A learner comes near the adult for lessons and plays at a connected supervised shallow bank. Families sleep together in camp at night. Cooking has a wrist-attached spoon meeting the pot, and shelter/crossing work has a mallet meeting a peg. Camp/tent/crossing construction advances monotonically within each hourly chapter; it is an authored time snapshot, not saved resource history.

Climbing begins after arrival. Three bouts each include four seconds of supported recovery, with helmet, chinstrap, harness, hardware, authored holds and a harness-connected rope. Assistance appears only during late work; descent follows the protected route before the next task. Walking includes stationary planted feet on a sloping approach. Shared bodies, poses, equipment and stories remain central definitions.

Wind, clouds, water, gentle lighting and bounded camera/information drift keep the art active. Low power targets 30 fps; normal mode follows browser frames. Reduced motion gives a static current-time scene. Settings, hidden documents and screen rest stop rendering. Companion-off hides people while atmosphere continues; Still camera stops camera/information drift. Dashboard remains available with the previous contact/visit controls. Daily thought opens the learning panel.

[Implementation/design](../../tools/little-orbit/design/IMMERSIVE-WOODLAND.md) records scope and validation; [original vector preview](../../tools/little-orbit/design/immersive-woodland-preview.svg) shows a synthetic 1280×720 cooking scene. Deeper persistent camp history, resource conservation and later industrial/farming/railway/ant scenes remain deferred.

The [model orchestration plan](../../tools/little-orbit/design/MODEL-ORCHESTRATION.md) records the owner's October 10 allocation: Sol 6.1 plans/reviews and coordinates integration, Sol 6 runs validation, and lighter models execute bounded tasks. Delivery finishes this scene before adding another world layer.

## Pull and install for testing

Preserve local edits, the installed Edge profile, launchers and intentionally customized configuration. Fetch this branch; `main` is not the install source. In PowerShell from the repository root:

```powershell
git status --short
git fetch origin refs/heads/feature/woodland-immersive-story:refs/remotes/origin/feature/woodland-immersive-story
git switch feature/woodland-immersive-story
git pull --ff-only origin feature/woodland-immersive-story
git rev-parse HEAD
(Get-FileHash -LiteralPath 'tools/little-orbit/Little Orbit.html' -Algorithm SHA256).Hash.ToLowerInvariant()
```

If the branch is not present locally, use `git switch --track origin/feature/woodland-immersive-story` instead. Later documentation/test-only commits may advance HEAD without changing the runtime/checksum above. Compare the unmodified checkout artifact before applying local configuration changes.

Open the portable HTML directly in Edge, Chrome or Firefox for an immediate test; it needs no Node installation. For the hosted Ally display, update the complete canonical runtime through the established local workflow. In addition to existing modules, this version needs **`woodland-art.js` and `woodland-immersive.js`**, plus updated `index.html`, `style.css`, `config.js`, `characters.js`, `world-layers.js`, `app.js`, `display-settings.js`, `woodland-time.js` and `server.cjs`. Updating only `app.js` cannot install it. Preserve other runtime modules and any deliberately customized site configuration. Restart using the launcher that owns the active display directory/profile.

Select **Theme: Woodland**, then **Settings → Woodland view → Full landscape**. New profiles still choose Time Climber II; existing saved theme choices remain intact. Check the actual browser viewport after OS scaling, initially 854×480 and 1280×720 landscape. The default view is immersive when Woodland is chosen; Dashboard remains selectable. Weather needs connectivity; time and bundled learning content work offline.

## Device results to return

Cloud validation covers Linux Chrome/Edge/Firefox hosted and portable behavior, full viewport fits at DPR 1/2, clock/calendar paths, all daily casts/activities, real tool/hold/rope geometry, group travel, recovery, lifecycle and measured frame cadence. Exact results appear in the design's validation record. These checks do not establish physical Ally power/heat, fullscreen scaling or Android/Vanadium behavior.

Return findings as **`004-ally-scene-results.md`** in this thread. Include the tested Git revision and artifact checksum, local configuration differences, browser versions, actual CSS viewport/DPR and whether source or portable was used. Check visible time/control/weather fit, fluid travel/climb/descent/rest, connected supervised play, teaching/foraging/cooking work, minute/hour changes, Still/reduced-motion modes, fullscreen and sustained frame/power behavior. Report Vanadium separately on a device that has it; do not infer it from desktop Chrome. Record any local fixes as commits/PRs and identify their scope so the cloud session can integrate them.

All requested cloud source, portable build, shared layers, design and tests are in Git. No device installation, merge or release was performed by this cloud session.
