'use strict';
/* SEMITS V524 R4.3 experimental, conservative decision-support rules. NOT a diagnostic AI.
   Stores trial onboarding only within the currently unlocked encrypted local vault.
   No remote model, account registration, medical prescriptions, or automatic recovery. */
(function(){
const KEY='semits-r43-personal-assistant-v1';
let input=null, lastId=null;
const E=v=>r4esc(String(v==null?'':v));
const opts=(values,sel='')=>values.map(x=>'<option value="'+E(x)+'" '+(sel===x?'selected':'')+'>'+E(x)+'</option>').join('');
const flags=['High blood pressure','Diabetes / prediabetes','High cholesterol','Thyroid condition','Heart / circulation condition','Kidney condition','Liver condition','Joint / back pain','Persistent fatigue','Medication considerations','Pregnancy / postpartum','Other condition'];
const moves=['Walking','Treadmill','Strength / resistance training','Cycling','Swimming','Pilates','Yoga','Mobility / stretching','Running / jogging','Other / mixed'];
const goals=['maintenance','loss','gain','muscle','fitness'];
const labelGoal={maintenance:'Maintain wellbeing',loss:'Healthy fat loss',gain:'Healthy weight gain',muscle:'Build muscle / strength',fitness:'Fitness and endurance'};
function checkboxes(name,items,chosen=[]){return '<div class="r43-check-grid">'+items.map(x=>'<label class="r43-check"><input type="checkbox" name="'+name+'" value="'+E(x)+'" '+(chosen.includes(x)?'checked':'')+'> '+E(x)+'</label>').join('')+'</div>'}
function form(){
 const original=livingState.profile||{};
 const mappedGoal=original.goal==='maintain'?'maintenance':original.goal;
 const defaultMove=original.movement==='pilates'?['Pilates']:original.movement==='strength'?['Strength / resistance training']:original.movement==='walking'?['Walking']:[];
 const base={age:original.age||'',height:original.height||'',weight:original.weight||'',goal:labelGoal[mappedGoal]?mappedGoal:'maintenance',
 diet:original.cuisine==='vegan'?'Vegan':original.cuisine==='vegetarian'?'Vegetarian':original.cuisine==='pescatarian'?'Pescatarian':'Mixed / omnivore',
 movement:defaultMove,flags:original.concern==='fatigue'?['Persistent fatigue']:original.concern==='medical'?['Other condition']:[],days:3};
 const a={...base,...(input||{})};
 return '<div class="r43-layout"><section class="card"><h2>First-time personal wellness interview</h2>'+
 '<p class="note">Experimental rule-based assistant. Your answers inform a starting plan, not a diagnosis or prescription. Use fictional data until independent security and clinical review.</p>'+
 '<form id="r43-form" class="r43-form">'+
 '<div class="r43-grid">'+
 '<label>Preferred goal<select name="goal">'+goals.map(x=>'<option value="'+x+'" '+(a.goal===x?'selected':'')+'>'+labelGoal[x]+'</option>').join('')+'</select></label>'+
 '<label>Age (adult trial only)<input required type="number" name="age" min="18" max="100" value="'+E(a.age||'')+'"></label>'+
 '<label>Height (cm)<input required type="number" name="height" min="100" max="230" step=".1" value="'+E(a.height||'')+'"></label>'+
 '<label>Weight (kg)<input required type="number" name="weight" min="25" max="350" step=".1" value="'+E(a.weight||'')+'"></label>'+
 '<label>Usual activity<select name="activity">'+opts(['Mostly sitting','Lightly active','Moderately active','Very active'],a.activity)+'</select></label>'+
 '<label>Usual bedtime<input type="time" name="bed" value="'+E(a.bed||'22:00')+'"></label>'+
 '<label>Usual wake time<input type="time" name="wake" value="'+E(a.wake||'06:00')+'"></label>'+
 '<label>Food preference<select name="diet">'+opts(['Mixed / omnivore','Vegetarian','Vegan','Pescatarian','Other / custom'],a.diet)+'</select></label>'+
 '<label>Workout experience<select name="experience">'+opts(['Beginner','Some experience','Experienced'],a.experience)+'</select></label>'+
 '<label>Preferred workout days per week<input type="number" min="0" max="7" name="days" value="'+E(a.days??3)+'"></label></div>'+
 '<h3>Health considerations — select any that apply</h3>'+
 checkboxes('flags',flags,a.flags||[])+
 '<h3>Activities you enjoy — select any</h3>'+
 checkboxes('movement',moves,a.movement||[])+
 '<h3>Current concern or discomfort</h3>'+
 '<div class="r43-grid"><label>Activity causing discomfort<select name="painActivity">'+opts(['None','Pilates','Walking','Running','Strength training','Other activity'],a.painActivity)+'</select></label>'+
 '<label>Pain location<select name="painLocation">'+opts(['None','Lower back','Upper back / neck','Knee','Shoulder','Other'],a.painLocation)+'</select></label>'+
 '<label>Pain pattern<select name="painPattern">'+opts(['None','Mild and resolves with rest','Recurring / worsening','Severe / sudden'],a.painPattern)+'</select></label>'+
 '<label>How long has it occurred?<select name="painDuration">'+opts(['Not applicable','Today / within 24 hours','Several days','More than two weeks'],a.painDuration)+'</select></label></div>'+
 '<fieldset class="r43-risk"><legend>Important warning signs</legend>'+
 '<p class="note">For new severe symptoms, do not rely on this demonstration. Select any warning signs that apply.</p>'+
 checkboxes('redflags',['New weakness / numbness in both legs','New bladder or bowel control changes','Numbness around groin / saddle area','Chest pain or fainting','Severe breathing difficulty','Fever with serious back pain','Pain following a serious accident'],a.redflags||[])+
 '</fieldset><label>Other priorities (optional)<textarea name="notes" maxlength="300" placeholder="For example, work shifts, time constraints, foods to avoid">'+E(a.notes||'')+'</textarea></label>'+
 '<div class="row"><button type="submit" class="btn">Generate my starting plan</button><button type="button" class="btn outline" id="r43-reset">Clear questionnaire</button></div>'+
 '</form></section><div id="r43-plan">'+(input?planHTML(input):'<section class="card"><h2>Your plan</h2><p>Complete the interview to see a food, workout, cardio, sleep and monitoring plan tailored to your answers.</p></section>')+'</div></div>';
}
function planHTML(a){
 const concerning=a.redflags.length>0,urgent=a.redflags.some(x=>/bladder|bowel|saddle|both legs|Chest pain|breathing|fainting/.test(x));
 const pain=a.painLocation!=='None'&&a.painPattern!=='None';
 const unresolved=pain&&(a.painPattern==='Recurring / worsening'||a.painPattern==='Severe / sudden'||a.painDuration==='More than two weeks');
 const complex=a.flags.some(x=>/Heart|Kidney|Pregnancy|Diabetes|blood pressure/i.test(x));
 const cautious=concerning||unresolved||complex;
 const movement=a.movement.length?a.movement.join(', '):'walking and accessible movement';
 const days=Math.max(0,Math.min(7,Number(a.days)||0));
 const exercise=concerning?'Do not continue the provoking workout until urgent warning signs are assessed.':unresolved?'Avoid movements that worsen the pain; arrange a clinician or physiotherapist assessment before progressing training.':a.experience==='Beginner'?'Start with short, manageable sessions and gradually increase according to tolerance.':'Maintain a sustainable schedule and progress gradually while monitoring recovery.';
 const meal=a.diet==='Vegan'?'Include legumes, soy products, whole grains, vegetables, fruit and reliable vitamin B12 sources.':a.diet==='Vegetarian'?'Build meals around legumes, dairy or eggs if included, whole grains, vegetables and fruit.':'Build varied meals with vegetables, whole grains and appropriate protein foods.';
 const goal=a.goal==='loss'?'Aim for consistent meals and a gradual, sustainable change, rather than extreme restriction.':a.goal==='gain'?'Consider regular nutritious meals and snacks, with resistance training when appropriate.':a.goal==='muscle'?'Include regular protein-containing foods and progressive resistance work when appropriate.':a.goal==='fitness'?'Support endurance with balanced eating, hydration and gradual conditioning.':'Maintain varied food intake and a regular routine.';
 const sleep='Aim for a consistent wake time and sufficient sleep opportunity (generally 7–9 hours for adults); adjust to individual circumstances.';
 const referral=urgent?'Urgent assessment needed: seek emergency care now for concerning neurological, chest or breathing symptoms. In Australia, call 000 for an emergency.':concerning?'Seek prompt in-person medical assessment for these warning signs; do not continue the triggering exercise.':unresolved?'Arrange a GP or physiotherapist assessment. Symptom pattern alone cannot determine the cause of back pain.':complex?'Discuss activity and nutrition changes with a qualified clinician, especially if you take medicines or have a heart, kidney, pregnancy-related or metabolic condition.':'If pain persists, worsens or limits daily activities, discuss it with a GP or physiotherapist.';
 const why='This plan was adapted using your goal ('+labelGoal[a.goal]+'), exercise experience ('+a.experience+'), preferred movement ('+movement+'), health flags, sleep schedule, and discomfort responses.';
 const box=(heading,text)=>'<div class="r43-plan-cell"><h3>'+heading+'</h3><p>'+E(text)+'</p></div>';
 return '<section class="card"><h2>Your personalised starting plan</h2>'+
 (concerning?'<div class="r43-alert"><strong>Safety warning:</strong> '+E(referral)+'</div>':'')+
 '<p class="note">'+E(why)+'</p><div class="r43-plan-grid">'+
 box('Eating plan',goal+' '+meal)+
 box('Workout plan',(cautious?'Safety-first activity guidance: ':'Suggested activity: '+movement+'. ')+exercise)+
 box('Cardio plan',cautious?'Do not intensify cardio until your health concerns or warning signs have been reviewed.':'Choose comfortable walking, cycling or swimming as preferred; distribute activity across up to '+days+' planned days and increase gradually.')+
 box('Sleep plan',sleep+' Your entered routine: '+a.bed+' to '+a.wake+'.')+
 box('Weight management','Monitor weekly weight trends if appropriate. Avoid drawing conclusions from one reading. Calorie targets require validated intake and health context; no automatic prescription is given here.')+
 box('Pain-aware guidance',pain?'Discomfort during '+a.painActivity+' near '+a.painLocation.toLowerCase()+' could have different causes. Stop or modify painful movements; do not diagnose it from this form. '+referral:'No activity-related discomfort was reported. Stop and reassess any exercise that produces concerning symptoms.')+
 box('Professional referral',referral)+
 box('Daily follow-up','Record actual meals, activity, pain changes, sleep duration and fatigue. Reassess if health details or goals change. Missing data should remain unknown, not assumed normal.')+
 '</div><p class="note">Rule-based educational recommendations only — not generated by a medical model, not a prescription, no autonomous referrals. Reviewed clinical protocols and an audited AI model are required before production.</p></section>';
}
function readForm(f){
 const fields=new FormData(f),g=name=>String(fields.get(name)||'');
 const a={goal:g('goal'),age:Number(g('age')),height:Number(g('height')),weight:Number(g('weight')),activity:g('activity'),bed:g('bed'),wake:g('wake'),diet:g('diet'),experience:g('experience'),days:Number(g('days')),flags:fields.getAll('flags').map(String),movement:fields.getAll('movement').map(String),painActivity:g('painActivity'),painLocation:g('painLocation'),painPattern:g('painPattern'),painDuration:g('painDuration'),redflags:fields.getAll('redflags').map(String),notes:g('notes')};
 if(!(a.age>=18&&a.age<=100&&a.height>=100&&a.height<=230&&a.weight>=25&&a.weight<=350&&a.days>=0&&a.days<=7))throw Error('Check the age, height, weight and activity-day values.');
 return a;
}
async function load(){
 if(!vaultKey){input=null;lastId=null;return}
 const id=r41active()?.id||'default';
 if(lastId===id)return;
 lastId=id;
 try{input=await livingEncryptedRead(KEY+':'+id)}catch{input=null}
}
menus.push(['assistant','✧','Personal AI Guide']);
sections.assistant=()=>'<div class="r4-hero"><div><div class="r4-eyebrow">SEMITS HEALTH · R4.3 EXPERIMENTAL</div><h1>My Personal Health Guide</h1><p>First-time interview · coordinated plan · pain-aware screening · daily guidance</p></div></div>'+
 (!vaultKey?'<section class="card"><h2>Unlock your trial vault</h2><p>Go to My Health Hub and unlock or create your test vault first. The interview is not available while locked.</p><a href="#hub" class="btn">Open My Health Hub</a></section>':form());
document.addEventListener('submit',async e=>{
 if(e.target.id!=='r43-form')return;
 e.preventDefault();e.stopImmediatePropagation();
 if(!vaultKey)return;
 try{const next=readForm(e.target);await livingEncryptedWrite(KEY+':'+(r41active()?.id||'default'),next);input=next;document.querySelector('#r43-plan').innerHTML=planHTML(next)}
 catch(err){alert('Unable to prepare plan: '+(err.message||'invalid values'))}
},true);
document.addEventListener('click',e=>{if(e.target.id==='r43-reset'&&confirm('Clear the questionnaire shown on this screen? Previously saved encrypted answers remain until replaced.')){input=null;document.querySelector('#main').innerHTML=sections.assistant()}});
window.addEventListener('hashchange',()=>{if(location.hash==='#assistant'){load().then(()=>{if(location.hash==='#assistant')nav()})}});
})();