('use strict');
/* SEMITS Medical Intelligence R4.3: educational prototype, synthetic data only. */
(function(){
 const KEY='semits-r43-records-v1', MAX=200000;
 let docs=[], loaded=null;
 const E=x=>r4esc(String(x??''));
 const kind=['Blood test','Radiology report','Medicine / prescription list','Specialist letter','Hospital discharge','Physiotherapy note','Other medical document'];
 const id=()=>r41active()?.id||'default';
 async function load(){if(!vaultKey){docs=[];loaded=null;return}if(loaded===id())return;loaded=id();try{docs=await livingEncryptedRead(KEY+':'+loaded)||[]}catch{docs=[]}}
 async function save(){if(!vaultKey)throw Error('Vault locked');await livingEncryptedWrite(KEY+':'+id(),docs)}
 function extract(t){
  const results=[],meds=[];
  t.split(/\r?\n/).slice(0,2000).forEach((line,i)=>{
   const m=line.match(/^\s*([A-Za-z][A-Za-z0-9 ()\/-]{2,65})\s*[:=]\s*([<>]?\s*\d+(?:\.\d+)?)\s*([^\s]*)/);
   if(m&&results.length<100)results.push({name:m[1].trim(),value:m[2].trim(),unit:m[3]||'',line:i+1,verified:false});
   const rx=line.match(/^\s*(?:medication|medicine|prescribed|rx)\s*[:=-]\s*(.{3,150})$/i);
   if(rx&&meds.length<50)meds.push({raw:rx[1],line:i+1,verified:false});
  });return {results,meds};
 }
 function list(){if(!docs.length)return '<p>No saved trial documents.</p>';return docs.map(d=>'<article class="r43-med-item"><strong>'+E(d.title)+'</strong><p>'+E(d.date)+' · '+E(d.type)+' · '+d.results.length+' possible lab results · '+d.meds.length+' possible medicine entries</p>'+
 (d.results.length?'<details><summary>Extracted numerical values — unverified</summary><ul>'+d.results.map(v=>'<li>'+E(v.name)+' : '+E(v.value)+' '+E(v.unit)+' (line '+v.line+')</li>').join('')+'</ul></details>':'')+
 (d.meds.length?'<details><summary>Potential medication entries — unverified</summary><ul>'+d.meds.map(m=>'<li>'+E(m.raw)+'</li>').join('')+'</ul></details>':'')+
 '<button type="button" class="btn outline" data-meddelete="'+E(d.id)+'">Delete trial entry</button></article>').join('')}
 function answer(q){let terms=q.toLowerCase().split(/[^a-z0-9]+/).filter(w=>w.length>4&&!['which','about','please','report','medical','there','these','those','information'].includes(w));
 if(!docs.length)return 'No saved documents. Add a sample report first.';
 if(/diagnos|prescrib|medication dose|change my medicine|cure|what causes|treatment/.test(q.toLowerCase()))return 'I cannot diagnose, prescribe or determine causes from these records. Ask a qualified clinician. This prototype only retrieves supporting report text.';
 let hits=[];docs.forEach(d=>{let lines=d.text.split(/\r?\n/).filter(line=>terms.some(w=>line.toLowerCase().includes(w))).slice(0,3);if(lines.length)hits.push('Source: '+d.title+' ('+d.date+')\n'+lines.join('\n'))});
 return hits.length?hits.slice(0,5).join('\n\n')+'\n\nUnverified document lookup; compare with the original report.':'No matching evidence found in the imported text. Try a more specific measurement, medicine or report name.';
 }
 function page(){return '<div class="r4-hero"><div><div class="r4-eyebrow">SEMITS HEALTH · R4.3 EXPERIMENTAL</div><h1>Medical Intelligence</h1><p>Encrypted history, document extraction and source-grounded questions</p></div></div>'+
 (!vaultKey?'<section class="card"><h2>Trial vault locked</h2><p>Unlock it in My Health Hub first.</p><a href="#hub" class="btn">Open hub</a></section>':
 '<div class="r43-layout"><section class="card"><h2>Import test medical report</h2><p class="note"><strong>Fictional data only.</strong> Paste or import text here; experimental PDF and image extraction tools appear below. OCR is unverified and limited. Review all extracted results before saving. No medical information is transmitted to an AI service.</p>'+
 '<form id="r43-medform" class="r43-form"><label>Document title<input name="title" required maxlength="120"></label><label>Category<select name="type">'+kind.map(x=>'<option>'+E(x)+'</option>').join('')+'</select></label>'+
 '<label>Document date<input type="date" required name="date"></label><label>Local text document (.txt)<input id="r43-medfile" type="file" accept=".txt,text/plain"></label>'+
 '<label>Transcribed report text<textarea name="text" id="r43-medtext" required maxlength="'+MAX+'" rows="9"></textarea></label><button class="btn" type="submit">Extract and save in trial vault</button><p id="r43-medstatus" role="status"></p></form></section>'+
 '<section class="card"><h2>My saved medical history</h2><div id="r43-medlist">'+list()+'</div><hr><h3>Ask about the records</h3>'+
 '<p class="note">Local source-text lookup, not clinical AI or diagnostic interpretation.</p><form id="r43-medask" class="r43-form"><label>Question<input id="r43-medquestion" maxlength="200" required placeholder="Show the glucose result"></label><button class="btn outline" type="submit">Find evidence</button></form><pre id="r43-medanswer" class="r43-evidence"></pre></section></div>')}
 menus.push(['medicalintelligence','▣','Medical Intelligence']);
 sections.medicalintelligence=page;
 document.addEventListener('submit',async ev=>{if(ev.target.id==='r43-medform'){ev.preventDefault();ev.stopImmediatePropagation();const f=ev.target,d=new FormData(f),t=String(d.get('text')||'').trim();try{if(t.length<3||t.length>MAX)throw Error('Check report text length');const e=extract(t);const record={id:crypto.randomUUID(),title:String(d.get('title')),type:String(d.get('type')),date:String(d.get('date')),text:t,results:e.results,meds:e.meds};docs.unshift(record);try{await save()}catch(error){docs.shift();throw error}f.reset();document.querySelector('#r43-medlist').innerHTML=list();document.querySelector('#r43-medstatus').textContent='Encrypted trial record saved. All extracted values require manual review.'}catch(error){document.querySelector('#r43-medstatus').textContent='Not saved: '+error.message}}
 else if(ev.target.id==='r43-medask'){ev.preventDefault();ev.stopImmediatePropagation();document.querySelector('#r43-medanswer').textContent=answer(document.querySelector('#r43-medquestion').value)}},true);
 document.addEventListener('change',async ev=>{if(ev.target.id!=='r43-medfile')return;const f=ev.target.files?.[0];if(!f)return;const s=document.querySelector('#r43-medstatus');if(!/\.txt$/i.test(f.name)||f.size>MAX){s.textContent='Only TXT under 200KB is supported in this trial';return}document.querySelector('#r43-medtext').value=await f.text();s.textContent='Text loaded locally. Review before saving.'});
 document.addEventListener('click',async ev=>{const key=ev.target?.getAttribute?.('data-meddelete');if(!key||!confirm('Delete this trial medical record?'))return;const previous=docs;docs=docs.filter(d=>d.id!==key);try{await save();document.querySelector('#r43-medlist').innerHTML=list()}catch{docs=previous;alert('Delete failed')}});
 window.addEventListener('hashchange',()=>{if(location.hash==='#medicalintelligence')load().then(()=>{if(location.hash==='#medicalintelligence')nav()})});
})();