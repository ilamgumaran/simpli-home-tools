# Immersive Woodland: a living camp clock

Status: implemented on the development branch; full browser suites and physical acceptance remain pending. This document records the authored immersive scene and its review targets, not a completed release or full simulation. The [living-world plan](LIVING-WORLDS.md) remains the broader recipe, and [organic motion](ORGANIC-MOTION.md) records the previous contact and pacing work.

## Presentation and compatibility

Woodland is now an edge-to-edge illustrated environment. `display.woodlandView` selects `immersive` or `dashboard`; `immersive` is the Woodland default. The previous dashboard renderer remains available, and the other themes retain their layouts. The initial theme for a new profile remains Time Climber II; existing theme, character and display preferences are preserved.

`woodland-immersive.js` is separate from the dashboard composition but uses the same central characters, clock sample, story definitions, gear, anatomical rig and lifecycle rules. It retains browser SVG and the self-contained portable build. Larger original artwork, readable materials and layered depth provide image quality without external images or fonts.

[Original vector preview](immersive-woodland-preview.svg) shows a synthetic 1280×720 cooking scene at 10:08 on October 5. It is a fixed illustration for review; the application adds weather, controls, storytelling and live motion. The preview retains the project's attribution and noncommercial license.

## Layers and ownership

| Layer | Concrete responsibility | Review requirement |
| --- | --- | --- |
| Clock and numeral geometry | One local date supplies all current HH:MM paths, header time and period | No animation may delay the current time or show old/future numeral geometry |
| Material choreography | Water/sand decorate minute-one changes; timber and stone mark hourly work; camp structures give each day a chapter | Flow is tied to a current numeral edge or source/receiver, with correct digits visible throughout |
| Landscape | Full-viewport woods, layered hills, stream, trail, working clearing and supported climbing sites | Natural depth, readable timber/stone, no stretched figures or scenery, useful resources near their actions |
| Central cast and gear | Shared adults/learner, role-appropriate carried kit and contact rigs | Lead adult visibly about 80–160 CSS pixels high in fullscreen; young proportions and required protection preserved |
| Camp activity | Practical gathering, filtering, cooking, shelter/crossing repair, climbing and teaching | Hands/tools/resources meet; results look like the named task; children remain grounded and supervised near water |
| Story and meaning | Daily social episode, family/solo/help choices and a realization/rest beat | Show care through behavior, including shared work and rest, rather than only a caption |
| Atmosphere and camera | Slow wind, water and clouds; gentle composition movement including clock overlays | All movement stays bounded and readable; minute placement varies without hiding controls or time |
| Accessibility and lifecycle | Reduced motion, companion toggle, settings, visibility, screen rest and low-power pacing | Reduced motion overrides decorative movement; pause/resume reconstructs the current scene without replay |

All character body artwork remains in the shared library, including ten added activity poses and an expedition kit. The scene owns locations, materials and choreography. Camp, tent and crossing construction increments monotonically as the minute advances within an hourly chapter. This state is sampled from time, not saved as user construction history; another chapter or a clock change reconstructs its authored snapshot.

## Time becomes material

Current minute-one work includes river-carried leaves and buoyant timber, a stone cart at the bank, and a raked sandbox whose canonical path matches the current ones digit. Sources and receivers connect the flow to the work area. At the actual minute boundary, all four complete canonical HH:MM digits change immediately. Material flow decorates the current paths without waiting for a character to finish. Multi-digit boundaries, including `09:59→10:00`, follow the same rule.

The hour digits use timber/stone material with support posts. A distinct material day plaque shows DD, alongside the independently labeled date. Hourly chapters select another part of the woodland and its authored construction sequence; daily episodes vary the family/camp story. These are miniature transitions, not claims that a person builds a camp in a real minute or that mountains grow each hour. Persistent construction, harvested resources and inventories are deferred.

The accessible text clock stays synchronized with the large landscape numerals. Date and weather float over the artwork; Daily thought opens the learning panel. Quiet observation is a legitimate action: the time stays correct when the traveler stops to watch water or help a learner. Reconstruction after sleep, DST, midnight or a manual clock jump samples current local time directly.

## Camp, family and fatigue

Twelve work activities give the clearing a small coherent cast: adults survey, gather, filter water, forage, climb, tend the fire, cook, repair and teach. Central poses and carried food support practical work and family interactions. The connected shallow bank provides supervised sand play, water-edge activity or ankle-deep wading; children do not enter the water at night. Existing six daily episodes allow solitude, family, mentoring, shared repair, urgency and reciprocity.

The lead walks to a worksite before climbing begins. Climbing has three work bouts with four seconds of supported recovery in each, deadline-only optional assistance and protected descent. Followers also walk along their authored routes; their positions are not independently clamped away from limb contacts. Ambient scenery can move while an adult rests, but rest remains visibly distinct from exertion. During the daily realization, the cast pauses, notices the surroundings or another person, and shares attention. Families and learners make continuity visible without simulated births, aging or inheritance.

The philosophical thread is that people shape their surroundings for needs and ambitions, create urgency around a limited lifetime, and can choose to enjoy or share a minute. Represent that choice through a changed action. Avoid treating solitude as selfishness or making the clock chastise its viewer.

## Motion and image quality

Slow wind moves foliage, clouds drift, water flows and lighting changes. Camera motion shifts depth layers and the scene's HUD composition; the time and information move slowly within safe areas while preserving readable ordering and usable settings/touch controls. Movement is optional and does not guarantee prevention of burn-in or image retention. Existing dimming and screen-rest controls remain separate safeguards.

High definition here means proportion-preserving silhouettes, layered lighting/depth, timber bark/end grain, stone texture, water banks and visible equipment. The fullscreen cast targets 80–160 CSS pixel heights, with crisp SVG at DPR 1 and 2. Decorative texture must preserve essential numeral contrast. Reduced motion gives a complete static composition with current time updates and settled activities, overriding camera and continual atmosphere.

## Implementation phases

| Phase | Implemented scope or deferred outcome | Remaining acceptance evidence |
| --- | --- | --- |
| 1. Immersive composition | Implemented: separate fullscreen Woodland mode, Dashboard option, larger shared cast and artwork reaching the viewport edges | Full target matrix and control access; independent readable clock; settings persist |
| 2. Material and story activity | Implemented: current-ones sand/waterborne material work, timber/stone hour digits, DD plaque, time-sampled construction, twelve activities and supervised family care | Exact rollovers, tool/resource/action alignment, hour/day samples and visible rest/reflection |
| 3. Living scene movement | Implemented: wind, water, clouds, lighting and gentle camera/HUD movement with bounded drift | Full rendered motion review, bounded safe areas, pause/resume and reduced-motion override |
| 4. Image quality and performance | Implemented SVG art; compact Chrome cadence measured near 30/60 fps | Full viewport/DPR and hosted/portable browser evidence; physical acceptance |
| 5. Deeper continuity — deferred | Persistent camp construction, consumed provisions, longer fatigue/history and richer world contacts | Separate state/reset design and validation; not implied by the first immersive scene |

The activity and material system is authored choreography. Construction advances within the current chapter but does not consume conserved resources or persist across user sessions. Wider water/sand editing, metabolic fatigue and camp history remain separately scoped work.

## Acceptance targets and evidence

- **Fit and visibility:** Review 854×480 (compact Ally browser viewport), 1280×720, 1920×1080 and portrait 390×844 at DPR 1 and 2. These are CSS pixel sizes, not a promise about Windows scaling. The immersive illustration reaches all viewport edges; all four terrain digits, time/date/weather/fact and controls remain visible without page scrolling or overlap. Target a lead adult height of 80–160 CSS pixels with preserved limb proportions and visible backpack/gear; document any viewport-specific exception.
- **Clock:** Test hosted and portable forms in 12/24-hour modes; minute-one changes, all-digit changes, hour/day boundaries, DST, time jumps and resume. Every rendered frame contains the complete current HH:MM; material flow never leaves an old timestamp or obscures a distinguishing stroke.
- **Story and work:** Inspect practical work, family and solitary casts, grounded learner care near water, role gear, protected climbing/recovery and the daily realization. Check actual tool/resource alignment and meaningful transitions rather than only checking action labels.
- **Motion and accessibility:** Inspect departure/work/rest, wind/water/cloud movement, camera and minute UI placement. Hidden tabs, settings and screen rest pause movement; companion-off suppresses cast work; reduced motion suppresses camera and decorative loops. Resume shows current time and a valid current scene. Large text, controls and essential information remain usable.
- **Performance:** The current fullscreen scene measured approximately 30 fps low-power and 60 fps normal in Chrome at 854×480. This extends the earlier [organic-motion](ORGANIC-MOTION.md) cadence evidence to the enlarged scene and supports retaining browser SVG; a Canvas/native rewrite is not needed for the measured case. Full suites remain pending. Still review actual rendered changes, frame-gap distribution, long stalls and hosted/portable parity across the target viewports/DPR, recording the tested refresh rate. Change rendering technology only if profiling identifies a bottleneck that cannot be addressed through caching, bounded detail or compositing. This compact desktop measurement does not establish hardware performance.
- **Browsers and hardware:** Run the required build and hosted/portable checks on available Chrome, Edge and Firefox binaries. Record exact revisions and environments. Ally fullscreen scaling, sustained power/heat and Android/Vanadium require separate physical evidence; desktop cloud results do not establish them.

Browser checks and synthetic views support review of the artifact. Actual hardware acceptance, full physics/rope dynamics, conservation of materials and persistent generations remain separately stated work.
