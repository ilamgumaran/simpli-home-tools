# Green House 1: Ally installation and acceptance

Prepared 2026-10-16. Green House 1 is the weather and tiny-community theme; Woodland retains its larger characters and terrain-engineering activities. Read the [current candidate handoff](../../../sessions/2026-10-10-weather-habitat/011-cloud-camp-contact-motion.md) first. Candidate application source is `58ac16a8da1b13fc4b10fec0e78f69ca7bf54227`, with portable SHA-256 `87dc552b999c7852b717fe041c92e4dfd69f61832beb73dbca30fbee38a726f3`. The focused Sage-contact regression passes in Chrome, Firefox and Edge hosted/portable × DPR 1/2 at four viewports; full suites, cadence gates and offline portable checks pass in all three browsers. Current cadence gates pass; earlier intermittent stalls on `c827dba9` remain unexplained. Physical Ally/Vanadium checks are unrun. Return findings as `004-ally-to-cloud.md` in the weather-habitat session thread. The [earlier fullscreen handoff](../../../sessions/2026-10-05-immersive-woodland/003-cloud-scene-ready.md) remains history.

## Current candidate — browser suites pass; device testing pending

| Item | Value |
| --- | --- |
| Repository | `ilamgumaran/simpli-home-tools` |
| Branch | `feature/woodland-weather-habitat` |
| Pull request | [PR #11](https://github.com/ilamgumaran/simpli-home-tools/pull/11), draft; browser acceptance incomplete |
| Candidate runtime revision | `58ac16a8da1b13fc4b10fec0e78f69ca7bf54227` |
| Canonical app | `tools/little-orbit/` |
| Portable SHA-256 | `87dc552b999c7852b717fe041c92e4dfd69f61832beb73dbca30fbee38a726f3` |
| Validation status | **BROWSER SUITES PASS IN CHROME/FIREFOX/EDGE** — sustained and physical acceptance unrun; earlier intermittent stalls remain unexplained |

This branch advances PR #9 with a separate sixth theme. Candidate `58ac16a8` retains the lean Green House 1 path, CSS light surface and reduced-motion handling, and blends Sage's constrained task contacts across routine boundaries. The focused painted-contact regression passes in Chrome, Firefox and Edge hosted/portable × DPR 1/2 at four viewports. Full suites, cadence gates and offline portable checks pass in all three browsers. The 16 controlled pixel comparisons on predecessor `f0aaaecf` cover the CSS-quad component, not the whole current candidate. Current full runs pass all cadence gates; earlier intermittent stalls on `c827dba9` remain unexplained. See the [weather design](WEATHER-HABITAT.md), [community design](COMMUNITY-HABITAT.md), current [candidate handoff](../../../sessions/2026-10-10-weather-habitat/011-cloud-camp-contact-motion.md) and historical [session 010](../../../sessions/2026-10-10-weather-habitat/010-cloud-clock-rendering-results.md). Community routines follow local time and recur with the same family; persistent ecology and demographic changes remain future work.

## Install while preserving the local display

In PowerShell, preserve local edits first. Keep the established Edge profile, launchers, browser settings and intentionally customized site configuration. From the repository root:

```powershell
git status --short
git fetch origin refs/heads/feature/woodland-weather-habitat:refs/remotes/origin/feature/woodland-weather-habitat
git switch feature/woodland-weather-habitat
git pull --ff-only origin feature/woodland-weather-habitat
$runtimeRevision = '58ac16a8da1b13fc4b10fec0e78f69ca7bf54227'
git merge-base --is-ancestor $runtimeRevision HEAD
if ($LASTEXITCODE -ne 0) { throw "Tested runtime revision $runtimeRevision is not an ancestor of HEAD." }
$portableHash = (Get-FileHash -LiteralPath 'tools/little-orbit/Little Orbit.html' -Algorithm SHA256).Hash.ToLowerInvariant()
if ($portableHash -ne '87dc552b999c7852b717fe041c92e4dfd69f61832beb73dbca30fbee38a726f3') { throw "Portable clock checksum does not match the tested runtime." }
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
- Report Ally and Vanadium separately. The focused Sage-contact regression passes in Chrome, Firefox and Edge; full suites, cadence gates and offline portable checks pass in all three browsers. Earlier intermittent stalls remain unexplained. Physical results do not replace those cloud outcomes. Current evidence is in the [weather-habitat handoff](../../../sessions/2026-10-10-weather-habitat/011-cloud-camp-contact-motion.md); historical browser results are in [session 010](../../../sessions/2026-10-10-weather-habitat/010-cloud-clock-rendering-results.md). Physical Ally and Vanadium acceptance require device evidence.

Keep private screenshots, profiles and device paths out of Git. Report reproduction steps and distinguish display or clock failures from art feedback. No merge, release or device installation was performed. Physical Ally and Vanadium acceptance remain unrun; PR #11 remains draft while sustained and device acceptance is open.
