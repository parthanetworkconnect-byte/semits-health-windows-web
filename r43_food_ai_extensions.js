'use strict';
/* SEMITS R4.3 Food Analysis Extensions — trial only.
   Optional on-device Food-101 image classifier; external model runtime and weights
   downloaded on click. Never sends photos to a medical API in application logic.
   Estimated nutrients use ONLY manually supplied package/reference values.
   Not a diagnosis or clinically validated meal planner. Fictional data only. */
(function(){
const esc=v=>r4esc(String(v??''));
const MODEL='onnx-community/swin-finetuned-food101-ONNX';
const RUNTIME='https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.8.1';
const LAB_RECORD='semits-r43-records-v1';
const PLAN_RECORD='semits-r43-personal-assistant-v1';
let classifier=null,loading=false,context=null,suggestion=null;
const id=()=>r41active()?.id||'default';
const panel=()=>'<section class="card r43-analysis-panel"><h2>Advanced Food Analysis — Experimental</h2>'+
 '<p class="note"><strong>Synthetic test photos and details only.</strong> First-time recognition downloads an open-source Food-101 model and third-party JavaScript from external hosts. Classification runs in your browser after loading; do not use confidential photos until code and model files are reviewed and self-hosted. Results are suggestions, not facts.</p>'+
 '<button type="button" id="r43-run-food-model" class="btn outline">Recognise possible food from selected photo</button>'+
 '<p id="r43-food-model-status" role="status">Select a picture in the meal form above, then click recognise.</p>'+
 '<div id="r43-food-model-result"></div><hr>'+
 '<h3>Portion-confirmed nutrition estimate</h3><p class="note">A photograph cannot establish the recipe, weight or exact calories. Enter a reference value from a food label or reliable nutrition table, and the measured serving weight. Values are not sourced from the photograph.</p>'+
 '<div class="r43-grid"><label>Measured portion (g)<input type="number" id="r43-n-grams" min="1" max="3000" step="1" placeholder="e.g. 320"></label>'+
 '<label>Reference kcal per 100 g<input type="number" id="r43-n-kcal" min="0" max="1000" step=".1" placeholder="from label/database"></label>'+
 '<label>Protein (g / 100 g; optional)<input type="number" id="r43-n-protein" min="0" max="100" step=".1"></label>'+
 '<label>Carbohydrate (g / 100 g; optional)<input type="number" id="r43-n-carb" min="0" max="100" step=".1"></label>'+
 '<label>Fat (g / 100 g; optional)<input type="number" id="r43-n-fat" min="0" max="100" step=".1"></label>'+
 '<label>Nutrition data source<input type="text" id="r43-n-source" maxlength="100" placeholder="Package label or reference title"></label></div>'+
 '<button type="button" class="btn outline" id="r43-run-nutrition">Calculate confirmed-portion estimate</button>'+
 '<div id="r43-food-nutrition" aria-live="polite"></div><hr>'+
 '<h3>SEMITS follow-up questions</h3>'+
 '<p class="note">Questions adapt to missing meal information. The current engine is transparent rules, not a conversational medical language model.</p>'+
 '<button type="button" class="btn outline" id="r43-food-followups">Analyse missing details</button>'+
 '<div id="r43-food-questions"></div><hr>'+
 '<h3>Profile and medical-record review</h3><p class="note">A medical record is optional. Findings remain unverified until reviewed by the person and, where necessary, a clinician; no medical file can silently alter nutrition or exercise prescriptions.</p>'+
 '<button type="button" class="btn outline" id="r43-food-record-context">Review health context</button>'+
 '<div id="r43-food-context"></div></section>';
const previous=sections.foodstudio;
sections.foodstudio=()=>previous()+(vaultKey?panel():'');
function text(selector,value){const el=document.querySelector(selector);if(el)el.textContent=value;}
function html(selector,value){const el=document.querySelector(selector);if(el)el.innerHTML=value;}
function pretty(label){return String(label).replaceAll('_',' ').replaceAll('-',' ').trim();}
function classifyMap(label){
 const l=String(label).toLowerCase();
 if(/pad.thai|chow.m(ein|ein)|fried.rice|ramen|pho|spaghetti|lasagna|macaroni|noodles/.test(l))return 'Noodles / pasta';
 if(/pizza|hamburger|cheeseburger/.test(l))return 'Burger / pizza';
 if(/salad|soup|gazpacho/.test(l))return 'Soup / salad';
 if(/chicken|rice/.test(l))return 'Chicken and rice';
 return null;
}
async function recognise(){
 if(loading)return;const file=document.querySelector('#r43-food-photo-file')?.files?.[0];
 if(!file){text('#r43-food-model-status','Choose a food photograph in the meal form first.');return}
 if(!/^image\/(png|jpeg|webp)$/.test(file.type)||file.size>5*1024*1024){text('#r43-food-model-status','Select PNG, JPEG or WEBP under 5 MB.');return}
 if(!confirm('Download a third-party Food-101 model and JavaScript for local browser classification? Use a fictional, non-private food image only.'))return;
 loading=true;text('#r43-food-model-status','Loading model into this browser. Large download may take time; no image is sent to a medical API by our code.');
 const src=URL.createObjectURL(file);
 try{
  if(!classifier){const transformers=await import(RUNTIME);classifier=await transformers.pipeline('image-classification',MODEL,{device:'wasm'});}
  const predictions=await classifier(src,{topk:3});
  suggestion=Array.isArray(predictions)?predictions.slice(0,3):[];
  const lis=suggestion.map((x,i)=>'<li><strong>'+esc(pretty(x.label))+'</strong> — model score '+Math.round((Number(x.score)||0)*100)+'%'+(i===0&&classifyMap(x.label)?' · approximate menu mapping: '+esc(classifyMap(x.label)):'')+'</li>').join('');
  html('#r43-food-model-result','<p>Possible food classes, <strong>not confirmed</strong>:</p><ol>'+lis+'</ol><p class="note">A Food-101 classifier recognises a limited set of dish categories and often fails for mixed cuisine such as char kway teow. A model score is not a reliable probability of correctness. Confirm the actual dish and all ingredients manually before saving.</p>'+
   (suggestion[0]&&classifyMap(suggestion[0].label)?'<button type="button" class="btn outline" id="r43-apply-food-model">Suggest '+esc(classifyMap(suggestion[0].label))+' in meal field</button>':''));
  text('#r43-food-model-status','Classification completed locally; confirm before using.');
 }catch(e){text('#r43-food-model-status','Recognition unavailable: '+String(e.message||e)+'. You can still use manual entry.')}
 finally{loading=false;URL.revokeObjectURL(src)}
}
function num(id){const raw=document.querySelector(id)?.value?.trim()||'';return raw===''?null:Number(raw)}
function nutrition(){
 const g=num('#r43-n-grams'),k=num('#r43-n-kcal'),source=document.querySelector('#r43-n-source')?.value.trim()||'';
 if(g===null||k===null||!Number.isFinite(g)||!Number.isFinite(k)||g<=0||g>3000||k<0||k>1000){text('#r43-food-nutrition','Enter a positive measured portion and a plausible per-100g kcal reference value. A photo alone is insufficient.');return}
 if(!source){text('#r43-food-nutrition','Please identify where the per-100g values came from (e.g. food package or database).');return}
 const kcal=g*k/100;
 const fmt=n=>Number(n.toFixed(1)).toLocaleString('en-AU');
 const lines=['Calculated energy: '+fmt(kcal)+' kcal (based on entered data).',
 'Illustrative ±20% portion/recipe uncertainty interval: '+fmt(kcal*.8)+'–'+fmt(kcal*1.2)+' kcal. This is not a statistically validated uncertainty interval.',
 'Entered source: '+source+'.'];
 for(const [selector,label] of [['#r43-n-protein','Protein'],['#r43-n-carb','Carbohydrate'],['#r43-n-fat','Fat']]){
  const n=num(selector);if(n!==null&&Number.isFinite(n)&&n>=0&&n<=100)lines.push(label+': '+fmt(g*n/100)+' g (from entered value).');
 }
 const out=document.querySelector('#r43-food-nutrition');out.replaceChildren();
 const heading=document.createElement('h4');heading.textContent='Reference-based meal estimate';out.append(heading);
 const ul=document.createElement('ul');for(const line of lines){const li=document.createElement('li');li.textContent=line;ul.append(li)}out.append(ul);
 const note=document.createElement('p');note.className='note';note.textContent='Cannot be considered accurate unless your measurement and nutrition reference match the actual recipe. No automated image-calorie calculation is claimed.';out.append(note);
}
function missing(){
 const f=document.querySelector('#r43-foodform');if(!f)return ['Complete the meal form.'];
 const d=new FormData(f),v=k=>String(d.get(k)||''),q=[];
 if(v('portion')==='Unknown')q.push('What portion did you eat: a measured weight, half plate, or whole plate?');
 if(v('methodCooking')==='Unknown / restaurant')q.push('Was it cooked at home or bought? Do you know if it was stir-fried, boiled or deep-fried?');
 if(v('oil')==='Unknown'||v('oilAmount')==='Unknown')q.push('Do you know what oil and approximately how much was used? You can leave unknown if purchased.');
 if(v('drink')==='Unknown')q.push('What did you drink with the meal, and roughly how much?');
 if(!d.getAll('ingredient').length)q.push('Could you confirm the protein, vegetables, sauces, pickles or chips actually present?');
 if(v('food')==='Custom meal')q.push('What is the dish called, and which ingredients do you know?');
 q.push('Any food allergies, preferences or clinician-confirmed restrictions relevant to this meal?');
 const list=document.createElement('ol');for(const item of q){const li=document.createElement('li');li.textContent=item;list.append(li)}
 const out=document.querySelector('#r43-food-questions');out.replaceChildren(list);
}
async function medicalContext(){
 const out=document.querySelector('#r43-food-context');if(!out)return;
 try{
  if(!vaultKey){out.textContent='Unlock the trial vault to review profile context.';return}
  const person=livingState.profile||null;
  const guide=await livingEncryptedRead(PLAN_RECORD+':'+id())||null;
  const records=await livingEncryptedRead(LAB_RECORD+':'+id())||[];
  const count=records.length;
  const flags=guide?.flags||[];
  const intro=person?'Basic profile is available.':'No basic profile found; general food guidance remains possible.';
  const pieces=[
   intro,
   guide?'Goal: '+(guide.goal||'not supplied')+'. Selected body areas: '+(guide.bodyAreas||[]).join(', ')+'.':'No enhanced SEMITS Personal Guide questionnaire found.',
   flags.length?'User-selected health flags: '+flags.join(', ')+'. Check which are professionally confirmed.':'No medical flags specified; do not assume the person has no conditions.',
   count+' encrypted trial medical record(s) found. Report contents are not interpreted as verified medical facts.',
   'For relevant diabetes, kidney, allergy, pregnancy, medicine or cardiovascular concerns, obtain appropriate professional guidance before applying condition-specific dietary restrictions.',
   'No automatic treatment, medication modification or clinical clearance has been performed.'
  ];
  const ul=document.createElement('ul');for(const item of pieces){const li=document.createElement('li');li.textContent=item;ul.append(li)}out.replaceChildren(ul);
 }catch(err){out.textContent='Unable to load trial context: '+String(err.message||err)}
}
document.addEventListener('click',e=>{
 if(e.target?.id==='r43-run-food-model')recognise();
 if(e.target?.id==='r43-apply-food-model'){
  const option=classifyMap(suggestion?.[0]?.label),field=document.querySelector('#r43-foodform [name=food]');
  if(field&&option){field.value=option;text('#r43-food-model-status','Suggested broad category selected; please verify the actual food and recipe.')}
 }
 if(e.target?.id==='r43-run-nutrition')nutrition();
 if(e.target?.id==='r43-food-followups')missing();
 if(e.target?.id==='r43-food-record-context')medicalContext();
});
})();