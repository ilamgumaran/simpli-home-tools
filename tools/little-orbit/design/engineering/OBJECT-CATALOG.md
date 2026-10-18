<!-- SPDX-License-Identifier: LicenseRef-Simpli-Noncommercial-1.0 -->
# Functional object catalog — visible and hidden parts

Status: **80 proposed functional object/assembly records**, not a finished hardware bill of materials or manufactured design. Every row below needs the full record contract before implementation. Assemblies must expand into named child parts (including fasteners, seals, spacers, pipes and guards) before their detailed art is declared complete. Hidden parts are subject to the same interface/evidence rules as visible ones.

## Required record for every instance

`id`, type, parent/children, purpose, source/assumption status, visible/cutaway/hidden state, material/finish, geometry/units, local frame/axis, bounds and clearance, support/load path, mate/port IDs, input/output motion or fluid state, ratio/phase or index rule, power/control distinction, energy store/loss ownership, contact surfaces and normals, actor/tool sockets, normal/idle/charge/discharge/isolated/fault/quiet states, wear/service/replacement assumptions, rendering level of detail, test fixtures and review status.

A contact-bearing gear additionally needs tooth count, tooth form, pitch/module, center distance, pressure/contact geometry and plane. A shaft needs support centers, coupling type and axial retention. A fluid part needs port direction, closed/return paths and an evidence-backed operating envelope before any physical sizing. A store needs energy state and bounds; an ornament is labeled as an ornament and cannot secretly transmit power. A proposed material is a hypothesis until its wear/compatibility data is reviewed. No catalog row is a pressure rating or construction instruction.

Legend: **V** visible by default, **C** visible in cutaway/study, **H** normally hidden. Materials are visual/design candidates. Connections below identify the intended functional graph; final mate frames and per-part geometry remain implementation deliverables.

## Frame, access and support

| ID / visibility | Object and role | Interfaces, motion and contact | Material/detail and unresolved service |
| --- | --- | --- | --- |
| FR01 / V | Foundation/base | Carries FR02 and all reserve/platform loads; stationary | Cast/stone-like base with explicit feet, anchors and accessible leveling points; support assumptions reviewed. |
| FR02 / V | Main frame and crossmembers | Carries FR03, FR04, regulator and calendar modules | Metal beams/plates, real joints and access spacing; no unsupported floating shafts. |
| FR03 / V+C | Shaft support blocks | Locate each TR/PW arbor and SV01 bearing pair | Bores, caps and retention visible in study; replaceable supports and alignment references. |
| FR04 / V | Platforms, stairs and railings | Ground/support surfaces for AC03, input and service stations | Light non-slip working surfaces contrast with black figures; safe routes, no body clipping. |
| FR05 / V | Guards and inspection windows | Separate people from gears, weight travel and rotor envelopes | Transparent/mesh panels and supports; opening corresponds to an isolated service state. |
| FR06 / V | Environmental case | Bounds dust/contamination exposure, supports service covers | Window seals/vents and access are drawn; no assumption of perfect permanent sealing. |
| FR07 / C | Cutaway/inspection planes | Reveal hidden parts without removing their supports or energy paths | Observer-only visualization, explicitly distinguished from a physical operating state. |
| FR08 / V+C+H | Fasteners, spacers and retaining hardware | Join each module and retain shaft/gear axial position | Per-instance child IDs, washers/keys where needed, maintenance access and wear; not decorative random rivets. |

## People-powered input and main reserve

| ID / visibility | Object and role | Interfaces, motion and contact | Material/detail and unresolved service |
| --- | --- | --- | --- |
| PW01 / V | Hand-crank station | AC04 grips turn a supported axle into PW03 | Two reachable handle positions, rotating grip sleeves, full sweep clearance, radius/torque hypothesis. |
| PW02 / V | Treadle and linkage | AC05 sole drives hinged plate/rod into PW03 | Hinge, return linkage and reachable knee/ankle travel; no invisible reset force. |
| PW03 / C | One-way couplings | PW01/PW02 input to PW05; prevent resting-handle back-drive | Ratchet/freewheel candidate, real pawl/contact surfaces and wear; spring/gravity bias explicitly counted. |
| PW04 / V+C | Torque limiter and disconnect | Bounds/isolate PW05 drive; control reachable from safe platform | Friction or other defined coupling, dissipated slip and inspection; no unexplained force clipping. |
| PW05 / V | Collection shaft | Couples inputs to PW08, HY01 and optional AR01 | Supported axle, keyed couplings/branch clutches, phase and power-flow direction. |
| PW06 / V | Input flywheel | Exchanges finite kinetic energy with PW05 | Hub/rim/spokes, support/guard, changing speed during coast; bearing/windage loss. |
| PW07 / V | Main descending weight | Gravitational store drives timing/display power through PW08 | Travel, load support, position/height gauge and lower limit; distinct from HY04/RG01 masses. |
| PW08 / V+C | Winding drum, cord route and hoist | PW05 charges PW07; regulated discharge feeds RG01 and index power | Drum radius/wrap, supported sheaves, SV04 cord/chain, brake/hold and service access. |

## Regulator and drive isolation

| ID / visibility | Object and role | Interfaces, motion and contact | Material/detail and unresolved service |
| --- | --- | --- | --- |
| RG01 / V | Gravity remontoire mass | PW07/PW08 periodically recharge a smaller local store | Named separate lifted load; finite stroke, charge/release cycle, no double-counted energy. |
| RG02 / C | Remontoire winding cam/linkage | Timing event requests refill through a defined PW08 coupling | Cam, follower, lost-motion/isolation geometry and refill disturbance require proof. |
| RG03 / C | Remontoire isolation/locking parts | Hold drive/load during RG02 refill without corrupting escape release | Latches/stops with defined bias and supports; no instantaneous ideal clutch assumption. |
| RG04 / V | Pendulum rod and bob | Gravity/suspension oscillation controls RG07 | Candidate compensation, bob adjustment, amplitude/swing clearance; temperature/air/support effects unmeasured. |
| RG05 / C | Suspension and leader | Supports RG04 and communicates motion to RG07 | Flexure or pivot choice, alignment and fatigue/service hypothesis; springs counted if used. |
| RG06 / V+C | Escape wheel | Thirty teeth, two half-tooth releases/tooth, coaxial with TR01 reference | Actual locking/impulse geometry and load isolation; not a decorative star with arbitrary phase. |
| RG07 / V+C | Pallets/anchor and link | Alternating release controlled by RG04; gates RG06 | Two contact faces, locking/impulse normals, clearance and wear; dimensioned proof still open. |
| RG08 / V | Rate and setting references | Calibrates RG04 effective geometry; records intended beat/phase | Scale/fiducials and fine adjustment model; a scale is not an accuracy certificate. |

## Transmission and event generation

| ID / visibility | Object and role | Interfaces, motion and contact | Material/detail and unresolved service |
| --- | --- | --- | --- |
| TR01 / V | Seconds arbor and 20-tooth pinion | RG06 average 1 rev/min, drives TR02 and DS01 timing | Supported axis, keyed phase and exact beat convention; register load feedback must be isolated/checked. |
| TR02 / V | Compound A: 120-wheel/20-pinion | 120 meshes TR01's 20; coaxial 20 meshes TR03's 200 | Two planes, rigid coaxial member, matching module per mesh and proper center distances. |
| TR03 / V | Minute arbor: 200-wheel/20-pinion | Overall +1/60 from TR01; 20 drives TR04 | One turn/hour reference, phase-set hour event, supported shaft; tooth/profile/load study pending. |
| TR04 / V | Compound B: 120-wheel/20-pinion | 120 meshes TR03's 20; coaxial 20 drives TR05's 80 | Distinct shaft/planes; avoids geometrical overlap and false mesh directions. |
| TR05 / V | Daily arbor: 80-wheel and midnight cam | Overall +1/24 from TR03; event to CA06 | One turn/day, phase fiducial, cam lift/dwell and timezone-setting limit. |
| TR06 / C | Minute indexer | Once/minute event and separate reserve power step DS02 | Drive cam/pawl or equivalent, six-degree output step and dwell; no arbitrary free ring jump. |
| TR07 / C | Hour indexer | Once/hour event from TR03 steps DS03 | Fifteen-degree step, dwell/detent and carry load isolation. |
| TR08 / V+C | Couplings and setting train | Isolates/rephases registers; connects only declared shafts | Clutch, detent, keyed hubs and setting access; work/energy accounted in physical study. |

## Gregorian calendar and year

| ID / visibility | Object and role | Interfaces, motion and contact | Material/detail and unresolved service |
| --- | --- | --- | --- |
| CA01 / V | D31 day carrier | CA06 indexes 1–4 positions at month end as required | Thirty-one stable day states, mask/detent, printed 01–31 with no invalid date exposed. |
| CA02 / V | MO12 month carrier | One carry from CA01 advances month; 12→01 signals year | Twelve states and readable month convention; no continuous fake month rotation. |
| CA03 / C | Month-length program | CA02 selects 31/30/February input to CA05 | Authored cam/follower truth table; no month-length inference from cosmetic teeth. |
| CA04 / V+C | Four-hundred-year program | Annual carry advances one of 400 positions; leap output to CA05 | 0.9° annual sectors, 97 active years, reader width/manufacturing/index uncertainty unresolved. |
| CA05 / C | Length/skip selector | Combines CA03 and CA04; chooses L and `32−L` | Mechanical logic/cam follower proposal, reachable strokes and positive interlocks to prove. |
| CA06 / C | Midnight/calendar drive and interlock | TR05 event plus reserve work indexes CA01 and stages carries | No duplicate event, year/month sequencing, blocked/stalled state and simultaneous-load test. |
| CA07 / V | Year register module | Four decimal wheels, annual cascade from CA02 | Leading-zero policy, carry path and finite 0001–9999 range; explicit overflow handling. |
| CA08 / C | Year-program synchronizer | Keeps CA04 phase and CA07 year consistent during carry/setting | Alignment marks and setting/check state; no silent wrap or guessed century. |

## Hydraulic demonstration and intermittent work

| ID / visibility | Object and role | Interfaces, motion and contact | Material/detail and unresolved service |
| --- | --- | --- | --- |
| HY01 / V+C | Input-driven hydraulic pump | PW05 work moves fluid through HY03 | Pump chamber/shaft, port direction and loss; no invented pressure/flow rating. |
| HY02 / V | Reservoir/return volume | Supplies HY01; receives HY07 return via HY08 | Level, vent/closed-volume convention and compatible fluid/material hypothesis. |
| HY03 / C | Inlet/non-return valve block | HY01 charging path to HY04; prevents unintended backflow | Seat/closure/bias, leakage and service; each valve gets a child record. |
| HY04 / V+C | Weighted-piston accumulator | Separate lifted load stores HY01 work; discharges to HY07 | Piston, seals, weight guide, support and travel; energy in lifted mass, not a magical fluid. |
| HY05 / V | Position/condition indicators | Read HY04 stroke and qualitative pressure state | Gauge port/scale; normalized art never labeled as measured hardware pressure. |
| HY06 / V+C | Isolation/control/limiting block | Separates charge/hold/work/return and relief paths | Named valve children and flow states; operating envelope pending qualified design. |
| HY07 / V | Work cylinder or motor | Converts HY04 discharge into supported demonstration/index work | One selected output per first prototype, rod/shaft support and reachable full stroke. |
| HY08 / V+C | Lines, return and filtration | Completes HY02–HY07 circuit | Port IDs, bends, mounting, filter/bypass/service model and leakage; no dangling decorative hose. |

## Optional air branch and turbine

| ID / visibility | Object and role | Interfaces, motion and contact | Material/detail and unresolved service |
| --- | --- | --- | --- |
| AR01 / V+C | Compressor | PW05 work raises air supply state | Drive/load and intake/exhaust, losses; never powered solely by its own downstream turbine. |
| AR02 / V | Air receiver concept | Buffers AR01 supply for AR04 | Rated hardware research required before sizing; qualitative store and loss/service only in first art. |
| AR03 / V+C | Air conditioning/filter/dryer | AR01/AR02 supply becomes suitable for AR05 | Flow direction, contamination/water collection, consumables and service. |
| AR04 / V | Air supply controls and flow indication | Meters supply to AR05 or AR07 | Distinct ports/valve states, supply loss indication; flow cannot remain positive with no source. |
| AR05 / V+C | Air-pad carriage/bearing experiment | Supplied film supports a specific demonstrator load | Gap/support surface/normal, supply demand and total energy comparison; not default timing pivot. |
| AR06 / C | Air-loss backup support | Accepts AR05 load when film disappears | Supported stop geometry, no free hovering or person holding the carriage. |
| AR07 / V | Air turbine demonstration | Extracts work from AR04 pressure/flow drop | Rotor/stator, shaft, guard and exhaust; not an unexplained perpetual fan. |
| AR08 / V+C | Air lines and exhaust/diffuser | Completes supplied-flow path to atmosphere or defined return | Fittings/mounts, pressure-drop/loss path, audible/visual cue and service; no closed-loop free power. |

## Readout, indexing and state visibility

| ID / visibility | Object and role | Interfaces, motion and contact | Material/detail and unresolved service |
| --- | --- | --- | --- |
| DS01 / V | S60 seconds ring/register | One six-degree event/second from TR01 reference, sixty states | Mark geometry, legibility, locked dwell and isolation from oscillator load. |
| DS02 / V | M60 minutes ring/register | TR06 six-degree step/minute | Sixty states with phase marks and masked finite-duration index; no old/future timestamp competing. |
| DS03 / V | H24 hour carrier | TR07 fifteen-degree step/hour | Twenty-four states, noon/midnight and 12-hour UI formatting distinction. |
| DS04 / V | Date/month/year windows | Expose CA01/CA02/CA07 only at stable detents | Correct printed value and clip/clearance; rollover/invalid-date masks. |
| DS05 / V+C | Index shutters | Close during register travel; reopen on confirmed state | Drive/linkage or clearly observer-only mask; count mechanical actuation energy if physical. |
| DS06 / C | Register detents and stops | Stable index landing for DS/CA carriers | Real contact/bias, wear and rebound constraint; no spring omitted from inventory. |
| DS07 / V | Observer's current-time glass panel | Device snapshot shows full HH:MM:SS and YYYY-MM-DD | Explicit observer UI, dominant HH:MM, accessible text and read-area protection; not mechanical accuracy evidence. |
| DS08 / V | Reserve/phase gauges | Show PW07/RG01/HY04/AR supply or study state | Values tied to named source/units, no duplicate energy; LOD/contrast and uncalibrated-state labeling. |

## Character interfaces, tools and rest

| ID / visibility | Object and role | Interfaces, motion and contact | Material/detail and unresolved service |
| --- | --- | --- | --- |
| AC01 / V | Head and zero-loop face mark | Shared head frame; group delta 1°/2°/3° | Finite elliptical loops, head-local group identity cue, small-size simplification and quiet frame. |
| AC02 / V | Palm/grip surfaces | Shared wrist/palm anatomy contacts AC04/tools/rails | Correct thumb side, approach/close/release and occlusion; black silhouette against a readable surface. |
| AC03 / V | Feet/soles and stance pads | Shared ankle/heel/toe frames meet FR04 | Load transfer, toe clearance and braces; no root-only planted-foot claim. |
| AC04 / V | Crank grip sleeves | Palm sockets rigid to PW01 handle path | Rotating grip bearing/clearance and reachable arc; hand cannot rotate through forearm limits. |
| AC05 / V | Treadle sole interface | Foot contact fixed to PW02 plate while loaded | Toe/heel normal follows hinge; separate support foot and deliberate unload. |
| AC06 / V | Service/inspection tools | Defined shared inventories and palm sockets | Caliper/light/key/cloth/cartridge; roles carry a selected subset and isolate machine before use. |
| AC07 / V | Teaching bench and sample gears | Disconnected gear-pair model with safe reachable contacts | Ratio labels in study, support/placement and tool stowing; not connected to live drive by implication. |
| AC08 / V | Rest, meal and observation site | Grounded seated/standing poses outside active machinery | Safe family viewing, food/seat contacts, clear sightlines and return path. |

## Wear, consumables and hidden completeness

| ID / visibility | Object and role | Interfaces, motion and contact | Material/detail and unresolved service |
| --- | --- | --- | --- |
| SV01 / V+C | Bearing cartridges | FR03 supports each shaft, selected load/speed regime | Dry/jewel/rolling candidate, lubrication/wear evidence; compare air experiment explicitly. |
| SV02 / C+H | Fluid/case seals | HY04/pumps/valves/FR06 boundaries | Compatibility, permeability, stiction and replaceability; no century-life assumption. |
| SV03 / C+H | Lubrication/contact provisions | Named running contacts, if needed by selected material pair | Access, migration/contamination and aging; “dry” requires supporting evidence. |
| SV04 / V+C | Cords/chains, guides and attachment ends | PW08/PW07/RG01 load routes | Terminations, guides, bending/wear, inspection and lower stops; no invisible load support. |
| SV05 / C+H | Spring/flexure register | Enumerates every bias, suspension or energy spring | Function, frame, deflection, cycle/aging assumptions and replacement; minimizing count is tracked honestly. |
| SV06 / V+C | Condition/fault/setting indicators | States from reserves, indexing, air loss or isolation | Honest stopped/unknown states and service marks, without turning the clock into a diagnostic dashboard. |
| SV07 / V | Inspection covers and service access | FR05/FR06 modules open only in planned isolated vignette | Hinges/fasteners, hand/tool clearance, supported parts and rebuild alignment. |
| SV08 / C | End stops, travel limits and isolation fixtures | PW07/HY04/AR05 and service-load states | Physical support faces and defined state transition; stop force/certification not invented by animation. |

## Detailed prototype records to produce first

**TR02 compound gear:** choose actual tooth profile/module, two gear planes and axle support; define input mesh with TR01-20 and output mesh from TR02-20 to TR03-200. Record center-distance calculations, gear phase, no-interference envelope and visible tooth motion. The 120 and 20 members are rigidly coaxial. Annotate the direction of actual power flow separately from the selected reference speed ratio. One SVG group rotating at a plausible speed is insufficient proof of meshing.

**PW01/AC04 crank:** define axle center/axis, crank radius, two grip frames, sweep envelope and platform/foot targets. Check shoulder/wrist range over a complete revolution, not only one attractive pose. Separate rotating grip sleeves from crank arms; open/release hands before resting. Input work is torque times angular displacement in a dimensioned study, not a label assigned whenever an actor moves.

**HY04 accumulator:** identify the distinct supported lifted mass, piston/guide/seal assembly, travel bounds, charge/discharge/return ports and failure/isolated state. Record the force/displacement and energy relationship only once its parameters are defined. Include the lower backup/stop, service access and source status. A plausible transparent cylinder is not evidence of leakage, pressure suitability or lifetime.

**AC01 face mark:** keep loop count, angular delta, ellipse axes, local center, line width, time-based rotation and projected-size simplification in a shared appearance record. Verify each group at the actual head size and with turning/quiet poses. A tiny face cannot be the only group distinction.

## Completeness checks

Each shaft has support/retention; each gear mesh has a mate and compatible geometry; each rigid connection has an axis/phase; each fluid port has a valid path or explicitly closed state; each store has a named source and finite bounds; every weight has a support and travel limit; each actor/tool contact has a reachable frame. Visible occlusion may hide a real child part but cannot excuse inventing a missing load/return path. E1/E2 must turn this catalog into a connected graph plus dimensioned exemplar records before detailed runtime art is enabled.
