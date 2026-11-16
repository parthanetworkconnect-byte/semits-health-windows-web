'use strict';
/* SEMITS R4.3 Annual food calendar.
 * A transparent 365-day four-meal sample generator for adults.
 * This is NOT 1,460 unique verified recipes or a clinical food prescription.
 * Existing country templates remain demo-only. Do not upload real medical data.
 */
(function(){
 const E=v=>r4esc(String(v??''));
 const FRUITS=[
  ['Apple 150 g',80],['Pear 150 g',85],['Mandarin 150 g',70],['Orange 160 g',75],
  ['Berries 120 g',60],['Banana 100 g',90],['Papaya 180 g',75],['Kiwi 140 g',85],
  ['Peach 150 g',65],['Plum 150 g',70],['Melon 180 g',65],['Grapes 100 g',75]
 ];
 const VEGETABLES=[
  'Leafy green salad 120 g','Steamed carrots 120 g','Tomato and cucumber 150 g',
  'Steamed broccoli 130 g','Roasted courgette 130 g','Green beans 150 g',
  'Mixed cabbage salad 130 g','Roasted peppers 130 g','Beetroot salad 120 g',
  'Spinach and tomato 140 g','Mixed seasonal vegetables 150 g','Steamed cauliflower 140 g'
 ];
 const BEVERAGES=[
  ['Water',0],['Unsweetened tea',0],['Black coffee',0],['Sparkling water',0],
  ['Unsweetened herbal tea',0],['Water with lemon',0]
 ];
 const EXTRAS=[
  'Sweets or dessert: optional, count the portion and verified nutrition separately.',
  'Smoothies: optional; include fruit, milk or yoghurt in the daily intake.',
  'Supper or late-night snack: only when appropriate for hunger and schedule; avoid treating it as required.',
  'Alcohol: never a required element. If consumed, record the actual amount; avoid it when contraindicated and remember alcohol raises health risks.',
  'Plain water, unsweetened tea and coffee may fit many plans; caffeine may affect sleep and individual medical conditions.'
 ];
 const idx=(day,prime,len,offset)=>(((day*prime+Math.floor(day/len)*offset)%len)+len)%len;
 function annualPlan(a){
  const base=SEMITS_CULTURAL_PLAN.plan(a);
  if(!base.adult||base.countryUnavailable)return [];
  // Each day has four eating occasions. The day-level mix is unique in the 365-day sample,
  // not an assertion that all individual recipes are unique.
  const result=[],seen=new Set();
  const pools=base.cuisinePool||null;
  for(let i=0;i<365;i++){
   let salt=0,b,l,s,d,fruit,veg,drink,key;
   do{
    b=pools?pools.breakfast[(i+salt)%pools.breakfast.length]:base.meals[(i+salt)%7].breakfast;
    l=pools?pools.lunch[(i+salt+4)%pools.lunch.length]:base.meals[(i+salt+4)%7].lunch;
    s=pools?pools.snack[(i+salt+8)%pools.snack.length]:base.meals[(i+salt+8)%7].snack;
    d=pools?pools.dinner[(i+salt+12)%pools.dinner.length]:base.meals[(i+salt+12)%7].dinner;
    fruit=FRUITS[(i+salt*3)%FRUITS.length];
    veg=VEGETABLES[(i*5+salt)%VEGETABLES.length];
    drink=BEVERAGES[(i+salt)%BEVERAGES.length];
    key=[b.name,l.name,s.name,d.name,fruit[0],veg,drink[0]].join(' | ');
    salt++;
    if(salt>5000)throw Error('Could not produce a distinct daily menu');
   }while(seen.has(key));
   seen.add(key);
   const day=i+1;
   // Calendar totals show original recipe demo energy only, fruit addition explicitly shown.
   const mealTotal=b.kcal+l.kcal+s.kcal+d.kcal;
   result.push({day,week:Math.floor(i/7)+1,
    meals:[
     {time:'07:30',title:'Breakfast',recipe:b},
     {time:'12:30',title:'Lunch',recipe:l},
     {time:'15:30',title:'Snack',recipe:s},
     {time:'18:30',title:'Dinner',recipe:d}
    ],fruit:{name:fruit[0],kcal:fruit[1]},
    vegetable:veg,drink:{name:drink[0],kcal:drink[1],volumeMl:/coffee/i.test(drink[0])?150:/tea/i.test(drink[0])?200:250},
    recipeKcal:mealTotal,exampleKcal:mealTotal+fruit[1],
    recipeProtein:b.protein+l.protein+s.protein+d.protein,
    // User must confirm this supplement: it is optional and not counted in demo totals.
    caloriesAreVerified:false,distinctKey:key});
  }
  return result;
 }
 function dayCard(d,profile){
  return '<article class="r43-year-day-card"><div class="r43-year-day-heading"><h3>Day '+d.day+' <small>· Week '+d.week+'</small></h3>'+
   '<strong>~'+d.exampleKcal+' kcal*</strong></div>'+
   '<div class="r43-cultural-meals">'+d.meals.map((x,i)=>
   '<div class="r43-cultural-meal"><span class="r43-meal-art">'+['☕','🥗','🍎','🍽️'][i]+'</span>'+
    '<small>'+E(x.time)+' · '+E(x.title)+'</small><strong>'+E(x.recipe.name)+'</strong>'+
    '<small>'+E(x.recipe.description)+'</small>'+
    '<small>Illustrative recipe estimate: ~'+x.recipe.kcal+' kcal / ~'+x.recipe.protein+' g protein</small></div>'
  ).join('')+'</div>'+
  '<div class="r43-year-complements"><p><strong>Fresh fruit:</strong> '+E(d.fruit.name)+' (~'+d.fruit.kcal+' kcal, demo estimate) — included in illustrative daily total.</p>'+
  '<p><strong>Vegetable accompaniment:</strong> '+E(d.vegetable)+' — optional; nutrients and energy depend on preparation, not included in daily total.</p>'+
  '<p><strong>Drink:</strong> '+E(d.drink.name)+' · '+d.drink.volumeMl+' mL (without added sugar, ~0 kcal). Water as desired.</p></div>'+
  '<p class="note">*Not a validated nutrient calculation. Daily total is the sum of unverified demo recipe calories plus the illustrative fruit value, excluding optional vegetables, sauces, oils and extras. Avoid using this total as a clinical calorie target.</p>'+
  (typeof SEMITS_NUTRIENT_WORKSHEET!=='undefined'?SEMITS_NUTRIENT_WORKSHEET.detail(d,profile):'')+'</article>';
 }
 function render(a){
  if(!a||Number(a.age)<18)return '';
  const p=SEMITS_CULTURAL_PLAN.plan(a);
  if(p.countryUnavailable)return '<section class="card r43-year-planner"><h2>365-day '+E(p.countryInfo.country)+' cuisine calendar — pending</h2><p>The country is selectable, but its recipe library has not been populated. SEMITS will not substitute unrelated country foods and label them as '+E(p.countryInfo.country)+' cuisine. Select a supported pilot country or Universal / Worldwide Foods for a demo plan.</p></section>';
  const days=annualPlan(a);
  const lower=p.flags.length>0||p.caution;
  return '<section class="card r43-year-planner" id="r43-year-planner">'+
  '<div class="r4-eyebrow">SEMITS · 365-DAY MEAL CALENDAR · DEVELOPMENT DEMO</div>'+
  '<h2>365-day individual menu calendar</h2>'+
  '<p class="note">Universal / Worldwide Foods allows meals from different available cuisines on the same day. Choose it in the Personal Guide questionnaire, then generate a new plan. Nutritional calculations are only complete when recipe ingredient weights and reference values have been supplied and verified.</p>'+
  '<p>Four planned eating occasions per day. Menus vary using the chosen cultural or universal recipe pool plus fruit, vegetable and drink choices. A day-level combination is distinct; this is not a database of 1,460 unique recipes.</p>'+
  (lower?'<p class="r43-alert">Medical or pain flags selected: do not treat example menus or calories as approved restrictions. Obtain appropriate clinical review.</p>':'')+
  '<div class="r43-year-toolbar"><label for="r43-year-day">View day</label>'+
  '<select id="r43-year-day" aria-label="Choose one of 365 meal days">'+days.map(d=>'<option value="'+d.day+'">Day '+d.day+' · Week '+d.week+'</option>').join('')+'</select>'+
  '<button class="btn outline" type="button" id="r43-year-prev">Previous</button>'+
  '<button class="btn outline" type="button" id="r43-year-next">Next</button></div>'+
  '<div id="r43-year-day-content">'+dayCard(days[0],a)+'</div>'+
  '<details class="r43-year-overview"><summary>View year overview (52 weeks + 1 day)</summary>'+
  '<p>Choose a day to view all four meals and approximate portion details.</p>'+
  '<div class="r43-year-grid">'+days.map(d=>'<button type="button" data-r43-year="'+d.day+'" class="r43-year-tile" aria-label="View Day '+d.day+'">'+d.day+'</button>').join('')+'</div></details>'+
  '<details><summary>Optional drinks, desserts, supper and alcohol</summary><ul>'+EXTRAS.map(x=>'<li>'+E(x)+'</li>').join('')+'</ul></details>'+
  '<p class="note">Universal / Worldwide Foods now mixes French, Indian, Chinese and Malaysian demonstration recipes (where diet choices allow). This is not complete worldwide coverage. All-country recipe coverage and verified food photography are not implemented. Weight, age, diet and medical history require review; meal totals are unverified.</p>'+
  '</section>';
 }
 const previous=SEMITS_CULTURAL_PLAN.render;
 SEMITS_CULTURAL_PLAN.annualPlan=annualPlan;
 SEMITS_CULTURAL_PLAN.render=function(a){return previous(a)+render(a)};
 document.addEventListener('click',ev=>{
  const btn=ev.target.closest?.('#r43-year-prev,#r43-year-next,[data-r43-year]');
  if(!btn)return;
  const chooser=document.querySelector('#r43-year-day');
  if(!chooser)return;
  const current=Number(chooser.value)||1;
  const next=btn.dataset?.r43Year?Number(btn.dataset.r43Year):
   btn.id==='r43-year-prev'?Math.max(1,current-1):Math.min(365,current+1);
  chooser.value=String(next);
  const form=document.querySelector('#r43-form');
  if(!form)return;
  // Read the currently shown saved questionnaire only; do not trigger a new save.
  const raw=new FormData(form),data={};
  for(const [k,v] of raw.entries())if(!['flags','redflags','movement','bodyAreas'].includes(k))data[k]=v;
  data.age=Number(data.age);data.height=Number(data.height);data.weight=Number(data.weight);
  data.targetWeight=Number(data.targetWeight);data.targetMonths=Number(data.targetMonths);
  data.flags=raw.getAll('flags');data.redflags=raw.getAll('redflags');
  const days=annualPlan(data);if(days[next-1])document.querySelector('#r43-year-day-content').innerHTML=dayCard(days[next-1],data);
 });
 document.addEventListener('change',ev=>{
  if(ev.target?.id!=='r43-year-day')return;
  const current=Number(ev.target.value)||1,form=document.querySelector('#r43-form');
  if(!form)return;
  const raw=new FormData(form),data={};
  for(const [k,v] of raw.entries())if(!['flags','redflags','movement','bodyAreas'].includes(k))data[k]=v;
  data.age=Number(data.age);data.height=Number(data.height);data.weight=Number(data.weight);
  data.targetWeight=Number(data.targetWeight);data.targetMonths=Number(data.targetMonths);
  data.flags=raw.getAll('flags');data.redflags=raw.getAll('redflags');
  const day=annualPlan(data)[current-1];
  if(day)document.querySelector('#r43-year-day-content').innerHTML=dayCard(day,data);
 });
})();