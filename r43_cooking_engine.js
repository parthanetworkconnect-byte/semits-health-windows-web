'use strict';
/* SEMITS R4.3 Cooked Recipe Lab.
 * Transparent arithmetic for explicit sourced ingredient data, optional added oil,
 * final cooked yield and plated serving amount.
 * Cooking can change micronutrients and water mass; NO unverified retention
 * factors are automatically applied. Clinical validation NOT provided.
 */
var SEMITS_COOKING_ENGINE=(function(){
 const E=v=>r4esc(String(v??''));
 const valid=(n,lo,hi)=>n!==null&&n!==undefined&&String(n).trim()!==''&&Number.isFinite(Number(n))&&Number(n)>=lo&&Number(n)<=hi?Number(n):null;
 function computeRecipe(input){
  const items=Array.isArray(input?.ingredients)?input.ingredients:[];
  if(!items.length)return {complete:false,reason:'No ingredients recorded'};
  const sum={kcal:0,protein:0,carbs:0,fat:0},missing=[];
  let macroComplete=true;
  for(let i=0;i<items.length;i++){
   const it=items[i],g=valid(it.grams,0,100000),k=valid(it.kcal100,0,2000);
   if(g===null||k===null||!String(it.source||'').trim()){missing.push('Ingredient '+(i+1)+' needs confirmed grams, kcal per 100 g, and source');continue}
   sum.kcal+=g*k/100;
   for(const x of ['protein','carbs','fat']){
    const v=valid(it[x+'100'],0,100);
    if(v===null)macroComplete=false;else sum[x]+=g*v/100;
   }
  }
  if(missing.length)return {complete:false,reason:missing.join('; '),missing};
  const oilGrams=valid(input.oilGrams,0,1000);
  if(oilGrams===null)return {complete:false,reason:'Confirm added cooking oil in grams, including 0 if none'};
  if(oilGrams>0){
   const oilRate=valid(input.oilKcal100,0,1000);
   if(oilRate===null||!String(input.oilSource||'').trim())return {complete:false,reason:'Added oil requires sourced kcal per 100 g; do not assume all oil was absorbed'};
   sum.kcal+=oilGrams*oilRate/100;
   // The added oil is not used to infer detailed fatty-acid types.
   const fat100=valid(input.oilFat100,0,100);
   if(fat100===null)macroComplete=false;else sum.fat+=oilGrams*fat100/100;
  }
  const cooked=valid(input.cookedBatchGrams,1,100000),served=valid(input.servedGrams,0,100000);
  if(cooked===null||served===null||served>cooked)return {complete:false,reason:'Enter measured final cooked batch weight and plated weight (not greater than batch)'};
  const factor=served/cooked;
  return {complete:true,batchKcal:sum.kcal,batchMacro:macroComplete?{protein:sum.protein,carbs:sum.carbs,fat:sum.fat}:null,
   platedKcal:sum.kcal*factor,per100gKcal:sum.kcal*100/cooked,platedMacros:macroComplete?{protein:sum.protein*factor,carbs:sum.carbs*factor,fat:sum.fat*factor}:null,
   cookedBatchGrams:cooked,servedGrams:served,servedFraction:factor,
   note:'Estimate assumes all measured ingredient energy remains in the cooked batch and the plated portion has the same composition as the entire batch. Unmeasured discarded oil, cooking loss, drained liquid, bones and ingredient distribution will alter real values. No automatic nutrient-retention factor has been applied.'};
 }
 function controls(){
  return '<div class="r43-cook-lab" data-cook-lab><h4>Cooked recipe and plated serving calculator</h4>'+
   '<p class="note">Complete sourced ingredient values above. Confirm extra oil, final cooked batch mass and actual portion served. No default cooking losses or retention factors are invented.</p>'+
   '<div class="r43-grid">'+
   '<label>Added oil actually included (g; enter 0 if none)<input data-cook-oil type="number" min="0" max="1000" step=".1" placeholder="grams"></label>'+
   '<label>Oil energy (kcal per 100 g)<input data-cook-oil-kcal type="number" min="0" max="1000" step=".1" placeholder="required if oil > 0"></label>'+
   '<label>Oil fat (g per 100 g)<input data-cook-oil-fat type="number" min="0" max="100" step=".1" placeholder="optional"></label>'+
   '<label>Oil label / nutrient source<input data-cook-oil-source type="text" maxlength="80" placeholder="required if oil > 0"></label>'+
   '<label>Final cooked batch weight (g)<input data-cook-batch type="number" min="1" max="100000" step=".1" placeholder="measured after cooking"></label>'+
   '<label>Weight of portion served (g)<input data-cook-plate type="number" min="0" max="100000" step=".1" placeholder="measured on plate"></label>'+
   '<label>Cooking method<select data-cook-method><option>Unknown</option><option>Boiled / simmered</option><option>Steamed</option><option>Stir-fried</option><option>Baked</option><option>Grilled</option><option>Other</option></select></label>'+
   '</div><p class="r43-cook-result" role="status">Enter ingredient sources, oil and actual cooked/served weights to calculate a plate.</p>'+
   '<p class="note">Cooking yield (weight change) can change nutrients per 100 g but does not itself establish energy loss. For broth, drained liquid, discarded fats or bones, record the components actually eaten and use appropriate yield/retention data; ask a dietitian for condition-specific diets.</p></div>';
 }
 const value=(el,sel)=>el?.querySelector(sel)?.value;
 function gather(el){
  const rows=[...el.closest('.r43-nutrient-meal').querySelectorAll('[data-nutrient-row]')];
  return {ingredients:rows.map(row=>({
   grams:value(row,'[data-grams]'),kcal100:value(row,'[data-reference]'),
   protein100:value(row,'[data-protein]'),carbs100:value(row,'[data-carbs]'),fat100:value(row,'[data-fat]'),
   source:value(row,'[data-source]')
  })),oilGrams:value(el,'[data-cook-oil]'),oilKcal100:value(el,'[data-cook-oil-kcal]'),
   oilFat100:value(el,'[data-cook-oil-fat]'),oilSource:value(el,'[data-cook-oil-source]'),
   cookedBatchGrams:value(el,'[data-cook-batch]'),servedGrams:value(el,'[data-cook-plate]'),
   method:value(el,'[data-cook-method]')};
 }
 function update(lab){
  if(!lab)return;
  const result=computeRecipe(gather(lab)),out=lab.querySelector('.r43-cook-result');
  if(!out)return;
  if(!result.complete){out.textContent='Plate calculation incomplete: '+result.reason;return}
  const fmt=v=>Number(v).toFixed(1);
  out.textContent='Estimated cooked batch '+fmt(result.batchKcal)+' kcal · '+fmt(result.per100gKcal)+' kcal/100 g cooked · plated serving '+fmt(result.platedKcal)+' kcal'+
   (result.platedMacros?' · protein '+fmt(result.platedMacros.protein)+' g · carbs '+fmt(result.platedMacros.carbs)+' g · fat '+fmt(result.platedMacros.fat)+' g':' · complete macros unavailable')+'. '+result.note;
 }
 document.addEventListener('input',ev=>{
  const row=ev.target?.closest?.('[data-nutrient-row]'),lab=ev.target?.closest?.('[data-cook-lab]')||row?.closest?.('.r43-nutrient-meal')?.querySelector('[data-cook-lab]');
  if(lab)update(lab);
 });
 document.addEventListener('change',ev=>{const lab=ev.target?.closest?.('[data-cook-lab]');if(lab)update(lab)});
 return {computeRecipe,controls,update};
})();