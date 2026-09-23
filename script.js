const demoProjects=[
 {id:'d1',title:'Cinematic Anime Edit',category:'anime',url:'https://www.youtube.com/',thumb:'',desc:'Music-driven anime edit with dramatic pacing and typography.'},
 {id:'d2',title:'Gaming Highlight Reel',category:'gaming',url:'https://www.youtube.com/',thumb:'',desc:'Fast cuts, impact transitions and sound design for gameplay.'},
 {id:'d3',title:'Creator Short — Episode 01',category:'shorts',url:'https://www.youtube.com/',thumb:'',desc:'Hook-first short-form edit designed for retention.'},
 {id:'d4',title:'YouTube Story Edit',category:'youtube',url:'https://www.youtube.com/',thumb:'',desc:'Long-form creator edit with clean storytelling and rhythm.'},
 {id:'d5',title:'Neon Motion Sequence',category:'shorts',url:'https://www.youtube.com/',thumb:'',desc:'Motion graphics, kinetic text and energetic transitions.'},
 {id:'d6',title:'Anime Motivation',category:'anime',url:'https://www.youtube.com/',thumb:'',desc:'Emotional visual edit combining music, quotes and atmosphere.'}
];
const key='trivex_v851_projects';
const githubDefaults={owner:'niteshsharma-trivex',repo:'trivex-edit-portfolio',branch:'main',path:'projects.json'};
let projects=JSON.parse(localStorage.getItem(key)||'null')||demoProjects;
const pendingVideoFiles=new Map();
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
function getFormProject(){
 const id=Date.now().toString();
 const file=document.getElementById('pVideo')?.files?.[0]||null;
 if(file) pendingVideoFiles.set(id,file);
 return {id,title:pTitle.value.trim(),category:pCategory.value,url:pUrl.value.trim(),thumb:pThumb.value.trim(),desc:pDesc.value.trim()};
}
function addProjectFromForm(){
 const p=getFormProject();
 if(!p.title||(!p.url&&!pendingVideoFiles.has(p.id))){toast('Add a video URL or choose a video file');return false}
 projects.unshift(p);save();document.getElementById('projectForm').reset();return true;
}
document.getElementById('projectForm').addEventListener('submit',e=>{
 e.preventDefault();
 if(!addProjectFromForm())return;
 toast('Project added');document.getElementById('adminModal').classList.remove('show');document.getElementById('work').scrollIntoView({behavior:'smooth'});
});
document.getElementById('addPublish').onclick=()=>{
 if(!addProjectFromForm())return;
 document.getElementById('adminModal').classList.remove('show');openPublishModal();
};
document.getElementById('publishProjects').onclick=()=>openPublishModal();
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
const publishModal=document.getElementById('publishModal');
const publishStatus=document.getElementById('publishStatus');
function openPublishModal(){
 document.getElementById('ghOwner').value=githubDefaults.owner;
 document.getElementById('ghRepo').value=githubDefaults.repo;
 document.getElementById('ghBranch').value=githubDefaults.branch;
 document.getElementById('ghToken').value='';
 publishStatus.textContent='';publishStatus.className='publish-status';publishModal.classList.add('show');
}
function closePublishModal(){publishModal.classList.remove('show')}
document.getElementById('closePublish').onclick=closePublishModal;
publishModal.onclick=e=>{if(e.target===publishModal)closePublishModal()};
document.getElementById('openTokenHelp').onclick=()=>window.open('https://github.com/settings/personal-access-tokens','_blank','noopener');
function toBase64Unicode(text){
 const bytes=new TextEncoder().encode(text);let binary='';const chunk=0x8000;
 for(let i=0;i<bytes.length;i+=chunk)binary+=String.fromCharCode(...bytes.subarray(i,i+chunk));
 return btoa(binary);
}
async function toBase64File(file){
 const buffer=await file.arrayBuffer();
 const bytes=new Uint8Array(buffer);
 let binary='';const chunk=0x8000;
 for(let i=0;i<bytes.length;i+=chunk)binary+=String.fromCharCode(...bytes.subarray(i,i+chunk));
 return btoa(binary);
}
function safeVideoName(file){
 const base=file.name.replace(/[^a-zA-Z0-9._-]+/g,'-').replace(/-+/g,'-').replace(/^-|-$/g,'');
 return base||('video-'+Date.now()+'.mp4');
}
async function uploadVideoFile(owner,repo,branch,token,p,file,setStatus,headers){
 if(file.size>95*1024*1024) throw new Error('Video file is over 95 MB. Use a smaller/compressed video or a hosted video URL.');
 const filename=`videos/${Date.now()}-${safeVideoName(file)}`;
 const api=`https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/contents/${filename}`;
 setStatus(`Uploading ${file.name}…`);
 const content=await toBase64File(file);
 const body={message:`Add portfolio video: ${p.title}`,content,branch};
 const put=await fetch(api,{method:'PUT',headers,body:JSON.stringify(body)});
 const data=await put.json().catch(()=>({}));
 if(!put.ok) throw new Error(data.message||`Video upload failed (${put.status})`);
 p.url=`./${filename}`;
 return p;
}
async function publishToGitHub(){
 const owner=document.getElementById('ghOwner').value.trim();
 const repo=document.getElementById('ghRepo').value.trim();
 const branch=document.getElementById('ghBranch').value.trim()||'main';
 const token=document.getElementById('ghToken').value.trim();
 if(!owner||!repo||!token){publishStatus.textContent='Please enter owner, repository and GitHub token.';publishStatus.className='publish-status error';return}
 const setStatus=(msg,ok=false)=>{publishStatus.textContent=msg;publishStatus.className='publish-status '+(ok?'success':'')};
 const headers={Accept:'application/vnd.github+json',Authorization:'Bearer '+token,'X-GitHub-Api-Version':'2022-11-28','Content-Type':'application/json'};
 const api=`https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/contents/${githubDefaults.path}`;
 try{
  setStatus('Checking repository…');
  const get=await fetch(api+`?ref=${encodeURIComponent(branch)}`,{headers});
  let sha=null;
  if(get.ok){const data=await get.json();sha=data.sha}
  else if(get.status!==404){const data=await get.json().catch(()=>({}));throw new Error(data.message||`GitHub error ${get.status}`)}
  for(const p of projects){
   const file=pendingVideoFiles.get(p.id);
   if(file){
    await uploadVideoFile(owner,repo,branch,token,p,file,setStatus,headers);
    pendingVideoFiles.delete(p.id);
   }
  }
  const content=toBase64Unicode(JSON.stringify(projects,null,2)+'\n');
  setStatus('Publishing your projects…');
  const body={message:`Update TRIVEX EDIT portfolio projects`,content,branch};if(sha)body.sha=sha;
  const put=await fetch(api,{method:'PUT',headers,body:JSON.stringify(body)});
  const data=await put.json().catch(()=>({}));
  if(!put.ok)throw new Error(data.message||`GitHub error ${put.status}`);
  setStatus('Published successfully. Your GitHub Pages site will update shortly.',true);
  toast('Portfolio published live');
 }catch(err){setStatus('Publish failed: '+err.message+' — check your token, repo and branch.',false)}
}
document.getElementById('confirmPublish').onclick=publishToGitHub;
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
