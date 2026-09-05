document.documentElement.classList.add('js');
const $=(s,p=document)=>p.querySelector(s),$$=(s,p=document)=>[...p.querySelectorAll(s)];

const revealObserver=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')}),{threshold:.1});
$$('.reveal').forEach((el,i)=>{el.style.transitionDelay=`${Math.min(i%4,3)*70}ms`;revealObserver.observe(el)});

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

// Lightweight tilt for work cards.
$$('.work-card').forEach(el=>{el.addEventListener('pointermove',e=>{if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;const r=el.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;el.style.transform=`perspective(900px) rotateY(${x*4}deg) rotateX(${-y*4}deg) translateY(-4px)`});el.addEventListener('pointerleave',()=>el.style.transform='')});

const modal=$('.video-modal'),frame=$('#videoFrame'),close=$('.modal-close');
$$('[data-video]').forEach(card=>card.addEventListener('click',e=>{e.preventDefault();const id=card.dataset.video;if(!id)return;frame.src=`https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;modal.classList.add('show');document.body.classList.add('locked')}));
function closeModal(){modal.classList.remove('show');frame.src='';document.body.classList.remove('locked')}
close?.addEventListener('click',closeModal);modal?.addEventListener('click',e=>{if(e.target===modal)closeModal()});addEventListener('keydown',e=>{if(e.key==='Escape')closeModal()});

$('.back-top')?.addEventListener('click',()=>scrollTo({top:0,behavior:'smooth'}));

document.querySelector('#briefForm')?.addEventListener('submit',e=>{e.preventDefault();const name=$('#name').value.trim(),project=$('#project').value,platform=$('#platform').value.trim()||'Not specified',goal=$('#goal').value.trim();const subject=encodeURIComponent(`TRIVEX EDIT Project Brief — ${project}`);const body=encodeURIComponent(`Hi TRIVEX EDIT,\n\nName: ${name}\nProject: ${project}\nPlatform: ${platform}\nDetails: ${goal}\n\nI'd like to discuss this project.`);location.href=`mailto:shaurya121518@gmail.com?subject=${subject}&body=${body}`});

document.querySelector('[data-year]')?.replaceChildren(new Date().getFullYear());
