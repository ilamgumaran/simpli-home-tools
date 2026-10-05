# Stories, relationships and the meaning of time

Status: design contracts for the living worlds. Woodland is the first implementation; the industrial, weaving, farming, railway and ant worlds are proposals. This document specifies both the small, reconstructable story layer to build first and richer episodes to develop later. It does not claim persistent lives, relationships, generations or a complete ecological simulation are implemented.

The clock tells the present time throughout the story. A character's activity gives the change a human meaning: repairing a crossing, preparing enough food, making room for a learner, or noticing something they nearly hurried past. Transformation and urgency are part of life; they do not have to consume all of it.

Related layers: [composition plan](LIVING-WORLDS.md), [shared characters](CHARACTERS.md), [central character source](../characters.js), and [world definitions](../world-layers.js). Original story and scene work remains under the repository's noncommercial license and attribution.

## What a story owns

A story selects relationships, intention, a consequence, a choice and a moment of recognition. It does not own character artwork, tool definitions, numeral geometry, terrain coordinates or the actual clock. Those belong to their respective reusable layers.

| Field | Contract | Example |
| --- | --- | --- |
| Episode | Stable identifier, title and ordered beats | `mentor`, “A lesson on the path” |
| Cast slots | Identity reference, relationship and activity responsibility | Ridge: guide; Sprout: learner |
| Intention | A practical aim, not a moral verdict | Reach a sheltered place before evening |
| Consequence | A visible effect of the chosen work | A repaired crossing remains available to others |
| Choice | An alternative the cast can express through action | Take the shortcut alone, or improve the crossing |
| Reflection | One observation connected to that consequence | The slower crossing became a place to meet |
| Care | What happens after achievement or recognition | Share water, check a shelter, rest or listen |
| Activity mapping | Eligible role, tool, partner and meaning | Water filtering: trail role, filter, shared bottle |
| Continuity | What the next episode may inherit | A technique, repaired route or gratitude motif |
| Rendering claim | Which beats are actually expressed in this version | Caption and cast pose; persistent bridge deferred |

The first version uses six daily episodes, a local-hour phase and minute activities. Complex consequences can initially be represented by a caption and an appropriate interaction. They become literal world changes only when the renderer implements them. A sentence about a repair must not be advertised as a persistent repair simulation.

## One calendar, three story scales

Use the user's current local date and time as the sole authority. The same moment must reconstruct the same default episode, cast and beat after opening a tab, sleeping, changing theme or resuming a hidden page. Do not accumulate missed minute actions or race through them on return.

| Scale | Selection | What changes | What remains readable |
| --- | --- | --- | --- |
| Day | Local calendar day modulo six default episodes | Cast relationships, intention and daily recognition | Current HH:MM |
| Hour | Local hour and terrain itinerary | New place plus a chapter of the same episode | Current HH:MM, immediately at rollover |
| Minute | Minute itinerary filtered by chapter and cast | Work, recovery, care, sharing or observation | Current HH:MM in every frame |
| Second | Short activity progress sampled from wall time | Pose, effort and small decorative completion | Current HH:MM without an old-time transition |

Compute the day index from the local year/month/day fields, rather than elapsed 24-hour intervals. Daylight-saving changes must not accidentally select a new episode. A repeated hour may repeat its scene; a skipped hour may be skipped. Changes to system time select the new present scene without pretending the characters experienced intervening events.

The default daily phases are design targets:

| Local hours | Chapter | Example behavior |
| --- | --- | --- |
| 00–05 | Rest and preparation | Sleeping shelter, stored tools, quiet observation for awake travelers |
| 06–10 | Intention | Read the route, gather what is needed, begin work |
| 11–14 | Consequence | Notice what work changes for the land and another traveler |
| 15–17 | Choice | Hurry, rest, help, accept help or alter the goal |
| 18 | Realization | Put urgency aside; notice, listen, share or learn |
| 19–23 | Care | Meal, shelter check, gratitude and quieter companionship |

18:00 is an authored story convention, not a scientific claim about local sunset. The first runtime fixes this window; making it configurable is a future option. It is a daily realization window: its minute beats can alternate quiet observation, sharing water, sharing food and learning. Realization should change the quality of action, not freeze the story for a whole hour. The first small implementation may use a restful tableau throughout that window; record that limitation plainly until these variants are rendered.

At midnight, select tomorrow's episode directly. Caption language can suggest continuity, but nothing has been permanently saved. “Tomorrow, another traveler begins” is a narrative cycle, not proof of aging or reproduction. Persisted character development, multi-day resource history and actual generational progression are later work.

## Six woodland episodes

These are variations, not a ranking of good and bad people. Solitude can be fulfilling, families can learn from one another, help can be accepted as well as offered, and a self-focused character can change course without becoming a villain. Each episode has a practical aim that survives the realization.

| Episode and cast | Intention | Consequence and choice | Daily realization | Care and next-day echo |
| --- | --- | --- | --- | --- |
| **A quiet journey** — Moss alone | Find a dry place to camp; read the woods without needing company | Taking a direct route saves distance but misses a creek-side clearing; Moss pauses rather than inventing another summit | “The summit can wait. The creek is here.” | Make one meal, refill water and sit with the sounds; tomorrow's traveler can follow a modest route marker |
| **A family trail** — Moss and Ridge as caregivers, Sprout as a younger learner | Reach shelter together, with jobs each can manage | An adult wants to keep pace; Sprout discovers a shaded rest spot, and the group adjusts | “They put the tools down and watch the light together.” | Prepare enough food for the group; adults handle fire and exposed climbs; Sprout points out the next path |
| **A lesson on the path** — Ridge as guide, Sprout as learner | Teach terrain reading and equipment care | Ridge explains a map, then misses a nearby dry crossing that Sprout sees | “Today's lesson: knowing when to stop.” | Sprout explains the crossing; Ridge listens rather than correcting by habit; the lesson becomes reciprocal |
| **An open crossing** — Moss and Ridge as peers | Repair a timber crossing for travelers behind them | Helping costs some summit time; the usable crossing and a meeting become the achievement | “Their delay becomes someone else's safe passage.” | Share shelter and a meal; one traveler accepts help carrying a load, so care flows both ways |
| **A summit postponed** — Ridge alone at first; another traveler may appear in richer versions | Finish an ever-growing route by an invented deadline | Ridge initially passes a loose crossing and keeps useful timber for a private shortcut; the detour isolates Ridge, who later chooses to make the shared crossing usable | “Ridge notices the sunset that hurry nearly hid.” | Leave enough timber for the repair and eat without starting another job; the unfinished summit is allowed to remain unfinished |
| **The lesson returns** — Moss as an experienced traveler, Sprout as learner and contributor | Pass on one familiar technique | Moss expects to lead; Sprout notices a resource or route Moss overlooked, and Moss accepts the contribution | “Moss listens. Teaching can flow both ways.” | They mark the discovery together; a future traveler inherits a technique, not a duty to repeat the same life |

The first Woodland cast includes Moss, Ridge and a centrally defined younger identity, Sprout. Identity and family relationship are separate: these are chosen episode relationships, not mandatory biographies for every theme. “Family” does not mean all characters must have children. The first version expresses a younger learner through scale, grounded tasks and interaction; numerical age and family genealogy are unnecessary.

For self-focused urgency, do not make withholding invisible and then deliver a moral caption. Show at least a pause at the crossing, a separation from a companion or a repair choice when that richer beat is implemented. Until then, label it a proposed extension; the first solo deadline episode conveys urgency and attention, but not yet all of the social consequence.

## Woodland minute activities as episodes within the day

The default twelve-minute itinerary can repeat five times an hour, with cast and chapter changing its meaning. An activity is a small episode: notice a need, do bounded work, recover or check it, and leave room to observe. Nothing requires a character to finish a hazardous task before the clock can advance.

| Activity | Visible work | Alone / together / learner variation | Philosophical connection |
| --- | --- | --- | --- |
| Survey | Consult a map and look at a trail | Alone reads it; peers agree on a route; learner points and adult listens | Attention can change the plan |
| Gather fallen sticks | Pick up a modest amount of fallen timber | Alone gathers enough for one; companions share carrying; learner collects a small ground-level stick | Need does not justify taking everything |
| Shelter | Raise or check a small tarp | Adult ties or checks it; peers hold opposite corners; learner hands over cord away from load | A home can be temporary and shared |
| Water | Filter creek water into a bottle | Drink alone; pass a filled bottle; learner watches before helping with an empty container | The journey depends on a place and other lives |
| Forage | Inspect and collect represented food | Adult identifies it; peers divide a modest portion; learner carries the bag | Enough for today, room for tomorrow |
| Tree climb | Protected adult climb on a selected trunk | Solo rests on protection; peer checks gear; learner remains on the ground | Limits and recovery belong to competence |
| Rock climb | Protected adult movement over a small rock route | Route-aware handholds when implemented; companion observes from stable ground | A deadline does not remove gravity or fatigue |
| Fire | Tend a contained camp hearth | Adult handles ignition and hot tools; companion prepares water; learner observes at a distance | Transformation needs care after the exciting moment |
| Cook | Prepare one pot or meal portion | Alone cooks and eats; peers share; learner receives a cool portion or helps with cold ingredients | Sustenance is not merely another milestone |
| Crossing | Check or mend a timber crossing | Adult works; peer steadies from a safe place; learner marks the waiting route | A small repair can outlast a private achievement |
| Rest | Sit, stretch or watch the woods | Solitude, comfortable companionship or a learner noticing something | Time can be lived without producing anything |
| Teach | Point out a map, technique or observation | For a solo cast, rehearse/observe rather than talk to an absent learner; in pairs, the teaching direction can reverse | Knowledge is a gift that can return changed |

Rope support, climbing recovery and essential protection remain mandatory in character/action definitions. The story never grants permission to omit them. A younger figure remains on stable ground in the first scene; protected youth climbing would require its own deliberately designed equipment and contact choreography later. Tools and roles still come from the shared catalog.

Actual hunting is a possible later woodland activity, with tracking, fishing or food preparation integrated into the same needs-and-care story. The first foraging scene does not implement capture, hunting mechanics or survival instruction. Gathering represented berries is a fictional activity, not identification advice.

## The same relationships in other worlds

These are planned adaptations. They retain the story grammar but select native roles, resources and consequences. Do not copy every woodland character, tool and motion into every recipe. Human identities can change roles; ant identities need their own species-appropriate definitions in the central character library.

| World | Numeral-changing activity | Alone / family or community | Mentoring and reciprocity | Self-focused choice and realization |
| --- | --- | --- | --- | --- |
| **Industrial / engineering** | Align a protected gear or link a counterweight that marks the new time | One mechanic finishes a personal machine; a team shares maintenance; a family visits a safe observation area rather than entering machinery | Experienced mechanic explains alignment; apprentice notices friction or a wasted movement | Increasing output creates an unnecessary queue of repairs; pause the cosmetic work, share a tool and value a quieter machine |
| **Weaving** | Shuttle threads into numeral bands on a large fabric | One maker creates a cloth; a family/community contributes panels for a shared covering | Learner repairs a missed thread; teacher accepts a different pattern that still carries the time clearly | Maker hoards a preferred color or rushes the seam; see the seam's gap, share yarn and let the fabric hold several hands' work |
| **Farming** | Irrigate beds, open crop-row numerals or place harvested produce along their edges | One grower tends a modest plot; family/community divides ground-level care and shares harvest | Elder demonstrates watering; learner notices shade or soil that needs less disturbance | Expanding every empty patch consumes water and attention; leave a resting patch and share enough food rather than maximizing every row |
| **Railway / station** | Set a model-safe junction, move a signal-linked marker or arrange time-bearing platform signs | A dispatcher works a shift; caregivers and learner wait safely on a platform; travelers help carry bags | Experienced station worker teaches checks; new worker spots a clearer accessible route | Efficiency obsession erases waiting and assistance; hold a noncritical task, help a traveler and let a safe journey matter more than speed |
| **Ant life** | Carry seeds, clear galleries and adjust earth chambers that already show current time | A forager searches separately, while workers coordinate food storage and tend larvae as a colony | Workers communicate a useful trail; another worker finds a shorter or less exposed route | A story contrast between excessive carrying and restoring a blocked shared passage; quiet contact and coordinated rest become a narrator's metaphor for enough |

A family scene in a workshop, farm or station assigns children safe roles such as sorting cold materials, observing, drawing a pattern or carrying a small empty container. Learners near active machinery or railway tracks need a designed protected location; they are not miniature workers assigned dangerous tasks.

Ant episodes use trail communication, antennal contact, nest care, foraging and larvae. They do not portray insect workers as human parents teaching human children, and the queen does not operate like a human household manager. “Realization” in this theme is an artistic interpretation expressed by a narrator and quieter activity, not a biological claim about ants contemplating mortality. Distinct worker behavior and central ant anatomy are required before that theme is implemented.

### Concrete cross-theme daily beats

Each proposed theme can reuse the six episode positions while changing what the characters do:

| Episode position | Industrial | Weaving | Farming | Railway | Ant life |
| --- | --- | --- | --- | --- | --- |
| Alone | Check a small machine, oil it, then listen to its steady rhythm | Weave a personal cloth and leave a deliberately restful border | Tend one plot, eat its modest harvest under a tree | Maintain a quiet station sign, then watch a train pass from a protected place | Solitary foraging trip returns to shared storage |
| Family / community | Prepare a community repair; visitors watch from a barrier | Each person contributes an appropriate panel to a shared blanket | Adults water and dig; learner sorts seeds and notices new growth | Caregivers help a learner read the timetable while waiting safely | Workers tend brood and keep a passage clear for the colony |
| Mentor | Guide checks power isolation; apprentice points out a worn alignment | Maker demonstrates a seam; learner sees a missed thread | Experienced grower explains watering; learner finds natural shade | Worker explains a signal check; learner notices a clearer sign | A useful trail is communicated and reinforced by another worker |
| Help | Repair a shared linkage before a decorative personal project | Mend another maker's tear with spare thread | Repair shared irrigation before enlarging a private bed | Assist a traveler with a bag before polishing a noncritical sign | Several workers cooperate to move a load or reopen a passage |
| Self-focused urgency | Prefer extra output, encounter wear, choose maintenance | Guard preferred yarn, encounter a gap, share material | Expand beds, encounter scarce water, leave ground to recover | Hurry cosmetic turnaround, notice a stranded traveler, pause to assist | A crowded route slows shared carrying; workers use another passage |
| Reciprocity | New mechanic's simple alignment improves the old design | Teacher adopts learner's useful edge pattern | Learner's shade observation reduces needless watering | New worker improves accessible wayfinding with an elder's knowledge | Returning workers alter the shared trail after new terrain information |

Time-bearing machinery and railway elements are visual fiction, not controls for actual industrial or transport systems. The clock still displays the present time before any decorative mechanism completes its motion.

## Philosophy through action, then a little language

The philosophy layer is a set of tensions a story can make visible, not a collection of quotations detached from the scene. Use one main tension per episode and let other meanings remain implicit.

| Tension | Show it | Avoid |
| --- | --- | --- |
| Transforming the world / being shaped by it | A creek redirects the path; a repair serves a traveler; a machine needs maintenance | Treating the landscape as infinitely expendable decoration |
| Invented urgency / finite capacity | A task list grows; effort rises; the character rests and changes the plan | A countdown that punishes recovery or delays current time |
| Finite life / lived attention | Light moves, a learner notices something, a character stops producing for a moment | Doom, death anxiety or an instruction to optimize every remaining minute |
| Autonomy / interdependence | A solo traveler enjoys solitude while still depending on water and earlier repairs | Suggesting solitary life is defective or family life mandatory |
| Expertise / openness | A teacher explains one skill and accepts another observation | A learner existing only to applaud the adult |
| Private gain / shared care | A shortcut is reconsidered and a crossing repaired | Shaming a permanently selfish archetype with no possibility of change |

Captions name one concrete observation in one short sentence. Default wording should be humane and lightly comic rather than sermon-like. Prefer “The summit can wait. The creek is here.” to “You must appreciate every moment.” Prefer “The learner found a path the guide missed.” to “Knowledge is power.” A sole traveler cooks a meal; “sharing a meal” requires a visible or explicitly represented recipient.

Routine minute captions explain the action. Reflective captions appear in the daily realization window or a natural recovery beat. Do not stack the story title, action label, moral and narration as four simultaneous paragraphs. Give the scene a visible observation and one short caption; richer design text belongs in the archive.

## Cast selection and future character evolution

Themes select cast slots from the central identity registry. A recipe can define a default cast and a configurable lead. Replacing the lead must preserve the relationship: resolve caption names from the selected cast, avoid duplicate accidental identities, and do not silently remove a learner when a user selects a different adult. The easiest first version is a fixed episode cast; broader mix-and-match can follow once role and relationship validation exist.

When a young identity is selected, require an eligible grounded role for the rendered action. An adult can climb while a learner observes. The scene need not assign every character the lead's current equipment kit. Family, guide/learner, peer and passerby roles express relationships; climbing, bushcraft and trail roles express tools and movement.

Future persistent development needs explicit choices: local storage format, reset controls, deterministic version migration, relationship boundaries, changing abilities and how a renderer reconstructs consequences. It should never pretend the browser accumulated a lifetime while it was closed. Generational evolution can begin as repeated visual motifs—an older route learned, changed and passed on—before simulating births, aging or deaths. All of that persistent state remains deferred.

## Review gates

Use these gates to tune the small first scene and each later story addition:

1. **Present time:** minute/hour/midnight transitions, reduced motion and tab resume always show the actual HH:MM. Plot completion never holds an old numeral or exposes a future time.
2. **Reconstruction:** the same local calendar moment yields the same default episode, phase and activity. Daylight-saving repetition/skips and a manual clock correction produce the present scene without replay.
3. **Cast consistency:** every rendered identity exists centrally, caption names match visible roles, solo language stays solo and the learner is actually represented when the caption mentions one.
4. **Activity agreement:** a displayed action has the proper tool/pose or is explicitly only a planned beat. Sharing, repairs and teaching do not claim invisible partners or persisted results.
5. **Relationships:** alone, family, mentoring, helping, self-focused urgency and reciprocity are all represented in the plan. At least one learning beat reverses the usual teaching direction.
6. **Realization:** every day has a deliberate recognition window. It changes the story's attention while leaving useful work, rest and quiet enjoyment valid choices.
7. **Human limits:** protected adult climbs retain rest and equipment. Learners remain grounded in the first scene. Urgency never increases unsafe work to meet a minute boundary.
8. **Restraint:** short captions remain legible, actual time dominates the composition, and reduced motion preserves meaning in static poses without compulsory movement.
9. **Honest scope:** first-scene captions, casts and sampled activities are distinguished from future persistent ecosystems, social consequences and character lives.
10. **Cross-world fit:** later themes keep their own believable materials, tools, relationships and consequences; the ant theme uses insect anatomy and colony behavior rather than reskinned people.

Before a richer episode is considered complete, review a morning intention, afternoon choice, 18:00 realization, evening care and midnight transition for the same cast. A polished single sunset screenshot is insufficient evidence of a coherent daily story.
