'use strict';
/* SEMITS Health V9.8 Food Photo & Timing. No computer-vision model or medical diagnosis. */
const FOOD_SCAN_TYPES={
 'salad':{label:'Salad bowl (vegetables + optional protein)',kcal:85,protein:6,carbs:6,fat:4,fiber:2.5,sugar:2,sodium:110,photo:'assets/salad_bowl.jpg',type:'mixed'},
 'burger':{label:'Chicken burger (illustrative)',kcal:255,protein:13,carbs:25,fat:12,fiber:1.5,sugar:4,sodium:450,photo:'assets/chicken_burgers.jpg',type:'mixed'},
 'bubbletea':{label:'Sweetened bubble tea (illustrative)',kcal:95,protein:1,carbs:21,fat:1,sugar:15,sodium:25,type:'drink'},
 'soda':{label:'Sugary soft drink (illustrative)',kcal:42,protein:0,carbs:10.6,fat:0,sugar:10.6,sodium:5,type:'drink'},
 'rice':{label:'Cooked rice (illustrative)',kcal:130,protein:2.7,carbs:28,fat:.3,fiber:.4,sugar:.1,sodium:1,type:'staple'},
 'fruit':{label:'Fresh fruit mix (illustrative)',kcal:60,protein:.8,carbs:15,fat:.2,fiber:2,sugar:10,sodium:1,type:'fruit'},
 'custom':{label:'Unknown meal — log without automated nutrient estimate',kcal:null,protein:null,carbs:null,fat:null,fiber:null,sugar:null,sodium:null,type:'unknown'}
};
const FOOD_SCAN_SOURCES=[
 ['WHO healthy diet','https://www.who.int/en/news-room/fact-sheets/detail/healthy-diet'],
 ['CDC/NIOSH: night shift diet guidance','https://www.cdc.gov/niosh/work-hour-training-for-nurses/longhours/mod9/08.html'],
 ['CDC/NIOSH: shift work and sleep','https://www.cdc.gov/niosh/work-hour-training-for-nurses/longhours/mod9/05.html'],
 ['USDA FoodData Central — download datasets','https://fdc.nal.usda.gov/download-datasets/']
];
const foodScanState={file:null,preview:null,coordsUsed:false,location:''};
const foodScanEsc=x=>safe(x);
function foodScanLocalInput(d=new Date()){const pad=x=>String(x).padStart(2,'0');return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`}
function foodScanGrams(weight,unit){const w=Number(weight);if(!Number.isFinite(w)||w<=0)return NaN;return unit==='oz'?w*28.349523125:unit==='serving'?w*250:w}
function foodScanEstimate(type,grams,extra={}){
 const f=FOOD_SCAN_TYPES[type],g=Number(grams);if(!f||!Number.isFinite(g)||g<1||g>5000)return null;
 if(f.kcal===null)return {known:false,grams:Math.round(g),type};
 const r={known:true,grams:Math.round(g),type};for(const key of ['kcal','protein','carbs','fat','fiber','sugar','sodium'])r[key]=Math.round(f[key]*g/100*10)/10;
 const dressing=Number(extra.dressing||0);if(type==='salad'&&Number.isFinite(dressing)&&dressing>0&&dressing<=100){r.kcal+=Math.round(dressing*9);r.fat+=dressing;r.dressing=dressing}
 return r
}
function foodScanAssessment(input,history=[]){
 const grams=foodScanGrams(input.weight,input.unit),nutr=foodScanEstimate(input.meal,grams,{dressing:input.dressing});
 if(!nutr)throw Error('Enter a portion between 1 and 5,000 grams equivalent');
 const hr=Number(String(input.timestamp||'').slice(11,13));
 const night=Number.isFinite(hr)&&(hr>=23||hr<6),shift=input.shift==='night',desk=input.activity==='desk';
 const historyDay=(input.timestamp||'').slice(0,10);
 const prior=history.filter(x=>x.timestamp?.slice(0,10)===historyDay);
 const estimates=[...prior.map(x=>x.nutrition).filter(x=>x?.known),nutr].filter(x=>x?.known);
 const knownTotals={kcal:Math.round(estimates.reduce((a,x)=>a+x.kcal,0)),sugar:Math.round(estimates.reduce((a,x)=>a+x.sugar,0)),sodium:Math.round(estimates.reduce((a,x)=>a+x.sodium,0))};
 const benefits=[],watch=[],actions=[];
 if(input.meal==='salad'){benefits.push('Vegetables can add fibre and micronutrients; protein depends on ingredients.');watch.push('Creamy dressings, sauces and additions may change energy and sodium considerably.');actions.push('Confirm protein, dressing, nuts and portion weight in the salad.');}
 else if(input.meal==='burger'){benefits.push('Chicken can provide protein; the amount varies by preparation.');watch.push('Burgers may contain considerable sodium and energy, especially with large portions and sauces.');actions.push('If hungry, consider a single burger with vegetables and water; choose portions that fit your appetite.');}
 else if(input.meal==='bubbletea'||input.meal==='soda'){benefits.push('Provides fluid and energy, but sugar content depends on recipe.');watch.push('Sweetened drinks can contribute substantial free sugars without much fibre.');actions.push('Choose water or unsweetened drinks more often; compare the actual label or recipe.');}
 else{benefits.push('A balanced meal can support energy and adequate nutrition.');actions.push('Add vegetables, fibre-rich carbohydrate and a protein source as appropriate.');}
 if(night){watch.push('Eating close to your usual sleep period may affect comfort or sleep for some people; timing alone does not make a food harmful.');actions.push('If a meal is near planned sleep, consider a comfortable portion and avoid lying down immediately after a heavy meal.');}
 if(shift){watch.push('Night-shift schedules can disrupt sleep and regular eating; individual schedules matter.');actions.push('Plan consistent meals around your actual wake, work and sleep times.');}
 if(desk){actions.push('Break up prolonged sitting with brief movement and aim for regular weekly physical activity.');}
 if(Number(input.sugaryDrinks)>0){watch.push('Earlier sweetened drinks may add to total free-sugar intake today; quantities and recipes must be checked.');actions.push('Review the sweetened drinks you logged today, rather than judging this meal in isolation.');}
 if(Number(input.sleepHours)>0&&Number(input.sleepHours)<6){watch.push('Short reported sleep deserves attention; one night alone cannot establish a chronic problem.');actions.push('Protect enough sleep opportunity, especially after a shift.');}
 if(input.conditions?.trim())actions.push('Check meal choices with your clinician or dietitian where conditions, medicines or allergies affect your diet.');
 if(!nutr.known)watch.push('Nutrition is unknown for this meal; no calorie or nutrient total can be inferred from the image.');
 if(nutr.known)watch.push('Values are rough recipe-based illustrations, NOT verified USDA ingredient records and NOT inferred from the photo.');
 const focus=night&&input.meal==='burger'?'Late meal: review portion, drinks and sleep timing':shift&&input.meal==='salad'?'Shift-friendly option to review ingredients':'Review portion and daily pattern';
 return {nutrition:nutr,benefits,watch,actions,focus,night,knownTotals,priorCount:prior.length};
}
function foodScanPage(){const p=profile(),pref=p.foodScanPrefs||{},hist=(data.foodReviews||[]).filter(x=>x.pid===data.active).slice().reverse();const country=pref.country||p.healthy?.country||'Malaysia';const choices=FOOD_COUNTRIES.map(x=>`<option ${x.country===country?'selected':''}>${foodScanEsc(x.country)}</option>`).join('');
return head('Food photo & meal timing','Upload a photo, confirm the food and portion, then review context-aware benefits, limitations and practical habits.')+`
<div class="callout warning"><b>Photo review, not AI food recognition.</b> This prototype displays and stores the photo but cannot reliably identify its ingredients, oil or serving weight. You confirm the food and weight. Results are rough educational estimates, not diagnoses, measured nutrients, predictions of illness, or instructions to stop eating.</div>
<div class="scan-columns"><section class="card scan-panel"><h2>1 · Person, culture and daily context</h2><form id="foodScanForm"><div class="form-grid">
<label class="field">Country or food culture<select name="country">${choices}</select></label>
${field('Ethnic / cultural background (optional)','background','text',pref.background||'','maxlength="100"')}
${sel('Work pattern','shift',['day','night','rotating','not-working'],pref.shift||'day')}
${sel('Activity pattern','activity',['desk','active','mixed'],pref.activity||'mixed')}
${field('Sleep during last rest period (hours)','sleepHours','number',pref.sleepHours||'','min="0" max="24" step="0.5"')}
${field('Sugary drinks already consumed today (count)','sugaryDrinks','number',pref.sugaryDrinks??0,'min="0" max="40" step="1"')}
${field('Known conditions / allergies (self-reported)','conditions','text',pref.conditions||p.conditions||'','maxlength="250"')}
${field('Last planned sleep / schedule notes (optional)','schedule','text',pref.schedule||'','maxlength="150"')}
</div><h2>2 · Photo, meal and portion</h2>
<label class="field">Take photo on phone or upload from gallery<input type="file" id="foodScanImage" accept="image/*" capture="environment"></label>
<div id="scanImageArea"><img class="scan-preview" alt="Illustrative salad photo, not the user's uploaded meal" src="assets/salad_bowl.jpg"><p class="scan-small">Illustrative image — no uploaded photo yet.</p></div>
<div class="form-grid">
<label class="field">What was actually eaten? Confirm manually<select name="meal">${Object.entries(FOOD_SCAN_TYPES).map(([k,v])=>`<option value="${k}">${foodScanEsc(v.label)}</option>`).join('')}</select></label>
${field('Local meal date and time','timestamp','datetime-local',foodScanLocalInput(),'required')}
${field('Amount (number)','weight','number',250,'min="0.1" max="5000" step="0.1" required')}
${sel('Unit','unit',['g','oz','serving'],'g')}
${field('Additional salad dressing / oil (grams, if known)','dressing','number',0,'min="0" max="100" step="1"')}
${field('Other meal ingredients / notes','notes','text','','maxlength="250"')}
</div>
<div class="callout">1 oz = 28.35 g; one illustrative serving = 250 g. For mixed dishes, estimated nutrition is uncertain. No ingredient is identified automatically from a photograph.</div>
<div class="line"><b>Device time zone</b><span class="right" id="scanZone"></span></div><label class="field">Optional area/city for local food context<input name="place" value="${foodScanEsc(pref.place||'')}" maxlength="100" placeholder="e.g., Kuala Lumpur"></label>
<div class="row-actions"><button class="btn secondary" data-action="foodScanLocation" type="button">Use device location (optional)</button><button class="btn" type="submit">Analyse verified meal & save</button></div>
<p class="scan-small" id="scanLocationStatus">Exact GPS is never required for meal timing. Location access is optional and coordinates are not stored or sent.</p></form></section>
<section class="card scan-panel"><h2>Meal review</h2><div id="foodScanResult"><img src="assets/chicken_burgers.jpg" class="scan-card-photo" alt="Illustrative two chicken burgers"><h3>Two examples to try</h3><p><b>Night-shift salad:</b> Select salad, adjust weight and meal time. Confirm any dressing or added protein.</p><p><b>Late-night desk worker:</b> Select chicken burger, enter 400 g for two burgers if that is the actual estimated mass, and add earlier sugary drinks.</p><p>Press <b>Analyse verified meal & save</b> for an estimate and discussion points. No verdict is based on ethnicity or a single meal alone.</p></div><h3>Evidence sources</h3><div class="scan-evidence">${FOOD_SCAN_SOURCES.map(([t,u])=>`<p><a target="_blank" rel="noopener noreferrer" href="${foodScanEsc(u)}">${foodScanEsc(t)} ↗</a></p>`).join('')}</div></section></div>
<section class="card"><h2>3 · Your meal photo history</h2><p>Records belong to the selected profile on this browser. Photos are stored separately from JSON backups. Nothing is recorded automatically or continuously.</p><div class="scan-history">${hist.length?hist.slice(0,30).map(x=>`<div class="scan-history-item"><b>${foodScanEsc(x.label)} · ${foodScanEsc(x.timestamp.replace('T',' '))}</b><div class="scan-small">${foodScanEsc(x.country)} · ${x.nutrition?.known?Math.round(x.nutrition.kcal)+' approximate kcal':'Nutrition not estimated'} · ${foodScanEsc(x.focus)}</div>${x.photoId?`<button class="btn secondary" type="button" data-scan-photo="${foodScanEsc(x.photoId)}">↓ Save photo</button>`:''}<button class="plain" type="button" data-scan-delete="${foodScanEsc(x.id)}" aria-label="Delete meal review">✕</button></div>`).join(''):'<div class="empty">No food photo reviews saved yet.</div>'}</div><div class="row-actions"><button type="button" class="btn secondary" data-action="foodScanExport">Download meal review history (JSON)</button></div></section>`;
}
function foodScanMounted(){const el=$('scanZone');if(el)el.textContent=Intl.DateTimeFormat().resolvedOptions().timeZone+' · '+new Date().toLocaleTimeString();}
async function foodScanPreview(file){if(!file.type.startsWith('image/'))return notify('Select a JPG, PNG or other supported image');if(file.size>20*1024*1024)return notify('Image exceeds the 20 MB input limit');const uri=URL.createObjectURL(file);const old=foodScanState.preview;if(old)URL.revokeObjectURL(old);foodScanState.preview=uri;foodScanState.file=file;const r=$('scanImageArea');if(r){r.innerHTML='';const img=document.createElement('img');img.className='scan-preview';img.alt='Uploaded meal picture awaiting manual identification';img.src=uri;r.appendChild(img);const hint=document.createElement('p');hint.className='scan-small';hint.textContent='Your photo is displayed locally. Select the correct dish and enter its real weight; recognition is not automatic.';r.appendChild(hint);}}
function foodScanClear(){foodScanState.file=null;if(foodScanState.preview)URL.revokeObjectURL(foodScanState.preview);foodScanState.preview=null;go('foodscan')}
async function foodScanLocation(){const st=$('scanLocationStatus');if(!navigator.geolocation){if(st)st.textContent='This browser does not support geolocation.';return}if(st)st.textContent='Requesting optional permission; no coordinates will be saved.';navigator.geolocation.getCurrentPosition(pos=>{foodScanState.coordsUsed=true;if(st)st.textContent='Location permission granted. Exact coordinates discarded; device time zone is used for timing. Enter city manually if desired.'},err=>{if(st)st.textContent='Location permission unavailable or declined. Meal analysis works without it.'},{enableHighAccuracy:false,timeout:8000,maximumAge:600000})}
async function foodScanSmallPhoto(file){const bitmap=await createImageBitmap(file);const max=1100,scale=Math.min(1,max/Math.max(bitmap.width,bitmap.height));const c=document.createElement('canvas');c.width=Math.max(1,Math.round(bitmap.width*scale));c.height=Math.max(1,Math.round(bitmap.height*scale));c.getContext('2d').drawImage(bitmap,0,0,c.width,c.height);bitmap.close?.();return new Promise((ok,fail)=>c.toBlob(b=>b?ok(b):fail(Error('Could not compress photo')),'image/jpeg',.75));}
async function foodScanSubmit(f){try{
 const v=Object.fromEntries(new FormData(f).entries());const hist=(data.foodReviews||[]).filter(x=>x.pid===data.active);const result=foodScanAssessment(v,hist);const p=profile();
 const rec={id:uid(),pid:data.active,created:Date.now(),timestamp:v.timestamp,country:v.country,background:v.background,shift:v.shift,activity:v.activity,place:v.place||'',label:FOOD_SCAN_TYPES[v.meal].label,meal:v.meal,notes:v.notes||'',grams:result.nutrition.grams,nutrition:result.nutrition,focus:result.focus,benefits:result.benefits,watch:result.watch,actions:result.actions,localTimeZone:Intl.DateTimeFormat().resolvedOptions().timeZone,photoId:null};
 if(foodScanState.file){const blob=await foodScanSmallPhoto(foodScanState.file);if(blob.size>8*1024*1024)throw Error('Compressed photo still exceeds storage limit');rec.photoId='food-photo-'+rec.id;await dbWrite(rec.photoId,blob)}
 p.foodScanPrefs={country:v.country,background:v.background,shift:v.shift,activity:v.activity,sleepHours:v.sleepHours,sugaryDrinks:v.sugaryDrinks,conditions:v.conditions,schedule:v.schedule,place:v.place};
 data.foodReviews=data.foodReviews||[];data.foodReviews.push(rec);save();foodScanRenderReview(result,rec);notify('Meal review saved locally. Nutrient estimates are unverified.');
 }catch(e){notify('Meal review failed: '+e.message);}
}
function foodScanRenderReview(result,rec){const box=$('foodScanResult');if(!box)return;const v=result.nutrition;const metric=v.known?`<div class="metrics"><div class="metric"><span>Estimated energy</span><b>${Math.round(v.kcal)} kcal</b></div><div class="metric"><span>Protein</span><b>${v.protein.toFixed(1)} g</b></div><div class="metric"><span>Carbs</span><b>${v.carbs.toFixed(1)} g</b></div><div class="metric"><span>Free/added sugars</span><b>Not measurable from photo</b></div></div><p class="scan-small">Indicative total sugar ${v.sugar.toFixed(1)} g; sodium ${Math.round(v.sodium)} mg. Source: generic hand-entered recipe examples, NOT a verified food database. Actual ingredients may vary substantially.</p>`:'<p>Nutrition cannot be estimated because the recipe has not been identified.</p>';
 box.innerHTML=`<div class="scan-summary"><b>${foodScanEsc(result.focus)}</b><p>${foodScanEsc(rec.label)} · ${v.grams} g · ${foodScanEsc(rec.timestamp.replace('T',' '))}</p>${metric}</div><h3>Potential benefits</h3><ul class="scan-checks">${result.benefits.map(t=>`<li>${foodScanEsc(t)}</li>`).join('')}</ul><h3>Possible drawbacks / uncertainty</h3><ul class="scan-checks">${result.watch.map(t=>`<li>${foodScanEsc(t)}</li>`).join('')}</ul><h3>Practical next steps</h3><ul class="scan-checks">${result.actions.map(t=>`<li>${foodScanEsc(t)}</li>`).join('')}</ul><div class="scan-warning">This cannot predict blood glucose, weight gain, heart disease, sleep quality or future lifespan from one photo or one meal. Review repeated patterns and clinical measurements instead.</div><p>Estimated total for logged meals that day: <b>${result.knownTotals.kcal} kcal</b>, <b>${result.knownTotals.sugar} g total sugar</b> from ${result.priorCount+1} entries with known estimates. Incomplete logging makes totals incomplete.</p><p class="scan-small">Photos stay on this device unless exported manually. Nutritional estimates should be checked against the actual ingredients and labels.</p>`;
}
async function foodScanOpenPhoto(id){try{const b=await dbRead(id);if(!b)throw Error('Photo missing');download('SEMITS_MEAL_PHOTO.jpg',b)}catch(e){notify('Photo could not be retrieved: '+e.message)}}
async function foodScanDelete(id){if(!confirm('Delete this food review and its saved photo?'))return;const r=(data.foodReviews||[]).find(x=>x.id===id&&x.pid===data.active);if(!r)return;if(r.photoId){try{await dbRemove(r.photoId)}catch(e){return notify('Unable to delete photo: '+e.message)}}data.foodReviews=data.foodReviews.filter(x=>x.id!==id);save();render();notify('Meal review deleted');}
function foodScanExport(){const hist=(data.foodReviews||[]).filter(x=>x.pid===data.active);download('SEMITS_MEALS_'+date()+'.json',new Blob([JSON.stringify(hist,null,2)],{type:'application/json'}))}
if(typeof module!=='undefined')module.exports={FOOD_SCAN_TYPES,foodScanGrams,foodScanEstimate,foodScanAssessment,foodScanLocalInput};
