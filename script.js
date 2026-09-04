const $=(s,p=document)=>p.querySelector(s),$$=(s,p=document)=>[...p.querySelectorAll(s)];

const revealObserver=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')}),{threshold:.1});
$$('.reveal').forEach((el,i)=>{el.style.transitionDelay=`${Math.min(i%4,3)*70}ms`;revealObserver.observe(el)});

const menu=$('.menu'),nav=$('nav');
menu?.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',open);menu.textContent=open?'×':'☰'});
$$('nav a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menu.textContent='☰'}));

const progress=$('.scroll-progress'),back=$('.back-top'),sections=$$('main section[id]'),links=$$('nav a');
function scrollUI(){
 const max=document.documentElement.scrollHeight-innerHeight;
 if(progress)progress.style.width=`${max>0?scrollY/max*100:0}%`;
 let current='home';sections.forEach(s=>{if(scrollY>=s.offsetTop-180)current=s.id});
 links.forEach(a=>a.classList.toggle('active',a.getAttribute('href')===`#${current}`));
 back?.classList.toggle('show',scrollY>700);
}
addEventListener('scroll',scrollUI,{passive:true});scrollUI();
back?.addEventListener('click',()=>scrollTo({top:0,behavior:'smooth'}));

const glow=$('.cursor-glow');
if(matchMedia('(pointer:fine)').matches){addEventListener('pointermove',e=>{glow.style.opacity='1';glow.style.left=e.clientX+'px';glow.style.top=e.clientY+'px'});addEventListener('pointerleave',()=>glow.style.opacity='0')}

const modal=$('.video-modal'),frame=$('#videoFrame');
function closeVideo(){modal.classList.remove('show');frame.src='';document.body.classList.remove('locked')}
$$('[data-video]').forEach(card=>card.addEventListener('click',e=>{e.preventDefault();frame.src=`https://www.youtube-nocookie.com/embed/${card.dataset.video}?autoplay=1&rel=0`;modal.classList.add('show');document.body.classList.add('locked')}));
$('.modal-close')?.addEventListener('click',closeVideo);modal?.addEventListener('click',e=>{if(e.target===modal)closeVideo()});addEventListener('keydown',e=>{if(e.key==='Escape')closeVideo()});
$$('[data-year]').forEach(el=>el.textContent=new Date().getFullYear());


// V7 interactions
const cursor=$('.magnetic-cursor');
if(cursor && matchMedia('(pointer:fine)').matches){
  window.addEventListener('mousemove',e=>{cursor.style.left=e.clientX+'px';cursor.style.top=e.clientY+'px';cursor.style.opacity='.8'});
  $$('.btn,.nav-cta,.work-card,.service').forEach(el=>{
    el.addEventListener('mouseenter',()=>cursor.style.transform='translate(-50%,-50%) scale(2.2)');
    el.addEventListener('mouseleave',()=>cursor.style.transform='translate(-50%,-50%) scale(1)');
  });
}
const brief=$('#briefForm');
if(brief){brief.addEventListener('submit',e=>{
  e.preventDefault();
  const name=$('#name').value.trim(), project=$('#project').value, platform=$('#platform').value.trim(), goal=$('#goal').value.trim();
  const subject=encodeURIComponent('TRIVEX EDIT — New Project Brief');
  const body=encodeURIComponent(`Hi TRIVEX EDIT,\n\nName: ${name}\nProject: ${project}\nPlatform: ${platform || 'Not specified'}\n\nProject details:\n${goal}`);
  window.location.href=`mailto:shaurya121518@gmail.com?subject=${subject}&body=${body}`;
});}

// V8 premium interactions
addEventListener('load',()=>setTimeout(()=>$('.preloader')?.classList.add('done'),650));
const fine=matchMedia('(pointer:fine)').matches;
if(fine){
  const magneticEls=$$('.magnetic');
  magneticEls.forEach(el=>{
    el.addEventListener('mousemove',e=>{const r=el.getBoundingClientRect();const x=e.clientX-r.left-r.width/2,y=e.clientY-r.top-r.height/2;el.style.transform=`translate(${x*.12}px,${y*.12}px)`});
    el.addEventListener('mouseleave',()=>el.style.transform='');
  });
}
// Active section highlight and smoother mobile menu state
$$('nav a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false')}));
// Subtle 3D tilt on the timeline card
if(fine){const card=$('.timeline-card');card?.addEventListener('mousemove',e=>{const r=card.getBoundingClientRect();const rx=((e.clientY-r.top)/r.height-.5)*-4,ry=((e.clientX-r.left)/r.width-.5)*4;card.style.transform=`perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`});card?.addEventListener('mouseleave',()=>card.style.transform='')}
