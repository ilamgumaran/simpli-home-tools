# Character step: planted Woodland rock contacts

Status: implemented on `feature/woodland-character-contacts`, 2026-10-05; browser verification and local deployment results are recorded in the [session reply](../../../sessions/2026-10-05-woodland-ally/003-character-contacts.md). The owner authorized the next character implementation step after reading the shared-character/activity plan. This is an authored kinematic slice, not full climbing physics.

## Scope and behavior

Woodland's rock activity uses eight authored supported stations in the foreground boulder. Each station defines a body position and named left/right hand and foot sockets in world coordinates. `world-layers.js` owns the route and protection anchor; `characters.js` supplies the reusable `climbContacts(route, progress)` solver. The scenery renders the same sockets used by the rig.

Each step moves left hand, left foot, right hand and right foot in sequence, then lifts the body. Three endpoints remain on their original terrain sockets during a limb transfer. All four stay planted through the body lift, recovery interval and terminal quiet stance. Arms/legs retain their segment lengths. Authored targets outside reach are rejected instead of silently stretching or clamping a planted contact. The load-bearing rope follows the shared harness attachment throughout.

The existing per-ascent progress/effort model still determines when to rest and when optional late assistance may appear. Recovery keeps body and endpoints still while fatigue falls. A quiet rock snapshot is a secured final station rather than a generic floating rest pose. The minute marker remains a separate trail task; it does not claim to be a supported rock climb. Time updates independently of this sequence.

Sampling is deterministic from current route progress, with no accumulated frame state. Resize, hidden-tab return, clock jumps and reduced motion reconstruct the appropriate pose without replaying missed movements. Learners remain on their existing ground route. Existing Time Climber I/II and Woodland tree artwork retain their prior pose model; this change deliberately does not claim to add terrain contact physics to every scene.

## Verification and remaining milestones

- Sample the route densely: each planted endpoint equals its authored world socket, every bone length is fixed, at least three contacts remain, and body movement is continuous.
- Compare real hosted/portable SVG limb endpoints to rendered hold positions and rope endpoint to harness after changing controlled browser time. Check supported body lifts, recovery and the final stationary state.
- Run all existing theme, viewport/font/fact, time boundary, pause, reduced-motion and portable tests in Edge and Firefox; rebuild the portable file.
- Next: contact-pinned ground walking and reachable work surfaces/tool grips, then a separately designed tree route and appropriate role. Compact character scale still needs visual refinement.
- Later: center-of-mass feasibility, collisions, rope forces/pendulum dynamics, persistent effort/resources and richer transitions between activities. Do not describe the current authored support arrangement as a dynamics or biological simulation.

No new settings or runtime modules are needed. Shared defaults, browser overrides and portable/browser compatibility remain the same.
