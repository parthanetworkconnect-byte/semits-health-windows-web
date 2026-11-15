const fs=require('fs'),vm=require('vm'),assert=require('assert');
const code=fs.readFileSync(__dirname+'/../healthy_living.js','utf8');
const ctx={Date,Number,String,Math,Error};vm.createContext(ctx);vm.runInContext(code,ctx);
const make=(age,more={})=>({name:'Synthetic Test',age,sex:'Male',activity:'beginner',goal:'general wellbeing',diet:'Indian mixed',sleep:'7',sitting:'high',days:'4',minutes:'30',knownConditions:'',medications:'',limitations:'',foodAllergies:'',smoking:'No',alcohol:'No',...more});
let n=0;function test(label,fn){fn();n++;console.log('PASS',label)}
test('Adult mode',()=>assert.equal(ctx.healthyBuildPlan(make(55)).group,'adult'));
test('Youth mode',()=>assert.equal(ctx.healthyBuildPlan(make(13)).group,'youth'));
test('Older age mode',()=>assert.equal(ctx.healthyBuildPlan(make(71)).group,'older'));
test('Seven day output',()=>assert.equal(ctx.healthyBuildPlan(make(40)).weekly.length,7));
test('Activity preference capped',()=>assert.equal(ctx.healthyBuildPlan(make(40,{days:'99'})).weekly.filter(x=>x.duration>0).length,7));
test('Medical caution from existing meds',()=>assert.equal(ctx.healthyBuildPlan(make(55,{medications:'synthetic Rx'})).needsReview,true));
test('Allergy warning',()=>assert(ctx.healthyBuildPlan(make(35,{foodAllergies:'peanuts'})).report.includes('peanuts')));
test('Adult no rigid calorie targets',()=>assert(!ctx.healthyBuildPlan(make(55)).report.includes('2000 kcal')));
test('Youth no adult calorie prescription',()=>assert(ctx.healthyBuildPlan(make(14)).report.includes('no adult calorie')));
test('Invalid age rejected',()=>assert.throws(()=>ctx.healthyBuildPlan(make(8))));
test('Sources included',()=>assert(ctx.healthyBuildPlan(make(30)).report.includes('nhmrc.gov.au')));
const med=fs.readFileSync(__dirname+'/../medical_intelligence.js','utf8');assert(med.includes('function extractMedicalFindings'));n++;console.log('PASS structured extraction included');
const sw=fs.readFileSync(__dirname+'/../sw.js','utf8');assert(sw.includes('healthy_living.js'));n++;console.log('PASS offline cache includes healthy mode');
console.log('TOTAL '+n+' PASS');
