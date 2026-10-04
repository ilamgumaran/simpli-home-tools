# Time Climber II — Mountain of Time

Status: design proposal only, prepared 2026-10-04. Implementation is deferred until the user authorizes starting it later this week. Do not change the running clock, its saved settings, or the current themes from this document alone.

See the [shareable design preview](time-climber-ii-preview.html), [product guide](../PRODUCT.md), and [roadmap](../ROADMAP.md). Download the preview and open it in a browser; GitHub shows HTML source rather than running it.

## Experience

Our Desk Clock becomes a window onto a mountain range made of time. A tiny, clearly visible mountaineer follows trails shaped like numbers, climbs their rock faces, hangs a tent, and rests. The camera follows one digit at a time. The active digit grows as the camera approaches; completed and neighboring digits recede without becoming unreadable. The viewer can always read the full local time and date, plus weather and the daily fact.

Add this as a fourth theme, provisionally `climber2`, named **Time Climber II**. Keep Orbit, Candy Quest, and the existing Time Climber intact. Use original vector artwork and the current project license and attribution; no assets or characters copied from climbing games.

## Composition

- A compact readable time/date strip sits outside the moving camera. It always includes full time with AM/PM or 24-hour format, weekday, day, month, and year. This is the authoritative clock.
- In the landscape, minutes occupy the near, lower slopes; hours sit above them; the day occupies the highest foreground summit. Month and year form progressively more distant ridges on the horizon.
- Size, height, trail markings, and labels communicate depth. Do not rely on dimness alone: year and month must remain readable through the time/date strip.
- Weather and the daily fact stay outside the camera too, in their existing readable areas. Their large-font settings continue to apply.
- On the Ally, use the actual browser viewport (including Windows scaling), not hardware resolution. Begin with 854×480 and 1280×720. Fit without scrolling or covering the weather/fact with a character or mountain.
- On portrait screens, stack the fixed information and use one mountain scene. Reduce decoration and camera travel before reducing essential text.

The preview uses a fixed sample time and manually selected viewpoints. It is a design study, not a functioning replacement clock.

## Time and progress

The operating system's wall clock remains the source of truth. Animation never advances, delays, or invents clock values. Weather and daily facts keep their existing refresh behavior.

| Level | Meaning of progress | Natural transition |
| --- | --- | --- |
| Minute | A short two-digit trail visit, with seconds providing progress within a minute | Minute rollover; a changed digit reforms its terrain |
| Hour | A longer expedition whose total progress follows minutes through the hour | Hour rollover and continuation toward the day ridge |
| Day | Summit route whose total progress follows local wall-clock time through the day | Local midnight |
| Month | Distant journey following calendar days in the actual month | First day of the next month |
| Year | Horizon journey following elapsed calendar days in the actual year | January 1 |

All levels have stored conceptual progress, but only one character and one route are rendered in focus. Higher-level progress does not require an hour, day, or year of uninterrupted animation. The mountaineer resumes at the appropriate camp when the browser is reopened.

Proposed choreography:

1. Start on a near minute digit. Briefly show an overview so the number hierarchy is understandable.
2. Grow that digit and approach its trail from above. Walk the numeral-shaped route, collect water or food, and reach an anchor.
3. Ease into a side view for a rope climb. The tiny climber stays roughly the same on-screen size while the mountain enlarges behind it.
4. Turn gently toward the opposite side for a traverse, then pitch a suspended tent on a safe ledge.
5. At completion, pull back; the next digit becomes larger. Move from the minute route toward the hour ridge, then visit the day summit, with the month/year visible beyond.
6. Use camps and quiet pauses between visits. Later expeditions resume higher-level progress rather than repeating a complete ascent every minute.

Default design target: a minute-digit visit lasts about 8–12 seconds. A pair is explored within one minute when appropriate. An hour expedition unfolds in occasional short visits over the hour; day expeditions unfold over the day. Avoid a continuous zooming loop. Final timing should be tuned after testing on the Ally.

The scene starts from current time, even if that means the character begins partway up a route. It must not pretend the day begins whenever the page loads.

## Digit changes and continuity

- Each digit has a stable identity: minute ones/tens, hour ones/tens, day ones/tens, etc. The number value and its route geometry can change independently of this identity.
- Model every digit as a recognizable silhouette plus a route with walkable paths, climbing segments, anchors, and camping ledges. Start with hand-authored routes for 0–9, then test their readability. A numeral-shaped winding road is appropriate in top view; a corresponding rock silhouette is appropriate in side view.
- Keep the climber's progress as a normalized route position. On a rollover, transfer it to a safe matching segment of the new route. Keep its screen position continuous by adjusting the camera briefly, rather than teleporting it across the screen.
- If no safe transfer exists, attach the rope to a persistent world anchor, settle onto a ledge, then enter the new route. No falling, panic, or flashing transition.
- The time/date strip updates immediately. Terrain catches up through a short transition, targeted at 0.6–1.2 seconds. Never show old time in the authoritative strip while waiting for an animation.
- At 09:59→10:00, midnight, a new month, and a new year, coordinate changed terrain as one transition. Retain any unchanged terrain.
- Derive progress from local calendar boundaries. Account for 28/29/30/31-day months, leap years, daylight-saving changes, manual clock changes, time-zone changes, and a tab returning from sleep. Recompute safely; never simulate missed animation frames.

## Character and camera

New character: an original tiny explorer, visibly distinct from the candy-drop character. Suggested design: rounded helmet, small cream face, mint jacket, coral backpack, stick limbs, rope coil, and boot marks. Use a clear contrasting silhouette with a subtle outline, approximately 16–24 CSS pixels tall in a compact scene. Keep body detail simple enough to see from a desk; adjust contrast rather than relying on sparkle or brightness.

The camera represents a lens: a close focus on the active number, subdued distant terrain, slight depth/parallax, and a clear focal point. Avoid heavy blur, bright lens flares, spinning cameras, or fake photographic distortion that makes text harder to read.

Three viewpoints share the same logical route:

- **Trail view:** top/oblique view, numeral-shaped walking road, visible footsteps and switchbacks.
- **Cliff view:** side view, rope ascent, ledges and portaledge tent.
- **Traverse view:** opposite oblique side, bridging toward the next digit or ridge.

Use easing and restricted changes in angle. Never rotate the fixed information. Manual preview controls belong only in the design study; the actual desk clock should remain simple.

## Screen care and configuration

Continue the dark palette, low-power mode, touch lock, layout shifts, night dimming, and scheduled black breaks. Movement can reduce prolonged static content but does not guarantee prevention of burn-in; retain those existing controls.

- Animate in short visits with quiet camps; stop requesting animation frames when idle.
- Low-power mode: cap active updates around 10–12 fps; reduce camera changes and terrain detail. Reuse existing route geometry.
- Pause on hidden pages, Settings, screen breaks, disabled companion, and reduced motion. Reduced motion uses a still scene that changes only when needed.
- Pause/resume must reflect current real time and must not burst through missed moves.
- Reuse character interval/duration and existing display/font configuration. Add a single camera-motion option (Gentle / Still) only if the existing reduced-motion and low-power controls are insufficient.
- Reserve safe zones around weather, facts, controls, and the fixed time/date strip.
- Persist the chosen theme through existing settings. Do not change anyone's saved theme automatically.

## Implementation work for the authorized follow-up

1. Confirm the visual hierarchy, tiny character, and acceptable camera motion with the design preview.
2. Add `climber2` to the existing theme registry. Create a separate scene controller with the same lifecycle contract as the current climber; share reusable helpers without destabilizing the existing theme.
3. Implement a pure calendar-progress model and deterministic digit/route data for 0–9. Keep wall-clock readings separate from scene state.
4. Build the static responsive mountain layout and fixed information. Verify every digit is recognizable before adding motion.
5. Add the tiny explorer, trail walking, rope climbing, supply pickups, camp states, and safe rollover transfer.
6. Add the three gentle camera perspectives and focus scaling. Validate readable full time/date during every transition.
7. Integrate settings, pauses, screen care, and portable bundling; document any settings and asset attribution.
8. Run the checks below, publish a branch/PR update, then deploy only after implementation is authorized. Preserve the device's original launchers and power state.

## Acceptance checks

- All four themes cycle and persist; existing themes retain their appearance and controls.
- Full time/day/month/year stay readable in all perspectives and focus states. Weather and facts remain readable without scrolling at 854×480, 1280×720, 1920×1080, and portrait 390×844; include font-scale presets and browser zoom.
- Every numeral 0–9 has a recognizable mountain/trail representation, finite geometry, safe anchors, and a valid campsite.
- Exercise minute, tens-minute, hour, midnight, month-end, leap-day, and year changes with controlled browser time. Test DST and jumps forward/backward; no stale authoritative time or character teleport beyond viewport bounds.
- Test reopen, hidden-tab return, resize, reduced motion, character disable, Settings, night dimming, and black breaks. No active animation loop during quiet or paused states.
- Check that low-power visits respect the frame cap and that minute/time updates are independent of rendering rate.
- Run existing tests plus new hosted and single-file theme tests in Chromium/Edge and Firefox. Run CI on Windows, macOS, and Linux. Check touch use separately on the Ally; document Vanadium as requiring a device smoke test rather than claiming a browser test that was not run.
- Rebuild the portable HTML and ZIP; no external art/font dependency, secrets, profiles, or device power state in shared artifacts.

## Follow-up timing

The user asked to execute later this week, but no exact day/time or automatic-start authorization has been confirmed. The follow-up question is pending. Do not schedule an automatic implementation from an assumed date or interpret this design document as start approval.
