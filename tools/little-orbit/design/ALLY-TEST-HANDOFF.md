# Woodland build: Ally installation and testing handoff

Prepared 2026-10-05. Status: source, plans and portable build published for local device testing. Physical Ally testing has not been performed in the cloud session.

## Version to pull

| Item | Value |
| --- | --- |
| Repository | `ilamgumaran/simpli-home-tools` |
| Branch | `feature/living-woodland-time` |
| Pull request | [PR #3](https://github.com/ilamgumaran/simpli-home-tools/pull/3) |
| Tested runtime revision | `5293f997b37ce17fcbe7ee39a157ebf885e4e496` |
| Canonical application | `tools/little-orbit/` |
| Ready-to-open build | `tools/little-orbit/Little Orbit.html` |
| Portable SHA-256 | `4febc9c95e1ba5243d59626706defa9e200e47e80af05d9a634170457cbd6f9c` |

The branch contains the complete character foundation and Woodland implementation, even while its parent PRs remain unmerged. Do not pull the documentation-only `main` expecting this version. Follow-up handoff commits do not alter the tested runtime; the checksum identifies its portable artifact. If the branch later advances with runtime changes, test and record that new revision separately.

Published contents include browser source modules, shared character/world definitions, regenerated licensed single-file HTML, Windows helpers, automated tests, product documentation and four specialist layer plans. Installed dependencies, browser profiles and private device files are excluded.

## Pull and verify

Inspect `git status --short` and preserve local edits first. In the repository root, use PowerShell:

```powershell
git fetch origin refs/heads/feature/living-woodland-time:refs/remotes/origin/feature/living-woodland-time
git switch feature/living-woodland-time
git pull --ff-only origin feature/living-woodland-time
git rev-parse HEAD
(Get-FileHash -LiteralPath 'tools/little-orbit/Little Orbit.html' -Algorithm SHA256).Hash.ToLowerInvariant()
```

If this branch is not present locally, replace the switch command with `git switch --track origin/feature/living-woodland-time`. For a fresh checkout, use `git clone --branch feature/living-woodland-time https://github.com/ilamgumaran/simpli-home-tools.git` and enter the cloned directory.

The checksum should match the table when testing this runtime. Open `Little Orbit.html` directly in Edge, Chrome or Firefox: the portable clock needs no Node installation or dependency download. Weather needs internet; time and bundled facts remain available offline.

## Update the existing Ally display

Read [OWNER-PROMPTS.md](OWNER-PROMPTS.md), [configuration](../CONFIGURATION.md), and the [living-world plan](LIVING-WORLDS.md) before updating a local runtime mirror. Preserve its launchers, `.edge-clock` profile, browser settings and intentionally customized site configuration. Use the other session's established update workflow; record local configuration differences when comparing checksums.

The hosted display needs the complete runtime: `index.html`, `style.css`, `config.js`, `characters.js`, `world-layers.js`, `app.js`, `display-settings.js`, `time-climber.js`, `time-climber-ii.js`, `woodland-time.js`, and `server.cjs`. Copying only `app.js` or an earlier portable file cannot install this version. Source and generated HTML are maintained together in the canonical directory.

With Node 22 or later available, launch the checkout using `windows/Start Ally Display.cmd`. If this same clock directory already supplies the active display, use `windows/Restart Clock.cmd`. The restart helper targets that directory's Edge kiosk profile and Node server, preserves the profile, and does not change OS power settings. An installation elsewhere needs its matching local launcher; do not assume this helper controls it. Alt+F4 closes the kiosk.

Select **Theme: Woodland** after starting. New-profile defaults still choose Time Climber II, and existing preferences remain selected. Settings → Display & character offers the Handheld preset and text sizing; layout uses the actual browser viewport, including Windows scaling.

Contributor rebuild/checks, when needed, run inside `tools/little-orbit/`:

```powershell
npm ci
npx playwright install chromium firefox
npm run build
npm test
```

The portable build is already committed. A fresh unchanged rebuild should produce no diff in `Little Orbit.html`. Contributor checks are not prerequisites for opening that file.

## Physical Ally checks and feedback

- Check header and terrain HH:MM agree with device time; test 12/24-hour mode, a real minute rollover and an hourly place change.
- Check time/date/weather/facts/controls fit at the actual viewport and Windows scaling, using Handheld and enlarged text. Cloud checks included 854×480, 1280×720, 1920×1080 and 390×844; record the actual browser viewport.
- Inspect gathering, shelter, filtering, foraging, climbing, cooking, crossing, rest and teaching. Check harness attachment, stationary recovery and readable digits during the trail-peg handoff.
- Test touch, Settings, theme persistence, fullscreen, touch-lock hold-to-unlock, reduced motion, companions off, low power, screen-care glides, night dimming, optional :59 black break, tab hiding and resume from sleep. A configured black break intentionally blanks the display.
- Open the portable file offline: time/facts should work with a clear weather fallback. Test Edge, Chrome and Firefox where installed. Vanadium needs a separate GrapheneOS device.
- Observe a longer run for memory/power behavior and readability. Cloud checks do not establish physical battery use, screen wear or long-duration device behavior.

Record results in a follow-up Git document or issue: Git revision, artifact checksum, browser/version, viewport, display scaling, relevant settings, pass/fail findings and reproduction steps. Keep private screenshots, browser profiles and device-specific paths out of Git. Distinguish art feedback from clock failures.

## What was done and validated

The fifth theme combines central characters, including Sprout, with shared landscape/action/story/philosophy recipes. Eight hourly woodland places and twelve minute activities accompany current-time trail numerals. Six daily episodes cover solitude, family, mentoring, shared repair, urgency and reciprocity, with a quiet 18:00 chapter.

Complete hosted and offline portable suites passed in Chrome for Testing 151.0.7922.34, Edge 154.0.4258.53 and Playwright Firefox 153 on Linux. Model checks covered all 1,440 minute values; browser checks covered calendar/DST boundaries, header agreement, activity props, recovery/assistance, cast overrides, compact readability and pause/quiet lifecycle. The portable build was regenerated and verified against committed source before this handoff.

Full contact/rope dynamics, conserved resources, hunting mechanics and persistent generations remain planned. Industrial, weaving, farming, railway and ant-life scenes have detailed plans but no renderer. This handoff authorizes installation/testing of the built clock, not automatic implementation or merging of those proposals.

## Opening prompt for the other session

> Pull `feature/living-woodland-time` from `ilamgumaran/simpli-home-tools`, then read `AGENTS.md` and `tools/little-orbit/design/ALLY-TEST-HANDOFF.md`. Install the ready-built Woodland version into our established Ally display workflow, preserving local profiles, settings and launchers. Verify the runtime revision/checksum in the handoff, select Theme: Woodland, test on the actual Ally, and record the exact revision, viewport, browser and findings in Git. Source and portable HTML are built and published in PR #3. Do not assume main contains them, or merge/release PRs as part of device testing.
