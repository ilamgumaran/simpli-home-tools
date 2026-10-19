# Visual and landscape layers

Status: design contract. The Woodland first slice is implemented on the development branch; its validation evidence is recorded in the composition plan. These broader visual gates are not all established by the first slice. Industrial, weaving, farming, railway, and ant worlds are proposals only. The shared character layer already exists. Keep original art and the repository's Simpli Home Tools Noncommercial License 1.0 and attribution.

## One composition, several independent choices

A scene recipe selects a landscape, a numeral material, a cast from the central character registry, an activity, a story, and a philosophical motif. A landscape must never create its own copy of an identity. Appearance belongs to the character; equipment belongs to its current role; pose belongs to the current activity; the landscape supplies surfaces, anchors, resources, and a palette. Changing a recipe must not change the meaning or punctuality of the clock.

| Layer | Owns | Receives from another layer | Must not own |
| --- | --- | --- | --- |
| Clock authority | Local date, selected 12/24-hour format, current four digits and period | User clock settings | Story duration or animation progress |
| Landscape | Hourly place, terrain, resource sites, work surfaces, ambient light | Hour and scene recipe | Character identity or delayed time |
| Numeral material | One visible rendering of each current digit and colon | Canonical glyph paths and landscape palette | Previous or future readable time |
| Character appearance | Body shape, face, clothing palette, silhouette, age scale | Central identity selection | Theme-specific duplicate identities |
| Role equipment | Carried kit, attachment points, required protection | Character role and activity tool | Unlimited items worn at once |
| Activity composition | Work site, hand target, surface contact, prop changes | Action phase, available resources and gear | Control over when the clock changes |
| Relationships | Who approaches, shares, teaches, receives, or works alone | Daily story and cast | A compulsory family in every scene |
| Meaning | A small visual pause, gesture, or optional caption | Story beat and activity | A paragraph covering the artwork |
| Presentation | Viewport composition, contrast, motion limits, accessible description | All above and user settings | Browser-specific art variants |

The product is an illustrated clock, not a geographic or climbing simulator. Terrain can be deliberately shaped into numerals. Keep this artistic abstraction consistent while making the person's stance, gear, fatigue, and contact with nearby surfaces credible.

## Scene order and protected clock area

Back to front:

1. Sky, daylight or moonlight, distant hills.
2. Background forest or other environment texture.
3. Ground, creek, route connectors and large supporting surfaces.
4. Work sites and resource props.
5. Climbing protection line behind the body, cast, and held equipment.
6. Current numeral bed, material fill, and restrained material detail.
7. Colon, period indicator, place label and optional story caption outside the glyphs.

The cast may travel along a trail segment, but the rendered numeral remains above the cast. Keep actors and large props in the lower clearing or side margins whenever possible. Never place foreground branches, smoke, a passing train, fabric folds, carried goods, or captions over a digit or colon. A protected clock area includes each stroke plus half its outline width and a small clear margin. Its background texture should be quiet.

Numeral continuity is topological: the underlying glyph stays recognizable while its material suggests a trail, steel rail, stitch, crop row, tunnel, or track. Do not add connector branches inside a numeral. Decorative connectors leave the outer clear margin and have lower contrast and thinner strokes than the digit.

## Canonical numeral contract

Use a shared set of paths for 0–9. Material treatments can be replaced without changing the recognizable geometry. The Woodland scaffold currently uses an 80 by 150 unit cell. Validate the artwork after line caps and joins are applied; a mathematically distinct path can become ambiguous at small sizes.

| Digit | Required visual distinction | Material detail that remains safe |
| --- | --- | --- |
| 0 | One closed loop with one open interior; no centre bridge | Stones or edging follow the perimeter |
| 1 | Tall upright, short sloped entry and small base | Detail follows the stem without a second upright |
| 2 | Upper turn, diagonal descent, clear lower horizontal | Grain or stitches follow the descending segment |
| 3 | Two rightward lobes or turns, open left side | Distinguish the centre junction from an enclosed loop |
| 4 | Upper diagonal/left arm and crossbar, long right stem | Fasteners stay on the arms without closing the upper gap |
| 5 | Flat top, upper left stem, lower right turn | Do not round the upper corner into a 6 |
| 6 | Open upper approach and closed lower loop | Lower opening remains visible after stroke expansion |
| 7 | Top horizontal and long descending diagonal | No base or crossbar resembling a 1 or 4 |
| 8 | Two enclosed interiors, visible narrow waist | Keep both holes open at the smallest supported size |
| 9 | Closed upper loop and descending right stem | Keep the lower left visibly open; no lower loop |

The colon is two clearly separated material objects on the same centre axis. It must stay visible continuously: Woodland stepping stones, industrial rivets, weaving knots, farming seed stones, railway signal lamps, or ant seed chambers. AM/PM or 24H remains outside the four glyphs, rather than being implied only by the sky.

The clock glyphs change as one transaction at the minute boundary. A character may anticipate with a tool or complete the new edge after the boundary; the readable time never waits for the character. Never fade both old and new digit groups over one another, interpolate a path through a third shape, or show the next readable time before its minute begins. Hour changes can replace scenery while retaining the same protected clock area.

## Theme composition recipes

| World | Numeral material and contrast | Work that connects cast to time | Hourly place variation | Relationship opportunities |
| --- | --- | --- | --- | --- |
| Woodland, first implementation | Pale compacted-earth trails with dark timber/stone edges; fine sparse grain; stepping-stone colon | Surveying a newly visible trail, setting a boundary marker, repairing its adjoining timber crossing, tending a nearby shelter, gathering water and food | Connected woods, creek, hollow, pass, ridge, lake, orchard, returning glade | Solo discovery, family meal, learner with adult, traveler repairing a route for others |
| Industrial, planned | Bright brushed-steel glyph rails on charcoal masonry; small gear teeth only outside clear stroke geometry; rivet colon | A mechanic releases a counterweight or aligns a rail at the changed digit; gears transfer work without hiding the clock | Power room, machine shop, assembly bay, maintenance loft, shared workshop | Apprentice and mechanic, separate shifts, tools shared or withheld, later repair |
| Weaving, planned | Broad light thread bands on muted cloth; a dark backing keeps continuous glyphs visible; knot colon | A shuttle secures the new outline while loose decorative thread gathers outside the clock area | Dye garden, spinning corner, loom, finishing table, mending space | Family making a cloth, solo mending, passing a pattern to a learner |
| Farming, planned | Clearly edged pale crop rows on dark soil; plants stay beside rather than across numeral strokes; seed-stone colon | A grower opens a row gate, waters a changed segment, or moves a boundary basket | Seed beds, irrigated field, orchard, compost yard, harvest shed | Neighbors sharing water, families saving seed, a grower working alone |
| Railway, planned | Pale ballast paths with dark paired rails arranged as canonical digits; signal-lamp colon | A worker sets a switch or checks a platform edge beside the newly current numeral | Rural platform, sidings, bridge, junction, repair yard, return station | Passengers departing and returning, workers helping an unfamiliar traveler |
| Ant life, planned | Light nest galleries edged by darker earth; seed-chamber colon; entrance holes cannot resemble extra colon dots | Workers clear a short side passage, carry seeds, repair a gallery edge | Roots, nest nursery, food chambers, tunnel junction, surface trail | Cooperative transport and reciprocal care shown through animal behavior |

Later themes need their own role kits and locomotion where required. An ant must be a centrally defined species with six limbs and its own locomotion contract; it must not be the human rig with a different costume. Railway and industrial roles need credible work attire and attachments rather than a climbing harness on every adult. Existing climber identities may participate after the appropriate role is defined.

For all worlds, the first minute treatment can be simple: expose the actual current glyph atomically, place a worker or material marker near the changed digit's outside edge, then show the associated activity. Evolve the complexity only after the minute remains immediately readable.

## Woodland places and continuity

Use eight recurring places as a daily route. Every hour has a distinct location key, even when the route revisits a named biome. Reuse a recognizable landmark or resource to connect adjacent places; vary a viewpoint and small resource placement as well as the palette. A new palette alone is insufficient evidence of a new terrain.

| Recurring place | Landmark and route connection | Palette direction | Resources and credible activity sites |
| --- | --- | --- | --- |
| Mosswood | Tall mixed trunks; downstream creek glimpsed at an edge | Moss greens, warm pale paths | Fallen timber on ground; small clearing |
| Stream Bend | Creek becomes foreground landmark | Cool green-blue, warm trail contrast | Filter site on stable bank; crossing reaches opposite bank |
| Fern Hollow | Fern cluster continues from stream bank | Softer olive and fern green | Berry shrubs and ground-level gathering site |
| Boulder Pass | Same creek disappears behind rock | Grey-green rock and clear pale trail | Actual footholds, fixed protection anchor and resting ledge |
| Pine Ridge | Pass opens onto ridge | Deep pine and muted blue sky | Tree with distinct climbable branch/anchor; sheltered ground camp |
| Lakeside Clearing | Creek opens into lake | Pale reed gold, cool water | Reed margin, contained cooking site away from vegetation |
| Old Orchard | Watercourse enters cultivated clearing | Leaf green, fruit ochre | Visible fruit, basket and safe reaching site |
| Return Glade | Familiar clearing receives repaired objects | Gentle earth tones | Shared shelter, meal and place to observe light |

Do not reset every resource to an unrelated position every minute. Keep a site's main rock, tree, creek bank, and camp location stable during its hour. Small prop states may reset as an episodic illustration; persistent consumption, inventory depletion, shelter construction across days, and ecological simulation are later systems and should not be implied as implemented.

The night version keeps trails readable. Change sky and distant light gently; do not rely on color alone to distinguish day and night, and do not darken the numeral surface below contrast acceptance. Campfire light stays small and contained. Avoid flashing fire, strobing stars, or abrupt whole-scene brightness changes.

## Character appearance and equipment in the landscape

Keep Moss's drop silhouette and Ridge's human silhouette recognizable across themes; preserve palettes through the shared registry. A young character gets a central identity and scale treatment. Do not recolor people according to their moral role, or use skin color to communicate who helps others.

Use a clear graphic silhouette at desk-clock scale: a single body mass, limb joints, head/helmet profile and small backpack. Face detail is a pleasant close-view reward, not a requirement for understanding the clock. Adult and young figures remain distinguishable by proportions, scale and posture. A learner observes on stable ground during adult climbing unless a future supervised climbing action defines their protection.

Carry a plausible subset of the role kit. Keep climbing helmet, harness waist belt and leg loops, backpack straps, rope attachment and protection visible at working scale. Connect a loaded climbing rope to the defined belay loop. A tree anchor must visibly meet the tree; a rock anchor must meet the rock. Human limbs must reach real illustrated support points, including during the pause. Tools that supply protection remain available throughout; a mechanical aid may be chosen near a deadline but protection cannot disappear to imply greater challenge.

A work prop should state its own function: map folds, bottle and filter, covered saw, cord coil, pot, basket, tarp, or tool handle. Do not reuse an undifferentiated stick for all equipment. The shared character renderer owns held-prop attachment; landscape props own the filter stand, hearth, basket, shelter and work surface. No numeric time is encoded solely in tool motion.

## Viewport and motion art direction

| Context | Composition rule | Detail budget |
| --- | --- | --- |
| Wide desktop | Full four-digit landscape, clear side work surfaces and lower camp; retain existing textual clock/date/weather layout | Layered hills and forest, up to three cast members, selected gear detail |
| Narrow portrait | Preserve the same four digits in one line; use quiet sky/ground behind them; place work sites below or outside glyphs | Fewer background trees, compact props, one primary actor with small supporting cast |
| Very short or large text viewport | Preserve the textual time, four current landscape glyphs and essential controls; optional caption may compact before time does | Hide decorative grain, minor foliage, secondary cast and long labels when needed |
| Reduced motion | Current time and landscape remain present; a stable credible activity or recovery pose communicates the story | No pan, breathing sway, flame oscillation, whole-scene fades or character transit |
| Low power | Bounded activity bursts, wall-clock-driven scene updates; static periods are intentional | Less frame work; never lower digit correctness |
| Companion disabled | Current landscape time remains fully useful | Hide actors, held tools and character-only motion; avoid orphan rope or moving work tools |

Start desktop composition from a stable viewBox. On narrow screens adapt composition before shrinking everything indefinitely. If a compact scene cannot support recognizable glyphs, retain a simplified four-digit terrain band and remove scenic detail. Do not solve small text with overlapping or clipped numerals. Scene text such as a place name may live in HTML outside the SVG to retain natural font scaling.

## Acceptance and evidence

These are release gates for the visual composition, not claims that the current scaffold already passes.

- Every visible frame contains four canonical glyphs matching the authoritative selected local HH:MM, a colon and an unambiguous period indicator when required. No alternate readable old or future time appears in props, texture or transitions.
- Test every digit at the smallest supported scene layout. Pay particular attention to 0/6/8/9 holes, 1/7, and 3/5. Test all 1,440 minute values, hour and midnight boundaries, 12/24-hour format switches, and restoration after a hidden tab or clock jump.
- Aim for at least 4.5:1 luminance contrast between a primary numeral surface and its immediately adjacent bed/background; never fall below 3:1 for the essential glyph outline. Test daylight and night across all place palettes. Color name or hue difference does not establish contrast.
- No foreground prop or character covers a numeral stroke or colon. Automated bounds can screen for overlap, but inspect representative screenshots because SVG stroke expansion, filters and transforms affect visible coverage.
- At compact portrait sizes, each landscape digit should remain at least 24 CSS pixels tall with at least a 2 CSS pixel recognizable principal stroke. Treat this as a lower bound to test, not a desirable large-screen size. Keep the independent textual clock readable and never crop it to enlarge decorative scenery.
- At wide sizes and the smallest supported viewport, test zero, one, two, and three cast members; sleeping/resting, work, climbing recovery and assisted climbing; every activity prop; day/night; and a minute/hour rollover.
- Check protected anchors and actual support contacts visually at the start, middle and end of each climbing visit. A count of logical supporting limbs cannot prove contact with the drawn terrain.
- Reduced motion and companion-off states preserve time and context. Hidden tabs and open settings stop recurring animation work; reopening shows current time immediately.
- Verify hosted and portable output in actual Chrome, Edge and Firefox binaries. Chromium compatibility supports a Vanadium expectation; it does not constitute a Vanadium device test.

## Review notes for the first Woodland composition

A read-only source review and inspection of the synthetic desktop and portrait shelter scenes found recognizable current glyphs, a clear colon, preserved textual clock and unclipped character silhouettes. This is evidence for those two compositions, not acceptance of all activities, palettes, viewports or browsers. The source has atomic current glyph replacement and an SVG layer order that draws numerals above the cast. Sprout is now a central identity, held props are independent of the climbing-only equipment group, and the minute handoff places its worker and peg near the last glyph. These resolve earlier integration concerns.

The following remain integration and visual-review concerns:

- The minute peg currently uses the last glyph's path near its endpoint. Ensure the worker's hand cue remains outside the protected stroke area for every possible digit. During a climbing minute, the handoff worker should not retain a rope across the scene from a remote climbing site.
- Different places share stable ground resource sites but now have authored log, stream, fern, boulder, pine, lake, orchard and glade landmarks. Hour palette, hills and tree arrangement provide the first route illustration; distinctive landmarks, resource placement and physical viewpoint continuity remain further art work.
- Shared character role props and actual climbing terrain need activity-specific inspection. A generic held line and logical support count are not enough to establish authentic tool use or visible contact. Recovery poses should remain on their support surface.
- The fixed 800 by 360 coordinate system and 90-pixel minimum scene height give nominal 37.5-pixel glyph height and 3.25-pixel material stroke when height constrains scaling. Measure actual output across supported widths and text settings, including the smaller dimension selected by SVG aspect-ratio fitting.
- Character overrides must not create duplicate people, contradict a caption's named protagonist, or turn an unsupervised young observer into a climbing lead. A sleeping camp should put the whole cast into sleeping or quiet shelter poses.
- Stories and relationships should remain visible in the artwork, not only in captions. A pause beside another traveler, offered bottle, shared pot, or map pointed to by a learner can communicate their connection within the existing clear work area. The first shelter screenshots show a recognizable family group; sharing and teaching gestures need their own review.

Related implementation sources: [shared characters](../characters.js), [world layers](../world-layers.js), [Woodland runtime](../woodland-time.js), and [character design](CHARACTERS.md). Later theme recipes above are design proposals and are not exposed as implemented themes merely by being listed here.

The orchestrator resolved the review's handoff rope, sleeping cast, conflicting overrides and named-caption issues. The scene now preserves adult participant slots when swapping the lead, rejects a younger lead override, and resolves sleeping/solo action narration consistently in visible and accessible text. Desktop browser checks enforce compact numeral dimensions; the actual path surface/bed colors calculate to 5.56:1 contrast. Continuous work-to-material choreography and rigorous terrain contacts remain future gates.
