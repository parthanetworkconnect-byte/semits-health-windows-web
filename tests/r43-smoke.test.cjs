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
 for(const name of ['r43_assistant.js','r43_medical_intelligence.js','r43_medical_extensions.js','pwa_install.js','sw-r43.js'])
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
 for(const name of ['r43_assistant.js','r43_medical_intelligence.js','r43_medical_extensions.js']){
  assert.ok(page.includes(name),name+' missing from entry point');
  assert.ok(worker.includes(name),name+' missing from offline shell');
 }
});
