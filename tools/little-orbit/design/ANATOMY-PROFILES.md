<!-- SPDX-License-Identifier: LicenseRef-Simpli-Noncommercial-1.0 -->
<!-- Copyright (C) 2026 ilamgumaran and contributors -->
# Anatomy profiles and A1 reference geometry

This is the A1 pure geometry foundation for workshop review. The exported
records are versioned, recursively frozen authored envelopes in the existing
stylized coordinate system. They describe drawing proportions; they are not
medical measurements, forces, joint capability, or evidence of contact. The
module does not change a live scene, renderer, gait, contact, prop, or legacy
pose meaning. Later silhouette and scene-adapter stages remain separate work.

## Profile dimensions

| Profile | Roots (left/right) | Arm / leg segment lengths | Hand (palm, width, fingers) | Foot (heel, ball, toe, sole) | Head (radius, center Y) |
| --- | --- | --- | --- | --- | --- |
| `legacy-v1` | shoulders (-6,-10)/(6,-10); hips (-4,8)/(4,8) | 12 / 11; 12 / 12 | 3.4, 2.8, 2 | 2, 3.5, 6.5, 3.2 | 7, -24 |
| `adult-human-v1` | same as legacy | 12 / 11; 12 / 12 | 3.4, 2.8, 2 | 2, 3.5, 6.5, 3.2 | 7, -24 |
| `adult-drop-v1` | same as legacy | 12 / 11; 12 / 12 | 3, 2.6, 1.8 | 2, 3, 6, 3 | 7, -24 |
| `learner-v1` | shoulders (-5,-9)/(5,-9); hips (-3,7)/(3,7) | 10 / 9; 10 / 9.5 | 2.5, 2.4, 1.6 | 1.6, 2.7, 4.8, 2.6 | 7.5, -22 |
| `swaddled-v1` | no articulated roots | no articulated segments | covered | covered | 7, -20 |

The swaddled profile has support anchors only: head (-6,-6), body (4,0), with
`applicable.articulated` false. It deliberately supplies no visible hand or
foot geometry. A learner profile is a distinct authored proportion set; it
does not imply a child gait, climbing, or retargeting behavior. The adult drop
profile retains the shared torso envelope; its distinction here is the named
profile and hand/foot proportions.

`profileFor` selects infant, young, body drop, then human descriptions in that
order (infant/young take precedence). It also accepts a profile ID. Unsupported
descriptions and unknown IDs throw. Public coordinates and angles must be
finite; transforms permit negative and nonuniform scale, but reject zero scale.
Transform order is scale, rotate, translate. Angles are radians, clockwise in
screen coordinates (+x right, +y down). Mirroring is performed only through
the transform helper.

## Landmark frames

The hand frame is rooted at WRIST, which remains the arm bone endpoint. Its
forward axis is local +x. Palm, grasp, and support sit at 0.55 palm lengths;
knuckles at one palm length; fingertips add the `fingers` length; the thumb is at
(0.4 palm length, side-sign × 0.65 width). The side sign is -1 for left and +1
for right. Every landmark is rotated about the supplied wrist.

The foot frame is rooted at ANKLE, which remains the leg bone endpoint. Heel,
ball, toe, sole, and support are respectively (-heel,sole), (ball,sole),
(toe,sole), (0,sole), and ((ball-heel)/2,sole), rotated about the ankle.
Infant hand/foot frame requests fail explicitly because those limbs are covered.

## Solver and constraints

`solveLimb` takes positive upper/lower lengths, a bend sign (+1/-1), ordered
flexion bounds within 0..π, and ordered root-angle bounds. It clamps target
distance to the radius range implied by the flexion limits, then clamps the
first bone angle to the supplied root range. Results include both bone joints,
the actual flexion and root angle, `reached`, and a reason when clamped. The
solver does not mutate inputs. At a root-coincident target it chooses +x as the
direction reference and still constructs two valid bone lengths, including the
equal-length fully folded case.

These review limits are authored 2D constraints, expressed as degrees here;
the API receives radians:

| View | Shoulder root | Hip root | Elbow flexion | Knee flexion | Wrist relative | Ankle relative |
| --- | --- | --- | --- | --- | --- | --- |
| front | -175..175° | 15..165° | 5..145° | 5..155° | -65..65° | -35..45° |
| turned | -170..170° | 20..160° | 5..145° | 5..155° | -65..65° | -35..45° |
| side | -165..165° | 25..155° | 5..145° | 5..155° | -65..65° | -35..45° |

Reference records prefer left bend +1 and right bend -1. This is a deterministic
solver preference, not a claim about natural movement. Wrist and ankle limits
are published for review; the A1 reference frames use a neutral wrist and sole
angle and do not yet solve those secondary joints.

## Reference poses

The `neutral`, `reach`, `grip`, `walk`, `crouch`, `kneel`, and `care` fixtures
use explicit wrist and ankle targets in profile-local coordinates. For adults,
the left/right wrist and ankle targets are:

| Pose | Wrist targets (left/right) | Ankle targets (left/right) |
| --- | --- | --- |
| neutral | (-11,10) / (11,10) | (-8,30) / (8,30) |
| reach | (-13,-27) / (13,-25) | (-9,29) / (9,29) |
| grip | (-8,0) / (12,-2) | (-10,29) / (10,29) |
| walk | (-14,5) / (12,8) | (-14,27) / (14,25) |
| crouch | (-14,4) / (14,4) | (-6,22) / (6,22) |
| kneel | (-12,2) / (12,2) | (-5,20) / (5,20) |
| care | (-9,-7) / (8,-4) | (-9,29) / (9,29) |

Learner targets use these same authored points scaled by 0.8 about the profile
origin, giving shorter reaches around its distinct shoulder and hip roots while
retaining learner segment lengths. The profile's segment lengths, view limits,
and preferred bend determine the resulting three-point limbs. Returned
arm/leg arrays retain the legacy root-middle-end shape. Hand and foot frames
begin at those unchanged endpoints. Any clamped or unreachable limb is listed
in diagnostics with its side, kind, reason, copied target and actual endpoint,
and the remaining target distance. A failed target is never reported as
reached. For example, close care targets and some side-view targets can meet
the flexion or root-angle boundary and are deliberately reported as clamped.
The infant result contains only support anchors and empty limb/frame
collections.

These are stable geometry fixtures, not animated poses. Targets are centralized
authoring references and may be reported as unreachable under a profile's
constraints. They do not promise ground support, grasp success, body balance,
pose continuity, occlusion, or visual quality. A1 does not alter current live
character proportions or scene positions; fixtures require review before any
scene consumes them.
