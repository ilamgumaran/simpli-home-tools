# Organic character motion

Status: implemented on `feature/woodland-organic-motion`, integrating cloud visual refinement with the other session’s rock contacts, walking and tool grips. Device acceptance is recorded separately in the [session thread](../../../sessions/2026-10-05-organic-motion/README.md).

## Motion and pacing

The Woodland renderer previously sampled low-power motion at about 10–12 frames per second and capped normal motion at 24. It now renders at 30 frames per second in low-power mode and follows the browser’s animation frames in normal mode. Remainder-preserving pacing avoids dropping every other eligible frame. Landscape composition and viewport measurement are cached; stable SVG markup is retained instead of replacing it on each frame.

Travel is separate from work. Crossings take 1–20 seconds according to distance in character body coordinates (50 local units per second before easing), using a quintic start and stop. Walking steps follow distance along the route instead of a fixed rhythm; the supporting foot stays planted as the body passes it. Slope adjusts foot placement; a largely vertical descent uses the protected rappel pose. The first 0.35 seconds blend from the actual previous contact rig; the last 0.45 seconds blend into the destination stance. Rig blends solve limb targets again to preserve bone lengths.

Work begins after arrival. The configured duration supplies the effort budget; configured intervals can repeat a visit within a minute. A repeat includes its return trip before work, with the previous final stance as its source. Work is bounded by the next visit and second 55; a window shorter than four seconds is skipped. Each new minute starts a chapter and arrival, so intervals longer than a minute do not postpone the new activity. The last five seconds remain quiet. Time digits update immediately from the real clock throughout travel and work.

Climbing uses supported weight shifts and smoother one-limb transfers, with squared-sine clearance at departure and landing. Required recovery occupies progress 0.34–0.50; rock hands, feet and root remain stationary while fatigue falls. Aid is allowed only near the end with at most 1.5 seconds left. Gentle head, torso and backpack follow-through fades before recovery and at work endpoints. Walking and grounded work use shared contact rigs; sticks and spoons retain exact wrist and work-target alignment.

Hidden tabs, settings, screen rest, companion-off and reduced motion stop moving frames. State is reconstructed from current time after resume rather than replaying missed work. Quiet visits have bounded wakeups rather than perpetual animation.

## Verification and limits

Pure contact tests densely sample anatomy, supported contact sets, fixed planted feet, transfer velocities, recovery and tool sockets. Timing tests span distances 0/100/1000, durations 4/12/20 and intervals 30/45/60/90/300, including repeated returns, truncated/skipped work, night and reduced motion. Browser tests retain scene geometry assertions and use work-relative times. A separate real-timer test measures actual changes to the rendered root/leg, including frame rate, 95th-percentile frame gaps and stalls, in hosted and portable forms.

Desktop Chrome, Edge and Firefox results and the exact runtime revision/checksum belong in the handoff. Their results do not establish Ally or Android/Vanadium performance. Device acceptance should watch complete walking and climbing visits plus a minute transition, rather than judging isolated screenshots.

These are authored routes and stylized effort. Specialist tree contacts, rope forces, terrain collision throughout every crossing, resource persistence and activity-specific numeral edits remain future work. Repeated construction still replays a vignette; this motion task does not implement persistent material state.
