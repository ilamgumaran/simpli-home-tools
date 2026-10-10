# Living worlds: composition plan

Status: Woodland is the first implementation slice on the development branch. The other six worlds below are proposals. This document defines the larger target and its review gates; it does not claim complete physics, resource simulation, generational memory, or all seven playable themes.

The clock becomes a small work of changing landscape art. Characters shape their surroundings to meet a need, discover the cost of rushing, rest, and pass knowledge or care to someone else. The landscape itself states the current time. A viewer should understand the time before needing to understand the story.

The [shared character foundation](CHARACTERS.md) supplies reusable identities, appearance, poses and role kits. The runtime composition catalog lives in `world-layers.js`; the first scene lives in `woodland-time.js`. These boundaries should support mixing existing characters into compatible future worlds without copying character artwork into a theme.

Detailed companion plans cover [actions, equipment, recovery and time](ACTIONS-AND-TIME.md), [visual materials and numeral legibility](VISUAL-LAYERS.md), and [stories, relationships and philosophy](STORIES-AND-PHILOSOPHY.md). Their constraints are combined here rather than treated as independent animation wish lists.

## Implementation order and scope

Build Woodland first. The requested subsequent implementation order is industrial/engineering, farming, railway/station/junction, then ant life. Weaving belongs in the planned family now; its implementation slot is an additional proposed milestone, rather than silently changing that latest sequence. Planning a recipe does not automatically authorize starting every later theme.

The first Woodland slice demonstrates all layers together: readable trail numerals, an hourly woodland chapter, a practical minute activity, articulated centrally defined companions, bounded effort/recovery, a rotating social episode, and a daily pause for attention. It should be useful as an actual clock in hosted and portable forms. It can use authored snapshots instead of an open-ended simulation.

The next Woodland expansion is material-edit choreography: work visibly connects to a current numeral's trail edging, stepping stones or crossing. The initial scene must describe any activities that happen beside the numerals honestly. A foreground shelter appearing near a digit is not yet evidence that its construction made that digit.

### Visual refinement — implemented and browser-verified

The owner's review found that the scene and characters looked too small, movement felt abrupt, timber needed more fidelity, and mountains needed softer forms. The composition now fills the available panel, with corrected digit/tree/sun proportions and a larger responsive cast. All four canonical time digits and the independent time strip remain part of the composition.

Shared limb cycles and IK target blends are smoother, climbing is eased, and continuous authored travel connects worksite positions. The minute peg remains a decoration without moving the worker instantly to it. Stationary protected recovery remains a distinct hold; repeated climbing visits return by protected rappel. Timber shows bark, end grain, knots and thickness; organic curved mountain layers add depth away from essential numeral edges.

[Organic motion](ORGANIC-MOTION.md) separates body-paced 1–20 second travel from work. Each minute starts a chapter/arrival; configured intervals can repeat travel/work within that minute, ending before the next visit or second 55. Work windows under four seconds are skipped rather than losing recovery. Contact-rig blends and planted steps avoid worksite jumps. Companion-off, reduced motion, hidden tabs, open settings and screen rest suppress moving frames. This preserves bounded motion rather than an always-running scene.

Acceptance review covers compact landscape, desktop and portrait layouts, character size and reach, continuity at visit/minute boundaries, stationary recovery and quiet/reduced-motion behavior. Full hosted and offline portable suites passed in Chrome for Testing 151, Edge 154 and Playwright Firefox 153 on Linux. Added checks cover root and solved-limb continuity for durations 4/12/20 and intervals 30/45/60/90/300 seconds, preserved character proportions, fully visible actors and numeral edges, and compact/portrait layouts. Synthetic art review checked story spacing and handheld/desktop/portrait scenes; physical Ally and Vanadium review remains pending. This pass is visual choreography; contact-pinned locomotion, rope forces, conserved materials and persistent resources remain separate future milestones.

## Layer interfaces

Use stable identifiers and immutable definitions. Themes select definitions; a scene instance samples them using one clock snapshot. Do not put individual SVG figures, gear catalogs, story captions and clock arithmetic into the same theme-specific animation timeline.

| Layer | Inputs | Outputs and ownership | Validation boundary |
| --- | --- | --- | --- |
| Clock | One valid local `Date`, 12/24-hour preference | Current `HH:MM`, AM/PM where needed, calendar-day key, hour/minute keys, fractional second | Never depends on animation completion or frame rate; invalid dates rejected |
| Character identity and appearance | Central identity ID, palette overrides, age/species profile | Body, face, proportions, colors, temperament; appearance renderer | Known identities/colors only; all themes use the same identity definition |
| Role and equipment | Activity role, activity necessities, carried inventory | Compatible kit, attachment points, held tool, required protection, optional deadline aid | Tool exists and is available/carried or visibly cached; protection never conditional on urgency |
| Landscape and numerals | World ID, hour chapter, clock snapshot, visual constraints | Terrain/resource anchors, canonical current-time paths, materials, safe zones | All four digits readable; no stale/future time in the landscape; foreground work cannot hide a stroke |
| Action | Activity ID, target anchor, time within bounded visit, effort state | Root pose, hand/foot targets, tool use, resource/result stage, work/recover/observe state | Human reach and supports credible; rest freezes ascent; tool/result match the action |
| Story and relationships | Local day, episode ID, explicit cast slots, day phase | Goal, consequence, choice, care exchange, daily realization; stable relationship roles | Cosmetic substitution cannot remove a learner or change a family into strangers |
| Philosophy | Episode choice and visible action/result | One quiet meaning, optionally a short caption | Observable in behavior; avoid repeated lectures or implying every delay is failure |
| Composition and lifecycle | Recipe, sampled outputs, settings, viewport, visibility | Ordered SVG layers, accessible description, bounded scheduled motion | Hidden/settings/rest states pause work; resume reconstructs current time and scene |

The proposed richer recipe has the shape `{ id, landscape, numeralMaterial, castSlots, actions, episodeSet, hourChapters, minuteChoreography, philosophyMotifs }`. Slots have roles such as `traveler`, `partner`, `learner`, `recipient` and, for ants, `worker`/`brood`; they reference centrally defined identities. Scenes may override appearances and compatible role kits, not secretly replace story identities. The current simple catalog is a foundation for this schema, not a finished compatibility system.

Each action definition should eventually include `preconditions`, `tool`, `targetAnchor`, `contacts`, `workStages`, `result`, `recoveryState` and `settledSnapshot`. Its visual result must survive until an explicitly authored transition changes it. A completed shelter must not shrink merely because another animation visit starts.

## The time contract

Time has three independent jobs:

- The hour selects a new terrain chapter and broad story situation.
- The minute selects a practical beat and commits the new time material.
- Seconds select a short, bounded work/recovery/observation visit. They do not gate the clock.

Sample one local date per application-rendered frame or scheduled boundary update and derive all four glyphs together. When `09:59` becomes `10:00`, the entire landscape readout switches to `10:00` atomically. No old-digit fade, unfinished stroke, character covering a distinguishing segment, or decorative preview may make the landscape read another time. The browser can suspend drawing or timer delivery; on the next rendered update, recompute from current time and do not replay missed minutes.

For material-edit choreography, separate symbolic timekeeping from physical decoration. Before the boundary, prepare logs, stones, threads or parts outside the readable glyph. At the boundary, reveal the canonical complete current-time paths together. After the boundary, the character settles the new edging, checks a junction, waters a bed or repairs a visible segment. The readable path remains beneath this work. Multi-digit changes do not require one tiny person to construct four full landscapes in one real second.

Use a consistent miniature, authored time-lapse language for big transformations. Landscapes can change hourly as the camera enters another chapter; do not depict mountains physically erupting every hour or imply crop growth is biologically instantaneous. The numerals are designed representations within the artwork, while movement and equipment should remain credible within its scale.

Companion intervals may suppress a moving visit, but each minute still has an appropriate settled action/result snapshot. Reduced motion shows the current composition without intermediate motion. Companion-off retains all numeral and landscape timekeeping. The scene must handle DST, midnight, leap days, backward clock changes, manual preference changes and long suspension through recomputation.

## Movement, equipment and recovery

Body silhouettes can be comic drops or simple human figures. Elbow/knee bends, reachable holds, a plausible backpack load, and purposeful tool grips create the human impression. Small body bobbing is insufficient evidence of walking, climbing or sawing.

Climbing needs authored world-space holds and foot supports, a continuous harness connection to visible protection, and one moving limb at a time. During recovery, preserve supported contacts or visibly secured suspension; do not turn an unsupported vertical climber into a free-standing camp pose. An ascender is optional deadline assistance on a suitable line. Helmet, harness, anchor connection and recovery remain present regardless of the deadline. Young learners stay on a ground route or within an explicitly supported activity.

Walking follows a traversable route; tool use joins hand targets to the tool and the tool to its resource. Water filtering shows a source, filter and receiving container. Food preparation shows gathered/carried ingredients and a contained cooking setup. Farming shows working a bed rather than striking random ground. Workshops use appropriate protection and separation from moving mechanisms. These are visual plausibility requirements, not instructions for real equipment use.

The current effort model is per-ascent and sampled from time. Persistent hydration, calories, accumulated fatigue, center-of-mass balance, rope forces and dynamic terrain contacts are later work. Avoid labeling a pose rig or an equipment catalog a complete physics/biology simulation.

## A day of story, without a lecture

Choose one episode per local calendar day. Within that episode use rest (00–05), intention (06–10), consequence (11–14), choice (15–17), realization (18), then care (19–23). A daytime return to the scene reconstructs that phase directly. The first runtime may use fewer phase distinctions; the richer sequence remains a planned expansion until those distinctions are rendered.

The daily realization is a change in attention: the traveler stops chasing another target, notices someone else's need or the surrounding life, and makes a modest choice. During the realization hour, observing, listening, sharing water, letting the learner choose a route, and resting are different gentle beats. A whole hour of one frozen action is a first-slice simplification, not the final story rhythm.

Six reusable episode patterns provide variety:

| Episode | Visible practical goal | Consequence and realization | Transfer of care |
| --- | --- | --- | --- |
| Alone | Reach another ridge, finish another row or mend one more track | Notices the light/water/quiet almost missed through hurry | Leaves a repaired path or shared supply for the next arrival |
| Family | Provide shelter, food or a working home | The family needs attention as well as completed work | Shares the task and then the meal/rest |
| Mentor and learner | Teach a usable technique | The learner notices something the expert overlooked | Knowledge flows both ways; learner handles an age-appropriate step |
| Shared repair | Fix a crossing or common mechanism | Helping makes the private journey slower and a shared journey easier | A later traveler visibly uses the repair |
| Self-focused urgency | Protect a personal deadline, initially pass a repair need | Encounters the cost of the neglected connection | Returns to repair/share without a punitive caption |
| Reciprocity | A younger or newer companion contributes | The former teacher learns to listen | Another beginning is possible because knowledge was passed on |

Show philosophical meaning through contrasts in actions and results. The motif is that humans transform surroundings to survive and pursue their goals, invent urgency around a finite life, and can still make room to enjoy a minute. Solitude is not automatically selfish; family is not automatically virtuous. Include willing help, initial refusal, reconsideration, quiet independence and mutual learning. Do not make the clock scold the viewer for being busy.

These are authored recurring episodes. They do not yet simulate births, aging, inheritance or permanent family history. Later continuity can connect a learner's earlier episode to a mature mentor's episode with explicit identity/version rules. For ant life, brood care and colony continuity are biological relationships; human-style reflective narration is a stated metaphor rather than a claim about ant thoughts.

## Theme recipes

### Woodland of Time — first slice

**Composition:** Moss or Ridge as the traveler; an optional partner and centrally defined young learner. Earth trails with timber edging draw all four numerals; stone stepping dots form the colon. Woods, a creek, climbing terrain and a foreground camp create a coherent setting. Paths retain a bright center and dark edge across daytime and night palettes.

**Hour chapters:** Mosswood → Stream Bend → Fern Hollow → Boulder Pass → Pine Ridge → Lakeside Clearing → Old Orchard → Return Glade. Chapters may repeat across the day with changed light and story phase; chapter identity remains stable within its hour. Each needs credible resource anchors so a creek action occurs at water and a climbing action occurs at rock/tree supports. Repeated motifs must still produce an observable hour-to-hour change.

**Minute beats:** survey → fallen-stick gathering → shelter → filtered water → berry gathering → protected tree route → protected rock route → contained fire → cook/share → crossing repair → observe/rest → teach. Repeat this vocabulary with resource/material variations rather than calling twelve unrelated motions a single continuous journey. Hunting equipment remains part of the role catalog; wildlife tracking, fishing or another food-gathering beat needs a separately authored meaningful action before it is claimed as implemented.

**Connection to time:** First slice shows current trail numerals, a brief minute-edge peg handoff and nearby practical action. The expansion moves the worker to a short selected numeral-edge segment: a bundle of fallen sticks becomes timber edging, a crossing repair becomes the bar of a current digit, or placed stones settle a curved trail. Stroke geometry remains authoritative throughout. A map can identify the next route without displaying a future time.

**Example:** At `07:42`, the family episode reaches Return Glade and the protected rock-route beat; the adult climbs while partner/learner wait on the ground. At `07:43`, the complete `07:43` trail appears together and the family tends a contained hearth. At `08:00`, the hour chapter moves into Mosswood and the party surveys the current `08:00` trail. At `18:42`, the same family notices evening light; its gentle beat is observation or shared water rather than another ascent.

**Philosophy:** Repair enough trail to reach a need, take only enough supplies, and notice that there was time to watch the creek. Teach route judgment and the value of stopping, not just the fastest climb.

### Industrial / engineering world — proposed

**Composition:** Human workers with distinct engineering/maintenance roles, helmets or task-appropriate eye/hand protection, workwear and a tool kit. Steel channels and illuminated slot edges draw numerals; turning gears occupy the spaces around strokes rather than ambiguous tooth-shaped digits. Counterweights and linked shafts expose how a small action produces a larger result.

**Hour chapters:** intake yard, machine hall, lift tower, power house, fabrication bench, repair bay, shared workroom, shutdown overlook. Show lockable stationary work areas, load supports and a safe pedestrian route. A geared machine is a clockwork miniature, not a claim of industrial hazard realism.

**Minute choreography:** inspect → measure → select component → fasten → tension belt → drive a hand crank → transfer supported load → check output → mend → clean → pause → teach. Prepare a component off-digit, use a visible linkage to settle the new numeral-frame section after the boundary, and show a completed functioning mechanism during quiet periods. Never put a worker inside moving gear teeth.

**Daily story and meaning:** A deadline-driven maker chooses between another unit of output and repairing a common machine. The learner finds a loose connection; the mentor listens. At the realization, the crew stops the line briefly and sees people beyond throughput. Limited time need not mean unlimited production.

### Fabric / weaving world — proposed

**Composition:** Makers and learners around a large cloth/loom. Warp defines stable vertical structure; contrasting weft defines complete numeral paths. Weaving roles need shuttle, bobbins, treadle/hand controls and task-specific kit, not a climber's harness by default. The cloth may incorporate landscape and family motifs outside the current-time safe zone.

**Hour chapters:** fiber sorting, spinning corner, dye garden, warp preparation, working loom, mending table, communal blanket, cloth drying in evening light. Display current time in one prominent panel of the continuous cloth; older patterns become abstract texture so they do not read as competing old timestamps.

**Minute choreography:** prepare a thread → pass shuttle → beat/pull → check tension → mend → join panels → trim → share a spool → restore a worn patch → lay cloth → rest hands → teach. The new numeral panel is already complete at the boundary; a visible shuttle pass settles its border and the character checks the new stroke. A full hour-long cloth is an authored time-lapse, not physically instant weaving.

**Daily story and meaning:** The rush to finish a perfect fabric gives way to keeping someone warm. A family or communal patch carries a learner's contribution; a mistake becomes a repaired pattern. We inherit threads, change them, and pass useful cloth onward.

### Farming world — proposed

**Composition:** Growers and family/neighbor relationships. Raised beds, planted rows, irrigation channels and orchard paths form all four digits, with a stable bed edge preserving glyph readability at every growth stage. Appropriate carried/cached tools include trowel, hoe, seeds, watering can and harvest basket.

**Hour chapters:** seed bed, irrigated plot, orchard, compost area, trellis, harvest field, shared store, resting field. Hourly movement enters distinct pre-existing stages of the farm; crops do not visibly complete a biological life cycle every minute. Seasonal/growth-stage art is authored until a longer-timescale model is designed.

**Minute choreography:** mark a bed → sow → cover → water → stake → weed → prune → gather → carry → share → rest → teach. A diverted water channel or fitted bed-edge piece visibly settles one current numeral segment. Produce remains distinguishable from soil; harvest carries it to a named store or recipient.

**Daily story and meaning:** A grower who wants a larger harvest initially overlooks a neighbor's dry bed, then shares irrigation and a basket. A learner understands that rest and soil recovery are productive in their own rhythm. Not every patch must be converted to output; leave habitat and appreciate a living field.

### Railway / station / junction world — proposed

**Composition:** Maintainers, station workers, travelers and families. Rails and platform edges outline numeral paths, with sleepers as subtle texture. Signals make the colon. Current-time rails are a stylized diagram within a larger coherent junction, not a literal full-size network of unsafe numeral bends. Trains use traversable tracks clear of workers.

**Hour chapters:** rural halt, freight siding, switch yard, bridge, busy platform, repair shed, meeting point, night station. Keep boarding areas, pedestrian crossings and maintenance locations legible. Railroad roles need purpose-specific tools and high-visibility/work clothing; central character identity remains reusable.

**Minute choreography:** inspect rail → adjust a stationary switch → fit a sleeper → check signal → move supported material → guide a train → help a traveler → load → mend platform → share directions → watch arrivals → teach. A visible switch linkage or platform-edge adjustment settles the current-time geometry after the atomic boundary. Train movement must not hide a numeral or imply collision.

**Daily story and meaning:** Someone racing to make a departure chooses to help another traveler find a platform. A maintained connection lets a family meet. At the realization, arrival and encounter matter alongside the schedule; the station remains a place of life rather than only deadlines.

### Ant-life world — proposed

**Composition:** Centrally defined ant identities/species rigs with six legs, segmented body and antennae; colony roles such as forager, tunnel worker and brood tender. Human body rigs, backpacks and family labels are not interchangeable with ants. Appearance/species compatibility belongs to the central character layer.

**Hour chapters:** woodland floor, seed trail, root crossing, nest entrance, nursery gallery, storage chambers, repair passage, resting cluster. A cutaway exposes dark-edged earth galleries as numerals; seed chambers mark the colon. Current paths remain clear even when workers pass through them.

**Minute choreography:** inspect with antennae → follow trail → carry seed → negotiate root → excavate → brace earth → tend brood → share food → repair gallery → signal route → pause → transfer a task. Tiny workers remove/place a short tunnel-edge cluster after the new glyph is committed. Food loads have plausible proportions and multiple workers cooperate when required.

**Daily story and meaning:** Colony continuity comes through brood care, shared routes and task transfer. A worker's local transformation contributes to a larger living network. A quiet narrator may connect this to human urgency and continuity; do not claim ants experience a human moral epiphany, marriage or spoken teaching.

### Sports scoreboard — proposed; slot TBD

**Composition:** Central characters take configurable baseball scorekeeper/player or football referee/player roles around a small readable field. Scoreboard score columns show current HH:MM; a labeled calendar row or date board shows the actual date.

**Minute choreography:** A pitch and hit, base run, or football scoring play visibly prompts the scorekeeper/referee to update the corresponding digit at the exact local-minute boundary. The complete current time changes immediately; activity cannot delay or imply a different clock time.

**Hour/day chapters:** An inning, period or round opens a new field-side chapter. On a new day, players begin another fixture and the scorekeeper turns the date board to the current date. Variants, scoring rules and activity remain configurable design choices. Family/team play, coaching and shared celebration can carry the story.

**Acceptance:** Preserve actual local HH:MM/date, readable score digits, browser and portable fit, and reduced-motion behavior; animate only explanatory activity around the authoritative time.

## Composition rules for mixing later

Mix by compatibility, not by accepting every possible combination. A human farmer can visit a Woodland camp with an appropriate trail kit. A climber can help in a workshop after adopting the workshop role and leaving incompatible tools at a cache. Pip may share a human role if its articulated silhouette can perform it. Ants require their own species rig and colony actions; shrinking a human into an ant scene is a deliberate fantasy crossover, not the default.

The landscape supplies geometry and anchors, the role supplies tools, and the story supplies relationships. Reject or explicitly adapt a recipe that asks for a filter with no water source, a climbing pose with no reachable holds, a learner role with no learner, or a train with no clear track. A new palette is usually compatible; a new body size needs reach/contact review. Keep numeral paths and the authoritative time independent of these choices.

## Milestones and acceptance gates

| Milestone | Concrete result | Required evidence before proceeding |
| --- | --- | --- |
| 1. Shared plan and composition catalog | Seven world recipes, layer boundaries and explicit proposal status | Each world has a material/time connection, resource anchors, believable role kit, social episode and visible philosophical choice |
| 2. Woodland vertical slice | One selectable live theme using central characters and deterministic hour/minute/day sampling | Hosted and portable rendering; exact four digits at rollovers/time jumps; hourly chapter changes; practical actions/gear; bounded recovery; visible daily realization |
| 3. Woodland refinement | Work edits a selected current numeral edge; authored contacts and stable work results | Tool-hand-target alignment, supported rest, visible causal material change; same completed shelter/bridge cannot regress on another visit; readable clock throughout |
| 4. Industrial slice | New material and motion vocabulary composed through shared layers | A real visible linkage between action and numeral result; appropriate equipment, safe work zones and recovered effort; all lifecycle/time tests reused |
| 5. Weaving/farming/railway slices | Each implemented separately with its own resource choreography | Distinct practical interaction, social choice and material legibility; no copied Woodland action mislabeled as weaving/farming/rail maintenance |
| 6. Ant slice | Central nonhuman rig, colony relationships and earth-gallery numerals | Six-leg gait/contact review, load scale, colony care behavior and clearly framed metaphor |
| 7. Deeper continuity and simulation | Optional richer contacts, metabolism and cross-day character history | Separately designed state migration/reset rules, reproducible behavior and honest biological/physics scope |

Planning and implementation are reviewed separately. The actions review checks supports, tool/resource/result stages and time coupling. The visual review checks numeral ambiguity, layering, material contrast and fit. The story review checks relationship continuity, visible consequences and restrained meaning. The orchestrator reconciles conflicts and tests the combined scene; an attractive plan does not substitute for a working rendering.

## Validation matrix

- **Time:** Test all 1,440 minutes in 24-hour mode and corresponding 12-hour formatting; inspect canonical path choices, atomic multi-digit boundaries (`09:59→10:00`, `19:59→20:00`, midnight), hour/day/DST/time-jump reconstruction, and absence of old/future numeral paths.
- **Actions:** For each implemented beat, verify a visible resource/tool/result, the correct role inventory, purposeful appendage motion and stable recovery. For later contact-based climbing, measure world-space support drift and reachable targets rather than only checking contact flags.
- **Story:** Sample every episode and phase with deterministic dates. Confirm cast slots survive appearance overrides; a learner remains a learner; the realization changes observable behavior; solitary and social scenes both make sense.
- **Art and layout:** Review hosted and portable screenshots on desktop, compact landscape and mobile portrait; facts/date/weather stay visible. Check all numeral pairs, night palette, reduced motion, no companions and large text. Target at least 4.5:1 for the primary numeral surface against its adjacent bed and 3:1 for an essential outline; target at least 24 CSS pixels of numeral height and 2 pixels of essential stroke in compact scenes. Keep an independent readable text clock. Use a short glance/read test where possible, not screenshots alone.
- **Lifecycle:** Hidden tab, open settings, black-screen rest, low power and reduced motion stop unnecessary motion. Resume shows current time immediately on its next update and does not replay unfinished work. Frames exist only in bounded visits; quiet minutes use scheduled wakeups.
- **Browser evidence:** Run the existing required build/test suite and new Woodland checks on actual Chrome, Edge and Firefox binaries where available. Android/Vanadium requires its own physical-device evidence; Chromium desktop results do not establish it. Record actual tested environments and remaining gaps.

Keep new runtime modules explicitly served and embedded into `Little Orbit.html`; no CDN dependency or runtime package should be needed for the scene. Preserve original art, attribution and the repository license. Link validated designs from the product guide and roadmap, and record implemented behavior separately from proposed refinements.

## First-slice integration review

The owner authorized delegated detail planning followed by one implementation. Four specialist plans were reviewed together. Integration corrections preserve the story-selected lead, exchange conflicting adult cast slots rather than losing a participant, keep Sprout grounded, resolve sleeping/solo narration, attach distinct held props, hold recovery position, and prevent a minute-edge worker from retaining a remote climbing rope.

The implemented terrain clock and header now share `DeskWorlds.clock` and the same date sample. A minute timer remains active during bounded visits. `tests/worlds.cjs` exercises all 1,440 minute values and daily/reflection/effort contracts; `tests/verify-woodland.cjs` checks hosted and offline portable glyphs, current header agreement, all activities, calendar/DST boundaries, story overrides, compact glyph sizing, and pause/quiet behavior. Later-world recipes have no theme button or renderer yet.

Synthetic visual review covered desktop and portrait shelter, cliff recovery, water, teaching, night cooking and the 854×480 handheld viewport. The pale trail surface and dark bed have 5.56:1 calculated luminance contrast. Viewport checks require at least 24 CSS pixel glyph height and 2 pixel principal stroke across all bundled facts and normal/enlarged text. These checks support the illustrated first slice; they do not certify real climbing contact mechanics or physical-device readiness. GrapheneOS/Vanadium and extended hardware operation remain unrun.

Final Linux validation: full hosted/portable `npm test` suites passed in Chrome for Testing 151.0.7922.34, Microsoft Edge 154.0.4258.53 and Playwright Firefox 153. The first Firefox run exposed a test fixture race when pausing at the exact already-running installation time; fixtures now install one second before the intended paused instant, and the complete rerun passed. No browser-specific runtime behavior was added. The generated portable file is committed with its source.
