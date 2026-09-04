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
