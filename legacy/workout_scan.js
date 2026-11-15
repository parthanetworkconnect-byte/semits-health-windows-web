"use strict";
/* Workout photos are references: no claim of visual form analysis without a vision model.
 * User reviews extracted data and receives non-diagnostic coaching notes. */
let workoutScanFile=null, workoutScanPreviewUrl=null, workoutOCRRaw='';
const workoutTypes=['Treadmill','Brisk walking','Stationary bike','Elliptical','Rowing','Weight lifting','Resistance machine','Aerobics','Pilates','Yoga','Swimming','Sports','Body composition scan','Other'];
const workoutSource=['Machine display (confirmed)','Body scan (confirmed)','User entered','Estimated / unverified'];
function workoutAnalysis(r){
 const k=Number(r.minutes)||0,d=Number(r.distance)||0,kcal=Number(r.kcal)||0;
 const notes=[], next=[];
 if(r.type==='Body composition scan'){
  notes.push('Body composition scanners estimate fat and lean mass using device-specific assumptions. Hydration, meals, recent exercise and measurement timing can affect readings.');
  if(Number(r.visceralArea)>0)notes.push('Visceral fat area was entered. Compare with the same instrument and discuss device reference ranges and metabolic risk with a clinician.');
  if(Number(r.bodyFat)>0)notes.push('Body fat percentage is not a diagnosis. Review trends under consistent conditions rather than aiming for a single numerical target.');
  next.push('Repeat under comparable conditions if monitoring trends; ask a qualified clinician or dietitian before acting on an abnormal instrument flag.');
 } else if(['Treadmill','Brisk walking','Stationary bike','Elliptical','Rowing'].includes(r.type)){
  notes.push(`Session reported as ${k?`${k} minutes`:'duration not entered'}${d?` and ${d} km`:''}. Increase duration or intensity gradually according to your tolerance.`);
  if(kcal)notes.push(`${kcal} kcal is a machine/user figure, not an independently verified energy expenditure or a recommended food allowance.`);
  next.push('Build a sustainable aerobic routine with warm-up and cool-down; record perceived effort, not only calories.');
  if(k && k<10)next.push('Begin with comfortable short sessions and increase only as tolerated.');
 } else {
  notes.push('A still image can show equipment and approximate posture, but cannot establish motion quality, joint loading or injury risk.');
  next.push('Choose a manageable load and controlled movement; record sets, reps and perceived effort. A qualified trainer can assess technique in person.');
  if(['Pilates','Yoga'].includes(r.type))next.push('Prioritise breathing, comfortable range of motion and stability, not extreme stretching.');
 }
 if(r.intensity==='Hard')notes.push('Hard-intensity sessions call for recovery and a progression appropriate to fitness, medication and health history.');
 if(r.pain==='Yes')notes.push('Pain, dizziness, chest symptoms or unusual breathlessness are reasons to stop and obtain appropriate medical assessment; urgent symptoms require urgent care.');
 if(r.goal==='Strength')next.push('Allow recovery between demanding sessions for the same muscle groups.');
 else if(r.goal==='Mobility')next.push('Include brief daily mobility and balance work where appropriate.');
 else next.push('Mix aerobic activity, strength training, recovery, sleep and adequate nutrition over the week.');
 if(!r.minutes && r.type!=='Body composition scan')notes.push('Duration not supplied; the programme cannot assess weekly exercise volume from this record.');
 next.push('Aim for consistency over weeks; discuss limitations and appropriate exercise targets with a clinician if you have a medical condition.');
 return {notes,next,confidence: r.source==='Estimated / unverified'?'Unverified': 'Values recorded from '+r.source.toLowerCase()};
}
function workoutScanPage(){const p=profile(),rows=mine('workoutReviews').slice().reverse();return head('Workout photo & performance analysis','Upload a treadmill screen, body scan, gym exercise, aerobics, Pilates, yoga or other activity photo. Review the numbers before saving.')+`
<div class="grid two"><section class="card"><h2>1 · Upload your activity photo</h2>
<p>Use the original photo or a tightly cropped report (not a screenshot of a photo viewer). OCR and measurements are suggestions only. Confirm all values before saving; there is no automatic exercise-form diagnosis.</p>
<label class="field">Camera / photo gallery<input id="workoutScanImage" type="file" accept="image/*" capture="environment"></label>
<div id="workoutPhotoPreview" class="workout-preview"><div class="empty">Your photograph appears here</div></div>
<div class="callout warning">If you use the optional OCR button on the local server, confirm every digit against the original screen, especially decimal points and units. No image is sent to an external AI service.</div>
<button class="btn secondary" type="button" id="workoutOCRButton">Read numbers from photo (local OCR)</button><div id="workoutOCRStatus" class="filehint"></div><div id="workoutOCRReview"></div>
</section><section class="card"><h2>2 · Confirm workout measurements</h2><form class="form-grid" id="workoutScanForm">
${field('Date','day','date',date(),'required')}${sel('Activity','type',workoutTypes)}
${sel('Value source','source',workoutSource)}${sel('Effort','intensity',['Easy','Moderate','Hard'])}
${field('Duration (minutes)','minutes','number','','min="0" max="1440" step="0.01"')}${field('Distance (km)','distance','number','','min="0" max="1000" step="0.01"')}
${field('Machine calories (kcal)','kcal','number','','min="0" max="10000" step="1"')}${field('Speed (km/h, if known)','speed','number','','min="0" max="100" step="0.1"')}
${field('Incline (% if known)','incline','number','','min="0" max="40" step="0.1"')}${field('Heart rate (bpm, optional)','heartRate','number','','min="0" max="260"')}
${field('Sets','sets','number','','min="0" max="200"')}${field('Repetitions','reps','number','','min="0" max="500"')}
${field('Resistance weight (kg)','resistance','number','','min="0" max="1000" step="0.25"')}${field('Body weight (kg)','bodyWeight','number','','min="0" max="500" step="0.1"')}
${field('Body fat (% optional)','bodyFat','number','','min="0" max="80" step="0.1"')}${field('Visceral fat area (cm² optional)','visceralArea','number','','min="0" max="1000" step="0.1"')}
${sel('Goal','goal',['General fitness','Strength','Endurance','Mobility','Healthy ageing'])}${sel('Pain or concerning symptoms?','pain',['No','Yes'])}
${area('How did it feel? Machine or technique notes','notes')}<div class="span2"><button class="btn" type="submit">Analyse and save this workout</button></div>
</form></section></div>
<div class="section-title">EXERCISE HISTORY & NEXT STEPS</div>${card('Saved photo-based reviews',rows.length?rows.map(x=>{const a=workoutAnalysis(x);return `<section class="workout-review"><div class="between"><strong>${safe(x.type)} · ${safe(x.day)}</strong><span class="pill">${safe(x.source)}</span></div><p>${safe(x.minutes||'—')} min · ${safe(x.distance||'—')} km · ${safe(x.kcal||'—')} kcal · ${safe(x.intensity)}</p>${x.photoId?`<button class="btn secondary" data-workout-photo="${safe(x.photoId)}">View saved photo</button>`:''} <button class="btn secondary" data-workout-delete="${safe(x.id)}">Delete review</button><h3>Interpretation and precautions</h3><ul>${a.notes.map(t=>`<li>${safe(t)}</li>`).join('')}</ul><h3>Suggested next actions</h3><ul>${a.next.map(t=>`<li>${safe(t)}</li>`).join('')}</ul><p class="filehint">Source: ${safe(a.confidence)}. Advice is general wellness education, not clinical clearance or exercise technique certification.</p></section>`}).join(''):'<div class="empty">No photo-based workouts yet. Upload your first photo, confirm measurements, then save.</div>')}
<div class="callout">For most adults, WHO recommends at least 150–300 minutes of moderate aerobic activity per week and muscle strengthening on 2 or more days, adapted to capability. This is a public-health benchmark, not an individual prescription. <a href="https://www.who.int/news-room/fact-sheets/detail/physical-activity" target="_blank" rel="noopener">WHO guidance</a>.</div>`}
function workoutScanMounted(){const btn=document.getElementById('workoutOCRButton');if(btn)btn.onclick=workoutScanOCR;const apply=document.getElementById('workoutApplyOCR');if(apply)apply.onclick=workoutApplyOCR;}
async function workoutScanPreview(file){if(!file.type.startsWith('image/'))return notify('Choose an image');if(file.size>8*1024*1024)return notify('Image must be 8 MB or less. Resize or compress the photo.');workoutScanFile=file;if(workoutScanPreviewUrl)URL.revokeObjectURL(workoutScanPreviewUrl);workoutScanPreviewUrl=URL.createObjectURL(file);let target=document.getElementById('workoutPhotoPreview');if(target){target.innerHTML='';const img=document.createElement('img');img.src=workoutScanPreviewUrl;img.alt='Workout photo chosen for analysis';img.style.cssText='max-width:100%;max-height:580px;object-fit:contain;border-radius:12px';target.appendChild(img)}}
// These labels must appear near a result to avoid guessing random numbers from screenshot chrome.
function workoutOCRCandidates(t){
 const out={};
 const rules={
  bodyWeight:[/(?:^|\n)\s*(?:weight|body weight)\s*[:\-]?\s*(\d{2,3}(?:[.,]\d)?)\s*kg\b/im],
  bodyFat:[/(?:body fat percentage|body fat %)\s*[:\-]?\s*(\d{1,2}(?:[.,]\d)?)\s*%/im],
  visceralArea:[/(?:visceral fat area)\s*[:\-]?\s*(\d{1,3}(?:[.,]\d)?)\s*(?:cm2|cm²|\bhigh\b|\bover\b|$)/im],
  distance:[/(?:distance)\s*[:\-]?\s*(\d{1,3}(?:[.,]\d{1,2})?)\s*(?:km|kilomet)/im],
  kcal:[/(?:calories|kcal|energy burned)\s*[:\-]?\s*(\d{1,4})\s*(?:kcal|cal|$)/im],
  heartRate:[/(?:heart rate|pulse)\s*[:\-]?\s*(\d{2,3})\s*(?:bpm|$)/im],
  minutes:[/(?:duration|elapsed time|time)\s*[:\-]?\s*(\d{1,3}(?:[.,]\d{1,2})?)\s*(?:min|minutes)/im]
 };
 for(const [field,patterns] of Object.entries(rules))for(const pat of patterns){let m=t.match(pat);if(m){out[field]=m[1].replace(',','.');break}}
 return out;
}
function workoutRenderOCR(raw){
 workoutOCRRaw=raw;
 const out=document.getElementById('workoutOCRReview');if(!out)return;
 const findings=workoutOCRCandidates(raw),entries=Object.entries(findings);
 out.replaceChildren();
 const intro=document.createElement('p');intro.textContent=entries.length?`Found ${entries.length} possible measurement(s). Review against the original before applying.`:'No confident measurements found. Try the original, tightly cropped image, or enter values manually.';out.appendChild(intro);
 if(entries.length){const list=document.createElement('ul');for(const [k,v] of entries){const li=document.createElement('li');li.textContent=k+': '+v;list.appendChild(li)}out.appendChild(list);const b=document.createElement('button');b.type='button';b.id='workoutApplyOCR';b.className='btn secondary';b.textContent='Apply suggestions to EMPTY fields for review';b.onclick=()=>workoutApplyOCR(findings);out.appendChild(b)}
 const details=document.createElement('details'),summary=document.createElement('summary'),pre=document.createElement('pre');summary.textContent='Inspect complete OCR text';pre.textContent=raw.slice(0,12000);pre.style.cssText='white-space:pre-wrap;max-height:280px;overflow:auto;font-size:12px';details.append(summary,pre);out.appendChild(details);
}
function workoutApplyOCR(found){const values=found||workoutOCRCandidates(workoutOCRRaw);const f=document.getElementById('workoutScanForm');if(!f)return;let n=0;for(const [k,v] of Object.entries(values)){const el=f.elements.namedItem(k);if(el&&!el.value){el.value=v;n++}}const source=f.elements.namedItem('source');if(source)source.value='Estimated / unverified';notify(n+' OCR suggestions inserted. Verify every digit, units, and source before saving.');}
async function workoutScanOCR(){
 const status=document.getElementById('workoutOCRStatus');if(!workoutScanFile){notify('Choose a workout image first');return}
 if(location.protocol==='file:'){status.textContent='OCR needs the local server. Launch START_WINDOWS.bat and use http://127.0.0.1:8773 — not the File address.';return}
 status.textContent='Checking local OCR availability…';
 try{
  const c=await fetch('/api/health');if(!c.ok)throw Error('Local server is not running');
  const response=await fetch('/api/ocr-image',{method:'POST',headers:{'Content-Type':workoutScanFile.type},body:workoutScanFile});
  const j=await response.json();if(!response.ok)throw Error(j.error||'OCR unavailable');
  status.textContent='OCR results are unverified. Compare them with the original image; unreadable digits must be entered manually.';
  workoutRenderOCR(j.text||'');
 }catch(e){status.textContent='Local OCR unavailable: '+e.message+'. Check the local server and OCR installation; manual entry still works.'}
}
async function workoutScanSubmit(form){const v=Object.fromEntries(new FormData(form).entries());for(const key of ['minutes','distance','kcal','speed','incline','heartRate','sets','reps','resistance','bodyWeight','bodyFat','visceralArea']){if(v[key]!==''&&(!Number.isFinite(+v[key])||+v[key]<0)){notify('Check numeric measurement: '+key);return}}if(!v.minutes&&!v.distance&&!v.bodyWeight&&!v.bodyFat&&!v.visceralArea&&!v.notes.trim()){notify('Enter at least one verified measurement or a session note');return}if(v.pain==='Yes'&&!confirm('Concerning symptoms were reported. The app cannot provide medical clearance. Save as a record only?'))return;let photoId=null;try{if(workoutScanFile){photoId=uid();await dbWrite(photoId,workoutScanFile)}data.workoutReviews.push({...v,pid:data.active,id:uid(),photoId,created:Date.now()});save();workoutScanFile=null;if(workoutScanPreviewUrl)URL.revokeObjectURL(workoutScanPreviewUrl);workoutScanPreviewUrl=null;render();notify('Workout reviewed and saved for the selected profile')}catch(e){notify('Unable to save workout: '+e.message)}}
async function workoutOpenPhoto(photoId){try{const b=await dbRead(photoId);if(!b)return notify('Saved photo not found on this device');const url=URL.createObjectURL(b),link=document.createElement('a');link.href=url;link.download='SEMITS_workout_photo';document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),2000)}catch(e){notify(e.message)}}
async function workoutDelete(id){if(!confirm('Remove this workout review and its associated photo?'))return;const x=mine('workoutReviews').find(r=>r.id===id);if(!x)return;data.workoutReviews=data.workoutReviews.filter(r=>r.id!==id);save();if(x.photoId)try{await dbRemove(x.photoId)}catch{}render();notify('Workout review deleted')}
