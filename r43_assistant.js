'use strict';
/* SEMITS V524 R4.3 experimental, conservative decision-support rules. NOT a diagnostic AI.
   Stores trial onboarding only within the currently unlocked encrypted local vault.
   No remote model, account registration, medical prescriptions, or automatic recovery. */
(function(){
const KEY='semits-r43-personal-assistant-v1';
let input=null, lastId=null;
const E=v=>r4esc(String(v==null?'':v));
const opts=(values,sel='')=>values.map(x=>'<option value="'+E(x)+'" '+(sel===x?'selected':'')+'>'+E(x)+'</option>').join('');
const flags=['High blood pressure','Diabetes / prediabetes','High cholesterol','Thyroid condition','Heart / circulation condition','Kidney condition','Liver condition','Joint / back pain','Persistent fatigue','Medication considerations','Pregnancy / postpartum','Menstrual cycle changes','Perimenopause / menopause','Recovery from illness / injury','Neurological / mobility condition','Other condition'];
const moves=['Walking','Treadmill','Strength / resistance training','Cycling','Swimming','Pilates','Yoga','Mobility / stretching','Running / jogging','Balance / functional activity','Clinician-directed physio exercises','Other / mixed'];
const goals=['maintenance','loss','gain','muscle','fitness','shape','recomposition','rehab','condition','womens','mobility','custom'];
const labelGoal={maintenance:'Maintain wellbeing',loss:'Healthy fat loss',gain:'Healthy weight gain',muscle:'Build muscle / strength',fitness:'Fitness and endurance',shape:'Targeted Muscle Development & Body Shaping',recomposition:'Body recomposition',rehab:'Recovery / rehabilitation-informed activity',condition:'Condition-aware wellness',womens:'Women’s health / menstrual wellbeing',mobility:'Mobility, balance and function',custom:'Custom combined goals'};
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
 '<label>Age (5–100; young-person safety pathway)<input required type="number" name="age" min="5" max="100" value="'+E(a.age||'')+'"></label>'+
 '<label>Height (cm)<input required type="number" name="height" min="100" max="230" step=".1" value="'+E(a.height||'')+'"></label>'+
 '<label>Weight (kg)<input required type="number" name="weight" min="25" max="350" step=".1" value="'+E(a.weight||'')+'"></label>'+
 '<label>Usual activity<select name="activity">'+opts(['Mostly sitting','Lightly active','Moderately active','Very active'],a.activity)+'</select></label>'+
 '<label>Usual bedtime<input type="time" name="bed" value="'+E(a.bed||'22:00')+'"></label>'+
 '<label>Usual wake time<input type="time" name="wake" value="'+E(a.wake||'06:00')+'"></label>'+
 '<label>Food preference<select name="diet">'+opts(['Mixed / omnivore','Vegetarian','Vegan','Pescatarian','Other / custom'],a.diet)+'</select></label>'+
 '<label>Workout experience<select name="experience">'+opts(['Beginner','Some experience','Experienced'],a.experience)+'</select></label>'+
 '<label>Preferred workout days per week<input type="number" min="0" max="7" name="days" value="'+E(a.days??3)+'"></label>'+ 
 '<label>Training history (years)<input type="number" min="0" max="60" step="0.5" name="trainingYears" value="'+E(a.trainingYears??0)+'"></label>'+ 
 '<label>Typical workout duration (minutes)<input type="number" min="0" max="240" name="minutes" value="'+E(a.minutes??45)+'"></label></div>'+
 '<h3>Target body areas / functions — select any</h3>'+checkboxes('bodyAreas',['Whole body','Glutes / hips','Shoulders','Arms','Back','Chest','Core','Legs','Balance / function','Cardio endurance'],a.bodyAreas||[])+
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
 const complex=a.flags.some(x=>/Heart|Kidney|Pregnancy|Diabetes|blood pressure|Neurological|Recovery from illness/i.test(x));
 const young=a.age<18;
 const cautious=concerning||unresolved||complex||young;
 const movement=a.movement.length?a.movement.join(', '):'walking and accessible movement';
 const days=Math.max(0,Math.min(7,Number(a.days)||0));
 const targeted=a.goal==='shape'&&Number(a.trainingYears)>=2;
 const chosenAreas=a.bodyAreas?.length?a.bodyAreas.join(', '):'whole body';
 const selectedStrength=['muscle','shape','recomposition'].includes(a.goal);
 const generalStrength=selectedStrength?'Prioritise the selected muscle areas ('+chosenAreas+') with suitable resistance exercises, balanced work for opposing muscle groups, progression based on completed sessions, and sufficient recovery. Specific sets and loads must be selected from actual training history and technique. ':'';

 const clinicalGoal=['rehab','condition','womens'].includes(a.goal);
 const adultWeightGoal=['loss','gain','recomposition'].includes(a.goal);
 const exercise=young?'For a child or teenager, use age-appropriate enjoyable movement under caregiver guidance; avoid adult training loads or weight-loss prescriptions.':concerning?'Do not continue the provoking workout until urgent warning signs are assessed.':unresolved?'Avoid movements that worsen the pain; arrange a clinician or physiotherapist assessment before progressing training.':a.experience==='Beginner'?'Start with short, manageable sessions and gradually increase according to tolerance.':'Maintain a sustainable schedule and progress gradually while monitoring recovery.';
 const meal=a.diet==='Vegan'?'Include legumes, soy products, whole grains, vegetables, fruit and reliable vitamin B12 sources.':a.diet==='Vegetarian'?'Build meals around legumes, dairy or eggs if included, whole grains, vegetables and fruit.':'Build varied meals with vegetables, whole grains and appropriate protein foods.';
 const goal=young?'Focus on adequate nourishing meals, wellbeing and healthy growth. Do not prescribe calorie restriction or weight targets to children.':a.goal==='rehab'?'Follow the activity limits and individualised rehabilitation plan supplied by a treating clinician or physiotherapist; do not self-prescribe rehabilitation.':a.goal==='condition'?'Support condition management through a sustainable activity and nutrition routine agreed with your healthcare team; no disease treatment claims.':a.goal==='womens'?'Consider menstrual symptoms, life stage, adequate energy and iron-rich foods where appropriate; seek clinical evaluation for persistent irregular, absent, painful or heavy periods.':a.goal==='mobility'?'Support balance, gentle strength and everyday physical function with gradual, accessible movement.':a.goal==='recomposition'?'Aim to improve strength and body composition over time with sufficient dietary protein and appropriate energy intake; avoid crash diets.':a.goal==='shape'?'Maintain adequate total energy intake and include protein-containing foods throughout the day; a large calorie deficit can compromise muscle gain.':a.goal==='loss'?'Aim for consistent meals and a gradual, sustainable change, rather than extreme restriction.':a.goal==='gain'?'Consider regular nutritious meals and snacks, with resistance training when appropriate.':a.goal==='muscle'?'Include regular protein-containing foods and progressive resistance work when appropriate.':a.goal==='fitness'?'Support endurance with balanced eating, hydration and gradual conditioning.':'Maintain varied food intake and a regular routine.';
 const sleep='Aim for a consistent wake time and sufficient sleep opportunity (generally 7–9 hours for adults); adjust to individual circumstances.';
 const referral=urgent?'Urgent assessment needed: seek emergency care now for concerning neurological, chest or breathing symptoms. In Australia, call 000 for an emergency.':concerning?'Seek prompt in-person medical assessment for these warning signs; do not continue the triggering exercise.':unresolved?'Arrange a GP or physiotherapist assessment. Symptom pattern alone cannot determine the cause of back pain.':complex?'Discuss activity and nutrition changes with a qualified clinician, especially if you take medicines or have a heart, kidney, pregnancy-related or metabolic condition.':'If pain persists, worsens or limits daily activities, discuss it with a GP or physiotherapist.';
 const why='This plan was adapted using your selected body areas ('+chosenAreas+'), health needs, and your goal ('+labelGoal[a.goal]+'), exercise experience ('+a.experience+'), training years ('+(a.trainingYears||0)+'), usual session duration ('+(a.minutes||0)+' minutes), preferred movement ('+movement+'), health flags, sleep schedule, and discomfort responses.';
 const box=(heading,text)=>'<div class="r43-plan-cell"><h3>'+heading+'</h3><p>'+E(text)+'</p></div>';
 return '<section class="card"><h2>Your personalised starting plan</h2>'+
 (concerning?'<div class="r43-alert"><strong>Safety warning:</strong> '+E(referral)+'</div>':'')+
 '<p class="note">'+E(why)+'</p><div class="r43-plan-grid">'+
 box('Eating plan',goal+' '+meal)+
 box('Workout plan',(cautious?'Safety-first activity guidance: ':targeted?'Experienced targeted muscle-development focus: ': 'Suggested activity: '+movement+'. ')+(targeted&&!cautious?'Choose 1–3 muscle groups from the selected body areas, train each appropriately across the week, include balanced opposing muscle groups and adequate recovery. Base exercise selection, effort and progression on current abilities, equipment, history and response. Start with prior tolerable training volume rather than automatically increasing it. ':!cautious?generalStrength:exercise)+exercise)+
 box('Targeted muscle progress',targeted&&!cautious?'Record relevant exercise weights, repetitions, hard sets, technique and perceived effort for the selected muscle groups. Monitor progress every 4–6 weeks with consistent photos or body measurements if desired. Short-term strength improvement may precede visible muscle changes; assess hypertrophy over 3–6 months, without promising a shape or size.':'Set clear, measurable performance goals and review progress over time.')+
 box('Age and health-specific support',young?'Young person: caregiver participation and an age-appropriate clinician or paediatric dietitian may be needed. This prototype does not provide body-shaping or weight-loss programmes to minors.':a.goal==='womens'||a.flags.includes('Menstrual cycle changes')?'Track cycle timing, pain and flow patterns if useful. Persistent irregular, absent, very painful or heavy periods merit GP assessment; exercise alone cannot correct an underlying menstrual disorder.':a.goal==='rehab'||a.flags.includes('Recovery from illness / injury')?'Use only rehabilitation exercises individually cleared by a physiotherapist or clinician; stop if symptoms worsen. SEMITS cannot diagnose an injury or replace a physiotherapy assessment.':a.goal==='condition'?'Work with a healthcare professional to tailor activity to medicines, condition severity and limitations. Exercise can support some conditions but cannot be assumed to control or reverse a disease.':'Plan should reflect your actual tolerance, age, preferences and ability; reassess as circumstances change.')+
 box('Cardio plan',cautious?'Do not intensify cardio until your health concerns or warning signs have been reviewed.':'Choose comfortable walking, cycling or swimming as preferred; distribute activity across up to '+days+' planned days and increase gradually.')+
 box('Sleep plan',sleep+' Your entered routine: '+a.bed+' to '+a.wake+'.')+
 box('Weight management',young?'Avoid adult BMI or calorie restriction targets; prioritise healthy growth, nourishment and appropriate caregiver/clinical support.':'Monitor weekly weight trends if appropriate. Avoid drawing conclusions from one reading. Calorie targets require validated intake and health context; no automatic prescription is given here.'+(targeted?' If weight maintenance is the goal, assess whether adequate energy intake supports muscular recovery rather than adding more cardio.':''))+
 box('Muscle-building nutrition',targeted&&!cautious?'For a healthy exercising adult, approximately 1.4–2.0 g protein per kg body weight each day is a common evidence-based reference range; individualise for health conditions, dietary preferences and medical advice. Adequate total energy and recovery are essential.':'Nutrition priorities should reflect goals and medical considerations; do not assume a high-protein target is suitable for everyone.')+
 box('Pain-aware guidance',pain?'Discomfort during '+a.painActivity+' near '+a.painLocation.toLowerCase()+' could have different causes. Stop or modify painful movements; do not diagnose it from this form. '+referral:'No activity-related discomfort was reported. Stop and reassess any exercise that produces concerning symptoms.')+
 box('Professional referral',young?'For health or weight concerns in children and teens, seek caregiver-supported medical or dietitian advice.':clinicalGoal?'Discuss this goal with a relevant qualified clinician (GP, physiotherapist or women’s-health clinician) and use any individual care plan. '+referral:referral)+
 box('Daily follow-up','Record actual meals, activity, pain changes, sleep duration and fatigue. Reassess if health details or goals change. Missing data should remain unknown, not assumed normal.')+
 '</div><p class="note">Rule-based educational recommendations only — not generated by a medical model, not a prescription, no autonomous referrals. Reviewed clinical protocols and an audited AI model are required before production.</p></section>';
}
function readForm(f){
 const fields=new FormData(f),g=name=>String(fields.get(name)||'');
 const a={goal:g('goal'),age:Number(g('age')),height:Number(g('height')),weight:Number(g('weight')),activity:g('activity'),bed:g('bed'),wake:g('wake'),diet:g('diet'),experience:g('experience'),days:Number(g('days')),bodyAreas:fields.getAll('bodyAreas').map(String),trainingYears:Number(g('trainingYears')),minutes:Number(g('minutes')),flags:fields.getAll('flags').map(String),movement:fields.getAll('movement').map(String),painActivity:g('painActivity'),painLocation:g('painLocation'),painPattern:g('painPattern'),painDuration:g('painDuration'),redflags:fields.getAll('redflags').map(String),notes:g('notes')};
 if(!(a.age>=5&&a.age<=100&&a.height>=100&&a.height<=230&&a.weight>=25&&a.weight<=350&&a.days>=0&&a.days<=7&&a.trainingYears>=0&&a.trainingYears<=60&&a.minutes>=0&&a.minutes<=240))throw Error('Check the age, height, weight and activity-day values.');
 return a;
}
async function load(){
 if(!vaultKey){input=null;lastId=null;return}
 const id=r41active()?.id||'default';
 if(lastId===id)return;
 lastId=id;
 try{input=await livingEncryptedRead(KEY+':'+id)}catch{input=null}
}
menus.push(['assistant','✧','SEMITS Personal Guide']);
sections.assistant=()=>'<div class="r4-hero"><div><div class="r4-eyebrow">SEMITS HEALTH · R4.3 EXPERIMENTAL</div><h1>SEMITS Personal Guide</h1><p>First-time interview · coordinated plan · pain-aware screening · daily guidance</p></div></div>'+
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