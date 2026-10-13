# Green House 1: Ally installation and acceptance

Prepared 2026-10-13. Green House 1 is the new weather and tiny-community theme; Woodland retains its larger characters and terrain-engineering activities. Read the [current candidate handoff](../../../sessions/2026-10-10-weather-habitat/008-cloud-motion-results.md) first. Intermediate candidate 7c11d81 passed focused Firefox immersive-motion cadence but failed weather cadence at portable 1280×720 DPR2 low power; full Chrome/Edge suites were not run on it. The current fine-snap-plus-crop candidate is frozen at `9b0d6003f536bfea7666c7dbcf4f7b0087906319` (portable SHA-256 `5c7fc8289645babb5a8ebba34c8f77a905e6951f676c1ad6416c2f1fc348783c`). Its partial Firefox community preflight exited 1 at a reduced-motion infant-position assertion; weather and full browser suites remain unrun. Physical Ally and Vanadium acceptance also remain pending. Return findings as `004-ally-to-cloud.md` in the weather-habitat session thread. The [earlier fullscreen handoff](../../../sessions/2026-10-05-immersive-woodland/003-cloud-scene-ready.md) remains history.

## Current candidate — browser validation pending

| Item | Value |
| --- | --- |
| Repository | `ilamgumaran/simpli-home-tools` |
| Branch | `feature/woodland-weather-habitat` |
| Pull request | [PR #11](https://github.com/ilamgumaran/simpli-home-tools/pull/11), draft; browser acceptance incomplete |
| Candidate runtime revision | `9b0d6003f536bfea7666c7dbcf4f7b0087906319` |
| Canonical app | `tools/little-orbit/` |
| Portable SHA-256 | `5c7fc8289645babb5a8ebba34c8f77a905e6951f676c1ad6416c2f1fc348783c` |
| Validation status | **UNVALIDATED** — browser checks pending |

This branch advances PR #9 with a separate sixth theme. The current candidate combines camera/HUD coalescing in fine device-pixel steps with a small-family-actor SVG crop. Original vector nodes and scale remain; the crop uses shared camp metadata and paint-frame data without per-frame bounding-box calculation. Browser validation is pending; do not treat it as accepted. The previous 7c11 candidate passed focused Firefox immersive-motion cadence but failed weather cadence at portable 1280×720 DPR2 low power. See the [weather design](WEATHER-HABITAT.md), [community design](COMMUNITY-HABITAT.md) and [candidate investigation](../../../sessions/2026-10-10-weather-habitat/008-cloud-motion-results.md). Community routines follow local time and recur with the same family; persistent ecology and demographic changes remain future work.

## Install while preserving the local display

In PowerShell, preserve local edits first. Keep the established Edge profile, launchers, browser settings and intentionally customized site configuration. From the repository root:

```powershell
git status --short
git fetch origin refs/heads/feature/woodland-weather-habitat:refs/remotes/origin/feature/woodland-weather-habitat
git switch feature/woodland-weather-habitat
git pull --ff-only origin feature/woodland-weather-habitat
git rev-parse HEAD
(Get-FileHash -LiteralPath 'tools/little-orbit/Little Orbit.html' -Algorithm SHA256).Hash.ToLowerInvariant()
```

For a missing local branch, use `git switch --track origin/feature/woodland-weather-habitat`. To start fresh: `git clone --branch feature/woodland-weather-habitat https://github.com/ilamgumaran/simpli-home-tools.git`, then enter the checkout. Verify the table's runtime revision and portable checksum before local edits.

For an instant portable install, open `tools/little-orbit/Little Orbit.html` in Edge, Chrome or Firefox; no Node install is needed. For the hosted Ally display, update the complete runtime through the established local workflow, preserving profiles and customized config. Add `habitat-weather.js` and `habitat-community.js` and retain the matching `index.html`, `style.css`, `config.js`, `characters.js`, `world-layers.js`, `app.js`, `display-settings.js`, `time-climber.js`, `time-climber-ii.js`, `woodland-art.js`, `woodland-time.js`, `woodland-immersive.js` and `server.cjs`. Restart with the launcher that owns the active display directory/profile.

Cycle **Theme** to **Green House 1**. It always fills the screen; Woodland's Full landscape/Dashboard setting applies to Woodland. Set the weather city and temperature unit in Settings. The new-profile default remains Time Climber II and existing preferences are preserved. Check the actual CSS viewport after Windows scaling. Live weather needs connectivity; cached weather is labeled and time/facts work offline.

## Compact physical acceptance

- Record runtime revision, portable checksum, hosted/portable form, browser/version, actual CSS viewport, DPR and Windows scaling. Check 12/24-hour mode, current digits and DD plaque at minute, hour and day rollover, including `09:59→10:00`.
- In Green House 1, inspect tiny camp characters, supported infant care, supervised play/sleep, shelter-line grip, basket gathering and the spoon meeting the pot. Review each daily routine, including dusk remembrance. Switch back to Woodland to check its larger cast, group travel, protected climb/recovery/descent and engineering activities.
- Check true fullscreen fit, viewport-edge art, readable time/date/weather and controls at the device's actual CSS size and scaling. Review normal and low-power/native cadence during sustained use.
- Exercise reduced motion, Still camera, companions off, hidden tab, Settings, screen rest, resume/sleep and offline portable behavior. Verify time stays current after each pause/resume.
- In Green House 1, inspect clear hot/cold conditions, rain/snow and night, Celsius/Fahrenheit labels and cached/unavailable states. Check the tiny shelter, food/cooking, teaching, supported infant care, supervised Sprout play and remembrance of Fern. Companions off should retain the camp and weather while hiding people. Confirm weather and community layers clear when returning to Woodland.
- Report Ally and Vanadium separately. The 7c11d81 focused Firefox outcomes and the current unvalidated candidate are recorded in the [weather-habitat handoff](../../../sessions/2026-10-10-weather-habitat/008-cloud-motion-results.md). Physical Ally and Vanadium acceptance require device evidence.

Keep private screenshots, profiles and device paths out of Git. Report reproduction steps and distinguish display or clock failures from art feedback. No merge, release or cloud installation was performed; local device testing may proceed while browser cadence acceptance remains pending.
