# Green House 1 installed on the Ally

- Message ID: `2026-10-10-weather-habitat/004` (reserved device reply)
- Date: `2026-10-17` (America/New_York)
- From: local Ally installation/testing session
- To: cloud development and subsequent agents
- Status: installed and selected in Edge; functional checks passed; local Firefox normal-mode cadence failures remain
- Reply branch: `local/green-house-ally-install`
- Pulled head: `0eff181baec827d9f6f808f49f4faa13f599776a` / [draft PR #11](https://github.com/ilamgumaran/simpli-home-tools/pull/11)
- Tested runtime ancestor: `b0c364743c355749185505491c64e8b7a15c033f`
- Portable SHA-256, downloaded/rebuilt/installed: `a5d68f51ea0506650ecad516e0d7d7315a4701794b64777b3cfcf64c546f46b8`
- Cloud evidence: [013: current candidate](013-cloud-child-motion-results.md); published messages remain unchanged

## Installation and visible update

The owner explicitly requested pulling the latest code and installing the new clock. The checkout was clean; the candidate ancestry and portable checksum matched the handoff. npm run build reproduced the artifact. Copied the complete matching runtime, adding habitat-weather.js and habitat-community.js, rebuilt the explicit portable ZIP, and restarted the established fullscreen Edge kiosk. The new modules return HTTP 200. The running window title is Our Desk Clock · Green House 1, InPrivate.

The local site default is now greenhouse1 so the requested new theme opens on the Ally. Existing browser overrides remain authoritative. Marietta/30064, Fahrenheit, low power, care, night dimming, hourly rest, font settings and other preferences were preserved; the local launchers, profile, power helpers and saved power state were retained. No Windows security or LSA setting was changed. Canonical config and the portable artifact retain the published Time Climber II new-profile default. Woodland and all earlier themes remain selectable.

Green House 1 adds weather-driven light, rain/snow and a side thermometer using the existing weather provider/cache, plus tiny camp routines for infant care, food, learning, play and remembrance. The current candidate blends Sprout's play/sleep state at 07:00/19:00 and keeps subtle breathing continuous across midnight/DST. Community routines are authored from local time, not persistent population/resource simulation.

## Local verification

Windows, Node 24.19.0, Edge 155.0.4283.45 and Playwright Firefox 153.0. Eight pure programs passed. All twelve browser programs passed in the Edge/Chromium run, including all 18 unchanged cadence cases. Its nine low-power cases reached at least 29.91 updates/s (largest p95 34.4 ms, largest gap 36.1 ms); nine normal cases reached at least 119.93 updates/s (largest p95 9.1 ms, largest gap 9.9 ms). This host supplies roughly 120 Hz frames in normal Edge mode.

The combined npm test attempt exited 1 in Firefox's immersive Woodland normal-mode cadence case. It measured 44.61 updates/s, p95 28 ms, maximum gap 31 ms, at hosted 854×480 DPR1. The original gate requires at least 45 updates/s, p95 at most 31 ms and maximum gap below 100 ms. This sample fails the rate requirement despite passing the gap requirements.

A sequential continuation ran the Green House weather program skipped by the abort. Provider, rain/snow, thermometer, layout, night, cache, units and location-race checks passed in hosted and portable forms. Its first rainy hosted 854×480 DPR1 normal-mode cadence case failed too: 38.94 updates/s, p95 32 ms, maximum gap 35 ms. The preceding low-power rain case passed at 29.82 updates/s with p95/max gap 35 ms. Later Firefox immersive/rain cadence cases after each abort were not run; do not infer results for those forms/densities. No failed benchmark was retried and no threshold, sample window or warmup was changed.

A further sequential continuation completed Firefox's community program: all fourteen result groups passed, covering hosted/portable × DPR1/2, four viewports, painted Sage contacts and tool/bone/ground constraints, supported Pebble care, Sprout eye/stick/limb transitions at daylight boundaries, epoch continuity at midnight/DST, and immediate reduced-motion handling. Standalone offline fallback checks passed separately in both Edge and Firefox. The full local npm test result remains **red**, rather than inheriting the cloud's all-green result. Cloud Linux and local Windows evidence are distinct; the cause of the local normal-mode slowdown is not established.

Browser probes ran sequentially, without additional preview/browser builds competing with cadence measurements. The installed kiosk is the device's normal background workload. The installer briefly restarted it during early Firefox non-cadence checks; it was running for the later Firefox samples. Raw logs and private captures stay out of Git.

## Installed app smoke and visual review

A separate fresh Edge context visited the installed loopback app after the suites: greenhouse1, Fahrenheit, lowPower/care/night/rest all true; current time 03:30 PM on October 17; live clear weather and thermometer both 64°F. At a controlled 854×480 CSS viewport the page also measured 854×480, with no JS errors or scrolling. A 20-second camp-geometry observation recorded 602 mutation updates and a largest observed gap of 35.3 ms. This is a short DOM-motion smoke check, not native presentation, sustained reliability or a power/burn-in measurement. It did not read or replace the kiosk's saved browser profile.

Private controlled portable previews covered clear daytime, rainy portrait at 390×844, and dusk at +350 ms through Sprout's blend. The page fit each viewport with no JS errors. The large current-time numerals remain readable, the side thermometer reports the configured unit, and the small camp stays beneath the clock. Tiny people are intentional for this theme; Woodland retains its larger cast. The portrait story caption has cramped wrapping/low contrast over the scenery and is worth revisiting. This is browser-rendered visual evidence; native kiosk CSS viewport/DPR/Windows scaling and touchscreen behavior were not measured in this run.

## Milestones and next actions

| Milestone | Outcome |
| --- | --- |
| Latest candidate pulled; artifact/ancestry verified | Complete |
| Complete runtime, ZIP and fullscreen Edge install | Complete; Green House 1 selected |
| Local pure and Edge browser suites | Passed |
| Firefox functional/weather/community/offline checks | Passed in the full run or documented continuations |
| Firefox normal-mode performance | Two failures above; later cadence cases remain unrun |
| Physical touch/scaling, sustained power/heat/stalls, Vanadium | Pending |

Next agent: profile the Windows Firefox normal-mode slowdown against these exact cases, retain the existing acceptance gates, and report new evidence instead of marking the full local suite green. Review caption legibility on handheld/portrait and measure physical view/touch and longer low/normal/rain operation. Earlier intermittent stalls remain unexplained; this short smoke does not resolve them. Keep PR #11 draft until its sustained/device acceptance is complete. No merge, release or additional feature implementation occurred.

Fetch this reply branch and use 014 or later for a subsequent message. Git records the handoff but does not alert a running cloud session automatically.
