// SPDX-License-Identifier: LicenseRef-Simpli-Noncommercial-1.0
// Copyright (C) 2026 ilamgumaran and contributors
// Static A1 inspection; it owns no live scene or animation loop.
(()=>{
 'use strict';
 const ns='http://www.w3.org/2000/svg',get=id=>document.getElementById(id);
 const controls=['character','reference-pose','reference-view','reference-facing','reference-size','reference-landmarks'];
 function node(tag,attributes,parent){
  const result=document.createElementNS(ns,tag);
  for(const [key,value] of Object.entries(attributes))result.setAttribute(key,String(value));
  parent.append(result);return result;
 }
 function drawReference(svg,profile,reference,small){
  svg.replaceChildren();
  const view=get('reference-view').value,facing=Number(get('reference-facing').value);
  const projection={front:1,turned:.82,side:.62}[view];
  const layer=node('g',{transform:`scale(${facing*projection} 1)`,'data-profile':profile.id},svg);
  const point=(p,color,name)=>node('circle',{cx:p.x,cy:p.y,r:.85,fill:color,'data-landmark':name},layer);
  const line=(points,color,width=1.3,extra={})=>node('polyline',{points:points.map(p=>`${p.x},${p.y}`).join(' '),fill:'none',stroke:color,'stroke-width':width,'stroke-linecap':'round','stroke-linejoin':'round',...extra},layer);
  const show=get('reference-landmarks').checked;
  if(profile.kind==='infant'){
   node('path',{d:'M-11 -4Q-9 -10 -3 -8L7 -3Q13 3 6 5L-6 3Z',fill:'#e6d6b8',stroke:'#8ca89a','stroke-width':1},layer);
   for(const [name,p] of Object.entries(reference.supportFrame))if(show)point(p,name==='head'?'#e5c986':'#82b9c1','support-'+name);
  }else{
   node('circle',{cx:0,cy:profile.head.centerY,r:profile.head.radius,fill:'#c68d67',stroke:'#d4decf','stroke-width':.8},layer);
   line([profile.roots.shoulders[0],profile.roots.shoulders[1]],'#91bbaa');
   line([{x:0,y:profile.roots.shoulders[0].y},{x:0,y:profile.roots.hips[0].y}],'#91bbaa',3);
   line([profile.roots.hips[0],profile.roots.hips[1]],'#91bbaa');
   for(const [kind,limbs] of [['arm',reference.arms],['leg',reference.legs]])limbs.forEach((limb,i)=>{
    line(limb,kind==='arm'?'#c68d67':'#91a0bc',2,{'data-limb':kind+'-'+i});
    if(show)limb.forEach((p,j)=>point(p,'#d4decf',kind+'-'+i+'-'+j));
   });
   reference.handFrames.forEach((frame,i)=>{
    line([frame.wrist,frame.knuckles,frame.fingertips],'#e5c986',1);
    line([frame.palm,frame.thumb],'#d1aaba',1);
    if(show)for(const name of ['wrist','palm','grasp','thumb','fingertips'])point(frame[name],name==='thumb'?'#d1aaba':'#e5c986','hand-'+i+'-'+name);
   });
   reference.footFrames.forEach((frame,i)=>{
    line([frame.ankle,frame.heel,frame.ball,frame.toe],'#82b9c1',1.4);
    if(show)for(const name of ['ankle','heel','ball','toe'])point(frame[name],'#82b9c1','foot-'+i+'-'+name);
   });
   if(show)for(const item of reference.diagnostics){
    line([item.actual,item.target],'#e69479',.7,{'stroke-dasharray':'1.5 1.5'});
    node('circle',{cx:item.target.x,cy:item.target.y,r:1.4,fill:'none',stroke:'#e69479','stroke-width':.7,'data-landmark':`target-${item.side}-${item.limb}`},layer);
   }
  }
  const bounds=layer.getBBox(),padding=3;
  const left=bounds.x*Math.abs(projection),right=(bounds.x+bounds.width)*Math.abs(projection);
  const minX=facing<0?-right:left,width=right-left+padding*2,height=bounds.height+padding*2;
  svg.setAttribute('viewBox',`${minX-padding} ${bounds.y-padding} ${width} ${height}`);
  if(small){const size=Number(get('reference-size').value);svg.style.height=size+'px';svg.style.width=(size*width/height)+'px';}
  svg.dataset.profile=profile.id;svg.dataset.view=view;svg.dataset.facing=String(facing);
 }
 function draw(){
  const id=get('character').value,identity=DeskCharacters.identities[id];
  const profile=DeskCharacters.anatomyProfile(identity),view=get('reference-view').value;
  const reference=DeskAnatomy.referencePose(profile.id,get('reference-pose').value,{view});
  get('reference-pose').disabled=profile.kind==='infant';
  for(const [id,small] of [['anatomy-reference',false],['anatomy-native',true]])drawReference(get(id),profile,reference,small);
  const diagnostics=reference.diagnostics||[];
  const clamped=Array.isArray(diagnostics)?diagnostics.filter(item=>item.clamped||item.reached===false).length:Object.values(diagnostics).filter(item=>item.clamped||item.reached===false).length;
  get('anatomy-status').textContent=identity.name+' · '+profile.id+(profile.kind==='infant'?' · covered limbs; head and body support only':` · ${get('reference-pose').selectedOptions[0].textContent} · ${clamped} constrained target${clamped===1?'':'s'}`)+(clamped?' · hollow coral markers show requested targets outside the envelope':'');
  get('anatomy-limits').textContent=profile.kind==='infant'?'Support anchors are a reference frame; visible caregiver palm contacts are a later stage.':`Authored ${view} envelope (degrees): elbow ${profile.limitsByView[view].elbow.join('–')}; knee ${profile.limitsByView[view].knee.join('–')}; wrist ${profile.limitsByView[view].wrist.join('–')}; ankle ${profile.limitsByView[view].ankle.join('–')}.`;
 }
 controls.forEach(id=>get(id).addEventListener('change',draw));
 draw();
})();
