# Activities, effort and the time contract

Status: implementation plan for reusable activity layers, October 2026. Woodland is the first scene; the other worlds below are proposals. This document defines the target behavior and acceptance criteria. World-space contact pinning is now implemented for the authored Woodland rock route; full-body/rope dynamics, biological simulation, conserved resources and material-by-material numeral construction remain targets. Other activities still use the shared bounded pose and short sampled recovery model.

Read alongside [shared characters](CHARACTERS.md), [world composition](LIVING-WORLDS.md) and [architecture](ARCHITECTURE.md). Identities, clothing and equipment stay in `characters.js`; activities reference those IDs rather than defining another person.

## First Woodland acceptance scope

Follow-up implementation: [planted Woodland rock contacts](CHARACTER-CONTACTS.md) adds actual authored world-space sockets, one-limb transfers and supported body movement to the rock activity. Its scope does not imply the broader contact, tree, ground-walking or dynamics acceptance criteria below are already complete.

The first slice targets distinct shared IK hand poses for gathering, building, water, cooking and teaching; hand-attached props; an authored protected climb at the woodland cliff; stationary recovery; and a secured terminal pose. Its minute handoff places a worker and trail peg at a joint of an already current glyph. This is a concrete connection to the time-bearing trail, rather than a complete causal reconstruction of every numeral stroke. Browser and pure-model checks determine whether this slice passes; a plan alone is not evidence.

Night (00–05) uses grounded sleeping/resting companions. The 18:00 realization chapter varies gentle rest, water, meal and teaching beats each minute. Disabled companions and reduced motion select quiet artwork rather than merely stopping a frame loop while work props continue changing. Full world-space hold pinning, rope forces, specialist tree climbing, chapter resource conservation and persistent biology remain deferred. The broader acceptance matrix below applies as these features are added; passing a pose-support metadata test does not satisfy its future world-contact requirements.

## Clock and activity responsibilities

The landscape is a clock throughout the story. The story celebrates its changes; it never decides whether the clock may advance.

| Scale | Responsibility | Rule |
| --- | --- | --- |
| Local calendar day | Relationships, daily realization, returning knowledge | Resolve from local date; revisiting a date reconstructs its story |
| Local hour | Terrain chapter and available resources | Change to the new place at the hour boundary, preserving readable time |
| Local minute | Activity and visible material arrangement | Every minute has its own current-time snapshot, whether motion is enabled or paused |
| Seconds within a visit | Preparation, work, recovery, settling | Sample the authored phase; do not integrate hidden or missed animation frames |
| Browser frame | Current numerals, body pose and attachments | Use one time sample for all components; never combine hour and minute from separate samples |

Four canonical numeral paths and a colon remain legible in every application-rendered frame. Update all four glyphs together to the current local HH:MM. This also applies when several digits change, such as `09:59 → 10:00`, `23:59 → 00:00`, and a changed 12/24-hour preference. Materials may settle around the current paths; no recognizable old or future numeral may crossfade over them. Keep actors, smoke, tools and particles clear of the important strokes. In 12-hour mode include AM/PM; in 24-hour mode midnight is `00:00`.

The first implementation may replace the numeral paths immediately and place an activity near them. That is an illustration accompanying a clock. A later material-edit pass should visibly connect the actor's hand, carried material and a changed trail edge. Do not describe the first pass as a fully simulated construction of every digit.

### A minute change without an unreadable interval

1. Before a boundary, prepare the required edging, stones or other material beside the trail. Show loose supplies rather than a complete future digit.
2. At the boundary, select the new canonical paths atomically. Their earth surface or other base material states the complete current time immediately.
3. After the boundary, the actor seats the prepared edging, binds a rail or tamps the soil along a short changed segment. All work follows the already current glyph.
4. Pause to inspect the result, drink or recover. A settled snapshot remains clear after the animated visit ends.

For an unchanged digit, inspect or mend its material rather than pretending every minute requires rebuilding the entire landscape. A rollover involving multiple digits can expose a broader prepared section while one actor completes a local detail. Do not require superhuman construction speed to justify real time.

Clock timers target minute boundaries. Every draw and every resume also samples the clock again so a late callback catches up immediately. A suspended browser cannot run timers or present new application frames; on return, render the actual current minute, with no playback of all missed changes. Do not claim operating-system timer precision as a result of SVG animation tests.

## Reusable activity recipe

An activity definition should specify these fields before new choreography is implemented:

| Field | Meaning |
| --- | --- |
| `id`, `role`, `capabilities` | Stable recipe ID, referenced shared kit, actions the participant can perform |
| `requires` | Terrain, materials, safe placement, reachable workpiece and participants |
| `contacts` | Named world-space handholds, footholds, seats, work surfaces or harness supports per phase |
| `attachments` | Tool grip point, strap/gear loop, rope endpoints and separate loads |
| `stages` | Ordered preparation, work, mandatory recovery and settled postcondition |
| `resources` | Authored input/output transitions, storage locations and what persists within the chapter |
| `effort` | Exertion, recovery interval, load limit and optional assistance policy |
| `numeralEdit` | Current path segment being edged, cleaned, watered, bound or inspected |
| `relationships` | Solo, partner, learner and helper participation without changing clock semantics |
| `quietState` | Complete static composition used with reduced motion or companions off |
| `acceptance` | Observable behavior, pose bounds, resource and timing assertions |

A recipe can have one worker and several companions, but a companion must perform a visible role if the story says they help or learn. A standing extra does not demonstrate teaching, sharing or cooperation.

## Body, load and protection

Keep the comic silhouette, readable face and small humorous gestures. Humor comes from temperament, a reluctant boot or an overenthusiastic map inspection. It should not come from a dislocated joint, a floating pack or a supposedly protected climber falling without protection.

Human arms and legs keep their segment lengths. Reach clamping is a fallback, not route planning: choose world targets within the person's reachable envelope first. A planted endpoint stays at the same world position while the torso moves around it. Turn elbows and knees naturally; prevent feet crossing through a wall, knees folding backwards and hands entering the torso. Walking has a planted stance foot and a separate swing foot. Bend the hips and knees while gathering; the torso does not glide horizontally above fixed ground poses.

For a climbing step, move one appendage at a time while the others hold reachable terrain contacts. Verify the support configuration and body position against the holds, rather than counting pose booleans. Translate the center of mass only as far as the supporting contacts permit. No body point should pass through the rock or trunk. Tree branches, rock holds and rope anchors belong to the terrain definition, not arbitrary screen coordinates.

Protection equipment is always available and connected when the activity requires it. It is never a late-game reward. Choose one explicit rope system for an authored route: an established protected rock route, or a suitable anchored ascent system. Represent its anchor/support, connection to the harness and supported rest; a line drawn towards a tree alone does not establish a believable system. Tree work needs a tree-appropriate harness/rope-role preset before claiming professional arborist authenticity. The present generic climbing kit is a starter catalog, not that specialist validation.

Rope endpoints follow the correct attachment points as the actor moves. A protection line and an optional fixed assistance line have distinct purposes. The assistance device connects to its fixed line, harness attachment and foot loop; carrying a rope coil does not prove such a system exists. Work tools attach to the gripping hand and move with its wrist. Bulky supplies have separate loads. Packs have shoulder/waist straps and remain attached to the torso. Set down a pack before constrained camp work if the authored pose needs room.

### Recovery and self-imposed urgency

- Each exerting visit contains a mandatory supported pause. Route progress and the loaded root stop while fatigue falls. Small breath/face changes may remain; reduced motion uses a settled supported pose.
- A vertical recovery needs reachable sustained holds or a visibly secured resting/suspended stance. Switching to a ground-style rest with both hands by the sides is insufficient while the person remains on a wall.
- Resume only after the authored recovery. Strong fatigue can shorten the next work section or defer the task; it must not be removed just because the numeral changes.
- Optional mechanical help may appear near the task's deadline, after preparation and recovery, if the role carries it and the route supports it. Essential protection, water filtering and ordinary cooking tools are used when needed throughout.
- The activity deadline is a dramatic budget. It cannot delay HH:MM, accelerate a child, skip recovery or force a dangerous posture. An unfinished improvement may remain unfinished while the clock and life continue.
- The first effort model is per visit. Persistent nutrition, hydration, sleep debt, pack weight and cumulative fatigue are proposed extensions; do not label a normalized fatigue number a validated physiological model.

## Woodland recipes

The hourly place provides resource sites, a camp surface, work sockets, climb contacts and clear numeral paths. The minute chooses a suitable recipe variant. When a place lacks the required resource, use carried supplies or an inspection/rest variant; do not conjure a stream beside every tree or force a climbing route through a campfire.

| Recipe | Preconditions, contacts and gear | Resource/work stages and recovery | Settled outcome and numeral connection |
| --- | --- | --- | --- |
| Read and hike the trail | Walkable slope and next waypoint; trail shoes, map/compass, poles when terrain needs them. Stance foot pins to ground; map is held while stopped. | Inspect → fold/stow map → take short steps → stop to look and breathe. A learner can identify the next waypoint. | Worker reaches a nearby path edge and places/inspects a small marker beside the current minute trail. No map reading while sprinting. |
| Gather fallen sticks | Existing fallen material within reach; bushcraft gloves and a pack-side bundle. Saw is used only when cutting a supported piece, never waved as a universal collection tool. | Squat with two grounded feet → grip loose stick → stand with a light bundle → set it down → relax hands. Fallen supply becomes camp fuel or edging stock. | Small bundle rests at a cache beside the current trail; one suitable stick can become edging after the minute change. Living branches remain intact. |
| Build shelter | Level supported site; staged poles, tarp and cord; shelter cannot occupy the numeral path or stream. Brace feet; off hand stabilizes pole while working hand ties. | Lay out supplies → anchor poles → tension tarp → secure lines → sit and inspect. A partner steadies a pole; the learner arranges harmless supplies. | A stable shelter persists in the chapter. Guy lines reach ground anchors. Its edge frames a trail rather than replacing a glyph with an ambiguous triangle. |
| Gather and filter water | Stream or carried source, filter and bottle; broad bank contact, bottle held or placed on stable ground. | Fill raw container → connect visible filter path → transfer to drinking bottle → close → rest/drink. Raw and prepared water remain distinct authored states. | Bottle becomes filled; a small irrigation or stepping-stone detail beside a current trail indicates the minute. No unsupported lean into the creek. |
| Forage and observe wildlife | Authored known food patch or orchard, food bag, reachable fruit; stay on a stable trail. Binoculars attach to hands for observation, then stow. | Inspect → take a modest portion → basket/bag visibly gains food → step back → observe what remains. | Some food is left on the plant. Fallen seed/berry-colored pebbles can edge a trail; food itself is not wasted to draw a digit. |
| Protected tree ascent | Tree-appropriate supported route and kit; helmet, harness and planned protection; feet/hand contacts on reachable branches or trunk features. | Check system → one-limb moves → secured stationary recovery → resume → settle at a branch or authored return. No floating upward translation. | A small branch-mounted sign or trail-edge cord is inspected. Full professional tree-system mechanics are deferred pending a specialist role and contact solver. |
| Protected rock ascent | Reachable rock route with explicit anchor/support system; shared climbing kit and clear independent aid line if required. | Check anchor and attachments → weighted steps → supported recovery → optional late ascender use → secure finish or staged descent. | Completed route reaches a work socket beside a current path segment. Protection remains connected through recovery and transition. |
| Tend a contained fire | Ground hearth with room clear of tarp, vegetation, learner and digit strokes; prepared tinder/fuel, firesteel, water container. | Kneel at an offset → prepare tinder → small ignition → controlled tending → tool stow → rest. Fuel changes from prepared sticks to a small hearth/embers. | Warm camp accent remains separate from readable paths; fire does not flicker under reduced motion. No smoke masks a digit. Firewood can explain previous collection work. |
| Cook and share | Supported pot at stove/hearth, food supply and prepared water; cooking role carries pot/spoon and actual meal items. | Set pot → add food/water → stir from outside heat → put utensil down → serve → sit/eat and recover. Recipient receives a bowl rather than remaining an idle extra. | Pot and shared portions are visible. Setting a small wood-edged camp table near a trail provides a minute detail; nobody grips a hot bare pot as a substitute for cooking. |
| Mend a crossing | Existing crossing site, sound supports and staged timber/cord; bank footing, supported workpiece, partner if load requires it. | Inspect → seat one prepared board → bind or fasten → check → rest → let another traveler cross. Heavy logs are not lifted one-handed. | One repaired section persists; trail on the crossing remains the current numeral. It is a small repair, not an entire bridge built in twelve seconds. |
| Rest and notice | Secure seat or flat glade, stowed tools, optional bottle; feet/seat planted. | Sit → breathe → look at creek/light → drink if appropriate → relaxed settled pose. Fatigue falls while task progress holds. | Current paths stay complete. Light, a leaf or companion's gaze draws attention without requiring another resource extraction. |
| Teach or help | Teacher and learner/peer at reachable common work surface; map, harmless loose marker or prepared bottle. Learner has a smaller kit and shorter reach. | Demonstrate → learner performs a simple gesture → teacher waits → learner points to a useful alternative → both pause. | A marker or shared repair becomes complete. Knowledge and attention can flow from younger person to adult; no autonomous hazardous child task. |

Hunting is a requested future woodland activity, separate from foraging. Its first proposed vignette is tracking, quiet observation or fishing preparation with appropriate carried equipment and a rested stance. A later non-graphic food-acquisition recipe must show the relationship between finding food, preparation, consumption and restraint. Bow, quiver and fishing rod availability in a catalog does not mean they are carried by the current hunting preset. Add the needed role variant before drawing them. Never claim wildlife or food conservation from a decorative prop alone.

### Coherent resources rather than disappearing props

The first scene can use separate illustrative minute vignettes. State that scope clearly. For coherent chapter continuity, define deterministic authored resource stages: a fallen-stick cache is collected, shelter/meal supplies are delivered, a crossing is repaired, tools are stowed and the camp is left tidy. Later visits must not shrink a completed shelter merely because a new animation starts at progress zero.

Keep finite inventory/carrying simulation deferred until it has a ledger and deterministic reconstruction rules. The simplest next step is a chapter snapshot calculated from local time and story, with pre-positioned caches explaining materials. Skip directly to the appropriate snapshot after sleep; do not simulate every unobserved fire, meal or harvest. At an hour change, retain relevant carry props and choose the new place's entry pose. A carried bottle or stowed tool provides continuity even if the scenery changes immediately.

## Planned activity families

All following recipes use the same current-time, contact, recovery and quiet-state contracts. They need separate equipment presets and terrain sockets before implementation. Human rigs are reusable across human worlds; an ant requires an anatomically appropriate six-legged identity and contact solver rather than a tiny person with extra lines.

### Industrial / engineering

| Activity | Preparation, contacts and tool attachment | Work, recovery and visible result |
| --- | --- | --- |
| Inspect gear train | Worker grounded on platform, isolated work section, measuring tool held at a reachable face | Measure/check → mark → step back; current numeral is a stable rail/segment arrangement, separate from rotating decoration |
| Fit a prepared segment | Small section or hoisted load supported before hands guide it; gloves, fastener/tool grips | Align → fasten → supported pause → inspect; old section parks off the readable glyph before the new canonical arrangement appears |
| Raise a counterweight | Hoist anchored to structure, load path visible, operator holds reachable control | Balanced travel → brake/secure → rest; weight does not dangle from a person's arm or pass through a platform |
| Lubricate and repair | Mechanism stopped at work site; applicator in hand, second hand supports stable fitting | Apply → wipe → stow → step clear; repair prevents an extra urgent job, showing care rather than only output |
| Teach an apprentice | Two workers on stable platform, harmless sample part and clear gestures | Demonstrate → learner checks alignment → teacher listens → shared pause; optional helper hoist appears only when time is tight |

Hourly chapters move among workshop, engine hall, elevated service platform and quiet break area. Minute changes use selected rail/gear-linked numeral segments, not arbitrary gear teeth that happen to suggest a number. A deadline may bring a properly supported hoist; safety guards and supports are always present. Planned realization: the machine can keep turning while people stop to share a meal.

### Large woven fabric

| Activity | Preparation, contacts and tool attachment | Work, recovery and visible result |
| --- | --- | --- |
| Lay warp and tension | Stable loom/bench, anchored threads, worker feet or seat supported | Thread → tension → check → hand rest; complete current numeral remains in the cloth |
| Pass shuttle | Shuttle grasped by hand, other hand controls reachable yarn; loom cycle matches tool clearance | Pass → beat → release → rest wrists; only short accent stitches animate after a minute boundary |
| Mend a thread | Broken decorative/edge thread accessible without cutting a time stroke | Support fabric → stitch → secure end → inspect; patch remains as history rather than resetting |
| Dye and spool | Prepared vat/spool on work surface, light load and tool grip | Wind/dip → set down → recover; color preparation occurs away from the authoritative numeral |
| Teach and share the cloth | Adult and learner at low sample frame, manageable shuttle | Learner chooses a pattern → adult follows → both pause; family patch becomes part of hourly chapter |

Hourly chapters reveal new cloth panels and accumulated work; current-time digits remain readable at the same viewing size. For minute changes use an authored reversible thread/overlay structure or a prepared panel exchange, rather than implying permanent woven cloth instantly unweaves. Optional late aid is a powered shuttle/control appropriate to the loom; protection and ergonomic support are baseline. Planned realization: leave some empty cloth for another person's story.

### Farming

| Activity | Preparation, contacts and tool attachment | Work, recovery and visible result |
| --- | --- | --- |
| Prepare and seed a bed | Supported kneeling stance, trowel/seed kit, existing soil bed | Open small planting sockets → seed → cover → stand/rest; path edges define current glyph while crops provide texture |
| Water a row | Filled manageable can or supported irrigation control, feet on dry path | Lift within load limit → pour → set down → rest; wet-bed state changes near a numeral segment |
| Tend and weed | Reachable bed, gloves/hand tool, clear distinction between crop and weed | Bend/squat → collect → basket → recover; no whole-field transformation in one visit |
| Harvest and share | Authored mature crop stage, manageable basket, recipient | Pick → basket fills → transfer portions → sit; leftovers and soil care remain visible |
| Rotate or repair a bed | Prepared border sections and compost supply, stable work sockets | Move one lightweight edge → repair → inspect → pause; late helper cart assists transport, not instantaneous growth |

Hourly chapters visit seed beds, irrigation, orchard, harvest yard and shared table. Agricultural growth uses explicitly stylized chapter snapshots, not false minute-by-minute biological growth. Current numerals can be bed boundaries or paths with crops around them. Planned realization: rest, sharing and restoring the soil are part of a successful harvest.

### Railway, station and junction

| Activity | Preparation, contacts and tool attachment | Work, recovery and visible result |
| --- | --- | --- |
| Check a junction | Worker on protected service walkway, reachable switch/control, active line separate | Inspect → set modeled locked position → verify → rest; current-time track/indicator shape is canonical and readable |
| Maintain a platform sign | Stable platform/work support, light sign sections and tool grip | Prepare segment → secure → check → step down; minute change settles an already current sign or platform-edge numeral |
| Service a rail detail | Authored closed work zone and supported equipment, no conflicting train movement | Measure/fasten → stow → clear zone → pause; small repaired detail persists |
| Help a traveler | Platform footing, manageable luggage or wheeled trolley, traveler acknowledges assistance | Offer → move supported load → set down → wait; story shows help beyond mechanical deadlines |
| Dispatch and share a break | Control desk, reachable lamp/lever, coworkers | Check → signal → observe departure → shared rest; train positions follow authored scene stages |

Hourly chapters move through a quiet halt, busy platform, junction yard and evening waiting room. Tracks can suggest digits only when the whole HH:MM remains unmistakable; otherwise use integrated platform/sign numerals. Optional trolley or partner assists late loading, while basic operational protections always exist. Planned realization: a departure time matters, and the person who needs a hand matters too.

### Ant life

| Activity | Preparation, contacts and tool attachment | Work, recovery and visible result |
| --- | --- | --- |
| Carry a seed | Species-appropriate six-legged gait, mandible grip and plausible load | Lift → supported steps → set down → pause; a seed chamber accent marks current tunnel numeral |
| Repair a gallery | Earth work face, leg contacts on tunnel floor/wall, supported small particle | Remove/compact → store material → check passage → rest; readable tunnel skeleton remains complete |
| Share food | Two ants with clear distinct positions and species-informed behavior | Meet → brief food-sharing gesture → separate → rest; no human pot or backpack on a biological ant by default |
| Tend brood | Worker reaches nursery chamber with small safe movements | Approach → tend → withdraw → quiet pause; youngest colony members remain in the chamber |
| Reroute and cooperate | Established trail/branch and manageable loads, multiple carriers with coordinated contacts | Inspect blocked decorative route → alternate path → share load → stop; colony helper appears for task urgency, not as protection withheld until late |

Hourly chapters explore chambers, root edges, food routes and surface clearings. Tunnel galleries form the current digits; excavated accents reinforce them without leaving a stale numeral. Human philosophy is expressed through visual analogy and optional captions, not presented as an insect's scientifically proven inner beliefs. Species-specific anatomy, gait, loads and behaviors require validation before implementation.

## Lifecycle and acceptance

Each implemented recipe must pass observable checks; catalog entries and captions alone are insufficient evidence of an activity.

| Area | Acceptance |
| --- | --- |
| Time | Check all 1,440 local minutes in 24-hour mode and representative 12-hour boundaries. Glyph metadata and every rendered path agree with the same HH:MM. Multi-digit rollovers update atomically. Decorative layers contain no competing stale/future numeral. |
| Clock jumps | Advance across minutes/hours/days, suspend/resume, move clock backwards and change format. The first subsequent draw reflects the actual instant, without replay or negative activity progress. |
| DST and calendar | Resolve local date/hour/minute, including leap day and a timezone with daylight-saving transitions. Spring skips directly to the existing next hour; a repeated autumn hour repeats its local chapter deliberately. Day selection uses local calendar fields rather than assuming every day is 24 elapsed hours. |
| Contacts | During designated stance/support phases, world endpoints remain pinned within tolerance. Fixed segment lengths, reachable targets, valid bends, ground clearance and plausible body support are checked. A metadata count alone does not pass. |
| Attachments | Tool follows wrist/grip; pack follows torso; protection and aid lines end at defined anchors/attachments. Water/food props appear for the role actually carrying them. |
| Recovery | Work/root progress freezes in the recovery interval and fatigue decreases; ascent resumes afterward. Optional aid is absent early and during recovery. No abrupt teleport to ground at the visit end. |
| Resources | No completed shelter/repair shrinks on a later visit. Inputs and outputs either have authored staged continuity or are explicitly labeled isolated vignettes. Skipping time reconstructs the right stage. |
| Minute action | At every minute there is a distinct selected activity and settled visible state. With a five-minute motion interval, other minutes still change current numerals and action snapshots. Motion settings do not promise an animation every minute. |
| Quiet states | Reduced motion presents complete current digits and a supported static pose, with no fire flicker, moving smoke, gear rotation or dangling-load motion. Companion-off hides actors and their moving effects while retaining scenery/time. |
| Pauses | Hidden page, open settings and screen-rest stop animation loops. Resume performs one current-state draw, then only schedules the required active visit/boundary. Disabled companions and reduced motion never leave a continuous frame loop running. |
| Viewports | Desktop and narrow mobile layouts retain all four numerals, AM/PM and readable fact/weather controls. Important strokes remain visible with learner/family casts, bright/dark chapter palettes and large display preferences. |
| Browsers | Hosted and portable builds receive Chrome, Edge and Firefox checks. Real-device Vanadium remains a separate required review until actually tested; shared Chromium behavior alone does not prove it. |

Repeated local hours currently may use the same chapter and action, which is a coherent clock illustration. If future finite-resource simulation must distinguish the two occurrences, add an explicit offset/instant identity without altering the visible local HH:MM. Do not accidentally spend an hour's supplies twice merely because the clock repeats.

Prioritize visible current-time correctness and honest supported poses first, then real tool grips and meaningful resource stages, then terrain contact persistence, load/rope dynamics and longer-term effort. Expand another world only after its recipe, geometry, quiet state and acceptance evidence agree.
