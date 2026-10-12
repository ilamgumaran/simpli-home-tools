# Green House 1 — cloud install-ready handoff

- Message ID: `2026-10-10-weather-habitat/003`
- Date: `2026-10-12` (UTC)
- From: cloud implementation/integration session
- To: local Ally implementation/testing session
- Status: implementation integrated; final cloud browser validation pending
- Branch: `feature/woodland-weather-habitat`, based on `feature/woodland-immersive-story` / PR #9
- Runtime candidate revision: `93d90a9191976f0e1b13532bf4a04832f61d2ce2` (final checks pending)
- Canonical app: `tools/little-orbit/`
- Portable file: `tools/little-orbit/Little Orbit.html`
- Portable SHA-256: `a86f416a978a5669fed753134511c1362f39392b9e5f2daac29ec852a2daa8b2`

## Included scope

The new `greenhouse1` theme, displayed as Green House 1, reuses the existing Open-Meteo response/cache for condition lighting, bounded rain/snow and a Celsius/Fahrenheit thermometer. Its adapter makes an immutable snapshot and performs no network requests. Tiny antlike camp people share a tent, food and play area. Unknown/loading, cached/offline and live states retain truthful labels. Existing reduced-motion, hidden-page, Settings, screen-rest and Still-camera behavior applies; companion-off hides characters while weather continues. The existing global clock weather panel remains available in every theme.

The first community-life slice adds recurring authored routines: Aster cares for Pebble, an infant shown swaddled and supported by a caregiver; Sage performs shelter, forage, cook, teach and remembrance routines; Sprout joins safe, supervised play and sleep. From 17:00–20:00, memorial flowers at dusk honor Fern; no ancestor character appears. There is no fast aging, infant replacement, claimed real ecosystem, or persistent lineage/resource simulation. Woodland retains its larger human-scale cast and engineering terrain/time scene.

See [weather design and acceptance](../../tools/little-orbit/design/WEATHER-HABITAT.md) and [community scope](../../tools/little-orbit/design/COMMUNITY-HABITAT.md). This message records implementation scope, not passed acceptance.

## Cloud validation record — pending

Complete after validation. Report each browser separately, with hosted and portable results as applicable:

| Browser/version | Form | Viewport CSS px | DPR | Unit/condition/story | Cadence and observed result |
| --- | --- | --- | --- | --- | --- |
| Chrome | pending | pending | pending | pending | pending |
| Edge | pending | pending | pending | pending | pending |
| Firefox | pending | pending | pending | pending | pending |

Record layout at 4 viewports (854×480, 1280×720, 1920×1080, 390×844) and DPR 1/2; weather conditions and cache/loading/offline truthfulness in Celsius and Fahrenheit; time/date and thermometer fit; rain/snow bounds; hidden/Settings/screen-rest/reduced-motion/Still-camera/companion-off behavior; recurring community routines, supported infant poses, supervised Sprout play/sleep and dusk memorial flowers honoring Fern from 17:00–20:00; confirm no ancestor character appears; and measured cadence. Identify any untested combinations rather than implying full coverage. Cadence tracks SVG geometry updates using real animation frames/timers and 2.1-second samples after fonts and initial paint settle. It does not measure every frame's physical presentation, startup or sustained device operation. Physical Ally and Vanadium acceptance remain separate and pending.

### Earlier failures and diagnostic limits

On earlier runtime `80e3f41`, Chrome's portable valid-cache restoration check timed out once; five focused portable cache probes and subsequent complete Chrome phases passed unchanged. Firefox initially missed portable Woodland low-power cadence (29.02 geometry updates/s, p95 52 ms against a 46 ms limit, max gap 96 ms). Eight focused hosted/portable runs passed, but a complete rerun missed hosted Woodland DPR2 normal cadence (51.40 updates/s, p95 35 ms against 31 ms, max gap 38 ms); a separate rain check also missed normal cadence (52.83 updates/s, p95 37 ms, max gap 61 ms). Functional community and portable offline checks passed separately. These partial results did not satisfy the complete suite.

Native Firefox profiling reproduced the DPR2 pacing issue despite geometry callbacks taking at most 5 ms. The compositor reported 55.5 ms frame time and 51.0 ms presentation latency in that sample; an earlier DPR1 sample reached 98.9 ms. This motivated the new revision: rain now has its own SVG paint layer, and fixed character scales/diagnostics skip unchanged writes. Final results for the revised runtime belong above. Passing short geometry samples does not prove smooth sustained presentation.

## Install and return results

Fetch `feature/woodland-weather-habitat` and compare the tested revision and portable checksum above before installation. Preserve local edits and configuration. Use the existing [Woodland install handoff](../../tools/little-orbit/design/ALLY-TEST-HANDOFF.md) for the canonical runtime update procedure, then select **Theme: Green House 1**. Check weather states, both temperature units, layout, motion controls and the authored routines on the actual device. Woodland remains the larger-actor engineering terrain/time theme; its existing global weather panel remains available.

Keep `002` reserved for an initial device reply; it has not arrived in this checkout. Return the next local findings in `004-ally-to-cloud.md`: tested revision/checksum, browser and version, CSS viewport/DPR, hosted or portable form, local configuration differences, actual results and remaining issues. Do not infer physical acceptance from desktop browser evidence.
