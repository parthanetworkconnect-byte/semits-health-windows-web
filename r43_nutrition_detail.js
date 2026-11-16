'use strict';
/* SEMITS transparent ingredient worksheet: amounts must be confirmed by the user.
   Reference values intentionally blank until entered from a reliable food source.
   Formula: serving_kcal = weight_grams * reference_kcal_per_100g / 100.
   No clinical interpretation, no fabricated measurements or medical prescriptions. */
var SEMITS_NUTRIENT_WORKSHEET=(function(){
const E=v=>r4esc(String(v??''));
function splitIngredients(recipe){
 const parts=String(recipe.description||'').split(/\s*;\s*|\s*,\s*(?=[a-z])/i).map(x=>x.trim()).filter(Boolean);
 return parts.slice(0,12).map((text,i)=>{
  // Quantities can be g, kg, mL; other units need a manually measured mass.
  const m=text.match(/(?:^|\s)(\d+(?:\.\d+)?)\s*(kg|g|mL|ml)\b/i);
  let grams=m?Number(m[1])*(m[2].toLowerCase()==='kg'?1000:1):null;
  if(m&&m[2].toLowerCase()==='ml')grams=null; // Volume cannot be equated to grams without density.
  if(!(grams>0&&grams<=3000))grams=null;
  return {id:i,label:text,grams};
 });
}
function contextualBenefits(profile){
 const goal=String(profile?.goal||'maintenance');
 const flags=profile?.flags||[];
 let text=goal==='loss'?'Weight-management goal: assess portion energy, fibre and protein within the complete day; adjust only after verifying ingredients and actual intake.':
 goal==='muscle'||goal==='shape'?'Strength goal: assess whole-day protein and adequate energy alongside completed resistance training.':
 goal==='fitness'?'Endurance goal: carbohydrates and fluids may support activity; exact needs depend on intensity and timing.':
 goal==='gain'?'Weight-gain goal: ensure adequate overall energy and protein; appetite and tolerance should guide meal timing.':
 'Balanced-eating goal: consider variety, vegetables, fibre, protein and hydration across the entire day.';
 if(flags.length)text+=' Health flags have been selected: do not infer treatment suitability or adjust medication. Seek a dietitian or clinician for medically restricted diets.';
 if(Number(profile?.age)<18)text='For children and teens, avoid automatic adult calorie or weight-loss targets; seek age-appropriate guidance.';
 return text;
}
function detail(day,profile){
 const sections=day.meals.map((m,mi)=>{
  const ingredients=splitIngredients(m.recipe);
  return '<details class="r43-nutrient-meal"><summary>'+E(m.title)+' · '+E(m.recipe.name)+' · ingredient calculation</summary>'+
   '<p class="note">Recipe text is split into possible ingredients. Check actual cooked vs raw weight, cooking oil, sauces and serving sizes. mL is not automatically treated as grams.</p>'+
   '<table class="r43-nutrient-table"><thead><tr><th>Ingredient as described</th><th>Measured amount (g)</th><th>Energy per 100 g (kcal)</th><th>Source</th><th>Calculated kcal</th></tr></thead><tbody>'+
   ingredients.map((ingredient,j)=>'<tr data-nutrient-row><td>'+E(ingredient.label)+'</td>'+
    '<td><input aria-label="Grams for '+E(m.title)+' ingredient '+(j+1)+'" data-grams type="number" min="0" max="3000" step="0.1" value="'+(ingredient.grams==null?'':ingredient.grams)+'" placeholder="g"></td>'+
    '<td><input aria-label="Calories per 100 grams for '+E(m.title)+' ingredient '+(j+1)+'" data-reference type="number" min="0" max="1000" step="0.1" placeholder="enter value"></td>'+
    '<td><input aria-label="Nutrition source for '+E(m.title)+' ingredient '+(j+1)+'" data-source type="text" maxlength="80" placeholder="label/database"></td>'+
    '<td data-result>—</td></tr>').join('')+
   '</tbody></table><p class="r43-nutrient-subtotal" aria-live="polite">Awaiting verified ingredient values. No calculated total yet.</p></details>';
 }).join('');
 return '<details class="r43-nutrient-workbook"><summary>Ingredient quantities and nutrition calculations · '+day.meals.length+' meals</summary>'+
 '<p class="note">Each ingredient calculation uses measured grams × reference kcal per 100 g ÷ 100. The reference is intentionally blank: SEMITS does not have a validated database match for every recipe. Enter values from a trusted food label or a verified database. Unknown ingredients remain uncalculated, rather than being counted as zero.</p>'+
 sections+'<p class="r43-nutrient-total" aria-live="polite">No complete verified meal totals yet.</p>'+
 '<p class="note">Detailed protein, carbohydrates, fats, fibre, sodium and micronutrients require individual matching per ingredient. Earlier demonstration recipe estimates are not verified.</p></details>'+
 '<div class="r43-day-benefits"><h4>How this day relates to the personal goal</h4><p>'+E(contextualBenefits(profile))+'</p></div>';
}
function recompute(wrapper){
 if(!wrapper)return;
 let grand=0,allComplete=true,completeMeals=0;
 for(const meal of wrapper.querySelectorAll('.r43-nutrient-meal')){
  let subtotal=0,complete=true,count=0;
  for(const row of meal.querySelectorAll('[data-nutrient-row]')){
   const amount=row.querySelector('[data-grams]')?.value?.trim()||'';
   const rate=row.querySelector('[data-reference]')?.value?.trim()||'';
   const source=row.querySelector('[data-source]')?.value?.trim()||'';
   const g=Number(amount),k=Number(rate);
   const ok=amount!==''&&rate!==''&&source!==''&&Number.isFinite(g)&&Number.isFinite(k)&&g>=0&&g<=3000&&k>=0&&k<=1000;
   row.querySelector('[data-result]').textContent=ok?(g*k/100).toFixed(1):'—';
   if(ok){subtotal+=g*k/100;count++}else complete=false;
  }
  const out=meal.querySelector('.r43-nutrient-subtotal');
  out.textContent=complete&&count?'Calculated ingredient total: '+subtotal.toFixed(1)+' kcal (provided quantities/references; omissions still possible).':
  count?'Partial reference sum: '+subtotal.toFixed(1)+' kcal, with unknown ingredients. Not a complete meal total.':
  'Enter ingredient weights, per-100g energy and sources to calculate.';
  if(complete&&count){grand+=subtotal;completeMeals++}else allComplete=false;
 }
 const total=wrapper.querySelector('.r43-nutrient-total');
 if(total)total.textContent=allComplete&&completeMeals===4?'Calculated four-meal ingredient sum: '+grand.toFixed(1)+' kcal, subject to recipe completeness and label quality.':
 'Full-day calculated energy unavailable: '+completeMeals+' of 4 meals have complete source-filled ingredient rows. Unknown amounts are not treated as zero.';
}
document.addEventListener('input',ev=>{
 if(!ev.target?.matches?.('[data-grams],[data-reference],[data-source]'))return;
 recompute(ev.target.closest('.r43-nutrient-workbook'));
});
return {detail,splitIngredients,recompute,contextualBenefits};
})();