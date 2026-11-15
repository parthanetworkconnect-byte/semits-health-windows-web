'use strict';
/* SEMITS R4.3 Food Studio. Synthetic data only; pictures are previewed, NOT analysed or stored. */
(function(){
 const KEY='semits-r43-meal-v1',E=v=>r4esc(String(v??''));
 let entries=[],loaded=null;
 const foods=['Char kway teow','Rice and dhal','Chicken and rice','Noodles / pasta','Soup / salad','Burger / pizza','Custom meal'];
 const ingredients=['Egg','Tofu','Chicken','Prawn / seafood','Vegetables','Bean sprouts','Sauce','Pickles','Chips','Fruit'];
 const drinks=['Unknown','Water','Unsweetened tea','Fresh juice','Cola / soft drink','Other'];
 const methods=['Unknown / restaurant','Boiled','Steamed','Stir-fried','Pan-fried','Deep-fried','Grilled','Baked'];
 const oils=['Unknown','None','Olive oil','Canola oil','Peanut oil','Sunflower oil','Coconut oil','Butter / ghee','Other'];
 const pans=['Unknown','Stainless steel','Carbon steel wok','Cast iron','Ceramic','Non-stick (PFAS status unknown)','Other'];
 const source=['Unknown','Gas hob','Induction','Electric hob','Oven','Air fryer'];
 const options=(name,all)=>'<select name="'+name+'">'+all.map(x=>'<option value="'+E(x)+'">'+E(x)+'</option>').join('')+'</select>';
 const id=()=>r41active()?.id||'default';
 async function load(){if(!vaultKey){entries=[];loaded=null;return}if(loaded===id())return;loaded=id();try{entries=await livingEncryptedRead(KEY+':'+loaded)||[]}catch{entries=[]}}
 async function save(){if(!vaultKey)throw Error('Trial vault is locked');await livingEncryptedWrite(KEY+':'+id(),entries)}
 function log(){return entries.length?entries.slice(0,25).map(x=>'<article class="r43-food-entry"><strong>'+E(x.meal)+' · '+E(x.food)+'</strong><p>'+E(x.date)+' · '+E(x.portion)+' · '+E(x.drink)+'</p><button type="button" class="btn outline" data-meal-delete="'+E(x.id)+'">Delete trial meal</button></article>').join(''):'<p>No fictional meals recorded.</p>'}
 function form(){return '<div class="r4-hero"><div><h1>SEMITS Food Intelligence Studio</h1><p>Verify ingredients, analyse eating and learn how to prepare meals</p></div></div>'+
 (!vaultKey?'<section class="card"><h2>Unlock the local test vault</h2><a href="#hub" class="btn">My Health Hub</a></section>':
 '<div class="r43-layout"><section class="card"><h2>Meal entry — photo or manual</h2>'+
 '<p class="note"><strong>Fictional test data only.</strong> Photos are previewed, not recognised or saved. Confirm known ingredients yourself; hidden oils and recipes are unknown.</p>'+
 '<form id="r43-foodform" class="r43-form">'+
 '<label>Entry method'+options('method',['Manual entry','Photo preview plus manual confirmation'])+'</label>'+
 '<label>Optional food image (local preview only)<input id="r43-food-photo-file" type="file" accept="image/png,image/jpeg,image/webp"></label><div id="r43-food-preview"></div>'+
 '<div class="r43-grid"><label>Meal type'+options('meal',['Breakfast','Lunch','Dinner','Snack'])+'</label><label>Food'+options('food',foods)+'</label>'+
 '<label>Portion'+options('portion',['Unknown','Small','Medium','Large','Shared'])+'</label><label>Drink'+options('drink',drinks)+'</label></div>'+
 '<h3>Known ingredients and side dishes</h3><div class="r43-check-grid">'+ingredients.map(x=>'<label class="r43-check"><input type="checkbox" name="ingredient" value="'+E(x)+'"> '+E(x)+'</label>').join('')+'</div>'+
 '<h3>How it was cooked</h3><div class="r43-grid"><label>Method'+options('methodCooking',methods)+'</label>'+
 '<label>Oil'+options('oil',oils)+'</label><label>Oil amount'+options('oilAmount',['Unknown','None','1 teaspoon','2 teaspoons','1 tablespoon','More than 1 tablespoon'])+'</label>'+
 '<label>Heat intensity'+options('heat',['Unknown','Low','Medium','High'])+'</label><label>Cookware'+options('pan',pans)+'</label><label>Heat source'+options('source',source)+'</label></div>'+
 '<label>Optional recipe or meal details<textarea name="notes" rows="3" maxlength="500" placeholder="Ingredients or quantities that are actually known"></textarea></label>'+
 '<button class="btn" type="submit">Analyse and save trial meal</button><p id="r43-food-status" role="status"></p></form></section>'+
 '<section class="card"><h2>Personal food assessment</h2><div id="r43-food-output"><p>Enter the food to review benefits, cautions and cooking guidance.</p></div>'+
 '<hr><h3>Saved trial journal</h3><div id="r43-food-log">'+log()+'</div></section></div>')}
 function analyse(x){
 const profile=livingState.profile||{},goal=String(profile.goal||'maintain');
 const fact=x.food==='Char kway teow'?
 ['Rice noodles provide carbohydrate for energy. Eggs, tofu, meat, seafood and vegetables contribute nutrients only when included.','Many restaurant versions can contain substantial added oil and sodium from sauces; exact amounts are unknown.','For home cooking, consider extra vegetables, a suitable protein, measured oil and moderate sauce.']:
 x.food==='Rice and dhal'?['Rice provides carbohydrate; dhal may provide plant protein and fibre.','Portion size and ghee or oil can change meal energy.','Add vegetables and measure added fats where useful.']:
 x.food==='Chicken and rice'?['Chicken can provide protein; rice provides carbohydrate.','Actual nutrition depends on chicken cut, preparation and portion.','Cook poultry thoroughly and add a variety of vegetables.']:
 ['Nutritional quality depends on actual ingredients, serving sizes and cooking choices.','Unknown recipe details prevent reliable calorie, sodium and fat estimates.','Include appropriate protein, vegetables and portions aligned with goals.'];
 let blocks=[
 ['Potential positives',fact[0]],
 ['Potential limitations',fact[1]+(x.ingredients.includes('Pickles')?' Pickles can add sodium.':'')+(x.ingredients.includes('Chips')?' Chips can add substantial salt and energy.':'')],
 ['What to do next',fact[2]],
 ['Drink and sides',x.drink==='Cola / soft drink'?'Sugary soft drinks add free sugars; consider water or unsweetened choices.':x.drink==='Fresh juice'?'Juice has less fibre than whole fruit; consider whole fruit and water.':x.drink==='Water'?'Water does not add sugar to the meal.':'Confirm drink type and amount before estimating health impact.'],
 ['Oil and temperature','Reported oil: '+x.oil+', amount: '+x.oilAmount+'. Cooking: '+x.methodCooking+', heat: '+x.heat+'. If unknown, the system cannot infer oil quantity or cooking temperature. Avoid smoking oil or burning food.'],
 ['Cookware and energy source','Cookware: '+x.pan+'. Heat: '+x.source+'. Induction uses electromagnetic fields to heat compatible cookware; gas burns fuel and needs ventilation. Avoid empty-pan overheating of non-stick cookware, follow manufacturer heat limits and replace damaged coating. PFAS claims cannot be verified by a food photo.'],
 ['Cooking safety','Use clean equipment, separate raw meat from ready-to-eat food, cook chicken to at least 75°C at the thickest point, and use food-specific safe cooking temperatures. Boiled or steamed vegetables can be prepared with little added oil; texture and cooking duration matter.'],
 ['Connection to health goals',Number(profile.age)<18?'Children need age-appropriate nourishment, not automatic weight-loss targets.':goal==='loss'?'For fat loss, review portions and dietary pattern rather than guessing calories.':goal==='gain'?'For weight gain, review total energy and protein intake.':goal==='muscle'||goal==='shape'?'For muscle building, consider protein adequacy, total energy and timing within the complete day.':'For ongoing wellness, consider variety, fibre, appropriate protein and sustainable habits.'],
 ['Information SEMITS still needs','Was this home-cooked or purchased? What portions, oils and sauces were used? Was the drink sweetened? Are there allergies or medical dietary restrictions?']
 ];
 return '<div class="r43-food-advice">'+blocks.map(([title,body])=>'<article class="r43-food-item"><h3>'+E(title)+'</h3><p>'+E(body)+'</p></article>').join('')+'</div>'+
 '<p class="note">Educational, not a nutrition diagnosis or exact calorie count. No image inference. No medical record is required for general guidance.</p>';
 }
 menus.push(['foodstudio','◈','Food Intelligence Studio']);sections.foodstudio=form;
 document.addEventListener('change',ev=>{
  if(ev.target?.id!=='r43-food-photo-file')return;const f=ev.target.files?.[0],out=document.querySelector('#r43-food-preview');
  out.replaceChildren();if(!f)return;
  if(f.size>5*1024*1024||!/^image\/(png|jpeg|webp)$/.test(f.type)){out.textContent='Select a PNG/JPG/WEBP under 5 MB.';return}
  const url=URL.createObjectURL(f);const img=document.createElement('img');img.src=url;img.alt='Food photo preview; no automated recognition';img.className='r43-food-image';out.appendChild(img);img.addEventListener('load',()=>URL.revokeObjectURL(url),{once:true});
 });
 document.addEventListener('submit',async ev=>{
  if(ev.target?.id!=='r43-foodform')return;ev.preventDefault();ev.stopImmediatePropagation();const d=new FormData(ev.target),v=n=>String(d.get(n)||'');
  const x={id:crypto.randomUUID(),date:new Date().toISOString().slice(0,10),method:v('method'),meal:v('meal'),food:v('food'),portion:v('portion'),drink:v('drink'),ingredients:d.getAll('ingredient').map(String),methodCooking:v('methodCooking'),oil:v('oil'),oilAmount:v('oilAmount'),heat:v('heat'),pan:v('pan'),source:v('source'),notes:v('notes')};
  document.querySelector('#r43-food-output').innerHTML=analyse(x);
  entries.unshift(x);try{await save();document.querySelector('#r43-food-log').innerHTML=log();document.querySelector('#r43-food-status').textContent='Saved encrypted fictional meal details; photo not stored.'}
  catch(e){entries.shift();document.querySelector('#r43-food-status').textContent='Not saved: '+e.message}
 },true);
 document.addEventListener('click',async ev=>{
  const key=ev.target?.getAttribute?.('data-meal-delete');if(!key||!confirm('Delete this test meal?'))return;
  const prev=entries;entries=entries.filter(x=>x.id!==key);try{await save();document.querySelector('#r43-food-log').innerHTML=log()}catch{entries=prev}
 });
 window.addEventListener('hashchange',()=>{if(location.hash==='#foodstudio')load().then(()=>{if(location.hash==='#foodstudio')nav()})});
})();