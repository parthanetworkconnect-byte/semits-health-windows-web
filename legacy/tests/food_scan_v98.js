const assert=require('node:assert/strict');const {FOOD_SCAN_TYPES,foodScanGrams,foodScanEstimate,foodScanAssessment,foodScanLocalInput}=require('../food_scan.js');
let checks=0;function test(name,fn){fn();checks++;console.log('PASS',name)}
test('photo dishes defined',()=>assert.ok(Object.keys(FOOD_SCAN_TYPES).length>=6));
test('ounces conversion',()=>assert.ok(Math.abs(foodScanGrams(10,'oz')-283.495)<0.01));
test('servings explicit assumption',()=>assert.equal(foodScanGrams(2,'serving'),500));
test('negative weight rejected',()=>assert.equal(foodScanEstimate('salad',-2),null));
test('overweight portion rejected',()=>assert.equal(foodScanEstimate('salad',5500),null));
test('unknown food does not invent kcal',()=>assert.equal(foodScanEstimate('custom',300).known,false));
test('two burgers estimated with specified mass',()=>assert.equal(foodScanEstimate('burger',400).kcal,1020));
test('salad dressing accounted separately',()=>assert.equal(foodScanEstimate('salad',350,{dressing:10}).kcal,387.5));
test('night shift impacts advice not disease prediction',()=>{const r=foodScanAssessment({meal:'salad',weight:350,unit:'g',timestamp:'2026-11-12T02:30',shift:'night',activity:'desk'});assert(r.watch.some(x=>x.includes('Night-shift')));assert(!JSON.stringify(r).includes('will develop diabetes'))});
test('late burger considers daily sugary drinks',()=>{const r=foodScanAssessment({meal:'burger',weight:400,unit:'g',timestamp:'2026-11-12T23:30',shift:'day',activity:'desk',sugaryDrinks:2});assert(r.night&&r.watch.some(x=>x.includes('sweetened drinks')))});
test('late burger shares no unsupported diagnosis',()=>{const r=foodScanAssessment({meal:'burger',weight:400,unit:'g',timestamp:'2026-11-12T23:30',shift:'day',activity:'desk'});assert(!JSON.stringify(r).includes('causes'))});
test('logged totals use only known estimates',()=>{const r=foodScanAssessment({meal:'burger',weight:400,unit:'g',timestamp:'2026-11-12T23:30',shift:'day',activity:'desk'},[{timestamp:'2026-11-12T12:00',nutrition:{known:true,kcal:180,sugar:34,sodium:30}},{timestamp:'2026-11-11T12:00',nutrition:{known:true,kcal:900,sugar:12,sodium:50}}]);assert.equal(r.knownTotals.kcal,1200)});
test('local input date populated',()=>assert.match(foodScanLocalInput(),/^\d{4}-\d\d-\d\dT\d\d:\d\d$/));
test('countries remain 195',()=>{const fs=require('fs');assert.equal(JSON.parse(fs.readFileSync(__dirname+'/../country_food_195.json','utf8')).length,195)});
test('required scripts loaded',()=>{const fs=require('fs'),html=fs.readFileSync(__dirname+'/../index.html','utf8');assert(html.includes('food_scan.js')&&html.includes('food_195.js'))});
console.log(`TOTAL ${checks} PASS`);
