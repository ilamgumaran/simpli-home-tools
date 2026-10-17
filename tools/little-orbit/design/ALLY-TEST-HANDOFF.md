# Green House 1: Ally installation and acceptance

Prepared 2026-10-17. Green House 1 is the weather and tiny-community theme; Woodland retains its larger characters and terrain-engineering activities. Runtime candidate is `de43b318d7b62fdd67b90f589b91947d67d843bf`, with portable SHA-256 `3ce3de6658214d446368c3b1676ac4dd59a6ea0b2baf30e3f55c5d7032945b99`. Full Chrome/Firefox/Edge suites, cadence and offline portable checks pass; details are in the [session 015 handoff](../../../sessions/2026-10-10-weather-habitat/015-cloud-spacing-motion-results.md). Painted-group minimum sampled gaps are 46.54 CSS pixels between Sprout and the caregiver group and 39.42 pixels between the caregiver and Sage groups. The minimum horizontal viewport margin is 29.94 CSS pixels, above the 16-pixel requirement. Portrait origin 120 keeps the family within that clearance. Aster, Sage and Sprout use separate rhythms and 1.2-second quintic blends; Aster continues supporting Pebble. Earlier session results apply to their stated candidate revisions only. Sustained and physical Ally/Vanadium checks remain unrun. Return device findings as `004-ally-to-cloud.md` in the weather-habitat session thread. The [earlier fullscreen handoff](../../../sessions/2026-10-05-immersive-woodland/003-cloud-scene-ready.md) remains history.

## Current runtime — browser validation passed; device validation pending

| Item | Value |
| --- | --- |
| Repository | `ilamgumaran/simpli-home-tools` |
| Branch | `feature/woodland-weather-habitat` |
| Pull request | [PR #11](https://github.com/ilamgumaran/simpli-home-tools/pull/11), draft; sustained/device acceptance pending |
| Candidate runtime revision | `de43b318d7b62fdd67b90f589b91947d67d843bf` |
| Canonical app | `tools/little-orbit/` |
| Portable SHA-256 | `3ce3de6658214d446368c3b1676ac4dd59a6ea0b2baf30e3f55c5d7032945b99` |
| Validation status | **FULL CHROME/FIREFOX/EDGE SUITES, CADENCE AND OFFLINE PORTABLE CHECKS PASS** — sustained use and physical acceptance pending |

Runtime `de43b318d7b62fdd67b90f589b91947d67d843bf` has minimum sampled painted-group gaps of 46.54 CSS pixels between Sprout and the caregiver group and 39.42 pixels between the caregiver and Sage groups. The minimum horizontal viewport margin is 29.94 CSS pixels, above the 16-pixel requirement. Portrait origin 120 retains that clearance. Aster, Sage and Sprout use independent rhythms and 1.2-second quintic blends. Aster continues to support Pebble, Sage's task contacts remain, and epoch-based motion remains continuous across midnight and DST. Woodland daylight hours are shared runtime metadata; standalone community sampling defaults to 06:00/20:00, with no new user setting. Full Chrome/Firefox/Edge suites, cadence and offline portable checks pass; results are in [session 015](../../../sessions/2026-10-10-weather-habitat/015-cloud-spacing-motion-results.md). Sessions 011–013 describe prior candidates and their separate evidence. Community routines recur from local time; persistent ecology and demographic changes remain future work.

## Install while preserving the local display

In PowerShell, preserve local edits first. Keep the established Edge profile, launchers, browser settings and intentionally customized site configuration. From the repository root:

```powershell
git status --short
git fetch origin refs/heads/feature/woodland-weather-habitat:refs/remotes/origin/feature/woodland-weather-habitat
git switch feature/woodland-weather-habitat
git pull --ff-only origin feature/woodland-weather-habitat
$runtimeRevision = 'de43b318d7b62fdd67b90f589b91947d67d843bf'
git merge-base --is-ancestor $runtimeRevision HEAD
if ($LASTEXITCODE -ne 0) { throw "Tested runtime revision $runtimeRevision is not an ancestor of HEAD." }
$portableHash = (Get-FileHash -LiteralPath 'tools/little-orbit/Little Orbit.html' -Algorithm SHA256).Hash.ToLowerInvariant()
if ($portableHash -ne '3ce3de6658214d446368c3b1676ac4dd59a6ea0b2baf30e3f55c5d7032945b99') { throw "Portable clock checksum does not match the current candidate." }
git rev-parse HEAD
```

For a missing local branch, use `git switch --track origin/feature/woodland-weather-habitat`. To start fresh: `git clone --branch feature/woodland-weather-habitat https://github.com/ilamgumaran/simpli-home-tools.git`, then enter the checkout. Documentation-only commits may advance `HEAD`; verify the tested runtime is an ancestor of `HEAD` and the portable checksum matches before local edits.

For an instant portable install, open `tools/little-orbit/Little Orbit.html` in Edge, Chrome or Firefox; no Node install is needed. For the hosted Ally display, update the complete runtime through the established local workflow, preserving profiles and customized config. Add `habitat-weather.js` and `habitat-community.js` and retain the matching `index.html`, `style.css`, `config.js`, `characters.js`, `world-layers.js`, `app.js`, `display-settings.js`, `time-climber.js`, `time-climber-ii.js`, `woodland-art.js`, `woodland-time.js`, `woodland-immersive.js` and `server.cjs`. Restart with the launcher that owns the active display directory/profile.

Cycle **Theme** to **Green House 1**. It always fills the screen; Woodland's Full landscape/Dashboard setting applies to Woodland. Set the weather city and temperature unit in Settings. The new-profile default remains Time Climber II and existing preferences are preserved. Check the actual CSS viewport after Windows scaling. Live weather needs connectivity; cached weather is labeled and time/facts work offline.

## Compact physical acceptance

- Record runtime revision, portable checksum, hosted/portable form, browser/version, actual CSS viewport, DPR and Windows scaling. Check 12/24-hour mode, current digits and DD plaque at minute, hour and day rollover, including `09:59→10:00`.
- In Green House 1, inspect tiny camp characters, supported infant care, supervised play/sleep, Sprout's dawn/dusk blend, grounded feet and stick tip/grip through the transition, Sage's shelter-line grip, basket gathering and the spoon meeting the pot. Review each daily routine, including dusk remembrance. Switch back to Woodland to check its larger cast, group travel, protected climb/recovery/descent and engineering activities.
- Check true fullscreen fit, viewport-edge art, readable time/date/weather and controls at the device's actual CSS size and scaling. Review normal and low-power/native cadence during sustained use.
- Exercise reduced motion, Still camera, companions off, hidden tab, Settings, screen rest, resume/sleep and offline portable behavior. Verify time stays current after each pause/resume.
- In Green House 1, inspect clear hot/cold conditions, rain/snow and night, Celsius/Fahrenheit labels and cached/unavailable states. Check the tiny shelter, food/cooking, teaching, supported infant care, supervised Sprout play and remembrance of Fern. Companions off should retain the camp and weather while hiding people. Confirm weather and community layers clear when returning to Woodland.
- Report Ally and Vanadium separately with the exact revision and checksum. Cloud browser/cadence/offline checks pass; do not substitute sessions 011–013's earlier evidence. Physical results do not replace cloud outcomes. Runtime ownership is in [session 014](../../../sessions/2026-10-10-weather-habitat/014-cloud-spacing-motion-ownership.md); results are in [015](../../../sessions/2026-10-10-weather-habitat/015-cloud-spacing-motion-results.md). Physical Ally and Vanadium acceptance require device evidence.

Keep private screenshots, profiles and device paths out of Git. Report reproduction steps and distinguish display or clock failures from art feedback. No merge, release or device installation was performed. Physical Ally and Vanadium acceptance remain unrun; PR #11 remains draft while sustained and device acceptance is open.
