const fs=require('fs'),vm=require('vm'),assert=require('assert');
const dir=__dirname+'/../';const ctx={Date,Number,String,Math,Error};vm.createContext(ctx);
vm.runInContext(fs.readFileSync(dir+'healthy_living.js','utf8'),ctx);
vm.runInContext(fs.readFileSync(dir+'global_longevity.js','utf8'),ctx);
let n=0;function test(name,fn){fn();console.log('PASS',name);n++}
function make(x={}){return {name:'Synthetic Person',age:'55',sex:'Male',activity:'beginner',goal:'healthy ageing',diet:'Other',sleep:'7',sitting:'moderate',days:'4',minutes:'30',knownConditions:'',medications:'',limitations:'',foodAllergies:'',...x}}
test('All ten cuisine patterns supported',()=>assert.equal(Object.keys(vm.runInContext('CUISINES',ctx)).length,10));
test('Mexican food suggested',()=>assert(ctx.healthyBuildPlan(make({cuisine:'Mexican'})).report.includes('tortillas')));
test('Chinese food suggested',()=>assert(ctx.healthyBuildPlan(make({cuisine:'Chinese'})).report.includes('bok choy')));
test('Malay food suggested',()=>assert(ctx.healthyBuildPlan(make({cuisine:'Malaysian'})).report.includes('nasi campur')));
test('No documents required',()=>assert.equal(ctx.healthyBuildPlan(make()).weekly.length,7));
test('Optional ethnicity does not change health movement plan',()=>{let a=ctx.healthyBuildPlan(make({culturalIdentity:'Mexican'}));let b=ctx.healthyBuildPlan(make({culturalIdentity:'French'}));assert.equal(JSON.stringify(a.weekly),JSON.stringify(b.weekly))});
test('Vegan substitution',()=>assert(!ctx.healthyBuildPlan(make({cuisine:'Chinese',dietaryRestrictions:'vegan'})).food.meals.some(m=>/fish|chicken|egg|yoghurt/.test(m.breakfast+m.lunch+m.dinner))));
test('Allergy disables unverified meal suggestions',()=>assert(ctx.healthyBuildPlan(make({foodAllergies:'peanuts'})).food.meals.every(m=>m.lunch.includes('allergen-verified'))));
test('Older care prompt',()=>assert(ctx.healthyBuildPlan(make({age:'75'})).report.includes('falls')));
test('Shift work prompt',()=>assert(ctx.healthyBuildPlan(make({workSchedule:'night shift'})).report.includes('Shift work')));
test('No invented longevity prediction',()=>assert(ctx.healthyBuildPlan(make()).report.includes('No validated personal lifespan')));
test('Clinical caution for medicines',()=>assert(ctx.healthyBuildPlan(make({medications:'example'})).needsReview));
test('Underage rejected',()=>assert.throws(()=>ctx.healthyBuildPlan(make({age:8}))));
console.log('TOTAL '+n+' PASS');
