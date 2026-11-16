'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
function env(){
 const listeners={};
 const state={};
 const ctx={
  menus:[],sections:{medicalintelligence:()=>'<h2>Medical records</h2>'},
  r4esc:x=>String(x).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch])),
  vaultKey:'test-vault',r41active:()=>({id:'sample-profile'}),
  livingState:{profile:{age:47,height:166,weight:65,goal:'maintain',cuisine:'mixed'},logs:[],history:{notes:[]}},
  livingEncryptedRead:async k=>state[k],livingEncryptedWrite:async(k,v)=>{state[k]=v},
  r4state:{gym:[]},nav:()=>{},r4renderCurrent:()=>{},
  window:{addEventListener:(name,cb)=>{(listeners[name]||=[]).push(cb)}},
  document:{addEventListener:(name,cb)=>{(listeners[name]||=[]).push(cb)},querySelector:()=>null},
  location:{hash:'#assistant'},navigator:{},crypto:{randomUUID:()=>String(Date.now())},
  confirm:()=>true,alert:()=>{},URL,FormData,Date,Number,Math,RegExp,Set,Map,
  console,
 };
 vm.createContext(ctx);
 function load(file){vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),ctx,{filename:file,timeout:1500})}
 return {ctx,load,listeners,state};
}
test('new modules parse without syntax errors',()=>{
 for(const name of ['r43_assistant.js','r43_medical_intelligence.js','r43_medical_extensions.js','r43_food_studio.js','r43_food_ai_extensions.js','r43_navigation.js','r43_cultural_planner.js','r43_annual_planner.js','pwa_install.js','sw-r43.js'])
  assert.doesNotThrow(()=>new vm.Script(fs.readFileSync(path.join(root,name),'utf8'),{filename:name}));
});
test('SEMITS Personal Guide has generic body goals and no fixed glute-shoulder programme',()=>{
 const e=env();e.load('r43_assistant.js');
 const html=e.ctx.sections.assistant();
 assert.match(html,/Targeted Muscle Development &amp; Body Shaping/);
 assert.match(html,/Body recomposition/);
 assert.match(html,/Whole body/);
 assert.match(html,/Menstrual cycle changes/);
 assert.doesNotMatch(html,/Targeted glute &amp; shoulder development/);
 assert.ok(e.ctx.menus.find(x=>x[0]==='assistant'));
});
test('Personal Guide refuses to show intake when the vault is locked',()=>{
 const e=env();e.load('r43_assistant.js');e.ctx.vaultKey=null;
 assert.match(e.ctx.sections.assistant(),/Unlock your trial vault/);
});
test('Medical Intelligence shows local import and a separate PDF/OCR experiment',()=>{
 const e=env();e.load('r43_medical_intelligence.js');e.load('r43_medical_extensions.js');
 const html=e.ctx.sections.medicalintelligence();
 assert.match(html,/Import test medical report/);
 assert.match(html,/PDF and image extraction tools/);
 assert.match(html,/experimental PDF, image &amp; internet research tools|Experimental PDF, image & internet research tools/);
 assert.match(html,/fictional|Fictional/);
 assert.match(html,/historical|history trends|Medical history trends/i);
});
test('Medical Intelligence does not display data-import UI while locked',()=>{
 const e=env();e.load('r43_medical_intelligence.js');e.load('r43_medical_extensions.js');
 e.ctx.vaultKey=null;
 const html=e.ctx.sections.medicalintelligence();
 assert.match(html,/Trial vault locked/);
 assert.doesNotMatch(html,/type="file"/);
});
test('PWA manifest is parseable and uses SEMITS branding',()=>{
 const m=JSON.parse(fs.readFileSync(path.join(root,'manifest.webmanifest'),'utf8'));
 assert.match(m.name,/SEMITS Health/);assert.equal(m.display,'standalone');
});
test('new modules are wired from index and service worker',()=>{
 const page=fs.readFileSync(path.join(root,'index.html'),'utf8');
 const worker=fs.readFileSync(path.join(root,'sw-r43.js'),'utf8');
 for(const name of ['r43_assistant.js','r43_medical_intelligence.js','r43_medical_extensions.js','r43_food_studio.js','r43_food_ai_extensions.js','r43_navigation.js','r43_cultural_planner.js','r43_annual_planner.js']){
  assert.ok(page.includes(name),name+' missing from entry point');
  assert.ok(worker.includes(name),name+' missing from offline shell');
 }
});

test('Food Studio supports manual entry and optional photo preview without asserting AI recognition',()=>{
 const e=env();e.load('r43_food_studio.js');
 const html=e.ctx.sections.foodstudio();
 assert.match(html,/Meal entry — photo or manual/);
 assert.match(html,/Type any food or meal name/);
 assert.doesNotMatch(html,/Char kway teow/);
 assert.match(html,/PFAS status unknown/);
 assert.match(html,/Oil amount/);
 assert.match(html,/not recognised or saved/);
 assert.ok(e.ctx.menus.some(x=>x[0]==='foodstudio'));
});
test('Food Studio requires trial vault unlock before recording meals',()=>{
 const e=env();e.load('r43_food_studio.js');e.ctx.vaultKey=null;
 const html=e.ctx.sections.foodstudio();
 assert.match(html,/Unlock the local test vault/);
 assert.doesNotMatch(html,/id="r43-foodform"/);
});

test('Food AI extension provides optional local classifier and reference-based ranges',()=>{
 const e=env();e.load('r43_food_studio.js');e.load('r43_food_ai_extensions.js');
 const html=e.ctx.sections.foodstudio();
 assert.match(html,/Recognise possible food from selected photo/);
 assert.match(html,/Portion-confirmed nutrition estimate/);
 assert.match(html,/SEMITS follow-up questions/);
 assert.match(html,/Profile and medical-record review/);
 assert.match(html,/recipe, weight or exact calories/);
});
test('Food AI extension is not available while vault locked',()=>{
 const e=env();e.load('r43_food_studio.js');e.load('r43_food_ai_extensions.js');e.ctx.vaultKey=null;
 assert.doesNotMatch(e.ctx.sections.foodstudio(),/id="r43-run-food-model"/);
});

test('Grouped SEMITS navigation provides Start Here and connected steps',()=>{
 const e=env();e.ctx.esc=e.ctx.r4esc;
 e.ctx.sections.today=()=>'<div>today</div>';
 e.load('r43_navigation.js');
 assert.match(e.ctx.sections.journey(),/Start here/);
 assert.match(e.ctx.sections.journey(),/Without medical records/);
 assert.match(e.ctx.sections.journey(),/Record food and review nutrition/);
 assert.ok(e.ctx.menus.some(m=>m[0]==='journey'));
});

test('Seven-day French plan generates 7 different days and transparent BMI',()=>{
 const e=env();e.load('r43_cultural_planner.js');
 const a={sex:'Male',age:55,height:170,weight:95,targetWeight:87,targetMonths:6,
 goal:'loss',culture:'French',activity:'Mostly sitting',flags:[],redflags:[],bed:'22:00',wake:'06:00'};
 const p=e.ctx.SEMITS_CULTURAL_PLAN.plan(a);
 assert.equal(p.meals.length,7);assert.equal(p.bmi.toFixed(1),'32.9');
 assert.equal(p.goalBMI.toFixed(1),'30.1');
 assert.match(e.ctx.SEMITS_CULTURAL_PLAN.render(a),/Seven-day French-influenced/);
 assert.match(e.ctx.SEMITS_CULTURAL_PLAN.render(a),/122 years and 164 days/);
});
test('Personal Guide includes cultural planner with optional target and cultural preferences',()=>{
 const e=env();e.load('r43_cultural_planner.js');e.load('r43_assistant.js');
 const page=e.ctx.sections.assistant();
 assert.match(page,/Cultural food preference/);
 assert.match(page,/Goal weight/);
 assert.match(page,/Time to goal/);
});

test('Annual plan has 365 different day menus with four meals',()=>{
 for(const culture of ['French','Indian','Chinese','Malaysian','General / mixed']){
  const e=env();e.load('r43_cultural_planner.js');e.load('r43_annual_planner.js');
  const a={sex:'Male',age:55,height:170,weight:95,targetWeight:87,targetMonths:6,
   culture,diet:'Mixed / omnivore',activity:'Mostly sitting',flags:[],redflags:[]};
  const days=e.ctx.SEMITS_CULTURAL_PLAN.annualPlan(a);
  assert.equal(days.length,365);
  assert.equal(new Set(days.map(d=>d.distinctKey)).size,365);
  assert.ok(days.every(d=>d.meals.length===4));
  assert.match(e.ctx.SEMITS_CULTURAL_PLAN.render(a),/365-day individual menu calendar/);
  assert.match(e.ctx.SEMITS_CULTURAL_PLAN.render(a),/Day 365/);
 }
});
test('Annual vegetarian and vegan menus respect selected preference',()=>{
 for(const diet of ['Vegan','Vegetarian']){
  const e=env();e.load('r43_cultural_planner.js');e.load('r43_annual_planner.js');
  const days=e.ctx.SEMITS_CULTURAL_PLAN.annualPlan({sex:'Female',age:45,height:165,weight:75,
   culture:'French',diet,activity:'Lightly active',flags:[],redflags:[]});
  assert.equal(days.length,365);
  assert.equal(new Set(days.map(d=>d.distinctKey)).size,365);
  assert.ok(days.every(d=>d.meals.every(m=>!/(chicken|turkey|tuna|salmon|fish)/i.test(m.recipe.name))));
 }
});
