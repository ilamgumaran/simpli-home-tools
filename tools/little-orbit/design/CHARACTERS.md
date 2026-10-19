# Shared characters — appearance and role equipment

Status: first implementation on the character development branch, October 4, 2026. The owner requested shared identities, a comic human climber, layered appearance and professional role equipment before expanding the worlds. [Interactive character workshop](character-study.html): open from the downloaded checkout; it uses the shared runtime, with no network or private device data.

## Character layers

| Layer | Implemented | Extension point |
| --- | --- | --- |
| Identity | Pip (`candy`), Moss (`moss`), Ridge (`ridge`), temperament and body style | Add an identity once in `characters.js` |
| Appearance | Skin, clothing, legwear, headwear, backpack, footwear and hardware palette | `create(id, {appearance})`; colors accept six-digit hex only |
| Body and pose | Separate head/face/torso, shoulders, elbows, hips, knees, hands and feet | Shared anatomical proportions and two-link joint solver |
| Equipment | Catalog, role-specific available kit, smaller carried inventory and attachment points | Role entries reference catalog IDs |
| Effort | Per-ascent fatigue, recovery hold, optional aid under late deadline pressure | Pure `ascent(progress, remainingSeconds)` |
| Theme | Theme chooses identity and role; controls terrain, camera and schedule | Shared registry bindings plus `config.js` character map |

The original Candy Quest art is stored in this library, with palette colors from Pip's identity. Orbit has no default mascot. All three identities can take any defined role; themes no longer contain their own body artwork. Time Climber uses Moss's drop-shaped torso and stick limbs. Time Climber II uses Ridge's comic human silhouette with warm brown skin, mint clothing, slate legwear, honey-colored helmet, coral backpack and dark boots. These choices are defaults, not identity constraints.

The workshop lets a contributor inspect each identity/role combination and recolor skin, clothing, legwear, headwear and backpack without editing the running clock's preferences. It is a design study, not a new clock settings panel. Different theme defaults can be configured centrally:

```js
characters: {candy: 'candy', climber: 'ridge', climber2: 'moss'}
```

Regenerate the portable HTML after changing site configuration. Browser-selected themes remain preserved. The Candy Quest theme keeps its original activities and layout; using another centrally defined identity changes its silhouette without making a second definition.

## Professional kits and what is visible

The catalog contains 83 items. It separates availability from what a character carries: a rock climber does not wear avalanche tools, farming implements and a hunting kit all at once. Carried sets are starter presets, not weight-optimized expedition packing lists. Haul bags, portaledges and large tools explicitly have separate-load attachments.

| Kit | Available equipment | Current use |
| --- | --- | --- |
| Rock protection | Helmet, waist/leg-loop harness, locking carabiner, belay device, rope, climbing shoes, personal tether and gloves | Essential protection retained throughout ascent |
| Rock climbing | Cams, nuts, quickdraws, slings, cordelette, chalk, brush, ascender, foot loop, pulley, fixed/haul line, portaledge, haul bag | A subset carried; optional ascender used only near the deadline |
| Alpine extension | Ice axe, crampons, ice screws, snow anchor, transceiver, probe and shovel | Catalog for future terrain-specific roles |
| Trail / trials | Shoes, trekking poles, map, compass, headlamp, rain shell, sun hat, sun protection and repair kit | Starter trail inventory; future trail mechanics |
| Backpacking | Fitted pack, water/filter, sleep system, shelter, thermal layer, first aid, signals and emergency supplies | Pack and bottle visible; remaining supplies inventoried |
| Food / cooking | Trail mix, bars, dried fruit, grain, legumes, electrolytes, produce, stove/fuel, pot, spoon and food bag | Existing snack/water scenes; cooking is not implemented |
| Bushcraft | Tarp, cord, firesteel, tinder, sheathed knife/hatchet, folding saw, gloves and sewing kit | Catalog and workshop inspection |
| Farming | Trowel, hoe, seeds, watering can, harvest basket and covered shears | Catalog and workshop inspection |
| Hunting / food gathering | Packed bow/quiver, binoculars, fishing kit/rod and preparation kit | Catalog only; no hunting action implemented |

The shared climber artwork shows a strapped pack, water bottle, helmet/chin strap, waist belt, two leg loops, central belay loop, belay device, gear-loop hardware, rope coil and articulated footwear. Small scenes simplify these silhouettes for readability. The catalog is not 83 separate rendered tools: individual gear art, carrying mass, depletion, cooking, growing, harvesting and hunting belong to subsequent layers.

## Human movement and recovery

The rig keeps upper/lower arm and thigh/shin lengths fixed. Targets outside reach are clamped. The climbing pose changes one appendage at a time while recording three remaining support contacts; elbows and knees bend rather than stretching limbs. The loaded protection rope ends at the central belay loop. The old flying grappling-hook depiction is replaced by an anchor check. Portaledges have their own support line rather than borrowing the climber's protection line.

Each short ascent now has a recovery interval. Route progress holds while fatigue falls; the face relaxes and the climber resumes afterward. Exertion shows an open mouth and small sweat drop. Late in the ascent, with less than 1.5 seconds left on the scene's route budget, an optional mechanical ascender, fixed line, harness tether and foot loop can appear. Safety gear is always used; urgency never skips the recovery interval. This deadline is the scene's activity budget, not permission to delay the actual clock or rush a rest.

This is a stylized pose and effort model, not a complete physics/biology simulation. Support contacts are logical poses, not persistent world-space handholds. Route-aware planted feet/hands, center-of-mass balance, rope tension/pendulum dynamics, terrain-selected anchors, injuries, hydration/nutrition consumption, carrying weight and fatigue carried across expeditions are not implemented yet. The current per-ascent state is sampled deterministically rather than integrating missed frames after sleep. Reduced motion, hidden pages, settings and screen breaks continue to stop motion.

## Source and review

`characters.js` is loaded before theme code and embedded by `build-portable.cjs`. The static server serves the shared library and character study. `time-climber.js` and `time-climber-ii.js` mount the shared art and sample its poses/effort; they retain scene geometry, calendar behavior and lifecycle responsibility.

Acceptance checks include cross-role identity reuse, catalog/kit validity, immutable appearance presets, bounded limb lengths, three-contact climbing poses, recovery progress/effort, deadline-only assistance, real SVG rope attachment, hosted/portable module loading, workshop role/appearance controls and reduced motion. Run `npm run build` and `npm test` from `tools/little-orbit`. Real-device Vanadium review and deeper terrain physics remain outstanding.
