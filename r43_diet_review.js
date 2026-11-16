'use strict';
/* SEMITS R4.3 review checklist: not clinical certification, diagnosis or treatment.
 * Block unsupported recommendations rather than mark all diets safe.
 */
var SEMITS_DIET_REVIEW=(function(){
 const E=v=>r4esc(String(v??''));
 function assess(profile,plan){
  const issues=[],next=[];
  if(!profile||!profile.age||!profile.height||!profile.weight)issues.push('Missing age, height or weight');
  if(Number(profile?.age)<18)issues.push('Young person: no automatic adult energy restriction or weight target');
  if((profile?.redflags||[]).length)issues.push('Urgent warning signs reported: do not rely on a diet plan for emergency care');
  if((profile?.flags||[]).length)issues.push('Medical flags reported: condition-specific nutrition requires professional review');
  if(!profile?.diet||profile.diet==='Other / custom')issues.push('Diet requirements not confirmed');
  if(!profile?.allergiesConfirmed)issues.push('Allergen screening is incomplete; do not call meals allergy-safe');
  if(!profile?.medicationReviewed)issues.push('Medication–food interaction screening not completed');
  if(!plan?.ingredientsMatched)issues.push('Ingredients or recipe nutrition have not all been independently matched to source data');
  if(!plan?.yieldMeasured)issues.push('Recipe cooked yield and serving weights not fully measured');
  if(!plan?.nutrientCompleteness)issues.push('Nutrient reference values are incomplete');
  next.push('Review every recipe, including hidden sauces, cross-contact, and culturally relevant dietary restrictions');
  next.push('Arrange independent review of condition-specific recommendations by qualified health professionals');
  next.push('Test accuracy on independent recipes, dietary patterns and diverse population groups, recording errors');
  return {status:'NOT CLINICALLY VALIDATED',canBePresentedAsClinicallyValidated:false,issues,next,
   educationalOnly:true};
 }
 function render(profile){
  const q=assess(profile,{ingredientsMatched:false,yieldMeasured:false,nutrientCompleteness:false});
  return '<details class="r43-review-checklist"><summary>Clinical validation and diet safety status</summary>'+
   '<p><strong>'+E(q.status)+'</strong> — prototype guidance only. A completed checkbox does not establish clinical validity.</p>'+
   '<ul>'+q.issues.map(x=>'<li>'+E(x)+'</li>').join('')+'</ul>'+
   '<p>Required before deployment as medical nutrition software:</p><ul>'+q.next.map(x=>'<li>'+E(x)+'</li>').join('')+'</ul></details>';
 }
 return {assess,render};
})();