'use strict';
/* SEMITS R4.3 — optional Open Food Facts lookup.
 * No account, medical text, user profile or health record sent.
 * A search term / barcode is sent to Open Food Facts only after the user clicks Search.
 * Community contributed branded products are not independently verified.
 */
(function(){
 const BASE='https://world.openfoodfacts.org';
 const E=v=>r4esc(String(v??''));
 const fields='code,product_name,brands,quantity,nutriments,nutrition_data_per,serving_size';
 let lastSearch=0;const matchesByRow=new WeakMap();
 const sane=(v,min,max)=>Number.isFinite(Number(v))&&Number(v)>=min&&Number(v)<=max?Number(v):null;
 const nutrient=(obj,key,max)=>sane(obj?.[key+'_100g'],0,max);
 function normalise(raw){
  const n=raw?.nutriments||{};
  const kcal=nutrient(n,'energy-kcal',1000);
  const protein=nutrient(n,'proteins',100),carbs=nutrient(n,'carbohydrates',100),fat=nutrient(n,'fat',100);
  return {code:String(raw.code||''),name:String(raw.product_name||'').trim(),
   brand:String(raw.brands||'').trim(),quantity:String(raw.quantity||'').trim(),
   kcal,protein,carbs,fat,source:'Open Food Facts, barcode '+String(raw.code||'')};
 }
 function requestURL(term){
  const q=String(term||'').trim();
  if(/^\d{8,14}$/.test(q))return BASE+'/api/v2/product/'+encodeURIComponent(q)+'?fields='+encodeURIComponent(fields);
  const p=new URLSearchParams({action:'process',search_simple:'1',json:'1',search_terms:q,page_size:'8',fields});
  return BASE+'/cgi/search.pl?'+p.toString();
 }
 function eligible(x){return x.code&&x.name&&x.kcal!==null}
 function closestRow(target){return target?.closest?.('[data-nutrient-row]')||null}
 async function search(trigger){
  const row=closestRow(trigger);if(!row)return;
  const query=row.querySelector('[data-food-lookup-term]')?.value?.trim()||'';
  if(query.length<2||query.length>90){showMessage(row,'Enter a product name (2–90 characters) or barcode.');return}
  const now=Date.now();
  if(now-lastSearch<6500){showMessage(row,'Please wait before another request. Search is rate-limited to protect Open Food Facts.');return}
  lastSearch=now;
  const result=row.querySelector('[data-food-matches]');
  result.replaceChildren();result.textContent='Searching Open Food Facts for matching packaged foods…';
  try{
   const resp=await fetch(requestURL(query),{method:'GET',mode:'cors',headers:{Accept:'application/json'}});
   if(!resp.ok)throw Error('Lookup failed (HTTP '+resp.status+').');
   const data=await resp.json();
   const products=Array.isArray(data.products)?data.products:data.product?[data.product]:[];
   const latest=products.map(normalise).filter(eligible).slice(0,8);matchesByRow.set(row,latest);
   if(!latest.length){result.textContent='No products with a usable per-100g energy value found. Try a barcode, or enter label data manually.';return}
   result.replaceChildren();
   const intro=document.createElement('p');intro.textContent='Compare exact product, brand and label before applying. Open Food Facts is community-edited and may be wrong.';result.append(intro);
   latest.forEach((x,i)=>{
    const el=document.createElement('button');el.type='button';el.className='btn outline r43-lookup-choice';
    el.textContent=x.name+(x.brand?' · '+x.brand:'')+
    ' | '+x.kcal+' kcal/100 g'+(x.quantity?' · pack '+x.quantity:'')+
    ' | '+x.code+' — Select product';
    el.dataset.offChoice=String(i);result.append(el);
   });
   const attr=document.createElement('p');attr.className='note';
   attr.textContent='Source: Open Food Facts (openfoodfacts.org), data subject to ODbL. Choose only a confirmed product; verify its packaging and nutrition panel.';
   result.append(attr);
  }catch(err){showMessage(row,'Search unavailable or blocked: '+String(err.message||err)+'. Manual nutrient entry remains available.')}
 }
 function showMessage(r,msg){const el=r?.querySelector('[data-food-matches]');if(el)el.textContent=msg}
 function apply(target){
  const selected=Number(target.dataset.offChoice),r=closestRow(target);const x=matchesByRow.get(r)?.[selected];
  if(!r||!x)return;
  if(!confirm('Does '+x.name+(x.brand?' ('+x.brand+')':'')+' exactly match the food, preparation and nutrition panel? Copy its community-sourced per-100g data for manual review?'))return;
  const inputs={reference:x.kcal,protein:x.protein,carbs:x.carbs,fat:x.fat};
  for(const [key,value]of Object.entries(inputs)){
   const input=r.querySelector('[data-'+key+']');if(input)input.value=value===null?'':String(value);
  }
  const src=r.querySelector('[data-source]');if(src)src.value=x.source.slice(0,80);
  showMessage(r,'Product copied for review: '+x.name+'. Confirm quantities, cooked/raw basis and missing nutrients. Unknown macros are blank.');
  if(typeof SEMITS_NUTRIENT_WORKSHEET!=='undefined')SEMITS_NUTRIENT_WORKSHEET.recompute(r.closest('.r43-nutrient-workbook'));
 }
 document.addEventListener('click',ev=>{
  if(ev.target?.matches?.('[data-food-lookup-go]'))search(ev.target);
  else if(ev.target?.matches?.('[data-off-choice]'))apply(ev.target);
 });
 window.SEMITS_FOOD_REFERENCE={normalise,requestURL};
})();