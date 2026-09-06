const apps=[['☀️','Weather'],['📷','Camera'],['🗺️','Maps'],['🎵','Music'],['💬','Messages'],['☎️','Phone'],['🌐','Safari'],['📝','Notes'],['📅','Calendar'],['🧭','Compass'],['🛍️','Store'],['⚙️','Settings']];
const dock=[['☎️','Phone'],['💬','Messages'],['🌐','Safari'],['🎵','Music']];
const grid=document.querySelector('#appGrid'), dockEl=document.querySelector('#dock');
const makeApp=([emoji,name])=>{const b=document.createElement('button');b.className='app';b.innerHTML=`<span class="icon">${emoji}</span><span>${name}</span>`;b.addEventListener('click',()=>toast(`${name} selected`));return b};
apps.forEach(a=>grid.appendChild(makeApp(a)));dock.forEach(a=>dockEl.appendChild(makeApp(a)));
const timeEl=document.querySelector('#time'),clockEl=document.querySelector('#clock');
function updateTime(){const d=new Date();const t=d.toLocaleTimeString([], {hour:'numeric',minute:'2-digit'});timeEl.textContent=t;clockEl.textContent=t}updateTime();setInterval(updateTime,1000);
function toast(text){let t=document.querySelector('.toast');if(!t){t=document.createElement('div');t.className='toast';document.querySelector('.phone').appendChild(t)}t.textContent=text;t.classList.add('show');clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>t.classList.remove('show'),1300)}
const hero=document.querySelector('#hero');
window.addEventListener('pointermove',e=>{const r=document.querySelector('.phone').getBoundingClientRect();const x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;hero.style.transform=`perspective(700px) rotateX(${y*-2}deg) rotateY(${x*2}deg)`});
window.addEventListener('pointerleave',()=>hero.style.transform='');
document.querySelector('#focusBtn').addEventListener('click',()=>{document.body.classList.toggle('focus');toast(document.body.classList.contains('focus')?'Focus mode on':'Focus mode off')});
// Subtle touch parallax for mobile.
window.addEventListener('deviceorientation',e=>{if(e.gamma==null)return;const x=Math.max(-8,Math.min(8,e.gamma)),y=Math.max(-8,Math.min(8,e.beta-45));document.querySelector('.wallpaper').style.transform=`translate(${x/4}px,${y/4}px) scale(1.04)`});