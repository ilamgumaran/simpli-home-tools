# Green House 1: Ally installation and acceptance

## New cloud candidate — 2026-10-29

The current development branch is `feature/anatomy-foundation`, [draft PR #16](https://github.com/ilamgumaran/simpli-home-tools/pull/16).
Runtime `99931338f12d5111ea0321cc2690d6588ef59ab9` uses a zero-depth 3D
transform on the reading/clock layer only while the camera moves. Still and
reduced-motion paths retain planar transforms. Artwork, camera coordinates,
weather, story and character contacts are preserved.

Portable SHA-256:
`1e36b79704ac3046230644555ffc5fc691cc5229ac2df067a61d2901e0169d8b`.

[Session 028](../../../sessions/2026-10-10-weather-habitat/028-reading-camera-results.md)
records this candidate's exact browser outcomes, preserved failures and remaining
hosted gates. Both browser engines matched baseline images/geometry in 52 final
comparisons. Required hosted checks remain open; this candidate has no physical
Ally/Vanadium or sustained-display acceptance. Fetch this branch and verify the
runtime ancestry and checksum before testing it. Record device feedback in
reserved message 026; a later cloud follow-up uses 029.

The earlier installation instructions below stay pinned to their named meal
runtime. They are historical evidence, not validation or installation instructions
for the new candidate. Preserve local configuration and the existing installed
build while evaluating a separate candidate.

## Earlier meal handoff


Prepared 2026-10-18 for the earlier meal handoff. Green House 1 is the weather and tiny-community theme; Woodland retains its larger characters and terrain-engineering activities. Earlier runtime `f02092b12a45d72cefe73ba68d5acd2f68932358`, portable SHA-256 `046f02a9772a5060ac422b6acceee763fb29726a230df1ce1932a38611899ec6`. Both `npm test` runs exit 0 (combined Chrome/Firefox and native Edge; runner `7bfe736`): all 9 pure programs, 13 browser programs per engine, offline portable checks and all 66 cadence cases pass. Focused meal (4 functional + 4 cadence per engine), community (14 groups per engine), caption clearance across seven stages, quiet mode across four views at DPR 1/2, and >=30 CSS-pixel group-gap / >=16 CSS-pixel viewport-margin gates pass. No full-run failures or retries. Session 017 contains the full results. Physical Ally/Vanadium and sustained acceptance remain pending; earlier intermittent stalls remain unexplained. The meal runs in the 11:00–13:00 and 20:00–22:00 windows. Use a browser-only mock preview at 11:08 and sample seconds 4, 11, 28, 40, 47, 51 and 57 to inspect the stages; do not change the operating-system clock. Return device findings as `004-ally-to-cloud.md` in the weather-habitat session thread. The [earlier fullscreen handoff](../../../sessions/2026-10-05-immersive-woodland/003-cloud-scene-ready.md) remains history.

## Earlier runtime — recorded browser/portable passes; device acceptance unrun

| Item | Value |
| --- | --- |
| Repository | `ilamgumaran/simpli-home-tools` |
| Branch | `feature/woodland-weather-habitat` |
| Pull request | [PR #11](https://github.com/ilamgumaran/simpli-home-tools/pull/11), draft; sustained/device acceptance pending |
| Candidate runtime revision | `f02092b12a45d72cefe73ba68d5acd2f68932358` |
| Canonical app | `tools/little-orbit/` |
| Portable SHA-256 | `046f02a9772a5060ac422b6acceee763fb29726a230df1ce1932a38611899ec6` |
| Validation status | **BUILD, PURE, BROWSER, CADENCE AND OFFLINE PORTABLE CHECKS PASS** — sustained-use and physical acceptance pending |

The current runtime adds Sage's meal sequence: gather, carry, cook, deliver, serve, rest and return, repeating once per minute in both daily meal windows. Sage takes eight alternating steps each way from home x78 through the foreground to x126 / ground48, then serves at x142,y14. Held and served bowls share a normalized grip/rim point and scale; the tabletop is y19.333 with stand legs to ground48. The last 1.2 seconds of each daily meal window use baseline routine pose; ordinary minute loops join continuously. Quiet mode freezes people and hides food motion. The camp-inset change raises the scene 12 CSS pixels and clears the stage captions. Existing >=30 CSS-pixel painted-group gap and >=16 CSS-pixel viewport-margin gates pass. Aster, Sage and Sprout retain independent rhythms and 1.2-second quintic blends; Aster continues supporting Pebble. Epoch-based motion remains continuous across midnight and DST. Session 015 contains browser/cadence/portable passes and exact measurements for the previous candidate.

## Install while preserving the local display

In PowerShell, preserve local edits first. Keep the established Edge profile, launchers, browser settings and intentionally customized site configuration. From the repository root:

```powershell
git status --short
git fetch origin refs/heads/feature/woodland-weather-habitat:refs/remotes/origin/feature/woodland-weather-habitat
git switch feature/woodland-weather-habitat
git pull --ff-only origin feature/woodland-weather-habitat
$runtimeRevision = 'f02092b12a45d72cefe73ba68d5acd2f68932358'
git merge-base --is-ancestor $runtimeRevision HEAD
if ($LASTEXITCODE -ne 0) { throw "Tested runtime revision $runtimeRevision is not an ancestor of HEAD." }
$portableHash = (Get-FileHash -LiteralPath 'tools/little-orbit/Little Orbit.html' -Algorithm SHA256).Hash.ToLowerInvariant()
if ($portableHash -ne '046f02a9772a5060ac422b6acceee763fb29726a230df1ce1932a38611899ec6') { throw "Portable clock checksum does not match the current candidate." }
git rev-parse HEAD
```

For a missing local branch, use `git switch --track origin/feature/woodland-weather-habitat`. To start fresh: `git clone --branch feature/woodland-weather-habitat https://github.com/ilamgumaran/simpli-home-tools.git`, then enter the checkout. Documentation-only commits may advance `HEAD`; verify the tested runtime is an ancestor of `HEAD` and the portable checksum matches before local edits.

For an instant portable install, open `tools/little-orbit/Little Orbit.html` in Edge, Chrome or Firefox; no Node install is needed. For the hosted Ally display, update the complete runtime through the established local workflow, preserving profiles and customized config. Add `habitat-weather.js`, `habitat-meal.js` and `habitat-community.js` and retain the matching `index.html`, `style.css`, `config.js`, `characters.js`, `world-layers.js`, `app.js`, `display-settings.js`, `time-climber.js`, `time-climber-ii.js`, `woodland-art.js`, `woodland-time.js`, `woodland-immersive.js` and `server.cjs`. Restart with the launcher that owns the active display directory/profile.

Cycle **Theme** to **Green House 1**. It always fills the screen; Woodland's Full landscape/Dashboard setting applies to Woodland. Set the weather city and temperature unit in Settings. The new-profile default remains Time Climber II and existing preferences are preserved. Check the actual CSS viewport after Windows scaling. Live weather needs connectivity; cached weather is labeled and time/facts work offline.

## Compact physical acceptance

- Record runtime revision, portable checksum, hosted/portable form, browser/version, actual CSS viewport, DPR and Windows scaling. Check 12/24-hour mode, current digits and DD plaque at minute, hour and day rollover, including `09:59→10:00`.
- In Green House 1, inspect tiny camp characters, supported infant care, supervised play/sleep, Sprout's dawn/dusk blend, grounded feet and stick tip/grip through the transition, Sage's shelter-line grip, basket gathering and the spoon meeting the pot. Follow all seven meal stages during both daily windows, including the hand-to-stand bowl transfer, planted foreground steps, serve position, quiet/frozen behavior and return joins. Review each daily routine, including dusk remembrance. Switch back to Woodland to check its larger cast, group travel, protected climb/recovery/descent and engineering activities.
- Check true fullscreen fit, viewport-edge art, readable time/date/weather and controls at the device's actual CSS size and scaling. Review normal and low-power/native cadence during sustained use.
- Exercise reduced motion, Still camera, companions off, hidden tab, Settings, screen rest, resume/sleep and offline portable behavior. Verify time stays current after each pause/resume.
- In Green House 1, inspect clear hot/cold conditions, rain/snow and night, Celsius/Fahrenheit labels and cached/unavailable states. Check the tiny shelter, food/cooking, teaching, supported infant care, supervised Sprout play and remembrance of Fern. Companions off should retain the camp and weather while hiding people. Confirm weather and community layers clear when returning to Woodland.
- Report Ally and Vanadium separately with the exact revision and checksum. Cloud build, pure, browser, caption, cadence and offline portable checks pass; physical results do not replace cloud outcomes. Current runtime ownership is in [session 016](../../../sessions/2026-10-10-weather-habitat/016-cloud-meal-choreography-ownership.md); [session 017](../../../sessions/2026-10-10-weather-habitat/017-cloud-meal-choreography-results.md) records final evidence. Physical Ally and Vanadium acceptance require device evidence.

Keep private screenshots, profiles and device paths out of Git. Report reproduction steps and distinguish display or clock failures from art feedback. No merge, release or device installation was performed. Physical Ally and Vanadium acceptance remain unrun; PR #11 remains draft while sustained and device acceptance is open.
