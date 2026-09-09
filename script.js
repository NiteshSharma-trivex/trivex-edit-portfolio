const demoProjects=[
 {id:'d1',title:'Cinematic Anime Edit',category:'anime',url:'https://www.youtube.com/',thumb:'',desc:'Music-driven anime edit with dramatic pacing and typography.'},
 {id:'d2',title:'Gaming Highlight Reel',category:'gaming',url:'https://www.youtube.com/',thumb:'',desc:'Fast cuts, impact transitions and sound design for gameplay.'},
 {id:'d3',title:'Creator Short — Episode 01',category:'shorts',url:'https://www.youtube.com/',thumb:'',desc:'Hook-first short-form edit designed for retention.'},
 {id:'d4',title:'YouTube Story Edit',category:'youtube',url:'https://www.youtube.com/',thumb:'',desc:'Long-form creator edit with clean storytelling and rhythm.'},
 {id:'d5',title:'Neon Motion Sequence',category:'shorts',url:'https://www.youtube.com/',thumb:'',desc:'Motion graphics, kinetic text and energetic transitions.'},
 {id:'d6',title:'Anime Motivation',category:'anime',url:'https://www.youtube.com/',thumb:'',desc:'Emotional visual edit combining music, quotes and atmosphere.'}
];
const key='trivex_v851_projects';
let projects=JSON.parse(localStorage.getItem(key)||'null')||demoProjects;
if(!localStorage.getItem(key))fetch('projects.json').then(r=>r.ok?r.json():null).then(d=>{if(Array.isArray(d)){projects=d;render();renderManager()}}).catch(()=>{});
const grid=document.getElementById('workGrid'), empty=document.getElementById('empty'), manager=document.getElementById('managerList');
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function ytId(url){try{const u=new URL(url);if(u.hostname.includes('youtu.be'))return u.pathname.slice(1).split('/')[0];if(u.hostname.includes('youtube.com'))return u.searchParams.get('v')||u.pathname.split('/').filter(Boolean).pop()}catch(e){}return null}
function thumbFor(p){if(p.thumb)return p.thumb;const id=ytId(p.url);return id?`https://i.ytimg.com/vi/${encodeURIComponent(id)}/hqdefault.jpg`:''}
function render(filter='all'){
 const list=filter==='all'?projects:projects.filter(p=>p.category===filter);
 grid.innerHTML=list.map(p=>`<article class="work-card" data-id="${esc(p.id)}"><div class="thumb" style="${thumbFor(p)?`background-image:url('${esc(thumbFor(p))}')`:''}"><span class="category">${esc(p.category).toUpperCase()}</span></div><div class="work-info"><h3>${esc(p.title)}</h3><p>${esc(p.desc||'TRIVEX EDIT project')}</p></div></article>`).join('');
 empty.style.display=list.length?'none':'block';
 document.querySelectorAll('.work-card').forEach(c=>c.onclick=()=>{const p=projects.find(x=>x.id===c.dataset.id);if(p?.url)window.open(p.url,'_blank','noopener')});
}
function save(){localStorage.setItem(key,JSON.stringify(projects));render(document.querySelector('#filters .selected')?.dataset.filter||'all');renderManager()}
function renderManager(){
 manager.innerHTML=projects.map(p=>`<div class="manager-item"><div><b>${esc(p.title)}</b><br><small>${esc(p.category)}</small></div><button class="delete" data-del="${esc(p.id)}">Delete</button></div>`).join('');
 manager.querySelectorAll('[data-del]').forEach(b=>b.onclick=()=>{projects=projects.filter(p=>p.id!==b.dataset.del);save();toast('Project removed')})
}
document.getElementById('filters').addEventListener('click',e=>{if(e.target.tagName!=='BUTTON')return;document.querySelectorAll('#filters button').forEach(b=>b.classList.remove('selected'));e.target.classList.add('selected');render(e.target.dataset.filter)});
document.getElementById('projectForm').addEventListener('submit',e=>{
 e.preventDefault();
 const p={id:Date.now().toString(),title:pTitle.value.trim(),category:pCategory.value,url:pUrl.value.trim(),thumb:pThumb.value.trim(),desc:pDesc.value.trim()};
 projects.unshift(p);save();e.target.reset();toast('Project added');document.getElementById('adminModal').classList.remove('show');document.getElementById('work').scrollIntoView({behavior:'smooth'})
});
document.getElementById('exportProjects').onclick=()=>{
 const blob=new Blob([JSON.stringify(projects,null,2)],{type:'application/json'});
 const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='projects.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);toast('projects.json exported')
};
document.getElementById('importProjects').onclick=()=>document.getElementById('projectFile').click();
document.getElementById('projectFile').addEventListener('change',e=>{
 const f=e.target.files[0];if(!f)return;const r=new FileReader();
 r.onload=()=>{try{const data=JSON.parse(r.result);if(!Array.isArray(data))throw new Error();projects=data;save();toast('Projects imported')}catch(err){toast('Invalid projects.json')}};r.readAsText(f);e.target.value=''
});
document.getElementById('resetProjects').onclick=()=>{if(confirm('Reset to the V8.5 demo projects?')){projects=demoProjects.map(x=>({...x}));save();toast('Demo projects restored')}};
const modal=document.getElementById('adminModal');
document.getElementById('adminTrigger').onclick=()=>{renderManager();modal.classList.add('show')};
document.getElementById('closeModal').onclick=()=>modal.classList.remove('show');
modal.onclick=e=>{if(e.target===modal)modal.classList.remove('show')};
document.getElementById('menu').onclick=()=>document.getElementById('nav').classList.toggle('open');
document.querySelectorAll('.nav a').forEach(a=>a.onclick=()=>document.getElementById('nav').classList.remove('open'));
function toast(t){const x=document.getElementById('toast');x.textContent=t;x.classList.add('show');setTimeout(()=>x.classList.remove('show'),2200)}
const observer=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(x=>observer.observe(x));
const navLinks=[...document.querySelectorAll('.nav a')],sections=[...document.querySelectorAll('main section[id]')];
window.addEventListener('scroll',()=>{let current='home';sections.forEach(s=>{if(scrollY>=s.offsetTop-150)current=s.id});navLinks.forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+current))},{passive:true});
render();renderManager();
