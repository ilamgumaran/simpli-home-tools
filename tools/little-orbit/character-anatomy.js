// SPDX-License-Identifier: LicenseRef-Simpli-Noncommercial-1.0
// Copyright (C) 2026 ilamgumaran and contributors
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.DeskAnatomy = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const freeze = value => {
    if (value && typeof value === 'object' && !Object.isFrozen(value)) {
      Object.freeze(value);
      Object.keys(value).forEach(key => freeze(value[key]));
    }
    return value;
  };
  const deg = value => value * Math.PI / 180;
  const profiles = freeze({
    'legacy-v1': {
      id: 'legacy-v1', version: 1, kind: 'articulated', applicable: { legacy: true },
      roots: { shoulders: [{ x: -6, y: -10 }, { x: 6, y: -10 }], hips: [{ x: -4, y: 8 }, { x: 4, y: 8 }] },
      segments: { upperArm: 12, forearm: 11, thigh: 12, shin: 12 },
      hand: { length: 3.4, width: 2.8, fingers: 2 }, foot: { heel: 2, ball: 3.5, toe: 6.5, sole: 3.2 },
      head: { radius: 7, centerY: -24 }, limitsByView: limits()
    },
    'adult-human-v1': {
      id: 'adult-human-v1', version: 1, kind: 'articulated', applicable: { human: true },
      roots: { shoulders: [{ x: -6, y: -10 }, { x: 6, y: -10 }], hips: [{ x: -4, y: 8 }, { x: 4, y: 8 }] },
      segments: { upperArm: 12, forearm: 11, thigh: 12, shin: 12 },
      hand: { length: 3.4, width: 2.8, fingers: 2 }, foot: { heel: 2, ball: 3.5, toe: 6.5, sole: 3.2 },
      head: { radius: 7, centerY: -24 }, limitsByView: limits()
    },
    'adult-drop-v1': {
      id: 'adult-drop-v1', version: 1, kind: 'articulated', applicable: { body: 'drop' },
      roots: { shoulders: [{ x: -6, y: -10 }, { x: 6, y: -10 }], hips: [{ x: -4, y: 8 }, { x: 4, y: 8 }] },
      segments: { upperArm: 12, forearm: 11, thigh: 12, shin: 12 },
      hand: { length: 3, width: 2.6, fingers: 1.8 }, foot: { heel: 2, ball: 3, toe: 6, sole: 3 },
      head: { radius: 7, centerY: -24 }, limitsByView: limits()
    },
    'learner-v1': {
      id: 'learner-v1', version: 1, kind: 'articulated', applicable: { young: true },
      roots: { shoulders: [{ x: -5, y: -9 }, { x: 5, y: -9 }], hips: [{ x: -3, y: 7 }, { x: 3, y: 7 }] },
      segments: { upperArm: 10, forearm: 9, thigh: 10, shin: 9.5 },
      hand: { length: 2.5, width: 2.4, fingers: 1.6 }, foot: { heel: 1.6, ball: 2.7, toe: 4.8, sole: 2.6 },
      head: { radius: 7.5, centerY: -22 }, limitsByView: limits()
    },
    'swaddled-v1': {
      id: 'swaddled-v1', version: 1, kind: 'infant', applicable: { articulated: false },
      roots: {}, segments: {}, head: { radius: 7, centerY: -20 },
      infantSupport: { head: { x: -6, y: -6 }, body: { x: 4, y: 0 } }
    }
  });

  function limits() {
    const flexion = { elbow: [5, 145], knee: [5, 155] };
    const wrist = [-65, 65], ankle = [-35, 45];
    const views = {};
    [['front',175,15,165], ['turned',170,20,160], ['side',165,25,155]].forEach(([name, shoulder, hipMin, hipMax]) => {
      views[name] = { shoulder: [-shoulder, shoulder], hip: [hipMin, hipMax], ...flexion, wrist, ankle,
        preferredBend: { left: 1, right: -1 } };
    });
    return views;
  }
  const finite = n => typeof n === 'number' && Number.isFinite(n);
  const point = (p, label) => {
    if (!p || !finite(p.x) || !finite(p.y)) throw new Error((label || 'point') + ' must have finite x and y coordinates');
  };
  const profileFor = character => {
    if (typeof character === 'string' && Object.hasOwn(profiles, character)) return profiles[character];
    if (!character || typeof character !== 'object') throw new Error('character description must identify infant, young, human, or body drop');
    if (character.infant === true) return profiles['swaddled-v1'];
    if (character.young === true) return profiles['learner-v1'];
    if (character.body === 'drop') return profiles['adult-drop-v1'];
    if (character.body === 'human') return profiles['adult-human-v1'];
    throw new Error('unsupported character description');
  };
  function articulated(id) {
    if (!Object.hasOwn(profiles, id)) throw new Error('unknown anatomy profile: ' + id);
    const profile = profiles[id];
    if (profile.kind !== 'articulated') throw new Error('profile ' + id + ' has support-only anatomy; articulated hands and feet are unavailable');
    return profile;
  }
  function transformPoint(p, transform) {
    point(p); transform = transform || {};
    const x = transform.x === undefined ? 0 : transform.x, y = transform.y === undefined ? 0 : transform.y;
    const rotation = transform.rotation === undefined ? 0 : transform.rotation;
    const sx = transform.scaleX === undefined ? 1 : transform.scaleX, sy = transform.scaleY === undefined ? 1 : transform.scaleY;
    if (![x,y,rotation,sx,sy].every(finite) || sx === 0 || sy === 0) throw new Error('transform requires finite translation/rotation and nonzero finite scales');
    const px = p.x * sx, py = p.y * sy, c = Math.cos(rotation), s = Math.sin(rotation);
    const result = { x: x + px*c - py*s, y: y + px*s + py*c };
    if (![result.x,result.y].every(finite)) throw new Error('transform exceeds finite numeric range');
    return result;
  }
  function handFrame(profileId, wrist, angle, options) {
    const profile = articulated(profileId); point(wrist, 'wrist');
    if (!finite(angle)) throw new Error('hand angle must be finite');
    const side = options && options.side !== undefined ? options.side : 'left';
    if (side !== 'left' && side !== 'right') throw new Error('hand side must be left or right');
    const h = profile.hand, sign = side === 'left' ? -1 : 1;
    const raw = { wrist: {x:0,y:0}, palm: {x:.55*h.length,y:0}, grasp: {x:.55*h.length,y:0}, support: {x:.55*h.length,y:0},
      knuckles: {x:h.length,y:0}, fingertips: {x:h.length+h.fingers,y:0}, thumb: {x:.4*h.length,y:sign*.65*h.width} };
    const out = {};
    Object.keys(raw).forEach(key => { const p = transformPoint(raw[key], {x:wrist.x,y:wrist.y,rotation:angle}); out[key] = p; });
    out.angle = angle; return out;
  }
  function footFrame(profileId, ankle, angle) {
    const profile = articulated(profileId); point(ankle, 'ankle');
    if (!finite(angle)) throw new Error('foot angle must be finite');
    const f = profile.foot, raw = { ankle:{x:0,y:0}, heel:{x:-f.heel,y:f.sole}, ball:{x:f.ball,y:f.sole}, toe:{x:f.toe,y:f.sole}, sole:{x:0,y:f.sole}, support:{x:(f.ball-f.heel)/2,y:f.sole} };
    const out = {}; Object.keys(raw).forEach(key => { out[key] = transformPoint(raw[key], {x:ankle.x,y:ankle.y,rotation:angle}); });
    out.angle = angle; return out;
  }
  function solveLimb(input) {
    if (!input || typeof input !== 'object') throw new Error('solveLimb requires an options object');
    const {root, target, upper:a, lower:b} = input; point(root, 'root'); point(target, 'target');
    const bend = input.bend === undefined ? 1 : input.bend, flex = input.flexion, ra = input.rootAngle;
    if (![a,b].every(n => finite(n) && n > 0)) throw new Error('upper and lower lengths must be finite and positive');
    if (bend !== 1 && bend !== -1) throw new Error('bend must be +1 or -1');
    if (!Array.isArray(flex) || flex.length !== 2 || !flex.every(finite) || flex[0] < 0 || flex[1] > Math.PI || flex[0] > flex[1]) throw new Error('flexion bounds must be ordered within 0..pi radians');
    if (!Array.isArray(ra) || ra.length !== 2 || !ra.every(finite) || ra[0] < -Math.PI || ra[1] > Math.PI || ra[0] > ra[1]) throw new Error('rootAngle bounds must be ordered within -pi..pi radians');
    const dx=target.x-root.x, dy=target.y-root.y, rawD=Math.hypot(dx,dy);
    if (![dx,dy,rawD,a*a,b*b,2*a*b].every(finite)) throw new Error('solver geometry exceeds finite numeric range');
    const direction=rawD === 0 ? 0 : Math.atan2(dy,dx);
    // In this forward-axis convention, flexion is the signed turn between the
    // two bone vectors, so d²=a²+b²+2ab*cos(flexion).
    const nearD=Math.sqrt(Math.max(0,a*a+b*b+2*a*b*Math.cos(flex[0]))), farD=Math.sqrt(Math.max(0,a*a+b*b+2*a*b*Math.cos(flex[1])));
    const minD=Math.min(nearD,farD), maxD=Math.max(nearD,farD);
    if (![nearD,farD,minD,maxD].every(finite)) throw new Error('solver reach envelope exceeds finite numeric range');
    const d=Math.max(minD,Math.min(maxD,rawD)), clamped=d !== rawD;
    const denom=2*a*Math.max(d, Number.EPSILON);
    let cosine=(a*a+d*d-b*b)/denom; cosine=Math.max(-1,Math.min(1,cosine));
    let phi=direction + bend*Math.acos(cosine), normalized=Math.atan2(Math.sin(phi),Math.cos(phi));
    const rootAngle=Math.max(ra[0],Math.min(ra[1],normalized)), rootClamped=rootAngle !== normalized;
    const actualFlex=Math.acos(Math.max(-1,Math.min(1,(d*d-a*a-b*b)/(2*a*b))));
    const endAngle=rootAngle-bend*actualFlex;
    const middle={x:root.x+a*Math.cos(rootAngle),y:root.y+a*Math.sin(rootAngle)};
    const end={x:middle.x+b*Math.cos(endAngle),y:middle.y+b*Math.sin(endAngle)};
    if (![d,denom,cosine,phi,normalized,rootAngle,actualFlex,endAngle,middle.x,middle.y,end.x,end.y].every(finite)) throw new Error('solver result exceeds finite numeric range');
    const reason = clamped ? (rawD < minD ? 'target-too-close' : 'target-too-far') : rootClamped ? 'root-angle-clamped' : null;
    return {points:[{x:root.x,y:root.y},middle,end], reached:!clamped && !rootClamped && Math.hypot(end.x-target.x,end.y-target.y)<1e-8,
      clamped:clamped || rootClamped, reason, flexion:actualFlex, rootAngle};
  }

  const poseTargets = {
    neutral:{hands:[{x:-11,y:10},{x:11,y:10}],feet:[{x:-8,y:30},{x:8,y:30}]},
    reach:{hands:[{x:-13,y:-27},{x:13,y:-25}],feet:[{x:-9,y:29},{x:9,y:29}]},
    grip:{hands:[{x:-8,y:0},{x:12,y:-2}],feet:[{x:-10,y:29},{x:10,y:29}]},
    walk:{hands:[{x:-14,y:5},{x:12,y:8}],feet:[{x:-14,y:27},{x:14,y:25}]},
    crouch:{hands:[{x:-14,y:4},{x:14,y:4}],feet:[{x:-6,y:22},{x:6,y:22}]},
    kneel:{hands:[{x:-12,y:2},{x:12,y:2}],feet:[{x:-5,y:20},{x:5,y:20}]},
    care:{hands:[{x:-9,y:-7},{x:8,y:-4}],feet:[{x:-9,y:29},{x:9,y:29}]}
  };
  function referencePose(profileId, poseName, options) {
    if (!Object.hasOwn(profiles, profileId)) throw new Error('unknown anatomy profile: '+profileId);
    const profile=profiles[profileId];
    poseName=poseName || 'neutral'; options=options || {}; const view=options.view || 'front';
    if (!['front','turned','side'].includes(view)) throw new Error('view must be front, turned, or side');
    if (!Object.hasOwn(poseTargets, poseName)) throw new Error('unknown reference pose: '+poseName);
    if (profile.kind === 'infant') return {profileId,view,arms:[],legs:[],handFrames:[],footFrames:[],supportFrame:{head:{...profile.infantSupport.head},body:{...profile.infantSupport.body}},diagnostics:[]};
    const limits=profile.limitsByView[view], targets=poseTargets[poseName], arms=[], legs=[], handFrames=[], footFrames=[], diagnostics=[];
    const scale=profile.id==='learner-v1'?.8:1;
    ['left','right'].forEach((side,index) => {
      const bend=side==='left'?1:-1, shoulder=profile.roots.shoulders[index], hip=profile.roots.hips[index];
      const armTarget={x:targets.hands[index].x*scale,y:targets.hands[index].y*scale};
      const arm=solveLimb({root:shoulder,target:armTarget,upper:profile.segments.upperArm,lower:profile.segments.forearm,bend,flexion:limits.elbow.map(deg),rootAngle:limits.shoulder.map(deg)});
      const legTarget={x:targets.feet[index].x*scale,y:targets.feet[index].y*scale};
      const leg=solveLimb({root:hip,target:legTarget,upper:profile.segments.thigh,lower:profile.segments.shin,bend,flexion:limits.knee.map(deg),rootAngle:limits.hip.map(deg)});
      arms.push(arm.points); legs.push(leg.points);
      const handAngle=arm.points.length ? Math.atan2(arm.points[2].y-arm.points[1].y,arm.points[2].x-arm.points[1].x) : 0;
      const footAngle=0; handFrames.push(handFrame(profileId,arm.points[2],handAngle,{side})); footFrames.push(footFrame(profileId,leg.points[2],footAngle));
      [[arm,'arm',armTarget],[leg,'leg',legTarget]].forEach(([result,limb,target]) => {
        if (!result.reached) {
          const actual=result.points[2], targetDistance=Math.hypot(actual.x-target.x,actual.y-target.y);
          diagnostics.push({side,limb,reached:false,clamped:result.clamped,reason:result.reason || 'unreachable',
            target:{x:target.x,y:target.y},actual:{x:actual.x,y:actual.y},targetDistance});
        }
      });
    });
    return {profileId,view,arms,legs,handFrames,footFrames,diagnostics};
  }
  return freeze({profiles,profileFor,handFrame,footFrame,transformPoint,solveLimb,referencePose});
});
