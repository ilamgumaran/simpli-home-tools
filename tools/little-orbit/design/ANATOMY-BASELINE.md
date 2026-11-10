<!-- SPDX-License-Identifier: LicenseRef-Simpli-Noncommercial-1.0 -->
# Anatomy baseline and authored reference plan (A0)

Status: **A0 source inventory and reference protocol**. This records the extant behavior for the planned anatomy work in [ANATOMY-AND-ORGANIC-MOVEMENT.md](ANATOMY-AND-ORGANIC-MOVEMENT.md). It does not implement A1 constraints or claim natural gait. The requested audit anchors are weather/habitat source `307c8e1` and legacy runtime `f02092b12a45d72cefe73ba68d5acd2f68932358`. The working checkout is newer; confirm each cited expression against the named baseline before treating later differences as legacy behavior or visual regressions.

## Active actions by renderer

The table describes source-selected action families, not a promise that every identity performs every action. Shared pose data lives in [characters.js](../characters.js); scene code owns timing, placement and sometimes separate geometry.

| Renderer / consumer | Active sampled actions and pose consumer | A0 boundary |
| --- | --- | --- |
| Shared character facade | `camp`, `rest`, `sleep`, `collect`, `walk`, `traverse`, `climb`, `assist`, `rappel`, `cast`, `gather`, `build`, `water`, `cook`, `teach`, `read-map`, `listen`, `recover-climb`, `pave`, `rake-sand`, `carry-wood`, `kindle-fire`, `fill-water`, `wade`, `play-water`, `play-sand`, `stir-pot`, `tent-peg`, `cradle-care`, `kneel`; custom `walkContacts` / `workContacts` and `climbContacts` targets | `joint()` returns shoulder/elbow/wrist and hip/knee/ankle. It is a fixed-length two-link pose solver with clamped reach, not anatomy limits or foot/palm frames. |
| Woodland Dashboard | Story action and role select camp/work/rock phases; `woodland-time.js` uses shared poses, `walkContacts`, `workContacts`, and rock contacts | Primary actor gets the sampled route; companions get secondary poses and travel blending. Its SVG scene coordinates are not screen pixels. |
| Woodland Immersive | `woodland-immersive.js` maps chapter work to shared pose, travel/gait, work and climb contacts; Sprout can use play/sleep actions | One shared renderer, separate layout, actor sizing, transforms, and prop drawing. |
| Green House 1 community | Aster `cradle-care`; Sage routine action plus meal override; Sprout `play-sand`/`sleep`; Pebble swaddled `rest`/`sleep` | Routine actions and props are in `habitat-community.js`; Sage's seven meal stages and independent route are in `habitat-meal.js`. |
| Candy Quest | `app.js` selects `run`, `bike`, `work` visits; default Pip is mounted with bespoke `candyArt` | Candy animation is CSS/Web Animations plus sprite styling; it is not the shared rig's articulated walking consumer. Configured non-Candy identity uses shared artwork. |
| Time Climber I | `time-climber.js` draws its own small climber path for cast/walk/climb/rest/assist and route transitions | Standalone scene glyph and direct path geometry; it does not call `DeskCharacters.update`. |
| Time Climber II | `time-climber-ii.js` samples cast, walk, climb, collect, build, camp, traverse, rest and assist | Standalone route actor drawing; shared `ascent()` provides effort timing but the art is not the shared character rig. |
| Orbit | No character renderer | No anatomy migration target. |

The action list is intentionally bounded to code paths seen in these consumers. The item catalog in `characters.js` (including farming and hunting entries) is available equipment metadata, not evidence that those activities render.

## Legacy endpoint and contact meanings

`anatomy` in `characters.js:45` defines shoulders `(-6,-10)/(6,-10)`, hips `(-4,8)/(4,8)`, upper/lower arm 12/11, thigh/shin 12/12, and belay loop `(0,9)`, all in local rig units. `joint()` at lines 61–66 clamps target distance to `abs(a-b)+.01 .. a+b-.01`, computes one elbow/knee branch from a sign, and returns `[root, middle, endpoint]`. A clamped target silently changes endpoint location; no unreachable diagnostic, view convention or joint-angle envelope exists.

`arms[i][2]` is the wrist endpoint. Gloves and held bottles, food, gear, map and spoon are transformed from that point (`characters.js:296–300`). It is not a palm center, fingertip or grasp patch. `legs[i][2]` is the ankle endpoint. Existing boot strokes are artwork attached there; the endpoint is not a heel, toe, sole or rolling foot landmark. Keep these meanings through any adapter.

Contact flags (`leftHand`, `rightHand`, `leftFoot`, `rightFoot`) are logical pose/route state. Rock routes keep named hand/foot targets and holds (`characters.js:178–207`); walk routes maintain endpoint holds (`209–238`); work routes can check that a wrist-derived grip target is within reach and plant ankle-derived feet (`240–255`). These are useful authored endpoint constraints, not proof of visible palm or sole contact, terrain collision, balance, forces, or full-body natural gait. Meal walking similarly pins endpoint targets and re-solves the legacy joints (`habitat-meal.js:33–48, 78–91`).

## Identity and care boundaries

The canonical identity registry is exactly seven entries (`characters.js:10–18`): Candy/Pip, Moss, Sprout, Ridge, Aster, Sage and Pebble. Candy, Moss and Sprout use the stylized `drop` torso; Ridge, Aster and Sage use `human`; Pebble is `swaddled`. Sprout is marked young. Pebble is both young and infant, and `create()` requires infant identity and `infant` role together (`46–54`). Theme configuration explicitly rejects an infant replacement for regular actor mounts (`56–60`; Woodland lead has additional eligibility checks).

Pebble's visible art is swaddled, with no exposed limbs (`characters.js:277–278`). `infantSupportPoints` names separate head/body locations; `cradle-care` has two quiet wrist targets, and Green House places the swaddled illustration under Aster's support metadata (`habitat-community.js:124, 194–197`). These are legacy support points and wrist endpoints, not rendered palm surfaces. A0 covers swaddled support only; exposed infant anatomy or infant gait is outside scope.

Fern is not an eighth rendered identity. `habitat-community.js:26, 54` calls Fern `remembered`; the remembrance routine displays flowers (`113, 150`) and makes no Fern body. Do not add Fern to the rig matrix or depict a body for the memorial.

## Rig bounds and existing drawing scales

Use rig units below, not invented screen-pixel sizes. Across the shared `pose()` actions, authored wrist targets span x `-20..22`, y `-27..11`; ankle targets span x `-16..16`, y `20..30`, with action-specific arithmetic and oscillation in `characters.js:68–138`. These are target limits before reach clamping, not measured painted bounds. `walkContacts()` adds route-scaled root travel, alternating stride targets and at most `4*scale` swing lift (`209–233`). Rock contact routes use authored stations and add route-scaled clearance to moving feet (`178–207`). These expressions are the nominal target envelope, not visible bounds: IK may clamp, and equipment/art extends beyond endpoints.

The two-link reach radii are `23` for each arm and `24` for each leg, with the `.01` margin above/below in `joint()`. The widest possible root-to-endpoint radius is therefore just under those sums; this is not a complete silhouette or prop crop bound. The source has no consolidated cast-and-prop bounding box. A0 references must include visible art and props when measuring bounds, and record both rig landmarks and crop edges.

Current renderer scale expressions to preserve and measure against:

* Woodland Dashboard uses `pixels=max(36,min(80,layout.height*.30))`, multiplied by `.73` for young characters, then converts through `layout.width/800` and `layout.height/360` (`woodland-time.js:57–61`); art receives `scale(${scale.x} ${scale.y})` at `228–230`. Its canvas `viewBox` is `0 0 800 360`.
* Woodland Immersive derives character height from `max(80,min(160,layout.height*.235))`, then `.70` for young actors; `size()` converts that height into independent viewBox x/y scales using `layout.sx/sy` (`woodland-immersive.js:96–99`). Record its `size()` result and actor art scale rather than infer screen pixels from SVG units.
* Green House uses nominal actor heights 54, 48 and 38 for Aster, Sage and Sprout, divided by `frame.actorPixels` to get `actorScale` (`habitat-community.js:75–76`). Meal geometry further scales offsets from that base (`habitat-meal.js:21, 32–48`).
* Candy's 80-by-80 sprite uses its CSS lane size and positional transform (`app.js:169–183`); shared identity overrides mount at `scale(.75)` (`characters.js:326`).
* Time Climber I uses `size=44` or `60` according to viewport height and `scale=size/66` (`time-climber.js:33–35`). Time Climber II derives scale as `max(.3,min(h*.64/150,w*.22/80))` and applies route zoom (`time-climber-ii.js:80–86`). Both are separate scene drawings.

For each reference capture, note renderer, identity, role, action, facing, source revision, scale expression inputs/results, local joint/endpoint bounds, equipment/prop bounds, and whether anything clips. Compare native display size and enlarged inspection. Never convert a coordinate expression to a generic pixel promise; browser viewport and preserveAspectRatio behavior vary by renderer.

## Lawful authored reference protocol

Create original poses directly for this stylized cast. Reference sheets may use stick/skeleton landmarks, simple silhouettes and authored scene props; they should explain the rig's conventions, not portray medical measurement. State local axes as +x right, +y down and annotate character-left/right separately from screen-left/right; label front, turned and side views explicitly.

Do not copy medical illustrations, third-party character art, photographs, pose-library images, or proprietary models into the repo. Do not trace a reference image or claim a clinical joint angle. If a nonvisual movement source is useful, record its title, author/publisher, URL, license and the narrow factual point used; otherwise keep the reference entirely project-authored. The A0 output is a pose matrix and inventory, not a claim that the current renderer already meets it.

Minimum authored matrix for every eligible identity: front/turned/side; face screen-left and screen-right; relaxed stand; reach; open/support and tool-grip hand intent; walk; crouch/kneel. Add climbing support and equipment views for Ridge/Moss/eligible adult Woodland and climber identities, supervised play for Sprout, and adult head/body support with Pebble's swaddle. Default Candy needs distinct run, bike and broom/work reference poses because its active sprite behavior differs. Pebble has no adult gait matrix; Fern has memorial flowers only.

The companion A1 profile record now defines numeric envelopes and palm/sole landmarks for static inspection. This inventory does not validate a live-scene migration. A2 remains unimplemented; this baseline does not start it. Retain all legacy source paths above as the compatibility inventory for later migration.
