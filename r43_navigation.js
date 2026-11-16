'use strict';
/* SEMITS Health R4.3 reorganised navigation and connected journey.
   No changes to R4.2 modules, stored profile schema or clinical logic. */
(function(){
 const groups=[
  ['START HERE',['today','journey','profiles','hub']],
  ['YOUR WELLNESS PLAN',['assistant','foodstudio','gym','lifestyle']],
  ['DAILY TRACKING',['selfie','video','reports']],
  ['HEALTH & EVIDENCE',['medicalintelligence','food','longevity','countries','science']],
  ['TOOLS & SETTINGS',['privacy']]
 ];
 const labels={today:'Today',journey:'Start Here · Guided Setup',profiles:'Profiles',hub:'Health Profile & Vault',
  assistant:'Personal Wellness Plan',foodstudio:'Food Intelligence Studio',gym:'Exercise & Workouts',
  lifestyle:'Recovery & Lifestyle',selfie:'Daily Selfie',video:'Progress Video',reports:'Reports & Trends',
  medicalintelligence:'Medical Records & Evidence',food:'Food Research Library',
  longevity:'Healthy Ageing',countries:'Cultural Foods',science:'Research Library',privacy:'Privacy & Settings'};
 const icons={journey:'◎'};
 const steps=[
  {id:'profiles',title:'Create or choose a profile',detail:'Set up the person using SEMITS. Each profile should keep its own plan and journal.'},
  {id:'hub',title:'Basic health details',detail:'Age, height, weight, activity and goals. Medical information is optional.'},
  {id:'assistant',title:'Generate a personal starting plan',detail:'Choose fitness, weight, recovery and lifestyle priorities; safety screening precedes advice.'},
  {id:'foodstudio',title:'Record food and review nutrition',detail:'Type any meal or select a test photo. Confirm ingredients, portions, cooking details and optional reference nutrition.'},
  {id:'gym',title:'Track exercise and recovery',detail:'Log actual activity and use the plan as education, not automatic medical clearance.'},
  {id:'reports',title:'Review trends and adjust',detail:'Review changes over time using your real entries; missing information remains unknown.'}
 ];
 const E=v=>esc(String(v??''));
 function stageCard(step,n){return '<a class="r43-stage" href="#'+step.id+'"><span class="r43-stage-number">'+n+'</span><span><strong>'+E(step.title)+'</strong><small>'+E(step.detail)+'</small></span><span class="r43-stage-arrow" aria-hidden="true">→</span></a>'}
 function journey(){
  return '<section class="r4-hero"><div><div class="r4-eyebrow">SEMITS HEALTH · YOUR JOURNEY</div><h1>Start here</h1><p>One connected path from personal profile to food, activity, daily monitoring and progress.</p></div></section>'+
  '<section class="r43-journey-intro"><div><h2>Choose how to begin</h2><p><strong>Without medical records:</strong> complete a basic profile and get general educational wellness guidance.</p>'+
  '<p><strong>With optional medical records:</strong> review files separately in Medical Intelligence; unverified findings cannot automatically change clinical dietary or exercise advice.</p></div>'+
  '<div class="r43-journey-actions"><a class="btn" href="#profiles">Set up profile</a><a class="btn outline" href="#assistant">Build my plan</a></div></section>'+
  '<section class="r43-journey-flow" aria-label="Your connected SEMITS process">'+steps.map((s,i)=>stageCard(s,i+1)).join('')+'</section>'+
  '<section class="r43-journey-extra"><h2>Explore specialised tools</h2><div class="r43-journey-links">'+
  '<a href="#medicalintelligence">Optional medical-record review</a><a href="#food">Food research library</a>'+
  '<a href="#selfie">Daily selfie</a><a href="#video">Progress video</a><a href="#privacy">Privacy settings</a></div></section>';
 }
 menus.splice(1,0,['journey',icons.journey,'Start Here · Guided Setup']);
 sections.journey=journey;
 function renderGroups(){
  const el=document.querySelector('#nav');if(!el)return;
  let active=location.hash.slice(1)||'today';
  const lookup=new Map(menus.map(([id,icon,label])=>[id,{id,icon,label}]));
  let output='';
  for(const [name,items] of groups){
   const existing=items.map(i=>lookup.get(i)).filter(Boolean);
   if(!existing.length)continue;
   output+='<div class="r43-nav-group"><div class="r43-nav-heading">'+E(name)+'</div>'+
     existing.map(m=>'<a href="#'+m.id+'" class="'+(active===m.id?'active':'')+'"'+(active===m.id?' aria-current="page"':'')+'><span class="ico">'+E(m.icon)+'</span>'+E(labels[m.id]||m.label)+'</a>').join('')+'</div>';
  }
  const grouped=new Set(groups.flatMap(x=>x[1]));
  const extras=menus.filter(([id])=>!grouped.has(id));
  if(extras.length)output+='<div class="r43-nav-group"><div class="r43-nav-heading">MORE TOOLS</div>'+extras.map(([id,icon,label])=>'<a href="#'+id+'" class="'+(active===id?'active':'')+'"><span class="ico">'+E(icon)+'</span>'+E(label)+'</a>').join('')+'</div>';
  el.innerHTML=output;
  const current=lookup.get(active);
  const crumb=document.querySelector('#crumb');if(crumb&&current)crumb.textContent=labels[active]||current.label;
 }
 const oldNav=nav;
 nav=function(){oldNav();renderGroups()};
 window.addEventListener('hashchange',()=>{renderGroups()});
 renderGroups();
})();