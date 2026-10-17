# Green House 1: Ally installation and acceptance

Prepared 2026-10-17. Green House 1 is the weather and tiny-community theme; Woodland retains its larger characters and terrain-engineering activities. Read the [current candidate results](../../../sessions/2026-10-10-weather-habitat/013-cloud-child-motion-results.md) first. Candidate application source is `b0c364743c355749185505491c64e8b7a15c033f`, with portable SHA-256 `a5d68f51ea0506650ecad516e0d7d7315a4701794b64777b3cfcf64c546f46b8`. The portable build and full Chrome/Firefox/Edge suites pass, including cadence and offline checks. Session 011's focused Sage-contact/browser results apply to its older candidate. Sustained and physical Ally/Vanadium checks remain unrun, and earlier intermittent stalls on `c827dba9` remain unexplained. Return findings as `004-ally-to-cloud.md` in the weather-habitat session thread. The [earlier fullscreen handoff](../../../sessions/2026-10-05-immersive-woodland/003-cloud-scene-ready.md) remains history.

## Current candidate — browser suites pass; device validation pending

| Item | Value |
| --- | --- |
| Repository | `ilamgumaran/simpli-home-tools` |
| Branch | `feature/woodland-weather-habitat` |
| Pull request | [PR #11](https://github.com/ilamgumaran/simpli-home-tools/pull/11), draft; sustained/device acceptance pending |
| Candidate runtime revision | `b0c364743c355749185505491c64e8b7a15c033f` |
| Canonical app | `tools/little-orbit/` |
| Portable SHA-256 | `a5d68f51ea0506650ecad516e0d7d7315a4701794b64777b3cfcf64c546f46b8` |
| Validation status | **FULL CHROME/FIREFOX/EDGE SUITES PASS** — sustained use and physical acceptance pending; earlier intermittent stalls remain unexplained |

Candidate `b0c3647` retains the Green House 1 path and Sage's constrained routine contacts. It adds Sprout's 0.7-second sleep/play blend at actual shared 07:00/19:00 daylight, makes the stick follow the blended hand while preserving its authored grip-to-tip offset, keeps feet supported, and uses epoch-based breathing continuous across midnight and DST. Woodland daylight hours are shared runtime metadata; standalone community sampling defaults to 06:00/20:00, with no new user setting. The portable build and full Chrome/Firefox/Edge suites pass, including cadence and offline checks. Session 011 records the earlier Sage-contact browser evidence only; the [current handoff](../../../sessions/2026-10-10-weather-habitat/013-cloud-child-motion-results.md), [ownership record](../../../sessions/2026-10-10-weather-habitat/012-cloud-child-motion-ownership.md), and historical [session 010](../../../sessions/2026-10-10-weather-habitat/010-cloud-clock-rendering-results.md) carry separate evidence. Community routines recur from local time; persistent ecology and demographic changes remain future work.

## Install while preserving the local display

In PowerShell, preserve local edits first. Keep the established Edge profile, launchers, browser settings and intentionally customized site configuration. From the repository root:

```powershell
git status --short
git fetch origin refs/heads/feature/woodland-weather-habitat:refs/remotes/origin/feature/woodland-weather-habitat
git switch feature/woodland-weather-habitat
git pull --ff-only origin feature/woodland-weather-habitat
$runtimeRevision = 'b0c364743c355749185505491c64e8b7a15c033f'
git merge-base --is-ancestor $runtimeRevision HEAD
if ($LASTEXITCODE -ne 0) { throw "Tested runtime revision $runtimeRevision is not an ancestor of HEAD." }
$portableHash = (Get-FileHash -LiteralPath 'tools/little-orbit/Little Orbit.html' -Algorithm SHA256).Hash.ToLowerInvariant()
if ($portableHash -ne 'a5d68f51ea0506650ecad516e0d7d7315a4701794b64777b3cfcf64c546f46b8') { throw "Portable clock checksum does not match the current candidate." }
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
- Report Ally and Vanadium separately with the exact revision and checksum. Current cloud browser suites passed; see the local device reply for distinct Windows results. Do not substitute session 011's earlier Sage-contact evidence. Earlier intermittent stalls remain unexplained. Physical results do not replace cloud outcomes. Current evidence is in [session 013](../../../sessions/2026-10-10-weather-habitat/013-cloud-child-motion-results.md), scope in [012](../../../sessions/2026-10-10-weather-habitat/012-cloud-child-motion-ownership.md), and historical browser results in [011](../../../sessions/2026-10-10-weather-habitat/011-cloud-camp-contact-motion.md) and [010](../../../sessions/2026-10-10-weather-habitat/010-cloud-clock-rendering-results.md). Physical Ally and Vanadium acceptance require device evidence.

Keep private screenshots, profiles and device paths out of Git. Report reproduction steps and distinguish display or clock failures from art feedback. No merge, release or device installation was performed. Physical Ally and Vanadium acceptance remain unrun; PR #11 remains draft while sustained and device acceptance is open.

## Local Ally installation — 2026-10-17

[The device reply](../../../sessions/2026-10-10-weather-habitat/004-ally-to-cloud.md) records installation of the matching artifact and Green House 1 selection, passing local Edge/functional checks, and two Windows Firefox normal-mode cadence failures. Cloud and local evidence remain distinct; sustained/native/Vanadium acceptance is pending. No security setting was changed.
