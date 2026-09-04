const $=(s,p=document)=>p.querySelector(s);
const $$=(s,p=document)=>[...p.querySelectorAll(s)];

const observer=new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')});
},{threshold:.12});
$$('.reveal').forEach(el=>observer.observe(el));

const menu=$('.menu'),nav=$('nav');
menu?.addEventListener('click',()=>{
  const open=nav.classList.toggle('open');
  menu.setAttribute('aria-expanded',open);
  menu.setAttribute('aria-label',open?'Close menu':'Open menu');
});
$$('nav a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));

const progress=$('.scroll-progress'),sections=$$('main section[id]'),links=$$('nav a'),backTop=$('.back-top');
function onScroll(){
  const max=document.documentElement.scrollHeight-innerHeight;
  if(progress)progress.style.width=`${max>0?(scrollY/max)*100:0}%`;
  let current='home';
  sections.forEach(sec=>{if(scrollY>=sec.offsetTop-180)current=sec.id});
  links.forEach(a=>a.classList.toggle('active',a.getAttribute('href')===`#${current}`));
  backTop?.classList.toggle('show',scrollY>650);
}
window.addEventListener('scroll',onScroll,{passive:true});
onScroll();

backTop?.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));

const modal=$('.video-modal'),frame=$('#videoFrame');
const closeModal=()=>{
  modal?.classList.remove('show');
  if(frame)frame.src='';
  document.body.classList.remove('locked');
};
$$('[data-video]').forEach(card=>card.addEventListener('click',e=>{
  e.preventDefault();
  const id=card.dataset.video;
  if(!modal||!frame)return;
  frame.src=`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`;
  modal.classList.add('show');
  document.body.classList.add('locked');
}));
$('.modal-close')?.addEventListener('click',closeModal);
modal?.addEventListener('click',e=>{if(e.target===modal)closeModal()});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal()});
$$('[data-year]').forEach(el=>el.textContent=new Date().getFullYear());
