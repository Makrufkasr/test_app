/* Mobile-first interface layer. Curriculum and saved progress remain unchanged. */
const mobileIcons={home:'⌂',fast:'⚡',path:'◇',practice:'✎',library:'▤',verbs:'✦',levels:'★',progress:'▥'};
const mobileNames={home:'Home',fast:'Belajar',path:'Jalur',practice:'Menulis',library:'Grammar',verbs:'Verbs',levels:'Challenge',progress:'Progres'};
const baseHome=home;
home=function(){
 const done=Object.values(fastDone).filter(Boolean).length;
 const total=fastUnits.length;
 const pct=Math.round(done/Math.max(1,total)*100);
 const next=fastUnits.findIndex((u,i)=>!fastDone[i]);
 const idx=next<0?0:next;
 const stage=stageBlueprint[stageIndex[idx]];
 const current=fastUnits[idx];
 const known=Object.values(verbKnown).filter(Boolean).length;
 return `<section class="welcome-hero"><div class="hero-stars" aria-hidden="true">✦ ✧ ✦</div><div class="hero-top"><span class="hero-pill">✦ YOUR ENGLISH JOURNEY</span><img class="hero-mascot" src="mascot.webp" alt="English Learning Buddy"></div><h2>Small steps.<br><em>Big progress.</em> 🚀</h2><p>Belajar sedikit, praktik setiap hari. Siap bikin tulisan English kamu makin percaya diri?</p><button class="hero-cta" data-go="fast">Lanjut belajar <span>↗</span></button></section>
 <div class="daily-overview"><div class="mini-metric"><span class="metric-icon purple">⚡</span><div><strong>${pct}%</strong><small>Course progress</small></div></div><div class="mini-metric"><span class="metric-icon peach">🎯</span><div><strong>${done}/${total}</strong><small>Topik selesai</small></div></div><div class="mini-metric"><span class="metric-icon mint">🧠</span><div><strong>${known}</strong><small>Verbs dikuasai</small></div></div></div>
 <section class="section-block"><div class="section-heading"><div><span class="section-kicker">PICK UP WHERE YOU LEFT OFF</span><h2>Continue learning <span>✨</span></h2></div></div><article class="continue-card"><div class="continue-header"><span class="stage-chip">STAGE ${stageIndex[idx]+1} · ${stage.level.toUpperCase()}</span><span class="continue-emoji">📖</span></div><h3>${escapeHtml(current[1])}</h3><p>${escapeHtml(stage.recycle)}</p><div class="progress-meta"><span>Perjalanan belajarmu</span><strong>${pct}%</strong></div><div class="bar"><span style="width:${pct}%"></span></div><button class="btn" data-resume="${idx}">Lanjutkan topik <span>→</span></button></article></section>
 <section class="section-block"><div class="section-heading"><div><span class="section-kicker">CHOOSE YOUR ACTIVITY</span><h2>Explore & practice</h2></div></div><div class="activity-grid"><button class="activity-tile lilac" data-go="fast"><span class="tile-emoji">🧩</span><strong>Learning path</strong><small>6 stage bertahap</small><span class="tile-arrow">↗</span></button><button class="activity-tile butter" data-go="verbs"><span class="tile-emoji">🃏</span><strong>Verb flashcards</strong><small>Hafal dengan warna</small><span class="tile-arrow">↗</span></button><button class="activity-tile mint" data-go="practice"><span class="tile-emoji">✍️</span><strong>Writing studio</strong><small>Tulis & revisi</small><span class="tile-arrow">↗</span></button><button class="activity-tile rose" data-go="library"><span class="tile-emoji">📚</span><strong>Grammar bites</strong><small>Cheat sheet praktis</small><span class="tile-arrow">↗</span></button></div></section>
 <section class="daily-tip"><div class="tip-bubble">💡</div><div><span class="section-kicker">TODAY'S LITTLE TIP</span><h3>Progress, not perfection!</h3><p>Menulis satu kalimat lalu memperbaikinya lebih bermanfaat daripada hanya membaca sepuluh aturan grammar.</p></div></section>`;
};
const beforeMobileRender=render;
render=function(){beforeMobileRender();document.body.dataset.page=activeTab;document.querySelectorAll('.bottom-nav button').forEach(b=>b.classList.toggle('active',b.dataset.tab===activeTab));const titleMap={home:'Hi, English learner! 👋',fast:'Your learning journey ✨',path:'Learning path 🧩',practice:'Writing studio ✍️',library:'Grammar bites 📚',verbs:'Verb flashcards 🃏',levels:'Writing challenges 🏆',progress:'Your progress 🎯'};const greeting=document.querySelector('#greeting');if(greeting)greeting.textContent=titleMap[activeTab];};
const originalGo=go;
go=function(tab){originalGo(tab);window.scrollTo({top:0,behavior:'instant'});};
function mobileNavigate(tab){go(tab);}
const mobileNav=document.createElement('nav');mobileNav.className='bottom-nav';mobileNav.setAttribute('aria-label','Navigasi utama');mobileNav.innerHTML=[['home','⌂','Home'],['fast','⚡','Belajar'],['practice','✎','Menulis'],['verbs','▦','Verbs'],['progress','◷','Progres']].map(([id,icon,label])=>`<button type="button" data-tab="${id}" aria-label="${label}"><span class="bottom-icon">${icon}</span><span>${label}</span></button>`).join('');document.body.append(mobileNav);
mobileNav.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>mobileNavigate(b.dataset.tab)));
const content=document.querySelector('#content');content.addEventListener('click',e=>{const b=e.target.closest('[data-resume]');if(b){fastIndex=Number(b.dataset.resume);fastLevel=fastUnits[fastIndex][0];fastView='units';go('fast');}});
/* Retain work in progress when navigating among lesson topics. */
content.addEventListener('input',e=>{if(e.target.id==='fastDraft'){fastDrafts[fastIndex]=e.target.value;fastSave()}else if(e.target.id==='fastRevision'){fastRevisions[fastIndex]=e.target.value;fastSave()}else if(e.target.id==='lessonDraft'){drafts['lesson'+lessonIndex]=e.target.value;localStorage.setItem('ewl_drafts',JSON.stringify(drafts))}else if(e.target.id==='challengeDraft'){drafts['challenge'+selectedLevel]=e.target.value;localStorage.setItem('ewl_drafts',JSON.stringify(drafts))}});
/* Quick-access desktop header and mobile stage progress decoration. */
const topbar=document.querySelector('.topbar');const navMore=document.createElement('button');navMore.className='mobile-more';navMore.type='button';navMore.textContent='☰';navMore.setAttribute('aria-label','Menu lainnya');topbar.append(navMore);
navMore.addEventListener('click',()=>document.body.classList.toggle('menu-open'));
document.querySelectorAll('.sidebar .nav').forEach(b=>b.addEventListener('click',()=>document.body.classList.remove('menu-open')));
document.addEventListener('keydown',e=>{if(e.key==='Escape')document.body.classList.remove('menu-open')});
render();
