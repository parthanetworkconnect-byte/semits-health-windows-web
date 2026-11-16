'use strict';
/* SEMITS R4.3 culturally adapted educational weekly plan. Synthetic demo only.
 * Transparent calculation; example meals not professionally calibrated recipes.
 * Cultural background is a preference, NEVER a biological characteristic.
 */
var SEMITS_CULTURAL_PLAN=(function(){
 const E=v=>r4esc(String(v??''));
 const recipe=(name,description,kcal,protein)=>({name,description,kcal,protein});
 const catalog={
 French:{
  breakfast:[
   recipe('Pain complet + fromage blanc + berries','Wholegrain bread 65 g; fromage blanc 150 g; berries 100 g; unsweetened coffee or tea.',365,19),
   recipe('Porridge + pear + yoghurt','Oats 50 g dry; plain yoghurt 150 g; pear 120 g; cinnamon.',390,18),
   recipe('Tartine + egg + orange','Wholegrain tartine 70 g; boiled egg 1; orange 130 g; black coffee or tea.',360,17),
   recipe('Fromage blanc + oats + apple','Plain fromage blanc 180 g; oats 45 g; apple 140 g.',375,21),
   recipe('Wholemeal toast + ricotta + fruit','Wholegrain bread 70 g; ricotta 70 g; seasonal fruit 130 g.',385,17),
   recipe('Omelette + rye toast','Two eggs; mushrooms 100 g; rye bread 60 g; coffee or tea.',405,25),
   recipe('Yoghurt + walnuts + banana','Plain yoghurt 200 g; walnuts 15 g; banana 100 g; oats 25 g.',420,18)
  ],
  lunch:[
   recipe('Salade niçoise-style bowl','Tuna 100 g; potato 150 g; green beans 120 g; tomato 100 g; 1 egg; olive oil 10 g.',590,37),
   recipe('Lentil and vegetable soupe + bread','Cooked lentils 180 g; mixed vegetables 250 g; wholegrain baguette 80 g; olive oil 8 g.',580,27),
   recipe('Poulet rôti + ratatouille','Roast chicken breast 140 g; ratatouille 250 g; cooked brown rice 130 g.',610,48),
   recipe('Quiche-style vegetable portion + salad','Vegetable quiche 180 g; green salad 200 g; vinaigrette 10 g; fruit 100 g.',620,24),
   recipe('Provençal fish + potatoes','Cooked white fish 160 g; potato 220 g; steamed green beans 180 g; olive oil 12 g.',570,38),
   recipe('Chickpea salad with herbs and bread','Cooked chickpeas 180 g; tomato and cucumber 180 g; wholegrain bread 75 g; olive oil 10 g.',625,23),
   recipe('Turkey + haricots verts + couscous','Turkey 140 g; green beans 180 g; cooked wholegrain couscous 170 g; olive oil 10 g.',610,44)
  ],
  dinner:[
   recipe('Ratatouille + baked fish + rice','Ratatouille 250 g; fish 150 g; cooked rice 130 g; olive oil 8 g.',560,39),
   recipe('Vegetable potage + omelette','Vegetable potage 350 mL; two-egg omelette; wholegrain bread 70 g; small salad.',545,28),
   recipe('Coq-au-vin-style chicken (lighter)','Lean cooked chicken 140 g; mushrooms 120 g; potato 180 g; green vegetables 200 g; light sauce, alcohol optional.',600,43),
   recipe('Baked salmon + asparagus + lentils','Cooked salmon 130 g; asparagus 180 g; cooked lentils 130 g.',620,43),
   recipe('Herbed turkey + courgette + barley','Turkey 140 g; courgette 220 g; cooked barley 160 g; olive oil 8 g.',575,42),
   recipe('Mediterranean vegetable and bean stew','White beans 190 g; tomatoes and vegetables 250 g; wholegrain bread 75 g; olive oil 9 g.',585,24),
   recipe('Grilled chicken + winter vegetables','Chicken breast 140 g; roasted carrots/parsnips 230 g; potatoes 160 g; olive oil 10 g.',590,46)
  ],
  snack:[
   recipe('Apple + almonds','Apple 150 g; unsalted almonds 20 g.',195,5),
   recipe('Plain yoghurt + strawberries','Plain yoghurt 170 g; strawberries 130 g.',155,10),
   recipe('Pear + walnuts','Pear 150 g; walnuts 18 g.',205,4),
   recipe('Fromage blanc + berries','Fromage blanc 160 g; blueberries 90 g.',175,15),
   recipe('Orange + pumpkin seeds','Orange 150 g; pumpkin seeds 20 g.',190,7),
   recipe('Carrot + hummus','Carrot 150 g; hummus 60 g.',200,6),
   recipe('Banana + yoghurt','Banana 100 g; plain yoghurt 125 g.',190,8)
  ]
 },
 Indian:{
  breakfast:[recipe('Idli and sambar','Idli 3 medium; sambar 200 mL; unsweetened tea.',380,13),recipe('Vegetable upma','Upma 220 g; plain yoghurt 120 g.',420,14),recipe('Dosa with sambar','Dosa 2 small; sambar 250 mL.',420,14)],
  lunch:[recipe('Dal, rice and sabzi','Cooked rice 170 g; dal 210 g; vegetables 180 g.',620,23),recipe('Chapati, chana and salad','Chapati 2 medium; chana 210 g; salad 150 g.',650,24),recipe('Chicken curry and rice','Chicken curry 220 g; cooked rice 160 g; vegetables 150 g.',660,37)],
  dinner:[recipe('Roti and mixed vegetable dal','Roti 2; cooked dal 200 g; vegetable stir fry 170 g.',570,22),recipe('Fish curry and brown rice','Fish curry 220 g; cooked brown rice 150 g; salad 130 g.',610,34),recipe('Vegetable khichdi + curd','Khichdi 320 g; plain curd 130 g; cucumber salad 100 g.',560,21)],
  snack:[recipe('Fruit and roasted chana','Fruit 150 g; roasted chana 35 g.',210,8),recipe('Plain lassi and nuts','Unsweetened lassi 180 mL; nuts 18 g.',220,10),recipe('Guava + yoghurt','Guava 180 g; yoghurt 125 g.',200,10)]
 },
 Chinese:{
  breakfast:[recipe('Congee, egg and greens','Rice congee 300 g; egg 1; cooked greens 100 g.',360,15),recipe('Soy milk + wholegrain bun','Unsweetened soy milk 250 mL; wholegrain bun 90 g.',390,17),recipe('Oats and tofu scramble','Oats 50 g; tofu 120 g; vegetables 100 g.',420,25)],
  lunch:[recipe('Steamed fish, rice and greens','Fish 150 g; cooked rice 170 g; bok choy 200 g.',590,39),recipe('Chicken vegetable noodle bowl','Noodles cooked 180 g; chicken 140 g; vegetables 220 g; moderate sauce.',640,41),recipe('Tofu mushroom stir-fry with rice','Firm tofu 180 g; mushrooms/greens 240 g; cooked rice 170 g.',610,27)],
  dinner:[recipe('Ginger fish + steamed vegetables','Fish 160 g; greens 220 g; cooked rice 150 g.',555,40),recipe('Chicken and vegetable soup noodles','Chicken 140 g; noodle soup 350 g; vegetables 200 g.',590,38),recipe('Tofu, broccoli and brown rice','Tofu 200 g; broccoli 220 g; cooked brown rice 160 g.',610,27)],
  snack:[recipe('Mandarin and nuts','Mandarin 180 g; almonds 20 g.',190,5),recipe('Plain soy yoghurt + fruit','Soy yoghurt 170 g; berries 120 g.',185,10),recipe('Pear and roasted seeds','Pear 160 g; seeds 20 g.',210,6)]
 },
 Malaysian:{
  breakfast:[recipe('Lightened nasi lemak-style plate','Rice 140 g; boiled egg 1; cucumber 120 g; sambal 30 g; peanuts 15 g.',460,14),recipe('Wholegrain toast + eggs','Wholegrain toast 70 g; eggs 2; unsweetened kopi.',400,23),recipe('Rice porridge with chicken','Rice porridge 300 g; chicken 100 g; greens 100 g.',410,28)],
  lunch:[recipe('Chicken rice with cucumber','Poached chicken 150 g; rice 170 g; cucumber 150 g; sauce measured.',640,40),recipe('Laksa-style noodle soup','Rice noodles 150 g cooked; tofu 100 g; vegetables 200 g; moderate coconut broth.',650,25),recipe('Grilled fish, rice and ulam','Fish 150 g; rice 160 g; ulam salad 180 g.',600,38)],
  dinner:[recipe('Vegetable stir-fry and rice','Tofu 170 g; mixed greens 250 g; rice 170 g; cooking oil measured.',590,25),recipe('Turmeric chicken + greens','Chicken 150 g; cooked rice 150 g; greens 200 g.',620,43),recipe('Fish soup + rice','Fish soup 350 mL; rice 170 g; steamed vegetables 180 g.',570,34)],
  snack:[recipe('Papaya and yoghurt','Papaya 180 g; plain yoghurt 150 g.',185,9),recipe('Guava and seeds','Guava 160 g; seeds 20 g.',195,7),recipe('Banana and unsweetened soy milk','Banana 100 g; soy milk 200 mL.',200,9)]
 }
 };
 catalog['General / mixed']={
 breakfast:[catalog.French.breakfast[0],catalog.Indian.breakfast[0],catalog.Chinese.breakfast[0],catalog.Malaysian.breakfast[1]],
 lunch:[catalog.Chinese.lunch[0],catalog.French.lunch[1],catalog.Indian.lunch[0],catalog.Malaysian.lunch[0]],
 dinner:[catalog.French.dinner[0],catalog.Chinese.dinner[1],catalog.Malaysian.dinner[2],catalog.Indian.dinner[0]],
 snack:[catalog.French.snack[0],catalog.Malaysian.snack[0],catalog.Chinese.snack[0],catalog.Indian.snack[0]]
 };
 const vegetarianMeals={
 breakfast:[recipe('Fruit, oats and yoghurt','Oats 50 g; yoghurt 170 g; fruit 120 g.',390,19),recipe('Vegetable toast + egg','Wholegrain toast 70 g; egg 2; vegetables 120 g.',410,23)],
 lunch:[recipe('Lentil, vegetable and rice bowl','Cooked lentils 190 g; vegetables 200 g; cooked rice 150 g; olive oil 8 g.',615,24),recipe('Chickpea and wholegrain salad','Cooked chickpeas 190 g; seasonal vegetables 230 g; wholegrain bread 75 g.',620,22)],
 dinner:[recipe('Bean and vegetable stew','Beans 200 g; cooked barley 160 g; vegetables 200 g.',580,24),recipe('Tofu, broccoli and rice','Tofu 190 g; broccoli 230 g; cooked rice 160 g.',600,28)],
 snack:[recipe('Yoghurt and berries','Plain yoghurt 170 g; berries 130 g.',170,11),recipe('Fruit and nuts','Seasonal fruit 170 g; mixed unsalted nuts 20 g.',200,5)]
 };
 const veganMeals={
 breakfast:[recipe('Oats with fortified soy milk','Oats 55 g; fortified soy milk 250 mL; fruit 130 g.',405,19),recipe('Tofu scramble and toast','Firm tofu 150 g; vegetables 120 g; wholegrain bread 70 g.',420,25)],
 lunch:[recipe('Lentil rice and vegetable bowl','Cooked lentils 190 g; cooked rice 150 g; vegetables 220 g.',620,24),recipe('Chickpea salad and wholegrain bread','Cooked chickpeas 200 g; wholegrain bread 70 g; mixed vegetables 230 g.',635,24)],
 dinner:[recipe('Tofu stir-fry with brown rice','Firm tofu 200 g; cooked brown rice 150 g; vegetables 230 g.',610,30),recipe('White bean and vegetable stew','Cooked white beans 210 g; vegetables 260 g; cooked quinoa 150 g.',625,27)],
 snack:[recipe('Fruit and nuts','Seasonal fruit 160 g; nuts 20 g.',200,5),recipe('Soy yoghurt and berries','Fortified unsweetened soy yoghurt 180 g; berries 120 g.',180,10)]
 };
 const activity=[
 ['Monday','Brisk walking','30 min, comfortable talk-test pace; break after prolonged sitting'],
 ['Tuesday','Resistance training','25 min: supported squat-to-chair, wall push-ups, light rows; 1–2 comfortable sets'],
 ['Wednesday','Swimming or cycling','30 min easy to moderate; walking alternative'],
 ['Thursday','Walking + mobility','30 min walk; 10 min gentle joint mobility'],
 ['Friday','Resistance training','25 min: sit-to-stand, bands/rows, light carries; 1–2 sets, technique first'],
 ['Saturday','Longer enjoyable activity','35–45 min brisk walk, gardening or easy cycle'],
 ['Sunday','Recovery and recreation','20–30 min easy walking and stretching; adjust if tired']
 ];
 const countries={French:'France',Indian:'India',Chinese:'China',Malaysian:'Malaysia'};
 const safeRound=n=>Math.round(n);
 function plan(a){
  const age=Number(a.age),cm=Number(a.height),kg=Number(a.weight),target=Number(a.targetWeight),months=Number(a.targetMonths)||6;
  const bmi=kg/(cm/100)**2,goalBMI=target/(cm/100)**2;
  const adult=age>=18,sex=a.sex||'Not supplied',hasTarget=target>0&&target!==kg;
  const rate=hasTarget?(kg-target)/(months*4.345):0;
  const bmr=sex==='Male'?10*kg+6.25*cm-5*age+5:sex==='Female'?10*kg+6.25*cm-5*age-161:null;
  const factor={'Mostly sitting':1.2,'Lightly active':1.375,'Moderately active':1.55,'Very active':1.725}[a.activity]||1.2;
  const tdee=bmr?bmr*factor:null;
  const adjustment=hasTarget?Math.min(500,Math.abs(kg-target)*7700/(months*30.44)):0;
  const preliminary=tdee&&adult&&hasTarget?(kg>target?tdee-adjustment:tdee+adjustment):null;
  const diet=String(a.diet||'');const culture=diet==='Vegan'?veganMeals:diet==='Vegetarian'?vegetarianMeals:catalog[a.culture]||catalog['General / mixed'];
  const meals=Array.from({length:7},(_,i)=>{const bp=culture.breakfast[i%culture.breakfast.length],lu=culture.lunch[i%culture.lunch.length],di=culture.dinner[i%culture.dinner.length],sn=culture.snack[i%culture.snack.length];return {day:['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'][i],breakfast:bp,lunch:lu,dinner:di,snack:sn,total:bp.kcal+lu.kcal+di.kcal+sn.kcal,protein:bp.protein+lu.protein+di.protein+sn.protein}});
  const flags=[...(a.flags||[]),...(a.redflags||[])];const caution=flags.length||a.goal==='rehab'||a.goal==='condition'||a.painPattern==='Recurring / worsening'||a.painPattern==='Severe / sudden';
  return {age,cm,kg,target,months,bmi,goalBMI,rate,bmr,tdee,preliminary,meals,caution,flags,hasTarget,adult,sex,activity};
 }
 const box=(name,txt)=>'<div class="r43-cultural-metric"><small>'+E(name)+'</small><strong>'+E(txt)+'</strong></div>';
 const item=r=>'<strong>'+E(r.name)+'</strong><small>'+E(r.description)+'</small><small>Demo recipe estimate: ~'+r.kcal+' kcal · ~'+r.protein+' g protein</small>';
 function render(a){
  if(!a?.age||!a?.height||!a?.weight)return '';
  const p=plan(a),culture=a.culture||'French';if(!p.adult)return '<section class="card"><h2>Seven-day plan</h2><p>Adult BMI, energy and weight-loss plans are not generated for minors. Seek age-appropriate professional advice.</p></section>';
  const verified=!!p.bmr;
  const metrics=box('BMI now',p.bmi.toFixed(1)+' kg/m²')+box('Goal BMI',p.hasTarget?p.goalBMI.toFixed(1)+' kg/m²':'Set a target')+
   box('Planned change',p.hasTarget?(p.kg-p.target).toFixed(1)+' kg in '+p.months+' months':'Set a target')+
   box('Average weekly change',p.hasTarget?p.rate.toFixed(2)+' kg/week':'Not set')+
   box('Estimated resting energy',verified?safeRound(p.bmr)+' kcal/day':'Sex input needed')+
   box('Estimated daily energy use',verified?safeRound(p.tdee)+' kcal/day':'Sex input needed');
  const dietNotice=a.diet==='Vegan'||a.diet==='Vegetarian'?'<p class="note">Your selected '+E(a.diet)+' diet uses illustrative plant-based menu substitutions. These are not guaranteed to match your chosen cuisine. Vegan diets may need attention to vitamin B12 and other nutrients; review with a qualified dietitian where appropriate.</p>':'';
  const warning=p.flags.length?'<p class="r43-alert">Selected medical or symptom flags require professional review before any personal energy restriction or training progression. This draft plan is educational only.</p>':'';
  const context='<p class="note">Cultural background selects menu traditions, not genetic or health assumptions. French, Indian, Chinese and Malaysian cuisines vary considerably by region, religion, family and historical period. A person born 55 years ago did not necessarily eat a standard national diet. Ask about childhood region, current location, religious rules, allergies and personally enjoyed foods.</p>';
  const energy='<p class="note">Calculation uses adult BMI (screening only), Mifflin–St Jeor resting energy equation where sex is provided, and an activity multiplier as a rough estimate. '+(p.preliminary?'Illustrative energy-budget calculation for your target: ~'+safeRound(p.preliminary)+' kcal/day. The sample menus below are NOT scaled to this number and must not be treated as a prescribed calorie budget.':'No automatic energy target without sex and measured activity.')+' Recipe energy/macronutrients below are illustrative synthetic placeholders, NOT verified food-composition data or measured quantities; do not use for clinical calorie tracking.</p>';
  const days=p.meals.map((d,i)=>'<details class="r43-cultural-day"'+(i===0?' open':'')+'><summary><span>'+E(d.day)+' · '+E(culture)+' meal suggestions</span><span>Example total ~'+d.total+' kcal</span></summary>'+
   '<div class="r43-cultural-meals">'+
   '<div class="r43-cultural-meal"><span class="r43-meal-art">☕</span><small>07:30 · Breakfast</small>'+item(d.breakfast)+'</div>'+
   '<div class="r43-cultural-meal"><span class="r43-meal-art">🥗</span><small>12:30 · Lunch</small>'+item(d.lunch)+'</div>'+
   '<div class="r43-cultural-meal"><span class="r43-meal-art">🍎</span><small>15:30 · Snack</small>'+item(d.snack)+'</div>'+
   '<div class="r43-cultural-meal"><span class="r43-meal-art">🍽️</span><small>18:30 · Dinner</small>'+item(d.dinner)+'</div></div>'+
   '<p><strong>Activity:</strong> '+E(p.activity[i][1])+' — '+E(p.activity[i][2])+'</p></details>').join('');
  const prompt='<p class="note">Recipe illustrations are icons, not photographs. Actual cultural food photos require licensed image assets and verified recipe data. Drink plain water regularly, use coffee or tea according to preference and health considerations; do not assume alcohol is beneficial. Bedtime/wake target: '+E(a.bed||'22:00')+' to '+E(a.wake||'06:00')+'. Protect 7–9 hours of sleep opportunity where possible.</p>';
  const compare='<div class="r43-cultural-comparison"><h3>Healthy ageing comparison — what can and cannot be concluded</h3><p>Compare habits with population guidance rather than imagining a disease-free typical person. Adults differ in medication use, fitness, income, environment and genetics. A person without a diagnosed disease is not automatically healthier in every respect.</p><p>The oldest fully verified human lifespan is 122 years and 164 days. No verified 130-year-old provides a scientifically valid personal diet or activity protocol. Long-lived individuals are not controlled evidence that a specific food causes longevity.</p><p>Public guidance: movement most days, about 150–300 minutes moderate activity each week when appropriate, strengthening on two days, varied vegetables, fruit, legumes and whole grains. Increase gradually based on starting ability and medical context.</p></div>';
  return '<section class="card r43-cultural-plan"><div class="r43-cultural-head"><div><div class="r4-eyebrow">SEMITS CULTURAL WEEKLY PLAN · DEMONSTRATION</div><h2>Seven-day '+E(culture)+'-influenced food & activity plan</h2><p>Menus based on food preferences, not cultural stereotypes.</p></div></div>'+
   '<div class="r43-cultural-metrics">'+metrics+'</div>'+warning+dietNotice+context+energy+
   '<h3>Seven different daily routines</h3>'+days+prompt+compare+
   '<p class="note">This is an educational generated example, not a validated AI diet prescription. Cultural recipes, nutrition data, allergies, country-specific food availability and clinical restrictions need verified sources and individual confirmation. Recheck actual intake, weight trends, tolerance and professional advice before adjustments.</p></section>';
 }
 return {render,plan,catalog};
})();