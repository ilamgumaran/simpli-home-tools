<!-- SPDX-License-Identifier: LicenseRef-Simpli-Noncommercial-1.0 -->
# Green House 1 — weather habitat

Status: source and portable integration authored; browser acceptance pending. This weather-responsive habitat is the separate `greenhouse1` theme, displayed as **Green House 1**. Its weather, tiny antlike camp people, tent, food/play story and thermometer belong to that scene. Woodland keeps its larger human-scale cast and engineering terrain/time scene; the existing clock weather panel remains available globally. This is not a complete ecology simulation.

## Weather display

Use the existing Open-Meteo response and cache through `habitat-weather.js`; do not make extra requests. `window.DeskHabitatWeather` publishes an immutable snapshot with measured and normalized temperature, configured unit, validated condition, freshness, timestamp and place. The scene consumes this snapshot directly. The adapter must tolerate missing, invalid and stale fields. Show an honest unknown or stale caption when current conditions cannot be established; never imply cached data is current.

Green House 1 uses one weather interpretation for warm bright sun, cool muted light, rain, snow and night. Hot rain stays rainy; night suppresses the sun while retaining the scene's moon. Day/night follows the authored local-time landscape schedule (daylight 07:00–18:59), rather than calculated sunrise/sunset. Bounded rain/snow particles and gentle weather tints use the main scene cadence (30 fps low power; native animation frames in normal mode). Slow wind, clouds and water have a separate 30 fps cadence to reduce rendering work. Tiny antlike camp people tend a tent, food and play area; a small thermometer beside the habitat shows the current temperature in the configured unit. Use a visual scale from −20°C to 50°C, convert its labels for Fahrenheit when selected, clamp only the art marker at its ends, and show the truthful numeric value even outside that range. Do not add a second temperature-control setting.

## Habitat choreography

Rain/snow particles and weather tints follow the existing scene lifecycle. They pause with hidden documents, Settings and screen rest; reduced motion freezes particles and Still camera suppresses camera drift. Companion-off behavior remains consistent with the current scene contract. Weather changes Green House 1 lighting and atmosphere without covering HH:MM, date, controls or the temperature label. Woodland retains its existing larger cast and engineering terrain, and its original scene does not gain this weather illustration.

Family care, food preparation, infant care, supervised child play and remembrance are documented in the separate authored [Green House 1 Community Habitat](COMMUNITY-HABITAT.md) slice. At dusk (17:00–20:00), memorial flowers honor Fern; no ancestor character appears. Neither design claims conserved resources, a real ecosystem, persistent lineage or simulated demographic change.

The scene uses five separate SVG paint layers for scenery, weather, detailed clock/date art, moving characters/props and gentle full-screen light. Each follows the same camera transform. Clock art updates on time/material/layout changes; rain, character motion and light changes no longer invalidate that detailed art or force precipitation to repaint the forest. One shared set of paint definitions supplies the layers, and characters remain above digits with painted hit testing. Native Chrome traces identified raster work as the remaining high-density motion bottleneck; the layer split preserves the art, poses and frame-rate gates. Final browser results belong in the session handoff below.

## Acceptance plan

- Reuse cached/mock Open-Meteo data with no additional request. Verify immutable normalized snapshots, unit conversion, unknown/invalid/stale captions, and cache refresh boundaries.
- Cover hot sun, cool muted conditions, rain, snow and night/precipitation combinations. Check no hot sun at night and a truthful current temperature in both units, including below/above the art scale.
- Inspect scene/browser viewport and portable fit; current HH:MM and labeled date stay authoritative through weather changes and minute/hour/day boundaries.
- Check rain/snow limits and pause/resume in hidden tabs, Settings, screen rest, reduced motion, Still camera, companion-off and offline/stale states. Weather may animate only within existing lifecycle controls.
- Record Chrome, Edge and Firefox versions; hosted/portable form; viewport and DPR; unit; condition/cache fixture; motion/lifecycle state; measured cadence; and observed result in [session message 003](../../../sessions/2026-10-10-weather-habitat/003-cloud-install-ready.md). Checks remain pending until run and reviewed.
