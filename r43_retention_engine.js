'use strict';
/* SEMITS R4.3 explicit nutrient-retention calculation.
 * The USDA Release 6 tables contain nutrient- and method-dependent factors;
 * NO coefficients are bundled here: user must transcribe verified values
 * including table/version, food group and preparation method. This prevents
 * applying guessed percentages to unrelated foods.
 */
var SEMITS_RETENTION_ENGINE=(function(){
 const valid=(x,min,max)=>x!==''&&x!==null&&x!==undefined&&Number.isFinite(Number(x))&&Number(x)>=min&&Number(x)<=max?Number(x):null;
 function apply(input){
  const amount=valid(input?.rawNutrientAmount,0,100000),retained=valid(input?.retentionPercent,0,100),
        source=String(input?.reference||'').trim(),nutrient=String(input?.nutrient||'').trim(),
        method=String(input?.method||'').trim(),foodGroup=String(input?.foodGroup||'').trim();
  if(amount===null||retained===null||!source||!nutrient||!method||!foodGroup)
   return {complete:false,reason:'Enter a nutrient amount, 0–100% retention factor, food group, cooking method and exact table/source reference.'};
  if(source.length>500)return {complete:false,reason:'Source reference too long.'};
  return {complete:true,raw:amount,retentionPercent:retained,cookedAmount:amount*retained/100,
   nutrient,foodGroup,method,reference:source,
   note:'Estimate assumes the entered source factor applies to this specific food group, cooking method and nutrient. Confirm edible basis, cooked weight, and method scope; do not apply one factor to all nutrients or calories.'};
 }
 function controls(){
  return '<details class="r43-retention-lab" data-retention-lab><summary>Optional nutrient retention — source-specific cooking factor</summary>'+
  '<p class="note">For a specific nutrient (for example vitamin C), use the relevant table value for the FOOD GROUP and COOKING METHOD. USDA Release 6 is a possible reference. This tool does not automatically choose a factor, and it does not alter the cooked plate calories.</p>'+
  '<div class="r43-grid">'+
  '<label>Nutrient name<input data-ret-nutrient type="text" maxlength="80" placeholder="e.g., Vitamin C"></label>'+
  '<label>Food group <input data-ret-food type="text" maxlength="100" placeholder="e.g., food group as named in table"></label>'+
  '<label>Cooking method <input data-ret-method type="text" maxlength="100" placeholder="exact table method"></label>'+
  '<label>Raw nutrient amount (unit stays unchanged) <input data-ret-raw type="number" min="0" max="100000" step="any" placeholder="e.g. 40 mg"></label>'+
  '<label>Retention factor (%) <input data-ret-factor type="number" min="0" max="100" step="any" placeholder="from selected table"></label>'+
  '<label>Exact source/table/version <input data-ret-source type="text" maxlength="500" placeholder="USDA Release 6, table/row reference"></label></div>'+
  '<p class="r43-retention-result" role="status">No retention calculation yet: source and method must be entered.</p>'+
  '<p class="note">Some official retention data use special treatment of cooking liquid and refuse. Check method applicability rather than guessing an average. These are approximate nutrient values, not validated biological outcomes.</p></details>';
 }
 function update(el){
  const v=selector=>el?.querySelector(selector)?.value;
  const result=apply({nutrient:v('[data-ret-nutrient]'),foodGroup:v('[data-ret-food]'),method:v('[data-ret-method]'),rawNutrientAmount:v('[data-ret-raw]'),retentionPercent:v('[data-ret-factor]'),reference:v('[data-ret-source]')});
  const out=el?.querySelector('.r43-retention-result');if(!out)return;
  out.textContent=result.complete?result.nutrient+': '+result.raw+' × '+result.retentionPercent+'% = '+result.cookedAmount.toFixed(2)+' (same nutrient unit as entered). '+result.note:'Retention incomplete: '+result.reason;
 }
 document.addEventListener('input',e=>{const el=e.target?.closest?.('[data-retention-lab]');if(el)update(el)});
 return {apply,controls};
})();