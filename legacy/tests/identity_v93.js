const fs=require('fs'),vm=require('vm'),assert=require('assert');
const code=fs.readFileSync(__dirname+'/../medical_intelligence.js','utf8');
const ctx={};vm.createContext(ctx);vm.runInContext(code,ctx);
const tests=[
 ['basic',`LABORATORY REPORT\nPatient Name: Alex Example\nAge: 55 years\nSex: Male\nDOB: 12/08/1971\nMRN: ABC1234\nHbA1c: 7.4 %`,{name:'Alex Example',age:'55',sex:'Male',dob:'12/08/1971',externalId:'ABC1234'}],
 ['female',`Patient: Sam Example\nAGE: 38\nGENDER: F`,{name:'Sam Example',age:'38',sex:'Female'}],
 ['no_patient',`Referring Doctor: Dr. Smith\nLaboratory Results\nHbA1c 7.3%`,{name:'',age:'',sex:''}],
 ['age_invalid',`Patient Name: Taylor Example\nAge: 201\nSex: M`,{name:'Taylor Example',age:'',sex:'Male'}],
 ['long_name',`Patient Name: Jane Example     DOB: 01/01/1990\nGender: Female`,{name:'Jane Example',sex:'Female'}]
];
for(const [name,txt,expected] of tests){const got=vm.runInContext('extractIdentity('+JSON.stringify(txt)+')',ctx);for(const [key,val] of Object.entries(expected))assert.strictEqual(got[key],val,`${name}.${key}: ${got[key]} !== ${val}`);console.log('PASS '+name)}
