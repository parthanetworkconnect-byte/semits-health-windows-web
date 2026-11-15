'use strict';
/* SEMITS R4.3 experimental local research + document expansion.
   Only fictional trial reports. PDF.js / Tesseract are loaded from pinned
   external packages on explicit user click. Third-party code is NOT suitable
   for processing private records before self-hosting/security review. */
(function(){
 const DOC_KEY='semits-r43-records-v1';
 const E=v=>r4esc(String(v??''));
 const LIM=15*1024*1024;
 const pdfPackage='https://cdn.jsdelivr.net/npm/pdfjs-dist@6.5.438/build/pdf.mjs';
 const pdfWorker='https://cdn.jsdelivr.net/npm/pdfjs-dist@6.5.438/build/pdf.worker.mjs';
 const tessPackage='https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/tesseract.esm.min.js';
 let activeResearch=[],loadedHistory=[];
 function vaultId(){return r41active()?.id||'default'}
 function status(message){const p=document.querySelector('#r43-ext-status');if(p)p.textContent=message}
 async function extractFile(file){
  if(!file||file.size>LIM)throw Error('Select a PDF or image under 15 MB (fictional test data only).');
  if(/\.pdf$/i.test(file.name)&&file.type==='application/pdf'){
   status('Loading PDF text extractor; reading local document...');
   const pdf=await import(pdfPackage);pdf.GlobalWorkerOptions.workerSrc=pdfWorker;
   const bytes=await file.arrayBuffer(),document=await pdf.getDocument({data:new Uint8Array(bytes)}).promise;
   let pages=[],count=Math.min(document.numPages,30);
   for(let page=1;page<=count;page++){
    const p=await document.getPage(page);
    const items=(await p.getTextContent()).items;
    const text=items.map(i=>i.str||'').join(' ');
    pages.push('Page '+page+':\n'+text);
   }
   const content=pages.join('\n\n');
   if(content.trim().length<30){
    status('This PDF appears scanned. Running optical character recognition on up to five pages...');
    const mod=await import(tessPackage),worker=await mod.createWorker('eng');
    const scanned=[];
    try{
     for(let n=1;n<=Math.min(count,5);n++){
      const page=await document.getPage(n),view=page.getViewport({scale:1.6});
      if(view.width*view.height>12000000)throw Error('Page too large for safe browser OCR');
      const canvas=globalThis.document.createElement('canvas');
      canvas.width=Math.ceil(view.width);canvas.height=Math.ceil(view.height);
      const ctx=canvas.getContext('2d');
      try{await page.render({canvasContext:ctx,viewport:view}).promise;
       const result=await worker.recognize(canvas);
       scanned.push('Scanned page '+n+':\n'+(result.data?.text||''));
       status('OCR progress: '+n+' of '+Math.min(count,5)+' pages. All text must be checked manually.');
      }finally{canvas.width=0;canvas.height=0}
     }
    }finally{await worker.terminate()}
    const recognised=scanned.join('\n\n');
    if(recognised.trim().length<10)throw Error('No readable text recognised. Use a clearer scan or manual transcription.');
    return recognised.slice(0,200000);
   }
   return content.slice(0,200000);
  }
  if(file.type.startsWith('image/')){
   status('Loading OCR engine; processing local image...');
   const mod=await import(tessPackage),worker=await mod.createWorker('eng');
   try{const response=await worker.recognize(file);return response.data.text.slice(0,200000)}
   finally{await worker.terminate()}
  }
  throw Error('Only PDFs and image formats supported by the browser are accepted.');
 }
 function searchBar(){
  return '<section class="card"><h2>Experimental PDF, image & internet research tools</h2>'+
   '<p class="note"><strong>Development test only:</strong> PDF.js and Tesseract OCR libraries currently load from external package servers after you click Extract. Such code is not suitable for real private records until independently verified and self-hosted. Extraction can be wrong. No document is deliberately uploaded to a medical API by this module.</p>'+
   '<div class="r43-form"><label>Select a fictional PDF or image<input id="r43-ext-file" type="file" accept=".pdf,image/png,image/jpeg,image/webp"></label>'+
   '<button id="r43-ext-extract" type="button" class="btn outline">Extract into editable report text</button><p id="r43-ext-status" role="status"></p></div>'+
   '<hr><h3>Public medical research (manual, no personal records)</h3>'+
   '<form id="r43-ext-research" class="r43-form"><label>Public medical topic only<input required id="r43-ext-topic" maxlength="90" placeholder="e.g. resistance exercise and hypertension"></label><button type="submit" class="btn outline">Search public evidence</button></form>'+
   '<div id="r43-ext-evidence" role="status"></div>'+
   '<hr><h3>Medication label reference (not an interaction checker)</h3>'+
   '<form id="r43-ext-med" class="r43-form"><label>Generic or brand medicine name — no personal details<input required maxlength="70" id="r43-ext-med-name" placeholder="e.g. amlodipine"></label><button type="submit" class="btn outline">Search openFDA public labels</button></form>'+
   '<div id="r43-ext-med-label" role="status"></div>'+
   '<hr><h3>Medical history trends</h3>'+
   '<p class="note">Displays numerical values from the same named test and identical units over time. Not a clinical trend interpretation; source records must be manually checked.</p>'+
   '<button id="r43-ext-trends" type="button" class="btn outline">Review encrypted test history</button><div id="r43-ext-trend-output"></div></section>';
 }
 const prev=sections.medicalintelligence;
 sections.medicalintelligence=()=>prev()+(vaultKey?searchBar():'');
 async function history(){
  if(!vaultKey)throw Error('Unlock the trial vault');
  const records=await livingEncryptedRead(DOC_KEY+':'+vaultId())||[];
  return records;
 }
 function dates(a,b){return String(a.date||'').localeCompare(String(b.date||''))}
 function trends(records){
  const groups=new Map();
  for(const r of records)for(const v of r.results||[]){
   const name=String(v.name||'').trim().toLowerCase(),unit=String(v.unit||'').trim();
   const n=Number(String(v.value).replace(/[<>]/g,'').trim());
   if(!name||!Number.isFinite(n)||/[<>]/.test(String(v.value)))continue;
   const k=name+'|'+unit;if(!groups.has(k))groups.set(k,[]);
   groups.get(k).push({name:v.name,unit,value:n,date:r.date,doc:r.title});
  }
  const series=[...groups.values()].map(xs=>xs.sort(dates)).filter(xs=>xs.length>=2).slice(0,20);
  return series.length?series.map(xs=>{
   const first=xs[0],last=xs[xs.length-1],delta=last.value-first.value;
   const detail=xs.map(x=>E(x.date)+': '+E(x.value)+' '+E(x.unit)+' (source: '+E(x.doc)+')').join(' → ');
   return '<article class="r43-med-item"><strong>'+E(first.name)+'</strong><p>'+detail+'</p><p>Arithmetic difference: '+E(Number(delta.toPrecision(6)))+' '+E(first.unit)+'. No clinical significance assigned; this may reflect laboratory, specimen, timing or method differences.</p></article>';
  }).join(''):'<p>No two same-test, same-unit numerical entries yet. Keep reports with dates, consistent test names and units for comparison.</p>';
 }
 async function research(q){
  if(!/^[a-z0-9][a-z0-9 ,()\-]{2,89}$/i.test(q))throw Error('Use a short generic public-topic query without personal information.');
  const endpoint='https://www.ebi.ac.uk/europepmc/webservices/rest/search?format=json&pageSize=5&query='+encodeURIComponent(q+' AND OPEN_ACCESS:y');
  const response=await fetch(endpoint,{method:'GET',mode:'cors',credentials:'omit'});
  if(!response.ok)throw Error('Evidence service unavailable: '+response.status);
  const json=await response.json();
  const items=json.resultList?.result||[];
  return items.length?'<ol>'+items.map(x=>{
   const identifier=x.pmid?'https://pubmed.ncbi.nlm.nih.gov/'+encodeURIComponent(x.pmid)+'/':x.doi?'https://doi.org/'+encodeURIComponent(x.doi):null;
   const link=identifier?'<a href="'+E(identifier)+'" target="_blank" rel="noopener noreferrer">'+E(x.title||'Read article')+'</a>':E(x.title||'Untitled');
   return '<li>'+link+'<p>'+E(x.authorString||'')+' · '+E(x.pubYear||'')+' · '+E(x.journalTitle||'')+'</p></li>';
  }).join('')+'</ol><p class="note">Search results do not prove effectiveness or suitability. Verify publication, methods, date and study quality.</p>':'<p>No open-access articles found for that search.</p>';
 }
 async function medicine(name){
  if(!/^[a-z][a-z0-9 \-]{2,69}$/i.test(name))throw Error('Enter a generic public medication name; do not include patient details.');
  const url='https://api.fda.gov/drug/label.json?search='+encodeURIComponent('openfda.generic_name:"'+name.replace(/"/g,'')+'"')+'&limit=3';
  const res=await fetch(url,{mode:'cors',credentials:'omit'});
  if(!res.ok)throw Error('No matching openFDA drug labels, or service unavailable ('+res.status+').');
  const json=await res.json();
  return (json.results||[]).slice(0,3).map(r=>'<div class="r43-med-item"><strong>'+E((r.openfda?.brand_name||r.openfda?.generic_name||['Unspecified product']).join(', '))+'</strong>'+
   '<p>Selected official-label text (unverified for your medicine):</p><p>'+E((r.warnings||r.warnings_and_cautions||r.drug_interactions||['No matching summary field']).join(' ').slice(0,900))+'</p></div>').join('')+
   '<p class="note">US labels only and may not match Australian medicines. This is NOT an interaction checker; consult a pharmacist or prescriber. Do not change any medication from these results.</p>';
 }
 document.addEventListener('click',async e=>{
  const el=e.target;
  if(el.id==='r43-ext-extract'){
   e.preventDefault();const f=document.querySelector('#r43-ext-file')?.files?.[0];
   if(!f){status('Choose a fictional PDF or image first');return}
   if(!confirm('Development test only. Loading PDF/OCR libraries from an external package host is unsafe for real medical records. Continue with a fictional sample?'))return;
   try{let t=await extractFile(f);const text=document.querySelector('#r43-medtext'),title=document.querySelector('#r43-medform [name=title]');if(!text)throw Error('Medical form unavailable');text.value=t;if(title&&!title.value)title.value=f.name.slice(0,120);status('Extracted '+t.length+' characters. Please verify against the source, then use the existing encrypted trial Save action.')}
   catch(err){status('Extraction failed: '+err.message)}
  }
  if(el.id==='r43-ext-trends'){
   e.preventDefault();const panel=document.querySelector('#r43-ext-trend-output');
   try{panel.innerHTML=trends(await history())}catch(err){panel.textContent=err.message}
  }
 });
 document.addEventListener('submit',async e=>{
  if(e.target.id==='r43-ext-research'){e.preventDefault();e.stopImmediatePropagation();const panel=document.querySelector('#r43-ext-evidence');panel.textContent='Checking public research...';try{panel.innerHTML=await research(document.querySelector('#r43-ext-topic').value)}catch(err){panel.textContent='Research search unavailable: '+err.message}}
  if(e.target.id==='r43-ext-med'){e.preventDefault();e.stopImmediatePropagation();const panel=document.querySelector('#r43-ext-med-label');panel.textContent='Finding public medicine labels...';try{panel.innerHTML=await medicine(document.querySelector('#r43-ext-med-name').value)}catch(err){panel.textContent='Medicine label lookup unavailable: '+err.message}}
 },true);
})();