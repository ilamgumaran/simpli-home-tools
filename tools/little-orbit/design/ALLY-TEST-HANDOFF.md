# Green House 1: Ally installation and acceptance

Prepared 2026-10-15. Green House 1 is the weather and tiny-community theme; Woodland retains its larger characters and terrain-engineering activities. Read the [current candidate handoff](../../../sessions/2026-10-10-weather-habitat/010-cloud-clock-rendering-results.md) first. Tested application source is `c827dba952f2873386fc78f4f7b5892b78bc29ba`, with portable SHA-256 `00fbf20cba9b1e19a2d22943cf6dc318d21281946dd7ee9db4a31bfcc711d2c4`. Community, fullscreen, weather functional and offline portable checks pass in Chrome, Firefox and Edge; cadence acceptance fails in all three. Physical Ally/Vanadium checks are unrun. Return findings as `004-ally-to-cloud.md` in the weather-habitat session thread. The [earlier fullscreen handoff](../../../sessions/2026-10-05-immersive-woodland/003-cloud-scene-ready.md) remains history.

## Current candidate — functional checks pass; motion cadence gates fail

| Item | Value |
| --- | --- |
| Repository | `ilamgumaran/simpli-home-tools` |
| Branch | `feature/woodland-weather-habitat` |
| Pull request | [PR #11](https://github.com/ilamgumaran/simpli-home-tools/pull/11), draft; browser acceptance incomplete |
| Candidate runtime revision | `c827dba952f2873386fc78f4f7b5892b78bc29ba` |
| Canonical app | `tools/little-orbit/` |
| Portable SHA-256 | `00fbf20cba9b1e19a2d22943cf6dc318d21281946dd7ee9db4a31bfcc711d2c4` |
| Validation status | **FUNCTIONAL CHECKS PASS; MOTION ACCEPTANCE OPEN** — cadence gates failed in Chrome, Firefox and Edge; physical acceptance unrun |

This branch advances PR #9 with a separate sixth theme. The current candidate avoids unused Woodland model snapshots in Green House 1 and uses a CSS color quad beneath the animated SVG root opacity. The 16 controlled pixel comparisons on predecessor `f0aaaecf` apply to that unchanged CSS-quad component, not the whole current candidate. Current community, fullscreen, weather functional and offline portable checks pass in all three browsers, while motion cadence gates fail in each. See the [weather design](WEATHER-HABITAT.md), [community design](COMMUNITY-HABITAT.md) and [candidate investigation](../../../sessions/2026-10-10-weather-habitat/010-cloud-clock-rendering-results.md). Community routines follow local time and recur with the same family; persistent ecology and demographic changes remain future work.

## Install while preserving the local display

In PowerShell, preserve local edits first. Keep the established Edge profile, launchers, browser settings and intentionally customized site configuration. From the repository root:

```powershell
git status --short
git fetch origin refs/heads/feature/woodland-weather-habitat:refs/remotes/origin/feature/woodland-weather-habitat
git switch feature/woodland-weather-habitat
git pull --ff-only origin feature/woodland-weather-habitat
$runtimeRevision = 'c827dba952f2873386fc78f4f7b5892b78bc29ba'
git merge-base --is-ancestor $runtimeRevision HEAD
if ($LASTEXITCODE -ne 0) { throw "Tested runtime revision $runtimeRevision is not an ancestor of HEAD." }
$portableHash = (Get-FileHash -LiteralPath 'tools/little-orbit/Little Orbit.html' -Algorithm SHA256).Hash.ToLowerInvariant()
if ($portableHash -ne '00fbf20cba9b1e19a2d22943cf6dc318d21281946dd7ee9db4a31bfcc711d2c4') { throw "Portable clock checksum does not match the tested runtime." }
git rev-parse HEAD
```

For a missing local branch, use `git switch --track origin/feature/woodland-weather-habitat`. To start fresh: `git clone --branch feature/woodland-weather-habitat https://github.com/ilamgumaran/simpli-home-tools.git`, then enter the checkout. Documentation-only commits may advance `HEAD`; verify the tested runtime is an ancestor of `HEAD` and the portable checksum matches before local edits.

For an instant portable install, open `tools/little-orbit/Little Orbit.html` in Edge, Chrome or Firefox; no Node install is needed. For the hosted Ally display, update the complete runtime through the established local workflow, preserving profiles and customized config. Add `habitat-weather.js` and `habitat-community.js` and retain the matching `index.html`, `style.css`, `config.js`, `characters.js`, `world-layers.js`, `app.js`, `display-settings.js`, `time-climber.js`, `time-climber-ii.js`, `woodland-art.js`, `woodland-time.js`, `woodland-immersive.js` and `server.cjs`. Restart with the launcher that owns the active display directory/profile.

Cycle **Theme** to **Green House 1**. It always fills the screen; Woodland's Full landscape/Dashboard setting applies to Woodland. Set the weather city and temperature unit in Settings. The new-profile default remains Time Climber II and existing preferences are preserved. Check the actual CSS viewport after Windows scaling. Live weather needs connectivity; cached weather is labeled and time/facts work offline.

## Compact physical acceptance

- Record runtime revision, portable checksum, hosted/portable form, browser/version, actual CSS viewport, DPR and Windows scaling. Check 12/24-hour mode, current digits and DD plaque at minute, hour and day rollover, including `09:59→10:00`.
- In Green House 1, inspect tiny camp characters, supported infant care, supervised play/sleep, shelter-line grip, basket gathering and the spoon meeting the pot. Review each daily routine, including dusk remembrance. Switch back to Woodland to check its larger cast, group travel, protected climb/recovery/descent and engineering activities.
- Check true fullscreen fit, viewport-edge art, readable time/date/weather and controls at the device's actual CSS size and scaling. Review normal and low-power/native cadence during sustained use.
- Exercise reduced motion, Still camera, companions off, hidden tab, Settings, screen rest, resume/sleep and offline portable behavior. Verify time stays current after each pause/resume.
- In Green House 1, inspect clear hot/cold conditions, rain/snow and night, Celsius/Fahrenheit labels and cached/unavailable states. Check the tiny shelter, food/cooking, teaching, supported infant care, supervised Sprout play and remembrance of Fern. Companions off should retain the camp and weather while hiding people. Confirm weather and community layers clear when returning to Woodland.
- Report Ally and Vanadium separately. Cloud functional checks pass, while motion cadence gates fail; physical results do not replace those cloud outcomes. Current browser evidence is in the [weather-habitat handoff](../../../sessions/2026-10-10-weather-habitat/010-cloud-clock-rendering-results.md). Physical Ally and Vanadium acceptance require device evidence.

Keep private screenshots, profiles and device paths out of Git. Report reproduction steps and distinguish display or clock failures from art feedback. No merge, release or cloud installation was performed. Physical Ally and Vanadium acceptance remain unrun; PR #11 remains draft while cadence acceptance is open.
