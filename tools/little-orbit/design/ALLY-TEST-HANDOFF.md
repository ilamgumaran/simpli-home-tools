# Full-screen Woodland: Ally installation and acceptance

Prepared 2026-10-10. Full-screen Woodland source and portable build are cloud verified and published for device testing. Physical Ally and Vanadium acceptance remain pending. Read the [cloud scene handoff](../../../sessions/2026-10-05-immersive-woodland/003-cloud-scene-ready.md) first. Return device findings as `004-ally-scene-results.md` in that session thread. The earlier [organic-motion handoff](../../../sessions/2026-10-05-organic-motion/005-cloud-motion-ready.md) is history.

## Version to install

| Item | Value |
| --- | --- |
| Repository | `ilamgumaran/simpli-home-tools` |
| Branch | `feature/woodland-immersive-story` |
| Pull request | [PR #9](https://github.com/ilamgumaran/simpli-home-tools/pull/9) |
| Current runtime revision | `47ea30e35eb666e9979aefd7cf18ecf0b9b16b41` |
| Canonical app | `tools/little-orbit/` |
| Portable SHA-256 | `2a67a11ebb838e75b574339fb9fa4557892d987595740e7bdf44909fad2efe64` |

This branch advances the [PR #8 organic-motion baseline](../../../sessions/2026-10-05-organic-motion/005-cloud-motion-ready.md) with the immersive scene. Fetch this branch, not `main`. The runtime revision identifies the tested source freeze; later documentation commits may advance HEAD while leaving that runtime and artifact unchanged. Verify the portable checksum and record both revisions. The [immersive design](IMMERSIVE-WOODLAND.md) records tested scope. The authored camp is sampled from local time: construction does not consume resources, persist as camp history or simulate full physical contact/rope dynamics.

## Install while preserving the local display

In PowerShell, preserve local edits first. Keep the established Edge profile, launchers, browser settings and intentionally customized site configuration. From the repository root:

```powershell
git status --short
git fetch origin refs/heads/feature/woodland-immersive-story:refs/remotes/origin/feature/woodland-immersive-story
git switch feature/woodland-immersive-story
git pull --ff-only origin feature/woodland-immersive-story
git rev-parse HEAD
(Get-FileHash -LiteralPath 'tools/little-orbit/Little Orbit.html' -Algorithm SHA256).Hash.ToLowerInvariant()
```

For a missing local branch, use `git switch --track origin/feature/woodland-immersive-story`. To start fresh: `git clone --branch feature/woodland-immersive-story https://github.com/ilamgumaran/simpli-home-tools.git`, then enter the checkout. Verify the table's runtime revision and portable checksum before local edits.

For an instant portable install, open `tools/little-orbit/Little Orbit.html` in Edge, Chrome or Firefox; no Node install is needed. For the hosted Ally display, update the complete runtime via the established local workflow, preserving profiles and customized config. Keep all prior runtime modules and add `woodland-art.js` and `woodland-immersive.js`; install the matching updated `index.html`, `style.css`, `config.js`, `characters.js`, `world-layers.js`, `app.js`, `display-settings.js`, `time-climber.js`, `time-climber-ii.js`, `woodland-time.js` and `server.cjs`. Restart with the launcher that owns the active display directory/profile.

Choose **Woodland → Full landscape** (the Woodland default); **Dashboard** remains available. The new-profile default theme remains **Time Climber II**, and existing theme/config preferences are preserved. Check actual browser CSS viewport after Windows scaling. Weather needs connectivity; time and bundled facts work offline.

## Compact physical acceptance

- Record runtime revision, portable checksum, hosted/portable form, browser/version, actual CSS viewport, DPR and Windows scaling. Check 12/24-hour mode, current digits and DD plaque at minute, hour and day rollover, including `09:59→10:00`.
- Inspect large cast proportions, fluent gait and group travel, arrival, climb, supported recovery, protected descent and rest. Check grips and contact for cooking, foraging, teaching, shelter/crossing work; learners stay grounded and supervised at shallow water.
- Check true fullscreen fit, viewport-edge art, readable time/date/weather and controls at the device's actual CSS size and scaling. Review normal and low-power/native cadence during sustained use.
- Exercise reduced motion, Still camera, companions off, hidden tab, Settings, screen rest, resume/sleep and offline portable behavior. Verify time stays current after each pause/resume.
- Report Ally and Vanadium separately. Final cloud Chrome/Edge/Firefox checks and cadence measurements are recorded in [IMMERSIVE-WOODLAND.md](IMMERSIVE-WOODLAND.md); physical Ally and Vanadium acceptance require their own device evidence.

Keep private screenshots, profiles and device paths out of Git. Report reproduction steps and distinguish display or clock failures from art feedback. No merge, release or installation is part of this handoff.
