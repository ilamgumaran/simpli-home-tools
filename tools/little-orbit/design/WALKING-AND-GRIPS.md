# Character step: planted walking and reachable tool grips

Status: implemented on `feature/woodland-walking-grips`, 2026-10-05. See [session outcome and milestones](../../../sessions/2026-10-05-woodland-ally/004-walking-grips.md). Builds on the [rock-contact slice](CHARACTER-CONTACTS.md) without changing clock semantics or introducing full dynamics.

## Implemented slice

Woodland survey now stops to read the map, stows it, takes ten authored alternating steps along a short ground route, and rests at the destination. A planted foot remains at its world position as the body advances; the swing foot rises above the ground and lands before it becomes the support foot. Legs keep their segment lengths. The route is defined in the shared world catalog and sampled by `DeskCharacters.walkContacts`; quiet/resumed snapshots reconstruct the destination instead of snapping back to the route entrance.

Gathering fallen sticks and cooking now use reachable authored work sockets. `workContacts` positions the working wrist with fixed limb lengths and two grounded feet. `toolGrip` defines a local grip origin and working end, so the stick and spoon follow the wrist and meet the material/pot. The gathered stick is drawn as a fallen piece rather than a universal saw. The cooking spoon has a grip at its handle and bowl at its work end. Other shared handheld props retain their existing appearance; shelter, crossing and minute-marker work remain authored vignettes awaiting their own socket pass.

Active work gently varies the grip and work point; reduced motion and quiet visits use a fixed complete pose. Map reading stops before walking. No inventory, biological consumption, mass or collision simulation is implied by the new grips. Ground walking is implemented for the lead survey route; companions and other activities retain their previous pose model.

## Acceptance and next milestones

- Densely sample walking: at least one foot planted, no foot below ground, exact planted endpoints and fixed bone lengths.
- Check actual rendered SVG feet against ground/socket coordinates across steps, map stowing and destination rest in hosted/portable forms.
- Check tool handle at wrist and working end at the rendered work socket; retain all clock, font/viewport, pause, screen-care and portable checks.
- Next: reach-aware shelter/crossing work and reciprocal teaching gestures, then a specialist tree route and role. Compact-scene character visibility still requires separate visual refinement.
- Later: supported center-of-mass/collision/dynamics, persistent resources and effort, and richer transitions between activities.

Shared presets and saved browser preferences remain compatible. This adds no settings, modules, network calls or external assets.
