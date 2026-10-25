/* English Writing Lab 3.0 · AI writing correction module */
(function(){
'use strict';
const store='ewl_ai_config_v1', historyKey='ewl_ai_reviews_v1';
const $=id=>document.getElementById(id);
const safe=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const getConfig=()=>{try{return JSON.parse(localStorage.getItem(store)||'{}')}catch{return {}}};
let latest=null, busy=false;
function panel(){return `<section class="card ai-coach" aria-label="AI Writing Coach">
 <div class="ai-head"><div><span class="ai-eyebrow">✦ YOUR WRITING COACH</span><h3>AI Writing Correction</h3><p class="muted">Koreksi tulisan Anda dengan alasan yang mudah dipahami, lalu tulis ulang.</p></div><span class="ai-chip">Online</span></div>
 <div class="ai-row"><button type="button" class="btn ai-action" id="aiCheck">✨ Koreksi dengan AI</button><button type="button" class="btn secondary" id="aiSettingsToggle">⚙ Pengaturan</button></div>
 <div id="aiSetup" hidden class="ai-setup"><label class="label" for="aiEndpoint">Alamat backend AI (HTTPS)</label><input class="ai-input" id="aiEndpoint" type="url" spellcheck="false" autocomplete="off" placeholder="https://your-worker.workers.dev"/><label class="label" for="aiAccess">Kode akses aplikasi (jika backend mengharuskan)</label><input class="ai-input" id="aiAccess" type="password" autocomplete="off" placeholder="Bukan API key model"/><p class="small">Jangan masukkan API key OpenAI/Gemini di sini. API key disimpan sebagai secret di backend. Kode akses aplikasi tersimpan di perangkat ini.</p><button type="button" class="btn secondary" id="aiSaveConfig">Simpan pengaturan</button></div>
 <p class="small" id="aiStatus" aria-live="polite">AI memerlukan backend yang sudah di-deploy dan koneksi internet. Pemeriksaan dasar masih bisa digunakan tanpa internet.</p>
 <div id="aiOutput"></div>
 </section>`}
function insert(){const el=$('answer');if(!el)return;const target=el.closest('.card');if(!target)return;let existing=$('aiCoachRoot');if(!existing){existing=document.createElement('div');existing.id='aiCoachRoot';target.appendChild(existing)}existing.innerHTML=panel();latest=null;
 const cfg=getConfig();$('aiEndpoint').value=cfg.url||'';$('aiAccess').value=cfg.access||'';
 $('aiSettingsToggle').onclick=()=>{$('aiSetup').hidden=!$('aiSetup').hidden};
 $('aiSaveConfig').onclick=()=>{let url=$('aiEndpoint').value.trim().replace(/\/+$/,'');if(url&&!/^https:\/\//i.test(url)&&!/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?/i.test(url)){$('aiStatus').textContent='Gunakan alamat HTTPS untuk backend (localhost boleh untuk pengembangan).';return}localStorage.setItem(store,JSON.stringify({url,access:$('aiAccess').value.trim()}));$('aiStatus').textContent=url?'Pengaturan tersimpan. Anda bisa mulai meminta koreksi.':'Masukkan URL backend untuk mengaktifkan AI.';$('aiSetup').hidden=true};
 $('aiCheck').onclick=()=>requestReview();}
async function requestReview(){if(busy)return;const userText=$('answer')?.value.trim()||'';if(userText.length<8){$('aiStatus').textContent='Tulis setidaknya satu kalimat lebih dulu.';return}if(userText.length>3000){$('aiStatus').textContent='Batas 3.000 karakter per pemeriksaan.';return}const cfg=getConfig();if(!cfg.url){$('aiSetup').hidden=false;$('aiStatus').textContent='Masukkan alamat backend AI terlebih dahulu.';return}
 busy=true;$('aiCheck').disabled=true;$('aiCheck').textContent='Memeriksa tulisan…';$('aiStatus').textContent='Memeriksa grammar, clarity, vocabulary, dan konteks tugas…';$('aiOutput').innerHTML='';
 try{
 const task=typeof modules!=='undefined'?modules[activeModule]:null;
 const ctl=new AbortController(),tm=setTimeout(()=>ctl.abort(),45000);
 let resp;try{resp=await fetch(cfg.url.replace(/\/+$/,'')+'/review',{method:'POST',headers:{'Content-Type':'application/json',...(cfg.access?{'Authorization':'Bearer '+cfg.access}:{})},body:JSON.stringify({text:userText,level:task?.title||'general',scenario:task?.scenario||'',instruction:task?.prompt||''}),signal:ctl.signal})}finally{clearTimeout(tm)}
 let data;try{data=await resp.json()}catch{throw Error('Backend tidak mengirim JSON yang valid.')}
 if(!resp.ok)throw Error(data.error||'Backend mengembalikan error '+resp.status);
 if(!data||typeof data.corrected!=='string'||!Array.isArray(data.changes))throw Error('Format hasil koreksi tidak sesuai.');
 latest={...data,original:userText};renderReview(latest);saveHistory(latest,task?.title||'Writing');$('aiStatus').textContent='Koreksi selesai. Bandingkan hasilnya, lalu revisi tulisan Anda.';
 }catch(err){$('aiStatus').textContent='Tidak dapat memeriksa: '+(err.name==='AbortError'?'koneksi melebihi batas waktu.':err.message)+'. Periksa URL, akses, koneksi internet, dan status backend.'}
 finally{busy=false;if($('aiCheck')){$('aiCheck').disabled=false;$('aiCheck').textContent='✨ Koreksi dengan AI'}}}
function saveHistory(result,title){try{let records=JSON.parse(localStorage.getItem(historyKey)||'[]');records.unshift({date:new Date().toISOString(),title,original:result.original,corrected:result.corrected,changes:result.changes,summary:result.summary});localStorage.setItem(historyKey,JSON.stringify(records.slice(0,30)))}catch(e){console.warn('Could not save AI correction history',e)}}
function renderReview(d){const changes=d.changes.slice(0,10).map(c=>`<div class="ai-change"><b>${safe(c.category||'Perbaikan')}</b><div class="ai-before">${safe(c.before)}</div><div class="ai-after">${safe(c.after)}</div><p>${safe(c.reason_id||'Periksa kembali struktur kalimat.')}</p></div>`).join('');$('aiOutput').innerHTML=`<div class="ai-result"><h4>📝 Hasil koreksi</h4><p class="ai-result-label">Versi yang dikoreksi</p><div class="ai-corrected">${safe(d.corrected)}</div><p class="ai-result-label">Ringkasan</p><p>${safe(d.summary)}</p><h4>Alasan perubahan</h4>${changes||'<p>Struktur utama sudah baik. Perhatikan gaya dan kesesuaian konteks.</p>'}<h4>Natural & professional</h4><div class="ai-corrected alt">${safe(d.professional||d.corrected)}</div><p class="ai-result-label">Latihan selanjutnya</p><p>${safe(d.next_task||'Tulis ulang tanpa menyalin versi koreksi.')}</p><div class="ai-row"><button type="button" class="btn secondary" id="aiCopy">Salin revisi</button><button type="button" class="btn ai-action" id="aiRewrite">Tulis ulang ✍</button></div><p class="small">Ulasan AI bisa keliru. Periksa apakah makna asli dan fakta tetap terjaga.</p></div>`;
 $('aiCopy').onclick=()=>{if(navigator.clipboard?.writeText)navigator.clipboard.writeText(d.corrected).catch(()=>{});else{$('aiStatus').textContent='Fitur salin tidak tersedia di browser ini.'}};
 $('aiRewrite').onclick=()=>{const ta=$('answer');if(ta){ta.focus();ta.scrollIntoView({behavior:'smooth',block:'center'});$('aiStatus').textContent='Coba tulis kembali kalimat Anda berdasarkan feedback, lalu periksa ulang.'}};
}
function wire(){if($('answer'))insert();}
// Existing app uses render() to replace DOM; attach the AI panel after each render.
if(typeof render==='function'){const oldRender=render;render=function(){oldRender();wire()};wire();}
})();
