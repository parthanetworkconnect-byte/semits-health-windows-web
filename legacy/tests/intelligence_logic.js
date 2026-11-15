const fs=require('fs'),vm=require('vm'),assert=require('assert');
const code=fs.readFileSync(require('path').join(__dirname,'..','medical_intelligence.js'),'utf8');
const context=vm.createContext({Date,Number,String,Set,console});
vm.runInContext(code+`
const patient={name:'Demo',age:'55',sex:'Male',condition:'Type 2 diabetes',medications:'Metformin',goals:'Eat sustainably and exercise',reviewedText:'HbA1c noted',filename:'sample.txt'};
const evidence=medMatches(patient);
const flags=medFlags(patient);
const report=medReport(patient);
global_result={matches:evidence.length,ids:evidence.map(x=>x.id),flags,report:report.text};`,context);
const r=vm.runInContext('global_result',context);
assert(r.matches>=3);assert(r.ids.includes('NIDDK-MANAGE'));assert(r.flags.some(s=>s.includes('B12')));assert(r.report.includes('No live internet search')===false);assert(r.report.includes('prescribed medicines'));assert(r.report.includes('Type 2 diabetes'));console.log('PASS 6 medical intelligence logic checks');
