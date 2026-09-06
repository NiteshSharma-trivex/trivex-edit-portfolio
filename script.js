document.documentElement.classList.add('js');
const $=(s,p=document)=>p.querySelector(s),$$=(s,p=document)=>[...p.querySelectorAll(s)];

/* ============================================================
   TRIVEX EDIT V8.2 — EASY VIDEO LIST
   ------------------------------------------------------------
   ADD A NEW VIDEO by copying one object below and changing:
   - id       = YouTube video ID
   - title    = project title
   - category = SHORT FORM / YOUTUBE / GAMING / ANIME / PROMO
   - label    = small text shown on the card

   Example YouTube URL:
   https://www.youtube.com/watch?v=ABC123XYZ
   The ID is: ABC123XYZ
   For Shorts:
   https://youtube.com/shorts/ABC123XYZ
   The ID is still: ABC123XYZ
   ============================================================ */
const PORTFOLIO_VIDEOS = [
  { id:'nVg8b2vPRFY', title:'PROJECT ONE',   category:'SHORT FORM', label:'YOUTUBE SHORT' },
  { id:'Nch0EJuVEQg', title:'PROJECT TWO',   category:'SHORT FORM', label:'YOUTUBE SHORT' },
  { id:'_ms5cWsvCQ8', title:'PROJECT THREE', category:'SHORT FORM', label:'YOUTUBE SHORT' },
  // { id:'YOUR_VIDEO_ID', title:'MY NEW EDIT', category:'ANIME', label:'ANIME EDIT' },
];

function escapeHTML(value){return String(value).replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\\':'&#92;'}[c]));}

let activeFilter='ALL';
let revealObserver=null;

function renderPortfolioVideos(){
  const grid=$('#portfolioGrid');
  const empty=$('#emptyWork');
  if(!grid)return;
  const items=activeFilter==='ALL'?PORTFOLIO_VIDEOS:PORTFOLIO_VIDEOS.filter(v=>String(v.category).toUpperCase()===activeFilter);
  grid.innerHTML=items.map((v,i)=>{
    const safeTitle=escapeHTML(v.title), safeCategory=escapeHTML(v.category), safeLabel=escapeHTML(v.label||'VIDEO');
    const id=encodeURIComponent(v.id);
    return `<a class="work-card reveal" href="https://www.youtube.com/watch?v=${id}" data-video="${id}">
      <img src="https://i.ytimg.com/vi/${id}/hqdefault.jpg" alt="TRIVEX EDIT ${safeTitle}" loading="lazy">
      <div class="work-top"><span>${String(i+1).padStart(2,'0')} / ${safeCategory}</span><b>↗</b></div>
      <div class="play">▶</div>
      <div class="work-meta"><small>${safeLabel}</small><h3>${safeTitle}</h3></div>
    </a>`;
  }).join('');
  empty.hidden=items.length!==0;
  bindWorkCards();
  bindReveals();
}

function bindWorkCards(){
  $$('.work-card').forEach(el=>{
    el.addEventListener('pointermove',e=>{
      if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
      const r=el.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
      el.style.transform=`perspective(900px) rotateY(${x*4}deg) rotateX(${-y*4}deg) translateY(-4px)`;
    });
    el.addEventListener('pointerleave',()=>el.style.transform='');
    el.addEventListener('click',e=>{
      e.preventDefault();
      const id=el.dataset.video;if(!id||!modal||!frame)return;
      frame.src=`https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;
      modal.classList.add('show');document.body.classList.add('locked');
    });
  });
}

function updateFilterCounts(){
  $('[data-count="ALL"]')?.replaceChildren(String(PORTFOLIO_VIDEOS.length));
  $$('[data-count]:not([data-count="ALL"])').forEach(el=>el.replaceChildren(String(PORTFOLIO_VIDEOS.filter(v=>String(v.category).toUpperCase()===el.dataset.count).length)));
}

function bindReveals(){
  $$('.reveal:not([data-reveal-bound])').forEach((el,i)=>{el.dataset.revealBound='1';el.style.transitionDelay=`${Math.min(i%4,3)*70}ms`;revealObserver?.observe(el);});
}

renderPortfolioVideos();
updateFilterCounts();

$$('.filter-btn').forEach(btn=>btn.addEventListener('click',()=>{
  activeFilter=btn.dataset.filter||'ALL';
  $$('.filter-btn').forEach(b=>b.classList.toggle('active',b===btn));
  renderPortfolioVideos();
}));

revealObserver=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')}),{threshold:.1});
bindReveals();

const menu=$('.menu'),nav=$('nav');
menu?.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',open)});
$$('nav a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));

const progress=$('.scroll-progress');
addEventListener('scroll',()=>{const h=document.documentElement.scrollHeight-innerHeight;progress.style.width=(h>0?(scrollY/h)*100:0)+'%'},{passive:true});

const glow=$('.cursor-glow');
addEventListener('pointermove',e=>{if(glow){glow.style.left=e.clientX+'px';glow.style.top=e.clientY+'px'}});

// Subtle 3D interaction for the hero card.
const card=$('.edit-card');
$('.hero-art')?.addEventListener('pointermove',e=>{if(!card||matchMedia('(prefers-reduced-motion: reduce)').matches)return;const r=e.currentTarget.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;card.style.transform=`rotateY(${x*7}deg) rotateX(${-y*7}deg) translateZ(8px)`});
$('.hero-art')?.addEventListener('pointerleave',()=>{if(card)card.style.transform=''});

const modal=$('.video-modal'),frame=$('#videoFrame'),close=$('.modal-close');
function closeModal(){modal.classList.remove('show');frame.src='';document.body.classList.remove('locked')}
close?.addEventListener('click',closeModal);modal?.addEventListener('click',e=>{if(e.target===modal)closeModal()});addEventListener('keydown',e=>{if(e.key==='Escape')closeModal()});

$('.back-top')?.addEventListener('click',()=>scrollTo({top:0,behavior:'smooth'}));

document.querySelector('#briefForm')?.addEventListener('submit',e=>{e.preventDefault();const name=$('#name').value.trim(),project=$('#project').value,platform=$('#platform').value.trim()||'Not specified',goal=$('#goal').value.trim();const subject=encodeURIComponent(`TRIVEX EDIT Project Brief — ${project}`);const body=encodeURIComponent(`Hi TRIVEX EDIT,\n\nName: ${name}\nProject: ${project}\nPlatform: ${platform}\nDetails: ${goal}\n\nI'd like to discuss this project.`);location.href=`mailto:shaurya121518@gmail.com?subject=${subject}&body=${body}`});

document.querySelector('[data-year]')?.replaceChildren(new Date().getFullYear());
