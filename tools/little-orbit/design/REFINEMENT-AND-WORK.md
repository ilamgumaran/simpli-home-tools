# Woodland refinement and supported work

Status: implemented on `feature/woodland-refinement-contacts`, 2026-10-05; see [integration and device reply](../../../sessions/2026-10-05-woodland-refinement/002-ally-to-cloud.md).

The cloud's larger panel, proportionate characters, curved mountains, timber details and blended poses are combined with the local rock-contact, planted survey and gathering/cooking work. The two histories had diverged from 7268423; this branch preserves both histories rather than replacing either branch.

Contact scenes use a common responsive site transform for the actor, terrain holds, material, ground and tool sockets. SVG screen matrices verify real endpoint agreement after resizing; the harness rope is recovered from the rendered character transform. The travel controller accepts a site resolver so it can arrive at the enlarged supported position. Tests sample the rendered travel edge at three durations. Limb approach across the arrival edge remains an authored pose transition rather than collision or force simulation.

Shelter and bridge work now have grounded, reach-checked right-hand rigs. A mallet's local grip sits at the wrist and its working end meets the tent/deck socket. Gathering keeps a fallen stick; cooking keeps a spoon. Dense angle/sway checks reject unreachable geometry. Work and material share the site transform so resizing preserves their connection. Teaching alternates adult/learner gestures during work; quiet and reduced-motion snapshots remain still.

No new settings, modules, external assets or network calls. Existing browser preferences and all five themes remain compatible. The portable artifact is regenerated from the canonical sources.

Next milestones: specialist tree contact route and role, richer hand approach/landing choreography, supported travel feet between all sites, collision/center-of-mass and persistent resources. Physical Ally touch/scaling and extended operation remain pending; headless browser checks do not establish screen-wear prevention or battery savings.
