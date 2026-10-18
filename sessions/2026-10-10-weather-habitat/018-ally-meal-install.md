# Connected meal update installed and restarted

- Message ID: `2026-10-10-weather-habitat/018`
- Date: `2026-10-18` (America/New_York)
- From: local Ally installation session
- To: cloud development and subsequent agents
- Status: installed in Edge; focused functional checks passed; Firefox high-density meal cadence failed
- Reply branch: `local/green-house-meal-install`
- Pulled head: `6adfa86b15142a598c7c6e10169002f70049f330`
- Runtime: `f02092b12a45d72cefe73ba68d5acd2f68932358`
- Portable SHA-256, rebuilt and installed: `046f02a9772a5060ac422b6acceee763fb29726a230df1ce1932a38611899ec6`
- Previous cloud evidence: [017](017-cloud-meal-choreography-results.md); prior local spacing install: [PR #13](https://github.com/ilamgumaran/simpli-home-tools/pull/13)

The owner requested the newest code, installation and restart. Pulled the tested meal candidate into an isolated clean branch, verified runtime ancestry, passed all nine pure programs, and reproduced the published portable checksum with npm run build. Copied the complete matching runtime, including the new habitat-meal.js, rebuilt the explicit portable ZIP and restarted the established fullscreen Edge kiosk. Its title is Our Desk Clock · Green House 1, InPrivate; index, community and meal modules return HTTP 200. The installed artifact matches the checksum above.

Green House 1 remains selected. The local city/location, Fahrenheit, low power, care, night dimming, hourly rest and display defaults were preserved. Launchers, profile directory, power helpers and saved state remain local; no security/LSA setting changed. No private screenshots, raw logs, profiles or power files were uploaded. Canonical configuration and the published portable default were not customized.

## Changed-scene validation

Windows Edge 155.0.4283.45 and Firefox 153.0 ran sequentially. Focused checks covered the changed meal/community modules and offline behavior; the complete local npm test suite was not repeated for this installation. Full cloud-suite results remain in 017 and are separate evidence.

- Edge: all four meal functional groups passed (hosted/portable × DPR1/2), all four active-meal cadence cases passed, all fourteen community result groups passed, and offline portable fallback passed. Minimum measured meal update rates were 29.98/s low power and 121.07/s normal; largest low-power p95/max gap were 34.1/35.4 ms.
- Firefox: all four meal functional groups, fourteen community result groups and offline fallback passed. Hosted 854×480 DPR1 delivery passed low/normal cadence at 29.94/48.07 updates/s, p95 34/27 ms, max gap 35/28 ms. Portable 1280×720 DPR2 low-power delivery FAILED at 22.36 updates/s, p95 49 ms and max gap 55 ms. The original low-power gate requires >=26/s and p95 <=46 ms; its maximum-gap gate is <100 ms. The subsequent normal-mode case in that target was not run after the assertion.

The focused driver continued the independent community/offline programs after that Firefox failure and ultimately exited 1; those later program results were not left unknown. No failed benchmark was retried, and no acceptance threshold or sample was relaxed. Edge is the installed kiosk browser; the Firefox limitation is unresolved local evidence, not an assertion that the cloud result is incorrect or that earlier Windows stalls are solved.

Meal functional checks observe all seven painted stages, stage/minute/hour joins, actual food/hand and spoon/pot contact, bowl transfer/table support, planted steps, infant care, family/viewport/caption clearance, deterministic jumps, DST and quiet/resume behavior. Preview/browser work did not compete with cadence measurements; the existing kiosk remained the device's normal background workload.

## Restart and smoke outcome

After tests, private browser-only previews sampled 11:08 at seconds 4, 11, 28, 40, 47, 51 and 57. All seven requested stages matched the painted camp state, with no scrolling or JS errors at 854×480 and portrait serving at 390×844. Delivery/serving previews show the bowl/stand and clear story caption. Only browser Date was mocked; the OS clock was not changed.

A separate fresh Edge context against installed loopback 4173 showed greenhouse1, Fahrenheit, lowPower/care/night/rest true, live clear weather at 50°F, current time 09:42 and the forage routine. A short three-second camp-motion smoke showed continuing updates and no JS errors; the 854×480 page matched its controlled viewport. It did not read or replace the kiosk's saved browser profile and is not a native presentation, sustained reliability or power measurement.

The meal sequence appears during 11:00–13:00 and 20:00–22:00 local time. Outside those windows the normal community routine remains visible; other family members do not yet perform eating animations. Woodland and earlier themes remain selectable.

Next: profile the Windows Firefox high-density low-power delivery case and retain the original gates; complete native viewport/DPR/touch, sustained low/normal/rain operation and Vanadium acceptance. Keep PR #11 draft. No runtime source fix, merge or release occurred here. Published messages remain unchanged; use 019 or later for the next follow-up and fetch this reply branch before continuing. Git does not automatically notify a running session.
