const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const grid=$("#workGrid"), filters=$("#filters"), empty=$("#empty"), modal=$("#modal"), player=$("#player"), error=$("#videoError");
let active="All";

function card(v,i){
  const el=document.createElement("article"); el.className="project reveal";
  const thumb=v.thumbnail?`style="background-image:url('${v.thumbnail}')"`:"";
  el.innerHTML=`<div class="thumb" ${thumb}><span class="project-no">${String(i+1).padStart(2,"0")}</span><button class="project-play">▶</button><span class="project-type">${v.category}</span></div><div class="project-info"><h3>${v.title}</h3><p>${v.description}</p><button class="view-btn">View project ↗</button></div>`;
  el.querySelector(".project-play").onclick=()=>openVideo(v.video);
  el.querySelector(".view-btn").onclick=()=>openVideo(v.video);
  return el;
}
function render(){
  grid.innerHTML="";
  const list=videos.filter(v=>active==="All"||v.category===active);
  empty.style.display=list.length?"none":"block";
  list.forEach((v,i)=>grid.appendChild(card(v,i)));
  $$(".reveal").forEach(el=>observer.observe(el));
}
function setupFilters(){
  const cats=["All",...new Set(videos.map(v=>v.category))];
  filters.innerHTML=cats.map(c=>`<button class="${c===active?"active":""}">${c}</button>`).join("");
  $$(".filters button").forEach(b=>b.onclick=()=>{active=b.textContent;setupFilters();render()});
}
function openVideo(src){
  modal.classList.add("open"); error.style.display="none"; player.style.display="block";
  player.src=src||""; player.load();
  player.play().catch(()=>{});
  player.onerror=()=>{player.style.display="none";error.style.display="grid"};
}
$("#close").onclick=()=>{modal.classList.remove("open");player.pause();player.removeAttribute("src");player.load()};
modal.onclick=e=>{if(e.target===modal)$("#close").click()};
document.addEventListener("keydown",e=>{if(e.key==="Escape")$("#close").click()});

const progress=$("#progress");
addEventListener("scroll",()=>{const m=document.documentElement.scrollHeight-innerHeight;progress.style.width=(m?scrollY/m*100:0)+"%"});
const menu=$("#menu"), nav=$("#nav"); menu.onclick=()=>nav.classList.toggle("open"); $$("nav a").forEach(a=>a.onclick=()=>nav.classList.remove("open"));
const observer=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("show");observer.unobserve(e.target)}}),{threshold:.1});
$$(".reveal").forEach(e=>observer.observe(e));
setupFilters();render();
